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
 * Check if a slug is available (server-side)
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    
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
 * Server-side functions for API routes
 */
export const serverAgentQueries = {
  async getAllPublicAgents(): Promise<DatabaseAgent[]> {
    try {
      const supabase = await createServerSupabaseClient();
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
      const supabase = await createServerSupabaseClient();
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
      const supabase = await createServerSupabaseClient();
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
  },

  async createAgent(agentData: CreateAgentData): Promise<DatabaseAgent | null> {
    try {
      const supabase = await createServerSupabaseClient();
      
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
        console.error('Error creating agent (server):', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in serverAgentQueries.createAgent:', error);
      return null;
    }
  },

  async updateAgent(id: string, agentData: UpdateAgentData): Promise<DatabaseAgent | null> {
    try {
      const supabase = await createServerSupabaseClient();
      
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
        console.error('Error updating agent (server):', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in serverAgentQueries.updateAgent:', error);
      return null;
    }
  },

  async deleteAgent(id: string, userId: string): Promise<boolean> {
    try {
      const supabase = await createServerSupabaseClient();
      
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)
        .eq('auth_user_id', userId); // Ensure user can only delete their own agents

      if (error) {
        console.error('Error deleting agent (server):', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in serverAgentQueries.deleteAgent:', error);
      return false;
    }
  },

  // Clerk-compatible server functions
  async getClerkAgentBySlug(slug: string): Promise<DatabaseAgent | null> {
    // Use console.error for better visibility in Vercel logs
    console.error('🔍 [SERVER] Attempting to fetch agent by slug:', slug);
    console.error('🌐 [SERVER] Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...',
      nodeEnv: process.env.NODE_ENV
    });
    
    try {
      const supabase = await createServerSupabaseClient();
      console.error('✅ [SERVER] Supabase client created successfully');
      
      console.error('🔍 [SERVER] Executing query for slug:', slug);
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.error('📭 [SERVER] No agent found with slug:', slug);
          return null;
        }
        console.error('❌ [SERVER] Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          slug: slug
        });
        return null;
      }

      console.error('✅ [SERVER] Agent found successfully:', {
        name: data ? data.name : 'null',
        id: data ? data.id : 'null',
        slug: data ? data.slug : 'null'
      });
      return data;
    } catch (error) {
      console.error('💥 [SERVER] Exception in getClerkAgentBySlug:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        slug: slug
      });
      return null;
    }
  }
}; 