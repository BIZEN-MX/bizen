"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

export default function WelcomePage() {
  const [isMouthOpen, setIsMouthOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showFunText, setShowFunText] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)

    const mouthInterval = setInterval(() => {
      setIsMouthOpen(prev => !prev)
    }, 400)

    return () => clearInterval(mouthInterval)
  }, [])

  // Track scroll direction and show fun text on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY < lastScrollY ? 'up' : 'down'
      
      setScrollDirection(direction)
      setLastScrollY(currentScrollY)

      // Animate fun text when scrolling up
      if (direction === 'up' && currentScrollY > 100) {
        setShowFunText(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Scroll reveal effect using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          // Once revealed, we can stop observing
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal-element')
      revealElements.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      const revealElements = document.querySelectorAll('.reveal-element')
      revealElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
      <div style={{
        background: "linear-gradient(to bottom, #ffffff 0%, #f0f7ff 100%)",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      width: "100%"
      }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        padding: "clamp(16px, 3vw, 24px) clamp(20px, 4vw, 40px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "clamp(120px, 22vw, 300px)",
        background: "#ffffff",
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

        <nav style={{ display: "flex", gap: "clamp(16px, 4vw, 32px)", alignItems: "center", marginLeft: "clamp(100px, 18vw, 250px)" }} className="header-nav">
          <Link href="/signup" style={{
            padding: "clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)",
            fontSize: "clamp(14px, 2vw, 16px)",
            fontWeight: 700,
            fontFamily: "Montserrat, sans-serif",
            background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
            backgroundSize: "200% auto",
            color: "white",
            border: "none",
            borderRadius: "clamp(8px, 1.5vw, 10px)",
            textDecoration: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(15, 98, 254, 0.25)",
            textAlign: "center",
            letterSpacing: "0.3px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="crear-cuenta-button">Crear cuenta</Link>
        </nav>
      </header>

      <div style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Montserrat, sans-serif",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}>

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
        width: "100%",
        minHeight: 0,
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
            {/* Text Content */}
            <div style={{ width: "100%" }}>
              <p style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "#718096",
                margin: 0,
                fontWeight: 600,
                lineHeight: 1.4,
                maxWidth: "none",
                width: "100%",
                fontFamily: "'Inter', 'Poppins', 'Open Sans', system-ui, -apple-system, sans-serif",
                transform: "scale(1)",
              }} className="hero-main-text">
                ¿Aprender finanzas mientras juegas? ¡Sí, <span style={{
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite",
                  fontWeight: 700,
                }}>BIZEN</span> es eso y más!
              </p>
            </div>

            {/* Buttons */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(12px, 2vw, 16px)",
              marginTop: "clamp(16px, 2.5vw, 20px)",
            }}>
              <Link
                href="/signup"
                style={{
                  padding: "clamp(14px, 2.5vw, 18px) clamp(20px, 3.5vw, 32px)",
                  fontSize: "clamp(14px, 1.8vw, 16px)",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                  background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                  backgroundSize: "200% auto",
                  color: "white",
                  border: "none",
                  borderRadius: "clamp(8px, 1.2vw, 10px)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 8px 24px rgba(15, 98, 254, 0.25)",
                  textAlign: "center",
                  letterSpacing: "0.3px",
                  animation: "shimmerButton 3s ease-in-out infinite",
                  minHeight: "48px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "clamp(240px, 35vw, 320px)",
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
                  padding: "clamp(14px, 2.5vw, 18px) clamp(20px, 3.5vw, 32px)",
                  fontSize: "clamp(14px, 1.8vw, 16px)",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                  background: "white",
                  color: "#0F62FE",
                  border: "2px solid #0F62FE",
                  borderRadius: "clamp(8px, 1.2vw, 10px)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 16px rgba(15, 98, 254, 0.1)",
                  textAlign: "center",
                  letterSpacing: "0.3px",
                  minHeight: "48px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "clamp(240px, 35vw, 320px)",
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

      <style>{`
        /* Scroll reveal animations */
        .reveal-element {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .reveal-element.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-element.reveal-delay-1 {
          transition-delay: 0.1s;
        }
        .reveal-element.reveal-delay-2 {
          transition-delay: 0.2s;
        }
        .reveal-element.reveal-delay-3 {
          transition-delay: 0.3s;
        }
        .reveal-element.reveal-delay-4 {
          transition-delay: 0.4s;
        }
        
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
        .hero-main-text {
          font-size: clamp(32px, 5vw, 48px) !important;
          font-family: 'Inter', 'Poppins', 'Open Sans', system-ui, -apple-system, sans-serif !important;
        }
        
        .y-mucho-mas-text {
          font-size: clamp(40px, 7vw, 80px) !important;
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
          /* Ensure button is visible and properly sized on mobile */
          .crear-cuenta-button {
            padding: 10px 16px !important;
            font-size: 14px !important;
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
          /* Footer links horizontal on mobile */
          .footer-links {
            flex-direction: row !important;
            text-align: center !important;
            gap: clamp(8px, 2vw, 16px) !important;
            flex-wrap: wrap !important;
          }
          /* Ensure buttons are full width on mobile */
          .main-content > div:last-child > div:last-child a {
            width: 100%;
          }
          /* Force text size in hero */
          .main-content > div:last-child > div:first-child p,
          .hero-main-text {
            font-size: clamp(32px, 5vw, 48px) !important;
            font-family: 'Inter', 'Poppins', 'Open Sans', system-ui, -apple-system, sans-serif !important;
            max-width: none !important;
            width: 100% !important;
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
        
        .fun-text-line {
          width: 100% !important;
        }
      `}</style>
      </div>

      {/* Fun text between main hero and hero 1 */}
      <div style={{
        textAlign: "center",
        padding: "clamp(8px, 1.5vw, 16px) 0 clamp(120px, 18vw, 200px) 0",
        background: "transparent",
        marginTop: "clamp(-100px, -12vw, -80px)",
        marginBottom: "clamp(40px, 8vw, 80px)",
        opacity: showFunText ? 1 : 0,
        transform: showFunText ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        display: "flex",
        justifyContent: "center"
      }}>
        <div style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(12px, 2vw, 16px)"
        }}>
          {/* Top line */}
          <div className="fun-text-line" style={{
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #0F62FE 20%, #0F62FE 80%, transparent 100%)",
            borderRadius: "1px"
          }} />
          
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 900,
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive, sans-serif",
            background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: showFunText ? "shimmer 3s ease-in-out infinite" : "none",
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap"
          }}>Ahorro, invierto, emprendo, crezco.</h1>
          
          {/* Bottom line */}
          <div className="fun-text-line" style={{
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #0F62FE 20%, #0F62FE 80%, transparent 100%)",
            borderRadius: "1px"
          }} />
        </div>
      </div>

      {/* Landing Page Content */}
      <LandingContent />

      {/* Footer */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        padding: "clamp(16px, 3vw, 24px)",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(15, 98, 254, 0.1)",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "clamp(12px, 2vw, 20px)",
          fontSize: "clamp(12px, 1.8vw, 14px)",
          color: "#718096",
        }} className="footer-links">
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
    </div>
  )
}

