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
  async headers() {
    return [
      {
        source: '/dashboard',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), xr-spatial-tracking=(self "https://challenges.cloudflare.com"), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.bizen.mx https://*.bizen.mx https://*.clerk.com https://clerk.com https://*.clerk.mx https://*.clerk.accounts.dev https://*.stripe.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://challenges.cloudflare.com https://*.cloudflare.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev;",
              "img-src 'self' blob: data: https://*.clerk.com https://img.clerk.com https://images.clerk.dev https://clerk.bizen.mx https://*.bizen.mx https://*.supabase.co https://*.stripe.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.resend.com https://*.googleusercontent.com https://*.dicebear.com https://api.dicebear.com https://images.unsplash.com https://logo.clearbit.com https://cdn.pixabay.com https://www.gravatar.com https://upload.wikimedia.org;",
              "media-src 'self' data:;",
              "font-src 'self' data: https://fonts.gstatic.com https://*.clerk.accounts.dev;",
              "connect-src 'self' https://clerk.bizen.mx https://*.bizen.mx https://clerk-telemetry.com https://*.clerk.com https://*.clerk.mx https://*.clerk.accounts.dev https://*.supabase.co https://*.stripe.com https://*.googleapis.com https://*.google-analytics.com https://*.generativelanguage.googleapis.com https://challenges.cloudflare.com https://*.cloudflare.com;",
              "frame-src 'self' https://clerk.bizen.mx https://*.bizen.mx https://*.clerk.com https://*.clerk.mx https://*.stripe.com https://*.google.com https://challenges.cloudflare.com https://*.cloudflare.com;",
              "worker-src 'self' blob:;",
              "upgrade-insecure-requests;"
            ].join(' ')
          },
        ],
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
