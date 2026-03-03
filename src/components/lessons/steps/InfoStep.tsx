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
    // Block the blue footer button until revealed
    if (!isRevealed) {
      onAnswered({ isCompleted: false, canAction: false })
    }
  }, [onAnswered, isContinueEnabled, isRevealed])

  const handleReveal = () => {
    setIsRevealed(true)
    onAnswered({ isCompleted: true })
  }

  useEffect(() => {
    if (actionTrigger > 0 && !isRevealed) {
      handleReveal()
    }
  }, [actionTrigger])


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReveal}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              padding: "48px 32px",
              textAlign: "center",
              background: "#FFFFFF",
              borderRadius: 32,
              border: "3px solid #F1F5F9",
              boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
              cursor: "pointer",
              width: "100%",
              maxWidth: 480,
              minHeight: 300,
            }}
          >
            <div style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Image src="/hero4.png" alt="Billy" width={70} height={70} style={{ objectFit: "contain" }} />
            </div>
            <div style={{
              padding: "16px 24px",
              background: "#F9FAFB",
              borderRadius: 16,
              border: "2px dashed #BFDBFE",
            }}>
              <p style={{ margin: 0, fontSize: 15, color: "#0F62FE", fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                Toca la tarjeta para revelar
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            style={{
              width: "100%",
              maxWidth: 520,
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 32px",
              background: "#FFFFFF",
              borderRadius: 40,
              border: "5px solid #0F62FE",
              textAlign: "center",
              boxShadow: "0 12px 64px rgba(15, 98, 254, 0.15)",
              gap: 12,
              perspective: 1000,
            }}
          >
            {step.title && (
              <h2 style={{
                fontSize: "clamp(24px, 4.5vw, 36px)",
                fontWeight: 900,
                color: "#111827",
                margin: "0 0 16px 0",
                lineHeight: 1.2,
                fontFamily: "'Montserrat', sans-serif",
              }}>
                {step.title}
              </h2>
            )}

            <div style={{
              fontSize: "clamp(18px, 2.8vw, 24px)",
              color: "#374151",
              lineHeight: 1.5,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              maxWidth: "100%",
            }}>
              {step.body.split("\n\n").map((line, i) => (
                <p key={i} style={{
                  margin: "0 0 16px 0",
                  fontFamily: "'Montserrat', sans-serif",
                  whiteSpace: "pre-wrap"
                }}>
                  {line}
                </p>
              ))}
            </div>

            {step.description && (
              <p style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0F62FE",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "12px 0 0 0",
                fontFamily: "'Montserrat', sans-serif",
              }}>
                {step.description}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
