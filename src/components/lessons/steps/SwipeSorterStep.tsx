"use client"

import React, { useState } from "react"
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { haptic } from "@/utils/hapticFeedback"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { SwipeSorterStepFields, SwipeSorterItem } from "@/types/lessonTypes"
import { StepScenarioCard } from "../StepScenarioCard"

interface SwipeSorterStepProps {
  step: { id: string; description?: string; scenario?: string } & SwipeSorterStepFields
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger: number
  isContinueEnabled: boolean
}

const SWIPE_THRESHOLD = 80

export function SwipeSorterStep({ step, onAnswered }: SwipeSorterStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<Array<{ id: string; bucket: "left" | "right"; correct: boolean }>>([])
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(null)
  const [isDone, setIsDone] = useState(false)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const leftOpacity = useTransform(x, [-120, -20], [1, 0])
  const rightOpacity = useTransform(x, [20, 120], [0, 1])
  const cardScale = useTransform(x, [-200, 0, 200], [0.97, 1, 0.97])

  // Reset x to 0 when index changes to avoid the next card starting off-center
  React.useEffect(() => {
    x.set(0)
  }, [currentIndex, x])

  const currentItem: SwipeSorterItem | undefined = step.items[currentIndex]
  const totalItems = step.items.length

  const handlePanEnd = (_: any, info: PanInfo) => {
    const isFlick = Math.abs(info.velocity.x) > 500
    const isDrag = Math.abs(info.offset.x) > SWIPE_THRESHOLD

    if (isFlick || isDrag) {
      if (info.offset.x < 0) commitSwipe("left")
      else commitSwipe("right")
    }
  }

  const commitSwipe = (bucket: "left" | "right") => {
    if (!currentItem || isDone) return
    const isCorrect = currentItem.correctBucket === bucket

    if (isCorrect) { haptic.success(); playCorrectSound() }
    else { haptic.error(); playIncorrectSound() }

    setLastResult(isCorrect ? "correct" : "incorrect")

    const newResults = [...results, { id: currentItem.id, bucket, correct: isCorrect }]
    setResults(newResults)
    setSwipeDirection(bucket)

    setTimeout(() => {
      setSwipeDirection(null)
      setLastResult(null)
      x.set(0)
      const nextIndex = currentIndex + 1
      if (nextIndex >= totalItems) {
        setIsDone(true)
        const allCorrect = newResults.every(r => r.correct)
        const correctCount = newResults.filter(r => r.correct).length
        onAnswered({
          isCompleted: true,
          isCorrect: allCorrect,
          answerData: { results: newResults, score: `${correctCount}/${totalItems}` }
        })
      } else {
        setCurrentIndex(nextIndex)
      }
    }, 600)
  }

  const leftColor = step.leftBucket.color || "#2563eb"
  const rightColor = step.rightBucket.color || "#f59e0b"

  // ── DONE SCREEN ──────────────────────────────────────────────────────────────
  if (isDone) {
    const correctCount = results.filter(r => r.correct).length
    const pct = Math.round((correctCount / totalItems) * 100)

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 500, margin: "0 auto", width: "100%" }}
      >
        {/* Score badge */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "24px 20px",
          borderRadius: 24,
          background: pct >= 80
            ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
            : "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)",
          border: `2px solid ${pct >= 80 ? "#93c5fd" : "#fde68a"}`,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: pct >= 80
              ? "linear-gradient(135deg, #2563eb, #3b82f6)"
              : "linear-gradient(135deg, #f59e0b, #fbbf24)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: pct >= 80 ? "0 12px 32px rgba(37,99,235,0.35)" : "0 12px 32px rgba(245,158,11,0.35)",
          }}>
            <CheckCircle2 size={32} color="white" strokeWidth={3} />
          </div>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>
            {correctCount}/{totalItems} correctos
          </p>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0, textAlign: "center" }}>
            {pct >= 80 ? "¡Excelente clasificación! Tienes muy claro qué es necesidad y qué es deseo." : "Buen intento. Cada elección revela tu mentalidad financiera."}
          </p>
        </div>

        {/* Result cards list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((r, i) => {
            const item = step.items.find(it => it.id === r.id)
            if (!item) return null
            const bucketLabel = r.bucket === "left" ? step.leftBucket?.label || "A" : step.rightBucket?.label || "B"
            const correctBucketLabel = item.correctBucket === "left" ? step.leftBucket?.label || "A" : step.rightBucket?.label || "B"

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 16,
                  background: r.correct ? "#eff6ff" : "#fef2f2",
                  border: `2px solid ${r.correct ? "#93c5fd" : "#fca5a5"}`,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: r.correct ? "#dbeafe" : "#fee2e2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {r.correct
                    ? <CheckCircle2 size={20} color="#2563eb" strokeWidth={2.5} />
                    : <XCircle size={20} color="#ef4444" strokeWidth={2.5} />
                  }
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.label}</p>
                  {!r.correct && (
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#ef4444", fontWeight: 500 }}>
                      Era: <strong>{correctBucketLabel}</strong> · Pusiste: {bucketLabel}
                    </p>
                  )}
                </div>

                {/* Bucket tag */}
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                  background: r.correct ? "#dbeafe" : "#fee2e2",
                  color: r.correct ? "#1d4ed8" : "#dc2626",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {r.correct ? `✓ ${bucketLabel}` : `✗ ${bucketLabel}`}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    )
  }

  // ── SWIPE SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 480, margin: "0 auto", width: "100%", userSelect: "none" }}>

      {/* Question */}
      {step.question && (
        <p style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.3 }}>
          {step.question}
        </p>
      )}

      {/* Instructions */}
      {step.description && (
        <StepScenarioCard text={step.description} variant="context" />
      )}

      {/* Progress bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>
            {currentIndex + 1} de {totalItems}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>
            {results.filter(r => r.correct).length} correctas
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${(currentIndex / totalItems) * 100}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #2563eb, #3b82f6)" }}
          />
        </div>
      </div>

      {/* Bucket labels — always visible */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 999,
          background: `${leftColor}15`, border: `2px solid ${leftColor}30`,
        }}>
          <ArrowLeft size={14} color={leftColor} strokeWidth={3} />
          <span style={{ fontSize: 13, fontWeight: 700, color: leftColor }}>{step.leftBucket.label}</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 999,
          background: `${rightColor}15`, border: `2px solid ${rightColor}30`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: rightColor }}>{step.rightBucket.label}</span>
          <ArrowRight size={14} color={rightColor} strokeWidth={3} />
        </div>
      </div>

      {/* Card Stack */}
      <div style={{ position: "relative", height: 210, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Simple shadow behind to indicate stack without cluttering */}
        <div style={{
          position: "absolute", width: "95%", height: 180,
          borderRadius: 24, background: "#f8fafc",
          border: "2px solid #f1f5f9", top: 10, zIndex: 0,
        }} />

        {/* Feedback badge — anchored to the RIGHT of the stack, never covers the card */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 16 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                position: "absolute",
                right: -56,
                top: "50%",
                marginTop: -28,
                zIndex: 20,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: lastResult === "correct" ? "#2563eb" : "#ef4444",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: lastResult === "correct"
                  ? "0 6px 20px rgba(37,99,235,0.5)"
                  : "0 6px 20px rgba(239,68,68,0.5)",
              }}>
                {lastResult === "correct"
                  ? <CheckCircle2 size={24} color="white" strokeWidth={3} />
                  : <XCircle size={24} color="white" strokeWidth={3} />
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              style={{
                x, rotate, scale: cardScale,
                cursor: "grab", zIndex: 1, width: "100%", touchAction: "none",
              }}
              drag="x"
              dragConstraints={{ left: -300, right: 300 }}
              onDragEnd={handlePanEnd}
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              whileTap={{ cursor: "grabbing" }}
            >
              {/* Left swipe tint */}
              <motion.div style={{
                position: "absolute", inset: 0, borderRadius: 24,
                background: `${leftColor}20`,
                opacity: useTransform(x, [-80, 0], [1, 0]),
                pointerEvents: "none", zIndex: 2,
                display: "flex", alignItems: "flex-start", justifyContent: "flex-start",
                padding: "16px 20px",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: leftColor, color: "white",
                  padding: "6px 14px", borderRadius: 999,
                  fontSize: 13, fontWeight: 800,
                }}>
                  <ArrowLeft size={14} strokeWidth={3} />
                  {step.leftBucket.label}
                </div>
              </motion.div>

              {/* Right swipe tint */}
              <motion.div style={{
                position: "absolute", inset: 0, borderRadius: 24,
                background: `${rightColor}20`,
                opacity: useTransform(x, [0, 80], [0, 1]),
                pointerEvents: "none", zIndex: 2,
                display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
                padding: "16px 20px",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: rightColor, color: "white",
                  padding: "6px 14px", borderRadius: 999,
                  fontSize: 13, fontWeight: 800,
                }}>
                  {step.rightBucket.label}
                  <ArrowRight size={14} strokeWidth={3} />
                </div>
              </motion.div>

              {/* Card face */}
              <div style={{
                background: "#ffffff",
                borderRadius: 24,
                border: "2px solid #e5e7eb",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
                <p style={{ fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.2 }}>
                  {currentItem.label}
                </p>
                {currentItem.sublabel && (
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontWeight: 500 }}>
                    {currentItem.sublabel}
                  </p>
                )}
                {currentItem.amount && (
                  <p style={{
                    fontSize: 22, fontWeight: 800, color: "#0F62FE", margin: 0,
                    letterSpacing: "-0.02em",
                  }}>
                    {currentItem.amount}
                  </p>
                )}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginTop: 4,
                  padding: "8px 0 0",
                  borderTop: "1px solid #f3f4f6",
                }}>
                  <span style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    ← {step.leftBucket.label}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {step.rightBucket.label} →
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fallback tap buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => commitSwipe("left")}
          style={{
            flex: 1, padding: "14px 10px", borderRadius: 16,
            border: `2px solid ${leftColor}`,
            background: `${leftColor}10`,
            color: leftColor, fontWeight: 700, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${leftColor}22`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${leftColor}10`)}
        >
          <ArrowLeft size={16} strokeWidth={3} />
          {step.leftBucket.label}
        </button>
        <button
          onClick={() => commitSwipe("right")}
          style={{
            flex: 1, padding: "14px 10px", borderRadius: 16,
            border: `2px solid ${rightColor}`,
            background: `${rightColor}10`,
            color: rightColor, fontWeight: 700, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${rightColor}22`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${rightColor}10`)}
        >
          {step.rightBucket.label}
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
