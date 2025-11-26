import React from "react"
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getUserScore } from "@/lib/lab/db"
import Link from "next/link"

export const metadata = {
  title: "Investment Score | Business Lab",
  description: "Evalúa tu preparación para inversión"
}

export default async function ScorePage() {
  const supabase = await createSupabaseServer()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/login")
  }

  const score = await getUserScore(user.id)

  return (
    <>
      <style>{`
        /* Mobile - account for footer */
        @media (max-width: 767px) {
          .score-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .score-main {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        /* Tablet/iPad - no gap, sidebar overlays */
        /* Tablet/iPad (768px-1160px) - no gap, sidebar overlays (narrow 160px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .score-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .score-main {
            width: calc(100% - 160px) !important;
            max-width: calc(100% - 160px) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        /* Desktop (1161px+) - no gap, sidebar overlays (full width 280px) */
        @media (min-width: 1161px) {
          .score-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .score-main {
            width: calc(100% - 280px) !important;
            max-width: calc(100% - 280px) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
      `}</style>
      <div className="score-outer" style={{
        width: "100%",
      flex: 1,
      background: "#ffffff",
        fontFamily: "Montserrat, sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        <main className="score-main" style={{
          margin: "0 auto",
          flex: 1,
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
          📈 Investment Readiness Score
        </h1>
        <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>
          Evalúa qué tan preparado estás para buscar inversión
        </p>
      </div>

      {/* Score Display */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: 40,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "2px solid #E5E7EB",
        textAlign: "center" as const,
        marginBottom: 32,
        width: "100%"
      }}>
        <div style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 8px 32px rgba(11,113,254,0.3)"
        }}>
          <div style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white"
          }}>
            {score?.readinessScore || 0}
          </div>
        </div>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#111" }}>
          Tu Score Actual
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280" }}>
          Completa más pasos para mejorar tu puntuación
        </p>
      </div>

      {/* Score Breakdown */}
      {score?.breakdown && (
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "2px solid #E5E7EB",
          marginBottom: 32,
          width: "100%"
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#111" }}>
            Desglose por Área
          </h3>
          {/* Add breakdown visualization here */}
          <p style={{ fontSize: 14, color: "#6B7280" }}>
            Próximamente: visualización detallada de tu score
          </p>
        </div>
      )}

      {/* Action Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 24,
        border: "2px solid #e5e7eb",
        width: "100%"
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E40AF", marginBottom: 12 }}>
          ¿Cómo mejorar tu score?
        </h3>
        <ul style={{ 
          marginLeft: 20, 
          color: "#1E3A8A", 
          fontSize: 14,
          lineHeight: 2
        }}>
          <li>Completa todos los pasos de las rutas principales</li>
          <li>Crea artefactos de calidad (canvas, pitch deck, etc.)</li>
          <li>Valida tu idea con clientes reales</li>
          <li>Usa los simuladores para proyecciones financieras</li>
        </ul>
      </div>
    </main>
      </div>
    </>
  )
}
