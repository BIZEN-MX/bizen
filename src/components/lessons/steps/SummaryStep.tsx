"use client"

import React, { useEffect, useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Clock, Target, ArrowRight, RotateCcw, Download, CheckCircle2, Sparkles, Zap, Flame, ShieldCheck, RefreshCcw, Rocket } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { generateBizenCertificate } from "@/utils/certificateGenerator"
import { haptic } from "@/utils/hapticFeedback"
import { playCorrectSound } from "../lessonSounds"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel } from "@/lib/xp"

interface SummaryStepProps {
  step: {
    id: string
    title?: string
    body?: string
    imageUrl?: string
    starsEarned?: 0 | 1 | 2 | 3
    isRepeat?: boolean
    accuracy?: number
    totalTime?: number
    isExam?: boolean
  }
  onAnswered: (result: { isCompleted: boolean; canAction?: boolean }) => void
  onRestart?: () => void
  actionTrigger?: number
}

const BLUE = "#0F62FE"
const SLATE_DARK = "#0f172a"
const SLATE_BODY = "#475569"
const XP_PER_STAR = 5
const starMessages: Record<number, React.ReactNode> = {
  0: <div style={{ display: "flex", alignItems: "center", gap: 8 }}>Sigue intentándolo <Flame size={20} color={BLUE} /></div>,
  1: <div style={{ display: "flex", alignItems: "center", gap: 8 }}>¡Vas muy bien! <Zap size={20} color={BLUE} /></div>,
  2: <div style={{ display: "flex", alignItems: "center", gap: 8 }}>¡Excelente progreso! <Rocket size={20} color={BLUE} /></div>,
  3: <div style={{ display: "flex", alignItems: "center", gap: 8 }}>¡Perfección absoluta! <Sparkles size={20} color="#EAB308" /></div>,
}

