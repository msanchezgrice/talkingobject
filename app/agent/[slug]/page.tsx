import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Agent } from '@/lib/supabase/types';
import ChatInterface from '@/components/agent/ChatInterface';
import AgentInfo from '@/components/agent/AgentInfo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient();
  
  // Fetch the agent
  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', params.slug)
    .single();
    
  if (!data) {
    return {
      title: 'Agent Not Found',
      description: 'The requested agent could not be found.',
    };
  }
  
  return {
    title: `Chat with ${data.name} | Talking Objects`,
    description: data.personality.substring(0, 150) + '...',
  };
}

export default async function AgentPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient();
  
  // Fetch the agent
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', params.slug)
    .single();
  
  if (error || !data) {
    return notFound();
  }
  
  const agent = data as Agent;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChatInterface agent={agent} />
        </div>
        
        <div>
          <AgentInfo agent={agent} />
        </div>
      </div>
    </div>
  );
} 