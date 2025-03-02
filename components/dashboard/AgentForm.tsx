'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { addAgent, updateAgent, PlaceholderAgent, PUBLIC_USER_ID } from '@/lib/placeholder-agents';

// Data sources available to agents
const DATA_SOURCES = [
  { id: 'weather', name: 'Weather', description: 'Access current weather conditions and forecasts for the agent\'s location.' },
  { id: 'news', name: 'News', description: 'Access recent news relevant to the agent\'s location or topic.' },
  { id: 'events', name: 'Local Events', description: 'Access information about events happening near the agent\'s location.' },
  { id: 'stocks', name: 'Stock Prices', description: 'Access current stock market data and financial information.' }
];

type AgentFormProps = {
  agent?: PlaceholderAgent; // If provided, we're editing an existing agent
};

export default function AgentForm({ agent }: AgentFormProps = {}) {
  const isEditing = !!agent;
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState(agent?.name || '');
  const [slug, setSlug] = useState(agent?.slug || '');
  const [personality, setPersonality] = useState(agent?.personality || '');
  const [latitude, setLatitude] = useState(agent?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(agent?.longitude?.toString() || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(agent?.image_url || null);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>(agent?.data_sources || []);
  
  // Form processing state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate slug from name
  useEffect(() => {
    if (!isEditing && name && !slug) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [name, slug, isEditing]);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Toggle data source selection
  const toggleDataSource = (sourceId: string) => {
    if (selectedDataSources.includes(sourceId)) {
      setSelectedDataSources(selectedDataSources.filter(id => id !== sourceId));
    } else {
      setSelectedDataSources([...selectedDataSources, sourceId]);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!name || !slug || !personality) {
        throw new Error('Please fill in all required fields');
      }
      
      // Use our public user ID
      const publicUserId = PUBLIC_USER_ID;
      
      let imageUrl = agent?.image_url || undefined;
      
      // Use placeholder image
      if (imageFile) {
        imageUrl = '/images/placeholder.jpg';
      }
      
      // Prepare agent data
      const agentData = {
        name,
        slug,
        personality,
        description: personality, // Use personality as description too
        interests: ['custom'], // Default interests
        is_active: true,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        image_url: imageUrl,
        data_sources: selectedDataSources,
        user_id: publicUserId
      };
      
      if (isEditing && agent) {
        // For editing, update the agent in localStorage
        const updatedAgent = updateAgent(agent.id, agentData);
        console.log('Updated agent:', updatedAgent);
      } else {
        // For creating a new agent, add it to localStorage
        const newAgent = addAgent(agentData);
        console.log('Created new agent:', newAgent);
      }
      
      // Navigate back to dashboard
      router.push('/dashboard');
      
    } catch (err: unknown) {
      let errorMessage = 'An error occurred while saving the agent';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white shadow-md rounded-lg p-6">
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700">Basic Information</h3>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">Agent Name*</label>
          <input 
            type="text" 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            placeholder="E.g., Coffee Shop Guide"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium mb-1 text-gray-300">URL Slug*</label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">{process.env.NEXT_PUBLIC_BASE_URL}/agent/</span>
            <input 
              type="text" 
              id="slug" 
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              placeholder="coffee-shop-guide"
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">This will be used for your agent&apos;s unique URL.</p>
        </div>

        <div className="mb-4">
          <label htmlFor="personality" className="block text-sm font-medium mb-1 text-gray-300">Personality*</label>
          <textarea 
            id="personality" 
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white h-32"
            placeholder="Describe your agent's personality, tone, and backstory..."
            required
          ></textarea>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium mb-1 text-gray-300">Latitude</label>
            <input 
              type="text" 
              id="latitude" 
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              placeholder="E.g., 37.7749"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium mb-1 text-gray-300">Longitude</label>
            <input 
              type="text" 
              id="longitude" 
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              placeholder="E.g., -122.4194"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This location will be used to provide contextual information for your agent.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700">Appearance</h3>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium mb-1 text-gray-300">Agent Image</label>
          
          {imagePreview ? (
            <div className="mb-4">
              <div className="relative w-32 h-32 mx-auto mb-2 border rounded-md overflow-hidden">
                <Image 
                  src={imagePreview} 
                  alt="Agent preview" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
              <button 
                type="button" 
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="block mx-auto text-sm text-red-600 hover:underline"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-700 rounded-md p-4 text-center">
              <p className="mb-2 text-gray-400">Drag and drop an image here, or click to select</p>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label 
                htmlFor="image"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1 px-3 rounded-md cursor-pointer inline-block"
              >
                Upload Image
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700">External Data Sources</h3>
        <p className="mb-4 text-sm text-gray-400">
          Select which external data sources your agent can access to inform its responses.
        </p>
        
        <div className="space-y-3">
          {DATA_SOURCES.map((source) => (
            <div key={source.id} className="flex items-start">
              <input 
                type="checkbox" 
                id={source.id} 
                checked={selectedDataSources.includes(source.id)}
                onChange={() => toggleDataSource(source.id)}
                className="mt-1 mr-2"
              />
              <div>
                <label htmlFor={source.id} className="font-medium text-white">{source.name}</label>
                <p className="text-sm text-gray-400">{source.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Link 
          href="/dashboard" 
          className="border border-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md transition-colors text-gray-300"
        >
          Cancel
        </Link>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
} 