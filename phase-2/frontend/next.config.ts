import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Generate new build IDs to bypass CDN cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  experimental: {
    // Reduce hydration errors from browser extensions
    optimizePackageImports: ["@radix-ui/react-dialog", "@radix-ui/react-slot"],
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  // Handle browser extension conflicts
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Empty config to silence Turbopack warnings
    // Custom configurations can be added here as needed
  },
};

export default nextConfig;
