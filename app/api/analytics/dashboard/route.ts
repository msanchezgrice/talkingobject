import { NextRequest, NextResponse } from 'next/server';
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

    // Get total conversations across all user's agents
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversation_messages')
      .select('agent_id, conversation_id, created_at')
      .in('agent_id', agentIds);

    if (conversationError) {
      console.error('Error fetching conversation data:', conversationError);
    }

    // Calculate unique conversations
    const uniqueConversations = new Set();
    let chatsLast24h = 0;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    (conversationData || []).forEach(msg => {
      uniqueConversations.add(msg.conversation_id);
      if (new Date(msg.created_at) > oneDayAgo) {
        chatsLast24h++;
      }
    });

    const totalChats = uniqueConversations.size;

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
    (conversationData || []).forEach(msg => {
      const count = agentConversationCounts.get(msg.agent_id) || 0;
      agentConversationCounts.set(msg.agent_id, count + 1);
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