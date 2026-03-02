"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { InfoStepFields } from "@/types/lessonTypes"
import { motion, AnimatePresence } from "framer-motion"

interface InfoStepProps {
  step: InfoStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger?: number
  isContinueEnabled?: boolean
}

export function InfoStep({ step, onAnswered, actionTrigger = 0, isContinueEnabled = false }: InfoStepProps) {
  const [isRevealed, setIsRevealed] = useState(isContinueEnabled)

  useEffect(() => {
    if (isContinueEnabled) {
      setIsRevealed(true)
      return
    }
    // Always notify that we can proceed to reveal or continue
    onAnswered({ isCompleted: false, canAction: true })
  }, [onAnswered, isContinueEnabled])

  const handleReveal = () => {
    setIsRevealed(true)
    onAnswered({ isCompleted: true })
  }

  useEffect(() => {
    if (actionTrigger > 0 && !isRevealed) {
      handleReveal()
    }
  }, [actionTrigger])

  const textContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {step.title && (
        <h2 style={{
          fontSize: "clamp(22px, 4vw, 32px)",
          fontWeight: 900,
          color: "#111827",
          margin: 0,
          lineHeight: 1.25,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          {step.title}
        </h2>
      )}
      {step.description && (
        <p style={{
          fontSize: "clamp(12px, 1.4vw, 14px)",
          fontWeight: 800,
          color: "#0F62FE",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: 0,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          {step.description}
        </p>
      )}
      <div style={{
        fontSize: "clamp(15px, 1.8vw, 18px)",
        color: "#374151",
        lineHeight: 1.75,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 500,
      }}>
        {step.body.split("\n\n").map((line, i) => (
          <p key={i} style={{ margin: "0 0 12px", fontFamily: "'Montserrat', sans-serif" }}>{line}</p>
        ))}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 28 }}
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              padding: "48px 24px",
              textAlign: "center",
              background: "#FFFFFF",
              borderRadius: 20,
              border: "1.5px solid #F1F5F9",
            }}
          >
            <div style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Image src="/hero4.png" alt="Billy" width={90} height={90} style={{ objectFit: "contain" }} />
            </div>
            <div style={{
              padding: "16px 28px",
              background: "#F9FAFB",
              borderRadius: 16,
              border: "2px dashed #BFDBFE",
            }}>
              <p style={{ margin: 0, fontSize: 16, color: "#0F62FE", fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                Toca continuar para descubrir el contenido
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            style={{ width: "100%" }}
          >
            {step.imageUrl && (
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
                <img
                  src={step.imageUrl}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    maxHeight: "clamp(160px, 28vh, 260px)",
                    objectFit: "contain",
                    borderRadius: 20,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  }}
                />
              </div>
            )}
            {textContent}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
