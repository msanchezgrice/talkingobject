'use client';

import Link from 'next/link';
import { DatabaseAgent } from '@/lib/database/agents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AgentCardProps {
  agent: DatabaseAgent;
  showLocation?: boolean;
}

export function AgentCard({ agent, showLocation = false }: AgentCardProps) {
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
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={agent.image_url || undefined} alt={agent.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getAgentInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight">{agent.name}</CardTitle>
            {showLocation && formatLocation() && (
              <CardDescription className="text-xs">
                {formatLocation()}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {agent.description || agent.personality || 'No description available'}
        </p>
        
        {agent.interests && agent.interests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {agent.interests.slice(0, 2).map((interest, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {interest}
              </Badge>
            ))}
            {agent.interests.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{agent.interests.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Link 
          href={`/agent/${agent.slug}`} 
          className="w-full"
          onClick={handleChatClick}
        >
          <Button 
            variant="outline" 
            className="w-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.95 8.95 0 01-2.667-.4c-.305-.092-.569-.184-.775-.29a6.8 6.8 0 01-.888-.89c-.159-.161-.5-.448-.5-.448l-4.33-4.33a2 2 0 00-2.83 0l-.88.88a2 2 0 00-.586 1.414v4.914a2 2 0 002 2h4.914a2 2 0 001.414-.586l.88-.88a2 2 0 000-2.828L5.17 9.5s-.287-.341-.448-.5a6.8 6.8 0 01-.89-.888c-.106-.206-.198-.47-.29-.775A8.95 8.95 0 013 6c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            Chat with {agent.name}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 