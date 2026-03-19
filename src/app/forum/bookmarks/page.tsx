"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Bookmark, ChevronLeft, ChevronRight, MessageSquare, ThumbsUp, Clock, CheckCircle2, Lock, Search } from "lucide-react"
import { ThreadCardSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import PageLoader from "@/components/PageLoader"

export const dynamic = "force-dynamic"

interface ForumThread {
  id: string
  title: string
  body: string
  status: "open" | "resolved" | "locked"
  score: number
  viewCount: number
  commentCount: number
  isPinned: boolean
  createdAt: string
  author: { userId: string; nickname: string; reputation: number; avatar: any; inventory?: string[] }
  topic: { id: string; name: string; slug: string; icon: string }
  tags: Array<{ id: string; name: string; slug: string }>
  hasAcceptedAnswer: boolean
}

const TOPIC_COLORS: Record<string, { accent: string; light: string; shadow: string }> = {
  "ahorro": { accent: "#10b981", light: "#ecfdf5", shadow: "rgba(16,185,129,0.15)" },
  "presupuesto": { accent: "#2563eb", light: "#eff6ff", shadow: "rgba(37,99,235,0.15)" },
  "deuda": { accent: "#ef4444", light: "#fef2f2", shadow: "rgba(239,68,68,0.15)" },
  "inversion": { accent: "#d97706", light: "#fffbeb", shadow: "rgba(245,158,11,0.15)" },
  "emprendimiento": { accent: "#7c3aed", light: "#f5f3ff", shadow: "rgba(124,58,237,0.15)" },
  "proyectos": { accent: "#4f46e5", light: "#eef2ff", shadow: "rgba(79,70,229,0.15)" },
  "negocios": { accent: "#0284c7", light: "#f0f9ff", shadow: "rgba(2,132,199,0.15)" },
  "mision-del-dia": { accent: "#fbbf24", light: "#fffbeb", shadow: "rgba(251,191,36,0.15)" },
  "preguntas": { accent: "#1e3a8a", light: "#eff6ff", shadow: "rgba(30,58,138,0.15)" },
}
const DEFAULT_TC = { accent: "#1e3a8a", light: "#eff6ff", shadow: "rgba(30,58,138,0.15)" }

function getTC(slug: string) {
  if (TOPIC_COLORS[slug]) return TOPIC_COLORS[slug]
  const key = Object.keys(TOPIC_COLORS).find(k => slug?.startsWith(k) || k?.startsWith(slug))
  return key ? TOPIC_COLORS[key] : DEFAULT_TC
}

function formatDate(d: string) {
  const date = new Date(d), now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return "hace un momento"
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`
  return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" })
}

export default function BookmarksPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    document.body.style.background = "#FBFAF5"
    return () => { document.body.style.background = "#FBFAF5" }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { window.open("/login", "_blank"); return }
    fetchBookmarks()
  }, [user, loading])

  const fetchBookmarks = async () => {
    try {
      setLoadingData(true)
      const res = await fetch("/api/forum/bookmarks")
      if (res.ok) setThreads(await res.json())
    } catch (e) { console.error(e) } finally { setLoadingData(false) }
  }

  if (loading || (loadingData && threads.length === 0)) return <PageLoader />
  if (!user) return null

  const filtered = threads.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.topic.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <LoadingBar />
      <div className="fb-outer" style={{ minHeight: "100vh", background: "#FBFAF5", }}>
        <style>{`
          @media (max-width: 767px) { .fb-outer { margin-left: 0 !important; } }
          @media (min-width: 768px) and (max-width: 1160px) { .fb-outer { margin-left: 220px !important; } }
          @media (min-width: 1161px) { .fb-outer { margin-left: 280px !important; } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          .fb-card:hover { transform: translateX(4px) !important; }
          .fb-search:focus { outline: none; border-color: #0F62FE !important; box-shadow: 0 0 0 3px rgba(15,98,254,0.12) !important; }
        `}</style>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e3a8a 100%)",
          padding: "clamp(28px, 5vw, 48px) clamp(20px, 5vw, 44px)",
          position: "relative", overflow: "hidden",
          borderRadius: "clamp(0px, 3vw, 32px)",
          margin: "clamp(0px, 2vw, 24px) clamp(0px, 2vw, 24px) 0",
          boxShadow: "0 20px 50px rgba(15,23,42,0.3)"
        }}>
          <div style={{ position: "absolute", top: "-20%", right: "-4%", width: 340, height: 340, background: "radial-gradient(circle, rgba(15,98,254,0.3) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-25%", left: "8%", width: 220, height: 220, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.5s ease both" }}>
            <button
              onClick={() => router.push("/forum")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 14px", color: "#93c5fd", fontSize: 12, fontWeight: 500, cursor: "pointer", marginBottom: 20 }}
            >
              <ChevronLeft size={13} /> Volver al Foro
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bookmark size={28} color="#93c5fd" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: "0 0 6px", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  Mis Temas Guardados
                </h1>
                <p style={{ margin: 0, fontSize: 14, color: "#93c5fd", fontWeight: 500 }}>
                  Temas que has marcado para leer después
                </p>
              </div>
              {/* Stats pill */}
              {!loadingData && (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                    <Bookmark size={16} color="#60a5fa" />
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1 }}>{threads.length}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Guardados</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle2 size={16} color="#60a5fa" />
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1 }}>{threads.filter(t => t.status === "resolved").length}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resueltos</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <div style={{ padding: "clamp(20px, 4vw, 36px) clamp(16px, 4vw, 36px)", maxWidth: 900, margin: "0 auto" }}>

          {/* Search bar */}
          {!loadingData && threads.length > 0 && (
            <div style={{ position: "relative", marginBottom: 24, animation: "fadeUp 0.4s ease 0.1s both" }}>
              <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                className="fb-search"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar en tus guardados..."
                style={{
                  width: "100%", padding: "13px 16px 13px 42px",
                  fontSize: 14, fontWeight: 500,
                  border: "2px solid #f1f5f9", borderRadius: 14,
                  background: "#FBFAF5", color: "#0f172a",
                  boxSizing: "border-box", transition: "all 0.2s"
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "#f1f5f9", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", fontSize: 14, fontWeight: 500 }}
                >×</button>
              )}
            </div>
          )}

          {/* Thread List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {loadingData ? (
              <>
                <ThreadCardSkeleton />
                <ThreadCardSkeleton />
                <ThreadCardSkeleton />
              </>
            ) : filtered.length === 0 ? (
              /* Empty state */
              <div style={{ animation: "fadeUp 0.5s ease both" }}>
                <div style={{
                  background: "#FBFAF5", borderRadius: 24,
                  border: "1.5px solid #f1f5f9",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  padding: "clamp(40px, 8vw, 72px) 32px",
                  textAlign: "center"
                }}>
                  <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Bookmark size={36} color="#1e3a8a" strokeWidth={1.5} />
                  </div>
                  <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 500, color: "#0f172a" }}>
                    {search ? "Sin resultados" : "No tienes temas guardados"}
                  </h3>
                  <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b", lineHeight: 1.6, fontWeight: 500, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
                    {search
                      ? `No encontramos temas que coincidan con "${search}" en tus guardados.`
                      : "Explora el foro y guarda los temas que te interesen tocando el ícono de marcador en cualquier hilo."}
                  </p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        style={{ padding: "12px 22px", background: "#FBFAF5", border: "2px solid #e2e8f0", borderRadius: 12, fontWeight: 500, fontSize: 14, cursor: "pointer", color: "#374151" }}
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                    <Link href="/forum" style={{ textDecoration: "none" }}>
                      <button style={{ padding: "12px 24px", background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 500, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(15,23,42,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
                        <Search size={14} /> Explorar el Foro
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : filtered.map((thread, i) => {
              const tc = getTC(thread.topic.slug)
              const accentBorder = thread.isPinned ? "#f59e0b" : tc.accent
              return (
                <Link
                  key={thread.id}
                  href={`/forum/thread/${thread.id}`}
                  className="fb-card"
                  style={{
                    display: "block", textDecoration: "none",
                    background: "#FBFAF5", borderRadius: 18,
                    border: "1.5px solid rgba(15, 23, 42, 0.12)",
                    borderLeft: `4px solid ${accentBorder}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    overflow: "hidden", transition: "all 0.2s ease",
                    animation: `fadeUp 0.4s ease ${i * 0.05}s both`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 8px 28px ${tc.shadow}`
                    e.currentTarget.style.borderColor = tc.accent
                    e.currentTarget.style.borderLeftColor = accentBorder
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"
                    e.currentTarget.style.borderColor = "rgba(15, 23, 42, 0.12)"
                    e.currentTarget.style.borderLeftColor = accentBorder
                  }}
                >
                  <div style={{ padding: "clamp(16px, 3vw, 22px) clamp(16px, 3vw, 22px) clamp(16px, 3vw, 22px) 0", display: "flex", gap: 16 }}>
                    {/* Vote score */}
                    <div style={{ minWidth: 52, textAlign: "center", paddingLeft: 16, paddingTop: 2, flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 500, color: thread.score > 0 ? tc.accent : thread.score < 0 ? "#ef4444" : "#94a3b8", lineHeight: 1 }}>{thread.score}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>votos</div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <h3 style={{ margin: 0, flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 500, color: "#0f172a", lineHeight: 1.4 }}>
                          {thread.title}
                        </h3>
                        {/* Status badge */}
                        <span style={{
                          padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
                          background: thread.status === "resolved" ? "#ecfdf5" : thread.status === "locked" ? "#fef2f2" : tc.light,
                          color: thread.status === "resolved" ? "#065f46" : thread.status === "locked" ? "#dc2626" : tc.accent,
                          display: "flex", alignItems: "center", gap: 4
                        }}>
                          {thread.status === "resolved" ? <CheckCircle2 size={10} /> : thread.status === "locked" ? <Lock size={10} /> : null}
                          {thread.status === "resolved" ? "Resuelto" : thread.status === "locked" ? "Cerrado" : "Abierto"}
                        </span>
                      </div>

                      {/* Tags */}
                      {thread.tags.length > 0 && (
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                          {thread.tags.map(tag => (
                            <span key={tag.id} style={{ padding: "2px 8px", background: tc.light, color: tc.accent, fontSize: 11, fontWeight: 500, borderRadius: 6 }}>#{tag.name}</span>
                          ))}
                        </div>
                      )}

                      {/* Meta row */}
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#94a3b8", fontWeight: 500, alignItems: "center", flexWrap: "wrap" }}>
                        {/* Topic chip */}
                        <span style={{ padding: "2px 9px", background: tc.light, color: tc.accent, borderRadius: 999, fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
                          {thread.topic.name}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AvatarDisplay
                              avatar={thread.author.avatar}
                              size={18}
                              frame={thread.author.inventory?.includes("2") ? "vip" : thread.author.inventory?.includes("1") ? "ambassador" : null}
                            />
                          </div>
                          <span>{thread.author.nickname}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MessageSquare size={11} />
                          <span>{thread.commentCount} resp.</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} />
                          <span>{formatDate(thread.createdAt)}</span>
                        </div>
                        <ChevronRight size={14} style={{ marginLeft: "auto", color: tc.accent, flexShrink: 0 }} />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer CTA */}
          {!loadingData && filtered.length > 0 && (
            <div style={{ marginTop: 32, animation: "fadeUp 0.4s ease 0.3s both" }}>
              <Link href="/forum" style={{ textDecoration: "none" }}>
                <div style={{
                  background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                  borderRadius: 20, padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(15,98,254,0.2)", transition: "all 0.2s"
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Search size={20} color="#60a5fa" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 2 }}>Explorar más temas</div>
                    <div style={{ fontSize: 12, color: "#93c5fd", fontWeight: 500 }}>Encuentra nuevas discusiones para guardar</div>
                  </div>
                  <ChevronRight size={20} color="#93c5fd" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
