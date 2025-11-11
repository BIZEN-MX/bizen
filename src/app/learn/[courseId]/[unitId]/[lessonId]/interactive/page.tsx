"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

// Utility function to play sound with Web Audio API for better sound quality
const playSound = (soundName: string, volume = 0.3) => {
  if (typeof window !== 'undefined') {
    try {
      // Use Web Audio API to synthesize sounds
      if (soundName === 'click') {
        // Synthesize a satisfying click sound
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioContext = new AudioContextClass()
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
      } else if (soundName === 'success' || soundName === 'celebration') {
        // Synthesize a celebration sound (ascending notes)
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioContext = new AudioContextClass()
        const notes = [523.25, 659.25, 783.99] // C, E, G
        
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
      } else if (soundName === 'error' || soundName === 'wrong') {
        // Synthesize an error sound (descending note)
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioContext = new AudioContextClass()
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
      } else if (soundName === 'ding') {
        // Synthesize a ding sound
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioContext = new AudioContextClass()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 1000
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(volume * 0.4, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }
    } catch {
      // Silently fail if audio doesn't work
    }
  }
}

// Card 1: Setting the scene
interface CardProps {
  onComplete: () => void;
}

function Card1({ onComplete }: CardProps) {
  const [showNarration, setShowNarration] = useState(false)
  const [narrationVisible, setNarrationVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showIntroButton, setShowIntroButton] = useState(false)

  useEffect(() => {
    // Show continue button on intro screen after 2 seconds
    const timer1 = setTimeout(() => {
      setShowIntroButton(true)
    }, 2000)

    return () => clearTimeout(timer1)
  }, [])

  useEffect(() => {
    if (showNarration) {
      // Fade in narration text
      const timer2 = setTimeout(() => {
        setNarrationVisible(true)
        setShowContent(true)
      }, 500)
      return () => clearTimeout(timer2)
    }
  }, [showNarration])

  const handleIntroClick = () => {
    playSound('click')
    setShowNarration(true)
  }

  const handleContinue = () => {
    playSound('click')
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Enhanced Animated Background */}
      <motion.div
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: showNarration ? 0.12 : 0.18,
        }}
        transition={{ duration: 4, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(15, 98, 254, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, rgba(15, 98, 254, 0.08) 0%, rgba(96, 165, 250, 0.08) 100%)
          `,
          filter: "blur(8px)"
        }}
      />


      {/* Intro Title - Fits viewport with fixed button */}
      {!showNarration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5, type: "spring", stiffness: 100 }}
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 40px",
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            marginRight: "160px" // Account for right sidebar (320px / 2)
          }}
        >
          {/* Enhanced Title with Background - Compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
            style={{
              marginBottom: 24,
              padding: "32px 40px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
              borderRadius: 24,
              border: "3px solid rgba(15, 98, 254, 0.3)",
              boxShadow: "0 12px 48px rgba(15, 98, 254, 0.2)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative top bar */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #0F62FE, #3B82F6, #0F62FE)",
              backgroundSize: "200% 100%",
              animation: "shimmerBar 3s linear infinite"
            }} />

          <motion.div
            animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
                fontSize: "clamp(42px, 8vw, 72px)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 50%, #0F62FE 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
                marginBottom: 16,
              fontFamily: "Montserrat, sans-serif",
                lineHeight: 1.1,
                letterSpacing: "-0.03em"
            }}
          >
            Historia del Dinero
          </motion.div>
          
          <motion.div
              initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              display: "inline-block",
              padding: "12px 32px",
                background: "linear-gradient(135deg, #0F62FE, #3B82F6)",
                borderRadius: 14,
                fontSize: "clamp(16px, 2.2vw, 20px)",
                color: "#fff",
                fontWeight: 900,
              fontFamily: "Montserrat, sans-serif",
                boxShadow: "0 6px 24px rgba(15, 98, 254, 0.3)",
                letterSpacing: "0.05em"
            }}
          >
              LECCIÓN 1
          </motion.div>

            {/* Decorative subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
            style={{
                marginTop: 20,
                fontSize: "clamp(13px, 1.8vw, 16px)",
                color: "#6B7280",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: "0.02em"
            }}
          >
              ✨ Un viaje a través del tiempo ✨
            </motion.div>
          </motion.div>

          <style>{`
            @keyframes shimmerBar {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
          `}</style>

          {/* Fixed Intro Button at Bottom - Perfectly Centered */}
          {showIntroButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              style={{
                position: "fixed",
                bottom: 40,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                pointerEvents: "none"
              }}
            >
              <div style={{ pointerEvents: "auto" }}>
              <motion.button
                onClick={handleIntroClick}
                whileHover={{ 
                  scale: 1.08, 
                  boxShadow: "0 16px 48px rgba(15, 98, 254, 0.6)",
                  y: -4
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 8px 32px rgba(15, 98, 254, 0.4)",
                    "0 12px 48px rgba(15, 98, 254, 0.6)",
                    "0 8px 32px rgba(15, 98, 254, 0.4)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  padding: "20px 56px",
                  fontSize: "clamp(18px, 2.5vw, 22px)",
                  fontWeight: 900,
                  color: "#fff",
                  background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
                  border: "none",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  position: "relative",
                  overflow: "hidden",
                  letterSpacing: "0.02em"
                }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>Comenzar</span>
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "relative", zIndex: 2, fontSize: 26 }}
                >
                  →
                </motion.span>
                
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "200%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    zIndex: 1
                  }}
                />
              </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Enhanced Narration Card - Fits viewport perfectly */}
      <AnimatePresence>
        {showNarration && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: narrationVisible ? 1 : 0, 
              y: narrationVisible ? 0 : 50,
              scale: narrationVisible ? 1 : 0.9
            }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
            style={{
              position: "relative",
              zIndex: 3,
              maxWidth: 1000,
              width: "90%",
              padding: "32px clamp(24px, 4vw, 40px)",
              paddingBottom: 100, // Space for fixed button
              margin: "0 auto",
              marginRight: "160px", // Center content accounting for right sidebar (320px / 2)
              maxHeight: "calc(100vh - 140px)", // Account for button
              overflowY: "auto"
            }}
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                fontSize: "clamp(28px, 5vw, 40px)",
                fontWeight: 900,
                color: "#1E40AF",
                textAlign: "center",
                marginBottom: 32,
                letterSpacing: "-0.02em",
                textShadow: "0 2px 8px rgba(255, 255, 255, 0.9)"
              }}
            >
              El Inicio del Intercambio
            </motion.h2>

            {/* Barter scene illustration - Enhanced with Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              marginBottom: 32,
              maxWidth: 850,
              margin: "0 auto 32px"
            }}>
              {/* Trade 1: Pan <-> Sal */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30, scale: showContent ? 1 : 0.9 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -4 }}
                style={{
                  padding: "24px 20px",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
                  borderRadius: 20,
                  border: "3px solid rgba(245, 158, 11, 0.3)",
                  boxShadow: "0 8px 32px rgba(245, 158, 11, 0.15)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Accent bar */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: "linear-gradient(90deg, #F59E0B, #FBBF24)",
                  opacity: 0.6
                }} />

                <svg width="100%" height="110" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet" style={{ marginBottom: 12 }}>
                  {/* Bread */}
                  <g>
                    <ellipse cx="60" cy="50" rx="40" ry="30" fill="#D2691E" />
                    <ellipse cx="60" cy="46" rx="36" ry="26" fill="#F4A460" />
                    <ellipse cx="50" cy="42" rx="12" ry="8" fill="#DEB887" opacity="0.6" />
                    <ellipse cx="70" cy="44" rx="10" ry="6" fill="#DEB887" opacity="0.6" />
                    <ellipse cx="60" cy="40" rx="8" ry="5" fill="#DEB887" opacity="0.6" />
                    <text x="60" y="95" fontSize="18" textAnchor="middle" fill="#1F2937" fontWeight="900">Pan</text>
                  </g>
                  
                  {/* Exchange arrows */}
                  <g>
                    <path d="M 110 50 L 170 50" stroke="#F59E0B" strokeWidth="4" fill="none" />
                    <path d="M 170 50 L 162 44" stroke="#F59E0B" strokeWidth="4" fill="none" />
                    <path d="M 170 50 L 162 56" stroke="#F59E0B" strokeWidth="4" fill="none" />
                    <path d="M 170 50 L 110 50" stroke="#F59E0B" strokeWidth="4" fill="none" />
                    <path d="M 110 50 L 118 44" stroke="#F59E0B" strokeWidth="4" fill="none" />
                    <path d="M 110 50 L 118 56" stroke="#F59E0B" strokeWidth="4" fill="none" />
                  </g>
                  
                  {/* Salt */}
                  <g>
                    <rect x="200" y="30" width="40" height="48" rx="6" fill="#E8E8E8" />
                    <rect x="204" y="34" width="32" height="40" rx="5" fill="#FFFFFF" />
                    <circle cx="212" cy="46" r="2.5" fill="#CCCCCC" />
                    <circle cx="220" cy="46" r="2.5" fill="#CCCCCC" />
                    <circle cx="228" cy="46" r="2.5" fill="#CCCCCC" />
                    <circle cx="216" cy="54" r="2.5" fill="#CCCCCC" />
                    <circle cx="224" cy="54" r="2.5" fill="#CCCCCC" />
                    <circle cx="220" cy="62" r="2.5" fill="#CCCCCC" />
                    <path d="M 204 30 L 208 22 L 232 22 L 236 30" fill="#D0D0D0" />
                    <text x="220" y="95" fontSize="18" textAnchor="middle" fill="#1F2937" fontWeight="900">Sal</text>
                  </g>
              </svg>

                <div style={{
                  fontSize: "clamp(15px, 2vw, 18px)",
                  fontWeight: 800,
                  color: "#F59E0B",
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(255, 255, 255, 0.9)"
                }}>
                  Pan por Sal
                </div>
            </motion.div>

              {/* Trade 2: Ropa <-> Fruta */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30, scale: showContent ? 1 : 0.9 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -4 }}
              style={{
                  padding: "24px 20px",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
                  borderRadius: 20,
                  border: "3px solid rgba(59, 130, 246, 0.3)",
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Accent bar */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                  opacity: 0.6
                }} />

                <svg width="100%" height="110" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet" style={{ marginBottom: 12 }}>
                  {/* T-shirt */}
                  <g>
                    <path d="M 60 28 L 50 38 L 50 70 L 100 70 L 100 38 L 90 28 L 85 33 L 75 28 L 65 33 Z" fill="#3B82F6" />
                    <rect x="55" y="43" width="40" height="27" fill="#60A5FA" />
                    <path d="M 60 28 L 50 38 L 50 48 L 60 43 Z" fill="#2563EB" />
                    <path d="M 90 28 L 100 38 L 100 48 L 90 43 Z" fill="#2563EB" />
                    <text x="75" y="95" fontSize="18" textAnchor="middle" fill="#1F2937" fontWeight="900">Ropa</text>
                  </g>
                
                  {/* Exchange arrows */}
                  <g>
                    <path d="M 110 50 L 170 50" stroke="#3B82F6" strokeWidth="4" fill="none" />
                    <path d="M 170 50 L 162 44" stroke="#3B82F6" strokeWidth="4" fill="none" />
                    <path d="M 170 50 L 162 56" stroke="#3B82F6" strokeWidth="4" fill="none" />
                    <path d="M 170 50 L 110 50" stroke="#3B82F6" strokeWidth="4" fill="none" />
                    <path d="M 110 50 L 118 44" stroke="#3B82F6" strokeWidth="4" fill="none" />
                    <path d="M 110 50 L 118 56" stroke="#3B82F6" strokeWidth="4" fill="none" />
                  </g>
                
                  {/* Apple */}
                  <g>
                    <text x="220" y="55" fontSize="50" textAnchor="middle" dominantBaseline="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))">🍎</text>
                    <text x="220" y="95" fontSize="18" textAnchor="middle" fill="#1F2937" fontWeight="900">Fruta</text>
                  </g>
              </svg>

                <div style={{
                  fontSize: "clamp(15px, 2vw, 18px)",
                  fontWeight: 800,
                  color: "#3B82F6",
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(255, 255, 255, 0.9)"
                }}>
                  Ropa por Fruta
                </div>
            </motion.div>
            </div>

            {/* Explanation Text - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                maxWidth: 850,
                margin: "0 auto",
                padding: "28px 32px",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.3))",
                borderRadius: 20,
                border: "2px solid rgba(15, 98, 254, 0.2)",
                boxShadow: "0 8px 32px rgba(15, 98, 254, 0.1)",
                textAlign: "center"
              }}
            >
              <p style={{
                fontSize: "clamp(18px, 3.5vw, 26px)",
                lineHeight: 1.5,
                color: "#374151",
                margin: "0 0 20px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                textShadow: "0 1px 2px rgba(255, 255, 255, 0.9)"
              }}>
                Antes de existir el dinero, las personas intercambiaban lo que tenían.
              </p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                style={{ 
                  padding: "20px 28px",
                  background: "linear-gradient(135deg, #0F62FE, #3B82F6)",
                  borderRadius: 16
                }}
              >
                <div style={{ 
                  fontSize: "clamp(20px, 4vw, 30px)",
                  color: "#fff",
                  fontWeight: 900,
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
                }}>
                  A eso se le llamaba
                </div>
                <div style={{ 
                  fontSize: "clamp(32px, 5.5vw, 48px)",
                  color: "#fff",
                  fontWeight: 900,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                }}>
                  TRUEQUE
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Continue Button at Bottom - Perfectly Centered */}
      <AnimatePresence>
        {showNarration && showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.8, duration: 0.8 }}
              style={{
              position: "fixed",
              bottom: 40,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              pointerEvents: "none"
              }}
            >
            <div style={{ pointerEvents: "auto" }}>
              <motion.button
                onClick={handleContinue}
                whileHover={{ 
                  scale: 1.08, 
                  boxShadow: "0 16px 48px rgba(15, 98, 254, 0.6)",
                  y: -4
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 8px 32px rgba(15, 98, 254, 0.4)",
                    "0 12px 48px rgba(15, 98, 254, 0.6)",
                    "0 8px 32px rgba(15, 98, 254, 0.4)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  padding: "20px 56px",
                  fontSize: "clamp(18px, 2.5vw, 22px)",
                  fontWeight: 900,
                  color: "#fff",
                  background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
                  border: "none",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  position: "relative",
                  overflow: "hidden",
                  letterSpacing: "0.02em"
                }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>Descubre más</span>
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "relative", zIndex: 2, fontSize: 26 }}
                >
                  →
                </motion.span>
                
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "200%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    zIndex: 1
                  }}
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

// Card 2: Discover the barter problem
function Card2({ onComplete }: CardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer)
    playSound(answer === 'B' ? 'success' : 'error')
    setShowFeedback(true)
    
    if (answer === 'B') {
      setIsComplete(true)
    }
  }

  const handleTryAgain = () => {
    playSound('click')
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "32px 24px",
        paddingBottom: 120, // Space for fixed button
        margin: "0 auto",
        marginRight: "160px", // Center content accounting for right sidebar (320px / 2)
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto"
      }}
    >
      {/* Enhanced Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "20px 32px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
          borderRadius: 20,
          border: "2px solid rgba(15, 98, 254, 0.2)",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #0F62FE, #3B82F6)",
        }} />
      <h2 style={{
          fontSize: "clamp(28px, 5vw, 40px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textAlign: "center",
          letterSpacing: "-0.02em",
          margin: 0
      }}>
        Descubre el Problema del Trueque
      </h2>
      </motion.div>

      {/* Three scenes - Compact to fit viewport */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        marginBottom: 32,
        maxWidth: 850,
        margin: "0 auto 32px"
      }}>
        {[
          { icon: "🌾", label: "Agricultor", sublabel: "con trigo", color: "#F59E0B" },
          { icon: "👞", label: "Zapatero", sublabel: "con zapatos", color: "#8B5CF6" },
          { icon: "🏺", label: "Alfarero", sublabel: "con vasijas", color: "#EC4899" }
        ].map((scene, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: idx * 0.2,
              type: "spring",
              stiffness: 100,
              damping: 12
            }}
            whileHover={{ 
              scale: 1.03,
              y: -4,
              transition: { duration: 0.2 }
            }}
            style={{
              textAlign: "center",
              padding: "24px 16px",
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2))`,
            borderRadius: 16,
              border: "3px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Subtle gradient overlay */}
            <div style={{ 
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: `linear-gradient(180deg, ${scene.color}15, transparent)`,
              pointerEvents: "none"
            }} />
            
            {/* Icon */}
            <motion.div 
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.5
              }}
              style={{ 
                fontSize: "clamp(70px, 10vw, 100px)", 
                marginBottom: 12,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                position: "relative",
                zIndex: 1
              }}
            >
              {scene.icon}
            </motion.div>
            
            {/* Label */}
            <div style={{
              position: "relative",
              zIndex: 1
            }}>
              <div style={{ 
                fontSize: "clamp(16px, 2.2vw, 20px)", 
                fontWeight: 900, 
                color: scene.color,
                textShadow: "0 2px 4px rgba(255, 255, 255, 0.9)",
                marginBottom: 4,
                letterSpacing: "-0.02em"
              }}>
                {scene.label}
              </div>
              <div style={{ 
                fontSize: "clamp(13px, 1.8vw, 15px)", 
                fontWeight: 600, 
                color: "#374151",
              textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)"
              }}>
                {scene.sublabel}
              </div>
            </div>
            
            {/* Bottom accent */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: scene.color,
              opacity: 0.3
            }} />
          </motion.div>
        ))}
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          marginBottom: 28,
          padding: "20px 28px",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1))",
          borderRadius: 16,
          border: "2px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 4px 16px rgba(59, 130, 246, 0.1)"
        }}
      >
      <p style={{
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 900,
          color: "#1E40AF",
          margin: 0,
        textAlign: "center",
          textShadow: "0 2px 4px rgba(255, 255, 255, 0.9)",
          lineHeight: 1.3,
          letterSpacing: "-0.02em"
      }}>
        ¿Qué problema tienen al intentar comerciar?
      </p>
      </motion.div>

      {/* Options */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 12, 
        marginBottom: 20,
        maxWidth: 800,
        margin: "0 auto 20px"
      }}>
        {[
          { id: 'A', text: "No confían entre sí" },
          { id: 'B', text: "No pueden encontrar lo que necesitan" },
          { id: 'C', text: "No conocen los precios" }
        ].map((option) => (
          <motion.button
            key={option.id}
            onClick={() => {
              if (!showFeedback) {
                playSound('click')
                handleSelect(option.id)
              }
            }}
            disabled={showFeedback}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + (option.id.charCodeAt(0) - 65) * 0.1 }}
            whileHover={!showFeedback ? { scale: 1.02, x: 12, boxShadow: "0 8px 24px rgba(59, 130, 246, 0.2)" } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            style={{
              padding: "20px 24px",
              fontSize: "clamp(16px, 2.8vw, 20px)",
              fontWeight: 800,
              textAlign: "left",
              background: selectedAnswer === option.id 
                ? (option.id === 'B' 
                  ? "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))" 
                  : "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))")
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.5))",
              border: selectedAnswer === option.id
                ? `3px solid ${option.id === 'B' ? "#3B82F6" : "#EF4444"}`
                : "3px solid rgba(229, 231, 235, 0.5)",
              borderRadius: 14,
              cursor: showFeedback ? "default" : "pointer",
              color: "#1F2937",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: selectedAnswer === option.id 
                ? (option.id === 'B' ? "0 4px 16px rgba(59, 130, 246, 0.2)" : "0 4px 16px rgba(239, 68, 68, 0.2)")
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Option letter badge */}
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: selectedAnswer === option.id 
                ? (option.id === 'B' ? "#3B82F6" : "#EF4444")
                : "#0F62FE",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
            }}>
              {option.id}
            </div>
            
            {/* Option text */}
            <span style={{ flex: 1 }}>
            {option.text}
            </span>
            
            {/* Checkmark */}
            {selectedAnswer === option.id && option.id === 'B' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                style={{
                  fontSize: 28,
                  flexShrink: 0
                }}
              >
                ✅
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && selectedAnswer === 'B' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              padding: "24px 28px",
              background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
              borderRadius: 16,
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(15, 98, 254, 0.3)",
              maxWidth: 800,
              margin: "0 auto"
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ fontSize: 40, marginBottom: 12 }}
          >
              🎉
            </motion.div>
            <div style={{ 
              marginBottom: 20,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 700,
              lineHeight: 1.5
            }}>
              ¡Exacto! El trueque fallaba cuando las necesidades no coincidían.
            </div>
            {isComplete && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                onClick={() => {
                playSound('click')
                onComplete()
              }}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "16px 40px",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: 12,
                  fontSize: "clamp(16px, 2.2vw, 20px)",
                  fontWeight: 900,
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
                }}
              >
                Continuar →
              </motion.button>
            )}
          </motion.div>
        )}
        {showFeedback && selectedAnswer !== 'B' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              padding: "24px 28px",
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              borderRadius: 16,
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(239, 68, 68, 0.3)",
              maxWidth: 800,
              margin: "0 auto"
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 40, marginBottom: 12 }}
          >
              🤔
            </motion.div>
            <div style={{ 
              marginBottom: 20,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 700,
              lineHeight: 1.5
            }}>
              Intenta de nuevo. Piensa: ¿qué dificulta el intercambio directo?
            </div>
            <motion.button
              onClick={handleTryAgain}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "12px 28px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                borderRadius: 12,
                fontSize: "clamp(15px, 2vw, 18px)",
                fontWeight: 800,
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease"
              }}
            >
              Intentar de Nuevo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Card 3: Mini Game - Match the trade
