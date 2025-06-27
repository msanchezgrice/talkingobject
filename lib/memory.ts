import { createServerSupabaseClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

// Types for memory operations
export interface UserMemory {
  id: string;
  user_id: string;
  agent_id: string;
  key: string;
  value: string;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface DailySummary {
  agent_id: string;
  summary_date: string;
  summary: string;
  embedding?: number[];
  created_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  agent_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  is_memory_worthy: boolean;
  created_at: string;
}

export interface MemorySearchResult {
  key: string;
  value: string;
  similarity: number;
}

export interface SummarySearchResult {
  summary_date: string;
  summary: string;
  similarity: number;
}

export interface MemoryClassification {
  isMemoryWorthy: boolean;
  reason?: string;
  key?: string;
  value?: string;
}

// Lazy initialization for server-side safety
let openai: OpenAI | null = null;

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

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await getOpenAI().embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Classify if a message contains lasting facts worth remembering
export async function classifyMemoryWorthiness(
  userMessage: string,
  agentName: string
): Promise<MemoryClassification> {
  try {
    const prompt = `Analyze this user message in a conversation with ${agentName} and determine if it contains lasting facts worth remembering for future conversations.

User message: "${userMessage}"

Consider these as memory-worthy:
- Personal information (name, preferences, interests, background)
- Important life events or experiences
- Specific plans or intentions
- Relationships and connections
- Skills, knowledge, or expertise mentioned
- Likes, dislikes, or strong opinions
- Places they've been or want to visit
- Goals, dreams, or aspirations

NOT memory-worthy:
- Casual conversation or small talk
- Temporary states (feeling tired, hungry, etc.)
- Current weather or time-specific information
- Simple questions or requests for information
- Acknowledgments or pleasantries

Respond with a JSON object:
{
  "isMemoryWorthy": boolean,
  "reason": "brief explanation why this should/shouldn't be remembered",
  "key": "if memory-worthy, a short descriptive key (e.g., 'name', 'hobby', 'hometown')",
  "value": "if memory-worthy, the specific fact to remember"
}`;

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from classification model');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error classifying memory worthiness:', error);
    return { isMemoryWorthy: false };
  }
}

// Store a memory in the database
export async function storeUserMemory(
  userId: string,
  agentId: string,
  key: string,
  value: string
): Promise<UserMemory | null> {
  try {
    const supabase = createServerSupabaseClient();
    const embedding = await generateEmbedding(`${key}: ${value}`);

    const { data, error } = await supabase
      .from('user_memory')
      .upsert({
        user_id: userId,
        agent_id: agentId,
        key,
        value,
        embedding,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing user memory:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in storeUserMemory:', error);
    return null;
  }
}

// Search user memories using semantic similarity
export async function searchUserMemories(
  userId: string,
  agentId: string,
  query: string,
  limit: number = 3
): Promise<MemorySearchResult[]> {
  try {
    const supabase = createServerSupabaseClient();
    const queryEmbedding = await generateEmbedding(query);

    const { data, error } = await supabase.rpc('search_user_memory', {
      p_user_id: userId,
      p_agent_id: agentId,
      p_query_embedding: queryEmbedding,
      p_limit: limit,
    });

    if (error) {
      console.error('Error searching user memories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchUserMemories:', error);
    return [];
  }
}

// Get recent conversation messages
export async function getRecentMessages(
  conversationId: string,
  limit: number = 20
): Promise<ConversationMessage[]> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting recent messages:', error);
      return [];
    }

    return (data || []).reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error in getRecentMessages:', error);
    return [];
  }
}

// Store a conversation message
export async function storeConversationMessage(
  conversationId: string,
  userId: string,
  agentId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  isMemoryWorthy: boolean = false
): Promise<ConversationMessage | null> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        agent_id: agentId,
        role,
        content,
        is_memory_worthy: isMemoryWorthy,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing conversation message:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in storeConversationMessage:', error);
    return null;
  }
}

