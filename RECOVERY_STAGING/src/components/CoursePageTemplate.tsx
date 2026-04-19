"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { StarIcon } from "@/components/icons/StarIcon"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import {
    BookOpen, ChevronRight, ChevronLeft, Wallet, Coins, PiggyBank, Receipt, HandCoins,
    CreditCard, Landmark, TrendingUp, Presentation, BarChart4, Briefcase, Brain,
    LineChart, AlertTriangle, Lightbulb, Rocket, Search, ShieldCheck, FileText,
    Calculator, RefreshCw, BadgeDollarSign, Skull, Smile, Heart, ShieldAlert,
    Coffee, Target, CheckCircle2, Zap, Layout, Flag, Lock, Sparkles, Send,
    MessageCircle, Trophy, X, LucideIcon
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

// ─── Topic metadata ─────────────────────────────────────────────────────────

interface TopicMeta {
    id: number
    title: string
    icon: LucideIcon
    color: string
    lessons: number
}

const ALL_TOPICS: TopicMeta[] = [
    { id: 1, title: "Introducción a las finanzas y economía", icon: Wallet, color: "#3b82f6", lessons: 4 },
    { id: 2, title: "Finanzas personales", icon: Wallet, color: "#3b82f6", lessons: 5 },
    { id: 3, title: "Finanzas Bursátiles", icon: TrendingUp, color: "#3b82f6", lessons: 6 },
    { id: 4, title: "Finanzas para mi negocio", icon: Briefcase, color: "#3b82f6", lessons: 8 },
    { id: 5, title: "Ahorro con propósito", icon: PiggyBank, color: "#3b82f6", lessons: 5 },
    { id: 6, title: "Deuda: cuándo ayuda y cuándo destruye", icon: CreditCard, color: "#3b82f6", lessons: 7 },
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

// ─── Component ───────────────────────────────────────────────────────────────

interface CoursePageTemplateProps {
    topicId: string | number
    subtemas: GenericSubtema[]
    getLessonPath: (slug: string, courseId?: string) => string
    topicTitle?: string 
}

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
        id: Number(topicNum),
        title: topicTitle || "",
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
            router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
        }
    }, [loading, user, router])

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

    // Layout sync
    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        html.style.background = "#FBFAF5"
        body.style.background = "#FBFAF5"
        document.body.classList.add('hide-sidebar');
        
        return () => {
            html.style.background = ""
            body.style.background = ""
            document.body.classList.remove('hide-sidebar');
        }
    }, [])

    const allLessonsInTopic = subtemas.flatMap((s) => s.lessons)
    const completedInTopic = allLessonsInTopic.filter((l) => completedLessons.includes(l.slug)).length
    const totalInTopic = allLessonsInTopic.length
    const topicPct = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0

    const nextLessonSlug = React.useMemo(() => {
        for (const lesson of allLessonsInTopic) {
            if (!completedLessons.includes(lesson.slug)) return lesson.slug
        }
        return null
    }, [allLessonsInTopic, completedLessons])

    if (loading || !user) {
        return <PageLoader />
    }

    return (
        <div className="relative w-full bg-[#FBFAF5] min-h-screen course-topic-page-layout courses-page-active font-educational">
            {/* Decorative orbs */}
            <div 
                className="fixed top-[10%] right-[6%] w-[350px] h-[350px] rounded-full blur-[60px] pointer-events-none z-0" 
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }}
            />
            <div 
                className="fixed bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[70px] pointer-events-none z-0"
                style={{ background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)" }} 
            />

            <div className="relative z-10 w-full pt-0 pb-20 flex flex-col items-stretch courses-main-content">
                <div className="w-full flex flex-col items-stretch">

                    {/* ── HERO BANNER ─────────────────────────────────────────────── */}
                    <div className="relative overflow-hidden rounded-[44px] mt-3 mx-auto mb-10 shadow-[0_28px_80px_rgba(15,98,254,0.22)] w-[calc(100%-clamp(48px,10vw,160px))] px-[clamp(24px,6vw,120px)] py-[clamp(32px,6vw,64px)] bg-gradient-to-br from-[#0f2a6e] via-[#1e3a8a] to-[#2563eb] cpt-hero">
                        <div 
                            className="absolute -top-[30%] -right-[5%] w-[300px] h-[300px] rounded-full pointer-events-none" 
                            style={{ background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)" }} 
                        />
                        
                        <div className="relative z-10 flex flex-row flex-wrap gap-10 items-center">
                            <div className="flex-[1_1_500px] min-w-0">
                                <div className="flex items-center gap-2 mb-5">
                                    <button
                                        onClick={() => router.push("/courses?noredirect=true")}
                                        className="bg-white/10 border border-white/15 rounded-full px-3 py-1 cursor-pointer flex items-center gap-1.5 text-blue-300 text-xs font-medium hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronLeft size={12} /> Todos los Temas
                                    </button>
                                    <span className="text-white/30 text-xs">›</span>
                                    <div className="bg-white/10 rounded-full px-3.5 py-1 inline-flex items-center gap-1.5">
                                        <Zap size={12} className="text-blue-400" />
                                        <span className="text-xs font-medium text-blue-300 tracking-wider uppercase">
                                            {topicNum.toString().padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-[clamp(24px,4vw,44px)] font-bold text-white mb-3 leading-[1.1] tracking-tight">
                                    {topic.title}
                                </h1>
                                <p className="text-[clamp(14px,1.8vw,17px)] text-blue-300 mb-8 leading-relaxed max-w-[500px] opacity-90">
                                    Descubre los secretos del mundo financiero paso a paso. Completa lecciones para ganar XP y dominar tu economía.
                                </p>

                                <div className="w-full max-w-[600px]">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-blue-300/70 uppercase tracking-widest">Progreso Actual</span>
                                            <span className="text-sm font-semibold text-white">{completedInTopic} de {totalInTopic} lecciones</span>
                                        </div>
                                        <span className="text-4xl font-extrabold text-white">{topicPct}%</span>
                                    </div>
                                    <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${topicPct}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 flex-[0_1_auto] min-w-[280px]">
                                {[
                                    { label: "Módulos", value: subtemas.length.toString(), icon: BookOpen, color: "text-blue-400" },
                                    { label: "Lecciones", value: totalInTopic.toString(), icon: CheckCircle2, color: "text-blue-300" },
                                ].map((stat) => {
                                    const StatIcon = stat.icon
                                    return (
                                        <div key={stat.label} className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                                    <StatIcon size={18} className={stat.color} />
                                                </div>
                                                <div className="text-[11px] font-bold text-blue-300/60 uppercase tracking-widest">{stat.label}</div>
                                            </div>
                                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── BILLY INSIGHT SECTION ───────────────────────────────────── */}
                    <AnimatePresence>
                        {(insight || loadingInsight) && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full px-[clamp(24px,5vw,80px)] mb-12"
                            >
                                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] px-8 py-6 border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-14 h-14 relative shrink-0">
                                        <Image src="/billy_chatbot.png" alt="Billy" width={56} height={56} className="object-contain" />
                                        {loadingInsight && (
                                            <motion.div 
                                                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="absolute inset-0 rounded-full bg-blue-500"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 w-full text-center sm:text-left">
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Dato Curioso</div>
                                        {loadingInsight && !insight ? (
                                            <div className="flex flex-col gap-2 mt-2 w-full items-center sm:items-start">
                                                <div className="skeleton-pulse h-3.5 w-full sm:w-[90%] bg-black/5 rounded" />
                                                <div className="skeleton-pulse h-3.5 w-[60%] bg-black/5 rounded" />
                                            </div>
                                        ) : (
                                            <div className="text-base text-slate-800 leading-relaxed font-medium">
                                                &quot;{insight?.replace(/\*/g, '')}&quot;
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── LESSONS GRID ────────────────────────────────────────────── */}
                    <div className="w-full px-[clamp(24px,5vw,80px)] pb-[100px]">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-8 justify-center">
                            {allLessonsInTopic.map((lesson, idx) => {
                                const isDone = completedLessons.includes(lesson.slug)
                                const stars = isDone ? (lessonStars[lesson.slug] ?? 0) : 0
                                const lessonNum = idx + 1
                                const isPremium = lessonNum > 3
                                const isPaywalled = isPremium && !hasPremiumAccess
                                
                                const previousLesson = idx > 0 ? allLessonsInTopic[idx - 1] : null
                                const isSequenceLocked = idx > 0 && previousLesson && !completedLessons.includes(previousLesson.slug)
                                
                                const isExam = lesson.slug.includes('examen') || lesson.slug.includes('evaluacion') || lesson.title.toLowerCase().includes('examen')
                                const isLocked = isPaywalled || isSequenceLocked

                                return (
                                    <motion.div
                                        key={lesson.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        onClick={() => {
                                            if (isLocked) {
                                                if (isPaywalled) router.push('/payment')
                                                else setSequenceWarning(lesson.slug)
                                            } else {
                                                setLessonModal({ lesson, unitTitle: topic.title })
                                            }
                                        }}
                                        className={`relative aspect-square flex flex-col items-center justify-center text-center rounded-full p-8 cursor-pointer transition-all duration-300 cpt-lesson-card ${lesson.slug === nextLessonSlug ? 'next-lesson-pulse' : ''} ${isLocked ? "opacity-60 border-[2.5px] border-dashed border-slate-200 shadow-none bg-white" : isExam ? "opacity-100 border-[3px] border-blue-500 shadow-[0_10px_25px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-800 text-white" : isDone ? "opacity-100 border-[3.5px] border-blue-600 shadow-[0_12px_30px_rgba(37,99,235,0.12)] bg-white" : "opacity-100 border-[2.5px] border-white shadow-[0_10px_25px_rgba(0,0,0,0.03)] bg-white"}`}
                                    >
                                        {isLocked && (
                                            <div className="absolute top-[15%] right-[15%] w-8 h-8 rounded-full bg-slate-50 border-[1.5px] border-slate-200 flex items-center justify-center z-10">
                                                <Lock size={14} className="text-slate-400" />
                                            </div>
                                        )}
                                        {isDone && !isLocked && (
                                            <div className="absolute top-[15%] right-[15%] w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center z-10">
                                                <CheckCircle2 size={16} className="text-white" />
                                            </div>
                                        )}

                                        <div className={`w-[52px] h-[52px] rounded-2xl mb-4 text-[22px] font-extrabold flex items-center justify-center ${isExam ? "bg-blue-500/15 text-blue-400" : (isLocked ? "bg-slate-100 text-slate-400" : (isDone ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"))}`}>
                                            {isExam ? <Trophy size={26} /> : lessonNum}
                                        </div>

                                        <div className={`text-[15px] font-bold leading-[1.2] mb-3 px-2 ${isExam ? "text-white" : "text-slate-900"}`}>
                                            {lesson.title}
                                        </div>

                                        <div className="flex gap-[3px]">
                                            {isLocked ? (
                                                <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-lg">
                                                    {isPaywalled ? 'Premium' : 'Bloqueado'}
                                                </div>
                                            ) : (
                                                [1, 2, 3].map(i => <StarIcon key={i} size={16} filled={i <= stars} />)
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {sequenceWarning && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md modal-overlay p-4" onClick={() => setSequenceWarning(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} className="bg-white rounded-[32px] p-12 max-w-[400px] w-full text-center shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                                <Lock size={32} className="text-blue-900" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">¡Paso a paso!</h2>
                            <p className="text-base text-slate-500 leading-relaxed mb-8">Completa las lecciones anteriores para desbloquear este contenido.</p>
                            <button onClick={() => setSequenceWarning(null)} className="w-full p-4 bg-blue-900 hover:bg-blue-950 transition-colors text-white rounded-2xl font-bold text-base cursor-pointer">
                                Entendido
                            </button>
                        </motion.div>
                    </div>
                )}

                {lessonModal && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl modal-overlay p-4" onClick={() => setLessonModal(null)}>
                        <motion.div 
                            initial={{ y: 60, opacity: 0, scale: 0.92 }} 
                            animate={{ y: 0, opacity: 1, scale: 1 }} 
                            exit={{ y: 40, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            onClick={e => e.stopPropagation()} 
                            className="relative max-w-[480px] w-full"
                        >
                            {/* Main card */}
                            <div className="relative bg-gradient-to-br from-[#0a1628] via-[#0d1f5c] to-[#1a3fa8] rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                                {/* Glow orbs inside card */}
                                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
                                <div className="absolute inset-0 opacity-[0.03]"
                                    style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
                                />

                                {/* Close button */}
                                <button 
                                    onClick={() => setLessonModal(null)} 
                                    className="absolute top-6 right-6 z-10 w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors rounded-full flex items-center justify-center cursor-pointer border border-white/10"
                                >
                                    <X size={16} className="text-white/70" />
                                </button>

                                {/* Content */}
                                <div className="relative z-10 p-10 pb-8 flex flex-col gap-6">
                                    <div>
                                        {/* Topic pill */}
                                        <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/20 rounded-full px-3 py-1 mb-5">
                                            <Zap size={11} className="text-blue-400" />
                                            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest">{lessonModal.unitTitle}</span>
                                        </div>

                                        {/* Lesson title */}
                                        <h2 className="text-[28px] font-extrabold text-white leading-tight mb-2 pr-8">
                                            {lessonModal.lesson.title}
                                        </h2>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* XP reward */}
                                        <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/20 flex items-center justify-center shrink-0">
                                                <Sparkles size={18} className="text-yellow-400" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Recompensa</div>
                                                <div className="text-sm font-extrabold text-white">
                                                    {completedLessons.includes(lessonModal.lesson.slug) ? "+5 XP" : "hasta +15 XP"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Status */}
                                        <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${completedLessons.includes(lessonModal.lesson.slug) ? "bg-emerald-400/15 border-emerald-400/20" : "bg-blue-400/15 border-blue-400/20"}`}>
                                                {completedLessons.includes(lessonModal.lesson.slug) 
                                                    ? <CheckCircle2 size={18} className="text-emerald-400" />
                                                    : <Rocket size={18} className="text-blue-400" />
                                                }
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Estado</div>
                                                <div className="text-sm font-extrabold text-white">
                                                    {completedLessons.includes(lessonModal.lesson.slug) ? "Completada" : "Sin comenzar"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Motivational message */}
                                    <div className="bg-white/5 border border-white/8 rounded-2xl p-5 flex items-start gap-4">
                                        <MessageCircle size={18} className="text-blue-300 mt-0.5 shrink-0" />
                                        <p className="text-[14px] text-white/70 leading-relaxed font-medium">
                                            {completedLessons.includes(lessonModal.lesson.slug)
                                                ? "¡Ya dominas este tema! Un repaso rápido nunca está de más para mantener tus conocimientos frescos."
                                                : "Prepárate para aprender conceptos clave y ganar puntos. Cada paso cuenta en tu camino al éxito financiero."}
                                        </p>
                                    </div>

                                    {/* CTA Button */}
                                    <button 
                                        onClick={() => {
                                            router.push(getLessonPath(lessonModal.lesson.slug, lessonModal.lesson.courseId))
                                            setLessonModal(null)
                                        }}
                                        className="w-full h-16 rounded-2xl font-bold text-lg cursor-pointer transition-all duration-200 relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
                                        style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)" }}
                                    >
                                        <motion.div
                                            className="absolute inset-0"
                                            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)" }}
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                        <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                                            {completedLessons.includes(lessonModal.lesson.slug) 
                                                ? <><RefreshCw size={20} /> Repasar lección</>
                                                : <><Zap size={20} /> ¡Comenzar ahora!</>
                                            }
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {flashcardSet && (
                    <FlashcardActivity cards={flashcardSet} onClose={() => setFlashcardSet(null)} />
                )}
            </AnimatePresence>

            <style>{`
                .hide-sidebar [data-fixed-sidebar] { display: none !important; }
                .next-lesson-pulse { animation: next-lesson-pulse-anim 3s infinite ease-in-out !important; }
                @keyframes next-lesson-pulse-anim {
                    0%, 100% { border-color: rgba(37,99,235,0.2); box-shadow: 0 10px 25px rgba(0,0,0,0.03); transform: scale(1); }
                    50% { border-color: rgba(37,99,235,0.6); box-shadow: 0 15px 40px rgba(37,99,235,0.2); transform: scale(1.03); }
                }
                .skeleton-pulse { animation: skeleton-pulse-fade 1.5s infinite ease-in-out; }
                @keyframes skeleton-pulse-fade { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
            `}</style>
        </div>
    )
}
