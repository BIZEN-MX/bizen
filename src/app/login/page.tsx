"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const brandName = "BIZEN"
const supportEmail = "soporte@bizen.mx"

import { WarningIcon } from "@/components/CustomIcons"

function BIZENLoginContent() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPass, setShowPass] = React.useState(false)
  const [remember, setRemember] = React.useState(true)

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
      "Invalid login credentials": "Credenciales inválidas. Verifica tu email y contraseña.",
      "Email not confirmed": "Email no confirmado. Revisa tu correo.",
      "Too many requests": "Demasiados intentos. Por favor espera unos minutos.",
      "rate limit": "Demasiados intentos. Por favor espera unos minutos.",
      "User not found": "Usuario no encontrado.",
    }
    for (const [en, es] of Object.entries(errorTranslations)) {
      if (errorMessage.toLowerCase().includes(en.toLowerCase())) return es
    }
    if (errorMessage.includes("fetch") || errorMessage.includes("Network")) {
      return "Sin conexión. Revisa tu internet."
    }
    return `Error: ${errorMessage}`
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    if (!email || !password) { setMessage("Por favor ingresa tu email y contraseña"); return }
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      try {
        const profileRes = await fetch("/api/profiles")
        if (profileRes.ok) {
          const profile = await profileRes.json()
          if (profile.role === 'teacher' || profile.role === 'school_admin') {
            router.replace('/teacher/dashboard')
            return
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile on login", err)
      }

      router.replace("/courses")
    } catch (err: unknown) {
      setMessage(translateAuthError(err instanceof Error ? err.message : "Error al iniciar sesión"))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      setMessage(translateAuthError(err instanceof Error ? err.message : "Error al iniciar sesión con Google"))
      setLoading(false)
    }
  }

  async function handleAppleLogin() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      setMessage(translateAuthError(err instanceof Error ? err.message : "Error al iniciar sesión con Apple"))
      setLoading(false)
    }
  }

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
      <div aria-hidden style={{ position: "absolute", top: "-10%", left: "-10%", width: "clamp(280px,50vw,560px)", height: "clamp(280px,50vw,560px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,86,231,0.22) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "clamp(240px,45vw,480px)", height: "clamp(240px,45vw,480px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(25,131,253,0.18) 0%, transparent 70%)", filter: "blur(50px)", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", top: "40%", right: "20%", width: "clamp(120px,20vw,220px)", height: "clamp(120px,20vw,220px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)", filter: "blur(30px)", zIndex: 0 }} />

      {/* Decorative floating icons (desktop only) */}
      <div className="deco-icons" aria-hidden>
        {/* Coin top-left */}
        <svg style={{ position: "absolute", top: "8%", left: "6%", opacity: 0.18 }} width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#60a5fa" strokeWidth="2.5" />
          <text x="32" y="39" textAnchor="middle" fill="#60a5fa" fontSize="22" fontWeight="700" fontFamily="sans-serif">$</text>
        </svg>
        {/* Chart top-right */}
        <svg style={{ position: "absolute", top: "12%", right: "7%", opacity: 0.15 }} width="72" height="56" viewBox="0 0 72 56" fill="none">
          <polyline points="4,50 20,34 36,40 52,18 68,8" stroke="#1983FD" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="4" cy="50" r="4" fill="#1983FD" />
          <circle cx="20" cy="34" r="4" fill="#1983FD" />
          <circle cx="36" cy="40" r="4" fill="#1983FD" />
          <circle cx="52" cy="18" r="4" fill="#1983FD" />
          <circle cx="68" cy="8" r="4" fill="#1983FD" />
        </svg>
        {/* Sparkle mid-left */}
        <svg style={{ position: "absolute", top: "50%", left: "4%", opacity: 0.2, transform: "translateY(-50%)" }} width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 4 L22 18 L36 20 L22 22 L20 36 L18 22 L4 20 L18 18 Z" fill="#93c5fd" />
        </svg>
        {/* Shield bottom-left */}
        <svg style={{ position: "absolute", bottom: "12%", left: "7%", opacity: 0.15 }} width="52" height="60" viewBox="0 0 52 60" fill="none">
          <path d="M26 2 L50 12 L50 32 C50 46 38 56 26 58 C14 56 2 46 2 32 L2 12 Z" stroke="#60a5fa" strokeWidth="2.5" fill="none" />
          <path d="M16 30 L22 36 L36 22" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        {/* Percentage bottom-right */}
        <svg style={{ position: "absolute", bottom: "15%", right: "6%", opacity: 0.18 }} width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="20" cy="20" r="10" stroke="#1983FD" strokeWidth="2.5" />
          <circle cx="44" cy="44" r="10" stroke="#1983FD" strokeWidth="2.5" />
          <line x1="10" y1="54" x2="54" y2="10" stroke="#1983FD" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Logo top-left */}
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


        {/* Heading */}
        <h1 style={{ margin: "0 0 8px", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: "-0.04em" }}>
          ¡Bienvenido!
        </h1>
        <p style={{ margin: "0 0 clamp(32px, 5vw, 48px)", fontSize: "clamp(15px, 2vw, 17px)", color: "rgba(255,255,255,0.7)", textAlign: "center", fontWeight: 500 }}>
          Inicia sesión en tu cuenta de {brandName}
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase", }}>
              Email
            </label>
            <input
              id="email" name="email" type="email" required autoComplete="email"
              placeholder="tu@email.com"
              value={email} onChange={(e) => setEmail(e.currentTarget.value)}
              className="bizen-input"
              style={{
                width: "100%", height: 52, borderRadius: 12, boxSizing: "border-box",
                border: "1.5px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(8px)",
                padding: "0 16px", outline: "none",
                fontSize: 15, color: "#fff",
                transition: "border-color .2s, background .2s",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase", }}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password" name="password" type={showPass ? "text" : "password"} required autoComplete="current-password"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.currentTarget.value)}
                className="bizen-input"
                style={{
                  width: "100%", height: 52, borderRadius: 12, boxSizing: "border-box",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                  padding: "0 44px 0 16px", outline: "none",
                  fontSize: 15, color: "#fff",
                  transition: "border-color .2s, background .2s",
                }}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex" }} aria-label={showPass ? "Ocultar" : "Mostrar"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2">
                  {showPass ? (<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>)}
                </svg>
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginTop: -4 }}>
            <a href="/bizen/forgot-password" style={{ fontSize: 13, color: "#60a5fa", textDecoration: "none", }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              height: 52, borderRadius: 12, border: "none", width: "100%",
              background: loading ? "rgba(15, 98, 254, 0.5)" : "linear-gradient(135deg, #0F62FE, #4A9EFF)",
              color: "#fff", fontWeight: 700, fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              boxShadow: loading ? "none" : "0 12px 24px -6px rgba(15, 98, 254, 0.4)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(15, 98, 254, 0.6)" } }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 12px 24px -6px rgba(15, 98, 254, 0.4)" }}
          >
            {loading ? "Entrando…" : `Entrar a ${brandName}`}
          </button>

          {/* Remember me */}
          <label style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.currentTarget.checked)} style={{ accentColor: "#1983FD", width: 15, height: 15 }} />
            Mantener sesión iniciada
          </label>
        </form>

        {/* Separator */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", margin: "24px 0", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>O TAMBIÉN</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Social Logins */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              height: 52, borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.12)", width: "100%",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              color: "#fff", fontWeight: 500, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-1px)" } }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Google
          </button>

          {/* Apple Login */}
          <button
            type="button"
            onClick={handleAppleLogin}
            disabled={loading}
            style={{
              height: 52, borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.12)", width: "100%",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              color: "#fff", fontWeight: 500, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-1px)" } }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            <svg width="20" height="20" viewBox="0 0 384 512" fill="white">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            Apple
          </button>
        </div>

        {/* Error message */}
        {message && (
          <p role="status" style={{
            marginTop: 16, textAlign: "center", color: "#f87171", fontSize: 13, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8,
            padding: "10px 16px", width: "100%", boxSizing: "border-box",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <WarningIcon size={16} color="#f87171" />
            {message}
          </p>
        )}

        {/* Sign up link */}
        <p style={{ marginTop: 28, fontSize: 14, color: "rgba(255,255,255,0.45)", textAlign: "center", }}>
          ¿No tienes cuenta?{" "}
          <Link href="/signup" style={{ color: "#60a5fa", fontWeight: 500, textDecoration: "none" }}>Regístrate</Link>
        </p>

        {/* Support */}
        <p style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.6 }}>
          ¿Necesitas ayuda? <a href={`mailto:${supportEmail}`} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>{supportEmail}</a>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .bizen-input::placeholder { color: rgba(255,255,255,0.25) !important; }
        .bizen-input:focus { border-color: rgba(25,131,253,0.7) !important; background: rgba(255,255,255,0.11) !important; }
        .bizen-input:hover:not(:focus) { border-color: rgba(255,255,255,0.22) !important; }
        @media (max-width: 640px) {
          .deco-icons { display: none !important; }
        }
      `}} />
    </main>
  )
}

export default function BIZENLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#020e27", minHeight: "100dvh", display: "grid", placeItems: "center", color: "#fff", fontSize: 18 }}>
        Cargando...
      </div>
    }>
      <BIZENLoginContent />
    </Suspense>
  )
}
