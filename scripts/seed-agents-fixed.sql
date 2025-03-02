-- SQL statements to seed agents directly in Supabase
-- Copy and paste these statements into the Supabase SQL Editor and run them

-- First, check if the tables exist and what columns they have
DO $$
DECLARE
  has_profiles_table boolean;
  has_agents_table boolean;
  has_user_id boolean;
  has_auth_user_id boolean;
  has_agent_user_id boolean;
BEGIN
  -- Check if tables exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'profiles'
  ) INTO has_profiles_table;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'agents'
  ) INTO has_agents_table;
  
  RAISE NOTICE 'Profiles table exists: %', has_profiles_table;
  RAISE NOTICE 'Agents table exists: %', has_agents_table;
  
  -- Check profile columns
  IF has_profiles_table THEN
    -- Check for user_id column
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'user_id'
    ) INTO has_user_id;
    
    -- Check for auth_user_id column (possible alternative name)
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'auth_user_id'
    ) INTO has_auth_user_id;
    
    RAISE NOTICE 'Profiles table has user_id: %', has_user_id;
    RAISE NOTICE 'Profiles table has auth_user_id: %', has_auth_user_id;
  END IF;
  
  -- Check agent columns
  IF has_agents_table THEN
    -- Check for user_id column
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'agents' AND column_name = 'user_id'
    ) INTO has_agent_user_id;
    
    RAISE NOTICE 'Agents table has user_id: %', has_agent_user_id;
  END IF;
  
  -- List all columns in the profiles table
  RAISE NOTICE 'Profiles table columns:';
  IF has_profiles_table THEN
    FOR column_record IN
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'profiles'
      ORDER BY ordinal_position
    LOOP
      RAISE NOTICE '%: %', column_record.column_name, column_record.data_type;
    END LOOP;
  END IF;
  
  -- List all columns in the agents table
  RAISE NOTICE 'Agents table columns:';
  IF has_agents_table THEN
    FOR column_record IN
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'agents'
      ORDER BY ordinal_position
    LOOP
      RAISE NOTICE '%: %', column_record.column_name, column_record.data_type;
    END LOOP;
  END IF;
  
  -- Create the profile based on which column exists
  IF has_profiles_table THEN
    IF has_user_id THEN
      -- Insert using user_id column
      EXECUTE $SQL$
        INSERT INTO profiles (
          id,
          user_id,
          username,
          full_name,
          avatar_url,
          updated_at
        ) VALUES (
          '11111111-1111-1111-1111-111111111111',
          '00000000-0000-0000-0000-000000000000',
          'explorer_profile',
          'Exploration User',
          NULL,
          NOW()
        ) ON CONFLICT (user_id) DO NOTHING;
      $SQL$;
      RAISE NOTICE 'Profile created with user_id column';
    ELSIF has_auth_user_id THEN
      -- Insert using auth_user_id column
      EXECUTE $SQL$
        INSERT INTO profiles (
          id,
          auth_user_id,
          username,
          full_name,
          avatar_url,
          updated_at
        ) VALUES (
          '11111111-1111-1111-1111-111111111111',
          '00000000-0000-0000-0000-000000000000',
          'explorer_profile',
          'Exploration User',
          NULL,
          NOW()
        ) ON CONFLICT (auth_user_id) DO NOTHING;
      $SQL$;
      RAISE NOTICE 'Profile created with auth_user_id column';
    ELSE
      RAISE NOTICE 'Unable to create profile - neither user_id nor auth_user_id column exists';
    END IF;
  ELSE
    RAISE NOTICE 'Unable to create profile - profiles table does not exist';
  END IF;
END $$;

-- Only attempt to disable RLS if the tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agents') THEN
    EXECUTE 'ALTER TABLE agents DISABLE ROW LEVEL SECURITY;';
    RAISE NOTICE 'Disabled RLS on agents table';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    EXECUTE 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;';
    RAISE NOTICE 'Disabled RLS on profiles table';
  END IF;
END $$;

-- Only insert agents if the table exists and has the right columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'user_id'
  ) THEN
    EXECUTE $SQL$
      INSERT INTO agents (
        name, 
        slug, 
        user_id, 
        personality, 
        description, 
        interests, 
        is_active, 
        fee_amount, 
        fee_token,
        created_at,
        updated_at
      ) VALUES (
        'Historical Guide',
        'historical-guide',
        '00000000-0000-0000-0000-000000000000',
        'KNOWLEDGEABLE',
        'A knowledgeable historical guide with expertise in world history. I can provide interesting facts about historical sites, discuss significant historical events, and connect past events to present-day contexts.',
        ARRAY['history', 'culture', 'education'],
        true,
        0,
        'ETH',
        NOW(),
        NOW()
      );
    $SQL$;
    RAISE NOTICE 'Agent inserted successfully';
  ELSE
    RAISE NOTICE 'Unable to insert agent - agents table does not have the required columns';
  END IF;
END $$;

-- Only re-enable RLS if the tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agents') THEN
    EXECUTE 'ALTER TABLE agents ENABLE ROW LEVEL SECURITY;';
    RAISE NOTICE 'Enabled RLS on agents table';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    EXECUTE 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;';
    RAISE NOTICE 'Enabled RLS on profiles table';
  END IF;
END $$;

-- Verify inserts were successful
SELECT id, name, slug, personality FROM agents WHERE slug = 'historical-guide';