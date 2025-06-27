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

// Helper function to safely encode header values
const encodeHeaderValue = (value: string): string => {
  // Remove or replace problematic characters for HTTP headers
  return value
    .replace(/[\r\n]/g, ' ') // Replace newlines with spaces
    .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
    .slice(0, 1000); // Limit length to prevent oversized headers
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
    
    // Validate audio file
    if (!audioFile.type.includes('audio') && !audioFile.type.includes('webm')) {
      return NextResponse.json(
        { error: 'Invalid audio file format. Please try recording again.' },
        { status: 400 }
      );
    }
    
    console.log('🎤 Processing voice request for agent:', agent.name);
    console.log('🎤 Audio file type:', audioFile.type, 'Size:', audioFile.size);
    
    // Step 1: Convert audio to text using Whisper
    console.log('🎤 Transcribing audio with Whisper...');
    
    let userMessage: string;
    try {
      // Create a new File object with the correct type for Whisper
      const audioBuffer = await audioFile.arrayBuffer();
      const whisperFile = new File([audioBuffer], 'audio.webm', { 
        type: 'audio/webm' 
      });
      
      const transcription = await getOpenAI().audio.transcriptions.create({
        file: whisperFile,
        model: 'whisper-1',
        language: 'en', // Explicitly set to English for better accuracy
        prompt: `This is a conversation with ${agent.name}, an AI agent representing a location in Austin, Texas. The user is speaking about travel, places, recommendations, or asking questions about Austin landmarks and attractions.`, // Context for better recognition
        response_format: 'verbose_json', // Get more detailed response with confidence
        temperature: 0.0, // Lower temperature for more consistent results
      });
      
      // Handle both verbose_json and text response formats
      userMessage = typeof transcription === 'string' ? transcription : transcription.text;
      
      // Log confidence if available (verbose_json format)
      if (typeof transcription === 'object' && 'segments' in transcription && transcription.segments) {
        console.log('🎤 Transcription confidence available:', transcription.segments.length > 0);
      }
      
    } catch (whisperError) {
      console.error('Whisper transcription error:', whisperError);
      return NextResponse.json(
        { error: 'Failed to transcribe audio. Please try speaking more clearly.' },
        { status: 500 }
      );
    }
    console.log('🎤 Transcribed:', userMessage);
    
    if (!userMessage?.trim()) {
      return NextResponse.json(
        { error: 'No speech detected in audio. Please try again.' },
        { status: 400 }
      );
    }
    
    // Step 2: Generate AI response using existing chat system
    console.log('🧠 Generating AI response...');
    const systemPrompt = `You are "${agent.name}", an AI agent with the following personality: ${agent.personality}

Your current location is: ${agent.latitude ? `Latitude: ${agent.latitude}, Longitude: ${agent.longitude}` : 'Unknown'}

This is a VOICE conversation, so respond naturally as if speaking aloud. Be conversational, friendly, and engaging. Keep responses concise (2-3 sentences max) but informative. Avoid using special characters, bullet points, or formatting that doesn't translate well to speech. Use natural speech patterns with appropriate pauses indicated by commas and periods.`;

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
    
    let response;
    try {
      response = await chatLLM(aiMessages);
    } catch (aiError) {
      console.error('AI response error:', aiError);
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 500 }
      );
    }
    
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
    
    let audioBuffer;
    try {
      audioBuffer = await generateTTS(responseText, ttsOptions);
      console.log('🗣️ TTS generated, size:', audioBuffer.byteLength);
    } catch (ttsError) {
      console.error('TTS generation error:', ttsError);
      return NextResponse.json(
        { error: 'Failed to generate voice response. Please try again.' },
        { status: 500 }
      );
    }
    
    // Step 4: Return the audio as a stream with properly encoded headers
    const safeTranscript = encodeHeaderValue(userMessage);
    const safeResponse = encodeHeaderValue(responseText);
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'X-Transcript': safeTranscript,
        'X-Response-Text': safeResponse,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
  } catch (error: unknown) {
    console.error('Voice API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: `Voice processing failed: ${errorMessage}` },
      { status: 500 }
    );
  }
} 