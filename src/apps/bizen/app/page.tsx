"use client"

import { useEffect, useState } from "react"

export default function BizenPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #ffffff 0%, #f0f7ff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
            padding: 40,
    }}>
      <div style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s ease",
        textAlign: "center",
        maxWidth: 600,
      }}>
        <h1 style={{
          fontSize: "clamp(48px, 10vw, 96px)",
          fontWeight: 500,
          margin: "0 0 24px 0",
          background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          BIZEN
        </h1>
        <p style={{
          fontSize: "clamp(18px, 2.2vw, 24px)",
          color: "#4A5568",
          margin: "0 0 12px 0",
        }}>
          Welcome to BIZEN
        </p>
        <p style={{
          fontSize: "clamp(16px, 2vw, 18px)",
          color: "#718096",
        }}>
          Content coming soon
        </p>
      </div>
    </div>
  )
}

