"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    School, Zap, Users, TrendingUp, Medal, ChevronLeft,
    Star, BarChart3, Crown, MapPin, BookOpen, Trophy
} from "lucide-react"
import { AvatarDisplay } from "@/components/AvatarDisplay"

interface TopStudent {
    userId: string
    fullName: string | null
    nickname: string | null
    xp: number
    level: number
    avatar: any
    currentStreak: number
}

interface SchoolProfile {
    id: string
    name: string
    region: string | null
    studentCount: number
    totalXp: number
    xpPerCapita: number
    avgLevel: number
    topStudents: TopStudent[]
    xpBuckets: Record<string, number>
    schoolTopics?: { topic: { id: string; title: string; level: string } }[]
}

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return <span className="text-[24px]">🥇</span>
    if (rank === 2) return <span className="text-[24px]">🥈</span>
    if (rank === 3) return <span className="text-[24px]">🥉</span>
    return (
        <span className="text-[14px] font-medium text-slate-400 min-w-[24px] text-center block">
            {rank}
        </span>
    )
}

export default function SchoolProfilePage() {
    const params = useParams()
    const router = useRouter()
    const schoolId = params.id as string

    const [school, setSchool] = useState<SchoolProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!schoolId) return
        fetch(`/api/schools/${schoolId}`)
            .then(r => {
                if (!r.ok) throw new Error("Escuela no encontrada")
                return r.json()
            })
            .then(d => setSchool(d))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [schoolId])

    const bucketColors = ["#e0f2fe", "#bae6fd", "#7dd3fc", "#0ea5e9"]
    const bucketTextColors = ["#0369a1", "#0284c7", "#0369a1", "#0f172a"]

    return (
        <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-3 pb-28 px-3 md:py-10 md:px-6 lg:py-6 lg:px-16">
            <style>{`
        @keyframes sc-float {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-6px); }
        }
        @keyframes sc-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .sc-bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .progress-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: sc-shimmer 2s infinite;
        }
      `}</style>
            <div className="relative z-10 w-full max-w-[1200px] mx-auto box-border">
                {/* ── BACK BUTTON ── */}
                <button
                    onClick={() => router.push("/rankings")}
                    className="inline-flex items-center gap-2 bg-white border-2 border-slate-100 rounded-xl px-5 py-2.5 cursor-pointer text-sm font-semibold text-slate-600 mb-7 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600 focus:outline-none"
                >
                    <ChevronLeft size={16} />
                    Volver a Rankings
                </button>

                {/* ── LOADING ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                        <div className="w-11 h-11 border-4 border-blue-600/15 border-t-blue-600 rounded-full animate-spin" />
                        <span className="text-sm text-slate-400 font-semibold">Cargando perfil…</span>
                    </div>
                )}

                {/* ── ERROR ── */}
                {!loading && error && (
                    <div className="text-center py-16 px-6 text-red-600 text-base font-semibold">
                        {error}
                    </div>
                )}

                {/* ── CONTENT ── */}
                {!loading && !error && school && (
                    <>
                        {/* ── HERO HEADER ── */}
                        <div className="relative overflow-hidden rounded-[28px] p-8 md:p-12 mb-8 shadow-[0_20px_60px_rgba(15,98,254,0.25)] bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 animate-[fadeIn_0.5s_ease_both]">
                            {/* Background orbs */}
                            <div className="absolute -top-1/4 -right-5 w-[340px] h-[340px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(96,165,250,0.2)_0%,transparent_70%)]" />
                            <div className="absolute -bottom-1/5 left-[10%] w-[240px] h-[240px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_70%)]" />

                            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                                <div>
                                    {/* Pill label */}
                                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1.5 mb-4">
                                        <School size={13} className="text-blue-400" />
                                        <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">Perfil de Escuela</span>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2.5 tracking-tight leading-tight">
                                        {school.name}
                                    </h1>

                                    {school.region && (
                                        <div className="flex items-center gap-1.5 mb-2.5">
                                            <MapPin size={14} className="text-blue-300" />
                                            <span className="text-sm text-blue-300 font-medium">{school.region}</span>
                                        </div>
                                    )}

                                    {/* Quick stats row */}
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {[
                                            { icon: <Users size={14} className="text-blue-400" />, label: `${school.studentCount} estudiantes` },
                                            { icon: <Zap size={14} className="text-blue-400" />, label: `${school.totalXp.toLocaleString()} XP total` },
                                            { icon: <Star size={14} className="text-blue-400" />, label: `${school.xpPerCapita.toLocaleString()} XP / alumno` },
                                        ].map((item, i) => (
                                            <div key={i} className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3.5 py-1.5">
                                                {item.icon}
                                                <span className="text-sm font-medium text-slate-200">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating school icon */}
                                <div className="w-20 h-20 md:w-[90px] md:h-[90px] shrink-0 bg-white/10 border border-white/15 rounded-3xl flex items-center justify-center backdrop-blur-md drop-shadow-md animate-[rk-float_3s_ease-in-out_infinite]">
                                    <School size={40} className="text-blue-300" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        {/* ── STAT CARDS GRID ── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: <Users size={22} color="#0F62FE" />, value: school.studentCount, label: "Estudiantes Activos", color: "#eff6ff", border: "#dbeafe" },
                                { icon: <Zap size={22} color="#7c3aed" />, value: `${school.totalXp.toLocaleString()} XP`, label: "XP Total Acumulado", color: "#f5f3ff", border: "#ede9fe" },
                                { icon: <Medal size={22} color="#d97706" />, value: `${school.xpPerCapita.toLocaleString()} XP`, label: "Promedio por Alumno", color: "#fffbeb", border: "#fef3c7" },
                                { icon: <TrendingUp size={22} color="#10b981" />, value: `Nivel ${school.avgLevel}`, label: "Nivel Promedio", color: "#f0fdf4", border: "#bbf7d0" },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-2 p-5 bg-white border-2 rounded-2xl transition-all shadow-[0_2px_12px_rgba(15,98,254,0.05)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,98,254,0.1)]"
                                    style={{ animationDelay: `${i * 0.07}s`, background: stat.color, borderColor: stat.border }}
                                >
                                    <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-semibold text-slate-900 leading-tight">{stat.value}</div>
                                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* ── TWO-COL LAYOUT ── */}
                        <div className="flex flex-col lg:flex-row gap-6 items-start">

                            {/* ── LEFT: TOP STUDENTS ── */}
                            <div className="flex-1 min-w-0 w-full">
                                {/* Section label */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                        <Trophy size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-base font-semibold text-slate-900 leading-tight">Top Estudiantes</div>
                                        <div className="text-xs font-semibold text-slate-500">Los más activos de {school.name}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {school.topStudents.length === 0 ? (
                                        <div className="text-center py-12 px-6 text-slate-500 text-[15px] bg-white rounded-2xl border-2 border-slate-100">
                                            Aún no hay estudiantes con XP. 🎓
                                        </div>
                                    ) : (
                                        school.topStudents.map((student, idx) => {
                                            const isTop3 = idx < 3
                                            const displayName = student.fullName || student.nickname || "Estudiante"
                                            return (
                                                <Link
                                                    key={student.userId}
                                                    href={`/forum/profile/${student.userId}`}
                                                    className={`flex items-center gap-4 p-3.5 md:p-4 bg-white border-2 rounded-2xl transition-all shadow-sm hover:translate-x-1 ${isTop3 ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white hover:border-amber-400 hover:shadow-[0_8px_24px_rgba(245,158,11,0.15)]" : "border-slate-100 hover:border-blue-200 hover:shadow-[0_6px_20px_rgba(37,99,235,0.08)]"}`}
                                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                                >
                                                    {/* Rank */}
                                                    <div className="min-w-[32px] text-center shrink-0">
                                                        <RankBadge rank={idx + 1} />
                                                    </div>

                                                    {/* Avatar */}
                                                    <div className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center overflow-hidden shadow-sm ${isTop3 ? "bg-gradient-to-br from-amber-100 to-amber-200 shadow-amber-500/20" : "bg-blue-50 shadow-blue-500/10"}`}>
                                                        {student.avatar ? (
                                                            <AvatarDisplay avatar={student.avatar} size={38} />
                                                        ) : (
                                                            <span className={`text-lg font-semibold ${isTop3 ? "text-amber-600" : "text-blue-600"}`}>
                                                                {displayName.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Name & level */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-slate-900 truncate">
                                                            {displayName}
                                                        </div>
                                                        <div className="text-xs font-medium text-slate-500 mt-0.5">Nivel {student.level}</div>
                                                    </div>

                                                    {/* XP */}
                                                    <div className="text-right shrink-0">
                                                        <div className={`text-[17px] font-semibold flex items-center gap-1 justify-end ${isTop3 ? "text-amber-600" : "text-blue-600"}`}>
                                                            <Zap size={14} className={isTop3 ? "fill-amber-600 text-amber-600" : "fill-blue-600 text-blue-600"} />
                                                            {student.xp.toLocaleString()}
                                                        </div>
                                                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">XP</div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN ── */}
                            <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6">

                                {/* XP Distribution */}
                                <div className="bg-white border-2 border-slate-100 rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,98,254,0.05)] animate-[fadeIn_0.6s_0.1s_ease_both]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                            <BarChart3 size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-semibold text-slate-900 leading-tight">Distribución de XP</div>
                                            <div className="text-xs font-medium text-slate-500">Por nivel de actividad</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {Object.entries(school.xpBuckets).map(([label, count], i) => {
                                            const maxBucket = Math.max(...Object.values(school.xpBuckets), 1)
                                            const pct = Math.round((count / maxBucket) * 100)
                                            const totalStudents = school.studentCount || 1
                                            const sharePct = Math.round((count / totalStudents) * 100)
                                            return (
                                                <div key={label}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-semibold text-slate-600">{label}</span>
                                                        <span className="text-xs font-bold text-slate-900">{count} <span className="text-slate-400 font-medium">({sharePct}%)</span></span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                                                        <div
                                                            className="sc-bar-fill h-full rounded-full transition-all duration-1000 ease-out"
                                                            style={{
                                                                width: `${pct}%`,
                                                                background: `linear-gradient(90deg, ${bucketColors[i]}, ${i === 3 ? "#2563EB" : "#38bdf8"})`,
                                                                boxShadow: pct > 0 ? `0 0 10px ${bucketColors[i]}` : "none",
                                                            }}
                                                        />
                                                        {pct > 20 && (
                                                            <div className="absolute inset-0 rounded-full progress-shimmer opacity-80 mix-blend-overlay" style={{ width: `${pct}%` }} />
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Topics enabled */}
                                {school.schoolTopics && school.schoolTopics.length > 0 && (
                                    <div className="bg-white border-2 border-slate-100 rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,98,254,0.05)] animate-[fadeIn_0.6s_0.2s_ease_both]">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                <BookOpen size={18} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="text-[15px] font-semibold text-slate-900 leading-tight">Temas Activos</div>
                                                <div className="text-xs font-medium text-slate-500">Contenido habilitado</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2.5">
                                            {school.schoolTopics.slice(0, 6).map(({ topic }) => (
                                                <div key={topic.id} className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[13px] font-semibold text-slate-800 truncate">{topic.title}</div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
                                                        {topic.level === "Beginner" ? "Inicial" : topic.level === "Intermediate" ? "Medio" : "Avanzado"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA: View Rankings */}
                                <Link
                                    href="/rankings"
                                    className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl py-4 font-bold text-[15px] shadow-[0_8px_24px_rgba(37,99,235,0.25)] transition-all animate-[fadeIn_0.6s_0.3s_ease_both] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)]"
                                >
                                    <Crown size={20} />
                                    Ver Todos los Rankings
                                </Link>

                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
