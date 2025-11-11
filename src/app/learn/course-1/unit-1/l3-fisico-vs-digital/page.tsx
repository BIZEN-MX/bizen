"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

// Light sound effects using Web Audio API
const playSound = (soundName: string, volume = 0.3) => {
  if (typeof window !== 'undefined') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (soundName === 'click') {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } else if (soundName === 'success') {
        const notes = [523.25, 659.25, 783.99]
        notes.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          oscillator.frequency.value = freq
          oscillator.type = 'sine'
          const startTime = audioContext.currentTime + (index * 0.1)
          gainNode.gain.setValueAtTime(volume * 0.4, startTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
          oscillator.start(startTime)
          oscillator.stop(startTime + 0.3)
        })
      } else if (soundName === 'error') {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2)
        oscillator.type = 'sawtooth'
        gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
      }
    } catch (e) {
      // Silently fail if audio doesn't work
    }
  }
}

interface CardProps {
  onComplete: () => void
  onXpEarned: (xp: number) => void
}

// CARD 1: Context (Intro)
function Card1({ onComplete }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
        textAlign: "center"
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontSize: 80,
          marginBottom: 32
        }}
      >
        💵💳
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          fontSize: 32,
          fontWeight: 800,
          background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 24
        }}
      >
        Dinero físico vs dinero digital
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{
          fontSize: 18,
          color: "#374151",
          lineHeight: 1.6,
          marginBottom: 40
        }}
      >
        Hoy usamos dos formas principales: dinero físico (efectivo/monedas) y dinero digital (tarjetas, transferencias, apps).
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          playSound('click')
          onComplete()
        }}
        style={{
          padding: "16px 48px",
          background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
        }}
      >
        Continuar
      </motion.button>
    </motion.div>
  )
}

// CARD 2: What is "support"? (Single choice)
function Card2({ onComplete, onXpEarned }: CardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const options = [
    { text: "Físico = papel/metal; Digital = saldo en un sistema", correct: true },
    { text: "Físico = fotos; Digital = oro", correct: false },
    { text: "Físico = nube; Digital = madera", correct: false }
  ]

  const handleSelect = (index: number) => {
    if (showFeedback) return
    playSound('click')
    setSelected(index)
    setIsCorrect(options[index].correct)
    setShowFeedback(true)
    if (options[index].correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        ¿Qué "soporte" describe mejor cada forma?
      </motion.h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={showFeedback}
            style={{
              padding: "20px",
              background: selected === index 
                ? (isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")
                : "white",
              border: selected === index
                ? (isCorrect ? "2px solid #10B981" : "2px solid #EF4444")
                : "2px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 16,
              color: "#1F2937",
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.2s ease"
            }}
          >
            {option.text}
          </motion.button>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            padding: "16px",
            background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: isCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}>
            <p style={{ margin: 0, color: isCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
              {isCorrect ? "¡Bien hecho! Correcto. Físico es objeto; digital es registro/saldo." : "Casi. Intenta otra vez."}
            </p>
          </div>

          {isCorrect && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playSound('click')
                onComplete()
              }}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
              }}
            >
              Continuar
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// CARD 3: Match (Drag-match pairs)
function Card3({ onComplete, onXpEarned }: CardProps) {
  const [matches, setMatches] = useState<{[key: string]: string}>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)

  const pairs = {
    "Billete/moneda": "Se entrega físicamente",
    "Transferencia": "Mueve saldos entre cuentas",
    "Tarjeta": "Autoriza un cargo electrónico"
  }

  const leftItems = Object.keys(pairs)
  const rightItems = Object.values(pairs).sort(() => Math.random() - 0.5)

  const handleLeftClick = (item: string) => {
    playSound('click')
    setSelectedLeft(item)
  }

  const handleRightClick = (item: string) => {
    if (!selectedLeft) return
    playSound('click')
    setMatches({...matches, [selectedLeft]: item})
    setSelectedLeft(null)
  }

  const checkAnswers = () => {
    playSound('click')
    const correct = Object.keys(pairs).every(key => matches[key] === pairs[key])
    if (correct) {
      playSound('success')
      onXpEarned(10)
      setShowFeedback(true)
    } else {
      playSound('error')
      alert("Casi. Revisa las conexiones.")
    }
  }

  const isComplete = Object.keys(matches).length === Object.keys(pairs).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto"
      }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        Conecta cada forma con su característica
      </motion.h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {leftItems.map((item, index) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLeftClick(item)}
              style={{
                padding: "16px",
                background: selectedLeft === item ? "#0B71FE" : (matches[item] ? "#10B981" : "white"),
                color: (selectedLeft === item || matches[item]) ? "white" : "#1F2937",
                border: "2px solid #E5E7EB",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              {item}
            </motion.button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rightItems.map((item, index) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRightClick(item)}
              disabled={!selectedLeft}
              style={{
                padding: "16px",
                background: Object.values(matches).includes(item) ? "#10B981" : "white",
                color: Object.values(matches).includes(item) ? "white" : "#1F2937",
                border: "2px solid #E5E7EB",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedLeft ? "pointer" : "default",
                textAlign: "left",
                opacity: selectedLeft ? 1 : 0.6
              }}
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>

      {!showHint && (
        <button
          onClick={() => {
            playSound('click')
            setShowHint(true)
          }}
          style={{
            padding: "8px 16px",
            background: "transparent",
            color: "#0B71FE",
            border: "1px solid #0B71FE",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 16
          }}
        >
          Muéstrame una pista
        </button>
      )}

      {showHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "12px",
            background: "rgba(11, 113, 254, 0.1)",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            color: "#0B71FE"
          }}
        >
          Pista: Piensa en cómo 'se mueve' el valor.
        </motion.div>
      )}

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "16px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "2px solid #10B981",
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <p style={{ margin: 0, color: "#059669", fontWeight: 600 }}>
            ¡Bien hecho! Objeto vs. autorización electrónica.
          </p>
        </motion.div>
      )}

      {isComplete && !showFeedback && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkAnswers}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Verificar respuestas
        </motion.button>
      )}

      {showFeedback && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playSound('click')
            onComplete()
          }}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Continuar
        </motion.button>
      )}
    </motion.div>
  )
}

