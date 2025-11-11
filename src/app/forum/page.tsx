"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { ThreadCardSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"

// Force dynamic rendering to avoid prerendering issues
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

interface ForumTopic {
  id: string
  name: string
  slug: string
  icon: string
}

type SortOption = 'new' | 'top' | 'unanswered'

export default function ForumPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('new')
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.backgroundImage = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      bodyEl.style.backgroundAttachment = "fixed"
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

    fetchData()
  }, [user, loading, router, selectedTopic, sortBy])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      
      // Fetch topics and threads in parallel
      const [topicsRes, threadsRes] = await Promise.all([
        fetch('/api/forum/topics'),
        fetch(`/api/forum/threads?sort=${sortBy}&topic=${selectedTopic}`)
      ])

      if (topicsRes.ok) {
        const topicsData = await topicsRes.json()
        setTopics(topicsData)
      }

      if (threadsRes.ok) {
        const threadsData = await threadsRes.json()
        setThreads(threadsData)
      }
    } catch (error) {
      console.error("Error fetching forum data:", error)
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
    return null // Quick flash instead of spinner
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
        backgroundImage: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        backgroundAttachment: "fixed"
      }}>
        <main style={{ 
        position: "relative",
        maxWidth: 1400, 
        margin: "0 auto", 
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: "clamp(28px, 6vw, 36px)", 
              fontWeight: 800,
              color: "#1E40AF"
            }}>
              Foro Emprendedor
            </h1>
            <p style={{ margin: "8px 0 0", color: "#374151", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 600 }}>
              Comparte ideas, haz preguntas y aprende de otros emprendedores
            </p>
          </div>

          <Link
            href="/forum/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 24px",
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              color: "white",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
              transition: "transform 0.2s ease",
              boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(11, 113, 254, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(11, 113, 254, 0.3)"
            }}
          >
            Crear Tema
          </Link>
        </div>

        {/* Filters */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          marginBottom: 24
        }}>
          {/* Topic Filter */}
          <div style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center"
          }}>
            <button
              onClick={() => setSelectedTopic('all')}
              style={{
                padding: "8px 16px",
                background: selectedTopic === 'all' ? "#0F62FE" : "rgba(255, 255, 255, 0.6)",
                color: selectedTopic === 'all' ? "white" : "#374151",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              Todos
            </button>
            {topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.slug)}
                style={{
                  padding: "8px 16px",
                  background: selectedTopic === topic.slug ? "#0F62FE" : "rgba(255, 255, 255, 0.6)",
                  color: selectedTopic === topic.slug ? "white" : "#374151",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
              >
                {topic.name}
              </button>
            ))}
          </div>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.6)",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              color: "#374151"
            }}
          >
            <option value="new">Más Recientes</option>
            <option value="top">Más Votados</option>
            <option value="unanswered">Sin Responder</option>
          </select>
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
            // Show skeleton loaders while loading
            <>
              <ThreadCardSkeleton />
              <ThreadCardSkeleton />
              <ThreadCardSkeleton />
            </>
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
                  {/* Title and Status */}
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

                  {/* Preview */}
                  <p style={{ 
                    margin: "0 0 12px", 
                    fontSize: 14, 
                    color: "#6B7280",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontWeight: 500
                  }}>
                    {thread.body.substring(0, 150)}...
                  </p>

                  {/* Tags */}
                  {thread.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {thread.tags.map(tag => (
                        <span
                          key={tag.id}
                          style={{
                            padding: "4px 10px",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#0F62FE",
                            fontSize: 12,
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
                    flexWrap: "wrap"
                  }}>
                    <span>{thread.topic.name}</span>
                    <span>por {thread.author.nickname} ({thread.author.reputation} pts)</span>
                    <span>{formatDate(thread.createdAt)}</span>
                    <span>{thread.commentCount} respuestas</span>
                    <span>{thread.viewCount} vistas</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {!loadingData && threads.length === 0 && (
          <div style={{
            padding: "60px 24px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#1E40AF" }}>
              No hay temas todavía
            </h3>
            <p style={{ margin: "0 0 24px", color: "#374151", fontSize: 14, fontWeight: 600 }}>
              Sé el primero en iniciar una conversación
            </p>
            <Link
              href="/forum/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 15,
                transition: "transform 0.2s ease",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
              }}
            >
              Crear Primer Tema
            </Link>
          </div>
        )}
      </main>
    </div>
    
    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </>
  )
}
