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
    if (level >= 8) return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', label: 'Experto' }
    if (level >= 5) return { bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', label: 'Avanzado' }
    if (level >= 3) return { bg: 'linear-gradient(135deg, #0F62FE, #2563eb)', color: '#fff', label: 'Intermedio' }
    return { bg: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', label: 'Inicio' }
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [mounted, setMounted] = useState(false)

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
                    <div style={{ fontSize: 64, marginBottom: 24, color: '#dc2626' }}>
                        <Shield size={64} />
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 400, color: '#0f172a', marginBottom: 12 }}>Algo salió mal</h2>
                    <p style={{ color: '#64748b', marginBottom: 24 }}>{error || 'No se pudo cargar la información.'}</p>
                    <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #0F62FE, #2563eb)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 400, cursor: 'pointer' }}>
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
            icon: <Users size={18} />,
            accent: '#0F62FE',
            iconBg: 'rgba(15, 98, 254, 0.08)',
            iconColor: '#0F62FE',
            change: '+2 esta semana',
            positive: true,
        },
        {
            label: 'Lecciones Completadas',
            value: data.kpis.totalCompletedLessons,
            icon: <BookOpen size={18} />,
            accent: '#7c3aed',
            iconBg: 'rgba(124, 58, 237, 0.08)',
            iconColor: '#7c3aed',
            change: 'Total acumulado',
            positive: true,
        },
        {
            label: 'Módulos Promedio',
            value: data.kpis.avgModulesCompleted,
            icon: <BarChart2 size={18} />,
            accent: '#059669',
            iconBg: 'rgba(5, 150, 105, 0.08)',
            iconColor: '#059669',
            change: 'por alumno',
            positive: true,
        },
        {
            label: 'Tasa de Participación',
            value: engagementRate,
            suffix: '%',
            icon: <Activity size={18} />,
            accent: '#d97706',
            iconBg: 'rgba(217, 119, 6, 0.08)',
            iconColor: '#d97706',
            change: 'con 20%+ progreso',
            positive: engagementRate >= 50,
        },
    ]

    return (
        <div className="admin-page-root" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <style>{`
                .admin-page-root { padding-left: 280px !important; }
                @media (max-width: 1160px) { .admin-page-root { padding-left: 220px !important; } }
                @media (max-width: 767px) { .admin-page-root { padding-left: 0 !important; padding-bottom: 100px !important; } }

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
                    background: '#0f172a',
                    borderRadius: 16,
                    padding: 'clamp(24px, 3vw, 36px) clamp(28px, 4vw, 48px)',
                    marginBottom: 28,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
                    animation: 'fadeUp 0.4s ease both',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 20
                }}>
                    {/* Subtle mesh pattern */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(15,98,254,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F62FE' }} />
                            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Panel Institucional</span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 500, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            Panel de Control
                        </h1>
                        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>
                            {data.school || 'Tu Institución'}
                        </p>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 16px' }}>
                        <Shield size={14} color="rgba(255,255,255,0.4)" />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>Acceso administrativo</span>
                    </div>
                </div>

                {/* ── KPI GRID ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                    {kpis.map((kpi, i) => (
                        <div key={i} className="kpi-card" style={{
                            background: kpi.accent,
                            borderRadius: 20,
                            padding: '20px 24px',
                            border: 'none',
                            boxShadow: `0 4px 16px ${kpi.accent}44`,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                        }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 8,
                                    background: 'rgba(255,255,255,0.18)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff',
                                }}>
                                    {kpi.icon}
                                </div>
                                <span style={{
                                    fontSize: 11, fontWeight: 400, padding: '3px 8px',
                                    borderRadius: 6,
                                    background: 'rgba(255,255,255,0.18)',
                                    color: '#fff',
                                    letterSpacing: '0.01em',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {kpi.change}
                                </span>
                            </div>
                            <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 500, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                {mounted ? <AnimatedCounter value={kpi.value} /> : kpi.value}
                                {kpi.suffix && <span style={{ fontSize: '0.6em', marginLeft: 2, color: 'rgba(255,255,255,0.7)' }}>{kpi.suffix}</span>}
                            </div>
                            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
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
                            <h2 style={{ fontSize: 20, fontWeight: 500, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                Listado de Alumnos
                                <span style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#1d4ed8', padding: '3px 10px', borderRadius: 99, fontSize: 13, fontWeight: 500 }}>
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
                                            padding: '14px 20px', fontSize: 11, fontWeight: 500,
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
                                                            fontSize: 15, fontWeight: 500,
                                                            color: `hsl(${(student.name.charCodeAt(0) * 15) % 360}, 55%, 35%)`,
                                                            flexShrink: 0
                                                        }}>
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 400, color: '#0f172a', fontSize: 14 }}>{student.name}</div>
                                                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{student.coursesEnrolled.length} curso{student.coursesEnrolled.length !== 1 ? 's' : ''} inscrito{student.coursesEnrolled.length !== 1 ? 's' : ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                                        background: lvl.bg, color: lvl.color,
                                                        padding: '5px 12px', borderRadius: 10,
                                                        fontSize: 12, fontWeight: 500,
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                                                    }}>
                                                        Nivel {student.level}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <Zap size={14} color="#f59e0b" />
                                                        <span style={{ fontWeight: 500, color: '#0f172a', fontSize: 14 }}>
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
                                                        <span style={{ fontSize: 13, fontWeight: 500, color: progressColor, minWidth: 36, textAlign: 'right' }}>
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <button className="row-action" style={{
                                                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                                        border: 'none', color: '#1d4ed8',
                                                        fontSize: 13, fontWeight: 400,
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
                                            <div style={{ fontSize: 40, marginBottom: 12, color: '#94a3b8' }}>
                                                <Search size={48} style={{ margin: '0 auto' }} />
                                            </div>
                                            <div style={{ fontSize: 16, fontWeight: 400, color: '#0f172a', marginBottom: 6 }}>Sin resultados</div>
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
