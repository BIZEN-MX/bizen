"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const brandName = "BIZEN"
const logoSrc = "/bsmx-logo.png"
const bgColor = "#FFFFFF"
const buttonColor = "#0B71FE"
const linkColor = "#0E4A7A"
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
  return <label htmlFor={htmlFor} style={{ display: "block" as const, fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 6 }}>{children}</label>
}

function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        height: 44,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: "0 14px",
        outline: "none",
        fontSize: 14,
        color: "#111",
        background: "#fff",
        transition: "box-shadow .2s ease, border-color .2s ease",
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 4px ${linkColor}26`)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  )
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const { loading, ...rest } = props
  return (
    <button
      {...rest}
      style={{
        height: 46,
        borderRadius: 12,
        border: "none",
        width: "100%",
        background: rest.disabled ? "#cfd8e3" : `linear-gradient(90deg, #0B71FE 0%, #4A9EFF 50%, #0B71FE 100%)`,
        backgroundSize: rest.disabled ? "auto" : "200% auto",
        backgroundPosition: rest.disabled ? "left" : "0% 0%",
        color: "#fff",
        fontWeight: 700,
        letterSpacing: 0.2,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        transform: "translateZ(0)",
        transition: "transform .06s, filter .2s, box-shadow .2s",
        boxShadow: rest.disabled ? "none" : "0 6px 16px rgba(0,0,0,0.12)",
        fontFamily: 'Montserrat, sans-serif',
        animation: rest.disabled ? "none" : "shimmer-button 3s ease-in-out infinite",
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
      <div style={{ height: 1, background: "rgba(0,0,0,0.08)" }} />
      <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
      <div style={{ height: 1, background: "rgba(0,0,0,0.08)" }} />
    </div>
  )
}

