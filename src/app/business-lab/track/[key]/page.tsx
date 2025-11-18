import React from "react"
import { redirect, notFound } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getTrackByKey, getUserLabProgress } from "@/lib/lab/db"
import Link from "next/link"
import BackButton from "@/components/business-lab/BackButton"
import StepCard from "@/components/business-lab/StepCard"

interface Props {
  params: {
    key: string
  }
}

export default async function TrackPage({ params }: Props) {
  const supabase = await createSupabaseServer()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/login")
  }

  // Fetch track data
  let track
  try {
    track = await getTrackByKey(params.key)
  } catch (error) {
    notFound()
  }

  // Fetch user progress
  const progress = await getUserLabProgress(user.id)
  const progressMap = new Map(progress.map(p => [p.step_id, p]))
  
  // Enrich steps with progress
  const stepsWithProgress = track.steps.map(step => ({
    ...step,
    isCompleted: progressMap.get(step.id)?.is_completed || false
  }))
  
  const completedCount = stepsWithProgress.filter(s => s.isCompleted).length
  const progressPercentage = track.steps.length > 0 ? Math.round((completedCount / track.steps.length) * 100) : 0

  return (
    <>
      <style>{`
        /* Mobile - account for footer */
        @media (max-width: 767px) {
          .track-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .track-main {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        /* Tablet/iPad - no gap, sidebar overlays */
        @media (min-width: 768px) and (max-width: 1024px) {
          .track-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .track-main {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        /* Desktop - no gap, sidebar overlays */
        @media (min-width: 1025px) {
          .track-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .track-main {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
      `}</style>
      <div className="track-outer" style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        fontFamily: "Montserrat, sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        <main className="track-main" style={{
          margin: "0 auto",
          minHeight: "100vh",
          fontFamily: "Montserrat, sans-serif",
          width: "100%",
          boxSizing: "border-box" as const,
          overflowX: "hidden",
          overflowY: "visible"
        }}>
      {/* Back Button */}
      <BackButton />

      {/* Track Header */}
      <div style={{ marginBottom: 32, width: "100%" }}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 900,
          background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 12
        }}>
          🎯 {track.title}
        </h1>
        {track.description && (
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>
            {track.description}
          </p>
        )}
      </div>

      {/* Progress Card */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        marginBottom: 32,
        border: "2px solid #DBEAFE",
        width: "100%"
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E40AF", marginBottom: 8 }}>
          Progreso en esta Ruta
        </h2>
        <p style={{ color: "#6B7280", marginBottom: 16, fontSize: 14 }}>
          Has completado {completedCount} de {track.steps.length} pasos
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

      {/* Steps List */}
      <div style={{ marginBottom: 32, width: "100%" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: "#111" }}>
          Pasos de esta Ruta
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {stepsWithProgress.map((step) => (
            <StepCard key={step.id} step={step} isCompleted={step.isCompleted} />
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {completedCount === track.steps.length && (
        <div style={{
          background: "#D1FAE5",
          borderRadius: 16,
          padding: 24,
          border: "2px solid #6EE7B7",
          boxShadow: "0 4px 20px rgba(16,185,129,0.15)",
          width: "100%"
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#065F46", marginBottom: 8 }}>
            🎉 ¡Felicidades! Has completado esta ruta
          </h2>
          <p style={{ fontSize: 14, color: "#047857", marginBottom: 16 }}>
            Estás listo para avanzar a la siguiente ruta o explorar herramientas adicionales.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/business-lab">
              <button style={{
                padding: "10px 20px",
                background: "white",
                border: "2px solid #10B981",
                color: "#10B981",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}>
                Ver todas las rutas
              </button>
            </Link>
            <Link href="/business-lab/simulators">
              <button style={{
                padding: "10px 20px",
                background: "#10B981",
                border: "none",
                color: "white",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}>
                Explorar Simuladores
              </button>
            </Link>
          </div>
        </div>
      )}
        </main>
      </div>
    </>
  )
}
