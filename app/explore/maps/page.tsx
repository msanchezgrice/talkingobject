'use client';

import { useState, useEffect } from 'react';
import { placeholderAgents as getAgents, PlaceholderAgent } from '@/lib/placeholder-agents';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Import the map component with SSR disabled
const MapComponent = nextDynamic(
  () => import('@/components/map/MapComponent'),
  { ssr: false }
);

export default function ExploreMapPage() {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadAgents() {
      try {
        // Use the imported array directly
        const agentsData = getAgents;
        // Filter to only show agents with location data
        const agentsWithLocation = agentsData.filter(
          (agent: PlaceholderAgent) => agent.latitude && agent.longitude
        );
        setAgents(agentsWithLocation);
      } catch (error) {
        console.error('Error loading agents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Interactive Map</h1>
            <Link
              href="/explore"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Explore
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8 border border-gray-800">
          <div className="mb-6">
            <p className="text-gray-400 mb-4">
              Explore the interactive map above to discover various agents representing Austin&apos;s landmarks.
            </p>
            
            {loading ? (
              <div className="h-[600px] bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : agents.length > 0 ? (
              <MapComponent 
                agents={agents} 
                height="600px" 
                linkBase="/agent"
                zoom={12}
                center={[30.2672, -97.7431]} // Austin, TX coordinates
              />
            ) : (
              <div className="h-[600px] bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No agents with location data available.</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Discover Talking Objects</h3>
            <p className="text-sm text-gray-400">
              Each marker on the map represents a talking object with its own unique story and personality. Click on markers to learn more!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 