"use client"

import React from "react"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

const BLUE = "#2563EB"

export function ProgressBar({ currentStep, totalSteps, className = "" }: ProgressBarProps) {
  const percentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <div
      className={className}
      style={{
        margin: "0 auto",
        maxWidth: 400,
        padding: "14px 20px",
        background: "#F8FAFC",
        borderBottom: `3px solid ${BLUE}`,
        textAlign: "center",
      }}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-label={`Progreso: paso ${currentStep} de ${totalSteps}`}
    >
      <div
        style={{
          width: "100%",
          height: 24,
          background: "#E2E8F0",
          borderRadius: 12,
          overflow: "hidden",
          border: `3px solid ${BLUE}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: BLUE,
            borderRadius: 9,
            minWidth: percentage > 0 ? 8 : 0,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  )
}

