"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

interface Course {
  id: string
  title: string
  description: string
  level: string
  lessonsCount: number
  isEnabled: boolean
}

export default function AdminCoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }

    // TODO: Fetch all courses and school_courses from API
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true)
        // Placeholder data
        setCourses([
          {
            id: "course-1",
            title: "Fundamentos de Finanzas Personales",
            description: "Curso introductorio sobre finanzas personales para estudiantes de secundaria",
            level: "Beginner",
            lessonsCount: 24,
            isEnabled: true
          },
          {
            id: "course-2",
            title: "Inversión para Principiantes",
            description: "Introducción a conceptos de inversión y mercados financieros",
            level: "Intermediate",
            lessonsCount: 18,
            isEnabled: true
          },
          {
            id: "course-3",
            title: "Emprendimiento Financiero",
            description: "Gestión financiera para emprendedores",
            level: "Advanced",
            lessonsCount: 30,
            isEnabled: false
          },
          {
            id: "course-4",
            title: "Criptomonedas y Blockchain",
            description: "Introducción al mundo de las criptomonedas",
            level: "Intermediate",
            lessonsCount: 15,
            isEnabled: false
          }
        ])
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [user, loading, router])

  const handleToggleCourse = async (courseId: string) => {
    // TODO: Call API to toggle school_course.isEnabled
    setCourses(courses.map(c => 
      c.id === courseId ? { ...c, isEnabled: !c.isEnabled } : c
    ))
    console.log("Toggle course", courseId)
  }

  if (loading || loadingCourses) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 16 }}>Cargando cursos...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const enabledCourses = courses.filter(c => c.isEnabled)
  const disabledCourses = courses.filter(c => !c.isEnabled)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "#10B981"
      case "Intermediate": return "#F59E0B"
      case "Advanced": return "#EF4444"
      default: return "#6B7280"
    }
  }

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
          📚 Gestión de Cursos
        </h1>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: "clamp(14px, 3vw, 16px)" }}>
          Habilita o deshabilita cursos para tu escuela
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        marginBottom: 40
      }}>
        <Card style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#0F62FE" }}>{courses.length}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Total Cursos</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#10B981" }}>{enabledCourses.length}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Habilitados</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#9CA3AF" }}>{disabledCourses.length}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Deshabilitados</div>
        </Card>
      </div>

      {/* Enabled Courses */}
      {enabledCourses.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
            ✓ Cursos Habilitados
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20
          }}>
            {enabledCourses.map(course => (
              <Card 
                key={course.id}
                style={{ padding: "24px 20px" }}
              >
                <div style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: getLevelColor(course.level) + "22",
                  color: getLevelColor(course.level),
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 12
                }}>
                  {course.level === "Beginner" ? "Principiante" : course.level === "Intermediate" ? "Intermedio" : "Avanzado"}
                </div>

                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                  {course.title}
                </h3>
                
                <p style={{ margin: "0 0 16px", fontSize: 14, color: "#666", lineHeight: 1.4 }}>
                  {course.description}
                </p>

                <div style={{ 
                  fontSize: 13, 
                  color: "#666",
                  marginBottom: 16
                }}>
                  📖 {course.lessonsCount} lecciones
                </div>

                <Button
                  onClick={() => handleToggleCourse(course.id)}
                  variant="ghost"
                  style={{ 
                    width: "100%",
                    color: "#EF4444",
                    borderColor: "#EF4444"
                  }}
                >
                  Deshabilitar
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Disabled Courses */}
      {disabledCourses.length > 0 && (
        <div>
          <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
            ⊗ Cursos Disponibles
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20
          }}>
            {disabledCourses.map(course => (
              <Card 
                key={course.id}
                style={{ 
                  padding: "24px 20px",
                  opacity: 0.7
                }}
              >
                <div style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "#F3F4F6",
                  color: "#6B7280",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 12
                }}>
                  {course.level === "Beginner" ? "Principiante" : course.level === "Intermediate" ? "Intermedio" : "Avanzado"}
                </div>

                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                  {course.title}
                </h3>
                
                <p style={{ margin: "0 0 16px", fontSize: 14, color: "#666", lineHeight: 1.4 }}>
                  {course.description}
                </p>

                <div style={{ 
                  fontSize: 13, 
                  color: "#666",
                  marginBottom: 16
                }}>
                  📖 {course.lessonsCount} lecciones
                </div>

                <Button
                  onClick={() => handleToggleCourse(course.id)}
                  style={{ width: "100%" }}
                >
                  Habilitar para mi escuela
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <Card style={{ padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>
            No hay cursos disponibles
          </h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Pronto habrá nuevos cursos disponibles
          </p>
        </Card>
      )}
    </main>
  )
}

