"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

import PageLoader from "@/components/PageLoader"

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

  return <PageLoader />
}
