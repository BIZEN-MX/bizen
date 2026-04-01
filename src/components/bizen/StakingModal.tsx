"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Coins, Calendar, TrendingUp, Info, ChevronRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

interface StakingModalProps {
  onClose: () => void
  currentBalance: number
  onSuccess: () => void
}

const STAKING_PLANS = [
  { id: "term_7", days: 7, yieldRate: 0.05, label: "Ahorro Flexible", icon: Calendar, color: "#3B82F6", desc: "Ideal para crecimientos rápidos a corto plazo." },
  { id: "term_14", days: 14, yieldRate: 0.08, label: "Fondo BIZEN", icon: TrendingUp, color: "#8B5CF6", desc: "El equilibrio perfecto entre tiempo y rendimiento." },
  { id: "term_30", days: 30, yieldRate: 0.15, label: "Interés Compuesto", icon: Zap, color: "#EC4899", desc: "Máximo rendimiento para quienes piensan a largo plazo." },
]

export default function StakingModal({ onClose, currentBalance, onSuccess }: StakingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(STAKING_PLANS[0])
  const [amount, setAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const potentialReturn = useMemo(() => {
    return Math.floor(amount * selectedPlan.yieldRate)
  }, [amount, selectedPlan])

  const totalReturn = amount + potentialReturn

  const handleSubmit = async () => {
    if (amount <= 0) {
      setError("Ingresa una cantidad válida")
      return
    }
    if (amount > currentBalance) {
      setError("No tienes suficientes Bizcoins")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/wallet/staking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, days: selectedPlan.days })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al procesar inversión")
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickAmount = (pct: number) => {
    setAmount(Math.floor(currentBalance * pct))
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(10, 20, 50, 0.6)", backdropFilter: "blur(12px)" }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        style={{
          width: "100%", maxWidth: 500, background: "white", borderRadius: 32, overflow: "hidden",
          position: "relative", zIndex: 1001, boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
          border: "1.5px solid rgba(255,255,255,0.1)"
        }}
      >
        {success ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              style={{ width: 80, height: 80, background: "#10B981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}
            >
              <CheckCircle2 color="white" size={48} />
            </motion.div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", marginBottom: 12 }}>¡Inversión Iniciada!</h2>
            <p style={{ color: "#64748B", fontSize: 16, lineHeight: 1.5 }}>
              Tus <span style={{ color: "#0F62FE", fontWeight: 800 }}>{amount} BC</span> están trabajando ahora. Regresa en {selectedPlan.days} días para recoger tus beneficios.
            </p>
          </div>
        ) : (
          <>
            {/* Header Content */}
            <div style={{ background: "linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)", padding: "28px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 150, height: 150, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", padding: 6, cursor: "pointer", color: "white" }}>
                <X size={18} />
              </button>
              
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={22} color="white" fill="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: 0 }}>Inversión BIZEN</h2>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "4px 0 0" }}>Pon tus Bizcoins a trabajar para ti</p>
                </div>
              </div>
            </div>

            <div style={{ padding: 28 }}>
              {/* Wallet Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "#F8FAFC", borderRadius: 16, marginBottom: 24, border: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <Coins size={16} color="#0F62FE" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>Balance disponible</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0F172A" }}>{currentBalance.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8" }}>BC</span></div>
              </div>

              {/* Amount Selection */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "block" }}>Cantidad a Invertir</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    style={{
                      width: "100%", padding: "16px 20px", fontSize: 28, fontWeight: 900, color: "#0F172A",
                      background: "white", border: "2px solid #E2E8F0", borderRadius: 18, outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0F62FE"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                  <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 800, color: "#94A3B8" }}>BIZCOINS</div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {[0.25, 0.5, 0.75, 1].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleQuickAmount(pct)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 10, background: "white", border: "1px solid #E2E8F0",
                        fontSize: 11, fontWeight: 700, color: "#64748B", cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.color = "#0F62FE" }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B" }}
                    >
                      {pct * 100}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Term Selection */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "block" }}>Plazo de Inversión</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {STAKING_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 18,
                        background: selectedPlan.id === plan.id ? `${plan.color}08` : "white",
                        border: selectedPlan.id === plan.id ? `2px solid ${plan.color}` : "2px solid #F1F5F9",
                        textAlign: "left", cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, background: selectedPlan.id === plan.id ? plan.color : "#F1F5F9",
                        display: "flex", alignItems: "center", justifyContent: "center", color: selectedPlan.id === plan.id ? "white" : "#94A3B8"
                      }}>
                        <plan.icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{plan.label}</div>
                        <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>{plan.days} días de maduración</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: plan.color }}>+{(plan.yieldRate * 100).toFixed(0)}%</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>Retorno</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prediction Summary */}
              <div style={{ background: "#F1F5F9", borderRadius: 20, padding: 20, marginBottom: 24, border: "1px dashed #CBD5E1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Rendimiento estimado:</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#10B981" }}>+{potentialReturn.toLocaleString()} BC</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #CBD5E1" }}>
                  <span style={{ fontSize: 14, color: "#0F172A", fontWeight: 800 }}>Total a recibir:</span>
                  <span style={{ fontSize: 18, fontWeight: 950, color: "#0F172A" }}>{totalReturn.toLocaleString()} BC</span>
                </div>
              </div>

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "#FFF1F2", color: "#E11D48", borderRadius: 12, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || amount <= 0}
                style={{
                  width: "100%", padding: "18px", borderRadius: 18, border: "none",
                  background: isSubmitting || amount <= 0 ? "#E2E8F0" : "linear-gradient(135deg, #0F62FE, #3B82F6)",
                  color: "white", fontSize: 16, fontWeight: 800, cursor: isSubmitting || amount <= 0 ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: amount > 0 ? "0 10px 20px rgba(15, 98, 254, 0.25)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Iniciar Inversión"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
