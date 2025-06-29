import { NextRequest, NextResponse } from 'next/server';
import { addTweetsToQueue } from '@/lib/tweet-queue';
import { serverAgentQueries } from '@/lib/database/server-agents';

// Sample tweet content for different types of Austin agents
const sampleTweets = {
  historicSites: [
    "Standing tall since 1888, I've witnessed Austin transform from a frontier town to a tech hub. The stories these walls could tell! 🏛️ #AustinHistory",
    "Every sunrise over the Capitol grounds reminds me why Austin is called the Live Music Capital. The energy here is infectious! 🌅 #KeepAustinWeird",
    "Watching another legislative session unfold. Democracy in action, right here in the heart of Texas! 🗳️ #TxLege"
  ],
  parksAndNature: [
    "The bats are preparing for their evening flight! Nature's most spectacular show happens right here every sunset 🦇 #AustinBats",
    "Zilker Park is buzzing with families, dogs, and music. This is what community looks like! 🌳 #ZilkerPark",
    "Lady Bird Lake reflects the city skyline perfectly today. Austin's natural beauty never gets old 🌊 #LadyBirdLake"
  ],
  publicArt: [
    "Another couple just got engaged in front of me! Love is definitely in the Austin air 💕 #ILoveYouSoMuch",
    "Watching tourists discover South Congress for the first time never gets old. Welcome to the weird side of Austin! 🎨 #SoCo",
    "The morning light hits just right, making all the colors pop. Art and nature in perfect harmony 🌈 #StreetArt"
  ],
  businesses: [
    "The line is around the block again, but trust me - the brisket is worth every minute of waiting! 🔥 #BBQ #Austin",
    "Just served my 1000th customer today! Austin's food scene keeps growing and I'm proud to be part of it 🍖 #AustinEats",
    "Rainy day = perfect day for some comfort food. Come warm up with us! ☔ #AustinFood"
  ]
};

// Admin endpoint to populate tweet queue
export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;
    
    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { agentId, category, count = 3 } = body;

    if (agentId) {
      // Queue tweets for a specific agent
      const agent = await serverAgentQueries.getClerkAgentBySlug(agentId) || 
                   await serverAgentQueries.getAgentBySlug(agentId);
      
      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
      }

      const categoryTweets = sampleTweets[category as keyof typeof sampleTweets] || sampleTweets.businesses;
      const selectedTweets = categoryTweets.slice(0, count);
      
      const result = await addTweetsToQueue(agent.id, selectedTweets, true);
      
      return NextResponse.json({
        message: `Queued ${result.count} tweets for ${agent.name}`,
        success: result.success,
        agentId: agent.id,
        agentName: agent.name,
        count: result.count
      });

    } else {
      // Queue tweets for all agents
      const allAgents = await serverAgentQueries.getAllPublicAgents();
      
      if (allAgents.length === 0) {
        return NextResponse.json({ error: 'No agents found' }, { status: 404 });
      }

      const results = [];
      let totalQueued = 0;

      for (const agent of allAgents) {
        // Determine category based on agent data or use default
        const agentCategory = determineAgentCategory(agent);
        const categoryTweets = sampleTweets[agentCategory];
        const selectedTweets = categoryTweets.slice(0, Math.min(count, categoryTweets.length));
        
        const result = await addTweetsToQueue(agent.id, selectedTweets, true);
        
        results.push({
          agentId: agent.id,
          agentName: agent.name,
          category: agentCategory,
          count: result.count,
          success: result.success
        });
        
        totalQueued += result.count;
      }

      return NextResponse.json({
        message: `Queued tweets for ${allAgents.length} agents`,
        totalQueued,
        results
      });
    }

  } catch (error) {
    console.error('Error queueing tweets:', error);
    return NextResponse.json({
      error: 'Failed to queue tweets',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to determine agent category
function determineAgentCategory(agent: { name: string; description?: string | null }): keyof typeof sampleTweets {
  const name = agent.name.toLowerCase();
  const description = (agent.description || '').toLowerCase();
  
  if (name.includes('capitol') || name.includes('historic') || description.includes('historic')) {
    return 'historicSites';
  } else if (name.includes('park') || name.includes('lake') || name.includes('bat') || name.includes('spring')) {
    return 'parksAndNature';
  } else if (name.includes('mural') || name.includes('art') || description.includes('art')) {
    return 'publicArt';
  } else {
    return 'businesses';
  }
}

// GET endpoint to check queue status
export async function GET() {
  try {
    const allAgents = await serverAgentQueries.getAllPublicAgents();
    
    return NextResponse.json({
      message: 'Tweet queue admin endpoint',
      totalAgents: allAgents.length,
      agents: allAgents.map(agent => ({
        id: agent.id,
        name: agent.name,
        slug: agent.slug
      })),
      sampleCategories: Object.keys(sampleTweets),
      usage: {
        POST: 'Queue tweets for agents',
        body: {
          agentId: 'optional - specific agent ID',
          category: 'optional - tweet category',
          count: 'optional - number of tweets (default 3)'
        }
      }
    });

  } catch (error) {
    console.error('Error in queue admin:', error);
    return NextResponse.json({
      error: 'Failed to get queue status'
    }, { status: 500 });
  }
} 