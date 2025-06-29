import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

// Update agent
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    // Verify the user owns this agent
    const { data: existingAgent, error: fetchError } = await supabase
      .from('agents')
      .select('clerk_user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingAgent || existingAgent.clerk_user_id !== userId) {
      return NextResponse.json(
        { error: 'Agent not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update agent
    const { data: updatedAgent, error: updateError } = await supabase
      .from('agents')
      .update(body)
      .eq('id', id)
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Agent update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update agent' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedAgent);

  } catch (error) {
    console.error('Agent update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Delete agent (only if user owns it)
    const { error: deleteError } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('clerk_user_id', userId);

    if (deleteError) {
      console.error('Agent deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete agent or agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Agent deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get single agent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    
    // Get agent by ID (public endpoint)
    const agent = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (agent.error) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent.data);

  } catch (error) {
    console.error('Agent fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 