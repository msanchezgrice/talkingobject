import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://wwjzkoledvsgkgvfpfqz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3anprb2xlZHZzZ2tndmZwZnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDgwNjQsImV4cCI6MjA1NjEyNDA2NH0.6__7ruThjutDHS2q2hPkGyfKtBw-G_zPG9F9mpx42EU';
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to execute
const sqlContent = fs.readFileSync(path.join(__dirname, 'setup-database.sql'), 'utf8');

// Split the SQL into statements
const statements = sqlContent
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0)
  .map(stmt => stmt + ';');

async function runSQL() {
  console.log(`Running ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      console.log(`[${i + 1}/${statements.length}] Executing: ${stmt.substring(0, 50)}...`);
      
      // Execute the SQL statement
      const { error } = await supabase.rpc('pgdatabase_sql', {
        q: stmt
      });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
      }
    } catch (err) {
      console.error(`Exception executing statement ${i + 1}:`, err.message);
    }
  }
  
  console.log('SQL execution complete!');
}

runSQL().catch(console.error); 