"use client"

import React, { useState, useEffect, useCallback } from "react"
import { MiniSimStepFields } from "@/types/lessonTypes"
import { motion, AnimatePresence } from "framer-motion"
import { haptic } from "@/utils/hapticFeedback"
import { playFlipSound } from "../lessonSounds"
import { SmartText } from "../SmartText"

interface MiniSimStepProps {
  step: MiniSimStepFields & { id: string; continueLabel?: string }
  onAnswered: (result: {
    isCompleted: boolean
    isCorrect?: boolean
    answerData?: any
    canAction?: boolean
  }) => void
  actionTrigger?: number
  isContinueEnabled?: boolean
}

export function MiniSimStep({
  step,
  onAnswered,
  actionTrigger = 0,
  isContinueEnabled = false,
}: MiniSimStepProps) {
  // Common state
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isRevealed, setIsRevealed] = useState(isContinueEnabled)

  // Simulation state based on type
  const [sliderValue1, setSliderValue1] = useState(step.initialValues?.slider1 || 0)
  const [sliderValue2, setSliderValue2] = useState(step.initialValues?.slider2 || 0)

  // 1. Budget/Coffee Slider logic
  // e.g. "Gasto Hormiga": $50 a day coffee = $18,250 a year
  const coffeeDaily = sliderValue1
  const coffeeYearly = coffeeDaily * 365
  const tenYearLoss = coffeeYearly * 10

  // Check goal strictly for budget type
  const targetReachedBudget = step.simType === "budget_slider" && step.targetValue !== undefined && coffeeDaily <= step.targetValue

  // 2. Compound Interest Logic
  const startAmount = sliderValue1 || 1000 // default 1000
  const monthlyAdd = sliderValue2 || 100 // default 100
  const rate = 1.10 // 10% annual
  
  // Calculate 10 years compound interest approximation
  let finalAmount = startAmount;
  for (let i=0; i<10; i++) {
    finalAmount = (finalAmount + (monthlyAdd * 12)) * rate;
  }
  
  const targetReachedCompound = step.simType === "compound_interest" && step.targetValue !== undefined && finalAmount >= step.targetValue

  const isGoalReached = step.simType === "budget_slider" ? targetReachedBudget : 
                        step.simType === "compound_interest" ? targetReachedCompound : 
                        true // fallback pass

  useEffect(() => {
    if (isContinueEnabled) {
      setIsRevealed(true)
      return
    }
    
    // Auto-complete if they hit the target after interacting, or if there's no specific goal
    const canComplete = hasInteracted && (step.targetValue === undefined || isGoalReached)
    
    if (canComplete && !isRevealed) {
      onAnswered({ isCompleted: false, canAction: true })
    } else if (!isRevealed) {
      onAnswered({ isCompleted: false, canAction: false })
    }
  }, [hasInteracted, isGoalReached, isRevealed, step.targetValue, isContinueEnabled, onAnswered])

  // Handle "Comprobar" action from footer
  const handleReveal = useCallback(() => {
    if (!isRevealed) {
      playFlipSound()
      haptic.success()
      setIsRevealed(true)
      onAnswered({ isCompleted: true, isCorrect: true, answerData: { sliderValue1, sliderValue2 } })
    }
  }, [isRevealed, onAnswered, sliderValue1, sliderValue2])

  useEffect(() => {
    if (actionTrigger > 0 && !isRevealed) {
      handleReveal()
    }
  }, [actionTrigger, handleReveal, isRevealed])

  const renderBudgetSim = () => (
    <div className="sim-container">
      <div className="result-card">
        <p className="result-label">Costo Anual</p>
        <motion.div 
            key={coffeeYearly}
            initial={{ scale: 1.1, color: "#ef4444" }}
            animate={{ scale: 1, color: "#1e293b" }}
            className="result-value"
        >
          ${coffeeYearly.toLocaleString()}
        </motion.div>
        
        <div style={{ marginTop: 12, height: 2, background: "#e2e8f0", width: "100%", position: "relative" }}>
             <motion.div 
                style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "#ef4444" }}
                animate={{ width: `${Math.min(100, (coffeeDaily / 200) * 100)}%` }}
             />
        </div>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>En 10 años: <strong style={{color: "#b91c1c"}}>${tenYearLoss.toLocaleString()}</strong></p>
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label>Gasto Diario (Café, snacks)</label>
          <span className="slider-badge">${sliderValue1}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="200" 
          step="5"
          value={sliderValue1} 
          onChange={(e) => {
            setSliderValue1(parseInt(e.target.value))
            setHasInteracted(true)
            haptic.light()
          }}
          className="biz-slider"
          disabled={isRevealed}
        />
        {step.targetValue !== undefined && (
          <p style={{ fontSize: 13, color: isGoalReached ? "#10b981" : "#64748b", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            {isGoalReached ? "✅ " : "🎯 "}
            Objetivo: Reducir a ${step.targetValue} o menos
          </p>
        )}
      </div>
    </div>
  )

  const renderCompoundSim = () => (
    <div className="sim-container">
      <div className="result-card success">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p className="result-label">Proyección a 10 años</p>
            <div style={{ background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>+10% Anual</div>
        </div>
        
        <motion.div 
            key={finalAmount}
            initial={{ scale: 1.05, color: "#10b981" }}
            animate={{ scale: 1, color: "#0f172a" }}
            className="result-value success-text"
        >
          ${Math.round(finalAmount).toLocaleString()}
        </motion.div>
        
        <div style={{ marginTop: 16, display: "flex", gap: 4, height: 24, alignItems: "flex-end" }}>
            {/* Simple CSS bar chart visualization */}
            {[1,3,5,7,10].map((year) => {
               let val = startAmount;
               for(let i=0; i<year; i++) val = (val + (monthlyAdd*12))*rate;
               const heightPct = Math.max(10, Math.min(100, (val / finalAmount) * 100));
               return (
                 <div key={year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                   <motion.div 
                      style={{ width: "100%", background: "linear-gradient(to top, #3b82f6, #60a5fa)", borderRadius: "4px 4px 0 0" }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                   />
                 </div>
               )
            })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
             <span>Año 1</span>
             <span>Año 10</span>
        </div>
      </div>

      <div className="sliders-wrapper" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="slider-group">
            <div className="slider-header">
            <label>Ahorro Inicial</label>
            <span className="slider-badge blue">${sliderValue1.toLocaleString()}</span>
            </div>
            <input 
            type="range" 
            min="0" 
            max="10000" 
            step="500"
            value={sliderValue1} 
            onChange={(e) => {
                setSliderValue1(parseInt(e.target.value))
                setHasInteracted(true)
            }}
            className="biz-slider blue"
            disabled={isRevealed}
            />
        </div>

        <div className="slider-group">
            <div className="slider-header">
            <label>Aportación Mensual</label>
            <span className="slider-badge blue">${sliderValue2.toLocaleString()}</span>
            </div>
            <input 
            type="range" 
            min="0" 
            max="5000" 
            step="100"
            value={sliderValue2} 
            onChange={(e) => {
                setSliderValue2(parseInt(e.target.value))
                setHasInteracted(true)
            }}
            className="biz-slider blue"
            disabled={isRevealed}
            />
        </div>
      </div>
      
      {step.targetValue !== undefined && (
          <p style={{ fontSize: 13, color: isGoalReached ? "#10b981" : "#64748b", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            {isGoalReached ? "✅ " : "🎯 "}
            Objetivo: Llegar a ${step.targetValue.toLocaleString()}
          </p>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 600 }}>
        {step.title && (
          <h2 style={{
            fontSize: "clamp(22px, 4vw, 28px)",
            fontWeight: 600,
            color: "#0f172a",
            marginBottom: 16,
            textAlign: "center"
          }}>
            {step.title}
          </h2>
        )}

        {step.body && (
           <div style={{ marginBottom: 24 }}>
             <SmartText text={step.body} align="center" fontSize="16px" />
           </div>
        )}

        {/* The Simulator UI */}
        <div style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: "clamp(20px, 4vw, 32px)",
            border: "2px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            position: "relative",
            overflow: "hidden"
        }}>
           {/* Top accent line */}
           <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: step.simType === 'compound_interest' ? "#3b82f6" : "#ef4444" }} />

           {step.simType === "budget_slider" && renderBudgetSim()}
           {step.simType === "compound_interest" && renderCompoundSim()}

           <AnimatePresence>
             {isRevealed && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: 24,
                        padding: 16,
                        background: "#eff6ff",
                        borderRadius: 16,
                        border: "1px solid #bfdbfe",
                        display: "flex",
                        alignItems: "center",
                        gap: 12
                    }}
                 >
                     <div style={{ background: "#3b82f6", color: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                         💡
                     </div>
                     <p style={{ fontSize: 14, color: "#1e3a8a", margin: 0, fontWeight: 500 }}>
                         {step.simType === "budget_slider" 
                           ? "¡Pequeños cambios diarios hacen una gran diferencia a largo plazo!"
                           : "El interés compuesto es tu mejor aliado. ¡El tiempo pesa más que el capital inicial!"}
                     </p>
                 </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <style>{`
        .sim-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        .result-card {
            background: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .result-card.success {
            background: #f0fdf4;
            border-color: #bbf7d0;
        }
        .result-label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            font-weight: 600;
            margin: 0 0 8px 0;
        }
        .result-value {
            font-size: 36px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            line-height: 1;
            font-feature-settings: "tnum";
            font-variant-numeric: tabular-nums;
        }
        .result-value.success-text {
            color: #166534;
        }
        .slider-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .slider-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .slider-header label {
            font-size: 14px;
            font-weight: 600;
            color: #334155;
        }
        .slider-badge {
            background: #fee2e2;
            color: #b91c1c;
            padding: 4px 10px;
            border-radius: 99px;
            font-size: 14px;
            font-weight: 700;
            font-feature-settings: "tnum";
        }
        .slider-badge.blue {
            background: #dbeafe;
            color: #1d4ed8;
        }
        
        /* Custom UI Slider styling */
        .biz-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: #e2e8f0;
            outline: none;
            margin: 10px 0;
        }
        .biz-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #ef4444; /* Red for expenses */
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            border: 3px solid #ffffff;
            transition: transform 0.1s;
        }
        .biz-slider.blue::-webkit-slider-thumb {
            background: #3b82f6; /* Blue for savings */
        }
        .biz-slider:active::-webkit-slider-thumb {
            transform: scale(1.15);
        }
        .biz-slider::-moz-range-thumb {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            border: 3px solid #ffffff;
        }
        .biz-slider.blue::-moz-range-thumb {
            background: #3b82f6;
        }
      `}</style>
    </motion.div>
  )
}
