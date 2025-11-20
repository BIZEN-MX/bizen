"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import Image from "next/image"

export default function FixedSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { settings } = useSettings()
  const t = useTranslation(settings.language)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isCompactSidebar, setIsCompactSidebar] = useState(false)
  
  // Detect mobile screen size (only phones, not tablets)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 767) // Only mobile phones
      setIsCompactSidebar(width <= 1160)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Toggle mobile sidebar
  const toggleSidebar = () => {
    const newState = !isSidebarOpen
    setIsSidebarOpen(newState)
    const sidebar = document.querySelector('[data-fixed-sidebar]') as HTMLElement
    if (sidebar) {
      if (newState) {
        sidebar.classList.add('mobile-sidebar-open')
        sidebar.style.setProperty('display', 'flex', 'important')
        sidebar.style.setProperty('position', 'fixed', 'important')
        sidebar.style.setProperty('top', '0', 'important')
        sidebar.style.setProperty('right', '0', 'important')
        sidebar.style.setProperty('left', 'auto', 'important')
        sidebar.style.setProperty('width', '200px', 'important') // Much narrower sidebar
        sidebar.style.setProperty('min-width', '200px', 'important')
        sidebar.style.setProperty('max-width', '200px', 'important') // Force exact width, no scaling
        sidebar.style.setProperty('height', '100vh', 'important')
        sidebar.style.setProperty('min-height', '100vh', 'important')
        sidebar.style.setProperty('max-height', '100vh', 'important')
        sidebar.style.setProperty('transform', 'translateX(0)', 'important')
        sidebar.style.setProperty('visibility', 'visible', 'important')
        sidebar.style.setProperty('opacity', '1', 'important')
        sidebar.style.setProperty('pointer-events', 'auto', 'important')
        sidebar.style.setProperty('z-index', '10001', 'important') // Lower than hamburger button (10002)
        sidebar.style.setProperty('padding-top', '70px', 'important') // Extra padding to avoid hamburger button
        sidebar.style.setProperty('flex-direction', 'column', 'important')
        sidebar.style.setProperty('background', 'linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)', 'important')
        sidebar.style.setProperty('padding', '70px 16px 32px 16px', 'important') // Extra padding at top (70px) to avoid hamburger button
        sidebar.style.setProperty('overflow-y', 'auto', 'important')
        sidebar.style.setProperty('overflow-x', 'hidden', 'important')
        sidebar.style.setProperty('box-shadow', '-2px 0 20px rgba(0, 0, 0, 0.15)', 'important')
        sidebar.style.setProperty('border-left', '2px solid rgba(147, 197, 253, 0.3)', 'important')
        sidebar.style.setProperty('border-right', 'none', 'important')
        sidebar.style.setProperty('box-sizing', 'border-box', 'important')
      } else {
        sidebar.classList.remove('mobile-sidebar-open')
        sidebar.style.setProperty('transform', 'translateX(100%)', 'important')
        sidebar.style.setProperty('visibility', 'hidden', 'important')
        sidebar.style.setProperty('pointer-events', 'none', 'important')
      }
    }
  }
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('[data-fixed-sidebar]')
      const toggleBtn = document.querySelector('.global-mobile-sidebar-toggle')
      if (isSidebarOpen && sidebar && !sidebar.contains(e.target as Node) && !toggleBtn?.contains(e.target as Node)) {
        setIsSidebarOpen(false)
        sidebar.classList.remove('mobile-sidebar-open')
        const sidebarEl = sidebar as HTMLElement
        sidebarEl.style.setProperty('transform', 'translateX(100%)', 'important')
        sidebarEl.style.setProperty('visibility', 'hidden', 'important')
        sidebarEl.style.setProperty('pointer-events', 'none', 'important')
      }
    }
    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isSidebarOpen])

  // Check if user is on a lesson page
  const isOnLessonPage = pathname?.includes('/learn/')

  // Protected routes that require authentication
  const protectedRoutes = ['/progress', '/forum', '/profile', '/cuenta', '/configuracion']

  const navigateTo = (path: string) => {
    // Check if route requires auth and user is not authenticated
    if (!user && protectedRoutes.some(route => path.startsWith(route))) {
      setShowAuthDialog(true)
      return
    }

    // If on lesson page, show confirmation dialog
    if (isOnLessonPage) {
      setPendingNavigation(path)
      setShowExitDialog(true)
    } else {
      // If not on lesson page, navigate directly
      router.push(path)
    }
  }

  const confirmExit = () => {
    setShowExitDialog(false)
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  const cancelExit = () => {
    setShowExitDialog(false)
    setPendingNavigation(null)
  }

  // Helper function to check if path is active
  const isActivePath = (path: string) => {
    if (path === '/courses') {
      return pathname === path
    }
    // Configuración: active for both /cuenta and /configuracion
    if (path === '/configuracion') {
      return pathname === '/cuenta' || pathname === '/configuracion' || pathname?.startsWith('/cuenta/') || pathname?.startsWith('/configuracion/')
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const compactButtonOverrides = (isActive: boolean) =>
    isCompactSidebar
      ? {
          justifyContent: "center" as const,
          alignItems: "center" as const,
          flexDirection: "column" as const,
          padding: "12px 0",
          gap: 4,
          width: "100%",
          textAlign: "center" as const,
          background: "transparent",
          color: isActive ? "#0F62FE" : "#000"
        }
      : {}

  const showNavLabels = !isCompactSidebar
  const stackAlignment = isCompactSidebar ? "center" : "stretch"
  const coursesActive = isActivePath("/courses")
  const businessLabActive = isActivePath("/business-lab")
  const cashFlowActive = isActivePath("/cash-flow")
  const simulatorsActive = isActivePath("/simuladores")
  const progressActive = isActivePath("/progress")
  const forumActive = isActivePath("/forum")
  const profileActive = isActivePath("/profile")
  const settingsActive = isActivePath("/configuracion")

  return (
    <>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && isMobile && (
        <div
          className="global-mobile-sidebar-backdrop"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9998,
            display: isMobile ? "block" : "none",
          }}
        />
      )}

      {/* Fixed Sidebar Panel */}
      <div data-fixed-sidebar data-bizen-tour="navigation" className={isMobile ? (isSidebarOpen ? "mobile-sidebar-open" : "") : ""} style={isMobile ? {
        // Mobile styles - CSS will control visibility and position, but set width here too
        // Width will be overridden by CSS, but this ensures base width is correct
      } : {
        position: "fixed",
        top: 0,
        right: 0,
        width: "clamp(240px, 25vw, 320px)",
        height: "100vh",
        background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "'Montserrat', sans-serif",
        borderLeft: "2px solid rgba(15, 98, 254, 0.2)",
        boxSizing: "border-box"
      }}>
        <div style={{ padding: "24px 20px", overflowX: "hidden", maxWidth: "100%", boxSizing: "border-box" }} className="sidebar-inner-container">
          {/* Create Account Button (only shown when user is not authenticated) */}
          {!user && (
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={() => router.push("/signup")}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "white",
                  boxShadow: "0 4px 20px rgba(11, 113, 254, 0.5), 0 0 30px rgba(11, 113, 254, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  animation: "pulse-glow 2s ease-in-out infinite"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(11, 113, 254, 0.6), 0 0 40px rgba(11, 113, 254, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(11, 113, 254, 0.5), 0 0 30px rgba(11, 113, 254, 0.3)"
                }}
              >
                {/* Shine effect overlay */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                  animation: "shine 3s ease-in-out infinite"
                }} />
                <span style={{ position: "relative", zIndex: 1 }}>Crear Cuenta</span>
              </button>
              <style>{`
                @keyframes pulse-glow {
                  0%, 100% {
                    box-shadow: 0 4px 20px rgba(11, 113, 254, 0.5), 0 0 30px rgba(11, 113, 254, 0.3);
                  }
                  50% {
                    box-shadow: 0 4px 25px rgba(11, 113, 254, 0.7), 0 0 40px rgba(11, 113, 254, 0.5);
                  }
                }
                @keyframes shine {
                  0% {
                    left: -100%;
                  }
                  20%, 100% {
                    left: 100%;
                  }
                }
              `}</style>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: stackAlignment }}>
              <button
                onClick={() => navigateTo("/courses")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (coursesActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: coursesActive ? 700 : 600,
                  textAlign: "left",
                  color: coursesActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(coursesActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = coursesActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = coursesActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <Image 
                  src="/rightmenucourses.png" 
                  alt="Courses" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    width: 40,
                    height: 40
                  }}
                />
                {showNavLabels && (
                  <span className="nav-item-label">{t.nav.exploreCourses}</span>
                )}
              </button>

              <button
                onClick={() => navigateTo("/business-lab")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (businessLabActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: businessLabActive ? 700 : 600,
                  textAlign: "left",
                  color: businessLabActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(businessLabActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = businessLabActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = businessLabActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <Image 
                  src="/rightmenubusinesslab.png" 
                  alt="Business Lab" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    width: 40,
                    height: 40
                  }}
                />
                {showNavLabels && (
                  <span className="nav-item-label">Business Lab</span>
                )}
              </button>

              <button
                onClick={() => navigateTo("/cash-flow")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (cashFlowActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: cashFlowActive ? 700 : 600,
                  textAlign: "left",
                  color: cashFlowActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(cashFlowActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = cashFlowActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = cashFlowActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <Image 
                  src="/rightmenucashflow.png" 
                  alt="Cash flow" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    width: 40,
                    height: 40
                  }}
                />
                {showNavLabels && (
                  <span className="nav-item-label">Cash flow</span>
                )}
              </button>

              <button
                onClick={() => navigateTo("/simuladores")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (simulatorsActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: simulatorsActive ? 700 : 600,
                  textAlign: "left",
                  color: simulatorsActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(simulatorsActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = simulatorsActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = simulatorsActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <Image 
                  src="/rightmenusimulators.png" 
                  alt="Simuladores" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    width: 40,
                    height: 40
                  }}
                />
                {showNavLabels && (
                  <span className="nav-item-label">Simuladores</span>
                )}
              </button>

              {/* Only show these navigation items when user is authenticated */}
              {user && (
              <>
              <button
                onClick={() => navigateTo("/progress")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (progressActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: progressActive ? 700 : 600,
                  textAlign: "left",
                  color: progressActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(progressActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = progressActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = progressActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <Image 
                  src="/rightmenuprogress.png" 
                  alt="Mi progreso" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    width: 40,
                    height: 40
                  }}
                />
                {showNavLabels && (
                  <span className="nav-item-label">{t.nav.myProgress}</span>
                )}
              </button>

              <button
                onClick={() => navigateTo("/forum")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (forumActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: forumActive ? 700 : 600,
                  textAlign: "left",
                  color: forumActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(forumActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = forumActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = forumActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <Image 
                  src="/rightmenuforo.png" 
                  alt="Foro" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    width: 40,
                    height: 40
                  }}
                />
                {showNavLabels && (
                  <span className="nav-item-label">Foro</span>
                )}
              </button>
              </>
              )}
            </div>
          </div>

          {/* Navigation Links - Only show for authenticated users */}
          {user && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: stackAlignment }}>
              <button
                onClick={() => navigateTo("/profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (profileActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: profileActive ? 700 : 600,
                  textAlign: "left",
                  color: profileActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(profileActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = profileActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = profileActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: user?.user_metadata?.avatar?.gradient || user?.user_metadata?.avatar?.bgColor 
                    ? "transparent" 
                    : "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                  flexShrink: 0,
                  overflow: "hidden",
                  minWidth: 40,
                  minHeight: 40
                }}>
                  <AvatarDisplay 
                    avatar={user?.user_metadata?.avatar || { type: "emoji", value: (user?.user_metadata?.full_name || user?.email || "U")[0].toUpperCase() }} 
                    size={40} 
                  />
                </div>
                {showNavLabels && (
                  <span className="nav-item-label">{t.nav.profile}</span>
                )}
              </button>

              <button
                onClick={() => navigateTo("/configuracion")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isCompactSidebar ? "transparent" : (settingsActive ? "#EFF6FF" : "transparent"),
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  fontWeight: settingsActive ? 700 : 600,
                  textAlign: "left",
                  color: settingsActive ? "#0F62FE" : "#000",
                  ...compactButtonOverrides(settingsActive)
                }}
                onMouseEnter={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = "#EFF6FF"
                    e.currentTarget.style.color = "#0F62FE"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompactSidebar) {
                    e.currentTarget.style.background = settingsActive ? "#EFF6FF" : "transparent"
                    e.currentTarget.style.color = settingsActive ? "#0F62FE" : "#000"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <Image 
                  src="/rightmenusettings.png" 
                  alt="Configuración" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    width: 40,
                    height: 40
                  }}
                />
                {showNavLabels && (
                  <span className="nav-item-label">Configuración</span>
                )}
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: 20,
          fontFamily: "'Montserrat', sans-serif"
        }}>
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "32px",
            maxWidth: 450,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
          }}>
            <div style={{
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 16,
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              ⚠️ ¿Estás seguro?
            </div>
            
            <p style={{
              fontSize: 16,
              color: "#374151",
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              Si sales ahora, se perderá tu progreso de la lección actual. ¿Deseas continuar?
            </p>

            <div style={{
              display: "flex",
              gap: 12,
              flexDirection: "column"
            }}>
              <button
                onClick={cancelExit}
                style={{
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Continuar con la lección
              </button>

              <button
                onClick={confirmExit}
                style={{
                  padding: "14px 24px",
                  background: "white",
                  color: "#DC2626",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FEF2F2"
                  e.currentTarget.style.transform = "scale(1.02)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                Salir de la lección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Required Dialog */}
      {showAuthDialog && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: 20,
            fontFamily: "'Montserrat', sans-serif",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setShowAuthDialog(false)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: 20,
              padding: "40px",
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div style={{
              width: 80,
              height: 80,
              margin: "0 auto 24px",
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              boxShadow: "0 8px 20px rgba(11, 113, 254, 0.3)"
            }}>
              🔒
            </div>

            <div style={{
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 16,
              textAlign: "center",
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              ¡Crea tu cuenta gratis!
            </div>
            
            <p style={{
              fontSize: 16,
              color: "#374151",
              lineHeight: 1.7,
              marginBottom: 28,
              textAlign: "center"
            }}>
              Necesitas una cuenta para acceder a esta función. Crea tu cuenta gratis para desbloquear todas las herramientas de BIZEN, incluyendo asignaciones, seguimiento de progreso, foro y más.
            </p>

            <div style={{
              display: "flex",
              gap: 12,
              flexDirection: "column"
            }}>
              <button
                onClick={() => {
                  setShowAuthDialog(false)
                  router.push("/signup")
                }}
                style={{
                  padding: "16px 24px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 15px rgba(11, 113, 254, 0.4)",
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(11, 113, 254, 0.5)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(11, 113, 254, 0.4)"
                }}
              >
                Crear Cuenta Gratis
              </button>

              <button
                onClick={() => {
                  setShowAuthDialog(false)
                  router.push("/login")
                }}
                style={{
                  padding: "16px 24px",
                  background: "transparent",
                  color: "#0B71FE",
                  border: "2px solid #0B71FE",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Ya tengo cuenta
              </button>

              <button
                onClick={() => setShowAuthDialog(false)}
                style={{
                  padding: "12px",
                  background: "transparent",
                  color: "#6B7280",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#6B7280"}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Styles */}
      <style>{`
        /* CRITICAL: Hide hamburger menu button on ALL devices globally */
        .global-mobile-sidebar-toggle,
        button.global-mobile-sidebar-toggle,
        div > button.global-mobile-sidebar-toggle,
        [class*="global-mobile-sidebar-toggle"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        /* CRITICAL: Override globals.css that hides [data-fixed-sidebar] on mobile */
        @media (max-width: 767px) {
          /* Hide sidebar completely by default on mobile - make it invisible and off-screen */
          div[data-fixed-sidebar] {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            left: auto !important;
            width: 104px !important; /* Wide enough for 40px icons with padding */
            min-width: 104px !important;
            max-width: 104px !important; /* FORCE exact width, no responsive scaling */
            box-sizing: border-box !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-left: 2px solid rgba(147, 197, 253, 0.3) !important;
            border-right: none !important;
            padding: 70px 12px 32px 12px !important; /* Horizontal padding for icon spacing */
            z-index: 10000 !important;
            background: linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%) !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: -2px 0 20px rgba(0, 0, 0, 0.15) !important;
            flex-direction: column !important;
            transform: translateX(100%) !important;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out !important;
            display: flex !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            box-sizing: border-box !important;
          }
          
          /* Ensure sidebar is hidden when NOT open */
          [data-fixed-sidebar]:not(.mobile-sidebar-open) {
            transform: translateX(100%) !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            display: flex !important; /* Keep as flex for layout, but hidden */
          }
          
          /* Show sidebar when it has the 'open' class */
          [data-fixed-sidebar].mobile-sidebar-open {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            left: auto !important;
            width: 104px !important; /* Wide enough for 40px icons with padding */
            min-width: 104px !important;
            max-width: 104px !important; /* FORCE exact width, no responsive scaling */
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-left: 2px solid rgba(147, 197, 253, 0.3) !important;
            border-right: none !important;
            padding: 70px 12px 32px 12px !important; /* Horizontal padding for icon spacing */
            z-index: 10001 !important; /* Lower than hamburger button (10003) - CRITICAL */
          }
          
          /* CRITICAL: Ensure sidebar and all its children stay below hamburger button */
          [data-fixed-sidebar].mobile-sidebar-open,
          [data-fixed-sidebar].mobile-sidebar-open * {
            z-index: inherit !important; /* Inherit from parent sidebar */
            position: relative !important; /* Prevent creating new stacking context */
          }
          
          [data-fixed-sidebar].mobile-sidebar-open {
            z-index: 10001 !important; /* Sidebar itself stays at 10001 */
          }
          
          /* CRITICAL: Hide hamburger button on ALL devices */
          .global-mobile-sidebar-toggle {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Ensure button wrapper is also hidden */
          div > button.global-mobile-sidebar-toggle {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Rest of sidebar open styles */
          [data-fixed-sidebar].mobile-sidebar-open {
            transform: translateX(0) !important;
            transition: transform 0.3s ease-in-out !important;
            display: flex !important;
            flex-direction: column !important;
            background: linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%) !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: -2px 0 20px rgba(0, 0, 0, 0.15) !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            box-sizing: border-box !important;
          }
          
          /* Hide text labels on mobile, show only emojis */
          [data-fixed-sidebar] .nav-item-label {
            display: none !important;
          }
          
          /* Reduce inner container padding on mobile */
          [data-fixed-sidebar] .sidebar-inner-container {
            padding: 24px 12px !important;
          }
          
          /* Ensure images fit properly on mobile */
          [data-fixed-sidebar] img {
            max-width: 40px !important;
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
            flex-shrink: 0 !important;
            display: block !important;
            margin: 0 auto !important;
            align-self: center !important;
          }
          
          /* Center emojis on mobile and remove blue background cards */
          [data-fixed-sidebar] button {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 12px 0 !important;
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            gap: 4px !important;
            width: 100% !important;
            text-align: center !important;
          }
          
          /* Remove hover/active background on mobile */
          [data-fixed-sidebar] button:hover,
          [data-fixed-sidebar] button:active,
          [data-fixed-sidebar] button:focus {
            background: transparent !important;
            background-color: transparent !important;
          }
          
          /* Make emojis blue on mobile - EXACT SAME AS DESKTOP */
          /* Use exact same selectors and values as desktop */
          [data-fixed-sidebar] button span:first-child,
          [data-fixed-sidebar] button > span:first-child,
          [data-fixed-sidebar] button span:first-of-type,
          [data-fixed-sidebar] button span[style*="fontSize: 20"],
          [data-fixed-sidebar] button span[style*="font-size: 20"],
          [data-fixed-sidebar] button span[style*="filter"],
          div[data-fixed-sidebar] button span:first-child,
          div[data-fixed-sidebar] button > span:first-child {
            filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            transform: none !important; /* Prevent any transforms from interfering */
          }
          
          /* Override any inline filter styles on mobile */
          [data-fixed-sidebar] button span[style*="filter"],
          [data-fixed-sidebar] button span[style*="hue-rotate"] {
            filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          }
          
          /* Additional specificity for emoji spans on mobile */
          [data-fixed-sidebar] button > span:first-child[style],
          [data-fixed-sidebar] button span:first-child[style*="display"] {
            filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          }
          
          /* Override any gradient backgrounds on emojis for mobile */
          [data-fixed-sidebar] button span:first-child[style*="WebkitBackgroundClip"] {
            background: none !important;
            WebkitBackgroundClip: unset !important;
            WebkitTextFillColor: unset !important;
            backgroundClip: unset !important;
            filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          }
          
          /* CRITICAL: Hide hamburger toggle button on ALL devices */
          .global-mobile-sidebar-toggle {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Ensure SVG icons are hidden */
          .global-mobile-sidebar-toggle svg {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          
          /* Ensure button is hidden */
          [data-fixed-sidebar].mobile-sidebar-open ~ * .global-mobile-sidebar-toggle,
          .global-mobile-sidebar-toggle {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Ensure wrapper is also hidden */
          div[style*="zIndex: 10003"] {
            display: none !important;
          }
          
          /* Show backdrop on mobile when sidebar is open */
          .global-mobile-sidebar-backdrop {
            display: block !important;
            z-index: 9998 !important;
          }
        }
        
        /* iPad (768px to 1160px) - HIDE HAMBURGER, SHOW STICKY SIDEBAR (EMOJIS ONLY, NARROW) */
        @media (min-width: 768px) and (max-width: 1160px) {
          /* CRITICAL: Hide hamburger button on iPad */
          .global-mobile-sidebar-toggle {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          .global-mobile-sidebar-backdrop {
            display: none !important;
          }
          
          /* CRITICAL: Show sidebar as sticky on iPad - NARROW WIDTH */
          [data-fixed-sidebar] {
            transform: translateX(0) !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            position: fixed !important;
            display: flex !important;
            top: 0 !important;
            right: 0 !important;
            width: 104px !important; /* Wide enough for 40px icons with generous padding */
            min-width: 104px !important;
            max-width: 104px !important;
            height: 100vh !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }
          
          /* Hide text labels on iPad - show only emojis */
          [data-fixed-sidebar] .nav-item-label {
            display: none !important;
          }
          
          /* Reduce inner container padding on iPad */
          [data-fixed-sidebar] .sidebar-inner-container {
            padding: 24px 12px !important;
          }
          
          /* Ensure images fit properly on iPad */
          [data-fixed-sidebar] img {
            max-width: 40px !important;
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
            flex-shrink: 0 !important;
            display: block !important;
            margin: 0 auto !important;
            align-self: center !important;
          }
          
          /* Ensure icons/avatars/emojis are perfectly centered */
          [data-fixed-sidebar] button > img,
          [data-fixed-sidebar] button > div:first-child,
          [data-fixed-sidebar] button > span:first-child {
            margin-left: auto !important;
            margin-right: auto !important;
            text-align: center !important;
          }
          
          /* Center emojis on iPad and remove backgrounds */
          [data-fixed-sidebar] button {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 12px 0 !important;
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            gap: 4px !important;
            width: 100% !important;
            text-align: center !important;
          }
        }
        
        /* All devices - Ensure icons are perfectly centered */
        @media (max-width: 1160px) {
          [data-fixed-sidebar] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          [data-fixed-sidebar] .sidebar-inner-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
          
          [data-fixed-sidebar] .sidebar-inner-container > div {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          [data-fixed-sidebar] button {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          
          [data-fixed-sidebar] button img,
          [data-fixed-sidebar] button > img,
          [data-fixed-sidebar] button Image {
            margin-left: auto !important;
            margin-right: auto !important;
            display: block !important;
          }
        }
        
        /* Desktop (1161px and up) - HIDE HAMBURGER, SHOW STICKY SIDEBAR (FULL WIDTH WITH LABELS) */
        @media (min-width: 1161px) {
          /* CRITICAL: Hide hamburger button on desktop */
          .global-mobile-sidebar-toggle {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          .global-mobile-sidebar-backdrop {
            display: none !important;
          }
          
          /* CRITICAL: Show sidebar as sticky on desktop - FULL WIDTH */
          [data-fixed-sidebar] {
            transform: translateX(0) !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            position: fixed !important;
            display: flex !important;
            top: 0 !important;
            right: 0 !important;
            width: 280px !important;
            height: 100vh !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }
          
          /* Show text labels on desktop */
          [data-fixed-sidebar] .nav-item-label {
            display: inline !important;
          }
          
          /* Restore button backgrounds on desktop */
          [data-fixed-sidebar] button {
            justify-content: flex-start !important;
            padding: 12px !important;
          }
        }
        
        /* Make emojis blue on desktop too - FORCE with multiple selectors */
        [data-fixed-sidebar] button span:first-child,
          [data-fixed-sidebar] button > span:first-child,
          [data-fixed-sidebar] button span:first-of-type {
            filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          }
          
          /* Override any inline filter styles on desktop */
          [data-fixed-sidebar] button span[style*="filter"] {
            filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          }
          
          /* Override any gradient backgrounds on emojis for desktop */
          [data-fixed-sidebar] button span:first-child[style*="WebkitBackgroundClip"] {
            background: none !important;
            WebkitBackgroundClip: unset !important;
            WebkitTextFillColor: unset !important;
            backgroundClip: unset !important;
            filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
            -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          }
        }
        
        /* Global rule: Make ALL emojis blue on ALL devices - HIGHEST PRIORITY */
        /* This applies to ALL screen sizes - mobile, tablet, and desktop */
        /* Use maximum specificity to override any conflicting styles */
        [data-fixed-sidebar] button span:first-child,
        [data-fixed-sidebar] button > span:first-child,
        [data-fixed-sidebar] button span:first-of-type,
        [data-fixed-sidebar] button span[style*="fontSize: 20"],
        [data-fixed-sidebar] button span[style*="font-size: 20"],
        [data-fixed-sidebar] button span[style*="filter"],
        [data-fixed-sidebar] button span[style*="hue-rotate"],
        div[data-fixed-sidebar] button span:first-child,
        div[data-fixed-sidebar] button > span:first-child,
        div[data-fixed-sidebar] button span:first-of-type {
          filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          transform: none !important; /* Prevent any transforms from interfering */
        }
        
        /* Force blue filter on emojis even if they have inline styles */
        /* This ensures the filter is applied regardless of what's in the inline style */
        [data-fixed-sidebar] button span[style*="filter"],
        [data-fixed-sidebar] button span[style*="hue-rotate"],
        [data-fixed-sidebar] button > span[style*="filter"],
        [data-fixed-sidebar] button > span[style*="hue-rotate"] {
          filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
        }
        
        /* Additional specificity for emoji spans - ensure they're always blue */
        /* Target spans with specific inline style attributes */
        [data-fixed-sidebar] button > span:first-child[style],
        [data-fixed-sidebar] button span:first-child[style*="display"],
        [data-fixed-sidebar] button span:first-child[style*="fontSize"],
        [data-fixed-sidebar] button span:first-child[style*="font-size"] {
          filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
        }
        
        /* Override any gradient backgrounds on emojis globally */
        [data-fixed-sidebar] button span:first-child[style*="WebkitBackgroundClip"],
        [data-fixed-sidebar] button span:first-child[style*="backgroundClip"] {
          background: none !important;
          WebkitBackgroundClip: unset !important;
          WebkitTextFillColor: unset !important;
          backgroundClip: unset !important;
          filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
          -webkit-filter: hue-rotate(200deg) saturate(1.8) brightness(0.85) !important;
        }
        
        /* Ensure avatar is next to username on ALL devices */
        .sidebar-user-info {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 12px !important;
          width: 100% !important;
        }
        
        .sidebar-user-info > div:first-child {
          flex-shrink: 0 !important;
          width: 48px !important;
          min-width: 48px !important;
          height: 48px !important;
          min-height: 48px !important;
        }
        
        .sidebar-username {
          display: none !important; /* Hide username on all devices */
        }
        
        /* Hide MobileBottomNav on mobile */
        @media (max-width: 767px) {
          [data-mobile-bottom-nav] {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

