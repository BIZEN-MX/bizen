"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dna, 
  Fingerprint, 
  Activity, 
  Target, 
  ChevronRight, 
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  UserCheck
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"

interface DNAEvolutionScreenProps {
  currentProfile: string
  newProfile: string
  stats: {
    mentalidad: number
    bases: number
    optimizacion: number
    ahorro: number
    riesgos: number
  }
  nextTopicId: string
  nextTopicTitle: string
  onClose?: () => void
}

export default function DNAEvolutionScreen({
  currentProfile = "Iniciado por Billy",
  newProfile = "Billy Constructor",
  stats = { mentalidad: 85, bases: 90, optimizacion: 75, ahorro: 95, riesgos: 60 },
  nextTopicId = "tema-09",
  nextTopicTitle = "Estrategias de Inversión",
  onClose
}: DNAEvolutionScreenProps) {
  const [phase, setPhase] = useState<"scanning" | "revealing" | "ready">("scanning")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Sequence: Scan for 3s, then reveal for 2s, then allow action
    const t1 = setTimeout(() => setPhase("revealing"), 3500)
    const t2 = setTimeout(() => setPhase("ready"), 6000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (!mounted) return null

  const statEntries = [
    { label: "Mentalidad", value: stats.mentalidad, icon: UserCheck, color: "rgba(59, 130, 246, 1)" },
    { label: "Bases", value: stats.bases, icon: Target, color: "rgba(34, 197, 94, 1)" },
    { label: "Optimización", value: stats.optimizacion, icon: Zap, color: "rgba(245, 158, 11, 1)" },
    { label: "Ahorro", value: stats.ahorro, icon: TrendingUp, color: "rgba(139, 92, 246, 1)" },
    { label: "Riesgos", value: stats.riesgos, icon: ShieldCheck, color: "rgba(239, 68, 68, 1)" },
  ]

  const evolutionContent = (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#0a0f1e", // Deep Space Blue
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      zIndex: 999999,
      overflow: "hidden",
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "10%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 450, height: 450, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(70px)" }} />

      <AnimatePresence mode="wait">
        {phase === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div style={{ position: "relative", marginBottom: 32 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                style={{ width: 140, height: 140, borderRadius: "50%", border: "2px dashed rgba(59,130,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Fingerprint size={64} color="#3b82f6" opacity={0.8} />
              </motion.div>
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
                style={{ position: "absolute", left: "-20px", right: "-20px", height: "2px", background: "linear-gradient(90deg, transparent, #3b82f6, transparent)", boxShadow: "0 0 15px #3b82f6" }}
              />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: -0.5, marginBottom: 8, color: "white" }}>Recalibrando ADN BIZEN</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Analizando trayectoria en Cimientos (01-05)...</p>
          </motion.div>
        )}

        {phase === "revealing" && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: "100%", maxWidth: 500, padding: "0 24px", textAlign: "center" }}
          >
            <Dna size={48} color="#60a5fa" style={{ marginBottom: 24, margin: "0 auto" }} />
            <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 40, background: "linear-gradient(90deg, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Evolución Finalizada
            </h1>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {statEntries.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <stat.icon size={16} color={stat.color} />
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 500 }}>{stat.label}</div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ height: "100%", background: stat.color, boxShadow: `0 0 10px ${stat.color}50` }}
                      />
                    </div>
                  </div>
                  <div style={{ fontWeight: 500, color: stat.color }}>{stat.value}%</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: "100%", maxWidth: 600, padding: "0 24px", textAlign: "center" }}
          >
            <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
               <motion.div 
                 animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                 transition={{ repeat: Infinity, duration: 3 }}
                 style={{ position: "absolute", inset: -20, background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", borderRadius: "50%" }}
               />
               <div style={{ position: "relative", zIndex: 1, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", padding: "12px 24px", borderRadius: "999px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={18} color="#60a5fa" />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: 1 }}>DNA Detectado</span>
               </div>
            </div>

            <h2 style={{ fontSize: 40, fontWeight: 500, marginBottom: 12, lineHeight: 1, color: "white" }}>{newProfile}</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>
              Billy ha analizado tu ADN financiero y ha detectado una capacidad táctica superior. Has evolucionado a tu siguiente nivel estratégico.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (onClose) onClose()
                router.push(`/courses/${nextTopicId}`)
              }}
              style={{
                background: "linear-gradient(90deg, #3b82f6, #6366f1)",
                padding: "20px 40px",
                borderRadius: 24,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                border: "none",
                color: "white"
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, opacity: 0.8, textTransform: "uppercase", fontWeight: 500 }}>Siguiente Parada SUGERIDA</div>
                <div style={{ fontSize: 18, fontWeight: 500 }}>{nextTopicTitle}</div>
              </div>
              <ChevronRight size={24} />
            </motion.div>

            <div style={{ marginTop: 32 }}>
              <button 
                onClick={() => {
                  if (onClose) onClose()
                  router.push("/courses?noredirect=true")
                }}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                O quiero elegir mi propio camino
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Grid Lines */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
        zIndex: -1
      }} />
    </div>
  )

  return createPortal(evolutionContent, document.body)
}
