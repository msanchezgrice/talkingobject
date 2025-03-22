'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllAgents, PlaceholderAgent } from '@/lib/placeholder-agents';
import MapComponent from '@/components/map/MapComponent';

export default function MapPage() {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentsData = getAllAgents();
        // Filter to only show agents with location data
        const agentsWithLocation = agentsData.filter(
          (agent) => agent.latitude && agent.longitude
        );
        setAgents(agentsWithLocation);
      } catch (error) {
        console.error('Error loading agents:', error);
        setError('Failed to load agents');
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Agent Locations</h2>
          <Link
            href="/dashboard"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-800">
            <p className="text-center text-gray-400 py-8">
              No agents with location data available.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <MapComponent agents={agents} height="600px" />
          </div>
        )}
      </div>
    </div>
  );
} 