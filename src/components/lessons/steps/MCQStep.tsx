"use client"

import React, { useState } from "react"
import { McqStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"

interface MCQStepProps {
  step: McqStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  selectedOptionId?: string
  onExit?: () => void
  onContinue?: () => void
  isContinueEnabled?: boolean
  currentStepIndex?: number
  totalSteps?: number
}

export function MCQStep({ step, onAnswered, selectedOptionId: initialSelected, onExit, onContinue, isContinueEnabled, currentStepIndex = 0, totalSteps = 1 }: MCQStepProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(initialSelected)
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({})
  const [hasChecked, setHasChecked] = useState(false)

  const handleSelect = (optionId: string) => {
    if (step.fullScreen && !hasChecked) {
      // In fullScreen mode, just select without feedback until "Comprobar" is clicked
      setSelectedOptionId(optionId)
    } else {
      // Regular mode: immediate feedback
      setSelectedOptionId(optionId)
      const selectedOption = step.options.find((opt) => opt.id === optionId)
      const isCorrect = selectedOption?.isCorrect ?? false
      
      // Show visual feedback
      setShowFeedback({ [optionId]: true })
      
      // Play sound
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
    if (!selectedOptionId) return
    
    const selectedOption = step.options.find((opt) => opt.id === selectedOptionId)
    const isCorrect = selectedOption?.isCorrect ?? false
    
    setHasChecked(true)
    setShowFeedback({ [selectedOptionId]: true })
    
    // Play sound
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

  // Full-screen mode: new visual design matching the image
  if (step.fullScreen && onExit && onContinue) {
    const optionLabels = ['A)', 'B)', 'C)', 'D)', 'E)', 'F)']
    
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
        {/* Functional progress bar */}
        <div style={{ 
          width: 'min(90%, 900px)', 
          height: '32px', 
          borderRadius: '20px', 
          border: '3px solid #1e293b',
          background: '#e2e8f0',
          marginBottom: '2rem',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <div style={{
            width: `${totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0}%`,
            height: '100%',
            background: '#2563eb',
            borderRadius: '14px',
            minWidth: totalSteps > 0 ? 8 : 0,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '800px' }}>
          {/* Question as title */}
          <h2 style={{ 
            fontSize: 'clamp(24px, 5vw, 40px)', 
            fontWeight: 600, 
            marginBottom: '3rem',
            color: '#1e293b',
            lineHeight: 1.3,
          }}>
            {step.question}
          </h2>
          
          {/* Options as rounded pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '700px' }}>
            {step.options.map((option, index) => {
              const isSelected = selectedOptionId === option.id
              const hasFeedback = showFeedback[option.id] && hasChecked
              const isCorrect = option.isCorrect
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={hasChecked}
                  style={{
                    padding: '1.5rem 2rem',
                    fontSize: 'clamp(18px, 3.5vw, 24px)',
                    fontWeight: 500,
                    color: hasFeedback ? (isCorrect ? '#047857' : '#dc2626') : '#1e293b',
                    background: hasFeedback 
                      ? (isCorrect ? '#d1fae5' : '#fee2e2')
                      : isSelected 
                        ? '#bfdbfe' 
                        : '#dbeafe',
                    border: hasFeedback 
                      ? (isCorrect ? '3px solid #10b981' : '3px solid #ef4444')
                      : isSelected
                        ? '3px solid #2563eb'
                        : '3px solid transparent',
                    borderRadius: '9999px',
                    cursor: hasChecked ? 'default' : 'pointer',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
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
              )
            })}
          </div>

          {/* Feedback after checking */}
          {hasChecked && selectedOptionId && showFeedback[selectedOptionId] && (
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              borderRadius: '16px',
              background: step.options.find(o => o.id === selectedOptionId)?.isCorrect ? '#d1fae5' : '#fee2e2',
              border: `2px solid ${step.options.find(o => o.id === selectedOptionId)?.isCorrect ? '#10b981' : '#ef4444'}`,
              fontSize: 'clamp(18px, 3.5vw, 22px)',
              color: step.options.find(o => o.id === selectedOptionId)?.isCorrect ? '#047857' : '#dc2626',
              fontWeight: 500,
            }}>
              {step.options.find(o => o.id === selectedOptionId)?.explanation}
            </div>
          )}
        </div>

        {/* Buttons at bottom */}
        <div style={{ 
          width: '100%', 
          maxWidth: '900px',
          display: 'flex', 
          gap: '1.5rem',
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
          {!hasChecked ? (
            <button
              onClick={handleCheck}
              disabled={!selectedOptionId}
              style={{
                padding: '16px 48px',
                fontSize: 'clamp(18px, 3.5vw, 24px)',
                fontWeight: 600,
                color: '#ffffff',
                background: selectedOptionId ? '#2563eb' : '#94a3b8',
                border: 'none',
                borderRadius: '9999px',
                cursor: selectedOptionId ? 'pointer' : 'not-allowed',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                minWidth: '180px',
              }}
            >
              Comprobar
            </button>
          ) : (
            <button
              onClick={onContinue}
              disabled={!isContinueEnabled}
              style={{
                padding: '16px 48px',
                fontSize: 'clamp(18px, 3.5vw, 24px)',
                fontWeight: 600,
                color: '#ffffff',
                background: isContinueEnabled ? '#2563eb' : '#94a3b8',
                border: 'none',
                borderRadius: '9999px',
                cursor: isContinueEnabled ? 'pointer' : 'not-allowed',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                minWidth: '180px',
              }}
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    )
  }

  // Regular mode: original design
  return (
    <div className={sharedStyles.container} style={{ maxWidth: 800, margin: '0 auto' }}>
      {step.title && <h2 className={sharedStyles.title} style={{ fontSize: 'clamp(36px, 7vw, 56px)', color: '#1e293b' }}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description} style={{ fontSize: 'clamp(20px, 4vw, 28px)', color: '#1e293b' }}>{step.description}</p>}
      <h3 className={sharedStyles.question} style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', color: '#1e293b', marginBottom: '1.5rem' }}>{step.question}</h3>
      <div className={sharedStyles.grid1Col}>
        {step.options.map((option) => {
          const isSelected = selectedOptionId === option.id
          const hasFeedback = showFeedback[option.id]
          const isCorrect = option.isCorrect
          
          // Determine button style based on selection and correctness
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
              className={`${buttonClasses} ${
                hasFeedback && isSelected ? "cursor-default opacity-100" : "cursor-pointer"
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

