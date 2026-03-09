"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type QuizResult = {
  id: number
  userId: string
  email: string
  userName: string
  score: number
  totalQuestions: number
  scorePct: number
  completedAt: string
  answersData: string
}

export default function QuizResultsAdmin() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    try {
      const response = await fetch("/api/admin/quiz-results")
      
      if (response.status === 401) {
        window.open("/login", "_blank")
        return
      }

      if (response.status === 403) {
        setError("Acceso denegado - Solo administradores pueden ver esta página")
        return
      }

      if (!response.ok) {
        throw new Error("Error al cargar resultados")
      }

      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(scorePct: number) {
    if (scorePct >= 80) return "#16a34a" // green
    if (scorePct >= 60) return "#ea580c" // orange
    return "#dc2626" // red
  }

  function getStatusText(scorePct: number) {
    if (scorePct >= 80) return "Competente"
    if (scorePct >= 60) return "En progreso"
    return "Necesita mejorar"
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  async function deleteUserData(userId: string, userEmail: string) {
    if (!confirm(`¿Estás seguro de que quieres eliminar todos los datos de ${userEmail}?\n\nEsto incluye:\n- Resultados del quiz diagnóstico\n- Todos los quizzes de módulos\n- Progreso de secciones\n- Visitas de páginas\n\nEsta acción NO SE PUEDE DESHACER.`)) {
      return
    }

    setDeletingUserId(userId)
    try {
      const response = await fetch('/api/admin/delete-user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ Datos de ${userEmail} eliminados correctamente`)
        // Refresh the results
        fetchResults()
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      alert(`❌ Error al eliminar: ${err}`)
    } finally {
      setDeletingUserId(null)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f8fafc" 
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
          <div>Cargando resultados...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f8fafc" 
      }}>
        <div style={{ textAlign: "center", color: "#dc2626" }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>❌</div>
          <div>Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f8fafc",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 500 }}>
                📊 Resultados del Quiz Diagnóstico
              </h1>
              <p style={{ margin: "8px 0 0 0", fontSize: 16, color: "#64748b" }}>
                Total de estudiantes: {results.length}
              </p>
            </div>
            <button
              onClick={() => router.push("/modules/menu")}
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                background: "#0F62FE",
                color: "#fff",
                border: "none",
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              ← Volver al Menú
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: 20,
            marginTop: 24
          }}>
            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Promedio General</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#0F62FE" }}>
                {results.length > 0 
                  ? Math.round(results.reduce((acc, r) => acc + r.scorePct, 0) / results.length)
                  : 0}%
              </div>
            </div>
            
            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Competentes (≥80%)</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#16a34a" }}>
                {results.filter(r => r.scorePct >= 80).length}
              </div>
            </div>

            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>En Progreso (60-79%)</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#ea580c" }}>
                {results.filter(r => r.scorePct >= 60 && r.scorePct < 80).length}
              </div>
            </div>

            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Necesita Mejorar (&lt;60%)</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#dc2626" }}>
                {results.filter(r => r.scorePct < 60).length}
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500, fontSize: 14 }}>Estudiante</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500, fontSize: 14 }}>Email</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Correctas</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Porcentaje</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Estado</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500, fontSize: 14 }}>Fecha</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Detalles</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                      No hay resultados aún
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <React.Fragment key={result.id}>
                      <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "16px", fontSize: 14 }}>
                          {result.userName}
                        </td>
                        <td style={{ padding: "16px", fontSize: 14, color: "#64748b" }}>
                          {result.email}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center", fontSize: 16, fontWeight: 500 }}>
                          {result.score} / {result.totalQuestions}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: 6,
                            fontSize: 16,
                            fontWeight: 500,
                            background: `${getStatusColor(result.scorePct)}20`,
                            color: getStatusColor(result.scorePct)
                          }}>
                            {result.scorePct}%
                          </span>
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <span style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: getStatusColor(result.scorePct)
                          }}>
                            {getStatusText(result.scorePct)}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontSize: 14, color: "#64748b" }}>
                          {formatDate(result.completedAt)}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <button
                            onClick={() => setExpandedRow(expandedRow === result.id ? null : result.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              background: "#f1f5f9",
                              border: "1px solid #e2e8f0",
                              fontSize: 14,
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
                          >
                            {expandedRow === result.id ? "Ocultar ▲" : "Ver ▼"}
                          </button>
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <button
                            onClick={() => deleteUserData(result.userId, result.email)}
                            disabled={deletingUserId === result.userId}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              background: deletingUserId === result.userId ? "#fca5a5" : "#fee2e2",
                              border: "1px solid #fecaca",
                              color: "#991b1b",
                              fontSize: 14,
                              fontWeight: 500,
                              cursor: deletingUserId === result.userId ? "not-allowed" : "pointer",
                              transition: "background 0.2s",
                              opacity: deletingUserId === result.userId ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (deletingUserId !== result.userId) {
                                e.currentTarget.style.background = "#fecaca"
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (deletingUserId !== result.userId) {
                                e.currentTarget.style.background = "#fee2e2"
                              }
                            }}
                          >
                            {deletingUserId === result.userId ? "Eliminando..." : "🗑️ Eliminar"}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === result.id && (
                        <tr>
                          <td colSpan={8} style={{ padding: 20, background: "#f8fafc" }}>
                            <div style={{ maxHeight: 400, overflowY: "auto" }}>
                              <h4 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 500 }}>
                                Respuestas Detalladas
                              </h4>
                              {(() => {
                                try {
                                  const answers = JSON.parse(result.answersData)
                                  return (
                                    <div style={{ display: "grid", gap: 12 }}>
                                      {answers.map((answer: any, idx: number) => (
                                        <div
                                          key={idx}
                                          style={{
                                            padding: 12,
                                            background: "#fff",
                                            borderRadius: 8,
                                            borderLeft: `4px solid ${answer.isCorrect ? "#16a34a" : "#dc2626"}`
                                          }}
                                        >
                                          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                                            Pregunta {answer.qid} - {answer.isCorrect ? "✓ Correcta" : "✗ Incorrecta"}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                } catch (e) {
                                  return <div>Error al cargar respuestas</div>
                                }
                              })()}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

