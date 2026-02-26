"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PartyIcon, RocketIcon, BookIcon, StarIcon } from "@/components/CustomIcons"

interface BillyWelcomeScreenProps {
  userName: string
  isReturningUser?: boolean
  redirectTo?: string
  autoCloseAfter?: number // milliseconds
  titleMessage?: string
  description?: string
}

/**
 * Billy welcome screen that appears after login/signup
 * - New users: "Bienvenido [name]" → Diagnostic Quiz
 * - Returning users: "Bienvenido de nuevo [name]" → Modules Menu
 */
export default function BillyWelcomeScreen({
  userName,
  isReturningUser = false,
  redirectTo,
  autoCloseAfter = 5000,
  titleMessage,
  description,
}: BillyWelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(autoCloseAfter / 1000)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  const message = titleMessage
    || (isReturningUser
      ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>¡Bienvenido de nuevo, {userName}! <PartyIcon size={40} color="#0F62FE" /></span> as any
      : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>¡Bienvenido, {userName}! <RocketIcon size={40} color="#0F62FE" /></span> as any)

  // Generate stable random values for particles
  const particleData = useState(() =>
    [...Array(20)].map(() => ({
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
      xVariance: Math.random() * 20 - 10,
      yPath: [0, -30 - Math.random() * 20, -60 - Math.random() * 30, -30 - Math.random() * 20, 0],
    }))
  )[0]

  // Generate stable orb animation data
  const orbAnimations = useState(() =>
    [...Array(6)].map(() => ({
      xPath: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
      yPath: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      duration: 10 + Math.random() * 10,
    }))
  )[0]

  useEffect(() => {
    // Fade in animation with appearing effect
    setTimeout(() => setIsVisible(true), 100)

    // Show message after Billy appears
    setTimeout(() => setShowMessage(true), 400)
  }, [])

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Auto redirect after countdown
  useEffect(() => {
    if (timeRemaining === 0 && !isRedirecting) {
      setIsRedirecting(true)
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [timeRemaining, isRedirecting, redirectTo, router])

  const handleSkip = () => {
    if (redirectTo) {
      router.push(redirectTo)
    }
  }

  return (
    <motion.div
      animate={{
        background: [
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
          "linear-gradient(135deg, #4facfe 0%, #f093fb 25%, #764ba2 50%, #667eea 75%, #00f2fe 100%)",
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)"
        ]
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.6s ease",
        overflow: "hidden" as const,
      }}
    >
      {/* Decorative floating particles */}
      {particleData.map((particle, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: particle.width,
            height: particle.height,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            top: `${particle.top}%`,
            left: `${particle.left}%`,
          }}
          animate={{
            y: particle.yPath,
            x: [0, particle.xVariance, particle.xVariance * 1.5, particle.xVariance, 0],
            opacity: [0, 0.5, 1, 0.5, 0],
            scale: [0, 1, 1.5, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Decorative gradient orbs */}
      {[
        { colors: ["rgba(102, 126, 234, 0.6)", "rgba(118, 75, 162, 0.4)"], size: 180 },
        { colors: ["rgba(79, 172, 254, 0.6)", "rgba(240, 147, 251, 0.4)"], size: 200 },
        { colors: ["rgba(118, 75, 162, 0.6)", "rgba(102, 126, 234, 0.4)"], size: 160 },
        { colors: ["rgba(240, 147, 251, 0.6)", "rgba(79, 172, 254, 0.4)"], size: 190 },
        { colors: ["rgba(4, 195, 254, 0.6)", "rgba(240, 147, 251, 0.4)"], size: 170 },
        { colors: ["rgba(102, 126, 234, 0.6)", "rgba(4, 195, 254, 0.4)"], size: 210 },
      ].map((orb, i) => {
        const startX = i % 3 === 0 ? "10%" : i % 3 === 1 ? "50%" : "80%"
        const startY = i < 3 ? "20%" : "60%"
        const anim = orbAnimations[i]
        return (
          <motion.div
            key={`orb-${i}`}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              filter: "blur(50px)",
              opacity: 0.4,
              background: `linear-gradient(135deg, ${orb.colors[0]}, ${orb.colors[1]})`,
              left: startX,
              top: startY,
            }}
            animate={{
              x: anim.xPath,
              y: anim.yPath,
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: anim.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
      {/* Billy Container */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: isVisible ? 1 : 0.5,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        {/* Speech Bubble */}
        {showMessage && (
          <motion.div
            animate={{
              y: [0, -3, 0],
              boxShadow: [
                "0 10px 40px rgba(0,0,0,0.3)",
                "0 15px 50px rgba(15, 98, 254, 0.4)",
                "0 10px 40px rgba(0,0,0,0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              top: -40,
              left: "50%",
              transform: "translateX(-50%) translateY(-100%)",
              background: "linear-gradient(135deg, #ffffff, #f8faff)",
              border: "4px solid #0F62FE",
              borderRadius: 30,
              padding: "25px 40px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              minWidth: 350,
              maxWidth: "90vw",
              textAlign: "center",
              animation: "popIn 0.5s ease-out",
              overflow: "hidden" as const,
            }}
          >
            <motion.p
              animate={{
                y: [0, -5, 0],
                textShadow: [
                  "0 0 0px rgba(15, 98, 254, 0)",
                  "0 0 20px rgba(15, 98, 254, 0.4)",
                  "0 0 0px rgba(15, 98, 254, 0)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                fontSize: "clamp(32px, 8vw, 48px)",
                fontWeight: 900,
                margin: 0,
                lineHeight: 1.4,
                background: "linear-gradient(45deg, #0F62FE, #10B981, #8B5CF6, #0F62FE)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 4s ease-in-out infinite",
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {message}
            </motion.p>
            <motion.p
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              style={{
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: 600,
                margin: "8px 0 0 0",
                lineHeight: 1.3,
                background: "linear-gradient(45deg, #0F62FE, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {description || (isReturningUser ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  ¡Continuemos tu aprendizaje! <BookIcon size={24} color="#0F62FE" />
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  ¡Empecemos esta aventura juntos! <StarIcon size={24} color="#0F62FE" />
                </span>
              ))}
            </motion.p>

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
                borderTop: "20px solid #0F62FE",
              }}
            />
          </motion.div>
        )}

        {/* Billy Character */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: "drop-shadow(0 8px 25px rgba(15, 98, 254, 0.3))",
          }}
        >
          <Image
            src="/drago1.png"
            alt="Billy"
            width={400}
            height={400}
            style={{ display: "block" }}
            priority
          />
        </motion.div>

        {/* Skip/Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: -120,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center" as const,
            gap: 16,
            zIndex: 100,
          }}
        >
          {/* Countdown Indicator */}
          <div style={{
            position: "relative",
            width: 200,
            height: 6,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: 10,
            overflow: "hidden" as const,
          }}>
            <motion.div
              animate={{
                width: `${(timeRemaining / (autoCloseAfter / 1000)) * 100}%`,
              }}
              transition={{ duration: 1, ease: "linear" }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #fff, #00f2fe)",
                borderRadius: 10,
              }}
            />
          </div>

          <motion.button
            onClick={handleSkip}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "14px 40px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              borderRadius: 30,
              color: "#0F62FE",
              fontSize: "clamp(18px, 4vw, 22px)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {timeRemaining > 0 ? `Continuar en ${timeRemaining}s` : 'Continuar →'}
          </motion.button>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%) scale(0.8);
          }
          60% {
            transform: translateX(-50%) translateY(-100%) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-100%) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </motion.div>
  )
}