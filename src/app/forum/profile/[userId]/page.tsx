"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import StreakWidget from "@/components/StreakWidget"
import {
  User,
  Star,
  FileText,
  MessageSquare,
  CheckCircle2,
  Check,
  X,
  Inbox,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react"

interface UserProfile {
  userId: string
  nickname: string
  reputation: number
  level: number
  postsCreated: number
  commentsCreated: number
  currentStreak: number
  createdAt: string
  avatar?: any
  badges: Array<{
    badge: {
      name: string
      icon: string
      description: string
    }
    earnedAt: string
  }>
  recentActivity: Array<{
    id: string
    title: string
    createdAt: string
    type: 'thread' | 'evidence'
    score?: number
    commentCount?: number
  }>
  weeklyActiveDays?: string[]
  inventory?: string[]
}

export default function ForumProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params?.userId as string

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [errorProfile, setErrorProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [followStats, setFollowStats] = useState<{
    followersCount: number
    followingCount: number
  } | null>(null)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  useEffect(() => {
    document.body.style.background = "#FBFAF5"
    return () => { document.body.style.background = "" }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push("/login"); return }
    if (userId) fetchProfile()
  }, [user, loading, router, userId])

  const fetchProfile = async () => {
    try {
      setLoadingData(true)
      setErrorProfile(false)
      const response = await fetch(`/api/forum/profile/${userId}`)
      if (response.ok) {
        setProfile(await response.json())
      } else {
        setErrorProfile(true)
      }
    } catch {
      setErrorProfile(true)
    } finally {
      setLoadingData(false)
    }
  }

  const checkFollowStatus = async () => {
    if (!user || !userId || userId === user.id) return
    try {
      const r = await fetch(`/api/profile/follow?userId=${userId}`)
      if (r.ok) { const d = await r.json(); setIsFollowing(d.isFollowing) }
    } catch { }
  }

  const fetchFollowStats = async () => {
    if (!userId) return
    try {
      const r = await fetch(`/api/forum/profile/${userId}/stats`)
      if (r.ok) setFollowStats(await r.json())
    } catch { }
  }

  const fetchFollowers = async () => {
    if (!userId || loadingFollowers) return
    setLoadingFollowers(true)
    try {
      const r = await fetch(`/api/forum/profile/${userId}/followers`)
      if (r.ok) { const d = await r.json(); setFollowers(d.followers || []) }
    } catch { } finally { setLoadingFollowers(false) }
  }

  const fetchFollowing = async () => {
    if (!userId || loadingFollowing) return
    setLoadingFollowing(true)
    try {
      const r = await fetch(`/api/forum/profile/${userId}/following`)
      if (r.ok) { const d = await r.json(); setFollowing(d.following || []) }
    } catch { } finally { setLoadingFollowing(false) }
  }

  const handleFollowToggle = async () => {
    if (!user || !userId || userId === user.id || isLoadingFollow) return
    setIsLoadingFollow(true)
    try {
      if (isFollowing) {
        const r = await fetch(`/api/profile/follow?followingId=${userId}`, { method: "DELETE" })
        if (r.ok) {
          setIsFollowing(false)
          if (followStats) setFollowStats({ ...followStats, followersCount: Math.max(0, followStats.followersCount - 1) })
        }
      } else {
        const r = await fetch("/api/profile/follow", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followingId: userId })
        })
        if (r.ok) {
          setIsFollowing(true)
          if (followStats) setFollowStats({ ...followStats, followersCount: followStats.followersCount + 1 })
        }
      }
    } catch { } finally { setIsLoadingFollow(false) }
  }

  useEffect(() => {
    if (user && userId) {
      if (userId !== user.id) checkFollowStatus()
      fetchFollowStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userId])

  if (loading || loadingData) {
    return (
      <div style={{ minHeight: "100vh", background: "#FBFAF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(15,98,254,0.2)", borderTopColor: "#0F62FE", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (errorProfile) {
    return (
      <div style={{ minHeight: "100vh", background: "#FBFAF5", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", background: "white", padding: 48, borderRadius: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", maxWidth: 400 }}>
          <div style={{
            width: 80, height: 80, background: "#f1f5f9", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", color: "#94a3b8"
          }}>
            <User size={40} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Perfil no encontrado</h2>
          <p style={{ color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>No pudimos encontrar la información de este usuario en el foro.</p>
          <Link href="/forum" style={{ display: "inline-block", background: "linear-gradient(135deg, #0F62FE, #2563EB)", color: "white", padding: "13px 28px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
            Volver al Foro
          </Link>
        </div>
      </div>
    )
  }

  if (!user || !profile) return null

  const memberSince = new Date(profile.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long" })

  return (
    <>
      <style>{`
        @keyframes float-bg { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        @media (max-width: 767px) {
          .fp-outer { padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; }
          .fp-wrap { padding: 16px !important; }
          .fp-hero-inner { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .fp-stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .fp-follow-btns { justify-content: center !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .fp-outer { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .fp-outer { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }

        .fp-thread-card {
          padding: 20px 24px;
          background: white;
          border-radius: 16px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          text-decoration: none;
          display: block;
          transition: all 0.2s ease;
          border-left: 4px solid #0F62FE;
        }
        .fp-thread-card:hover {
          transform: translateX(6px);
          box-shadow: 0 8px 24px rgba(15,98,254,0.12);
          border-color: #0F62FE;
        }

        .fp-badge-pill {
          padding: 10px 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
        }
        .fp-badge-pill:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        .fp-follow-btn {
          transition: all 0.2s ease !important;
        }
        .fp-follow-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(255,255,255,0.2) !important;
        }
      `}</style>

      <div className="fp-outer" style={{
        position: "relative",
        minHeight: "100vh",
        paddingBottom: "clamp(60px, 10vw, 100px)",
        fontFamily: "'Montserrat', sans-serif",
        background: "#FBFAF5",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <main className="fp-wrap" style={{
          width: "100%",
          maxWidth: 980,
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 40px)",
          boxSizing: "border-box"
        }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
            <Link href="/forum" style={{ color: "#0F62FE", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp size={14} /> Foro
            </Link>
            <ChevronRight size={14} style={{ color: "#cbd5e1" }} />
            <span style={{ color: "#94a3b8" }}>Perfil de Usuario</span>
          </div>

          {/* ── HERO CARD ── */}
          <div style={{
            background: "#0f172a",
            borderRadius: 28,
            padding: "40px clamp(24px, 5vw, 48px)",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            animation: "fadeInUp 0.45s ease both"
          }}>
            {/* Radial glow top-right */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 80% 0%, rgba(15,98,254,0.18) 0%, transparent 65%), radial-gradient(ellipse at 10% 100%, rgba(99,102,241,0.12) 0%, transparent 55%)",
              pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Avatar + identity row */}
              <div className="fp-hero-inner" style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "3px solid rgba(255,255,255,0.2)",
                  overflow: "hidden", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 0 6px rgba(15,98,254,0.15)"
                }}>
                  <AvatarDisplay
                    avatar={profile.avatar}
                    size={88}
                    frame={profile.inventory?.includes("2") ? "vip" : profile.inventory?.includes("1") ? "ambassador" : null}
                  />
                </div>

                {/* Name + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Level badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)",
                    borderRadius: 999, padding: "4px 12px", marginBottom: 10,
                    fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: "0.07em", textTransform: "uppercase"
                  }}>
                    <Star size={12} fill="#fbbf24" strokeWidth={0} /> Nivel {profile.level}
                  </div>

                  <h1 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {profile.nickname}
                  </h1>

                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
                    {profile.reputation} puntos de reputación &bull; Desde {memberSince}
                  </div>

                  {/* Follow stats */}
                  {followStats && (
                    <div className="fp-follow-btns" style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => { setShowFollowers(true); fetchFollowers() }}
                        style={{
                          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "6px 14px",
                          fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                          fontFamily: "'Montserrat', sans-serif"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      >
                        <strong>{followStats.followersCount}</strong> seguidores
                      </button>
                      <button
                        onClick={() => { setShowFollowing(true); fetchFollowing() }}
                        style={{
                          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "6px 14px",
                          fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                          fontFamily: "'Montserrat', sans-serif"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      >
                        <strong>{followStats.followingCount}</strong> siguiendo
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow / Siguiendo button */}
                {user && userId !== user.id && (
                  <button
                    className="fp-follow-btn"
                    onClick={handleFollowToggle}
                    disabled={isLoadingFollow}
                    style={{
                      padding: "12px 26px",
                      background: isFollowing
                        ? "rgba(255,255,255,0.1)"
                        : "linear-gradient(135deg, #0F62FE, #2563EB)",
                      color: "white",
                      border: isFollowing ? "1.5px solid rgba(255,255,255,0.25)" : "none",
                      borderRadius: 14,
                      fontSize: 15, fontWeight: 800,
                      cursor: isLoadingFollow ? "not-allowed" : "pointer",
                      opacity: isLoadingFollow ? 0.65 : 1,
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.01em",
                      boxShadow: isFollowing ? "none" : "0 4px 18px rgba(15,98,254,0.45)",
                      fontFamily: "'Montserrat', sans-serif",
                      alignSelf: "flex-start"
                    }}
                  >
                    {isLoadingFollow ? "..." : isFollowing ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Check size={16} /> Siguiendo</span>
                    ) : "+ Seguir"}
                  </button>
                )}
              </div>

              {/* Stats row */}
              <div className="fp-stats-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                alignItems: "stretch"
              }}>
                {[
                  { value: profile.postsCreated, label: "Temas Creados", icon: <FileText size={20} color="#60a5fa" /> },
                  { value: profile.commentsCreated, label: "Respuestas", icon: <MessageSquare size={20} color="#818cf8" /> },
                ].map(({ value, label, icon }) => (
                  <div key={label} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 16, padding: "18px 16px",
                    textAlign: "center", backdropFilter: "blur(8px)",
                    display: "flex", flexDirection: "column", justifyContent: "center"
                  }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, opacity: 0.8 }}>{icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "white", lineHeight: 1, marginBottom: 6 }}>{value}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                  </div>
                ))}

                {/* Racha Widget — Ahora al lado de los otros cuadros, con el mismo estilo */}
                <div style={{ animation: "fadeInUp 0.45s ease 0.15s both", display: "flex", alignItems: "stretch" }}>
                  <StreakWidget
                    streak={profile.currentStreak || 0}
                    showCalendar={true}
                    hideCalendarOnMobile={true}
                    activeDays={profile.weeklyActiveDays || []}
                    containerStyle={{ width: "100%" }}
                    badgeStyle={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: "16px 16px 0 0",
                      padding: "18px 16px",
                      textAlign: "center",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 4,
                      height: "auto",
                      boxShadow: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.15)"
                    }}
                    textStyle={{
                      fontSize: 28,
                      color: "white",
                      fontWeight: "900",
                      marginBottom: 6
                    }}
                    labelStyle={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                      fontWeight: "600"
                    }}
                  />
                  <style>{`
                    /* Adjust for the shared widget calendar style in forum theme */
                    .fp-stats-grid > div:last-child > div > div:last-child {
                        background: rgba(255,255,255,0.03) !important;
                        border: 1px solid rgba(255,255,255,0.10) !important;
                        border-top: none !important;
                        border-radius: 0 0 16px 16px !important;
                    }
                  `}</style>
                </div>
              </div>

              {/* Badges inside hero */}
              {profile.badges.length > 0 && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <Award size={12} /> Insignias
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {profile.badges.map(ub => (
                      <div key={ub.badge.name} className="fp-badge-pill" title={ub.badge.description}>
                        <span style={{ fontSize: 18 }}>{ub.badge.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{ub.badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RECENT ACTIVITY ── */}
          <div style={{ animation: "fadeInUp 0.45s ease 0.1s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 4, height: 22, borderRadius: 3, background: "linear-gradient(180deg, #0F62FE, #6366f1)" }} />
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Actividad Reciente</h2>
            </div>

            {profile.recentActivity.length === 0 ? (
              <div style={{
                background: "white", borderRadius: 20, padding: "56px 32px",
                textAlign: "center", border: "1.5px solid #f1f5f9",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
              }}>
                <div style={{
                  width: 64, height: 64, background: "#f8fafc", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", color: "#cbd5e1"
                }}>
                  <Inbox size={32} />
                </div>
                <p style={{ fontSize: 16, color: "#64748b", margin: 0, fontWeight: 600 }}>Este usuario aún no tiene actividad pública</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {profile.recentActivity.map(item => {
                  const isThread = item.type === 'thread';
                  return (
                    <Link
                      key={item.id}
                      href={isThread ? `/forum/thread/${item.id}` : "/forum"}
                      className="fp-thread-card"
                      style={{ borderLeftColor: isThread ? "#0F62FE" : "#10b981" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, flex: 1 }}>
                          {item.title}
                        </h3>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                          textTransform: "uppercase",
                          background: isThread ? "rgba(15,98,254,0.1)" : "rgba(16,185,129,0.1)",
                          color: isThread ? "#0F62FE" : "#10b981"
                        }}>
                          {isThread ? "Foro" : "Reto"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
                        {isThread && (
                          <>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span>▲</span> {item.score} votos
                            </span>
                            <span>💬 {item.commentCount} respuestas</span>
                          </>
                        )}
                        <span>{new Date(item.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* ── FOLLOWERS MODAL ── */}
        {showFollowers && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
          }} onClick={() => setShowFollowers(false)}>
            <div style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24, padding: 28,
              maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white" }}>
                  Seguidores <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 18 }}>({followStats?.followersCount || 0})</span>
                </h2>
                <button onClick={() => setShowFollowers(false)} style={{
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)", width: 36, height: 36, borderRadius: 10,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}><X size={18} /></button>
              </div>
              {loadingFollowers ? (
                <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.4)" }}>Cargando...</div>
              ) : followers.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.35)", fontSize: 15 }}>No hay seguidores aún</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {followers.map((follower: any) => (
                    <Link key={follower.userId} href={`/forum/profile/${follower.userId}`}
                      onClick={() => setShowFollowers(false)}
                      style={{
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, display: "flex", alignItems: "center", gap: 14,
                        textDecoration: "none", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = "translateX(4px)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateX(0)" }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: "linear-gradient(135deg, #0F62FE, #6366f1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0
                      }}>
                        {follower.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 2 }}>{follower.nickname}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Nivel {follower.level} • {follower.reputation} pts</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FOLLOWING MODAL ── */}
        {showFollowing && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
          }} onClick={() => setShowFollowing(false)}>
            <div style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24, padding: 28,
              maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white" }}>
                  Siguiendo <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 18 }}>({followStats?.followingCount || 0})</span>
                </h2>
                <button onClick={() => setShowFollowing(false)} style={{
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)", width: 36, height: 36, borderRadius: 10,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}><X size={18} /></button>
              </div>
              {loadingFollowing ? (
                <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.4)" }}>Cargando...</div>
              ) : following.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.35)", fontSize: 15 }}>No sigue a nadie aún</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {following.map((followed: any) => (
                    <Link key={followed.userId} href={`/forum/profile/${followed.userId}`}
                      onClick={() => setShowFollowing(false)}
                      style={{
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, display: "flex", alignItems: "center", gap: 14,
                        textDecoration: "none", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = "translateX(4px)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateX(0)" }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: "linear-gradient(135deg, #0F62FE, #6366f1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0
                      }}>
                        {followed.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 2 }}>{followed.nickname}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Nivel {followed.level} • {followed.reputation} pts</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
