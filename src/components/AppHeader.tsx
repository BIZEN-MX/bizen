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

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: 20,
          fontFamily: "Montserrat, sans-serif"
        }}>
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "32px",
            maxWidth: 450,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
          }}>
            <div style={{
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 16,
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              ⚠️ ¿Estás seguro?
            </div>
            
            <p style={{
              fontSize: 16,
              color: "#374151",
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              Si sales ahora, se perderá tu progreso de la lección actual. ¿Deseas continuar?
            </p>

            <div style={{
              display: "flex",
              gap: 12,
              flexDirection: "column"
            }}>
              <button
                onClick={cancelExit}
                style={{
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Continuar con la lección
              </button>

              <button
                onClick={confirmExit}
                style={{
                  padding: "14px 24px",
                  background: "white",
                  color: "#DC2626",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FEF2F2"
                  e.currentTarget.style.transform = "scale(1.02)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.transform = "scale(1)"
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

