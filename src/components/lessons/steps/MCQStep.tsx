"use client"

import React, { useState, useEffect } from "react"
import { McqStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_GAP } from "../layoutConstants"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"

interface MCQStepProps {
  step: McqStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; reviewSourceStepId?: string; imageUrl?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  selectedOptionId?: string
  actionTrigger?: number
  isContinueEnabled?: boolean
}

import { motion, AnimatePresence } from "framer-motion"

export function MCQStep({ step, onAnswered, selectedOptionId: initialSelected, actionTrigger = 0, isContinueEnabled }: MCQStepProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(initialSelected)
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({})
  const [hasChecked, setHasChecked] = useState(false)

  const handleSelect = (optionId: string) => {
    if (hasChecked && isContinueEnabled) return

    if (step.fullScreen) {
      if (hasChecked && optionId !== selectedOptionId && !isContinueEnabled) {
        setHasChecked(false)
        setSelectedOptionId(optionId)
        setShowFeedback({})
        onAnswered({ isCompleted: false })
      } else if (!hasChecked) {
        setSelectedOptionId(optionId)
        onAnswered({ isCompleted: false, canAction: true })
      }
    } else if (!hasChecked) {
      setSelectedOptionId(optionId)
      const selectedOption = step.options.find((opt) => opt.id === optionId)
      const isCorrect = selectedOption?.isCorrect ?? false

      setShowFeedback({ [optionId]: true })
      if (isCorrect) playCorrectSound()
      else playIncorrectSound()

      onAnswered({
        isCompleted: true,
        isCorrect,
        answerData: { selectedOptionId: optionId }
      })
    }
  }

  const handleCheck = () => {
    if (!selectedOptionId || hasChecked) return

    const selectedOption = step.options.find((opt) => opt.id === selectedOptionId)
    const isCorrect = selectedOption?.isCorrect ?? false
    const correctOption = step.options.find((opt) => opt.isCorrect)

    setHasChecked(true)
    setShowFeedback({
      [selectedOptionId]: true,
      ...(correctOption?.id && correctOption.id !== selectedOptionId ? { [correctOption.id]: true } : {}),
    })

    if (isCorrect) playCorrectSound()
    else playIncorrectSound()

    onAnswered({
      isCompleted: true,
      isCorrect,
      answerData: { selectedOptionId }
    })
  }

  useEffect(() => {
    if (actionTrigger > 0 && selectedOptionId && !hasChecked && step.fullScreen) {
      handleCheck()
    }
  }, [actionTrigger])

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col items-center justify-center min-h-0 flex-1"
      style={{ gap: 32 }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-stretch space-y-8">
        <div className="text-center space-y-4">
          <ExerciseInstruction type="mcq" />
          <motion.h3
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={sharedStyles.question}
          >
            {step.question}
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full">
          {step.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id
            const hasFeedback = (showFeedback[option.id] && hasChecked) || (!step.fullScreen && showFeedback[option.id])
            const isCorrect = option.isCorrect

            let stateClass = sharedStyles.option
            if (hasFeedback) {
              stateClass = isCorrect ? sharedStyles.optionCorrect : (isSelected ? sharedStyles.optionIncorrect : sharedStyles.option)
            } else if (isSelected) {
              stateClass = sharedStyles.optionSelected
            }

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!hasChecked ? { scale: 1.01 } : {}}
                whileTap={!hasChecked ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(option.id)}
                disabled={hasChecked && isContinueEnabled}
                className={stateClass}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  width: '100%',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: isSelected ? 'rgba(11, 113, 254, 0.1)' : '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 800,
                  color: isSelected ? '#0B71FE' : '#64748B',
                  flexShrink: 0,
                  border: isSelected ? '2px solid #0B71FE' : '2px solid transparent'
                }}>
                  {optionLabels[index]}
                </div>
                <span className="flex-1 font-bold text-lg">{option.label}</span>
                {hasFeedback && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    {isCorrect ? '✅' : (isSelected ? '❌' : '')}
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {hasChecked && selectedOptionId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={step.options.find(o => o.id === selectedOptionId)?.isCorrect ? sharedStyles.feedbackCorrect : sharedStyles.feedbackIncorrect}
              style={{ borderRadius: 24, padding: 24, border: '2px solid currentColor' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-bold text-lg mb-1">
                    {step.options.find(o => o.id === selectedOptionId)?.isCorrect ? '¡Excelente trabajo!' : 'No exactamente...'}
                  </p>
                  <p className="opacity-90 leading-relaxed">
                    {step.options.find(o => o.id === selectedOptionId)?.explanation ||
                      (step.options.find(o => o.id === selectedOptionId)?.isCorrect ? 'Respuesta correcta.' : `La respuesta correcta era: ${step.options.find(o => o.isCorrect)?.label}`)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
