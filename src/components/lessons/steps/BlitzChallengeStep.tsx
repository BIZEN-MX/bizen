"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Zap, Sparkles } from "lucide-react"
import { BlitzChallengeStepFields, BaseLessonStep, Option } from "@/types/lessonTypes"
import { SmartText } from "../SmartText"
import { haptic } from "@/utils/hapticFeedback"
import { StepScenarioCard } from "../StepScenarioCard"
import { playCorrectSound } from "../lessonSounds"

interface BlitzChallengeStepProps {
  step: BaseLessonStep & BlitzChallengeStepFields
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger: number // 0 means inactive, >0 means user tapped Continue/Check
  isContinueEnabled: boolean // If true, step is already answered
}

export function BlitzChallengeStep({ step, onAnswered, actionTrigger, isContinueEnabled }: BlitzChallengeStepProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  
  // Time state
  const TIME_LIMIT = step.timeLimit || 15
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  
  // Have we submitted (either by time out, or by explicit user action)
  const isSubmitted = isContinueEnabled

  useEffect(() => {
    // Determine initially if something is selected
    if (!isSubmitted) {
      onAnswered({ isCompleted: false, canAction: selectedOptionId !== null })
    }
  }, [selectedOptionId, isSubmitted, onAnswered])

  // Timer logic
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isSubmitted, timeLeft])

  // Time out effect
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      haptic.error()
      // Mark as incorrect due to timeout
      onAnswered({
        isCompleted: true,
        isCorrect: false,
        answerData: { selectedOptionId: null, timedOut: true }
      })
    }
  }, [timeLeft, isSubmitted, onAnswered])

  // Handling submission from the Engine's ActionTrigger
  useEffect(() => {
    if (actionTrigger > 0 && !isSubmitted && selectedOptionId !== null) {
      const selectedOption = step.options.find(o => o.id === selectedOptionId)
      const isCorrect = selectedOption?.isCorrect === true
      
      if (isCorrect) {
        playCorrectSound()
      }

      onAnswered({
        isCompleted: true,
        isCorrect,
        answerData: { selectedOptionId, timeLeft }
      })
    }
  }, [actionTrigger, isSubmitted, selectedOptionId, step.options, onAnswered, timeLeft, playCorrectSound])

  // Derived state
  const timePercentage = (timeLeft / TIME_LIMIT) * 100
  const isDangerTime = timeLeft <= 5
  
  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "clamp(24px, 4vw, 32px)",
      maxWidth: 600,
      margin: "0 auto"
    }}>
      {/* Blitz Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#1e293b",
        padding: "16px 24px",
        borderRadius: 20,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ 
            padding: 6, 
            background: "rgba(255,255,255,0.1)", 
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Zap size={20} color="#fbbf24" fill="#fbbf24" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "white", letterSpacing: "0.05em", textTransform: "uppercase" }}>Reto Relámpago</span>
        </div>
        
        {/* Timer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <span style={{ 
            fontSize: 24, 
            fontWeight: 800, 
            color: isDangerTime ? "#ef4444" : "white",
            fontVariantNumeric: "tabular-nums"
          }}>
            {Math.max(0, timeLeft)}s
          </span>
          <div style={{
            width: 60,
            height: 8,
            borderRadius: 999,
            background: "rgba(255,255,255,0.2)",
            overflow: "hidden"
          }}>
            <motion.div
              initial={false}
              animate={{ width: `${timePercentage}%`, backgroundColor: isDangerTime ? "#ef4444" : "#10b981" }}
              transition={{ duration: 1, ease: "linear" }}
              style={{ height: "100%", borderRadius: 999 }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {step.description && <StepScenarioCard text={step.description} variant="case" />}
        <SmartText text={step.question} fontSize="clamp(18px, 3.5vw, 22px)" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.5vw, 12px)", width: "100%" }}>
        {step.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id
          
          let borderColor = "#E5E7EB"
          let background = "#FFFFFF"
          let color = "#374151"
          let boxShadow = "0 2px 0 0 #E5E7EB"
          let labelBg = "#F3F4F6"
          let labelColor = "#6B7280"

          if (isSelected) {
            borderColor = "#0F62FE"
            background = "#EFF6FF"
            color = "#1D4ED8"
            boxShadow = "0 2px 0 0 #93C5FD"
            labelBg = "#DBEAFE"
            labelColor = "#1D4ED8"
          }

          if (isSubmitted) {
            if (option.isCorrect) {
              borderColor = "#3B82F6"
              background = "#EFF6FF"
              color = "#1D4ED8"
              boxShadow = "0 2px 0 0 #93C5FD"
              labelBg = "#DBEAFE"
              labelColor = "#1D4ED8"
            } else if (isSelected && !option.isCorrect) {
              borderColor = "#EF4444"
              background = "#FEF2F2"
              color = "#DC2626"
              boxShadow = "0 2px 0 0 #FCA5A5"
              labelBg = "#FEE2E2"
              labelColor = "#DC2626"
            }
          }

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              onClick={() => {
                if (isSubmitted) return
                haptic.light()
                setSelectedOptionId(option.id)
              }}
              disabled={isSubmitted}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(6px, 1.5vw, 12px)",
                width: "100%",
                padding: "clamp(7px, 2vw, 12px) clamp(10px, 3vw, 18px)",
                borderRadius: 14,
                background,
                border: `2px solid ${borderColor}`,
                boxShadow,
                cursor: isSubmitted ? "default" : "pointer",
                textAlign: "left",
                color,
                transition: "all 0.2s ease",
                userSelect: "none",
                outline: "none",
                opacity: (isSubmitted && !option.isCorrect && !isSelected) ? 0.6 : 1,
              }}
            >
              {/* Letter label */}
              <div style={{
                width: "clamp(24px, 8vw, 30px)",
                height: "clamp(24px, 8vw, 30px)",
                borderRadius: 8,
                background: labelBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 500,
                color: labelColor,
                flexShrink: 0,
                border: `1.5px solid ${borderColor}`,
                transition: "all 0.2s ease",
              }}>
                {['A', 'B', 'C', 'D', 'E', 'F'][index]}
              </div>

              {/* Option text */}
              <span style={{
                flex: 1,
                fontSize: "clamp(13px, 3vw, 16px)",
                fontWeight: 500,
                lineHeight: 1.3,
              }}>
                {option.label}
              </span>

              {/* Feedback icon */}
              <AnimatePresence mode="wait">
                {isSubmitted && (option.isCorrect || isSelected) && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ flexShrink: 0 }}
                  >
                    {option.isCorrect ? (
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
