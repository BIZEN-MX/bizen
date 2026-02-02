"use client"

/**
 * Reto diario — daily challenge page.
 */

import { useEffect } from "react"
import Link from "next/link"

export default function RetoDiarioPage() {
  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
    }
    return () => {
      bodyEl.style.background = ""
    }
  }, [])

  const today = new Date()
  const dayName = today.toLocaleDateString("es-MX", { weekday: "long" })
  const dateStr = today.toLocaleDateString("es-MX", { day: "numeric", month: "long" })

  return (
    <div
      style={{
        padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 24px)",
        maxWidth: "720px",
        margin: "0 auto",
        fontFamily: "'Inter', 'Poppins', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(28px, 4vw, 36px)",
          fontWeight: 800,
          color: "#111",
          margin: "0 0 8px",
        }}
      >
        Reto diario
      </h1>
      <p
        style={{
          fontSize: "clamp(15px, 0.95rem, 17px)",
          color: "#64748b",
          lineHeight: 1.6,
          margin: "0 0 32px",
        }}
      >
        Un pequeño desafío cada día para reforzar tus finanzas personales.
      </p>

      <div
        style={{
          background: "linear-gradient(180deg, rgba(248, 251, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
          border: "1px solid rgba(15, 98, 254, 0.2)",
          borderRadius: "20px",
          padding: "clamp(24px, 4vw, 32px)",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(15, 98, 254, 0.08)",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>
          {dayName}, {dateStr}
        </div>
        <h2 style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: 700, color: "#111", margin: "0 0 12px" }}>
          Reto de hoy
        </h2>
        <p style={{ fontSize: "clamp(15px, 1rem, 17px)", color: "#374151", lineHeight: 1.6, margin: "0 0 20px" }}>
          Dedica 5 minutos a revisar tus gastos de la última semana. Anota en qué categoría gastaste más y una idea para ahorrar en esa categoría el próximo mes.
        </p>
        <Link
          href="/courses"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#0F62FE",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 4px 14px rgba(15, 98, 254, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0a4fc4"
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(15, 98, 254, 0.4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0F62FE"
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(15, 98, 254, 0.3)"
          }}
        >
          Ir a cursos para practicar
        </Link>
      </div>

      <div
        style={{
          padding: "16px 20px",
          background: "rgba(254, 243, 199, 0.4)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          borderRadius: "14px",
          fontSize: "14px",
          color: "#78350F",
          lineHeight: 1.55,
        }}
      >
        <strong>Consejo:</strong> Completa el reto y anótalo en tu presupuesto o en una nota. La constancia en pequeños pasos mejora tus hábitos financieros.
      </div>
    </div>
  )
}
