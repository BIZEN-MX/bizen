"use client"

/**
 * Reto diario — daily challenge page.
 */

import { useEffect } from "react"
import Image from "next/image"
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
    <>
      <style>{`
        @media (max-width: 767px) {
          .reto-diario-outer { margin-left: 0 !important; padding-bottom: 80px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .reto-diario-outer { margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .reto-diario-outer { margin-left: 280px !important; }
        }
      `}</style>
      <div
        className="reto-diario-outer"
        style={{
          position: "relative",
          minHeight: "100vh",
          padding: "clamp(32px, 6vw, 56px) clamp(20px, 4vw, 32px)",
          fontFamily: "'Montserrat', sans-serif",
          background: "transparent",
        }}
      >
        {/* Subtle background accent */}
        <div
          style={{
            position: "fixed",
            top: "10%",
            right: "5%",
            width: "min(400px, 80vw)",
            height: "min(400px, 80vw)",
            background: "radial-gradient(circle, rgba(15, 98, 254, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "min(100%, 960px)", margin: "0 auto", boxSizing: "border-box" }}>
          {/* Hero: icon + title + tagline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
                boxShadow: "0 8px 24px rgba(15, 98, 254, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Image
                src="/leftmenudailychallenge.png"
                alt=""
                width={44}
                height={44}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "clamp(28px, 4vw, 38px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                }}
              >
                Reto diario
              </h1>
              <p
                style={{
                  fontSize: "clamp(15px, 1rem, 17px)",
                  color: "#64748b",
                  lineHeight: 1.5,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Un pequeño desafío cada día para reforzar tus finanzas personales.
              </p>
            </div>
          </div>

          {/* Challenge card */}
          <div
            style={{
              background: "linear-gradient(165deg, rgba(248, 251, 255, 0.98) 0%, #ffffff 50%)",
              border: "2px solid rgba(15, 98, 254, 0.18)",
              borderRadius: 24,
              padding: "clamp(28px, 4vw, 40px)",
              marginBottom: 28,
              boxShadow: "0 8px 32px rgba(15, 98, 254, 0.1), 0 2px 8px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#0F62FE",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {dayName}, {dateStr}
              </span>
              <span
                style={{
                  padding: "6px 12px",
                  background: "rgba(15, 98, 254, 0.12)",
                  color: "#0F62FE",
                  borderRadius: 9999,
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                ~5 min
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(22px, 2.5vw, 26px)",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 14px",
                letterSpacing: "-0.02em",
              }}
            >
              Reto de hoy
            </h2>
            <p
              style={{
                fontSize: "clamp(16px, 1.05rem, 18px)",
                color: "#334155",
                lineHeight: 1.65,
                margin: "0 0 28px",
              }}
            >
              Dedica 5 minutos a revisar tus gastos de la última semana. Anota en qué categoría gastaste más y una idea para ahorrar en esa categoría el próximo mes.
            </p>
            <Link
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                background: "linear-gradient(135deg, #0F62FE 0%, #2563EB 100%)",
                color: "#fff",
                borderRadius: 14,
                fontSize: "16px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 6px 20px rgba(15, 98, 254, 0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(15, 98, 254, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(15, 98, 254, 0.35)"
              }}
            >
              Ir a cursos para practicar
              <span style={{ fontSize: "18px" }} aria-hidden>→</span>
            </Link>
          </div>

          {/* Tip card */}
          <div
            style={{
              display: "flex",
              gap: 16,
              padding: "20px 24px",
              background: "linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(255, 251, 235, 0.8) 100%)",
              border: "2px solid rgba(251, 191, 36, 0.25)",
              borderRadius: 20,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(251, 191, 36, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "22px",
              }}
              aria-hidden
            >
              💡
            </span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#92400E", marginBottom: 4 }}>Consejo</div>
              <p style={{ fontSize: "15px", color: "#78350F", lineHeight: 1.6, margin: 0 }}>
                Completa el reto y anótalo en tu presupuesto o en una nota. La constancia en pequeños pasos mejora tus hábitos financieros.
              </p>
            </div>
          </div>

          {/* Why it matters - short benefits */}
          <div
            style={{
              padding: "24px 24px",
              background: "rgba(241, 245, 249, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 20,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Por qué el reto diario
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: "15px", lineHeight: 1.8 }}>
              <li>Refuerza conceptos con práctica breve y constante.</li>
              <li>Genera el hábito de revisar tus finanzas con frecuencia.</li>
              <li>Pequeños pasos evitan la procrastinación.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
