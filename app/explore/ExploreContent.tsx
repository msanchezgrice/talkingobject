'use client';

import { useEffect, useState } from 'react';
import { PlaceholderAgent, getAllAgents } from '@/lib/placeholder-agents';
import { voiceConfigs } from '@/lib/voices';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { VoicePlayer } from '@/components/VoicePlayer';
import { useSearchParams, useRouter } from 'next/navigation';

type Category = keyof typeof voiceConfigs;

const categories: { id: Category; label: string }[] = [
  { id: 'historicSites', label: 'Historic Sites' },
  { id: 'parksAndNature', label: 'Parks & Nature' },
  { id: 'publicArt', label: 'Public Art' },
  { id: 'businesses', label: 'Businesses' }
];

export default function ExploreContent() {
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get category from URL or default to 'historicSites'
  const selectedCategory = (searchParams.get('category') as Category) || 'historicSites';

  useEffect(() => {
    const loadAgents = () => {
      try {
        const allAgents = getAllAgents();
        setAgents(allAgents.filter(agent => agent.is_active));
      } catch (err) {
        console.error('Error loading agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const filteredAgents = selectedCategory
    ? agents.filter(agent => agent.category.toLowerCase() === selectedCategory.toLowerCase())
    : agents;

  const handleCategoryChange = (category: Category | null) => {
    if (category) {
      router.push(`/explore?category=${category}`);
    } else {
      router.push('/explore');
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Explore Talking Objects
          </h1>
          <p className="text-xl text-gray-400">
            Discover interactive agents that bring Austin&apos;s landmarks to life
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-md transition-colors ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {selectedCategory
                ? `No agents found in the ${
                    categories.find(c => c.id === selectedCategory)?.label
                  } category`
                : 'No agents found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
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
                    className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md transition-colors"
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