// Landing Content Component - extracted from /landing page
type Level = "Principiante" | "Intermedio" | "Avanzado"

type Course = {
  title: string
  level: Level
  duration: string
  image: string
  url: string
}

type Plan = {
  name: string
  cta: string
  ctaUrl: string
  priceNote?: string
  highlighted?: boolean
  features: string[]
}

type FAQ = { q: string; a: string }

const defaultCourses: Course[] = [
  {
    title: "Finanzas personales desde cero",
    level: "Principiante",
    duration: "4h",
    image:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-1",
  },
  {
    title: "Presupuesto 50/30/20 en la vida real",
    level: "Principiante",
    duration: "2h",
    image:
      "https://images.unsplash.com/photo-1559066653-e8b5f22f1f83?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-2",
  },
  {
    title: "Inversión básica y fondos índice",
    level: "Intermedio",
    duration: "5h",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-3",
  },
  {
    title: "Crédito responsable y score",
    level: "Intermedio",
    duration: "3h",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-4",
  },
  {
    title: "Fraudes comunes y protección digital",
    level: "Principiante",
    duration: "1.5h",
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-5",
  },
  {
    title: "Impuestos básicos para estudiantes",
    level: "Intermedio",
    duration: "2.5h",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-6",
  },
]

const defaultPlans: Plan[] = [
  {
    name: "Gratuito",
    cta: "Empezar ahora",
    ctaUrl: "/signup",
    priceNote: "Plan individual",
    highlighted: false,
    features: [
      "Acceso a cursos base",
      "Retos gamificados y badges",
      "Progreso y metas semanales",
      "Soporte por email",
    ],
  },
  {
    name: "Emprendedor",
    cta: "Solicitar demo",
    ctaUrl: "#contacto",
    priceNote: "Pilotos y licenciamiento",
    highlighted: true,
    features: [
      "Panel para docentes",
      "Reportes y analítica",
      "Integración LMS (LTI/SCORM)",
      "Soporte prioritario",
    ],
  },
  {
    name: "Instituciones",
    cta: "Hablar con ventas",
    ctaUrl: "#contacto",
    priceNote: "Programas a medida",
    highlighted: false,
    features: [
      "Rutas personalizadas",
      "Sesiones en vivo",
      "KPIs y compliance",
      "Implementación dedicada",
    ],
  },
]

