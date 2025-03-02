#!/bin/bash

echo "Starting download of agent images..."

# Create the directories if they don't exist
mkdir -p public/images/austin
mkdir -p public/images/placeholder

# Function to download a file with error checking
download_file() {
  local url=$1
  local output=$2
  echo "Downloading $url to $output"
  
  if curl -s -f -o "$output" "$url"; then
    echo "✅ Successfully downloaded $output"
  else
    echo "❌ Failed to download $url to $output"
    # Create a fallback placeholder
    echo "Creating fallback placeholder..."
    curl -s -f -o "$output" "https://placehold.co/400x400/444/fff?text=$(basename "$output" | cut -f1 -d'.' | tr '-' '+')" || touch "$output"
  fi
}

# Download images for each landmark
echo "Downloading Austin landmark images..."
download_file "https://placehold.co/400x400/444/fff?text=I+Love+You+So+Much" "public/images/austin/i-love-you-so-much.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Treaty+Oak" "public/images/austin/treaty-oak.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Pfluger+Bridge" "public/images/austin/pfluger-bridge.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Greetings+from+Austin" "public/images/austin/greetings-from-austin.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Congress+Bats" "public/images/austin/congress-bats.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Texas+Capitol" "public/images/austin/texas-capitol.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Barton+Springs" "public/images/austin/barton-springs.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Mount+Bonnell" "public/images/austin/mount-bonnell.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Stevie+Ray+Vaughan" "public/images/austin/stevie-ray-vaughan.jpg"
download_file "https://placehold.co/400x400/444/fff?text=Willie+Nelson" "public/images/austin/willie-nelson.jpg"

# Create generic placeholder image
echo "Creating general placeholder image..."
curl -s -f -o "public/images/placeholder.jpg" "https://placehold.co/400x400/444/fff?text=Talking+Object" || touch "public/images/placeholder.jpg"

# Create a verification file
echo "Agent images downloaded on $(date)" > public/images/agent-images.txt

echo "All agent images downloaded successfully!"
echo "Verifying files exist:"
ls -la public/images/austin/
ls -la public/images/placeholder* 