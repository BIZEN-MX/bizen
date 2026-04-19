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
  hideStars?: boolean
  hideHeaderBorder?: boolean
  footerContent?: React.ReactNode
  onExit?: () => void
  onOpenGlossary?: () => void
  hasGlossary?: boolean
  className?: string
  isDark?: boolean
}

/**
 * Main lesson screen — Duolingo-style layout:
 * - Pure white background (or immersive dark mode)
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
  hideStars = false,
  hideHeaderBorder = false,
  footerContent,
  onExit,
  onOpenGlossary,
  hasGlossary,
  className = "",
  isDark = false,
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
        background: isDark ? "#020617" : "#FFFFFF",
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
            background: "transparent",
            borderBottom: hideHeaderBorder || isDark ? "none" : "1.5px solid #F1F5F9",
            boxSizing: "border-box",
          }}
        >
          <LessonProgressHeader
            currentStepIndex={currentStep - 1}
            totalSteps={totalSteps}
            streak={streak}
            stars={starsClamped}
            hideStars={hideStars}
            onExit={onExit}
            onOpenGlossary={onOpenGlossary}
            hasGlossary={hasGlossary}
            isDark={isDark}
          />
        </div>
      )}

      {/* Content area — vertically centered, horizontally constrained */}
      <LessonContainer
        className={className}
        bottomPad={100}
        topPad={0}
        noScroll={false}
      >
        <div
          key={currentStep}
          className="lesson-step-transition"
          style={{
            flex: 1,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start", // Start from top to prevent cut-off on small screens
            alignItems: "center",
            padding: "min(40px, 5vh) clamp(16px, 4vw, 48px)",
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
