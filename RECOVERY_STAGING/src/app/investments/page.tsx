"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
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
  Info,
  ArrowRight,
  Clock,
  History
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import BizcoinIcon from "@/components/BizcoinIcon"

/**
 * BIZEN Investments Page
 * Modern Staking Dashboard with Positions History
 */

const STAKING_PLANS = [
  {
    id: "term_1",
    days: 1,
    yieldRate: 0.01,
    label: "Ahorro Inteligente",
    badge: "CORTO",
    icon: Coins,
    color: "text-emerald-400",
    bg: "bg-emerald-600/10",
    border: "border-emerald-500/30",
    gradient: "from-emerald-600 to-emerald-400",
    glow: "shadow-emerald-500/20",
    glowColor: "bg-emerald-600",
    cardGradient: "from-emerald-600 to-emerald-800",
    desc: "Cuenta a la vista. Tu dinero trabajando con la flexibilidad de usarlo mañana.",
    liquidity: "Inmediata",
    liquidityColor: "text-emerald-400",
  },
  {
    id: "term_7",
    days: 7,
    yieldRate: 0.05,
    label: "Ahorro Flexible",
    badge: "BÁSICO",
    icon: Calendar,
    color: "text-blue-400",
    bg: "bg-blue-600/10",
    border: "border-blue-500/30",
    gradient: "from-blue-600 to-blue-400",
    glow: "shadow-blue-500/20",
    glowColor: "bg-blue-600",
    cardGradient: "from-blue-600 to-blue-800",
    desc: "Una tasa segura y fija. Ideal para mantener liquidez casi inmediata.",
    liquidity: "Media",
    liquidityColor: "text-blue-400",
  },
  {
    id: "term_14",
    days: 14,
    yieldRate: 0.08,
    label: "Fondo BIZEN",
    badge: "POPULAR",
    icon: TrendingUp,
    color: "text-violet-400",
    bg: "bg-violet-600/10",
    border: "border-violet-500/30",
    gradient: "from-violet-600 to-violet-400",
    glow: "shadow-violet-500/20",
    glowColor: "bg-violet-600",
    cardGradient: "from-violet-600 to-violet-800",
    desc: "El equilibrio perfecto: buen rendimiento garantizado sin bloquearlo demasiado.",
    liquidity: "Media",
    liquidityColor: "text-violet-400",
  },
  {
    id: "term_30",
    days: 30,
    yieldRate: 0.15,
    label: "Bloqueo Premium",
    badge: "MÁXIMO",
    icon: Lock,
    color: "text-rose-400",
    bg: "bg-rose-600/10",
    border: "border-rose-500/30",
    gradient: "from-rose-600 to-rose-400",
    glow: "shadow-rose-500/20",
    glowColor: "bg-rose-600",
    cardGradient: "from-rose-600 to-rose-800",
    desc: "Rendimiento máximo asegurado por ceder tu liquidez durante todo el mes.",
    liquidity: "Baja",
    liquidityColor: "text-rose-400",
  },
  {
    id: "term_90",
    days: 90,
    yieldRate: 0.40,
    label: "Fondo Institucional",
    badge: "TRIMESTRAL",
    icon: Sparkles,
    color: "text-indigo-400",
    bg: "bg-indigo-600/10",
    border: "border-indigo-500/30",
    gradient: "from-indigo-600 to-indigo-400",
    glow: "shadow-indigo-500/20",
    glowColor: "bg-indigo-600",
    cardGradient: "from-indigo-600 to-indigo-800",
    desc: "Crecimiento extraordinario diseñado para la creación de riqueza trimestral.",
    liquidity: "Muy Baja",
    liquidityColor: "text-indigo-400",
  },
  {
    id: "term_180",
    days: 180,
    yieldRate: 1.00,
    label: "Apertura BIZEN V.I.P.",
    badge: "SEMESTRAL",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-600/10",
    border: "border-amber-500/30",
    gradient: "from-amber-600 to-amber-400",
    glow: "shadow-amber-500/20",
    glowColor: "bg-amber-600",
    cardGradient: "from-amber-600 to-amber-800",
    desc: "Duplica tu inversión a largo plazo. Solo para inversores sumamente disciplinados.",
    liquidity: "Cero",
    liquidityColor: "text-amber-400",
  }
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
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: 0,
        width: size,
        height: size,
        background: color,
        opacity: 0.4,
      }}
      animate={{ y: [0, -100, -150], opacity: [0, 0.6, 0], scale: [1, 1.4, 0.5] }}
      transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay, ease: "easeOut" }}
    />
  )
}

