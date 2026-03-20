"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import {
  MessageSquare, Trophy, Heart, ArrowRight, Users, Zap,
  TrendingUp, Medal, Leaf, ChevronRight, Flame
} from "lucide-react"
import { AvatarDisplay } from "@/components/AvatarDisplay"

// ── Design token (mirrors configuracion / dashboard palette) ──────────────────
const T = {
  bg: "#FBFAF5",
  blue: "#0F62FE",
  blueLight: "#EFF6FF",
  text: "#0F172A",
  textMid: "#334155",
  textMuted: "#64748B",
  border: "#E8EDF2",
  surface: "#ffffff",
  green: "#10B981",
  amber: "#F59E0B",
  font: "'SF Pro Display','SF Pro Text','Inter',sans-serif",
  shadow: "0 2px 16px rgba(15,23,42,0.06)",
  shadowMd: "0 8px 32px rgba(15,23,42,0.10)",
}

function Avatar({ av, size = 36 }: { av: any; size?: number }) {
  try {
    return <AvatarDisplay avatar={av || { type: "character", id: "robot" }} size={size} frame={null} />
  } catch {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#0F62FE)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.4, fontWeight: 700 }}>?</div>
    )
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────
function HubCard({
  onClick, children, accentColor = T.blue, delay = "0s"
}: {
  onClick: () => void; children: React.ReactNode; accentColor?: string; delay?: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.surface,
        borderRadius: 24,
        border: `1.5px solid ${hovered ? accentColor + "44" : T.border}`,
        boxShadow: hovered ? `0 20px 48px -10px ${accentColor}28` : T.shadow,
        padding: "28px 28px 24px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
        animationFillMode: "both",
        animation: `fadeUp 0.45s ease ${delay} both`,
      }}
    >
      {/* subtle corner accent */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 100, height: 100,
        background: `radial-gradient(circle at top right, ${accentColor}14, transparent 70%)`,
        borderRadius: "0 24px 0 0", pointerEvents: "none"
      }} />
      {children}
    </div>
  )
}

