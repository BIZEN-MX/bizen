import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/courses(.*)",
  "/settings(.*)",
  "/teacher(.*)",
  "/admin(.*)",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const url = new URL(req.url);

  // Allow API routes to handle their own auth to return JSON errors instead of redirects
  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  // FAST REDIRECT: If user is authenticated and hits public auth routes or landing, skip to dashboard
  // This prevents the "flash" of the landing page for 2 seconds.
  if (session.userId && ["/", "/login", "/signup"].includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute(req)) {
    if (!session.userId) {
      console.log("User not authenticated, protecting route...");
      await auth.protect();
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
