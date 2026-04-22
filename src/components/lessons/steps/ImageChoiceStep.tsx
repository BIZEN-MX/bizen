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
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "clamp(16px, 4vw, 28px)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ExerciseInstruction type="image_choice" />
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

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(clamp(120px, 40vw, 150px), 1fr))",
        gap: "clamp(12px, 2.5vw, 16px)",
        width: "100%"
      }}>
        {step.imageOptions.map((option, index) => {
          const isSelected = selectedImageId === option.id
          const isCorrect = option.id === step.correctImageId

          let containerClasses = "flex flex-col items-center gap-[clamp(8px,2vw,12px)] p-[clamp(12px,3vw,16px)] rounded-[20px] border-[3.5px] transition-all duration-200 outline-none "
          let shadowClass = "shadow-[0_3px_0_0_#E5E7EB]"
          
          if (showFeedback) {
            if (isSelected && isCorrect) {
              containerClasses += "bg-blue-50 border-blue-500 text-blue-700 "
              shadowClass = "shadow-[0_3px_0_0_#93C5FD]"
            } else if (isSelected && !isCorrect) {
              containerClasses += "bg-red-50 border-red-500 text-red-600 "
              shadowClass = "shadow-[0_3px_0_0_#FCA5A5]"
            } else if (!isSelected && isCorrect) {
              containerClasses += "bg-blue-50 border-blue-500 text-blue-700 "
              shadowClass = "shadow-none"
            } else {
              containerClasses += "bg-white border-gray-200 text-gray-400 opacity-50 "
              shadowClass = "shadow-none"
            }
          } else if (isSelected) {
            containerClasses += "bg-primary/5 border-primary text-primary "
            shadowClass = "shadow-[0_3px_0_0_#93C5FD]"
          } else {
            containerClasses += "bg-white border-gray-200 text-gray-700 "
          }

          const cursorClass = hasChecked ? "cursor-default" : "cursor-pointer"

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(option.id)}
              disabled={hasChecked}
              whileHover={!hasChecked ? { filter: 'brightness(0.96)' } : {}}
              className={`${containerClasses} ${shadowClass} ${cursorClass}`}
            >
              <div style={{
                width: "100%",
                aspectRatio: "1.3",
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
                    background: isCorrect ? "var(--primary)" : "#EF4444",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 500
                  }}>
                    {isCorrect ? "✓" : "✗"}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 16, fontWeight: 500, }}>{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
