/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production',
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Update experimental options to handle the window not defined error
  experimental: {
    // Remove the appDir option as it's unrecognized in Next.js 15.1.4
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