"use client"

import Image from "next/image"
import Link from "next/link"

export default function BIZENHomePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 75%, #00f2fe 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <div style={{
        background: "white",
        borderRadius: 24,
        padding: "48px 40px",
        maxWidth: 600,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <Image 
          src="/bizen-mondragonlogo.png" 
          alt="BIZEN" 
          width={120} 
          height={120}
          style={{ marginBottom: 24 }}
        />
        
        <h1 style={{
          fontSize: "clamp(32px, 6vw, 48px)",
          fontWeight: 900,
          margin: "0 0 16px",
          background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Bienvenido a BIZEN
        </h1>
        
        <p style={{
          fontSize: 18,
          color: "#666",
          lineHeight: 1.6,
          marginBottom: 32
        }}>
          Aprende habilidades empresariales esenciales para el mundo real.
        </p>
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          <Link
            href="/login"
            style={{
              display: "block",
              padding: "16px 32px",
              background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
              color: "white",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.2s",
              boxShadow: "0 6px 20px rgba(11, 113, 254, 0.3)"
            }}
          >
            Iniciar Sesión
          </Link>
          
          <Link
            href="/signup"
            style={{
              display: "block",
              padding: "16px 32px",
              background: "white",
              color: "#0B71FE",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              border: "2px solid #0B71FE",
              transition: "transform 0.2s"
            }}
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  )
}
