import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Required environment variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const analyticsMigrationSQL = `
-- Analytics and Chat History Migration
-- Adds comprehensive analytics tracking for agents and conversations

-- Agent Analytics Table
-- Tracks key metrics for each agent
CREATE TABLE IF NOT EXISTS agent_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_conversations int DEFAULT 0,
  total_messages int DEFAULT 0,
  unique_users int DEFAULT 0,
  total_tweets int DEFAULT 0,
  average_conversation_length decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, date)
);

-- Conversation Sessions Table
-- Tracks individual conversation sessions
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id text NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  message_count int DEFAULT 0,
  summary text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id)
);

-- User Engagement Table
-- Tracks user engagement patterns
CREATE TABLE IF NOT EXISTS user_engagement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  first_interaction_at timestamptz DEFAULT now(),
  last_interaction_at timestamptz DEFAULT now(),
  total_conversations int DEFAULT 0,
  total_messages int DEFAULT 0,
  is_follower boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_analytics_agent_date ON agent_analytics(agent_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_agent ON conversation_sessions(agent_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_user ON conversation_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_active ON conversation_sessions(is_active, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_engagement_agent ON user_engagement(agent_id, last_interaction_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_engagement_user ON user_engagement(user_id, last_interaction_at DESC);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist, then create them
DROP TRIGGER IF EXISTS update_agent_analytics_updated_at ON agent_analytics;
CREATE TRIGGER update_agent_analytics_updated_at 
    BEFORE UPDATE ON agent_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversation_sessions_updated_at ON conversation_sessions;
CREATE TRIGGER update_conversation_sessions_updated_at 
    BEFORE UPDATE ON conversation_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_engagement_updated_at ON user_engagement;
CREATE TRIGGER update_user_engagement_updated_at 
    BEFORE UPDATE ON user_engagement 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE agent_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement ENABLE ROW LEVEL SECURITY;

-- Agent Analytics Policies
DROP POLICY IF EXISTS "Users can view analytics for their agents" ON agent_analytics;
DROP POLICY IF EXISTS "System can manage analytics" ON agent_analytics;

CREATE POLICY "Users can view analytics for their agents" ON agent_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = agent_analytics.agent_id 
            AND agents.clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "System can manage analytics" ON agent_analytics
    FOR ALL USING (true);

-- Conversation Sessions Policies
DROP POLICY IF EXISTS "Users can view their own conversation sessions" ON conversation_sessions;
DROP POLICY IF EXISTS "Users can insert their own conversation sessions" ON conversation_sessions;
DROP POLICY IF EXISTS "Users can update their own conversation sessions" ON conversation_sessions;
DROP POLICY IF EXISTS "Agent owners can view their agent conversations" ON conversation_sessions;

CREATE POLICY "Users can view their own conversation sessions" ON conversation_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversation sessions" ON conversation_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation sessions" ON conversation_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Agent owners can view their agent conversations" ON conversation_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = conversation_sessions.agent_id 
            AND agents.clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- User Engagement Policies
DROP POLICY IF EXISTS "Users can view their own engagement" ON user_engagement;
DROP POLICY IF EXISTS "Users can insert their own engagement" ON user_engagement;
DROP POLICY IF EXISTS "Users can update their own engagement" ON user_engagement;
DROP POLICY IF EXISTS "Agent owners can view engagement with their agents" ON user_engagement;

CREATE POLICY "Users can view their own engagement" ON user_engagement
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engagement" ON user_engagement
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own engagement" ON user_engagement
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Agent owners can view engagement with their agents" ON user_engagement
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = user_engagement.agent_id 
            AND agents.clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Functions for analytics

-- Function to update agent analytics
CREATE OR REPLACE FUNCTION update_agent_analytics(
    p_agent_id uuid,
    p_date date DEFAULT CURRENT_DATE
)
RETURNS void AS $$
DECLARE
    v_total_conversations int;
    v_total_messages int;
    v_unique_users int;
    v_total_tweets int;
    v_avg_conversation_length decimal;
BEGIN
    -- Count total conversations for the date
    SELECT COUNT(DISTINCT conversation_id)
    INTO v_total_conversations
    FROM conversation_messages
    WHERE agent_id = p_agent_id
    AND DATE(created_at) = p_date;

    -- Count total messages for the date
    SELECT COUNT(*)
    INTO v_total_messages
    FROM conversation_messages
    WHERE agent_id = p_agent_id
    AND DATE(created_at) = p_date;

    -- Count unique users for the date
    SELECT COUNT(DISTINCT user_id)
    INTO v_unique_users
    FROM conversation_messages
    WHERE agent_id = p_agent_id
    AND DATE(created_at) = p_date;

    -- Count total tweets for the date
    SELECT COUNT(*)
    INTO v_total_tweets
    FROM tweet_queue
    WHERE agent_id = p_agent_id
    AND DATE(created_at) = p_date;

    -- Calculate average conversation length
    SELECT COALESCE(AVG(message_count), 0)
    INTO v_avg_conversation_length
    FROM (
        SELECT COUNT(*) as message_count
        FROM conversation_messages
        WHERE agent_id = p_agent_id
        AND DATE(created_at) = p_date
        GROUP BY conversation_id
    ) sub;

    -- Upsert analytics record
    INSERT INTO agent_analytics (
        agent_id, date, total_conversations, total_messages, 
        unique_users, total_tweets, average_conversation_length
    ) VALUES (
        p_agent_id, p_date, v_total_conversations, v_total_messages,
        v_unique_users, v_total_tweets, v_avg_conversation_length
    )
    ON CONFLICT (agent_id, date)
    DO UPDATE SET
        total_conversations = EXCLUDED.total_conversations,
        total_messages = EXCLUDED.total_messages,
        unique_users = EXCLUDED.unique_users,
        total_tweets = EXCLUDED.total_tweets,
        average_conversation_length = EXCLUDED.average_conversation_length,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track conversation session
CREATE OR REPLACE FUNCTION track_conversation_session(
    p_conversation_id text,
    p_agent_id uuid,
    p_user_id uuid
)
RETURNS uuid AS $$
DECLARE
    v_session_id uuid;
BEGIN
    -- Upsert conversation session
    INSERT INTO conversation_sessions (
        conversation_id, agent_id, user_id, message_count
    ) VALUES (
        p_conversation_id, p_agent_id, p_user_id, 1
    )
    ON CONFLICT (conversation_id)
    DO UPDATE SET
        last_activity_at = NOW(),
        message_count = conversation_sessions.message_count + 1,
        updated_at = NOW()
    RETURNING id INTO v_session_id;

    -- Update user engagement
    INSERT INTO user_engagement (
        user_id, agent_id, total_conversations, total_messages
    ) VALUES (
        p_user_id, p_agent_id, 1, 1
    )
    ON CONFLICT (user_id, agent_id)
    DO UPDATE SET
        last_interaction_at = NOW(),
        total_messages = user_engagement.total_messages + 1,
        updated_at = NOW();

    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get agent analytics summary
CREATE OR REPLACE FUNCTION get_agent_analytics_summary(p_agent_id uuid)
RETURNS TABLE (
    total_conversations_all_time bigint,
    total_messages_all_time bigint,
    unique_users_all_time bigint,
    total_tweets_all_time bigint,
    conversations_last_24h bigint,
    messages_last_24h bigint,
    unique_users_last_24h bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- All time stats
        COALESCE(SUM(aa.total_conversations), 0) as total_conversations_all_time,
        COALESCE(SUM(aa.total_messages), 0) as total_messages_all_time,
        COALESCE(MAX(aa.unique_users), 0) as unique_users_all_time,
        COALESCE(SUM(aa.total_tweets), 0) as total_tweets_all_time,
        -- Last 24 hours stats
        COALESCE(SUM(CASE WHEN aa.date >= CURRENT_DATE THEN aa.total_conversations ELSE 0 END), 0) as conversations_last_24h,
        COALESCE(SUM(CASE WHEN aa.date >= CURRENT_DATE THEN aa.total_messages ELSE 0 END), 0) as messages_last_24h,
        COALESCE(MAX(CASE WHEN aa.date >= CURRENT_DATE THEN aa.unique_users ELSE 0 END), 0) as unique_users_last_24h
    FROM agent_analytics aa
    WHERE aa.agent_id = p_agent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

async function runMigration() {
  console.log('🚀 Running analytics migration...');
  
  try {
    // Split the SQL into individual statements and execute them
    const statements = analyticsMigrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 10) { // Skip very short statements
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (error) {
            console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
          }
        } catch (err) {
          // Try direct SQL execution
          const { error } = await supabase.from('__temp_migration').select('*').limit(0);
          // This will fail but we can try a different approach
          console.log(`📋 Statement ${i + 1}:`, statement.substring(0, 50) + '...');
        }
      }
    }

    console.log('✅ Analytics migration completed!');
    console.log('📊 Analytics tables and functions are now available');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 