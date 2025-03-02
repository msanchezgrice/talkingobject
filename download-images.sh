#!/bin/bash

# Create the directory if it doesn't exist
mkdir -p public/images/austin

# Download images for each landmark
curl -o public/images/austin/i-love-you-so-much.jpg "https://placehold.co/400x400/444/fff?text=I+Love+You+So+Much"
curl -o public/images/austin/treaty-oak.jpg "https://placehold.co/400x400/444/fff?text=Treaty+Oak"
curl -o public/images/austin/pfluger-bridge.jpg "https://placehold.co/400x400/444/fff?text=Pfluger+Bridge"
curl -o public/images/austin/greetings-from-austin.jpg "https://placehold.co/400x400/444/fff?text=Greetings+from+Austin"
curl -o public/images/austin/congress-bats.jpg "https://placehold.co/400x400/444/fff?text=Congress+Bats"
curl -o public/images/austin/texas-capitol.jpg "https://placehold.co/400x400/444/fff?text=Texas+Capitol"
curl -o public/images/austin/barton-springs.jpg "https://placehold.co/400x400/444/fff?text=Barton+Springs"
curl -o public/images/austin/mount-bonnell.jpg "https://placehold.co/400x400/444/fff?text=Mount+Bonnell"

echo "All images downloaded successfully!" 