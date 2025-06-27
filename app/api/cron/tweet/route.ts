import { NextRequest, NextResponse } from 'next/server';
import { 
  getReadyTweets, 
  canPostTweet, 
  incrementRateLimit, 
  markTweetPosted, 
  markTweetFailed,
  getCurrentRateLimit,
  cleanupOldTweets 
} from '@/lib/tweet-queue';
import { postTweet, TweetData } from '@/lib/twitter';
import { getAgentById } from '@/lib/placeholder-agents';

// This API route is called by Vercel Cron every 15 minutes
export async function GET(request: NextRequest) {
  try {
    console.log('🐦 Starting tweet cron job...');
    
    // Verify this is being called by Vercel Cron (check auth header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('🚫 Unauthorized cron request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check current rate limit status
    console.log('📊 Checking rate limit status...');
    const rateLimit = await getCurrentRateLimit();
    
    if (!rateLimit) {
      console.error('❌ Could not check rate limit');
      return NextResponse.json({ 
        error: 'Rate limit check failed',
        processed: 0 
      }, { status: 500 });
    }
    
    console.log(`📊 Rate limit status: ${rateLimit.tweets_posted}/300 used, ${rateLimit.remaining} remaining`);
    
    // If we can't post any tweets, return early
    if (rateLimit.remaining <= 0) {
      console.log('🚫 Rate limit reached, skipping tweet posting');
      return NextResponse.json({ 
        message: 'Rate limit reached',
        rateLimit: rateLimit,
        processed: 0 
      });
    }
    
    // Get ready tweets (limited by remaining rate limit)
    const batchSize = Math.min(10, rateLimit.remaining);
    console.log(`📥 Fetching up to ${batchSize} ready tweets...`);
    
    const readyTweets = await getReadyTweets(batchSize);
    
    if (readyTweets.length === 0) {
      console.log('📭 No tweets ready for posting');
      
      // Clean up old tweets while we're here
      const cleanup = await cleanupOldTweets();
      console.log('🧹 Cleanup result:', cleanup);
      
      return NextResponse.json({ 
        message: 'No tweets ready',
        rateLimit: rateLimit,
        processed: 0,
        cleanup: cleanup
      });
    }
    
    console.log(`📤 Processing ${readyTweets.length} tweets...`);
    
    // Process tweets one by one
    let successCount = 0;
    let errorCount = 0;
    const results = [];
    
    for (const tweet of readyTweets) {
      try {
        // Double-check rate limit before each tweet
        const canPost = await canPostTweet();
        if (!canPost) {
          console.log('🚫 Rate limit reached during processing');
          break;
        }
        
        // Get agent info for the tweet
        const agent = getAgentById(tweet.agent_id);
        if (!agent) {
          console.error(`❌ Agent not found: ${tweet.agent_id}`);
          await markTweetFailed(tweet.id, 'Agent not found');
          errorCount++;
          results.push({
            tweetId: tweet.id,
            success: false,
            error: 'Agent not found'
          });
          continue;
        }
        
        // Prepare tweet data
        const tweetData: TweetData = {
          text: tweet.payload,
          agentId: agent.id || agent.slug,
          agentName: agent.name
        };
        
        console.log(`🐦 Posting tweet ${tweet.id} for ${agent.name}...`);
        
        // Post the tweet
        const result = await postTweet(tweetData);
        
        if (result.success && result.tweetId) {
          // Mark as posted and increment rate limit
          await markTweetPosted(tweet.id, result.tweetId);
          await incrementRateLimit();
          
          successCount++;
          results.push({
            tweetId: tweet.id,
            success: true,
            twitterId: result.tweetId,
            agentName: agent.name
          });
          
          console.log(`✅ Tweet ${tweet.id} posted successfully: ${result.tweetId}`);
          
        } else {
          // Mark as failed
          const errorMsg = result.error || 'Unknown error';
          await markTweetFailed(tweet.id, errorMsg);
          
          errorCount++;
          results.push({
            tweetId: tweet.id,
            success: false,
            error: errorMsg,
            rateLimited: result.rateLimited
          });
          
          console.error(`❌ Tweet ${tweet.id} failed: ${errorMsg}`);
          
          // If we hit Twitter's rate limit, stop processing
          if (result.rateLimited) {
            console.log('🚫 Twitter API rate limit reached, stopping');
            break;
          }
        }
        
        // Small delay between tweets to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing tweet ${tweet.id}:`, error);
        
        const errorMsg = error instanceof Error ? error.message : 'Processing error';
        await markTweetFailed(tweet.id, errorMsg);
        
        errorCount++;
        results.push({
          tweetId: tweet.id,
          success: false,
          error: errorMsg
        });
      }
    }
    
    // Final rate limit check
    const finalRateLimit = await getCurrentRateLimit();
    
    console.log(`🎯 Cron job completed: ${successCount} success, ${errorCount} errors`);
    
    return NextResponse.json({
      message: 'Tweet cron job completed',
      processed: readyTweets.length,
      success: successCount,
      errors: errorCount,
      results: results,
      rateLimit: finalRateLimit
    });
    
  } catch (error) {
    console.error('❌ Tweet cron job error:', error);
    
    return NextResponse.json({
      error: 'Cron job failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      processed: 0
    }, { status: 500 });
  }
}

// POST endpoint for manual triggering (development/testing)
export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with proper authorization
    const isDev = process.env.NODE_ENV === 'development';
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;
    
    if (!isDev && (!adminSecret || authHeader !== `Bearer ${adminSecret}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('🔧 Manual tweet cron trigger...');
    
    // Call the same logic as GET
    return await GET(request);
    
  } catch (error) {
    console.error('❌ Manual tweet cron error:', error);
    
    return NextResponse.json({
      error: 'Manual cron trigger failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 