// setup-env.js
// A simple utility to set up your local environment variables for Supabase

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const SUPABASE_URL = 'https://wwjzkoledvsgkgvfpfqz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3anprb2xlZHZzZ2tndmZwZnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDgwNjQsImV4cCI6MjA1NjEyNDA2NH0.6__7ruThjutDHS2q2hPkGyfKtBw-G_zPG9F9mpx42EU';

// Default ENV variables
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# AI Provider Configuration
CLAUDE_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_USE_ANTHROPIC=true

# External API Keys - Add your API keys here
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
NEWS_API_KEY=your-newsapi-key
TICKETMASTER_API_KEY=your-ticketmaster-api-key
ALPHAVANTAGE_API_KEY=your-alphavantage-api-key

# Base URL for QR code generation
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Default Public User ID (used for public agents)
PUBLIC_USER_ID=00000000-0000-0000-0000-000000000000
`;

// Create or update .env.local file
fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);

console.log('=================================================');
console.log('✅ Environment variables set up successfully!');
console.log('=================================================');
console.log('Supabase configuration:');
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Anon Key: ${SUPABASE_ANON_KEY.substring(0, 10)}...`);
console.log('=================================================');
console.log('Next steps:');
console.log('1. Run SQL setup script in Supabase SQL Editor');
console.log('2. Verify database tables with diagnostic SQL');
console.log('3. Seed agents with seed-agents.sql');
console.log('4. Start your Next.js app with: npm run dev');
console.log('================================================='); 