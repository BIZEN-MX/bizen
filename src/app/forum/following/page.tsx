"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { ThreadCardSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"

export const dynamic = 'force-dynamic'

interface ForumThread {
  id: string
  title: string
  body: string
  status: 'open' | 'resolved' | 'locked'
  score: number
  viewCount: number
  commentCount: number
  isPinned: boolean
  createdAt: string
  author: {
    userId: string
    nickname: string
    reputation: number
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
  hasAcceptedAnswer: boolean
}

export default function FollowingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
      bodyEl.style.backgroundAttachment = "fixed"
      bodyEl.style.backgroundSize = "cover"
      bodyEl.style.backgroundRepeat = "no-repeat"
    }
    return () => {
      bodyEl.style.backgroundImage = "none"
      bodyEl.style.backgroundColor = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }
    fetchFollowing()
  }, [user, loading, router])

  const fetchFollowing = async () => {
    try {
      setLoadingData(true)
      const response = await fetch('/api/forum/follows')
      if (response.ok) {
        const data = await response.json()
        setThreads(data)
      }
    } catch (error) {
      console.error("Error fetching followed threads:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#10B981'
      case 'locked': return '#EF4444'
      default: return '#0F62FE'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resuelto'
      case 'locked': return 'Cerrado'
      default: return 'Abierto'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "hace un momento"
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)}d`
    
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return null
  }

  if (!user) return null

  return (
    <>
      <LoadingBar />
      <div className="forum-following-outer" style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: 40,
        paddingBottom: 80,
        fontFamily: "Montserrat, sans-serif",
        background: "#ffffff",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box"
      }}>
        <main style={{ 
          position: "relative",
          width: "100%",
          maxWidth: "100%", 
          margin: "0 auto", 
          padding: "clamp(24px, 4vw, 40px)",
          boxSizing: "border-box",
          zIndex: 1
        }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/forum" style={{ textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
              <button style={{
                padding: "8px 16px",
                background: "white",
                border: "2px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}>
                ← Volver al Foro
              </button>
            </Link>
            <h1 style={{ 
              margin: "16px 0 8px", 
              fontSize: "clamp(28px, 6vw, 36px)", 
              fontWeight: 800,
              color: "#1E40AF"
            }}>
              Temas que Sigo
            </h1>
            <p style={{ margin: 0, color: "#374151", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 600 }}>
              Recibe notificaciones cuando haya nuevas respuestas en estos temas
            </p>
          </div>

          {/* Threads List */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 16,
            opacity: loadingData ? 0.6 : 1,
            transition: "opacity 0.3s ease"
          }}>
            {loadingData ? (
              <>
                <ThreadCardSkeleton />
                <ThreadCardSkeleton />
                <ThreadCardSkeleton />
              </>
            ) : threads.length === 0 ? (
              <div style={{
                padding: 48,
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: "2px solid rgba(255, 255, 255, 0.6)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔔</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1E40AF", marginBottom: 8 }}>
                  No sigues ningún tema
                </h3>
                <p style={{ color: "#6B7280", marginBottom: 24 }}>
                  Sigue temas que te interesen para recibir notificaciones de nuevas respuestas
                </p>
                <Link href="/forum" style={{ textDecoration: "none" }}>
                  <button style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer"
                  }}>
                    Explorar Temas
                  </button>
                </Link>
              </div>
            ) : threads.map((thread, index) => (
              <Link
                key={thread.id}
                href={`/forum/thread/${thread.id}`}
                style={{
                  padding: 24,
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 16,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "block",
                  borderLeft: thread.isPinned ? "4px solid #F59E0B" : undefined,
                  animation: `fadeInUp 0.5s ease ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(31, 38, 135, 0.1)"
                }}
              >
                <div style={{ display: "flex", gap: 20 }}>
                  {/* Vote Score */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    minWidth: 60
                  }}>
                    <div style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: thread.score > 0 ? "#10B981" : thread.score < 0 ? "#EF4444" : "#6B7280"
                    }}>
                      {thread.score}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
                      votos
                    </div>
                  </div>

                  {/* Thread Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <h3 style={{ 
                        margin: 0,
                        flex: 1,
                        fontSize: 18, 
                        fontWeight: 700, 
                        color: "#1E40AF",
                        lineHeight: 1.4
                      }}>
                        {thread.title}
                      </h3>
                      <span style={{
                        padding: "4px 10px",
                        background: getStatusColor(thread.status) + "22",
                        color: getStatusColor(thread.status),
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 6,
                        whiteSpace: "nowrap"
                      }}>
                        {getStatusLabel(thread.status)}
                      </span>
                    </div>

                    <div style={{ 
                      display: "flex", 
                      gap: 16, 
                      flexWrap: "nowrap", 
                      alignItems: "center", 
                      marginTop: 12,
                      overflowX: "auto",
                      width: "100%"
                    }}>
                      <span style={{ fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>
                        {thread.topic.name}
                      </span>
                      <span style={{ fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>
                        por {thread.author.nickname}
                      </span>
                      <span style={{ fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>
                        {thread.commentCount} comentarios
                      </span>
                      <span style={{ fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>
                        {formatDate(thread.createdAt)}
                      </span>
                      {thread.hasAcceptedAnswer && (
                        <span style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          background: "#10B98122",
                          color: "#10B981",
                          borderRadius: 4,
                          fontWeight: 600,
                          whiteSpace: "nowrap"
                        }}>
                          ✓ Resuelto
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive width adjustments - iPad (768px-1160px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .forum-following-outer {
            width: calc(100% - 160px) !important;
            max-width: calc(100% - 160px) !important;
          }
        }
        
        /* Desktop (1161px+) */
        @media (min-width: 1161px) {
          .forum-following-outer {
            width: calc(100% - 280px) !important;
            max-width: calc(100% - 280px) !important;
          }
        }
      `}</style>
    </>
  )
}

