"use client"

import { useEffect, useState, Suspense, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { ThreadCardSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"
import {
  Target, MessageCircle, Briefcase, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp,
  Send, ExternalLink, X
} from "lucide-react"
import { RocketIcon, LeafIcon, NoteIcon, ThumbsUpIcon, IdeaIcon, WarningIcon, ZapIcon } from "@/components/CustomIcons"

export const dynamic = 'force-dynamic'

// ── Types ──────────────────────────────────────────────────────────────────────
interface ForumThread {
  id: string; title: string; body: string; status: 'open' | 'resolved' | 'locked'
  score: number; viewCount: number; commentCount: number; isPinned: boolean; createdAt: string
  author: {
    userId: string
    nickname: string
    reputation: number
    isMinor?: boolean
    level?: number
    fullName?: string
    avatar?: any
  }
  topic: { id: string; name: string; slug: string; icon: string }
  tags: Array<{ id: string; name: string; slug: string }>
  hasAcceptedAnswer: boolean
}

interface EvidencePost {
  id: string; dailyChallengeId: string; authorDisplay: string; isMe: boolean
  smartGoal: string; didToday: string; learned: string; changeTomorrow: string
  status: 'submitted' | 'validated' | 'flagged'; authorRole: string
  createdAt: string; avatar?: any
  reactions: Array<{ id: string; userId: string; reactionType: string }>
  comments: Array<{ id: string; userId: string; body: string; createdAt: string; authorDisplay?: string }>
}

interface DailyChallenge {
  id: string; title: string; description: string; challengeType: string
}

type Tab = 'reto-del-dia' | 'preguntas' | 'proyectos'

// ── Reaction config ─────────────────────────────────────────────────────────
const REACTIONS = [
  { type: "Buena meta", icon: <ThumbsUpIcon size={13} />, color: "#10b981", bg: "#ecfdf5" },
  { type: "Tip", icon: <IdeaIcon size={13} />, color: "#f59e0b", bg: "#fffbeb" },
  { type: "Te faltó algo", icon: <WarningIcon size={13} />, color: "#6366f1", bg: "#eef2ff" },
  { type: "Inspirador", icon: <ZapIcon size={13} />, color: "#0F62FE", bg: "#eff6ff" },
]

// ── Topic colour palette ──────────────────────────────────────────────────────
const TOPIC_COLORS: Record<string, { accent: string; light: string; shadow: string }> = {
  "ahorro": { accent: "#10b981", light: "#ecfdf5", shadow: "rgba(16,185,129,0.15)" },
  "presupuesto": { accent: "#2563eb", light: "#eff6ff", shadow: "rgba(37,99,235,0.15)" },
  "deuda": { accent: "#ef4444", light: "#fef2f2", shadow: "rgba(239,68,68,0.15)" },
  "inversion": { accent: "#d97706", light: "#fffbeb", shadow: "rgba(245,158,11,0.15)" },
  "inversion-basica": { accent: "#d97706", light: "#fffbeb", shadow: "rgba(245,158,11,0.15)" },
  "emprendimiento": { accent: "#7c3aed", light: "#f5f3ff", shadow: "rgba(124,58,237,0.15)" },
  "proyectos": { accent: "#4f46e5", light: "#eef2ff", shadow: "rgba(79,70,229,0.15)" },
  "negocios": { accent: "#0284c7", light: "#f0f9ff", shadow: "rgba(2,132,199,0.15)" },
  "finanzas": { accent: "#0F62FE", light: "#eff6ff", shadow: "rgba(15,98,254,0.15)" },
  "reto-del-dia": { accent: "#fbbf24", light: "#fffbeb", shadow: "rgba(251,191,36,0.15)" },
  "preguntas": { accent: "#0F62FE", light: "#eff6ff", shadow: "rgba(15,98,254,0.15)" },
}
const DEFAULT_TOPIC = { accent: "#0F62FE", light: "#eff6ff", shadow: "rgba(15,98,254,0.15)" }

function getTopicColors(slug: string) {
  if (TOPIC_COLORS[slug]) return TOPIC_COLORS[slug]
  const key = Object.keys(TOPIC_COLORS).find(k => slug?.startsWith(k) || k?.startsWith(slug))
  return key ? TOPIC_COLORS[key] : DEFAULT_TOPIC
}

// ── Evidence Card Component ──────────────────────────────────────────────────
function EvidenceCard({
  post,
  onReact,
  onValidate,
  isTeacher,
  currentUserId,
}: {
  post: EvidencePost
  onReact: (postId: string, type: string) => void
  onValidate: (postId: string) => void
  isTeacher: boolean
  currentUserId: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [sendingComment, setSendingComment] = useState(false)
  const [localComments, setLocalComments] = useState(post.comments)
  const [localReactions, setLocalReactions] = useState(post.reactions)

  const myReaction = localReactions.find(r => r.userId === currentUserId)

  const handleComment = async () => {
    if (!commentText.trim()) return
    setSendingComment(true)
    try {
      const res = await fetch(`/api/evidence/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: commentText })
      })
      if (res.ok) {
        const comment = await res.json()
        setLocalComments(c => [...c, comment])
        setCommentText("")
      }
    } finally {
      setSendingComment(false)
    }
  }

  const handleLocalReact = async (type: string) => {
    // Optimistic update
    if (myReaction?.reactionType === type) {
      setLocalReactions(r => r.filter(x => x.userId !== currentUserId))
    } else if (myReaction) {
      setLocalReactions(r => r.map(x => x.userId === currentUserId ? { ...x, reactionType: type } : x))
    } else {
      setLocalReactions(r => [...r, { id: "tmp", userId: currentUserId, reactionType: type }])
    }
    onReact(post.id, type)
  }

  const formatDate = (d: string) => {
    const date = new Date(d), now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return "hace un momento"
    if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
    return `hace ${Math.floor(diff / 86400)}d`
  }

  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "20px 22px",
      border: `1.5px solid ${post.status === "validated" ? "rgba(16,185,129,0.3)" : "#f1f5f9"}`,
      boxShadow: post.status === "validated" ? "0 4px 16px rgba(16,185,129,0.1)" : "0 2px 8px rgba(0,0,0,0.04)",
      marginBottom: 12
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "white",
            border: "1.5px solid #f1f5f9",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <AvatarDisplay avatar={post.avatar} size={36} />
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{post.authorDisplay}</span>
            {post.isMe && <span style={{ fontSize: 11, color: "#0F62FE", fontWeight: 700, marginLeft: 6 }}>Tú</span>}
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{formatDate(post.createdAt)}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
            background: post.status === "validated" ? "#ecfdf5" : "#f1f5f9",
            color: post.status === "validated" ? "#065f46" : "#64748b"
          }}>
            {post.status === "validated" ? "✓ Validado" : "Enviado"}
          </span>
          {isTeacher && post.status !== "validated" && (
            <button
              onClick={() => onValidate(post.id)}
              style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: "#ecfdf5", color: "#065f46", border: "1px solid rgba(16,185,129,0.4)", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" }}
            >
              Validar
            </button>
          )}
        </div>
      </div>

      {/* Smart Goal always visible */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Mi objetivo SMART</div>
        <p style={{ fontSize: 14, color: "#0f172a", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>{post.smartGoal}</p>
      </div>

      {/* Expandable fields */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12, display: "grid", gap: 10 }}>
          {[["¿Qué hice hoy?", post.didToday], ["¿Qué aprendí?", post.learned], ["¿Qué cambiaré mañana?", post.changeTomorrow]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{label}</div>
              <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.6 }}>{val}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setExpanded(e => !e)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, padding: "4px 0", marginTop: 8, fontFamily: "'Montserrat', sans-serif" }}>
        {expanded ? <><ChevronUp size={14} /> Menos detalles</> : <><ChevronDown size={14} /> Ver más detalles</>}
      </button>

      {/* Reactions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
        {REACTIONS.map(r => {
          const count = localReactions.filter(x => x.reactionType === r.type).length
          const active = myReaction?.reactionType === r.type
          return (
            <button
              key={r.type}
              onClick={() => handleLocalReact(r.type)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                fontSize: 12, fontWeight: active ? 700 : 600, fontFamily: "'Montserrat', sans-serif",
                border: active ? `1.5px solid ${r.color}` : "1px solid #e2e8f0",
                background: active ? r.bg : "white",
                color: active ? r.color : "#64748b",
                transition: "all 0.15s"
              }}
            >
              {r.icon}
              {r.type}
              {count > 0 && <span style={{ fontWeight: 800 }}>{count}</span>}
            </button>
          )
        })}

        <button onClick={() => setShowComments(s => !s)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontFamily: "'Montserrat', sans-serif" }}>
          <MessageCircle size={13} />
          {localComments.length > 0 ? localComments.length : "Comentar"}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
          {localComments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                {(c.authorDisplay || "?").charAt(0).toUpperCase()}
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "6px 10px", flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{c.authorDisplay || "Usuario"}</span>
                <p style={{ fontSize: 13, color: "#334155", margin: "2px 0 0", lineHeight: 1.5 }}>{c.body}</p>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Agrega un comentario..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleComment() }}
              style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "'Montserrat', sans-serif" }}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || sendingComment}
              style={{ padding: "8px 12px", background: commentText.trim() ? "#0F62FE" : "#e2e8f0", color: commentText.trim() ? "white" : "#94a3b8", border: "none", borderRadius: 10, cursor: commentText.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Forum Content ─────────────────────────────────────────────────────────
function ForumContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialTab = (searchParams.get("tab") as Tab) || "reto-del-dia"
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  // Reto del día state
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null)
  const [evidencePosts, setEvidencePosts] = useState<EvidencePost[]>([])
  const [loadingEvidence, setLoadingEvidence] = useState(false)
  const [evidenceSort, setEvidenceSort] = useState<"new" | "validated">("new")
  const [evidenceScope, setEvidenceScope] = useState<"school" | "all">("school")
  const [userRole, setUserRole] = useState<string>("student")
  const challengeIdFromUrl = searchParams.get("challengeId")

  // Q&A + existing forum state
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"new" | "top" | "unanswered">("new")
  const [loadingData, setLoadingData] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.background = "#f8fafc"
    return () => { document.body.style.background = "" }
  }, [])

  useEffect(() => {
    if (loading || !user) return
    fetchUserRole()
    if (activeTab === "reto-del-dia") {
      fetchTodayChallenge()
    } else {
      fetchForumData()
    }
  }, [activeTab, user, loading])

  const fetchUserRole = async () => {
    try {
      const res = await fetch("/api/profile/me")
      if (res.ok) {
        const data = await res.json()
        setUserRole(data.role || "student")
      }
    } catch { }
  }

  const fetchTodayChallenge = async () => {
    try {
      const res = await fetch("/api/daily-challenge/today")
      if (res.ok) {
        const data = await res.json()
        setTodayChallenge(data)
        fetchEvidence(data.id)
      }
    } catch (e) { console.error(e) }
  }

  const fetchEvidence = async (challengeId: string, scope = evidenceScope) => {
    setLoadingEvidence(true)
    try {
      const res = await fetch(`/api/evidence?challengeId=${challengeId}&scope=${scope}`)
      if (res.ok) {
        const data = await res.json()
        setEvidencePosts(data)
      }
    } catch (e) { console.error(e) } finally {
      setLoadingEvidence(false)
    }
  }

  const fetchForumData = async () => {
    setLoadingData(true); setFetchError(null)
    try {
      const [topicsRes, threadsRes] = await Promise.all([
        fetch('/api/forum/topics', { credentials: 'same-origin', cache: 'no-store' }),
        fetch(`/api/forum/threads?sort=${sortBy}&topic=${selectedTopic}`, { credentials: 'same-origin', cache: 'no-store' })
      ])
      if (topicsRes.ok) setTopics(await topicsRes.json())
      if (threadsRes.ok) {
        const raw = await threadsRes.json()
        setThreads(Array.isArray(raw) ? raw : [])
      } else if (threadsRes.status === 401) {
        setFetchError("Sesión expirada. Vuelve a iniciar sesión.")
      }
    } catch { setFetchError("Error de conexión. Intenta de nuevo.") } finally {
      setLoadingData(false)
    }
  }

  const handleReact = async (postId: string, reactionType: string) => {
    try {
      await fetch(`/api/evidence/${postId}/react`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType })
      })
    } catch { }
  }

  const handleValidate = async (postId: string) => {
    try {
      const res = await fetch(`/api/evidence/${postId}/validate`, { method: "POST" })
      if (res.ok) {
        setEvidencePosts(posts => posts.map(p => p.id === postId ? { ...p, status: "validated" } : p))
      }
    } catch { }
  }

  const sortedPosts = evidenceSort === "validated"
    ? [...evidencePosts].sort((a, b) => (b.status === "validated" ? 1 : 0) - (a.status === "validated" ? 1 : 0))
    : evidencePosts

  const isTeacher = ["teacher", "school_admin", "admin", "moderator"].includes(userRole)
  const validatedToday = evidencePosts.filter(p => p.status === "validated").length
  const pendingToday = evidencePosts.filter(p => p.status === "submitted").length

  const formatDate = (d: string) => {
    const date = new Date(d), now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
    return `hace ${Math.floor(diff / 86400)}d`
  }

  if (loading) return null
  if (!user) return null

  return (
    <>
      <LoadingBar />
      <style>{`
        @media (max-width: 767px) {
          .forum-outer { position: relative !important; z-index: 1 !important; overflow-x: hidden !important; background: #f8fafc !important; min-height: 100vh !important; }
          .forum-container { padding-bottom: calc(90px + env(safe-area-inset-bottom)) !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .forum-container { width: calc(100% - 220px) !important; max-width: calc(100% - 220px) !important; margin-left: 220px !important; padding: clamp(24px, 3vw, 40px) !important; }
        }
        @media (min-width: 1161px) {
          .forum-container { width: calc(100% - 280px) !important; max-width: calc(100% - 280px) !important; margin-left: 280px !important; padding: clamp(24px, 4vw, 40px) !important; }
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .forum-tab-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Montserrat', sans-serif;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .forum-tab-btn.active { background: #0F62FE; color: white; box-shadow: 0 4px 12px rgba(15,98,254,0.3); }
        .forum-tab-btn.inactive { background: white; color: #64748b; border: 1.5px solid #e2e8f0; }
        .forum-tab-btn.inactive:hover { border-color: #0F62FE; color: #0F62FE; }
      `}</style>

      <div className="forum-outer" style={{ position: "relative", flex: 1, fontFamily: "'Montserrat', sans-serif", background: "#f8fafc", width: "100%", boxSizing: "border-box", minHeight: "100vh" }}>
        <div ref={containerRef} className="forum-container" style={{ position: "relative", flex: 1, paddingTop: 32, paddingBottom: 80, boxSizing: "border-box", width: "100%" }}>
          <main style={{ position: "relative", margin: 0, padding: "clamp(16px, 4vw, 40px)", width: "100%", boxSizing: "border-box" }}>

            {/* ── Page Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Foro</h1>
                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 15, fontWeight: 500 }}>
                  Comparte, aprende y conecta con tu grupo
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/forum/bookmarks" style={{ padding: "10px 16px", background: "white", color: "#374151", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 13, border: "1.5px solid #e2e8f0" }}>Guardados</Link>
                <Link href="/forum/new" style={{ padding: "10px 18px", background: "linear-gradient(135deg, #0F62FE, #4A9EFF)", color: "white", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 13, boxShadow: "0 4px 12px rgba(15,98,254,0.3)" }}>+ Crear Tema</Link>
              </div>
            </div>

            {/* ── 3-Tab Selector ── */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4, flexWrap: "nowrap" }}>
              <button className={`forum-tab-btn ${activeTab === "reto-del-dia" ? "active" : "inactive"}`} onClick={() => setActiveTab("reto-del-dia")}>
                <Target size={15} /> Reto del día
              </button>
              <button className={`forum-tab-btn ${activeTab === "preguntas" ? "active" : "inactive"}`} onClick={() => setActiveTab("preguntas")}>
                <MessageCircle size={15} /> Preguntas rápidas
              </button>
              <button className={`forum-tab-btn ${activeTab === "proyectos" ? "active" : "inactive"}`} onClick={() => setActiveTab("proyectos")}>
                <Briefcase size={15} /> Proyectos
              </button>
            </div>

            {/* ════════════════════════════════════════════
                TAB 1 — RETO DEL DÍA
            ════════════════════════════════════════════ */}
            {activeTab === "reto-del-dia" && (
              <div>
                {/* Today's challenge banner */}
                {todayChallenge && (
                  <div style={{
                    background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
                    borderRadius: 28, padding: "24px 32px", marginBottom: 24,
                    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
                    border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 16px 40px rgba(0,0,0,0.25)"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Reto de hoy</div>
                      <h2 style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 800, color: "white", margin: "0 0 6px" }}>{todayChallenge.title}</h2>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5, maxWidth: 500 }}>{todayChallenge.description.slice(0, 120)}...</p>
                    </div>
                    <Link href="/reto-diario" style={{
                      display: "flex", alignItems: "center", gap: 7, padding: "11px 20px",
                      background: "linear-gradient(135deg, #0F62FE, #2563EB)", color: "white",
                      borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(15,98,254,0.4)", whiteSpace: "nowrap"
                    }}>
                      <Target size={15} /> Hacer el reto
                    </Link>
                  </div>
                )}

                {/* Teacher summary */}
                {isTeacher && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "Evidencias hoy", value: evidencePosts.length, color: "#0F62FE" },
                      { label: "Validadas", value: validatedToday, color: "#10b981" },
                      { label: "Pendientes", value: pendingToday, color: "#f59e0b" },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ background: "white", borderRadius: 14, padding: "16px 20px", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
                        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                  <select
                    value={evidenceSort}
                    onChange={e => setEvidenceSort(e.target.value as "new" | "validated")}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: "'Montserrat', sans-serif", color: "#374151", cursor: "pointer", background: "white" }}
                  >
                    <option value="new">Más recientes</option>
                    <option value="validated">Más validadas</option>
                  </select>
                  {isTeacher && (
                    <select
                      value={evidenceScope}
                      onChange={e => {
                        setEvidenceScope(e.target.value as "school" | "all")
                        if (todayChallenge) fetchEvidence(todayChallenge.id, e.target.value as any)
                      }}
                      style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: "'Montserrat', sans-serif", color: "#374151", cursor: "pointer", background: "white" }}
                    >
                      <option value="school">Mi escuela</option>
                      <option value="all">Todas</option>
                    </select>
                  )}
                  <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: "auto" }}>
                    {evidencePosts.length} publicaciones
                  </span>
                </div>

                {/* Evidence feed */}
                {loadingEvidence ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ height: 140, borderRadius: 16, background: "#f1f5f9", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite" }} />
                    ))}
                  </div>
                ) : sortedPosts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, border: "1.5px solid #f1f5f9" }}>
                    <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
                      <NoteIcon size={48} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Sé el primero en publicar tu evidencia</h3>
                    <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                      Completa el reto de hoy y comparte tu aprendizaje con tu grupo.
                    </p>
                    <Link href="/reto-diario" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg, #0F62FE, #2563EB)", color: "white", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
                      <Target size={16} /> Hacer el reto de hoy
                    </Link>
                  </div>
                ) : (
                  sortedPosts.map(post => (
                    <EvidenceCard
                      key={post.id}
                      post={post}
                      onReact={handleReact}
                      onValidate={handleValidate}
                      isTeacher={isTeacher}
                      currentUserId={user.id}
                    />
                  ))
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════
                TAB 2 — PREGUNTAS RÁPIDAS (existing forum)
            ════════════════════════════════════════════ */}
            {activeTab === "preguntas" && (
              <div>
                {/* Tags quick filter */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {["Todos", "ahorro", "presupuesto", "deuda", "inversión básica", "emprendimiento"].map(tag => (
                    <button key={tag} style={{
                      padding: "6px 14px", borderRadius: 999,
                      background: tag === "Todos" && selectedTopic === "all" ? "#0F62FE" : "#f1f5f9",
                      color: tag === "Todos" && selectedTopic === "all" ? "white" : "#64748b",
                      border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Montserrat', sans-serif"
                    }} onClick={() => { if (tag === "Todos") setSelectedTopic("all"); else setSelectedTopic(tag); fetchForumData() }}>
                      #{tag === "Todos" ? "all" : tag}
                    </button>
                  ))}
                  <select value={sortBy} onChange={e => { setSortBy(e.target.value as any); fetchForumData() }} style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", background: "white", color: "#374151" }}>
                    <option value="new">Más recientes</option>
                    <option value="top">Más votados</option>
                    <option value="unanswered">Sin responder</option>
                  </select>
                </div>

                {fetchError && (
                  <div style={{ marginBottom: 20, padding: "12px 16px", background: "#fef2f2", borderRadius: 12, color: "#991b1b", fontSize: 13, display: "flex", gap: 8 }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    {fetchError}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: loadingData ? 0.6 : 1, transition: "opacity 0.3s" }}>
                  {loadingData ? <><ThreadCardSkeleton /><ThreadCardSkeleton /></> :
                    threads.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, border: "1.5px solid #f1f5f9" }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>No hay preguntas todavía</h3>
                        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>¡Sé el primero en hacer una pregunta!</p>
                        <Link href="/forum/new" style={{ padding: "12px 24px", background: "linear-gradient(135deg, #0F62FE, #4A9EFF)", color: "white", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>Hacer pregunta</Link>
                      </div>
                    ) : threads.map((thread, i) => {
                      const tc = getTopicColors(thread.topic?.slug || "")
                      const accentBorder = thread.isPinned ? "#f59e0b" : tc.accent
                      return (
                        <Link key={thread.id} href={`/forum/thread/${thread.id}`} style={{
                          padding: "clamp(14px, 3vw, 22px) clamp(14px, 3vw, 22px) clamp(14px, 3vw, 22px) 0",
                          background: "white", borderRadius: 16,
                          border: "1.5px solid #f1f5f9",
                          borderLeft: `4px solid ${accentBorder}`,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textDecoration: "none",
                          display: "block", transition: "all 0.2s ease",
                          overflow: "hidden",
                          animation: `fadeInUp 0.4s ease ${i * 0.04}s both`
                        }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateX(4px)"
                            e.currentTarget.style.boxShadow = `0 6px 20px ${tc.shadow}`
                            e.currentTarget.style.borderColor = tc.accent
                            e.currentTarget.style.borderLeftColor = accentBorder
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateX(0)"
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"
                            e.currentTarget.style.borderColor = "#f1f5f9"
                            e.currentTarget.style.borderLeftColor = accentBorder
                          }}>
                          <div style={{ display: "flex", gap: 16, paddingLeft: 20 }}>
                            {/* Vote score */}
                            <div style={{ minWidth: 44, textAlign: "center", paddingTop: 2 }}>
                              <div style={{ fontSize: 22, fontWeight: 900, color: thread.score > 0 ? tc.accent : thread.score < 0 ? "#ef4444" : "#94a3b8", lineHeight: 1 }}>{thread.score}</div>
                              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>votos</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                                <h3 style={{ margin: 0, flex: 1, fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.4 }}>{thread.title}</h3>
                                <span style={{
                                  padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                                  background: thread.status === "resolved" ? "#ecfdf5" : thread.status === "locked" ? "#fef2f2" : tc.light,
                                  color: thread.status === "resolved" ? "#065f46" : thread.status === "locked" ? "#dc2626" : tc.accent,
                                }}>
                                  {thread.status === "resolved" ? "Resuelto" : thread.status === "locked" ? "Cerrado" : "Abierto"}
                                </span>
                              </div>
                              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {thread.body.substring(0, 150)}...
                              </p>
                              {thread.tags.length > 0 && (
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                                  {thread.tags.map(tag => (
                                    <span key={tag.id} style={{ padding: "3px 8px", background: tc.light, color: tc.accent, fontSize: 11, fontWeight: 600, borderRadius: 6 }}>#{tag.name}</span>
                                  ))}
                                </div>
                              )}
                              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#94a3b8", fontWeight: 600, alignItems: "center", flexWrap: "wrap" }}>
                                {/* Topic chip */}
                                <span style={{ padding: "2px 8px", background: tc.light, color: tc.accent, borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                                  {thread.topic.name}
                                </span>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "white", border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AvatarDisplay avatar={thread.author.avatar} size={20} />
                                  </div>
                                  <span>por {thread.author.nickname}</span>
                                </div>
                                <span>{formatDate(thread.createdAt)}</span>
                                <span>{thread.commentCount} resp.</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })
                  }
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════
                TAB 3 — PROYECTOS
            ════════════════════════════════════════════ */}
            {activeTab === "proyectos" && (
              <div>
                {/* Pitch week banner */}
                <div style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  borderRadius: 18, padding: "24px 28px", marginBottom: 24,
                  display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                  boxShadow: "0 8px 24px rgba(124,58,237,0.3)"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Esta semana</div>
                    <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 900, color: "white", margin: "0 0 6px" }}>
                      <RocketIcon size={24} color="white" style={{ verticalAlign: "middle", marginRight: 8 }} />
                      Pitch Week
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>Comparte tu idea de negocio y recibe feedback de tu grupo. Usa la plantilla estructurada abajo.</p>
                  </div>
                  <Link href="/forum/new" style={{ padding: "11px 20px", background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                    Publicar proyecto →
                  </Link>
                </div>

                {/* Project template guide */}
                <div style={{ background: "white", borderRadius: 18, padding: 28, border: "1.5px solid #f1f5f9", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Plantilla para Proyectos</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                    {[
                      { label: "Idea", desc: "¿Qué problema resuelves?" },
                      { label: "Costo", desc: "¿Cuánto inviertes?" },
                      { label: "Precio", desc: "¿Cuánto cobras?" },
                      { label: "Margen", desc: "¿Cuánto ganas?" },
                      { label: "Siguiente paso", desc: "¿Qué harás esta semana?" },
                    ].map(({ label, desc }) => (
                      <div key={label} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/forum/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "12px 22px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    <Briefcase size={16} /> Publicar mi proyecto
                  </Link>
                </div>

                {/* Placeholder thread list for projects (same feed, filtered by topic if 'proyectos' topic exists) */}
                <div style={{ textAlign: "center", padding: "40px 24px", background: "white", borderRadius: 18, border: "1.5px solid #f1f5f9" }}>
                  <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                    <LeafIcon size={40} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Aún no hay proyectos</h3>
                  <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>El feed de proyectos aparecerá aquí. ¡Sé el primero en publicar tu idea!</p>
                  <Link href="/forum/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    <Briefcase size={16} /> Publicar proyecto
                  </Link>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  )
}

export default function ForumPage() {
  return (
    <Suspense fallback={<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>Cargando...</div>}>
      <ForumContent />
    </Suspense>
  )
}