// Generate daily summary for an agent
export async function generateDailySummary(
  agentId: string,
  date: string,
  agentName: string
): Promise<DailySummary | null> {
  try {
    const supabase = createServerSupabaseClient();

    // Get all messages for the agent on this date
    const { data: messages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('agent_id', agentId)
      .gte('created_at', `${date}T00:00:00Z`)
      .lt('created_at', `${date}T23:59:59Z`)
      .order('created_at');

    if (messagesError || !messages || messages.length === 0) {
      console.log(`No messages found for agent ${agentId} on ${date}`);
      return null;
    }

    // Generate summary using GPT
    const conversationText = messages
      .map((m: ConversationMessage) => `${m.role}: ${m.content}`)
      .join('\n');

    const prompt = `Summarize the conversations ${agentName} had today (${date}). Focus on:
- Key topics discussed
- Important user preferences or information learned
- Memorable interactions or requests
- Overall themes or patterns

Conversation log:
${conversationText}

Provide a concise but informative summary (2-3 paragraphs max):`;

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const summary = response.choices[0].message.content;
    if (!summary) {
      throw new Error('No summary generated');
    }

    // Generate embedding for the summary
    const embedding = await generateEmbedding(summary);

    // Store the summary
    const { data, error } = await supabase
      .from('daily_summaries')
      .upsert({
        agent_id: agentId,
        summary_date: date,
        summary,
        embedding,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing daily summary:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return null;
  }
}

// Search daily summaries using semantic similarity
export async function searchDailySummaries(
  agentId: string,
  query: string,
  daysBack: number = 7,
  limit: number = 3
): Promise<SummarySearchResult[]> {
  try {
    const supabase = createServerSupabaseClient();
    const queryEmbedding = await generateEmbedding(query);

    const { data, error } = await supabase.rpc('search_daily_summaries', {
      p_agent_id: agentId,
      p_query_embedding: queryEmbedding,
      p_days_back: daysBack,
      p_limit: limit,
    });

    if (error) {
      console.error('Error searching daily summaries:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchDailySummaries:', error);
    return [];
  }
}

// Build context for AI response including memories and summaries
export async function buildConversationContext(
  userId: string,
  agentId: string,
  conversationId: string,
  currentQuery: string
): Promise<{
  memories: MemorySearchResult[];
  summaries: SummarySearchResult[];
  recentMessages: ConversationMessage[];
}> {
  try {
    const [memories, summaries, recentMessages] = await Promise.all([
      searchUserMemories(userId, agentId, currentQuery, 3),
      searchDailySummaries(agentId, currentQuery, 7, 2),
      getRecentMessages(conversationId, 10),
    ]);

    return {
      memories,
      summaries,
      recentMessages,
    };
  } catch (error) {
    console.error('Error building conversation context:', error);
    return {
      memories: [],
      summaries: [],
      recentMessages: [],
    };
  }
}

// Process a user message for memory extraction and storage
export async function processUserMessage(
  userId: string,
  agentId: string,
  conversationId: string,
  userMessage: string,
  agentName: string
): Promise<{
  storedMessage: ConversationMessage | null;
  extractedMemory: UserMemory | null;
  classification: MemoryClassification;
}> {
  try {
    // Classify if the message is memory-worthy
    const classification = await classifyMemoryWorthiness(userMessage, agentName);

    // Store the conversation message
    const storedMessage = await storeConversationMessage(
      conversationId,
      userId,
      agentId,
      'user',
      userMessage,
      classification.isMemoryWorthy
    );

    let extractedMemory: UserMemory | null = null;

    // If memory-worthy, extract and store the memory
    if (classification.isMemoryWorthy && classification.key && classification.value) {
      extractedMemory = await storeUserMemory(
        userId,
        agentId,
        classification.key,
        classification.value
      );
    }

    return {
      storedMessage,
      extractedMemory,
      classification,
    };
  } catch (error) {
    console.error('Error processing user message:', error);
    return {
      storedMessage: null,
      extractedMemory: null,
      classification: { isMemoryWorthy: false },
    };
  }
} 