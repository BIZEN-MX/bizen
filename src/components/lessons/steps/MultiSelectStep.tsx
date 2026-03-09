"use client"

import React, { useState, useEffect } from "react"
import { MultiSelectStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion } from "framer-motion"

interface MultiSelectStepProps {
  step: MultiSelectStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  selectedOptionIds?: string[]
  actionTrigger?: number
}

export function MultiSelectStep({
  step,
  onAnswered,
  selectedOptionIds: initialSelected = [],
  actionTrigger = 0,
}: MultiSelectStepProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(initialSelected)
  const [hasChecked, setHasChecked] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleToggle = (optionId: string) => {
    if (hasChecked) return

    const newSelection = selectedOptionIds.includes(optionId)
      ? selectedOptionIds.filter((id) => id !== optionId)
      : [...selectedOptionIds, optionId]

    setSelectedOptionIds(newSelection)

    // Notify engine about selection state
    onAnswered({
      isCompleted: false,
      canAction: newSelection.length > 0,
      answerData: { selectedOptionIds: newSelection }
    })
  }

  const handleCheck = () => {
    if (selectedOptionIds.length === 0 || hasChecked) return

    const allSelectedCorrect = selectedOptionIds.every((id) => {
      const option = step.options.find((opt) => opt.id === id)
      return option?.isCorrect ?? false
    })
    const allCorrectSelected = step.options
      .filter((opt) => opt.isCorrect)
      .every((opt) => selectedOptionIds.includes(opt.id))
    const isCorrect = allSelectedCorrect && allCorrectSelected

    setHasChecked(true)
    setShowFeedback(true)

    if (isCorrect) playCorrectSound()
    else playIncorrectSound()

    onAnswered({
      isCompleted: true,
      isCorrect,
      answerData: { selectedOptionIds: [...selectedOptionIds] },
    })
  }

  useEffect(() => {
    if (actionTrigger > 0 && selectedOptionIds.length > 0 && !hasChecked) {
      handleCheck()
    }
  }, [actionTrigger])

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "clamp(16px, 4vw, 28px)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ExerciseInstruction type="multi_select" />
        <h3 style={{
          fontSize: "clamp(20px, 3vw, 26px)",
          fontWeight: 500,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
                  }}>
          {step.question}
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.5vw, 12px)" }}>
        {step.options.map((option, index) => {
          const isSelected = selectedOptionIds.includes(option.id)
          const isCorrect = option.isCorrect

          let borderColor = "#E5E7EB"
          let background = "#FFFFFF"
          let color = "#374151"
          let boxShadow = "0 2px 0 0 #E5E7EB"

          if (showFeedback) {
            if (isSelected && isCorrect) {
              borderColor = "#3B82F6"
              background = "#EFF6FF"
              color = "#1D4ED8"
              boxShadow = "0 2px 0 0 #93C5FD"
            } else if (isSelected && !isCorrect) {
              borderColor = "#EF4444"
              background = "#FEF2F2"
              color = "#DC2626"
              boxShadow = "0 2px 0 0 #FCA5A5"
            } else if (!isSelected && isCorrect) {
              borderColor = "#3B82F6"
              background = "#EFF6FF"
              color = "#1D4ED8"
            }
          } else if (isSelected) {
            borderColor = "#0F62FE"
            background = "#EFF6FF"
            color = "#1D4ED8"
            boxShadow = "0 2px 0 0 #93C5FD"
          }

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleToggle(option.id)}
              disabled={hasChecked}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 16px)",
                width: "100%",
                padding: "clamp(8px, 2.5vw, 16px) clamp(10px, 3vw, 20px)",
                borderRadius: 16,
                background,
                border: `2px solid ${borderColor}`,
                boxShadow,
                cursor: hasChecked ? "default" : "pointer",
                textAlign: "left",
                color,
                transition: "all 0.2s ease",
                                opacity: 1,
              }}
              onMouseEnter={(e) => { if (!hasChecked) e.currentTarget.style.opacity = "0.72" }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: `2px solid ${isSelected ? '#0F62FE' : '#E5E7EB'}`,
                background: isSelected ? '#0F62FE' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 14,
                flexShrink: 0
              }}>
                {isSelected && "✓"}
              </div>
              <span style={{ flex: 1, fontSize: "clamp(14px, 3.5vw, 18px)", fontWeight: 500, }}>{option.label}</span>
              {showFeedback && isSelected && (
                <span style={{ fontSize: 20, }}>{isCorrect ? "✓" : "✗"}</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
