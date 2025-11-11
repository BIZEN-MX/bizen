"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface ForumTopic {
  id: string
  name: string
  slug: string
  icon: string
}

interface ForumTag {
  id: string
  name: string
  slug: string
}

export default function NewThreadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [existingTags, setExistingTags] = useState<ForumTag[]>([])
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
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
    fetchData()
  }, [user, loading, router])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      const [topicsRes, tagsRes] = await Promise.all([
        fetch('/api/forum/topics'),
        fetch('/api/forum/tags')
      ])

      if (topicsRes.ok) {
        const topicsData = await topicsRes.json()
        setTopics(topicsData)
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json()
        setExistingTags(tagsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleAddTag = () => {
    if (newTagInput.trim() && selectedTags.length < 5) {
      const slug = newTagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!selectedTags.includes(slug)) {
        setSelectedTags([...selectedTags, slug])
      }
      setNewTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim() || !selectedTopicId || submitting) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          topicId: selectedTopicId,
          tagSlugs: selectedTags
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/forum/thread/${data.id}`)
      } else {
        const error = await response.json()
        console.error("Error creating thread:", error)
        alert(error.details || error.error || "Error al crear el tema")
      }
    } catch (error) {
      console.error("Error creating thread:", error)
      alert("Error al crear el tema")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div style={{ 
        display: "grid", 
        placeItems: "center", 
        minHeight: "60vh", 
        fontFamily: "Montserrat, sans-serif",
        background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      }}>
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
          <p style={{ color: "#666", fontSize: 16 }}>Cargando...</p>
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

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      fontFamily: "Montserrat, sans-serif",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed"
    }}>
      <main style={{ 
        position: "relative",
        maxWidth: 1000, 
        margin: "0 auto", 
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
          <Link href="/forum" style={{ color: "#0F62FE", textDecoration: "none" }}>
            Foro
          </Link>
          <span style={{ color: "#9CA3AF" }}>→</span>
          <span style={{ color: "#374151" }}>Crear Tema</span>
        </div>

        <h1 style={{ 
          margin: "0 0 8px", 
          fontSize: "clamp(24px, 5vw, 32px)", 
          fontWeight: 800,
          color: "#1E40AF"
        }}>
          Crear Nuevo Tema
        </h1>
        <p style={{ margin: "0 0 32px", color: "#374151", fontSize: 15, fontWeight: 600 }}>
          Comparte una pregunta, idea o proyecto
        </p>

        {/* Form */}
        <div style={{
          padding: 32,
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "2px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
        }}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block",
                marginBottom: 8,
                fontSize: 15,
                fontWeight: 700,
                color: "#1E40AF"
              }}>
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escribe un título claro y descriptivo"
                maxLength={150}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#374151",
                  boxSizing: "border-box"
                }}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: "#6B7280", fontWeight: 600, textAlign: "right" }}>
                {title.length}/150
              </div>
            </div>

            {/* Topic */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block",
                marginBottom: 8,
                fontSize: 15,
                fontWeight: 700,
                color: "#1E40AF"
              }}>
                Categoría
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#374151",
                  cursor: "pointer",
                  boxSizing: "border-box"
                }}
              >
                <option value="">Selecciona una categoría</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.icon} {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block",
                marginBottom: 8,
                fontSize: 15,
                fontWeight: 700,
                color: "#1E40AF"
              }}>
                Etiquetas (máx. 5)
              </label>
              
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: "6px 12px",
                      background: "#0F62FE",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Agregar etiqueta"
                  disabled={selectedTags.length >= 5}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    fontSize: 14,
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    border: "2px solid rgba(255, 255, 255, 0.6)",
                    borderRadius: 10,
                    background: "rgba(255, 255, 255, 0.6)",
                    color: "#374151",
                    boxSizing: "border-box"
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTagInput.trim() || selectedTags.length >= 5}
                  style={{
                    padding: "10px 20px",
                    background: newTagInput.trim() && selectedTags.length < 5 ? "#0F62FE" : "#9CA3AF",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: newTagInput.trim() && selectedTags.length < 5 ? "pointer" : "not-allowed",
                    fontFamily: "Montserrat, sans-serif"
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ 
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1E40AF"
                }}>
                  Contenido
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0F62FE",
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif"
                  }}
                >
                  {showPreview ? "Editar" : "Vista Previa"}
                </button>
              </div>

              {!showPreview ? (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Describe tu pregunta o idea en detalle. Usa texto plano o Markdown."
                  required
                  style={{
                    width: "100%",
                    minHeight: 300,
                    padding: 16,
                    fontSize: 15,
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    lineHeight: 1.7,
                    border: "2px solid rgba(255, 255, 255, 0.6)",
                    borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.6)",
                    color: "#374151",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  minHeight: 300,
                  padding: 16,
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                  lineHeight: 1.7,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#374151",
                  boxSizing: "border-box",
                  whiteSpace: "pre-wrap"
                }}>
                  {body || <span style={{ color: "#9CA3AF" }}>La vista previa aparecerá aquí...</span>}
                </div>
              )}
            </div>

            {/* Tips */}
            <div style={{
              padding: 20,
              background: "rgba(59, 130, 246, 0.1)",
              borderRadius: 12,
              border: "1px solid rgba(59, 130, 246, 0.2)",
              marginBottom: 24
            }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 700, 
                color: "#1E40AF",
                marginBottom: 8 
              }}>
                Consejos:
              </div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: 20,
                fontSize: 13,
                color: "#374151",
                lineHeight: 1.8,
                fontWeight: 600
              }}>
                <li>Usa un título específico y claro</li>
                <li>Explica el contexto y detalles</li>
                <li>Sé respetuoso con la comunidad</li>
                <li>Solo texto - no imágenes ni archivos</li>
                <li>No compartas información personal</li>
              </ul>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={submitting || !title.trim() || !body.trim() || !selectedTopicId}
                style={{
                  padding: "14px 28px",
                  background: submitting || !title.trim() || !body.trim() || !selectedTopicId
                    ? "#9CA3AF" 
                    : "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: submitting || !title.trim() || !body.trim() || !selectedTopicId 
                    ? "not-allowed" 
                    : "pointer",
                  boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                  fontFamily: "Montserrat, sans-serif"
                }}
              >
                {submitting ? "Publicando..." : "Publicar Tema"}
              </button>

              <Link
                href="/forum"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "14px 28px",
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#374151",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif"
                }}
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

