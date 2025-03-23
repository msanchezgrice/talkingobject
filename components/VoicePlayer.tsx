'use client';

import { useState } from 'react';
import { textToSpeech } from '@/lib/elevenlabs';
import { Loader2, Volume2, AlertCircle } from 'lucide-react';
import { voiceConfigs } from '@/lib/voices';

type VoicePlayerProps = {
  text: string;
  category: keyof typeof voiceConfigs;
  agentId: string;
  className?: string;
};

export function VoicePlayer({ text, category, agentId, className }: VoicePlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert agent ID to the format used in voice configs
      const voiceKey = agentId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      // Get the voice configuration for this agent
      const categoryConfig = voiceConfigs[category];
      const voiceConfig = categoryConfig[voiceKey as keyof typeof categoryConfig];

      if (!voiceConfig) {
        throw new Error('Voice configuration not found for this agent');
      }

      // Play the audio using the textToSpeech function
      await textToSpeech(text, voiceConfig.voice_id, voiceConfig.settings);
    } catch (err) {
      console.error('Error playing voice:', err);
      setError('Failed to play voice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className={`inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition-colors ${className || ''}`}
      title="Play voice message"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      ) : error ? (
        <AlertCircle className="h-4 w-4 text-red-500" />
      ) : (
        <Volume2 className="h-4 w-4 text-gray-400" />
      )}
    </button>
  );
} 