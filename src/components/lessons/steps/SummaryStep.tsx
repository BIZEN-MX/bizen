"use client"

import React, { useEffect } from "react"
import { SummaryStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH } from "../layoutConstants"

interface SummaryStepProps {
  step: SummaryStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
}

export function SummaryStep({ step, onAnswered }: SummaryStepProps) {
  useEffect(() => {
    // Summary steps are always completed immediately (run once on mount)
    onAnswered({ isCompleted: true })
  }, [onAnswered])

  // Full-screen mode or Regular mode is unified now
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: step.fullScreen ? 'auto' : '60vh',
      flex: 1,
      width: '100%',
      padding: '1rem',
      boxSizing: 'border-box',
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
      {/* Lesson-completed image */}
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
  )
}
