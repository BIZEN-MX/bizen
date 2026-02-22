"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LandingWaitlistFooter } from "@/components/LandingWaitlistFooter"
import { ClipboardCheck, LogIn, ChevronRight, Play, UserPlus, Calendar, User } from "lucide-react"
import * as React from "react"
import Hero3DScene from "@/components/landing/Hero3DScene"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

const modalInputStyle = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "15px",
  borderRadius: "12px",
  background: "#fff",
  border: "1px solid #e2e8f0",
  color: "#1e293b",
  fontFamily: "inherit",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
  outline: "none",
  textAlign: "center" as const
}

export default function WelcomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMouthOpen, setIsMouthOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeHeroCard, setActiveHeroCard] = useState<number | null>(null)
  const [activeProfile, setActiveProfile] = useState<"docentes" | "estudiantes" | "padres">("docentes")
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (authDropdownOpen && !target.closest('.auth-dropdown-wrapper')) {
        setAuthDropdownOpen(false);
      }
    }
    window.addEventListener("click", handleClickOutside)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClickOutside)
    }
  }, [authDropdownOpen])

  const heroCardSummaries: { title: string; summary: string }[] = [
    {
      title: "Finanzas personales",
      summary: "Aprendemos a controlar ingresos, gastos y deudas con cosas simples como presupuesto y hábitos.",
    },
    {
      title: "Simuladores financieros",
      summary: "Probamos escenarios (crédito, inversión, ahorro) para ver resultados sin arriesgar dinero real.",
    },
    {
      title: "Plan de ahorro",
      summary: "Definimos una meta y un monto mensual para ahorrar con orden y constancia.",
    },
  ]

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)

    const mouthInterval = setInterval(() => {
      setIsMouthOpen(prev => !prev)
    }, 400)

    return () => clearInterval(mouthInterval)
  }, [])

  // Reveal-on-scroll: add .revealed when .reveal-element enters viewport
  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return
    const els = document.querySelectorAll(".reveal-element")
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed")
        })
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const gradientStyle = { background: "linear-gradient(180deg, #ffffff 0%, rgba(0, 86, 231, 0.03) 18%, rgba(0, 86, 231, 0.05) 40%, rgba(25, 131, 253, 0.08) 60%, rgba(25, 131, 253, 0.1) 100%)", backgroundAttachment: "scroll" as const, overflow: "visible" }

  return (
    <div style={{
      background: "#ffffff",
      flex: 1,
      width: "100%",
      minWidth: "100%",
      maxWidth: "100%",
      margin: 0,
      padding: 0,
      overflowX: "hidden",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }} className="main-page-container landing-page-root" data-landing-root>
      {/* Header: pill nav design matching reference screenshot */}
      <header className="main-header landing-header glass-header" style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "clamp(10px, 1.5vw, 16px) 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: "none",
      }}>
        <div className="landing-header-container" style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "0 clamp(20px, 4vw, 48px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }} aria-label="BIZEN home">
            <span style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: "#0056E7", fontFamily: "'Open Sans', system-ui, -apple-system, sans-serif", letterSpacing: "0.01em" }}>BIZEN</span>
          </Link>

          {/* Hamburger (mobile only) */}
          <button type="button" className="landing-header-mobile-menu-btn" aria-label="Abrir menú" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((o) => !o)} style={{ display: "none", alignItems: "center", justifyContent: "center", width: 44, height: 44, padding: 0, border: "none", background: "transparent", cursor: "pointer", color: "#0056E7", order: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>

          {/* Centered pill nav */}
          <nav className="header-bar-nav landing-header-nav" style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "#ffffff",
            borderRadius: "9999px",
            padding: "6px 8px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
            flexShrink: 0,
          }}>
            <Link href="/" className="header-nav-link landing-header-nav-link" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", fontWeight: 500, color: "#0056E7", fontFamily: "'Open Sans', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap", padding: "8px 12px", borderRadius: "9999px" }}>Inicio</Link>
            <Link href="#sobre-bizen" className="header-nav-link landing-header-nav-link" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", fontWeight: 500, color: "#0056E7", fontFamily: "'Open Sans', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap", padding: "8px 12px", borderRadius: "9999px" }}>Somos BIZEN</Link>
            <Link href="#perfiles" className="header-nav-link landing-header-nav-link" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", fontWeight: 500, color: "#0056E7", fontFamily: "'Open Sans', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap", padding: "8px 12px", borderRadius: "9999px" }}>Perfil educativo</Link>
            <Link href="#impacto" className="header-nav-link landing-header-nav-link" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", fontWeight: 500, color: "#0056E7", fontFamily: "'Open Sans', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap", padding: "8px 12px", borderRadius: "9999px" }}>Impacto social</Link>
            <Link href="#problema" className="header-nav-link landing-header-nav-link" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", fontWeight: 500, color: "#0056E7", fontFamily: "'Open Sans', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap", padding: "8px 12px", borderRadius: "9999px" }}>Blog</Link>
          </nav>

          {/* Header Actions */}
          <div className="landing-header-actions" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {/* Agendar DEMO */}
            <a
              href="https://calendly.com/diego-bizen"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-header-demo landing-header-actions-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                fontSize: "clamp(13px, 1.3vw, 15px)",
                fontWeight: 600,
                color: "#0056E7",
                textDecoration: "none",
                borderRadius: "9999px",
                background: "rgba(0, 86, 231, 0.08)",
                transition: "all 0.2s ease",
              }}
            >
              <Calendar size={16} />
              <span className="hide-tablet">Agendar DEMO</span>
            </a>

            {/* Comenzar ahora with Dropdown */}
            <div className={`auth-dropdown-wrapper ${authDropdownOpen ? 'is-open' : ''}`}>
              <button
                className="premium-button landing-header-actions-main"
                onClick={(e) => {
                  e.stopPropagation();
                  setAuthDropdownOpen(!authDropdownOpen);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 24px",
                  fontSize: "clamp(13px, 1.3vw, 15px)",
                  fontWeight: 600,
                  borderRadius: "9999px",
                  background: "#0056E7",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(0, 86, 231, 0.35)",
                }}
              >
                Comenzar ahora
              </button>
              <div className="auth-dropdown-content" style={{
                opacity: authDropdownOpen ? 1 : 0,
                visibility: authDropdownOpen ? "visible" : "hidden",
                transform: authDropdownOpen ? "translateY(0)" : "translateY(10px)",
              }}>
                <Link href="/login" className="auth-dropdown-item">
                  <LogIn size={18} />
                  <span>Iniciar sesión</span>
                </Link>
                <Link href="/signup" className="auth-dropdown-item">
                  <UserPlus size={18} />
                  <span>Crear cuenta</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <div
          className="landing-mobile-nav-overlay"
          role="dialog"
          aria-label="Menú de navegación"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0, 86, 231, 0.95)", // More premium blue overlay
            backdropFilter: "blur(12px)", // Modern blur
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="landing-mobile-nav-drawer"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "40px 24px",
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: 44,
                  height: 44,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "32px"
                }}
              >
                ×
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "20px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>Inicio</Link>
              <Link href="#sobre-bizen" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "20px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>Somos BIZEN</Link>
              <Link href="#perfiles" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "20px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>Perfil educativo</Link>
              <Link href="#impacto" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "20px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>Impacto social</Link>
              <Link href="#problema" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "20px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>Blog</Link>

              <div style={{ height: "1px", width: "100%", background: "rgba(255,255,255,0.1)", margin: "10px 0" }} />

              <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ width: "100%", fontSize: "18px", color: "#fff", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", background: "rgba(255,255,255,0.1)", padding: "14px", borderRadius: "12px" }}>
                <LogIn size={20} />
                Iniciar sesión
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} style={{ width: "100%", fontSize: "18px", color: "#0056E7", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", background: "#fff", padding: "14px", borderRadius: "12px" }}>
                <UserPlus size={20} />
                Crear cuenta
              </Link>
              <a href="https://calendly.com/diego-bizen" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} style={{ width: "100%", fontSize: "16px", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
                <Calendar size={18} />
                Agendar demo
              </a>
            </nav>
          </div>
        </div>
      )}

      <main className="landing-main" style={{ flex: 1, width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column", overflow: "visible", overflowY: "visible", overflowX: "hidden" }}>
        <div className="landing-gradient-wrapper" style={gradientStyle}>
          {/* Hero Section - centered text with geometric shapes */}
          <div className="landing-hero-wrapper" style={{
            paddingTop: "clamp(80px, 12vw, 160px)",
            paddingBottom: "clamp(60px, 10vw, 120px)",
            position: "relative",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            minHeight: "auto",
            overflow: "visible",
            isolation: "isolate"
          }}>
            <Hero3DScene />

            {/* Mascot leaning out from the left - updated character */}
            <div className="landing-hero-mascot reveal-element" style={{
              position: "absolute",
              left: 0,
              top: "clamp(80px, 14vw, 200px)", // Precisely aligned with the main title top
              zIndex: 0,
              width: "clamp(250px, 25vw, 450px)",
              transform: "translateX(0)", // Show 100% of the image
              pointerEvents: "none",
              transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
              opacity: 0,
            }}>
              <style dangerouslySetInnerHTML={{
                __html: `
                .landing-hero-mascot.revealed {
                  opacity: 1 !important;
                  transform: translateX(0) translateY(0) !important;
                }
                @media (max-width: 1023px) {
                  .landing-hero-mascot {
                    width: 200px !important;
                    top: 140px !important;
                  }
                }
                @media (max-width: 768px) {
                  .landing-hero-mascot {
                    width: 140px !important;
                    top: 110px !important;
                  }
                }
              `}} />
              <Image
                src="/bizen-mascot.png"
                alt="Bizen Mascot"
                width={600}
                height={600}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  filter: "drop-shadow(20px 0 30px rgba(44, 123, 239, 0.15))"
                }}
              />
            </div>

            {/* Right side image leaning out - image.png */}
            <div className="landing-hero-right-mascot reveal-element" style={{
              position: "absolute",
              right: 0,
              bottom: "clamp(100px, 10vw, 200px)", // Using bottom for more consistent lowering
              zIndex: 0,
              width: "clamp(240px, 24vw, 460px)",
              transform: "translateX(35%)", // Start further out
              pointerEvents: "none",
              transition: "all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)",
              opacity: 0,
            }}>
              <style dangerouslySetInnerHTML={{
                __html: `
                .landing-hero-right-mascot.revealed {
                  opacity: 1 !important;
                  transform: translateX(25%) translateY(0) !important; // Hide 1/4 (25%)
                }
                @media (max-width: 1023px) {
                  .landing-hero-right-mascot {
                    width: 200px !important;
                    bottom: 80px !important;
                    top: auto !important;
                    transform: translateX(25%) !important;
                  }
                }
                @media (max-width: 768px) {
                  .landing-hero-right-mascot {
                    width: 140px !important;
                    bottom: 60px !important;
                    top: auto !important;
                    transform: translateX(25%) !important;
                  }
                }
              `}} />
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/image.png"
                  alt="Bizen Platform"
                  width={700}
                  height={700}
                  priority
                  style={{
                    width: "100%",
                    height: "auto",
                    filter: "drop-shadow(-20px 0 40px rgba(44, 123, 239, 0.2))",
                    display: "block"
                  }}
                />
              </div>
            </div>



            {/* Main content - centered */}
            <div className="landing-hero-content reveal-element" style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              width: "100%",
              maxWidth: "min(90%, 1100px)",
              margin: "clamp(32px, 5vw, 64px) auto 0",
              padding: "0 clamp(20px, 4vw, 40px)",
              boxSizing: "border-box",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.3s",
            }}>
              {/* Main headline */}
              <h1 style={{
                fontSize: "clamp(32px, 6vw, 64px)",
                color: "#000",
                fontWeight: 700,
                margin: "0 0 clamp(48px, 7vw, 80px) 0",
                lineHeight: 1.2,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.02em",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}>
                <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>El futuro de la <span style={{ color: "#0056E7" }}>Educación Financiera</span></span><br />
                para jóvenes en un click<br />
                con <span className="brand-highlight-blue">BIZEN</span>
              </h1>

              {/* Subheading with highlighted text - responsive, never overlaps */}
              <p className="landing-hero-sub" style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#374151",
                fontWeight: 400,
                margin: "0 auto",
                marginTop: "clamp(64px, 10vw, 120px)",
                marginBottom: "clamp(24px, 4vw, 48px)",
                lineHeight: 1.6,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                maxWidth: "900px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                boxSizing: "border-box",
              }}>
                LA PLATAFORMA EDUCATIVA QUE COMBINA <span style={{ color: "#000000", fontWeight: 800 }}>GAMIFICACIÓN E INTELIGENCIA ARTIFICIAL</span> PARA ENSEÑAR FINANZAS PERSONALES A ESTUDIANTES DE PREPARATORIA Y UNIVERSIDAD DE FORMA PRÁCTICA, CLARA Y RELEVANTE.
              </p>
            </div>

            {/* Company logos section - carousel (spacing keeps it clear of sub text on small screens) */}
            <div className="landing-hero-logos-wrap" style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "min(90%, 1200px)",
              margin: "clamp(80px, 12vw, 140px) auto 0",
              textAlign: "center",
            }}>
              <p style={{
                fontSize: "clamp(14px, 1.5vw, 18px)",
                color: "#6b7280",
                fontWeight: 500,
                margin: "0 0 clamp(24px, 3vw, 40px) 0",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              }}>
                Empresas que ya confían
              </p>

              {/* Logos carousel */}
              <div style={{ overflow: "hidden", width: "100%" }}>
                <div className="logos-carousel-track" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(40px, 6vw, 80px)",
                  animation: "scroll-logos 30s linear infinite",
                }}>
                  {[...logoCarouselLogos, ...logoCarouselLogos].map((logo, i) => {
                    const isGoogle = logo.src.includes("google");
                    return (
                      <div key={i} style={{
                        flexShrink: 0,
                        height: isGoogle ? "clamp(28px, 3.5vw, 42px)" : "clamp(40px, 5vw, 60px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={isGoogle ? 80 : 120}
                          height={isGoogle ? 40 : 60}
                          style={{ height: "100%", width: "auto", objectFit: "contain" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* SOMOS BIZEN Section — redesigned */}
          <div id="sobre-bizen" style={{
            width: "100%",
            background: "linear-gradient(160deg, #0a1628 0%, #0d1f40 40%, #0056E7 100%)",
            padding: "clamp(72px, 10vw, 120px) clamp(24px, 6vw, 80px) clamp(56px, 8vw, 96px)",
            boxSizing: "border-box",
            position: "relative",
          }}>

            {/* Background decorative blobs */}
            <div style={{ position: "absolute", top: "-80px", right: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(25,131,253,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-60px", left: "-80px", width: "420px", height: "420px", background: "radial-gradient(circle, rgba(1,92,248,0.14) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "40%", left: "38%", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(0,86,231,0.10) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>



              {/* Title */}
              <h2 style={{
                textAlign: "center",
                fontSize: "clamp(40px, 6vw, 76px)",
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                marginBottom: "clamp(24px, 3vw, 36px)",
              }}>
                SOMOS{" "}
                <span style={{
                  background: "linear-gradient(90deg, #60a5fa, #1983FD, #015CF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>BIZEN</span>
              </h2>

              {/* Description */}
              <p style={{
                textAlign: "center",
                fontSize: "clamp(17px, 1.6vw, 22px)",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.8,
                maxWidth: "860px",
                margin: "0 auto clamp(56px, 7vw, 88px)",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
              }}>
                En <strong style={{ color: "#fff", fontWeight: 700 }}>BIZEN</strong> combinamos{" "}
                <strong style={{ color: "#60a5fa" }}>aprendizaje gamificado</strong>{" "}
                para que los alumnos entiendan el dinero practicando, desarrollamos{" "}
                <strong style={{ color: "#60a5fa" }}>competencias reales</strong>{" "}
                a través de decisiones financieras aplicadas al contexto mexicano y generamos{" "}
                <strong style={{ color: "#60a5fa" }}>impacto real</strong>{" "}
                formando jóvenes capaces de organizar su dinero, evitar deudas y generar ingresos desde temprana edad.
              </p>

              {/* Stats row — 3 glowing cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(16px, 2vw, 28px)",
                marginBottom: "clamp(48px, 7vw, 80px)",
              }} className="somos-stats-grid">

                {/* Stat 1 */}
                <div className="somos-stat-card" style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "24px",
                  padding: "clamp(28px, 4vw, 40px) clamp(20px, 3vw, 32px)",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  position: "relative",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}>

                  <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "10px" }}>
                    +50
                  </div>
                  <div style={{ fontSize: "clamp(14px, 1.2vw, 17px)", fontWeight: 700, color: "#60a5fa", fontFamily: "'Inter', sans-serif", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Startups
                  </div>
                  <p style={{ margin: 0, fontSize: "clamp(13px, 1vw, 15px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                    Seleccionados entre +50 startups. Parte del Programa de Incubación de la Secretaría de Desarrollo Económico.
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="somos-stat-card" style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "24px",
                  padding: "clamp(28px, 4vw, 40px) clamp(20px, 3vw, 32px)",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  position: "relative",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}>

                  <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "10px" }}>
                    +10
                  </div>
                  <div style={{ fontSize: "clamp(14px, 1.2vw, 17px)", fontWeight: 700, color: "#60a5fa", fontFamily: "'Inter', sans-serif", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Instituciones
                  </div>
                  <p style={{ margin: 0, fontSize: "clamp(13px, 1vw, 15px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                    Más de 10 instituciones en Querétaro nos respaldan. BIZEN enseña ahorro, inversión y emprendimiento con metodología práctica.
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="somos-stat-card" style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "24px",
                  padding: "clamp(28px, 4vw, 40px) clamp(20px, 3vw, 32px)",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  position: "relative",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}>

                  <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "10px" }}>
                    $25K
                  </div>
                  <div style={{ fontSize: "clamp(14px, 1.2vw, 17px)", fontWeight: 700, color: "#60a5fa", fontFamily: "'Inter', sans-serif", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    USD en créditos
                  </div>
                  <p style={{ margin: 0, fontSize: "clamp(13px, 1vw, 15px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                    Más de 25,000 USD en créditos de Google invertidos en nosotros. Parte de la comunidad EdTech más grande de LATAM.
                  </p>
                </div>

              </div>

              {/* Manifesto bar */}
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "clamp(20px, 3vw, 28px) clamp(24px, 4vw, 48px)",
                textAlign: "center",
                marginBottom: "clamp(40px, 5vw, 64px)",
                backdropFilter: "blur(8px)",
              }}>
                <p style={{ margin: 0, fontSize: "clamp(16px, 1.4vw, 20px)", color: "rgba(255,255,255,0.85)", fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.7 }}>
                  BIZEN enseña <strong style={{ color: "#fff" }}>ahorro, inversión y emprendimiento</strong> con metodología práctica, gamificada y alineada al mundo real.
                </p>
              </div>

              {/* Partner logos strip */}
              <div style={{ textAlign: "center", marginBottom: "clamp(20px, 3vw, 32px)" }}>
                <p style={{ margin: "0 0 24px", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Nos respaldan
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "clamp(32px, 6vw, 72px)",
                  flexWrap: "wrap",
                }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "16px 28px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src="/logos/logo-hex.png" alt="BLOQUE" width={200} height={60} style={{ height: "52px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "16px 28px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src="/logos/logo-queretaro.png" alt="Querétaro" width={140} height={52} style={{ height: "52px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "16px 28px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src="/logos/logo-google.png" alt="Google for Startups" width={160} height={52} style={{ height: "52px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
                  </div>
                </div>
              </div>

            </div>

            <style>{`
              .somos-stat-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 20px 50px rgba(0, 86, 231, 0.25) !important;
                border-color: rgba(25, 131, 253, 0.3) !important;
              }
              @media (max-width: 768px) {
                .somos-stats-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>

          <style>{`
        /* Bento Grid Layout */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, auto);
          gap: 24px;
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .bento-item {
          background: #ffffff;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid rgba(15, 113, 253, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
        }
        .bento-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(15, 113, 253, 0.08);
          border-color: rgba(15, 113, 253, 0.2);
        }
        .bento-item-large {
          grid-column: span 2;
          grid-row: span 2;
        }
        .bento-item-medium {
          grid-column: span 2;
        }
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          .bento-item-large, .bento-item-medium {
            grid-column: span 1;
          }
        }


        /* Magnetic / Premium Button Effects */
        .premium-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative;
          overflow: hidden;
        }
        .premium-button:hover {
          opacity: 0.85;
        }
        .premium-button:active {
          transform: translateY(0) scale(0.98);
        }

        /* Glass Header Scrolled State */
        .glass-header {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .brand-highlight-blue {
          background: linear-gradient(135deg, #0056E7 0%, #015CF8 50%, #1983FD 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
          font-weight: 800;
        }
        
        .main-page-container,
        .main-page-container .section,
        .main-page-container .container {
          font-family: 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        
        /* Keep Inter for bold text if preferred, but user requested Open Sans for non-bold specifically */
        b, strong, h1, h2, h3, .bold-text {
          font-family: 'Inter', sans-serif !important;
        }


        /* Prevent horizontal scroll and redundant behavior */
        html:has([data-landing-root]),
        body:has([data-landing-root]) {
          overflow-x: hidden !important;
          max-width: 100% !important;
        }

        .landing-header-demo:hover {
          opacity: 0.7;
        }

        .auth-dropdown-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .auth-dropdown-content {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 10px;
          background: white;
          min-width: 190px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          border: 1px solid rgba(15, 113, 253, 0.1);
          padding: 8px;
        }
        .auth-dropdown-wrapper:hover .auth-dropdown-content {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .auth-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #0056E7;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        .auth-dropdown-item:hover {
          background: #f1f5f9;
          color: #0056E7;
          transform: translateX(4px);
        }
        
        /* ELIMINATE left gap - force zero padding on ALL layout ancestors (no sidebar on landing) */
        html:has(.main-page-container) body,
        html:has(.main-page-container) body > div,
        html:has(.main-page-container) body > div > div,
        html:has(.main-page-container) body > div > div > div,
        html:has(.main-page-container) .app-shell,
        html:has(.main-page-container) .app-scroll,
        html:has(.main-page-container) .app-main,
        html:has(.main-page-container) main {
          padding-left: 0 !important;
          margin-left: 0 !important;
        }
        /* REMOVE nested scroll - body scrolls, not app-scroll (fixes touchpad scroll capture) */
        html:has(.main-page-container) .app-shell {
          position: static !important;
          inset: auto !important;
          height: auto !important;
          min-height: 100% !important;
          overflow: visible !important;
        }
        html:has(.main-page-container) .app-scroll {
          overflow: visible !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100% !important;
        }

        @media (max-width: 1023px) {
          .landing-header-nav, .hide-tablet {
            display: none !important;
          }
          .landing-header-mobile-menu-btn {
            display: flex !important;
          }
          .landing-header-demo {
            padding: 8px 12px !important;
          }
          .landing-header-container {
            padding: 0 24px !important;
          }
        }
        @media (max-width: 640px) {
          .landing-header-demo {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .landing-header-container {
            padding: 0 20px !important;
          }
          .landing-header-mobile-menu-btn {
            width: 36px !important;
            height: 36px !important;
          }
        }
        html:has(.main-page-container) *,
        .main-page-container *,
        .landing-main *,
        .section *,
        section * {
          overflow-y: visible !important;
        }
        html:has(.main-page-container) .landing-demo-modal-content {
          overflow-y: auto !important;
        }
        html:has(.main-page-container) .main-page-container,
        html:has(.main-page-container) .main-page-container main,
        html:has(.main-page-container) .main-page-container section,
        html:has(.main-page-container) .main-content-wrapper,
        html:has(.main-page-container) .main-header {
          overflow: visible !important;
        }
        .main-page-container { overflow: visible !important; width: 100% !important; max-width: 100% !important; height: auto !important; min-height: 100% !important; }
        .landing-main,
        .main-page-container main,
        main.landing-main { 
          overflow: visible !important; 
          max-width: 100% !important; 
          width: 100% !important; 
          height: auto !important; 
          min-height: auto !important; 
          flex: none !important; 
          display: block !important; 
        }
        .main-page-container main > div,
        .landing-gradient-wrapper,
        .landing-rest-wrapper { 
          overflow: visible !important; 
          max-width: 100% !important; 
          width: 100% !important; 
          height: auto !important;
          box-sizing: border-box !important; 
        }
        .main-content-wrapper { overflow: visible !important; max-width: 100% !important; width: 100% !important; box-sizing: border-box !important; }
        
        /* Override global footer styles from globals.css - ensure footer is NOT sticky */
        footer.main-page-footer,
        .main-page-container footer,
        .main-page-footer {
          position: static !important;
          bottom: auto !important;
          top: auto !important;
          left: auto !important;
          right: auto !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        
        /* Override the global footer rule that applies margin-top: auto */
        .main-page-container footer {
          margin-top: 0 !important;
        }

        /* Top bar: keep header in view, prevent overflow */
        .main-header,
        .landing-header {
          max-width: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
        }
        .main-header .crear-cuenta-button {
          flex-shrink: 0 !important;
        }
        .main-header .header-bar-nav,
        .landing-header-nav {
          min-width: 0 !important;
          flex-shrink: 1 !important;
        }

        /* Nav links: hover */
        .header-nav-link:hover,
        .landing-header-login:hover,
        .landing-header-reunion:hover {
          color: #1e5bb8 !important;
          transition: color 0.2s ease;
        }
        .header-nav-link,
        .landing-header-login,
        .landing-header-reunion {
          transition: color 0.2s ease;
        }

        /* Landing header: mobile menu – show hamburger, hide nav/actions */
        @media (max-width: 1100px) {
          .landing-header-mobile-menu-btn {
            display: flex !important;
          }
          .landing-header-nav,
          .landing-header-actions {
            display: none !important;
          }
        }
        @media (min-width: 1101px) {
          .landing-header-mobile-menu-btn {
            display: none !important;
          }
        }

        /* Hero: 100% responsive – prevent text overlap on small screens */
        @media (max-width: 768px) {
          .landing-hero-wrapper {
            min-height: auto !important;
            padding-top: clamp(24px, 5vw, 48px) !important;
            padding-bottom: clamp(40px, 6vw, 64px) !important;
          }
          .landing-hero-wrapper h1 {
            font-size: clamp(20px, 5.5vw, 32px) !important;
            line-height: 1.25 !important;
            margin-bottom: clamp(16px, 3vw, 24px) !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          .landing-hero-wrapper .landing-hero-sub {
            font-size: clamp(13px, 3.2vw, 16px) !important;
            line-height: 1.55 !important;
            max-width: 100% !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            margin-bottom: 0 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
          }
          .landing-hero-content {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .landing-hero-shapes {
            display: none !important;
          }
          .landing-hero-wrapper .logos-carousel-track {
            gap: clamp(20px, 4vw, 40px) !important;
          }
          .landing-hero-logos-wrap {
            margin-top: clamp(32px, 6vw, 60px) !important;
          }
        }
        @media (max-width: 480px) {
          .landing-hero-wrapper h1 {
            font-size: clamp(18px, 4.8vw, 24px) !important;
          }
          .landing-hero-wrapper .landing-hero-sub {
            font-size: clamp(12px, 3vw, 14px) !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .landing-hero-content {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          .landing-hero-logos-wrap {
            margin-top: clamp(24px, 5vw, 40px) !important;
          }
        }
        @media (max-width: 380px) {
          .landing-hero-wrapper .landing-hero-sub {
            font-size: 11px !important;
            line-height: 1.5 !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }

        /* Crear cuenta button: solid blue, no shimmer */
        .crear-cuenta-button {
          background: #0056E7 !important;
          transition: background 0.2s ease, filter 0.2s ease;
          animation: none !important;
        }
        .crear-cuenta-button:hover {
          background: #0056E7 !important;
          color: #fff !important;
          filter: brightness(1.05);
          transition: background 0.2s ease, filter 0.2s ease;
        }
        /* Header "Agenda tu DEMO": match header link color (text style, not solid button) */
        .landing-header .landing-header-demo.crear-cuenta-button,
        .landing-header-demo.crear-cuenta-button {
          background: transparent !important;
          color: #0056E7 !important;
        }
        .landing-header .landing-header-demo.crear-cuenta-button:hover,
        .landing-header-demo.crear-cuenta-button:hover {
          background: transparent !important;
          color: #1e5bb8 !important;
          filter: none !important;
        }
        .landing-header-quiz {
          background: #0056E7;
          color: #ffffff;
          border-radius: 999px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.02em;
          text-decoration: none;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .landing-header-quiz:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(0, 86, 231, 0.3);
        }
        .landing-header-quiz:focus-visible {
          outline: 2px solid rgba(59, 130, 246, 0.7);
          outline-offset: 2px;
        }

        /* Calendar Tooltip */
        .calendar-tooltip-container {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .calendar-tooltip-text {
          visibility: hidden;
          width: 140px;
          background-color: #0056E7;
          color: #fff;
          text-align: center;
          border-radius: 8px;
          padding: 8px 12px;
          position: absolute;
          z-index: 1001;
          top: 135%;
          left: 50%;
          transform: translateX(-50%) translateY(5px);
          opacity: 0;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 13px;
          font-weight: 500;
          pointer-events: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        .calendar-tooltip-text::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-left: -6px;
          border-width: 6px;
          border-style: solid;
          border-color: transparent transparent #0056E7 transparent;
        }
        .calendar-tooltip-container:hover .calendar-tooltip-text {
          visibility: visible;
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* Tablet and desktop (768px+): show decorative accent, scale header and hero */
        @media (min-width: 768px) {
          .decorative-blue-accent {
            display: block !important;
          }
          .main-header {
            padding: 4px 10px !important;
            gap: 6px !important;
          }
          .main-header a[href="/"] span {
            font-size: 20px !important;
          }
          .main-header .header-bar-nav {
            padding: 4px 10px !important;
            gap: 6px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 15px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 6px 12px !important;
            font-size: 15px !important;
            border-radius: 9999px !important;
          }
          .hero-top-block {
            top: clamp(44px, 5vw, 64px) !important;
            width: min(96vw, 1200px) !important;
            max-width: 1200px !important;
          }
          .hero-tagline {
            font-size: clamp(36px, 6vw, 72px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(18px, 1.15rem, 21px) !important;
            margin-top: 18px !important;
          }
          .hero-rectangles-wrapper {
            margin-top: clamp(112px, 16vw, 220px) !important;
            padding: 0 clamp(24px, 4vw, 40px) !important;
          }
          .hero-rect-row {
            gap: clamp(28px, 4vw, 48px) !important;
            margin-top: clamp(36px, 5vw, 56px) !important;
          }
          .hero-rect-card {
            width: clamp(180px, 24vw, 300px) !important;
            height: clamp(100px, 13vw, 165px) !important;
          }
          .hero-circle-label {
            font-size: clamp(15px, 1.8vw, 20px) !important;
          }
        }

        @media (min-width: 900px) {
          .main-header {
            padding: 6px 12px !important;
            gap: 8px !important;
          }
          .main-header a[href="/"] span {
            font-size: 22px !important;
          }
          .main-header .header-bar-nav {
            padding: 4px 12px !important;
            gap: 8px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 16px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 6px 14px !important;
            font-size: 16px !important;
          }
        }

        @media (min-width: 1024px) {
          .main-header {
            padding: 6px 14px !important;
            gap: 8px !important;
          }
          .main-header a[href="/"] span {
            font-size: 23px !important;
          }
          .main-header .header-bar-nav {
            padding: 4px 14px !important;
            gap: 8px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 17px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 6px 16px !important;
            font-size: 17px !important;
          }
        }

        /* Screens > 1100px: scale up top elements so it doesn't look empty */
        @media (min-width: 1100px) {
          .main-header {
            padding: 6px 16px !important;
            gap: 8px !important;
          }
          .main-header a[href="/"] span {
            font-size: 24px !important;
          }
          .main-header .header-bar-nav {
            padding: 4px 16px !important;
            gap: 8px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 18px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 6px 18px !important;
            font-size: 18px !important;
            border-radius: 9999px !important;
          }
          /* Hero section: bigger tagline, subtext, rectangles and labels */
          .hero-top-block {
            top: clamp(48px, 6vw, 88px) !important;
            max-width: 1280px !important;
            width: min(96vw, 1280px) !important;
          }
          .hero-tagline {
            font-size: clamp(36px, 5vw, 58px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(19px, 1.25rem, 24px) !important;
            margin-top: 20px !important;
          }
          .hero-rect-row {
            gap: clamp(32px, 5vw, 64px) !important;
            margin-top: clamp(40px, 6vw, 72px) !important;
          }
          .hero-rect-card {
            width: clamp(220px, 26vw, 360px) !important;
            height: clamp(123px, 14vw, 195px) !important;
          }
          .hero-circle-label {
            font-size: clamp(16px, 2vw, 22px) !important;
          }
        }
        @media (min-width: 1400px) {
          .main-header {
            padding: 8px 18px !important;
            gap: 10px !important;
          }
          .main-header a[href="/"] span {
            font-size: 26px !important;
          }
          .main-header .header-bar-nav {
            padding: 5px 18px !important;
            gap: 10px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 19px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 8px 18px !important;
            font-size: 19px !important;
          }
        }

        /* Rectangles wrapper - 3 cards in one row, no horizontal scroll (avoids touchpad scroll capture) */
        .hero-rectangles-wrapper {
          width: 100%;
          max-width: 100%;
          margin-top: clamp(96px, 14vw, 180px);
          padding: 0 clamp(24px, 4vw, 48px);
          box-sizing: border-box;
          overflow-x: clip;
          position: relative;
          z-index: 5;
        }
        @media (max-width: 768px) {
          .hero-rectangles-wrapper {
            margin-top: clamp(64px, 12vw, 120px);
            padding: 0 clamp(12px, 4vw, 20px);
          }
          .hero-rect-row {
            flex-wrap: wrap;
            justify-content: center;
            gap: clamp(12px, 3vw, 20px);
            padding: 0 clamp(12px, 3vw, 16px) 8px;
            min-width: 0;
          }
          .hero-rect-card {
            width: clamp(100px, 28vw, 160px);
            height: clamp(64px, 16vw, 100px);
            border-radius: 20px;
          }
          .hero-card-link {
            gap: 8px;
          }
          .hero-circle-label {
            font-size: clamp(11px, 2.5vw, 14px);
            line-height: 1.25;
          }
          .hero-card-summary-text {
            font-size: clamp(11px, 2.2vw, 13px);
          }
        }
        @media (max-width: 480px) {
          .hero-rectangles-wrapper {
            margin-top: clamp(48px, 10vw, 80px);
            padding: 0 12px;
          }
          .hero-rect-row {
            gap: 10px;
            padding: 0 8px 8px;
          }
          .hero-rect-card {
            width: clamp(88px, 26vw, 130px);
            height: clamp(56px, 14vw, 88px);
            border-radius: 16px;
          }
          .hero-circle-label {
            font-size: clamp(10px, 2.4vw, 12px);
          }
        }
        .hero-rect-row {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: flex-start;
          gap: clamp(24px, 4vw, 56px);
          width: max-content;
          max-width: 100%;
          margin: 0 auto;
          min-width: 100%;
          padding: 0 clamp(16px, 3vw, 24px) 12px;
          box-sizing: border-box;
        }
        .hero-card-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-decoration: none;
          flex-shrink: 0;
          cursor: pointer;
        }
        .hero-rect-card {
          width: clamp(200px, 22vw, 320px);
          height: clamp(112px, 12vw, 175px);
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(160deg, #ffffff 0%, #f0f7ff 50%, #e8f4fd 100%);
          border: 2px solid rgba(15, 113, 253, 0.25);
          box-shadow: 
            0 6px 24px rgba(0, 0, 0, 0.08),
            0 2px 12px rgba(15, 113, 253, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: opacity 0.25s ease;
          opacity: 0.88;
        }
        .hero-card-link:hover .hero-rect-card {
          opacity: 1;
        }
        .hero-rect-inner {
          position: relative;
          width: 60%;
          height: 60%;
          transition: opacity 0.25s ease;
        }
        .hero-card-link:hover .hero-rect-inner,
        .hero-card-link.hero-card-summary-visible .hero-rect-inner {
          opacity: 0;
        }
        .hero-circle-label {
          font-size: clamp(14px, 1.8vw, 18px);
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          line-height: 1.4;
        }
        @keyframes hero-bubble-in {
          from {
            opacity: 0;
            transform: scale(0.88);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .hero-card-summary {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 16px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(15, 113, 253, 0.15);
          border: 1px solid rgba(15, 113, 253, 0.2);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          z-index: 2;
          box-sizing: border-box;
        }
        .hero-card-summary-text {
          display: block;
          width: 100%;
          max-width: 100%;
          font-size: clamp(13px, 1.45vw, 17px);
          line-height: 1.35;
          color: #374151;
          text-align: center;
          margin: 0 auto;
        }
        .hero-card-link:hover .hero-card-summary,
        .hero-card-link.hero-card-summary-visible .hero-card-summary {
          opacity: 1;
          visibility: visible;
          animation: hero-bubble-in 0.28s ease-out forwards;
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
        @keyframes bubblePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes scroll-logos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .hero-main-text {
          font-size: clamp(32px, 5vw, 48px) !important;
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        
        .y-mucho-mas-text {
          font-size: clamp(40px, 7vw, 80px) !important;
        }
        
        /* Border flash/thunder effect for Empieza Ya button */
        @keyframes borderFlash {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 24px rgba(0, 86, 231, 0.35);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 12px 32px rgba(0, 86, 231, 0.5);
          }
        }
        
        .empieza-ya-button::before {
          content: "";
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: 
            linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 60%, transparent 100%) 0% 0% / 300% 3px,
            linear-gradient(180deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 60%, transparent 100%) 100% 0% / 3px 300%,
            linear-gradient(270deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 60%, transparent 100%) 100% 100% / 300% 3px,
            linear-gradient(0deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 60%, transparent 100%) 0% 100% / 3px 300%;
          background-repeat: no-repeat;
          border-radius: clamp(10px, 1.5vw, 12px);
          z-index: 0;
          animation: borderFlash 1.5s linear infinite;
        }
        
        .empieza-ya-button::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0056E7;
          border-radius: clamp(7px, 1.2vw, 9px);
          z-index: -1;
        }
        
        .empieza-ya-button {
          background: #0056E7 !important;
          border: 3px solid transparent !important;
          position: relative;
          animation: buttonPulse 2s ease-in-out infinite;
        }
        
        .empieza-ya-button span {
          position: relative;
          z-index: 2;
        }
        
        /* Ensure footer is not sticky/fixed on landing page - all devices */
        .main-page-footer,
        footer.main-page-footer,
        footer[class*="main-page-footer"],
        .main-page-footer[style*="position"],
        footer[style*="position"] {
          position: static !important;
          bottom: auto !important;
          top: auto !important;
          left: auto !important;
          right: auto !important;
        }
        
        /* Override any global footer styles */
        @media (max-width: 768px) {
          .main-page-footer,
          footer.main-page-footer {
            position: static !important;
            bottom: auto !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
          }
        }
        
        @media (min-width: 769px) {
          .main-page-footer,
          footer.main-page-footer {
            position: static !important;
            bottom: auto !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
          }
        }
        
        /* Ensure app layout containers use full width on landing page */
        .app-shell,
        .app-scroll,
        .app-main {
          width: 100% !important;
          max-width: 100% !important;
          background-color: #ffffff !important;
        }
        
        @media (max-width: 768px) {
          /* Header: never sticky on small screens – scrolls with page */
          .main-page-container .main-header {
            position: static !important;
          }
          /* Header fixes for mobile */
          .main-header nav {
            flex-shrink: 1 !important;
          }
          /* Header: muy junto en mobile */
          .main-page-container .main-header {
            padding: 4px 8px !important;
            gap: 4px !important;
          }
          .main-page-container .main-header .header-bar-nav {
            padding: 4px 8px !important;
            gap: 4px !important;
          }
          /* Agendar demo: responsive, touch-friendly */
          .main-header .crear-cuenta-button,
          .crear-cuenta-button {
            padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 14px) !important;
            font-size: clamp(13px, 2vw, 15px) !important;
            white-space: nowrap !important;
            min-height: 44px !important;
          }
          /* Show carousel arrows but they will be repositioned for mobile */
          .landing-carousel-arrow,
          .landing-testimonial-arrow,
          .landing-adventure-arrow {
            display: flex !important;
          }
          .main-page-container .quiero-demo-button {
            padding: clamp(12px, 3vw, 14px) clamp(18px, 4vw, 24px) !important;
            font-size: clamp(14px, 2vw, 16px) !important;
            min-height: 44px !important;
          }
          .main-page-container .quiero-demo-arrow {
            font-size: clamp(14px, 3vw, 18px) !important;
          }
          
          /* Main content fixes */
          .main-content {
            grid-template-columns: 1fr !important;
            gap: clamp(20px, 4vw, 32px) !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .main-content > div:first-child {
            order: 2;
            width: 100% !important;
          }
          .main-content > div:last-child {
            order: 1;
            width: 100% !important;
          }
          
          /* Buttons - shorter on mobile for landing page */
          .main-content a[href="/signup"],
          .main-content a[href="/login"],
          .main-content button[disabled] {
            min-width: auto !important;
            width: auto !important;
            max-width: 70% !important;
            padding-left: clamp(16px, 4vw, 24px) !important;
            padding-right: clamp(16px, 4vw, 24px) !important;
          }
          
          /* Image fixes */
          .main-content > div:first-child {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
          }
          .main-content > div:first-child > div {
            padding: clamp(12px, 3vw, 20px) !important;
            width: auto !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 auto !important;
          }
          .main-content > div:first-child img:not(.billy-image) {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
          }
          
          /* Text fixes */
          .hero-main-text {
            font-size: clamp(18px, 5vw, 32px) !important;
            line-height: 1.3 !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Button fixes */
          .main-content > div:last-child > div:last-child {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .main-content > div:last-child > div:last-child a {
            width: 100% !important;
            min-width: auto !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Footer links horizontal on mobile */
          .footer-links {
            flex-direction: row !important;
            text-align: center !important;
            gap: clamp(8px, 2vw, 16px) !important;
            flex-wrap: wrap !important;
            padding: 0 16px !important;
          }
          
          /* Fix footer gap on mobile - use dynamic viewport and iOS support */
          .main-page-footer {
            position: static !important;
            bottom: auto !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            margin: 0 !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-bottom: max(clamp(16px, 3vw, 24px), env(safe-area-inset-bottom, 0px)) !important;
          }
          
          footer.main-page-footer {
            position: static !important;
            bottom: auto !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            margin-top: 0 !important;
          }
          
          .main-page-container {
            margin: 0 !important;
            padding: 0 !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          /* Ensure footer padding includes safe area - override global footer styles */
          footer.main-page-footer,
          .main-page-container footer {
            position: static !important;
            bottom: auto !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            padding-bottom: env(safe-area-inset-bottom, clamp(16px, 3vw, 24px)) !important;
            margin-bottom: 0 !important;
            margin-top: 0 !important;
          }
          
          /* Hero sections - Stack vertically on mobile (text first, image second) */
          .hero-section-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(24px, 4vw, 40px) !important;
            min-height: auto !important;
          }
          
          .hero-text {
            order: 1 !important;
            width: 100% !important;
            padding: 0 clamp(16px, 4vw, 24px) !important;
            box-sizing: border-box !important;
          }
          
          .hero-image {
            order: 2 !important;
            width: 100% !important;
            padding: 0 clamp(16px, 4vw, 24px) !important;
            box-sizing: border-box !important;
          }
          
          .hero-image img,
          .hero-image-small {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
          }
          
        }
        @media (max-width: 480px) {
          /* Extra small phones */
          .crear-cuenta-button {
            padding: 7px 12px !important;
            font-size: 12px !important;
          }
          .hero-main-text {
            font-size: clamp(16px, 6vw, 24px) !important;
            line-height: 1.2 !important;
          }
          .main-content {
            padding: 12px !important;
            gap: 16px !important;
          }
          .main-content > div:first-child > div {
            padding: 10px !important;
          }
          .main-content > div:last-child > div:last-child a {
            padding: 12px 16px !important;
            font-size: 14px !important;
            min-width: auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        
        /* Fix button width on very small screens (320px-375px) */
        @media (max-width: 375px) {
          .main-content > div:last-child > div:last-child a {
            min-width: auto !important;
            width: 100% !important;
            max-width: calc(100% - 24px) !important;
            padding: 12px 16px !important;
          }
        }
        @media (min-width: 769px) {
          .main-content-wrapper {
            justify-content: flex-start !important;
          }
          .main-content {
            grid-template-columns: 1.1fr 0.9fr !important;
            max-width: clamp(700px, 85vw, 1200px) !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .main-content > div:last-child {
            text-align: center;
          }
          .hero-main-title {
            text-align: center !important;
          }
          .text-and-buttons-container {
            text-align: center !important;
            align-items: center !important;
            padding-left: 0 !important;
            padding-right: clamp(4px, 1vw, 16px) !important;
            max-width: 100% !important;
            margin-left: 0 !important;
          }
          
          .billy-container {
            padding-right: clamp(4px, 1vw, 12px) !important;
          }
          .buttons-container {
            align-items: center !important;
          }
        }
        
        /* Fix for smaller laptop screens (13" MacBook Air, etc.) */
        @media (min-width: 769px) and (max-width: 1440px) {
          /* Ensure content fits on smaller laptop screens */
          .main-content {
            gap: clamp(32px, 6vw, 80px) !important;
          }
          
          /* Main content wrapper - allow content to flow naturally */
          .main-content-wrapper {
            align-items: center !important;
            justify-content: center !important;
            padding-top: clamp(80px, 10vw, 100px) !important;
            padding-bottom: clamp(80px, 10vw, 100px) !important;
            justify-content: center !important;
          }
          
          /* Ensure content is never cut */
          .main-content > div {
            min-height: auto !important;
          }
        }
        
        /* Very small laptop screens (13" MacBook Air) */
        @media (min-width: 769px) and (max-width: 1280px) {
          .main-content {
            gap: clamp(16px, 2.5vw, 40px) !important;
          }
          
          .hero-main-text {
            font-size: clamp(24px, 4vw, 40px) !important;
          }
        }
        @media (min-width: 1025px) {
          /* Desktop - Full width */
          .main-content {
            max-width: 100% !important;
            margin: 0 auto !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .main-content-wrapper {
            padding-top: clamp(80px, 12vw, 120px) !important;
            padding-bottom: clamp(80px, 12vw, 120px) !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .main-content {
            gap: clamp(40px, 6vw, 60px) !important;
          }
          h1 {
            font-size: clamp(32px, 5vw, 48px) !important;
          }
          /* iPad: keep all text fully visible, no clip */
          .section-head h2,
          .section-head p,
          .y-mucho-mas-text,
          .cta-section-grid p,
          .plan-name,
          .plan-note,
          .plan-list li,
          .accordion-trigger,
          .accordion-panel {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            overflow: visible !important;
          }
        }
        
        /* Billy image - smaller on mobile and iPad */
        @media (max-width: 767px) {
          .billy-container {
            padding: clamp(8px, 2vw, 16px) !important;
            overflow: visible !important;
          }
          
          .billy-container > div[style*="position: absolute"] {
            position: absolute !important;
            z-index: 1000 !important;
            overflow: visible !important;
          }
          
          .main-content-wrapper {
            overflow: visible !important;
          }
          
          #contacto {
            overflow: visible !important;
            position: relative !important;
            z-index: 1 !important;
          }
          
          /* Responsive title styles */
          .main-content h1 {
            font-size: clamp(20px, 5vw, 36px) !important;
            line-height: 1.4 !important;
            color: #6B7280 !important;
            padding: 0 clamp(12px, 3vw, 20px) !important;
          }
          .billy-image,
          .billy-container .billy-image,
          .main-content > div:first-child .billy-image {
            max-width: clamp(180px, 40vw, 280px) !important;
            width: clamp(180px, 40vw, 280px) !important;
            height: auto !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .billy-container {
            padding: clamp(16px, 2.5vw, 32px) !important;
          }
          .billy-image,
          .billy-container .billy-image,
          .main-content > div:first-child .billy-image {
            max-width: clamp(120px, 22vw, 200px) !important;
            width: clamp(120px, 22vw, 200px) !important;
            height: auto !important;
          }
        }
        
      `}</style>

          {/* Landing Page Content - gradient: hero through perfiles */}
          <LandingContent sectionRange="gradient" />
        </div>

        {/* Rest of landing (white background) */}
        <LandingContent sectionRange="rest" />
      </main>
      <section id="impacto" className="section testimonials-section reveal-element" style={{ background: "linear-gradient(160deg, #f0f6ff 0%, #f8fcff 60%, #ffffff 100%)", padding: "clamp(72px, 10vw, 112px) clamp(20px, 4vw, 56px) clamp(40px, 5vw, 64px)", marginBottom: "clamp(12px, 2vw, 24px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(48px, 7vw, 72px)" }}>
            <span style={{
              display: "inline-block", background: "rgba(0,86,231,0.08)", color: "#0056E7",
              borderRadius: "999px", padding: "6px 18px", fontSize: "13px", fontWeight: 700,
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px",
            }}>Testimonios</span>
            <h2 style={{
              textAlign: "center", margin: "0",
              fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 800, color: "#111",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              lineHeight: 1.15, letterSpacing: "-0.02em",
            }}>
              Colegios líderes en México{" "}
              <span style={{ background: "linear-gradient(90deg, #0056E7, #1983FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ya evolucionaron</span>{" "}con BIZEN.
            </h2>
          </div>

          <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ position: "relative", perspective: "1000px", minHeight: "320px" }}>
              {[
                {
                  quote: "Una plataforma increíble para aprender finanzas personales de forma clara y práctica. A mi hijo le encantó.",
                  name: "Gabriela Burgos",
                  title: "Directora de Programas de Emprendimiento · BLOQUE",
                  image: "/uploads/Landing_page/image.png",
                },
                {
                  quote: "Una herramienta excepcional para quienes buscan desarrollar educación financiera de forma práctica.",
                  name: "Alejandro Rolland",
                  title: "Secretaría de Desarrollo Sustentable · Querétaro",
                  image: "/uploads/Landing_page/image%20copy.png",
                },
                {
                  quote: "Una plataforma innovadora que acerca las finanzas personales de manera sencilla y atractiva para jóvenes.",
                  name: "Joanna Vazquez",
                  title: "Coordinadora Universidad · Mondragón México",
                  image: "/uploads/Landing_page/joanna.png",
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    opacity: activeTestimonial === idx ? 1 : 0,
                    transform: activeTestimonial === idx ? "translateX(0)" : idx < activeTestimonial ? "translateX(-36px)" : "translateX(36px)",
                    pointerEvents: activeTestimonial === idx ? "auto" : "none",
                    transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    zIndex: activeTestimonial === idx ? 2 : 1,
                  }}
                  className="testimonial-card-animate"
                >
                  <div className="testimonial-premium-card" style={{
                    background: "#fff",
                    borderRadius: "28px",
                    padding: "clamp(28px, 4vw, 48px)",
                    border: "1px solid rgba(0, 86, 231, 0.1)",
                    boxShadow: "0 16px 48px rgba(0, 86, 231, 0.08), 0 2px 8px rgba(0,0,0,0.04)",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "clamp(24px, 4vw, 40px)",
                    alignItems: "flex-start",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #0056E7, #1983FD)" }} />
                    <div style={{
                      width: "clamp(96px, 13vw, 140px)",
                      height: "clamp(96px, 13vw, 140px)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                      boxShadow: "0 8px 24px rgba(0,86,231,0.15)",
                      border: "3px solid rgba(0,86,231,0.12)",
                    }}>
                      <Image src={testimonial.image} alt={testimonial.name} fill style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "14px" }}>
                        {[0, 1, 2, 3, 4].map(s => (
                          <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        ))}
                      </div>
                      <p style={{ margin: "0 0 20px", fontSize: "clamp(15px, 1.1vw, 18px)", lineHeight: 1.7, color: "#1e293b", fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
                        "{testimonial.quote}"
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "32px", height: "2px", background: "linear-gradient(90deg,#0056E7,#1983FD)", borderRadius: "2px" }} />
                        <div>
                          <p style={{ margin: 0, fontSize: "clamp(14px, 1rem, 16px)", fontWeight: 700, color: "#111" }}>{testimonial.name}</p>
                          <p style={{ margin: "3px 0 0", fontSize: "clamp(12px, 0.85rem, 14px)", color: "#64748b" }}>{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-nav-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", width: "max-content", margin: "40px auto 0" }}>
              <button
                type="button"
                className="landing-carousel-arrow prev"
                aria-label="Anterior"
                onClick={() => setActiveTestimonial(prev => prev === 0 ? 2 : prev - 1)}
                style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(0, 86, 231, 0.1)", border: "1.5px solid rgba(0, 86, 231, 0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0056E7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                {[0, 1, 2].map(idx => (
                  <button key={idx} onClick={() => setActiveTestimonial(idx)} style={{ width: activeTestimonial === idx ? "32px" : "12px", height: "12px", borderRadius: "6px", background: activeTestimonial === idx ? "#0056E7" : "rgba(0,86,231,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s ease" }} aria-label={`Testimonio ${idx + 1}`} />
                ))}
              </div>
              <button
                type="button"
                className="landing-carousel-arrow next"
                aria-label="Siguiente"
                onClick={() => setActiveTestimonial(prev => prev === 2 ? 0 : prev + 1)}
                style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#0056E7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(0, 86, 231, 0.3)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section> {/* TESTIMONIALS FIX VERIFIED */}
      <LandingWaitlistFooter />
      {/* Blue Dot Cursor */}
      <div
        className="blue-dot-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "20px",
          height: "20px",
          background: "#0056E7",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: `translate3d(${mousePos.x - 10}px, ${mousePos.y - 10}px, 0)`,
          boxShadow: "0 0 15px rgba(37, 99, 235, 0.4)",
          transition: "transform 0.05s ease-out"
        }}
      />
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

const logoCarouselLogos: { src: string; alt: string }[] = [
  { src: "/logos/logo-imef.png", alt: "IMEF Ejecutivos de Finanzas" },
  { src: "/logos/logo-mondragon.png", alt: "Universidad Mondragón México" },
  { src: "/logos/logo-google.png", alt: "Google" },
  { src: "/logos/logo-queretaro.png", alt: "Querétaro - Juntos, Adelante" },
  { src: "/logos/logo-hex.png", alt: "Partner" },
  { src: "/logos/logo-balmoral.png", alt: "Balmoral Escocés Preparatoria" },
]

const problemSchools: { title: string; description: string }[] = [
  { title: "Teoría sin práctica", description: "Se enseña el concepto pero no se practica con casos reales." },
  { title: "Difícil medir avance", description: "No hay forma clara de ver el progreso de cada estudiante." },
  { title: "Falta de tiempo del docente", description: "Los profesores no tienen tiempo para personalizar la enseñanza." },
]
const howItWorksSteps: { title: string; schoolsText: string }[] = [
  { title: "Empiezo", schoolsText: "El colegio crea grupos y accesos." },
  { title: "Practico", schoolsText: "Los estudiantes usan simuladores y retos en clase." },
  { title: "Mido mi progreso", schoolsText: "El docente ve reportes y avance por alumno." },
]

const defaultFaqs: FAQ[] = [
  {
    q: "¿Qué es BIZEN?",
    a: "Una plataforma de e-learning en finanzas con cursos cortos, retos y recompensas para aprender de forma práctica.",
  },
  {
    q: "¿Para quién es?",
    a: "Para escuelas, universidades y organizaciones educativas que quieren ofrecer educación financiera práctica a sus estudiantes.",
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

function LandingContent({ sectionRange = 'all' }: { sectionRange?: 'gradient' | 'rest' | 'all' }) {
  const primary = "#0056E7"
  const accent = "#10B981"
  const [activeProfile, setActiveProfile] = React.useState<"docentes" | "estudiantes" | "padres">("docentes")
  const [activeAdventureSlide, setActiveAdventureSlide] = React.useState(0)

  return (
    <>
      <style>{landingCSS}</style>
      {(sectionRange === 'all' || sectionRange === 'gradient') && (<>

        {/* Somos BIZEN - 4 blue cards */}

        {/* 4 Perfiles Educativos */}
        <section id="perfiles" className="section perfiles-section reveal-element" style={{
          background: "linear-gradient(160deg, #f0f6ff 0%, #fafcff 60%, #ffffff 100%)",
          paddingTop: "clamp(48px, 6vw, 80px)",
          paddingBottom: "clamp(64px, 10vw, 100px)",
          paddingLeft: "clamp(16px, 4vw, 24px)",
          paddingRight: "clamp(16px, 4vw, 24px)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative Blobs for Depth */}
          <div className="perfiles-blob perfiles-blob-1" style={{ position: "absolute", top: "10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0, 86, 231, 0.10) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, animation: "float-perfiles 15s infinite alternate" }} />
          <div className="perfiles-blob perfiles-blob-2" style={{ position: "absolute", bottom: "5%", left: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0, 86, 231, 0.06) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0, animation: "float-perfiles-reverse 20s infinite alternate" }} />

          <div className="container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 56px)" }}>
              <span style={{
                display: "inline-block",
                background: "rgba(0, 86, 231, 0.08)",
                color: "#0056E7",
                borderRadius: "999px",
                padding: "6px 18px",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}>Para cada miembro de la comunidad educativa</span>
              <h2 style={{
                textAlign: "center",
                fontSize: "clamp(36px, 5vw, 62px)",
                fontWeight: 800,
                color: "#111",
                lineHeight: 1.15,
                marginBottom: "clamp(12px, 2vw, 16px)",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.02em",
              }}>
                1 solución,{" "}
                <span style={{
                  background: "linear-gradient(90deg, #0056E7, #1983FD)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>4 perfiles educativos</span>.
              </h2>
              <p style={{ margin: "0 auto", maxWidth: "480px", fontSize: "clamp(17px, 1.3vw, 20px)", color: "#64748b", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                Un clic que adapta toda la experiencia a quién eres.
              </p>
            </div>

            {/* Content Card - enhanced */}
            <div className="glass-card-premium" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "36px",
              padding: "clamp(32px, 4vw, 48px) clamp(28px, 4vw, 56px) clamp(40px, 5vw, 64px)",
              boxShadow: "0 24px 64px rgba(0, 86, 231, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(0, 86, 231, 0.12)",
              position: "relative",
              zIndex: 1,
            }}>
              {/* Tabs */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "clamp(36px, 5vw, 52px)",
                flexWrap: "wrap",
                background: "rgba(0, 86, 231, 0.04)",
                borderRadius: "20px",
                padding: "6px",
                border: "1px solid rgba(0, 86, 231, 0.08)",
                maxWidth: "480px",
                margin: "0 auto clamp(36px, 5vw, 52px)",
              }}
                className="perfiles-tabs-row"
              >
                {[
                  { id: "docentes" as const, label: "Docentes" },
                  { id: "estudiantes" as const, label: "Estudiantes" },
                  { id: "padres" as const, label: "Padres" },
                ].map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setActiveProfile(profile.id)}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      fontSize: "clamp(14px, 1rem, 16px)",
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      border: "none",
                      borderRadius: "14px",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: activeProfile === profile.id ? "#0056E7" : "transparent",
                      color: activeProfile === profile.id ? "#ffffff" : "#64748b",
                      boxShadow: activeProfile === profile.id ? "0 6px 20px rgba(0, 86, 231, 0.25)" : "none",
                    }}
                    className="profile-tab-button"
                  >
                    {profile.label}
                  </button>
                ))}
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(32px, 5vw, 64px)",
                alignItems: "center",
              }}
                className="perfiles-content-grid"
              >
                {/* Left: Text Content - slide animation on tab change */}
                <div className="perfiles-content-left" style={{ overflow: "hidden", position: "relative" }}>
                  <div key={activeProfile} className="perfiles-slide-in">
                    <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                      <span style={{
                        display: "inline-block",
                        background: "linear-gradient(135deg, #0056E7, #1983FD)",
                        color: "#fff",
                        borderRadius: "12px",
                        padding: "6px 16px",
                        fontSize: "13px",
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        marginBottom: "14px",
                      }}>
                        {activeProfile === "docentes" && "Para docentes"}
                        {activeProfile === "estudiantes" && "Para estudiantes"}
                        {activeProfile === "padres" && "Para padres"}
                      </span>
                      <h3 style={{
                        fontSize: "clamp(28px, 3.5vw, 44px)",
                        fontWeight: 800,
                        color: "#111",
                        marginBottom: 0,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                      }}>
                        {activeProfile === "docentes" && "Enseña más con menos esfuerzo"}
                        {activeProfile === "estudiantes" && "Aprende haciendo, no memorizando"}
                        {activeProfile === "padres" && "Acompaña su camino financiero"}
                      </h3>
                    </div>

                    <p style={{
                      fontSize: "clamp(16px, 1.15rem, 19px)",
                      lineHeight: 1.65,
                      color: "#374151",
                      marginBottom: "clamp(24px, 4vw, 32px)",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {activeProfile === "docentes" && "Herramientas prácticas para enseñar finanzas con contenido listo para usar, seguimiento en tiempo real y recursos descargables."}
                      {activeProfile === "estudiantes" && "Aprende finanzas de forma divertida con cursos interactivos, simuladores reales y recompensas por tu progreso."}
                      {activeProfile === "padres" && "Acompaña el aprendizaje financiero de tus hijos con acceso a su progreso, recursos compartidos y actividades familiares."}
                    </p>

                    {/* Bullet Points */}
                    <ul style={{
                      listStyle: "none",
                      margin: "0 0 clamp(28px, 4vw, 36px) 0",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}>
                      {activeProfile === "docentes" && (
                        <>
                          {[
                            { text: <>Contenido listo para usar con <strong>lecciones interactivas</strong>.</> },
                            { text: <>Seguimiento en <strong>tiempo real</strong> del progreso de tus estudiantes.</> },
                            { text: <>Recursos <strong>descargables</strong> y materiales de apoyo.</> },
                          ].map((item, i) => (
                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                              <span style={{
                                width: "26px",
                                height: "26px",
                                background: "linear-gradient(135deg, #0056E7, #1983FD)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "13px",
                                flexShrink: 0,
                                boxShadow: "0 4px 10px rgba(0, 86, 231, 0.3)",
                              }}>✓</span>
                              <span style={{ fontSize: "clamp(15px, 1.05rem, 17px)", lineHeight: 1.6, color: "#374151" }}>
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </>
                      )}
                      {activeProfile === "estudiantes" && (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span style={{
                              width: "24px",
                              height: "24px",
                              background: "#0056E7",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}>✓</span>
                            <span style={{ fontSize: "clamp(15px, 1.05rem, 17px)", lineHeight: 1.5, color: "#374151" }}>
                              Aprende con <strong>gamificación</strong> y recompensas.
                            </span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span style={{
                              width: "24px",
                              height: "24px",
                              background: "#0056E7",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}>✓</span>
                            <span style={{ fontSize: "clamp(15px, 1.05rem, 17px)", lineHeight: 1.5, color: "#374151" }}>
                              Practica con <strong>simuladores reales</strong> sin riesgo.
                            </span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span style={{
                              width: "24px",
                              height: "24px",
                              background: "#0056E7",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}>✓</span>
                            <span style={{ fontSize: "clamp(15px, 1.05rem, 17px)", lineHeight: 1.5, color: "#374151" }}>
                              Rastrea tu <strong>progreso</strong> y gana certificaciones.
                            </span>
                          </li>
                        </>
                      )}
                      {activeProfile === "padres" && (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span style={{
                              width: "24px",
                              height: "24px",
                              background: "#0056E7",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}>✓</span>
                            <span style={{ fontSize: "clamp(15px, 1.05rem, 17px)", lineHeight: 1.5, color: "#374151" }}>
                              Visualiza el <strong>progreso</strong> de tus hijos en tiempo real.
                            </span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span style={{
                              width: "24px",
                              height: "24px",
                              background: "#0056E7",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}>✓</span>
                            <span style={{ fontSize: "clamp(15px, 1.05rem, 17px)", lineHeight: 1.5, color: "#374151" }}>
                              Accede a <strong>recursos compartidos</strong> y actividades familiares.
                            </span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span style={{
                              width: "24px",
                              height: "24px",
                              background: "#0056E7",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "14px",
                              flexShrink: 0,
                            }}>✓</span>
                            <span style={{ fontSize: "clamp(15px, 1.05rem, 17px)", lineHeight: 1.5, color: "#374151" }}>
                              Fomenta la <strong>educación financiera</strong> desde casa.
                            </span>
                          </li>
                        </>
                      )}
                    </ul>

                    {/* CTA Button - opens demo modal */}
                    <a
                      href="https://calendly.com/diego-bizen"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 32px)",
                        fontSize: "clamp(14px, 2vw, 18px)",
                        fontWeight: 500,
                        fontFamily: "'Inter', sans-serif",
                        background: "#0056E7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 9999,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "clamp(6px, 1.5vw, 10px)",
                        boxShadow: "0 4px 16px rgba(0, 86, 231, 0.35)",
                        minHeight: 44,
                        textDecoration: "none",
                      }}
                      className="quiero-demo-button"
                    >
                      Quiero una demo
                      <span className="quiero-demo-arrow" style={{ fontSize: "clamp(16px, 4vw, 20px)" }} aria-hidden>→</span>
                    </a>
                  </div>
                </div>

                {/* Right: Photo for active profile (1 solución, 4 perfiles educativos) */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "360px",
                }}>
                  <div key={activeProfile} className="perfiles-slide-in" style={{
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "28px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                  }}>
                    <Image
                      src={
                        activeProfile === "docentes" ? "/uploads/Landing_page/perfil-docentes.png" :
                          activeProfile === "estudiantes" ? "/uploads/Landing_page/perfil-estudiantes.png" :
                            "/uploads/Landing_page/perfil-padres.png"
                      }
                      alt={
                        activeProfile === "docentes" ? "Docentes en el aula" :
                          activeProfile === "estudiantes" ? "Estudiante con la plataforma" :
                            "Padres e hijos aprendiendo"
                      }
                      width={400}
                      height={300}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>)}
      {(sectionRange === 'all' || sectionRange === 'rest') && (
        <div className="landing-rest-wrapper" style={{
          background: "linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #e8f2ff 65%, #c7e0ff 85%, #93c5fd 100%)",
          width: "100%",
          minHeight: "100%",
          paddingBottom: "clamp(12px, 2vw, 24px)",
          overflow: "visible",
          overflowY: "visible",
        }}>
          {/* Conoce BIZEN - enhanced */}
          <section id="conoce-bizen" className="section conoce-bizen-section reveal-element" style={{
            background: "#ffffff",
            padding: "clamp(72px, 10vw, 112px) clamp(16px, 4vw, 48px)"
          }}>
            <div className="container" style={{ maxWidth: "1320px", margin: "0 auto" }}>

              {/* Section label + heading centered */}
              <div style={{ textAlign: "center", marginBottom: "clamp(56px, 7vw, 80px)" }}>
                <span style={{
                  display: "inline-block",
                  background: "rgba(0, 86, 231, 0.08)",
                  color: "#0056E7",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}>Conoce BIZEN</span>
                <h2 style={{
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  fontWeight: 800,
                  color: "#111",
                  lineHeight: 1.15,
                  marginBottom: "clamp(16px, 2vw, 20px)",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "-0.02em",
                }}>
                  Aprender finanzas nunca ha sido{" "}
                  <span style={{
                    background: "linear-gradient(90deg, #0056E7, #1983FD)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>tan claro y relevante</span>.
                </h2>
                <p style={{
                  fontSize: "clamp(17px, 1.3vw, 20px)",
                  lineHeight: 1.65,
                  color: "#64748b",
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}>
                  Impulsa a tu escuela a desarrollar habilidades clave mientras los estudiantes aprenden de forma práctica y guiada.
                </p>
              </div>

              {/* 6 skills — 3-column card grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(16px, 2vw, 24px)",
              }} className="conoce-skills-grid">
                {[
                  { label: "Toma de decisiones informadas", desc: "Evalúa opciones y elige con criterio financiero en situaciones reales.", Icon: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
                  { label: "Pensamiento crítico aplicado", desc: "Analiza información y cuestiona supuestos para resolver mejor.", Icon: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg> },
                  { label: "Resolución de problemas financieros", desc: "Enfrenta retos económicos reales con herramientas prácticas.", Icon: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg> },
                  { label: "Planeación y visión a futuro", desc: "Establece metas claras y administra recursos con perspectiva.", Icon: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
                  { label: "Trabajo colaborativo en el aula", desc: "Potencia el aprendizaje compartido en equipos.", Icon: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
                  { label: "Responsabilidad socioemocional", desc: "Desarrolla autonomía, empatía y habilidades para la vida.", Icon: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg> },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#f8faff",
                    border: "1px solid rgba(0, 86, 231, 0.1)",
                    borderRadius: "24px",
                    padding: "clamp(24px, 3vw, 32px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }} className={`reveal-element reveal-delay-${i % 3 + 1} conoce-skill-card`}>
                    <div style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #0056E7 0%, #1983FD 100%)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 20px rgba(0, 86, 231, 0.2)",
                      flexShrink: 0,
                    }}>
                      <item.Icon />
                    </div>
                    <div>
                      <div style={{
                        fontSize: "clamp(15px, 1.1rem, 17px)",
                        fontWeight: 700,
                        color: "#111",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "6px",
                        lineHeight: 1.3,
                      }}>{item.label}</div>
                      <div style={{
                        fontSize: "clamp(13px, 0.9rem, 15px)",
                        color: "#64748b",
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.6,
                      }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <style>{`
                .conoce-skill-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 12px 32px rgba(0, 86, 231, 0.1);
                  border-color: rgba(0, 86, 231, 0.25) !important;
                }
                @media (max-width: 900px) {
                  .conoce-skills-grid {
                    grid-template-columns: 1fr 1fr !important;
                  }
                }
                @media (max-width: 580px) {
                  .conoce-skills-grid {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}</style>

            </div>
          </section>

          {/* Cada clase, una aventura divertida — enhanced carousel */}
          <section className="section adventure-carousel-section reveal-element" style={{ background: "#f8faff", padding: "clamp(72px, 9vw, 112px) clamp(16px, 4vw, 24px)", overflow: "visible", height: "auto" }}>
            <div style={{ width: "100%", maxWidth: "1320px", margin: "0 auto", overflow: "visible" }} className="adventure-carousel-inner">

              {/* Section header */}
              <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 60px)" }}>
                <span style={{
                  display: "inline-block", background: "rgba(0,86,231,0.08)", color: "#0056E7",
                  borderRadius: "999px", padding: "6px 18px", fontSize: "13px", fontWeight: 700,
                  fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px",
                }}>Metodología</span>
                <h2 style={{
                  margin: 0,
                  fontSize: "clamp(30px, 4.5vw, 52px)",
                  fontWeight: 800,
                  color: "#111",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}>
                  Cada clase,{" "}
                  <span style={{ background: "linear-gradient(90deg, #0056E7, #1983FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    una aventura divertida
                  </span>
                </h2>
              </div>

              {/* Carousel */}
              <div style={{ position: "relative", overflow: "visible" }}>
                <div className="adventure-carousel-content-wrap" style={{ position: "relative", minHeight: "clamp(380px, 55vh, 560px)", overflow: "visible" }}>
                  {[
                    {
                      title: "Microlearning",
                      tag: "Lecciones cortas",
                      description: "Utilizamos contenidos digitales y videos cortos interactivos en todas nuestras lecciones, creados por especialistas académicos y de animación infantil (Netflix) para facilitar el aprendizaje de tus estudiantes.",
                      imageSrc: "/uploads/Landing_page/landing-1.png",
                      imageAlt: "Microlearning",
                    },
                    {
                      title: "Gamificación",
                      tag: "Motivación constante",
                      description: "Cada lección incluye retos y recompensas que mantienen a los estudiantes motivados y comprometidos con su aprendizaje financiero desde el primer día.",
                      imageSrc: "/uploads/Landing_page/landing-2.png",
                      imageAlt: "Gamificación",
                    },
                    {
                      title: "Contenido Interactivo",
                      tag: "Aprende haciendo",
                      description: "Material multimedia diseñado para captar la atención y facilitar la comprensión de conceptos financieros complejos de forma práctica y atractiva.",
                      imageSrc: "/uploads/Landing_page/landing-3.png",
                      imageAlt: "Contenido Interactivo",
                    },
                  ].map((slide, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: activeAdventureSlide === idx ? "relative" : "absolute",
                        top: 0, left: 0, right: 0, width: "100%",
                        opacity: activeAdventureSlide === idx ? 1 : 0,
                        visibility: activeAdventureSlide === idx ? "visible" : "hidden",
                        pointerEvents: activeAdventureSlide === idx ? "auto" : "none",
                        transition: "opacity 0.55s ease, visibility 0.55s ease",
                        zIndex: activeAdventureSlide === idx ? 2 : 1,
                      }}
                    >
                      {/* Two-column card */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(24px, 4vw, 56px)",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #0a1628 0%, #0d2050 60%, #0056E7 100%)",
                        borderRadius: "32px",
                        padding: "clamp(32px, 5vw, 56px)",
                        boxSizing: "border-box",
                        position: "relative",
                        overflow: "visible", // Changed from hidden to fix internal scroll issue
                        boxShadow: "0 24px 64px rgba(0, 86, 231, 0.2)",
                      }} className="adventure-slide-grid">
                        {/* Glow blobs */}
                        <div style={{ position: "absolute", top: "-60px", right: "30%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(25,131,253,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: "-40px", left: "10%", width: "240px", height: "240px", background: "radial-gradient(circle, rgba(0,86,231,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                        {/* Left: Text */}
                        <div style={{ position: "relative", zIndex: 1 }}>
                          {/* Slide tag */}
                          <span style={{
                            display: "inline-block",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "#93c5fd",
                            borderRadius: "999px",
                            padding: "5px 14px",
                            fontSize: "12px",
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            marginBottom: "20px",
                          }}>{slide.tag}</span>

                          <h3 style={{
                            margin: "0 0 clamp(14px, 2vw, 20px)",
                            fontSize: "clamp(26px, 3vw, 42px)",
                            fontWeight: 800,
                            color: "#fff",
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                          }}>
                            {slide.title}
                          </h3>

                          <p style={{
                            margin: "0 0 clamp(24px, 3vw, 36px)",
                            fontSize: "clamp(15px, 1.05vw, 18px)",
                            lineHeight: 1.75,
                            color: "rgba(255,255,255,0.72)",
                            fontFamily: "'Inter', sans-serif",
                            maxWidth: "480px",
                          }}>
                            {slide.description}
                          </p>

                          <a
                            href="https://calendly.com/diego-bizen"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "14px 28px",
                              fontSize: "clamp(14px, 1rem, 17px)",
                              fontWeight: 600,
                              background: "#fff",
                              color: "#0056E7",
                              borderRadius: "999px",
                              cursor: "pointer",
                              fontFamily: "'Inter', sans-serif",
                              boxShadow: "0 6px 20px rgba(255,255,255,0.15)",
                              transition: "all 0.25s ease",
                              textDecoration: "none",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)"
                              e.currentTarget.style.boxShadow = "0 10px 28px rgba(255,255,255,0.22)"
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = "translateY(0)"
                              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,255,255,0.15)"
                            }}
                          >
                            Solicita tu demo
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>

                        {/* Right: Image */}
                        <div style={{
                          position: "relative",
                          zIndex: 1,
                          borderRadius: "20px",
                          overflow: "hidden",
                          aspectRatio: "4/3",
                          background: "rgba(0,0,0,0.15)",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                        }}>
                          <Image
                            src={slide.imageSrc}
                            alt={slide.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            style={{ objectFit: "cover", borderRadius: "20px" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="carousel-nav-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", margin: "clamp(24px, 3vw, 36px) auto 0", position: "relative", zIndex: 5 }}>
                  {/* Prev */}
                  <button
                    type="button"
                    className="landing-carousel-arrow landing-adventure-arrow prev"
                    aria-label="Slide anterior"
                    onClick={() => setActiveAdventureSlide(prev => prev === 0 ? 2 : prev - 1)}
                    style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: "rgba(0, 86, 231, 0.10)",
                      border: "1.5px solid rgba(0, 86, 231, 0.25)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "rgba(0,86,231,0.18)"; e.currentTarget.style.borderColor = "rgba(0,86,231,0.5)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "rgba(0,86,231,0.10)"; e.currentTarget.style.borderColor = "rgba(0,86,231,0.25)"; }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0056E7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  {/* Dots */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {[0, 1, 2].map(idx => (
                      <button
                        key={idx}
                        onClick={() => setActiveAdventureSlide(idx)}
                        style={{
                          width: activeAdventureSlide === idx ? "36px" : "12px",
                          height: "12px",
                          borderRadius: "999px",
                          background: activeAdventureSlide === idx ? "#0056E7" : "rgba(0, 86, 231, 0.15)",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        aria-label={`Ir al slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    type="button"
                    className="landing-carousel-arrow landing-adventure-arrow next"
                    aria-label="Siguiente slide"
                    onClick={() => setActiveAdventureSlide(prev => prev === 2 ? 0 : prev + 1)}
                    style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: "#0056E7",
                      border: "none",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 6px 20px rgba(0, 86, 231, 0.3)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#015CF8"; e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "#0056E7"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                  {/* Counter */}
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(0, 86, 231, 0.4)", fontFamily: "'Inter', sans-serif" }}>
                    {activeAdventureSlide + 1} / 3
                  </span>
                </div>

                <style>{`
                  @media (max-width: 768px) {
                    .adventure-slide-grid {
                      grid-template-columns: 1fr !important;
                    }
                    .adventure-slide-grid > div:last-child {
                      aspect-ratio: 16/9 !important;
                    }
                  }
                `}</style>
              </div>
            </div>
          </section>



          {/* Tres obstáculos — redesigned */}
          <section id="problema" className="section curiosidad-section reveal-element" style={{
            background: "linear-gradient(160deg, #0a1628 0%, #0d1f40 50%, #0a2050 100%)",
            padding: "clamp(64px, 9vw, 112px) clamp(24px, 4vw, 56px)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: "-100px", right: "-60px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(25,131,253,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "420px", height: "420px", background: "radial-gradient(circle, rgba(0,86,231,0.10) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 72px)" }}>
                <span style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.75)",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}>El reto en educación financiera</span>
                <h2 style={{
                  fontSize: "clamp(36px, 5vw, 62px)",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "16px",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "-0.02em",
                }}>
                  Tres obstáculos{" "}
                  <span style={{
                    background: "linear-gradient(90deg, #60a5fa, #1983FD)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>comunes.</span>
                </h2>
                <p style={{ margin: "0 auto", maxWidth: "480px", fontSize: "clamp(17px, 1.3vw, 20px)", color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif", lineHeight: 1.65 }}>
                  La educación financiera tropieza con lo mismo una y otra vez.
                </p>
              </div>

              {/* Cards */}
              <div className="curiosidad-cards-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(20px, 3vw, 32px)",
                alignItems: "stretch",
                maxWidth: "1280px",
                margin: "0 auto clamp(40px, 5vw, 56px)",
              }}>
                {[
                  { n: "01", title: "Teoría sin práctica", desc: "Se enseña el concepto pero no se practica con casos reales.", icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h8" /><path d="M10 9H8" /></svg>, delay: "0s" },
                  { n: "02", title: "Difícil medir avance", desc: "No hay forma clara de ver el progreso de cada estudiante.", icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><circle cx="9" cy="12" r="1" fill="rgba(255,255,255,0.8)" /><circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.8)" /><circle cx="15" cy="12" r="1" fill="rgba(255,255,255,0.8)" /></svg>, delay: "1.2s" },
                  { n: "03", title: "Falta de tiempo del docente", desc: "Los profesores no tienen tiempo para personalizar la enseñanza.", icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, delay: "2.4s" },
                ].map((card, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "28px",
                    padding: "clamp(28px, 4vw, 44px) clamp(24px, 3vw, 36px)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    animation: "float-premium-card 6s ease-in-out infinite",
                    animationDelay: card.delay,
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                      <div style={{
                        width: "64px", height: "64px", borderRadius: "18px",
                        background: "linear-gradient(135deg, #0056E7, #1983FD)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(0, 86, 231, 0.35)", flexShrink: 0,
                      }}>{card.icon}</div>
                      <span style={{
                        fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 900, color: "rgba(255,255,255,0.07)",
                        fontFamily: "'Inter', sans-serif", letterSpacing: "-0.04em", lineHeight: 1, userSelect: "none",
                      }}>{card.n}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "clamp(11px, 0.8rem, 13px)", fontWeight: 700, color: "#60a5fa", fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Obstáculo {card.n}
                      </div>
                      <h3 style={{ margin: "0 0 10px", fontSize: "clamp(20px, 1.4rem, 24px)", fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif", lineHeight: 1.25 }}>
                        {card.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "clamp(15px, 1rem, 17px)", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif" }}>
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA bar */}
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "clamp(20px, 3vw, 28px) clamp(28px, 4vw, 56px)",
                textAlign: "center",
                backdropFilter: "blur(8px)",
                maxWidth: "900px",
                margin: "0 auto",
              }}>
                <p style={{ margin: 0, fontSize: "clamp(17px, 1.4vw, 21px)", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.6 }}>
                  <span style={{ background: "linear-gradient(90deg, #60a5fa, #1983FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BIZEN</span>
                  {" "}está diseñado para superar estos obstáculos.
                </p>
              </div>

              <style>{`
                @media (max-width: 700px) {
                  .curiosidad-cards-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>
            </div>
          </section>

          {/* Cómo funciona — enhanced */}
          <section id="como-funciona" className="section how-it-works reveal-element reveal-delay-2" style={{ background: "#f8faff", padding: "clamp(72px, 9vw, 112px) clamp(16px, 4vw, 24px)" }}>
            <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "clamp(48px, 7vw, 72px)" }}>
                <span style={{
                  display: "inline-block", background: "rgba(0,86,231,0.08)", color: "#0056E7",
                  borderRadius: "999px", padding: "6px 18px", fontSize: "13px", fontWeight: 700,
                  fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px",
                }}>Proceso</span>
                <h2 style={{
                  margin: "0 0 16px", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#111",
                  fontFamily: "'Inter', sans-serif", lineHeight: 1.1, letterSpacing: "-0.02em",
                }}>
                  ¿Cómo{" "}
                  <span style={{ background: "linear-gradient(90deg, #0056E7, #1983FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>funciona?</span>
                </h2>
                <p style={{ margin: "0 auto", fontSize: "clamp(16px, 1.2vw, 19px)", color: "#64748b", fontFamily: "'Inter', sans-serif", maxWidth: "480px", lineHeight: 1.65 }}>
                  Tres pasos: empiezas, practicas y mides tu avance.
                </p>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(24px, 4vw, 36px)",
                alignItems: "stretch",
                position: "relative",
              }} className="how-it-works-steps">
                {howItWorksSteps.map((step, i) => (
                  <div key={i} className={`step-card reveal-element reveal-delay-${i + 1}`} style={{
                    padding: "clamp(36px, 4vw, 52px) clamp(28px, 3vw, 40px)",
                    borderRadius: "28px",
                    background: "#fff",
                    border: "1px solid rgba(0, 86, 231, 0.1)",
                    boxShadow: "0 8px 32px rgba(0, 86, 231, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "default",
                  }}>
                    <div className="step-number-container" style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "24px",
                      background: "linear-gradient(135deg, #0056E7 0%, #1983FD 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "24px",
                      flexShrink: 0,
                      position: "relative",
                      boxShadow: "0 10px 24px rgba(0, 86, 231, 0.28)",
                    }}>
                      <span style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#0056E7",
                        fontSize: "13px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: "0 2px 8px rgba(0, 86, 231, 0.2)",
                        border: "1.5px solid rgba(0,86,231,0.12)",
                      }}>{i + 1}</span>
                      {i === 0 && (<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="5 3 19 12 5 21 5 3" /></svg>)}
                      {i === 1 && (<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>)}
                      {i === 2 && (<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>)}
                    </div>
                    <h3 style={{
                      margin: "0 0 12px",
                      fontSize: "clamp(19px, 1.5vw, 23px)",
                      fontWeight: 700,
                      color: "#111",
                      fontFamily: "'Inter', sans-serif",
                    }}>{step.title}</h3>
                    <p style={{ margin: 0, fontSize: "clamp(14px, 1rem, 16px)", color: "#64748b", lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
                      {step.schoolsText}
                    </p>
                  </div>
                ))}
                <style>{`
                  .step-card:hover {
                    border-color: rgba(0, 86, 231, 0.25) !important;
                    box-shadow: 0 12px 40px rgba(0, 86, 231, 0.10) !important;
                    transform: translateY(-4px);
                  }
                  @media (max-width: 767px) {
                    .how-it-works-steps { grid-template-columns: 1fr !important; }
                  }
                  @media (min-width: 768px) and (max-width: 899px) {
                    .how-it-works-steps { grid-template-columns: repeat(2, 1fr) !important; }
                  }
                  @media (min-width: 900px) {
                    .how-it-works-steps { grid-template-columns: repeat(3, 1fr) !important; }
                  }
                `}</style>
              </div>
            </div>
          </section>

        </div>
      )}

    </>
  )
}
const landingCSS = `
        @media (pointer: fine) {
          .landing-page-root {
            cursor: none !important;
          }
        }
        @media (pointer: coarse) {
          .blue-dot-cursor {
            display: none !important;
          }
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

:root{
  --c-primary:#0056E7;
  --c-accent:#10B981;
  --c-text:#1E293B;
  --c-muted:#334155;
  --c-bg:transparent;
  --c-card:#FFFFFF;
  --c-border:rgba(15, 23, 42, 0.12);
  --radius:16px;
  --shadow:0 10px 30px rgba(0,0,0,.06);
  --shadow-sm:0 4px 16px rgba(0,0,0,.06);
  --transition:180ms cubic-bezier(.2,.8,.2,1);
  --font-weight-normal:400;
  --font-weight-medium:500;
  --font-weight-semibold:600;
  --premium-shadow: 0 20px 40px rgba(0, 86, 231, 0.1);
}

@keyframes float-perfiles {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(30px, -20px) rotate(5deg); }
}
@keyframes float-perfiles-reverse {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-40px, 30px) rotate(-10deg); }
}

.skill-icon-container {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 86, 231, 0.1);
}
.skill-icon-container:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 24px rgba(0, 86, 231, 0.2);
  background: linear-gradient(135deg, #0056E7 0%, #1983FD 100%) !important;
}

.perfiles-slide-in {
  animation: slide-up-soft 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes slide-up-soft {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes float-premium-card {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes float-step {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}


body {
  background: #ffffff !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  font-weight: 400 !important;
}

html {
  background: #ffffff !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  scroll-behavior: smooth;
}

.section{padding: clamp(64px, 8vw, 120px) 0; scroll-margin-top: 80px; background: transparent !important; overflow-x: hidden !important; overflow-y: visible !important;}

/* Dark sections must override the transparent !important above */
#problema.section,
section#problema {
  background: linear-gradient(160deg, #0a1628 0%, #0d1f40 50%, #0a2050 100%) !important;
}
#sobre-bizen {
  background: linear-gradient(160deg, #0a1628 0%, #0d1f40 40%, #0056E7 100%) !important;
}

/* Reveal on scroll - fade up when section enters viewport */
.reveal-element {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.reveal-element.revealed {
  opacity: 1;
  transform: translateY(0);
}
.reveal-element.reveal-delay-1 { transition-delay: 0.12s; }
.reveal-element.reveal-delay-2 { transition-delay: 0.22s; }

        .section.contact,
        #contacto {
          padding-bottom: clamp(64px, 8vw, 128px) !important;
          overflow: visible !important;
        }
.section-head{max-width:900px; margin:0 auto 28px auto; text-align:center; overflow:visible; word-wrap:break-word; overflow-wrap:break-word;}
.section-head h2{margin:0 0 8px 0; font-size:clamp(28px, 4.2vw, 40px); font-weight:600; line-height:1.15; white-space:normal;}
.section-head p{margin:0; color:var(--c-muted); font-weight:400; white-space:normal;}

.container{
  width:100%;
  max-width:1400px;
  margin:0 auto;
  padding:0 clamp(16px, 4vw, 32px);
  overflow-x: hidden;
  box-sizing: border-box;
}
        .main-page-container .section,
        .main-page-container .adventure-carousel-section,
        .adventure-carousel-section,
        .main-page-container section {
          overflow: visible !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          height: auto !important;
          max-height: none !important;
          min-height: 0 !important;
        }
/* Cada clase section: NO internal scroll - only document/body scrolls */
.main-page-container .landing-gradient-wrapper,
.main-page-container .landing-rest-wrapper,
.landing-gradient-wrapper,
.landing-rest-wrapper {
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
  flex-shrink: 0 !important;
}
.main-page-container .adventure-carousel-section,
.adventure-carousel-section {
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
  min-height: 0 !important;
}
.main-page-container .adventure-carousel-inner,
.main-page-container .adventure-carousel-section > div,
.adventure-carousel-inner,
.adventure-carousel-content-wrap,
.adventure-slide-grid {
  overflow: visible !important;
  max-height: none !important;
  height: auto !important;
}
@media (min-width: 768px){
  .container{ padding:0 clamp(24px, 4vw, 40px) !important; overflow-x: hidden !important; }
  .section{ padding: clamp(72px, 10vw, 120px) 0 !important; }
  .section-head{ max-width: 920px !important; }
}
@media (min-width: 1024px){
  .container{ padding:0 clamp(32px, 4vw, 48px) !important; }
  .section{ padding: clamp(80px, 10vw, 128px) 0 !important; }
}

.hero{padding-top: clamp(24px, 3vw, 48px)}
.hero-inner{display:grid; gap:28px; align-items:center; grid-template-columns:1fr}
.hero-copy .sub{font-size:clamp(16px, 2.4vw, 20px); color:var(--c-muted); margin:0 0 14px 0}
.hero-actions{display:flex; gap:12px; flex-wrap:wrap}
.badges{display:flex; gap:10px; margin:18px 0 0 0; padding:0; list-style:none; flex-wrap:wrap}
.badges li{background:white; border:1px solid var(--c-border); padding:8px 12px; border-radius:999px; font-weight:500;}
.badges li a{color:inherit; transition:opacity var(--transition); cursor:pointer;}
.badges li a:hover{opacity:.7;}
.hero-media img{object-fit:contain; width:100%; height:auto; max-height:700px}
@media (min-width: 980px){ .hero-inner{grid-template-columns: 1.15fr .85fr} }

.card{background:var(--c-card); border:1px solid var(--c-border); border-radius:var(--radius); box-shadow:var(--shadow); padding:18px; transition:transform var(--transition), box-shadow var(--transition), border-color var(--transition);}
.card:hover{transform:translateY(-2px); box-shadow:0 14px 34px rgba(0,0,0,.08); border-color:rgba(14,165,233,.35)}
.grid-3{display:grid; gap:24px; grid-template-columns:1fr; min-width:0; overflow-x:hidden;}
.grid-6{display:grid; gap:16px; grid-template-columns:1fr 1fr; min-width:0; overflow-x:hidden;}
.main-page-container .grid-3 > *,
.main-page-container .grid-6 > *,
.main-page-container .steps > *,
.main-page-container .plan{ min-width: 0 !important; max-width: 100% !important; }
@media (min-width: 768px){
  .grid-3{ grid-template-columns: repeat(2, 1fr) !important; gap: 28px !important; }
  .grid-6{ grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
}
@media (min-width: 900px){
  .grid-3{ grid-template-columns: repeat(3, 1fr) !important; gap: 32px !important; }
  .grid-6{ grid-template-columns: repeat(3, 1fr) !important; gap: 24px !important; }
}
@media (min-width: 1025px){
  .grid-3{ gap: 40px !important; }
}

@media (min-width: 1200px){ .grid-6{grid-template-columns:repeat(6, 1fr)} }

.steps{display:grid; gap:16px; grid-template-columns:1fr; counter-reset: step}
.step{display:grid; gap:8px; padding:20px}
.step .step-icon{filter: drop-shadow(0 2px 8px rgba(14,165,233,.25))}
.steps .step h3{margin-top:4px}
@media (min-width: 768px){ .steps{ grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; } }
@media (min-width: 900px){ .steps{ grid-template-columns: repeat(3, 1fr) !important; gap: 28px !important; } }

.benefit{display:grid; gap:10px; text-align:left}
.benefit .benefit-icon{width:40px; height:40px; display:grid; place-items:center; background:rgba(16,185,129,.15); color:#065F46; border-radius:12px; font-weight:600;}

.course-media img{width:100%; height:auto; aspect-ratio: 16/10; object-fit:cover}
.course-title{margin:2px 0 8px}
.course-body{padding:6px 2px 8px 2px}
.course-meta{display:flex; align-items:center; gap:8px; color:var(--c-muted)}
.pill{display:inline-flex; align-items:center; height:28px; padding:0 10px; border-radius:999px; background:rgba(0, 86, 231, 0.12); color:#0056E7; font-weight:500; font-size:13px;}
.dot{opacity:.4}
.course-actions{padding-top:6px}

.plan{position:relative; padding:32px 24px; display:flex; flex-direction:column; height:auto; min-height:480px; border:1px solid rgba(255, 255, 255, 0.3); background:rgba(255, 255, 255, 0.6); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border-radius:32px; box-shadow:0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow:visible;}
.plan:hover{transform:translateY(-8px); box-shadow:0 20px 40px rgba(0, 86, 231, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6); border-color:rgba(0, 86, 231, 0.3);}
.plan--highlight{background:rgba(240, 247, 255, 0.7); border:2px solid rgba(0, 86, 231, 0.4); box-shadow:0 12px 32px rgba(0, 86, 231, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6); position:relative; overflow:visible;}
.plan--highlight::before{content:""; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, #0056E7 0%, #1983FD 50%, #0056E7 100%); background-size:200% auto; animation:shimmer 3s ease-in-out infinite;}
.tag{position:absolute; top:16px; right:16px; background:linear-gradient(135deg, #0056E7 0%, #1983FD 100%); color:#fff; border-radius:999px; font-weight:500; padding:8px 14px; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(0, 86, 231, 0.3); z-index:2;}
.plan-name{font-size:clamp(24px, 3vw, 32px); margin:0 0 12px 0; font-weight:600; letter-spacing:-0.02em; background:linear-gradient(135deg, #0056E7 0%, #1983FD 50%, #0056E7 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s ease-in-out infinite; font-family:'Inter', system-ui, -apple-system, sans-serif; white-space:normal; word-wrap:break-word; overflow-wrap:break-word;}
.plan-note{font-size:14px; margin:0 0 24px 0; color:var(--c-muted); font-weight:400; white-space:normal;}
.plan-list{list-style:none; margin:0 0 24px 0; padding:0; display:grid; gap:14px; flex-grow:1; overflow:visible;}
.plan-list li{display:flex; gap:12px; align-items:flex-start; font-size:15px; line-height:1.6; color:var(--c-text); white-space:normal; word-wrap:break-word; overflow-wrap:break-word;}
.check{color:var(--c-accent); font-weight:600; font-size:18px; min-width:20px; margin-top:2px;}
.plan-btn:hover{transform:none !important;}
.plan-btn:active{transform:none !important;}

        .carousel-track {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          ms-overflow-style: none;
        }
        .carousel-track::-webkit-scrollbar {
          display: none;
        }

        /* Responsive Arrows Logic */
        .landing-carousel-arrow {
           display: flex;
           align-items: center;
           justify-content: center;
           transition: all 0.2s ease;
           z-index: 10;
        }

        @media (min-width: 1281px) {
          .landing-adventure-arrow.prev { left: -70px !important; top: 50% !important; transform: translateY(-50%) !important; position: absolute !important; }
          .landing-adventure-arrow.next { right: -70px !important; top: 50% !important; transform: translateY(-50%) !important; position: absolute !important; }
          .landing-testimonial-arrow.prev { left: -60px !important; top: 50% !important; transform: translateY(-50%) !important; position: absolute !important; }
          .landing-testimonial-arrow.next { right: -60px !important; top: 50% !important; transform: translateY(-50%) !important; position: absolute !important; }
        }

        @media (max-width: 1280px) {
          .landing-adventure-arrow.prev,
          .landing-adventure-arrow.next,
          .landing-testimonial-arrow.prev,
          .landing-testimonial-arrow.next {
            position: relative !important;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            transform: none !important;
            margin: 0 !important;
            display: flex !important;
          }
        }

        .carousel-nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(16px, 4vw, 32px);
          width: 100%;
        }

/* Logo carousel - infinite horizontal scroll */
.logos-carousel-section { width: 100%; overflow: hidden; }
.logos-carousel { width: 100%; overflow: hidden; }
.logos-carousel-track {
  display: flex;
  align-items: center;
  gap: clamp(48px, 8vw, 80px);
  width: max-content;
  animation: logo-carousel-scroll 25s linear infinite;
  padding: 0 clamp(24px, 4vw, 48px);
}
.logos-carousel-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  min-width: 160px;
  max-width: 240px;
}
.logos-carousel-item img { width: auto; height: 100%; max-width: 100%; object-fit: contain; }
@keyframes logo-carousel-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.problem-columns,
.how-it-works-steps {
  min-width: 0 !important;
  max-width: 100% !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
}

/* Somos BIZEN Cards - Hover Effects */
.somos-bizen-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 86, 231, 0.5) !important;
}

@media (max-width: 767px) {
  .somos-bizen-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 767px) {
  .conoce-bizen-grid {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .somos-bizen-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* Profiles Section - slide animation: next tab content slides in very smooth */
@keyframes perfiles-slide-in {
  from {
    opacity: 0;
    transform: translateX(32px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.perfiles-slide-in {
  animation: perfiles-slide-in 1.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Profiles Section Responsive */
.profile-tab-button:hover {
  background: #0056E7 !important;
  color: #ffffff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 86, 231, 0.35);
}

.quiero-demo-button:hover {
  background: #015CF8 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 86, 231, 0.45) !important;
}

@media (max-width: 767px) {
  .perfiles-content-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }
  .perfiles-content-grid > div:last-child {
    display: none !important;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .perfiles-content-grid {
    gap: 32px !important;
  }
}

@media (max-width: 767px) {
  .problem-columns { grid-template-columns: 1fr !important; }
}
@media (min-width: 768px) {
  .problem-columns { grid-template-columns: 1fr 1fr !important; gap: clamp(24px, 4vw, 36px) !important; }
}

@media (max-width: 767px) {
  .how-it-works-steps { grid-template-columns: 1fr !important; }
}
@media (min-width: 768px) and (max-width: 899px) {
  .how-it-works-steps { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (min-width: 900px) {
  .how-it-works-steps { grid-template-columns: repeat(3, 1fr) !important; }
}

.cta-button:hover {
  background: #0056E7 !important;
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(0, 86, 231, 0.45);
}

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
  box-shadow:0 12px 40px rgba(0, 86, 231, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-color:rgba(0, 86, 231, 0.3);
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
  font-weight:500;
  font-family:'Inter', system-ui, -apple-system, sans-serif;
  font-size:clamp(16px, 2vw, 20px);
  color:#0056E7;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin:center;
  word-wrap:break-word;
  overflow-wrap:break-word;
  white-space:normal;
  flex-wrap:wrap;
  gap:8px;
}
.accordion-trigger:hover, .accordion-trigger:active{transform:none; color:#0056E7}
.accordion-trigger:focus-visible{outline:2px solid rgba(0, 86, 231, 0.6); border-radius:20px}
.chev{transition:transform var(--transition); color:#0056E7}
.accordion-item.open .chev{transform:rotate(180deg)}
.accordion-panel{
  padding:0 20px 18px 20px;
  color:var(--c-muted);
  display:none;
  font-family:'Inter', system-ui, -apple-system, sans-serif;
  font-size:clamp(15px, 1.8vw, 18px);
  line-height:1.7;
  word-wrap:break-word;
  overflow-wrap:break-word;
  white-space:normal;
  overflow:visible;
}
.accordion-item.open .accordion-panel{display:block}


.hero-image-small {
  width: 100% !important;
  max-width: clamp(200px, 30vw, 300px) !important;
  height: auto !important;
}
/* Larger screens: increase max-width for hero images */
@media (min-width: 768px){
  .hero-image-small{max-width: clamp(300px, 40vw, 500px) !important;}
}
@media (min-width: 1025px){
  .hero-image-small{max-width: clamp(350px, 45vw, 600px) !important;}
}

/* ==========================================
   COMPREHENSIVE RESPONSIVE BREAKPOINTS
   ========================================== */

/* Mobile First - Stack all grids on small screens */
@media (max-width: 767px) {
  /* Hero section grids - stack vertically */
  .hero-section-grid {
    grid-template-columns: 1fr !important;
    gap: clamp(24px, 6vw, 48px) !important;
    min-height: auto !important;
  }
  
  /* CTA section grid - stack vertically */
  .cta-section-grid {
    grid-template-columns: 1fr !important;
    gap: clamp(32px, 6vw, 48px) !important;
    min-height: auto !important;
  }
  
  /* Hero images - responsive sizing for mobile */
  .hero-image-small {
            width: 100% !important;
    max-width: clamp(150px, 50vw, 220px) !important;
            height: auto !important;
          }
  
  /* Hero text sections */
  .hero-text {
    order: 2 !important;
            text-align: center !important;
    padding: 0 clamp(16px, 4vw, 24px) !important;
  }
  
  /* Hero image sections */
  .hero-image {
    order: 1 !important;
    justify-content: center !important;
  }
  
  /* Alternating layout - first section text after image */
  .hero-section-grid:first-of-type .hero-text {
    order: 2 !important;
  }
  
  .hero-section-grid:first-of-type .hero-image {
    order: 1 !important;
  }
  
  /* Y MUCHO MÁS text - smaller on mobile */
  .y-mucho-mas-text {
    font-size: clamp(32px, 8vw, 56px) !important;
    padding: clamp(32px, 6vw, 64px) clamp(16px, 4vw, 24px) !important;
  }
  
  /* CTA text - smaller on mobile */
  .cta-section-grid p {
    font-size: clamp(28px, 7vw, 48px) !important;
    line-height: 1.2 !important;
  }
  
  /* CTA button - full width on mobile */
  .empieza-ya-button {
    width: 100% !important;
    max-width: 100% !important;
    padding: clamp(14px, 3vw, 18px) clamp(24px, 6vw, 36px) !important;
    font-size: clamp(16px, 3vw, 20px) !important;
  }
  
  
  /* Plans grid - stack on mobile */
  .grid-3 {
    grid-template-columns: 1fr !important;
    gap: clamp(20px, 4vw, 24px) !important;
  }
  
  /* Contact section - stack on mobile */
  #contacto .container > div {
    grid-template-columns: 1fr !important;
    gap: clamp(32px, 5vw, 48px) !important;
  }
  
  #contacto form,
  #contacto aside {
    width: 100% !important;
  }
  
  /* Schedule demo - two columns on desktop */
  @media (min-width: 768px) {
    .schedule-demo-two-col {
      grid-template-columns: 1fr 1fr !important;
      gap: clamp(40px, 6vw, 56px) !important;
    }
  }
  
  /* Schedule demo form - 1 column on mobile, 2 per row on desktop */
  .schedule-demo-form {
    grid-template-columns: 1fr !important;
  }
  @media (min-width: 520px) {
    .schedule-demo-form {
      grid-template-columns: 1fr 1fr !important;
    }
  }
  
  /* Section padding - reduce on mobile */
  .section {
    padding: clamp(32px, 6vw, 64px) 0 !important;
  }
  .main-page-container .adventure-carousel-section {
    padding: clamp(12px, 2vw, 20px) clamp(20px, 4vw, 48px) !important;
  }
  
  /* Container padding - increase on mobile for better spacing */
  .container {
    padding: 0 clamp(20px, 5vw, 32px) !important;
    max-width: 100% !important;
    width: 100% !important;
  }
  
  /* Main content wrapper - full width on mobile */
  .main-content-wrapper {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: clamp(12px, 3vw, 24px) !important;
    padding-right: clamp(12px, 3vw, 24px) !important;
  }
  
  /* Main page container - full width, gradient background on mobile */
  .main-page-container {
    background: linear-gradient(180deg, #ffffff 0%, rgba(0, 86, 231, 0.03) 18%, rgba(0, 86, 231, 0.05) 40%, rgba(25, 131, 253, 0.08) 60%, rgba(25, 131, 253, 0.1) 100%) !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Main element - full width */
  main {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    height: auto !important;
  }
  
  /* Hide decorative elements on mobile */
  .decorative-blue-accent,
  .decorative-contact-bg-1,
  .decorative-contact-bg-2 {
    display: none !important;
  }
  
  /* Remove any body/html margins/padding that might cause gaps */
  body, html {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    overflow-x: hidden !important;
  }
  
  /* Main hero section - adjust for mobile */
  .main-content-wrapper {
    padding: clamp(60px, 12vw, 100px) clamp(20px, 5vw, 32px) !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Main content grid - stack on mobile */
          .main-content {
    grid-template-columns: 1fr !important;
    gap: clamp(32px, 6vw, 48px) !important;
  }
  
  /* Responsive title for mobile */
  .main-content h1 {
    font-size: clamp(20px, 5.5vw, 38px) !important;
    line-height: 1.4 !important;
    color: #6B7280 !important;
    padding: 0 clamp(12px, 3vw, 20px) !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
}

/* Small mobile devices (up to 480px) */
@media (max-width: 480px) {
  .hero-image-small {
    max-width: clamp(120px, 60vw, 180px) !important;
    width: 100% !important;
  }
  
  .y-mucho-mas-text {
    font-size: clamp(28px, 9vw, 48px) !important;
  }
  
  .cta-section-grid p {
    font-size: clamp(24px, 8vw, 40px) !important;
  }
  
  /* Reduce gaps even more on very small screens */
  .hero-section-grid {
    gap: clamp(20px, 5vw, 32px) !important;
  }
  
  .cta-section-grid {
    gap: clamp(24px, 5vw, 40px) !important;
  }
  
  /* Extra small screens - title */
  .main-content h1 {
    font-size: clamp(18px, 6vw, 32px) !important;
    line-height: 1.35 !important;
    color: #6B7280 !important;
    padding: 0 clamp(12px, 3vw, 20px) !important;
  }
  
  /* Extra small screens - hero images even smaller */
  .hero-image-small {
    max-width: clamp(100px, 55vw, 150px) !important;
    width: 100% !important;
  }
}

/* Extra extra small devices (up to 375px) */
@media (max-width: 375px) {
  .hero-image-small {
    max-width: clamp(90px, 50vw, 130px) !important;
    width: 100% !important;
  }
}

/* Show decorative elements on tablet and desktop */
@media (min-width: 768px) {
  .decorative-blue-accent,
  .decorative-contact-bg-1,
  .decorative-contact-bg-2 {
    display: block !important;
  }
  
  .main-page-container {
    background: linear-gradient(180deg, #f5f9ff 0%, #eef6ff 18%, #e0efff 40%, #d4e8ff 60%, #dbeafe 75%, #d4e8ff 88%, #bfdbfe 100%) !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  
  /* Ensure full width background for all devices */
  body,
  html {
    width: 100% !important;
    max-width: 100% !important;
  }
}

/* Tablet Portrait (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
  .hero-section-grid {
    gap: clamp(40px, 5vw, 56px) !important;
  }
  
  .hero-image-small {
    max-width: clamp(220px, 40vw, 280px) !important;
    width: 100% !important;
  }
  
  .cta-section-grid {
    gap: clamp(40px, 5vw, 56px) !important;
  }
  
  /* Contact section - two columns on tablet (768px+) */
  #contacto .container > div {
    grid-template-columns: 1fr 1fr !important;
    gap: clamp(32px, 4vw, 40px) !important;
  }
  
  /* Tablet title */
  .main-content h1 {
    font-size: clamp(28px, 4.5vw, 42px) !important;
    line-height: 1.3 !important;
    color: #6B7280 !important;
  }
  
  /* Tablet - two columns for main content */
  .main-content {
    grid-template-columns: 1.1fr 0.9fr !important;
    gap: clamp(40px, 5vw, 60px) !important;
  }
  
  .text-and-buttons-container {
    padding-left: 0 !important;
    padding-right: clamp(4px, 1vw, 16px) !important;
    margin-left: clamp(-12px, -1.5vw, -4px) !important;
  }
  
  .billy-container {
    padding-right: clamp(4px, 1vw, 12px) !important;
  }
  
  /* Tablet Billy image */
  .billy-image {
    max-width: clamp(240px, 35vw, 300px) !important;
    width: 100% !important;
  }
  
  .billy-container {
    padding: clamp(20px, 3.5vw, 45px) !important;
    padding-right: clamp(8px, 1.5vw, 16px) !important;
  }
}

/* Tablet Landscape and Small Desktop (1025px - 1280px) */
@media (min-width: 1025px) and (max-width: 1280px) {
  .hero-section-grid {
    gap: clamp(48px, 5vw, 64px) !important;
  }
  
  .hero-image-small {
    max-width: clamp(280px, 35vw, 320px) !important;
    width: 100% !important;
  }
  
  /* Small Desktop - two columns for main content */
  .main-content {
    grid-template-columns: 1.1fr 0.9fr !important;
    gap: clamp(0px, 0.5vw, 12px) !important;
  }
  
  .text-and-buttons-container {
    padding-left: 0 !important;
    padding-right: clamp(8px, 1.5vw, 24px) !important;
    margin-left: clamp(-16px, -2vw, -8px) !important;
  }
  
  .billy-container {
    padding-right: clamp(8px, 1.5vw, 16px) !important;
  }
  
  /* Small Desktop Billy image */
  .billy-image {
    max-width: clamp(260px, 32vw, 300px) !important;
    width: 100% !important;
  }
  
  .billy-container {
    padding: clamp(25px, 3.5vw, 48px) !important;
    padding-right: clamp(8px, 1.5vw, 20px) !important;
  }
}

/* Large Desktop (1281px+) */
@media (min-width: 1281px) {
  .hero-section-grid {
    gap: 64px !important;
  }
  
  .hero-image-small {
    max-width: clamp(300px, 32vw, 350px) !important;
    width: 100% !important;
  }
  
  /* Desktop - two columns for main content */
  .main-content {
    grid-template-columns: 1.1fr 0.9fr !important;
    gap: clamp(0px, 0.5vw, 16px) !important;
  }
  
  .text-and-buttons-container {
    padding-left: 0 !important;
    padding-right: clamp(8px, 2vw, 28px) !important;
    margin-left: clamp(-20px, -2.5vw, -12px) !important;
  }
  
  .billy-container {
    padding-right: clamp(8px, 2vw, 20px) !important;
  }
  
  /* Desktop Billy image */
  .billy-image {
    max-width: clamp(280px, 30vw, 320px) !important;
    width: 100% !important;
  }
  
  .billy-container {
    padding: clamp(30px, 4vw, 50px) !important;
  }
}

/* Contact section - side by side on large screens */
@media (min-width: 980px) {
  #contacto .container > div {
    grid-template-columns: 1.2fr 0.8fr !important;
    gap: clamp(40px, 5vw, 48px) !important;
  }
}

.btn{
  --ring:0 0 0 0 rgba(14,165,233,.35);
  display:inline-flex; align-items:center; justify-content:center;
  height:42px; padding:0 16px; border-radius:12px;
  border:1px solid var(--c-border); cursor:pointer; font-weight:500;
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

// Build trigger: Wed Feb 18 17:31:00 CST 2026
