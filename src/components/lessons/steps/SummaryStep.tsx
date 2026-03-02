"use client"

import React, { useEffect } from "react"
import { SummaryStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH } from "../layoutConstants"

interface SummaryStepProps {
  step: SummaryStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
}

import { motion } from "framer-motion"

export function SummaryStep({ step, onAnswered }: SummaryStepProps) {
  useEffect(() => {
    onAnswered({ isCompleted: true })
  }, [onAnswered])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center justify-center text-center p-6 flex-1 min-h-[60vh]"
      style={{ gap: 40 }}
    >
      <div className="space-y-6">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={sharedStyles.title}
          style={{ fontSize: 'clamp(32px, 8vw, 64px)' }}
        >
          {step.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={sharedStyles.body}
        >
          {step.body.split('\n\n').map((line, i) => (
            <p key={i} style={{ margin: '0.8rem 0' }}>{line}</p>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.6
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-blue-400 blur-[80px] opacity-20 rounded-full" />
        <img
          src={(step as { imageUrl?: string }).imageUrl || "/Lección%20completada.png"}
          alt="Lección completada"
          className="relative z-10 w-full max-w-[320px] h-auto object-contain drop-shadow-2xl"
        />
      </motion.div>
    </motion.div>
  )
}

