"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import {
  Shield, ChevronRight, BookOpen, TrendingUp,
  Brain, Zap, Lock, CheckCircle, ArrowLeft
} from "lucide-react"

const FEATURES = [
  { icon: BookOpen, text: "Acceso a todos los temas financieros" },
  { icon: TrendingUp, text: "Cursos de inversión, deuda y patrimonio" },
  { icon: Brain, text: "Psicología del dinero y mentalidad emprendedora" },
  { icon: Zap, text: "Retos diarios, XP y rankings globales" },
  { icon: Shield, text: "Pago seguro — tus datos protegidos" },
]

export default function PaymentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          planName: "Plan Emprendedor",
          userId: user?.id || null,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error al generar el pago")
      if (data.url) window.location.href = data.url
    } catch (error: any) {
      alert(error.message || "Error al procesar el pago. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FBFAF5",
      fontFamily: "Helvetica, 'Inter', sans-serif",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pay-input { width: 100%; height: 44px; border-radius: 12px; border: 1.5px solid #e2e8f0; padding: 0 16px; font-size: 14px; font-family: inherit; color: #0f172a; background: white; box-sizing: border-box; transition: all 0.2s; outline: none; }
        .pay-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
        .pay-btn { width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); border: none; border-radius: 14px; color: white; font-size: 15px; font-weight: 800; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.25s; box-shadow: 0 8px 24px rgba(37,99,235,0.25); }
        .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,0.35); }
        .pay-feature-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        
        @media (max-width: 1300px) {
          .pay-mascot { display: none !important; }
        }
        @media (max-width: 900px) {
          .pay-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .pay-hero { order: 2; padding: 24px !important; }
          .pay-form-card { order: 1; padding: 24px !important; }
          .pay-header-text h1 { font-size: 28px !important; }
          .pay-header-text p { font-size: 14px !important; }
          .pay-header { padding: 0 20px !important; }
          .pay-main { padding: 20px !important; }
        }
        @media (max-height: 700px) {
          .pay-main { padding: 40px 20px !important; }
          .pay-hero { padding: 20px !important; }
          .pay-header-text { margin-bottom: 24px !important; }
        }
      `}</style>

      {/* Header */}
      <header className="pay-header" style={{
        height: 64, zIndex: 100,
        background: "rgba(251,250,245,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(15,98,254,0.08)",
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#475569", fontFamily: "Helvetica, Arial, sans-serif", letterSpacing: "-0.03em" }}>
            BIZEN
          </span>
        </Link>
        <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "#64748b", fontSize: 14, fontWeight: 600 }}>
          <ArrowLeft size={18} />
          Volver
        </button>
      </header>

      {/* Main Container - FLEX to prevent cut-off */}
      <main className="pay-main" style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        zIndex: 1
      }}>

        <div style={{ maxWidth: 1000, width: "100%", animation: "fadeUp 0.5s ease both" }}>

          {/* Top Headline */}
          <div className="pay-header-text" style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Todo <span style={{ color: "#1e3a8a" }}>BIZEN</span>. Sin límites.
            </h1>
            <p style={{ margin: 0, fontSize: 16, color: "#64748b", fontWeight: 500 }}>
              Accede a todos los temas y contenido financiero por un precio accesible.
            </p>
          </div>

          <div className="pay-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "stretch" }}>

            {/* LEFT: Info Card */}
            <div className="pay-hero" style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
              borderRadius: 24,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxShadow: "0 20px 40px rgba(15,98,254,0.2)"
            }}>
              <div className="pay-hero-badge" style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", padding: "5px 12px", borderRadius: 999, marginBottom: 16, width: "fit-content" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase" }}>PLAN EMPRENDEDOR</span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1 }}>$99</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#93c5fd" }}>/mes</span>
              </div>
              <p style={{ fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 20 }}>Cancela en cualquier momento.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {FEATURES.map(({ icon: Icon, text }) => (
                  <div key={text} className="pay-feature-row">
                    <Icon size={14} color="#93c5fd" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Form Card */}
            <div className="pay-form-card" style={{
              background: "white",
              border: "1px solid rgba(15,98,254,0.1)",
              borderRadius: 24,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 8px 32px rgba(15,98,254,0.06)",
              position: "relative"
            }}>
              {/* Billy character leaning out */}
              <img
                src="/image copy.png"
                alt="Billy"
                className="pay-mascot"
                style={{
                  position: "absolute",
                  top: -90,
                  right: -200,
                  width: 260,
                  height: "auto",
                  pointerEvents: "none",
                  zIndex: 2,
                  transform: "scaleX(-1)"
                }}
              />
              <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
                Completa tu registro
              </h2>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>Nombre completo</label>
                  <input className="pay-input" name="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Tu nombre" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>Correo electrónico</label>
                  <input className="pay-input" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="tu@correo.com" />
                </div>

                <div style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)", borderRadius: 14, padding: "12px 16px", marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800 }}>
                    <span>Total hoy</span>
                    <span>$99 USD</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="pay-btn">
                  {loading ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <><Lock size={16} />Continuar al pago</>}
                </button>
              </form>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}
