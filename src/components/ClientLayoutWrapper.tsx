"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NavigationLoading from './NavigationLoading';
import FixedSidebar from './FixedSidebar';
import MobileBottomNav from './MobileBottomNav';
import MobileFooterNav from './MobileFooterNav';
import GlobalLogo from './GlobalLogo';
import { useKeyboardHandler } from '@/hooks/useKeyboardHandler';
import { useViewportHeight } from '@/hooks/useViewportHeight';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [isMobile, setIsMobile] = useState(false)

  // Fix iOS Safari viewport height
  useViewportHeight();

  // Handle keyboard appearance on mobile
  const { isKeyboardVisible } = useKeyboardHandler({
    scrollToInput: true,
    offset: 100
  });

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

  // Detect clicks on links to start loading immediately (before pathname changes)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked element is a link
      const link = target.closest('a[href]');
      
      if (link) {
        const href = link.getAttribute('href');
        
        // Only trigger for internal links that will actually navigate
        if (href && 
            href.startsWith('/') && 
            !href.startsWith('//') && 
            !href.startsWith('#') && 
            href !== pathname &&
            !link.hasAttribute('target') && // Not opening in new tab
            !link.hasAttribute('download')) { // Not downloading
          setIsNavigating(true);
        }
      }
    };

    // Listen for clicks on the document with capture phase for early detection
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname]);

  // Handle pathname changes (when navigation actually completes)
  useEffect(() => {
    // Only show loading if pathname actually changed
    if (pathname !== previousPathname.current) {
      setIsNavigating(true);
      previousPathname.current = pathname;
      
      // Timeout to allow smooth progress bar animation
      const timer = setTimeout(() => setIsNavigating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

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

  // Hide app footer on interactive lesson page (lesson has its own Salir/Continuar bar)
  const isLessonInteractivePage = pathname?.includes('/learn/') && pathname?.includes('/interactive')

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

    if (!isAuthPage && isMobile && !isLessonInteractivePage) {
      document.body.setAttribute("data-mobile-footer", "true")
    } else {
      document.body.removeAttribute("data-mobile-footer")
    }

    return () => {
      document.body.removeAttribute("data-mobile-footer")
    }
  }, [isAuthPage, isMobile, isLessonInteractivePage])

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

  // Flag body on lesson interactive page so CSS can hide app footer (backup)
  useEffect(() => {
    if (typeof document === "undefined") return
    if (isLessonInteractivePage) {
      document.body.setAttribute("data-lesson-interactive", "true")
    } else {
      document.body.removeAttribute("data-lesson-interactive")
    }
    return () => document.body.removeAttribute("data-lesson-interactive")
  }, [isLessonInteractivePage])

  return (
    <>
      {/* Show FixedSidebar only on larger screens (>767px) */}
      {!isAuthPage && !isMobile && <FixedSidebar />}
      
      {/* Show MobileFooterNav only on mobile (≤767px), hidden on lesson interactive page */}
      {!isAuthPage && isMobile && !isLessonInteractivePage && <MobileFooterNav />}
      
      {/* Only show MobileBottomNav on desktop/tablet, never on mobile */}
      {!isAuthPage && !isMobile && <MobileBottomNav />}
      
      <GlobalLogo />
      {children}
      <NavigationLoading isLoading={isNavigating} />
    </>
  );
}


