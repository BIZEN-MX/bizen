"use client"

import React, { useEffect, useRef, useState } from "react"
import { SummaryStepFields } from "@/types/lessonTypes"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel } from "@/lib/xp"

interface SummaryStepProps {
  step: SummaryStepFields & {
    id: string
    title?: string
    description?: string
    fullScreen?: boolean
    continueLabel?: string
    imageUrl?: string
    starsEarned?: 0 | 1 | 2 | 3
  }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
}

const XP_PER_STAR = 5

// --- Confetti helper ---
function useConfetti(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const pieces: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; rotV: number }[] = []
    const colors = ["#0F62FE", "#4A9EFF", "#FFB800", "#FF6B6B", "#00D084", "#A855F7", "#F97316"]
    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.3,
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.3,
      })
    }

    let frame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pieces) {
        p.x += p.vx
        p.vy += 0.45
        p.y += p.vy
        p.rotation += p.rotV
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - p.y / (canvas.height * 1.1))
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55)
        ctx.restore()
      }
      if (pieces.some(p => p.y < canvas.height * 1.2)) {
        frame = requestAnimationFrame(animate)
      }
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [active])
  return canvasRef
}

// --- Animated number count-up ---
function useCountUp(target: number, delay: number = 0, duration: number = 1000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, delay, duration])
  return value
}

// --- Single animated star ---
function AnimatedStar({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={filled ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0.85, rotate: 0, opacity: 0.25 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay }}
      style={{ filter: filled ? "drop-shadow(0 0 12px rgba(255,184,0,0.6))" : "none" }}
    >
      <img
        src="/stars.png"
        alt={filled ? "Estrella ganada" : "Estrella vacía"}
        style={{ width: 54, height: 54, objectFit: "contain" }}
      />
    </motion.div>
  )
}

