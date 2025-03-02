#!/bin/bash

# Copy the SQL setup to clipboard
echo "Copying setup-database.sql to clipboard..."

if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  cat ../setup-database.sql | pbcopy
  echo "✅ SQL setup copied to clipboard (macOS)"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux with xclip
  if command -v xclip > /dev/null; then
    cat ../setup-database.sql | xclip -selection clipboard
    echo "✅ SQL setup copied to clipboard (Linux with xclip)"
  # Linux with xsel
  elif command -v xsel > /dev/null; then
    cat ../setup-database.sql | xsel --clipboard
    echo "✅ SQL setup copied to clipboard (Linux with xsel)"
  else
    echo "❌ No clipboard command found. Please install xclip or xsel."
    echo "File path: $(pwd)/../setup-database.sql"
  fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows with clip
  cat ../setup-database.sql | clip
  echo "✅ SQL setup copied to clipboard (Windows)"
else
  echo "❌ Unsupported OS for clipboard operations."
  echo "File path: $(pwd)/../setup-database.sql"
fi

echo ""
echo "Instructions:"
echo "1. Go to your Supabase dashboard: https://app.supabase.com/"
echo "2. Select your project with URL: https://wwjzkoledvsgkgvfpfqz.supabase.co"
echo "3. Navigate to the SQL Editor"
echo "4. Click on 'New Query'"
echo "5. Paste the SQL setup (already in your clipboard)"
echo "6. Click 'Run'"
echo ""
echo "After running the setup, your database tables will be created and you can use the application." 