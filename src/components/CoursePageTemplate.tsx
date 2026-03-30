"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
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
    Sparkles,
    Send,
    MessageCircle,
    X,
    LucideIcon
} from "lucide-react"
import { getFlashcardsForSubtema } from "@/data/flashcardData"
import FlashcardActivity from "@/components/lessons/FlashcardActivity"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GenericLesson {
    title: string
    slug: string
    courseId?: string
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



// ─── Subtema bar visual variants (all blue, different gradient & depth) ──────

const SUBTEMA_VARIANTS = [
    {
        // Deep navy → royal blue — classic strong
        background: "linear-gradient(135deg, #0c1f5a 0%, #1e3a8a 50%, #2563eb 100%)",
        boxShadow: "0 10px 32px rgba(12,31,90,0.55)",
        progressBg: "rgba(255,255,255,0.22)",
        progressFill: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(37,99,235,0.4)"
    },
    {
        // Indigo-navy → cobalt — more violet warmth
        background: "linear-gradient(150deg, #1a1060 0%, #2338a8 45%, #3b5fe8 100%)",
        boxShadow: "0 10px 32px rgba(26,16,96,0.50)",
        progressBg: "rgba(255,255,255,0.20)",
        progressFill: "rgba(255,255,255,0.90)",
        border: "1px solid rgba(59,95,232,0.4)"
    },
    {
        // Midnight → strong blue — the darkest, most dramatic
        background: "linear-gradient(120deg, #080e2a 0%, #122465 40%, #1e48c8 100%)",
        boxShadow: "0 10px 32px rgba(8,14,42,0.60)",
        progressBg: "rgba(255,255,255,0.18)",
        progressFill: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(30,72,200,0.35)"
    },
    {
        // Rich cobalt → electric blue — most saturated/vibrant
        background: "linear-gradient(155deg, #0f3bcc 0%, #1a52f0 50%, #3b6ef5 100%)",
        boxShadow: "0 10px 32px rgba(15,59,204,0.50)",
        progressBg: "rgba(255,255,255,0.22)",
        progressFill: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(59,110,245,0.45)"
    },
    {
        // Steel-blue → sapphire — slightly cooler, more slate
        background: "linear-gradient(140deg, #0d2a7a 0%, #1a4abf 45%, #2662e0 100%)",
        boxShadow: "0 10px 32px rgba(13,42,122,0.52)",
        progressBg: "rgba(255,255,255,0.20)",
        progressFill: "rgba(255,255,255,0.90)",
        border: "1px solid rgba(38,98,224,0.4)"
    },
] as const

// ─── Props ───────────────────────────────────────────────────────────────────

interface CoursePageTemplateProps {
    topicId: string | number
    subtemas: GenericSubtema[]
    /** The lesson URL builder. Receives the lesson slug and should return the full path. */
    getLessonPath: (slug: string, courseId?: string) => string
    topicTitle?: string // Optional override
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CoursePageTemplate({
    topicId,
    subtemas,
    getLessonPath,
    topicTitle,
}: CoursePageTemplateProps) {
    const router = useRouter()
    const { user, loading, dbProfile } = useAuth()
    const { completedLessons, lessonStars } = useLessonProgress()

    const topicNumStr = topicId.toString().replace('tema-', '').replace(/^0+/, '')
    const topicNum = parseInt(topicNumStr)

    const topic = ALL_TOPICS.find((t) => t.id === topicNum) || {
        id: Number(topicId),
        title: topicTitle || "Cargando...",
        icon: BookOpen,
        color: "#3b82f6",
        lessons: 0
    }
    const [lessonModal, setLessonModal] = useState<{ lesson: GenericLesson; unitTitle: string } | null>(null)
    const [sequenceWarning, setSequenceWarning] = useState<string | null>(null)
    
    // Billy Insight State
    const [insight, setInsight] = useState<string | null>(null)
    const [loadingInsight, setLoadingInsight] = useState(true)
    const [flashcardSet, setFlashcardSet] = useState<any[] | null>(null)

    // Access check
    const hasActiveStripe = dbProfile?.subscriptionStatus === 'active'
    const hasActiveLicense = !!(dbProfile?.school?.licenses?.length)
    const isInstitutional = !!dbProfile?.schoolId || (dbProfile?.role && dbProfile.role !== 'particular')
    const hasPremiumAccess = hasActiveStripe || hasActiveLicense || isInstitutional

    React.useEffect(() => {
        if (!loading && !user) {
            window.open("/login", "_blank")
        }
    }, [loading, user])

    // Billy Insights
    useEffect(() => {
        const fetchInsight = async () => {
            if (!topic?.title) return
            try {
                setLoadingInsight(true)
                const res = await fetch(`/api/dashboard/insights?topic=${encodeURIComponent(topic.title)}`)
                const data = await res.json()
                setInsight(data.insight)
            } catch (e) {
                console.error("Failed to fetch insights", e)
            } finally {
                setLoadingInsight(false)
            }
        }
        fetchInsight()
    }, [topicId, topic?.title])

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

    // ─── Hide Sidebar on Flashcard Activity ──────────────────────────────────
    useEffect(() => {
        if (flashcardSet) {
            document.documentElement.setAttribute('data-flashcard-active', 'true')
        } else {
            document.documentElement.removeAttribute('data-flashcard-active')
        }
        return () => document.documentElement.removeAttribute('data-flashcard-active')
    }, [flashcardSet])

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

    const currentTopicNumStr = topicId.toString().replace('tema-', '').replace(/^0+/, '')
    const currentTopicNum = parseInt(currentTopicNumStr)
    const isTopicLockedBySequence = false; // Bloqueo desactivado para pruebas

    const completedInTopic = allLessonsInTopic.filter((l) => completedLessons.includes(l.slug)).length
    const totalInTopic = allLessonsInTopic.length
    const topicPct = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0

    if (loading || !user || loadingInsight) {
        return <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", }} />
    }

    if (isTopicLockedBySequence) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FBFAF5", padding: 20, textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(15,98,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Lock size={40} color="#1e3a8a" />
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0f172a", marginBottom: 12 }}>Tema Bloqueado</h1>
                <p style={{ fontSize: 18, color: "#64748b", maxWidth: 500, lineHeight: 1.6, marginBottom: 32 }}>
                    Para acceder a este tema, primero debes completar todas las lecciones del <strong>Tema {currentTopicNum - 1}</strong>.
                </p>
                <button
                    onClick={() => router.push('/courses?noredirect=true')}
                    style={{ padding: "14px 32px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 500, cursor: "pointer", boxShadow: "0 8px 24px rgba(30,58,138,0.25)" }}
                >
                    Volver al Camino Financiero
                </button>
            </div>
        )
    }

    const IconComp = topic.icon
    const prevTopic = !isNaN(topicNum) ? ALL_TOPICS.find((t) => t.id === topicNum - 1) : null
    const nextTopic = !isNaN(topicNum) ? ALL_TOPICS.find((t) => t.id === topicNum + 1) : null

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
                        className="cpt-hero"
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
                                        onClick={() => router.push("/courses?noredirect=true")}
                                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#93c5fd", fontSize: 12, fontWeight: 500, }}
                                    >
                                        <ChevronLeft size={12} /> Todos los Temas
                                    </button>
                                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>›</span>
                                    <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                                        <Zap size={12} color="#60a5fa" />
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                            {topicId.toString().replace('tema-', '').padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
                                    {/* Topic Icon Removed as requested */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h1 style={{ fontSize: "clamp(22px, 4vw, 40px)", fontWeight: 500, color: "#ffffff", margin: "0 0 8px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
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
                                            <span style={{ fontSize: 13, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progreso del Tema</span>
                                            <span style={{ fontSize: 12, fontWeight: 500, color: "#60a5fa" }}>{completedInTopic} de {totalInTopic} lecciones completadas</span>
                                        </div>
                                        <span style={{ fontSize: 32, fontWeight: 500, color: "#fff", lineHeight: 1 }}>{topicPct}%</span>
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
                                                <div style={{ fontSize: 11, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</div>
                                            </div>
                                            <div style={{ fontSize: 28, fontWeight: 500, color: "#fff", lineHeight: 1.1 }}>{stat.value}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>


                    {/* ── BILLY INSIGHT SECTION ────────────────────────────────────────── */}
                    {insight && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ 
                                width: "100%", 
                                maxWidth: "100%", 
                                margin: "0 auto 32px", 
                                boxSizing: "border-box",
                            }}
                        >
                            <div style={{ 
                                background: "rgba(255, 255, 255, 0.7)", 
                                backdropFilter: "blur(20px)", 
                                borderRadius: 24, 
                                padding: "20px 24px", 
                                border: "1px solid rgba(255, 255, 255, 0.8)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                                display: "flex",
                                alignItems: "center",
                                gap: 16
                            }}>
                                <div style={{ 
                                    width: 52, 
                                    height: 52, 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    flexShrink: 0,
                                    position: "relative"
                                }}>
                                    <Image 
                                        src="/billy_chatbot.png" 
                                        alt="Billy" 
                                        width={52} 
                                        height={52} 
                                        style={{ 
                                            objectFit: "contain",
                                            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.08))"
                                        }} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontSize: "clamp(13px, 1.6vw, 15px)", 
                                        color: "#1e293b", 
                                        lineHeight: 1.5,
                                        fontWeight: 500
                                    }}>
                                        &quot;{insight.replace(/\*/g, '')}&quot;
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── SUBTEMAS ──────────────────────────────────────────────────── */}
                    <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px, 5vw, 44px)", paddingBottom: 40, boxSizing: "border-box" }}>
                        {subtemas.map((sub, subIdx) => {
                            const subCompleted = sub.lessons.filter((l) => completedLessons.includes(l.slug)).length
                            const subTotal = sub.lessons.length
                            const subPct = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0

                            const lessonOffset = subtemas.slice(0, subIdx).reduce((acc, s) => acc + s.lessons.length, 0)

                            return (
                                <div key={subIdx} id={`tema${topicId}-subtema-${subIdx + 1}`} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                                    {/* Subtema header bar – variant cycles on index */}
                                    {(() => {
                                        const v = SUBTEMA_VARIANTS[subIdx % SUBTEMA_VARIANTS.length]
                                        return (
                                            <div style={{ display: "flex", flexDirection: "column", padding: "clamp(18px, 3vw, 26px)", paddingBottom: 16, background: v.background, borderRadius: 18, boxShadow: v.boxShadow, border: v.border, marginBottom: 20 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>CURSO {(subIdx + 1).toString().padStart(2, "0")}</div>
                                                        <div style={{ fontSize: "clamp(15px, 3vw, 19px)", fontWeight: 500, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>{sub.title}</div>
                                                        <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{subTotal} lecciones · {subCompleted} completadas</div>
                                                    </div>
                                                    {subPct > 0 && (
                                                        <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#fff" }}>
                                                            {subPct}%
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ width: "100%", height: 6, borderRadius: 6, background: v.progressBg, overflow: "hidden" }}>
                                                    <div style={{ width: `${subPct}%`, height: "100%", borderRadius: 6, background: v.progressFill, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
                                                </div>
                                            </div>
                                        )
                                    })()}

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
                                            paddingBottom: "clamp(40px, 8vw, 60px)",
                                            paddingTop: "clamp(20px, 4vw, 30px)",
                                            marginTop: "-20px",
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
                                            const isPremiumLesson = currentTopicNum > 1 || absoluteLessonNumber > 3;
                                            const isPaywalled = isPremiumLesson && !hasPremiumAccess;

                                            // BIZEN Sequential Unlocking logic:
                                            // 1. First lesson of Topic 1 is always unlocked.
                                            // 2. Any other lesson is locked if the PREVIOUS lesson in the topic is not completed.
                                            // 3. Lessons are also locked if they are paywalled (premium lesson + no subscription).
                                            const isFirstLessonOfWholeTopic = absoluteLessonNumber === 1;
                                            const previousLesson = absoluteLessonNumber > 1 ? allLessonsInTopic[absoluteLessonNumber - 2] : null;
                                            const isSequenceLocked = false; // Bloqueo desactivado para pruebas

                                            const isExam = lesson.slug.startsWith('eval-') || lesson.slug.includes('examen') || lesson.slug.includes('evaluacion') || lesson.title.toLowerCase().includes('examen') || lesson.title.toLowerCase().includes('evaluación');
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
                                                            if (!dbProfile && user) return;
                                                            const isSelected = lessonModal?.lesson.slug === lesson.slug;
                                                            if (isLocked) {
                                                                if (hasPremiumAccess) {
                                                                    if (isSequenceLocked) {
                                                                        setSequenceWarning(sequenceWarning === lesson.slug ? null : lesson.slug);
                                                                    }
                                                                    return;
                                                                }
                                                                router.push('/payment');
                                                            } else {
                                                                setSequenceWarning(null);
                                                                setLessonModal(isSelected ? null : { lesson, unitTitle: sub.title });
                                                            }
                                                        }}
                                                        className={`cpt-lesson-card ${lesson.slug === nextLessonSlug ? "next-lesson-to-complete" : ""} ${isExam ? "is-exam-card" : ""}`}
                                                        style={{
                                                            width: "clamp(180px, 65vw, 320px)",
                                                            minWidth: "initial",
                                                            flexShrink: 0,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            padding: "clamp(18px, 3.5vw, 36px) clamp(14px, 3vw, 32px)",
                                                            background: isExam 
                                                                ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" 
                                                                : (isDone ? "#f0f7ff" : "#ffffff"),
                                                            borderRadius: 24,
                                                            border: isLocked
                                                                ? "2px dashed #cbd5e1"
                                                                : (isExam ? "2.5px solid #3b82f6" : (isDone ? "2.5px solid #2563eb" : "2.5px solid #ffffff")),
                                                            boxSizing: "border-box",
                                                            scrollSnapAlign: "start",
                                                            cursor: "pointer",
                                                            boxShadow: isExam 
                                                                ? "0 15px 40px rgba(15,98,254,0.15), inset 0 0 0 1px rgba(255,255,255,0.05)"
                                                                : (isLocked ? "none" : "0 8px 20px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.8)"),
                                                            gap: "clamp(8px, 2vw, 12px)",
                                                            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                                                            position: "relative",
                                                            overflow: "hidden",
                                                            opacity: isLocked ? 0.75 : 1,
                                                            transform: lesson.slug === nextLessonSlug ? "scale(1.02)" : "scale(1)"
                                                        }}
                                                    >
                                                        {isExam && !isLocked && (
                                                            <div style={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                                                        )}

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
                                                            display: "flex", 
                                                            alignItems: "center", 
                                                            justifyContent: "space-between",
                                                            marginBottom: 4
                                                        }}>
                                                            <div style={{
                                                                width: "clamp(34px, 10vw, 44px)", height: "clamp(34px, 10vw, 44px)", borderRadius: 14,
                                                                background: isExam ? "rgba(59,130,246,0.15)" : (isLocked ? "#f8fafc" : (isDone ? "#2563eb" : "rgba(15,98,254,0.1)")),
                                                                border: isExam ? "2px solid #3b82f6" : (isLocked ? "1.8px solid #e2e8f0" : (isDone ? "none" : "1.8px solid rgba(15,98,254,0.2)")),
                                                                color: isExam ? "#60a5fa" : (isLocked ? "#94a3b8" : (isDone ? "#fff" : "#2563eb")),
                                                                fontSize: "clamp(16px, 4vw, 19px)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                                            }}>
                                                                {isExam ? <Trophy size={20} /> : absoluteLessonNumber}
                                                            </div>
                                                            {isExam && (
                                                                <div style={{ 
                                                                    fontSize: 10, 
                                                                    fontWeight: 900, 
                                                                    color: "#60a5fa", 
                                                                    background: "rgba(59,130,246,0.1)", 
                                                                    padding: "3px 8px", 
                                                                    borderRadius: 6, 
                                                                    letterSpacing: "0.1em",
                                                                    textTransform: "uppercase"
                                                                }}>
                                                                    Certificación
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div style={{ 
                                                            fontSize: "clamp(14px, 3.5vw, 17px)", 
                                                            fontWeight: isExam ? 700 : 500, 
                                                            color: isExam ? "#fff" : "#1e293b", 
                                                            lineHeight: 1.35, 
                                                            overflow: "hidden", 
                                                            display: "-webkit-box", 
                                                            WebkitLineClamp: 3, 
                                                            WebkitBoxOrient: "vertical", 
                                                            flex: 1 
                                                        }}>
                                                            {isExam ? "EXAMEN: " : ""}{lesson.title}
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "auto" }}>
                                                            {isLocked ? (
                                                                <div style={{ fontSize: 11, fontWeight: 500, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: 999, textTransform: "uppercase" }}>
                                                                    {isPaywalled ? "Premium" : "Bloqueado"}
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: "flex", gap: 3 }} role="img" aria-label={isDone ? `${stars} de 3 estrellas` : "Sin completar"}>
                                                                    {[1, 2, 3].map((i) => (
                                                                        <StarIcon
                                                                            key={i}
                                                                            size={18}
                                                                            filled={i <= stars}
                                                                            color={isExam ? "#fbbf24" : undefined}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>


                                                    {/* Inline Action Panel removed - now using full screen modal */}

                                                    {!isLastLesson ? (() => {
                                                        const nextAbsoluteNumber = lessonOffset + (lessonIdx + 1) + 1;
                                                        const isNextLocked = ((typeof topicId === 'number' && topicId > 1) || nextAbsoluteNumber > 3) && !hasPremiumAccess;
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

                                        {/* Flashcard Review Card */}
                                        {(() => {
                                            const subtemaFlashcards = getFlashcardsForSubtema(`tema-${topicNum}`, subIdx)
                                            if (subtemaFlashcards.length === 0) return null

                                            const subCompleted = sub.lessons.filter((l) => completedLessons.includes(l.slug)).length
                                            const subTotal = sub.lessons.length
                                            const isSubtemaDone = subCompleted === subTotal

                                            return (
                                                <div
                                                    onClick={() => setFlashcardSet(subtemaFlashcards)}
                                                    className="cpt-lesson-card flashcard-review-card"
                                                    style={{
                                                        width: "clamp(180px, 65vw, 320px)",
                                                        minWidth: "initial",
                                                        flexShrink: 0,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        padding: "clamp(12px, 3.5vw, 32px) clamp(10px, 3vw, 28px)",
                                                        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                                                        borderRadius: 24,
                                                        border: "2.5px solid #2563eb",
                                                        boxSizing: "border-box",
                                                        scrollSnapAlign: "start",
                                                        cursor: "pointer",
                                                        boxShadow: "0 20px 40px rgba(15,98,254,0.15)",
                                                        gap: "clamp(8px, 2vw, 12px)",
                                                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                                                        position: "relative",
                                                        overflow: "hidden",
                                                        color: "white"
                                                    }}
                                                >
                                                    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
                                                    
                                                    <div style={{
                                                        width: "clamp(34px, 10vw, 44px)", height: "clamp(34px, 10vw, 44px)", borderRadius: 14,
                                                        background: "rgba(255,255,255,0.1)",
                                                        border: "1.8px solid rgba(255,255,255,0.2)",
                                                        color: "#fff",
                                                        fontSize: "clamp(16px, 4vw, 19px)", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                                    }}>
                                                        <Zap size={20} fill="#fff" />
                                                    </div>

                                                    <div style={{ fontSize: "clamp(14px, 3.5vw, 16px)", fontWeight: 700, color: "#fff", lineHeight: 1.35 }}>
                                                        REPASO: Tarjetas de Conceptos
                                                    </div>
                                                    
                                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.4 }}>
                                                        {isSubtemaDone ? "¡Listo para repasar! Domina los conceptos clave de este curso." : "Disponible al terminar las lecciones de este curso."}
                                                    </p>

                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                                                        <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                            {subtemaFlashcards.length} TARJETAS
                                                        </div>
                                                        <ChevronRight size={18} color="#93c5fd" />
                                                    </div>
                                                </div>
                                            )
                                        })()}
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
                        }}
                    >
                        {/* Top gradient bar */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa)" }} />

                        {/* Mascot Image Removed */}

                        {/* Title */}
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", lineHeight: 1.25, marginBottom: 4 }}>
                            ¡Espera!
                        </div>

                        {/* Body */}
                        <div style={{ fontSize: 16, fontWeight: 500, color: "#64748b", lineHeight: 1.6, maxWidth: 300 }}>
                            Termina las lecciones anteriores para desbloquear esta.
                        </div>

                        {/* Dismiss button */}
                        <button
                            onClick={() => setSequenceWarning(null)}
                            className="seq-dismiss-btn cpt-modal-btn"
                            style={{
                                marginTop: 4,
                                padding: "12px 32px",
                                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                                color: "#fff",
                                border: "none", borderRadius: 12,
                                fontSize: 14, fontWeight: 500,
                                cursor: "pointer",
                                boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.5"}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Full Screen Lesson Modal */}
            {lessonModal && (
                <div
                    onClick={() => setLessonModal(null)}
                    style={{
                        position: "fixed", inset: 0, zIndex: 10000,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(10, 25, 47, 0.45)",
                        backdropFilter: "blur(12px)",
                        padding: 24,
                        animation: "seqOverlayIn 0.3s ease"
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 32,
                            padding: "48px 40px",
                            maxWidth: 500,
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 24,
                            boxShadow: "0 40px 100px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.8)",
                            animation: "seqCardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                            position: "relative",
                            overflow: "hidden",
                            textAlign: "center",
                        }}
                    >
                        {/* Decorative background accent */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #0F62FE, #60A5FA, #0F62FE)" }} />
                        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle, rgba(15,98,254,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />

                        <button 
                            onClick={() => setLessonModal(null)}
                            style={{ position: "absolute", top: 20, right: 20, background: "#f1f5f9", border: "none", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", transition: "all 0.2s", zIndex: 10 }}
                        >
                            <X size={20} />
                        </button>

                        {/* Mascot Image Removed */}

                        {/* Central Icon Removed as requested */}

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                {lessonModal.unitTitle}
                            </div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                                {lessonModal.lesson.title}
                            </h2>
                        </div>

                        <div style={{ 
                            background: "#f8fafc", borderRadius: 20, padding: "16px 24px", width: "100%", 
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                            border: "1px solid #e2e8f0"
                        }}>
                            {/* Zap Icon Removed */}
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1 }}>Recompensa de XP</div>
                                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                                    {completedLessons.includes(lessonModal.lesson.slug) ? "+5 XP por repaso" : "Hasta +15 XP por completar"}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginTop: 8 }}>
                            <button
                                onClick={() => {
                                    router.push(getLessonPath(lessonModal.lesson.slug, lessonModal.lesson.courseId));
                                    setLessonModal(null);
                                }}
                                style={{
                                    width: "100%", height: 60, borderRadius: 18, border: "none",
                                    background: "linear-gradient(135deg, #0F62FE 0%, #0056E7 100%)",
                                    color: "#fff", fontWeight: 700, fontSize: 18,
                                    cursor: "pointer", boxShadow: "0 12px 24px -6px rgba(15,98,254,0.4)",
                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.6"}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                            >
                                {completedLessons.includes(lessonModal.lesson.slug) ? "Repasar Lección" : "¡Empezar Lección!"}
                            </button>
                            
                            <button
                                onClick={() => setLessonModal(null)}
                                style={{
                                    width: "100%", height: 50, borderRadius: 18, border: "1.5px solid #e2e8f0",
                                    background: "transparent", color: "#64748b", fontWeight: 600, fontSize: 15,
                                    cursor: "pointer", transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.4"}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                            >
                                Quizás más tarde
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 767px) {
                    .courses-main-content {
                        padding-left: 16px !important;
                        padding-right: 16px !important;
                        padding-top: 14px !important;
                        padding-bottom: calc(85px + env(safe-area-inset-bottom)) !important;
                    }
                    .cpt-hero {
                        padding: 24px 20px !important;
                        margin-bottom: 24px !important;
                    }
                    .cpt-hero h1 {
                        font-size: 24px !important;
                        margin-bottom: 8px !important;
                    }
                    .cpt-hero p {
                        font-size: 13px !important;
                        margin-bottom: 0 !important;
                        max-width: 300px !important;
                    }
                    .cpt-hero > div:first-of-type {
                        flex-direction: column !important;
                        gap: 24px !important;
                        align-items: flex-start !important;
                    }
                    .cpt-hero > div:first-of-type > div:first-child {
                        flex: initial !important;
                        width: 100% !important;
                    }
                    .cpt-hero > div:first-of-type > div:last-child {
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        width: 100% !important;
                        min-width: unset !important;
                        gap: 12px !important;
                    }
                    .cpt-hero > div:first-of-type > div:last-child > div {
                        padding: 12px 14px !important;
                        border-radius: 16px !important;
                    }

                    .billy-chat-header {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 16px !important;
                    }
                    .billy-chat-btn {
                        width: 100% !important;
                        justify-content: center !important;
                    }

                    .cpt-lesson-card {
                        width: 170px !important;
                        padding: 18px 14px !important;
                    }
                    .cpt-lesson-card div[style*="fontSize: 19"] {
                        font-size: 15px !important;
                    }
                }

                @keyframes dot-pulse-mini {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .dot-pulse-mini {
                    animation: dot-pulse-mini 1.2s infinite ease-in-out;
                }
                
                @keyframes panel-shimmer {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
                .cpt-panel-shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    animation: panel-shimmer 1.5s ease-out forwards;
                }

                /* Sidebar compensation */
                @media (min-width: 768px) and (max-width: 1160px) {
                  .courses-main-content { padding-left: 252px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
                  .courses-main-content > div { max-width: calc(100vw - 252px - 32px) !important; width: 100% !important; margin: 0 auto !important; }
                }
                @media (min-width: 1161px) {
                  .courses-main-content { padding-left: 312px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
                  .courses-main-content > div { max-width: calc(100vw - 312px - 48px) !important; width: 100% !important; margin: 0 auto !important; }
                }

                /* Flashcard Overrides - Hide Sidebar & Reset Padding */
                [data-flashcard-active="true"] [data-fixed-sidebar] {
                  display: none !important;
                }
                [data-flashcard-active="true"] .courses-main-content {
                  padding-left: 16px !important;
                  width: 100% !important;
                }
                [data-flashcard-active="true"] .courses-main-content > div {
                  max-width: 1200px !important;
                  margin: 0 auto !important;
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
                    box-shadow: 0 4px 12px rgba(15,98,254,0.08), 0 0 0 1px rgba(15,98,254,0.1); 
                    border-color: rgba(15, 98, 254, 0.2);
                  }
                  50% { 
                    box-shadow: 0 0 40px rgba(15,98,254,0.25), 0 0 0 2.5px rgba(15,98,254,0.2); 
                    border-color: rgba(15, 98, 254, 0.5);
                    transform: translateY(-2px) scale(1.01);
                  }
                }
                .next-lesson-to-complete {
                  animation: active-lesson-pulse 3s ease-in-out infinite !important;
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

                /* Media queries for smaller screens */
                @media (max-width: 480px) {
                  .cpt-lesson-card {
                    width: 155px !important;
                    min-height: 150px !important;
                    padding: 12px 10px !important;
                  }
                  .lessons-scroll-container {
                     gap: 8px !important;
                     padding-bottom: 20px !important;
                  }
                }
                
                @keyframes cpt-shimmer {
                  0%   { background-position: -200% center; }
                  100% { background-position: 200% center; }
                }
                .cpt-panel-shimmer {
                  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.65) 50%, transparent 65%);
                  background-size: 250% 100%;
                  animation: cpt-shimmer 0.65s ease 0.2s forwards;
                }

                @keyframes cpt-dot-pulse {
                  0%, 100% { transform: scale(1);   opacity: 1; }
                  50%       { transform: scale(1.7); opacity: 0.45; }
                }
                .cpt-dot-pulse {
                  animation: cpt-dot-pulse 2.2s ease-in-out infinite;
                }

                @keyframes cpt-btn-pop {
                  0%   { transform: scale(0.82) translateY(6px); opacity: 0; }
                  65%  { transform: scale(1.04) translateY(-1px); }
                  100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                .premium-action-cta {
                  animation: cpt-btn-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.28s both;
                }
            `}</style>
            <AnimatePresence>
                {flashcardSet && (
                    <FlashcardActivity 
                        cards={flashcardSet} 
                        onClose={() => setFlashcardSet(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
