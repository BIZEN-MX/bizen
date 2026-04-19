"use client"

import React from "react"
import { motion } from "framer-motion"
import { Dna, Zap, ChevronRight, Activity, Cpu } from "lucide-react"
import { useRouter } from "next/navigation"

interface BillyLabWidgetProps {
  adnProfile: string
  adnScore: number
  nextTopicId?: string
  nextTopicTitle?: string
}

export default function BillyLabWidget({
  adnProfile = "Billy Constructor",
  adnScore = 75,
  nextTopicId = "tema-09",
  nextTopicTitle = "Estrategias de Inversión"
}: BillyLabWidgetProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: "100%",
        background: "linear-gradient(135deg, #0a0f1e 0%, #171c2d 100%)",
        borderRadius: 24,
        padding: "18px 20px",
        border: "1px solid rgba(59,130,246,0.3)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(59,130,246,0.1)",
        position: "relative",
        overflow: "hidden",
        marginBottom: 16,
        fontFamily: "'Outfit', sans-serif"
      }}
    >
      {/* Background Grid Accent */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "100%", backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)", backgroundSize: "30px 30px", opacity: 0.5, pointerEvents: "none" }} />
      
      <div style={{ display: "flex", gap: 18, alignItems: "center", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
        
        {/* ADN Indicator */}
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: 20, 
          background: "rgba(59,130,246,0.1)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          border: "1px solid rgba(59,130,246,0.3)",
          position: "relative"
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{ position: "absolute", inset: -10, border: "2px dashed rgba(59,130,246,0.2)", borderRadius: "50%" }}
          />
          <Dna size={40} color="#60a5fa" />
        </div>

        {/* Profile Info */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: 1, background: "rgba(59,130,246,0.15)", padding: "2px 8px", borderRadius: 4 }}>
              BILLY LAB ADN Active
            </span>
            <Activity size={12} color="#60a5fa" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 500, color: "#fff", margin: 0 }}>{adnProfile}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Eficiencia Táctica:</div>
            <div style={{ width: 120, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${adnScore}%` }}
                style={{ height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", boxShadow: "0 0 10px #3b82f6" }}
              />
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#60a5fa" }}>{adnScore}%</div>
          </div>
        </div>

        {/* Action Buttons: The Bypass Portal & The Gen-Lab */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: "1 1 100%", marginTop: 4 }}>
          <motion.div
            whileHover={{ x: 5, scale: 1.02 }}
            onClick={() => router.push(`/courses/${nextTopicId}`)}
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.4)",
              padding: "14px 20px",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.3s ease",
              flex: 1,
              minWidth: 260
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 500 }}>Recomendación Billy Lab</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>Saltar a {nextTopicTitle}</div>
            </div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={18} color="#fff" />
            </div>
          </motion.div>
 
          <motion.div
            whileHover={{ x: 5, scale: 1.02 }}
            onClick={() => router.push("/learn/billy-lab")}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 20px",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.3s ease",
              flex: 1,
              minWidth: 260,
              boxShadow: "0 10px 20px rgba(59,130,246,0.3)"
            }}
          >
            <Zap size={20} color="#fff" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", fontWeight: 500 }}>Generador de ADN</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>Iniciar Entrenamiento Delta</div>
            </div>
            <ChevronRight size={18} color="#fff" />
          </motion.div>
        </div>

      </div>

      {/* Lab Pulsing Status */}
      <div style={{ position: "absolute", bottom: 12, right: 24, display: "flex", alignItems: "center", gap: 6 }}>
        <Cpu size={12} color="#10b981" />
        <span style={{ fontSize: 10, fontWeight: 500, color: "#10b981", textTransform: "uppercase" }}>Sincronizando con Gemini Pro</span>
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}
        />
      </div>

    </motion.div>
  )
}
