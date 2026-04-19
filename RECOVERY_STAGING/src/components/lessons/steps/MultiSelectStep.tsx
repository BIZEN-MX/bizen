"use client"

import React, { useState, useEffect } from "react"
import { MultiSelectStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion } from "framer-motion"
import { StepScenarioCard } from "../StepScenarioCard"

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
    <div style={{ 
      width: "100%", 
      maxWidth: 520, 
      margin: "0 auto", 
      display: "flex", 
      flexDirection: "column", 
      gap: "clamp(10px, 4vw, 24px)"
 
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
        
        {step.description && <StepScenarioCard text={step.description} />}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px, 1.5vw, 12px)" }}>
        {step.options.map((option, index) => {
          const isSelected = selectedOptionIds.includes(option.id)
          const isCorrect = option.isCorrect

          let containerClasses = "flex items-center gap-[clamp(6px,1.5vw,12px)] w-full p-[clamp(4px,1.2vw,8px)_clamp(10px,2.5vw,16px)] rounded-[14px] border-2 text-left transition-all duration-200 outline-none "
          let shadowClass = "shadow-[0_2px_0_0_#E5E7EB]"
          
          if (showFeedback) {
            if (isSelected && isCorrect) {
              containerClasses += "bg-blue-50 border-blue-500 text-blue-700 "
              shadowClass = "shadow-[0_2px_0_0_#93C5FD]"
            } else if (isSelected && !isCorrect) {
              containerClasses += "bg-red-50 border-red-500 text-red-600 "
              shadowClass = "shadow-[0_2px_0_0_#FCA5A5]"
            } else if (!isSelected && isCorrect) {
              containerClasses += "bg-blue-50 border-blue-500 text-blue-700 "
              shadowClass = "shadow-[0_2px_0_0_#93C5FD]"
            } else {
              containerClasses += "bg-white border-gray-200 text-gray-400 opacity-50 "
              shadowClass = "shadow-none"
            }
          } else if (isSelected) {
            containerClasses += "bg-blue-50 border-[#0F62FE] text-blue-700 "
            shadowClass = "shadow-[0_2px_0_0_#93C5FD]"
          } else {
            containerClasses += "bg-white border-gray-200 text-gray-700 "
          }

          const cursorClass = hasChecked ? "cursor-default" : "cursor-pointer"

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleToggle(option.id)}
              disabled={hasChecked}
              whileHover={!hasChecked ? { filter: 'brightness(0.96)' } : {}}
              className={`${containerClasses} ${shadowClass} ${cursorClass}`}
            >
              <div 
                className={`w-[20px] h-[20px] rounded-[4px] border-2 flex items-center justify-center text-white text-[12px] shrink-0 ${isSelected ? 'border-[#0F62FE] bg-[#0F62FE]' : 'border-gray-200 bg-transparent'}`}
              >
                {isSelected && "✓"}
              </div>
              <span style={{ flex: 1, fontSize: "clamp(13px, 3vw, 16px)", fontWeight: 500, }}>{option.label}</span>
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
