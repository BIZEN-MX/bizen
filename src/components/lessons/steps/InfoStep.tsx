"use client"

import React, { useEffect } from "react"
import Image from "next/image"
import { InfoStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"

interface InfoStepProps {
  step: InfoStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
}

export function InfoStep({ step, onAnswered }: InfoStepProps) {
  useEffect(() => {
    // Info steps are always completed immediately (no interaction needed). Run once on mount
    // so we don't re-trigger when parent recreates onAnswered and cause an infinite loop.
    onAnswered({ isCompleted: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: call once on mount only
  }, [])

  return (
    <div className={sharedStyles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
      {step.title && (
        <>
          <h2 className={sharedStyles.title} style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 600, marginBottom: '2rem' }}>{step.title}</h2>
        </>
      )}
      {step.description && <p className={sharedStyles.description} style={{ fontSize: 'clamp(16px, 3vw, 20px)', marginBottom: '2rem', color: '#64748b', fontWeight: 500 }}>{step.description}</p>}
      {step.imageUrl && (
        <div className={`${sharedStyles.imageContainer} my-6 md:my-8`}>
          <Image
            src={step.imageUrl}
            alt="Ilustración de la lección"
            width={400}
            height={400}
            className={`${sharedStyles.image} object-contain`}
          />
        </div>
      )}
      <div className={sharedStyles.body} style={{ fontSize: 'clamp(16px, 3vw, 20px)', lineHeight: 1.8, maxWidth: '600px' }}>
        {step.body.split('\n\n').map((line, i) => (
          <p key={i} style={{ margin: '0.5rem 0' }}>{line}</p>
        ))}
      </div>
    </div>
  )
}

