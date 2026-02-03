"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.open(redirectTo, "_blank")
    }
  }, [user, loading, redirectTo])

  if (loading) {
    return (
      <div style={{
        display: "flex" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        minHeight: "100vh",
        background: "#f8fafc"
      }}>
        <div style={{
          textAlign: "center",
          padding: "2rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <p style={{ margin: 0, color: "#6b7280" }}>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return <>{children}</>
}