function BIZENLoginContent() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPass, setShowPass] = React.useState(false)
  const [remember, setRemember] = React.useState(true)
  const [isTablet, setIsTablet] = React.useState(false)

  // Check window size safely
  React.useEffect(() => {
    setIsTablet(window.innerWidth <= 1024)
    const handleResize = () => setIsTablet(window.innerWidth <= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Function to translate Supabase error messages to Spanish
  function translateAuthError(errorMessage: string): string {
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
    
    // Check for exact matches first
    if (errorTranslations[errorMessage]) {
      return errorTranslations[errorMessage]
    }
    
    // Check for partial matches
    for (const [english, spanish] of Object.entries(errorTranslations)) {
      if (errorMessage.includes(english)) {
        return spanish
      }
    }
    
    // Default fallback
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      router.replace("/bizen/dashboard") // BIZEN dashboard
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión"
      setMessage(translateAuthError(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ 
      background: bgColor, 
      minHeight: "100dvh", 
      padding: "clamp(16px, 4vw, 24px)",
      display: "grid" as const, 
      placeItems: "center" 
    }}>
      {/* Header */}
      <div style={{
        position: "fixed" as const, top: 0, left: 0, right: 0, 
        height: "clamp(56px, 12vw, 64px)",
        display: "flex" as const, alignItems: "center" as const, justifyContent: "flex-start" as const,
        background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)", color: "#111",
        zIndex: 1000,
        paddingLeft: "clamp(16px, 4vw, 24px)",
      }}>
        <Link href="/bizen" style={{ display: "flex" as const, alignItems: "center" as const, gap: 10, textDecoration: "none", color: "inherit" }}>
          <Image src={logoSrc} alt={`${brandName} logo`} width={40} height={40} priority />
          <strong style={{ fontSize: "clamp(16px, 4vw, 20px)", color: "#0B71FE", fontFamily: 'Montserrat, sans-serif' }}>{brandName}</strong>
        </Link>
      </div>

      {/* Layout with Billy on LEFT, Form on RIGHT */}
      <div style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        paddingTop: "clamp(70px, 15vw, 100px)",
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: "clamp(24px, 6vw, 60px)",
        flexWrap: "wrap" as const,
      }}>
        {/* Billy - LEFT SIDE */}
        <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "600px", order: isTablet ? 2 : 1, display: "flex", justifyContent: "center" }}>
          <div style={{
            position: "relative",
            background: "white",
            borderRadius: "32px",
            padding: "50px",
            boxShadow: "0 24px 64px rgba(15, 98, 254, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)",
          }}>
            <Image
              src="/billy looking at the left.png"
              alt="Billy"
              width={320}
              height={320}
              style={{ 
                display: "block",
                borderRadius: "16px",
              }}
              priority
            />
          </div>
        </div>

        {/* Login Form */}
        <div style={{
          width: "100%",
          maxWidth: 480,
          flex: "1 1 480px",
          order: isTablet ? 1 : 2,
        }}>
        <Card>
          <div style={{ display: "grid" as const, gap: "clamp(6px, 1.5vw, 8px)", marginBottom: "clamp(12px, 3vw, 16px)", textAlign: "center" }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: "clamp(22px, 5vw, 28px)", 
              background: "linear-gradient(90deg, #0B71FE 0%, #4A9EFF 50%, #0B71FE 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer-text 3s ease-in-out infinite",
              fontWeight: 700
            }}>Iniciar sesión</h1>
            <p style={{ margin: 0, fontSize: "clamp(14px, 3vw, 16px)", color: "#525252" }}>Bienvenido de vuelta a <strong>{brandName}</strong>.</p>
            <p style={{ margin: "4px 0 0", fontSize: "clamp(13px, 3vw, 15px)", color: "#666", fontWeight: 500 }}>Accede a contenido empresarial y finanzas</p>
          </div>

          <form onSubmit={onSubmit} style={{ display: "grid" as const, gap: 14, maxWidth: 360, margin: "0 auto" }}>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextField id="email" name="email" type="email" placeholder="tu@email.com" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
            </div>

            <div>
              <div style={{ display: "flex" as const, justifyContent: "space-between" as const, alignItems: "end" }}>
                <Label htmlFor="password">Contraseña</Label>
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  style={{ background: "transparent", border: "none", color: linkColor, fontSize: 12, cursor: "pointer" }}>
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <TextField id="password" name="password" type={showPass ? "text" : "password"} placeholder="Tu contraseña"
                required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
            </div>

            <div style={{ display: "flex" as const, justifyContent: "space-between" as const, alignItems: "center" }}>
              <label style={{ display: "inline-flex" as const, gap: 8, alignItems: "center" as const, fontSize: 12, color: "#444" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.currentTarget.checked)} /> Recuérdame
              </label>
              <a href="/bizen/forgot-password" style={{ fontSize: 12, color: linkColor, textDecoration: "none", fontWeight: 600 }}>¿Olvidaste tu contraseña?</a>
            </div>

            <Button type="submit" disabled={loading} loading={loading}>Entrar</Button>

            <Divider label="¿No tienes cuenta?" />
            <a href="/bizen/signup" style={{ display: "inline-block" as const, textAlign: "center", width: "100%", textDecoration: "none", fontSize: 14, color: linkColor, fontWeight: 600 }}>
              Crear cuenta
            </a>
          </form>

          {message && (
            <p role="status" style={{ marginTop: 14, textAlign: "center", wordBreak: "break-word", overflowWrap: "anywhere", color: "#dc2626" }}>
              {message}
            </p>
          )}
        </Card>

        <div style={{ textAlign: "center", marginTop: 16, color: "#666", fontSize: 12 }}>
          © {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
          <div style={{ marginTop: 8 }}>
            <Link href="/bizen/terminos" style={{ color: "#0B71FE", textDecoration: "underline", marginRight: 16 }}>Términos</Link>
            <Link href="/bizen/privacidad" style={{ color: "#0B71FE", textDecoration: "underline" }}>Aviso de Privacidad</Link>
          </div>
        </div>
      </div>
      </div>

      <style>{`
        @keyframes shimmer-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer-button {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }
        
        @media (max-width: 1024px) {
          main > div {
            flex-direction: column !important;
            gap: 32px !important;
          }
          main > div > div:first-child {
            order: 2; /* Billy goes to bottom on mobile */
          }
        }
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
