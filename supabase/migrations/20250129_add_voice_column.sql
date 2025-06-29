-- Add voice column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS voice TEXT DEFAULT 'alloy';

-- Update existing agents to have a default voice
UPDATE agents SET voice = 'alloy' WHERE voice IS NULL; 