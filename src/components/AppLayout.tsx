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
  "/tools", // financial tools and simulators
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
    return (
      <div className="app-shell">
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div className="hidden md:block w-[280px] flex-shrink-0" />
          <div className="flex-1 relative flex items-center justify-center">
            <PageLoader />
          </div>
        </div>
      </div>
    );
  }


  // Show unauthenticated screen on any protected page if user is not logged in
  if (isProtected && !loading && !user) {
    return <UnauthScreen />;
  }

  const hasSidebar = !isLanding && !isPublicPath(pathname) && !pathname.startsWith("/diagnostic") && !pathname.startsWith("/learn");
  // We include tools in pages that should have a sidebar-like layout or at least the gutter
  const showGutter = hasSidebar || pathname.startsWith("/tools");

  return (
    <div className="app-shell">
      <div className="app-scroll">
        <div style={{ display: "flex", width: "100%", minHeight: "100%" }}>
          {/* Desktop Sidebar Gutter (invisible spacer) */}
          {showGutter && (
            <div className="hidden md:block w-[280px] flex-shrink-0" aria-hidden="true" />
          )}
          
          <main className="app-main flex-1 flex flex-col items-center">
            {/* Inner wrapper to ensure content is centered in the usable space */}
            <div className="w-full flex-1 flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