function Card3({ onComplete }: CardProps) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [failCount, setFailCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)

  const items = [
    { left: "🍞 Pan", right: "🧂 Sal", id: "bread-salt" },
    { left: "👗 Tela", right: "🍎 Frutas", id: "cloth-fruit" },
    { left: "🐟 Pescado", right: "🥛 Leche", id: "fish-milk" }
  ]

  const handleMatch = (leftItem: string, rightItem: string) => {
    playSound('click')
    const correctPairs: Record<string, string> = {
      "🍞 Pan": "🧂 Sal",
      "👗 Tela": "🍎 Frutas",
      "🐟 Pescado": "🥛 Leche"
    }

    if (correctPairs[leftItem] === rightItem) {
      setTimeout(() => playSound('success'), 100)
      const newMatches = { ...matches, [leftItem]: rightItem }
      setMatches(newMatches)
      
      // Check if all 3 matches are complete
      if (Object.keys(newMatches).length === 3) {
        setCompleted(true)
      }
    } else {
      setTimeout(() => playSound('error'), 100)
      setFailCount(prev => prev + 1)
      if (failCount >= 1) {
        setShowHint(true)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px" // Center content accounting for right sidebar (320px / 2)
      }}
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
          borderRadius: 20,
          border: "2px solid rgba(15, 98, 254, 0.2)",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #0F62FE, #3B82F6)",
        }} />
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          margin: 0,
          marginBottom: 12
        }}>
          Mini Juego: Empareja el Intercambio
        </h2>
        <p style={{
          fontSize: "clamp(14px, 2vw, 16px)",
          color: "#6B7280",
          textAlign: "center",
          fontWeight: 600,
          margin: 0
        }}>
          Haz clic para emparejar los intercambios equivalentes
        </p>
      </motion.div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 16,
            background: "rgba(254, 243, 199, 0.3)",
            borderRadius: 12,
            marginBottom: 24,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "#92400E"
          }}
        >
          💡 Pista: Busca equivalencias de valor
        </motion.div>
      )}

      {/* Simplified click-based matching */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {!matches[item.left] ? (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap"
              }}>
                <div style={{
                  flex: 1,
                  minWidth: 150,
                  padding: "20px 24px",
                  background: "rgba(239, 246, 255, 0.5)",
                  borderRadius: 12,
                  fontSize: 20,
                  fontWeight: 700,
                  textAlign: "center",
                  border: "2px solid #0F62FE"
                }}>
                  {item.left}
                </div>
                <div style={{ fontSize: 24, color: "#6B7280" }}>⇄</div>
                <button
                  onClick={() => handleMatch(item.left, item.right)}
                  style={{
                    flex: 1,
                    minWidth: 150,
                    padding: "20px 24px",
                    background: "rgba(243, 244, 246, 0.3)",
                    borderRadius: 12,
                    fontSize: 20,
                    fontWeight: 700,
                    textAlign: "center",
                    border: "2px dashed #9CA3AF",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#DBEAFE"
                    e.currentTarget.style.borderColor = "#0F62FE"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F3F4F6"
                    e.currentTarget.style.borderColor = "#9CA3AF"
                  }}
                >
                  {item.right}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 16,
                  padding: 20,
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))",
                  borderRadius: 12,
                  border: "2px solid #3B82F6"
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 700 }}>{item.left}</span>
                <span style={{ fontSize: 24 }}>✅</span>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{matches[item.left]}</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 32,
            padding: 24,
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            Intercambiar cosas funcionaba… pero no siempre era justo ni práctico.
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onComplete}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px 40px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 900,
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "0.02em"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Card 4: Metals appear
function Card4({ onComplete }: CardProps) {
  const [revealedFacts, setRevealedFacts] = useState<Set<string>>(new Set())
  
  const metals = [
    { id: "gold", icon: "🥇", name: "Oro", fact: "Difícil de falsificar" },
    { id: "silver", icon: "🥈", name: "Plata", fact: "Fácil de transportar" },
    { id: "copper", icon: "🟤", name: "Cobre", fact: "Duradero y valioso" }
  ]

  const [allRevealed, setAllRevealed] = useState(false)

  const handleMetalClick = (id: string) => {
    playSound('coin-drop')
    const newRevealed = new Set([...revealedFacts, id])
    setRevealedFacts(newRevealed)
    
    // Check if all 3 metals have been revealed
    if (newRevealed.size === 3) {
      setAllRevealed(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px" // Center content accounting for right sidebar (320px / 2)
      }}
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
          borderRadius: 20,
          border: "2px solid rgba(15, 98, 254, 0.2)",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #F59E0B, #EAB308)",
        }} />
        <h2 style={{
          fontSize: "clamp(26px, 4vw, 32px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #92400E 0%, #F59E0B 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          margin: 0,
          marginBottom: 12
        }}>
          Aparecen los Metales
        </h2>
        
        <p style={{
          fontSize: "clamp(32px, 5.5vw, 48px)",
          lineHeight: 1.6,
          color: "#1F2937",
          maxWidth: 950,
          margin: "0 auto",
          fontWeight: 800,
          textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)"
        }}>
          Las personas empezaron a usar metales valiosos como el oro o la plata, 
          porque eran <strong style={{ color: "#0F62FE", fontSize: "clamp(34px, 6vw, 52px)" }}>duraderos</strong> y todos los <strong style={{ color: "#3B82F6", fontSize: "clamp(34px, 6vw, 52px)" }}>aceptaban</strong>.
        </p>
      </motion.div>

      <p style={{
        fontSize: "clamp(20px, 3vw, 26px)",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 40,
        fontWeight: 800,
        textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)"
      }}>
        Toca cada metal para descubrir por qué fueron elegidos →
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 24
      }}>
        {metals.map((metal, idx) => (
          <motion.button
            key={metal.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            onClick={() => handleMetalClick(metal.id)}
            disabled={revealedFacts.has(metal.id)}
            whileHover={!revealedFacts.has(metal.id) ? { scale: 1.05, y: -5 } : {}}
            whileTap={!revealedFacts.has(metal.id) ? { scale: 0.95 } : {}}
            style={{
              padding: 32,
              background: revealedFacts.has(metal.id) 
                ? "linear-gradient(135deg, #3B82F622, #2563EB22)"
                : "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
              borderRadius: 20,
              border: revealedFacts.has(metal.id) 
                ? "3px solid #3B82F6"
                : "3px solid #E5E7EB",
              cursor: revealedFacts.has(metal.id) ? "default" : "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <motion.div
              animate={{ 
                rotate: revealedFacts.has(metal.id) ? [0, 360] : 0,
                scale: revealedFacts.has(metal.id) ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 16, display: "inline-block" }}
            >
              {/* Custom metal coin SVGs */}
              {metal.id === 'gold' && (
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="38" fill="url(#goldGrad)" />
                  <defs>
                    <linearGradient id="goldGrad">
                      <stop offset="0%" style={{ stopColor: "#FFD700" }} />
                      <stop offset="100%" style={{ stopColor: "#FFA500" }} />
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="40" r="34" fill="#DAA520" opacity="0.4" />
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180)
                    return <circle key={i} cx={40 + Math.cos(angle) * 30} cy={40 + Math.sin(angle) * 30} r="3" fill="#FFF" opacity="0.6" />
                  })}
                  <text x="40" y="50" fontSize="32" textAnchor="middle" fontWeight="900">🥇</text>
                  <ellipse cx="32" cy="32" rx="12" ry="8" fill="#FFF" opacity="0.4" />
                </svg>
              )}
              {metal.id === 'silver' && (
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="38" fill="url(#silverGrad)" />
                  <defs>
                    <linearGradient id="silverGrad">
                      <stop offset="0%" style={{ stopColor: "#E8E8E8" }} />
                      <stop offset="100%" style={{ stopColor: "#C0C0C0" }} />
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="40" r="34" fill="#A9A9A9" opacity="0.3" />
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180)
                    return <circle key={i} cx={40 + Math.cos(angle) * 30} cy={40 + Math.sin(angle) * 30} r="3" fill="#FFF" opacity="0.7" />
                  })}
                  <text x="40" y="50" fontSize="32" textAnchor="middle" fontWeight="900">🥈</text>
                  <ellipse cx="32" cy="32" rx="12" ry="8" fill="#FFF" opacity="0.5" />
                </svg>
              )}
              {metal.id === 'copper' && (
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="38" fill="url(#copperGrad)" />
                  <defs>
                    <linearGradient id="copperGrad">
                      <stop offset="0%" style={{ stopColor: "#CD7F32" }} />
                      <stop offset="100%" style={{ stopColor: "#B87333" }} />
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="40" r="34" fill="#8B4513" opacity="0.3" />
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180)
                    return <circle key={i} cx={40 + Math.cos(angle) * 30} cy={40 + Math.sin(angle) * 30} r="3" fill="#FFF" opacity="0.5" />
                  })}
                  <text x="40" y="48" fontSize="28" textAnchor="middle" fontWeight="900" fill="#5D4037">Cu</text>
                  <ellipse cx="32" cy="32" rx="12" ry="8" fill="#FFF" opacity="0.3" />
                </svg>
              )}
            </motion.div>
            
            <div style={{
              fontSize: "clamp(20px, 3vw, 24px)",
              fontWeight: 800,
              color: "#1F2937",
              marginBottom: 12,
              textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)"
            }}>
              {metal.name}
            </div>

            <AnimatePresence>
              {revealedFacts.has(metal.id) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: "clamp(15px, 2vw, 18px)",
                    color: "#0F62FE",
                    fontWeight: 700,
                    background: "rgba(255, 255, 255, 0.25)",
                    padding: "10px 16px",
                    borderRadius: 10,
                    marginTop: 12,
                    boxShadow: "0 2px 8px rgba(15, 98, 254, 0.15)"
                  }}
                >
                  ✓ {metal.fact}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 32,
            textAlign: "center"
          }}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px 40px",
              background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(15, 98, 254, 0.35)",
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "0.02em"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Card 5: Quick quiz - why metals?
function Card5({ onComplete }: CardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer)
    playSound(answer === 'B' ? 'success' : 'error')
    setShowFeedback(true)
    
    if (answer === 'B') {
      setIsComplete(true)
    }
  }

  const handleTryAgain = () => {
    playSound('click')
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px" // Center content accounting for right sidebar (320px / 2)
      }}
    >
      {/* Enhanced Header with Icon */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
          borderRadius: 20,
          border: "2px solid rgba(245, 158, 11, 0.3)",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
          textAlign: "center"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #F59E0B, #EAB308)",
        }} />
        
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            marginBottom: 16,
            display: "inline-block",
            filter: "drop-shadow(0 4px 12px rgba(251, 191, 36, 0.5))"
          }}
        >
          <svg width="70" height="70" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="42" fill="url(#coinGrad5)" />
            <defs>
              <linearGradient id="coinGrad5">
                <stop offset="0%" style={{ stopColor: "#FFD700" }} />
                <stop offset="100%" style={{ stopColor: "#FDB931" }} />
              </linearGradient>
            </defs>
            <circle cx="45" cy="45" r="38" fill="#D4AF37" opacity="0.5" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180)
              const x1 = 45 + Math.cos(angle) * 40
              const y1 = 45 + Math.sin(angle) * 40
              const x2 = 45 + Math.cos(angle) * 42
              const y2 = 45 + Math.sin(angle) * 42
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B8860B" strokeWidth="2" />
            })}
            <text x="45" y="58" fontSize="40" textAnchor="middle" fill="#B8860B" fontWeight="900">$</text>
            <ellipse cx="35" cy="35" rx="15" ry="10" fill="#FFFFFF" opacity="0.3" />
          </svg>
        </motion.div>
        
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 30px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #92400E 0%, #F59E0B 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          margin: 0
        }}>
          ¿Por qué Metales?
        </h2>
      </motion.div>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{
          fontSize: "clamp(16px, 2.2vw, 18px)",
          color: "#6B7280",
          fontWeight: 600,
          margin: 0
        }}>
          ¿Por qué la gente eligió metales como dinero?
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {[
          { id: 'A', text: "Porque eran brillantes" },
          { id: 'B', text: "Porque eran duraderos, aceptados y fáciles de guardar" },
          { id: 'C', text: "Porque se veían bien" }
        ].map((option) => (
          <motion.button
            key={option.id}
            onClick={() => {
              if (!showFeedback) {
                playSound('click')
                handleSelect(option.id)
              }
            }}
            disabled={showFeedback}
            whileHover={!showFeedback ? { scale: 1.02, x: 8 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            style={{
              padding: "20px 24px",
              fontSize: 16,
              fontWeight: 600,
              textAlign: "left",
              background: selectedAnswer === option.id 
                ? (option.id === 'B' ? "#3B82F622" : "#EF444422")
                : "#F9FAFB",
              border: selectedAnswer === option.id
                ? `2px solid ${option.id === 'B' ? "#3B82F6" : "#EF4444"}`
                : "2px solid #E5E7EB",
              borderRadius: 12,
              cursor: showFeedback ? "default" : "pointer",
              color: "#1F2937",
              transition: "all 0.3s ease"
            }}
          >
            <span style={{ 
              fontWeight: 800, 
              marginRight: 12,
              color: selectedAnswer === option.id 
                ? (option.id === 'B' ? "#3B82F6" : "#EF4444")
                : "#0F62FE"
            }}>
              {option.id})
            </span>
            {option.text}
            {selectedAnswer === option.id && option.id === 'B' && " ✅"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showFeedback && selectedAnswer === 'B' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: 20,
              background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
              borderRadius: 16,
              color: "#fff",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600
            }}
          >
            <div style={{ marginBottom: 16 }}>
              ¡Correcto! Los metales valiosos eran fáciles de conservar y transportar.
            </div>
            {isComplete && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => {
                playSound('click')
                onComplete()
              }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "16px 40px",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: 12,
                  fontSize: "clamp(16px, 2.2vw, 20px)",
                  fontWeight: 900,
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "0.02em"
                }}
              >
                Continuar →
              </motion.button>
            )}
          </motion.div>
        )}
        {showFeedback && selectedAnswer !== 'B' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: 20,
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              borderRadius: 16,
              color: "#fff",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600
            }}
          >
            <div style={{ marginBottom: 16 }}>
              No es correcto. Piensa en las características que hacen que algo sea buen dinero.
            </div>
            <button
              onClick={handleTryAgain}
              style={{
                padding: "12px 24px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#EF4444",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Intentar de Nuevo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Card 6: Birth of coins
function Card6({ onComplete }: CardProps) {
  const [coinTapped, setCoinTapped] = useState(false)
  const [showNarration, setShowNarration] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNarration(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleCoinTap = () => {
    if (!coinTapped) {
      playSound('click')
      setCoinTapped(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "20px 24px",
        paddingBottom: 120,
        textAlign: "center",
        margin: "0 auto",
        marginRight: "160px", // Center content accounting for right sidebar (320px / 2)
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: 850 }}>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "clamp(30px, 5.5vw, 44px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
            marginBottom: 32,
        textAlign: "center",
        letterSpacing: "-0.02em"
          }}
        >
        Nacimiento de las Monedas
        </motion.h2>

      <AnimatePresence>
        {showNarration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            >
              {/* Enhanced explanation card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: "28px 32px",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.3))",
                  borderRadius: 20,
                  border: "2px solid rgba(15, 98, 254, 0.2)",
                  boxShadow: "0 8px 32px rgba(15, 98, 254, 0.1)",
                  marginBottom: 36,
                  position: "relative",
                  overflow: "hidden",
                  width: "100%"
                }}
          >
              {/* Top accent bar */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: "linear-gradient(90deg, #FFD700, #FDB931, #FFD700)",
                opacity: 0.6
              }} />

            <p style={{
                fontSize: "clamp(20px, 3.8vw, 28px)",
                lineHeight: 1.6,
                color: "#374151",
                marginBottom: 0,
              fontWeight: 700,
                textShadow: "0 1px 2px rgba(255, 255, 255, 0.9)"
            }}>
                Los gobiernos comenzaron a <strong style={{ color: "#0F62FE", fontSize: "clamp(22px, 4vw, 30px)" }}>acuñar monedas</strong>. 
                <br />
                Así nació la <strong style={{ color: "#3B82F6", fontSize: "clamp(22px, 4vw, 30px)" }}>confianza</strong> en el valor del dinero.
            </p>
            </motion.div>

              {/* Interactive Coin Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                style={{
                  padding: "32px 24px",
                  background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(250, 204, 21, 0.1))",
                  borderRadius: 20,
                  border: "3px solid rgba(251, 191, 36, 0.3)",
                  boxShadow: "0 8px 32px rgba(251, 191, 36, 0.2)",
                  width: "100%"
                }}
              >
              {/* Label */}
              {!coinTapped && (
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    fontSize: "clamp(16px, 2.2vw, 20px)",
                    color: "#92400E",
                    marginBottom: 20,
                    fontWeight: 800,
                    textShadow: "0 1px 2px rgba(255, 255, 255, 0.9)"
                  }}
                >
                  👇 Toca la moneda para continuar
                </motion.div>
              )}

            {/* Interactive Coin - Custom SVG */}
            <motion.button
              onClick={handleCoinTap}
              animate={{ 
                rotateY: coinTapped ? 360 : 0,
                  scale: coinTapped ? [1, 1.2, 1] : 1,
                  rotate: !coinTapped ? [0, -5, 5, -5, 5, 0] : 0
              }}
                transition={{ 
                  duration: 0.8,
                  rotate: { duration: 2, repeat: Infinity, repeatDelay: 1 }
                }}
                whileHover={{ scale: 1.15, y: -12, rotate: 0 }}
                whileTap={{ scale: 0.9 }}
              style={{
                  background: "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)",
                border: "none",
                cursor: "pointer",
                  padding: 20,
                  borderRadius: "50%",
                  filter: coinTapped ? "drop-shadow(0 0 40px rgba(251, 191, 36, 1))" : "drop-shadow(0 8px 24px rgba(251, 191, 36, 0.6))"
              }}
            >
              <svg width="160" height="160" viewBox="0 0 160 160">
                {/* Outer ring - gold */}
                <circle cx="80" cy="80" r="75" fill="url(#coinGrad6)" />
                <defs>
                  <linearGradient id="coinGrad6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                    <stop offset="30%" style={{ stopColor: "#FDB931", stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#FDB931", stopOpacity: 1 }} />
                  </linearGradient>
                  <radialGradient id="coinShine6">
                    <stop offset="0%" style={{ stopColor: "#FFFFFF", stopOpacity: 0.6 }} />
                    <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 0 }} />
                  </radialGradient>
                </defs>
                
                {/* Decorative rings */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="#B8860B" strokeWidth="2" />
                <circle cx="80" cy="80" r="65" fill="none" stroke="#D4AF37" strokeWidth="1" />
                
                {/* Inner area */}
                <circle cx="80" cy="80" r="60" fill="#D4AF37" />
                
                {/* Notches around edge */}
                {[...Array(16)].map((_, i) => {
                  const angle = (i * 22.5) * (Math.PI / 180)
                  const x1 = 80 + Math.cos(angle) * 68
                  const y1 = 80 + Math.sin(angle) * 68
                  const x2 = 80 + Math.cos(angle) * 72
                  const y2 = 80 + Math.sin(angle) * 72
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B8860B" strokeWidth="3" />
                })}
                
                {/* Center design */}
                <circle cx="80" cy="80" r="48" fill="url(#coinShine6)" />
                <text x="80" y="102" fontSize="70" textAnchor="middle" fill="#8B7355" fontWeight="900">$</text>
                
                {/* Shine highlight */}
                <ellipse cx="62" cy="62" rx="28" ry="20" fill="#FFFFFF" opacity="0.4" />
                <ellipse cx="58" cy="58" rx="18" ry="12" fill="#FFFFFF" opacity="0.6" />
              </svg>
            </motion.button>

              {/* Success message when tapped */}
              {coinTapped && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                style={{
                    marginTop: 24,
                    padding: "20px 28px",
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    borderRadius: 16,
                    boxShadow: "0 6px 24px rgba(16, 185, 129, 0.3)"
                  }}
                >
                  <div style={{
                    fontSize: "clamp(16px, 2.2vw, 20px)",
                    color: "#fff",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12
                  }}>
                    <span style={{ fontSize: 28 }}>✓</span>
                    ¡Excelente! Las monedas revolucionaron el comercio
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Continue button - appears after coin tap */}
            {coinTapped && (
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                onClick={() => {
                playSound('click')
                onComplete()
              }}
                whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(15, 98, 254, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "16px 40px",
                  background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  fontSize: "clamp(16px, 2.2vw, 20px)",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(15, 98, 254, 0.35)",
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "0.02em"
                }}
              >
                Continuar →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Card 7: Timeline reorder challenge
function Card7({ onComplete }: CardProps) {
  const correctOrder = ["Trueque", "Metales", "Monedas", "Billetes", "Dinero Digital"]
  const [items, setItems] = useState(["Dinero Digital", "Trueque", "Billetes", "Metales", "Monedas"])
  const [isCorrect, setIsCorrect] = useState(false)

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return
    
    playSound('click')
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    setItems(newItems)
    
    // Check if correct
    if (JSON.stringify(newItems) === JSON.stringify(correctOrder)) {
      playSound('success')
      setIsCorrect(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px" // Center content accounting for right sidebar (320px / 2)
      }}
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
          borderRadius: 20,
          border: "2px solid rgba(15, 98, 254, 0.2)",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #0F62FE, #3B82F6)",
        }} />
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 30px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          margin: 0,
          marginBottom: 12
        }}>
          Desafío de la Línea del Tiempo
        </h2>
        <p style={{
          fontSize: "clamp(14px, 2vw, 16px)",
          color: "#6B7280",
          fontWeight: 600,
          textAlign: "center",
          margin: 0
        }}>
          Ordena estos eventos (usa las flechas para mover)
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, index) => (
          <motion.div
            key={item}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              background: isCorrect ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.15)",
              borderRadius: 12,
              border: isCorrect ? "2px solid #3B82F6" : "2px solid rgba(255, 255, 255, 0.4)"
            }}
          >
            <div style={{
              flex: 1,
              fontSize: "clamp(19px, 2.8vw, 24px)",
              fontWeight: 800,
              color: "#1F2937",
              textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)"
            }}>
              {index + 1}. {item}
            </div>

            {!isCorrect && (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  style={{
                    padding: "8px 12px",
                    background: index === 0 ? "#F3F4F6" : "#0F62FE",
                    color: index === 0 ? "#9CA3AF" : "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: index === 0 ? "not-allowed" : "pointer",
                    fontSize: 16,
                    fontWeight: 700
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  style={{
                    padding: "8px 12px",
                    background: index === items.length - 1 ? "#F3F4F6" : "#0F62FE",
                    color: index === items.length - 1 ? "#9CA3AF" : "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: index === items.length - 1 ? "not-allowed" : "pointer",
                    fontSize: 16,
                    fontWeight: 700
                  }}
                >
                  ↓
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 32,
            padding: 20,
            background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ¡Perfecto! Así evolucionó la historia del dinero.
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onComplete}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px 40px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 900,
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "0.02em"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Card 8: The paper era
function Card8({ onComplete }: CardProps) {
  const [flipped, setFlipped] = useState(false)
  const [showNarration, setShowNarration] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNarration(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const [canContinue, setCanContinue] = useState(false)

  const handleFlip = () => {
    playSound('ding')
    setFlipped(!flipped)
    if (!flipped) {
      setCanContinue(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "20px 24px",
        paddingBottom: 120,
        textAlign: "center",
        margin: "0 auto",
        marginRight: "160px", // Center content accounting for right sidebar (320px / 2)
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: 850 }}>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "clamp(30px, 5.5vw, 44px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
            marginBottom: 32,
        textAlign: "center",
        letterSpacing: "-0.02em"
          }}
        >
        La Era del Papel
        </motion.h2>

      <AnimatePresence mode="wait">
        {showNarration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
              {/* Explanation card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: "28px 32px",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.3))",
                  borderRadius: 20,
                  border: "2px solid rgba(15, 98, 254, 0.2)",
                  boxShadow: "0 8px 32px rgba(15, 98, 254, 0.1)",
                  marginBottom: 36,
                  width: "100%",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Top accent bar */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: flipped 
                    ? "linear-gradient(90deg, #0F62FE, #3B82F6)" 
                    : "linear-gradient(90deg, #8B7355, #A0826D, #D4AF37)",
                  opacity: 0.6
                }} />

            <p style={{
                  fontSize: "clamp(20px, 3.8vw, 28px)",
                  lineHeight: 1.6,
                  color: "#374151",
                  margin: 0,
              fontWeight: 700,
                  textShadow: "0 1px 2px rgba(255, 255, 255, 0.9)"
            }}>
              {!flipped ? (
                <>
                      Los primeros billetes eran <strong style={{ color: "#0F62FE", fontSize: "clamp(22px, 4vw, 30px)" }}>recibos</strong> que 
                  representaban metales guardados en bancos.
                </>
              ) : (
                <>
                      Con el tiempo, esos billetes comenzaron a tener <strong style={{ color: "#3B82F6", fontSize: "clamp(22px, 4vw, 30px)" }}>valor por sí mismos</strong>. 
                  Hoy lo llamamos dinero fiduciario.
                </>
              )}
            </p>
              </motion.div>

              {/* Flippable Bill Container */}
              <div style={{
                perspective: "1500px",
                marginBottom: 24,
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}>
            <motion.button
              onClick={handleFlip}
              animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
              style={{
                width: 400,
                    maxWidth: "100%",
                height: 200,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                position: "relative",
                    transformStyle: "preserve-3d"
              }}
            >
                  {/* Front side (ANTES) */}
              <div style={{
                    position: "absolute",
                width: "100%",
                height: "100%",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    left: 0,
                    top: 0
                  }}>
                    <svg width="400" height="200" viewBox="0 0 400 200" style={{ 
                      filter: "drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2))",
                      display: "block"
                    }}>
                    {/* Background */}
                    <rect width="400" height="200" rx="16" fill="url(#gradOld)" />
                    <defs>
                      <linearGradient id="gradOld" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#8B7355", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#A0826D", stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* Decorative border */}
                    <rect x="10" y="10" width="380" height="180" rx="12" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,5" />
                    
                    {/* Ornamental corners */}
                    <circle cx="30" cy="30" r="8" fill="#D4AF37" opacity="0.6" />
                    <circle cx="370" cy="30" r="8" fill="#D4AF37" opacity="0.6" />
                    <circle cx="30" cy="170" r="8" fill="#D4AF37" opacity="0.6" />
                    <circle cx="370" cy="170" r="8" fill="#D4AF37" opacity="0.6" />
                    
                    {/* Gold coins illustration */}
                    <circle cx="80" cy="100" r="25" fill="#FFD700" opacity="0.8" />
                    <circle cx="110" cy="100" r="25" fill="#FDB931" opacity="0.8" />
                    
                    {/* Text */}
                    <text x="200" y="90" fontSize="32" fill="#FFFFFF" fontWeight="800" textAnchor="middle" fontFamily="Montserrat">
                      ANTES
                    </text>
                    <text x="200" y="120" fontSize="14" fill="#F5E6D3" fontWeight="600" textAnchor="middle" fontFamily="Montserrat">
                      Recibo de Banco
                    </text>
                    <text x="200" y="145" fontSize="12" fill="#D4AF37" fontWeight="600" textAnchor="middle" fontFamily="Montserrat">
                      &quot;Vale por Oro&quot;
                    </text>
                    
                    {/* Bank seal */}
                    <circle cx="320" cy="100" r="30" fill="#D4AF37" opacity="0.3" />
                    <text x="320" y="108" fontSize="28" textAnchor="middle">🏛️</text>
                  </svg>
                  </div>

                  {/* Back side (AHORA) - Pre-rotated 180deg */}
                  <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    left: 0,
                    top: 0
                  }}>
                    <svg width="400" height="200" viewBox="0 0 400 200" style={{ 
                      filter: "drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2))",
                      display: "block"
                    }}>
                    {/* Background - Modern blue gradient */}
                    <rect width="400" height="200" rx="16" fill="url(#gradNew)" />
                    <defs>
                      <linearGradient id="gradNew" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#0F62FE", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* Decorative modern border */}
                    <rect x="10" y="10" width="380" height="180" rx="12" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" />
                    
                    {/* Modern geometric patterns */}
                    <circle cx="50" cy="50" r="20" fill="#FFFFFF" opacity="0.1" />
                    <circle cx="350" cy="150" r="25" fill="#FFFFFF" opacity="0.1" />
                    <rect x="320" y="20" width="60" height="60" rx="8" fill="#FFFFFF" opacity="0.1" />
                    
                    {/* Central emblem */}
                    <circle cx="200" cy="100" r="40" fill="#FFFFFF" opacity="0.2" />
                    <text x="200" y="110" fontSize="40" textAnchor="middle">💳</text>
                    
                    {/* Text */}
                    <text x="200" y="45" fontSize="32" fill="#FFFFFF" fontWeight="800" textAnchor="middle" fontFamily="Montserrat">
                      AHORA
                    </text>
                    <text x="200" y="165" fontSize="14" fill="#E0F2FE" fontWeight="600" textAnchor="middle" fontFamily="Montserrat">
                      Dinero Fiduciario
                    </text>
                    <text x="200" y="185" fontSize="11" fill="#BFDBFE" fontWeight="500" textAnchor="middle" fontFamily="Montserrat">
                      &quot;Vale por Confianza&quot;
                    </text>
                    
                    {/* Government seal modern */}
                    <circle cx="80" cy="100" r="25" fill="#FFFFFF" opacity="0.15" />
                    <text x="80" y="108" fontSize="24" textAnchor="middle">🏦</text>
                  </svg>
              </div>
            </motion.button>
              </div>

              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              style={{
                  fontSize: "clamp(15px, 2vw, 18px)",
                color: "#6B7280",
                  marginTop: 20,
                  fontWeight: 700
              }}
            >
                {!flipped ? "👇 Toca para voltear el billete" : "🔄 Toca de nuevo para ver ambos lados"}
              </motion.div>

            {canContinue && (
              <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                onClick={() => {
                playSound('click')
                onComplete()
              }}
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(15, 98, 254, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                    marginTop: 28,
                    padding: "16px 40px",
                  background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
                  color: "#fff",
                  border: "none",
                    borderRadius: 14,
                    fontSize: "clamp(16px, 2.2vw, 20px)",
                    fontWeight: 900,
                  cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(15, 98, 254, 0.35)",
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "0.02em"
                }}
              >
                Continuar →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Card 9: True/False - Banknotes
function Card9({ onComplete }: CardProps) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({})
  const [showResults, setShowResults] = useState(false)
  const [canRetry, setCanRetry] = useState(false)

  const questions = [
    { id: 1, text: "Los primeros billetes se podían cambiar por oro.", correct: true },
    { id: 2, text: "Hoy los billetes valen por la confianza en el Estado.", correct: true },
    { id: 3, text: "El papel tiene valor por sí solo.", correct: false }
  ]

  const handleAnswer = (questionId: number, answer: boolean) => {
    playSound('click')
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    const allCorrect = questions.every(q => answers[q.id] === q.correct)
    playSound(allCorrect ? 'success' : 'error')
    setShowResults(true)
    if (!allCorrect) {
      setCanRetry(true)
    }
  }

  const handleTryAgain = () => {
    setAnswers({})
    setShowResults(false)
    setCanRetry(false)
  }

  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px" // Center content accounting for right sidebar (320px / 2)
      }}
    >
      <h2 style={{
        fontSize: "clamp(32px, 5vw, 42px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "0 2px 8px rgba(255, 255, 255, 0.9)",
        marginBottom: 40,
        textAlign: "center",
        letterSpacing: "-0.01em"
      }}>
        Verdadero o Falso: Billetes
      </h2>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: showResults && questions.every(q => answers[q.id] === q.correct) ? "1fr 400px" : "1fr",
        gap: 24, 
        marginBottom: 32,
        alignItems: "start"
      }}>
        {/* Quiz questions column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {questions.map((question, idx) => (
          <div key={question.id} style={{
            padding: 24,
              background: "rgba(255, 255, 255, 0.6)",
            borderRadius: 12,
            border: showResults 
              ? `2px solid ${answers[question.id] === question.correct ? "#3B82F6" : "#EF4444"}`
              : "2px solid #E5E7EB"
          }}>
            <p style={{
              fontSize: "clamp(18px, 2.8vw, 22px)",
              fontWeight: 700,
              color: "#1F2937",
              marginBottom: 20,
              textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
              lineHeight: 1.5
            }}>
              {idx + 1}. {question.text}
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => !showResults && handleAnswer(question.id, true)}
                disabled={showResults}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: 16,
                  fontWeight: 700,
                  background: answers[question.id] === true ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.15)",
                  border: answers[question.id] === true ? "2px solid #3B82F6" : "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: 8,
                  cursor: showResults ? "default" : "pointer",
                  color: "#1F2937"
                }}
              >
                ✅ Verdadero
              </button>
              <button
                onClick={() => !showResults && handleAnswer(question.id, false)}
                disabled={showResults}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: 16,
                  fontWeight: 700,
                  background: answers[question.id] === false ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.15)",
                  border: answers[question.id] === false ? "2px solid #EF4444" : "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: 8,
                  cursor: showResults ? "default" : "pointer",
                  color: "#1F2937"
                }}
              >
                ❌ Falso
              </button>
            </div>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: answers[question.id] === question.correct ? "#2563EB" : "#DC2626"
                }}
              >
                {answers[question.id] === question.correct ? "✓ Correcto" : "✗ Incorrecto"}
              </motion.div>
            )}
          </div>
        ))}

      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 16,
            fontWeight: 700,
            background: allAnswered ? "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)" : "#E5E7EB",
            color: allAnswered ? "#fff" : "#9CA3AF",
            border: "none",
            borderRadius: 12,
                cursor: allAnswered ? "pointer" : "not-allowed",
                marginTop: 8
          }}
        >
          Enviar Respuestas
        </button>
      )}

          {showResults && !questions.every(q => answers[q.id] === q.correct) && canRetry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
                fontSize: 16,
                fontWeight: 600,
                marginTop: 8
          }}
        >
          <div style={{ marginBottom: 16 }}>
                Revisa tus respuestas. No todas son correctas.
              </div>
              <button
                onClick={handleTryAgain}
                style={{
                  padding: "12px 28px",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  backdropFilter: "blur(10px)"
                }}
              >
                Intentar de Nuevo
              </button>
            </motion.div>
          )}
        </div>

        {/* Success message column - Right side */}
        {showResults && questions.every(q => answers[q.id] === q.correct) && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{
              padding: 28,
              background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
              borderRadius: 20,
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 12px 40px rgba(15, 98, 254, 0.4)",
              position: "sticky",
              top: 20
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              style={{ fontSize: 48, marginBottom: 16 }}
            >
              🎉
            </motion.div>
            <div style={{ 
              marginBottom: 20,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 700,
              lineHeight: 1.5
            }}>
            ¡Correcto! El valor actual depende de la confianza, no del papel.
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            onClick={onComplete}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            style={{
                padding: "16px 40px",
              background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
                fontSize: "clamp(16px, 2.2vw, 20px)",
                fontWeight: 900,
              cursor: "pointer",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "0.02em"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}
      </div>
      
      {showResults && !questions.every(q => answers[q.id] === q.correct) && canRetry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 20,
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            Revisa tus respuestas. Recuerda: los billetes evolucionaron desde recibos de oro hasta dinero fiduciario.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "#fff",
              color: "#EF4444",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Card 10: Welcome to digital money
function Card10({ onComplete }: CardProps) {
  const [transferSent, setTransferSent] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSendTransfer = () => {
    playSound('click')
    setTransferSent(true)
  }

  const [isComplete, setIsComplete] = useState(false)

  const handleValueSelect = (value: string) => {
    playSound('click')
    setSelectedValue(value)
    playSound(value === 'trust' ? 'success' : 'error')
    setShowFeedback(true)
    if (value === 'trust') {
      setIsComplete(true)
    }
  }

  const handleTryAgain = () => {
    setSelectedValue(null)
    setShowFeedback(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px" // Center content accounting for right sidebar (320px / 2)
      }}
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
          borderRadius: 20,
          border: "2px solid rgba(15, 98, 254, 0.2)",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #0F62FE, #3B82F6)",
        }} />
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 30px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          margin: 0,
          marginBottom: 12
        }}>
          Bienvenido al Dinero Digital
        </h2>
        <p style={{
          fontSize: "clamp(14px, 2vw, 16px)",
          color: "#6B7280",
          textAlign: "center",
          lineHeight: 1.5,
          fontWeight: 600,
          margin: 0
        }}>
          Ahora el dinero viaja por internet. Las transferencias, tarjetas y apps bancarias son dinero digital.
        </p>
      </motion.div>

      {/* Phone simulation - Custom SVG Phone */}
      {!transferSent ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: 380,
            margin: "0 auto 32px"
          }}
        >
          <svg width="380" height="560" viewBox="0 0 380 560">
            {/* Phone body - dark frame */}
            <rect x="10" y="10" width="360" height="540" rx="40" fill="#1F2937" />
            
            {/* Phone screen */}
            <rect x="20" y="30" width="340" height="500" rx="32" fill="#FFFFFF" />
            
            {/* Status bar */}
            <rect x="20" y="30" width="340" height="50" rx="32" fill="#F9FAFB" />
            <text x="40" y="60" fontSize="16" fill="#6B7280" fontWeight="600">9:41</text>
            <text x="320" y="60" fontSize="14" fill="#6B7280">📶 🔋</text>
            
            {/* App header */}
            <rect x="30" y="90" width="320" height="60" rx="16" fill="#EFF6FF" />
            <text x="50" y="125" fontSize="20" fill="#0F62FE" fontWeight="800" fontFamily="Montserrat">
              💳 Transferencia
            </text>
            
            {/* Amount card */}
            <rect x="40" y="170" width="300" height="140" rx="16" fill="url(#phoneGrad)" />
            <defs>
              <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#0F62FE", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            <text x="190" y="200" fontSize="14" fill="#E0F2FE" fontWeight="600" textAnchor="middle">
              Monto a enviar
            </text>
            <text x="190" y="250" fontSize="56" fill="#FFFFFF" fontWeight="900" textAnchor="middle" fontFamily="Montserrat">
              $200
            </text>
            <text x="190" y="290" fontSize="13" fill="#BFDBFE" fontWeight="500" textAnchor="middle">
              MXN
            </text>
            
            {/* Recipient info */}
            <rect x="40" y="330" width="300" height="80" rx="16" fill="#F9FAFB" />
            <text x="60" y="355" fontSize="12" fill="#6B7280" fontWeight="600">
              Para:
            </text>
            <text x="60" y="380" fontSize="18" fill="#1F2937" fontWeight="700" fontFamily="Montserrat">
              María González
            </text>
            <text x="60" y="400" fontSize="12" fill="#9CA3AF">
              Cuenta: •••• 4829
            </text>
            
            {/* Bank icon */}
            <circle cx="310" cy="370" r="20" fill="#DBEAFE" />
            <text x="310" y="378" fontSize="20" textAnchor="middle">🏦</text>
          </svg>
          
          {/* Confirm button below phone */}
          <button
            onClick={handleSendTransfer}
            style={{
              width: "100%",
              maxWidth: 340,
              margin: "24px auto 0",
              padding: "18px",
              fontSize: 18,
              fontWeight: 800,
              background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(15, 98, 254, 0.4)",
              display: "block",
              fontFamily: "Montserrat, sans-serif"
            }}
          >
            📱 Confirmar Transferencia
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ marginBottom: 32, textAlign: "center" }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: 96, marginBottom: 16 }}
          >
            ✅
          </motion.div>
          <p style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#3B82F6",
            marginBottom: 32
          }}>
            ¡Transferencia enviada!
          </p>

          <p style={{
            fontSize: "clamp(26px, 4.5vw, 34px)",
            fontWeight: 900,
            color: "#1F2937",
            marginBottom: 40,
            textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)"
          }}>
            ¿Qué crees que le da valor todavía?
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            maxWidth: 500,
            margin: "0 auto"
          }}>
            {[
              { id: "trust", emoji: "⚖️", label: "Confianza" },
              { id: "gold", emoji: "🥇", label: "Oro" },
              { id: "speed", emoji: "📈", label: "Velocidad" }
            ].map((option) => (
              <motion.button
                key={option.id}
                onClick={() => !showFeedback && handleValueSelect(option.id)}
                disabled={showFeedback}
                whileHover={!showFeedback ? { scale: 1.1, y: -5 } : {}}
                whileTap={!showFeedback ? { scale: 0.95 } : {}}
                style={{
                  padding: 24,
                  background: selectedValue === option.id
                    ? (option.id === 'trust' ? "#3B82F622" : "#EF444422")
                    : "#F9FAFB",
                  border: selectedValue === option.id
                    ? `2px solid ${option.id === 'trust' ? "#3B82F6" : "#EF4444"}`
                    : "2px solid #E5E7EB",
                  borderRadius: 16,
                  cursor: showFeedback ? "default" : "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 8 }}>{option.emoji}</div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#374151"
                }}>
                  {option.label}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {showFeedback && selectedValue === 'trust' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ¡Exacto! El dinero digital también depende de la confianza.
          </div>
          {isComplete && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                playSound('click')
                onComplete()
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "16px 40px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                borderRadius: 12,
                fontSize: "clamp(16px, 2.2vw, 20px)",
                fontWeight: 900,
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "0.02em"
              }}
            >
              Continuar →
            </motion.button>
          )}
        </motion.div>
      )}
      {showFeedback && selectedValue !== 'trust' && selectedValue !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            No es correcto. Piensa: ¿qué hace que cualquier forma de dinero funcione?
          </div>
          <button
            onClick={handleTryAgain}
            style={{
              padding: "12px 24px",
              background: "#fff",
              color: "#EF4444",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Intentar de Nuevo
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Card 11: Recap - Choose the key idea
function Card11({ onComplete }: CardProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [showResults, setShowResults] = useState(false)
  const [canRetry, setCanRetry] = useState(false)

  const options = [
    { id: 1, text: "El dinero facilita el intercambio.", correct: true },
    { id: 2, text: "El valor del dinero depende de la confianza.", correct: true },
    { id: 3, text: "El dinero físico desaparecerá completamente mañana.", correct: false }
  ]

  const toggleOption = (id: number) => {
    if (showResults) return
    playSound('click')
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const handleSubmit = () => {
    const correctIds = options.filter(o => o.correct).map(o => o.id)
    const isCorrect = correctIds.length === selected.size && correctIds.every(id => selected.has(id))
    playSound(isCorrect ? 'success' : 'error')
    setShowResults(true)
    if (!isCorrect) {
      setCanRetry(true)
    }
  }

  const handleTryAgain = () => {
    setSelected(new Set())
    setShowResults(false)
    setCanRetry(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px" // Center content accounting for right sidebar (320px / 2)
      }}
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
          borderRadius: 20,
          border: "2px solid rgba(15, 98, 254, 0.2)",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #0F62FE, #3B82F6)",
        }} />
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 30px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          margin: 0,
          marginBottom: 12
        }}>
          Resumen: Elige las Ideas Clave
        </h2>
        <p style={{
          fontSize: "clamp(14px, 2vw, 16px)",
          color: "#6B7280",
          textAlign: "center",
          fontWeight: 600,
          margin: 0
        }}>
          Selecciona todas las afirmaciones verdaderas sobre el dinero
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            whileHover={!showResults ? { scale: 1.02, x: 8 } : {}}
            whileTap={!showResults ? { scale: 0.98 } : {}}
            style={{
              padding: "20px 24px",
              fontSize: 16,
              fontWeight: 600,
              textAlign: "left",
              background: selected.has(option.id)
                ? (showResults && !option.correct ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)")
                : "rgba(255, 255, 255, 0.15)",
              border: selected.has(option.id)
                ? `2px solid ${showResults && !option.correct ? "#EF4444" : "#3B82F6"}`
                : "2px solid #E5E7EB",
              borderRadius: 12,
              cursor: showResults ? "default" : "pointer",
              color: "#1F2937",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}
          >
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: `2px solid ${selected.has(option.id) ? "#3B82F6" : "#D1D5DB"}`,
              background: selected.has(option.id) ? "#3B82F6" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0
            }}>
              {selected.has(option.id) && "✓"}
            </div>
            <span style={{ flex: 1 }}>{option.text}</span>
            {showResults && (
              <span style={{ fontSize: 20 }}>
                {option.correct && selected.has(option.id) && "✅"}
                {!option.correct && selected.has(option.id) && "❌"}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 16,
            fontWeight: 700,
            background: selected.size > 0 ? "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)" : "#E5E7EB",
            color: selected.size > 0 ? "#fff" : "#9CA3AF",
            border: "none",
            borderRadius: 12,
            cursor: selected.size > 0 ? "pointer" : "not-allowed"
          }}
        >
          Enviar Respuestas
        </button>
      )}

      {showResults && options.filter(o => o.correct).map(o => o.id).every(id => selected.has(id)) && 
       selected.size === options.filter(o => o.correct).length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ¡Bien hecho! Lo importante no es la forma, sino la confianza y el uso.
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px 40px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 900,
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "0.02em"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {showResults && canRetry && !(options.filter(o => o.correct).map(o => o.id).every(id => selected.has(id)) && 
       selected.size === options.filter(o => o.correct).length) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 20,
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            No todas las respuestas son correctas. Piensa en cómo el dinero evolucionó desde recibos hasta dinero fiduciario.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "#fff",
              color: "#EF4444",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}

      {showResults && canRetry && !(options.filter(o => o.correct).map(o => o.id).every(id => selected.has(id)) && 
       selected.size === options.filter(o => o.correct).length) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 20,
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            Revisa tus selecciones. Solo dos afirmaciones son correctas sobre el dinero.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "#fff",
              color: "#EF4444",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Card 12: Final reflection + reward
interface Card12Props extends CardProps {
  totalXp: number;
  lessonId: string;
}

function Card12({ totalXp, lessonId }: Card12Props) {
  const [showConfetti, setShowConfetti] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true)
      playSound('celebration')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Save lesson completion to user metadata
  useEffect(() => {
    const saveCompletion = async () => {
      if (!user) return

      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        // Get current completed lessons from user metadata
        const currentMetadata = user.user_metadata || {}
        const completedLessons = currentMetadata.completedLessons || []

        // Generate lesson ID in the same format as courses page expects
        const lessonIdFormatted = lessonId // Already in format like "l1-1"

        // Only add if not already completed
        if (!completedLessons.includes(lessonIdFormatted)) {
          const updatedCompletedLessons = [...completedLessons, lessonIdFormatted]

          console.log('💾 Saving lesson completion:', lessonIdFormatted)
          console.log('📋 Updated list:', updatedCompletedLessons)

          await supabase.auth.updateUser({
            data: {
              ...currentMetadata,
              completedLessons: updatedCompletedLessons
            }
          })

          // Refresh session to get updated metadata
          await supabase.auth.refreshSession()
          console.log('✅ Lesson completion saved and session refreshed')
        } else {
          console.log('⚠️ Lesson already completed:', lessonIdFormatted)
        }
      } catch (error) {
        console.error('Error saving lesson completion:', error)
      }
    }

    saveCompletion()
  }, [user, lessonId])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 800,
        width: "100%",
        background: "transparent",
        padding: "24px 32px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1
        }}>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 800, opacity: 1 }}
              animate={{
                y: 900,
                rotate: Math.random() * 360,
                opacity: 0
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: i * 0.05,
                ease: "easeOut"
              }}
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                background: ['#0F62FE', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'][i % 5],
                borderRadius: "50%"
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 28px)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 16
        }}>
          ¡Lección Completada!
        </h2>

        <p style={{
          fontSize: "clamp(16px, 2.5vw, 20px)",
          lineHeight: 1.6,
          color: "#1F2937",
          marginBottom: 24,
          maxWidth: 700,
          margin: "0 auto 24px",
          fontWeight: 600,
          textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)"
        }}>
          Desde el trueque hasta las criptomonedas, el dinero ha cambiado su forma, 
          pero no su propósito: <strong style={{ color: "#0F62FE", fontSize: "clamp(17px, 2.8vw, 22px)" }}>ayudarnos a intercambiar valor</strong> y 
          construir <strong style={{ color: "#3B82F6", fontSize: "clamp(17px, 2.8vw, 22px)" }}>confianza</strong>.
        </p>

        {/* Enhanced Timeline visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
            padding: 16,
            borderRadius: 16,
            marginBottom: 20,
            border: "2px solid #0F62FE22"
          }}
        >
          <div style={{
            fontSize: 12,
            color: "#6B7280",
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center"
          }}>
            📜 Evolución del Dinero
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            padding: "0 12px"
          }}>
            {[
              { icon: "🌾", label: "Trueque" },
              { icon: "🥇", label: "Metales" },
              { icon: "💰", label: "Monedas" },
              { icon: "💵", label: "Billetes" },
              { icon: "💳", label: "Digital" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.2, type: "spring" }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <div style={{
                  fontSize: 28,
                  padding: 6,
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: "2px solid #0F62FE22",
                  minWidth: 48,
                  textAlign: "center"
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: 9,
                  color: "#0F62FE",
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}>
                  {item.label}
                </div>
                {idx < 4 && (
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                    style={{ 
                      position: "absolute",
                      marginLeft: 60 + idx * 72,
                      color: "#0F62FE",
                      fontSize: 18,
                      fontWeight: 900
                    }}
                  >
                    →
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reward Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          style={{
            padding: 16,
            background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
            borderRadius: 16,
            marginBottom: 20,
            border: "3px solid #F59E0B",
            boxShadow: "0 6px 20px rgba(245, 158, 11, 0.3)"
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
          <div style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#92400E",
            marginBottom: 6
          }}>
            ¡Insignia Desbloqueada!
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#B45309"
          }}>
            Historiador Financiero 💰
          </div>
          <div style={{
            fontSize: 14,
            color: "#92400E",
            marginTop: 6,
            fontWeight: 600
          }}>
            ¡+100 XP de Bonificación!
          </div>
        </motion.div>

        {/* Total XP Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 200 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
            borderRadius: 16,
            marginBottom: 24,
            border: "3px solid #0F62FE",
            boxShadow: "0 6px 20px rgba(15, 98, 254, 0.3)"
          }}
        >
          <div style={{
            fontSize: 14,
            color: "#6B7280",
            fontWeight: 600,
            marginBottom: 10
          }}>
            Total XP Ganado
          </div>
          <div style={{
            fontSize: "clamp(36px, 6vw, 44px)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10
          }}>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: "clamp(32px, 5vw, 40px)" }}
            >
              ⭐
            </motion.span>
            {totalXp} XP
          </div>
        </motion.div>

        <motion.button
          onClick={() => {
            playSound('click')
            // Navigate to courses page with next lesson unlocked
            window.location.href = `/courses`
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(15, 98, 254, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: "20px 56px",
            fontSize: "clamp(18px, 2.5vw, 22px)",
            fontWeight: 900,
            color: "#fff",
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            border: "none",
            borderRadius: 16,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(15, 98, 254, 0.3)",
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "0.02em"
          }}
        >
          Continuar a la Siguiente Lección →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// LESSON 2: ¿Cómo gana valor?
// ============================================

// L2 Card 1: Context (Intro, tap)
function L2Card1({ onComplete }: CardProps) {
  const [showIntroButton, setShowIntroButton] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowIntroButton(true)
    }, 2000)

    return () => clearTimeout(timer1)
  }, [])

  const handleIntroClick = () => {
    playSound('click')
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Enhanced Animated Background */}
      <motion.div
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 0.18
        }}
        transition={{ duration: 4, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(15, 98, 254, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, rgba(15, 98, 254, 0.08) 0%, rgba(96, 165, 250, 0.08) 100%)
          `,
          filter: "blur(8px)"
        }}
      />

      {/* Intro Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1.5, type: "spring", stiffness: 100 }}
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 40px",
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          marginRight: "160px"
        }}
      >
        {/* Enhanced Title with Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
          style={{
            marginBottom: 24,
            padding: "32px 40px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.4))",
            borderRadius: 24,
            border: "3px solid rgba(15, 98, 254, 0.3)",
            boxShadow: "0 12px 48px rgba(15, 98, 254, 0.2)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Decorative top bar */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #0F62FE, #3B82F6, #0F62FE)",
            backgroundSize: "200% 100%",
            animation: "shimmerBar 3s linear infinite"
          }} />

          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              fontSize: "clamp(42px, 8vw, 72px)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 50%, #0F62FE 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 16,
              fontFamily: "Montserrat, sans-serif",
              lineHeight: 1.1,
              letterSpacing: "-0.03em"
            }}
          >
            ¿Cómo gana valor?
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "linear-gradient(135deg, #0F62FE, #3B82F6)",
              borderRadius: 14,
              fontSize: "clamp(16px, 2.2vw, 20px)",
              color: "#fff",
              fontWeight: 900,
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 6px 24px rgba(15, 98, 254, 0.3)",
              letterSpacing: "0.05em"
            }}
          >
            LECCIÓN 2
          </motion.div>

          {/* Decorative subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            style={{
              marginTop: 20,
              fontSize: "clamp(13px, 1.8vw, 16px)",
              color: "#6B7280",
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "0.02em"
            }}
          >
            ✨ Descubriendo el valor del dinero ✨
          </motion.div>
        </motion.div>

        <style>{`
          @keyframes shimmerBar {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>

        {/* Intro Button */}
        {showIntroButton && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            style={{
              marginTop: 48
            }}
          >
            <motion.button
              onClick={handleIntroClick}
              whileHover={{ scale: 1.08, boxShadow: "0 16px 48px rgba(15, 98, 254, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 8px 32px rgba(15, 98, 254, 0.3)",
                  "0 12px 48px rgba(15, 98, 254, 0.5)",
                  "0 8px 32px rgba(15, 98, 254, 0.3)"
                ]
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{
                padding: "20px 56px",
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
                border: "none",
            borderRadius: 20,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>Comenzar</span>
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "relative", zIndex: 2, fontSize: 24 }}
              >
                →
              </motion.span>
              
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  zIndex: 1
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

// L2 Card 2: Main source today (Single choice)
function L2Card2({ onComplete }: CardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const options = [
    { id: 'A', label: 'Metal precioso', icon: 'moneda-oro', correct: false },
    { id: 'B', label: 'Respaldo directo canjeable', icon: 'billete-recibo', correct: false },
    { id: 'C', label: 'Confianza y autoridad (fiduciario)', icon: 'billete-fiduciario', correct: true }
  ]

  const handleSelect = (id: string) => {
    if (showFeedback) return
    setSelected(id)
    const isCorrect = options.find(o => o.id === id)?.correct
    playSound(isCorrect ? 'success' : 'error')
    setShowFeedback(true)
  }

  const handleTryAgain = () => {
    playSound('click')
    setSelected(null)
    setShowFeedback(false)
  }

  const renderIcon = (icon: string) => {
    if (icon === 'moneda-oro') {
      return (
        <svg width="80" height="80" viewBox="0 0 80 80">
          <title>moneda de oro</title>
          <circle cx="40" cy="40" r="35" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
          <text x="40" y="50" textAnchor="middle" fontSize="32" fill="#92400E" fontWeight="bold">$</text>
        </svg>
      )
    }
    if (icon === 'billete-recibo') {
      return (
        <svg width="100" height="60" viewBox="0 0 100 60">
          <title>billete antiguo tipo recibo</title>
          <rect x="5" y="5" width="90" height="50" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" rx="4"/>
          <text x="50" y="35" textAnchor="middle" fontSize="12" fill="#6B7280" fontWeight="600">RECIBO</text>
        </svg>
      )
    }
    return (
      <svg width="100" height="60" viewBox="0 0 100 60">
        <title>billete moderno fiduciario</title>
        <rect x="5" y="5" width="90" height="50" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" rx="4"/>
        <text x="50" y="35" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">$100</text>
      </svg>
    )
  }

  const correctOption = options.find(o => o.correct)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 850,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 40,
        textAlign: "center"
      }}>
        ¿Cómo gana valor?
      </h2>

      <p style={{
        fontSize: "clamp(16px, 2.2vw, 20px)",
        fontWeight: 600,
        color: "#374151",
            marginBottom: 32,
        textAlign: "center"
      }}>
        Selecciona la fuente principal de valor del dinero moderno actual.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {options.map((option, idx) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handleSelect(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: 20,
              background: selected === option.id 
                ? (option.correct ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")
                : "rgba(255, 255, 255, 0.7)",
              border: `2px solid ${
                selected === option.id 
                  ? (option.correct ? "#10B981" : "#EF4444")
                  : "rgba(229, 231, 235, 0.8)"
              }`,
              borderRadius: 16,
              cursor: showFeedback ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 20,
              transition: "all 0.2s"
            }}
          >
            <div style={{ flexShrink: 0 }}>
              {renderIcon(option.icon)}
            </div>
            <div style={{ flex: 1 }}>
          <div style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                fontWeight: 700,
                color: "#1F2937"
              }}>
                {option.id}) {option.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showFeedback && selected === correctOption?.id && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "white",
            textAlign: "center",
            marginBottom: 20
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            ¡Correcto!
          </div>
          <div style={{ fontSize: 15 }}>
            Hoy el valor depende de la confianza y del respaldo de una autoridad.
          </div>
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: 16,
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              color: "white",
            fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {showFeedback && selected !== correctOption?.id && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "white",
            textAlign: "center",
            marginBottom: 20
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Intenta de nuevo. Piensa en qué sostiene el valor del dinero actual.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// L2 Card 3: Match (Drag-match 2×2)
function L2Card3({ onComplete }: CardProps) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)

  const pairs = {
    'mercancia': 'Tiene valor por su material (ej. oro, sal)',
    'fiduciario': 'Vale por confianza y curso legal, no por el material'
  }

  const leftItems = [
    { id: 'mercancia', label: 'Dinero mercancía' },
    { id: 'fiduciario', label: 'Dinero fiduciario' }
  ]

  const rightItems = [
    { id: 'mercancia', text: pairs.mercancia },
    { id: 'fiduciario', text: pairs.fiduciario }
  ]

  const handleLeftClick = (id: string) => {
    if (showFeedback) return
    setSelectedLeft(id)
  }

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft || showFeedback) return
    
    const newMatches = { ...matches, [selectedLeft]: rightId }
    setMatches(newMatches)
    setSelectedLeft(null)

    if (Object.keys(newMatches).length === 2) {
      const allCorrect = Object.entries(newMatches).every(([left, right]) => left === right)
      playSound(allCorrect ? 'success' : 'error')
      if (allCorrect) {
        setShowFeedback(true)
      } else {
        setMatches({})
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 32,
        textAlign: "center"
      }}>
        Empareja los conceptos
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        marginBottom: 24
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {leftItems.map(item => (
            <motion.div
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: 20,
                background: selectedLeft === item.id ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.7)",
                border: `2px solid ${selectedLeft === item.id ? "#3B82F6" : "#E5E7EB"}`,
                borderRadius: 12,
                cursor: showFeedback ? "default" : "pointer",
                fontSize: "clamp(14px, 2vw, 16px)",
                fontWeight: 700,
                color: "#1F2937",
                textAlign: "center"
              }}
            >
              {item.label}
            </motion.div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rightItems.map(item => (
            <motion.div
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: 20,
                background: Object.values(matches).includes(item.id) ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.7)",
                border: `2px solid ${Object.values(matches).includes(item.id) ? "#10B981" : "#E5E7EB"}`,
                borderRadius: 12,
                cursor: showFeedback ? "default" : "pointer",
                fontSize: "clamp(13px, 1.8vw, 15px)",
                fontWeight: 600,
                color: "#374151",
                textAlign: "center"
              }}
            >
              {item.text}
            </motion.div>
          ))}
        </div>
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "white",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            ¡Bien!
          </div>
          <div style={{ fontSize: 15, marginBottom: 16 }}>
            El material fue clave antes; hoy manda la confianza.
          </div>
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      <div style={{
        marginTop: 20,
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center",
        fontWeight: 600
      }}>
        💡 Pista: Fiduciario = confianza
      </div>
    </motion.div>
  )
}

