"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import Card from "@/components/ui/card"
import PageLoader from "@/components/PageLoader"
import {
    Heart,
    Globe,
    Users,
    Award,
    CheckCircle2,
    Lock,
    AlertTriangle,
    FileText,
    ExternalLink,
    ChevronRight,
    TrendingUp,
    Clock,
    Zap,
    Target as TargetIcon,
    Book,
    Brain,
    Gamepad2,
    ShoppingBasket,
    BookOpen,
    TreeDeciduous,
    School,
    CircleDollarSign,
    ClipboardList,
    BarChart3,
    Unlock,
    Handshake,
    Briefcase,
    Ruler,
    ShieldCheck,
    ClipboardCheck,
    MessageCircle,
    Lightbulb,
    Instagram
} from "lucide-react"

// --- TYPES & INTERFACES ---

interface Foundation {
    id: string
    name: string
    logo: string
    description: string
    verified: boolean
    website: string
}

interface SchoolImpact {
    basePct: number
    bonusPct: number
    baseAmountMXN: number
    bonusAmountMXN: number
    totalDonatedMXN: number
    projectedBonusMXN: number
    causeCategory: "Educación" | "Alimentación" | "Medio Ambiente" | "Impacto Social"
    foundation: Foundation
    seasonStart: string
    seasonEnd: string
    status: "active" | "executed" | "risk" | "none"
}

interface ImpactTarget {
    id: string
    label: string
    metricKey: string
    currentValue: number
    targetValue: number
    unit: string
    status: "locked" | "unlocked" | "near"
    howToHelpCTA: string
}

interface EvidenceEntry {
    id: string
    date: string
    amount: number
    foundation: string
    status: "Completado" | "Pendiente"
    evidenceUrl: string
    type: "image" | "pdf"
}

interface Report {
    id: string
    title: string
    period: string
    url: string
}

// --- MOCK DATA ---

const MOCK_FOUNDATION: Foundation = {
    id: "f1",
    name: "Nuqleo Querétaro",
    logo: "",
    description: "Espacio de innovación social y emprendimiento que impulsa a las juventudes y el desarrollo.",
    verified: true,
    website: "https://www.instagram.com/nucleo_qro?igsh=Z2hpejE3cHF4Y3kw"
}

const MOCK_SCHOOL_IMPACT: SchoolImpact = {
    basePct: 1,
    bonusPct: 1.5,
    baseAmountMXN: 12500,
    bonusAmountMXN: 18750,
    totalDonatedMXN: 45000,
    projectedBonusMXN: 15400,
    causeCategory: "Impacto Social",
    foundation: MOCK_FOUNDATION,
    seasonStart: "2026-01-01",
    seasonEnd: "2026-12-31",
    status: "active"
}

const MOCK_TARGETS: ImpactTarget[] = [
    {
        id: "t1",
        label: "Tasa de usuarios activos",
        metricKey: "active_rate",
        currentValue: 62,
        targetValue: 70,
        unit: "%",
        status: "near",
        howToHelpCTA: "Invita a un compañero a realizar su reto diario"
    },
    {
        id: "t3",
        label: "Lecciones completadas (promedio)",
        metricKey: "avg_lessons",
        currentValue: 4.2,
        targetValue: 10,
        unit: "lecciones",
        status: "locked",
        howToHelpCTA: "Termina tu lección actual para subir el promedio"
    }
]

const MOCK_EVIDENCE: EvidenceEntry[] = [
    {
        id: "ev1",
        date: "2025-12-15",
        amount: 15000,
        foundation: "Nuqleo Querétaro",
        status: "Completado",
        evidenceUrl: "#",
        type: "pdf"
    },
    {
        id: "ev2",
        date: "2025-06-10",
        amount: 12000,
        foundation: "Nutriendo Futuro",
        status: "Completado",
        evidenceUrl: "#",
        type: "image"
    }
]

const MOCK_REPORTS: Report[] = [
    { id: "r1", title: "Reporte Mensual - Enero", period: "Enero 2026", url: "#" },
    { id: "r2", title: "Reporte Trimestral Q4", period: "Oct-Dic 2025", url: "#" },
    { id: "r3", title: "Impacto Anual 2025", period: "Año 2025", url: "#" }
]

// --- MEASUREMENT LOGIC HANDLER ---

/**
 * REGLAS DE MEDICIÓN (IA):
 * 1. Sesión útil: >= 10 mins Y >= 1 acción completada (lección/quiz/reto/simulador).
 * 2. Día activo: Al menos 1 sesión útil en ese día.
 * 3. Alumno activo: Al menos 3 sesiones útiles en últimos 30 días O 1 lección completada en últimos 30 días.
 */
const checkActiveStatus = (sessionsLast30d: number, modulesLast30d: number): boolean => {
    return sessionsLast30d >= 3 || modulesLast30d >= 1;
}


