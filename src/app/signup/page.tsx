"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const brandName = "BIZEN"
const supportEmail = "soporte@bizen.mx"
const AUTH_CONTROL_HEIGHT = 48

import { CheckIcon, WarningIcon } from "@/components/CustomIcons"

function BIZENSignupContent() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPass, setShowPass] = React.useState(false)



  React.useEffect(() => {
    document.documentElement.style.overflow = "auto"
    document.body.style.overflow = "auto"
    document.body.style.background = "linear-gradient(135deg, #020e27 0%, #041640 40%, #061a4a 70%, #020e27 100%)"
    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      document.body.style.background = ""
    }
  }, [])

  function translateAuthError(errorMessage: string): string {
    const errorTranslations: Record<string, string> = {
      "User already registered": "Este correo ya está registrado. Intenta iniciar sesión.",
      "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
      "Invalid email": "Email inválido.",
      "Signup is disabled": "El registro está deshabilitado temporalmente.",
      "rate limit": "Demasiados intentos. Por favor espera unos minutos.",
      "too many requests": "Demasiados intentos. Por favor espera unos minutos.",
    }
    for (const [en, es] of Object.entries(errorTranslations)) {
      if (errorMessage.toLowerCase().includes(en.toLowerCase())) return es
    }
    if (errorMessage.includes("fetch") || errorMessage.includes("Network")) return "Sin conexión. Revisa tu internet."
    return `Error: ${errorMessage}`
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    if (!email || !password || !fullName) { setMessage("Por favor completa todos los campos."); return }
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) throw error
      setMessage("¡Cuenta creada con éxito! Redirigiendo...")

      const emailLower = email.toLowerCase()
      const isInstitutional = emailLower.endsWith('.edu') || emailLower.includes('.edu.')

      setTimeout(() => {
        router.push(isInstitutional ? "/diagnostic" : "/courses")
      }, 2000)
    } catch (err: unknown) {
      setMessage(translateAuthError(err instanceof Error ? err.message : "Error al crear cuenta"))
    } finally {
      if (!loading) setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setMessage(null)
    try {
      setGoogleLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) throw error
    } catch (err: unknown) {
      setMessage(translateAuthError(err instanceof Error ? err.message : "Error con Google"))
      setGoogleLoading(false)
    }
  }



  const isSuccess = message?.includes("éxito")

  return (
    <main style={{
      position: "relative",
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #050b14 0%, #0a192f 40%, #173d7a 100%)",
      overflow: "hidden",
      padding: "clamp(16px, 4vw, 40px)",
      boxSizing: "border-box",
    }}>

      {/* Grid overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,86,231,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,231,0.07) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Blobs */}
      <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-10%", width: "clamp(280px,50vw,560px)", height: "clamp(280px,50vw,560px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,86,231,0.22) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-15%", left: "-10%", width: "clamp(240px,45vw,480px)", height: "clamp(240px,45vw,480px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(25,131,253,0.18) 0%, transparent 70%)", filter: "blur(50px)", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", top: "30%", left: "15%", width: "clamp(100px,18vw,200px)", height: "clamp(100px,18vw,200px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)", filter: "blur(30px)", zIndex: 0 }} />

      {/* Decorative floating icons */}
      <div className="deco-icons" aria-hidden>
        {/* Trending up top-left */}
        <svg style={{ position: "absolute", top: "10%", left: "5%", opacity: 0.16 }} width="72" height="56" viewBox="0 0 72 56" fill="none">
          <polyline points="4,50 20,34 36,42 52,18 68,8" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="68" cy="8" r="5" fill="#60a5fa" />
          <path d="M54 8 L68 8 L68 22" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        {/* Coin top-right */}
        <svg style={{ position: "absolute", top: "8%", right: "6%", opacity: 0.17 }} width="68" height="68" viewBox="0 0 68 68" fill="none">
          <circle cx="34" cy="34" r="32" stroke="#1983FD" strokeWidth="2.5" />
          <circle cx="34" cy="34" r="22" stroke="#1983FD" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="34" y="42" textAnchor="middle" fill="#1983FD" fontSize="24" fontWeight="700" fontFamily="sans-serif">$</text>
        </svg>
        {/* Star left */}
        <svg style={{ position: "absolute", top: "45%", left: "3%", opacity: 0.18, transform: "translateY(-50%)" }} width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M22 4 L25 18 L39 18 L28 27 L32 41 L22 33 L12 41 L16 27 L5 18 L19 18 Z" fill="#60a5fa" />
        </svg>
        {/* Lightbulb right */}
        <svg style={{ position: "absolute", top: "40%", right: "4%", opacity: 0.15, transform: "translateY(-50%)" }} width="52" height="64" viewBox="0 0 52 64" fill="none">
          <path d="M26 2 C14 2 5 11 5 23 C5 32 11 39 19 43 L19 52 L33 52 L33 43 C41 39 47 32 47 23 C47 11 38 2 26 2 Z" stroke="#1983FD" strokeWidth="2.5" fill="none" />
          <path d="M18 52 L34 52" stroke="#1983FD" strokeWidth="2" />
          <path d="M20 58 L32 58" stroke="#1983FD" strokeWidth="2" />
        </svg>
        {/* Bar chart bottom-left */}
        <svg style={{ position: "absolute", bottom: "10%", left: "6%", opacity: 0.14 }} width="60" height="52" viewBox="0 0 60 52" fill="none">
          <rect x="4" y="28" width="12" height="20" rx="3" fill="#60a5fa" />
          <rect x="22" y="16" width="12" height="32" rx="3" fill="#60a5fa" />
          <rect x="40" y="6" width="12" height="42" rx="3" fill="#60a5fa" />
        </svg>
        {/* Sparkle bottom-right */}
        <svg style={{ position: "absolute", bottom: "14%", right: "7%", opacity: 0.18 }} width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 4 L22 18 L36 20 L22 22 L20 36 L18 22 L4 20 L18 18 Z" fill="#93c5fd" />
        </svg>
      </div>

      {/* Logo */}
      <Link href="/" style={{
        position: "absolute", top: 24, left: "clamp(20px, 4vw, 36px)",
        textDecoration: "none", zIndex: 10, display: "flex", alignItems: "center", gap: 8,
      }}>
        <strong style={{ fontSize: "clamp(22px, 3vw, 28px)", color: "#fff", letterSpacing: "-0.02em" }}>
          BIZEN<span style={{ color: "#1983FD" }}>.</span>
        </strong>
      </Link>

      <div style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: "clamp(280px, 92vw, 480px)",
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "rgba(10, 25, 47, 0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "32px",
        padding: "clamp(32px, 6vw, 48px) clamp(24px, 4vw, 40px)",
        boxSizing: "border-box",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 32px 64px -16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      }}>


        <h1 style={{ margin: "0 0 8px", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: "-0.04em" }}>
          Crea tu cuenta
        </h1>
        <p style={{ margin: "0 0 clamp(32px, 5vw, 48px)", fontSize: "clamp(15px, 2vw, 17px)", color: "rgba(255,255,255,0.7)", textAlign: "center", fontWeight: 500 }}>
          Únete a la revolución de la educación financiera
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.07em", textTransform: "uppercase", }}>
              Nombre completo
            </label>
            <input
              id="fullName" name="fullName" type="text" required
              placeholder="¿Cómo te llamas?"
              value={fullName} onChange={(e) => setFullName(e.currentTarget.value)}
              className="bizen-input"
              style={{ width: "100%", height: 50, borderRadius: 12, boxSizing: "border-box", border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)", padding: "0 16px", outline: "none", fontSize: 15, color: "#fff", transition: "border-color .2s, background .2s" }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.07em", textTransform: "uppercase", }}>
              Email
            </label>
            <input
              id="email" name="email" type="email" required
              placeholder="tu@email.com"
              value={email} onChange={(e) => setEmail(e.currentTarget.value)}
              className="bizen-input"
              style={{ width: "100%", height: 50, borderRadius: 12, boxSizing: "border-box", border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)", padding: "0 16px", outline: "none", fontSize: 15, color: "#fff", transition: "border-color .2s, background .2s" }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.07em", textTransform: "uppercase", }}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password" name="password" type={showPass ? "text" : "password"} required
                placeholder="Mínimo 6 caracteres"
                value={password} onChange={(e) => setPassword(e.currentTarget.value)}
                className="bizen-input"
                style={{ width: "100%", height: 50, borderRadius: 12, boxSizing: "border-box", border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)", padding: "0 44px 0 16px", outline: "none", fontSize: 15, color: "#fff", transition: "border-color .2s, background .2s" }}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                  {showPass ? (<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>)}
                </svg>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading || googleLoading}
            style={{
              height: 52, borderRadius: 12, border: "none", width: "100%", marginTop: 4,
              background: (loading || googleLoading) ? "rgba(15, 98, 254, 0.5)" : "linear-gradient(135deg, #0F62FE, #4A9EFF)",
              color: "#fff", fontWeight: 700, fontSize: 16,
              cursor: (loading || googleLoading) ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              boxShadow: (loading || googleLoading) ? "none" : "0 12px 24px -6px rgba(15, 98, 254, 0.4)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseOver={(e) => { if (!loading && !googleLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(15, 98, 254, 0.6)" } }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = (loading || googleLoading) ? "none" : "0 12px 24px -6px rgba(15, 98, 254, 0.4)" }}
          >
            {loading ? "Creando cuenta…" : "Registrarme ahora"}
          </button>

          {/* Divider */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", }}>o regístrate con</span>
            <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Social Logins */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Google */}
            <button
              type="button" onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              style={{
                height: AUTH_CONTROL_HEIGHT, borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                cursor: (loading || googleLoading) ? "not-allowed" : "pointer",
                fontWeight: 500, fontSize: 15, color: "#fff",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>


          </div>
        </form>

        {/* Status message */}
        {message && (
          <p role="status" style={{
            marginTop: 16, textAlign: "center", fontSize: 13, color: isSuccess ? "#4ade80" : "#f87171",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: isSuccess ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${isSuccess ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
            borderRadius: 8, padding: "10px 16px", width: "100%", boxSizing: "border-box",
          }}>
            {isSuccess ? <CheckIcon size={16} color="#4ade80" /> : <WarningIcon size={16} color="#f87171" />}
            {message}
          </p>
        )}

        {/* Login link */}
        <p style={{ marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.45)", textAlign: "center", }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "#60a5fa", fontWeight: 500, textDecoration: "none" }}>Inicia sesión</Link>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .bizen-input::placeholder { color: rgba(255,255,255,0.22) !important; }
        .bizen-input:focus { border-color: rgba(25,131,253,0.7) !important; background: rgba(255,255,255,0.11) !important; }
        .bizen-input:hover:not(:focus) { border-color: rgba(255,255,255,0.22) !important; }
        @media (max-width: 640px) {
          .deco-icons { display: none !important; }
        }
      `}} />
    </main>
  )
}

export default function BIZENSignupPage() {
  return (
    <Suspense fallback={<div style={{ background: "#020e27", minHeight: "100dvh", display: "grid", placeItems: "center", color: "#fff", fontSize: 18 }}>Cargando...</div>}>
      <BIZENSignupContent />
    </Suspense>
  )
}