export default function InvestmentsPage() {
  const { user, dbProfile, loading, refreshUser } = useAuth()
  const router = useRouter()
  
  const [selectedPlan, setSelectedPlan] = useState(STAKING_PLANS[2]) 
  const [amount, setAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [positions, setPositions] = useState<any[]>([])
  const [loadingPositions, setLoadingPositions] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      fetchPositions()
    }
  }, [user, loading])

  const fetchPositions = async () => {
    try {
      const res = await fetch("/api/wallet/staking")
      if (res.ok) {
        const data = await res.json()
        setPositions(data.positions || [])
      }
    } catch (err) {
      console.error("Error fetching positions", err)
    } finally {
      setLoadingPositions(false)
    }
  }

  const bizcoins = dbProfile?.bizcoins || 0
  const potentialReturn = useMemo(() => Math.floor(amount * selectedPlan.yieldRate), [amount, selectedPlan])
  const totalReturn = amount + potentialReturn
  const animatedReturn = useAnimatedNumber(potentialReturn)
  const animatedTotal = useAnimatedNumber(totalReturn)

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
      await fetchPositions()
    } catch (err: any) { setError(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleQuickAmount = (pct: number) => setAmount(Math.floor(bizcoins * pct))

  if (loading) return <PageLoader />
  if (!user) return null

  return (
    <div className="min-h-screen bg-[#05081a] text-white selection:bg-blue-500/30 pt-6 pb-20 relative overflow-x-hidden">
      {/* Decorative Orbs */}
      <div className={`fixed top-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full blur-[120px] transition-all duration-1000 opacity-20 pointer-events-none ${selectedPlan.glowColor}`} />
      <div className="fixed bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold uppercase tracking-wider">Volver</span>
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tight leading-none mb-2 text-white">Protocolo Staking</h1>
              <p className="text-slate-400 text-sm font-medium">Multiplica tus ahorros con nuestra tecnología de interés compuesto.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md self-start md:self-auto flex flex-col items-end shadow-lg shadow-blue-500/5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Bizcoins Disponibles</span>
            <div className="flex items-center gap-3">
              <BizcoinIcon size={22} className="text-amber-400 shadow-glow shadow-amber-500/20" />
              <span className="text-2xl font-black tracking-tighter">{bizcoins.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-500">bz</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl pt-20"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <Particle key={i} color={["#10B981", "#34D399", "#6EE7B7"][i % 3]} />
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40 relative z-10"
              >
                <CheckCircle2 color="white" size={52} strokeWidth={2.5} />
              </motion.div>

              <h2 className="text-4xl font-black tracking-tight mb-4 relative z-10">¡Inversión Iniciada!</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 relative z-10 max-w-md mx-auto">
                Felicidades. Has puesto <strong className="text-emerald-400"> {amount.toLocaleString()} BC </strong> a rendir al <strong className="text-white">{(selectedPlan.yieldRate * 100).toFixed(0)}%</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button 
                  onClick={() => { setSuccess(false); setAmount(0); }}
                  className="flex-1 py-5 bg-white text-slate-950 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                  Continuar
                </button>
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 py-5 bg-white/10 text-white border border-white/10 rounded-2xl font-black transition-all hover:bg-white/20 active:scale-[0.98]"
                >
                  Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Setup */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                  
                  {/* Amount Entry */}
                  <section className="bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-[32px] p-8 md:p-10 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">¿Cuánto deseas invertir?</span>
                      <span className="text-xs font-bold text-slate-600">Límite: {bizcoins.toLocaleString()} bz</span>
                    </div>

                    <div className={`flex items-center bg-white/5 border-2 rounded-3xl p-6 transition-all duration-300 mb-8 ${inputFocused ? "border-blue-500 ring-4 ring-blue-500/10 bg-white/10 shadow-lg shadow-blue-500/5" : "border-white/5"}`}>
                       <input 
                          type="number" 
                          placeholder="0"
                          value={amount || ""}
                          onChange={e => setAmount(Number(e.target.value))}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                          className="flex-1 bg-transparent border-none outline-none text-5xl md:text-7xl font-black text-white tracking-tighter placeholder:text-slate-800"
                        />
                        <span className="text-3xl font-black text-slate-700 ml-4">BC</span>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {[0.25, 0.5, 0.75, 1].map(pct => (
                        <button
                          key={pct}
                          onClick={() => handleQuickAmount(pct)}
                          className="py-4 rounded-xl bg-white/5 border border-white/5 text-slate-500 text-sm font-black hover:bg-white/10 hover:text-white transition-all uppercase tracking-tighter"
                        >
                          {pct === 1 ? "Máximo" : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Plan Selection Grid */}
                  <div className="space-y-6">
                     <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-6 ml-2">Elige tu plazo</span>
                     <div className="grid grid-cols-1 gap-4">
                        {STAKING_PLANS.map(plan => {
                          const active = selectedPlan.id === plan.id
                          return (
                            <motion.div 
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan)}
                              whileHover={{ x: 8 }}
                              className={`relative overflow-hidden cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 ${
                                active ? `bg-gradient-to-r ${plan.bg} ${plan.border} shadow-xl` : "bg-slate-900/20 border-white/5 hover:border-white/10"
                              }`}
                            >
                              <div className={`w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center shadow-lg bg-gradient-to-br ${plan.gradient}`}>
                                <plan.icon size={32} className="text-white" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h3 className="text-xl font-black tracking-tight">{plan.label}</h3>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white bg-white/10`}>{plan.badge}</span>
                                 </div>
                                 <p className="text-slate-400 text-sm font-medium line-clamp-1">{plan.desc}</p>
                                 <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase">
                                      <Calendar size={14} /> {plan.days} días
                                    </span>
                                    <span className="text-[11px] font-bold flex items-center gap-1.5 uppercase text-emerald-400">
                                      <ShieldCheck size={14} /> Riesgo Nulo
                                    </span>
                                    <span className={`text-[11px] font-bold flex items-center gap-1.5 uppercase flex-wrap ${plan.liquidityColor}`}>
                                      <Clock size={14} /> Liquidez {plan.liquidity}
                                    </span>
                                 </div>
                              </div>

                              <div className="text-left md:text-right shrink-0">
                                 <div className={`text-4xl font-black tracking-tighter ${active ? "text-white" : "text-slate-700"}`}>
                                   +{(plan.yieldRate * 100).toFixed(0)}%
                                 </div>
                                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Rendimiento</div>
                              </div>
                            </motion.div>
                          )
                        })}
                     </div>
                  </div>
                </div>

                {/* Right Side: Contract Summary */}
                <aside className="lg:col-span-12 xl:col-span-5 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                  <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                     
                     <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="text-2xl font-black tracking-tight">Cierre de Contrato</h3>
                        <ShieldCheck size={28} className="text-blue-500" />
                     </div>

                     <div className="space-y-6 mb-10 relative z-10">
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                          <span className="text-slate-400 font-bold">Capital Invertido</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black">{amount.toLocaleString()}</span>
                            <span className="text-xs text-slate-500 font-bold uppercase">bz</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                          <span className="text-slate-400 font-bold">Rendimiento Estimado</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-emerald-400">+{animatedReturn.toLocaleString()}</span>
                            <span className="text-xs text-emerald-500 font-bold uppercase">bz</span>
                          </div>
                        </div>

                        <div className={`p-8 rounded-[32px] bg-gradient-to-br transition-all duration-700 shadow-2xl overflow-hidden relative ${selectedPlan.cardGradient}`}>
                           <div className="absolute inset-0 bg-white/5 opacity-40 animate-pulse pointer-events-none" />
                           <span className="text-[11px] font-black text-white/50 uppercase tracking-widest block mb-2 relative z-10">Total de Liquidación</span>
                           <div className="flex items-baseline gap-3 relative z-10">
                              <span className="text-5xl font-black tracking-tighter drop-shadow-xl">{animatedTotal.toLocaleString()}</span>
                              <span className="text-xl font-bold text-white/40 bg-white/10 px-3 py-1 rounded-xl uppercase">BC</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex gap-4 mb-10 relative z-10">
                        <Info size={24} className="text-blue-400 shrink-0 mt-1" />
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                          Tu capital quedará bloqueado por seguridad. Al cumplirse el plazo, <strong className="text-white">Billy acreditará el total</strong> automáticamente.
                        </p>
                     </div>

                     <motion.button 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={isSubmitting || amount <= 0 || amount > bizcoins}
                        className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 relative z-10 ${
                          (amount > 0 && amount <= bizcoins) 
                          ? "bg-white text-slate-950 shadow-white/5 active:bg-slate-100" 
                          : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5 opacity-50"
                        }`}
                     >
                       {isSubmitting ? (
                          <Loader2 className="animate-spin" size={24} />
                       ) : (
                         <>
                          <Zap size={22} className="text-amber-500 fill-amber-500" />
                          Confirmar Inversión
                         </>
                       )}
                     </motion.button>

                     {error && (
                        <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold text-center flex items-center justify-center gap-2 animate-bounce">
                          <AlertCircle size={16} />
                          {error}
                        </div>
                     )}
                  </div>
                </aside>
              </div>

              {/* Positions List Section */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                       <History className="text-blue-400" size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Tus Posiciones</h2>
                 </div>

                 {loadingPositions ? (
                    <div className="py-12 flex justify-center">
                       <Loader2 className="animate-spin text-slate-500" size={32} />
                    </div>
                 ) : positions.length === 0 ? (
                    <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[32px] p-12 text-center">
                       <Clock size={40} className="text-slate-700 mx-auto mb-4" />
                       <p className="text-slate-500 font-bold">No tienes inversiones activas en este momento.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {positions.map((pos) => (
                          <div key={pos.id} className="bg-slate-900/30 backdrop-blur-md border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                             <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest ${
                               pos.status === 'active' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                             }`}>
                                {pos.status === 'active' ? 'En Proceso' : 'Finalizada'}
                             </div>
                             
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                   <Coins size={24} className={pos.status === 'active' ? 'text-amber-400' : 'text-emerald-400'} />
                                </div>
                                <div>
                                   <div className="text-2xl font-black tracking-tighter">{pos.amount.toLocaleString()} BC</div>
                                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inversión Inicial</div>
                                </div>
                             </div>

                             <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-400 font-bold">Tasa Anual</span>
                                   <span className="text-white font-black">{(pos.yieldRate * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-400 font-bold">Vence</span>
                                   <span className="text-white font-black">{new Date(pos.endDate).toLocaleDateString()}</span>
                                </div>
                             </div>

                             <div className={`pt-4 border-t border-white/5 flex items-center justify-between`}>
                                <span className="text-xs font-bold text-slate-500 uppercase">Rendimiento</span>
                                <span className={`text-lg font-black ${pos.status === 'active' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                   +{(pos.earnedAmount || Math.floor(pos.amount * pos.yieldRate)).toLocaleString()} BC
                                </span>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </section>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-20 text-center">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
          BIZEN Protocol · Gestión de Activos Digitales · 2026
        </p>
      </footer>
    </div>
  )
}
