// Build Trigger - Wed Feb 18 14:40:00 CST 2026
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["src/apps"],
  eslint: {
    // TODO: After fixing all ESLint errors, set to false
    // This allows production builds to complete even if there are ESLint errors
    // Current status: Many console.log statements and other issues need fixing
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TODO: After fixing all TypeScript errors (especially 'any' types), set to false
    // This allows production builds to complete even if there are type errors
    // Current status: 294+ uses of 'any' type need to be replaced
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
