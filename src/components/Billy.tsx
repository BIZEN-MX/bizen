"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export type BillyMood = 
  | "happy" 
  | "worried" 
  | "thinking" 
  | "celebrating" 
  | "crying" 
  | "mascot" 
  | "loading"

interface BillyProps {
  mood?: BillyMood
  isTalking?: boolean
  size?: number | string
  className?: string
  onClick?: () => void
  showGlow?: boolean
}

/**
 * Componente centralizado de Billy con animaciones integradas.
 * Soporta estados de ánimo, animación de habla y efectos de flotación.
 */
export function Billy({
  mood = "mascot",
  isTalking = false,
  size = 200,
  className = "",
  onClick,
  showGlow = true
}: BillyProps) {
  const [frame, setFrame] = useState(0)

  // Map mood to available images
  const getMascotImage = (currentMood: BillyMood, currentFrame: number) => {
    // Si está hablando, alternamos entre frames si están disponibles
    if (isTalking) {
      return currentFrame === 0 ? "/2.png" : "/3.png"
    }

    switch (currentMood) {
      case "happy": return "/thumbs up.png"
      case "celebrating": return "/thumbs up.png"
      case "worried": return "/billy_loading.png"
      case "loading": return "/billy_loading.png"
      case "crying": return "/billy_llorando.png"
      case "thinking": return "/billy_chatbot.png"
      case "mascot": return "/thumbs up.png"
      default: return "/thumbs up.png"
    }
  }

  // Animación de habla (parpadeo de boca)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTalking) {
      interval = setInterval(() => {
        setFrame(f => (f === 0 ? 1 : 0))
      }, 150)
    } else {
      setFrame(0)
    }
    return () => clearInterval(interval)
  }, [isTalking])

  const src = getMascotImage(mood, frame)

  // Glow color based on mood
  const getGlowColor = () => {
    switch (mood) {
      case "crying":
      case "worried":
        return "rgba(148, 163, 184, 0.2)"
      case "happy":
      case "celebrating":
        return "rgba(34, 197, 94, 0.2)"
      default:
        return "rgba(59, 130, 246, 0.2)"
    }
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mood + (isTalking ? "-talking" : "-idle")}
          initial={{ y: 20, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            scale: 1,
            // Animación de "respiración" o flotación constante
            transition: {
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              },
              scale: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }
            }
          }}
          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer"
        >
          {/* Resplandor de fondo (Glow) */}
          {showGlow && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-[-20%] rounded-full blur-3xl z-[-1]"
              style={{ background: `radial-gradient(circle, ${getGlowColor()} 0%, transparent 70%)` }}
            />
          )}

          <img
            src={src}
            alt="Billy Mascot"
            className="w-full h-full object-contain filter drop-shadow-xl"
            style={{ 
                imageRendering: 'auto',
                WebkitFilter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
