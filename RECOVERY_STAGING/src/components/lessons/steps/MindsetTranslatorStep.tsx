"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MindsetTranslatorStepFields, BaseLessonStep } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { haptic } from "@/utils/hapticFeedback"
import Image from "next/image"
import { StepScenarioCard } from "../StepScenarioCard"

interface MindsetTranslatorStepProps {
  step: BaseLessonStep & MindsetTranslatorStepFields
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger: number
  isContinueEnabled: boolean
}

export function MindsetTranslatorStep({ step, onAnswered, actionTrigger, isContinueEnabled }: MindsetTranslatorStepProps) {
  const [currentBeliefIndex, setCurrentBeliefIndex] = useState(0)
  const currentBelief = step.beliefs[currentBeliefIndex]
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isWrong, setIsWrong] = useState(false)
  
  const handleSelect = (optionId: string) => {
    if (isContinueEnabled) return
    
    const option = currentBelief.healthyOptions.find(o => o.id === optionId)
    if (option?.isCorrect) {
      haptic.success()
      playCorrectSound()
      setSelectedOptionId(optionId)
      onAnswered({ isCompleted: true, isCorrect: true, answerData: { beliefId: currentBelief.id, optionId } })
    } else {
      haptic.error()
      playIncorrectSound()
      setIsWrong(true)
      setTimeout(() => setIsWrong(false), 500)
    }
  }

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 32,
      maxWidth: 600,
      margin: "0 auto",
      textAlign: "center"
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", margin: 0 }}>
          {step.question}
        </h3>
        <p style={{ fontSize: 14, color: "#64748b", fontWeight: 500, fontStyle: "italic" }}>
          Toca la versión más saludable de esta creencia:
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentBelief.id}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, scale: isWrong ? [1, 1.05, 1] : 1 }}
          exit={{ x: -20, opacity: 0 }}
          style={{ width: "100%" }}
        >
          <StepScenarioCard text={`"${currentBelief.original}"`} variant="warning" />
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        {currentBelief.healthyOptions.map((option) => {
          const isSelected = selectedOptionId === option.id
          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: 16,
                background: isSelected ? "#dcfce7" : "white",
                border: `2px solid ${isSelected ? "#22c55e" : "#e2e8f0"}`,
                boxShadow: isSelected ? "none" : "0 4px 0 0 #e2e8f0",
                fontSize: 16,
                fontWeight: 600,
                color: isSelected ? "#166534" : "#475569",
                cursor: isContinueEnabled ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.2s"
              }}
            >
              {option.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
