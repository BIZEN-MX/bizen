"use client"

import React from "react"

export type UserInfo = {
  email: string
  fullName: string
  institution: string
}

type ExamIntroProps = {
  userInfo: UserInfo
  onChange: (info: UserInfo) => void
  error?: string
}

export function ExamIntro({ userInfo, onChange, error }: ExamIntroProps) {
  const handleChange = (field: keyof UserInfo, value: string) => {
    onChange({ ...userInfo, [field]: value })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "4rem",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 2rem",
        flexWrap: "wrap",
        boxSizing: "border-box"
      }}
    >
      {/* Left Column: Text */}
      <div style={{ flex: "1 1 450px", textAlign: "center" }}>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#6366f1",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "block",
            marginBottom: "1rem"
          }}
        >
          ¡Bienvenido a BIZEN!
        </span>
        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 42px)",
            fontWeight: 900,
            color: "#1e293b",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            letterSpacing: "-0.02em"
          }}
        >
          Examen <br />
          <span style={{ color: "#2563eb" }}>Diagnóstico</span>
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#64748b",
            lineHeight: 1.5,
            maxWidth: "500px",
            margin: "0 auto"
          }}
        >
          Antes de comenzar tu aventura, necesitamos conocerte un poco mejor. Completa tu información para personalizar tu experiencia de aprendizaje.
        </p>
      </div>

      {/* Right Column: Form */}
      <div
        style={{
          flex: "1 1 400px",
          background: "#fff",
          padding: "3rem",
          borderRadius: "40px",
          border: "2px solid #e2e8f0",
          boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.08)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            <label
              htmlFor="fullName"
              style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569" }}
            >
              Nombre Completo
            </label>
            <input
              id="fullName"
              type="text"
              value={userInfo.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Juan Pérez"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                fontFamily: "inherit",
                textAlign: "center"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569" }}
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="juan@ejemplo.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                fontFamily: "inherit",
                textAlign: "center"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            <label
              htmlFor="institution"
              style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569" }}
            >
              Institución / Empresa
            </label>
            <input
              id="institution"
              type="text"
              value={userInfo.institution}
              onChange={(e) => handleChange("institution", e.target.value)}
              placeholder="Ej. Universidad Anáhuac"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                fontFamily: "inherit",
                textAlign: "center"
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "15px", fontWeight: 600, margin: 0 }}>
              {error}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        input::placeholder {
          color: #94a3b8;
        }
        input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        @media (max-width: 900px) {
          div[style*="flex: 1 1 450px"] {
             text-align: center !important;
             flex: 1 1 100% !important;
          }
           div[style*="flex: 1 1 400px"] {
             flex: 1 1 100% !important;
             padding: 2rem !important;
          }
          p {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  )
}
