"use client"

import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"

export default function GlobalLogo() {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show on auth pages and landing
  const isAuthPage = pathname === '/login' || 
                     pathname === '/signup' || 
                     pathname === '/reset-password' ||
                     pathname === '/forgot-password' ||
                     pathname === '/bizen/signup' ||
                     pathname === '/'

  if (isAuthPage) return null

  // Only show on courses page
  const isCoursesPage = pathname === '/courses'
  if (!isCoursesPage) return null

  const handleClick = () => {
    router.push("/courses")
  }

  // On courses page: position at very top-left corner
  // Progress card starts at 32px (panel top padding)
  // Logo height: ~36px (image size)
  // Position at top: 8px to be clearly above progress section (which starts at 80px now)
  // On other pages: standard 16px from top
  const topPosition = isCoursesPage ? 8 : 16
  const leftPosition = 16 // Always at left edge  
  const zIndexValue = 1001

  return (
    <div 
      className="global-logo-container"
      style={{
        position: "fixed",
        top: topPosition,
        left: leftPosition,
        zIndex: zIndexValue,
        display: "inline-flex", // Changed from flex to inline-flex to prevent full width
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        padding: 0,
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderRadius: 0,
        boxShadow: "none",
        border: "none",
        transition: "opacity 0.2s ease",
        width: "auto", // Explicitly set to auto to prevent full width
        maxWidth: "none", // Ensure no max-width constraints
        minWidth: "auto", // Ensure no min-width constraints
        right: "auto", // Ensure right is auto
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.8"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1"
      }}
    >
      <Image 
        src="/bizen-logo.png" 
        alt="BIZEN Logo" 
        width={36} 
        height={36}
        priority
        style={{
          objectFit: "contain"
        }}
      />
      
      {/* Ensure logo doesn't expand to full width */}
      <style>{`
        /* Prevent GlobalLogo from expanding to full width */
        .global-logo-container {
          width: auto !important;
          max-width: none !important;
          min-width: auto !important;
          right: auto !important;
          left: 16px !important;
          display: inline-flex !important;
        }
        
        @media (max-width: 767px) {
          /* On mobile, ensure logo stays in top-left corner */
          .global-logo-container {
            width: auto !important;
            max-width: calc(100vw - 80px) !important; /* Leave space for hamburger menu */
            min-width: auto !important;
            left: 16px !important;
            right: auto !important;
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  )
}

