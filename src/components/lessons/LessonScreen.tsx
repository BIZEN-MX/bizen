"use client"

import React from "react"
import { LessonProgressHeader } from "./LessonProgressHeader"
import { LessonContainer } from "./LessonContainer"
import { StickyFooter } from "./StickyFooter"

interface LessonScreenProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  streak?: number
  stars?: 0 | 1 | 2 | 3
  showProgressBar?: boolean
  footerContent?: React.ReactNode
  className?: string
}

/**
 * Main lesson screen — Duolingo-style layout:
 * - Pure white background
 * - Slim progress bar header at top
 * - Centered scrollable content in the middle
 * - Sticky footer with action buttons at the bottom
 */
export function LessonScreen({
  children,
  currentStep,
  totalSteps,
  streak = 0,
  stars = 3,
  showProgressBar = true,
  footerContent,
  className = "",
}: LessonScreenProps) {
  const starsClamped = (typeof stars === "number" && stars >= 0 && stars <= 3 ? stars : 3) as 0 | 1 | 2 | 3

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100dvh",
        maxHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
        background: "#FFFFFF",
        paddingTop: "env(safe-area-inset-top)",
        position: "relative",
      }}
    >
      {/* Progress header — slim, clean, Duolingo-style */}
      {showProgressBar && (
        <div
          style={{
            flexShrink: 0,
            paddingTop: 16,
            paddingBottom: 14,
            paddingLeft: "clamp(16px, 4vw, 48px)",
            paddingRight: "clamp(16px, 4vw, 48px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#FFFFFF",
            borderBottom: "1.5px solid #F1F5F9",
            boxSizing: "border-box",
          }}
        >
          <LessonProgressHeader
            currentStepIndex={currentStep - 1}
            totalSteps={totalSteps}
            streak={streak}
            stars={starsClamped}
          />
        </div>
      )}

      {/* Content area — vertically centered, horizontally constrained */}
      <LessonContainer
        className={className}
        bottomPad={0}
        topPad={0}
        noScroll={false}
      >
        <div
          key={currentStep}
          className="lesson-step-transition"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 clamp(16px, 4vw, 48px)",
            boxSizing: "border-box",
          }}
        >
          <div
            className="lesson-slide-content-center"
            style={{
              width: "100%",
              maxWidth: 720,
            }}
          >
            {children}
          </div>
        </div>
      </LessonContainer>

      {/* Footer Area */}
      {footerContent && (
        <div style={{ flexShrink: 0 }}>
          {footerContent}
        </div>
      )}
    </div>
  )
}
