-- Create conversation tracking function (fixed version)
-- Run this in the Supabase SQL Editor

-- First drop the existing function if it exists
DROP FUNCTION IF EXISTS track_conversation_session(text, uuid, uuid);

-- Then create the new function
CREATE OR REPLACE FUNCTION track_conversation_session(
  p_conversation_id TEXT,
  p_agent_id UUID,
  p_user_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert or update conversation session
  INSERT INTO conversation_sessions (
    conversation_id,
    agent_id,
    user_id,
    message_count,
    started_at,
    last_activity_at,
    is_active
  )
  VALUES (
    p_conversation_id,
    p_agent_id,
    p_user_id,
    1,
    NOW(),
    NOW(),
    true
  )
  ON CONFLICT (conversation_id) 
  DO UPDATE SET
    message_count = conversation_sessions.message_count + 1,
    last_activity_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 