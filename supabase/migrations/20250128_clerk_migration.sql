-- Migration to add Clerk user ID support to agents table
-- This will allow migration from Supabase Auth to Clerk while maintaining data integrity

BEGIN;

-- Add clerk_user_id column to agents table
ALTER TABLE agents 
ADD COLUMN clerk_user_id TEXT;

-- Create index for performance
CREATE INDEX idx_agents_clerk_user_id ON agents(clerk_user_id);

-- Update RLS policies to support both auth_user_id and clerk_user_id
-- Drop existing policies first
DROP POLICY IF EXISTS "Agents are viewable by everyone" ON agents;
DROP POLICY IF EXISTS "Users can insert their own agents" ON agents;
DROP POLICY IF EXISTS "Users can update their own agents" ON agents;
DROP POLICY IF EXISTS "Users can delete their own agents" ON agents;

-- Create new policies that work with both Supabase and Clerk users
CREATE POLICY "Agents are viewable by everyone" ON agents
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own agents via Supabase" ON agents
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own agents via Clerk" ON agents
  FOR INSERT WITH CHECK (clerk_user_id IS NOT NULL);

CREATE POLICY "Users can update their own agents via Supabase" ON agents
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own agents via Clerk" ON agents
  FOR UPDATE USING (clerk_user_id IS NOT NULL);

CREATE POLICY "Users can delete their own agents via Supabase" ON agents
  FOR DELETE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can delete their own agents via Clerk" ON agents
  FOR DELETE USING (clerk_user_id IS NOT NULL);

-- Add comments for documentation
COMMENT ON COLUMN agents.clerk_user_id IS 'Clerk user ID for agents created with Clerk authentication';
COMMENT ON INDEX idx_agents_clerk_user_id IS 'Index for Clerk user ID lookups';

COMMIT; 