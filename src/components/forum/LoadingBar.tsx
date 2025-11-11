"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setLoading(true)
    setProgress(20)

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(60), 100)
    const timer2 = setTimeout(() => setProgress(90), 300)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setLoading(false), 200)
    }, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      zIndex: 9999,
      background: "rgba(255, 255, 255, 0.2)"
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #0B71FE 0%, #10B981 100%)",
        transition: "width 0.3s ease",
        boxShadow: "0 0 10px rgba(11, 113, 254, 0.5)"
      }} />
    </div>
  )
}

