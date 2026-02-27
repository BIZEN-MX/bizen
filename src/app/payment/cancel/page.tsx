"use client"

import Link from "next/link"
import Image from "next/image"

export default function PaymentCancelPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(to bottom, #ffffff 0%, #f0f7ff 100%)",
      backgroundAttachment: "fixed",
    }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#FBFAF5",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "16px 0",
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 32px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}>
            <Image
              src="/bizen-logo.png"
              alt="BIZEN Logo"
              width={40}
              height={40}
              style={{ borderRadius: 8 }}
            />
            <span style={{
              fontSize: 24,
              fontWeight: 900,
              background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              BIZEN
            </span>
          </Link>
        </div>
      </header>

      {/* Cancel Content */}
      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(48px, 8vw, 96px) clamp(16px, 4vw, 32px)",
      }}>
        <div style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.3)",
          }}>
            <span style={{ fontSize: 64, color: "white" }}>⚠</span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            margin: "0 0 16px 0",
            background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "'Inter', 'Poppins', 'Open Sans', system-ui, -apple-system, sans-serif",
          }}>
            Pago cancelado
          </h1>

          <p style={{
            fontSize: "clamp(18px, 2.5vw, 20px)",
            color: "#64748b",
            margin: "0 0 32px 0",
            lineHeight: 1.6,
            fontFamily: "'Inter', 'Poppins', 'Open Sans', system-ui, -apple-system, sans-serif",
          }}>
            No se procesó ningún cargo. Puedes intentar nuevamente cuando estés listo.
          </p>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}>
            <Link
              href="/payment"
              style={{
                padding: "14px 32px",
                fontSize: 16,
                fontWeight: 700,
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%)",
                color: "white",
                border: "none",
                borderRadius: 12,
                textDecoration: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(15, 98, 254, 0.35)",
                display: "inline-block",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(15, 98, 254, 0.45)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.35)"
              }}
            >
              Intentar de nuevo
            </Link>

            <Link
              href="/"
              style={{
                color: "#0F62FE",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

