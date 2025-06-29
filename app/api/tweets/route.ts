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

    const supabase = await createServerSupabaseClient();

    // Get posted tweets with agent information
    const { data: tweets, error } = await supabase
      .from('tweet_queue')
      .select(`
        id,
        agent_id,
        payload,
        posted_at,
        twitter_id,
        agents!inner(
          name,
          slug,
          image_url
        )
      `)
      .not('posted_at', 'is', null)
      .not('twitter_id', 'is', null)
      .order('posted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching tweets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tweets' },
        { status: 500 }
      );
    }

    // Transform the data to include agent info
    const transformedTweets: DatabaseTweet[] = (tweets || []).map((tweet) => {
      // Handle the case where agents might be an array or object
      const agent = Array.isArray(tweet.agents) ? tweet.agents[0] : tweet.agents;
      return {
        id: tweet.id,
        agent_id: tweet.agent_id,
        payload: tweet.payload,
        posted_at: tweet.posted_at,
        twitter_id: tweet.twitter_id,
        agent_name: agent?.name,
        agent_slug: agent?.slug,
        agent_image_url: agent?.image_url
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