"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Floating financial keywords
const FLOAT_WORDS = [
  "Bitcoin", "ETF", "ROI", "S&P 500", "Compound", "Dividendo", "Acciones",
  "Forex", "Nasdaq", "Cripto", "Bonos", "Portafolio", "Ahorro", "Inversión",
  "APR", "Fintech", "CETES", "Patrimonio", "Liquidez", "Inflación",
]

const ORBS = [
  { top: "8%",   left: "12%",  size: 340, color: "rgba(139,92,246,0.13)",  blur: 90,  dur: 22, delay: 0 },
  { top: "55%",  left: "-8%",  size: 260, color: "rgba(15,98,254,0.10)",   blur: 70,  dur: 28, delay: 4 },
  { top: "15%",  left: "72%",  size: 300, color: "rgba(236,72,153,0.08)",  blur: 80,  dur: 32, delay: 8 },
  { top: "70%",  left: "60%",  size: 380, color: "rgba(16,185,129,0.07)",  blur: 100, dur: 26, delay: 2 },
  { top: "40%",  left: "38%",  size: 200, color: "rgba(251,191,36,0.07)",  blur: 60,  dur: 18, delay: 6 },
]

const WORDS_PLACED = FLOAT_WORDS.map((word, i) => ({
  word,
  top: `${8 + (i * 4.5) % 85}%`,
  left: `${5 + (i * 7.3) % 88}%`,
  dur: 14 + (i % 5) * 4,
  delay: (i * 1.1) % 8,
  opacity: 0.04 + (i % 3) * 0.015,
  size: 10 + (i % 4) * 2,
}))

interface Star {
  id: number
  top: string
  left: string
  size: number
  opacity: number
  dur: number
  delay: number
}

export default function AuthBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const generatedStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      dur: Math.random() * 5 + 3,
      delay: Math.random() * 6,
    }))
    setStars(generatedStars)
  }, [])

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* ── Deep space base ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 120% 80% at 50% 0%, #0a0520 0%, #01040f 50%, #000308 100%)",
        }}
      />

      {/* ── Noise texture overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Perspective Grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          backgroundPosition: "center center",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* ── Glowing horizontal scanline ── */}
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.3) 20%, rgba(15,98,254,0.5) 50%, rgba(139,92,246,0.3) 80%, transparent 100%)",
          boxShadow: "0 0 20px rgba(139,92,246,0.3)",
          top: "40%",
        }}
        animate={{ top: ["20%", "80%", "20%"], opacity: [0, 0.6, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Ambient Orbs ── */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
          }}
          animate={{
            scale: [1, 1.15, 0.95, 1],
            x: [0, 20, -15, 0],
            y: [0, -25, 10, 0],
            opacity: [0.7, 1, 0.8, 0.7],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* ── Star field (Only render stars on client to avoid hydration mismatch) ── */}
      {mounted && stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            background: "white",
            opacity: star.opacity,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 3, star.opacity] }}
          transition={{
            duration: star.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      {/* ── Shooting stars ── */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`shoot-${i}`}
          style={{
            position: "absolute",
            top: `${15 + i * 25}%`,
            left: "-5%",
            width: 120 + i * 40,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            borderRadius: 1,
          }}
          animate={{ x: ["0%", "130vw"], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5 + i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 5 + i * 7,
            repeatDelay: 12 + i * 5,
          }}
        />
      ))}

      {/* ── Floating financial terms ── */}
      {WORDS_PLACED.map(({ word, top, left, dur, delay, opacity, size }) => (
        <motion.span
          key={word}
          style={{
            position: "absolute",
            top,
            left,
            fontSize: size,
            fontFamily: "monospace",
            color: "white",
            opacity,
            fontWeight: 700,
            letterSpacing: "0.1em",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
          animate={{ y: [0, -12, 0], opacity: [opacity, opacity * 2.5, opacity] }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
        />
      ))}

      {/* ── Corner vignette ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  )
}
