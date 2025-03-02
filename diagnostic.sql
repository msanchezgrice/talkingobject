-- Diagnostic SQL Script
-- For https://wwjzkoledvsgkgvfpfqz.supabase.co
-- Run this script to check your database structure and identify any issues

-- Check if tables exist and review their structure
DO $$
DECLARE
    table_record RECORD;
    column_record RECORD;
BEGIN
    RAISE NOTICE '============= DATABASE DIAGNOSTIC REPORT =============';
    
    -- Check if necessary extensions are enabled
    RAISE NOTICE 'Checking extensions...';
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        RAISE NOTICE 'uuid-ossp extension is enabled ✓';
    ELSE
        RAISE NOTICE 'uuid-ossp extension is NOT enabled ✗';
    END IF;
    
    -- Check for public tables
    RAISE NOTICE '';
    RAISE NOTICE 'Checking for required tables...';
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    LOOP
        RAISE NOTICE 'Table found: %', table_record.table_name;
    END LOOP;
    
    -- Check profiles table structure
    RAISE NOTICE '';
    RAISE NOTICE 'Profiles table structure:';
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        FOR column_record IN 
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'profiles' AND table_schema = 'public'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - % (%, nullable: %)', 
                column_record.column_name, 
                column_record.data_type,
                column_record.is_nullable;
        END LOOP;
    ELSE
        RAISE NOTICE '  Table does not exist ✗';
    END IF;
    
    -- Check agents table structure
    RAISE NOTICE '';
    RAISE NOTICE 'Agents table structure:';
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agents' AND table_schema = 'public') THEN
        FOR column_record IN 
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'agents' AND table_schema = 'public'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - % (%, nullable: %)', 
                column_record.column_name, 
                column_record.data_type,
                column_record.is_nullable;
        END LOOP;
    ELSE
        RAISE NOTICE '  Table does not exist ✗';
    END IF;
    
    -- Check foreign key relationship (profiles -> auth.users)
    RAISE NOTICE '';
    RAISE NOTICE 'Checking foreign key relationships...';
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'profiles'
        AND ccu.table_schema = 'auth' AND ccu.table_name = 'users'
    ) THEN
        RAISE NOTICE 'Foreign key from profiles to auth.users exists ✓';
    ELSE
        RAISE NOTICE 'Foreign key from profiles to auth.users MISSING ✗';
    END IF;
    
    -- Check foreign key relationship (agents -> auth.users)
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'agents'
        AND ccu.table_schema = 'auth' AND ccu.table_name = 'users'
    ) THEN
        RAISE NOTICE 'Foreign key from agents to auth.users exists ✓';
    ELSE
        RAISE NOTICE 'Foreign key from agents to auth.users MISSING ✗';
    END IF;
    
    -- Check Row Level Security (RLS) status
    RAISE NOTICE '';
    RAISE NOTICE 'Checking Row Level Security (RLS) status...';
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'profiles' AND rowsecurity = true
    ) THEN
        RAISE NOTICE 'RLS is enabled for profiles table ✓';
    ELSE
        RAISE NOTICE 'RLS is NOT enabled for profiles table ✗';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'agents' AND rowsecurity = true
    ) THEN
        RAISE NOTICE 'RLS is enabled for agents table ✓';
    ELSE
        RAISE NOTICE 'RLS is NOT enabled for agents table ✗';
    END IF;
    
    -- Check for any existing data
    RAISE NOTICE '';
    RAISE NOTICE 'Checking for existing data...';
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        EXECUTE 'SELECT COUNT(*) FROM profiles' INTO column_record;
        RAISE NOTICE '  Profiles count: %', column_record;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agents' AND table_schema = 'public') THEN
        EXECUTE 'SELECT COUNT(*) FROM agents' INTO column_record;
        RAISE NOTICE '  Agents count: %', column_record;
    END IF;
    
    RAISE NOTICE '============= END OF DIAGNOSTIC REPORT =============';
END $$; 