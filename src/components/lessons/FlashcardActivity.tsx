"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  BookOpen
} from "lucide-react"
import { Flashcard } from "@/data/flashcardData"
import { playCorrectSound, playIncorrectSound, playFlipSound } from "./lessonSounds"
import { haptic } from "@/utils/hapticFeedback"

interface FlashcardActivityProps {
  cards: Flashcard[]
  onClose: () => void
  title?: string
}

type Mode = "review" | "exam" | "result"

export default function FlashcardActivity({ cards, onClose, title = "Repaso de Conceptos" }: FlashcardActivityProps) {
  const [mode, setMode] = useState<Mode>("review")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [examResults, setExamResults] = useState<{
    correctCount: number
    mistakes: string[] 
  }>({ correctCount: 0, mistakes: [] })
  const [examState, setExamState] = useState<{
    score: number
    answers: Record<string, boolean>
    shuffledOptions: string[][]
  }>({
    score: 0,
    answers: {},
    shuffledOptions: []
  })

  // Prepare shuffled options for exam mode
  useEffect(() => {
    if (mode === "exam") {
      const options = cards.map((card, idx) => {
        const others = cards.filter((_, i) => i !== idx).map(c => c.definition)
        const randomOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3)
        return [card.definition, ...randomOthers].sort(() => 0.5 - Math.random())
      })
      setExamState(prev => ({ ...prev, shuffledOptions: options }))
    }
  }, [mode, cards])

  const currentCard = cards[currentIndex]

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    } else if (mode === "review") {
      setMode("exam")
      setCurrentIndex(0)
    } else {
      setMode("result")
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    playFlipSound()
    haptic.light()
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const handleAnswer = (definition: string) => {
    const isCorrect = definition === currentCard.definition
    
    if (isCorrect) {
      playCorrectSound()
      haptic.success()
      setExamResults(prev => ({ ...prev, correctCount: prev.correctCount + 1 }))
    } else {
      playIncorrectSound()
      haptic.error()
      setExamResults(prev => ({ ...prev, mistakes: [...prev.mistakes, currentCard.concept] }))
    }

    setExamState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: { ...prev.answers, [currentCard.id]: isCorrect }
    }))
    
    setTimeout(() => {
      handleNext()
    }, 600)
  }

  const reset = () => {
    setMode("review")
    setCurrentIndex(0)
    setIsFlipped(false)
    setExamState({ score: 0, answers: {}, shuffledOptions: [] })
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#FBFAF5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      {/* Header */}
      <div style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: "20px 24px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>{title}</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              {mode === "review" ? "Modo Repaso" : mode === "exam" ? "Modo Examen" : "Resultados"}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={20} color="#64748b" />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, height: 4, background: "#e2e8f0" }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          style={{ height: "100%", background: "#2563eb" }}
        />
      </div>

      <main style={{ width: "100%", maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        
        <AnimatePresence mode="wait">
          {mode === "review" && (
            <motion.div 
              key="review"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              style={{ width: "100%", perspective: 1000 }}
            >
              <div 
                onClick={handleFlip}
                style={{ 
                  width: "100%", 
                  height: "clamp(300px, 45vh, 400px)", 
                  position: "relative", 
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  cursor: "pointer"
                }}
              >
                {/* Front */}
                <div style={{ 
                  position: "absolute", 
                  inset: 0, 
                  backfaceVisibility: "hidden",
                  background: "white",
                  borderRadius: 32,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 40,
                  border: "1px solid rgba(0,0,0,0.05)",
                  textAlign: "center"
                }}>
                  <BookOpen size={48} color="#2563eb" style={{ marginBottom: 24, opacity: 0.2 }} />
                  <h3 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", margin: 0, lineHeight: 1.2 }}>{currentCard.concept}</h3>
                  <p style={{ marginTop: 32, color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Haz clic para ver la definición</p>
                </div>

                {/* Back */}
                <div style={{ 
                  position: "absolute", 
                  inset: 0, 
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                  borderRadius: 32,
                  boxShadow: "0 20px 50px rgba(37,99,235,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 40,
                  color: "white",
                  textAlign: "center"
                }}>
                  <Lightbulb size={48} color="rgba(255,255,255,0.3)" style={{ marginBottom: 24 }} />
                  <p style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{currentCard.definition}</p>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, width: "100%" }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  disabled={currentIndex === 0}
                  style={{ 
                    width: 56, height: 56, borderRadius: "50%", background: "white", border: "1px solid #e2e8f0", 
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", 
                    opacity: currentIndex === 0 ? 0.5 : 1
                  }}
                >
                  <ChevronLeft size={24} color="#1e293b" />
                </button>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>
                  {currentIndex + 1} / {cards.length}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  style={{ 
                    padding: "16px 32px", borderRadius: 16, background: "#1e293b", color: "white", 
                    border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 
                  }}
                >
                  {currentIndex === cards.length - 1 ? "Ir al Examen" : "Siguiente"}
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {mode === "exam" && (
            <motion.div 
              key="exam"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              style={{ width: "100%" }}
            >
              <div style={{ marginBottom: 32, textAlign: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em" }}>Pregunta {currentIndex + 1}</span>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginTop: 8 }}>¿Qué es "{currentCard.concept}"?</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {examState.shuffledOptions[currentIndex]?.map((opt, i) => {
                  const isSelected = examState.answers[currentCard.id] !== undefined
                  const isCorrect = opt === currentCard.definition
                  
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !isSelected && handleAnswer(opt)}
                      style={{
                        width: "100%",
                        padding: "20px 24px",
                        borderRadius: 20,
                        textAlign: "left",
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.5,
                        cursor: isSelected ? "default" : "pointer",
                        border: "2px solid",
                        borderColor: isSelected 
                          ? (isCorrect ? "#10b981" : "#f43f5e") 
                          : "#e2e8f0",
                        background: isSelected 
                          ? (isCorrect ? "#ecfdf5" : "#fff1f2") 
                          : "white",
                        color: "#1e293b",
                        display: "flex",
                        alignItems: "center",
                        gap: 16
                      }}
                    >
                      <div style={{ 
                        width: 24, height: 24, borderRadius: "50%", border: "2px solid", 
                        borderColor: isSelected ? (isCorrect ? "#10b981" : "#f43f5e") : "#cbd5e1",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {isSelected && isCorrect && <CheckCircle2 size={16} color="#10b981" />}
                        {isSelected && !isCorrect && <AlertCircle size={16} color="#f43f5e" />}
                      </div>
                      {opt}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {mode === "result" && (
            <motion.div 
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ width: "100%", textAlign: "center" }}
            >
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Trophy size={64} color="#f59e0b" />
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b" }}>¡Misión Cumplida!</h2>
              <p style={{ fontSize: 18, color: "#64748b", marginBottom: 40 }}>
                Has completado el repaso y el examen con una puntuación de <strong style={{ color: "#2563eb" }}>{examState.score} / {cards.length}</strong>.
              </p>
              
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <button 
                  onClick={reset}
                  style={{ 
                    padding: "16px 24px", borderRadius: 16, background: "white", border: "2px solid #e2e8f0", 
                    color: "#1e293b", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 
                  }}
                >
                  <RotateCcw size={20} />
                  Repetir
                </button>
                <button 
                  onClick={onClose}
                  style={{ 
                    padding: "16px 40px", borderRadius: 16, background: "#2563eb", color: "white", 
                    border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" 
                  }}
                >
                  Finalizar Repaso
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <style jsx global>{`
        body {
          overflow: hidden !important;
        }
      `}</style>
    </motion.div>
  )
}
