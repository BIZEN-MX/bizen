"use client"

import { useEffect, useState } from "react"
import { Trophy, Users, School, Zap, Star, TrendingUp, Medal, Crown } from "lucide-react"

interface UserRank {
    rank: number
    userId: string
    displayName: string
    nickname: string | null
    xp: number
    level: number
    schoolName: string | null
}

interface SchoolRank {
    rank: number
    schoolId: string
    schoolName: string
    studentCount: number
    totalXp: number
    xpPerCapita: number
}

function getLevelTitle(level: number) {
    if (level >= 20) return "Leyenda"
    if (level >= 15) return "Maestro"
    if (level >= 10) return "Experto"
    if (level >= 5) return "Avanzado"
    return "Explorer"
}

function getLevelColor(level: number) {
    if (level >= 20) return { bg: "linear-gradient(135deg,#7c3aed,#c026d3)", text: "#c026d3" }
    if (level >= 15) return { bg: "linear-gradient(135deg,#d97706,#f59e0b)", text: "#d97706" }
    if (level >= 10) return { bg: "linear-gradient(135deg,#0F62FE,#6366f1)", text: "#0F62FE" }
    if (level >= 5) return { bg: "linear-gradient(135deg,#10b981,#059669)", text: "#10b981" }
    return { bg: "linear-gradient(135deg,#64748b,#94a3b8)", text: "#64748b" }
}

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return <span style={{ fontSize: 28 }}>🥇</span>
    if (rank === 2) return <span style={{ fontSize: 28 }}>🥈</span>
    if (rank === 3) return <span style={{ fontSize: 28 }}>🥉</span>
    return (
        <span style={{
            fontSize: 15,
            fontWeight: 800,
            color: "#94a3b8",
            minWidth: 28,
            textAlign: "center",
            display: "block"
        }}>
            {rank}
        </span>
    )
}

