"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Send } from "lucide-react"

// Types & Themes
export type CardTheme = "blue" | "emerald" | "violet" | "rose" | "amber" | "slate" | "obsidian"
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
  hideButtons?: boolean
  pattern?: "none" | "geometric" | "circuit" | "dots"
  showBillySticker?: boolean
}

const THEMES: Record<CardTheme, any> = {
  blue: {
    bg: "linear-gradient(135deg, #070d22 0%, #0d2056 42%, #1649b8 75%, #1a56db 100%)",
    orb1: "rgba(96,165,250,0.28)", orb2: "rgba(167,139,250,0.2)",
    textGlow: "rgba(96,165,250,0.45)", shadowHover: "rgba(13,42,107,.7)",
    shadowIdle: "rgba(13,42,107,.55)", glowAnimHover: "rgba(26,86,219,.65)", glowAnimIdle: "rgba(13,42,107,.6)",
  },
  emerald: {
    bg: "linear-gradient(135deg, #022c22 0%, #064e3b 42%, #059669 75%, #10b981 100%)",
    orb1: "rgba(52,211,153,0.35)", orb2: "rgba(16,185,129,0.25)",
    textGlow: "rgba(52,211,153,0.5)", shadowHover: "rgba(2,44,34,.7)",
    shadowIdle: "rgba(2,44,34,.55)", glowAnimHover: "rgba(5,150,105,.65)", glowAnimIdle: "rgba(2,44,34,.6)",
  },
  violet: {
    bg: "linear-gradient(135deg, #2e1065 0%, #4c1d95 42%, #7c3aed 75%, #8b5cf6 100%)",
    orb1: "rgba(167,139,250,0.35)", orb2: "rgba(196,181,253,0.25)",
    textGlow: "rgba(167,139,250,0.5)", shadowHover: "rgba(46,16,101,.7)",
    shadowIdle: "rgba(46,16,101,.55)", glowAnimHover: "rgba(124,58,237,.65)", glowAnimIdle: "rgba(46,16,101,.6)",
  },
  rose: {
    bg: "linear-gradient(135deg, #4c0519 0%, #881337 42%, #e11d48 75%, #f43f5e 100%)",
    orb1: "rgba(251,113,133,0.35)", orb2: "rgba(244,63,94,0.25)",
    textGlow: "rgba(251,113,133,0.5)", shadowHover: "rgba(76,5,25,.7)",
    shadowIdle: "rgba(76,5,25,.55)", glowAnimHover: "rgba(225,29,72,.65)", glowAnimIdle: "rgba(76,5,25,.6)",
  },
  amber: {
    bg: "linear-gradient(135deg, #451a03 0%, #78350f 42%, #d97706 75%, #f59e0b 100%)",
    orb1: "rgba(251,191,36,0.3)", orb2: "rgba(245,158,11,0.2)",
    textGlow: "rgba(251,191,36,0.5)", shadowHover: "rgba(69,26,3,.7)",
    shadowIdle: "rgba(69,26,3,.55)", glowAnimHover: "rgba(217,119,6,.65)", glowAnimIdle: "rgba(69,26,3,.6)",
  },
  slate: {
    bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 42%, #475569 75%, #64748b 100%)",
    orb1: "rgba(148,163,184,0.3)", orb2: "rgba(100,116,139,0.2)",
    textGlow: "rgba(148,163,184,0.5)", shadowHover: "rgba(15,23,42,.7)",
    shadowIdle: "rgba(15,23,42,.55)", glowAnimHover: "rgba(71,85,105,.65)", glowAnimIdle: "rgba(15,23,42,.6)",
  },
  obsidian: {
    bg: "linear-gradient(135deg, #000000 0%, #0a0a0a 42%, #171717 75%, #262626 100%)",
    orb1: "rgba(82,82,91,0.3)", orb2: "rgba(63,63,70,0.2)",
    textGlow: "rgba(113,113,122,0.5)", shadowHover: "rgba(0,0,0,.9)",
    shadowIdle: "rgba(0,0,0,.7)", glowAnimHover: "rgba(38,38,38,.65)", glowAnimIdle: "rgba(0,0,0,.8)",
  },
}

const TIER_CONFIG: Record<CardTier, any> = {
  plastic: { label: "STANDARD", badgeBg: "rgba(255,255,255,0.08)", badgeBorder: "rgba(255,255,255,0.15)", badgeText: "rgba(255,255,255,0.5)" },
  metal: { label: "METAL", badgeBg: "rgba(209,213,219,0.18)", badgeBorder: "rgba(209,213,219,0.35)", badgeText: "rgba(229,231,235,0.9)", extraShadow: "0 0 30px rgba(209,213,219,0.12)" },
  carbon: { label: "CARBON", badgeBg: "rgba(15,15,15,0.6)", badgeBorder: "rgba(100,116,139,0.5)", badgeText: "rgba(148,163,184,1)", extraShadow: "0 0 40px rgba(15,98,254,0.18)" },
  legendary: { label: "✦ LEGENDARY", badgeBg: "linear-gradient(90deg, rgba(217,119,6,0.4), rgba(251,191,36,0.3))", badgeBorder: "rgba(251,191,36,0.6)", badgeText: "#fbbf24", extraShadow: "0 0 60px rgba(251,191,36,0.25)" },
}

