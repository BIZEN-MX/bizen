"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import FixedSidebar from "./FixedSidebar"

export default function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Check if user is on a lesson page
  const isOnLessonPage = pathname?.includes('/learn/')

  // Don't show header on courses page
  const isCoursesPage = pathname === '/courses'

  if (isCoursesPage) {
    return <FixedSidebar />
  }

  const handleLogoClick = () => {
    if (isOnLessonPage) {
      setShowExitDialog(true)
    } else {
      router.push("/courses")
    }
  }

  const confirmExit = () => {
    setShowExitDialog(false)
    router.push("/courses")
  }

  const cancelExit = () => {
    setShowExitDialog(false)
  }

  return (
    <>
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(15, 98, 254, 0.1)",
        padding: "8px 16px",
        marginBottom: 0,
        height: "auto"
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            width: "fit-content"
          }}
          onClick={handleLogoClick}
        >
          <Image
            src="/bizen-logo.png"
            alt="BIZEN Logo"
            width={28}
            height={28}
            priority
            style={{
              objectFit: "contain"
            }}
          />
          <span style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#0F62FE",
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "0.5px"
          }}>
            BIZEN
          </span>
        </div>
      </div>

      {/* Fixed Sidebar always visible */}
      <FixedSidebar />

      {showExitDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: 24,
          fontFamily: "Montserrat, sans-serif"
        }}>
          <div style={{
            background: "white",
            borderRadius: 24,
            padding: "40px 32px",
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Decoration */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #0F62FE, #10B981)"
            }} />

            <div style={{
              width: 80,
              height: 80,
              background: "#FEF2F2",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 24px",
              boxShadow: "0 10px 20px -5px rgba(220, 38, 38, 0.1)"
            }}>
              👋
            </div>

            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 16,
              color: "#1e3a8a",
              letterSpacing: "-0.02em"
            }}>
              ¿Deseas salir?
            </h2>

            <p style={{
              fontSize: 16,
              color: "#475569",
              lineHeight: 1.6,
              marginBottom: 32,
              fontWeight: 500
            }}>
              Si sales ahora, perderás todo el progreso de esta lección. <span style={{ color: "#0F62FE", fontWeight: 700 }}>¡Estás haciendo un gran trabajo, te animamos a terminarla!</span>
            </p>

            <div style={{
              display: "flex",
              gap: 12,
              flexDirection: "column"
            }}>
              <button
                onClick={cancelExit}
                style={{
                  padding: "16px 24px",
                  background: "#0F62FE",
                  color: "white",
                  border: "none",
                  borderRadius: 16,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 10px 20px -5px rgba(15, 98, 254, 0.3)",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(15, 98, 254, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 10px 20px -5px rgba(15, 98, 254, 0.3)"
                }}
              >
                Continuar con la lección
              </button>

              <button
                onClick={confirmExit}
                style={{
                  padding: "16px 24px",
                  background: "transparent",
                  color: "#64748b",
                  border: "2px solid #e2e8f0",
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc"
                  e.currentTarget.style.color = "#ef4444"
                  e.currentTarget.style.borderColor = "#fee2e2"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#64748b"
                  e.currentTarget.style.borderColor = "#e2e8f0"
                }}
              >
                Salir de la lección
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

