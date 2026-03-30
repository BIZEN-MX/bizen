"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight, Mic } from "lucide-react"
import { InfoStepFields } from "@/types/lessonTypes"
import { playFlipSound, initAudioContext } from "../lessonSounds"
import { motion, AnimatePresence } from "framer-motion"
import { SmartText, InlineSegments, parseInlineSegments } from "../SmartText"
import { haptic } from "@/utils/hapticFeedback"

interface InfoStepProps {
  step: InfoStepFields & {
    id: string
    title?: string
    description?: string
    fullScreen?: boolean
    continueLabel?: string
    imageAlign?: "left" | "right"
    aiInsight?: string
  }
  onAnswered: (result: {
    isCompleted: boolean
    isCorrect?: boolean
    answerData?: any
    canAction?: boolean
  }) => void
  onPlayAudio?: () => void
  actionTrigger?: number
  isContinueEnabled?: boolean
}

export function InfoStep({
  step,
  onAnswered,
  onPlayAudio,
  actionTrigger = 0,
  isContinueEnabled = false,
}: InfoStepProps) {
  useEffect(() => {
    // Always complete immediately as requested to remove friction
    onAnswered({ isCompleted: true })
  }, [onAnswered])

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
          borderRadius: "clamp(16px, 5vw, 32px)",
          border: "2px solid rgba(15, 98, 254, 0.22)",
          boxShadow: [
            "0 0 0 4px rgba(15, 98, 254, 0.06)",
            "0 2px 6px rgba(15,98,254,0.08)",
            "0 10px 28px rgba(15,98,254,0.12)",
            "0 32px 64px rgba(15,98,254,0.10)",
          ].join(", "),
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{
          height: 6,
          background: "linear-gradient(90deg, #1e40af 0%, #2563eb 35%, #3b82f6 65%, #60a5fa 100%)",
          position: "relative",
          overflow: "hidden",
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
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

        <div className="flashcard-content-layout" style={{
          display: "flex",
          flexDirection: hasImage ? "row" : "column",
          flexWrap: "nowrap",
          alignItems: "stretch",
          gap: hasImage ? "clamp(20px, 4vw, 40px)" : 24,
          padding: hasImage ? "clamp(20px, 4vw, 44px) clamp(16px, 5vw, 48px)" : "44px 40px",
        }}>

          {hasImage && imageLeft && (
            <FlashcardImage url={step.imageUrl!} title={step.title} />
          )}

          <div style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            textAlign: hasImage ? "left" : "center",
            alignItems: hasImage ? "flex-start" : "center",
            minWidth: 0,
          }}>


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
                  fontWeight: 500,
                  color: "#1D4ED8",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  {step.description}
                </span>
              </motion.div>
            )}

            {step.title && (
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                style={{
                  margin: 0,
                  fontSize: "clamp(20px, 4vw, 30px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.18,
                  background: "linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <InlineSegments segments={parseInlineSegments(step.title)} />
              </motion.h2>
            )}

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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
              style={{ width: "100%" }}
            >
              <SmartText
                text={step.body}
                fontSize="clamp(15px, 2.2vw, 19px)"
                align={hasImage ? "left" : "left"}
              />
            </motion.div>
          </div>

          {hasImage && !imageLeft && (
            <FlashcardImage url={step.imageUrl!} title={step.title} />
          )}
        </div>

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
        @media (max-width: 480px) {
          .flashcard-content-layout {
            padding: 10px 8px !important;
            gap: 8px !important;
          }
          .flashcard-image-outer {
             max-width: 100px !important;
          }
          .flashcard-image-img {
             max-height: 85px !important;
          }
          .revealed-flashcard-container {
            border-radius: 16px !important;
          }
        }
        @media (max-width: 360px) {
          .flashcard-content-layout {
            padding: 10px 8px !important;
            gap: 10px !important;
          }
          .flashcard-image-outer {
             max-width: 100px !important;
          }
          .flashcard-image-img {
             max-height: 85px !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
