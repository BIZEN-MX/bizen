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
    { id: 2, title: "¿Qué es el dinero y por qué existe?", icon: Coins, color: "#3b82f6", lessons: 5 },
    { id: 3, title: "¿Cómo entra y sale el dinero de mi vida?", icon: RefreshCw, color: "#3b82f6", lessons: 6 },
    { id: 4, title: "Presupuesto: tomar control sin ahogarme", icon: Receipt, color: "#3b82f6", lessons: 8 },
    { id: 5, title: "Ahorro con propósito", icon: PiggyBank, color: "#3b82f6", lessons: 5 },
    { id: 6, title: "¿Deuda: cuándo ayuda y cuándo destruye?", icon: CreditCard, color: "#3b82f6", lessons: 7 },
    { id: 7, title: "Sistema financiero explicado fácil", icon: Landmark, color: "#3b82f6", lessons: 6 },
    { id: 8, title: "Impuestos en la vida real", icon: FileText, color: "#3b82f6", lessons: 6 },
    { id: 9, title: "Inflación y poder adquisitivo", icon: TrendingUp, color: "#3b82f6", lessons: 5 },
    { id: 10, title: "Introducción a la inversión", icon: Presentation, color: "#3b82f6", lessons: 8 },
    { id: 11, title: "Instrumentos de inversión básicos", icon: BarChart4, color: "#3b82f6", lessons: 10 },
    { id: 12, title: "Psicología del inversionista", icon: Brain, color: "#3b82f6", lessons: 7 },
    { id: 13, title: "Construcción de patrimonio", icon: ShieldCheck, color: "#3b82f6", lessons: 9 },
    { id: 14, title: "Errores financieros comunes", icon: AlertTriangle, color: "#3b82f6", lessons: 6 },
    { id: 15, title: "Decisiones financieras conscientes", icon: Lightbulb, color: "#3b82f6", lessons: 5 },
    { id: 16, title: "Mentalidad emprendedora", icon: Rocket, color: "#3b82f6", lessons: 8 },
    { id: 17, title: "Oportunidades de negocio", icon: Search, color: "#3b82f6", lessons: 6 },
    { id: 18, title: "Validar ideas rápido", icon: Zap, color: "#3b82f6", lessons: 7 },
    { id: 19, title: "Modelo de negocio simple", icon: Layout, color: "#3b82f6", lessons: 9 },
    { id: 20, title: "Ingresos, costos y utilidad", icon: Calculator, color: "#3b82f6", lessons: 8 },
    { id: 21, title: "Flujo de efectivo", icon: LineChart, color: "#3b82f6", lessons: 6 },
    { id: 22, title: "Precios y valor", icon: BadgeDollarSign, color: "#3b82f6", lessons: 5 },
    { id: 23, title: "Contabilidad básica", icon: BookOpen, color: "#3b82f6", lessons: 7 },
    { id: 24, title: "Errores comunes al emprender", icon: Skull, color: "#3b82f6", lessons: 6 },
    { id: 25, title: "Escalar un negocio", icon: TrendingUp, color: "#3b82f6", lessons: 8 },
    { id: 26, title: "Dinero y estilo de vida", icon: Smile, color: "#3b82f6", lessons: 5 },
    { id: 27, title: "Dinero y decisiones importantes", icon: Heart, color: "#3b82f6", lessons: 6 },
    { id: 28, title: "Dinero en crisis", icon: ShieldAlert, color: "#3b82f6", lessons: 7 },
    { id: 29, title: "Estrés y bienestar financiero", icon: Coffee, color: "#3b82f6", lessons: 5 },
    { id: 30, title: "Mi vida financiera a futuro", icon: Target, color: "#3b82f6", lessons: 10 },
]



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
                            background: "linear-gradient(135deg, #0f2a6e 0%, #1e3a8a 45%, #2563eb 100%)",
                            borderRadius: 28,
                            padding: "clamp(28px, 4vw, 48px) clamp(24px, 4vw, 44px)",
                            marginBottom: "clamp(20px, 4vw, 32px)",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(15,98,254,0.3)",
                        }}
                    >
                        {/* Orbs inside hero */}
                        <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
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
                                        Tema {topicId.toString().padStart(2, "0")}
                                    </span>
                                </div>
                            </div>

                            {/* Title row */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
                                <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <IconComp size={30} color="#93c5fd" strokeWidth={2} />
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

                            return (
                                <div key={subIdx} id={`tema${topicId}-subtema-${subIdx + 1}`} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                                    {/* Subtema header bar — always deep spatial blue */}
                                    <div style={{ display: "flex", flexDirection: "column", padding: "clamp(18px, 3vw, 26px)", paddingBottom: 16, background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)", borderRadius: 18, boxShadow: "0 8px 28px rgba(15,98,254,0.35)", border: "1px solid rgba(59,130,246,0.3)", marginBottom: 20 }}>
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
                                                        background: isDone ? "linear-gradient(135deg, rgba(15,98,254,0.07) 0%, rgba(59,130,246,0.03) 100%)" : "#fff",
                                                        borderRadius: 18,
                                                        border: isDone ? "2px solid rgba(59,130,246,0.3)" : "1.5px solid #e8f0fe",
                                                        boxSizing: "border-box",
                                                        scrollSnapAlign: "start",
                                                        cursor: "pointer",
                                                        boxShadow: isDone ? "0 4px 16px rgba(15,98,254,0.12)" : "0 2px 10px rgba(0,0,0,0.04)",
                                                        gap: 10,
                                                        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                                                        position: "relative",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {/* Completed ribbon */}
                                                    {isDone && (
                                                        <div style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <CheckCircle2 size={13} color="#fff" strokeWidth={2.5} />
                                                        </div>
                                                    )}

                                                    {/* Lesson number badge — always blue */}
                                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: isDone ? "#2563eb" : "rgba(15,98,254,0.1)", border: isDone ? "none" : "1.5px solid rgba(15,98,254,0.2)", color: isDone ? "#fff" : "#2563eb", fontSize: 17, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        {lessonIdx + 1}
                                                    </div>

                                                    {/* Title */}
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", flex: 1 }}>
                                                        {lesson.title}
                                                    </div>

                                                    {/* Footer: stars */}
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "auto" }}>
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
                        {/* Top accent — always blue */}
                        <div style={{ height: 4, background: "linear-gradient(90deg, #1e3a8a, #3b82f6)", margin: "-28px -32px 20px" }} />

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(15,98,254,0.1)", border: "1.5px solid rgba(15,98,254,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <IconComp size={20} color="#2563eb" strokeWidth={2} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{lessonModal.unitTitle}</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>{lessonModal.lesson.title}</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button
                                onClick={() => {
                                    router.push(getLessonPath(lessonModal.lesson.slug))
                                    setLessonModal(null)
                                }}
                                style={{ width: "100%", fontSize: 15, fontWeight: 800, padding: "14px 20px", background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "white", border: "none", borderRadius: 14, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", boxShadow: "0 6px 18px rgba(15,98,254,0.35)", transition: "all 0.2s" }}
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
