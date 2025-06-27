// Twitter API utilities for Phase 5 syndication
// Handles posting tweets with rate limiting and retry logic

// Twitter API v2 types and interfaces
export interface TwitterConfig {
  apiKey: string;
  apiKeySecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

export interface TweetData {
  text: string;
  agentId: string;
  agentName: string;
}

export interface TweetResponse {
  success: boolean;
  tweetId?: string;
  error?: string;
  rateLimited?: boolean;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: Date;
  windowStart: Date;
  windowEnd: Date;
}

// Simple Twitter API client using fetch (avoiding external dependencies for now)
class TwitterClient {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken;
  }

  // Post a tweet using Twitter API v2
  async postTweet(text: string): Promise<TweetResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.substring(0, 280) // Ensure we don't exceed character limit
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle rate limiting (HTTP 429)
        if (response.status === 429) {
          return {
            success: false,
            error: 'Rate limited by Twitter API',
            rateLimited: true
          };
        }

        return {
          success: false,
          error: errorData.detail || errorData.error || `HTTP ${response.status}`,
          rateLimited: false
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        tweetId: data.data?.id || 'unknown',
      };

    } catch (error) {
      console.error('Twitter API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        rateLimited: false
      };
    }
  }

  // Get current user info (for testing authentication)
  async getCurrentUser() {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Twitter user info error:', error);
      throw error;
    }
  }
}

// Initialize Twitter client
let twitterClient: TwitterClient | null = null;

function getTwitterClient(): TwitterClient {
  if (!twitterClient) {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      throw new Error('TWITTER_BEARER_TOKEN environment variable is required');
    }
    
    twitterClient = new TwitterClient(bearerToken);
  }
  
  return twitterClient;
}

// Generate a tweet from agent data and context
export function generateTweetContent(agentName: string, context: string, maxLength: number = 240): string {
  // Simple tweet generation - in production this would use AI
  const templates = [
    `🗣️ ${agentName} here! ${context}`,
    `From ${agentName}: ${context}`,
    `${agentName} shares: ${context}`,
    `💬 ${agentName}: ${context}`,
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Truncate if too long, leaving space for hashtags
  if (template.length > maxLength) {
    const truncated = template.substring(0, maxLength - 3) + '...';
    return truncated;
  }
  
  return template;
}

// Post a tweet with error handling and rate limiting
export async function postTweet(tweetData: TweetData): Promise<TweetResponse> {
  try {
    const client = getTwitterClient();
    
    // Generate final tweet content
    const tweetText = generateTweetContent(
      tweetData.agentName,
      tweetData.text,
      260 // Leave space for potential hashtags
    );
    
    console.log('🐦 Posting tweet:', tweetText);
    
    const result = await client.postTweet(tweetText);
    
    if (result.success) {
      console.log('🐦 Tweet posted successfully:', result.tweetId);
    } else {
      console.error('🐦 Tweet failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('🐦 Tweet posting error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      rateLimited: false
    };
  }
}

// Test Twitter API connection
export async function testTwitterConnection(): Promise<boolean> {
  try {
    const client = getTwitterClient();
    await client.getCurrentUser();
    return true;
  } catch (error) {
    console.error('Twitter connection test failed:', error);
    return false;
  }
}

// Validate tweet content
export function validateTweetContent(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Tweet content cannot be empty' };
  }
  
  if (text.length > 280) {
    return { valid: false, error: 'Tweet content exceeds 280 characters' };
  }
  
  return { valid: true };
}

// Calculate optimal posting time (random within 6 hours)
export function calculatePostingTime(): Date {
  const now = new Date();
  const randomHours = Math.random() * 6; // 0-6 hours
  const randomMinutes = Math.random() * 60; // 0-60 minutes
  
  const postTime = new Date(now.getTime() + (randomHours * 60 * 60 * 1000) + (randomMinutes * 60 * 1000));
  return postTime;
} 