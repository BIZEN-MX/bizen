"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import {
  BookOpen,
  ChevronRight,
  Wallet,
  Coins,
  PiggyBank,
  Receipt,
  HandCoins,
  CreditCard,
  Landmark,
  TrendingUp,
  Presentation,
  BarChart4,
  Briefcase,
  Brain,
  LineChart,
  AlertTriangle,
  Lightbulb,
  Rocket,
  Search,
  ShieldCheck,
  FileText,
  Calculator,
  RefreshCw,
  BadgeDollarSign,
  Skull,
  Smile,
  Heart,
  ShieldAlert,
  Coffee,
  Target,
  CheckCircle2,
  Clock,
  Zap,
  Layout
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Lesson {
  id: string
  title: string
  unitTitle: string
  order: number
  courseId: string
  [key: string]: unknown
}

interface Course {
  id: string
  title: string
  description: string
  level: string
  order: number
  isLocked: boolean
  isCompleted: boolean
  lessons: Lesson[]
}

// Approximate total lessons across 30 topics (for progress bar cap)
const APPROX_TOTAL_LESSONS = 150

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { completedLessons } = useLessonProgress()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const completedCount = completedLessons.length
  const progressPct = Math.min(100, Math.round((completedCount / APPROX_TOTAL_LESSONS) * 100))

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    }
  }, [loading, user, router])

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (loading) return
    if (!user) return

    const fetchCoursesData = async () => {
      try {
        setLoadingData(true)
        // No legacy courses — only 30 temas principales (topic pages)
        setCourses([])

      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchCoursesData()
  }, [user, loading, router, refreshKey])

  // Refetch when user returns to tab so progress bar reflects latest completions
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && user && !loading) {
        setRefreshKey((k) => k + 1)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [user, loading])

  // Set body and html background for this page
  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body

    htmlEl.style.background = "#ffffff"
    htmlEl.style.backgroundAttachment = "scroll"
    bodyEl.style.background = "#ffffff"
    bodyEl.style.backgroundAttachment = "scroll"

    return () => {
      htmlEl.style.background = ""
      htmlEl.style.backgroundAttachment = ""
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])


  // Show loading or redirect if not authenticated - minimal placeholder in usable content area
  if (loading || loadingData || !user) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Montserrat', sans-serif",
          paddingLeft: 16,
          paddingRight: 16,
          marginLeft: 0,
          boxSizing: "border-box",
        }}
        className="courses-loading-placeholder"
      >
        <style>{`
          @media (min-width: 768px) and (max-width: 1160px) {
            .courses-loading-placeholder { margin-left: 220px; }
          }
          @media (min-width: 1161px) {
            .courses-loading-placeholder { margin-left: 280px; }
          }
        `}</style>
        {/* No spinner - blank or redirect handles it */}
      </div>
    )
  }

  return (
    <div style={{
      position: "relative",
      top: 0,
      left: 0,
      width: "100%",
      maxWidth: "100%",
      flex: 1,
      background: "#ffffff",
      overflow: "visible",
      boxSizing: "border-box",
      paddingBottom: 0,
      marginBottom: 0,
      margin: 0,
      padding: 0
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: "fixed",
        top: "15%",
        right: "8%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed",
        bottom: "15%",
        left: "8%",
        width: "450px",
        height: "450px",
        background: "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed",
        top: "40%",
        left: "50%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(147, 197, 253, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none"
      }} />

      {/* Hide MobileBottomNav on courses page */}
      <style>{`
        @media (max-width: 767px) {
          [data-mobile-bottom-nav] {
            display: none !important;
          }
        }
      `}</style>

      <main
        data-bizen-tour="courses"
        style={{
          flex: 1,
          paddingTop: "clamp(8px, 1.5vw, 16px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
          paddingLeft: "16px",
          paddingRight: "16px",
          fontFamily: "'Montserrat', sans-serif",
          background: "transparent",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginBottom: 0,
          boxSizing: "border-box",
          width: "100%"
        }} className="courses-main-content">
        {/* Same width as course bars (800px) - progress at top, then course list */}
        <div style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          padding: "0",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 0
        }}>
          {/* Progress indicator – lessons completed across all 30 topics */}
          <div
            style={{
              width: "100%",
              marginBottom: "clamp(40px, 6vw, 60px)",
              padding: "clamp(24px, 4vw, 32px)",
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden"
            }}
            aria-label={`Progreso: ${completedCount} lecciones completadas`}
          >
            {/* Background Decoration for Progress Card */}
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)",
              borderRadius: "50%",
              zIndex: 0
            }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 16,
                position: "relative",
                zIndex: 1
              }}
            >
              <div>
                <h2 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 800, color: "#1e3a5f", margin: "0 0 4px" }}>
                  Tu Viaje BIZEN
                </h2>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>
                  {completedCount} de {APPROX_TOTAL_LESSONS} lecciones dominadas
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "clamp(28px, 5vw, 32px)",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {progressPct}%
                </span>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: 12,
                borderRadius: 12,
                background: "#f1f5f9",
                overflow: "hidden",
                position: "relative",
                zIndex: 1
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  borderRadius: 12,
                  background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                  transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)"
                }}
              />
            </div>
          </div>

          {/* Topics Grid */}
          <section
            style={{
              width: "100%",
              marginBottom: "clamp(32px, 6vw, 48px)",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              paddingBottom: 40
            }}
            aria-label="Temas"
            className="topics-grid-responsive"
          >
            {[
              { id: 1, title: "Mi relación con el dinero", icon: Wallet, color: "#3b82f6", lessons: 4 },
              { id: 2, title: "¿Qué es el dinero y por qué existe?", icon: Coins, color: "#2563eb", lessons: 5 },
              { id: 3, title: "¿Cómo entra y sale el dinero de mi vida?", icon: RefreshCw, color: "#1d4ed8", lessons: 6 },
              { id: 4, title: "Presupuesto: tomar control sin ahogarme", icon: Receipt, color: "#1e40af", lessons: 8 },
              { id: 5, title: "Ahorro con propósito", icon: PiggyBank, color: "#6366f1", lessons: 5 },
              { id: 6, title: "¿Deuda: cuándo ayuda y cuándo destruye?", icon: CreditCard, color: "#4f46e5", lessons: 7 },
              { id: 7, title: "Sistema financiero explicado fácil", icon: Landmark, color: "#4338ca", lessons: 6 },
              { id: 8, title: "Impuestos en la vida real", icon: FileText, color: "#3730a3", lessons: 6 },
              { id: 9, title: "Inflación y poder adquisitivo", icon: TrendingUp, color: "#2563eb", lessons: 5 },
              { id: 10, title: "Introducción a la inversión", icon: Presentation, color: "#3b82f6", lessons: 8 },
              { id: 11, title: "Instrumentos de inversión básicos", icon: BarChart4, color: "#60a5fa", lessons: 10 },
              { id: 12, title: "Psicología del inversionista", icon: Brain, color: "#818cf8", lessons: 7 },
              { id: 13, title: "Construcción de patrimonio", icon: ShieldCheck, color: "#10b981", lessons: 9 },
              { id: 14, title: "Errores financieros comunes", icon: AlertTriangle, color: "#f59e0b", lessons: 6 },
              { id: 15, title: "Decisiones financieras conscientes", icon: Lightbulb, color: "#facc15", lessons: 5 },
              { id: 16, title: "Mentalidad emprendedora", icon: Rocket, color: "#ef4444", lessons: 8 },
              { id: 17, title: "Oportunidades de negocio", icon: Search, color: "#3b82f6", lessons: 6 },
              { id: 18, title: "Validar ideas rápido", icon: Zap, color: "#f59e0b", lessons: 7 },
              { id: 19, title: "Modelo de negocio simple", icon: Layout, color: "#6366f1", lessons: 9 },
              { id: 20, title: "Ingresos, costos y utilidad", icon: Calculator, color: "#10b981", lessons: 8 },
              { id: 21, title: "Flujo de efectivo", icon: LineChart, color: "#3b82f6", lessons: 6 },
              { id: 22, title: "Precios y valor", icon: BadgeDollarSign, color: "#2563eb", lessons: 5 },
              { id: 23, title: "Contabilidad básica", icon: BookOpen, color: "#4f46e5", lessons: 7 },
              { id: 24, title: "Errores comunes al emprender", icon: Skull, color: "#475569", lessons: 6 },
              { id: 25, title: "Escalar un negocio", icon: TrendingUp, color: "#10b981", lessons: 8 },
              { id: 26, title: "Dinero y estilo de vida", icon: Smile, color: "#f59e0b", lessons: 5 },
              { id: 27, title: "Dinero y decisiones importantes", icon: Heart, color: "#ef4444", lessons: 6 },
              { id: 28, title: "Dinero en crisis", icon: ShieldAlert, color: "#dc2626", lessons: 7 },
              { id: 29, title: "Estrés y bienestar financiero", icon: Coffee, color: "#8b5cf6", lessons: 5 },
              { id: 30, title: "Mi vida financiera a futuro", icon: Target, color: "#0B71FE", lessons: 10 },
            ].map((topic) => {
              const IconComp = topic.icon || BookOpen
              return (
                <Card
                  key={topic.id}
                  onClick={() => router.push(`/courses/${topic.id}`)}
                  style={{
                    cursor: "pointer",
                    border: "1px solid transparent",
                    borderRadius: "20px",
                    background: "#ffffff",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="course-card-hover"
                >
                  <CardContent style={{ padding: "24px", position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Topic Number Badge */}
                    <div style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#94a3b8",
                      opacity: 0.5
                    }}>
                      #{topic.id.toString().padStart(2, '0')}
                    </div>

                    {/* Icon Header */}
                    <div style={{
                      width: 54,
                      height: 54,
                      borderRadius: "16px",
                      background: `${topic.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      color: topic.color
                    }}>
                      <IconComp size={28} />
                    </div>

                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#1e3a5f",
                      marginBottom: 12,
                      lineHeight: 1.4,
                      flex: 1
                    }}>
                      {topic.title}
                    </h3>

                    {/* Meta Info */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginTop: "auto",
                      paddingTop: 16,
                      borderTop: "1px solid #f1f5f9"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                        <BookOpen size={16} />
                        <span>{topic.lessons} lecciones</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </section>

        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .topics-grid-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .topics-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }

        /* Course title separator - use full usable width */
        div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* On tablet/iPad - account for left sidebar only (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - 220px - 32px) !important;
            max-width: calc(100vw - 220px - 32px) !important;
          }
        }
        
        /* On desktop - account for left sidebar only (280px) */
        @media (min-width: 1161px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - 280px - 48px) !important;
            max-width: calc(100vw - 280px - 48px) !important;
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* Lesson action buttons - hover effect */
        .lesson-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }
        .lesson-btn:active {
          transform: scale(0.98);
        }
        .lesson-btn-start:hover {
          background: #2563EB !important;
        }
        .lesson-btn-signup:hover {
          background: linear-gradient(135deg, #0A5FD4 0%, #3A8EF7 100%) !important;
        }

        .course-card-hover:hover {
          border-color: #3b82f6 !important;
        }

        .course-card-hover:active {
          transform: translateY(-2px) !important;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        
        @keyframes softRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        /* Tablet (768px–1160px): content to the right of left sidebar (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content {
            padding-left: 220px !important;
            padding-right: 16px !important;
            display: flex !important;
            justify-content: center !important;
          }
          .courses-main-content > div {
            max-width: calc(100vw - 220px - 32px) !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
        
        /* Desktop (1161px+): content to the right of left sidebar (280px) */
        @media (min-width: 1161px) {
          .courses-main-content {
            padding-left: 280px !important;
            padding-right: 16px !important;
            display: flex !important;
            justify-content: center !important;
          }
          .courses-main-content > div {
            max-width: calc(100vw - 280px - 48px) !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Ensure app-shell and app-scroll use full width on mobile */
          .app-shell,
          .app-scroll,
          .app-main {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background-color: #ffffff !important;
          }
          
          /* Ensure root container uses full width */
          div[style*="position: relative"][style*="width: 100%"] {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Fix main container for mobile scrolling */
          div[style*="position: relative"][style*="minHeight: 100vh"] {
            position: relative !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: visible !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          /* Adjust main content padding on mobile - no left padding since panel is hidden */
          main[style*="paddingLeft"],
          main[style*="padding-left"],
          .courses-main-content {
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 80px !important; /* Space for hamburger button + course bar */
            padding-bottom: calc(65px + env(safe-area-inset-bottom)) !important; /* Space for mobile footer + safe area */
            background: #ffffff !important;
          }
          
          /* Remove extra margin from last course section on mobile */
          .courses-main-content > div > div:last-child {
            margin-bottom: 0 !important;
          }
          
          /* Ensure body/html keep white background without changing scroll behavior */
          body,
          html {
            background: #ffffff !important;
            overflow-x: clip !important; /* Use clip instead of hidden to allow child overflow */
          }
          
          /* Ensure main container doesn't cause horizontal scroll */
          div[style*="width: 100%"],
          div[style*="width: 100vw"] {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: clip !important; /* Use clip instead of hidden */
            box-sizing: border-box !important;
          }
          
          /* Ensure island path container fits in available space on mobile - centered */
          div[style*="maxWidth: 800px"],
          div[style*="maxWidth: 800"] {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important; /* Allow START label and preview panels to show */
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          /* Container for course/lesson list */
          div[style*="flexDirection: column"][style*="alignItems: center"] {
            overflow: visible !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Ensure main container allows overflow */
          main {
            overflow: visible !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          
          
          /* Desktop (1161px and up) - left fixed sidebar only */
          @media (min-width: 1161px) {
            main {
              padding-left: 280px !important;
              padding-right: 16px !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            .courses-main-content {
              padding-left: 280px !important;
              padding-right: 16px !important;
            }
            .courses-main-content > div {
              max-width: calc(100vw - 280px - 48px) !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            
            div[style*="flexDirection: column"][style*="alignItems: center"] {
              overflow-x: hidden !important;
              overflow-y: visible !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
          
          /* iPad (768px to 1160px) - left fixed sidebar only */
          @media (min-width: 768px) and (max-width: 1160px) {
            main {
              padding-left: 220px !important;
              padding-right: 16px !important;
              display: "flex" !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            .courses-main-content {
              padding-left: 220px !important;
              padding-right: 16px !important;
            }
            .courses-main-content > div {
              max-width: calc(100vw - 220px - 32px) !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            
            div[style*="flexDirection: column"][style*="alignItems: center"] {
              overflow-x: hidden !important;
              overflow-y: visible !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        }
      `}</style>
    </div>
  )
}
