// Script to get the user ID from Supabase
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

// Setup to load .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getUserId() {
  console.log('Getting user ID from Supabase...\n');
  
  try {
    // Check if we have the required environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Error: Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
      process.exit(1);
    }

    // Prompt for email and password
    const email = await new Promise(resolve => {
      rl.question('Enter your Supabase account email: ', resolve);
    });
    
    const password = await new Promise(resolve => {
      rl.question('Enter your Supabase account password: ', resolve);
    });
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Error signing in:', error.message);
      return;
    }
    
    if (data && data.user) {
      console.log('\nSuccessfully signed in!');
      console.log('Your User ID:', data.user.id);
      console.log('\nUse this ID in the seed-agents.js script by updating the PUBLIC_USER_ID value.');
    } else {
      console.error('Error: No user data returned from Supabase');
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    rl.close();
  }
}

// Run the function
getUserId(); 