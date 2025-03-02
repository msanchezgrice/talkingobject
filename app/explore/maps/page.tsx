'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllAgents, PlaceholderAgent } from '@/lib/placeholder-agents';
import MapComponent from '@/components/map/MapComponent';

export default function ExploreMapPage() {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      // Get all placeholder agents
      const allAgents = getAllAgents();
      // Filter to only include agents with location data
      const agentsWithLocation = allAgents.filter(
        agent => agent.latitude && agent.longitude
      );
      
      setAgents(agentsWithLocation);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setLoading(false);
    }
  }, []);

  // Check if any agents have location data
  const hasLocationData = agents.length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Explore Agents Map</h2>
          <Link 
            href="/explore" 
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Explore
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4" role="alert">
            Error loading map: {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !hasLocationData ? (
          <div className="bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-800">
            <p className="text-center text-gray-400 py-8">
              No agents with location data available.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/explore" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Back to Explore
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg shadow overflow-hidden border border-gray-800 p-4">
            <MapComponent 
              agents={agents} 
              height="600px" 
              zoom={12} 
              center={[30.2672, -97.7431]} // Austin, TX coordinates
              linkBase="/agent"
            />
            <div className="mt-4 text-center text-gray-400 text-sm">
              <p>Showing {agents.length} agents with location data</p>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-xl font-bold mb-4">Austin Landmarks</h3>
          <p className="text-gray-300 mb-4">
            Explore the interactive map above to discover various agents representing Austin&apos;s landmarks. 
            Each marker on the map represents a unique agent with its own personality and story.
          </p>
          <p className="text-gray-300">
            Click on any marker to learn more about the agent and to start a conversation.
          </p>
        </div>
      </div>
    </div>
  );
} 