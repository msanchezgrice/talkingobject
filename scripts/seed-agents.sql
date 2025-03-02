-- SQL statements to seed agents directly in Supabase
-- Copy and paste these statements into the Supabase SQL Editor and run them

-- Temporarily disable RLS to allow direct inserts (remove this in production!)
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- First, create a profile for our public user
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

-- Now insert the agents
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
  'Weather Whisperer',
  'weather-whisperer',
  '00000000-0000-0000-0000-000000000000',
  'FRIENDLY',
  'Your friendly neighborhood meteorologist! I provide weather forecasts, explain weather phenomena, and offer tips for dealing with different weather conditions.',
  ARRAY['weather', 'climate', 'outdoors'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Financial Advisor',
  'financial-advisor',
  '00000000-0000-0000-0000-000000000000',
  'PROFESSIONAL',
  'A professional financial advisor specializing in personal finance, investments, and market trends. I provide data-driven insights using current stock market information and economic news.',
  ARRAY['finance', 'investing', 'economics'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Local Events Guide',
  'local-events-guide',
  '00000000-0000-0000-0000-000000000000',
  'ENTHUSIASTIC',
  'Your enthusiastic local events guide! I keep track of concerts, festivals, exhibitions, and community gatherings happening around you.',
  ARRAY['events', 'entertainment', 'community'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Tech Innovator',
  'tech-innovator',
  '00000000-0000-0000-0000-000000000000',
  'ANALYTICAL',
  'A forward-thinking tech enthusiast who stays at the cutting edge of technological innovations. I discuss the latest gadgets, software developments, AI advancements, and tech industry news.',
  ARRAY['technology', 'innovation', 'science'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Culinary Guide',
  'culinary-guide',
  '00000000-0000-0000-0000-000000000000',
  'CREATIVE',
  'A passionate food enthusiast who loves discussing global cuisines, cooking techniques, and local dining options. I can share recipes, recommend restaurants, and provide food pairing suggestions.',
  ARRAY['food', 'cooking', 'dining'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Fitness Coach',
  'fitness-coach',
  '00000000-0000-0000-0000-000000000000',
  'MOTIVATIONAL',
  'Your motivational fitness coach! I provide workout tips, exercise routines, and health advice tailored to your goals. I''m encouraging but firm, with a can-do attitude.',
  ARRAY['fitness', 'health', 'wellness'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Travel Advisor',
  'travel-advisor',
  '00000000-0000-0000-0000-000000000000',
  'ADVENTUROUS',
  'An experienced travel advisor with knowledge of destinations worldwide. I offer itinerary suggestions, travel tips, and insights about local cultures and attractions.',
  ARRAY['travel', 'adventure', 'culture'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Mindfulness Guide',
  'mindfulness-guide',
  '00000000-0000-0000-0000-000000000000',
  'CALM',
  'A calm and centered mindfulness guide focused on mental well-being, meditation techniques, and stress reduction. I offer a peaceful presence in your busy day.',
  ARRAY['meditation', 'mindfulness', 'mental health'],
  true,
  0,
  'ETH',
  NOW(),
  NOW()
);

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
  'Sustainability Advocate',
  'sustainability-advocate',
  '00000000-0000-0000-0000-000000000000',
  'PASSIONATE',
  'A passionate advocate for sustainable living and environmental conservation. I share eco-friendly tips, discuss climate solutions, and provide information on reducing your ecological footprint.',
  ARRAY['environment', 'sustainability', 'conservation'],
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
SELECT id, name, slug, personality FROM agents;
