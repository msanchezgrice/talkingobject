// Import required modules
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Get the public user ID or use a default
const PUBLIC_USER_ID = process.env.PUBLIC_USER_ID || "00000000-0000-0000-0000-000000000000";

// Sample agent data updated to match actual database structure
const sampleAgents = [
  {
    name: "Historical Guide",
    slug: "historical-guide",
    user_id: PUBLIC_USER_ID,
    personality: "KNOWLEDGEABLE",
    description: "A knowledgeable historical guide with expertise in world history. I can provide interesting facts about historical sites, discuss significant historical events, and connect past events to present-day contexts.",
    interests: ["history", "culture", "education"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Weather Whisperer",
    slug: "weather-whisperer",
    user_id: PUBLIC_USER_ID,
    personality: "FRIENDLY",
    description: "Your friendly neighborhood meteorologist! I provide weather forecasts, explain weather phenomena, and offer tips for dealing with different weather conditions.",
    interests: ["weather", "climate", "outdoors"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Financial Advisor",
    slug: "financial-advisor",
    user_id: PUBLIC_USER_ID,
    personality: "PROFESSIONAL",
    description: "A professional financial advisor specializing in personal finance, investments, and market trends. I provide data-driven insights using current stock market information and economic news.",
    interests: ["finance", "investing", "economics"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Local Events Guide",
    slug: "local-events-guide",
    user_id: PUBLIC_USER_ID,
    personality: "ENTHUSIASTIC",
    description: "Your enthusiastic local events guide! I keep track of concerts, festivals, exhibitions, and community gatherings happening around you.",
    interests: ["events", "entertainment", "community"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Tech Innovator",
    slug: "tech-innovator",
    user_id: PUBLIC_USER_ID,
    personality: "ANALYTICAL",
    description: "A forward-thinking tech enthusiast who stays at the cutting edge of technological innovations. I discuss the latest gadgets, software developments, AI advancements, and tech industry news.",
    interests: ["technology", "innovation", "science"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Culinary Guide",
    slug: "culinary-guide",
    user_id: PUBLIC_USER_ID,
    personality: "CREATIVE",
    description: "A passionate food enthusiast who loves discussing global cuisines, cooking techniques, and local dining options. I can share recipes, recommend restaurants, and provide food pairing suggestions.",
    interests: ["food", "cooking", "dining"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Fitness Coach",
    slug: "fitness-coach",
    user_id: PUBLIC_USER_ID,
    personality: "MOTIVATIONAL",
    description: "Your motivational fitness coach! I provide workout tips, exercise routines, and health advice tailored to your goals. I'm encouraging but firm, with a can-do attitude.",
    interests: ["fitness", "health", "wellness"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Travel Advisor",
    slug: "travel-advisor",
    user_id: PUBLIC_USER_ID,
    personality: "ADVENTUROUS",
    description: "An experienced travel advisor with knowledge of destinations worldwide. I offer itinerary suggestions, travel tips, and insights about local cultures and attractions.",
    interests: ["travel", "adventure", "culture"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Mindfulness Guide",
    slug: "mindfulness-guide",
    user_id: PUBLIC_USER_ID,
    personality: "CALM",
    description: "A calm and centered mindfulness guide focused on mental well-being, meditation techniques, and stress reduction. I offer a peaceful presence in your busy day.",
    interests: ["meditation", "mindfulness", "mental health"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  },
  {
    name: "Sustainability Advocate",
    slug: "sustainability-advocate",
    user_id: PUBLIC_USER_ID,
    personality: "PASSIONATE",
    description: "A passionate advocate for sustainable living and environmental conservation. I share eco-friendly tips, discuss climate solutions, and provide information on reducing your ecological footprint.",
    interests: ["environment", "sustainability", "conservation"],
    is_active: true,
    fee_amount: 0,
    fee_token: "ETH"
  }
];

// Function to escape single quotes in SQL strings
function escapeSql(str) {
  return str.replace(/'/g, "''");
}

// Function to convert interests array to PostgreSQL array syntax
function formatInterests(interests) {
  return `ARRAY[${interests.map(item => `'${escapeSql(item)}'`).join(', ')}]`;
}

// Generate SQL insert statements
function generateSqlInserts() {
  let sql = `-- SQL statements to seed agents directly in Supabase
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
  '${PUBLIC_USER_ID}',
  'explorer_profile',
  'Exploration User',
  NULL,
  NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Now insert the agents
`;

  sampleAgents.forEach(agent => {
    sql += `INSERT INTO agents (
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
  '${escapeSql(agent.name)}',
  '${escapeSql(agent.slug)}',
  '${agent.user_id}',
  '${escapeSql(agent.personality)}',
  '${escapeSql(agent.description)}',
  ${formatInterests(agent.interests)},
  ${agent.is_active},
  ${agent.fee_amount},
  '${escapeSql(agent.fee_token)}',
  NOW(),
  NOW()
);\n\n`;
  });

  sql += `-- Re-enable RLS after inserts are complete
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify inserts were successful
SELECT id, name, slug, personality FROM agents;
`;

  return sql;
}

// Generate the SQL and save to a file
const sql = generateSqlInserts();
const outputPath = resolve(__dirname, 'seed-agents.sql');

fs.writeFileSync(outputPath, sql);

console.log(`SQL statements generated and saved to: ${outputPath}`);
console.log('Instructions:');
console.log('1. Go to your Supabase dashboard: https://app.supabase.io/');
console.log('2. Navigate to the SQL Editor');
console.log('3. Copy and paste the contents of seed-agents.sql');
console.log('4. Run the SQL statements');
console.log('This will bypass RLS policies and insert the agents directly');
console.log('Note: Don\'t forget to re-enable RLS after the inserts (included in the SQL)'); 