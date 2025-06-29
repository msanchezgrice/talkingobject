import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Core interfaces for AI provider abstraction
export interface AIMessage { 
  role: 'user' | 'assistant' | 'system'; 
  content: string;
}

export interface LLMTool { 
  name: string; 
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface TTSOptions {
  voice?: string;
  model?: string;
  speed?: number;
}

export interface AIProvider {
  name: string;
  chatLLM(messages: AIMessage[], tools?: LLMTool[], agentLocation?: { lat: number; lon: number }): Promise<AIMessage>;
  textToSpeech?(text: string, options?: TTSOptions): Promise<ArrayBuffer>;
}

// Tool definitions for external data access
export const availableTools: LLMTool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather information for a specific location. If no coordinates provided, uses agent location.',
    parameters: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude coordinate (optional if agent has location)'
        },
        longitude: {
          type: 'number', 
          description: 'Longitude coordinate (optional if agent has location)'
        }
      },
      required: []
    }
  },
  {
    name: 'get_events',
    description: 'Get upcoming events near a specific location. If no coordinates provided, uses agent location.',
    parameters: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude coordinate (optional if agent has location)'
        },
        longitude: {
          type: 'number',
          description: 'Longitude coordinate (optional if agent has location)'
        }
      },
      required: []
    }
  },
  {
    name: 'get_news',
    description: 'Get recent news relevant to a location or topic',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for news (location, topic, or keywords)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_stocks',
    description: 'Get current stock market information',
    parameters: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Stock symbol (e.g., AAPL, TSLA)'
        }
      },
      required: ['symbol']
    }
  }
];

