import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAgentBySlug } from '@/lib/placeholder-agents';
import ClientAgentPage from './ClientAgentPage';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate dynamic metadata for each agent
export async function generateMetadata({ params }: PageProps): Promise<Metadata | undefined> {
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

// Use the proper Next.js 15 page props interface
export default async function AgentPage({ params }: PageProps) {
  const slug = params.slug;
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    return notFound();
  }

  return <ClientAgentPage agent={agent} />;
} 