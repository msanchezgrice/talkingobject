#!/bin/bash

# Create directories if they don't exist
mkdir -p public/images

# Download Leaflet marker images
echo "Downloading Leaflet marker assets..."

# Marker icon
curl -o public/images/marker-icon.png "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
curl -o public/images/marker-icon-2x.png "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"

# Shadow
curl -o public/images/marker-shadow.png "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

echo "All map assets downloaded successfully!" 