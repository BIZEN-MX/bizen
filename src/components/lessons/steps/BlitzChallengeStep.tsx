"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Zap, Clock } from "lucide-react"
import { BlitzChallengeStepFields, BaseLessonStep } from "@/types/lessonTypes"
import { SmartText } from "../SmartText"
import { haptic } from "@/utils/hapticFeedback"
import { StepScenarioCard } from "../StepScenarioCard"
import { playCorrectSound } from "../lessonSounds"

interface BlitzChallengeStepProps {
  step: BaseLessonStep & BlitzChallengeStepFields
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger: number
  isContinueEnabled: boolean
}

// ── Circular countdown SVG ──────────────────────────────────────────────────
function CircularTimer({ timeLeft, timeLimit }: { timeLeft: number; timeLimit: number }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, timeLeft / timeLimit)
  const offset = circumference * (1 - pct)
  const isDanger = timeLeft <= 5
  const color = isDanger ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#10b981"

  return (
    <div style={{ position: "relative", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={60} height={60} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={30} cy={30} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
        <circle
          cx={30} cy={30} r={radius} fill="none"
          stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease", filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <motion.span
        key={timeLeft}
        animate={isDanger ? { scale: [1, 1.25, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{ fontSize: 18, fontWeight: 900, color, fontVariantNumeric: "tabular-nums", position: "relative", zIndex: 1 }}
      >
        {Math.max(0, timeLeft)}
      </motion.span>
    </div>
  )
}

export function BlitzChallengeStep({ step, onAnswered, actionTrigger, isContinueEnabled }: BlitzChallengeStepProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const TIME_LIMIT = step.timeLimit || 15
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const isSubmitted = isContinueEnabled

  useEffect(() => {
    if (!isSubmitted) {
      onAnswered({ isCompleted: false, canAction: selectedOptionId !== null })
    }
  }, [selectedOptionId, isSubmitted, onAnswered])

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isSubmitted, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      haptic.error()
      onAnswered({ isCompleted: true, isCorrect: false, answerData: { selectedOptionId: null, timedOut: true } })
    }
  }, [timeLeft, isSubmitted, onAnswered])

  useEffect(() => {
    if (actionTrigger > 0 && !isSubmitted && selectedOptionId !== null) {
      const selectedOption = step.options.find((o) => o.id === selectedOptionId)
      const isCorrect = selectedOption?.isCorrect === true
      if (isCorrect) playCorrectSound()
      onAnswered({ isCompleted: true, isCorrect, answerData: { selectedOptionId, timeLeft } })
    }
  }, [actionTrigger, isSubmitted, selectedOptionId, step.options, onAnswered, timeLeft])

  const timePercentage = (timeLeft / TIME_LIMIT) * 100
  const isDanger = timeLeft <= 5
  const timedOut = timeLeft === 0 && !isSubmitted

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "clamp(20px, 3.5vw, 28px)", maxWidth: 580, margin: "0 auto" }}>

      {/* ── Blitz header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "14px 20px", borderRadius: 22,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
          border: "1.5px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            style={{
              width: 40, height: 40, borderRadius: 14,
              background: "linear-gradient(135deg, #f59e0b22, #fbbf2422)",
              border: "1.5px solid #fbbf2433",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Zap size={20} color="#fbbf24" fill="#fbbf24" />
          </motion.div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>Reto Relámpago</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 1 }}>Responde antes de que acabe el tiempo</div>
          </div>
        </div>
        <CircularTimer timeLeft={timeLeft} timeLimit={TIME_LIMIT} />
      </motion.div>

      {/* ── Progress bar ── */}
      <div style={{ height: 4, borderRadius: 99, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <motion.div
          animate={{ width: `${timePercentage}%`, backgroundColor: isDanger ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#10b981" }}
          transition={{ duration: 1, ease: "linear" }}
          style={{ height: "100%", borderRadius: 99, boxShadow: isDanger ? "0 0 8px rgba(239,68,68,0.5)" : "none" }}
        />
      </div>

      {/* ── Question ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {step.description && <StepScenarioCard text={step.description} variant="case" />}
        <SmartText text={step.question || step.body || step.title || ""} fontSize="clamp(18px, 3.5vw, 22px)" />
      </div>

      {/* ── Options ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.5vw, 12px)" }}>
        {(step.options || []).map((option, index) => {
          const isSelected = selectedOptionId === option.id
          const answered = isSubmitted || timedOut

          let bg = "#FFFFFF"
          let border = "#E5E7EB"
          let color = "#374151"
          let shadow = "0 2px 0 0 #E5E7EB"
          let labelBg = "#F3F4F6"
          let labelColor = "#6B7280"
          let icon: React.ReactNode = null

          if (answered) {
            if (option.isCorrect) {
              bg = "#EFF6FF"; border = "#3B82F6"; color = "#1D4ED8"; shadow = "0 2px 0 0 #93C5FD"
              labelBg = "#DBEAFE"; labelColor = "#1D4ED8"
              icon = <CheckCircle2 size={22} color="#10B981" strokeWidth={2.5} />
            } else if (isSelected && !option.isCorrect) {
              bg = "#FEF2F2"; border = "#EF4444"; color = "#DC2626"; shadow = "0 2px 0 0 #FCA5A5"
              labelBg = "#FEE2E2"; labelColor = "#DC2626"
              icon = <XCircle size={22} color="#EF4444" strokeWidth={2.5} />
            } else {
              color = "#9CA3AF"; border = "#E5E7EB"; shadow = "none"; labelColor = "#D1D5DB"
            }
          } else if (isSelected) {
            bg = "#EFF6FF"; border = "#0F62FE"; color = "#1D4ED8"; shadow = "0 2px 0 0 #93C5FD"
            labelBg = "#DBEAFE"; labelColor = "#1D4ED8"
          }

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              whileTap={!answered ? { scale: 0.985 } : {}}
              onClick={() => { if (answered) return; haptic.light(); setSelectedOptionId(option.id) }}
              disabled={answered}
              style={{
                display: "flex", alignItems: "center",
                gap: "clamp(8px, 2vw, 14px)",
                width: "100%",
                padding: "clamp(10px, 2vw, 14px) clamp(12px, 3vw, 20px)",
                borderRadius: 16, background: bg,
                border: `2px solid ${border}`,
                boxShadow: shadow,
                cursor: answered ? "default" : "pointer",
                textAlign: "left", color,
                transition: "all 0.2s ease",
                outline: "none",
                opacity: answered && !option.isCorrect && !isSelected ? 0.45 : 1,
              }}
            >
              <div style={{
                width: "clamp(26px, 8vw, 32px)", height: "clamp(26px, 8vw, 32px)",
                borderRadius: 10, background: labelBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: labelColor, flexShrink: 0,
                border: `1.5px solid ${border}`,
                transition: "all 0.2s ease",
              }}>
                {['A','B','C','D','E','F'][index]}
              </div>
              <span style={{ flex: 1, fontSize: "clamp(13px, 3vw, 16px)", fontWeight: 500, lineHeight: 1.35 }}>
                {(option as any).label || (option as any).text}
              </span>
              <AnimatePresence>
                {answered && icon && (
                  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ flexShrink: 0 }}>
                    {icon}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* ── Timeout notice ── */}
      <AnimatePresence>
        {timedOut && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 18px", borderRadius: 14,
              background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.2)",
            }}
          >
            <Clock size={16} color="#ef4444" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#ef4444" }}>¡Se acabó el tiempo! La respuesta correcta está resaltada.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
