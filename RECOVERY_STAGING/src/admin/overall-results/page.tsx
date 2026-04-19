"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart2, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react"

type ModuleBreakdown = {
  moduleId: number
  score: number
  totalQuestions: number
  percentage: number
  completed: boolean
}

type UserResult = {
  userId: string
  email: string
  userName: string
  totalQuizzes: number
  overallScore: number
  totalQuestions: number
  overallPercentage: number
  completedModules: number
  moduleBreakdown: ModuleBreakdown[]
}

export default function OverallResultsAdmin() {
  const router = useRouter()
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    try {
      const response = await fetch("/api/admin/overall-results")
      
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

  function getPerformanceColor(percentage: number) {
    if (percentage >= 80) return "#16a34a" // green
    if (percentage >= 60) return "#ea580c" // orange
    return "#dc2626" // red
  }

  function getPerformanceText(percentage: number) {
    if (percentage >= 80) return "Excelente"
    if (percentage >= 60) return "Bueno"
    return "Necesita mejorar"
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
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
          <Loader2 size={40} className="animate-spin" />
        </div>
        <div>Cargando resultados generales...</div>
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
      <div style={{ textAlign: "center", color: "#dc2626" }}>
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
          <XCircle size={40} />
        </div>
        <div>Error: {error}</div>
      </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page-root" style={{ 
      minHeight: "100vh", 
      background: "#f8fafc",
      fontFamily: "inherit"
    }}>
      <style>{`
        .admin-page-root { padding-left: 280px !important; }
        @media (max-width: 1160px) { .admin-page-root { padding-left: 220px !important; } }
        @media (max-width: 767px) { .admin-page-root { padding-left: 0 !important; padding-bottom: 100px !important; } }
      `}</style>
      <div style={{ padding: "clamp(24px, 4vw, 48px)", maxWidth: 1600, margin: "0 auto", boxSizing: "border-box" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 500, display: "flex", alignItems: "center", gap: 12 }}>
                <BarChart2 size={32} color="#0F62FE" /> Resultados Generales - Todos los Módulos
              </h1>
              <p style={{ margin: "8px 0 0 0", fontSize: 16, color: "#64748b" }}>
                Vista general del desempeño de todos los estudiantes
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

          {/* Summary Stats */}
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
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Total Estudiantes</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#0F62FE" }}>
                {results.length}
              </div>
            </div>
            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Promedio General</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#16a34a" }}>
                {results.length > 0 
                  ? Math.round(results.reduce((acc, r) => acc + r.overallPercentage, 0) / results.length)
                  : 0}%
              </div>
            </div>
            <div style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Total Quizzes</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#ea580c" }}>
                {results.reduce((acc, r) => acc + r.totalQuizzes, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12 }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center", color: "#64748b" }}>
              <FileText size={48} />
            </div>
            <div style={{ fontSize: 18, color: "#64748b" }}>No hay resultados disponibles</div>
          </div>
        ) : (
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden"
          }}>
            {results.map((user) => (
              <div key={user.userId}>
                <div
                  style={{
                    padding: "20px 24px",
                    borderBottom: expandedRow === user.userId ? "2px solid #0F62FE" : "1px solid #e5e7eb",
                    background: expandedRow === user.userId ? "#f0f9ff" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setExpandedRow(expandedRow === user.userId ? null : user.userId)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${getPerformanceColor(user.overallPercentage)}, ${getPerformanceColor(user.overallPercentage)}dd)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#fff",
                    }}>
                      {user.overallPercentage}%
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                        {user.userName} ({user.email})
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        {user.totalQuizzes} quizzes • {user.completedModules}/6 módulos completados
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "#64748b" }}>Total</div>
                      <div style={{ fontSize: 16, fontWeight: 500 }}>
                        {user.overallScore}/{user.totalQuestions}
                      </div>
                    </div>
                    <div style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: getPerformanceColor(user.overallPercentage),
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 500,
                    }}>
                      {getPerformanceText(user.overallPercentage)}
                    </div>
                    <div style={{ fontSize: 20, color: "#cbd5e1" }}>
                      {expandedRow === user.userId ? "▲" : "▼"}
                    </div>
                  </div>
                </div>
                
                {expandedRow === user.userId && (
                  <div style={{
                    padding: "24px",
                    background: "#f8fafc",
                    borderTop: "2px solid #e5e7eb"
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>
                      Desglose por Módulo
                    </div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 16
                    }}>
                      {user.moduleBreakdown.map((module) => (
                        <div
                          key={module.moduleId}
                          style={{
                            background: "#fff",
                            padding: 16,
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            borderLeft: `4px solid ${getPerformanceColor(module.percentage)}`,
                          }}
                        >
                          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                            Módulo {module.moduleId}
                          </div>
                          <div style={{ fontSize: 24, fontWeight: 500, color: getPerformanceColor(module.percentage), marginBottom: 4 }}>
                            {module.percentage}%
                          </div>
                          {module.totalQuestions > 0 && (
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              {module.score}/{module.totalQuestions} correctas
                            </div>
                          )}
                          {module.totalQuestions === 0 && module.completed && (
                            <div style={{ fontSize: 12, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                              <CheckCircle2 size={14} /> Completado
                            </div>
                          )}
                          {module.totalQuestions === 0 && !module.completed && (
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              Sin quizzes
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
