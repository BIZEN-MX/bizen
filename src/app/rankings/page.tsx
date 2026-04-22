"use client"

import { useEffect, useState } from "react"
import { Trophy, Users, School, Zap, Star, TrendingUp, Medal, Crown } from "lucide-react"
import Link from "next/link"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"

interface UserRank {
    rank: number
    userId: string
    displayName: string
    nickname: string | null
    xp: number
    level: number
    avatar: any
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
    if (rank === 1) return <span className="text-[28px]">🥇</span>
    if (rank === 2) return <span className="text-[28px]">🥈</span>
    if (rank === 3) return <span className="text-[28px]">🥉</span>
    return (
        <span className="text-[15px] font-medium text-slate-400 min-w-[28px] text-center block">
            {rank}
        </span>
    )
}

export default function RankingsPage() {
    const { dbProfile, user } = useAuth()
    const userEmail = typeof user?.email === 'string' ? user.email.toLowerCase() : ""
    const isAnahuac = userEmail.endsWith('@anahuac.mx') || userEmail.endsWith('@bizen.mx')
    const isParticular = dbProfile?.role === 'particular'

    const [activeTab, setActiveTab] = useState<"users" | "schools">("users")
    const [users, setUsers] = useState<UserRank[]>([])
    const [particulares, setParticulares] = useState<UserRank[]>([])
    const [schools, setSchools] = useState<SchoolRank[]>([])
    const [loading, setLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchRankings = async (silent = false) => {
        try {
            if (!silent) setLoading(true)
            else setIsSyncing(true)
            
            const res = await fetch("/api/rankings")
            if (!res.ok) throw new Error("Error cargando rankings")
            const data = await res.json()
            setUsers(data.users || [])
            setParticulares(data.particulares || [])
            setSchools(data.schools || [])
            setError(null)
        } catch (err) {
            setError("No se pudieron cargar los rankings. Intenta de nuevo más tarde.")
        } finally {
            setLoading(false)
            setIsInitialLoading(false)
            setIsSyncing(false)
        }
    }

    useEffect(() => {
        fetchRankings()
        
        // Real-time polling every 10 seconds
        const interval = setInterval(() => {
            fetchRankings(true)
        }, 10000)
        
        return () => clearInterval(interval)
    }, [])

    if (isInitialLoading) return <PageLoader />

    return (
        <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-3 pb-28 px-3 md:py-10 md:px-6 lg:py-6 lg:px-16">
            <style>{`
        @keyframes rk-float {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
            <div className="relative z-10 w-full max-w-[1200px] mx-auto box-border">
                {/* ── HERO HEADER ── */}
                <div className="relative overflow-hidden rounded-[28px] p-6 md:p-10 mb-6 shadow-[0_20px_60px_rgba(15,98,254,0.25)] bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 animate-[fadeIn_0.5s_ease_both]">
                    {/* Background orbs */}
                    <div className="absolute -top-1/4 -right-5 w-[340px] h-[340px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(96,165,250,0.2)_0%,transparent_70%)]" />
                    <div className="absolute -bottom-1/5 left-[10%] w-[240px] h-[240px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_70%)]" />

                    <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3.5">
                                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1.5">
                                    <Trophy size={13} className="text-blue-400" />
                                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">Tabla de clasificación</span>
                                </div>
                                
                                {isSyncing ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/20 rounded-full px-3 py-1.5"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                                        <span className="text-[11px] font-bold text-green-500 uppercase">Sincronizando...</span>
                                    </motion.div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <span className="text-[11px] font-semibold text-white/50 uppercase">En vivo</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-semibold text-white mb-2.5 tracking-tight leading-tight">
                                Rankings BIZEN
                            </h1>
                            <p className="text-sm md:text-base text-blue-200 m-0 max-w-lg">
                                {isParticular ? "Los mejores usuarios de la plataforma." : "Los mejores estudiantes y escuelas de la plataforma."} ¿Estás en el top?
                            </p>
                        </div>

                        {/* Floating trophy */}
                        <div className="w-20 h-20 md:w-[90px] md:h-[90px] bg-white/10 border border-white/15 rounded-3xl flex items-center justify-center backdrop-blur-md shrink-0 drop-shadow-md animate-[rk-float_3s_ease-in-out_infinite]">
                            <Crown size={40} className="text-amber-400 drop-shadow-md" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* ── TABS ── */}
                {!isParticular ? (
                    <div className="inline-flex gap-2 mb-7 bg-white p-1.5 rounded-2xl border-2 border-slate-200/50 shadow-sm">
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all focus:outline-none ${activeTab === "users" ? (isAnahuac ? "bg-primary text-white shadow-[0_4px_15px_rgba(255,89,0,0.3)] shadow-primary/30 scale-[1.02]" : "bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] shadow-blue-500/30 scale-[1.02]") : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                        >
                            <Users size={16} />
                            {isParticular ? "Usuarios" : "Estudiantes"}
                        </button>
                        <button
                            onClick={() => setActiveTab("schools")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all focus:outline-none ${activeTab === "schools" ? (isAnahuac ? "bg-primary text-white shadow-[0_4px_15px_rgba(255,89,0,0.3)] shadow-primary/30 scale-[1.02]" : "bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] shadow-blue-500/30 scale-[1.02]") : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                        >
                            <School size={16} />
                            Escuelas
                        </button>
                    </div>
                ) : (
                    <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 text-white rounded-xl font-medium text-sm mb-7 shadow-[0_4px_15px_rgba(37,99,235,0.3)] ${isAnahuac ? "bg-primary shadow-primary/30" : "bg-blue-600"}`}>
                        <Users size={16} />
                        Ranking de Particulares
                    </div>
                )}

                {/* ── Loading / Error ── */}
                {loading && (
                    <PageLoader />
                )}
                {!loading && error && (
                    <div className="text-center py-16 px-6 text-red-600 text-[15px] font-medium">
                        {error}
                    </div>
                )}

                {/* ── USERS TAB ── */}
                {!loading && !error && (activeTab === "users" || isParticular) && (
                    <div>
                        {/* Section label */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                <Zap size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <div className="text-base font-semibold text-slate-900">
                                    {isParticular ? "Top Usuarios por XP" : "Top Estudiantes por XP"}
                                </div>
                                <div className="text-xs font-medium text-slate-500">Del más alto nivel al más bajo</div>
                            </div>
                        </div>

                        {(isParticular ? particulares : users).length === 0 ? (
                            <div className="text-center py-16 px-6 text-slate-400 text-[15px]">
                                No hay usuarios con XP todavía. ¡Sé el primero! 🚀
                            </div>
                        ) : (
                            <LayoutGroup>
                                <div className="flex flex-col gap-2.5">
                                    {(isParticular ? particulares : users).map((user, idx) => {
                                        const lc = getLevelColor(user.level)
                                        const isTop3 = user.rank <= 3
                                        return (
                                            <motion.div
                                                layout
                                                key={user.userId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ 
                                                    type: "spring", 
                                                    stiffness: 300, 
                                                    damping: 30,
                                                    opacity: { duration: 0.2 }
                                                }}
                                            >
                                                <Link
                                                    href={`/forum/profile/${user.userId}`}
                                                    className={`flex items-center gap-3 p-3 md:p-4 bg-white rounded-2xl border-2 transition-all hover:translate-x-1 ${isTop3 ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-[0_4px_20px_rgba(245,158,11,0.08)] hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]" : "border-slate-100 shadow-[0_2px_10px_rgba(37,99,235,0.04)] hover:border-blue-200 hover:shadow-[0_6px_22px_rgba(37,99,235,0.08)]"}`}
                                                >
                                                    {/* Rank */}
                                                    <div className="min-w-[36px] text-center shrink-0">
                                                        <RankBadge rank={user.rank} />
                                                    </div>

                                                    {/* Avatar Display */}
                                                    <div
                                                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden relative ${user.avatar ? "bg-transparent shadow-none" : "shadow-md"}`}
                                                        style={{ background: user.avatar ? "transparent" : lc.bg, boxShadow: user.avatar ? "none" : `0 4px 14px ${lc.text}40` }}
                                                    >
                                                        {user.avatar ? (
                                                            <AvatarDisplay avatar={user.avatar} size={38} />
                                                        ) : (
                                                            <span className="text-white font-semibold text-lg">
                                                                {user.displayName.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Name & school */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[15px] font-semibold text-slate-900 truncate">
                                                            {user.displayName}
                                                        </div>
                                                        {user.schoolName && (
                                                            <div className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                                                                <School size={11} />
                                                                {user.schoolName}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Level badge */}
                                                    <div className="flex flex-col items-center gap-0.5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl px-3.5 py-1.5 shrink-0">
                                                        <div className="text-lg font-semibold text-blue-600 leading-none">
                                                            {user.level}
                                                        </div>
                                                        <div className="text-[9px] font-semibold text-blue-600 uppercase tracking-wider">
                                                            {getLevelTitle(user.level)}
                                                        </div>
                                                    </div>

                                                    {/* XP */}
                                                    <div className="text-right shrink-0">
                                                        <motion.div 
                                                            key={user.xp}
                                                            initial={{ scale: 1.2, color: "#10b981" }}
                                                            animate={{ scale: 1, color: isTop3 ? "#d97706" : "#2563EB" }}
                                                            className="text-lg font-semibold flex items-center gap-1 justify-end"
                                                        >
                                                            <Zap size={14} fill="currentColor" color="currentColor" />
                                                            {user.xp.toLocaleString()}
                                                        </motion.div>
                                                        <div className="text-[11px] font-medium text-slate-500">XP</div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </LayoutGroup>
                        )}
                    </div>
                )}

                {/* ── SCHOOLS TAB ── */}
                {!isParticular && !loading && !error && activeTab === "schools" && (
                    <div>
                        {/* Section label */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                <TrendingUp size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <div className="text-base font-semibold text-slate-900">Ranking de Escuelas — XP per Cápita</div>
                                <div className="text-xs font-medium text-slate-500">XP promedio por {isParticular ? "usuario" : "estudiante"} activo</div>
                            </div>
                        </div>

                        {/* Explainer pill */}
                        <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-200 rounded-full px-4 py-2 mb-5">
                            <Star size={14} className="text-blue-600 fill-blue-600" />
                            <span className="text-xs font-medium text-blue-700">
                                XP per cápita = XP total ÷ número de {isParticular ? "usuarios" : "estudiantes"}
                            </span>
                        </div>

                        {schools.length === 0 ? (
                            <div className="text-center py-16 px-6 text-slate-400 text-[15px]">
                                No hay datos de escuelas todavía. 🏫
                            </div>
                        ) : (
                            <LayoutGroup>
                                <div className="flex flex-col gap-2.5">
                                    {schools.map((school, idx) => {
                                        const isTop3 = school.rank <= 3
                                        const barPct = schools[0]?.xpPerCapita
                                            ? Math.round((school.xpPerCapita / schools[0].xpPerCapita) * 100)
                                            : 100
                                        return (
                                            <motion.div
                                                layout
                                                key={school.schoolId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            >
                                                <Link
                                                    href={`/rankings/escuela/${school.schoolId}`}
                                                    className={`flex flex-col gap-3 p-3 md:p-4 bg-white rounded-2xl border-2 transition-all hover:-translate-y-[2px] ${isTop3 ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-[0_4px_20px_rgba(245,158,11,0.08)] hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]" : "border-slate-100 shadow-[0_2px_10px_rgba(37,99,235,0.04)] hover:border-blue-200 hover:shadow-[0_6px_22px_rgba(37,99,235,0.08)]"}`}
                                                >
                                                    <div className="flex items-center gap-4 w-full">
                                                        {/* Rank */}
                                                        <div className="min-w-[36px] text-center shrink-0">
                                                            <RankBadge rank={school.rank} />
                                                        </div>

                                                        {/* School icon */}
                                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isTop3 ? "bg-gradient-to-br from-amber-100 to-amber-200 shadow-[0_4px_14px_rgba(245,158,11,0.25)]" : "bg-gradient-to-br from-blue-50 to-blue-100 shadow-[0_4px_14px_rgba(37,99,235,0.12)]"}`}>
                                                            <School size={22} color={isTop3 ? "#d97706" : "#2563EB"} />
                                                        </div>

                                                        {/* Name & students */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-[15px] font-semibold text-slate-900 truncate">
                                                                {school.schoolName}
                                                            </div>
                                                            <div className="text-xs font-medium text-slate-500">
                                                                {school.studentCount} {isParticular ? "usuario" : "estudiante"}{school.studentCount !== 1 ? "s" : ""} &bull; {school.totalXp.toLocaleString()} XP total
                                                            </div>
                                                        </div>

                                                        {/* XP per capita */}
                                                        <div className="text-right shrink-0">
                                                            <motion.div 
                                                                key={school.xpPerCapita}
                                                                initial={{ scale: 1.1, color: "#10b981" }}
                                                                animate={{ scale: 1, color: isTop3 ? "#d97706" : "#2563EB" }}
                                                                className="text-lg md:text-xl font-semibold flex items-center gap-1 justify-end"
                                                            >
                                                                <Medal size={15} color="currentColor" />
                                                                {school.xpPerCapita.toLocaleString()}
                                                            </motion.div>
                                                            <div className="text-[11px] font-medium text-slate-500">XP / {isParticular ? "usuario" : "estudiante"}</div>
                                                        </div>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            layout
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
                                                </Link>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </LayoutGroup>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
