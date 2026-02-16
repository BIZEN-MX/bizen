"use client"

import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { OrderStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X } from "../layoutConstants"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
// LessonProgressHeader now shown in LessonScreen for all slides

interface OrderStepProps {
  step: OrderStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  orderedItemIds?: string[]
  onExit?: () => void
  onContinue?: () => void
  isContinueEnabled?: boolean
  currentStepIndex?: number
  totalSteps?: number
  streak?: number
  stars?: 0 | 1 | 2 | 3
  /** When true (review step), do not advance on wrong answer */
  isReviewStep?: boolean
}

const ORDER_ITEM_BLUE = "#2563eb"

/** Fisher–Yates shuffle. Used so "Order by Priority" / "Timeline" steps never show correct order initially. */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function OrderStep({
  step,
  onAnswered,
  orderedItemIds: initialOrder,
  onExit,
  onContinue,
  isContinueEnabled,
  currentStepIndex = 0,
  totalSteps = 1,
  streak = 0,
  stars = 3,
  isReviewStep = false,
}: OrderStepProps) {
  const [orderedItemIds, setOrderedItemIds] = useState<string[]>(() => {
    const itemIds = step.items.map((item) => item.id)
    if (initialOrder?.length === itemIds.length) return initialOrder
    const correctOrderIds = [...step.items]
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map((it) => it.id)
    let order = shuffleArray(itemIds)
    const sameAsCorrect = order.every((id, i) => id === correctOrderIds[i])
    if (sameAsCorrect && order.length >= 2) {
      order = [...order]
      ;[order[0], order[1]] = [order[1], order[0]]
    }
    return order
  })
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const hasPlayedSound = useRef(false)
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered

  const isCorrectOrder = () =>
    orderedItemIds.every((id, index) => {
      const item = step.items.find((it) => it.id === id)
      return item && item.correctOrder === index + 1
    })

  /** Returns a fresh shuffled order (never the correct order). */
  const getShuffledOrder = (): string[] => {
    const itemIds = step.items.map((item) => item.id)
    const correctOrderIds = [...step.items]
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map((it) => it.id)
    let order = shuffleArray(itemIds)
    const sameAsCorrect = order.every((id, i) => id === correctOrderIds[i])
    if (sameAsCorrect && order.length >= 2) {
      order = [...order]
      ;[order[0], order[1]] = [order[1], order[0]]
    }
    return order
  }

  /** Comprobar: show feedback; if correct, lock and call onAnswered. If wrong, user can try again. */
  const handleComprobar = () => {
    if (hasEvaluated) return
    const correct = isCorrectOrder()
    setShowFeedback(true)
    if (correct) {
      setHasEvaluated(true)
      if (!hasPlayedSound.current) {
        playCorrectSound()
        hasPlayedSound.current = true
      }
      onAnsweredRef.current({
        isCompleted: true,
        isCorrect: true,
        answerData: { orderedItemIds: [...orderedItemIds] },
      })
    } else {
      if (!hasPlayedSound.current) {
        playIncorrectSound()
        hasPlayedSound.current = true
      }
    }
  }

  /** Intentar de nuevo: reset order to a fresh shuffle and clear feedback. */
  const handleIntentarDeNuevo = () => {
    setOrderedItemIds(getShuffledOrder())
    setShowFeedback(false)
    setDraggedIndex(null)
  }

  /** Evaluate only when user submits (clicks Continuar). Do not auto-evaluate on reorder. Returns isCorrect. */
  const evaluateAndSubmit = (): boolean => {
    if (hasEvaluated) return isCorrectOrder()
    const isCorrect = isCorrectOrder()
    setHasEvaluated(true)
    if (!hasPlayedSound.current) {
      if (isCorrect) playCorrectSound()
      else playIncorrectSound()
      hasPlayedSound.current = true
    }
    onAnsweredRef.current({
      isCompleted: true,
      isCorrect,
      answerData: { orderedItemIds: [...orderedItemIds] },
    })
    return isCorrect
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setShowFeedback(false)
    const newOrder = [...orderedItemIds]
    const [removed] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, removed)
    setOrderedItemIds(newOrder)
  }

  const moveUp = (index: number) => {
    if (index > 0 && !hasEvaluated) moveItem(index, index - 1)
  }

  const moveDown = (index: number) => {
    if (index < orderedItemIds.length - 1 && !hasEvaluated) moveItem(index, index + 1)
  }

  const handleDragStart = (index: number) => {
    if (hasEvaluated) return
    setShowFeedback(false)
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (hasEvaluated || draggedIndex === null) return
    if (draggedIndex !== index) moveItem(draggedIndex, index)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const useFullScreenLayout = onExit != null || onContinue != null

  const buttonsRow = useFullScreenLayout ? (
    <div style={{
      width: "100%",
      maxWidth: CONTENT_MAX_WIDTH,
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "2rem",
    }}>
      <button
        onClick={onExit}
        style={{
          padding: "16px 48px",
          fontSize: "clamp(18px, 3.5vw, 24px)",
          fontWeight: 500,
          color: "#2563eb",
          background: "#f1f5f9",
          border: "3px solid #1e293b",
          borderRadius: "9999px",
          cursor: "pointer",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          minWidth: "140px",
        }}
      >
        Salir
      </button>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {/* Comprobar: show only when not evaluated and no wrong feedback (hidden after wrong answer until user resets) */}
        {!hasEvaluated && !showFeedback && (
          <button
            type="button"
            onClick={handleComprobar}
            style={{
              padding: "16px 32px",
              fontSize: "clamp(16px, 2.5vw, 20px)",
              fontWeight: 600,
              color: "#1e293b",
              background: "#ffffff",
              border: "3px solid #1e293b",
              borderRadius: "9999px",
              cursor: "pointer",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
          >
            Comprobar
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (!hasEvaluated) {
              const correct = evaluateAndSubmit()
              if (isReviewStep && !correct) return
            }
            onContinue?.()
          }}
          disabled={!isContinueEnabled}
          style={{
            padding: "16px 48px",
            fontSize: "clamp(18px, 3.5vw, 24px)",
            fontWeight: 600,
            color: "#ffffff",
            background: isContinueEnabled ? "#2563eb" : "#94a3b8",
            border: "none",
            borderRadius: "9999px",
            cursor: isContinueEnabled ? "pointer" : "not-allowed",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            minWidth: "180px",
          }}
        >
          {(step as { continueLabel?: string }).continueLabel ?? "Continuar"}
        </button>
      </div>
    </div>
  ) : null

  const content = (
    <>
      <div style={{ textAlign: "center", marginBottom: "clamp(12px, 2vh, 20px)" }}>
        <ExerciseInstruction type="order" />
      </div>
      {/* Title box - same style as match step */}
      {step.question && (
        <div style={{ textAlign: "center", marginBottom: "clamp(24px, 4vh, 48px)" }}>
          <h2 style={{
            fontSize: "clamp(18px, 2.5vw, 32px)",
            fontWeight: 600,
            color: "#1e293b",
            margin: 0,
            padding: "clamp(10px, 1.5vh, 16px) clamp(20px, 3vw, 32px)",
            border: "3px solid #1e293b",
            borderRadius: "16px",
            display: "inline-block",
            letterSpacing: "0.5px",
          }}>
            {step.question}
          </h2>
        </div>
      )}

      {/* Layout: image LEFT or RIGHT of items per imageAlign */}
      {(() => {
        const imageAlign = (step as { imageAlign?: "left" | "right" }).imageAlign ?? "left"
        const imageCell = step.imageUrl ? (
          <div key="img" style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0, maxWidth: "min(45%, 320px)" }}>
            <img
              src={step.imageUrl}
              alt={step.question || "Order illustration"}
              style={{
                maxWidth: "100%",
                width: "auto",
                height: "auto",
                maxHeight: "clamp(120px, 20vh, 220px)",
                objectFit: "contain",
              }}
            />
          </div>
        ) : null
        const itemsCell = (
        <div key="items" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vh, 20px)", minWidth: 0, overflowY: "auto" }}>
          {!hasEvaluated && (
            <p style={{
              fontSize: "clamp(13px, 1.8vw, 16px)",
              color: "#64748b",
              margin: "0 0 4px 0",
              fontStyle: "italic",
            }}>
              Arrastra las tarjetas o usa las flechas para cambiar el orden.
            </p>
          )}
          {orderedItemIds.map((itemId, index) => {
            const item = step.items.find((it) => it.id === itemId)
            if (!item) return null
            const showCorrectness = hasEvaluated || showFeedback
            const isCorrect = showCorrectness && item.correctOrder === index + 1

            return (
              <motion.div
                key={itemId}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                draggable={!hasEvaluated}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  padding: "clamp(16px, 2.5vh, 24px)",
                  fontSize: "clamp(16px, 2vw, 22px)",
                  fontWeight: 700,
                  color: "#1e293b",
                  background: draggedIndex === index ? "#e0e7ff" : "#ffffff",
                  border: `3px solid ${showCorrectness ? (isCorrect ? "#10b981" : "#ef4444") : ORDER_ITEM_BLUE}`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  cursor: hasEvaluated ? "default" : "grab",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  {!hasEvaluated && (
                    <span style={{ color: "#94a3b8", fontSize: "18px", userSelect: "none" }} aria-hidden>⋮⋮</span>
                  )}
                  <span style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, minWidth: "32px", textAlign: "center" }}>
                    {index + 1}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {(hasEvaluated || showFeedback) && (
                    <span style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                  )}
                </div>
                {!hasEvaluated && (
                  <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        background: "#e2e8f0",
                        border: "none",
                        cursor: index === 0 ? "not-allowed" : "pointer",
                        opacity: index === 0 ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-label="Move up"
                    >
                      <svg
                        style={{ width: "20px", height: "20px" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === orderedItemIds.length - 1}
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        background: "#e2e8f0",
                        border: "none",
                        cursor: index === orderedItemIds.length - 1 ? "not-allowed" : "pointer",
                        opacity: index === orderedItemIds.length - 1 ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-label="Move down"
                    >
                      <svg
                        style={{ width: "20px", height: "20px" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
          {showFeedback && !hasEvaluated && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                type="button"
                onClick={handleIntentarDeNuevo}
                style={{
                  padding: "14px 28px",
                  fontSize: "clamp(15px, 2.2vw, 18px)",
                  fontWeight: 600,
                  color: "#1e293b",
                  background: "#ffffff",
                  border: "3px solid #1e293b",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                }}
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>
        )
        return (
          <div style={{
            display: "grid",
            gridTemplateColumns: step.imageUrl ? "minmax(0, 1fr) minmax(0, 1fr)" : "1fr",
            gap: "clamp(16px, 3vw, 32px)",
            alignItems: "stretch",
            flex: 1,
            minHeight: 0,
            width: "100%",
          }}>
            {step.imageUrl
              ? (imageAlign === "right" ? <>{itemsCell}{imageCell}</> : <>{imageCell}{itemsCell}</>)
              : itemsCell}
          </div>
        )
      })()}
    </>
  )

  if (useFullScreenLayout) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        minHeight: 0,
        flex: 1,
        padding: "clamp(12px, 2vh, 2rem) 1.5rem",
        background: "#f1f5f9",
        boxSizing: "border-box",
      }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: CONTENT_MAX_WIDTH, padding: `0 ${CONTENT_PADDING_X}` }}>
          {content}
        </div>
        <div style={{ flexShrink: 0, width: "100%", paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
          {buttonsRow}
        </div>
      </div>
    )
  }

  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      {content}
    </div>
  )
}

