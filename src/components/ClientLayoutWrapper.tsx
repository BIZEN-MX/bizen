"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
// import NavigationLoading from './NavigationLoading';
import FixedSidebar from './FixedSidebar';
import MobileFooterNav from './MobileFooterNav';
import GlobalLogo from './GlobalLogo';
import { useKeyboardHandler } from '@/hooks/useKeyboardHandler';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useAuth } from '@/contexts/AuthContext';

const PUBLIC_PATHS = [
  "/", "/login", "/signup", "/forgot-password", "/reset-password",
  "/bizen/", "/payment", "/auth/", "/impacto-social", "/tools"
]

function isPublicPath(p: string | null) {
  if (!p) return false;
  return PUBLIC_PATHS.some(pub => p === pub || p.startsWith(pub))
}

import BillyChatbot from './BillyChatbot';
import AppTourOverlay from './AppTourOverlay';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  // const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [isMobile, setIsMobile] = useState(false);
  const { user, dbProfile, loading } = useAuth();
  const [showTour, setShowTour] = useState(false);

  // Hide navigation entirely when user is not authenticated on a protected route
  const isUnauthProtected = !loading && !user && !isPublicPath(pathname)

  // Fix iOS Safari viewport height
  useViewportHeight();

  // Handle keyboard appearance on mobile
  const { isKeyboardVisible } = useKeyboardHandler({
    scrollToInput: true,
    offset: 100
  });

  // 🔴 GLOBAL FIX FOR CACHE ISSUES 🔴
  // Next.js and browsers aggressively cache API responses.
  // This intercepts all fetch calls globally to force fresh data without needing to rewrite the entire app to SWR.
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any)._fetchPatched) {
      const originalFetch = window.fetch;
      window.fetch = async function () {
        let [resource, config] = arguments;

        if (typeof resource === 'string' && resource.startsWith('/api/')) {
          config = config || {};
          // Force no-store and cache-busting on all API GET requests
          if (!config.method || config.method.toUpperCase() === 'GET') {
            config.cache = 'no-store';
            const t = Date.now();
            if (resource.includes('?')) {
              if (!resource.includes('_t=')) resource += `&_t=${t}`;
            } else {
              resource += `?_t=${t}`;
            }
            config.headers = {
              ...config.headers,
              'Pragma': 'no-cache',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            };
          }
        }

        return originalFetch.apply(this, [resource, config]);
      };
      (window as any)._fetchPatched = true;
      console.log('✅ Global Fetch interceptor activated (Cache Buster)');
    }
  }, []);

  // Update body attribute when keyboard is visible
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isKeyboardVisible) {
        document.body.setAttribute('data-keyboard-visible', 'true');
      } else {
        document.body.removeAttribute('data-keyboard-visible');
      }
    }
  }, [isKeyboardVisible]);

  // Don't show sidebar on auth pages, landing, payment pages, and legal pages
  const isAuthPage = pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/reset-password' ||
    pathname === '/forgot-password' ||
    pathname === '/bizen/signup' ||
    pathname === '/' || // Landing page
    pathname === '/payment' ||
    pathname.startsWith('/payment/') || // Payment pages
    pathname === '/bizen/privacidad' || // Privacy page
    pathname === '/bizen/terminos' // Terms page
  const isDiagnosticPage = pathname?.startsWith('/diagnostic')
  const isLessonInteractivePage = pathname?.startsWith('/learn/')
  const isCourseTopicPage = pathname?.startsWith('/courses/tema-')
  const hideAppNavigation = isAuthPage || isDiagnosticPage || isLessonInteractivePage;
  const hideChat = isDiagnosticPage || pathname === "/"; // Only hide on diagnostic flow (keeps focus) and landing page

  // Detect mobile screen size (≤767px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Flag body when the fixed mobile footer is visible so pages can add safe padding
  useEffect(() => {
    if (typeof document === "undefined") return

    if (!hideAppNavigation && isMobile && !isLessonInteractivePage) {
      document.body.setAttribute("data-mobile-footer", "true")
    } else {
      document.body.removeAttribute("data-mobile-footer")
    }

    return () => {
      document.body.removeAttribute("data-mobile-footer")
    }
  }, [hideAppNavigation, isMobile, isLessonInteractivePage])

  // Flag body on landing page so CSS can remove sidebar padding (no sidebar = no left gap)
  useEffect(() => {
    if (typeof document === "undefined") return
    if (pathname === "/") {
      document.body.setAttribute("data-landing-page", "true")
    } else {
      document.body.removeAttribute("data-landing-page")
    }
    return () => document.body.removeAttribute("data-landing-page")
  }, [pathname])

  // Pages where nav is hidden run as a standalone flow without sidebar/nav chrome.
  useEffect(() => {
    if (typeof document === "undefined") return
    if (hideAppNavigation) {
      document.body.setAttribute("data-no-sidebar", "true")
    } else {
      document.body.removeAttribute("data-no-sidebar")
    }
    return () => document.body.removeAttribute("data-no-sidebar")
  }, [hideAppNavigation])

  // Flag html on lesson/diagnostic page so CSS can lock scroll and hide app chrome
  useEffect(() => {
    if (typeof document === "undefined") return
    if (isLessonInteractivePage || isDiagnosticPage) {
      document.documentElement.setAttribute("data-lesson-interactive", "true")
    } else {
      document.documentElement.removeAttribute("data-lesson-interactive")
    }
    return () => document.documentElement.removeAttribute("data-lesson-interactive")
  }, [isLessonInteractivePage, isDiagnosticPage])

  // ── APP TOUR LOGIC ──
  useEffect(() => {
    if (loading || !user || !dbProfile) return;
    
    // Auto-trigger for new users
    const hasSeen = dbProfile.settings?.hasSeenTour;
    const isPublic = isPublicPath(pathname);
    const isLanding = pathname === "/";
    
    if (!hasSeen && !isPublic && !isLanding && !hideAppNavigation) {
      // Small delay to ensure page content loads
      const t = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(t);
    }
  }, [loading, user, dbProfile, pathname, hideAppNavigation]);

  // Global event listener for manual tour start
  useEffect(() => {
    const handleStartTour = () => setShowTour(true);
    window.addEventListener('start-bizen-tour', handleStartTour);
    return () => window.removeEventListener('start-bizen-tour', handleStartTour);
  }, []);

  return (
    <>
      {/* Show FixedSidebar only on larger screens (>767px), hidden during interactive lesson, hidden when unauth */}
      {!hideAppNavigation && !isMobile && !isLessonInteractivePage && !isUnauthProtected && <FixedSidebar />}

      {/* Show MobileFooterNav only on mobile (≤767px), hidden on lesson interactive page, hidden when unauth */}
      {!hideAppNavigation && isMobile && !isLessonInteractivePage && !isUnauthProtected && <MobileFooterNav />}

      {!hideAppNavigation && !isUnauthProtected && <GlobalLogo />}
      {children}
      {!hideChat && <BillyChatbot />}
      
      {showTour && (
        <AppTourOverlay onEnd={() => setShowTour(false)} />
      )}
    </>
  );
}

