"use client"

import { X } from "lucide-react"
import { motion } from "framer-motion"
import { StarIcon } from "@/components/icons/StarIcon"

export interface LessonProgressHeaderProps {
  currentStepIndex: number
  totalSteps: number
  /** Consecutive correct quiz answers from the start (until first mistake). */
  streak: number
  /** 0–3 stars based on mistakes: 0 mistakes = 3, 1 = 2, 2 = 1, 3+ = 0. */
  stars: 0 | 1 | 2 | 3
  hideStreak?: boolean
  hideStars?: boolean
  onExit?: () => void
}

export function LessonProgressHeader({
  currentStepIndex,
  totalSteps,
  streak,
  stars,
  hideStreak = false,
  hideStars = false,
  onExit,
}: LessonProgressHeaderProps) {
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        width: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Exit Button - "X" */}
      {onExit && (
        <button
          onClick={onExit}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          aria-label="Salir de la lección"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      )}
      {/* Progress bar — slim, Duolingo-inspired */}
      <div
        style={{
          flex: 1,
          height: 16,
          borderRadius: 999,
          background: "#F3F4F6",
          overflow: "hidden",
          boxSizing: "border-box",
          position: "relative",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <motion.div
          initial={false}
          animate={{
            width: `${Math.max(progress, totalSteps > 0 ? 4 : 0)}%`
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            restDelta: 0.001
          }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #0B71FE 0%, #4A9EFF 100%)",
            borderRadius: 999,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "rgba(255,255,255,0.25)",
            borderRadius: "999px 999px 0 0",
          }} />
        </motion.div>
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
            <StarIcon
              key={i}
              size={22}
              filled={i <= stars}
            />
          ))}
        </div>
      )}
    </div>
  )
}
