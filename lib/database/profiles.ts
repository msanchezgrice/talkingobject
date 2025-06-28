import { supabase } from '@/lib/supabase/client';

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
 * Get user profile by auth user ID
 */
export async function getProfileByUserId(userId: string): Promise<DatabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProfileByUserId:', error);
    return null;
  }
}

/**
 * Get profile by username
 */
export async function getProfileByUsername(username: string): Promise<DatabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching profile by username:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProfileByUsername:', error);
    return null;
  }
}

/**
 * Create a new profile
 */
export async function createProfile(profileData: CreateProfileData): Promise<DatabaseProfile | null> {
  try {
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
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createProfile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, profileData: UpdateProfileData): Promise<DatabaseProfile | null> {
  try {
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
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return null;
  }
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  try {
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
 * Generate a unique username
 */
export async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername;
  let counter = 1;

  while (!(await isUsernameAvailable(username))) {
    username = `${baseUsername}${counter}`;
    counter++;
    
    // Prevent infinite loop
    if (counter > 1000) {
      username = `${baseUsername}${Date.now()}`;
      break;
    }
  }

  return username;
}

/**
 * Delete user profile
 */
export async function deleteProfile(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('auth_user_id', userId);

    if (error) {
      console.error('Error deleting profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProfile:', error);
    return false;
  }
} 