// CARD 4: Costs & speed (True/False)
function Card4({ onComplete, onXpEarned }: CardProps) {
  const [answers, setAnswers] = useState<{[key: number]: boolean | null}>({ 0: null, 1: null })
  const [showFeedback, setShowFeedback] = useState(false)
  const [allCorrect, setAllCorrect] = useState(false)

  const questions = [
    { text: "Un pago en efectivo no requiere red ni banco.", correct: true },
    { text: "Una transferencia funciona sin internet.", correct: false }
  ]

  const handleAnswer = (index: number, answer: boolean) => {
    if (showFeedback) return
    playSound('click')
    setAnswers({...answers, [index]: answer})
  }

  const checkAnswers = () => {
    playSound('click')
    const correct = questions.every((q, i) => answers[i] === q.correct)
    setAllCorrect(correct)
    setShowFeedback(true)
    if (correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  const isComplete = Object.values(answers).every(a => a !== null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        ¿Verdadero o Falso?
      </motion.h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
            style={{
              padding: "20px",
              background: "white",
              border: "2px solid #E5E7EB",
              borderRadius: 12
            }}
          >
            <p style={{ marginBottom: 16, fontSize: 16, color: "#1F2937", fontWeight: 600 }}>
              {question.text}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleAnswer(index, true)}
                disabled={showFeedback}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: answers[index] === true ? "#10B981" : "white",
                  color: answers[index] === true ? "white" : "#1F2937",
                  border: "2px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: showFeedback ? "default" : "pointer"
                }}
              >
                Verdadero
              </button>
              <button
                onClick={() => handleAnswer(index, false)}
                disabled={showFeedback}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: answers[index] === false ? "#EF4444" : "white",
                  color: answers[index] === false ? "white" : "#1F2937",
                  border: "2px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: showFeedback ? "default" : "pointer"
                }}
              >
                Falso
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "16px",
            background: allCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: allCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <p style={{ margin: 0, color: allCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
            {allCorrect ? "¡Exacto! Efectivo va offline; digital necesita red." : "Casi. Intenta otra vez."}
          </p>
        </motion.div>
      )}

      {isComplete && !showFeedback && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkAnswers}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Verificar respuestas
        </motion.button>
      )}

      {showFeedback && allCorrect && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playSound('click')
            onComplete()
          }}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Continuar
        </motion.button>
      )}
    </motion.div>
  )
}

