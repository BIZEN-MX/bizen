"use client"

import React, { useState, useEffect, useRef } from "react"
import { MultiSelectStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"

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
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const hasPlayedSound = useRef(false)
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered

  useEffect(() => {
    // Notify engine about selection state
    onAnsweredRef.current({
      isCompleted: false,
      canAction: selectedOptionIds.length > 0 && !hasEvaluated
    })
  }, [selectedOptionIds, hasEvaluated])

  const handleCheck = () => {
    if (selectedOptionIds.length === 0 || hasEvaluated) return

    const allSelectedCorrect = selectedOptionIds.every((id) => {
      const option = step.options.find((opt) => opt.id === id)
      return option?.isCorrect ?? false
    })
    const allCorrectSelected = step.options
      .filter((opt) => opt.isCorrect)
      .every((opt) => selectedOptionIds.includes(opt.id))
    const isCorrect = allSelectedCorrect && allCorrectSelected

    setHasEvaluated(true)
    if (!hasPlayedSound.current) {
      if (isCorrect) playCorrectSound()
      else playIncorrectSound()
      hasPlayedSound.current = true
    }

    onAnsweredRef.current({
      isCompleted: true,
      isCorrect,
      answerData: { selectedOptionIds: [...selectedOptionIds] },
    })
  }

  useEffect(() => {
    if (actionTrigger > 0 && selectedOptionIds.length > 0 && !hasEvaluated) {
      handleCheck()
    }
  }, [actionTrigger])

  const handleToggle = (optionId: string) => {
    if (hasEvaluated) return // Don't allow changes after evaluation
    setSelectedOptionIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    )
  }

  const getOptionStyle = (option: typeof step.options[0]) => {
    const isSelected = selectedOptionIds.includes(option.id)
    if (!hasEvaluated) {
      return isSelected ? sharedStyles.optionSelected : ""
    }

    // Show feedback colors
    if (isSelected && option.isCorrect) {
      return "bg-emerald-600/25 border-emerald-500 ring-2 ring-emerald-400"
    }
    if (isSelected && !option.isCorrect) {
      return "bg-red-600/20 border-red-500 ring-2 ring-red-500"
    }
    if (!isSelected && option.isCorrect) {
      return "bg-emerald-600/15 border-emerald-500/50"
    }
    return ""
  }

  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      <h3 className={sharedStyles.question}>{step.question}</h3>
      <div className={sharedStyles.grid1Col}>
        {step.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id)
          return (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              disabled={hasEvaluated}
              className={`${sharedStyles.option} ${getOptionStyle(option)} transition-all duration-300 ${hasEvaluated ? 'cursor-default' : 'cursor-pointer'
                }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl md:text-2xl lg:text-3xl text-left flex-1">{option.label}</span>
                {hasEvaluated && (
                  <span className="ml-3 text-2xl">
                    {option.isCorrect ? '✓' : isSelected ? '✗' : ''}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

