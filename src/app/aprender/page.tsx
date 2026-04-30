"use client"

import React, { useEffect, useState } from 'react'
import TopNav from '@/components/TopNav'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  BookOpen, Trophy, Lock, CheckCircle2, ChevronRight,
  Star, Map, Sparkles, TrendingUp, Award
} from 'lucide-react'

interface TopicSummary {
  id: string
  title: string
  description: string | null
  level: string
  icon: string | null
  progressPercent: number
  completedCount: number
  totalLessons: number
  isCompleted: boolean
  lessons: { status: string }[]
}

// All Tailwind classes must be complete strings (no dynamic concatenation)
const TOPIC_PALETTES = [
  {
    stripe:    'bg-gradient-to-b from-blue-500 to-indigo-500',
    badge:     'bg-blue-50 text-blue-700 border border-blue-200',
    bar:       'bg-gradient-to-r from-blue-500 to-indigo-500',
    iconBg:    'bg-blue-50 border border-blue-100',
    iconColor: 'text-blue-600',
    ringBg:    'bg-blue-50 border border-blue-100',
    chevron:   'text-blue-500',
    cardHover: 'hover:border-blue-200 hover:shadow-blue-100/80',
  },
  {
    stripe:    'bg-gradient-to-b from-emerald-500 to-cyan-400',
    badge:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
    bar:       'bg-gradient-to-r from-emerald-500 to-cyan-400',
    iconBg:    'bg-emerald-50 border border-emerald-100',
    iconColor: 'text-emerald-600',
    ringBg:    'bg-emerald-50 border border-emerald-100',
    chevron:   'text-emerald-500',
    cardHover: 'hover:border-emerald-200 hover:shadow-emerald-100/80',
  },
  {
    stripe:    'bg-gradient-to-b from-amber-400 to-rose-500',
    badge:     'bg-amber-50 text-amber-700 border border-amber-200',
    bar:       'bg-gradient-to-r from-amber-400 to-rose-500',
    iconBg:    'bg-amber-50 border border-amber-100',
    iconColor: 'text-amber-600',
    ringBg:    'bg-amber-50 border border-amber-100',
    chevron:   'text-amber-500',
    cardHover: 'hover:border-amber-200 hover:shadow-amber-100/80',
  },
  {
    stripe:    'bg-gradient-to-b from-violet-500 to-pink-500',
    badge:     'bg-violet-50 text-violet-700 border border-violet-200',
    bar:       'bg-gradient-to-r from-violet-500 to-pink-500',
    iconBg:    'bg-violet-50 border border-violet-100',
    iconColor: 'text-violet-600',
    ringBg:    'bg-violet-50 border border-violet-100',
    chevron:   'text-violet-500',
    cardHover: 'hover:border-violet-200 hover:shadow-violet-100/80',
  },
  {
    stripe:    'bg-gradient-to-b from-cyan-500 to-blue-400',
    badge:     'bg-cyan-50 text-cyan-700 border border-cyan-200',
    bar:       'bg-gradient-to-r from-cyan-500 to-blue-400',
    iconBg:    'bg-cyan-50 border border-cyan-100',
    iconColor: 'text-cyan-600',
    ringBg:    'bg-cyan-50 border border-cyan-100',
    chevron:   'text-cyan-500',
    cardHover: 'hover:border-cyan-200 hover:shadow-cyan-100/80',
  },
] as const

