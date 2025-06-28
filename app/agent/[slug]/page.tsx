import { Metadata } from 'next';
import { serverAgentQueries } from '@/lib/database/server-agents';
import { getAgentBySlug } from '@/lib/placeholder-agents';
import ClientAgentPage from './ClientAgentPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Try database first, then fall back to placeholder agents
  let agent = await serverAgentQueries.getClerkAgentBySlug(resolvedParams.slug);
  
  if (!agent) {
    // Fall back to placeholder agents
    const placeholderAgent = getAgentBySlug(resolvedParams.slug);
    if (placeholderAgent) {
      return {
        title: `${placeholderAgent.name} - Talking Objects`,
        description: placeholderAgent.description || undefined,
        openGraph: {
          title: placeholderAgent.name,
          description: placeholderAgent.description || undefined,
          images: placeholderAgent.image_url ? [placeholderAgent.image_url] : undefined,
        },
      };
    }
  } else {
    return {
      title: `${agent.name} - Talking Objects`,
      description: agent.description || undefined,
      openGraph: {
        title: agent.name,
        description: agent.description || undefined,
        images: agent.image_url ? [agent.image_url] : undefined,
      },
    };
  }

  return {
    title: 'Agent Not Found',
    description: 'The requested agent could not be found.'
  };
}

export default async function AgentPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // Try database first, then fall back to placeholder agents
  let agent = await serverAgentQueries.getClerkAgentBySlug(resolvedParams.slug);
  
  if (!agent) {
    // Fall back to placeholder agents
    const placeholderAgent = getAgentBySlug(resolvedParams.slug);
    if (placeholderAgent) {
      // Convert placeholder agent to database agent format
      const convertedAgent = {
        id: placeholderAgent.id,
        created_at: placeholderAgent.created_at,
        updated_at: placeholderAgent.last_updated,
        auth_user_id: placeholderAgent.user_id,
        name: placeholderAgent.name,
        slug: placeholderAgent.slug,
        personality: placeholderAgent.personality,
        description: placeholderAgent.description,
        interests: placeholderAgent.interests,
        latitude: placeholderAgent.latitude,
        longitude: placeholderAgent.longitude,
        image_url: placeholderAgent.image_url,
        is_active: placeholderAgent.is_active,
        data_sources: placeholderAgent.data_sources,
        fee_amount: 0,
        fee_token: 'ETH'
      };
      return <ClientAgentPage agent={convertedAgent} />;
    }
  } else {
    return <ClientAgentPage agent={agent} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Agent Not Found</h1>
          <p className="mt-2 text-gray-600">The requested agent could not be found.</p>
        </div>
      </div>
    </div>
  );
} 