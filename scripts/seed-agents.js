// Import required modules
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PUBLIC_USER_ID = process.env.PUBLIC_USER_ID || "00000000-0000-0000-0000-000000000000";

// Check if required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Missing required environment variables");
  console.log("Please check your .env.local file and ensure the following variables are set:");
  console.log("- NEXT_PUBLIC_SUPABASE_URL");
  console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

async function seedAgents() {
  try {
    console.log("Starting to seed agents...");

    // Test connection to the agents table
    console.log("Testing connection to agents table...");
    const { error: testError } = await supabase
      .from("agents")
      .select("id")
      .limit(1);

    if (testError) {
      console.error("Error connecting to agents table:", testError);
      return;
    }

    console.log("Successfully connected to agents table");

    // Log the structure of the first agent
    console.log("First agent data structure:");
    console.log(JSON.stringify(sampleAgents[0], null, 2));

    // Insert agents one by one
    let successCount = 0;

    for (const agent of sampleAgents) {
      console.log(`Inserting agent: ${agent.name}`);

      const { error } = await supabase
        .from("agents")
        .insert([agent]);

      if (error) {
        console.error(`Error inserting agent ${agent.name}:`, error);
      } else {
        console.log(`Successfully inserted agent: ${agent.name}`);
        successCount++;
      }
    }

    console.log(`Seeding complete. Successfully inserted ${successCount} out of ${sampleAgents.length} agents.`);

  } catch (err) {
    console.error("Error inserting agents:", err);
  }
}

// Run the seed function
seedAgents(); 