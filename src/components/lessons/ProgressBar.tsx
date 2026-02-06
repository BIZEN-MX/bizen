"use client"

import React from "react"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

const BLUE = "#2563EB"
const BORDER = "#1e293b"

export function ProgressBar({ currentStep, totalSteps, className = "" }: ProgressBarProps) {
  const percentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <div
      className={className}
      style={{
        margin: "0 auto",
        width: "min(90%, 900px)",
        padding: "8px 0",
        background: "transparent",
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
          height: 32,
          background: "#e2e8f0",
          borderRadius: 20,
          overflow: "hidden",
          border: `3px solid ${BORDER}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: BLUE,
            borderRadius: 14,
            minWidth: percentage > 0 ? 8 : 0,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  )
}

