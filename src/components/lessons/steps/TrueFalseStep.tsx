"use client"

import React, { useState, useEffect } from "react"
import { TrueFalseStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_GAP } from "../layoutConstants"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"

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
  isReviewStep = false,
  actionTrigger = 0,
}: TrueFalseStepProps) {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(initialValue)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (initialValue !== undefined) {
      setSelectedValue(initialValue)
    }
  }, [initialValue])

  useEffect(() => {
    if (step.fullScreen) {
      onAnswered({ isCompleted: false, canAction: selectedValue !== undefined && !hasChecked })
    }
  }, [selectedValue, hasChecked, step.fullScreen, onAnswered])

  const handleSelect = (value: boolean) => {
    if (hasChecked && !isReviewStep) return
    setSelectedValue(value)

    if (!step.fullScreen) {
      // Immediate feedback for normal mode
      setHasChecked(true)
      setShowFeedback(true)
      const isCorrect = value === step.correctValue
      if (isCorrect) playCorrectSound()
      else playIncorrectSound()
      onAnswered({ isCompleted: true, isCorrect, answerData: { selectedValue: value } })
    }
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
    if (actionTrigger && actionTrigger > 0 && selectedValue !== undefined && !hasChecked && step.fullScreen) {
      handleCheck()
    }
  }, [actionTrigger])

  const getButtonStyle = (value: boolean) => {
    if (!showFeedback || selectedValue !== value) {
      return selectedValue === value
        ? { background: '#bfdbfe', border: '3px solid #2563eb', color: '#1e293b' }
        : { background: '#dbeafe', border: '3px solid transparent', color: '#1e293b' }
    }
    const isCorrect = value === step.correctValue
    return isCorrect
      ? { background: '#d1fae5', border: '3px solid #10b981', color: '#047857' }
      : { background: '#fee2e2', border: '3px solid #ef4444', color: '#dc2626' }
  }

  // Full-screen mode
  if (step.fullScreen) {
    const align = step.imageAlign ?? "right"
    const imageBlock = step.imageUrl ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: '120px', maxWidth: 'min(40%, 300px)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={step.imageUrl}
          alt=""
          style={{
            maxWidth: '100%',
            width: 'auto',
            height: 'auto',
            maxHeight: 'clamp(120px, 20vh, 240px)',
            objectFit: 'contain',
          }}
        />
      </div>
    ) : null
    const activityBlock = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', width: '100%', maxWidth: '700px', minWidth: 0 }}>
        <ExerciseInstruction type="trueFalse" />
        <h2 style={{
          fontSize: 'clamp(24px, 5vw, 40px)',
          fontWeight: 600,
          marginBottom: 0,
          color: '#1e293b',
          lineHeight: 1.3,
        }}>
          {step.statement}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '600px', alignSelf: 'center' }}>
          <button
            onClick={() => handleSelect(true)}
            disabled={hasChecked && !isReviewStep}
            style={{
              padding: '1.5rem 2rem',
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 600,
              ...getButtonStyle(true),
              borderRadius: '9999px',
              cursor: hasChecked && !isReviewStep ? 'default' : 'pointer',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: selectedValue === true ? '0 4px 0 #1e40af' : 'none',
              position: 'relative'
            }}
          >
            <span>Verdadero</span>
            {showFeedback && selectedValue === true && (
              <span style={{ fontSize: '1.5rem' }}>
                {step.correctValue === true ? '✓' : '✗'}
              </span>
            )}
          </button>
          <button
            onClick={() => handleSelect(false)}
            disabled={hasChecked && !isReviewStep}
            style={{
              padding: '1.5rem 2rem',
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 600,
              ...getButtonStyle(false),
              borderRadius: '9999px',
              cursor: hasChecked && !isReviewStep ? 'default' : 'pointer',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: selectedValue === false ? '0 4px 0 #1e40af' : 'none',
              position: 'relative'
            }}
          >
            <span>Falso</span>
            {showFeedback && selectedValue === false && (
              <span style={{ fontSize: '1.5rem' }}>
                {step.correctValue === false ? '✓' : '✗'}
              </span>
            )}
          </button>
        </div>

        {showFeedback && step.explanation && (
          <div style={{
            marginTop: '1rem',
            padding: '1.5rem 2rem',
            borderRadius: '16px',
            ...(selectedValue === step.correctValue
              ? { background: '#d1fae5', border: '2px solid #10b981', color: '#047857' }
              : { background: '#fee2e2', border: '2px solid #ef4444', color: '#dc2626' }),
            fontSize: 'clamp(18px, 3.5vw, 24px)',
            lineHeight: 1.5,
            fontWeight: 500,
            maxWidth: '600px',
            width: '100%',
          }}>
            {step.explanation}
          </div>
        )}
      </div>
    )

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
          {imageBlock ? (
            (() => {
              const contentSide = <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{activityBlock}</div>
              return (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: CONTENT_GAP, flexWrap: 'nowrap', height: '100%', minHeight: 0 }}>
                  {align === 'left' ? imageBlock : contentSide}
                  {align === 'left' ? contentSide : imageBlock}
                </div>
              )
            })()
          ) : activityBlock}
        </div>
      </div>
    )
  }

  // Non-fullScreen
  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      <ExerciseInstruction type="trueFalse" />
      <h3 className={sharedStyles.question}>{step.statement}</h3>
      <div className={`${sharedStyles.flexRow} mt-6 md:mt-8`}>
        <button
          onClick={() => handleSelect(true)}
          disabled={showFeedback}
          className={`${sharedStyles.button} ${sharedStyles.spacing.md} flex-1 transition-all duration-300 rounded-2xl ${!showFeedback || selectedValue !== true
            ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300"
            : (true === step.correctValue
              ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-600"
              : "bg-red-100 text-red-900 border-2 border-red-600")
            } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
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
          className={`${sharedStyles.button} ${sharedStyles.spacing.md} flex-1 transition-all duration-300 rounded-2xl ${!showFeedback || selectedValue !== false
            ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300"
            : (false === step.correctValue
              ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-600"
              : "bg-red-100 text-red-900 border-2 border-red-600")
            } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
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
          className={`mt-5 p-5 md:p-6 rounded-2xl ${selectedValue === step.correctValue
            ? "bg-emerald-100 border-2 border-emerald-600"
            : "bg-red-100 border-2 border-red-600"
            }`}
        >
          <p
            className={`text-xl md:text-2xl ${selectedValue === step.correctValue ? "text-emerald-900" : "text-red-900"
              }`}
          >
            {step.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
