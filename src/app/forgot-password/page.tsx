"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MailIcon } from "@/components/CustomIcons"

// ===== Brand & Theme
const brandName = "BIZEN"
const logoSrc = "/bizen-logo.png"
const bgColor = "#FFFFFF"
const buttonColor = "#0B71FE"
const linkColor = "#0E4A7A"
const supportEmail = "soporte@bizen.mx"

// ===== UI Components
function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        background: "#FBFAF5",
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
        background: "#FBFAF5",
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
        background: rest.disabled ? "#cfd8e3" : buttonColor,
        color: "#fff",
        fontWeight: 700,
        letterSpacing: 0.2,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        transform: "translateZ(0)",
        transition: "transform .06s, filter .2s, box-shadow .2s",
        boxShadow: rest.disabled ? "none" : "0 6px 16px rgba(0,0,0,0.12)",
        ...(props.style || {}),
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {loading ? "Enviando..." : rest.children}
    </button>
  )
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { resetPassword } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  const [emailSent, setEmailSent] = React.useState(false)

  // Function to translate Supabase error messages to Spanish
  function translateAuthError(errorMessage: string): string {
    const errorTranslations: Record<string, string> = {
      "Invalid email": "Email inválido",
      "User not found": "Usuario no encontrado",
      "Too many requests": "Demasiados intentos. Espera un momento antes de intentar de nuevo.",
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
    return "Error al enviar el email de recuperación"
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)

    if (!email) {
      return setMessage("Por favor ingresa tu email")
    }

    try {
      setLoading(true)
      const { error } = await resetPassword(email)

      if (error) {
        return setMessage(translateAuthError(error.message))
      }

      setEmailSent(true)
      setMessage("¡Email enviado! Revisa tu correo para resetear tu contraseña.")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar el email"
      setMessage(translateAuthError(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ background: bgColor, minHeight: "100dvh", padding: 24, display: "grid" as const, placeItems: "center" }}>
      {/* Header */}
      <div style={{
        position: "fixed" as const, top: 0, left: 0, right: 0, height: 64,
        display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const,
        background: bgColor, borderBottom: "1px solid rgba(0,0,0,0.08)", color: "#111",
      }}>
        <Link href="/" style={{ display: "flex" as const, alignItems: "center" as const, gap: 10, textDecoration: "none", color: "inherit" }}>
          <Image src={logoSrc} alt={`${brandName} logo`} width={40} height={40} priority />
          <strong style={{ fontSize: 20 }}>{brandName}</strong>
        </Link>
        <div style={{ position: "absolute" as const, right: 20, fontSize: 12, color: "#666" }}>
          ¿Necesitas ayuda? <a href={`mailto:${supportEmail}`} style={{ color: linkColor, textDecoration: "underline" }}>Escríbenos</a>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 420, marginTop: 20 }}>
        {!emailSent ? (
          <Card>
            <div style={{ display: "grid" as const, gap: 8, marginBottom: 20, textAlign: "center" }}>
              <h1 style={{ margin: 0, fontSize: 24, color: "#111" }}>Recuperar contraseña</h1>
              <p style={{ margin: 0, fontSize: 14, color: "#525252" }}>
                Te enviaremos un link para resetear tu contraseña a tu correo electrónico.
              </p>
            </div>

            <form onSubmit={onSubmit} style={{ display: "grid" as const, gap: 16 }}>
              <div>
                <Label htmlFor="email">Email</Label>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>

              <Button type="submit" disabled={loading} loading={loading}>
                Enviar link de recuperación
              </Button>
            </form>

            {message && (
              <p role="status" style={{
                marginTop: 14,
                textAlign: "center",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                color: message.includes("¡Email enviado") || message.includes("Revisa tu correo") ? "#059669" : "#dc2626"
              }}>
                {message}
              </p>
            )}

            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Link href="/login" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: linkColor, textDecoration: "none", fontWeight: 600 }}>
                ← Volver al login
              </Link>
            </div>
          </Card>
        ) : (
          <Card style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", background: "#EFF6FF",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <MailIcon size={40} color="#0B71FE" />
              </div>
            </div>

            <h1 style={{ margin: "0 0 12px 0", fontSize: 24, color: "#111" }}>¡Revisa tu email!</h1>
            <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#525252" }}>
              Te enviamos un link de recuperación a <strong>{email}</strong>
            </p>
            <p style={{ margin: "0 0 24px 0", fontSize: 14, color: "#525252" }}>
              Haz clic en el link para resetear tu contraseña.
            </p>

            <div style={{ display: "grid" as const, gap: 12 }}>
              <div style={{ fontSize: 12, color: "#666" }}>
                ¿No recibiste el email? Revisa tu carpeta de spam o intenta de nuevo.
              </div>
              <Button
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                  setMessage(null)
                }}
              >
                Enviar de nuevo
              </Button>
              <Link href="/login" target="_blank" rel="noopener noreferrer" style={{ display: "block" as const, textAlign: "center", fontSize: 14, color: linkColor, textDecoration: "none", fontWeight: 600 }}>
                ← Volver al login
              </Link>
            </div>
          </Card>
        )}

        <div style={{ textAlign: "center", marginTop: 16, color: "#666", fontSize: 12 }}>
          © {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
        </div>
      </div>
    </main >
  )
}

