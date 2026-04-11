import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that are publicly accessible
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/about',
  '/contacto',
  '/terminos',
  '/privacidad',
  '/api/webhooks(.*)',
  '/api/public(.*)',
  '/banned'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);
const isTeacherRoute = createRouteMatcher(['/teacher(.*)', '/api/teacher(.*)']);
const isPaidRoute = createRouteMatcher(['/courses(.*)', '/simulators(.*)']);

// Simple rate limit map
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  
  // 0. Force Main Domain (Clerk production keys only work on bizen.mx)
  const host = request.headers.get("host") || "";
  if (host.includes("a.run.app") || host.includes("www.bizen.mx")) {
    const targetUrl = new URL(pathname + request.nextUrl.search, "https://bizen.mx");
    return NextResponse.redirect(targetUrl, 301);
  }

  // 1. Skip paths that should be ignored by Clerk (static files, _next, etc.)
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Basic Rate Limiting check
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = 100; // requests per minute
  const window = 60 * 1000;
  
  const now = Date.now();
  const userData = rateLimitStore.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > window) {
    userData.count = 1;
    userData.lastReset = now;
    rateLimitStore.set(ip, userData);
  } else {
    userData.count++;
    rateLimitStore.set(ip, userData);

    if (userData.count > limit) {
      return new NextResponse("Too Many Requests - BIZEN Protection", { 
        status: 429,
        headers: { "Retry-After": "60" }
      });
    }
  }

  // 2. AUTHENTICATION PROTECTION
  if (!isPublicRoute(request)) {
    await auth().protect();
    
    const session = await auth();

    // 3. BAN SYSTEM
    const isBanned = session.sessionClaims?.metadata?.isBanned === true;
    if (isBanned && pathname !== "/banned") {
      return NextResponse.redirect(new URL("/banned", request.url));
    }

    // 4. ROLE-BASED ACCESS CONTROL (RBAC)
    const role = session.sessionClaims?.metadata?.role || "student";
    
    // Admin & Teacher Protection
    if ((isAdminRoute(request) || isTeacherRoute(request)) && !["admin", "school_admin", "teacher"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 5. SECURITY HEADERS (CSP)
  const response = NextResponse.next();
  
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://clerk.com https://clerk.bizen.mx https://*.bizen.mx https://*.clerk.mx https://*.clerk.accounts.dev https://*.stripe.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://challenges.cloudflare.com https://*.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev;
    img-src 'self' blob: data: https://*.clerk.com https://img.clerk.com https://images.clerk.dev https://clerk.bizen.mx https://*.bizen.mx https://*.supabase.co https://*.stripe.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.resend.com https://*.googleusercontent.com https://*.dicebear.com https://api.dicebear.com https://images.unsplash.com https://logo.clearbit.com https://cdn.pixabay.com https://www.gravatar.com https://upload.wikimedia.org;
    font-src 'self' data: https://fonts.gstatic.com https://*.clerk.accounts.dev;
    connect-src 'self' https://clerk.bizen.mx https://*.bizen.mx https://*.clerk.com https://*.clerk.mx https://*.clerk-telemetry.com https://*.clerk.accounts.dev https://*.supabase.co https://*.stripe.com https://*.googleapis.com https://challenges.cloudflare.com https://*.cloudflare.com;
    frame-src 'self' https://clerk.bizen.mx https://*.bizen.mx https://*.clerk.com https://*.clerk.mx https://*.stripe.com https://*.google.com https://challenges.cloudflare.com https://*.cloudflare.com;
    worker-src 'self' blob:;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
