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
  const [isSidebarHidden, setIsSidebarHidden] = React.useState(false);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const checkSidebarStatus = () => {
      setIsSidebarHidden(document.body.classList.contains('hide-sidebar'));
    };

    checkSidebarStatus();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkSidebarStatus();
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

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
          {!isSidebarHidden && <div className="hidden md:block w-[280px] flex-shrink-0" />}
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

  // No sidebar gutter needed — TopNav is at the top, not the left
  const showGutter = false;

  // TopNav is active unless we are on landing or a page that explicitly hides all app navigation
  const isTopNavActive = !isLanding && !pathname?.startsWith('/learn/') && !pathname?.startsWith('/diagnostic');

  return (
    <div className="app-shell" data-topnav-active={isTopNavActive}>
      <div className="app-scroll">
        <div style={{ display: "flex", width: "100%", minHeight: "100%" }}>
          
          <main className="app-main flex-1 flex flex-col">
            {/* Inner wrapper to ensure content is centered in the usable space */}
            <div className="w-full flex-1 flex flex-col">
              <React.Suspense fallback={<PageLoader />}>
                {children}
              </React.Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

