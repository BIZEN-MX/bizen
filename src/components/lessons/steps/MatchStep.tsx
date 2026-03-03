"use client"

import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import { MatchStepFields } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { motion, AnimatePresence } from "framer-motion"
import { Hand, ArrowRight, Star, Zap, Target, Sparkles, Brain, Heart, Shield, Award } from "lucide-react"

interface MatchStepProps {
  step: MatchStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  matches?: Array<{ leftId: string; rightId: string }>
  actionTrigger?: number
}

// Vivid, distinct colors per pair index
const PAIR_COLORS = [
  { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8", shadow: "#93C5FD", line: "#3B82F6", Icon: Star },
  { bg: "#FAF5FF", border: "#8B5CF6", text: "#6D28D9", shadow: "#C4B5FD", line: "#8B5CF6", Icon: Zap },
  { bg: "#FFF7ED", border: "#F97316", text: "#C2410C", shadow: "#FED7AA", line: "#F97316", Icon: Target },
  { bg: "#ECFDF5", border: "#10B981", text: "#065F46", shadow: "#A7F3D0", line: "#10B981", Icon: Sparkles },
  { bg: "#FFF1F2", border: "#F43F5E", text: "#BE123C", shadow: "#FCA5A5", line: "#F43F5E", Icon: Heart },
  { bg: "#F0FDFA", border: "#0D9488", text: "#0F766E", shadow: "#99F6E4", line: "#0D9488", Icon: Brain },
  { bg: "#FEFCE8", border: "#CA8A04", text: "#A16207", shadow: "#FEF08A", line: "#CA8A04", Icon: Shield },
  { bg: "#FDF4FF", border: "#A21CAF", text: "#86198F", shadow: "#F5D0FE", line: "#A21CAF", Icon: Award },
]

const ITEM_HEIGHT = 64 // fixed height for all boxes
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
        color: showFeedback ? (isCorrect ? "#10B981" : "#EF4444") : color,
        pairIndex,
        isCorrect,
      }
    }).filter(Boolean) as typeof connectors
    setConnectors(newConnectors)
  }

  useLayoutEffect(() => { updateConnectors() }, [matches, showFeedback])

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

  const getLeftStyle = (leftId: string): React.CSSProperties => {
    const isSelected = selectedLeftId === leftId
    const isMatched = matches.some(m => m.leftId === leftId)
    const colors = getLeftColor(leftId)

    if (showFeedback && isMatched) {
      const match = matches.find(m => m.leftId === leftId)!
      const isCorrect = step.correctPairs.some(p => p.leftId === leftId && p.rightId === match.rightId)
      return {
        height: ITEM_HEIGHT,
        borderRadius: 16,
        background: isCorrect ? "#ECFDF5" : "#FEF2F2",
        border: `2px solid ${isCorrect ? "#10B981" : "#EF4444"}`,
        boxShadow: `0 3px 0 0 ${isCorrect ? "#A7F3D0" : "#FCA5A5"}`,
        cursor: "default",
        color: isCorrect ? "#065F46" : "#DC2626",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 800,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 16px",
        transition: "all 0.2s ease",
      }
    }

    if (isSelected) {
      return {
        height: ITEM_HEIGHT,
        borderRadius: 16,
        background: colors.bg,
        border: `2.5px solid ${colors.border}`,
        boxShadow: `0 3px 0 0 ${colors.shadow}, 0 0 0 3px ${colors.border}40`,
        cursor: "pointer",
        color: colors.text,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 800,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 16px",
        transform: "scale(1.02)",
        transition: "all 0.15s ease",
      }
    }

    if (isMatched) {
      return {
        height: ITEM_HEIGHT,
        borderRadius: 16,
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: `0 3px 0 0 ${colors.shadow}`,
        cursor: "pointer",
        color: colors.text,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 800,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 16px",
        transition: "all 0.2s ease",
      }
    }

    return {
      height: ITEM_HEIGHT,
      borderRadius: 16,
      background: "#FFFFFF",
      border: "2px solid #E5E7EB",
      boxShadow: "0 3px 0 0 #E5E7EB",
      cursor: "pointer",
      color: "#374151",
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 800,
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "0 16px",
      transition: "all 0.2s ease",
    }
  }

  const getRightStyle = (rightId: string): React.CSSProperties => {
    const isMatched = matches.some(m => m.rightId === rightId)
    const matchColors = getRightColor(rightId)

    if (showFeedback && isMatched) {
      const match = matches.find(m => m.rightId === rightId)!
      const isCorrect = step.correctPairs.some(p => p.leftId === match.leftId && p.rightId === rightId)
      return {
        height: ITEM_HEIGHT,
        borderRadius: 16,
        background: isCorrect ? "#ECFDF5" : "#FEF2F2",
        border: `2px solid ${isCorrect ? "#10B981" : "#EF4444"}`,
        boxShadow: `0 3px 0 0 ${isCorrect ? "#A7F3D0" : "#FCA5A5"}`,
        cursor: "default",
        color: isCorrect ? "#065F46" : "#DC2626",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 800,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 16px",
        transition: "all 0.2s ease",
      }
    }

    const canClick = !!selectedLeftId && !hasChecked
    const isHighlighted = canClick && !isMatched

    if (isMatched && matchColors) {
      return {
        height: ITEM_HEIGHT,
        borderRadius: 16,
        background: matchColors.bg,
        border: `2px solid ${matchColors.border}`,
        boxShadow: `0 3px 0 0 ${matchColors.shadow}`,
        cursor: "pointer",
        color: matchColors.text,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 800,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 16px",
        transition: "all 0.2s ease",
      }
    }

    return {
      height: ITEM_HEIGHT,
      borderRadius: 16,
      background: isHighlighted ? "#F0FDF4" : "#FFFFFF",
      border: `2px solid ${isHighlighted ? "#10B981" : "#E5E7EB"}`,
      boxShadow: `0 3px 0 0 ${isHighlighted ? "#A7F3D0" : "#E5E7EB"}`,
      cursor: canClick ? "pointer" : "default",
      color: isHighlighted ? "#065F46" : "#374151",
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 800,
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "0 16px",
      transition: "all 0.15s ease",
      opacity: !canClick && !isMatched && !hasChecked ? 0.65 : 1,
    }
  }

  const totalHeight = step.leftItems.length * ITEM_HEIGHT + (step.leftItems.length - 1) * ITEM_GAP

  return (
    <div style={{
      width: "100%",
      maxWidth: 720,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ExerciseInstruction type="match" />
        <h3 style={{
          fontSize: "clamp(20px, 3vw, 26px)",
          fontWeight: 800,
          color: "#111827",
          margin: 0,
          lineHeight: 1.3,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          {step.question || "Une las parejas correspondientes"}
        </h3>
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
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              fontWeight: 700,
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
            height: totalHeight,
            pointerEvents: "none",
            zIndex: 5,
            overflow: "visible",
          }}
        >
          <defs>
            {connectors.map((c, i) => (
              <marker
                key={`arrow-${i}`}
                id={`arrow-${i}`}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill={c.color} />
              </marker>
            ))}
          </defs>
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
                markerEnd={`url(#arrow-${i})`}
                style={{ filter: `drop-shadow(0 0 4px ${c.color}80)` }}
              />
            )
          })}
        </svg>

        {/* Two columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 56px 1fr",
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
                  style={getLeftStyle(item.id)}
                  whileHover={!hasChecked ? { scale: 1.02 } : {}}
                  whileTap={!hasChecked ? { scale: 0.98 } : {}}
                >
                  {/* Pair-specific Icon */}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: `${colors.border}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginRight: 12,
                    border: `1px solid ${colors.border}30`,
                  }}>
                    <colors.Icon size={16} color={colors.border} strokeWidth={2.5} />
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
              return (
                <motion.button
                  key={item.id}
                  ref={el => { rightRefs.current[item.id] = el }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => handleRightClick(item.id)}
                  style={getRightStyle(item.id)}
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
                        ? (step.correctPairs.some(p => p.rightId === item.id && matches.find(m => m.rightId === item.id)?.leftId === p.leftId) ? "#10B98120" : "#EF444420")
                        : `${matchColors.border}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginLeft: 10,
                    }}>
                      <matchColors.Icon
                        size={14}
                        color={showFeedback
                          ? (step.correctPairs.some(p => p.rightId === item.id && matches.find(m => m.rightId === item.id)?.leftId === p.leftId) ? "#059669" : "#DC2626")
                          : matchColors.border
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
