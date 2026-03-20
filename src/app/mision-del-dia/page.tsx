"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  Target, CheckCircle, FileText, Users, X,
  ChevronRight, AlertCircle, Flame, Zap, BookOpen,
  TrendingUp, Brain, Clock, Trophy, ArrowRight, Lightbulb, Award,
  PenLine, SquareCheckBig, Send, Camera, Image as ImageIcon, Trash2
} from "lucide-react"
import confetti from "canvas-confetti"
import StreakWidget from "@/components/StreakWidget"
import XPProgressCard from "@/components/XPProgressCard"
import PageLoader from "@/components/PageLoader"

type DailyChallenge = {
  id: string
  title: string
  description: string
  challengeType: string
  activeDate: string
  isCompleted?: boolean
}

const CHALLENGE_TYPE_META: Record<string, { label: string; icon: any; color: string; accent: string }> = {
  reflection: { label: "Reflexión", icon: Brain, color: "#818cf8", accent: "rgba(129,140,248,0.15)" },
  task:        { label: "Acción",    icon: TrendingUp, color: "#10b981", accent: "rgba(16,185,129,0.15)" },
  quiz:        { label: "Quiz",      icon: BookOpen,   color: "#6366f1", accent: "rgba(99,102,241,0.15)" },
  simulator:   { label: "Simulador", icon: Zap,        color: "#0F62FE", accent: "rgba(15,98,254,0.15)" },
}

