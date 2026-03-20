"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UnauthScreen } from "@/components/UnauthScreen";
import PageLoader from "@/components/PageLoader";

// Pages that are publicly accessible (no auth required)
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/bizen/",
  "/payment",
  "/auth/",
  "/impacto-social", // has its own unauthenticated landing
]

function isPublicPath(pathname: string | null) {
  if (!pathname) return false;
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p))
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isLanding = pathname === "/";
  const isProtected = !isPublicPath(pathname) && !isLanding;

  if (isLanding) {
    return <>{children}</>;
  }

  // On protected routes, don't render children while auth is loading.
  if (isProtected && loading) {
    return <PageLoader />;
  }

  // Show unauthenticated screen on any protected page if user is not logged in
  if (isProtected && !loading && !user) {
    return <UnauthScreen />;
  }

  return (
    <div className="app-shell">
      <div className="app-scroll">
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
