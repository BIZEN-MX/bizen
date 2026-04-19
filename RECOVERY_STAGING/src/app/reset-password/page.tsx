"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
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

function TextField(props: React.InputHTMLAttributes<HTMLInputElement> & { rightElement?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="text-slate-300 text-xs font-semibold uppercase tracking-wider ml-1">
        {props.placeholder}
      </label>
      <div className="relative">
        <input
          {...props}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "0 18px",
            paddingRight: props.rightElement ? "50px" : "18px",
            outline: "none",
            fontSize: 16,
            color: "#fff",
            background: "#0a1324",
            transition: "all .2s ease",
          }}
          className="focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE20]"
        />
        {props.rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {props.rightElement}
          </div>
        )}
      </div>
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
           <span>Actualizando...</span>
        </div>
      ) : (
        rest.children
      )}
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
      router.push("/login")
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
      if (error) return setMessage(`Error: ${error.message}`)
      setMessage("¡Éxito! Tu contraseña ha sido actualizada.")
      setTimeout(() => router.replace("/dashboard"), 2000)
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  if (!isVerified) return null

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
          <p className="text-slate-400 text-sm font-medium">Nueva Seguridad</p>
        </div>

        <Card>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Crea tu nueva clave</h1>
            <p className="text-slate-400 text-sm">Establece una contraseña segura.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <TextField
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Nueva contraseña"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              rightElement={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-500 hover:text-white">
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              placeholder="Repetir contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              rightElement={
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-slate-500 hover:text-white">
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <Button type="submit" disabled={loading} loading={loading}>
              Actualizar Contraseña
            </Button>
          </form>

          {message && (
            <p className={`mt-6 text-center text-sm font-medium ${message.includes("Error") ? "text-red-400" : "text-emerald-400"}`}>
              {message}
            </p>
          )}

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-semibold flex items-center justify-center gap-2">
              <span>←</span> Cancelar
            </Link>
          </div>
        </Card>

        <div className="mt-12 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          BIZEN MÉXICO © {new Date().getFullYear()}
        </div>
      </motion.div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
