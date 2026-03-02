"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  Target, CheckCircle, FileText, Users, Sparkles, X,
  ChevronRight, AlertCircle, Flame, Zap, BookOpen,
  TrendingUp, Brain, Clock, Star, Trophy, ArrowRight, Lightbulb, Award
} from "lucide-react"
import confetti from "canvas-confetti"
import StreakWidget from "@/components/StreakWidget"

type DailyChallenge = {
  id: string
  title: string
  description: string
  challengeType: string
  activeDate: string
  isCompleted?: boolean
}

type EvidenceForm = {
  smartGoal: string
  didToday: string
  learned: string
  changeTomorrow: string
}

const LIMITS = { smartGoal: 180, didToday: 250, learned: 250, changeTomorrow: 250 }

const CHALLENGE_TYPE_META: Record<string, { label: string; icon: any; color: string; accent: string }> = {
  reflection: { label: "Reflexión", icon: Brain, color: "#818cf8", accent: "rgba(129,140,248,0.15)" },
  task: { label: "Acción", icon: TrendingUp, color: "#10b981", accent: "rgba(16,185,129,0.15)" },
  quiz: { label: "Quiz", icon: BookOpen, color: "#f59e0b", accent: "rgba(245,158,11,0.15)" },
  simulator: { label: "Simulador", icon: Zap, color: "#f97316", accent: "rgba(249,115,22,0.15)" },
}

const EVIDENCE_STEPS = [
  { key: "smartGoal", emoji: "🎯", label: "Mi objetivo SMART", hint: "Específico, medible, alcanzable, relevante y con tiempo", placeholder: "Ej: Ahorrar $300 en 30 días reduciendo mi gasto en delivery.", limit: 180 },
  { key: "didToday", emoji: "⚡", label: "¿Qué hice hoy?", hint: "Describe la acción concreta que tomaste", placeholder: "Ej: Revisé mis últimos 10 gastos y detecté $120 en delivery.", limit: 250 },
  { key: "learned", emoji: "💡", label: "¿Qué aprendí?", hint: "El insight más valioso que te llevas", placeholder: "Ej: Cocinar en casa me puede ahorrar hasta $1,000 al mes.", limit: 250 },
  { key: "changeTomorrow", emoji: "🔄", label: "¿Qué cambiaré mañana?", hint: "Acción específica para mañana", placeholder: "Ej: Prepararé mi lunch la noche anterior.", limit: 250 },
]

