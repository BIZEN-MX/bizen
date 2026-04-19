"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { CheckCircle, MessageCircle, Eye } from "lucide-react"
import PageLoader from "@/components/PageLoader"

interface ForumThread {
  id: string
  title: string
  body: string
  status: string
  score: number
  commentCount: number
  viewCount?: number
  isPinned: boolean
  createdAt: string
  author: {
    nickname: string
    reputation: number
  }
  tags: Array<{
    name: string
    slug: string
  }>
  hasAcceptedAnswer: boolean
}

interface TopicInfo {
  id: string
  name: string
  slug: string
  icon: string
  description: string | null
}

// ── Topic colour palette ──────────────────────────────────────────────────────
// Each key maps a topic slug to a visual identity:
//   gradient  – used for the hero header card
//   accent    – solid accent colour for the left border, score, badges, etc.
//   light     – soft tint for hover / tag backgrounds
//   shadow    – box-shadow glow colour (with alpha)
const TOPIC_COLORS: Record<string, { gradient: string; accent: string; light: string; shadow: string }> = {
  "ahorro": { gradient: "linear-gradient(135deg, #10b981, #059669)", accent: "#10b981", light: "#ecfdf5", shadow: "rgba(16,185,129,0.18)" },
  "presupuesto": { gradient: "linear-gradient(135deg, #3b82f6, #2563eb)", accent: "#2563eb", light: "#eff6ff", shadow: "rgba(59,130,246,0.18)" },
  "deuda": { gradient: "linear-gradient(135deg, #ef4444, #dc2626)", accent: "#ef4444", light: "#fef2f2", shadow: "rgba(239,68,68,0.18)" },
  "inversion": { gradient: "linear-gradient(135deg, #f59e0b, #d97706)", accent: "#d97706", light: "#fffbeb", shadow: "rgba(245,158,11,0.18)" },
  "inversion-basica": { gradient: "linear-gradient(135deg, #f59e0b, #d97706)", accent: "#d97706", light: "#fffbeb", shadow: "rgba(245,158,11,0.18)" },
  "inversion-basica-2": { gradient: "linear-gradient(135deg, #f59e0b, #d97706)", accent: "#d97706", light: "#fffbeb", shadow: "rgba(245,158,11,0.18)" },
  "emprendimiento": { gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)", accent: "#7c3aed", light: "#f5f3ff", shadow: "rgba(139,92,246,0.18)" },
  "proyectos": { gradient: "linear-gradient(135deg, #7c3aed, #4f46e5)", accent: "#4f46e5", light: "#eef2ff", shadow: "rgba(124,58,237,0.18)" },
  "negocios": { gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)", accent: "#0284c7", light: "#f0f9ff", shadow: "rgba(14,165,233,0.18)" },
  "finanzas": { gradient: "linear-gradient(135deg, #0f172a, #1e3a8a)", accent: "#1e3a8a", light: "#eff6ff", shadow: "rgba(30,58,138,0.18)" },
  "mision-del-dia": { gradient: "linear-gradient(135deg, #0f172a, #1e1b4b)", accent: "#fbbf24", light: "#fffbeb", shadow: "rgba(251,191,36,0.18)" },
  "preguntas": { gradient: "linear-gradient(135deg, #0f172a, #1e3a8a)", accent: "#1e3a8a", light: "#eff6ff", shadow: "rgba(30,58,138,0.18)" },
}

// Default fallback theme (Bizen blue)
const DEFAULT_COLORS = { gradient: "linear-gradient(135deg, #0f172a, #1e3a8a)", accent: "#1e3a8a", light: "#eff6ff", shadow: "rgba(30,58,138,0.18)" }

