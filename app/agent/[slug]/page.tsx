import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAgentBySlug } from '@/lib/placeholder-agents';
import ClientAgentPage from './ClientAgentPage';

type AgentPageParams = {
  slug: string;
};

// Generate dynamic metadata for each agent
export async function generateMetadata({ 
  params 
}: { 
  params: AgentPageParams 
}): Promise<Metadata | undefined> {
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

// Simplified page component adhering to Next.js 15 standards
export default async function AgentPage({ 
  params 
}: { 
  params: AgentPageParams
}) {
  const slug = params.slug;
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    return notFound();
  }

  return <ClientAgentPage agent={agent} />;
} 