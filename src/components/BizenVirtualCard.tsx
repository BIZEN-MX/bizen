"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Wifi, Send, Gift, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

// Types & Themes
export type CardTheme = "blue" | "emerald" | "violet" | "rose" | "pink" | "amber" | "slate" | "obsidian" | "anahuac"
export type CardTier = "plastic" | "metal" | "carbon" | "legendary"

export function getTierFromLevel(level: number): CardTier {
  if (level >= 20) return "legendary"
  if (level >= 10) return "carbon"
  if (level >= 5)  return "metal"
  return "plastic"
}

interface BizenVirtualCardProps {
  bizcoins: number
  holderName: string
  animationDelay?: string
  colorTheme?: CardTheme
  level?: number
  showTierBadge?: boolean
  onTransferClick?: () => void
  onRedeemClick?: () => void
  hideButtons?: boolean
  pattern?: "none" | "geometric" | "circuit" | "dots"
}

const THEMES: Record<CardTheme, {
  bg: string
  highlight: string
  orb1: string
  orb2: string
  orb3: string
  textGlow: string
  shadowHover: string
  shadowIdle: string
  borderGlow: string
  accentColor: string
}> = {
  blue: {
    bg: "linear-gradient(135deg, #060d23 0%, #0d1f5c 25%, #1a3fa8 55%, #2563eb 80%, #60a5fa 100%)",
    highlight: "linear-gradient(135deg, rgba(96,165,250,0.3) 0%, transparent 60%)",
    orb1: "rgba(59,130,246,0.55)", orb2: "rgba(147,197,253,0.35)", orb3: "rgba(30,58,138,0.6)",
    textGlow: "rgba(147,197,253,0.8)", shadowHover: "0 35px 80px rgba(37,99,235,0.6), 0 0 120px rgba(59,130,246,0.2)",
    shadowIdle: "0 20px 50px rgba(37,99,235,0.35)", borderGlow: "rgba(96,165,250,0.5)",
    accentColor: "#93c5fd",
  },
  emerald: {
    bg: "linear-gradient(135deg, #011a11 0%, #044d2c 25%, #06773e 55%, #059669 80%, #34d399 100%)",
    highlight: "linear-gradient(135deg, rgba(52,211,153,0.3) 0%, transparent 60%)",
    orb1: "rgba(5,150,105,0.55)", orb2: "rgba(52,211,153,0.35)", orb3: "rgba(4,77,44,0.6)",
    textGlow: "rgba(110,231,183,0.8)", shadowHover: "0 35px 80px rgba(5,150,105,0.6), 0 0 120px rgba(16,185,129,0.2)",
    shadowIdle: "0 20px 50px rgba(5,150,105,0.35)", borderGlow: "rgba(52,211,153,0.5)",
    accentColor: "#6ee7b7",
  },
  violet: {
    bg: "linear-gradient(135deg, #1a0b3c 0%, #4c1d95 25%, #6d28d9 55%, #8b5cf6 80%, #c4b5fd 100%)",
    highlight: "linear-gradient(135deg, rgba(167,139,250,0.3) 0%, transparent 60%)",
    orb1: "rgba(139,92,246,0.6)", orb2: "rgba(196,181,253,0.4)", orb3: "rgba(76,29,149,0.7)",
    textGlow: "rgba(196,181,253,0.85)", shadowHover: "0 35px 80px rgba(139,92,246,0.65), 0 0 120px rgba(167,139,250,0.25)",
    shadowIdle: "0 20px 50px rgba(139,92,246,0.4)", borderGlow: "rgba(196,181,253,0.5)",
    accentColor: "#ddd6fe",
  },
  rose: {
    bg: "linear-gradient(135deg, #200010 0%, #66061d 25%, #b90e32 55%, #e11d48 80%, #fb7185 100%)",
    highlight: "linear-gradient(135deg, rgba(251,113,133,0.3) 0%, transparent 60%)",
    orb1: "rgba(225,29,72,0.55)", orb2: "rgba(251,113,133,0.35)", orb3: "rgba(102,6,29,0.6)",
    textGlow: "rgba(253,164,175,0.8)", shadowHover: "0 35px 80px rgba(225,29,72,0.6), 0 0 120px rgba(244,63,94,0.2)",
    shadowIdle: "0 20px 50px rgba(225,29,72,0.35)", borderGlow: "rgba(251,113,133,0.5)",
    accentColor: "#fda4af",
  },
  pink: {
    bg: "linear-gradient(135deg, #2a0018 0%, #700b46 25%, #be185d 55%, #ec4899 80%, #f9a8d4 100%)",
    highlight: "linear-gradient(135deg, rgba(244,114,182,0.3) 0%, transparent 60%)",
    orb1: "rgba(236,72,153,0.55)", orb2: "rgba(244,114,182,0.35)", orb3: "rgba(131,24,67,0.6)",
    textGlow: "rgba(251,207,232,0.8)", shadowHover: "0 35px 80px rgba(236,72,153,0.6), 0 0 120px rgba(244,114,182,0.2)",
    shadowIdle: "0 20px 50px rgba(236,72,153,0.35)", borderGlow: "rgba(244,114,182,0.5)",
    accentColor: "#fbcfe8",
  },
  amber: {
    bg: "linear-gradient(135deg, #1c0a00 0%, #6b2700 25%, #c45a00 55%, #d97706 80%, #fbbf24 100%)",
    highlight: "linear-gradient(135deg, rgba(251,191,36,0.3) 0%, transparent 60%)",
    orb1: "rgba(217,119,6,0.55)", orb2: "rgba(251,191,36,0.35)", orb3: "rgba(107,39,0,0.6)",
    textGlow: "rgba(252,211,77,0.8)", shadowHover: "0 35px 80px rgba(217,119,6,0.6), 0 0 120px rgba(245,158,11,0.2)",
    shadowIdle: "0 20px 50px rgba(217,119,6,0.35)", borderGlow: "rgba(251,191,36,0.5)",
    accentColor: "#fcd34d",
  },
  slate: {
    bg: "linear-gradient(135deg, #060810 0%, #0f172a 25%, #1e2e4a 55%, #2d4165 80%, #64748b 100%)",
    highlight: "linear-gradient(135deg, rgba(148,163,184,0.25) 0%, transparent 60%)",
    orb1: "rgba(71,85,105,0.55)", orb2: "rgba(148,163,184,0.3)", orb3: "rgba(15,23,42,0.7)",
    textGlow: "rgba(203,213,225,0.7)", shadowHover: "0 35px 80px rgba(30,41,59,0.8), 0 0 120px rgba(71,85,105,0.2)",
    shadowIdle: "0 20px 50px rgba(30,41,59,0.5)", borderGlow: "rgba(148,163,184,0.4)",
    accentColor: "#cbd5e1",
  },
  obsidian: {
    bg: "linear-gradient(135deg, #000000 0%, #0a0a0a 30%, #141414 60%, #1c1c1c 80%, #2a2a2a 100%)",
    highlight: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
    orb1: "rgba(63,63,70,0.4)", orb2: "rgba(113,113,122,0.25)", orb3: "rgba(9,9,11,0.8)",
    textGlow: "rgba(212,212,216,0.6)", shadowHover: "0 35px 80px rgba(0,0,0,0.9), 0 0 120px rgba(50,50,50,0.15)",
    shadowIdle: "0 20px 50px rgba(0,0,0,0.7)", borderGlow: "rgba(113,113,122,0.3)",
    accentColor: "#a1a1aa",
  },
  anahuac: {
    bg: "#FF5900",
    highlight: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)",
    orb1: "rgba(255,255,255,0.15)", orb2: "rgba(255,255,255,0.1)", orb3: "rgba(0,0,0,0.1)",
    textGlow: "rgba(255,255,255,0.4)", shadowHover: "0 35px 80px rgba(255,89,0,0.5), 0 0 120px rgba(255,89,0,0.15)",
    shadowIdle: "0 20px 50px rgba(255,89,0,0.3)", borderGlow: "rgba(255,255,255,0.2)",
    accentColor: "#ffffff",
  },
}

