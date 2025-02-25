# Deployment Guide for Talking Objects

This guide explains the process for deploying the Talking Objects application to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (can sign up with GitHub)
3. A Supabase account
4. API keys for external services:
   - OpenWeatherMap
   - News API
   - Ticketmaster
   - AlphaVantage
   - Claude API

## Deployment Steps

### 1. Push Your Code to GitHub

If you haven't already:

```bash
git remote add origin https://github.com/YOUR_USERNAME/talking-objects.git
git push -u origin main
```

### 2. Connect Vercel to Your GitHub Repository

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 3. Configure Environment Variables

Add the following environment variables in the Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
CLAUDE_API_KEY=your-claude-api-key
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
NEWS_API_KEY=your-newsapi-key
TICKETMASTER_API_KEY=your-ticketmaster-api-key
ALPHAVANTAGE_API_KEY=your-alphavantage-api-key
NEXT_PUBLIC_BASE_URL=https://your-production-domain.vercel.app
```

### 4. Deploy

1. Click "Deploy" and wait for the build to complete
2. Vercel will provide you with a deployment URL, e.g., `https://talking-objects.vercel.app`

### 5. Connect Your Custom Domain (Optional)

1. Go to your project in Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain and follow the DNS configuration instructions

## Deployment Workflow

### Continuous Deployment

Vercel automatically deploys when changes are pushed to the main branch on GitHub.

### Preview Deployments

When you create a Pull Request, Vercel will generate a preview URL for testing changes.

### Production Deployment

1. Merge your Pull Request to the main branch
2. Vercel will automatically deploy to production

## Troubleshooting

- **Build Failed**: Check the build logs for errors
- **API Errors**: Verify that all environment variables are correctly set
- **Database Connection Issues**: Check your Supabase connection settings

## Rollback Procedure

1. Go to your project in Vercel
2. Navigate to "Deployments"
3. Find the previous working deployment
4. Click the three dots (⋮) and select "Promote to Production" 