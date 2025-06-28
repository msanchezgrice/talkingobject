import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serverAgentQueries, generateSlugFromName, isSlugAvailable } from '@/lib/database/server-agents';

// Get agents (public or user-specific)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const publicOnly = searchParams.get('public') === 'true';

    if (publicOnly || !userId) {
      // Get all public agents
      const agents = await serverAgentQueries.getAllPublicAgents();
      return NextResponse.json(agents);
    } else {
      // Get user-specific agents
      const agents = await serverAgentQueries.getUserAgents(userId);
      return NextResponse.json(agents);
    }

  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new agent
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, personality, description, interests, latitude, longitude, image_url, data_sources, fee_amount, fee_token } = body;

    if (!name || !personality) {
      return NextResponse.json(
        { error: 'Name and personality are required' },
        { status: 400 }
      );
    }

    // Generate slug
    let slug = generateSlugFromName(name);
    let counter = 1;
    
    while (!(await isSlugAvailable(slug))) {
      slug = `${generateSlugFromName(name)}-${counter}`;
      counter++;
      
      // Prevent infinite loop
      if (counter > 1000) {
        slug = `${generateSlugFromName(name)}-${Date.now()}`;
        break;
      }
    }

    // Create agent
    const agent = await serverAgentQueries.createAgent({
      name,
      slug,
      personality,
      description,
      interests: interests || [],
      latitude,
      longitude,
      image_url,
      data_sources: data_sources || [],
      fee_amount: fee_amount || 0,
      fee_token: fee_token || 'ETH',
      auth_user_id: session.user.id,
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Failed to create agent' },
        { status: 500 }
      );
    }

    return NextResponse.json(agent);

  } catch (error) {
    console.error('Agent creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 