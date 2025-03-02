import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'via.placeholder.com',
      'localhost',
      'placehold.co',
      'placekitten.com',
      'picsum.photos',
      'api.qrserver.com'
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configuration to prevent URL-related issues during build
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Use standalone output for better server-side handling
  output: "standalone",
  // Disable prerendering to ensure not-found is generated at runtime
  experimental: {
    disableOptimizedLoading: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

export default nextConfig;
