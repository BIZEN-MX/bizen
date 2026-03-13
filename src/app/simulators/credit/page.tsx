"use client"
import React, { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  Banknote, CalendarDays, Lightbulb, TrendingDown, Info,
  AlertTriangle, RefreshCw, Shield, CheckCircle, Target,
  BookOpen, Activity, Award, Percent, History, Layers,
  BadgeCheck, FileText, Star, Wallet, Clock, BarChart3,
  ArrowRight, HelpCircle, TrendingUp, ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react'
import { simulateCreditCard, simulatePersonalLoan, simulateInstallments } from '@/lib/creditSimulator'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import PageLoader from '@/components/PageLoader'
import { SaveRunButton } from '@/components/simulators/SaveRunButton'
import { useSearchParams } from 'next/navigation'

type Tab = 'score' | 'cc' | 'loan' | 'msi' | 'guide'

// ── Score calculation (5 factors, FICO-like 300-850) ──────────────────────
function calcScore(onTime: number, util: number, yrHistory: number, mixCount: number, inquiries: number) {
  const pay = (onTime / 100) * 192
  const ut = util <= 10 ? 165 : util <= 30 ? 165 - (util - 10) * 2.5 : Math.max(0, 115 - (util - 30) * 1.64)
  const hist = Math.min(1, yrHistory / 10) * 82
  const mix = Math.min(1, mixCount / 3) * 55
  const inq = Math.max(0, 1 - inquiries / 6) * 55
  return Math.round(Math.min(850, Math.max(300, 300 + pay + ut + hist + mix + inq)))
}

function scoreLabel(s: number) {
  if (s < 580) return { text: 'Muy bajo', color: '#dc2626' }
  if (s < 670) return { text: 'Regular', color: '#ea580c' }
  if (s < 740) return { text: 'Bueno', color: '#ca8a04' }
  if (s < 800) return { text: 'Muy bueno', color: '#16a34a' }
  return { text: 'Excelente', color: '#0d9488' }
}

// ── SVG Gauge ─────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const { text, color } = scoreLabel(score)
  const pct = (score - 300) / 550
  const arcLen = 251.3
  const fill = pct * arcLen
  return (
    <div style={{ textAlign: 'center', position: 'relative', userSelect: 'none' }}>
      <svg width="220" height="130" viewBox="0 0 200 115">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={color} strokeWidth="18" strokeLinecap="round"
          strokeDasharray={`${fill} ${arcLen}`} style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.6s ease' }} />
        <text x="100" y="88" textAnchor="middle" fontSize="34" fontWeight="600" fill={color} fontFamily="-apple-system,sans-serif" style={{ transition: 'fill 0.4s' }}>{score}</text>
        <text x="100" y="110" textAnchor="middle" fontSize="12" fontWeight="500" fill={color} fontFamily="-apple-system,sans-serif">{text}</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 4, padding: '0 8px' }}>
        <span>300</span><span>580</span><span>670</span><span>740</span><span>850</span>
      </div>
    </div>
  )
}

