"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Coins, Calendar, TrendingUp, CheckCircle2, Loader2, AlertCircle, Lock, Sparkles } from "lucide-react"

interface StakingModalProps {
  onClose: () => void
  currentBalance: number
  onSuccess: () => void
}

const STAKING_PLANS = [
  {
    id: "term_7",
    days: 7,
    yieldRate: 0.05,
    label: "Ahorro Flexible",
    badge: "BÁSICO",
    icon: Calendar,
    gradient: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    glow: "rgba(59,130,246,0.4)",
    border: "rgba(59,130,246,0.5)",
    accent: "#3b82f6",
    bgGlow: "rgba(59,130,246,0.08)",
    desc: "Ideal para crecimientos rápidos a corto plazo.",
    risk: "Bajo",
    riskColor: "#10B981",
  },
  {
    id: "term_14",
    days: 14,
    yieldRate: 0.08,
    label: "Fondo BIZEN",
    badge: "POPULAR",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #5b21b6, #8b5cf6)",
    glow: "rgba(139,92,246,0.4)",
    border: "rgba(139,92,246,0.5)",
    accent: "#8b5cf6",
    bgGlow: "rgba(139,92,246,0.08)",
    desc: "El equilibrio perfecto entre tiempo y rendimiento.",
    risk: "Moderado",
    riskColor: "#F59E0B",
  },
  {
    id: "term_30",
    days: 30,
    yieldRate: 0.15,
    label: "Interés Compuesto",
    badge: "MÁXIMO",
    icon: Zap,
    gradient: "linear-gradient(135deg, #9d174d, #ec4899)",
    glow: "rgba(236,72,153,0.4)",
    border: "rgba(236,72,153,0.5)",
    accent: "#ec4899",
    bgGlow: "rgba(236,72,153,0.08)",
    desc: "Máximo rendimiento para quienes piensan a largo plazo.",
    risk: "Alto",
    riskColor: "#F43F5E",
  },
]

// Animated counter hook
function useAnimatedNumber(target: number, duration = 600) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const from = display
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(from + (target - from) * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target]) // eslint-disable-line

  return display
}

