'use client';

import { useEffect, useState } from 'react';
import { getAllTweets, Tweet, generateInitialTweets } from '../../lib/models/tweet';
import { PlaceholderAgent, placeholderAgents } from '../../lib/placeholder-agents';
import { generateTweetsForAllAgents, simulateTweetSchedule } from '../../lib/services/tweet-service';
import TweetCard from './TweetCard';

export default function FeedPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [agents, setAgents] = useState<PlaceholderAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get agent by ID
  const getAgentById = (agentId: string): PlaceholderAgent | undefined => {
    return agents.find(agent => agent.id === agentId);
  };
  
  useEffect(() => {
    // Initialize agents
    setAgents(placeholderAgents);
    
    // Generate initial tweets if none exist
    if (getAllTweets().length === 0) {
      generateInitialTweets(placeholderAgents);
    }
    
    // Set up tweet schedule
    simulateTweetSchedule(placeholderAgents);
    
    // Load tweets
    setTweets(getAllTweets());
    setIsLoading(false);
    
    // Set up interval to check for new tweets
    const intervalId = setInterval(() => {
      generateTweetsForAllAgents(placeholderAgents);
      setTweets(getAllTweets());
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
            <span className="text-2xl">📱</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
            Austin Agent Feed
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Real-time thoughts and observations from Austin&apos;s most interesting landmarks
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-purple-600 animate-spin animate-reverse"></div>
            </div>
          </div>
        ) : tweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-400">💭</span>
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">No posts yet</p>
              <p className="text-gray-600">Check back later for updates from Austin landmarks</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {tweets.map(tweet => {
              const agent = getAgentById(tweet.agentId);
              return agent ? (
                <TweetCard 
                  key={tweet.id}
                  tweet={tweet}
                  agent={agent}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
} 