// ── Slider ────────────────────────────────────────────────────────────────
function Slider({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', hint, color }: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step?: number; prefix?: string; suffix?: string; hint?: string; color: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color, background: `${color}12`, padding: '1px 10px', borderRadius: 7 }}>{prefix}{value.toLocaleString('es-MX')}{suffix}</span>
      </div>
      <div style={{ position: 'relative', height: 6, borderRadius: 99, background: '#e2e8f0' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${color}88,${color})`, borderRadius: 99, transition: 'width 0.15s' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'absolute', inset: '-6px 0', width: '100%', height: 18, opacity: 0, cursor: 'pointer', margin: 0 }} />
        <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%', background: color, border: '3px solid white', boxShadow: `0 2px 8px ${color}60`, transition: 'left 0.15s', pointerEvents: 'none' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{prefix}{min}{suffix}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{prefix}{max}{suffix}</span>
      </div>
      {hint && <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  )
}

// ── Factor Bar ─────────────────────────────────────────────────────────────
function FactorBar({ label, pct, weight, color, icon: Icon, tip }: { label: string; pct: number; weight: string; color: string; icon: any; tip: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={13} color={color} />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>{label}</span>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>({weight})</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: '#f1f5f9' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
      </div>
      <p style={{ fontSize: 10, color: '#94a3b8', margin: '3px 0 0' }}>{tip}</p>
    </div>
  )
}

// ── Metric Card ────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, bg, border, tc, large }: { label: string; value: string; sub?: string; bg: string; border: string; tc: string; large?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 18, padding: '16px 18px', flex: '1 1 130px', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? `0 6px 20px ${border}60` : '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
      <p style={{ fontSize: 10, fontWeight: 500, color: tc, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 5px', opacity: 0.7 }}>{label}</p>
      <p style={{ fontSize: large ? 26 : 20, fontWeight: 600, color: tc, margin: '0 0 2px', letterSpacing: '-0.02em' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: tc, margin: 0, opacity: 0.6 }}>{sub}</p>}
    </div>
  )
}

// ── Insight Box ────────────────────────────────────────────────────────────
function InsightBox({ color, children }: { color: string; children: React.ReactNode }) {
  return <div style={{ background: `${color}0d`, border: `1px solid ${color}25`, borderRadius: 14, padding: '13px 15px', marginTop: 12, fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{children}</div>
}

// ── Dark Panel ─────────────────────────────────────────────────────────────
function DarkPanel({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 18, padding: '18px 22px', color: 'white', marginBottom: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#64748b', margin: '0 0 5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 600, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{value}</p>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{sub}</p>
    </div>
  )
}

// ── Accordion ──────────────────────────────────────────────────────────────
// ── Interactive Myth vs Reality ──────────────────────────────────────────
function MythVsReality() {
  const [active, setActive] = useState(0)
  const myths = [
    { m: 'Buró de Crédito es una "lista negra" donde solo están los que no pagan.', r: 'Falso. Es un historial de todos; si tienes un crédito, estás en Buró. Estar ahí con pagos puntuales es lo que te abre puertas.' },
    { m: 'Si pago mi deuda, se borra instantáneamente mi mal historial.', r: 'Falso. La información de retrasos permanece hasta 6 años, pero tu estatus cambia a "al corriente", lo cual es una señal positiva inmediata.' },
    { m: 'Consultar mi propio score baja mi puntaje.', r: 'Falso. Las consultas personales (Soft Inquiries) no afectan tu score. Solo las consultas de bancos para darte crédito (Hard Inquiries) lo afectan.' },
  ]
  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '24px', marginBottom: 28 }}>
      <p style={{ fontSize: 12, fontWeight: 500, color: '#0B71FE', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mito vs. Realidad</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {myths.map((item, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ textAlign: 'left', background: active === i ? '#eff6ff' : 'transparent', border: active === i ? '1.5px solid #0B71FE' : '1.5px solid #f1f5f9', borderRadius: 14, padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: active === i ? 8 : 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: active === i ? '#0B71FE' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: active === i ? 'white' : '#94a3b8' }}>{i + 1}</div>
              <span style={{ fontSize: 14, color: active === i ? '#1e293b' : '#64748b', fontWeight: 500 }}>{item.m}</span>
            </div>
            {active === i && <p style={{ fontSize: 13, color: '#475569', margin: '0 0 0 34px', lineHeight: 1.6, borderLeft: '2px solid #0B71FE', paddingLeft: 12 }}>{item.r}</p>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Quick Trivia ──────────────────────────────────────────────────────────
function QuickTrivia() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const questions = [
    { q: '¿Qué porcentaje de tu score depende de tu historial de pagos?', a: ['15%', '35%', '50%'], c: 1 },
    { q: '¿Cuál es el uso de crédito ideal para un score sano?', a: ['Menos del 30%', 'Exactamente 50%', 'Casi el 100%'], c: 0 },
  ]

  const isCorrect = selected === questions[step].c
  return (
    <div style={{ background: 'linear-gradient(135deg,#0B71FE,#1e40af)', borderRadius: 20, padding: '24px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trivia Rápida</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{step + 1} de {questions.length}</p>
      </div>
      <p style={{ fontSize: 16, marginBottom: 20, lineHeight: 1.5 }}>{questions[step].q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {questions[step].a.map((opt, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ padding: '14px', borderRadius: 12, border: 'none', background: selected === i ? (i === questions[step].c ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: 14 }}>
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 20, animation: 'fadeUp 0.3s ease' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>{isCorrect ? '¡Correcto! Vas por buen camino.' : 'No exactamente. El historial de pagos es el factor más pesado.'}</p>
          <button onClick={() => { setStep((step + 1) % questions.length); setSelected(null); }} style={{ background: 'white', color: '#0B71FE', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Siguiente pregunta</button>
        </div>
      )}
    </div>
  )
}

function Accordion({ title, children, icon: Icon, color }: { title: string; children: React.ReactNode; icon: any; color: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: `1px solid ${color}18`, borderRadius: 16, marginBottom: 10, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: open ? `${color}06` : 'white', border: 'none', cursor: 'pointer', fontFamily: 'inherit', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}20` }}>
            <Icon size={16} color={color} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
      </button>
      {open && <div style={{ padding: '4px 20px 18px', background: `${color}04`, fontSize: 13, color: '#475569', lineHeight: 1.75 }}>{children}</div>}
    </div>
  )
}

