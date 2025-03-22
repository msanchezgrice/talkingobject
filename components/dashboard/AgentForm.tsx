'use client';

import { useState, useRef } from 'react';
import { PlaceholderAgent, addAgent, updateAgent, PUBLIC_USER_ID } from '@/lib/placeholder-agents';

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
  likes: string[];
  dislikes: string[];
  is_active: boolean;
  latitude: number;
  longitude: number;
  image_url: string;
  data_sources: string[];
  location: string;
  coordinates: string;
  twitter_handle: string;
  fun_facts: string[];
  user_id: string;
}

type AgentFormProps = {
  agent?: PlaceholderAgent;
  onSubmit: () => void;
};

export default function AgentForm({ agent, onSubmit }: AgentFormProps) {
  const [formData, setFormData] = useState<AgentFormData>({
    name: agent?.name || '',
    personality: agent?.personality || '',
    description: agent?.description || '',
    interests: agent?.interests || [],
    likes: agent?.likes || [],
    dislikes: agent?.dislikes || [],
    is_active: agent?.is_active ?? true,
    latitude: agent?.latitude || 0,
    longitude: agent?.longitude || 0,
    image_url: agent?.image_url || '',
    data_sources: agent?.data_sources || [],
    location: agent?.location || '',
    coordinates: agent?.coordinates || '',
    twitter_handle: agent?.twitter_handle || '',
    fun_facts: agent?.fun_facts || [],
    user_id: agent?.user_id || PUBLIC_USER_ID,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(agent?.image_url || null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const agentData = {
      name: formData.name,
      personality: formData.personality,
      description: formData.description,
      interests: formData.interests,
      likes: formData.likes,
      dislikes: formData.dislikes,
      is_active: formData.is_active,
      latitude: formData.latitude,
      longitude: formData.longitude,
      image_url: formData.image_url || '/images/placeholder.jpg',
      data_sources: formData.data_sources,
      location: formData.location,
      coordinates: formData.coordinates,
      twitter_handle: formData.twitter_handle,
      fun_facts: formData.fun_facts,
      user_id: formData.user_id,
    };

    if (agent) {
      // For updating an existing agent
      updateAgent(agent.id, agentData);
      console.log('Updated agent:', agentData);
    } else {
      // For creating a new agent, add it to localStorage
      const newAgent = addAgent(agentData);
      console.log('Created new agent:', newAgent);
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="E.g., Coffee Shop Guide"
          required
        />
      </div>

      <div>
        <label htmlFor="personality" className="block text-sm font-medium text-gray-200">
          Personality
        </label>
        <textarea
          name="personality"
          id="personality"
          value={formData.personality}
          onChange={handleChange}
          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white h-32"
          placeholder="Describe your agent's personality, tone, and backstory..."
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-200">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white h-32"
          placeholder="Describe what your agent does and how it helps users..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Location
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="latitude"
              id="latitude"
              value={formData.latitude.toString()}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              placeholder="E.g., 30.2672"
              step="any"
              required
            />
          </div>
          <div>
            <input
              type="number"
              name="longitude"
              id="longitude"
              value={formData.longitude.toString()}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              placeholder="E.g., -97.7431"
              step="any"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-200">
          Agent Image
        </label>
        <div className="mt-2 space-y-4">
          {imagePreview && (
            <div className="relative w-32 h-32">
              <img
                src={imagePreview}
                alt="Agent preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image_url: '' }));
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
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
              className="block w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white text-center cursor-pointer hover:bg-gray-700"
            >
              Upload Image
            </label>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or</span>
              </div>
            </div>
            
            <input
              type="text"
              name="image_url"
              id="image_url"
              value={formData.image_url}
              onChange={handleImageUrlChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              placeholder="Enter image URL"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
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
                className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-200">{source.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="twitter_handle" className="block text-sm font-medium text-gray-200">
          Twitter Handle
        </label>
        <input
          type="text"
          name="twitter_handle"
          id="twitter_handle"
          value={formData.twitter_handle}
          onChange={handleChange}
          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="@username"
        />
      </div>

      <div>
        <label htmlFor="likes" className="block text-sm font-medium text-gray-200">
          Likes (comma-separated)
        </label>
        <input
          type="text"
          name="likes"
          id="likes"
          value={formData.likes.join(', ')}
          onChange={(e) => {
            const likesArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
            setFormData(prev => ({ ...prev, likes: likesArray }));
          }}
          className="mt-1 block w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="Enter likes separated by commas"
        />
      </div>

      <div>
        <label htmlFor="dislikes" className="block text-sm font-medium text-gray-200">
          Dislikes (comma-separated)
        </label>
        <input
          type="text"
          name="dislikes"
          id="dislikes"
          value={formData.dislikes.join(', ')}
          onChange={(e) => {
            const dislikesArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
            setFormData(prev => ({ ...prev, dislikes: dislikesArray }));
          }}
          className="mt-1 block w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="Enter dislikes separated by commas"
        />
      </div>

      <div>
        <label htmlFor="fun_facts" className="block text-sm font-medium text-gray-200">
          Fun Facts
        </label>
        <textarea
          name="fun_facts"
          id="fun_facts"
          value={formData.fun_facts.join(', ')}
          onChange={(e) => {
            const funFacts = e.target.value.split(',').map((item) => item.trim()).filter(Boolean);
            setFormData((prev) => ({ ...prev, fun_facts: funFacts }));
          }}
          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="Comma-separated list of fun facts about the agent"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
          className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-200">
          Active
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
} 