#!/usr/bin/env node

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://talkingobjects.ai';

async function populateTweets() {
  try {
    console.log('🐦 Populating tweet queue...');
    
    const response = await fetch(`${BASE_URL}/api/admin/queue-tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_SECRET}`,
      },
      body: JSON.stringify({
        count: 3 // Queue 3 tweets per agent
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to populate tweets');
    }
    
    console.log('✅ Tweet queue populated successfully:');
    console.log(`   Total agents: ${data.results?.length || 0}`);
    console.log(`   Total tweets queued: ${data.totalQueued || 0}`);
    
    if (data.results) {
      data.results.forEach(result => {
        console.log(`   - ${result.agentName}: ${result.count} tweets (${result.category})`);
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Error populating tweets:', error.message);
    throw error;
  }
}

async function triggerCron() {
  try {
    console.log('🕐 Triggering cron job...');
    
    const response = await fetch(`${BASE_URL}/api/cron/tweet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_SECRET}`,
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to trigger cron');
    }
    
    console.log('✅ Cron job completed:');
    console.log(`   Processed: ${data.processed || 0} tweets`);
    console.log(`   Success: ${data.success || 0}`);
    console.log(`   Errors: ${data.errors || 0}`);
    
    if (data.results) {
      data.results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`   ${status} Tweet ${result.tweetId}: ${result.agentName || 'Unknown'}`);
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Error triggering cron:', error.message);
    throw error;
  }
}

async function checkFeed() {
  try {
    console.log('📱 Checking feed...');
    
    const response = await fetch(`${BASE_URL}/api/tweets?limit=10`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch tweets');
    }
    
    console.log('✅ Feed status:');
    console.log(`   Total tweets: ${data.tweets?.length || 0}`);
    
    if (data.tweets && data.tweets.length > 0) {
      data.tweets.forEach(tweet => {
        console.log(`   - ${tweet.agent_name}: "${tweet.payload.substring(0, 50)}..."`);
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Error checking feed:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting tweet system setup...\n');
    
    // Step 1: Populate tweet queue
    await populateTweets();
    console.log('');
    
    // Step 2: Trigger cron job to post tweets
    await triggerCron();
    console.log('');
    
    // Step 3: Check feed
    await checkFeed();
    console.log('');
    
    console.log('🎉 Tweet system setup completed!');
    
  } catch (error) {
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { populateTweets, triggerCron, checkFeed }; 