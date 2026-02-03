"use client"

import React, { useState, useEffect, useRef } from "react"
import { OrderStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"

interface OrderStepProps {
  step: OrderStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  orderedItemIds?: string[]
}

export function OrderStep({
  step,
  onAnswered,
  orderedItemIds: initialOrder,
}: OrderStepProps) {
  const [orderedItemIds, setOrderedItemIds] = useState<string[]>(
    initialOrder ?? step.items.map((item) => item.id)
  )
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const hasPlayedSound = useRef(false)
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered

  useEffect(() => {
    // Check if items are in correct order
    const isCorrect = orderedItemIds.every((id, index) => {
      const item = step.items.find((it) => it.id === id)
      return item && item.correctOrder === index + 1
    })

    if (!hasEvaluated) {
      setHasEvaluated(true)

      // Play sound only once
      if (!hasPlayedSound.current) {
        if (isCorrect) {
          playCorrectSound()
        } else {
          playIncorrectSound()
        }
        hasPlayedSound.current = true
      }
    }

    // Use ref so parent re-renders (new onAnswered) don't retrigger this effect and cause a loop
    onAnsweredRef.current({
      isCompleted: true,
      isCorrect,
      answerData: { orderedItemIds: [...orderedItemIds] },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hasEvaluated omitted to avoid double run when we set it
  }, [orderedItemIds, step.items])

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...orderedItemIds]
    const [removed] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, removed)
    setOrderedItemIds(newOrder)
  }

  const moveUp = (index: number) => {
    if (index > 0 && !hasEvaluated) {
      moveItem(index, index - 1)
    }
  }

  const moveDown = (index: number) => {
    if (index < orderedItemIds.length - 1 && !hasEvaluated) {
      moveItem(index, index + 1)
    }
  }

  const getItemStyle = (item: typeof step.items[0], currentIndex: number) => {
    if (!hasEvaluated) {
      return ""
    }
    const isCorrect = item.correctOrder === currentIndex + 1
    return isCorrect
      ? "bg-emerald-100 border-emerald-600"
      : "bg-red-100 border-red-600"
  }

  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      {step.question && <h3 className={sharedStyles.question}>{step.question}</h3>}
      <div className={sharedStyles.orderList}>
        {orderedItemIds.map((itemId, index) => {
          const item = step.items.find((it) => it.id === itemId)
          if (!item) return null

          return (
            <div
              key={itemId}
              className={`${sharedStyles.orderItem} ${getItemStyle(item, index)} flex items-center justify-between gap-3 md:gap-4 transition-all duration-300`}
            >
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <span className="text-slate-600 font-bold text-3xl md:text-4xl w-12 md:w-14 text-center">
                  {index + 1}
                </span>
                <span className="text-xl md:text-2xl lg:text-3xl flex-1">{item.label}</span>
                {hasEvaluated && (
                  <span className="text-2xl md:text-3xl ml-2">
                    {item.correctOrder === index + 1 ? "✓" : "✗"}
                  </span>
                )}
              </div>
              {!hasEvaluated && (
                <div className="flex gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move up"
                  >
                    <svg
                      className="w-5 h-5"
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
                    className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move down"
                  >
                    <svg
                      className="w-5 h-5"
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

