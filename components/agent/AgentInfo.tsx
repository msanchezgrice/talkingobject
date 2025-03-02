'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PlaceholderAgent } from '@/lib/placeholder-agents';

type AgentInfoProps = {
  agent: PlaceholderAgent;
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
      <div className="bg-gray-900 rounded-lg shadow p-6 border border-gray-800">
        <h3 className="text-lg font-medium mb-4 text-white">About {agent.name}</h3>
        <p className="mb-4 whitespace-pre-wrap text-gray-300">{agent.personality}</p>
        
        <h4 className="font-medium mb-2 text-gray-200">Data Sources</h4>
        {agent.data_sources && agent.data_sources.length > 0 ? (
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-400">
            {agent.data_sources.map(source => (
              <li key={source}>{source.charAt(0).toUpperCase() + source.slice(1)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No external data sources connected</p>
        )}
        
        {(agent.latitude && agent.longitude) && (
          <div className="border-t border-gray-800 pt-4 mt-4">
            <h4 className="font-medium mb-2 text-gray-200">Location</h4>
            <p className="text-sm text-gray-500">{agent.latitude.toFixed(6)}° N, {agent.longitude.toFixed(6)}° W</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-900 rounded-lg shadow p-6 border border-gray-800">
        <h3 className="text-lg font-medium mb-4 text-white">Share This Agent</h3>
        <div className="bg-gray-800 p-4 rounded-md flex flex-col items-center">
          <div className="w-48 h-48 bg-white p-2 mb-4 rounded-md">
            {/* Use regular img tag instead of Next.js Image to avoid hostname configuration */}
            <Image 
              src={qrUrl}
              alt={`QR Code for ${agent.name}`}
              width={200}
              height={200}
              className="mx-auto"
              unoptimized
            />
          </div>
          
          <p className="text-sm text-center mb-3 text-gray-300">
            Scan this QR code to chat with {agent.name}
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadQR}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm transition-colors text-gray-300"
            >
              Download
            </button>
            <button 
              onClick={handleCopyLink}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm transition-colors relative text-gray-300"
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