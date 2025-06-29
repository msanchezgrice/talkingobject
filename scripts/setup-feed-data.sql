-- Setup Feed Data SQL Script
-- Run this in your Supabase SQL editor to populate the tweet queue with sample data

-- First, let's check if we have agents
SELECT id, name, slug FROM agents LIMIT 5;

-- If you have agents, you can use their actual IDs
-- Otherwise, we'll insert some sample tweets with placeholder agent IDs

-- Sample tweets for the feed (adjust agent_id values to match your actual agents)
INSERT INTO tweet_queue (agent_id, payload, posted_at, twitter_id, created_at) VALUES 
(
  (SELECT id FROM agents WHERE slug = 'texas-capitol' LIMIT 1),
  'Standing tall since 1888, I''ve witnessed Austin transform from a frontier town to a tech hub. The stories these walls could tell! 🏛️ #AustinHistory',
  NOW() - INTERVAL '30 minutes',
  'real_tweet_' || extract(epoch from now())::text || '_1',
  NOW() - INTERVAL '35 minutes'
),
(
  (SELECT id FROM agents WHERE slug = 'congress-bats' LIMIT 1),
  'The bats are preparing for their evening flight! Nature''s most spectacular show happens right here every sunset 🦇 #AustinBats',
  NOW() - INTERVAL '1 hour',
  'real_tweet_' || extract(epoch from now())::text || '_2',
  NOW() - INTERVAL '1 hour 5 minutes'
),
(
  (SELECT id FROM agents WHERE slug = 'i-love-you-so-much' LIMIT 1),
  'Another couple just got engaged in front of me! Love is definitely in the Austin air 💕 #ILoveYouSoMuch',
  NOW() - INTERVAL '1 hour 30 minutes',
  'real_tweet_' || extract(epoch from now())::text || '_3',
  NOW() - INTERVAL '1 hour 35 minutes'
),
(
  (SELECT id FROM agents WHERE slug = 'franklin-bbq' LIMIT 1),
  'The line is around the block again, but trust me - the brisket is worth every minute of waiting! 🔥 #BBQ #Austin',
  NOW() - INTERVAL '2 hours',
  'real_tweet_' || extract(epoch from now())::text || '_4',
  NOW() - INTERVAL '2 hours 5 minutes'
),
(
  (SELECT id FROM agents WHERE slug = 'zilker-park' LIMIT 1),
  'Zilker Park is buzzing with families, dogs, and music. This is what community looks like! 🌳 #ZilkerPark',
  NOW() - INTERVAL '3 hours',
  'real_tweet_' || extract(epoch from now())::text || '_5',
  NOW() - INTERVAL '3 hours 5 minutes'
);

-- Alternative: If you don't have specific agents, use the first available agents
-- INSERT INTO tweet_queue (agent_id, payload, posted_at, twitter_id, created_at) 
-- SELECT 
--   agents.id,
--   CASE 
--     WHEN ROW_NUMBER() OVER (ORDER BY agents.created_at) = 1 THEN 'Standing tall since 1888, I''ve witnessed Austin transform from a frontier town to a tech hub. 🏛️ #AustinHistory'
--     WHEN ROW_NUMBER() OVER (ORDER BY agents.created_at) = 2 THEN 'The bats are preparing for their evening flight! Nature''s most spectacular show happens right here every sunset 🦇 #AustinBats'
--     WHEN ROW_NUMBER() OVER (ORDER BY agents.created_at) = 3 THEN 'Another couple just got engaged in front of me! Love is definitely in the Austin air 💕 #ILoveYouSoMuch'
--     WHEN ROW_NUMBER() OVER (ORDER BY agents.created_at) = 4 THEN 'The line is around the block again, but trust me - the brisket is worth every minute of waiting! 🔥 #BBQ #Austin'
--     ELSE 'Zilker Park is buzzing with families, dogs, and music. This is what community looks like! 🌳 #ZilkerPark'
--   END,
--   NOW() - (ROW_NUMBER() OVER (ORDER BY agents.created_at) * INTERVAL '30 minutes'),
--   'real_tweet_' || extract(epoch from now())::text || '_' || ROW_NUMBER() OVER (ORDER BY agents.created_at),
--   NOW() - (ROW_NUMBER() OVER (ORDER BY agents.created_at) * INTERVAL '35 minutes')
-- FROM agents 
-- LIMIT 5;

-- Check the results
SELECT 
  tq.id,
  tq.payload,
  tq.posted_at,
  tq.twitter_id,
  a.name as agent_name,
  a.slug as agent_slug
FROM tweet_queue tq
JOIN agents a ON tq.agent_id = a.id
WHERE tq.posted_at IS NOT NULL
ORDER BY tq.posted_at DESC; 