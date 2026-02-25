"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
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
    Lightbulb
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
    name: "Fundación Semillas de Éxito",
    logo: "",
    description: "Organización verificada que apoya la reinserción educativa de jóvenes en zonas vulnerables.",
    verified: true,
    website: "https://ejemplo.org"
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
        id: "t2",
        label: "Sesiones útiles por mes (promedio)",
        metricKey: "avg_sessions",
        currentValue: 3.2,
        targetValue: 3,
        unit: "sesiones",
        status: "unlocked",
        howToHelpCTA: "Sigue manteniendo tu racha de aprendizaje"
    },
    {
        id: "t3",
        label: "Módulos completados (promedio)",
        metricKey: "avg_modules",
        currentValue: 0.4,
        targetValue: 1,
        unit: "módulo",
        status: "locked",
        howToHelpCTA: "Termina el módulo actual para subir el promedio"
    }
]

const MOCK_EVIDENCE: EvidenceEntry[] = [
    {
        id: "ev1",
        date: "2025-12-15",
        amount: 15000,
        foundation: "Fundación Semillas",
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
 * 3. Alumno activo: Al menos 3 sesiones útiles en últimos 30 días O 1 módulo completado en últimos 30 días.
 */
const checkActiveStatus = (sessionsLast30d: number, modulesLast30d: number): boolean => {
    return sessionsLast30d >= 3 || modulesLast30d >= 1;
}


export default function ImpactoSocialPage() {
    const { user, loading, dbProfile } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"student" | "school" | "transparency" | "logros">("school")

    const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
    const isStudentOrGuest = !isAdminOrTeacher

    useEffect(() => {
        if (loading) return
        if (!user) {
            router.push("/login")
            return
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, border: "3px solid #0F62FE22", borderTopColor: "#0F62FE", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
        )
    }

    if (!user) return null

    // --- RENDERING HELPERS ---

    const renderEquivalence = (mxn: number) => {
        const foodBaskets = Math.floor(mxn / 500)
        return `${foodBaskets} canastas alimentarias`
    }

    return (
        <div className="impacto-outer" style={{
            minHeight: "100vh",
            background: "#ffffff",
            fontFamily: "'Inter', sans-serif",
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
                        gap: 16px !important;
                        padding: 0 4px !important;
                    }
                    .tab-btn {
                        font-size: 14px !important;
                        padding: 10px 0 !important;
                    }
                }
                /* Desktop/Tablet - account for left sidebar (clamp(240px, 25vw, 320px)) */
                @media (min-width: 768px) {
                    .impacto-inner {
                        width: calc(100% - (clamp(240px, 25vw, 320px) + 2px)) !important;
                        max-width: calc(100% - (clamp(240px, 25vw, 320px) + 2px)) !important;
                        margin-left: calc(clamp(240px, 25vw, 320px) + 2px) !important;
                        margin-right: 0 !important;
                        padding: 0 24px !important;
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
                    background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "60px 20px",
                    position: "relative",
                    overflow: "hidden",
                    marginLeft: "-24px", /* Offset parent padding for true full width */
                    marginRight: "-24px"
                }}>
                    <style>{`
                        @media (min-width: 768px) {
                            .impacto-inner > div:first-child { margin-left: -24px !important; margin-right: -24px !important; }
                        }
                        @media (max-width: 767px) {
                            .impacto-inner > div:first-child { margin-left: -16px !important; margin-right: -16px !important; }
                        }
                    `}</style>

                    {/* Decorative background circle */}
                    <div style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-5%",
                        width: "400px",
                        height: "400px",
                        background: "radial-gradient(circle, rgba(15, 98, 254, 0.05) 0%, transparent 70%)",
                        borderRadius: "50%",
                        zIndex: 0
                    }} />

                    <div style={{ width: "100%", margin: "0 auto", padding: "0 24px", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 500px" }}>
                                <div className="impact-entrance impact-delay-1" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                    <span style={{
                                        background: "linear-gradient(135deg, #0F62FE 0%, #3b82f6 100%)",
                                        color: "#fff",
                                        padding: "6px 14px",
                                        borderRadius: "20px",
                                        fontSize: 11,
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        boxShadow: "0 4px 12px rgba(15, 98, 254, 0.2)"
                                    }}>
                                        Causa: {MOCK_SCHOOL_IMPACT.causeCategory}
                                    </span>
                                </div>

                                <h1 className="impact-entrance impact-delay-2" style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: "#0f172a", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                                    Nuestro Impacto en <br />
                                    <span style={{ color: "#0F62FE" }}>{MOCK_FOUNDATION.name}</span>
                                </h1>

                                <p className="impact-entrance impact-delay-3" style={{ fontSize: 20, color: "#475569", margin: "0 0 32px", lineHeight: 1.6 }}>
                                    Llevamos donados <strong className="impact-shimmer-text" style={{ fontSize: "1.2em", fontWeight: 900 }}>${MOCK_SCHOOL_IMPACT.totalDonatedMXN.toLocaleString()} MXN</strong>.
                                    <br />
                                    <span style={{ fontSize: "0.95em", color: "#64748b" }}>
                                        Esto equivale a ≈ <strong style={{ color: "#0f172a" }}>{renderEquivalence(MOCK_SCHOOL_IMPACT.totalDonatedMXN)}</strong> entregadas.
                                    </span>
                                </p>


                            </div>

                            {/* Two-layer progress circle or bar placeholder */}
                            <div className="impact-entrance impact-delay-3" style={{ flex: "0 0 320px", textAlign: "center", display: "flex", justifyContent: "center" }}>
                                <div style={{
                                    width: "240px",
                                    height: "240px",
                                    background: "#fff",
                                    borderRadius: "40px",
                                    boxShadow: "0 20px 40px rgba(15, 98, 254, 0.08)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    border: "1px solid rgba(15, 98, 254, 0.1)"
                                }}>
                                    <svg width="180" height="180" viewBox="0 0 220 220">
                                        <circle
                                            cx="110" cy="110" r="100"
                                            stroke="#f1f5f9"
                                            strokeWidth="20"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="110" cy="110" r="100"
                                            stroke="#0F62FE"
                                            strokeWidth="20"
                                            fill="transparent"
                                            strokeDasharray="628" /* 2 * PI * 100 */
                                            strokeDashoffset="238"
                                            strokeLinecap="round"
                                            style={{
                                                animation: "impact-dash 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                                                filter: "drop-shadow(0 0 8px rgba(15, 98, 254, 0.3))"
                                            }}
                                        />
                                    </svg>

                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}>
                                        <span style={{ fontSize: 44, fontWeight: 900, color: "#0f172a", marginBottom: -4 }}>62%</span>
                                        <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Meta</span>
                                    </div>

                                    {/* Small pulsing dot at the end of progress */}
                                    <div style={{
                                        position: "absolute",
                                        width: 12, height: 12,
                                        background: "#0F62FE",
                                        borderRadius: "50%",
                                        top: "14px",
                                        left: "148px",
                                        boxShadow: "0 0 15px #0F62FE",
                                        animation: "impact-pulse-soft 2s infinite"
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 
        ---------------------------------------------------------
        TABS NAVIGATION
        ---------------------------------------------------------
      */}
                <div className="impacto-tabs-container" style={{
                    width: "100%",
                    margin: "0 auto",
                    padding: "0"
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
                                    fontWeight: 700,
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
                                fontWeight: 700,
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
                                fontWeight: 700,
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
                                    padding: 24px;
                                    padding: clamp(16px, 3vw, 24px);
                                    border: 1.5px solid #f1f5f9;
                                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                                    transition: transform 0.2s, box-shadow 0.2s;
                                    animation: stat-countup 0.5s ease both;
                                }
                                .student-stat-card:hover {
                                    transform: translateY(-3px);
                                    box-shadow: 0 12px 32px rgba(0,0,0,0.09);
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
                                    grid-template-columns: 1.3fr 0.7fr;
                                    gap: 28px;
                                    align-items: start;
                                }
                                @media (max-width: 1024px) {
                                    .student-main-layout {
                                        grid-template-columns: 1fr;
                                    }
                                }
                            `}</style>

                            {/* ── SECTION 1: HERO STATS ─────────────────────────── */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                    <Zap size={18} color="#0F62FE" />
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Tu contribución esta semana</h3>
                                </div>
                                <div className="student-grid">
                                    {[
                                        { value: 4, label: "Sesiones Útiles", icon: <Zap size={18} color="#0F62FE" />, color: "#0F62FE", bg: "#eff6ff", trend: "+1 vs sem. pasada", up: true },
                                        { value: 1, label: "Módulos", icon: <Book size={18} color="#0F62FE" />, color: "#10b981", bg: "#ecfdf5", trend: "¡Meta cumplida!", up: true },
                                        { value: 12, label: "Quizzes", icon: <Brain size={18} color="#0F62FE" />, color: "#8b5cf6", bg: "#f5f3ff", trend: "+4 vs sem. pasada", up: true },
                                        { value: 2, label: "Simuladores", icon: <Gamepad2 size={18} color="#0F62FE" />, color: "#f59e0b", bg: "#fffbeb", trend: "Igual que antes", up: false },
                                    ].map((stat, i) => (
                                        <div key={i} className="student-stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: 12,
                                                    background: stat.bg,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}>
                                                    {stat.icon}
                                                </div>
                                                <span style={{
                                                    fontSize: 10, fontWeight: 700,
                                                    color: stat.up ? "#10b981" : "#94a3b8",
                                                    background: stat.up ? "#ecfdf5" : "#f8fafc",
                                                    border: `1px solid ${stat.up ? "#a7f3d0" : "#e2e8f0"}`,
                                                    padding: "3px 8px", borderRadius: 99
                                                }}>
                                                    {stat.up ? "↑" : "→"} {stat.trend}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", lineHeight: 1, marginBottom: 4 }}>
                                                {stat.value}
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{stat.label}</div>
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
                                        <div style={{ fontSize: 14, fontWeight: 800, color: "#065f46", marginBottom: 2 }}>
                                            Eres alumno activo este mes
                                        </div>
                                        <div style={{ fontSize: 13, color: "#047857" }}>
                                            Has aportado un <strong>+2.4%</strong> a la tasa de alumnos activos de tu escuela. Sigue así para proteger el bono de tu institución.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── SECTION 2: WEEKLY ACTIVITY HEATMAP ──────────── */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                    <Clock size={17} color="#64748b" />
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Tu huella últimas 4 semanas</h3>
                                </div>
                                <div style={{
                                    background: "#fff", border: "1.5px solid #f1f5f9",
                                    borderRadius: 20, padding: "20px 24px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                }}>
                                    {/* Day labels */}
                                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                                        {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                                            <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{d}</div>
                                        ))}
                                    </div>
                                    {/* 4 weeks of dots */}
                                    {[
                                        [3, 2, 0, 1, 3, 0, 0],
                                        [1, 3, 2, 3, 2, 1, 0],
                                        [2, 0, 3, 2, 1, 0, 0],
                                        [3, 2, 1, 0, 3, 0, 0],
                                    ].map((week, wi) => (
                                        <div key={wi} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                            {week.map((level, di) => (
                                                <div
                                                    key={di}
                                                    className="day-dot"
                                                    title={level === 0 ? "Sin actividad" : `${level} actividad${level > 1 ? "es" : ""}`}
                                                    style={{
                                                        flex: 1, height: 14,
                                                        background: level === 0 ? "#f1f5f9" : level === 1 ? "#bfdbfe" : level === 2 ? "#60a5fa" : "#0F62FE",
                                                        borderRadius: 3,
                                                        cursor: "default"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "flex-end", alignItems: "center" }}>
                                        <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Menos</span>
                                        {["#f1f5f9", "#bfdbfe", "#60a5fa", "#0F62FE"].map(c => (
                                            <div key={c} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                                        ))}
                                        <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Más</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── SECTION 3: REAL-WORLD EQUIVALENCES ──────────── */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                    <Globe size={17} color="#64748b" />
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Tu aporte en el mundo real</h3>
                                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>estimado acumulado</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                                    {[
                                        { icon: <ShoppingBasket size={32} color="#0F62FE" />, value: "6", label: "Canastas alimentarias", desc: "financiadas con tu actividad" },
                                        { icon: <BookOpen size={32} color="#0F62FE" />, value: "3", label: "Libros de texto", desc: "para niños en zonas vulnerables" },
                                        { icon: <TreeDeciduous size={32} color="#0F62FE" />, value: "2", label: "Árboles plantados", desc: "gracias a tu participación" },
                                        { icon: <Clock size={32} color="#0F62FE" />, value: "18 h", label: "De tutoría", desc: "equivalente en impacto social" },
                                    ].map((eq, i) => (
                                        <div key={i} style={{
                                            background: "#fff", border: "1.5px solid #f1f5f9",
                                            borderRadius: 18, padding: "20px",
                                            textAlign: "center",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                                            animation: `stat-countup 0.5s ${i * 0.08}s ease both`
                                        }}>
                                            <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>{eq.icon}</div>
                                            <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", lineHeight: 1, marginBottom: 4 }}>{eq.value}</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 3 }}>{eq.label}</div>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{eq.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── SECTION 4: SOCIAL BADGES + CTAs ─────────────── */}
                            <div className="student-main-layout">
                                {/* Badges */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                        <Award size={17} color="#64748b" />
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Insignias Sociales</h3>
                                    </div>
                                    <div style={{
                                        background: "#fff", border: "1.5px solid #f1f5f9",
                                        borderRadius: 20, padding: "16px",
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                    }}>
                                        {[
                                            {
                                                icon: <Users size={22} color="#0F62FE" />,
                                                bg: "#eff6ff", name: "Compañero Activo",
                                                desc: "Mantuviste 3+ sesiones/mes durante 2 meses seguidos",
                                                unlocked: true, color: "#0F62FE"
                                            },
                                            {
                                                icon: <Award size={22} color="#10b981" />,
                                                bg: "#ecfdf5", name: "Módulo Estrella",
                                                desc: "Completaste 1 módulo completo en el ciclo",
                                                unlocked: true, color: "#10b981"
                                            },
                                            {
                                                icon: <TargetIcon size={22} color="#f59e0b" />,
                                                bg: "#fffbeb", name: "Racha de Impacto",
                                                desc: "Logra 7 días consecutivos activos para desbloquear",
                                                unlocked: false, color: "#f59e0b"
                                            },
                                            {
                                                icon: <Heart size={22} color="#ef4444" />,
                                                bg: "#fef2f2", name: "Corazón Comunidad",
                                                desc: "Participa en el Foro con 5 posts este mes",
                                                unlocked: false, color: "#ef4444"
                                            },
                                        ].map((badge, i) => (
                                            <div key={i} className="badge-chip" style={{
                                                opacity: badge.unlocked ? 1 : 0.55,
                                                borderBottom: i < 3 ? "1px solid #f8fafc" : "none"
                                            }}>
                                                <div style={{
                                                    width: 44, height: 44, borderRadius: 14,
                                                    background: badge.unlocked ? badge.bg : "#f8fafc",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    flexShrink: 0,
                                                    border: badge.unlocked ? `1.5px solid ${badge.color}22` : "1.5px solid #e2e8f0"
                                                }}>
                                                    {badge.unlocked ? badge.icon : <Lock size={20} color="#cbd5e1" />}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 800, color: badge.unlocked ? "#0f172a" : "#94a3b8", marginBottom: 2 }}>
                                                        {badge.name}
                                                        {badge.unlocked && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: badge.color, background: `${badge.color}15`, padding: "1px 6px", borderRadius: 99 }}>✓ Ganada</span>}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{badge.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Actions */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                        <TrendingUp size={17} color="#64748b" />
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>¿Cómo puedes ayudar hoy?</h3>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {/* Main CTA card */}
                                        <div style={{
                                            background: "linear-gradient(135deg, #0F62FE 0%, #2563eb 100%)",
                                            borderRadius: 20, padding: "24px",
                                            boxShadow: "0 12px 32px rgba(15, 98, 254, 0.25)"
                                        }}>
                                            <div style={{ marginBottom: 16 }}>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                                                    Acción prioritaria
                                                </div>
                                                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                                                    Estás a 8% de que tu escuela desbloquee el bono del mes
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                <button
                                                    className="cta-action-btn"
                                                    onClick={() => router.push("/courses")}
                                                >
                                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <Book size={16} /> Completa 1 módulo
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
                                                    onClick={() => router.push("/forum")}
                                                >
                                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <MessageCircle size={16} /> Únete al Foro
                                                    </span>
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Secondary: active student rule explanation */}
                                        <div style={{
                                            background: "#fff", border: "1.5px solid #f1f5f9",
                                            borderRadius: 16, padding: "18px 20px",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                                                <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>¿Qué es un alumno activo?</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {[
                                                    { rule: "3 sesiones útiles en los últimos 30 días", done: true },
                                                    { rule: "O 1 módulo completo en el mes", done: true },
                                                ].map((r, i) => (
                                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                                                        <CheckCircle2 size={14} color={r.done ? "#10b981" : "#cbd5e1"} />
                                                        <span style={{ color: r.done ? "#374151" : "#94a3b8", fontWeight: r.done ? 600 : 400 }}>{r.rule}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: 12, padding: "8px 12px", background: "#ecfdf5", borderRadius: 10, fontSize: 12, color: "#047857", fontWeight: 700 }}>
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

                            {/* ── SECTION 1: SCHOOL KPI STRIP ─────────────────── */}
                            <div className="school-kpi-grid">
                                {[
                                    { icon: <School size={24} color="#0F62FE" />, value: "62%", label: "Alumnos Activos", sub: "meta: 70%", color: "#f59e0b", bg: "#fffbeb" },
                                    { icon: <CircleDollarSign size={24} color="#0F62FE" />, value: "$45K", label: "Donado (MXN)", sub: "este ciclo", color: "#10b981", bg: "#ecfdf5" },
                                    { icon: <TrendingUp size={24} color="#0F62FE" />, value: "3.2", label: "Ses. / Alumno", sub: "meta: ≥ 3", color: "#0F62FE", bg: "#eff6ff" },
                                    { icon: <Book size={24} color="#0F62FE" />, value: "0.4", label: "Módulos / Alum.", sub: "meta: 1", color: "#8b5cf6", bg: "#f5f3ff" },
                                ].map((kpi, i) => (
                                    <div key={i} className="school-kpi-card" style={{ animationDelay: `${i * 0.07}s` }}>
                                        <div style={{ marginBottom: 8, display: "flex" }}>{kpi.icon}</div>
                                        <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{kpi.value}</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{kpi.label}</div>
                                        <div style={{
                                            fontSize: 11, fontWeight: 700,
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
                                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Metas para desbloquear el Bono</h3>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            {MOCK_TARGETS.map((target, ti) => {
                                                const pct = Math.min(100, (target.currentValue / target.targetValue) * 100)
                                                const statusColor = target.status === "unlocked" ? "#10b981" : target.status === "near" ? "#f59e0b" : "#0F62FE"
                                                const statusBg = target.status === "unlocked" ? "#ecfdf5" : target.status === "near" ? "#fffbeb" : "#eff6ff"
                                                const statusText = target.status === "unlocked" ? "✓ Logrado" : target.status === "near" ? "⚡ Cerca" : "En progreso"
                                                return (
                                                    <div key={target.id} className="target-card" style={{ animationDelay: `${0.1 + ti * 0.08}s` }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>{target.label}</div>
                                                                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Objetivo: {target.targetValue} {target.unit}</div>
                                                            </div>
                                                            <span style={{
                                                                fontSize: 11, fontWeight: 800,
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
                                                                                ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                                                                : "linear-gradient(90deg, #0F62FE, #60a5fa)",
                                                                        ["--bar-w" as any]: `${pct}%`,
                                                                        width: `${pct}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div style={{
                                                                position: "absolute", right: 0, top: -18,
                                                                fontSize: 11, fontWeight: 800, color: statusColor
                                                            }}>{Math.round(pct)}%</div>
                                                        </div>

                                                        <div className="timeline-labels" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
                                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                                                                Actual: <strong style={{ color: "#0f172a" }}>{target.currentValue} {target.unit}</strong>
                                                            </div>
                                                            <div style={{
                                                                fontSize: 12, fontWeight: 600, color: "#64748b",
                                                                background: "#f8fafc", borderRadius: 8,
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

                                    {/* DONATION METER */}
                                    <div style={{
                                        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                                        borderRadius: 24, padding: "28px 32px", color: "#fff",
                                        boxShadow: "0 20px 40px rgba(15,23,42,0.2)",
                                        animation: "school-fade-in 0.6s 0.3s ease both"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                            <TrendingUp size={20} color="#10b981" />
                                            <span style={{ fontSize: 16, fontWeight: 800 }}>Proyección del Bono</span>
                                        </div>

                                        {/* Base vs bonus meter */}
                                        <div style={{ marginBottom: 20 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: 8 }}>
                                                <span>Base garantizada</span>
                                                <span>Bono máximo</span>
                                            </div>
                                            <div style={{ height: 12, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                                                {/* Base bar (always green) */}
                                                <div style={{
                                                    position: "absolute", left: 0, top: 0, bottom: 0,
                                                    width: `${(MOCK_SCHOOL_IMPACT.baseAmountMXN / (MOCK_SCHOOL_IMPACT.baseAmountMXN + MOCK_SCHOOL_IMPACT.bonusAmountMXN)) * 100}%`,
                                                    background: "linear-gradient(90deg, #10b981, #34d399)",
                                                    borderRadius: 99
                                                }} />
                                                {/* Bonus unlocked bar (blue) */}
                                                <div style={{
                                                    position: "absolute",
                                                    left: `${(MOCK_SCHOOL_IMPACT.baseAmountMXN / (MOCK_SCHOOL_IMPACT.baseAmountMXN + MOCK_SCHOOL_IMPACT.bonusAmountMXN)) * 100}%`,
                                                    top: 0, bottom: 0,
                                                    width: `${(MOCK_SCHOOL_IMPACT.projectedBonusMXN / (MOCK_SCHOOL_IMPACT.baseAmountMXN + MOCK_SCHOOL_IMPACT.bonusAmountMXN)) * 100}%`,
                                                    background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                                                    borderRadius: 99
                                                }} />
                                            </div>
                                            <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                                                    <div style={{ width: 10, height: 10, borderRadius: 3, background: "#10b981" }} />
                                                    Base: ${MOCK_SCHOOL_IMPACT.baseAmountMXN.toLocaleString()} MXN
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                                                    <div style={{ width: 10, height: 10, borderRadius: 3, background: "#3b82f6" }} />
                                                    Bono proyectado: +${MOCK_SCHOOL_IMPACT.projectedBonusMXN.toLocaleString()} MXN
                                                </div>
                                            </div>
                                        </div>

                                        <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 20px", color: "rgba(255,255,255,0.8)" }}>
                                            Si mantenemos el ritmo, desbloquearemos <strong style={{ color: "#fff" }}>+${MOCK_SCHOOL_IMPACT.projectedBonusMXN.toLocaleString()} MXN</strong> adicionales para <strong style={{ color: "#fff" }}>Fundación Semillas de Éxito</strong> el 31 de marzo.
                                        </p>

                                        {/* Monthly milestone timeline */}
                                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 18 }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Línea de tiempo</div>
                                            {[
                                                { month: "Ene", done: true, label: "Base asegurada" },
                                                { month: "Feb", done: true, label: "62% alumnos activos" },
                                                { month: "Mar", done: false, label: "Meta: 70% activos → bono" },
                                                { month: "Dic", done: false, label: "Ejecución final de donación" },
                                            ].map((tl, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                                                    <div className="timeline-dot" style={{
                                                        background: tl.done ? "#10b981" : "transparent",
                                                        borderColor: tl.done ? "#10b981" : "rgba(255,255,255,0.2)",
                                                        marginTop: 2
                                                    }} />
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ fontSize: 12, fontWeight: 800, color: tl.done ? "#10b981" : "rgba(255,255,255,0.4)", marginRight: 8 }}>{tl.month}</span>
                                                        <span style={{ fontSize: 13, color: tl.done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>{tl.label}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                                    {/* CLASSROOM BAR CHART LEADERBOARD */}
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                            <Users size={17} color="#64748b" />
                                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Ranking por Salón</h3>
                                        </div>
                                        <div style={{
                                            background: "#fff", border: "1.5px solid #f1f5f9",
                                            borderRadius: 20, padding: "20px 24px",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                        }}>
                                            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 16 }}>Puntos de impacto colectivos este ciclo</div>
                                            {[
                                                { rank: 1, name: "602 - Ciencias", points: 12450, maxPoints: 12450, active: true, change: "+420 esta sem" },
                                                { rank: 2, name: "604 - Negocios", points: 10200, maxPoints: 12450, active: false, change: "+215 esta sem" },
                                                { rank: 3, name: "501 - Economía", points: 8900, maxPoints: 12450, active: false, change: "+180 esta sem" },
                                                { rank: 4, name: "503 - Historia", points: 6300, maxPoints: 12450, active: false, change: "+90 esta sem" },
                                            ].map((room, i) => (
                                                <div key={i} style={{ marginBottom: i < 3 ? 18 : 0 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <span style={{
                                                                width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 900,
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                background: room.rank === 1 ? "#fef3c7" : room.rank === 2 ? "#f1f5f9" : "#fff",
                                                                color: room.rank === 1 ? "#92400e" : "#64748b",
                                                                border: room.rank === 1 ? "1.5px solid #fbbf24" : "1.5px solid #e2e8f0",
                                                                flexShrink: 0
                                                            }}>{room.rank}</span>
                                                            <span style={{ fontSize: 13, fontWeight: room.active ? 800 : 600, color: room.active ? "#0F62FE" : "#374151" }}>
                                                                {room.name}{room.active && <span style={{ marginLeft: 4 }}><TargetIcon size={14} color="#0F62FE" /></span>}
                                                            </span>
                                                        </div>
                                                        <div style={{ textAlign: "right" }}>
                                                            <div style={{ fontSize: 13, fontWeight: 900, color: "#0f172a" }}>{room.points.toLocaleString()}</div>
                                                            <div style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>{room.change}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                                                        <div
                                                            className="classroom-bar"
                                                            style={{
                                                                background: room.active
                                                                    ? "linear-gradient(90deg, #0F62FE, #60a5fa)"
                                                                    : room.rank === 1
                                                                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                                                        : "linear-gradient(90deg, #cbd5e1, #e2e8f0)",
                                                                ["--bar-w" as any]: `${(room.points / room.maxPoints) * 100}%`,
                                                                width: `${(room.points / room.maxPoints) * 100}%`,
                                                                animationDelay: `${0.2 + i * 0.1}s`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ACTIVE STUDENTS RING */}
                                    <div style={{
                                        background: "#fff", border: "1.5px solid #f1f5f9",
                                        borderRadius: 20, padding: "24px",
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                                        display: "flex", alignItems: "center", gap: 20
                                    }}>
                                        <div style={{ position: "relative", flexShrink: 0 }}>
                                            <svg width="80" height="80" viewBox="0 0 80 80">
                                                <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                                                <circle
                                                    cx="40" cy="40" r="32"
                                                    stroke="#0F62FE"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray="201"
                                                    strokeDashoffset={200 - (201 * 0.62)}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 40 40)"
                                                    style={{ filter: "drop-shadow(0 0 4px rgba(15,98,254,0.4))" }}
                                                />
                                            </svg>
                                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                                <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>62%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Alumnos Activos</div>
                                            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Faltan <strong style={{ color: "#f59e0b" }}>8 puntos porcentuales</strong> para el bono</div>
                                            <div style={{ height: 6, width: "100%", background: "#f1f5f9", borderRadius: 99 }}>
                                                <div style={{ height: "100%", width: "62%", background: "linear-gradient(90deg,#f59e0b,#fbbf24)", borderRadius: 99 }} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", fontWeight: 700, marginTop: 4 }}>
                                                <span>0%</span><span>Meta: 70%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FOUNDATION TRUST CARD */}
                                    <div style={{
                                        background: "linear-gradient(135deg, #f8fafc, #eff6ff)",
                                        border: "1.5px solid #dbeafe",
                                        borderRadius: 20, padding: "20px 22px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 12,
                                                background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>
                                                <CheckCircle2 size={20} color="#10b981" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{MOCK_FOUNDATION.name}</div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 13, color: "#475569", margin: "0 0 14px", lineHeight: 1.5 }}>
                                            {MOCK_FOUNDATION.description}
                                        </p>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <div style={{ flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                                                <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>90</div>
                                                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>canastas equiv.</div>
                                            </div>
                                            <div style={{ flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                                                <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>3</div>
                                                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>donaciones exec.</div>
                                            </div>
                                        </div>
                                        <a href={MOCK_FOUNDATION.website} target="_blank" rel="noopener noreferrer" style={{
                                            display: "flex", alignItems: "center", gap: 6,
                                            marginTop: 14, fontSize: 13, fontWeight: 700, color: "#0F62FE", textDecoration: "none"
                                        }}>
                                            <ExternalLink size={13} /> Ver sitio oficial
                                        </a>
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

                            {/* ── SECTION 1: TRUST SCORE HERO ─────────────────── */}
                            <div style={{
                                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                                borderRadius: 24, padding: "32px", marginBottom: 32,
                                color: "#fff", position: "relative", overflow: "hidden",
                                animation: "transp-fade-in 0.5s ease both"
                            }}>
                                {/* BG glow */}
                                <div style={{
                                    position: "absolute", top: -60, right: -60,
                                    width: 240, height: 240,
                                    background: "radial-gradient(circle, rgba(15,98,254,0.3) 0%, transparent 70%)",
                                    borderRadius: "50%", pointerEvents: "none"
                                }} />
                                <div className="transp-hero-layout">
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                                            BIZEN Transparency Score
                                        </div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                                            <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>9.4</span>
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
                                                <span key={i} className="trust-badge" style={{ border: `1.5px solid ${b.color}44`, background: `${b.color}15`, color: "#fff", fontSize: 11 }}>
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
                                            <span style={{ fontSize: 22, fontWeight: 900 }}>94%</span>
                                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase" }}>Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── SECTION 2: REPORTS + EVIDENCE GRID ─────────── */}
                            <div className="transp-grid">

                                {/* REPORTS */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                        <FileText size={17} color="#0F62FE" />
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Informes de Desempeño</h3>
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
                                                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                                                            {rep.period}
                                                            {rep.badge && (
                                                                <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: rep.badgeColor, padding: "2px 7px", borderRadius: 99 }}>
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

                                {/* DONATION EVIDENCE TIMELINE */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                        <CheckCircle2 size={17} color="#10b981" />
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Evidencia de Donaciones</h3>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                        {MOCK_EVIDENCE.concat([
                                            { id: "ev3", date: "2025-03-20", amount: 9500, foundation: "Nutriendo Futuro", status: "Completado", evidenceUrl: "#", type: "image" },
                                            { id: "ev4", date: "2024-12-05", amount: 8000, foundation: "Fundación Semillas", status: "Completado", evidenceUrl: "#", type: "pdf" },
                                        ] as any).map((ev: any, i: number, arr: any[]) => (
                                            <div key={ev.id} className="evidence-row" style={{ animationDelay: `${i * 0.08}s`, paddingBottom: i < arr.length - 1 ? 0 : 0 }}>
                                                {/* Timeline stem */}
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 20 }}>
                                                    <div style={{
                                                        width: 12, height: 12, borderRadius: "50%",
                                                        background: ev.status === "Completado" ? "#10b981" : "#f59e0b",
                                                        border: "2px solid #fff",
                                                        boxShadow: `0 0 0 3px ${ev.status === "Completado" ? "#a7f3d044" : "#fde68a44"}`,
                                                        flexShrink: 0
                                                    }} />
                                                    {i < arr.length - 1 && (
                                                        <div style={{ width: 2, flex: 1, minHeight: 20, background: "#f1f5f9", marginTop: 4, marginBottom: -8 }} />
                                                    )}
                                                </div>
                                                <div className="evidence-inner" style={{ marginBottom: i < arr.length - 1 ? 12 : 0 }}>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                                                            {ev.foundation}
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                            <span style={{ fontSize: 14, fontWeight: 900, color: "#0F62FE" }}>${ev.amount.toLocaleString()} MXN</span>
                                                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{ev.date}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                        <span style={{
                                                            fontSize: 11, fontWeight: 800,
                                                            color: "#166534", background: "#dcfce7",
                                                            border: "1px solid #a7f3d0",
                                                            padding: "3px 8px", borderRadius: 99
                                                        }}>{ev.status}</span>
                                                        <button style={{
                                                            display: "flex", alignItems: "center", gap: 4,
                                                            background: "#eff6ff", border: "none",
                                                            color: "#0F62FE", cursor: "pointer",
                                                            fontSize: 12, fontWeight: 700,
                                                            padding: "5px 10px", borderRadius: 8
                                                        }}>
                                                            {ev.type === "pdf" ? <FileText size={12} /> : <Globe size={12} />}
                                                            Ver
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── SECTION 3: METHODOLOGY EXPLAINER ────────────── */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                    <Globe size={17} color="#8b5cf6" />
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>¿Cómo funciona el sistema?</h3>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
                                    {[
                                        { step: "1", icon: <ClipboardList size={18} color="#0F62FE" />, title: "BIZEN firma contrato", desc: "Se acuerda el % del contrato destinado al fondo social", color: "#0F62FE", bg: "#eff6ff" },
                                        { step: "2", icon: <BarChart3 size={18} color="#0F62FE" />, title: "Se miden métricas", desc: "Actividad agregada por escuela, sin datos individuales", color: "#8b5cf6", bg: "#f5f3ff" },
                                        { step: "3", icon: <Unlock size={18} color="#0F62FE" />, title: "Se desbloquea el bono", desc: "Si la escuela cumple las 3 metas colectivas", color: "#f59e0b", bg: "#fffbeb" },
                                        { step: "4", icon: <Handshake size={18} color="#0F62FE" />, title: "Se ejecuta la donación", desc: "Transferencia verificada a fundación aliada", color: "#10b981", bg: "#ecfdf5" },
                                    ].map((s, i) => (
                                        <div key={i} className="transp-card" style={{ padding: "20px", animationDelay: `${i * 0.07}s` }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: 10,
                                                    background: s.bg,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}>{s.icon}</div>
                                                <span style={{ fontSize: 11, fontWeight: 900, color: s.color, background: s.bg, border: `1px solid ${s.color}22`, padding: "2px 8px", borderRadius: 99 }}>
                                                    Paso {s.step}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{s.title}</div>
                                            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── SECTION 4: FAQ ───────────────────────────────── */}
                            <div className="transp-grid" style={{ marginBottom: 0 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                        <AlertTriangle size={17} color="#f59e0b" />
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Preguntas frecuentes</h3>
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
                                                a: "Cumpliendo 3 metas colectivas simultáneamente: (1) ≥70% de alumnos activos, (2) promedio ≥3 sesiones útiles/mes por alumno, y (3) ≥1 módulo completo por alumno en el ciclo.",
                                                icon: <Unlock size={18} color="#0F62FE" />
                                            },
                                            {
                                                q: "¿Cómo se miden las métricas?",
                                                a: "Una sesión útil requiere ≥10 minutos activos y al menos 1 acción completada (lección, quiz, reto o simulador). Un alumno activo mantiene ≥3 sesiones útiles en los últimos 30 días, o completó ≥1 módulo en el mismo período.",
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

                                {/* PRIVACY + COMMITMENT CARD */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {/* Privacy */}
                                    <div style={{
                                        background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
                                        border: "1.5px solid #ddd6fe",
                                        borderRadius: 20, padding: "24px",
                                        animation: "transp-fade-in 0.5s 0.2s ease both"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Lock size={20} color="#0F62FE" />
                                            </div>
                                            <div style={{ fontSize: 15, fontWeight: 800, color: "#4c1d95" }}>Privacidad garantizada</div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {[
                                                "Datos solo en forma agregada por escuela",
                                                "No se publican nombres de menores",
                                                "Sin perfiles individuales expuestos",
                                                "Cumplimiento con LFPDPPP (México)",
                                            ].map((point, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#5b21b6" }}>
                                                    <CheckCircle2 size={14} color="#7c3aed" style={{ marginTop: 1, flexShrink: 0 } as any} />
                                                    {point}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* More FAQs */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {[
                                            {
                                                q: "¿Privacidad de datos?",
                                                a: "Solo usamos métricas agregadas. Nunca publicamos nombres ni datos personales de alumnos. Todo cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
                                                icon: <ShieldCheck size={18} color="#0F62FE" />
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
