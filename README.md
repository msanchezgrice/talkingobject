# Talking Objects

A platform for creating location-aware AI agents that can be shared in the real world via QR codes. These agents can access real-time data like weather, news, events, and financial information to provide contextually relevant responses.

## Features

- **User Authentication**: Secure sign-up, login, and profile management
- **Agent Creation**: Create AI agents with customizable personalities and data sources
- **Location Awareness**: Agents can provide information based on their assigned location
- **External Data Integration**:
  - Weather conditions and forecasts
  - Latest news articles
  - Local events and activities
  - Stock market data
- **Claude API Integration**: Intelligent conversations powered by Anthropic's Claude
- **Agent Sharing**: QR codes for each agent that can be placed in physical locations
- **Explore Page**: Discover public agents created by other users

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Model**: Claude API (Anthropic)
- **External APIs**:
  - OpenWeatherMap API
  - News API
  - Ticketmaster API
  - Alpha Vantage API

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- API keys for Claude and external services

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/talking-objects.git
   cd talking-objects
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Claude API
   CLAUDE_API_KEY=your_claude_api_key
   
   # External APIs
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
   NEWS_API_KEY=your_news_api_key
   TICKETMASTER_API_KEY=your_ticketmaster_api_key
   ALPHAVANTAGE_API_KEY=your_alphavantage_api_key
   
   # Base URL (for QR codes)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

This project uses Supabase for database and authentication. You'll need to set up the following tables in your Supabase project:

1. **agents** table:
   ```sql
   CREATE TABLE agents (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     name TEXT NOT NULL,
     personality TEXT NOT NULL,
     hasDataSources BOOLEAN DEFAULT FALSE,
     dataSourceWeather BOOLEAN DEFAULT FALSE,
     dataSourceNews BOOLEAN DEFAULT FALSE,
     dataSourceEvents BOOLEAN DEFAULT FALSE,
     dataSourceStocks BOOLEAN DEFAULT FALSE,
     location TEXT,
     public BOOLEAN DEFAULT FALSE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     image_url TEXT,
     slug TEXT UNIQUE NOT NULL
   );
   ```

2. **conversations** table:
   ```sql
   CREATE TABLE conversations (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
     user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
     session_id TEXT
   );
   ```

3. **messages** table:
   ```sql
   CREATE TABLE messages (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
     content TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('user', 'assistant'))
   );
   ```

4. Set up row-level security (RLS) policies for each table to ensure proper access control.

## Testing

### API Testing

Use the included test scripts to verify the API endpoints:

```
node api-test.js
node agent-chat-test.js
```

### Manual Testing

1. Use the `ui-test-checklist.md` file to systematically test all UI components.
2. Test the application on different browsers and devices.
3. Verify that all features work as expected.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository.
2. Import your project in Vercel.
3. Configure the environment variables in the Vercel dashboard.
4. Deploy the application.

### Updating the Base URL

For production deployment, make sure to update the `NEXT_PUBLIC_BASE_URL` environment variable to your production URL.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Anthropic for the Claude AI model
- OpenWeatherMap for weather data
- News API for news articles
- Ticketmaster for events data
- Alpha Vantage for stock market data
