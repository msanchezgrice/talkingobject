import { createServerSupabaseClient } from '@/lib/supabase/server';

// Database Profile Type (matches your schema)
export interface DatabaseProfile {
  id: string;
  auth_user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

// Create Profile Data Type
export interface CreateProfileData {
  auth_user_id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

// Update Profile Data Type
export interface UpdateProfileData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

/**
 * Generate a unique username from email
 */
export function generateUsernameFromEmail(email: string): string {
  const baseUsername = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .substring(0, 20); // Limit length

  return baseUsername || 'user';
}

/**
 * Check if username is available (server-side)
 */
export async function isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('username', username);

    if (excludeUserId) {
      query = query.neq('auth_user_id', excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking username availability:', error);
      return false;
    }

    return !data || data.length === 0;
  } catch (error) {
    console.error('Error in isUsernameAvailable:', error);
    return false;
  }
}

/**
 * Server-side functions for API routes
 */
export const serverProfileQueries = {
  async getProfileByUserId(userId: string): Promise<DatabaseProfile | null> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching profile (server):', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in serverProfileQueries.getProfileByUserId:', error);
      return null;
    }
  },

  async createProfile(profileData: CreateProfileData): Promise<DatabaseProfile | null> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          auth_user_id: profileData.auth_user_id,
          username: profileData.username,
          full_name: profileData.full_name ?? null,
          avatar_url: profileData.avatar_url ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile (server):', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in serverProfileQueries.createProfile:', error);
      return null;
    }
  },

  async updateProfile(userId: string, profileData: UpdateProfileData): Promise<DatabaseProfile | null> {
    try {
      const supabase = await createServerSupabaseClient();
      const updateData = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('auth_user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile (server):', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in serverProfileQueries.updateProfile:', error);
      return null;
    }
  }
}; 