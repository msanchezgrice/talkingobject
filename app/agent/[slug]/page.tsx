import { Metadata } from 'next';
import { getAgentBySlug } from '@/lib/placeholder-agents';
import AgentPage from './AgentPage';

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
    title: `${agent.name} - Talking Object`,
    description: agent.description,
    openGraph: {
      title: `${agent.name} - Talking Object`,
      description: agent.description,
      images: agent.image_url ? [agent.image_url] : [],
    },
  };
}

export default function Page({ params }: PageProps) {
  return <AgentPage slug={params.slug} />;
} 