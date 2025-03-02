import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase URL or Key not found in environment variables.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log('🔍 Checking Supabase connection...');
  console.log(`🌐 URL: ${supabaseUrl}`);
  
  try {
    // Test with a simple query
    const { data, error } = await supabase.from('agents').select('count(*)');
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.error('❌ Error: The "agents" table does not exist!');
        console.error('Follow these steps to create the database schema:');
        console.error('1. Run: ./scripts/copy-sql-to-clipboard.sh');
        console.error('2. Go to Supabase SQL Editor and run the SQL script');
        console.error('3. Restart your Next.js server');
      } else {
        console.error('❌ Connection Error:', error.message);
      }
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('✅ The "agents" table exists.');
    console.log('📊 Data:', data);
    
    // Check other tables
    await checkTable('profiles');
    await checkTable('conversations');
    await checkTable('messages');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

async function checkTable(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('count(*)');
    
    if (error) {
      console.error(`❌ Table "${tableName}" check failed:`, error.message);
      return;
    }
    
    console.log(`✅ Table "${tableName}" exists.`);
  } catch (err) {
    console.error(`❌ Error checking table "${tableName}":`, err.message);
  }
}

checkConnection(); 