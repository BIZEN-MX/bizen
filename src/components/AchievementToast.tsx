"use client"

import React, { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"

// ─────────────────────────────────────────────────────────────────
// ICON MAP  (icon key → inline SVG)
// ─────────────────────────────────────────────────────────────────
function AchievementIcon({ icon, size = 28, color = "#fff" }: { icon: string; size?: number; color?: string }) {
  const s = { width: size, height: size }
  switch (icon) {
    case "flame":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 2 8 6 8 10C8 12 9.5 13.5 11 14C10 12.5 10.5 11 12 10C12 12 14 13.5 14 15.5C14 17.5 13 19 11.5 20C15 19.5 17 17 17 14C17 11 15 9 14 8C14.5 10 13.5 11.5 12 12C12 12 10 10 12 2Z" fill={color} fillOpacity="0.9"/>
          <circle cx="12" cy="18.5" r="2.5" fill={color} fillOpacity="0.4"/>
        </svg>
      )
    case "book":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="9" y1="7" x2="15" y2="7"/>
          <line x1="9" y1="11" x2="13" y2="11"/>
        </svg>
      )
    case "award":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      )
    case "trophy":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="8 21 12 21 16 21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <path d="M7 4H17a4 4 0 0 1 4 4v3a8 8 0 0 1-8 8 8 8 0 0 1-8-8V8a4 4 0 0 1 4-4Z"/>
          <path d="M3 7v3M21 7v3"/>
        </svg>
      )
    case "star":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color} fillOpacity="0.9">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    case "zap":
      return (
        <svg {...s} viewBox="0 0 24 24" fill={color} fillOpacity="0.9">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      )
    case "coin":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
          <path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 0 1 0 3.5H10.5a1.75 1.75 0 0 0 0 3.5H14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case "users":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    default:
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      )
  }
}

// ─────────────────────────────────────────────────────────────────
// RARITY CONFIG
// ─────────────────────────────────────────────────────────────────
const RARITY: Record<string, { grad: string; glow: string; label: string }> = {
  común:       { grad: "linear-gradient(135deg,#374151,#1f2937)",     glow: "rgba(156,163,175,.4)",  label: "Común" },
  raro:        { grad: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",     glow: "rgba(59,130,246,.5)",   label: "Raro" },
  épico:       { grad: "linear-gradient(135deg,#5b21b6,#7c3aed)",     glow: "rgba(139,92,246,.55)",  label: "Épico" },
  legendario:  { grad: "linear-gradient(135deg,#92400e,#d97706)",     glow: "rgba(251,191,36,.6)",   label: "Legendario" },
}

// ─────────────────────────────────────────────────────────────────
// ACHIEVEMENT TOAST
// ─────────────────────────────────────────────────────────────────
export interface AchievementToastData {
  id:          string
  title:       string
  description: string
  icon:        string
  rarity:      string
  xpReward:    number
}

interface Props {
  achievement: AchievementToastData
  onDone: () => void
}

function SingleToast({ achievement, onDone }: Props) {
  const [visible, setVisible] = useState(false)
  const cfg = RARITY[achievement.rarity] ?? RARITY["común"]

  useEffect(() => {
    // animate in
    const t1 = setTimeout(() => setVisible(true), 30)
    // animate out after 5s
    const t2 = setTimeout(() => setVisible(false), 5000)
    // remove after fade-out
    const t3 = setTimeout(() => onDone(), 5600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        background: cfg.grad,
        borderRadius: 20,
        boxShadow: `0 8px 32px ${cfg.glow}, 0 2px 8px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.10)`,
        minWidth: 300,
        maxWidth: 380,
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.92)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={onDone}
    >
      {/* shine */}
      <div style={{ position:"absolute",top:0,left:"-100%",width:"55%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)",animation:"ach-shine 2.5s ease-in-out 0.5s 1",pointerEvents:"none" }}/>

      {/* icon box */}
      <div style={{
        width: 52, height: 52, borderRadius: 16, flexShrink: 0,
        background: "rgba(255,255,255,.12)",
        border: "1px solid rgba(255,255,255,.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <AchievementIcon icon={achievement.icon} size={28} color="#fff"/>
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,.55)", textTransform: "uppercase", letterSpacing: ".10em", marginBottom: 3 }}>
          Logro desbloqueado · {cfg.label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 3 }}>
          {achievement.title}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", fontWeight: 500 }}>
          {achievement.description}
        </div>
        {achievement.xpReward > 0 && (
          <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24" }}>+{achievement.xpReward} XP</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// ACHIEVEMENT TOAST MANAGER  (global event-driven)
// ─────────────────────────────────────────────────────────────────
const ACHIEVEMENT_EVENT = "bizen:achievement-unlocked"

/** Call this from anywhere (API response handler, etc.) to show a toast */
export function fireAchievementToast(data: AchievementToastData) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(ACHIEVEMENT_EVENT, { detail: data }))
}

interface QueuedToast extends AchievementToastData {
  key: number
}

export function AchievementToastProvider() {
  const [queue, setQueue] = useState<QueuedToast[]>([])

  const add = useCallback((data: AchievementToastData) => {
    setQueue(q => [...q, { ...data, key: Date.now() + Math.random() }])
  }, [])

  useEffect(() => {
    const handler = (e: Event) => add((e as CustomEvent<AchievementToastData>).detail)
    window.addEventListener(ACHIEVEMENT_EVENT, handler)
    return () => window.removeEventListener(ACHIEVEMENT_EVENT, handler)
  }, [add])

  if (typeof document === "undefined" || queue.length === 0) return null

  return createPortal(
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 99999,
      display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end",
      pointerEvents: "none",
    }}>
      <style>{`
        @keyframes ach-shine {
          0%   { left: -100% }
          100% { left: 120%  }
        }
      `}</style>
      {queue.map(t => (
        <div key={t.key} style={{ pointerEvents: "auto" }}>
          <SingleToast
            achievement={t}
            onDone={() => setQueue(q => q.filter(x => x.key !== t.key))}
          />
        </div>
      ))}
    </div>,
    document.body
  )
}
