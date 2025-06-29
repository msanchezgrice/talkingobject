import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export interface ConversationSummary {
  id: string;
  conversationId: string;
  startedAt: string;
  lastActivityAt: string;
  messageCount: number;
  summary: string;
  isActive: boolean;
  userPreview: string; // First few words from user
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

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

    // Get conversation sessions for this agent
    const { data: sessions, error: sessionsError } = await supabase
      .from('conversation_sessions')
      .select(`
        id,
        conversation_id,
        started_at,
        last_activity_at,
        message_count,
        summary,
        is_active
      `)
      .eq('agent_id', agentId)
      .order('last_activity_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (sessionsError) {
      console.error('Error fetching conversation sessions:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    // Get first user message for each conversation to create preview
    const conversationIds = (sessions || []).map(s => s.conversation_id);
    
    const { data: firstMessages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select('conversation_id, content')
      .in('conversation_id', conversationIds)
      .eq('role', 'user')
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching first messages:', messagesError);
    }

    // Create a map of conversation_id to first user message
    const firstMessageMap = new Map();
    (firstMessages || []).forEach(msg => {
      if (!firstMessageMap.has(msg.conversation_id)) {
        firstMessageMap.set(msg.conversation_id, msg.content);
      }
    });

    // Transform sessions into conversation summaries
    const conversations: ConversationSummary[] = (sessions || []).map(session => ({
      id: session.id,
      conversationId: session.conversation_id,
      startedAt: session.started_at,
      lastActivityAt: session.last_activity_at,
      messageCount: session.message_count,
      summary: session.summary || 'No summary available',
      isActive: session.is_active,
      userPreview: firstMessageMap.get(session.conversation_id)?.substring(0, 100) || 'No preview available'
    }));

    return NextResponse.json({
      conversations,
      count: conversations.length,
      hasMore: conversations.length === limit
    });

  } catch (error) {
    console.error('Error in conversation history API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 