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
  // Handle errors gracefully
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Disable optimizations that might cause errors
  experimental: {
    optimizeCss: false,
  }
};

module.exports = nextConfig; 