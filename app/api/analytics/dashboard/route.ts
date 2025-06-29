import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export interface DashboardAnalytics {
  totalAgents: number;
  totalChats: number;
  chatsLast24h: number;
  totalTweets: number;
  activeAgents: number;
  topPerformingAgent?: {
    id: string;
    name: string;
    chats: number;
  };
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    // Get user's agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, name, is_active')
      .eq('clerk_user_id', userId);

    if (agentsError) {
      console.error('Error fetching user agents:', agentsError);
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }

    const agentIds = (agents || []).map(a => a.id);
    const totalAgents = agents?.length || 0;
    const activeAgents = agents?.filter(a => a.is_active).length || 0;

    if (agentIds.length === 0) {
      return NextResponse.json({
        totalAgents: 0,
        totalChats: 0,
        chatsLast24h: 0,
        totalTweets: 0,
        activeAgents: 0
      });
    }

    // Get total conversations across all user's agents using conversation_sessions
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversation_sessions')
      .select('agent_id, conversation_id, message_count, created_at')
      .in('agent_id', agentIds);

    if (conversationError) {
      console.error('Error fetching conversation data:', conversationError);
    }

    console.log('Dashboard Analytics Debug:');
    console.log('- Agent IDs:', agentIds);
    console.log('- Conversation data count:', (conversationData || []).length);
    console.log('- Sample conversation data:', conversationData?.slice(0, 2));

    // Calculate unique conversations and recent activity
    const uniqueConversations = new Set();
    const recentConversations = new Set();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    (conversationData || []).forEach(session => {
      uniqueConversations.add(session.conversation_id);
      if (new Date(session.created_at) > oneDayAgo) {
        recentConversations.add(session.conversation_id);
      }
    });

    const totalChats = uniqueConversations.size;
    const chatsLast24h = recentConversations.size;

    console.log('- Total unique conversations:', totalChats);
    console.log('- Chats last 24h:', chatsLast24h);

    // Get total tweets across all user's agents
    const { data: tweetData, error: tweetError } = await supabase
      .from('tweet_queue')
      .select('agent_id')
      .in('agent_id', agentIds)
      .not('posted_at', 'is', null);

    if (tweetError) {
      console.error('Error fetching tweet data:', tweetError);
    }

    const totalTweets = tweetData?.length || 0;

    // Get top performing agent (by conversation count)
    const agentConversationCounts = new Map();
    (conversationData || []).forEach(session => {
      const count = agentConversationCounts.get(session.agent_id) || 0;
      agentConversationCounts.set(session.agent_id, count + session.message_count);
    });

    let topPerformingAgent;
    if (agentConversationCounts.size > 0) {
      const [topAgentId, topCount] = [...agentConversationCounts.entries()]
        .sort(([,a], [,b]) => b - a)[0];
      
      const topAgent = agents?.find(a => a.id === topAgentId);
      if (topAgent) {
        topPerformingAgent = {
          id: topAgent.id,
          name: topAgent.name,
          chats: topCount
        };
      }
    }

    const response: DashboardAnalytics = {
      totalAgents,
      totalChats,
      chatsLast24h,
      totalTweets,
      activeAgents,
      topPerformingAgent
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in dashboard analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 