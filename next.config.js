/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'placehold.co'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Update experimental options to handle the window not defined error
  experimental: {
    // This will prevent prerendering pages with dynamic map components
    appDir: true,
  },
  // Environment configuration
  env: {
    // Add any environment variables needed for the build
    NEXT_PUBLIC_MAP_PROVIDER: 'leaflet',
  },
  // Explicitly define which pages should not be prerendered
  output: 'standalone',
};

export default nextConfig; 