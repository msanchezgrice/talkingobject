import { NextResponse } from 'next/server';
import { chatLLM, AIMessage, availableTools } from '@/lib/aiProvider';
import { 
  processUserMessage,
  buildConversationContext,
  storeConversationMessage 
} from '@/lib/memory';
import { generateLocationContext } from '@/lib/placeholder-agents';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Using AIMessage interface from lib/aiProvider.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, message, agent, locationContext } = body;
    
    if (!conversationId || !message || !agent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Use the agent data directly from the request (PlaceholderAgent)
    // For now, we'll use a placeholder user ID since PlaceholderAgents don't require auth
    const userId = 'anonymous-user'; // TODO: Replace with actual user ID when auth is integrated
    const agentId = agent.id || agent.slug;

    console.log('💬 Processing text chat for agent:', agent.name);
    console.log('💬 User message:', message);
    
    // Check if this is a location-aware conversation
    const isLocationAware = locationContext?.locationAware === true;
    if (isLocationAware) {
      console.log('🗺️ Location-aware chat detected for:', agent.location);
    }

    // Step 1: Process user message for memory extraction
    console.log('🧠 Processing message for memory extraction...');
    let memoryResult = null;
    let conversationContext = null;

    try {
      // Process the user message for memory extraction
      memoryResult = await processUserMessage(
        userId,
        agentId,
        conversationId,
        message,
        agent.name
      );

      console.log('🧠 Memory classification:', memoryResult.classification);
      if (memoryResult.extractedMemory) {
        console.log('💾 Extracted memory:', memoryResult.extractedMemory.key, '=', memoryResult.extractedMemory.value);
      }

      // Build conversation context with memories and summaries
      conversationContext = await buildConversationContext(
        userId,
        agentId,
        conversationId,
        message
      );

      console.log('🧠 Context retrieved:');
      console.log('  - Memories:', conversationContext.memories.length);
      console.log('  - Summaries:', conversationContext.summaries.length);
      console.log('  - Recent messages:', conversationContext.recentMessages.length);

    } catch (memoryError) {
      console.error('Memory processing error (continuing without memory):', memoryError);
      // Continue without memory if there's an error
    }
    
    // Skip external data for now since we're using placeholder agents
    // This will be re-enabled in later phases with proper agent data
    const externalData = '';
    
    // Step 2: Prepare the system prompt with location and memory context
    let systemPrompt = '';
    
    if (isLocationAware) {
      // Use location-aware context for enhanced geo-specific conversations
      systemPrompt = generateLocationContext(agent);
      console.log('🗺️ Using location-aware system prompt');
    } else {
      // Use standard system prompt
      systemPrompt = `You are "${agent.name}", an AI agent with the following personality: ${agent.personality}

Your current location is: ${agent.latitude ? `Latitude: ${agent.latitude}, Longitude: ${agent.longitude}` : 'Unknown'}

${externalData ? `Here is some current information you can use in your responses:\n${externalData}` : ''}

You should respond in a way that matches your personality. Be helpful, accurate, and engaging.`;
    }

    // Add memory context to system prompt if available
    if (conversationContext) {
      if (conversationContext.memories.length > 0) {
        systemPrompt += `\n\nWhat I remember about this user:\n${conversationContext.memories
          .map(m => `- ${m.key}: ${m.value} (relevance: ${Math.round(m.similarity * 100)}%)`)
          .join('\n')}`;
      }

      if (conversationContext.summaries.length > 0) {
        systemPrompt += `\n\nRecent conversation summaries:\n${conversationContext.summaries
          .map(s => `- ${s.summary_date}: ${s.summary}`)
          .join('\n')}`;
      }
    }

    // Add tool usage instructions to system prompt
    systemPrompt += `\n\nYou have access to real-time tools to get current information:
- Weather data for any location
- Local events and activities 
- Recent news updates
- Stock market information

Use these tools when users ask about current conditions, events, news, or market data. Always provide helpful, accurate, and up-to-date information.`;

    // Prepare agent location for tool calls
    const agentLocation = agent.latitude && agent.longitude ? {
      lat: parseFloat(agent.latitude.toString()),
      lon: parseFloat(agent.longitude.toString())
    } : undefined;

    // Format messages for AI provider abstraction
    const aiMessages: AIMessage[] = [];
    
    // Add system message
    aiMessages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Add recent conversation history from memory system if available
    if (conversationContext?.recentMessages) {
      conversationContext.recentMessages.forEach(msg => {
        if (msg.role !== 'system') {
          aiMessages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          });
        }
      });
    }
    
    // Add the current message
    aiMessages.push({ 
      role: 'user',
      content: message
    });
    
    // Step 3: Call AI provider abstraction with tools
    console.log('🧠 Generating AI response with enhanced context and tools...');
    const response = await chatLLM(aiMessages, availableTools, agentLocation);
    const responseText = response.content;

    console.log('🧠 AI Response:', responseText);

    // Step 4: Store the AI response in conversation history
    try {
      await storeConversationMessage(
        conversationId,
        userId,
        agentId,
        'assistant',
        responseText,
        false // AI responses are typically not memory-worthy themselves
      );

      // Step 5: Track analytics for this conversation
      try {
        const supabase = await createServerSupabaseClient();
        
        // Try using the database function first
        try {
          await supabase.rpc('track_conversation_session', {
            p_conversation_id: conversationId,
            p_agent_id: agentId,
            p_user_id: null // Anonymous user
          });
          console.log('📊 Analytics tracked via function for conversation:', conversationId);
        } catch (functionError) {
          console.log('Function not available, using manual tracking:', functionError);
          
          // Fallback: Manual tracking
          const { data: existingSession, error: sessionError } = await supabase
            .from('conversation_sessions')
            .select('id, message_count')
            .eq('conversation_id', conversationId)
            .eq('agent_id', agentId)
            .single();

          if (sessionError && sessionError.code !== 'PGRST116') {
            // Error other than "not found"
            console.error('Error checking conversation session:', sessionError);
          } else if (existingSession) {
            // Update existing session
            await supabase
              .from('conversation_sessions')
              .update({
                last_activity_at: new Date().toISOString(),
                message_count: (existingSession.message_count || 0) + 2, // +2 for user message + AI response
                updated_at: new Date().toISOString()
              })
              .eq('id', existingSession.id);
          } else {
            // Create new session (without user_id since it's anonymous)
            await supabase
              .from('conversation_sessions')
              .insert({
                conversation_id: conversationId,
                agent_id: agentId,
                user_id: null, // Anonymous user
                message_count: 2, // User message + AI response
                started_at: new Date().toISOString(),
                last_activity_at: new Date().toISOString(),
                is_active: true
              });
          }
          console.log('📊 Analytics tracked manually for conversation:', conversationId);
        }
      } catch (analyticsError) {
        console.error('Error tracking analytics (continuing):', analyticsError);
      }
    } catch (storageError) {
      console.error('Error storing AI response (continuing):', storageError);
    }
    
    return NextResponse.json({ 
      message: responseText,
      memory: {
        extracted: memoryResult?.extractedMemory ? true : false,
        memoryCount: conversationContext?.memories.length || 0,
        summariesCount: conversationContext?.summaries.length || 0
      },
      locationAware: isLocationAware
    });
    
  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// External data fetching removed for placeholder agent compatibility
// Will be re-implemented in later phases with proper database integration 