// L2 Card 4: Representativo (Flip)
function L2Card4({ onComplete }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasFlipped, setHasFlipped] = useState(false)

  const handleFlip = () => {
    if (!hasFlipped) {
      setHasFlipped(true)
      playSound('click')
    }
    setIsFlipped(!isFlipped)
    
    if (!isFlipped) {
      setTimeout(() => {
        // Auto advance after showing back
      }, 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "20px 24px",
        paddingBottom: 120,
        textAlign: "center",
        margin: "0 auto",
        marginRight: "160px",
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "clamp(26px, 4.5vw, 38px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 32,
          letterSpacing: "-0.02em"
        }}
      >
        Dinero Representativo
      </motion.h2>

      <div 
        onClick={handleFlip}
        style={{
          perspective: "1000px",
          cursor: "pointer",
          marginBottom: 32
        }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
          style={{
            width: "clamp(280px, 50vw, 400px)",
            height: "clamp(180px, 30vw, 250px)",
            position: "relative",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Front */}
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
            borderRadius: 20,
            border: "3px solid #9CA3AF",
            padding: 24
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280", marginBottom: 12 }}>
              ANTES
            </div>
            <svg width="120" height="80" viewBox="0 0 120 80">
              <title>billete antiguo tipo recibo</title>
              <rect x="5" y="5" width="110" height="70" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="2" rx="6"/>
              <text x="60" y="45" textAnchor="middle" fontSize="14" fill="#6B7280" fontWeight="600">RECIBO</text>
            </svg>
            <div style={{ fontSize: "clamp(11px, 1.8vw, 13px)", color: "#374151", fontWeight: 600, marginTop: 12, lineHeight: 1.4 }}>
              &quot;Este billete es un recibo<br/>canjeable por metal.&quot;
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
            borderRadius: 20,
            border: "3px solid #1E40AF",
            padding: 24,
            left: 0,
            top: 0
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#DBEAFE", marginBottom: 12 }}>
              AHORA
            </div>
            <svg width="120" height="80" viewBox="0 0 120 80">
              <title>billete moderno fiduciario</title>
              <rect x="5" y="5" width="110" height="70" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" rx="6"/>
              <text x="60" y="50" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">$100</text>
            </svg>
            <div style={{ fontSize: "clamp(11px, 1.8vw, 13px)", color: "white", fontWeight: 600, marginTop: 12, lineHeight: 1.4 }}>
              &quot;Este billete vale por confianza<br/>en la autoridad y porque la ley<br/>obliga a aceptarlo.&quot;
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: 14,
            color: "#6B7280",
            fontWeight: 600,
          marginBottom: 24
        }}
      >
        {isFlipped ? "🔄 Toca de nuevo para ver ambos lados" : "👇 Toca para voltear el billete"}
      </motion.div>

      {hasFlipped && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onComplete}
          whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(15, 98, 254, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "fixed",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "16px 40px",
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            color: "#fff",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            borderRadius: 14,
            fontSize: "clamp(16px, 2.2vw, 20px)",
            fontWeight: 900,
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            boxShadow: "0 6px 20px rgba(15, 98, 254, 0.35)",
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "0.02em"
          }}
        >
          Continuar →
        </motion.button>
      )}
    </motion.div>
  )
}

