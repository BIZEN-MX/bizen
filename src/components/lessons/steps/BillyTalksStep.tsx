"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic } from "lucide-react"
import { SmartText } from "../SmartText"
import { haptic } from "@/utils/hapticFeedback"
import { playFlipSound } from "../lessonSounds"
import { Billy, BillyMood } from "../../Billy"

// Use a simplified version of step type here to avoid circular dependencies
// In actual project, this should be defined in lessonTypes.ts
interface BillyTalksStepProps {
  step: {
    id: string;
    stepType: string;
    body: string;
    mood?: "happy" | "worried" | "thinking" | "celebrating" | "crying" | "mascot";
    continueLabel?: string;
  }
  onAnswered: (result: {
    isCompleted: boolean
    isCorrect?: boolean
    answerData?: any
    canAction?: boolean
  }) => void
  onPlayAudio?: () => void
  actionTrigger?: number
  isContinueEnabled?: boolean
}

export function BillyTalksStep({
  step,
  onAnswered,
  onPlayAudio,
  actionTrigger = 0,
  isContinueEnabled = false,
}: BillyTalksStepProps) {
  const [isRevealed, setIsRevealed] = useState(isContinueEnabled)

  const [isTalking, setIsTalking] = useState(false)

  // Map mood to BillyMood type
  const getMappedMood = (mood: string = "mascot"): BillyMood => {
    switch (mood) {
      case "happy": return "happy"
      case "worried": return "worried"
      case "crying": return "crying"
      case "thinking": return "thinking"
      case "celebrating": return "celebrating"
      default: return "mascot"
    }
  }

  const mood = getMappedMood(step.mood)

  useEffect(() => {
    if (isContinueEnabled) {
      setIsRevealed(true)
      return
    }
    // For narrative steps, they are fully interactive by definition
    // User just needs to advance. Wait a brief moment, then allow continue.
    const timer = setTimeout(() => {
        onAnswered({ isCompleted: true, canAction: false }) // Immediately complete, auto-enables Continue
    }, 500)
    
    return () => clearTimeout(timer)
  }, [onAnswered, isContinueEnabled])

  // Handle "Comprobar/Continue" action from footer
  const handleReveal = useCallback(() => {
    if (!isRevealed) {
      playFlipSound()
      haptic.success()
      setIsRevealed(true)
    }
  }, [isRevealed])

  useEffect(() => {
    if (actionTrigger > 0 && !isRevealed) {
      handleReveal()
    }
  }, [actionTrigger, handleReveal, isRevealed])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: "50vh"
      }}
    >
        <div style={{ maxWidth: 640, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          
<div 
  style={{
     width: "clamp(120px, 25vw, 200px)",
     height: "clamp(120px, 25vw, 200px)",
     position: "relative",
     marginBottom: "clamp(12px, 3vw, 24px)",
     cursor: "pointer"
  }}
>
   {/* Touch Hint */}
   <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [-5, 0, -5] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
          position: "absolute",
          top: -30,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#10b981", // Change to green for contrast
          color: "white",
          padding: "4px 12px",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 800,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          zIndex: 50
      }}
   >
      TÓCAME PARA ESCUCHAR
      <Mic size={14} color="white" strokeWidth={3} />
   </motion.div>

   <Billy 
     mood={mood} 
     isTalking={isTalking}
     size="100%"
     onClick={() => {
        const { initAudioContext } = require("../lessonSounds")
        initAudioContext()
        onPlayAudio?.()
        haptic.light()
        
        // Simular que habla durante 3 segundos o hasta que termine el audio si hubiera callback
        setIsTalking(true)
        setTimeout(() => setIsTalking(false), 3000)
     }}
   />
</div>

          {/* Speech Bubble */}
          <motion.div
             initial={{ opacity: 0, y: 10, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
             className="font-educational"
             style={{
                 background: "#ffffff",

                 border: "2px solid #e2e8f0",
                 borderRadius: 24,
                 padding: "clamp(14px, 4vw, 24px) clamp(16px, 5vw, 32px)",
                 position: "relative",
                 boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                 width: "100%"
             }}
          >
             {/* Speech bubble tail pointing to mascot */}
             <div style={{
                 position: "absolute",
                 top: -12,
                 left: "50%",
                 transform: "translateX(-50%) rotate(45deg)",
                 width: 24,
                 height: 24,
                 background: "#ffffff",
                 borderLeft: "2px solid #e2e8f0",
                 borderTop: "2px solid #e2e8f0",
             }} />

             <SmartText 
                text={step.body} 
                fontSize="clamp(16px, 2.5vw, 20px)" 
                align="center" 
             />
          </motion.div>
        
        </div>
    </motion.div>
  )
}
