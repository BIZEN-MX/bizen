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
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://clerk.bizen.mx https://*.clerk.accounts.dev https://challenges.cloudflare.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' blob: data: https://images.unsplash.com https://*.clerk.com https://*.clerk.accounts.dev https://img.clerk.com https://api.dicebear.com https://storage.googleapis.com https://*.gravatar.com https://*.google.com https://*.gstatic.com https://logo.clearbit.com;",
              "font-src 'self' https://fonts.gstatic.com;",
              "frame-src 'self' https://clerk.bizen.mx https://challenges.cloudflare.com https://www.youtube.com https://*.youtube.com;",
              "connect-src 'self' https://clerk.bizen.mx https://*.clerk.accounts.dev https://challenges.cloudflare.com;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
              "media-src 'self' blob: data: https://storage.googleapis.com https://*.youtube.com https://www.youtube.com;",
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;"
            ].join(' ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ],
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
