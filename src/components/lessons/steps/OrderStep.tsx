"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import { OrderStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { Hand, MoveVertical, CheckCircle2, XCircle, ListOrdered, AlignJustify, Star, Zap, Target, Sparkles, Heart } from "lucide-react"

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
    if (!hasChecked) {
      onAnswered({ isCompleted: false, canAction: true })
    }
  }, [onAnswered, hasChecked])

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

  const ITEM_ICONS = [Star, Zap, Target, Sparkles, Heart, Star]

  return (
    <div style={{
      width: "100%",
      maxWidth: 600,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ExerciseInstruction type="order" />
        <h3 style={{
          fontSize: "clamp(20px, 3.5vw, 28px)",
          fontWeight: 500,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
                  }}>
          {step.question || "Pon los elementos en el orden correcto"}
        </h3>
      </div>

      {/* Status hint - Explanatory UI */}
      <AnimatePresence mode="wait">
        {!hasChecked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: "#EFF6FF",
              border: `1.5px solid #93C5FD`,
              borderRadius: 12,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
                            fontSize: 13,
              fontWeight: 500,
              color: "#1D4ED8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#3B82F620" }}>
              {hasInteracted ? <MoveVertical size={16} color="#3B82F6" /> : <Hand size={16} color="#3B82F6" />}
            </div>
            {hasInteracted ? "¡Eso es! Sigue ordenando hasta terminar" : "Mantén presionado y arrastra para cambiar el orden"}
          </motion.div>
        )}
      </AnimatePresence>

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
                padding: "clamp(12px, 2.8vw, 16px) clamp(14px, 3.5vw, 20px)",
                display: "flex",
                alignItems: "center",
                gap: "clamp(12px, 2vw, 16px)",
                cursor: hasChecked ? "default" : "grab",
                position: "relative",
              }}
            >
              <div style={{
                width: "clamp(30px, 8vw, 36px)",
                height: "clamp(30px, 8vw, 36px)",
                borderRadius: 10,
                background: showFeedback ? (item.correctOrder === index + 1 ? "#3B82F620" : "#EF444420") : "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: `1.5px solid ${borderColor}`,
                position: "relative",
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: color, position: "absolute", top: -8, left: -8, background: "white", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${borderColor}`, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                  {index + 1}
                </span>
                {Math.min(index, ITEM_ICONS.length - 1) >= 0 && React.createElement(ITEM_ICONS[index % ITEM_ICONS.length], {
                  size: 18,
                  color: color,
                  strokeWidth: 2.5
                })}
              </div>
              <span style={{ flex: 1, fontSize: "clamp(15px, 3.5vw, 18px)", fontWeight: 500, color, }}>
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
                <div style={{ flexShrink: 0 }}>
                  {item.correctOrder === index + 1 ? (
                    <CheckCircle2 size={22} color="#10B981" strokeWidth={3} />
                  ) : (
                    <XCircle size={22} color="#EF4444" strokeWidth={3} />
                  )}
                </div>
              )}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
    </div>
  )
}