// --- XP Bar Component ---
const XPBar = ({ initialXP, xpEarned, delay }: { initialXP: number; xpEarned: number; delay: number }) => {
  const [displayXP, setDisplayXP] = useState(0)
  const currentLevel = calculateLevel(initialXP)
  const xpInLevel = xpInCurrentLevel(initialXP)
  const xpNeeded = totalXpForNextLevel(initialXP)
  
  const startPct = Math.min(100, (xpInLevel / xpNeeded) * 100)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000
      const startTime = performance.now()
      
      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayXP(Math.round(eased * xpEarned))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, delay)
    return () => clearTimeout(timer)
  }, [xpEarned, delay])

  const endPct = Math.min(100, ((xpInLevel + displayXP) / xpNeeded) * 100)
  const newLevel = calculateLevel(initialXP + xpEarned)
  const leveledUp = newLevel > currentLevel && displayXP === xpEarned

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-[24px] p-6 w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden"
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: "white", lineHeight: 1 }}>+{displayXP}</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#93c5fd" }}>XP</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Experiencia ganada</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>NIVEL {currentLevel}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#93c5fd" }}>{Math.min(xpNeeded, xpInLevel + displayXP)} / {xpNeeded} XP</span>
      </div>

      <div style={{ height: 12, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${startPct}%`, background: "rgba(255,255,255,0.15)" }} />
        <div 
          style={{ 
            height: "100%", 
            width: `${endPct}%`, 
            background: "linear-gradient(90deg, #3b82f6, #60a5fa, #fff)", 
            borderRadius: 10,
            boxShadow: "0 0 15px rgba(96,165,250,0.5)",
            transition: "width 0.1s linear"
          }} 
        />
      </div>

      <AnimatePresence>
        {leveledUp && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="mt-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-[10px] text-center text-sm font-[800] text-[#0c0a09] flex items-center justify-center gap-2"
          >
            <Trophy size={18} fill="#0c0a09" />
            ¡NIVEL {newLevel} ALCANZADO!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ step, onAnswered, onRestart, actionTrigger }) => {
  const { user, dbProfile } = useAuth()
  const userEmail = user?.email?.toLowerCase() || ""
  const isAnahuac = userEmail.endsWith('@anahuac.mx') || userEmail.endsWith('@bizen.mx')
  const [phase, setPhase] = useState<'celebration' | 'stats'>('celebration')
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stars = step.starsEarned ?? 3
  const isExam = step.isExam ?? false
  const accuracy = step.accuracy ?? 100
  const isPassed = accuracy >= 50
  const isRepeat = step.isRepeat ?? false

  const prevStars = (user?.user_metadata?.lessonStars?.[step.id] ?? 0) as 0 | 1 | 2 | 3
  const xpEarned = (!isRepeat && !isExam)
    ? (stars * XP_PER_STAR)
    : (!isExam ? Math.max(0, (stars - prevStars) * XP_PER_STAR) : 0)

  useEffect(() => {
    onAnswered({ isCompleted: false, canAction: true })
    if (phase === 'celebration') {
      playCorrectSound()
      haptic.success()
    }
  }, [])

  useEffect(() => {
    if (actionTrigger && actionTrigger > 0) {
      if (phase === 'celebration') {
        setPhase('stats')
        onAnswered({ isCompleted: true })
      }
    }
  }, [actionTrigger, phase, onAnswered])

  // Confetti Animation
  useEffect(() => {
    if (phase !== 'celebration') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []
    const colors = ["#0F62FE", "#3b82f6", "#60a5fa", "#fbbf24", "#ffffff"]

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 2,
        angle: Math.random() * 360,
        rotation: Math.random() * 0.2 - 0.1,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.y += p.speed
        p.angle += p.rotation
        if (p.y > canvas.height) p.y = -20
        
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [phase])

  const handleDownloadCertificate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsGenerating(true)
    try {
      await generateBizenCertificate({
        studentName: user?.user_metadata?.full_name || "Estudiante BIZEN",
        topicTitle: step.title || "Graduación BIZEN",
        accuracy: accuracy,
        date: new Date().toLocaleDateString("es-MX", { day: 'numeric', month: 'long', year: 'numeric' }),
        lessonsCompleted: [step.id]
      })
      haptic.success()
    } catch (err) {
      console.error("Error generating certificate:", err)
    } finally {
      setIsGenerating(false)
    }
  }


  const AnimatedStarLocal = ({ filled, delay }: { filled: boolean; delay: number }) => (
    <motion.div
      initial={{ scale: 0, rotate: -25, opacity: 0 }}
      animate={filled ? {
        scale: [0, 1.25, 1],
        rotate: 0,
        opacity: 1
      } : {
        scale: 1,
        rotate: 0,
        opacity: 0.35
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
    >
      <Star size={64} fill={filled ? "#EAB308" : "#E2E8F0"} stroke={filled ? "#F59E0B" : "#CBD5E1"} strokeWidth={2} />
    </motion.div>
  )

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
      background: phase === 'celebration' ? "#ffffff" : "#020617",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.6s ease"
    }}>
      <AnimatePresence mode="wait">
        {phase === 'celebration' ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, zIndex: 10, textAlign: "center" }}
          >
            <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ position: "relative" }}
            >
              <div className={`w-[130px] h-[130px] rounded-full flex items-center justify-center ${isAnahuac ? 'bg-primary shadow-[0_20px_40px_rgba(255,89,0,0.3)]' : 'bg-gradient-to-br from-[#0F62FE] to-blue-500 shadow-[0_20px_40px_rgba(15,98,254,0.3)]'}`}>
                <Trophy size={60} color="white" />
              </div>
            </motion.div>

            {!isExam && (
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <AnimatedStarLocal key={i} filled={i <= stars} delay={0.4 + i * 0.15} />
                ))}
              </div>
            )}

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
              <h2 style={{ fontSize: 36, fontWeight: 950, color: SLATE_DARK, margin: 0 }}>
                {isExam ? "Evaluación Completada" : "Lección Completada!"}
              </h2>
              {!isExam && (
                <div style={{ fontSize: 18, fontWeight: 700, color: BLUE, marginTop: 8 }}>{starMessages[stars]}</div>
              )}
              {isExam && (
                 <div style={{ fontSize: 18, fontWeight: 700, color: BLUE, marginTop: 8 }}>
                   {isPassed ? "¡HAS APROBADO LA CERTIFICACIÓN!" : "NO SE HA ALCANZADO LA PUNTUACIÓN MÍNIMA"}
                 </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", alignItems: "stretch", gap: 24, zIndex: 10 }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>ANÁLISIS DE RENDIMIENTO</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "white", margin: 0 }}>{step.title || "Resumen Final"}</h2>
            </div>

            {!isExam && (
              <XPBar initialXP={dbProfile?.xp ?? 0} xpEarned={xpEarned} delay={300} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-[20px] p-[20px_12px] border border-white/10 flex flex-col items-center">
                <Target size={20} color="#60a5fa" className="mb-2" />
                <div className="text-2xl font-black text-white">{accuracy}%</div>
                <div className="text-xs font-bold text-slate-400 uppercase">Precisión</div>
              </div>
              <div className="bg-white/5 rounded-[20px] p-[20px_12px] border border-white/10 flex flex-col items-center">
                <Clock size={20} color="#60a5fa" className="mb-2" />
                <div className="text-2xl font-black text-white">
                  {Math.floor((step.totalTime || 0) / 60)}:{( (step.totalTime || 0) % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase">Tiempo</div>
              </div>
            </div>

            {isExam && isPassed && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`rounded-[24px] p-7 flex flex-col items-center gap-5 text-center border-[1.5px] ${isAnahuac ? 'bg-[#431A03] border-primary/30' : 'bg-gradient-to-br from-blue-900 to-indigo-950 border-blue-400/30'}`}
              >
                <CheckCircle2 size={40} color="#10b981" />
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: 0 }}>¡GRADUACIÓN EXITOSA!</h3>
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isGenerating}
                  style={{
                    width: "100%", height: 50, borderRadius: 16, background: "white", color: "#0f172a",
                    fontSize: 14, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                  }}
                >
                  {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <><Download size={18} /> DESCARGAR PDF</>}
                </button>
              </motion.div>
            )}

            {onRestart && (
               <button 
                  onClick={onRestart}
                  style={{
                    width: "100%", height: 48, borderRadius: 16, background: "transparent", color: "rgba(255,255,255,0.5)",
                    fontSize: 13, fontWeight: 700, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                  }}
                >
                  <RotateCcw size={16} /> Repetir Lección
                </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
