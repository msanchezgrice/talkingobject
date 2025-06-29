-- Add voice column to agents table
-- Run this in the Supabase SQL Editor

-- Add the voice column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'agents' 
        AND column_name = 'voice'
    ) THEN
        ALTER TABLE agents ADD COLUMN voice TEXT DEFAULT 'alloy';
        
        -- Update existing agents to have a default voice
        UPDATE agents SET voice = 'alloy' WHERE voice IS NULL;
        
        -- Log the change
        RAISE NOTICE 'Voice column added to agents table successfully';
    ELSE
        RAISE NOTICE 'Voice column already exists in agents table';
    END IF;
END $$; 