import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/api/wallet(.*)",
  "/api/profile(.*)",
  "/api/simulators(.*)"
]);

const isSimulatorIngestRoute = createRouteMatcher(["/api/simulators/stocks/ingest(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isSimulatorIngestRoute(req)) {
    return NextResponse.next();
  }
  if (isProtectedRoute(req)) {
    const session = await auth();
    console.log("Middleware Auth Debug:", {
      userId: session.userId,
      isLoaded: session.isLoaded,
      url: req.url,
      cookies: req.headers.get("cookie"),
      secretKeyLength: process.env.CLERK_SECRET_KEY?.length,
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    });
    
    if (!session.userId) {
      console.log("User not authenticated, protecting route...");
    }
    
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
