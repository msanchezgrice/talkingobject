'use client';

import { useEffect } from 'react';
import { generateInitialTweets, getAllTweets } from '../../lib/models/tweet';
import { placeholderAgents } from '../../lib/placeholder-agents';
import { simulateTweetSchedule } from '../../lib/services/tweet-service';

export default function TweetInitializer() {
  useEffect(() => {
    // Initialize tweets if none exist
    if (getAllTweets().length === 0) {
      console.log('Initializing tweets for agents');
      generateInitialTweets(placeholderAgents);
      simulateTweetSchedule(placeholderAgents);
    }
  }, []);

  // This component doesn't render anything
  return null;
} 