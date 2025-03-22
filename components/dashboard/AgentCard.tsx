'use client';

import { useRouter } from 'next/navigation';
import { PlaceholderAgent } from '@/lib/placeholder-agents';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { VoicePlayer } from '@/components/VoicePlayer';

interface AgentCardProps {
  agent: PlaceholderAgent;
  onToggleActive?: (agentId: string, isActive: boolean) => void;
}

export function AgentCard({ agent, onToggleActive }: AgentCardProps) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/agent/${agent.slug}/edit`);
  };

  const handleViewClick = () => {
    router.push(`/agent/${agent.slug}`);
  };

  const handleToggleActive = () => {
    onToggleActive?.(agent.id, !agent.is_active);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={agent.image_url} alt={agent.name} />
              <AvatarFallback>{agent.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>{agent.location}</CardDescription>
            </div>
          </div>
          <Switch
            checked={agent.is_active}
            onCheckedChange={handleToggleActive}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.interests.map((interest, index) => (
            <Badge key={index} variant="secondary">{interest}</Badge>
          ))}
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Likes:</span>
            <span className="text-sm text-gray-600 ml-2">{agent.likes.join(', ')}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Dislikes:</span>
            <span className="text-sm text-gray-600 ml-2">{agent.dislikes.join(', ')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleViewClick}>
            View
          </Button>
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            Edit
          </Button>
        </div>
        <VoicePlayer
          text={`Hi, I'm ${agent.name}. ${agent.description}`}
          category={agent.category}
          agentId={agent.id}
        />
      </CardFooter>
    </Card>
  );
} 