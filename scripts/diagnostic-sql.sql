-- Diagnostic SQL script to analyze table structure
-- Run this in your Supabase SQL Editor to determine the correct columns

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
END $$; 