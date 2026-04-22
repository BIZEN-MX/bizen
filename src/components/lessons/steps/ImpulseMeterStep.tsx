"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImpulseMeterStepFields, BaseLessonStep } from "@/types/lessonTypes"
import { CheckCircle2 } from "lucide-react"
import { haptic } from "@/utils/hapticFeedback"
import Image from "next/image"
import { StepScenarioCard } from "../StepScenarioCard"

interface ImpulseMeterStepProps {
  step: BaseLessonStep & Partial<ImpulseMeterStepFields> & {
    minLabel?: string;
    maxLabel?: string;
    targetValue?: number;
    resultText?: string;
    body?: string;
    title?: string;
  }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger: number
  isContinueEnabled: boolean
}

export function ImpulseMeterStep({ step, onAnswered, actionTrigger, isContinueEnabled }: ImpulseMeterStepProps) {
  // Mode 1: Slider/Scale Mode (used in new curriculum)
  if (step.minLabel && step.maxLabel) {
    return <SliderMode step={step} onAnswered={onAnswered} isContinueEnabled={isContinueEnabled} />
  }

  // Mode 2: Original Hold-to-Pause Mode
  return <HoldToPauseMode step={step as any} onAnswered={onAnswered} isContinueEnabled={isContinueEnabled} />
}

function SliderMode({ step, onAnswered, isContinueEnabled }: any) {
  const [value, setValue] = useState(5)
  const [isSubmitted, setIsSubmitted] = useState(isContinueEnabled)

  const handleSubmit = () => {
    haptic.success()
    setIsSubmitted(true)
    onAnswered({
      isCompleted: true,
      isCorrect: true,
      answerData: { selectedValue: value }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 500, margin: "0 auto", width: "100%", textAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {step.title && <h2 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 800, color: "#111827", margin: 0 }}>{step.title}</h2>}
        {step.body && <p style={{ fontSize: 16, color: "#475569", margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{step.body}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "20px 0" }}>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={value} 
          onChange={(e) => {
            if (!isSubmitted) {
                setValue(parseInt(e.target.value))
                haptic.light()
            }
          }}
          disabled={isSubmitted}
          style={{ width: "100%", height: 8, borderRadius: 4, appearance: "none", background: "#e2e8f0", outline: "none", opacity: isSubmitted ? 0.7 : 1 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#64748b" }}>
          <span style={{ width: "40%", textAlign: "left" }}>{step.minLabel}</span>
          <span style={{ width: "40%", textAlign: "right" }}>{step.maxLabel}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!isSubmitted ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            style={{ width: "100%", padding: "16px", borderRadius: 16, background: "#0B71FE", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            Confirmar Respuesta
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#eff6ff", padding: 20, borderRadius: 16, border: "2px solid #bfdbfe" }}>
            <p style={{ margin: 0, fontSize: 15, color: "#1e40af", fontWeight: 600 }}>{step.resultText || "Tu respuesta ha sido registrada."}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function HoldToPauseMode({ step, onAnswered, isContinueEnabled }: any) {
  const [isPressing, setIsPressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(isContinueEnabled)
  
  const HOLD_TIME = (step.holdTime || 3) * 1000 // Convert to ms
  const TICK = 50 // ms

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isPressing && !isSuccess) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (TICK / HOLD_TIME) * 100
          return next >= 100 ? 100 : next
        })
      }, TICK)
    } else if (!isSuccess) {
      setProgress(0)
    }

    return () => clearInterval(interval)
  }, [isPressing, isSuccess, HOLD_TIME])

  useEffect(() => {
    if (progress >= 100 && !isSuccess) {
      handleFinish()
    }
  }, [progress, isSuccess])

  const handleFinish = () => {
    setIsSuccess(true)
    haptic.success()
    onAnswered({
      isCompleted: true,
      isCorrect: true,
      answerData: { held: true }
    })
  }

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 32,
      maxWidth: 500,
      margin: "0 auto",
      textAlign: "center"
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        <h3 style={{ fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 700, color: "#1e293b", margin: 0 }}>
          {step.item?.name || "Producto BIZEN"}
        </h3>
        <p style={{ fontSize: "clamp(24px, 4vw, 28px)", fontWeight: 800, color: "#0F62FE", margin: 0 }}>
          {step.item?.price || "---"}
        </p>

        {step.description && <StepScenarioCard text={step.description} variant="context" />}
      </div>

      <div style={{
        position: "relative",
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        border: "4px solid #e2e8f0"
      }}>
         <motion.div 
            style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: progress < 40 
                    ? "linear-gradient(to top, #ef4444, #f87171)" 
                    : progress < 75 
                        ? "linear-gradient(to top, #f59e0b, #fbbf24)"
                        : "linear-gradient(to top, #10b981, #34d399)",
                height: `${progress}%`,
                zIndex: 1,
                transition: "background 0.3s ease"
            }}
         />
         
         <div style={{ position: "relative", zIndex: 2, width: "70%", height: "70%" }}>
            <Image 
                src={step.item?.imageUrl || "/billy/neutral.png"} 
                alt={step.item?.name || "BIZEN Item"} 
                fill 
                style={{ objectFit: "contain", filter: isSuccess ? "none" : "grayscale(0.5)" }} 
            />
         </div>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 16, color: "#64748b", fontWeight: 500, lineHeight: 1.4 }}>
          {isSuccess ? "¡Excelente! Compraste con la cabeza, no con el impulso." : (step.instructions || "Mantén presionado para resistir el impulso")}
        </p>

        {!isSuccess && (
          <motion.button
            onMouseDown={() => { setIsPressing(true); haptic.light(); }}
            onMouseUp={() => setIsPressing(false)}
            onMouseLeave={() => setIsPressing(false)}
            onTouchStart={() => { setIsPressing(true); haptic.light(); }}
            onTouchEnd={() => setIsPressing(false)}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: 20,
              background: isPressing ? "#0F62FE" : "#3b82f6",
              color: "white",
              fontSize: 18,
              fontWeight: 800,
              border: "none",
              boxShadow: isPressing ? "none" : "0 8px 0 0 #1e40af",
              cursor: "pointer",
              userSelect: "none",
              transition: "transform 0.1s"
            }}
          >
            {isPressing ? "RESPIRANDO..." : "MANTÉN PARA PAUSAR"}
          </motion.button>
        )}
        
        {isSuccess && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <CheckCircle2 size={48} color="#22c55e" strokeWidth={3} />
            </motion.div>
        )}
      </div>
    </div>
  )
}

