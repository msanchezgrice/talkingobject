'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  getAllAgents, 
  PlaceholderAgent, 
  groupAgentsByLocation, 
  groupAgentsByCategory,
  AgentGroup,
  CategoryGroup 
} from '@/lib/placeholder-agents';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { AgentCard } from '@/components/explore/AgentCard';

type ViewMode = 'location' | 'category';

export default function ExplorePage() {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [locationGroups, setLocationGroups] = useState<AgentGroup[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  
  useEffect(() => {
    try {
      // Get all placeholder agents
      const allAgents = getAllAgents();
      setAgents(allAgents);
      
      // Group agents by location and category
      setLocationGroups(groupAgentsByLocation(allAgents));
      setCategoryGroups(groupAgentsByCategory(allAgents));
      
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setLoading(false);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Explore Austin</h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Discover interactive AI agents across the city. Each represents a unique place,<br />
                person, or piece of Austin&apos;s culture waiting to share their story.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link 
                href="/explore/maps" 
                className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View on Map
              </Link>
              
              <Link 
                href="/dashboard/create" 
                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center whitespace-nowrap"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Agent
              </Link>
            </div>
          </div>
          
          {/* View mode toggle */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-gray-400 text-sm">Group by:</span>
            <div className="bg-gray-900 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('category')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'category'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2M5 4l2 2-2 2m14 3H5m14-7l2 2-2 2M5 4l2 2-2 2" />
                </svg>
                Category
              </button>
              <button
                onClick={() => setViewMode('location')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'location'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Area
              </button>
            </div>
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Error loading agents: {error}
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : agents.length === 0 ? (
          /* Empty state */
          <div className="bg-gray-900 rounded-lg shadow p-8 mb-8 border border-gray-800 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-white">No agents found</h3>
            <p className="text-gray-400 mb-6">Be the first to create an agent and share Austin&apos;s story!</p>
            <Link 
              href="/dashboard/create" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Agent
            </Link>
          </div>
        ) : (
          /* Grouped content */
          <div className="space-y-6">
            {viewMode === 'category' ? (
              /* Category view */
              <Accordion>
                {categoryGroups.map((group) => (
                  <AccordionItem
                    key={group.category}
                    title={group.displayName}
                    subtitle={`${group.agents.length} ${group.agents.length === 1 ? 'agent' : 'agents'}`}
                    defaultOpen={true}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.agents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} showLocation={true} />
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              /* Location view */
              <Accordion>
                {locationGroups.map((group) => (
                  <AccordionItem
                    key={`${group.city}-${group.area}`}
                    title={group.area || group.city}
                    subtitle={`${group.city} • ${group.agents.length} ${group.agents.length === 1 ? 'agent' : 'agents'}`}
                    defaultOpen={true}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.agents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} showLocation={false} />
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            
            {/* Summary stats */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{agents.length}</div>
                  <div className="text-gray-400 text-sm">Total Agents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{categoryGroups.length}</div>
                  <div className="text-gray-400 text-sm">Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{locationGroups.length}</div>
                  <div className="text-gray-400 text-sm">Areas</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 