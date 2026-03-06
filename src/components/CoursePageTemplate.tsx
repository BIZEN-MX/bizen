"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { StarIcon } from "@/components/icons/StarIcon"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
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
    Flag,
    Lock,
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
    const { user, loading, dbProfile } = useAuth()
    const { completedLessons, lessonStars } = useLessonProgress()
    const [lessonModal, setLessonModal] = useState<{ lesson: GenericLesson; unitTitle: string } | null>(null)
    const [sequenceWarning, setSequenceWarning] = useState<string | null>(null)

    // Access check
    const hasActiveStripe = dbProfile?.subscriptionStatus === 'active'
    const hasActiveLicense = !!(dbProfile?.school?.licenses?.length)
    const hasPremiumAccess = hasActiveStripe || hasActiveLicense

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

    // Progress for this topic
    const allLessonsInTopic = subtemas.flatMap((s) => s.lessons)
    const topicCompletedCount = allLessonsInTopic.filter((l) => completedLessons.includes(l.slug)).length
    const topicTotalLessons = allLessonsInTopic.length

    const nextLessonSlug = React.useMemo(() => {
        for (const sub of subtemas) {
            for (const lesson of sub.lessons) {
                if (!completedLessons.includes(lesson.slug)) return lesson.slug
            }
        }
        return null
    }, [subtemas, completedLessons])

    const nextTopicId = React.useMemo(() => {
        for (let i = 0; i < SUBTEMAS_BY_COURSE.length; i++) {
            const tId = i + 1;
            const topicLessons = SUBTEMAS_BY_COURSE[i].flatMap((s: any) => s.lessons);
            const allDone = topicLessons.every((l: any) => completedLessons.includes(l.slug));
            if (!allDone) return tId;
        }
        return 1;
    }, [completedLessons]);

    const isTopicLockedBySequence = topicId > nextTopicId;

    const completedInTopic = allLessonsInTopic.filter((l) => completedLessons.includes(l.slug)).length
    const totalInTopic = allLessonsInTopic.length
    const topicPct = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0

    if (loading || !user) {
        return <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat', sans-serif" }} />
    }

    if (isTopicLockedBySequence) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FBFAF5", padding: 20, fontFamily: "'Montserrat', sans-serif", textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(15,98,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 40 }}>🔒</div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>Tema Bloqueado</h1>
                <p style={{ fontSize: 18, color: "#64748b", maxWidth: 500, lineHeight: 1.6, marginBottom: 32 }}>
                    Para acceder a este tema, primero debes completar todas las lecciones del <strong>Tema {topicId - 1}</strong>.
                </p>
                <button
                    onClick={() => router.push('/courses')}
                    style={{ padding: "14px 32px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(30,58,138,0.25)" }}
                >
                    Volver al Camino Financiero
                </button>
            </div>
        )
    }

    const topic = ALL_TOPICS.find((t) => t.id === topicId) || ALL_TOPICS[0]
    const IconComp = topic.icon
    const prevTopic = ALL_TOPICS.find((t) => t.id === topicId - 1)
    const nextTopic = ALL_TOPICS.find((t) => t.id === topicId + 1)

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
                            width: "100%",
                            maxWidth: "100%",
                            margin: "0 auto clamp(20px, 4vw, 32px)",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(15,98,254,0.3)",
                            boxSizing: "border-box"
                        }}
                    >
                        {/* Orbs inside hero */}
                        <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: "-20%", left: "5%", width: 220, height: 220, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "clamp(24px, 5vw, 48px)", alignItems: "center" }}>
                            {/* Left Side: Navigation, Icon & Title */}
                            <div style={{ flex: "1 1 500px", minWidth: 0 }}>
                                {/* Breadcrumb */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
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

                                <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
                                    <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <IconComp size={30} color="#93c5fd" strokeWidth={2} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h1 style={{ fontSize: "clamp(22px, 4vw, 40px)", fontWeight: 900, color: "#ffffff", margin: "0 0 8px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                                            {topic.title}
                                        </h1>
                                        <p style={{ fontSize: "clamp(13px, 1.8vw, 16px)", color: "#93c5fd", margin: 0, lineHeight: 1.5, maxWidth: 500 }}>
                                            Domina cada concepto a tu ritmo. Completa lecciones para ganar XP y subir de nivel.
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar Integrated */}
                                <div style={{ width: "100%", maxWidth: 600 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progreso del Tema</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa" }}>{completedInTopic} de {totalInTopic} lecciones completadas</span>
                                        </div>
                                        <span style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{topicPct}%</span>
                                    </div>
                                    <div style={{ width: "100%", height: 12, background: "rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden" }}>
                                        <div
                                            style={{
                                                width: `${topicPct}%`,
                                                height: "100%",
                                                background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
                                                borderRadius: 10,
                                                boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                                                transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Stats Cluster */}
                            <div style={{ flex: "0 1 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", minWidth: "280px" }}>
                                {[
                                    { label: "Cursos", value: subtemas.length.toString(), icon: BookOpen, color: "#60a5fa" },
                                    { label: "Lecciones", value: totalInTopic.toString(), icon: CheckCircle2, color: "#93c5fd" },
                                ].map((stat) => {
                                    const StatIcon = stat.icon
                                    return (
                                        <div
                                            key={stat.label}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                background: "rgba(255,255,255,0.06)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: 20,
                                                padding: "20px 24px",
                                                backdropFilter: "blur(4px)"
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                                                <StatIcon size={18} color={stat.color} />
                                                <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</div>
                                            </div>
                                            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{stat.value}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── SUBTEMAS ──────────────────────────────────────────────────── */}
                    <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px, 5vw, 44px)", paddingBottom: 40, boxSizing: "border-box" }}>
                        {subtemas.map((sub, subIdx) => {
                            const subCompleted = sub.lessons.filter((l) => completedLessons.includes(l.slug)).length
                            const subTotal = sub.lessons.length
                            const subPct = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0

                            const lessonOffset = subtemas.slice(0, subIdx).reduce((acc, s) => acc + s.lessons.length, 0)

                            return (
                                <div key={subIdx} id={`tema${topicId}-subtema-${subIdx + 1}`} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                                    {/* Subtema header bar */}
                                    <div style={{ display: "flex", flexDirection: "column", padding: "clamp(18px, 3vw, 26px)", paddingBottom: 16, background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)", borderRadius: 18, boxShadow: "0 8px 28px rgba(15,98,254,0.35)", border: "1px solid rgba(59,130,246,0.3)", marginBottom: 20 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>CURSO {(subIdx + 1).toString().padStart(2, "0")}</div>
                                                <div style={{ fontSize: "clamp(15px, 3vw, 19px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>{sub.title}</div>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{subTotal} lecciones · {subCompleted} completadas</div>
                                            </div>
                                            {subPct > 0 && (
                                                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>
                                                    {subPct}%
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ width: "100%", height: 6, borderRadius: 6, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                                            <div style={{ width: `${subPct}%`, height: "100%", borderRadius: 6, background: "rgba(255,255,255,0.92)", transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
                                        </div>
                                    </div>

                                    {/* Lessons horizontal scroll */}
                                    <div
                                        className="lessons-scroll-container"
                                        onScroll={(e) => {
                                            // Auto-scroll to next subtema removed as requested
                                        }}
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 16,
                                            overflowX: "auto",
                                            overflowY: "hidden",
                                            paddingBottom: 10,
                                            paddingTop: 4,
                                            scrollSnapType: "x mandatory",
                                            WebkitOverflowScrolling: "touch",
                                            scrollbarWidth: "none"
                                        }}
                                    >
                                        {sub.lessons.map((lesson, lessonIdx) => {
                                            const isDone = completedLessons.includes(lesson.slug)
                                            const stars = isDone ? (lessonStars[lesson.slug] ?? 0) : 0
                                            const isLastLesson = lessonIdx === sub.lessons.length - 1
                                            const absoluteLessonNumber = lessonOffset + lessonIdx + 1
                                            const isPremiumLesson = topicId > 1 || absoluteLessonNumber > 3;
                                            const isPaywalled = isPremiumLesson && !hasPremiumAccess;

                                            // BIZEN Sequential Unlocking logic:
                                            // 1. First lesson of Topic 1 is always unlocked.
                                            // 2. Any other lesson is locked if the PREVIOUS lesson in the topic is not completed.
                                            // 3. Lessons are also locked if they are paywalled (premium lesson + no subscription).
                                            const isFirstLessonOfWholeTopic = absoluteLessonNumber === 1;
                                            const previousLesson = absoluteLessonNumber > 1 ? allLessonsInTopic[absoluteLessonNumber - 2] : null;
                                            const isSequenceLocked = !isFirstLessonOfWholeTopic && previousLesson && !completedLessons.includes(previousLesson.slug);

                                            const isLocked = isPaywalled || isSequenceLocked;

                                            return (
                                                <React.Fragment key={lesson.slug}>
                                                    <div
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" || e.key === " ") {
                                                                e.preventDefault();
                                                                if (isLocked) {
                                                                    if (hasPremiumAccess && isSequenceLocked) {
                                                                        setSequenceWarning(lesson.slug);
                                                                        return;
                                                                    }
                                                                    router.push('/payment');
                                                                } else {
                                                                    setSequenceWarning(null);
                                                                    setLessonModal({ lesson, unitTitle: sub.title });
                                                                }
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            const isSelected = lessonModal?.lesson.slug === lesson.slug;
                                                            if (isLocked) {
                                                                if (hasPremiumAccess && isSequenceLocked) {
                                                                    setSequenceWarning(sequenceWarning === lesson.slug ? null : lesson.slug);
                                                                    return;
                                                                }
                                                                router.push('/payment');
                                                            } else {
                                                                setSequenceWarning(null);
                                                                setLessonModal(isSelected ? null : { lesson, unitTitle: sub.title });
                                                            }
                                                        }}
                                                        className={`cpt-lesson-card ${lesson.slug === nextLessonSlug ? "next-lesson-to-complete" : ""}`}
                                                        style={{
                                                            width: 320,
                                                            minWidth: 320,
                                                            flexShrink: 0,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            padding: "32px 28px",
                                                            background: isDone ? "linear-gradient(135deg, rgba(15,98,254,0.07) 0%, rgba(59,130,246,0.03) 100%)" : "#fff",
                                                            borderRadius: 24,
                                                            border: isLocked ? "2.5px dashed rgba(148, 163, 184, 0.4)" : (isDone ? "3px solid rgba(59,130,246,0.5)" : "2.5px solid rgba(15, 98, 254, 0.25)"),
                                                            boxSizing: "border-box",
                                                            scrollSnapAlign: "start",
                                                            cursor: "pointer",
                                                            boxShadow: isLocked ? "none" : (isDone ? "0 6px 20px rgba(15,98,254,0.12)" : "0 3px 12px rgba(0,0,0,0.04)"),
                                                            gap: 12,
                                                            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                                                            position: "relative",
                                                            overflow: "hidden",
                                                            opacity: isLocked ? 0.75 : 1
                                                        }}
                                                    >
                                                        {isLocked && (
                                                            <div style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", border: "1.5px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <Lock size={14} color="#64748b" />
                                                            </div>
                                                        )}

                                                        {isDone && !isLocked && (
                                                            <div style={{ position: "absolute", top: 12, right: 12, width: 26, height: 26, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <CheckCircle2 size={15} color="#fff" strokeWidth={2.5} />
                                                            </div>
                                                        )}

                                                        <div style={{
                                                            width: 44, height: 44, borderRadius: 14,
                                                            background: isLocked ? "#f8fafc" : (isDone ? "#2563eb" : "rgba(15,98,254,0.1)"),
                                                            border: isLocked ? "1.8px solid #e2e8f0" : (isDone ? "none" : "1.8px solid rgba(15,98,254,0.2)"),
                                                            color: isLocked ? "#94a3b8" : (isDone ? "#fff" : "#2563eb"),
                                                            fontSize: 19, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                                        }}>
                                                            {absoluteLessonNumber}
                                                        </div>

                                                        <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", flex: 1 }}>
                                                            {lesson.title}
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "auto" }}>
                                                            {isLocked ? (
                                                                <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: 999, textTransform: "uppercase" }}>Premium</div>
                                                            ) : (
                                                                <div style={{ display: "flex", gap: 3 }} role="img" aria-label={isDone ? `${stars} de 3 estrellas` : "Sin completar"}>
                                                                    {[1, 2, 3].map((i) => (
                                                                        <StarIcon
                                                                            key={i}
                                                                            size={18}
                                                                            filled={i <= stars}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Inline Action Panel */}
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            flexShrink: 0,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            width: lessonModal?.lesson.slug === lesson.slug ? 220 : 0,
                                                            opacity: lessonModal?.lesson.slug === lesson.slug ? 1 : 0,
                                                            transition: "width 0.42s cubic-bezier(0.34,1.4,0.64,1), opacity 0.3s ease",
                                                            pointerEvents: lessonModal?.lesson.slug === lesson.slug ? "auto" : "none",
                                                            overflow: "visible",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 200,
                                                                minWidth: 200,
                                                                background: "#fff",
                                                                borderRadius: 20,
                                                                padding: "18px 18px 18px 14px",
                                                                border: "2.5px solid #2563eb",
                                                                boxShadow: "0 12px 36px rgba(37,99,235,0.15)",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                justifyContent: "center",
                                                                gap: 11,
                                                                position: "relative",
                                                                marginLeft: 10,
                                                                transform: lessonModal?.lesson.slug === lesson.slug
                                                                    ? "scale(1) translateX(0)"
                                                                    : "scale(0.88) translateX(-12px)",
                                                                transition: "transform 0.42s cubic-bezier(0.34,1.56,0.64,1)",
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            {/* Top accent bar */}
                                                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #1e3a8a, #60a5fa)", borderRadius: "20px 20px 0 0" }} />

                                                            {/* Lesson number */}
                                                            <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8 }}>
                                                                Lección {absoluteLessonNumber}
                                                            </div>

                                                            {/* XP badge */}
                                                            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#F0F9FF", border: "1.5px solid #BAE6FD", borderRadius: 10, padding: "6px 11px" }}>
                                                                <Zap size={13} color="#0EA5E9" fill="#0EA5E9" />
                                                                <span style={{ fontSize: 11, fontWeight: 800, color: "#0369A1" }}>
                                                                    {isDone ? "+5 XP al repetir" : "Hasta 15 XP"}
                                                                </span>
                                                            </div>

                                                            {/* CTA */}
                                                            <button
                                                                className="panel-cta-btn"
                                                                onClick={() => {
                                                                    router.push(getLessonPath(lesson.slug));
                                                                    setLessonModal(null);
                                                                }}
                                                                style={{
                                                                    width: "100%", fontSize: 13, fontWeight: 900, padding: "10px 14px",
                                                                    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                                                                    color: "white", border: "none", borderRadius: 11,
                                                                    cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                                                                    boxShadow: "0 5px 16px rgba(15,98,254,0.35)",
                                                                    transition: "opacity 0.15s ease"
                                                                }}
                                                            >
                                                                {isDone ? "Repetir lección" : "¡Empezar!"}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {!isLastLesson ? (() => {
                                                        const nextAbsoluteNumber = lessonOffset + (lessonIdx + 1) + 1;
                                                        const isNextLocked = (topicId > 1 || nextAbsoluteNumber > 3) && !hasPremiumAccess;
                                                        const arrowColor = isNextLocked ? "#94a3b8" : "#1e3a8a";
                                                        const strokeColor = isNextLocked ? "#cbd5e1" : "#3b82f6";

                                                        return (
                                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0, flexShrink: 0, alignSelf: "center", padding: "0 2px" }}>
                                                                <svg width="60" height="28" viewBox="0 0 60 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <defs>
                                                                        <linearGradient id={`arrowGrad-${subIdx}-${lessonIdx}`} x1="0" y1="14" x2="60" y2="14" gradientUnits="userSpaceOnUse">
                                                                            <stop stopColor={isNextLocked ? "#f1f5f9" : "#dbeafe"} />
                                                                            <stop offset="0.5" stopColor={strokeColor} />
                                                                            <stop offset="1" stopColor={isNextLocked ? "#64748b" : "#1e3a8a"} />
                                                                        </linearGradient>
                                                                        <filter id={`arrowGlow-${subIdx}-${lessonIdx}`} x="-20%" y="-150%" width="140%" height="400%">
                                                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                                                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                                                        </filter>
                                                                    </defs>
                                                                    <line x1="2" y1="14" x2="44" y2="14" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" opacity="0.2" filter={`url(#arrowGlow-${subIdx}-${lessonIdx})`} />
                                                                    <line x1="2" y1="14" x2="44" y2="14" stroke={`url(#arrowGrad-${subIdx}-${lessonIdx})`} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
                                                                    <path d="M42 7L56 14L42 21" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                                    <circle cx="56" cy="14" r="3" fill={isNextLocked ? "#64748b" : "#1e3a8a"} />
                                                                </svg>
                                                            </div>
                                                        );
                                                    })() : (
                                                        (subIdx === subtemas.length - 1) && (
                                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0, flexShrink: 0, alignSelf: "center", paddingLeft: 8, paddingRight: 20 }}>
                                                                <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 12 }}>
                                                                    <defs>
                                                                        <linearGradient id="finishArrowGrad" x1="0" y1="10" x2="36" y2="10" gradientUnits="userSpaceOnUse">
                                                                            <stop stopColor="#bfdbfe" /><stop offset="1" stopColor="#2563eb" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                    <line x1="2" y1="10" x2="36" y2="10" stroke="url(#finishArrowGrad)" strokeWidth="2.5" strokeLinecap="round" />
                                                                </svg>
                                                                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(37,99,235,0.35), 0 0 0 6px rgba(37,99,235,0.12)", animation: "flagPulse 2s ease-in-out infinite" }}>
                                                                    <Flag size={28} color="#fff" strokeWidth={2.5} fill="#fff" />
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>

            {/* Modal removed as requested */}

            {/* Sequence Warning Overlay */}
            {sequenceWarning && (
                <div
                    onClick={() => setSequenceWarning(null)}
                    style={{
                        position: "fixed", inset: 0, zIndex: 9999,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(15, 23, 42, 0.45)",
                        backdropFilter: "blur(8px)",
                        animation: "seqOverlayIn 0.25s ease"
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff",
                            borderRadius: 28,
                            padding: "44px 40px 36px",
                            maxWidth: 380,
                            width: "90%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 20,
                            boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
                            animation: "seqCardIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                            position: "relative",
                            overflow: "hidden",
                            textAlign: "center",
                            fontFamily: "'Montserrat', sans-serif"
                        }}
                    >
                        {/* Top gradient bar */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa)" }} />

                        {/* Custom SVG icon: Lock */}
                        <div style={{
                            width: 72, height: 72,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                            border: "2px solid #3b82f6",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0
                        }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Lock body */}
                                <rect x="8" y="18" width="20" height="14" rx="3" fill="#2563eb" />
                                {/* Lock shackle */}
                                <path d="M12 18v-5a6 6 0 0112 0v5" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                {/* Keyhole circle */}
                                <circle cx="18" cy="25" r="2.5" fill="#fff" />
                                {/* Keyhole stem */}
                                <rect x="17" y="25" width="2" height="3" rx="1" fill="#fff" />
                            </svg>
                        </div>

                        {/* Title */}
                        <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", lineHeight: 1.25 }}>
                            ¡Vas rápido!
                        </div>

                        {/* Body */}
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#64748b", lineHeight: 1.6, maxWidth: 280 }}>
                            Termina la lección anterior para desbloquear ésta. El orden importa — construyamos base a base.
                        </div>

                        {/* Dismiss button */}
                        <button
                            onClick={() => setSequenceWarning(null)}
                            className="seq-dismiss-btn"
                            style={{
                                marginTop: 4,
                                padding: "12px 32px",
                                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                                color: "#fff",
                                border: "none", borderRadius: 12,
                                fontSize: 14, fontWeight: 900,
                                cursor: "pointer",
                                fontFamily: "'Montserrat', sans-serif",
                                boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
                                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, opacity 0.15s ease"
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        /* Sidebar compensation */
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content { padding-left: 252px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
          .courses-main-content > div { max-width: calc(100vw - 252px - 32px) !important; width: 100% !important; margin: 0 auto !important; }
        }
        @media (min-width: 1161px) {
          .courses-main-content { padding-left: 312px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
          .courses-main-content > div { max-width: calc(100vw - 312px - 48px) !important; width: 100% !important; margin: 0 auto !important; }
        }
        @media (max-width: 767px) {
          .courses-main-content { padding-top: 80px !important; padding-bottom: calc(65px + env(safe-area-inset-bottom)) !important; padding-left: 12px !important; padding-right: 12px !important; }
          .courses-main-content > div { max-width: 100% !important; }
        }

        /* Lesson card hover */
        .cpt-lesson-card:not(.next-lesson-to-complete):hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 10px 28px rgba(37,99,235,0.14) !important;
          border-color: rgba(59,130,246,0.5) !important;
        }
        .cpt-lesson-card:active { transform: translateY(0) !important; }

        /* Nav buttons hover */
        .cpt-nav-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.12) !important; }

        /* Scrollbar styling */
        .lessons-scroll-container::-webkit-scrollbar { display: none; }
        .lessons-scroll-container { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes active-lesson-pulse {
          0%, 100% { 
            box-shadow: 0 10px 28px rgba(37,99,235,0.14); 
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 14px 28px rgba(37, 99, 235, 0.2); 
            transform: scale(1.02);
          }
        }
        .next-lesson-to-complete {
          animation: active-lesson-pulse 4s ease-in-out infinite !important;
        }

        .panel-cta-btn:hover { opacity: 0.85; }
        .panel-cta-btn:active { opacity: 0.7; }
        .seq-dismiss-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 28px rgba(37,99,235,0.45) !important; }
        .seq-dismiss-btn:active { transform: translateY(0) !important; opacity: 0.85; }

        @keyframes seqOverlayIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes seqCardIn {
          0% { opacity: 0; transform: scale(0.88) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    )
}
