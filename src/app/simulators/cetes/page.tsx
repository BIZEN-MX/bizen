"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import TopNav from '@/components/TopNav'
import ReturnButton from '@/components/ReturnButton'
import PageLoader from '@/components/PageLoader'
import BizcoinIcon from '@/components/BizcoinIcon'
import {
  Shield, TrendingUp, Clock, CheckCircle2, AlertTriangle,
  Wallet, BarChart3, RefreshCw, ChevronRight, Info,
  DollarSign, Percent, Calendar, ArrowUpRight, Zap
} from 'lucide-react'
import {
  INSTRUMENTS, VIRTUAL_INFLATION_RATE, BIZEN_TIME_MULTIPLIER,
  calcInterest, getPositionProgress, formatVirtualDaysRemaining,
  inflationErosion, type CetesInstrument
} from '@/lib/simulators/cetes'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

// ─── helpers ─────────────────────────────────────────────────────
const fmt = (n: number) => Math.round(n).toLocaleString('es-MX')

function InstrumentCard({
  inst, selected, onSelect, balance
}: { inst: CetesInstrument; selected: boolean; onSelect: () => void; balance: number }) {
  const exampleAmount = 10000
  const exampleInterest = calcInterest(exampleAmount, inst.annualRate, inst.termDays)

  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all cursor-pointer ${selected
        ? 'border-blue-500 bg-blue-50/60 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
        : 'border-slate-200 bg-white hover:border-slate-300'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: inst.color }} />
            <span className="text-[13px] font-black text-slate-900">{inst.name}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {inst.riskLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{inst.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[18px] font-black" style={{ color: inst.color }}>{inst.annualRatePct}</div>
          <div className="text-[10px] text-slate-400">anual</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          {inst.termDays === 1 ? 'Renovación diaria' : `${inst.termDays} días`}
          {' '}≈ {Math.ceil(inst.termDays / BIZEN_TIME_MULTIPLIER * 24)}h real
        </span>
        <span className="text-[11px] font-bold text-emerald-600">
          +{fmt(exampleInterest)} bz por cada 10,000 bz
        </span>
      </div>
    </motion.button>
  )
}

