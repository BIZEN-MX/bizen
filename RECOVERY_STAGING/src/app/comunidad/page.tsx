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

function Avatar({ av, size = 36 }: { av: any; size?: number }) {
  try {
    return <AvatarDisplay avatar={av || { type: "character", id: "robot" }} size={size} frame={null} />
  } catch {
    return (
      <div className="rounded-full bg-blue-600 flex items-center justify-center text-white font-black" style={{ width: size, height: size, fontSize: size * 0.4 }}>?</div>
    )
  }
}

function HubCard({
  onClick, children, hoverBorder = "hover:border-blue-300", glowClass = "bg-blue-400", delay = "0"
}: {
  onClick: () => void; children: React.ReactNode; hoverBorder?: string; glowClass?: string; delay?: string
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden flex flex-col p-8 lg:p-10 rounded-[2rem] bg-white border-[1.5px] border-slate-100 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${hoverBorder}`}
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none ${glowClass}`} />
      <div className="relative z-10 flex flex-col h-full animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}>
        {children}
      </div>
    </div>
  )
}

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
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* ── HERO BANNER ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1E5E] to-[#1e3a8a] rounded-b-[2rem] lg:rounded-[3rem] lg:m-6 lg:mt-4 shadow-2xl">
        {/* BG Orbs & Mesh */}
        <div className="absolute -top-1/2 -right-[10%] w-[500px] h-[500px] bg-indigo-500/25 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-[30%] -left-[5%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 px-6 py-12 md:px-16 md:py-20 lg:px-24 lg:py-24 max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 md:mb-12 opacity-80">
            <span className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Plataforma</span>
            <ChevronRight size={14} className="text-white/30" />
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Comunidad Global</span>
          </div>

          {/* Title row */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 xl:gap-24 mb-16 md:mb-24">
            <div className="flex-1 max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 mb-8 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)] animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Comunidad en Vivo
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-8">
                Aprender es mejor <br className="hidden md:block" />
                <span className="text-white/40">en compañía.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 font-semibold leading-relaxed max-w-2xl">
                Únete a miles de estudiantes que están transformando su futuro financiero mientras generan un impacto positivo real.
              </p>
            </div>

            {/* Premium action group */}
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
              {/* Primary Action */}
              <button 
                onClick={() => router.push("/forum")} 
                className="group flex flex-1 xl:flex-none items-center justify-center sm:justify-start gap-4 px-8 py-4 md:py-5 rounded-[1.25rem] bg-gradient-to-b from-blue-500 to-blue-600 text-white font-black text-sm md:text-base shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] border border-blue-400 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 group-hover:bg-white/30 transition-all">
                  <MessageSquare size={20} className="text-white" />
                </div>
                Ir al Foro
              </button>

              {/* Secondary Action */}
              <button 
                onClick={() => router.push("/rankings")} 
                className="group flex flex-1 xl:flex-none items-center justify-center sm:justify-start gap-4 px-8 py-4 md:py-5 rounded-[1.25rem] bg-white/5 backdrop-blur-xl text-white font-black text-sm md:text-base shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shadow-inner group-hover:scale-110 group-hover:bg-amber-500/30 transition-all">
                  <Trophy size={20} className="text-amber-400" />
                </div>
                Ver Ranking
              </button>
            </div>
          </div>

          {/* Hero Stats bar - Enhanced Glassmorphism */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: <Users size={24} />, label: "Miembros", value: statsLoading ? "..." : (communityStats.members || 0).toLocaleString(), color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
              { icon: <Flame size={24} />, label: "Actividad Hoy", value: statsLoading ? "..." : communityStats.activityLabel, color: "bg-red-500/20 text-red-300 border-red-500/30" },
              { icon: <Leaf size={24} />, label: "Ecosistema BIZEN", value: statsLoading ? "..." : communityStats.ecoStatus, color: "bg-green-500/20 text-green-300 border-green-500/30" },
              { icon: <Zap size={24} />, label: "XP Generada", value: statsLoading ? "..." : communityStats.xpGenerated, color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
            ].map(({ icon, label, value, color }) => (
              <div 
                key={label} 
                className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 bg-white/5 border border-white/10 rounded-[2rem] p-6 lg:p-5 backdrop-blur-md text-center sm:text-left"
              >
                <div className={`w-14 h-14 sm:w-12 sm:h-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner ${color}`}>
                    {icon}
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white leading-none tracking-tight">{value}</div>
                  <div className="text-[10px] text-white/50 font-bold mt-2 uppercase tracking-widest">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-20">

        {/* ── Section: Hub Cards ─────────────────────────────────────────── */}
        <div className="mb-16 lg:mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">Explora la comunidad</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mx-auto lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">

            {/* Foro */}
            <HubCard onClick={() => router.push("/forum")} hoverBorder="hover:border-blue-300" glowClass="bg-blue-400">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[1.25rem] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <MessageSquare size={28} className="text-blue-600" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] mb-1.5">Comunidad</div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Foro Estudiantil</h3>
                </div>
              </div>
              <p className="text-base font-medium text-slate-500 leading-relaxed mb-10">
                Haz preguntas, comparte tus logros y aprende de la experiencia colectiva de toda la comunidad BIZEN.
              </p>
              <div className="mt-auto">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 group-hover:bg-blue-100/80 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest border border-blue-100 transition-colors">
                  Explorar el Foro <ArrowRight size={16} />
                </div>
              </div>
            </HubCard>

            {/* Rankings */}
            <HubCard onClick={() => router.push("/rankings")} hoverBorder="hover:border-amber-400" glowClass="bg-amber-400" delay="0.1">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[1.25rem] bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Trophy size={28} className="text-amber-500" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em] mb-1.5">Competencia</div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rankings Globales</h3>
                </div>
              </div>
              <p className="text-base font-medium text-slate-500 leading-relaxed mb-10">
                Compara tu XP y racha con estudiantes de todo el mundo. ¿Tienes lo que se necesita para el Top 10?
              </p>
              <div className="mt-auto">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 group-hover:bg-amber-100/80 text-amber-600 rounded-xl font-black text-xs uppercase tracking-widest border border-amber-100 transition-colors">
                  Ver Clasificación <ArrowRight size={16} />
                </div>
              </div>
            </HubCard>

            {/* Impacto Social */}
            <HubCard onClick={() => router.push("/impacto-social")} hoverBorder="hover:border-emerald-400" glowClass="bg-emerald-400" delay="0.2">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Heart size={28} className="text-emerald-500" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.15em] mb-1.5">Propósito</div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Impacto Social</h3>
                </div>
              </div>
              <p className="text-base font-medium text-slate-500 leading-relaxed mb-10">
                Descubre cómo cada lección completada y tu progreso se convierte en ayuda real y árboles plantados.
              </p>
              <div className="mt-auto">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 group-hover:bg-emerald-100/80 text-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest border border-emerald-100 transition-colors">
                  Ver Impacto <ArrowRight size={16} />
                </div>
              </div>
            </HubCard>
          </div>
        </div>

        {/* ── Section: Top Leaders ────────────────────────────────────── */}
        {!isAdminOrTeacher && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">

            {/* Leaderboard preview */}
            <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-full min-h-[400px]">
              {/* Header */}
              <div className="p-6 lg:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Medal size={24} className="text-white" />
                  </div>
                  <span className="font-black text-xl lg:text-2xl text-slate-900 tracking-tight">Top Estudiantes</span>
                </div>
                <button onClick={() => router.push("/rankings")} className="flex items-center gap-1 text-xs uppercase tracking-widest font-black text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl">
                  Ver todos <ChevronRight size={16} />
                </button>
              </div>

              {/* Rows */}
              <div className="p-4 lg:p-6 space-y-2 flex-1 flex flex-col">
                {statsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                      <div className="w-6 h-4 bg-slate-200 rounded" />
                      <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0" />
                      <div className="flex-1">
                        <div className="w-1/2 h-5 bg-slate-200 rounded mb-2" />
                        <div className="w-1/4 h-3 bg-slate-200 rounded" />
                      </div>
                      <div className="w-16 h-8 bg-slate-200 rounded-xl" />
                    </div>
                  ))
                ) : topPlayers.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-32 h-32 mb-8 relative">
                      <div className="absolute inset-0 bg-blue-500/10 rounded-[2rem] blur-[20px]" />
                      <div className="relative w-full h-full bg-slate-50 border-[1.5px] border-slate-100 rounded-[2rem] flex flex-col items-center justify-center shadow-inner">
                        <Trophy size={48} className="text-slate-300 mb-2" strokeWidth={1.5} />
                        <Zap size={20} className="text-slate-200 absolute bottom-4 right-4" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight mb-3">La pista está libre</h4>
                    <p className="text-base font-medium text-slate-500 max-w-[280px] mx-auto mb-8 leading-relaxed">
                      El ranking global acaba de reiniciarse. ¡Gana XP ahora y sé el primero en liderar la tabla!
                    </p>
                    <button onClick={() => router.push("/dashboard")} className="px-8 py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-colors border border-blue-100 shadow-sm">
                      Ganar Puntos
                    </button>
                  </div>
                ) : topPlayers.map((p: any, idx: number) => {
                  const isMe = p.userId === user?.id
                  return (
                    <div key={p.userId} className={`flex items-center gap-3 lg:gap-5 p-3 lg:p-4 rounded-[1.5rem] transition-all duration-300 hover:bg-slate-50 ${isMe ? "bg-blue-50/50 border-[1.5px] border-blue-200 shadow-sm" : "border-[1.5px] border-transparent"}`}>
                      <div className="w-8 flex justify-center shrink-0">
                        {idx < 3 ? <Medal size={24} className={idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-400" : "text-amber-700"} /> : <span className="text-sm font-black text-slate-400">#{idx + 1}</span>}
                      </div>
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center shadow-sm">
                        <Avatar av={p.avatar} size={56} />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className={`font-black tracking-tight text-base lg:text-lg truncate ${isMe ? "text-blue-700" : "text-slate-900"}`}>
                          {p.fullName || p.nickname || "Estudiante"}
                          {isMe && <span className="text-[9px] ml-3 bg-blue-600 text-white rounded-md px-2 py-0.5 uppercase tracking-widest align-middle">Tú</span>}
                        </div>
                        <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Nivel {p.level || 1}</div>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 shadow-sm shrink-0">
                        <Zap size={16} className="text-amber-500" fill="currentColor" />
                        <span className="text-sm font-black text-amber-600">{(p.xp || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Call-to-action panel */}
            <div className="flex flex-col gap-6 lg:gap-8">

              {/* Join the forum CTA */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1E5E] to-blue-900 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-[20%] -right-[10%] w-60 h-60 bg-indigo-500/30 rounded-full blur-[60px] pointer-events-none group-hover:bg-indigo-400/40 transition-colors" />
                <div className="absolute -bottom-[10%] left-[5%] w-48 h-48 bg-blue-400/20 rounded-full blur-[50px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 shadow-inner backdrop-blur-md">
                    <Users size={28} className="text-blue-300" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight mb-4">
                    Únete a la conversación
                  </h3>
                  <p className="text-lg text-white/60 font-semibold leading-relaxed mb-10 max-w-sm">
                    Cientos de estudiantes comparten dudas, logros y consejos financieros cada día.
                  </p>
                  <button onClick={() => router.push("/forum")} className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30">
                    Ir al Foro <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              {/* Streak / motivational CTA */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-[#064E3B] rounded-[2.5rem] p-8 lg:p-10 shadow-xl group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-[30%] -right-[5%] w-48 h-48 bg-emerald-400/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-emerald-400/30 transition-colors" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm">
                    <Leaf size={28} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-xl text-white mb-2 tracking-tight">Tu progreso = Impacto real</div>
                    <div className="text-sm font-semibold text-emerald-200/70 leading-relaxed">
                      Cada lección que completas contribuye a causas sociales.
                    </div>
                  </div>
                  <button onClick={() => router.push("/impacto-social")} className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-2xl text-emerald-400 font-black text-xs uppercase tracking-widest transition-colors shrink-0">
                    Ver Impacto <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