// L2 Card 5: Curso legal y autoridad (True/False)
function L2Card5({ onComplete }: CardProps) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    { id: 1, text: "El curso legal obliga a aceptar cierta moneda para pagar deudas.", correct: true },
    { id: 2, text: "Sin autoridad, el dinero mantiene su valor automáticamente.", correct: false }
  ]

  const handleAnswer = (questionId: number, answer: boolean) => {
    playSound('click')
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    const allCorrect = questions.every(q => answers[q.id] === q.correct)
    playSound(allCorrect ? 'success' : 'error')
    setShowResults(true)
  }

  const handleTryAgain = () => {
    playSound('click')
    setAnswers({})
    setShowResults(false)
  }

  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 32,
        textAlign: "center"
      }}>
        Verdadero o Falso
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
        {questions.map((question, idx) => (
          <div key={question.id} style={{
            padding: 20,
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: 12,
            border: showResults 
              ? `2px solid ${answers[question.id] === question.correct ? "#10B981" : "#EF4444"}`
              : "2px solid #E5E7EB"
          }}>
            <p style={{
              fontSize: "clamp(15px, 2.2vw, 18px)",
              fontWeight: 700,
              color: "#1F2937",
              marginBottom: 16,
              lineHeight: 1.5
            }}>
              {idx + 1}. {question.text}
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => !showResults && handleAnswer(question.id, true)}
                disabled={showResults}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: 15,
                  fontWeight: 700,
                  background: answers[question.id] === true ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.15)",
                  border: answers[question.id] === true ? "2px solid #10B981" : "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: 8,
                  cursor: showResults ? "default" : "pointer",
                  color: "#1F2937"
                }}
              >
                ✅ Verdadero
              </button>
              <button
                onClick={() => !showResults && handleAnswer(question.id, false)}
                disabled={showResults}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: 15,
                  fontWeight: 700,
                  background: answers[question.id] === false ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.15)",
                  border: answers[question.id] === false ? "2px solid #EF4444" : "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: 8,
                  cursor: showResults ? "default" : "pointer",
                  color: "#1F2937"
                }}
              >
                ❌ Falso
              </button>
            </div>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: answers[question.id] === question.correct ? "#10B981" : "#EF4444"
                }}
              >
                {answers[question.id] === question.correct ? "✓ Correcto" : "✗ Incorrecto"}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 16,
            fontWeight: 700,
            background: allAnswered ? "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)" : "#E5E7EB",
            color: allAnswered ? "#fff" : "#9CA3AF",
            border: "none",
            borderRadius: 12,
            cursor: allAnswered ? "pointer" : "not-allowed"
          }}
        >
          Enviar Respuestas
        </button>
      )}

      {showResults && questions.every(q => answers[q.id] === q.correct) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center"
          }}
        >
          <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
            Clave: la ley y la autoridad sostienen la aceptabilidad y el orden.
          </div>
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {showResults && !questions.every(q => answers[q.id] === q.correct) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
            Revisa tus respuestas. Piensa en el rol de la ley y la autoridad.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// L2 Card 6: Security features (Tap-reveal)
function L2Card6({ onComplete }: CardProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [showButton, setShowButton] = useState(false)

  const features = [
    { id: 1, label: "Marca de agua", x: 80, y: 60 },
    { id: 2, label: "Hilo de seguridad", x: 200, y: 100 },
    { id: 3, label: "Tinta que cambia de color", x: 280, y: 60 }
  ]

  const handleReveal = (id: number) => {
    playSound('click')
    const newRevealed = new Set(revealed)
    newRevealed.add(id)
    setRevealed(newRevealed)

    if (newRevealed.size === features.length) {
      playSound('success')
      setTimeout(() => setShowButton(true), 500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 900,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 32,
        textAlign: "center"
      }}>
        Características de Seguridad
      </h2>

      <p style={{
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 32,
        fontWeight: 600
      }}>
        Si aumenta demasiado la oferta de dinero, los precios suben y cada billete compra menos.
      </p>

      {/* Stylized bill SVG */}
      <svg width="100%" height="200" viewBox="0 0 400 200" style={{ marginBottom: 32, maxWidth: 400, display: "block", margin: "0 auto 32px" }}>
        <title>Billete con características de seguridad</title>
        <rect x="0" y="0" width="400" height="200" rx="12" fill="url(#billGradient2)"/>
        <defs>
          <linearGradient id="billGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
        </defs>
        
        <circle cx="350" cy="100" r="60" fill="rgba(255,255,255,0.1)"/>
        <text x="200" y="110" textAnchor="middle" fontSize="48" fontWeight="900" fill="rgba(255,255,255,0.3)">$100</text>

        {features.map(feature => (
          <g key={feature.id}>
            <circle
              cx={feature.x}
              cy={feature.y}
              r="20"
              fill={revealed.has(feature.id) ? "#0F62FE" : "rgba(255,255,255,0.4)"}
              stroke="#fff"
              strokeWidth="2"
              style={{ cursor: "pointer" }}
              onClick={() => !revealed.has(feature.id) && handleReveal(feature.id)}
            />
            {revealed.has(feature.id) && (
              <text
                x={feature.x}
                y={feature.y + 5}
                textAnchor="middle"
                fontSize="24"
                fill="#fff"
              >
                ✓
              </text>
            )}
          </g>
        ))}
      </svg>

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 12,
        width: "100%",
        maxWidth: 400,
        margin: "0 auto 32px"
      }}>
        {features.map(feature => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: revealed.has(feature.id) ? 1 : 0.3,
              x: 0 
            }}
            style={{
              padding: 16,
              background: revealed.has(feature.id) 
                ? "rgba(59, 130, 246, 0.1)" 
                : "rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              border: revealed.has(feature.id) 
                ? "2px solid #0F62FE" 
                : "2px solid rgba(0, 0, 0, 0.1)",
              fontSize: 16,
              fontWeight: 700,
              color: "#1F2937",
              textAlign: "center"
            }}
          >
            {revealed.has(feature.id) ? "✓ " : ""}
            {feature.label}
          </motion.div>
        ))}
      </div>

      {revealed.size === features.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: 24,
            padding: 16,
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            color: "#0F62FE",
            textAlign: "center"
          }}
        >
          Estas señales aumentan la confianza y reducen el fraude.
        </motion.div>
      )}

      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            playSound('click')
            onComplete()
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            padding: "16px 40px",
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 900,
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            boxShadow: "0 4px 16px rgba(15, 98, 254, 0.3)"
          }}
        >
          Continuar →
        </motion.button>
      )}

      {revealed.size < features.length && (
        <div style={{
          fontSize: 14,
          color: "#6B7280",
          fontStyle: "italic",
          textAlign: "center"
        }}>
          👆 Toca los círculos en el billete
        </div>
      )}
    </motion.div>
  )
}

