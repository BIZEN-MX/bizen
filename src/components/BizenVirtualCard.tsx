"use client"

import React, { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Send } from "lucide-react"

// ─────────────────────────────────────────────────────────────────
// TYPES & THEMES
// ─────────────────────────────────────────────────────────────────
export type CardTheme = "blue" | "emerald" | "violet" | "rose" | "amber" | "slate" | "obsidian"

// Level-based material tier
// Lvl 1-4  → "plastic"   (standard)
// Lvl 5-9  → "metal"     (brushed aluminium finish)
// Lvl 10-19 → "carbon"   (carbon fiber weave)
// Lvl 20+  → "legendary" (holographic gold)
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
  level?: number           // determines material tier
  showTierBadge?: boolean  // show/hide the tier badge pill
  onTransferClick?: () => void // new prop for P2P transfer
  hideButtons?: boolean    // hide transfer/redeem buttons
  pattern?: "none" | "geometric" | "circuit" | "dots"
  showBillySticker?: boolean
}

const THEMES: Record<CardTheme, {
  bg: string; orb1: string; orb2: string; textGlow: string
  shadowHover: string; shadowIdle: string; glowAnimHover: string; glowAnimIdle: string
}> = {
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

const TIER_CONFIG: Record<CardTier, {
  label: string
  badgeBg: string
  badgeBorder: string
  badgeText: string
  // extra shadow multiplier for tier unlocks
  extraShadow?: string
}> = {
  plastic: {
    label: "STANDARD",
    badgeBg: "rgba(255,255,255,0.08)",
    badgeBorder: "rgba(255,255,255,0.15)",
    badgeText: "rgba(255,255,255,0.5)",
  },
  metal: {
    label: "METAL",
    badgeBg: "rgba(209,213,219,0.18)",
    badgeBorder: "rgba(209,213,219,0.35)",
    badgeText: "rgba(229,231,235,0.9)",
    extraShadow: "0 0 30px rgba(209,213,219,0.12)",
  },
  carbon: {
    label: "CARBON",
    badgeBg: "rgba(15,15,15,0.6)",
    badgeBorder: "rgba(100,116,139,0.5)",
    badgeText: "rgba(148,163,184,1)",
    extraShadow: "0 0 40px rgba(15,98,254,0.18)",
  },
  legendary: {
    label: "✦ LEGENDARY",
    badgeBg: "linear-gradient(90deg, rgba(217,119,6,0.4), rgba(251,191,36,0.3))",
    badgeBorder: "rgba(251,191,36,0.6)",
    badgeText: "#fbbf24",
    extraShadow: "0 0 60px rgba(251,191,36,0.25)",
  },
}

// ─────────────────────────────────────────────────────────────────
// TIER TEXTURE OVERLAYS (SVG-based, pure CSS)
// ─────────────────────────────────────────────────────────────────

// Metal: horizontal brushed lines
function MetalOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
      backgroundImage: `repeating-linear-gradient(
        180deg,
        rgba(255,255,255,0.000) 0px,
        rgba(255,255,255,0.000) 3px,
        rgba(255,255,255,0.025) 3px,
        rgba(255,255,255,0.025) 4px
      )`,
      mixBlendMode: "overlay",
    }} />
  )
}

// Carbon fiber: tight diagonal weave
function CarbonOverlay() {
  const size = 6
  const svgRaw = `<svg xmlns='http://www.w3.org/2000/svg' width='${size * 2}' height='${size * 2}'><rect width='${size}' height='${size}' fill='rgba(255,255,255,0.055)'/><rect x='${size}' y='${size}' width='${size}' height='${size}' fill='rgba(255,255,255,0.055)'/><rect width='${size * 2}' height='${size * 2}' fill='none' stroke='rgba(0,0,0,0.25)' stroke-width='0.5'/></svg>`
  const encoded = typeof btoa !== "undefined" ? btoa(svgRaw) : ""
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
      backgroundImage: `url("data:image/svg+xml;base64,${encoded}")`,
      backgroundRepeat: "repeat",
      mixBlendMode: "overlay",
      opacity: 0.8,
    }} />
  )
}

