"use client"

import React, { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  CreditCard, Banknote, CalendarDays, Lightbulb,
  TrendingDown, TrendingUp, Info, AlertTriangle, RefreshCw, Shield,
  ChevronDown, ChevronUp, CheckCircle, Target, BookOpen
} from 'lucide-react'
import { simulateCreditCard, simulatePersonalLoan, simulateInstallments } from '@/lib/creditSimulator'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, BarChart, Bar, Legend
} from 'recharts'

type Tab = 'cc' | 'loan' | 'msi'

// ─── Shared UI primitives ───────────────────────────────────────────────────

function SliderField({
  label, value, onChange, min, max, step = 1,
  prefix, suffix, hint, color = '#6366f1'
}: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step?: number
  prefix?: string; suffix?: string; hint?: string; color?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{label}</label>
        <span style={{
          fontSize: 18, fontWeight: 800, color, letterSpacing: '-0.02em',
          background: `${color}12`, padding: '2px 10px', borderRadius: 8
        }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString('es-MX') : value}{suffix}
        </span>
      </div>
      <div style={{ position: 'relative', height: 6, borderRadius: 99, background: '#e2e8f0' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99, transition: 'width 0.15s' }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', inset: '-6px 0', width: '100%', height: 18,
            opacity: 0, cursor: 'pointer', margin: 0
          }}
        />
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 18, height: 18, borderRadius: '50%',
          background: color, border: '3px solid white',
          boxShadow: `0 2px 8px ${color}60`,
          transition: 'left 0.15s', pointerEvents: 'none'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{prefix}{min.toLocaleString('es-MX')}{suffix}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{prefix}{max.toLocaleString('es-MX')}{suffix}</span>
      </div>
      {hint && <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0', lineHeight: 1.5 }}>{hint}</p>}
    </div>
  )
}

