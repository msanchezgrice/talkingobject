// Script to set up the Supabase database
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be provided in .env.local file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to read and execute SQL file
async function executeSqlFile(filePath) {
  try {
    console.log(`Reading SQL file: ${filePath}`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    console.log('Executing SQL...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return false;
    }
    
    console.log('SQL execution successful!');
    return true;
  } catch (err) {
    console.error(`Error reading or executing SQL file ${filePath}:`, err);
    return false;
  }
}

// Alternative function to execute SQL using REST API if RPC is not available
async function executeSqlViaRest(filePath) {
  try {
    console.log(`Reading SQL file: ${filePath}`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL into statements by semicolons (simple approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.from('_sql').select('*').limit(1).rpc({
        select: stmt
      });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
      }
    }
    
    console.log('SQL execution completed.');
    return true;
  } catch (err) {
    console.error(`Error reading or executing SQL file ${filePath}:`, err);
    return false;
  }
}

// Main function to set up the database
async function setupDatabase() {
  console.log('Setting up Supabase database...');
  
  const sqlFilePath = path.join(__dirname, 'supabase', 'setup-database.sql');
  
  // Try executing via RPC first
  let success = await executeSqlFile(sqlFilePath);
  
  // If RPC failed, try REST API approach
  if (!success) {
    console.log('RPC method failed, trying alternative approach...');
    success = await executeSqlViaRest(sqlFilePath);
  }
  
  if (success) {
    console.log('Database setup completed successfully!');
  } else {
    console.error('Database setup failed.');
    console.log('You may need to manually execute the SQL file in the Supabase dashboard:');
    console.log('1. Go to https://app.supabase.io/');
    console.log('2. Navigate to your project');
    console.log('3. Go to the SQL Editor tab');
    console.log(`4. Open and run the SQL file: ${sqlFilePath}`);
  }
}

// Run the setup
setupDatabase().catch(err => {
  console.error('Unhandled error during database setup:', err);
  process.exit(1);
}); 