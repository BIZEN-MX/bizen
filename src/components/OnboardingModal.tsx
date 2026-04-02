"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { AVATAR_OPTIONS, AVATAR_CATEGORIES } from "@/lib/avatarOptions"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { SchoolIcon, RocketIcon } from "@/components/CustomIcons"
import { Billy } from "@/components/Billy"
import {
  BookOpen, Trophy, Globe, ChevronRight, Cake, Sparkles, Lightbulb,
  ArrowLeft, CheckCircle2, LayoutDashboard, BrainCircuit, Target,
  ArrowLeftRight, Gift, Wifi, Star, Zap, ShoppingBag,
  TrendingUp, MessageCircle, BookMarked, FlaskConical, MapPin
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "welcome" | "avatar" | "username" | "school" | "birthday" | "wallet" | "billy" | "diagnostic"

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
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1200px",
        width: "100%",
        maxWidth: 380,
        margin: "0 auto",
        cursor: "pointer"
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          borderRadius: 24,
          background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px ${accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
          padding: "clamp(18px, 4vw, 22px)",
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255,255,255,0.1)`,
          aspectRatio: "1.586 / 1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Sheen layer */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 60%, transparent 100%)",
            backgroundSize: "250% 100%",
            zIndex: 1,
            pointerEvents: "none"
          }}
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Accent glow blob */}
        <motion.div
          style={{
            position: "absolute",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: accentGlow,
            filter: "blur(40px)",
            top: "-10%",
            right: "-10%",
            zIndex: 0,
            opacity: 0.4,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Top row: Brand Logo + Wireless icon */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ 
              fontSize: 22, 
              fontWeight: 950, 
              color: "white", 
              letterSpacing: "-0.05em", 
              lineHeight: 1,
              background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.7))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              BIZEN
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
              Digital Card
            </div>
          </div>
          <div style={{ opacity: 0.4 }}>
            <Wifi size={20} color="white" style={{ transform: "rotate(90deg)" }} />
          </div>
        </div>

        {/* Balance section (Centered & Prominent) */}
        <motion.div
          style={{ position: "relative", zIndex: 2 }}
          animate={highlight === "balance" ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Disponible</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <motion.span
              style={{
                fontSize: "clamp(34px, 8vw, 44px)",
                fontWeight: 950,
                color: "white",
                letterSpacing: "-0.04em",
                textShadow: highlight === "balance" ? `0 0 30px ${accentGlow}` : "0 2px 10px rgba(0,0,0,0.3)",
                transition: "text-shadow 0.5s",
              }}
            >
              0
            </motion.span>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", fontWeight: 800, letterSpacing: "0.05em" }}>BC</span>
          </div>
        </motion.div>

        {/* Bottom row: Chip + Holder details */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
             {/* Virtual Chip */}
             <div style={{ 
               width: 38, 
               height: 28, 
               borderRadius: 6, 
               background: "linear-gradient(135deg, #d4a843 0%, #f0c060 40%, #c49030 100%)",
               border: "1px solid rgba(255,255,255,0.2)",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
             }}>
               <div style={{ width: 24, height: 18, border: "1px solid rgba(0,0,0,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 2 }}>
                 {[0,1,2,3].map(i => <div key={i} style={{ background: "rgba(0,0,0,0.05)", borderRadius: 1 }} />)}
               </div>
             </div>

             <div>
               <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Titular</div>
               <div style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "0.02em" }}>@{username || "usuario"}</div>
             </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.15em", fontFamily: "monospace" }}>•••• 0001</div>
            <div style={{ display: "flex", gap: -5, justifyContent: "flex-end", marginTop: 8 }}>
               <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }} />
               <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", marginLeft: -10 }} />
            </div>
          </div>
        </div>
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

  // Features are now strictly manual navigation

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
      
      const emailForRole = user?.email?.toLowerCase() || ""
      const isInstitutional = emailForRole.endsWith(".edu") || emailForRole.includes(".edu.")
      
      if (!isInstitutional) {
        setStep("diagnostic")
      } else {
        onComplete()
      }
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
    ? ["welcome", "avatar", "username", "school", "birthday", "wallet", "billy"]
    : ["welcome", "avatar", "username", "birthday", "wallet", "billy"]

  const stepIdx = stepList.indexOf(step) === -1 ? stepList.length : stepList.indexOf(step)
  const progressPct = Math.round(((stepIdx + 1) / (stepList.length + (step === 'diagnostic' ? 1 : 0))) * 100)

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
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -24, transition: { duration: 0.25, ease: "easeIn" as const } },
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
                  <button 
                    disabled={!birthDate}
                    onClick={() => goToStep("wallet")}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
                    Continuar
                    <ChevronRight size={20} />
                  </button>
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

                {/* Feature highlight grid (Mini cuadros sacados de la tarjeta) */}
                <div className="grid grid-cols-5 gap-2 px-2">
                  {WALLET_FEATURES.map((feat, i) => {
                    const isActive = activeFeatureIdx === i
                    return (
                      <button 
                        key={feat.id} 
                        onClick={() => setActiveFeatureIdx(i)}
                        className="flex flex-col items-center gap-2 p-2 rounded-2xl transition-all border group relative overflow-hidden"
                        style={{
                          background: isActive ? `${feat.color}15` : "rgba(255,255,255,0.03)",
                          borderColor: isActive ? `${feat.color}50` : "rgba(255,255,255,0.08)",
                          boxShadow: isActive ? `0 8px 24px ${feat.glow}` : "none",
                          transform: isActive ? "translateY(-4px)" : "translateY(0)",
                        }}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="activeFeatureGlow"
                            className="absolute inset-0 opacity-20"
                            style={{ background: `radial-gradient(circle at center, ${feat.color}, transparent 70%)` }}
                          />
                        )}
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10 transition-transform group-hover:scale-110"
                          style={{ 
                            background: isActive ? feat.color : "rgba(255,255,255,0.05)",
                            boxShadow: isActive ? `0 0 15px ${feat.glow}` : "none"
                          }}
                        >
                          <feat.icon size={18} color={isActive ? "white" : "rgba(255,255,255,0.3)"} />
                        </div>
                        <span 
                          className="text-[10px] font-black uppercase tracking-tighter relative z-10"
                          style={{ color: isActive ? "white" : "rgba(255,255,255,0.25)" }}
                        >
                          {feat.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Active feature description (Expanded) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-5 rounded-3xl border relative overflow-hidden group min-h-[120px]"
                    style={{ 
                      background: `linear-gradient(135deg, ${activeFeature.color}08, rgba(255,255,255,0.02))`, 
                      borderColor: `${activeFeature.color}30` 
                    }}
                  >
                    <div 
                      className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"
                      style={{ color: activeFeature.color }}
                    >
                      <activeFeature.icon size={120} />
                    </div>
                    <div className="relative z-10 space-y-2">
                       <h4 className="text-lg font-black" style={{ color: activeFeature.color }}>{activeFeature.label}</h4>
                       <p className="text-slate-400 text-sm leading-relaxed max-w-[90%]">{activeFeature.desc}</p>
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
                  <button onClick={() => goToStep("billy")}
                    className="relative w-full py-4 text-white rounded-2xl font-bold text-xl transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, #1d4ed8, ${activeFeature.color})`, boxShadow: `0 16px 40px ${activeFeature.glow}`, transition: "box-shadow 0.5s, background 0.5s" }}>
                    Conocer a Billy
                    <ChevronRight size={22} />
                    <motion.div className="absolute inset-0 bg-white/15"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── DIAGNOSTIC OFFER (After Save) ── */}
            {step === "diagnostic" && (
              <motion.div key="diagnostic" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col items-center text-center space-y-8">
                
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative w-40 h-40 rounded-full border-4 border-dashed border-blue-500/30 flex items-center justify-center"
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-600/40">
                      <BrainCircuit size={64} className="text-white" />
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tight leading-tight">
                    ¡Perfil Listo! Solo falta tu <span className="text-blue-400">DNA Financiero</span>
                  </h2>
                  <p className="text-slate-400 text-lg max-w-sm mx-auto">
                    Realiza un test rápido de 2 minutos para desbloquear tu ruta de aprendizaje personalizada y ver tu nivel inicial.
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button onClick={() => window.location.href = "/diagnostic"}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3">
                    Empezar Diagnóstico
                    <ChevronRight size={22} />
                  </button>
                  
                  <button onClick={onComplete}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]">
                    Omitir por ahora
                  </button>
                </div>

                <p className="text-xs text-slate-500 max-w-xs font-medium">
                  Tranquilo, si lo omites ahora podrás realizarlo después desde tu panel de control.
                </p>
              </motion.div>
            )}
            {step === "billy" && (
              <motion.div key="billy" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                  <button onClick={() => goToStep("wallet")} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black">Conoce a Billy</h2>
                    <p className="text-slate-400">Tu mentor de IA financiera personal</p>
                  </div>
                </div>

                {/* Billy hero section */}
                <div className="relative flex flex-col items-center gap-4">
                  {/* Glow blob behind Billy */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="w-64 h-64 rounded-full"
                      style={{ 
                        background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
                        opacity: 0.6
                      }}
                    />
                  </div>

                  {/* Billy mascot */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                    className="relative z-10"
                  >
                    <Billy mood="happy" size={160} showGlow={true} isStatic={true} />
                  </motion.div>

                  {/* Name badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="relative z-10 text-center"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-blue-400 text-sm font-bold">Billy Insights · Disponible ahora</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto">
                      Soy tu asistente de IA entrenado en finanzas personales. Pregúntame lo que quieras, cuando quieras.
                    </p>
                  </motion.div>
                </div>

                {/* What Billy can do */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { icon: MessageCircle, label: "Responde preguntas", desc: "Sobre presupuesto, deudas, inversión y más", color: "#3b82f6" },
                    { icon: BookMarked, label: "Explica lecciones", desc: "Resume y aclara cualquier tema del curso", color: "#8b5cf6" },
                    { icon: FlaskConical, label: "Analiza tu perfil", desc: "Genera insights basados en tu DNA financiero", color: "#10b981" },
                    { icon: Zap, label: "Siempre disponible", desc: "Las 24 hrs en cada página de la app", color: "#f59e0b" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 + i * 0.08 }}
                      className="flex flex-col gap-2 p-4 rounded-2xl border"
                      style={{ background: `${item.color}08`, borderColor: `${item.color}20` }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
                        <item.icon size={16} style={{ color: item.color }} />
                      </div>
                      <p className="text-sm font-black" style={{ color: item.color }}>{item.label}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Where to find Billy */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
                    <MapPin size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white mb-0.5">¿Dónde encontrarme?</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Busca el <span className="text-blue-400 font-bold">botón azul flotante</span> en la esquina inferior derecha de cualquier pantalla. ¡Siempre estoy ahí!
                    </p>
                  </div>
                </motion.div>

                {/* Final CTA */}
                <div className="space-y-3 pt-1">
                  {usernameError && (
                    <p className="text-sm font-bold text-red-500 text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      {usernameError}
                    </p>
                  )}
                  <button disabled={saving} onClick={handleSave}
                    className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xl transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 overflow-hidden">
                    {saving
                      ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>
                        ¡Empezar en BIZEN!
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