export default function RankingsPage() {
    const [activeTab, setActiveTab] = useState<"users" | "schools">("users")
    const [users, setUsers] = useState<UserRank[]>([])
    const [schools, setSchools] = useState<SchoolRank[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/rankings")
                if (!res.ok) throw new Error("Error cargando rankings")
                const data = await res.json()
                setUsers(data.users || [])
                setSchools(data.schools || [])
            } catch (err) {
                setError("No se pudieron cargar los rankings. Intenta de nuevo más tarde.")
            } finally {
                setLoading(false)
            }
        }
        fetchRankings()
    }, [])

    return (
        <div
            className="rankings-outer"
            style={{
                minHeight: "100vh",
                background: "#FBFAF5",
                fontFamily: "'Montserrat', sans-serif",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <style>{`
        @media (max-width: 767px) {
          .rankings-outer { padding-bottom: 80px !important; }
          .rankings-inner { width: 100% !important; max-width: 100% !important; margin-left: 0 !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .rankings-inner {
            width: calc(100% - 220px) !important;
            max-width: calc(100% - 220px) !important;
            margin-left: 220px !important;
          }
        }
        @media (min-width: 1161px) {
          .rankings-inner {
            width: calc(100% - 280px) !important;
            max-width: calc(100% - 280px) !important;
            margin-left: 280px !important;
          }
        }

        @keyframes rk-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes rk-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes rk-spin {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
        @keyframes rk-float {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-6px); }
        }

        .rk-tab {
          padding: 10px 24px;
          border: none;
          border-radius: 10px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.22s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rk-tab:hover { transform: translateY(-1px); }

        .rk-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: white;
          border-radius: 14px;
          border: 1.5px solid #e8f0fe;
          box-shadow: 0 2px 10px rgba(15,98,254,0.04);
          transition: all 0.22s ease;
          animation: rk-fadeUp 0.45s ease both;
        }
        .rk-row:hover {
          transform: translateX(4px);
          box-shadow: 0 6px 22px rgba(15,98,254,0.10);
          border-color: #bfdbfe;
        }
        .rk-row.top3 {
          border-color: #fde68a;
          background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
          box-shadow: 0 4px 20px rgba(245,158,11,0.10);
        }
        .rk-row.top3:hover {
          box-shadow: 0 8px 30px rgba(245,158,11,0.18);
          border-color: #f59e0b;
        }
      `}</style>

            <div
                className="rankings-inner"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "clamp(20px, 5vw, 48px)",
                    boxSizing: "border-box",
                }}
            >
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
                        animation: "rk-fadeUp 0.5s ease both",
                    }}
                >
                    {/* Background orbs */}
                    <div style={{ position: "absolute", top: "-25%", right: "-5%", width: 340, height: 340, background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-20%", left: "10%", width: 240, height: 240, background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 14px", marginBottom: 14 }}>
                                <Trophy size={13} color="#60a5fa" />
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tabla de clasificación</span>
                            </div>
                            <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 900, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                                Rankings BIZEN
                            </h1>
                            <p style={{ fontSize: "clamp(13px, 1.5vw, 16px)", color: "#93c5fd", margin: 0, maxWidth: 480 }}>
                                Los mejores estudiantes y escuelas de la plataforma. ¿Estás en el top?
                            </p>
                        </div>

                        {/* Floating trophy */}
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
                                animation: "rk-float 3s ease-in-out infinite",
                                flexShrink: 0,
                            }}
                        >
                            <Crown size={44} color="#fbbf24" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* ── TABS ── */}
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        marginBottom: 28,
                        background: "white",
                        padding: "6px",
                        borderRadius: 14,
                        border: "1.5px solid #e8f0fe",
                        width: "fit-content",
                        boxShadow: "0 2px 10px rgba(15,98,254,0.05)",
                    }}
                >
                    <button
                        className="rk-tab"
                        onClick={() => setActiveTab("users")}
                        style={{
                            background: activeTab === "users" ? "linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%)" : "transparent",
                            color: activeTab === "users" ? "#fff" : "#64748b",
                            boxShadow: activeTab === "users" ? "0 4px 15px rgba(15,98,254,0.3)" : "none",
                        }}
                    >
                        <Users size={16} />
                        Estudiantes
                    </button>
                    <button
                        className="rk-tab"
                        onClick={() => setActiveTab("schools")}
                        style={{
                            background: activeTab === "schools" ? "linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%)" : "transparent",
                            color: activeTab === "schools" ? "#fff" : "#64748b",
                            boxShadow: activeTab === "schools" ? "0 4px 15px rgba(15,98,254,0.3)" : "none",
                        }}
                    >
                        <School size={16} />
                        Escuelas
                    </button>
                </div>

                {/* ── Loading / Error ── */}
                {loading && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 260, flexDirection: "column", gap: 16 }}>
                        <div style={{ width: 44, height: 44, border: "4px solid rgba(15,98,254,0.15)", borderTop: "4px solid #0F62FE", borderRadius: "50%", animation: "rk-spin 0.9s linear infinite" }} />
                        <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Cargando rankings…</span>
                    </div>
                )}
                {!loading && error && (
                    <div style={{ textAlign: "center", padding: "60px 24px", color: "#dc2626", fontSize: 15, fontWeight: 600 }}>
                        {error}
                    </div>
                )}

                {/* ── USERS TAB ── */}
                {!loading && !error && activeTab === "users" && (
                    <div>
                        {/* Section label */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Zap size={19} color="#0F62FE" />
                            </div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Top Estudiantes por XP</div>
                                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Del más alto nivel al más bajo</div>
                            </div>
                        </div>

                        {users.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 24px", color: "#94a3b8", fontSize: 15 }}>
                                No hay estudiantes con XP todavía. ¡Sé el primero! 🚀
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {users.map((user, idx) => {
                                    const lc = getLevelColor(user.level)
                                    const isTop3 = user.rank <= 3
                                    return (
                                        <div
                                            key={user.userId}
                                            className={`rk-row ${isTop3 ? "top3" : ""}`}
                                            style={{ animationDelay: `${Math.min(idx * 0.04, 0.5)}s` }}
                                        >
                                            {/* Rank */}
                                            <div style={{ minWidth: 36, textAlign: "center", flexShrink: 0 }}>
                                                <RankBadge rank={user.rank} />
                                            </div>

                                            {/* Avatar placeholder ─ initials circle */}
                                            <div
                                                style={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: "50%",
                                                    background: lc.bg,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    color: "#fff",
                                                    fontWeight: 900,
                                                    fontSize: 17,
                                                    boxShadow: `0 4px 14px ${lc.text}40`,
                                                }}
                                            >
                                                {user.displayName.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Name & school */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {user.displayName}
                                                </div>
                                                {user.schoolName && (
                                                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                                                        <School size={11} />
                                                        {user.schoolName}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Level badge */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    gap: 2,
                                                    background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                                                    borderRadius: 10,
                                                    padding: "6px 14px",
                                                    flexShrink: 0,
                                                    border: "1px solid #bfdbfe",
                                                }}
                                            >
                                                <div style={{ fontSize: 18, fontWeight: 900, color: "#0F62FE", lineHeight: 1 }}>
                                                    {user.level}
                                                </div>
                                                <div style={{ fontSize: 9, fontWeight: 700, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                                    {getLevelTitle(user.level)}
                                                </div>
                                            </div>

                                            {/* XP */}
                                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                <div style={{ fontSize: 18, fontWeight: 900, color: isTop3 ? "#d97706" : "#0F62FE", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                                                    <Zap size={14} fill={isTop3 ? "#d97706" : "#0F62FE"} color={isTop3 ? "#d97706" : "#0F62FE"} />
                                                    {user.xp.toLocaleString()}
                                                </div>
                                                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>XP</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── SCHOOLS TAB ── */}
                {!loading && !error && activeTab === "schools" && (
                    <div>
                        {/* Section label */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <TrendingUp size={19} color="#0F62FE" />
                            </div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Ranking de Escuelas — XP per Cápita</div>
                                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>XP promedio por alumno activo</div>
                            </div>
                        </div>

                        {/* Explainer pill */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                                border: "1px solid #bfdbfe",
                                borderRadius: 999,
                                padding: "8px 16px",
                                marginBottom: 20,
                            }}
                        >
                            <Star size={13} color="#0F62FE" fill="#0F62FE" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                                XP per cápita = XP total ÷ número de estudiantes
                            </span>
                        </div>

                        {schools.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 24px", color: "#94a3b8", fontSize: 15 }}>
                                No hay datos de escuelas todavía. 🏫
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {schools.map((school, idx) => {
                                    const isTop3 = school.rank <= 3
                                    const barPct = schools[0]?.xpPerCapita
                                        ? Math.round((school.xpPerCapita / schools[0].xpPerCapita) * 100)
                                        : 100
                                    return (
                                        <div
                                            key={school.schoolId}
                                            className={`rk-row ${isTop3 ? "top3" : ""}`}
                                            style={{ animationDelay: `${Math.min(idx * 0.04, 0.5)}s`, flexDirection: "column", alignItems: "stretch", gap: 12 }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                {/* Rank */}
                                                <div style={{ minWidth: 36, textAlign: "center", flexShrink: 0 }}>
                                                    <RankBadge rank={school.rank} />
                                                </div>

                                                {/* School icon */}
                                                <div
                                                    style={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 12,
                                                        background: isTop3
                                                            ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                                                            : "linear-gradient(135deg,#eff6ff,#dbeafe)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0,
                                                        boxShadow: isTop3
                                                            ? "0 4px 14px rgba(245,158,11,0.25)"
                                                            : "0 4px 14px rgba(15,98,254,0.12)",
                                                    }}
                                                >
                                                    <School size={22} color={isTop3 ? "#d97706" : "#0F62FE"} />
                                                </div>

                                                {/* Name & students */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {school.schoolName}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                                                        {school.studentCount} estudiante{school.studentCount !== 1 ? "s" : ""} · {school.totalXp.toLocaleString()} XP total
                                                    </div>
                                                </div>

                                                {/* XP per capita */}
                                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                    <div style={{ fontSize: 20, fontWeight: 900, color: isTop3 ? "#d97706" : "#0F62FE", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                                                        <Medal size={15} color={isTop3 ? "#d97706" : "#0F62FE"} />
                                                        {school.xpPerCapita.toLocaleString()}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>XP / alumno</div>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div style={{ width: "100%", height: 6, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                                                <div
                                                    style={{
                                                        width: `${barPct}%`,
                                                        height: "100%",
                                                        background: isTop3
                                                            ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
                                                            : "linear-gradient(90deg,#60a5fa,#0F62FE)",
                                                        borderRadius: 6,
                                                        boxShadow: isTop3
                                                            ? "0 0 8px rgba(245,158,11,0.4)"
                                                            : "0 0 8px rgba(15,98,254,0.4)",
                                                        transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
