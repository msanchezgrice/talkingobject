'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getAllAgents, PlaceholderAgent } from '@/lib/placeholder-agents';

export default function ExplorePage() {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      // Get all placeholder agents (limited to 50)
      const placeholderAgents = getAllAgents().slice(0, 50);
      setAgents(placeholderAgents);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setLoading(false);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Explore Agents</h2>
            <p className="text-gray-400 mt-2">
              Discover interactive AI agents created by the Talking Objects community
            </p>
          </div>
          <Link 
            href="/explore/maps" 
            className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View on Map
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4" role="alert">
            Error loading agents: {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-800">
            <p className="text-center text-gray-400 py-8">
              No agents found. Be the first to create an agent!
            </p>
            <div className="flex justify-center">
              <Link 
                href="/dashboard/create" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Create New Agent
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-gray-900 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow border border-gray-800">
                  <div className="h-40 bg-gray-800 relative">
                    {agent.image_url ? (
                      <Image 
                        src={agent.image_url} 
                        alt={agent.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-900">
                        <span className="text-blue-200 text-2xl font-bold">{agent.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-white">{agent.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {(agent as any).personality?.length > 120 
                        ? `${(agent as any).personality.substring(0, 120)}...` 
                        : (agent as any).personality || agent.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(agent as any).data_sources?.map((source: string) => (
                        <span 
                          key={source} 
                          className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/agent/${agent.slug}`}
                      className="block w-full text-center bg-gray-800 hover:bg-gray-700 py-2 rounded-md text-sm transition-colors text-gray-300"
                    >
                      Chat with {agent.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                Don&apos;t see what you&apos;re looking for? Create your own custom agent.
              </p>
              <Link 
                href="/dashboard/create" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Create New Agent
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 