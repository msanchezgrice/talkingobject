'use client';

import { useState, useRef } from 'react';
import { createAgent, updateAgent, DatabaseAgent, CreateAgentData, UpdateAgentData } from '@/lib/database/agents';
import { supabase } from '@/lib/supabase/client';
import { voiceConfigs } from '@/lib/voices';
import Image from 'next/image';

// Data sources available to agents
const dataSources = [
  { id: 'weather', name: 'Weather', description: 'Access current weather conditions and forecasts for the agent\'s location.' },
  { id: 'news', name: 'News', description: 'Access recent news relevant to the agent\'s location or topic.' },
  { id: 'events', name: 'Local Events', description: 'Access information about events happening near the agent\'s location.' },
  { id: 'stocks', name: 'Stock Prices', description: 'Access current stock market data and financial information.' }
] as const;

type DataSource = typeof dataSources[number];

interface AgentFormData {
  name: string;
  personality: string;
  description: string;
  interests: string[];
  is_active: boolean;
  latitude: number;
  longitude: number;
  image_url: string;
  data_sources: string[];
  fee_amount: number;
  fee_token: string;
}

type AgentFormProps = {
  agent?: DatabaseAgent;
  onSubmit: () => void;
};

export default function AgentForm({ agent, onSubmit }: AgentFormProps) {
  const [formData, setFormData] = useState<AgentFormData>({
    name: agent?.name || '',
    personality: agent?.personality || '',
    description: agent?.description || '',
    interests: agent?.interests || [],
    is_active: agent?.is_active ?? true,
    latitude: agent?.latitude || 30.2672, // Default to Austin
    longitude: agent?.longitude || -97.7431, // Default to Austin
    image_url: agent?.image_url || '',
    data_sources: agent?.data_sources || [],
    fee_amount: agent?.fee_amount || 0,
    fee_token: agent?.fee_token || 'ETH'
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(agent?.image_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Get current user
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        throw new Error('Authentication failed');
      }

      if (!session?.user) {
        throw new Error('You must be signed in to create an agent');
      }

      if (agent) {
        // Update existing agent
        const updateData: UpdateAgentData = {
          name: formData.name,
          personality: formData.personality,
          description: formData.description,
          interests: formData.interests,
          is_active: formData.is_active,
          latitude: formData.latitude,
          longitude: formData.longitude,
          image_url: formData.image_url || '/images/placeholder.jpg',
          data_sources: formData.data_sources,
          fee_amount: formData.fee_amount,
          fee_token: formData.fee_token
        };

        const updatedAgent = await updateAgent(agent.id, updateData);
        
        if (!updatedAgent) {
          throw new Error('Failed to update agent');
        }

        console.log('Updated agent:', updatedAgent);
      } else {
        // Create new agent
        const createData: CreateAgentData = {
          name: formData.name,
          slug: generateSlug(formData.name),
          personality: formData.personality,
          description: formData.description,
          interests: formData.interests,
          is_active: formData.is_active,
          latitude: formData.latitude,
          longitude: formData.longitude,
          image_url: formData.image_url || '/images/placeholder.jpg',
          data_sources: formData.data_sources,
          fee_amount: formData.fee_amount,
          fee_token: formData.fee_token,
          auth_user_id: session.user.id
        };

        const newAgent = await createAgent(createData);
        
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
    <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 rounded-lg border shadow-lg">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

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
          className="w-full p-2 border border-border rounded-md bg-background text-foreground h-32"
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
          className="w-full p-2 border border-border rounded-md bg-background text-foreground h-32"
          placeholder="Describe what your agent does and how it helps users..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Location
        </label>
        <div className="grid grid-cols-2 gap-4">
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
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
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
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              placeholder="E.g., -97.7431"
              step="any"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-foreground">
          Agent Image
        </label>
        <div className="mt-2 space-y-4">
          {imagePreview && (
            <div className="relative h-40 w-40 mb-4">
              <Image
                src={imagePreview}
                alt="Agent preview"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          )}
          
          <div className="space-y-2">
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
              className="block w-full p-2 border border-border rounded-md bg-background text-foreground text-center cursor-pointer hover:bg-muted"
            >
              Upload Image
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
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Enter image URL"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Data Sources
        </label>
        <div className="space-y-2">
          {dataSources.map((source: DataSource) => (
            <label key={source.id} className="flex items-center space-x-2">
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
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-foreground">{source.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-foreground">
          Interests (comma-separated)
        </label>
        <input
          type="text"
          name="interests"
          id="interests"
          value={formData.interests.join(', ')}
          onChange={(e) => {
            const interestsArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
            setFormData(prev => ({ ...prev, interests: interestsArray }));
          }}
          className="mt-1 block w-full p-2 border border-border rounded-md bg-background text-foreground"
          placeholder="Enter interests separated by commas"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fee_amount" className="block text-sm font-medium text-foreground">
            Fee Amount
          </label>
          <input
            type="number"
            name="fee_amount"
            id="fee_amount"
            value={formData.fee_amount}
            onChange={(e) => setFormData(prev => ({ ...prev, fee_amount: parseFloat(e.target.value) || 0 }))}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="fee_token" className="block text-sm font-medium text-foreground">
            Fee Token
          </label>
          <select
            name="fee_token"
            id="fee_token"
            value={formData.fee_token}
            onChange={(e) => setFormData(prev => ({ ...prev, fee_token: e.target.value }))}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="ETH">ETH</option>
            <option value="USD">USD</option>
            <option value="BTC">BTC</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
          className="rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-foreground">
          Active
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
} 