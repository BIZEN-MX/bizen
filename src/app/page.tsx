"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LandingWaitlistFooter } from "@/components/LandingWaitlistFooter"
import * as React from "react"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

export default function WelcomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMouthOpen, setIsMouthOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeHeroCard, setActiveHeroCard] = useState<number | null>(null)
  const [activeProfile, setActiveProfile] = useState<"directores" | "docentes" | "estudiantes" | "padres">("directores")
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

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

  const gradientStyle = { background: "linear-gradient(180deg, #f5f9ff 0%, #eef6ff 18%, #e0efff 40%, #d4e8ff 60%, #dbeafe 75%, #d4e8ff 88%, #bfdbfe 100%)", backgroundAttachment: "scroll" as const }

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
      {/* Top of page: logo, nav links, Crear cuenta - bigger elements, button always in view */}
      <div className="main-header" style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "18px 24px",
        display: "flex",
        justifyContent: "space-between",
            alignItems: "center",
        gap: "24px",
        flexWrap: "wrap",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <Image src="/bizen-logo.png" alt="BIZEN logo" width={48} height={48} priority style={{ width: 48, height: "auto", flexShrink: 0 }} />
          <span style={{ fontSize: 22, fontWeight: 500, color: "#1e3a8a", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", letterSpacing: "0.3px" }}>BIZEN</span>
        </Link>
        <nav style={{ display: "flex", gap: "24px", alignItems: "center", flexShrink: 1, minWidth: 0, padding: "14px 32px", backgroundColor: "#dbeafe", borderRadius: 9999 }} className="header-bar-nav">
          <Link href="#sobre-bizen" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Sobre Bizen</Link>
          <Link href="#impacto" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Impacto</Link>
          <Link href="#precios" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Implementación</Link>
          <Link href="#problema" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>El problema</Link>
        </nav>
        <button type="button" onClick={() => setDemoModalOpen(true)} style={{ padding: "16px 28px", fontSize: 19, fontWeight: 500, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "#1e3a8a", color: "white", borderRadius: 9999, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", flexShrink: 0 }} className="crear-cuenta-button">Agendar demo</button>
      </div>

      <main style={{ flex: 1, width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column" }}>
        <div style={gradientStyle}>
        <div style={{
          paddingTop: "clamp(16px, 3vw, 24px)",
          position: "relative",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          minHeight: "100vh",
          overflowX: "hidden",
          overflowY: "visible",
        }}>

          {/* Decorative blue accents - hidden on mobile */}
          <div style={{
            position: "absolute",
            top: "clamp(-100px, -15vw, -200px)",
            right: "clamp(-100px, -15vw, -200px)",
            width: "clamp(300px, 50vw, 800px)",
            height: "clamp(300px, 50vw, 800px)",
            background: "radial-gradient(circle, rgba(15, 98, 254, 0.04) 0%, transparent 70%)",
            borderRadius: "50%",
            overflow: "hidden",
            pointerEvents: "none",
            display: "none",
          }} className="decorative-blue-accent" />

          {/* Main Content - cards positioned way up, right below tagline */}
          <div style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "100%",
            margin: "0 auto",
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "clamp(16px, 3vw, 40px)",
            paddingTop: "clamp(0, 2vw, 16px)",
            paddingBottom: "clamp(40px, 6vw, 60px)",
            width: "100%",
            minHeight: "100vh",
            boxSizing: "border-box",
            overflow: "visible",
          }} className="main-content-wrapper">

            {/* Tagline at top of hero - fixed width on desktop so text spreads instead of shrinking */}
            <div className="hero-top-block" style={{
              position: "absolute",
              left: "50%",
              top: "clamp(40px, 6vw, 72px)",
              transform: "translateX(-50%)",
              textAlign: "center",
              width: "min(98vw, 1320px)",
              maxWidth: "1320px",
              zIndex: 10,
                opacity: isVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.3s",
            }}>
              <p className="hero-tagline" style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                color: "#000",
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.1,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  width: "100%",
              }}>
                La plataforma institucional que prepara a tus alumnos para el éxito financiero
              </p>
              <p className="hero-tagline-sub" style={{
                fontSize: "clamp(18px, 1.2rem, 22px)",
                color: "#374151",
                fontWeight: 400,
                margin: "8px 0 4px 0",
                lineHeight: 1.5,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      width: "100%",
              }}>
                BIZEN es la plataforma educativa que combina <span style={{ color: "#1e3a8a", fontWeight: 600 }}>gamificación e inteligencia artificial</span> para enseñar <span style={{ color: "#1e3a8a", fontWeight: 600 }}>finanzas personales</span> a estudiantes de preparatoria y universidad de forma práctica, clara y relevante.
              </p>
              </div>

            {/* Rectangles - separate full-width block, outside absolute container to avoid clipping */}
            <div className="hero-rectangles-wrapper" style={{ marginTop: "clamp(112px, 16vw, 220px)" }}>
              <div className="hero-rect-row">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`hero-card-link${activeHeroCard === index ? " hero-card-summary-visible" : ""}`}
                    onMouseEnter={() => setActiveHeroCard(index)}
                    onMouseLeave={() => setActiveHeroCard(null)}
                    onClick={() => setActiveHeroCard((prev) => (prev === index ? null : index))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setActiveHeroCard((prev) => (prev === index ? null : index))
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={activeHeroCard === index}
                    aria-label={`${heroCardSummaries[index].title}. ${activeHeroCard === index ? heroCardSummaries[index].summary : "Click o pasa el cursor para ver resumen"}`}
                  >
                    <div className="hero-rect-card">
                      <div className="hero-rect-inner">
                        <Image
                          src={index === 0 ? "/hero1.png" : index === 1 ? "/hero2.png" : "/hero3.png"}
                          alt={index === 0 ? "Billy con lápiz y libreta" : index === 1 ? "Billy con tablet y gráfica financiera" : "Billy con alcancía"}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                    </div>
                      <div
                        className="hero-card-summary hero-card-summary-bubble"
                        role="region"
                        aria-live="polite"
                      >
                        <span className="hero-card-summary-text">{heroCardSummaries[index].summary}</span>
                </div>
              </div>
                    <span className="hero-circle-label">
                      {index === 0 ? <>Finanzas<br />Personales</> : index === 1 ? <>Simuladores<br />financieros</> : <>Plan de<br />ahorro</>}
                    </span>
            </div>
                ))}
              </div>
            </div>

          </div>

          <style>{`
        /* Landing page: professional font stack */
        .main-page-container,
        .main-page-container .section,
        .main-page-container .container {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        /* Prevent horizontal scroll on landing - keep all content in frame */
        html:has(.main-page-container),
        body:has(.main-page-container) { overflow-x: hidden !important; max-width: 100vw !important; }
        
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
        .main-page-container { overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; }
        .main-page-container main { overflow-x: hidden !important; max-width: 100% !important; width: 100% !important; }
        .main-page-container main > div { overflow-x: hidden !important; max-width: 100% !important; width: 100% !important; box-sizing: border-box !important; }
        .main-content-wrapper { overflow-x: hidden !important; max-width: 100% !important; width: 100% !important; box-sizing: border-box !important; }
        .hero-rectangles-wrapper { overflow-x: clip !important; overflow-y: visible !important; }
        .hero-top-block .hero-tagline,
        .hero-top-block .hero-tagline-sub { max-width: 100% !important; overflow-wrap: break-word !important; word-wrap: break-word !important; }
        
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

        /* Top bar: keep Crear cuenta button in view on all screen sizes, prevent overflow */
        .main-header {
          max-width: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
        }
        .main-header .crear-cuenta-button {
          flex-shrink: 0 !important;
        }
        .main-header .header-bar-nav {
          min-width: 0 !important;
          max-width: 100% !important;
          overflow-x: clip !important;
        }

        /* Nav links: not bold, hover color change */
        .header-nav-link:hover {
          color: #1e3a8a !important;
          transition: color 0.2s ease;
        }
        .header-nav-link {
          transition: color 0.2s ease;
        }

        /* Crear cuenta button: solid blue, no shimmer */
        .crear-cuenta-button {
          background: #1e3a8a !important;
          transition: background 0.2s ease, filter 0.2s ease;
          animation: none !important;
        }
        .crear-cuenta-button:hover {
          background: #1d4ed8 !important;
          color: #fff !important;
          filter: brightness(1.05);
          transition: background 0.2s ease, filter 0.2s ease;
        }

        /* Tablet and desktop (768px+): show decorative accent, scale header and hero */
        @media (min-width: 768px) {
          .decorative-blue-accent {
            display: block !important;
          }
          .main-header {
            padding: 20px 28px !important;
            gap: 28px !important;
          }
          .main-header a[href="/"] span {
            font-size: 24px !important;
          }
          .main-header a[href="/"] img {
            width: 52px !important;
            height: auto !important;
          }
          .main-header .header-bar-nav {
            padding: 14px 28px !important;
            gap: 28px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 18px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 15px 26px !important;
            font-size: 18px !important;
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
            padding: 21px 30px !important;
            gap: 30px !important;
          }
          .main-header a[href="/"] span {
            font-size: 26px !important;
          }
          .main-header a[href="/"] img {
            width: 56px !important;
          }
          .main-header .header-bar-nav {
            padding: 15px 32px !important;
            gap: 30px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 19px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 16px 28px !important;
            font-size: 19px !important;
          }
          .hero-top-block {
            top: clamp(46px, 5.5vw, 68px) !important;
            width: min(96vw, 1240px) !important;
            max-width: 1240px !important;
          }
          .hero-tagline {
            font-size: clamp(34px, 5vw, 54px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(19px, 1.2rem, 22px) !important;
            margin-top: 20px !important;
          }
          .hero-rect-row {
            gap: clamp(32px, 4.5vw, 56px) !important;
            margin-top: clamp(38px, 5.5vw, 64px) !important;
          }
          .hero-rect-card {
            width: clamp(200px, 25vw, 330px) !important;
            height: clamp(112px, 14vw, 180px) !important;
          }
          .hero-circle-label {
            font-size: clamp(16px, 1.9vw, 21px) !important;
          }
        }

        @media (min-width: 1024px) {
          .main-header {
            padding: 22px 32px !important;
            gap: 32px !important;
          }
          .main-header a[href="/"] span {
            font-size: 27px !important;
          }
          .main-header a[href="/"] img {
            width: 58px !important;
          }
          .main-header .header-bar-nav {
            padding: 16px 34px !important;
            gap: 32px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 20px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 17px 30px !important;
            font-size: 20px !important;
          }
          .hero-top-block {
            top: clamp(48px, 6vw, 72px) !important;
            width: min(96vw, 1280px) !important;
            max-width: 1280px !important;
          }
          .hero-tagline {
            font-size: clamp(36px, 5vw, 56px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(19px, 1.25rem, 23px) !important;
            margin-top: 20px !important;
          }
          .hero-rectangles-wrapper {
            margin-top: clamp(160px, 20vw, 300px) !important;
          }
          .hero-rect-row {
            gap: clamp(34px, 5vw, 60px) !important;
            margin-top: clamp(42px, 6vw, 68px) !important;
          }
          .hero-rect-card {
            width: clamp(210px, 26vw, 350px) !important;
            height: clamp(118px, 14.5vw, 190px) !important;
          }
          .hero-circle-label {
            font-size: clamp(17px, 2vw, 22px) !important;
          }
        }

        /* Screens > 1100px: scale up top elements so it doesn't look empty */
        @media (min-width: 1100px) {
          .main-header {
            padding: 22px 32px !important;
            gap: 32px !important;
          }
          .main-header a[href="/"] span {
            font-size: 28px !important;
          }
          .main-header a[href="/"] img {
            width: 58px !important;
            height: auto !important;
          }
          .main-header .header-bar-nav {
            padding: 16px 36px !important;
            gap: 32px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 21px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 18px 32px !important;
            font-size: 21px !important;
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
            padding: 26px 40px !important;
            gap: 40px !important;
          }
          .main-header a[href="/"] span {
            font-size: 30px !important;
          }
          .main-header a[href="/"] img {
            width: 64px !important;
          }
          .main-header .header-bar-nav {
            padding: 18px 48px !important;
            gap: 40px !important;
          }
          .main-header .header-bar-nav a,
          .main-header .header-nav-link {
            font-size: 23px !important;
          }
          .main-header .crear-cuenta-button {
            padding: 20px 36px !important;
            font-size: 23px !important;
          }
          /* Hero section: even larger on very wide screens */
          .hero-top-block {
            top: clamp(56px, 7vw, 100px) !important;
            max-width: 1320px !important;
            width: min(96vw, 1320px) !important;
          }
          .hero-tagline {
            font-size: clamp(38px, 5vw, 60px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(20px, 1.3rem, 26px) !important;
            margin-top: 24px !important;
          }
          .hero-rect-row {
            gap: clamp(40px, 5vw, 80px) !important;
          }
          .hero-rectangles-wrapper {
            margin-top: clamp(160px, 20vw, 300px) !important;
          }
          .hero-rect-card {
            width: clamp(300px, 28vw, 440px) !important;
            height: clamp(165px, 15vw, 240px) !important;
          }
          .hero-circle-label {
            font-size: clamp(18px, 2.2vw, 24px) !important;
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
            margin-top: clamp(80px, 12vw, 150px);
            padding: 0 clamp(16px, 4vw, 24px);
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
            box-shadow: 0 8px 24px rgba(15, 98, 254, 0.35);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 12px 32px rgba(15, 98, 254, 0.5);
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
          background: #1e3a8a;
          border-radius: clamp(7px, 1.2vw, 9px);
          z-index: -1;
        }
        
        .empieza-ya-button {
          background: #1e3a8a !important;
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
          .crear-cuenta-button {
            padding: 8px 14px !important;
            font-size: 13px !important;
            white-space: nowrap !important;
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
        </div>

        {/* Landing Page Content - gradient: hero through perfiles */}
        <LandingContent sectionRange="gradient" onOpenDemoModal={() => setDemoModalOpen(true)} />
      </div>
        {/* Rest of landing (white background) */}
        <LandingContent sectionRange="rest" onOpenDemoModal={() => setDemoModalOpen(true)} />
      </main >

      {/* Schedule Demo Modal - compact, enhanced */}
      {demoModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="demo-modal-title" style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", boxSizing: "border-box" }} onClick={(e) => e.target === e.currentTarget && setDemoModalOpen(false)}>
          <div style={{ position: "relative", background: "#ffffff", borderRadius: "20px", border: "1px solid rgba(15, 98, 254, 0.12)", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(15, 98, 254, 0.04)", padding: "28px 32px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", maxWidth: "min(98vw, 520px)", width: "100%", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Cerrar" onClick={() => setDemoModalOpen(false)} style={{ position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px", borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: "18px", lineHeight: 1, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, color 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#334155"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}>×</button>
            <div style={{ paddingRight: "36px" }}>
              <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "linear-gradient(90deg, #1e3a8a, #60a5fa)", marginBottom: "16px" }} />
              <h2 id="demo-modal-title" style={{ fontSize: "18px", fontWeight: 500, color: "#1e293b", margin: "0 0 6px 0", lineHeight: 1.3 }}>Solicita tu demo gratis</h2>
              <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.5 }}>15 min · Sin presión</p>
              <ul style={{ listStyle: "none", margin: "0 0 16px 0", padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                {["Lecciones prácticas", "Reportes de progreso", "Implementación fácil"].map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "13px", color: "#475569" }}><span style={{ color: "#1e3a8a", fontWeight: 500, flexShrink: 0 }}>✓</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px 20px", border: "1px solid #e2e8f0" }}>
              <form onSubmit={async (e) => { e.preventDefault(); const form = e.currentTarget; const formData = new FormData(form); const name = formData.get("name") as string; const email = formData.get("email") as string; const school = formData.get("school") as string; const role = formData.get("role") as string; const students = formData.get("students") as string; const parts = [`Escuela: ${school || "—"}`, `Rol: ${role || "—"}`, students ? `Estudiantes: ${students}` : ""].filter(Boolean); const message = parts.join("\n"); const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement; const originalText = submitButton?.textContent; if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Enviando…"; } try { const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message }) }); const data = await res.json(); if (data.success) { alert(data.message || "Gracias. Te contactaremos pronto."); form.reset(); setDemoModalOpen(false); } else { alert(data.message || "Error. Intenta de nuevo."); } } catch { alert("Error al enviar. Intenta de nuevo más tarde."); } finally { if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalText || "Agendar demo"; } } }} style={{ display: "grid", gap: "12px 16px", gridTemplateColumns: "1fr 1fr" }}>
                {[{ id: "modal-demo-name", name: "name", label: "Nombre", type: "text", required: true }, { id: "modal-demo-email", name: "email", label: "Email", type: "email", required: true }, { id: "modal-demo-school", name: "school", label: "Escuela", type: "text", required: true }, { id: "modal-demo-role", name: "role", label: "Rol", type: "text", required: true, placeholder: "ej. Director" }].map((f) => (
                  <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: f.name === "school" || f.name === "role" ? undefined : "1 / -1" }}><label htmlFor={f.id} style={{ fontWeight: 500, fontSize: "12px", color: "#64748b" }}>{f.label}</label><input id={f.id} name={f.name} type={f.type} required={f.required} placeholder={f.placeholder} style={{ width: "100%", padding: "10px 12px", fontSize: "14px", borderRadius: "8px", background: "#fff", border: "1px solid #e2e8f0", color: "#1e293b", fontFamily: "inherit", boxSizing: "border-box" }} /></div>
                ))}
                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "4px" }}><label htmlFor="modal-demo-students" style={{ fontWeight: 500, fontSize: "12px", color: "#64748b" }}>Estudiantes (opcional)</label><input id="modal-demo-students" name="students" type="text" placeholder="ej. 250" style={{ width: "100%", padding: "10px 12px", fontSize: "14px", borderRadius: "8px", background: "#fff", border: "1px solid #e2e8f0", color: "#1e293b", fontFamily: "inherit", boxSizing: "border-box" }} /></div>
                <button type="submit" style={{ width: "100%", marginTop: "4px", gridColumn: "1 / -1", padding: "12px 20px", minHeight: "44px", fontSize: "15px", fontWeight: 600, color: "#ffffff", background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", border: "none", borderRadius: 9999, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(15, 98, 254, 0.35)" }}>Agendar demo</button>
              </form>
            </div>
            <p style={{ margin: "12px 0 0 0", fontSize: "11px", color: "#94a3b8", lineHeight: 1.5 }}>Secundaria y preparatoria</p>
          </div>
        </div>
      )}

      {/* Testimonials Carousel */}
      <section className="section testimonials-section reveal-element" style={{ background: "#f8fafc", padding: "clamp(56px, 8vw, 96px) clamp(20px, 4vw, 48px)", marginBottom: "clamp(64px, 10vw, 100px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ 
          textAlign: "center",
            margin: "0 0 clamp(40px, 6vw, 64px)", 
            fontSize: "clamp(28px, 4.5vw, 44px)", 
            fontWeight: 600, 
            color: "#111", 
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif", 
            lineHeight: 1.2 
          }}>
            Colegios líderes en México ya evolucionaron con BIZEN<span style={{ color: "#111" }}>.</span>
          </h2>
          
          <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
            {/* Left Arrow - disabled on first card */}
            <button
              type="button"
              disabled={activeTestimonial === 0}
              onClick={() => activeTestimonial > 0 && setActiveTestimonial(prev => prev - 1)}
              style={{
                position: "absolute",
                left: "-60px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: activeTestimonial === 0 ? "rgba(203, 213, 225, 0.4)" : "rgba(139, 92, 246, 0.15)",
                border: `1px solid ${activeTestimonial === 0 ? "rgba(148, 163, 184, 0.4)" : "rgba(139, 92, 246, 0.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: activeTestimonial === 0 ? "not-allowed" : "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
                opacity: activeTestimonial === 0 ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (activeTestimonial !== 0) {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.25)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.05)"
                }
              }}
              onMouseOut={(e) => {
                if (activeTestimonial === 0) return
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)"
                e.currentTarget.style.transform = "translateY(-50%)"
              }}
              aria-label="Testimonial anterior"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTestimonial === 0 ? "#94a3b8" : "#8b5cf6"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Right Arrow - disabled on last card */}
            <button
              type="button"
              disabled={activeTestimonial === 2}
              onClick={() => activeTestimonial < 2 && setActiveTestimonial(prev => prev + 1)}
              style={{
                position: "absolute",
                right: "-60px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: activeTestimonial === 2 ? "rgba(203, 213, 225, 0.4)" : "rgba(15, 98, 254, 0.15)",
                border: `1px solid ${activeTestimonial === 2 ? "rgba(148, 163, 184, 0.4)" : "rgba(15, 98, 254, 0.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: activeTestimonial === 2 ? "not-allowed" : "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
                opacity: activeTestimonial === 2 ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (activeTestimonial !== 2) {
                  e.currentTarget.style.background = "rgba(15, 98, 254, 0.25)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.05)"
                }
              }}
              onMouseOut={(e) => {
                if (activeTestimonial === 2) return
                e.currentTarget.style.background = "rgba(15, 98, 254, 0.15)"
                e.currentTarget.style.transform = "translateY(-50%)"
              }}
              aria-label="Siguiente testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTestimonial === 2 ? "#94a3b8" : "#1e3a8a"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Testimonial Cards - animated on navigate */}
            <div style={{ position: "relative", perspective: "1000px", minHeight: "320px" }}>
              {[
                {
                  quote: "Una plataforma increíble para aprender finanzas personales de forma clara y práctica. A mi hijo le encantó.",
                  name: "Gabriela Burgos",
                  title: "Directora de Programas de Emprendimiento · BLOQUE",
                  institution: "",
                  image: "/image.png",
                  logo: undefined,
                },
                {
                  quote: "Una herramienta excepcional para quienes buscan desarrollar educación financiera de forma práctica.",
                  name: "Alejandro Rolland",
                  title: "Secretaría de Desarrollo Sustentable · Querétaro",
                  institution: "",
                  image: "/image-copy.png",
                  logo: undefined,
                },
                {
                  quote: "Una plataforma innovadora que acerca las finanzas personales de manera sencilla y atractiva para jóvenes.",
                  name: "Joanna Vazquez",
                  title: "Coordinadora Universidad",
                  institution: "Mondragón México",
                  image: "/joanna.png",
                  logo: "/bizen_sign.png",
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
          <div style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "clamp(32px, 5vw, 48px)",
                    border: "1px solid rgba(15, 98, 254, 0.12)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(15, 98, 254, 0.06)",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "clamp(28px, 4vw, 40px)",
            alignItems: "center",
                  }}>
                    {/* Person Image */}
                    <div style={{
                      width: "clamp(120px, 15vw, 160px)",
                      height: "clamp(120px, 15vw, 160px)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                    }}>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {/* Quote */}
                    <div>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "16px" }}>
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="#FCD34D"/>
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="#FCD34D"/>
                      </svg>
                      <p style={{ 
                        margin: "0 0 20px", 
                        fontSize: "clamp(16px, 1.15rem, 19px)", 
                        lineHeight: 1.6, 
                        color: "#1e293b",
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        {testimonial.quote}
                      </p>
                      <div>
                        <p style={{ margin: "0 0 4px", fontSize: "clamp(15px, 1rem, 17px)", fontWeight: 500, color: "#111", fontFamily: "'Inter', sans-serif" }}>
                          — {testimonial.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "clamp(13px, 0.9rem, 15px)", color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
                          {testimonial.title}
                        </p>
                        {testimonial.institution ? (
                          <p style={{ margin: "2px 0 0", fontSize: "clamp(13px, 0.9rem, 15px)", color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
                            {testimonial.institution}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* School Logo (optional) */}
                    {testimonial.logo && (
                      <div style={{ width: "clamp(64px, 8vw, 80px)", height: "clamp(64px, 8vw, 80px)", position: "relative", flexShrink: 0 }}>
                        <Image
                          src={testimonial.logo}
                          alt="Logo"
                          fill
                          style={{ objectFit: "contain" }}
                        />
          </div>
                    )}
                  </div>
                </div>
              ))}
        </div>

            {/* Indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
              {[0, 1, 2].map(idx => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  style={{
                    width: activeTestimonial === idx ? "32px" : "12px",
                    height: "12px",
                    borderRadius: "6px",
                    background: activeTestimonial === idx ? "#1e3a8a" : "#cbd5e1",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingWaitlistFooter onOpenDemoModal={() => setDemoModalOpen(true)} />
    </div >
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

function LandingContent({ sectionRange = 'all', onOpenDemoModal }: { sectionRange?: 'gradient' | 'rest' | 'all'; onOpenDemoModal?: () => void }) {
  const primary = "#1e3a8a"
  const accent = "#10B981"
  const [activeProfile, setActiveProfile] = React.useState<"directores" | "docentes" | "estudiantes" | "padres">("directores")
  const [activeAdventureSlide, setActiveAdventureSlide] = React.useState(0)

  return (
    <>
      <style>{landingCSS}</style>
      {(sectionRange === 'all' || sectionRange === 'gradient') && (<>

      {/* Logo carousel above Planes */}
      <section className="section logos-carousel-section reveal-element" style={{ background: "transparent", padding: "clamp(32px, 5vw, 48px) 0", overflow: "hidden" }}>
        <p style={{
              textAlign: "center",
          margin: "0 0 clamp(20px, 3vw, 28px)",
          fontSize: "clamp(18px, 2vw, 24px)",
          fontWeight: 600,
          color: "#1f2937",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}>
          Estas instituciones ya confían en <span style={{ color: "#111" }}>BIZEN</span>
        </p>
        <div className="logos-carousel">
          <div className="logos-carousel-track">
            {[...logoCarouselLogos, ...logoCarouselLogos].map((logo, i) => (
              <div key={i} className="logos-carousel-item">
                <Image src={logo.src} alt={logo.alt} width={220} height={110} style={{ objectFit: "contain", opacity: 0.9 }} />
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Somos BIZEN - 4 blue cards */}
      <section id="sobre-bizen" className="section somos-bizen-section reveal-element" style={{ 
        background: "transparent", 
        paddingTop: "clamp(56px, 10vw, 96px)",
        paddingBottom: "clamp(24px, 4vw, 40px)",
        paddingLeft: "clamp(16px, 4vw, 24px)",
        paddingRight: "clamp(16px, 4vw, 24px)",
      }}>
        <div className="container" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          {/* Heading */}
          <h2 style={{
            textAlign: "left",
            fontSize: "clamp(32px, 4.5vw, 52px)",
            fontWeight: 600,
            color: "#1f2937",
            lineHeight: 1.2,
            marginBottom: "clamp(40px, 6vw, 64px)",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          }}>
            Somos BIZEN, la solución<br />
            que transforma la<br />
            educación<span style={{ color: "#111" }}>.</span>
          </h2>

          {/* 4 Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "clamp(20px, 3vw, 28px)",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
          className="somos-bizen-grid"
          >
            {/* Card 1: Validación institucional (Gobierno) */}
            <div className="somos-bizen-card" style={{
              background: "#1e3a8a",
              borderRadius: "20px",
              padding: "clamp(28px, 4vw, 40px) clamp(24px, 3vw, 32px)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "320px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 4px 20px rgba(30, 58, 138, 0.4)",
            }}>
              <div>
                <h3 style={{
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                fontWeight: 600,
                  lineHeight: 1.3,
                  marginBottom: "16px",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Validación institucional (Gobierno)
                </h3>
              <p style={{
                  fontSize: "clamp(15px, 1.1rem, 17px)",
                  lineHeight: 1.5,
                  opacity: 0.95,
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: "12px",
                }}>
                  Seleccionados entre <strong>+50 startups</strong>.
                </p>
                <p style={{
                  fontSize: "clamp(14px, 1rem, 16px)",
                  lineHeight: 1.5,
                  opacity: 0.95,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Parte del Programa de Incubación de la Secretaría de Desarrollo Económico, impulsando innovación educativa y emprendimiento juvenil en México.
                </p>
            </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "24px", flexWrap: "wrap" }}>
                <div style={{ height: "44px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "10px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600 }}>SEDESU / SEDEQ</div>
          </div>
        </div>

            {/* Card 2: Confianza Big Tech */}
            <div className="somos-bizen-card" style={{
              background: "#1e3a8a",
              borderRadius: "20px",
              padding: "clamp(28px, 4vw, 40px) clamp(24px, 3vw, 32px)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "320px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 4px 20px rgba(30, 58, 138, 0.4)",
            }}>
              <div>
                <h3 style={{
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                fontWeight: 600,
                  lineHeight: 1.3,
                  marginBottom: "16px",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Confianza Big Tech
                </h3>
              <p style={{
                  fontSize: "clamp(15px, 1.1rem, 17px)",
                  lineHeight: 1.5,
                  opacity: 0.95,
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: "12px",
                }}>
                  <strong>Google for Startups</strong> confía en BIZEN.
                </p>
                <p style={{
                  fontSize: "clamp(14px, 1rem, 16px)",
                  lineHeight: 1.5,
                  opacity: 0.95,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Startup EdTech respaldada por programas de Google for Startups, enfocada en educación financiera y emprendimiento para jóvenes.
                </p>
            </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "24px", flexWrap: "wrap" }}>
                <div style={{ height: "44px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "10px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600 }}>Google for Startups</div>
          </div>
        </div>

            {/* Card 3: Comunidad EdTech LATAM */}
            <div className="somos-bizen-card" style={{
              background: "#1e3a8a",
              borderRadius: "20px",
              padding: "clamp(28px, 4vw, 40px) clamp(24px, 3vw, 32px)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "320px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 4px 20px rgba(30, 58, 138, 0.4)",
            }}>
              <div>
                <h3 style={{
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  marginBottom: "16px",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Comunidad EdTech LATAM
                </h3>
                <p style={{
                  fontSize: "clamp(15px, 1.1rem, 17px)",
                  lineHeight: 1.5,
                  opacity: 0.95,
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: "12px",
                }}>
                  Parte de la comunidad EdTech más grande de <strong>LATAM</strong>.
                </p>
                <p style={{
                  fontSize: "clamp(14px, 1rem, 16px)",
                  lineHeight: 1.5,
                  opacity: 0.95,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Conectados con startups, educadores e innovadores que están transformando la educación en América Latina.
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "24px", flexWrap: "wrap" }}>
                <div style={{ height: "44px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "10px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600 }}>HolonIQ / EdTech</div>
              </div>
            </div>

            {/* Card 4: Impacto educativo */}
            <div className="somos-bizen-card" style={{
              background: "#1e3a8a",
              borderRadius: "20px",
              padding: "clamp(28px, 4vw, 40px) clamp(24px, 3vw, 32px)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "320px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 4px 20px rgba(30, 58, 138, 0.4)",
            }}>
              <div>
                <h3 style={{
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                fontWeight: 600,
                  lineHeight: 1.3,
                  marginBottom: "16px",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Educación financiera que sí se usa.
                </h3>
              <p style={{
                  fontSize: "clamp(14px, 1rem, 16px)",
                  lineHeight: 1.5,
                  opacity: 0.95,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  BIZEN enseña ahorro, inversión y emprendimiento con metodología práctica, gamificada y alineada al mundo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Perfiles Educativos */}
      <section id="perfiles" className="section perfiles-section reveal-element" style={{ 
        background: "linear-gradient(180deg, #D6E4FF 0%, #EDF5FF 60%, #C7DCF8 100%)",
        paddingTop: "clamp(24px, 4vw, 40px)",
        paddingBottom: "clamp(56px, 10vw, 88px)",
        paddingLeft: "clamp(16px, 4vw, 24px)",
        paddingRight: "clamp(16px, 4vw, 24px)",
      }}>
        <div className="container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <h2 style={{
            textAlign: "center",
            fontSize: "clamp(32px, 4.5vw, 52px)",
            fontWeight: 600,
            color: "#1f2937",
          lineHeight: 1.2,
            marginBottom: "clamp(8px, 2vw, 16px)",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          }}>
            1 solución, 4 perfiles educativos.<br />
            <span style={{ color: "#1f2937" }}>Un clic que lo cambia todo</span>
            <span style={{ color: "#111" }}>.</span>
          </h2>

          {/* Content Card - tabs inside at top */}
          <div style={{
            marginTop: "clamp(32px, 5vw, 48px)",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            padding: "clamp(24px, 4vw, 32px) clamp(24px, 4vw, 48px) clamp(32px, 5vw, 56px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(15, 98, 254, 0.12)",
          }}>
            {/* Tabs - inside box */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "clamp(28px, 4vw, 40px)",
              flexWrap: "wrap",
            }}
            className="perfiles-tabs-row"
            >
              {[
                { id: "directores" as const, label: "Directores" },
                { id: "docentes" as const, label: "Docentes" },
                { id: "estudiantes" as const, label: "Estudiantes" },
                { id: "padres" as const, label: "Padres" },
              ].map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setActiveProfile(profile.id)}
                style={{
                    padding: "14px 28px",
                    fontSize: "clamp(15px, 1.1rem, 18px)",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: activeProfile === profile.id ? "#1e3a8a" : "rgba(15, 98, 254, 0.08)",
                    color: activeProfile === profile.id ? "#ffffff" : "#4b5563",
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
                <h3 style={{
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 600,
                  color: "#1e3a8a",
                  marginBottom: "clamp(16px, 3vw, 24px)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {activeProfile === "directores" && "Directores"}
                  {activeProfile === "docentes" && "Docentes"}
                  {activeProfile === "estudiantes" && "Estudiantes"}
                  {activeProfile === "padres" && "Padres"}
                </h3>

                <p style={{
                  fontSize: "clamp(16px, 1.15rem, 19px)",
                  lineHeight: 1.65,
                  color: "#374151",
                  marginBottom: "clamp(24px, 4vw, 32px)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {activeProfile === "directores" && "¿Buscas una educación moderna, basada en datos, que mejore el desempeño académico y ayude a incrementar tu matrícula?"}
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
                  {activeProfile === "directores" && (
                    <>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          background: "#1e3a8a", 
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
                          Toma mejores decisiones con <strong>métricas en tiempo real</strong>.
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          background: "#1e3a8a", 
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
                          Aumenta la <strong>retención de matrícula</strong> al identificar oportunidades clave.
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          background: "#1e3a8a", 
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
                          Optimiza recursos y maximiza el <strong>retorno de tu inversión</strong> educativa.
                        </span>
                      </li>
                    </>
                  )}
                  {activeProfile === "docentes" && (
                    <>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          background: "#1e3a8a", 
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
                          Contenido listo para usar con <strong>lecciones interactivas</strong>.
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          background: "#1e3a8a", 
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
                          Seguimiento en <strong>tiempo real</strong> del progreso de tus estudiantes.
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          background: "#1e3a8a", 
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
                          Recursos <strong>descargables</strong> y materiales de apoyo.
                        </span>
                      </li>
                    </>
                  )}
                  {activeProfile === "estudiantes" && (
                    <>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          background: "#1e3a8a", 
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
                          background: "#1e3a8a", 
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
                          background: "#1e3a8a", 
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
                          background: "#1e3a8a", 
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
                          background: "#1e3a8a", 
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
                          background: "#1e3a8a", 
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
                <button
                  type="button"
                  onClick={() => onOpenDemoModal?.()}
                style={{
                    padding: "16px 32px",
                    fontSize: "clamp(16px, 1.1rem, 18px)",
                  fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  background: "#1e3a8a",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 9999,
                  cursor: "pointer",
                    transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 4px 16px rgba(15, 98, 254, 0.35)",
                  }}
                  className="quiero-demo-button"
                >
                  Quiero una demo
                  <span style={{ fontSize: "20px" }}>→</span>
                </button>
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
                      activeProfile === "directores" ? "/perfil-directores.png" :
                      activeProfile === "docentes" ? "/perfil-docentes.png" :
                      activeProfile === "estudiantes" ? "/perfil-estudiantes.png" :
                      "/perfil-padres.png"
                    }
                    alt={
                      activeProfile === "directores" ? "Directores usando BIZEN" :
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
      <div style={{
        background: "linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #e8f2ff 65%, #c7e0ff 85%, #93c5fd 100%)",
        width: "100%",
        minHeight: "100%",
        paddingBottom: "clamp(12px, 2vw, 24px)",
      }}>
      {/* Conoce BIZEN - Aprender dinámico y divertido + 6 habilidades */}
      <section id="conoce-bizen" className="section conoce-bizen-section reveal-element" style={{ 
        background: "#ffffff", 
        padding: "clamp(56px, 10vw, 88px) clamp(16px, 4vw, 48px)" 
      }}>
        <div className="container" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(140px, 28vw, 320px)",
            alignItems: "center",
          }}
          className="conoce-bizen-grid"
          >
            {/* Left column */}
            <div>
              <p style={{
                fontSize: "clamp(14px, 1rem, 16px)",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "clamp(12px, 2vw, 16px)",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.02em",
              }}>
                Conoce BIZEN
              </p>
            <h2 style={{
                fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 600,
                color: "#1e293b",
                lineHeight: 1.2,
                marginBottom: "clamp(20px, 3vw, 28px)",
                fontFamily: "'Inter', sans-serif",
              }}>
                Aprender finanzas nunca ha sido tan claro y relevante<span style={{ color: "#111" }}>.</span>
              </h2>
            <p style={{
                fontSize: "clamp(16px, 1.1rem, 18px)",
                lineHeight: 1.6,
              color: "#475569",
                fontFamily: "'Inter', sans-serif",
              }}>
                Impulsa a tu escuela a desarrollar habilidades clave mientras los estudiantes aprenden de forma práctica y guiada.
              </p>
            </div>

            {/* Right column - 6 skills in 2x3 grid */}
          <div style={{
            display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(20px, 3vw, 28px) clamp(24px, 4vw, 36px)",
            }}>
              {[
                { label: "Toma de decisiones informadas", Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
                { label: "Pensamiento crítico aplicado", Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> },
                { label: "Resolución de problemas financieros reales", Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
                { label: "Planeación y visión a futuro", Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                { label: "Trabajo colaborativo en el aula", Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                { label: "Responsabilidad y habilidades socioemocionales", Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    minWidth: "48px",
                    borderRadius: "50%",
                    background: "#1e3a8a",
                    color: "#fff",
                  display: "flex",
                  alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <item.Icon />
              </div>
                  <span style={{
                    fontSize: "clamp(15px, 1.05rem, 17px)",
                    fontWeight: 500,
                    color: "#334155",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.3,
                  }}>
                    {item.label}
                  </span>
              </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cada clase, una aventura divertida - Carousel */}
      <section className="section adventure-carousel-section reveal-element" style={{ background: "#f8fafc", padding: "clamp(12px, 1.5vw, 20px) clamp(20px, 4vw, 48px)", overflow: "visible" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", overflow: "visible" }}>
          <h2 style={{
            textAlign: "center",
            margin: "0 0 clamp(48px, 7vw, 72px)",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 600,
            color: "#111",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            lineHeight: 1.2
          }}>
            Cada clase, una aventura divertida<span style={{ color: "#EF4444" }}>.</span>
          </h2>

          <div style={{ position: "relative", maxWidth: "1000px", margin: "0 auto", overflow: "visible" }}>
            {/* Left Arrow */}
            <button
              onClick={() => setActiveAdventureSlide(prev => prev === 0 ? 2 : prev - 1)}
              style={{
                position: "absolute",
                left: "-70px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.3)"
                e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)"
                e.currentTarget.style.transform = "translateY(-50%)"
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => setActiveAdventureSlide(prev => prev === 2 ? 0 : prev + 1)}
              style={{
                position: "absolute",
                right: "-70px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(15, 98, 254, 0.15)",
                border: "1px solid rgba(15, 98, 254, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(15, 98, 254, 0.3)"
                e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(15, 98, 254, 0.15)"
                e.currentTarget.style.transform = "translateY(-50%)"
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Carousel Content - smooth crossfade when changing cards; minHeight reserves space so card doesn't overlap dots */}
            <div style={{ position: "relative", minHeight: "640px", overflow: "visible" }}>
              {[
                {
                  title: "Microlearning",
                  description: "Utilizamos contenidos digitales y videos cortos interactivos en todas nuestras lecciones, creados por especialistas académicos y de animación infantil (Netflix) para facilitar el aprendizaje de tus estudiantes.",
                  imageSrc: "/landing-1.png",
                  imageAlt: "Image 1",
                },
                {
                  title: "Gamificación",
                  description: "Cada lección incluye retos y recompensas que mantienen a los estudiantes motivados y comprometidos con su aprendizaje.",
                  imageSrc: "/landing-2.png",
                  imageAlt: "Image 2",
                },
                {
                  title: "Contenido Interactivo",
                  description: "Material multimedia diseñado para captar la atención y facilitar la comprensión de conceptos complejos.",
                  imageSrc: "/landing-3.png",
                  imageAlt: "Image 3",
                },
              ].map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: activeAdventureSlide === idx ? 1 : 0,
                    pointerEvents: activeAdventureSlide === idx ? "auto" : "none",
                    transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div style={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
                    borderRadius: "32px",
                    padding: "clamp(48px, 6vw, 72px) clamp(40px, 5vw, 64px)",
                    textAlign: "center",
                  }}>
                    {/* Image 1, 2, 3 */}
                    <div style={{
                      width: "100%",
                      maxWidth: "640px",
                      margin: "0 auto clamp(32px, 4vw, 48px)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      position: "relative",
                      aspectRatio: "16/9",
                      background: "rgba(0,0,0,0.15)",
                    }}>
                      <Image
                        src={slide.imageSrc}
                        alt={slide.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 640px"
                        style={{
                          objectFit: "contain",
                          borderRadius: "16px",
                        }}
                      />
                    </div>

                    <h3 style={{
                      margin: "0 0 clamp(16px, 2vw, 24px)",
                      fontSize: "clamp(28px, 3.5vw, 36px)",
                      fontWeight: 600,
                      color: "#ffffff",
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      lineHeight: 1.2,
                    }}>
                      {slide.title}
                    </h3>

                    <p style={{
                      margin: "0 auto",
                      fontSize: "clamp(15px, 1rem, 17px)",
                      lineHeight: 1.6,
                      color: "#ffffff",
                      fontFamily: "'Inter', sans-serif",
                      maxWidth: "720px",
                      opacity: 0.95,
                    }}>
                      {slide.description}
                    </p>
                  </div>

                  <div style={{ textAlign: "center", marginTop: "clamp(24px, 3vw, 32px)" }}>
                    <button
                      type="button"
                      onClick={() => onOpenDemoModal?.()}
                      style={{
                        padding: "16px 32px",
                        fontSize: "clamp(16px, 1.1rem, 18px)",
                        fontWeight: 500,
                        background: "#1e3a8a",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 9999,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: "0 4px 16px rgba(15, 98, 254, 0.4)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(15, 98, 254, 0.5)"
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(15, 98, 254, 0.4)"
                      }}
                    >
                      Solicita tu demo
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px", position: "relative", zIndex: 5 }}>
              {[0, 1, 2].map(idx => (
                <button
                  key={idx}
                  onClick={() => setActiveAdventureSlide(idx)}
                  style={{
                    width: activeAdventureSlide === idx ? "32px" : "12px",
                    height: "12px",
                    borderRadius: "6px",
                    background: activeAdventureSlide === idx ? "#1e3a8a" : "#cbd5e1",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Convierte la curiosidad - 3 feature cards */}
      <section className="section curiosidad-section reveal-element" style={{
        background: "#ffffff",
        padding: "clamp(56px, 10vw, 88px) clamp(24px, 4vw, 48px)",
      }}>
        <div className="container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Heading with navy dot */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "14px", marginBottom: "clamp(44px, 6vw, 64px)" }}>
            <span style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#1e3a8a",
              flexShrink: 0,
              marginTop: "clamp(14px, 1.8vw, 22px)",
            }} aria-hidden />
            <div style={{ textAlign: "center", maxWidth: "920px" }}>
              <h2 style={{
                margin: 0,
                fontSize: "clamp(22px, 3vw, 36px)",
                fontWeight: 500,
                color: "#1e293b",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                lineHeight: 1.3,
              }}>
                Tres obstáculos comunes
              </h2>
              <p style={{
                margin: "clamp(8px, 1vw, 12px) 0 0",
                fontSize: "clamp(17px, 1.15rem, 20px)",
                lineHeight: 1.5,
                color: "#475569",
                fontFamily: "'Inter', sans-serif",
              }}>
                La educación financiera tropieza con lo mismo.
              </p>
            </div>
          </div>

          {/* Three feature cards with vertical dividers */}
          <div
            className="curiosidad-cards-grid"
            style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
            gap: 0,
            alignItems: "stretch",
            maxWidth: "1280px",
            margin: "0 auto",
          }}>
            {/* Card 1 - Document/list */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 clamp(20px, 4vw, 48px)" }}>
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                background: "#1e3a8a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "clamp(24px, 3vw, 32px)",
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M8 13h8" />
                  <path d="M8 17h8" />
                  <path d="M8 9h2" />
                </svg>
              </div>
              <span style={{
                marginBottom: "6px",
                fontSize: "clamp(12px, 0.85rem, 14px)",
                fontWeight: 500,
                color: "#64748b",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.02em",
              }}>
                Obstáculo 1
              </span>
              <h3 style={{
                margin: "0 0 clamp(8px, 1vw, 12px)",
                fontSize: "clamp(18px, 1.25rem, 22px)",
                fontWeight: 500,
                color: "#1e293b",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.3,
              }}>
                Teoría sin práctica
              </h3>
              <p style={{
                margin: 0,
                fontSize: "clamp(16px, 1.1rem, 19px)",
                lineHeight: 1.55,
                color: "#334155",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}>
                Se enseña el concepto pero no se practica con casos reales.
              </p>
            </div>

            {/* Divider */}
            <div className="curiosidad-divider" style={{ background: "#e2e8f0", width: "1px", minHeight: "80px", alignSelf: "stretch" }} />

            {/* Card 2 - Speech bubble / chat */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 clamp(20px, 4vw, 48px)" }}>
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                background: "#1e3a8a",
                  display: "flex",
                  alignItems: "center",
                justifyContent: "center",
                marginBottom: "clamp(24px, 3vw, 32px)",
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <circle cx="9" cy="12" r="1" fill="#ffffff" />
                  <circle cx="12" cy="12" r="1" fill="#ffffff" />
                  <circle cx="15" cy="12" r="1" fill="#ffffff" />
                </svg>
              </div>
              <span style={{
                marginBottom: "6px",
                fontSize: "clamp(12px, 0.85rem, 14px)",
                  fontWeight: 500,
                color: "#64748b",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.02em",
              }}>
                Obstáculo 2
              </span>
              <h3 style={{
                margin: "0 0 clamp(8px, 1vw, 12px)",
                fontSize: "clamp(18px, 1.25rem, 22px)",
                fontWeight: 500,
                color: "#1e293b",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.3,
              }}>
                Difícil medir avance
              </h3>
              <p style={{
                margin: 0,
                fontSize: "clamp(16px, 1.1rem, 19px)",
                lineHeight: 1.55,
                color: "#334155",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}>
                No hay forma clara de ver el progreso de cada estudiante.
              </p>
              </div>

            {/* Divider */}
            <div className="curiosidad-divider" style={{ background: "#e2e8f0", width: "1px", minHeight: "80px", alignSelf: "stretch" }} />

            {/* Card 3 - Pencil */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 clamp(20px, 4vw, 48px)" }}>
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                background: "#1e3a8a",
                  display: "flex",
                  alignItems: "center",
                justifyContent: "center",
                marginBottom: "clamp(24px, 3vw, 32px)",
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <line x1="4" y1="20" x2="8" y2="16" stroke="#ffffff" />
                </svg>
              </div>
              <span style={{
                marginBottom: "6px",
                fontSize: "clamp(12px, 0.85rem, 14px)",
                  fontWeight: 500,
                color: "#64748b",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.02em",
              }}>
                Obstáculo 3
              </span>
              <h3 style={{
                margin: "0 0 clamp(8px, 1vw, 12px)",
                fontSize: "clamp(18px, 1.25rem, 22px)",
                fontWeight: 500,
                color: "#1e293b",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.3,
              }}>
                Falta de tiempo del docente
              </h3>
              <p style={{
                margin: 0,
                fontSize: "clamp(16px, 1.1rem, 19px)",
                lineHeight: 1.55,
                color: "#334155",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}>
                Los profesores no tienen tiempo para personalizar la enseñanza.
              </p>
              </div>
          </div>
          <p style={{
            margin: "clamp(32px, 5vw, 48px) 0 0",
            textAlign: "center",
            fontSize: "clamp(18px, 1.25rem, 22px)",
            fontWeight: 600,
            color: "#1e3a8a",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.4,
          }}>
            BIZEN está diseñado para superar estos obstáculos.
          </p>
          <style>{`
            @media (max-width: 700px) {
              .curiosidad-cards-grid {
                grid-template-columns: 1fr !important;
                gap: clamp(24px, 4vw, 40px) !important;
              }
              .curiosidad-divider { display: none !important; }
            }
          `}</style>
        </div>
      </section>

      {/* Cómo funciona - 3 steps - pulled up and separated from footer */}
      <section id="como-funciona" className="section how-it-works reveal-element reveal-delay-2" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(248, 251, 255, 0.35) 20%, rgba(241, 245, 249, 0.3) 80%, transparent 100%)", padding: "clamp(32px, 5vw, 56px) clamp(16px, 4vw, 24px) clamp(56px, 10vw, 96px) clamp(16px, 4vw, 24px)" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 56px)" }}>
            <h2 style={{
              margin: "0 0 12px",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 600,
              color: "#111",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}>
              Cómo funciona
            </h2>
            <p style={{ margin: 0, fontSize: "clamp(16px, 1.05rem, 18px)", color: "#64748b", fontFamily: "'Inter', sans-serif", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
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
              <div key={i} className="step-card" style={{
                padding: "clamp(28px, 3vw, 36px) clamp(20px, 2.5vw, 28px)",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(15, 98, 254, 0.14)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(15, 98, 254, 0.06)",
                    display: "flex",
                flexDirection: "column",
                    alignItems: "center",
                textAlign: "center",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(15, 98, 254, 0.15) 0%, rgba(15, 98, 254, 0.08) 100%)",
                    border: "1px solid rgba(15, 98, 254, 0.2)",
                    display: "flex",
                    alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  flexShrink: 0,
                  position: "relative",
                }}>
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "24px", height: "24px", borderRadius: "50%", background: "#1e3a8a", color: "#fff", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
                    {i + 1}
                  </span>
                  {i === 0 && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  )}
                  {i === 1 && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                  )}
                  {i === 2 && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                  )}
                </div>
                <h3 style={{
                  margin: "0 0 20px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontWeight: 500,
                  color: "#111",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                }}>
                  {step.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "clamp(14px, 0.95rem, 15px)", color: "#475569", lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>
                    <span style={{ color: "#64748b" }}>{step.schoolsText}</span>
                  </p>
              </div>
          </div>
            ))}
          </div>
          <style>{`
            .step-card:hover {
              border-color: rgba(15, 98, 254, 0.28) !important;
              box-shadow: 0 8px 32px rgba(15, 98, 254, 0.1) !important;
            }
            @media (max-width: 767px) {
              .how-it-works-steps {
                grid-template-columns: 1fr !important;
              }
            }
            @media (min-width: 768px) and (max-width: 899px) {
              .how-it-works-steps {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: clamp(20px, 3vw, 28px) !important;
              }
            }
            @media (min-width: 900px) {
              .how-it-works-steps {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: clamp(24px, 4vw, 36px) !important;
              }
            }
          `}</style>
        </div>
      </section>

      </div>
      )}

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
  --c-primary:#1e3a8a;
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

.section{padding: clamp(64px, 8vw, 120px) 0; scroll-margin-top: 80px; background: transparent !important;}

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
.main-page-container .section{
  overflow-x: hidden !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
.main-page-container .adventure-carousel-section {
  overflow-x: clip !important;
  overflow-y: visible !important;
  padding: clamp(12px, 1.5vw, 20px) clamp(20px, 4vw, 48px) !important;
}
@media (min-width: 768px){
  .container{ padding:0 clamp(24px, 4vw, 40px) !important; overflow-x: hidden !important; }
  .section{ padding: clamp(72px, 10vw, 120px) 0 !important; }
  .main-page-container .adventure-carousel-section{ padding: clamp(12px, 1.5vw, 20px) clamp(20px, 4vw, 48px) !important; }
  .section-head{ max-width: 920px !important; }
}
@media (min-width: 1024px){
  .container{ padding:0 clamp(32px, 4vw, 48px) !important; }
  .section{ padding: clamp(80px, 10vw, 128px) 0 !important; }
  .main-page-container .adventure-carousel-section{ padding: clamp(12px, 1.5vw, 20px) clamp(20px, 4vw, 48px) !important; }
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
.pill{display:inline-flex; align-items:center; height:28px; padding:0 10px; border-radius:999px; background:rgba(14,165,233,.12); color:#0b77a1; font-weight:500; font-size:13px;}
.dot{opacity:.4}
.course-actions{padding-top:6px}

.plan{position:relative; padding:32px 24px; display:flex; flex-direction:column; height:auto; min-height:480px; border:1px solid rgba(255, 255, 255, 0.3); background:rgba(255, 255, 255, 0.6); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border-radius:32px; box-shadow:0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow:visible;}
.plan:hover{transform:translateY(-8px); box-shadow:0 20px 40px rgba(15, 98, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6); border-color:rgba(15, 98, 254, 0.3);}
.plan--highlight{background:rgba(240, 247, 255, 0.7); border:2px solid rgba(15, 98, 254, 0.4); box-shadow:0 12px 32px rgba(15, 98, 254, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6); position:relative; overflow:visible;}
.plan--highlight::before{content:""; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, #1e3a8a 0%, #4A90E2 50%, #1e3a8a 100%); background-size:200% auto; animation:shimmer 3s ease-in-out infinite;}
.tag{position:absolute; top:16px; right:16px; background:linear-gradient(135deg, #1e3a8a 0%, #4A90E2 100%); color:#fff; border-radius:999px; font-weight:500; padding:8px 14px; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(15, 98, 254, 0.3); z-index:2;}
.plan-name{font-size:clamp(24px, 3vw, 32px); margin:0 0 12px 0; font-weight:600; letter-spacing:-0.02em; background:linear-gradient(135deg, #1e3a8a 0%, #4A90E2 50%, #1e3a8a 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s ease-in-out infinite; font-family:'Inter', system-ui, -apple-system, sans-serif; white-space:normal; word-wrap:break-word; overflow-wrap:break-word;}
.plan-note{font-size:14px; margin:0 0 24px 0; color:var(--c-muted); font-weight:400; white-space:normal;}
.plan-list{list-style:none; margin:0 0 24px 0; padding:0; display:grid; gap:14px; flex-grow:1; overflow:visible;}
.plan-list li{display:flex; gap:12px; align-items:flex-start; font-size:15px; line-height:1.6; color:var(--c-text); white-space:normal; word-wrap:break-word; overflow-wrap:break-word;}
.check{color:var(--c-accent); font-weight:600; font-size:18px; min-width:20px; margin-top:2px;}
.plan-btn:hover{transform:none !important;}
.plan-btn:active{transform:none !important;}

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
  box-shadow: 0 12px 40px rgba(30, 58, 138, 0.5) !important;
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
  background: #1e3a8a !important;
  color: #ffffff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 98, 254, 0.35);
}

.quiero-demo-button:hover {
  background: #1e40af !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15, 98, 254, 0.45) !important;
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
  background: #1d4ed8 !important;
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(15, 98, 254, 0.45);
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
  font-weight:500;
  font-family:'Inter', system-ui, -apple-system, sans-serif;
  font-size:clamp(16px, 2vw, 20px);
  color:#1e3a8a;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin:center;
  word-wrap:break-word;
  overflow-wrap:break-word;
  white-space:normal;
  flex-wrap:wrap;
  gap:8px;
}
.accordion-trigger:hover, .accordion-trigger:active{transform:none; color:#1e3a8a}
.accordion-trigger:focus-visible{outline:2px solid rgba(15, 98, 254, 0.6); border-radius:20px}
.chev{transition:transform var(--transition); color:#1e3a8a}
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
    background: linear-gradient(180deg, #f5f9ff 0%, #eef6ff 18%, #e0efff 40%, #d4e8ff 60%, #dbeafe 75%, #d4e8ff 88%, #bfdbfe 100%) !important;
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

