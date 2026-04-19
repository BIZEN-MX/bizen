"use client"

import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import { MatchStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion, AnimatePresence } from "framer-motion"
import { Hand, ArrowRight, Star, Zap, Target, Sparkles, Brain, Heart, Shield, Award } from "lucide-react"
import { StepScenarioCard } from "../StepScenarioCard"

interface MatchStepProps {
  step: MatchStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  matches?: Array<{ leftId: string; rightId: string }>
  actionTrigger?: number
}

// Vivid, distinct colors per pair index
const PAIR_COLORS = [
  { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700", shadow: "shadow-[0_3px_0_0_#93C5FD]", line: "#3B82F6", Icon: Star },
  { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-700", shadow: "shadow-[0_3px_0_0_#C4B5FD]", line: "#8B5CF6", Icon: Zap },
  { bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700", shadow: "shadow-[0_3px_0_0_#FED7AA]", line: "#F97316", Icon: Target },
  { bg: "bg-sky-50", border: "border-sky-500", text: "text-sky-700", shadow: "shadow-[0_3px_0_0_#BAE6FD]", line: "#0EA5E9", Icon: Sparkles },
  { bg: "bg-rose-50", border: "border-rose-500", text: "text-rose-700", shadow: "shadow-[0_3px_0_0_#FCA5A5]", line: "#F43F5E", Icon: Heart },
  { bg: "bg-slate-50", border: "border-slate-500", text: "text-slate-700", shadow: "shadow-[0_3px_0_0_#CBD5E1]", line: "#64748B", Icon: Brain },
  { bg: "bg-yellow-50", border: "border-yellow-600", text: "text-yellow-800", shadow: "shadow-[0_3px_0_0_#FEF08A]", line: "#CA8A04", Icon: Shield },
  { bg: "bg-fuchsia-50", border: "border-fuchsia-600", text: "text-fuchsia-800", shadow: "shadow-[0_3px_0_0_#F5D0FE]", line: "#A21CAF", Icon: Award },
]

const DEFAULT_ITEM_HEIGHT = "min-h-[clamp(54px,12vw,64px)] h-auto"
const ITEM_GAP = 12

export function MatchStep({ step, onAnswered, matches: initialMatches = [], actionTrigger = 0 }: MatchStepProps) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Array<{ leftId: string; rightId: string }>>(
    initialMatches.length > 0 ? initialMatches : []
  )
  const [hasChecked, setHasChecked] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // Refs to measure item positions for SVG connector lines
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [connectors, setConnectors] = useState<Array<{
    x1: number; y1: number; x2: number; y2: number
    color: string; pairIndex: number; isCorrect?: boolean
  }>>([])

  // Build SVG connector positions after layout
  const updateConnectors = () => {
    if (!containerRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const newConnectors = matches.map((match) => {
      const leftEl = leftRefs.current[match.leftId]
      const rightEl = rightRefs.current[match.rightId]
      if (!leftEl || !rightEl) return null
      const leftRect = leftEl.getBoundingClientRect()
      const rightRect = rightEl.getBoundingClientRect()
      // Find the original left item index to pick color
      const pairIndex = step.leftItems.findIndex(l => l.id === match.leftId)
      const color = PAIR_COLORS[pairIndex % PAIR_COLORS.length].line

      let isCorrect: boolean | undefined
      if (showFeedback) {
        isCorrect = step.correctPairs.some(p => p.leftId === match.leftId && p.rightId === match.rightId)
      }

      return {
        x1: leftRect.right - container.left,
        y1: leftRect.top + leftRect.height / 2 - container.top,
        x2: rightRect.left - container.left,
        y2: rightRect.top + rightRect.height / 2 - container.top,
        color: showFeedback ? (isCorrect ? "#3B82F6" : "#EF4444") : color,
        pairIndex,
        isCorrect,
      }
    }).filter(Boolean) as typeof connectors
    setConnectors(newConnectors)
  }

  useLayoutEffect(() => {
    updateConnectors()
    window.addEventListener("resize", updateConnectors)
    return () => window.removeEventListener("resize", updateConnectors)
  }, [matches, showFeedback])

  const handleLeftClick = (leftId: string) => {
    if (hasChecked) return
    setSelectedLeftId(selectedLeftId === leftId ? null : leftId)
  }

  const handleRightClick = (rightId: string) => {
    if (!selectedLeftId || hasChecked) return

    // If this right item is already matched to something, remove old match first
    const newMatches = matches
      .filter(m => m.leftId !== selectedLeftId && m.rightId !== rightId)
    newMatches.push({ leftId: selectedLeftId, rightId })

    setMatches(newMatches)
    setSelectedLeftId(null)

    onAnswered({
      isCompleted: false,
      canAction: newMatches.length === step.leftItems.length,
      answerData: { matches: newMatches },
    })
  }

  const handleCheck = () => {
    if (matches.length < step.leftItems.length || hasChecked) return

    const allCorrect = step.leftItems.every((left) => {
      const match = matches.find(m => m.leftId === left.id)
      return match && step.correctPairs.some(p => p.leftId === left.id && p.rightId === match.rightId)
    })

    setHasChecked(true)
    setShowFeedback(true)

    if (allCorrect) playCorrectSound()
    else playIncorrectSound()

    onAnswered({ isCompleted: true, isCorrect: allCorrect, answerData: { matches } })
  }

  useEffect(() => {
    if (actionTrigger > 0 && matches.length === step.leftItems.length && !hasChecked) {
      handleCheck()
    }
  }, [actionTrigger])

  // Determine color for a left item
  const getLeftColor = (leftId: string) => {
    const idx = step.leftItems.findIndex(l => l.id === leftId)
    return PAIR_COLORS[idx % PAIR_COLORS.length]
  }

  // Determine color for a right item (via its match)
  const getRightColor = (rightId: string) => {
    const match = matches.find(m => m.rightId === rightId)
    if (!match) return null
    return getLeftColor(match.leftId)
  }

  const getLeftStyle = (leftId: string): string => {
    const isSelected = selectedLeftId === leftId
    const isMatched = matches.some(m => m.leftId === leftId)
    const colors = getLeftColor(leftId)

    let baseClasses = `flex items-center justify-center text-center font-medium p-[10px_clamp(8px,2vw,16px)] transition-all duration-200 rounded-[16px] text-[clamp(12px,3.2vw,15px)] ${DEFAULT_ITEM_HEIGHT} `

    if (showFeedback && isMatched) {
      const match = matches.find(m => m.leftId === leftId)!
      const isCorrect = step.correctPairs.some(p => p.leftId === leftId && p.rightId === match.rightId)
      return baseClasses + (isCorrect 
        ? "bg-blue-50 border-[2px] border-blue-500 shadow-[0_3px_0_0_#93C5FD] text-blue-700 cursor-default"
        : "bg-red-50 border-[2px] border-red-500 shadow-[0_3px_0_0_#FCA5A5] text-red-600 cursor-default")
    }

    if (isSelected) {
      return baseClasses + `${colors.bg} border-[2.5px] ${colors.border} ${colors.shadow} text-blue-700 cursor-pointer object-scale-down ring-[3px] ring-blue-500/40 ring-offset-1 z-10 scale-[1.02]`
    }

    if (isMatched) {
      return baseClasses + `${colors.bg} border-[2px] ${colors.border} ${colors.shadow} ${colors.text} cursor-pointer`
    }

    return baseClasses + "bg-white border-[2px] border-gray-200 shadow-[0_3px_0_0_#E5E7EB] text-gray-700 cursor-pointer"
  }

  const getRightStyle = (rightId: string): { classes: string, style: any } => {
    const isMatched = matches.some(m => m.rightId === rightId)
    const matchColors = getRightColor(rightId)

    let baseClasses = `flex items-center justify-center text-center font-medium p-[10px_clamp(8px,2vw,16px)] transition-all duration-200 rounded-[16px] text-[clamp(12px,3.2vw,15px)] ${DEFAULT_ITEM_HEIGHT} `

    if (showFeedback && isMatched) {
      const match = matches.find(m => m.rightId === rightId)!
      const isCorrect = step.correctPairs.some(p => p.leftId === match.leftId && p.rightId === rightId)
      return { 
        classes: baseClasses + (isCorrect 
          ? "bg-blue-50 border-[2px] border-blue-500 shadow-[0_3px_0_0_#93C5FD] text-blue-700 cursor-default"
          : "bg-red-50 border-[2px] border-red-500 shadow-[0_3px_0_0_#FCA5A5] text-red-600 cursor-default"), 
        style: {} 
      }
    }

    const canClick = !!selectedLeftId && !hasChecked
    const isHighlighted = canClick && !isMatched

    if (isMatched && matchColors) {
      return { classes: baseClasses + `${matchColors.bg} border-[2px] ${matchColors.border} ${matchColors.shadow} ${matchColors.text} cursor-pointer`, style: {} }
    }

    const unselectedClasses = isHighlighted 
      ? "bg-purple-50 border-[2px] border-purple-500 shadow-[0_3px_0_0_#C4B5FD] text-purple-700 cursor-pointer" 
      : "bg-white border-[2px] border-gray-200 shadow-[0_3px_0_0_#E5E7EB] text-gray-700 " + (canClick ? "cursor-pointer" : "cursor-default")
    
    return { 
      classes: baseClasses + unselectedClasses, 
      style: { opacity: !canClick && !isMatched && !hasChecked ? 0.65 : 1 } 
    }
  }

  // totalHeight is no longer fixed, SVG will use inset: 0 logic

  return (
    <div style={{
      width: "100%",
      maxWidth: 640,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ExerciseInstruction type="match" />
        <h3 style={{
          fontSize: "clamp(20px, 3vw, 26px)",
          fontWeight: 500,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
        }}>
          {step.question || "Une las parejas correspondientes"}
        </h3>

        {step.description && <StepScenarioCard text={step.description} />}
      </div>

      {/* Status hint */}
      <AnimatePresence mode="wait">
        {!hasChecked && (
          <motion.div
            key={selectedLeftId ? "right-hint" : "left-hint"}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "#EFF6FF",
              border: `1.5px solid #93C5FD`,
              borderRadius: 12,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "#1D4ED8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#3B82F620" }}>
              {selectedLeftId ? <ArrowRight size={18} color="#3B82F6" /> : <Hand size={18} color="#3B82F6" />}
            </div>
            {selectedLeftId
              ? `Ahora selecciona el par: "${step.leftItems.find(l => l.id === selectedLeftId)?.label}"`
              : "Toca un elemento de la izquierda para empezar"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main match area with SVG connector overlay */}
      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%" }}
      >
        {/* SVG connector lines */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            minHeight: step.leftItems.length * 64, // Fallback min height to ensure markers show
            pointerEvents: "none",
            zIndex: 5,
            overflow: "visible",
          }}
        >
          {/* No markers (arrows) per user request, only lines */}
          {connectors.map((c, i) => {
            const midX = (c.x1 + c.x2) / 2
            return (
              <motion.path
                key={`${c.pairIndex}-${i}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                d={`M ${c.x1} ${c.y1} C ${midX} ${c.y1}, ${midX} ${c.y2}, ${c.x2} ${c.y2}`}
                stroke={c.color}
                strokeWidth={3}
                strokeDasharray="0"
                fill="none"
                style={{ filter: `drop-shadow(0 0 4px ${c.color}80)` }}
              />
            )
          })}
        </svg>

        {/* Two columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr clamp(24px, 6vw, 48px) 1fr",
          gap: 0,
          width: "100%",
        }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: ITEM_GAP }}>
            {step.leftItems.map((item, idx) => {
              const colors = getLeftColor(item.id)
              const isSelected = selectedLeftId === item.id
              return (
                <motion.button
                  key={item.id}
                  ref={el => { leftRefs.current[item.id] = el }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => handleLeftClick(item.id)}
                  className={getLeftStyle(item.id)}
                  whileHover={!hasChecked ? { scale: 1.02 } : {}}
                  whileTap={!hasChecked ? { scale: 0.98 } : {}}
                >
                  {/* Pair-specific Icon */}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: `${colors.line}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginRight: 12,
                    border: `1px solid ${colors.line}30`,
                  }}>
                    <colors.Icon size={16} color={colors.line} strokeWidth={2.5} />
                  </div>
                  {item.label}
                </motion.button>
              )
            })}
          </div>

          {/* Center spacer (where SVG lines live) */}
          <div />

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: ITEM_GAP }}>
            {step.rightItems.map((item, idx) => {
              const isMatched = matches.some(m => m.rightId === item.id)
              const matchColors = getRightColor(item.id)
              const rightStyle = getRightStyle(item.id)
              return (
                <motion.button
                  key={item.id}
                  ref={el => { rightRefs.current[item.id] = el }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => handleRightClick(item.id)}
                  className={rightStyle.classes}
                  style={rightStyle.style}
                  whileHover={selectedLeftId && !hasChecked ? { scale: 1.02 } : {}}
                  whileTap={selectedLeftId && !hasChecked ? { scale: 0.98 } : {}}
                >
                  {item.label}
                  {/* Pair-specific Icon on right side */}
                  {isMatched && matchColors && (
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: showFeedback
                        ? (step.correctPairs.some(p => p.rightId === item.id && matches.find(m => m.rightId === item.id)?.leftId === p.leftId) ? "#3B82F620" : "#EF444420")
                        : `${matchColors.line}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginLeft: 10,
                    }}>
                      <matchColors.Icon
                        size={14}
                        color={showFeedback
                          ? (step.correctPairs.some(p => p.rightId === item.id && matches.find(m => m.rightId === item.id)?.leftId === p.leftId) ? "#2563EB" : "#DC2626")
                          : matchColors.line
                        }
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
