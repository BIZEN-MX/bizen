"use client"

/**
 * Reto Diario — Daily challenge page.
 * Includes:
 *  1. Static challenge display
 *  2. "Daily Wrap" completion screen with 3 CTAs
 *  3. Evidence submission modal (4-field structured template)
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Target, CheckCircle, FileText, Users, Sparkles, X, ChevronRight, AlertCircle } from "lucide-react"

type DailyChallenge = {
  id: string
  title: string
  description: string
  challengeType: string
  activeDate: string
}

type EvidenceForm = {
  smartGoal: string
  didToday: string
  learned: string
  changeTomorrow: string
}

const LIMITS = { smartGoal: 180, didToday: 250, learned: 250, changeTomorrow: 250 }

export default function RetoDiarioPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [loadingChallenge, setLoadingChallenge] = useState(true)
  const [phase, setPhase] = useState<"doing" | "wrap">("doing")

  // Evidence modal
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  const [form, setForm] = useState<EvidenceForm>({ smartGoal: "", didToday: "", learned: "", changeTomorrow: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  // Quick reflection (30s)
  const [showReflection, setShowReflection] = useState(false)
  const [quickLearned, setQuickLearned] = useState("")

  useEffect(() => {
    const el = document.body
    el.style.background = "#f8fafc"
    return () => { el.style.background = "" }
  }, [])

  useEffect(() => {
    if (loading || !user) return
    fetchChallenge()
  }, [user, loading])

  const fetchChallenge = async () => {
    try {
      const res = await fetch("/api/daily-challenge/today")
      if (res.ok) setChallenge(await res.json())
    } catch (e) {
      console.error("Error fetching challenge:", e)
    } finally {
      setLoadingChallenge(false)
    }
  }

  const today = new Date()
  const dayName = today.toLocaleDateString("es-MX", { weekday: "long" })
  const dateStr = today.toLocaleDateString("es-MX", { day: "numeric", month: "long" })

  const handleCompletedClick = () => setPhase("wrap")

  const handleEvidenceSubmit = async () => {
    if (!challenge) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyChallengeId: challenge.id, ...form })
      })
      if (res.ok) {
        setSubmitted(true)
        setShowEvidenceModal(false)
      } else if (res.status === 409) {
        // Already submitted
        setSubmitted(true)
        setShowEvidenceModal(false)
      } else {
        const data = await res.json()
        setSubmitError(data.error || "Error al publicar")
      }
    } catch {
      setSubmitError("Error de conexión. Intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewGroup = () => {
    if (challenge) {
      router.push(`/forum?tab=reto-del-dia&challengeId=${challenge.id}`)
    } else {
      router.push("/forum?tab=reto-del-dia")
    }
  }

  const handleUseReflection = () => {
    setForm(f => ({ ...f, learned: quickLearned }))
    setShowReflection(false)
    setShowEvidenceModal(true)
  }

  const isFormValid = form.smartGoal.trim() && form.didToday.trim() && form.learned.trim() && form.changeTomorrow.trim()

  if (loading) return null

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .reto-diario-outer { margin-left: 0 !important; padding-bottom: 80px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .reto-diario-outer { margin-left: 220px !important; width: calc(100% - 220px) !important; }
        }
        @media (min-width: 1161px) {
          .reto-diario-outer { margin-left: 280px !important; width: calc(100% - 280px) !important; }
        }

        .reto-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.6;
          font-family: 'Montserrat', sans-serif;
          resize: vertical;
          outline: none;
          color: #0f172a;
          background: #fafafa;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .reto-textarea:focus { border-color: #0F62FE; background: white; }

        .wrap-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          border-radius: 14px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wrap-btn:hover { transform: translateY(-2px); }
        .wrap-btn:active { transform: translateY(0); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.4s ease both; }
        .fade-in-d1 { animation-delay: 0.05s; }
        .fade-in-d2 { animation-delay: 0.10s; }
        .fade-in-d3 { animation-delay: 0.15s; }
        .fade-in-d4 { animation-delay: 0.20s; }
      `}</style>

      <div
        className="reto-diario-outer"
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily: "'Montserrat', sans-serif",
          padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)",
          boxSizing: "border-box",
        }}
      >
        {/* ──────────── EVIDENCE MODAL ──────────── */}
        {showEvidenceModal && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "clamp(16px, 4vw, 40px)",
            backdropFilter: "blur(4px)"
          }}>
            <div style={{
              background: "white", borderRadius: 20, width: "100%", maxWidth: 560,
              maxHeight: "90vh", overflowY: "auto", padding: "clamp(24px, 4vw, 36px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)", boxSizing: "border-box"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                    Publicar Evidencia
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                    Comparte tu aprendizaje de hoy con tu grupo
                  </p>
                </div>
                <button onClick={() => setShowEvidenceModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94a3b8" }}>
                  <X size={22} />
                </button>
              </div>

              {submitError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 18, display: "flex", gap: 8, color: "#991b1b", fontSize: 13 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  {submitError}
                </div>
              )}

              {[
                { key: "smartGoal", label: "Mi objetivo SMART", placeholder: "Ej: Ahorrar $300 en 30 días reduciendo mis gastos en comida.", limit: LIMITS.smartGoal },
                { key: "didToday", label: "¿Qué hice hoy?", placeholder: "Ej: Revisé mis últimos 10 gastos y encontré que gasto $120 extras en delivery.", limit: LIMITS.didToday },
                { key: "learned", label: "¿Qué aprendí?", placeholder: "Ej: Que cocinar en casa puede ahorrarme hasta $1,000 al mes.", limit: LIMITS.learned },
                { key: "changeTomorrow", label: "¿Qué cambiaré mañana?", placeholder: "Ej: Prepararé mi comida antes de salir para evitar el delivery.", limit: LIMITS.changeTomorrow },
              ].map(({ key, label, placeholder, limit }, i) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label} <span style={{ color: "#ef4444" }}>*</span></label>
                    <span style={{ fontSize: 11, color: (form as any)[key].length > limit * 0.9 ? "#f59e0b" : "#94a3b8" }}>
                      {(form as any)[key].length}/{limit}
                    </span>
                  </div>
                  <textarea
                    className="reto-textarea"
                    rows={3}
                    placeholder={placeholder}
                    maxLength={limit}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setShowEvidenceModal(false)}
                  style={{ flex: 1, padding: "13px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 14, color: "#64748b", fontFamily: "'Montserrat', sans-serif" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEvidenceSubmit}
                  disabled={!isFormValid || submitting}
                  style={{
                    flex: 2, padding: "13px", background: isFormValid && !submitting ? "linear-gradient(135deg, #0F62FE, #2563EB)" : "#94a3b8",
                    color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: isFormValid && !submitting ? "pointer" : "not-allowed",
                    fontSize: 14, fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  {submitting ? "Publicando..." : "Publicar evidencia"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ──────────── QUICK REFLECTION MODAL ──────────── */}
        {showReflection && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 24,
            backdropFilter: "blur(4px)"
          }}>
            <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 440, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>⏱ Reflexión de 30 segundos</h2>
                <button onClick={() => setShowReflection(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <X size={20} />
                </button>
              </div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16, lineHeight: 1.6 }}>
                ¿Qué fue lo más importante que aprendiste hoy? (no más de 30 segundos)
              </p>
              <textarea
                className="reto-textarea"
                rows={4}
                placeholder="Ej: Aprendí que revisar mis gastos semanalmente me ayuda a detectar fugas de dinero antes de que se acumulen."
                value={quickLearned}
                maxLength={250}
                onChange={e => setQuickLearned(e.target.value)}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={() => setShowReflection(false)} style={{ flex: 1, padding: "11px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 13, color: "#64748b", fontFamily: "'Montserrat', sans-serif" }}>
                  Cerrar
                </button>
                {quickLearned.trim() && (
                  <button onClick={handleUseReflection} style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg, #0F62FE, #2563EB)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Montserrat', sans-serif" }}>
                    Usar para mi evidencia →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>

          {phase === "doing" && (
            <>
              {/* Hero header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: "linear-gradient(135deg, #0F62FE, #2563EB)",
                  boxShadow: "0 8px 20px rgba(15,98,254,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Target size={32} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                    Reto diario
                  </h1>
                  <p style={{ fontSize: 15, color: "#64748b", margin: 0, fontWeight: 500 }}>
                    Un pequeño desafío cada día para reforzar tus finanzas.
                  </p>
                </div>
              </div>

              {/* Challenge card */}
              <div className="fade-in" style={{
                background: "white", borderRadius: 20,
                border: "1.5px solid rgba(15,98,254,0.15)",
                padding: "clamp(24px, 4vw, 36px)", marginBottom: 24,
                boxShadow: "0 4px 20px rgba(15,98,254,0.08)"
              }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {dayName}, {dateStr}
                  </span>
                  <span style={{ padding: "4px 12px", background: "rgba(15,98,254,0.1)", color: "#0F62FE", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    ~5 min
                  </span>
                  {loadingChallenge && (
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Cargando...</span>
                  )}
                </div>

                <h2 style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: 800, color: "#0f172a", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
                  {challenge?.title ?? "Reto del día"}
                </h2>
                <p style={{ fontSize: "clamp(15px, 1.1rem, 17px)", color: "#334155", lineHeight: 1.65, margin: "0 0 28px" }}>
                  {challenge?.description ?? "Cargando descripción del reto de hoy..."}
                </p>

                {submitted ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 12, color: "#065f46" }}>
                    <CheckCircle size={20} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>¡Evidencia publicada! Tu grupo puede verla en el Foro.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCompletedClick}
                    className="wrap-btn"
                    style={{
                      padding: "14px 28px", fontSize: 15, color: "white",
                      background: "linear-gradient(135deg, #0F62FE, #2563EB)",
                      boxShadow: "0 6px 20px rgba(15,98,254,0.35)"
                    }}
                  >
                    <CheckCircle size={18} />
                    Completé el reto
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* Secondary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <div className="fade-in fade-in-d1" style={{ padding: 22, background: "rgba(254,243,199,0.7)", border: "1.5px solid rgba(251,191,36,0.25)", borderRadius: 18, display: "flex", gap: 14 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }} aria-hidden>💡</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Consejo del Experto</div>
                    <p style={{ fontSize: 14, color: "#78350F", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      Anota tu reflexión en tu cuaderno o notas. La constancia en pequeños pasos mejora tus hábitos financieros en semanas.
                    </p>
                  </div>
                </div>

                <div className="fade-in fade-in-d2" style={{ padding: 22, background: "white", border: "1.5px solid #f1f5f9", borderRadius: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Beneficios del Reto Diario</div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: 14, lineHeight: 1.8, fontWeight: 500 }}>
                    <li>Refuerza conceptos con práctica breve y constante.</li>
                    <li>Genera el hábito de revisar tus finanzas con frecuencia.</li>
                    <li>Pequeños pasos que evitan la procrastinación.</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* ──────────── DAILY WRAP SCREEN ──────────── */}
          {phase === "wrap" && (
            <div className="fade-in" style={{ textAlign: "center" }}>
              {/* Celebration header */}
              <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                borderRadius: 24, padding: "clamp(32px, 6vw, 56px) clamp(24px, 5vw, 48px)",
                marginBottom: 28, position: "relative", overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
              }}>
                <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-5%", width: "50%", height: "200%", background: "radial-gradient(circle, rgba(15,98,254,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "clamp(40px, 8vw, 64px)", marginBottom: 12 }} aria-hidden>🎉</div>
                  <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                    ¡Reto completado!
                  </h2>
                  <p style={{ fontSize: "clamp(14px, 1.2vw, 17px)", color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
                    Cada día que practicas es un paso hacia la libertad financiera. ¿Qué quieres hacer ahora?
                  </p>
                </div>
              </div>

              {/* 3 CTA Buttons */}
              <div style={{ display: "grid", gap: 14 }}>
                {/* Primary: Post evidence */}
                <button
                  className="wrap-btn fade-in fade-in-d1"
                  onClick={() => submitted ? null : setShowEvidenceModal(true)}
                  style={{
                    padding: "18px 28px", fontSize: 16, color: "white", width: "100%",
                    background: submitted ? "rgba(16,185,129,0.8)" : "linear-gradient(135deg, #0F62FE, #2563EB)",
                    boxShadow: submitted ? "0 4px 16px rgba(16,185,129,0.3)" : "0 6px 24px rgba(15,98,254,0.35)",
                    cursor: submitted ? "default" : "pointer"
                  }}
                >
                  <FileText size={20} />
                  {submitted ? "✓ Evidencia publicada" : "Publicar evidencia"}
                  {!submitted && <ChevronRight size={18} />}
                </button>

                {/* Secondary: View group feed */}
                <button
                  className="wrap-btn fade-in fade-in-d2"
                  onClick={handleViewGroup}
                  style={{
                    padding: "16px 28px", fontSize: 15, color: "#1e3a5f", width: "100%",
                    background: "white", border: "1.5px solid rgba(15,98,254,0.2)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }}
                >
                  <Users size={18} />
                  Ver cómo le fue a mi grupo
                  <ChevronRight size={16} />
                </button>

                {/* Tertiary: Quick reflection */}
                <button
                  className="wrap-btn fade-in fade-in-d3"
                  onClick={() => setShowReflection(true)}
                  style={{
                    padding: "14px 28px", fontSize: 14, color: "#64748b", width: "100%",
                    background: "rgba(241,245,249,0.8)", border: "1px solid #e2e8f0"
                  }}
                >
                  <Sparkles size={16} />
                  Reflexión de 30 segundos
                </button>
              </div>

              {/* Back link */}
              <button
                onClick={() => setPhase("doing")}
                style={{ marginTop: 20, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 13, fontFamily: "'Montserrat', sans-serif" }}
              >
                ← Volver al reto
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
