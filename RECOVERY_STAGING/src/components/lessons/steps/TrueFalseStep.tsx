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

  const explanationText = (step as any).explanation

  const renderButton = (value: boolean) => {
    const isSelected = selectedValue === value
    const isCorrect = value === step.correctValue

    let containerClasses = "flex-1 flex flex-col items-center gap-[12px] p-[clamp(16px,3vw,24px)_clamp(14px,3vw,24px)] rounded-[20px] border-2 text-[clamp(17px,3.5vw,22px)] font-bold transition-all duration-300 outline-none relative overflow-hidden "
    let iconClasses = "w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center transition-all duration-300 relative z-10 "
    
    if (!showFeedback) {
      if (isSelected) {
        containerClasses += value 
          ? "bg-gradient-to-br from-green-50 to-green-100 border-green-500 text-green-700 shadow-[0_4px_16px_rgba(34,197,94,0.2)] "
          : "bg-gradient-to-br from-red-50 to-red-100 border-red-500 text-red-700 shadow-[0_4px_16px_rgba(239,68,68,0.2)] "
        iconClasses += value 
          ? "bg-green-100 border-green-500" 
          : "bg-red-100 border-red-500"
      } else {
        containerClasses += "bg-white border-gray-200 text-gray-700 shadow-[0_2px_0_0_#E5E7EB] "
        iconClasses += "bg-gray-100 border-gray-200"
      }
    } else {
      if (isCorrect) {
        containerClasses += "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 text-blue-700 shadow-[0_4px_20px_rgba(59,130,246,0.2)] "
        iconClasses += "bg-blue-100 border-blue-500"
      } else if (isSelected && !isCorrect) {
        containerClasses += "bg-gradient-to-br from-red-50 to-red-100 border-red-500 text-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.15)] "
        iconClasses += "bg-red-100 border-red-500"
      } else {
        containerClasses += "bg-gray-50 border-gray-200 text-gray-400 shadow-none opacity-50 "
        iconClasses += "bg-gray-100 border-gray-200"
      }
    }

    const cursorClass = hasChecked ? "cursor-not-allowed" : "cursor-pointer"

    return (
      <motion.button
        whileHover={!hasChecked ? { y: -2, filter: 'brightness(0.98)' } : {}}
        whileTap={!hasChecked ? { scale: 0.97, y: 2 } : {}}
        onClick={() => handleSelect(value)}
        disabled={hasChecked}
        className={`${containerClasses} ${cursorClass}`}
      >
        {/* Subtle animated background wave on select */}
        {isSelected && !showFeedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute w-[60px] h-[60px] rounded-full pointer-events-none ${value ? "bg-green-500/20" : "bg-red-500/20"}`}
          />
        )}

        {/* Icon circle */}
        <div className={iconClasses}>
          {showFeedback ? (
            isCorrect
              ? <CheckCircle2 size={26} className="text-emerald-500 drop-shadow-sm" strokeWidth={2.5} />
              : isSelected
                ? <XCircle size={26} className="text-red-500 drop-shadow-sm" strokeWidth={2.5} />
                : (value ? <Check size={24} strokeWidth={2.5} /> : <X size={24} strokeWidth={2.5} />)
          ) : (
            value
              ? <Check size={26} strokeWidth={3} className={isSelected ? "text-green-500" : "text-gray-400"} />
              : <X size={26} strokeWidth={3} className={isSelected ? "text-red-500" : "text-gray-400"} />
          )}
        </div>

        <span className="relative z-10">
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
