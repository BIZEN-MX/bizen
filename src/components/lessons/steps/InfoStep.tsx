"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { InfoStepFields } from "@/types/lessonTypes"
import { playFlipSound } from "../lessonSounds"
import { motion, AnimatePresence } from "framer-motion"
import { SmartText } from "../SmartText"

interface InfoStepProps {
  step: InfoStepFields & {
    id: string
    title?: string
    description?: string
    fullScreen?: boolean
    continueLabel?: string
    imageAlign?: "left" | "right"
  }
  onAnswered: (result: {
    isCompleted: boolean
    isCorrect?: boolean
    answerData?: any
    canAction?: boolean
  }) => void
  actionTrigger?: number
  isContinueEnabled?: boolean
}

export function InfoStep({
  step,
  onAnswered,
  actionTrigger = 0,
  isContinueEnabled = false,
}: InfoStepProps) {
  const [isRevealed, setIsRevealed] = useState(isContinueEnabled)

  useEffect(() => {
    if (isContinueEnabled) {
      setIsRevealed(true)
      return
    }
    if (!isRevealed) {
      onAnswered({ isCompleted: false, canAction: false })
    }
  }, [onAnswered, isContinueEnabled, isRevealed])

  const handleReveal = () => {
    if (!isRevealed) {
      playFlipSound()
      setIsRevealed(true)
      onAnswered({ isCompleted: true })
    }
  }

  useEffect(() => {
    if (actionTrigger > 0 && !isRevealed) {
      handleReveal()
    }
  }, [actionTrigger])

  const hasImage = !!step.imageUrl
  const imageLeft = step.imageAlign === "left"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* ── PLACEHOLDER / TAP TO REVEAL ── */
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
            onClick={handleReveal}
            style={{
              width: "100%",
              maxWidth: 420,
              minHeight: "clamp(200px, 45vw, 280px)",
              background: "#FFFFFF",
              borderRadius: "clamp(20px, 6vw, 32px)",
              border: "2px dashed #BFDBFE",
              boxShadow: "0 4px 24px rgba(15,98,254,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(12px, 4vw, 24px)",
              padding: "clamp(24px, 10vw, 48px) clamp(16px, 6vw, 32px)",
              cursor: "pointer",
              userSelect: "none",
              position: "relative",
              overflow: "hidden",
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Subtle animated background gradient */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(15,98,254,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Billy mascot */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "clamp(100px, 18vw, 140px)",
                height: "clamp(100px, 18vw, 140px)",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(15,98,254,0.14)",
              }}
            >
              <div style={{ position: "relative", width: "70%", height: "70%" }}>
                <Image src="/hero4.png" alt="Billy" fill style={{ objectFit: "contain" }} />
              </div>
            </motion.div>

            {/* Tap hint */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}>
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  padding: "10px 24px",
                  background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
                  borderRadius: 99,
                  boxShadow: "0 4px 14px rgba(15,98,254,0.35)",
                }}
              >
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.03em",
                }}>
                  ¡Toca para ver la nota! →
                </p>
              </motion.div>
              <p style={{
                margin: 0,
                fontSize: 12,
                color: "#94A3B8",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}>
                Tenemos algo importante para ti
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── REVEALED FLASHCARD ── */
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 120 }}
            className="revealed-flashcard-container"
            style={{
              width: "100%",
              maxWidth: hasImage ? 900 : 680,
              background: "#FFFFFF",
              borderRadius: "clamp(20px, 6vw, 32px)",
              border: "2px solid rgba(15, 98, 254, 0.22)",
              boxShadow: [
                "0 0 0 4px rgba(15, 98, 254, 0.06)",
                "0 2px 6px rgba(15,98,254,0.08)",
                "0 10px 28px rgba(15,98,254,0.12)",
                "0 32px 64px rgba(15,98,254,0.10)",
              ].join(", "),
              overflow: "visible",
              position: "relative",
            }}
          >
            {/* Top accent bar with shimmer */}
            <div style={{
              height: 6,
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 35%, #3b82f6 65%, #60a5fa 100%)",
              position: "relative",
              overflow: "hidden",
            }}>
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  width: "50%",
                }}
              />
            </div>

            {/* Content layout */}
            <div className="flashcard-content-layout" style={{
              display: "flex",
              flexDirection: hasImage ? "row" : "column",
              flexWrap: "nowrap",
              alignItems: "stretch",
              gap: hasImage ? "clamp(20px, 4vw, 40px)" : 24,
              padding: hasImage ? "clamp(20px, 4vw, 44px) clamp(16px, 5vw, 48px)" : "44px 40px",
            }}>

              {/* Image — LEFT side if imageLeft */}
              {hasImage && imageLeft && (
                <FlashcardImage url={step.imageUrl!} title={step.title} />
              )}

              {/* Text column */}
              <div style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                textAlign: hasImage ? "left" : "center",
                alignItems: hasImage ? "flex-start" : "center",
                minWidth: 0,
              }}>

                {/* Category pill (description field) */}
                {step.description && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 14px",
                      background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                      border: "1.5px solid #BFDBFE",
                      borderRadius: 999,
                    }}
                  >
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 900,
                      color: "#1D4ED8",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontFamily: "'Montserrat', sans-serif",
                    }}>
                      {step.description}
                    </span>
                  </motion.div>
                )}

                {/* Title */}
                {step.title && (
                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    style={{
                      margin: 0,
                      fontSize: "clamp(22px, 4vw, 30px)",
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.18,
                      fontFamily: "'Montserrat', sans-serif",
                      // Gradient title text
                      background: "linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {step.title}
                  </motion.h2>
                )}

                {/* Divider below title */}
                {step.title && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    style={{
                      height: 2,
                      width: "100%",
                      maxWidth: 280,
                      background: "linear-gradient(90deg, #3b82f6, #BFDBFE, transparent)",
                      borderRadius: 999,
                      alignSelf: hasImage ? "flex-start" : "center",
                      transformOrigin: "left",
                    }}
                  />
                )}

                {/* Smart Body Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.22 }}
                  style={{ width: "100%" }}
                >
                  <SmartText
                    text={step.body}
                    fontSize="clamp(16px, 2.2vw, 19px)"
                    align={hasImage ? "left" : "left"}
                  />
                </motion.div>

                {/* "Nota de clase" footer tag */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "5px 12px",
                    background: "#EFF6FF",
                    borderRadius: 8,
                    border: "1.5px solid #BFDBFE",
                    alignSelf: "flex-start",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#2563EB",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "'Montserrat', sans-serif",
                  }}>
                    Nota de clase
                  </span>
                </motion.div>
              </div>

              {/* Image — RIGHT side (default) */}
              {hasImage && !imageLeft && (
                <FlashcardImage url={step.imageUrl!} title={step.title} />
              )}
            </div>

            {/* Subtle bottom gradient vignette */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background: "linear-gradient(to top, rgba(239,246,255,0.25), transparent)",
              pointerEvents: "none",
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FlashcardImage({ url, title }: { url: string; title?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.18, type: "spring", stiffness: 140 }}
      className="flashcard-image-outer"
      style={{
        flex: "0 0 auto",
        position: "relative",
        width: "100%",
        maxWidth: "clamp(240px, 40vw, 380px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Radial glow behind image */}
      <div style={{
        position: "absolute",
        inset: "-20%",
        background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)",
        zIndex: 0,
        pointerEvents: "none",
      }} />
      <img
        src={url}
        className="flashcard-image-img"
        alt={title || "Ilustración"}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "clamp(180px, 30vh, 260px)",
          objectFit: "contain",
          filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.10))",
          position: "relative",
          zIndex: 1,
        }}
      />
      <style>{`
        @media (max-width: 768px) {
          .flashcard-content-layout {
            flex-direction: column !important;
            padding: clamp(24px, 8vw, 32px) clamp(16px, 6vw, 24px) !important;
            gap: clamp(20px, 5vw, 24px) !important;
            align-items: center !important;
          }
          .revealed-flashcard-container {
            border-radius: 24px !important;
          }
          .flashcard-image-outer {
             max-width: clamp(180px, 60vw, 300px) !important;
          }
          .flashcard-image-img {
             max-height: clamp(140px, 25vh, 200px) !important;
          }
        }
        @media (max-width: 480px) {
          .flashcard-content-layout {
            padding: 16px 12px !important;
            gap: 14px !important;
          }
          .flashcard-image-outer {
             max-width: 140px !important;
          }
          .flashcard-image-img {
             max-height: 120px !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
