"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Zap,
  BookOpen,
  Brain,
  Star,
  ArrowRight,
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

// ── Animated Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? score / total : 0
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circumference)
  useEffect(() => {
    const t = setTimeout(() => setOffset(circumference * (1 - pct)), 300)
    return () => clearTimeout(t)
  }, [pct, circumference])
  const color = pct >= 0.8 ? "#10b981" : pct >= 0.5 ? "#f59e0b" : "#ef4444"
  return (
    <div style={{ position: "relative", width: 136, height: 136, margin: "0 auto" }}>
      <svg width={136} height={136} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={68} cy={68} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} />
        <circle
          cx={68}
          cy={68}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)", filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>de {total}</span>
      </div>
    </div>
  )
}

export default function FlashcardActivity({ cards, onClose, title = "Repaso de Conceptos" }: FlashcardActivityProps) {
  const [mode, setMode] = useState<Mode>("review")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [examAnswers, setExamAnswers] = useState<Record<number, boolean>>({})
  const [shuffledOptions, setShuffledOptions] = useState<string[][]>([])
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const scoreRef = useRef(0)
  
  // Rule Enforcement: Max 200 characters per definition
  useEffect(() => {
    cards.forEach(card => {
      if (card.definition.length > 200) {
        console.warn(`[REGLA DE ORO] La flashcard "${card.concept}" excede los 200 caracteres (${card.definition.length}).`);
      }
    });
  }, [cards])

  // Prepare exam options
  useEffect(() => {
    if (mode === "exam") {
      const opts = cards.map((card, idx) => {
        const others = cards.filter((_, i) => i !== idx).map((c) => c.definition)
        const randomOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3)
        return [card.definition, ...randomOthers].sort(() => 0.5 - Math.random())
      })
      setShuffledOptions(opts)
      setExamAnswers({})
      scoreRef.current = 0
      setCurrentIndex(0)
    }
  }, [mode, cards])

  const currentCard = cards[currentIndex]
  const progress = (currentIndex + 1) / cards.length
  const examScore = Object.values(examAnswers).filter(Boolean).length

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((p) => p + 1)
      setIsFlipped(false)
    } else if (mode === "review") {
      setMode("exam")
    } else {
      setMode("result")
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped((f) => !f)
    playFlipSound()
    haptic.light()
  }

  const handleAnswer = (definition: string) => {
    if (examAnswers[currentIndex] !== undefined) return
    const isCorrect = definition === currentCard.definition
    if (isCorrect) { playCorrectSound(); haptic.success() }
    else { playIncorrectSound(); haptic.error() }

    setLastAnswerCorrect(isCorrect)
    setFeedbackVisible(true)
    setExamAnswers((prev) => ({ ...prev, [currentIndex]: isCorrect }))

    setTimeout(() => {
      setFeedbackVisible(false)
      setTimeout(() => {
        if (currentIndex < cards.length - 1) setCurrentIndex((p) => p + 1)
        else setMode("result")
      }, 200)
    }, 700)
  }

  const reset = () => {
    setMode("review")
    setCurrentIndex(0)
    setIsFlipped(false)
    setExamAnswers({})
    setShuffledOptions([])
    scoreRef.current = 0
  }

  const modeLabel = mode === "review" ? "Repaso" : mode === "exam" ? "Examen" : "Resultados"
  const modeColor = mode === "review" ? "#3b82f6" : mode === "exam" ? "#8b5cf6" : "#10b981"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f2027 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      {/* ── Header ── */}
      <div style={{
        padding: "20px 24px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: `${modeColor}22`, border: `1.5px solid ${modeColor}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {mode === "review" ? <BookOpen size={18} color={modeColor} /> : mode === "exam" ? <Brain size={18} color={modeColor} /> : <Trophy size={18} color={modeColor} />}
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{title}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: modeColor, boxShadow: `0 0 6px ${modeColor}` }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{modeLabel}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={16} color="rgba(255,255,255,0.7)" />
        </button>
      </div>

      {/* ── Progress bar ── */}
      {mode !== "result" && (
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", position: "relative", zIndex: 2 }}>
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "100%", background: `linear-gradient(90deg, ${modeColor}, ${modeColor}cc)`, boxShadow: `0 0 8px ${modeColor}` }}
          />
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", position: "relative", zIndex: 1 }}>
        
        {/* Card counter pill */}
        {mode !== "result" && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 20,
              padding: "6px 16px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.05em",
            }}
          >
            {currentIndex + 1} / {cards.length}
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* ────────── REVIEW MODE ────────── */}
          {mode === "review" && (
            <motion.div
              key={`review-${currentIndex}`}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ width: "100%", maxWidth: 560 }}
            >
              {/* Flip card */}
              <div
                onClick={handleFlip}
                style={{
                  width: "100%",
                  height: "clamp(260px, 42vh, 360px)",
                  perspective: 1200,
                  cursor: "pointer",
                  marginBottom: 28,
                }}
              >
                <div style={{
                  width: "100%", height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}>
                  {/* Front */}
                  <div style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 28,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 40, textAlign: "center",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                  }}>
                    <BookOpen size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 20 }} />
                    <h3 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>{currentCard.concept}</h3>
                    <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <RotateCcw size={12} color="rgba(255,255,255,0.5)" />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Toca para revelar</span>
                    </div>
                  </div>

                  {/* Back */}
                  <div style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "linear-gradient(145deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.2) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1.5px solid rgba(99,179,237,0.25)",
                    borderRadius: 28,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 40, textAlign: "center",
                    boxShadow: "0 24px 60px rgba(59,130,246,0.2)",
                  }}>
                    <Lightbulb size={40} color="rgba(147,197,253,0.4)" style={{ marginBottom: 20 }} />
                    <p style={{ fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 500, lineHeight: 1.65, margin: 0, color: "#e0f2fe" }}>{currentCard.definition}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                    opacity: currentIndex === 0 ? 0.3 : 1,
                  }}
                >
                  <ChevronLeft size={22} color="white" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  style={{
                    flex: 1, maxWidth: 280, padding: "14px 24px", borderRadius: 18,
                    background: currentIndex === cards.length - 1
                      ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                      : "linear-gradient(135deg, #3b82f6, #2563eb)",
                    border: "none", color: "white",
                    fontSize: 15, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: currentIndex === cards.length - 1
                      ? "0 8px 24px rgba(139,92,246,0.4)"
                      : "0 8px 24px rgba(59,130,246,0.35)",
                  }}
                >
                  {currentIndex === cards.length - 1 ? (
                    <><Brain size={18} />Ir al Examen</>
                  ) : (
                    <>Siguiente<ChevronRight size={18} /></>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ────────── EXAM MODE ────────── */}
          {mode === "exam" && (
            <motion.div
              key={`exam-${currentIndex}`}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ width: "100%", maxWidth: 560 }}
            >
              <div style={{ marginBottom: 24, textAlign: "center" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 14px", borderRadius: 99,
                  background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
                  marginBottom: 14,
                }}>
                  <Zap size={12} color="#a78bfa" fill="#a78bfa" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Modo Examen</span>
                </div>
                <h3 style={{ fontSize: "clamp(20px, 3.5vw, 26px)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.3 }}>
                  ¿Cuál es la definición de{" "}
                  <span style={{ color: "#a78bfa" }}>&ldquo;{currentCard.concept}&rdquo;</span>?
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {shuffledOptions[currentIndex]?.map((opt, i) => {
                  const answered = examAnswers[currentIndex] !== undefined
                  const isCorrect = opt === currentCard.definition
                  const wasSelected = answered && examAnswers[currentIndex] === isCorrect && isCorrect
                  const wasWrong = answered && !isCorrect && examAnswers[currentIndex] === false

                  let bg = "rgba(255,255,255,0.05)"
                  let border = "rgba(255,255,255,0.08)"
                  let textColor = "rgba(255,255,255,0.85)"

                  if (answered) {
                    if (isCorrect) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; textColor = "#6ee7b7" }
                    else { bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.2)"; textColor = "rgba(255,255,255,0.3)" }
                  }

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => !answered && handleAnswer(opt)}
                      style={{
                        width: "100%", padding: "16px 20px",
                        borderRadius: 18, textAlign: "left",
                        fontSize: 15, fontWeight: 500, lineHeight: 1.5,
                        cursor: answered ? "default" : "pointer",
                        border: `1.5px solid ${border}`,
                        background: bg, color: textColor,
                        display: "flex", alignItems: "center", gap: 14,
                        backdropFilter: "blur(10px)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: answered && isCorrect ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                        border: `1.5px solid ${border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 800, color: answered && isCorrect ? "#10b981" : "rgba(255,255,255,0.4)",
                      }}>
                        {answered && isCorrect ? <CheckCircle2 size={16} color="#10b981" /> :
                         answered && !isCorrect ? <span style={{ opacity: 0.3 }}>{["A","B","C","D"][i]}</span> :
                         ["A","B","C","D"][i]}
                      </div>
                      {opt}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ────────── RESULT MODE ────────── */}
          {mode === "result" && (
            <motion.div
              key="result"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", maxWidth: 440, textAlign: "center" }}
            >
              {/* Score ring */}
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }} style={{ marginBottom: 28 }}>
                <ScoreRing score={examScore} total={cards.length} />
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
                {examScore === cards.length ? "¡Perfecto!" : examScore >= cards.length * 0.7 ? "¡Excelente trabajo!" : "¡Buen esfuerzo!"}
              </motion.h2>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "0 0 36px" }}>
                Dominaste <strong style={{ color: "#fff" }}>{examScore}</strong> de{" "}
                <strong style={{ color: "#fff" }}>{cards.length}</strong> conceptos
              </motion.p>

              {/* Stars */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 36 }}>
                {[1, 2, 3].map((i) => {
                  const filled = i <= Math.ceil((examScore / cards.length) * 3)
                  return (
                    <motion.div key={i} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 + i * 0.12 }}>
                      <Star size={36} color={filled ? "#f59e0b" : "rgba(255,255,255,0.15)"} fill={filled ? "#f59e0b" : "transparent"} strokeWidth={2} />
                    </motion.div>
                  )
                })}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={reset}
                  style={{
                    padding: "13px 22px", borderRadius: 16,
                    background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <RotateCcw size={16} />Repetir
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: "13px 28px", borderRadius: 16,
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none",
                    color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 8px 24px rgba(59,130,246,0.4)",
                  }}
                >
                  Cerrar<ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Feedback flash overlay ── */}
      <AnimatePresence>
        {feedbackVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed", inset: 0, zIndex: 20,
              background: lastAnswerCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              pointerEvents: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {lastAnswerCorrect
                ? <CheckCircle2 size={80} color="#10b981" style={{ filter: "drop-shadow(0 0 20px #10b981)" }} />
                : <XCircle size={80} color="#ef4444" style={{ filter: "drop-shadow(0 0 20px #ef4444)" }} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`body { overflow: hidden !important; }`}</style>
    </motion.div>
  )
}
