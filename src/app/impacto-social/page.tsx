"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import Card from "@/components/ui/card"
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
    causeCategory: "Educación" | "Alimentación" | "Medio Ambiente"
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
    causeCategory: "Educación",
    foundation: MOCK_FOUNDATION,
    seasonStart: "2026-01-01",
    seasonEnd: "2026-12-31",
    status: "active"
}

const MOCK_TARGETS: ImpactTarget[] = [
    {
        id: "t1",
        label: "Tasa de alumnos activos",
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
    const [activeTab, setActiveTab] = useState<"student" | "school" | "transparency">("school")

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
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, border: "3px solid #0F62FE22", borderTopColor: "#0F62FE", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
        )
    }

    if (!user) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(145deg, #0a0f1e 0%, #0d1b3e 40%, #0f2761 70%, #1a3a8a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'Inter', sans-serif",
            }}>
                <style>{`
                    @keyframes is-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
                    @keyframes is-glow  { 0%,100%{opacity:.4} 50%{opacity:.8} }
                    @keyframes is-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
                    @keyframes is-fadeup { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
                    .is-cta-primary {
                        background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
                        color: #fff;
                        border: none;
                        border-radius: 18px;
                        padding: 20px 48px;
                        font-size: 18px;
                        font-weight: 800;
                        font-family: 'Inter', sans-serif;
                        cursor: pointer;
                        box-shadow: 0 8px 32px rgba(15, 98, 254, 0.45);
                        transition: transform 0.2s, box-shadow 0.2s;
                        display: inline-block;
                        text-decoration: none;
                        letter-spacing: -0.02em;
                    }
                    .is-cta-primary:hover {
                        transform: translateY(-3px) scale(1.02);
                        box-shadow: 0 16px 48px rgba(15, 98, 254, 0.6);
                    }
                    .is-cta-secondary {
                        color: rgba(255,255,255,0.75);
                        font-size: 15px;
                        font-weight: 600;
                        font-family: 'Inter', sans-serif;
                        text-decoration: none;
                        border-bottom: 1px solid rgba(255,255,255,0.3);
                        padding-bottom: 2px;
                        transition: color 0.2s, border-color 0.2s;
                        cursor: pointer;
                        background: none;
                        border-top: none;
                        border-left: none;
                        border-right: none;
                    }
                    .is-cta-secondary:hover {
                        color: #fff;
                        border-color: #fff;
                    }
                    .is-stat-pill {
                        background: rgba(255,255,255,0.07);
                        border: 1px solid rgba(255,255,255,0.12);
                        border-radius: 40px;
                        padding: 10px 22px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        backdrop-filter: blur(8px);
                        animation: is-fadeup 0.8s ease both;
                    }
                `}</style>

                {/* Ambient orbs */}
                <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,98,254,0.15) 0%, transparent 70%)", animation: "is-glow 6s ease-in-out infinite" }} />
                <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,158,255,0.10) 0%, transparent 65%)", animation: "is-glow 8s ease-in-out infinite 2s" }} />

                {/* Grid pattern overlay */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />

                {/* Main content */}
                <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 640 }}>

                    {/* Badge */}
                    <div style={{ animation: "is-fadeup 0.5s ease both", marginBottom: 32, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(15,98,254,0.15)", border: "1px solid rgba(15,98,254,0.4)", borderRadius: 40, padding: "8px 18px" }}>
                        <Heart size={14} color="#60a5fa" fill="#60a5fa" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>Impacto Social</span>
                    </div>

                    {/* Heading */}
                    <h1 style={{ animation: "is-fadeup 0.6s 0.1s ease both", fontSize: "clamp(32px, 8vw, 56px)", fontWeight: 800, color: "#fff", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                        Aprende finanzas y
                        <br />
                        <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>cambia el mundo</span>
                    </h1>

                    {/* Sub */}
                    <p style={{ animation: "is-fadeup 0.6s 0.2s ease both", fontSize: "clamp(15px, 3vw, 18px)", color: "rgba(255,255,255,0.65)", margin: "0 0 48px", lineHeight: 1.7 }}>
                        Con cada lección completada en Bizen, tu escuela dona a <strong style={{ color: "#93c5fd" }}>Nuqleo Querétaro</strong>.<br />
                        Únete y mide el impacto real de tu aprendizaje.
                    </p>

                    {/* Stats pills */}
                    <div style={{ animation: "is-fadeup 0.6s 0.25s ease both", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
                        <div className="is-stat-pill" style={{ animationDelay: "0.3s" }}>
                            <Globe size={16} color="#60a5fa" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>$45,000 MXN donados</span>
                        </div>
                        <div className="is-stat-pill" style={{ animationDelay: "0.4s" }}>
                            <Users size={16} color="#a78bfa" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>90 canastas alimentarias</span>
                        </div>
                        <div className="is-stat-pill" style={{ animationDelay: "0.5s" }}>
                            <Award size={16} color="#34d399" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>3 donaciones ejecutadas</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div style={{ animation: "is-fadeup 0.7s 0.35s ease both", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                        <Link href="/signup" className="is-cta-primary">
                            Crear cuenta gratis
                        </Link>
                        <Link href="/login" className="is-cta-secondary">
                            Ya tengo cuenta — Iniciar sesión
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
        <div className="impacto-outer" style={{
            minHeight: "100vh",
            background: "#FBFAF5",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
            color: "#1e3a5f",
            width: "100%",
            overflowX: "hidden",
            boxSizing: "border-box"
        }}>
            <style>{`
                /* Mobile - account for footer */
                @media (max-width: 767px) {
                    .impacto-outer {
                        padding-bottom: 75px !important;
                    }
                    .impacto-inner {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        padding: 0 16px !important;
                    }
                    .tab-nav {
                        gap: 20px !important;
                        padding: 0 16px !important;
                    }
                    .tab-btn {
                        font-size: 14px !important;
                        padding: 10px 0 !important;
                    }
                }
                /* Desktop/Tablet - account for left sidebar */
                @media (min-width: 768px) and (max-width: 1160px) {
                    .impacto-inner {
                        margin-left: 220px !important;
                        padding: 0 !important;
                    }
                }
                @media (min-width: 1161px) {
                    .impacto-inner {
                        margin-left: 280px !important;
                        padding: 0 !important;
                    }
                }

                /* --- NEW ANIMATIONS --- */
                @keyframes impact-fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes impact-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes impact-pulse-soft {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                }
                @keyframes impact-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                @keyframes impact-glow {
                    0%, 100% { filter: drop-shadow(0 0 4px rgba(15, 98, 254, 0.4)); }
                    50% { filter: drop-shadow(0 0 12px rgba(15, 98, 254, 0.7)); }
                }
                @keyframes impact-dash {
                    from { stroke-dashoffset: 628; }
                    to { stroke-dashoffset: 238; } /* (1 - 0.62) * 628 = 238 approx */
                }

                .impact-entrance { animation: impact-fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
                .impact-delay-1 { animation-delay: 0.1s; }
                .impact-delay-2 { animation-delay: 0.2s; }
                .impact-delay-3 { animation-delay: 0.3s; }

                .impact-shimmer-text {
                    background: linear-gradient(90deg, #1e3a5f, #0F62FE, #1e3a5f);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: impact-shimmer 4s linear infinite;
                }

                .impact-status-badge {
                    animation: impact-float 3s ease-in-out infinite;
                }
                .impact-status-badge:hover {
                    transform: scale(1.05) !important;
                    transition: all 0.3s ease;
                }
            `}</style>

            <div className="impacto-inner" style={{
                position: "relative",
                width: "auto",
                boxSizing: "border-box"
            }}>
                {/* 
            ---------------------------------------------------------
            A) IMPACTO HOME (Summary Hero) - Shared or Escuela Default
            ---------------------------------------------------------
          */}
                <div style={{
                    background: "linear-gradient(135deg, #040d1f 0%, #0a1e4e 40%, #1041a3 75%, #0F62FE 100%)",
                    padding: "clamp(40px, 6vw, 80px) 0",
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                    borderRadius: "0"
                }}>
                    {/* Expand to 1600px */}
                    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 clamp(24px, 6vw, 64px)", boxSizing: "border-box", position: "relative", zIndex: 1 }}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 500px" }}>
                                <div className="impact-entrance impact-delay-1" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                    <span style={{
                                        background: "linear-gradient(135deg, #0F62FE 0%, #3b82f6 100%)",
                                        color: "#fff",
                                        padding: "6px 14px",
                                        borderRadius: "20px",
                                        fontSize: 11,
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        boxShadow: "0 4px 12px rgba(15, 98, 254, 0.2)"
                                    }}>
                                        Causa: {MOCK_SCHOOL_IMPACT.causeCategory}
                                    </span>
                                </div>

                                <h1 className="impact-entrance impact-delay-2" style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                                    Nuestro Impacto en <br />
                                    <span style={{ background: "linear-gradient(90deg, #93c5fd, #fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{MOCK_FOUNDATION.name}</span>
                                </h1>

                                <p className="impact-entrance impact-delay-3" style={{ fontSize: 20, color: "rgba(255,255,255,0.85)", margin: "0 0 32px", lineHeight: 1.6 }}>
                                    Llevamos donados <strong style={{ color: "#fff", fontWeight: 500, fontSize: "1.1em" }}>${MOCK_SCHOOL_IMPACT.totalDonatedMXN.toLocaleString()} MXN</strong>.<br />
                                    <span style={{ fontSize: "0.9em", color: "rgba(255,255,255,0.6)" }}>
                                        Esto equivale a ≈ <strong style={{ color: "#93c5fd", fontWeight: 500 }}>{renderEquivalence(MOCK_SCHOOL_IMPACT.totalDonatedMXN)}</strong> entregadas.
                                    </span>
                                </p>

                                <div className="impact-entrance impact-delay-3" style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 8 }}>
                                    {[
                                        { label: "Donado este ciclo", value: "$45K MXN", icon: <Globe size={12} color="#60a5fa" /> },
                                        { label: "Canastas equiv.", value: "90", icon: <ShoppingBasket size={12} color="#60a5fa" /> },
                                        { label: "Donaciones exec.", value: "3", icon: <CheckCircle2 size={12} color="#60a5fa" /> },
                                    ].map((s, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "6px 12px", backdropFilter: "blur(8px)", animationDelay: `${0.3 + i * 0.1}s` }}>
                                            {s.icon}
                                            <span style={{ fontSize: 11, fontWeight: 500, color: i === 0 ? "#60a5fa" : i === 1 ? "#93c5fd" : "#bfdbfe" }}>{s.value} <span style={{ color: "rgba(255,255,255,0.40)", fontWeight: 400, fontSize: "0.9em" }}>{s.label}</span></span>
                                        </div>
                                    ))}
                                </div>


                            </div>

                            {/* Two-layer progress circle or bar placeholder */}
                            <div className="impact-entrance impact-delay-3" style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
                                <div style={{
                                    width: 380, height: 380,
                                    background: "rgba(255,255,255,0.04)",
                                    borderRadius: "50%",
                                    boxShadow: "0 0 100px rgba(15,98,254,0.35), inset 0 0 60px rgba(15,98,254,0.1)",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    position: "relative",
                                    border: "1px solid rgba(255,255,255,0.08)"
                                }}>
                                    <svg width="340" height="340" viewBox="0 0 220 220" style={{ position: "absolute" }}>
                                        <circle cx="110" cy="110" r="100" stroke="rgba(255,255,255,0.06)" strokeWidth="16" fill="transparent" />
                                        <circle
                                            cx="110" cy="110" r="100"
                                            stroke="#0F62FE"
                                            strokeWidth="16"
                                            fill="transparent"
                                            strokeDasharray="628"
                                            strokeDashoffset="238"
                                            strokeLinecap="round"
                                            style={{
                                                animation: "impact-dash 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                                                filter: "drop-shadow(0 0 12px rgba(15, 98, 254, 0.5))"
                                            }}
                                        />
                                    </svg>
                                    <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                                        <div style={{ fontSize: 64, fontWeight: 500, color: "#fff", marginBottom: 4, letterSpacing: "-0.04em" }}>62%</div>
                                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.15em" }}>Meta de impacto</div>
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
                <div className="impacto-tabs-container" style={{
                    width: "100%",
                    maxWidth: "1600px",
                    margin: "0 auto",
                    padding: "0 clamp(24px, 6vw, 64px)",
                    boxSizing: "border-box"
                }}>
                    <div className="tab-nav" style={{
                        display: "flex",
                        gap: "30px",
                        borderBottom: "2px solid #f1f5f9",
                        marginTop: "40px",
                        marginBottom: "32px",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}>
                        <style>{`
                            .tab-nav::-webkit-scrollbar { display: none; }
                        `}</style>
                        {isStudentOrGuest && (
                            <button
                                className="tab-btn"
                                onClick={() => setActiveTab("student")}
                                style={{
                                    padding: "12px 0",
                                    borderBottom: activeTab === "student" ? "3px solid #0F62FE" : "3px solid transparent",
                                    color: activeTab === "student" ? "#0F62FE" : "#64748b",
                                    fontWeight: 500,
                                    fontSize: 16,
                                    background: "none",
                                    borderTop: "none", borderLeft: "none", borderRight: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                Mi Impacto
                            </button>
                        )}
                        <button
                            className="tab-btn"
                            onClick={() => setActiveTab("school")}
                            style={{
                                padding: "12px 0",
                                borderBottom: activeTab === "school" ? "3px solid #0F62FE" : "3px solid transparent",
                                color: activeTab === "school" ? "#0F62FE" : "#64748b",
                                fontWeight: 500,
                                fontSize: 16,
                                background: "none",
                                borderTop: "none", borderLeft: "none", borderRight: "none",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            Impacto de mi Escuela
                        </button>
                        <button
                            className="tab-btn"
                            onClick={() => setActiveTab("transparency")}
                            style={{
                                padding: "12px 0",
                                borderBottom: activeTab === "transparency" ? "3px solid #0F62FE" : "3px solid transparent",
                                color: activeTab === "transparency" ? "#0F62FE" : "#64748b",
                                fontWeight: 500,
                                fontSize: 16,
                                background: "none",
                                borderTop: "none", borderLeft: "none", borderRight: "none",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
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
                        <div style={{ paddingBottom: 80 }}>
                            <style>{`
                                @keyframes stat-countup {
                                    from { opacity: 0; transform: translateY(12px); }
                                    to   { opacity: 1; transform: translateY(0); }
                                }
                                .student-stat-card {
                                    background: #fff;
                                    border-radius: 20px;
                                    padding: clamp(20px, 3vw, 28px);
                                    border: 1.5px solid #e8f0fe;
                                    box-shadow: 0 4px 24px rgba(15,98,254,0.06), 0 1px 4px rgba(0,0,0,0.04);
                                    transition: transform 0.22s ease, box-shadow 0.22s ease;
                                    animation: stat-countup 0.5s ease both;
                                    position: relative;
                                    overflow: hidden;
                                }
                                .student-stat-card::before {
                                    content: '';
                                    position: absolute;
                                    top: 0; left: 0; right: 0;
                                    height: 3px;
                                    background: var(--card-accent, linear-gradient(90deg, #0F62FE, #3b82f6));
                                    border-radius: 20px 20px 0 0;
                                }
                                .student-stat-card:hover {
                                    transform: translateY(-4px);
                                    box-shadow: 0 20px 48px rgba(15,98,254,0.13), 0 4px 12px rgba(0,0,0,0.06);
                                }
                                .day-dot {
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 3px;
                                    transition: transform 0.15s ease;
                                }
                                .day-dot:hover { transform: scale(1.5); }
                                .badge-chip {
                                    border-radius: 16px;
                                    padding: 12px 0;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                    transition: transform 0.2s ease;
                                }
                                .badge-chip:hover { transform: translateX(4px); }
                                .cta-action-btn {
                                    text-align: left;
                                    width: 100%;
                                    padding: 14px 16px;
                                    border-radius: 12px;
                                    border: 1.5px solid rgba(255,255,255,0.2);
                                    background: rgba(255,255,255,0.08);
                                    color: #fff;
                                    cursor: pointer;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    font-size: 14px;
                                    font-weight: 700;
                                    font-family: 'Inter', sans-serif;
                                    transition: background 0.2s, transform 0.15s;
                                }
                                .cta-action-btn:hover {
                                    background: rgba(255,255,255,0.15);
                                    transform: translateX(3px);
                                }
                                .student-grid {
                                    display: grid;
                                    grid-template-columns: repeat(4, 1fr);
                                    gap: clamp(12px, 2vw, 20px);
                                }
                                @media (max-width: 1024px) {
                                    .student-grid {
                                        grid-template-columns: repeat(2, 1fr);
                                    }
                                }
                                @media (max-width: 480px) {
                                    .student-grid {
                                        grid-template-columns: 1fr;
                                    }
                                }
                                .student-main-layout {
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    gap: 32px;
                                    align-items: start;
                                }
                                @media (max-width: 1160px) {
                                    .student-main-layout {
                                        grid-template-columns: 1fr;
                                    }
                                }
                            `}</style>

                            {/* ── SECTION 1: HERO STATS ─────────────────────────── */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                    <Zap size={18} color="#0F62FE" />
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: "#0f172a" }}>Tu contribución esta semana</h3>
                                </div>
                                <div className="student-grid">
                                    {[
                                        { value: studentStats.lessonsCompleted, label: "Lecciones", icon: <Book size={22} color="#0F62FE" />, bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", bgBorder: "#bfdbfe", trend: "Reciente", up: true, barColor: "#0F62FE", barPct: 72, barBg: "#dbeafe", sub: "de 14 lecciones total", accent: "linear-gradient(90deg, #0F62FE, #3b82f6)", glow: "rgba(15,98,254,0.12)" },
                                        { value: studentStats.challengesCompleted, label: "Retos Diarios", icon: <Brain size={22} color="#3b82f6" />, bg: "linear-gradient(135deg, #eff6ff, #bfdbfe)", bgBorder: "#93c5fd", trend: "Constante", up: true, barColor: "#3b82f6", barPct: 55, barBg: "#dbeafe", sub: "del mes completados", accent: "linear-gradient(90deg, #3b82f6, #60a5fa)", glow: "rgba(59,130,246,0.12)" },
                                        { value: studentStats.simulatorsPlayed, label: "Simuladores", icon: <Gamepad2 size={22} color="#60a5fa" />, bg: "linear-gradient(135deg, #f0f9ff, #bae6fd)", bgBorder: "#7dd3fc", trend: "Constante", up: false, barColor: "#60a5fa", barPct: 30, barBg: "#e0f2fe", sub: "simulaciones jugadas", accent: "linear-gradient(90deg, #60a5fa, #93c5fd)", glow: "rgba(96,165,250,0.12)" },
                                    ].map((stat, i) => (
                                        <div key={i} className="student-stat-card" style={{ animationDelay: `${i * 0.07}s`, display: "flex", flexDirection: "column", justifyContent: "space-between", ['--card-accent' as any]: stat.accent }}>
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                                                    <div style={{
                                                        width: 52, height: 52, borderRadius: 16,
                                                        background: stat.bg,
                                                        border: `1.5px solid ${stat.bgBorder}`,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        boxShadow: `0 4px 12px ${stat.glow}`
                                                    }}>
                                                        {stat.icon}
                                                    </div>
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 500,
                                                        color: stat.up ? "#10b981" : "#94a3b8",
                                                        background: stat.up ? "#ecfdf5" : "#f8fafc",
                                                        border: `1px solid ${stat.up ? "#a7f3d0" : "#e2e8f0"}`,
                                                        padding: "4px 10px", borderRadius: 99
                                                    }}>
                                                        {stat.up ? "↑" : "→"} {stat.trend}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: 56, fontWeight: 500, color: "#0f172a", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.03em" }}>
                                                    {stat.value}
                                                </div>
                                                <div style={{ fontSize: 14, fontWeight: 500, color: "#475569", marginBottom: 20 }}>{stat.label}</div>
                                            </div>
                                            {/* Progress bar */}
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{stat.sub}</span>
                                                    <span style={{ fontSize: 12, fontWeight: 500, color: stat.barColor }}>{stat.barPct}%</span>
                                                </div>
                                                <div style={{ height: 7, borderRadius: 99, background: stat.barBg, overflow: "hidden" }}>
                                                    <div style={{
                                                        height: "100%",
                                                        width: `${stat.barPct}%`,
                                                        borderRadius: 99,
                                                        background: stat.accent,
                                                        boxShadow: `0 0 10px ${stat.glow}`
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Active student status card */}
                                <div style={{
                                    marginTop: 16, padding: "16px 20px",
                                    background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                                    border: "1.5px solid #a7f3d0",
                                    borderRadius: 16,
                                    display: "flex", alignItems: "center", gap: 14
                                }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: "50%",
                                        background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0
                                    }}>
                                        <CheckCircle2 size={20} color="#fff" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: "#065f46", marginBottom: 2 }}>
                                            Eres alumno activo este mes
                                        </div>
                                        <div style={{ fontSize: 13, color: "#047857" }}>
                                            Has aportado un <strong>+2.4%</strong> a la tasa de alumnos activos de tu escuela. Sigue así para proteger el bono de tu institución.
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* ── SECTION 3: REAL-WORLD EQUIVALENCES ──────────── */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                    <Globe size={17} color="#64748b" />
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#0f172a" }}>Tu aporte en el mundo real</h3>
                                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>estimado acumulado</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                                    {[
                                        { icon: <ShoppingBasket size={28} color="#0F62FE" />, value: equivalenceFood, label: "Canastas alimentarias", desc: "financiadas virtualmente", barColor: "#0F62FE", barPct: 90, bg: "#eff6ff" },
                                        { icon: <BookOpen size={28} color="#3b82f6" />, value: equivalenceBooks, label: "Libros de texto", desc: "para estudiantes", barColor: "#3b82f6", barPct: 65, bg: "#eff6ff" },
                                        { icon: <TreeDeciduous size={28} color="#60a5fa" />, value: equivalenceTrees, label: "Árboles plantados", desc: "meta virtual", barColor: "#60a5fa", barPct: 45, bg: "#eff6ff" },
                                        { icon: <Clock size={28} color="#93c5fd" />, value: `${equivalenceTutoring} h`, label: "De tutoría", desc: "equivalente en tiempo", barColor: "#93c5fd", barPct: 30, bg: "#eff6ff" },
                                    ].map((eq, i) => (
                                        <div key={i} style={{
                                            background: "#fff", border: "1.5px solid #e0eaff",
                                            borderRadius: 18, padding: "20px",
                                            textAlign: "center",
                                            boxShadow: "0 2px 16px rgba(15,98,254,0.06)",
                                            animation: `stat-countup 0.5s ${i * 0.08}s ease both`,
                                            display: "flex", flexDirection: "column", gap: 8
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "center", padding: "8px", borderRadius: 12, background: eq.bg, width: 48, height: 48, alignItems: "center", margin: "0 auto 4px" }}>{eq.icon}</div>
                                            <div style={{ fontSize: 40, fontWeight: 500, color: "#0f172a", lineHeight: 1 }}>{eq.value}</div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{eq.label}</div>
                                            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{eq.desc}</div>
                                            {/* Blue bar */}
                                            <div style={{ height: 4, borderRadius: 99, background: "#dbeafe", overflow: "hidden" }}>
                                                <div style={{
                                                    height: "100%",
                                                    width: `${eq.barPct}%`,
                                                    borderRadius: 99,
                                                    background: `linear-gradient(90deg, ${eq.barColor}aa, ${eq.barColor})`,
                                                    boxShadow: `0 0 6px ${eq.barColor}55`
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── SECTION 4: SOCIAL BADGES + CTAs ─────────────── */}
                            <div className="student-main-layout">

                                {/* CTA Actions */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                        <TrendingUp size={17} color="#64748b" />
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#0f172a" }}>¿Cómo puedes ayudar hoy?</h3>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {/* Main CTA card */}
                                        <div style={{
                                            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
                                            borderRadius: 20, padding: "24px",
                                            boxShadow: "0 12px 32px rgba(15, 98, 254, 0.25)"
                                        }}>
                                            <div style={{ marginBottom: 16 }}>
                                                <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                                                    Acción prioritaria
                                                </div>
                                                <div style={{ fontSize: 16, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>
                                                    Estás a 8% de que tu escuela desbloquee el bono del mes
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                <button
                                                    className="cta-action-btn"
                                                    onClick={handleGoToNextLesson}
                                                >
                                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <Book size={16} /> Completa 1 lección
                                                    </span>
                                                    <ChevronRight size={16} />
                                                </button>
                                                <button
                                                    className="cta-action-btn"
                                                    onClick={() => router.push("/reto-diario")}
                                                >
                                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <Zap size={16} /> Haz el reto de hoy
                                                    </span>
                                                    <ChevronRight size={16} />
                                                </button>
                                                <button
                                                    className="cta-action-btn"
                                                    onClick={() => router.push("/forum/new")}
                                                >
                                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <MessageCircle size={16} /> Comenta en el Foro
                                                    </span>
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Secondary: active student rule explanation */}
                                        <div style={{
                                            background: "#FBFAF5", border: "1.5px solid #f1f5f9",
                                            borderRadius: 16, padding: "18px 20px",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                                                <span style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>¿Qué es un alumno activo?</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {[
                                                    { rule: "3 sesiones útiles en los últimos 30 días", done: true },
                                                    { rule: "O 1 lección completa en el mes", done: true },
                                                ].map((r, i) => (
                                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                                                        <CheckCircle2 size={14} color={r.done ? "#10b981" : "#cbd5e1"} />
                                                        <span style={{ color: r.done ? "#374151" : "#94a3b8", fontWeight: r.done ? 600 : 400 }}>{r.rule}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: 12, padding: "8px 12px", background: "#ecfdf5", borderRadius: 10, fontSize: 12, color: "#047857", fontWeight: 500 }}>
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
                    {activeTab === "school" && (
                        <div style={{ paddingBottom: 80 }}>
                            <style>{`
                                @keyframes school-bar-grow {
                                    from { width: 0%; }
                                    to   { width: var(--bar-w); }
                                }
                                @keyframes school-fade-in {
                                    from { opacity: 0; transform: translateY(16px); }
                                    to   { opacity: 1; transform: translateY(0); }
                                }
                                .school-kpi-card {
                                    background: #fff;
                                    border: 1.5px solid #f1f5f9;
                                    border-radius: 18px;
                                    padding: 20px;
                                    display: flex;
                                    flex-direction: column;
                                    gap: 6px;
                                    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                                    animation: school-fade-in 0.5s ease both;
                                    transition: transform 0.2s, box-shadow 0.2s;
                                }
                                .school-kpi-card:hover {
                                    transform: translateY(-3px);
                                    box-shadow: 0 10px 28px rgba(0,0,0,0.08);
                                }
                                .target-card {
                                    background: #fff;
                                    border: 1.5px solid #f1f5f9;
                                    border-radius: 20px;
                                    padding: 24px;
                                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                                    animation: school-fade-in 0.5s ease both;
                                }
                                .classroom-bar {
                                    height: 10px;
                                    border-radius: 99px;
                                    animation: school-bar-grow 1s cubic-bezier(0.34,1.56,0.64,1) both;
                                    animation-delay: 0.3s;
                                }
                                .timeline-dot {
                                    width: 12px; height: 12px;
                                    border-radius: 50%;
                                    flex-shrink: 0;
                                    border: 2px solid;
                                }
                                .school-kpi-grid {
                                    display: grid;
                                    grid-template-columns: repeat(4, 1fr);
                                    gap: 14px;
                                    margin-bottom: 32px;
                                }
                                @media (max-width: 1024px) {
                                    .school-kpi-grid { grid-template-columns: repeat(2, 1fr); }
                                }
                                @media (max-width: 480px) {
                                    .school-kpi-grid { gap: 8px; }
                                    .school-kpi-card { padding: 16px; }
                                    .school-kpi-card div:nth-child(2) { font-size: 22px !important; }
                                }
                                .school-main-layout {
                                    display: grid;
                                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                                    gap: 28px;
                                    align-items: start;
                                }
                                .meter-container {
                                    padding: 20px;
                                    background: rgba(255,255,255,0.05);
                                    border-radius: 16px;
                                    border: 1px solid rgba(255,255,255,0.1);
                                }
                                @media (max-width: 600px) {
                                    .meter-container { padding: 14px; }
                                    .timeline-labels { display: none !important; }
                                }
                            `}</style>

                            {/* ── BIZEN TRANSPARENCY SCORE HERO (Moved) ─────────── */}
                            <div style={{
                                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                                borderRadius: 24, padding: "32px", marginBottom: 32,
                                color: "#fff", position: "relative", overflow: "hidden",
                                animation: "school-fade-in 0.5s ease both"
                            }}>
                                {/* BG glow */}
                                <div style={{
                                    position: "absolute", top: -60, right: -60,
                                    width: 240, height: 240,
                                    background: "radial-gradient(circle, rgba(15,98,254,0.3) 0%, transparent 70%)",
                                    borderRadius: "50%", pointerEvents: "none"
                                }} />
                                <div className="transp-hero-layout" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                                            BIZEN Transparency Score
                                        </div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                                            <span style={{ fontSize: 52, fontWeight: 500, lineHeight: 1, color: "#93c5fd" }}>9.4</span>
                                            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>/10</span>
                                        </div>
                                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 20px", lineHeight: 1.6, maxWidth: 380 }}>
                                            Tu escuela tiene un nivel de transparencia financiera <strong style={{ color: "#fff" }}>Excepcional</strong>. Toda donación cuenta con evidencia verificada y auditable.
                                        </p>
                                        <div className="trust-badge-container" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                            {[
                                                { label: "Auditoría Independiente", color: "#10b981" },
                                                { label: "Reportes Públicos", color: "#8b5cf6" },
                                            ].map((b, i) => (
                                                <span key={i} className="trust-badge" style={{ border: `1.5px solid ${b.color}44`, background: `${b.color}15`, color: "#fff", fontSize: 11, display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: b.color }} />
                                                    {b.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Score ring */}
                                    <div style={{ position: "relative", flexShrink: 0 }}>
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
                                                style={{ filter: "drop-shadow(0 0 8px rgba(16,185,129,0.6))" }}
                                            />
                                        </svg>
                                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: 22, fontWeight: 500 }}>94%</span>
                                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500, textTransform: "uppercase" }}>Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── SECTION 1: SCHOOL KPI STRIP ─────────────────── */}
                            <div className="school-kpi-grid">
                                {[
                                    { icon: <School size={24} color="#0F62FE" />, value: "62%", label: "Alumnos Activos", sub: "meta: 70%", color: "#3b82f6", bg: "#eff6ff" },
                                    { icon: <CircleDollarSign size={24} color="#0F62FE" />, value: "$45K", label: "Donado (MXN)", sub: "este ciclo", color: "#10b981", bg: "#ecfdf5" },

                                    { icon: <Book size={24} color="#0F62FE" />, value: "4.2", label: "Lecc. / Alum.", sub: "meta: 10", color: "#8b5cf6", bg: "#f5f3ff" },
                                ].map((kpi, i) => (
                                    <div key={i} className="school-kpi-card" style={{ animationDelay: `${i * 0.07}s`, padding: "28px" }}>
                                        <div style={{ marginBottom: 12, display: "flex" }}>{kpi.icon}</div>
                                        <div style={{ fontSize: 44, fontWeight: 500, color: i === 0 ? "#0F62FE" : i === 1 ? "#3b82f6" : "#60a5fa", lineHeight: 1 }}>{kpi.value}</div>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: "#374151" }}>{kpi.label}</div>
                                        <div style={{
                                            fontSize: 11, fontWeight: 500,
                                            color: kpi.color,
                                            background: kpi.bg,
                                            padding: "2px 8px", borderRadius: 99,
                                            alignSelf: "flex-start", marginTop: 2
                                        }}>{kpi.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* ── MAIN GRID ─ left 1.3fr / right 0.7fr ─────────── */}
                            <div className="school-main-layout">

                                {/* LEFT COLUMN */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                                    {/* BONUS UNLOCK TARGETS */}
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                            <TargetIcon size={17} color="#0F62FE" />
                                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#0f172a" }}>Metas para desbloquear el Bono</h3>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            {targetsData.map((target: any, ti: number) => {
                                                const pct = Math.min(100, (target.currentValue / target.targetValue) * 100)
                                                // ... (keep the rest)
                                                const statusColor = target.status === "unlocked" ? "#10b981" : target.status === "near" ? "#f59e0b" : "#0F62FE"
                                                const statusBg = target.status === "unlocked" ? "#ecfdf5" : target.status === "near" ? "#fffbeb" : "#eff6ff"
                                                const statusText = target.status === "unlocked" ? "✓ Logrado" : target.status === "near" ? "⚡ Cerca" : "En progreso"
                                                return (
                                                    <div key={target.id} className="target-card" style={{ animationDelay: `${0.1 + ti * 0.08}s` }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: 15, fontWeight: 500, color: "#0f172a", marginBottom: 3 }}>{target.label}</div>
                                                                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Objetivo: {target.targetValue} {target.unit}</div>
                                                            </div>
                                                            <span style={{
                                                                fontSize: 11, fontWeight: 500,
                                                                color: statusColor, background: statusBg,
                                                                border: `1px solid ${statusColor}33`,
                                                                padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap", marginLeft: 12
                                                            }}>{statusText}</span>
                                                        </div>

                                                        {/* Stacked progress bar with animated fill */}
                                                        <div style={{ position: "relative", marginBottom: 10 }}>
                                                            <div style={{ width: "100%", height: 10, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                                                                <div
                                                                    className="classroom-bar"
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
                                                            <div style={{
                                                                position: "absolute", right: 0, top: -18,
                                                                fontSize: 11, fontWeight: 500, color: statusColor
                                                            }}>{Math.round(pct)}%</div>
                                                        </div>

                                                        <div className="timeline-labels" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
                                                            <div style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>
                                                                Actual: <strong style={{ color: "#0f172a" }}>{target.currentValue} {target.unit}</strong>
                                                            </div>
                                                            <div style={{
                                                                fontSize: 12, fontWeight: 500, color: "#64748b",
                                                                background: "#FBFAF5", borderRadius: 8,
                                                                padding: "4px 10px", border: "1px solid #f1f5f9"
                                                            }}>
                                                                <Lightbulb size={12} color="#0F62FE" /> {target.howToHelpCTA}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>

                                {/* RIGHT COLUMN */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>




                                    {/* FOUNDATION TRUST CARD */}
                                    <div style={{
                                        background: "#fff",
                                        borderRadius: 24,
                                        overflow: "hidden",
                                        position: "relative",
                                        border: "1.5px solid #e0e7ff",
                                        boxShadow: "0 10px 32px rgba(15,98,254,0.08)"
                                    }}>
                                        {/* Top accent */}
                                        <div style={{ height: 4, background: "linear-gradient(90deg, #0F62FE, #3b82f6)" }} />

                                        <div style={{ padding: "24px" }}>
                                            {/* Header: logo + verified */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                                                <div style={{
                                                    width: 52, height: 52, borderRadius: 16,
                                                    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                                                    border: "1.5px solid #bfdbfe",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    flexShrink: 0
                                                }}>
                                                    <Handshake size={24} color="#0F62FE" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", marginBottom: 3 }}>{MOCK_FOUNDATION.name}</div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                                                        <span style={{ fontSize: 11, color: "#10b981", fontWeight: 500 }}>Alianza verificada</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p style={{ fontSize: 13, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 }}>
                                                {MOCK_FOUNDATION.description}
                                            </p>

                                            {/* Stats row */}
                                            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                                                <div style={{ flex: 1, background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: 16, padding: "16px 10px", textAlign: "center" }}>
                                                    <div style={{ fontSize: 32, fontWeight: 500, color: "#0F62FE", lineHeight: 1, marginBottom: 4 }}>90</div>
                                                    <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>canastas equiv.</div>
                                                </div>
                                                <div style={{ flex: 1, background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: 16, padding: "16px 10px", textAlign: "center" }}>
                                                    <div style={{ fontSize: 32, fontWeight: 500, color: "#3b82f6", lineHeight: 1, marginBottom: 4 }}>3</div>
                                                    <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>donaciones exec.</div>
                                                </div>
                                            </div>

                                            {/* Instagram CTA */}
                                            <a href={MOCK_FOUNDATION.website} target="_blank" rel="noopener noreferrer" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                                background: "#eff6ff", border: "1px solid #bfdbfe",
                                                borderRadius: 14, padding: "12px 16px",
                                                fontSize: 13, fontWeight: 500, color: "#0F62FE", textDecoration: "none",
                                                transition: "all 0.2s ease"
                                            }} className="cta-hover-effect">
                                                <Instagram size={16} color="#0F62FE" /> Ver Instagram oficial
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
                        <div style={{ paddingBottom: 80 }}>
                            <style>{`
                                @keyframes transp-fade-in {
                                    from { opacity: 0; transform: translateY(14px); }
                                    to   { opacity: 1; transform: translateY(0); }
                                }
                                .transp-card {
                                    background: #fff;
                                    border: 1.5px solid #f1f5f9;
                                    border-radius: 20px;
                                    box-shadow: 0 2px 14px rgba(0,0,0,0.04);
                                    animation: transp-fade-in 0.5s ease both;
                                    transition: transform 0.2s, box-shadow 0.2s;
                                }
                                .transp-card:hover {
                                    transform: translateY(-2px);
                                    box-shadow: 0 10px 28px rgba(0,0,0,0.08);
                                }
                                .report-card {
                                    background: #fff;
                                    border: 1.5px solid #f1f5f9;
                                    border-radius: 16px;
                                    padding: 18px 20px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    animation: transp-fade-in 0.5s ease both;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                                }
                                .report-card:hover {
                                    background: #eff6ff;
                                    border-color: #bfdbfe;
                                    transform: translateX(4px);
                                }
                                .faq-item {
                                    border: 1.5px solid #f1f5f9;
                                    border-radius: 16px;
                                    overflow: hidden;
                                    transition: border-color 0.2s;
                                }
                                .faq-item:hover {
                                    border-color: #bfdbfe;
                                }
                                .faq-item[open] {
                                    border-color: #0F62FE33;
                                    background: #fafeff;
                                }
                                .faq-item summary {
                                    padding: 18px 20px;
                                    font-size: 15px;
                                    font-weight: 700;
                                    cursor: pointer;
                                    list-style: none;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    color: #0f172a;
                                }
                                .faq-item summary::-webkit-details-marker { display: none; }
                                .faq-item[open] summary { color: #0F62FE; }
                                .faq-toggle {
                                    width: 24px; height: 24px;
                                    border-radius: 50%;
                                    background: #f1f5f9;
                                    display: flex; align-items: center; justify-content: center;
                                    font-size: 14px; font-weight: 700;
                                    color: #64748b;
                                    flex-shrink: 0;
                                    transition: all 0.2s;
                                }
                                .faq-item[open] .faq-toggle {
                                    background: #eff6ff;
                                    color: #0F62FE;
                                    transform: rotate(45deg);
                                }
                                .faq-body {
                                    padding: 0 20px 18px;
                                    font-size: 14px;
                                    color: #475569;
                                    line-height: 1.7;
                                    border-top: 1px solid #f1f5f9;
                                    padding-top: 14px;
                                }
                                .trust-badge {
                                    display: flex; align-items: center; gap: 8px;
                                    background: #fff;
                                    border: 1.5px solid #f1f5f9;
                                    border-radius: 12px;
                                    padding: 10px 14px;
                                    font-size: 12px; font-weight: 700; color: #374151;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                    animation: transp-fade-in 0.5s ease both;
                                }
                                .evidence-row {
                                    display: flex; align-items: flex-start; gap: 16px;
                                    animation: transp-fade-in 0.5s ease both;
                                }
                                .evidence-row:hover .evidence-inner {
                                    background: #fafeff;
                                    border-color: #bfdbfe;
                                }
                                .evidence-inner {
                                    flex: 1;
                                    background: #fff;
                                    border: 1.5px solid #f1f5f9;
                                    border-radius: 16px;
                                    padding: 18px 20px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    gap: 12px;
                                    flex-wrap: wrap;
                                    transition: all 0.2s;
                                }
                                .transp-hero-layout {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: flex-start;
                                    gap: 24px;
                                }
                                @media (max-width: 768px) {
                                    .transp-hero-layout {
                                        flex-direction: column;
                                        align-items: center;
                                        text-align: center;
                                    }
                                    .trust-badge-container {
                                        justify-content: center !important;
                                    }
                                }
                                .transp-grid {
                                    display: grid;
                                    grid-template-columns: repeat(2, 1fr);
                                    gap: 28px;
                                    margin-bottom: 32px;
                                }
                                @media (max-width: 900px) {
                                    .transp-grid { grid-template-columns: 1fr; }
                                    .evidence-inner { flex-direction: column; align-items: flex-start !important; }
                                }
                            `}</style>


                            {/* ── SECTION 2: REPORTS + EVIDENCE GRID ─────────── */}
                            {/* ── CONSOLIDATED TRANSPARENCY SECTION ─────────── */}
                            <div className="transp-grid">

                                {/* LEFT COLUMN: REPORTS + MAIN FAQ */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    {/* REPORTS */}
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                            <FileText size={17} color="#0F62FE" />
                                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0f172a" }}>Informes de Desempeño</h3>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {[
                                                { title: "Reporte Mensual - Febrero 2026", period: "Feb 2026", size: "1.4 MB", type: "pdf", badge: "Nuevo", badgeColor: "#0F62FE" },
                                                { title: "Reporte Mensual - Enero 2026", period: "Ene 2026", size: "1.2 MB", type: "pdf", badge: "", badgeColor: "" },
                                                { title: "Reporte Trimestral Q4", period: "Oct–Dic 2025", size: "3.1 MB", type: "pdf", badge: "", badgeColor: "" },
                                                { title: "Impacto Anual 2025", period: "Año 2025", size: "5.8 MB", type: "pdf", badge: "Auditado", badgeColor: "#10b981" },
                                            ].map((rep, i) => (
                                                <div key={i} className="report-card" style={{ animationDelay: `${i * 0.06}s` }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                                        <div style={{
                                                            width: 42, height: 42, borderRadius: 12,
                                                            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            flexShrink: 0
                                                        }}>
                                                            <FileText size={20} color="#0F62FE" />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                                                                {rep.period}
                                                                {rep.badge && (
                                                                    <span style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: rep.badgeColor, padding: "2px 7px", borderRadius: 99 }}>
                                                                        {rep.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>PDF • {rep.size}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0F62FE" }}>Descargar</span>
                                                        <ChevronRight size={16} color="#bfdbfe" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MAIN FAQ */}
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                            <AlertTriangle size={17} color="#f59e0b" />
                                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0f172a" }}>Preguntas frecuentes</h3>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {[
                                                {
                                                    q: "¿De dónde viene el dinero?",
                                                    a: "BIZEN destina un porcentaje definido en contrato con tu instituto a un fondo social gestionado de forma transparente. El porcentaje base está siempre garantizado; el bono se activa si la escuela cumple sus metas colectivas.",
                                                    icon: <Briefcase size={18} color="#0F62FE" />
                                                },
                                                {
                                                    q: "¿Cómo se desbloquea el bono?",
                                                    a: "Cumpliendo 3 metas colectivas simultáneamente: (1) ≥70% de alumnos activos, (2) promedio ≥3 sesiones útiles/mes por alumno, y (3) ≥10 lecciones completas por alumno en el ciclo.",
                                                    icon: <Unlock size={18} color="#0F62FE" />
                                                },
                                                {
                                                    q: "¿Cómo se miden las métricas?",
                                                    a: "Una sesión útil requiere ≥10 minutos activos y al menos 1 acción completada (lección, reto o simulador). Un alumno activo mantiene ≥3 sesiones útiles en los últimos 30 días, o completó ≥1 lección en el mismo período.",
                                                    icon: <Ruler size={18} color="#0F62FE" />
                                                },
                                            ].map((faq, i) => (
                                                <details key={i} className="faq-item" style={{ animationDelay: `${i * 0.06}s` }}>
                                                    <summary>
                                                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                            {faq.icon}
                                                            {faq.q}
                                                        </span>
                                                        <span className="faq-toggle">+</span>
                                                    </summary>
                                                    <div className="faq-body">{faq.a}</div>
                                                </details>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: PRIVACY + EXTRA FAQ */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    {/* PRIVACY */}
                                    <div style={{
                                        background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
                                        border: "1.5px solid #ddd6fe",
                                        borderRadius: 20, padding: "28px",
                                        animation: "transp-fade-in 0.5s 0.2s ease both"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.1)" }}>
                                                <ShieldCheck size={24} color="#7c3aed" />
                                            </div>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: "#4c1d95" }}>Privacidad garantizada</div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            {[
                                                "Datos solo en forma agregada por escuela",
                                                "No se publican nombres de menores",
                                                "Sin perfiles individuales expuestos",
                                                "Cumplimiento con LFPDPPP (México)",
                                            ].map((point, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#5b21b6", fontWeight: 500 }}>
                                                    <CheckCircle2 size={16} color="#7c3aed" style={{ marginTop: 2, flexShrink: 0 } as any} />
                                                    {point}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MORE FAQ */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {[
                                            {
                                                q: "¿Privacidad de datos?",
                                                a: "Solo usamos métricas agregadas. Nunca publicamos nombres ni datos personales de alumnos. Todo cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
                                                icon: <Lock size={18} color="#0F62FE" />
                                            },
                                            {
                                                q: "¿Puedo ver el contrato de mi escuela?",
                                                a: "El resumen de contrato anonimizado está disponible en los informes trimestrales. Para el contrato completo, tu institución debe solicitarlo al área administrativa de BIZEN.",
                                                icon: <ClipboardCheck size={18} color="#0F62FE" />
                                            },
                                        ].map((faq, i) => (
                                            <details key={i} className="faq-item" style={{ animationDelay: `${(i + 3) * 0.06}s` }}>
                                                <summary>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        {faq.icon}
                                                        {faq.q}
                                                    </span>
                                                    <span className="faq-toggle">+</span>
                                                </summary>
                                                <div className="faq-body">{faq.a}</div>
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
                    details > summary::-webkit-details-marker {
                        display: none;
                    }
                `}</style>
            </div>
        </div>
    )
}
