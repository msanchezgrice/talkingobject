# Deploying Talking Objects to Vercel

This guide provides step-by-step instructions for deploying the Talking Objects application to Vercel with the custom domain `talkingobjects.ai`.

## Prerequisites

- A GitHub account with your project repository
- A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)
- API keys for all required services (OpenAI, Claude, etc.)
- Ownership or access to the domain `talkingobjects.ai`

## Deployment Steps

### 1. Prepare Your Repository

1. Ensure your code is pushed to the GitHub repository: [https://github.com/msanchezgrice/talkingobject.git](https://github.com/msanchezgrice/talkingobject.git)
2. Make sure your `.gitignore` includes `.env.local` and any other files with sensitive information
3. Check that your `package.json` includes the correct build scripts

### 2. Connect to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository `msanchezgrice/talkingobject` from the list
4. If you don't see your repository, click "Adjust GitHub App Permissions" to grant Vercel access

### 3. Configure Project Settings

1. After selecting your repository, you'll see the project configuration page
2. Framework Preset: Verify that "Next.js" is automatically selected
3. Build and Output Settings:
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

### 4. Configure Environment Variables

Add the following environment variables to your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
CLAUDE_API_KEY
OPENWEATHERMAP_API_KEY
NEWS_API_KEY
TICKETMASTER_API_KEY
ALPHAVANTAGE_API_KEY
NEXT_PUBLIC_OPENAI_API_KEY
NEXT_PUBLIC_BASE_URL=https://talkingobjects.ai
PUBLIC_USER_ID
```

**Important**: For initial deployment, you may need to set `NEXT_PUBLIC_BASE_URL` to the Vercel preview URL. After setting up the custom domain, update it to `https://talkingobjects.ai`.

### 5. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once complete, you'll receive a temporary URL for your deployed application (e.g., `talkingobject.vercel.app`)

### 6. Set Up Custom Domain

1. Go to your project settings in Vercel
2. Click on "Domains"
3. Add your custom domain: `talkingobjects.ai`
4. Follow Vercel's instructions for domain verification and DNS configuration:
   - Update your domain's nameservers to point to Vercel, or
   - Add the required DNS records (usually a CNAME record pointing to `cname.vercel-dns.com`)
5. Wait for DNS propagation (may take up to 48 hours, but usually much faster)

### 7. Post-Deployment Configuration

After the domain is properly configured:

1. Go to your project settings in Vercel
2. Verify that `NEXT_PUBLIC_BASE_URL` is set to `https://talkingobjects.ai`
3. If you initially deployed with a different URL, redeploy the application for the changes to take effect

## Database Setup

The application is using Supabase for data storage. Make sure your Supabase project is properly configured:

1. If you're using a separate production Supabase instance, update the environment variables accordingly
2. Ensure all tables are properly created in your production database
3. You can use the database migration scripts in the `supabase` directory

## Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository:

1. When you push changes to your main branch, Vercel will automatically deploy them
2. When you create a pull request, Vercel will create a preview deployment
3. You can disable automatic deployments in your project settings if needed

## Monitoring and Logs

1. You can monitor your application's performance in the Vercel dashboard
2. Click on your project, then "Analytics" to view performance metrics
3. For logs, go to your project, click on a deployment, then "Logs"

## Troubleshooting

If you encounter issues with your deployment:

1. Check the build logs for errors
2. Verify that all environment variables are correctly set
3. Ensure your code works locally with `npm run build && npm run start`
4. Check that your Supabase connection is working properly
5. For domain issues, verify DNS configuration and check Vercel's domain settings

## Rollbacks

If you need to roll back to a previous version:

1. Go to your project in the Vercel dashboard
2. Click on "Deployments"
3. Find the deployment you want to roll back to
4. Click the three dots (⋮) and select "Promote to Production"

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/solutions/nextjs)
- [Environment Variables on Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains on Vercel](https://vercel.com/docs/concepts/projects/domains) 