"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Card from "@/components/ui/card"

interface AnalyticsData {
  totalStudents: number
  activeStudents: number
  avgProgress: number
  completionRate: number
  courseStats: Array<{
    id: string
    title: string
    studentsEnrolled: number
    avgProgress: number
    completionRate: number
  }>
  recentQuizzes: Array<{
    id: string
    studentName: string
    quizTitle: string
    score: number
    completedAt: string
    status: "passed" | "failed"
  }>
  pendingGrading: Array<{
    id: string
    studentName: string
    assignmentTitle: string
    submittedAt: string
  }>
}

export default function TeacherAnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }

    // TODO: Fetch analytics from API
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true)
        // Placeholder data
        setAnalytics({
          totalStudents: 73,
          activeStudents: 58,
          avgProgress: 62,
          completionRate: 45,
          courseStats: [
            {
              id: "course-1",
              title: "Fundamentos de Finanzas Personales",
              studentsEnrolled: 45,
              avgProgress: 68,
              completionRate: 52
            },
            {
              id: "course-2",
              title: "Inversión para Principiantes",
              studentsEnrolled: 28,
              avgProgress: 54,
              completionRate: 35
            }
          ],
          recentQuizzes: [
            {
              id: "attempt-1",
              studentName: "María González",
              quizTitle: "Quiz: Introducción a las Finanzas",
              score: 85,
              completedAt: "2025-11-02T14:30:00",
              status: "passed"
            },
            {
              id: "attempt-2",
              studentName: "Carlos Pérez",
              quizTitle: "Quiz: Presupuesto Personal",
              score: 65,
              completedAt: "2025-11-02T12:15:00",
              status: "failed"
            },
            {
              id: "attempt-3",
              studentName: "Ana Martínez",
              quizTitle: "Quiz: Ahorro e Inversión",
              score: 92,
              completedAt: "2025-11-01T16:45:00",
              status: "passed"
            }
          ],
          pendingGrading: [
            {
              id: "sub-1",
              studentName: "Juan López",
              assignmentTitle: "Plan de Presupuesto Mensual",
              submittedAt: "2025-11-02T10:20:00"
            },
            {
              id: "sub-2",
              studentName: "Laura Sánchez",
              assignmentTitle: "Ensayo: Historia del Dinero",
              submittedAt: "2025-11-01T18:30:00"
            }
          ]
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoadingAnalytics(false)
      }
    }

    fetchAnalytics()
  }, [user, loading, router])

  if (loading || loadingAnalytics) {
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
          <p style={{ color: "#666", fontSize: 16 }}>Cargando análisis...</p>
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

  if (!user || !analytics) return null

  return (
    <main style={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      padding: "clamp(20px, 4vw, 40px)",
      fontFamily: "Montserrat, sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: "clamp(28px, 6vw, 36px)", 
          fontWeight: 800,
          background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          📊 Análisis y Desempeño
        </h1>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: "clamp(14px, 3vw, 16px)" }}>
          Monitorea el progreso de tus estudiantes
        </p>
      </div>

      {/* Overview Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 40
      }}>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#0F62FE" }}>{analytics.totalStudents}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Total Estudiantes</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#10B981" }}>{analytics.activeStudents}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Activos (últimos 7 días)</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#F59E0B" }}>{analytics.avgProgress}%</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Progreso Promedio</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#8B5CF6" }}>{analytics.completionRate}%</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Tasa de Finalización</div>
        </Card>
      </div>

      {/* Course Performance */}
      <Card style={{ marginBottom: 32, padding: "28px 24px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
          📚 Desempeño por Curso
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {analytics.courseStats.map(course => (
            <div key={course.id}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: 12,
                flexWrap: "wrap",
                gap: 12
              }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>
                    {course.title}
                  </h3>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    {course.studentsEnrolled} estudiantes
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0F62FE" }}>
                    {course.avgProgress}%
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    Progreso promedio
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                width: "100%",
                height: 8,
                background: "#E5E7EB",
                borderRadius: 10,
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${course.avgProgress}%`,
                  background: "linear-gradient(90deg, #0F62FE 0%, #10B981 100%)",
                  borderRadius: 10,
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24
      }}>
        {/* Recent Quiz Results */}
        <Card style={{ padding: "28px 24px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700 }}>
            ✅ Resultados Recientes de Quizzes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {analytics.recentQuizzes.map(quiz => (
              <div 
                key={quiz.id}
                style={{
                  padding: 16,
                  background: "#F9FAFB",
                  borderRadius: 12,
                  borderLeft: `4px solid ${quiz.status === "passed" ? "#10B981" : "#EF4444"}`
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: 8,
                  gap: 12
                }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                    {quiz.studentName}
                  </div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: quiz.status === "passed" ? "#10B981" : "#EF4444"
                  }}>
                    {quiz.score}%
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                  {quiz.quizTitle}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                  {new Date(quiz.completedAt).toLocaleString('es-ES', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Grading */}
        <Card style={{ padding: "28px 24px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700 }}>
            ⏳ Pendientes de Calificar ({analytics.pendingGrading.length})
          </h2>
          {analytics.pendingGrading.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {analytics.pendingGrading.map(submission => (
                <div 
                  key={submission.id}
                  style={{
                    padding: 16,
                    background: "#FEF3C7",
                    borderRadius: 12,
                    border: "1px solid #F59E0B",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => {
                    // TODO: Navigate to grading page
                    console.log("Grade submission", submission.id)
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FDE68A"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#FEF3C7"
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 8 }}>
                    {submission.studentName}
                  </div>
                  <div style={{ fontSize: 13, color: "#92400E", marginBottom: 4 }}>
                    {submission.assignmentTitle}
                  </div>
                  <div style={{ fontSize: 12, color: "#B45309" }}>
                    Enviado: {new Date(submission.submittedAt).toLocaleString('es-ES', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
              <p style={{ margin: 0, fontSize: 14 }}>
                No hay asignaciones pendientes
              </p>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}

