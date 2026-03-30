"use client"

import React, { useState, useEffect } from "react"
import { McqStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react"
import { StepScenarioCard } from "../StepScenarioCard"
import { InlineSegments, parseInlineSegments } from "../SmartText"

interface MCQStepProps {
  step: McqStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; reviewSourceStepId?: string; imageUrl?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  selectedOptionId?: string
  actionTrigger?: number
  isContinueEnabled?: boolean
}

export function MCQStep({ step, onAnswered, selectedOptionId: initialSelected, actionTrigger = 0, isContinueEnabled }: MCQStepProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(initialSelected)
  const [checkedOptionId, setCheckedOptionId] = useState<string | undefined>()
  const [showFeedback, setShowFeedback] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const handleSelect = (optionId: string) => {
    if (hasChecked && isContinueEnabled) return
    setSelectedOptionId(optionId)
    onAnswered({ isCompleted: false, canAction: true, answerData: { selectedOptionId: optionId } })
  }

  const handleCheck = () => {
    if (!selectedOptionId || hasChecked) return
    const selectedOption = step.options.find((opt) => opt.id === selectedOptionId)
    const isCorrect = selectedOption?.isCorrect ?? false
    setHasChecked(true)
    setCheckedOptionId(selectedOptionId)
    setShowFeedback(true)
    if (isCorrect) playCorrectSound()
    else playIncorrectSound()
    onAnswered({ isCompleted: true, isCorrect, answerData: { selectedOptionId } })
  }

  useEffect(() => {
    if (actionTrigger > 0 && selectedOptionId && !hasChecked) handleCheck()
  }, [actionTrigger])

  const isCorrectAnswer = checkedOptionId
    ? step.options.find((o) => o.id === checkedOptionId)?.isCorrect
    : undefined

  const explanationText = step.options.find((o) => o.isCorrect)?.explanation ?? (step as any).explanation

  return (
    <div style={{ width: "100%", maxWidth: 540, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(12px, 4vw, 28px)" }}>

      {/* ── Question header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 2.5vw, 20px)" }}>
        <ExerciseInstruction type="mcq" />
        <motion.h3
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 500, color: "#111827", margin: 0, lineHeight: 1.35 }}
        >
          <InlineSegments segments={parseInlineSegments(step.question)} />
        </motion.h3>
        {step.description && <StepScenarioCard text={step.description} />}
      </div>

      {/* ── Options ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(7px, 1.5vw, 12px)" }}>
        {step.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id
          const isChecked = checkedOptionId === option.id
          const isCorrect = option.isCorrect
          const isWrongAnswer = showFeedback && isChecked && !isCorrect
          const isCorrectReveal = showFeedback && isCorrect && checkedOptionId && !step.options.find((o) => o.id === checkedOptionId)?.isCorrect

          let bg = "#FFFFFF"
          let border = "#E5E7EB"
          let color = "#374151"
          let shadow = "0 2px 0 0 #E5E7EB"
          let labelBg = "#F3F4F6"
          let labelColor = "#6B7280"
          let iconNode: React.ReactNode = null

          if (showFeedback) {
            if (isChecked && isCorrect) {
              bg = "#EFF6FF"; border = "#3B82F6"; color = "#1D4ED8"
              shadow = "0 2px 0 0 #93C5FD"; labelBg = "#DBEAFE"; labelColor = "#1D4ED8"
              iconNode = <CheckCircle2 size={22} color="#10B981" strokeWidth={2.5} />
            } else if (isChecked && !isCorrect) {
              bg = "#FEF2F2"; border = "#EF4444"; color = "#DC2626"
              shadow = "0 2px 0 0 #FCA5A5"; labelBg = "#FEE2E2"; labelColor = "#DC2626"
              iconNode = <XCircle size={22} color="#EF4444" strokeWidth={2.5} />
            } else if (isCorrectReveal) {
              bg = "#EFF6FF"; border = "#3B82F6"; color = "#1D4ED8"
              shadow = "0 2px 0 0 #93C5FD"; labelBg = "#DBEAFE"; labelColor = "#1D4ED8"
            } else {
              color = "#9CA3AF"; shadow = "none"
            }
          } else if (isSelected) {
            bg = "#F0F6FF"; border = "#0F62FE"; color = "#1D4ED8"
            shadow = "0 2px 0 0 #93C5FD"; labelBg = "#DBEAFE"; labelColor = "#1D4ED8"
          }

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={!hasChecked ? { y: -1, boxShadow: `0 4px 16px rgba(15,98,254,0.1)` } : {}}
              whileTap={!hasChecked ? { y: 1 } : {}}
              onClick={() => handleSelect(option.id)}
              disabled={hasChecked && isContinueEnabled}
              style={{
                display: "flex", alignItems: "center",
                gap: "clamp(8px, 1.5vw, 14px)", width: "100%",
                padding: "clamp(10px, 2vw, 14px) clamp(12px, 3vw, 20px)",
                borderRadius: 16, background: bg,
                border: `2px solid ${border}`, boxShadow: shadow,
                cursor: (hasChecked && isContinueEnabled) ? "not-allowed" : "pointer",
                textAlign: "left", color,
                transition: "all 0.2s ease", outline: "none",
                opacity: showFeedback && !isChecked && !isCorrect ? 0.45 : 1,
              }}
            >
              {/* Label badge */}
              <div style={{
                width: "clamp(26px, 8vw, 32px)", height: "clamp(26px, 8vw, 32px)",
                borderRadius: 10, background: labelBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: labelColor, flexShrink: 0,
                border: `1.5px solid ${border}`, transition: "all 0.2s ease",
              }}>
                {['A','B','C','D','E','F'][index]}
              </div>

              {/* Text */}
              <span style={{ flex: 1, fontSize: "clamp(13px, 3vw, 16px)", fontWeight: 500, lineHeight: 1.35 }}>
                {option.label}
              </span>

              {/* Feedback icon */}
              <AnimatePresence>
                {showFeedback && isChecked && iconNode && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 360, damping: 20 }}
                    style={{ flexShrink: 0 }}
                  >
                    {iconNode}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* ── Feedback explanation banner ── */}
      <AnimatePresence>
        {showFeedback && explanationText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "flex", gap: 12, padding: "14px 18px", borderRadius: 16,
              background: isCorrectAnswer ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
              border: `1.5px solid ${isCorrectAnswer ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            <Lightbulb size={18} color={isCorrectAnswer ? "#10b981" : "#ef4444"} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 14, lineHeight: 1.55, color: "#374151", fontWeight: 450 }}>{explanationText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
