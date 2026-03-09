'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/card'
import {
    Users,
    BookOpen,
    TrendingUp,
    School,
    Search,
    Filter,
    ChevronRight,
    User as UserIcon
} from 'lucide-react'

interface Student {
    id: string
    name: string
    level: number
    xp: number
    joinedAt: string
    coursesEnrolled: string[]
    completedLessonsCount: number
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

export default function AdminDashboardPage() {
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const res = await fetch('/api/school-admin/dashboard')
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        router.push('/login')
                        return
                    }
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

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#0F62FE', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#64748b', fontWeight: 500 }}>Cargando panel de administración...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ fontSize: 24, fontWeight: 500, color: '#0f172a', marginBottom: 8 }}>Oh no, algo salió mal</h2>
                <p style={{ color: '#64748b' }}>{error || "No se pudo cargar la información."}</p>
            </div>
        )
    }

    const filteredStudents = data.students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div
            className="dashboard-container"
            style={{
                padding: "clamp(20px, 4vw, 40px)",
                width: "100%",
                maxWidth: "none",
                margin: 0,
                boxSizing: "border-box",
                minHeight: "100vh"
            }}
        >
            <style jsx>{`
                .dashboard-container {
                    padding-left: 280px !important;
                }
                @media (max-width: 1160px) {
                    .dashboard-container {
                        padding-left: 220px !important;
                    }
                }
                @media (max-width: 767px) {
                    .dashboard-container {
                        padding-left: clamp(16px, 4vw, 40px) !important;
                        padding-right: clamp(16px, 4vw, 40px) !important;
                    }
                }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eff6ff", color: "#0F62FE", padding: "6px 14px", borderRadius: "99px", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
                    <School size={16} /> Panel de Administración
                </div>
                <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 500, color: "#0f172a", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                    Visión General<br />
                    <span style={{ color: "#0F62FE" }}>{data.school || "Tu Institución"}</span>
                </h1>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(max(240px, 100%), 1fr))", gap: 20, marginBottom: 40 }}>
                {[
                    { label: "Alumnos Activos", value: data.kpis.totalStudents, icon: <Users color="#0F62FE" size={24} />, bg: "#eff6ff" },
                    { label: "Módulos Completados (Promedio)", value: data.kpis.avgModulesCompleted, icon: <BookOpen color="#8b5cf6" size={24} />, bg: "#f5f3ff" },
                    { label: "Lecciones Totales Completadas", value: data.kpis.totalCompletedLessons, icon: <TrendingUp color="#10b981" size={24} />, bg: "#ecfdf5" },
                ].map((kpi, i) => (
                    <Card key={i} style={{ padding: 24, display: "flex", alignItems: "flex-start", gap: 16, border: "1px solid #e2e8f0" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {kpi.icon}
                        </div>
                        <div style={{ overflow: "hidden", wordWrap: "break-word", overflowWrap: "break-word" }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                                {kpi.label}
                            </div>
                            <div style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 500, color: "#0f172a", lineHeight: 1.1 }}>
                                {kpi.value}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Database View / Roster */}
            <Card style={{ border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>

                {/* Table Toolbar */}
                <div style={{ padding: "24px", borderBottom: "1px solid #raw_e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                        Listado de Alumnos <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 99, fontSize: 13, color: "#64748b" }}>{data.students.length}</span>
                    </h2>

                    <div style={{ display: "flex", gap: 12, flex: "1 1 300px", justifyContent: "flex-end" }}>
                        <div style={{ flex: 1, maxWidth: 300, position: "relative" }}>
                            <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                            <input
                                type="text"
                                placeholder="Buscar alumno..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "100%", padding: "10px 14px 10px 40px", borderRadius: 12,
                                    border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a",
                                    outline: "none", transition: "border-color 0.2s"
                                }}
                            />
                        </div>
                        <button style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "0 16px",
                            height: 42, borderRadius: 12, background: "#FBFAF5", border: "1px solid #e2e8f0",
                            color: "#475569", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "background 0.2s"
                        }}>
                            <Filter size={16} /> Filtros
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                        <thead>
                            <tr style={{ background: "#FBFAF5", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                                <th style={{ padding: "16px 24px", fontSize: 13, fontWeight: 500, color: "#64748b", textTransform: "uppercase" }}>Alumno</th>
                                <th style={{ padding: "16px 24px", fontSize: 13, fontWeight: 500, color: "#64748b", textTransform: "uppercase" }}>Nivel</th>
                                <th style={{ padding: "16px 24px", fontSize: 13, fontWeight: 500, color: "#64748b", textTransform: "uppercase" }}>XP Acumulada</th>
                                <th style={{ padding: "16px 24px", fontSize: 13, fontWeight: 500, color: "#64748b", textTransform: "uppercase" }}>Lecciones Completadas</th>
                                <th style={{ padding: "16px 24px", fontSize: 13, fontWeight: 500, color: "#64748b", textTransform: "uppercase", textAlign: "right" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} className="table-row-hover">
                                        <td style={{ padding: "16px 24px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F62FE" }}>
                                                    <UserIcon size={18} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, color: "#0f172a", fontSize: 15 }}>{student.name}</div>
                                                    <div style={{ fontSize: 13, color: "#64748b" }}>Inscrito en {student.coursesEnrolled.length} cursos</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <span style={{ display: "inline-flex", alignItems: "center", background: "#f5f3ff", color: "#7c3aed", padding: "4px 10px", borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                                                Nivel {student.level}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px 24px", color: "#475569", fontWeight: 500 }}>
                                            {student.xp.toLocaleString()} XP
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                                                    {/* Mock logic for progress bar width */}
                                                    <div style={{ width: `${Math.min(100, (student.completedLessonsCount / 10) * 100)}%`, height: "100%", background: "#10b981", borderRadius: 3 }} />
                                                </div>
                                                <span style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", width: 24 }}>{student.completedLessonsCount}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                            <button style={{
                                                background: "none", border: "none", color: "#0F62FE", fontSize: 14, fontWeight: 500,
                                                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
                                            }}>
                                                Ver detalle <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ padding: "40px 24px", textAlign: "center", color: "#64748b" }}>
                                        No se encontraron alumnos que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <style>{`
        .table-row-hover:hover {
          background-color: #f8fafc !important;
        }
        input:focus {
          border-color: #0F62FE !important;
          box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.1) !important;
        }
      `}</style>
        </div>
    )
}