function getTopicColors(slug: string) {
  // Try exact match first, then prefix match
  if (TOPIC_COLORS[slug]) return TOPIC_COLORS[slug]
  const key = Object.keys(TOPIC_COLORS).find(k => slug.startsWith(k) || k.startsWith(slug))
  return key ? TOPIC_COLORS[key] : DEFAULT_COLORS
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return "ahora"
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

export default function TopicFeedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const topicSlug = params?.slug as string

  const [topic, setTopic] = useState<TopicInfo | null>(null)
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#f8fafc"
      bodyEl.style.backgroundAttachment = "fixed"
    }
    return () => {
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }
    if (topicSlug) {
      fetchData()
    }
  }, [user, loading, router, topicSlug])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/forum/threads?topic=${topicSlug}`)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setTopic(data[0].topic)
          setThreads(data)
        }
      }
    } catch (error) {
      console.error("Error fetching topic threads:", error)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || loadingData) {
    return <PageLoader />
  }

  if (!user || !topic) return null

  const colors = getTopicColors(topicSlug)

  return (
    <div className="relative min-h-screen pt-0 pb-20 bg-slate-50 w-full overflow-hidden forum-topic-outer flex justify-center">
      <main className="relative max-w-[900px] m-0 p-[clamp(20px,4vw,40px)] w-full z-10 box-border">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-[13px] font-medium">
          <Link href="/forum" className="no-underline opacity-80 hover:opacity-100 transition-opacity" style={{ color: colors.accent }}>
            Foro
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-slate-700">{topic.name}</span>
        </div>

        {/* ── Hero Header Card ── */}
        <div 
          className="rounded-[clamp(16px,3vw,32px)] p-[clamp(24px,5vw,40px)] mb-7 flex justify-between items-center flex-wrap gap-4"
          style={{ background: colors.gradient, boxShadow: `0 20px 50px ${colors.shadow}` }}
        >
          <div>
            <h1 className="m-0 mb-1.5 text-[clamp(22px,4vw,30px)] font-medium text-white tracking-[-0.02em]">
              {topic.name}
            </h1>
            {topic.description && (
              <p className="m-0 text-white/80 text-[14px] font-medium leading-[1.6]">
                {topic.description}
              </p>
            )}
            <div className="mt-3 flex gap-4 text-[13px] text-white/70 font-medium">
              <span>{threads.length} {threads.length === 1 ? "tema" : "temas"}</span>
              <span>{threads.reduce((s, t) => s + t.commentCount, 0)} respuestas</span>
            </div>
          </div>
          <Link
            href={`/forum/new?topic=${topicSlug}`}
            className="px-6 py-3 bg-white/20 text-white rounded-xl font-medium no-underline text-[14px] border-[1.5px] border-white/30 whitespace-nowrap backdrop-blur-md transition-all hover:bg-white/30"
          >
            + Nuevo Tema
          </Link>
        </div>

        {/* ── Thread List ── */}
        <div className="flex flex-col gap-2.5">
          {threads.map((thread, i) => (
            <Link
              key={thread.id}
              href={`/forum/thread/${thread.id}`}
              className="group block pr-5 pt-[18px] pb-[18px] bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] no-underline overflow-hidden animate-[fadeIn_0.5s_ease_both] transition-all hover:translate-x-1"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: thread.isPinned ? "#f59e0b" : colors.accent,
                animationDelay: `${i * 50}ms`
              }}
            >
              <div className="flex gap-4 pl-5">
                {/* Vote column */}
                <div className="flex flex-col items-center min-w-[44px] pt-0.5">
                  <div className="text-[20px] font-medium leading-none" style={{ color: thread.score > 0 ? colors.accent : thread.score < 0 ? "#ef4444" : "#94a3b8" }}>
                    {thread.score}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">votos</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Pinned badge + title */}
                  <div className="flex items-start gap-2 mb-1.5">
                    {thread.isPinned && (
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-medium rounded-md whitespace-nowrap mt-0.5">
                        Fijado
                      </span>
                    )}
                    <h3 className="m-0 flex-1 text-[clamp(14px,2vw,16px)] font-medium text-slate-900 leading-[1.4] line-clamp-2">
                      {thread.title}
                    </h3>
                    {/* Status badge */}
                    <span 
                      className="px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap hidden sm:inline-block"
                      style={{
                        background: thread.hasAcceptedAnswer || thread.status === "resolved"
                          ? "#ecfdf5" : thread.status === "locked" ? "#fef2f2" : colors.light,
                        color: thread.hasAcceptedAnswer || thread.status === "resolved"
                          ? "#065f46" : thread.status === "locked" ? "#dc2626" : colors.accent,
                      }}
                    >
                      {thread.hasAcceptedAnswer || thread.status === "resolved"
                        ? "Resuelto" : thread.status === "locked" ? "Cerrado" : "Abierto"}
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p className="m-0 mb-2 text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                    {thread.body.substring(0, 160)}
                  </p>

                  {/* Tags */}
                  {thread.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-2">
                      {thread.tags.map(tag => (
                        <span key={tag.slug} className="px-2 py-0.5 text-[11px] font-medium rounded-md" style={{ background: colors.light, color: colors.accent }}>
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta row */}
                  <div className="flex gap-3.5 text-[12px] text-slate-400 font-medium items-center flex-wrap">
                    <span>por <span className="font-medium" style={{ color: colors.accent }}>{thread.author.nickname}</span></span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {thread.commentCount}
                    </span>
                    {thread.hasAcceptedAnswer && (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle size={12} />
                        Respondido
                      </span>
                    )}
                    <span className="ml-auto">{formatDate(thread.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {threads.length === 0 && (
          <div 
            className="py-[60px] px-6 text-center bg-white rounded-[20px] border"
            style={{ 
              borderColor: `${colors.accent}22`,
              boxShadow: `0 4px 24px ${colors.shadow}` 
            }}
          >
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: colors.gradient }}
            >
              <MessageCircle size={28} color="white" />
            </div>
            <h3 className="m-0 mb-2 text-xl font-medium text-slate-900">
              Sin temas todavía
            </h3>
            <p className="m-0 mb-6 text-slate-500 text-sm leading-[1.6]">
              ¡Sé el primero en abrir un tema en esta categoría!
            </p>
            <Link
              href={`/forum/new?topic=${topicSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium no-underline text-sm shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
              style={{ background: colors.gradient, boxShadow: `0 4px 14px ${colors.shadow}` }}
            >
              + Nuevo Tema
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
