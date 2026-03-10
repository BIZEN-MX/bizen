"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"

// ===== Brand & Theme
const brandName = "BIZEN"
const logoSrc = "/bizen-logo.png"
const bgColor = "#0B71FE"
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
        padding: 24,
        minWidth: 0,
        overflow: "hidden" as const,
        ...(props.style || {}),
      }}
    />
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} style={{ display: "block" as const, fontSize: 12, fontWeight: 500, color: "#333", marginBottom: 6 }}>{children}</label>
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
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 4px ${linkColor}26`)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  )
}

function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
) {
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
        fontWeight: 500,
        letterSpacing: 0.2,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        transform: "translateZ(0)",
        transition: "transform .06s, filter .2s, box-shadow .2s",
        boxShadow: rest.disabled ? "none" : "0 6px 16px rgba(0,0,0,0.12)",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {loading ? "Actualizando..." : rest.children}
    </button>
  )
}

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updatePassword } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPass, setShowPass] = React.useState(false)
  const [showConfirmPass, setShowConfirmPass] = React.useState(false)

  const isVerified = searchParams.get("verified") === "true"

  React.useEffect(() => {
    if (!isVerified) {
      window.open("/login", "_blank")
    }
  }, [isVerified, router])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      return setMessage("Las contraseñas no coinciden")
    }

    if (password.length < 6) {
      return setMessage("La contraseña debe tener al menos 6 caracteres")
    }

    try {
      setLoading(true)
      const { error } = await updatePassword(password)

      if (error) {
        return setMessage(`Error: ${error.message}`)
      }

      setMessage("Contraseña actualizada exitosamente. Redirigiendo...")
      setTimeout(() => {
        router.replace("/modules/menu")
      }, 2000)
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  if (!isVerified) {
    return null // Will redirect
  }

  return (
    <main style={{ background: bgColor, minHeight: "100dvh", padding: 24, display: "grid" as const, placeItems: "center" }}>
      {/* Header */}
      <div style={{
        position: "fixed" as const, top: 0, left: 0, right: 0, height: 64,
        display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const,
        background: bgColor, borderBottom: "1px solid rgba(255,255,255,0.12)", color: "#fff",
      }}>
        <div style={{ display: "flex" as const, alignItems: "center" as const, gap: 12 }}>
          <Image src={logoSrc} alt={`${brandName} logo`} width={40} height={40} priority />
          <strong style={{ fontSize: 20 }}>{brandName}</strong>
        </div>
        <div style={{ position: "absolute" as const, right: 20, fontSize: 12, color: "#e5ecf5" }}>
          ¿Necesitas ayuda? <a href={`mailto:${supportEmail}`} style={{ color: "#fff", textDecoration: "underline" }}>Escríbenos</a>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 400, marginTop: 20 }}>
        <Card>
          <div style={{ display: "grid" as const, gap: 8, marginBottom: 16, textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: 24, color: "#111" }}>Nueva contraseña</h1>
            <p style={{ margin: 0, fontSize: 14, color: "#525252" }}>
              Establece una nueva contraseña para tu cuenta de <strong>{brandName}</strong>.
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ display: "grid" as const, gap: 14 }}>
            <div>
              <Label htmlFor="password">Nueva contraseña</Label>
              <div style={{ position: "relative" }}>
                <TextField
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
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
                    color: linkColor,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div style={{ position: "relative" }}>
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass((s) => !s)}
                  style={{
                    position: "absolute" as const,
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: linkColor,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} loading={loading}>
              Actualizar contraseña
            </Button>
          </form>

          {message && (
            <p role="status" style={{
              marginTop: 14,
              textAlign: "center",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              color: message.includes("exitosamente") ? "#059669" : "#dc2626"
            }}>
              {message}
            </p>
          )}
        </Card>

        <div style={{ textAlign: "center", marginTop: 16, color: "#eaf2ff", fontSize: 12 }}>
          © {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
        </div>
      </div>
    </main>
  )
}

// ===== Page (wrapped in Suspense)
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
