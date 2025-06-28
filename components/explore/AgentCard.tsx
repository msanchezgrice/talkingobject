'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DatabaseAgent } from '@/lib/database/agents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AgentCardProps {
  agent: DatabaseAgent;
  showLocation?: boolean;
}

// Category-specific styling
const getCategoryStyle = (agent: DatabaseAgent) => {
  if (!agent.interests) return {
    gradient: 'from-blue-500/20 to-purple-500/20',
    border: 'border-blue-500/30',
    icon: '🏢',
    accent: 'text-blue-600'
  };

  const interests = agent.interests.join(' ').toLowerCase();
  
  if (interests.includes('historic') || interests.includes('monument')) {
    return {
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      icon: '🏛️',
      accent: 'text-amber-600'
    };
  }
  
  if (interests.includes('park') || interests.includes('nature')) {
    return {
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      icon: '🌳',
      accent: 'text-green-600'
    };
  }
  
  if (interests.includes('art') || interests.includes('mural')) {
    return {
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      icon: '🎨',
      accent: 'text-purple-600'
    };
  }
  
  if (interests.includes('music') || interests.includes('concert')) {
    return {
      gradient: 'from-red-500/20 to-rose-500/20',
      border: 'border-red-500/30',
      icon: '🎵',
      accent: 'text-red-600'
    };
  }
  
  if (interests.includes('food') || interests.includes('restaurant')) {
    return {
      gradient: 'from-orange-500/20 to-yellow-500/20',
      border: 'border-orange-500/30',
      icon: '🍽️',
      accent: 'text-orange-600'
    };
  }
  
  return {
    gradient: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    icon: '🏢',
    accent: 'text-blue-600'
  };
};

export function AgentCard({ agent, showLocation = false }: AgentCardProps) {
  const categoryStyle = getCategoryStyle(agent);
  
  // Store location context for enhanced chat
  const handleChatClick = () => {
    if (agent.latitude && agent.longitude) {
      const locationContext = {
        coordinates: [agent.longitude, agent.latitude],
        timestamp: Date.now()
      };
      sessionStorage.setItem(`agent-${agent.id}-context`, JSON.stringify(locationContext));
      console.log('🗺️ Stored location context for enhanced chat');
    }
  };

  const formatLocation = () => {
    if (agent.latitude && agent.longitude) {
      return `${agent.latitude.toFixed(4)}, ${agent.longitude.toFixed(4)}`;
    }
    return null;
  };

  const getAgentInitials = () => {
    return agent.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${categoryStyle.gradient} p-[1px] hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="relative h-full rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        {/* Category Icon */}
        <div className="absolute top-3 right-3 text-2xl opacity-70">
          {categoryStyle.icon}
        </div>
        
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start space-x-4 mb-4">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center border-2 ${categoryStyle.border} group-hover:scale-110 transition-transform duration-300`}>
              {agent.image_url ? (
                <Image 
                  src={agent.image_url} 
                  alt={agent.name}
                  width={56}
                  height={56}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className={`font-bold text-lg ${categoryStyle.accent}`}>
                  {getAgentInitials()}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">
                {agent.name}
              </h3>
              {showLocation && formatLocation() && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formatLocation()}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
            {agent.description || agent.personality || 'Ready to share their unique story and perspective.'}
          </p>
          
          {/* Interest Tags */}
          {agent.interests && agent.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {agent.interests.slice(0, 2).map((interest, index) => (
                <Badge 
                  key={index} 
                  className={`text-xs px-2 py-1 bg-white/60 dark:bg-gray-800/60 ${categoryStyle.accent} border-0 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors`}
                >
                  {interest}
                </Badge>
              ))}
              {agent.interests.length > 2 && (
                <Badge className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0">
                  +{agent.interests.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Chat Button */}
          <Link 
            href={`/agent/${agent.slug}`} 
            onClick={handleChatClick}
            className="block w-full"
          >
            <Button 
              className={`w-full bg-gradient-to-r ${categoryStyle.gradient} hover:opacity-90 border-0 text-gray-800 dark:text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg group-hover:shadow-xl`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.95 8.95 0 01-2.667-.4c-.305-.092-.569-.184-.775-.29a6.8 6.8 0 01-.888-.89c-.159-.161-.5-.448-.5-.448l-4.33-4.33a2 2 0 00-2.83 0l-.88.88a2 2 0 00-.586 1.414v4.914a2 2 0 002 2h4.914a2 2 0 001.414-.586l.88-.88a2 2 0 000-2.828L5.17 9.5s-.287-.341-.448-.5a6.8 6.8 0 01-.89-.888c-.106-.206-.198-.47-.29-.775A8.95 8.95 0 013 6c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              Chat with {agent.name.split(' ')[0]}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 