export default function ImpactoSocialPage() {
    const { user, loading, dbProfile } = useAuth()
    const router = useRouter()
    const isInstitutional = !!dbProfile?.schoolId || (dbProfile?.role && dbProfile.role !== 'particular')
    const [activeTab, setActiveTab] = useState<"student" | "school" | "transparency">(isInstitutional ? "school" : "student")

    // Dynamic states
    const [stats, setStats] = useState<any>(null)
    const [isLoadingStats, setIsLoadingStats] = useState(true)

    const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
    const isStudentOrGuest = !isAdminOrTeacher

    useEffect(() => {
        if (loading) return
        if (!user) {
            setIsLoadingStats(false)
            return
        }

        const fetchStats = async () => {
            try {
                const res = await fetch("/api/impact/stats")
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (error) {
                console.error("Error fetching impact stats", error)
            } finally {
                setIsLoadingStats(false)
            }
        }

        fetchStats()
    }, [user, loading, router])

    const { completedLessons } = useLessonProgress()

    const handleGoToNextLesson = () => {
        // Find first untaken lesson across all 30 topics
        for (let tIdx = 0; tIdx < SUBTEMAS_BY_COURSE.length; tIdx++) {
            const topicId = tIdx + 1
            const subtemas = SUBTEMAS_BY_COURSE[tIdx]
            for (let sIdx = 0; sIdx < subtemas.length; sIdx++) {
                const unitId = sIdx + 1
                const lessons = subtemas[sIdx].lessons
                for (const lesson of lessons) {
                    if (!completedLessons.includes(lesson.slug)) {
                        router.push(`/learn/course-${topicId}/unit-${unitId}/${lesson.slug}/interactive`)
                        return
                    }
                }
            }
        }
        router.push("/courses")
    }

    if (loading || isLoadingStats) {
        return <PageLoader />
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#1a3a8a] flex items-center justify-center relative overflow-hidden">
                <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(32px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes is-glow {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 0.8; }
                    }
                `}</style>

                {/* Ambient orbs */}
                <div className="absolute -top-[15%] -right-[8%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(15,98,254,0.15)_0%,transparent_70%)] animate-[is-glow_6s_ease-in-out_infinite]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(74,158,255,0.10)_0%,transparent_65%)] animate-[is-glow_8s_ease-in-out_infinite_2s]" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] z-0" />

                {/* Main content */}
                <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

                    {/* Badge */}
                    <div className="animate-[fade-in-up_0.5s_ease_both] mb-8 inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/40 rounded-full py-2 px-5">
                        <Heart size={14} className="text-blue-400 fill-blue-400" />
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Impacto Social</span>
                    </div>

                    {/* Heading */}
                    <h1 className="animate-[fade-in-up_0.6s_0.1s_ease_both] text-[clamp(32px,8vw,56px)] font-extrabold text-white mb-5 leading-[1.1] tracking-tight">
                        Aprende finanzas y
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">cambia el mundo</span>
                    </h1>

                    {/* Sub */}
                    <p className="animate-[fade-in-up_0.6s_0.2s_ease_both] text-[clamp(15px,3vw,18px)] text-white/65 mb-12 leading-relaxed">
                        Con cada lección completada en Bizen, {isInstitutional ? 'tu escuela' : 'la plataforma'} dona a <strong className="text-blue-300 font-bold">Nuqleo Querétaro</strong>.<br />
                        Únete y mide el impacto real de tu aprendizaje.
                    </p>

                    {/* Stats pills */}
                    <div className="animate-[fade-in-up_0.6s_0.25s_ease_both] flex gap-3 justify-center flex-wrap mb-12">
                        <div className="bg-white/5 border border-white/10 rounded-full py-2.5 px-5 flex items-center gap-2.5 backdrop-blur-md animate-[fade-in-up_0.8s_ease_both] delay-300">
                            <Globe size={16} className="text-blue-400" />
                            <span className="text-sm font-bold text-white/90">$45,000 MXN donados</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-full py-2.5 px-5 flex items-center gap-2.5 backdrop-blur-md animate-[fade-in-up_0.8s_ease_both] delay-[400ms]">
                            <Users size={16} className="text-purple-400" />
                            <span className="text-sm font-bold text-white/90">90 canastas alimentarias</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-full py-2.5 px-5 flex items-center gap-2.5 backdrop-blur-md animate-[fade-in-up_0.8s_ease_both] delay-500">
                            <Award size={16} className="text-emerald-400" />
                            <span className="text-sm font-bold text-white/90">3 donaciones ejecutadas</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="animate-[fade-in-up_0.7s_0.35s_ease_both] flex flex-col items-center gap-5">
                        <Link href="/signup" className="bg-gradient-to-br from-blue-600 to-blue-400 text-white border-none rounded-2xl py-5 px-12 text-lg font-extrabold cursor-pointer shadow-[0_8px_32px_rgba(15,98,254,0.45)] transition-all duration-200 inline-block no-underline tracking-tight hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(15,98,254,0.6)]">
                            Empieza ahora
                        </Link>
                        <Link href="/login" className="text-white/75 text-[15px] font-semibold no-underline border-b border-white/30 pb-0.5 transition-colors duration-200 cursor-pointer bg-transparent hover:text-white hover:border-white">
                            Ya tengo una cuenta
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Helper references to real data
    const impactData = stats?.schoolImpacts?.[0] || MOCK_SCHOOL_IMPACT
    const studentStats = stats?.studentStats || { usefulSessions: 0, lessonsCompleted: 0, challengesCompleted: 0, simulatorsPlayed: 0 }
    const targetsData = (stats?.targets?.length ? stats.targets : MOCK_TARGETS).map((t: any) => ({
        ...t,
        label: t.title || t.label,
        status: t.status || (t.currentValue >= t.targetValue ? "unlocked" : "near"),
        howToHelpCTA: t.howToHelpCTA || "Completa más lecciones para ayudar"
    }))

    // Calculate dynamic equivalents based on live user stats
    const equivalenceFood = Math.floor(studentStats.usefulSessions / 5) || 0; // arbitrary mapping
    const equivalenceBooks = Math.floor(studentStats.lessonsCompleted / 2) || 0;
    const equivalenceTrees = Math.floor(studentStats.challengesCompleted / 10) || 0;
    const equivalenceTutoring = studentStats.simulatorsPlayed * 2 || 0;

    // --- RENDERING HELPERS ---

    const renderEquivalence = (mxn: number) => {
        const foodBaskets = Math.floor(mxn / 500)
        return `${foodBaskets} canastas alimentarias`
    }

    return (
        <div className="min-h-screen bg-[#FBFAF5] text-[#1e3a5f] w-full overflow-x-hidden !pb-[75px] md:!pb-0">
            <style>{`
                /* Keep custom animations */
                @keyframes impact-fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes impact-dash {
                    from { stroke-dashoffset: 628; }
                    to { stroke-dashoffset: 238; } /* (1 - 0.62) * 628 = 238 approx */
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="relative w-full md:w-auto md:p-0 md:ml-0">
                {/* 
            ---------------------------------------------------------
            A) IMPACTO HOME (Summary Hero) - Shared or Escuela Default
            ---------------------------------------------------------
          */}
                <div className="bg-gradient-to-br from-[#040d1f] via-[#0a1e4e] via-[40%] to-[#0F62FE] py-[clamp(40px,6vw,80px)] relative overflow-hidden w-full">
                    {/* Expand to 1600px */}
                    <div className="w-full max-w-[1600px] mx-auto px-[clamp(16px,5vw,64px)] relative z-10">

                        <div className="flex justify-between items-center gap-8 flex-wrap">
                            <div className="flex-[1_1_500px]">
                                <div className="animate-[impact-fadeInUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_both] delay-100 flex items-center gap-3 mb-5">
                                    <span className="bg-gradient-to-br from-[#0F62FE] to-blue-500 text-white py-1.5 px-3.5 rounded-full text-[11px] font-medium uppercase tracking-wider shadow-[0_4px_12px_rgba(15,98,254,0.2)]">
                                        Causa: {isInstitutional ? "Educación" : "Impacto Social"}
                                    </span>
                                </div>

                                <h1 className="animate-[impact-fadeInUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_both] delay-200 text-[clamp(32px,5vw,64px)] font-medium text-white mb-5 leading-[1.1] tracking-tight">
                                    {isInstitutional ? 'Nuestro Impacto en' : 'Mi Impacto Social con'} <br />
                                    <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">{MOCK_FOUNDATION.name}</span>
                                </h1>

                                <p className="animate-[impact-fadeInUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_both] delay-300 text-xl text-white/85 mb-8 leading-relaxed">
                                    Llevamos donados <strong className="text-white font-medium text-[1.1em]">${MOCK_SCHOOL_IMPACT.totalDonatedMXN.toLocaleString()} MXN</strong>.<br />
                                    <span className="text-[0.9em] text-white/60">
                                        Esto equivale a ≈ <strong className="text-blue-300 font-medium">{renderEquivalence(MOCK_SCHOOL_IMPACT.totalDonatedMXN)}</strong> entregadas.
                                    </span>
                                </p>

                                <div className="animate-[impact-fadeInUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_both] delay-300 flex gap-6 flex-wrap mt-2">
                                    {[
                                        { label: "Donado este ciclo", value: "$45K MXN", icon: <Globe size={12} className="text-blue-400" />, colorClass: "text-blue-400" },
                                        { label: "Canastas equiv.", value: "90", icon: <ShoppingBasket size={12} className="text-blue-400" />, colorClass: "text-blue-300" },
                                        { label: "Donaciones exec.", value: "3", icon: <CheckCircle2 size={12} className="text-blue-400" />, colorClass: "text-blue-200" },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-2xl py-1.5 px-3 backdrop-blur-md" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                                            {s.icon}
                                            <span className={`text-[11px] font-medium ${s.colorClass}`}>{s.value} <span className="text-white/40 font-normal text-[0.9em]">{s.label}</span></span>
                                        </div>
                                    ))}
                                </div>


                            </div>

                            {/* Two-layer progress circle or bar placeholder */}
                            <div className="animate-[impact-fadeInUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_both] delay-300 flex-none flex justify-center w-[240px] h-[240px] sm:w-auto sm:h-auto">
                                <div className="w-full h-full sm:w-[340px] sm:h-[340px] bg-white/5 rounded-full shadow-[0_0_100px_rgba(15,98,254,0.35),inset_0_0_60px_rgba(15,98,254,0.1)] flex flex-col items-center justify-center relative border border-white/10">
                                    <svg width="340" height="340" viewBox="0 0 220 220" className="absolute w-[220px] h-[220px] sm:w-[340px] sm:h-[340px]">
                                        <circle cx="110" cy="110" r="100" stroke="rgba(255,255,255,0.06)" strokeWidth="16" fill="transparent" />
                                        <circle
                                            cx="110" cy="110" r="100"
                                            stroke="#0F62FE"
                                            strokeWidth="16"
                                            fill="transparent"
                                            strokeDasharray="628"
                                            strokeDashoffset="238"
                                            strokeLinecap="round"
                                            className="animate-[impact-dash_2s_cubic-bezier(0.4,0,0.2,1)_forwards] drop-shadow-[0_0_12px_rgba(15,98,254,0.5)]"
                                        />
                                    </svg>
                                    <div className="relative z-10 text-center">
                                        <div className="text-[40px] sm:text-6xl font-medium text-white mb-1 tracking-tight">62%</div>
                                        <div className="text-[13px] text-white/60 font-medium uppercase tracking-[0.15em]">Meta de impacto</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 
        ---------------------------------------------------------
        TABS NAVIGATION & CONTENT Wrapper
        ---------------------------------------------------------
      */}
                <div className="w-full max-w-[1600px] mx-auto px-[clamp(16px,5vw,64px)] pb-10">
                    <div className="flex gap-5 sm:gap-8 border-b-2 border-slate-100 mt-6 sm:mt-10 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide px-4 sm:px-0 mx-[-16px] sm:mx-0">
                        {isStudentOrGuest && (
                            <button
                                onClick={() => setActiveTab("student")}
                                className={`py-3 text-sm sm:text-base font-medium transition-colors border-b-[3px] bg-transparent ${activeTab === "student" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                            >
                                Mi Impacto {isInstitutional ? '' : 'Social'}
                            </button>
                        )}
                        {isInstitutional && (
                            <button
                                onClick={() => setActiveTab("school")}
                                className={`py-3 text-sm sm:text-base font-medium transition-colors border-b-[3px] bg-transparent ${activeTab === "school" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                            >
                                Impacto de mi Escuela
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab("transparency")}
                            className={`py-3 text-sm sm:text-base font-medium transition-colors border-b-[3px] bg-transparent ${activeTab === "transparency" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                        >
                            Transparencia
                        </button>
                    </div>

                    {/* 
          ---------------------------------------------------------
          B) TAB 1: MI IMPACTO (Student view)
          ---------------------------------------------------------
        */}
                    {activeTab === "student" && (
                        <div className="pb-20">
                            <style>{`
                                @keyframes stat-countup {
                                    from { opacity: 0; transform: translateY(12px); }
                                    to   { opacity: 1; transform: translateY(0); }
                                }
                            `}</style>

                            {/* ── SECTION 1: HERO STATS ─────────────────────────── */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <Zap size={18} className="text-blue-600" />
                                    <h3 className="m-0 text-lg font-medium text-slate-900">Tu contribución esta semana</h3>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                                    {[
                                        { value: studentStats.lessonsCompleted, label: "Lecciones", icon: <Book size={24} className="text-blue-600" />, bg: "bg-gradient-to-br from-blue-50 to-blue-100", bgBorder: "border-blue-200", trend: "Reciente", up: true, barColor: "text-blue-600", barPct: 72, barBg: "bg-blue-100", sub: "de 14 lecciones total", accent: "bg-gradient-to-r from-blue-600 to-blue-500", glow: "shadow-[0_4px_12px_rgba(15,98,254,0.12)]" },
                                        { value: studentStats.challengesCompleted, label: "Retos Diarios", icon: <Brain size={24} className="text-blue-500" />, bg: "bg-gradient-to-br from-blue-50 to-blue-200", bgBorder: "border-blue-300", trend: "Constante", up: true, barColor: "text-blue-500", barPct: 55, barBg: "bg-blue-100", sub: "del mes completados", accent: "bg-gradient-to-r from-blue-500 to-blue-400", glow: "shadow-[0_4px_12px_rgba(59,130,246,0.12)]" },
                                        { value: studentStats.simulatorsPlayed, label: "Simuladores", icon: <Gamepad2 size={24} className="text-blue-400" />, bg: "bg-gradient-to-br from-sky-50 to-sky-200", bgBorder: "border-sky-300", trend: "Constante", up: false, barColor: "text-blue-400", barPct: 30, barBg: "bg-sky-100", sub: "simulaciones jugadas", accent: "bg-gradient-to-r from-blue-400 to-blue-300", glow: "shadow-[0_4px_12px_rgba(96,165,250,0.12)]" },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-[20px] p-4 sm:p-5 border border-black/5 shadow-[0_16px_32px_-8px_rgba(15,98,254,0.1),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_24px_48px_-12px_rgba(15,98,254,0.15),0_8px_16px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between animate-[stat-countup_0.5s_ease_both]" style={{ animationDelay: `${i * 0.07}s` }}>
                                            <div className={`absolute top-0 left-0 right-0 h-1 ${stat.accent}`} />
                                            <div>
                                                <div className="flex justify-between items-start mb-5">
                                                    <div className={`w-[52px] h-[52px] rounded-2xl ${stat.bg} border-1.5 ${stat.bgBorder} flex items-center justify-center ${stat.glow}`}>
                                                        {stat.icon}
                                                    </div>
                                                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${stat.up ? "text-emerald-500 bg-emerald-50 border-emerald-200" : "text-slate-400 bg-slate-50 border-slate-200"}`}>
                                                        {stat.up ? "↑" : "→"} {stat.trend}
                                                    </span>
                                                </div>
                                                <div className="text-[40px] sm:text-[56px] font-medium text-slate-900 leading-none mb-1.5 tracking-tight">
                                                    {stat.value}
                                                </div>
                                                <div className="text-sm font-medium text-slate-600 mb-5">{stat.label}</div>
                                            </div>
                                            {/* Progress bar */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[11px] text-slate-400">{stat.sub}</span>
                                                    <span className={`text-xs font-medium ${stat.barColor}`}>{stat.barPct}%</span>
                                                </div>
                                                <div className={`h-[7px] rounded-full ${stat.barBg} overflow-hidden`}>
                                                    <div className={`h-full rounded-full ${stat.accent} shadow-[0_0_10px_rgba(255,255,255,0.5)]`} style={{ width: `${stat.barPct}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Active student status card */}
                                <div className="mt-4 py-4 px-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border-[1.5px] border-emerald-200 rounded-2xl flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-emerald-800 mb-0.5">
                                            Eres {isInstitutional ? 'alumno' : 'usuario'} activo este mes
                                        </div>
                                        <div className="text-[13px] text-emerald-700">
                                            Has aportado un <strong>+2.4%</strong> a la tasa de {isInstitutional ? 'alumnos' : 'usuarios'} activos de {isInstitutional ? 'tu escuela' : 'Bizen'}. Sigue así para proteger el bono {isInstitutional ? 'de tu institución' : 'social'}.
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* ── SECTION 3: REAL-WORLD EQUIVALENCES ──────────── */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <Globe size={17} className="text-slate-500" />
                                    <h3 className="m-0 text-base font-medium text-slate-900">Tu aporte en el mundo real</h3>
                                    <span className="text-xs font-medium text-slate-400">estimado acumulado</span>
                                </div>
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(185px,1fr))] gap-3.5">
                                    {[
                                        { icon: <ShoppingBasket size={28} className="text-blue-600" />, value: equivalenceFood, label: "Canastas alimentarias", desc: "financiadas virtualmente", barColor: "from-blue-600/80 to-blue-600", barPct: 90, bg: "bg-blue-50" },
                                        { icon: <BookOpen size={28} className="text-blue-500" />, value: equivalenceBooks, label: "Libros de texto", desc: "para estudiantes", barColor: "from-blue-500/80 to-blue-500", barPct: 65, bg: "bg-blue-50" },
                                        { icon: <TreeDeciduous size={28} className="text-blue-400" />, value: equivalenceTrees, label: "Árboles plantados", desc: "meta virtual", barColor: "from-blue-400/80 to-blue-400", barPct: 45, bg: "bg-blue-50" },
                                        { icon: <Clock size={28} className="text-blue-300" />, value: `${equivalenceTutoring} h`, label: "De tutoría", desc: "equivalente en tiempo", barColor: "from-blue-300/80 to-blue-300", barPct: 30, bg: "bg-blue-50" },
                                    ].map((eq, i) => (
                                        <div key={i} className="bg-white border border-black/5 rounded-3xl p-6 text-center shadow-[0_16px_32px_-8px_rgba(15,98,254,0.1),0_4px_12px_rgba(0,0,0,0.03)] flex flex-col gap-2 transition-all duration-300 cursor-default hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(15,98,254,0.15),0_8px_16px_rgba(0,0,0,0.04)] animate-[stat-countup_0.5s_ease_both]" style={{ animationDelay: `${i * 0.08}s` }}>
                                            <div className={`w-14 h-14 mx-auto mb-2 rounded-2xl flex items-center justify-center ${eq.bg}`}>
                                                {eq.icon}
                                            </div>
                                            <div className="text-[44px] font-bold text-slate-900 leading-none tracking-tight">{eq.value}</div>
                                            <div className="text-sm font-semibold text-slate-700">{eq.label}</div>
                                            <div className="text-xs text-slate-400 mb-2">{eq.desc}</div>
                                            {/* Blue bar */}
                                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                <div className={`h-full rounded-full bg-gradient-to-r ${eq.barColor}`} style={{ width: `${eq.barPct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── SECTION 4: SOCIAL BADGES + CTAs ─────────────── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                                {/* CTA Actions */}
                                <div>
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <TrendingUp size={17} className="text-slate-500" />
                                        <h3 className="m-0 text-base font-medium text-slate-900">¿Cómo puedes ayudar hoy?</h3>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {/* Main CTA card */}
                                        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 rounded-3xl p-6 shadow-[0_12px_32px_rgba(15,98,254,0.25)]">
                                            <div className="mb-4">
                                                <div className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1.5">
                                                    Acción prioritaria
                                                </div>
                                                <div className="text-base font-medium text-white leading-snug">
                                                    Estás a 8% de que {isInstitutional ? 'tu escuela' : 'Bizen'} desbloquee el bono del mes
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2.5">
                                                <button
                                                    className="w-full text-left p-3.5 rounded-xl border border-white/20 bg-white/10 text-white font-bold text-sm flex justify-between items-center transition-all duration-200 hover:bg-white/15 hover:translate-x-1"
                                                    onClick={handleGoToNextLesson}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <Book size={16} /> Completa 1 lección
                                                    </span>
                                                    <ChevronRight size={16} />
                                                </button>
                                                <button
                                                    className="w-full text-left p-3.5 rounded-xl border border-white/20 bg-white/10 text-white font-bold text-sm flex justify-between items-center transition-all duration-200 hover:bg-white/15 hover:translate-x-1"
                                                    onClick={() => router.push("/mision-del-dia")}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <Zap size={16} /> Haz el reto de hoy
                                                    </span>
                                                    <ChevronRight size={16} />
                                                </button>
                                                <button
                                                    className="w-full text-left p-3.5 rounded-xl border border-white/20 bg-white/10 text-white font-bold text-sm flex justify-between items-center transition-all duration-200 hover:bg-white/15 hover:translate-x-1"
                                                    onClick={() => router.push("/forum/new")}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <MessageCircle size={16} /> Comenta en el Foro
                                                    </span>
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Secondary: active student rule explanation */}
                                        <div className="bg-[#FBFAF5] border-[1.5px] border-slate-100 rounded-2xl py-4 px-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                <span className="text-[13px] font-medium text-slate-900">¿Qué es un {isInstitutional ? 'alumno' : 'usuario'} activo?</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                {[
                                                    { rule: "3 sesiones útiles en los últimos 30 días", done: true },
                                                    { rule: "O 1 lección completa en el mes", done: true },
                                                ].map((r, i) => (
                                                    <div className="flex items-center gap-2 text-[13px]" key={i}>
                                                        <CheckCircle2 size={14} className={r.done ? "text-emerald-500" : "text-slate-300"} />
                                                        <span className={r.done ? "text-slate-700 font-semibold" : "text-slate-400 font-normal"}>{r.rule}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 py-2 px-3 bg-emerald-50 rounded-xl text-xs text-emerald-700 font-medium">
                                                ✓ Ya cumples ambas condiciones este mes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 
          ---------------------------------------------------------
          C) TAB 2: IMPACTO DE MI ESCUELA (Community view)
          ---------------------------------------------------------
        */}
                    {/* 
          ---------------------------------------------------------
          C) TAB 2: IMPACTO DE MI ESCUELA (Community view)
          ---------------------------------------------------------
        */}
                    {activeTab === "school" && (
                        <div className="pb-20">
                            <style>{`
                                @keyframes school-bar-grow {
                                    from { width: 0%; }
                                    to   { width: var(--bar-w); }
                                }
                                @keyframes school-fade-in {
                                    from { opacity: 0; transform: translateY(16px); }
                                    to   { opacity: 1; transform: translateY(0); }
                                }
                            `}</style>

                            {/* ── BIZEN TRANSPARENCY SCORE HERO (Moved) ─────────── */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 text-white relative overflow-hidden animate-[school-fade-in_0.5s_ease_both]">
                                {/* BG glow */}
                                <div className="absolute -top-[60px] -right-[60px] w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,rgba(15,98,254,0.3)_0%,transparent_70%)] pointer-events-none" />
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                    <div>
                                        <div className="text-xs font-medium text-white/50 uppercase tracking-widest mb-2">
                                            BIZEN Transparency Score
                                        </div>
                                        <div className="flex items-baseline gap-2.5 mb-3">
                                            <span className="text-[52px] font-medium leading-none text-blue-300">9.4</span>
                                            <span className="text-xl text-white/50">/10</span>
                                        </div>
                                        <p className="text-sm text-white/70 m-0 leading-relaxed max-w-[380px]">
                                            Tu escuela tiene un nivel de transparencia financiera <strong className="text-white">Excepcional</strong>. Toda donación cuenta con evidencia verificada y auditable.
                                        </p>
                                    </div>
                                    {/* Score ring */}
                                    <div className="relative shrink-0">
                                        <svg width="120" height="120" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
                                            <circle
                                                cx="60" cy="60" r="50"
                                                stroke="#10b981"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray="314"
                                                strokeDashoffset={314 * (1 - 0.94)}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-[22px] font-medium">94%</span>
                                            <span className="text-[10px] text-white/50 font-medium uppercase">Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── SECTION 1: SCHOOL KPI STRIP ─────────────────── */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 mb-8">
                                {[
                                    { icon: <Users size={24} className="text-blue-600" />, value: "62%", label: isInstitutional ? "Alumnos Activos" : "Usuarios Activos", sub: "meta: 70%", color: "text-blue-500", bg: "bg-blue-50" },
                                    { icon: <CircleDollarSign size={24} className="text-blue-600" />, value: "$45K", label: "Donado (MXN)", sub: "este ciclo", color: "text-emerald-500", bg: "bg-emerald-50" },
                                    { icon: <Book size={24} className="text-blue-600" />, value: "4.2", label: "Lecc. / Alum.", sub: "meta: 10", color: "text-violet-500", bg: "bg-violet-50" },
                                ].map((kpi, i) => (
                                    <div key={i} className="bg-white border-1.5 border-slate-100 rounded-2xl p-4 sm:p-7 flex flex-col gap-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] animate-[school-fade-in_0.5s_ease_both] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]" style={{ animationDelay: `${i * 0.07}s` }}>
                                        <div className="mb-3 flex">{kpi.icon}</div>
                                        <div className="text-[22px] sm:text-[44px] font-medium text-slate-900 leading-none">{kpi.value}</div>
                                        <div className="text-[15px] font-medium text-slate-700">{kpi.label}</div>
                                        <div className={`text-[11px] font-medium ${kpi.color} ${kpi.bg} px-2 py-0.5 rounded-full inline-block self-start mt-0.5`}>{kpi.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* ── MAIN GRID ─ left 1.3fr / right 0.7fr ─────────── */}
                            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7 items-start">

                                {/* LEFT COLUMN */}
                                <div className="flex flex-col gap-6">

                                    {/* BONUS UNLOCK TARGETS */}
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <TargetIcon size={17} className="text-blue-600" />
                                            <h3 className="m-0 text-base font-medium text-slate-900">Metas para desbloquear el Bono</h3>
                                        </div>
                                        <div className="flex flex-col gap-3.5">
                                            {targetsData.map((target: any, ti: number) => {
                                                const pct = Math.min(100, (target.currentValue / target.targetValue) * 100)
                                                return (
                                                    <div key={target.id} className="bg-white border-1.5 border-slate-100 rounded-[20px] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] animate-[school-fade-in_0.5s_ease_both]" style={{ animationDelay: `${0.1 + ti * 0.08}s` }}>
                                                        <div className="flex justify-between items-start mb-2.5">
                                                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                                <div className="text-[15px] font-medium text-slate-900 leading-tight">{target.label}</div>
                                                                <div className="text-xs text-slate-400 font-medium">Objetivo: {target.targetValue} {target.unit}</div>
                                                            </div>
                                                            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3 border ${target.status === "unlocked" ? "text-emerald-500 bg-emerald-50 border-emerald-500/20" : target.status === "near" ? "text-amber-500 bg-amber-50 border-amber-500/20" : "text-blue-600 bg-blue-50 border-blue-600/20"}`}>
                                                                {target.status === "unlocked" ? "✓ Logrado" : target.status === "near" ? "⚡ Cerca" : "En progreso"}
                                                            </span>
                                                        </div>

                                                        {/* Stacked progress bar with animated fill */}
                                                        <div className="relative mb-2.5">
                                                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-2.5 rounded-full animate-[school-bar-grow_1s_cubic-bezier(0.34,1.56,0.64,1)_both] delay-300"
                                                                    style={{
                                                                        background: target.status === "unlocked"
                                                                            ? "linear-gradient(90deg, #10b981, #34d399)"
                                                                            : target.status === "near"
                                                                                ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                                                                                : "linear-gradient(90deg, #0F62FE, #60a5fa)",
                                                                        ["--bar-w" as any]: `${pct}%`,
                                                                        width: `${pct}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className={`absolute right-0 -top-[18px] text-[11px] font-medium ${target.status === "unlocked" ? "text-emerald-500" : target.status === "near" ? "text-amber-500" : "text-blue-600"}`}>
                                                                {Math.round(pct)}%
                                                            </div>
                                                        </div>

                                                        <div className="hidden sm:flex justify-between items-center px-1">
                                                            <div className="text-[13px] font-medium text-slate-500">
                                                                Actual: <strong className="text-slate-900">{target.currentValue} {target.unit}</strong>
                                                            </div>
                                                            <div className="text-xs font-medium text-slate-500 bg-[#FBFAF5] rounded-lg px-2.5 py-1 border border-slate-100 flex items-center gap-1">
                                                                <Lightbulb size={12} className="text-blue-600" /> {target.howToHelpCTA}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="flex flex-col gap-6">




                                    {/* FOUNDATION TRUST CARD */}
                                    <div className="bg-white rounded-[24px] overflow-hidden relative border-[1.5px] border-blue-100 shadow-[0_10px_32px_rgba(15,98,254,0.08)]">
                                        {/* Top accent */}
                                        <div className="h-1 bg-gradient-to-r from-[#0F62FE] to-blue-500" />

                                        <div className="p-6">
                                            {/* Header: logo + verified */}
                                            <div className="flex items-center gap-3.5 mb-4">
                                                <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-[1.5px] border-blue-200 flex items-center justify-center shrink-0">
                                                    <Handshake size={24} className="text-[#0F62FE]" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-base font-medium text-slate-900 mb-1">{MOCK_FOUNDATION.name}</div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-[11px] font-medium text-emerald-500">Alianza verificada</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-[13px] text-slate-600 m-0 mb-5 leading-[1.6]">
                                                {MOCK_FOUNDATION.description}
                                            </p>

                                            {/* Stats row */}
                                            <div className="flex gap-3 mb-5">
                                                <div className="flex-1 bg-[#f8faff] border border-blue-100 rounded-2xl py-4 px-2.5 text-center">
                                                    <div className="text-[32px] font-medium text-[#0F62FE] leading-none mb-1">90</div>
                                                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.04em]">canastas equiv.</div>
                                                </div>
                                                <div className="flex-1 bg-[#f8faff] border border-blue-100 rounded-2xl py-4 px-2.5 text-center">
                                                    <div className="text-[32px] font-medium text-blue-500 leading-none mb-1">3</div>
                                                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.04em]">donaciones exec.</div>
                                                </div>
                                            </div>

                                            {/* Instagram CTA */}
                                            <a href={MOCK_FOUNDATION.website} target="_blank" rel="noopener noreferrer" 
                                               className="flex items-center justify-center gap-2.5 bg-blue-50 border border-blue-200 rounded-[14px] py-3 px-4 text-[13px] font-medium text-[#0F62FE] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                                <Instagram size={16} className="text-[#0F62FE]" /> Ver Instagram oficial
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 
          ---------------------------------------------------------
          D) TAB 3: TRANSPARENCIA (Evidence & Reports)
          ---------------------------------------------------------
        */}
                    {activeTab === "transparency" && (
                        <div className="pb-20">
                            <style>{`
                                @keyframes transp-fade-in {
                                    from { opacity: 0; transform: translateY(14px); }
                            `}</style>


                            {/* ── SECTION 2: REPORTS + EVIDENCE GRID ─────────── */}
                            {/* ── CONSOLIDATED TRANSPARENCY SECTION ─────────── */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-8">

                                {/* LEFT COLUMN: REPORTS + MAIN FAQ */}
                                <div className="flex flex-col gap-8">
                                    {/* REPORTS */}
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <FileText size={17} className="text-blue-600" />
                                            <h3 className="m-0 text-base font-semibold text-slate-900">Informes de Desempeño</h3>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            {[
                                                { title: "Reporte Mensual - Febrero 2026", period: "Feb 2026", size: "1.4 MB", type: "pdf", badge: "Nuevo", badgeColor: "bg-blue-600" },
                                                { title: "Reporte Mensual - Enero 2026", period: "Ene 2026", size: "1.2 MB", type: "pdf", badge: "", badgeColor: "" },
                                                { title: "Reporte Trimestral Q4", period: "Oct–Dic 2025", size: "3.1 MB", type: "pdf", badge: "", badgeColor: "" },
                                                { title: "Impacto Anual 2025", period: "Año 2025", size: "5.8 MB", type: "pdf", badge: "Auditado", badgeColor: "bg-emerald-500" },
                                            ].map((rep, i) => (
                                                <div key={i} className="bg-white border-[1.5px] border-slate-100 rounded-2xl py-4 px-5 flex justify-between items-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 animate-[transp-fade-in_0.5s_ease_both] hover:bg-blue-50 hover:border-blue-200 hover:translate-x-1" style={{ animationDelay: `${i * 0.06}s` }}>
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0">
                                                            <FileText size={20} className="text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[13px] font-semibold text-slate-900 mb-0.5 flex items-center gap-2">
                                                                {rep.period}
                                                                {rep.badge && (
                                                                    <span className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded-full ${rep.badgeColor}`}>
                                                                        {rep.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] font-semibold text-slate-400">PDF • {rep.size}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-blue-600">Descargar</span>
                                                        <ChevronRight size={16} className="text-blue-200" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MAIN FAQ */}
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <AlertTriangle size={17} className="text-amber-500" />
                                            <h3 className="m-0 text-base font-semibold text-slate-900">Preguntas frecuentes</h3>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            {[
                                                {
                                                    q: "¿De dónde viene el dinero?",
                                                    a: "BIZEN destina un porcentaje definido en contrato con tu instituto a un fondo social gestionado de forma transparente. El porcentaje base está siempre garantizado; el bono se activa si la escuela cumple sus metas colectivas.",
                                                    icon: <Briefcase size={18} className="text-blue-600" />
                                                },
                                                {
                                                    q: "¿Cómo se desbloquea el bono?",
                                                    a: "Cumpliendo 3 metas colectivas simultáneamente: (1) ≥70% de alumnos activos, (2) promedio ≥3 sesiones útiles/mes por alumno, y (3) ≥10 lecciones completas por alumno en el ciclo.",
                                                    icon: <Unlock size={18} className="text-blue-600" />
                                                },
                                                {
                                                    q: "¿Cómo se miden las métricas?",
                                                    a: "Una sesión útil requiere ≥10 minutos activos y al menos 1 acción completada (lección, reto o simulador). Un alumno activo mantiene ≥3 sesiones útiles en los últimos 30 días, o completó ≥1 lección en el mismo período.",
                                                    icon: <Ruler size={18} className="text-blue-600" />
                                                },
                                            ].map((faq, i) => (
                                                <details key={i} className="group bg-white border-[1.5px] border-slate-100 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-blue-200 open:border-blue-600/20 open:bg-[#fafeff]" style={{ animationDelay: `${i * 0.06}s` }}>
                                                    <summary className="py-4 px-5 text-[15px] font-bold cursor-pointer list-none flex justify-between items-center text-slate-900 group-open:text-blue-600 [&::-webkit-details-marker]:hidden">
                                                        <span className="flex items-center gap-2.5">
                                                            {faq.icon}
                                                            {faq.q}
                                                        </span>
                                                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0 transition-all duration-200 group-open:bg-blue-50 group-open:text-blue-600 group-open:rotate-45">+</span>
                                                    </summary>
                                                    <div className="px-5 pb-4 pt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100">{faq.a}</div>
                                                </details>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: PRIVACY + EXTRA FAQ */}
                                <div className="flex flex-col gap-8">
                                    {/* PRIVACY */}
                                    <div className="bg-gradient-to-br from-violet-50 to-violet-100 border-[1.5px] border-violet-200 rounded-[20px] p-7 animate-[transp-fade-in_0.5s_0.2s_ease_both]">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.1)]">
                                                <ShieldCheck size={24} className="text-violet-600" />
                                            </div>
                                            <div className="text-base font-bold text-violet-900">Privacidad garantizada</div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                "Datos solo en forma agregada por escuela",
                                                "No se publican nombres de menores",
                                                "Sin perfiles individuales expuestos",
                                                "Cumplimiento con LFPDPPP (México)",
                                            ].map((point, i) => (
                                                <div key={i} className="flex items-start gap-2.5 text-sm text-violet-800 font-medium">
                                                    <CheckCircle2 size={16} className="text-violet-600 mt-0.5 shrink-0" />
                                                    {point}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MORE FAQ */}
                                    <div className="flex flex-col gap-2.5">
                                        {[
                                            {
                                                q: "¿Privacidad de datos?",
                                                a: "Solo usamos métricas agregadas. Nunca publicamos nombres ni datos personales de alumnos. Todo cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
                                                icon: <Lock size={18} className="text-blue-600" />
                                            },
                                            {
                                                q: "¿Puedo ver el contrato de mi escuela?",
                                                a: "El resumen de contrato anonimizado está disponible en los informes trimestrales. Para el contrato completo, tu institución debe solicitarlo al área administrativa de BIZEN.",
                                                icon: <ClipboardCheck size={18} className="text-blue-600" />
                                            },
                                        ].map((faq, i) => (
                                            <details key={i} className="group bg-white border-[1.5px] border-slate-100 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-blue-200 open:border-blue-600/20 open:bg-[#fafeff]" style={{ animationDelay: `${(i + 3) * 0.06}s` }}>
                                                <summary className="py-4 px-5 text-[15px] font-bold cursor-pointer list-none flex justify-between items-center text-slate-900 group-open:text-blue-600 [&::-webkit-details-marker]:hidden">
                                                    <span className="flex items-center gap-2.5">
                                                        {faq.icon}
                                                        {faq.q}
                                                    </span>
                                                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0 transition-all duration-200 group-open:bg-blue-50 group-open:text-blue-600 group-open:rotate-45">+</span>
                                                </summary>
                                                <div className="px-5 pb-4 pt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100">{faq.a}</div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes transp-fade-in {
                        from { opacity: 0; transform: translateX(-16px); }
                        to   { opacity: 1; transform: translateX(0); }
                    }
                    details > summary::-webkit-details-marker {
                        display: none;
                    }
                `}</style>
            </div>
        </div>
    )
}
