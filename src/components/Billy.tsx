"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"

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
  isStatic?: boolean
}

/**
 * Componente avanzado de Billy con físicas de resorte y perspectiva 3D.
 * Incluso con una imagen estática, recrea una sensación de vida y profundidad.
 */
export function Billy({
  mood = "mascot",
  isTalking = false,
  size = 200,
  className = "",
  onClick,
  showGlow = true,
  isStatic = false
}: BillyProps) {
  const [frame, setFrame] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // -- Tracking del Mouse para Perspectiva 3D --
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Configuramos resortes para que el movimiento sea suave y orgánico
  const springConfig = { damping: 20, stiffness: 120 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig)
  
  // -- Animación de Flotación (DESHABILITADA por petición) --
  const floatY = useMotionValue(0)
  const springFloatY = useSpring(floatY, { damping: 15, stiffness: 30 })

  // Manejar entrada del mouse para el tilt 3D
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isStatic || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    if (isStatic) return
    mouseX.set(0)
    mouseY.set(0)
  }

  const getMascotImage = (currentMood: BillyMood, currentFrame: number) => {
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

  // Colores de resplandor basados en humor
  const getGlowColor = () => {
    switch (mood) {
      case "crying":
      case "worried": return "rgba(148, 163, 184, 0.25)"
      case "happy":
      case "celebrating": return "rgba(34, 197, 94, 0.25)"
      case "thinking": return "rgba(99, 102, 241, 0.25)"
      default: return "rgba(59, 130, 246, 0.25)"
    }
  }

  // Shadow dynamic properties
  const shadowScale = useTransform(springFloatY, [-12, 12], [0.8, 1.2])
  const shadowOpacity = useTransform(springFloatY, [-12, 12], [0.1, 0.3])

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size, perspective: "1200px" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
           key={mood + (isTalking ? "-talking" : "-idle")}
           style={{ 
             rotateX: 0, 
             rotateY: 0, 
             y: springFloatY,
             transformStyle: "preserve-3d" 
           }}
           whileHover={isStatic ? {} : { scale: 1 }}
           whileTap={isStatic ? {} : { scale: 0.96 }}
           onClick={onClick}
           className={`relative z-10 w-full h-full flex items-center justify-center ${isStatic ? '' : 'cursor-pointer'}`}
        >
          {/* Sombra Dinámica (Proyectada en "piso" imaginario) */}
          <motion.div 
            style={{ 
              scale: shadowScale, 
              opacity: shadowOpacity,
              y: useTransform(springFloatY, (v) => -v + 50) // Mantiene la sombra en el sitio
            }}
            className="absolute bottom-[-5%] left-[20%] right-[20%] h-[10%] bg-black/30 rounded-[50%] blur-xl z-[-1]"
          />

          {/* Resplandor (Glow) Ambientall */}
          {showGlow && (
            <div
              className="absolute inset-[-30%] rounded-full blur-[60px] z-[-2]"
              style={{ 
                background: `radial-gradient(circle, ${getGlowColor()} 0%, transparent 70%)`,
                opacity: 0.5
              }}
            />
          )}

          <img
            src={src}
            alt="Billy Mascot"
            className="w-full h-full object-contain filter drop-shadow-2xl"
            style={{ 
                imageRendering: 'auto',
                WebkitFilter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.18))',
                transform: isStatic ? "none" : "translateZ(60px)"
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
