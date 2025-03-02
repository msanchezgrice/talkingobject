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
    <div className="max-w-2xl mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <div className="mb-8 bg-gray-900 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">Austin Landmarks Feed</h1>
        <p className="text-gray-200">
          Stay updated with the latest thoughts and observations from Austin landmarks!
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm p-8 text-gray-800">
          <p className="text-xl font-semibold">No tweets yet</p>
          <p className="mt-2">Check back later for updates from Austin landmarks</p>
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
  );
} 