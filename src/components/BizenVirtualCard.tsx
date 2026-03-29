"use client"

import React, { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"

// ─────────────────────────────────────────────────────────────────
// TYPES & THEMES
// ─────────────────────────────────────────────────────────────────
export type CardTheme = "blue" | "emerald" | "violet" | "rose" | "amber" | "slate" | "obsidian"

interface BizenVirtualCardProps {
  bizcoins: number
  holderName: string
  animationDelay?: string
  colorTheme?: CardTheme
}

const THEMES: Record<CardTheme, { bg: string, orb1: string, orb2: string, textGlow: string, shadowHover: string, shadowIdle: string, glowAnimHover: string, glowAnimIdle: string }> = {
  blue: {
    bg: "linear-gradient(135deg, #070d22 0%, #0d2056 42%, #1649b8 75%, #1a56db 100%)",
    orb1: "rgba(96,165,250,0.28)", // blue-400
    orb2: "rgba(167,139,250,0.2)", // violet-400
    textGlow: "rgba(96,165,250,0.45)",
    shadowHover: "rgba(13,42,107,.7)", // deep blue
    shadowIdle: "rgba(13,42,107,.55)",
    glowAnimHover: "rgba(26,86,219,.65)", // blue-700
    glowAnimIdle: "rgba(13,42,107,.6)",
  },
  emerald: {
    bg: "linear-gradient(135deg, #022c22 0%, #064e3b 42%, #059669 75%, #10b981 100%)",
    orb1: "rgba(52,211,153,0.35)", // emerald-400
    orb2: "rgba(16,185,129,0.25)", // emerald-500
    textGlow: "rgba(52,211,153,0.5)",
    shadowHover: "rgba(2,44,34,.7)", 
    shadowIdle: "rgba(2,44,34,.55)",
    glowAnimHover: "rgba(5,150,105,.65)", 
    glowAnimIdle: "rgba(2,44,34,.6)",
  },
  violet: {
    bg: "linear-gradient(135deg, #2e1065 0%, #4c1d95 42%, #7c3aed 75%, #8b5cf6 100%)",
    orb1: "rgba(167,139,250,0.35)", // violet-400
    orb2: "rgba(196,181,253,0.25)", // violet-300
    textGlow: "rgba(167,139,250,0.5)",
    shadowHover: "rgba(46,16,101,.7)", 
    shadowIdle: "rgba(46,16,101,.55)",
    glowAnimHover: "rgba(124,58,237,.65)", 
    glowAnimIdle: "rgba(46,16,101,.6)",
  },
  rose: {
    bg: "linear-gradient(135deg, #4c0519 0%, #881337 42%, #e11d48 75%, #f43f5e 100%)",
    orb1: "rgba(251,113,133,0.35)", // rose-400
    orb2: "rgba(244,63,94,0.25)", // rose-500
    textGlow: "rgba(251,113,133,0.5)",
    shadowHover: "rgba(76,5,25,.7)", 
    shadowIdle: "rgba(76,5,25,.55)",
    glowAnimHover: "rgba(225,29,72,.65)", 
    glowAnimIdle: "rgba(76,5,25,.6)",
  },
  amber: {
    bg: "linear-gradient(135deg, #451a03 0%, #78350f 42%, #d97706 75%, #f59e0b 100%)",
    orb1: "rgba(251,191,36,0.3)", // amber-400
    orb2: "rgba(245,158,11,0.2)", // amber-500
    textGlow: "rgba(251,191,36,0.5)",
    shadowHover: "rgba(69,26,3,.7)", 
    shadowIdle: "rgba(69,26,3,.55)",
    glowAnimHover: "rgba(217,119,6,.65)", 
    glowAnimIdle: "rgba(69,26,3,.6)",
  },
  slate: {
    bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 42%, #475569 75%, #64748b 100%)",
    orb1: "rgba(148,163,184,0.3)", // slate-400
    orb2: "rgba(100,116,139,0.2)", // slate-500
    textGlow: "rgba(148,163,184,0.5)",
    shadowHover: "rgba(15,23,42,.7)", 
    shadowIdle: "rgba(15,23,42,.55)",
    glowAnimHover: "rgba(71,85,105,.65)", 
    glowAnimIdle: "rgba(15,23,42,.6)",
  },
  obsidian: {
    bg: "linear-gradient(135deg, #000000 0%, #0a0a0a 42%, #171717 75%, #262626 100%)",
    orb1: "rgba(82,82,91,0.3)", // zinc-500
    orb2: "rgba(63,63,70,0.2)", // zinc-600
    textGlow: "rgba(113,113,122,0.5)",
    shadowHover: "rgba(0,0,0,.9)", 
    shadowIdle: "rgba(0,0,0,.7)",
    glowAnimHover: "rgba(38,38,38,.65)", 
    glowAnimIdle: "rgba(0,0,0,.8)",
  }
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

const HoloBizenLogo = () => (
  <svg width="70" height="26" viewBox="0 0 70 26" fill="none">
    <defs>
      <linearGradient id="holoGrad" x1="0" y1="0" x2="70" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
        <stop offset="50%" stopColor="rgba(147,197,253,0.75)"/>
        <stop offset="100%" stopColor="rgba(196,181,253,0.8)"/>
      </linearGradient>
    </defs>
    <text x="0" y="20" fontFamily='"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' fontSize="22" fontWeight="900" fill="url(#holoGrad)" letterSpacing="-0.5">BIZEN</text>
  </svg>
)

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function BizenVirtualCard({ bizcoins, holderName, animationDelay = "0s", colorTheme = "blue" }: BizenVirtualCardProps) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number | null>(null)

  const theme = THEMES[colorTheme] || THEMES.blue

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

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  // Format card "number" based on user id derived from name
  const lastFour = String(bizcoins).padStart(4, "0").slice(-4)
  const cardNumber = `•••• •••• •••• ${lastFour}`
  const displayName = holderName
    ? holderName.toUpperCase().substring(0, 22)
    : "USUARIO BIZEN"

  // Use a unique ID for styles in case multiple themes are rendered
  const cardId = `bc-card-${colorTheme}`

  return (
    <>
      <style>{`
        @keyframes bcShimmer {
          0%   { left: -100%; }
          20%, 100% { left: 130%; }
        }
        @keyframes bcGlow-${colorTheme} {
          0%, 100% { box-shadow: 0 32px 80px -10px var(--shadow-idle), 0 0 0 1px rgba(255,255,255,0.07); }
          50%       { box-shadow: 0 36px 90px -8px var(--glow-anim-idle), 0 0 0 1px rgba(255,255,255,0.1); }
        }
        .bc-card-wrap {
          animation: bcDu 0.55s cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes bcDu {
          from { opacity:0; transform: translateY(20px) rotateX(8deg); }
          to   { opacity:1; transform: translateY(0) rotateX(0deg); }
        }
        .bc-shop-btn {
          transition: all .22s ease;
        }
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
            boxShadow: isHovered
              ? "0 40px 100px -12px var(--shadow-hover), 0 0 0 1px rgba(255,255,255,0.1)"
              : "0 28px 72px -10px var(--shadow-idle), 0 0 0 1px rgba(255,255,255,0.07)",
            animation: isHovered ? "none" : `bcGlow-${colorTheme} 4s ease-in-out infinite`,
            userSelect: "none",
          }}
        >
          {/* ── BASE GRADIENT ── */}
          <div style={{
            position: "absolute", inset: 0,
            background: theme.bg,
            zIndex: 0,
          }} />

          {/* ── MESH ORBS ── */}
          <div style={{
            position: "absolute", top: "-20%", right: "-10%",
            width: "60%", height: "70%",
            background: `radial-gradient(ellipse, ${theme.orb1} 0%, transparent 68%)`,
            zIndex: 1, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-25%", left: "5%",
            width: "55%", height: "65%",
            background: `radial-gradient(ellipse, ${theme.orb2} 0%, transparent 68%)`,
            zIndex: 1, pointerEvents: "none",
          }} />

          {/* ── MOUSE GLOW FOLLOW ── */}
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
              background: `radial-gradient(ellipse 55% 45% at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.15) 0%, transparent 70%)`,
              transition: isHovered ? "background 0.06s linear" : "background 0.4s ease",
            }}
          />

          {/* ── NOISE TEXTURE OVERLAY ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
            background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            opacity: 0.035, // slightly more visible texture
          }} />

          {/* ── SHIMMER SWEEP ── */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: "60%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
            zIndex: 4, pointerEvents: "none",
            animation: "bcShimmer 5s ease-in-out infinite",
          }} />

          {/* ── DIAGONAL LINE PATTERN ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 24px)",
          }} />

          {/* ── CARD CONTENT ── */}
          <div style={{
            position: "relative", zIndex: 5,
            height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            padding: "clamp(16px, 4%, 28px)",
          }}>
            {/* TOP ROW: Logo + Contactless */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <HoloBizenLogo />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  fontSize: "clamp(8px,1.2vw,10px)", fontWeight: 800, color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase", letterSpacing: "0.12em",
                }}>
                  BIZCOINS
                </div>
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
                  textShadow: `0 2px 20px ${theme.textGlow}`,
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                }}>
                  {bizcoins.toLocaleString("es-MX")}
                </span>
                <span style={{
                  fontSize: "clamp(12px,2vw,16px)", fontWeight: 700, color: "rgba(255,255,255,0.8)",
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
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  padding: "5px 12px",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                }}
                className="bc-shop-btn"
                onClick={(e) => { e.stopPropagation(); router.push("/tienda") }}>
                  <ShoppingBag size={11} color="rgba(255,255,255,0.8)" />
                  <span style={{
                    fontSize: "clamp(8px,1.2vw,10px)", fontWeight: 700, color: "rgba(255,255,255,0.8)",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    Canjear
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
