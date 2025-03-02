#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copy the SQL file contents to clipboard
cat "$SCRIPT_DIR/setup-database.sql" | pbcopy

echo "SQL copied to clipboard!"
echo ""
echo "Instructions:"
echo "1. Go to https://wwjzkoledvsgkgvfpfqz.supabase.co"
echo "2. Login with your Supabase credentials"
echo "3. Navigate to SQL Editor"
echo "4. Create a New Query"
echo "5. Paste the SQL (Cmd+V or right-click > Paste)"
echo "6. Run the SQL by clicking the Run button"
echo ""
echo "After running the SQL, restart your Next.js server to see the changes." 