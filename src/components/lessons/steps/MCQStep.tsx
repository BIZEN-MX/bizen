"use client"

import React, { useState, useEffect } from "react"
import { McqStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

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

    // Simply select the option. Don't show feedback yet.
    setSelectedOptionId(optionId)
    // Notify parent that we have a selection (so it can enable the "Check" button)
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

    onAnswered({
      isCompleted: true,
      isCorrect,
      answerData: { selectedOptionId }
    })
  }

  useEffect(() => {
    if (actionTrigger > 0 && selectedOptionId && !hasChecked) {
      handleCheck()
    }
  }, [actionTrigger])

  const isCorrectAnswer = checkedOptionId
    ? step.options.find((o) => o.id === checkedOptionId)?.isCorrect
    : undefined

  const correctOption = step.options.find((o) => o.isCorrect)

  return (
    <div style={{
      width: "100%",
      maxWidth: 600,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 28
    }}>
      {/* Question header */}
      <div style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24
      }}>
        <ExerciseInstruction type="mcq" />
        <motion.h3
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            lineHeight: 1.3,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {step.question}
        </motion.h3>
      </div>

      {/* Options */}
      <div style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 32
      }}>
        {step.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id
          const isChecked = checkedOptionId === option.id
          const isCorrect = option.isCorrect

          // Determine visual state
          let borderColor = "#E5E7EB"
          let background = "#FFFFFF"
          let color = "#374151"
          let boxShadow = "0 2px 0 0 #E5E7EB"
          let labelBg = "#F3F4F6"
          let labelColor = "#6B7280"

          if (showFeedback && isChecked) {
            if (isCorrect) {
              borderColor = "#3B82F6"
              background = "#EFF6FF"
              color = "#1D4ED8"
              boxShadow = "0 2px 0 0 #93C5FD"
              labelBg = "#DBEAFE"
              labelColor = "#1D4ED8"
            } else {
              borderColor = "#EF4444"
              background = "#FEF2F2"
              color = "#DC2626"
              boxShadow = "0 2px 0 0 #FCA5A5"
              labelBg = "#FEE2E2"
              labelColor = "#DC2626"
            }
          } else if (showFeedback && isCorrect && checkedOptionId && !step.options.find(o => o.id === checkedOptionId)?.isCorrect) {
            // Show which one was correct
            borderColor = "#3B82F6"
            background = "#EFF6FF"
            color = "#1D4ED8"
            boxShadow = "0 2px 0 0 #93C5FD"
            labelBg = "#DBEAFE"
            labelColor = "#1D4ED8"
          } else if (isSelected && !showFeedback) {
            borderColor = "#0F62FE"
            background = "#EFF6FF"
            color = "#1D4ED8"
            boxShadow = "0 2px 0 0 #93C5FD"
            labelBg = "#DBEAFE"
            labelColor = "#1D4ED8"
          }

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              onClick={() => handleSelect(option.id)}
              disabled={hasChecked && isContinueEnabled}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: "100%",
                padding: "16px 20px",
                borderRadius: 16,
                background,
                border: `2px solid ${borderColor}`,
                boxShadow,
                cursor: (hasChecked && isContinueEnabled) ? "not-allowed" : "pointer",
                textAlign: "left",
                color,
                transition: "all 0.2s ease",
                userSelect: "none",
                outline: "none",
                transform: "translateY(0)",
                opacity: 1,
              }}
              onMouseEnter={(e) => {
                if (!hasChecked) {
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.opacity = "0.72"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.opacity = "1"
              }}
              onMouseDown={(e) => {
                if (!hasChecked) {
                  e.currentTarget.style.transform = "translateY(2px)"
                  e.currentTarget.style.boxShadow = "0 0px 0 0 #E5E7EB"
                  e.currentTarget.style.opacity = "0.55"
                }
              }}
              onMouseUp={(e) => {
                if (!hasChecked) {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = boxShadow
                  e.currentTarget.style.opacity = "1"
                }
              }}
            >
              {/* Letter label */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: labelBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 900,
                color: labelColor,
                flexShrink: 0,
                fontFamily: "'Inter', sans-serif",
                border: `1.5px solid ${borderColor}`,
                transition: "all 0.2s ease",
              }}>
                {['A', 'B', 'C', 'D', 'E', 'F'][index]}
              </div>

              {/* Option text */}
              <span style={{
                flex: 1,
                fontSize: "clamp(15px, 1.8vw, 18px)",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.4,
              }}>
                {option.label}
              </span>

              {/* Feedback icon */}
              <AnimatePresence mode="wait">
                {showFeedback && isChecked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ flexShrink: 0 }}
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={24} color="#10B981" strokeWidth={3} />
                    ) : (
                      <XCircle size={24} color="#EF4444" strokeWidth={3} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
