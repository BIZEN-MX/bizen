"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  History, 
  Search, 
  Coins, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingBag, 
  Flame, 
  BookOpen, 
  Trophy, 
  PlusCircle,
  TrendingUp,
  Zap,
  ArrowLeft,
  Filter
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
  }, [user, loading, router])

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  const formatAmount = (amt: number, category: string) => {
    const isSent = ["transfer_sent", "purchase", "investment", "staking_position_created"].includes(category);
    const prefix = isSent ? "-" : (amt > 0 ? "+" : "");
    return `${prefix}${Math.abs(amt).toLocaleString()}`;
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "purchase": return <ShoppingBag className="text-rose-400" size={20} />
      case "streak_bonus": return <Flame className="text-amber-400" size={20} />
      case "lesson_reward": return <BookOpen className="text-emerald-400" size={20} />
      case "achievement": return <Trophy className="text-violet-400" size={20} />
      case "transfer_sent": return <ArrowUpRight className="text-rose-400" size={20} />
      case "transfer_received": return <ArrowDownLeft className="text-emerald-400" size={20} />
      case "staking_reward": return <Zap className="text-violet-400" size={20} />
      case "investment": return <TrendingUp className="text-rose-400" size={20} />
      case "investment_reward": return <TrendingUp className="text-emerald-400" size={20} />
      default: return <PlusCircle className="text-blue-400" size={20} />
    }
  }

  if (loading || isFetching) return <PageLoader />
  if (!user) return null

  return (
    <div className="min-h-screen bg-[#05081a] text-white selection:bg-blue-500/30 overflow-x-hidden pt-6 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

      <main className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Back and Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
             <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold uppercase tracking-wider">Volver</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <History className="text-blue-400" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none mb-1">Movimientos</h1>
                <p className="text-slate-400 text-sm font-medium">Auditoría completa de tu billetera BIZEN</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/10 rounded-2xl px-6 py-4 backdrop-blur-md self-start md:self-auto">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Saldo Actual</span>
            <div className="flex items-center gap-3">
              <Coins className="text-amber-400" size={22} />
              <span className="text-2xl font-black">{(dbProfile?.bizcoins || 0).toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-500 mb-[-4px]">BC</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por descripción o categoría..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 font-medium"
            />
          </div>
          <button className="px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <Filter size={18} />
            <span className="text-sm font-bold">Filtros</span>
          </button>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-800/50 border-dashed"
              >
                <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="text-slate-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-400">No se encontraron movimientos</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Intenta ajustar tu búsqueda para encontrar lo que necesitas.</p>
              </motion.div>
            ) : (
              filtered.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group relative overflow-hidden bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/20 backdrop-blur-md p-5 rounded-2xl flex items-center gap-5 transition-all outline-none"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {getIcon(t.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-100 mb-1 truncate group-hover:text-white transition-colors">
                      {t.description}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                      <span className="flex items-center gap-1.5 bg-white/5 py-0.5 px-2 rounded-md">
                        <Calendar size={12} />
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>{t.category.replace(/_/g, " ")}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xl font-black tracking-tighter ${
                      ["transfer_sent", "purchase", "investment", "staking_position_created"].includes(t.category) 
                      ? "text-rose-500" 
                      : "text-emerald-500"
                    }`}>
                      {formatAmount(t.amount, t.category)} <span className="text-[10px] opacity-70 ml-0.5">BC</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
