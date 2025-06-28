import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { 
  serverProfileQueries,
  generateUsernameFromEmail,
  isUsernameAvailable
} from '@/lib/database/server-profiles';

// Create a new user profile
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
    const { username, full_name } = body;

    // Generate username if not provided
    let finalUsername = username;
    if (!finalUsername && session.user.email) {
      const baseUsername = generateUsernameFromEmail(session.user.email);
      let counter = 1;
      finalUsername = baseUsername;
      
      while (!(await isUsernameAvailable(finalUsername))) {
        finalUsername = `${baseUsername}${counter}`;
        counter++;
        
        // Prevent infinite loop
        if (counter > 1000) {
          finalUsername = `${baseUsername}${Date.now()}`;
          break;
        }
      }
    }

    if (!finalUsername) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await serverProfileQueries.getProfileByUserId(session.user.id);
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists for this user' },
        { status: 409 }
      );
    }

    // Check username availability
    if (!(await isUsernameAvailable(finalUsername))) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    // Create profile
    const profile = await serverProfileQueries.createProfile({
      auth_user_id: session.user.id,
      username: finalUsername,
      full_name: full_name || undefined,
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
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
    const { username, full_name, avatar_url } = body;

    // Check username availability if updating username
    if (username) {
      const available = await isUsernameAvailable(username, session.user.id);
      if (!available) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    // Update profile
    const profile = await serverProfileQueries.updateProfile(session.user.id, {
      username,
      full_name,
      avatar_url,
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user profile
export async function GET() {
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

    const profile = await serverProfileQueries.getProfileByUserId(session.user.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 