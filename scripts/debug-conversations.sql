-- Debug conversation data
-- Run this in Supabase SQL Editor to see what's in the tables

-- Check conversation_sessions table
SELECT 
  'conversation_sessions' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT agent_id) as unique_agents,
  COUNT(DISTINCT conversation_id) as unique_conversations
FROM conversation_sessions;

-- Check conversation_messages table  
SELECT 
  'conversation_messages' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT agent_id) as unique_agents,
  COUNT(DISTINCT conversation_id) as unique_conversations
FROM conversation_messages;

-- Show recent conversation sessions
SELECT 
  cs.id,
  cs.conversation_id,
  cs.agent_id,
  cs.message_count,
  cs.created_at,
  cs.is_active,
  a.name as agent_name,
  a.clerk_user_id
FROM conversation_sessions cs
LEFT JOIN agents a ON cs.agent_id = a.id
ORDER BY cs.created_at DESC
LIMIT 10;

-- Show recent conversation messages
SELECT 
  cm.id,
  cm.conversation_id,
  cm.agent_id,
  cm.role,
  LEFT(cm.content, 50) as content_preview,
  cm.created_at,
  a.name as agent_name
FROM conversation_messages cm
LEFT JOIN agents a ON cm.agent_id = a.id
ORDER BY cm.created_at DESC
LIMIT 10; 