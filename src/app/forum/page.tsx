"use client"

import { useEffect, useState, Suspense, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { ThreadCardSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"
import StreakWidget from "@/components/StreakWidget"
import {
  Target, MessageCircle, Briefcase, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, ChevronRight,
  Send, ExternalLink, X, BookOpen, Gift, Search, Loader2, Check, Palette, History, ArrowUpRight, ArrowDownLeft
} from "lucide-react"
import { RocketIcon, LeafIcon, NoteIcon, ThumbsUpIcon, IdeaIcon, WarningIcon, ZapIcon } from "@/components/CustomIcons"
import PageLoader from "@/components/PageLoader"

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
    inventory?: string[]
  }
  topic: { id: string; name: string; slug: string; icon: string }
  tags: Array<{ id: string; name: string; slug: string }>
  hasAcceptedAnswer: boolean
}

interface EvidencePost {
  id: string; dailyChallengeId: string; authorDisplay: string; isMe: boolean; authorUserId: string
  smartGoal: string; didToday: string; learned: string; changeTomorrow: string
  status: 'submitted' | 'validated' | 'flagged'; authorRole: string
  createdAt: string; avatar?: any; inventory?: string[]
  reactions: Array<{ id: string; userId: string; reactionType: string }>
  comments: Array<{ id: string; userId: string; body: string; createdAt: string; authorDisplay?: string }>
  attachments?: any
}

interface DailyChallenge {
  id: string; title: string; description: string; challengeType: string
}

type Tab = 'mision-del-dia' | 'preguntas' | 'proyectos'

// ── Reaction config ─────────────────────────────────────────────────────────
const REACTIONS = [
  { type: "Buena meta", icon: <ThumbsUpIcon size={13} />, color: "#10b981", bg: "#ecfdf5" },
  { type: "Tip", icon: <IdeaIcon size={13} />, color: "#f59e0b", bg: "#fffbeb" },
  { type: "Te faltó algo", icon: <WarningIcon size={13} />, color: "#6366f1", bg: "#eef2ff" },
  { type: "Inspirador", icon: <ZapIcon size={13} />, color: "#0F62FE", bg: "#eff6ff" },
]

