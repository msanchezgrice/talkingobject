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

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase URL or Anon Key not found in environment variables');
  console.log('Please check your .env.local file and ensure the following variables are set:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  try {
    console.log('Checking database schema...');

    // First, try a simple query on the agents table
    console.log('Querying the agents table...');
    const { data: sample, error: sampleError } = await supabase
      .from('agents')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('Error querying agents table:', sampleError);
    } else {
      console.log('Found an agent record with the following structure:');
      if (sample && sample.length > 0) {
        console.log(JSON.stringify(sample[0], null, 2));
        console.log('Available columns:', Object.keys(sample[0]).join(', '));
      } else {
        console.log('No records found in the agents table.');
        
        // If no records, try to get table structure
        console.log('Trying to get table structure...');
        const { data: structure, error: structureError } = await supabase
          .rpc('get_schema', { table_name: 'agents' })
          .single();
          
        if (structureError) {
          console.error('Error getting table structure:', structureError);
        } else {
          console.log('Table structure:', structure);
        }
      }
    }

  } catch (err) {
    console.error('Unexpected error while checking schema:', err);
  }
}

// Run the function
checkSchema(); 