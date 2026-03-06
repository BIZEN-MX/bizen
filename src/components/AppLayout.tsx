"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UnauthScreen } from "@/components/UnauthScreen";

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

function isPublicPath(pathname: string) {
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
  // This prevents individual pages from firing router.push('/login') before we know the user.
  if (isProtected && loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF5" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(15,98,254,0.15)", borderTopColor: "#0F62FE", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
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

