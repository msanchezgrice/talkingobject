'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ConversationDetail {
  id: string;
  conversation_id: string;
  started_at: string;
  last_activity_at: string;
  message_count: number;
  is_active: boolean;
  messages: Message[];
}

interface Agent {
  id: string;
  name: string;
  slug: string;
}

export default function ConversationDetailPage() {
  const params = useParams();
  const { isLoaded, isSignedIn } = useUser();
  
  const agentId = params.id as string;
  const conversationId = params.conversationId as string;
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchData = async () => {
      try {
        // Fetch agent details
        const agentResponse = await fetch(`/api/agents/${agentId}`);
        if (!agentResponse.ok) {
          throw new Error('Agent not found');
        }
        const agentData = await agentResponse.json();
        setAgent(agentData);

        // Fetch conversation details
        const conversationResponse = await fetch(`/api/conversations/detail/${conversationId}`);
        if (!conversationResponse.ok) {
          throw new Error('Failed to fetch conversation');
        }
        const conversationData = await conversationResponse.json();
        setConversation(conversationData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, agentId, conversationId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-purple-600 animate-spin animate-reverse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-white/20 max-w-md mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view conversation details.</p>
            <Link href="/sign-in" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50/70 backdrop-blur-sm border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg max-w-md mx-auto mt-20">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
            <div className="mt-4">
              <Link href={`/dashboard/conversations/${agentId}`} className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Conversations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-white/20 max-w-md mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-4">Conversation Not Found</h2>
            <p className="text-gray-600 mb-6">This conversation could not be found.</p>
            <Link href={`/dashboard/conversations/${agentId}`} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block">
              Back to Conversations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href={`/dashboard/conversations/${agentId}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Conversation Details
              </h1>
            </div>
            {agent && (
              <p className="text-gray-600 text-lg">
                {agent.name} • Conversation #{conversation.conversation_id.slice(-8)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${conversation.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {conversation.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Conversation Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Started:</span>
              <p className="font-medium">{formatDate(conversation.started_at)}</p>
            </div>
            <div>
              <span className="text-gray-500">Last Activity:</span>
              <p className="font-medium">{formatDate(conversation.last_activity_at)}</p>
            </div>
            <div>
              <span className="text-gray-500">Messages:</span>
              <p className="font-medium">{conversation.message_count}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl px-6 py-4 rounded-2xl shadow-lg ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12' 
                  : 'bg-white/70 backdrop-blur-sm border border-white/20 text-gray-800 mr-12'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium opacity-75">
                    {message.role === 'user' ? 'User' : agent?.name || 'Agent'}
                  </span>
                  <span className="text-xs opacity-50">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {conversation.messages.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 text-center">
            <p className="text-gray-600">No messages found in this conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
} 