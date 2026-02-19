"use client"

import React from "react"
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X, CONTENT_PADDING_Y } from "./layoutConstants"

interface LessonContainerProps {
  children: React.ReactNode
  className?: string
  /** Extra padding at bottom (e.g. when a fixed footer is present) */
  bottomPad?: number
  /** Padding at top so content is not hidden under fixed progress bar */
  topPad?: number
  /** When true, this div does not scroll (parent is the scroll container); used when progress bar is inside same scroll */
  noScroll?: boolean
}

/**
 * Lesson content wrapper. Single background, no extra gap.
 * When noScroll is true, parent handles scrolling and progress bar is above this content.
 */
export function LessonContainer({ children, className = "", bottomPad, topPad = 0, noScroll = false }: LessonContainerProps) {
  /* Inner: full height so slide content can use all space down to bottom */
  const inner = (
    <div
      style={{
        paddingTop: topPad !== undefined && topPad > 0 ? `calc(${CONTENT_PADDING_Y} + ${topPad}px)` : CONTENT_PADDING_Y,
        paddingBottom: bottomPad != null ? `calc(${CONTENT_PADDING_Y} + ${bottomPad}px)` : CONTENT_PADDING_Y,
        paddingLeft: CONTENT_PADDING_X,
        paddingRight: CONTENT_PADDING_X,
        maxWidth: CONTENT_MAX_WIDTH,
        margin: "0 auto",
        minHeight: 0,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {children}
    </div>
  )

  /* LOCKED: no scroll - fixed area, overflow hidden */
  return (
    <div
      className={`flex-1 min-h-0 overflow-hidden ${className} lesson-container-no-scroll`}
      style={{ background: "#f1f5f9", display: "flex", flexDirection: "column" }}
    >
      <div style={{ overflow: "hidden", minHeight: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        {inner}
      </div>
    </div>
  )
}

