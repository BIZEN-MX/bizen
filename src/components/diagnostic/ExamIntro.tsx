"use client"

import React, { useEffect, useState } from "react"

export type UserInfo = {
  email: string
  fullName: string
  institution: string
}

type ExamIntroProps = {
  userInfo: UserInfo
  onChange: (info: UserInfo) => void
  error?: string
  onSubmit?: () => void
  isLoading?: boolean
}

interface School {
  id: string
  name: string
}

export function ExamIntro({ userInfo, onChange, error, onSubmit, isLoading }: ExamIntroProps) {
  const [schools, setSchools] = useState<School[]>([])

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools')
        if (response.ok) {
          const data = await response.json()
          setSchools(data || [])
        }
      } catch (err) {
        console.error("Error fetching schools:", err)
      }
    }
    fetchSchools()
  }, [])

  const handleChange = (field: keyof UserInfo, value: string) => {
    onChange({ ...userInfo, [field]: value })
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1.5px solid rgba(255, 255, 255, 0.15)",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    boxSizing: "border-box",
    color: "#ffffff",
    background: "rgba(255, 255, 255, 0.04)",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "clamp(11px, 3vw, 13px)",
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  }

  return (
    <div className="exam-intro-container" style={{
      width: "100%",
      maxWidth: 520,
      margin: "0 auto",
      padding: "clamp(12px, 3vh, 32px) 0",
      fontFamily: "var(--font-geist, system-ui, sans-serif)",
    }}>
      <style>{`
        .exam-intro-card {
          padding: 36px;
        }
        @media (max-width: 480px) {
          .exam-intro-card {
            padding: 24px 16px;
            border-radius: 20px;
            gap: 20px !important;
          }
          .exam-intro-container h1 {
            font-size: 24px !important;
          }
          .exam-intro-container p {
            font-size: 13px !important;
            padding: 0 10px;
          }
        }
        @media (max-width: 360px) {
           .exam-intro-card {
             padding: 20px 12px;
           }
        }
        
        /* Premium custom select dropdown styling */
        #schools-list option {
           background: #0f172a;
           color: #fff;
        }
      `}</style>

      {/* Decorative background orbs */}
      <div style={{ position: "absolute", top: "10%", right: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 250, height: 250, background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(24px, 5vh, 40px)", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "clamp(52px, 12vw, 64px)",
          height: "clamp(52px, 12vw, 64px)",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(15, 98, 254, 0.15) 0%, rgba(74, 158, 255, 0.15) 100%)",
          marginBottom: "clamp(16px, 3vh, 24px)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 0 30px rgba(15, 98, 254, 0.2)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h1 style={{
          fontSize: "clamp(22px, 6vw, 32px)",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.15,
          margin: "0 0 10px 0",
          letterSpacing: "-0.02em",
        }}>
          Examen <span style={{ color: "#60a5fa" }}>Diagnóstico</span>
        </h1>
        <p style={{
          fontSize: "clamp(14px, 3vw, 16px)",
          color: "#94a3b8",
          lineHeight: 1.5,
          margin: 0,
          fontWeight: 500,
        }}>
          Comenzaremos perfilando tus conocimientos. Solo toma 2 minutos.
        </p>
      </div>

      <div className="exam-intro-card" style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(20px)",
        borderRadius: "28px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Name field */}
        <div>
          <label htmlFor="fullName" style={labelStyle}>Nombre Completo</label>
          <input
            id="fullName"
            type="text"
            value={userInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Juan Pérez"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6"
              e.currentTarget.style.background = "rgba(15, 98, 254, 0.05)"
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.15)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
              e.currentTarget.style.boxShadow = "none"
            }}
          />
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" style={labelStyle}>Correo Electrónico</label>
          <input
            id="email"
            type="email"
            value={userInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="tu@universidad.edu"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6"
              e.currentTarget.style.background = "rgba(15, 98, 254, 0.05)"
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.15)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
              e.currentTarget.style.boxShadow = "none"
            }}
          />
        </div>

        {/* Institution field */}
        <div>
          <label htmlFor="institution" style={labelStyle}>Institución / Empresa</label>
          <input
            id="institution"
            type="text"
            list="schools-list"
            value={userInfo.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            placeholder="Selecciona o escribe..."
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6"
              e.currentTarget.style.background = "rgba(15, 98, 254, 0.05)"
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.15)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
              e.currentTarget.style.boxShadow = "none"
            }}
          />
          <datalist id="schools-list">
            {schools.map((school) => (
              <option key={school.id} value={school.name} />
            ))}
            {!schools.some(s => s.name?.toLowerCase().includes("mondragón")) && (
              <option value="Universidad Mondragón México" />
            )}
            {!schools.some(s => s.name?.toLowerCase().includes("balmoral")) && (
              <option value="Balmoral Escocés Preparatoria" />
            )}
            <option value="UNAM" />
            <option value="Tec de Monterrey (ITESM)" />
            <option value="Universidad Anáhuac" />
            <option value="IPN" />
            <option value="Universidad Iberoamericana" />
            <option value="UVM" />
            <option value="Tecmilenio" />
            <option value="Particular / Independiente" />
          </datalist>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 18px",
            background: "rgba(220, 38, 38, 0.1)",
            borderRadius: "16px",
            border: "1px solid rgba(220, 38, 38, 0.3)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ color: "#fca5a5", fontSize: "14px", fontWeight: 500, margin: 0, }}>
              {error}
            </p>
          </div>
        )}

        {/* Submit Button - BIZEN Lesson 3D style */}
        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "18px",
              background: isLoading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: isLoading ? "#94a3b8" : "#ffffff",
              fontSize: "17px",
              fontWeight: 700,
              border: isLoading ? "1px solid rgba(255,255,255,0.1)" : "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              letterSpacing: "0.02em",
              boxShadow: isLoading ? "none" : "0 4px 0 0 #1e3a8a, 0 10px 20px rgba(37,99,235,0.3)",
              marginTop: "8px",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 0 0 #1e3a8a, 0 15px 25px rgba(37,99,235,0.4)"
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = isLoading ? "none" : "0 4px 0 0 #1e3a8a, 0 10px 20px rgba(37,99,235,0.3)"
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(4px)"
                e.currentTarget.style.boxShadow = "0 0px 0 0 #1e3a8a, 0 0px 0px rgba(37,99,235,0)"
              }
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = isLoading ? "none" : "0 4px 0 0 #1e3a8a, 0 10px 20px rgba(37,99,235,0.3)"
            }}
          >
            {isLoading ? "Verificando..." : "Empezar examen →"}
          </button>
        )}
      </div>
    </div>
  )
}
