import React from "react"
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import Link from "next/link"

export const metadata = {
  title: "Simuladores | Business Lab",
  description: "Calculadoras financieras para tu startup"
}

export default async function SimulatorsPage() {
  const supabase = await createSupabaseServer()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/login")
  }

  const simulators = [
    {
      id: "cashflow",
      title: "Proyección de Cashflow",
      description: "Calcula tu runway, burn rate y proyección de efectivo mensual",
      icon: "💰",
      color: "#0B71FE"
    },
    {
      id: "breakeven",
      title: "Punto de Equilibrio",
      description: "Determina cuántas unidades necesitas vender para ser rentable",
      icon: "📈",
      color: "#10B981"
    },
    {
      id: "pricing",
      title: "Estrategia de Precios",
      description: "Crea planes Good-Better-Best con márgenes calculados",
      icon: "🧮",
      color: "#8B5CF6"
    },
    {
      id: "funnel",
      title: "Embudo de Conversión",
      description: "Analiza tus métricas de adquisición y CAC/LTV",
      icon: "📊",
      color: "#F59E0B"
    }
  ]

  return (
    <main style={{
      marginRight: "320px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      padding: "40px",
      paddingRight: "360px",
      fontFamily: "Montserrat, sans-serif",
      width: "100%",
      boxSizing: "border-box" as const,
      overflowX: "hidden"
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
          🧮 Simuladores Financieros
        </h1>
        <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>
          Herramientas para modelar y validar los números de tu startup
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 20,
        marginBottom: 32,
        width: "100%"
      }}>
        {simulators.map((simulator) => (
          <div key={simulator.id} style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "2px solid #E5E7EB",
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(11,113,254,0.2)"
            e.currentTarget.style.borderColor = simulator.color
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
            e.currentTarget.style.borderColor = "#E5E7EB"
          }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `${simulator.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 16
            }}>
              {simulator.icon}
            </div>
            
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 8 }}>
              {simulator.title}
            </h3>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 20 }}>
              {simulator.description}
            </p>
            
            <Link href={`/business-lab/simulators/${simulator.id}`}>
              <button style={{
                width: "100%",
                padding: "12px 20px",
                background: simulator.color,
                border: "none",
                color: "white",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "opacity 0.2s ease"
              }}
              onMouseEnter={(e: any) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e: any) => e.currentTarget.style.opacity = "1"}
              >
                Abrir Simulador
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Tip Card */}
      <div style={{
        background: "#DBEAFE",
        borderRadius: 16,
        padding: 20,
        border: "2px solid #BFDBFE",
        width: "100%"
      }}>
        <div style={{ display: "flex", alignItems: "start", gap: 12 }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E40AF", marginBottom: 6 }}>
              Tip
            </h3>
            <p style={{ fontSize: 14, color: "#1E3A8A", lineHeight: 1.6 }}>
              Todos tus cálculos se guardan automáticamente. Puedes volver a revisar
              escenarios anteriores en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
