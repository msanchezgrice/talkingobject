'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderAgent, getAgentBySlug } from '@/lib/placeholder-agents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { VoicePlayer } from '@/components/VoicePlayer';

export default function AgentDetailPage() {
  const { slug } = useParams();
  const [agent, setAgent] = useState<PlaceholderAgent | null>(null);

  useEffect(() => {
    if (slug) {
      const foundAgent = getAgentBySlug(slug as string);
      if (foundAgent) {
        setAgent(foundAgent);
      }
    }
  }, [slug]);

  if (!agent) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Agent not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={agent.image_url} alt={agent.name} />
                <AvatarFallback>{agent.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{agent.name}</CardTitle>
                <CardDescription className="text-lg">{agent.location}</CardDescription>
              </div>
            </div>
            <VoicePlayer
              text={`Hi, I'm ${agent.name}. ${agent.description}`}
              category={agent.category}
              agentId={agent.id}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-600">{agent.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {agent.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Likes</h2>
              <p className="text-gray-600">{agent.likes.join(', ')}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Dislikes</h2>
              <p className="text-gray-600">{agent.dislikes.join(', ')}</p>
            </div>

            {agent.fun_facts.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Fun Facts</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {agent.fun_facts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 