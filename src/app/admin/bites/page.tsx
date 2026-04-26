"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  PlaySquare, 
  UploadCloud, 
  Video, 
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import MuxUploader from '@mux/mux-uploader-react'

const SUPER_ADMINS = ["diego@bizen.mx"]

export default function AdminBitesPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Dummy State for now
  const [videos, setVideos] = useState<any[]>([
    { id: '1', title: '¿Qué es el interés compuesto?', url: 'https://example.com/video1.mp4', duration: '0:45', active: true },
    { id: '2', title: 'Error #1 al invertir', url: 'https://example.com/video2.mp4', duration: '0:58', active: true },
  ])

  const [formTitle, setFormTitle] = useState("")
  // Removed formUrl since Mux handles the upload internally.
  const [uploadUrl, setUploadUrl] = useState<string | null>(null)

  const isAllowed = isLoaded && user?.emailAddresses[0]?.emailAddress && SUPER_ADMINS.includes(user.emailAddresses[0].emailAddress.toLowerCase())

  useEffect(() => {
    if (isLoaded && !isAllowed) {
      router.push("/dashboard")
    }
  }, [isLoaded, isAllowed, router])

  const handleFetchUploadUrl = async () => {
    if (!formTitle.trim()) {
        setMessage({ type: 'err', text: "Primero ponle un título al video" })
        return
    }
    
    setIsSubmitting(true)
    setMessage(null)

    try {
        const res = await fetch("/api/admin/bites/upload", { method: "POST" })
        const data = await res.json()
        
        if (res.ok) {
            setUploadUrl(data.uploadUrl)
        } else {
            setMessage({ type: 'err', text: data.error || "Error al conectar con Mux" })
            setIsSubmitting(false)
        }
    } catch (e) {
        setMessage({ type: 'err', text: "Error de conexión" })
        setIsSubmitting(false)
    }
  }

  const handleUploadSuccess = () => {
        const newVideo = {
            id: Math.random().toString(),
            title: formTitle,
            url: "Procesando en Mux...",
            duration: '0:00',
            active: true
        }
        setVideos([newVideo, ...videos])
        setFormTitle("")
        setUploadUrl(null)
        setMessage({ type: 'ok', text: "¡Video subido a Mux correctamente!" })
        setIsSubmitting(false)
        setTimeout(() => setMessage(null), 4000)
  }

  const handleDelete = (id: string) => {
      if(!confirm("¿Eliminar este Bite? Ya no aparecerá en el feed de los alumnos.")) return;
      setVideos(videos.filter(v => v.id !== id))
  }

  if (!isLoaded || !isAllowed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 md:p-12 font-sans selection:bg-rose-500/30">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-12 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                <PlaySquare className="w-6 h-6 text-rose-400" />
              </div>
              <span className="text-rose-400 font-bold tracking-widest text-xs uppercase">Bizen Super Admin</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Gestión de BIZEN Bites</h1>
            <p className="text-slate-400 text-lg">Sube y administra los videos cortos verticales estilo TikTok para el feed de la comunidad.</p>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-2xl sticky top-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-rose-400" />
                    Subir Nuevo Bite
                </h2>
                
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Título del Video</span>
                        <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            disabled={!!uploadUrl}
                            placeholder="Ej: 3 Reglas de Oro..."
                            className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50"
                        />
                    </label>

                    {!uploadUrl ? (
                        <button
                            type="button"
                            onClick={handleFetchUploadUrl}
                            disabled={isSubmitting || !formTitle.trim()}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-5 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-rose-500/20"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlaySquare className="w-5 h-5" />}
                            {isSubmitting ? "Conectando con Mux..." : "Siguiente: Subir Video"}
                        </button>
                    ) : (
                        <div className="mt-4 border border-rose-500/30 bg-rose-500/5 rounded-xl p-4">
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 block">Arrastra tu video aquí</span>
                            <MuxUploader 
                                endpoint={uploadUrl} 
                                onSuccess={handleUploadSuccess}
                                className="mux-uploader-bizen"
                            />
                            <button onClick={() => { setUploadUrl(null); setIsSubmitting(false); }} className="mt-4 text-xs text-slate-500 hover:text-white transition-colors text-center w-full block">Cancelar Subida</button>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Videos Feed */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Video className="w-5 h-5 text-slate-400" />
                    Feed Activo ({videos.length})
                </h3>
                
                {videos.length === 0 ? (
                    <div className="py-24 text-center bg-[#0b1120] border border-white/5 rounded-3xl border-dashed">
                        <PlaySquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">No hay videos en la rotación.</p>
                    </div>
                ) : (
                    videos.map(v => (
                        <div key={v.id} className="bg-[#0b1120] border border-white/5 hover:border-rose-500/30 rounded-2xl p-4 flex items-center justify-between group transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-24 bg-slate-900 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative">
                                    <Video className="w-6 h-6 text-slate-700" />
                                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                                        {v.duration}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{v.title}</h4>
                                    <a href={v.url} target="_blank" rel="noreferrer" className="text-rose-400 text-xs font-medium hover:underline flex items-center gap-1 mt-1">
                                        <LinkIcon className="w-3 h-3" />
                                        Ver Origen
                                    </a>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDelete(v.id)}
                                className="p-3 rounded-xl bg-red-500/10 text-slate-500 hover:text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
