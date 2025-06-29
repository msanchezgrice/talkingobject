'use client';

import { useEffect, useState } from 'react';
import { PlaceholderAgent } from '../../lib/placeholder-agents';

interface DatabaseTweet {
  id: number;
  agent_id: string;
  payload: string;
  posted_at: string;
  twitter_id: string;
  agent_name?: string;
  agent_slug?: string;
  agent_image_url?: string;
}

interface AgentTweetsProps {
  agent: PlaceholderAgent;
}

export default function AgentTweets({ agent }: AgentTweetsProps) {
  const [tweets, setTweets] = useState<DatabaseTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentTweets = async () => {
      try {
        setError(null);
        // Fetch tweets for this specific agent from the database
        const response = await fetch(`/api/tweets?limit=10&agent=${agent.slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tweets');
        }
        
        const data = await response.json();
        // Filter tweets for this specific agent
        const agentTweets = (data.tweets || []).filter((tweet: DatabaseTweet) => 
          tweet.agent_slug === agent.slug || tweet.agent_id === agent.id
        );
        setTweets(agentTweets);
      } catch (err) {
        console.error('Error fetching agent tweets:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tweets');
        // Keep empty array if error
        setTweets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentTweets();
  }, [agent.id, agent.slug]);

  // Format date for display (e.g., "2h ago", "Apr 12", etc.)
  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Recent Tweets</h2>
        <a href="/feed" className="text-sm text-blue-400 hover:text-blue-300">
          View all
        </a>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-gray-400">
            <p>Unable to load tweets</p>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
          </div>
        ) : tweets.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>No tweets yet from {agent.name}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {tweets.slice(0, 3).map(tweet => (
              <div key={tweet.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-400 text-sm">@{agent.slug}</div>
                  <div className="text-gray-500 text-xs">{formatDate(tweet.posted_at)}</div>
                </div>
                <div className="text-white mb-3">{tweet.payload}</div>
                <div className="flex text-gray-400 text-sm space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span className="text-gray-500">—</span>
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span className="text-gray-500">—</span>
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    <span className="text-gray-500">—</span>
                  </span>
                </div>
              </div>
            ))}
            
            {tweets.length > 3 && (
              <div className="text-center pt-2">
                <a href="/feed" className="text-blue-400 hover:text-blue-300 text-sm">
                  View {tweets.length - 3} more {tweets.length - 3 === 1 ? 'tweet' : 'tweets'}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 