"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Lightbulb, Zap } from "lucide-react"
import { haptic } from "@/utils/hapticFeedback"
import { playCorrectSound } from "../lessonSounds"
import { BaseLessonStep } from "@/types/lessonTypes"

export interface NarrativeCheckStepFields {
  stepType: "narrative_check"
  question: string
  promptPlaceholder?: string
  minChars?: number
  billyResponse?: string // What Billy says after the commitment
}

interface NarrativeCheckStepProps {
  step: BaseLessonStep & NarrativeCheckStepFields
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger: number
  isContinueEnabled: boolean
}

const MIN_CHARS_DEFAULT = 20

export function NarrativeCheckStep({ step, onAnswered, isContinueEnabled }: NarrativeCheckStepProps) {
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(isContinueEnabled)
  const minChars = step.minChars ?? MIN_CHARS_DEFAULT
  const charsLeft = Math.max(0, minChars - text.length)
  const isReady = text.length >= minChars

  const handleSubmit = useCallback(() => {
    if (!isReady || submitted) return
    setSubmitted(true)
    haptic.success()
    playCorrectSound()
    onAnswered({
      isCompleted: true,
      isCorrect: true,
      answerData: { commitment: text },
    })
  }, [isReady, submitted, text, onAnswered])

  const billyResponse = step.billyResponse ||
    "¡Eso es todo! Comprometerse en voz alta (o por escrito) aumenta 3x la probabilidad de que lo cumplas. ¡Tu yo futuro ya te lo agradece!"

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 24,
      maxWidth: 520, margin: "0 auto", width: "100%",
    }}>
      {/* Bizen prompt card */}
      <div style={{
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        border: "2px solid #bfdbfe",
        borderRadius: 20,
        padding: "20px 24px",
        display: "flex", gap: 16, alignItems: "flex-start",
      }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
          <Zap size={24} color="white" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            BIZEN Insight
          </p>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 18px)", fontWeight: 600, color: "#1e293b", margin: 0, lineHeight: 1.4 }}>
            {step.question}
          </p>
        </div>
      </div>

      {/* Input area */}
      {!submitted ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={step.promptPlaceholder || "Escribe tu compromiso aquí..."}
            rows={4}
            style={{
              width: "100%",
              borderRadius: 16,
              border: `2px solid ${isReady ? "#2563eb" : "#e2e8f0"}`,
              padding: "16px",
              fontSize: 16,
              fontFamily: "inherit",
              color: "#1e293b",
              resize: "none",
              outline: "none",
              background: "#fff",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
              lineHeight: 1.6,
              boxShadow: isReady ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: charsLeft > 0 ? "#94a3b8" : "#16a34a", fontWeight: 600 }}>
              {charsLeft > 0 ? `Mínimo ${charsLeft} caracteres más` : "✓ Listo para enviar"}
            </span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{text.length} caracteres</span>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={!isReady}
            whileTap={isReady ? { scale: 0.97 } : {}}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: isReady
                ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                : "#e2e8f0",
              color: isReady ? "white" : "#94a3b8",
              fontSize: 16,
              fontWeight: 700,
              cursor: isReady ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: isReady ? "0 6px 20px rgba(37,99,235,0.3)" : "none",
            }}
          >
            Me comprometo
          </motion.button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              border: "2px solid #86efac",
              borderRadius: 20,
              padding: "20px 24px",
              display: "flex", flexDirection: "column", gap: 12,
            }}
          >
            {/* Show their commitment */}
            <div style={{
              background: "white",
              borderRadius: 12,
              padding: "12px 16px",
              border: "1.5px solid #bbf7d0",
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <CheckCircle2 size={20} color="#16a34a" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 15, color: "#166534", fontWeight: 600, lineHeight: 1.5 }}>
                "{text}"
              </p>
            </div>

            {/* Billy's response */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Lightbulb size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 14, color: "#166534", fontWeight: 500, lineHeight: 1.55 }}>
                {billyResponse}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
