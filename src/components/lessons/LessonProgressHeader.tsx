"use client"

import React from "react"

export interface LessonProgressHeaderProps {
  currentStepIndex: number
  totalSteps: number
  /** Consecutive correct quiz answers from the start (until first mistake). */
  streak: number
  /** 0–3 stars based on mistakes: 0 mistakes = 3, 1 = 2, 2 = 1, 3+ = 0. */
  stars: 0 | 1 | 2 | 3
  hideStreak?: boolean
  hideStars?: boolean
}

export function LessonProgressHeader({
  currentStepIndex,
  totalSteps,
  streak,
  stars,
  hideStreak = false,
  hideStars = false,
}: LessonProgressHeaderProps) {
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        maxWidth: 720,
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Progress bar — slim, Duolingo-inspired */}
      <div
        style={{
          flex: 1,
          height: 16,
          borderRadius: 999,
          background: "#E5E7EB",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: `${Math.max(progress, totalSteps > 0 ? 4 : 0)}%`,
            height: "100%",
            background: "linear-gradient(90deg, #0B71FE 0%, #4A9EFF 100%)",
            borderRadius: 999,
            transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle shine */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "rgba(255,255,255,0.25)",
            borderRadius: "999px 999px 0 0",
          }} />
        </div>
      </div>

      {/* Stars removed section was here */}

      {/* Stars */}
      {!hideStars && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          role="img"
          aria-label={`${stars} de 3 estrellas`}
        >
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src="/stars.png"
              alt=""
              width={22}
              height={22}
              style={{
                display: "block",
                objectFit: "contain",
                opacity: i <= stars ? 1 : 0.3,
                filter: i <= stars ? "none" : "grayscale(1)",
                transition: "opacity 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
