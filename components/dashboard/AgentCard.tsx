'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Agent } from '@/lib/supabase/types';

type AgentCardProps = {
  agent: Agent;
};

export default function AgentCard({ agent }: AgentCardProps) {
  const [showQR, setShowQR] = useState(false);
  
  const agentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/agent/${agent.slug}`;
  const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/qrcode?data=${encodeURIComponent(agentUrl)}&format=png`;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        {agent.image_url ? (
          <Image 
            src={agent.image_url} 
            alt={agent.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <span className="text-blue-600 text-2xl font-bold">{agent.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1">
          Active
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{agent.name}</h3>
        <p className="text-gray-600 mb-4">
          {agent.personality.length > 100 
            ? `${agent.personality.substring(0, 100)}...` 
            : agent.personality}
        </p>
        
        {showQR ? (
          <div className="mb-4">
            <div className="bg-white p-2 border rounded-md mb-2">
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
              className="w-full text-center text-blue-600 hover:underline text-sm"
            >
              Hide QR Code
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mb-4">
            <Link 
              href={`/dashboard/edit/${agent.id}`}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Edit
            </Link>
            <Link 
              href={`/agent/${agent.slug}`}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm transition-colors"
            >
              View
            </Link>
            <button 
              onClick={() => setShowQR(true)}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm transition-colors"
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
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
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