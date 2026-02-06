"use client"

import React, { useEffect, useRef } from "react"
import { SummaryStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"

interface SummaryStepProps {
  step: SummaryStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
}

export function SummaryStep({ step, onAnswered }: SummaryStepProps) {
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered
  useEffect(() => {
    // Summary steps are always completed immediately (run once on mount)
    onAnsweredRef.current({ isCompleted: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run once on mount only
  }, [])

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

