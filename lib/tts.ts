import { textToSpeech as openaiTTS, TTSOptions } from './aiProvider';
import { textToSpeech as elevenLabsTTS, getVoiceConfig } from './elevenlabs';

export interface TTSProvider {
  name: string;
  textToSpeech(text: string, options?: TTSProviderOptions): Promise<ArrayBuffer>;
}

export interface TTSProviderOptions {
  voice?: string;
  model?: string;
  speed?: number;
  agentId?: string;
  category?: string;
}

// OpenAI TTS Provider
export const openaiTTSProvider: TTSProvider = {
  name: 'openai',
  async textToSpeech(text: string, options?: TTSProviderOptions): Promise<ArrayBuffer> {
    const ttsOptions: TTSOptions = {
      voice: options?.voice || 'alloy',
      model: options?.model || 'tts-1',
      speed: options?.speed || 1.0,
    };
    
    return openaiTTS(text, ttsOptions);
  }
};

// ElevenLabs TTS Provider
export const elevenLabsTTSProvider: TTSProvider = {
  name: 'elevenlabs',
  async textToSpeech(text: string, options?: TTSProviderOptions): Promise<ArrayBuffer> {
    try {
      // Get voice configuration for the agent
      let voiceId = 'default';
      let settings = { stability: 0.75, similarity_boost: 0.75 };
      
      if (options?.category && options?.agentId) {
        const voiceConfig = getVoiceConfig(options.category as keyof typeof import('./voices').voiceConfigs, options.agentId);
        if (voiceConfig) {
          voiceId = voiceConfig.voice_id;
          settings = voiceConfig.settings;
        }
      }
      
      // ElevenLabs textToSpeech returns a URL, we need to convert to ArrayBuffer
      const audioUrl = await elevenLabsTTS(text, voiceId, settings);
      
      // Fetch the audio and convert to ArrayBuffer
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      
      return await response.arrayBuffer();
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      // Fallback to OpenAI TTS
      return openaiTTSProvider.textToSpeech(text, options);
    }
  }
};

// Get TTS provider based on environment configuration
export function getTTSProvider(): TTSProvider {
  const useElevenLabs = process.env.NEXT_PUBLIC_USE_ELEVENLABS === 'true';
  return useElevenLabs ? elevenLabsTTSProvider : openaiTTSProvider;
}

// Main TTS function that uses the configured provider
export async function generateTTS(
  text: string, 
  options?: TTSProviderOptions
): Promise<ArrayBuffer> {
  const provider = getTTSProvider();
  return provider.textToSpeech(text, options);
}

// Helper to determine optimal TTS provider for an agent
export function getOptimalTTSProvider(agentCategory?: string): TTSProvider {
  // ElevenLabs is optimal for agents with configured voices
  if (agentCategory && process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
    return elevenLabsTTSProvider;
  }
  
  // OpenAI as fallback
  return openaiTTSProvider;
} 