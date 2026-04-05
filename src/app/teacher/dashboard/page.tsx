'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PageLoader from '@/components/PageLoader'
import DailyChallengeWidget from '@/components/DailyChallengeWidget'
import {
    Users, BookOpen, TrendingUp, Zap, Search,
    ChevronRight, Award, BarChart2, Activity,
    Shield, AlertTriangle, Download, ChevronUp, ChevronDown,
    Brain, Star, Target, ArrowUpRight, X, Briefcase, Calendar, MessageCircle, Wallet, FileText
} from 'lucide-react'
import { generateImpactReport } from '@/utils/reportGenerator'

// ─── Types ────────────────────────────────────────────────────────
interface Student {
    id: string
    name: string
    level: number
    xp: number
    joinedAt: string
    coursesEnrolled: string[]
    completedLessonsCount: number
    averageProgress?: number
    lastActive?: string
}

interface StudentDetailData {
    profile: {
        name: string
        level: number
        xp: number
        bizcoins: number
        streak: number
        joinedAt: string
    }
    metrics: {
        avgQuizScore: number
        totalAttempts: number
        lessonsCompleted: number
        totalProgress: number
    }
    diagnostic: {
        score: number
        completedAt: string
        answers: any
    } | null
    simulator: {
        roi: string
        cash: number
        holdingsCount: number
    } | null
    social: {
        posts: number
        comments: number
        reputation: number
    }
}

interface DiagnosticStats {
    avgScore: number
    participation: number
    strengths: string[]
    weaknesses: string[]
}

interface Leader {
    name: string
    reputation: number
    xp: number
}

interface DashboardData {
    school: string
    kpis: {
        totalStudents: number
        avgModulesCompleted: number
        totalCompletedLessons: number
        avgAttemptsPerQuiz: number
        institutionalROI: number
        studentsAtRisk: number
        diagnosticStats: DiagnosticStats
        currentQuizAvg: number
        nationalAvg: number
    }
    students: Student[]
    communityLeaders: Leader[]
}

