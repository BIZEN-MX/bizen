"use client"

import React, { useState, useEffect } from "react"
import { ImageChoiceStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion } from "framer-motion"

interface ImageChoiceStepProps {
  step: ImageChoiceStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  selectedImageId?: string
  actionTrigger?: number
}

export function ImageChoiceStep({
  step,
  onAnswered,
  selectedImageId: initialSelected,
  actionTrigger = 0,
}: ImageChoiceStepProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(initialSelected)
  const [hasChecked, setHasChecked] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSelect = (imageId: string) => {
    if (hasChecked) return
    setSelectedImageId(imageId)
    onAnswered({ isCompleted: false, canAction: true, answerData: { selectedImageId: imageId } })
  }

  const handleCheck = () => {
    if (!selectedImageId || hasChecked) return

    setHasChecked(true)
    setShowFeedback(true)
    const isCorrect = selectedImageId === step.correctImageId

    if (isCorrect) playCorrectSound()
    else playIncorrectSound()

    onAnswered({
      isCompleted: true,
      isCorrect,
      answerData: { selectedImageId }
    })
  }

  useEffect(() => {
    if (actionTrigger > 0 && selectedImageId && !hasChecked) {
      handleCheck()
    }
  }, [actionTrigger])

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ExerciseInstruction type="image_choice" />
        <h3 style={{
          fontSize: "clamp(20px, 3vw, 26px)",
          fontWeight: 800,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
          fontFamily: "'Inter', sans-serif",
        }}>
          {step.question}
        </h3>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 16,
        width: "100%"
      }}>
        {step.imageOptions.map((option, index) => {
          const isSelected = selectedImageId === option.id
          const isCorrect = option.id === step.correctImageId

          let borderColor = "#E5E7EB"
          let background = "#FFFFFF"
          let color = "#374151"
          let boxShadow = "0 3px 0 0 #E5E7EB"

          if (showFeedback) {
            if (isSelected && isCorrect) {
              borderColor = "#3B82F6"
              background = "#EFF6FF"
              color = "#1D4ED8"
              boxShadow = "0 3px 0 0 #93C5FD"
            } else if (isSelected && !isCorrect) {
              borderColor = "#EF4444"
              background = "#FEF2F2"
              color = "#DC2626"
              boxShadow = "0 3px 0 0 #FCA5A5"
            } else if (!isSelected && isCorrect) {
              borderColor = "#3B82F6"
              background = "#EFF6FF"
              color = "#1D4ED8"
            }
          } else if (isSelected) {
            borderColor = "#0F62FE"
            background = "#EFF6FF"
            color = "#1D4ED8"
            boxShadow = "0 3px 0 0 #93C5FD"
          }

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(option.id)}
              disabled={hasChecked}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                padding: "16px",
                borderRadius: 20,
                background,
                border: `3.5px solid ${borderColor}`,
                boxShadow,
                cursor: hasChecked ? "default" : "pointer",
                color,
                transition: "all 0.2s ease",
                fontFamily: "'Inter', sans-serif",
                opacity: 1,
              }}
              onMouseEnter={(e) => { if (!hasChecked) e.currentTarget.style.opacity = "0.72" }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
            >
              <div style={{
                width: "100%",
                aspectRatio: "1.2",
                background: "#F9FAFB",
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                <img
                  src={option.imageUrl || option.imageId}
                  alt={option.label}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                />
                {showFeedback && isSelected && (
                  <div style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: isCorrect ? "#0F62FE" : "#EF4444",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 900
                  }}>
                    {isCorrect ? "✓" : "✗"}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
