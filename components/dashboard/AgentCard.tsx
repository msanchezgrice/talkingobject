'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseAgent, deleteAgent } from '@/lib/database/agents';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { VoicePlayer } from '@/components/VoicePlayer';

interface AgentCardProps {
  agent: DatabaseAgent;
  onUpdate?: () => void;
}

export function AgentCard({ agent, onUpdate }: AgentCardProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = () => {
    router.push(`/agent/${agent.slug}/edit`);
  };

  const handleViewClick = () => {
    router.push(`/agent/${agent.slug}`);
  };

  const handleToggleActive = async () => {
    setIsUpdating(true);
    try {
      // Call API to update agent active status
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !agent.is_active
        }),
      });

      if (response.ok) {
        onUpdate?.();
      } else {
        console.error('Failed to update agent status');
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // Get current user
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session?.user) {
        throw new Error('Authentication required');
      }

      const success = await deleteAgent(agent.id, session.user.id);
      
      if (success) {
        onUpdate?.();
      } else {
        console.error('Failed to delete agent');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const formatLocation = () => {
    if (agent.latitude && agent.longitude) {
      return `${agent.latitude.toFixed(4)}, ${agent.longitude.toFixed(4)}`;
    }
    return 'No location set';
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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={agent.image_url || undefined} alt={agent.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getAgentInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-sm">
                {formatLocation()}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={agent.is_active}
              onCheckedChange={handleToggleActive}
              disabled={isUpdating}
            />
            <span className="text-xs text-muted-foreground">
              {agent.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {agent.description || 'No description provided'}
        </p>
        
        {agent.interests && agent.interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {agent.interests.slice(0, 3).map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {agent.interests.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{agent.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(agent.created_at).toLocaleDateString()}</span>
          </div>
          {agent.fee_amount > 0 && (
            <div className="flex justify-between">
              <span>Fee:</span>
              <span>{agent.fee_amount} {agent.fee_token}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4 pt-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleViewClick}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
          <VoicePlayer
            text={`Hi, I'm ${agent.name}. ${agent.description || agent.personality}`}
            category="businesses"
            agentId={agent.slug}
          />
        </div>

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="w-full p-3 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive mb-3">
              Are you sure you want to delete this agent? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 