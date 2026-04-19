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

          // State classes determination
          let containerClasses = "flex items-center gap-[clamp(8px,1.5vw,14px)] w-full p-[clamp(10px,2vw,14px)_clamp(12px,3vw,20px)] rounded-[16px] border-2 text-left transition-all duration-200 outline-none "
          let shadowClass = "shadow-[0_2px_0_0_#E5E7EB]"
          let labelClasses = "w-[clamp(26px,8vw,32px)] h-[clamp(26px,8vw,32px)] rounded-[10px] flex items-center justify-center text-[12px] font-[800] shrink-0 border-[1.5px] transition-all duration-200 "
          let iconNode: React.ReactNode = null
          
          if (showFeedback) {
            if (isChecked && isCorrect) {
              containerClasses += "bg-blue-50 border-blue-500 text-blue-700 "
              shadowClass = "shadow-[0_2px_0_0_#93C5FD]"
              labelClasses += "bg-blue-100 border-blue-500 text-blue-700"
              iconNode = <CheckCircle2 size={22} className="text-emerald-500 drop-shadow-sm" strokeWidth={2.5} />
            } else if (isChecked && !isCorrect) {
              containerClasses += "bg-red-50 border-red-500 text-red-600 "
              shadowClass = "shadow-[0_2px_0_0_#FCA5A5]"
              labelClasses += "bg-red-100 border-red-500 text-red-600"
              iconNode = <XCircle size={22} className="text-red-500 drop-shadow-sm" strokeWidth={2.5} />
            } else if (isCorrectReveal) {
              containerClasses += "bg-blue-50 border-blue-500 text-blue-700 "
              shadowClass = "shadow-[0_2px_0_0_#93C5FD]"
              labelClasses += "bg-blue-100 border-blue-500 text-blue-700"
            } else {
              containerClasses += "bg-white border-gray-200 text-gray-400 opacity-50 "
              shadowClass = "shadow-none"
              labelClasses += "bg-gray-50 border-gray-200 text-gray-400"
            }
          } else if (isSelected) {
            containerClasses += "bg-blue-50 border-[#0F62FE] text-blue-700 "
            shadowClass = "shadow-[0_2px_0_0_#93C5FD]"
            labelClasses += "bg-blue-100 border-blue-500 text-blue-700"
          } else {
            containerClasses += "bg-white border-gray-200 text-gray-700 "
            labelClasses += "bg-gray-100 border-gray-200 text-gray-500"
          }

          const cursorClass = (hasChecked && isContinueEnabled) ? "cursor-not-allowed" : "cursor-pointer"

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={!hasChecked ? { y: -1, filter: 'brightness(0.98)' } : {}}
              whileTap={!hasChecked ? { y: 1 } : {}}
              onClick={() => handleSelect(option.id)}
              disabled={hasChecked && isContinueEnabled}
              className={`${containerClasses} ${shadowClass} ${cursorClass}`}
            >
              {/* Label badge */}
              <div className={labelClasses}>
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
