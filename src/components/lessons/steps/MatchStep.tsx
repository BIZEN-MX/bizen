"use client"

import React, { useState, useEffect, useRef } from "react"
import { MatchStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X } from "../layoutConstants"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"

interface MatchStepProps {
  step: MatchStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string; imageUrl?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  matches?: Array<{ leftId: string; rightId: string }>
  actionTrigger?: number
}

const CONCEPT_BORDER_BLUE = "#2563eb"

export function MatchStep({ step, onAnswered, matches: initialMatches = [], actionTrigger = 0 }: MatchStepProps) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Array<{ leftId: string; rightId: string }>>(
    initialMatches.length > 0 ? initialMatches : []
  )
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const hasPlayedSound = useRef(false)
  const onAnsweredRef = useRef(onAnswered)
  onAnsweredRef.current = onAnswered

  useEffect(() => {
    // Disable check button until at least one interaction
    onAnsweredRef.current({ isCompleted: false, canAction: matches.length > 0 })
  }, [matches.length])

  const handleLeftClick = (leftId: string) => {
    if (selectedLeftId === leftId) {
      setSelectedLeftId(null)
    } else {
      setSelectedLeftId(leftId)
    }
  }

  const handleRightClick = (rightId: string) => {
    if (!selectedLeftId || hasEvaluated) return

    setMatches((prev) => prev.filter((m) => m.leftId !== selectedLeftId))
    setMatches((prev) => [...prev, { leftId: selectedLeftId, rightId }])
    setSelectedLeftId(null)
  }

  const isMatchCorrect = (leftId: string, rightId: string) => {
    return step.correctPairs.some(
      (pair) => pair.leftId === leftId && pair.rightId === rightId
    )
  }

  const evaluate = () => {
    if (hasEvaluated) return
    const allCorrect = step.leftItems.every((left) => {
      const match = matches.find((m) => m.leftId === left.id)
      return match && isMatchCorrect(left.id, match.rightId)
    })
    const anyInteraction = matches.length > 0
    if (!anyInteraction) return

    setHasEvaluated(true)
    if (allCorrect) {
      if (!hasPlayedSound.current) {
        playCorrectSound()
        hasPlayedSound.current = true
      }
      onAnswered({ isCompleted: true, isCorrect: true, answerData: { matches } })
    } else {
      if (!hasPlayedSound.current) {
        playIncorrectSound()
        hasPlayedSound.current = true
      }
      onAnswered({ isCompleted: true, isCorrect: false, answerData: { matches } })
    }
  }

  useEffect(() => {
    if (actionTrigger > 0 && !hasEvaluated) {
      evaluate()
    }
  }, [actionTrigger])

  const imageAlign = (step.imageAlign === "left" || step.imageAlign === "right") ? step.imageAlign : "right"
  const imageBlock = step.imageUrl ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, minWidth: "100px", maxWidth: "min(40%, 280px)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={step.imageUrl}
        alt={step.question || "Match illustration"}
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

  const mainContent = (
    <>
      <div style={{ textAlign: "center", marginBottom: "clamp(12px, 2vh, 20px)" }}>
        <ExerciseInstruction type="match" />
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

      <div className="match-layout-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(20px, 4vw, 40px)",
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        {/* Left Items Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vh, 20px)" }}>
          {step.leftItems.map((leftItem) => {
            const isSelected = selectedLeftId === leftItem.id
            const matchedRightId = matches.find((m) => m.leftId === leftItem.id)?.rightId
            return (
              <button
                key={leftItem.id}
                onClick={() => handleLeftClick(leftItem.id)}
                disabled={hasEvaluated}
                style={{
                  padding: "clamp(16px, 2.5vh, 24px)",
                  fontSize: "clamp(16px, 2vw, 22px)",
                  fontWeight: 700,
                  color: "#1e293b",
                  background: "#ffffff",
                  border: isSelected ? "3px solid #3b82f6" : `3px solid ${hasEvaluated && matchedRightId ? (isMatchCorrect(leftItem.id, matchedRightId) ? "#10b981" : "#ef4444") : CONCEPT_BORDER_BLUE}`,
                  borderRadius: "12px",
                  cursor: hasEvaluated ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isSelected ? '0 4px 0 #1e40af' : 'none',
                  position: 'relative'
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span>{leftItem.label}</span>
                  {hasEvaluated && matchedRightId && (
                    <span style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                      {isMatchCorrect(leftItem.id, matchedRightId) ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Items Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vh, 20px)" }}>
          {step.rightItems.map((rightItem) => {
            const isMatched = matches.some((m) => m.rightId === rightItem.id)
            const matchedLeftId = matches.find((m) => m.rightId === rightItem.id)?.leftId
            return (
              <button
                key={rightItem.id}
                onClick={() => handleRightClick(rightItem.id)}
                disabled={!selectedLeftId || isMatched || hasEvaluated}
                style={{
                  padding: "clamp(16px, 2.5vh, 24px)",
                  fontSize: "clamp(16px, 2vw, 22px)",
                  fontWeight: 700,
                  color: "#1e293b",
                  background: "#ffffff",
                  border: `3px solid ${hasEvaluated && isMatched && matchedLeftId ? (isMatchCorrect(matchedLeftId, rightItem.id) ? "#10b981" : "#ef4444") : CONCEPT_BORDER_BLUE}`,
                  borderRadius: "12px",
                  cursor: hasEvaluated ? "default" : (!selectedLeftId || isMatched ? "not-allowed" : "pointer"),
                  opacity: (!selectedLeftId || isMatched) && !hasEvaluated ? 0.5 : 1,
                  transition: "all 0.2s ease",
                  textAlign: "center",
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span>{rightItem.label}</span>
                  {hasEvaluated && isMatched && matchedLeftId && (
                    <span style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                      {isMatchCorrect(matchedLeftId, rightItem.id) ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .match-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </>
  )

  const content = imageBlock ? (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", justifyContent: "center", gap: "clamp(16px, 3vw, 32px)", flexWrap: "nowrap", width: "100%", minWidth: 0, minHeight: 0 }}>
      {imageAlign === "left" ? imageBlock : null}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>{mainContent}</div>
      {imageAlign === "right" ? imageBlock : null}
    </div>
  ) : mainContent

  if (step.fullScreen) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minHeight: 0,
        flex: 1,
        width: "100%",
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