// L2 Card 7: Network effect (Multi-select)
function L2Card7({ onComplete }: CardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showFeedback, setShowFeedback] = useState(false)

  const options = [
    { id: "acceptance", label: "Más personas aceptándolo", correct: true },
    { id: "low-cost", label: "Costos de transacción bajos", correct: true },
    { id: "clear-rules", label: "Reglas claras y estables", correct: true },
    { id: "difficult", label: "Difícil de usar y entender", correct: false }
  ]

  const handleToggle = (id: string) => {
    playSound('click')
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const handleSubmit = () => {
    const correctIds = options.filter(o => o.correct).map(o => o.id)
    const allCorrect = correctIds.every(id => selected.has(id)) && 
                       selected.size === correctIds.length
    
    playSound(allCorrect ? 'success' : 'error')
    setShowFeedback(true)
  }

  const handleTryAgain = () => {
    playSound('click')
    setSelected(new Set())
    setShowFeedback(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 850,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 16,
        textAlign: "center"
      }}>
        Efecto Red
      </h2>

      <p style={{
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 32,
        fontWeight: 600
      }}>
        Selecciona lo que aumenta el valor percibido (puedes elegir varias)
      </p>

      <svg width="100%" height="200" viewBox="0 0 400 200" style={{ marginBottom: 24, maxWidth: 400, display: "block", margin: "0 auto 24px" }}>
        <title>Red de aceptación del dinero</title>
        <circle cx="200" cy="100" r="30" fill="#0F62FE" opacity="0.8"/>
        <text x="200" y="107" textAnchor="middle" fontSize="24" fill="#fff">💰</text>
        
        {[0, 1, 2, 3, 4, 5].map(i => {
          const angle = (i * Math.PI * 2) / 6
          const x = 200 + Math.cos(angle) * 85
          const y = 100 + Math.sin(angle) * 85
          return (
            <g key={i}>
              <line 
                x1="200" 
                y1="100" 
                x2={x} 
                y2={y} 
                stroke="#3B82F6" 
                strokeWidth="2"
                opacity="0.5"
              />
              <circle cx={x} cy={y} r="22" fill="#3B82F6" opacity="0.6"/>
              <text x={x} y={y + 7} textAnchor="middle" fontSize="20" fill="#fff">👤</text>
            </g>
          )
        })}
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option) => (
          <motion.div
            key={option.id}
            onClick={() => !showFeedback && handleToggle(option.id)}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            style={{
              padding: 20,
              background: selected.has(option.id) 
                ? "rgba(59, 130, 246, 0.1)" 
                : "rgba(255, 255, 255, 0.6)",
              border: selected.has(option.id) 
                ? "3px solid #0F62FE" 
                : "2px solid rgba(0, 0, 0, 0.1)",
              borderRadius: 12,
              cursor: showFeedback ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: selected.has(option.id) ? "#0F62FE" : "#E5E7EB",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
              flexShrink: 0
            }}>
              {selected.has(option.id) ? "✓" : ""}
            </div>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#1F2937"
            }}>
              {option.label}
            </div>
          </motion.div>
        ))}
      </div>

      {showFeedback && selected.size === 3 && !selected.has("difficult") && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ✓ Correcto. Aceptación, bajos costos y reglas estables impulsan el valor.
          </div>
          <motion.button
            onClick={() => {
              playSound('click')
              onComplete()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {showFeedback && (selected.size !== 3 || selected.has("difficult")) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ marginBottom: 16 }}>
            Revisa tus selecciones. Piensa en qué hace que más personas quieran usar el dinero.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          style={{
            width: "100%",
            padding: "16px 40px",
            background: selected.size > 0
              ? "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)" 
              : "#E5E7EB",
            color: selected.size > 0 ? "#fff" : "#9CA3AF",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 900,
            cursor: selected.size > 0 ? "pointer" : "not-allowed",
            fontFamily: "Montserrat, sans-serif"
          }}
        >
          Continuar →
        </button>
      )}
    </motion.div>
  )
}

