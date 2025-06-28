import { voiceConfigs } from './voices';

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const API_URL = 'https://api.elevenlabs.io/v1';

export interface VoiceConfig {
  voice_id: string;
  settings: {
    stability: number;
    similarity_boost: number;
  };
}

export interface TextToSpeechRequest {
  text: string;
  voice_id: string;
  model_id: string;
  voice_settings: {
    stability: number;
    similarity_boost: number;
  };
}

export const getVoiceConfig = (category: keyof typeof voiceConfigs, agentId: string): VoiceConfig | null => {
  const categoryVoices = voiceConfigs[category];
  if (!categoryVoices) return null;
  
  // Convert agent slug to camelCase for voice config key
  const agentKey = agentId
    .split('-')
    .map((word, index) => 
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
  
  // Try exact match first
  let agentVoice = categoryVoices[agentKey as keyof typeof categoryVoices];
  
  // If no exact match, try matching by removing spaces and special characters
  if (!agentVoice) {
    const normalizedKey = agentKey.replace(/[^a-zA-Z0-9]/g, '');
    const voiceKey = Object.keys(categoryVoices).find(key => 
      key.toLowerCase() === normalizedKey.toLowerCase()
    );
    if (voiceKey) {
      agentVoice = categoryVoices[voiceKey as keyof typeof categoryVoices];
    }
  }
  
  // If still no match, use the first voice in the category as fallback
  if (!agentVoice) {
    // Prefer 'default' voice if available
    if ('default' in categoryVoices) {
      agentVoice = categoryVoices['default' as keyof typeof categoryVoices];
      console.log(`Using default voice for ${agentId} in ${category}`);
    } else {
      // Otherwise use the first voice in the category
      const firstVoiceKey = Object.keys(categoryVoices)[0];
      if (firstVoiceKey) {
        agentVoice = categoryVoices[firstVoiceKey as keyof typeof categoryVoices];
        console.log(`Using fallback voice for ${agentId} in ${category}: ${firstVoiceKey}`);
      }
    }
  }
  
  return agentVoice || null;
};

export const textToSpeech = async (text: string, voiceId: string, settings: { stability: number; similarity_boost: number }) => {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key is not configured');
  }

  const response = await fetch(`${API_URL}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: settings,
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}; 