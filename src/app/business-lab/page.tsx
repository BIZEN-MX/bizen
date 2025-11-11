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
    <>
      <main style={{
        marginRight: "320px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        padding: "40px",
        fontFamily: "Montserrat, sans-serif",
        width: "100%"
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
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: 24,
          border: "2px solid #DBEAFE",
          width: "100%"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>🎯</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E40AF" }}>
              Tu Progreso General
            </h2>
          </div>
          <p style={{ color: "#6B7280", marginBottom: 16, fontSize: 14 }}>
            Has completado {completedSteps} de {totalSteps} pasos en el programa
          </p>
          <div style={{
            background: "#E0F2FE",
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
              borderRadius: 12
            }} />
            <span style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 12,
              fontWeight: 700,
              color: progressPercentage > 50 ? "white" : "#0B71FE"
            }}>
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Next Step Card */}
        {nextStep && (
          <div style={{
            background: "linear-gradient(135deg, #F3E8FF 0%, #E0E7FF 100%)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 20px rgba(139,92,246,0.15)",
            marginBottom: 24,
            border: "2px solid #DDD6FE",
            width: "100%"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>💡</span>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#5B21B6" }}>
                Siguiente Paso Recomendado
              </h2>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#111" }}>
              {nextStep.title}
            </h3>
            <p style={{ color: "#4B5563", marginBottom: 12, fontSize: 14 }}>
              {nextStep.description}
            </p>
            {nextStep.goal && (
              <p style={{ fontSize: 14, color: "#7C3AED", marginBottom: 16, fontWeight: 600 }}>
                🎯 {nextStep.goal}
              </p>
            )}
            <Link href={`/business-lab/step/${nextStep.id}`}>
              <button style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11,113,254,0.3)",
                transition: "transform 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
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
          marginBottom: 32
        }}>
          <Link href="/business-lab/templates" style={{ textDecoration: "none" }}>
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "2px solid transparent",
              transition: "all 0.2s ease",
              cursor: "pointer",
              height: "100%"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B71FE"
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(11,113,254,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"
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
              background: "white",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "2px solid transparent",
              transition: "all 0.2s ease",
              cursor: "pointer",
              height: "100%"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B71FE"
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(11,113,254,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"
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
              background: "white",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "2px solid transparent",
              transition: "all 0.2s ease",
              cursor: "pointer",
              height: "100%"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B71FE"
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(11,113,254,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"
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
                  background: "white",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "2px solid #E5E7EB",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  height: "100%",
                  position: "relative" as const,
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(11,113,254,0.2)"
                  e.currentTarget.style.borderColor = track.color || "#0B71FE"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
                  e.currentTarget.style.borderColor = "#E5E7EB"
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
          background: "#FEF3C7",
          borderRadius: 16,
          padding: 24,
          border: "2px solid #FDE68A",
          boxShadow: "0 2px 12px rgba(251,191,36,0.15)",
          width: "100%"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#92400E" }}>
              Normas de Uso
            </h3>
          </div>
          <ul style={{ 
            marginLeft: 20, 
            color: "#78350F", 
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

      <aside style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "320px",
        height: "100vh",
        pointerEvents: "none"
      }} />
    </>
  )
}