// Floating particle
function Particle({ color }: { color: string }) {
  const x = Math.random() * 100
  const delay = Math.random() * 2
  const size = 3 + Math.random() * 4
  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${x}%`,
        bottom: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity: 0.6,
        pointerEvents: "none",
      }}
      animate={{ y: [0, -80, -120], opacity: [0, 0.8, 0], scale: [1, 1.4, 0.5] }}
      transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay, ease: "easeOut" }}
    />
  )
}

export default function StakingModal({ onClose, currentBalance, onSuccess }: StakingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(STAKING_PLANS[1]) // default to popular
  const [amount, setAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const potentialReturn = useMemo(() => Math.floor(amount * selectedPlan.yieldRate), [amount, selectedPlan])
  const totalReturn = amount + potentialReturn
  const animatedReturn = useAnimatedNumber(potentialReturn)
  const animatedTotal = useAnimatedNumber(totalReturn)
  const progress = currentBalance > 0 ? Math.min((amount / currentBalance) * 100, 100) : 0

  const handleSubmit = async () => {
    if (amount <= 0) { setError("Ingresa una cantidad válida"); return }
    if (amount > currentBalance) { setError("No tienes suficientes Bizcoins"); return }
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/wallet/staking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, days: selectedPlan.days }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Error al procesar inversión") }
      setSuccess(true)
      setTimeout(() => { onSuccess(); onClose() }, 3500)
    } catch (err: any) { setError(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleQuickAmount = (pct: number) => setAmount(Math.floor(currentBalance * pct))

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(20px)" }}
      />

      <style>{`
        @keyframes shimmer { 0%{left:-100%} 100%{left:120%} }
        @keyframes pulse-glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .staking-btn-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }
        .plan-card-hover:hover { transform: translateY(-2px); }
      `}</style>

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #0d1117 0%, #0f172a 100%)",
          borderRadius: 32,
          position: "relative",
          zIndex: 1001,
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.08)`,
          scrollbarWidth: "none",
        }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            /* ── SUCCESS SCREEN ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}
            >
              {/* particle burst */}
              {Array.from({ length: 18 }).map((_, i) => (
                <Particle key={i} color={["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"][i % 4]} />
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
                style={{
                  width: 100, height: 100,
                  background: "linear-gradient(135deg, #059669, #10B981)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 28px",
                  boxShadow: "0 0 0 20px rgba(16,185,129,0.1), 0 0 60px rgba(16,185,129,0.3)",
                }}
              >
                <CheckCircle2 color="white" size={52} strokeWidth={2.5} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}
              >
                ¡Inversión Activada!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
              >
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                  Tus <span style={{ color: "#10B981", fontWeight: 900 }}>{amount.toLocaleString()} BC</span> están en modo de crecimiento.
                  Regresa en <span style={{ color: "#fff", fontWeight: 800 }}>{selectedPlan.days} días</span> para cosechar tus ganancias.
                </p>

                <div style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 20,
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(16,185,129,0.8)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Rendimiento esperado</div>
                    <div style={{ fontSize: 22, fontWeight: 950, color: "#10B981" }}>+{potentialReturn.toLocaleString()} BC</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total a recibir</div>
                    <div style={{ fontSize: 22, fontWeight: 950, color: "#fff" }}>{totalReturn.toLocaleString()} BC</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* ── HEADER ── */}
              <div style={{ position: "relative", overflow: "hidden", padding: "32px 32px 28px" }}>
                {/* ambient orbs */}
                <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, background: `radial-gradient(circle, ${selectedPlan.glow} 0%, transparent 70%)`, borderRadius: "50%", transition: "background 0.5s" }} />
                <div style={{ position: "absolute", bottom: -40, left: -30, width: 140, height: 140, background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />

                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* icon */}
                    <motion.div
                      animate={{ boxShadow: [`0 0 20px ${selectedPlan.glow}`, `0 0 40px ${selectedPlan.glow}`, `0 0 20px ${selectedPlan.glow}`] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{
                        width: 56, height: 56, borderRadius: 18,
                        background: selectedPlan.gradient,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Zap size={28} color="white" fill="white" />
                    </motion.div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                          Inversión BIZEN
                        </h2>
                        <div style={{
                          fontSize: 9, fontWeight: 800, color: selectedPlan.accent,
                          background: `${selectedPlan.bgGlow}`, border: `1px solid ${selectedPlan.border}`,
                          padding: "2px 8px", borderRadius: 99, letterSpacing: "0.08em", textTransform: "uppercase",
                          transition: "all 0.4s"
                        }}>LIVE</div>
                      </div>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 500 }}>
                        Pon tus Bizcoins a trabajar para ti
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)" }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Balance pill */}
                <div style={{
                  marginTop: 20,
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 99, padding: "8px 16px 8px 10px",
                }}>
                  <div style={{ width: 28, height: 28, background: "rgba(255,255,255,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Coins size={14} color="#94A3B8" />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Disponible</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{currentBalance.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>BC</span></div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

              <div style={{ padding: "24px 32px 32px" }}>

                {/* ── AMOUNT INPUT ── */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Cantidad a Invertir</div>

                  <div
                    style={{
                      position: "relative",
                      background: inputFocused ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                      border: `1.5px solid ${inputFocused ? selectedPlan.accent : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 20,
                      transition: "all 0.3s",
                      boxShadow: inputFocused ? `0 0 0 4px ${selectedPlan.bgGlow}, 0 0 20px ${selectedPlan.glow}` : "none",
                      overflow: "hidden",
                    }}
                  >
                    {/* subtle shimmer on the input when focused */}
                    {inputFocused && (
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${selectedPlan.bgGlow}, transparent)`, pointerEvents: "none" }} />
                    )}
                    <div style={{ display: "flex", alignItems: "center", padding: "4px 20px" }}>
                      <input
                        type="number"
                        value={amount || ""}
                        onChange={e => { setAmount(Number(e.target.value)); setError(null) }}
                        placeholder="0"
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        style={{
                          flex: 1, background: "transparent", border: "none", outline: "none",
                          fontSize: 40, fontWeight: 950, color: "#fff", padding: "16px 0",
                          letterSpacing: "-0.03em",
                          fontFamily: "inherit",
                        }}
                      />
                      <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>BC</div>
                    </div>

                    {/* usage bar */}
                    <div style={{ height: 3, background: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        style={{ height: "100%", background: selectedPlan.gradient, borderRadius: 99 }}
                      />
                    </div>
                  </div>

                  {/* Quick amounts */}
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {[0.25, 0.5, 0.75, 1].map(pct => (
                      <motion.button
                        key={pct}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleQuickAmount(pct)}
                        style={{
                          flex: 1, padding: "8px 0",
                          borderRadius: 12,
                          background: amount === Math.floor(currentBalance * pct) ? `${selectedPlan.bgGlow}` : "rgba(255,255,255,0.04)",
                          border: `1px solid ${amount === Math.floor(currentBalance * pct) ? selectedPlan.border : "rgba(255,255,255,0.07)"}`,
                          fontSize: 11, fontWeight: 800,
                          color: amount === Math.floor(currentBalance * pct) ? selectedPlan.accent : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {pct === 1 ? "MAX" : `${pct * 100}%`}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* ── PLAN SELECTOR ── */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Plazo de Inversión</div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {STAKING_PLANS.map(plan => {
                      const active = selectedPlan.id === plan.id
                      return (
                        <motion.button
                          key={plan.id}
                          className="plan-card-hover"
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedPlan(plan)}
                          style={{
                            display: "flex", alignItems: "center", gap: 14,
                            padding: "14px 18px", borderRadius: 18, textAlign: "left",
                            cursor: "pointer",
                            background: active ? `${plan.bgGlow}` : "rgba(255,255,255,0.03)",
                            border: `1.5px solid ${active ? plan.border : "rgba(255,255,255,0.07)"}`,
                            boxShadow: active ? `0 0 30px ${plan.glow}` : "none",
                            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                            position: "relative", overflow: "hidden",
                          }}
                        >
                          {/* shine on active */}
                          {active && (
                            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${plan.bgGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
                          )}

                          <div style={{
                            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                            background: active ? plan.gradient : "rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: active ? `0 8px 20px ${plan.glow}` : "none",
                            transition: "all 0.3s",
                          }}>
                            <plan.icon size={20} color={active ? "white" : "rgba(255,255,255,0.3)"} />
                          </div>

                          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <span style={{ fontSize: 14, fontWeight: 800, color: active ? "#fff" : "rgba(255,255,255,0.55)" }}>{plan.label}</span>
                              <span style={{
                                fontSize: 8, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase",
                                padding: "2px 7px", borderRadius: 99,
                                background: active ? plan.gradient : "rgba(255,255,255,0.07)",
                                color: active ? "white" : "rgba(255,255,255,0.3)",
                              }}>{plan.badge}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{plan.days} días · Riesgo <span style={{ color: plan.riskColor, fontWeight: 700 }}>{plan.risk}</span></div>
                          </div>

                          <div style={{ textAlign: "right", position: "relative", zIndex: 1 }}>
                            <div style={{ fontSize: 22, fontWeight: 950, color: active ? plan.accent : "rgba(255,255,255,0.25)", lineHeight: 1, letterSpacing: "-0.02em", transition: "color 0.3s" }}>
                              +{(plan.yieldRate * 100).toFixed(0)}%
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em" }}>retorno</div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* ── YIELD PREVIEW ── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedPlan.id}-${amount}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      borderRadius: 20, marginBottom: 20,
                      background: `linear-gradient(135deg, rgba(255,255,255,0.04), ${selectedPlan.bgGlow})`,
                      border: `1px solid ${amount > 0 ? selectedPlan.border : "rgba(255,255,255,0.07)"}`,
                      overflow: "hidden",
                      transition: "border-color 0.4s"
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div style={{ flex: 1, padding: "18px 20px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Rendimiento</div>
                        <div style={{ fontSize: 26, fontWeight: 950, color: amount > 0 ? "#10B981" : "rgba(255,255,255,0.15)", letterSpacing: "-0.02em", transition: "color 0.3s" }}>
                          +{animatedReturn.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>BC de ganancia</div>
                      </div>
                      <div style={{ flex: 1, padding: "18px 20px" }}>
                        <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Total a Recibir</div>
                        <div style={{ fontSize: 26, fontWeight: 950, color: amount > 0 ? "#fff" : "rgba(255,255,255,0.15)", letterSpacing: "-0.02em", transition: "color 0.3s" }}>
                          {animatedTotal.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>BC en {selectedPlan.days} días</div>
                      </div>
                    </div>

                    {/* mini progress indicator */}
                    {amount > 0 && (
                      <div style={{ padding: "0 20px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>
                          <span>Usando {progress.toFixed(0)}% de tu balance</span>
                          <span>{amount.toLocaleString()} / {currentBalance.toLocaleString()} BC</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                          <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            style={{ height: "100%", background: selectedPlan.gradient, borderRadius: 2 }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* ── ERROR ── */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 16px",
                        background: "rgba(244,63,94,0.08)",
                        border: "1px solid rgba(244,63,94,0.2)",
                        color: "#F87171",
                        borderRadius: 14, fontSize: 12, fontWeight: 600, marginBottom: 20
                      }}
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── CTA BUTTON ── */}
                <motion.button
                  whileHover={amount > 0 && !isSubmitting ? { scale: 1.02, y: -2 } : {}}
                  whileTap={amount > 0 && !isSubmitting ? { scale: 0.98 } : {}}
                  onClick={handleSubmit}
                  disabled={isSubmitting || amount <= 0}
                  className={amount > 0 && !isSubmitting ? "staking-btn-shine" : ""}
                  style={{
                    width: "100%", padding: "20px",
                    borderRadius: 20, border: "none",
                    background: amount > 0 && !isSubmitting
                      ? selectedPlan.gradient
                      : "rgba(255,255,255,0.06)",
                    color: amount > 0 ? "white" : "rgba(255,255,255,0.2)",
                    fontSize: 16, fontWeight: 800,
                    cursor: isSubmitting || amount <= 0 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    boxShadow: amount > 0 ? `0 16px 30px ${selectedPlan.glow}` : "none",
                    transition: "all 0.4s",
                    position: "relative", overflow: "hidden",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Iniciar Inversión
                      {amount > 0 && (
                        <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.8, marginLeft: 2 }}>
                          · {selectedPlan.days}d
                        </span>
                      )}
                    </>
                  )}
                </motion.button>

                {/* Security note */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 16, opacity: 0.4 }}>
                  <Lock size={11} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
                    Transacción segura y encriptada en BIZEN
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
