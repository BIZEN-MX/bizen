"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options?: { action: string }) => Promise<string>
    }
  }
}

const brandName = "BIZEN"
const logoSrc = "/bizen-logo.png"
const bgColor = "#FFFFFF"
const linkColor = "#0E4A7A"

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
        ...(props.style || {}),
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
      {loading ? "Creando…" : rest.children}
    </button>
  )
}

export default function BIZENSignupPage() {
  const [state, setState] = React.useState({
    success: false,
    message: null as string | null,
    errors: {} as Record<string, string[]>,
    loading: false
  })

  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [accepted, setAccepted] = React.useState(false)
  const [showPass, setShowPass] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)
  const [recaptchaLoaded, setRecaptchaLoaded] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  React.useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => setRecaptchaLoaded(true)
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState(prev => ({ ...prev, loading: true, message: null, errors: {} }))
    try {
      let recaptchaToken = ''
      if (recaptchaLoaded) {
        recaptchaToken = await new Promise<string>((resolve) => {
          window.grecaptcha?.ready(() => {
            window.grecaptcha!.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: 'signup' })
              .then((token: string) => resolve(token))
              .catch(() => resolve(''))
          })
        })
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/bizen/auth/callback`,
          data: { app_source: 'bizen', recaptchaToken }
        }
      })
      if (error) {
        setState({ success: false, message: error.message, errors: {}, loading: false })
      } else {
        setState({ success: true, message: '✅ Cuenta creada. Verifica tu correo para continuar.', errors: {}, loading: false })
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err) {
      setState({ success: false, message: 'Error de autenticación. Intenta de nuevo', errors: {}, loading: false })
    }
  }

  async function handleGoogleSignUp() {
    setState(prev => ({ ...prev, message: null }))
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
      const errorMessage = err instanceof Error ? err.message : "Error al registrarse con Google"
      setState(prev => ({ ...prev, message: errorMessage }))
      setGoogleLoading(false)
    }
  }

  return (
    <main style={{ background: bgColor, minHeight: "100dvh", padding: "clamp(16px, 4vw, 24px)", display: "grid" as const, placeItems: "center" }}>
      <div style={{
        position: "fixed" as const, top: 0, left: 0, right: 0, 
        height: "clamp(56px, 12vw, 64px)",
        display: "flex" as const, alignItems: "center" as const, justifyContent: "flex-start" as const,
        background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)", color: "#111",
        paddingLeft: "clamp(16px, 4vw, 24px)",
      }}>
        <Link href="/bizen" style={{ display: "flex" as const, alignItems: "center" as const, gap: 10, textDecoration: "none", color: "inherit" }}>
          <Image src={logoSrc} alt={`${brandName} logo`} width={40} height={40} priority />
          <strong style={{ fontSize: "clamp(16px, 4vw, 20px)", color: "#0B71FE", fontFamily: 'Montserrat, sans-serif' }}>{brandName}</strong>
        </Link>
      </div>

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
        <div style={{ width: "100%", maxWidth: 480, flex: "1 1 480px" }}>
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
            }}>Crear cuenta</h1>
            <p style={{ margin: 0, fontSize: "clamp(14px, 3vw, 16px)", color: "#525252" }}>
              Bienvenido a <strong>{brandName}</strong>. Completa tus datos para empezar.
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ display: "grid" as const, gap: 14, maxWidth: 360, margin: "0 auto" }}>
            <div>
              <Label htmlFor="fullName">Nombre de usuario</Label>
              <TextField id="fullName" name="fullName" placeholder="nombre_de_usuario" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextField id="email" name="email" type="email" placeholder="tu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <div style={{ display: "flex" as const, justifyContent: "space-between" as const, alignItems: "end" }}>
                <Label htmlFor="password">Contraseña</Label>
                <button type="button" onClick={() => setShowPass((s) => !s)} style={{ background: "transparent", border: "none", color: linkColor, fontSize: 12, cursor: "pointer" }}>
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <TextField id="password" name="password" type={showPass ? "text" : "password"} placeholder="Mínimo 6 caracteres" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <div style={{ display: "flex" as const, gap: 10, alignItems: "flex-start" }}>
              <input id="accepted" name="accepted" type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} style={{ marginTop: 2 }} />
              <label htmlFor="accepted" style={{ fontSize: 12, color: "#444" }}>Acepto los términos y condiciones</label>
            </div>
            <Button type="submit" disabled={state.loading || googleLoading} loading={state.loading}>{state.loading ? "Creando cuenta..." : "Registrarme"}</Button>

            <div style={{ textAlign: "center", fontSize: 13, color: "#666", margin: "12px 0" }}>o continúa con</div>
            
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={state.loading || googleLoading}
              style={{
                height: 46,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                width: "100%",
                background: "#fff",
                color: "#333",
                fontWeight: 600,
                cursor: googleLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transition: "all 0.2s ease",
                fontFamily: 'Montserrat, sans-serif',
              }}
              onMouseEnter={(e) => !googleLoading && (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "Redirigiendo..." : "Continuar con Google"}
            </button>

            <div style={{ textAlign: "center", fontSize: 14, marginTop: 8 }}>
              ¿Ya tienes cuenta? <a href="/login" style={{ color: "#0B71FE", fontWeight: 700, textDecoration: "none" }}>Inicia sesión</a>
            </div>
          </form>

          {state.message && (
            <p role="status" style={{ marginTop: 14, wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "pre-wrap", color: state.success ? '#059669' : '#dc2626' }}>
              {state.message}
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

        <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "600px", display: "flex", justifyContent: "center", order: 2 }}>
          <div style={{ 
            position: "relative", 
            background: "white", 
            borderRadius: "clamp(16px, 4vw, 32px)", 
            padding: "clamp(24px, 5vw, 50px)", 
            boxShadow: "0 24px 64px rgba(15, 98, 254, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)" 
          }}>
            <Image 
              src="/Billy looking at the right.jpeg" 
              alt="Billy" 
              width={320} 
              height={320} 
              style={{ 
                display: "block", 
                borderRadius: "16px",
                width: "100%",
                height: "auto",
                maxWidth: "clamp(240px, 40vw, 320px)",
              }} 
              priority 
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes shimmer-button { 0% { background-position: 0% 0%; } 50% { background-position: 100% 0%; } 100% { background-position: 0% 0%; } }
        @media (max-width: 1024px) {
          main > div {
            flex-direction: column !important;
            gap: 32px !important;
          }
          main > div > div:last-child {
            order: 1;
          }
          main > div > div:first-child {
            order: 2;
          }
        }
        @media (max-width: 1159px) {
          main > div > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </main>
  )
}


