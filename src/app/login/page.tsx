"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const brandName = "BIZEN"
const bgColor = "#FFFFFF"
const linkColor = "#0E4A7A"
const AUTH_CONTROL_HEIGHT = 48
const AUTH_FORM_MAX_WIDTH = 400
const supportEmail = "soporte@bizen.mx"

function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        background: "#fff",
        padding: "clamp(20px, 5vw, 24px)",
        minWidth: 0,
        overflow: "hidden" as const,
        ...(props.style || {}),
      }}
    />
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} style={{ display: "block" as const, fontSize: 13, fontWeight: 500, color: "#1e293b", marginBottom: 6 }}>{children}</label>
}

function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="auth-input"
      style={{
        width: "100%",
        height: 44,
        borderRadius: 8,
        border: "1px solid #cbd5e1",
        padding: "0 14px",
        outline: "none",
        fontSize: 15,
        color: "#1e293b",
        background: "#f8fafc",
        transition: "border-color .2s ease, background .2s ease",
        ...(props.style || {}),
      }}
      onFocus={(e) => {
        e.currentTarget.style.background = "#fff"
        e.currentTarget.style.borderColor = "#0B71FE"
      }}
      onBlur={(e) => {
        e.currentTarget.style.background = "#f8fafc"
        e.currentTarget.style.borderColor = "#cbd5e1"
      }}
    />
  )
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const { loading, ...rest } = props
  return (
    <button
      {...rest}
      style={{
        height: AUTH_CONTROL_HEIGHT,
        minHeight: AUTH_CONTROL_HEIGHT,
        borderRadius: 12,
        border: "none",
        width: "100%",
        minWidth: 0,
        background: rest.disabled ? "#cfd8e3" : "#0B71FE",
        color: "#fff",
        fontWeight: 700,
        letterSpacing: 0.2,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        transform: "translateZ(0)",
        transition: "transform .06s, background .2s, box-shadow .2s",
        boxShadow: rest.disabled ? "none" : "0 6px 16px rgba(11, 113, 254, 0.3)",
        fontFamily: 'Montserrat, sans-serif',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {loading ? "Entrando…" : rest.children}
    </button>
  )
}

function Divider({ label = "o" }: { label?: string }) {
  return (
    <div style={{ display: "grid" as const, gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
      <div style={{ height: 1, background: "rgba(11, 113, 254, 0.2)" }} />
      <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
      <div style={{ height: 1, background: "rgba(11, 113, 254, 0.2)" }} />
    </div>
  )
}

function BIZENLoginContent() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPass, setShowPass] = React.useState(false)
  const [remember, setRemember] = React.useState(true)
  const [isTablet, setIsTablet] = React.useState(false)

  React.useEffect(() => {
    setIsTablet(window.innerWidth <= 1024)
    const handleResize = () => setIsTablet(window.innerWidth <= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  function isNetworkError(err: unknown): boolean {
    const msg = err instanceof Error ? err.message : String(err)
    return (
      msg === "Failed to fetch" ||
      msg === "Network request failed" ||
      msg === "Load failed" ||
      msg.includes("NetworkError") ||
      msg.includes("fetch")
    )
  }

  function translateAuthError(errorMessage: string): string {
    if (errorMessage === "Failed to fetch" || errorMessage.includes("fetch") || errorMessage.includes("Network")) {
      return "No hay conexión. Revisa tu internet e intenta de nuevo."
    }
    const errorTranslations: Record<string, string> = {
      "Invalid login credentials": "Credenciales de inicio de sesión inválidas. Verifica tu email y contraseña.",
      "Email not confirmed": "Email no confirmado. Revisa tu correo y haz clic en el enlace de verificación.",
      "Too many requests": "Demasiados intentos. Espera un momento antes de intentar de nuevo.",
      "User not found": "Usuario no encontrado. Verifica tu email o crea una cuenta nueva.",
      "Invalid email": "Email inválido",
      "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
      "Unable to validate email address: invalid format": "No se puede validar la dirección de email: formato inválido",
      "Signup is disabled": "El registro está deshabilitado",
      "Email rate limit exceeded": "Límite de emails excedido. Intenta de nuevo más tarde.",
      "For security purposes, you can only request this once every 60 seconds": "Por seguridad, solo puedes solicitar esto una vez cada 60 segundos"
    }
    if (errorTranslations[errorMessage]) return errorTranslations[errorMessage]
    for (const [english, spanish] of Object.entries(errorTranslations)) {
      if (errorMessage.includes(english)) return spanish
    }
    return `Error: ${errorMessage}`
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    if (!email || !password) {
      setMessage("Por favor ingresa tu email y contraseña")
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.replace("/courses")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión"
      setMessage(isNetworkError(err) ? "No hay conexión. Revisa tu internet e intenta de nuevo." : translateAuthError(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setMessage(null)
    try {
      setGoogleLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      // User will be redirected to Google, no need to navigate here
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión con Google"
      setMessage(isNetworkError(err) ? "No hay conexión. Revisa tu internet e intenta de nuevo." : translateAuthError(errorMessage))
      setGoogleLoading(false)
    }
  }

  return (
    <main className="auth-page" style={{
      position: "relative" as const,
      overflow: "hidden" as const,
      background: "linear-gradient(180deg, #e8f4ff 0%, #f5f9ff 50%, #e8f4ff 100%)",
      height: "100dvh",
      minHeight: "100dvh",
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      boxSizing: "border-box" as const,
      padding: "20px",
    }}>
      {/* Fixed brand name top left */}
      <Link href="/" style={{ position: "fixed" as const, left: 24, top: 24, display: "flex" as const, alignItems: "center" as const, textDecoration: "none", color: "inherit", zIndex: 10 }}>
        <strong style={{ fontSize: 28, color: "#0B71FE", fontFamily: "Montserrat, sans-serif" }}>{brandName}.</strong>
      </Link>

      {/* Decorative science elements - atoms, DNA, molecules */}
      <div aria-hidden style={{ position: "absolute" as const, top: 60, left: 80, opacity: 0.6, zIndex: 0 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#FF6B9D" strokeWidth="2"/>
          <circle cx="40" cy="40" r="5" fill="#FF6B9D"/>
          <circle cx="15" cy="40" r="8" fill="#93C5FD"/>
          <circle cx="65" cy="40" r="8" fill="#93C5FD"/>
        </svg>
      </div>
      <div aria-hidden style={{ position: "absolute" as const, top: "30%", right: 60, opacity: 0.5, zIndex: 0 }}>
        <svg width="60" height="100" viewBox="0 0 60 100">
          <path d="M30 10 Q20 30 30 50 T30 90" fill="none" stroke="#FFA500" strokeWidth="3"/>
          <circle cx="30" cy="10" r="8" fill="#FFA500"/>
          <circle cx="30" cy="50" r="8" fill="#FFA500"/>
          <circle cx="30" cy="90" r="8" fill="#FFA500"/>
        </svg>
      </div>
      <div aria-hidden style={{ position: "absolute" as const, bottom: 100, left: 60, opacity: 0.6, zIndex: 0 }}>
        <svg width="70" height="120" viewBox="0 0 70 120">
          <ellipse cx="35" cy="30" rx="25" ry="15" fill="none" stroke="#60A5FA" strokeWidth="2"/>
          <ellipse cx="35" cy="60" rx="25" ry="15" fill="none" stroke="#60A5FA" strokeWidth="2"/>
          <ellipse cx="35" cy="90" rx="25" ry="15" fill="none" stroke="#60A5FA" strokeWidth="2"/>
          <line x1="10" y1="30" x2="60" y2="30" stroke="#60A5FA" strokeWidth="2"/>
          <line x1="10" y1="60" x2="60" y2="60" stroke="#60A5FA" strokeWidth="2"/>
        </svg>
      </div>
      <div aria-hidden style={{ position: "absolute" as const, bottom: 80, right: 100, opacity: 0.5, zIndex: 0 }}>
        <svg width="90" height="70" viewBox="0 0 90 70">
          <path d="M10 35 L30 20 L50 35 L70 20 L80 35" fill="none" stroke="#FFA500" strokeWidth="3"/>
          <circle cx="10" cy="35" r="6" fill="#FFA500"/>
          <circle cx="30" cy="20" r="6" fill="#FFA500"/>
          <circle cx="50" cy="35" r="6" fill="#FFA500"/>
          <circle cx="70" cy="20" r="6" fill="#FFA500"/>
          <rect x="70" y="40" width="15" height="25" fill="#FFA500" opacity="0.6"/>
        </svg>
      </div>

      {/* Centered login card */}
      <Card style={{
        width: "100%",
        maxWidth: 480,
        padding: "clamp(24px, 5vw, 40px)",
        position: "relative" as const,
        zIndex: 1,
      }}>
        {/* Character icon at top */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Image 
            src="/hero1.png" 
            alt="BIZEN" 
            width={80} 
            height={80} 
            style={{ width: 80, height: 80, objectFit: "contain" }} 
          />
        </div>

        {/* Welcome text */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0B71FE",
            margin: 0,
            marginBottom: 8,
            fontFamily: "Montserrat, sans-serif"
          }}>
            ¡Bienvenido a {brandName}!
          </h1>
        </div>

        {/* Login form */}
        <form onSubmit={onSubmit} className="auth-form" style={{ display: "grid" as const, gap: 16 }}>
          <div>
            <Label htmlFor="email">Usuario *</Label>
            <TextField 
              id="email" 
              name="email" 
              type="email" 
              placeholder="¿Tu correo electrónico?" 
              required 
              autoComplete="email"
              value={email} 
              onChange={(e) => setEmail(e.currentTarget.value)} 
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña *</Label>
            <div style={{ position: "relative" as const }}>
              <TextField 
                id="password" 
                name="password" 
                type={showPass ? "text" : "password"} 
                placeholder="¿Tu contraseña?"
                required 
                autoComplete="current-password" 
                value={password} 
                onChange={(e) => setPassword(e.currentTarget.value)}
                style={{ paddingRight: 40 }}
              />
              <button 
                type="button" 
                onClick={() => setShowPass((s) => !s)}
                style={{ 
                  position: "absolute" as const, 
                  right: 12, 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  background: "transparent", 
                  border: "none", 
                  cursor: "pointer",
                  padding: 4
                }}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  {showPass ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div style={{ display: "flex" as const, justifyContent: "flex-start", alignItems: "center" }}>
            <a href="/bizen/forgot-password" className="auth-link" style={{ fontSize: 13, color: "#0B71FE", textDecoration: "none", fontWeight: 500 }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button type="submit" disabled={loading || googleLoading} loading={loading}>
            Entrar a {brandName}
          </Button>

          <label style={{ display: "flex" as const, gap: 8, alignItems: "center" as const, fontSize: 14, color: "#444", justifyContent: "center" }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.currentTarget.checked)} /> 
            Mantener la sesión iniciada
          </label>
        </form>

        {message && (
          <p role="status" style={{ marginTop: 16, textAlign: "center", wordBreak: "break-word", overflowWrap: "anywhere", color: "#dc2626", fontSize: 14 }}>
            {message}
          </p>
        )}

        {/* Help text at bottom */}
        <div style={{ 
          marginTop: 32, 
          textAlign: "center", 
          fontSize: 12, 
          color: "#64748b",
          lineHeight: 1.6
        }}>
          ¿Necesitas ayuda?<br/>
          Mándanos un correo a{" "}
          <a href={`mailto:${supportEmail}`} style={{ color: "#0B71FE", textDecoration: "none" }}>
            {supportEmail}
          </a>
          {" "}como escríbenos por Whatsapp al +52 55 4183 1994
        </div>
      </Card>

      {/* Version info bottom left */}
      <div style={{ 
        position: "fixed" as const, 
        bottom: 20, 
        left: 20, 
        fontSize: 11, 
        color: "#94a3b8",
        fontFamily: "monospace",
        zIndex: 10
      }}>
        <div>Local: 4.5.1</div>
        <div>Global: 4.5.1</div>
      </div>

      <style>{`
        .auth-page .auth-form { box-sizing: border-box; }
        .auth-page .auth-form > * { min-width: 0; }
        .auth-page .auth-form .auth-input,
        .auth-page .auth-form button[type="submit"] {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          margin: 0 !important;
        }
        .auth-page .auth-form button[type="submit"] { border: 1px solid transparent !important; }
        .auth-page .auth-link:hover { color: #1e40af !important; text-decoration: underline !important; }
        .auth-page .auth-input:hover { border-color: rgba(11, 113, 254, 0.4) !important; background: #ffffff !important; }
        .auth-page .auth-form button[type="submit"]:hover:not(:disabled) { background: #1e80ff !important; box-shadow: 0 8px 20px rgba(11, 113, 254, 0.35) !important; }
      `}</style>
    </main>
  )
}

export default function BIZENLoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        background: "#FFFFFF",
        minHeight: "100dvh",
        display: "grid" as const,
        placeItems: "center",
        color: "#111",
        fontSize: 18
      }}>
        Cargando...
      </div>
    }>
      <BIZENLoginContent />
    </Suspense>
  )
}


