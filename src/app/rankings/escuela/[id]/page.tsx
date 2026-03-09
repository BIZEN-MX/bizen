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
    if (rank === 1) return <span style={{ fontSize: 24 }}>🥇</span>
    if (rank === 2) return <span style={{ fontSize: 24 }}>🥈</span>
    if (rank === 3) return <span style={{ fontSize: 24 }}>🥉</span>
    return (
        <span style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", minWidth: 24, textAlign: "center", display: "block" }}>
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
        <div
            className="school-outer"
            style={{
                minHeight: "100vh",
                background: "#FBFAF5",
                                width: "100%",
                boxSizing: "border-box",
                overflowX: "hidden",
            }}
        >
            <style>{`
        @media (max-width: 767px) {
          .school-outer { padding-bottom: 80px !important; }
          .school-inner { width: 100% !important; max-width: 100% !important; margin-left: 0 !important; }
          .school-two-col { flex-direction: column !important; }
          .school-right-col { width: 100% !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .school-inner { width: calc(100% - 220px) !important; max-width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .school-inner { width: calc(100% - 280px) !important; max-width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }

        @keyframes sc-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes sc-float {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-6px); }
        }
        @keyframes sc-spin {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
        @keyframes sc-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .sc-stat-card {
          background: white;
          border: 1.5px solid #e8f0fe;
          border-radius: 20px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 2px 12px rgba(15,98,254,0.05);
          animation: sc-fadeUp 0.5s ease both;
          transition: all 0.22s ease;
        }
        .sc-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15,98,254,0.1);
          border-color: #bfdbfe;
        }

        .sc-student-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: white;
          border-radius: 14px;
          border: 1.5px solid #e8f0fe;
          box-shadow: 0 2px 8px rgba(15,98,254,0.04);
          transition: all 0.2s ease;
          animation: sc-fadeUp 0.4s ease both;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: flex;
        }
        .sc-student-row:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 20px rgba(15,98,254,0.1);
          border-color: #bfdbfe;
        }
        .sc-student-row.top3 {
          border-color: #fde68a;
          background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
        }
        .sc-student-row.top3:hover {
          border-color: #f59e0b;
          box-shadow: 0 8px 24px rgba(245,158,11,0.15);
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

            <div
                className="school-inner"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "clamp(20px, 5vw, 48px)",
                    boxSizing: "border-box",
                }}
            >
                {/* ── BACK BUTTON ── */}
                <button
                    onClick={() => router.push("/rankings")}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "white",
                        border: "1.5px solid #e8f0fe",
                        borderRadius: 12,
                        padding: "10px 18px",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#475569",
                                                marginBottom: 28,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.color = "#0F62FE" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8f0fe"; e.currentTarget.style.color = "#475569" }}
                >
                    <ChevronLeft size={16} />
                    Volver a Rankings
                </button>

                {/* ── LOADING ── */}
                {loading && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, flexDirection: "column", gap: 16 }}>
                        <div style={{ width: 44, height: 44, border: "4px solid rgba(15,98,254,0.15)", borderTop: "4px solid #0F62FE", borderRadius: "50%", animation: "sc-spin 0.9s linear infinite" }} />
                        <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Cargando perfil…</span>
                    </div>
                )}

                {/* ── ERROR ── */}
                {!loading && error && (
                    <div style={{ textAlign: "center", padding: "60px 24px", color: "#dc2626", fontSize: 16, fontWeight: 500 }}>
                        {error}
                    </div>
                )}

                {/* ── CONTENT ── */}
                {!loading && !error && school && (
                    <>
                        {/* ── HERO HEADER ── */}
                        <div
                            style={{
                                background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0F62FE 100%)",
                                borderRadius: 28,
                                padding: "clamp(32px, 5vw, 52px) clamp(28px, 5vw, 48px)",
                                marginBottom: 32,
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 20px 60px rgba(15,98,254,0.25)",
                                animation: "sc-fadeUp 0.5s ease both",
                            }}
                        >
                            {/* Background orbs */}
                            <div style={{ position: "absolute", top: "-25%", right: "-5%", width: 340, height: 340, background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                            <div style={{ position: "absolute", bottom: "-20%", left: "10%", width: 240, height: 240, background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
                                <div>
                                    {/* Pill label */}
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 14px", marginBottom: 14 }}>
                                        <School size={13} color="#60a5fa" />
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Perfil de Escuela</span>
                                    </div>

                                    <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 500, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                                        {school.name}
                                    </h1>

                                    {school.region && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                                            <MapPin size={14} color="#93c5fd" />
                                            <span style={{ fontSize: 14, color: "#93c5fd", fontWeight: 500 }}>{school.region}</span>
                                        </div>
                                    )}

                                    {/* Quick stats row */}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8 }}>
                                        {[
                                            { icon: <Users size={14} color="#60a5fa" />, label: `${school.studentCount} estudiantes` },
                                            { icon: <Zap size={14} color="#60a5fa" />, label: `${school.totalXp.toLocaleString()} XP total` },
                                            { icon: <Star size={14} color="#60a5fa" />, label: `${school.xpPerCapita.toLocaleString()} XP / alumno` },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 14px" }}>
                                                {item.icon}
                                                <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating school icon */}
                                <div
                                    style={{
                                        width: 90,
                                        height: 90,
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: 24,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backdropFilter: "blur(10px)",
                                        animation: "sc-float 3s ease-in-out infinite",
                                        flexShrink: 0,
                                    }}
                                >
                                    <School size={44} color="#93c5fd" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        {/* ── STAT CARDS GRID ── */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                                gap: 16,
                                marginBottom: 32,
                            }}
                        >
                            {[
                                { icon: <Users size={22} color="#0F62FE" />, value: school.studentCount, label: "Estudiantes Activos", color: "#eff6ff", border: "#dbeafe" },
                                { icon: <Zap size={22} color="#7c3aed" />, value: `${school.totalXp.toLocaleString()} XP`, label: "XP Total Acumulado", color: "#f5f3ff", border: "#ede9fe" },
                                { icon: <Medal size={22} color="#d97706" />, value: `${school.xpPerCapita.toLocaleString()} XP`, label: "Promedio por Alumno", color: "#fffbeb", border: "#fef3c7" },
                                { icon: <TrendingUp size={22} color="#10b981" />, value: `Nivel ${school.avgLevel}`, label: "Nivel Promedio de la Escuela", color: "#f0fdf4", border: "#bbf7d0" },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="sc-stat-card"
                                    style={{ animationDelay: `${i * 0.07}s`, background: stat.color, borderColor: stat.border }}
                                >
                                    <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {stat.icon}
                                    </div>
                                    <div style={{ fontSize: 26, fontWeight: 500, color: "#0f172a", lineHeight: 1.1 }}>{stat.value}</div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* ── TWO-COL LAYOUT ── */}
                        <div className="school-two-col" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

                            {/* ── LEFT: TOP STUDENTS ── */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Section label */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                                    <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #eff6ff, #dbeafe)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Trophy size={19} color="#0F62FE" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a" }}>Top Estudiantes</div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Los más activos de {school.name}</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {school.topStudents.length === 0 ? (
                                        <div style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8", fontSize: 15, background: "white", borderRadius: 16, border: "1.5px solid #e8f0fe" }}>
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
                                                    className={`sc-student-row ${isTop3 ? "top3" : ""}`}
                                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                                >
                                                    {/* Rank */}
                                                    <div style={{ minWidth: 32, textAlign: "center", flexShrink: 0 }}>
                                                        <RankBadge rank={idx + 1} />
                                                    </div>

                                                    {/* Avatar */}
                                                    <div style={{
                                                        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                                                        background: isTop3 ? "linear-gradient(135deg, #fef3c7, #fde68a)" : "#eff6ff",
                                                        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                                                        boxShadow: isTop3 ? "0 3px 12px rgba(245,158,11,0.2)" : "0 2px 8px rgba(15,98,254,0.1)",
                                                    }}>
                                                        {student.avatar ? (
                                                            <AvatarDisplay avatar={student.avatar} size={38} />
                                                        ) : (
                                                            <span style={{ fontSize: 18, fontWeight: 500, color: isTop3 ? "#d97706" : "#0F62FE" }}>
                                                                {displayName.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Name & level */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {displayName}
                                                        </div>
                                                        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Nivel {student.level}</div>
                                                    </div>

                                                    {/* XP */}
                                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                        <div style={{ fontSize: 17, fontWeight: 500, color: isTop3 ? "#d97706" : "#0F62FE", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                                                            <Zap size={13} fill={isTop3 ? "#d97706" : "#0F62FE"} color={isTop3 ? "#d97706" : "#0F62FE"} />
                                                            {student.xp.toLocaleString()}
                                                        </div>
                                                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>XP</div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN ── */}
                            <div className="school-right-col" style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>

                                {/* XP Distribution */}
                                <div
                                    style={{
                                        background: "white",
                                        border: "1.5px solid #e8f0fe",
                                        borderRadius: 20,
                                        padding: "24px 22px",
                                        boxShadow: "0 2px 12px rgba(15,98,254,0.05)",
                                        animation: "sc-fadeUp 0.6s 0.1s ease both",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #eff6ff, #dbeafe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <BarChart3 size={18} color="#0F62FE" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>Distribución de XP</div>
                                            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Por nivel de actividad</div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                        {Object.entries(school.xpBuckets).map(([label, count], i) => {
                                            const maxBucket = Math.max(...Object.values(school.xpBuckets), 1)
                                            const pct = Math.round((count / maxBucket) * 100)
                                            const totalStudents = school.studentCount || 1
                                            const sharePct = Math.round((count / totalStudents) * 100)
                                            return (
                                                <div key={label}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#475569" }}>{label}</span>
                                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>{count} <span style={{ color: "#94a3b8", fontWeight: 500 }}>({sharePct}%)</span></span>
                                                    </div>
                                                    <div style={{ width: "100%", height: 10, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", position: "relative" }}>
                                                        <div
                                                            className="sc-bar-fill"
                                                            style={{
                                                                width: `${pct}%`,
                                                                background: `linear-gradient(90deg, ${bucketColors[i]}, ${i === 3 ? "#0F62FE" : "#38bdf8"})`,
                                                                boxShadow: pct > 0 ? `0 0 10px ${bucketColors[i]}` : "none",
                                                            }}
                                                        />
                                                        {pct > 20 && (
                                                            <div className="progress-shimmer" style={{ position: "absolute", inset: 0, width: `${pct}%`, borderRadius: 8 }} />
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Topics enabled */}
                                {school.schoolTopics && school.schoolTopics.length > 0 && (
                                    <div
                                        style={{
                                            background: "white",
                                            border: "1.5px solid #e8f0fe",
                                            borderRadius: 20,
                                            padding: "24px 22px",
                                            boxShadow: "0 2px 12px rgba(15,98,254,0.05)",
                                            animation: "sc-fadeUp 0.6s 0.2s ease both",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <BookOpen size={18} color="#10b981" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>Temas Activos</div>
                                                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Contenido habilitado</div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {school.schoolTopics.slice(0, 6).map(({ topic }) => (
                                                <div key={topic.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8faff", borderRadius: 12, border: "1px solid #e8f0fe" }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{topic.title}</div>
                                                    </div>
                                                    <span style={{ fontSize: 10, fontWeight: 500, color: "#10b981", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>
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
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 10,
                                        background: "linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%)",
                                        color: "white",
                                        borderRadius: 16,
                                        padding: "16px 24px",
                                        fontWeight: 500,
                                        fontSize: 15,
                                        textDecoration: "none",
                                        boxShadow: "0 8px 24px rgba(15,98,254,0.3)",
                                        transition: "all 0.2s ease",
                                        animation: "sc-fadeUp 0.6s 0.3s ease both",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 32px rgba(15,98,254,0.4)" }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(15,98,254,0.3)" }}
                                >
                                    <Crown size={18} />
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
