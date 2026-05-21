"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UnauthScreen } from "@/components/UnauthScreen";
import PageLoader from "@/components/PageLoader";
import { PageAppearance } from "@/components/PageAppearance";

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
  const isCoursesPage = pathname === "/courses" || pathname?.startsWith("/courses/");
  const isProtected = (!isPublicPath(pathname) && !isLanding) || isCoursesPage;

  // Render raw without frame only for Landing page
  if (isLanding) {
    return (
      <PageAppearance>
        {children}
      </PageAppearance>
    );
  }

  // On protected routes, don't render children while auth is loading.
  if (isProtected && loading) {
    return (
      <div className="app-shell">
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
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
  const isTopNavActive = !isLanding && 
    !pathname?.startsWith('/learn/') && 
    !pathname?.startsWith('/diagnostic') &&
    !pathname?.startsWith('/login') &&
    !pathname?.startsWith('/signup') &&
    !pathname?.startsWith('/onboarding') && 
    !pathname?.startsWith('/live') && 
    !pathname?.startsWith('/investments') &&
    !pathname?.startsWith('/transfer') &&
    !pathname?.startsWith('/history') &&
    !pathname?.includes('/auth/') && 
    !pathname?.startsWith('/impacto-social') && 
    pathname !== '/payment';

  return (
    <div className="app-shell" data-topnav-active={isTopNavActive} data-is-live={pathname?.startsWith('/live')}>
      {(pathname?.startsWith('/live') || pathname?.startsWith('/investments')) && (
        <style>{`
          body { background: #060c1d !important; }
          .app-shell { background: #060c1d !important; }
        `}</style>
      )}
      <div className="app-scroll">
        <div style={{ display: "flex", width: "100%", minHeight: "100%" }}>
          
          <main 
            className="app-main flex-1 flex flex-col" 
            style={{ 
              maxWidth: "none", 
              boxSizing: "border-box",
              paddingTop: isTopNavActive ? "84px" : "0"
            }}
          >
            {/* Inner wrapper to ensure content is full width in the usable space */}
            <div className="w-full flex-1 flex flex-col" style={{ maxWidth: "none" }}>
              <React.Suspense fallback={<PageLoader />}>
                <PageAppearance>
                  {children}
                </PageAppearance>
              </React.Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

