"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BizenDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to new dashboard
    router.replace("/dashboard")
  }, [router])

  return (
    <div style={{ 
      display: "grid", 
      placeItems: "center", 
      minHeight: "100vh",
      fontFamily: "Montserrat, sans-serif" 
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#666", fontSize: 16 }}>Redirigiendo...</p>
      </div>
    </div>
  )
}
