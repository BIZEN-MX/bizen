"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { playCelebrationSound } from "@/utils/sounds"

/**
 * Course Completion Page
 * 
 * This page is shown after completing the Final Test.
 * Displays a celebration animation with Billy.
 * 
 * URL: /course-complete
 */

export default function CourseCompletePage() {
  const primaryColor = "#0F62FE"
  const [isMouthOpen, setIsMouthOpen] = React.useState(false)
  const [showBilly, setShowBilly] = React.useState(false)
  
  // Play celebration sound on mount
  React.useEffect(() => {
    playCelebrationSound()
  }, [])
  
  // Billy talking animation
  React.useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowBilly(true)
      
      // Animate mouth for 3 seconds
      const interval = setInterval(() => {
        setIsMouthOpen(prev => !prev)
      }, 300)
      
      const stopTimer = setTimeout(() => {
        clearInterval(interval)
        setIsMouthOpen(false)
      }, 3000)
      
      return () => {
        clearInterval(interval)
        clearTimeout(stopTimer)
      }
    }, 1000)
    
    return () => clearTimeout(showTimer)
  }, [])

  return (
    <main 
      style={{ 
        minHeight: "100vh",
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        background: "#FFFFFF",
        padding: 24,
        position: "relative" as const,
        overflow: "hidden"
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute" as const,
          inset: 0,
          opacity: 0.05,
          background: `radial-gradient(circle at 50% 50%, ${primaryColor}, transparent 70%)`
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "relative" as const,
          zIndex: 1,
          textAlign: "center",
          maxWidth: 600
        }}
      >
        {/* Emoji animation */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatDelay: 2
          }}
          style={{ fontSize: 80, marginBottom: 24 }}
        >
          🎉
        </motion.div>

        <h1 style={{ 
          fontSize: 48, 
          margin: 0, 
          marginBottom: 16,
          fontWeight: 500,
          color: primaryColor
        }}>
          ¡Felicitaciones!
        </h1>
        
        <p style={{ 
          fontSize: 24, 
          color: "#666", 
          margin: 0,
          marginBottom: 8
        }}>
          Has completado exitosamente el curso BIZEN
        </p>

        <p style={{ 
          fontSize: 18, 
          color: "#999", 
          margin: 0,
          marginBottom: 48
        }}>
          ¡Tu viaje de aprendizaje ha sido increíble!
        </p>

        {/* Billy with speech bubble */}
        {showBilly && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 48,
              gap: 24
            }}
          >
            {/* Speech bubble */}
            <div
              style={{
                position: "relative",
                background: "white",
                borderRadius: 20,
                padding: 20,
                boxShadow: "0 8px 24px rgba(15, 98, 254, 0.15)",
                border: "3px solid #0F62FE",
                maxWidth: 500,
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#0F62FE",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                ¡Felicidades, Dragón! Has demostrado excelencia en tu aprendizaje y has completado exitosamente tu jornada BIZEN 🎓
              </p>
              
              {/* Speech bubble tail pointing to Billy */}
              <div
                style={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "20px solid transparent",
                  borderBottom: "20px solid transparent",
                  borderLeft: "24px solid #0F62FE",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -15,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "17px solid transparent",
                  borderBottom: "17px solid transparent",
                  borderLeft: "20px solid white",
                }}
              />
            </div>
            
            {/* Billy Character */}
            <Image
              src={isMouthOpen ? "/3.png" : "/2.png"}
              alt="Billy celebrando"
              width={250}
              height={250}
              style={{
                display: "block",
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))",
              }}
              priority
            />
          </motion.div>
        )}

        {/* Continue button */}
        <Link href="/modules/menu" passHref>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "20px 48px",
              fontSize: 20,
              fontWeight: 500,
              color: "white",
              background: `linear-gradient(135deg, ${primaryColor}, #3B82F6)`,
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 10px 40px rgba(15, 98, 254, 0.4)",
            }}
          >
            Volver al Menú de Módulos
          </motion.button>
        </Link>
      </motion.div>
    </main>
  )
}

