"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Card from "../../components/ui/card"
import Button from "../../components/ui/button"

interface Certificate {
  id: string
  courseTitle: string
  issuedAt: string
  url?: string
}

interface CourseProgress {
  id: string
  title: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  quizzesPassed: number
  totalQuizzes: number
}

interface DashboardStats {
  coursesEnrolled: number
  lessonsCompleted: number
  currentStreak: number
  totalPoints: number
}

export default function ProgressPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    // Set blue gradient background for this page
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
      bodyEl.style.backgroundAttachment = "fixed"
    }
    return () => {
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }

    // Fetch real data from API
    const fetchData = async () => {
      try {
        setLoadingData(true)
        
        // Fetch real progress data
        const response = await fetch('/api/progress/user-progress')
        if (!response.ok) {
          throw new Error('Failed to fetch progress')
        }
        
        const data = await response.json()
        if (!data.success) {
          throw new Error('Failed to fetch progress')
        }

        const { sectionCompletions, quizAttempts, overallProgress, completedSections, totalSections } = data

        // Calculate real stats
        const uniqueModules = new Set(sectionCompletions.map((sc: any) => sc.moduleId))
        const coursesEnrolled = uniqueModules.size
        
        // Count total pages visited across all sections
        const lessonsCompleted = sectionCompletions.reduce((sum: number, sc: any) => sum + (sc.pagesVisited || 0), 0)
        
        // Count passed quizzes
        const quizzesPassed = quizAttempts.filter((qa: any) => qa.passed).length
        
        // Calculate course progress from section completions
        const courseProgressMap = new Map<number, { pagesVisited: number, totalPages: number, quizzesCompleted: number, quizzesTotal: number }>()
        
        sectionCompletions.forEach((sc: any) => {
          const moduleId = sc.moduleId
          if (!courseProgressMap.has(moduleId)) {
            courseProgressMap.set(moduleId, { pagesVisited: 0, totalPages: 0, quizzesCompleted: 0, quizzesTotal: 0 })
          }
          const course = courseProgressMap.get(moduleId)!
          course.pagesVisited += sc.pagesVisited || 0
          course.totalPages += sc.totalPages || 0
          course.quizzesCompleted += sc.quizzesCompleted || 0
          course.quizzesTotal += sc.quizzesTotal || 0
        })
        
        // Convert to course progress array
        const coursesArray: CourseProgress[] = Array.from(courseProgressMap.entries()).map(([moduleId, data]) => {
          const progress = data.totalPages > 0 
            ? Math.round((data.pagesVisited / data.totalPages) * 50 + (data.quizzesTotal > 0 ? (data.quizzesCompleted / data.quizzesTotal) * 50 : 0))
            : 0
          
          return {
            id: `module-${moduleId}`,
            title: `Módulo ${moduleId}`,
            progress: Math.min(progress, 100),
            lessonsCompleted: data.pagesVisited,
            totalLessons: data.totalPages,
            quizzesPassed: data.quizzesCompleted,
            totalQuizzes: data.quizzesTotal
          }
        })

        setCourses(coursesArray)
        
        // No certificates API yet, so set empty array
        setCertificates([])

        // Fetch streak and points from user stats API
        let currentStreak = 0
        let totalPoints = 0
        try {
          const statsRes = await fetch("/api/user/stats")
          if (statsRes.ok) {
            const statsData = await statsRes.json()
            currentStreak = statsData.currentStreak ?? 0
            totalPoints = statsData.totalPoints ?? statsData.xp ?? 0
          }
        } catch {
          // keep 0
        }

        // Set real stats
        setStats({
          coursesEnrolled: coursesEnrolled,
          lessonsCompleted: lessonsCompleted,
          currentStreak,
          totalPoints
        })
      } catch (error) {
        console.error("Error fetching progress:", error)
        // Set empty data on error
        setCertificates([])
        setCourses([])
        setStats({
          coursesEnrolled: 0,
          lessonsCompleted: 0,
          currentStreak: 0,
          totalPoints: 0
        })
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [user, loading, router])

  if (loading || loadingData) {
    return <div style={{ minHeight: "50vh", flex: 1 }} />
  }

  if (!user) return null

  const totalProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0

  return (
    <>
      <style>{`
        /* Mobile - account for footer */
        @media (max-width: 767px) {
          .progress-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .progress-inner {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        /* Tablet/iPad (768px-1160px) - account for left sidebar (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .progress-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .progress-inner {
            width: calc(100% - 220px) !important;
            max-width: calc(100% - 220px) !important;
            margin-left: 220px !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        /* Desktop (1161px+) - account for left sidebar (280px) */
        @media (min-width: 1161px) {
          .progress-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .progress-inner {
            width: calc(100% - 280px) !important;
            max-width: calc(100% - 280px) !important;
            margin-left: 280px !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
      `}</style>
      <div className="progress-outer" data-bizen-tour="progreso" style={{
        position: "relative",
        flex: 1,
        fontFamily: "Montserrat, sans-serif",
        background: "#ffffff",
        backgroundAttachment: "fixed",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div className="progress-inner" style={{
      position: "relative",
      flex: 1,
      paddingTop: 40,
      paddingBottom: 80,
      paddingRight: 40,
      paddingLeft: 40,
          boxSizing: "border-box"
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: "fixed",
        top: "10%",
        left: "5%",
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "fixed",
        top: "60%",
        right: "8%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "fixed",
        bottom: "5%",
        left: "15%",
        width: 350,
        height: 350,
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <main style={{ 
        position: "relative",
        maxWidth: "100%", 
        margin: "0", 
        padding: 0,
        zIndex: 1,
        fontFamily: "Montserrat, sans-serif"
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: "clamp(28px, 6vw, 36px)", 
            fontWeight: 800,
            color: "#1E40AF"
          }}>
            Mi Progreso
          </h1>
          <p style={{ margin: "8px 0 0", color: "#374151", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 600 }}>
            Revisa tus logros y certificados
          </p>
        </div>

        {/* Streak below header - left aligned */}
        <div style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 12,
          marginBottom: 32,
          padding: "14px 22px",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: 16,
          border: "2px solid rgba(59, 130, 246, 0.25)",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.12)",
          width: "fit-content"
        }}>
          <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
            <Image src="/streak.png" alt="" fill sizes="72px" style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1E40AF", lineHeight: 1.2 }}>{stats?.currentStreak ?? 0}</div>
            <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}>
              {stats?.currentStreak === 1 ? "día de racha" : "días de racha"}
            </div>
          </div>
        </div>

        {/* Stats Section - Only show real stats */}
        {stats && (stats.coursesEnrolled > 0 || stats.lessonsCompleted > 0) && (
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16
            }}>
              {stats.coursesEnrolled > 0 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "24px 16px", 
                  background: "rgba(255, 255, 255, 0.4)", 
                  backdropFilter: "blur(20px)", 
                  borderRadius: 20, 
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#0F62FE", marginBottom: 8 }}>{stats.coursesEnrolled}</div>
                  <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>Cursos</div>
                </div>
              )}
              {stats.lessonsCompleted > 0 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "24px 16px", 
                  background: "rgba(255, 255, 255, 0.4)", 
                  backdropFilter: "blur(20px)", 
                  borderRadius: 20, 
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#10B981", marginBottom: 8 }}>{stats.lessonsCompleted}</div>
                  <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>Lecciones</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overall Progress Card */}
        <div style={{ 
          padding: "32px 28px", 
          marginBottom: 32,
          background: "rgba(11, 113, 254, 0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "1px solid rgba(59, 130, 246, 0.4)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
          color: "#1E40AF"
        }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700, color: "#1E40AF" }}>
          Progreso General
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20
        }}>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#0B71FE" }}>{totalProgress}%</div>
            <div style={{ fontSize: 14, color: "#374151", fontWeight: 600, marginTop: 4 }}>Progreso Promedio</div>
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#0B71FE" }}>{courses.length}</div>
            <div style={{ fontSize: 14, color: "#374151", fontWeight: 600, marginTop: 4 }}>Cursos Activos</div>
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#0B71FE" }}>{certificates.length}</div>
            <div style={{ fontSize: 14, color: "#374151", fontWeight: 600, marginTop: 4 }}>Certificados Obtenidos</div>
          </div>
        </div>
        </div>

        {/* Logros & Insignias */}
        <div style={{
          width: "100%",
          marginBottom: 32,
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: 20,
          padding: 28,
          border: "2px solid rgba(147, 197, 253, 0.4)"
        }}>
          <h3 style={{
            margin: "0 0 20px",
            fontSize: 20,
            fontWeight: 800,
            color: "#1E40AF",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            Logros e Insignias
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: 16
          }}>
            <div style={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Primera Lección</div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔥</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Racha 7 Días</div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Curso Completo</div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Puntuación Perfecta</div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌅</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Madrugador</div>
            </div>

            <div style={{
              background: "rgba(156, 163, 175, 0.3)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              border: "2px dashed rgba(156, 163, 175, 0.5)"
            }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>🔒</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>Bloqueado</div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ 
            margin: "0 0 20px", 
            fontSize: 22, 
            fontWeight: 700,
            color: "#1E40AF"
          }}>
            Certificados
          </h2>
        
        {certificates.length > 0 ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20 
          }}>
            {certificates.map(cert => (
              <div 
                key={cert.id}
                style={{
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 20,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
                }}
                onClick={() => {
                  if (cert.url) {
                    window.open(cert.url, "_blank")
                  }
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(15, 98, 254, 0.25)"
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.15)"
                }}
              >
                {/* Certificate Header */}
                <div style={{
                  padding: "28px 24px",
                  background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
                  color: "#fff",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                    Certificado de Finalización
                  </h3>
                </div>

                {/* Certificate Info */}
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: "#1E40AF",
                    marginBottom: 12,
                    lineHeight: 1.4
                  }}>
                    {cert.courseTitle}
                  </div>
                  <div style={{ fontSize: 14, color: "#374151", fontWeight: 600, marginBottom: 16 }}>
                    Emitido: {new Date(cert.issuedAt).toLocaleDateString('es-ES', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  {cert.url && (
                    <Button 
                      variant="ghost"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        window.open(cert.url, "_blank")
                      }}
                      style={{ width: "100%" }}
                    >
                      Descargar PDF →
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: "40px 24px", 
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1E40AF" }}>
              Aún no tienes certificados
            </h3>
            <p style={{ margin: 0, color: "#374151", fontSize: 14, fontWeight: 600 }}>
              Completa tus cursos para obtener certificados
            </p>
          </div>
        )}
        </div>

        {/* Course Progress Section */}
        <div>
          <h2 style={{ 
            margin: "0 0 20px", 
            fontSize: 22, 
            fontWeight: 700,
            color: "#1E40AF"
          }}>
            Progreso por Curso
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {courses.map(course => (
              <div 
                key={course.id}
                style={{ 
                  padding: 24,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 20,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
                }}
                onClick={() => router.push(`/courses/${course.id}`)}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(15, 98, 254, 0.25)"
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.15)"
                }}
              >
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1E40AF" }}>
                  {course.title}
                </h3>
                <div style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 14,
                  color: "#374151",
                  fontWeight: 600,
                  flexWrap: "wrap"
                }}>
                  <span>{course.lessonsCompleted}/{course.totalLessons} lecciones</span>
                  <span>{course.quizzesPassed}/{course.totalQuizzes} quizzes aprobados</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "#374151",
                  fontWeight: 600,
                  marginBottom: 8
                }}>
                  <span>Progreso</span>
                  <span>{course.progress}%</span>
                </div>
                <div style={{
                  width: "100%",
                  height: 10,
                  background: "rgba(59, 130, 246, 0.2)",
                  borderRadius: 10,
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${course.progress}%`,
                    background: "linear-gradient(90deg, #0F62FE 0%, #10B981 100%)",
                    borderRadius: 10,
                    transition: "width 0.5s ease",
                    boxShadow: "0 0 12px rgba(15, 98, 254, 0.4)"
                  }} />
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
      </div>
    </>
  )
}

