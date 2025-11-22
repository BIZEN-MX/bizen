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
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [followStats, setFollowStats] = useState<{
    followersCount: number
    followingCount: number
  } | null>(null)

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

  // Check if current user is following this profile
  const checkFollowStatus = async () => {
    if (!user || !userId || userId === user.id) return
    
    try {
      const response = await fetch(`/api/profile/follow?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error("Error checking follow status:", error)
    }
  }

  // Fetch follow stats for this user
  const fetchFollowStats = async () => {
    if (!userId) return
    
    try {
      // We'll need to create an endpoint to get stats for any user
      // For now, we'll use a workaround
      const response = await fetch(`/api/forum/profile/${userId}/stats`)
      if (response.ok) {
        const data = await response.json()
        setFollowStats(data)
      }
    } catch (error) {
      console.error("Error fetching follow stats:", error)
    }
  }

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!user || !userId || userId === user.id || isLoadingFollow) return
    
    setIsLoadingFollow(true)
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/profile/follow?followingId=${userId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setIsFollowing(false)
          if (followStats) {
            setFollowStats({
              ...followStats,
              followersCount: Math.max(0, followStats.followersCount - 1)
            })
          }
        }
      } else {
        // Follow
        const response = await fetch('/api/profile/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followingId: userId })
        })
        if (response.ok) {
          setIsFollowing(true)
          if (followStats) {
            setFollowStats({
              ...followStats,
              followersCount: followStats.followersCount + 1
            })
          }
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoadingFollow(false)
    }
  }

  useEffect(() => {
    if (user && userId && userId !== user.id) {
      checkFollowStatus()
      fetchFollowStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userId])

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
    <>
      <style>{`
        /* Mobile (≤767px): Full width */
        @media (max-width: 767px) {
          .forum-profile-outer {
            width: 100% !important;
            max-width: 100% !important;
            padding-top: 20px !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
          }
          .forum-profile-container {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        
        /* Tablet/iPad (768px-1024px): Account for right sidebar */
        @media (min-width: 768px) and (max-width: 1024px) {
          .forum-profile-outer {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
          }
          .forum-profile-container {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        
        /* Desktop (≥1025px): Account for right sidebar */
        @media (min-width: 1025px) {
          .forum-profile-outer {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
          }
          .forum-profile-container {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
      `}</style>
      <div className="forum-profile-outer" style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: "clamp(20px, 4vw, 40px)",
        paddingBottom: "clamp(80px, 12vw, 120px)",
        fontFamily: "Montserrat, sans-serif",
        backgroundImage: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        boxSizing: "border-box"
      }}>
      <main className="forum-profile-container" style={{ 
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        margin: "0",
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1,
        boxSizing: "border-box"
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
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800 }}>
                {profile.nickname}
              </h1>
              <div style={{ fontSize: 15, opacity: 0.9, marginBottom: 12 }}>
                Nivel {profile.level} • {profile.reputation} puntos de reputación
              </div>
              
              {/* Follow Stats */}
              {followStats && (
                <div style={{ display: "flex", gap: 20, fontSize: 14, opacity: 0.9 }}>
                  <div>
                    <strong>{followStats.followersCount}</strong> seguidores
                  </div>
                  <div>
                    <strong>{followStats.followingCount}</strong> siguiendo
                  </div>
                </div>
              )}
            </div>
            
            {/* Follow User Button */}
            {user && userId !== user.id && (
              <button
                onClick={handleFollowToggle}
                disabled={isLoadingFollow}
                title={isFollowing ? "Dejar de seguir a este usuario" : "Seguir a este usuario"}
                style={{
                  padding: "12px 24px",
                  background: isFollowing 
                    ? "rgba(255, 255, 255, 0.2)" 
                    : "rgba(255, 255, 255, 0.9)",
                  color: isFollowing ? "#fff" : "#0F62FE",
                  border: isFollowing ? "2px solid rgba(255, 255, 255, 0.4)" : "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: isLoadingFollow ? "not-allowed" : "pointer",
                  opacity: isLoadingFollow ? 0.6 : 1,
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  if (!isLoadingFollow) {
                    e.currentTarget.style.transform = "scale(1.05)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                {isLoadingFollow ? (
                  <>
                    <span>⏳</span>
                    <span>Cargando...</span>
                  </>
                ) : isFollowing ? (
                  <>
                    <span>👤✓</span>
                    <span>Siguiendo</span>
                  </>
                ) : (
                  <>
                    <span>👤+</span>
                    <span>Seguir Usuario</span>
                  </>
                )}
              </button>
            )}
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
    </>
  )
}

