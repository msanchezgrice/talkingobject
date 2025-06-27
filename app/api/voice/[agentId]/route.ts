import { NextRequest, NextResponse } from 'next/server';
import { chatLLM, AIMessage } from '@/lib/aiProvider';
import { generateTTS, TTSProviderOptions } from '@/lib/tts';
import OpenAI from 'openai';

// Lazy initialization for server-side safety
let openai: OpenAI | null = null;

const getOpenAI = () => {
  if (typeof window !== 'undefined') {
    throw new Error('OpenAI client should only be used server-side');
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }
  return openai;
};

interface PlaceholderAgent {
  id?: string;
  slug: string;
  name: string;
  personality: string;
  latitude?: number;
  longitude?: number;
  category?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    await params; // Extract params but don't need agentId since we get agent data directly
    
    // Parse the request body
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const agentData = formData.get('agent') as string;
    const conversationId = formData.get('conversationId') as string;
    
    if (!audioFile || !agentData || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required fields: audio, agent, conversationId' },
        { status: 400 }
      );
    }
    
    const agent = JSON.parse(agentData) as PlaceholderAgent;
    
    // Step 1: Convert audio to text using Whisper
    console.log('🎤 Transcribing audio with Whisper...');
    const transcription = await getOpenAI().audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Can be made configurable
    });
    
    const userMessage = transcription.text;
    console.log('🎤 Transcribed:', userMessage);
    
    if (!userMessage.trim()) {
      return NextResponse.json(
        { error: 'No speech detected in audio' },
        { status: 400 }
      );
    }
    
    // Step 2: Generate AI response using existing chat system
    console.log('🧠 Generating AI response...');
    const systemPrompt = `You are "${agent.name}", an AI agent with the following personality: ${agent.personality}

Your current location is: ${agent.latitude ? `Latitude: ${agent.latitude}, Longitude: ${agent.longitude}` : 'Unknown'}

You should respond in a way that matches your personality. Be helpful, accurate, and engaging. Keep responses concise for voice interaction.`;

    const aiMessages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ];
    
    const response = await chatLLM(aiMessages);
    const responseText = response.content;
    console.log('🧠 AI Response:', responseText);
    
    // Step 3: Convert response to speech
    console.log('🗣️ Generating speech with TTS...');
    const ttsOptions: TTSProviderOptions = {
      agentId: agent.id || agent.slug,
      category: agent.category,
      voice: 'alloy', // Default voice, can be made configurable
      speed: 1.0
    };
    
    const audioBuffer = await generateTTS(responseText, ttsOptions);
    console.log('🗣️ TTS generated, size:', audioBuffer.byteLength);
    
    // Step 4: Return the audio as a stream
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'X-Transcript': userMessage, // Include transcript in headers
        'X-Response-Text': responseText, // Include response text in headers
      },
    });
    
  } catch (error: unknown) {
    console.error('Voice API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Helper function removed as it's not currently used 