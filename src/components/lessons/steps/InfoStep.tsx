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
    <div className={sharedStyles.container}>
      {step.title && (
        <>
          <h2 className={sharedStyles.title}>{step.title}</h2>
          <div className="h-1 w-16 md:w-20 rounded-full bg-slate-300 mb-4" aria-hidden />
        </>
      )}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
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
      <div className={sharedStyles.body}>{step.body}</div>
    </div>
  )
}

