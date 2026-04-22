"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import FixedSidebar from "./FixedSidebar"

export default function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const userEmail = (user?.email || user?.emailAddresses?.[0]?.emailAddress || "").toLowerCase();
  const isAnahuac = userEmail && (
    userEmail.endsWith('@anahuac.mx') ||
    userEmail.endsWith('.anahuac.mx') ||
    userEmail.endsWith('@bizen.mx')
  );

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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(15, 98, 254, 0.1)",
        padding: "8px 16px",
        height: "46px",
        display: "flex",
        alignItems: "center"
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
          {isAnahuac ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Image
                src="/anahuac-logo.png"
                alt="Anahuac Logo"
                width={28}
                height={28}
                priority
                style={{ objectFit: 'contain' }}
              />
              <span style={{ color: '#94a3b8', fontSize: '20px', fontWeight: 500, margin: "0 4px" }}>⨯</span>
              <span style={{
                fontSize: "30px",
                fontWeight: 600,
                color: "var(--primary)",
                letterSpacing: "-1px"
              }}>
                BIZEN
              </span>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Fixed Sidebar always visible */}
      <FixedSidebar />

    </>
  )
}