// CARD 5: Scenario (Payment to friend in another city)
function Card5({ onComplete, onXpEarned }: CardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const options = [
    { text: "Efectivo", correct: false },
    { text: "Transferencia digital", correct: true },
    { text: "Monedas antiguas", correct: false }
  ]

  const handleSelect = (index: number) => {
    if (showFeedback) return
    playSound('click')
    setSelected(index)
    setIsCorrect(options[index].correct)
    setShowFeedback(true)
    if (options[index].correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 60,
          textAlign: "center",
          marginBottom: 24
        }}
      >
        🌍💸
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 16,
          textAlign: "center"
        }}
      >
        Debes pagar a un amigo que está en otra ciudad
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          fontSize: 16,
          color: "#6B7280",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        ¿Qué es lo mejor?
      </motion.p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={showFeedback}
            style={{
              padding: "20px",
              background: selected === index 
                ? (isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")
                : "white",
              border: selected === index
                ? (isCorrect ? "2px solid #10B981" : "2px solid #EF4444")
                : "2px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 16,
              color: "#1F2937",
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.2s ease"
            }}
          >
            {option.text}
          </motion.button>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            padding: "16px",
            background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: isCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}>
            <p style={{ margin: 0, color: isCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
              {isCorrect ? "¡Correcto! Digital permite pagos a distancia." : "Casi. Intenta otra vez."}
            </p>
          </div>

          {isCorrect && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playSound('click')
                onComplete()
              }}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
              }}
            >
              Continuar
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// CARD 6: Risk types (Multi-select)
function Card6({ onComplete, onXpEarned }: CardProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [allCorrect, setAllCorrect] = useState(false)

  const options = [
    { text: "Efectivo: pérdida o robo físico", correct: true },
    { text: "Digital: fraude/engañar para que compartas datos", correct: true },
    { text: "Digital: contraseña débil", correct: true },
    { text: "Efectivo: hackeo de servidor", correct: false }
  ]

  const handleToggle = (index: number) => {
    if (showFeedback) return
    playSound('click')
    setSelected(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const checkAnswers = () => {
    playSound('click')
    const correctIndices = options.map((opt, i) => opt.correct ? i : -1).filter(i => i !== -1)
    const correct = correctIndices.length === selected.length && 
      correctIndices.every(i => selected.includes(i))
    setAllCorrect(correct)
    setShowFeedback(true)
    if (correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        ¿Qué riesgos son más típicos de cada forma?
      </motion.h3>

      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, textAlign: "center" }}>
        Selecciona todas las correctas
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            onClick={() => handleToggle(index)}
            disabled={showFeedback}
            style={{
              padding: "20px",
              background: selected.includes(index) ? "rgba(11, 113, 254, 0.1)" : "white",
              border: selected.includes(index) ? "2px solid #0B71FE" : "2px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 16,
              color: "#1F2937",
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              border: "2px solid #0B71FE",
              background: selected.includes(index) ? "#0B71FE" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "white"
            }}>
              {selected.includes(index) && "✓"}
            </div>
            {option.text}
          </motion.button>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "16px",
            background: allCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: allCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <p style={{ margin: 0, color: allCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
            {allCorrect ? "¡Bien hecho! Cada forma tiene riesgos distintos." : "Casi. Intenta otra vez."}
          </p>
        </motion.div>
      )}

      {selected.length > 0 && !showFeedback && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkAnswers}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Verificar respuestas
        </motion.button>
      )}

      {showFeedback && allCorrect && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playSound('click')
            onComplete()
          }}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Continuar
        </motion.button>
      )}
    </motion.div>
  )
}

