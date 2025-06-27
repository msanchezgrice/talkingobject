// Tweet queue management utilities for Phase 5
// Handles database operations for the Twitter syndication system

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { calculatePostingTime } from './twitter';

export interface QueuedTweet {
  id: number;
  agent_id: string;
  payload: string;
  not_before: string;
  tried: number;
  max_retries: number;
  last_error?: string;
  created_at: string;
  updated_at: string;
  posted_at?: string;
  twitter_id?: string;
}

export interface RateLimitWindow {
  window_start: string;
  window_end: string;
  tweets_posted: number;
  remaining: number;
}

interface TweetQueueRow {
  posted_at: string | null;
  tried: number;
  max_retries: number;
}

// Add tweets to the queue
export async function addTweetsToQueue(
  agentId: string, 
  tweetContents: string[], 
  scheduleRandomly: boolean = true
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    
    const tweets = tweetContents.map(content => ({
      agent_id: agentId,
      payload: content,
      not_before: scheduleRandomly 
        ? calculatePostingTime().toISOString()
        : new Date().toISOString(),
    }));
    
    const { data, error } = await supabase
      .from('tweet_queue')
      .insert(tweets)
      .select('id');
    
    if (error) {
      console.error('Error adding tweets to queue:', error);
      return { success: false, count: 0, error: error.message };
    }
    
    console.log('✅ Added', data?.length || 0, 'tweets to queue for agent:', agentId);
    return { success: true, count: data?.length || 0 };
    
  } catch (error) {
    console.error('Tweet queue error:', error);
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get ready tweets for posting
export async function getReadyTweets(batchSize: number = 10): Promise<QueuedTweet[]> {
  try {
    const supabase = createServerSupabaseClient();
    
    // Use the database function for atomic operations
    const { data, error } = await supabase
      .rpc('get_ready_tweets', { batch_size: batchSize });
    
    if (error) {
      console.error('Error getting ready tweets:', error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Error fetching ready tweets:', error);
    return [];
  }
}

// Mark a tweet as successfully posted
export async function markTweetPosted(
  tweetId: number, 
  twitterId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('tweet_queue')
      .update({
        posted_at: new Date().toISOString(),
        twitter_id: twitterId,
        updated_at: new Date().toISOString()
      })
      .eq('id', tweetId);
    
    if (error) {
      console.error('Error marking tweet as posted:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Marked tweet', tweetId, 'as posted with Twitter ID:', twitterId);
    return { success: true };
    
  } catch (error) {
    console.error('Error updating tweet status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Mark a tweet as failed (increment retry count)
export async function markTweetFailed(
  tweetId: number, 
  errorMessage: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    
    // First get current retry count
    const { data: currentTweet, error: fetchError } = await supabase
      .from('tweet_queue')
      .select('tried')
      .eq('id', tweetId)
      .single();
    
    if (fetchError || !currentTweet) {
      console.error('Error fetching current tweet:', fetchError);
      return { success: false, error: fetchError?.message || 'Tweet not found' };
    }
    
    const { error } = await supabase
      .from('tweet_queue')
      .update({
        tried: currentTweet.tried + 1,
        last_error: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', tweetId);
    
    if (error) {
      console.error('Error marking tweet as failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('⚠️ Marked tweet', tweetId, 'as failed:', errorMessage);
    return { success: true };
    
  } catch (error) {
    console.error('Error updating tweet failure:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Check current rate limit status
export async function getCurrentRateLimit(): Promise<RateLimitWindow | null> {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .rpc('get_current_rate_limit_window');
    
    if (error) {
      console.error('Error getting rate limit:', error);
      return null;
    }
    
    return data?.[0] || null;
    
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return null;
  }
}

// Check if we can post a tweet (under rate limit)
export async function canPostTweet(): Promise<boolean> {
  try {
    const rateLimit = await getCurrentRateLimit();
    
    if (!rateLimit) {
      console.error('Could not check rate limit');
      return false;
    }
    
    const canPost = rateLimit.remaining > 0;
    
    if (!canPost) {
      console.log('🚫 Rate limit reached. Tweets posted:', rateLimit.tweets_posted);
    }
    
    return canPost;
    
  } catch (error) {
    console.error('Error checking if can post tweet:', error);
    return false;
  }
}

// Increment the rate limit counter
export async function incrementRateLimit(): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .rpc('increment_rate_limit_counter');
    
    if (error) {
      console.error('Error incrementing rate limit:', error);
      return false;
    }
    
    return data === true;
    
  } catch (error) {
    console.error('Error updating rate limit:', error);
    return false;
  }
}

// Get tweet queue statistics
export async function getTweetQueueStats(): Promise<{
  pending: number;
  posted: number;
  failed: number;
  total: number;
} | null> {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: stats, error } = await supabase
      .from('tweet_queue')
      .select('posted_at, tried, max_retries');
    
    if (error) {
      console.error('Error getting tweet stats:', error);
      return null;
    }
    
    const typedStats = stats as TweetQueueRow[];
    const pending = typedStats.filter((t: TweetQueueRow) => !t.posted_at && t.tried < t.max_retries).length;
    const posted = typedStats.filter((t: TweetQueueRow) => t.posted_at).length;
    const failed = typedStats.filter((t: TweetQueueRow) => !t.posted_at && t.tried >= t.max_retries).length;
    
    return {
      pending,
      posted,
      failed,
      total: typedStats.length
    };
    
  } catch (error) {
    console.error('Error calculating tweet stats:', error);
    return null;
  }
}

// Clean up old completed tweets (older than 30 days)
export async function cleanupOldTweets(): Promise<{ success: boolean; deleted: number; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('tweet_queue')
      .delete()
      .not('posted_at', 'is', null)
      .lt('posted_at', thirtyDaysAgo.toISOString())
      .select('id');
    
    if (error) {
      console.error('Error cleaning up old tweets:', error);
      return { success: false, deleted: 0, error: error.message };
    }
    
    const deletedCount = data?.length || 0;
    console.log('🧹 Cleaned up', deletedCount, 'old tweets');
    
    return { success: true, deleted: deletedCount };
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    return { 
      success: false, 
      deleted: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Generate tweets from daily summaries
export async function generateTweetsFromSummaries(
  agentId: string,
  summaryText: string,
  maxTweets: number = 3
): Promise<string[]> {
  // Simple tweet generation from summaries
  // In production, this would use AI to generate more sophisticated content
  
  const sentences = summaryText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 200);
  
  const tweets = sentences
    .slice(0, maxTweets)
    .map(sentence => {
      // Clean up and format the sentence
      let tweet = sentence.replace(/^(and|but|also|then|now|so)\s+/i, '');
      
      // Add some personality
      if (Math.random() > 0.5) {
        tweet = '💭 ' + tweet;
      }
      
      // Ensure it's not too long
      if (tweet.length > 240) {
        tweet = tweet.substring(0, 237) + '...';
      }
      
      return tweet;
    });
  
  return tweets.filter(tweet => tweet.length > 20); // Filter out very short tweets
} 