const TIER_CONFIG: Record<CardTier, {
  label: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
  extraShadow?: string
}> = {
  plastic: { label: "STANDARD", badgeBg: "rgba(255,255,255,0.08)", badgeBorder: "rgba(255,255,255,0.15)", badgeText: "rgba(255,255,255,0.5)" },
  metal: { label: "METAL", badgeBg: "rgba(209,213,219,0.15)", badgeBorder: "rgba(209,213,219,0.4)", badgeText: "rgba(229,231,235,0.95)", extraShadow: "0 0 40px rgba(209,213,219,0.12)" },
  carbon: { label: "CARBON", badgeBg: "rgba(10,10,10,0.7)", badgeBorder: "rgba(100,116,139,0.6)", badgeText: "rgba(148,163,184,1)", extraShadow: "0 0 50px rgba(15,98,254,0.2)" },
  legendary: { label: "✦ LEGENDARY", badgeBg: "linear-gradient(90deg, rgba(217,119,6,0.5), rgba(251,191,36,0.35))", badgeBorder: "rgba(251,191,36,0.7)", badgeText: "#fbbf24", extraShadow: "0 0 80px rgba(251,191,36,0.3)" },
}

// --- Card Chip (EMV) ---
const ChipSVG = () => (
  <svg width="42" height="32" viewBox="0 0 48 38">
    <defs>
      <linearGradient id="chipG" x1="0" y1="0" x2="48" y2="38">
        <stop offset="0%" stopColor="#efc14b"/>
        <stop offset="50%" stopColor="#d4a843"/>
        <stop offset="100%" stopColor="#a37c2a"/>
      </linearGradient>
    </defs>
    <rect width="48" height="38" rx="5" fill="url(#chipG)"/>
    <rect x="3" y="3" width="42" height="32" rx="4" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
    <line x1="0" y1="12" x2="48" y2="12" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
    <line x1="0" y1="26" x2="48" y2="26" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
    <line x1="16" y1="0" x2="16" y2="38" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
    <line x1="32" y1="0" x2="32" y2="38" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
    <rect x="16" y="12" width="16" height="14" rx="1.5" fill="rgba(0,0,0,0.08)"/>
  </svg>
)