const TOOLTIP_STYLE = { background: 'rgba(15,23,42,0.92)', border: 'none', borderRadius: 12, color: 'white', fontSize: 12, fontWeight: 600 }
const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`

// ══════════════════════════════════════════════════════════════════════════
function CreditSimulatorContent() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const runId = searchParams.get('runId')
  const [tab, setTab] = useState<Tab>('score')
  const [loadingRun, setLoadingRun] = useState(false)

  // Score factors
  const [onTime, setOnTime] = useState(75)
  const [util, setUtil] = useState(45)
  const [yrHist, setYrHist] = useState(2)
  const [mixCount, setMixCount] = useState(1)
  const [inquiries, setInquiries] = useState(3)

  // CC
  const [ccBal, setCcBal] = useState(15000)
  const [ccApr, setCcApr] = useState(60)
  const [ccPay, setCcPay] = useState(700)

  // Loan
  const [lP, setLP] = useState(30000)
  const [lA, setLA] = useState(28)
  const [lT, setLT] = useState(24)

  // MSI
  const [mPur, setMPur] = useState(12000)
  const [mMo, setMMo] = useState(12)
  const [mFee, setMFee] = useState(300)
  const [mOpp, setMOpp] = useState(10)
  const [mDis, setMDis] = useState(5)

  const score = useMemo(() => calcScore(onTime, util, yrHist, mixCount, inquiries), [onTime, util, yrHist, mixCount, inquiries])
  const { text: scoreText, color: scoreColor } = scoreLabel(score)

  // Load saved run if runId exists
  useEffect(() => {
    async function fetchRun() {
      if (!runId || !user) return;
      setLoadingRun(true);
      try {
        const response = await fetch(`/api/simuladores/runs/${runId}`);
        const data = await response.json();
        if (response.ok && data.run && data.run.simulator_slug === 'credit') {
          const { inputs } = data.run;
          if (inputs.tab) setTab(inputs.tab);
          
          if (inputs.onTime !== undefined) setOnTime(inputs.onTime);
          if (inputs.util !== undefined) setUtil(inputs.util);
          if (inputs.yrHist !== undefined) setYrHist(inputs.yrHist);
          if (inputs.mixCount !== undefined) setMixCount(inputs.mixCount);
          if (inputs.inquiries !== undefined) setInquiries(inputs.inquiries);
          
          if (inputs.ccBal !== undefined) setCcBal(inputs.ccBal);
          if (inputs.ccApr !== undefined) setCcApr(inputs.ccApr);
          if (inputs.ccPay !== undefined) setCcPay(inputs.ccPay);
          
          if (inputs.lP !== undefined) setLP(inputs.lP);
          if (inputs.lA !== undefined) setLA(inputs.lA);
          if (inputs.lT !== undefined) setLT(inputs.lT);
          
          if (inputs.mPur !== undefined) setMPur(inputs.mPur);
          if (inputs.mMo !== undefined) setMMo(inputs.mMo);
          if (inputs.mFee !== undefined) setMFee(inputs.mFee);
          if (inputs.mOpp !== undefined) setMOpp(inputs.mOpp);
          if (inputs.mDis !== undefined) setMDis(inputs.mDis);
        }
      } catch (err) {
        console.error('Error loading run:', err);
      } finally {
        setLoadingRun(false);
      }
    }
    fetchRun();
  }, [runId, user]);

  const ccRes = useMemo(() => simulateCreditCard({ startingBalance: ccBal, aprAnnual: ccApr, minPaymentRule: 200, minPaymentRuleType: 'fixed', monthlyPayment: ccPay, monthsToSimulate: 120 }), [ccBal, ccApr, ccPay])
  const ccMin = useMemo(() => simulateCreditCard({ startingBalance: ccBal, aprAnnual: ccApr, minPaymentRule: 200, minPaymentRuleType: 'fixed', monthlyPayment: 200, monthsToSimulate: 120 }), [ccBal, ccApr])
  const loanRes = useMemo(() => simulatePersonalLoan({ principal: lP, aprAnnual: lA, termMonths: lT }), [lP, lA, lT])
  const msiRes = useMemo(() => simulateInstallments({ purchaseAmount: mPur, months: mMo, annualFeeOptional: mFee, opportunityRateAnnual: mOpp, cashDiscountPct: mDis }), [mPur, mMo, mFee, mOpp, mDis])

  const ccChart = useMemo(() => Array.from({ length: Math.max(ccRes.months.length, ccMin.months.length) }, (_, i) => ({
    mes: i + 1,
    tuPago: +(ccRes.months[i]?.newBalance ?? 0).toFixed(0),
    minimo: +(ccMin.months[i]?.newBalance ?? 0).toFixed(0),
  })), [ccRes, ccMin])

  const loanChart = useMemo(() => loanRes.months.slice(0, 36).map(m => ({
    mes: m.month, capital: +m.principalPaid.toFixed(0), interes: +m.interest.toFixed(0)
  })), [loanRes])

  // Score factor pcts for bars
  const payPct = onTime
  const utilPct = Math.max(0, 100 - util * 1.2)
  const histPct = Math.min(100, yrHist * 10)
  const mixPct = Math.min(100, mixCount * 33)
  const inqPct = Math.max(0, 100 - inquiries * 17)

  // Personalized advice
  const weakest = [
    { key: 'pay', pct: payPct, msg: 'Paga siempre antes de la fecha límite — incluso el mínimo protege tu historial.' },
    { key: 'util', pct: utilPct, msg: 'Reduce tu saldo a menos del 30% de tu límite de crédito Lo antes posible.' },
    { key: 'hist', pct: histPct, msg: 'No cierres tus tarjetas antiguas — la antigüedad del crédito suma mucho.' },
    { key: 'mix', pct: mixPct, msg: 'Tener distintos tipos de crédito (tarjeta + préstamo) ayuda a tu perfil.' },
    { key: 'inq', pct: inqPct, msg: 'Evita solicitar varios créditos en poco tiempo — cada solicitud baja tu score.' },
  ].sort((a, b) => a.pct - b.pct)[0]

  const TABS = [
    { id: 'score' as Tab, label: 'BIZEN Score', icon: Award, color: '#6366f1' },
    { id: 'cc' as Tab, label: 'Tarjeta', icon: TrendingDown, color: '#ef4444' },
    { id: 'loan' as Tab, label: 'Préstamo', icon: Banknote, color: '#3b82f6' },
    { id: 'msi' as Tab, label: 'MSI', icon: CalendarDays, color: '#0d9488' },
    { id: 'guide' as Tab, label: 'Guía Buró', icon: BookOpen, color: '#8b5cf6' },
  ]
  const activeConf = TABS.find(t => t.id === tab)!

  if (loading || loadingRun) return <PageLoader />
  if (!user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}><Shield size={40} color="#94a3b8" /><p style={{ color: '#64748b' }}>Inicia sesión para usar el simulador.</p></div>

  return (
    <>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes panelIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}
        .credit-panel{animation:panelIn 0.3s ease}
        .bizen-score-outer{
          width:100%;
          min-height:100vh;
          background:linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%);
          font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif;
          overflow-x:hidden;
        }
        @media(max-width:767px){.bizen-score-outer{padding-bottom:65px!important}}
        @media(min-width:768px) and (max-width:1160px){.bizen-score-outer{width:calc(100% - 220px)!important;margin-left:220px!important;}}
        @media(min-width:1161px){.bizen-score-outer{width:calc(100% - 280px)!important;margin-left:280px!important;}}
        .credit-tab-btn:hover{background:#F1F5F9!important;color:#1e293b!important;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}
        input[type=range]::-moz-range-thumb{border:none;background:transparent}
      `}</style>
      <div className="bizen-score-outer">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,56px) clamp(16px,4vw,56px)', paddingBottom: 80, boxSizing: 'border-box' }}>

          {/* Header */}
          <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease' }}>
            <Link href="/cash-flow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 20, transition: 'color 0.2s' }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => e.currentTarget.style.color = '#0B71FE'}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => e.currentTarget.style.color = '#64748b'}
            >
              <ArrowLeft size={14} /> Volver al Centro Financiero
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(11,113,254,0.1)', border: '1px solid rgba(11,113,254,0.2)', borderRadius: 999, padding: '6px 16px', marginBottom: 20, alignSelf: 'flex-start', fontSize: 12, fontWeight: 500, color: '#0B71FE', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0B71FE', display: 'inline-block' }} />
                Simulador Educativo — Sin dinero real
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(28px,5.5vw,60px)', fontWeight: 600, margin: '0 0 18px', background: 'linear-gradient(135deg, #0f172a 0%, #0F62FE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em', lineHeight: 1.15 }}>BIZEN Score</h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#64748b', margin: 0, lineHeight: 1.6, maxWidth: 650 }}>Aprende cómo funciona el Buró de Crédito, construye un buen historial y entiende el costo real de las deudas — todo en un solo lugar.</p>
          </div>

          {/* Disclaimer */}
          <div style={{ background: 'white', padding: '16px 24px', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(11,113,254,0.05)', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, maxWidth: 960 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(217,119,6,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={18} color="#d97706" />
            </div>
            <p style={{ fontSize: 14, color: '#92400e', margin: 0, lineHeight: 1.65 }}>
              <span style={{ color: '#d97706', fontWeight: 500 }}>Propósito educativo:</span> Los resultados son estimaciones con fines de aprendizaje. Las fórmulas del Buró de Crédito reales son propietarias y pueden variar.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
            {TABS.map(t => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={active ? '' : 'credit-tab-btn'} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 500, fontSize: 14, borderRadius: 12, padding: '10px 18px', whiteSpace: 'nowrap', fontFamily: 'inherit', background: active ? 'linear-gradient(135deg,#0B71FE,#1e40af)' : '#F1F5F9', color: active ? 'white' : '#64748b', boxShadow: active ? '0 4px 14px rgba(11,113,254,0.25)' : 'none', transition: 'all 0.2s' }}>
                  <Icon size={14} />{t.label}
                </button>
              )
            })}
          </div>

          {/* Panel */}
          <div key={tab} className="credit-panel" style={{ background: 'white', borderRadius: 24, border: '1px solid #f1f5f9', boxShadow: '0 8px 30px rgba(11,113,254,0.04)', overflow: 'hidden' }}>
            {/* Panel header */}
            <div style={{ background: `linear-gradient(135deg,${activeConf.color}0f,${activeConf.color}06)`, borderBottom: `1px solid ${activeConf.color}18`, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: `${activeConf.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${activeConf.color}28`, boxShadow: `0 0 20px ${activeConf.color}18` }}>
                <activeConf.icon size={22} color={activeConf.color} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 500, color: '#1e293b', margin: 0, letterSpacing: '-0.01em' }}>{activeConf.label}</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                  {tab === 'score' && 'Mueve los sliders y ve cómo tus hábitos construyen tu perfil crediticio'}
                  {tab === 'cc' && 'Compara pagar el mínimo vs. una cantidad fija'}
                  {tab === 'loan' && 'Calcula cuota mensual y costo total del préstamo'}
                  {tab === 'msi' && 'Descubre si realmente convienen los meses sin intereses'}
                  {tab === 'guide' && 'Todo lo que necesitas saber sobre el Buró de Crédito en México'}
                </p>
              </div>
            </div>

            <div style={{ padding: 'clamp(20px,3vw,32px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 'clamp(20px,3vw,36px)' }}>

                {/* ── SCORE TAB ── */}
                {tab === 'score' && (<>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>Simula tus hábitos</p>
                    <Slider label="Pagos a tiempo" value={onTime} onChange={setOnTime} min={0} max={100} suffix="%" hint="¿Qué % de tus pagos haces antes de la fecha límite?" color="#6366f1" />
                    <Slider label="Uso de límite de crédito" value={util} onChange={setUtil} min={0} max={100} suffix="%" hint="Cuánto de tu línea de crédito usas. Ideal: menos del 30%" color="#f97316" />
                    <Slider label="Antigüedad del crédito" value={yrHist} onChange={setYrHist} min={0} max={20} suffix=" años" hint="Cuántos años llevas teniendo historial crediticio" color="#0d9488" />
                    <Slider label="Tipos de crédito" value={mixCount} onChange={setMixCount} min={0} max={4} hint="Número de tipos distintos: tarjeta, préstamo, hipoteca..." color="#8b5cf6" />
                    <Slider label="Solicitudes recientes" value={inquiries} onChange={setInquiries} min={0} max={10} hint="Cuántos créditos nuevos has solicitado en los últimos 12 meses" color="#ef4444" />
                  </div>

                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Tu BIZEN Score estimado</p>
                    <div style={{ background: `linear-gradient(135deg,${scoreColor}08,${scoreColor}04)`, border: `1.5px solid ${scoreColor}25`, borderRadius: 20, padding: '24px 20px', marginBottom: 20, textAlign: 'center' }}>
                      <ScoreGauge score={score} />
                    </div>

                    {/* Factor breakdown */}
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Desglose de Factores</p>
                    <FactorBar label="Historial de Pagos" pct={payPct} weight="35%" color="#0B71FE" icon={BadgeCheck} tip={payPct < 80 ? 'Pagar tarde es el error más costoso en crédito.' : 'Excelente. El factor más importante en tu score.'} />
                    <FactorBar label="Uso del Crédito" pct={utilPct} weight="30%" color="#f97316" icon={Percent} tip={util > 50 ? 'Usa menos del 30% de tu límite para mejorar.' : util > 30 ? 'Reduciéndolo debajo del 30% ganarás puntos.' : 'Uso saludable. Tu score te lo agradece.'} />
                    <FactorBar label="Antigüedad" pct={histPct} weight="15%" color="#0d9488" icon={History} tip={yrHist < 3 ? 'Con el tiempo mejora solo — no cierres tarjetas viejas.' : 'Buena antigüedad. Protege tus cuentas más antiguas.'} />
                    <FactorBar label="Mezcla de Crédito" pct={mixPct} weight="10%" color="#8b5cf6" icon={Layers} tip="Tener crédito revolvente y a plazo ayuda a tu perfil." />
                    <FactorBar label="Nuevas Solicitudes" pct={inqPct} weight="10%" color="#ef4444" icon={FileText} tip={inquiries > 3 ? 'Evita solicitar muchos créditos en poco tiempo.' : 'Bien. Poco impacto por solicitudes recientes.'} />

                    {/* Personalized advice */}
                    <div style={{ background: 'linear-gradient(135deg,#0B71FE,#1e40af)', borderRadius: 16, padding: '18px 20px', color: 'white', marginTop: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <Target size={16} color="rgba(255,255,255,0.8)" />
                        <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tu mayor oportunidad de mejora</p>
                      </div>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.65 }}>{weakest.msg}</p>
                    </div>

                    <SaveRunButton 
                      simulatorSlug="credit"
                      inputs={{ tab: 'score', onTime, util, yrHist, mixCount, inquiries }}
                      outputs={{ score, scoreText, scoreColor }}
                    />
                  </div>
                </>)}

                {/* ── CC TAB ── */}
                {tab === 'cc' && (<>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>Parámetros</p>
                    <Slider label="Saldo de la tarjeta" value={ccBal} onChange={setCcBal} min={500} max={100000} step={500} prefix="$" hint="Deuda pendiente actual" color="#ef4444" />
                    <Slider label="Tasa Anual (CAT)" value={ccApr} onChange={setCcApr} min={10} max={120} suffix="%" hint="Tasas típicas MX: 50–90%" color="#f97316" />
                    <Slider label="Tu pago mensual" value={ccPay} onChange={setCcPay} min={200} max={Math.max(ccBal, 3000)} step={100} prefix="$" hint="Sube este número para ahorrar miles en intereses" color="#8b5cf6" />
                    <InsightBox color="#ef4444"><Lightbulb size={14} color="#ef4444" style={{ display: 'inline', marginRight: 5 }} />Pagar solo el mínimo puede mantenerte en deuda por décadas. Doblar el pago lo reduce hasta un 60%.</InsightBox>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Resultado</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                      <MetricCard label="Intereses totales" value={fmt(ccRes.totalInterestPaid)} sub="pagarás de más" large bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" border="#fca5a5" tc="#9f1239" />
                      <MetricCard label="Meses para pagar" value={ccRes.monthsToPayoff ? String(ccRes.monthsToPayoff) : '+120'} sub="meses aprox." bg="linear-gradient(135deg,#eff6ff,#dbeafe)" border="#93c5fd" tc="#1e40af" />
                    </div>
                    <DarkPanel label="Pagarás en total" value={fmt(ccRes.totalPaid)} sub={`Por una deuda de ${fmt(ccBal)} — ${(ccRes.totalPaid / Math.max(ccBal, 1)).toFixed(1)}x el valor original`} />
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Curva de deuda: tu pago vs. mínimo</p>
                    <ResponsiveContainer width="100%" height={190}>
                      <AreaChart data={ccChart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="gMin" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                          <linearGradient id="gMy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(+v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any, n: string) => [fmt(+v), n === 'tuPago' ? 'Tu pago' : 'Mínimo']} />
                        <Area type="monotone" dataKey="minimo" stroke="#ef4444" strokeWidth={2} fill="url(#gMin)" />
                        <Area type="monotone" dataKey="tuPago" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gMy)" />
                      </AreaChart>
                    </ResponsiveContainer>

                    <SaveRunButton 
                      simulatorSlug="credit"
                      inputs={{ tab: 'cc', ccBal, ccApr, ccPay }}
                      outputs={{ 
                        totalInterest: ccRes.totalInterestPaid,
                        monthsToPayoff: ccRes.monthsToPayoff,
                        totalPaid: ccRes.totalPaid
                      }}
                    />
                  </div>
                </>)}

                {/* ── LOAN TAB ── */}
                {tab === 'loan' && (<>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>Parámetros</p>
                    <Slider label="Monto del préstamo" value={lP} onChange={setLP} min={5000} max={200000} step={1000} prefix="$" color="#3b82f6" />
                    <Slider label="Tasa Anual" value={lA} onChange={setLA} min={5} max={80} suffix="%" hint="Tasas bancarias MX: 20–40%" color="#6366f1" />
                    <Slider label="Plazo" value={lT} onChange={setLT} min={6} max={60} step={6} suffix=" meses" hint="A mayor plazo, menor cuota pero más intereses" color="#0d9488" />
                    <InsightBox color="#3b82f6"><Info size={14} color="#3b82f6" style={{ display: 'inline', marginRight: 5 }} />A mayor plazo, menor cuota mensual pero más intereses en total. Compara el equilibrio entre ambos.</InsightBox>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Resultado</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                      <MetricCard label="Pago mensual" value={fmt(loanRes.monthlyPayment)} sub="por mes" large bg="linear-gradient(135deg,#eef2ff,#e0e7ff)" border="#a5b4fc" tc="#3730a3" />
                      <MetricCard label="Intereses totales" value={fmt(loanRes.totalInterestPaid)} sub="costo del crédito" bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" border="#fca5a5" tc="#9f1239" />
                    </div>
                    <DarkPanel label="Total a devolver" value={fmt(loanRes.totalPaid)} sub={`Por cada $1 pedido devolverás $${(loanRes.totalPaid / Math.max(lP, 1)).toFixed(2)}`} />
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Amortización: capital vs. interés</p>
                    <ResponsiveContainer width="100%" height={190}>
                      <BarChart data={loanChart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(+v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any, n: string) => [fmt(+v), n === 'capital' ? 'Capital' : 'Interés']} />
                        <Bar dataKey="capital" stackId="a" fill="#6366f1" name="capital" />
                        <Bar dataKey="interes" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} name="interes" />
                      </BarChart>
                    </ResponsiveContainer>

                    <SaveRunButton 
                      simulatorSlug="credit"
                      inputs={{ tab: 'loan', lP, lA, lT }}
                      outputs={{ 
                        monthlyPayment: loanRes.monthlyPayment,
                        totalInterest: loanRes.totalInterestPaid,
                        totalPaid: loanRes.totalPaid
                      }}
                    />
                  </div>
                </>)}

                {/* ── MSI TAB ── */}
                {tab === 'msi' && (<>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>Parámetros</p>
                    <Slider label="Precio de compra" value={mPur} onChange={setMPur} min={1000} max={100000} step={500} prefix="$" color="#0d9488" />
                    <Slider label="Meses sin intereses" value={mMo} onChange={setMMo} min={3} max={24} step={3} suffix=" meses" color="#0891b2" />
                    <Slider label="Descuento de contado" value={mDis} onChange={setMDis} min={0} max={20} suffix="%" hint="Si el comercio da descuento al pagar completo" color="#059669" />
                    <Slider label="Rendimiento de tu dinero" value={mOpp} onChange={setMOpp} min={0} max={20} step={0.5} suffix="%" hint="CETES, fondo de ahorro, etc." color="#0d9488" />
                    <Slider label="Anualidad de tarjeta" value={mFee} onChange={setMFee} min={0} max={2000} step={100} prefix="$" hint="Costo anual de tener la tarjeta" color="#6366f1" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>¿Qué opción conviene?</p>
                    {[
                      { label: 'Pago de Contado', value: fmt(msiRes.comparisonVsCash.cashPrice), sub: `Con ${mDis}% de descuento`, best: msiRes.comparisonVsCash.betterOption === 'cash', bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#fde68a', tc: '#92400e', bc: '#d97706' },
                      { label: `${mMo} MSI (costo neto)`, value: fmt(msiRes.comparisonVsCash.cashPrice + msiRes.comparisonVsCash.difference), sub: 'Descontando rendimiento potencial', best: msiRes.comparisonVsCash.betterOption === 'installments', bg: 'linear-gradient(135deg,#f0fdfa,#ccfbf1)', border: '#6ee7b7', tc: '#064e3b', bc: '#059669' },
                    ].map(opt => (
                      <div key={opt.label} style={{ background: opt.best ? opt.bg : '#f8fafc', border: `2px solid ${opt.best ? opt.border : '#e2e8f0'}`, borderRadius: 18, padding: '18px 20px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, transition: 'all 0.3s', boxShadow: opt.best ? `0 4px 16px ${opt.border}60` : 'none' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                            {opt.best && <CheckCircle size={14} color={opt.bc} />}
                            <p style={{ fontWeight: 500, color: opt.best ? opt.bc : '#1e293b', margin: 0, fontSize: 14 }}>{opt.label}{opt.best && ' — Mejor opción'}</p>
                          </div>
                          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{opt.sub}</p>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 22, color: opt.best ? opt.bc : '#1e293b', margin: 0, letterSpacing: '-0.02em', flexShrink: 0 }}>{opt.value}</p>
                      </div>
                    ))}
                    <DarkPanel label="Pago mensual MSI" value={fmt(msiRes.monthlyPayment)} sub={`durante ${mMo} meses`} />
                    <InsightBox color="#0d9488">
                      <Info size={14} color="#0d9488" style={{ display: 'inline', marginRight: 5 }} />
                      {msiRes.comparisonVsCash.betterOption === 'cash' ? 'Conviene pagar de contado. El descuento supera lo que ganarías invirtiendo.' : `Conviene usar MSI. Tu dinero puede generar ${fmt(msiRes.comparisonVsCash.investedGains)} invertido al ${mOpp}%.`}
                      {' '}<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} style={{ display: 'inline' }} /> Un solo pago atrasado cobra intereses retroactivos.</span>
                    </InsightBox>

                    <SaveRunButton 
                      simulatorSlug="credit"
                      inputs={{ tab: 'msi', mPur, mMo, mFee, mOpp, mDis }}
                      outputs={{ 
                        betterOption: msiRes.comparisonVsCash.betterOption,
                        monthlyPayment: msiRes.monthlyPayment,
                        totalCost: msiRes.comparisonVsCash.cashPrice + msiRes.comparisonVsCash.difference
                      }}
                    />
                  </div>
                </>)}

                {/* ── GUIDE TAB ── */}
                {tab === 'guide' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 24, marginBottom: 28 }}>
                      {[
                        { icon: HelpCircle, color: '#0B71FE', title: '¿Qué es el Buró de Crédito?', desc: 'No es una lista negra — es tu historial financiero. Registra todos tus créditos, pagos y deudas durante los últimos 6 años. Los bancos lo consultan para decidir si te prestan dinero y a qué tasa.' },
                        { icon: Award, color: '#0d9488', title: '¿Qué es un Credit Score?', desc: 'Un número entre 300 y 850 que resume qué tan confiable eres como deudor. A mayor puntaje, mejores tasas y más acceso al crédito. Lo generan empresas como Buró de Crédito y Círculo de Crédito.' },
                        { icon: Clock, color: '#f97316', title: '¿Cuánto tiempo dura la info?', desc: 'Los retrasos de pago se van borrando gradualmente. Un retraso de 1 mes desaparece en 1 año. Un retraso de 6+ meses puede durar hasta 6 años. Pagar tus deudas no borra el historial, pero sí mejora tu perfil.' },
                      ].map((c, i) => (
                        <div key={i} style={{ background: `linear-gradient(135deg,${c.color}0a,${c.color}04)`, border: `1.5px solid ${c.color}18`, borderRadius: 20, padding: '22px' }}>
                          <div style={{ width: 48, height: 48, borderRadius: 16, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${c.color}22`, marginBottom: 14, boxShadow: `0 0 20px ${c.color}18` }}>
                            <c.icon size={22} color={c.color} />
                          </div>
                          <p style={{ fontWeight: 500, fontSize: 15, color: '#1e293b', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{c.title}</p>
                          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: 12, fontWeight: 500, color: '#0B71FE', margin: '0 0 12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Los 5 factores de tu score — en detalle</p>

                    <Accordion title="Historial de pagos — 35% de tu score" icon={BadgeCheck} color="#0B71FE">
                      <p style={{ margin: '10px 0 8px' }}>El factor más importante. Cada pago puntual suma; cada retraso resta. El Buró registra si debes 1, 2, 3 o más meses.</p>
                      <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {[['Sin retrasos', '#16a34a'], ['1–29 días de retraso', '#ca8a04'], ['30–89 días de retraso', '#ea580c'], ['90+ días de retraso', '#dc2626']].map(([l, c]) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} /><span style={{ fontSize: 12, color: '#334155' }}>{l}</span></div>
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: '10px 0 0', fontSize: 12, color: '#0B71FE', fontWeight: 600 }}><ArrowRight size={12} style={{ display: 'inline', marginRight: 4 }} />Configura débito automático al menos por el pago mínimo para nunca olvidar una fecha.</p>
                    </Accordion>

                    <Accordion title="Uso del crédito — 30% de tu score" icon={Percent} color="#f97316">
                      <p style={{ margin: '10px 0 8px' }}>Es el porcentaje de tu límite que estás usando. Si tienes $10,000 de límite y debes $6,000, tu utilización es del 60% — demasiado alta.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '12px 0' }}>
                        {[['0–10%', 'Ideal', '#16a34a'], ['10–30%', 'Bueno', '#ca8a04'], ['+30%', 'Peligro', '#dc2626']].map(([r, l, c]) => (
                          <div key={r} style={{ background: `${c}10`, border: `1px solid ${c}30`, borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                            <p style={{ fontWeight: 600, fontSize: 16, color: c, margin: '0 0 3px' }}>{r}</p>
                            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{l}</p>
                          </div>
                        ))}
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#f97316', fontWeight: 600 }}><ArrowRight size={12} style={{ display: 'inline', marginRight: 4 }} />Pide un aumento de límite sin gastar más — eso baja tu % de uso automáticamente.</p>
                    </Accordion>

                    <Accordion title="Antigüedad del historial — 15% de tu score" icon={History} color="#0d9488">
                      <p style={{ margin: '10px 0 8px' }}>El Buró promedia la edad de todas tus cuentas. Una tarjeta de 10 años vale oro — cancelarla puede bajar tu score.</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#0d9488', fontWeight: 600 }}><ArrowRight size={12} style={{ display: 'inline', marginRight: 4 }} />Si tienes una tarjeta vieja con anualidad alta, negocia exentarla antes de cancelarla.</p>
                    </Accordion>

                    <Accordion title="Tipos de crédito — 10% de tu score" icon={Layers} color="#8b5cf6">
                      <p style={{ margin: '10px 0 8px' }}>Tener una mezcla saludable (tarjeta + préstamo personal + crédito de auto) demuestra que puedes manejar distintos tipos de deuda.</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8b5cf6', fontWeight: 600 }}><ArrowRight size={12} style={{ display: 'inline', marginRight: 4 }} />No pidas crédito solo para diversificar — solo hazlo cuando genuinamente lo necesites.</p>
                    </Accordion>

                    <Accordion title="Nuevas solicitudes — 10% de tu score" icon={FileText} color="#ef4444">
                      <p style={{ margin: '10px 0 8px' }}>Cada vez que solicitas un crédito, el banco hace una "consulta dura" que puede bajar tu score temporalmente 5–10 puntos. Múltiples solicitudes en poco tiempo dan señal de desesperación financiera.</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 600 }}><ArrowRight size={12} style={{ display: 'inline', marginRight: 4 }} />Compara ofertas de crédito sin "agregar carrito" — muchos bancos permiten ver si "precalificas" sin consulta dura.</p>
                    </Accordion>

                    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 24 }}>
                      <MythVsReality />
                      <QuickTrivia />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Bottom tips */}
          {tab !== 'guide' && (
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 16 }}>
              {[
                { icon: TrendingDown, color: '#ef4444', title: 'Interés compuesto en tu contra', text: 'Los intereses generan más intereses. Una deuda pequeña crece rápido si solo pagas el mínimo.' },
                { icon: Target, color: '#0B71FE', title: 'Regla del 20%', text: 'Tus pagos de deuda no deben superar el 20% de tu ingreso mensual neto.' },
                { icon: BookOpen, color: '#0d9488', title: 'CAT > Tasa nominal', text: 'El CAT incluye comisiones y seguros. Siempre compara créditos por CAT, no por tasa anual.' },
              ].map((tip, i) => {
                const Icon = tip.icon
                return (
                  <div key={i} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 20, padding: '20px 22px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(11,113,254,0.1)` }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)' }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${tip.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tip.color}25`, marginBottom: 14, boxShadow: `0 0 20px ${tip.color}18` }}>
                      <Icon size={20} color={tip.color} />
                    </div>
                    <p style={{ fontWeight: 500, fontSize: 14, color: '#1e293b', margin: '0 0 6px', letterSpacing: '-0.01em' }}>{tip.title}</p>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{tip.text}</p>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default function CreditSimulatorPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CreditSimulatorContent />
    </Suspense>
  )
}