// L2 Card 8: Central bank ordering
function L2Card8({ onComplete }: CardProps) {
  const [order, setOrder] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)

  const items = [
    { id: "rules", label: "La autoridad define reglas y metas (estabilidad)", order: 1 },
    { id: "supply", label: "Se controla la cantidad de dinero (oferta)", order: 2 },
    { id: "inflation", label: "Si se excede, sube la inflación y baja el poder de compra", order: 3 }
  ]

  const handleAdd = (id: string) => {
    if (order.includes(id)) return
    playSound('click')
    const newOrder = [...order, id]
    setOrder(newOrder)

    if (newOrder.length === items.length) {
      const isCorrect = newOrder.every((itemId, idx) => {
        const item = items.find(i => i.id === itemId)
        return item?.order === idx + 1
      })

      setTimeout(() => {
        playSound(isCorrect ? 'success' : 'error')
        setShowFeedback(true)
      }, 300)
    }
  }

  const handleReset = () => {
    playSound('click')
    setOrder([])
    setShowFeedback(false)
  }

  const availableItems = items.filter(item => !order.includes(item.id))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 850,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 16,
        textAlign: "center"
      }}>
        Rol del Banco Central
      </h2>

      <p style={{
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 32,
        fontWeight: 600
      }}>
        Ordena la secuencia correcta
      </p>

      <div style={{
        background: "rgba(59, 130, 246, 0.05)",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        minHeight: 200,
        border: "2px dashed #3B82F6"
      }}>
        {order.length === 0 && (
          <div style={{
            fontSize: 14,
            color: "#9CA3AF",
            textAlign: "center",
            fontStyle: "italic",
            paddingTop: 80
          }}>
            Toca las opciones abajo para ordenarlas
          </div>
        )}
        
        {order.map((itemId, idx) => {
          const item = items.find(i => i.id === itemId)
          return (
            <motion.div
              key={itemId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                padding: 16,
                background: "#fff",
                borderRadius: 12,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 16,
                border: "2px solid #E5E7EB"
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#0F62FE",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 16,
                flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#1F2937",
                flex: 1
              }}>
                {item?.label}
              </div>
            </motion.div>
          )
        })}
      </div>

      {!showFeedback && availableItems.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {availableItems.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => handleAdd(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: 16,
                background: "rgba(255, 255, 255, 0.6)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                color: "#1F2937",
                textAlign: "center"
              }}
            >
              {item.label}
            </motion.div>
          ))}
        </div>
      )}

      {showFeedback && order.every((itemId, idx) => items.find(i => i.id === itemId)?.order === idx + 1) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ✓ Exacto. Demasiada emisión reduce el valor real.
          </div>
          <motion.button
            onClick={() => {
              playSound('click')
              onComplete()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {showFeedback && !order.every((itemId, idx) => items.find(i => i.id === itemId)?.order === idx + 1) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ marginBottom: 16 }}>
            El orden no es correcto. Piensa en la secuencia lógica.
          </div>
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// L2 Card 9: Inflation slider
function L2Card9({ onComplete }: CardProps) {
  const [sliderValue, setSliderValue] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const states = [
    { value: 0, label: "Bajo", status: "Deflación posible" },
    { value: 1, label: "Óptimo", status: "Estabilidad" },
    { value: 2, label: "Alto", status: "Inflación elevada" }
  ]

  const handleSubmit = () => {
    const isCorrect = sliderValue === 1
    playSound(isCorrect ? 'success' : 'error')
    setSubmitted(true)
  }

  const handleTryAgain = () => {
    playSound('click')
    setSliderValue(1)
    setSubmitted(false)
  }

  const currentState = states[sliderValue]!

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 850,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        fontWeight: 900,
        background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 32,
        textAlign: "center"
      }}>
        Control de la Inflación
      </h2>

      <div style={{
        padding: 32,
        background: "rgba(255, 255, 255, 0.6)",
        borderRadius: 20,
        marginBottom: 32,
        border: "2px solid rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ fontSize: 64, textAlign: "center", marginBottom: 16 }}>
          📈
        </div>
        
        <p style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 1.6,
          fontWeight: 600
        }}>
          Si aumenta demasiado la oferta de dinero, los precios suben y cada billete compra menos.
        </p>

        <div style={{ marginBottom: 24 }}>
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={sliderValue}
            onChange={(e) => !submitted && setSliderValue(parseInt(e.target.value))}
            disabled={submitted}
            style={{
              width: "100%",
              height: 8,
              borderRadius: 4,
              outline: "none",
              cursor: submitted ? "default" : "pointer"
            }}
          />
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12
          }}>
            {states.map((state, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: sliderValue === idx ? "#0F62FE" : "#9CA3AF",
                  textAlign: "center"
                }}
              >
                {state.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          padding: 20,
          background: sliderValue === 1 
            ? "rgba(16, 185, 129, 0.1)" 
            : sliderValue === 0 
            ? "rgba(245, 158, 11, 0.1)"
            : "rgba(239, 68, 68, 0.1)",
          borderRadius: 12,
          border: sliderValue === 1 
            ? "2px solid #10B981" 
            : sliderValue === 0
            ? "2px solid #F59E0B"
            : "2px solid #EF4444",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            color: sliderValue === 1 
              ? "#059669" 
              : sliderValue === 0
              ? "#D97706"
              : "#DC2626",
            marginBottom: 8
          }}>
            {currentState.label}
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#6B7280"
          }}>
            {currentState.status}
          </div>
        </div>
      </div>

      {submitted && sliderValue === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ✓ Bien. La estabilidad aumenta la confianza y sostiene el valor.
          </div>
          <motion.button
            onClick={() => {
              playSound('click')
              onComplete()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {submitted && sliderValue !== 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ marginBottom: 16 }}>
            Intenta de nuevo. Busca el punto de estabilidad.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "16px 40px",
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 900,
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif"
          }}
        >
          Continuar →
        </button>
      )}
    </motion.div>
  )
}