// Overlays...
const MetalOverlay = () => <div style={{ position: "absolute", inset: 0, zIndex: 3, backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)`, mixBlendMode: "overlay" }} />
const CarbonOverlay = () => <div style={{ position: "absolute", inset: 0, zIndex: 3, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Crect width='6' height='6' fill='rgba(255,255,255,0.05)'/%3E%3Crect x='6' y='6' width='6' height='6' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", mixBlendMode: "overlay", opacity: 0.8 }} />
const LegendaryOverlay = ({ isHovered }: { isHovered: boolean }) => (
  <>
    <div style={{ position: "absolute", inset: 0, zIndex: 4, background: "linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.08) 50%, rgba(255,100,200,0.07) 60%, rgba(100,180,255,0.07) 70%, transparent 80%)", animation: "bzHoloSweep 3s ease-in-out infinite", mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", inset: 0, zIndex: 5, borderRadius: 20, boxShadow: "inset 0 0 0 1.5px rgba(251,191,36,0.45), inset 0 0 25px rgba(251,191,36,0.08)" }} />
  </>
)
const GeometricOverlay = () => <div style={{ position: "absolute", inset: 0, zIndex: 2, backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='none' stroke='white' stroke-width='1' opacity='0.03'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", opacity: 0.8 }} />
const CircuitOverlay = () => <div style={{ position: "absolute", inset: 0, zIndex: 2, backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h20v20M50 10v40h30' fill='none' stroke='white' stroke-width='1' opacity='0.04'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", opacity: 0.9 }} />

const ChipSVG = () => (
  <svg width="46" height="36" viewBox="0 0 46 36">
    <rect width="46" height="36" rx="6" fill="url(#chipGrad)"/>
    <defs><linearGradient id="chipGrad" x1="0" y1="0" x2="46" y2="36"><stop offset="0%" stopColor="#c8973a"/><stop offset="100%" stopColor="#b8801a"/></linearGradient></defs>
  </svg>
)

const HoloBizenLogo = ({ tier }: { tier: CardTier }) => (
  <svg width="70" height="26" viewBox="0 0 70 26">
    <text x="0" y="20" fontSize="22" fontWeight="900" fill="rgba(255,255,255,0.9)">BIZEN</text>
  </svg>
)

export default function BizenVirtualCard({
  bizcoins, holderName, animationDelay = "0s",
  colorTheme = "blue", level = 1, showTierBadge = true,
  onTransferClick, hideButtons = false, pattern = "none", showBillySticker = false
}: BizenVirtualCardProps) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [displayBizcoins, setDisplayBizcoins] = useState(bizcoins)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number | null>(null)
  const countRafRef = useRef<number | null>(null)

  const theme = THEMES[colorTheme] || THEMES.blue
  const tier = getTierFromLevel(level)
  const tierCfg = TIER_CONFIG[tier]

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left; const y = e.clientY - rect.top
    const rotX = ((y / rect.height) - 0.5) * -18; const rotY = ((x / rect.width) - 0.5) * 22
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => { setTilt({ x: rotX, y: rotY }); setGlowPos({ x: (x/rect.width)*100, y: (y/rect.height)*100 }) })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setTilt({ x: 0, y: 0 }); setGlowPos({ x: 50, y: 50 }); setIsHovered(false)
  }, [])

  useEffect(() => {
    if (displayBizcoins === bizcoins) return
    const start = displayBizcoins; const end = bizcoins; const duration = 800; const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime; const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplayBizcoins(Math.floor(start + (end - start) * ease))
      if (progress < 1) countRafRef.current = requestAnimationFrame(animate)
    }
    countRafRef.current = requestAnimationFrame(animate)
    return () => { if (countRafRef.current) cancelAnimationFrame(countRafRef.current) }
  }, [bizcoins])

  const lastFour = String(bizcoins).padStart(4, "0").slice(-4)
  const displayName = (holderName || "USUARIO BIZEN").toUpperCase()

  return (
    <>
      <style>{`
        @keyframes bzHoloSweep { 0% { transform: translateX(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(200%); opacity: 0; } }
      `}</style>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => router.push("/tienda")}
        style={{
          perspective: "1200px", width: "100%", maxWidth: 460, aspectRatio: "1.586/1",
          borderRadius: 20, overflow: "hidden", position: "relative", cursor: "pointer",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? "none" : "transform 0.5s ease",
          boxShadow: isHovered ? "0 40px 100px rgba(0,0,0,0.3)" : "0 20px 50px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 0 }} />
        {tier === "metal" && <MetalOverlay />}
        {tier === "carbon" && <CarbonOverlay />}
        {tier === "legendary" && <LegendaryOverlay isHovered={isHovered} />}
        
        <div style={{ position: "relative", zIndex: 10, height: "100%", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <HoloBizenLogo tier={tier} />
            {showTierBadge && tier !== "plastic" && <div style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 99 }}>{tierCfg.label}</div>}
          </div>

          <div>
            <div style={{ fontSize: 10, opacity: 0.5, textTransform: "uppercase" }}>Saldo Disponible</div>
            <div style={{ fontSize: 40, fontWeight: 900 }}>{displayBizcoins.toLocaleString("es-MX")} <span style={{ fontSize: 16 }}>bz</span></div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <ChipSVG />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700 }}>{displayName}</div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>•••• •••• •••• {lastFour}</div>
          </div>
        </div>
      </div>
    </>
  )
}
