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
      {loading ? "Creando cuenta..." : rest.children}
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
    const errorTranslations: Record<string, string> = {
      "User already registered": "Este correo ya está registrado. Intenta iniciar sesión.",
      "Invalid login credentials": "Credenciales inválidas.",
      "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
      "Invalid email": "Email inválido.",
      "Signup is disabled": "El registro está deshabilitado temporalmente."
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
    if (!email || !password || !fullName) {
      setMessage("Por favor completa todos los campos")
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error

      // Success - show message and redirect to diagnostic
      setMessage("¡Cuenta creada con éxito! Redirigiendo al examen diagnóstico...")
      setTimeout(() => {
        router.push("/diagnostic")
      }, 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear cuenta"
      setMessage(isNetworkError(err) ? "No hay conexión. Revisa tu internet e intenta de nuevo." : translateAuthError(errorMessage))
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
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrarse con Google"
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

      {/* Decorative science elements */}
      <div aria-hidden style={{ position: "absolute" as const, top: 60, left: 80, opacity: 0.6, zIndex: 0 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#FF6B9D" strokeWidth="2" />
          <circle cx="40" cy="40" r="5" fill="#FF6B9D" />
          <circle cx="15" cy="40" r="8" fill="#93C5FD" />
          <circle cx="65" cy="40" r="8" fill="#93C5FD" />
        </svg>
      </div>
      <div aria-hidden style={{ position: "absolute" as const, bottom: 80, right: 100, opacity: 0.5, zIndex: 0 }}>
        <svg width="90" height="70" viewBox="0 0 90 70">
          <path d="M10 35 L30 20 L50 35 L70 20 L80 35" fill="none" stroke="#FFA500" strokeWidth="3" />
          <circle cx="10" cy="35" r="6" fill="#FFA500" />
          <circle cx="30" cy="20" r="6" fill="#FFA500" />
          <circle cx="50" cy="35" r="6" fill="#FFA500" />
          <circle cx="70" cy="20" r="6" fill="#FFA500" />
        </svg>
      </div>

      <Card style={{
        width: "100%",
        maxWidth: 480,
        padding: "clamp(24px, 5vw, 40px)",
        position: "relative" as const,
        zIndex: 1,
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Image
            src="/hero1.png"
            alt="BIZEN"
            width={80}
            height={80}
            style={{ width: 80, height: 80, objectFit: "contain" }}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0B71FE",
            margin: 0,
            marginBottom: 8,
            fontFamily: "Montserrat, sans-serif"
          }}>
            Crea tu cuenta en {brandName}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Únete a la revolución de la educación financiera</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form" style={{ display: "grid" as const, gap: 16 }}>
          <div>
            <Label htmlFor="fullName">Nombre completo *</Label>
            <TextField
              id="fullName"
              name="fullName"
              type="text"
              placeholder="¿Cómo te llamas?"
              required
              value={fullName}
              onChange={(e) => setFullName(e.currentTarget.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <TextField
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
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
                placeholder="Mínimo 6 caracteres"
                required
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
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  {showPass ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading || googleLoading} loading={loading}>
            Registrarme ahora
          </Button>

          <Divider label="o regístrate con" />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            style={{
              height: AUTH_CONTROL_HEIGHT,
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              color: "#1e293b",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
        </form>

        {message && (
          <p role="status" style={{ marginTop: 16, textAlign: "center", color: message.includes("éxito") ? "#059669" : "#dc2626", fontSize: 14, fontWeight: 500 }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 14 }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "#0B71FE", fontWeight: 700, textDecoration: "none" }}>
            Inicia sesión
          </Link>
        </div>
      </Card>

      <style>{`
        .auth-page .auth-form .auth-input:focus { border-color: #0B71FE !important; }
        .auth-page .auth-link:hover { text-decoration: underline !important; }
      `}</style>
    </main>
  )
}

export default function BIZENSignupPage() {
  return (
    <Suspense fallback={<div style={{ background: "#FFFFFF", minHeight: "100dvh", display: "grid", placeItems: "center" }}>Cargando...</div>}>
      <BIZENSignupContent />
    </Suspense>
  )
}
