"use client"
import * as React from "react"
import BillyCelebration from "./BillyCelebration"
import { CheckIcon, WarningIcon } from "./CustomIcons"

type Props = { moduleId: number; section: number }

export default function MarkCompleteButton({ moduleId, section }: Props) {
  const [loading, setLoading] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)
  const [showBilly, setShowBilly] = React.useState(false)

  return (
    <div style={{ marginTop: 16 }}>
      <button
        disabled={loading}
        onClick={async () => {
          setMsg(null)
          setLoading(true)
          try {
            const r = await fetch("/api/sections/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ moduleId, sectionNumber: section }),
            })
            const data = await r.json()

            if (!r.ok) {
              // Show helpful message about what's missing
              if (data.error === "requirements_not_met") {
                setMsg(data.message)
                return
              }
              throw new Error(data?.message || data?.error || "Error al completar")
            }

            // Show Billy celebration!
            setShowBilly(true)
            setMsg("¡Sección completada! La siguiente sección está desbloqueada.")
          } catch (e: unknown) {
            const err = e as Error
            setMsg(err.message)
          } finally {
            setLoading(false)
          }
        }}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,.15)",
          background: "#0F62FE",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {loading ? "Guardando…" : "Marcar esta sección como completada"}
      </button>
      {msg && (
        <p style={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: msg.includes('¡Sección completada!') ? '#15803D' : '#DC2626',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {msg.includes('¡Sección completada!') ? <CheckIcon size={16} color="#15803D" /> : <WarningIcon size={16} color="#DC2626" />}
          {msg}
        </p>
      )}

      {/* Billy Celebration when section is completed */}
      {showBilly && (
        <BillyCelebration
          message="¡Bien hecho, Dragón!"
          onClose={() => setShowBilly(false)}
          autoCloseAfter={3000}
        />
      )}
    </div>
  )
}
