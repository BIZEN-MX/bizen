import React from "react"
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import Link from "next/link"

export const metadata = {
  title: "Pitch Coach | Business Lab",
  description: "Mejora tu pitch con AI"
}

export default async function PitchPage() {
  const supabase = await createSupabaseServer()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/login")
  }

  return (
    <>
      <style>{`
        /* Mobile - account for footer */
        @media (max-width: 767px) {
          .pitch-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .pitch-main {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        /* Tablet/iPad - no gap, sidebar overlays */
        @media (min-width: 768px) and (max-width: 1024px) {
          .pitch-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .pitch-main {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        /* Desktop - no gap, sidebar overlays */
        @media (min-width: 1025px) {
          .pitch-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .pitch-main {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
      `}</style>
      <div className="pitch-outer" style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        fontFamily: "Montserrat, sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        <main className="pitch-main" style={{
          margin: "0 auto",
          minHeight: "100vh",
          fontFamily: "Montserrat, sans-serif",
          width: "100%",
          boxSizing: "border-box" as const,
          overflowX: "hidden",
          overflowY: "visible"
        }}>
      <Link href="/business-lab" style={{ textDecoration: "none" }}>
        <button style={{
          padding: "8px 16px",
          background: "white",
          border: "2px solid #E5E7EB",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
          cursor: "pointer",
          marginBottom: 24,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e: any) => e.currentTarget.style.borderColor = "#0B71FE"}
        onMouseLeave={(e: any) => e.currentTarget.style.borderColor = "#E5E7EB"}
        >
          ← Volver al Lab
        </button>
      </Link>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 900,
          background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 12
        }}>
          🎤 Pitch Coach
        </h1>
        <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>
          Mejora tu pitch con feedback de inteligencia artificial
        </p>
      </div>

      {/* Coming Soon */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: 60,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "2px solid #E5E7EB",
        textAlign: "center" as const,
        width: "100%"
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🚧</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#111" }}>
          Próximamente
        </h2>
        <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
          Estamos desarrollando esta herramienta. Podrás practicar tu pitch y recibir
          feedback instantáneo de AI.
        </p>
        <Link href="/business-lab">
          <button style={{
            padding: "12px 24px",
            background: "#0B71FE",
            border: "none",
            color: "white",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer"
          }}>
            Explorar otras herramientas
          </button>
        </Link>
      </div>
        </main>
      </div>
    </>
  )
}