// ── Topic colour palette ──────────────────────────────────────────────────────
const TOPIC_COLORS: Record<string, { accent: string; light: string; shadow: string; gradient: string }> = {
  "ahorro": { accent: "#10b981", light: "#ecfdf5", shadow: "rgba(16,185,129,0.15)", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  "presupuesto": { accent: "#3B82F6", light: "#eff6ff", shadow: "rgba(59,130,246,0.15)", gradient: "linear-gradient(135deg, #3B82F6, #2563EB)" },
  "deuda": { accent: "#EF4444", light: "#fef2f2", shadow: "rgba(239,68,68,0.15)", gradient: "linear-gradient(135deg, #EF4444, #DC2626)" },
  "inversion": { accent: "#F59E0B", light: "#fffbeb", shadow: "rgba(245,158,11,0.15)", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
  "inversion-basica": { accent: "#F59E0B", light: "#fffbeb", shadow: "rgba(245,158,11,0.15)", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
  "emprendimiento": { accent: "#8B5CF6", light: "#f5f3ff", shadow: "rgba(139,92,246,0.15)", gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)" },
  "proyectos": { accent: "#6366F1", light: "#eef2ff", shadow: "rgba(99,102,241,0.15)", gradient: "linear-gradient(135deg, #6366F1, #4F46E5)" },
  "negocios": { accent: "#0EA5E9", light: "#f0f9ff", shadow: "rgba(14,165,233,0.15)", gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)" },
  "finanzas": { accent: "#1E293B", light: "#f8fafc", shadow: "rgba(30,41,59,0.15)", gradient: "linear-gradient(135deg, #334155, #1E293B)" },
  "mision-del-dia": { accent: "#F59E0B", light: "#fffbeb", shadow: "rgba(245,158,11,0.15)", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
  "preguntas": { accent: "#0F62FE", light: "#eff6ff", shadow: "rgba(15,98,254,0.15)", gradient: "linear-gradient(135deg, #0F62FE, #2563EB)" },
}
const DEFAULT_TOPIC = { accent: "#0F62FE", light: "#eff6ff", shadow: "rgba(15,98,254,0.15)", gradient: "linear-gradient(135deg, #0F62FE, #2563EB)" }

function getTopicColors(slug: string) {
  if (TOPIC_COLORS[slug]) return TOPIC_COLORS[slug]
  const key = Object.keys(TOPIC_COLORS).find(k => slug?.toLowerCase().includes(k.toLowerCase()))
  return key ? TOPIC_COLORS[key] : DEFAULT_TOPIC
}

// ── Evidence Card Component ──────────────────────────────────────────────────
function EvidenceCard({
  post,
  onReact,
  onValidate,
  isTeacher,
  currentUserId,
  onTransferClick,
  onDeletePost,
  onDeleteComment,
}: {
  post: EvidencePost
  onReact: (postId: string, type: string) => void
  onValidate: (postId: string) => void
  isTeacher: boolean
  currentUserId: string
  onTransferClick: (userId: string, name: string) => void
  onDeletePost: (postId: string) => void
  onDeleteComment: (postId: string, commentId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [sendingComment, setSendingComment] = useState(false)
  const [localComments, setLocalComments] = useState(post.comments)
  const [localReactions, setLocalReactions] = useState(post.reactions)
  const [isValidating, setIsValidating] = useState(false)

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
      background: `linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))`,
      backgroundColor: post.status === "validated" ? "rgba(16,185,129,0.05)" : "rgba(15,98,254,0.03)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: 24, padding: "clamp(16px, 3vw, 24px)",
      border: `1px solid ${post.status === "validated" ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.6)"}`,
      boxShadow: post.status === "validated" ? "0 12px 24px rgba(16,185,129,0.06)" : "0 4px 12px rgba(0,0,0,0.02)",
      marginBottom: 16,
      transition: "all 0.3s ease",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
        <Link href={`/forum/profile/${post.authorUserId}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "white",
            border: "1.5px solid #f1f5f9",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <AvatarDisplay
              avatar={post.avatar}
              size={36}
              frame={post.inventory?.includes("2") ? "vip" : post.inventory?.includes("1") ? "ambassador" : null}
            />
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{post.authorDisplay}</span>
            {post.isMe && <span style={{ fontSize: 11, color: "#0F62FE", fontWeight: 500, marginLeft: 6 }}>Tú</span>}
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{formatDate(post.createdAt)}</div>
          </div>
        </Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!post.isMe && (
            <button 
              onClick={() => onTransferClick(post.authorUserId, post.authorDisplay)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8,
                background: "rgba(15,98,254,0.08)", color: "#0F62FE", border: "1px solid rgba(15,98,254,0.15)",
                fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
              }}
              className="gift-btn-hover"
            >
              <Gift size={13} /> Regalar
            </button>
          )}
          <span style={{
            fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 8,
            background: post.status === "validated" ? "#ecfdf5" : "#f1f5f9",
            color: post.status === "validated" ? "#065f46" : "#64748b"
          }}>
            {post.status === "validated" ? "✓ Validado" : "Enviado"}
          </span>
          {isTeacher && post.status !== "validated" && (
            <button
              onClick={async () => {
                setIsValidating(true)
                await onValidate(post.id)
                setIsValidating(false)
              }}
              disabled={isValidating}
              style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 8, background: "#ecfdf5", color: "#065f46", border: "1px solid rgba(16,185,129,0.4)", cursor: isValidating ? "wait" : "pointer", opacity: isValidating ? 0.7 : 1 }}
            >
              {isValidating ? "Validando..." : "Validar"}
            </button>
          )}
          {post.authorUserId === currentUserId && (
            <button
              onClick={() => onDeletePost(post.id)}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 8px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.08)",
                color: "#EF4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Smart Goal always visible */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Mi objetivo SMART</div>
        <p style={{ fontSize: 14, color: "#0f172a", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{post.smartGoal}</p>
      </div>

      {/* Attachments (Images) */}
      {post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, margin: "12px 0" }}>
          {post.attachments.map((att: any, idx: number) => (
            <div key={idx} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #f1f5f9", aspectRatio: "16/9", background: "#f8fafc" }}>
              <img src={att.url} alt="Evidencia" style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }} onClick={() => window.open(att.url, '_blank')} />
            </div>
          ))}
        </div>
      )}

      {/* Expandable fields */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12, display: "grid", gap: 10 }}>
          {[["¿Qué hice hoy?", post.didToday], ["¿Qué aprendí?", post.learned], ["¿Qué cambiaré mañana?", post.changeTomorrow]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{label}</div>
              <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.6 }}>{val}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setExpanded(e => !e)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 4, padding: "4px 0", marginTop: 8, }}>
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
                fontSize: 12, fontWeight: active ? 700 : 600, border: active ? `1.5px solid ${r.color}` : "1px solid #e2e8f0",
                background: active ? r.bg : "white",
                color: active ? r.color : "#64748b",
                transition: "all 0.15s"
              }}
            >
              {r.icon}
              {r.type}
              {count > 0 && <span style={{ fontWeight: 500 }}>{count}</span>}
            </button>
          )
        })}

        <button onClick={() => setShowComments(s => !s)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500, border: "1px solid #e2e8f0", background: "white", color: "#64748b", }}>
          <MessageCircle size={13} />
          {localComments.length > 0 ? localComments.length : "Comentar"}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
          {localComments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <Link href={`/forum/profile/${c.userId}`} style={{ textDecoration: "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#64748b" }}>
                  {(c.authorDisplay || "?").charAt(0).toUpperCase()}
                </div>
              </Link>
              <div style={{ background: "#FBFAF5", borderRadius: 10, padding: "6px 10px", flex: 1 }}>
                <Link href={`/forum/profile/${c.userId}`} style={{ textDecoration: "none", display: "inline-block" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{c.authorDisplay || "Usuario"}</span>
                </Link>
                <p style={{ fontSize: 13, color: "#334155", margin: "2px 0 0", lineHeight: 1.5 }}>{c.body}</p>
                {c.userId === currentUserId && (
                  <button 
                    onClick={() => onDeleteComment(post.id, c.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#EF4444",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "4px 0",
                      cursor: "pointer",
                      marginTop: "2px"
                    }}
                  >
                    Eliminar
                  </button>
                )}
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
              style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", }}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || sendingComment}
              style={{ padding: "8px 12px", background: commentText.trim() ? "linear-gradient(135deg, #0f172a, #1e3a8a)" : "#e2e8f0", color: commentText.trim() ? "white" : "#94a3b8", border: "none", borderRadius: 10, cursor: commentText.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}
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
  const { user, loading, dbProfile } = useAuth()
  const streak = dbProfile?.currentStreak || 0
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialTab = (searchParams.get("tab") as Tab) || "mision-del-dia"
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  // Misión del día state
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null)
  const [evidencePosts, setEvidencePosts] = useState<EvidencePost[]>([])
  const [loadingEvidence, setLoadingEvidence] = useState(true)
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<string[]>([])
  const [evidenceSort, setEvidenceSort] = useState<"new" | "validated">("new")
  const [evidenceScope, setEvidenceScope] = useState<"school" | "all">("school")
  const [userRole, setUserRole] = useState<string>("student")
  const challengeIdFromUrl = searchParams.get("challengeId")

  // Q&A + existing forum state
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"new" | "top" | "unanswered">("new")
  const [loadingData, setLoadingData] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.background = "#FBFAF5"
    return () => { document.body.style.background = "" }
  }, [])

  useEffect(() => {
    if (loading || !user) return
    fetchUserRole()
    fetchUserStats()
    if (activeTab === "mision-del-dia") {
      fetchTodayChallenge()
    } else {
      fetchForumData()
    }
  }, [activeTab, user, loading, sortBy, selectedTopic])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?callbackUrl=/forum")
    }
  }, [user, loading, router])

  const fetchUserStats = async () => {
    try {
      const res = await fetch("/api/user/stats")
      if (res.ok) {
        const data = await res.json()
        if (data.weeklyActiveDays) setWeeklyActiveDays(data.weeklyActiveDays)
      }
    } catch { }
  }

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
    } catch (e) {
      console.error(e)
      setLoadingEvidence(false)
    }
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
        fetch(`/api/forum/threads?sort=${sortBy}&topic=${selectedTopic === 'all' ? '' : selectedTopic}`, { credentials: 'same-origin', cache: 'no-store' })
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

  const handleDeleteEvidencePost = async (postId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return
    try {
      const res = await fetch(`/api/evidence?id=${postId}`, { method: "DELETE" })
      if (res.ok) {
        setEvidencePosts(posts => posts.filter(p => p.id !== postId))
      } else {
        const err = await res.json()
        alert(err.error || "No se pudo eliminar la publicación")
      }
    } catch {
      alert("Error al intentar eliminar")
    }
  }

  const handleDeleteEvidenceComment = async (postId: string, commentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) return
    try {
      // Assuming comments under evidence are handled by a specific route or the generic one
      // If no specific route, I should check if I need to add it.
      // Based on my previous grep, there's src/app/api/evidence/[postId]/comment/route.ts
      // Let's check if that route supports DELETE.
      const res = await fetch(`/api/evidence/${postId}/comment?id=${commentId}`, { method: "DELETE" })
      if (res.ok) {
        setEvidencePosts(posts => posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: p.comments.filter(c => c.id !== commentId) }
          }
          return p
        }))
      } else {
        const err = await res.json()
        alert(err.error || "No se pudo eliminar el comentario")
      }
    } catch {
      alert("Error al intentar eliminar")
    }
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

  const isAdminOrTeacher = ["teacher", "school_admin"].includes(userRole)
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

  const showFullLoader = loading || (user && !dbProfile) ||
    (activeTab === "mision-del-dia" && loadingEvidence && evidencePosts.length === 0) ||
    (activeTab !== "mision-del-dia" && loadingData && threads.length === 0)


  if (showFullLoader) return <PageLoader />
  if (!user) return null

  return (
    <>
      <LoadingBar />
      <style>{`
        @media (max-width: 767px) {
          .forum-outer { position: relative !important; z-index: 1 !important; overflow-x: hidden !important; background: #f8fafc !important; min-height: 100vh !important; }
          .forum-container { padding-top: 14px !important; padding-bottom: calc(90px + env(safe-area-inset-bottom)) !important; }
          .forum-container main { padding: 16px !important; }
          .forum-container h1 { font-size: 28px !important; margin-bottom: 6px !important; }
          .forum-container p { font-size: 13px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .forum-container { width: 100% !important; max-width: 100% !important; margin-left: 0 !important; padding: clamp(24px, 3vw, 40px) !important; }
        }
        @media (min-width: 1161px) {
          .forum-container { width: 100% !important; max-width: 100% !important; margin-left: 0 !important; padding: clamp(24px, 4vw, 40px) !important; }
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .forum-tab-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .forum-tab-btn.active { 
          background: linear-gradient(135deg, #0f172a, #1e3a8a); 
          color: white; 
          box-shadow: 0 8px 16px rgba(15,23,42,0.25); 
          transform: translateY(-1px);
        }
        .forum-tab-btn.inactive { background: white; color: #64748b; border: 1.5px solid #e2e8f0; }
        .forum-tab-btn.inactive:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }

        .forum-card-premium {
          background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4));
          background-color: rgba(15,98,254,0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }
        .forum-card-premium:hover {
          transform: translateY(-4px);
          background-color: rgba(15,98,254,0.08);
          box-shadow: 0 20px 40px rgba(15,98,254,0.08);
          border-color: rgba(15,98,254,0.3);
        }
        .gift-btn-hover:hover {
           background: rgba(15,98,254,0.15) !important;
           transform: scale(1.05);
        }
      `}</style>

      <div className="forum-outer" style={{ position: "relative", flex: 1, background: "#FBFAF5", width: "100%", boxSizing: "border-box", minHeight: "100vh" }}>
        <div ref={containerRef} className="forum-container" style={{ position: "relative", flex: 1, paddingTop: 32, paddingBottom: 80, boxSizing: "border-box", width: "100%" }}>
          <main style={{ position: "relative", margin: 0, padding: "clamp(16px, 4vw, 40px)", width: "100%", boxSizing: "border-box" }}>

            {/* ── Page Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              <div>

                <h1 style={{
                  margin: 0,
                  fontSize: "clamp(26px, 4.5vw, 44px)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  paddingBottom: "8px",
                  letterSpacing: "-0.04em",
                  color: "#0B1E5E",
                }}>
                  Foro de la Comunidad
                </h1>
                <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#64748b", margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
                  Comparte tus aprendizajes, resuelve dudas y colabora con otros usuarios en su camino financiero.
                </p>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <StreakWidget streak={streak} showCalendar activeDays={weeklyActiveDays} />
              </div>
            </div>

            {/* ── Tab Selector Row ── */}
            <div style={{ display: "flex", gap: 10, marginBottom: 32, overflowX: "auto", paddingBottom: 6, flexWrap: "nowrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button className={`forum-tab-btn ${activeTab === "mision-del-dia" ? "active" : "inactive"}`} onClick={() => setActiveTab("mision-del-dia")}>
                  <Target size={15} /> Misión del día
                </button>
                <button className={`forum-tab-btn ${activeTab === "preguntas" ? "active" : "inactive"}`} onClick={() => setActiveTab("preguntas")}>
                  <MessageCircle size={15} /> Preguntas rápidas
                </button>
                <button className={`forum-tab-btn ${activeTab === "proyectos" ? "active" : "inactive"}`} onClick={() => setActiveTab("proyectos")}>
                  <Briefcase size={15} /> Proyectos
                </button>
              </div>

              {/* Vertical Divider */}
              <div style={{ width: 1.5, height: 24, background: "#e2e8f0", margin: "0 4px" }} />

              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/forum/bookmarks" style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "10px 18px", background: "white", color: "#64748b",
                  borderRadius: 12, fontWeight: 500, textDecoration: "none", fontSize: 13,
                  border: "1.5px solid #e2e8f0", transition: "all 0.2s"
                }} className="forum-nav-extra-btn">
                  <BookOpen size={15} /> Guardados
                </Link>
                {!isAdminOrTeacher && (
                  <Link href="/forum/new" style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 20px", background: "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)", color: "white",
                    borderRadius: 12, fontWeight: 500, textDecoration: "none", fontSize: 13,
                    boxShadow: "0 4px 12px rgba(15,23,42,0.3)", transition: "all 0.2s"
                  }}>
                    <span>+</span> Crear Tema
                  </Link>
                )}
              </div>
            </div>

            {/* ════════════════════════════════════════════
                TAB 1 — RETO DEL DÍA
            ════════════════════════════════════════════ */}
            {activeTab === "mision-del-dia" && (
              <div>
                {/* Today's challenge banner */}
                {todayChallenge && (
                  <div style={{
                    background: "linear-gradient(165deg, #0f172a 0%, #1e3a8a 100%)",
                    borderRadius: 32, padding: "clamp(24px, 4vw, 40px)", marginBottom: 32,
                    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24,
                    position: "relative", overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 48px -12px rgba(15,98,254,0.4)"
                  }}>
                    {/* Decorative elements */}
                    <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
                    <div style={{ position: "absolute", bottom: "-10%", left: "5%", width: 200, height: 200, background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
                    
                    <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "4px 12px", marginBottom: 16 }}>
                        <Target size={12} color="#fbbf24" fill="#fbbf24" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em" }}>Reto de hoy</span>
                      </div>
                      <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 600, color: "white", margin: "0 0 10px", letterSpacing: "-0.02em" }}>{todayChallenge.title}</h2>
                      <p style={{ fontSize: "clamp(14px, 1.2vw, 15px)", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6, maxWidth: 540 }}>{todayChallenge.description}</p>
                    </div>
                    {!isAdminOrTeacher && (
                      <Link href="/mision-del-dia" style={{
                        position: "relative", zIndex: 1,
                        display: "flex", alignItems: "center", gap: 10, padding: "14px 28px",
                        background: "white", color: "#0f172a",
                        borderRadius: 16, fontWeight: 600, fontSize: 15, textDecoration: "none",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.2)", transition: "all 0.2s",
                      }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.25)" }} 
                         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)" }}>
                        Participar ahora <ChevronRight size={18} />
                      </Link>
                    )}
                  </div>
                )}

                {/* Teacher summary */}
                {isTeacher && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {[
                      { label: "Evidencias hoy", value: evidencePosts.length, color: "#0F62FE", bg: "rgba(15,98,254,0.05)", icon: <NoteIcon size={24} color="#0F62FE" /> },
                      { label: "Validadas", value: validatedToday, color: "#10b981", bg: "rgba(16,185,129,0.05)", icon: <CheckCircle size={24} color="#10b981" /> },
                      { label: "Pendientes", value: pendingToday, color: "#F59E0B", bg: "rgba(245,158,11,0.05)", icon: <AlertCircle size={24} color="#F59E0B" /> },
                    ].map(({ label, value, color, bg, icon }) => (
                      <div key={label} style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))`, backgroundColor: bg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 24, padding: "24px", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
                        <div>
                          <div style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginTop: 4 }}>{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                  <select
                    value={evidenceSort}
                    onChange={e => setEvidenceSort(e.target.value as "new" | "validated")}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", background: "white" }}
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
                      style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", background: "white" }}
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
                      <div key={i} style={{ height: 140, borderRadius: 16, backgroundColor: "#f1f5f9", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite" }} />
                    ))}
                  </div>
                ) : sortedPosts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, border: "1.5px solid #f1f5f9" }}>
                    <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
                      <NoteIcon size={48} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 500, color: "#0f172a", marginBottom: 10 }}>Sé el primero en publicar tu evidencia</h3>
                    <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                      Completa el reto de hoy y comparte tu aprendizaje con tu grupo.
                    </p>
                    {!isAdminOrTeacher && (
                      <Link href="/mision-del-dia" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "white", color: "#0f172a", borderRadius: 12, fontWeight: 500, textDecoration: "none", fontSize: 14, boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
                        <Target size={16} /> Hacer el reto de hoy
                      </Link>
                    )}
                    {isAdminOrTeacher && (
                      <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, marginTop: 16 }}>
                        Esperando a que los alumnos publiquen sus evidencias para validar.
                      </p>
                    )}
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
                      onTransferClick={(uid) => router.push(`/transfer?target=${uid}`)}
                      onDeletePost={handleDeleteEvidencePost}
                      onDeleteComment={handleDeleteEvidenceComment}
                    />
                  ))
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════
                TAB 2 — PREGUNTAS RÁPIDAS (existing forum)
            ════════════════════════════════════════════ */}
            {activeTab === "preguntas" && (
              <div style={{ width: "100%" }}>
                {/* Topic selector row */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    style={{
                      padding: "6px 14px", borderRadius: 999,
                      background: selectedTopic === "all" ? "linear-gradient(135deg, #1e3a8a, #3b82f6)" : "#f1f5f9",
                      color: selectedTopic === "all" ? "white" : "#64748b",
                      border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                    }}
                    onClick={() => setSelectedTopic("all")}
                  >
                    #Todos
                  </button>

                  {(topics.length > 0 ? topics.map(t => t.slug) : ["ahorro", "presupuesto", "deuda", "inversion", "emprendimiento"]).map(tag => (
                    <button key={tag} style={{
                      padding: "6px 14px", borderRadius: 999,
                      background: selectedTopic === tag ? "linear-gradient(135deg, #1e3a8a, #3b82f6)" : "#f1f5f9",
                      color: selectedTopic === tag ? "white" : "#64748b",
                      border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                    }} onClick={() => setSelectedTopic(tag)}>
                      #{tag}
                    </button>
                  ))}

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", color: "#374151" }}
                  >
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

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loadingData && threads.length === 0 ? (
                    <ThreadCardSkeleton />
                  ) : threads.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", background: "#f8faff", borderRadius: 18, border: "1.8px dashed #e2e8f0" }}>
                      <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>No hay preguntas en este tema todavía. ¡Sé el primero!</p>
                    </div>
                  ) : (
                    threads.map((thread, i) => {
                      const tc = getTopicColors(thread.topic?.slug || "")
                      const accentBorder = thread.isPinned ? "#f59e0b" : tc.accent
                      return (
                        <Link key={thread.id} href={`/forum/thread/${thread.id}`} className="forum-card-premium" style={{
                          padding: "clamp(16px, 3vw, 24px) clamp(16px, 3vw, 24px) clamp(16px, 3vw, 24px) 0",
                          borderLeft: `5px solid ${accentBorder}`,
                          textDecoration: "none",
                          display: "block",
                          overflow: "hidden",
                          animation: `fadeInUp 0.4s ease ${i * 0.04}s both`,
                          position: "relative",
                          marginBottom: 12
                        }}>
                          <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
                            <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid #f1f5f9", flexShrink: 0 }}>
                              <div style={{ fontSize: 16, fontWeight: 500, color: "#1e3a8a" }}>{thread.score}</div>
                              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>votos</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0, paddingLeft: 20 }}>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                                <h3 style={{ margin: 0, flex: 1, fontSize: 16, fontWeight: 500, color: "#0f172a", lineHeight: 1.4 }}>{thread.title}</h3>
                                {thread.status !== 'open' && (
                                  <span style={{
                                    padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap",
                                    background: thread.status === "resolved" ? "#ecfdf5" : "#fef2f2",
                                    color: thread.status === "resolved" ? "#047857" : "#ef4444"
                                  }}>
                                    {thread.status.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, background: tc.light, padding: "3px 10px", borderRadius: 999, flexShrink: 0 }}>
                                  <span style={{ fontSize: 11, fontWeight: 500, color: tc.accent }}>{thread.topic.name}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 12 }}>
                                  <Link href={`/forum/profile/${thread.author.userId}`} style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "inherit" }}>
                                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "white", border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <AvatarDisplay
                                        avatar={thread.author.avatar}
                                        size={20}
                                        frame={thread.author.inventory?.includes("2") ? "vip" : thread.author.inventory?.includes("1") ? "ambassador" : null}
                                      />
                                    </div>
                                    <span style={{ fontWeight: 500 }}>{thread.author.nickname}</span>
                                  </Link>
                                  <span>·</span>
                                  <span>{formatDate(thread.createdAt)}</span>
                                  <span>·</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <MessageCircle size={13} />
                                    <span>{thread.commentCount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })
                  )}
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
                    <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Esta semana</div>
                    <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 500, color: "white", margin: "0 0 6px" }}>
                      <RocketIcon size={24} color="white" style={{ verticalAlign: "middle", marginRight: 8 }} />
                      Pitch Week
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>Comparte tu idea de negocio y recibe feedback de tu grupo. Usa la plantilla estructurada abajo.</p>
                  </div>
                  <Link href="/forum/new" style={{ padding: "11px 20px", background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 12, fontWeight: 500, fontSize: 13, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                    Publicar proyecto →
                  </Link>
                </div>

                {/* Project template guide */}
                <div style={{ background: "white", borderRadius: 18, padding: 28, border: "1.5px solid #f1f5f9", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", marginBottom: 16 }}>Plantilla para Proyectos</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                    {[
                      { label: "Idea", desc: "¿Qué problema resuelves?" },
                      { label: "Costo", desc: "¿Cuánto inviertes?" },
                      { label: "Precio", desc: "¿Cuánto cobras?" },
                      { label: "Margen", desc: "¿Cuánto ganas?" },
                      { label: "Siguiente paso", desc: "¿Qué harás esta semana?" },
                    ].map(({ label, desc }) => (
                      <div key={label} style={{ background: "#FBFAF5", borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/forum/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "12px 22px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", borderRadius: 12, fontWeight: 500, fontSize: 14, textDecoration: "none" }}>
                    <Briefcase size={16} /> Publicar mi proyecto
                  </Link>
                </div>

                {/* Placeholder thread list for projects (same feed, filtered by topic if 'proyectos' topic exists) */}
                <div style={{ textAlign: "center", padding: "40px 24px", background: "white", borderRadius: 18, border: "1.5px solid #f1f5f9" }}>
                  <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                    <LeafIcon size={40} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: "#0f172a", marginBottom: 10 }}>Aún no hay proyectos</h3>
                  <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>El feed de proyectos aparecerá aquí. ¡Sé el primero en publicar tu idea!</p>
                  <Link href="/forum/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", borderRadius: 12, fontWeight: 500, fontSize: 14, textDecoration: "none" }}>
                    <Briefcase size={16} /> Publicar proyecto
                  </Link>
                </div>
              </div>
            )}

          </main>
        </div >
      </div >

    </>
  )
}

export default function ForumPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ForumContent />
    </Suspense>
  )
}
