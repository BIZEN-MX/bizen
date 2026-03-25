"use client"

import React, { useState, useEffect, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, Target,
  BarChart2, Clock, Zap, Shield, ArrowUpRight, ArrowDownRight,
  RefreshCw, CheckCircle2, Rocket, Activity, BarChart3, ArrowLeft,
  Flame, Skull, Info
} from 'lucide-react'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import PageLoader from '@/components/PageLoader'
import { SaveRunButton } from '@/components/simulators/SaveRunButton'

const SECTOR_COLORS: Record<string, string> = {
  'Tecnología': '#3b82f6',
  'Finanzas': '#10b981',
  'Salud': '#ef4444',
  'Energía': '#f59e0b',
  'Consumo': '#8b5cf6',
  'ETF/Índice': '#6366f1',
  'Otros': '#94a3b8'
}

const SYMBOL_SECTORS: Record<string, string> = {
  'AAPL': 'Tecnología', 'MSFT': 'Tecnología', 'GOOGL': 'Tecnología', 'NVDA': 'Tecnología', 'META': 'Tecnología',
  'AMZN': 'Consumo', 'TSLA': 'Consumo',
  'JPM': 'Finanzas', 'BAC': 'Finanzas', 'GS': 'Finanzas',
  'VOO': 'ETF/Índice', 'IVV': 'ETF/Índice', 'QQQ': 'ETF/Índice',
  'XLE': 'Energía', 'XLV': 'Salud'
}

const CHALLENGES = [
  { title: 'Primera Inversión', desc: 'Compra tu primera fracción de un ETF indexado.', pts: '+50 XP', icon: <Rocket size={24} color="#10b981" /> },
  { title: 'Portafolio Diversificado', desc: 'Mantén posiciones en al menos 3 activos distintos.', pts: '+100 XP', icon: <Target size={24} color="#3b82f6" /> },
  { title: 'Hold Steady 30d', desc: 'No vendas ninguna posición durante 30 días.', pts: '+200 XP', icon: <Activity size={24} color="#8b5cf6" /> },
  { title: 'Dollar-Cost Averaging', desc: 'Compra el mismo ETF en 3 momentos distintos.', pts: '+150 XP', icon: <BarChart3 size={24} color="#f59e0b" /> },
]

