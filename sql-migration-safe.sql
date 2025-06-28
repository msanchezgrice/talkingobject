-- Safe Clerk Migration - Only adds missing components
-- Run this in your Supabase SQL Editor

BEGIN;

-- Create index for clerk_user_id (only if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_agents_clerk_user_id ON agents(clerk_user_id);

-- Update RLS policies to support both auth_user_id and clerk_user_id
-- Drop existing policies first
DROP POLICY IF EXISTS "Agents are viewable by everyone" ON agents;
DROP POLICY IF EXISTS "Users can insert their own agents" ON agents;
DROP POLICY IF EXISTS "Users can update their own agents" ON agents;
DROP POLICY IF EXISTS "Users can delete their own agents" ON agents;

-- Create new hybrid policies that work with both Supabase Auth and Clerk
CREATE POLICY "Agents are viewable by everyone" ON agents
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own agents" ON agents
    FOR INSERT WITH CHECK (
        auth.uid()::text = auth_user_id 
        OR 
        current_setting('request.jwt.claims', true)::json->>'sub' = clerk_user_id
    );

CREATE POLICY "Users can update their own agents" ON agents
    FOR UPDATE USING (
        auth.uid()::text = auth_user_id 
        OR 
        current_setting('request.jwt.claims', true)::json->>'sub' = clerk_user_id
    );

CREATE POLICY "Users can delete their own agents" ON agents
    FOR DELETE USING (
        auth.uid()::text = auth_user_id 
        OR 
        current_setting('request.jwt.claims', true)::json->>'sub' = clerk_user_id
    );

-- Create a function to handle Clerk user creation
CREATE OR REPLACE FUNCTION handle_clerk_user()
RETURNS trigger AS $$
BEGIN
    -- This function can be used later for Clerk webhook integration
    -- For now, it's just a placeholder
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on the agents table (if not already enabled)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

COMMIT; 