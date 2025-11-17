"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function CelebrationPage() {
  const router = useRouter()
  const [showTrophy, setShowTrophy] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [showFinalButton, setShowFinalButton] = useState(false)

  useEffect(() => {
    // Sequence of animations
    const timer1 = setTimeout(() => setShowMessage(true), 1000)
    const timer2 = setTimeout(() => setShowTrophy(true), 3000)
    const timer3 = setTimeout(() => setShowFinalButton(true), 6000)
    const timer4 = setTimeout(() => setShowConfetti(false), 8000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  const handleFinalizar = () => {
    router.push("/")
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes balloon-float {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); }
          25% { transform: translateY(75vh) translateX(20px) rotate(5deg); }
          50% { transform: translateY(50vh) translateX(-10px) rotate(-3deg); }
          75% { transform: translateY(25vh) translateX(15px) rotate(3deg); }
          100% { transform: translateY(-10vh) translateX(0px) rotate(0deg); }
        }
        
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #ff6b6b;
          animation: confetti-fall 3s linear infinite;
        }
        
        .confetti:nth-child(2n) { background: #4ecdc4; animation-delay: 0.5s; }
        .confetti:nth-child(3n) { background: #45b7d1; animation-delay: 1s; }
        .confetti:nth-child(4n) { background: #96ceb4; animation-delay: 1.5s; }
        .confetti:nth-child(5n) { background: #feca57; animation-delay: 2s; }
        .confetti:nth-child(6n) { background: #ff9ff3; animation-delay: 2.5s; }
        
        .balloon {
          position: fixed;
          width: 60px;
          height: 80px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: balloon-float 8s linear infinite;
        }
        
        .balloon:nth-child(2n) { 
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          animation-delay: 1s;
          left: 10%;
        }
        .balloon:nth-child(3n) { 
          background: linear-gradient(45deg, #4ecdc4, #6dd5d5);
          animation-delay: 2s;
          left: 30%;
        }
        .balloon:nth-child(4n) { 
          background: linear-gradient(45deg, #45b7d1, #6bc5d1);
          animation-delay: 3s;
          left: 50%;
        }
        .balloon:nth-child(5n) { 
          background: linear-gradient(45deg, #96ceb4, #a8d5c4);
          animation-delay: 4s;
          left: 70%;
        }
        .balloon:nth-child(6n) { 
          background: linear-gradient(45deg, #feca57, #fed976);
          animation-delay: 5s;
          left: 90%;
        }
        
        .balloon::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 40px;
          background: #8b4513;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Confetti */}
        {showConfetti && (
          <>
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </>
        )}

        {/* Balloons */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="balloon"
            style={{
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            textAlign: "center",
            zIndex: 10,
            position: "relative"
          }}
        >
          {/* Title */}
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: "4rem",
              fontWeight: 800,
              color: "#fff",
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              marginBottom: "2rem",
              background: "linear-gradient(45deg, #FFD700, #FFA500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            🎉 ¡FELICITACIONES! 🎉
          </motion.h1>

          {/* Characters */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3rem",
              marginBottom: "2rem"
            }}
          >
            {/* Billy */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: "200px",
                height: "200px",
                position: "relative"
              }}
            >
              <img
                src="/2.png"
                alt="Billy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 8px 25px rgba(0,0,0,0.3))"
                }}
              />
            </motion.div>

            {/* Drago */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -3, 0, 3, 0]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              style={{
                width: "200px",
                height: "200px",
                position: "relative"
              }}
            >
              <img
                src="/drago1.png"
                alt="Drago"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 8px 25px rgba(0,0,0,0.3))"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Message */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  padding: "2rem 3rem",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  marginBottom: "2rem",
                  maxWidth: "800px",
                  backdropFilter: "blur(10px)"
                }}
              >
                <motion.p
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    color: "#333",
                    lineHeight: 1.6,
                    margin: 0
                  }}
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span style={{ color: "#0F62FE", fontSize: "2rem" }}>Dragón</span>, eres un crack! 🚀<br />
                  Acabas de terminar la <strong style={{ color: "#0F62FE" }}>microcredencial Mondragón</strong> con un desempeño excelente!<br />
                  <span style={{ fontSize: "1.5rem", color: "#666" }}>Aquí tienes tu trofeo, campeón! 🏆</span>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trophy Animation */}
          <AnimatePresence>
            {showTrophy && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -20, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut",
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                style={{
                  fontSize: "8rem",
                  marginBottom: "2rem",
                  filter: "drop-shadow(0 10px 30px rgba(255,215,0,0.5))"
                }}
              >
                🏆
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final Button */}
          <AnimatePresence>
            {showFinalButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  boxShadow: [
                    "0 0 0 0 rgba(15, 98, 254, 0.4)",
                    "0 0 0 20px rgba(15, 98, 254, 0)",
                    "0 0 0 0 rgba(15, 98, 254, 0)"
                  ]
                }}
                transition={{ 
                  duration: 0.5,
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(15, 98, 254, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinalizar}
                style={{
                  background: "linear-gradient(135deg, #0F62FE, #2563EB)",
                  color: "#fff",
                  border: "none",
                  padding: "1.5rem 3rem",
                  borderRadius: "50px",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  boxShadow: "0 10px 30px rgba(15, 98, 254, 0.3)",
                  transition: "all 0.3s ease"
                }}
              >
                🎯 Finalizar
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "6px",
              height: "6px",
              background: "#FFD700",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </>
  )
}