const defaultFaqs: FAQ[] = [
  {
    q: "¿Qué es BIZEN?",
    a: "Una plataforma de e-learning en finanzas con cursos cortos, retos y recompensas para aprender de forma práctica.",
  },
  {
    q: "¿Para quién es?",
    a: "Para estudiantes de prepa/universidad y personas que inician en finanzas personales.",
  },
  {
    q: "¿Cómo funcionan los retos?",
    a: "Cada reto propone una acción concreta y otorga puntos/insignias al completarse.",
  },
  {
    q: "¿Dan certificados?",
    a: "Sí, al completar rutas de aprendizaje obtienes microcredenciales y un certificado digital.",
  },
  {
    q: "¿Puedo usarlo en el móvil?",
    a: "Sí, es 100% responsivo y funciona en navegadores modernos.",
  },
  {
    q: "¿Hay plan gratuito?",
    a: "Periódicamente abrimos retos gratuitos. Suscríbete para enterarte.",
  },
]

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false)
  const id = React.useMemo(() => 
    question.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").slice(0, 64), 
    [question]
  )

  return (
    <div className={`accordion-item ${open ? "open" : ""}`} role="listitem">
      <button
        className="accordion-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        type="button"
      >
        <span>{question}</span>
        <svg className="chev" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div id={id} className="accordion-panel" role="region" aria-labelledby={id}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

function StepIcon1({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" className="step-icon">
      <path
        fill={color}
        d="M12 2a5 5 0 015 5v1h1a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-8a3 3 0 013-3h1V7a5 5 0 015-5zm-3 6v1h6V8a3 3 0 10-6 0z"
      />
    </svg>
  )
}

function StepIcon2({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" className="step-icon">
      <path fill={color} d="M3 4h18v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h18v2H3v-2z" />
    </svg>
  )
}

function StepIcon3({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" className="step-icon">
      <path
        fill={color}
        d="M12 2l2.39 4.84L20 8l-4 3.9L17.48 18 12 15.7 6.52 18 8 11.9 4 8l5.61-1.16L12 2z"
      />
    </svg>
  )
}

function LandingContent() {
  const primary = "#0F71FD"
  const accent = "#10B981"
  
  return (
    <>
      <style>{landingCSS}</style>
      
      {/* CÓMO FUNCIONA - Text Left, Image Right */}
      <section id="sobre" className="section about reveal-element" style={{ background: "transparent", paddingTop: "clamp(16px, 2vw, 24px)", paddingBottom: "clamp(24px, 3vw, 32px)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "center",
            minHeight: "400px"
          }}>
            {/* Text Left */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "clamp(42px, 6.5vw, 64px)",
                lineHeight: 1.15,
                margin: "0 0 20px 0",
                fontWeight: 800,
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'Fredoka One', cursive, sans-serif",
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite"
              }}>Presupuesto 50/30/20</h2>
              <p style={{
                fontSize: "clamp(22px, 3vw, 28px)",
                color: "#475569",
                margin: "0 0 32px 0",
                lineHeight: 1.6,
                fontFamily: "Arial, sans-serif"
              }}>Ordeno mi dinero en minutos. Necesidades, gustos y ahorro. Simple y útil.</p>
            </div>
            
            {/* Image Right */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }}>
              <img
                src="/hero1.png"
                alt="Cómo funciona BIZEN"
                className="hero-image-small"
                style={{
                  height: "auto",
                  borderRadius: "16px",
                  objectFit: "contain",
                  display: "block",
                  flexShrink: 0
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS - Image Left, Text Right */}
      <section className="section benefits reveal-element reveal-delay-1" style={{ background: "transparent", paddingTop: "clamp(16px, 2vw, 24px)", paddingBottom: "clamp(24px, 3vw, 32px)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "center",
            minHeight: "400px"
          }}>
            {/* Image Left */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              paddingTop: "20px"
            }}>
              <img
                src="/hero2.png"
                alt="Simuladores financieros BIZEN"
                className="hero-image-small"
                style={{
                  height: "auto",
                  borderRadius: "16px",
                  objectFit: "contain",
                  display: "block",
                  flexShrink: 0
                }}
              />
            </div>
            
            {/* Text Right */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "clamp(42px, 6.5vw, 64px)",
                lineHeight: 1.15,
                margin: "0 0 20px 0",
                fontWeight: 800,
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'Fredoka One', cursive, sans-serif",
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite"
              }}>Simuladores financieros</h2>
              <p style={{
                fontSize: "clamp(22px, 3vw, 28px)",
                color: "#475569",
                margin: "0 0 32px 0",
                lineHeight: 1.6,
                fontFamily: "Arial, sans-serif"
              }}>Pruebo escenarios reales. Cambio números y veo el impacto al instante. Aprendo haciendo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS - Text Left, Image Right */}
      <section id="cursos" className="section courses reveal-element reveal-delay-2" style={{ background: "transparent", paddingTop: "clamp(16px, 2vw, 24px)", paddingBottom: "clamp(24px, 3vw, 32px)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "center",
            minHeight: "400px"
          }}>
            {/* Text Left */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "clamp(42px, 6.5vw, 64px)",
                lineHeight: 1.15,
                margin: "0 0 20px 0",
                fontWeight: 800,
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'Fredoka One', cursive, sans-serif",
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite"
              }}>Cashflow</h2>
              <p style={{
                fontSize: "clamp(22px, 3vw, 28px)",
                color: "#475569",
                margin: "0 0 32px 0",
                lineHeight: 1.6,
                fontFamily: "Arial, sans-serif"
              }}>Aprendes jugando. Simulo ingresos, gastos y decisiones para que sientas el dinero en acción, pero sin riesgo.</p>
            </div>
            
            {/* Image Right */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }}>
              <img
                src="/hero3.png"
                alt="Cashflow BIZEN"
                className="hero-image-small"
                style={{
                  height: "auto",
                  borderRadius: "16px",
                  objectFit: "contain",
                  display: "block",
                  flexShrink: 0
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FORO DE EMPRENDEDORES - Image Left, Text Right */}
      <section className="section forum reveal-element reveal-delay-3" style={{ background: "transparent", paddingTop: "clamp(16px, 2vw, 24px)", paddingBottom: "clamp(24px, 3vw, 32px)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "center",
            minHeight: "400px"
          }}>
            {/* Image Left */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              paddingTop: "0px",
              marginTop: "-40px"
            }}>
              <img
                src="/hero4.png"
                alt="Foro de emprendedores BIZEN"
                className="hero-image-small"
                style={{
                  height: "auto",
                  borderRadius: "16px",
                  objectFit: "contain",
                  display: "block",
                  flexShrink: 0
                }}
              />
            </div>
            
            {/* Text Right */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "clamp(42px, 6.5vw, 64px)",
                lineHeight: 1.15,
                margin: "0 0 20px 0",
                fontWeight: 800,
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'Fredoka One', cursive, sans-serif",
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite"
              }}>Foro de emprendedores</h2>
              <p style={{
                fontSize: "clamp(22px, 3vw, 28px)",
                color: "#475569",
                margin: "0 0 32px 0",
                lineHeight: 1.6,
                fontFamily: "Arial, sans-serif"
              }}>Pido feedback, comparto avances y aprendo de otros. Comunidad segura y moderada.</p>
                      </div>
          </div>
        </div>
      </section>

      {/* Y MUCHO MÁS... Text below Hero 4 */}
      <div className="reveal-element reveal-delay-4" style={{
        textAlign: "center",
        padding: "clamp(48px, 8vw, 120px) 0",
        background: "transparent"
      }}>
        <h2 className="y-mucho-mas-text" style={{
          fontSize: "clamp(40px, 7vw, 80px) !important",
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shimmer 3s ease-in-out infinite",
          margin: 0,
          lineHeight: 1.2,
          letterSpacing: "0.02em"
        }}>Y MUCHO MÁS...</h2>
      </div>

      {/* PRECIOS */}
      <section id="precios" className="section pricing reveal-element reveal-delay-2" style={{ background: "transparent" }}>
        <div className="container">
          <header className="section-head">
            <h2 style={{
              background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s ease-in-out infinite",
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive, sans-serif"
            }}>Planes</h2>
            <p>Elige el plan que mejor se adapte a tus necesidades.</p>
          </header>

          <div className="grid-3">
            {defaultPlans.map((p, i) => (
              <article
                key={i}
                className={`plan ${p.highlighted ? "plan--highlight" : ""}`}
                aria-label={`Plan ${p.name}`}
              >
                {p.highlighted && <span className="tag">Recomendado</span>}
                <h3 className="plan-name">{p.name}</h3>
                {p.priceNote && <p className="plan-note">{p.priceNote}</p>}

                <ul className="plan-list">
                  {p.features.map((f, j) => (
                    <li key={j}>
                      <span className="check" aria-hidden="true">✓</span> 
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={p.ctaUrl} className="btn primary plan-btn" style={{marginTop:"auto"}}>
                  {p.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faq reveal-element reveal-delay-3" style={{ background: "transparent" }}>
        <div className="container">
          <header className="section-head">
            <h2 style={{
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 1.15,
              margin: "0 0 8px 0",
              fontWeight: 800,
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'Fredoka One', cursive, sans-serif",
              background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s ease-in-out infinite"
            }}>Preguntas frecuentes</h2>
          </header>

          <div className="accordion" role="list">
            {defaultFaqs.map(({ q, a }, idx) => (
              <AccordionItem key={idx} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="section contact reveal-element reveal-delay-4" style={{ background: "transparent", position: "relative", overflow: "hidden" }}>
        {/* Decorative background elements */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(15, 98, 254, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(15, 98, 254, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0
        }} />
        
        <div className="container contact-inner" style={{ position: "relative", zIndex: 1 }}>
          <header className="section-head">
            <h2 style={{
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 1.15,
              margin: "0 0 8px 0",
              fontWeight: 800,
              fontFamily: "Arial, sans-serif",
              background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s ease-in-out infinite"
            }}>Contacto</h2>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", marginTop: "12px" }}>¿Dudas o propuestas? Escríbenos, nos encantará leerte.</p>
          </header>

          <div style={{
            display: "grid",
            gap: "32px",
            gridTemplateColumns: "1fr",
            alignItems: "start"
          }}>
          <form
              className="contact-form-glass"
              onSubmit={async (e) => {
              e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const name = formData.get('name') as string
                const email = formData.get('email') as string
                const message = formData.get('message') as string

                // Get submit button and form for UI updates
                const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
                const originalButtonText = submitButton.textContent

                // Disable button and show loading state
                submitButton.disabled = true
                submitButton.textContent = 'Enviando...'

                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message }),
                  })

                  const result = await response.json()

                  if (result.success) {
                    // Show success message
                    alert(result.message || '¡Gracias por contactarnos! Te responderemos pronto.')
                    // Reset form
                    form.reset()
                  } else {
                    // Show error message
                    alert(result.message || 'Error al enviar el mensaje. Por favor intenta de nuevo.')
                  }
                } catch (error) {
                  console.error('Error submitting contact form:', error)
                  alert('Error al enviar el mensaje. Por favor intenta de nuevo más tarde.')
                } finally {
                  // Re-enable button
                  submitButton.disabled = false
                  submitButton.textContent = originalButtonText || 'Enviar mensaje'
                }
              }}
            >
              <div className="contact-field">
                <label htmlFor="name">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>👤</span>
                  Nombre
                </label>
                <input id="name" name="name" type="text" required placeholder="Tu nombre completo" />
            </div>
              <div className="contact-field">
                <label htmlFor="email">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>📧</span>
                  Email
                </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
              <div className="contact-field">
                <label htmlFor="message">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>💬</span>
                  Mensaje
                </label>
              <textarea
                id="message"
                name="message"
                  rows={5}
                required
                placeholder="Cuéntanos en qué podemos ayudarte…"
              />
            </div>
              <button className="btn primary contact-submit" type="submit" style={{
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 3s ease-in-out infinite",
                width: "100%",
                fontSize: "clamp(16px, 2vw, 18px)",
                fontWeight: 700,
                padding: "16px 24px",
                marginTop: "8px",
                boxShadow: "0 8px 24px rgba(15, 98, 254, 0.35)"
              }}>
              Enviar mensaje
            </button>
          </form>

            <aside className="contact-aside-glass">
              <h3 style={{
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 800,
                marginBottom: "24px",
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite",
                fontFamily: "Arial, sans-serif"
              }}>Datos de contacto</h3>
              <ul className="contact-info-list">
                <li>
                  <span className="contact-icon">📧</span>
                  <div>
                    <strong>Email</strong>
                    <span>diego@bizen.mx</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>Ubicación</strong>
                    <span>CDMX, México</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">🕘</span>
                  <div>
                    <strong>Horario</strong>
                    <span>Lun–Vie · 9:00–18:00</span>
                  </div>
                </li>
            </ul>
              <div className="socials-enhanced" aria-label="Redes sociales">
                <h4 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>Síguenos</h4>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="#" aria-label="Instagram" className="social-glass">
                    <span>Instagram</span>
                  </a>
                  <a href="#" aria-label="Twitter/X" className="social-glass">
                    <span>Twitter</span>
                  </a>
                  <a href="#" aria-label="YouTube" className="social-glass">
                    <span>YouTube</span>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="social-glass">
                    <span>LinkedIn</span>
                  </a>
                </div>
            </div>
          </aside>
          </div>
        </div>
      </section>
    </>
  )
}

const landingCSS = `
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

:root{
  --c-primary:#0F71FD;
  --c-accent:#10B981;
  --c-text:#0F172A;
  --c-muted:#475569;
  --c-bg:transparent;
  --c-card:#FFFFFF;
  --c-border:rgba(15, 23, 42, 0.12);
  --radius:16px;
  --shadow:0 10px 30px rgba(0,0,0,.06);
  --shadow-sm:0 4px 16px rgba(0,0,0,.06);
  --transition:180ms cubic-bezier(.2,.8,.2,1);
}

body {
  background: linear-gradient(to bottom, #ffffff 0%, #f0f7ff 100%) !important;
  background-attachment: fixed !important;
}

html {
  background: linear-gradient(to bottom, #ffffff 0%, #f0f7ff 100%) !important;
  background-attachment: fixed !important;
}

.section{padding: clamp(48px, 7vw, 96px) 0; background: transparent !important;}
.section-head{max-width:900px; margin:0 auto 28px auto; text-align:center}
.section-head h2{margin:0 0 8px 0; font-size:clamp(28px, 4.2vw, 40px); line-height:1.15;}
.section-head p{margin:0; color:var(--c-muted)}

.container{
  width:100%;
  max-width:1400px;
  margin:0 auto;
  padding:0 clamp(16px, 4vw, 32px);
}

.hero{padding-top: clamp(24px, 3vw, 48px)}
.hero-inner{display:grid; gap:28px; align-items:center; grid-template-columns:1fr}
.hero-copy .sub{font-size:clamp(16px, 2.4vw, 20px); color:var(--c-muted); margin:0 0 14px 0}
.hero-actions{display:flex; gap:12px; flex-wrap:wrap}
.badges{display:flex; gap:10px; margin:18px 0 0 0; padding:0; list-style:none; flex-wrap:wrap}
.badges li{background:white; border:1px solid var(--c-border); padding:8px 12px; border-radius:999px; font-weight:700;}
.badges li a{color:inherit; transition:opacity var(--transition); cursor:pointer;}
.badges li a:hover{opacity:.7;}
.hero-media img{object-fit:contain; width:100%; height:auto; max-height:700px}
@media (min-width: 980px){ .hero-inner{grid-template-columns: 1.15fr .85fr} }

.card{background:var(--c-card); border:1px solid var(--c-border); border-radius:var(--radius); box-shadow:var(--shadow); padding:18px; transition:transform var(--transition), box-shadow var(--transition), border-color var(--transition);}
.card:hover{transform:translateY(-2px); box-shadow:0 14px 34px rgba(0,0,0,.08); border-color:rgba(14,165,233,.35)}
.grid-3{display:grid; gap:24px; grid-template-columns:1fr}
.grid-6{display:grid; gap:16px; grid-template-columns:1fr 1fr}
@media (min-width: 900px){ .grid-3{grid-template-columns:repeat(3, 1fr)} .grid-6{grid-template-columns:repeat(3, 1fr)} }
@media (min-width: 1200px){ .grid-6{grid-template-columns:repeat(6, 1fr)} }

.steps{display:grid; gap:16px; grid-template-columns:1fr; counter-reset: step}
.step{display:grid; gap:8px; padding:20px}
.step .step-icon{filter: drop-shadow(0 2px 8px rgba(14,165,233,.25))}
.steps .step h3{margin-top:4px}
@media (min-width: 900px){ .steps{grid-template-columns:repeat(3,1fr)} }

.benefit{display:grid; gap:10px; text-align:left}
.benefit .benefit-icon{width:40px; height:40px; display:grid; place-items:center; background:rgba(16,185,129,.15); color:#065F46; border-radius:12px; font-weight:900;}

.course-media img{width:100%; height:auto; aspect-ratio: 16/10; object-fit:cover}
.course-title{margin:2px 0 8px}
.course-body{padding:6px 2px 8px 2px}
.course-meta{display:flex; align-items:center; gap:8px; color:var(--c-muted)}
.pill{display:inline-flex; align-items:center; height:28px; padding:0 10px; border-radius:999px; background:rgba(14,165,233,.12); color:#0b77a1; font-weight:800; font-size:13px;}
.dot{opacity:.4}
.course-actions{padding-top:6px}

.plan{position:relative; padding:32px 24px; display:flex; flex-direction:column; height:100%; border:1px solid rgba(255, 255, 255, 0.3); background:rgba(255, 255, 255, 0.6); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border-radius:32px; box-shadow:0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);}
.plan:hover{transform:translateY(-8px); box-shadow:0 20px 40px rgba(15, 98, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6); border-color:rgba(15, 98, 254, 0.3);}
.plan--highlight{background:rgba(240, 247, 255, 0.7); border:2px solid rgba(15, 98, 254, 0.4); box-shadow:0 12px 32px rgba(15, 98, 254, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6); position:relative; overflow:hidden;}
.plan--highlight::before{content:""; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%); background-size:200% auto; animation:shimmer 3s ease-in-out infinite;}
.tag{position:absolute; top:16px; right:16px; background:linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%); color:#fff; border-radius:999px; font-weight:800; padding:8px 14px; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(15, 98, 254, 0.3); z-index:2;}
.plan-name{font-size:clamp(24px, 3vw, 32px); margin:0 0 12px 0; font-weight:900; letter-spacing:-0.02em; background:linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s ease-in-out infinite; font-family:'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive, sans-serif;}
.plan-note{font-size:14px; margin:0 0 24px 0; color:var(--c-muted); font-weight:500;}
.plan-list{list-style:none; margin:0 0 32px 0; padding:0; display:grid; gap:14px; flex-grow:1;}
.plan-list li{display:flex; gap:12px; align-items:flex-start; font-size:15px; line-height:1.6; color:var(--c-text);}
.check{color:var(--c-accent); font-weight:900; font-size:18px; min-width:20px; margin-top:2px;}
.plan-btn:hover{transform:none !important;}
.plan-btn:active{transform:none !important;}

.accordion{display:grid; gap:16px}
.accordion-item{
  border:1px solid rgba(255, 255, 255, 0.3);
  border-radius:20px;
  background:rgba(255, 255, 255, 0.6);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  box-shadow:0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.accordion-item:hover{
  transform:translateY(-2px);
  box-shadow:0 12px 40px rgba(15, 98, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-color:rgba(15, 98, 254, 0.3);
}
.accordion-trigger{
  width:100%;
  border:0;
  background:transparent;
  text-align:left;
  padding:18px 20px;
  cursor:pointer;
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-weight:800;
  font-family:Arial, sans-serif;
  font-size:clamp(16px, 2vw, 20px);
  color:#0F62FE;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin:center;
}
.accordion-trigger:hover, .accordion-trigger:active{transform:none; color:#0F62FE}
.accordion-trigger:focus-visible{outline:2px solid rgba(15, 98, 254, 0.6); border-radius:20px}
.chev{transition:transform var(--transition); color:#0F62FE}
.accordion-item.open .chev{transform:rotate(180deg)}
.accordion-panel{
  padding:0 20px 18px 20px;
  color:var(--c-muted);
  display:none;
  font-family:Arial, sans-serif;
  font-size:clamp(15px, 1.8vw, 18px);
  line-height:1.7;
}
.accordion-item.open .accordion-panel{display:block}

.contact-inner{display:grid; gap:32px; align-items:start; grid-template-columns:1fr; padding:clamp(24px, 4vw, 48px) 0;}
.contact-form-glass{
  background:rgba(255, 255, 255, 0.6);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border:1px solid rgba(255, 255, 255, 0.3);
  border-radius:32px;
  padding:clamp(32px, 5vw, 48px);
  box-shadow:0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.contact-field{display:grid; gap:10px; margin-bottom:24px;}
.contact-field label{
  font-weight:700;
  font-size:clamp(14px, 1.8vw, 16px);
  color:#0F172A;
  display:flex;
  align-items:center;
  font-family:Arial, sans-serif;
}
.contact-field input, .contact-field textarea{
  width:100%;
  border:2px solid rgba(15, 98, 254, 0.2);
  border-radius:16px;
  padding:14px 18px;
  font:inherit;
  font-size:clamp(14px, 1.8vw, 16px);
  background:rgba(255, 255, 255, 0.8);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family:Arial, sans-serif;
}
.contact-field input:focus, .contact-field textarea:focus{
  outline:none;
  border-color:#0F62FE;
  box-shadow:0 0 0 4px rgba(15, 98, 254, 0.15);
  background:rgba(255, 255, 255, 0.95);
  transform:translateY(-2px);
}
.contact-field textarea{resize:vertical; min-height:120px;}
.contact-submit:hover{transform:none !important; box-shadow:none !important;}
.contact-aside-glass{
  background:rgba(255, 255, 255, 0.6);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border:1px solid rgba(255, 255, 255, 0.3);
  border-radius:32px;
  padding:clamp(32px, 5vw, 48px);
  box-shadow:0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.contact-info-list{
  list-style:none;
  margin:0 0 32px 0;
  padding:0;
  display:grid;
  gap:20px;
}
.contact-info-list li{
  display:flex;
  gap:16px;
  align-items:flex-start;
  padding:16px;
  background:rgba(255, 255, 255, 0.5);
  border-radius:16px;
  border:1px solid rgba(15, 98, 254, 0.1);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.contact-icon{
  font-size:28px;
  line-height:1;
  flex-shrink:0;
  filter:drop-shadow(0 2px 4px rgba(15, 98, 254, 0.2));
}
.contact-info-list li div{
  display:flex;
  flex-direction:column;
  gap:4px;
}
.contact-info-list li strong{
  font-weight:700;
  font-size:clamp(14px, 1.8vw, 16px);
  color:#0F172A;
  font-family:Arial, sans-serif;
}
.contact-info-list li span{
  font-size:clamp(13px, 1.6vw, 15px);
  color:#475569;
  font-family:Arial, sans-serif;
}
.socials-enhanced{margin-top:24px;}
.social-glass{
  display:flex;
  align-items:center;
  gap:8px;
  padding:12px 18px;
  background:rgba(255, 255, 255, 0.6);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  border:1px solid rgba(15, 98, 254, 0.2);
  border-radius:16px;
  text-decoration:none;
  color:#0F172A;
  font-weight:600;
  font-size:clamp(13px, 1.6vw, 15px);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family:Arial, sans-serif;
}
@media (min-width: 980px){ 
  .contact-inner > div{grid-template-columns: 1.2fr .8fr !important;} 
  .contact-form-glass, .contact-aside-glass{height:100%;}
}

.hero-image-small {
  width: 350px !important;
  max-width: 350px !important;
}

@media (max-width: 768px) {
  .section > .container > div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }
  .section > .container > div[style*="grid-template-columns: 1fr 1fr"] > div:first-child {
    order: 2;
  }
  .section > .container > div[style*="grid-template-columns: 1fr 1fr"] > div:last-child {
    order: 1;
  }
  .hero-image-small {
    width: 250px !important;
    max-width: 250px !important;
  }
}

.btn{
  --ring:0 0 0 0 rgba(14,165,233,.35);
  display:inline-flex; align-items:center; justify-content:center;
  height:42px; padding:0 16px; border-radius:12px;
  border:1px solid var(--c-border); cursor:pointer; font-weight:800;
  transition:transform 60ms ease, box-shadow var(--transition), background var(--transition), color var(--transition), border-color var(--transition);
  box-shadow:var(--shadow-sm);
  transform-origin:center;
  text-decoration:none;
  color:inherit;
}
.btn.large{height:48px; padding:0 20px}
.btn:hover, .btn:active, .btn:focus-visible{transform:scale(.9)}
.btn:focus-visible{outline:none; box-shadow:0 0 0 3px rgba(14,165,233,.25)}
.btn.primary{background:var(--c-primary); color:white; border-color:var(--c-primary);}
.btn.ghost{background:white; color:var(--c-text);}
.btn[disabled]{opacity:.6; cursor:not-allowed}
`
