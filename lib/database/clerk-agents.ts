import { supabase } from '@/lib/supabase/client';

// Database Agent Type (matches your schema but with clerk_user_id)
export interface ClerkDatabaseAgent {
  id: string;
  created_at: string;
  updated_at: string;
  clerk_user_id: string | null; // Changed from auth_user_id to clerk_user_id
  name: string;
  slug: string;
  personality: string;
  description: string | null;
  interests: string[];
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  is_active: boolean;
  data_sources: string[];
  fee_amount: number;
  fee_token: string;
  voice: string;
}

// Create Agent Data Type (for inserts)
export interface CreateClerkAgentData {
  name: string;
  slug: string;
  personality: string;
  description?: string;
  interests?: string[];
  latitude?: number;
  longitude?: number;
  image_url?: string;
  is_active?: boolean;
  data_sources?: string[];
  fee_amount?: number;
  fee_token?: string;
  clerk_user_id?: string;
  voice?: string;
}

// Update Agent Data Type (for updates)
export interface UpdateClerkAgentData {
  name?: string;
  personality?: string;
  description?: string;
  interests?: string[];
  latitude?: number;
  longitude?: number;
  image_url?: string;
  is_active?: boolean;
  data_sources?: string[];
  fee_amount?: number;
  fee_token?: string;
  voice?: string;
}

/**
 * Get all public agents (for explore page)
 */
export async function getAllPublicClerkAgents(): Promise<ClerkDatabaseAgent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public agents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPublicClerkAgents:', error);
    return [];
  }
}

/**
 * Get agents for a specific Clerk user (for dashboard)
 */
export async function getClerkUserAgents(clerkUserId: string): Promise<ClerkDatabaseAgent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user agents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getClerkUserAgents:', error);
    return [];
  }
}

/**
 * Create a new agent with Clerk user ID
 */
export async function createClerkAgent(agentData: CreateClerkAgentData): Promise<ClerkDatabaseAgent | null> {
  try {
    // Generate slug if not provided
    const slug = agentData.slug || generateSlugFromName(agentData.name);
    
    const { data, error } = await supabase
      .from('agents')
      .insert({
        name: agentData.name,
        slug,
        personality: agentData.personality,
        description: agentData.description || null,
        interests: agentData.interests || [],
        latitude: agentData.latitude || null,
        longitude: agentData.longitude || null,
        image_url: agentData.image_url || null,
        is_active: agentData.is_active ?? true,
        data_sources: agentData.data_sources || [],
        fee_amount: agentData.fee_amount || 0,
        fee_token: agentData.fee_token || 'ETH',
        clerk_user_id: agentData.clerk_user_id || null,
        voice: agentData.voice || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating agent:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createClerkAgent:', error);
    return null;
  }
}

/**
 * Update an existing agent
 */
export async function updateClerkAgent(id: string, agentData: UpdateClerkAgentData): Promise<ClerkDatabaseAgent | null> {
  try {
    const updateData = {
      ...agentData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateClerkAgent:', error);
    return null;
  }
}

/**
 * Delete an agent (with Clerk user ID verification)
 */
export async function deleteClerkAgent(id: string, clerkUserId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('clerk_user_id', clerkUserId); // Ensure user can only delete their own agents

    if (error) {
      console.error('Error deleting agent:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteClerkAgent:', error);
    return false;
  }
}

/**
 * Get agent by slug (Clerk-compatible)
 */
export async function getClerkAgentBySlug(slug: string): Promise<ClerkDatabaseAgent | null> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching agent by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getClerkAgentBySlug:', error);
    return null;
  }
}

/**
 * Get agent by ID (Clerk-compatible)
 */
export async function getClerkAgentById(id: string): Promise<ClerkDatabaseAgent | null> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching agent by id:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getClerkAgentById:', error);
    return null;
  }
}

/**
 * Generate a URL-safe slug from agent name
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim() // Remove leading/trailing spaces
    .substring(0, 50); // Limit length
} 