"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavigationLoading from './NavigationLoading';
import AppHeader from './AppHeader';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Don't show header on auth pages and landing
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
      {!isAuthPage && <AppHeader />}
      <div style={{ 
        marginRight: !isAuthPage ? 280 : 0,
        minHeight: "100vh"
      }}>
        {children}
      </div>
      <NavigationLoading isLoading={isNavigating} />
    </>
  );
}


