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
  "reto-del-dia": { gradient: "linear-gradient(135deg, #0f172a, #1e1b4b)", accent: "#fbbf24", light: "#fffbeb", shadow: "rgba(251,191,36,0.18)" },
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
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      background: "#FBFAF5",
    }} className="forum-topic-outer">
      <style>{`
        @media (max-width: 767px) {
          .forum-topic-outer { margin-left: 0 !important; max-width: 100% !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .forum-topic-outer { margin-left: 220px !important; max-width: calc(100% - 220px) !important; width: auto !important; }
        }
        @media (min-width: 1161px) {
          .forum-topic-outer { margin-left: 280px !important; max-width: calc(100% - 280px) !important; width: auto !important; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .thread-card {
          transition: all 0.22s ease;
        }
        .thread-card:hover {
          transform: translateX(4px);
        }
      `}</style>
      <main style={{
        position: "relative",
        maxWidth: 900,
        margin: "0 auto",
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
          <Link href="/forum" style={{ color: colors.accent, textDecoration: "none", opacity: 0.8 }}>
            Foro
          </Link>
          <span style={{ color: "#94a3b8" }}>›</span>
          <span style={{ color: "#374151" }}>{topic.name}</span>
        </div>

        {/* ── Hero Header Card ── */}
        <div style={{
          background: colors.gradient,
          borderRadius: "clamp(0px, 3vw, 32px)",
          padding: "clamp(24px, 5vw, 40px)",
          marginBottom: 28,
          boxShadow: `0 20px 50px ${colors.shadow}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 500, color: "white", letterSpacing: "-0.02em" }}>
              {topic.name}
            </h1>
            {topic.description && (
              <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>
                {topic.description}
              </p>
            )}
            <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              <span>{threads.length} {threads.length === 1 ? "tema" : "temas"}</span>
              <span>{threads.reduce((s, t) => s + t.commentCount, 0)} respuestas</span>
            </div>
          </div>
          <Link
            href={`/forum/new?topic=${topicSlug}`}
            style={{
              padding: "13px 24px",
              background: "rgba(255,255,255,0.18)",
              color: "white",
              borderRadius: 12,
              fontWeight: 500,
              textDecoration: "none",
              fontSize: 14,
              border: "1.5px solid rgba(255,255,255,0.35)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.28)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.18)" }}
          >
            + Nuevo Tema
          </Link>
        </div>

        {/* ── Thread List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {threads.map((thread, i) => (
            <Link
              key={thread.id}
              href={`/forum/thread/${thread.id}`}
              className="thread-card"
              style={{
                display: "block",
                padding: "18px 20px 18px 0",
                background: "white",
                borderRadius: 14,
                border: "1.5px solid rgba(15, 23, 42, 0.12)",
                boxShadow: `0 2px 8px rgba(0,0,0,0.04)`,
                textDecoration: "none",
                overflow: "hidden",
                animation: `fadeInUp 0.4s ease ${i * 0.04}s both`,
                // Left accent stripe using border-left matching the topic colour
                borderLeft: `4px solid ${thread.isPinned ? "#f59e0b" : colors.accent}`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.boxShadow = `0 6px 20px ${colors.shadow}`
                el.style.borderColor = colors.accent
                el.style.borderLeftColor = thread.isPinned ? "#f59e0b" : colors.accent
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"
                el.style.borderColor = "rgba(15, 23, 42, 0.12)"
                el.style.borderLeftColor = thread.isPinned ? "#f59e0b" : colors.accent
              }}
            >
              <div style={{ display: "flex", gap: 16, paddingLeft: 20 }}>
                {/* Vote column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44, paddingTop: 2 }}>
                  <div style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: thread.score > 0 ? colors.accent : thread.score < 0 ? "#ef4444" : "#94a3b8",
                    lineHeight: 1,
                  }}>
                    {thread.score}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>votos</div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Pinned badge + title */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                    {thread.isPinned && (
                      <span style={{ padding: "2px 7px", background: "#fffbeb", color: "#d97706", fontSize: 10, fontWeight: 500, borderRadius: 6, whiteSpace: "nowrap", marginTop: 2 }}>
                        Fijado
                      </span>
                    )}
                    <h3 style={{
                      margin: 0, flex: 1,
                      fontSize: "clamp(14px, 2vw, 16px)",
                      fontWeight: 500,
                      color: "#0f172a",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {thread.title}
                    </h3>
                    {/* Status badge */}
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      background: thread.hasAcceptedAnswer || thread.status === "resolved"
                        ? "#ecfdf5" : thread.status === "locked" ? "#fef2f2" : colors.light,
                      color: thread.hasAcceptedAnswer || thread.status === "resolved"
                        ? "#065f46" : thread.status === "locked" ? "#dc2626" : colors.accent,
                    }}>
                      {thread.hasAcceptedAnswer || thread.status === "resolved"
                        ? "Resuelto" : thread.status === "locked" ? "Cerrado" : "Abierto"}
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p style={{
                    margin: "0 0 8px",
                    fontSize: 13,
                    color: "#64748b",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {thread.body.substring(0, 160)}
                  </p>

                  {/* Tags */}
                  {thread.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                      {thread.tags.map(tag => (
                        <span key={tag.slug} style={{
                          padding: "2px 8px",
                          background: colors.light,
                          color: colors.accent,
                          fontSize: 11,
                          fontWeight: 500,
                          borderRadius: 6,
                        }}>
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta row */}
                  <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#94a3b8", fontWeight: 500, alignItems: "center", flexWrap: "wrap" }}>
                    <span>por <span style={{ color: colors.accent, fontWeight: 500 }}>{thread.author.nickname}</span></span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <MessageCircle size={12} />
                      {thread.commentCount}
                    </span>
                    {thread.hasAcceptedAnswer && (
                      <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#10b981" }}>
                        <CheckCircle size={12} />
                        Respondido
                      </span>
                    )}
                    <span style={{ marginLeft: "auto" }}>{formatDate(thread.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {threads.length === 0 && (
          <div style={{
            padding: "60px 24px",
            textAlign: "center",
            background: "white",
            borderRadius: 20,
            border: `1.5px solid ${colors.accent}22`,
            boxShadow: `0 4px 24px ${colors.shadow}`,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: colors.gradient,
              margin: "0 auto 20px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MessageCircle size={28} color="white" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 500, color: "#0f172a" }}>
              Sin temas todavía
            </h3>
            <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
              ¡Sé el primero en abrir un tema en esta categoría!
            </p>
            <Link
              href={`/forum/new?topic=${topicSlug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                background: colors.gradient,
                color: "white",
                borderRadius: 12,
                fontWeight: 500,
                textDecoration: "none",
                fontSize: 14,
                boxShadow: `0 4px 14px ${colors.shadow}`,
              }}
            >
              + Nuevo Tema
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
