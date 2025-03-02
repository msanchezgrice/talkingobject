// Import required modules
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import readline from 'readline';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for user input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

// Simple agent data for testing - matches the actual DB schema
const testAgent = {
  name: "Test Agent",
  slug: "test-agent",
  description: "A test agent to verify insertion works",
  personality: "FRIENDLY",
  interests: ["testing", "debugging", "development"],
  is_active: true,
  fee_amount: 0,
  fee_token: "ETH"
};

async function signInWithSupabase() {
  try {
    console.log("To insert agents, you need to sign in to Supabase first.");
    const email = await prompt("Enter your Supabase account email: ");
    const password = await prompt("Enter your password: ");

    console.log("Signing in to Supabase...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Error signing in:", error.message);
      return null;
    }

    console.log("Successfully signed in as:", data.user.email);
    console.log("User ID:", data.user.id);
    return data.user.id;
  } catch (err) {
    console.error("Error during sign in:", err);
    return null;
  }
}

async function testAgentInsertion(userId) {
  try {
    console.log("\nTesting agent insertion...");
    
    // Update the user_id field with authenticated user's ID
    const agent = { ...testAgent, user_id: userId };
    
    console.log("Inserting test agent with data:");
    console.log(JSON.stringify(agent, null, 2));
    
    const { data, error } = await supabase
      .from("agents")
      .insert([agent])
      .select();
    
    if (error) {
      console.error("Error inserting test agent:", error);
      return false;
    }
    
    console.log("Successfully inserted test agent!");
    console.log("Inserted agent data:", data);
    return true;
  } catch (err) {
    console.error("Unexpected error during insertion test:", err);
    return false;
  }
}

async function main() {
  try {
    // Sign in first
    const userId = await signInWithSupabase();
    if (!userId) {
      console.error("Authentication failed. Cannot proceed with seeding.");
      process.exit(1);
    }
    
    // Test a single insertion first
    const insertionSuccess = await testAgentInsertion(userId);
    
    if (insertionSuccess) {
      console.log("\nTest successful! You can now modify this script to insert multiple agents.");
      console.log("Your authenticated user ID is:", userId);
      console.log("Use this ID when creating your agents.");
    } else {
      console.log("\nTest failed. Please check the error messages above.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    // Close the readline interface
    rl.close();
  }
}

// Run the main function
main(); 