"use client"

import React from "react"
import { LessonProgressHeader } from "./LessonProgressHeader"
import { LessonContainer } from "./LessonContainer"
import { StickyFooter } from "./StickyFooter"
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X } from "./layoutConstants"

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
 * Main lesson screen component
 * - Full-height layout with flex column
 * - Background: bg-slate-900 text-white
 * - Progress header (with streak & stars) at top - ALWAYS SHOWN
 * - Scrollable content in middle
 * - Sticky footer at bottom
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
      className="flex flex-col text-slate-900 relative w-full flex-1 min-h-0 lesson-screen-root"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        minHeight: "100dvh",
        maxHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
        background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", // Soft, premium background
      }}
    >
      {/* Progress bar - shown unless parent renders its own (e.g. interactive page) */}
      {showProgressBar && (
        <div
          className="lesson-progress-bar-fixed"
          style={{
            flexShrink: 0,
            minHeight: 100,
            paddingTop: 12,
            paddingBottom: 16,
            paddingLeft: 24,
            paddingRight: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.6)", // Glassmorphism-lite
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(11, 113, 254, 0.1)",
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

      {/* Content - fills space between progress bar and nav buttons; smooth fade on step change */}
      <LessonContainer
        className={className}
        bottomPad={0}
        topPad={0}
        noScroll
      >
        <div
          key={currentStep}
          className="lesson-step-transition"
          style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
        >
          <div className="lesson-slide-content-center" style={{ width: "100%" }}>
            {children}
          </div>
        </div>
      </LessonContainer>

      {/* Nav buttons - in different container than content, at bottom of viewport */}
      {footerContent && (
        <StickyFooter fixed={false}>{footerContent}</StickyFooter>
      )}
    </div>
  )
}