export default function RetoDiarioPage() {
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()

  const [challenge, setChallenge] = useState<(DailyChallenge & { isCompleted?: boolean }) | null>(null)
  const [loadingChallenge, setLoadingChallenge] = useState(true)
  const [phase, setPhase] = useState<"doing" | "wrap">("doing")
  const streak = dbProfile?.currentStreak || 0
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<string[]>([])

  // Evidence modal
  const [showEvidence, setShowEvidence] = useState(false)
  const [evidenceStep, setEvidenceStep] = useState(0)
  const [form, setForm] = useState<EvidenceForm>({ smartGoal: "", didToday: "", learned: "", changeTomorrow: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  // Quick reflection
  const [showReflection, setShowReflection] = useState(false)
  const [quickLearned, setQuickLearned] = useState("")

  // Confetti ref
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.background = "#FBFAF5"
    return () => { document.body.style.background = "" }
  }, [])

  useEffect(() => {
    if (loading || !user) return
    fetchChallenge()
    // Fetch weekly active days for calendar
    fetch("/api/user/stats")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.weeklyActiveDays) setWeeklyActiveDays(data.weeklyActiveDays) })
      .catch(() => { })
  }, [user, loading])

  const fetchChallenge = async () => {
    try {
      const res = await fetch("/api/daily-challenge/today")
      if (res.ok) {
        const data = await res.json()
        setChallenge(data)
        if (data.isCompleted) {
          setSubmitted(true)
          setPhase("wrap")
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        console.error("Fetch challenge failed:", res.status, errData)
        setErrorDetails(errData.error || `Error ${res.status}`)
      }
    } catch (e) {
      console.error(e)
      setErrorDetails("Error de conexión al servidor")
    } finally {
      setLoadingChallenge(false)
    }
  }

  const today = new Date()
  const dayName = today.toLocaleDateString("es-MX", { weekday: "long" })
  const dateStr = today.toLocaleDateString("es-MX", { day: "numeric", month: "long" })
  const typeMeta = CHALLENGE_TYPE_META[challenge?.challengeType ?? "task"] ?? CHALLENGE_TYPE_META.task
  const TypeIcon = typeMeta.icon

  const currentStep = EVIDENCE_STEPS[evidenceStep]
  const formFilled = form.smartGoal.trim() && form.didToday.trim() && form.learned.trim() && form.changeTomorrow.trim()
  const currentVal = (form as any)[currentStep?.key ?? "smartGoal"] as string

  const handleEvidenceSubmit = async () => {
    if (!challenge) return
    setSubmitting(true); setSubmitError("")
    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyChallengeId: challenge.id, ...form })
      })
      if (res.ok || res.status === 409) {
        setSubmitted(true); setShowEvidence(false); setEvidenceStep(0)
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F62FE', '#4A9EFF', '#fb923c', '#10b981']
        })
      } else {
        const d = await res.json()
        setSubmitError(d.error || "Error al publicar")
      }
    } catch { setSubmitError("Error de conexión. Intenta de nuevo.") }
    finally { setSubmitting(false) }
  }

  const handleNextStep = () => {
    if (evidenceStep < EVIDENCE_STEPS.length - 1) setEvidenceStep(s => s + 1)
    else handleEvidenceSubmit()
  }

  const handleViewGroup = () =>
    router.push(challenge ? `/forum?tab=reto-del-dia&challengeId=${challenge.id}` : "/forum?tab=reto-del-dia")

  if (loading) return null

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .rd-outer { margin-left: 0 !important; padding-bottom: 100px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .rd-outer { margin-left: 220px !important; width: calc(100% - 220px) !important; }
        }
        @media (min-width: 1161px) {
          .rd-outer { margin-left: 280px !important; width: calc(100% - 280px) !important; }
        }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.9) }       to { opacity:1; transform:scale(1) } }
        @keyframes pulse    { 0%,100% { box-shadow: 0 0 0 0 rgba(15,98,254,0.4) } 50% { box-shadow: 0 0 0 12px rgba(15,98,254,0) } }
        @keyframes float    { 0%,100% { transform: translateY(0px) }          50% { transform: translateY(-6px) } }
        @keyframes shimmer  { from { background-position: -200% center } to { background-position: 200% center } }
        @keyframes starPop  { 0% { opacity:0; transform:scale(0) rotate(-20deg) } 60% { opacity:1; transform:scale(1.2) rotate(5deg) } 100% { opacity:1; transform:scale(1) rotate(0deg) } }
        @keyframes streakGlow { 0%,100% { text-shadow: 0 0 12px rgba(251,146,60,0.8) } 50% { text-shadow: 0 0 24px rgba(251,146,60,1) } }

        .rd-challenge-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%) !important;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(15,98,254,0.25);
          animation: fadeUp 0.5s ease both;
        }
        .rd-challenge-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 0%, rgba(99,179,255,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 0% 100%, rgba(139,92,246,0.12) 0%, transparent 50%);
          pointer-events: none;
        }
        .rd-card-title {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          font-size: clamp(20px, 3vw, 28px) !important;
          font-weight: 900 !important;
          margin: 0 0 16px !important;
          letter-spacing: -0.015em !important;
          line-height: 1.25 !important;
        }
        .rd-card-desc {
          color: rgba(255,255,255,0.80) !important;
          -webkit-text-fill-color: rgba(255,255,255,0.80) !important;
          font-size: clamp(14px, 1.2vw, 16px) !important;
          line-height: 1.75 !important;
          margin: 0 0 32px !important;
          max-width: 580px;
        }

        .rd-complete-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: fit-content; padding: 16px 36px; margin: 0 auto;
          background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
          color: white; border: none; border-radius: 16px;
          font-family: 'Inter', sans-serif; font-weight: 800; font-size: 17px;
          cursor: pointer; transition: all 0.25s ease;
          box-shadow: 0 8px 40px rgba(15,98,254,0.6);
          animation: pulse 2.5s ease infinite;
        }
        .rd-complete-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 50px rgba(15,98,254,0.7); }
        .rd-complete-btn:active { transform: translateY(0); }

        .rd-textarea {
          width: 100%; padding: 14px 16px;
          border: 1.5px solid rgba(0,0,0,0.08);
          border-radius: 14px; font-size: 14px; line-height: 1.7;
          font-family: 'Inter', sans-serif; resize: vertical; outline: none;
          color: #1f2937; background: #f9fafb;
          transition: all 0.2s; box-sizing: border-box;
        }
        .rd-textarea:focus { border-color: #0F62FE; background: #ffffff; box-shadow: 0 0 0 3px rgba(15,98,254,0.1); }
        .rd-textarea::placeholder { color: rgba(0,0,0,0.4); }

        .rd-wrap-card {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px; padding: clamp(40px, 6vw, 60px) clamp(24px, 5vw, 48px);
          position: relative; overflow: hidden; text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .rd-wrap-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 75% 0%, rgba(15,98,254,0.18) 0%, transparent 65%),
                      radial-gradient(ellipse at 15% 100%, rgba(99,102,241,0.12) 0%, transparent 55%);
          pointer-events: none;
        }

        .rd-cta-primary {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: fit-content; padding: 14px 28px; border: none; border-radius: 16px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif; font-weight: 800; font-size: 16px;
          cursor: pointer; transition: all 0.25s ease;
          background: linear-gradient(135deg, #0F62FE 0%, #2563EB 100%);
          color: white; box-shadow: 0 8px 32px rgba(15,98,254,0.55);
          animation: fadeUp 0.4s ease 0.1s both;
        }
        .rd-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(15,98,254,0.7); }
        .rd-cta-secondary {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: fit-content; padding: 12px 24px; border-radius: 16px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.25s ease;
          background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.85);
          animation: fadeUp 0.4s ease 0.18s both;
        }
        .rd-cta-secondary:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }
        .rd-cta-tertiary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px 28px; border-radius: 12px;
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px;
          cursor: pointer; transition: all 0.2s ease;
          background: transparent; border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.45);
          animation: fadeUp 0.4s ease 0.26s both;
        }
        .rd-cta-tertiary:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.25); }

        .step-dot { width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s ease; }
        .step-dot.active { width: 24px; border-radius: 4px; background: #0F62FE; }
        .step-dot.done   { background: #10b981; }
        .step-dot.pending { background: rgba(0,0,0,0.1); }

        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0, 0, 0, 0.4);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(16px, 4vw, 40px);
          backdrop-filter: blur(8px);
        }
        .modal-box {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 24px; width: 100%; max-width: 540px;
          max-height: 92vh; overflow-y: auto;
          padding: clamp(24px, 4vw, 36px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.2);
          animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
          box-sizing: border-box;
        }
      `}</style>

      <div
        className="rd-outer"
        style={{
          minHeight: "100vh",
          background: "#FBFAF5",
          fontFamily: "'Inter', sans-serif",
          padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative orbs */}
        <div style={{ position: "fixed", top: "5%", right: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(15,98,254,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", top: "40%", left: "40%", width: 600, height: 600, background: "radial-gradient(circle, rgba(15,98,254,0.03) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

        {/* ══ EVIDENCE MODAL ══ */}
        {showEvidence && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowEvidence(false) }}>
            <div className="modal-box">
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111827", margin: "0 0 4px" }}>
                    Publicar Evidencia
                  </h2>
                  <p style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", margin: 0 }}>
                    Comparte tu aprendizaje con tu grupo
                  </p>
                </div>
                <button onClick={() => { setShowEvidence(false); setEvidenceStep(0) }} style={{ background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, color: "rgba(0,0,0,0.4)", lineHeight: 0 }}>
                  <X size={18} />
                </button>
              </div>

              {/* Step dots */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24, alignItems: "center" }}>
                {EVIDENCE_STEPS.map((_, i) => (
                  <div key={i} className={`step-dot ${i === evidenceStep ? "active" : i < evidenceStep ? "done" : "pending"}`} />
                ))}
                <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(0,0,0,0.3)", fontWeight: 600 }}>
                  {evidenceStep + 1} / {EVIDENCE_STEPS.length}
                </span>
              </div>

              {/* Current step */}
              <div style={{ animation: "fadeUp 0.3s ease both" }} key={evidenceStep}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{currentStep.emoji}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{currentStep.label}</div>
                <div style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", marginBottom: 14 }}>{currentStep.hint}</div>

                {submitError && evidenceStep === EVIDENCE_STEPS.length - 1 && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 8, color: "#fca5a5", fontSize: 13 }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    {submitError}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tu respuesta *</label>
                  <span style={{ fontSize: 11, color: currentVal.length > currentStep.limit * 0.85 ? "#f59e0b" : "rgba(0,0,0,0.25)", fontWeight: 600 }}>
                    {currentVal.length}/{currentStep.limit}
                  </span>
                </div>
                <textarea
                  className="rd-textarea"
                  rows={4}
                  placeholder={currentStep.placeholder}
                  maxLength={currentStep.limit}
                  value={currentVal}
                  autoFocus
                  onChange={e => setForm(f => ({ ...f, [currentStep.key]: e.target.value }))}
                />
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => evidenceStep > 0 ? setEvidenceStep(s => s - 1) : setShowEvidence(false)}
                  style={{ flex: 1, padding: "13px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 14, color: "#6b7280", fontFamily: "'Inter', sans-serif" }}
                >
                  {evidenceStep > 0 ? "← Atrás" : "Cancelar"}
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!currentVal.trim() || submitting}
                  style={{
                    flex: 2, padding: "13px",
                    background: currentVal.trim() && !submitting ? "linear-gradient(135deg, #0F62FE, #4A9EFF)" : "#f3f4f6",
                    color: currentVal.trim() && !submitting ? "white" : "#9ca3af",
                    border: "none", borderRadius: 12, fontWeight: 800, cursor: currentVal.trim() ? "pointer" : "not-allowed",
                    fontSize: 14, fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
                    boxShadow: currentVal.trim() ? "0 6px 20px rgba(15,98,254,0.35)" : "none"
                  }}
                >
                  {submitting ? "Publicando..." : evidenceStep < EVIDENCE_STEPS.length - 1 ? "Siguiente →" : "✓ Publicar evidencia"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ QUICK REFLECTION MODAL ══ */}
        {showReflection && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowReflection(false) }}>
            <div className="modal-box" style={{ maxWidth: 460 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#111827", margin: 0 }}>⏱ Reflexión rápida</h2>
                  <p style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", margin: "4px 0 0" }}>Escribe en 30 segundos o menos</p>
                </div>
                <button onClick={() => setShowReflection(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, color: "rgba(0,0,0,0.4)", lineHeight: 0 }}>
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", lineHeight: 1.65, marginBottom: 14 }}>
                ¿Cuál fue tu aprendizaje más valioso de hoy?
              </p>
              <textarea
                className="rd-textarea"
                rows={4}
                placeholder="Ej: Aprendí que revisar mis gastos una vez a la semana me evita sorpresas al final del mes."
                value={quickLearned}
                maxLength={250}
                autoFocus
                onChange={e => setQuickLearned(e.target.value)}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setShowReflection(false)} style={{ flex: 1, padding: "12px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 13, color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
                  Cerrar
                </button>
                {quickLearned.trim() && (
                  <button
                    onClick={() => { setForm(f => ({ ...f, learned: quickLearned })); setShowReflection(false); setEvidenceStep(0); setShowEvidence(true) }}
                    style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #0F62FE, #4A9EFF)", color: "white", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer", fontSize: 13, fontFamily: "'Inter', sans-serif" }}
                  >
                    Usar en mi evidencia →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ MAIN CONTENT ══ */}
        <div style={{ margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>

          {/* ── PHASE: DOING ── */}
          {phase === "doing" && (
            <>
              {/* Top bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, animation: "fadeUp 0.4s ease both" }}>
                <div>
                  <h1 style={{
                    fontSize: "clamp(28px, 5vw, 44px)",
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.2,
                    paddingBottom: "10px",
                    background: "linear-gradient(135deg, #0f2a6e 0%, #1e3a8a 50%, #2563eb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textTransform: "capitalize"
                  }}>
                    {dayName}, {dateStr}
                  </h1>
                </div>

                {/* Streak badge + Weekly Calendar */}
                <StreakWidget streak={streak} showCalendar activeDays={weeklyActiveDays} />
              </div>

              {/* ── Challenge hero card ── */}
              <div className="rd-challenge-card" style={{ padding: "clamp(28px, 5vw, 44px)", marginBottom: 20 }}>
                {/* Decorative orbs */}
                <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${typeMeta.accent}, transparent 70%)`, pointerEvents: "none", transform: "translate(30%, -30%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.05), transparent 70%)", pointerEvents: "none", transform: "translate(-30%, 30%)" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Type badge + XP pill */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "6px 14px",
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: 999, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.95)"
                    }}>
                      <TypeIcon size={13} />
                      {typeMeta.label}
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "6px 14px",
                      background: "rgba(251,191,36,0.2)",
                      border: "1px solid rgba(251,191,36,0.4)",
                      borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#fbbf24"
                    }}>
                      <Zap size={12} />
                      +50 XP
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "6px 12px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 999, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)"
                    }}>
                      <Clock size={12} />
                      ~5 min
                    </div>
                  </div>

                  {/* Title */}
                  {loadingChallenge ? (
                    <div style={{ height: 28, borderRadius: 8, marginBottom: 12, backgroundColor: "rgba(255,255,255,0.1)", backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite", maxWidth: 420 }} />
                  ) : (
                    <h2 className="rd-card-title">
                      {challenge?.title ?? "Reto del día"}
                    </h2>
                  )}

                  {/* Description */}
                  {loadingChallenge ? (
                    <>
                      <div style={{ height: 16, borderRadius: 6, marginBottom: 8, backgroundColor: "#f1f5f9", backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite" }} />
                      <div style={{ height: 16, borderRadius: 6, marginBottom: 8, backgroundColor: "#f1f5f9", backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite", maxWidth: "75%" }} />
                    </>
                  ) : errorDetails ? (
                    <div style={{ padding: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", marginBottom: "24px" }}>
                      <p style={{ color: "#b91c1c", fontSize: "14px", fontWeight: 600, margin: "0 0 8px" }}>
                        Ocurrió un error al cargar el reto: {errorDetails}
                      </p>
                      <button
                        onClick={() => { setErrorDetails(null); setLoadingChallenge(true); fetchChallenge(); }}
                        style={{ background: "#b91c1c", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Reintentar
                      </button>
                    </div>
                  ) : (
                    <p className="rd-card-desc">
                      {challenge?.description ?? "Cargando el reto de hoy..."}
                    </p>
                  )}

                  {/* CTA */}
                  {submitted ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 14, color: "#6ee7b7" }}>
                      <CheckCircle size={20} />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>¡Evidencia publicada! Tu grupo ya puede verla en el Foro.</span>
                    </div>
                  ) : (
                    <button className="rd-complete-btn" onClick={() => setPhase("wrap")}>
                      <CheckCircle size={18} strokeWidth={2.5} />
                      Completé el reto
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* ── Info cards row ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                {/* Tip */}
                <div style={{
                  padding: "24px 28px",
                  background: "#fffbeb",
                  border: "1.5px solid #fef3c7",
                  borderRadius: 24,
                  borderLeft: "6px solid #f59e0b",
                  animation: "fadeUp 0.5s ease 0.05s both"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Lightbulb size={20} color="white" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 850, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.1em" }}>Consejo del experto</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                    La constancia vence al talento. Completar este reto diario te pone en el <strong>top 10%</strong> de estudiantes que mejoran su situación financiera este año.
                  </p>
                </div>

                {/* Stats mini */}
                <div style={{
                  padding: "24px 28px",
                  background: "#FBFAF5",
                  border: "1.5px solid #e2e8f0",
                  borderLeft: "6px solid #0F62FE",
                  borderRadius: 24,
                  animation: "fadeUp 0.5s ease 0.1s both"
                }}>
                  <div style={{ fontSize: 12, fontWeight: 850, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>¿Por qué hacerlo?</div>
                  {[
                    { icon: <Zap size={16} color="#0F62FE" />, text: "5 min = un hábito financiero sólido", bg: "#eff6ff" },
                    { icon: <Target size={16} color="#0F62FE" />, text: "Cada reto refuerza lo aprendido en clase", bg: "#eff6ff" },
                    { icon: <Award size={16} color="#0F62FE" />, text: "Acumula XP y sube de nivel", bg: "#eff6ff" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.4, fontWeight: 600 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PHASE: DAILY WRAP ── */}
          {phase === "wrap" && (
            <div ref={wrapRef}>


              <div className="rd-wrap-card">
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Trophy */}
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow: "0 12px 40px rgba(245,158,11,0.4)",
                    animation: "float 3s ease infinite"
                  }}>
                    <Trophy size={34} color="white" strokeWidth={2.5} />
                  </div>

                  <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "white", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                    ¡Reto completado!
                  </h2>

                  {/* XP earned */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 18px", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 999, marginBottom: 16 }}>
                    <Star size={14} style={{ color: "#fbbf24" }} fill="#fbbf24" />
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24" }}>+50 XP ganados</span>
                    <Flame size={14} style={{ color: "#fb923c" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fb923c" }}>{streak} días seguidos</span>
                  </div>

                  <p style={{ fontSize: "clamp(13px, 1.2vw, 15px)", color: "rgba(255,255,255,0.55)", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
                    Cada día que practicas es un paso hacia la libertad financiera. ¿Qué quieres hacer ahora?
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 28 }} />

                  {/* 3 CTAs */}
                  <div style={{ display: "grid", gap: 12 }}>
                    <button
                      className="rd-cta-primary"
                      onClick={() => submitted ? null : (setEvidenceStep(0), setShowEvidence(true))}
                      style={submitted ? { background: "#10b981", boxShadow: "none", cursor: "default" } : undefined}
                    >
                      {submitted ? <CheckCircle size={18} /> : <FileText size={18} />}
                      {submitted ? "✓ Evidencia publicada en el Foro" : "Publicar mi evidencia"}
                      {!submitted && <ArrowRight size={16} style={{ marginLeft: "auto" }} />}
                    </button>

                    <button className="rd-cta-secondary" onClick={handleViewGroup}>
                      <Users size={17} />
                      Ver cómo le fue a mi grupo
                      <ArrowRight size={15} style={{ marginLeft: "auto" }} />
                    </button>

                    <button className="rd-cta-tertiary" onClick={() => setShowReflection(true)}>
                      <Sparkles size={15} />
                      Reflexión rápida de 30 segundos
                    </button>
                  </div>

                  {/* Back */}
                  <button
                    onClick={() => setPhase("doing")}
                    style={{ marginTop: 24, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Inter', sans-serif", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                  >
                    ← Ver el reto de nuevo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
