"use client"

import React, { useEffect, useState } from "react"
import { SummaryStepFields } from "@/types/lessonTypes"
import { motion, AnimatePresence } from "framer-motion"

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

function useCountUp(target: number, delay: number = 0, duration: number = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // ease-out cubic
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

const STAR_COLORS = {
  filled: { glow: "#FFB800", fill: "url(#starGold)", stroke: "#F59E0B" },
  empty: { glow: "transparent", fill: "#E5E7EB", stroke: "#D1D5DB" },
}

function AnimatedStar({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay }}
      style={{ filter: filled ? "drop-shadow(0 0 12px #FFB80080)" : "none" }}
    >
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <defs>
          <linearGradient id="starGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <motion.path
          d="M26 4l5.5 11.1 12.3 1.8-8.9 8.7 2.1 12.2L26 32.1l-11 5.8 2.1-12.2-8.9-8.7 12.3-1.8z"
          fill={filled ? "url(#starGold)" : "#E5E7EB"}
          stroke={filled ? "#F59E0B" : "#D1D5DB"}
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={{ scale: 0 }}
          animate={{ scale: filled ? [1, 1.25, 1] : 1 }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
        />
      </svg>
    </motion.div>
  )
}

export function SummaryStep({ step, onAnswered }: SummaryStepProps) {
  const stars: 0 | 1 | 2 | 3 = (step as any).starsEarned ?? 3
  const xpEarned = stars * XP_PER_STAR

  useEffect(() => {
    onAnswered({ isCompleted: true })
  }, [onAnswered])

  // XP count-up starts after stars animation (≈ 1.2s)
  const displayXP = useCountUp(xpEarned, 1400, 1000)

  const starMessages: Record<0 | 1 | 2 | 3, string> = {
    3: "¡Perfecto! Sin errores 🎯",
    2: "¡Muy bien! Casi perfecto ⭐",
    1: "¡Buen esfuerzo! Sigue practicando 💪",
    0: "Sigue intentándolo, ¡tú puedes! 🔥",
  }

  return (
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
        gap: 28,
        padding: "24px 0",
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
          position: "absolute",
          inset: -20,
          background: "radial-gradient(circle, rgba(15,98,254,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(24px)",
          pointerEvents: "none",
        }} />
        <img
          src={(step as any).imageUrl || "/Lección%20completada.png"}
          alt="Lección completada"
          style={{
            width: "clamp(140px, 30vw, 220px)",
            height: "auto",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 12px 32px rgba(15,98,254,0.2))",
          }}
        />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{
          fontSize: "clamp(22px, 5vw, 36px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
          lineHeight: 1.2,
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {step.title}
      </motion.h2>

      {/* ⭐ Stars row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {[1, 2, 3].map((i) => (
            <AnimatedStar
              key={i}
              filled={i <= stars}
              delay={0.5 + i * 0.22}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: "#6B7280",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {starMessages[stars]}
        </motion.p>
      </motion.div>

      {/* 🏆 XP Reward Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 20 }}
        style={{
          background: "linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%)",
          borderRadius: 24,
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          boxShadow: "0 8px 32px rgba(15, 98, 254, 0.35)",
          minWidth: 200,
        }}
      >
        <span style={{
          fontSize: 12,
          fontWeight: 800,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'Montserrat', sans-serif",
        }}>
          XP Ganado
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <motion.span
            style={{
              fontSize: "clamp(42px, 10vw, 64px)",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              fontFamily: "'Montserrat', sans-serif",
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            +{displayXP}
          </motion.span>
          <span style={{
            fontSize: 20,
            fontWeight: 800,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "'Montserrat', sans-serif",
          }}>
            XP
          </span>
        </div>
        <span style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
        }}>
          {stars} ⭐ × {XP_PER_STAR} XP = {xpEarned} XP
        </span>
      </motion.div>

      {/* Body text */}
      {step.body && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          style={{
            fontSize: "clamp(14px, 1.6vw, 16px)",
            color: "#6B7280",
            lineHeight: 1.7,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            maxWidth: 440,
          }}
        >
          {step.body.split("\n\n").map((line, i) => (
            <p key={i} style={{ margin: "0 0 8px", fontFamily: "'Montserrat', sans-serif" }}>{line}</p>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
