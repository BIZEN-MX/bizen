"use client"
import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  Banknote, CalendarDays, Lightbulb, TrendingDown, Info,
  AlertTriangle, RefreshCw, Shield, CheckCircle, Target,
  BookOpen, Activity, Award, Percent, History, Layers,
  BadgeCheck, FileText, Star, Wallet, Clock, BarChart3,
  ArrowRight, HelpCircle, TrendingUp, ChevronDown, ChevronUp, ArrowLeft, Rocket
} from 'lucide-react'
import { simulateCreditCard, simulatePersonalLoan, simulateInstallments } from '@/lib/creditSimulator'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import PageLoader from '@/components/PageLoader'
import { SaveRunButton } from '@/components/simulators/SaveRunButton'
import { useSearchParams } from 'next/navigation'
import ReturnButton from '@/components/ReturnButton'

import { calcScore, scoreLabel, fmt, SCENARIOS, TABS_CONFIG, TOUR_STEPS } from '@/components/simulators/credit/utils'
import {
  ScoreGauge, Slider, FactorBar, MetricCard, InsightBox,
  DarkPanel, Accordion, TermTooltip, MythVsReality, QuickTrivia, OnboardingTour
} from '@/components/simulators/credit/CreditUI'

type Tab = 'score' | 'cc' | 'loan' | 'msi' | 'guide'
const TOOLTIP_STYLE = { background: 'rgba(15,23,42,0.95)', border: 'none', borderRadius: 12, color: 'white', fontSize: 12, fontWeight: 700 }

