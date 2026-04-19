"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

import PageLoader from "@/components/PageLoader"

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
    return <PageLoader />
  }

  if (!user) {
    return null // Will redirect
  }

  return <>{children}</>
}
