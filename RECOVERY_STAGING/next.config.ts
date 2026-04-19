import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://clerk.bizen.mx https://*.clerk.accounts.dev https://challenges.cloudflare.com; frame-src 'self' https://clerk.bizen.mx https://challenges.cloudflare.com https://www.youtube.com https://*.youtube.com; connect-src 'self' https://clerk.bizen.mx https://*.clerk.accounts.dev https://challenges.cloudflare.com;"
          },
        ],
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
