'use client';

import { useState } from 'react';
import { textToSpeech, getVoiceConfig } from '@/lib/elevenlabs';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2 } from 'lucide-react';
import { voiceConfigs } from '@/lib/voices';

interface VoicePlayerProps {
  text: string;
  category: keyof typeof voiceConfigs;
  agentId: string;
}

export function VoicePlayer({ text, category, agentId }: VoicePlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert agent ID to the format used in voice configs
      const voiceConfig = getVoiceConfig(category, agentId);
      if (!voiceConfig) {
        console.error('Voice config not found for:', { category, agentId });
        throw new Error(`Voice configuration not found for ${category}`);
      }

      const url = await textToSpeech(
        text,
        voiceConfig.voice_id,
        voiceConfig.settings
      );

      // Play the audio
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      console.error('Speech generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePlay}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
} 