// Tool execution function
async function executeTool(toolCall: ToolCall, agentLocation?: { lat: number; lon: number }): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    switch (toolCall.name) {
      case 'get_weather': {
        const args = toolCall.arguments as { latitude?: number; longitude?: number };
        // Use provided coordinates or fall back to agent location
        const lat = args.latitude || agentLocation?.lat;
        const lon = args.longitude || agentLocation?.lon;
        
        if (!lat || !lon) {
          return 'Weather information requires location coordinates. Please specify a location or ensure the agent has location data.';
        }
        
        const response = await fetch(`${baseUrl}/api/external/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return `Current weather in ${data.location}: ${data.temperature.current}°C, ${data.condition.description}. Feels like ${data.temperature.feelsLike}°C. Humidity: ${data.humidity}%. Wind: ${data.windSpeed} m/s.`;
      }
      
      case 'get_events': {
        const args = toolCall.arguments as { latitude?: number; longitude?: number };
        // Use provided coordinates or fall back to agent location
        const lat = args.latitude || agentLocation?.lat;
        const lon = args.longitude || agentLocation?.lon;
        
        if (!lat || !lon) {
          return 'Event information requires location coordinates. Please specify a location or ensure the agent has location data.';
        }
        
        const response = await fetch(`${baseUrl}/api/external/events?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (data.events.length === 0) return 'No upcoming events found in this area.';
        return `Upcoming events: ${data.events.slice(0, 3).map((e: { name: string; venue: string; date: string }) => `${e.name} at ${e.venue} on ${e.date}`).join('; ')}`;
      }
      
      case 'get_news': {
        const args = toolCall.arguments as { query: string };
        const response = await fetch(`${baseUrl}/api/external/news?q=${encodeURIComponent(args.query)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (data.articles.length === 0) return 'No recent news found for this topic.';
        return `Recent news: ${data.articles.slice(0, 2).map((a: { title: string }) => a.title).join('; ')}`;
      }
      
      case 'get_stocks': {
        const args = toolCall.arguments as { symbol: string };
        const response = await fetch(`${baseUrl}/api/external/stocks?symbol=${args.symbol}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (data.data && data.data.length > 0) {
          const stock = data.data[0];
          if (stock.error) return `Error getting ${args.symbol} stock data: ${stock.error}`;
          return `${stock.symbol}: $${stock.price} (${stock.change > 0 ? '+' : ''}${stock.change} / ${stock.changePercent})`;
        }
        return `No stock data available for ${args.symbol}`;
      }
      
      default:
        return `Unknown tool: ${toolCall.name}`;
    }
  } catch (error) {
    console.error(`Error executing tool ${toolCall.name}:`, error);
    return `Error getting ${toolCall.name} data: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Lazy-initialize providers only on server side
let anthropic: Anthropic | null = null;
let openai: OpenAI | null = null;

const getAnthropic = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Anthropic client should only be used server-side');
  }
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY || '',
    });
  }
  return anthropic;
};

const getOpenAI = () => {
  if (typeof window !== 'undefined') {
    throw new Error('OpenAI client should only be used server-side');
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }
  return openai;
};

// Anthropic Claude provider implementation
export const claudeProvider: AIProvider = {
  name: 'claude',
  async chatLLM(messages: AIMessage[], tools?: LLMTool[], agentLocation?: { lat: number; lon: number }): Promise<AIMessage> {
    try {
      // Convert messages format for Claude API
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');
      
      const claudeMessages = conversationMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // Prepare tools for Claude
      const claudeTools = tools?.map(tool => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters
      }));

      const completion = await getAnthropic().messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: systemMessage?.content || '',
        messages: claudeMessages,
        tools: claudeTools || [],
      });

      // Handle tool calls
      if (completion.content.some(content => content.type === 'tool_use')) {
        const toolCalls: ToolCall[] = [];
        
        for (const content of completion.content) {
          if (content.type === 'tool_use') {
            toolCalls.push({
              id: content.id,
              name: content.name,
              arguments: content.input as Record<string, unknown>
            });
          }
        }

        // Execute tools and get results
        const toolResults = await Promise.all(
          toolCalls.map(async (toolCall) => {
            const result = await executeTool(toolCall, agentLocation);
            return { toolCall, result };
          })
        );

        // Add tool results to conversation and get final response
        const updatedMessages = [
          ...claudeMessages,
          {
            role: 'assistant' as const,
            content: completion.content
          },
          {
            role: 'user' as const,
            content: toolResults.map(tr => tr.result).join('\n\n')
          }
        ];

        const finalCompletion = await getAnthropic().messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          system: systemMessage?.content || '',
          messages: updatedMessages,
          tools: claudeTools || [],
        });

        let finalResponseText = '';
        for (const content of finalCompletion.content) {
          if (content.type === 'text') {
            finalResponseText += content.text;
          }
        }

        return {
          role: 'assistant',
          content: finalResponseText || "I apologize, but I could not generate a proper response."
        };
      }

      // Extract response text (no tools used)
      let responseText = "I apologize, but I could not generate a proper response.";
      if (completion.content && completion.content.length > 0) {
        const firstContent = completion.content[0];
        if (firstContent.type === 'text') {
          responseText = firstContent.text;
        }
      }

      return {
        role: 'assistant',
        content: responseText
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
};

// OpenAI provider implementation
export const openaiProvider: AIProvider = {
  name: 'openai',
  async chatLLM(messages: AIMessage[], tools?: LLMTool[], agentLocation?: { lat: number; lon: number }): Promise<AIMessage> {
    try {
      // Prepare tools for OpenAI
      const openaiTools = tools?.map(tool => ({
        type: 'function' as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      }));

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 2000,
        stream: false,
        tools: openaiTools || undefined,
        tool_choice: tools && tools.length > 0 ? 'auto' : undefined,
      });

      const message = completion.choices[0]?.message;
      
      // Handle tool calls
      if (message?.tool_calls && message.tool_calls.length > 0) {
        // Execute all tool calls
        const toolResults = await Promise.all(
          message.tool_calls.map(async (toolCall) => {
            const result = await executeTool({
              id: toolCall.id,
              name: toolCall.function.name,
              arguments: JSON.parse(toolCall.function.arguments) as Record<string, unknown>
            }, agentLocation);
            
            return {
              tool_call_id: toolCall.id,
              role: 'tool' as const,
              content: result
            };
          })
        );

        // Create follow-up completion with tool results
        const followUpCompletion = await getOpenAI().chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            message,
            ...toolResults
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: false,
        });

        const finalResponseContent = followUpCompletion.choices[0]?.message?.content || 
          "I apologize, but I could not generate a proper response.";

        return {
          role: 'assistant',
          content: finalResponseContent
        };
      }

      const responseContent = message?.content || 
        "I apologize, but I could not generate a proper response.";

      return {
        role: 'assistant',
        content: responseContent
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  },

  async textToSpeech(text: string, options?: TTSOptions): Promise<ArrayBuffer> {
    try {
      const response = await getOpenAI().audio.speech.create({
        model: options?.model || 'tts-1',
        voice: (options?.voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer') || 'alloy',
        input: text,
        speed: options?.speed || 1.0,
      });

      return await response.arrayBuffer();
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw error;
    }
  }
};

// Main function to get the appropriate provider
export function getAIProvider(): AIProvider {
  const useAnthropic = process.env.NEXT_PUBLIC_USE_ANTHROPIC !== 'false';
  return useAnthropic ? claudeProvider : openaiProvider;
}

// Main chat function that uses the configured provider
export async function chatLLM(
  messages: AIMessage[],
  tools?: LLMTool[],
  agentLocation?: { lat: number; lon: number }
): Promise<AIMessage> {
  const provider = getAIProvider();
  return provider.chatLLM(messages, tools, agentLocation);
}

// TTS function that uses OpenAI by default (since Claude doesn't have TTS)
export async function textToSpeech(
  text: string, 
  options?: TTSOptions
): Promise<ArrayBuffer> {
  // Always use OpenAI for TTS since Claude doesn't support it
  return openaiProvider.textToSpeech!(text, options);
} 