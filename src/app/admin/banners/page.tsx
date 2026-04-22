"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  Megaphone, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnButton from "@/components/ReturnButton"

const SUPER_ADMINS = ["diego@bizen.mx"]

export default function AdminBannerPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Banner State
  const [isActive, setIsActive] = useState(false)
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [link, setLink] = useState("")
  const [linkText, setLinkText] = useState("")
  const [color, setColor] = useState("blue") // blue, orange, emerald, purple

  const isAllowed = isLoaded && user?.emailAddresses[0]?.emailAddress && SUPER_ADMINS.includes(user.emailAddresses[0].emailAddress.toLowerCase())

  useEffect(() => {
    if (isLoaded && !isAllowed) {
      router.push("/dashboard")
    }
  }, [isLoaded, isAllowed, router])

  useEffect(() => {
    if (isAllowed) fetchBanner()
  }, [isAllowed])

  const fetchBanner = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/banner`)
      const data = await res.json()
      if (res.ok && data.banner) {
        setIsActive(data.banner.isActive || false)
        setTitle(data.banner.title || "")
        setText(data.banner.text || "")
        setLink(data.banner.link || "")
        setLinkText(data.banner.linkText || "")
        setColor(data.banner.color || "blue")
      }
    } catch (error) {
      console.error("Error fetching banner:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const payload = { isActive, title, text, link, linkText, color }

    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setMessage({ type: 'ok', text: "Banner global actualizado correctamente" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await res.json()
        setMessage({ type: 'err', text: data.error || "Error al guardar" })
      }
    } catch (error) {
      setMessage({ type: 'err', text: "Error de conexión" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || !isAllowed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  const colorClasses = {
    blue: "from-blue-600 to-indigo-600",
    orange: "from-orange-500 to-amber-600",
    emerald: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-fuchsia-600",
    red: "from-red-500 to-rose-600"
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                <Megaphone className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-purple-400 font-bold tracking-widest text-xs uppercase">Bizen Super Admin</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Anuncios y Banners</h1>
            <p className="text-slate-400 text-lg">Configura un anuncio global que aparecerá en el dashboard de todos los alumnos.</p>
          </div>
          <ReturnButton href="/teacher/dashboard" label="Volver al Dashboard" />
        </header>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-3 p-4 mb-8 rounded-2xl border ${
                message.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-bold">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Previsualización en Vivo */}
          <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-slate-400 font-bold mb-4 text-sm uppercase tracking-widest">Vista Previa</h3>
            <div className={`w-full rounded-2xl overflow-hidden relative ${isActive ? '' : 'opacity-50 grayscale'}`}>
              <div className={`bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} p-4 sm:px-6 shadow-lg shadow-black/20 relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="flex items-center gap-3">
                  <div className="min-w-[40px] h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 hidden sm:flex">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base leading-tight mb-0.5">{title || "Título del Anuncio"}</h3>
                    <p className="text-white/80 font-medium text-[13px] m-0">{text || "Escribe un mensaje emocionante para tus alumnos aquí..."}</p>
                  </div>
                </div>
                {link && linkText && (
                  <div className="bg-white text-slate-900 px-5 py-2 rounded-xl text-[13px] font-black cursor-pointer shadow-md hover:scale-105 transition-transform flex-shrink-0 text-center">
                    {linkText}
                  </div>
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-black/80 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                      <EyeOff size={16} /> Banner Oculto
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <div>
                <h2 className="text-xl font-bold">Estado del Banner</h2>
                <p className="text-sm text-slate-400">Activa o desactiva la visibilidad global.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-400">Título Corto</span>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="¡Reto Bizcoinvert Activo!"
                  className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  maxLength={40}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-400">Color/Tema</span>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="blue">Azul Corporate</option>
                  <option value="orange">Naranja (Anáhuac/Energía)</option>
                  <option value="emerald">Esmeralda (Éxito/Dinero)</option>
                  <option value="purple">Púrpura (Especial/Live)</option>
                  <option value="red">Rojo (Urgente/Pánico)</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-2 mb-6">
              <span className="text-sm font-bold text-slate-400">Texto Principal</span>
              <textarea
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Participa y gana recompensas reales al terminar el simulador."
                className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[100px] resize-none"
                maxLength={120}
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-400">Texto del Botón (Opcional)</span>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Participar Ahora"
                  className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-400">URL del Botón (Opcional)</span>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/simulators/stocks"
                  className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSubmitting ? "Publicando..." : "Guardar y Publicar Globalmente"}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
