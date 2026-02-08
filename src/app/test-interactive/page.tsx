"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TestInteractivePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the interactive lesson
    router.push('/learn/course-1/unit-1/l1-1/interactive')
  }, [router])

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "Montserrat, sans-serif",
      background: "#ffffff",
      padding: 40
    }}>
      <div style={{
        background: "#fff",
        padding: 48,
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
        maxWidth: 600,
        textAlign: "center"
      }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
        
        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 16
        }}>
          Redirecting to Interactive Lesson...
        </h1>
        
        <p style={{
          fontSize: 16,
          color: "#6B7280",
          marginBottom: 32
        }}>
          Taking you to "Historia del Dinero" interactive experience
        </p>

        <p style={{ color: "#666", fontSize: 16 }}>Cargando...</p>

        <div style={{
          marginTop: 32,
          padding: 16,
          background: "#F9FAFB",
          borderRadius: 12,
          fontSize: 14,
          color: "#374151"
        }}>
          <strong>Or go directly to:</strong><br />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <a
              href="/courses"
              style={{
                padding: "10px 16px",
                background: "#fff",
                border: "2px solid #0F62FE",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 13,
                color: "#0F62FE",
                textAlign: "center"
              }}
            >
              📚 Courses Page (Click first lesson)
            </a>
            <a
              href="/learn/course-1/unit-1/l1-1/interactive"
              style={{
                padding: "10px 16px",
                background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 13,
                textAlign: "center"
              }}
            >
              ✨ Direct to Interactive Lesson
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

