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
                     pathname === '/bizen/login' ||
                     pathname === '/bizen/signup' ||
                     pathname === '/' || 
                     pathname === '/landing'

  if (isAuthPage) return null

  const isCoursesPage = pathname === '/courses'

  const handleClick = () => {
    router.push("/courses")
  }

  // On courses page: position at very top-left corner
  // Progress card starts at 32px (panel top padding)
  // Logo height: ~32px (20px image + 6px padding top + 6px padding bottom)
  // Position at top: 4px to be clearly above progress section (which starts at 32px)
  // On other pages: standard 16px from top
  const topPosition = isCoursesPage ? 4 : 16
  const leftPosition = 16 // Always at left edge  
  const zIndexValue = 1001

  return (
    <div 
      style={{
        position: "fixed",
        top: topPosition,
        left: leftPosition,
        zIndex: zIndexValue,
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        padding: "6px 10px",
        background: "linear-gradient(135deg, rgba(15, 98, 254, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(15, 98, 254, 0.15)",
        border: "1px solid rgba(15, 98, 254, 0.25)",
        transition: "all 0.2s ease"
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "linear-gradient(135deg, rgba(15, 98, 254, 0.25) 0%, rgba(59, 130, 246, 0.2) 100%)"
        e.currentTarget.style.transform = "scale(1.05)"
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 98, 254, 0.3)"
        e.currentTarget.style.borderColor = "rgba(15, 98, 254, 0.4)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "linear-gradient(135deg, rgba(15, 98, 254, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)"
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 98, 254, 0.15)"
        e.currentTarget.style.borderColor = "rgba(15, 98, 254, 0.25)"
      }}
    >
      <Image 
        src="/bizen-logo.png" 
        alt="BIZEN Logo" 
        width={20} 
        height={20}
        priority
        style={{
          objectFit: "contain"
        }}
      />
      <span style={{
        fontSize: 14,
        fontWeight: 700,
        color: "#0F62FE",
        fontFamily: "Montserrat, sans-serif",
        letterSpacing: "0.3px"
      }}>
        BIZEN
      </span>
    </div>
  )
}

