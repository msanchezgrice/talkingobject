'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Agent } from '@/lib/supabase/types';

type AgentInfoProps = {
  agent: Agent;
};

export default function AgentInfo({ agent }: AgentInfoProps) {
  const [copySuccess, setCopySuccess] = useState('');
  
  const agentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/agent/${agent.slug}`;
  const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/qrcode?data=${encodeURIComponent(agentUrl)}&format=png&scale=8`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(agentUrl)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${agent.name.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">About {agent.name}</h3>
        <p className="mb-4 whitespace-pre-wrap">{agent.personality}</p>
        
        <h4 className="font-medium mb-2">Data Sources</h4>
        {agent.data_sources && agent.data_sources.length > 0 ? (
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
            {agent.data_sources.map(source => (
              <li key={source}>{source.charAt(0).toUpperCase() + source.slice(1)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No external data sources connected</p>
        )}
        
        {(agent.latitude && agent.longitude) && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-2">Location</h4>
            <p className="text-sm text-gray-500">{agent.latitude.toFixed(6)}° N, {agent.longitude.toFixed(6)}° W</p>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Share This Agent</h3>
        <div className="bg-gray-100 p-4 rounded-md flex flex-col items-center">
          <div className="w-48 h-48 bg-white p-2 mb-4 border rounded-md">
            <Image 
              src={qrUrl}
              alt={`QR Code for ${agent.name}`}
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          
          <p className="text-sm text-center mb-3">
            Scan this QR code to chat with {agent.name}
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadQR}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Download
            </button>
            <button 
              onClick={handleCopyLink}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm transition-colors relative"
            >
              {copySuccess || 'Copy Link'}
              {copySuccess && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 