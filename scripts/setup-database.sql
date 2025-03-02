-- Comprehensive Supabase SQL Setup Script
-- For https://wwjzkoledvsgkgvfpfqz.supabase.co

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema for profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT username_min_length CHECK (char_length(username) >= 3)
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Automatically create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  personality TEXT NOT NULL,
  description TEXT,
  interests TEXT[] DEFAULT '{}'::TEXT[],
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  fee_amount DECIMAL DEFAULT 0,
  fee_token TEXT DEFAULT 'ETH'
);

-- Create RLS policies for agents
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents are viewable by everyone" ON agents
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own agents" ON agents
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own agents" ON agents
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can delete their own agents" ON agents
  FOR DELETE USING (auth.uid() = auth_user_id);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL
);

-- Create RLS policies for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = auth_user_id OR auth_user_id IS NULL);

CREATE POLICY "Anyone can create a conversation" ON conversations
  FOR INSERT WITH CHECK (true);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant'))
);

-- Create RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are viewable by conversation participants" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.auth_user_id = auth.uid() OR c.auth_user_id IS NULL)
    )
  );

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Function to generate seed data
-- This will safely insert a public profile and some initial agents
-- You can run this function to seed your database
CREATE OR REPLACE FUNCTION seed_initial_data()
RETURNS void AS $$
DECLARE
  public_user_id UUID := '00000000-0000-0000-0000-000000000000'::UUID;
  public_profile_id UUID := '11111111-1111-1111-1111-111111111111'::UUID;
BEGIN
  -- Temporarily disable RLS
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
  ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

  -- Create a public profile
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
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert sample agents
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
  ) ON CONFLICT (slug) DO NOTHING;

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
  ) ON CONFLICT (slug) DO NOTHING;

  -- Re-enable RLS after inserts
  ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql;

-- Call the function to seed initial data
-- You can comment this out if you want to run it manually later
SELECT seed_initial_data();

-- Verify data was properly inserted
SELECT COUNT(*) AS profile_count FROM profiles;
SELECT COUNT(*) AS agent_count FROM agents;