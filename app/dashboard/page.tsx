'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import AgentCard from "@/components/dashboard/AgentCard";
import { getAllAgents, PlaceholderAgent } from "@/lib/placeholder-agents";

export default function DashboardPage() {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const loadAgents = () => {
        const storedAgents = getAllAgents();
        // Filter out inactive agents
        const activeAgents = storedAgents.filter(agent => agent.is_active);
        setAgents(activeAgents);
      };

      loadAgents();
    } catch (err) {
      console.error('Error loading agents:', err);
      setError('Failed to load agents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Your Agents</h2>
          <div className="flex space-x-4">
            <Link 
              href="/dashboard/map" 
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Map
            </Link>
            <Link 
              href="/dashboard/create" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Create New Agent
            </Link>
          </div>
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
              You haven&apos;t created any agents yet. Click the &quot;Create New Agent&quot; button to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
        
        {/* View more button to load additional agents */}
        {agents.length > 0 && agents.length < 20 && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setAgents(getAllAgents())}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              View All Agents
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 