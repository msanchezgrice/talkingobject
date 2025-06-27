import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Agent {
  id: string;
  name: string;
}

interface ConversationMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  agent_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  is_memory_worthy: boolean;
  created_at: string;
}

// Generate embeddings using OpenAI
async function generateEmbedding(text: string, openaiApiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Generate summary using OpenAI
async function generateSummary(
  messages: ConversationMessage[],
  agentName: string,
  date: string,
  openaiApiKey: string
): Promise<string> {
  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `Summarize the conversations ${agentName} had today (${date}). Focus on:
- Key topics discussed
- Important user preferences or information learned
- Memorable interactions or requests
- Overall themes or patterns

Conversation log:
${conversationText}

Provide a concise but informative summary (2-3 paragraphs max):`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const summary = data.choices[0].message.content;
  
  if (!summary) {
    throw new Error('No summary generated');
  }

  return summary;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
      throw new Error('Missing required environment variables');
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get yesterday's date (since this runs at 23:50, we want to summarize the day that's ending)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format

    console.log(`Generating daily summaries for ${dateStr}`);

    // Get all agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, name');

    if (agentsError) {
      throw new Error(`Error fetching agents: ${agentsError.message}`);
    }

    if (!agents || agents.length === 0) {
      console.log('No agents found');
      return new Response(
        JSON.stringify({ message: 'No agents found', date: dateStr }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const results = [];

    // Process each agent
    for (const agent of agents as Agent[]) {
      try {
        console.log(`Processing agent: ${agent.name} (${agent.id})`);

        // Check if summary already exists for this date
        const { data: existingSummary } = await supabase
          .from('daily_summaries')
          .select('agent_id')
          .eq('agent_id', agent.id)
          .eq('summary_date', dateStr)
          .single();

        if (existingSummary) {
          console.log(`Summary already exists for ${agent.name} on ${dateStr}`);
          results.push({
            agent_id: agent.id,
            agent_name: agent.name,
            status: 'skipped',
            reason: 'Summary already exists',
          });
          continue;
        }

        // Get all messages for this agent on the target date
        const { data: messages, error: messagesError } = await supabase
          .from('conversation_messages')
          .select('*')
          .eq('agent_id', agent.id)
          .gte('created_at', `${dateStr}T00:00:00Z`)
          .lt('created_at', `${dateStr}T23:59:59Z`)
          .order('created_at');

        if (messagesError) {
          throw new Error(`Error fetching messages for agent ${agent.id}: ${messagesError.message}`);
        }

        if (!messages || messages.length === 0) {
          console.log(`No messages found for ${agent.name} on ${dateStr}`);
          results.push({
            agent_id: agent.id,
            agent_name: agent.name,
            status: 'skipped',
            reason: 'No messages found',
          });
          continue;
        }

        console.log(`Found ${messages.length} messages for ${agent.name}`);

        // Generate summary
        const summary = await generateSummary(
          messages as ConversationMessage[],
          agent.name,
          dateStr,
          openaiApiKey
        );

        // Generate embedding for the summary
        const embedding = await generateEmbedding(summary, openaiApiKey);

        // Store the summary
        const { data: savedSummary, error: summaryError } = await supabase
          .from('daily_summaries')
          .insert({
            agent_id: agent.id,
            summary_date: dateStr,
            summary,
            embedding,
          })
          .select()
          .single();

        if (summaryError) {
          throw new Error(`Error storing summary for agent ${agent.id}: ${summaryError.message}`);
        }

        console.log(`Successfully created summary for ${agent.name}`);
        results.push({
          agent_id: agent.id,
          agent_name: agent.name,
          status: 'success',
          summary_length: summary.length,
          message_count: messages.length,
        });

      } catch (agentError) {
        console.error(`Error processing agent ${agent.name}:`, agentError);
        results.push({
          agent_id: agent.id,
          agent_name: agent.name,
          status: 'error',
          error: agentError instanceof Error ? agentError.message : 'Unknown error',
        });
      }
    }

    console.log(`Daily summary generation completed for ${dateStr}`);
    console.log(`Processed ${results.length} agents`);

    return new Response(
      JSON.stringify({
        message: 'Daily summary generation completed',
        date: dateStr,
        processed_agents: results.length,
        results,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in daily summarizer:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}); 