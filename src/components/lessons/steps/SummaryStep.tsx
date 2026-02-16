"use client"

import React, { useEffect, useRef } from "react"
import { SummaryStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH } from "../layoutConstants"
// LessonProgressHeader now shown in LessonScreen for all slides

interface SummaryStepProps {
  step: SummaryStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  onExit?: () => void
  onContinue?: () => void
  isContinueEnabled?: boolean
  isLastStep?: boolean
  currentStepIndex?: number
  totalSteps?: number
  streak?: number
  stars?: 0 | 1 | 2 | 3
}

export function SummaryStep({ step, onAnswered, onExit, onContinue, isContinueEnabled, isLastStep, currentStepIndex = 0, totalSteps = 1, streak = 0, stars = 3 }: SummaryStepProps) {
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered
  useEffect(() => {
    // Summary steps are always completed immediately (run once on mount)
    onAnsweredRef.current({ isCompleted: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run once on mount only
  }, [])

  // Full-screen mode: same layout as InfoStep fullScreen (summary always shows buttons when onExit/onContinue provided)
  const showFullScreenLayout = (step.fullScreen || step.stepType === "summary") && onExit && onContinue
  if (showFullScreenLayout) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        textAlign: 'center', 
        minHeight: 0,
        flex: 1,
        height: '100%',
        width: '100%',
        padding: '2rem 1.5rem',
        background: '#f1f5f9',
        boxSizing: 'border-box',
      }}>
        {/* Content area - scrollable so buttons stay in view */}
        <div style={{ 
          flex: 1, 
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
          <h2 style={{ 
            fontSize: 'clamp(40px, 8vw, 64px)', 
            fontWeight: 700, 
            marginBottom: '2rem',
            color: '#1e293b',
          }}>
            {step.title}
          </h2>
          <div style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', lineHeight: 1.8, maxWidth: '700px', color: '#1e293b' }}>
            {step.body.split('\n\n').map((line, i) => (
              <p key={i} style={{ margin: '0.8rem 0' }}>{line}</p>
            ))}
          </div>
          {/* Lesson-completed image: below text, above nav buttons; constrained so buttons stay in view */}
          <div style={{ marginTop: '1.5rem', flexShrink: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
            <img
              src={(step as { imageUrl?: string }).imageUrl || "/Lección%20completada.png"}
              alt="Lección completada"
              style={{
                maxWidth: 'min(280px, 75vw)',
                maxHeight: 'min(200px, 35vh)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* Buttons - always visible at bottom; reserved space */}
        <div style={{ 
          width: '100%', 
          maxWidth: CONTENT_MAX_WIDTH,
          display: 'flex', 
          gap: '1.5rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.5rem',
          paddingTop: '0.75rem',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 0))',
          flexShrink: 0,
          minHeight: 72,
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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onContinue?.()
            }}
            disabled={!isLastStep && !isContinueEnabled}
            style={{
              padding: '16px 48px',
              fontSize: 'clamp(18px, 3.5vw, 24px)',
              fontWeight: 600,
              color: '#ffffff',
              background: (isLastStep || isContinueEnabled) ? '#2563eb' : '#94a3b8',
              border: 'none',
              borderRadius: '9999px',
              cursor: (isLastStep || isContinueEnabled) ? 'pointer' : 'not-allowed',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              minWidth: '180px',
            }}
          >
            {isLastStep ? "Siguiente lección" : (step.continueLabel || "Continuar")}
          </button>
        </div>
      </div>
    )
  }

  // Regular mode: centered layout
  return (
    <div className={sharedStyles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
      <h2 className={sharedStyles.title} style={{ fontSize: 'clamp(36px, 7vw, 56px)', fontWeight: 600, marginBottom: '2rem', color: '#1e293b' }}>{step.title}</h2>
      <div style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', lineHeight: 1.8, maxWidth: '700px', color: '#1e293b' }}>
        {step.body.split('\n\n').map((line, i) => (
          <p key={i} style={{ margin: '0.8rem 0' }}>{line}</p>
        ))}
      </div>
    </div>
  )
}

