import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Agent, Message } from '@/lib/supabase/types';
import { chatLLM, AIMessage } from '@/lib/aiProvider';

// Define types for external data
interface NewsArticle {
  title: string;
  source: string;
  description?: string;
  url?: string;
  publishedAt?: string;
}

interface Event {
  name: string;
  venue: string;
  date: string;
  time?: string;
  url?: string;
  location?: string;
}

interface StockData {
  symbol: string;
  price: number;
  change?: number;
  changePercent: string;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { conversationId, message, agentId } = body;
    
    if (!conversationId || !message || !agentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Fetch the agent data
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();
      
    if (agentError || !agentData) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    const agent = agentData as Agent;
    
    // Fetch the conversation history
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (messagesError) {
      return NextResponse.json(
        { error: 'Failed to fetch conversation history' },
        { status: 500 }
      );
    }
    
    const messages = messagesData as Message[];
    
    // Prepare external data if agent has data sources enabled
    let externalData = '';
    
    if (agent.data_sources && agent.data_sources.length > 0) {
      // In a real app, you would fetch the actual data from the APIs
      // This is a simplified example
      externalData = await fetchExternalData(agent);
    }
    
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

// Fetch external data based on agent's data sources
async function fetchExternalData(agent: Agent): Promise<string> {
  let data = '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // Fetch weather data if agent has weather data source and location
    if (agent.data_sources.includes('weather') && agent.latitude && agent.longitude) {
      try {
        const weatherResponse = await fetch(
          `${baseUrl}/api/external/weather?lat=${agent.latitude}&lon=${agent.longitude}`,
          { next: { revalidate: 3600 } } // Cache for 1 hour
        );
        
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          data += `**Current Weather in ${weatherData.location}**: ${weatherData.temperature.current}°${weatherData.temperature.unit}, ${weatherData.condition.description}, ${weatherData.humidity}% humidity.\n\n`;
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        data += `**Weather**: Data currently unavailable.\n\n`;
      }
    }
    
    // Fetch news if agent has news data source
    if (agent.data_sources.includes('news')) {
      try {
        // If agent has location, add it as a query parameter
        let queryParam = '';
        if (agent.latitude && agent.longitude) {
          // Use a reverse geocoding service in a real app
          // This is a simplified approach
          queryParam = 'local';
        }
        
        const newsResponse = await fetch(
          `${baseUrl}/api/external/news${queryParam ? `?q=${queryParam}` : ''}`,
          { next: { revalidate: 7200 } } // Cache for 2 hours
        );
        
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          data += `**Recent News Headlines**:\n`;
          
          newsData.articles.slice(0, 3).forEach((article: NewsArticle) => {
            data += `- ${article.title} (${article.source})\n`;
          });
          
          data += '\n';
        }
      } catch (error) {
        console.error('Error fetching news data:', error);
        data += `**News**: Data currently unavailable.\n\n`;
      }
    }
    
    // Fetch events if agent has events data source and location
    if (agent.data_sources.includes('events') && agent.latitude && agent.longitude) {
      try {
        const eventsResponse = await fetch(
          `${baseUrl}/api/external/events?lat=${agent.latitude}&lon=${agent.longitude}`,
          { next: { revalidate: 86400 } } // Cache for 24 hours
        );
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          
          if (eventsData.events && eventsData.events.length > 0) {
            data += `**Upcoming Events**:\n`;
            
            eventsData.events.slice(0, 3).forEach((event: Event) => {
              data += `- ${event.name} at ${event.venue} (${event.date})\n`;
            });
            
            data += '\n';
          } else {
            data += `**Events**: No upcoming events found in this area.\n\n`;
          }
        }
      } catch (error) {
        console.error('Error fetching events data:', error);
        data += `**Events**: Data currently unavailable.\n\n`;
      }
    }
    
    // Fetch stocks if agent has stocks data source
    if (agent.data_sources.includes('stocks')) {
      try {
        // Default popular stocks
        const defaultSymbols = 'AAPL,MSFT,GOOGL,AMZN,TSLA';
        
        const stocksResponse = await fetch(
          `${baseUrl}/api/external/stocks?symbols=${defaultSymbols}`,
          { next: { revalidate: 3600 } } // Cache for 1 hour
        );
        
        if (stocksResponse.ok) {
          const stocksData = await stocksResponse.json();
          
          if (stocksData.data && stocksData.data.length > 0) {
            data += `**Current Market Data**:\n`;
            
            stocksData.data.forEach((stock: StockData) => {
              if (!stock.error) {
                data += `- ${stock.symbol}: $${stock.price.toFixed(2)} (${stock.changePercent})\n`;
              }
            });
            
            data += '\n';
          }
        }
      } catch (error) {
        console.error('Error fetching stocks data:', error);
        data += `**Stocks**: Data currently unavailable.\n\n`;
      }
    }
    
    return data || 'No external data available.';
    
  } catch (error) {
    console.error('Error in fetchExternalData:', error);
    return 'External data temporarily unavailable.';
  }
} 