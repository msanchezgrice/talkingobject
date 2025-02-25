'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import type { Agent } from '@/lib/supabase/types';

// Data sources available to agents
const DATA_SOURCES = [
  { id: 'weather', name: 'Weather', description: 'Access current weather conditions and forecasts for the agent\'s location.' },
  { id: 'news', name: 'News', description: 'Access recent news relevant to the agent\'s location or topic.' },
  { id: 'events', name: 'Local Events', description: 'Access information about events happening near the agent\'s location.' },
  { id: 'stocks', name: 'Stock Prices', description: 'Access current stock market data and financial information.' }
];

type AgentFormProps = {
  agent?: Agent; // If provided, we're editing an existing agent
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
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create an agent');
      }
      
      let imageUrl = agent?.image_url || null;
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `agent-images/${session.user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('agents')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('agents')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      // Prepare agent data
      const agentData = {
        name,
        slug,
        personality,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        image_url: imageUrl,
        data_sources: selectedDataSources,
        user_id: session.user.id
      };
      
      // Insert or update agent
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('agents')
          .update(agentData)
          .eq('id', agent.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('agents')
          .insert(agentData);
          
        if (insertError) throw insertError;
      }
      
      // Navigate back to dashboard
      router.push('/dashboard');
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the agent');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b">Basic Information</h3>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">Agent Name*</label>
          <input 
            type="text" 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="E.g., Coffee Shop Guide"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium mb-1">URL Slug*</label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">{process.env.NEXT_PUBLIC_BASE_URL}/agent/</span>
            <input 
              type="text" 
              id="slug" 
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}
              className="w-full p-2 border rounded-md"
              placeholder="coffee-shop-guide"
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">This will be used for your agent&apos;s unique URL.</p>
        </div>

        <div className="mb-4">
          <label htmlFor="personality" className="block text-sm font-medium mb-1">Personality*</label>
          <textarea 
            id="personality" 
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full p-2 border rounded-md h-32"
            placeholder="Describe your agent's personality, tone, and backstory..."
            required
          ></textarea>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium mb-1">Latitude</label>
            <input 
              type="text" 
              id="latitude" 
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="E.g., 37.7749"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium mb-1">Longitude</label>
            <input 
              type="text" 
              id="longitude" 
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="E.g., -122.4194"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This location will be used to provide contextual information for your agent.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b">Appearance</h3>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium mb-1">Agent Image</label>
          
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
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <p className="mb-2">Drag and drop an image here, or click to select</p>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label 
                htmlFor="image"
                className="bg-gray-100 hover:bg-gray-200 text-sm py-1 px-3 rounded-md cursor-pointer inline-block"
              >
                Upload Image
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b">External Data Sources</h3>
        <p className="mb-4 text-sm">
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
                <label htmlFor={source.id} className="font-medium">{source.name}</label>
                <p className="text-sm text-gray-500">{source.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Link 
          href="/dashboard" 
          className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
        >
          Cancel
        </Link>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
} 