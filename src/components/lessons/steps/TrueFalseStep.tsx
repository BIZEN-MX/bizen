"use client"

import React, { useState, useEffect } from "react"
import { TrueFalseStepFields } from "@/types/lessonTypes"
import { motion, AnimatePresence } from "framer-motion"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { Check, X, CheckCircle2, XCircle, Lightbulb } from "lucide-react"
import { StepScenarioCard } from "../StepScenarioCard"

interface TrueFalseStepProps {
  step: TrueFalseStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string; imageUrl?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  selectedValue?: boolean
  isReviewStep?: boolean
  actionTrigger?: number
}

export function TrueFalseStep({
  step,
  onAnswered,
  selectedValue: initialValue,
  actionTrigger = 0,
}: TrueFalseStepProps) {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(initialValue)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const handleSelect = (value: boolean) => {
    if (hasChecked) return
    setSelectedValue(value)
    onAnswered({ isCompleted: false, canAction: true, answerData: { selectedValue: value } })
  }

  const handleCheck = () => {
    if (selectedValue === undefined || hasChecked) return
    setHasChecked(true)
    setShowFeedback(true)
    const isCorrect = selectedValue === step.correctValue
    if (isCorrect) playCorrectSound()
    else playIncorrectSound()
    onAnswered({ isCompleted: true, isCorrect, answerData: { selectedValue } })
  }

  useEffect(() => {
    if (actionTrigger && actionTrigger > 0 && selectedValue !== undefined && !hasChecked) handleCheck()
  }, [actionTrigger])

  // Determines styles for each button
  const getStyles = (value: boolean) => {
    const isSelected = selectedValue === value
    const isCorrect = value === step.correctValue

    if (!showFeedback) {
      if (isSelected) {
        return {
          bg: value ? "linear-gradient(135deg, #f0fdf4, #dcfce7)" : "linear-gradient(135deg, #fef2f2, #fee2e2)",
          border: value ? "#22c55e" : "#ef4444",
          color: value ? "#15803d" : "#b91c1c",
          shadow: value ? "0 4px 16px rgba(34,197,94,0.2)" : "0 4px 16px rgba(239,68,68,0.2)",
          iconBg: value ? "#dcfce7" : "#fee2e2",
          iconBorder: value ? "#22c55e" : "#ef4444",
        }
      }
      return {
        bg: "#FFFFFF",
        border: "#E5E7EB",
        color: "#374151",
        shadow: "0 2px 0 0 #E5E7EB",
        iconBg: "#F3F4F6",
        iconBorder: "#E5E7EB",
      }
    }

    // After check
    if (isCorrect) {
      return {
        bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
        border: "#3B82F6",
        color: "#1D4ED8",
        shadow: "0 4px 20px rgba(59,130,246,0.2)",
        iconBg: "#DBEAFE",
        iconBorder: "#3B82F6",
      }
    }
    if (isSelected && !isCorrect) {
      return {
        bg: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
        border: "#EF4444",
        color: "#DC2626",
        shadow: "0 4px 20px rgba(239,68,68,0.15)",
        iconBg: "#FEE2E2",
        iconBorder: "#EF4444",
      }
    }
    return {
      bg: "#FAFAFA",
      border: "#E5E7EB",
      color: "#9CA3AF",
      shadow: "none",
      iconBg: "#F3F4F6",
      iconBorder: "#E5E7EB",
    }
  }

  const explanationText = (step as any).explanation

  const renderButton = (value: boolean) => {
    const styles = getStyles(value)
    const isSelected = selectedValue === value
    const isCorrect = value === step.correctValue

    return (
      <motion.button
        whileHover={!hasChecked ? { y: -2, boxShadow: value ? "0 8px 24px rgba(34,197,94,0.15)" : "0 8px 24px rgba(239,68,68,0.15)" } : {}}
        whileTap={!hasChecked ? { scale: 0.97, y: 2 } : {}}
        onClick={() => handleSelect(value)}
        disabled={hasChecked}
        style={{
          flex: 1,
          padding: "clamp(16px, 3vw, 24px) clamp(14px, 3vw, 24px)",
          borderRadius: 20,
          background: styles.bg,
          border: `2px solid ${styles.border}`,
          boxShadow: styles.shadow,
          color: styles.color,
          fontSize: "clamp(17px, 3.5vw, 22px)",
          fontWeight: 700,
          cursor: hasChecked ? "not-allowed" : "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          outline: "none",
          opacity: showFeedback && !isSelected && !isCorrect ? 0.45 : 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle animated background wave on select */}
        {isSelected && !showFeedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute", width: 60, height: 60, borderRadius: "50%",
              background: value ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Icon circle */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: styles.iconBg, border: `2px solid ${styles.iconBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
          position: "relative", zIndex: 1,
        }}>
          {showFeedback ? (
            isCorrect
              ? <CheckCircle2 size={26} color="#10B981" strokeWidth={2.5} />
              : isSelected
                ? <XCircle size={26} color="#EF4444" strokeWidth={2.5} />
                : (value ? <Check size={24} strokeWidth={2.5} /> : <X size={24} strokeWidth={2.5} />)
          ) : (
            value
              ? <Check size={26} strokeWidth={3} color={isSelected ? "#22c55e" : "#9CA3AF"} />
              : <X size={26} strokeWidth={3} color={isSelected ? "#ef4444" : "#9CA3AF"} />
          )}
        </div>

        <span style={{ position: "relative", zIndex: 1 }}>
          {value ? "Verdadero" : "Falso"}
        </span>
      </motion.button>
    )
  }

  return (
    <div style={{
      width: "100%", maxWidth: 540, margin: "0 auto",
      display: "flex", flexDirection: "column",
      gap: "clamp(14px, 4vw, 28px)",
    }}>
      {/* ── Question ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 2vw, 14px)" }}>
        <ExerciseInstruction type="true_false" />
        <motion.h3
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 500, color: "#111827", margin: 0, lineHeight: 1.35 }}
        >
          {step.statement}
        </motion.h3>
        {step.description && <StepScenarioCard text={step.description} />}
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "clamp(10px, 2vw, 16px)", width: "100%" }}>
        {renderButton(true)}
        {renderButton(false)}
      </div>

      {/* ── Explanation banner ── */}
      <AnimatePresence>
        {showFeedback && explanationText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "flex", gap: 12, padding: "14px 18px", borderRadius: 16,
              background: selectedValue === step.correctValue ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
              border: `1.5px solid ${selectedValue === step.correctValue ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            <Lightbulb size={18} color={selectedValue === step.correctValue ? "#10b981" : "#ef4444"} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 14, lineHeight: 1.55, color: "#374151", fontWeight: 450 }}>{explanationText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