// CARD 7: Traceability (Single choice)
function Card7({ onComplete, onXpEarned }: CardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const options = [
    { text: "Efectivo", correct: false },
    { text: "Dinero digital", correct: true }
  ]

  const handleSelect = (index: number) => {
    if (showFeedback) return
    playSound('click')
    setSelected(index)
    setIsCorrect(options[index].correct)
    setShowFeedback(true)
    if (options[index].correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 60,
          textAlign: "center",
          marginBottom: 24
        }}
      >
        🔍📊
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        ¿Cuál suele ser más rastreable?
      </motion.h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={showFeedback}
            style={{
              padding: "20px",
              background: selected === index 
                ? (isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")
                : "white",
              border: selected === index
                ? (isCorrect ? "2px solid #10B981" : "2px solid #EF4444")
                : "2px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 16,
              color: "#1F2937",
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.2s ease"
            }}
          >
            {option.text}
          </motion.button>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            padding: "16px",
            background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: isCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}>
            <p style={{ margin: 0, color: isCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
              {isCorrect ? "¡Correcto! Digital deja registro; efectivo, no siempre." : "Casi. Intenta otra vez."}
            </p>
          </div>

          {isCorrect && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playSound('click')
                onComplete()
              }}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
              }}
            >
              Continuar
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// CARD 8: Fees & small purchases (Order)
function Card8({ onComplete, onXpEarned }: CardProps) {
  const [items, setItems] = useState([
    "Efectivo bien contado",
    "Tarjeta contactless",
    "Transferencia con referencia larga"
  ])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const correctOrder = [
    "Efectivo bien contado",
    "Tarjeta contactless",
    "Transferencia con referencia larga"
  ]

  const moveUp = (index: number) => {
    if (index === 0) return
    playSound('click')
    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    setItems(newItems)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    playSound('click')
    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    setItems(newItems)
  }

  const checkOrder = () => {
    playSound('click')
    const correct = items.every((item, i) => item === correctOrder[i])
    setIsCorrect(correct)
    setShowFeedback(true)
    if (correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 16,
          textAlign: "center"
        }}
      >
        Ordena según conveniencia
      </motion.h3>

      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32, textAlign: "center" }}>
        Del más conveniente al menos conveniente para compras pequeñas y rápidas en persona
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {items.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
            style={{
              padding: "16px 20px",
              background: "white",
              border: "2px solid #E5E7EB",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700
              }}>
                {index + 1}
              </div>
              <span style={{ fontSize: 16, color: "#1F2937", fontWeight: 600 }}>{item}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0 || showFeedback}
                style={{
                  padding: "8px 12px",
                  background: index === 0 ? "#F3F4F6" : "#0B71FE",
                  color: index === 0 ? "#9CA3AF" : "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: index === 0 || showFeedback ? "default" : "pointer",
                  fontSize: 18,
                  fontWeight: 700
                }}
              >
                ↑
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1 || showFeedback}
                style={{
                  padding: "8px 12px",
                  background: index === items.length - 1 ? "#F3F4F6" : "#0B71FE",
                  color: index === items.length - 1 ? "#9CA3AF" : "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: index === items.length - 1 || showFeedback ? "default" : "pointer",
                  fontSize: 18,
                  fontWeight: 700
                }}
              >
                ↓
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "16px",
            background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: isCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <p style={{ margin: 0, color: isCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
            {isCorrect ? "¡Exacto! Efectivo es ágil; contactless también; transferencias pueden tardar." : "Casi. Intenta otra vez."}
          </p>
        </motion.div>
      )}

      {!showFeedback && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkOrder}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Verificar orden
        </motion.button>
      )}

      {showFeedback && isCorrect && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playSound('click')
            onComplete()
          }}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Continuar
        </motion.button>
      )}
    </motion.div>
  )
}

