-- Seed agents SQL script
-- For https://wwjzkoledvsgkgvfpfqz.supabase.co
-- Run this script in the Supabase SQL Editor

-- Define variables
DO $$
DECLARE
    public_user_id UUID := '00000000-0000-0000-0000-000000000000'::UUID;
    public_profile_id UUID := '11111111-1111-1111-1111-111111111111'::UUID;
BEGIN
    -- Log what we're doing
    RAISE NOTICE 'Starting agent seeding process...';
    
    -- Disable RLS temporarily
    RAISE NOTICE 'Disabling Row Level Security...';
    EXECUTE 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE agents DISABLE ROW LEVEL SECURITY';
    
    -- First, ensure the public profile exists
    RAISE NOTICE 'Creating public profile...';
    INSERT INTO profiles (
        id,
        auth_user_id,
        username,
        full_name,
        avatar_url,
        updated_at
    ) VALUES (
        public_profile_id,
        public_user_id,
        'explorer_profile',
        'Exploration User',
        NULL,
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        updated_at = NOW();
        
    RAISE NOTICE 'Public profile created or updated.';
    
    -- Now insert sample agents
    RAISE NOTICE 'Inserting sample agents...';
    
    -- Historical Guide agent
    INSERT INTO agents (
        auth_user_id,
        name,
        slug,
        personality,
        description,
        interests,
        is_active,
        fee_amount,
        fee_token,
        created_at,
        updated_at
    ) VALUES (
        public_user_id,
        'Historical Guide',
        'historical-guide',
        'KNOWLEDGEABLE',
        'A knowledgeable historical guide with expertise in world history. I can provide interesting facts about historical sites, discuss significant historical events, and connect past events to present-day contexts.',
        ARRAY['history', 'culture', 'education'],
        true,
        0,
        'ETH',
        NOW(),
        NOW()
    ) ON CONFLICT (slug) DO UPDATE SET
        updated_at = NOW();
    
    -- Weather Whisperer agent
    INSERT INTO agents (
        auth_user_id,
        name,
        slug,
        personality,
        description,
        interests,
        is_active,
        fee_amount,
        fee_token,
        created_at,
        updated_at
    ) VALUES (
        public_user_id,
        'Weather Whisperer',
        'weather-whisperer',
        'FRIENDLY',
        'Your friendly neighborhood meteorologist! I provide weather forecasts, explain weather phenomena, and offer tips for dealing with different weather conditions.',
        ARRAY['weather', 'climate', 'outdoors'],
        true,
        0,
        'ETH',
        NOW(),
        NOW()
    ) ON CONFLICT (slug) DO UPDATE SET
        updated_at = NOW();
    
    -- Financial Advisor agent
    INSERT INTO agents (
        auth_user_id,
        name,
        slug,
        personality,
        description,
        interests,
        is_active,
        fee_amount,
        fee_token,
        created_at,
        updated_at
    ) VALUES (
        public_user_id,
        'Financial Advisor',
        'financial-advisor',
        'PROFESSIONAL',
        'A professional financial advisor specializing in personal finance, investments, and market trends. I provide data-driven insights using current stock market information and economic news.',
        ARRAY['finance', 'investing', 'economics'],
        true,
        0,
        'ETH',
        NOW(),
        NOW()
    ) ON CONFLICT (slug) DO UPDATE SET
        updated_at = NOW();
    
    -- Re-enable RLS
    RAISE NOTICE 'Re-enabling Row Level Security...';
    EXECUTE 'ALTER TABLE agents ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY';
    
    RAISE NOTICE 'Agent seeding completed successfully.';
END $$;

-- Verify the data
SELECT COUNT(*) AS profile_count FROM profiles;
SELECT COUNT(*) AS agent_count FROM agents;
SELECT id, name, slug, personality FROM agents; 