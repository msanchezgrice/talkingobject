'use client';

import { DatabaseAgent } from '@/lib/database/server-agents';
import { PlaceholderAgent } from '@/lib/placeholder-agents';
import ChatInterface from '@/components/agent/ChatInterface';
import AgentInfo from '@/components/agent/AgentInfo';
import AgentTweets from '@/components/agent/AgentTweets';

// Convert DatabaseAgent to PlaceholderAgent format for compatibility
function convertToPlaceholderAgent(agent: DatabaseAgent): PlaceholderAgent {
  return {
    id: agent.id,
    name: agent.name,
    slug: agent.slug,
    personality: agent.personality,
    description: agent.description || '',
    interests: agent.interests || [],
    latitude: agent.latitude || 0,
    longitude: agent.longitude || 0,
    image_url: agent.image_url || '',
    data_sources: agent.data_sources || [],
    // Default values for PlaceholderAgent fields not in ClerkDatabaseAgent
    location: 'Austin',
    coordinates: agent.latitude && agent.longitude ? `${agent.latitude}° N, ${agent.longitude}° W` : '0° N, 0° W',
    twitter_handle: '',
    likes: [],
    dislikes: [],
    fun_facts: [],
    category: 'businesses', // Default category
    created_at: agent.created_at,
    last_updated: agent.updated_at,
    is_active: agent.is_active,
    user_id: agent.auth_user_id || '',
  };
}

interface ClientAgentPageProps {
  agent: DatabaseAgent;
}

export default function ClientAgentPage({ agent }: ClientAgentPageProps) {
  console.log('🎨 [CLIENT] ClientAgentPage rendering with agent:', agent.name);
  console.log('🎨 [CLIENT] Agent data:', { 
    id: agent.id, 
    slug: agent.slug, 
    name: agent.name,
    hasDescription: !!agent.description,
    isActive: agent.is_active 
  });
  
  const placeholderAgent = convertToPlaceholderAgent(agent);
  console.log('🔄 [CLIENT] Converted to placeholder format:', placeholderAgent.name);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <AgentInfo agent={placeholderAgent} />
          <div className="mt-8">
            <AgentTweets agent={placeholderAgent} />
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          <ChatInterface agent={placeholderAgent} />
        </div>
      </div>
    </div>
  );
} 