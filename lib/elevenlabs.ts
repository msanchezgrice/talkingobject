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
  
  const agentVoice = categoryVoices[agentId as keyof typeof categoryVoices];
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