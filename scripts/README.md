# Scripts for Talking Objects

This directory contains utility scripts for the Talking Objects application.

## Supabase Connection Check

If you're experiencing issues with Supabase connectivity, you can run the `check-supabase.js` script to verify your setup:

```bash
node check-supabase.js
```

This script will:
1. Verify that your `.env.local` file exists and has the required Supabase variables
2. Test the connection to your Supabase database
3. Provide feedback on any issues encountered

## Seed Agents Script

The `seed-agents.js` script populates the Supabase database with sample agents for the Explore tab.

### Prerequisites

Before running the script:

1. Make sure the Supabase project is set up and the `.env.local` file contains valid Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Get your user ID from Supabase:
   - Option 1: Use the `get-user-id.js` script (recommended)
   - Option 2: Log in to the application and check the browser console or Supabase dashboard for your user ID
   - Update the `PUBLIC_USER_ID` value in the `seed-agents.js` script with your actual user ID

### Installation

Install the dependencies in the scripts directory:

```bash
cd scripts
npm install
```

### Get User ID Script

To easily find your Supabase user ID, run:

```bash
node get-user-id.js
```

This interactive script will:
1. Prompt you for your Supabase account email and password
2. Sign in to your account 
3. Display your user ID, which you can then use in the seed script

### Running the Seed Script

After updating the `PUBLIC_USER_ID` in the seed script, run:

```bash
node seed-agents.js
```

This will insert 10 diverse agents into the database, each with:
- A unique name and personality
- Geographic coordinates for different global locations
- Associated data sources (weather, news, events, stocks)
- Preview images from Unsplash

The script will output the result of the operation, including any agents successfully inserted. 