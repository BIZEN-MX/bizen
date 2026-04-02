"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowUpRight, ArrowDownLeft, History, Search, Filter, Download, Calendar, Tag, ShieldCheck, Zap, ShoppingBag, Flame, BookOpen, Trophy, PlusCircle } from "lucide-react"
import BizcoinIcon from "../BizcoinIcon"

interface Transaction {
  id: string
  amount: number
  type: string
  category: string
  description: string
  createdAt: string
  fromUser?: { nickname: string; avatar: any }
  toUser?: { nickname: string; avatar: any }
}

interface TransactionHistoryModalProps {
  onClose: () => void
  currentBalance: number
}

export default function TransactionHistoryModal({ onClose, currentBalance }: TransactionHistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchFullHistory = async () => {
    try {
      const res = await fetch("/api/wallet/transactions?limit=100")
      if (res.ok) {
        const data = await res.json()
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error("Error fetching full history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFullHistory()
    
    // Hide sidebar on mount
    document.body.classList.add('hide-sidebar')
    return () => {
      document.body.classList.remove('hide-sidebar')
    }
  }, [])

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  const formatAmount = (amt: number) => {
    return amt >= 0 ? `+${amt}` : amt
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "purchase": return <ShoppingBag size={18} color="#f43f5e" />
      case "streak_bonus": return <Flame size={18} color="#f59e0b" />
      case "lesson_reward": return <BookOpen size={18} color="#10b981" />
      case "achievement": return <Trophy size={18} color="#8b5cf6" />
      case "transfer_sent": return <ArrowUpRight size={18} color="#f43f5e" />
      case "transfer_received": return <ArrowDownLeft size={18} color="#10b981" />
      case "staking_reward": return <Zap size={18} color="#8b5cf6" />
      default: return <PlusCircle size={18} color="#0F62FE" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 15000,
        background: "radial-gradient(circle at top right, #0a0f2e 0%, #05081a 100%)",
        backdropFilter: "blur(40px)",
        padding: "clamp(12px, 3vw, 40px)",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        fontFamily: '"SF Pro Display", system-ui, sans-serif'
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      {/* ── HEADER ── */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        maxWidth: 1000, 
        width: "100%", 
        margin: "0 auto 32px" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ 
            width: 52, 
            height: 52, 
            borderRadius: 16, 
            background: "linear-gradient(135deg, #0F62FE, #2563EB)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(15, 98, 254, 0.3)"
          }}>
            <History size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Historial de Cuenta</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 500 }}>Consulta todos tus movimientos de Bizcoins</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ 
            background: "rgba(255,255,255,0.08)", 
            border: "1.5px solid rgba(255,255,255,0.1)", 
            color: "white", 
            width: 44, 
            height: 44, 
            borderRadius: 14, 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        >
          <X size={22} />
        </button>
      </header>

      {/* ── BALANCE & QUICK CARDS ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: 16, 
        maxWidth: 1000, 
        width: "100%", 
        margin: "0 auto 32px" 
      }}>
        <div style={{ 
          background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))", 
          border: "1px solid rgba(255,255,255,0.1)", 
          borderRadius: 24, 
          padding: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Saldo Disponible</div>
            <div style={{ fontSize: 32, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
              <BizcoinIcon size={28} />
              {currentBalance.toLocaleString()} <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>bz</span>
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Movimientos</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{transactions.length}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.1)", 
          borderRadius: 24, 
          padding: "8px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <Search size={20} color="rgba(255,255,255,0.3)" />
          <input 
            type="text" 
            placeholder="Buscar por concepto o categoría..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#fff", 
              fontSize: 16, 
              width: "100%", 
              outline: "none",
              fontWeight: 500
            }} 
          />
        </div>
      </div>

      {/* ── TRANSACTION LIST ── */}
      <div style={{ 
        maxWidth: 1000, 
        width: "100%", 
        margin: "0 auto", 
        flex: 1, 
        overflowY: "auto",
        paddingRight: 8,
      }} className="transaction-scroll">
        <style>{`
          .transaction-scroll::-webkit-scrollbar { width: 6px; }
          .transaction-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 10px; }
          .transaction-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          .transaction-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        `}</style>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 16 }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#0F62FE", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Descifrando bitácora...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, border: "2px dashed rgba(255,255,255,0.05)", borderRadius: 32 }}>
            <div style={{ color: "rgba(255,255,255,0.2)", marginBottom: 16 }}><Search size={48} strokeWidth={1} /></div>
            <h3 style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: 0 }}>No encontramos movimientos</h3>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Intenta con otro concepto o categoría.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(t => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  transition: "all 0.2s"
                }}
                whileHover={{ background: "rgba(255,255,255,0.06)", transform: "scale(1.01)" }}
              >
                {/* Icon Container */}
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 12, 
                  background: "rgba(255,255,255,0.05)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                    {getIcon(t.category)}
                </div>

                {/* Concept */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                    {t.description}
                    {t.category === 'reward' && <Zap size={12} color="#f59e0b" fill="#f59e0b" />}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                      <Calendar size={12} />
                      {new Date(t.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
                    </div>
                    <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <Tag size={10} />
                      {t.category}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ 
                    fontSize: 18, 
                    fontWeight: 900, 
                    color: t.amount >= 0 ? "#10b981" : "#ef4444",
                    letterSpacing: "-0.01em"
                  }}>
                    {formatAmount(t.amount)} <span style={{ fontSize: 10, opacity: 0.6 }}>bz</span>
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Finalizado</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer style={{ maxWidth: 1000, width: "100%", margin: "24px auto 0", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <ShieldCheck size={14} />
        Bitácora de blockchain BIZEN certificada
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </motion.div>
  )
}
