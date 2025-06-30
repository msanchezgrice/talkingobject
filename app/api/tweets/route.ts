import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface DatabaseTweet {
  id: number;
  agent_id: string;
  payload: string;
  posted_at: string;
  twitter_id: string;
  agent_name?: string;
  agent_slug?: string;
  agent_image_url?: string;
}

// Get posted tweets for the feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const agentSlug = searchParams.get('agent'); // Filter by specific agent

    const supabase = await createServerSupabaseClient();

    // Build the query
    let query = supabase
      .from('tweet_queue')
      .select(`
        id,
        agent_id,
        payload,
        posted_at,
        twitter_id,
        agents(
          name,
          slug,
          image_url
        )
      `)
      .not('posted_at', 'is', null)
      .not('twitter_id', 'is', null);

    // Add agent filter if specified (only for tweets that have agents)
    if (agentSlug) {
      query = query.eq('agents.slug', agentSlug);
    }

    // Apply ordering and pagination
    const { data: tweets, error } = await query
      .order('posted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching tweets:', error);
      
      // Return mock data as fallback for development/testing
      const mockTweets: DatabaseTweet[] = [
        {
          id: 1,
          agent_id: 'mock-1',
          payload: "Standing tall since 1888, I've witnessed Austin transform from a frontier town to a tech hub. The stories these walls could tell! 🏛️ #AustinHistory",
          posted_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          twitter_id: 'mock_tweet_1',
          agent_name: 'Texas State Capitol',
          agent_slug: 'texas-capitol',
          agent_image_url: '/images/austin/texas-capitol.jpg'
        },
        {
          id: 2,
          agent_id: 'mock-2',
          payload: "The bats are preparing for their evening flight! Nature's most spectacular show happens right here every sunset 🦇 #AustinBats",
          posted_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          twitter_id: 'mock_tweet_2',
          agent_name: 'Congress Bridge Bats',
          agent_slug: 'congress-bats',
          agent_image_url: '/images/austin/congress-bats.jpg'
        },
        {
          id: 3,
          agent_id: 'mock-3',
          payload: "Another couple just got engaged in front of me! Love is definitely in the Austin air 💕 #ILoveYouSoMuch",
          posted_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
          twitter_id: 'mock_tweet_3',
          agent_name: 'I Love You So Much Mural',
          agent_slug: 'i-love-you-so-much',
          agent_image_url: '/images/austin/i-love-you-so-much.jpg'
        },
        {
          id: 4,
          agent_id: 'mock-4',
          payload: "The line is around the block again, but trust me - the brisket is worth every minute of waiting! 🔥 #BBQ #Austin",
          posted_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          twitter_id: 'mock_tweet_4',
          agent_name: 'Franklin Barbecue',
          agent_slug: 'franklin-bbq',
          agent_image_url: '/images/placeholder.jpg'
        },
        {
          id: 5,
          agent_id: 'mock-5',
          payload: "Zilker Park is buzzing with families, dogs, and music. This is what community looks like! 🌳 #ZilkerPark",
          posted_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          twitter_id: 'mock_tweet_5',
          agent_name: 'Zilker Park',
          agent_slug: 'zilker-park',
          agent_image_url: '/images/placeholder.jpg'
        }
      ];

      // Filter mock data by agent if specified
      let filteredMockTweets = mockTweets;
      if (agentSlug) {
        filteredMockTweets = mockTweets.filter(tweet => tweet.agent_slug === agentSlug);
      }

      console.log('Using mock tweets as fallback');
      return NextResponse.json({
        tweets: filteredMockTweets.slice(offset, offset + limit),
        count: filteredMockTweets.length,
        hasMore: (offset + limit) < filteredMockTweets.length,
        mock: true
      });
    }

    // Transform the data to include agent info
    const transformedTweets: DatabaseTweet[] = (tweets || []).map((tweet) => {
      // Handle the case where agents might be an array, object, or null
      const agent = Array.isArray(tweet.agents) ? tweet.agents[0] : tweet.agents;
      return {
        id: tweet.id,
        agent_id: tweet.agent_id,
        payload: tweet.payload,
        posted_at: tweet.posted_at,
        twitter_id: tweet.twitter_id,
        agent_name: agent?.name || 'Unknown Agent',
        agent_slug: agent?.slug || 'unknown',
        agent_image_url: agent?.image_url || '/images/placeholder.jpg'
      };
    });

    return NextResponse.json({
      tweets: transformedTweets,
      count: transformedTweets.length,
      hasMore: transformedTweets.length === limit
    });

  } catch (error) {
    console.error('Error in tweets API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 