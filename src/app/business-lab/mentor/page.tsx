import React from "react"
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getActiveMentors } from "@/lib/lab/db"
import Link from "next/link"

export const metadata = {
  title: "Mentores | Business Lab",
  description: "Conecta con mentores expertos"
}

export default async function MentorPage() {
  const supabase = await createSupabaseServer()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/login")
  }

  const mentors = await getActiveMentors()

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
          👨‍🏫 Mentores
        </h1>
        <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>
          Conecta con emprendedores experimentados que pueden guiarte
        </p>
      </div>

      {mentors && mentors.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          width: "100%"
        }}>
          {mentors.map((mentor: any) => (
            <div key={mentor.id} style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #E5E7EB",
              transition: "all 0.2s ease"
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
              <div style={{ fontSize: 48, marginBottom: 16, textAlign: "center" as const }}>
                👤
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 8, textAlign: "center" as const }}>
                {mentor.profiles?.nickname || "Mentor"}
              </h3>
              {mentor.bio && (
                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 16, lineHeight: 1.5 }}>
                  {mentor.bio}
                </p>
              )}
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {mentor.expertise.map((exp: string, i: number) => (
                    <span key={i} style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      background: "#E0F2FE",
                      color: "#0B71FE",
                      borderRadius: 6,
                      fontWeight: 600
                    }}>
                      {exp}
                    </span>
                  ))}
                </div>
              )}
              <button style={{
                width: "100%",
                padding: "12px 20px",
                background: "#0B71FE",
                border: "none",
                color: "white",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer"
              }}>
                Contactar
              </button>
            </div>
          ))}
        </div>
      ) : (
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
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 500, margin: "0 auto" }}>
            El marketplace de mentores estará disponible pronto. Podrás conectar con
            emprendedores experimentados para recibir guía personalizada.
          </p>
        </div>
      )}
    </main>
  )
}
