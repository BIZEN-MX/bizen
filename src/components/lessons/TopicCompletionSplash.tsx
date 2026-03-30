"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Download, Share2, Rocket, ArrowRight, CheckCircle2, Sparkles, MessageSquare } from "lucide-react"
import { generateBizenCertificate } from "@/utils/certificateGenerator"
import { haptic } from "@/utils/hapticFeedback"

interface TopicCompletionSplashProps {
  topicTitle: string
  topicNum: number
  studentName: string
  accuracy: number
  lessonsCompleted: string[]
  onClose: () => void
}

export function TopicCompletionSplash({
  topicTitle,
  topicNum,
  studentName,
  accuracy,
  lessonsCompleted,
  onClose
}: TopicCompletionSplashProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    setMounted(true)
    haptic.success()
    // Play celebratory sound if available
  }, [])

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      await generateBizenCertificate({
        studentName,
        topicTitle,
        accuracy,
        date: new Date().toLocaleDateString("es-MX", { day: 'numeric', month: 'long', year: 'numeric' }),
        lessonsCompleted
      })
      haptic.success()
    } catch (err) {
      console.error("Error generating certificate:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `¡Acabo de graduarme de ${topicTitle} con ${accuracy}% de precisión! 🚀`,
          body: `Hola comunidad, hoy alcancé un nuevo hito en mi formación de BIZEN. Logré dominar el tema "${topicTitle}" y obtuve mi certificado oficial. ¡Sigamos aprendiendo juntos!`,
          topicId: "topic-general", // Default 'General' topic
          tagSlugs: ["logro", "graduacion", "reconocimiento", "bizen"]
        })
      });

      if (res.ok) {
        haptic.success();
        setShared(true);
        // Short delay to show success state before redirect
        setTimeout(() => router.push("/comunidad"), 1500);
      } else {
        throw new Error("Failed to share");
      }
    } catch (err) {
      console.error("Error sharing achievement:", err);
    } finally {
      setIsSharing(false);
    }
  }

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[100005] bg-[#020617] text-white flex flex-col items-center justify-center overflow-hidden font-geist">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px]" />
        
        {/* Animated Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              opacity: 0 
            }}
            animate={{ 
              y: [0, -100], 
              opacity: [0, 0.5, 0] 
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
        {/* Main Trophy Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 animate-pulse" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-2xl">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Trophy size={64} className="text-blue-400 md:size-80" />
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 bg-yellow-500 text-slate-950 p-2 rounded-full shadow-lg"
          >
            <Star size={20} fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            Misión Cumplida
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            ¡Felicidades, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{studentName.split(' ')[0]}</span>!
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto">
            Has dominado el tema: <br />
            <span className="text-white font-bold">{topicTitle}</span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4 w-full mb-12"
        >
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Precisión</span>
            <span className="text-3xl font-black text-blue-400">{accuracy}%</span>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nivel</span>
            <span className="text-3xl font-black text-indigo-400">0{topicNum}</span>
          </div>
        </motion.div>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownload}
              disabled={isGenerating || isSharing}
              className="group relative w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-base transition-all active:scale-[0.97] hover:bg-slate-100 flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-white/5"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-3 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Download size={20} />
                  Descargar PDF
                </>
              )}
              <div className="absolute inset-0 bg-blue-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>

            <button
              onClick={handleShare}
              disabled={isSharing || shared}
              className={`group relative w-full py-4 rounded-2xl font-black text-base transition-all active:scale-[0.97] flex items-center justify-center gap-3 overflow-hidden shadow-lg ${
                shared 
                ? "bg-green-600 text-white" 
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/10"
              }`}
            >
              {isSharing ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : shared ? (
                <>
                  <CheckCircle2 size={20} />
                  ¡Publicado!
                </>
              ) : (
                <>
                  <MessageSquare size={20} />
                  Compartir Logro
                </>
              )}
              {!shared && !isSharing && (
                <motion.div
                  className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                  animate={{ translate: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating || isSharing}
            className="w-full py-4 bg-white/[0.05] hover:bg-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            Continuar al Siguiente Tema
            <ArrowRight size={20} />
          </button>
        </motion.div>

        {/* Success Checkmark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex items-center gap-2 text-slate-500"
        >
          <CheckCircle2 size={16} className="text-green-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Validado por BIZEN Academy 2026</span>
        </motion.div>
      </div>
    </div>
  )
}
