"use client"

import * as React from "react"
import { SignUp } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import BizenVirtualCard, { CardTheme } from "@/components/BizenVirtualCard"
import AuthBackground from "@/components/AuthBackground"

const THEME_OPTIONS: { id: CardTheme; color: string }[] = [
  { id: "blue", color: "#2563eb" },
  { id: "emerald", color: "#059669" },
  { id: "violet", color: "#8b5cf6" },
  { id: "pink", color: "#ec4899" },
  { id: "rose", color: "#e11d48" },
  { id: "amber", color: "#d97706" },
  { id: "obsidian", color: "#1c1c1c" },
]

export default function BIZENSignupPage() {
  const [selectedTheme, setSelectedTheme] = React.useState<CardTheme>("violet")
  const [holderName, setHolderName] = React.useState("NUEVO MIEMBRO")

  // Sync Clerk inputs with Virtual Card
  React.useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (!target) return
      
      // Clerk's standard name attributes or IDs
      if (target.name === "firstName" || target.name === "lastName") {
        const form = target.closest("form")
        if (form) {
          const first = (form.querySelector('input[name="firstName"]') as HTMLInputElement)?.value || ""
          const last = (form.querySelector('input[name="lastName"]') as HTMLInputElement)?.value || ""
          const full = `${first} ${last}`.trim()
          setHolderName(full || "NUEVO MIEMBRO")
        }
      }
    }

    document.addEventListener("input", handleInput)
    return () => document.removeEventListener("input", handleInput)
  }, [])

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "grid",
        background: "#01040f",
        fontFamily: "'SF Pro Display', system-ui, sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
      className="grid-cols-1 lg:grid-cols-[1fr_38%]"
    >
      <AuthBackground />

      {/* ── LEFT — Auth form panel ── */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
          padding: "40px",
        }}
      >
        {/* Branding TOP-LEFT */}
        <div style={{ position: "absolute", top: 40, left: 40, zIndex: 100 }}>
          <span style={{ fontSize: 24, fontWeight: 400, color: "#ffffff", letterSpacing: "-0.04em", fontFamily: "var(--font-family)" }}>BIZEN</span>
        </div>

        <div style={{ width: "100%", maxWidth: 400 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SignUp appearance={{ elements: { rootBox: "w-full", card: "w-full bg-transparent shadow-none border-none" } }} forceRedirectUrl="/dashboard" />
            
            {/* Agreement Text */}
            <p style={{ 
              marginTop: "24px", 
              fontSize: "12px", 
              color: "#ffffff", 
              textAlign: "center", 
              lineHeight: "1.6",
              padding: "0 20px"
            }}>
              Al registrarte, aceptas nuestros{" "}
              <a href="/terminos" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "600" }}>Términos de Servicio</a>
              {" "}y{" "}
              <a href="/privacidad" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "600" }}>Política de Privacidad</a>.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT — Brand panel ── */}
      <div
        style={{
          height: "100vh",
          padding: "60px 60px",
          position: "relative",
          zIndex: 20,
          background: "linear-gradient(150deg, rgba(2,8,23,0.98) 0%, rgba(4,15,45,0.95) 50%, rgba(6,25,65,0.92) 100%)",
          backdropFilter: "blur(40px)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
        className="hidden lg:flex"
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTheme}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <BizenVirtualCard
                bizcoins={1000}
                holderName={holderName.toUpperCase()}
                colorTheme={selectedTheme}
                level={1}
                hideButtons={true}
              />
            </motion.div>
          </AnimatePresence>

          <div style={{ marginTop: 32, display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em" }}>SELECCIONA TU ESTILO:</span>
            <div style={{ display: "flex", gap: 12 }}>
              {THEME_OPTIONS.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: t.color,
                    border: selectedTheme === t.id ? "3px solid #fff" : "1.5px solid rgba(255,255,255,0.15)",
                    padding: 0,
                    cursor: "pointer",
                    boxShadow: selectedTheme === t.id ? `0 0 20px ${t.color}` : "none",
                    transition: "border 0.2s",
                  }}
                />
              ))}
            </div>
          </div>

          <h1 style={{ marginTop: 48, lineHeight: 1, letterSpacing: "-0.04em", fontFamily: "var(--font-family)", fontWeight: 400 }}>
            <span style={{ color: "#ffffff", fontSize: 42, display: "block" }}>Empieza hoy</span>
            <span style={{ fontSize: 42, display: "block", color: "#a78bfa" }}>tu futuro.</span>
          </h1>
          <p style={{ marginTop: 24, color: "rgba(148,163,184,0.6)", fontSize: 16, lineHeight: 1.6, maxWidth: "90%" }}>
            Personaliza tu tarjeta y desbloquea el poder de tu dinero con la mejor plataforma de México.
          </p>
        </div>

        {/* Brand Footer */}
        <div style={{ position: "absolute", bottom: 48, right: 60, zIndex: 2 }}>
          <span style={{ fontSize: 10, color: "rgba(100,116,139,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>© {new Date().getFullYear()} BIZEN MÉXICO</span>
        </div>
      </div>
    </div>
  )
}