function PositionCard({ pos, onRedeem }: { pos: any; onRedeem: (id: string) => void }) {
  const progress = getPositionProgress(pos)
  const inst = INSTRUMENTS.find(i => i.id === pos.instrument)
  const color = inst?.color ?? '#6366f1'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[13px] font-black text-slate-900">{pos.instrument}</span>
            {progress.isMatured
              ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">¡Listo!</span>
              : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Activo</span>
            }
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {formatVirtualDaysRemaining(progress.remainingVirtualDays)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-black text-slate-900">{fmt(pos.amount_invested)} bz</div>
          <div className="text-[11px] font-bold text-emerald-600">+{fmt(progress.currentAccruedInterest)} bz</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentComplete}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{progress.percentComplete.toFixed(0)}% completado</span>
        {progress.isMatured && (
          <button
            onClick={() => onRedeem(pos.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[12px] font-bold transition-colors"
          >
            <ArrowUpRight size={12} />
            Retirar {fmt(pos.amount_invested + pos.interest_earned)} bz
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Simulator ───────────────────────────────────────────────
function CetesSimulatorContent() {
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<'invest' | 'portfolio' | 'learn'>('invest')
  const [portfolio, setPortfolio] = useState<any>(null)
  const [positions, setPositions] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [selectedInstrument, setSelectedInstrument] = useState<CetesInstrument>(INSTRUMENTS[0])
  const [amount, setAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/simulators/cetes/portfolio')
      if (res.ok) {
        const data = await res.json()
        setPortfolio(data.portfolio)
        setPositions(data.positions ?? [])
        setSummary(data.summary)
      }
    } catch { }
    finally { setLoadingData(false) }
  }, [])

  useEffect(() => { if (user) fetchPortfolio() }, [user, fetchPortfolio])

  // Auto-refresh positions every 30s
  useEffect(() => {
    const t = setInterval(fetchPortfolio, 30000)
    return () => clearInterval(t)
  }, [fetchPortfolio])

  const handleInvest = async () => {
    const amt = Number(amount)
    if (!amt || amt < selectedInstrument.minAmount) {
      showToast(`Monto mínimo: ${selectedInstrument.minAmount} bz`, 'error')
      return
    }
    setInvesting(true)
    try {
      const res = await fetch('/api/simulators/cetes/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instrumentId: selectedInstrument.id, amount: amt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`✅ Invertiste ${fmt(amt)} bz en ${selectedInstrument.name}`)
      setAmount('')
      setTab('portfolio')
      await fetchPortfolio()
    } catch (e: any) {
      showToast(e.message, 'error')
    } finally {
      setInvesting(false)
    }
  }

  const handleRedeem = async (positionId: string) => {
    try {
      const res = await fetch('/api/simulators/cetes/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`💰 +${fmt(data.totalPayout)} bz — incluye ${fmt(data.interest)} bz de intereses`)
      await fetchPortfolio()
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  // Inflation chart data
  const inflationChartData = Array.from({ length: 13 }, (_, i) => {
    const days = i * 30
    const cashLoss = inflationErosion(10000, days)
    const cetes28Gain = calcInterest(10000, 0.1050, days)
    return {
      mes: `M${i}`,
      efectivo: 10000 - cashLoss,
      cetes: 10000 + cetes28Gain,
    }
  })

  if (authLoading || (user && loadingData)) return <PageLoader />

  const balance = portfolio?.cash_balance ?? 0
  const interest = Number(amount || 0) > 0
    ? calcInterest(Number(amount), selectedInstrument.annualRate, selectedInstrument.termDays)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28">
      <TopNav />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-[13px] font-bold flex items-center gap-2 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="mb-6">
          <ReturnButton href="/simuladores" label="Simuladores" />
          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield size={22} color="white" />
            </div>
            <div>
              <h1 className="text-[22px] font-black text-slate-900">Renta Fija / CETES</h1>
              <p className="text-[13px] text-slate-400 font-medium">Simulador de Inversión Gubernamental</p>
            </div>
            <div className="ml-auto bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
              <BizcoinIcon size={16} />
              <span className="text-[15px] font-black text-slate-900">{fmt(balance)}</span>
              <span className="text-[11px] text-slate-400">bz</span>
            </div>
          </div>
        </div>

        {/* Summary bar */}
        {summary && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Invertido', value: `${fmt(summary.totalInvested)} bz`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Intereses acum.', value: `+${fmt(summary.totalAccrued)} bz`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Listos a cobrar', value: summary.readyToRedeemCount.toString(), icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
                <div className={`w-7 h-7 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                  <s.icon size={14} className={s.color} />
                </div>
                <div className={`text-[14px] font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1 mb-5 shadow-sm">
          {([
            { id: 'invest', label: 'Invertir', icon: Zap },
            { id: 'portfolio', label: 'Mi Portafolio', icon: BarChart3 },
            { id: 'learn', label: 'Aprende', icon: Info },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold transition-all ${tab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* INVEST TAB */}
        {tab === 'invest' && (
          <div className="space-y-4">
            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Elige un instrumento</p>
            <div className="space-y-3">
              {INSTRUMENTS.map(inst => (
                <InstrumentCard
                  key={inst.id}
                  inst={inst}
                  selected={selectedInstrument.id === inst.id}
                  onSelect={() => setSelectedInstrument(inst)}
                  balance={balance}
                />
              ))}
            </div>

            {/* Amount input */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-[12px] font-black text-slate-600 uppercase tracking-wider mb-3">
                Monto a invertir
              </p>
              <div className="relative">
                <BizcoinIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={`Mínimo ${selectedInstrument.minAmount} bz`}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-[15px] font-bold text-slate-900 outline-none transition-colors"
                />
              </div>
              {/* Quick amounts */}
              <div className="flex gap-2 mt-2">
                {[1000, 5000, 10000, 50000].map(q => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className="flex-1 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-blue-700 hover:border-blue-200 transition-all"
                  >
                    {fmt(q)}
                  </button>
                ))}
              </div>

              {interest > 0 && (
                <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-[12px] text-emerald-700 font-semibold">Interés estimado al vencimiento</span>
                  <span className="text-[16px] font-black text-emerald-600">+{fmt(interest)} bz</span>
                </div>
              )}

              <button
                onClick={handleInvest}
                disabled={investing || !amount || Number(amount) < selectedInstrument.minAmount}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black text-[14px] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2"
              >
                {investing ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
                {investing ? 'Procesando...' : `Invertir en ${selectedInstrument.name}`}
              </button>

              {/* Risk info */}
              <div className="mt-3 flex items-start gap-2 bg-slate-50 rounded-xl p-3">
                <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Los CETES están <strong className="text-slate-600">garantizados por el Gobierno de México</strong>.
                  En BIZEN, 1 día real = {BIZEN_TIME_MULTIPLIER} días virtuales, por lo que verás resultados rápidamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {tab === 'portfolio' && (
          <div className="space-y-3">
            {positions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <Shield size={40} className="text-slate-200 mx-auto mb-3" />
                <p className="text-[16px] font-bold text-slate-700 mb-1">Sin inversiones activas</p>
                <p className="text-[13px] text-slate-400 mb-5">Ve a "Invertir" para comprar tu primer CETE</p>
                <button
                  onClick={() => setTab('invest')}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[13px]"
                >
                  Empezar a invertir
                </button>
              </div>
            ) : (
              positions.map(p => (
                <PositionCard key={p.id} pos={p} onRedeem={handleRedeem} />
              ))
            )}
          </div>
        )}

        {/* LEARN TAB */}
        {tab === 'learn' && (
          <div className="space-y-5">
            {/* Inflation vs CETES chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-[15px] font-black text-slate-900 mb-1 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                Efectivo vs CETES a 12 meses
              </h3>
              <p className="text-[12px] text-slate-400 mb-4">
                El efectivo pierde poder adquisitivo. Los CETES lo protegen.
              </p>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={inflationChartData}>
                    <defs>
                      <linearGradient id="gCash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gCetes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55}
                      tickFormatter={v => `${(v / 1000).toFixed(1)}k`} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number, name: string) => [`${fmt(v)} bz`, name === 'efectivo' ? '💸 Efectivo' : '🏛️ CETES 28d']}
                    />
                    <Area type="monotone" dataKey="efectivo" stroke="#ef4444" fill="url(#gCash)" strokeWidth={2} />
                    <Area type="monotone" dataKey="cetes" stroke="#10b981" fill="url(#gCetes)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Concepts */}
            {[
              { title: '¿Qué son los CETES?', icon: '🏛️', text: 'Los Certificados de la Tesorería (CETES) son deuda del Gobierno Federal Mexicano. Al comprarlos, le prestas dinero al gobierno y él te paga intereses al vencimiento. Es la inversión más segura de México.' },
              { title: '¿Qué es la inflación?', icon: '📉', text: `La inflación es la subida generalizada de precios. Si guardas dinero en efectivo, cada año puedes comprar menos cosas con él. La inflación virtual en BIZEN es ${(VIRTUAL_INFLATION_RATE * 100).toFixed(1)}% anual.` },
              { title: '¿Cómo funciona el tiempo en BIZEN?', icon: '⚡', text: `Para que puedas ver resultados rápido, comprimimos el tiempo: 1 día real = ${BIZEN_TIME_MULTIPLIER} días en el simulador. Un CETES de 28 días vence en menos de 1 hora real.` },
              { title: '¿Qué son los UDIBONOS?', icon: '📊', text: 'Los UDIBONOS son bonos indexados a la inflación (UDI). Su rendimiento es real: siempre ganas por encima de la inflación. Son ideales para largo plazo porque protegen tu poder adquisitivo.' },
            ].map(c => (
              <div key={c.title} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[20px]">{c.icon}</span>
                  <h4 className="text-[13px] font-black text-slate-900">{c.title}</h4>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function CetesPage() {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <CetesSimulatorContent />
    </React.Suspense>
  )
}
