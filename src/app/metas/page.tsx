"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Target, 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  Trophy, 
  Flame, 
  Coins, 
  Briefcase, 
  ShoppingBag, 
  Laptop, 
  Gamepad2, 
  TrendingUp,
  Search,
  Zap,
  CheckCircle2
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"

// --- Icons for Goals ---
const GOAL_ICONS = [
  { id: "laptop", Icon: Laptop, color: "#3b82f6" },
  { id: "game", Icon: Gamepad2, color: "#8b5cf6" },
  { id: "bag", Icon: ShoppingBag, color: "#ec4899" },
  { id: "job", Icon: Briefcase, color: "#f59e0b" },
  { id: "invest", Icon: TrendingUp, color: "#10b981" },
  { id: "other", Icon: Target, color: "#64748b" }
]

export default function SavingsGoalsPage() {
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [goals, setGoals] = useState<any[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fetchGoals = async () => {
    try {
      const res = await fetch(`/api/wallet/goals?t=${Date.now()}`)
      if (res.ok) {
        const data = await res.json()
        setGoals(data.goals || [])
      }
    } catch (err) {
      console.error("Error fetching goals", err)
    } finally {
      setLoadingGoals(false)
    }
  }

  useEffect(() => {
    if (user) fetchGoals()
  }, [user])

  if (loading || !mounted) return <PageLoader />
  if (!user) { router.push("/login"); return null }

  const bizcoins = (dbProfile as any)?.bizcoins || 0

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 24px 100px" }}>
      <style>{`
        @media (min-width: 768px) {
          .goals-container { margin-left: 280px; }
        }
        .goal-card {
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .goal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
      `}</style>

      <div className="goals-container" style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <motion.div 
              whileHover={{ x: -4 }}
              onClick={() => router.push("/dashboard")}
              style={{ width: 44, height: 44, borderRadius: 14, background: "white", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ArrowLeft size={20} color="#64748b" />
            </motion.div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>Metas de Ahorro</h1>
              <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0", fontWeight: 500 }}>Visualiza tus sueños y conviértelos en realidad.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/tienda")} // Redirect to shop as it's the place to "buy" goals/items usually, or a placeholder for create
            style={{ 
              background: "#0F62FE", color: "white", border: "none", 
              padding: "12px 24px", borderRadius: 16, fontWeight: 800, 
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              boxShadow: "0 8px 24px rgba(15,98,254,0.25)"
            }}
          >
            <Plus size={20} />
            Nueva Meta
          </motion.button>
        </div>

        {/* Bizcoins Balance Summary */}
        <div style={{ 
          background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)", 
          borderRadius: 28, padding: "32px", marginBottom: 40,
          color: "white", position: "relative", overflow: "hidden",
          boxShadow: "0 20px 40px rgba(15,98,254,0.2)"
        }}>
          <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 300, height: 300, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(50px)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Balance Disponible</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 44, fontWeight: 950, letterSpacing: "-0.04em" }}>{bizcoins.toLocaleString()}</span>
              <span style={{ fontSize: 18, fontWeight: 800, opacity: 0.8 }}>Bizcoins</span>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={14} color="#fbbf24" /> +120 bz ganados hoy
              </div>
            </div>
          </div>
        </div>

        {/* Goals List */}
        {loadingGoals ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Target size={40} color="#cbd5e1" />
            </motion.div>
          </div>
        ) : goals.length === 0 ? (
          <div style={{ 
            background: "white", border: "2px dashed #e2e8f0", 
            borderRadius: 32, padding: "80px 40px", textAlign: "center" 
          }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Target size={40} color="#94a3b8" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 }}>Aún no tienes metas activas</h2>
            <p style={{ fontSize: 16, color: "#64748b", margin: "12px 0 32px", maxWidth: 400, marginInline: "auto" }}>
              Define qué quieres lograr con tus Bizcoins y Billy te ayudará a trazar el camino.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push("/tienda")}
              style={{ 
                background: "#f1f5f9", color: "#475569", border: "none", 
                padding: "14px 32px", borderRadius: 16, fontWeight: 800, 
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Ir a la Tienda de Metas
            </motion.button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 24 }}>
            {goals.map((goal) => {
              const progress = Math.min(100, Math.round((bizcoins / goal.targetAmount) * 100))
              const iconData = GOAL_ICONS.find(i => i.id === goal.icon) || GOAL_ICONS[GOAL_ICONS.length - 1]
              const Icon = iconData.Icon

              return (
                <div key={goal.id} className="goal-card">
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ 
                      width: 64, height: 64, borderRadius: 20, 
                      background: `${iconData.color}15`, 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: iconData.color, flexShrink: 0
                    }}>
                      <Icon size={32} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: iconData.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{goal.category || "Meta"}</div>
                          <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", margin: 0 }}>{goal.title}</h3>
                        </div>
                        {progress === 100 && <CheckCircle2 size={24} color="#10b981" />}
                      </div>
                      
                      <div style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                          <span style={{ color: "#64748b" }}>Progreso</span>
                          <span style={{ color: "#0f172a" }}>{progress}%</span>
                        </div>
                        <div style={{ height: 10, background: "#f1f5f9", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ 
                              height: "100%", 
                              background: progress === 100 ? "#10b981" : `linear-gradient(90deg, ${iconData.color}, ${iconData.color}dd)`,
                              borderRadius: 10,
                              boxShadow: `0 0 12px ${iconData.color}40`
                            }} 
                          />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>
                          <span>{bizcoins.toLocaleString()} bz</span>
                          <span>Objetivo: {goal.targetAmount.toLocaleString()} bz</span>
                        </div>
                      </div>

                      {progress === 100 ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          style={{ 
                            marginTop: 20, width: "100%", background: "#10b981", color: "white", 
                            border: "none", padding: "12px", borderRadius: 14, fontWeight: 800, cursor: "pointer"
                          }}
                        >
                          ¡Canjear Meta!
                        </motion.button>
                      ) : (
                        <div style={{ marginTop: 20, padding: "10px", background: "#f8fafc", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                          <Flame size={14} color="#f59e0b" />
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Faltan {(goal.targetAmount - bizcoins).toLocaleString()} bz</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
