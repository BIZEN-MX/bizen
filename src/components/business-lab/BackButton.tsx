"use client"

import Link from "next/link"

export default function BackButton() {
  return (
    <Link href="/business-lab" style={{ textDecoration: "none" }}>
      <button 
        style={{
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
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0B71FE"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E7EB"}
      >
        ← Volver al Lab
      </button>
    </Link>
  )
}

