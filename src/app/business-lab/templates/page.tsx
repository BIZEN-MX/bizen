import React from "react"
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getTemplates } from "@/lib/lab/db"
import Link from "next/link"

export const metadata = {
  title: "Templates | Business Lab",
  description: "Plantillas reutilizables para tu startup"
}

export default async function TemplatesPage() {
  const supabase = await createSupabaseServer()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/login")
  }

  const templates = await getTemplates()
  
  // Group by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const category = template.category || "other"
    if (!acc[category]) acc[category] = []
    acc[category].push(template)
    return acc
  }, {} as Record<string, typeof templates>)

  const categoryNames: Record<string, string> = {
    canvas: "Canvas",
    pitch: "Pitch",
    financial: "Financiero",
    research: "Investigación",
    planning: "Planificación",
    other: "Otros"
  }

  return (
    <>
      <style>{`
        /* Mobile - account for footer */
        @media (max-width: 767px) {
          .templates-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .templates-main {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        /* Tablet/iPad - no gap, sidebar overlays */
        @media (min-width: 768px) and (max-width: 1024px) {
          .templates-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .templates-main {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        /* Desktop - no gap, sidebar overlays */
        @media (min-width: 1025px) {
          .templates-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .templates-main {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
      `}</style>
      <div className="templates-outer" style={{
        width: "100%",
      flex: 1,
      background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        fontFamily: "Montserrat, sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        <main className="templates-main" style={{
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
          📄 Templates
        </h1>
        <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>
          Plantillas probadas para acelerar el desarrollo de tu startup
        </p>
      </div>

      {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
        <div key={category} style={{ marginBottom: 40, width: "100%" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: "#111" }}>
            {categoryNames[category] || category}
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20
          }}>
            {categoryTemplates.map((template) => (
              <div key={template.id} style={{
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
                e.currentTarget.style.borderColor = "#0B71FE"
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
                e.currentTarget.style.borderColor = "#E5E7EB"
              }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>
                      {template.icon || "📋"}
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                      {template.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>
                      {template.description}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 11,
                    padding: "4px 8px",
                    background: "#F3F4F6",
                    color: "#6B7280",
                    borderRadius: 6,
                    fontWeight: 600
                  }}>
                    {template.code}
                  </span>
                </div>
                
                {template.sample && (
                  <p style={{ 
                    fontSize: 13, 
                    color: "#9CA3AF", 
                    fontStyle: "italic", 
                    marginBottom: 16,
                    paddingLeft: 12,
                    borderLeft: "3px solid #E5E7EB"
                  }}>
                    "{template.sample}"
                  </p>
                )}
                
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: "white",
                    border: "1px solid #E5E7EB",
                    color: "#374151",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}>
                    Ver Ejemplo
                  </button>
                  <button style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: "#0B71FE",
                    border: "none",
                    color: "white",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}>
                    Usar Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

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
              Los templates son personalizables. Úsalos como punto de partida y adáptalos a tu negocio específico.
            </p>
          </div>
        </div>
      </div>
    </main>
      </div>
    </>
  )
}