const BizenWordmark = ({ accentColor }: { accentColor: string }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: "0.8cqw" }}>
    <span style={{ fontSize: "clamp(12px, 5cqw, 22px)", fontWeight: 400, color: "white", letterSpacing: "-0.05cqw", fontFamily: "var(--font-family)" }}>BIZEN</span>
  </div>
)

export default function BizenVirtualCard({
  bizcoins, holderName, animationDelay = "0s",
  colorTheme = "blue", level = 1, showTierBadge = true,
  onTransferClick, onRedeemClick, hideButtons = false, pattern = "none"
}: BizenVirtualCardProps) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [displayBizcoins, setDisplayBizcoins] = useState(bizcoins)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number | null>(null)
  const countRafRef = useRef<number | null>(null)

  const { user } = useAuth()
  const userEmail = (user?.email || (user as any)?.emailAddresses?.[0]?.emailAddress || "").toLowerCase()
  const isAnahuac = colorTheme === 'anahuac' || userEmail.endsWith('@anahuac.mx') || userEmail.includes('.anahuac.mx') || userEmail.endsWith('@bizen.mx')
  
  let finalColorTheme = colorTheme
  if (!colorTheme && isAnahuac) {
    finalColorTheme = 'anahuac'
  }

  let theme = THEMES[finalColorTheme] || THEMES.blue

  const tier = getTierFromLevel(level)
  const tierCfg = TIER_CONFIG[tier]

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotX = ((y / rect.height) - 0.5) * -22
    const rotY = ((x / rect.width) - 0.5) * 26
    const gx = (x / rect.width) * 100
    const gy = (y / rect.height) * 100
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ x: rotX, y: rotY })
      setGlowPos({ x: gx, y: gy })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setTilt({ x: 0, y: 0 })
    setGlowPos({ x: 50, y: 50 })
    setIsHovered(false)
  }, [])

  useEffect(() => {
    if (displayBizcoins === bizcoins) return
    const start = displayBizcoins; const end = bizcoins; const duration = 800; const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime; const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setDisplayBizcoins(Math.floor(start + (end - start) * ease))
      if (progress < 1) countRafRef.current = requestAnimationFrame(animate)
    }
    countRafRef.current = requestAnimationFrame(animate)
    return () => { if (countRafRef.current) cancelAnimationFrame(countRafRef.current) }
  }, [bizcoins])

  const lastFour = String(bizcoins).padStart(4, "0").slice(-4)
  const nameParts = (holderName || "USUARIO BIZEN").trim().split(/\s+/)
  const displayName = (nameParts.length > 2 ? `${nameParts[0]} ${nameParts[1]}` : nameParts.join(" ")).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: parseFloat(animationDelay) }}
      style={{ width: "100%", maxWidth: 440, perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          width: "100%",
          aspectRatio: "1.586/1",
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? "transform 0.05s linear" : "transform 0.5s ease",
          boxShadow: isHovered ? theme.shadowHover : theme.shadowIdle,
          background: theme.bg,
          transformStyle: "preserve-3d",
          containerType: "inline-size",
          fontFamily: "var(--font-family)"
        }}
      >
        {/* Glow Effects */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "70%", height: "70%", background: `radial-gradient(circle, ${theme.orb1} 0%, transparent 70%)`, filter: "blur(40px)", opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "60%", height: "60%", background: `radial-gradient(circle, ${theme.orb2} 0%, transparent 70%)`, filter: "blur(40px)", opacity: 0.4 }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`, pointerEvents: "none", opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }} />

        {/* Shine Sweep */}
        <motion.div
          animate={isHovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
          style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 55%, transparent 65%)", zIndex: 5, pointerEvents: "none" }}
        />

        {/* Card Border Light */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, border: "1.5px solid rgba(255,255,255,0.1)", zIndex: 10, pointerEvents: "none" }} />

        {/* Content Container */}
        <div style={{ position: "relative", zIndex: 11, height: "100%", padding: "5cqw 6cqw", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white" }}>
          
          {/* Top Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {isAnahuac ? (
              <div style={{ display: "flex", alignItems: "center", gap: "2cqw" }}>
                <Image src="/anahuac-logo.png" alt="Anahuac" width={24} height={24} style={{ filter: "brightness(2)" }} />
                <span style={{ fontSize: "clamp(18px, 6.5cqw, 24px)", fontWeight: 600, color: "white", letterSpacing: "0.02cqw", transform: "translateY(1px)" }}>x BIZEN</span>
              </div>
            ) : (
              <BizenWordmark accentColor={theme.accentColor} />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Wifi size={18} style={{ opacity: 0.4, transform: "rotate(90deg)" }} />
              <CreditCard size={18} style={{ opacity: 0.4 }} />
            </div>
          </div>

          {/* Balance Area */}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: "clamp(8px, 2.5cqw, 10px)", fontWeight: 400, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Saldo Disponible</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: "clamp(24px, 10cqw, 44px)", fontWeight: 400, lineHeight: 1 }}>{displayBizcoins.toLocaleString()}</span>
              <span style={{ fontSize: "clamp(12px, 4cqw, 18px)", fontWeight: 400, opacity: 0.8 }}>BC</span>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
            {/* Left: Chip + Name */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <ChipSVG />
              </div>
              <div>
                <div style={{ fontSize: "clamp(6px, 1.8cqw, 8px)", fontWeight: 400, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 2 }}>Titular</div>
                <div style={{ fontSize: "clamp(10px, 3.2cqw, 14px)", fontWeight: 400, letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 8 }}>
                  {displayName}
                </div>
              </div>
            </div>

            {/* Right: Number + Buttons */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2cqw" }}>
              <div style={{ fontSize: "clamp(8px, 2.8cqw, 12px)", fontWeight: 400, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2cqw", fontFamily: "monospace" }}>
                •••• •••• •••• {lastFour}
              </div>

              {!hideButtons && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      if (onTransferClick) onTransferClick();
                    }}
                    style={{ 
                      padding: "8px 16px", borderRadius: 12, 
                      background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 10, fontWeight: 400, color: "white",
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  >
                    <Send size={12} /> TRANSFERIR
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Logos are handled in the header section */}
        </div>
      </div>
    </motion.div>
  )
}
