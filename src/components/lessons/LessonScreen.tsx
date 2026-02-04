"use client"

import React from "react"
import { ProgressBar } from "./ProgressBar"
import { LessonContainer } from "./LessonContainer"
import { StickyFooter } from "./StickyFooter"

interface LessonScreenProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  footerContent?: React.ReactNode
  className?: string
}

/**
 * Main lesson screen component
 * - Full-height layout with flex column
 * - Background: bg-slate-900 text-white
 * - Progress bar at top
 * - Scrollable content in middle
 * - Sticky footer at bottom
 */
export function LessonScreen({
  children,
  currentStep,
  totalSteps,
  footerContent,
  className = "",
}: LessonScreenProps) {
  return (
    <div
      className="flex flex-col bg-white text-slate-900 relative w-full flex-1 min-h-0"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        minHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* Progress Bar - visible strip at top */}
      <div style={{ flexShrink: 0, paddingTop: 8, paddingBottom: 8 }}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Main Content - Scrollable; extra padding so content is not hidden under fixed footer */}
      <LessonContainer className={className} bottomPad={footerContent ? 100 : undefined}>
        {children}
      </LessonContainer>

      {/* Footer - Fixed to bottom of viewport so it stays visible */}
      {footerContent && (
        <div className="lesson-footer-fixed">
          <StickyFooter>{footerContent}</StickyFooter>
        </div>
      )}
    </div>
  )
}

