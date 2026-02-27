"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import {
    BookOpen,
    ChevronRight,
    ChevronLeft,
    Wallet,
    Coins,
    PiggyBank,
    Receipt,
    HandCoins,
    CreditCard,
    Landmark,
    TrendingUp,
    Presentation,
    BarChart4,
    Briefcase,
    Brain,
    LineChart,
    AlertTriangle,
    Lightbulb,
    Rocket,
    Search,
    ShieldCheck,
    FileText,
    Calculator,
    RefreshCw,
    BadgeDollarSign,
    Skull,
    Smile,
    Heart,
    ShieldAlert,
    Coffee,
    Target,
    CheckCircle2,
    Zap,
    Layout,
    LucideIcon
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GenericLesson {
    title: string
    level: string
    slug: string
}

export interface GenericSubtema {
    title: string
    lessons: GenericLesson[]
}

// ─── Topic metadata (mirrors courses/page.tsx) ───────────────────────────────

interface TopicMeta {
    id: number
    title: string
    icon: LucideIcon
    color: string
    lessons: number
}

const ALL_TOPICS: TopicMeta[] = [
    { id: 1, title: "Mi relación con el dinero", icon: Wallet, color: "#3b82f6", lessons: 4 },
    { id: 2, title: "¿Qué es el dinero y por qué existe?", icon: Coins, color: "#2563eb", lessons: 5 },
    { id: 3, title: "¿Cómo entra y sale el dinero de mi vida?", icon: RefreshCw, color: "#1d4ed8", lessons: 6 },
    { id: 4, title: "Presupuesto: tomar control sin ahogarme", icon: Receipt, color: "#1e40af", lessons: 8 },
    { id: 5, title: "Ahorro con propósito", icon: PiggyBank, color: "#6366f1", lessons: 5 },
    { id: 6, title: "¿Deuda: cuándo ayuda y cuándo destruye?", icon: CreditCard, color: "#4f46e5", lessons: 7 },
    { id: 7, title: "Sistema financiero explicado fácil", icon: Landmark, color: "#4338ca", lessons: 6 },
    { id: 8, title: "Impuestos en la vida real", icon: FileText, color: "#3730a3", lessons: 6 },
    { id: 9, title: "Inflación y poder adquisitivo", icon: TrendingUp, color: "#2563eb", lessons: 5 },
    { id: 10, title: "Introducción a la inversión", icon: Presentation, color: "#3b82f6", lessons: 8 },
    { id: 11, title: "Instrumentos de inversión básicos", icon: BarChart4, color: "#60a5fa", lessons: 10 },
    { id: 12, title: "Psicología del inversionista", icon: Brain, color: "#818cf8", lessons: 7 },
    { id: 13, title: "Construcción de patrimonio", icon: ShieldCheck, color: "#10b981", lessons: 9 },
    { id: 14, title: "Errores financieros comunes", icon: AlertTriangle, color: "#f59e0b", lessons: 6 },
    { id: 15, title: "Decisiones financieras conscientes", icon: Lightbulb, color: "#facc15", lessons: 5 },
    { id: 16, title: "Mentalidad emprendedora", icon: Rocket, color: "#ef4444", lessons: 8 },
    { id: 17, title: "Oportunidades de negocio", icon: Search, color: "#3b82f6", lessons: 6 },
    { id: 18, title: "Validar ideas rápido", icon: Zap, color: "#f59e0b", lessons: 7 },
    { id: 19, title: "Modelo de negocio simple", icon: Layout, color: "#6366f1", lessons: 9 },
    { id: 20, title: "Ingresos, costos y utilidad", icon: Calculator, color: "#10b981", lessons: 8 },
    { id: 21, title: "Flujo de efectivo", icon: LineChart, color: "#3b82f6", lessons: 6 },
    { id: 22, title: "Precios y valor", icon: BadgeDollarSign, color: "#2563eb", lessons: 5 },
    { id: 23, title: "Contabilidad básica", icon: BookOpen, color: "#4f46e5", lessons: 7 },
    { id: 24, title: "Errores comunes al emprender", icon: Skull, color: "#475569", lessons: 6 },
    { id: 25, title: "Escalar un negocio", icon: TrendingUp, color: "#10b981", lessons: 8 },
    { id: 26, title: "Dinero y estilo de vida", icon: Smile, color: "#f59e0b", lessons: 5 },
    { id: 27, title: "Dinero y decisiones importantes", icon: Heart, color: "#ef4444", lessons: 6 },
    { id: 28, title: "Dinero en crisis", icon: ShieldAlert, color: "#dc2626", lessons: 7 },
    { id: 29, title: "Estrés y bienestar financiero", icon: Coffee, color: "#8b5cf6", lessons: 5 },
    { id: 30, title: "Mi vida financiera a futuro", icon: Target, color: "#0B71FE", lessons: 10 },
]

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    Básico: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
    Intermedio: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    Avanzado: { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
}

