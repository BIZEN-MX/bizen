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

export function MCQStep({ step, onAnswered, selectedOptionId: initialSelected, actionTrigger = 0, isContinueEnabled }: MCQStepProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(initialSelected)
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({})
  const [hasChecked, setHasChecked] = useState(false)

  const handleSelect = (optionId: string) => {
    if (step.fullScreen) {
      if (hasChecked && optionId !== selectedOptionId && !isContinueEnabled) {
        // Retry
        setHasChecked(false)
        setSelectedOptionId(optionId)
        setShowFeedback({})
        // Disable continue in engine until they check again
        onAnswered({ isCompleted: false })
      } else if (!hasChecked) {
        setSelectedOptionId(optionId)
        // Notify engine that we can now check
        onAnswered({ isCompleted: false })
      }
    } else if (!hasChecked) {
      // Regular mode: immediate feedback
      setSelectedOptionId(optionId)
      const selectedOption = step.options.find((opt) => opt.id === optionId)
      const isCorrect = selectedOption?.isCorrect ?? false

      setShowFeedback({ [optionId]: true })
      if (isCorrect) {
        playCorrectSound()
      } else {
        playIncorrectSound()
      }

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

    if (isCorrect) {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }

    onAnswered({
      isCompleted: true,
      isCorrect,
      answerData: { selectedOptionId }
    })
  }

  // Effect to handle external action trigger from footer
  useEffect(() => {
    if (actionTrigger > 0 && selectedOptionId && !hasChecked && step.fullScreen) {
      handleCheck()
    }
  }, [actionTrigger])

  if (step.fullScreen) {
    const optionLabels = ['A)', 'B)', 'C)', 'D)', 'E)', 'F)']
    const correctOption = step.options.find((o) => o.isCorrect)
    const correctIndex = correctOption ? step.options.indexOf(correctOption) : -1
    const correctLabel = correctIndex >= 0 ? `${optionLabels[correctIndex]} ${correctOption?.label}` : ''

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 0,
        flex: 1,
        padding: '0 1.5rem',
        background: '#f1f5f9',
        boxSizing: 'border-box',
      }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          {(() => {
            const align = (step.imageAlign === 'left' || step.imageAlign === 'right') ? step.imageAlign : 'right'
            const imageBlock = step.imageUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: '120px', maxWidth: 'min(40%, 300px)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.imageUrl} alt="" style={{ maxWidth: '100%', width: 'auto', height: 'auto', maxHeight: 'clamp(120px, 20vh, 240px)', objectFit: 'contain' }} />
              </div>
            ) : null
            const activityBlock = (
              <>
                <ExerciseInstruction type="mcq" />
                <h2 style={{
                  fontSize: 'clamp(24px, 5vw, 40px)',
                  fontWeight: 600,
                  marginBottom: '3rem',
                  color: '#1e293b',
                  lineHeight: 1.3,
                }}>
                  {step.question}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '700px', alignSelf: 'center', margin: '0 auto' }}>
                  {step.options.map((option, index) => {
                    const isSelected = selectedOptionId === option.id
                    const hasFeedback = showFeedback[option.id] && hasChecked
                    const isCorrect = option.isCorrect
                    const feedbackBg = hasFeedback ? (isCorrect ? '#d1fae5' : '#fee2e2') : (isSelected ? '#bfdbfe' : '#dbeafe')
                    const feedbackBorder = hasFeedback ? (isCorrect ? '3px solid #10b981' : '3px solid #ef4444') : (isSelected ? '3px solid #2563eb' : '3px solid transparent')
                    const feedbackColor = hasFeedback ? (isCorrect ? '#047857' : '#dc2626') : '#1e293b'

                    return (
                      <div key={option.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleSelect(option.id)}
                          disabled={hasChecked && isContinueEnabled}
                          style={{
                            padding: '1.5rem 2rem',
                            fontSize: 'clamp(18px, 3.5vw, 24px)',
                            fontWeight: 500,
                            color: feedbackColor,
                            background: feedbackBg,
                            border: feedbackBorder,
                            borderRadius: '9999px',
                            cursor: hasChecked && isContinueEnabled ? 'default' : 'pointer',
                            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? '0 2px 0 #1e40af' : 'none'
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{optionLabels[index]}</span>
                          <span style={{ flex: 1 }}>{option.label}</span>
                          {hasFeedback && (
                            <span style={{ fontSize: '1.5rem', marginLeft: '0.5rem' }}>
                              {isCorrect ? '✓' : '✗'}
                            </span>
                          )}
                        </button>
                        {hasFeedback && isSelected && !isCorrect && correctLabel && (
                          <p style={{
                            margin: 0,
                            paddingLeft: '2rem',
                            paddingRight: '2rem',
                            fontSize: 'clamp(16px, 3vw, 20px)',
                            lineHeight: 1.5,
                            color: '#dc2626',
                            fontWeight: 500,
                          }}>
                            La respuesta correcta es {correctLabel}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )
            if (imageBlock) {
              const contentSide = <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{activityBlock}</div>
              return (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: CONTENT_GAP, flexWrap: 'nowrap', width: '100%', height: '100%', minHeight: 0 }}>
                  {align === 'left' ? imageBlock : contentSide}
                  {align === 'left' ? contentSide : imageBlock}
                </div>
              )
            }
            return activityBlock
          })()}
        </div>
      </div>
    )
  }

  return (
    <div className={sharedStyles.container} style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
      {step.title && <h2 className={sharedStyles.title} style={{ fontSize: 'clamp(36px, 7vw, 56px)', color: '#1e293b' }}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description} style={{ fontSize: 'clamp(20px, 4vw, 28px)', color: '#1e293b' }}>{step.description}</p>}
      <ExerciseInstruction type="mcq" />
      <h3 className={sharedStyles.question} style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', color: '#1e293b', marginBottom: '1.5rem' }}>{step.question}</h3>
      <div className={sharedStyles.grid1Col}>
        {step.options.map((option) => {
          const isSelected = selectedOptionId === option.id
          const hasFeedback = showFeedback[option.id]
          const isCorrect = option.isCorrect

          let buttonClasses = sharedStyles.option
          if (isSelected && hasFeedback) {
            buttonClasses = isCorrect
              ? "p-5 md:p-6 rounded-2xl bg-emerald-100 border-2 border-emerald-600 text-emerald-900 transition-all duration-300 text-left"
              : "p-5 md:p-6 rounded-2xl bg-red-100 border-2 border-red-600 text-red-900 transition-all duration-300 text-left"
          } else if (isSelected) {
            buttonClasses = `${sharedStyles.option} ${sharedStyles.optionSelected}`
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={hasFeedback && isSelected}
              className={`${buttonClasses} ${hasFeedback && isSelected ? "cursor-default opacity-100" : "cursor-pointer"
                }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-left flex-1" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>{option.label}</span>
                {isSelected && hasFeedback && (
                  <span className="ml-3 text-3xl md:text-4xl">
                    {isCorrect ? "✓" : "✗"}
                  </span>
                )}
              </div>
              {isSelected && hasFeedback && option.explanation && (
                <p
                  className={`mt-3 text-left ${isCorrect ? "text-emerald-800" : "text-red-800"}`}
                  style={{ fontSize: 'clamp(20px, 4vw, 26px)', lineHeight: 1.5 }}
                >
                  {option.explanation}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
