import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production-optimized config for Vercel deployment */
  reactStrictMode: true,
  swcMinify: true, // Uses SWC minifier instead of Terser for faster builds
  images: {
    domains: [
      'via.placeholder.com', 
      'localhost',
      'placehold.co', // For placeholder images
      'vercel.app', // For Vercel deployment URLs
      'talkingobjects.ai' // Custom domain
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Ensure output is properly optimized
  output: 'standalone',
  // Improve production performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  }
};

export default nextConfig;
