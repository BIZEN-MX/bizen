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
    Target as TargetIcon
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
    const { user, loading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"student" | "school" | "transparency" | "logros">("school")

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
                        padding-bottom: 65px !important;
                    }
                    .impacto-inner {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin-right: 0 !important;
                        padding: 0 !important;
                    }
                }
                /* Tablet/iPad (768px-1160px) - account for left sidebar (220px) */
                @media (min-width: 768px) and (max-width: 1160px) {
                    .impacto-inner {
                        width: calc(100% - 220px) !important;
                        max-width: calc(100% - 220px) !important;
                        margin-left: 220px !important;
                        margin-right: 0 !important;
                    }
                }
                /* Desktop (1161px+) - account for left sidebar (280px) */
                @media (min-width: 1161px) {
                    .impacto-inner {
                        width: calc(100% - 280px) !important;
                        max-width: calc(100% - 280px) !important;
                        margin-left: 280px !important;
                        margin-right: 0 !important;
                    }
                }

                /* --- NEW ANIMATIONS --- */
                @keyframes impact-fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
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
                    padding: "60px 24px",
                    position: "relative",
                    overflow: "hidden"
                }}>
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
                                    <span style={{
                                        color: "#166534",
                                        fontSize: 13,
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        background: "#dcfce7",
                                        padding: "4px 10px",
                                        borderRadius: "8px"
                                    }}>
                                        Fundación Verificada
                                        <CheckCircle2 size={14} />
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

                                {/* Status Indicators */}
                                <div className="impact-entrance impact-delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                                    <div className="impact-status-badge" style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        background: "#ffffff",
                                        color: "#166534",
                                        padding: "12px 20px",
                                        borderRadius: "16px",
                                        fontSize: 14,
                                        fontWeight: 800,
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                        border: "1px solid #dcfce7"
                                    }}>
                                        <div style={{ width: 28, height: 28, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <CheckCircle2 size={18} />
                                        </div>
                                        Base Asegurada
                                    </div>
                                    <div className="impact-status-badge" style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        background: "#ffffff",
                                        color: MOCK_SCHOOL_IMPACT.status === "risk" ? "#92400e" : "#0F62FE",
                                        padding: "12px 20px",
                                        borderRadius: "16px",
                                        fontSize: 14,
                                        fontWeight: 800,
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                        border: MOCK_SCHOOL_IMPACT.status === "risk" ? "1px solid #fef3c7" : "1px solid #e0e7ff"
                                    }}>
                                        <div style={{
                                            width: 28, height: 28,
                                            background: MOCK_SCHOOL_IMPACT.status === "risk" ? "#fef3c7" : "#eff6ff",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: MOCK_SCHOOL_IMPACT.status === "risk" ? "#d97706" : "#0F62FE"
                                        }}>
                                            {MOCK_SCHOOL_IMPACT.status === "risk" ? <AlertTriangle size={18} /> : <Lock size={18} />}
                                        </div>
                                        Bono de ${MOCK_SCHOOL_IMPACT.bonusAmountMXN.toLocaleString()} Protegido
                                    </div>
                                </div>
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
                <div style={{
                    width: "100%",
                    margin: "0 auto",
                    padding: "0 24px"
                }}>
                    <div style={{
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
                            .tab-container::-webkit-scrollbar { display: none; }
                        `}</style>
                        <button
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
                        <button
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
                        <button
                            onClick={() => setActiveTab("logros")}
                            style={{
                                padding: "12px 0",
                                borderBottom: activeTab === "logros" ? "3px solid #0F62FE" : "3px solid transparent",
                                color: activeTab === "logros" ? "#0F62FE" : "#64748b",
                                fontWeight: 700,
                                fontSize: 16,
                                background: "none",
                                borderTop: "none", borderLeft: "none", borderRight: "none",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            Logros
                        </button>
                    </div>

                    {/* 
          ---------------------------------------------------------
          B) TAB 1: MI IMPACTO (Student view)
          ---------------------------------------------------------
        */}
                    {activeTab === "student" && (
                        <div style={{ paddingBottom: 80 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
                                {/* Contribution Card */}
                                <Card style={{ padding: 32 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                                        <Zap size={20} color="#0F62FE" /> Tu contribución esta semana
                                    </h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        <div>
                                            <div style={{ fontSize: 24, fontWeight: 800 }}>4</div>
                                            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Sesiones Útiles</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 24, fontWeight: 800 }}>1</div>
                                            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Módulos</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 24, fontWeight: 800 }}>12</div>
                                            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Quizzes</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 24, fontWeight: 800 }}>2</div>
                                            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Simuladores</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 32, padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#475569" }}>
                                            ✓ Has aportado un <strong>+2.4%</strong> a la tasa de alumnos activos de tu escuela este mes.
                                        </p>
                                    </div>
                                </Card>

                                {/* Badges & Actions */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    <Card style={{ padding: 32 }}>
                                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Insignias Sociales</h3>
                                        <div style={{ display: "flex", gap: 16 }}>
                                            <div style={{ width: 60, height: 60, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F62FE" }}><Users size={28} /></div>
                                            <div style={{ width: 60, height: 60, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}><Award size={28} /></div>
                                            <div style={{ width: 60, height: 60, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B" }}><TargetIcon size={28} /></div>
                                        </div>
                                    </Card>

                                    <Card style={{ padding: 32, background: "#0F62FE", color: "#fff" }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>¿Cómo puedes ayudar hoy?</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            <button style={{
                                                textAlign: "left", padding: "12px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                                            }}>
                                                Completa 1 módulo <span>→</span>
                                            </button>
                                            <button style={{
                                                textAlign: "left", padding: "12px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                                            }}>
                                                Únete al Foro <span>→</span>
                                            </button>
                                        </div>
                                    </Card>
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
                            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32, alignItems: "start" }}>
                                {/* Targets Checklist */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Desbloqueo de Bono</h3>
                                    {MOCK_TARGETS.map(target => (
                                        <Card key={target.id} style={{ padding: 24 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                                <div>
                                                    <h4 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>{target.label}</h4>
                                                    <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>
                                                        Objetivo: {target.targetValue}{target.unit}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    padding: "6px 12px",
                                                    borderRadius: "8px",
                                                    fontSize: 12,
                                                    fontWeight: 800,
                                                    background: target.status === "unlocked" ? "#dcfce7" : target.status === "near" ? "#fef3c7" : "#f1f5f9",
                                                    color: target.status === "unlocked" ? "#166534" : target.status === "near" ? "#92400e" : "#64748b"
                                                }}>
                                                    {target.status === "unlocked" ? "LOGRADO" : target.status === "near" ? "CERCA" : "EN PROGRESO"}
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
                                                <div style={{
                                                    width: `${Math.min(100, (target.currentValue / target.targetValue) * 100)}%`,
                                                    height: "100%",
                                                    background: target.status === "unlocked" ? "#10B981" : "#0F62FE",
                                                    borderRadius: 4
                                                }} />
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ fontSize: 13, fontWeight: 600 }}>
                                                    Actual: <strong>{target.currentValue}{target.unit}</strong>
                                                </div>
                                                <button style={{
                                                    fontSize: 13, fontWeight: 700, color: "#0F62FE", background: "none", border: "none", cursor: "pointer", padding: 0
                                                }}>
                                                    ¿Cómo ayudar?
                                                </button>
                                            </div>
                                        </Card>
                                    ))}

                                    {/* Projection Card */}
                                    <div style={{
                                        borderRadius: "24px",
                                        background: "linear-gradient(135deg, #1e3a5f 0%, #111827 100%)",
                                        padding: "32px",
                                        color: "#fff",
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                            <TrendingUp size={24} color="#10B981" />
                                            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Proyección del Bono</h3>
                                        </div>
                                        <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 24px", opacity: 0.9 }}>
                                            Si mantenemos el ritmo actual, desbloquearemos <strong>+$15,400 MXN</strong> adicionales el 31 de marzo.
                                        </p>
                                        {MOCK_SCHOOL_IMPACT.status === "risk" && (
                                            <div style={{ padding: "12px", background: "rgba(220, 38, 38, 0.2)", borderRadius: "12px", border: "1px solid rgba(220, 38, 38, 0.3)", color: "#fca5a5", fontSize: 14, fontWeight: 600 }}>
                                                ⚠️ Riesgo: Si el rate de activos baja de 60%, el bono podría cancelarse.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline / Group Ranking */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>


                                    <Card style={{ padding: 32 }}>
                                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Impacto por Salones</h3>
                                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Basado en Puntos de Impacto colectivos.</p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            {[
                                                { name: "602 - Ciencias", points: "12,450", active: true },
                                                { name: "604 - Negocios", points: "10,200", active: false },
                                                { name: "501 - Economía", points: "8,900", active: false }
                                            ].map((room, i) => (
                                                <div key={i} style={{
                                                    padding: "12px 16px",
                                                    background: room.active ? "#eff6ff" : "transparent",
                                                    border: room.active ? "1px solid #0F62FE33" : "1px solid #f1f5f9",
                                                    borderRadius: "12px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <span style={{ fontSize: 14, fontWeight: 700 }}>{i + 1}. {room.name} {room.active && "(Tú)"}</span>
                                                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0F62FE" }}>{room.points} pts</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
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
                            {/* Reports Section */}
                            <div style={{ marginBottom: 48 }}>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Informes de Desempeño</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                                    {MOCK_REPORTS.map(report => (
                                        <Card key={report.id} style={{
                                            padding: 20,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <FileText size={24} color="#0F62FE" />
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 700 }}>{report.period}</div>
                                                    <div style={{ fontSize: 12, color: "#64748b" }}>PDF • 1.2 MB</div>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} color="#cbd5e1" />
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Evidence Timeline */}
                            <div style={{ marginBottom: 48 }}>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Evidencia de Donaciones</h3>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                                        <thead>
                                            <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
                                                <th style={{ padding: "16px 8px", fontSize: 14, color: "#64748b" }}>Fecha</th>
                                                <th style={{ padding: "16px 8px", fontSize: 14, color: "#64748b" }}>Monto</th>
                                                <th style={{ padding: "16px 8px", fontSize: 14, color: "#64748b" }}>Fundación</th>
                                                <th style={{ padding: "16px 8px", fontSize: 14, color: "#64748b" }}>Estado</th>
                                                <th style={{ padding: "16px 8px", fontSize: 14, color: "#64748b" }}>Comprobante</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MOCK_EVIDENCE.map(ev => (
                                                <tr key={ev.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                                                    <td style={{ padding: "16px 8px", fontSize: 14, fontWeight: 600 }}>{ev.date}</td>
                                                    <td style={{ padding: "16px 8px", fontSize: 14, fontWeight: 700 }}>${ev.amount.toLocaleString()} MXN</td>
                                                    <td style={{ padding: "16px 8px", fontSize: 14 }}>{ev.foundation}</td>
                                                    <td style={{ padding: "16px 8px" }}>
                                                        <span style={{
                                                            fontSize: 12, padding: "4px 8px", borderRadius: "6px", background: "#dcfce7", color: "#166534", fontWeight: 700
                                                        }}>
                                                            {ev.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "16px 8px" }}>
                                                        <button style={{
                                                            display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#0F62FE", cursor: "pointer", fontSize: 14, fontWeight: 700, padding: 0
                                                        }}>
                                                            {ev.type === "pdf" ? <FileText size={16} /> : <Globe size={16} />} Ver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div style={{ maxWidth: "800px" }}>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Preguntas frecuentes</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {[
                                        { q: "¿De dónde viene el dinero?", a: "BIZEN destina un porcentaje del contrato de tu instituto a un fondo social transparente." },
                                        { q: "¿Cómo se desbloquea el bono?", a: "Cumpliendo 3 metas colectivas: % de alumnos activos, promedio de sesiones y módulos completos." },
                                        { q: "¿Cómo se miden las métricas?", a: "Sesión útil: +10 min y 1 acción completada. Día activo: Al menos 1 sesión útil. Alumno activo: 3+ sesiones útiles o 1 módulo completo en los últimos 30 días." },
                                        { q: "¿Privacidad de datos?", a: "Solo usamos datos agregados. El impacto se mide por escuela, no publicamos nombres de menores ni perfiles individuales." }
                                    ].map((faq, i) => (
                                        <details key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
                                            <summary style={{ fontSize: 15, fontWeight: 700, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between" }}>
                                                {faq.q} <span>+</span>
                                            </summary>
                                            <p style={{ marginTop: 12, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{faq.a}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 
                      ---------------------------------------------------------
                      E) TAB 4: LOGROS (Achievement History)
                      ---------------------------------------------------------
                    */}
                    {activeTab === "logros" && (
                        <div style={{ paddingBottom: 80, animation: "fadeIn 0.4s ease both" }}>
                            <div style={{ width: "100%", margin: "0 auto", padding: "0 24px", boxSizing: "border-box" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                                    <h3 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Historial de Logros</h3>
                                    <button
                                        onClick={() => router.push("/impacto-social/historial-logros")}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                                            background: "#eff6ff", border: "none", borderRadius: "10px",
                                            color: "#0F62FE", fontSize: 13, fontWeight: 700, cursor: "pointer"
                                        }}
                                    >
                                        Pantalla Completa <ExternalLink size={14} />
                                    </button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {[
                                        {
                                            icon: <CheckCircle2 size={22} color="#10B981" />,
                                            title: "Donación ejecutada",
                                            date: "15 Dic",
                                            desc: "Se entregaron $15,000 MXN",
                                            category: "Financiero"
                                        },
                                        {
                                            icon: <TargetIcon size={22} color="#0F62FE" />,
                                            title: "Meta de sesiones lograda",
                                            date: "02 Feb",
                                            desc: "Promedio >3 sesiones",
                                            category: "Actividad"
                                        },
                                        {
                                            icon: <Lock size={22} color="#64748b" />,
                                            title: "Base asegurada",
                                            date: "01 Ene",
                                            desc: "Convenio 2026 firmado",
                                            category: "Institucional"
                                        }
                                    ].map((item, i) => (
                                        <Card key={i} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #f1f5f9" }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                {item.icon}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                                                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#111827" }}>{item.title}</h4>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", whiteSpace: "nowrap" }}>{item.date}</span>
                                                </div>
                                                <p style={{ margin: "2px 0 6px", fontSize: 14, color: "#475569" }}>{item.desc}</p>
                                                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", background: "#f1f5f9", borderRadius: 4, color: "#64748b" }}>
                                                    {item.category}
                                                </span>
                                            </div>
                                        </Card>
                                    ))}
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
