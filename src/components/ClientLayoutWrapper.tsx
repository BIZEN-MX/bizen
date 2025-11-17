"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NavigationLoading from './NavigationLoading';
import FixedSidebar from './FixedSidebar';
import MobileBottomNav from './MobileBottomNav';
import GlobalLogo from './GlobalLogo';
import { useKeyboardHandler } from '@/hooks/useKeyboardHandler';
import { useViewportHeight } from '@/hooks/useViewportHeight';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

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

  // Don't show sidebar on auth pages and landing
  const isAuthPage = pathname === '/login' || 
                     pathname === '/signup' || 
                     pathname === '/reset-password' ||
                     pathname === '/forgot-password' ||
                     pathname === '/bizen/login' ||
                     pathname === '/bizen/signup' ||
                     pathname === '/' // Landing page

  return (
    <>
      {!isAuthPage && <FixedSidebar />}
      {!isAuthPage && <MobileBottomNav />}
      <GlobalLogo />
      {children}
      <NavigationLoading isLoading={isNavigating} />
    </>
  );
}


