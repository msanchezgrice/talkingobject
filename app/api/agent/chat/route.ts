import { NextResponse } from 'next/server';
import { chatLLM, AIMessage } from '@/lib/aiProvider';

// Using AIMessage interface from lib/aiProvider.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, message, agent } = body;
    
    if (!conversationId || !message || !agent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Use the agent data directly from the request (PlaceholderAgent)
    // No need to fetch from database since we're using placeholder data
    
    // For now, we'll use empty conversation history since PlaceholderAgent 
    // conversations are handled client-side. In Phase 3, we'll add proper memory.
    const messages: AIMessage[] = [];
    
    // Skip external data for now since we're using placeholder agents
    // This will be re-enabled in later phases with proper agent data
    const externalData = '';
    
    // Prepare the system prompt
    const systemPrompt = `You are "${agent.name}", an AI agent with the following personality: ${agent.personality}

Your current location is: ${agent.latitude ? `Latitude: ${agent.latitude}, Longitude: ${agent.longitude}` : 'Unknown'}

${externalData ? `Here is some current information you can use in your responses:\n${externalData}` : ''}

You should respond in a way that matches your personality. Be helpful, accurate, and engaging.`;

    // Format messages for AI provider abstraction
    const aiMessages: AIMessage[] = [];
    
    // Add system message
    aiMessages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Add conversation history
    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        aiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }
    
    // Add the current message if it's not already in the history
    if (!messages.some(msg => msg.role === 'user' && msg.content === message)) {
      aiMessages.push({ 
        role: 'user',
        content: message
      });
    }
    
    // Call AI provider abstraction
    const response = await chatLLM(aiMessages);
    const responseText = response.content;
    
    return NextResponse.json({ message: responseText });
    
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