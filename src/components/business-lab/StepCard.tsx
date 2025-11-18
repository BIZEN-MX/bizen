"use client"

import Link from "next/link"

interface StepCardProps {
  step: {
    id: string
    title: string
    description?: string | null
    order: number
    required?: boolean
  }
  isCompleted: boolean
}

export default function StepCard({ step, isCompleted }: StepCardProps) {
  return (
    <Link href={`/business-lab/step/${step.id}`} style={{ textDecoration: "none" }}>
      <div 
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: isCompleted ? "2px solid #6EE7B7" : "2px solid #E5E7EB",
          transition: "all 0.2s ease",
          cursor: "pointer",
          position: "relative" as const,
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(11,113,254,0.15)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"
        }}
      >
        {isCompleted && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#10B981"
          }} />
        )}
        
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: isCompleted ? "#D1FAE5" : "#E0F2FE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: isCompleted ? "#10B981" : "#0B71FE",
            flexShrink: 0
          }}>
            {isCompleted ? "✓" : step.order}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>
                {step.title}
              </h3>
              {step.required && (
                <span style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  background: "#FEE2E2",
                  color: "#991B1B",
                  borderRadius: 4,
                  fontWeight: 600
                }}>
                  REQUERIDO
                </span>
              )}
            </div>
            {step.description && (
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>
                {step.description}
              </p>
            )}
          </div>
          
          <span style={{ fontSize: 24 }}>→</span>
        </div>
      </div>
    </Link>
  )
}

