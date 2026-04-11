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
  try {
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") || "";
    
    // 0. Development Bypass
    if (host.includes("localhost") || host.includes("127.0.0.1") || host.includes("3004")) {
      return NextResponse.next();
    }
    
    // 1. Domain Enforcement - Only redirect if we're on the long a.run.app URL
    if (host.includes("a.run.app") && !host.includes("bizen.mx")) {
      console.log(`[Middleware] Redirecting from ${host} to bizen.mx`);
      const targetUrl = new URL(pathname + request.nextUrl.search, "https://bizen.mx");
      return NextResponse.redirect(targetUrl, 301);
    }

    // 2. Skip static/internal paths early
    if (pathname.startsWith('/_next') || pathname.includes('favicon.ico') || pathname.includes('.')) {
      return NextResponse.next();
    }

    // 3. Rate Limiting (Using a lightweight check)
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const now = Date.now();
    const userData = rateLimitStore.get(ip) || { count: 0, lastReset: now };

    if (now - userData.lastReset > 60000) {
      rateLimitStore.set(ip, { count: 1, lastReset: now });
    } else {
      userData.count++;
      rateLimitStore.set(ip, userData);
      if (userData.count > 150) { // Increased limit
        return new NextResponse("Rate limit exceeded", { status: 429 });
      }
    }

    // 4. AUTHENTICATION
    if (!isPublicRoute(request)) {
      try {
        await auth().protect();
        const session = await auth();
        
        // Ban check
        if (session.sessionClaims?.metadata?.isBanned === true && pathname !== "/banned") {
          return NextResponse.redirect(new URL("/banned", request.url));
        }

        // RBAC check
        const role = (session.sessionClaims?.metadata?.role as string) || "student";
        if ((isAdminRoute(request) || isTeacherRoute(request)) && !["admin", "school_admin", "teacher"].includes(role)) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (authError) {
        console.error("[Middleware] Auth protection error:", authError);
        // If auth fails in a non-critical way, redirect to login as fallback
        if (!pathname.startsWith('/login')) {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
    }

    // 5. SECURITY HEADERS
    const response = NextResponse.next();
    const csp = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.clerk.com https://clerk.com https://clerk.bizen.mx https://*.clerk.mx https://*.stripe.com https://*.google.com https://*.googleapis.com https://challenges.cloudflare.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https://*.clerk.com https://img.clerk.com https://clerk.bizen.mx https://*.supabase.co https://*.stripe.com https://*.google.com https://*.googleusercontent.com https://*.dicebear.com https://api.dicebear.com https://*.gravatar.com;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://clerk.bizen.mx https://*.clerk.com https://*.clerk.mx https://*.clerk-telemetry.com https://*.clerk.accounts.dev https://*.supabase.co https://*.stripe.com https://*.googleapis.com https://challenges.cloudflare.com;
      frame-src 'self' https://clerk.bizen.mx https://*.clerk.com https://*.clerk.mx https://*.stripe.com https://*.google.com https://challenges.cloudflare.com;
      worker-src 'self' blob:;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    
    return response;

  } catch (fatalError) {
    console.error("[Middleware] FATAL ERROR:", fatalError);
    // Rescue mission: If everything explodes, let the request through but log it
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
