"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { AVATAR_OPTIONS, AVATAR_CATEGORIES } from "@/lib/avatarOptions"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { SchoolIcon, RocketIcon } from "@/components/CustomIcons"
import {
  BookOpen, Trophy, Globe, ChevronRight, Cake, Sparkles, Lightbulb,
  ArrowLeft, CheckCircle2, LayoutDashboard, BrainCircuit, Target,
  ArrowLeftRight, Gift, Coins, Wifi, CreditCard, Star, Zap, ShoppingBag,
  Lock, TrendingUp
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "welcome" | "avatar" | "username" | "school" | "birthday" | "wallet"

interface OnboardingModalProps {
  onComplete: () => void
}

// ─── Particles ────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 5,
}))

// ─── Wallet Features for highlight carousel ───────────────────────────────────
const WALLET_FEATURES = [
  {
    id: "transfer",
    icon: ArrowLeftRight,
    label: "Transferir",
    desc: "Envía Bizcoins a tus amigos y compañeros al instante. Comparte tu éxito.",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.4)",
    cardHighlight: "transfer",
  },
  {
    id: "redeem",
    icon: Gift,
    label: "Canjear",
    desc: "Convierte tus Bizcoins en recompensas exclusivas, descuentos y experiencias reales.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
    cardHighlight: "redeem",
  },
  {
    id: "bizcoins",
    icon: Star,
    label: "Bizcoins",
    desc: "Gana moneda digital por cada lección completada, reto logrado y día de racha.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
    cardHighlight: "balance",
  },
  {
    id: "invest",
    icon: TrendingUp,
    label: "Simular Inversión",
    desc: "Practica en el simulador bursátil con activos reales sin arriesgar tu dinero.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.4)",
    cardHighlight: "invest",
  },
  {
    id: "store",
    icon: ShoppingBag,
    label: "Tienda Exclusiva",
    desc: "Accede a la tienda BIZEN con avatares premium, marcos y beneficios de temporada.",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
    cardHighlight: "store",
  },
]

