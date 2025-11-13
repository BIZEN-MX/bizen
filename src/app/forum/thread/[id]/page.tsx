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
  author: {
    userId: string
    nickname: string
    reputation: number
    level: number
  }
  replies: Comment[]
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

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
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

  const fetchThread = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/forum/threads/${threadId}`)
      if (response.ok) {
        const data = await response.json()
        setThread(data)
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching thread:", error)
    } finally {
      setLoadingData(false)
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
      marginLeft: depth > 0 ? 40 : 0,
      marginBottom: 16
    }}>
      <div style={{
        padding: 20,
        background: comment.isAccepted ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(20px)",
        borderRadius: 12,
        border: comment.isAccepted ? "2px solid #10B981" : "2px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)"
      }}>
        {comment.isAccepted && (
          <div style={{
            marginBottom: 12,
            padding: "6px 12px",
            background: "#10B981",
            color: "white",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            display: "inline-block"
          }}>
            Respuesta Aceptada
          </div>
        )}

        <div style={{ display: "flex", gap: 16 }}>
          {/* Vote Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4
          }}>
            <button
              onClick={() => handleVote('comment', comment.id, 1)}
              style={{
                background: comment.userVote === 1 ? "#10B981" : "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                padding: 4
              }}
            >
              ▲
            </button>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>
              {comment.score}
            </span>
            <button
              onClick={() => handleVote('comment', comment.id, -1)}
              style={{
                background: comment.userVote === -1 ? "#EF4444" : "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                padding: 4
              }}
            >
              ▼
            </button>
          </div>

          {/* Comment Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#374151",
              marginBottom: 12,
              fontWeight: 500,
              whiteSpace: "pre-wrap"
            }}>
              {comment.body}
            </div>

            <div style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              fontSize: 12,
              color: "#9CA3AF",
              fontWeight: 600
            }}>
              <span>{comment.author.nickname} ({comment.author.reputation} pts)</span>
              <span>{new Date(comment.createdAt).toLocaleDateString('es-ES')}</span>
              <button
                onClick={() => setReplyTo(comment.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0F62FE",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700
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
                  fontSize: 12,
                  fontWeight: 700
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
        <div style={{ marginTop: 16 }}>
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
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
      <LoadingBar />
      <div style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: 40,
        paddingBottom: 80,
        fontFamily: "Montserrat, sans-serif",
        background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        backgroundAttachment: "fixed",
        marginRight: "340px"
      }}>
        <main style={{ 
        position: "relative",
        maxWidth: "100%", 
        margin: "0", 
        padding: "40px",
        paddingRight: "40px",
        zIndex: 1
      }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
          <Link href="/forum" style={{ color: "#0F62FE", textDecoration: "none" }}>
            Foro
          </Link>
          <span style={{ color: "#9CA3AF" }}>→</span>
          <Link href={`/forum/topic/${thread.topic.slug}`} style={{ color: "#0F62FE", textDecoration: "none" }}>
            {thread.topic.name}
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
            <span>por {thread.author.nickname}</span>
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
                background: thread.userVote === 1 ? "#10B981" : "rgba(255, 255, 255, 0.6)",
                color: thread.userVote === 1 ? "white" : "#374151",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              ▲ {thread.score > 0 && thread.score}
            </button>
            
            <button
              onClick={() => handleVote('thread', thread.id, -1)}
              style={{
                padding: "10px 16px",
                background: thread.userVote === -1 ? "#EF4444" : "rgba(255, 255, 255, 0.6)",
                color: thread.userVote === -1 ? "white" : "#374151",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              ▼
            </button>

            <button
              onClick={handleBookmark}
              style={{
                padding: "10px 16px",
                background: thread.isBookmarked ? "#F59E0B" : "rgba(255, 255, 255, 0.6)",
                color: thread.isBookmarked ? "white" : "#374151",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              {thread.isBookmarked ? "★" : "☆"} Guardar
            </button>

            <button
              onClick={handleFollow}
              style={{
                padding: "10px 16px",
                background: thread.isFollowing ? "#8B5CF6" : "rgba(255, 255, 255, 0.6)",
                color: thread.isFollowing ? "white" : "#374151",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              {thread.isFollowing ? "Siguiendo" : "Seguir"}
            </button>
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
