"use client"

import React, { useState, useEffect, useRef } from "react"
import { FillBlanksStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"

interface FillBlanksStepProps {
  step: FillBlanksStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  blankAnswers?: Record<string, string>
}

export function FillBlanksStep({
  step,
  onAnswered,
  blankAnswers: initialAnswers = {},
}: FillBlanksStepProps) {
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>(initialAnswers)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const hasPlayedSound = useRef(false)
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered

  useEffect(() => {
    // Get all blank IDs
    const blankIds = step.textParts
      .filter((part) => part.type === "blank")
      .map((part) => (part.type === "blank" ? part.id : ""))

    // Check if all blanks are filled
    const allFilled = blankIds.every((id) => blankAnswers[id])
    if (allFilled && !hasEvaluated) {
      const isCorrect = blankIds.every((id) => {
        const part = step.textParts.find(
          (p) => p.type === "blank" && p.id === id
        ) as Extract<typeof step.textParts[number], { type: "blank" }>
        return part && blankAnswers[id] === part.correctOptionId
      })

      setHasEvaluated(true)

      // Play sound only once
      if (!hasPlayedSound.current) {
        if (isCorrect) {
          playCorrectSound()
        } else {
          playIncorrectSound()
        }
        hasPlayedSound.current = true
      }

      onAnsweredRef.current({
        isCompleted: true,
        isCorrect,
        answerData: { blankAnswers: { ...blankAnswers } },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onAnswered omitted to avoid infinite loop
  }, [blankAnswers, step.textParts, hasEvaluated])

  const handleBlankChange = (blankId: string, optionId: string) => {
    if (!hasEvaluated) {
      setBlankAnswers((prev) => ({ ...prev, [blankId]: optionId }))
    }
  }

  const getBlankStyle = (blankId: string) => {
    if (!hasEvaluated) {
      return ""
    }
    const part = step.textParts.find(
      (p) => p.type === "blank" && p.id === blankId
    ) as Extract<typeof step.textParts[number], { type: "blank" }>
    if (!part) return ""
    
    const isCorrect = blankAnswers[blankId] === part.correctOptionId
    return isCorrect
      ? "bg-emerald-600/25 border-emerald-500 ring-2 ring-emerald-400"
      : "bg-red-600/20 border-red-500 ring-2 ring-red-500"
  }

  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      {step.question && <h3 className={sharedStyles.question}>{step.question}</h3>}
      <div className="space-y-4 md:space-y-6">
        {/* Text with blanks */}
        <div className="text-2xl md:text-3xl lg:text-4xl leading-relaxed">
          {step.textParts.map((part, index) => {
            if (part.type === "text") {
              return <span key={index}>{part.content}</span>
            } else {
              const selectedOptionId = blankAnswers[part.id]
              const partObj = part as Extract<typeof step.textParts[number], { type: "blank" }>
              const isCorrect = hasEvaluated && selectedOptionId === partObj.correctOptionId
              
              return (
                <span key={part.id} className="inline-block mx-1">
                  <select
                    value={selectedOptionId || ""}
                    onChange={(e) => handleBlankChange(part.id, e.target.value)}
                    disabled={hasEvaluated}
                    className={`${sharedStyles.blankInput} ${getBlankStyle(part.id)} transition-all duration-300 ${
                      hasEvaluated ? 'cursor-default' : ''
                    }`}
                  >
                    <option value="">---</option>
                    {step.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {hasEvaluated && (
                    <span className="ml-2 text-xl">
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </span>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

