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

const BLUE = "#2563eb"

export function LessonProgressHeader({
  currentStepIndex,
  totalSteps,
  streak,
  stars,
  hideStreak = false,
  hideStars = false,
}: LessonProgressHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "min(95%, 900px)",
        marginBottom: "1.5rem",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          flex: 1,
          height: "32px",
          borderRadius: "20px",
          border: "3px solid #1e293b",
          background: "#e2e8f0",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: `${totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0}%`,
            height: "100%",
            background: "#2563eb",
            borderRadius: "14px",
            minWidth: totalSteps > 0 ? 8 : 0,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Streak + 3 stars - right */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Streak - custom flame image (larger) */}
        {!hideStreak && (
          <span
            style={{
              fontSize: "clamp(16px, 3.5vw, 22px)",
              fontWeight: 600,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src="/streak.png"
              alt=""
              width={56}
              height={56}
              style={{ display: "block", objectFit: "contain" }}
            />
            {streak}
          </span>
        )}

        {/* 3 stars - stars.png; unearned shown gray (larger) */}
        {!hideStars && (
          <span
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
            role="img"
            aria-label={stars === 0 ? "0 de 3 estrellas" : `${stars} de 3 estrellas`}
          >
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src="/stars.png"
                alt=""
                width={40}
                height={40}
                style={{
                  display: "block",
                  objectFit: "contain",
                  opacity: i <= stars ? 1 : 0.35,
                  filter: i <= stars ? "none" : "grayscale(1)",
                }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
