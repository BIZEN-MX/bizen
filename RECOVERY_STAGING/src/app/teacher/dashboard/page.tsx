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
        <svg width={120} height={120} viewBox="0 0 120 120" className="drop-shadow-sm">
            <circle cx={60} cy={60} r={r} fill="none" stroke="#f1f5f9" strokeWidth={10} />
            <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={10}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }} />
            <text x={60} y={56} textAnchor="middle" fill={color} fontSize={24} fontWeight={800}>{cap}</text>
            <text x={60} y={72} textAnchor="middle" fill="#94a3b8" fontSize={10} className="uppercase font-semibold tracking-widest">de 100</text>
        </svg>
    )
}

function CategoryBar({ label, score, max = 100 }: { label: string; score: number; max?: number }) {
    const pct = Math.round((score / max) * 100)
    const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444'
    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-600">{label}</span>
                <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-sm mx-auto">
                    <Shield size={56} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Algo salió mal</h2>
                    <p className="text-sm text-slate-500 mb-6">{error || 'No se pudo cargar la información.'}</p>
                    <button onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm transition-colors hover:bg-blue-700 shadow-sm">
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
        <div className="adm-root min-h-screen bg-slate-50 relative pb-10">
            <style>{`
                .adm-root { padding-left: 0 !important; }
                @media (max-width: 1160px) { .adm-root { padding-left: 0 !important; } }
                @media (max-width: 767px) { .adm-root { padding-left: 0 !important; padding-bottom: 90px !important; } }

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); border-color: rgba(254, 202, 202, 1); }
                    50% { box-shadow: 0 0 0 4px rgba(239,68,68,0.15); border-color: rgba(248, 113, 113, 0.5); }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .animate-fadeSlideUp { animation: fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-glowPulse { animation: glowPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .search-inp:focus { border-color: #0F62FE !important; box-shadow: 0 0 0 3px rgba(15,98,254,0.12) !important; outline: none; }
            `}</style>

            <div className="px-5 md:px-8 lg:px-11 max-w-[1440px] mx-auto box-border pt-8 md:pt-10">

                {/* ── HERO HEADER ── */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 md:p-10 mb-8 relative overflow-hidden shadow-xl shadow-slate-200 space-y-6 animate-fadeSlideUp flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_75%_50%,rgba(15,98,254,0.15)_0%,transparent_65%),radial-gradient(ellipse_at_20%_80%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />

                    <div className="relative z-10 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="text-[10px] md:text-xs font-bold text-white/50 tracking-[0.15em] uppercase">Panel Institucional · BIZEN</span>
                        </div>
                        <h1 className="m-0 text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                            Panel de Control
                        </h1>
                        <p className="m-0 mt-2 text-sm text-white/60 font-medium">
                            {data.school || 'Tu Institución'} · Actualizado hace unos momentos
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-3">
                        <button onClick={() => generateImpactReport(data)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-white text-sm font-semibold cursor-pointer transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/30">
                            <FileText size={16} /> Reporte Ejecutivo
                        </button>
                        <button onClick={() => exportCSV(data.students)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-white/90 text-sm font-medium cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Download size={16} /> Exportar CSV
                        </button>
                        <div className="hidden sm:flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                            <Shield size={14} className="text-white/40" />
                            <span className="text-xs text-white/50 font-medium">Acceso Admin</span>
                        </div>
                    </div>
                </div>

                {/* ── RISK BANNER ── */}
                {atRisk > 0 && (
                    <div className="animate-glowPulse flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-2xl px-5 sm:px-6 py-4 mb-8 shadow-sm animate-fadeSlideUp" style={{ animationDelay: '0.1s' }}>
                        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shrink-0 shadow-inner">
                            <AlertTriangle size={22} className="text-white drop-shadow-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-base font-bold text-red-900 leading-snug">
                                {atRisk} alumno{atRisk !== 1 ? 's' : ''} en riesgo de deserción
                            </div>
                            <div className="text-sm font-medium text-red-700/80 mt-0.5 truncate md:whitespace-normal">
                                Sin actividad por más de 3 días. Se recomienda enviar notificaciones pronto.
                            </div>
                        </div>
                        <button 
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 border border-red-200 rounded-lg text-sm font-semibold text-red-800 flex items-center gap-1.5 transition-colors"
                        >
                            Ver alumnos <ArrowUpRight size={14} />
                        </button>
                    </div>
                )}

                {/* ── KPI GRID ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                    {kpis.map((kpi, i) => (
                        <div key={kpi.id} 
                             className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden animate-fadeSlideUp group" 
                             style={{ animationDelay: `${i * 0.05}s` }}>
                            
                            {/* Accent border top */}
                            <div className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5" style={{ background: kpi.accent }} />

                            <div className="flex justify-between items-start mb-4">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${kpi.accent}15`, color: kpi.accent }}>
                                    {kpi.icon}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${kpi.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {kpi.positive ? '↑ Bien' : '↓ Atención'}
                                </span>
                            </div>

                            <div className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
                                {(kpi as any).prefix && <span className="text-[0.65em] font-bold mr-0.5 align-baseline" style={{ color: kpi.accent }}>{(kpi as any).prefix}</span>}
                                {mounted ? <AnimatedCounter value={kpi.value} decimals={(kpi as any).decimals ?? 0} /> : kpi.value}
                                {(kpi as any).suffix && <span className="text-[0.6em] font-medium text-slate-400 ml-0.5 align-baseline">{(kpi as any).suffix}</span>}
                            </div>
                            <div className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-widest">{kpi.label}</div>
                            <div className="text-[11.5px] font-medium text-slate-400 truncate">{kpi.sub}</div>
                        </div>
                    ))}
                </div>
                
                {/* ── DAILY CHALLENGE PREVIEW ── */}
                <div className="mb-8 animate-fadeSlideUp" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <Target size={16} className="text-red-500" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">Misión del Día (Previo)</span>
                    </div>
                    <DailyChallengeWidget dashboardPreviewMode={true} />
                </div>

                {/* ── DIAGNOSTIC + COMMUNITY GRID ── */}
                <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.8fr] gap-5 mb-8">

                    {/* Diagnostic Card (wider) */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm animate-fadeSlideUp" style={{ animationDelay: '0.2s' }}>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Brain size={24} />
                                </div>
                                <div>
                                    <h3 className="m-0 text-lg font-bold text-slate-900">Diagnóstico Financiero</h3>
                                    <p className="m-0 mt-1 text-sm font-medium text-slate-500">
                                        {data.kpis.diagnosticStats.participation > 0 ? `${data.kpis.diagnosticStats.participation} participantes en total` : 'Sin participaciones aún'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold uppercase tracking-wider">
                                IQ Financiero Global
                            </span>
                        </div>

                        {data.kpis.diagnosticStats.participation === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Brain size={48} className="mb-4 mx-auto opacity-20" />
                                <p className="m-0 text-sm font-medium">Aún no hay alumnos que hayan completado el diagnóstico</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
                                {/* Gauge */}
                                <div className="flex flex-col items-center gap-3 w-full md:w-auto mt-2">
                                    <RadialGauge score={diagScore} />
                                    <div className="text-xs font-semibold text-slate-500 text-center uppercase tracking-wide">
                                        {diagScore >= 70 ? '🟢 Muy buena madurez' : diagScore >= 40 ? '🟡 En desarrollo' : '🔴 Requiere atención'}
                                    </div>
                                </div>

                                {/* Category bars */}
                                <div className="w-full">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                                        Desempeño Promedio por Categoría
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                                        {categoryData.map(c => <CategoryBar key={c.label} label={c.label} score={c.score} />)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Community Leaders */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm animate-fadeSlideUp flex flex-col" style={{ animationDelay: '0.25s' }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Star size={24} />
                            </div>
                            <div>
                                <h3 className="m-0 text-lg font-bold text-slate-900">Cuadro de Honor</h3>
                                <p className="m-0 mt-1 text-sm font-medium text-slate-500">Top estudiantes en XP</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                            {data.communityLeaders.length === 0 ? (
                                <p className="text-slate-400 font-medium text-sm text-center py-10 m-0">Aún no hay puntuaciones registradas</p>
                            ) : data.communityLeaders.map((leader, i) => {
                                const av = avatarColor(leader.name)
                                const medals = ['🥇', '🥈', '🥉']
                                const isFirst = i === 0;
                                return (
                                    <div key={leader.name} className={`flex items-center gap-3.5 p-3 px-4 rounded-2xl transition-all hover:scale-[1.01] border ${isFirst ? 'bg-gradient-to-r from-purple-50 to-white border-purple-200 shadow-sm' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'}`}>
                                        <span className={`w-7 text-center font-bold ${!medals[i] && 'text-slate-400'}`}>
                                            {medals[i] ? <span className="text-2xl drop-shadow-sm">{medals[i]}</span> : `#${i + 1}`}
                                        </span>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm" style={{ background: av.bg, color: av.fg }}>
                                            {leader.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-slate-900 truncate">{leader.name}</div>
                                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{leader.xp.toLocaleString()} XP</div>
                                        </div>
                                        <div className="text-right shrink-0 bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="text-[13px] font-black text-purple-600">{Math.round(leader.reputation)}</div>
                                            <div className="text-[9px] font-bold text-purple-400 uppercase tracking-widest leading-none">Pts</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── STUDENT ROSTER ── */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fadeSlideUp" style={{ animationDelay: '0.3s' }}>
                    {/* Toolbar */}
                    <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-100 flex justify-between items-center flex-col sm:flex-row gap-5">
                        <div className="w-full sm:w-auto">
                            <h2 className="text-xl font-bold text-slate-900 m-0 flex flex-wrap items-center gap-3">
                                Listado General de Alumnos
                                <span className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                                    {data.students.length} Total
                                </span>
                                {atRisk > 0 && (
                                    <span className="bg-red-50 border border-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                        <AlertTriangle size={12} strokeWidth={2.5} /> {atRisk} en riesgo
                                    </span>
                                )}
                            </h2>
                            <p className="m-0 mt-1.5 text-sm font-medium text-slate-500">Selecciona los encabezados para ordenar la tabla.</p>
                        </div>

                        <div className="w-full sm:w-80 relative">
                            <Search size={16} className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input type="text" placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)}
                                className="search-inp w-full py-3 pr-4 pl-11 rounded-xl border-2 border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 transition-all placeholder:text-slate-400 placeholder:font-normal hover:border-slate-300" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80">
                                    {[
                                        { label: 'Alumno / Progreso', key: 'name' },
                                        { label: 'Nivel Actual', key: 'level' },
                                        { label: 'Puntaje XP', key: 'xp' },
                                        { label: 'Ruta de Aprendizaje', key: 'averageProgress' },
                                        { label: 'Última Conexión', key: null },
                                        { label: '', key: null }
                                    ].map((col, i) => (
                                        <th key={i}
                                            className={`py-4 px-6 text-xs font-bold uppercase tracking-widest transition-colors ${col.key ? 'sort-th cursor-pointer hover:bg-slate-100/80' : ''} ${i === 5 ? 'text-right' : 'text-left'} ${sortKey === col.key ? 'text-[#0F62FE] bg-blue-50/30' : 'text-slate-500'}`}
                                            onClick={() => col.key && toggleSort(col.key as any)}>
                                            <span className={`inline-flex items-center gap-1.5 ${i === 5 && 'justify-end w-full'}`}>
                                                {col.label}
                                                {col.key && sortKey === col.key && (
                                                    sortDir === 'asc' ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />
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
                                        <tr key={student.id} className={`student-row border-b border-slate-100 ${isAtRisk ? 'bg-red-50/20 hover:bg-red-50/60' : 'bg-white hover:bg-slate-50/80'} transition-colors`}>
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 relative shadow-sm border border-slate-100" style={{ background: av.bg, color: av.fg }}>
                                                        {student.name.charAt(0).toUpperCase()}
                                                        {isAtRisk && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white pointer-events-none" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{student.name}</div>
                                                        <div className="text-xs font-medium text-slate-500 mt-0.5">{student.completedLessonsCount} lección{student.completedLessonsCount !== 1 ? 'es' : ''} lista{student.completedLessonsCount !== 1 ? 's' : ''}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm" style={{ background: lvl.bg, color: lvl.color }}>
                                                    {lvl.label}
                                                    <span className="ml-2 font-semibold opacity-75 text-[10px] tracking-wider">LVL.{student.level}</span>
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg w-max">
                                                    <Zap size={14} className="text-amber-500" strokeWidth={2.5} />
                                                    <span className="font-extrabold text-slate-900 text-sm">{student.xp.toLocaleString()}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">XP</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 min-w-[180px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%`, background: progressColor }} />
                                                    </div>
                                                    <span className="text-xs font-extrabold min-w-[38px] text-right" style={{ color: progressColor }}>{progress}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${isAtRisk ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                    <span className={`text-xs ${isAtRisk ? 'text-red-700 font-bold' : 'text-slate-600 font-medium'}`}>
                                                        {lastActiveDate ? relativeTime(student.lastActive!) : 'Nunca'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <button 
                                                    className="row-btn inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                                                    onClick={() => setSelectedStudentId(student.id)}
                                                    disabled={loadingDetail && selectedStudentId === student.id}
                                                >
                                                    {loadingDetail && selectedStudentId === student.id ? 'Cargando...' : <>Ver ficha <ChevronRight size={14} strokeWidth={2.5} className="text-blue-400" /></>}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="py-16 px-6 text-center bg-slate-50/30">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                                                <Search size={28} className="text-slate-400" />
                                            </div>
                                            <div className="text-lg font-bold text-slate-900 mb-1">Sin resultados</div>
                                            <div className="text-sm font-medium text-slate-500">No hay alumnos que coincidan con la búsqueda "{search}"</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    {filteredStudents.length > 0 && (
                        <div className="px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-wrap gap-4">
                            <span className="text-xs font-medium text-slate-500">
                                Mostrando <strong className="text-slate-900 font-bold">{filteredStudents.length}</strong> de <strong className="text-slate-900 font-bold">{data.students.length}</strong> alumnos
                            </span>
                            <div className="flex items-center gap-5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                                {[['#10b981', '≥ 70%'], ['#0F62FE', '40–70%'], ['#f59e0b', '< 40%']].map(([c, l]) => (
                                    <div key={l} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                                        <span className="text-xs font-bold text-slate-600">{l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* ── STUDENT DETAIL DRAWER ── */}
            {isDrawerOpen && studentDetail && (
                <div className="fixed inset-0 z-[9999] flex justify-end">
                    {/* Backdrop */}
                    <div 
                        onClick={() => setIsDrawerOpen(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" 
                    />
                    
                    {/* Panel */}
                    <div className="relative w-full max-w-[420px] md:max-w-[500px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slideInRight">
                        
                        {/* Drawer Header */}
                        <div className="px-6 md:px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 w-full relative">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black shrink-0 relative shadow-sm border border-slate-100" style={{ background: avatarColor(studentDetail.profile.name).bg, color: avatarColor(studentDetail.profile.name).fg }}>
                                    {studentDetail.profile.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="m-0 text-xl font-bold text-slate-900 tracking-tight leading-tight">{studentDetail.profile.name}</h4>
                                    <div className="flex items-center gap-2.5 mt-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">General</span>
                                        <span className="text-[11px] font-medium text-slate-400">ID: <span className="font-mono">{selectedStudentId?.slice(0, 8)}</span></span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer shrink-0">
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 w-full bg-slate-50/50">
                            
                            {/* Personal KPIs */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-2 text-blue-600 mb-2.5">
                                        <Zap size={16} strokeWidth={2.5} /> <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Puntaje Base</span>
                                    </div>
                                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{studentDetail.profile.xp.toLocaleString()} <span className="text-sm font-semibold text-slate-400">XP</span></div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-2 text-purple-600 mb-2.5">
                                        <Wallet size={16} strokeWidth={2.5} /> <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Monedas</span>
                                    </div>
                                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{studentDetail.profile.bizcoins.toLocaleString()} <span className="text-sm font-semibold text-slate-400">BZ</span></div>
                                </div>
                            </div>

                            {/* Section: Academic Performance */}
                            <div className="mb-8">
                                <h5 className="m-0 mb-4 text-base font-bold text-slate-900 flex items-center gap-2.5">
                                    <Target size={18} className="text-blue-600" strokeWidth={2.5} /> Desempeño Académico
                                </h5>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                                        <span className="text-sm text-slate-600 font-semibold">Progreso de la Ruta</span>
                                        <span className="text-base font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{studentDetail.metrics.totalProgress}%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                                        <span className="text-sm text-slate-600 font-semibold">Desempeño en Quizzes</span>
                                        <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{studentDetail.metrics.avgQuizScore}% Avg</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                                        <span className="text-sm text-slate-600 font-semibold">Lecciones Completadas</span>
                                        <span className="text-base font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{studentDetail.metrics.lessonsCompleted}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Simulator & Stocks */}
                            <div className="mb-8">
                                <span className="flex items-center justify-between mb-4">
                                    <h5 className="m-0 text-base font-bold text-slate-900 flex items-center gap-2.5">
                                        <Briefcase size={18} className="text-purple-600" strokeWidth={2.5} /> Simulador Inversor
                                    </h5>
                                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Premium</span>
                                </span>
                                {studentDetail.simulator ? (
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm">
                                        <div className="flex justify-between items-end mb-5">
                                            <div>
                                                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Crecimiento Actual</div>
                                                <div className="text-sm font-bold text-slate-900">Portafolio Simulado</div>
                                            </div>
                                            <span className={`text-3xl font-black tracking-tight ${Number(studentDetail.simulator.roi) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {Number(studentDetail.simulator.roi) >= 0 ? '+' : ''}{studentDetail.simulator.roi}%
                                            </span>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 bg-white p-4 rounded-xl border border-purple-50 shadow-sm">
                                                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5 line-clamp-1">Acciones Activas</div>
                                                <div className="text-xl font-extrabold text-slate-900">{studentDetail.simulator.holdingsCount}</div>
                                            </div>
                                            <div className="flex-1 bg-white p-4 rounded-xl border border-purple-50 shadow-sm">
                                                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5 flex items-center gap-1 justify-between">
                                                    Liquidez <span className="text-emerald-500 font-extrabold text-lg leading-none">·</span>
                                                </div>
                                                <div className="text-xl font-extrabold text-slate-900">${Math.round(studentDetail.simulator.cash).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
                                        <Briefcase size={24} className="text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-slate-500 m-0">El alumno no ha inicializado su portafolio en simuladores.</p>
                                    </div>
                                )}
                            </div>

                            {/* Section: Diagnostic Initial */}
                            <div className="mb-8">
                                <h5 className="m-0 mb-4 text-base font-bold text-slate-900 flex items-center gap-2.5">
                                    <Brain size={18} className="text-blue-600" strokeWidth={2.5} /> Score Diagnóstico
                                </h5>
                                {studentDetail.diagnostic ? (
                                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                                        <div>
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">IQ Financiero</div>
                                            <div className="text-4xl font-black text-blue-600 tracking-tight leading-none">{studentDetail.diagnostic.score}%</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Evaluación</div>
                                            <div className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                                                {new Date(studentDetail.diagnostic.completedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
                                        <Brain size={24} className="text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-slate-500 m-0">No se ha resuelto el test de diagnóstico financiero.</p>
                                    </div>
                                )}
                            </div>

                            {/* Section: Social & Forum */}
                            <div className="mb-4">
                                <h5 className="m-0 mb-4 text-base font-bold text-slate-900 flex items-center gap-2.5">
                                    <MessageCircle size={18} className="text-amber-500" strokeWidth={2.5} /> Impacto en la Comunidad
                                </h5>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-4 rounded-xl bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                        <div className="text-2xl font-black text-slate-900 leading-none mb-1.5">{studentDetail.social.posts}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temas</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                        <div className="text-2xl font-black text-slate-900 leading-none mb-1.5">{studentDetail.social.comments}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Respuestas</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-50 rounded-bl-full" />
                                        <div className="text-2xl font-black text-amber-600 leading-none mb-1.5 relative z-10">{studentDetail.social.reputation}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">Prestigio</div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Drawer Footer */}
                        <div className="px-6 md:px-8 py-6 border-t border-slate-200 bg-white w-full relative z-10">
                            <button 
                                onClick={() => router.push(`/admin/users?id=${selectedStudentId}`)}
                                className="w-full h-[52px] bg-slate-900 hover:bg-black text-white border-none rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-slate-900/20"
                            >
                                <ChevronRight size={18} strokeWidth={2.5} /> Gestor de Perfil Avanzado
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