// Legendary: animated holographic rainbow sweep
function LegendaryOverlay({ isHovered }: { isHovered: boolean }) {
  return (
    <>
      {/* Rainbow holo shimmer */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        background: "linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.08) 50%, rgba(255,100,200,0.07) 60%, rgba(100,180,255,0.07) 70%, transparent 80%)",
        animation: "bcHoloSweep 3s ease-in-out infinite",
        mixBlendMode: "screen",
      }} />
      {/* Gold border glow */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
        borderRadius: 20,
        boxShadow: "inset 0 0 0 1.5px rgba(251,191,36,0.45), inset 0 0 25px rgba(251,191,36,0.08)",
      }} />
      {/* Corner sparkles */}
      {[
        { top: 12, left: 12 },
        { top: 12, right: 12 },
        { bottom: 12, left: 12 },
        { bottom: 12, right: 12 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos, zIndex: 6, pointerEvents: "none",
          width: 4, height: 4, borderRadius: "50%",
          background: "#fbbf24",
          boxShadow: "0 0 6px 2px rgba(251,191,36,0.7)",
          animation: `bcSparkle ${1.4 + i * 0.3}s ease-in-out infinite`,
        }} />
      ))}
    </>
  )
}

// Geometric pattern: subtle diamonds
function GeometricOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='none' stroke='white' stroke-width='1' opacity='0.03'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      opacity: 0.8,
    }} />
  )
}

// Circuit pattern: tech-inspired lines
function CircuitOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h20v20M50 10v40h30M10 70v20h40M80 80h10v10' fill='none' stroke='white' stroke-width='1' opacity='0.04'/%3E%3Ccircle cx='10' cy='10' r='2' fill='white' opacity='0.05'/%3E%3Ccircle cx='90' cy='90' r='2' fill='white' opacity='0.05'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "80px 80px",
      opacity: 0.9,
    }} />
  )
}

