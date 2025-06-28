import { NextResponse } from 'next/server';
import { serverAgentQueries } from '@/lib/database/server-agents';

export async function GET() {
  console.error('🧪 [TEST-DB] Testing database connection...');
  
  try {
    // Test 1: Try to get a specific agent
    console.error('🧪 [TEST-DB] Test 1: Looking for violet-crown agent...');
    const violetCrown = await serverAgentQueries.getClerkAgentBySlug('violet-crown');
    
    console.error('🧪 [TEST-DB] Test 2: Looking for test2 agent...');
    const test2 = await serverAgentQueries.getClerkAgentBySlug('test2');
    
    console.error('🧪 [TEST-DB] Test 3: Getting all public agents...');
    const allAgents = await serverAgentQueries.getAllPublicAgents();
    
    const results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      tests: {
        violetCrown: violetCrown ? { name: violetCrown.name, id: violetCrown.id } : null,
        test2: test2 ? { name: test2.name, id: test2.id } : null,
        totalAgents: allAgents.length,
        firstFewAgents: allAgents.slice(0, 3).map(a => ({ name: a.name, slug: a.slug }))
      }
    };
    
    console.error('🧪 [TEST-DB] Results:', results);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('💥 [TEST-DB] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 