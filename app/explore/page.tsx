'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPublicAgents, DatabaseAgent } from '@/lib/database/agents';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { AgentCard } from '@/components/explore/AgentCard';

// Helper functions for grouping (adapted for DatabaseAgent)
function extractCityFromLocation(agent: DatabaseAgent): string {
  // Extract city from coordinates or use "Austin" as default
  if (agent.latitude && agent.longitude) {
    // Simple logic - could be enhanced with reverse geocoding
    return "Austin";
  }
  return "Austin";
}

function extractAreaFromLocation(agent: DatabaseAgent): string {
  // This would ideally use reverse geocoding, for now use interests as area hint
  if (agent.interests && agent.interests.length > 0) {
    const areaKeywords = ['downtown', 'south congress', 'east austin', 'lady bird', 'zilker'];
    const matchedArea = agent.interests.find(interest => 
      areaKeywords.some(keyword => interest.toLowerCase().includes(keyword))
    );
    if (matchedArea) return matchedArea;
  }
  return "Central Austin";
}

interface AgentGroup {
  city: string;
  area: string;
  agents: DatabaseAgent[];
}

interface CategoryGroup {
  category: string;
  displayName: string;
  agents: DatabaseAgent[];
}

function groupAgentsByLocation(agents: DatabaseAgent[]): AgentGroup[] {
  const groups: { [key: string]: AgentGroup } = {};
  
  agents.forEach(agent => {
    const city = extractCityFromLocation(agent);
    const area = extractAreaFromLocation(agent);
    const key = `${city}-${area}`;
    
    if (!groups[key]) {
      groups[key] = { city, area, agents: [] };
    }
    groups[key].agents.push(agent);
  });
  
  return Object.values(groups);
}

function groupAgentsByCategory(agents: DatabaseAgent[]): CategoryGroup[] {
  const categoryMap: { [key: string]: string } = {
    'historic': 'Historic Sites & Icons',
    'parks': 'Parks & Nature',
    'art': 'Public Art & Murals',
    'business': 'Local Businesses',
    'food': 'Food & Dining',
    'music': 'Music & Entertainment'
  };

  const groups: { [key: string]: CategoryGroup } = {};
  
  agents.forEach(agent => {
    // Determine category from interests
    let category = 'business'; // default
    if (agent.interests) {
      for (const interest of agent.interests) {
        const lowerInterest = interest.toLowerCase();
        if (lowerInterest.includes('historic') || lowerInterest.includes('monument')) category = 'historic';
        else if (lowerInterest.includes('park') || lowerInterest.includes('nature')) category = 'parks';
        else if (lowerInterest.includes('art') || lowerInterest.includes('mural')) category = 'art';
        else if (lowerInterest.includes('food') || lowerInterest.includes('restaurant')) category = 'food';
        else if (lowerInterest.includes('music') || lowerInterest.includes('concert')) category = 'music';
      }
    }
    
    const displayName = categoryMap[category] || 'Local Businesses';
    
    if (!groups[category]) {
      groups[category] = { category, displayName, agents: [] };
    }
    groups[category].agents.push(agent);
  });
  
  return Object.values(groups);
}

type ViewMode = 'location' | 'category';

export default function ExplorePage() {
  const [agents, setAgents] = useState<DatabaseAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [locationGroups, setLocationGroups] = useState<AgentGroup[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  
  useEffect(() => {
    const loadAgents = async () => {
      try {
        // Get all public agents from database
        const allAgents = await getAllPublicAgents();
        setAgents(allAgents);
        
        // Group agents by location and category
        setLocationGroups(groupAgentsByLocation(allAgents));
        setCategoryGroups(groupAgentsByCategory(allAgents));
        
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load agents');
        setLoading(false);
      }
    };

    loadAgents();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Explore Austin
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover interactive AI agents across the city. Each represents a unique place, 
              person, or piece of Austin&apos;s culture waiting to share their story.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Link 
              href="/explore/maps" 
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 py-3 px-6 rounded-xl transition-all duration-300 flex items-center whitespace-nowrap shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View on Map
            </Link>
            
            <Link 
              href="/dashboard/create" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 flex items-center whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Agent
                         </Link>
           </div>
          
          {/* View mode toggle */}
          <div className="flex justify-center">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-2 flex border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
              <button
                onClick={() => setViewMode('category')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center ${
                  viewMode === 'category'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2M5 4l2 2-2 2m14 3H5m14-7l2 2-2 2M5 4l2 2-2 2" />
                </svg>
                By Category
              </button>
              <button
                onClick={() => setViewMode('location')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center ${
                  viewMode === 'location'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                By Area
              </button>
            </div>
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6" role="alert">
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : agents.length === 0 ? (
                  /* Empty state */
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 mb-8 border border-gray-200/50 dark:border-gray-600/50 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">No agents found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-md mx-auto">Be the first to create an agent and share Austin&apos;s story!</p>
          <Link 
            href="/dashboard/create" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Agent
          </Link>
        </div>
        ) : (
          /* Grouped content */
          <div className="space-y-8">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                      {group.agents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} showLocation={false} />
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            
            {/* Summary stats */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="group">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{agents.length}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Agents</div>
                </div>
                <div className="group">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2M5 4l2 2-2 2m14 3H5m14-7l2 2-2 2M5 4l2 2-2 2" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{categoryGroups.length}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Categories</div>
                </div>
                <div className="group">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{locationGroups.length}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Areas</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 