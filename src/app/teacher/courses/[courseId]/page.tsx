"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Card from "../../../../components/ui/card"
import Button from "../../../../components/ui/button"

interface Unit {
  id: string
  title: string
  order: number
  isLocked: boolean
  lessonsCount: number
}

interface CourseDetail {
  id: string
  title: string
  description: string
  level: string
  isActive: boolean
  units: Unit[]
  studentsEnrolled: number
}

export default function TeacherCourseEditPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [activeTab, setActiveTab] = useState<"units" | "settings" | "students">("units")

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }

    // TODO: Fetch course details from API
    const fetchCourse = async () => {
      try {
        setLoadingCourse(true)
        // Placeholder data
        setCourse({
          id: courseId,
          title: "Fundamentos de Finanzas Personales",
          description: "Curso introductorio sobre finanzas personales para estudiantes de secundaria",
          level: "Beginner",
          isActive: true,
          studentsEnrolled: 45,
          units: [
            { id: "unit-1", title: "Introducción a las Finanzas", order: 1, isLocked: false, lessonsCount: 5 },
            { id: "unit-2", title: "Presupuesto Personal", order: 2, isLocked: false, lessonsCount: 6 },
            { id: "unit-3", title: "Ahorro e Inversión", order: 3, isLocked: false, lessonsCount: 7 },
            { id: "unit-4", title: "Crédito y Deuda", order: 4, isLocked: false, lessonsCount: 6 }
          ]
        })
      } catch (error) {
        console.error("Error fetching course:", error)
      } finally {
        setLoadingCourse(false)
      }
    }

    fetchCourse()
  }, [user, loading, router, courseId])

  const handleAddUnit = () => {
    // TODO: Open modal to create unit
    console.log("Add unit")
  }

  const handleToggleActive = async () => {
    // TODO: Call API to toggle course active status
    if (course) {
      setCourse({ ...course, isActive: !course.isActive })
    }
  }

  if (loading || loadingCourse) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 16 }}>Cargando curso...</p>
        </div>
      </div>
    )
  }

  if (!user || !course) return null

  return (
    <main style={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      padding: "clamp(20px, 4vw, 40px)",
      fontFamily: "Montserrat, sans-serif"
    }}>
      {/* Back Button */}
      <button
        onClick={() => router.push("/teacher/courses")}
        style={{
          background: "transparent",
          border: "none",
          color: "#0F62FE",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 6
        }}
      >
        ← Volver a mis cursos
      </button>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <h1 style={{ 
              margin: "0 0 8px", 
              fontSize: "clamp(24px, 5vw, 32px)", 
              fontWeight: 800,
              color: "#111"
            }}>
              {course.title}
            </h1>
            <div style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap"
            }}>
              <span style={{
                padding: "4px 12px",
                background: course.isActive ? "#D1FAE5" : "#F3F4F6",
                color: course.isActive ? "#065F46" : "#6B7280",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600
              }}>
                {course.isActive ? "✓ Activo" : "Borrador"}
              </span>
              <span style={{ fontSize: 14, color: "#666" }}>
                {course.studentsEnrolled} estudiantes inscritos
              </span>
            </div>
          </div>

          <Button onClick={handleToggleActive} variant={course.isActive ? "ghost" : "primary"}>
            {course.isActive ? "Desactivar" : "Activar Curso"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 32,
        borderBottom: "2px solid #E5E7EB",
        flexWrap: "wrap"
      }}>
        {[
          { key: "units", label: "Unidades y Lecciones", icon: "📚" },
          { key: "settings", label: "Configuración", icon: "⚙️" },
          { key: "students", label: "Estudiantes", icon: "👥" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: "12px 20px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.key ? "3px solid #0F62FE" : "3px solid transparent",
              color: activeTab === tab.key ? "#0F62FE" : "#6B7280",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Units Tab */}
      {activeTab === "units" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              Unidades del Curso
            </h2>
            <Button onClick={handleAddUnit}>+ Agregar Unidad</Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {course.units.map((unit, index) => (
              <Card 
                key={unit.id}
                style={{ 
                  padding: 24,
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onClick={() => {
                  // TODO: Navigate to unit editor or expand inline
                  console.log("Edit unit", unit.id)
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.15)"
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "#0F62FE",
                      color: "#fff",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 12
                    }}>
                      Unidad {unit.order}
                    </div>

                    <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700 }}>
                      {unit.title}
                    </h3>

                    <div style={{ 
                      fontSize: 14, 
                      color: "#666",
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap"
                    }}>
                      <span>📖 {unit.lessonsCount} lecciones</span>
                      {unit.isLocked && <span style={{ color: "#F59E0B" }}>🔒 Bloqueada</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log("Edit unit", unit.id)
                      }}
                      style={{
                        padding: "8px 16px",
                        background: "#F3F4F6",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "#374151"
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log("Reorder unit")
                      }}
                      style={{
                        padding: "8px 12px",
                        background: "transparent",
                        border: "1px solid #D1D5DB",
                        borderRadius: 8,
                        fontSize: 18,
                        cursor: "move",
                        color: "#6B7280"
                      }}
                    >
                      ⋮⋮
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <Card style={{ padding: "32px 28px" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>
            Configuración del Curso
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Título del Curso
              </label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #D1D5DB",
                  borderRadius: 8,
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Descripción
              </label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #D1D5DB",
                  borderRadius: 8,
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif",
                  resize: "vertical"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Nivel
              </label>
              <select
                value={course.level}
                onChange={(e) => setCourse({ ...course, level: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #D1D5DB",
                  borderRadius: 8,
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif"
                }}
              >
                <option value="Beginner">Principiante</option>
                <option value="Intermediate">Intermedio</option>
                <option value="Advanced">Avanzado</option>
              </select>
            </div>

            <Button style={{ marginTop: 16, maxWidth: 200 }}>
              Guardar Cambios
            </Button>
          </div>
        </Card>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <Card style={{ padding: "32px 28px" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>
            Estudiantes Inscritos ({course.studentsEnrolled})
          </h2>

          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p style={{ margin: 0, fontSize: 15 }}>
              Lista de estudiantes y métricas de progreso
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 13 }}>
              (Implementación pendiente con API de estudiantes)
            </p>
          </div>
        </Card>
      )}
    </main>
  )
}

