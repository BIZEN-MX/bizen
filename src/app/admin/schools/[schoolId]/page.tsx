"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"

interface SchoolDetail {
  id: string
  name: string
  region: string
  contactEmail: string
  license: {
    plan: string
    seats: number
    seatsUsed: number
    status: string
    startDate: string
    endDate: string
  }
  stats: {
    totalUsers: number
    students: number
    teachers: number
    coursesEnabled: number
    avgProgress: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export default function AdminSchoolDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const schoolId = params.schoolId as string
  
  const [school, setSchool] = useState<SchoolDetail | null>(null)
  const [loadingSchool, setLoadingSchool] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }

    // TODO: Check if user has school_admin role
    // if (user role !== "school_admin") redirect

    // TODO: Fetch school details from API
    const fetchSchool = async () => {
      try {
        setLoadingSchool(true)
        // Placeholder data
        setSchool({
          id: schoolId,
          name: "Colegio Mondragón",
          region: "Región Norte",
          contactEmail: "admin@mondragon.edu",
          license: {
            plan: "annual",
            seats: 100,
            seatsUsed: 73,
            status: "active",
            startDate: "2025-01-01T00:00:00",
            endDate: "2026-01-01T00:00:00"
          },
          stats: {
            totalUsers: 73,
            students: 68,
            teachers: 5,
            coursesEnabled: 3,
            avgProgress: 58
          },
          recentActivity: [
            {
              id: "1",
              type: "enrollment",
              description: "María González se inscribió en Fundamentos de Finanzas",
              timestamp: "2025-11-02T14:30:00"
            },
            {
              id: "2",
              type: "completion",
              description: "Carlos Pérez completó la Unidad 1",
              timestamp: "2025-11-02T12:15:00"
            },
            {
              id: "3",
              type: "user_added",
              description: "Nuevo profesor agregado: Ana Martínez",
              timestamp: "2025-11-01T10:00:00"
            }
          ]
        })
      } catch (error) {
        console.error("Error fetching school:", error)
      } finally {
        setLoadingSchool(false)
      }
    }

    fetchSchool()
  }, [user, loading, router, schoolId])

  if (loading || loadingSchool) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 16 }}>Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (!user || !school) return null

  const licenseUsagePercent = Math.round((school.license.seatsUsed / school.license.seats) * 100)
  const daysRemaining = Math.ceil((new Date(school.license.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

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
          margin: "0 0 8px", 
          fontSize: "clamp(28px, 6vw, 36px)", 
          fontWeight: 800,
          background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          {school.name}
        </h1>
        <div style={{ fontSize: 15, color: "#666" }}>
          {school.region} • {school.contactEmail}
        </div>
      </div>

      {/* License Status Card */}
      <Card style={{ 
        padding: "32px 28px",
        marginBottom: 32,
        background: school.license.status === "active" 
          ? "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)" 
          : "#F3F4F6",
        color: school.license.status === "active" ? "#fff" : "#111"
      }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
          🔑 Estado de Licencia
        </h2>
        
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 24
        }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Plan</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {school.license.plan === "annual" ? "Anual" : "Mensual"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Asientos Usados</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {school.license.seatsUsed} / {school.license.seats}
            </div>
            <div style={{
              width: "100%",
              height: 6,
              background: "rgba(255,255,255,0.3)",
              borderRadius: 10,
              overflow: "hidden",
              marginTop: 8
            }}>
              <div style={{
                height: "100%",
                width: `${licenseUsagePercent}%`,
                background: "#fff",
                borderRadius: 10
              }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Días Restantes</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {daysRemaining}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Estado</div>
            <div style={{
              display: "inline-block",
              padding: "6px 14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              marginTop: 4
            }}>
              {school.license.status === "active" ? "✓ Activa" : "Inactiva"}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Button 
            onClick={() => router.push("/admin/licenses")}
            style={{ 
              background: "#fff",
              color: "#0F62FE",
              minWidth: 200
            }}
          >
            Gestionar Licencia
          </Button>
        </div>
      </Card>

      {/* Stats Overview */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        marginBottom: 32
      }}>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#0F62FE" }}>{school.stats.totalUsers}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Total Usuarios</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#10B981" }}>{school.stats.students}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Estudiantes</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#F59E0B" }}>{school.stats.teachers}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Profesores</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#8B5CF6" }}>{school.stats.coursesEnabled}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Cursos Habilitados</div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card style={{ padding: "28px 24px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
          📊 Actividad Reciente
        </h2>
        {school.recentActivity.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {school.recentActivity.map(activity => (
              <div 
                key={activity.id}
                style={{
                  padding: 16,
                  background: "#F9FAFB",
                  borderRadius: 12,
                  borderLeft: "4px solid #0F62FE"
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 4 }}>
                  {activity.description}
                </div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {new Date(activity.timestamp).toLocaleString('es-ES', { 
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
            <p style={{ margin: 0, fontSize: 14 }}>No hay actividad reciente</p>
          </div>
        )}
      </Card>
    </main>
  )
}

