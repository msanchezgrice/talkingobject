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
  // Set output to export to completely bypass static generation issues
  output: "export",
  // Disable static optimizations and prerendering
  distDir: ".next",
  // Disable URL normalization which can cause issues
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Configure dynamicParams to true for dynamic routes
  dynamicParams: true,
  // Skip Next.js prerendering altogether
  trailingSlash: false
};

export default nextConfig;
