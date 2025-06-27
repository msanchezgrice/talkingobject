'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlaceholderAgent } from '@/lib/placeholder-agents';

interface AgentCardProps {
  agent: PlaceholderAgent;
  showLocation?: boolean;
}

export function AgentCard({ agent, showLocation = false }: AgentCardProps) {
  const handleChatClick = () => {
    // Store location context for the chat
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`agent-${agent.id}-context`, JSON.stringify({
        locationAware: true,
        city: agent.location,
        coordinates: agent.coordinates,
        timestamp: Date.now()
      }));
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-800 hover:border-gray-700">
      <div className="h-40 bg-gray-800 relative">
        {agent.image_url ? (
          <Image 
            src={agent.image_url} 
            alt={agent.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-200 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <span className="text-blue-200 text-3xl font-bold">{agent.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Location badge */}
        {showLocation && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
            <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {agent.location.length > 20 ? `${agent.location.substring(0, 20)}...` : agent.location}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-white">{agent.name}</h3>
        
        <p className="text-gray-400 text-sm mb-3 leading-relaxed">
          {agent.personality.length > 120 
            ? `${agent.personality.substring(0, 120)}...` 
            : agent.personality}
        </p>
        
        {/* Interests tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.interests.slice(0, 3).map((interest) => (
            <span 
              key={interest} 
              className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
          {agent.interests.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{agent.interests.length - 3} more
            </span>
          )}
        </div>
        
        {/* Location info */}
        {showLocation && (
          <div className="text-xs text-gray-500 mb-3 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {agent.coordinates}
          </div>
        )}
        
        {/* Enhanced chat button */}
        <Link 
          href={`/agent/${agent.slug}`}
          onClick={handleChatClick}
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat with this place
          </div>
        </Link>
      </div>
    </div>
  );
} 