export default function AprenderPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<TopicSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/aprender')
        if (!res.ok) throw new Error('No se pudo cargar el mapa de aprendizaje')
        const data = await res.json()
        setTopics(data.topics || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTopics()
  }, [])

  const totalCompleted = topics.reduce((sum, t) => sum + t.completedCount, 0)
  const totalLessons   = topics.reduce((sum, t) => sum + t.totalLessons, 0)
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
  const completedTopics = topics.filter(t => t.isCompleted).length

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-28">

      <TopNav />

      {/* Subtle top gradient wash */}
      <div className="fixed top-0 left-0 right-0 h-72 bg-gradient-to-b from-slate-50 to-white pointer-events-none z-0" />

      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 pt-24 pb-8">

        {/* ── HERO HEADER ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="mb-8"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Map size={12} className="text-blue-600" />
            </div>
            <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.12em]">
              Mapa de Aprendizaje
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-1">
            Tu Camino{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BIZEN
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Domina las finanzas, un tema a la vez.
          </p>

          {/* ── PROGRESS SUMMARY CARD ─────────────── */}
          {!loading && totalLessons > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <TrendingUp size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Progreso General
                    </p>
                    <p className="text-sm font-black text-slate-800">
                      {totalCompleted} de {totalLessons} lecciones
                    </p>
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900 leading-none shrink-0">
                  {overallPercent}<span className="text-lg text-slate-400">%</span>
                </p>
              </div>

              {/* Bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Award size={11} className="text-amber-500" />
                  {completedTopics} tema{completedTopics !== 1 ? 's' : ''} completado{completedTopics !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <BookOpen size={11} className="text-blue-400" />
                  {topics.length - completedTopics} en progreso
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── LOADING SKELETON ─────────────────────── */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* ── ERROR STATE ──────────────────────────── */}
        {error && !loading && (
          <div className="text-center py-16 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-red-600 font-bold mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold transition-colors text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* ── TOPIC CARDS ──────────────────────────── */}
        {!loading && !error && (
          <div className="space-y-3">
            {topics.map((topic, idx) => {
              const p = TOPIC_PALETTES[idx % TOPIC_PALETTES.length]
              const isLocked    = topic.totalLessons > 0 && topic.lessons.every(l => l.status === 'LOCKED')
              const isCompleted = topic.isCompleted

              const currentLessonIndex = (() => {
                const i = topic.lessons.findIndex(l => l.status === 'CURRENT')
                return i >= 0 ? i + 1 : null
              })()

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07, type: 'spring', stiffness: 240, damping: 22 }}
                  onClick={() => !isLocked && router.push(`/aprender/${topic.id}`)}
                  className={[
                    'relative overflow-hidden rounded-2xl border bg-white transition-all duration-200',
                    isLocked
                      ? 'border-slate-200 opacity-50 cursor-not-allowed'
                      : isCompleted
                        ? `border-emerald-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${p.cardHover}`
                        : `border-slate-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${p.cardHover}`,
                  ].join(' ')}
                >
                  {/* Colored left stripe */}
                  {!isLocked && (
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${p.stripe}`} />
                  )}

                  {/* Completed tint */}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-emerald-50/30 pointer-events-none" />
                  )}

                  <div className="pl-5 pr-4 py-4 relative z-10">
                    <div className="flex items-center justify-between gap-3">

                      {/* Left: icon + text */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">

                        {/* Icon bubble */}
                        <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm ${isLocked ? 'bg-slate-50 border border-slate-200' : p.iconBg}`}>
                          {isLocked
                            ? <Lock size={18} className="text-slate-400" />
                            : <span>{topic.icon || '📚'}</span>
                          }
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${p.badge}`}>
                              Tema {idx + 1}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 size={9} />
                                Completado
                              </span>
                            )}
                          </div>
                          <h2 className="text-[15px] font-black text-slate-900 leading-tight truncate">
                            {topic.title}
                          </h2>
                          {topic.description && (
                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 font-medium">
                              {topic.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right action indicator */}
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isLocked ? 'bg-slate-100' : p.ringBg}`}>
                        {isLocked
                          ? <Lock size={13} className="text-slate-400" />
                          : isCompleted
                            ? <Trophy size={13} className="text-amber-500" />
                            : <ChevronRight size={15} className={p.chevron} />
                        }
                      </div>
                    </div>

                    {/* Progress bar row */}
                    {!isLocked && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                          <motion.div
                            className={`h-full rounded-full ${p.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${topic.progressPercent}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.07 + 0.3 }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                              <BookOpen size={10} />
                              {topic.completedCount}/{topic.totalLessons}
                            </span>
                            {currentLessonIndex && !isCompleted && (
                              <span className={`flex items-center gap-1 text-[11px] font-bold ${p.chevron}`}>
                                <Star size={10} fill="currentColor" />
                                En lección {currentLessonIndex}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-black text-slate-500">
                            {topic.progressPercent}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Locked hint */}
                    {isLocked && (
                      <p className="mt-2 text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                        <Lock size={10} />
                        Completa el tema anterior para desbloquear
                      </p>
                    )}
                  </div>

                  {/* Completed sparkle */}
                  {isCompleted && (
                    <motion.div
                      className="absolute top-3 right-10 text-amber-400 opacity-25"
                      animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    >
                      <Sparkles size={16} />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}

            {/* Empty state */}
            {topics.length === 0 && (
              <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
                <p className="text-5xl mb-4">🗺️</p>
                <p className="text-slate-800 font-black text-xl mb-1">El mapa está vacío</p>
                <p className="text-slate-400 text-sm font-medium">No hay temas activos por el momento.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