/** Blend a hex colour toward near-black to build a dark-to-vivid hero gradient. */
function buildHeroGradient(hex: string): string {
    // Parse hex -> RGB
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    // Deep dark version (very low luminance)
    const dr = Math.round(r * 0.12)
    const dg = Math.round(g * 0.12)
    const db = Math.round(b * 0.18)
    // Mid version
    const mr = Math.round(r * 0.4)
    const mg = Math.round(g * 0.4)
    const mb = Math.round(b * 0.45)
    return `linear-gradient(135deg, rgb(${dr},${dg},${db}) 0%, rgb(${mr},${mg},${mb}) 50%, ${hex} 100%)`
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface CoursePageTemplateProps {
    topicId: number
    subtemas: GenericSubtema[]
    /** The lesson URL builder. Receives the lesson slug and should return the full path. */
    getLessonPath: (slug: string) => string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CoursePageTemplate({
    topicId,
    subtemas,
    getLessonPath,
}: CoursePageTemplateProps) {
    const router = useRouter()
    const { user, loading } = useAuth()
    const { completedLessons, lessonStars } = useLessonProgress()
    const [lessonModal, setLessonModal] = useState<{ lesson: GenericLesson; unitTitle: string } | null>(null)

    React.useEffect(() => {
        if (!loading && !user) {
            window.open("/login", "_blank")
        }
    }, [loading, user])

    // White background
    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        html.style.background = "#ffffff"
        body.style.background = "#ffffff"
        return () => {
            html.style.background = ""
            body.style.background = ""
        }
    }, [])

    if (loading || !user) {
        return <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat', sans-serif" }} />
    }

    const topic = ALL_TOPICS.find((t) => t.id === topicId) || ALL_TOPICS[0]
    const IconComp = topic.icon
    const prevTopic = ALL_TOPICS.find((t) => t.id === topicId - 1)
    const nextTopic = ALL_TOPICS.find((t) => t.id === topicId + 1)

    // Progress for this topic
    const allLessonsInTopic = subtemas.flatMap((s) => s.lessons)
    const completedInTopic = allLessonsInTopic.filter((l) => completedLessons.includes(l.slug)).length
    const totalInTopic = allLessonsInTopic.length
    const topicPct = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: "100%", flex: 1, background: "#FBFAF5", boxSizing: "border-box" }}>
            {/* Decorative orbs (match /courses) */}
            <div style={{ position: "fixed", top: "10%", right: "6%", width: 350, height: 350, background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />

            <main
                className="courses-main-content"
                style={{
                    flex: 1,
                    paddingTop: "clamp(8px, 1.5vw, 16px)",
                    paddingBottom: "clamp(40px, 8vw, 80px)",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    fontFamily: "'Montserrat', sans-serif",
                    background: "transparent",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    boxSizing: "border-box",
                    width: "100%",
                    zIndex: 1,
                }}
            >
                <div style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1, padding: "0", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0 }}>

                    {/* ── HERO BANNER (mirrors /courses hero) ───────────────────────── */}
                    <div
                        style={{
                            background: buildHeroGradient(topic.color),
                            borderRadius: 28,
                            padding: "clamp(28px, 4vw, 48px) clamp(24px, 4vw, 44px)",
                            marginBottom: "clamp(20px, 4vw, 32px)",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: `0 20px 60px ${topic.color}55`,
                        }}
                    >
                        {/* Orbs inside hero */}
                        <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 300, height: 300, background: `radial-gradient(circle, ${topic.color}33 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: "-20%", left: "5%", width: 220, height: 220, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                        <div style={{ position: "relative", zIndex: 1 }}>
                            {/* Breadcrumb */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                                <button
                                    onClick={() => router.push("/courses")}
                                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#93c5fd", fontSize: 12, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    <ChevronLeft size={12} /> Todos los Temas
                                </button>
                                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>›</span>
                                <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <Zap size={12} color="#60a5fa" />
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                        Tema {topicId.toString().padStart(2, "0")} · Educación Financiera
                                    </span>
                                </div>
                            </div>

                            {/* Title row */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
                                <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${topic.color}40 0%, ${topic.color}20 100%)`, border: `1.5px solid ${topic.color}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <IconComp size={30} color={topic.color} strokeWidth={2} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#ffffff", margin: "0 0 8px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                                        {topic.title}
                                    </h1>
                                    <p style={{ fontSize: "clamp(13px, 1.8vw, 15px)", color: "#93c5fd", margin: 0, lineHeight: 1.5 }}>
                                        Explora los subtemas y lecciones a tu propio ritmo. Cada lección te da XP.
                                    </p>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div style={{ display: "flex", gap: "clamp(12px, 3vw, 24px)", flexWrap: "wrap", marginBottom: 20 }}>
                                {[
                                    { label: "Lecciones", value: totalInTopic.toString(), icon: CheckCircle2 },
                                    { label: "Completadas", value: completedInTopic.toString(), icon: Zap },
                                ].map((stat) => {
                                    const StatIcon = stat.icon
                                    return (
                                        <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 16px" }}>
                                            <StatIcon size={16} color="#60a5fa" />
                                            <div>
                                                <div style={{ fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{stat.value}</div>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd" }}>Progreso de este tema</span>
                                    <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{topicPct}%</span>
                                </div>
                                <div style={{ width: "100%", height: 8, borderRadius: 8, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
                                    <div style={{ width: `${topicPct}%`, height: "100%", borderRadius: 8, background: "rgba(255,255,255,0.9)", transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 0 10px rgba(255,255,255,0.5)" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SUBTEMAS ──────────────────────────────────────────────────── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px, 5vw, 44px)", paddingBottom: 40 }}>
                        {subtemas.map((sub, subIdx) => {
                            const subCompleted = sub.lessons.filter((l) => completedLessons.includes(l.slug)).length
                            const subTotal = sub.lessons.length
                            const subPct = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0

                            // Subtema bar: vivid gradient matching the topic colour —
                            // each bar shifts slightly toward the complementary dark tone
                            const darkFactor = 1 - subIdx * 0.04
                            const r = parseInt(topic.color.slice(1, 3), 16)
                            const g = parseInt(topic.color.slice(3, 5), 16)
                            const b = parseInt(topic.color.slice(5, 7), 16)
                            const dr = Math.round(r * (0.45 * darkFactor))
                            const dg = Math.round(g * (0.45 * darkFactor))
                            const db = Math.round(b * (0.55 * darkFactor))
                            const barBg = `linear-gradient(135deg, rgb(${dr},${dg},${db}) 0%, ${topic.color} 100%)`

                            return (
                                <div key={subIdx} id={`tema${topicId}-subtema-${subIdx + 1}`} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                                    {/* Subtema header bar */}
                                    <div style={{ display: "flex", flexDirection: "column", padding: "clamp(18px, 3vw, 26px)", paddingBottom: 16, background: barBg, borderRadius: 18, boxShadow: `0 8px 28px ${topic.color}50`, border: `1.5px solid ${topic.color}40`, marginBottom: 20 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                                            <div style={{ width: "clamp(48px,10vw,60px)", height: "clamp(48px,10vw,60px)", minWidth: "clamp(48px,10vw,60px)", borderRadius: 14, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(18px,4vw,22px)", fontWeight: 900, color: "#fff", backdropFilter: "blur(4px)" }}>
                                                {subIdx + 1}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: "clamp(15px, 3vw, 19px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>{sub.title}</div>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{subTotal} lecciones · {subCompleted} completadas</div>
                                            </div>
                                            {subPct > 0 && (
                                                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>
                                                    {subPct}%
                                                </div>
                                            )}
                                        </div>
                                        {/* Progress bar */}
                                        <div style={{ width: "100%", height: 6, borderRadius: 6, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                                            <div style={{ width: `${subPct}%`, height: "100%", borderRadius: 6, background: "rgba(255,255,255,0.92)", transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
                                        </div>
                                    </div>

                                    {/* Lessons horizontal scroll */}
                                    <div
                                        className="lessons-scroll-container"
                                        style={{ display: "flex", flexDirection: "row", gap: 16, overflowX: "auto", overflowY: "hidden", paddingBottom: 10, paddingTop: 4, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
                                    >
                                        {sub.lessons.map((lesson, lessonIdx) => {
                                            const levelColors = LEVEL_COLORS[lesson.level] || LEVEL_COLORS["Básico"]
                                            const isDone = completedLessons.includes(lesson.slug)
                                            const stars = isDone ? (lessonStars[lesson.slug] ?? 0) : 0

                                            return (
                                                <div
                                                    key={lesson.slug}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLessonModal({ lesson, unitTitle: sub.title }) } }}
                                                    onClick={() => setLessonModal({ lesson, unitTitle: sub.title })}
                                                    className="cpt-lesson-card"
                                                    style={{
                                                        width: 240,
                                                        minWidth: 240,
                                                        flexShrink: 0,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        padding: "20px 18px",
                                                        background: isDone ? `linear-gradient(135deg, ${topic.color}10 0%, ${topic.color}06 100%)` : "#fff",
                                                        borderRadius: 18,
                                                        border: isDone ? `2px solid ${topic.color}40` : "1.5px solid #e8f0fe",
                                                        boxSizing: "border-box",
                                                        scrollSnapAlign: "start",
                                                        cursor: "pointer",
                                                        boxShadow: isDone ? `0 4px 16px ${topic.color}20` : "0 2px 10px rgba(0,0,0,0.04)",
                                                        gap: 10,
                                                        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                                                        position: "relative",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {/* Completed ribbon */}
                                                    {isDone && (
                                                        <div style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: "50%", background: topic.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <CheckCircle2 size={13} color="#fff" strokeWidth={2.5} />
                                                        </div>
                                                    )}

                                                    {/* Lesson number badge */}
                                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: isDone ? topic.color : `${topic.color}18`, border: isDone ? "none" : `1.5px solid ${topic.color}30`, color: isDone ? "#fff" : topic.color, fontSize: 17, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        {lessonIdx + 1}
                                                    </div>

                                                    {/* Title */}
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", flex: 1 }}>
                                                        {lesson.title}
                                                    </div>

                                                    {/* Footer: level + stars */}
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                                                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: levelColors.bg, color: levelColors.text, border: `1px solid ${levelColors.border}` }}>
                                                            {lesson.level}
                                                        </span>
                                                        <div style={{ display: "flex", gap: 3 }} role="img" aria-label={isDone ? `${stars} de 3 estrellas` : "Sin completar"}>
                                                            {[1, 2, 3].map((i) => (
                                                                <img
                                                                    key={i}
                                                                    src="/stars.png"
                                                                    alt=""
                                                                    style={{ width: 18, height: 18, objectFit: "contain", opacity: i <= stars ? 1 : 0.28, filter: i <= stars ? "none" : "grayscale(1)", transition: "opacity 0.2s" }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* ── PREV / NEXT NAVIGATION ─────────────────────────────────────── */}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, paddingTop: 8, flexWrap: "wrap" }}>
                        {prevTopic ? (
                            <button
                                onClick={() => router.push(`/courses/${prevTopic.id}`)}
                                className="cpt-nav-btn"
                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", background: "#FBFAF5", border: "1.5px solid #e2e8f0", borderRadius: 14, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: "#374151", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.2s" }}
                            >
                                <ChevronLeft size={16} />
                                <span>Tema {prevTopic.id.toString().padStart(2, "0")}: {prevTopic.title}</span>
                            </button>
                        ) : <div />}
                        {nextTopic ? (
                            <button
                                onClick={() => router.push(`/courses/${nextTopic.id}`)}
                                className="cpt-nav-btn"
                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", border: "none", borderRadius: 14, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: "#93c5fd", boxShadow: "0 4px 14px rgba(15,98,254,0.25)", transition: "all 0.2s" }}
                            >
                                <span>Tema {nextTopic.id.toString().padStart(2, "0")}: {nextTopic.title}</span>
                                <ChevronRight size={16} />
                            </button>
                        ) : <div />}
                    </div>

                </div>
            </main>

            {/* ── LESSON MODAL ────────────────────────────────────────────────── */}
            {lessonModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", boxSizing: "border-box" }}
                    onClick={() => setLessonModal(null)}
                >
                    <div
                        style={{ background: "white", borderRadius: 24, padding: "28px 32px", maxWidth: 400, width: "100%", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: 0, overflow: "hidden" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top accent */}
                        <div style={{ height: 4, background: `linear-gradient(90deg, ${topic.color}, ${topic.color}88)`, margin: "-28px -32px 20px" }} />

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${topic.color}18`, border: `1.5px solid ${topic.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <IconComp size={20} color={topic.color} strokeWidth={2} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: topic.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{lessonModal.unitTitle}</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>{lessonModal.lesson.title}</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button
                                onClick={() => {
                                    router.push(getLessonPath(lessonModal.lesson.slug))
                                    setLessonModal(null)
                                }}
                                style={{ width: "100%", fontSize: 15, fontWeight: 800, padding: "14px 20px", background: `linear-gradient(135deg, ${topic.color} 0%, ${topic.color}cc 100%)`, color: "white", border: "none", borderRadius: 14, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", boxShadow: `0 6px 18px ${topic.color}50`, transition: "all 0.2s" }}
                            >
                                Iniciar lección →
                            </button>
                            <button
                                onClick={() => setLessonModal(null)}
                                style={{ width: "100%", fontSize: 14, fontWeight: 600, padding: "12px 20px", background: "transparent", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: 14, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s" }}
                            >
                                Regresar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        /* Sidebar compensation */
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content { padding-left: 220px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
          .courses-main-content > div { max-width: calc(100vw - 220px - 32px) !important; width: 100% !important; margin: 0 auto !important; }
        }
        @media (min-width: 1161px) {
          .courses-main-content { padding-left: 280px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
          .courses-main-content > div { max-width: calc(100vw - 280px - 48px) !important; width: 100% !important; margin: 0 auto !important; }
        }
        @media (max-width: 767px) {
          .courses-main-content { padding-top: 80px !important; padding-bottom: calc(65px + env(safe-area-inset-bottom)) !important; padding-left: 12px !important; padding-right: 12px !important; }
          .courses-main-content > div { max-width: 100% !important; }
        }

        /* Lesson card hover */
        .cpt-lesson-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 10px 28px rgba(37,99,235,0.14) !important;
          border-color: rgba(59,130,246,0.5) !important;
        }
        .cpt-lesson-card:active { transform: translateY(0) !important; }

        /* Nav buttons hover */
        .cpt-nav-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.12) !important; }

        /* Scrollbar styling */
        .lessons-scroll-container::-webkit-scrollbar { height: 5px; }
        .lessons-scroll-container::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 99px; }
        .lessons-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .lessons-scroll-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
        </div>
    )
}
