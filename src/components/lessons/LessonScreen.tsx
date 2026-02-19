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
        minHeight: 0,
        height: "100%",
        overflow: "hidden",
        background: "#f1f5f9",
      }}
    >
      {/* Progress bar - shown unless parent renders its own (e.g. interactive page) */}
      {showProgressBar && (
        <div
          className="lesson-progress-bar-fixed"
          style={{
            flexShrink: 0,
            minHeight: 90,
            paddingTop: 8,
            paddingBottom: 12,
            paddingLeft: 12,
            paddingRight: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f1f5f9",
            borderBottom: "2px solid #cbd5e1",
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
        bottomPad={footerContent ? 110 : 0}
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

      {/* Nav buttons - at bottom of slide (in flow, so no empty gap) */}
      {footerContent && (
        <StickyFooter>{footerContent}</StickyFooter>
      )}
    </div>
  )
}

