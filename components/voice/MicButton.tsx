'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface PlaceholderAgent {
  id?: string;
  slug: string;
  name: string;
  personality: string;
  latitude?: number;
  longitude?: number;
  category?: string;
}

interface MicButtonProps {
  agent: PlaceholderAgent;
  conversationId: string;
  onTranscript?: (transcript: string) => void;
  onResponse?: (response: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export default function MicButton({
  agent,
  conversationId,
  onTranscript,
  onResponse,
  onError,
  disabled = false
}: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any currently playing audio
  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Play audio response
  const playAudioResponse = useCallback(async (audioBuffer: ArrayBuffer) => {
    try {
      // Stop any currently playing audio first
      stopCurrentAudio();
      
      setIsPlaying(true);
      
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        onError?.('Failed to play audio response');
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      currentAudioRef.current = null;
      onError?.('Failed to play audio response');
    }
  }, [onError, stopCurrentAudio]);

  // Send audio to voice API
  const sendAudioToAPI = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('agent', JSON.stringify(agent));
      formData.append('conversationId', conversationId);
      
      console.log('🎤 Sending audio to voice API...');
      const response = await fetch(`/api/voice/${agent.id || agent.slug}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Voice API request failed');
      }
      
      // Get transcript and response text from headers
      const transcript = response.headers.get('X-Transcript') || '';
      const responseText = response.headers.get('X-Response-Text') || '';
      
      console.log('🎤 Transcript:', transcript);
      console.log('🧠 Response:', responseText);
      
      // Notify parent components
      onTranscript?.(transcript);
      onResponse?.(responseText);
      
      // Play the audio response
      const audioBuffer = await response.arrayBuffer();
      await playAudioResponse(audioBuffer);
      
    } catch (error) {
      console.error('Voice API error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Voice processing failed';
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [agent, conversationId, onTranscript, onResponse, onError, playAudioResponse]);

  // Initialize audio recording with improved settings for speech recognition
  const initializeRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100, // Higher sample rate for better quality
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true, // Helps with volume normalization
        },
      });
      
      streamRef.current = stream;
      
      // Try to use higher quality audio formats
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let selectedMimeType = 'audio/webm;codecs=opus';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: selectedMimeType,
        });
        
        await sendAudioToAPI(audioBlob);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      return mediaRecorder;
    } catch (error) {
      console.error('Failed to initialize recording:', error);
      setAudioEnabled(false);
      onError?.('Microphone access denied. Please enable microphone permissions.');
      throw error;
    }
  }, [sendAudioToAPI, onError]);

  // Start recording - stop any playing audio first
  const startRecording = useCallback(async () => {
    if (disabled || !audioEnabled || isProcessing) return;
    
    // Stop any currently playing audio before starting recording
    stopCurrentAudio();
    
    try {
      const mediaRecorder = await initializeRecording();
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      // Recording initialization failed, audio is disabled
    }
  }, [disabled, audioEnabled, isProcessing, initializeRecording, stopCurrentAudio]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Handle mouse/touch events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    startRecording();
  }, [startRecording]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    stopRecording();
  }, [stopRecording]);

  // Determine button state and appearance
  const getButtonState = () => {
    if (!audioEnabled) return 'disabled';
    if (isProcessing) return 'processing';
    if (isRecording) return 'recording';
    if (isPlaying) return 'playing';
    return 'idle';
  };

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={disabled || !audioEnabled || isProcessing}
        className={`
          relative flex items-center justify-center w-16 h-16 rounded-full
          border-2 transition-all duration-200 touch-none select-none
          ${buttonState === 'recording' 
            ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/50' 
            : buttonState === 'processing'
            ? 'bg-yellow-500 border-yellow-400 animate-pulse'
            : buttonState === 'playing'
            ? 'bg-green-500 border-green-400 animate-pulse'
            : buttonState === 'disabled'
            ? 'bg-gray-600 border-gray-500 cursor-not-allowed'
            : 'bg-blue-600 border-blue-500 hover:bg-blue-500 active:scale-95'
          }
        `}
        title={
          !audioEnabled 
            ? 'Microphone access denied' 
            : isRecording 
            ? 'Release to send'
            : isPlaying
            ? 'Hold to interrupt and record'
            : 'Hold to talk'
        }
      >
        {buttonState === 'disabled' ? (
          <MicOff className="w-6 h-6 text-gray-300" />
        ) : buttonState === 'playing' ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
        
        {isRecording && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse" />
        )}
      </button>
      
      <div className="text-xs text-gray-400 text-center min-h-[1rem]">
        {buttonState === 'disabled' && 'Mic disabled'}
        {buttonState === 'recording' && 'Recording...'}
        {buttonState === 'processing' && 'Processing...'}
        {buttonState === 'playing' && 'Playing response'}
        {buttonState === 'idle' && 'Hold to talk'}
      </div>
      
      <button
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
        title={audioEnabled ? 'Disable voice' : 'Enable voice'}
      >
        {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        {audioEnabled ? 'Voice on' : 'Voice off'}
      </button>
    </div>
  );
} 