// ══════════════════════════════════════════════════════════════════════════
function CreditSimulatorContent() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const runId = searchParams.get('runId')
  const [tab, setTab] = useState<Tab>('score')
  const [loadingRun, setLoadingRun] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(new Set(['score']))
  const [expandExplain, setExpandExplain] = useState<Record<string, boolean>>({})

  function handleTabChange(t: Tab) {
    setTab(t)
    setVisitedTabs(prev => new Set([...prev, t]))
  }

  function applyScenario(v: { onTime: number; util: number; yrHist: number; mixCount: number; inquiries: number }) {
    setOnTime(v.onTime); setUtil(v.util); setYrHist(v.yrHist); setMixCount(v.mixCount); setInquiries(v.inquiries)
  }

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

  const scoreHistory = useMemo(() => {
    const history = []
    // Realistic-ish projection: high payments and low util build score slowly.
    // Defaults: if onTime > 95 and util < 30, +3-5 pts/mo.
    // If onTime < 80 or util > 70, -5-10 pts/mo.
    const monthlyChange = (onTime > 95 ? 4 : onTime < 85 ? -6 : 1) + (util < 30 ? 2 : util > 60 ? -4 : 0)
    
    for (let i = 0; i <= 6; i++) {
       history.push({
         mes: i === 0 ? 'Hoy' : `+${i}m`,
         valor: Math.min(850, Math.max(300, score + (monthlyChange * i)))
       })
    }
    return history
  }, [score, onTime, util])

  // Auto-load saved profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setLoadingRun(true);
      try {
        const response = await fetch(`/api/simulators/credit/profile`);
        const data = await response.json();
        if (response.ok && data.scenarios) {
          data.scenarios.forEach((scen: any) => {
            const inputs = scen.inputs_json;
            if (scen.scenario_type === 'score' && inputs) {
              if (inputs.onTime !== undefined) setOnTime(inputs.onTime);
              if (inputs.util !== undefined) setUtil(inputs.util);
              if (inputs.yrHist !== undefined) setYrHist(inputs.yrHist);
              if (inputs.mixCount !== undefined) setMixCount(inputs.mixCount);
              if (inputs.inquiries !== undefined) setInquiries(inputs.inquiries);
            }
            if (scen.scenario_type === 'cc' && inputs) {
              if (inputs.ccBal !== undefined) setCcBal(inputs.ccBal);
              if (inputs.ccApr !== undefined) setCcApr(inputs.ccApr);
              if (inputs.ccPay !== undefined) setCcPay(inputs.ccPay);
            }
            if (scen.scenario_type === 'loan' && inputs) {
              if (inputs.lP !== undefined) setLP(inputs.lP);
              if (inputs.lA !== undefined) setLA(inputs.lA);
              if (inputs.lT !== undefined) setLT(inputs.lT);
            }
            if (scen.scenario_type === 'msi' && inputs) {
              if (inputs.mPur !== undefined) setMPur(inputs.mPur);
              if (inputs.mMo !== undefined) setMMo(inputs.mMo);
              if (inputs.mFee !== undefined) setMFee(inputs.mFee);
              if (inputs.mOpp !== undefined) setMOpp(inputs.mOpp);
              if (inputs.mDis !== undefined) setMDis(inputs.mDis);
            }
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoadingRun(false);
      }
    }
    fetchProfile();
  }, [user]);

  // Auto-sync Score tab
  useEffect(() => {
    if (!user || loadingRun) return;
    const t = setTimeout(() => {
      fetch("/api/simulators/credit/profile", { method: "POST", body: JSON.stringify({ scenario_type: 'score', inputs_json: { onTime, util, yrHist, mixCount, inquiries } }) });
    }, 1500);
    return () => clearTimeout(t);
  }, [user, onTime, util, yrHist, mixCount, inquiries, loadingRun]);

  // Auto-sync CC tab
  useEffect(() => {
    if (!user || loadingRun) return;
    const t = setTimeout(() => {
      fetch("/api/simulators/credit/profile", { method: "POST", body: JSON.stringify({ scenario_type: 'cc', inputs_json: { ccBal, ccApr, ccPay } }) });
    }, 1500);
    return () => clearTimeout(t);
  }, [user, ccBal, ccApr, ccPay, loadingRun]);

  // Auto-sync Loan tab
  useEffect(() => {
    if (!user || loadingRun) return;
    const t = setTimeout(() => {
      fetch("/api/simulators/credit/profile", { method: "POST", body: JSON.stringify({ scenario_type: 'loan', inputs_json: { lP, lA, lT } }) });
    }, 1500);
    return () => clearTimeout(t);
  }, [user, lP, lA, lT, loadingRun]);

  // Auto-sync MSI tab
  useEffect(() => {
    if (!user || loadingRun) return;
    const t = setTimeout(() => {
      fetch("/api/simulators/credit/profile", { method: "POST", body: JSON.stringify({ scenario_type: 'msi', inputs_json: { mPur, mMo, mFee, mOpp, mDis } }) });
    }, 1500);
    return () => clearTimeout(t);
  }, [user, mPur, mMo, mFee, mOpp, mDis, loadingRun]);

  // Tour init: show on first visit or ?tour=1
  useEffect(() => {
    const tourParam = searchParams.get('tour')
    if (tourParam === '1') { setShowTour(true); return }
    try { if (!localStorage.getItem('bizen_credit_onboarded')) setShowTour(true) } catch {}
  }, [searchParams])

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

  const activeConf = TABS_CONFIG.find(t => t.id === tab)!

  if (loading || loadingRun) return <PageLoader />
  if (!user) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3"><Shield size={40} className="text-slate-400" /><p className="text-slate-500">Inicia sesión para usar el simulador.</p></div>

  return (
    <>
      {/* Onboarding Tour overlay */}
      {showTour && <OnboardingTour onDone={() => setShowTour(false)} />}

    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative overflow-x-hidden pt-6 px-4 md:py-12 md:px-10 lg:px-20 z-0">
      <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none blur-[100px] bg-blue-500/20" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none blur-[100px] bg-indigo-500/20" />
      <div className="max-w-[1280px] w-full mx-auto relative z-10">

        {/* Header */}
        <div className="mb-10 lg:mb-14 animate-fade-in-up">
          <ReturnButton href="/cash-flow?tab=simulators" label="Volver al Centro Financiero" />

          {/* EDU badge + replay */}
          <div className="flex items-center gap-3 mb-6 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-xs font-bold text-blue-700 tracking-wide uppercase">
              <Shield size={14} className="text-blue-600" />
              Simulador Educativo — Sin dinero real
            </div>
            <button 
              onClick={() => setShowTour(true)} 
              className="inline-flex items-center gap-1.5 bg-transparent border-[1.5px] border-slate-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full px-4 py-2 text-xs font-bold text-slate-500 cursor-pointer transition-all"
            >
              <HelpCircle size={14} /> Ver tour
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-5 leading-none">
            BIZEN Score
          </h1>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-3xl">
            Aprende cómo funciona el <TermTooltip term="Buró de Crédito" definition="Base de datos que registra todos tus créditos y pagos. Estar en Buró es normal — lo que importa es tu historial." />, construye un buen historial y entiende el costo real de las deudas — todo de forma sencilla y visual.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-6 mb-12 shadow-sm max-w-4xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <p className="text-amber-900/80 text-[15px] leading-relaxed m-0 font-medium">
            <span className="text-amber-700 font-bold block md:inline mb-1 md:mb-0 md:mr-1.5">Propósito educativo:</span> 
            Los resultados son estimaciones para que aprendas explorando. Las fórmulas reales son secretas de los bancos, pero aquí verás cómo funcionan en la vida real.
          </p>
        </div>

        {/* Visited-tab progress dots */}
        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Progreso:</span>
          {TABS_CONFIG.map((t, i) => (
            <div key={t.id} title={t.label} className="flex items-center gap-2">
              <div 
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${visitedTabs.has(t.id as Tab) ? t.shadow + ' ' + t.twBg : 'bg-slate-200'}`} 
              />
              {i < TABS_CONFIG.length - 1 && <div className="w-4 h-1 rounded-full bg-slate-100" />}
            </div>
          ))}
          <span className="text-[11px] font-bold text-slate-400 ml-2 bg-slate-100 px-2.5 py-1 rounded-md">{visitedTabs.size}/{TABS_CONFIG.length} vistas</span>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-3 mb-2 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar">
          {TABS_CONFIG.map((t, idx) => {
            const Icon = t.icon
            const active = tab === t.id
            const visited = visitedTabs.has(t.id as Tab)
            return (
              <button 
                key={t.id} 
                onClick={() => handleTabChange(t.id as Tab)} 
                className={`snap-start relative shrink-0 border-none outline-none cursor-pointer flex items-center gap-2.5 font-bold text-[14px] rounded-2xl px-5 py-3.5 whitespace-nowrap transition-all duration-300 ${active ? 'text-white bg-gradient-to-br ' + t.twGradient + ' ' + t.shadow : visited ? 'bg-slate-50 ' + t.twText : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-500'}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-slate-200/50 text-slate-400'}`}>
                  {idx + 1}
                </span>
                <Icon size={16} />{t.label}
                {visited && !active && <span className={`absolute top-2.5 right-2 w-1.5 h-1.5 rounded-full ${t.twBg}`} />}
              </button>
            )
          })}
        </div>
        
        {/* Active tab subtitle */}
        <p className="text-[13px] font-medium text-slate-500 mb-6 pl-2 tracking-wide">
          <span className="inline-block mr-1.5 animate-bounce">↓</span> {activeConf.sub}
        </p>

        {/* Main Panel */}
        <motion.div 
          key={tab} 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden"
        >
          {/* Panel header */}
          <div 
            className={`flex items-center gap-5 p-6 md:p-8 border-b bg-gradient-to-br from-transparent to-slate-50 ${activeConf.twBorder}`}
          >
            <div 
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${activeConf.twLightBg} ${activeConf.twBorder} ${activeConf.shadow}`}
            >
              <activeConf.icon size={26} className={activeConf.twText} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 m-0 mb-1 tracking-tight">{activeConf.label}</h2>
              <p className="text-sm font-medium text-slate-500 m-0 leading-relaxed max-w-xl">
                {tab === 'score' && 'Mueve los sliders y ve cómo tus hábitos construyen tu perfil crediticio'}
                {tab === 'cc' && 'Compara pagar el mínimo vs. una cantidad fija'}
                {tab === 'loan' && 'Calcula cuota mensual y costo total del préstamo'}
                {tab === 'msi' && 'Descubre si realmente convienen los meses sin intereses'}
                {tab === 'guide' && 'Todo lo que necesitas saber sobre el Buró de Crédito en México'}
              </p>
            </div>
          </div>

            <div className="p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

                {/* ── SCORE TAB ── */}
                {tab === 'score' && (<>
                  <div>
                    {/* Scenario quick-start cards */}
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Perfil rápido — elige un punto de partida</p>
                    <div className="flex gap-3 mb-8 flex-wrap">
                      {SCENARIOS.map(s => (
                        <button 
                          key={s.label} 
                          className={`scenario-card flex-1 min-w-[120px] rounded-2xl p-3 cursor-pointer outline-none transition-all duration-300 text-center border-2 ${s.twBg} ${s.twBorder} hover:shadow-lg`}
                          onClick={() => applyScenario(s.values)}
                        >
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${s.twIconBg}`}
                          >
                            <s.icon size={18} className={s.twText} />
                          </div>
                          <p className={`text-[13px] font-bold m-0 leading-tight ${s.twText}`}>{s.label}</p>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">O simula tus hábitos manualmente</p>
                    <Slider label="Pagos a tiempo" value={onTime} onChange={setOnTime} min={0} max={100} suffix="%" hint="¿Qué % de tus pagos haces antes de la fecha límite?" color="#6366f1" />
                    <Slider label="Uso de límite de crédito" value={util} onChange={setUtil} min={0} max={100} suffix="%" hint="Cuánto de tu línea de crédito usas. Ideal: menos del 30%" color="#f97316" />
                    <Slider label="Antigüedad del crédito" value={yrHist} onChange={setYrHist} min={0} max={20} suffix=" años" hint="Cuántos años llevas teniendo historial crediticio" color="#0d9488" />
                    <Slider label="Tipos de crédito" value={mixCount} onChange={setMixCount} min={0} max={4} hint="Número de tipos distintos: tarjeta, préstamo, hipoteca..." color="#8b5cf6" />
                    <Slider label="Solicitudes recientes" value={inquiries} onChange={setInquiries} min={0} max={10} hint="Cuántos créditos nuevos has solicitado en los últimos 12 meses" color="#ef4444" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Tu BIZEN Score estimado</p>
                    <div 
                      className={`rounded-[24px] p-7 mb-7 text-center shadow-inner border-2 ${scoreLabel(score).twLightBg} ${scoreLabel(score).twBorder}`}
                    >
                      <ScoreGauge score={score} />
                    </div>

                    {/* Factor breakdown */}
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Desglose de Factores</p>
                    <FactorBar label="Historial de Pagos" pct={payPct} weight="35%" color="#0B71FE" icon={BadgeCheck} onChange={setOnTime} min={0} max={100} tip={payPct < 80 ? 'Pagar tarde es el error más costoso en crédito.' : 'Excelente. El factor más importante en tu score.'} />
                    <FactorBar label="Uso del Crédito" pct={utilPct} weight="30%" color="#f97316" icon={Percent} onChange={(v) => setUtil(Math.round((100 - v) / 1.2))} min={0} max={100} tip={util > 50 ? 'Usa menos del 30% de tu límite para mejorar.' : util > 30 ? 'Reduciéndolo debajo del 30% ganarás puntos.' : 'Uso saludable. Tu score te lo agradece.'} />
                    <FactorBar label="Antigüedad" pct={histPct} weight="15%" color="#0d9488" icon={History} onChange={(v) => setYrHist(v / 10)} min={0} max={100} tip={yrHist < 3 ? 'Con el tiempo mejora solo — no cierres tarjetas viejas.' : 'Buena antigüedad. Protege tus cuentas más antiguas.'} />
                    <FactorBar label="Mezcla de Crédito" pct={mixPct} weight="10%" color="#8b5cf6" icon={Layers} onChange={(v) => setMixCount(Math.round(v / 33))} min={0} max={100} tip="Tener crédito revolvente y a plazo ayuda a tu perfil." />
                    <FactorBar label="Nuevas Solicitudes" pct={inqPct} weight="10%" color="#ef4444" icon={FileText} onChange={(v) => setInquiries(Math.round((100 - v) / 17))} min={0} max={100} tip={inquiries > 3 ? 'Evita solicitar muchos créditos en poco tiempo.' : 'Bien. Poco impacto por solicitudes recientes.'} />

                    {/* Predictive Timeline */}
                    <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
                      <h3 className="text-[15px] font-extrabold text-slate-900 m-0 mb-1.5 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600" /> Pronóstico a 6 meses
                      </h3>
                      <p className="text-[13px] font-medium text-slate-500 m-0 mb-5">Si mantienes estos hábitos, así evolucionará tu score.</p>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={scoreHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0B71FE" stopOpacity={0.2}/><stop offset="95%" stopColor="#0B71FE" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis domain={[300, 850]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="valor" stroke="#0B71FE" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center gap-3.5 mt-5 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Rocket size={18} className="text-blue-600" />
                        </div>
                        <p className="text-[13px] text-slate-600 m-0 leading-relaxed font-medium">
                          <strong className="text-slate-800">Meta:</strong> Alcanzar <strong className="text-blue-600 border-b border-dashed border-blue-600 pb-0.5">750 puntos</strong> te daría acceso a las mejores tasas de interés en México.
                        </p>
                      </div>
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Parámetros</p>
                    <Slider label="Saldo de la tarjeta" value={ccBal} onChange={setCcBal} min={500} max={100000} step={500} prefix="$" hint="Deuda pendiente actual" color="#ef4444" />
                    <Slider label="Tasa Anual (CAT)" value={ccApr} onChange={setCcApr} min={10} max={120} suffix="%" hint="Tasas típicas MX: 50–90%" color="#f97316" />
                    <Slider label="Tu pago mensual" value={ccPay} onChange={setCcPay} min={200} max={Math.max(ccBal, 3000)} step={100} prefix="$" hint="Sube este número para ahorrar miles en intereses" color="#8b5cf6" />
                    <InsightBox color="#ef4444"><Lightbulb size={14} color="#ef4444" style={{ display: 'inline', marginRight: 5 }} />Pagar solo el mínimo puede mantenerte en deuda por décadas. Doblar el pago lo reduce hasta un 60%.</InsightBox>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resultado</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <MetricCard label="Intereses totales" value={fmt(ccRes.totalInterestPaid)} sub="pagarás de más" large bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" border="#fca5a5" tc="#9f1239" />
                      <MetricCard label="Meses para pagar" value={ccRes.monthsToPayoff ? String(ccRes.monthsToPayoff) : '+120'} sub="meses aprox." bg="linear-gradient(135deg,#eff6ff,#dbeafe)" border="#93c5fd" tc="#1e40af" />
                    </div>
                    <DarkPanel label="Pagarás en total" value={fmt(ccRes.totalPaid)} sub={`Por una deuda de ${fmt(ccBal)} — ${(ccRes.totalPaid / Math.max(ccBal, 1)).toFixed(1)}x el valor original`} />
                    {/* Expandable explainer */}
                    <button 
                      onClick={() => setExpandExplain(p => ({ ...p, cc: !p.cc }))} 
                      className="bg-transparent border-none cursor-pointer text-xs text-blue-600 font-bold font-sans py-0.5 pb-3.5 flex items-center gap-1.5 outline-none"
                    >
                      <HelpCircle size={14} /> ¿Qué significa esto? {expandExplain.cc ? '▲' : '▼'}
                    </button>
                    {expandExplain.cc && (
                      <div className="bg-sky-50 border border-sky-200 rounded-[14px] p-4 text-[13px] text-sky-900 leading-relaxed mb-4">
                        Significa que tu deuda de <strong>{fmt(ccBal)}</strong> te costará <strong>{fmt(ccRes.totalInterestPaid)}</strong> en intereses si mantienes un pago de {fmt(ccPay)}/mes. Eso es <strong>{(ccRes.totalPaid / Math.max(ccBal, 1)).toFixed(1)}x</strong> el valor original. Subir tu pago mensual es la forma más rápida de ahorrar.
                      </div>
                    )}
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Curva de deuda: tu pago vs. mínimo</p>
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Parámetros</p>
                    <Slider label="Monto del préstamo" value={lP} onChange={setLP} min={5000} max={200000} step={1000} prefix="$" color="#3b82f6" />
                    <Slider label="Tasa Anual" value={lA} onChange={setLA} min={5} max={80} suffix="%" hint="Tasas bancarias MX: 20–40%" color="#6366f1" />
                    <Slider label="Plazo" value={lT} onChange={setLT} min={6} max={60} step={6} suffix=" meses" hint="A mayor plazo, menor cuota pero más intereses" color="#0d9488" />
                    <InsightBox color="#3b82f6"><Info size={14} color="#3b82f6" style={{ display: 'inline', marginRight: 5 }} />A mayor plazo, menor cuota mensual pero más intereses en total. Compara el equilibrio entre ambos.</InsightBox>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resultado</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <MetricCard label="Pago mensual" value={fmt(loanRes.monthlyPayment)} sub="por mes" large bg="linear-gradient(135deg,#eef2ff,#e0e7ff)" border="#a5b4fc" tc="#3730a3" />
                      <MetricCard label="Intereses totales" value={fmt(loanRes.totalInterestPaid)} sub="costo del crédito" bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" border="#fca5a5" tc="#9f1239" />
                    </div>
                    <DarkPanel label="Total a devolver" value={fmt(loanRes.totalPaid)} sub={`Por cada $1 pedido devolverás $${(loanRes.totalPaid / Math.max(lP, 1)).toFixed(2)}`} />
                    {/* Expandable explainer */}
                    <button 
                      onClick={() => setExpandExplain(p => ({ ...p, loan: !p.loan }))} 
                      className="bg-transparent border-none cursor-pointer text-xs text-blue-600 font-bold font-sans py-0.5 pb-3.5 flex items-center gap-1.5 outline-none"
                    >
                      <HelpCircle size={14} /> ¿Qué significa esto? {expandExplain.loan ? '▲' : '▼'}
                    </button>
                    {expandExplain.loan && (
                      <div className="bg-blue-50 border border-blue-200 rounded-[14px] p-4 text-[13px] text-blue-900 leading-relaxed mb-4">
                        Por un préstamo de <strong>{fmt(lP)}</strong> a <strong>{lT} meses</strong>, pagarás <strong>{fmt(loanRes.monthlyPayment)}</strong> cada mes. Al final habrás devuelto <strong>{fmt(loanRes.totalPaid)}</strong> — es decir, <strong>{fmt(loanRes.totalInterestPaid)}</strong> más de lo que pediste solo en intereses. Reducir el plazo baja ese número.
                      </div>
                    )}
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Amortización: capital vs. interés</p>
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Parámetros</p>
                    <Slider label="Precio de compra" value={mPur} onChange={setMPur} min={1000} max={100000} step={500} prefix="$" color="#0d9488" />
                    <Slider label="Meses sin intereses" value={mMo} onChange={setMMo} min={3} max={24} step={3} suffix=" meses" color="#0891b2" />
                    <Slider label="Descuento de contado" value={mDis} onChange={setMDis} min={0} max={20} suffix="%" hint="Si el comercio da descuento al pagar completo" color="#059669" />
                    <Slider label="Rendimiento de tu dinero" value={mOpp} onChange={setMOpp} min={0} max={20} step={0.5} suffix="%" hint="CETES, fondo de ahorro, etc." color="#0d9488" />
                    <Slider label="Anualidad de tarjeta" value={mFee} onChange={setMFee} min={0} max={2000} step={100} prefix="$" hint="Costo anual de tener la tarjeta" color="#6366f1" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">¿Qué opción conviene?</p>
                    {[
                      { label: 'Pago de Contado', value: fmt(msiRes.comparisonVsCash.cashPrice), sub: `Con ${mDis}% de descuento`, best: msiRes.comparisonVsCash.betterOption === 'cash', bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#fde68a', tc: '#92400e', bc: '#d97706' },
                      { label: `${mMo} MSI (costo neto)`, value: fmt(msiRes.comparisonVsCash.cashPrice + msiRes.comparisonVsCash.difference), sub: 'Descontando rendimiento potencial', best: msiRes.comparisonVsCash.betterOption === 'installments', bg: 'linear-gradient(135deg,#f0fdfa,#ccfbf1)', border: '#6ee7b7', tc: '#064e3b', bc: '#059669' },
                    ].map(opt => (
                      <div 
                        key={opt.label} 
                        className="rounded-2xl p-5 mb-3 flex justify-between items-center gap-3 transition-all duration-300"
                        style={{ 
                          background: opt.best ? opt.bg : '#f8fafc', 
                          border: `2px solid ${opt.best ? opt.border : '#e2e8f0'}`, 
                          boxShadow: opt.best ? `0 4px 16px ${opt.border}60` : 'none' 
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {opt.best && <CheckCircle size={15} color={opt.bc} />}
                            <p className="font-bold m-0 text-sm" style={{ color: opt.best ? opt.bc : '#1e293b' }}>{opt.label}{opt.best && ' — Mejor opción'}</p>
                          </div>
                          <p className="text-xs text-slate-500 m-0">{opt.sub}</p>
                        </div>
                        <p className="font-bold text-[22px] m-0 shrink-0 tracking-tight" style={{ color: opt.best ? opt.bc : '#1e293b' }}>{opt.value}</p>
                      </div>
                    ))}
                    <DarkPanel label="Pago mensual MSI" value={fmt(msiRes.monthlyPayment)} sub={`durante ${mMo} meses`} />
                    <InsightBox color="#0d9488">
                      <div className="flex items-start gap-2">
                        <Info size={16} color="#0d9488" className="mt-0.5 shrink-0" />
                        <div>
                          {msiRes.comparisonVsCash.betterOption === 'cash' ? 'Conviene pagar de contado. El descuento supera lo que ganarías invirtiendo.' : `Conviene usar MSI. Tu dinero puede generar ${fmt(msiRes.comparisonVsCash.investedGains)} invertido al ${mOpp}%.`}
                          <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 font-medium text-[13px]">
                            <AlertTriangle size={14} className="text-amber-500" /> Un solo pago atrasado cobra intereses retroactivos.
                          </div>
                        </div>
                      </div>
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
                  <div className="col-span-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {[
                        { icon: HelpCircle, color: '#0B71FE', title: '¿Qué es el Buró de Crédito?', desc: 'No es una lista negra — es tu historial financiero. Registra todos tus créditos, pagos y deudas durante los últimos 6 años. Los bancos lo consultan para decidir si te prestan dinero y a qué tasa.' },
                        { icon: Award, color: '#0d9488', title: '¿Qué es un Credit Score?', desc: 'Un número entre 300 y 850 que resume qué tan confiable eres como deudor. A mayor puntaje, mejores tasas y más acceso al crédito. Lo generan empresas como Buró de Crédito y Círculo de Crédito.' },
                        { icon: Clock, color: '#f97316', title: '¿Cuánto tiempo dura la info?', desc: 'Los retrasos de pago se van borrando gradualmente. Un retraso de 1 mes desaparece en 1 año. Un retraso de 6+ meses puede durar hasta 6 años. Pagar tus deudas no borra el historial, pero sí mejora tu perfil.' },
                      ].map((c, i) => (
                        <div 
                          key={i} 
                          className="rounded-[20px] p-6 text-left"
                          style={{ 
                            background: `linear-gradient(135deg,${c.color}0a,${c.color}03)`, 
                            border: `1.5px solid ${c.color}20` 
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                            style={{ 
                              backgroundColor: `${c.color}15`, 
                              border: `1.5px solid ${c.color}25`, 
                              boxShadow: `0 0 20px ${c.color}15` 
                            }}
                          >
                            <c.icon size={24} color={c.color} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 m-0 mb-2.5 tracking-tight">{c.title}</h3>
                          <p className="text-[14px] text-slate-500 m-0 leading-relaxed font-medium">{c.desc}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-3">Los 5 factores de tu score — en detalle</p>

                    <Accordion title="Historial de pagos — 35% de tu score" icon={BadgeCheck} color="#0B71FE">
                      <p className="mt-2.5 mb-2 font-medium">El factor más importante. Cada pago puntual suma; cada retraso resta. El Buró registra si debes 1, 2, 3 o más meses.</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-2.5">
                        <div className="flex flex-col gap-2">
                          {[['Sin retrasos', '#16a34a'], ['1–29 días de retraso', '#ca8a04'], ['30–89 días de retraso', '#ea580c'], ['90+ días de retraso', '#dc2626']].map(([l, c]) => (
                            <div key={l} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c }} /><span className="text-[13px] text-slate-700 font-semibold">{l}</span></div>
                          ))}
                        </div>
                      </div>
                      <p className="m-0 mt-2.5 text-xs text-blue-600 font-bold flex items-center gap-1.5"><ArrowRight size={14} className="text-blue-500" />Configura débito automático al menos por el pago mínimo para nunca olvidar una fecha.</p>
                    </Accordion>

                    <Accordion title="Uso del crédito — 30% de tu score" icon={Percent} color="#f97316">
                      <p className="mt-2.5 mb-2 font-medium">Es el porcentaje de tu límite que estás usando. Si tienes $10,000 de límite y debes $6,000, tu utilización es del 60% — demasiado alta.</p>
                      <div className="grid grid-cols-3 gap-2 my-3">
                        {[['0–10%', 'Ideal', '#16a34a', 'bg-green-50'], ['10–30%', 'Bueno', '#ca8a04', 'bg-yellow-50'], ['+30%', 'Peligro', '#dc2626', 'bg-red-50']].map(([r, l, c, bg]) => (
                          <div key={r} className={`rounded-xl p-2.5 text-center border ${bg}`} style={{ borderColor: `${c}30` }}>
                            <p className="font-bold text-[15px] m-0 mb-1" style={{ color: c }}>{r}</p>
                            <p className="text-[11px] text-slate-500 m-0 font-medium">{l}</p>
                          </div>
                        ))}
                      </div>
                      <p className="m-0 mt-1 text-xs text-orange-500 font-bold flex items-center gap-1.5"><ArrowRight size={14} className="text-orange-500" />Pide un aumento de límite sin gastar más — eso baja tu % de uso automáticamente.</p>
                    </Accordion>

                    <Accordion title="Antigüedad del historial — 15% de tu score" icon={History} color="#0d9488">
                      <p className="mt-2.5 mb-2 font-medium">El Buró promedia la edad de todas tus cuentas. Una tarjeta de 10 años vale oro — cancelarla puede bajar tu score.</p>
                      <p className="m-0 mt-1 text-xs text-teal-600 font-bold flex items-center gap-1.5"><ArrowRight size={14} className="text-teal-600" />Si tienes una tarjeta vieja con anualidad alta, negocia exentarla antes de cancelarla.</p>
                    </Accordion>

                    <Accordion title="Tipos de crédito — 10% de tu score" icon={Layers} color="#8b5cf6">
                      <p className="mt-2.5 mb-2 font-medium">Tener una mezcla saludable (tarjeta + préstamo personal + crédito de auto) demuestra que puedes manejar distintos tipos de deuda.</p>
                      <p className="m-0 mt-1 text-xs text-violet-500 font-bold flex items-center gap-1.5"><ArrowRight size={14} className="text-violet-500" />No pidas crédito solo para diversificar — solo hazlo cuando genuinamente lo necesites.</p>
                    </Accordion>

                    <Accordion title="Nuevas solicitudes — 10% de tu score" icon={FileText} color="#ef4444">
                      <p className="mt-2.5 mb-2 font-medium">Cada vez que solicitas un crédito, el banco hace una "consulta dura" que puede bajar tu score temporalmente 5–10 puntos. Múltiples solicitudes en poco tiempo dan señal de desesperación financiera.</p>
                      <p className="m-0 mt-1 text-xs text-red-500 font-bold flex items-center gap-1.5"><ArrowRight size={14} className="text-red-500" />Compara ofertas de crédito sin "agregar carrito" — muchos bancos permiten ver si "precalificas" sin consulta dura.</p>
                    </Accordion>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MythVsReality />
                      <QuickTrivia />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>

          {/* Bottom tips */}
          {tab !== 'guide' && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: TrendingDown, color: '#ef4444', title: 'Interés compuesto', text: 'Los intereses generan más intereses. Una deuda crece rápido si solo pagas el mínimo.' },
                { icon: Target, color: '#0B71FE', title: 'Regla del 20%', text: 'Tus pagos de deuda no deben superar el 20% de tu ingreso mensual neto.' },
                { icon: BookOpen, color: '#0d9488', title: 'CAT > Tasa nominal', text: 'El CAT incluye comisiones y seguros. Compara créditos por CAT, no por tasa anual.' },
              ].map((tip, i) => {
                const Icon = tip.icon
                return (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div 
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${tip.color}15`, 
                        border: `1px solid ${tip.color}25`, 
                        boxShadow: `0 0 20px ${tip.color}18` 
                      }}
                    >
                      <Icon size={20} color={tip.color} />
                    </div>
                    <p className="font-bold text-[15px] text-slate-800 m-0 mb-2 tracking-tight">{tip.title}</p>
                    <p className="text-[14px] text-slate-500 leading-relaxed m-0">{tip.text}</p>
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
