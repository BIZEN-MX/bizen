"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  Settings, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Power
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnButton from "@/components/ReturnButton"

const SUPER_ADMINS = ["diego@bizen.mx"]

export default function AdminSystemPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // System State
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const isAllowed = isLoaded && user?.emailAddresses[0]?.emailAddress && SUPER_ADMINS.includes(user.emailAddresses[0].emailAddress.toLowerCase())

  useEffect(() => {
    if (isLoaded && !isAllowed) {
      router.push("/dashboard")
    }
  }, [isLoaded, isAllowed, router])

  useEffect(() => {
    if (isAllowed) fetchSystemState()
  }, [isAllowed])

  const fetchSystemState = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/system`)
      const data = await res.json()
      if (res.ok && data.maintenanceMode !== undefined) {
        setMaintenanceMode(data.maintenanceMode)
      }
    } catch (error) {
      console.error("Error fetching system state:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenanceMode })
      })
      if (res.ok) {
        setMessage({ type: 'ok', text: "Estado del sistema BIZEN actualizado correctamente." })
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

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 md:p-12 font-sans selection:bg-slate-500/30">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-500/10 p-2 rounded-lg border border-slate-500/20">
                <Settings className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-slate-400 font-bold tracking-widest text-xs uppercase">Bizen Super Admin</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Sistema Maestro</h1>
            <p className="text-slate-400 text-lg">Controles absolutos sobre el tráfico y el estado de la plataforma.</p>
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
          <form onSubmit={handleSubmit} className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
            
            <div className="mb-8 pb-6 border-b border-white/5">
              <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <Power className={maintenanceMode ? "text-red-500" : "text-emerald-500"} /> Modo Mantenimiento
                  </h2>
                  <p className="text-sm text-slate-400 max-w-lg">
                    Si activas esta opción, todos los alumnos verán inmediatamente una pantalla de bloqueo por mantenimiento. Solo los correos Super Admin ({SUPER_ADMINS.join(", ")}) podrán seguir navegando libremente para hacer pruebas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative inline-flex h-10 w-20 items-center justify-center rounded-full transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-emerald-500'}`}
                >
                  <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-5' : '-translate-x-5'}`} />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-xs mix-blend-difference opacity-50 px-2 pointer-events-none w-full">
                    {maintenanceMode ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`w-full flex items-center justify-center gap-2 text-white px-5 py-4 rounded-xl font-bold text-lg transition-all shadow-xl disabled:opacity-50 ${
                maintenanceMode 
                ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-500/20" 
                : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 hover:shadow-slate-500/20"
              }`}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSubmitting ? "Ejecutando Orden..." : "Guardar Estado del Sistema"}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
