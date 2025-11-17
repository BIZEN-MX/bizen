"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

type Track = {
  id: string
  key: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
  order: number
  completedSteps: number
  totalSteps: number
  steps: any[]
}

type NextStep = {
  id: string
  title: string
  description: string | null
  goal: string | null
  trackKey: string
  trackTitle: string
}

export default function LabPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [tracks, setTracks] = useState<Track[]>([])
  const [nextStep, setNextStep] = useState<NextStep | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      fetchData()
    }
  }, [user, loading, router])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/lab/tracks")
      if (!response.ok) throw new Error("Failed to fetch tracks")
      const data = await response.json()
      setTracks(data.data || [])
      
      // Find next recommended step
      const allSteps = data.data.flatMap((track: Track) => 
        track.steps.map((step: any) => ({ 
          ...step, 
          trackKey: track.key, 
          trackTitle: track.title 
        }))
      )
      const nextIncomplete = allSteps.find((step: any) => !step.progress?.is_completed)
      setNextStep(nextIncomplete || null)
    } catch (error) {
      console.error("Error fetching lab data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #0F62FE22",
            borderTop: "4px solid #0F62FE",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#666", fontSize: 16, fontFamily: "Montserrat, sans-serif" }}>
            Cargando Business Lab...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Calculate progress stats
  const totalSteps = tracks.reduce((sum, track) => sum + (track.totalSteps || 0), 0)
  const completedSteps = tracks.reduce((sum, track) => sum + (track.completedSteps || 0), 0)
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <main style={{
      width: "calc(100% - 320px)",
      maxWidth: "none",
      margin: 0,
      paddingTop: "40px",
      paddingBottom: "40px",
      paddingLeft: "clamp(20px, 4vw, 40px)",
      paddingRight: "clamp(20px, 4vw, 40px)",
      overflowX: "hidden",
      overflowY: "visible",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      fontFamily: "Montserrat, sans-serif",
      boxSizing: "border-box" as const
    }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 42,
            fontWeight: 900,
            background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 12
          }}>
            🚀 Business Lab
          </h1>
          <p style={{ fontSize: 18, color: "#374151", fontWeight: 500 }}>
            Construye tu startup desde la idea hasta el lanzamiento con herramientas y guías paso a paso.
          </p>
        </div>

        {/* Overall Progress Card */}
        <div style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
          marginBottom: 24,
          border: "1px solid rgba(255, 255, 255, 0.4)",
          width: "100%",
          boxSizing: "border-box" as const,
          color: "#1E40AF"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>🎯</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E40AF" }}>
              Tu Progreso General
            </h2>
          </div>
          <p style={{ color: "#374151", marginBottom: 16, fontSize: 14, fontWeight: 500 }}>
            Has completado {completedSteps} de {totalSteps} pasos en el programa
          </p>
          <div style={{
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: 12,
            height: 24,
            overflow: "hidden",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(90deg, #0B71FE, #4A9EFF)",
              height: "100%",
              width: `${progressPercentage}%`,
              transition: "width 0.5s ease",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(11, 113, 254, 0.3)"
            }} />
            <span style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 12,
              fontWeight: 700,
              color: "#1E40AF"
            }}>
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Next Step Card */}
        {nextStep && (
          <div style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
            marginBottom: 24,
            border: "1px solid rgba(255, 255, 255, 0.4)",
            width: "100%",
            boxSizing: "border-box" as const,
            color: "#1E40AF"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>💡</span>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E40AF" }}>
                Siguiente Paso Recomendado
              </h2>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#1E40AF" }}>
              {nextStep.title}
            </h3>
            <p style={{ color: "#374151", marginBottom: 12, fontSize: 14, fontWeight: 500 }}>
              {nextStep.description}
            </p>
            {nextStep.goal && (
              <p style={{ fontSize: 14, color: "#4B5563", marginBottom: 16, fontWeight: 600 }}>
                🎯 {nextStep.goal}
              </p>
            )}
            <Link href={`/business-lab/step/${nextStep.id}`}>
              <button style={{
                padding: "12px 24px",
                background: "rgba(11, 113, 254, 0.2)",
                color: "#0B71FE",
                border: "1px solid rgba(11, 113, 254, 0.4)",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.2)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(11, 113, 254, 0.3)"
                e.currentTarget.style.background = "rgba(11, 113, 254, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(11, 113, 254, 0.2)"
                e.currentTarget.style.background = "rgba(11, 113, 254, 0.2)"
              }}
              >
                Comenzar
                <span>→</span>
              </button>
            </Link>
          </div>
        )}

        {/* Quick Links */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          marginBottom: 32,
          width: "100%"
        }}>
          <Link href="/business-lab/templates" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              transition: "all 0.2s ease",
              cursor: "pointer",
              height: "100%",
              color: "#0f172a"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(11, 113, 254, 0.6)"
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(11, 113, 254, 0.25)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.15)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
            }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                Templates
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280" }}>
                Lean Canvas, Personas, Pitch
              </p>
            </div>
          </Link>

          <Link href="/business-lab/simulators" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              transition: "all 0.2s ease",
              cursor: "pointer",
              height: "100%",
              color: "#0f172a"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(11, 113, 254, 0.6)"
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(11, 113, 254, 0.25)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.15)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
            }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🧮</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                Simuladores
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280" }}>
                Cashflow, Breakeven, Pricing
              </p>
            </div>
          </Link>

          <Link href="/business-lab/score" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              transition: "all 0.2s ease",
              cursor: "pointer",
              height: "100%",
              color: "#0f172a"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(11, 113, 254, 0.6)"
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(11, 113, 254, 0.25)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.15)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
            }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>📈</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                Investment Score
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280" }}>
                Evalúa tu preparación
              </p>
            </div>
          </Link>
        </div>

        {/* Tracks Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>🎯</span>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1E40AF" }}>
              Rutas de Aprendizaje
            </h2>
          </div>
          <p style={{ color: "#6B7280", marginBottom: 24, fontSize: 15 }}>
            Sigue estas rutas para construir tu startup de forma estructurada.
          </p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20
          }}>
            {tracks.map((track) => (
              <Link 
                key={track.id} 
                href={`/business-lab/track/${track.key}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  height: "100%",
                  position: "relative" as const,
                  overflow: "hidden",
                  color: "#0f172a"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(11, 113, 254, 0.25)"
                  e.currentTarget.style.borderColor = track.color ? `${track.color}80` : "rgba(11, 113, 254, 0.6)"
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.15)"
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)"
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
                }}
                >
                  {/* Color accent bar */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: track.color || "#0B71FE"
                  }} />
                  
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>
                      {track.icon || "📦"}
                    </div>
                    <h3 style={{ 
                      fontSize: 20, 
                      fontWeight: 700, 
                      color: "#111", 
                      marginBottom: 8 
                    }}>
                      {track.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                      {track.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      marginBottom: 8,
                      fontSize: 13,
                      color: "#6B7280"
                    }}>
                      <span>Progreso</span>
                      <span style={{ fontWeight: 600 }}>
                        {track.completedSteps || 0}/{track.totalSteps || 0}
                      </span>
                    </div>
                    <div style={{
                      background: "#E5E7EB",
                      borderRadius: 8,
                      height: 8,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        background: track.color || "#0B71FE",
                        height: "100%",
                        width: `${track.totalSteps > 0 ? (track.completedSteps / track.totalSteps) * 100 : 0}%`,
                        transition: "width 0.5s ease",
                        borderRadius: 8
                      }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Guidelines Card */}
        <div style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
          width: "100%",
          boxSizing: "border-box" as const,
          color: "#0f172a"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Normas de Uso
            </h3>
          </div>
          <ul style={{ 
            marginLeft: 20, 
            color: "#1e3a8a", 
            fontSize: 14,
            lineHeight: 1.8
          }}>
            <li>Mantén un lenguaje respetuoso en todos los espacios</li>
            <li>Los datos que compartas son privados por defecto</li>
            <li>Usa los simuladores y herramientas AI con responsabilidad</li>
            <li>Reporta cualquier problema a diego@bizen.mx</li>
          </ul>
        </div>
      </main>
  )
}
