import { Metadata } from 'next';
import { getAgentBySlug } from '@/lib/placeholder-agents';
import AgentPage from './AgentPage';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const agent = getAgentBySlug(resolvedParams.slug);
  
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

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <AgentPage slug={resolvedParams.slug} />;
} 