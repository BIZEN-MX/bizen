"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MailIcon } from "@/components/CustomIcons"
import { motion } from "framer-motion"
import AuthBackground from "@/components/AuthBackground"

// UI Components
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        background: "#030b1a",
        padding: "clamp(24px, 5vw, 32px)",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="text-slate-300 text-xs font-semibold uppercase tracking-wider ml-1">
        {props.placeholder}
      </label>
      <input
        {...props}
        style={{
          width: "100%",
          height: 52,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "0 18px",
          outline: "none",
          fontSize: 16,
          color: "#fff",
          background: "#0a1324",
          transition: "all .2s ease",
        }}
        className="focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE20]"
      />
    </div>
  )
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const { loading, ...rest } = props
  return (
    <button
      {...rest}
      className={`relative h-[52px] rounded-xl w-full font-bold text-white transition-all overflow-hidden ${
        rest.disabled ? "bg-slate-800 cursor-not-allowed" : "bg-[#0F62FE] hover:bg-[#0043ce] active:scale-[0.98]"
      }`}
      style={{
        boxShadow: rest.disabled ? "none" : "0 8px 20px rgba(15, 98, 254, 0.3)",
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
           <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
           <span>Enviando...</span>
        </div>
      ) : (
        rest.children
      )}
    </button>
  )
}

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  const [emailSent, setEmailSent] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)

    if (!email) return setMessage("Por favor ingresa tu email")

    try {
      setLoading(true)
      const { error } = await resetPassword(email)
      if (error) return setMessage(error.message)
      setEmailSent(true)
      setMessage("¡Todo listo! Revisa tu bandeja de entrada.")
    } catch (err: any) {
      setMessage("Error al enviar el email de recuperación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ height: "100vh", overflow: "hidden" }} className="relative w-full flex items-center justify-center bg-[#01040f] p-6">
      <AuthBackground />

      <div style={{ position: "absolute", top: 40, left: 40, zIndex: 100 }}>
        <Link href="/login" className="flex items-center gap-2 group">
          <span style={{ fontSize: 24, fontWeight: 400, color: "#ffffff", letterSpacing: "-0.04em", fontFamily: "var(--font-family)" }}>
            BIZEN
          </span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <p className="text-slate-400 text-sm font-medium">Recuperación de Cuenta</p>
        </div>

        {!emailSent ? (
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">¿Olvidaste tu contraseña?</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ingresa tu correo y te enviaremos instrucciones.
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <TextField
                id="email"
                name="email"
                type="email"
                placeholder="Email corporativo o personal"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />

              <Button type="submit" disabled={loading} loading={loading}>
                Enviar Enlace
              </Button>
            </form>

            {message && (
              <p className={`mt-6 text-center text-sm font-medium ${message.includes("Error") ? "text-red-400" : "text-emerald-400"}`}>
                {message}
              </p>
            )}

            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                <span>←</span> Volver al inicio
              </Link>
            </div>
          </Card>
        ) : (
          <Card style={{ textAlign: "center" }}>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#0F62FE15] flex items-center justify-center border border-[#0F62FE30]">
                <MailIcon size={40} color="#0F62FE" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">¡Correo enviado!</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Hemos enviado un enlace a <strong className="text-white">{email}</strong>.
            </p>

            <div className="flex flex-col gap-4">
              <Button onClick={() => setEmailSent(false)}>
                Intentar con otro correo
              </Button>
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2 py-2">
                Ir al Inicio
              </Link>
            </div>
          </Card>
        )}

        <div className="mt-12 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          BIZEN MÉXICO © {new Date().getFullYear()}
        </div>
      </motion.div>
    </main>
  )
}
