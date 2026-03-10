"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import PageLoader from "@/components/PageLoader"

interface Topic {
  id: string
  title: string
  description: string
  level: string
  coursesCount: number
  isEnabled: boolean
}

export default function AdminTopicsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loadingTopics, setLoadingTopics] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }

    const fetchTopics = async () => {
      try {
        setLoadingTopics(true)
        // Fetch topics from our new API endpoint
        const res = await fetch('/api/topics')
        if (!res.ok) throw new Error('Failed to fetch topics')
        const data = await res.json()

        // Map data to our local interface
        setTopics(data.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          level: t.level,
          coursesCount: t._count?.courses || 0,
          isEnabled: true // Default for now
        })))
      } catch (error) {
        console.error("Error fetching topics:", error)
      } finally {
        setLoadingTopics(false)
      }
    }

    fetchTopics()
  }, [user, loading, router])

  const handleToggleTopic = async (topicId: string) => {
    // TODO: Call /api/school-topics to toggle
    setTopics(topics.map(t =>
      t.id === topicId ? { ...t, isEnabled: !t.isEnabled } : t
    ))
    console.log("Toggle topic", topicId)
  }

  if (loading || loadingTopics) {
    return <PageLoader />
  }

  if (!user) return null

  const enabledTopics = topics.filter(t => t.isEnabled)
  const disabledTopics = topics.filter(t => !t.isEnabled)

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
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(28px, 6vw, 36px)",
          fontWeight: 500,
          background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          📚 Gestión de Temas
        </h1>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: "clamp(14px, 3vw, 16px)" }}>
          Habilita o deshabilita temas para tu escuela
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
          <div style={{ fontSize: 32, fontWeight: 500, color: "#0F62FE" }}>{topics.length}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Total Temas</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ fontSize: 32, fontWeight: 500, color: "#10B981" }}>{enabledTopics.length}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Habilitados</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "20px 16px" }}>
          <div style={{ fontSize: 32, fontWeight: 500, color: "#9CA3AF" }}>{disabledTopics.length}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Deshabilitados</div>
        </Card>
      </div>

      {/* Enabled Topics */}
      {enabledTopics.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 500 }}>
            ✓ Temas Habilitados
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20
          }}>
            {enabledTopics.map(topic => (
              <Card
                key={topic.id}
                style={{ padding: "24px 20px" }}
              >
                <div style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: getLevelColor(topic.level) + "22",
                  color: getLevelColor(topic.level),
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 12
                }}>
                  {topic.level === "Beginner" ? "Principiante" : topic.level === "Intermediate" ? "Intermedio" : "Avanzado"}
                </div>

                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}>
                  {topic.title}
                </h3>

                <p style={{ margin: "0 0 16px", fontSize: 14, color: "#666", lineHeight: 1.4 }}>
                  {topic.description}
                </p>

                <div style={{
                  fontSize: 13,
                  color: "#666",
                  marginBottom: 16
                }}>
                  🎓 {topic.coursesCount} cursos
                </div>

                <Button
                  onClick={() => handleToggleTopic(topic.id)}
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

      {/* Disabled Topics */}
      {disabledTopics.length > 0 && (
        <div>
          <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 500 }}>
            ⊗ Temas Disponibles
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20
          }}>
            {disabledTopics.map(topic => (
              <Card
                key={topic.id}
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
                  fontWeight: 500,
                  marginBottom: 12
                }}>
                  {topic.level === "Beginner" ? "Principiante" : topic.level === "Intermediate" ? "Intermedio" : "Avanzado"}
                </div>

                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}>
                  {topic.title}
                </h3>

                <p style={{ margin: "0 0 16px", fontSize: 14, color: "#666", lineHeight: 1.4 }}>
                  {topic.description}
                </p>

                <div style={{
                  fontSize: 13,
                  color: "#666",
                  marginBottom: 16
                }}>
                  🎓 {topic.coursesCount} cursos
                </div>

                <Button
                  onClick={() => handleToggleTopic(topic.id)}
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
      {topics.length === 0 && (
        <Card style={{ padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 500 }}>
            No hay temas disponibles
          </h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Pronto habrá nuevos temas disponibles
          </p>
        </Card>
      )}
    </main>
  )
}
