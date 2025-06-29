import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export interface AgentAnalytics {
  agentId: string;
  totalConversations: number;
  totalMessages: number;
  uniqueUsers: number;
  totalTweets: number;
  conversationsLast24h: number;
  messagesLast24h: number;
  uniqueUsersLast24h: number;
  averageConversationLength: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: agentId } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify the user owns this agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name, clerk_user_id')
      .eq('id', agentId)
      .eq('clerk_user_id', userId)
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found or unauthorized' }, { status: 404 });
    }

    // Get analytics summary using the database function (with fallback)
    let analyticsData;
    try {
      const { data, error } = await supabase
        .rpc('get_agent_analytics_summary', { p_agent_id: agentId });
      
      if (error) {
        console.log('Analytics function not available, using fallback calculation');
        throw error;
      }
      analyticsData = data;
              } catch (error) {
       // Fallback: Calculate analytics directly from conversation_sessions table
       console.log('Using fallback analytics calculation:', error);
      
      const { data: conversationData, error: convError } = await supabase
        .from('conversation_sessions')
        .select('conversation_id, user_id, message_count, created_at')
        .eq('agent_id', agentId);

      if (convError) {
        console.error('Error fetching conversation data:', convError);
        // Return zeros if no data available
        analyticsData = [{
          total_conversations_all_time: 0,
          total_messages_all_time: 0,
          unique_users_all_time: 0,
          total_tweets_all_time: 0,
          conversations_last_24h: 0,
          messages_last_24h: 0,
          unique_users_last_24h: 0
        }];
      } else {
        // Calculate metrics from conversation data
        const uniqueConversations = new Set();
        const uniqueUsers = new Set();
        let messagesLast24h = 0;
        let totalMessages = 0;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        (conversationData || []).forEach(session => {
          uniqueConversations.add(session.conversation_id);
          if (session.user_id) {
            uniqueUsers.add(session.user_id);
          }
          totalMessages += session.message_count || 0;
          
          if (new Date(session.created_at) > oneDayAgo) {
            messagesLast24h += session.message_count || 0;
          }
        });

        // Count unique conversations in last 24h
        const recentConversations = new Set();
        (conversationData || []).forEach(session => {
          if (new Date(session.created_at) > oneDayAgo) {
            recentConversations.add(session.conversation_id);
          }
        });

        // Get tweet count
        const { data: tweetData } = await supabase
          .from('tweet_queue')
          .select('id')
          .eq('agent_id', agentId)
          .not('posted_at', 'is', null);

        analyticsData = [{
          total_conversations_all_time: uniqueConversations.size,
          total_messages_all_time: totalMessages,
          unique_users_all_time: uniqueUsers.size,
          total_tweets_all_time: (tweetData || []).length,
          conversations_last_24h: recentConversations.size,
          messages_last_24h: messagesLast24h,
          unique_users_last_24h: 0 // Would need more complex calculation
        }];
      }
    }

    const analytics = analyticsData?.[0] || {
      total_conversations_all_time: 0,
      total_messages_all_time: 0,
      unique_users_all_time: 0,
      total_tweets_all_time: 0,
      conversations_last_24h: 0,
      messages_last_24h: 0,
      unique_users_last_24h: 0
    };

    // Get average conversation length from recent data
    const { data: avgData } = await supabase
      .from('agent_analytics')
      .select('average_conversation_length')
      .eq('agent_id', agentId)
      .order('date', { ascending: false })
      .limit(7);

    const averageConversationLength = avgData && avgData.length > 0
      ? avgData.reduce((sum, row) => sum + (row.average_conversation_length || 0), 0) / avgData.length
      : 0;

    const response: AgentAnalytics = {
      agentId,
      totalConversations: Number(analytics.total_conversations_all_time),
      totalMessages: Number(analytics.total_messages_all_time),
      uniqueUsers: Number(analytics.unique_users_all_time),
      totalTweets: Number(analytics.total_tweets_all_time),
      conversationsLast24h: Number(analytics.conversations_last_24h),
      messagesLast24h: Number(analytics.messages_last_24h),
      uniqueUsersLast24h: Number(analytics.unique_users_last_24h),
      averageConversationLength: Number(averageConversationLength.toFixed(1))
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in agent analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 