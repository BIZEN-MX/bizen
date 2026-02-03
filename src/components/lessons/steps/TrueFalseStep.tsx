"use client"

import React, { useState } from "react"
import { TrueFalseStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"

interface TrueFalseStepProps {
  step: TrueFalseStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  selectedValue?: boolean
}

export function TrueFalseStep({
  step,
  onAnswered,
  selectedValue: initialValue,
}: TrueFalseStepProps) {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(initialValue)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSelect = (value: boolean) => {
    setSelectedValue(value)
    const isCorrect = value === step.correctValue
    setShowFeedback(true)
    
    // Play sound
    if (isCorrect) {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }
    
    onAnswered({ 
      isCompleted: true, 
      isCorrect,
      answerData: { selectedValue: value }
    })
  }

  const getButtonStyle = (value: boolean) => {
    if (!showFeedback || selectedValue !== value) {
      return "bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300"
    }
    const isCorrect = value === step.correctValue
    return isCorrect
      ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-600"
      : "bg-red-100 text-red-900 border-2 border-red-600"
  }

  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      <h3 className={sharedStyles.question}>{step.statement}</h3>
      <div className={`${sharedStyles.flexRow} mt-6 md:mt-8`}>
        <button
          onClick={() => handleSelect(true)}
          disabled={showFeedback}
          className={`${sharedStyles.button} ${sharedStyles.spacing.md} flex-1 transition-all duration-300 rounded-2xl ${getButtonStyle(true)} ${
            showFeedback ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl md:text-3xl font-semibold">Verdadero</span>
            {showFeedback && selectedValue === true && (
              <span className="text-2xl md:text-3xl">
                {step.correctValue === true ? "✓" : "✗"}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => handleSelect(false)}
          disabled={showFeedback}
          className={`${sharedStyles.button} ${sharedStyles.spacing.md} flex-1 transition-all duration-300 rounded-2xl ${getButtonStyle(false)} ${
            showFeedback ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl md:text-3xl font-semibold">Falso</span>
            {showFeedback && selectedValue === false && (
              <span className="text-2xl md:text-3xl">
                {step.correctValue === false ? "✓" : "✗"}
              </span>
            )}
          </div>
        </button>
      </div>
      {showFeedback && step.explanation && (
        <div
          className={`mt-5 p-5 md:p-6 rounded-2xl ${
            selectedValue === step.correctValue
              ? "bg-emerald-100 border-2 border-emerald-600"
              : "bg-red-100 border-2 border-red-600"
          }`}
        >
          <p
            className={`text-xl md:text-2xl ${
              selectedValue === step.correctValue ? "text-emerald-900" : "text-red-900"
            }`}
          >
            {step.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

