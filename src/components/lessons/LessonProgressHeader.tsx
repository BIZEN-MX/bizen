"use client"

import { X, Volume2, VolumeX, Loader2, Book } from "lucide-react"
import { motion } from "framer-motion"
import { StarIcon } from "@/components/icons/StarIcon"

export interface LessonProgressHeaderProps {
  currentStepIndex: number
  totalSteps: number
  /** Consecutive correct quiz answers from the start (until first mistake). */
  streak: number
  /** Estrellas basadas en errores: 0-2 = 3 estrellas, 3-5 = 2 estrellas, 6+ = 1 estrella */
  stars: 0 | 1 | 2 | 3
  hideStreak?: boolean
  hideStars?: boolean
  onExit?: () => void
  onToggleAudio?: () => void
  onOpenGlossary?: () => void
  isAudioPlaying?: boolean
  isAudioLoading?: boolean
  hasGlossary?: boolean
  isExam?: boolean
}

export function LessonProgressHeader({
  currentStepIndex,
  totalSteps,
  streak,
  stars,
  hideStreak = false,
  hideStars = false,
  onExit,
  onToggleAudio,
  onOpenGlossary,
  isAudioPlaying = false,
  isAudioLoading = false,
  hasGlossary = false,
  isExam = false,
}: LessonProgressHeaderProps) {
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px, 4vw, 20px)",
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
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          aria-label="Salir de la lección"
        >
          <X style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)" }} strokeWidth={2.5} />
        </button>
      )}

      {/* Audio Button */}
      {onToggleAudio && (
        <button
          onClick={onToggleAudio}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isAudioPlaying ? "#2563eb" : "#94a3b8",
            transition: "color 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = isAudioPlaying ? "#1d4ed8" : "#475569")}
          onMouseLeave={(e) => (e.currentTarget.style.color = isAudioPlaying ? "#2563eb" : "#94a3b8")}
          aria-label={isAudioLoading ? "Cargando audio" : isAudioPlaying ? "Pausar audio" : "Reproducir audio"}
          disabled={isAudioLoading}
        >
          {isAudioLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <Loader2 style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)" }} strokeWidth={2.5} />
            </motion.div>
          ) : isAudioPlaying ? (
             <Volume2 style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)" }} strokeWidth={2.5} />
          ) : (
             <VolumeX style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)" }} strokeWidth={2.5} />
          )}
        </button>
      )}

      {/* Glossary Button */}
      {hasGlossary && onOpenGlossary && (
        <button
          onClick={onOpenGlossary}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          aria-label="Ver glosario de la lección"
        >
          <Book style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)" }} strokeWidth={2.5} />
        </button>
      )}

      {/* Progress bar — slim, Duolingo-inspired */}
      <div
        style={{
          flex: 1,
          height: "clamp(10px, 3vw, 16px)",
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
      {!hideStars && !isExam && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "clamp(2px, 1vw, 4px)",
          }}
          role="img"
          aria-label={`${stars} de 3 estrellas`}
        >
          {[1, 2, 3].map((i) => (
            <StarIcon
              key={i}
              size={18} // Fixed smaller size for better fit on all devices
              filled={i <= stars}
            />
          ))}
        </div>
      )}
    </div>
  )
}
