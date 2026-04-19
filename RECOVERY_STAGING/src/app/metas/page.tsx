"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { 
  Target, 
  ArrowLeft, 
  Plus, 
  Trophy, 
  Flame, 
  Coins, 
  Briefcase, 
  ShoppingBag, 
  Laptop, 
  Gamepad2, 
  TrendingUp,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"

// --- Icons for Goals ---
const GOAL_ICONS = [
  { id: "laptop", Icon: Laptop, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30" },
  { id: "game", Icon: Gamepad2, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30" },
  { id: "bag", Icon: ShoppingBag, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/30" },
  { id: "job", Icon: Briefcase, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
  { id: "invest", Icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
  { id: "other", Icon: Target, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30" }
]

export default function SavingsGoalsPage() {
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [goals, setGoals] = useState<any[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newCategory, setNewCategory] = useState("other")
  const [newDeadline, setNewDeadline] = useState("30")
  const [isCreating, setIsCreating] = useState(false)

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

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newAmount) return
    setIsCreating(true)
    try {
      const deadlineDate = new Date()
      deadlineDate.setDate(deadlineDate.getDate() + parseInt(newDeadline))

      const res = await fetch("/api/wallet/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: newTitle, 
          targetAmount: parseInt(newAmount), 
          category: newCategory,
          deadline: deadlineDate.toISOString()
        })
      })
      if (res.ok) {
        setIsModalOpen(false)
        setNewTitle("")
        setNewAmount("")
        setNewCategory("other")
        setNewDeadline("30")
        fetchGoals()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsCreating(false)
    }
  }

  const handleRedeemGoal = async (goalId: string, title: string) => {
    try {
      const res = await fetch(`/api/wallet/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: true })
      })
      if (res.ok) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        })
        fetchGoals()
      }
    } catch (e) {
      console.error("Error redeeming goal", e);
    }
  }

  if (loading || !mounted) return <PageLoader />
  if (!user) { router.push("/login"); return null }

  const bizcoins = (dbProfile as any)?.bizcoins || 0

  return (
    <div className="min-h-screen bg-[#05081a] text-white selection:bg-blue-500/30 pt-6 pb-20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] pointer-events-none rounded-full" />

      <main className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold uppercase tracking-wider">Volver</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Target className="text-blue-400" size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight leading-none mb-1">Mis Metas</h1>
                <p className="text-slate-400 text-sm font-medium">Define tus sueños y Billy te ayudará a lograrlos.</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="group relative flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl shadow-blue-600/30 transition-all overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Nueva Meta</span>
          </motion.button>
        </div>

        {/* Balance Card Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 rounded-[32px] p-8 shadow-2xl shadow-blue-900/40 border border-white/10 group">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-200/60 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-amber-300" /> Capital para tus sueños
                </span>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-6xl font-black tracking-tighter drop-shadow-md">
                    {bizcoins.toLocaleString()}
                  </h2>
                  <span className="text-xl font-bold text-blue-200/80">Bizcoins</span>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm font-bold">
                  <Zap size={16} className="text-amber-400" />
                  <span>+120 bz hoy</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-300 text-sm font-bold">
                  <TrendingUp size={16} />
                  <span>Creciendo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl rounded-[32px] p-8 border border-slate-800 flex flex-col items-center justify-center text-center group border-dashed hover:border-blue-500/50 transition-colors">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="text-blue-400" size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Billy Tips</h3>
            <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
              "Ahorrar no es dejar de gastar, es empezar a construir tu libertad financiera."
            </p>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Metas Activas <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md font-black">{goals.length}</span>
            </h2>
            <button className="text-blue-400 text-sm font-bold hover:underline">Ver todas</button>
          </div>

          {loadingGoals ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
              />
              <span className="text-slate-500 font-bold animate-pulse">Consultando tus sueños...</span>
            </div>
          ) : goals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[32px] p-16 text-center"
            >
              <div className="w-20 h-20 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={40} className="text-slate-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-300 mb-3">Tu lienzo está en blanco</h2>
              <p className="text-slate-500 text-lg max-w-sm mx-auto mb-10 font-medium">
                Define qué quieres lograr con tus Bizcoins y trazamos el mapa del tesoro juntos.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black transition-all group"
              >
                Crear primera Meta
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, idx) => {
                const progress = Math.min(100, Math.round((bizcoins / goal.targetAmount) * 100))
                const iconDef = GOAL_ICONS.find(i => i.id === goal.category) || GOAL_ICONS[GOAL_ICONS.length - 1]
                const Icon = iconDef.Icon

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-900/30 backdrop-blur-md border border-slate-800 hover:border-blue-500/30 p-8 rounded-[32px] group transition-all"
                  >
                    <div className="flex gap-6 mb-8">
                      <div className={`w-16 h-16 rounded-2xl ${iconDef.bg} ${iconDef.border} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={iconDef.color} size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${iconDef.color} mb-1 block`}>
                              {goal.category || "Inversión"}
                            </span>
                            <h3 className="text-xl font-black truncate group-hover:text-white transition-colors">
                              {goal.title}
                            </h3>
                            {goal.deadline && (
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">
                                Plazo: {new Date(goal.deadline).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                          {(progress === 100 || goal.isCompleted) && (
                            <div className="bg-emerald-500/20 p-1.5 rounded-full">
                              <CheckCircle2 size={22} className="text-emerald-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {goal.isCompleted ? (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl" />
                           <Trophy size={40} className="text-emerald-400 mb-3 drop-shadow-md" />
                           <span className="text-lg font-black tracking-tighter text-emerald-400">¡Meta Alcanzada!</span>
                           <span className="text-xs font-bold text-emerald-500/70 mt-1 uppercase tracking-widest">Lo lograste</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progreso</span>
                            <span className="text-2xl font-black tracking-tighter text-white">{progress}%</span>
                          </div>
                          <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                              className={`h-full rounded-full shadow-lg ${
                                progress === 100 
                                ? "bg-emerald-500 shadow-emerald-500/30" 
                                : "bg-blue-600 shadow-blue-500/30"
                              }`}
                            />
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold font-mono tracking-tighter">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Coins size={14} className="text-amber-400" />
                              <span>{bizcoins.toLocaleString()} bz</span>
                            </div>
                            <div className="text-slate-600 uppercase tracking-widest text-[10px]">
                              Meta: {goal.targetAmount.toLocaleString()} bz
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800/50">
                          {progress === 100 ? (
                            <button onClick={() => handleRedeemGoal(goal.id, goal.title)} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                              <Sparkles size={20} />
                              Canjear Meta
                            </button>
                          ) : (
                            <div className="flex items-center gap-3 bg-slate-800/50 py-3 px-4 rounded-2xl border border-slate-800 text-sm font-bold text-slate-400">
                              <Flame size={18} className="text-amber-400 animate-pulse" />
                              <span>Faltan {(goal.targetAmount - bizcoins).toLocaleString()} bz para tu meta</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── CREATE GOAL MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={(e) => { if(e.target === e.currentTarget) setIsModalOpen(false) }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white mb-6">Crear Nueva Meta</h2>
              <form onSubmit={handleCreateGoal} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">¿Qué quieres lograr?</label>
                  <input 
                    type="text" 
                    required 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Viaje al mundial, Consola, Invertir"
                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white font-medium outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Costo (Bizcoins)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">bz</span>
                    <input 
                      type="number" 
                      required 
                      min="100"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="10000"
                      className="w-full bg-slate-800 border-2 border-slate-700 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3 text-white font-black text-lg outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Plazo de tiempo</label>
                  <select
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white font-bold outline-none transition-colors appearance-none"
                  >
                    <option value="7">1 semana (Reto Exprés)</option>
                    <option value="30">1 mes (Corto plazo)</option>
                    <option value="90">3 meses (Mediano plazo)</option>
                    <option value="180">6 meses (Largo plazo)</option>
                    <option value="365">1 año (Gran Meta)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-3">Categoría</label>
                  <div className="grid grid-cols-3 gap-3">
                    {GOAL_ICONS.map((cat) => {
                      const CIcon = cat.Icon;
                      const isSelected = newCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewCategory(cat.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'}`}
                        >
                          <CIcon size={24} className={isSelected ? cat.color : "text-slate-500"} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-500'}`}>{cat.id}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isCreating} className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50">
                    {isCreating ? "Guardando..." : "Establecer Meta"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
