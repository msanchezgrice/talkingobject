-- Alternative SQL statements to seed agents
-- This version tries using 'id' as the foreign key instead of 'user_id'

-- Temporarily disable RLS to allow direct inserts
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- First, create a profile for our public user without specifying user_id
INSERT INTO profiles (
  id,
  username,
  full_name,
  avatar_url,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'explorer_profile',
  'Exploration User',
  NULL,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Now insert the agents using id
INSERT INTO agents (
  name, 
  slug, 
  id, -- Using id instead of user_id
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

-- Re-enable RLS after inserts are complete
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify inserts were successful
SELECT id, name, slug, personality FROM agents WHERE slug = 'historical-guide'; 