"use client"

import React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { TrendingUp, ArrowRight, Zap, ShieldCheck } from "lucide-react"

export default function InvestmentsWidget() {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: "linear-gradient(135deg, #0c4a6e 0%, #075985 45%, #0ea5e9 100%)",
        borderRadius: 28,
        padding: "24px 32px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 12px 40px rgba(14, 165, 233, 0.25)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        minHeight: 220
      }}
      onClick={() => router.push("/investments")}
    >
      {/* Decorative Orbs */}
      <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 180, height: 180, background: "rgba(96,165,250,0.2)", borderRadius: "50%", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "5%", width: 150, height: 150, background: "rgba(167,139,250,0.15)", borderRadius: "50%", filter: "blur(40px)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <TrendingUp size={24} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Centro de Inversión</span>
        </div>

        <h3 style={{ margin: 0, fontSize: 28, fontWeight: 950, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Haz crecer tus <span style={{ color: "#60a5fa" }}>Bizcoins</span>
        </h3>
        <p style={{ margin: "12px 0 0", fontSize: 15, color: "rgba(255,255,255,0.8)", fontWeight: 500, lineHeight: 1.5, maxWidth: "80%" }}>
          Pon tus ahorros a trabajar con rendimientos de hasta el <strong style={{ color: "#fff" }}>15%</strong>.
        </p>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>
            <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={14} color="#fcd34d" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>Alta Rentabilidad</span>
            </div>
            <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={14} color="#34d399" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>Seguro</span>
            </div>
        </div>
        
        <div style={{ width: 48, height: 48, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F62FE", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
          <ArrowRight size={24} strokeWidth={2.5} />
        </div>
      </div>
    </motion.div>
  )
}
