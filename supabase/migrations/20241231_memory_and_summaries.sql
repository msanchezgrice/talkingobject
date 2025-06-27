-- Phase 3: Memory & Daily Summaries Migration
-- Adds persistent memory and daily conversation summaries

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- User Memory Table
-- Stores persistent facts and memories about users
CREATE TABLE IF NOT EXISTS user_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  key text NOT NULL,
  value text NOT NULL,
  embedding vector(1536), -- OpenAI embedding dimension
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id, key)
);

-- Daily Summaries Table
-- Stores daily conversation summaries for each agent
CREATE TABLE IF NOT EXISTS daily_summaries (
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  summary_date date NOT NULL,
  summary text NOT NULL,
  embedding vector(1536), -- OpenAI embedding dimension
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (agent_id, summary_date)
);

-- Conversation Messages Table (if not exists)
-- Enhanced to support memory classification
CREATE TABLE IF NOT EXISTS conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  is_memory_worthy boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_memory_user_agent ON user_memory(user_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_embedding ON user_memory USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_date ON daily_summaries(summary_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_embedding ON daily_summaries USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation ON conversation_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_memory_worthy ON conversation_messages(is_memory_worthy, created_at DESC);

-- Updated_at trigger for user_memory
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_user_memory_updated_at ON user_memory;
CREATE TRIGGER update_user_memory_updated_at 
    BEFORE UPDATE ON user_memory 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create them
DROP POLICY IF EXISTS "Users can view their own memory" ON user_memory;
DROP POLICY IF EXISTS "Users can insert their own memory" ON user_memory;
DROP POLICY IF EXISTS "Users can update their own memory" ON user_memory;
DROP POLICY IF EXISTS "Users can delete their own memory" ON user_memory;

-- User Memory Policies
CREATE POLICY "Users can view their own memory" ON user_memory
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory" ON user_memory
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory" ON user_memory
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory" ON user_memory
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing daily summaries policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view daily summaries" ON daily_summaries;
DROP POLICY IF EXISTS "System can insert daily summaries" ON daily_summaries;
DROP POLICY IF EXISTS "System can update daily summaries" ON daily_summaries;

-- Daily Summaries Policies (readable by all authenticated users)
CREATE POLICY "Authenticated users can view daily summaries" ON daily_summaries
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert daily summaries" ON daily_summaries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update daily summaries" ON daily_summaries
    FOR UPDATE USING (true);

-- Drop existing conversation messages policies if they exist
DROP POLICY IF EXISTS "Users can view their own messages" ON conversation_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON conversation_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON conversation_messages;

-- Conversation Messages Policies
CREATE POLICY "Users can view their own messages" ON conversation_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON conversation_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" ON conversation_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for memory operations
CREATE OR REPLACE FUNCTION search_user_memory(
    p_user_id uuid,
    p_agent_id uuid,
    p_query_embedding vector(1536),
    p_limit int DEFAULT 3
)
RETURNS TABLE (
    key text,
    value text,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        um.key,
        um.value,
        1 - (um.embedding <=> p_query_embedding) as similarity
    FROM user_memory um
    WHERE um.user_id = p_user_id 
    AND um.agent_id = p_agent_id
    AND um.embedding IS NOT NULL
    ORDER BY um.embedding <=> p_query_embedding
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION search_daily_summaries(
    p_agent_id uuid,
    p_query_embedding vector(1536),
    p_days_back int DEFAULT 7,
    p_limit int DEFAULT 3
)
RETURNS TABLE (
    summary_date date,
    summary text,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ds.summary_date,
        ds.summary,
        1 - (ds.embedding <=> p_query_embedding) as similarity
    FROM daily_summaries ds
    WHERE ds.agent_id = p_agent_id
    AND ds.summary_date >= CURRENT_DATE - INTERVAL '%s days' % p_days_back
    AND ds.embedding IS NOT NULL
    ORDER BY ds.embedding <=> p_query_embedding
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 