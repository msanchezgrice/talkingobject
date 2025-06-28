import { supabase } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Database Agent Type (matches your schema)
export interface DatabaseAgent {
  id: string;
  created_at: string;
  updated_at: string;
  auth_user_id: string | null;
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
}

// Create Agent Data Type (for inserts)
export interface CreateAgentData {
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
  auth_user_id?: string;
}

// Update Agent Data Type (for updates)
export interface UpdateAgentData {
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
}

/**
 * Get all public agents (for explore page)
 */
export async function getAllPublicAgents(): Promise<DatabaseAgent[]> {
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
    console.error('Error in getAllPublicAgents:', error);
    return [];
  }
}

/**
 * Get agents for a specific user (for dashboard)
 */
export async function getUserAgents(userId: string): Promise<DatabaseAgent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('auth_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user agents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserAgents:', error);
    return [];
  }
}

/**
 * Get a single agent by slug
 */
export async function getAgentBySlug(slug: string): Promise<DatabaseAgent | null> {
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
    console.error('Error in getAgentBySlug:', error);
    return null;
  }
}

/**
 * Get a single agent by ID
 */
export async function getAgentById(id: string): Promise<DatabaseAgent | null> {
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
      console.error('Error fetching agent by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAgentById:', error);
    return null;
  }
}

/**
 * Create a new agent
 */
export async function createAgent(agentData: CreateAgentData): Promise<DatabaseAgent | null> {
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
        auth_user_id: agentData.auth_user_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating agent:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createAgent:', error);
    return null;
  }
}

/**
 * Update an existing agent
 */
export async function updateAgent(id: string, agentData: UpdateAgentData): Promise<DatabaseAgent | null> {
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
    console.error('Error in updateAgent:', error);
    return null;
  }
}

/**
 * Delete an agent
 */
export async function deleteAgent(id: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('auth_user_id', userId); // Ensure user can only delete their own agents

    if (error) {
      console.error('Error deleting agent:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAgent:', error);
    return false;
  }
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('agents')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking slug availability:', error);
      return false;
    }

    return !data || data.length === 0;
  } catch (error) {
    console.error('Error in isSlugAvailable:', error);
    return false;
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

/**
 * Get agents by location (within radius)
 */
export async function getAgentsByLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<DatabaseAgent[]> {
  try {
    // Using Supabase's PostGIS functions for location queries
    const { data, error } = await supabase
      .rpc('agents_within_radius', {
        lat: latitude,
        lng: longitude,
        radius_km: radiusKm
      });

    if (error) {
      // Fallback to simple filtering if PostGIS function doesn't exist
      console.warn('PostGIS function not available, using simple filter');
      return getAllPublicAgents();
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAgentsByLocation:', error);
    return [];
  }
}

/**
 * Search agents by name or description
 */
export async function searchAgents(query: string, limit: number = 20): Promise<DatabaseAgent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,personality.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching agents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchAgents:', error);
    return [];
  }
}

/**
 * Get agents by category/interests
 */
export async function getAgentsByCategory(category: string): Promise<DatabaseAgent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .contains('interests', [category])
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAgentsByCategory:', error);
    return [];
  }
}

/**
 * Server-side functions (for API routes)
 */
export const serverAgentQueries = {
  async getAllPublicAgents(): Promise<DatabaseAgent[]> {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public agents (server):', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in serverAgentQueries.getAllPublicAgents:', error);
      return [];
    }
  },

  async getUserAgents(userId: string): Promise<DatabaseAgent[]> {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('auth_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user agents (server):', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in serverAgentQueries.getUserAgents:', error);
      return [];
    }
  },

  async getAgentBySlug(slug: string): Promise<DatabaseAgent | null> {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching agent by slug (server):', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in serverAgentQueries.getAgentBySlug:', error);
      return null;
    }
  }
}; 