// L2 Card 10: Merchant perspective
function L2Card10({ onComplete }: CardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const options = [
    { id: "A", label: "Porque es bonito", correct: false },
    { id: "B", label: "Porque todos lo aceptan, la ley lo respalda y mi banco lo procesa", correct: true },
    { id: "C", label: "Porque pesa más", correct: false }
  ]

  const handleSelect = (id: string) => {
    playSound('click')
    setSelected(id)
  }

  const handleSubmit = () => {
    const isCorrect = selected === "B"
    playSound(isCorrect ? 'success' : 'error')
    setShowFeedback(true)
  }

  const handleTryAgain = () => {
    playSound('click')
    setSelected(null)
    setShowFeedback(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 850,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          style={{ fontSize: 120, marginBottom: 8 }}
        >
          💳
        </motion.div>
        <h2 style={{
          fontSize: "clamp(24px, 3.5vw, 28px)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #1F2937 0%, #0F62FE 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 16
        }}>
          Eres un comerciante
        </h2>
        <p style={{
          fontSize: 18,
          color: "#6B7280",
          fontWeight: 600
        }}>
          ¿Por qué aceptas este dinero?
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {options.map((option) => (
          <motion.div
            key={option.id}
            onClick={() => !showFeedback && handleSelect(option.id)}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
            style={{
              padding: 20,
              background: selected === option.id 
                ? "rgba(59, 130, 246, 0.1)" 
                : "rgba(255, 255, 255, 0.6)",
              border: selected === option.id 
                ? "3px solid #0F62FE" 
                : "2px solid rgba(0, 0, 0, 0.1)",
              borderRadius: 16,
              cursor: showFeedback ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: selected === option.id ? "#0F62FE" : "#E5E7EB",
              color: selected === option.id ? "#fff" : "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
              flexShrink: 0
            }}>
              {option.id}
            </div>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#1F2937"
            }}>
              {option.label}
            </div>
          </motion.div>
        ))}
      </div>

      {showFeedback && selected === "B" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ✓ Así es. Aceptabilidad + respaldo + facilidad de uso = valor.
          </div>
          <motion.button
            onClick={() => {
              playSound('click')
              onComplete()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {showFeedback && selected !== "B" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ marginBottom: 16 }}>
            Piensa en qué factores hacen que el dinero sea útil para un comerciante.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "16px 40px",
            background: selected 
              ? "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)" 
              : "#E5E7EB",
            color: selected ? "#fff" : "#9CA3AF",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 900,
            cursor: selected ? "pointer" : "not-allowed",
            fontFamily: "Montserrat, sans-serif"
          }}
        >
          Continuar →
        </button>
      )}
    </motion.div>
  )
}

