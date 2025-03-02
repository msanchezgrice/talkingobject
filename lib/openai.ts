// OpenAI API integration

// This function connects to the OpenAI API and generates a response based on the agent's personality and context
export async function generateOpenAIResponse({
  prompt,
  agentPersonality,
  agentInterests,
  chatHistory,
  systemPrompt
}: {
  prompt: string;
  agentPersonality: string;
  agentInterests: string[];
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt?: string;
}) {
  try {
    // Check if we have an API key
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "OpenAI API key is not configured. Please add your key to the environment variables.",
        fallbackResponse: `I'd love to respond to "${prompt}" based on my personality and interests, but my creator hasn't connected me to the OpenAI API yet.`
      };
    }

    // Build the system prompt
    const defaultSystemPrompt = `You are an AI assistant with the following personality: ${agentPersonality}. 
You have expertise in: ${agentInterests.join(', ')}. 
Keep your responses concise, helpful, and in character.`;

    // Prepare messages
    const messages = [
      {
        role: 'system',
        content: systemPrompt || defaultSystemPrompt
      },
      // Add chat history (limited to last 10 messages to avoid token limits)
      ...chatHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add the current user prompt
      {
        role: 'user',
        content: prompt
      }
    ];

    // Make the API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Unknown error occurred');
    }

    const data = await response.json();
    return {
      success: true,
      response: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackResponse: `I apologize, but I encountered an error processing your request. As a fallback, I'd say that based on my personality, I would typically provide a thoughtful response about "${prompt}".`
    };
  }
} 