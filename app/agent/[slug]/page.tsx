import { Metadata } from 'next';
import { getAgentBySlug } from '@/lib/placeholder-agents';
import ClientAgentPage from './ClientAgentPage';

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
  const agent = getAgentBySlug(params.slug);
  
  if (!agent) {
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

  return <ClientAgentPage agent={agent} />;
} 