// CARD 9: Offline vs Online (Scenario)
function Card9({ onComplete, onXpEarned }: CardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const options = [
    { text: "Efectivo (billetes/monedas)", correct: true },
    { text: "Transferencia en app", correct: false },
    { text: "Pago con tarjeta en POS sin batería", correct: false }
  ]

  const handleSelect = (index: number) => {
    if (showFeedback) return
    playSound('click')
    setSelected(index)
    setIsCorrect(options[index].correct)
    setShowFeedback(true)
    if (options[index].correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 60,
          textAlign: "center",
          marginBottom: 24
        }}
      >
        🔌❌
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 16,
          textAlign: "center"
        }}
      >
        No hay internet ni electricidad
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          fontSize: 16,
          color: "#6B7280",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        ¿Qué sigue funcionando?
      </motion.p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={showFeedback}
            style={{
              padding: "20px",
              background: selected === index 
                ? (isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")
                : "white",
              border: selected === index
                ? (isCorrect ? "2px solid #10B981" : "2px solid #EF4444")
                : "2px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 16,
              color: "#1F2937",
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.2s ease"
            }}
          >
            {option.text}
          </motion.button>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            padding: "16px",
            background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: isCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}>
            <p style={{ margin: 0, color: isCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
              {isCorrect ? "¡Correcto! Efectivo funciona sin red." : "Casi. Intenta otra vez."}
            </p>
          </div>

          {isCorrect && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playSound('click')
                onComplete()
              }}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
              }}
            >
              Continuar
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// CARD 10: Security hygiene (Multi-select)
function Card10({ onComplete, onXpEarned }: CardProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [allCorrect, setAllCorrect] = useState(false)

  const options = [
    { text: "Usar 2FA y contraseñas fuertes", correct: true },
    { text: "No compartir códigos por mensaje", correct: true },
    { text: "Revisar el comercio y la URL", correct: true },
    { text: "Anotar PIN en el reverso de la tarjeta", correct: false }
  ]

  const handleToggle = (index: number) => {
    if (showFeedback) return
    playSound('click')
    setSelected(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const checkAnswers = () => {
    playSound('click')
    const correctIndices = options.map((opt, i) => opt.correct ? i : -1).filter(i => i !== -1)
    const correct = correctIndices.length === selected.length && 
      correctIndices.every(i => selected.includes(i))
    setAllCorrect(correct)
    setShowFeedback(true)
    if (correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 60,
          textAlign: "center",
          marginBottom: 24
        }}
      >
        🔒🛡️
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        Buenas prácticas para pagos digitales
      </motion.h3>

      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, textAlign: "center" }}>
        Selecciona todas las correctas
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            onClick={() => handleToggle(index)}
            disabled={showFeedback}
            style={{
              padding: "20px",
              background: selected.includes(index) ? "rgba(11, 113, 254, 0.1)" : "white",
              border: selected.includes(index) ? "2px solid #0B71FE" : "2px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 16,
              color: "#1F2937",
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              border: "2px solid #0B71FE",
              background: selected.includes(index) ? "#0B71FE" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "white"
            }}>
              {selected.includes(index) && "✓"}
            </div>
            {option.text}
          </motion.button>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "16px",
            background: allCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: allCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <p style={{ margin: 0, color: allCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
            {allCorrect ? "¡Bien hecho! Seguridad primero." : "Casi. Intenta otra vez."}
          </p>
        </motion.div>
      )}

      {selected.length > 0 && !showFeedback && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkAnswers}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Verificar respuestas
        </motion.button>
      )}

      {showFeedback && allCorrect && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playSound('click')
            onComplete()
          }}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
          }}
        >
          Continuar
        </motion.button>
      )}
    </motion.div>
  )
}

