"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, Reorder } from "framer-motion"
import { OrderStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"

interface OrderStepProps {
  step: OrderStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  orderedItemIds?: string[]
  actionTrigger?: number
}

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
  actionTrigger = 0,
}: OrderStepProps) {
  const [orderedItemIds, setOrderedItemIds] = useState<string[]>(() => {
    const itemIds = step.items.map((item) => item.id)
    if (initialOrder?.length === itemIds.length) return initialOrder

    const correctOrderIds = [...step.items]
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map((it) => it.id)

    let order = shuffleArray(itemIds)
    // Ensure it's not solved initially
    const sameAsCorrect = order.every((id, i) => id === correctOrderIds[i])
    if (sameAsCorrect && order.length >= 2) {
      order = [...order]
        ;[order[0], order[1]] = [order[1], order[0]]
    }
    return order
  })

  const [hasChecked, setHasChecked] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    onAnswered({ isCompleted: false, canAction: true })
  }, [onAnswered])

  const handleCheck = () => {
    if (hasChecked) return

    const allCorrect = orderedItemIds.every((id, index) => {
      const item = step.items.find((it) => it.id === id)
      return item && item.correctOrder === index + 1
    })

    setHasChecked(true)
    setShowFeedback(true)

    if (allCorrect) playCorrectSound()
    else playIncorrectSound()

    onAnswered({
      isCompleted: true,
      isCorrect: allCorrect,
      answerData: { orderedItemIds: [...orderedItemIds] },
    })
  }

  useEffect(() => {
    if (actionTrigger > 0 && !hasChecked) {
      handleCheck()
    }
  }, [actionTrigger])

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ExerciseInstruction type="order" />
        <h3 style={{
          fontSize: "clamp(20px, 3.5vw, 28px)",
          fontWeight: 800,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          {step.question || "Pon los elementos en el orden correcto"}
        </h3>
      </div>

      <Reorder.Group
        axis="y"
        values={orderedItemIds}
        onReorder={(newOrder) => {
          if (hasChecked) return
          setOrderedItemIds(newOrder)
          setHasInteracted(true)
        }}
        style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0 }}
      >
        {orderedItemIds.map((itemId, index) => {
          const item = step.items.find((it) => it.id === itemId)
          if (!item) return null

          let borderColor = "#E5E7EB"
          let background = "#FFFFFF"
          let color = "#374151"
          let boxShadow = "0 3px 0 0 #E5E7EB"

          if (showFeedback) {
            const isCorrect = item.correctOrder === index + 1
            if (isCorrect) {
              borderColor = "#3B82F6"
              background = "#EFF6FF"
              color = "#1D4ED8"
              boxShadow = "0 3px 0 0 #93C5FD"
            } else {
              borderColor = "#EF4444"
              background = "#FEF2F2"
              color = "#DC2626"
              boxShadow = "0 3px 0 0 #FCA5A5"
            }
          }

          return (
            <Reorder.Item
              key={itemId}
              value={itemId}
              dragListener={!hasChecked}
              style={{
                background,
                border: `2px solid ${borderColor}`,
                boxShadow,
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: hasChecked ? "default" : "grab",
                position: "relative",
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 900,
                color: "#6B7280",
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color, fontFamily: "'Montserrat', sans-serif" }}>
                {item.label}
              </span>
              {!hasChecked && (
                <div style={{ color: "#D1D5DB" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 2a2 2 0 1 0-2 2 2 2 0 0 0 2-2zM0 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm4-8a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" transform="translate(4 3)" />
                  </svg>
                </div>
              )}
              {showFeedback && (
                <span style={{ fontSize: 20, fontFamily: "'Montserrat', sans-serif" }}>
                  {item.correctOrder === index + 1 ? "✓" : "✗"}
                </span>
              )}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
    </div>
  )
}
