"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { CommentSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { ThumbsUpIcon, ThumbsDownIcon } from "@/components/CustomIcons"
import PageLoader from "@/components/PageLoader"

interface ThreadDetail {
  id: string
  title: string
  body: string
  status: 'open' | 'resolved' | 'locked'
  score: number
  viewCount: number
  commentCount: number
  acceptedCommentId: string | null
  createdAt: string
  author: {
    userId: string
    nickname: string
    reputation: number
    level: number
    isMinor?: boolean
    avatar?: any
    inventory?: string[]
  }
  topic: {
    id: string
    name: string
    slug: string
    icon: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  userVote: number | null
  isBookmarked: boolean
  isFollowing: boolean
}

interface Comment {
  id: string
  body: string
  score: number
  isAccepted: boolean
  createdAt: string
  replyCount?: number
  author: {
    userId: string
    nickname: string
    reputation: number
    level: number
    isMinor?: boolean
    avatar?: any
    inventory?: string[]
  }
  replies?: Comment[]
  userVote: number | null
}

export default function ThreadDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const threadId = params?.id as string

  const [thread, setThread] = useState<ThreadDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [pagination, setPagination] = useState<{ total: number; limit: number; skip: number; hasMore: boolean } | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set())
  const [loadedReplies, setLoadedReplies] = useState<Set<string>>(new Set())

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
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
    if (threadId) {
      fetchThread()
    }
  }, [user, loading, router, threadId])

  const fetchThread = async (skip = 0, limit = 20) => {
    try {
      setLoadingData(true)
      // Don't load replies initially - they will be loaded on demand
      const response = await fetch(`/api/forum/threads/${threadId}?skip=${skip}&limit=${limit}&includeReplies=false`)
      if (response.ok) {
        const data = await response.json()
        setThread(data)
        // If loading more comments, append them; otherwise replace
        if (skip > 0) {
          setComments(prev => [...prev, ...(data.comments || [])])
        } else {
          setComments(data.comments || [])
        }
        return data.pagination
      }
    } catch (error) {
      console.error("Error fetching thread:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const fetchCommentReplies = async (commentId: string) => {
    if (loadingReplies.has(commentId) || loadedReplies.has(commentId)) {
      return // Already loading or loaded
    }

    try {
      setLoadingReplies(prev => new Set(prev).add(commentId))
      const response = await fetch(`/api/forum/comments/${commentId}?limit=20`)
      if (response.ok) {
        const data = await response.json()
        // Update the comment in the comments array with its replies
        setComments(prev => prev.map(comment =>
          comment.id === commentId
            ? { ...comment, replies: data.replies }
            : comment
        ))
        setLoadedReplies(prev => new Set(prev).add(commentId))
        return data.replies
      }
    } catch (error) {
      console.error("Error fetching comment replies:", error)
    } finally {
      setLoadingReplies(prev => {
        const next = new Set(prev)
        next.delete(commentId)
        return next
      })
    }
  }

  const handleVote = async (type: 'thread' | 'comment', targetId: string, value: number) => {
    try {
      const response = await fetch('/api/forum/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: type, targetId, value })
      })
      if (response.ok) {
        await fetchThread()
      }
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const handleBookmark = async () => {
    try {
      const method = thread?.isBookmarked ? 'DELETE' : 'POST'
      const response = await fetch('/api/forum/bookmarks', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId })
      })
      if (response.ok) {
        await fetchThread()
      }
    } catch (error) {
      console.error("Error bookmarking:", error)
    }
  }

  const handleFollow = async () => {
    try {
      const method = thread?.isFollowing ? 'DELETE' : 'POST'
      const response = await fetch('/api/forum/follows', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId })
      })
      if (response.ok) {
        await fetchThread()
      }
    } catch (error) {
      console.error("Error following:", error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tema? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/forum/threads/${threadId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        router.push('/forum')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar el tema')
      }
    } catch (error) {
      console.error("Error deleting thread:", error)
      alert('Error al eliminar el tema')
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/forum/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          parentCommentId: replyTo,
          body: newComment.trim()
        })
      })

      if (response.ok) {
        setNewComment("")
        setReplyTo(null)
        await fetchThread()
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAcceptAnswer = async (commentId: string) => {
    try {
      const response = await fetch('/api/forum/accepted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, commentId })
      })
      if (response.ok) {
        await fetchThread()
      }
    } catch (error) {
      console.error("Error accepting answer:", error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return
    }

    try {
      const response = await fetch(`/api/forum/comments?id=${commentId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchThread()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar el comentario')
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert('Error al eliminar el comentario')
    }
  }

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? "ml-5 md:ml-10" : "ml-0"} mb-4`}>
      <div className={`p-4 md:p-5 rounded-xl border-2 backdrop-blur-xl shadow-sm ${comment.isAccepted ? 'bg-green-500/10 border-green-500' : 'bg-white/60 border-white/60'}`}>
        {comment.isAccepted && (
          <div className="mb-3 px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-medium inline-block">
            Respuesta Aceptada
          </div>
        )}

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* Vote Buttons */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={() => handleVote('comment', comment.id, 1)}
              className={`p-1.5 rounded-md min-w-[32px] min-h-[32px] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 ${comment.userVote === 1 ? 'border-blue-600 bg-blue-50/50' : 'border-transparent'}`}
            >
              <ThumbsUpIcon size={20} color={comment.userVote === 1 ? "#2563EB" : "#94a3b8"} />
            </button>
            <span className="text-sm md:text-base font-semibold text-slate-700">{comment.score}</span>
            <button
              onClick={() => handleVote('comment', comment.id, -1)}
              className={`p-1.5 rounded-md min-w-[32px] min-h-[32px] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 ${comment.userVote === -1 ? 'border-blue-600 bg-blue-50/50' : 'border-transparent'}`}
            >
              <ThumbsDownIcon size={20} color={comment.userVote === -1 ? "#2563EB" : "#94a3b8"} />
            </button>
          </div>

          {/* Comment Content */}
          <div className="flex-1 w-full">
            <div className="text-[14px] md:text-[15px] leading-relaxed text-slate-700 mb-3 font-medium whitespace-pre-wrap break-words">
              {comment.body}
            </div>

            <div className="flex gap-2 md:gap-4 items-center text-xs md:text-[13px] text-slate-500 font-medium flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                  <AvatarDisplay
                    avatar={comment.author.avatar}
                    size={18}
                    frame={comment.author.inventory?.includes("2") ? "vip" : comment.author.inventory?.includes("1") ? "ambassador" : null}
                  />
                </div>
                <Link href={`/forum/profile/${comment.author.userId}`} className="text-blue-900 font-semibold hover:underline border-none">{comment.author.nickname}</Link> <span className="text-slate-400">({comment.author.reputation} pts)</span>
              </div>
              <span className="text-slate-400">&bull;</span>
              <span>{new Date(comment.createdAt).toLocaleDateString('es-ES')}</span>
              <button
                onClick={() => setReplyTo(comment.id)}
                className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Responder
              </button>
              {thread?.author.userId === user?.id && !comment.isAccepted && (
                <button
                  onClick={() => handleAcceptAnswer(comment.id)}
                  className="text-green-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Aceptar Respuesta
                </button>
              )}
              {comment.author.userId === user?.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 md:mt-4">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}

      {/* Load Replies Button */}
      {(!comment.replies || comment.replies.length === 0) && comment.replyCount && comment.replyCount > 0 && !loadedReplies.has(comment.id) && (
        <div className="mt-3">
          <button
            onClick={() => fetchCommentReplies(comment.id)}
            disabled={loadingReplies.has(comment.id)}
            className={`w-full px-4 py-2 md:py-3 rounded-lg border border-blue-900 bg-transparent text-blue-900 text-xs md:text-sm font-medium transition-colors text-center whitespace-nowrap overflow-hidden text-ellipsis ${loadingReplies.has(comment.id) ? "cursor-wait" : "cursor-pointer hover:bg-blue-900 hover:text-white"}`}
          >
            {loadingReplies.has(comment.id)
              ? "Cargando..."
              : `Ver ${comment.replyCount} ${comment.replyCount === 1 ? 'respuesta' : 'respuestas'}`
            }
          </button>
        </div>
      )}
    </div>
  )

  if (loading) {
    return <PageLoader />
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-3 pb-28 px-3 md:py-10 md:px-6 lg:py-6 lg:px-16">
      <LoadingBar />
      <main className="relative z-10 w-full max-w-[1200px] mx-auto box-border">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/forum" className="no-underline">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/10 backdrop-blur-md border-2 border-blue-900/15 rounded-lg text-sm font-medium text-blue-900 cursor-pointer transition-all shadow-[0_2px_8px_rgba(30,58,138,0.05)] hover:bg-blue-900/15 hover:border-blue-900/25"
              >
                ← Volver al Foro
              </button>
            </Link>
          </div>

          {/* Thread Card */}
          {loadingData || !thread ? (
            <div className="p-8 bg-white/40 backdrop-blur-xl rounded-3xl border-2 border-slate-300/30 mb-8 animate-pulse">
              <div className="h-10 bg-slate-400/30 rounded-lg mb-5 w-4/5" />
              <div className="h-[200px] bg-slate-400/20 rounded-xl" />
            </div>
          ) : (
            <div className="p-6 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-[0_8px_32px_rgba(30,58,138,0.05)] mb-8 animate-[fadeIn_0.4s_ease]">
              <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight leading-snug">
                {thread.title}
              </h1>

              {/* Tags */}
              {thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {thread.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-blue-100/50 text-blue-900 text-sm font-medium rounded-md"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-[13px] md:text-sm text-slate-500 font-medium mb-5 pb-5 border-b border-slate-200/60">
                <span>
                  por <Link href={`/forum/profile/${thread.author.userId}`} className="text-blue-900 hover:underline">{thread.author.nickname}</Link>
                </span>
                <span>Nivel {thread.author.level}</span>
                <span>{thread.author.reputation} pts</span>
                <span>{new Date(thread.createdAt).toLocaleDateString('es-ES')}</span>
                <span>{thread.viewCount} vistas</span>
              </div>

              {/* Content */}
              <div className="text-[15px] md:text-base leading-relaxed text-slate-700 font-medium whitespace-pre-wrap mb-6">
                {thread.body}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleVote('thread', thread.id, 1)}
                  className={`flex items-center gap-2 px-4 py-2 bg-white/60 text-slate-700 text-sm font-medium rounded-lg cursor-pointer transition-all border-2 ${thread.userVote === 1 ? 'border-blue-900 shadow-[0_2px_8px_rgba(30,58,138,0.2)]' : 'border-transparent'} hover:scale-[0.98] active:scale-95`}
                >
                  <ThumbsUpIcon size={20} color={thread.userVote === 1 ? "#0B71FE" : "#94a3b8"} />
                  {thread.score > 0 && thread.score}
                </button>

                <button
                  onClick={() => handleVote('thread', thread.id, -1)}
                  className={`flex items-center gap-2 px-4 py-2 bg-white/60 text-slate-700 text-sm font-medium rounded-lg cursor-pointer transition-all border-2 ${thread.userVote === -1 ? 'border-blue-900 shadow-[0_2px_8px_rgba(11,113,254,0.3)]' : 'border-transparent'} hover:scale-[0.98] active:scale-95`}
                >
                  <ThumbsDownIcon size={20} color={thread.userVote === -1 ? "#0B71FE" : "#94a3b8"} />
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 bg-white/60 text-slate-700 text-sm font-medium rounded-lg cursor-pointer transition-all border-2 ${thread.isBookmarked ? 'border-blue-900 shadow-[0_2px_8px_rgba(30,58,138,0.2)]' : 'border-transparent'} hover:scale-[0.98] active:scale-95`}
                >
                  <span className={`text-base bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent transition-transform duration-200 ${thread.isBookmarked ? 'scale-125' : 'scale-100'}`}>
                    {thread.isBookmarked ? "★" : "☆"}
                  </span>
                  {thread.isBookmarked ? "Guardado" : "Guardar"}
                </button>

                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-4 py-2 bg-white/60 text-slate-700 text-sm font-medium rounded-lg cursor-pointer transition-all border-2 ${thread.isFollowing ? 'border-blue-900 shadow-[0_2px_8px_rgba(30,58,138,0.2)]' : 'border-transparent'} hover:scale-[0.98] active:scale-95`}
                >
                  {thread.isFollowing ? "Siguiendo" : "Seguir hilo"}
                </button>

                {thread.author.userId === user?.id && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-white/60 text-red-600 text-sm font-medium rounded-lg cursor-pointer transition-all border-2 border-transparent hover:bg-red-50 hover:border-red-600 hover:scale-[0.98] active:scale-95 ml-auto md:ml-0"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <h2 className="text-xl md:text-2xl font-semibold text-blue-900 mb-6 drop-shadow-sm">
            {comments.length} Respuestas
          </h2>

          {/* Comments List */}
          <div className="mb-8 animate-[fadeIn_0.5s_ease_0.2s_both]">
            {loadingData ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : (
              comments.map(comment => renderComment(comment))
            )}
          </div>

          {/* Reply Form */}
          {!loadingData && thread && thread.status !== 'locked' && (
            <div className="p-6 md:p-8 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_8px_32px_rgba(30,58,138,0.05)] mt-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 drop-shadow-sm">
                {replyTo ? "Responder al comentario" : "Tu respuesta"}
              </h3>

              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="¿Qué quieres compartir? Escribe tu respuesta o ideas..."
                  className="w-full min-h-[150px] p-4 text-[15px] font-medium border-2 border-slate-200 focus:border-blue-500 rounded-2xl bg-white/70 text-slate-800 resize-y mb-4 box-border outline-none transition-colors shadow-sm placeholder:text-slate-400"
                  required
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className={`px-6 py-3.5 rounded-xl text-[15px] font-semibold text-white shadow-md transition-all ${submitting || !newComment.trim() ? "bg-slate-400 cursor-not-allowed shadow-none" : "bg-gradient-to-br from-blue-600 to-blue-500 hover:scale-[1.02] active:scale-95 shadow-[0_4px_12px_rgba(37,99,235,0.3)] cursor-pointer"}`}
                  >
                    {submitting ? "Enviando..." : "Publicar Respuesta"}
                  </button>

                  {replyTo && (
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="px-6 py-3.5 bg-white/60 text-slate-700 hover:bg-slate-200 border-none rounded-xl text-[15px] font-medium cursor-pointer transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {!loadingData && thread && thread.status === 'locked' && (
            <div className="p-6 text-center bg-red-50/50 backdrop-blur-xl rounded-2xl border border-red-200 shadow-sm mt-4">
              <div className="text-lg font-semibold mb-2 text-red-600">Cerrado</div>
              <div className="text-[15px] font-medium text-red-600">
                Este tema está cerrado y no acepta nuevas respuestas
              </div>
            </div>
          )}
        </main>
      </div>
  )
}
