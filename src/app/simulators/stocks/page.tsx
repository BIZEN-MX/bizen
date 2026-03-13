"use client"

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, Target,
  BarChart2, Clock, Zap, Shield, ArrowUpRight, ArrowDownRight,
  RefreshCw, CheckCircle2, Rocket, Activity, BarChart3, ArrowLeft
} from 'lucide-react'
import PageLoader from '@/components/PageLoader'
import { SaveRunButton } from '@/components/simulators/SaveRunButton'

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
  const [dataFetched, setDataFetched] = useState(false)

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

  const cash = portfolio ? Number(portfolio.cash_balance) : 0
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
      `}</style>
      <div className="sidebar-offset" style={{ minHeight: '100vh', background: 'linear-gradient(170deg,#f8fafc 0%,#f1f5f9 100%)', fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Helvetica,Arial,sans-serif' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px)', paddingBottom: 64 }}>

          {/* Header */}
          <div style={{ marginBottom: 32, animation: 'fadeUp 0.5s ease' }}>
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
            <h1 style={{ fontSize: 'clamp(26px,4.5vw,46px)', fontWeight: 600, margin: '0 0 10px', color: '#0B1E5E', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Simulador de Mercado</h1>
            <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.6, maxWidth: 580 }}>Aprende a invertir en acciones y ETFs reales usando dinero virtual. Las órdenes se ejecutan al precio de cierre del día.</p>
          </div>

          {/* Disclaimer */}
          <div style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid #fde68a', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28 }}>
            <AlertTriangle size={17} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6, margin: 0 }}>Precios de referencia (EOD). Las órdenes se ejecutan al cierre del siguiente día hábil. Este simulador NO usa dinero real. BIZEN no es un broker.</p>
          </div>

          {/* Balance Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 'clamp(10px, 2vw, 14px)', marginBottom: 32 }}>
            {[
              { label: 'Efectivo', value: `$${cash.toLocaleString('es-MX',{minimumFractionDigits:2})}`, sub: 'USD Virtuales', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', tc: '#065f46' },
              { label: 'Valor Total', value: `$${cash.toLocaleString('es-MX',{minimumFractionDigits:2})}`, sub: 'portafolio estimado', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', tc: '#1e3a8a' },
              { label: 'Rendimiento', value: '0.00%', sub: 'desde el inicio', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', tc: '#4c1d95' },
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
              <div style={{ padding: '28px 32px' }}>
                <h2 style={{ fontSize: 19, fontWeight: 500, color: '#0B1E5E', margin: '0 0 22px' }}>Mis Posiciones</h2>
                {!portfolio?.holdings?.length ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px', background: '#f8fafc', borderRadius: 18, border: '2px dashed #e2e8f0' }}>
                    <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <TrendingUp size={26} color="#10b981" />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', margin: '0 0 6px' }}>Tu portafolio está vacío</p>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px' }}>Ve al Mercado para hacer tu primera inversión virtual</p>
                    <button onClick={() => setActiveTab('market')} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 500, cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                      Ir al Mercado <ArrowUpRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ borderBottom: '1px solid #f1f5f9' }}>{['Símbolo','Cantidad','Costo Prom.','Acción'].map(h => <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 500, color: '#94a3b8', textAlign: 'left', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</th>)}</tr></thead>
                      <tbody>{portfolio.holdings.map((h: any) => (
                        <tr key={h.id} className="sim-row-table" style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '14px', fontWeight: 600, color: '#1e293b', fontSize: 15 }}>{h.symbol}</td>
                          <td style={{ padding: '14px', color: '#475569' }}>{Number(h.quantity).toFixed(4)}</td>
                          <td style={{ padding: '14px', color: '#475569' }}>${Number(h.avg_cost).toFixed(2)}</td>
                          <td style={{ padding: '14px' }}><button style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Vender</button></td>
                        </tr>
                      ))}</tbody>
                    </table>
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
                        totalValue: portfolio.cash_balance // simplified for now
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
                  {marketData.length === 0 && <p style={{ color: '#64748b' }}>Cargando datos del mercado...</p>}
                  {marketData.map(s => (
                    <div key={s.symbol} className="sim-stock-row" onClick={() => setOrderForm(f => ({ ...f, symbol: s.symbol }))}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 16, color: '#0B1E5E', margin: '0 0 2px' }}>{s.symbol}</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 5px', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                        <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', background: '#e2e8f0', color: '#475569', borderRadius: 99, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{s.sector}</span>
                      </div>
                      <div style={{ textAlign: 'right' as const }}>
                        <p style={{ fontWeight: 600, fontSize: 18, color: '#0B1E5E', margin: '0 0 4px' }}>${s.price.toFixed(2)}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                          {s.change >= 0 ? <ArrowUpRight size={14} color="#10b981" /> : <ArrowDownRight size={14} color="#ef4444" />}
                          <span style={{ fontSize: 13, fontWeight: 500, color: s.change >= 0 ? '#10b981' : '#ef4444' }}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Order */}
                <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 24, padding: 'clamp(20px, 4vw, 32px)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={18} color="#10b981" />
                    </div>
                    <h3 style={{ fontWeight: 500, fontSize: 18, margin: 0, color: 'white' }}>Colocar Orden</h3>
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
                        {marketData.map(s => <option key={s.symbol} value={s.symbol} style={{ background: '#1e293b', color: 'white' }}>{s.symbol} — {s.name?.slice(0, 22)}</option>)}
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
