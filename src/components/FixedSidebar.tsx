"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import {
  Map as MapIcon,
  Target,
  CircleDollarSign,
  Gamepad2,
  MessageSquare,
  MoreHorizontal,
  BarChart2,
  Trophy,
  User,
  Settings,
  Share2,
  Heart,
  ShoppingBag,
  Star,
  LogIn,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Medal
} from "lucide-react"

import {
  SpainIcon,
  USIcon,
  WarningIcon,
  CheckIcon,
  ShieldIcon
} from "@/components/CustomIcons"

export default function FixedSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, dbProfile, loading, signOut } = useAuth()
  const { settings } = useSettings()
  const t = useTranslation(settings.language)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isCompactSidebar, setIsCompactSidebar] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMasOpen, setIsMasOpen] = useState(false)
  const [masFlyoutPosition, setMasFlyoutPosition] = useState({ top: 0, left: 0 })
  const masCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const masTriggerRef = useRef<HTMLDivElement>(null)

  const showMasPanel = () => {
    if (masCloseTimerRef.current) {
      clearTimeout(masCloseTimerRef.current)
      masCloseTimerRef.current = null
    }
    setIsMasOpen(true)
  }
  const hideMasPanel = () => {
    masCloseTimerRef.current = setTimeout(() => setIsMasOpen(false), 150)
  }

  useEffect(() => {
    if (!isMasOpen || !masTriggerRef.current || typeof document === "undefined") return
    const rect = masTriggerRef.current.getBoundingClientRect()
    setMasFlyoutPosition({ top: rect.top, left: rect.right + 8 })
  }, [isMasOpen])

  // Only render auth-dependent UI after mount to avoid hydration mismatch (server has no session)
  useEffect(() => {
    setMounted(true)
  }, [])

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
        sidebar.style.setProperty('left', '0', 'important')
        sidebar.style.setProperty('right', 'auto', 'important')
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
        sidebar.style.setProperty('background', '#ffffff', 'important')
        sidebar.style.setProperty('padding', '70px 16px 32px 16px', 'important') // Extra padding at top (70px) to avoid hamburger button
        sidebar.style.setProperty('overflow-y', 'auto', 'important')
        sidebar.style.setProperty('overflow-x', 'hidden', 'important')
        sidebar.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.08)', 'important')
        sidebar.style.setProperty('border-right', '1px solid rgba(0, 0, 0, 0.08)', 'important')
        sidebar.style.setProperty('border-left', 'none', 'important')
        sidebar.style.setProperty('box-sizing', 'border-box', 'important')
      } else {
        sidebar.classList.remove('mobile-sidebar-open')
        sidebar.style.setProperty('transform', 'translateX(-100%)', 'important')
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
        sidebarEl.style.setProperty('transform', 'translateX(-100%)', 'important')
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
  const protectedRoutes = ['/forum', '/profile', '/cuenta', '/configuracion', '/puntos', '/tienda', '/impacto-social']

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
    isMobile
      ? {
        justifyContent: "center" as const,
        alignItems: "center" as const,
        flexDirection: "column" as const,
        padding: "12px 0",
        gap: 4,
        width: "100%",
        textAlign: "center" as const,
        background: "transparent",
        color: isActive ? "#0B71FE" : "#4b5563"
      }
      : {}

  const showNavLabels = !isCompactSidebar
  const stackAlignment = isCompactSidebar ? "center" : "stretch"
  const coursesActive = isActivePath("/courses")
  const retoDiarioActive = isActivePath("/reto-diario")
  const businessLabActive = isActivePath("/business-lab")
  const simuladorActive = isActivePath("/simulador")
  const forumActive = isActivePath("/forum")

  const profileActive = isActivePath("/profile")
  const settingsActive = isActivePath("/configuracion")
  const impactoSocialActive = isActivePath("/impacto-social")
  const puntosActive = isActivePath("/puntos")
  const tiendaActive = isActivePath("/tienda")
  const rankingsActive = isActivePath("/rankings")

  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const isStudentOrGuest = !isAdminOrTeacher
  const iconSize = 24

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
      <div
        data-fixed-sidebar
        className={isMobile ? (isSidebarOpen ? "mobile-sidebar-open" : "") : ""}
        style={isMobile ? {
          // Mobile styles - CSS will control visibility and position, but set width here too
          // Width will be overridden by CSS, but this ensures base width is correct
        } : {
          position: "fixed",
          top: 0,
          left: 0,
          width: isCompactSidebar ? "220px" : "280px",
          height: "100vh",
          background: "#FBFAF5",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          zIndex: 1000,
          overflowY: "auto",
          overflowX: "hidden",
          fontFamily: "'Montserrat', sans-serif",
          borderRight: "2px solid #0F62FE",
          boxSizing: "border-box"
        }}>
        <div style={{ padding: "24px 20px 0 20px", overflowX: "hidden", maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: "100%" }} className="sidebar-inner-container">
          {/* Bizen logo and brand name */}
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
              padding: "12px 0",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "center",
              width: "100%"
            }}
            className="sidebar-brand"
          >
            <span style={{
              fontFamily: "'Helvetica', 'Arial', sans-serif",
              fontSize: 30,
              fontWeight: 900,
              color: "#1e293b",
              letterSpacing: "-1px",
              lineHeight: 1,
              display: "flex",
              alignItems: "baseline",
              gap: "2px"
            }}>
              BIZEN
              <span style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#0F62FE",
                display: "inline-block",
                marginBottom: 3
              }} />
            </span>
          </button>

          {/* Create Account Button (only after mount + auth resolved, when user is not authenticated) */}
          {mounted && !loading && !user && (
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={() => window.open("/signup", "_blank")}
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
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(11, 113, 254, 0.6), 0 0 40px rgba(11, 113, 254, 0.5)"
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
                <span style={{ position: "relative", zIndex: 1, textTransform: "uppercase" }}>Crear Cuenta</span>
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
          <div style={{ marginBottom: 24, flex: "1 1 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: stackAlignment }}>
              {isStudentOrGuest && (
                <>
                  <button
                    data-tour-id="/courses"
                    onClick={() => navigateTo("/courses")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      background: isCompactSidebar ? "transparent" : (coursesActive ? "#eff6ff" : "transparent"),
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 14,
                      fontWeight: coursesActive ? 700 : 600,
                      textAlign: "left",
                      color: coursesActive ? "#0B71FE" : "#4b5563",
                      ...compactButtonOverrides(coursesActive)
                    }}
                    onMouseEnter={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = "#f8fafc"
                        e.currentTarget.style.color = "#0B71FE"
                        e.currentTarget.style.transform = "translateX(-4px)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = coursesActive ? "#eff6ff" : "transparent"
                        e.currentTarget.style.color = coursesActive ? "#0B71FE" : "#4b5563"
                        e.currentTarget.style.transform = "translateX(0)"
                      }
                    }}
                  >
                    <MapIcon size={iconSize} strokeWidth={coursesActive ? 2.5 : 2} />
                    <span className="nav-item-label">{t.nav.exploreCourses}</span>
                  </button>

                  <button
                    data-tour-id="/reto-diario"
                    onClick={() => navigateTo("/reto-diario")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      background: isCompactSidebar ? "transparent" : (retoDiarioActive ? "#eff6ff" : "transparent"),
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 14,
                      fontWeight: retoDiarioActive ? 700 : 600,
                      textAlign: "left",
                      color: retoDiarioActive ? "#0B71FE" : "#4b5563",
                      ...compactButtonOverrides(retoDiarioActive)
                    }}
                    onMouseEnter={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = "#f8fafc"
                        e.currentTarget.style.color = "#0B71FE"
                        e.currentTarget.style.transform = "translateX(-4px)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = retoDiarioActive ? "#eff6ff" : "transparent"
                        e.currentTarget.style.color = retoDiarioActive ? "#0B71FE" : "#4b5563"
                        e.currentTarget.style.transform = "translateX(0)"
                      }
                    }}
                  >
                    <Target size={iconSize} strokeWidth={retoDiarioActive ? 2.5 : 2} />
                    <span className="nav-item-label">Reto diario</span>
                  </button>

                  {/* Business Lab hidden for now — remove this block to show again */}
                  {false && (
                    <button
                      onClick={() => navigateTo("/business-lab")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px",
                        background: isCompactSidebar ? "transparent" : (businessLabActive ? "rgba(255,255,255,0.15)" : "transparent"),
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 14,
                        fontWeight: businessLabActive ? 700 : 600,
                        textAlign: "left",
                        color: businessLabActive ? "#93C5FD" : "#fff",
                        ...compactButtonOverrides(businessLabActive)
                      }}
                      onMouseEnter={(e) => {
                        if (!isCompactSidebar) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                          e.currentTarget.style.color = "#93C5FD"
                          e.currentTarget.style.transform = "translateX(-4px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCompactSidebar) {
                          e.currentTarget.style.background = businessLabActive ? "rgba(255,255,255,0.15)" : "transparent"
                          e.currentTarget.style.color = businessLabActive ? "#93C5FD" : "#fff"
                          e.currentTarget.style.transform = "translateX(0)"
                        }
                      }}
                    >
                      <span className="nav-item-label">Business Lab</span>
                    </button>
                  )}

                  <button
                    data-tour-id="/simulador"
                    onClick={() => navigateTo("/cash-flow")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      background: isCompactSidebar ? "transparent" : (simuladorActive ? "#eff6ff" : "transparent"),
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 14,
                      fontWeight: simuladorActive ? 700 : 600,
                      textAlign: "left",
                      color: simuladorActive ? "#0B71FE" : "#4b5563",
                      ...compactButtonOverrides(simuladorActive)
                    }}
                    onMouseEnter={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = "#f8fafc"
                        e.currentTarget.style.color = "#0B71FE"
                        e.currentTarget.style.transform = "translateX(-4px)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = simuladorActive ? "#eff6ff" : "transparent"
                        e.currentTarget.style.color = simuladorActive ? "#0B71FE" : "#4b5563"
                        e.currentTarget.style.transform = "translateX(0)"
                      }
                    }}
                  >
                    <Gamepad2 size={iconSize} strokeWidth={simuladorActive ? 2.5 : 2} />
                    <span className="nav-item-label">Simulador</span>
                  </button>



                  <button
                    data-tour-id="/impacto-social"
                    onClick={() => navigateTo("/impacto-social")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      background: isCompactSidebar ? "transparent" : (impactoSocialActive ? "#eff6ff" : "transparent"),
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 14,
                      fontWeight: impactoSocialActive ? 700 : 600,
                      textAlign: "left",
                      color: impactoSocialActive ? "#0B71FE" : "#4b5563",
                      ...compactButtonOverrides(impactoSocialActive)
                    }}
                    onMouseEnter={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = "#f8fafc"
                        e.currentTarget.style.color = "#0B71FE"
                        e.currentTarget.style.transform = "translateX(-4px)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCompactSidebar) {
                        e.currentTarget.style.background = impactoSocialActive ? "#eff6ff" : "transparent"
                        e.currentTarget.style.color = impactoSocialActive ? "#0B71FE" : "#4b5563"
                        e.currentTarget.style.transform = "translateX(0)"
                      }
                    }}
                  >
                    <Heart size={iconSize} strokeWidth={impactoSocialActive ? 2.5 : 2} />
                    <span className="nav-item-label">{t.nav.impactoSocial}</span>
                  </button>

                  {/* Only show these navigation items when mounted and user is authenticated */}
                </>
              )}
              {mounted && user && (
                <>
                  {isStudentOrGuest && (
                    <button
                      data-tour-id="/forum"
                      onClick={() => navigateTo("/forum")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px",
                        background: isCompactSidebar ? "transparent" : (forumActive ? "#eff6ff" : "transparent"),
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 14,
                        fontWeight: forumActive ? 700 : 600,
                        textAlign: "left",
                        color: forumActive ? "#0B71FE" : "#4b5563",
                        ...compactButtonOverrides(forumActive)
                      }}
                      onMouseEnter={(e) => {
                        if (!isCompactSidebar) {
                          e.currentTarget.style.background = "#f8fafc"
                          e.currentTarget.style.color = "#0B71FE"
                          e.currentTarget.style.transform = "translateX(-4px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCompactSidebar) {
                          e.currentTarget.style.background = forumActive ? "#eff6ff" : "transparent"
                          e.currentTarget.style.color = forumActive ? "#0B71FE" : "#4b5563"
                          e.currentTarget.style.transform = "translateX(0)"
                        }
                      }}
                    >
                      <MessageSquare size={iconSize} strokeWidth={forumActive ? 2.5 : 2} />
                      <span className="nav-item-label">Foro</span>
                    </button>
                  )}


                  {/* Panel Escolar for teachers/admins - TOP LEVEL for visibility */}
                  {isAdminOrTeacher && (
                    <>
                      <button
                        onClick={() => navigateTo("/teacher/dashboard")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px",
                          background: isCompactSidebar ? "transparent" : (pathname === "/teacher/dashboard" ? "#eff6ff" : "transparent"),
                          border: "none",
                          borderRadius: 10,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 14,
                          fontWeight: pathname === "/teacher/dashboard" ? 700 : 600,
                          textAlign: "left",
                          color: pathname === "/teacher/dashboard" ? "#0B71FE" : "#4b5563",
                          ...compactButtonOverrides(pathname === "/teacher/dashboard")
                        }}
                        onMouseEnter={(e) => {
                          if (!isCompactSidebar) {
                            e.currentTarget.style.background = "#f8fafc"
                            e.currentTarget.style.color = "#0B71FE"
                            e.currentTarget.style.transform = "translateX(-4px)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCompactSidebar) {
                            e.currentTarget.style.background = pathname === "/teacher/dashboard" ? "#eff6ff" : "transparent"
                            e.currentTarget.style.color = pathname === "/teacher/dashboard" ? "#0B71FE" : "#4b5563"
                            e.currentTarget.style.transform = "translateX(0)"
                          }
                        }}
                      >
                        <BarChart2 size={iconSize} strokeWidth={pathname === "/teacher/dashboard" ? 2.5 : 2} />
                        <span className="nav-item-label">Panel escolar</span>
                      </button>

                      <button
                        onClick={() => navigateTo("/teacher/courses")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px",
                          background: isCompactSidebar ? "transparent" : (pathname === "/teacher/courses" ? "#eff6ff" : "transparent"),
                          border: "none",
                          borderRadius: 10,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 14,
                          fontWeight: pathname === "/teacher/courses" ? 700 : 600,
                          textAlign: "left",
                          color: pathname === "/teacher/courses" ? "#0B71FE" : "#4b5563",
                          ...compactButtonOverrides(pathname === "/teacher/courses")
                        }}
                        onMouseEnter={(e) => {
                          if (!isCompactSidebar) {
                            e.currentTarget.style.background = "#f8fafc"
                            e.currentTarget.style.color = "#0B71FE"
                            e.currentTarget.style.transform = "translateX(-4px)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCompactSidebar) {
                            e.currentTarget.style.background = pathname === "/teacher/courses" ? "#eff6ff" : "transparent"
                            e.currentTarget.style.color = pathname === "/teacher/courses" ? "#0B71FE" : "#4b5563"
                            e.currentTarget.style.transform = "translateX(0)"
                          }
                        }}
                      >
                        <MapIcon size={iconSize} strokeWidth={pathname === "/teacher/courses" ? 2.5 : 2} />
                        <span className="nav-item-label">Cursos de la escuela</span>
                      </button>
                    </>
                  )}

                  {/* Más: below Foro; flyout to the right; desktop = hover, mobile/compact = click */}
                  {mounted && user && (
                    <div
                      ref={masTriggerRef}
                      style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", gap: 6, alignItems: stackAlignment }}
                      onMouseEnter={!isCompactSidebar ? showMasPanel : undefined}
                      onMouseLeave={!isCompactSidebar ? hideMasPanel : undefined}
                    >
                      <button
                        type="button"
                        onClick={() => isCompactSidebar && setIsMasOpen((o) => !o)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px",
                          background: isCompactSidebar ? "transparent" : (isMasOpen ? "#eff6ff" : "transparent"),
                          border: "none",
                          borderRadius: 10,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          textAlign: "left",
                          color: isMasOpen ? "#0B71FE" : "#4b5563",
                          width: "100%",
                          minHeight: 0,
                          justifyContent: "flex-start",
                          ...compactButtonOverrides(isMasOpen)
                        }}
                        onMouseEnter={(e) => {
                          if (!isCompactSidebar) {
                            e.currentTarget.style.background = "#f8fafc"
                            e.currentTarget.style.color = "#0B71FE"
                            e.currentTarget.style.transform = "translateX(-4px)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCompactSidebar) {
                            e.currentTarget.style.background = isMasOpen ? "#eff6ff" : "transparent"
                            e.currentTarget.style.color = isMasOpen ? "#0B71FE" : "#4b5563"
                            e.currentTarget.style.transform = "translateX(0)"
                          }
                        }}
                      >
                        <MoreHorizontal size={iconSize} />
                        <span className="nav-item-label">Más</span>
                        {isCompactSidebar && <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", opacity: 0.9 }}>
                          {isMasOpen ? <ChevronDown size={14} /> : <ChevronRightIcon size={14} />}
                        </span>}
                      </button>

                      {isMasOpen && typeof document !== "undefined" && createPortal(
                        <div
                          className="mas-flyout-panel"
                          style={{
                            position: "fixed",
                            top: masFlyoutPosition.top,
                            left: masFlyoutPosition.left,
                            minWidth: 200,
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            padding: "12px",
                            background: "#FBFAF5",
                            border: "2px solid #0F62FE",
                            borderRadius: 12,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                            zIndex: 10002,
                          }}
                          onMouseEnter={!isCompactSidebar ? showMasPanel : undefined}
                          onMouseLeave={!isCompactSidebar ? hideMasPanel : undefined}
                        >

                          {isStudentOrGuest && (
                            <>
                              <button
                                onClick={() => { hideMasPanel(); navigateTo("/rankings") }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                  padding: "10px 12px",
                                  background: rankingsActive ? "#eff6ff" : "transparent",
                                  border: "none",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  fontFamily: "'Montserrat', sans-serif",
                                  fontSize: 13,
                                  fontWeight: rankingsActive ? 700 : 600,
                                  textAlign: "left",
                                  color: rankingsActive ? "#0B71FE" : "#4b5563",
                                  width: "100%",
                                  boxSizing: "border-box"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#f8fafc"
                                  e.currentTarget.style.color = "#0B71FE"
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = rankingsActive ? "#eff6ff" : "transparent"
                                  e.currentTarget.style.color = rankingsActive ? "#0B71FE" : "#4b5563"
                                }}
                              >
                                <Medal size={20} strokeWidth={rankingsActive ? 2.5 : 2} />
                                <span className="nav-item-label">Rankings</span>
                              </button>

                              <button
                                data-tour-id="/puntos"
                                onClick={() => navigateTo("/puntos")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                  padding: "10px 12px",
                                  background: isCompactSidebar ? "transparent" : (puntosActive ? "#eff6ff" : "transparent"),
                                  border: "none",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  fontFamily: "'Montserrat', sans-serif",
                                  fontSize: 13,
                                  fontWeight: puntosActive ? 700 : 600,
                                  textAlign: "left",
                                  color: puntosActive ? "#0B71FE" : "#4b5563",
                                  ...compactButtonOverrides(puntosActive)
                                }}
                                onMouseEnter={(e) => {
                                  if (!isCompactSidebar) {
                                    e.currentTarget.style.background = "#f8fafc"
                                    e.currentTarget.style.color = "#0B71FE"
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isCompactSidebar) {
                                    e.currentTarget.style.background = puntosActive ? "#eff6ff" : "transparent"
                                    e.currentTarget.style.color = puntosActive ? "#0B71FE" : "#4b5563"
                                  }
                                }}
                              >
                                <Star size={20} strokeWidth={puntosActive ? 2.5 : 2} />
                                <span className="nav-item-label">Mis BIZCOINS</span>
                              </button>



                              <button
                                data-tour-id="/tienda"
                                onClick={() => navigateTo("/tienda")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                  padding: "10px 12px",
                                  background: isCompactSidebar ? "transparent" : (tiendaActive ? "#eff6ff" : "transparent"),
                                  border: "none",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  fontFamily: "'Montserrat', sans-serif",
                                  fontSize: 13,
                                  fontWeight: tiendaActive ? 700 : 600,
                                  textAlign: "left",
                                  color: tiendaActive ? "#0B71FE" : "#4b5563",
                                  ...compactButtonOverrides(tiendaActive)
                                }}
                                onMouseEnter={(e) => {
                                  if (!isCompactSidebar) {
                                    e.currentTarget.style.background = "#f8fafc"
                                    e.currentTarget.style.color = "#0B71FE"
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isCompactSidebar) {
                                    e.currentTarget.style.background = tiendaActive ? "#eff6ff" : "transparent"
                                    e.currentTarget.style.color = tiendaActive ? "#0B71FE" : "#4b5563"
                                  }
                                }}
                              >
                                <ShoppingBag size={20} strokeWidth={tiendaActive ? 2.5 : 2} />
                                <span className="nav-item-label">Tienda</span>
                              </button>
                            </>
                          )}


                          <button
                            onClick={() => navigateTo("/configuracion")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 12px",
                              background: isCompactSidebar ? "transparent" : (settingsActive ? "#eff6ff" : "transparent"),
                              border: "none",
                              borderRadius: 8,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: 13,
                              fontWeight: settingsActive ? 700 : 600,
                              textAlign: "left",
                              color: settingsActive ? "#0B71FE" : "#4b5563",
                              width: "100%",
                              boxSizing: "border-box",
                              ...compactButtonOverrides(settingsActive)
                            }}
                            onMouseEnter={(e) => {
                              if (!isCompactSidebar) {
                                e.currentTarget.style.background = "#f8fafc"
                                e.currentTarget.style.color = "#0B71FE"
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isCompactSidebar) {
                                e.currentTarget.style.background = settingsActive ? "#eff6ff" : "transparent"
                                e.currentTarget.style.color = settingsActive ? "#0B71FE" : "#4b5563"
                              }
                            }}
                          >
                            <Settings size={20} strokeWidth={settingsActive ? 2.5 : 2} />
                            <span className="nav-item-label">Configuración</span>
                          </button>
                          <a
                            href="https://www.instagram.com/bizen.mx?igsh=ZmJmYmdxZHg1Z2E3"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 12px",
                              background: "transparent",
                              border: "none",
                              borderRadius: 8,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: 13,
                              fontWeight: 600,
                              textAlign: "left",
                              color: "#4b5563",
                              textDecoration: "none",
                              width: "100%",
                              boxSizing: "border-box"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#f8fafc"
                              e.currentTarget.style.color = "#0B71FE"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent"
                              e.currentTarget.style.color = "#4b5563"
                            }}
                          >
                            <Share2 size={20} strokeWidth={2} />
                            <span className="nav-item-label">Síguenos</span>
                          </a>
                          <button
                            onClick={async () => {
                              try {
                                hideMasPanel();
                                await signOut();
                                router.push("/");
                              } catch (error) {
                                console.error("Error signing out:", error);
                              }
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 12px",
                              background: "transparent",
                              border: "none",
                              borderRadius: 8,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: 13,
                              fontWeight: 600,
                              textAlign: "left",
                              color: "#DC2626",
                              width: "100%",
                              boxSizing: "border-box"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent"
                            }}
                          >
                            <LogIn size={20} color="#DC2626" strokeWidth={2} />
                            <span className="nav-item-label">Cerrar sesión</span>
                          </button>
                        </div>,
                        document.body
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Profile Footer */}
          {mounted && user && (
            <div
              data-tour-id="/profile"
              onClick={() => navigateTo("/profile")}
              style={{
                marginTop: "auto",
                padding: "20px 0",
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "transform 0.2s ease, background 0.2s ease",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.background = "rgba(15, 98, 254, 0.03)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ""
                e.currentTarget.style.background = "transparent"
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0F62FE, #6366f1)",
                padding: 2,
                boxShadow: "0 4px 12px rgba(15, 98, 254, 0.15)",
                flexShrink: 0
              }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "white", overflow: "hidden" }}>
                  <AvatarDisplay avatar={user.user_metadata?.avatar} size={40} />
                </div>
              </div>
              {!isMobile && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#0f172a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#0F62FE",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Mi Perfil
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div >

      {/* Exit Confirmation Dialog */}
      {
        showExitDialog && (
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <WarningIcon size={24} color="#0B71FE" style={{ filter: 'drop-shadow(0 0 8px rgba(11, 113, 254, 0.3))' }} />
                <span>¿Estás seguro?</span>
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
        )
      }

      {/* Authentication Required Dialog */}
      {
        showAuthDialog && (
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
                boxShadow: "0 8px 20px rgba(11, 113, 254, 0.3)"
              }}>
                <ShieldIcon size={40} color="white" />
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
                ¿Necesitas una cuenta? Crea tu cuenta gratis para acceder a esta función y desbloquear todas las herramientas de BIZEN, incluyendo asignaciones, seguimiento de progreso, foro y más.
              </p>

              <div style={{
                display: "flex",
                gap: 12,
                flexDirection: "column"
              }}>
                <button
                  onClick={() => {
                    setShowAuthDialog(false)
                    window.open("/signup", "_blank")
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
                    window.open("/login", "_blank")
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
        )
      }

      {/* Mobile Styles */}
      <style>{`
        /* Softer navy sidebar: white text, uppercase, bold */
        [data-fixed-sidebar] {
          background: #FBFAF5 !important;
        }
        [data-fixed-sidebar] .nav-item-label,
        [data-fixed-sidebar] button span,
        [data-fixed-sidebar] button {
          text-transform: uppercase !important;
          letter-spacing: 0.5px;
          font-weight: 700 !important;
          color: #4b5563 !important;
        }
        
        /* Ensure Lucide SVG icons in nav buttons render correctly (size, no collapse, inherit color) */
        [data-fixed-sidebar] button svg {
          flex-shrink: 0 !important;
          width: 24px !important;
          height: 24px !important;
          min-width: 24px !important;
          min-height: 24px !important;
          display: block !important;
          color: inherit !important;
          stroke: currentColor !important;
        }
        
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
            left: 0 !important;
            right: auto !important;
            width: 104px !important; /* Wide enough for 40px icons with padding */
            min-width: 104px !important;
            max-width: 104px !important; /* FORCE exact width, no responsive scaling */
            box-sizing: border-box !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-right: 2px solid #0F62FE !important;
            border-left: none !important;
            padding: 70px 12px 0 12px !important; /* Horizontal padding for icon spacing */
            z-index: 10000 !important;
            background: #FBFAF5 !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08) !important;
            flex-direction: column !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out !important;
            display: flex !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            box-sizing: border-box !important;
          }
          
          /* Ensure sidebar is hidden when NOT open */
          [data-fixed-sidebar]:not(.mobile-sidebar-open) {
            transform: translateX(-100%) !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            display: flex !important; /* Keep as flex for layout, but hidden */
          }
          
          /* Show sidebar when it has the 'open' class */
          [data-fixed-sidebar].mobile-sidebar-open {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: auto !important;
            width: 104px !important; /* Wide enough for 40px icons with padding */
            min-width: 104px !important;
            max-width: 104px !important; /* FORCE exact width, no responsive scaling */
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-right: 2px solid #0F62FE !important;
            border-left: none !important;
            padding: 70px 12px 0 12px !important; /* Horizontal padding for icon spacing */
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
            background: #FBFAF5 !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08) !important;
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
          
          /* Removed blue emoji filters for mobile */
          
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
            left: 0 !important;
            width: 220px !important; /* Text-only sidebar on tablet */
            min-width: 220px !important;
            max-width: 220px !important;
            height: 100vh !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            background: #FBFAF5 !important;
            border-right: 2px solid #0F62FE !important;
          }
          
          /* Show text labels on iPad - text only, no images */
          [data-fixed-sidebar] .nav-item-label {
            display: inline !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            min-width: 0 !important;
            flex: 1 !important;
            text-align: left !important;
          }
          
          [data-fixed-sidebar] {
            width: 220px !important;
            min-width: 220px !important;
            max-width: 220px !important;
          }
          
          [data-fixed-sidebar] .sidebar-inner-container {
            padding: 24px 16px 0 16px !important;
          }
          
          [data-fixed-sidebar] button {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding: 12px !important;
            text-align: left !important;
            width: 100% !important;
          }
        }
        
        /* Mobile only - Ensure icons are perfectly centered */
        @media (max-width: 767px) {
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
            left: 0 !important;
            width: 280px !important;
            height: 100vh !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            background: #FBFAF5 !important;
            border-right: 2px solid #0F62FE !important;
          }
          
          /* Show text labels on desktop - wrap so full text is visible */
          [data-fixed-sidebar] .nav-item-label {
            display: inline !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            min-width: 0 !important;
            flex: 1 !important;
            text-align: left !important;
          }
          
          /* Restore button backgrounds on desktop */
          [data-fixed-sidebar] button {
            justify-content: flex-start !important;
            padding: 12px !important;
          }
        }
        
        /* Removed blue emoji filters */
        
        /* Emoji filters removed */
        
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
          width: 56px !important;
          min-width: 56px !important;
          height: 56px !important;
          min-height: 56px !important;
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

