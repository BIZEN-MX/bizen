"use client"

import React, { useState, useEffect } from "react"
import { TrueFalseStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_GAP } from "../layoutConstants"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { Check, X, CheckCircle2, XCircle } from "lucide-react"

interface TrueFalseStepProps {
  step: TrueFalseStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string; imageUrl?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  selectedValue?: boolean
  isReviewStep?: boolean
  actionTrigger?: number
}

export function TrueFalseStep({
  step,
  onAnswered,
  selectedValue: initialValue,
  actionTrigger = 0,
}: TrueFalseStepProps) {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(initialValue)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const handleSelect = (value: boolean) => {
    if (hasChecked) return
    setSelectedValue(value)
    // Notify parent to enable "Check" button
    onAnswered({ isCompleted: false, canAction: true, answerData: { selectedValue: value } })
  }

  const handleCheck = () => {
    if (selectedValue === undefined || hasChecked) return

    setHasChecked(true)
    setShowFeedback(true)
    const isCorrect = selectedValue === step.correctValue

    if (isCorrect) playCorrectSound()
    else playIncorrectSound()

    onAnswered({ isCompleted: true, isCorrect, answerData: { selectedValue } })
  }

  useEffect(() => {
    if (actionTrigger && actionTrigger > 0 && selectedValue !== undefined && !hasChecked) {
      handleCheck()
    }
  }, [actionTrigger])

  const getButtonStyle = (value: boolean) => {
    const isSelected = selectedValue === value

    // Normal state
    let borderColor = "#E5E7EB"
    let background = "#FFFFFF"
    let color = "#374151"
    let boxShadow = "0 2px 0 0 #E5E7EB"

    if (showFeedback) {
      if (value === step.correctValue) {
        borderColor = "#3B82F6"
        background = "#EFF6FF"
        color = "#1D4ED8"
        boxShadow = "0 2px 0 0 #93C5FD"
      } else if (isSelected) {
        borderColor = "#EF4444"
        background = "#FEF2F2"
        color = "#DC2626"
        boxShadow = "0 2px 0 0 #FCA5A5"
      }
    } else if (isSelected) {
      borderColor = "#0F62FE"
      background = "#EFF6FF"
      color = "#1D4ED8"
      boxShadow = "0 2px 0 0 #93C5FD"
    }

    return {
      background,
      border: `2px solid ${borderColor}`,
      color,
      boxShadow,
      borderRadius: 16,
      padding: '20px',
      fontSize: '20px',
      fontWeight: 800,
      cursor: hasChecked ? 'default' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'all 0.2s ease',
      fontFamily: "'Inter', sans-serif",
      opacity: 1,
    }
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: 600,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 32
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ExerciseInstruction type="true_false" />
        <h3 style={{
          fontSize: "clamp(20px, 3.5vw, 28px)",
          fontWeight: 800,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
          fontFamily: "'Inter', sans-serif",
        }}>
          {step.statement}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <button
          onClick={() => handleSelect(true)}
          disabled={hasChecked}
          style={getButtonStyle(true)}
          onMouseEnter={(e) => { if (!hasChecked) e.currentTarget.style.opacity = "0.72" }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: selectedValue === true ? "#0F62FE15" : "#F3F4F6", border: selectedValue === true ? "1.5px solid #0F62FE" : "1.5px solid #E5E7EB" }}>
            <Check size={20} strokeWidth={3} />
          </div>
          <span style={{ flex: 1, textAlign: "left", fontFamily: "'Inter', sans-serif" }}>Verdadero</span>
          {showFeedback && selectedValue === true && (
            <div style={{ flexShrink: 0 }}>
              {step.correctValue === true ? (
                <CheckCircle2 size={24} color="#10B981" strokeWidth={3} />
              ) : (
                <XCircle size={24} color="#EF4444" strokeWidth={3} />
              )}
            </div>
          )}
        </button>
        <button
          onClick={() => handleSelect(false)}
          disabled={hasChecked}
          style={getButtonStyle(false)}
          onMouseEnter={(e) => { if (!hasChecked) e.currentTarget.style.opacity = "0.72" }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: selectedValue === false ? "#0F62FE15" : "#F3F4F6", border: selectedValue === false ? "1.5px solid #0F62FE" : "1.5px solid #E5E7EB" }}>
            <X size={20} strokeWidth={3} />
          </div>
          <span style={{ flex: 1, textAlign: "left", fontFamily: "'Inter', sans-serif" }}>Falso</span>
          {showFeedback && selectedValue === false && (
            <div style={{ flexShrink: 0 }}>
              {step.correctValue === false ? (
                <CheckCircle2 size={24} color="#10B981" strokeWidth={3} />
              ) : (
                <XCircle size={24} color="#EF4444" strokeWidth={3} />
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
