"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { CommentSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"

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
      router.replace("/login")
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

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} style={{
      marginLeft: depth > 0 ? "clamp(20px, 5vw, 40px)" : 0,
      marginBottom: "clamp(12px, 3vw, 16px)"
    }}>
      <div style={{
        padding: "clamp(16px, 4vw, 20px)",
        background: comment.isAccepted ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(20px)",
        borderRadius: "clamp(8px, 2vw, 12px)",
        border: comment.isAccepted ? "2px solid #10B981" : "2px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)"
      }}>
        {comment.isAccepted && (
          <div style={{
            marginBottom: "clamp(10px, 2.5vw, 12px)",
            padding: "clamp(5px, 1.5vw, 6px) clamp(10px, 2.5vw, 12px)",
            background: "#10B981",
            color: "white",
            borderRadius: "clamp(4px, 1vw, 6px)",
            fontSize: "clamp(11px, 2.5vw, 12px)",
            fontWeight: 700,
            display: "inline-block"
          }}>
            Respuesta Aceptada
          </div>
        )}

        <div style={{ display: "flex", gap: "clamp(12px, 3vw, 16px)", flexWrap: "wrap" }}>
          {/* Vote Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(2px, 1vw, 4px)"
          }}>
            <button
              onClick={() => handleVote('comment', comment.id, 1)}
              style={{
                background: "transparent",
                border: comment.userVote === 1 ? "2px solid #0B71FE" : "2px solid transparent",
                fontSize: "clamp(18px, 4vw, 20px)",
                cursor: "pointer",
                padding: "clamp(3px, 1vw, 4px)",
                borderRadius: "clamp(3px, 1vw, 4px)",
                transition: "all 0.2s ease",
                minWidth: "clamp(32px, 8vw, 40px)",
                minHeight: "clamp(32px, 8vw, 40px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.9)"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <span style={{ 
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                transform: comment.userVote === 1 ? "scale(1.3)" : "scale(1)",
                transition: "transform 0.2s ease"
              }}>
                👍
              </span>
            </button>
            <span style={{ fontSize: "clamp(14px, 3.5vw, 16px)", fontWeight: 700, color: "#374151" }}>
              {comment.score}
            </span>
            <button
              onClick={() => handleVote('comment', comment.id, -1)}
              style={{
                background: "transparent",
                border: comment.userVote === -1 ? "2px solid #0B71FE" : "2px solid transparent",
                fontSize: "clamp(18px, 4vw, 20px)",
                cursor: "pointer",
                padding: "clamp(3px, 1vw, 4px)",
                borderRadius: "clamp(3px, 1vw, 4px)",
                transition: "all 0.2s ease",
                minWidth: "clamp(32px, 8vw, 40px)",
                minHeight: "clamp(32px, 8vw, 40px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.9)"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <span style={{ 
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                transform: comment.userVote === -1 ? "scale(1.3)" : "scale(1)",
                transition: "transform 0.2s ease"
              }}>
                👎
              </span>
            </button>
          </div>

          {/* Comment Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "clamp(13px, 3vw, 14px)",
              lineHeight: 1.7,
              color: "#374151",
              marginBottom: "clamp(10px, 2.5vw, 12px)",
              fontWeight: 500,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word"
            }}>
              {comment.body}
            </div>

            <div style={{
              display: "flex",
              gap: "clamp(8px, 2vw, 16px)",
              alignItems: "center",
              fontSize: "clamp(11px, 2.5vw, 12px)",
              color: "#9CA3AF",
              fontWeight: 600,
              flexWrap: "wrap"
            }}>
              <span>
                <Link href={`/forum/profile/${comment.author.userId}`} style={{ color: "#0F62FE", textDecoration: "none", fontWeight: 700 }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline" }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none" }}>{comment.author.nickname}</Link> ({comment.author.reputation} pts)
              </span>
              <span>{new Date(comment.createdAt).toLocaleDateString('es-ES')}</span>
              <button
                onClick={() => setReplyTo(comment.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0F62FE",
                  cursor: "pointer",
                  fontSize: "clamp(11px, 2.5vw, 12px)",
                  fontWeight: 700,
                  padding: "clamp(4px, 1vw, 6px)",
                  whiteSpace: "nowrap"
                }}
              >
                Responder
              </button>
              {thread?.author.userId === user?.id && !comment.isAccepted && (
                <button
                  onClick={() => handleAcceptAnswer(comment.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#10B981",
                    cursor: "pointer",
                    fontSize: "clamp(11px, 2.5vw, 12px)",
                    fontWeight: 700,
                    padding: "clamp(4px, 1vw, 6px)",
                    whiteSpace: "nowrap"
                  }}
                >
                  Aceptar Respuesta
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: "clamp(12px, 3vw, 16px)" }}>
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
      
      {/* Load Replies Button */}
      {(!comment.replies || comment.replies.length === 0) && comment.replyCount && comment.replyCount > 0 && !loadedReplies.has(comment.id) && (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => fetchCommentReplies(comment.id)}
            disabled={loadingReplies.has(comment.id)}
            style={{
              background: "transparent",
              border: "1px solid #0F62FE",
              color: "#0F62FE",
              padding: "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)",
              borderRadius: 6,
              cursor: loadingReplies.has(comment.id) ? "wait" : "pointer",
              fontSize: "clamp(11px, 2.5vw, 14px)",
              fontWeight: 600,
              transition: "all 0.2s ease",
              width: "100%",
              maxWidth: "100%",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
            onMouseEnter={(e) => {
              if (!loadingReplies.has(comment.id)) {
                e.currentTarget.style.background = "#0F62FE"
                e.currentTarget.style.color = "#fff"
              }
            }}
            onMouseLeave={(e) => {
              if (!loadingReplies.has(comment.id)) {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "#0F62FE"
              }
            }}
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
    return null // Quick flash
  }

  if (!user) return null

  return (
    <>
      <style>{`
        /* Fix app-shell and app-scroll on mobile for forum thread */
        @media (max-width: 767px) {
          .app-shell,
          .app-scroll,
          .app-main {
            width: 100% !important;
            max-width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
            background-color: #ffffff !important;
          }
        }
        
        /* Mobile (≤767px): Full width */
        @media (max-width: 767px) {
          .forum-thread-outer {
            width: 100% !important;
            max-width: 100vw !important;
            padding-top: 20px !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 !important;
          }
          .forum-thread-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
            box-sizing: border-box !important;
          }
        }
        
        /* Tablet/iPad (768px-1160px): Account for right sidebar (narrow 160px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .forum-thread-outer {
            width: calc(100% - 160px) !important;
            max-width: calc(100% - 160px) !important;
          }
          .forum-thread-container {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        
        /* Desktop (≥1161px): Account for right sidebar (full width 280px) */
        @media (min-width: 1161px) {
          .forum-thread-outer {
            width: calc(100% - 280px) !important;
            max-width: calc(100% - 280px) !important;
          }
          .forum-thread-container {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
      `}</style>
      <LoadingBar />
      <div className="forum-thread-outer" style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: "clamp(20px, 4vw, 40px)",
        paddingBottom: "clamp(80px, 12vw, 120px)",
        fontFamily: "Montserrat, sans-serif",
        background: "#ffffff",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <main className="forum-thread-container" style={{ 
        position: "relative",
        width: "100%",
        maxWidth: "100%", 
        margin: "0", 
        padding: "clamp(16px, 4vw, 40px)",
        zIndex: 1,
        boxSizing: "border-box"
      }}>
        {/* Back Button */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/forum" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 16px",
              background: "rgba(15, 98, 254, 0.15)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(15, 98, 254, 0.3)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "#0F62FE",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(15, 98, 254, 0.1)",
              fontFamily: "Montserrat, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(15, 98, 254, 0.25)"
              e.currentTarget.style.borderColor = "rgba(15, 98, 254, 0.5)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 98, 254, 0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(15, 98, 254, 0.15)"
              e.currentTarget.style.borderColor = "rgba(15, 98, 254, 0.3)"
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 98, 254, 0.1)"
            }}
            >
              ← Volver al Foro
            </button>
          </Link>
        </div>

        {/* Thread Card */}
        {loadingData || !thread ? (
          <div style={{
            padding: 32,
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            marginBottom: 32,
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          }}>
            <div style={{
              height: 40,
              background: "rgba(156, 163, 175, 0.3)",
              borderRadius: 8,
              marginBottom: 20,
              width: "80%"
            }} />
            <div style={{
              height: 200,
              background: "rgba(156, 163, 175, 0.2)",
              borderRadius: 12
            }} />
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}</style>
          </div>
        ) : (
        <div style={{
          padding: 32,
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "2px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
          marginBottom: 32,
          animation: "fadeIn 0.4s ease"
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <h1 style={{ 
            margin: "0 0 16px", 
            fontSize: "clamp(24px, 5vw, 32px)", 
            fontWeight: 800,
            color: "#1E40AF"
          }}>
            {thread.title}
          </h1>

          {/* Tags */}
          {thread.tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {thread.tags.map(tag => (
                <span
                  key={tag.id}
                  style={{
                    padding: "4px 12px",
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "#0F62FE",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 6
                  }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div style={{
            display: "flex",
            gap: 16,
            fontSize: 13,
            color: "#9CA3AF",
            fontWeight: 600,
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
          }}>
            <span>
              por <Link href={`/forum/profile/${thread.author.userId}`} style={{ color: "#0F62FE", textDecoration: "none", fontWeight: 700 }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline" }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none" }}>{thread.author.nickname}</Link>
            </span>
            <span>Nivel {thread.author.level}</span>
            <span>{thread.author.reputation} pts</span>
            <span>{new Date(thread.createdAt).toLocaleDateString('es-ES')}</span>
            <span>{thread.viewCount} vistas</span>
          </div>

          {/* Content */}
          <div style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: "#374151",
            marginBottom: 24,
            fontWeight: 500,
            whiteSpace: "pre-wrap"
          }}>
            {thread.body}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => handleVote('thread', thread.id, 1)}
              style={{
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.6)",
                color: "#374151",
                border: thread.userVote === 1 ? "2px solid #0B71FE" : "2px solid transparent",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s ease",
                boxShadow: thread.userVote === 1 ? "0 2px 8px rgba(11, 113, 254, 0.3)" : "none"
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <span style={{ 
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                fontSize: 18,
                transform: thread.userVote === 1 ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.2s ease"
              }}>
                👍
              </span> {thread.score > 0 && thread.score}
            </button>
            
            <button
              onClick={() => handleVote('thread', thread.id, -1)}
              style={{
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.6)",
                color: "#374151",
                border: thread.userVote === -1 ? "2px solid #0B71FE" : "2px solid transparent",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.2s ease",
                boxShadow: thread.userVote === -1 ? "0 2px 8px rgba(11, 113, 254, 0.3)" : "none"
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <span style={{ 
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                fontSize: 18,
                transform: thread.userVote === -1 ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.2s ease"
              }}>
                👎
              </span>
            </button>

            <button
              onClick={handleBookmark}
              style={{
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.6)",
                color: "#374151",
                border: thread.isBookmarked ? "2px solid #0B71FE" : "2px solid transparent",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s ease",
                boxShadow: thread.isBookmarked ? "0 2px 8px rgba(11, 113, 254, 0.3)" : "none"
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <span style={{ 
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                fontSize: 16,
                transform: thread.isBookmarked ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.2s ease"
              }}>
                {thread.isBookmarked ? "★" : "☆"}
              </span>
              {thread.isBookmarked ? "Guardado" : "Guardar"}
            </button>

            <button
              onClick={handleFollow}
              style={{
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.6)",
                color: "#374151",
                border: thread.isFollowing ? "2px solid #0B71FE" : "2px solid transparent",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.2s ease",
                boxShadow: thread.isFollowing ? "0 2px 8px rgba(11, 113, 254, 0.3)" : "none"
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              {thread.isFollowing ? "Siguiendo" : "Seguir"}
            </button>

            {thread.author.userId === user?.id && (
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 16px",
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#EF4444",
                  border: "2px solid transparent",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"
                  e.currentTarget.style.borderColor = "#EF4444"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)"
                  e.currentTarget.style.borderColor = "transparent"
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.95)"
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
        )}

        {/* Comments Section */}
        <h2 style={{ 
          margin: "0 0 20px", 
          fontSize: 22, 
          fontWeight: 700,
          color: "#1E40AF"
        }}>
          {comments.length} Respuestas
        </h2>

        {/* Comments List */}
        <div style={{ 
          marginBottom: 32,
          animation: "fadeIn 0.5s ease 0.2s both"
        }}>
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
          <div style={{
            padding: 32,
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
          }}>
            <h3 style={{ 
              margin: "0 0 16px", 
              fontSize: 18, 
              fontWeight: 700,
              color: "#1E40AF"
            }}>
              {replyTo ? "Responder al comentario" : "Tu respuesta"}
            </h3>

            <form onSubmit={handleSubmitComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comparte tu respuesta o ideas..."
                style={{
                  width: "100%",
                  minHeight: 150,
                  padding: 16,
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#374151",
                  resize: "vertical",
                  marginBottom: 16,
                  boxSizing: "border-box"
                }}
                required
              />

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  style={{
                    padding: "14px 28px",
                    background: submitting || !newComment.trim() 
                      ? "#9CA3AF" 
                      : "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: submitting || !newComment.trim() ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                    fontFamily: "Montserrat, sans-serif"
                  }}
                >
                  {submitting ? "Enviando..." : "Publicar Respuesta"}
                </button>

                {replyTo && (
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    style={{
                      padding: "14px 28px",
                      background: "rgba(255, 255, 255, 0.6)",
                      color: "#374151",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif"
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {!loadingData && thread && thread.status === 'locked' && (
          <div style={{
            padding: 24,
            textAlign: "center",
            background: "rgba(239, 68, 68, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: 16,
            border: "2px solid rgba(239, 68, 68, 0.3)"
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#DC2626" }}>
              Este tema está cerrado y no acepta nuevas respuestas
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  )
}
