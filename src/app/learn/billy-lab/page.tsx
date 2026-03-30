"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Dna, ChevronRight, CheckCircle2, Zap, ArrowLeft, BrainCircuit } from "lucide-react"
import PageLoader from "@/components/PageLoader"

interface LabStep {
  type: "theory" | "interactive" | "sim" | "matching" | "quiz"
  title: string
  content: string
  options?: string[]
  matchPairs?: { left: string, right: string }[]
  simOptions?: { label: string, xp: number, impact: string }[]
}

export default function BillyLabPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [lab, setLab] = useState<any>(null)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const res = await fetch("/api/billy-lab/generate")
        const data = await res.json()
        if (data.success) {
          setLab(data.lab)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLab()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", padding: 24, textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          style={{ marginBottom: 32 }}
        >
          <BrainCircuit size={64} color="#60a5fa" />
        </motion.div>
        <motion.h2 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: 24, fontWeight: 500, marginBottom: 16 }}
        >
          Billy está redactando tu entrenamiento...
        </motion.h2>
        <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 400 }}>
          Analizando errores anteriores y calibrando tu perfil de ADN para generar la ruta de máxima eficiencia.
        </p>
      </div>
    )
  }

  const currentStep = lab?.steps[currentStepIdx]

  const handleNext = () => {
    if (currentStepIdx < lab.steps.length - 1) {
      setCurrentStepIdx(v => v + 1)
    } else {
      setCompleted(true)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060914", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#60a5fa", textTransform: "uppercase", letterSpacing: 1 }}>Billy Lab / Delta Training</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{lab?.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {lab?.steps.map((_: any, i: number) => (
            <div key={i} style={{ width: 40, height: 4, background: i <= currentStepIdx ? "#3b82f6" : "rgba(255,255,255,0.1)", borderRadius: 2 }} />
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 800, margin: "64px auto", padding: "0 24px" }}>
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.1)", padding: "4px 12px", borderRadius: 999, marginBottom: 24, border: "1px solid rgba(59,130,246,0.2)" }}>
                 <Zap size={14} color="#60a5fa" />
                 <span style={{ fontSize: 11, fontWeight: 500, color: "#60a5fa", textTransform: "uppercase" }}>{currentStep?.type}</span>
              </div>
              
              <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 24 }}>{currentStep?.title}</h1>
              
              <div style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.8)", marginBottom: 48, whiteSpace: "pre-wrap" }}>
                {currentStep?.content}
              </div>

              {currentStep?.type === "sim" && (
                <div style={{ display: "grid", gap: 12, marginBottom: 48 }}>
                  {currentStep.simOptions?.map((opt: any, i: number) => (
                    <button 
                      key={i}
                      onClick={handleNext}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: 20, borderRadius: 12, color: "#fff", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{opt.impact}</div>
                    </button>
                  ))}
                </div>
              )}

              <button 
                onClick={handleNext}
                style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
              >
                {currentStepIdx === lab.steps.length - 1 ? "Finalizar Laboratorio" : "Siguiente Paso"}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center", padding: "64px 0" }}
            >
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "1px solid rgba(16,185,129,0.3)" }}>
                <CheckCircle2 size={40} color="#10b981" />
              </div>
              <h1 style={{ fontSize: 40, fontWeight: 500, marginBottom: 16 }}>ADN Calibrado</h1>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 48 }}>
                Has completado tu Laboratorio Billy Delta. Tu perfil matemático ha sido actualizado con los nuevos datos de esta sesión.
              </p>
              <button 
                onClick={() => router.push("/dashboard")}
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", padding: "16px 32px", borderRadius: 12, color: "#fff", fontWeight: 500, cursor: "pointer" }}
              >
                Volver al Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