// ─── Helpers ──────────────────────────────────────────────────────
function getLevelMeta(level: number) {
    if (level >= 8) return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', label: 'Experto' }
    if (level >= 5) return { bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', label: 'Avanzado' }
    if (level >= 3) return { bg: 'linear-gradient(135deg, #0F62FE, #2563eb)', color: '#fff', label: 'Intermedio' }
    return { bg: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', label: 'Inicio' }
}

function avatarColor(name: string) {
    const h = (name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 13) % 360
    return { bg: `hsl(${h},60%,92%)`, fg: `hsl(${h},50%,32%)` }
}

function relativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} días`
    return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function exportCSV(students: Student[]) {
    const headers = ['Nombre', 'Nivel', 'XP', 'Progreso %', 'Lecciones', 'Última Actividad']
    const rows = students.map(s => [
        s.name, s.level, s.xp, s.averageProgress ?? 0, s.completedLessonsCount,
        s.lastActive ? new Date(s.lastActive).toLocaleDateString('es-MX') : 'N/A'
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'alumnos.csv'
    a.click()
}

// ─── Sub-components ───────────────────────────────────────────────
function AnimatedCounter({ value, decimals = 0 }: { value: number; decimals?: number }) {
    const [display, setDisplay] = useState(0)
    useEffect(() => {
        if (value === 0) return
        let start = 0
        const step = value / 60
        const timer = setInterval(() => {
            start += step
            if (start >= value) { setDisplay(value); clearInterval(timer) }
            else setDisplay(start)
        }, 16)
        return () => clearInterval(timer)
    }, [value])
    return <>{display.toFixed(decimals)}</>
}

function RadialGauge({ score }: { score: number }) {
    const r = 48
    const circ = 2 * Math.PI * r
    const cap = Math.min(score, 100)
    const dash = (cap / 100) * circ
    const color = cap >= 70 ? '#10b981' : cap >= 40 ? '#f59e0b' : '#ef4444'
    return (
        <svg width={120} height={120} viewBox="0 0 120 120">
            <circle cx={60} cy={60} r={r} fill="none" stroke="#f1f5f9" strokeWidth={10} />
            <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={10}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }} />
            <text x={60} y={56} textAnchor="middle" fill={color} fontSize={22} fontWeight={600}>{cap}</text>
            <text x={60} y={72} textAnchor="middle" fill="#94a3b8" fontSize={10}>de 100</text>
        </svg>
    )
}

function CategoryBar({ label, score, max = 100 }: { label: string; score: number; max?: number }) {
    const pct = Math.round((score / max) * 100)
    const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444'
    return (
        <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 1s ease' }} />
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────
export default function AdminDashboardPage() {
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<'name' | 'level' | 'xp' | 'averageProgress'>('xp')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
    const [mounted, setMounted] = useState(false)
    
    // Detailed stats state
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
    const [studentDetail, setStudentDetail] = useState<StudentDetailData | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetch('/api/school-admin/dashboard')
            .then(r => {
                if (!r.ok) { if (r.status === 401 || r.status === 403) router.push('/login'); throw new Error() }
                return r.json()
            })
            .then(setData)
            .catch(e => setError(e.message || 'Error'))
            .finally(() => setLoading(false))
    }, [router])

    useEffect(() => {
        if (!selectedStudentId) return
        setLoadingDetail(true)
        setStudentDetail(null)
        fetch(`/api/school-admin/students/${selectedStudentId}`)
            .then(r => r.json())
            .then(d => {
                setStudentDetail(d)
                setIsDrawerOpen(true)
            })
            .catch(console.error)
            .finally(() => setLoadingDetail(false))
    }, [selectedStudentId])

    const filteredStudents = useMemo(() => {
        if (!data) return []
        return [...data.students]
            .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0
                if (typeof av === 'string') return sortDir === 'asc' ? (av as string).localeCompare(bv as string) : (bv as string).localeCompare(av as string)
                return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
            })
    }, [data, search, sortKey, sortDir])

    const toggleSort = (key: typeof sortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('desc') }
    }

    if (loading) return <PageLoader />

    if (error || !data) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Shield size={64} color="#dc2626" />
                    <h2 style={{ marginTop: 24, color: '#0f172a' }}>Algo salió mal</h2>
                    <p style={{ color: '#64748b', marginBottom: 24 }}>{error || 'No se pudo cargar la información.'}</p>
                    <button onClick={() => window.location.reload()}
                        style={{ padding: '12px 28px', background: '#0F62FE', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, cursor: 'pointer' }}>
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    const diagScore = data.kpis.diagnosticStats.avgScore
    const roi = data.kpis.institutionalROI
    const atRisk = data.kpis.studentsAtRisk
    const engagementRate = data.kpis.totalStudents > 0
        ? Math.round((data.students.filter(s => (s.averageProgress ?? 0) > 20).length / data.kpis.totalStudents) * 100)
        : 0

    // Synthetic per-category scores from strengths/weaknesses for demo bar chart
    const ALL_CATEGORIES = ['Educación', 'Ahorro', 'Mentalidad', 'Objetivos', 'Deuda', 'Entorno', 'Crédito', 'Aprendizaje', 'Gastos', 'Gestión']
    const categoryData = ALL_CATEGORIES.map(cat => {
        const isStrength = data.kpis.diagnosticStats.strengths.includes(cat)
        const isWeakness = data.kpis.diagnosticStats.weaknesses.includes(cat)
        const base = diagScore
        return { label: cat, score: isStrength ? Math.min(100, base + 20) : isWeakness ? Math.max(0, base - 25) : base }
    })
    categoryData.sort((a, b) => b.score - a.score)

    const kpis = [
        { id: 'students', label: 'Alumnos Activos', value: data.kpis.totalStudents, icon: <Users size={20} />, accent: '#0F62FE', sub: `${engagementRate}% con progreso`, change: engagementRate, positive: true },
        { id: 'lessons', label: 'Lecciones Completadas', value: data.kpis.totalCompletedLessons, icon: <BookOpen size={20} />, accent: '#7c3aed', sub: `${data.kpis.avgModulesCompleted} prom. / alumno`, change: null, positive: true },
        { id: 'roi', label: 'Market ROI', value: Math.abs(roi), decimals: 1, suffix: '%', prefix: roi < 0 ? '-' : '+', icon: <TrendingUp size={20} />, accent: roi >= 0 ? '#059669' : '#dc2626', sub: 'Portafolios simulados', positive: roi >= 0 },
        { id: 'quiz', label: 'Intentos por Quiz', value: data.kpis.avgAttemptsPerQuiz, decimals: 1, icon: <Target size={20} />, accent: '#d97706', sub: 'Promedio hasta aprobar', positive: data.kpis.avgAttemptsPerQuiz <= 2 },
        { id: 'risk', label: 'En Riesgo', value: atRisk, icon: atRisk > 0 ? <AlertTriangle size={20} /> : <Activity size={20} />, accent: atRisk > 0 ? '#ef4444' : '#64748b', sub: 'Inactivos > 3 días', positive: atRisk === 0 },
    ]

    return (
        <div className="adm-root" style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <style>{`
                .adm-root { padding-left: 0 !important; }
                @media (max-width: 1160px) { .adm-root { padding-left: 0 !important; } }
                @media (max-width: 767px) { .adm-root { padding-left: 0 !important; padding-bottom: 90px !important; } }

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
                    50% { box-shadow: 0 0 0 6px rgba(239,68,68,0.18); }
                }

                .kpi-card { animation: fadeSlideUp 0.45s ease both; cursor: default; }
                .student-row { transition: background 0.15s; }
                .row-btn { opacity: 1; transition: opacity 0.2s ease; }
                .sort-th { cursor: pointer; user-select: none; }
                .risk-banner { animation: glowPulse 2s ease infinite; }
                .search-inp:focus { border-color: #0F62FE !important; box-shadow: 0 0 0 3px rgba(15,98,254,0.12) !important; outline: none; }
            `}</style>

            <div style={{ padding: 'clamp(20px, 3vw, 44px)', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>

                {/* ── HERO HEADER ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    borderRadius: 20, padding: 'clamp(24px,3vw,36px) clamp(28px,4vw,48px)',
                    marginBottom: 24, position: 'relative', overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
                    animation: 'fadeSlideUp 0.4s ease both',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
                }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 75% 50%, rgba(15,98,254,0.12) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(124,58,237,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0F62FE', boxShadow: '0 0 8px #0F62FE' }} />
                            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Panel Institucional · BIZEN</span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
                            Panel de Control
                        </h1>
                        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                            {data.school || 'Tu Institución'} · Actualizado hace unos momentos
                        </p>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 10 }}>
                        <button onClick={() => generateImpactReport(data)}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#0F62FE', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(15, 98, 254, 0.3)' }}>
                            <FileText size={14} /> Reporte Ejecutivo
                        </button>
                        <button onClick={() => exportCSV(data.students)}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Download size={14} /> Exportar CSV
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
                            <Shield size={13} color="rgba(255,255,255,0.35)" />
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Acceso administrativo</span>
                        </div>
                    </div>
                </div>

                {/* ── RISK BANNER ── */}
                {atRisk > 0 && (
                    <div className="risk-banner" style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        border: '1px solid #fecaca', borderRadius: 16,
                        padding: '14px 22px', marginBottom: 24,
                        animation: 'fadeSlideUp 0.45s ease 0.1s both'
                    }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <AlertTriangle size={18} color="#fff" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#991b1b' }}>
                                {atRisk} alumno{atRisk !== 1 ? 's' : ''} en riesgo de deserción
                            </div>
                            <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 2 }}>
                                Sin actividad por más de 3 días. Se recomienda enviar un recordatorio personalizado.
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            Ver alumnos <ArrowUpRight size={12} />
                        </div>
                    </div>
                )}

                {/* ── KPI GRID ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {kpis.map((kpi, i) => (
                        <div key={kpi.id} className="kpi-card" style={{
                            background: '#fff', borderRadius: 20, padding: '20px 22px',
                            border: '1px solid #e8edf4',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                            animationDelay: `${i * 0.06}s`,
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Accent border top */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: kpi.accent, borderRadius: '20px 20px 0 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${kpi.accent}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.accent }}>
                                    {kpi.icon}
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                                    background: kpi.positive ? '#f0fdf4' : '#fef2f2',
                                    color: kpi.positive ? '#059669' : '#dc2626',
                                    textTransform: 'uppercase', letterSpacing: '0.06em'
                                }}>
                                    {kpi.positive ? '↑ Bien' : '↓ Atención'}
                                </span>
                            </div>

                            <div style={{ fontSize: 'clamp(26px,2.5vw,34px)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>
                                {(kpi as any).prefix && <span style={{ fontSize: '0.7em', color: kpi.accent }}>{(kpi as any).prefix}</span>}
                                {mounted ? <AnimatedCounter value={kpi.value} decimals={(kpi as any).decimals ?? 0} /> : kpi.value}
                                {(kpi as any).suffix && <span style={{ fontSize: '0.5em', color: '#94a3b8', marginLeft: 2 }}>{(kpi as any).suffix}</span>}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{kpi.sub}</div>
                        </div>
                    ))}
                </div>
                
                {/* ── DAILY CHALLENGE PREVIEW ── */}
                <div style={{ marginBottom: 24, animation: 'fadeSlideUp 0.5s ease 0.1s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#fef2f2,#fee2e2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Target size={14} color="#ef4444" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>Misión del Día (Vista Previa)</span>
                    </div>
                    <DailyChallengeWidget />
                </div>

                {/* ── DIAGNOSTIC + COMMUNITY GRID ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.8fr', gap: 20, marginBottom: 24 }}>

                    {/* Diagnostic Card (wider) */}
                    <div style={{
                        background: '#fff', borderRadius: 24, padding: 28,
                        border: '1px solid #e8edf4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        animation: 'fadeSlideUp 0.5s ease 0.15s both'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(15,98,254,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F62FE' }}>
                                    <Brain size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Diagnóstico Financiero</h3>
                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>
                                        {data.kpis.diagnosticStats.participation > 0 ? `${data.kpis.diagnosticStats.participation} participantes` : 'Sin participaciones aún'}
                                    </p>
                                </div>
                            </div>
                            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: '#f0f7ff', color: '#0F62FE', fontWeight: 600 }}>
                                IQ Financiero
                            </span>
                        </div>

                        {data.kpis.diagnosticStats.participation === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                                <Brain size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                                <p style={{ margin: 0, fontSize: 14 }}>Aún no hay alumnos que hayan completado el diagnóstico</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'start' }}>
                                {/* Gauge */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                    <RadialGauge score={diagScore} />
                                    <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', maxWidth: 110 }}>
                                        {diagScore >= 70 ? '🟢 Muy buena madurez' : diagScore >= 40 ? '🟡 En desarrollo' : '🔴 Requiere atención'}
                                    </div>
                                </div>

                                {/* Category bars */}
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                                        Desempeño por Categoría
                                    </div>
                                    {categoryData.map(c => <CategoryBar key={c.label} label={c.label} score={c.score} />)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Community Leaders */}
                    <div style={{
                        background: '#fff', borderRadius: 24, padding: 28,
                        border: '1px solid #e8edf4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        animation: 'fadeSlideUp 0.5s ease 0.2s both'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                                <Star size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Líderes</h3>
                                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>Top alumnos por XP</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {data.communityLeaders.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>Sin datos aún</p>
                            ) : data.communityLeaders.map((leader, i) => {
                                const av = avatarColor(leader.name)
                                const medals = ['🥇', '🥈', '🥉']
                                return (
                                    <div key={leader.name} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '10px 14px', borderRadius: 14,
                                        background: i === 0 ? 'linear-gradient(135deg, #faf5ff, #f3e8ff)' : '#f8fafc',
                                        border: i === 0 ? '1px solid #e9d5ff' : '1px solid transparent',
                                        transition: 'transform 0.2s'
                                    }}>
                                        <span style={{ fontSize: 18, width: 24 }}>{medals[i] || `#${i + 1}`}</span>
                                        <div style={{ width: 34, height: 34, borderRadius: 10, background: av.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: av.fg }}>
                                            {leader.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leader.name}</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{leader.xp.toLocaleString()} XP</div>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#7c3aed' }}>{Math.round(leader.reputation)}</div>
                                            <div style={{ fontSize: 9, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>pts</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── STUDENT ROSTER ── */}
                <div style={{
                    background: '#fff', borderRadius: 24, border: '1px solid #e8edf4',
                    overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    animation: 'fadeSlideUp 0.5s ease 0.25s both'
                }}>
                    {/* Toolbar */}
                    <div style={{ padding: '22px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                Listado de Alumnos
                                <span style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#1d4ed8', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                                    {data.students.length}
                                </span>
                                {atRisk > 0 && (
                                    <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <AlertTriangle size={10} /> {atRisk} en riesgo
                                    </span>
                                )}
                            </h2>
                            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>Haz clic en los encabezados para ordenar</p>
                        </div>

                        <div style={{ flex: '1 1 260px', maxWidth: 320, position: 'relative' }}>
                            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input type="text" placeholder="Buscar alumno..." value={search} onChange={e => setSearch(e.target.value)}
                                className="search-inp"
                                style={{ width: '100%', padding: '9px 14px 9px 38px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', background: '#f8fafc', boxSizing: 'border-box', transition: 'all 0.2s' }} />
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                    {[
                                        { label: 'Alumno', key: 'name' },
                                        { label: 'Nivel', key: 'level' },
                                        { label: 'XP Total', key: 'xp' },
                                        { label: 'Progreso', key: 'averageProgress' },
                                        { label: 'Última Actividad', key: null },
                                        { label: '', key: null }
                                    ].map((col, i) => (
                                        <th key={i}
                                            className={col.key ? 'sort-th' : ''}
                                            onClick={() => col.key && toggleSort(col.key as any)}
                                            style={{
                                                padding: '13px 20px', fontSize: 11, fontWeight: 600,
                                                color: sortKey === col.key ? '#0F62FE' : '#94a3b8',
                                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                                textAlign: i === 5 ? 'right' : 'left',
                                                transition: 'color 0.15s'
                                            }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                {col.label}
                                                {col.key && sortKey === col.key && (
                                                    sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                                )}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => {
                                    const lvl = getLevelMeta(student.level)
                                    const progress = student.averageProgress ?? 0
                                    const progressColor = progress >= 70 ? '#10b981' : progress >= 40 ? '#0F62FE' : '#f59e0b'
                                    const av = avatarColor(student.name)
                                    const lastActiveDate = student.lastActive ? new Date(student.lastActive) : null
                                    const isAtRisk = lastActiveDate && (Date.now() - lastActiveDate.getTime() > 3 * 86400000)

                                    return (
                                        <tr key={student.id} className="student-row"
                                            style={{ borderBottom: '1px solid #f8fafc', background: isAtRisk ? '#fffbfb' : 'white', transition: 'background 0.15s' }}>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                                                    <div style={{ width: 38, height: 38, borderRadius: 12, background: av.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: av.fg, flexShrink: 0, position: 'relative' }}>
                                                        {student.name.charAt(0).toUpperCase()}
                                                        {isAtRisk && <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff' }} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{student.name}</div>
                                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{student.completedLessonsCount} lección{student.completedLessonsCount !== 1 ? 'es' : ''} completada{student.completedLessonsCount !== 1 ? 's' : ''}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', background: lvl.bg, color: lvl.color, padding: '4px 11px', borderRadius: 8, fontSize: 11, fontWeight: 600, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                                                    {lvl.label}
                                                    <span style={{ marginLeft: 5, opacity: 0.75, fontSize: 10 }}>Lv.{student.level}</span>
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Zap size={13} color="#f59e0b" />
                                                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 13 }}>{student.xp.toLocaleString()}</span>
                                                    <span style={{ fontSize: 11, color: '#94a3b8' }}>XP</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px', minWidth: 150 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ flex: 1, height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                                                        <div style={{ width: `${progress}%`, height: '100%', background: progressColor, borderRadius: 99, transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)' }} />
                                                    </div>
                                                    <span style={{ fontSize: 12, fontWeight: 700, color: progressColor, minWidth: 34, textAlign: 'right' }}>{progress}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: isAtRisk ? '#ef4444' : '#10b981', boxShadow: isAtRisk ? '0 0 6px #ef4444' : '0 0 6px #10b981' }} />
                                                    <span style={{ fontSize: 12, color: isAtRisk ? '#dc2626' : '#64748b', fontWeight: isAtRisk ? 600 : 400 }}>
                                                        {lastActiveDate ? relativeTime(student.lastActive!) : 'Nunca'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                                <button 
                                                    className="row-btn" 
                                                    onClick={() => setSelectedStudentId(student.id)}
                                                    disabled={loadingDetail && selectedStudentId === student.id}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                                        border: 'none', color: '#1d4ed8',
                                                        fontSize: 12, fontWeight: 600,
                                                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                                        padding: '7px 13px', borderRadius: 10,
                                                        opacity: (loadingDetail && selectedStudentId === student.id) ? 0.6 : undefined
                                                    }}>
                                                    {loadingDetail && selectedStudentId === student.id ? 'Cargando...' : <>Ver detalle <ChevronRight size={13} /></>}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '56px 24px', textAlign: 'center' }}>
                                            <Search size={44} style={{ margin: '0 auto 14px', color: '#cbd5e1' }} />
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Sin resultados</div>
                                            <div style={{ fontSize: 13, color: '#94a3b8' }}>No hay alumnos que coincidan con "{search}"</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    {filteredStudents.length > 0 && (
                        <div style={{ padding: '14px 28px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                Mostrando <strong style={{ color: '#0f172a' }}>{filteredStudents.length}</strong> de <strong style={{ color: '#0f172a' }}>{data.students.length}</strong> alumnos
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {[['#10b981', '≥ 70%'], ['#0F62FE', '40–70%'], ['#f59e0b', '< 40%']].map(([c, l]) => (
                                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* ── STUDENT DETAIL DRAWER ── */}
            {isDrawerOpen && studentDetail && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
                    {/* Backdrop */}
                    <div 
                        onClick={() => setIsDrawerOpen(false)}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} 
                    />
                    
                    {/* Panel */}
                    <div style={{ 
                        position: 'relative', width: 'clamp(320px, 80vw, 520px)', height: '100%', 
                        background: '#fff', borderLeft: '1px solid #e2e8f0', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
                        display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease both'
                    }}>
                        <style>{`
                            @keyframes slideInRight {
                                from { transform: translateX(100%); }
                                to { transform: translateX(0); }
                            }
                        `}</style>
                        
                        {/* Drawer Header */}
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc, #fff)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ 
                                    width: 52, height: 52, borderRadius: 16, 
                                    background: avatarColor(studentDetail.profile.name).bg, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 20, fontWeight: 700, color: avatarColor(studentDetail.profile.name).fg
                                }}>
                                    {studentDetail.profile.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{studentDetail.profile.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: '#0F62FE', background: '#eff6ff', padding: '2px 8px', borderRadius: 6 }}>Estudiante</span>
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>ID: {selectedStudentId?.slice(0, 8)}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} style={{ border: 'none', background: '#f1f5f9', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            
                            {/* Personal KPIs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 16, border: '1px solid #eef2f6' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F62FE', marginBottom: 8 }}>
                                        <Zap size={14} /> <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Puntaje Total</span>
                                    </div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{studentDetail.profile.xp.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 400, color: '#94a3b8' }}>XP</span></div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 16, border: '1px solid #eef2f6' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7c3aed', marginBottom: 8 }}>
                                        <Wallet size={14} /> <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>BizenCoins</span>
                                    </div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{studentDetail.profile.bizcoins.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 400, color: '#94a3b8' }}>BZ</span></div>
                                </div>
                            </div>

                            {/* Section: Academic Performance */}
                            <div style={{ marginBottom: 32 }}>
                                <h5 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Target size={16} color="#0F62FE" /> Desempeño Académico
                                </h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: 13, color: '#64748b' }}>Progreso de la Ruta</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F62FE' }}>{studentDetail.metrics.totalProgress}%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: 13, color: '#64748b' }}>Quizzes Aprobados</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{studentDetail.metrics.avgQuizScore}% Avg.</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: 13, color: '#64748b' }}>Lecciones Completadas</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{studentDetail.metrics.lessonsCompleted}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Simulator & Stocks */}
                            <div style={{ marginBottom: 32 }}>
                                <h5 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Briefcase size={16} color="#7c3aed" /> Simulador de Inversión
                                </h5>
                                {studentDetail.simulator ? (
                                    <div style={{ padding: 20, borderRadius: 16, background: '#7c3aed0a', border: '1px solid #7c3aed1a' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                            <span style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>Crecimiento del Portafolio</span>
                                            <span style={{ fontSize: 18, fontWeight: 800, color: Number(studentDetail.simulator.roi) >= 0 ? '#059669' : '#dc2626' }}>
                                                {Number(studentDetail.simulator.roi) >= 0 ? '+' : ''}{studentDetail.simulator.roi}%
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #7c3aed10' }}>
                                                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>Acciones</div>
                                                <div style={{ fontSize: 15, fontWeight: 700 }}>{studentDetail.simulator.holdingsCount}</div>
                                            </div>
                                            <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #7c3aed10' }}>
                                                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>Efectivo</div>
                                                <div style={{ fontSize: 15, fontWeight: 700 }}>${Math.round(studentDetail.simulator.cash).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>El alumno aún no ha iniciado el simulador de bolsa.</p>
                                )}
                            </div>

                            {/* Section: Diagnostic Initial */}
                            <div style={{ marginBottom: 32 }}>
                                <h5 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Brain size={16} color="#0F62FE" /> Diagnóstico Inicial
                                </h5>
                                {studentDetail.diagnostic ? (
                                    <div style={{ padding: 18, borderRadius: 16, background: '#f0f7ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Puntaje Obtenido</div>
                                            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F62FE' }}>{studentDetail.diagnostic.score}%</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Completado en</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                                                {new Date(studentDetail.diagnostic.completedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Este alumno aún no ha realizado el diagnóstico inicial.</p>
                                )}
                            </div>

                            {/* Section: Social & Forum */}
                            <div style={{ marginBottom: 32 }}>
                                <h5 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <MessageCircle size={16} color="#d97706" /> Actividad en Comunidad
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                    <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9' }}>
                                        <div style={{ fontSize: 18, fontWeight: 700 }}>{studentDetail.social.posts}</div>
                                        <div style={{ fontSize: 10, color: '#94a3b8' }}>Temas</div>
                                    </div>
                                    <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9' }}>
                                        <div style={{ fontSize: 18, fontWeight: 700 }}>{studentDetail.social.comments}</div>
                                        <div style={{ fontSize: 10, color: '#94a3b8' }}>Respuestas</div>
                                    </div>
                                    <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9' }}>
                                        <div style={{ fontSize: 18, fontWeight: 700 }}>{studentDetail.social.reputation}</div>
                                        <div style={{ fontSize: 10, color: '#94a3b8' }}>Reputación</div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Drawer Footer */}
                        <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <button 
                                onClick={() => router.push(`/admin/users?id=${selectedStudentId}`)}
                                style={{ width: '100%', padding: '12px', background: '#0F62FE', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            >
                                <ChevronRight size={18} /> Gestionar Perfil Completo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