// L2 Card 11: Core word
function L2Card11({ onComplete }: CardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const options = [
    { id: "metal", label: "Metal", correct: false },
    { id: "trust", label: "Confianza", correct: true },
    { id: "luck", label: "Suerte", correct: false }
  ]

  const handleSelect = (id: string) => {
    playSound('click')
    setSelected(id)
  }

  const handleSubmit = () => {
    const isCorrect = selected === "trust"
    playSound(isCorrect ? 'success' : 'error')
    setShowFeedback(true)
  }

  const handleTryAgain = () => {
    playSound('click')
    setSelected(null)
    setShowFeedback(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 850,
        width: "100%",
        background: "transparent",
        padding: "48px 40px",
        margin: "0 auto",
        marginRight: "160px",
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <h2 style={{
        fontSize: "clamp(24px, 3.5vw, 30px)",
        fontWeight: 900,
        color: "#1F2937",
        marginBottom: 32,
        textAlign: "center",
        lineHeight: 1.4
      }}>
        Hoy, ¿qué palabra resume por qué el dinero mantiene su valor?
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
        {options.map((option) => (
          <motion.div
            key={option.id}
            onClick={() => !showFeedback && handleSelect(option.id)}
            whileHover={!showFeedback ? { scale: 1.05 } : {}}
            whileTap={!showFeedback ? { scale: 0.95 } : {}}
            style={{
              padding: 24,
              background: selected === option.id 
                ? "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)" 
                : "rgba(255, 255, 255, 0.7)",
              border: selected === option.id 
                ? "3px solid #0F62FE" 
                : "2px solid rgba(0, 0, 0, 0.1)",
              borderRadius: 16,
              cursor: showFeedback ? "default" : "pointer",
              textAlign: "center",
              fontSize: 22,
              fontWeight: 800,
              color: selected === option.id ? "#fff" : "#1F2937",
              boxShadow: selected === option.id ? "0 8px 24px rgba(15, 98, 254, 0.3)" : "none"
            }}
          >
            {option.label}
          </motion.div>
        ))}
      </div>

      {showFeedback && selected === "trust" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 24,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 24
          }}
        >
          <div style={{ marginBottom: 16 }}>
            ✓ Correcto. La confianza sostiene el sistema.
          </div>
          <motion.button
            onClick={() => {
              playSound('click')
              onComplete()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {showFeedback && selected !== "trust" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            borderRadius: 16,
            color: "#fff",
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ marginBottom: 16 }}>
            Piensa en la base del dinero fiduciario moderno.
          </div>
          <motion.button
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Intentar de Nuevo
          </motion.button>
        </motion.div>
      )}

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            padding: "16px 40px",
            background: selected 
              ? "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)" 
              : "#E5E7EB",
            color: selected ? "#fff" : "#9CA3AF",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 900,
            cursor: selected ? "pointer" : "not-allowed",
            fontFamily: "Montserrat, sans-serif"
          }}
        >
          Continuar →
        </button>
      )}
    </motion.div>
  )
}

// L2 Card 12: Summary + Badge
function L2Card12({ totalXp, lessonId }: Card12Props) {
  const [showConfetti, setShowConfetti] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true)
      playSound('celebration')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Save lesson completion to user metadata
  useEffect(() => {
    const saveCompletion = async () => {
      if (!user) return

      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const currentMetadata = user.user_metadata || {}
        const completedLessons = currentMetadata.completedLessons || []

        if (!completedLessons.includes(lessonId)) {
          const updatedCompletedLessons = [...completedLessons, lessonId]

          console.log('💾 [L2] Saving lesson completion:', lessonId)
          console.log('📋 [L2] Updated list:', updatedCompletedLessons)

          await supabase.auth.updateUser({
            data: {
              ...currentMetadata,
              completedLessons: updatedCompletedLessons
            }
          })

          await supabase.auth.refreshSession()
          console.log('✅ [L2] Lesson completion saved and session refreshed')
        } else {
          console.log('⚠️ [L2] Lesson already completed:', lessonId)
        }
      } catch (error) {
        console.error('Error saving lesson completion:', error)
      }
    }

    saveCompletion()
  }, [user, lessonId])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        maxWidth: 800,
        width: "100%",
        background: "transparent",
        padding: "24px 32px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        margin: "0 auto",
        marginRight: "160px"
      }}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1
        }}>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 800, opacity: 1 }}
              animate={{
                y: [null, 800],
                x: [null, Math.random() * 800],
                opacity: [null, 0],
                rotate: [0, Math.random() * 360]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                ease: "easeOut",
                delay: Math.random() * 0.5
              }}
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                background: ['#0F62FE', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'][i % 5],
                borderRadius: "50%"
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 28px)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 16
        }}>
          ¡Lección Completada!
        </h2>

        <p style={{
          fontSize: "clamp(16px, 2.5vw, 20px)",
          lineHeight: 1.6,
          color: "#1F2937",
          marginBottom: 24,
          maxWidth: 700,
          margin: "0 auto 24px",
          fontWeight: 600
        }}>
          Ahora entiendes <strong style={{ color: "#0F62FE" }}>cómo y por qué el dinero gana valor</strong> en el mundo moderno.
        </p>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
            padding: 16,
            borderRadius: 16,
            marginBottom: 20,
            border: "2px solid #0F62FE22",
            textAlign: "left"
          }}
        >
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
            • El valor puede venir del material, del respaldo o de la confianza.<br/>
            • Hoy predomina el dinero fiduciario: ley + autoridad + aceptación.<br/>
            • Estabilidad, reglas y red sostienen su valor.
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          style={{
            padding: 16,
            background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
            borderRadius: 16,
            marginBottom: 20,
            border: "3px solid #F59E0B"
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#92400E", marginBottom: 6 }}>
            ¡Insignia Desbloqueada!
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#B45309" }}>
            Investigador del Valor 💰
          </div>
          <div style={{ fontSize: 14, color: "#92400E", marginTop: 6, fontWeight: 600 }}>
            ¡+100 XP de Bonificación!
          </div>
        </motion.div>

        {/* Total XP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 200 }}
          style={{
            padding: 20,
            background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
            borderRadius: 16,
            marginBottom: 24,
            border: "3px solid #0F62FE"
          }}
        >
          <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 600, marginBottom: 10 }}>
            Total XP Ganado
          </div>
          <div style={{
            fontSize: "clamp(36px, 6vw, 44px)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10
          }}>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: "clamp(32px, 5vw, 40px)" }}
            >
              ⭐
            </motion.span>
            {totalXp} XP
          </div>
        </motion.div>

        <motion.button
          onClick={() => {
            playSound('click')
            window.location.href = `/courses`
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: "20px 56px",
            fontSize: "clamp(18px, 2.5vw, 22px)",
            fontWeight: 900,
            color: "#fff",
            background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
            border: "none",
            borderRadius: 16,
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif"
          }}
        >
          Continuar a la Siguiente Lección →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Main Interactive Lesson Page
export default function InteractiveLessonPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { courseId, unitId, lessonId } = params as { courseId: string; unitId: string; lessonId: string }
  
  const [currentCard, setCurrentCard] = useState(1)
  const [xp, setXp] = useState(0)
  const totalCards = 12

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }
  }, [user, loading, router])

  // Disable body scroll while in interactive lesson
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleCardComplete = () => {
    // Award XP silently (shown at end)
    const xpGain = currentCard === 12 ? 110 : 10
    setXp(prev => prev + xpGain)

    // Move to next card
    if (currentCard < totalCards) {
      setCurrentCard(prev => prev + 1)
    } else {
      // Lesson complete - redirect to main lesson page
      router.push(`/learn/${courseId}/${unitId}/${lessonId}?complete=true`)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: "grid", 
        placeItems: "center", 
        minHeight: "100vh", 
        fontFamily: "Montserrat, sans-serif",
        background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64,
            height: 64,
            border: "6px solid #0F62FE22",
            borderTop: "6px solid #0F62FE",
            borderRadius: "50%",
            margin: "0 auto 24px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#374151", fontSize: 18, fontWeight: 600 }}>Cargando lección...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) return null

  return (
    <main style={{
      minHeight: "100vh",
      height: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #DBEAFE 100%)",
      fontFamily: "Montserrat, sans-serif",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden"
    }}>
      {/* Header - Card Progress Only */}
      <div style={{
        position: "fixed",
        top: 24,
        right: 32,
        zIndex: 100,
        pointerEvents: "auto"
      }}>
        {/* Card Progress */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "12px 24px",
          borderRadius: 20,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontSize: 14,
          fontWeight: 700,
          color: "#374151"
        }}>
          Tarjeta {currentCard} / {totalCards}
        </div>
      </div>

      {/* Progress Bar - Below Header */}
      <div style={{
        position: "fixed",
        top: 72,
        left: 0,
        right: 0,
        height: 8,
        background: "rgba(15, 98, 254, 0.1)",
        zIndex: 1000
      }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${(currentCard / totalCards) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #0F62FE 0%, #3B82F6 100%)",
            boxShadow: "0 0 20px rgba(15, 98, 254, 0.5)"
          }}
        />
      </div>


      {/* Exit Button */}
      <button
        onClick={() => router.push(`/learn/${courseId}/${unitId}/${lessonId}`)}
        style={{
          position: "fixed",
          top: 32,
          right: 32,
          background: "rgba(255, 255, 255, 0.95)",
          border: "none",
          borderRadius: "50%",
          width: 48,
          height: 48,
          cursor: "pointer",
          fontSize: 20,
          color: "#6B7280",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          zIndex: 100,
          display: "grid",
          placeItems: "center",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.95)"
          e.currentTarget.style.color = "#fff"
          e.currentTarget.style.transform = "scale(1.1)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)"
          e.currentTarget.style.color = "#6B7280"
          e.currentTarget.style.transform = "scale(1)"
        }}
        title="Salir de la lección"
      >
        ✕
      </button>

      {/* Main Content Area */}
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px 80px 24px",
        overflow: "hidden",
        position: "relative"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateX(-180px)"
        }}>
        <AnimatePresence mode="wait">
          {/* Lesson 1: Historia del Dinero */}
          {lessonId === 'l1-1' && (
            <>
          {currentCard === 1 && <Card1 key="card-1" onComplete={handleCardComplete} />}
          {currentCard === 2 && <Card2 key="card-2" onComplete={handleCardComplete} />}
          {currentCard === 3 && <Card3 key="card-3" onComplete={handleCardComplete} />}
          {currentCard === 4 && <Card4 key="card-4" onComplete={handleCardComplete} />}
          {currentCard === 5 && <Card5 key="card-5" onComplete={handleCardComplete} />}
          {currentCard === 6 && <Card6 key="card-6" onComplete={handleCardComplete} />}
          {currentCard === 7 && <Card7 key="card-7" onComplete={handleCardComplete} />}
          {currentCard === 8 && <Card8 key="card-8" onComplete={handleCardComplete} />}
          {currentCard === 9 && <Card9 key="card-9" onComplete={handleCardComplete} />}
          {currentCard === 10 && <Card10 key="card-10" onComplete={handleCardComplete} />}
          {currentCard === 11 && <Card11 key="card-11" onComplete={handleCardComplete} />}
          {currentCard === 12 && <Card12 key="card-12" onComplete={handleCardComplete} totalXp={xp} lessonId={lessonId} />}
            </>
          )}

          {/* Lesson 2: ¿Cómo gana valor? */}
          {lessonId === 'l1-2' && (
            <>
              {currentCard === 1 && <L2Card1 key="l2-card-1" onComplete={handleCardComplete} />}
              {currentCard === 2 && <L2Card2 key="l2-card-2" onComplete={handleCardComplete} />}
              {currentCard === 3 && <L2Card3 key="l2-card-3" onComplete={handleCardComplete} />}
              {currentCard === 4 && <L2Card4 key="l2-card-4" onComplete={handleCardComplete} />}
              {currentCard === 5 && <L2Card5 key="l2-card-5" onComplete={handleCardComplete} />}
              {currentCard === 6 && <L2Card6 key="l2-card-6" onComplete={handleCardComplete} />}
              {currentCard === 7 && <L2Card7 key="l2-card-7" onComplete={handleCardComplete} />}
              {currentCard === 8 && <L2Card8 key="l2-card-8" onComplete={handleCardComplete} />}
              {currentCard === 9 && <L2Card9 key="l2-card-9" onComplete={handleCardComplete} />}
              {currentCard === 10 && <L2Card10 key="l2-card-10" onComplete={handleCardComplete} />}
              {currentCard === 11 && <L2Card11 key="l2-card-11" onComplete={handleCardComplete} />}
              {currentCard === 12 && <L2Card12 key="l2-card-12" onComplete={handleCardComplete} totalXp={xp} lessonId={lessonId} />}
            </>
          )}
        </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
