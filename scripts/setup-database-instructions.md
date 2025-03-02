# Database Setup Instructions

To fix the error "relation 'public.agents' does not exist", you need to run the database setup SQL script in your Supabase project. Follow these steps:

## Steps to Set Up the Database Schema

1. Log in to your Supabase dashboard at [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project (project with URL: https://wwjzkoledvsgkgvfpfqz.supabase.co)
3. Navigate to the "SQL Editor" tab in the left sidebar
4. Click on "New Query" to create a new SQL query
5. Copy and paste the entire contents of the `setup-database.sql` file from the root of your project
6. Click "Run" to execute the SQL script

This script will:
- Create the required tables: `profiles`, `agents`, `conversations`, and `messages`
- Set up Row Level Security (RLS) policies for each table
- Create functions and triggers for user management
- Seed initial data including a public profile and sample agents

## Verify the Setup

After running the setup script, you can verify that the database was set up correctly:

1. In the Supabase dashboard, navigate to the "Table Editor" tab
2. You should see the newly created tables: `profiles`, `agents`, `conversations`, and `messages`
3. Check that the `agents` table has some sample data

Alternatively, you can run the following SQL in the SQL Editor to verify:

```sql
SELECT COUNT(*) AS profile_count FROM profiles;
SELECT COUNT(*) AS agent_count FROM agents;
```

## Troubleshooting

If you encounter any issues:

1. Check that you have the correct permissions for your Supabase account
2. Make sure you're using the correct Supabase URL and API key in your project
3. Run the diagnostic script (`scripts/diagnostic-sql.sql`) to check the status of your database tables

Once the database is properly set up, the "Error loading agents: relation 'public.agents' does not exist" should be resolved, and you should be able to see and interact with agents in your application. 