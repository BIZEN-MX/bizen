"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface StepData {
  id: string
  title: string
  description: string | null
  goal: string | null
  order: number
  lab_tracks: {
    title: string
    key: string
  }
  checklists: Array<{
    id: string
    text: string
    done: boolean
    order: number
  }>
  artifacts: Array<{
    id: string
    type: string
    title: string
    content: string | null
    url: string | null
    created_at: string
  }>
  experiments: Array<any>
  progress: {
    is_completed: boolean
  } | null
}

export default function StepDetailPage() {
  const params = useParams()
  const router = useRouter()
  const stepId = params.id as string
  
  const [stepData, setStepData] = useState<StepData | null>(null)
  const [loading, setLoading] = useState(true)
  const [newChecklistText, setNewChecklistText] = useState("")
  const [showArtifactDialog, setShowArtifactDialog] = useState(false)
  const [newArtifact, setNewArtifact] = useState({
    title: "",
    type: "note",
    content: ""
  })

  useEffect(() => {
    fetchStepData()
  }, [stepId])

  const fetchStepData = async () => {
    try {
      const response = await fetch(`/api/lab/steps/${stepId}`)
      if (!response.ok) {
        if (response.status === 401) {
          window.open("/login", "_blank")
          return
        }
        throw new Error("Failed to fetch step")
      }
      const data = await response.json()
      setStepData(data.data)
    } catch (error) {
      console.error("Error fetching step:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleChecklist = async (id: string, currentDone: boolean) => {
    try {
      await fetch("/api/lab/checklists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: !currentDone })
      })
      fetchStepData()
    } catch (error) {
      console.error("Error toggling checklist:", error)
    }
  }

  const addChecklist = async () => {
    if (!newChecklistText.trim()) return
    
    try {
      await fetch("/api/lab/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_id: stepId,
          text: newChecklistText,
          order: stepData?.checklists.length || 0
        })
      })
      setNewChecklistText("")
      fetchStepData()
    } catch (error) {
      console.error("Error adding checklist:", error)
    }
  }

  const saveArtifact = async () => {
    if (!newArtifact.title.trim()) return
    
    try {
      await fetch("/api/lab/artifacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_id: stepId,
          ...newArtifact
        })
      })
      setNewArtifact({ title: "", type: "note", content: "" })
      setShowArtifactDialog(false)
      fetchStepData()
    } catch (error) {
      console.error("Error saving artifact:", error)
    }
  }

  const markStepComplete = async () => {
    const allChecklistsDone = stepData?.checklists.every(c => c.done) ?? false
    if (!allChecklistsDone) {
      alert("Por favor completa todos los items de la checklist primero")
      return
    }
    
    alert("¡Paso completado! Avanzando al siguiente...")
    router.push(`/business-lab/track/${stepData?.lab_tracks.key}`)
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#ffffff",
        marginRight: "320px"
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 16, fontFamily: "Montserrat, sans-serif" }}>
            Cargando paso...
          </p>
        </div>
      </div>
    )
  }

  if (!stepData) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#ffffff",
        marginRight: "320px",
        fontFamily: "Montserrat, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Paso no encontrado</h2>
          <Link href="/business-lab">
            <button style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer"
            }}>
              Volver al Lab
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const allChecklistsDone = stepData.checklists.every(c => c.done)
  const isCompleted = stepData.progress?.is_completed || false

  return (
    <>
      <main style={{
        marginRight: "320px",
        minHeight: "100vh",
        background: "#ffffff",
        padding: "40px",
        paddingRight: "360px",
        fontFamily: "Montserrat, sans-serif",
        width: "100%",
        boxSizing: "border-box" as const,
        overflowX: "hidden",
        overflowY: "visible"
      }}>
      {/* Back Button */}
      <button 
        onClick={() => router.push(`/business-lab/track/${stepData.lab_tracks.key}`)}
        style={{
          padding: "8px 16px",
          background: "white",
          border: "2px solid #E5E7EB",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
          cursor: "pointer",
          marginBottom: 24,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0B71FE"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E7EB"}
      >
        ← Volver a {stepData.lab_tracks.title}
      </button>

        {/* Step Header */}
        <div style={{ marginBottom: 32, width: "100%" }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            marginBottom: 12,
            color: "#111"
          }}>
            {stepData.order}. {stepData.title}
          </h1>
          {stepData.description && (
            <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 16, lineHeight: 1.6 }}>
              {stepData.description}
            </p>
          )}
          {stepData.goal && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#ffffff",
              color: "#1E40AF",
              padding: "10px 20px",
              borderRadius: 24,
              fontSize: 14,
              fontWeight: 600
            }}>
              🎯 <span>Objetivo:</span> {stepData.goal}
            </div>
          )}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          gap: 24,
          width: "100%"
        }}>
          {/* Main Content */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
            {/* Checklist */}
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #E5E7EB",
              width: "100%"
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 }}>
                Checklist
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
                Completa estos items para avanzar
              </p>
              
              <div style={{ marginBottom: 20 }}>
                {stepData.checklists.map((item) => (
                  <div key={item.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: "1px solid #F3F4F6"
                  }}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklist(item.id, item.done)}
                      style={{
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        accentColor: "#0B71FE"
                      }}
                    />
                    <span style={{
                      fontSize: 15,
                      color: item.done ? "#9CA3AF" : "#374151",
                      textDecoration: item.done ? "line-through" : "none"
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Agregar nuevo item..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addChecklist()}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none"
                  }}
                />
                <button onClick={addChecklist} style={{
                  padding: "10px 16px",
                  background: "#0B71FE",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer"
                }}>
                  +
                </button>
              </div>
            </div>

            {/* Artifacts */}
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #E5E7EB",
              width: "100%"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 4 }}>
                    Mis Artefactos
                  </h2>
                  <p style={{ fontSize: 14, color: "#6B7280" }}>
                    Outputs y documentos que has creado
                  </p>
                </div>
                <button onClick={() => setShowArtifactDialog(true)} style={{
                  padding: "8px 16px",
                  background: "#0B71FE",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  + Nuevo
                </button>
              </div>
              
              {stepData.artifacts.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 0", fontSize: 14 }}>
                  Aún no has creado ningún artefacto. Usa las herramientas AI o crea uno manualmente.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {stepData.artifacts.map((artifact) => (
                    <div key={artifact.id} style={{
                      padding: 16,
                      background: "#F9FAFB",
                      borderRadius: 12,
                      border: "1px solid #E5E7EB"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 18 }}>
                          {artifact.type === "canvas" ? "📊" : artifact.type === "persona" ? "👤" : "📝"}
                        </span>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>
                          {artifact.title}
                        </h3>
                      </div>
                      {artifact.content && (
                        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>
                          {artifact.content.substring(0, 150)}...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mark Complete */}
            {allChecklistsDone && !isCompleted && (
              <div style={{
                background: "#D1FAE5",
                borderRadius: 16,
                padding: 24,
                border: "2px solid #6EE7B7",
                boxShadow: "0 2px 12px rgba(16,185,129,0.15)",
                width: "100%"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#065F46" }}>
                      ¿Listo para continuar?
                    </h3>
                    <p style={{ fontSize: 14, color: "#047857" }}>
                      Has completado todos los items. Marca este paso como completado.
                    </p>
                  </div>
                  <button onClick={markStepComplete} style={{
                    padding: "12px 24px",
                    background: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}>
                    Marcar Completo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
            {/* AI Helpers */}
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #E9D5FF"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#7C3AED" }}>
                  Herramientas AI
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                Asistentes inteligentes para este paso
              </p>
              
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                <button onClick={() => alert("AI Helper en desarrollo")} style={{
                  padding: "10px 16px",
                  background: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED"
                  e.currentTarget.style.background = "#F5F3FF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB"
                  e.currentTarget.style.background = "white"
                }}
                >
                  Refinar Idea
                </button>
                <button onClick={() => alert("AI Helper en desarrollo")} style={{
                  padding: "10px 16px",
                  background: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED"
                  e.currentTarget.style.background = "#F5F3FF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB"
                  e.currentTarget.style.background = "white"
                }}
                >
                  Generar Entrevista
                </button>
                <button onClick={() => alert("AI Helper en desarrollo")} style={{
                  padding: "10px 16px",
                  background: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED"
                  e.currentTarget.style.background = "#F5F3FF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB"
                  e.currentTarget.style.background = "white"
                }}
                >
                  Crear Lean Canvas
                </button>
              </div>
            </div>

            {/* Ask Forum */}
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #e5e7eb"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>💬</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E40AF" }}>
                  ¿Necesitas ayuda?
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
                Pregunta a la comunidad sobre este paso
              </p>
              <Link href={`/forum/new?context=business-lab-step-${stepId}`}>
                <button style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "white",
                  border: "1px solid #0B71FE",
                  color: "#0B71FE",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0B71FE"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.color = "#0B71FE"
                }}
                >
                  Preguntar en el Foro
                </button>
              </Link>
            </div>

            {/* Templates */}
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #E5E7EB"
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 12 }}>
                📄 Templates
              </h3>
              <Link href="/business-lab/templates">
                <button style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "white",
                  border: "1px solid #E5E7EB",
                  color: "#374151",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0B71FE"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E7EB"}
                >
                  Ver Templates
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Artifact Dialog */}
        {showArtifactDialog && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20
          }}
          onClick={() => setShowArtifactDialog(false)}
          >
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 32,
              maxWidth: 500,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                Crear Nuevo Artefacto
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
                Guarda tu trabajo, ideas o documentos relacionados con este paso
              </p>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Título
                </label>
                <input
                  type="text"
                  value={newArtifact.title}
                  onChange={(e) => setNewArtifact({...newArtifact, title: e.target.value})}
                  placeholder="Ej: Mi Lean Canvas v1"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Tipo
                </label>
                <select
                  value={newArtifact.type}
                  onChange={(e) => setNewArtifact({...newArtifact, type: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none"
                  }}
                >
                  <option value="note">Nota</option>
                  <option value="canvas">Canvas</option>
                  <option value="persona">Persona</option>
                  <option value="experiment">Experimento</option>
                  <option value="pitch">Pitch</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Contenido
                </label>
                <textarea
                  value={newArtifact.content}
                  onChange={(e) => setNewArtifact({...newArtifact, content: e.target.value})}
                  placeholder="Escribe tu contenido aquí..."
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical" as const,
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button onClick={() => setShowArtifactDialog(false)} style={{
                  padding: "10px 20px",
                  background: "white",
                  border: "1px solid #E5E7EB",
                  color: "#374151",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer"
                }}>
                  Cancelar
                </button>
                <button onClick={saveArtifact} style={{
                  padding: "10px 20px",
                  background: "#0B71FE",
                  border: "none",
                  color: "white",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer"
                }}>
                  Guardar Artefacto
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

    </>
  )
}
