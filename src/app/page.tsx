"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

export default function WelcomePage() {
  const [isMouthOpen, setIsMouthOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)

    const mouthInterval = setInterval(() => {
      setIsMouthOpen(prev => !prev)
    }, 400)

    return () => clearInterval(mouthInterval)
  }, [])

  return (
    <>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff 0%, #f0f7ff 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Montserrat, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
      {/* Header */}
      <header style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        padding: "clamp(16px, 3vw, 24px) clamp(20px, 4vw, 40px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(15, 98, 254, 0.1)",
      }}>
        {/* Logo and Brand */}
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 2vw, 10px)",
          textDecoration: "none",
        }}>
          <Image 
            src="/bizen-logo.png" 
            alt="BIZEN logo" 
            width={40} 
            height={40} 
            priority 
            style={{ width: "clamp(32px, 5vw, 40px)", height: "auto" }}
          />
          <strong style={{ 
            fontSize: "clamp(18px, 3vw, 20px)", 
            color: "#0B71FE", 
            fontFamily: 'Montserrat, sans-serif' 
          }}>BIZEN</strong>
        </Link>

        <nav style={{ display: "flex", gap: "clamp(16px, 4vw, 32px)" }}>
          <Link href="/landing" style={{
            color: "#0F62FE",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "clamp(14px, 2vw, 16px)",
            transition: "color 0.3s",
          }}>Explorar</Link>
        </nav>
      </header>

      {/* Decorative blue accents */}
      <div style={{
        position: "absolute",
        top: "clamp(-100px, -15vw, -200px)",
        right: "clamp(-100px, -15vw, -200px)",
        width: "clamp(300px, 50vw, 800px)",
        height: "clamp(300px, 50vw, 800px)",
        background: "radial-gradient(circle, rgba(15, 98, 254, 0.06) 0%, transparent 70%)",
        borderRadius: "50%",
        overflow: "hidden",
        pointerEvents: "none",
      }} />

      {/* Main Content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1200px",
        margin: "0 auto",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 4vw, 40px)",
      }}>
        
        <div className="main-content" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 6vw, 80px)",
          alignItems: "center",
          width: "100%",
        }}>
          
          {/* Left Side - Billy */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-50px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}>
            <div style={{
              position: "relative",
              background: "white",
              borderRadius: "clamp(16px, 4vw, 32px)",
              padding: "clamp(24px, 5vw, 50px)",
              boxShadow: "0 24px 64px rgba(15, 98, 254, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)",
            }}>
              <Image
                src={isMouthOpen ? "/3.png" : "/2.png"}
                alt="Billy"
                width={320}
                height={320}
                style={{ 
                  display: "block",
                  borderRadius: "16px",
                  width: "100%",
                  height: "auto",
                  maxWidth: "clamp(240px, 40vw, 320px)",
                }}
                priority
              />
            </div>
          </div>

          {/* Right Side - Text and CTAs */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(24px, 4vw, 40px)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(50px)",
            transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
            textAlign: "center",
          }}>
            {/* BIZEN Title */}
            <div>
              <h1 style={{
                fontSize: "clamp(64px, 12vw, 160px)",
                fontWeight: 900,
                margin: "0 0 clamp(16px, 3vw, 24px) 0",
                letterSpacing: "0.03em",
                fontFamily: "Montserrat, sans-serif",
                lineHeight: 1,
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite",
              }}>
                BIZEN
              </h1>
              <p style={{
                fontSize: "clamp(16px, 2.2vw, 26px)",
                color: "#4A5568",
                margin: "0 0 clamp(8px, 1.5vw, 12px) 0",
                fontWeight: 500,
                lineHeight: 1.5,
              }}>
                En BIZEN nuestro lema es aprender.
              </p>
              <p style={{
                fontSize: "clamp(14px, 2vw, 22px)",
                color: "#718096",
                margin: 0,
                fontWeight: 400,
                lineHeight: 1.6,
              }}>
                Aprende, crece y domina tus finanzas.
              </p>
            </div>

            {/* Buttons */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 2vw, 16px)",
              marginTop: "clamp(16px, 2.5vw, 20px)",
            }}>
              <Link
                href="/courses"
                style={{
                  padding: "clamp(16px, 3vw, 20px) clamp(32px, 6vw, 48px)",
                  fontSize: "clamp(16px, 2.2vw, 18px)",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                  background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                  backgroundSize: "200% auto",
                  color: "white",
                  border: "none",
                  borderRadius: "clamp(10px, 1.5vw, 12px)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 8px 24px rgba(15, 98, 254, 0.25)",
                  textAlign: "center",
                  letterSpacing: "0.3px",
                  animation: "shimmerButton 3s ease-in-out infinite",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(15, 98, 254, 0.35)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.25)"
                }}
              >
                Empieza Ahora
              </Link>

              <Link
                href="/login"
                style={{
                  padding: "clamp(16px, 3vw, 20px) clamp(32px, 6vw, 48px)",
                  fontSize: "clamp(16px, 2.2vw, 18px)",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                  background: "white",
                  color: "#0F62FE",
                  border: "2px solid #0F62FE",
                  borderRadius: "clamp(10px, 1.5vw, 12px)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 16px rgba(15, 98, 254, 0.1)",
                  textAlign: "center",
                  letterSpacing: "0.3px",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                  e.currentTarget.style.background = "#0F62FE"
                  e.currentTarget.style.color = "white"
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(15, 98, 254, 0.25)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(15, 98, 254, 0.1)"
                }}
              >
                Ya tengo una cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        padding: "clamp(24px, 4vw, 40px)",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(15, 98, 254, 0.1)",
        marginTop: "auto",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "clamp(16px, 3vw, 32px)",
          fontSize: "clamp(12px, 1.8vw, 14px)",
          color: "#718096",
        }}>
          <Link href="/signup" style={{ color: "#4A5568", textDecoration: "none", fontWeight: 500 }}>
            Crear cuenta
          </Link>
          <Link href="/login" style={{ color: "#4A5568", textDecoration: "none", fontWeight: 500 }}>
            Iniciar sesión
          </Link>
          <Link href="/bizen/terminos" style={{ color: "#4A5568", textDecoration: "none" }}>
            Términos
          </Link>
          <Link href="/bizen/privacidad" style={{ color: "#4A5568", textDecoration: "none" }}>
            Aviso de Privacidad
          </Link>
          <span>© 2025 BIZEN</span>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shimmerButton {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 200% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @media (max-width: 768px) {
          header {
            flex-wrap: wrap;
            gap: 12px;
          }
          header nav {
            width: 100%;
            justify-content: center;
            margin-top: 8px;
          }
          .main-content {
            grid-template-columns: 1fr !important;
            gap: clamp(24px, 5vw, 40px) !important;
          }
          .main-content > div:first-child {
            order: 2;
          }
          .main-content > div:last-child {
            order: 1;
          }
          h1 {
            font-size: clamp(48px, 18vw, 120px) !important;
            line-height: 1 !important;
            text-align: center;
          }
          .main-content > div:first-child > div {
            padding: clamp(16px, 4vw, 24px) !important;
          }
          .main-content > div:first-child img {
            width: 100% !important;
            max-width: clamp(150px, 30vw, 240px) !important;
            height: auto !important;
          }
          footer > div {
            flex-direction: column !important;
            text-align: center !important;
            gap: 12px !important;
          }
          /* Ensure buttons are full width on mobile */
          .main-content > div:last-child > div:last-child a {
            width: 100%;
          }
        }
        @media (max-width: 480px) {
          h1 {
            font-size: clamp(40px, 20vw, 80px) !important;
          }
          .main-content > div:first-child > div {
            padding: 12px !important;
          }
        }
        @media (min-width: 769px) {
          .main-content > div:last-child {
            text-align: left;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .main-content {
            gap: clamp(40px, 6vw, 60px) !important;
          }
          h1 {
            font-size: clamp(80px, 14vw, 140px) !important;
          }
        }
      `}</style>
      </div>
    </>
  )
}
