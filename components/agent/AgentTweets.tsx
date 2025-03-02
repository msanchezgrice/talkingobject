'use client';

import { useEffect, useState } from 'react';
import { Tweet, getTweetsByAgent } from '@/lib/models/tweet';
import { PlaceholderAgent } from '@/lib/placeholder-agents';
import Link from 'next/link';

interface AgentTweetsProps {
  agent: PlaceholderAgent;
}

export default function AgentTweets({ agent }: AgentTweetsProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tweets for this specific agent
    const agentTweets = getTweetsByAgent(agent.id);
    setTweets(agentTweets);
    setLoading(false);
  }, [agent.id]);

  // Format date for display (e.g., "2h ago", "Apr 12", etc.)
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
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
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Recent Tweets</h2>
        <Link href="/feed" className="text-sm text-blue-400 hover:text-blue-300">
          View all
        </Link>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
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
                  <div className="text-gray-500 text-xs">{formatDate(tweet.createdAt)}</div>
                </div>
                <div className="text-white mb-3">{tweet.content}</div>
                <div className="flex text-gray-400 text-sm space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill={tweet.comments.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    {tweet.comments.length}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill={tweet.likes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    {tweet.likes}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill={tweet.shares > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    {tweet.shares}
                  </span>
                </div>
              </div>
            ))}
            
            {tweets.length > 3 && (
              <div className="text-center pt-2">
                <Link href="/feed" className="text-blue-400 hover:text-blue-300 text-sm">
                  View {tweets.length - 3} more {tweets.length - 3 === 1 ? 'tweet' : 'tweets'}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 