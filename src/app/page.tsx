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

const PHONE_BREAKPOINT = 767

export default function WelcomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMouthOpen, setIsMouthOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isPhone, setIsPhone] = useState(false)

  // Lock: show "use desktop/tablet" message on phones
  useEffect(() => {
    const check = () => setIsPhone(typeof window !== "undefined" && window.innerWidth < PHONE_BREAKPOINT)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)

    const mouthInterval = setInterval(() => {
      setIsMouthOpen(prev => !prev)
    }, 400)

    return () => clearInterval(mouthInterval)
  }, [])

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
      background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 25%, #eef6ff 55%, #e3f0ff 85%, #dbeafe 100%)",
      backgroundAttachment: "fixed",
      flex: 1,
      width: "100%",
      maxWidth: "100%",
      margin: 0,
      padding: 0,
      overflowX: "hidden",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }} className="main-page-container">
      {/* Phone lock: ask to open on desktop/tablet */}
      {isPhone && (
        <div
          style={{
        position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%)",
        display: "flex",
            flexDirection: "column",
        alignItems: "center",
            justifyContent: "center",
            padding: 32,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Image
            src="/2.png"
            alt="Billy"
            width={200}
            height={200}
            style={{
              width: 160,
              height: "auto",
              maxWidth: "60vw",
              objectFit: "contain",
              marginBottom: 16,
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>
            BIZEN
          </span>
          <p style={{ fontSize: 22, fontWeight: 700, margin: "24px 0 0", maxWidth: 320, lineHeight: 1.4 }}>
            Para una mejor experiencia, ábrelo en tu computadora o tablet.
          </p>
        </div>
      )}
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
          <span style={{ fontSize: 22, fontWeight: 700, color: "#0F62FE", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", letterSpacing: "0.3px" }}>BIZEN</span>
        </Link>
        <nav style={{ display: "flex", gap: "24px", alignItems: "center", flexShrink: 1, minWidth: 0, padding: "14px 32px", backgroundColor: "#dbeafe", borderRadius: 9999 }} className="header-bar-nav">
          <Link href="#sobre-bizen" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Sobre Bizen</Link>
          <Link href="#impacto" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Impacto</Link>
          <Link href="#precios" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Implementación</Link>
          <Link href="#precios" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Para escuelas</Link>
          <Link href="#contacto" className="header-nav-link" style={{ fontSize: 19, fontWeight: 400, color: "#1e40af", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>Contacto</Link>
        </nav>
        <Link href="#contacto" style={{ padding: "16px 28px", fontSize: 19, fontWeight: 500, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "#0F62FE", color: "white", borderRadius: 10, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", flexShrink: 0 }} className="crear-cuenta-button">Agendar demo</Link>
      </div>

      <main style={{ flex: 1, width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column" }}>
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

          {/* Main Content */}
          <div style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "100%",
            margin: "0 auto",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 3vw, 40px)",
            paddingTop: "clamp(24px, 4vw, 48px)",
            paddingBottom: "clamp(40px, 6vw, 60px)",
            width: "100%",
            minHeight: "100vh",
            boxSizing: "border-box",
            overflow: "visible",
            position: "relative",
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
                fontSize: "clamp(36px, 5.5vw, 64px)",
                color: "#000",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.1,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  width: "100%",
              }}>
                &quot;La plataforma que está transformando la educación financiera en México.&quot;
              </p>
              <p className="hero-tagline-sub" style={{
                fontSize: "clamp(18px, 1.2rem, 22px)",
                color: "#374151",
                fontWeight: 400,
                margin: "16px 0 0",
                lineHeight: 1.5,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      width: "100%",
              }}>
                BIZEN es la plataforma educativa que combina <span style={{ color: "#0F71FD", fontWeight: 600 }}>gamificación e inteligencia artificial</span> para enseñar <span style={{ color: "#0F71FD", fontWeight: 600 }}>finanzas personales</span> de forma práctica, clara y relevante para estudiantes de preparatoria y universidad.
              </p>
              </div>

            {/* Rectangles - separate full-width block, outside absolute container to avoid clipping */}
            <div className="hero-rectangles-wrapper">
              <div className="hero-rect-row">
                <div className="hero-card-link">
                  <div className="hero-rect-card">
                    <div className="hero-rect-inner">
                      <Image src="/hero1.png" alt="Billy con lápiz y libreta" fill style={{ objectFit: "contain" }} />
                    </div>
                  </div>
                  <span className="hero-circle-label">Finanzas<br />Personales</span>
                </div>
                <div className="hero-card-link">
                  <div className="hero-rect-card">
                    <div className="hero-rect-inner">
                      <Image src="/hero2.png" alt="Billy con tablet y gráfica financiera" fill style={{ objectFit: "contain" }} />
                    </div>
                  </div>
                  <span className="hero-circle-label">Simuladores<br />financieros</span>
                </div>
                <div className="hero-card-link">
                  <div className="hero-rect-card">
                    <div className="hero-rect-inner">
                      <Image src="/hero3.png" alt="Billy con alcancía" fill style={{ objectFit: "contain" }} />
                    </div>
                  </div>
                  <span className="hero-circle-label">Plan de<br />ahorro</span>
                </div>
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
        .main-page-container { overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; }
        .main-page-container main { overflow-x: hidden !important; max-width: 100% !important; width: 100% !important; }
        .main-page-container main > div { overflow-x: hidden !important; max-width: 100% !important; width: 100% !important; box-sizing: border-box !important; }
        .main-content-wrapper { overflow-x: hidden !important; max-width: 100% !important; width: 100% !important; box-sizing: border-box !important; }
        .hero-rectangles-wrapper { overflow-x: auto !important; overflow-y: visible !important; -webkit-overflow-scrolling: touch; }
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
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }

        /* Nav links: not bold, hover color change */
        .header-nav-link:hover {
          color: #0F62FE !important;
          transition: color 0.2s ease;
        }
        .header-nav-link {
          transition: color 0.2s ease;
        }

        /* Crear cuenta button: solid blue, no shimmer */
        .crear-cuenta-button {
          background: #0F62FE !important;
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
            border-radius: 11px !important;
          }
          .hero-top-block {
            top: clamp(44px, 5vw, 64px) !important;
            width: min(96vw, 1200px) !important;
            max-width: 1200px !important;
          }
          .hero-tagline {
            font-size: clamp(38px, 5vw, 58px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(18px, 1.15rem, 21px) !important;
            margin-top: 18px !important;
          }
          .hero-rectangles-wrapper {
            margin-top: clamp(260px, 40vw, 380px) !important;
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
            font-size: clamp(40px, 5.2vw, 62px) !important;
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
            font-size: clamp(42px, 5.5vw, 66px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(19px, 1.25rem, 23px) !important;
            margin-top: 20px !important;
          }
          .hero-rectangles-wrapper {
            margin-top: clamp(280px, 41vw, 420px) !important;
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
            border-radius: 12px !important;
          }
          /* Hero section: bigger tagline, subtext, rectangles and labels */
          .hero-top-block {
            top: clamp(48px, 6vw, 88px) !important;
            max-width: 1280px !important;
            width: min(96vw, 1280px) !important;
          }
          .hero-tagline {
            font-size: clamp(42px, 5.5vw, 72px) !important;
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
            font-size: clamp(48px, 6vw, 80px) !important;
          }
          .hero-tagline-sub {
            font-size: clamp(20px, 1.3rem, 26px) !important;
            margin-top: 24px !important;
          }
          .hero-rect-row {
            gap: clamp(40px, 5vw, 80px) !important;
          }
          .hero-rectangles-wrapper {
            margin-top: clamp(320px, 42vw, 480px) !important;
          }
          .hero-rect-card {
            width: clamp(300px, 28vw, 440px) !important;
            height: clamp(165px, 15vw, 240px) !important;
          }
          .hero-circle-label {
            font-size: clamp(18px, 2.2vw, 24px) !important;
          }
        }

        /* Rectangles wrapper - 3 cards always in one row, scroll horizontally on narrow screens */
        .hero-rectangles-wrapper {
          width: 100%;
          max-width: 100%;
          margin-top: clamp(240px, 45vw, 420px);
          padding: 0 clamp(24px, 4vw, 48px);
          box-sizing: border-box;
          overflow-x: auto;
          position: relative;
          z-index: 5;
        }
        @media (max-width: 768px) {
          .hero-rectangles-wrapper {
            margin-top: clamp(220px, 55vw, 320px);
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
        }
        .hero-circle-label {
          font-size: clamp(14px, 1.8vw, 18px);
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          line-height: 1.4;
        }
        
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
          background: #0F62FE;
          border-radius: clamp(7px, 1.2vw, 9px);
          z-index: -1;
        }
        
        .empieza-ya-button {
          background: #0F62FE !important;
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

        {/* Landing Page Content */}
        <LandingContent />
      </main >

      {/* Footer */}
      < LandingWaitlistFooter />
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

const audienceEscuelas = {
  badge: "Para escuelas",
  bullets: ["Licencia por escuela", "Panel docente y reportes", "Onboarding guiado"],
  cta: "Agendar demo",
  ctaHref: "#contacto",
}

function LandingContent() {
  const primary = "#0F71FD"
  const accent = "#10B981"
  const audienceContent = audienceEscuelas

  return (
    <>
      <style>{landingCSS}</style>

      {/* Logo carousel above Planes */}
      <section className="logos-carousel-section" style={{ background: "transparent", padding: "clamp(32px, 5vw, 48px) 0", overflow: "hidden" }}>
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

      {/* ¿Qué es BIZEN? - solution intro */}
      <section id="que-es-bizen" className="section solution-intro reveal-element" style={{ background: "linear-gradient(180deg, rgba(248, 251, 255, 0.5) 0%, transparent 50%)", padding: "clamp(56px, 10vw, 88px) clamp(16px, 4vw, 24px)" }}>
        <div className="container" style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{
            textAlign: "center",
            padding: "clamp(40px, 6vw, 56px) clamp(24px, 4vw, 40px)",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.85)",
            border: "1px solid rgba(15, 98, 254, 0.12)",
            boxShadow: "0 4px 24px rgba(15, 98, 254, 0.06)",
          }}>
            <h2 style={{
              margin: "0 0 clamp(24px, 3vw, 32px)",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#111",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}>
              ¿Qué es BIZEN?
            </h2>
            <p style={{
              margin: "0 0 28px",
              fontSize: "clamp(17px, 1.15rem, 19px)",
              color: "#374151",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              lineHeight: 1.65,
              maxWidth: "560px",
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              BIZEN es la plataforma de educación financiera que combina gamificación e inteligencia artificial para que tus estudiantes aprendan de forma práctica. Pensada para escuelas: cursos claros, simuladores reales y un progreso que puedes ver y medir.
            </p>
            <ul style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "clamp(12px, 2vw, 20px)",
            }}>
              {["Cursos cortos", "Simuladores", "Progreso medible"].map((item, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  borderRadius: "999px",
                  background: "rgba(15, 98, 254, 0.1)",
                  border: "1px solid rgba(15, 98, 254, 0.22)",
                  fontSize: "clamp(14px, 1rem, 16px)",
                  fontWeight: 600,
                  color: "#0F62FE",
                  fontFamily: "'Inter', sans-serif",
                  transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                }} className="que-es-bizen-pill">
                  <span style={{ color: "#0F62FE", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Audience - Para escuelas */}
      <section id="audiencia" className="section audience-switcher reveal-element" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(248, 251, 255, 0.4) 50%, transparent 100%)", padding: "clamp(56px, 10vw, 88px) clamp(16px, 4vw, 24px)" }}>
        <div className="container" style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div style={{ width: "100%" }}>
            <div role="tabpanel" style={{
              textAlign: "center",
              padding: "clamp(36px, 5vw, 52px) clamp(28px, 4vw, 48px)",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(15, 98, 254, 0.12)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(15, 98, 254, 0.06)",
            }}>
              <span style={{
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: "999px",
                fontSize: "clamp(13px, 0.9rem, 14px)",
                fontWeight: 700,
                color: "#0F62FE",
                background: "rgba(15, 98, 254, 0.12)",
                marginBottom: "28px",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}>
                {audienceContent.badge}
              </span>
              <ul style={{
                listStyle: "none",
                margin: "0 0 32px",
                padding: 0,
                textAlign: "left",
                maxWidth: "420px",
                marginLeft: "auto",
                marginRight: "auto",
              }}>
                {audienceContent.bullets.map((bullet, i) => (
                  <li key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "16px",
                    fontSize: "clamp(16px, 1.05rem, 18px)",
                    color: "#374151",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.45,
                  }}>
                    <span style={{ color: "#0F62FE", flexShrink: 0, fontWeight: 700, fontSize: "18px" }}>✓</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link
                href={audienceContent.ctaHref}
                style={{
                  display: "inline-block",
                  padding: "16px 36px",
                  fontSize: "clamp(17px, 1.05rem, 18px)",
                  fontWeight: 600,
                  color: "#fff",
                  background: "#0F62FE",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  transition: "background 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 4px 16px rgba(15, 98, 254, 0.35)",
                }}
                className="audience-cta-link"
              >
                {audienceContent.cta}
              </Link>
            </div>
          </div>
          <style>{`
            .audience-tab-btn:focus-visible {
              outline: 2px solid #0F62FE;
              outline-offset: 2px;
            }
            .audience-cta-link:hover {
              background: #0a4fc4 !important;
              box-shadow: 0 6px 20px rgba(15, 98, 254, 0.4) !important;
            }
            .audience-cta-link:focus-visible {
              outline: 2px solid #0F62FE;
              outline-offset: 2px;
            }
          `}</style>
        </div>
      </section>

      {/* El problema - pain points, centered */}
      <section id="problema" className="section problem-section reveal-element reveal-delay-1" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(248, 251, 255, 0.5) 25%, rgba(239, 246, 255, 0.45) 75%, transparent 100%)", padding: "clamp(64px, 10vw, 112px) clamp(20px, 4vw, 32px)", textAlign: "center" }}>
        <div className="container problem-section-inner" style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
          <h2 style={{
            margin: "0 0 16px",
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 800,
            color: "#111",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}>
            El problema
          </h2>
          <p style={{
            margin: "0 0 clamp(48px, 8vw, 64px)",
            fontSize: "clamp(17px, 1.1rem, 19px)",
            color: "#475569",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.6,
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            La educación financiera tropieza con lo mismo.
          </p>
          <div className="problem-cards-list" style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(20px, 3vw, 28px)",
            alignItems: "center",
            width: "100%",
          }}>
            {problemSchools.map((card, i) => (
              <div key={i} className="problem-card" style={{
                width: "100%",
                maxWidth: "560px",
                padding: "clamp(24px, 3vw, 32px) clamp(28px, 4vw, 40px)",
                borderRadius: "20px",
                background: "#fff",
                border: "2px solid rgba(15, 98, 254, 0.12)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(15, 98, 254, 0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease",
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "20px", fontWeight: 800, color: "#DC2626", fontFamily: "'Inter', sans-serif" }}>{i + 1}</span>
                </div>
                <h3 style={{
                  margin: "0 0 10px",
                  fontSize: "clamp(18px, 1.25rem, 22px)",
                  fontWeight: 700,
                  color: "#1e293b",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  lineHeight: 1.3,
                }}>
                  {card.title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: "clamp(15px, 1rem, 16px)",
                  color: "#64748b",
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: "420px",
                }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <style>{`
            .problem-section-inner { display: flex; flex-direction: column; align-items: center; }
            .problem-card:hover {
              border-color: rgba(15, 98, 254, 0.25) !important;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(15, 98, 254, 0.12) !important;
              transform: translateY(-2px);
            }
            @media (max-width: 767px) {
              .problem-cards-list { width: 100%; }
            }
          `}</style>
        </div>
      </section>

      {/* Cómo funciona - 3 steps */}
      <section id="como-funciona" className="section how-it-works reveal-element reveal-delay-2" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(248, 251, 255, 0.35) 20%, rgba(241, 245, 249, 0.3) 80%, transparent 100%)", padding: "clamp(56px, 10vw, 96px) clamp(16px, 4vw, 24px)" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 56px)" }}>
            <h2 style={{
              margin: "0 0 12px",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
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
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "24px", height: "24px", borderRadius: "50%", background: "#0F62FE", color: "#fff", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
                    {i + 1}
                  </span>
                  {i === 0 && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0F62FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  )}
                  {i === 1 && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0F62FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                  )}
                  {i === 2 && (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0F62FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                  )}
                </div>
                <h3 style={{
                  margin: "0 0 20px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontWeight: 700,
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

      {/* PRECIOS - plan squares + CTA merged, no "Planes" title */}
      <section id="precios" className="section pricing reveal-element reveal-delay-2" style={{ background: "transparent" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", textAlign: "center" }}>
            {/* CTA first */}
            <div style={{ marginBottom: "clamp(40px, 6vw, 56px)", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
              <h2 style={{
                margin: 0,
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 800,
                color: "#111",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                lineHeight: 1.2,
              }}>
                ¿Listo para empezar?
              </h2>
              <p style={{
                margin: "16px 0 28px",
                fontSize: "clamp(16px, 1.1rem, 20px)",
                color: "#475569",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                lineHeight: 1.5,
              }}>
                Lleva educación financiera práctica a tu institución. Agenda una demo y conoce la plataforma.
              </p>
              <Link
                href="#contacto"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  fontSize: "clamp(17px, 1.1rem, 19px)",
                  fontWeight: 600,
                  color: "#fff",
                  background: "#0F62FE",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  transition: "background 0.2s ease, filter 0.2s ease",
                  boxShadow: "0 4px 14px rgba(15, 98, 254, 0.4)",
                }}
                className="cta-button"
              >
                Agendar demo
              </Link>
            </div>
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
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
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

      {/* SCHEDULE A DEMO - lesson-style card, matches BIZEN UI */}
      <section id="contacto" className="section contact reveal-element" style={{
        background: "transparent",
        paddingTop: "clamp(64px, 10vw, 96px)",
        paddingBottom: "clamp(96px, 12vw, 160px)",
        width: "100%",
        boxSizing: "border-box",
      }}>
        <div style={{
          maxWidth: "min(98vw, 1200px)",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 48px)",
          width: "100%",
          boxSizing: "border-box",
        }}>
          <div className="schedule-demo-card schedule-demo-two-col" style={{
            position: "relative",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            padding: "clamp(28px, 5vw, 48px) clamp(28px, 4vw, 48px)",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(32px, 5vw, 48px)",
          }}>
            <div style={{
              position: "absolute",
              top: "12px",
              right: "clamp(24px, 5vw, 48px)",
              zIndex: 2,
              width: "clamp(72px, 10vw, 100px)",
              height: "auto",
              pointerEvents: "none",
            }}>
              <Image src="/hero4.png" alt="" width={100} height={100} style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="schedule-demo-content">
              <h2 style={{
                fontSize: "clamp(24px, 3.2vw, 30px)",
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 12px 0",
                lineHeight: 1.25,
              }}>
                Ver cómo BIZEN prepara a los estudiantes para la vida real
              </h2>
              <p style={{
                fontSize: "clamp(15px, 1.9vw, 17px)",
                color: "#475569",
                margin: "0 0 24px 0",
                lineHeight: 1.5,
              }}>
                15 minutos. Sin presión. Solo claridad.
              </p>

              <ul style={{
                listStyle: "none",
                margin: "0 0 24px 0",
                padding: 0,
                display: "grid",
                gap: "10px",
              }}>
                {["Cómo funcionan las lecciones de BIZEN", "Cómo las escuelas siguen el progreso de los estudiantes", "Lo fácil que es implementar"].map((item, i) => (
                  <li key={i} style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    fontSize: "clamp(15px, 1.8vw, 16px)",
                    color: "#334155",
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: "#0F62FE", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p style={{
                fontSize: "clamp(14px, 1.7vw, 15px)",
                color: "#64748b",
                margin: 0,
                lineHeight: 1.6,
              }}>
                Ideal para secundarias y preparatorias, directores, coordinadores académicos y escuelas que buscan educación práctica.
              </p>
            </div>

            <div className="schedule-demo-form-wrap" style={{
              background: "#f8fafc",
              borderRadius: "14px",
              padding: "24px 28px",
              border: "1px solid #e2e8f0",
            }}>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const name = formData.get("name") as string
                const email = formData.get("email") as string
                const school = formData.get("school") as string
                const role = formData.get("role") as string
                const students = formData.get("students") as string
                const parts = [`Escuela: ${school || "—"}`, `Rol: ${role || "—"}`, students ? `Estudiantes: ${students}` : ""].filter(Boolean)
                const message = parts.join("\n")

                const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
                const originalText = submitButton.textContent
                submitButton.disabled = true
                submitButton.textContent = "Enviando…"

                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                  })
                  const data = await res.json()
                  if (data.success) {
                    alert(data.message || "Gracias. Te contactaremos pronto.")
                    form.reset()
                  } else {
                    alert(data.message || "Error. Intenta de nuevo.")
                  }
                } catch {
                  alert("Error al enviar. Intenta de nuevo más tarde.")
                } finally {
                  submitButton.disabled = false
                  submitButton.textContent = originalText || "Agendar demo"
                }
              }}
              className="schedule-demo-form"
              style={{ display: "grid", gap: "18px 24px" }}
            >
              {[
                { id: "demo-name", name: "name", label: "Nombre completo", type: "text", required: true },
                { id: "demo-email", name: "email", label: "Email", type: "email", required: true },
                { id: "demo-school", name: "school", label: "Nombre de la escuela", type: "text", required: true },
                { id: "demo-role", name: "role", label: "Tu rol", type: "text", required: true, placeholder: "ej. Director, Coordinador académico" },
                { id: "demo-students", name: "students", label: "Número de estudiantes (opcional)", type: "text", required: false },
              ].map((f) => (
                <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: f.name === "students" ? "1 / -1" : undefined }}>
                  <label htmlFor={f.id} style={{ fontWeight: 600, fontSize: "14px", color: "#475569" }}>
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    name={f.name}
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "15px",
                      borderRadius: "10px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      color: "#1e293b",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0F62FE"
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.2)"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#cbd5e1"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />
                </div>
              ))}

              <button
                type="submit"
                style={{
                  width: "100%",
                  marginTop: "8px",
                  gridColumn: "1 / -1",
                  padding: "16px 24px",
                  minHeight: "52px",
                  fontSize: "clamp(17px, 2vw, 20px)",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "#0F62FE",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(15, 98, 254, 0.35)",
                  transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1d4ed8"
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(15, 98, 254, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0F62FE"
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(15, 98, 254, 0.35)"
                }}
              >
                Agendar demo
              </button>
            </form>
            </div>

            <p style={{
              margin: "24px 0 0 0",
              gridColumn: "1 / -1",
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: 1.5,
            }}>
              Creado específicamente para estudiantes de secundaria y preparatoria.
            </p>
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
  --c-text:#1E293B;
  --c-muted:#334155;
  --c-bg:transparent;
  --c-card:#FFFFFF;
  --c-border:rgba(15, 23, 42, 0.12);
  --radius:16px;
  --shadow:0 10px 30px rgba(0,0,0,.06);
  --shadow-sm:0 4px 16px rgba(0,0,0,.06);
  --transition:180ms cubic-bezier(.2,.8,.2,1);
}

body {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 25%, #eef6ff 55%, #e3f0ff 85%, #dbeafe 100%) !important;
  background-attachment: fixed !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
}

html {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 25%, #eef6ff 55%, #e3f0ff 85%, #dbeafe 100%) !important;
  background-attachment: fixed !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  scroll-behavior: smooth;
}

.section{padding: clamp(64px, 8vw, 120px) 0; scroll-margin-top: 80px; background: transparent !important;}
        .section.contact,
        #contacto {
          padding-bottom: clamp(64px, 8vw, 128px) !important;
          overflow: visible !important;
        }
.section-head{max-width:900px; margin:0 auto 28px auto; text-align:center; overflow:visible; word-wrap:break-word; overflow-wrap:break-word;}
.section-head h2{margin:0 0 8px 0; font-size:clamp(28px, 4.2vw, 40px); line-height:1.15; white-space:normal;}
.section-head p{margin:0; color:var(--c-muted); white-space:normal;}

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
.badges li{background:white; border:1px solid var(--c-border); padding:8px 12px; border-radius:999px; font-weight:700;}
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
.benefit .benefit-icon{width:40px; height:40px; display:grid; place-items:center; background:rgba(16,185,129,.15); color:#065F46; border-radius:12px; font-weight:900;}

.course-media img{width:100%; height:auto; aspect-ratio: 16/10; object-fit:cover}
.course-title{margin:2px 0 8px}
.course-body{padding:6px 2px 8px 2px}
.course-meta{display:flex; align-items:center; gap:8px; color:var(--c-muted)}
.pill{display:inline-flex; align-items:center; height:28px; padding:0 10px; border-radius:999px; background:rgba(14,165,233,.12); color:#0b77a1; font-weight:800; font-size:13px;}
.dot{opacity:.4}
.course-actions{padding-top:6px}

.plan{position:relative; padding:32px 24px; display:flex; flex-direction:column; height:auto; min-height:480px; border:1px solid rgba(255, 255, 255, 0.3); background:rgba(255, 255, 255, 0.6); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border-radius:32px; box-shadow:0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow:visible;}
.plan:hover{transform:translateY(-8px); box-shadow:0 20px 40px rgba(15, 98, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6); border-color:rgba(15, 98, 254, 0.3);}
.plan--highlight{background:rgba(240, 247, 255, 0.7); border:2px solid rgba(15, 98, 254, 0.4); box-shadow:0 12px 32px rgba(15, 98, 254, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6); position:relative; overflow:visible;}
.plan--highlight::before{content:""; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%); background-size:200% auto; animation:shimmer 3s ease-in-out infinite;}
.tag{position:absolute; top:16px; right:16px; background:linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%); color:#fff; border-radius:999px; font-weight:800; padding:8px 14px; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(15, 98, 254, 0.3); z-index:2;}
.plan-name{font-size:clamp(24px, 3vw, 32px); margin:0 0 12px 0; font-weight:900; letter-spacing:-0.02em; background:linear-gradient(135deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s ease-in-out infinite; font-family:'Inter', system-ui, -apple-system, sans-serif; white-space:normal; word-wrap:break-word; overflow-wrap:break-word;}
.plan-note{font-size:14px; margin:0 0 24px 0; color:var(--c-muted); font-weight:500; white-space:normal;}
.plan-list{list-style:none; margin:0 0 24px 0; padding:0; display:grid; gap:14px; flex-grow:1; overflow:visible;}
.plan-list li{display:flex; gap:12px; align-items:flex-start; font-size:15px; line-height:1.6; color:var(--c-text); white-space:normal; word-wrap:break-word; overflow-wrap:break-word;}
.check{color:var(--c-accent); font-weight:900; font-size:18px; min-width:20px; margin-top:2px;}
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
  font-weight:800;
  font-family:'Inter', system-ui, -apple-system, sans-serif;
  font-size:clamp(16px, 2vw, 20px);
  color:#0F62FE;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin:center;
  word-wrap:break-word;
  overflow-wrap:break-word;
  white-space:normal;
  flex-wrap:wrap;
  gap:8px;
}
.accordion-trigger:hover, .accordion-trigger:active{transform:none; color:#0F62FE}
.accordion-trigger:focus-visible{outline:2px solid rgba(15, 98, 254, 0.6); border-radius:20px}
.chev{transition:transform var(--transition); color:#0F62FE}
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
    background: linear-gradient(180deg, #ffffff 0%, #f8fbff 25%, #eef6ff 55%, #e3f0ff 85%, #dbeafe 100%) !important;
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
    background: linear-gradient(180deg, #ffffff 0%, #f8fbff 25%, #eef6ff 55%, #e3f0ff 85%, #dbeafe 100%) !important;
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

