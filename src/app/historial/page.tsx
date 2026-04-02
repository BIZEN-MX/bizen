"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Search, 
  Coins, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Zap, 
  ShoppingBag, 
  Flame, 
  BookOpen, 
  Trophy, 
  PlusCircle,
  TrendingUp
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"

interface Transaction {
  id: string
  amount: number
  type: string
  category: string
  description: string
  createdAt: string
}

export default function HistorialPage() {
  const { user, dbProfile, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [search, setSearch] = useState("")

  const fetchFullHistory = async () => {
    try {
      const res = await fetch("/api/wallet/transactions?limit=100")
      if (res.ok) {
        const data = await res.json()
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error("Error fetching account history:", err)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }

    fetchFullHistory()
    
    // Hide sidebar on mount for full immersion
    document.body.classList.add('hide-sidebar')
    return () => {
      document.body.classList.remove('hide-sidebar')
    }
  }, [user, loading, router])

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  const formatAmount = (amt: number, category: string) => {
    // Determine sign: deductions (-), additions (+)
    const isSent = category === "transfer_sent" || category === "purchase" || category === "investment";
    const prefix = isSent ? "-" : (amt > 0 ? "+" : "");
    return `${prefix}${Math.abs(amt).toLocaleString()}`;
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "purchase": return <ShoppingBag size={20} color="#f43f5e" />
      case "streak_bonus": return <Flame size={20} color="#f59e0b" />
      case "lesson_reward": return <BookOpen size={20} color="#10b981" />
      case "achievement": return <Trophy size={20} color="#8b5cf6" />
      case "transfer_sent": return <ArrowUpRight size={20} color="#f43f5e" />
      case "transfer_received": return <ArrowDownLeft size={20} color="#10b981" />
      case "staking_reward": return <Zap size={20} color="#8b5cf6" />
      case "investment": return <TrendingUp size={20} color="#f43f5e" />
      case "investment_reward": return <TrendingUp size={20} color="#10b981" />
      default: return <PlusCircle size={20} color="#0F62FE" />
    }
  }

  if (loading || isFetching) return <PageLoader />
  if (!user) return null

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, #0a0f2e 0%, #05081a 100%)",
      color: "#fff",
      fontFamily: '"SF Pro Display", system-ui, sans-serif',
      padding: "0",
      width: "100%"
    }}>
      <style>{`
        .transaction-scroll::-webkit-scrollbar { width: 6px; }
        .transaction-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 10px; }
        .transaction-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .transaction-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        
        .card-glass {
           background: rgba(255, 255, 255, 0.03);
           backdrop-filter: blur(20px);
           border: 1.5px solid rgba(255, 255, 255, 0.08);
           border-radius: 24px;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-glass:hover {
           background: rgba(255, 255, 255, 0.05);
           border-color: rgba(15, 98, 254, 0.3);
           transform: translateY(-2px);
        }
      `}</style>

      {/* ── BACKGROUND ORNAMENT ── */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "-10%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(15, 98, 254, 0.15) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(100px)" }} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
        
        {/* ── TOP NAVIGATION ── */}
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 48,
          animation: "fadeIn 0.6s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button 
              onClick={() => router.push("/dashboard")}
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 16, 
                background: "rgba(255,255,255,0.05)", 
                border: "1.5px solid rgba(255,255,255,0.1)", 
                color: "white", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(15, 98, 254, 0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              <X size={22} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <History size={24} color="#0F62FE" />
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.03em" }}>Historial de Movimientos</h1>
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 500 }}>
                Auditoría completa de tus transacciones en tiempo real.
              </p>
            </div>
          </div>

          <div style={{ 
            background: "linear-gradient(135deg, rgba(15, 98, 254, 0.15), rgba(15, 98, 254, 0.05))", 
            border: "1.5px solid rgba(15, 98, 254, 0.2)", 
            borderRadius: 20, 
            padding: "12px 24px",
            textAlign: "right",
            boxShadow: "0 10px 30px rgba(15, 98, 254, 0.1)"
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(15, 98, 254, 0.8)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Saldo Actual</div>
            <div style={{ fontSize: 26, fontWeight: 950, color: "white", display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
              <Coins size={24} color="#f59e0b" />
              {(dbProfile?.bizcoins || 0).toLocaleString()} <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>BC</span>
            </div>
          </div>
        </header>

        {/* ── SEARCH & FILTERS ── */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ position: "relative", maxWidth: 600 }}>
            <input 
              type="text" 
              placeholder="Buscar por descripción..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "18px 24px 18px 56px", 
                background: "rgba(255,255,255,0.03)", 
                border: "2px solid rgba(255,255,255,0.08)", 
                borderRadius: 20,
                color: "white",
                fontSize: 16,
                fontWeight: 500,
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#0F62FE"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <Search size={22} color="rgba(255,255,255,0.25)" style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </section>

        {/* ── TRANSACTION FEED ── */}
        <section>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "100px 0", background: "rgba(255,255,255,0.02)", borderRadius: 32, border: "2px dashed rgba(255,255,255,0.05)" }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0" }}>Sin movimientos</h3>
              </div>
            ) : (
              filtered.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card-glass"
                  style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {getIcon(t.category)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{t.description}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Calendar size={14} />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 950, color: (t.category === "transfer_sent" || t.category === "purchase" || t.category === "investment") ? "#ef4444" : "#10b981" }}>
                      {formatAmount(t.amount, t.category)} BC
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
