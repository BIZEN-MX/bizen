"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface UserProfile {
  userId: string
  nickname: string
  reputation: number
  level: number
  postsCreated: number
  commentsCreated: number
  acceptedAnswers: number
  createdAt: string
  badges: Array<{
    badge: {
      name: string
      icon: string
      description: string
    }
    earnedAt: string
  }>
  recentThreads: Array<{
    id: string
    title: string
    score: number
    commentCount: number
    createdAt: string
  }>
}

export default function ForumProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params?.userId as string

  const [profile, setProfile] = useState<UserProfile | null>(null)
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
    if (userId) {
      fetchProfile()
    }
  }, [user, loading, router, userId])

  const fetchProfile = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/forum/profile/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
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
          <p style={{ color: "#666", fontSize: 16 }}>Cargando perfil...</p>
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

  if (!user || !profile) return null

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
        maxWidth: 1000, 
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
          <span style={{ color: "#374151" }}>Perfil</span>
        </div>

        {/* Profile Header */}
        <div style={{
          padding: 32,
          background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
          color: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(15, 98, 254, 0.3)",
          marginBottom: 32
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800
            }}>
              {profile.nickname[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800 }}>
                {profile.nickname}
              </h1>
              <div style={{ fontSize: 15, opacity: 0.9 }}>
                Nivel {profile.level} • {profile.reputation} puntos de reputación
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 16
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{profile.postsCreated}</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Temas Creados</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{profile.commentsCreated}</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Respuestas</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{profile.acceptedAnswers}</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Respuestas Aceptadas</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700, color: "#1E40AF" }}>
              Insignias
            </h2>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {profile.badges.map(ub => (
                <div
                  key={ub.badge.name}
                  title={ub.badge.description}
                  style={{
                    padding: "12px 20px",
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 12,
                    border: "2px solid rgba(255, 255, 255, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}
                >
                  <span style={{ fontSize: 24 }}>{ub.badge.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1E40AF" }}>
                    {ub.badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Threads */}
        <div>
          <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700, color: "#1E40AF" }}>
            Temas Recientes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {profile.recentThreads.map(thread => (
              <Link
                key={thread.id}
                href={`/forum/thread/${thread.id}`}
                style={{
                  padding: 20,
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 12,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "block"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1E40AF" }}>
                  {thread.title}
                </h3>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>
                  <span>{thread.score} votos</span>
                  <span>{thread.commentCount} respuestas</span>
                  <span>{new Date(thread.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

