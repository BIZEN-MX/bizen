"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NavigationLoading from './NavigationLoading';
import FixedSidebar from './FixedSidebar';
import GlobalLogo from './GlobalLogo';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

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
                     pathname === '/' || // Landing page
                     pathname === '/landing'

  return (
    <>
      {!isAuthPage && <FixedSidebar />}
      <GlobalLogo />
      {children}
      <NavigationLoading isLoading={isNavigating} />
    </>
  );
}