// Billy Sticker: holographic badge
function BillySticker() {
  return (
    <div style={{
      position: "absolute", top: "50%", right: "20%", transform: "translateY(-50%)",
      width: 48, height: 48, borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
      border: "1px solid rgba(255,255,255,0.3)",
      backdropFilter: "blur(4px)",
      zIndex: 6, display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 15px rgba(255,255,255,0.1), inset 0 0 10px rgba(255,255,255,0.1)",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)", animation: "bcHoloSweep 2s infinite" }} />
      <span style={{ fontSize: 8, fontWeight: 900, color: "white", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}>Billy<br/>Certificado</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SVG sub-components
// ─────────────────────────────────────────────────────────────────
const ChipSVG = () => (
  <svg width="46" height="36" viewBox="0 0 46 36" fill="none">
    <rect x="0.5" y="0.5" width="45" height="35" rx="5.5" fill="url(#chipGrad)" stroke="rgba(255,210,80,0.4)" strokeWidth="1"/>
    <line x1="23" y1="0" x2="23" y2="36" stroke="rgba(255,195,40,0.35)" strokeWidth="1"/>
    <line x1="0" y1="18" x2="46" y2="18" stroke="rgba(255,195,40,0.35)" strokeWidth="1"/>
    <line x1="14" y1="0" x2="14" y2="36" stroke="rgba(255,195,40,0.2)" strokeWidth="0.8"/>
    <line x1="32" y1="0" x2="32" y2="36" stroke="rgba(255,195,40,0.2)" strokeWidth="0.8"/>
    <line x1="0" y1="9" x2="46" y2="9" stroke="rgba(255,195,40,0.2)" strokeWidth="0.8"/>
    <line x1="0" y1="27" x2="46" y2="27" stroke="rgba(255,195,40,0.2)" strokeWidth="0.8"/>
    <rect x="12" y="8" width="22" height="20" rx="2.5" fill="url(#chipCenter)" stroke="rgba(255,195,40,0.5)" strokeWidth="0.8"/>
    <rect x="17" y="13" width="12" height="10" rx="1.5" fill="rgba(220,175,40,0.18)" stroke="rgba(255,205,60,0.4)" strokeWidth="0.5"/>
    <defs>
      <linearGradient id="chipGrad" x1="0" y1="0" x2="46" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c8973a"/>
        <stop offset="50%" stopColor="#f5d060"/>
        <stop offset="100%" stopColor="#b8801a"/>
      </linearGradient>
      <linearGradient id="chipCenter" x1="12" y1="8" x2="34" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e8b840"/>
        <stop offset="100%" stopColor="#c07820"/>
      </linearGradient>
    </defs>
  </svg>
)

const ContactlessSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 14 C14 14 10 10 10 14 C10 18 14 14 14 14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M14 14 C14 14 7 7 7 14 C7 21 14 14 14 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M14 14 C14 14 4 4 4 14 C4 24 14 14 14 14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <circle cx="14" cy="14" r="1.8" fill="rgba(255,255,255,0.85)"/>
  </svg>
)

const HoloBizenLogo = ({ tier }: { tier: CardTier }) => {
  const isLegendary = tier === "legendary"
  return (
    <svg width="70" height="26" viewBox="0 0 70 26" fill="none">
      <defs>
        <linearGradient id="holoGrad" x1="0" y1="0" x2="70" y2="26" gradientUnits="userSpaceOnUse">
          {isLegendary ? (
            <>
              <stop offset="0%" stopColor="rgba(251,191,36,1)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0.92)"/>
              <stop offset="100%" stopColor="rgba(217,119,6,0.9)"/>
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
              <stop offset="50%" stopColor="rgba(147,197,253,0.75)"/>
              <stop offset="100%" stopColor="rgba(196,181,253,0.8)"/>
            </>
          )}
        </linearGradient>
      </defs>
      <text x="0" y="20"
        fontFamily='"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
        fontSize="22" fontWeight="900"
        fill="url(#holoGrad)"
        letterSpacing="-0.5"
      >BIZEN</text>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function BizenVirtualCard({
  bizcoins, holderName, animationDelay = "0s",
  colorTheme = "blue", level = 1, showTierBadge = true,
  onTransferClick,
  hideButtons = false,
  pattern = "none",
  showBillySticker = false
}: BizenVirtualCardProps) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number | null>(null)

  const theme = THEMES[colorTheme] || THEMES.blue
  const tier = getTierFromLevel(level)
  const tierCfg = TIER_CONFIG[tier]

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotX = ((y / rect.height) - 0.5) * -18
    const rotY = ((x / rect.width) - 0.5) * 22
    const glowX = Math.round((x / rect.width) * 100)
    const glowY = Math.round((y / rect.height) * 100)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ x: rotX, y: rotY })
      setGlowPos({ x: glowX, y: glowY })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setTilt({ x: 0, y: 0 })
    setGlowPos({ x: 50, y: 50 })
    setIsHovered(false)
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])

  const lastFour = String(bizcoins).padStart(4, "0").slice(-4)
  const cardNumber = `•••• •••• •••• ${lastFour}`
  const getRefinedName = (name: string) => {
    if (!name) return "USUARIO BIZEN"
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].toUpperCase()
    // Logic for "Un nombre y un apellido"
    // If 4 parts (Juan Carlos Perez Gomez), take 1st and 3rd -> JUAN PEREZ
    if (parts.length >= 4) return `${parts[0]} ${parts[2]}`.toUpperCase()
    // If 2 or 3 parts (Diego Penas Sanchez), take 1st and 2nd -> DIEGO PENAS
    return `${parts[0]} ${parts[1]}`.toUpperCase()
  }

  const displayName = getRefinedName(holderName).substring(0, 22)
  const cardId = `bc-card-${colorTheme}-${tier}`

  const boxShadowIdle = `0 28px 72px -10px var(--shadow-idle), 0 0 0 1px rgba(255,255,255,0.07)${tierCfg.extraShadow ? `, ${tierCfg.extraShadow}` : ""}`
  const boxShadowHover = `0 40px 100px -12px var(--shadow-hover), 0 0 0 1px rgba(255,255,255,0.1)${tierCfg.extraShadow ? `, ${tierCfg.extraShadow}` : ""}`

  return (
    <>
      <style>{`
        @keyframes bcShimmer {
          0%   { left: -100%; }
          20%, 100% { left: 130%; }
        }
        @keyframes bcHoloSweep {
          0%   { transform: translateX(-100%) skewX(-10deg); opacity: 0; }
          40%  { opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translateX(200%) skewX(-10deg); opacity: 0; }
        }
        @keyframes bcSparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50%       { opacity: 1; transform: scale(1.3); }
        }
        @keyframes bcGlow-${colorTheme}-${tier} {
          0%, 100% { box-shadow: ${boxShadowIdle}; }
          50%       { box-shadow: 0 36px 90px -8px var(--glow-anim-idle), 0 0 0 1px rgba(255,255,255,0.1)${tierCfg.extraShadow ? `, ${tierCfg.extraShadow}` : ""}; }
        }
        .bc-card-wrap {
          animation: bcDu 0.55s cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes bcDu {
          from { opacity:0; transform: translateY(20px) rotateX(8deg); }
          to   { opacity:1; transform: translateY(0) rotateX(0deg); }
        }
        .bc-shop-btn { transition: all .22s ease; }
        .bc-shop-btn:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.2) !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2) !important;
        }
      `}</style>

      <div
        className="bc-card-wrap"
        style={{
          animationDelay,
          perspective: "1200px",
          width: "100%",
          cursor: "pointer",
          '--shadow-hover': theme.shadowHover,
          '--shadow-idle': theme.shadowIdle,
          '--glow-anim-hover': theme.glowAnimHover,
          '--glow-anim-idle': theme.glowAnimIdle,
        } as React.CSSProperties}
      >
        <div
          id={cardId}
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => router.push("/tienda")}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1.586 / 1",
            maxWidth: 460,
            borderRadius: 20,
            overflow: "hidden",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
            transformStyle: "preserve-3d",
            transition: isHovered ? "transform 0.08s linear" : "transform 0.55s cubic-bezier(.4,0,.2,1)",
            boxShadow: isHovered ? boxShadowHover : boxShadowIdle,
            animation: isHovered ? "none" : `bcGlow-${colorTheme}-${tier} 4s ease-in-out infinite`,
            userSelect: "none",
          }}
        >
          {/* ── BASE GRADIENT ── */}
          <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 0 }} />

          {/* ── MESH ORBS ── */}
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60%", height: "70%", background: `radial-gradient(ellipse, ${theme.orb1} 0%, transparent 68%)`, zIndex: 1, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-25%", left: "5%", width: "55%", height: "65%", background: `radial-gradient(ellipse, ${theme.orb2} 0%, transparent 68%)`, zIndex: 1, pointerEvents: "none" }} />

          {/* ── TIER-SPECIFIC TEXTURE OVERLAYS ── */}
          {tier === "metal"     && <MetalOverlay />}
          {tier === "carbon"    && <CarbonOverlay />}
          {tier === "legendary" && <LegendaryOverlay isHovered={isHovered} />}

          {/* ── CUSTOM PATTERNS ── */}
          {pattern === "geometric" && <GeometricOverlay />}
          {pattern === "circuit"   && <CircuitOverlay />}
          {showBillySticker && <BillySticker />}

          {/* ── MOUSE GLOW FOLLOW ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
            background: `radial-gradient(ellipse 55% 45% at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,${tier === "legendary" ? "0.22" : "0.15"}) 0%, transparent 70%)`,
            transition: isHovered ? "background 0.06s linear" : "background 0.4s ease",
          }} />

          {/* ── NOISE TEXTURE ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
            background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            opacity: tier === "carbon" ? 0.02 : 0.035,
          }} />

          {/* ── SHIMMER SWEEP (plastic/metal only) ── */}
          {(tier === "plastic" || tier === "metal") && (
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: "60%",
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${tier === "metal" ? "0.12" : "0.07"}), transparent)`,
              zIndex: 4, pointerEvents: "none",
              animation: "bcShimmer 5s ease-in-out infinite",
            }} />
          )}

          {/* ── DIAGONAL LINE PATTERN ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,${tier === "carbon" ? "0.015" : "0.03"}) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 24px)`,
          }} />

          {/* ── CARD CONTENT ── */}
          <div style={{
            position: "relative", zIndex: 7,
            height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            padding: "clamp(16px, 4%, 28px)",
          }}>
            {/* TOP ROW: Logo + Tier Badge + Contactless */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <HoloBizenLogo tier={tier} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Tier Badge */}
                {showTierBadge && tier !== "plastic" && (
                  <div style={{
                    fontSize: "clamp(7px,1.1vw,9px)", fontWeight: 800,
                    color: tierCfg.badgeText,
                    background: tierCfg.badgeBg,
                    border: `1px solid ${tierCfg.badgeBorder}`,
                    borderRadius: 99,
                    padding: "3px 8px",
                    letterSpacing: "0.1em",
                    backdropFilter: "blur(6px)",
                    textShadow: tier === "legendary" ? "0 0 8px rgba(251,191,36,0.5)" : "none",
                  }}>
                    {tierCfg.label}
                  </div>
                )}
                <ContactlessSVG />
              </div>
            </div>

            {/* BALANCE SECTION */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{
                fontSize: "clamp(9px,1.4vw,11px)", fontWeight: 700, color: "rgba(255,255,255,0.42)",
                textTransform: "uppercase", letterSpacing: "0.12em",
              }}>
                Saldo Disponible
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{
                  fontSize: "clamp(28px,5.5vw,46px)", fontWeight: 900, color: "#ffffff",
                  letterSpacing: "-0.03em", lineHeight: 1,
                  textShadow: tier === "legendary"
                    ? `0 2px 20px rgba(251,191,36,0.4), 0 0 40px rgba(251,191,36,0.2)`
                    : `0 2px 20px ${theme.textGlow}`,
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                }}>
                  {bizcoins.toLocaleString("es-MX")}
                </span>
                <span style={{
                  fontSize: "clamp(12px,2vw,16px)", fontWeight: 700,
                  color: tier === "legendary" ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.8)",
                  letterSpacing: "0.06em",
                }}>
                  BC
                </span>
              </div>
            </div>

            {/* BOTTOM ROW: Chip + holder + card number */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ChipSVG />
                <div>
                  <div style={{
                    fontSize: "clamp(7px,1.1vw,9px)", fontWeight: 700, color: "rgba(255,255,255,0.38)",
                    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3,
                  }}>
                    Titular
                  </div>
                  <div style={{
                    fontSize: "clamp(9px,1.5vw,12px)", fontWeight: 700, color: "rgba(255,255,255,0.85)",
                    letterSpacing: "0.07em",
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    {displayName}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{
                  fontSize: "clamp(8px,1.3vw,11px)", fontWeight: 500, color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.14em",
                  fontFamily: '"SF Mono", "Fira Mono", monospace',
                }}>
                  {cardNumber}
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                   {/* Transferir Button (conditional) */}
                   {!hideButtons && (
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: tier === "legendary" ? "rgba(251,191,36,0.18)" : "rgba(255,255,255,0.12)",
                        border: `1px solid ${tier === "legendary" ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.18)"}`,
                        borderRadius: 999,
                        padding: "5px 12px",
                        backdropFilter: "blur(8px)",
                        cursor: "pointer",
                      }}
                      className="bc-shop-btn"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (onTransferClick) onTransferClick();
                        else router.push("/transfer");
                      }}
                    >
                      <Send size={11} color={tier === "legendary" ? "#fbbf24" : "rgba(255,255,255,0.85)"} />
                      <span style={{
                        fontSize: "clamp(8px,1.2vw,10px)", fontWeight: 700,
                        color: tier === "legendary" ? "#fbbf24" : "rgba(255,255,255,0.85)",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                      }}>
                        Transferir
                      </span>
                    </div>
                   )}
  
                    {/* Canjear Button (conditional) */}
                    {!hideButtons && (
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: tier === "legendary" ? "rgba(251,191,36,0.18)" : "rgba(255,255,255,0.12)",
                        border: `1px solid ${tier === "legendary" ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.18)"}`,
                        borderRadius: 999,
                        padding: "5px 12px",
                        backdropFilter: "blur(8px)",
                        cursor: "pointer",
                      }}
                      className="bc-shop-btn"
                      onClick={(e) => { e.stopPropagation(); router.push("/tienda") }}
                    >
                      <ShoppingBag size={11} color={tier === "legendary" ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.8)"} />
                      <span style={{
                        fontSize: "clamp(8px,1.2vw,10px)", fontWeight: 700,
                        color: tier === "legendary" ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.8)",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                      }}>
                        Canjear
                      </span>
                    </div>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
