'use client';

import { useEffect, useState } from 'react';
import { PlaceholderAgent, getAgentBySlug } from '@/lib/placeholder-agents';
import { VoicePlayer } from '@/components/VoicePlayer';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ChatInterface from './ClientAgentPage';
import { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const agent = getAgentBySlug(params.slug);
  
  if (!agent) {
    return {
      title: 'Agent Not Found',
      description: 'The requested agent could not be found.'
    };
  }

  return {
    title: `${agent.name} - Talking Objects`,
    description: agent.description,
    openGraph: {
      title: agent.name,
      description: agent.description,
      images: [agent.image_url],
    },
  };
}

export default function AgentPage({ params }: PageProps) {
  const [agent, setAgent] = useState<PlaceholderAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgent = () => {
      try {
        const foundAgent = getAgentBySlug(params.slug);
        if (foundAgent) {
          setAgent(foundAgent);
        } else {
          setError('Agent not found');
        }
      } catch (err) {
        console.error('Error loading agent:', err);
        setError('Failed to load agent');
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Agent Not Found</h1>
            <p className="text-gray-400 mb-8">
              The requested agent could not be found. This could be because:
              <br />
              - The agent has been removed or deactivated
              <br />
              - The URL might be incorrect
              <br />
              - You might not have access to this agent
            </p>
            <Link 
              href="/explore"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition-colors"
            >
              Explore Other Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="relative h-64 bg-gray-700">
            <Image
              src={agent.image_url}
              alt={agent.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{agent.name}</h1>
                <p className="text-gray-400">{agent.location}</p>
              </div>
              <VoicePlayer
                text={`Hi, I'm ${agent.name}. ${agent.description}`}
                category={agent.category}
                agentId={agent.slug}
              />
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-3">About</h2>
              <p className="text-gray-300">{agent.description}</p>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {agent.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-3">Fun Facts</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {agent.fun_facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <ChatInterface agent={agent} />
        </div>
      </div>
    </div>
  );
} 