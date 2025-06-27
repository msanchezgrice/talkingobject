import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Core interfaces for AI provider abstraction
export interface AIMessage { 
  role: 'user' | 'assistant' | 'system'; 
  content: string;
}

export interface LLMTool { 
  name: string; 
  schema: unknown;
}

export interface TTSOptions {
  voice?: string;
  model?: string;
  speed?: number;
}

export interface AIProvider {
  name: string;
  chatLLM(messages: AIMessage[]): Promise<AIMessage>;
  textToSpeech?(text: string, options?: TTSOptions): Promise<ArrayBuffer>;
}

// Initialize providers
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Anthropic Claude provider implementation
export const claudeProvider: AIProvider = {
  name: 'claude',
  async chatLLM(messages: AIMessage[]): Promise<AIMessage> {
    try {
      // Convert messages format for Claude API
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');
      
      const claudeMessages = conversationMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      const completion = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: systemMessage?.content || '',
        messages: claudeMessages,
        // Tools support can be added here when needed
      });

      // Extract response text
      let responseText = "I apologize, but I could not generate a proper response.";
      if (completion.content && completion.content.length > 0) {
        const firstContent = completion.content[0];
        if (firstContent.type === 'text') {
          responseText = firstContent.text;
        }
      }

      return {
        role: 'assistant',
        content: responseText
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
};

// OpenAI provider implementation
export const openaiProvider: AIProvider = {
  name: 'openai',
  async chatLLM(messages: AIMessage[]): Promise<AIMessage> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 2000,
        stream: false, // Can be made configurable later
        // Tools support can be added here when needed
      });

      const responseContent = completion.choices[0]?.message?.content || 
        "I apologize, but I could not generate a proper response.";

      return {
        role: 'assistant',
        content: responseContent
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  },

  async textToSpeech(text: string, options?: TTSOptions): Promise<ArrayBuffer> {
    try {
      const response = await openai.audio.speech.create({
        model: options?.model || 'tts-1',
        voice: (options?.voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer') || 'alloy',
        input: text,
        speed: options?.speed || 1.0,
      });

      return await response.arrayBuffer();
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw error;
    }
  }
};

// Main function to get the appropriate provider
export function getAIProvider(): AIProvider {
  const useAnthropic = process.env.NEXT_PUBLIC_USE_ANTHROPIC !== 'false';
  return useAnthropic ? claudeProvider : openaiProvider;
}

// Main chat function that uses the configured provider
export async function chatLLM(
  messages: AIMessage[]
): Promise<AIMessage> {
  const provider = getAIProvider();
  return provider.chatLLM(messages);
}

// TTS function that uses OpenAI by default (since Claude doesn't have TTS)
export async function textToSpeech(
  text: string, 
  options?: TTSOptions
): Promise<ArrayBuffer> {
  // Always use OpenAI for TTS since Claude doesn't support it
  return openaiProvider.textToSpeech!(text, options);
} 