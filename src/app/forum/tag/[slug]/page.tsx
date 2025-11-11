"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface ForumThread {
  id: string
  title: string
  body: string
  score: number
  commentCount: number
  createdAt: string
  author: {
    nickname: string
    reputation: number
  }
  topic: {
    name: string
    slug: string
    icon: string
  }
}

export default function TagFeedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const tagSlug = params?.slug as string

  const [threads, setThreads] = useState<ForumThread[]>([])
  const [tagName, setTagName] = useState("")
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
    if (tagSlug) {
      fetchThreads()
    }
  }, [user, loading, router, tagSlug])

  const fetchThreads = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/forum/search?tag=${tagSlug}`)
      if (response.ok) {
        const data = await response.json()
        setThreads(data.results)
        if (data.results.length > 0) {
          const tag = data.results[0].tags.find((t: any) => t.slug === tagSlug)
          if (tag) setTagName(tag.name)
        }
      }
    } catch (error) {
      console.error("Error fetching tag threads:", error)
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

  if (!user) return null

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      fontFamily: "Montserrat, sans-serif",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed"
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
          <span style={{ color: "#374151" }}>#{tagName || tagSlug}</span>
        </div>

        <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800, color: "#1E40AF" }}>
          #{tagName || tagSlug}
        </h1>
        <p style={{ margin: "0 0 32px", color: "#374151", fontSize: 15, fontWeight: 600 }}>
          {threads.length} temas con esta etiqueta
        </p>

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
                display: "block"
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
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1E40AF" }}>
                {thread.title}
              </h3>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: "#6B7280" }}>
                {thread.body.substring(0, 150)}...
              </p>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>
                <span>{thread.topic.icon} {thread.topic.name}</span>
                <span>por {thread.author.nickname}</span>
                <span>{thread.score} votos</span>
                <span>{thread.commentCount} respuestas</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