function StockSimulatorContent() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const runId = searchParams.get('runId')
  const [portfolio, setPortfolio] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('portfolio')
  const [orderForm, setOrderForm] = useState({ symbol: 'VOO', side: 'buy', qty: 1, type: 'market' })
  const [placing, setPlacing] = useState(false)
  const [orderMsg, setOrderMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [marketData, setMarketData] = useState<any[]>([])
  const [isCrisis, setIsCrisis] = useState(false)
  const [crisisImpact, setCrisisImpact] = useState(0)
  const [dataFetched, setDataFetched] = useState(false)
  const orderFormRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && user) {
      Promise.all([fetchPortfolio(), fetchMarketData()]).finally(() => setDataFetched(true))
    }
  }, [user, loading])

  const fetchMarketData = async () => {
    try {
      const res = await fetch('/api/simulators/stocks/market')
      if (res.ok) {
        const data = await res.json()
        setMarketData(data)
        if (data.length > 0) {
          setOrderForm(f => ({ ...f, symbol: data[0].symbol }))
        }
      }
    } catch {}
  }

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/simulators/stocks/portfolio')
      if (res.ok) setPortfolio(await res.json())
    } catch {}
  }

  const placeOrder = async () => {
    setPlacing(true); setOrderMsg(null)
    try {
      const res = await fetch('/api/simulators/stocks/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: orderForm.symbol, side: orderForm.side, order_type: orderForm.type, quantity: orderForm.qty }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrderMsg({ type: 'ok', text: `Orden de ${orderForm.side === 'buy' ? 'compra' : 'venta'} de ${orderForm.qty} ${orderForm.symbol} colocada. Se ejecutará al próximo precio de cierre.` })
        fetchPortfolio()
      } else {
        setOrderMsg({ type: 'err', text: data.error || 'Error al colocar la orden.' })
      }
    } catch {
      setOrderMsg({ type: 'err', text: 'Error de conexión.' })
    } finally { setPlacing(false) }
  }

  const triggerCrisis = () => {
    if (isCrisis) {
      setIsCrisis(false)
      setCrisisImpact(0)
    } else {
      setIsCrisis(true)
      setCrisisImpact(Math.floor(Math.random() * 20) + 15) // 15-35% drop
    }
  }

  const processedMarketData = useMemo(() => {
    if (!isCrisis) return marketData
    return marketData.map(s => ({
      ...s,
      price: s.price * (1 - crisisImpact / 100),
      change: s.change - crisisImpact
    }))
  }, [marketData, isCrisis, crisisImpact])

  const cash = portfolio ? Number(portfolio.cash_balance) : 0
  const holdingsValue = portfolio?.holdings?.reduce((sum: number, h: any) => {
    const marketPrice = processedMarketData.find(m => m.symbol === h.symbol)?.price ?? h.avg_cost
    return sum + (Number(h.quantity) * Number(marketPrice))
  }, 0) || 0
  const totalValue = cash + holdingsValue
  const startingCash = portfolio ? Number(portfolio.starting_cash) : 10000
  const returns = startingCash > 0 ? ((totalValue - startingCash) / startingCash) * 100 : 0

  // Sector distribution for Pie Chart
  const sectorData = useMemo(() => {
    const sectors: Record<string, number> = {}
    portfolio?.holdings?.forEach((h: any) => {
      const sector = SYMBOL_SECTORS[h.symbol] || 'Otros'
      const marketPrice = processedMarketData.find(m => m.symbol === h.symbol)?.price ?? h.avg_cost
      const value = Number(h.quantity) * Number(marketPrice)
      sectors[sector] = (sectors[sector] || 0) + value
    })
    return Object.entries(sectors).map(([name, value]) => ({ name, value }))
  }, [portfolio, processedMarketData])

  const diversificationScore = useMemo(() => {
    if (!portfolio?.holdings?.length) return 0
    const uniqueSectors = new Set(portfolio.holdings.map((h: any) => SYMBOL_SECTORS[h.symbol] || 'Otros')).size
    const uniqueStocks = portfolio.holdings.length
    // Simple logic: 10 points per sector (max 50), 5 points per stock (max 50)
    return Math.min(100, (uniqueSectors * 15) + (uniqueStocks * 5))
  }, [portfolio])
  const tabs = [
    { id: 'portfolio', label: 'Mi Portafolio', icon: BarChart2 },
    { id: 'market', label: 'Mercado + Orden', icon: TrendingUp },
    { id: 'orders', label: 'Historial', icon: Clock },
    { id: 'challenges', label: 'Misiones', icon: Target },
  ]

  if (loading || (user && !dataFetched)) return <PageLoader />
  if (!user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontSize: 16, color: '#64748b', flexDirection: 'column', gap: 12 }}><Shield size={40} color="#94a3b8" /><p>Inicia sesión para jugar.</p></div>

  return (
    <>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .sim-stock-row{transition:all 0.2s;cursor:pointer;border-radius:14px;padding:14px 16px;border:1.5px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;}
        .sim-stock-row:hover{background:#f0fdf4;border-color:#86efac;transform:translateX(3px);}
        .sim-row-table:hover{background:#f8fafc;}
        .sim-row-table{transition:background 0.15s;}
        .sidebar-offset{margin-left:0}
        @media(min-width:768px){.sidebar-offset{margin-left:220px}}
        @media(min-width:1161px){.sidebar-offset{margin-left:280px}}
        @media(max-width:767px){.sidebar-offset{padding-bottom:80px!important}}
        @keyframes pulseGlow {
          0% { transform: scale(1); box-shadow: 0 4px 14px rgba(16,185,129,0.35); }
          50% { transform: scale(1.05); box-shadow: 0 6px 25px rgba(16,185,129,0.6); }
          100% { transform: scale(1); box-shadow: 0 4px 14px rgba(16,185,129,0.35); }
        }
        .pulsing-order-btn { 
          animation: pulseGlow 1.5s ease-in-out infinite;
          border: 2px solid #fff !important;
        }
      `}</style>
      <div className="sidebar-offset" style={{ minHeight: '100vh', background: 'linear-gradient(170deg,#f8fafc 0%,#f1f5f9 100%)', fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Helvetica,Arial,sans-serif' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px)', paddingBottom: 64 }}>

          {/* Header */}
          <div style={{ marginBottom: 32, animation: 'fadeUp 0.5s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <Link href="/cash-flow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 20, transition: 'color 0.2s' }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => e.currentTarget.style.color = '#0B1E5E'}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => e.currentTarget.style.color = '#64748b'}
              >
                <ArrowLeft size={14} /> Volver al Centro Financiero
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 99, padding: '5px 14px', marginBottom: 14, alignSelf: 'flex-start', fontSize: 12, fontWeight: 500, color: '#059669', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Simulador Educativo — Sin dinero real
                </div>
              </div>
              <h1 style={{ fontSize: 'clamp(26px,4.5vw,46px)', fontWeight: 600, margin: '0 0 10px', color: '#0B1E5E', letterSpacing: '-0.03em', lineHeight: 1.1 }}>BIZEN Market</h1>
              <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.6, maxWidth: 580 }}>Aprende a invertir en acciones y ETFs reales usando dinero virtual. Las órdenes se ejecutan al precio de cierre del día.</p>
            </div>

            <button 
              onClick={triggerCrisis}
              style={{ 
                padding: '12px 20px', 
                borderRadius: 16, 
                border: 'none', 
                background: isCrisis ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #991b1b)',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: isCrisis ? '0 4px 12px rgba(16,185,129,0.2)' : '0 4px 12px rgba(239,68,68,0.2)',
                transition: 'all 0.3s'
              }}
            >
              {isCrisis ? <><RefreshCw size={18} /> Recuperar Mercado</> : <><Skull size={18} /> Simular Cisne Negro</>}
            </button>
          </div>

          {/* Crisis Overlay / Alert */}
          {isCrisis && (
            <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#991b1b)', borderRadius: 24, padding: '24px 32px', marginBottom: 32, border: '2px solid #ef4444', position: 'relative', overflow: 'hidden', animation: 'fadeUp 0.4s ease' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'rotate(15deg)' }}>
                <Skull size={180} color="white" />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ background: 'white', color: '#991b1b', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Evento de Mercado</div>
                  <h2 style={{ color: 'white', margin: 0, fontSize: 24, fontWeight: 800 }}>🚨 ¡Pánico en Wall Street!</h2>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.6, maxWidth: 700, margin: '0 0 20px' }}>
                  Un evento inesperado ha causado un desplome del <strong>{crisisImpact}%</strong> en el mercado global. Los inversores están vendiendo por miedo. ¿Qué harás con tu portafolio?
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Info size={18} color="#fca5a5" />
                    <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>Tip: Mantén la calma y revisa tu diversificación.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid #fde68a', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28 }}>
            <AlertTriangle size={17} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6, margin: 0 }}>Precios de referencia (EOD). Las órdenes se ejecutan al cierre del siguiente día hábil. Este simulador NO usa dinero real. BIZEN no es un broker.</p>
          </div>

          {/* Balance Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 'clamp(10px, 2vw, 14px)', marginBottom: 32 }}>
            {[
              { label: 'Efectivo', value: `$${cash.toLocaleString('es-MX',{minimumFractionDigits:2})}`, sub: 'USD Virtuales', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', tc: '#065f46' },
              { label: 'Valor Total', value: `$${totalValue.toLocaleString('es-MX',{minimumFractionDigits:2})}`, sub: 'portafolio estimado', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', tc: '#1e3a8a' },
              { label: 'Rendimiento', value: `${returns.toFixed(2)}%`, sub: 'desde el inicio', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', tc: '#4c1d95' },
              { label: 'Posiciones', value: String(portfolio?.holdings?.length ?? 0), sub: 'activos', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', tc: '#78350f' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 20, padding: '20px', border: '1.5px solid rgba(0,0,0,0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: s.tc, textTransform: 'uppercase' as const, letterSpacing: '0.07em', margin: '0 0 6px', opacity: 0.7 }}>{s.label}</p>
                <p style={{ fontSize: 26, fontWeight: 600, color: s.tc, margin: '0 0 2px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: s.tc, margin: 0, opacity: 0.6 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
            {tabs.map(t => {
              const Icon = t.icon
              const active = activeTab === t.id
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ border: active ? 'none' : '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 14, borderRadius: 12, padding: '10px 18px', transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'inherit', background: active ? '#0B1E5E' : 'white', color: active ? 'white' : '#64748b', boxShadow: active ? '0 4px 14px rgba(11,30,94,0.25)' : 'none' }}>
                  <Icon size={15} />{t.label}
                </button>
              )
            })}
          </div>

          {/* Panel */}
          <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

            {activeTab === 'portfolio' && (
              <div style={{ padding: '28px clamp(16px, 4vw, 32px)' }}>
                {portfolio && portfolio.holdings?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    
                    {/* Visual Insights Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, background: '#fff', borderRadius: 24, padding: 24, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0B1E5E', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <BarChart3 size={18} color="#3b82f6" /> Distribución por Sector
                        </h3>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>Mira cómo estás repartiendo tus inversiones.</p>
                        <div style={{ height: 220, width: '100%', position: 'relative' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={sectorData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {sectorData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={SECTOR_COLORS[entry.name] || '#94a3b8'} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Valor']}
                                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                            <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>Total</p>
                            <p style={{ fontSize: 16, fontWeight: 800, color: isCrisis ? '#ef4444' : '#0B1E5E', margin: 0 }}>${holdingsValue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ background: '#f8fafc', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0B1E5E', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Shield size={18} color="#10b981" /> Score de Diversificación
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, margin: '16px 0 10px' }}>
                            <span style={{ fontSize: 44, fontWeight: 900, color: diversificationScore > 70 ? '#10b981' : diversificationScore > 40 ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>
                              {diversificationScore}
                            </span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', paddingBottom: 6 }}>/ 100</span>
                          </div>
                          <div style={{ height: 10, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginBottom: 16 }}>
                            <div style={{ height: '100%', width: `${diversificationScore}%`, background: diversificationScore > 70 ? '#10b981' : diversificationScore > 40 ? '#f59e0b' : '#ef4444', borderRadius: 99, transition: 'width 0.6s ease-out' }} />
                          </div>
                          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                            {diversificationScore > 70 
                              ? "¡Excelente trabajo! Tienes un portafolio bien balanceado." 
                              : diversificationScore > 40 
                              ? "Buen comienzo. Intenta agregar activos de otros sectores para reducir riesgos."
                              : "Tu portafolio está muy concentrado. Comprar diferentes tipos de activos te protege mejor."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto', background: 'white', borderRadius: 24, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Activo</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Sector</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Cantidad</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Costo Prom.</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Precio Actual</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Retorno</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.holdings.map((h: any) => {
                            const marketPrice = processedMarketData.find(m => m.symbol === h.symbol)?.price ?? h.avg_cost
                            const ret = ((marketPrice - Number(h.avg_cost)) / Number(h.avg_cost)) * 100
                            const sector = SYMBOL_SECTORS[h.symbol] || 'Otros'
                            return (
                              <tr key={h.symbol} className="sim-row-table" style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '16px' }}>
                                  <div style={{ fontWeight: 700, color: '#0B1E5E' }}>{h.symbol}</div>
                                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{marketData.find(m => m.symbol === h.symbol)?.name}</div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                  <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: `${SECTOR_COLORS[sector]}15`, color: SECTOR_COLORS[sector] }}>
                                    {sector}
                                  </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>{Number(h.quantity).toFixed(4)}</td>
                                <td style={{ padding: '16px', textAlign: 'right', color: '#64748b' }}>${Number(h.avg_cost).toLocaleString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: isCrisis ? '#ef4444' : '#0B1E5E' }}>${marketPrice.toLocaleString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontWeight: 700, color: ret >= 0 ? '#10b981' : '#ef4444' }}>
                                    {ret >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {Math.abs(ret).toFixed(2)}%
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '64px 0', background: 'white', borderRadius: 24, border: '1.5px dashed #e2e8f0' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <BarChart2 size={32} color="#cbd5e1" />
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: '#0B1E5E', margin: '0 0 6px' }}>Portafolio vacío</p>
                    <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>Aún no tienes acciones. Ve a la pestaña de Mercado para empezar.</p>
                    <button onClick={() => setActiveTab('market')} style={{ padding: '12px 24px', background: '#0B1E5E', color: 'white', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Explorar Mercado</button>
                  </div>
                )}
                
                {portfolio && (
                  <div style={{ marginTop: 24, padding: '0 4px' }}>
                    <SaveRunButton 
                      simulatorSlug="stocks"
                      inputs={{ date: new Date().toISOString() }}
                      outputs={{ 
                        cash: portfolio.cash_balance,
                        holdingsCount: portfolio.holdings?.length ?? 0,
                        totalValue: totalValue
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'market' && (
              <div style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
                  <h2 style={{ fontSize: 19, fontWeight: 500, color: '#0B1E5E', margin: 0 }}>ETFs & Acciones</h2>
                  <span style={{ fontSize: 12, color: '#94a3b8', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 10px' }}>Precios EOD de referencia</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 'clamp(10px, 2vw, 14px)', marginBottom: 32 }}>
                  {processedMarketData.length === 0 && <p style={{ color: '#64748b' }}>Cargando datos del mercado...</p>}
                  {processedMarketData.map(s => {
                    const isSelected = orderForm.symbol === s.symbol;
                    return (
                      <div 
                        key={s.symbol} 
                        className="sim-stock-row" 
                        onClick={() => {
                          setOrderForm(f => ({ ...f, symbol: s.symbol }));
                          setTimeout(() => {
                            orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 50);
                        }}
                        style={{
                          borderColor: isSelected ? '#10b981' : '#e2e8f0',
                          background: isSelected ? '#f0fdf4' : '#f8fafc',
                          boxShadow: isSelected ? '0 0 0 3px rgba(16,185,129,0.1)' : 'none',
                          transform: isSelected ? 'scale(1.02)' : 'none',
                          zIndex: isSelected ? 1 : 0
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 16, color: '#0B1E5E', margin: '0 0 2px' }}>{s.symbol}</p>
                          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 5px', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                          <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', background: isSelected ? '#dcfce7' : '#e2e8f0', color: isSelected ? '#166534' : '#475569', borderRadius: 99, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{s.sector}</span>
                        </div>
                        <div style={{ textAlign: 'right' as const }}>
                          <p style={{ fontWeight: 600, fontSize: 18, color: '#0B1E5E', margin: '0 0 4px' }}>${s.price.toFixed(2)}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                            {s.change >= 0 ? <ArrowUpRight size={14} color="#10b981" /> : <ArrowDownRight size={14} color="#ef4444" />}
                            <span style={{ fontSize: 13, fontWeight: 500, color: s.change >= 0 ? '#10b981' : '#ef4444' }}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Order */}
                <div ref={orderFormRef} style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 24, padding: 'clamp(20px, 4vw, 32px)', color: 'white', border: '2px solid rgba(16,185,129,0.2)', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={18} color="#10b981" />
                    </div>
                    <h3 style={{ fontWeight: 500, fontSize: 18, margin: 0, color: 'white' }}>Colocar Orden</h3>
                    {orderForm.symbol && (() => {
                      const selectedStock = processedMarketData.find(s => s.symbol === orderForm.symbol);
                      if (!selectedStock) return null;
                      return (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{selectedStock.name}</span>
                          <span style={{ fontSize: 18, fontWeight: 700, color: isCrisis ? '#ef4444' : '#10b981' }}>${selectedStock.price.toFixed(2)}</span>
                        </div>
                      )
                    })()}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 20, marginBottom: 28 }}>
                    {/* Symbol */}
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Símbolo</label>
                      <select
                        value={orderForm.symbol}
                        onChange={e => setOrderForm(f => ({ ...f, symbol: e.target.value }))}
                        style={{ width: '100%', height: 48, padding: '0 14px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 500, fontFamily: 'inherit', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = '#10b981'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                      >
                        {processedMarketData.map(s => <option key={s.symbol} value={s.symbol} style={{ background: '#1e293b', color: 'white' }}>{s.symbol} — {s.name?.slice(0, 22)}</option>)}
                      </select>
                    </div>

                    {/* Side */}
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Dirección</label>
                      <div style={{ display: 'flex', gap: 8, height: 48 }}>
                        {(['buy', 'sell'] as const).map(side => (
                          <button
                            key={side}
                            onClick={() => setOrderForm(f => ({ ...f, side }))}
                            style={{
                              flex: 1, border: 'none', borderRadius: 12, fontWeight: 500, fontSize: 13,
                              cursor: 'pointer', fontFamily: 'inherit', height: '100%',
                              transition: 'all 0.2s',
                              background: orderForm.side === side
                                ? (side === 'buy' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)')
                                : 'rgba(255,255,255,0.07)',
                              color: orderForm.side === side ? 'white' : '#64748b',
                              boxShadow: orderForm.side === side
                                ? (side === 'buy' ? '0 4px 12px rgba(16,185,129,0.4)' : '0 4px 12px rgba(239,68,68,0.4)')
                                : 'none',
                            }}
                          >
                            {side === 'buy' ? '▲ Comprar' : '▼ Vender'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Cantidad (acciones)</label>
                      <input
                        type="number" min={0.01} step={0.01} value={orderForm.qty}
                        onChange={e => setOrderForm(f => ({ ...f, qty: Number(e.target.value) }))}
                        style={{ width: '100%', boxSizing: 'border-box' as const, height: 48, padding: '0 14px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                        onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className={(!placing && orderForm.qty > 0) ? 'pulsing-order-btn' : ''}
                    style={{ padding: '14px 28px', background: placing ? '#334155' : 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 500, cursor: placing ? 'not-allowed' : 'pointer', fontSize: 15, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: placing ? 'none' : '0 4px 14px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (!placing) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(16,185,129,0.45)'; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = placing ? 'none' : '0 4px 14px rgba(16,185,129,0.35)'; }}
                  >
                    {placing ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Enviando...</> : <><Zap size={16} /> Colocar Orden</>}
                  </button>

                  {orderMsg && (
                    <div style={{ marginTop: 16, padding: '14px 18px', borderRadius: 12, background: orderMsg.type === 'ok' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `1.5px solid ${orderMsg.type === 'ok' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      {orderMsg.type === 'ok' ? <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />}
                      <p style={{ margin: 0, fontSize: 13, color: orderMsg.type === 'ok' ? '#6ee7b7' : '#fca5a5', lineHeight: 1.6 }}>{orderMsg.text}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div style={{ padding: '28px 32px' }}>
                <h2 style={{ fontSize: 19, fontWeight: 500, color: '#0B1E5E', margin: '0 0 22px' }}>Historial de Órdenes</h2>
                {!portfolio?.orders?.length ? (
                  <div style={{ textAlign: 'center', padding: '48px', background: '#f8fafc', borderRadius: 18, border: '2px dashed #e2e8f0' }}>
                    <Clock size={32} color="#94a3b8" style={{ display: 'block', margin: '0 auto 12px' }} />
                    <p style={{ color: '#64748b', fontSize: 15, fontWeight: 500 }}>No has colocado órdenes todavía.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #f1f5f9' }}>{['Fecha','Símbolo','Tipo','Cant.','Estado'].map(h => <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 500, color: '#94a3b8', textAlign: 'left', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</th>)}</tr></thead>
                    <tbody>{portfolio.orders.map((o: any) => (
                      <tr key={o.id} className="sim-row-table" style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '14px', fontSize: 13, color: '#64748b' }}>{new Date(o.placed_at).toLocaleDateString('es-MX')}</td>
                        <td style={{ padding: '14px', fontWeight: 600, color: '#1e293b' }}>{o.symbol}</td>
                        <td style={{ padding: '14px' }}><span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: o.side === 'buy' ? '#d1fae5' : '#fee2e2', color: o.side === 'buy' ? '#065f46' : '#991b1b' }}>{o.side === 'buy' ? '▲ Compra' : '▼ Venta'}</span></td>
                        <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{Number(o.quantity).toFixed(4)}</td>
                        <td style={{ padding: '14px' }}><span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 8, textTransform: 'uppercase' as const, background: o.status === 'pending' ? '#fef3c7' : o.status === 'filled' ? '#d1fae5' : '#f1f5f9', color: o.status === 'pending' ? '#92400e' : o.status === 'filled' ? '#065f46' : '#475569' }}>{o.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div style={{ padding: '28px clamp(16px, 4vw, 32px)' }}>
                <h2 style={{ fontSize: 19, fontWeight: 500, color: '#0B1E5E', margin: '0 0 6px' }}>Misiones de Inversión</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 22px' }}>Completa misiones para ganar XP y dominar conceptos reales.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
                  {CHALLENGES.map((c, i) => (
                    <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 20, padding: '20px 22px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 26, flexShrink: 0 }}>{c.icon}</div>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 15, color: '#0B1E5E', margin: '0 0 5px' }}>{c.title}</p>
                        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: '0 0 10px' }}>{c.desc}</p>
                        <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', background: 'linear-gradient(135deg,#ddd6fe,#c4b5fd)', color: '#4c1d95', borderRadius: 99, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{c.pts}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default function StockSimulatorPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <StockSimulatorContent />
    </Suspense>
  )
}
