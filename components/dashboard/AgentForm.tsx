'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClerkAgent, updateClerkAgent, ClerkDatabaseAgent, CreateClerkAgentData, UpdateClerkAgentData } from '@/lib/database/clerk-agents';
import Image from 'next/image';

// Data sources available to agents
const dataSources = [
  { id: 'weather', name: 'Weather', description: 'Access current weather conditions and forecasts for the agent\'s location.' },
  { id: 'news', name: 'News', description: 'Access recent news relevant to the agent\'s location or topic.' },
  { id: 'events', name: 'Local Events', description: 'Access information about events happening near the agent\'s location.' },
  { id: 'stocks', name: 'Stock Prices', description: 'Access current stock market data and financial information.' }
] as const;

// OpenAI TTS voice options
const voiceOptions = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
  { id: 'echo', name: 'Echo', description: 'Warm, expressive voice' },
  { id: 'fable', name: 'Fable', description: 'Storytelling, engaging voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep, authoritative voice' },
  { id: 'nova', name: 'Nova', description: 'Bright, energetic voice' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle, soothing voice' }
] as const;

type DataSource = typeof dataSources[number];
type VoiceOption = typeof voiceOptions[number];

interface AgentFormData {
  name: string;
  personality: string;
  description: string;
  interests: string;
  is_active: boolean;
  latitude: number;
  longitude: number;
  image_url: string;
  data_sources: string[];
  voice: string;
}

type AgentFormProps = {
  agent?: ClerkDatabaseAgent;
  onSubmit: () => void;
};

export default function AgentForm({ agent, onSubmit }: AgentFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<AgentFormData>({
    name: agent?.name || '',
    personality: agent?.personality || '',
    description: agent?.description || '',
    interests: agent?.interests?.join(', ') || '',
    is_active: agent?.is_active ?? true,
    latitude: agent?.latitude || 30.2672, // Default to Austin
    longitude: agent?.longitude || -97.7431, // Default to Austin
    image_url: agent?.image_url || '',
    data_sources: agent?.data_sources || [],
    voice: agent?.voice || 'alloy'
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(agent?.image_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: AgentFormData) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image_url: url }));
    setImagePreview(url);
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim() // Remove leading/trailing spaces
      .substring(0, 50); // Limit length
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Check if user is signed in with Clerk
      if (!user) {
        throw new Error('You must be signed in to create an agent');
      }

      // Parse interests from comma-separated string
      const interestsArray = formData.interests
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

      if (agent) {
        // Update existing agent
        const updateData: UpdateClerkAgentData = {
          name: formData.name,
          personality: formData.personality,
          description: formData.description,
          interests: interestsArray,
          is_active: formData.is_active,
          latitude: formData.latitude,
          longitude: formData.longitude,
          image_url: formData.image_url || '/images/placeholder.jpg',
          data_sources: formData.data_sources,
          voice: formData.voice
        };

        const updatedAgent = await updateClerkAgent(agent.id, updateData);
        
        if (!updatedAgent) {
          throw new Error('Failed to update agent');
        }

        console.log('Updated agent:', updatedAgent);
      } else {
        // Create new agent
        const createData: CreateClerkAgentData = {
          name: formData.name,
          slug: generateSlug(formData.name),
          personality: formData.personality,
          description: formData.description,
          interests: interestsArray,
          is_active: formData.is_active,
          latitude: formData.latitude,
          longitude: formData.longitude,
          image_url: formData.image_url || '/images/placeholder.jpg',
          data_sources: formData.data_sources,
          voice: formData.voice,
          clerk_user_id: user.id
        };

        const newAgent = await createClerkAgent(createData);
        
        if (!newAgent) {
          throw new Error('Failed to create agent');
        }

        console.log('Created new agent:', newAgent);
      }

      onSubmit();
    } catch (err) {
      console.error('Error submitting agent:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 bg-card p-4 sm:p-6 rounded-lg border shadow-lg max-w-2xl mx-auto">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agent Image - Moved to top */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-foreground mb-3">
            Agent Image
          </label>
          <div className="flex flex-col items-center space-y-4">
            {imagePreview && (
              <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                <Image
                  src={imagePreview}
                  alt="Agent preview"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg border-2 border-gray-200"
                />
              </div>
            )}
            
            <div className="w-full space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="block w-full p-3 border border-border rounded-md bg-background text-foreground text-center cursor-pointer hover:bg-muted transition-colors"
              >
                📷 Upload Image
              </label>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or</span>
                </div>
              </div>
              
              <input
                type="text"
                name="image_url"
                id="image_url"
                value={formData.image_url}
                onChange={handleImageUrlChange}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                placeholder="Enter image URL"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border-2 rounded-md bg-background text-foreground focus:border-primary transition-colors"
            placeholder="E.g., Coffee Shop Guide"
            required
          />
        </div>

        <div>
          <label htmlFor="personality" className="block text-sm font-medium text-foreground">
            Personality
          </label>
          <textarea
            name="personality"
            id="personality"
            value={formData.personality}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground h-24 sm:h-32 resize-none"
            placeholder="Describe your agent's personality, tone, and backstory..."
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground h-24 sm:h-32 resize-none"
            placeholder="Describe what your agent does and how it helps users..."
            required
          />
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-foreground">
            Interests
          </label>
          <input
            type="text"
            name="interests"
            id="interests"
            value={formData.interests}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
            placeholder="coffee, local culture, art, music (separate with commas)"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter interests separated by commas
          </p>
        </div>

        <div>
          <label htmlFor="voice" className="block text-sm font-medium text-foreground">
            Voice (Text-to-Speech)
          </label>
          <select
            name="voice"
            id="voice"
            value={formData.voice}
            onChange={handleChange}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground"
          >
            {voiceOptions.map((voice: VoiceOption) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} - {voice.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Location
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-xs text-muted-foreground mb-1">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                value={formData.latitude.toString()}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                placeholder="E.g., 30.2672"
                step="any"
                required
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-xs text-muted-foreground mb-1">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                id="longitude"
                value={formData.longitude.toString()}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                placeholder="E.g., -97.7431"
                step="any"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Data Sources
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {dataSources.map((source: DataSource) => (
              <label key={source.id} className="flex items-start space-x-3 p-3 border border-border rounded-md hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  value={source.id}
                  checked={formData.data_sources.includes(source.id)}
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      data_sources: checked
                        ? [...prev.data_sources, value]
                        : prev.data_sources.filter((id) => id !== value),
                    }));
                  }}
                  className="rounded border-border text-primary focus:ring-primary mt-1"
                />
                <div>
                  <span className="text-foreground font-medium">{source.name}</span>
                  <p className="text-xs text-muted-foreground">{source.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 border border-border rounded-md">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
            className="rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="block text-sm text-foreground font-medium">
            Active (Agent can receive messages)
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  );
} 