function MetricCard({
  label, value, sub, bg, border, tc, icon, large = false
}: {
  label: string; value: string; sub?: string
  bg: string; border: string; tc: string; icon?: React.ReactNode; large?: boolean
}) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg, border: `1.5px solid ${border}`, borderRadius: 20,
        padding: '18px 20px', flex: '1 1 140px',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 24px ${border}60` : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease'
      }}
    >
      {icon && <div style={{ marginBottom: 8 }}>{icon}</div>}
      <p style={{ fontSize: 10, fontWeight: 700, color: tc, textTransform: 'uppercase' as const, letterSpacing: '0.07em', margin: '0 0 5px', opacity: 0.7 }}>{label}</p>
      <p style={{ fontSize: large ? 28 : 22, fontWeight: 800, color: tc, margin: '0 0 2px', letterSpacing: '-0.025em', lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: tc, margin: 0, opacity: 0.6 }}>{sub}</p>}
    </div>
  )
}

function InsightBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: `${color}0d`, border: `1px solid ${color}25`,
      borderRadius: 16, padding: '14px 16px', marginTop: 12,
      fontSize: 13, color: '#334155', lineHeight: 1.7
    }}>
      {children}
    </div>
  )
}

const TOOLTIP_STYLE = {
  background: 'rgba(15,23,42,0.92)',
  border: 'none', borderRadius: 12,
  color: 'white', fontSize: 13, fontWeight: 600,
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function CreditSimulatorPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('cc')

  // CC state
  const [ccBal, setCcBal] = useState(15000)
  const [ccApr, setCcApr] = useState(60)
  const [ccPay, setCcPay] = useState(700)

  // Loan state
  const [lPrincipal, setLPrincipal] = useState(30000)
  const [lApr, setLApr] = useState(28)
  const [lTerm, setLTerm] = useState(24)

  // MSI state
  const [mPurchase, setMPurchase] = useState(12000)
  const [mMonths, setMMonths] = useState(12)
  const [mFee, setMFee] = useState(300)
  const [mOpp, setMOpp] = useState(10)
  const [mDiscount, setMDiscount] = useState(5)

  // Derived results (memoized so they re-compute on every slider move)
  const ccRes = useMemo(() =>
    simulateCreditCard({ startingBalance: ccBal, aprAnnual: ccApr, minPaymentRule: 200, minPaymentRuleType: 'fixed', monthlyPayment: ccPay, monthsToSimulate: 120 }),
    [ccBal, ccApr, ccPay])

  const loanRes = useMemo(() =>
    simulatePersonalLoan({ principal: lPrincipal, aprAnnual: lApr, termMonths: lTerm }),
    [lPrincipal, lApr, lTerm])

  const msiRes = useMemo(() =>
    simulateInstallments({ purchaseAmount: mPurchase, months: mMonths, annualFeeOptional: mFee, opportunityRateAnnual: mOpp, cashDiscountPct: mDiscount }),
    [mPurchase, mMonths, mFee, mOpp, mDiscount])

  // CC chart — balance over time with min payment vs chosen payment
  const ccMinRes = useMemo(() =>
    simulateCreditCard({ startingBalance: ccBal, aprAnnual: ccApr, minPaymentRule: 200, minPaymentRuleType: 'fixed', monthlyPayment: 200, monthsToSimulate: 120 }),
    [ccBal, ccApr])

  const ccChartData = useMemo(() => {
    const maxLen = Math.max(ccRes.months.length, ccMinRes.months.length)
    return Array.from({ length: maxLen }, (_, i) => ({
      month: i + 1,
      tuPago: ccRes.months[i]?.newBalance?.toFixed(0) ?? 0,
      minimo: ccMinRes.months[i]?.newBalance?.toFixed(0) ?? 0,
    }))
  }, [ccRes, ccMinRes])

  // Loan amortization chart
  const loanChartData = useMemo(() =>
    loanRes.months.slice(0, 36).map(m => ({
      mes: m.month,
      capital: +m.principalPaid.toFixed(0),
      interes: +m.interest.toFixed(0),
    })), [loanRes])

  const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`

  const TABS = [
    { id: 'cc' as Tab, label: 'Tarjeta de Crédito', icon: TrendingDown, color: '#ef4444' },
    { id: 'loan' as Tab, label: 'Préstamo Personal', icon: Banknote, color: '#6366f1' },
    { id: 'msi' as Tab, label: 'Meses Sin Intereses', icon: CalendarDays, color: '#0d9488' },
  ]
  const activeConf = TABS.find(t => t.id === activeTab)!

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 10, color: '#64748b' }}>
      <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Cargando...
    </div>
  )
  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column' as const, gap: 12 }}>
      <Shield size={40} color="#94a3b8" />
      <p style={{ color: '#64748b' }}>Inicia sesión para usar el simulador.</p>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes panelIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        .credit-panel { animation: panelIn 0.3s ease; }
        .sidebar-offset{margin-left:0}
        @media(min-width:768px){.sidebar-offset{margin-left:220px}}
        @media(min-width:1161px){.sidebar-offset{margin-left:280px}}
        @media(max-width:767px){.sidebar-offset{padding-bottom:80px!important}}
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; }
        input[type=range]::-moz-range-thumb { border:none; background:transparent; }
      `}</style>

      <div className="sidebar-offset" style={{ minHeight: '100vh', background: 'linear-gradient(155deg,#f0f4ff 0%,#f8fafc 50%,#fff7f0 100%)', fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Helvetica,Arial,sans-serif' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px)', paddingBottom: 80 }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 36, animation: 'fadeUp 0.5s ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 14, fontSize: 12, fontWeight: 700, color: '#dc2626', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              Simulador Educativo — Sin dinero real
            </div>
            <h1 style={{ fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800, margin: '0 0 10px', color: '#0B1E5E', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Simulador de Crédito
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.6, maxWidth: 580 }}>
              Mueve los sliders y descubre en tiempo real cuánto cuestan realmente las deudas. Entiende intereses, CAT y la trampa de los MSI.
            </p>
          </div>

          {/* ── Disclaimer ── */}
          <div style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid #fde68a', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 32 }}>
            <AlertTriangle size={17} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6, margin: 0 }}>
              <strong>Simulación educativa.</strong> Resultados basados en parámetros ingresados. No constituyen asesoría financiera. Tasas reales pueden variar.
            </p>
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {TABS.map(t => {
              const Icon = t.icon
              const active = activeTab === t.id
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  border: active ? 'none' : '1.5px solid #e2e8f0', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontWeight: 600, fontSize: 14, borderRadius: 14,
                  padding: '11px 20px', transition: 'all 0.2s',
                  whiteSpace: 'nowrap', fontFamily: 'inherit',
                  background: active ? t.color : 'white',
                  color: active ? 'white' : '#64748b',
                  boxShadow: active ? `0 6px 20px ${t.color}45` : '0 1px 4px rgba(0,0,0,0.06)',
                  transform: active ? 'translateY(-1px)' : 'none'
                }}>
                  <Icon size={15} />{t.label}
                </button>
              )
            })}
          </div>

          {/* ── Panel ── */}
          <div key={activeTab} className="credit-panel" style={{ background: 'white', borderRadius: 28, border: '1px solid #e8edf5', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

            {/* Panel header */}
            <div style={{
              background: `linear-gradient(135deg, ${activeConf.color}12, ${activeConf.color}06)`,
              borderBottom: `1px solid ${activeConf.color}20`,
              padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: `${activeConf.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${activeConf.color}30` }}>
                <activeConf.icon size={22} color={activeConf.color} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>{activeConf.label}</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                  {activeTab === 'cc' && 'Mueve los sliders — los resultados se actualizan en tiempo real'}
                  {activeTab === 'loan' && 'Calcula tu cuota y el costo real de financiamiento'}
                  {activeTab === 'msi' && 'Descubre si realmente te convienen los meses sin intereses'}
                </p>
              </div>
            </div>

            <div style={{ padding: '24px clamp(16px, 4vw, 32px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 'clamp(20px, 4vw, 36px)' }}>

                {/* ─── CREDIT CARD ─── */}
                {activeTab === 'cc' && (
                  <>
                    {/* Inputs */}
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 24 }}>Parámetros</p>
                      <SliderField label="Saldo de la Tarjeta" value={ccBal} onChange={setCcBal} min={500} max={100000} step={500} prefix="$" hint="Deuda pendiente en este momento" color="#ef4444" />
                      <SliderField label="Tasa Anual (CAT)" value={ccApr} onChange={setCcApr} min={10} max={120} step={1} suffix="%" hint="Tasas típicas MX: 50–90%" color="#f97316" />
                      <SliderField label="Tu pago mensual" value={ccPay} onChange={setCcPay} min={200} max={Math.max(ccBal, 3000)} step={100} prefix="$" hint="Sube este valor para ver cuánto ahorras" color="#8b5cf6" />

                      <InsightBox color="#ef4444">
                        <Lightbulb size={15} color="#ef4444" style={{ display: 'inline', marginRight: 6 }} />
                        Pagar solo el mínimo puede mantenerte en deuda por <strong>décadas</strong>. Doblar el pago puede reducirlo hasta un <strong>60%</strong>.
                      </InsightBox>
                    </div>

                    {/* Results */}
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 18 }}>Resultado</p>

                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 12, marginBottom: 20 }}>
                        <MetricCard
                          label="Intereses totales" value={fmt(ccRes.totalInterestPaid)}
                          sub="pagarás de más" large
                          bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" border="#fca5a5" tc="#9f1239"
                          icon={<TrendingDown size={18} color="#dc2626" />} />
                        <MetricCard
                          label="Meses para pagar" value={ccRes.monthsToPayoff ? String(ccRes.monthsToPayoff) : '+120'}
                          sub="meses aprox."
                          bg="linear-gradient(135deg,#eff6ff,#dbeafe)" border="#93c5fd" tc="#1e40af" />
                      </div>

                      {/* Multiplier pill */}
                      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 18, padding: '18px 22px', color: 'white', marginBottom: 20 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '0 0 6px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Pagarás en total</p>
                        <p style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{fmt(ccRes.totalPaid)}</p>
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                          por una deuda de {fmt(ccBal)} — eso es <strong style={{ color: '#f87171' }}>{(ccRes.totalPaid / Math.max(ccBal, 1)).toFixed(1)}x</strong> el valor original
                        </p>
                      </div>

                      {/* Chart */}
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 12 }}>Curva de Deuda: Tu Pago vs. Mínimo</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={ccChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradMy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} label={{ value: 'Mes', position: 'insideBottom', fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(Number(v) / 1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any, name: string) => [fmt(Number(v)), name === 'tuPago' ? 'Tu pago' : 'Mínimo']} />
                          <Area type="monotone" dataKey="minimo" stroke="#ef4444" strokeWidth={2} fill="url(#gradMin)" name="minimo" />
                          <Area type="monotone" dataKey="tuPago" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradMy)" name="tuPago" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {/* ─── PERSONAL LOAN ─── */}
                {activeTab === 'loan' && (
                  <>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 24 }}>Parámetros</p>
                      <SliderField label="Monto del Préstamo" value={lPrincipal} onChange={setLPrincipal} min={5000} max={200000} step={1000} prefix="$" color="#6366f1" />
                      <SliderField label="Tasa Anual" value={lApr} onChange={setLApr} min={5} max={80} step={1} suffix="%" hint="Tasas bancarias MX típicas: 20–40%" color="#8b5cf6" />
                      <SliderField label="Plazo" value={lTerm} onChange={setLTerm} min={6} max={60} step={6} suffix=" meses" hint="A mayor plazo, menor cuota pero más intereses" color="#6366f1" />

                      <InsightBox color="#6366f1">
                        <Info size={15} color="#6366f1" style={{ display: 'inline', marginRight: 6 }} />
                        A mayor plazo, menor cuota mensual pero <strong>más intereses</strong> en total. Compara el balance entre ambos.
                      </InsightBox>
                    </div>

                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 18 }}>Resultado</p>

                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 12, marginBottom: 20 }}>
                        <MetricCard label="Pago Mensual" value={fmt(loanRes.monthlyPayment)} sub="por mes" large bg="linear-gradient(135deg,#eef2ff,#e0e7ff)" border="#a5b4fc" tc="#3730a3" />
                        <MetricCard label="Intereses Totales" value={fmt(loanRes.totalInterestPaid)} sub="costo del crédito" bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" border="#fca5a5" tc="#9f1239" />
                      </div>

                      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 18, padding: '18px 22px', color: 'white', marginBottom: 20 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '0 0 5px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Total a devolver</p>
                        <p style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{fmt(loanRes.totalPaid)}</p>
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                          Por cada $1 pedido pagarás <strong style={{ color: '#a78bfa' }}>${(loanRes.totalPaid / Math.max(lPrincipal, 1)).toFixed(2)}</strong>
                        </p>
                      </div>

                      {/* Amortization bar chart */}
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 12 }}>Amortización Mensual (Capital vs. Interés)</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={loanChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} label={{ value: 'Mes', position: 'insideBottom', fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(Number(v) / 1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any, name: string) => [fmt(Number(v)), name === 'capital' ? 'Capital' : 'Interés']} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                          <Bar dataKey="capital" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} name="capital" />
                          <Bar dataKey="interes" stackId="a" fill="#f87171" radius={[6, 6, 0, 0]} name="interes" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {/* ─── MSI ─── */}
                {activeTab === 'msi' && (
                  <>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 24 }}>Parámetros</p>
                      <SliderField label="Precio de compra" value={mPurchase} onChange={setMPurchase} min={1000} max={100000} step={500} prefix="$" color="#0d9488" />
                      <SliderField label="Meses sin intereses" value={mMonths} onChange={setMMonths} min={3} max={24} step={3} suffix=" meses" color="#0891b2" />
                      <SliderField label="Descuento de contado" value={mDiscount} onChange={setMDiscount} min={0} max={20} step={1} suffix="%" hint="Si el comercio ofrece descuento pago de contado" color="#059669" />
                      <SliderField label="Rendimiento tu dinero" value={mOpp} onChange={setMOpp} min={0} max={20} step={0.5} suffix="%" hint="CETES, fondo de ahorro, etc." color="#0d9488" />
                      <SliderField label="Anualidad de tarjeta" value={mFee} onChange={setMFee} min={0} max={2000} step={100} prefix="$" hint="Costo anual de tener la tarjeta" color="#6366f1" />
                    </div>

                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 18 }}>¿Qué opción te conviene más?</p>

                      {[
                        {
                          label: 'Pago de Contado',
                          value: fmt(msiRes.comparisonVsCash.cashPrice),
                          sub: `Con ${mDiscount}% de descuento`,
                          isBest: msiRes.comparisonVsCash.betterOption === 'cash',
                          bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#fde68a', tc: '#92400e', bestColor: '#d97706'
                        },
                        {
                          label: `${mMonths} MSI (costo neto)`,
                          value: fmt(msiRes.comparisonVsCash.cashPrice + msiRes.comparisonVsCash.difference),
                          sub: 'Descontando rendimiento potencial',
                          isBest: msiRes.comparisonVsCash.betterOption === 'installments',
                          bg: 'linear-gradient(135deg,#f0fdfa,#ccfbf1)', border: '#6ee7b7', tc: '#064e3b', bestColor: '#059669'
                        },
                      ].map(opt => (
                        <div key={opt.label} style={{
                          background: opt.isBest ? opt.bg : '#f8fafc',
                          border: `2px solid ${opt.isBest ? opt.border : '#e2e8f0'}`,
                          borderRadius: 20, padding: '20px 22px', marginBottom: 12,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                          transition: 'all 0.3s ease',
                          boxShadow: opt.isBest ? `0 4px 16px ${opt.border}60` : 'none'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                              {opt.isBest && <CheckCircle size={15} color={opt.bestColor} />}
                              <p style={{ fontWeight: 700, color: opt.isBest ? opt.bestColor : '#1e293b', margin: 0, fontSize: 14 }}>
                                {opt.label} {opt.isBest && '— Mejor opción'}
                              </p>
                            </div>
                            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{opt.sub}</p>
                          </div>
                          <p style={{ fontWeight: 800, fontSize: 24, color: opt.isBest ? opt.bestColor : '#1e293b', margin: 0, letterSpacing: '-0.02em', flexShrink: 0 }}>{opt.value}</p>
                        </div>
                      ))}

                      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 18, padding: '18px 22px', color: 'white', marginBottom: 16 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '0 0 5px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Pago mensual MSI</p>
                        <p style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{fmt(msiRes.monthlyPayment)}</p>
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>durante {mMonths} meses</p>
                      </div>

                      <InsightBox color="#0d9488">
                        <Info size={15} color="#0d9488" style={{ display: 'inline', marginRight: 6 }} />
                        {msiRes.comparisonVsCash.betterOption === 'cash'
                          ? 'Conviene pagar de contado. El descuento supera lo que ganarías invirtiendo.'
                          : `Conviene usar MSI. Tu dinero puede generar ${fmt(msiRes.comparisonVsCash.investedGains)} invertido al ${mOpp}%.`}
                        {' '}<strong><AlertTriangle size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} /> Un solo pago atrasado cobra intereses retroactivos y anula el beneficio.</strong>
                      </InsightBox>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Education Tips ── */}
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {[
              { icon: <TrendingDown size={24} />, title: 'El interés compuesto en tu contra', text: 'Los intereses generan más intereses. Una deuda pequeña puede crecer aceleradamente si solo pagas el mínimo.', color: '#ef4444' },
              { icon: <Target size={24} />, title: 'Regla del 20%', text: 'Tus pagos de deuda no deberían superar el 20% de tu ingreso mensual neto para mantener finanzas saludables.', color: '#6366f1' },
              { icon: <Lightbulb size={24} />, title: 'CAT > Tasa nominal', text: 'El CAT incluye comisiones, seguros y más. Siempre compara créditos por su CAT, no solo por la tasa anual.', color: '#0d9488' },
            ].map((tip, i) => (
              <div key={i} style={{ background: 'white', border: `1px solid ${tip.color}20`, borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${tip.color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div style={{ color: tip.color, marginBottom: 10 }}>{tip.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: '0 0 6px' }}>{tip.title}</p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{tip.text}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
