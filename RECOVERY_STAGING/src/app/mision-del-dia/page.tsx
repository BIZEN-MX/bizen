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
import { motion, AnimatePresence } from "framer-motion"

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
  task: { label: "Acción", icon: TrendingUp, color: "#10b981", accent: "rgba(16,185,129,0.15)" },
  quiz: { label: "Quiz", icon: BookOpen, color: "#6366f1", accent: "rgba(99,102,241,0.15)" },
  simulator: { label: "Simulador", icon: Zap, color: "#0F62FE", accent: "rgba(15,98,254,0.15)" },
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
    if (loading || !user) return
    fetchChallenge()
    fetch("/api/user/stats")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.weeklyActiveDays) setWeeklyActiveDays(data.weeklyActiveDays) })
      .catch(() => { })
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
  const dayName = today.toLocaleDateString("es-MX", { weekday: "long" })
  const dateStr = today.toLocaleDateString("es-MX", { day: "numeric", month: "long" })
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
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors: ["#0F62FE", "#4A9EFF", "#60A5FA", "#10b981"] })
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
  const charPct = (charCount / charLimit) * 100
  const canSubmit = (evidenceText.trim().length >= 20 || !!imageFile) && !uploadingFile

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden pt-6 pb-28 px-4 md:py-12 md:px-10 lg:px-20">
      {/* Background orbs */}
      <div className="fixed top-[5%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(15,98,254,0.06)_0%,transparent_70%)] animate-pulse" />
      <div className="fixed bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_70%)] animate-pulse" style={{ animationDelay: '1s' }} />


        {/* ══ EVIDENCE MODAL ══ */}
        <AnimatePresence>
          {showEvidence && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEvidence(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-[540px] bg-white rounded-[32px] shadow-2xl overflow-hidden z-10"
              >
                {/* Dark banner header */}
                <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-8 md:p-10 pb-6 overflow-hidden">
                  {/* Decorative orbs in banner */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(99,179,255,0.2)_0%,transparent_70%)] pointer-events-none" />
                  <div className="absolute -bottom-8 -left-5 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />

                  <div className="relative z-10">
                    {/* Top row: icon + close */}
                    <div className="flex justify-between items-start">
                      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">
                        <FileText size={13} />
                        Publicar evidencia
                      </div>
                      <button 
                        onClick={() => setShowEvidence(false)} 
                        className="p-2 bg-white/10 border border-white/10 rounded-xl text-white/60 hover:bg-white/20 hover:text-white transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Title */}
                    <h2 className="text-white text-2xl md:text-3xl font-extrabold mt-6 mb-2 tracking-tight leading-tight">
                      ¿Qué hiciste hoy?
                    </h2>
                    <p className="text-white/60 text-sm font-medium leading-relaxed max-w-[90%]">
                      Comparte tu progreso con la comunidad y gana recompensas.
                    </p>

                    {/* Misión pill */}
                    {challenge?.title && (
                      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-[11px] font-bold text-white/80 mt-4 uppercase tracking-wider">
                        <Target size={11} className="text-blue-400" />
                        {challenge.title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 md:p-10 pt-8">
                  <div className="relative group">
                    <textarea
                      ref={textareaRef}
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 text-[15px] leading-relaxed resize-none outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/5 transition-all"
                      rows={5}
                      maxLength={charLimit}
                      placeholder="Ej: Hoy revisé mis gastos de la última semana y encontré que gasto $350 en suscripciones de streaming..."
                      value={evidenceText}
                      onChange={e => setEvidenceText(e.target.value)}
                    />

                    {/* Char progress ring */}
                    <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${charCount > 0 ? "opacity-100" : "opacity-0"}`}>
                      <svg width={32} height={32} viewBox="0 0 32 32" className="-rotate-90">
                        <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
                        <motion.circle
                          cx="16" cy="16" r="12" fill="none"
                          stroke={charPct > 90 ? "#f59e0b" : "#3b82f6"}
                          strokeWidth="3"
                          strokeDasharray={75.4}
                          initial={{ strokeDashoffset: 75.4 }}
                          animate={{ strokeDashoffset: 75.4 * (1 - charPct / 100) }}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className={`text-[11px] font-bold mt-3 text-right ${charPct > 90 ? "text-amber-500" : "text-slate-400"}`}>
                    {charCount} / {charLimit}
                  </div>

                  {/* Image Attachment Section */}
                  <div className="mt-6">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {imagePreview ? (
                      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-100 group">
                        <img src={imagePreview} alt="Evidencia" className="w-full h-44 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={removeImage}
                            className="p-3 bg-red-500 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          <Camera size={24} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 mt-1">Adjuntar evidencia visual</span>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">PNG, JPG (máx. 5MB)</span>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setShowEvidence(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all text-[15px]"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={handleEvidenceSubmit}
                      disabled={!canSubmit || submitting}
                      className={`flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg text-[15px] ${
                        canSubmit && !submitting 
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/25 hover:-translate-y-1 hover:shadow-blue-500/35" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {submitting ? "Publicando..." : <><Send size={18} /> Publicar evidencia</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ══ MAIN CONTENT ══ */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto">

          {/* ── PHASE: DOING ── */}
          {phase === "doing" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Top bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 capitalize mb-1">
                    {dayName}
                  </h1>
                  <p className="text-slate-500 font-medium text-lg">
                    {dateStr}
                  </p>
                </div>
                <div className="shrink-0">
                  <StreakWidget streak={streak} showCalendar hideCalendarOnMobile activeDays={weeklyActiveDays} />
                </div>
              </div>

              {/* ── Challenge hero ── */}
              <div className="relative group overflow-hidden bg-slate-900 rounded-[40px] border border-white/5 shadow-2xl shadow-blue-900/20 p-8 md:p-14 transition-all hover:shadow-blue-900/30">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/20 to-transparent pointer-events-none" />
                <div 
                  className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none blur-[100px]" 
                  style={{ background: typeMeta.color }}
                />
                
                <div className="relative z-10 w-full">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-white/90 text-sm font-semibold backdrop-blur-md">
                      <TypeIcon size={16} className="text-blue-400" />
                      {typeMeta.label}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/20 rounded-full text-blue-300 text-sm font-bold backdrop-blur-md">
                      <Zap size={14} className="fill-blue-400 text-blue-400" />
                      +50 XP
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-white/40 text-sm font-medium backdrop-blur-md">
                      <Clock size={14} />
                      ~5 min
                    </div>
                  </div>

                  {/* Title & Description */}
                  {loadingChallenge ? (
                    <div className="space-y-4">
                      <div className="h-10 bg-white/10 rounded-xl w-2/3 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-5 bg-white/5 rounded-lg w-full animate-pulse" />
                        <div className="h-5 bg-white/5 rounded-lg w-4/5 animate-pulse" />
                      </div>
                    </div>
                  ) : errorDetails ? (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[28px] max-w-xl">
                      <p className="text-red-400 font-bold mb-4 flex items-center gap-2">
                        <AlertCircle size={20} />
                        No se pudo cargar la misión
                      </p>
                      <button 
                        onClick={() => { setErrorDetails(null); setLoadingChallenge(true); fetchChallenge() }} 
                        className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-bold transition-all"
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  ) : (
                    <div className="max-w-3xl">
                      <h2 className="text-white text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                        {challenge?.title ?? "Misión del día"}
                      </h2>
                      <p className="text-white/70 text-base md:text-lg leading-relaxed mb-12">
                        {challenge?.description ?? "Preparando tu reto financiero para hoy..."}
                      </p>
                    </div>
                  )}

                  {/* Action Button inside card */}
                  {!loadingChallenge && !errorDetails && (
                    <motion.button 
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEvidence(true)}
                      className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-[24px] font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all border border-blue-400/20"
                    >
                      <SquareCheckBig size={22} className="group-hover:rotate-12 transition-transform" />
                      Completar mi misión hoy
                    </motion.button>
                  )}
                </div>
              </div>

              {/* ── Info cards ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Cómo completarlo */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative group p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-8">
                      <PenLine size={24} className="text-white" />
                    </div>
                    <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-[0.2em] mb-3">Guía rápida</p>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-6">Tres pasos al éxito</h3>
                    
                    <div className="space-y-5">
                      {[
                        { icon: <Brain size={16} />, color: "text-indigo-500", bg: "bg-indigo-50", text: "Analiza el reto con atención" },
                        { icon: <SquareCheckBig size={16} />, color: "text-emerald-500", bg: "bg-emerald-50", text: "Realiza la acción financiera" },
                        { icon: <Send size={16} />, color: "text-blue-500", bg: "bg-blue-50", text: "Publica y gana XP" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-8 h-8 ${item.bg} ${item.color} rounded-lg flex items-center justify-center shrink-0`}>
                            {item.icon}
                          </div>
                          <span className="text-[15px] font-bold text-slate-600">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Sabías que */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative group p-8 rounded-[32px] bg-slate-900 border border-white/5 shadow-2xl shadow-slate-950/20 overflow-hidden"
                >
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full -br-10 -bb-10 group-hover:scale-110 transition-transform blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/20 mb-8 transform group-hover:rotate-12 transition-transform">
                      <Lightbulb size={24} className="text-slate-900" />
                    </div>
                    <p className="text-[11px] font-extrabold text-amber-400 uppercase tracking-[0.2em] mb-3">¿Sabías qué?</p>
                    <h3 className="text-xl font-extrabold text-white mb-4">El poder de la consistencia</h3>
                    <p className="text-white/60 text-[15px] leading-relaxed mb-8">
                       Los usuarios que completan sus misiones diarias tienen <span className="text-amber-400 font-bold">3 veces más probabilidad</span> de cumplir sus metas financieras reales en menos de 6 meses.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-[11px] font-extrabold text-amber-400 uppercase">3x más resultados</span>
                      <span className="px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-[11px] font-extrabold text-emerald-400 uppercase">Top 10% Bizen</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}


          {/* ── PHASE: DAILY WRAP ── */}
          {phase === "wrap" && (
            <motion.div 
              ref={wrapRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[800px] mx-auto"
            >
              <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-8 md:p-16 text-center border border-white/5 shadow-2xl">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_0%,rgba(15,98,254,0.18)_0%,transparent_65%),radial-gradient(ellipse_at_15%_100%,rgba(99,102,241,0.12)_0%,transparent_55%)] pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Floating trophy */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/30"
                  >
                    <Trophy size={44} className="text-white" strokeWidth={2.5} />
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-ping opacity-20" />
                  </motion.div>

                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                    ¡Misión completada!
                  </h2>

                  <div className="mb-10 mt-6 max-w-md mx-auto">
                    <XPProgressCard
                      xpEarned={earnedRewards?.xpAdded || 50}
                      initialXP={earnedRewards ? Math.max(0, earnedRewards.newTotalXP - earnedRewards.xpAdded) : Math.max(0, (dbProfile?.xp || 0) - (submitted ? 50 : 0))}
                      delay={600}
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 border border-white/10 rounded-full mb-8">
                    <Flame size={18} className="text-blue-400" />
                    <span className="text-sm font-bold text-blue-300">
                      {streak} {streak === 1 ? "día" : "días"} seguidos
                    </span>
                  </div>

                  <p className="text-white/50 text-[15px] max-w-md mx-auto leading-relaxed mb-10">
                    Cada día que practicas es un paso firme hacia tu libertad financiera. Tu constancia es tu mejor activo.
                  </p>

                  <div className="h-px bg-white/10 mb-10" />

                  <div className="flex flex-col gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => submitted ? null : (setShowEvidence(true))}
                      className={`flex items-center justify-center gap-3 w-full py-5 rounded-[22px] font-bold text-lg transition-all ${
                        submitted 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-default" 
                          : "bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500"
                      }`}
                    >
                      {submitted ? <CheckCircle size={22} /> : <FileText size={22} />}
                      {submitted ? "Evidencia compartida correctamente" : "Publicar mi evidencia"}
                      {!submitted && <ArrowRight size={18} className="ml-2" />}
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewGroup}
                      className="flex items-center justify-center gap-3 w-full py-5 bg-white/5 border border-white/10 rounded-[22px] font-bold text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Users size={20} />
                      Ver mi grupo en el foro
                      <ArrowRight size={18} className="ml-2" />
                    </motion.button>
                  </div>

                  <button
                    onClick={() => setPhase("doing")}
                    className="mt-10 bg-transparent text-white/30 hover:text-white/60 font-bold text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>←</span> Ver la misión de nuevo
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

  )
}