function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: `${color}12`, border: `1.5px solid ${color}28`,
      borderRadius: 14, padding: "10px 16px",
    }}>
      <div style={{ color, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 500, marginTop: 1 }}>{label}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ComunidadHubPage() {
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()

  const [topPlayers, setTopPlayers] = useState<any[]>([])
  const [communityStats, setCommunityStats] = useState({ members: 0, posts: 0, trees: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const [rankRes] = await Promise.all([
          fetch("/api/rankings"),
        ])
        if (rankRes.ok) {
          const d = await rankRes.json()
          const students = d.students || d || []
          setTopPlayers(Array.isArray(students) ? students.slice(0, 5) : [])
          setCommunityStats(prev => ({ ...prev, members: students.length || 0 }))
        }
      } catch { /* silent */ }
      finally { setStatsLoading(false) }
    }
    load()
  }, [user])

  if (loading) return <PageLoader />

  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, boxSizing: "border-box" }}>
      <style>{`
        @media (max-width:767px) {
          .com-wrap { margin-left: 0 !important; padding: 0 12px 100px !important; }
          .com-hero { border-radius: 0 !important; margin: 0 0 20px !important; }
          .com-hero-pad { padding: 28px 20px 40px !important; }
          .com-hero-stats { flex-direction: column !important; gap: 10px !important; }
          .com-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .com-top-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
        }
        @media (min-width:768px) and (max-width:1160px) {
          .com-wrap { margin-left: 220px !important; }
        }
        @media (min-width:1161px) {
          .com-wrap { margin-left: 280px !important; }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shimmer { from { background-position:-200% 0 } to { background-position:200% 0 } }
        .skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8ecf0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
        .rank-row { transition: all 0.2s; }
        .rank-row:hover { background: ${T.blueLight} !important; }
      `}</style>

      {/* ── HERO BANNER ─────────────────────────────────────────────────────── */}
      <div className="com-hero" style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0F172A 40%, #1d4ed8 100%)",
        margin: "0 0 0 0", position: "relative", overflow: "hidden",
      }}>
        {/* BG Orbs */}
        <div style={{ position: "absolute", top: "-30%", right: "-8%", width: 380, height: 380, background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "15%", width: 280, height: 280, background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div className="com-wrap com-hero-pad" style={{ padding: "48px 40px 56px", position: "relative", zIndex: 1, boxSizing: "border-box" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>BIZEN</span>
            <ChevronRight size={12} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Comunidad</span>
          </div>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: "0 0 10px", fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Comunidad BIZEN
              </h1>
              <p style={{ margin: 0, fontSize: "clamp(13px,1.5vw,16px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 520 }}>
                Conéctate con estudiantes, escala en el ranking y descubre cómo tu aprendizaje transforma el mundo.
              </p>
            </div>

            {/* Quick-jump pill buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignSelf: "flex-end" }}>
              {[
                { label: "Foro", path: "/forum", color: "#60A5FA" },
                { label: "Rankings", path: "/rankings", color: "#FBBF24" },
                { label: "Impacto", path: "/impacto-social", color: "#34D399" },
              ].map(({ label, path, color }) => (
                <button key={label} onClick={() => router.push(path)} style={{
                  padding: "8px 18px", background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${color}50`, borderRadius: 999, cursor: "pointer",
                  color, fontSize: 13, fontWeight: 600, fontFamily: T.font,
                  transition: "all 0.2s", backdropFilter: "blur(6px)"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.borderColor = color }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = `${color}50` }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Stats bar */}
          <div className="com-hero-stats" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { icon: <Users size={16} />, label: "Estudiantes activos", value: statsLoading ? "..." : communityStats.members || "—", color: "#60A5FA" },
              { icon: <MessageSquare size={16} />, label: "Conversaciones", value: "Foro vivo", color: "#A78BFA" },
              { icon: <Leaf size={16} />, label: "Árboles plantados", value: "Impacto real", color: "#34D399" },
              { icon: <Trophy size={16} />, label: "Top estudiantes", value: topPlayers.length ? `${topPlayers.length} en ranking` : "...", color: "#FBBF24" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.07)", border: `1px solid ${color}30`,
                borderRadius: 14, padding: "10px 16px", backdropFilter: "blur(6px)",
              }}>
                <div style={{ color, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginTop: 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div className="com-wrap" style={{ padding: "0 40px 80px", boxSizing: "border-box" }}>

        {/* ── Section: Hub Cards ─────────────────────────────────────────── */}
        <div style={{ padding: "32px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#0F172A,#0F62FE)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color="#fff" />
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>Explora la comunidad</h2>
          </div>

          <div className="com-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 32 }}>

            {/* Foro */}
            <HubCard onClick={() => router.push("/forum")} accentColor="#0F62FE" delay="0s">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#DBEAFE,#BFDBFE)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(59,130,246,0.2)", flexShrink: 0 }}>
                  <MessageSquare size={26} color="#0F62FE" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Comunidad</div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>Foro Estudiantil</h3>
                </div>
              </div>
              <p style={{ margin: "0 0 24px", color: T.textMuted, fontSize: 14, lineHeight: 1.65 }}>
                Haz preguntas, comparte tus logros y aprende de la experiencia colectiva de toda la comunidad BIZEN.
              </p>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#EFF6FF", color: "#0F62FE", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "1.5px solid #BFDBFE" }}>
                  Explorar el Foro <ArrowRight size={15} />
                </div>
              </div>
            </HubCard>

            {/* Rankings */}
            <HubCard onClick={() => router.push("/rankings")} accentColor="#D97706" delay="0.08s">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(245,158,11,0.2)", flexShrink: 0 }}>
                  <Trophy size={26} color="#D97706" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Competencia</div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>Rankings Globales</h3>
                </div>
              </div>
              <p style={{ margin: "0 0 24px", color: T.textMuted, fontSize: 14, lineHeight: 1.65 }}>
                Compara tu XP y racha con estudiantes de todo el mundo. ¿Tienes lo que se necesita para el Top 10?
              </p>
              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#FFFBEB", color: "#D97706", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "1.5px solid #FDE68A" }}>
                  Ver Clasificación <ArrowRight size={15} />
                </div>
              </div>
            </HubCard>

            {/* Impacto Social */}
            <HubCard onClick={() => router.push("/impacto-social")} accentColor="#059669" delay="0.16s">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(16,185,129,0.2)", flexShrink: 0 }}>
                  <Heart size={26} color="#059669" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Propósito</div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>Impacto Social</h3>
                </div>
              </div>
              <p style={{ margin: "0 0 24px", color: T.textMuted, fontSize: 14, lineHeight: 1.65 }}>
                Descubre cómo cada lección completada y tu progreso se convierte en ayuda real y árboles plantados.
              </p>
              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#F0FDF4", color: "#059669", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "1.5px solid #A7F3D0" }}>
                  Ver Impacto <ArrowRight size={15} />
                </div>
              </div>
            </HubCard>
          </div>

          {/* ── Section: Top Leaders ────────────────────────────────────── */}
          {!isAdminOrTeacher && (
            <div className="com-top-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* Leaderboard preview */}
              <div style={{ background: T.surface, borderRadius: 24, border: `1.5px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden", animation: "fadeUp 0.45s ease 0.24s both" }}>
                {/* Header */}
                <div style={{ padding: "20px 24px 16px", borderBottom: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#92400E,#D97706)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Medal size={16} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: T.text }}>Top Estudiantes</span>
                  </div>
                  <button onClick={() => router.push("/rankings")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: T.blue, fontSize: 13, fontWeight: 600, fontFamily: T.font }}>
                    Ver todos <ChevronRight size={14} />
                  </button>
                </div>

                {/* Rows */}
                <div style={{ padding: "8px 0" }}>
                  {statsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px" }}>
                        <div className="skel" style={{ width: 24, height: 16, borderRadius: 6 }} />
                        <div className="skel" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                        <div style={{ flex: 1 }}>
                          <div className="skel" style={{ width: "55%", height: 13, marginBottom: 6 }} />
                          <div className="skel" style={{ width: "35%", height: 10 }} />
                        </div>
                        <div className="skel" style={{ width: 50, height: 20 }} />
                      </div>
                    ))
                  ) : topPlayers.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 24px", color: T.textMuted, fontSize: 14 }}>
                      No hay datos de ranking aún.
                    </div>
                  ) : topPlayers.map((p: any, idx: number) => {
                    const medals = ["🥇", "🥈", "🥉"]
                    const isMe = p.userId === user?.id
                    return (
                      <div key={p.userId} className="rank-row" style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "11px 24px",
                        background: isMe ? "#EFF6FF" : "transparent",
                        borderLeft: isMe ? `3px solid ${T.blue}` : "3px solid transparent",
                      }}>
                        <div style={{ width: 24, textAlign: "center", fontSize: idx < 3 ? 18 : 13, fontWeight: 700, color: idx < 3 ? "#D97706" : T.textMuted }}>
                          {idx < 3 ? medals[idx] : `#${idx + 1}`}
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Avatar av={p.avatar} size={36} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: isMe ? T.blue : T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.fullName || p.nickname || "Estudiante"}
                            {isMe && <span style={{ fontSize: 10, marginLeft: 6, background: T.blue, color: "#fff", borderRadius: 6, padding: "1px 6px" }}>Tú</span>}
                          </div>
                          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>Nivel {p.level || 1}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "4px 10px" }}>
                          <Zap size={12} color="#D97706" fill="#D97706" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#D97706" }}>{(p.xp || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Call-to-action panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Join the forum CTA */}
                <div style={{
                  background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
                  borderRadius: 24, padding: "28px 28px 24px",
                  position: "relative", overflow: "hidden",
                  animation: "fadeUp 0.45s ease 0.30s both",
                  flex: 1, display: "flex", flexDirection: "column",
                }}>
                  <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 150, height: 150, background: "radial-gradient(circle,rgba(99,102,241,.25),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: "-10%", left: "5%", width: 100, height: 100, background: "radial-gradient(circle,rgba(59,130,246,.2),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Users size={22} color="#60A5FA" />
                    </div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                      Únete a la conversación
                    </h3>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                      Cientos de estudiantes comparten dudas, logros y consejos financieros cada día.
                    </p>
                    <button onClick={() => router.push("/forum")} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "12px 22px", background: T.blue, border: "none",
                      borderRadius: 12, cursor: "pointer", color: "#fff",
                      fontSize: 14, fontWeight: 700, fontFamily: T.font,
                      boxShadow: "0 6px 20px rgba(15,98,254,0.4)", transition: "all 0.2s"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(15,98,254,0.5)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,98,254,0.4)" }}
                    >
                      Ir al Foro <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Streak / motivational CTA */}
                <div style={{
                  background: "linear-gradient(135deg,#064E3B,#065F46)",
                  borderRadius: 24, padding: "22px 24px",
                  position: "relative", overflow: "hidden",
                  animation: "fadeUp 0.45s ease 0.38s both",
                }}>
                  <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 120, height: 120, background: "radial-gradient(circle,rgba(52,211,153,.25),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                  <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Leaf size={22} color="#34D399" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#fff", marginBottom: 4 }}>Tu progreso = Impacto real</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                        Cada lección que completas contribuye a causas sociales.
                      </div>
                    </div>
                    <button onClick={() => router.push("/impacto-social")} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 18px", background: "rgba(52,211,153,0.2)",
                      border: "1px solid rgba(52,211,153,0.35)", borderRadius: 10,
                      cursor: "pointer", color: "#34D399", fontSize: 13, fontWeight: 700,
                      fontFamily: T.font, flexShrink: 0, transition: "all 0.2s", whiteSpace: "nowrap"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.3)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.2)" }}
                    >
                      Ver Impacto <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
