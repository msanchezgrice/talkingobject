# Talking Objects

A platform for creating location-aware AI agents that can access real-time data and be shared via QR codes.

## Overview

Talking Objects allows users to create AI agents with unique personalities and capabilities. These agents can be anchored to specific locations, access external data sources such as weather and news, and be shared with others through QR codes.

## Features

- User authentication using Supabase
- Create and manage AI agents with custom personalities
- Location-awareness for contextual information
- Integration with external data APIs (weather, news, events, stocks)
- Claude API integration for natural conversations
- QR code generation for sharing agents
- Explore page to discover public agents

## Tech Stack

- **Frontend/Backend**: Next.js 15 (App Router)
- **CSS Framework**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **External APIs**: OpenWeatherMap, News API, Ticketmaster, AlphaVantage
- **AI**: Claude API (Anthropic)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- API keys for external services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/talking-objects.git
   cd talking-objects
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   CLAUDE_API_KEY=your-claude-api-key
   OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
   NEWS_API_KEY=your-newsapi-key
   TICKETMASTER_API_KEY=your-ticketmaster-api-key
   ALPHAVANTAGE_API_KEY=your-alphavantage-api-key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Execute the SQL commands in `supabase/migrations/20240601_initial_schema.sql` in your Supabase SQL editor to create the necessary tables and policies.

## Testing

### API Testing

Run the API test script to verify external API integrations:
```bash
node api-test.js
```

### Manual Testing

A comprehensive UI test checklist is available in `ui-test-checklist.md`.

## Deployment

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

## Development Workflow

1. Create a new branch for your feature or bug fix
2. Make changes and test locally
3. Push to GitHub and create a Pull Request
4. GitHub Actions will run tests
5. Vercel will generate a preview deployment
6. After review, merge to main for production deployment

## License

MIT

## Acknowledgements

- Anthropic for the Claude AI model
- OpenWeatherMap for weather data
- News API for news articles
- Ticketmaster for events data
- Alpha Vantage for stock market data

# Supabase Setup Instructions

This project uses Supabase for authentication and database services. Follow these instructions to set up your Supabase environment properly.

## Supabase Configuration

We're using the following Supabase instance:
- **URL**: https://wwjzkoledvsgkgvfpfqz.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3anprb2xlZHZzZ2tndmZwZnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDgwNjQsImV4cCI6MjA1NjEyNDA2NH0.6__7ruThjutDHS2q2hPkGyfKtBw-G_zPG9F9mpx42EU

## Setup Instructions

### 1. Set Up Environment Variables

Run the provided script to set up your environment variables:

```bash
node setup-env.js
```

This will create a `.env.local` file with the necessary configuration.

### 2. Set Up Database Schema

1. Go to [Supabase Dashboard](https://app.supabase.com/) and log in
2. Navigate to your project
3. Go to the SQL Editor tab
4. Copy the contents of `setup-database.sql` and run it in the SQL Editor
5. This will create all necessary tables and set up Row Level Security (RLS)

### 3. Run Diagnostic Script

After setting up the schema, run the diagnostic script to verify everything is working correctly:

1. In the SQL Editor, create a new query
2. Copy the contents of `diagnostic.sql` and run it
3. Review the output to make sure all tables and security policies are correctly set up

### 4. Seed Initial Data

Seed your database with initial agents:

1. In the SQL Editor, create a new query
2. Copy the contents of `seed-agents.sql` and run it
3. This will create a public profile and some initial agents

### 5. Verify Everything Works

Make sure your Next.js application can connect to Supabase:

1. Start your Next.js app with `npm run dev`
2. Navigate to the dashboard or agents page
3. Verify that agents are displayed correctly

## Database Schema

The project uses the following key tables:

### Profiles Table

This table stores user profile information:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Agents Table

This table stores information about AI agents:

```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  personality TEXT NOT NULL,
  description TEXT,
  interests TEXT[] DEFAULT '{}'::TEXT[],
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  fee_amount DECIMAL DEFAULT 0,
  fee_token TEXT DEFAULT 'ETH'
);
```

## Troubleshooting

If you encounter issues:

1. Run the diagnostic script to identify any database structure problems
2. Check that Row Level Security (RLS) is properly enabled
3. Ensure your environment variables match the Supabase project settings
4. Verify that all foreign key relationships are correctly defined

## Important Notes

- The profile table uses `auth_user_id` instead of `user_id` to link to auth.users
- All agents are associated with profiles through the `auth_user_id` field
- The public user ID is set to '00000000-0000-0000-0000-000000000000'
