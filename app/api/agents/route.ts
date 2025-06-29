import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serverAgentQueries, generateSlugFromName, isSlugAvailable } from '@/lib/database/server-agents';

// Get agents (public or user-specific)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const publicOnly = searchParams.get('public') === 'true';
    const debug = searchParams.get('debug') === 'true';

    // Debug mode - test database connection and specific agents
    if (debug) {
      console.error('🧪 [AGENTS-DEBUG] Testing database connection...');
      console.error('🌐 [AGENTS-DEBUG] Environment check:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...',
        nodeEnv: process.env.NODE_ENV
      });

      // Test specific agents
      const violetCrown = await serverAgentQueries.getClerkAgentBySlug('violet-crown');
      const test2 = await serverAgentQueries.getClerkAgentBySlug('test2');
      const mm = await serverAgentQueries.getClerkAgentBySlug('mm');
      const allAgents = await serverAgentQueries.getAllPublicAgents();

      const debugResults = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        tests: {
          violetCrown: violetCrown ? { name: violetCrown.name, id: violetCrown.id, slug: violetCrown.slug } : null,
          test2: test2 ? { name: test2.name, id: test2.id, slug: test2.slug } : null,
          mm: mm ? { name: mm.name, id: mm.id, slug: mm.slug } : null,
          totalAgents: allAgents.length,
          firstFewAgents: allAgents.slice(0, 5).map(a => ({ name: a.name, slug: a.slug, id: a.id }))
        }
      };

      console.error('🧪 [AGENTS-DEBUG] Results:', debugResults);
      return NextResponse.json(debugResults);
    }

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
    const supabase = await createServerSupabaseClient();
    
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