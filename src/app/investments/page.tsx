"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Zap, 
  Coins, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Lock, 
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Info
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import BizcoinIcon from "@/components/BizcoinIcon"

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

export default function InvestmentsPage() {
  const { user, dbProfile, loading, refreshUser } = useAuth()
  const router = useRouter()
  
  const [selectedPlan, setSelectedPlan] = useState(STAKING_PLANS[1]) 
  const [amount, setAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const bizcoins = dbProfile?.bizcoins || 0
  const potentialReturn = useMemo(() => Math.floor(amount * selectedPlan.yieldRate), [amount, selectedPlan])
  const totalReturn = amount + potentialReturn
  const animatedReturn = useAnimatedNumber(potentialReturn)
  const animatedTotal = useAnimatedNumber(totalReturn)
  const progress = bizcoins > 0 ? Math.min((amount / bizcoins) * 100, 100) : 0

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }
    // Hide sidebar on mount
    document.body.classList.add('hide-sidebar')
    return () => {
      document.body.classList.remove('hide-sidebar')
    }
  }, [user, loading, router])

  const handleSubmit = async () => {
    if (amount <= 0) { setError("Ingresa una cantidad válida"); return }
    if (amount > bizcoins) { setError("No tienes suficientes Bizcoins"); return }
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
      await refreshUser()
    } catch (err: any) { setError(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleQuickAmount = (pct: number) => setAmount(Math.floor(bizcoins * pct))

  if (loading) return <PageLoader />
  if (!user) return null

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, #0a0f2e 0%, #05081a 100%)",
      color: "#fff",
      fontFamily: '"SF Pro Display", system-ui, sans-serif',
      width: "100%",
      position: "relative",
      overflowX: "hidden"
    }}>
      <style>{`
        @keyframes shimmer { 0%{left:-100%} 100%{left:120%} }
        .input-glass:focus { border-color: #0F62FE !important; background: rgba(255,255,255,0.06) !important; }
        .card-glass {
           background: rgba(255, 255, 255, 0.03);
           backdrop-filter: blur(20px);
           border: 1.5px solid rgba(255, 255, 255, 0.08);
           border-radius: 28px;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-glass:hover {
           background: rgba(255, 255, 255, 0.05);
           border-color: rgba(15, 98, 254, 0.3);
        }

        /* Hide number arrows */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Decorative Orbs */}
      <div style={{ position: "fixed", top: "-10%", right: "-5%", width: "40%", height: "40%", background: `radial-gradient(circle, ${selectedPlan.glow} 0%, transparent 70%)`, pointerEvents: "none", filter: "blur(100px)", opacity: 0.3, transition: "background 0.8s ease" }} />
      <div style={{ position: "fixed", bottom: "-5%", left: "-5%", width: "30%", height: "30%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(80px)", opacity: 0.2 }} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        
        {/* ── TOP HEADER ── */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button 
              onClick={() => router.back()}
              style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(15, 98, 254, 0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              <X size={22} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.03em" }}>Inversión BIZEN</h1>
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 500 }}>
                Pon tus Bizcoins a trabajar para ti.
              </p>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(15, 98, 254, 0.15), rgba(15, 98, 254, 0.05))", border: "1.5px solid rgba(15, 98, 254, 0.2)", borderRadius: 20, padding: "12px 24px", textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(15, 98, 254, 0.8)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Disponible</div>
            <div style={{ fontSize: 26, fontWeight: 950, color: "white", display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
              <BizcoinIcon size={24} />
              {bizcoins.toLocaleString()} <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>bz</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-glass"
              style={{ maxWidth: 640, margin: "60px auto", padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <Particle key={i} color={["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"][i % 4]} />
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
                style={{ width: 100, height: 100, background: "linear-gradient(135deg, #059669, #10B981)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 0 0 20px rgba(16,185,129,0.1), 0 0 60px rgba(16,185,129,0.3)" }}
              >
                <CheckCircle2 color="white" size={52} strokeWidth={2.5} />
              </motion.div>

              <h2 style={{ fontSize: 32, fontWeight: 950, color: "#fff", marginBottom: 12, letterSpacing: "-0.03em" }}>¡Inversión Iniciada!</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.6, marginBottom: 40 }}>
                Has puesto <strong style={{ color: "#10B981" }}>{amount.toLocaleString()} bz</strong> a trabajar. Los rendimientos se acreditarán automáticamente en <strong style={{ color: "#fff" }}>{selectedPlan.days} días</strong>.
              </p>

              <div style={{ display: "flex", gap: 16 }}>
                <button 
                  onClick={() => router.back()}
                  style={{ flex: 1, padding: "20px", borderRadius: 20, background: "white", color: "#0a0f2e", border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer" }}
                >
                  Volver al Dashboard
                </button>
                <button 
                  onClick={() => { setSuccess(false); setAmount(0); }}
                  style={{ flex: 1, padding: "20px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "white", border: "1.5px solid rgba(255,255,255,0.1)", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
                >
                  Nueva Inversión
                </button>
              </div>
            </motion.div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32 }}>
              
              {/* ── LEFT COLUMN: PLAN & INPUT ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Amount Selection */}
                <section className="card-glass" style={{ padding: 40 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Cantidad a Invertir</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Mín: 1 bz · Máx: {bizcoins.toLocaleString()}</div>
                  </div>

                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.03)", border: `2px solid ${inputFocused ? selectedPlan.accent : "rgba(255,255,255,0.08)"}`, borderRadius: 24, padding: "10px 32px", transition: "all 0.3s", boxShadow: inputFocused ? `0 0 30px ${selectedPlan.glow}` : "none" }}>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={amount || ""}
                        onChange={e => setAmount(Number(e.target.value))}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 56, fontWeight: 950, color: "white", letterSpacing: "-0.04em" }}
                      />
                      <span style={{ fontSize: 24, fontWeight: 900, color: "rgba(255,255,255,0.2)" }}>bz</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    {[0.25, 0.5, 0.75, 1].map(pct => (
                      <button
                        key={pct}
                        onClick={() => handleQuickAmount(pct)}
                        style={{ flex: 1, padding: "14px 0", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white" }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
                      >
                        {pct === 1 ? "MAX" : `${pct * 100}%`}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Plan Selection */}
                <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, marginLeft: 8 }}>Plazo de Inversión</div>
                <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {STAKING_PLANS.map(plan => {
                    const active = selectedPlan.id === plan.id
                    return (
                      <motion.div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        whileHover={{ x: 8 }}
                        className="card-glass"
                        style={{ 
                          padding: "24px 32px", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 24, 
                          cursor: "pointer", 
                          border: `1.5px solid ${active ? plan.border : "rgba(255,255,255,0.08)"}`,
                          background: active ? plan.bgGlow : "rgba(255,255,255,0.03)",
                          boxShadow: active ? `0 0 40px ${plan.glow}` : "none"
                        }}
                      >
                        <div style={{ width: 64, height: 64, borderRadius: 20, background: plan.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: active ? `0 10px 25px ${plan.glow}` : "none" }}>
                          <plan.icon size={32} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{plan.label}</h3>
                            <span style={{ fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 99, background: plan.gradient, color: "white" }}>{plan.badge}</span>
                          </div>
                          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 500 }}>{plan.desc}</p>
                          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {plan.days} días</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: plan.riskColor, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} /> Riesgo {plan.risk}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 32, fontWeight: 950, color: active ? plan.accent : "rgba(255,255,255,0.3)", transition: "color 0.3s" }}>+{(plan.yieldRate * 100).toFixed(0)}%</div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Retorno Estimado</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </section>
              </div>

              {/* ── RIGHT COLUMN: SUMMARY & ACTIONS ── */}
              <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Summary Card */}
                <div className="card-glass" style={{ padding: "40px 32px", position: "sticky", top: 40, background: "rgba(255,255,255,0.02)" }}>
                  <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
                    Resumen del Contrato <ShieldCheck size={24} color="#10B981" />
                  </h3>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      style={{ background: "rgba(255,255,255,0.03)", padding: "20px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 4 }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Inversión</span>
                      <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em" }}>{amount.toLocaleString()} <span style={{ fontSize: 12, opacity: 0.5, fontWeight: 500 }}>bz</span></span>
                    </motion.div>
                    <motion.div 
                      key={animatedReturn}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      style={{ background: "rgba(16,185,129,0.05)", padding: "20px 16px", borderRadius: 20, border: "1px solid rgba(16,185,129,0.1)", display: "flex", flexDirection: "column", gap: 4 }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ganancia</span>
                      <span style={{ fontWeight: 900, fontSize: 20, color: "#10B981", letterSpacing: "-0.02em" }}>+{animatedReturn.toLocaleString()} <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>bz</span></span>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    key={selectedPlan.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ background: selectedPlan.gradient, padding: "24px", borderRadius: 24, marginBottom: 24, boxShadow: `0 15px 35px ${selectedPlan.glow}`, position: "relative", overflow: "hidden" }}
                  >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "translateX(-100%)", animation: "shimmer 3s infinite" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>Total a Liquidar</span>
                        <motion.span 
                          key={animatedTotal}
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          style={{ fontWeight: 950, fontSize: 28, color: "#fff", letterSpacing: "-0.04em" }}
                        >
                          {animatedTotal.toLocaleString()} bz
                        </motion.span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>Plazo</span>
                        <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>{selectedPlan.days} Días</span>
                      </div>
                    </div>
                  </motion.div>

                  <div style={{ background: "rgba(15, 98, 254, 0.05)", border: "1px solid rgba(15, 98, 254, 0.15)", borderRadius: 20, padding: "20px", display: "flex", gap: 12, marginBottom: 32 }}>
                    <Info size={20} color="#0F62FE" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>
                      Tu capital quedará bloqueado durante <strong>{selectedPlan.days} días</strong>. Al finalizar el plazo, recibirás el monto original más el rendimiento generado.
                    </p>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting || amount <= 0 || amount > bizcoins}
                    style={{ 
                      width: "100%", 
                      padding: "24px", 
                      borderRadius: 24, 
                      background: amount > 0 && amount <= bizcoins ? selectedPlan.gradient : "rgba(255,255,255,0.05)", 
                      color: amount > 0 && amount <= bizcoins ? "white" : "rgba(255,255,255,0.2)", 
                      border: "none", 
                      fontSize: 18, 
                      fontWeight: 900, 
                      cursor: (isSubmitting || amount <= 0 || amount > bizcoins) ? "not-allowed" : "pointer",
                      boxShadow: amount > 0 && amount <= bizcoins ? `0 20px 40px ${selectedPlan.glow}` : "none",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12
                    }}
                  >
                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <><Sparkles size={20} /> Iniciar Inversión</>}
                  </motion.button>
                  
                  {error && <div style={{ marginTop: 16, textAlign: "center", color: "#ef4444", fontWeight: 700, fontSize: 14 }}>{error}</div>}
                  
                  <motion.div 
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}
                  >
                    <Lock size={12} color="#0F62FE" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>Protocolo BIZEN Ledger v2.1 Activo</span>
                  </motion.div>
                </div>
              </aside>

            </div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ padding: "60px 20px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 500 }}>
        BIZEN Asset Management & Staking Protocol · 2026
      </footer>

    </div>
  )
}
