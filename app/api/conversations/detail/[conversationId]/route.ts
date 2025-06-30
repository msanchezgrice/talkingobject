import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ConversationDetail {
  id: string;
  conversation_id: string;
  started_at: string;
  last_activity_at: string;
  message_count: number;
  is_active: boolean;
  messages: Message[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params;

    const supabase = await createServerSupabaseClient();

    console.log('Conversation Detail Debug:');
    console.log('- User ID:', userId);
    console.log('- Conversation ID:', conversationId);

    // Get the conversation session
    const { data: session, error: sessionError } = await supabase
      .from('conversation_sessions')
      .select(`
        id,
        conversation_id,
        agent_id,
        started_at,
        last_activity_at,
        message_count,
        is_active
      `)
      .eq('conversation_id', conversationId)
      .single();

    console.log('- Session query result:', { session, sessionError });

    if (sessionError || !session) {
      console.log('- Session not found');
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Verify the user owns the agent for this conversation
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name, clerk_user_id')
      .eq('id', session.agent_id)
      .eq('clerk_user_id', userId)
      .single();

    console.log('- Agent query result:', { agent, agentError });

    if (agentError || !agent) {
      console.log('- Agent not found or unauthorized');
      return NextResponse.json({ error: 'Unauthorized - Agent not owned by user' }, { status: 403 });
    }

    // Get all messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select(`
        id,
        role,
        content,
        created_at
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    console.log('- Messages query result:', { 
      messagesCount: messages?.length || 0, 
      messagesError 
    });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    const conversationDetail: ConversationDetail = {
      id: session.id,
      conversation_id: session.conversation_id,
      started_at: session.started_at,
      last_activity_at: session.last_activity_at,
      message_count: session.message_count,
      is_active: session.is_active,
      messages: messages || []
    };

    return NextResponse.json(conversationDetail);

  } catch (error) {
    console.error('Error in conversation detail API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 