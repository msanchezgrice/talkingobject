'use client';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAgentBySlug } from '@/lib/placeholder-agents';
import ChatInterface from '@/components/agent/ChatInterface';
import AgentInfo from '@/components/agent/AgentInfo';
import AgentTweets from '@/components/agent/AgentTweets';

// Generate dynamic metadata for each agent
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata | undefined> {
  // Get the agent
  const slug = params.slug;
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    return undefined;
  }
  
  // Truncate description if too long
  const shortDescription = agent.description && agent.description.length > 150 
    ? `${agent.description.substring(0, 147)}...` 
    : agent.description;
  
  return {
    title: `${agent.name} | Talking Objects`,
    description: `Chat with ${agent.name} now! ${shortDescription || ''}`,
    openGraph: {
      title: `${agent.name} | Talking Objects`,
      description: `Chat with ${agent.name} now!`,
      images: [{ url: `/api/og?slug=${slug}`, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${agent.name} | Talking Objects`,
      description: `Chat with ${agent.name} now!`,
      images: [`/api/og?slug=${slug}`],
    },
  };
}

export default function AgentPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <AgentInfo agent={agent} />
          <div className="mt-8">
            <AgentTweets agent={agent} />
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          <ChatInterface agent={agent} />
        </div>
      </div>
    </div>
  );
} 