// CARD 11: Use case (Single choice)
function Card11({ onComplete, onXpEarned }: CardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const options = [
    { text: "Efectivo", correct: false },
    { text: "Pago digital (tarjeta o wallet)", correct: true },
    { text: "Trueque", correct: false }
  ]

  const handleSelect = (index: number) => {
    if (showFeedback) return
    playSound('click')
    setSelected(index)
    setIsCorrect(options[index].correct)
    setShowFeedback(true)
    if (options[index].correct) {
      playSound('success')
      onXpEarned(10)
    } else {
      playSound('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontSize: 60,
          textAlign: "center",
          marginBottom: 24
        }}
      >
        🌐🛒
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 16,
          textAlign: "center"
        }}
      >
        Compra internacional en línea
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          fontSize: 16,
          color: "#6B7280",
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        ¿Qué conviene?
      </motion.p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={showFeedback}
            style={{
              padding: "20px",
              background: selected === index 
                ? (isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")
                : "white",
              border: selected === index
                ? (isCorrect ? "2px solid #10B981" : "2px solid #EF4444")
                : "2px solid #E5E7EB",
              borderRadius: 12,
              fontSize: 16,
              color: "#1F2937",
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.2s ease"
            }}
          >
            {option.text}
          </motion.button>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            padding: "16px",
            background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: isCorrect ? "2px solid #10B981" : "2px solid #EF4444",
            borderRadius: 12,
            marginBottom: 24
          }}>
            <p style={{ margin: 0, color: isCorrect ? "#059669" : "#DC2626", fontWeight: 600 }}>
              {isCorrect ? "¡Correcto! Digital habilita e-commerce global." : "Casi. Intenta otra vez."}
            </p>
          </div>

          {isCorrect && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playSound('click')
                onComplete()
              }}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
              }}
            >
              Continuar
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// CARD 12: Summary + badge
function Card12({ onComplete, onXpEarned }: CardProps) {
  useEffect(() => {
    onXpEarned(30) // Bonus XP for completion
  }, [onXpEarned])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
        textAlign: "center"
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          marginBottom: 32,
          boxShadow: "0 8px 32px rgba(251, 191, 36, 0.4)"
        }}
      >
        🧭
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{
          fontSize: 32,
          fontWeight: 800,
          background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 16
        }}
      >
        ¡Lección completada!
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        style={{
          padding: "24px",
          background: "rgba(11, 113, 254, 0.05)",
          borderRadius: 16,
          marginBottom: 32,
          width: "100%"
        }}
      >
        <div style={{
          padding: "16px 24px",
          background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
          borderRadius: 12,
          marginBottom: 24,
          boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)"
        }}>
          <p style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "white"
          }}>
            🏆 Insignia desbloqueada: Navegante del Dinero
          </p>
        </div>

        <h3 style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#1F2937",
          marginBottom: 16
        }}>
          Resumen clave:
        </h3>

        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          textAlign: "left"
        }}>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start"
            }}
          >
            <span style={{ fontSize: 24 }}>💵</span>
            <p style={{ margin: 0, fontSize: 16, color: "#374151", lineHeight: 1.6 }}>
              Físico: objeto en mano; útil offline y en efectivo.
            </p>
          </motion.li>

          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start"
            }}
          >
            <span style={{ fontSize: 24 }}>💳</span>
            <p style={{ margin: 0, fontSize: 16, color: "#374151", lineHeight: 1.6 }}>
              Digital: registros; útil a distancia, trazable y escalable.
            </p>
          </motion.li>

          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start"
            }}
          >
            <span style={{ fontSize: 24 }}>🎯</span>
            <p style={{ margin: 0, fontSize: 16, color: "#374151", lineHeight: 1.6 }}>
              Elige según contexto: cercanía, red, seguridad y costo.
            </p>
          </motion.li>
        </ul>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          playSound('success')
          onComplete()
        }}
        style={{
          padding: "16px 48px",
          background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)"
        }}
      >
        Continuar a la siguiente lección
      </motion.button>
    </motion.div>
  )
}

// Main Lesson Component
export default function L3FisicoVsDigitalPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentCard, setCurrentCard] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [hearts, setHearts] = useState(3)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  const handleCardComplete = () => {
    if (currentCard < 11) { // We have 12 cards (0-11)
      setCurrentCard(currentCard + 1)
    } else {
      // Lesson complete
      awardFinalXP()
    }
  }

  const handleXpEarned = (xp: number) => {
    setTotalXP(totalXP + xp)
  }

  const awardFinalXP = async () => {
    const finalXP = totalXP + 100
    try {
      await fetch('/api/user/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpAmount: finalXP, reason: 'L3 completion' })
      })
    } catch (error) {
      console.error('Error awarding XP:', error)
    }
    router.push('/courses')
  }

  if (loading || !user) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Montserrat, sans-serif"
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      fontFamily: "Montserrat, sans-serif",
      paddingRight: "320px" // Space for sidebar
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 40px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}>
            Tarjeta {currentCard + 1} de 12
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                fontSize: 24,
                opacity: i < hearts ? 1 : 0.3
              }}>
                ❤️
              </div>
            ))}
          </div>
          <div style={{
            padding: "8px 16px",
            background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 700,
            color: "white"
          }}>
            {totalXP} XP
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <AnimatePresence mode="wait">
          {currentCard === 0 && <Card1 key="card1" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 1 && <Card2 key="card2" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 2 && <Card3 key="card3" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 3 && <Card4 key="card4" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 4 && <Card5 key="card5" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 5 && <Card6 key="card6" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 6 && <Card7 key="card7" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 7 && <Card8 key="card8" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 8 && <Card9 key="card9" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 9 && <Card10 key="card10" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 10 && <Card11 key="card11" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
          {currentCard === 11 && <Card12 key="card12" onComplete={handleCardComplete} onXpEarned={handleXpEarned} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

