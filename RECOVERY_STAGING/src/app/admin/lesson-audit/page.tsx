"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Flame, CheckCircle, XCircle, AlertTriangle, BookOpen } from "lucide-react"
import PageLoader from "@/components/PageLoader"

interface AuditSummary {
  totalDeclared: number
  validCount: number
  missingCount: number
}

interface AuditTopic {
  topicNum: number
  topicName: string
  totalDeclared: number
  missing: string[]
  valid: string[]
}

export default function LessonAuditPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [summary, setSummary] = useState<AuditSummary | null>(null)
  const [topics, setTopics] = useState<AuditTopic[]>([])
  const [loadingAudit, setLoadingAudit] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }

    const fetchAudit = async () => {
      try {
        setLoadingAudit(true)
        const res = await fetch("/api/admin/lesson-audit")
        const data = await res.json()
        if (data.summary && data.topics) {
          setSummary(data.summary)
          setTopics(data.topics)
        }
      } catch (err) {
        console.error("Failed to fetch audit: ", err)
      } finally {
        setLoadingAudit(false)
      }
    }

    fetchAudit()
  }, [user, loading, router])

  if (loading || loadingAudit) return <PageLoader />
  if (!user) return null

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 12 }}>
          <BookOpen color="#0F62FE" size={36} /> Auditoría de Lecciones
        </h1>
        <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 16 }}>
          Revisa el estado de todas las lecciones declaradas en el roadmap versus los archivos reales existentes.
        </p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
          <div style={{ padding: 24, background: "white", borderRadius: 24, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={28} color="#64748b" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Declaradas</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>{summary.totalDeclared}</div>
            </div>
          </div>
          
          <div style={{ padding: 24, background: "white", borderRadius: 24, border: "1px solid #bbf7d0", boxShadow: "0 10px 30px rgba(22,163,74,0.05)", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={28} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em" }}>Válidas (Existen)</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#15803d", marginTop: 4 }}>{summary.validCount}</div>
            </div>
          </div>

          <div style={{ padding: 24, background: "white", borderRadius: 24, border: summary.missingCount > 0 ? "1px solid #fecdd3" : "1px solid #e2e8f0", boxShadow: summary.missingCount > 0 ? "0 10px 30px rgba(225,29,72,0.05)" : "0 10px 30px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: summary.missingCount > 0 ? "#ffe4e6" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {summary.missingCount > 0 ? <XCircle size={28} color="#e11d48" /> : <CheckCircle size={28} color="#cbd5e1" />}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: summary.missingCount > 0 ? "#e11d48" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Faltantes / Rotos</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: summary.missingCount > 0 ? "#be123c" : "#cbd5e1", marginTop: 4 }}>{summary.missingCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Topics */}
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Desglose por Misión</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {topics.map((t) => (
          <div key={t.topicNum} style={{ padding: 24, background: "white", borderRadius: 20, border: "1.5px solid #f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0F62FE", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                  Misión {t.topicNum}
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{t.topicName}</h3>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {t.totalDeclared === 0 ? (
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", padding: "6px 12px", borderRadius: 99 }}>Vacío</span>
                ) : t.missing.length === 0 ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "6px 12px", borderRadius: 99 }}>
                    <CheckCircle size={16} /> 100% Completo ({t.valid.length})
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#e11d48", background: "#ffe4e6", padding: "6px 12px", borderRadius: 99 }}>
                    <AlertTriangle size={16} /> Faltan {t.missing.length} de {t.totalDeclared}
                  </span>
                )}
              </div>
            </div>

            {t.missing.length > 0 && (
              <div style={{ padding: 16, background: "#fff1f2", borderRadius: 12, border: "1px dashed #fecaca" }}>
                <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#be123c" }}>⚠️ Archivos detectados como faltantes:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {t.missing.map(m => (
                    <span key={m} style={{ fontSize: 12, fontWeight: 600, color: "#9f1239", background: "#ffe4e6", padding: "4px 8px", borderRadius: 6, fontFamily: "monospace" }}>
                      lesson-{m}.ts
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {t.valid.length > 0 && t.missing.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <details style={{ cursor: "pointer" }}>
                  <summary style={{ fontSize: 13, fontWeight: 600, color: "#64748b", outline: "none" }}>Ver archivos válidos ({t.valid.length})</summary>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {t.valid.map(v => (
                      <span key={v} style={{ fontSize: 12, fontWeight: 500, color: "#475569", background: "#f8fafc", padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontFamily: "monospace" }}>
                        lesson-{v}.ts
                      </span>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
