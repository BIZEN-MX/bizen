"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type QuizAnswer = {
  id: number
  questionIndex: number
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

type QuizResult = {
  id: number
  userId: string
  email: string
  userName: string
  moduleId: number
  sectionId: number
  pageNumber: number
  quizType: string
  score: number
  totalQuestions: number
  scorePct: number
  completedAt: string
  answers: QuizAnswer[]
}

export default function ModuleQuizResultsAdmin() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [filterModule, setFilterModule] = useState<number | "all">("all")
  const [filterSection, setFilterSection] = useState<number | "all">("all")
  const [filterUser, setFilterUser] = useState<string>("all")
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    try {
      const response = await fetch("/api/admin/module-quiz-results")
      
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
    if (scorePct >= 80) return "#16a34a"
    if (scorePct >= 60) return "#ea580c"
    return "#dc2626"
  }

  function getStatusText(scorePct: number) {
    if (scorePct >= 80) return "Excelente"
    if (scorePct >= 60) return "Bueno"
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
    if (!confirm(`¿Estás seguro de que quieres eliminar TODOS los datos de ${userEmail}?\n\nEsto incluye:\n- Resultados del quiz diagnóstico\n- Todos los quizzes de módulos\n- Progreso de secciones\n- Visitas de páginas\n\nEsta acción NO SE PUEDE DESHACER.`)) {
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

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(results.map(r => r.email))).sort()

  // Filter results
  const filteredResults = results.filter(r => {
    if (filterModule !== "all" && r.moduleId !== filterModule) return false
    if (filterSection !== "all" && r.sectionId !== filterSection) return false
    if (filterUser !== "all" && r.email !== filterUser) return false
    return true
  })

  // Calculate stats for filtered results
  const avgScore = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((acc, r) => acc + r.scorePct, 0) / filteredResults.length)
    : 0

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
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 500 }}>
                📚 Resultados de Quizzes por Módulo
              </h1>
              <p style={{ margin: "8px 0 0 0", fontSize: 16, color: "#64748b" }}>
                Total de intentos: {filteredResults.length} {filterModule !== "all" || filterSection !== "all" || filterUser !== "all" ? `(filtrados de ${results.length})` : ""}
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/admin/quiz-results"
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#0F62FE",
                  border: "2px solid #0F62FE",
                  textDecoration: "none",
                  fontSize: 16,
                  fontWeight: 500,
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                📊 Quiz Diagnóstico
              </Link>
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
          </div>

          {/* Filters */}
          <div style={{ 
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontWeight: 500 }}>Filtros:</div>
            
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value === "all" ? "all" : parseInt(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              <option value="all">Todos los módulos</option>
              {[1, 2, 3, 4, 5].map(m => (
                <option key={m} value={m}>Módulo {m}</option>
              ))}
            </select>

            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value === "all" ? "all" : parseInt(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              <option value="all">Todas las secciones</option>
              {[1, 2, 3].map(s => (
                <option key={s} value={s}>Sección {s}</option>
              ))}
            </select>

            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 14,
                cursor: "pointer",
                minWidth: 200
              }}
            >
              <option value="all">Todos los estudiantes</option>
              {uniqueUsers.map(email => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setFilterModule("all")
                setFilterSection("all")
                setFilterUser("all")
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Limpiar filtros
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: 20,
            marginTop: 24
          }}>
            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Promedio</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#0F62FE" }}>
                {avgScore}%
              </div>
            </div>
            
            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Excelentes (≥80%)</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#16a34a" }}>
                {filteredResults.filter(r => r.scorePct >= 80).length}
              </div>
            </div>

            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Buenos (60-79%)</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#ea580c" }}>
                {filteredResults.filter(r => r.scorePct >= 60 && r.scorePct < 80).length}
              </div>
            </div>

            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Necesita mejorar (&lt;60%)</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#dc2626" }}>
                {filteredResults.filter(r => r.scorePct < 60).length}
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
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Módulo</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Sección</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Página</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Tipo</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Correctas</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>%</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Estado</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500, fontSize: 14 }}>Fecha</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Detalles</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500, fontSize: 14 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                      No hay resultados {filterModule !== "all" || filterSection !== "all" || filterUser !== "all" ? "con los filtros seleccionados" : "aún"}
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result) => (
                    <React.Fragment key={result.id}>
                      <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "16px", fontSize: 14 }}>
                          <div style={{ fontWeight: 500 }}>{result.userName}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{result.email}</div>
                        </td>
                        <td style={{ padding: "16px", textAlign: "center", fontSize: 14, fontWeight: 500 }}>
                          M{result.moduleId}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center", fontSize: 14, fontWeight: 500 }}>
                          S{result.sectionId}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center", fontSize: 14 }}>
                          P{result.pageNumber}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center", fontSize: 12 }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: 4,
                            background: "#f1f5f9",
                            fontWeight: 500
                          }}>
                            {result.quizType}
                          </span>
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
                            {deletingUserId === result.userId ? "Eliminando..." : "🗑️"}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === result.id && (
                        <tr>
                          <td colSpan={11} style={{ padding: 20, background: "#f8fafc" }}>
                            <div style={{ maxHeight: 400, overflowY: "auto" }}>
                              <h4 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 500 }}>
                                Respuestas Detalladas
                              </h4>
                              <div style={{ display: "grid", gap: 12 }}>
                                {result.answers.map((answer) => (
                                  <div
                                    key={answer.id}
                                    style={{
                                      padding: 12,
                                      background: "#fff",
                                      borderRadius: 8,
                                      borderLeft: `4px solid ${answer.isCorrect ? "#16a34a" : "#dc2626"}`
                                    }}
                                  >
                                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                                      Pregunta {answer.questionIndex + 1} - {answer.isCorrect ? "✓ Correcta" : "✗ Incorrecta"}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
                                      {answer.questionText}
                                    </div>
                                    <div style={{ fontSize: 13 }}>
                                      <strong>Respuesta:</strong> {answer.userAnswer}
                                    </div>
                                    {!answer.isCorrect && (
                                      <div style={{ fontSize: 13, color: "#16a34a" }}>
                                        <strong>Correcta:</strong> {answer.correctAnswer}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
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

