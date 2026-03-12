"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { playCelebrationSound } from "@/utils/sounds"

interface BillyCelebrationProps {
  message?: string
  onClose?: () => void
  autoCloseAfter?: number // milliseconds
  accentColor?: string // Color for borders and button
  showCloseButton?: boolean // Whether to show the "Continuar" button
  playSound?: boolean // Whether to play celebration sound
}

/**
 * Billy celebration component that appears when user completes a section
 * Shows Billy with animated mouth and a speech bubble
 */
export default function BillyCelebration({
  message = "¡Bien hecho, Dragón!",
  onClose,
  autoCloseAfter = 3000,
  accentColor = "#10B981", // Default green
  showCloseButton = true,
  playSound = false,
}: BillyCelebrationProps) {
  const [isMouthOpen, setIsMouthOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Play celebration sound if requested
    if (playSound) {
      playCelebrationSound()
    }

    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
    
    // Show message after Billy appears
    setTimeout(() => setShowMessage(true), 300)

    // Animate mouth opening and closing
    const mouthInterval = setInterval(() => {
      setIsMouthOpen(prev => !prev)
    }, 400)

    // Auto close after specified time
    let closeTimer: NodeJS.Timeout
    if (autoCloseAfter > 0) {
      closeTimer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onClose?.()
        }, 300) // Wait for fade out animation
      }, autoCloseAfter)
    }

    return () => {
      clearInterval(mouthInterval)
      if (closeTimer) clearTimeout(closeTimer)
    }
  }, [autoCloseAfter, onClose, playSound])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
          backdropFilter: "blur(4px)",
        }}
        onClick={handleClose}
      >
        {/* Billy Container */}
        <div
          style={{
            position: "relative",
            transform: isVisible ? "scale(1)" : "scale(0.8)",
            transition: "transform 0.3s ease",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking Billy
        >
          {/* Speech Bubble */}
          {showMessage && (
            <div
                style={{
                  position: "absolute",
                  top: -20,
                  left: "50%",
                  transform: "translateX(-50%) translateY(-100%)",
                  background: "white",
                  border: `4px solid ${accentColor}`,
                  borderRadius: 24,
                  padding: "clamp(12px, 3vw, 25px) clamp(15px, 4vw, 40px)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  width: "max-content",
                  minWidth: "min(280px, 90vw)",
                  maxWidth: "92vw",
                  textAlign: "center",
                  animation: "popIn 0.3s ease-out",
                }}
            >
              <p
                style={{
                  fontSize: "clamp(20px, 6vw, 32px)",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {message}
              </p>
              
              {/* Speech bubble tail */}
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: `20px solid ${accentColor}`,
                }}
              />
            </div>
          )}

          {/* Billy Character */}
          <div style={{
            width: "clamp(200px, 60vw, 400px)",
            height: "auto",
            margin: "0 auto"
          }}>
            <img
              src={isMouthOpen ? "/3.png" : "/2.png"}
              alt="Billy"
              style={{ 
                display: "block",
                width: "100%",
                height: "auto"
              }}
            />
          </div>

          {/* Close button (optional) */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                bottom: -60,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "12px 30px",
                fontSize: 18,
                fontWeight: 500,
                background: accentColor,
                color: "white",
                border: "none",
                borderRadius: 50,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: `0 4px 15px ${accentColor}40`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(-50%) scale(1.05)"
                e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}60`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(-50%) scale(1)"
                e.currentTarget.style.boxShadow = `0 4px 15px ${accentColor}40`
              }}
            >
              Continuar →
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-100%) scale(1);
          }
        }
      `}</style>
    </>
  )
}


