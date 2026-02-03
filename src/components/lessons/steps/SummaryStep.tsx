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
    <div className={sharedStyles.container}>
      <div className="h-1 w-20 md:w-24 rounded-full bg-slate-300 mb-4" aria-hidden />
      <h2 className={sharedStyles.title}>{step.title}</h2>
      <div
        className={`${sharedStyles.body} mt-6 p-5 md:p-6 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 text-2xl md:text-3xl lg:text-4xl`}
      >
        {step.body}
      </div>
    </div>
  )
}

