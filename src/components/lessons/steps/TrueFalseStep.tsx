"use client"

import React, { useState } from "react"
import { TrueFalseStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { LessonProgressHeader } from "../LessonProgressHeader"

interface TrueFalseStepProps {
  step: TrueFalseStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  selectedValue?: boolean
  onExit?: () => void
  onContinue?: () => void
  isContinueEnabled?: boolean
  currentStepIndex?: number
  totalSteps?: number
  streak?: number
  stars?: 1 | 2 | 3
}

export function TrueFalseStep({
  step,
  onAnswered,
  selectedValue: initialValue,
  onExit,
  onContinue,
  isContinueEnabled,
  currentStepIndex = 0,
  totalSteps = 1,
  streak = 0,
  stars = 3,
}: TrueFalseStepProps) {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(initialValue)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const handleSelect = (value: boolean) => {
    if (step.fullScreen) {
      // Full-screen mode: just select, don't check yet
      if (hasChecked && value !== selectedValue) {
        // Allow retry after wrong answer
        setHasChecked(false)
        setSelectedValue(value)
        setShowFeedback(false)
      } else if (!hasChecked) {
        setSelectedValue(value)
      }
    } else {
      // Non-fullScreen: immediate feedback
      setSelectedValue(value)
      const isCorrect = value === step.correctValue
      setShowFeedback(true)
      
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
  }

  const handleCheck = () => {
    if (selectedValue === undefined) return
    
    const isCorrect = selectedValue === step.correctValue
    setHasChecked(true)
    setShowFeedback(true)
    
    if (isCorrect) {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }
    
    onAnswered({ 
      isCompleted: true, 
      isCorrect,
      answerData: { selectedValue }
    })
  }

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

  // Full-screen mode: new visual design matching the image
  if (step.fullScreen && onExit && onContinue) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        textAlign: 'center', 
        minHeight: '100dvh',
        padding: '2rem 1.5rem',
        background: '#f1f5f9',
        boxSizing: 'border-box',
      }}>
        <LessonProgressHeader
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          streak={streak}
          stars={stars}
        />

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '700px', gap: '3rem' }}>
          {/* Statement as title */}
          <h2 style={{ 
            fontSize: 'clamp(24px, 5vw, 40px)', 
            fontWeight: 600, 
            marginBottom: 0,
            color: '#1e293b',
            lineHeight: 1.3,
          }}>
            {step.statement}
          </h2>
          
          {/* Buttons: vertically stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '600px' }}>
            <button
              onClick={() => handleSelect(true)}
              disabled={hasChecked && isContinueEnabled}
              style={{
                padding: '1.5rem 2rem',
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 600,
                ...getButtonStyle(true),
                borderRadius: '9999px',
                cursor: hasChecked && isContinueEnabled ? 'default' : 'pointer',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
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
              disabled={hasChecked && isContinueEnabled}
              style={{
                padding: '1.5rem 2rem',
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 600,
                ...getButtonStyle(false),
                borderRadius: '9999px',
                cursor: hasChecked && isContinueEnabled ? 'default' : 'pointer',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
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

          {/* Explanation feedback (show after check) */}
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

        {/* Buttons at bottom */}
        <div style={{ 
          width: '100%', 
          maxWidth: '900px',
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
        }}>
          <button
            onClick={onExit}
            style={{
              padding: '16px 48px',
              fontSize: 'clamp(18px, 3.5vw, 24px)',
              fontWeight: 500,
              color: '#2563eb',
              background: '#f1f5f9',
              border: '3px solid #1e293b',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              minWidth: '140px',
            }}
          >
            Salir
          </button>
          {hasChecked && isContinueEnabled ? (
            <button
              onClick={onContinue}
              style={{
                padding: '16px 48px',
                fontSize: 'clamp(18px, 3.5vw, 24px)',
                fontWeight: 600,
                color: '#ffffff',
                background: '#2563eb',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                minWidth: '180px',
              }}
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleCheck}
              disabled={selectedValue === undefined}
              style={{
                padding: '16px 48px',
                fontSize: 'clamp(18px, 3.5vw, 24px)',
                fontWeight: 600,
                color: '#ffffff',
                background: selectedValue !== undefined ? '#2563eb' : '#94a3b8',
                border: 'none',
                borderRadius: '9999px',
                cursor: selectedValue !== undefined ? 'pointer' : 'not-allowed',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                minWidth: '180px',
              }}
            >
              Comprobar
            </button>
          )}
        </div>
      </div>
    )
  }

  // Non-fullScreen: original compact mode for compatibility
  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      <h3 className={sharedStyles.question}>{step.statement}</h3>
      <div className={`${sharedStyles.flexRow} mt-6 md:mt-8`}>
        <button
          onClick={() => {
            const value = true
            setSelectedValue(value)
            const isCorrect = value === step.correctValue
            setShowFeedback(true)
            if (isCorrect) playCorrectSound()
            else playIncorrectSound()
            onAnswered({ isCompleted: true, isCorrect, answerData: { selectedValue: value } })
          }}
          disabled={showFeedback}
          className={`${sharedStyles.button} ${sharedStyles.spacing.md} flex-1 transition-all duration-300 rounded-2xl ${
            !showFeedback || selectedValue !== true
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
          onClick={() => {
            const value = false
            setSelectedValue(value)
            const isCorrect = value === step.correctValue
            setShowFeedback(true)
            if (isCorrect) playCorrectSound()
            else playIncorrectSound()
            onAnswered({ isCompleted: true, isCorrect, answerData: { selectedValue: value } })
          }}
          disabled={showFeedback}
          className={`${sharedStyles.button} ${sharedStyles.spacing.md} flex-1 transition-all duration-300 rounded-2xl ${
            !showFeedback || selectedValue !== false
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