// --- XP Progress Bar component ---
function XPBar({ initialXP, xpEarned, delay }: { initialXP: number; xpEarned: number; delay: number }) {
  const currentLevel = calculateLevel(initialXP)
  const xpInLevel = xpInCurrentLevel(initialXP)
  const xpNeeded = totalXpForNextLevel(initialXP)

  const startPct = Math.min(100, (xpInLevel / xpNeeded) * 100)
  const gainedXP = useCountUp(xpEarned, delay + 200, 900)
  const endPct = Math.min(100, ((xpInLevel + gainedXP) / xpNeeded) * 100)

  const newLevel = calculateLevel(initialXP + xpEarned)
  const leveledUp = newLevel > currentLevel

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        borderRadius: 20,
        padding: "20px 24px",
        width: "100%",
        maxWidth: 360,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(15,98,254,0.35)",
        border: "1.5px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: -20, right: -20, width: 100, height: 100,
        background: "radial-gradient(circle, rgba(15,98,254,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* XP Earned big number */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: delay / 1000 + 0.1 }}
          style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}
        >
          <span style={{
            fontSize: 56,
            fontWeight: 950,
            color: "#FFF",
            lineHeight: 1,
            fontFamily: "'Montserrat', sans-serif",
            textShadow: "0 0 30px rgba(96,165,250,0.5)",
          }}>
            +{gainedXP}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#93c5fd", fontFamily: "'Montserrat', sans-serif" }}>XP</span>
        </motion.div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>
          XP ganado
        </div>
      </div>

      {/* Level labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Nivel {leveledUp ? newLevel : currentLevel}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay / 1000 + 0.5 }}
          style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd" }}
        >
          {Math.min(xpNeeded, xpInLevel + gainedXP)} / {xpNeeded} XP
        </motion.span>
      </div>

      {/* Progress bar track */}
      <div style={{
        width: "100%", height: 14,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 99, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
      }}>
        {/* Base progress */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${startPct}%`,
          background: "rgba(255,255,255,0.15)",
          zIndex: 1,
        }} />
        {/* Animated fill */}
        <motion.div
          initial={{ width: `${startPct}%` }}
          animate={{ width: `${endPct}%` }}
          transition={{ delay: delay / 1000 + 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa, #fff)",
            borderRadius: 99,
            zIndex: 2,
            position: "relative",
            boxShadow: "0 0 16px rgba(96,165,250,0.7)",
          }}
        >
          {/* Shimmer */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ delay: delay / 1000 + 1.2, duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              borderRadius: 99,
            }}
          />
        </motion.div>
      </div>

      {/* Level up badge */}
      <AnimatePresence>
        {leveledUp && gainedXP === xpEarned && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
            style={{
              marginTop: 12,
              background: "linear-gradient(135deg, #FFB800, #FF6B6B)",
              borderRadius: 99,
              padding: "6px 16px",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.04em",
              boxShadow: "0 4px 16px rgba(255,184,0,0.4)",
            }}
          >
            🎉 ¡Subiste al nivel {newLevel}!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- Main SummaryStep ---
export function SummaryStep({ step, onAnswered }: SummaryStepProps) {
  const { dbProfile, user } = useAuth()
  const stars: 0 | 1 | 2 | 3 = (step as any).starsEarned ?? 3

  // Snapshot XP on mount so it doesn't jump if AuthContext updates in the background
  const [xpSnapshot, setXpSnapshot] = useState<number | null>(null)

  useEffect(() => {
    if (dbProfile?.xp !== undefined && xpSnapshot === null) {
      setXpSnapshot(dbProfile.xp)
    }
  }, [dbProfile])

  // XP calculation logic matched to backend (Improvement rule)
  const lessonIdStr = step.id
  const prevStars = (user?.user_metadata?.lessonStars?.[lessonIdStr] ?? 0) as 0 | 1 | 2 | 3
  const isRepeated = (step as any).isRepeat ?? false

  const xpEarned = !isRepeated
    ? (stars * XP_PER_STAR)
    : Math.max(0, (stars - prevStars) * XP_PER_STAR)

  // Confetti fires once on mount — only if stars > 0
  const [confettiActive, setConfettiActive] = useState(false)
  const canvasRef = useConfetti(confettiActive)

  useEffect(() => {
    onAnswered({ isCompleted: true })
    if (stars > 0) {
      const t = setTimeout(() => setConfettiActive(true), 300)
      return () => clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const starMessages: Record<0 | 1 | 2 | 3, string> = {
    3: "¡Excelente trabajo! 🎯",
    2: "¡Muy bien! Casi perfecto ⭐",
    1: "¡Buen esfuerzo! Sigue practicando 💪",
    0: "Sigue intentándolo, ¡tú puedes! 🔥",
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 24,
          padding: "16px 0 32px",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {/* Celebration image */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          style={{ position: "relative" }}
        >
          <div style={{
            position: "absolute", inset: -20,
            background: "radial-gradient(circle, rgba(15,98,254,0.18) 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(24px)", pointerEvents: "none",
          }} />
          <img
            src={(step as any).imageUrl || "/Lección%20completada.png"}
            alt="Lección completada"
            style={{
              width: "clamp(120px, 28vw, 200px)",
              height: "auto",
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 12px 32px rgba(15,98,254,0.25))",
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: "clamp(22px, 5vw, 34px)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            lineHeight: 1.2,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {step.title}
        </motion.h2>

        {/* ⭐ Stars row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {[1, 2, 3].map((i) => (
              <AnimatedStar key={i} filled={i <= stars} delay={0.5 + i * 0.22} />
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#6B7280", fontFamily: "'Inter', sans-serif" }}
          >
            {starMessages[stars]}
          </motion.p>
        </motion.div>

        {/* 🏆 XP Reward block */}
        {xpEarned > 0 ? (
          <div style={{ width: "100%", maxWidth: 380, padding: "0 16px", boxSizing: "border-box" }}>
            <XPBar
              initialXP={xpSnapshot ?? dbProfile?.xp ?? 0}
              xpEarned={xpEarned}
              delay={900}
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
              borderRadius: 16,
              padding: "16px 24px",
              textAlign: "center",
              border: "2px dashed #94a3b8",
              maxWidth: 340,
            }}
          >
            <div style={{ fontSize: 28 }}>😅</div>
            <p style={{ margin: "8px 0 0", fontSize: 14, fontWeight: 700, color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
              Sin XP esta vez — ¡intenta no cometer errores!
            </p>
          </motion.div>
        )}

        {/* Body text */}
        {step.body && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            style={{
              fontSize: "clamp(13px, 1.6vw, 15px)",
              color: "#6B7280",
              lineHeight: 1.7,
              fontWeight: 500,
              maxWidth: 440,
              padding: "0 16px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {step.body.split("\n\n").map((line, i) => (
              <p key={i} style={{ margin: "0 0 8px", fontFamily: "'Inter', sans-serif" }}>{line}</p>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
