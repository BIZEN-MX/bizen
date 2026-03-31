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
  bg: "#F4F6F9",
  blue: "#0F62FE",
  blueLight: "#EFF6FF",
  text: "#0F172A",
  textMid: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  surface: "#ffffff",
  green: "#10B981",
  greenLight: "#F0FDF4",
  amber: "#F59E0B",
  amberLight: "#FFFBEB",
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif',
  radius: 20,
  shadow: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
}

function Avatar({ av, size = 36 }: { av: any; size?: number }) {
  try {
    return <AvatarDisplay avatar={av || { type: "character", id: "robot" }} size={size} frame={null} />
  } catch {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.4, fontWeight: 500 }}>?</div>
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
        background: `linear-gradient(135deg, rgba(255,255,255,0.8), ${accentColor}1A)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: T.radius,
        border: `1px solid ${hovered ? accentColor : `${accentColor}30`}`,
        boxShadow: hovered ? `0 20px 40px -12px ${accentColor}30` : T.shadow,
        padding: "18px 20px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        position: "relative",
        overflow: "hidden",
        animationFillMode: "both",
        animation: `fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay} both`,
      }}
    >
      {children}
    </div>
  )
}

function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: `${color}08`, border: `1px solid ${color}20`,
      borderRadius: 12, padding: "10px 16px",
    }}>
      <div style={{ color, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 500, color: T.text, lineHeight: 1 }}>{value}</div>
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
  const [communityStats, setCommunityStats] = useState({ 
    members: 0, 
    activeToday: 0, 
    xpGenerated: "...", 
    ecoStatus: "...", 
    activityLabel: "..." 
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const [rankRes, statRes] = await Promise.all([
          fetch("/api/rankings"),
          fetch("/api/community/stats")
        ])
        
        if (rankRes.ok) {
          const d = await rankRes.json()
          const students = d.students || d || []
          setTopPlayers(Array.isArray(students) ? students.slice(0, 5) : [])
        }
        
        if (statRes.ok) {
          const s = await statRes.json()
          setCommunityStats(s)
        }
      } catch (err) {
        console.error("Error loading community hub:", err)
      } finally {
        setStatsLoading(false)
      }
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
          .com-hero { border-radius: 0 !important; margin: 0 !important; }
          .com-hero-pad { padding: 32px 20px 40px !important; }
          .com-hero-stats { grid-template-columns: 1fr 1fr !important; display: grid !important; gap: 8px !important; }
          .com-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .com-top-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
        @media (min-width:768px) and (max-width:1160px) {
          .com-wrap { margin-left: 220px !important; }
        }
        @media (min-width:1161px) {
          .com-wrap { margin-left: 280px !important; }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%, 100% { transform: translate(0,0) rotate(0) } 33% { transform: translate(10px, -20px) rotate(2deg) } 66% { transform: translate(-10px, 15px) rotate(-1deg) } }
        @keyframes shimmer { from { background-position:-200% 0 } to { background-position:200% 0 } }
        .skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8ecf0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
        .rank-row { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); border-radius: 12px; margin: 2px 8px; }
        .rank-row:hover { background: ${T.blue}08 !important; transform: scale(1.01); }
      `}</style>

      {/* ── HERO BANNER ─────────────────────────────────────────────────────── */}
      <div className="com-hero" style={{
        background: "#0B1E5E",
        margin: "16px 16px 0", borderRadius: 24, position: "relative", overflow: "hidden",
      }}>
        {/* BG Orbs & Mesh */}
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", animation: "float 20s infinite linear" }} />
        <div style={{ position: "absolute", bottom: "-30%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", animation: "float 15s infinite linear reverse" }} />
        <div style={{ 
          position: "absolute", inset: 0, opacity: 0.1, 
          backgroundImage: "radial-gradient(rgba(255,255,255,.5) 1.5px,transparent 1.5px)", 
          backgroundSize: "32px 32px", pointerEvents: "none" 
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08, pointerEvents: "none", mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />

        <div className="com-wrap com-hero-pad" style={{ padding: "40px 40px 48px", position: "relative", zIndex: 1, boxSizing: "border-box" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, opacity: 0.8 }}>
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 500, opacity: 0.5 }}>Plataforma</span>
            <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Comunidad Global</span>
          </div>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
            <div style={{ flex: "1 1 500px" }}>
              <div style={{ 
                display: "inline-flex", alignItems: "center", gap: 8, 
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
                padding: "6px 14px", borderRadius: 99, marginBottom: 20,
                border: "1px solid rgba(255,255,255,0.15)"
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Comunidad en Vivo
                </span>
              </div>
              <h1 style={{ margin: "0 0 16px", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 500, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Aprender es mejor <br />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>en compañía.</span>
              </h1>
              <p style={{ margin: 0, fontSize: "clamp(14px, 1.6vw, 17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 540, fontWeight: 400 }}>
                Únete a miles de estudiantes que, como tú, están transformando su futuro financiero mientras generan un impacto positivo real.
              </p>
            </div>

            {/* Premium action group */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
               {[
                { label: "Ir al Foro", path: "/forum", color: "#60A5FA", icon: <MessageSquare size={18} /> },
                { label: "Ver Ranking", path: "/rankings", color: "#FBBF24", icon: <Trophy size={18} /> },
              ].map(({ label, path, color, icon }) => (
                <button key={label} onClick={() => router.push(path)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "14px 24px", background: "#fff",
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)",
                  borderRadius: 16, cursor: "pointer",
                  color: "#0F172A", fontSize: 14, fontWeight: 700, fontFamily: T.font,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", border: "none"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0,0,0,0.3)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.2)" }}
                >
                  <div style={{ color }}>{icon}</div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Stats bar - Enhanced Glassmorphism */}
          <div className="com-hero-stats" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-start" }}>
            {[
              { icon: <Users size={20} />, label: "Total Miembros", value: statsLoading ? "..." : (communityStats.members || 0).toLocaleString(), color: "#60A5FA" },
              { icon: <Flame size={20} />, label: "Actividad Hoy", value: statsLoading ? "..." : communityStats.activityLabel, color: "#F87171" },
              { icon: <Leaf size={20} />, label: "Ecosistema BIZEN", value: statsLoading ? "..." : communityStats.ecoStatus, color: "#4ADE80" },
              { icon: <Zap size={20} />, label: "XP Generada", value: statsLoading ? "..." : communityStats.xpGenerated, color: "#FBBF24" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "14px 20px", backdropFilter: "blur(24px)",
                minWidth: 180
              }}>
                <div style={{ 
                  color, flexShrink: 0, width: 40, height: 40, borderRadius: 10, 
                  background: "rgba(255,255,255,0.08)", display: "flex", 
                  alignItems: "center", justifyContent: "center" 
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "#fff", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
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
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color="#fff" />
            </div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: T.text, letterSpacing: "-0.02em" }}>Explora la comunidad</h2>
          </div>

          <div className="com-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 32 }}>

            {/* Foro */}
            <HubCard onClick={() => router.push("/forum")} accentColor="#0F62FE" delay="0s">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${T.blue}15`, border: `1px solid ${T.blue}30`, backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageSquare size={24} color="#0F62FE" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Comunidad</div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: T.text, letterSpacing: "-0.02em" }}>Foro Estudiantil</h3>
                </div>
              </div>
              <p style={{ margin: "0 0 24px", color: T.textMuted, fontSize: 14, lineHeight: 1.65 }}>
                Haz preguntas, comparte tus logros y aprende de la experiencia colectiva de toda la comunidad BIZEN.
              </p>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: `${T.blue}15`, color: "#0F62FE", borderRadius: 10, fontWeight: 600, fontSize: 14, border: `1px solid ${T.blue}40`, backdropFilter: "blur(10px)" }}>
                  Explorar el Foro <ArrowRight size={15} />
                </div>
              </div>
            </HubCard>

            {/* Rankings */}
            <HubCard onClick={() => router.push("/rankings")} accentColor="#D97706" delay="0.08s">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${T.amber}15`, border: `1px solid ${T.amber}30`, backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Trophy size={24} color="#D97706" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Competencia</div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: T.text, letterSpacing: "-0.02em" }}>Rankings Globales</h3>
                </div>
              </div>
              <p style={{ margin: "0 0 24px", color: T.textMuted, fontSize: 14, lineHeight: 1.65 }}>
                Compara tu XP y racha con estudiantes de todo el mundo. ¿Tienes lo que se necesita para el Top 10?
              </p>
              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: `${T.amber}15`, color: "#D97706", borderRadius: 10, fontWeight: 600, fontSize: 14, border: `1px solid ${T.amber}40`, backdropFilter: "blur(10px)" }}>
                  Ver Clasificación <ArrowRight size={15} />
                </div>
              </div>
            </HubCard>

            {/* Impacto Social */}
            <HubCard onClick={() => router.push("/impacto-social")} accentColor="#059669" delay="0.16s">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${T.green}15`, border: `1px solid ${T.green}30`, backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Heart size={24} color="#059669" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Propósito</div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: T.text, letterSpacing: "-0.02em" }}>Impacto Social</h3>
                </div>
              </div>
              <p style={{ margin: "0 0 24px", color: T.textMuted, fontSize: 14, lineHeight: 1.65 }}>
                Descubre cómo cada lección completada y tu progreso se convierte en ayuda real y árboles plantados.
              </p>
              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: `${T.green}15`, color: "#059669", borderRadius: 10, fontWeight: 600, fontSize: 14, border: `1px solid ${T.green}40`, backdropFilter: "blur(10px)" }}>
                  Ver Impacto <ArrowRight size={15} />
                </div>
              </div>
            </HubCard>
          </div>

          {/* ── Section: Top Leaders ────────────────────────────────────── */}
          {!isAdminOrTeacher && (
            <div className="com-top-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* Leaderboard preview */}
              <div style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))`, backgroundColor: `${T.blue}08`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 24, border: `1.5px solid rgba(255,255,255,0.6)`, boxShadow: T.shadow, overflow: "hidden", animation: "fadeUp 0.45s ease 0.24s both" }}>
                {/* Header */}
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: T.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Medal size={16} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 500, fontSize: 15, color: T.text }}>Top Estudiantes</span>
                  </div>
                  <button onClick={() => router.push("/rankings")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: T.blue, fontSize: 12, fontWeight: 500, fontFamily: T.font }}>
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
                    const isMe = p.userId === user?.id
                    return (
                      <div key={p.userId} className="rank-row" style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "11px 24px",
                        background: isMe ? "#EFF6FF" : "transparent",
                        borderLeft: isMe ? `3px solid ${T.blue}` : "3px solid transparent",
                      }}>
                        <div style={{ width: 24, textAlign: "center", display: 'flex', justifyContent: 'center' }}>
                          {idx < 3 ? <Medal size={18} color={idx === 0 ? "#FBBF24" : idx === 1 ? "#94A3B8" : "#B45309"} /> : <span style={{ fontSize: 12, fontWeight: 500, color: T.textMuted }}>#{idx + 1}</span>}
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Avatar av={p.avatar} size={36} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: isMe ? T.blue : T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.fullName || p.nickname || "Estudiante"}
                            {isMe && <span style={{ fontSize: 9, marginLeft: 6, background: T.blue, color: "#fff", borderRadius: 4, padding: "1px 5px", textTransform: "uppercase" }}>Tú</span>}
                          </div>
                          <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>Nivel {p.level || 1}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: T.amberLight, border: `1px solid ${T.amber}20`, borderRadius: 8, padding: "4px 10px" }}>
                          <Zap size={11} color="#D97706" fill="#D97706" />
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#D97706" }}>{(p.xp || 0).toLocaleString()}</span>
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
                  background: "#0B1E5E",
                  borderRadius: T.radius, padding: "24px",
                  position: "relative", overflow: "hidden",
                  animation: "fadeUp 0.4s ease 0.3s both",
                  flex: 1, display: "flex", flexDirection: "column",
                }}>
                  <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 150, height: 150, background: "radial-gradient(circle,rgba(99,102,241,.25),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: "-10%", left: "5%", width: 100, height: 100, background: "radial-gradient(circle,rgba(59,130,246,.2),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Users size={20} color="#60A5FA" />
                    </div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em" }}>
                      Únete a la conversación
                    </h3>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                      Cientos de estudiantes comparten dudas, logros y consejos financieros cada día.
                    </p>
                    <button onClick={() => router.push("/forum")} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 20px", background: T.blue, border: "none",
                      borderRadius: 10, cursor: "pointer", color: "#fff",
                      fontSize: 14, fontWeight: 500, fontFamily: T.font,
                      transition: "all 0.2s"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.background = "#0A50D4" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = T.blue }}
                    >
                      Ir al Foro <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Streak / motivational CTA */}
                <div style={{
                  background: "#064E3B",
                  borderRadius: T.radius, padding: "20px",
                  position: "relative", overflow: "hidden",
                  animation: "fadeUp 0.4s ease 0.35s both",
                }}>
                  <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 120, height: 120, background: "radial-gradient(circle,rgba(52,211,153,.25),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                  <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Leaf size={20} color="#34D399" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14, color: "#fff", marginBottom: 2 }}>Tu progreso = Impacto real</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                        Cada lección que completas contribuye a causas sociales.
                      </div>
                    </div>
                    <button onClick={() => router.push("/impacto-social")} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", background: "rgba(52,211,153,0.1)",
                      border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8,
                      cursor: "pointer", color: "#34D399", fontSize: 12, fontWeight: 500,
                      fontFamily: T.font, flexShrink: 0, transition: "all 0.2s", whiteSpace: "nowrap"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.2)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.1)" }}
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
