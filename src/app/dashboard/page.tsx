"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }
    
    // Dashboard functionality is now in the hamburger menu
    // Redirect to courses as the main learning area
    router.replace("/courses")
  }, [user, loading, router])

  return (
    <div style={{ 
      display: "grid", 
      placeItems: "center", 
      minHeight: "60vh", 
      fontFamily: "Montserrat, sans-serif" 
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#666", fontSize: 16 }}>Redirigiendo...</p>
      </div>
    </div>
  )
}
