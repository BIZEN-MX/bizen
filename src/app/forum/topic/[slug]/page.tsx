"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface ForumThread {
  id: string
  title: string
  body: string
  status: string
  score: number
  commentCount: number
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
    return (
      <div style={{ 
        display: "grid", 
        placeItems: "center", 
        minHeight: "60vh", 
        fontFamily: "Montserrat, sans-serif",
        background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #0F62FE22",
            borderTop: "4px solid #0F62FE",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#666", fontSize: 16 }}>Cargando...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user || !topic) return null

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      fontFamily: "Montserrat, sans-serif",
      backgroundImage: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
      <main style={{ 
        position: "relative",
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
          <Link href="/forum" style={{ color: "#0F62FE", textDecoration: "none" }}>
            Foro
          </Link>
          <span style={{ color: "#9CA3AF" }}>→</span>
          <span style={{ color: "#374151" }}>{topic.name}</span>
        </div>

        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#1E40AF" }}>
              {topic.name}
            </h1>
            {topic.description && (
              <p style={{ margin: "8px 0 0", color: "#374151", fontSize: 15, fontWeight: 600 }}>
                {topic.description}
              </p>
            )}
          </div>
          <Link
            href={`/forum/new?topic=${topicSlug}`}
            style={{
              padding: "14px 24px",
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              color: "white",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
              boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
            }}
          >
            Nuevo Tema
          </Link>
        </div>

        {/* Threads */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {threads.map(thread => (
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
                borderLeft: thread.isPinned ? "4px solid #F59E0B" : undefined
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
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0F62FE" }}>{thread.score}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>votos</div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1E40AF" }}>
                    {thread.title}
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>
                    {thread.body.substring(0, 150)}...
                  </p>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>
                    <span>por {thread.author.nickname}</span>
                    <span>{thread.commentCount} respuestas</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {threads.length === 0 && (
          <div style={{
            padding: "60px 24px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#1E40AF" }}>
              No hay temas en esta categoría
            </h3>
          </div>
        )}
      </main>
    </div>
  )
}

