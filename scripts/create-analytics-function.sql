-- Create analytics function for conversation tracking
-- Run this in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_agent_analytics_summary(p_agent_id UUID)
RETURNS TABLE(
  total_conversations_all_time BIGINT,
  total_messages_all_time BIGINT,
  unique_users_all_time BIGINT,
  total_tweets_all_time BIGINT,
  conversations_last_24h BIGINT,
  messages_last_24h BIGINT,
  unique_users_last_24h BIGINT
) AS $$
DECLARE
  one_day_ago TIMESTAMP WITH TIME ZONE := NOW() - INTERVAL '24 hours';
BEGIN
  RETURN QUERY
  WITH conversation_stats AS (
    SELECT 
      COUNT(DISTINCT cs.conversation_id) as total_conversations,
      COALESCE(SUM(cs.message_count), 0) as total_messages,
      COUNT(DISTINCT cs.user_id) as unique_users,
      COUNT(DISTINCT CASE WHEN cs.created_at > one_day_ago THEN cs.conversation_id END) as conversations_24h,
      COALESCE(SUM(CASE WHEN cs.created_at > one_day_ago THEN cs.message_count ELSE 0 END), 0) as messages_24h,
      COUNT(DISTINCT CASE WHEN cs.created_at > one_day_ago THEN cs.user_id END) as users_24h
    FROM conversation_sessions cs
    WHERE cs.agent_id = p_agent_id
  ),
  tweet_stats AS (
    SELECT COUNT(*) as total_tweets
    FROM tweet_queue tq
    WHERE tq.agent_id = p_agent_id 
    AND tq.posted_at IS NOT NULL
  )
  SELECT 
    cs.total_conversations,
    cs.total_messages,
    cs.unique_users,
    ts.total_tweets,
    cs.conversations_24h,
    cs.messages_24h,
    cs.users_24h
  FROM conversation_stats cs
  CROSS JOIN tweet_stats ts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 