"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { AVATAR_OPTIONS, AVATAR_CATEGORIES } from "@/lib/avatarOptions"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { SchoolIcon, CakeIcon, PartyIcon, RocketIcon, ChevronRightIcon } from "@/components/CustomIcons"
import { 
  BookOpen, Bot, Award, Banknote, Trophy, 
  Globe, ChevronRight, User, Cake, Star, Sparkles, Lightbulb,
  ArrowLeft, CheckCircle2, LayoutDashboard, BrainCircuit, Target
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "welcome" | "avatar" | "username" | "school" | "birthday"

interface OnboardingModalProps {
    onComplete: () => void
}

// ─── Particle Component ───────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
}))

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const { user, refreshUser } = useAuth()
    const supabase = createClient()

    const [step, setStep] = useState<Step>("welcome")
    const [selectedAvatar, setSelectedAvatar] = useState<any>(AVATAR_OPTIONS[0])
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [selectedSchool, setSelectedSchool] = useState("")
    const [schools, setSchools] = useState<{ id: string, name: string }[]>([])
    const [usernameError, setUsernameError] = useState("")
    const [saving, setSaving] = useState(false)
    const [avatarCategory, setAvatarCategory] = useState(0)
    const [screenSize, setScreenSize] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        fetch("/api/schools")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSchools(data)
                else setSchools([])
            })
            .catch(() => setSchools([]))
    }, [])

    // No hay sugerencias de nombre. Debe empezar en blanco.

    const goToStep = useCallback((next: Step) => {
        setStep(next)
    }, [])

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
                try {
                    const data = await res.json()
                    errorMsg = data.error || errorMsg
                } catch { }
                setUsernameError(errorMsg)
                setSaving(false)
                
                // If it's a nickname error, go back to that step
                if (errorMsg.toLowerCase().includes("usuario")) {
                    setStep("username")
                }
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
    const emailForRole = user?.email?.toLowerCase() || ''
    const isInstitutional = emailForRole.endsWith('.edu') || emailForRole.includes('.edu.')
    const stepList: Step[] = isInstitutional
        ? ["welcome", "avatar", "username", "school", "birthday"]
        : ["welcome", "avatar", "username", "birthday"]
    
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

    // Variants for animations
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-[#020617] text-white flex flex-col font-geist overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px]" />
                
                {PARTICLES.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-white/20"
                        style={{
                            top: p.top,
                            left: p.left,
                            width: p.size,
                            height: p.size,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Header / Progress */}
            <div className="relative z-10 px-6 py-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <span className="text-sm font-bold tracking-tight uppercase text-blue-400">Onboarding</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-black/40">
                    <AnimatePresence mode="wait">
                        {step === "welcome" && (
                            <motion.div 
                                key="welcome"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col items-center text-center space-y-8"
                            >
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

                                <button 
                                    onClick={() => goToStep("avatar")}
                                    className="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    ¡Vamos allá!
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {step === "avatar" && (
                            <motion.div 
                                key="avatar"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col space-y-8"
                            >
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
                                                <button
                                                    key={i}
                                                    onClick={() => setAvatarCategory(i)}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                                        avatarCategory === i 
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                                                    }`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-5 md:grid-cols-6 gap-3 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                            {AVATAR_OPTIONS.filter(av => AVATAR_CATEGORIES[avatarCategory].ids.includes(av.id)).map((av) => (
                                                <button
                                                    key={av.id}
                                                    onClick={() => setSelectedAvatar(av)}
                                                    className={`aspect-square rounded-xl p-1 transition-all ${
                                                        selectedAvatar?.id === av.id 
                                                        ? "bg-blue-600 ring-2 ring-blue-500/50 scale-105" 
                                                        : "bg-white/5 hover:bg-white/10"
                                                    }`}
                                                >
                                                    <AvatarDisplay avatar={av} size={50} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => goToStep("username")}
                                    className="w-full py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Siguiente paso
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === "username" && (
                            <motion.div 
                                key="username"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col space-y-8"
                            >
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
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => handleUsernameChange(e.target.value)}
                                                className={`w-full bg-white/5 border-2 ${usernameError ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-blue-500/50'} rounded-2xl py-4 pl-9 pr-4 text-lg font-semibold focus:outline-none focus:bg-white/[0.08] transition-all`}
                                                placeholder="tu_nombre"
                                            />
                                        </div>
                                        {usernameError ? (
                                            <p className="text-xs font-bold text-red-500 ml-1">{usernameError}</p>
                                        ) : (
                                            <p className="text-xs text-slate-500 ml-1">Solo letras, números y guiones bajos.</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Intereses (opcional)</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-4 text-lg font-semibold focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all h-32 resize-none"
                                            placeholder="¿Qué quieres aprender en BIZEN?"
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={!!usernameError || username.length < 3}
                                    onClick={() => goToStep(isInstitutional ? "school" : "birthday")}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Continuar
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === "school" && (
                            <motion.div 
                                key="school"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col space-y-8"
                            >
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
                                            <select
                                                className="w-full bg-transparent text-lg font-bold outline-none focus:text-white transition-colors"
                                                value={selectedSchool}
                                                onChange={e => setSelectedSchool(e.target.value)}
                                            >
                                                <option value="" disabled className="bg-slate-900">Selecciona tu escuela...</option>
                                                {schools.map(s => (
                                                    <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-slate-500 px-8">
                                        Al seleccionar tu escuela podrás participar en rankings exclusivos y desbloquear beneficios institucionales.
                                    </p>
                                </div>

                                <button 
                                    disabled={!selectedSchool}
                                    onClick={() => goToStep("birthday")}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Siguiente
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === "birthday" && (
                            <motion.div 
                                key="birthday"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col space-y-8"
                            >
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
                                    <div className="relative group">
                                        <Cake className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={e => setBirthDate(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-semibold focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all [color-scheme:dark]"
                                        />
                                    </div>

                                    {birthDate && (() => {
                                        const age = calcAge(birthDate)
                                        return age !== null && age >= 0 && age <= 120 ? (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-4"
                                            >
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
                                    {usernameError && (
                                        <p className="text-sm font-bold text-red-500 text-center mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            {usernameError}
                                        </p>
                                    )}
                                    <button 
                                        disabled={saving}
                                        onClick={handleSave}
                                        className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xl transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 overflow-hidden"
                                    >
                                        {saving ? (
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                ¡Finalizar!
                                                <RocketIcon size={22} className="text-white" />
                                            </>
                                        )}
                                        <motion.div 
                                            className="absolute inset-0 bg-white/20"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "200%" }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </button>
                                    {!birthDate && (
                                        <button 
                                            disabled={saving}
                                            onClick={handleSave}
                                            className="w-full py-3 text-slate-500 hover:text-slate-300 font-bold transition-colors"
                                        >
                                            Omitir por ahora
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                       )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer / Info */}
            <div className="relative z-10 px-6 py-8 text-center">
                <p className="text-xs text-slate-500 font-medium">
                    Explora el futuro de las finanzas con BIZEN.© 2026.
                </p>
            </div>
        </div>
    )
}