export default function MisionDiaPage() {
  const { user, loading, dbProfile, refreshUser, setDbProfile } = useAuth()
  const router = useRouter()

  const [earnedRewards, setEarnedRewards] = useState<{ xpAdded: number; newTotalXP: number } | null>(null)
  const [challenge, setChallenge] = useState<(DailyChallenge & { isCompleted?: boolean }) | null>(null)
  const [loadingChallenge, setLoadingChallenge] = useState(true)
  const [phase, setPhase] = useState<"doing" | "wrap">("doing")
  const streak = dbProfile?.currentStreak || 0
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<string[]>([])

  // Evidence modal
  const [showEvidence, setShowEvidence] = useState(false)
  const [evidenceText, setEvidenceText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  // Image attachment
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const wrapRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    document.body.style.background = "#F8FAFC"
    return () => { document.body.style.background = "" }
  }, [])

  useEffect(() => {
    if (loading || !user) return
    fetchChallenge()
    fetch("/api/user/stats")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.weeklyActiveDays) setWeeklyActiveDays(data.weeklyActiveDays) })
      .catch(() => {})
  }, [user, loading])

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (showEvidence) {
      setTimeout(() => textareaRef.current?.focus(), 120)
    }
  }, [showEvidence])

  const fetchChallenge = async () => {
    try {
      const res = await fetch("/api/daily-challenge/today")
      if (res.ok) {
        const data = await res.json()
        setChallenge(data)
        if (data.isCompleted) { setSubmitted(true); setPhase("wrap") }
      } else {
        const errData = await res.json().catch(() => ({}))
        setErrorDetails(errData.error || `Error ${res.status}`)
      }
    } catch { setErrorDetails("Error de conexión al servidor") }
    finally { setLoadingChallenge(false) }
  }

  const today = new Date()
  const dayName  = today.toLocaleDateString("es-MX", { weekday: "long" })
  const dateStr  = today.toLocaleDateString("es-MX", { day: "numeric", month: "long" })
  const typeMeta = CHALLENGE_TYPE_META[challenge?.challengeType ?? "task"] ?? CHALLENGE_TYPE_META.task
  const TypeIcon = typeMeta.icon

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleEvidenceSubmit = async () => {
    if (!challenge || (!evidenceText.trim() && !imageFile)) return
    setSubmitting(true); setSubmitError("")

    let uploadedUrl = null

    // 1. Upload file if exists
    if (imageFile) {
      setUploadingFile(true)
      const formData = new FormData()
      formData.append("file", imageFile)
      try {
        const upRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (upRes.ok) {
          const upData = await upRes.json()
          uploadedUrl = upData.url
        } else {
          setSubmitError("No se pudo subir la imagen. Intenta de nuevo.")
          setSubmitting(false); setUploadingFile(false)
          return
        }
      } catch (e) {
        setSubmitError("Error al conectar con el servidor de carga.")
        setSubmitting(false); setUploadingFile(false)
        return
      }
      setUploadingFile(false)
    }

    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyChallengeId: challenge.id,
          smartGoal: evidenceText.trim() || "Evidencia fotográfica",
          didToday: evidenceText.trim() || "Evidencia fotográfica",
          learned: evidenceText.trim() || "-",
          changeTomorrow: "-",
          attachments: uploadedUrl ? [{ type: "image", url: uploadedUrl }] : null
        })
      })
      if (res.ok || res.status === 409) {
        const data = await res.json()
        if (data.rewards) {
          setEarnedRewards({ xpAdded: data.rewards.xpAwarded || 50, newTotalXP: data.rewards.newTotalXp })
          setDbProfile((prev: any) => prev ? ({
            ...prev,
            xp: data.rewards.newTotalXp,
            level: data.rewards.newLevel,
            currentStreak: data.rewards.currentStreak,
          }) : prev)
        }
        await refreshUser()
        setSubmitted(true); setShowEvidence(false)
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors: ["#0F62FE","#4A9EFF","#60A5FA","#10b981"] })
        setPhase("wrap")
      } else {
        const d = await res.json()
        setSubmitError(d.error || "Error al publicar")
      }
    } catch { setSubmitError("Error de conexión. Intenta de nuevo.") }
    finally { setSubmitting(false) }
  }

  const handleViewGroup = () =>
    router.push(challenge ? `/forum?tab=mision-del-dia&challengeId=${challenge.id}` : "/forum?tab=mision-del-dia")

  useEffect(() => {
    if (!loading && !user) router.push("/login?callbackUrl=/mision-del-dia")
  }, [user, loading, router])

  if (loading || loadingChallenge || (user && !dbProfile)) return <PageLoader />
  if (!user) return null

  const charCount = evidenceText.length
  const charLimit = 600
  const charPct   = (charCount / charLimit) * 100
  const canSubmit = (evidenceText.trim().length >= 20 || !!imageFile) && !uploadingFile

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

        @keyframes fadeUp   { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.92) }      to { opacity:1; transform:scale(1) } }
        @keyframes pulse    { 0%,100% { box-shadow: 0 0 0 0 rgba(15,98,254,0.4) } 50% { box-shadow: 0 0 0 14px rgba(15,98,254,0) } }
        @keyframes float    { 0%,100% { transform: translateY(0px) }         50% { transform: translateY(-7px) } }
        @keyframes shimmer  { from { background-position: -200% center }     to { background-position: 200% center } }
        @keyframes orbDrift { 0%,100% { transform: translate(0,0) scale(1) } 33% { transform: translate(20px,-15px) scale(1.04) } 66% { transform: translate(-12px,10px) scale(0.97) } }
        @keyframes cardIn   { from { opacity:0; transform:translateY(30px) scale(0.97) } to { opacity:1; transform:none } }
        @keyframes ringPing { 0% { opacity:.7; transform:scale(.6) } 100% { opacity:0; transform:scale(2.2) } }
        @keyframes streakGlow { 0%,100% { text-shadow: 0 0 12px rgba(251,146,60,.8) } 50% { text-shadow: 0 0 24px rgba(251,146,60,1) } }

        .rd-challenge-card {
          background: linear-gradient(145deg, #0a0f1e 0%, #1e3a8a 70%, #1d4ed8 100%) !important;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 32px 64px -12px rgba(15,98,254,0.3);
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .rd-challenge-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 0%, rgba(99,179,255,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 0% 100%, rgba(139,92,246,0.12) 0%, transparent 50%);
          pointer-events: none;
        }
        .rd-card-title {
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
          font-size: clamp(24px,4vw,36px) !important;
          font-weight: 800 !important;
          margin: 0 0 16px !important;
          letter-spacing: -0.02em !important;
          line-height: 1.15 !important;
        }
        .rd-card-desc {
          color: rgba(255,255,255,0.8) !important;
          -webkit-text-fill-color: rgba(255,255,255,0.8) !important;
          font-size: clamp(14px,1.2vw,16px) !important;
          line-height: 1.75 !important;
          margin: 0 0 32px !important;
          max-width: 580px;
        }

        .rd-complete-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: fit-content; padding: 16px 36px; margin: 0 auto;
          background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
          color: white; border: none; border-radius: 16px;
          font-weight: 600; font-size: 17px;
          cursor: pointer; transition: all 0.25s ease;
          box-shadow: 0 8px 40px rgba(15,98,254,0.6);
          animation: pulse 2.5s ease infinite;
        }
        .rd-complete-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 50px rgba(15,98,254,0.7); }
        .rd-complete-btn:active { transform: translateY(0); }

        /* Info Cards */
        .rd-info-card {
          position: relative;
          border-radius: 24px;
          padding: 26px;
          overflow: hidden;
          cursor: default;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .rd-info-card:hover {
          transform: translateY(-6px) scale(1.012);
          box-shadow: 0 24px 48px -8px rgba(15,98,254,0.18) !important;
        }
        .rd-info-card .rd-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          animation: orbDrift 8s ease-in-out infinite;
        }

        /* Evidence Modal */
        .rd-textarea {
          width: 100%; padding: 16px 18px;
          border: 1.5px solid rgba(15,98,254,0.15);
          border-radius: 16px; font-size: 15px; line-height: 1.75;
          resize: none; outline: none;
          color: #1f2937; background: #f8faff;
          transition: all 0.2s; box-sizing: border-box;
          font-family: inherit;
        }
        .rd-textarea:focus { border-color: #0F62FE; background: #fff; box-shadow: 0 0 0 4px rgba(15,98,254,0.08); }
        .rd-textarea::placeholder { color: rgba(0,0,0,0.35); }

        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(4,10,30,0.55);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(16px,4vw,40px);
          backdrop-filter: blur(12px);
          animation: fadeUp 0.2s ease both;
        }
        .modal-box {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 28px; width: 100%; max-width: 540px;
          max-height: 92vh; overflow-y: auto;
          box-shadow: 0 40px 80px rgba(0,0,0,0.22);
          animation: scaleIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
          box-sizing: border-box;
          overflow: hidden;
        }
        .modal-header-banner {
          background: linear-gradient(135deg, #0a0f1e 0%, #1e3a8a 70%, #1d4ed8 100%);
          padding: clamp(24px,4vw,32px) clamp(24px,4vw,36px) 20px;
          position: relative;
          overflow: hidden;
        }
        .modal-header-banner::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 0%, rgba(99,179,255,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 0% 100%, rgba(139,92,246,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .modal-body {
          padding: clamp(20px,3vw,28px) clamp(24px,4vw,36px) clamp(24px,4vw,32px);
        }

        .rd-submit-btn {
          width: 100%; padding: 15px 24px; border: none; border-radius: 16px;
          font-size: 16px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rd-submit-btn.active {
          background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
          color: #fff;
          box-shadow: 0 8px 32px rgba(15,98,254,0.4);
        }
        .rd-submit-btn.active:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(15,98,254,0.55); }
        .rd-submit-btn.disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }

        /* Wrap card */
        .rd-wrap-card {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px; padding: clamp(40px,6vw,60px) clamp(24px,5vw,48px);
          position: relative; overflow: hidden; text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
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
          margin: 0 auto; font-weight: 600; font-size: 16px;
          cursor: pointer; transition: all 0.25s ease;
          background: linear-gradient(135deg, #0F62FE 0%, #2563EB 100%);
          color: white; box-shadow: 0 8px 32px rgba(15,98,254,0.55);
          animation: fadeUp 0.4s ease 0.1s both;
        }
        .rd-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(15,98,254,0.7); }
        .rd-cta-secondary {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: fit-content; padding: 12px 24px; border-radius: 16px; margin: 0 auto;
          font-weight: 500; font-size: 15px;
          cursor: pointer; transition: all 0.25s ease;
          background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.85);
          animation: fadeUp 0.4s ease 0.18s both;
        }
        .rd-cta-secondary:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }
        .rd-cta-tertiary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px 28px; border-radius: 12px;
          font-weight: 500; font-size: 14px;
          cursor: pointer; transition: all 0.2s ease;
          background: transparent; border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.45);
          animation: fadeUp 0.4s ease 0.26s both;
        }
        .rd-cta-tertiary:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.25); }

        /* Char meter */
        .rd-char-ring { transition: stroke-dashoffset 0.3s ease; }
      `}</style>

      <div className="rd-outer" style={{
        minHeight: "100vh", background: "#FBFAF5",
        padding: "clamp(24px,4vw,48px) clamp(16px,4vw,40px)",
        boxSizing: "border-box", position: "relative", overflowX: "hidden",
      }}>
        {/* Background orbs */}
        <div style={{ position: "fixed", top: "5%", right: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(15,98,254,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

        {/* ══ EVIDENCE MODAL ══ */}
        {showEvidence && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowEvidence(false) }}>
            <div className="modal-box">
              {/* Dark banner header */}
              <div className="modal-header-banner">
                {/* Decorative orbs in banner */}
                <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,179,255,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Top row: icon + close */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                      <FileText size={13} />
                      Publicar evidencia
                    </div>
                    <button onClick={() => setShowEvidence(false)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", padding: 7, borderRadius: 10, color: "rgba(255,255,255,0.6)", lineHeight: 0, flexShrink: 0, transition: "all 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Title */}
                  <h2 style={{ color: "#fff", fontSize: "clamp(18px,3vw,22px)", fontWeight: 800, margin: "16px 0 6px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    ¿Qué hiciste para completar la misión?
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 14px", lineHeight: 1.6, fontWeight: 500 }}>
                    Sé concreto y auténtico. Tu grupo aprende de tu perspectiva.
                  </p>

                  {/* Misión pill */}
                  {challenge?.title && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                      <Target size={11} />
                      {challenge.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="modal-body">

                {/* Single textarea */}
                <div style={{ position: "relative" }}>
                  <textarea
                    ref={textareaRef}
                    className="rd-textarea"
                    rows={6}
                    maxLength={charLimit}
                    placeholder={`Ej: Hoy revisé mis gastos de la última semana y encontré que gasto $350 en suscripciones de streaming. Decidí cancelar una y mover ese dinero a mi fondo de emergencia. Me di cuenta de que pequeños ajustes pueden sumar mucho al mes.`}
                    value={evidenceText}
                    onChange={e => setEvidenceText(e.target.value)}
                  />

                  {/* Char progress ring */}
                  <div style={{ position: "absolute", bottom: 12, right: 12, opacity: charCount > 0 ? 1 : 0, transition: "opacity 0.3s" }}>
                    <svg width={32} height={32} viewBox="0 0 32 32" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3" />
                      <circle
                        className="rd-char-ring"
                        cx="16" cy="16" r="12" fill="none"
                        stroke={charPct > 90 ? "#f59e0b" : "#0F62FE"}
                        strokeWidth="3"
                        strokeDasharray={75.4}
                        strokeDashoffset={75.4 * (1 - charPct / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: charPct > 90 ? "#f59e0b" : "rgba(0,0,0,0.3)", marginTop: 6, textAlign: "right", fontWeight: 500 }}>
                  {charCount} / {charLimit}
                </div>

                {/* Image Attachment Section */}
                <div style={{ marginTop: 16 }}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  {imagePreview ? (
                    <div style={{ position: "relative", width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(15,98,254,0.1)" }}>
                      <img src={imagePreview} alt="Evidencia" style={{ width: "100%", height: 180, objectFit: "cover" }} />
                      <button
                        onClick={removeImage}
                        style={{ position: "absolute", top: 10, right: 10, background: "rgba(239, 68, 68, 0.9)", border: "none", color: "white", padding: 8, borderRadius: "50%", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: "100%", padding: "16px", background: "#f8faff", border: "2px dashed rgba(15,98,254,0.2)",
                        borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#0F62FE"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(15,98,254,0.2)"}
                    >
                      <Camera size={24} color="#0F62FE" />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#0F62FE" }}>Adjuntar foto del avance</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>PNG, JPG o JPEG (máx. 5MB)</span>
                    </button>
                  )}
                </div>

                {/* Writing tip */}
                {!canSubmit && charCount === 0 && !imageFile && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#f8faff", border: "1px solid rgba(15,98,254,0.1)", borderRadius: 12, padding: "10px 14px", marginTop: 12 }}>
                    <Lightbulb size={15} color="#0F62FE" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                      Describe qué hiciste, qué aprendiste o adjunta una foto para completar esta misión.
                    </span>
                  </div>
                )}

                {submitError && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "10px 14px", marginTop: 12, display: "flex", gap: 8, alignItems: "center", color: "#dc2626", fontSize: 13 }}>
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    {submitError}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                  <button
                    onClick={() => setShowEvidence(false)}
                    style={{ flex: 1, padding: "14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 14, fontWeight: 500, cursor: "pointer", fontSize: 14, color: "#6b7280" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEvidenceSubmit}
                    disabled={!canSubmit || submitting}
                    className={`rd-submit-btn ${canSubmit && !submitting ? "active" : "disabled"}`}
                    style={{ flex: 2 }}
                  >
                    {submitting ? <>Publicando...</> : <><Send size={17} strokeWidth={2} /> Publicar evidencia</>}
                  </button>
                </div>

                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.3)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                  Tu evidencia será visible para tu grupo y profesor en el Foro.
                </p>
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
                <h1 style={{
                  fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, margin: 0,
                  letterSpacing: "-0.03em", lineHeight: 1.2, paddingBottom: "10px",
                  background: "linear-gradient(135deg,#0f2a6e 0%,#1e3a8a 50%,#2563eb 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  textTransform: "capitalize",
                }}>
                  {dayName}, {dateStr}
                </h1>
                <StreakWidget streak={streak} showCalendar hideCalendarOnMobile activeDays={weeklyActiveDays} />
              </div>

              {/* ── Challenge hero ── */}
              <div className="rd-challenge-card" style={{ padding: "clamp(28px,5vw,44px)", marginBottom: 24 }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle,${typeMeta.accent},transparent 70%)`, pointerEvents: "none", transform: "translate(30%,-30%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.05),transparent 70%)", pointerEvents: "none", transform: "translate(-30%,30%)" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>
                      <TypeIcon size={13} />{typeMeta.label}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(15,98,254,0.15)", border: "1px solid rgba(15,98,254,0.25)", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#93c5fd" }}>
                      <Zap size={12} fill="#93c5fd" />+50 XP
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 999, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
                      <Clock size={12} />~5 min
                    </div>
                  </div>

                  {/* Title */}
                  {loadingChallenge ? (
                    <div style={{ height: 28, borderRadius: 8, marginBottom: 12, backgroundColor: "rgba(255,255,255,0.1)", backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite", maxWidth: 420 }} />
                  ) : (
                    <h2 className="rd-card-title">{challenge?.title ?? "Misión del día"}</h2>
                  )}

                  {/* Description */}
                  {loadingChallenge ? (
                    <>
                      <div style={{ height: 16, borderRadius: 6, marginBottom: 8, backgroundColor: "rgba(255,255,255,0.08)", animation: "shimmer 1.5s linear infinite" }} />
                      <div style={{ height: 16, borderRadius: 6, marginBottom: 8, backgroundColor: "rgba(255,255,255,0.08)", animation: "shimmer 1.5s linear infinite", maxWidth: "75%" }} />
                    </>
                  ) : errorDetails ? (
                    <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, marginBottom: 24 }}>
                      <p style={{ color: "#b91c1c", fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>Error: {errorDetails}</p>
                      <button onClick={() => { setErrorDetails(null); setLoadingChallenge(true); fetchChallenge() }} style={{ background: "#b91c1c", color: "white", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                        Reintentar
                      </button>
                    </div>
                  ) : (
                    <p className="rd-card-desc">{challenge?.description ?? "Cargando la misión de hoy..."}</p>
                  )}

                </div>
              </div>

              {/* ── Info cards ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>

                {/* Card 1: Cómo completarlo */}
                <div className="rd-info-card" style={{
                  background: "linear-gradient(135deg,#0a1628 0%,#0f2347 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 32px rgba(15,98,254,0.12)",
                  animationDelay: "0.05s",
                }}>
                  {/* Animated orb */}
                  <div className="rd-orb" style={{ width: 140, height: 140, top: -40, right: -40, background: "radial-gradient(circle,rgba(15,98,254,0.25) 0%,transparent 70%)", animationDelay: "0s" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 14, background: "rgba(15,98,254,0.2)", border: "1px solid rgba(15,98,254,0.3)", marginBottom: 16 }}>
                      <PenLine size={20} color="#60a5fa" strokeWidth={2} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Cómo completarlo</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 18, lineHeight: 1.3 }}>Tres pasos simples</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { icon: <Brain size={14} color="#818cf8" />, bg: "rgba(129,140,248,0.15)", text: "Lee la misión con atención" },
                        { icon: <SquareCheckBig size={14} color="#34d399" />, bg: "rgba(52,211,153,0.15)", text: "Realízala: actúa, escribe o adjunta foto" },
                        { icon: <FileText size={14} color="#60a5fa" />, bg: "rgba(96,165,250,0.15)", text: "Publica y comparte con tu grupo" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                          <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1.4 }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card 2: Sabías que */}
                <div className="rd-info-card" style={{
                  background: "linear-gradient(135deg,#1a0c00 0%,#2d1600 100%)",
                  border: "1px solid rgba(245,158,11,0.15)",
                  boxShadow: "0 8px 32px rgba(245,158,11,0.1)",
                  animationDelay: "0.12s",
                }}>
                  <div className="rd-orb" style={{ width: 160, height: 160, bottom: -50, right: -50, background: "radial-gradient(circle,rgba(245,158,11,0.2) 0%,transparent 70%)", animationDelay: "-3s" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 14, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", marginBottom: 16 }}>
                      <Lightbulb size={20} color="#fbbf24" strokeWidth={2} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Sabías que</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.3 }}>El poder del hábito diario</div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 500 }}>
                      Quienes publican evidencia de forma consistente retienen{" "}
                      <span style={{ fontWeight: 800, color: "#fbbf24" }}>hasta 3 veces más</span>{" "}
                      lo aprendido. Cada publicación construye tu historial financiero.
                    </p>
                    {/* Stat pills */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ padding: "5px 12px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#fbbf24" }}>3x retención</div>
                      <div style={{ padding: "5px 12px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#34d399" }}>Top 10% usuarios</div>
                    </div>
                  </div>
                </div>


              </div>
            </>
          )}

          {/* ── PHASE: DAILY WRAP ── */}
          {phase === "wrap" && (
            <div ref={wrapRef}>
              <div className="rd-wrap-card">
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Floating trophy */}
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow: "0 12px 40px rgba(245,158,11,0.4)",
                    animation: "float 3s ease infinite",
                    position: "relative",
                  }}>
                    <Trophy size={34} color="white" strokeWidth={2.5} />
                    {/* Ping ring */}
                    <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid rgba(245,158,11,0.4)", animation: "ringPing 2s ease-in-out infinite" }} />
                  </div>

                  <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "white", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                    ¡Misión completada!
                  </h2>

                  <div style={{ marginBottom: 28, marginTop: 12 }}>
                    <XPProgressCard
                      xpEarned={earnedRewards?.xpAdded || 50}
                      initialXP={earnedRewards ? Math.max(0, earnedRewards.newTotalXP - earnedRewards.xpAdded) : Math.max(0, (dbProfile?.xp || 0) - (submitted ? 50 : 0))}
                      delay={600}
                    />
                  </div>

                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 18px", background: "rgba(15,98,254,0.08)", border: "1px solid rgba(15,98,254,0.15)", borderRadius: 999, marginBottom: 16 }}>
                    <Flame size={14} style={{ color: "#60a5fa" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa" }}>{streak} {streak === 1 ? "día" : "días"} seguidos</span>
                  </div>

                  <p style={{ fontSize: "clamp(13px,1.2vw,15px)", color: "rgba(255,255,255,0.5)", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
                    Cada día que practicas es un paso hacia la libertad financiera. ¿Qué quieres hacer ahora?
                  </p>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 28 }} />

                  <div style={{ display: "grid", gap: 12 }}>
                    <button
                      className="rd-cta-primary"
                      onClick={() => submitted ? null : (setShowEvidence(true))}
                      style={submitted ? { background: "#10b981", boxShadow: "none", cursor: "default" } : undefined}
                    >
                      {submitted ? <CheckCircle size={18} /> : <FileText size={18} />}
                      {submitted ? "Evidencia publicada en el Foro" : "Publicar mi evidencia"}
                      {!submitted && <ArrowRight size={16} style={{ marginLeft: "auto" }} />}
                    </button>

                    <button className="rd-cta-secondary" onClick={handleViewGroup}>
                      <Users size={17} />
                      Ver cómo le fue a mi grupo
                      <ArrowRight size={15} style={{ marginLeft: "auto" }} />
                    </button>
                  </div>

                  <button
                    onClick={() => setPhase("doing")}
                    style={{ marginTop: 24, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 13, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                  >
                    ← Ver la misión de nuevo
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
