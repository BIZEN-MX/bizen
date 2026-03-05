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
      className="info-step-container"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <style>{`
        .info-step-card {
          width: 100%;
          background: #FFFFFF;
          border-radius: 32px;
          border: 1px solid rgba(15, 98, 254, 0.1);
          box-shadow: 
            0 1px 2px rgba(15, 98, 254, 0.05),
            0 4px 12px rgba(15, 98, 254, 0.05),
            0 12px 32px rgba(15, 98, 254, 0.1);
          overflow: hidden;
          position: relative;
        }
        .info-step-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; height: 6px;
          background: linear-gradient(90deg, #3b82f6, #2563eb, #1e40af);
          z-index: 10;
        }
        .info-content-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 32px 24px;
        }
        @media (min-width: 768px) {
          .info-content-layout {
            flex-direction: ${step.imageUrl ? (step.imageAlign === "left" ? "row-reverse" : "row") : "column"};
            padding: 48px;
            gap: 48px;
            text-align: ${step.imageUrl ? (step.imageAlign === "left" ? "right" : "left") : "center"};
          }
          .info-text-wrapper {
            align-items: ${step.imageUrl ? (step.imageAlign === "left" ? "flex-end" : "flex-start") : "center"} !important;
          }
        }
        .reveal-card {
          max-width: 420px;
          min-height: 280px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid #F1F5F9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 40px 24px;
          text-align: center;
        }
        .reveal-card:hover {
          border-color: #3b82f6;
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 98, 254, 0.12);
        }
      `}</style>

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleReveal}
            className="info-step-card reveal-card"
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <Image src="/hero4.png" alt="Billy" width={56} height={56} style={{ objectFit: "contain" }} />
            </div>
            <div style={{
              padding: "12px 20px",
              background: "#F9FAFB",
              borderRadius: 14,
              border: "2px dashed #BFDBFE",
            }}>
              <p style={{ margin: 0, fontSize: 14, color: "#2563eb", fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>
                Haz clic para revelar
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="info-step-card"
            style={{ maxWidth: 880 }}
          >
            <div className="info-content-layout">
              {/* Text Content */}
              <div className="info-text-wrapper" style={{ flex: 1.2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {step.title && (
                  <h2 style={{
                    fontSize: "clamp(22px, 5vw, 32px)",
                    fontWeight: 900,
                    color: "#0f172a",
                    margin: "0 0 16px 0",
                    lineHeight: 1.2,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "-0.02em"
                  }}>
                    {step.title}
                  </h2>
                )}

                <div style={{
                  fontSize: "clamp(17px, 3vw, 21px)",
                  color: "#334155",
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  width: "100%",
                }}>
                  {step.body.split("\n\n").map((line, i) => (
                    <p key={i} style={{
                      margin: "0 0 16px 0",
                      whiteSpace: "pre-wrap"
                    }}>
                      {line}
                    </p>
                  ))}
                </div>

                {step.description && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    background: "#eff6ff",
                    borderRadius: 99,
                    marginTop: 8
                  }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#2563eb",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {step.description}
                    </span>
                  </div>
                )}
              </div>

              {/* Image Content */}
              {step.imageUrl && (
                <div style={{
                  flex: 0.8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 320,
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    inset: "-10%",
                    background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
                    zIndex: -1
                  }} />
                  <img
                    src={step.imageUrl}
                    alt={step.title || "Illustration"}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "300px",
                      objectFit: "contain",
                      filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.12))"
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
