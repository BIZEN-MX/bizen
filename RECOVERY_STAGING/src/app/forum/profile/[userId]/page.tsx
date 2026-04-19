"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import StreakWidget from "@/components/StreakWidget"
import PageLoader from "@/components/PageLoader"
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
  Award,
  Send,
  Coins
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
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params?.userId as string

  const [currentBalance, setCurrentBalance] = useState(0)

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
    if (userId) {
      fetchProfile()
      setCurrentBalance((dbProfile as any)?.bizcoins || 0)
    }
  }, [user, loading, router, userId, dbProfile])

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
    return <PageLoader />
  }

  if (errorProfile) {
    return (
      <div className="min-h-screen bg-[#FBFAF5] flex items-center justify-center p-5">
        <div className="text-center bg-white p-12 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] max-w-[400px]">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-medium text-slate-900 mb-3">Perfil no encontrado</h2>
          <p className="text-slate-500 mb-7 leading-relaxed">No pudimos encontrar la información de este usuario en el foro.</p>
          <Link href="/forum" className="inline-block bg-gradient-to-br from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-medium no-underline text-[15px] hover:opacity-90 transition-opacity">
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
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 767px) {
          .fp-outer { padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; }
          .fp-wrap { padding: 16px !important; }
          .fp-hero-inner { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .fp-stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .fp-follow-btns { justify-content: center !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .fp-outer { width: 100% !important; margin-left: 0 !important; }
        }
        @media (min-width: 1161px) {
          .fp-outer { width: 100% !important; margin-left: 0 !important; }
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

      <div className="relative min-h-screen pb-[clamp(60px,10vw,100px)] bg-[#FBFAF5] w-full box-border fp-outer">
        <main className="w-full max-w-[980px] mx-auto p-[clamp(20px,4vw,40px)] box-border fp-wrap">

          {/* Breadcrumb */}
          <div className="mb-7 flex items-center gap-2 text-[13px] font-medium">
            <Link href="/forum" className="text-blue-600 no-underline flex items-center gap-1.5 hover:text-blue-700 transition-colors">
              <TrendingUp size={14} /> Foro
            </Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-400">Perfil de Usuario</span>
          </div>

          {/* ── HERO CARD ── */}
          <div className="bg-slate-900 rounded-[28px] pt-10 pb-10 px-[clamp(24px,5vw,48px)] mb-7 relative overflow-hidden border border-white/5 shadow-[0_24px_64px_rgba(0,0,0,0.35)] animate-[fadeInUp_0.45s_ease_both]">
            {/* Radial glow top-right */}
            <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_80%_0%,rgba(15,98,254,0.18)_0%,transparent_65%),radial-gradient(ellipse_at_10%_100%,rgba(99,102,241,0.12)_0%,transparent_55%)]" />

            <div className="relative z-10">
              {/* Avatar + identity row */}
              <div className="flex flex-wrap items-start gap-6 mb-8 fp-hero-inner">
                {/* Avatar */}
                <div className="w-[88px] h-[88px] rounded-full bg-white/5 border-4 border-white/20 overflow-hidden shrink-0 flex items-center justify-center shadow-[0_0_0_6px_rgba(15,98,254,0.15)]">
                  <AvatarDisplay
                    avatar={profile.avatar}
                    size={88}
                    frame={profile.inventory?.includes("2") ? "vip" : profile.inventory?.includes("1") ? "ambassador" : null}
                  />
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  {/* Level badge */}
                  <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/30 rounded-full px-3 py-1 mb-2.5 text-[11px] font-medium text-amber-400 tracking-widest uppercase">
                    <Star size={12} fill="#fbbf24" strokeWidth={0} /> Nivel {profile.level}
                  </div>

                  <h1 className="m-0 mb-1.5 text-[clamp(20px,3vw,30px)] font-medium text-white tracking-[-0.02em] leading-[1.1]">
                    {profile.nickname}
                  </h1>

                  <div className="text-[14px] text-white/55 mb-3.5">
                    {profile.reputation} puntos de reputación &bull; Desde {memberSince}
                  </div>

                  {/* Follow stats */}
                  {followStats && (
                    <div className="flex gap-1.5 fp-follow-btns">
                      <button
                        onClick={() => { setShowFollowers(true); fetchFollowers() }}
                        className="bg-white/5 border border-white/15 text-white/90 rounded-lg px-3.5 py-1.5 text-[13px] font-medium cursor-pointer transition-colors hover:bg-white/15"
                      >
                        <strong>{followStats.followersCount}</strong> seguidores
                      </button>
                      <button
                        onClick={() => { setShowFollowing(true); fetchFollowing() }}
                        className="bg-white/5 border border-white/15 text-white/90 rounded-lg px-3.5 py-1.5 text-[13px] font-medium cursor-pointer transition-colors hover:bg-white/15"
                      >
                        <strong>{followStats.followingCount}</strong> siguiendo
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow / Siguiendo button */}
                {user && userId !== user.id && (
                  <button
                    className="fp-follow-btn self-start px-[26px] py-[12px] text-white rounded-xl text-[15px] font-medium whitespace-nowrap tracking-[-0.01em] transition-all"
                    onClick={handleFollowToggle}
                    disabled={isLoadingFollow}
                    style={{
                      background: isFollowing ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #0F62FE, #2563EB)",
                      border: isFollowing ? "1.5px solid rgba(255,255,255,0.25)" : "none",
                      boxShadow: isFollowing ? "none" : "0 4px 18px rgba(15,98,254,0.45)",
                      cursor: isLoadingFollow ? "not-allowed" : "pointer",
                      opacity: isLoadingFollow ? 0.65 : 1
                    }}
                  >
                    {isLoadingFollow ? "..." : isFollowing ? (
                      <span className="flex items-center gap-1.5"><Check size={16} /> Siguiendo</span>
                    ) : "+ Seguir"}
                  </button>
                )}

                {user && userId !== user.id && (
                  <button
                    onClick={() => router.push(`/transfer?target=${userId}`)}
                    className="px-[26px] py-[12px] bg-white/10 text-white border-[1.5px] border-white/25 rounded-xl text-[15px] font-medium cursor-pointer flex items-center gap-2 transition-all hover:bg-white/15 hover:-translate-y-0.5"
                  >
                    <Send size={16} className="-rotate-15" />
                    Transferir
                  </button>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 items-stretch fp-stats-grid">
                {[
                  { value: profile.postsCreated, label: "Temas Creados", icon: <FileText size={20} color="#60a5fa" /> },
                  { value: profile.commentsCreated, label: "Respuestas", icon: <MessageSquare size={20} color="#818cf8" /> },
                ].map(({ value, label, icon }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md flex flex-col justify-center">
                    <div className="flex justify-center mb-2 opacity-80">{icon}</div>
                    <div className="text-[28px] font-medium text-white leading-none mb-1.5">{value}</div>
                    <div className="text-[12px] text-white/50 font-medium uppercase tracking-widest">{label}</div>
                  </div>
                ))}

                {/* Racha Widget */}
                <div className="animate-[fadeInUp_0.45s_ease_0.15s_both] flex items-stretch">
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
                      fontWeight: 500,
                      marginBottom: 6
                    }}
                    labelStyle={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                      fontWeight: 500
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
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Award size={12} /> Insignias
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {profile.badges.map(ub => (
                      <div key={ub.badge.name} className="fp-badge-pill" title={ub.badge.description}>
                        <span className="text-[18px]">{ub.badge.icon}</span>
                        <span className="text-[13px] font-medium text-white/85">{ub.badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RECENT ACTIVITY ── */}
          <div className="animate-[fadeInUp_0.45s_ease_0.1s_both]">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-1 h-[22px] rounded-sm bg-gradient-to-b from-blue-600 to-indigo-500" />
              <h2 className="m-0 text-[22px] font-medium text-slate-900 tracking-[-0.02em]">Actividad Reciente</h2>
            </div>

            {profile.recentActivity.length === 0 ? (
              <div className="bg-white rounded-[20px] py-14 px-8 text-center border-[1.5px] border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300">
                  <Inbox size={32} />
                </div>
                <p className="text-[16px] text-slate-500 m-0 font-medium">Este usuario aún no tiene actividad pública</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {profile.recentActivity.map(item => {
                  const isThread = item.type === 'thread';
                  return (
                    <Link
                      key={item.id}
                      href={isThread ? `/forum/thread/${item.id}` : "/forum"}
                      className="fp-thread-card"
                      style={{ borderLeftColor: isThread ? "#0F62FE" : "#10b981" }}
                    >
                      <div className="flex justify-between items-center gap-3">
                        <h3 className="m-0 mb-2.5 text-[16px] font-medium text-slate-900 leading-[1.4] flex-1">
                          {item.title}
                        </h3>
                        <span 
                          className="text-[10px] font-medium px-2 py-1 rounded-md uppercase"
                          style={{
                            background: isThread ? "rgba(15,98,254,0.1)" : "rgba(16,185,129,0.1)",
                            color: isThread ? "#0F62FE" : "#10b981"
                          }}
                        >
                          {isThread ? "Foro" : "Reto"}
                        </span>
                      </div>
                      <div className="flex gap-4 text-[13px] text-slate-400 font-medium">
                        {isThread && (
                          <>
                            <span className="flex items-center gap-1">
                              <span className="text-[10px]">▲</span> {item.score} votos
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-5" onClick={() => setShowFollowers(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-7 max-w-[480px] w-full max-h-[80vh] overflow-auto shadow-[0_24px_64px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="m-0 text-[22px] font-medium text-white">
                  Seguidores <span className="text-white/35 text-[18px]">({followStats?.followersCount || 0})</span>
                </h2>
                <button onClick={() => setShowFollowers(false)} className="bg-white/10 border border-white/15 text-white/70 w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center transition-colors hover:bg-white/15">
                  <X size={18} />
                </button>
              </div>
              {loadingFollowers ? (
                <div className="text-center p-10 text-white/40">Cargando...</div>
              ) : followers.length === 0 ? (
                <div className="text-center p-10 text-white/35 text-[15px]">No hay seguidores aún</div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {followers.map((follower: any) => (
                    <Link key={follower.userId} href={`/forum/profile/${follower.userId}`}
                      onClick={() => setShowFollowers(false)}
                      className="p-3.5 px-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3.5 no-underline transition-all hover:bg-white/10 hover:translate-x-1"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-[18px] font-medium text-white shrink-0">
                        {follower.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-[15px] font-medium text-white mb-0.5">{follower.nickname}</div>
                        <div className="text-[12px] text-white/40">Nivel {follower.level} • {follower.reputation} pts</div>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-5" onClick={() => setShowFollowing(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-7 max-w-[480px] w-full max-h-[80vh] overflow-auto shadow-[0_24px_64px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="m-0 text-[22px] font-medium text-white">
                  Siguiendo <span className="text-white/35 text-[18px]">({followStats?.followingCount || 0})</span>
                </h2>
                <button onClick={() => setShowFollowing(false)} className="bg-white/10 border border-white/15 text-white/70 w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center transition-colors hover:bg-white/15">
                  <X size={18} />
                </button>
              </div>
              {loadingFollowing ? (
                <div className="text-center p-10 text-white/40">Cargando...</div>
              ) : following.length === 0 ? (
                <div className="text-center p-10 text-white/35 text-[15px]">No sigue a nadie aún</div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {following.map((followed: any) => (
                    <Link key={followed.userId} href={`/forum/profile/${followed.userId}`}
                      onClick={() => setShowFollowing(false)}
                      className="p-3.5 px-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3.5 no-underline transition-all hover:bg-white/10 hover:translate-x-1"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-[18px] font-medium text-white shrink-0">
                        {followed.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-[15px] font-medium text-white mb-0.5">{followed.nickname}</div>
                        <div className="text-[12px] text-white/40">Nivel {followed.level} • {followed.reputation} pts</div>
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
