"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import NavigationLoading from './NavigationLoading';
import TopNav from './TopNav';
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
import { useOnboarding } from '@/contexts/OnboardingContext';
import React from 'react';

/**
 * HydrationGuard ensures client-only components that depend on 
 * browser-specific state (like authenticated profile data or viewport width)
 * do not cause hydration mismatches by delaying rendering until mount.
 */
function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <InnerClientWrapper>{children}</InnerClientWrapper>
  );
}

function InnerClientWrapper({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const [isTransfer, setIsTransfer] = useState(false);
  const previousPathname = useRef(pathname);
  const [isMobile, setIsMobile] = useState(false);
  const { user, dbProfile, loading } = useAuth();
  const { isActive: onboardingActive } = useOnboarding();
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

  // The previous Global Fetch Interceptor (Cache Buster) has been removed 
  // Cache control is now handled via server headers in next.config.ts for better stability.

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
  const isAuthPage = pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname === '/reset-password' ||
    pathname === '/forgot-password' ||
    pathname === '/bizen/signup' ||
    pathname?.startsWith('/auth/') || 
    pathname?.startsWith('/bizen/auth/') ||
    pathname === '/' || // Landing page
    pathname === '/payment' ||
    pathname.startsWith('/payment/') || // Payment pages
    pathname === '/bizen/privacidad' || // Privacy page
    pathname === '/bizen/terminos' || // Terms page
    pathname === '/privacidad' ||
    pathname === '/terminos'
  const isDiagnosticPage = pathname?.startsWith('/diagnostic')
  const isLessonInteractivePage = pathname?.startsWith('/learn/')
  const isCourseTopicPage = pathname?.startsWith('/courses/') && pathname !== '/courses'
  const isCourseListPage = pathname === '/courses'
  const isForumPage = pathname?.startsWith('/forum')
  const isTransferPage = pathname === '/transfer' || isTransfer
  const isNewsPage = pathname?.startsWith('/news')
  const isLivePage = pathname?.startsWith('/live')
  const isSimulatorPage = pathname?.startsWith('/simulators') || (pathname?.startsWith('/cash-flow/') && pathname !== '/cash-flow');
  const isBitesPage = pathname?.startsWith('/bites')
  const isHistoryPage = pathname === '/history' || pathname?.startsWith('/history/') || pathname === '/historial' || pathname?.startsWith('/historial/')
  const isInvestmentsPage = pathname === '/investments' || pathname?.startsWith('/investments/')
  const isBudgetTool = pathname?.startsWith('/tools/budget')
  const isVisionTool = pathname?.startsWith('/tools/vision')
  const isToolsPageExclude = isBudgetTool || isVisionTool
  const isMetasPage = pathname === '/metas' || pathname?.startsWith('/metas/')
  const isConfigPage = pathname === '/configuracion'
  const hideAppNavigation = isAuthPage || isNewsPage || isDiagnosticPage || onboardingActive || isLessonInteractivePage || isTransferPage || isHistoryPage || isMetasPage || isInvestmentsPage || isToolsPageExclude || isLivePage || isSimulatorPage || isBitesPage || isConfigPage;

  const hideChat = hideAppNavigation;

  // Detect mobile screen size (≤767px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    const checkTransfer = () => {
      const params = new URLSearchParams(window.location.search)
      setIsTransfer(params.get('action') === 'transfer')
    }
    checkMobile()
    checkTransfer()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [pathname])

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

  // ── NAVIGATION LOADING LOGIC ──
  useEffect(() => {
    if (pathname !== previousPathname.current) {
      setIsNavigating(true);
      
      // Global fix: ensure overflow is reset on each navigation
      if (typeof document !== 'undefined') {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.scrollTo(0, 0);
      }

      const timer = setTimeout(() => {
        setIsNavigating(false);
        previousPathname.current = pathname;
      }, 450); // Premium transition duration
      return () => clearTimeout(timer);
    }
  }, [pathname]);

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
    if (hideAppNavigation || isCourseTopicPage || isCourseListPage || isForumPage) {
      document.body.setAttribute("data-no-sidebar", "true")
      document.body.classList.add("hide-sidebar")
    } else {
      document.body.removeAttribute("data-no-sidebar")
      document.body.classList.remove("hide-sidebar")
    }

    if (isCourseTopicPage || isCourseListPage || isForumPage) {
      document.body.setAttribute("data-topic-page", "true")
      document.body.setAttribute("data-no-padding", "true")
    } else {
      document.body.removeAttribute("data-topic-page")
      document.body.removeAttribute("data-no-padding")
    }

    return () => {
      document.body.removeAttribute("data-no-sidebar")
      document.body.classList.remove("hide-sidebar")
      document.body.removeAttribute("data-topic-page")
      document.body.removeAttribute("data-no-padding")
    }
  }, [hideAppNavigation, isCourseTopicPage, isCourseListPage])

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
  // Auto-trigger has been disabled as per user request to remove 'onboarding cards' from every page.
  /*
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
  */

  // Global event listener for manual tour start
  useEffect(() => {
    const handleStartTour = () => setShowTour(true);
    window.addEventListener('start-bizen-tour', handleStartTour);
    return () => window.removeEventListener('start-bizen-tour', handleStartTour);
  }, []);

  const isTopNavVisible = !hideAppNavigation && !isMobile && !isLessonInteractivePage && !isUnauthProtected;

  // Manage data-topnav-active attribute for CSS spacing
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isTopNavVisible) {
      document.body.setAttribute('data-topnav-active', 'true');
    } else {
      document.body.removeAttribute('data-topnav-active');
    }
  }, [isTopNavVisible]);

  return (
    <>
      <HydrationGuard>
        {/* Show TopNav on desktop (>767px), hidden during interactive lesson, hidden when unauth */}
        {isTopNavVisible && <TopNav />}

        {/* Show MobileFooterNav only on mobile (≤767px), hidden on lesson interactive page, hidden when unauth */}
        {!hideAppNavigation && isMobile && !isLessonInteractivePage && !isUnauthProtected && <MobileFooterNav />}

        {!hideAppNavigation && !isUnauthProtected && <GlobalLogo />}
        
        {isNavigating && <NavigationLoading isLoading={true} />}
        
        {!hideChat && <BillyChatbot />}
        
        {showTour && (
          <AppTourOverlay onEnd={() => setShowTour(false)} />
        )}
      </HydrationGuard>
      
      <main className="app-main">
        {children}
      </main>
    </>
  );
}

