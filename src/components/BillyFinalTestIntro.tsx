"use client"

import * as React from 'react'
import { motion } from 'framer-motion'

type BillyFinalTestIntroProps = {
  onContinue: () => void
}

export default function BillyFinalTestIntro({ onContinue }: BillyFinalTestIntroProps) {

  return (
    <div style={{
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 9998,
    }}>
      <div style={{
        maxWidth: "1000px",
        width: "100%",
        textAlign: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "40px",
            flexWrap: "wrap" as const,
          }}
        >
          {/* Billy Character */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/drago1.png"
              alt="Billy hablando"
              style={{
                width: "clamp(150px, 30vw, 250px)",
                height: "clamp(150px, 30vw, 250px)",
                objectFit: "contain",
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.2))",
              }}
            />
          </div>
          
          {/* Speech Bubble */}
          <div style={{
            position: "relative" as const,
            background: "#FBFAF5",
            borderRadius: "clamp(16px, 3vw, 24px)",
            padding: "clamp(20px, 4vw, 32px) clamp(24px, 5vw, 40px)",
            boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
            border: "4px solid #0F62FE",
            maxWidth: "600px",
          }}>
            <div style={{
              position: "absolute" as const,
              left: -24,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "20px solid transparent",
              borderBottom: "20px solid transparent",
              borderRight: "24px solid #0F62FE",
            }} />
            <div style={{
              position: "absolute" as const,
              left: -18,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "17px solid transparent",
              borderBottom: "17px solid transparent",
              borderRight: "21px solid #fff",
            }} />
            
            <p style={{
              margin: 0,
              fontSize: "clamp(16px, 4vw, 22px)",
              lineHeight: 1.6,
              color: "#1e293b",
              fontWeight: 500,
            }}>
              ¿Recuerdas el quiz diagnóstico del inicio? Ahora realizarás el mismo quiz para medir tu progreso, y con esto ¡terminarás!
            </p>
          </div>
        </motion.div>

        <motion.button
          onClick={() => {
            console.log('Button clicked! Calling onContinue...');
            onContinue();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: "clamp(12px, 3vw, 16px) clamp(32px, 6vw, 48px)",
            borderRadius: "clamp(12px, 3vw, 16px)",
            background: "linear-gradient(135deg, #0F62FE, #3B82F6)",
            color: "white",
            fontSize: "clamp(16px, 4vw, 20px)",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(15, 98, 254, 0.4)"
          }}
        >
          ¡Empezar Test Final!
        </motion.button>
      </div>
    </div>
  )
}

