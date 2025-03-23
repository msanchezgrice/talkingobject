import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PlaceholderAgent, saveAgent } from '@/lib/placeholder-agents';

interface CreateAgentFormProps {
  agent: PlaceholderAgent;
  onSave: (agent: PlaceholderAgent) => void;
}

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ agent, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(agent?.name || '');
  const [description, setDescription] = useState(agent?.description || '');
  const [personality, setPersonality] = useState(agent?.personality || '');
  const [location, setLocation] = useState(agent?.location || '');
  const [coordinates, setCoordinates] = useState(agent?.coordinates || '');
  const [imageUrl, setImageUrl] = useState(agent?.image_url || '');
  const [twitterHandle, setTwitterHandle] = useState(agent?.twitter_handle || '');
  const [interests, setInterests] = useState<string[]>(agent?.interests || []);
  const [dislikes, setDislikes] = useState<string[]>(agent?.dislikes || []);
  const [funFacts, setFunFacts] = useState<string[]>(agent?.fun_facts || []);

  const handleSave = async () => {
    if (!agent) return;

    setIsSaving(true);
    try {
      // Update the agent with current form values
      const updatedAgent: PlaceholderAgent = {
        ...agent,
        name,
        description,
        personality,
        location,
        coordinates,
        image_url: imageUrl,
        twitter_handle: twitterHandle,
        interests,
        dislikes,
        fun_facts: funFacts,
        updated_at: new Date().toISOString()
      };

      // Save to localStorage
      saveAgent(updatedAgent);

      // Update the agent in the parent component
      onSave(updatedAgent);

      // Show success message
      toast.success('Agent saved successfully!');
    } catch (error) {
      console.error('Error saving agent:', error);
      toast.error('Failed to save agent. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="personality" className="block text-sm font-medium text-gray-700">
          Personality
        </label>
        <textarea
          id="personality"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700">
          Coordinates
        </label>
        <input
          type="text"
          id="coordinates"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700">
          Twitter Handle
        </label>
        <input
          type="text"
          id="twitterHandle"
          value={twitterHandle}
          onChange={(e) => setTwitterHandle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Interests
        </label>
        <div className="mt-1 space-y-2">
          {interests.map((interest, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={interest}
                onChange={(e) => {
                  const newInterests = [...interests];
                  newInterests[index] = e.target.value;
                  setInterests(newInterests);
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setInterests(interests.filter((_, i) => i !== index))}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setInterests([...interests, ''])}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Interest
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dislikes
        </label>
        <div className="mt-1 space-y-2">
          {dislikes.map((dislike, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={dislike}
                onChange={(e) => {
                  const newDislikes = [...dislikes];
                  newDislikes[index] = e.target.value;
                  setDislikes(newDislikes);
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setDislikes(dislikes.filter((_, i) => i !== index))}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDislikes([...dislikes, ''])}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Dislike
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fun Facts
        </label>
        <div className="mt-1 space-y-2">
          {funFacts.map((fact, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={fact}
                onChange={(e) => {
                  const newFacts = [...funFacts];
                  newFacts[index] = e.target.value;
                  setFunFacts(newFacts);
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setFunFacts(funFacts.filter((_, i) => i !== index))}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFunFacts([...funFacts, ''])}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Fun Fact
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Agent'}
        </button>
      </div>
    </div>
  );
};

export default CreateAgentForm; 