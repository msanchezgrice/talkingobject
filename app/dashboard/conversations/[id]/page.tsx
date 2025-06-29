'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface ConversationSummary {
  id: string;
  conversationId: string;
  startedAt: string;
  lastActivityAt: string;
  messageCount: number;
  summary: string;
  isActive: boolean;
  userPreview: string;
}

interface ConversationResponse {
  conversations: ConversationSummary[];
  count: number;
  hasMore: boolean;
}

export default function ConversationHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  
  const agentId = params.id as string;
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

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

        // Fetch conversations
        const conversationsResponse = await fetch(`/api/conversations/agent/${agentId}`);
        if (!conversationsResponse.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const conversationsData: ConversationResponse = await conversationsResponse.json();
        setConversations(conversationsData.conversations);
        setHasMore(conversationsData.hasMore);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, agentId]);

  const loadMoreConversations = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/conversations/agent/${agentId}?offset=${conversations.length}`);
      if (response.ok) {
        const data: ConversationResponse = await response.json();
        setConversations(prev => [...prev, ...data.conversations]);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error('Error loading more conversations:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
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
            <p className="text-gray-600 mb-6">Please sign in to view conversation history.</p>
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
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Conversation History
              </h1>
            </div>
            {agent && (
              <p className="text-gray-600 text-lg">
                {agent.name} • {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              No Conversations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              This agent hasn&apos;t had any conversations yet. Share the agent&apos;s QR code to get started!
            </p>
            <Link 
              href={`/agent/${agent?.slug}`}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
            >
              View Agent
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${conversation.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <h3 className="font-semibold text-gray-900">
                        Conversation #{conversation.conversationId.slice(-8)}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(conversation.lastActivityAt)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {conversation.userPreview}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{conversation.messageCount} messages</span>
                      <span>•</span>
                      <span>Started {formatDate(conversation.startedAt)}</span>
                      {conversation.isActive && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Active</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-100/70 hover:bg-blue-200/70 text-blue-700 text-sm font-medium rounded-full transition-colors duration-200 border border-blue-200/50">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMoreConversations}
                  disabled={loadingMore}
                  className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 text-gray-800 font-medium py-3 px-8 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:bg-white/80 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    'Load More Conversations'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 