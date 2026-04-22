"use client"

import { useEffect, useState, Suspense, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
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
  isAnahuac?: boolean
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
    <div className={`rounded-3xl p-[clamp(16px,3vw,24px)] mb-4 transition-all duration-300 backdrop-blur-md border ${post.status === "validated" ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_12px_24px_rgba(16,185,129,0.06)]" : "bg-blue-500/5 border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] bg-gradient-to-br from-white/70 to-white/40"}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3.5 gap-3">
        <Link href={`/forum/profile/${post.authorUserId}`} className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-full bg-white border-[1.5px] border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
            <AvatarDisplay
              avatar={post.avatar}
              size={36}
              frame={post.inventory?.includes("2") ? "vip" : post.inventory?.includes("1") ? "ambassador" : null}
            />
          </div>
          <div>
            <span className="text-[14px] font-medium text-slate-900">{post.authorDisplay}</span>
            {post.isMe && <span className="text-[11px] text-blue-600 font-medium ml-1.5">Tú</span>}
            <div className="text-[11px] text-slate-400">{formatDate(post.createdAt)}</div>
          </div>
        </Link>
        <div className="flex gap-2.5 items-center flex-wrap justify-end">
          {!post.isMe && (
            <button 
              onClick={() => onTransferClick(post.authorUserId, post.authorDisplay)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all hover:bg-opacity-20 ${isAnahuac ? "bg-primary/10 text-primary border border-primary/20" : "bg-blue-500/10 text-blue-600 border border-blue-500/20"}`}
            >
              <Gift size={13} /> Regalar
            </button>
          )}
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${post.status === "validated" ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
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
              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-500/40 transition-opacity ${isValidating ? "cursor-wait opacity-70" : "cursor-pointer opacity-100"}`}
            >
              {isValidating ? "Validando..." : "Validar"}
            </button>
          )}
          {post.authorUserId === currentUserId && (
            <button
              onClick={() => onDeletePost(post.id)}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 cursor-pointer transition-all hover:bg-red-500/20"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Smart Goal always visible */}
      <div className="mb-2.5">
        <div className="text-[11px] font-medium text-blue-600 uppercase tracking-wider mb-1">Mi objetivo SMART</div>
        <p className="text-[14px] text-slate-900 m-0 leading-relaxed font-medium">{post.smartGoal}</p>
      </div>

      {/* Attachments (Images) */}
      {post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5 my-3">
          {post.attachments.map((att: any, idx: number) => (
            <div key={idx} className="rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
              <img src={att.url} alt="Evidencia" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(att.url, '_blank')} />
            </div>
          ))}
        </div>
      )}

      {/* Expandable fields */}
      {expanded && (
        <div className="border-t border-slate-100 pt-3 grid gap-2.5">
          {[["¿Qué hice hoy?", post.didToday], ["¿Qué aprendí?", post.learned], ["¿Qué cambiaré mañana?", post.changeTomorrow]].map(([label, val]) => (
            <div key={label}>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</div>
              <p className="text-[13px] text-slate-700 m-0 leading-relaxed">{val}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1.5 py-1 mt-2 text-[12px] font-medium text-slate-500 bg-transparent border-none cursor-pointer hover:text-slate-700 transition-colors">
        {expanded ? <><ChevronUp size={14} /> Menos detalles</> : <><ChevronDown size={14} /> Ver más detalles</>}
      </button>

      {/* Reactions */}
      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
        {REACTIONS.map(r => {
          const count = localReactions.filter(x => x.reactionType === r.type).length
          const active = myReaction?.reactionType === r.type
          return (
            <button
              key={r.type}
              onClick={() => handleLocalReact(r.type)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer ${active ? "font-bold border-[1.5px]" : "font-semibold border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
              style={active ? { borderColor: r.color, backgroundColor: r.bg, color: r.color } : {}}
            >
              {r.icon}
              {r.type}
              {count > 0 && <span className="font-medium">{count}</span>}
            </button>
          )
        })}

        <button onClick={() => setShowComments(s => !s)} className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium border border-slate-200 bg-white text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
          <MessageCircle size={13} />
          {localComments.length > 0 ? localComments.length : "Comentar"}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          {localComments.map(c => (
            <div key={c.id} className="flex gap-2 mb-2">
              <Link href={`/forum/profile/${c.userId}`} className="no-underline">
                <div className="w-6.5 h-6.5 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-[11px] font-medium text-slate-500">
                  {(c.authorDisplay || "?").charAt(0).toUpperCase()}
                </div>
              </Link>
              <div className="bg-[#FBFAF5] rounded-xl px-2.5 py-1.5 flex-1 shadow-sm">
                <Link href={`/forum/profile/${c.userId}`} className="inline-block no-underline">
                  <span className="text-[12px] font-medium text-slate-700 hover:text-blue-600 transition-colors">{c.authorDisplay || "Usuario"}</span>
                </Link>
                <p className="text-[13px] text-slate-700 mt-0.5 mb-0 leading-relaxed">{c.body}</p>
                {c.userId === currentUserId && (
                  <button 
                    onClick={() => onDeleteComment(post.id, c.id)}
                    className="bg-transparent border-none text-red-500 text-[10px] font-semibold py-1 mt-0.5 cursor-pointer hover:text-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Agrega un comentario..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleComment() }}
              className="flex-1 px-3 py-2 border-[1.5px] border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || sendingComment}
              className={`px-3 py-2 rounded-xl border-none transition-all ${commentText.trim() ? "bg-gradient-to-br from-slate-900 to-blue-900 text-white cursor-pointer shadow-md hover:-translate-y-0.5" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
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
export default function ForumContent() {
  const { user, loading, dbProfile } = useAuth()
  const userEmail = (user?.email || (user as any)?.emailAddresses?.[0]?.emailAddress || "").toLowerCase()
  const isAnahuac = userEmail.endsWith('@anahuac.mx') || userEmail.includes('.anahuac.mx') || userEmail.endsWith('@bizen.mx')
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
    document.body.style.background = "var(--bg-main)"
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <LoadingBar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-24 py-8 md:py-12 pb-32">

        {/* ── Page Header ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-5 mb-4">
              {isAnahuac && (
                <div className="shrink-0 bg-white p-2 rounded-2xl shadow-lg border border-orange-100 animate-in fade-in zoom-in duration-700">
                  <Image src="/anahuac-logo.png" alt="Anáhuac Logo" width={70} height={70} className="object-contain" />
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                Foro de la Comunidad
              </h1>
            </div>
            <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
              Comparte tus aprendizajes, resuelve dudas y colabora con otros usuarios en su camino financiero.
            </p>
          </div>
          <div className="shrink-0 flex items-center bg-white/50 backdrop-blur-md rounded-[2rem] p-4 border border-slate-200/60 shadow-lg shadow-slate-200/40">
            <StreakWidget streak={streak} showCalendar activeDays={weeklyActiveDays} />
          </div>
        </div>

        {/* ── Tab Selector Row ── */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-start sm:items-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex-nowrap shrink-0">
            <button 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${activeTab === "mision-del-dia" ? (isAnahuac ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]" : "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]") : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`} 
              onClick={() => setActiveTab("mision-del-dia")}
            >
              <Target size={18} /> Misión del día
            </button>
            <button 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${activeTab === "preguntas" ? (isAnahuac ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]" : "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]") : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`} 
              onClick={() => setActiveTab("preguntas")}
            >
              <MessageCircle size={18} /> Preguntas rápidas
            </button>
            <button 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${activeTab === "proyectos" ? (isAnahuac ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]" : "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]") : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`} 
              onClick={() => setActiveTab("proyectos")}
            >
              <Briefcase size={18} /> Proyectos
            </button>
          </div>

          <div className="hidden sm:block w-[1.5px] h-8 bg-slate-200 shrink-0" />

          <div className="flex gap-3 shrink-0">
            <Link href="/forum/bookmarks" className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-sm transition-all shadow-sm">
              <BookOpen size={18} /> Guardados
            </Link>
            {!isAdminOrTeacher && (
              <Link href="/forum/new" className={`flex items-center gap-2 px-6 py-3 !text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:-translate-y-0.5 ${isAnahuac ? "bg-primary hover:bg-orange-600 shadow-primary/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"}`}>
                <span className="!text-white">+</span> <span className="!text-white">Crear Tema</span>
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
                  <div className={`relative overflow-hidden mb-8 p-6 md:p-10 rounded-[32px] flex items-center justify-between flex-wrap gap-6 border border-white/10 shadow-xl ${isAnahuac ? 'bg-[#FF5900]' : 'bg-gradient-to-br from-slate-900 to-blue-900 shadow-blue-600/30'}`}>
                    {/* Decorative elements */}
                    <div className="absolute -top-[20%] -right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(96,165,250,0.15)0%,transparent_70%)] rounded-full" />
                    <div className="absolute -bottom-[10%] left-[5%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)0%,transparent_70%)] rounded-full" />
                    
                    <div className="flex-1 relative z-10">
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
                        <Target size={12} fill="#fbbf24" className="text-amber-400" />
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Reto de hoy</span>
                      </div>
                      <h2 className="text-[clamp(20px,3vw,28px)] font-semibold text-white m-0 mb-2.5 tracking-tight">{todayChallenge.title}</h2>
                      <p className="text-[clamp(14px,1.2vw,15px)] text-white/70 m-0 leading-relaxed max-w-[540px]">{todayChallenge.description}</p>
                    </div>
                    {!isAdminOrTeacher && (
                      <Link href="/mision-del-dia" className="relative z-10 flex items-center gap-2.5 px-7 py-3.5 bg-white text-slate-900 rounded-2xl font-semibold text-[15px] no-underline shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all hover:translate-y-[-2px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)]">
                        Participar ahora <ChevronRight size={18} />
                      </Link>
                    )}
                  </div>
                )}

                {/* Teacher summary */}
                {isTeacher && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
                    {[
                      { label: "Evidencias hoy", value: evidencePosts.length, color: isAnahuac ? "#FF5900" : "#0F62FE", bg: isAnahuac ? "rgba(255,89,0,0.05)" : "rgba(15,98,254,0.05)", icon: <NoteIcon size={24} color={isAnahuac ? "#FF5900" : "#0F62FE"} /> },
                      { label: "Validadas", value: validatedToday, color: "#10b981", bg: "rgba(16,185,129,0.05)", icon: <CheckCircle size={24} color="#10b981" /> },
                      { label: "Pendientes", value: pendingToday, color: "#F59E0B", bg: "rgba(245,158,11,0.05)", icon: <AlertCircle size={24} color="#F59E0B" /> },
                    ].map(({ label, value, color, bg, icon }) => (
                      <div key={label} className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center gap-4" style={{ backgroundColor: bg }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bg }}>{icon}</div>
                        <div>
                          <div className="text-2xl font-bold leading-none" style={{ color }}>{value}</div>
                          <div className="text-[13px] text-slate-500 font-medium mt-1">{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                  <select
                    value={evidenceSort}
                    onChange={e => setEvidenceSort(e.target.value as "new" | "validated")}
                    className="px-3 py-2 rounded-lg border-[1.5px] border-slate-200 text-[13px] font-medium text-slate-700 cursor-pointer bg-white"
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
                      className="px-3 py-2 rounded-lg border-[1.5px] border-slate-200 text-[13px] font-medium text-slate-700 cursor-pointer bg-white"
                    >
                      <option value="school">Mi escuela</option>
                      <option value="all">Todas</option>
                    </select>
                  )}
                  <span className="text-[13px] text-slate-400 ml-auto">
                    {evidencePosts.length} publicaciones
                  </span>
                </div>

                {/* Evidence feed */}
                {loadingEvidence ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-[140px] rounded-2xl bg-slate-100 bg-[linear-gradient(90deg,#f1f5f9_25%,#e2e8f0_50%,#f1f5f9_75%)] bg-[length:200%_100%] animate-[shimmer_1.5s_linear_infinite]" />
                    ))}
                  </div>
                ) : sortedPosts.length === 0 ? (
                  <div className="text-center p-6 md:py-16 md:px-6 bg-white rounded-2xl border-[1.5px] border-slate-100">
                    <div className="flex justify-center mb-4">
                      <NoteIcon size={48} color="#94a3b8" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-900 mb-2.5">Sé el primero en publicar tu evidencia</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      Completa el reto de hoy y comparte tu aprendizaje con tu grupo.
                    </p>
                    {!isAdminOrTeacher && (
                      <Link href="/mision-del-dia" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-medium no-underline text-sm shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-transform hover:translate-y-[-1px]">
                        <Target size={16} /> Hacer el reto de hoy
                      </Link>
                    )}
                    {isAdminOrTeacher && (
                      <p className="text-[13px] font-medium text-slate-400 mt-4">
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
                      isAnahuac={isAnahuac}
                    />
                  ))
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════
                TAB 2 — PREGUNTAS RÁPIDAS (existing forum)
            ════════════════════════════════════════════ */}
            {activeTab === "preguntas" && (
              <div className="w-full">
                {/* Topic selector row */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                   <button
                    className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${selectedTopic === "all" ? (isAnahuac ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md") : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                    onClick={() => setSelectedTopic("all")}
                  >
                    #Todos
                  </button>

                  {(topics.length > 0 ? topics.map(t => t.slug) : ["ahorro", "presupuesto", "deuda", "inversion", "emprendimiento"]).map(tag => (
                    <button 
                      key={tag} 
                      className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${selectedTopic === tag ? (isAnahuac ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md") : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      onClick={() => setSelectedTopic(tag)}>
                      #{tag}
                    </button>
                  ))}

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="ml-auto px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-blue-500 hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <option value="new">Más recientes</option>
                    <option value="top">Más votados</option>
                    <option value="unanswered">Sin responder</option>
                  </select>
                </div>

                {fetchError && (
                  <div className="flex items-center gap-3 p-4 mb-8 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-100">
                    <AlertCircle size={20} className="shrink-0" />
                    {fetchError}
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  {loadingData && threads.length === 0 ? (
                    <ThreadCardSkeleton />
                  ) : threads.length === 0 ? (
                    <div className="text-center p-16 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                      <p className="text-slate-500 font-bold text-lg">No hay preguntas en este tema todavía. ¡Sé el primero!</p>
                    </div>
                  ) : (
                    threads.map((thread, i) => {
                      const tc = getTopicColors(thread.topic?.slug || "")
                      const accentBorder = thread.isPinned ? "#f59e0b" : tc.accent
                      return (
                        <Link 
                          key={thread.id} 
                          href={`/forum/thread/${thread.id}`} 
                          className="group flex flex-col md:flex-row items-stretch bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                          style={{ borderLeftWidth: "6px", borderLeftColor: accentBorder, animationDelay: `${i * 50}ms` }}
                        >
                          <div className="flex items-stretch w-full">
                            <div className="w-20 sm:w-28 flex flex-col items-center justify-center border-r-[1.5px] border-slate-50 bg-slate-50/50 shrink-0 py-6">
                              <div className="text-xl sm:text-2xl font-black text-blue-700">{thread.score}</div>
                              <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">votos</div>
                            </div>
                            <div className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8">
                              <div className="flex items-start gap-3 mb-4">
                                <h3 className={`flex-1 text-lg sm:text-xl font-black text-slate-800 leading-snug transition-colors line-clamp-2 ${isAnahuac ? 'group-hover:text-primary' : 'group-hover:text-blue-600'}`}>
                                  {thread.title}
                                </h3>
                                {thread.status !== 'open' && (
                                  <span className={`px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg whitespace-nowrap shrink-0 ${
                                    thread.status === "resolved" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                  }`}>
                                    {thread.status}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 flex-wrap mt-auto">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50" style={{ backgroundColor: tc.light }}>
                                  <span className="text-xs font-black uppercase tracking-wide" style={{ color: tc.accent }}>{thread.topic.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                                      <AvatarDisplay avatar={thread.author.avatar} size={28} />
                                    </div>
                                    <span className="font-bold text-slate-700">{thread.author.nickname}</span>
                                  </div>
                                  <span className="opacity-50 text-[10px]">•</span>
                                  <span>{formatDate(thread.createdAt)}</span>
                                  <span className="opacity-50 text-[10px]">•</span>
                                  <div className="flex items-center gap-1.5 font-bold text-slate-600">
                                    <MessageCircle size={16} className="text-slate-400" />
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
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full" />
                  <div className="flex-1 relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white font-black text-[10px] uppercase tracking-widest mb-4">
                      Esta semana
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 flex items-center justify-center md:justify-start gap-3">
                      <RocketIcon size={32} className="text-white" />
                      Pitch Week
                    </h2>
                    <p className="text-white/80 font-medium text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                      Comparte tu idea de negocio y recibe feedback invaluable de la comunidad de BIZEN.
                    </p>
                  </div>
                  <Link href="/forum/new" className="relative z-10 px-8 py-4 bg-white text-indigo-700 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all w-full md:w-auto text-center">
                    Publicar mi idea
                  </Link>
                </div>

                {/* Placeholder thread list for projects */}
                <div className="text-center p-16 md:p-24 bg-white rounded-[2.5rem] border-[1.5px] border-slate-100 shadow-sm">
                  <div className="w-24 h-24 mx-auto mb-6 bg-emerald-50 flex items-center justify-center rounded-[2rem]">
                    <LeafIcon size={48} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3">Las mentes maestras están calladas</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                    El feed de emprendimiento está esperando. ¡Sé el fundador pionero y publica tu primer proyecto hoy!
                  </p>
                  <Link href="/forum/new" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-black text-sm uppercase tracking-widest rounded-2xl transition-all">
                    <Briefcase size={18} /> Iniciar un proyecto
                  </Link>
                </div>
              </div>
            )}

          </main>
    </div>
  )
}

// (End of file)
