"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"

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
      <Head>
        <title>BIZEN - Aprende, crece y domina tus finanzas</title>
        <meta name="description" content="En BIZEN nuestro lema es aprender. Aprende, crece y domina tus finanzas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
        padding: "24px 40px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(15, 98, 254, 0.1)",
      }}>
        <nav style={{ display: "flex", gap: "32px" }}>
          <Link href="/" style={{
            color: "#0F62FE",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "16px",
            transition: "color 0.3s",
          }}>Explorar</Link>
        </nav>
      </header>

      {/* Decorative blue accents */}
      <div style={{
        position: "absolute",
        top: "-200px",
        right: "-200px",
        width: "800px",
        height: "800px",
        background: "radial-gradient(circle, rgba(15, 98, 254, 0.06) 0%, transparent 70%)",
        borderRadius: "50%",
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
        padding: "40px",
      }}>
        
        <div className="main-content" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
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
              borderRadius: "32px",
              padding: "50px",
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
                }}
                priority
              />
            </div>
          </div>

          {/* Right Side - Text and CTAs */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(50px)",
            transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
          }}>
            {/* BIZEN Title */}
            <div>
              <h1 style={{
                fontSize: "clamp(180px, 25vw, 400px)",
                fontWeight: 900,
                margin: "0 0 24px 0",
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
                fontSize: "clamp(18px, 2.2vw, 26px)",
                color: "#4A5568",
                margin: "0 0 12px 0",
                fontWeight: 500,
                lineHeight: 1.5,
              }}>
                En BIZEN nuestro lema es aprender.
              </p>
              <p style={{
                fontSize: "clamp(16px, 2vw, 22px)",
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
              gap: "16px",
              marginTop: "20px",
            }}>
              <Link
                href="/"
                style={{
                  padding: "20px 48px",
                  fontSize: "18px",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                  background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                  backgroundSize: "200% auto",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 8px 24px rgba(15, 98, 254, 0.25)",
                  textAlign: "center",
                  letterSpacing: "0.3px",
                  animation: "shimmerButton 3s ease-in-out infinite",
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
                Ir a BIZEN
              </Link>

              <Link
                href="/login"
                style={{
                  padding: "20px 48px",
                  fontSize: "18px",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                  background: "white",
                  color: "#0F62FE",
                  border: "2px solid #0F62FE",
                  borderRadius: "12px",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 16px rgba(15, 98, 254, 0.1)",
                  textAlign: "center",
                  letterSpacing: "0.3px",
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
                Microcredenciales
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
        padding: "40px",
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
          gap: "32px",
          fontSize: "14px",
          color: "#718096",
        }}>
          <Link href="/#cursos" style={{ color: "#4A5568", textDecoration: "none" }}>
            Cursos
          </Link>
          <Link href="/login" style={{ color: "#4A5568", textDecoration: "none" }}>
            Microcredenciales
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
            padding: 16px 20px !important;
          }
          header nav {
            gap: 20px !important;
            font-size: 14px !important;
          }
          .main-content {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 20px !important;
          }
          footer {
            padding: 24px 20px !important;
          }
          footer > div {
            flex-direction: column !important;
            text-align: center !important;
          }
          h1 {
            font-size: clamp(80px, 30vw, 200px) !important;
            line-height: 0.9 !important;
          }
          .main-content > div:first-child {
            padding: 24px !important;
          }
          .main-content > div:first-child img {
            width: 100% !important;
            max-width: 280px !important;
            height: auto !important;
          }
        }
      `}</style>
      </div>
    </>
  )
}
