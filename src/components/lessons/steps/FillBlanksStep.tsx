"use client"

import React, { useState, useEffect } from "react"
import { FillBlanksStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion, AnimatePresence } from "framer-motion"
import { StepScenarioCard } from "../StepScenarioCard"

interface FillBlanksStepProps {
  step: FillBlanksStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  blankAnswers?: Record<string, string>
  actionTrigger?: number
}

export function FillBlanksStep({
  step,
  onAnswered,
  blankAnswers: initialAnswers = {},
  actionTrigger = 0,
}: FillBlanksStepProps) {
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>(initialAnswers)
  const [hasChecked, setHasChecked] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null)

  const blankIds = step.textParts
    .filter((part) => part.type === "blank")
    .map((part) => (part as any).id)

  useEffect(() => {
    if (activeBlankId === null && blankIds.length > 0) {
      const firstEmpty = blankIds.find(id => !blankAnswers[id])
      if (firstEmpty) setActiveBlankId(firstEmpty)
    }
  }, [blankAnswers, blankIds])

  useEffect(() => {
    if (hasChecked) return
    const allFilled = blankIds.every((id) => !!blankAnswers[id])
    onAnswered({
      isCompleted: false,
      canAction: allFilled,
      answerData: { blankAnswers }
    })
  }, [blankAnswers, hasChecked, blankIds, onAnswered])

  const handleOptionTap = (optionId: string) => {
    if (hasChecked) return

    let targetId = activeBlankId
    if (!targetId || blankAnswers[targetId]) {
      targetId = blankIds.find(id => !blankAnswers[id]) || null
    }

    if (targetId) {
      const newAnswers = { ...blankAnswers, [targetId]: optionId }
      setBlankAnswers(newAnswers)

      const nextEmpty = blankIds.find(id => id !== targetId && !newAnswers[id])
      setActiveBlankId(nextEmpty || null)
    }
  }

  const handleClearBlank = (blankId: string) => {
    if (hasChecked) return
    const newAnswers = { ...blankAnswers }
    delete newAnswers[blankId]
    setBlankAnswers(newAnswers)
    setActiveBlankId(blankId)
  }

  const handleCheck = () => {
    const allFilled = blankIds.every((id) => !!blankAnswers[id])
    if (!allFilled || hasChecked) return

    const isCorrect = blankIds.every((id) => {
      const part = step.textParts.find(p => p.type === "blank" && (p as any).id === id) as any
      return part && blankAnswers[id] === part.correctOptionId
    })

    setHasChecked(true)
    setShowFeedback(true)

    if (isCorrect) playCorrectSound()
    else playIncorrectSound()

    onAnswered({
      isCompleted: true,
      isCorrect,
      answerData: { blankAnswers: { ...blankAnswers } },
    })
  }

  useEffect(() => {
    if (actionTrigger > 0 && !hasChecked) {
      handleCheck()
    }
  }, [actionTrigger])

  return (
    <div style={{
      width: "100%",
      maxWidth: 520,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 32
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ExerciseInstruction type="fill_blanks" />
        <h3 style={{
          fontSize: "clamp(20px, 3.5vw, 26px)",
          fontWeight: 500,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
        }}>
          {step.question || "Completa los espacios en blanco"}
        </h3>

        {step.description && <StepScenarioCard text={step.description} />}
      </div>

      {/* Sentence Area */}
      <div style={{
        fontSize: "clamp(20px, 4vw, 32px)",
        lineHeight: 1.8,
        color: "#374151",
        background: "#F9FAFB",
        padding: "32px",
        borderRadius: "24px",
        border: "2px solid #F1F5F9",
        fontWeight: 500,
      }}>
        {step.textParts.map((part, idx) => {
          if (part.type === "text") {
            return <span key={idx} style={{}}>{part.content}</span>
          } else {
            const blankId = (part as any).id
            const selectedOptionId = blankAnswers[blankId]
            const option = step.options.find(o => o.id === selectedOptionId)
            const isActive = activeBlankId === blankId && !hasChecked
            const isFilled = !!selectedOptionId

            let borderColor = isActive ? "#0F62FE" : "#E5E7EB"
            let background = isFilled ? "#EFF6FF" : "#FFFFFF"
            let color = "#0F62FE"

            if (showFeedback) {
              const isCorrect = selectedOptionId === (part as any).correctOptionId
              if (isCorrect) {
                borderColor = "#3B82F6"
                background = "#EFF6FF"
                color = "#1D4ED8"
              } else {
                borderColor = "#EF4444"
                background = "#FEF2F2"
                color = "#DC2626"
              }
            }

            return (
              <motion.button
                key={blankId}
                layout
                onClick={() => handleClearBlank(blankId)}
                style={{
                  display: "inline-block",
                  minWidth: "clamp(80px, 15vw, 100px)",
                  minHeight: "clamp(40px, 10vw, 48px)",
                  height: "auto",
                  margin: "4px clamp(4px, 1vw, 8px)",
                  padding: "4px clamp(8px, 2vw, 16px)",
                  verticalAlign: "middle",
                  background,
                  border: `2px solid ${borderColor}`,
                  borderRadius: 12,
                  boxShadow: isActive ? "0 0 0 2px rgba(15, 98, 254, 0.2)" : "none",
                  fontSize: "clamp(16px, 3.5vw, 20px)",
                  fontWeight: 500,
                  color,
                  cursor: isFilled && !hasChecked ? "pointer" : "default",
                  transition: "all 0.2s ease",
                }}
              >
                <AnimatePresence mode="wait">
                  {isFilled ? (
                    <motion.span
                      key={selectedOptionId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{}}
                    >
                      {option?.label}
                    </motion.span>
                  ) : (
                    <span style={{ color: "#D1D5DB", }}>......</span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          }
        })}
      </div>

      {/* Chip Bank */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
        marginTop: 16
      }}>
        {step.options.map((option, idx) => {
          const isUsed = Object.values(blankAnswers).includes(option.id)
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleOptionTap(option.id)}
              disabled={isUsed || hasChecked}
              style={{
                padding: "clamp(8px, 2.5vw, 12px) clamp(14px, 3.5vw, 20px)",
                borderRadius: 16,
                background: isUsed ? "#F3F4F6" : "#FFFFFF",
                border: `2px solid ${isUsed ? "#E5E7EB" : "#E5E7EB"}`,
                boxShadow: isUsed ? "none" : "0 3px 0 0 #E5E7EB",
                color: isUsed ? "transparent" : "#374151",
                fontSize: "clamp(15px, 3vw, 18px)",
                fontWeight: 500,
                cursor: isUsed ? "default" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ visibility: isUsed ? "hidden" : "visible" }}>
                {option.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
