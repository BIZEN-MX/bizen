"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import PageLoader from "@/components/PageLoader"

interface Report {
  id: string
  targetType: string
  targetId: string
  reason: string
  details: string | null
  status: string
  createdAt: string
  reporter: {
    nickname: string
  }
  thread?: {
    title: string
  }
  comment?: {
    body: string
  }
}

export default function ModerationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [filter, setFilter] = useState<'open' | 'reviewing' | 'closed' | 'all'>('open')
  const [loadingData, setLoadingData] = useState(true)
  const [isModerator, setIsModerator] = useState(false)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
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
      window.open("/login", "_blank")
      return
    }
    checkModeratorAccess()
  }, [user, loading, router, filter])

  const checkModeratorAccess = async () => {
    try {
      const response = await fetch('/api/forum/moderation')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports)
        setIsModerator(true)
        setLoadingData(false)
      } else if (response.status === 403) {
        setIsModerator(false)
        setLoadingData(false)
      }
    } catch (error) {
      console.error("Error:", error)
      setLoadingData(false)
    }
  }

  const handleAction = async (reportId: string, action: 'approve' | 'hide' | 'delete' | 'close') => {
    try {
      const response = await fetch(`/api/forum/moderation/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        await checkModeratorAccess()
      }
    } catch (error) {
      console.error("Error taking action:", error)
    }
  }

  if (loading || loadingData) {
    return <PageLoader />
  }

  if (!user) return null

  if (!isModerator) {
    return (
      <div style={{
        display: "grid",
        placeItems: "center",
        minHeight: "60vh",
        padding: 40
      }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
          <h2 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 500, color: "#1E40AF" }}>
            Acceso Denegado
          </h2>
          <p style={{ margin: "0 0 24px", color: "#374151", fontSize: 15, fontWeight: 500 }}>
            Esta página es solo para moderadores y administradores
          </p>
          <Link href="/forum" style={{
            padding: "14px 24px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            borderRadius: 12,
            fontWeight: 500,
            textDecoration: "none",
            fontSize: 15,
            display: "inline-block"
          }}>
            Volver al Foro
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      background: "#FBFAF5",
      backgroundAttachment: "fixed"
    }}>
      <main style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 500, color: "#1E40AF" }}>
          Panel de Moderación
        </h1>
        <p style={{ margin: "0 0 32px", color: "#374151", fontSize: 15, fontWeight: 500 }}>
          Gestiona reportes y contenido de la comunidad
        </p>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(['open', 'reviewing', 'closed', 'all'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "8px 16px",
                background: filter === status ? "#0F62FE" : "rgba(255, 255, 255, 0.6)",
                color: filter === status ? "white" : "#374151",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {status === 'all' ? 'Todos' : status === 'open' ? 'Abiertos' : status === 'reviewing' ? 'En revisión' : 'Cerrados'}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reports.filter(r => filter === 'all' || r.status === filter).map(report => (
            <div
              key={report.id}
              style={{
                padding: 24,
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: "2px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)"
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                  <div>
                    <span style={{
                      padding: "4px 10px",
                      background: report.status === 'open' ? "#EF4444" : report.status === 'reviewing' ? "#F59E0B" : "#10B981",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 500,
                      borderRadius: 6,
                      marginRight: 8
                    }}>
                      {report.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#1E40AF" }}>
                      {report.targetType === 'thread' ? 'Tema' : report.targetType === 'comment' ? 'Comentario' : 'Usuario'}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>
                    {new Date(report.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 4 }}>
                    Razón: {report.reason}
                  </div>
                  {report.details && (
                    <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
                      {report.details}
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, marginTop: 8 }}>
                    Reportado por: {report.reporter.nickname}
                  </div>
                </div>

                {/* Content Preview */}
                {report.thread && (
                  <div style={{
                    padding: 16,
                    background: "rgba(255, 255, 255, 0.4)",
                    borderRadius: 10,
                    marginBottom: 16
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#1E40AF", marginBottom: 4 }}>
                      {report.thread.title}
                    </div>
                  </div>
                )}

                {report.comment && (
                  <div style={{
                    padding: 16,
                    background: "rgba(255, 255, 255, 0.4)",
                    borderRadius: 10,
                    marginBottom: 16
                  }}>
                    <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                      {report.comment.body.substring(0, 200)}...
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {report.status === 'open' && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleAction(report.id, 'approve')}
                    style={{
                      padding: "10px 16px",
                      background: "#10B981",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'hide')}
                    style={{
                      padding: "10px 16px",
                      background: "#F59E0B",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Ocultar
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'delete')}
                    style={{
                      padding: "10px 16px",
                      background: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'close')}
                    style={{
                      padding: "10px 16px",
                      background: "rgba(255, 255, 255, 0.6)",
                      color: "#374151",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cerrar Reporte
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {reports.filter(r => filter === 'all' || r.status === filter).length === 0 && (
          <div style={{
            padding: "60px 24px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 500, color: "#1E40AF" }}>
              No hay reportes {filter !== 'all' && filter}
            </h3>
          </div>
        )}
      </main>
    </div>
  )
}

