import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const analyticsMigrationSQL = `
-- Analytics and Chat History Migration
-- Run this SQL in your Supabase SQL editor

-- Agent Analytics Table
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
        -- All time stats from conversation_messages
        COALESCE(COUNT(DISTINCT cm.conversation_id), 0) as total_conversations_all_time,
        COALESCE(COUNT(cm.id), 0) as total_messages_all_time,
        COALESCE(COUNT(DISTINCT cm.user_id), 0) as unique_users_all_time,
        -- Tweets from tweet_queue
        COALESCE((SELECT COUNT(*) FROM tweet_queue WHERE agent_id = p_agent_id AND posted_at IS NOT NULL), 0) as total_tweets_all_time,
        -- Last 24 hours stats
        COALESCE(COUNT(DISTINCT CASE WHEN cm.created_at >= NOW() - INTERVAL '24 hours' THEN cm.conversation_id END), 0) as conversations_last_24h,
        COALESCE(COUNT(CASE WHEN cm.created_at >= NOW() - INTERVAL '24 hours' THEN cm.id END), 0) as messages_last_24h,
        COALESCE(COUNT(DISTINCT CASE WHEN cm.created_at >= NOW() - INTERVAL '24 hours' THEN cm.user_id END), 0) as unique_users_last_24h
    FROM conversation_messages cm
    WHERE cm.agent_id = p_agent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Write the SQL to a file
const outputPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250129_analytics_and_chat_history.sql');
fs.writeFileSync(outputPath, analyticsMigrationSQL);

console.log('✅ Analytics migration SQL created!');
console.log('📁 File location:', outputPath);
console.log('');
console.log('📋 Next steps:');
console.log('1. Open your Supabase dashboard');
console.log('2. Go to SQL Editor');
console.log('3. Copy and paste the SQL from the file above');
console.log('4. Run the SQL to create analytics tables and functions');
console.log('');
console.log('🚀 Once complete, your analytics and conversation history features will be ready!'); 