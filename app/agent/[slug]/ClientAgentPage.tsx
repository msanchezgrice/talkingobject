'use client';

import { PlaceholderAgent } from '@/lib/placeholder-agents';
import ChatInterface from '@/components/agent/ChatInterface';
import AgentInfo from '@/components/agent/AgentInfo';
import AgentTweets from '@/components/agent/AgentTweets';

interface ClientAgentPageProps {
  agent: PlaceholderAgent;
}

export default function ClientAgentPage({ agent }: ClientAgentPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <AgentInfo agent={agent} />
          <div className="mt-8">
            <AgentTweets agent={agent} />
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          <ChatInterface agent={agent} />
        </div>
      </div>
    </div>
  );
} 