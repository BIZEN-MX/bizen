'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageLoader from '@/components/PageLoader'
import {
    Users, BookOpen, TrendingUp, Zap, Search,
    ChevronRight, User as UserIcon, Award,
    BarChart2, Activity, Shield, Bell
} from 'lucide-react'

interface Student {
    id: string
    name: string
    level: number
    xp: number
    joinedAt: string
    coursesEnrolled: string[]
    completedLessonsCount: number
    averageProgress?: number
}

interface DashboardData {
    school: string
    kpis: {
        totalStudents: number
        avgModulesCompleted: number
        totalCompletedLessons: number
    }
    students: Student[]
}

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0)
    useEffect(() => {
        let start = 0
        const step = value / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= value) { setDisplay(value); clearInterval(timer) }
            else setDisplay(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [value, duration])
    return <>{display.toLocaleString()}</>
}

function getLevelColor(level: number) {
    if (level >= 8) return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', label: '🏆 Experto' }
    if (level >= 5) return { bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', label: '⚡ Avanzado' }
    if (level >= 3) return { bg: 'linear-gradient(135deg, #0F62FE, #2563eb)', color: '#fff', label: '📚 Intermedio' }
    return { bg: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', label: '🌱 Inicio' }
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [mounted, setMounted] = useState(false)
    const now = new Date()
    const hour = now.getHours()
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

    useEffect(() => {
        setMounted(true)
        async function fetchDashboardData() {
            try {
                const res = await fetch('/api/school-admin/dashboard')
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) { router.push('/login'); return }
                    throw new Error('Failed to fetch dashboard data')
                }
                const json = await res.json()
                setData(json)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [router])

    if (loading) return <PageLoader />

    if (error || !data) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 32 }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>⚠️</div>
                    <h2 style={{ fontSize: 24, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Algo salió mal</h2>
                    <p style={{ color: '#64748b', marginBottom: 24 }}>{error || 'No se pudo cargar la información.'}</p>
                    <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #0F62FE, #2563eb)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    const filteredStudents = data.students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const topStudents = [...data.students].sort((a, b) => b.xp - a.xp).slice(0, 3)
    const engagementRate = data.kpis.totalStudents > 0
        ? Math.round((data.students.filter(s => (s.averageProgress ?? 0) > 20).length / data.kpis.totalStudents) * 100)
        : 0

    const kpis = [
        {
            label: 'Alumnos Activos',
            value: data.kpis.totalStudents,
            icon: <Users size={22} />,
            gradient: 'linear-gradient(135deg, #0F62FE 0%, #2563eb 100%)',
            glow: 'rgba(15, 98, 254, 0.3)',
            change: '+2 esta semana',
            positive: true,
        },
        {
            label: 'Lecciones Completadas',
            value: data.kpis.totalCompletedLessons,
            icon: <BookOpen size={22} />,
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            glow: 'rgba(139, 92, 246, 0.3)',
            change: 'Total acumulado',
            positive: true,
        },
        {
            label: 'Módulos Promedio',
            value: data.kpis.avgModulesCompleted,
            icon: <BarChart2 size={22} />,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            glow: 'rgba(16, 185, 129, 0.3)',
            change: 'por alumno',
            positive: true,
        },
        {
            label: 'Tasa de Participación',
            value: engagementRate,
            suffix: '%',
            icon: <Activity size={22} />,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            glow: 'rgba(245, 158, 11, 0.3)',
            change: 'con 20%+ progreso',
            positive: engagementRate >= 50,
        },
    ]

    return (
        <div className="dash-root" style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                .dash-root { padding-left: 280px !important; }
                @media (max-width: 1160px) { .dash-root { padding-left: 220px !important; } }
                @media (max-width: 767px) { .dash-root { padding-left: 0 !important; padding-bottom: 100px !important; } }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0 }
                    100% { background-position: 200% 0 }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(15,98,254,0); }
                    50% { box-shadow: 0 0 20px 4px rgba(15,98,254,0.12); }
                }

                .kpi-card { animation: fadeUp 0.5s ease both; transition: transform 0.25s ease, box-shadow 0.25s ease; }
                .kpi-card:hover { transform: translateY(-4px) scale(1.01); }

                .student-row { transition: background 0.15s ease; }
                .student-row:hover { background: #f0f7ff !important; }
                .student-row:hover .row-action { opacity: 1 !important; transform: translateX(0) !important; }
                .row-action { opacity: 0; transform: translateX(-4px); transition: all 0.2s ease; }

                .search-input:focus { border-color: #0F62FE !important; box-shadow: 0 0 0 3px rgba(15,98,254,0.12) !important; }
                .top-badge { transition: transform 0.2s ease; }
                .top-badge:hover { transform: scale(1.04); }
            `}</style>

            <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 1400, margin: '0 auto', boxSizing: 'border-box' }}>

                {/* ── HERO HEADER ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 40%, #1e3a8a 100%)',
                    borderRadius: 28, padding: 'clamp(28px, 4vw, 48px)',
                    marginBottom: 32, position: 'relative', overflow: 'hidden',
                    boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.5)',
                    animation: 'fadeUp 0.4s ease both'
                }}>
                    {/* Ambient orbs */}
                    <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,98,254,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '30%', right: '25%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 99, padding: '6px 14px', marginBottom: 20 }}>
                                <Shield size={13} color="#93c5fd" />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#93c5fd', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Panel Administrativo</span>
                            </div>
                            <h1 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                {greeting} 👋
                            </h1>
                            <p style={{ margin: '12px 0 0', fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                                <span style={{ color: '#60a5fa', fontWeight: 700 }}>{data.school || 'Tu Institución'}</span> — Visión general del grupo
                            </p>
                        </div>

                        {/* Top 3 Podium */}
                        {topStudents.length > 0 && (
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                                {topStudents.map((s, i) => {
                                    const medals = ['🥇', '🥈', '🥉']
                                    const heights = [72, 56, 48]
                                    return (
                                        <div key={s.id} className="top-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                            <div style={{ fontSize: 18 }}>{medals[i]}</div>
                                            <div style={{
                                                width: 42, height: 42, borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '2px solid rgba(255,255,255,0.15)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 16, fontWeight: 700, color: '#fff'
                                            }}>
                                                {s.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{
                                                width: 40, height: heights[i],
                                                background: i === 0 ? 'rgba(245,158,11,0.3)' : i === 1 ? 'rgba(148,163,184,0.2)' : 'rgba(180,120,80,0.2)',
                                                borderRadius: '8px 8px 0 0',
                                                border: i === 0 ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.1)'
                                            }} />
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── KPI GRID ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
                    {kpis.map((kpi, i) => (
                        <div key={i} className="kpi-card" style={{
                            animationDelay: `${i * 0.08}s`,
                            background: '#fff',
                            borderRadius: 24,
                            padding: '24px 28px',
                            border: '1px solid #e8f0fe',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Subtle top gradient strip */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: kpi.gradient, borderRadius: '24px 24px 0 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: kpi.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff',
                                    boxShadow: `0 8px 20px ${kpi.glow}`
                                }}>
                                    {kpi.icon}
                                </div>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: '4px 10px',
                                    borderRadius: 99, background: kpi.positive ? '#ecfdf5' : '#fef2f2',
                                    color: kpi.positive ? '#059669' : '#dc2626',
                                    letterSpacing: '0.02em'
                                }}>
                                    {kpi.change}
                                </span>
                            </div>
                            <div style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                {mounted ? <AnimatedCounter value={kpi.value} /> : kpi.value}
                                {kpi.suffix && <span style={{ fontSize: '0.65em', marginLeft: 2 }}>{kpi.suffix}</span>}
                            </div>
                            <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {kpi.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── STUDENT ROSTER ── */}
                <div style={{
                    background: '#fff',
                    borderRadius: 24,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    animation: 'fadeUp 0.5s ease 0.3s both'
                }}>
                    {/* Toolbar */}
                    <div style={{ padding: '24px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                Listado de Alumnos
                                <span style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#1d4ed8', padding: '3px 10px', borderRadius: 99, fontSize: 13, fontWeight: 700 }}>
                                    {data.students.length}
                                </span>
                            </h2>
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Seguimiento de progreso individual</p>
                        </div>

                        <div style={{ display: 'flex', gap: 12, flex: '1 1 280px', justifyContent: 'flex-end' }}>
                            <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
                                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Buscar alumno..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                    style={{
                                        width: '100%', padding: '10px 14px 10px 40px',
                                        borderRadius: 12, border: '1.5px solid #e2e8f0',
                                        fontSize: 14, color: '#0f172a', outline: 'none',
                                        transition: 'all 0.2s', background: '#f8fafc',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                    {['Alumno', 'Nivel', 'XP Acumulada', 'Progreso', 'Acción'].map((h, i) => (
                                        <th key={h} style={{
                                            padding: '14px 20px', fontSize: 11, fontWeight: 700,
                                            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em',
                                            textAlign: i === 4 ? 'right' : 'left'
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student, idx) => {
                                        const lvl = getLevelColor(student.level)
                                        const progress = student.averageProgress ?? 0
                                        const progressColor = progress >= 70 ? '#10b981' : progress >= 40 ? '#0F62FE' : '#f59e0b'
                                        return (
                                            <tr key={student.id} className="student-row" style={{ borderBottom: '1px solid #f8fafc', background: 'white', animationDelay: `${idx * 0.03}s` }}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <div style={{
                                                            width: 40, height: 40, borderRadius: 14,
                                                            background: `hsl(${(student.name.charCodeAt(0) * 15) % 360}, 65%, 92%)`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: 15, fontWeight: 700,
                                                            color: `hsl(${(student.name.charCodeAt(0) * 15) % 360}, 55%, 35%)`,
                                                            flexShrink: 0
                                                        }}>
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{student.name}</div>
                                                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{student.coursesEnrolled.length} curso{student.coursesEnrolled.length !== 1 ? 's' : ''} inscrito{student.coursesEnrolled.length !== 1 ? 's' : ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                                        background: lvl.bg, color: lvl.color,
                                                        padding: '5px 12px', borderRadius: 10,
                                                        fontSize: 12, fontWeight: 700,
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                                                    }}>
                                                        Nivel {student.level}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <Zap size={14} color="#f59e0b" />
                                                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>
                                                            {student.xp.toLocaleString()}
                                                        </span>
                                                        <span style={{ fontSize: 12, color: '#94a3b8' }}>XP</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px', minWidth: 160 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                                                            <div style={{
                                                                width: `${progress}%`, height: '100%',
                                                                background: progressColor,
                                                                borderRadius: 99,
                                                                transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)'
                                                            }} />
                                                        </div>
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: progressColor, minWidth: 36, textAlign: 'right' }}>
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <button className="row-action" style={{
                                                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                                        border: 'none', color: '#1d4ed8',
                                                        fontSize: 13, fontWeight: 600,
                                                        cursor: 'pointer',
                                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                                        padding: '7px 14px', borderRadius: 10,
                                                        transition: 'all 0.2s'
                                                    }}>
                                                        Ver detalle <ChevronRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '60px 24px', textAlign: 'center' }}>
                                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                                            <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>Sin resultados</div>
                                            <div style={{ fontSize: 14, color: '#94a3b8' }}>No se encontraron alumnos que coincidan con "{searchTerm}"</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer hint */}
                    {filteredStudents.length > 0 && (
                        <div style={{ padding: '16px 28px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#94a3b8' }}>
                                Mostrando <strong style={{ color: '#0f172a' }}>{filteredStudents.length}</strong> de <strong style={{ color: '#0f172a' }}>{data.students.length}</strong> alumnos
                            </span>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                <span style={{ fontSize: 12, color: '#64748b' }}>Verde = 70%+ progreso</span>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0F62FE', marginLeft: 8 }} />
                                <span style={{ fontSize: 12, color: '#64748b' }}>Azul = 40–70%</span>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', marginLeft: 8 }} />
                                <span style={{ fontSize: 12, color: '#64748b' }}>Amarillo = &lt;40%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