// ─── Animated BIZEN Card Component ───────────────────────────────────────────
function BizenCard({
  username,
  avatar,
  highlight,
  accentColor,
  accentGlow,
}: {
  username: string
  avatar: any
  highlight: string
  accentColor: string
  accentGlow: string
}) {
  return (
    <div
      style={{
        perspective: "1000px",
        width: "100%",
        maxWidth: 360,
        margin: "0 auto",
      }}
    >
      <motion.div
        animate={{ rotateY: [0, 3, -3, 0], rotateX: [0, -2, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transformStyle: "preserve-3d",
          borderRadius: 24,
          background: "linear-gradient(135deg, #0f1f4a 0%, #0a1535 40%, #0e1d3d 70%, #1a237e 100%)",
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
          padding: "28px 28px 24px",
          position: "relative",
          overflow: "hidden",
          border: `1.5px solid rgba(255,255,255,0.08)`,
          transition: "box-shadow 0.5s ease",
        }}
      >
        {/* Sheen layer */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            zIndex: 1,
          }}
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Accent glow blob */}
        <motion.div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: accentGlow,
            filter: "blur(60px)",
            top: -60,
            right: -60,
            zIndex: 0,
            opacity: 0.5,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Circuit lines decoration */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.06 }}
          viewBox="0 0 360 200"
        >
          <path d="M0 150 Q60 100 120 150 T240 150 T360 150" stroke="white" strokeWidth="1" fill="none" />
          <path d="M0 100 Q90 60 180 100 T360 100" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="120" cy="150" r="3" fill="white" />
          <circle cx="240" cy="150" r="3" fill="white" />
          <circle cx="180" cy="100" r="2" fill="white" />
        </svg>

        {/* Top row: Brand + Chip */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 12px ${accentGlow}` }}>
                <Sparkles size={16} color="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 900, color: "white", letterSpacing: -0.5 }}>BIZEN</span>
            </div>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Financial Card</span>
          </div>

          {/* Chip */}
          <motion.div
            style={{
              width: 42,
              height: 32,
              borderRadius: 6,
              background: "linear-gradient(135deg, #d4a843 0%, #f0c060 40%, #c49030 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            animate={highlight === "transfer" ? { scale: [1, 1.1, 1], boxShadow: ["0 2px 8px rgba(0,0,0,0.4)", `0 4px 16px ${accentGlow}`, "0 2px 8px rgba(0,0,0,0.4)"] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div style={{ width: 28, height: 20, borderRadius: 3, border: "1px solid rgba(0,0,0,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 3 }}>
              {[0, 1, 2, 3].map(i => <div key={i} style={{ background: "rgba(0,0,0,0.15)", borderRadius: 1 }} />)}
            </div>
          </motion.div>
        </div>

        {/* Balance section */}
        <motion.div
          style={{ position: "relative", zIndex: 2, marginBottom: 20 }}
          animate={highlight === "balance" ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Bizcoins</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <motion.span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "white",
                letterSpacing: -1,
                textShadow: highlight === "balance" ? `0 0 20px ${accentGlow}` : "none",
                transition: "text-shadow 0.5s",
              }}
            >
              0
            </motion.span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>BZC</span>
            <motion.div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 999,
                padding: "3px 8px",
              }}
            >
              <TrendingUp size={10} color="#10b981" />
              <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>Listo</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Action buttons row */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Transferir", icon: ArrowLeftRight, id: "transfer" },
            { label: "Canjear", icon: Gift, id: "redeem" },
            { label: "Tienda", icon: ShoppingBag, id: "store" },
            { label: "Invertir", icon: TrendingUp, id: "invest" },
          ].map((btn) => {
            const isActive = highlight === btn.id
            return (
              <motion.div
                key={btn.id}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 4px",
                  borderRadius: 12,
                  background: isActive ? `${accentColor}22` : "rgba(255,255,255,0.05)",
                  border: isActive ? `1.5px solid ${accentColor}88` : "1.5px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  boxShadow: isActive ? `0 0 20px ${accentGlow}` : "none",
                }}
                animate={isActive ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [`0 0 0px ${accentGlow}`, `0 0 24px ${accentGlow}`, `0 0 0px ${accentGlow}`],
                } : { scale: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <btn.icon
                  size={15}
                  color={isActive ? accentColor : "rgba(255,255,255,0.4)"}
                  style={{ transition: "color 0.3s" }}
                />
                <span style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: isActive ? "white" : "rgba(255,255,255,0.35)",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  transition: "color 0.3s",
                }}>
                  {btn.label}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom: Avatar + card number */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: `2px solid ${accentColor}`, boxShadow: `0 0 10px ${accentGlow}` }}>
              <AvatarDisplay avatar={avatar} size={34} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "white" }}>@{username || "usuario"}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Miembro BIZEN</div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: 1, marginBottom: 2 }}>CARD</div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>•••• •••• 0001</div>
          </div>
        </div>

        {/* NFC/Contactless icon */}
        <Wifi
          size={18}
          color="rgba(255,255,255,0.2)"
          style={{ position: "absolute", bottom: 24, right: 28, transform: "rotate(90deg)", zIndex: 2 }}
        />
      </motion.div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { user, refreshUser } = useAuth()
  const supabase = createClient()

  const [step, setStep] = useState<Step>("welcome")
  const [selectedAvatar, setSelectedAvatar] = useState<any>(AVATAR_OPTIONS[0])
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([])
  const [usernameError, setUsernameError] = useState("")
  const [saving, setSaving] = useState(false)
  const [avatarCategory, setAvatarCategory] = useState(0)
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0)

  // Cycle through wallet features automatically
  useEffect(() => {
    if (step !== "wallet") return
    const interval = setInterval(() => {
      setActiveFeatureIdx((prev) => (prev + 1) % WALLET_FEATURES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [step])

  useEffect(() => {
    fetch("/api/schools")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSchools(data); else setSchools([]) })
      .catch(() => setSchools([]))
  }, [])

  const goToStep = useCallback((next: Step) => setStep(next), [])

  const validateUsername = (val: string): string => {
    if (val.length < 3) return "Mínimo 3 caracteres"
    if (val.length > 30) return "Máximo 30 caracteres"
    if (!/^[a-zA-Z0-9_.-]+$/.test(val)) return "Solo letras, números, _ . -"
    return ""
  }

  const handleUsernameChange = (val: string) => {
    setUsername(val)
    setUsernameError(validateUsername(val))
  }

  const handleSave = async () => {
    const err = validateUsername(username)
    if (err) { setUsernameError(err); return }
    setSaving(true)
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, avatar: selectedAvatar, birthDate: birthDate || null, schoolId: selectedSchool }),
      })
      if (!res.ok) {
        let errorMsg = "Error al guardar"
        try { const data = await res.json(); errorMsg = data.error || errorMsg } catch { }
        setUsernameError(errorMsg)
        if (errorMsg.toLowerCase().includes("usuario")) setStep("username")
        setSaving(false)
        return
      }
      await supabase.auth.refreshSession()
      await refreshUser()
      onComplete()
    } catch {
      setUsernameError("Error de conexión. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const profileName = user?.user_metadata?.full_name?.split(" ")[0] || "usuario"
  const emailForRole = user?.email?.toLowerCase() || ""
  const isInstitutional = emailForRole.endsWith(".edu") || emailForRole.includes(".edu.")
  const stepList: Step[] = isInstitutional
    ? ["welcome", "avatar", "username", "school", "birthday", "wallet"]
    : ["welcome", "avatar", "username", "birthday", "wallet"]

  const stepIdx = stepList.indexOf(step)
  const progressPct = Math.round(((stepIdx + 1) / stepList.length) * 100)

  const calcAge = (dateStr: string): number | null => {
    if (!dateStr) return null
    const bd = new Date(dateStr)
    const today = new Date()
    let age = today.getFullYear() - bd.getFullYear()
    const m = today.getMonth() - bd.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
    return age
  }

  const activeFeature = WALLET_FEATURES[activeFeatureIdx]

  const pageVariants = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, x: -24, transition: { duration: 0.25 } },
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020617] text-white flex flex-col font-geist overflow-y-auto">
      {/* ── Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px]" />
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            animate={{ y: [0, -80, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="relative z-10 px-6 py-6 md:py-8 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "circOut" }}
            />
          </div>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start md:justify-center px-4 md:px-6 pb-20 md:pb-0">
        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-[32px] p-6 md:p-12 shadow-2xl shadow-black/40">
          <AnimatePresence mode="wait">

            {/* ── WELCOME ── */}
            {step === "welcome" && (
              <motion.div key="welcome" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col items-center text-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    Comienza tu viaje
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                    Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{profileName}</span>
                  </h1>
                  <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                    Bienvenido a la nueva era de la educación financiera. En 2 minutos estarás listo para dominar tus finanzas.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                  {[
                    { icon: BrainCircuit, label: "IA Mentor" },
                    { icon: Target, label: "Retos" },
                    { icon: LayoutDashboard, label: "Simuladores" },
                    { icon: BookOpen, label: "30 Temas" },
                    { icon: Trophy, label: "Premios" },
                    { icon: Globe, label: "Impacto" },
                  ].map((feat, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors">
                      <feat.icon size={22} className="text-blue-500" />
                      <span className="text-xs font-bold text-slate-300">{feat.label}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => goToStep("avatar")}
                  className="group w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3">
                  ¡Vamos allá!
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* ── AVATAR ── */}
            {step === "avatar" && (
              <motion.div key="avatar" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col space-y-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => goToStep("welcome")} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black">Elige tu Avatar</h2>
                    <p className="text-slate-400">Esta será tu identidad en BIZEN</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                    <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-indigo-400 overflow-hidden shadow-2xl">
                      <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden">
                        <AvatarDisplay avatar={selectedAvatar} size={120} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {AVATAR_CATEGORIES.map((cat, i) => (
                        <button key={i} onClick={() => setAvatarCategory(i)}
                          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${avatarCategory === i
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 md:grid-cols-6 gap-3 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {AVATAR_OPTIONS.filter((av) => AVATAR_CATEGORIES[avatarCategory].ids.includes(av.id)).map((av) => (
                        <button key={av.id} onClick={() => setSelectedAvatar(av)}
                          className={`aspect-square rounded-xl p-1 transition-all ${selectedAvatar?.id === av.id
                            ? "bg-blue-600 ring-2 ring-blue-500/50 scale-105"
                            : "bg-white/5 hover:bg-white/10"}`}>
                          <AvatarDisplay avatar={av} size={50} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => goToStep("username")}
                  className="w-full py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  Siguiente paso
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* ── USERNAME ── */}
            {step === "username" && (
              <motion.div key="username" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col space-y-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => goToStep("avatar")} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black">Tu Identidad</h2>
                    <p className="text-slate-400">¿Cómo quieres que te llamen?</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre de usuario</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
                      <input type="text" value={username} onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`w-full bg-white/5 border-2 ${usernameError ? "border-red-500/50" : "border-white/10 group-focus-within:border-blue-500/50"} rounded-2xl py-4 pl-9 pr-4 text-lg font-semibold focus:outline-none focus:bg-white/[0.08] transition-all`}
                        placeholder="tu_nombre" />
                    </div>
                    {usernameError
                      ? <p className="text-xs font-bold text-red-500 ml-1">{usernameError}</p>
                      : <p className="text-xs text-slate-500 ml-1">Solo letras, números y guiones bajos.</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Intereses (opcional)</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-4 text-lg font-semibold focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all h-32 resize-none"
                      placeholder="¿Qué quieres aprender en BIZEN?" />
                  </div>
                </div>
                <button disabled={!!usernameError || username.length < 3}
                  onClick={() => goToStep(isInstitutional ? "school" : "birthday")}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  Continuar
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* ── SCHOOL ── */}
            {step === "school" && (
              <motion.div key="school" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col space-y-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => goToStep("username")} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black">Tu Institución</h2>
                    <p className="text-slate-400">Conecta con tu comunidad educativa</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <SchoolIcon size={24} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Escuela Seleccionada</p>
                      <select className="w-full bg-transparent text-lg font-bold outline-none" value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
                        <option value="" disabled className="bg-slate-900">Selecciona tu escuela...</option>
                        {schools.map((s) => <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <p className="text-center text-xs text-slate-500 px-8">
                    Al seleccionar tu escuela podrás participar en rankings exclusivos y desbloquear beneficios institucionales.
                  </p>
                </div>
                <button disabled={!selectedSchool} onClick={() => goToStep("birthday")}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  Siguiente
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* ── BIRTHDAY ── */}
            {step === "birthday" && (
              <motion.div key="birthday" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col space-y-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => goToStep(isInstitutional ? "school" : "username")} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black">Tu Cumpleaños</h2>
                    <p className="text-slate-400">Queremos celebrar contigo</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <Cake className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-semibold focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all [color-scheme:dark]" />
                  </div>
                  {birthDate && (() => {
                    const age = calcAge(birthDate)
                    return age !== null && age >= 0 && age <= 120 ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                          <CheckCircle2 size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-green-400">¡Tienes {age} años!</p>
                          <p className="text-xs text-green-500/70 uppercase font-black">Estás listo para BIZEN</p>
                        </div>
                      </motion.div>
                    ) : null
                  })()}
                </div>
                <div className="space-y-3">
                  <button onClick={() => goToStep("wallet")}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
                    Continuar
                    <ChevronRight size={20} />
                  </button>
                  {!birthDate && (
                    <button onClick={() => goToStep("wallet")}
                      className="w-full py-3 text-slate-500 hover:text-slate-300 font-bold transition-colors text-sm">
                      Omitir este paso
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── WALLET REVEAL ── */}
            {step === "wallet" && (
              <motion.div key="wallet" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest"
                    style={{ background: `${activeFeature.color}15`, borderColor: `${activeFeature.color}40`, color: activeFeature.color, transition: "all 0.5s ease" }}
                  >
                    <Zap size={11} />
                    Tu tarjeta BIZEN
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-black">Todo el poder financiero en tus manos</h2>
                  <p className="text-slate-400 text-sm">Una sola tarjeta para gestionar, aprender y crecer.</p>
                </div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <BizenCard
                    username={username}
                    avatar={selectedAvatar}
                    highlight={activeFeature.cardHighlight}
                    accentColor={activeFeature.color}
                    accentGlow={activeFeature.glow}
                  />
                </motion.div>

                {/* Feature highlight pills */}
                <div className="flex gap-2 justify-center flex-wrap">
                  {WALLET_FEATURES.map((feat, i) => (
                    <button key={feat.id} onClick={() => setActiveFeatureIdx(i)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
                      style={{
                        background: activeFeatureIdx === i ? `${feat.color}20` : "rgba(255,255,255,0.04)",
                        borderColor: activeFeatureIdx === i ? `${feat.color}60` : "rgba(255,255,255,0.08)",
                        color: activeFeatureIdx === i ? feat.color : "rgba(255,255,255,0.4)",
                        transform: activeFeatureIdx === i ? "scale(1.05)" : "scale(1)",
                        boxShadow: activeFeatureIdx === i ? `0 0 12px ${feat.glow}` : "none",
                      }}>
                      <feat.icon size={11} />
                      {feat.label}
                    </button>
                  ))}
                </div>

                {/* Active feature description */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3 p-4 rounded-2xl border"
                    style={{ background: `${activeFeature.color}08`, borderColor: `${activeFeature.color}25` }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${activeFeature.color}20`, border: `1.5px solid ${activeFeature.color}40` }}>
                      <activeFeature.icon size={17} style={{ color: activeFeature.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-black mb-0.5" style={{ color: activeFeature.color }}>{activeFeature.label}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{activeFeature.desc}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* CTA */}
                <div className="space-y-3 pt-2">
                  {usernameError && (
                    <p className="text-sm font-bold text-red-500 text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      {usernameError}
                    </p>
                  )}
                  <button disabled={saving} onClick={handleSave}
                    className="relative w-full py-4 text-white rounded-2xl font-bold text-xl transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, #1d4ed8, ${activeFeature.color})`, boxShadow: `0 16px 40px ${activeFeature.glow}`, transition: "box-shadow 0.5s, background 0.5s" }}>
                    {saving
                      ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>
                        ¡Activar mi tarjeta!
                        <RocketIcon size={22} className="text-white" />
                      </>}
                    <motion.div className="absolute inset-0 bg-white/15"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 px-6 py-6 text-center hidden md:block">
        <p className="text-xs text-slate-500 font-medium">Explora el futuro de las finanzas con BIZEN. © 2026.</p>
      </div>
    </div>
  )
}
