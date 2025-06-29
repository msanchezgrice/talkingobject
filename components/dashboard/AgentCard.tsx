'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { DatabaseAgent, deleteAgent } from '@/lib/database/agents';
import { ClerkDatabaseAgent, deleteClerkAgent } from '@/lib/database/clerk-agents';
import { supabase } from '@/lib/supabase/client';
import { VoicePlayer } from '@/components/VoicePlayer';
import Image from 'next/image';

interface AgentCardProps {
  agent: DatabaseAgent | ClerkDatabaseAgent;
  onUpdate?: () => void;
}

interface AgentAnalytics {
  totalConversations: number;
  totalMessages: number;
  conversationsLast24h: number;
  totalTweets: number;
}

export function AgentCard({ agent, onUpdate }: AgentCardProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/agent/${agent.id}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching agent analytics:', error);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [agent.id]);

  const handleEditClick = () => {
    router.push(`/agent/${agent.slug}/edit`);
  };

  const handleViewClick = () => {
    console.log('🔍 [AGENT-CARD] View button clicked for agent:', {
      name: agent.name,
      slug: agent.slug,
      id: agent.id,
      targetUrl: `/agent/${agent.slug}`
    });
    router.push(`/agent/${agent.slug}`);
  };

  const handleConversationsClick = () => {
    router.push(`/dashboard/conversations/${agent.id}`);
  };

  const handleToggleActive = async () => {
    setIsUpdating(true);
    try {
      // Call API to update agent active status
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !agent.is_active
        }),
      });

      if (response.ok) {
        onUpdate?.();
      } else {
        console.error('Failed to update agent status');
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      let success = false;

      // Check if this is a Clerk agent or Supabase agent
      if ('clerk_user_id' in agent && agent.clerk_user_id) {
        // This is a Clerk agent - use Clerk delete function
        if (!user?.id) {
          throw new Error('User authentication required');
        }
        success = await deleteClerkAgent(agent.id, user.id);
      } else {
        // This is a Supabase agent - use traditional auth
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session?.user) {
          throw new Error('Authentication required');
        }

        success = await deleteAgent(agent.id, session.user.id);
      }
      
      if (success) {
        onUpdate?.();
      } else {
        console.error('Failed to delete agent');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const formatLocation = () => {
    if (agent.latitude && agent.longitude) {
      return `${agent.latitude.toFixed(4)}, ${agent.longitude.toFixed(4)}`;
    }
    return 'No location set';
  };

  const getAgentInitials = () => {
    return agent.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/80 transition-all duration-300 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {agent.image_url ? (
                <Image 
                  src={agent.image_url} 
                  alt={agent.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {getAgentInitials()}
                </div>
              )}
              {agent.is_active && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500">
                {formatLocation()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${agent.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
              <button
                onClick={handleToggleActive}
                disabled={isUpdating}
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md transition-transform ${agent.is_active ? 'translate-x-6' : 'translate-x-1'} ${isUpdating ? 'opacity-50' : ''}`}
              >
                <span className="sr-only">Toggle active</span>
              </button>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {agent.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="flex-grow mb-4">
          <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
            {agent.description || 'No description provided'}
          </p>
          
          {agent.interests && agent.interests.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {agent.interests.slice(0, 3).map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100/70 text-blue-700 text-xs font-medium rounded-full border border-blue-200/50">
                    {interest}
                  </span>
                ))}
                {agent.interests.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100/70 text-gray-600 text-xs font-medium rounded-full border border-gray-200/50">
                    +{agent.interests.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs text-gray-500 bg-gray-50/50 rounded-xl p-3 border border-gray-200/30">
            <div className="flex justify-between">
              <span>Created:</span>
              <span className="font-medium">{new Date(agent.created_at).toLocaleDateString()}</span>
            </div>
            {analytics && !loadingAnalytics && (
              <>
                <div className="flex justify-between">
                  <span>Total Chats:</span>
                  <span className="font-medium">{analytics.totalConversations}</span>
                </div>
                <div className="flex justify-between">
                  <span>24h Chats:</span>
                  <span className="font-medium">{analytics.conversationsLast24h}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tweets:</span>
                  <span className="font-medium">{analytics.totalTweets}</span>
                </div>
              </>
            )}
            {loadingAnalytics && (
              <div className="flex justify-center py-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
            {agent.fee_amount > 0 && (
              <div className="flex justify-between">
                <span>Fee:</span>
                <span className="font-medium">{agent.fee_amount} {agent.fee_token}</span>
              </div>
            )}
          </div>

          {/* Analytics Summary */}
          {analytics && !loadingAnalytics && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-200/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Performance</h4>
                <button
                  onClick={handleConversationsClick}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  View History →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{analytics.totalMessages}</div>
                  <div className="text-gray-500">Messages</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{analytics.conversationsLast24h}</div>
                  <div className="text-gray-500">Recent</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        <div className="flex justify-between items-center w-full mb-4">
          <div className="flex gap-2">
            <button 
              onClick={handleViewClick}
              className="px-4 py-2 bg-blue-100/70 hover:bg-blue-200/70 text-blue-700 text-sm font-medium rounded-full transition-colors duration-200 border border-blue-200/50"
            >
              View
            </button>
            <button 
              onClick={handleEditClick}
              className="px-4 py-2 bg-purple-100/70 hover:bg-purple-200/70 text-purple-700 text-sm font-medium rounded-full transition-colors duration-200 border border-purple-200/50"
            >
              Edit
            </button>
            <button 
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-100/70 hover:bg-red-200/70 text-red-700 text-sm font-medium rounded-full transition-colors duration-200 border border-red-200/50 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          <VoicePlayer
            text={`Hi, I'm ${agent.name}. ${agent.description || agent.personality}`}
            category="businesses"
            agentId={agent.slug}
          />
        </div>

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="w-full p-4 bg-red-50/70 backdrop-blur-sm border-2 border-red-200 rounded-2xl shadow-lg">
            <p className="text-sm text-red-800 mb-4 font-medium">
              Are you sure you want to delete this agent? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 