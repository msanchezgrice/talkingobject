'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getAgentBySlug, PlaceholderAgent } from '@/lib/placeholder-agents';
import ChatInterface from '@/components/agent/ChatInterface';
import AgentInfo from '@/components/agent/AgentInfo';
import AgentTweets from '@/components/agent/AgentTweets';

export default function AgentPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [agent, setAgent] = useState<PlaceholderAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the agent by slug
    if (!slug) {
      setError('Invalid slug');
      setLoading(false);
      return;
    }
    
    const foundAgent = getAgentBySlug(slug);
    
    if (foundAgent) {
      setAgent(foundAgent);
    } else {
      setError('Agent not found');
    }
    
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error || !agent) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AgentTweets agent={agent} />
          
          <ChatInterface agent={agent} />
        </div>
        
        <div>
          <AgentInfo agent={agent} />
        </div>
      </div>
    </div>
  );
} 