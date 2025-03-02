/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  reactStrictMode: false,
  // Image domains configuration
  images: {
    domains: [
      'via.placeholder.com',
      'localhost',
      'placehold.co',
      'placekitten.com',
      'picsum.photos',
      'api.qrserver.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable type checking in build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint in build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Override page extensions to search for .jsx first
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  // Fix fetch event listeners for Vercel
  experimental: {
    runtime: 'edge',
    appDocumentPreloading: false
  }
};

module.exports = nextConfig; 