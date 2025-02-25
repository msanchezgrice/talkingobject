import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Agent } from '@/lib/supabase/types';

export const metadata = {
  title: 'Explore Agents | Talking Objects',
  description: 'Discover interactive AI agents created by the Talking Objects community',
};

export default async function ExplorePage() {
  const supabase = createServerSupabaseClient();
  
  // Fetch public agents
  let agents: Agent[] = [];
  let error: string | null = null;
  
  try {
    // Get the most recently updated agents, limited to 50
    const { data, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (data) {
      agents = data as Agent[];
    }
    
    if (fetchError) {
      error = fetchError.message;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'An error occurred';
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Explore Agents</h2>
        <p className="text-gray-600 mt-2">
          Discover interactive AI agents created by the Talking Objects community
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          Error loading agents: {error}
        </div>
      )}
      
      {agents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <p className="text-center text-gray-500 py-8">
            No agents found. Be the first to create an agent!
          </p>
          <div className="flex justify-center">
            <Link 
              href="/dashboard/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Create New Agent
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 relative">
                  {agent.image_url ? (
                    <Image 
                      src={agent.image_url} 
                      alt={agent.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <span className="text-blue-600 text-2xl font-bold">{agent.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{agent.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {agent.personality.length > 120 
                      ? `${agent.personality.substring(0, 120)}...` 
                      : agent.personality}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.data_sources && agent.data_sources.map((source) => (
                      <span 
                        key={source} 
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/agent/${agent.slug}`}
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-sm transition-colors"
                  >
                    Chat with {agent.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don&apos;t see what you&apos;re looking for? Create your own custom agent.
            </p>
            <Link 
              href="/dashboard/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Create New Agent
            </Link>
          </div>
        </>
      )}
    </div>
  );
} 