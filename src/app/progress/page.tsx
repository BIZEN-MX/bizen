"use client"

import { useEffect, useState } from "react"
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
      bodyEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
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
      router.replace("/login")
      return
    }

    // TODO: Fetch real data from API
    const fetchData = async () => {
      try {
        setLoadingData(true)
        // Placeholder data
        setCertificates([
          {
            id: "cert-1",
            courseTitle: "Fundamentos de Finanzas Personales",
            issuedAt: "2025-10-15T10:30:00",
            url: "/certificates/cert-1.pdf"
          }
        ])

        setCourses([
          {
            id: "course-1",
            title: "Fundamentos de Finanzas Personales",
            progress: 45,
            lessonsCompleted: 12,
            totalLessons: 24,
            quizzesPassed: 3,
            totalQuizzes: 6
          },
          {
            id: "course-2",
            title: "Inversión para Principiantes",
            progress: 10,
            lessonsCompleted: 2,
            totalLessons: 18,
            quizzesPassed: 0,
            totalQuizzes: 4
          }
        ])

        // Fetch user stats
        setStats({
          coursesEnrolled: 2,
          lessonsCompleted: 15,
          currentStreak: 7,
          totalPoints: 450
        })
      } catch (error) {
        console.error("Error fetching progress:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [user, loading, router])

  if (loading || loadingData) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #0F62FE22",
            borderTop: "4px solid #0F62FE",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#666", fontSize: 16 }}>Cargando progreso...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) return null

  const totalProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      paddingRight: 40,
      paddingLeft: 40,
      fontFamily: "Montserrat, sans-serif",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed",
      marginRight: "340px"
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
        <div style={{ marginBottom: 40 }}>
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

        {/* Stats Section */}
        {stats && (
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16
            }}>
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
                <div style={{ fontSize: 36, fontWeight: 800, color: "#F59E0B", marginBottom: 8 }}>🔥 {stats.currentStreak}</div>
                <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>Racha</div>
              </div>
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
                <div style={{ fontSize: 36, fontWeight: 800, color: "#8B5CF6", marginBottom: 8 }}>{stats.totalPoints}</div>
                <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>Puntos</div>
              </div>
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
  )
}

