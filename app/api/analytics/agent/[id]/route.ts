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
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const agentId = params.id;
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

    // Get analytics summary using the database function
    const { data: analyticsData, error: analyticsError } = await supabase
      .rpc('get_agent_analytics_summary', { p_agent_id: agentId });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
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