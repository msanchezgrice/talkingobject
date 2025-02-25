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

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

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
