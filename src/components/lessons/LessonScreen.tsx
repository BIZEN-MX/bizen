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
      className="min-h-screen flex flex-col bg-white text-slate-900 relative"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        minHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* Progress Bar */}
      <div className="pt-4 md:pt-6 pb-2 md:pb-4 flex-shrink-0 pointer-events-none">
        <div className="pointer-events-auto">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <LessonContainer className={className}>{children}</LessonContainer>

      {/* Sticky Footer - Always at bottom */}
      {footerContent && <StickyFooter>{footerContent}</StickyFooter>}
    </div>
  )
}

