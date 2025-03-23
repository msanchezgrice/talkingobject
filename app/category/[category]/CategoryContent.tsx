'use client';

import { useEffect, useState } from 'react';
import { PlaceholderAgent, getAgentsByCategory } from '@/lib/placeholder-agents';
import { voiceConfigs } from '@/lib/voices';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { VoicePlayer } from '@/components/VoicePlayer';

type CategoryInfo = {
  title: string;
  description: string;
  heroImage: string;
  color: string;
  textColor: string;
};

type CategoryContentProps = {
  category: keyof typeof voiceConfigs;
  info: CategoryInfo;
};

export default function CategoryContent({ category, info }: CategoryContentProps) {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = () => {
      try {
        const categoryAgents = getAgentsByCategory(category);
        setAgents(categoryAgents);
      } catch (err) {
        console.error('Error loading agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
            <p className="text-gray-400 mb-8">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className={`relative h-96 ${info.color} bg-opacity-90`}>
        <div className="absolute inset-0">
          <Image
            src={info.heroImage}
            alt={info.title}
            fill
            className="object-cover mix-blend-multiply"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {info.title}
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90">
            {info.description}
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No agents found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
              >
                <div className="relative h-48">
                  <Image
                    src={agent.image_url}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {agent.name}
                      </h2>
                      <p className="text-gray-400">{agent.location}</p>
                    </div>
                    <VoicePlayer
                      text={`Hi, I'm ${agent.name}. ${agent.description}`}
                      category={agent.category}
                      agentId={agent.slug}
                    />
                  </div>
                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {agent.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {agent.interests.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/agent/${agent.slug}`}
                    className={`block w-full text-center ${info.color} hover:bg-opacity-90 text-white py-2 rounded-md transition-colors`}
                  >
                    Chat with {agent.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 