import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Transpile packages is usually for external libs. 
  // Local project code under /src is handled automatically by Next.js.
  // transpilePackages: ["src/apps"], 

  eslint: {
    // This allows production builds to complete even if there are ESLint errors
    // TODO: Fix lints for better code quality
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows production builds to complete even if there are type errors
    // TODO: Reduce 'any' types and fix type errors
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: '/puntos', destination: '/tienda', permanent: true },
      { source: '/simulador', destination: '/cash-flow', permanent: true },
      { source: '/simuladores', destination: '/cash-flow', permanent: true },
      { source: '/simulators', destination: '/cash-flow', permanent: true },
      { source: '/cashflow', destination: '/cash-flow', permanent: true },
      { source: '/tools', destination: '/cash-flow', permanent: true },
    ]
  },
  // Removed redundant webpack alias. TS Paths in tsconfig.json are handled by Next.js automatically.
};

export default nextConfig;
