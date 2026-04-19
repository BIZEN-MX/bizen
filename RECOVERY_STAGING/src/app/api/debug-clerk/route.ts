import { NextResponse } from 'next/server'

export async function GET() {
  const sk = process.env.CLERK_SECRET_KEY || "";
  
  return NextResponse.json({
    secret_prefix: sk.substring(0, 8),
    secret_suffix: sk.substring(sk.length - 5),
    NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN || "NOT_SET",
    NEXT_PUBLIC_CLERK_PROXY_URL: process.env.NEXT_PUBLIC_CLERK_PROXY_URL || "NOT_SET",
    CLERK_FRONTEND_API: process.env.CLERK_FRONTEND_API || "NOT_SET",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 15) + "...",
    SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "NOT_SET",
    SIGN_IN_FALLBACK: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL || "NOT_SET",
    NODE_ENV: process.env.NODE_ENV
  })
}
