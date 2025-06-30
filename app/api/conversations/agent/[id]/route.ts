import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

interface ConversationMessage {
  role: string;
  content: string;
  created_at: string;
  conversation_id: string;
}

async function generateConversationPreview(messages: ConversationMessage[]): Promise<string> {
  if (!messages || messages.length === 0) {
    return 'No messages in this conversation';
  }

  // Take first few messages to generate preview
  const messagesToSummarize = messages.slice(0, 6).map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates brief, engaging summaries of conversations. Create a 1-2 sentence preview that captures the main topic or question the user was asking about. Keep it concise and informative."
        },
        {
          role: "user",
          content: `Please create a brief preview of this conversation:\n\n${messagesToSummarize}`
        }
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Conversation about various topics';
  } catch (error) {
    console.error('Error generating conversation preview:', error);
    // Fallback to first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    return firstUserMessage ? firstUserMessage.content.substring(0, 100) + '...' : 'No preview available';
  }
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

    console.log('Conversation History Debug:');
    console.log('- User ID:', userId);
    console.log('- Agent ID:', agentId);

    // Verify the user owns this agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name, clerk_user_id')
      .eq('id', agentId)
      .eq('clerk_user_id', userId)
      .single();

    console.log('- Agent query result:', { agent, agentError });

    if (agentError || !agent) {
      console.log('- Agent not found or unauthorized');
      return NextResponse.json({ error: 'Agent not found or unauthorized' }, { status: 404 });
    }

    // Get ALL conversation sessions for this agent (including anonymous users)
    // Since the user owns the agent, they can see all conversations with their agent
    const { data: sessions, error: sessionsError } = await supabase
      .from('conversation_sessions')
      .select(`
        id,
        conversation_id,
        started_at,
        last_activity_at,
        message_count,
        summary,
        is_active,
        user_id
      `)
      .eq('agent_id', agentId)
      .order('last_activity_at', { ascending: false })
      .range(offset, offset + limit - 1);

    console.log('- Sessions query result:', { 
      sessionsCount: sessions?.length || 0, 
      sessionsError,
      sessionsData: sessions?.map(s => ({ id: s.id, user_id: s.user_id, message_count: s.message_count }))
    });

    if (sessionsError) {
      console.error('Error fetching conversation sessions:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    // Get conversation messages for preview generation
    const conversationIds = (sessions || []).map(s => s.conversation_id);
    
    const { data: messages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select('conversation_id, content, role, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
    }

    // Group messages by conversation_id
    const messagesByConversation = new Map<string, ConversationMessage[]>();
    (messages || []).forEach(msg => {
      if (!messagesByConversation.has(msg.conversation_id)) {
        messagesByConversation.set(msg.conversation_id, []);
      }
      messagesByConversation.get(msg.conversation_id)?.push(msg);
    });

    // Generate previews for each conversation
    const conversationsWithPreviews = await Promise.all(
      (sessions || []).map(async (session) => {
        const conversationMessages = messagesByConversation.get(session.conversation_id) || [];
        const userPreview = await generateConversationPreview(conversationMessages);
        
        return {
          id: session.id,
          conversationId: session.conversation_id,
          startedAt: session.started_at,
          lastActivityAt: session.last_activity_at,
          messageCount: session.message_count,
          summary: session.summary || 'No summary available',
          isActive: session.is_active,
          userPreview
        };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithPreviews,
      count: conversationsWithPreviews.length,
      hasMore: conversationsWithPreviews.length === limit
    });

  } catch (error) {
    console.error('Error in conversation history API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 