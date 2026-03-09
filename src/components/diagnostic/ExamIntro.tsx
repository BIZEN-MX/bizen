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
    border: "2px solid #E5E7EB",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
        color: "#111827",
    background: "#FFFFFF",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#6B7280",
    marginBottom: "8px",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
      }

  return (
    <div style={{
      width: "100%",
      maxWidth: 520,
      margin: "0 auto",
      padding: "20px 0",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(15, 98, 254, 0.1) 0%, rgba(74, 158, 255, 0.1) 100%)",
          marginBottom: "24px",
          border: "2px solid rgba(15, 98, 254, 0.05)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h1 style={{
          fontSize: "clamp(26px, 5vw, 32px)",
          fontWeight: 500,
          color: "#111827",
          lineHeight: 1.15,
          margin: "0 0 12px 0",
          letterSpacing: "-0.03em",
                  }}>
          Examen <span style={{ color: "#0F62FE" }}>Diagnóstico</span>
        </h1>
        <p style={{
          fontSize: "16px",
          color: "#6B7280",
          lineHeight: 1.6,
          margin: 0,
                    fontWeight: 500,
        }}>
          Completa tu información para comenzar. Solo toma 2 minutos.
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        background: "#FFFFFF",
        borderRadius: "28px",
        border: "2px solid #E5E7EB",
        padding: "36px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
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
              e.currentTarget.style.borderColor = "#0F62FE"
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(15,98,254,0.1)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB"
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
              e.currentTarget.style.borderColor = "#0F62FE"
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(15,98,254,0.1)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB"
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
              e.currentTarget.style.borderColor = "#0F62FE"
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(15,98,254,0.1)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB"
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
            background: "#FEF2F2",
            borderRadius: "16px",
            border: "1.5px solid #FCA5A5",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ color: "#DC2626", fontSize: "14px", fontWeight: 500, margin: 0, }}>
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
              background: isLoading ? "#94A3B8" : "#0F62FE",
              color: "#FFFFFF",
              fontSize: "17px",
              fontWeight: 500,
                            border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              letterSpacing: "0.01em",
              boxShadow: isLoading ? "none" : "0 4px 0 0 #0947BB",
              marginTop: "8px",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 5px 0 0 #0947BB"
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = isLoading ? "none" : "0 4px 0 0 #0947BB"
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(3px)"
                e.currentTarget.style.boxShadow = "0 1px 0 0 #0947BB"
              }
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = isLoading ? "none" : "0 4px 0 0 #0947BB"
            }}
          >
            {isLoading ? "Verificando..." : "Empezar examen →"}
          </button>
        )}
      </div>
    </div>
  )
}
