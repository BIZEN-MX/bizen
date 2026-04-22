"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  TrendingUp, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Percent,
  Coins,
  ShieldCheck,
  Zap
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnButton from "@/components/ReturnButton"

const SUPER_ADMINS = ["diego@bizen.mx"]

export default function AdminMarketPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Market Config State
  const [welcomeBonus, setWelcomeBonus] = useState(1000)
  const [commissionMarket, setCommissionMarket] = useState(0.15)
  const [commissionLimit, setCommissionLimit] = useState(0.10)
  const [allowCrypto, setAllowCrypto] = useState(false)

  const isAllowed = isLoaded && user?.emailAddresses[0]?.emailAddress && SUPER_ADMINS.includes(user.emailAddresses[0].emailAddress.toLowerCase())

  useEffect(() => {
    if (isLoaded && !isAllowed) {
      router.push("/dashboard")
    }
  }, [isLoaded, isAllowed, router])

  useEffect(() => {
    if (isAllowed) fetchConfig()
  }, [isAllowed])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/market-config`)
      const data = await res.json()
      if (res.ok && data.config) {
        setWelcomeBonus(data.config.welcomeBonus ?? 1000)
        setCommissionMarket(data.config.commissionMarket ?? 0.15)
        setCommissionLimit(data.config.commissionLimit ?? 0.10)
        setAllowCrypto(data.config.allowCrypto ?? false)
      }
    } catch (error) {
      console.error("Error fetching market config:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const payload = { welcomeBonus, commissionMarket, commissionLimit, allowCrypto }

    try {
      const res = await fetch("/api/admin/market-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setMessage({ type: 'ok', text: "Configuración del mercado actualizada" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await res.json()
        setMessage({ type: 'err', text: data.error || "Error al guardar" })
      }
    } catch (error) {
      setMessage({ type: 'err', text: "Error de conexión" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || !isAllowed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Bizen Super Admin</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">BIZEN Market Config</h1>
            <p className="text-slate-400 text-lg">Ajusta los parámetros globales del Simulador Financiero en tiempo real.</p>
          </div>
          <ReturnButton href="/teacher/dashboard" label="Volver al Dashboard" />
        </header>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-3 p-4 mb-8 rounded-2xl border ${
                message.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-bold">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-8">
          <form onSubmit={handleSubmit} className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
            
            <div className="mb-8 pb-6 border-b border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Coins className="text-amber-500" /> Bono de Bienvenida
              </h2>
              <p className="text-sm text-slate-400 mb-4">Capital inicial virtual que reciben los alumnos la primera vez que abren el simulador.</p>
              
              <div className="relative max-w-sm">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">bz</span>
                <input
                  required
                  type="number"
                  min={0}
                  step={100}
                  value={welcomeBonus}
                  onChange={(e) => setWelcomeBonus(Number(e.target.value))}
                  className="bg-[#161d2f] border border-white/10 rounded-xl w-full px-4 py-3 pl-12 text-white font-black text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="mb-8 pb-6 border-b border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Percent className="text-emerald-500" /> Comisiones de Broker
              </h2>
              <p className="text-sm text-slate-400 mb-6">Ajusta el margen cobrado por transacción. Un 0.15% representa $1.50 por cada $1000 operados. (Spread de Creador de Mercado).</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-slate-400">Orden a Mercado (Market)</span>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      min={0}
                      step={0.01}
                      value={commissionMarket}
                      onChange={(e) => setCommissionMarket(Number(e.target.value))}
                      className="bg-[#161d2f] border border-white/10 rounded-xl w-full px-4 py-3 pr-10 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-slate-400">Orden Límite (Limit)</span>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      min={0}
                      step={0.01}
                      value={commissionLimit}
                      onChange={(e) => setCommissionLimit(Number(e.target.value))}
                      className="bg-[#161d2f] border border-white/10 rounded-xl w-full px-4 py-3 pr-10 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <Zap className="text-yellow-400" /> Activar Criptomonedas (Beta)
                  </h2>
                  <p className="text-sm text-slate-400">Permitir la compra-venta de BTC y ETH dentro del simulador.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowCrypto(!allowCrypto)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${allowCrypto ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${allowCrypto ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSubmitting ? "Impactando Valores..." : "Guardar Variables del Mercado"}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
