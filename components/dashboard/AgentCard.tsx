'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Agent } from '@/lib/supabase/types';
import type { PlaceholderAgent } from '@/lib/placeholder-agents';

// Type that can be either Agent from Supabase or our PlaceholderAgent
type AgentCardProps = {
  agent: Agent | PlaceholderAgent;
};

export default function AgentCard({ agent }: AgentCardProps) {
  const [showQR, setShowQR] = useState(false);
  
  // Use fallback for BASE_URL if environment variable is not available
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://talkingobjects.vercel.app';
  const agentUrl = `${baseUrl}/agent/${agent.slug}`;
  
  // Generate a static QR code URL to avoid issues during build
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(agentUrl)}&size=200x200`;
  
  return (
    <div className="bg-gray-900 rounded-lg shadow overflow-hidden border border-gray-800">
      <div className="h-48 bg-gray-800 relative">
        {agent.image_url ? (
          <Image 
            src={agent.image_url} 
            alt={agent.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-900">
            <span className="text-blue-200 text-2xl font-bold">{agent.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1">
          Active
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-white">{agent.name}</h3>
        <p className="text-gray-400 mb-4">
          {agent.personality.length > 100 
            ? `${agent.personality.substring(0, 100)}...` 
            : agent.personality}
        </p>
        
        {showQR ? (
          <div className="mb-4">
            <div className="bg-gray-800 p-2 border border-gray-700 rounded-md mb-2">
              <Image 
                src={qrUrl}
                alt={`QR Code for ${agent.name}`}
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-center text-gray-500 mb-2">{agentUrl}</p>
            <button 
              onClick={() => setShowQR(false)}
              className="w-full text-center text-blue-400 hover:text-blue-300 text-sm"
            >
              Hide QR Code
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mb-4">
            <Link 
              href={`/dashboard/edit/${agent.id}`}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm transition-colors text-gray-300"
            >
              Edit
            </Link>
            <Link 
              href={`/agent/${agent.slug}`}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm transition-colors text-gray-300"
            >
              View
            </Link>
            <button 
              onClick={() => setShowQR(true)}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm transition-colors text-gray-300"
            >
              QR Code
            </button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1">
          {agent.data_sources && agent.data_sources.length > 0 ? (
            agent.data_sources.map((source) => (
              <span 
                key={source} 
                className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded"
              >
                {source}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No data sources</span>
          )}
        </div>
      </div>
    </div>
  );
} 