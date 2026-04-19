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

/**
 * Individual Swipe Card component moved OUTSIDE to prevent React error #300
 */
function SwipeCard({
  item,
  leftLabel,
  rightLabel,
  leftColor,
  rightColor,
  onSwipe
}: {
  item: SwipeSorterItem
  leftLabel: string
  rightLabel: string
  leftColor: string
  rightColor: string
  onSwipe: (bucket: "left" | "right") => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const cardScale = useTransform(x, [-200, 0, 200], [0.97, 1, 0.97])

  const handlePanEnd = (_: any, info: PanInfo) => {
    const isFlick = Math.abs(info.velocity.x) > 500
    const isDrag = Math.abs(info.offset.x) > SWIPE_THRESHOLD

    if (isFlick || isDrag) {
      if (info.offset.x < 0) onSwipe("left")
      else onSwipe("right")
    }
  }

  return (
    <motion.div
      key={item.id}
      style={{
        x, rotate, scale: cardScale,
        cursor: "grab", zIndex: 1, width: "100%", touchAction: "none",
        position: "relative"
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
        display: "flex", alignItems: "center", justifyContent: "flex-start",
        padding: "0 24px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: leftColor, color: "white", padding: "8px 16px", borderRadius: 999,
          fontSize: 14, fontWeight: 800,
        }}>
          <ArrowLeft size={16} strokeWidth={3} /> {leftLabel}
        </div>
      </motion.div>

      {/* Right swipe tint */}
      <motion.div style={{
        position: "absolute", inset: 0, borderRadius: 24,
        background: `${rightColor}20`,
        opacity: useTransform(x, [0, 80], [0, 1]),
        pointerEvents: "none", zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        padding: "0 24px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: rightColor, color: "white", padding: "8px 16px", borderRadius: 999,
          fontSize: 14, fontWeight: 800,
        }}>
          {rightLabel} <ArrowRight size={16} strokeWidth={3} />
        </div>
      </motion.div>

      {/* Card Face */}
      <div className="bg-white rounded-[24px] border-2 border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] p-[24px_28px] flex flex-col gap-2">
        <p className="text-[clamp(18px,3.5vw,22px)] font-bold text-gray-900 m-0 leading-[1.2]">
          {item.label}
        </p>
        {item.sublabel && (
          <p className="text-sm text-gray-500 m-0 font-medium">
            {item.sublabel}
          </p>
        )}
        {item.amount && (
          <p className="text-[26px] font-[800] text-[#0F62FE] m-0 tracking-[-0.02em]">
            {item.amount}
          </p>
        )}
      </div>
    </motion.div>
  )
}


export function SwipeSorterStep({ step, onAnswered }: SwipeSorterStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<Array<{ id: string; bucket: "left" | "right"; correct: boolean }>>([])
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(null)
  const [isDone, setIsDone] = useState(false)

  const currentItem: SwipeSorterItem | undefined = step.items[currentIndex]
  const totalItems = step.items.length

  const commitSwipe = (bucket: "left" | "right") => {
    if (!currentItem || isDone) return
    const isCorrect = currentItem.correctBucket === bucket

    if (isCorrect) { haptic.success(); playCorrectSound() }
    else { haptic.error(); playIncorrectSound() }

    setLastResult(isCorrect ? "correct" : "incorrect")

    const newResults = [...results, { id: currentItem.id, bucket, correct: isCorrect }]
    setResults(newResults)

    setTimeout(() => {
      setLastResult(null)
      const nextIndex = currentIndex + 1
      if (nextIndex >= totalItems) {
        setIsDone(true)
        onAnswered({
          isCompleted: true,
          isCorrect: newResults.every(r => r.correct),
          answerData: { results: newResults, score: `${newResults.filter(r => r.correct).length}/${totalItems}` }
        })
      } else {
        setCurrentIndex(nextIndex)
      }
    }, 450)
  }

  const leftColor = step.leftBucket?.color || "#2563eb"
  const rightColor = step.rightBucket?.color || "#f59e0b"

  if (isDone) {
    const correctCount = results.filter(r => r.correct).length
    const pct = Math.round((correctCount / totalItems) * 100)

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 500, margin: "0 auto", width: "100%" }}
      >
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 20px", borderRadius: 24,
          background: pct >= 80 ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" : "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)",
          border: `2px solid ${pct >= 80 ? "#93c5fd" : "#fde68a"}`,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: pct >= 80 ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "linear-gradient(135deg, #f59e0b, #fbbf24)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: pct >= 80 ? "0 12px 32px rgba(37,99,235,0.35)" : "0 12px 32px rgba(245,158,11,0.35)",
          }}>
            <CheckCircle2 size={32} color="white" strokeWidth={3} />
          </div>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>{correctCount}/{totalItems} correctos</p>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0, textAlign: "center" }}>
            {pct >= 80 ? "¡Excelente clasificación! Tienes muy claro qué es necesidad y qué es deseo." : "Buen intento. Cada elección revela tu mentalidad financiera."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((r, i) => {
            const item = step.items.find(it => it.id === r.id)
            if (!item) return null
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 16,
                  background: r.correct ? "#eff6ff" : "#fef2f2", border: `2px solid ${r.correct ? "#93c5fd" : "#fca5a5"}`,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: r.correct ? "#dbeafe" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {r.correct ? <CheckCircle2 size={20} color="#2563eb" strokeWidth={2.5} /> : <XCircle size={20} color="#ef4444" strokeWidth={2.5} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.label}</p>
                  {!r.correct && (
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#ef4444", fontWeight: 500 }}>
                      Era: <strong>{item.correctBucket === "left" ? step.leftBucket?.label || "A" : step.rightBucket?.label || "B"}</strong>
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 480, margin: "0 auto", width: "100%", userSelect: "none" }}>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {step.question && <h2 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 800, color: "#111827", margin: 0, textAlign: "center" }}>{step.question}</h2>}
        {step.description && <StepScenarioCard text={step.description} variant="context" />}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>ITEM {currentIndex + 1} DE {totalItems}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>{results.filter(r => r.correct).length} CORRECTAS</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "#f1f5f9", overflow: "hidden" }}>
          <motion.div animate={{ width: `${(currentIndex / totalItems) * 100}%` }} style={{ height: "100%", background: "#0F62FE" }} />
        </div>
      </div>

      <div style={{ position: "relative", height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: "95%", height: 200, borderRadius: 28, background: "#f8fafc", border: "2px solid #f1f5f9", top: 12, zIndex: 0 }} />
        
        <AnimatePresence mode="wait">
          {currentItem && (
            <SwipeCard
              key={currentItem.id}
              item={currentItem}
              leftLabel={step.leftBucket?.label || "A"}
              rightLabel={step.rightBucket?.label || "B"}
              leftColor={leftColor}
              rightColor={rightColor}
              onSwipe={commitSwipe}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lastResult && (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ position: "absolute", top: "50%", marginTop: -30, zIndex: 50, pointerEvents: "none" }}
            >
                <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: lastResult === "correct" ? "#22c55e" : "#ef4444",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)", border: "3px solid white"
                }}>
                    {lastResult === "correct" ? <CheckCircle2 size={32} color="white" strokeWidth={3} /> : <XCircle size={32} color="white" strokeWidth={3} />}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-[14px]">
        <button
          onClick={() => commitSwipe("left")}
          className="flex-1 p-[18px] rounded-[20px] border-2 bg-white font-[800] text-[15px] cursor-pointer flex items-center justify-center gap-[10px] active:scale-[0.98] transition-transform duration-150"
          style={{ borderColor: leftColor, color: leftColor, boxShadow: `0 6px 0 ${leftColor}20` }}
        >
          <ArrowLeft size={18} strokeWidth={3} /> {step.leftBucket?.label || "Izquierda"}
        </button>
        <button
          onClick={() => commitSwipe("right")}
          className="flex-1 p-[18px] rounded-[20px] border-2 bg-white font-[800] text-[15px] cursor-pointer flex items-center justify-center gap-[10px] active:scale-[0.98] transition-transform duration-150"
          style={{ borderColor: rightColor, color: rightColor, boxShadow: `0 6px 0 ${rightColor}20` }}
        >
          {step.rightBucket?.label || "Derecha"} <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
