"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"
import { InfluenceDetectiveStepFields, BaseLessonStep } from "@/types/lessonTypes"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import { haptic } from "@/utils/hapticFeedback"
import Image from "next/image"
import { StepScenarioCard } from "../StepScenarioCard"

interface InfluenceDetectiveStepProps {
  step: BaseLessonStep & InfluenceDetectiveStepFields
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger: number
  isContinueEnabled: boolean
}

export function InfluenceDetectiveStep({ step, onAnswered, actionTrigger, isContinueEnabled }: InfluenceDetectiveStepProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasChecked, setHasChecked] = useState(isContinueEnabled)
  
  const handleSelect = (optionId: string) => {
    if (hasChecked) return
    
    const option = step.options.find(o => o.id === optionId)
    setSelectedOptionId(optionId)
    setHasChecked(true)
    
    if (option?.isCorrect) {
      haptic.success()
      playCorrectSound()
    } else {
      haptic.error()
      playIncorrectSound()
    }

    onAnswered({
      isCompleted: true,
      isCorrect: option?.isCorrect,
      answerData: { selectedId: optionId }
    })
  }

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 24,
      maxWidth: 600,
      margin: "0 auto"
    }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <StepScenarioCard text={step.scenario} variant="case" />
        
        {step.scenarioImage && (
             <div style={{ position: "relative", width: "100%", height: 160, borderRadius: 12, overflow: "hidden", marginTop: 4 }}>
                <Image src={step.scenarioImage} alt="Scenario" fill style={{ objectFit: "cover" }} />
             </div>
        )}
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
          ¿Qué emoción está tratando de disparar?
        </p>
        {step.options.map((option) => {
          const isSelected = selectedOptionId === option.id
          const showSuccess = hasChecked && option.isCorrect
          const showError = hasChecked && isSelected && !option.isCorrect
          
          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              whileTap={!hasChecked ? { scale: 0.98 } : {}}
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: 16,
                background: showSuccess ? "#dcfce7" : showError ? "#fee2e2" : "white",
                border: `2px solid ${showSuccess ? "#22c55e" : showError ? "#ef4444" : "#e2e8f0"}`,
                boxShadow: (showSuccess || showError) ? "none" : "0 4px 0 0 #e2e8f0",
                fontSize: 16,
                fontWeight: 700,
                color: showSuccess ? "#166534" : showError ? "#991b1b" : "#334155",
                cursor: hasChecked ? "default" : "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s"
              }}
            >
              <span>{option.label}</span>
              {hasChecked && option.isCorrect && <CheckCircle2 size={24} color="#22c55e" strokeWidth={3} />}
              {showError && <XCircle size={24} color="#ef4444" strokeWidth={3} />}
            </motion.button>
          )
        })}
      </div>
      
      <AnimatePresence>
        {hasChecked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 24,
              background: "#eff6ff",
              borderRadius: 20,
              border: "1px solid #bfdbfe",
              fontSize: 15,
              color: "#1d4ed8",
              fontWeight: 500,
              lineHeight: 1.6,
              textAlign: "center"
            }}
          >
            {selectedOptionId && step.options.find(o => o.id === selectedOptionId)?.isCorrect 
              ? "¡Correcto! Identificar estos disparadores emocionales te da poder sobre tus compras."
              : "No exactamente. Piénsalo: ese sentimiento de 'falta de algo' es común en el marketing."}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
