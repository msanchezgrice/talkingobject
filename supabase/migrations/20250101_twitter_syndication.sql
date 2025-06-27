-- Phase 5: Twitter / X Syndication Migration
-- Adds tweet queue and rate limiting for social media syndication

-- Tweet Queue Table
-- Stores scheduled tweets for agents with timing and retry logic
CREATE TABLE IF NOT EXISTS tweet_queue (
  id bigserial PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  payload text NOT NULL,
  not_before timestamptz NOT NULL DEFAULT now(),
  tried int DEFAULT 0,
  max_retries int DEFAULT 3,
  last_error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  posted_at timestamptz,
  twitter_id text, -- Store the actual tweet ID when posted
  CHECK (tried >= 0 AND tried <= max_retries)
);

-- Rate Limiting Table
-- Tracks API usage to respect Twitter's 300 tweets per 3 hours limit
CREATE TABLE IF NOT EXISTS twitter_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  tweets_posted int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (tweets_posted >= 0 AND tweets_posted <= 300)
);

-- Tweet Analytics Table (Optional)
-- Track performance of syndicated tweets
CREATE TABLE IF NOT EXISTS tweet_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tweet_queue_id bigint REFERENCES tweet_queue(id) ON DELETE CASCADE,
  twitter_id text NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  impressions int DEFAULT 0,
  engagements int DEFAULT 0,
  retweets int DEFAULT 0,
  likes int DEFAULT 0,
  replies int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tweet_queue_ready ON tweet_queue(not_before, tried) WHERE posted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tweet_queue_agent ON tweet_queue(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tweet_queue_status ON tweet_queue(posted_at, tried);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON twitter_rate_limits(window_start, window_end);
CREATE INDEX IF NOT EXISTS idx_tweet_analytics_agent ON tweet_analytics(agent_id, created_at DESC);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist, then create them
DROP TRIGGER IF EXISTS update_tweet_queue_updated_at ON tweet_queue;
CREATE TRIGGER update_tweet_queue_updated_at 
    BEFORE UPDATE ON tweet_queue 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rate_limits_updated_at ON twitter_rate_limits;
CREATE TRIGGER update_rate_limits_updated_at 
    BEFORE UPDATE ON twitter_rate_limits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tweet_analytics_updated_at ON tweet_analytics;
CREATE TRIGGER update_tweet_analytics_updated_at 
    BEFORE UPDATE ON tweet_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE tweet_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweet_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "System can manage tweet queue" ON tweet_queue;
DROP POLICY IF EXISTS "System can manage rate limits" ON twitter_rate_limits;
DROP POLICY IF EXISTS "System can manage tweet analytics" ON tweet_analytics;
DROP POLICY IF EXISTS "Authenticated users can view tweet queue" ON tweet_queue;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON tweet_analytics;

-- Tweet Queue Policies (system-managed but viewable by authenticated users)
CREATE POLICY "System can manage tweet queue" ON tweet_queue
    FOR ALL USING (true);

CREATE POLICY "Authenticated users can view tweet queue" ON tweet_queue
    FOR SELECT USING (auth.role() = 'authenticated');

-- Rate Limits Policies (system-only)
CREATE POLICY "System can manage rate limits" ON twitter_rate_limits
    FOR ALL USING (true);

-- Analytics Policies
CREATE POLICY "System can manage tweet analytics" ON tweet_analytics
    FOR ALL USING (true);

CREATE POLICY "Authenticated users can view analytics" ON tweet_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

-- Helper Functions

-- Function to get current rate limit window
CREATE OR REPLACE FUNCTION get_current_rate_limit_window()
RETURNS TABLE (
    window_start timestamptz,
    window_end timestamptz,
    tweets_posted int,
    remaining int
) AS $$
DECLARE
    current_window_start timestamptz;
    current_window_end timestamptz;
    current_tweets int;
BEGIN
    -- Calculate 3-hour window boundaries
    current_window_start := date_trunc('hour', now()) - 
                           (EXTRACT(hour FROM now())::int % 3) * interval '1 hour';
    current_window_end := current_window_start + interval '3 hours';
    
    -- Get or create current window
    SELECT tweets_posted INTO current_tweets
    FROM twitter_rate_limits
    WHERE window_start = current_window_start
    AND window_end = current_window_end;
    
    -- If no window exists, create it
    IF current_tweets IS NULL THEN
        INSERT INTO twitter_rate_limits (window_start, window_end, tweets_posted)
        VALUES (current_window_start, current_window_end, 0);
        current_tweets := 0;
    END IF;
    
    RETURN QUERY SELECT 
        current_window_start as window_start,
        current_window_end as window_end,
        current_tweets as tweets_posted,
        GREATEST(0, 300 - current_tweets) as remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment rate limit counter
CREATE OR REPLACE FUNCTION increment_rate_limit_counter()
RETURNS boolean AS $$
DECLARE
    current_window_start timestamptz;
    current_window_end timestamptz;
    current_tweets int;
BEGIN
    -- Get current window
    SELECT window_start, window_end, tweets_posted 
    INTO current_window_start, current_window_end, current_tweets
    FROM get_current_rate_limit_window();
    
    -- Check if we can post (under 300 limit)
    IF current_tweets >= 300 THEN
        RETURN false;
    END IF;
    
    -- Increment counter
    UPDATE twitter_rate_limits 
    SET tweets_posted = tweets_posted + 1
    WHERE window_start = current_window_start
    AND window_end = current_window_end;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get ready tweets for posting
CREATE OR REPLACE FUNCTION get_ready_tweets(batch_size int DEFAULT 10)
RETURNS TABLE (
    id bigint,
    agent_id uuid,
    payload text,
    tried int
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tq.id,
        tq.agent_id,
        tq.payload,
        tq.tried
    FROM tweet_queue tq
    WHERE tq.not_before <= now()
    AND tq.posted_at IS NULL
    AND tq.tried < tq.max_retries
    ORDER BY random() -- Randomize to avoid patterns
    LIMIT batch_size
    FOR UPDATE SKIP LOCKED; -- Prevent concurrent processing
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 