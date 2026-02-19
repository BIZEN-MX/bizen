"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { OrderStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X } from "../layoutConstants"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"

interface OrderStepProps {
  step: OrderStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  orderedItemIds?: string[]
  isReviewStep?: boolean
  actionTrigger?: number
}

const ORDER_ITEM_BLUE = "#2563eb"

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
  isReviewStep = false,
  actionTrigger = 0,
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
  const [hasInteracted, setHasInteracted] = useState(false)
  const hasPlayedSound = useRef(false)
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered

  useEffect(() => {
    onAnsweredRef.current({ isCompleted: false, canAction: hasInteracted })
  }, [hasInteracted])

  const isCorrectOrder = () =>
    orderedItemIds.every((id, index) => {
      const item = step.items.find((it) => it.id === id)
      return item && item.correctOrder === index + 1
    })

  // Handle evaluation (formerly handleComprobar) triggered by footer
  const evaluate = () => {
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
      // Notify engine so user can continue but marked as incorrect
      onAnsweredRef.current({
        isCompleted: true,
        isCorrect: false,
        answerData: { orderedItemIds: [...orderedItemIds] },
      })
    }
  }

  // Effect to handle external action trigger from footer
  useEffect(() => {
    if (actionTrigger > 0 && !hasEvaluated) {
      evaluate()
    }
  }, [actionTrigger])

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setShowFeedback(false)
    const newOrder = [...orderedItemIds]
    const [removed] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, removed)
    setOrderedItemIds(newOrder)
    setHasInteracted(true)
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

  const content = (
    <>
      <div style={{ textAlign: "center", marginBottom: "clamp(12px, 2vh, 20px)" }}>
        <ExerciseInstruction type="order" />
      </div>
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

      {(() => {
        const imageAlign = (step as { imageAlign?: "left" | "right" }).imageAlign ?? "left"
        const imageCell = step.imageUrl ? (
          <div key="img" style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0, maxWidth: "min(45%, 320px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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

  if (step.fullScreen) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 0,
        flex: 1,
        padding: "0 1.5rem",
        background: "#f1f5f9",
        boxSizing: "border-box",
      }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: CONTENT_MAX_WIDTH, padding: `0 ${CONTENT_PADDING_X}` }}>
          {content}
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
