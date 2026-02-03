"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Card from "../../../components/ui/card"
import Button from "../../../components/ui/button"

interface Course {
  id: string
  title: string
  description: string
  level: string
  isActive: boolean
  unitsCount: number
  lessonsCount: number
  studentsEnrolled: number
  createdAt: string
}

export default function TeacherCoursesPage() {
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

    // TODO: Check if user has teacher role
    // if (user role !== "teacher") redirect

    // TODO: Fetch teacher's courses from API
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
            isActive: true,
            unitsCount: 4,
            lessonsCount: 24,
            studentsEnrolled: 45,
            createdAt: "2025-09-01T00:00:00"
          },
          {
            id: "course-2",
            title: "Inversión para Principiantes",
            description: "Introducción a conceptos de inversión y mercados financieros",
            level: "Intermediate",
            isActive: true,
            unitsCount: 3,
            lessonsCount: 18,
            studentsEnrolled: 28,
            createdAt: "2025-09-15T00:00:00"
          },
          {
            id: "course-3",
            title: "Emprendimiento Financiero",
            description: "Gestión financiera para emprendedores",
            level: "Advanced",
            isActive: false,
            unitsCount: 5,
            lessonsCount: 30,
            studentsEnrolled: 0,
            createdAt: "2025-10-01T00:00:00"
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

  const handleCreateCourse = () => {
    // TODO: Open create course modal or navigate to form
    console.log("Create new course")
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

  const activeCourses = courses.filter(c => c.isActive)
  const draftCourses = courses.filter(c => !c.isActive)

  return (
    <main style={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      padding: "clamp(20px, 4vw, 40px)",
      fontFamily: "Montserrat, sans-serif"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        marginBottom: 32,
        gap: 20,
        flexWrap: "wrap"
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: "clamp(28px, 6vw, 36px)", 
            fontWeight: 800,
            background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            👨‍🏫 Mis Cursos
          </h1>
          <p style={{ margin: "8px 0 0", color: "#666", fontSize: "clamp(14px, 3vw, 16px)" }}>
            Administra tu contenido educativo
          </p>
        </div>

        <Button onClick={handleCreateCourse} style={{ minWidth: 180 }}>
          + Crear Curso
        </Button>
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
          <div style={{ fontSize: 32, fontWeight: 800, color: "#10B981" }}>{activeCourses.length}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Activos</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#F59E0B" }}>
            {courses.reduce((sum, c) => sum + c.studentsEnrolled, 0)}
          </div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Estudiantes</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#8B5CF6" }}>
            {courses.reduce((sum, c) => sum + c.lessonsCount, 0)}
          </div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Lecciones</div>
        </Card>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
            ✓ Cursos Activos
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20
          }}>
            {activeCourses.map(course => (
              <Card 
                key={course.id}
                style={{ 
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onClick={() => router.push(`/teacher/courses/${course.id}`)}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(15, 98, 254, 0.2)"
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)"
                }}
              >
                {/* Header */}
                <div style={{
                  padding: "24px 20px",
                  background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                  color: "#fff"
                }}>
                  <div style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    background: "rgba(255,255,255,0.2)",
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
                  <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.4 }}>
                    {course.description}
                  </p>
                </div>

                {/* Stats */}
                <div style={{ padding: "20px" }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    marginBottom: 16,
                    textAlign: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#0F62FE" }}>{course.unitsCount}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>Unidades</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>{course.lessonsCount}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>Lecciones</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>{course.studentsEnrolled}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>Alumnos</div>
                    </div>
                  </div>

                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      router.push(`/teacher/courses/${course.id}`)
                    }}
                    style={{ width: "100%" }}
                  >
                    Administrar →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Draft Courses */}
      {draftCourses.length > 0 && (
        <div>
          <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
            📝 Borradores
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20
          }}>
            {draftCourses.map(course => (
              <Card 
                key={course.id}
                style={{ 
                  padding: "24px 20px",
                  cursor: "pointer",
                  opacity: 0.8,
                  transition: "all 0.3s ease"
                }}
                onClick={() => router.push(`/teacher/courses/${course.id}`)}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.opacity = "1"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.opacity = "0.8"
                  e.currentTarget.style.transform = "translateY(0)"
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
                  Borrador
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>
                  {course.title}
                </h3>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: "#666", lineHeight: 1.4 }}>
                  {course.description}
                </p>
                <Button variant="ghost" style={{ width: "100%" }}>
                  Continuar editando →
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
            Crea tu primer curso
          </h3>
          <p style={{ margin: "0 0 24px", color: "#666", fontSize: 14 }}>
            Comienza a construir contenido educativo para tus estudiantes
          </p>
          <Button onClick={handleCreateCourse} style={{ maxWidth: 200 }}>
            + Crear Curso
          </Button>
        </Card>
      )}
    </main>
  )
}

