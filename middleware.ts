import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Simple in-memory rate limit store
const rateLimitStore = new Map<string, { count: number, lastReset: number }>()
const RATE_LIMIT_THRESHOLD = 60 // general APIs
const LOGIN_LIMIT_THRESHOLD = 5 // login protection
const AI_LIMIT_THRESHOLD = 3    // budget protection
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in ms

// Define routes that are publicly accessible
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/auth/callback',
  '/api/webhooks(.*)',
  '/terminos',
  '/privacidad',
  "/api/public(.*)",
  "/api/webhook(.*)",
  "/tienda(.*)",
  "/legal(.*)",
  "/about(.*)",
  "/banned"
]);

// Define routes that require specific roles
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher(.*)"]);
const isPaidRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/learn(.*)",
  "/quiz(.*)",
  "/courses(.*)",
  "/simuladores(.*)",
  "/forum(.*)",
  "/profile(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const now = Date.now();
  const { pathname } = request.nextUrl;

  // 1. RATE LIMITING PROTECTION
  if (pathname.startsWith("/api") || pathname.startsWith("/login")) {
    const isAiRoute = pathname.includes("/ai") || pathname.includes("/chatbot") || pathname.includes("/billy-lab");
    let limit = RATE_LIMIT_THRESHOLD;
    if (pathname.includes("/login")) limit = LOGIN_LIMIT_THRESHOLD;
    if (isAiRoute) limit = AI_LIMIT_THRESHOLD;

    const userData = rateLimitStore.get(ip) || { count: 0, lastReset: now };
    if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
      userData.count = 1;
      userData.lastReset = now;
    } else {
      userData.count++;
    }
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
    const session = await auth();
    
    // Redirect unauthenticated users to login
    if (!session.userId) {
      const from = pathname + request.nextUrl.search;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", from);
      return NextResponse.redirect(loginUrl);
    }

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

    // 5. PAYWALL REDIRECTION (Soft Check)
    if (isPaidRoute(request)) {
      const hasAccess = session.sessionClaims?.metadata?.hasAccess === true || 
                         request.cookies.get("bizen_has_access")?.value === "1";
      
      // If no access and trying to reach premium content
      if (!hasAccess && pathname !== "/tienda" && role === "student") {
        // We let them through but the components will show the Paywall
        // This prevents infinite loops and allows the profile to sync
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
