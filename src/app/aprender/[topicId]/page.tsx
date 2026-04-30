"use client"

import React, { useEffect, useState } from 'react'
import TopNav from '@/components/TopNav'
import LearningPathTree, { PathNode } from '@/components/lessons/LearningPathTree'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Trophy, Zap, Map, CheckCircle2, Lock } from 'lucide-react'

interface LessonNode {
  id: string
  title: string
  status: 'COMPLETED' | 'CURRENT' | 'LOCKED'
  type: 'LESSON' | 'BOSS' | 'CHEST'
  xpReward: number
  order: number
}

interface TopicData {
  id: string
  title: string
  description: string | null
  level: string
  icon: string | null
  progressPercent: number
  completedCount: number
  totalLessons: number
  isCompleted: boolean
  lessons: LessonNode[]
}

export default function AprenderTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string

  const [topic, setTopic] = useState<TopicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTopicData() {
      try {
        const res = await fetch('/api/aprender')
        if (!res.ok) throw new Error('Error al cargar el camino de aprendizaje')
        const data = await res.json()
        const found = data.topics?.find((t: TopicData) => t.id === topicId)
        if (!found) throw new Error('Tema no encontrado')
        setTopic(found)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTopicData()
  }, [topicId])

  // ── LOADING ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <p className="text-slate-400 text-sm font-semibold">Cargando tu camino...</p>
        </div>
      </div>
    )
  }

  // ── ERROR ─────────────────────────────────────────────────
  if (error || !topic) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center bg-red-50 border border-red-100 rounded-3xl p-10">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-red-600 font-bold mb-4">{error || 'Algo salió mal'}</p>
          <button
            onClick={() => router.push('/aprender')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-sm"
          >
            Volver al mapa
          </button>
        </div>
      </div>
    )
  }

  const nodes: PathNode[] = topic.lessons.map(l => ({
    id: l.id,
    title: l.title,
    status: l.status,
    type: l.type,
    xpReward: l.xpReward,
    order: l.order,
  }))

  const totalXP = topic.lessons.reduce((sum, l) => sum + (l.xpReward || 0), 0)

  return (
    <div className="min-h-screen bg-white font-sans pb-28">
      <TopNav />

      {/* Subtle top gradient */}
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-50 to-white pointer-events-none z-0" />

      <main className="relative z-10 w-full max-w-xl mx-auto px-4 pt-24 pb-8">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/aprender')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors mb-6 text-sm font-semibold group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Todos los Temas
        </motion.button>

        {/* ── TOPIC HEADER CARD ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-20 z-40 mb-8"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Map size={10} className="text-blue-600" />
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.12em]">
                    Tema {topic.level || ''}
                  </span>
                </div>
                <h1 className="text-base font-black text-slate-900 leading-tight truncate">
                  {topic.icon} {topic.title}
                </h1>
                {topic.description && (
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                    {topic.description}
                  </p>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-black text-slate-900 leading-none">
                  {topic.progressPercent}<span className="text-sm text-slate-400">%</span>
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {topic.completedCount}/{topic.totalLessons}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${topic.progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              />
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-2.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <BookOpen size={10} className="text-blue-400" />
                {topic.completedCount} completadas
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <Zap size={10} className="text-amber-400" />
                {totalXP} XP total
              </span>
              {topic.isCompleted && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 ml-auto">
                  <CheckCircle2 size={10} />
                  ¡Completado!
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── PATH TREE ────────────────────────────────── */}
        {nodes.length > 0 ? (
          <LearningPathTree nodes={nodes} topicId={topicId} />
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-medium text-sm">
              Este tema no tiene lecciones todavía.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
