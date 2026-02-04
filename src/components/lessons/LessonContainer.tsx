"use client"

import React from "react"

interface LessonContainerProps {
  children: React.ReactNode
  className?: string
  /** Extra padding at bottom (e.g. when a fixed footer is present) */
  bottomPad?: number
}

/**
 * Scrollable area for lesson content. No forced font sizes or wrappers.
 */
export function LessonContainer({ children, className = "", bottomPad }: LessonContainerProps) {
  return (
    <div
      className={`flex-1 overflow-y-auto overflow-x-hidden min-h-0 ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div
        style={{
          padding: 24,
          paddingBottom: bottomPad != null ? 24 + bottomPad : 24,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  )
}

