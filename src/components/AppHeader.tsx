"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import FixedSidebar from "./FixedSidebar"

export default function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is on a lesson page
  const isOnLessonPage = pathname?.includes('/learn/')

  // Don't show header on courses page
  const isCoursesPage = pathname === '/courses'

  if (isCoursesPage) {
    return <FixedSidebar />
  }

  const handleLogoClick = () => {
    router.push("/courses")
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
            fontWeight: 500,
            color: "#0F62FE",
                        letterSpacing: "0.5px"
          }}>
            BIZEN
          </span>
        </div>
      </div>

      {/* Fixed Sidebar always visible */}
      <FixedSidebar />

    </>
  )
}

