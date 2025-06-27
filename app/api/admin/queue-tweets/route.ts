import { NextRequest, NextResponse } from 'next/server';
import { addTweetsToQueue, getTweetQueueStats } from '@/lib/tweet-queue';
import { getAllAgents, getAgentById } from '@/lib/placeholder-agents';

// POST endpoint to manually add tweets to the queue
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isDev && (!adminSecret || authHeader !== `Bearer ${adminSecret}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { agentId, tweets, scheduleRandomly = true } = body;
    
    if (!agentId || !tweets || !Array.isArray(tweets)) {
      return NextResponse.json({ 
        error: 'Missing required fields: agentId, tweets (array)' 
      }, { status: 400 });
    }
    
    // Validate agent exists
    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ 
        error: `Agent not found: ${agentId}` 
      }, { status: 404 });
    }
    
    // Validate tweet contents
    const validTweets = tweets.filter((tweet: string) => 
      typeof tweet === 'string' && tweet.trim().length > 0 && tweet.length <= 280
    );
    
    if (validTweets.length === 0) {
      return NextResponse.json({ 
        error: 'No valid tweets provided (must be strings, 1-280 characters)' 
      }, { status: 400 });
    }
    
    // Add tweets to queue
    const result = await addTweetsToQueue(agentId, validTweets, scheduleRandomly);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to add tweets to queue' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Tweets added to queue successfully',
      agent: {
        id: agent.id,
        name: agent.name
      },
      tweetsAdded: result.count,
      scheduled: scheduleRandomly ? 'randomly over next 6 hours' : 'immediately'
    });
    
  } catch (error) {
    console.error('Queue tweets API error:', error);
    return NextResponse.json({
      error: 'Failed to queue tweets',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to check queue status
export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isDev && (!adminSecret || authHeader !== `Bearer ${adminSecret}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get queue statistics
    const stats = await getTweetQueueStats();
    
    if (!stats) {
      return NextResponse.json({ 
        error: 'Failed to get queue statistics' 
      }, { status: 500 });
    }
    
    // Get all agents for reference
    const agents = getAllAgents();
    
    return NextResponse.json({
      queueStats: stats,
      totalAgents: agents.length,
      agents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        slug: agent.slug
      }))
    });
    
  } catch (error) {
    console.error('Queue status API error:', error);
    return NextResponse.json({
      error: 'Failed to get queue status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 