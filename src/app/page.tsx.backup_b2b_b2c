"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LandingWaitlistFooter } from "@/components/LandingWaitlistFooter";
import {
  ClipboardCheck,
  LogIn,
  ChevronRight,
  Play,
  UserPlus,
  Calendar,
  User,
  Check,
  X,
  MessageSquare,
  Bot,
  Crown,
  Sword,
  Medal,
  CircleDollarSign,
  Flame,
  Store,
} from "lucide-react";
import { CheckIcon, CrossIcon } from "@/components/CustomIcons";
import * as React from "react";
import { TickerTape } from "@/components/simulators/stocks/TickerTape";
import Hero3DScene from "@/components/landing/Hero3DScene";
import { PremiumButton } from "@/components/ui/PremiumButton";

// Centralized navigation data
const NAV_LINKS: { label: string; href: string; persona?: "instituciones" | "estudiantes" }[] = [
  { label: "Inicio", href: "/" },
  { label: "Somos BIZEN", href: "#sobre-bizen" },
  { label: "Perfil educativo", href: "#perfiles" },
  { label: "Impacto social", href: "#impacto" },
];

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic";

const modalInputStyle = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "15px",
  borderRadius: "12px",
  background: "#FBFAF5",
  border: "1px solid #e2e8f0",
  color: "#1e293b",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
  outline: "none",
  textAlign: "center" as const,
};

export default function WelcomePage() {
  const { user, dbProfile, loading } = useAuth();
  const router = useRouter();
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeHeroCard, setActiveHeroCard] = useState<number | null>(null);
  const [activeProfile, setActiveProfile] = useState<
    "docentes" | "estudiantes" | "padres"
  >("docentes");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [navScrolled, setNavScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activePersona, setActivePersona] = useState<"instituciones" | "estudiantes">("instituciones");


  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (authDropdownOpen && !target.closest(".auth-dropdown-wrapper")) {
        setAuthDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);

    // Scroll-aware nav
    const handleScroll = () => {
      // Hero section is roughly 100vh tall, switch after scrolling past it
      setNavScrolled(window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [authDropdownOpen]);

  // Fix scroll when mobile menu is open (Robust fix for iOS)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const heroCardSummaries: { title: string; summary: string }[] = [
    {
      title: "Finanzas personales",
      summary:
        "Aprendemos a controlar ingresos, gastos y deudas con cosas simples como presupuesto y hábitos.",
    },
    {
      title: "Simuladores financieros",
      summary:
        "Probamos escenarios (crédito, inversión, ahorro) para ver resultados sin arriesgar dinero real.",
    },
    {
      title: "Plan de ahorro",
      summary:
        "Definimos una meta y un monto mensual para ahorrar con orden y constancia.",
    },
  ];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const mouthInterval = setInterval(() => {
      setIsMouthOpen((prev) => !prev);
    }, 400);

    return () => clearInterval(mouthInterval);
  }, []);

  // Redirect home to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      if (dbProfile) {
        if (dbProfile.role === 'teacher' || dbProfile.role === 'school_admin') {
          router.replace('/teacher/dashboard');
          return;
        }
      }
      router.replace('/dashboard');
    }
  }, [user, loading, dbProfile, router]);

  // Reveal-on-scroll: add .revealed when .reveal-element enters viewport
  useEffect(() => {
    if (!mounted || typeof window === "undefined" || !window.IntersectionObserver) return;
    
    // Give a small delay to ensure all elements are rendered
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(".reveal-element");
      if (!els.length) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("revealed");
          });
        },
        { rootMargin: "0px 0px -60px 0px", threshold: 0.1 },
      );
      
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted]);

  const gradientStyle = {
    background:
      "linear-gradient(135deg, #010812 0%, #020d1f 20%, #031535 40%, #041d4d 60%, #051a44 80%, #020c1c 100%)",
    backgroundAttachment: "scroll" as const,
    overflow: "visible",
    position: "relative" as const,
  };

  if (!mounted || (user && !loading)) {
    return <div style={{ minHeight: '100vh', background: '#010a1c' }} />;
  }

  return (
    <div
      style={{
        background: "transparent",
        flex: "1 0 auto",
        height: "auto",
        width: "100%",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
      }}
      className="main-page-container landing-page-root"
      data-landing-root
    >
      {/* Header: transparent on hero, glass when scrolled */}
      <header
        className="main-header landing-header glass-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          boxSizing: "border-box",
          padding: "clamp(12px, 1.5vw, 18px) 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: navScrolled ? "rgba(255, 255, 255, 0.94)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: navScrolled ? "blur(20px)" : "none",
          zIndex: 10000,
          borderBottom: navScrolled ? "1px solid rgba(0, 0, 0, 0.06)" : "none",
          boxShadow: navScrolled ? "0 2px 20px rgba(0, 0, 0, 0.08)" : "none",
          transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
          <div
            className="landing-header-container"
            style={{
              width: "100%",
              maxWidth: "1200px",
              padding: "0 clamp(16px, 4vw, 48px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
            aria-label="BIZEN home"
          >
            <span
              style={{
                fontSize: "clamp(18px, 2vw, 22px)",
                fontWeight: 700,
                color: navScrolled ? "var(--primary)" : "#FFFFFF",
                letterSpacing: "0.01em",
                transition: "color 0.3s ease",
                textShadow: navScrolled
                  ? "none"
                  : "0 0 20px rgba(15, 98, 254, 0.4)",
              }}
            >
              BIZEN
            </span>
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            className="landing-header-mobile-menu-btn"
            aria-label="Abrir menú"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((o) => !o)}
            style={{
              display: "none",
              flexDirection: "column",
              gap: "6px",
              width: 44,
              height: 44,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              order: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 26,
                height: 2,
                background: navScrolled ? "#0056E7" : "rgba(255,255,255,0.9)",
                borderRadius: 2,
                transition: "0.3s",
                transform: mobileMenuOpen
                  ? "rotate(45deg) translateY(8px)"
                  : "none",
              }}
            />
            <div
              style={{
                width: 26,
                height: 2,
                background: navScrolled ? "#0056E7" : "rgba(255,255,255,0.9)",
                borderRadius: 2,
                transition: "0.3s",
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <div
              style={{
                width: 26,
                height: 2,
                background: navScrolled ? "#0056E7" : "rgba(255,255,255,0.9)",
                borderRadius: 2,
                transition: "0.3s",
                transform: mobileMenuOpen
                  ? "rotate(-45deg) translateY(-8px)"
                  : "none",
              }}
            />
          </button>

          {/* Centered pill nav — scroll-aware: dark on hero, light on white sections */}
          <nav
            className={`header-bar-nav landing-header-nav ${navScrolled ? "is-light" : "is-dark"}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "var(--radius-full)",
              padding: "6px 8px",
              transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
              flexShrink: 0,
            }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="header-nav-link landing-header-nav-link"
                onClick={() => { if (link.persona) setActivePersona(link.persona); }}
                style={{
                  fontSize: "clamp(13px, 1.3vw, 15px)",
                  fontWeight: link.persona ? 600 : 500,
                  color: navScrolled ? "var(--primary)" : "rgba(255,255,255,0.9)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-full)",
                  transition: "color 0.3s ease",
                }}
              >
                {link.label}
              </Link>
            ))}

          </nav>

          {/* Header Actions */}
          <div
            className="landing-header-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
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
                fontWeight: 500,
                color: navScrolled ? "#0056E7" : "rgba(255,255,255,0.85)",
                textDecoration: "none",
                borderRadius: "9999px",
                background: navScrolled
                  ? "rgba(0, 86, 231, 0.08)"
                  : "rgba(255, 255, 255, 0.1)",
                border: navScrolled
                  ? "none"
                  : "1px solid rgba(255, 255, 255, 0.18)",
                transition: "all 0.3s ease",
              }}
            >
              <Calendar size={16} />
              <span className="hide-tablet">Agendar DEMO</span>
            </a>

            {/* Comenzar ahora with Dropdown */}
            <div
              className={`auth-dropdown-wrapper ${authDropdownOpen ? "is-open" : ""}`}
            >
              <button
                className="premium-button landing-header-actions-main landing-hero-cta-primary"
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
                  backgroundImage:
                    "linear-gradient(110deg, #0056E7 0%, #1983FD 50%, #0056E7 100%)",
                  backgroundSize: "200% auto",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  boxShadow: navScrolled
                    ? "0 2px 10px rgba(0, 86, 231, 0.25)"
                    : "0 4px 20px rgba(0, 86, 231, 0.45), 0 0 0 1px rgba(255,255,255,0.15) inset",
                  transition: "all 0.3s ease",
                }}
              >
                Comenzar ahora
              </button>
              <div
                className="auth-dropdown-content"
                style={{
                  opacity: authDropdownOpen ? 1 : 0,
                  visibility: authDropdownOpen ? "visible" : "hidden",
                  transform: authDropdownOpen
                    ? "translateY(0)"
                    : "translateY(10px)",
                }}
              >
                <Link href="/diagnostic" className="auth-dropdown-item">
                  <ClipboardCheck size={18} />
                  <span>Quiz diagnóstico</span>
                </Link>
                <Link href="/login" className="auth-dropdown-item">
                  <LogIn size={18} />
                  <span>Ya tengo una cuenta</span>
                </Link>
                <Link href="/signup" className="auth-dropdown-item">
                  <UserPlus size={18} />
                  <span>Empieza ahora</span>
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
            zIndex: 9999,
            background:
              "linear-gradient(135deg, #020e27 0%, #041640 40%, #061a4a 70%, #020e27 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            padding: "40px 0",
            boxSizing: "border-box",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Decorative elements to match login/signup */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage:
                "linear-gradient(rgba(0,86,231,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,231,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-10%",
              left: "-10%",
              width: "70vw",
              height: "70vw",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,86,231,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "-10%",
              width: "60vw",
              height: "60vw",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(25,131,253,0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />

          <div
            className="landing-mobile-nav-drawer"
            style={{
              width: "100%",
              maxWidth: "min(400px, 88vw)",
              padding: "20px clamp(16px, 5vw, 24px)",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: "clamp(60px, 8vh, 100px)", width: "100%" }} />



            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
                width: "100%",
              }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    width: "100%",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.9)",
                    textDecoration: "none",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    transition: "all 0.2s",
                    display: "block",
                    boxSizing: "border-box",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div
                style={{
                  height: "1px",
                  width: "80%",
                  background: "rgba(255,255,255,0.1)",
                  margin: "10px 0",
                }}
              />

              <Link
                href="/diagnostic"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: "100%",
                  fontSize: "18px",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  padding: "16px",
                  borderRadius: "14px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ClipboardCheck size={20} />
                Quiz diagnóstico
              </Link>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: "100%",
                  fontSize: "18px",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: "rgba(25, 131, 253, 0.2)",
                  border: "1.5px solid rgba(25, 131, 253, 0.3)",
                  padding: "16px",
                  borderRadius: "14px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <LogIn size={20} />
                Ya tengo una cuenta
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: "100%",
                  fontSize: "18px",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: "linear-gradient(135deg, #0056E7, #1983FD)",
                  padding: "16px",
                  borderRadius: "14px",
                  boxShadow: "0 8px 20px rgba(0, 86, 231, 0.3)",
                }}
              >
                <UserPlus size={20} />
                Empieza ahora
              </Link>
              <a
                href="https://calendly.com/diego-bizen"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: "100%",
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "16px",
                }}
              >
                <Calendar size={18} />
                Agendar demo
              </a>
            </nav>
          </div>
        </div>
      )}
      <main
        className="landing-main"
        style={{
          flex: "1 0 auto",
          width: "100%",
          maxWidth: "100vw",
          display: "block",
          overflowX: "clip",
        }}
      >
        <div
          className="landing-gradient-wrapper"
          style={{
            ...gradientStyle,
            background:
              "linear-gradient(180deg, #010a1c 0%, #020f28 30%, #031535 60%, #020c1c 100%)",
          }}
        >
          {/* Hero Section */}
          <div
            className="landing-hero-wrapper"
            style={{
              paddingTop: "clamp(100px, 14vw, 180px)",
              paddingBottom: "clamp(80px, 12vw, 160px)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              minHeight: "100vh",
              overflow: "visible",
              isolation: "isolate",
              background:
                "radial-gradient(ellipse at 50% -10%, rgba(0, 86, 231, 0.2) 0%, transparent 60%)",
            }}
          >
            {/* Grid dot pattern */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                backgroundImage:
                  "linear-gradient(rgba(0,86,231,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,231,0.07) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                animation: "grid-fade-in 1.5s ease forwards",
                opacity: 0,
                pointerEvents: "none",
              }}
            />

            {/* Glow orb 1 — top-left blue */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "-10%",
                left: "-8%",
                width: "min(70vw, 600px)",
                height: "min(70vw, 600px)",
                background:
                  "radial-gradient(circle, rgba(0, 86, 231, 0.3) 0%, rgba(0, 86, 231, 0.0) 70%)",
                borderRadius: "50%",
                filter: "blur(50px)",
                animation: "landing-orb-drift 12s ease-in-out infinite",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Glow orb 2 — bottom-right teal-blue — kept well within bounds */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: "-10%",
                right: "-5%",
                width: "min(55vw, 500px)",
                height: "min(55vw, 500px)",
                background:
                  "radial-gradient(circle, rgba(25, 131, 253, 0.22) 0%, rgba(25, 131, 253, 0.0) 70%)",
                borderRadius: "50%",
                filter: "blur(55px)",
                animation: "landing-orb-drift 15s ease-in-out infinite 3s",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Glow orb 3 — center, subtle teal accent */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "35%",
                right: "20%",
                width: "min(35vw, 350px)",
                height: "min(35vw, 350px)",
                background:
                  "radial-gradient(circle, rgba(96, 165, 250, 0.14) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(35px)",
                animation: "pulse-glow-slow 9s ease-in-out infinite 1.5s",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Floating Decorative Cards */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
              @keyframes float-hero-card {
                0% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
                50% { transform: translateY(-15px) rotate(1deg); opacity: 1; }
                100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
              }
              .floating-card-glass {
                background: var(--glass-bg);
                backdrop-filter: blur(var(--glass-blur));
                -webkit-backdrop-filter: blur(var(--glass-blur));
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-md);
                padding: 12px 20px;
                display: flex;
                align-items: center;
                white-space: nowrap;
                gap: 12px;
                box-shadow: var(--shadow-md);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                animation: float-hero-card 4s ease-in-out infinite;
                z-index: 2;
                pointer-events: none;
              }
              .floating-card-glass:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.2);
              }
              @media (max-width: 1024px) {
                .floating-card-glass { display: none; }
              }
            `,
              }}
            />

            {/* Card 1: AI Billy */}
            <div
              className="floating-card-glass"
              style={{
                position: "absolute",
                top: "18%",
                left: "10%",
                animationDelay: "0s",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#4096ff",
                  boxShadow: "0 0 10px #4096ff",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MessageSquare
                  size={14}
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
                <span
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  Billy: tu Mentor de IA
                </span>
              </div>
            </div>

            {/* Card 2: Gamificado */}
            <div
              className="floating-card-glass"
              style={{
                position: "absolute",
                top: "42%",
                right: "10%",
                animationDelay: "1.2s",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#19d1cb",
                  boxShadow: "0 0 10px #19d1cb",
                }}
              />
              <span
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                Gamificación Activa
              </span>
            </div>


            {/* Floating star-particles layer */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                backgroundImage: `
                radial-gradient(1.5px 1.5px at 15% 20%, rgba(255,255,255,0.35) 0%, transparent 100%),
                radial-gradient(1px 1px at 75% 8%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(1.5px 1.5px at 42% 55%, rgba(255,255,255,0.2) 0%, transparent 100%),
                radial-gradient(1px 1px at 88% 40%, rgba(255,255,255,0.25) 0%, transparent 100%),
                radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.2) 0%, transparent 100%),
                radial-gradient(1.5px 1.5px at 65% 72%, rgba(255,255,255,0.15) 0%, transparent 100%),
                radial-gradient(1px 1px at 55% 30%, rgba(180,210,255,0.3) 0%, transparent 100%),
                radial-gradient(1px 1px at 10% 65%, rgba(180,210,255,0.2) 0%, transparent 100%)
              `,
                backgroundSize: "100% 100%",
              }}
            />

            <Hero3DScene />

            {/* Mascot leaning out from the left - updated character */}
            <div
              className="landing-hero-mascot reveal-element"
              style={{
                position: "absolute",
                left: "-200px", // Pushed even further left
                top: "clamp(120px, 18vw, 260px)",
                zIndex: 0,
                width: "clamp(450px, 35vw, 750px)",
                transform: "translateX(0)",
                pointerEvents: "none",
                transition: "all 1s cubic-bezier(0.23, 1, 0.32, 1)",
                opacity: 0,
              }}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                .landing-hero-mascot.revealed {
                  opacity: 1 !important;
                  transform: translateX(0) translateY(0) !important;
                }
                @media (max-width: 1400px) {
                  .landing-hero-mascot {
                    left: -170px !important;
                    width: clamp(400px, 32vw, 650px) !important;
                  }
                }
                @media (max-width: 1200px) {
                  .landing-hero-mascot {
                    left: -140px !important;
                    width: clamp(350px, 28vw, 550px) !important;
                  }
                }
                @media (max-width: 1023px) {
                  .landing-hero-mascot {
                    width: 300px !important;
                    top: 170px !important;
                    left: -110px !important;
                    opacity: 0.95 !important;
                  }
                }
                @media (max-width: 768px) {
                  .landing-hero-mascot {
                    width: 280px !important;
                    top: 180px !important;
                    left: -110px !important;
                    opacity: 0.7 !important;
                    z-index: -1 !important;
                  }
                }
              `,
                }}
              />
              <Image
                src="/bizen-mascot.png"
                alt="Bizen Mascot"
                width={600}
                height={600}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  filter: "saturate(1.1) brightness(1.05) drop-shadow(20px 0 30px rgba(44, 123, 239, 0.25))",
                }}
              />
            </div>

            {/* Right side mascot restored (the hand) - strictly clipped to prevent horizontal scroll */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <div
                className="landing-hero-right-mascot reveal-element"
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "clamp(80px, 10vw, 180px)",
                  width: "clamp(240px, 24vw, 460px)",
                  transform: "translateX(25%)",
                  opacity: 0,
                  transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  .landing-hero-right-mascot.revealed { opacity: 1 !important; transform: translateX(28%) !important; }
                  @media (max-width: 768px) { .landing-hero-right-mascot { display: none; } }
                `,
                  }}
                />
                <Image
                  src="/image.png"
                  alt=""
                  width={600}
                  height={600}
                  priority
                  style={{
                    width: "100%",
                    height: "auto",
                    filter: "drop-shadow(-20px 0 40px rgba(44, 123, 239, 0.2))",
                  }}
                />
              </div>
            </div>

            {/* Main content - centered */}
            <div
              className="landing-hero-content reveal-element"
              style={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                width: "100%",
                maxWidth: "min(90%, 1100px)",
                margin: "clamp(64px, 8vw, 120px) auto 0",
                padding: "0 clamp(20px, 4vw, 40px)",
                boxSizing: "border-box",
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.6s ease 0.3s",
              }}
            >
              {/* Main headline */}
              <h1
                style={{
                  fontSize: "clamp(34px, 6vw, 68px)",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  margin: "0 0 clamp(40px, 6vw, 72px) 0",
                  lineHeight: 1.08,
                  letterSpacing: "var(--tracking-tight)",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  textShadow: "0 2px 40px rgba(0,0,0,0.3)",
                }}
              >
                <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  El futuro de la{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #60a5fa, var(--primary), #4A9EFF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Educación Financiera
                  </span>
                </span>
                <br />
                para jóvenes en un click
                <br />
                con{" "}
                <span
                  className="brand-highlight-blue"
                  style={{
                    fontWeight: 900,
                    background: "linear-gradient(90deg, #ffffff, #a5c8ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  BIZEN
                </span>
              </h1>

              {/* Subheading with highlighted text - responsive, never overlaps */}
              <div className="landing-hero-sub-container">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  .landing-hero-sub {
                    font-size: clamp(14px, 2vw, 20px) !important;
                    line-height: 1.6;
                    max-width: 900px;
                    margin: 0 auto;
                    color: rgba(255, 255, 255, 0.85);
                    font-weight: 500;
                    text-align: center;
                  }
                  @media (max-width: 768px) {
                    .landing-hero-sub {
                      font-size: 15px !important;
                      line-height: 1.5 !important;
                      padding: 0 16px;
                    }
                  }
                  /* ── Persona Switcher ── */
                  .persona-switcher {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 9999px;
                    padding: 5px;
                    gap: 4px;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    margin-bottom: clamp(24px, 4vw, 40px);
                  }
                  .persona-btn {
                    padding: 10px 22px;
                    border-radius: 9999px;
                    font-size: clamp(13px, 1.2vw, 15px);
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
                    letter-spacing: 0.02em;
                    white-space: nowrap;
                  }
                  .persona-btn.active {
                    background: #0056E7;
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(0,86,231,0.4);
                  }
                  .persona-btn.inactive {
                    background: transparent;
                    color: rgba(255,255,255,0.65);
                  }
                  .persona-btn.inactive:hover {
                    color: rgba(255,255,255,0.9);
                    background: rgba(255,255,255,0.08);
                  }
                  @keyframes border-shimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                  @media (max-width: 640px) {
                    .hero-tagline-border-wrap { border-radius: 14px !important; }
                  }
                  @media (max-width: 450px) {
                    .hero-tagline-border-wrap { 
                      transform: none !important; 
                      margin: 0 auto !important;
                    }
                  }
                `,
                  }}
                />

                {/* ── Persona Switcher Pill ── */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(32px, 6vw, 64px)", marginBottom: 0 }}>
                  <div className="persona-switcher">
                    <button
                      className={`persona-btn ${activePersona === "instituciones" ? "active" : "inactive"}`}
                      onClick={() => setActivePersona("instituciones")}
                    >
                      Para Instituciones
                    </button>
                    <button
                      className={`persona-btn ${activePersona === "estudiantes" ? "active" : "inactive"}`}
                      onClick={() => setActivePersona("estudiantes")}
                    >
                      Para Estudiantes
                    </button>
                  </div>
                </div>

                {/* ── Persona-aware tagline ── */}
                <div
                  style={{
                    marginTop: "clamp(20px, 3vw, 32px)",
                    marginBottom: "clamp(24px, 4vw, 48px)",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    padding: "0 clamp(16px, 5vw, 140px)",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Animated gradient border wrapper */}
                  <div
                    className="hero-tagline-border-wrap"
                    style={{
                      padding: "2px",
                      borderRadius: "18px",
                      backgroundImage:
                        activePersona === "instituciones"
                          ? "linear-gradient(135deg, #0056E7, #1983FD, #93c5fd, #0056E7)"
                          : "linear-gradient(135deg, #7c3aed, #a78bfa, #60a5fa, #7c3aed)",
                      backgroundSize: "300% 300%",
                      animation: "border-shimmer 6s ease infinite",
                      width: "100%",
                      maxWidth: "clamp(280px, 92vw, 750px)",
                      transition: "background-image 0.4s ease",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "16px",
                        background: "rgba(10, 20, 50, 0.55)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        padding:
                          "clamp(12px, 2.5vw, 32px) clamp(16px, 3.5vw, 44px)",
                        textAlign: "center",
                        border: "1px solid rgba(96, 165, 250, 0.2)",
                        boxShadow:
                          "0 4px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                    >
                      {/* Thin accent bar */}
                      <div
                        style={{
                          width: "32px",
                          height: "3px",
                          borderRadius: "99px",
                          background:
                            activePersona === "instituciones"
                              ? "linear-gradient(90deg, #60a5fa, #1983FD)"
                              : "linear-gradient(90deg, #a78bfa, #60a5fa)",
                          margin: "0 auto 12px",
                          transition: "background 0.4s ease",
                        }}
                      />

                      {/* Persona-specific text */}
                      {activePersona === "instituciones" ? (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "clamp(14px, 1.6vw, 22px)",
                            lineHeight: 1.5,
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.92)",
                            letterSpacing: "0.01em",
                            wordWrap: "break-word",
                          }}
                        >
                          Implementa educación financiera en tu institución con{" "}
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              background: "linear-gradient(90deg, #1983FD, #60a5fa)",
                              color: "#fff",
                              borderRadius: "6px",
                              padding: "2px 10px 2px 8px",
                              fontWeight: 600,
                              fontSize: "0.95em",
                              letterSpacing: "0.02em",
                              whiteSpace: "nowrap",
                              boxShadow: "0 2px 12px rgba(25, 131, 253, 0.35)",
                            }}
                          >
                            dashboard de impacto
                          </span>{" "}
                          para directivos, reportes automáticos y contenido{" "}
                          <em
                            style={{
                              fontStyle: "normal",
                              fontWeight: 600,
                              color: "#93c5fd",
                            }}
                          >
                            alineado al contexto mexicano.
                          </em>
                        </p>
                      ) : (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "clamp(14px, 1.6vw, 22px)",
                            lineHeight: 1.5,
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.92)",
                            letterSpacing: "0.01em",
                            wordWrap: "break-word",
                          }}
                        >
                          Domina tu futuro financiero con{" "}
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                              color: "#fff",
                              borderRadius: "6px",
                              padding: "2px 10px 2px 8px",
                              fontWeight: 600,
                              fontSize: "0.95em",
                              letterSpacing: "0.02em",
                              whiteSpace: "nowrap",
                              boxShadow: "0 2px 12px rgba(124, 58, 237, 0.35)",
                            }}
                          >
                            Billy: tu coach de IA
                          </span>{" "}
                          de forma práctica, divertida y en{" "}
                          <em
                            style={{
                              fontStyle: "normal",
                              fontWeight: 600,
                              color: "#c4b5fd",
                            }}
                          >
                            minutos al día.
                          </em>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Persona-aware CTAs */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "clamp(12px, 2vw, 20px)",
                  marginTop: "clamp(24px, 4vw, 40px)",
                  flexWrap: "wrap",
                }}
              >
                {activePersona === "instituciones" ? (
                  <>
                    <a
                      href="https://calendly.com/diego-bizen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="landing-hero-cta-primary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "clamp(14px, 2vw, 18px) clamp(28px, 4vw, 48px)",
                        fontSize: "clamp(14px, 1.4vw, 17px)",
                        fontWeight: 600,
                        borderRadius: "9999px",
                        backgroundImage: "linear-gradient(110deg, #0056E7 0%, #1983FD 50%, #0056E7 100%)",
                        backgroundSize: "200% auto",
                        color: "#fff",
                        textDecoration: "none",
                        boxShadow: "0 4px 24px rgba(15, 98, 254, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.01em",
                      }}
                    >
                      <Calendar size={16} />
                      Agendar demo institucional
                    </a>
                    <a
                      href="#sobre-bizen"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "clamp(13px, 2vw, 17px) clamp(24px, 3.5vw, 40px)",
                        fontSize: "clamp(14px, 1.4vw, 17px)",
                        fontWeight: 500,
                        borderRadius: "9999px",
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1.5px solid rgba(255, 255, 255, 0.2)",
                        color: "rgba(255, 255, 255, 0.88)",
                        textDecoration: "none",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Ver impacto
                      <ChevronRight size={16} />
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/signup"
                      className="landing-hero-cta-primary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "clamp(14px, 2vw, 18px) clamp(28px, 4vw, 48px)",
                        fontSize: "clamp(14px, 1.4vw, 17px)",
                        fontWeight: 600,
                        borderRadius: "9999px",
                        backgroundImage: "linear-gradient(110deg, #7c3aed 0%, #a78bfa 50%, #7c3aed 100%)",
                        backgroundSize: "200% auto",
                        color: "#fff",
                        textDecoration: "none",
                        boxShadow: "0 4px 24px rgba(124, 58, 237, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Comenzar gratis
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a
                      href="#perfiles"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "clamp(13px, 2vw, 17px) clamp(24px, 3.5vw, 40px)",
                        fontSize: "clamp(14px, 1.4vw, 17px)",
                        fontWeight: 500,
                        borderRadius: "9999px",
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1.5px solid rgba(255, 255, 255, 0.2)",
                        color: "rgba(255, 255, 255, 0.88)",
                        textDecoration: "none",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.01em",
                      }}
                    >
                      <Play size={14} />
                      Ver funciones
                    </a>
                  </>
                )}
              </div>

            </div>

            <div
              className="landing-hero-logos-wrap"
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: "min(90%, 1200px)",
                margin: "clamp(60px, 10vw, 120px) auto 0",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(12px, 1.3vw, 15px)",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontWeight: 500,
                  margin: "0 0 clamp(20px, 3vw, 36px) 0",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Empresas que ya confían
              </p>
              <div style={{ marginTop: "clamp(40px, 8vw, 80px)" }}>
                <p
                  style={{
                    fontSize: "clamp(12px, 1.1vw, 14px)",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontWeight: 600,
                    margin: "0 0 20px 0",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Mercado en Vivo — BIZEN Market
                </p>
                <TickerTape marketData={[]} />
              </div>
            </div>
          </div>

          {/* ── Instituciones anchor + section label ── */}

          {/* SOMOS BIZEN Section */}
          <div
            id="sobre-bizen"
            style={{
              width: "100%",
              background: "transparent",
              padding:
                "clamp(72px, 10vw, 120px) clamp(24px, 6vw, 80px) clamp(56px, 8vw, 96px)",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* Subtle background glows - low opacity, no harsh edges */}
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-60px",
                width: "600px",
                height: "600px",
                background:
                  "radial-gradient(circle, rgba(0,86,231,0.08) 0%, transparent 65%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                left: "-60px",
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(0,86,231,0.06) 0%, transparent 65%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Title */}
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "clamp(32px, 5vw, 64px)",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "var(--tracking-tight)",
                  lineHeight: 1.1,
                  marginBottom: "clamp(24px, 3vw, 40px)",
                }}
              >
                SOMOS{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #60a5fa, var(--primary), #4A9EFF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  BIZEN
                </span>
              </h2>

              {/* Description */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "clamp(17px, 1.6vw, 22px)",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.8,
                  maxWidth: "860px",
                  margin: "0 auto clamp(56px, 7vw, 88px)",
                  fontWeight: 400,
                }}
              >
                En{" "}
                <strong style={{ color: "#fff", fontWeight: 500 }}>
                  BIZEN
                </strong>{" "}
                combinamos{" "}
                <strong style={{ color: "#60a5fa" }}>
                  aprendizaje gamificado
                </strong>{" "}
                para que los alumnos entiendan el dinero practicando,
                desarrollamos{" "}
                <strong style={{ color: "#60a5fa" }}>
                  competencias reales
                </strong>{" "}
                a través de decisiones financieras aplicadas al contexto
                mexicano y generamos{" "}
                <strong style={{ color: "#60a5fa" }}>impacto real</strong>{" "}
                formando jóvenes capaces de organizar su dinero, evitar deudas y
                generar ingresos desde temprana edad.
              </p>

              {/* Stats row — 3 glowing cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "clamp(16px, 2vw, 28px)",
                  marginBottom: "clamp(48px, 7vw, 80px)",
                }}
                className="somos-stats-grid"
              >
                {/* Stat 1 */}
                <div
                  className="somos-stat-card reveal-element"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 40px)",
                    textAlign: "center",
                    backdropFilter: "blur(var(--glass-blur))",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(36px, 5vw, 56px)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: "10px",
                      background:
                        "linear-gradient(135deg, #ffffff 30%, #60a5fa 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    +50
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(14px, 1.2vw, 17px)",
                      fontWeight: 500,
                      color: "#60a5fa",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Startups
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(13px, 1vw, 15px)",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    Seleccionados entre +50 startups. Parte del Programa de
                    Incubación de la Secretaría de Desarrollo Económico.
                  </p>
                </div>

                {/* Stat 2 */}
                <div
                  className="somos-stat-card reveal-element"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 40px)",
                    textAlign: "center",
                    backdropFilter: "blur(var(--glass-blur))",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(36px, 5vw, 56px)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: "10px",
                      background:
                        "linear-gradient(135deg, #ffffff 30%, #60a5fa 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    +10
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(14px, 1.2vw, 17px)",
                      fontWeight: 500,
                      color: "#60a5fa",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Instituciones
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(13px, 1vw, 15px)",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    Más de 10 instituciones en Querétaro nos respaldan. BIZEN
                    enseña ahorro, inversión y emprendimiento con metodología
                    práctica.
                  </p>
                </div>

                {/* Stat 3 */}
                <div
                  className="somos-stat-card reveal-element"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 40px)",
                    textAlign: "center",
                    backdropFilter: "blur(var(--glass-blur))",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(36px, 5vw, 64px)",
                      fontWeight: 700,
                      letterSpacing: "var(--tracking-tight)",
                      lineHeight: 1,
                      marginBottom: "12px",
                      color: "#fff",
                    }}
                  >
                    $25K
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(14px, 1.2vw, 17px)",
                      fontWeight: 500,
                      color: "#60a5fa",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    USD en créditos
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(13px, 1vw, 15px)",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    Más de 25,000 USD en créditos de Google invertidos en
                    nosotros. Parte de la comunidad EdTech más grande de LATAM.
                  </p>
                </div>
              </div>

              {/* Manifesto bar */}
              <div
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "clamp(20px, 3vw, 28px) clamp(24px, 4vw, 48px)",
                  textAlign: "center",
                  marginBottom: "clamp(40px, 5vw, 64px)",
                  backdropFilter: "blur(var(--glass-blur))",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "clamp(16px, 1.4vw, 20px)",
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 500,
                    lineHeight: 1.7,
                  }}
                >
                  BIZEN enseña{" "}
                  <strong style={{ color: "#fff" }}>
                    ahorro, inversión y emprendimiento
                  </strong>{" "}
                  con metodología práctica, gamificada y alineada al mundo real.
                </p>
              </div>

              {/* Partner logos strip */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "clamp(20px, 3vw, 32px)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 24px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Nos respaldan
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "clamp(32px, 6vw, 72px)",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      padding: "16px 28px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src="/logos/logo-hex.png"
                      alt="BLOQUE"
                      width={200}
                      height={60}
                      style={{
                        height: "52px",
                        width: "auto",
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      padding: "16px 28px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src="/logos/logo-queretaro.png"
                      alt="Querétaro"
                      width={160}
                      height={60}
                      style={{
                        height: "52px",
                        width: "auto",
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      padding: "16px 28px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src="/logos/logo-google.png"
                      alt="Google for Startups"
                      width={160}
                      height={44}
                      style={{
                        height: "52px",
                        width: "auto",
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <style
              dangerouslySetInnerHTML={{
                __html: `
              @keyframes premium-float {
                0% { transform: translateY(0px) rotate(0deg); }
                33% { transform: translateY(-8px) rotate(0.2deg); }
                66% { transform: translateY(-4px) rotate(-0.2deg); }
                100% { transform: translateY(0px) rotate(0deg); }
              }
              .somos-stat-card {
                animation: premium-float 6s ease-in-out infinite;
              }
              .somos-stat-card:nth-child(2) { animation-delay: 1.5s; }
              .somos-stat-card:nth-child(3) { animation-delay: 3s; }
              
              .somos-stat-card:hover {
                transform: translateY(-12px) scale(1.02) !important;
                box-shadow: 0 30px 60px rgba(0, 86, 231, 0.35) !important;
                border-color: rgba(25, 131, 253, 0.4) !important;
                z-index: 10;
              }
              @media (max-width: 768px) {
                .somos-stats-grid {
                  grid-template-columns: 1fr !important;
                }
                .somos-stat-card { animation: none; }
              }
            `,
              }}
            />
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
            padding: 16px;
            gap: 16px;
          }
          .bento-item {
            padding: 20px;
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
          font-weight: 500;
        }
        
        .main-page-container,
        .main-page-container .section,
        .main-page-container .container {
          /* Inherit from global San Francisco font */
        }
        
        /* Keep Inter for bold text if preferred, but user requested Open Sans for non-bold specifically */
        b, strong, h1, h2, h3, .bold-text {
          font-weight: 700;
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
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        .auth-dropdown-item:hover {
          background: #f1f5f9;
          color: #0056E7;
          transform: translateX(4px);
        }
        
        /* Floating animations for all cards */
        @keyframes global-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.2deg); }
        }
        .somos-stat-card, .glass-card-premium, .curiosidad-card, .how-it-works-step-card, .bento-item {
          animation: global-float 6s ease-in-out infinite;
        }
        .somos-stat-card:nth-child(2), .curiosidad-card:nth-child(2), .how-it-works-step-card:nth-child(2) { animation-delay: 1.5s; }
        .somos-stat-card:nth-child(3), .curiosidad-card:nth-child(3), .how-it-works-step-card:nth-child(3) { animation-delay: 3s; }
        
        .somos-stat-card:hover, .glass-card-premium:hover, .bento-item:hover {
          transform: translateY(-15px) scale(1.02) !important;
          box-shadow: 0 30px 60px rgba(0, 86, 231, 0.3) !important;
          z-index: 10;
          animation-play-state: paused;
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
          overflow-y: visible !important;
          max-width: 100% !important; 
          width: 100% !important; 
          height: auto !important; 
          min-height: auto !important; 
          flex: none !important; 
          display: block !important; 
        }
        .main-page-container main > div,
        .landing-gradient-wrapper,
        .landing-rest-wrapper,
        .conoce-bizen-section,
        .how-it-works,
        .curiosidad-section,
        .testimonials-section { 
          overflow: visible !important; 
          max-width: 100% !important; 
          width: 100% !important; 
          height: auto !important;
          min-height: 0 !important;
        }
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
            color: rgba(255, 255, 255, 0.75) !important;
            font-size: clamp(14px, 2vw, 19px) !important;
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
          font-weight: 500;
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
          font-weight: 500;
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

          {/* Landing Page Content - Block 1: Hero through Conoce BIZEN (Dark Continuous) */}
          <LandingContent sectionRange="gradient" />
          <LandingContent sectionRange="conoce" />
        </div>

        {/* Block 2: Adventure Carousel (Light) */}
        <LandingContent sectionRange="carousel" />

        {/* Block 3: Problema + How it works (Dark Continuous) */}
        <div
          style={{
            background:
              "linear-gradient(180deg, #0a1628 0%, #040f26 40%, #071840 70%, #040e24 100%)",
            position: "relative",
          }}
        >
          <LandingContent sectionRange="problema_flow" />
        </div>

        {/* Rest of landing (white background) */}
        <LandingContent sectionRange="rest" />
      </main>
      <section
        id="impacto"
        className="section testimonials-section reveal-element"
        style={{
          background:
            "linear-gradient(160deg, #f0f6ff 0%, #f8fcff 60%, #ffffff 100%)",
          padding:
            "clamp(72px, 10vw, 112px) clamp(20px, 4vw, 56px) clamp(40px, 5vw, 64px)",
          marginBottom: "clamp(12px, 2vw, 24px)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(48px, 7vw, 72px)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(0,86,231,0.08)",
                color: "#0056E7",
                borderRadius: "999px",
                padding: "6px 18px",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Testimonios
            </span>
            <h2
              style={{
                textAlign: "center",
                margin: "0",
                fontSize: "clamp(30px, 4.5vw, 48px)",
                fontWeight: 500,
                color: "#111",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Colegios líderes en México{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #0056E7, #1983FD)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ya evolucionaron
              </span>{" "}
              con BIZEN.
            </h2>
          </div>

          <div
            style={{
              position: "relative",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "relative",
                perspective: "1000px",
                minHeight: "320px",
              }}
            >
              {[
                {
                  quote:
                    "Una plataforma increíble para aprender finanzas personales de forma clara y práctica. A mi hijo le encantó.",
                  name: "Gabriela Burgos",
                  title: "Directora de Programas de Emprendimiento · BLOQUE",
                  image: "/uploads/Landing_page/image.png",
                },
                {
                  quote:
                    "Una herramienta excepcional para quienes buscan desarrollar educación financiera de forma práctica.",
                  name: "Alejandro Rolland",
                  title: "Secretaría de Desarrollo Sustentable · Querétaro",
                  image: "/uploads/Landing_page/image%20copy.png",
                },
                {
                  quote:
                    "Una plataforma innovadora que acerca las finanzas personales de manera sencilla y atractiva para jóvenes.",
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
                    transform:
                      activeTestimonial === idx
                        ? "translateX(0)"
                        : idx < activeTestimonial
                          ? "translateX(-36px)"
                          : "translateX(36px)",
                    pointerEvents: activeTestimonial === idx ? "auto" : "none",
                    transition:
                      "opacity 0.45s ease, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    zIndex: activeTestimonial === idx ? 2 : 1,
                  }}
                  className="testimonial-card-animate"
                >
                  <div
                    className="testimonial-premium-card"
                    style={{
                      background: "#FBFAF5",
                      borderRadius: "28px",
                      padding: "clamp(28px, 4vw, 48px)",
                      border: "1px solid rgba(0, 86, 231, 0.1)",
                      boxShadow:
                        "0 16px 48px rgba(0, 86, 231, 0.08), 0 2px 8px rgba(0,0,0,0.04)",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "clamp(24px, 4vw, 40px)",
                      alignItems: "flex-start",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #0056E7, #1983FD)",
                      }}
                    />
                    <div
                      style={{
                        width: "clamp(96px, 13vw, 140px)",
                        height: "clamp(96px, 13vw, 140px)",
                        borderRadius: "20px",
                        overflow: "hidden",
                        flexShrink: 0,
                        position: "relative",
                        boxShadow: "0 8px 24px rgba(0,86,231,0.15)",
                        border: "3px solid rgba(0,86,231,0.12)",
                      }}
                    >
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          marginBottom: "14px",
                        }}
                      >
                        {[0, 1, 2, 3, 4].map((s) => (
                          <svg
                            key={s}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="#FBBF24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <p
                        style={{
                          margin: "0 0 20px",
                          fontSize: "clamp(15px, 1.1vw, 18px)",
                          lineHeight: 1.7,
                          color: "#1e293b",
                          fontStyle: "italic",
                        }}
                      >
                        "{testimonial.quote}"
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "2px",
                            background:
                              "linear-gradient(90deg,#0056E7,#1983FD)",
                            borderRadius: "2px",
                          }}
                        />
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "clamp(14px, 1rem, 16px)",
                              fontWeight: 500,
                              color: "#111",
                            }}
                          >
                            {testimonial.name}
                          </p>
                          <p
                            style={{
                              margin: "3px 0 0",
                              fontSize: "clamp(12px, 0.85rem, 14px)",
                              color: "#64748b",
                            }}
                          >
                            {testimonial.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="carousel-nav-wrapper"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                width: "max-content",
                margin: "40px auto 0",
              }}
            >
              <button
                type="button"
                className="landing-carousel-arrow prev"
                aria-label="Anterior"
                onClick={() =>
                  setActiveTestimonial((prev) => (prev === 0 ? 2 : prev - 1))
                }
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "rgba(0, 86, 231, 0.1)",
                  border: "1.5px solid rgba(0, 86, 231, 0.2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0056E7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    style={{
                      width: activeTestimonial === idx ? "32px" : "12px",
                      height: "12px",
                      borderRadius: "6px",
                      background:
                        activeTestimonial === idx
                          ? "#0056E7"
                          : "rgba(0,86,231,0.2)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    aria-label={`Testimonio ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="landing-carousel-arrow next"
                aria-label="Siguiente"
                onClick={() =>
                  setActiveTestimonial((prev) => (prev === 2 ? 0 : prev + 1))
                }
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#0056E7",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 16px rgba(0, 86, 231, 0.3)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* TESTIMONIALS FIX VERIFIED */}
      <LandingWaitlistFooter />

    </div>
  );
}

// Landing Content Component - extracted from /landing page
type Level = "Principiante" | "Intermedio" | "Avanzado";

type Course = {
  title: string;
  level: Level;
  duration: string;
  image: string;
  url: string;
};

type FAQ = { q: string; a: string };

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
];

const logoCarouselLogos: { src: string; alt: string }[] = [
  { src: "/logos/logo-imef.png", alt: "IMEF Ejecutivos de Finanzas" },
  { src: "/logos/logo-mondragon.png", alt: "Universidad Mondragón México" },
  { src: "/logos/logo-google.png", alt: "Google" },
  { src: "/logos/logo-queretaro.png", alt: "Querétaro - Juntos, Adelante" },
  { src: "/logos/logo-hex.png", alt: "Partner" },
  { src: "/logos/logo-balmoral.png", alt: "Balmoral Escocés Preparatoria" },
];

const problemSchools: { title: string; description: string }[] = [
  {
    title: "Teoría sin práctica",
    description: "Se enseña el concepto pero no se practica con casos reales.",
  },
  {
    title: "Difícil medir avance",
    description: "No hay forma clara de ver el progreso de cada estudiante.",
  },
  {
    title: "Falta de tiempo del docente",
    description:
      "Los profesores no tienen tiempo para personalizar la enseñanza.",
  },
];
const howItWorksSteps: { title: string; schoolsText: string }[] = [
  { title: "Empiezo", schoolsText: "El colegio crea grupos y accesos." },
  {
    title: "Practico",
    schoolsText: "Los estudiantes usan simuladores y retos en clase.",
  },
  {
    title: "Mido mi progreso",
    schoolsText: "El docente ve reportes y avance por alumno.",
  },
];

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
];

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useMemo(
    () =>
      question
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .slice(0, 64),
    [question],
  );

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
        <svg
          className="chev"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        id={id}
        className="accordion-panel"
        role="region"
        aria-labelledby={id}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}

function StepIcon1({ color }: { color: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="step-icon"
    >
      <path
        fill={color}
        d="M12 2a5 5 0 015 5v1h1a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-8a3 3 0 013-3h1V7a5 5 0 015-5zm-3 6v1h6V8a3 3 0 10-6 0z"
      />
    </svg>
  );
}

function StepIcon2({ color }: { color: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="step-icon"
    >
      <path
        fill={color}
        d="M3 4h18v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h18v2H3v-2z"
      />
    </svg>
  );
}

function StepIcon3({ color }: { color: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="step-icon"
    >
      <path
        fill={color}
        d="M12 2l2.39 4.84L20 8l-4 3.9L17.48 18 12 15.7 6.52 18 8 11.9 4 8l5.61-1.16L12 2z"
      />
    </svg>
  );
}

const landingCSS = `
        /* Floating animations for all cards */
        @keyframes global-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.2deg); }
        }
        .somos-stat-card, .glass-card-premium, .curiosidad-card, .how-it-works-step-card, .bento-item {
          animation: global-float 6s ease-in-out infinite;
        }
        .somos-stat-card:nth-child(2), .curiosidad-card:nth-child(2), .how-it-works-step-card:nth-child(2) { animation-delay: 1.5s; }
        .somos-stat-card:nth-child(3), .curiosidad-card:nth-child(3), .how-it-works-step-card:nth-child(3) { animation-delay: 3s; }
        
        .somos-stat-card:hover, .glass-card-premium:hover, .bento-item:hover {
          transform: translateY(-15px) scale(1.02) !important;
          box-shadow: 0 30px 60px rgba(0, 86, 231, 0.3) !important;
          z-index: 10;
          animation-play-state: paused;
        }


        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        :root {
          --c-primary: #0056E7;
          --c-accent: #10B981;
          --c-text: #1E293B;
          --c-muted: #334155;
          --c-bg: transparent;
          --c-card: #FFFFFF;
          --c-border: rgba(15, 23, 42, 0.12);
          --radius: 16px;
          --shadow: 0 10px 30px rgba(0,0,0,.06);
          --shadow-sm: 0 4px 16px rgba(0,0,0,.06);
          --transition: 180ms cubic-bezier(.2,.8,.2,1);
          --font-weight-normal: 400;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
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
          background: #020e27 !important;
          font-weight: 600;
          overflow-y: visible !important;
          margin: 0;
          padding: 0;
        }

        html {
          background: #020e27;
          overflow-y: scroll !important;
          overflow-x: hidden !important;
          scroll-behavior: smooth;
          height: auto !important;
        }

        .section { padding: clamp(64px, 8vw, 120px) 0; scroll-margin-top: 80px; overflow: visible !important; background: transparent; }

        #problema.section,
        section#problema {
          background: transparent !important;
        }

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
        .reveal-element.reveal-delay-3 { transition-delay: 0.32s; }

        .section.contact,
        #contacto {
          padding-bottom: clamp(64px, 8vw, 128px) !important;
          overflow: visible !important;
        }
        .section-head { max-width: 900px; margin: 0 auto 28px auto; text-align: center; overflow: visible; word-wrap: break-word; overflow-wrap: break-word; }
        .section-head h2 { margin: 0 0 8px 0; font-size: clamp(28px, 4.2vw, 40px); font-weight: 500; line-height: 1.15; white-space: normal; }
        .section-head p { margin: 0; color: var(--c-muted); font-weight: 400; white-space: normal; }

        .container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 32px);
          overflow-x: hidden;
          box-sizing: border-box;
        }
        
        .main-page-container .section,
        .main-page-container section {
          overflow: visible !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          height: auto !important;
        }

        .hero { padding-top: clamp(24px, 3vw, 48px) }
        .hero-inner { display: grid; gap: 28px; align-items: center; grid-template-columns: 1fr }
        .hero-copy .sub { font-size: clamp(16px, 2.4vw, 20px); color: var(--c-muted); margin: 0 0 14px 0 }
        
        .carousel-track {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden !important;
          scrollbar-width: none;
        }
        .carousel-track::-webkit-scrollbar { display: none; }

        .logos-carousel-track {
          display: flex;
          align-items: center;
          gap: clamp(48px, 8vw, 80px);
          width: max-content;
          animation: logo-carousel-scroll 25s linear infinite;
        }
        @keyframes logo-carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          height: 42px; padding: 0 16px; border-radius: 12px;
          cursor: pointer; font-weight: 500;
          transition: transform 60ms ease, background 180ms ease;
        }
        .btn.primary { background: var(--c-primary); color: white; }

        @media (max-width: 768px) {
          /* General card spacing reduction - prevents cards from being disproportionately large */
          .somos-stat-card, 
          .step-card, 
          .testimonial-premium-card, 
          .conoce-skill-card, 
          .curiosidad-card,
          .glass-card-premium {
            padding: clamp(16px, 5vw, 24px) !important;
            border-radius: 20px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Reduce vertical height of section headers */
          .section {
            padding: clamp(40px, 8vw, 64px) 0 !important;
          }

          /* Profile premium card optimization */
          .glass-card-premium {
            padding: 24px 16px 32px !important;
            border-radius: 24px !important;
            animation: none !important; /* Stop floating on mobile to reduce visual noise */
          }
          .perfiles-tabs-row {
            margin-bottom: 24px !important;
            gap: 6px !important;
            padding: 4px !important;
            max-width: 100% !important;
          }
          .profile-tab-button {
            padding: 8px 12px !important;
            font-size: 14px !important;
          }
          
          /* Testimonials: switch to 1-column layout and center everything */
          .testimonial-premium-card {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 16px !important;
          }
          .testimonial-premium-card > div:first-child {
            width: 80px !important;
            height: 80px !important;
            margin: 0 auto !important;
            flex-shrink: 0 !important;
          }

          /* Stat cards specific */
          .somos-stat-card div:first-child {
            font-size: 32px !important;
            margin-bottom: 4px !important;
          }
          .somos-stat-card {
             animation: none !important;
          }

          /* Ensure grids stack correctly and have tighter gaps */
          .somos-stats-grid, 
          .conoce-skills-grid, 
          .curiosidad-cards-grid, 
          .how-it-works-steps {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          /* Specific fix for skill cards text */
          .conoce-skill-card h4 {
            font-size: 16px !important;
          }
          .conoce-skill-card p {
            font-size: 13px !important;
          }
        }

        @media (max-width: 480px) {
           /* Further optimizations for very small screens */
           .section-head h2 {
             font-size: 24px !important;
           }
           .somos-stat-card, .conoce-skill-card, .curiosidad-card {
             padding: 16px !important;
           }
        }
`;

function LandingContent({
  sectionRange = "all",
}: {
  sectionRange?:
  | "gradient"
  | "conoce"
  | "carousel"
  | "problema_flow"
  | "impacto"
  | "rest"
  | "all";
}) {
  const primary = "#0056E7";
  const accent = "#10B981";
  const [activeProfile, setActiveProfile] = React.useState<
    "docentes" | "estudiantes" | "padres"
  >("docentes");
  const [activeAdventureSlide, setActiveAdventureSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdventureSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{landingCSS}</style>
      {(sectionRange === "all" || sectionRange === "gradient") && (
        <>
          {/* ── Estudiantes anchor + section label ── */}

          {/* ── FEATURES SECTION: BIZEN Live, La Fragua, El Mercado ── */}
          <section
            id="perfiles"
            className="section perfiles-section reveal-element"
            style={{
              background: "transparent",
              position: "relative",
              overflow: "visible",
              paddingTop: 0,
              marginTop: "-20px",
            }}
          >
            {/* Features container */}
            <div
              style={{
                background: "linear-gradient(170deg, #040f26 0%, #06184d 50%, #040f26 100%)",
                margin: "clamp(0px, 4vw, 60px) clamp(16px, 4vw, 40px)",
                borderRadius: "48px",
                padding: "clamp(48px, 10vw, 110px) clamp(16px, 5vw, 60px)",
                position: "relative",
                overflow: "visible",
                boxShadow: "0 24px 80px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Grid pattern bg */}
              <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "48px", backgroundImage: "linear-gradient(rgba(25,131,253,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(25,131,253,0.04) 1px, transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />

              <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>

                {/* Section header */}
                <div style={{ textAlign: "center", marginBottom: "clamp(56px, 8vw, 88px)" }}>
                  <span style={{ display: "inline-block", background: "rgba(96,165,250,0.15)", color: "#60a5fa", borderRadius: "999px", padding: "6px 20px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px", border: "1px solid rgba(96,165,250,0.2)" }}>
                    Lo que ya puedes hacer
                  </span>
                  <h2 style={{ textAlign: "center", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "clamp(16px, 2vw, 24px)", letterSpacing: "-0.03em" }}>
                    Una plataforma,{" "}
                    <span style={{ background: "linear-gradient(90deg, #60a5fa, #1983FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      múltiples experiencias
                    </span>
                    .
                  </h2>
                  <p style={{ margin: "0 auto", maxWidth: "520px", fontSize: "clamp(16px, 1.3vw, 19px)", color: "rgba(255,255,255,0.7)", fontWeight: 400, lineHeight: 1.7 }}>
                    Cada módulo de BIZEN está diseñado para que aprender finanzas sea tan adictivo como un juego.
                  </p>
                </div>

                {/* ── Feature 1: BIZEN Live ── */}
                <div className="feature-split-row" style={{ display: "flex", alignItems: "center", gap: "clamp(32px, 5vw, 72px)", marginBottom: "clamp(64px, 10vw, 100px)", flexWrap: "wrap" }}>
                  {/* Text */}
                  <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(251,191,36,0.12)", color: "#fbbf24", borderRadius: "999px", padding: "5px 16px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", border: "1px solid rgba(251,191,36,0.2)" }}>
                      ⚡ BIZEN Live
                    </span>
                    <h3 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "16px" }}>
                      Quizzes en vivo,<br />estilo Kahoot
                    </h3>
                    <p style={{ fontSize: "clamp(15px, 1.1vw, 18px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "28px" }}>
                      El docente lanza una sesión, los alumnos entran con un PIN y compiten en tiempo real respondiendo preguntas de finanzas. Rankings en vivo, conteo de puntos y adrenalina garantizada.
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                      {["Sesiones en tiempo real con Supabase Realtime", "Rankings y podio al finalizar", "Docente controla el ritmo desde /live/host"].map((item) => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#fbbf24,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#000", fontWeight: 700, borderRadius: "999px", textDecoration: "none", fontSize: 15, boxShadow: "0 8px 24px rgba(251,191,36,0.35)", transition: "all 0.3s" }}>
                      Entrar a BIZEN Live →
                    </a>
                  </div>
                  {/* Visual mock card */}
                  <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "28px", padding: "clamp(24px,4vw,40px)", backdropFilter: "blur(16px)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24" }}>BIZEN LIVE — EN PROGRESO</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>LIVE</span>
                        </div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 20px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: "0 0 12px" }}>¿Qué es el interés compuesto?</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {[
                            { label: "A. Interés sobre el capital", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
                            { label: "B. Interés sobre interés", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
                            { label: "C. Un tipo de deuda", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
                            { label: "D. Un banco suizo", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
                          ].map((opt) => (
                            <div key={opt.label} style={{ background: opt.bg, border: `1px solid ${opt.color}33`, borderRadius: 10, padding: "8px 12px", fontSize: 12, color: opt.color, fontWeight: 500 }}>{opt.label}</div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex" }}>
                          {["🧑", "👩", "🧒", "👨"].map((e, i) => (
                            <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: `hsl(${i*60},70%,50%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginLeft: i > 0 ? -8 : 0, border: "2px solid #040f26" }}>{e}</div>
                          ))}
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>24 jugadores</span>
                        <div style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>:08</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Feature 2: La Fragua ── */}
                <div className="feature-split-row" style={{ display: "flex", alignItems: "center", gap: "clamp(32px, 5vw, 72px)", marginBottom: "clamp(64px, 10vw, 100px)", flexWrap: "wrap-reverse" }}>
                  {/* Visual mock card */}
                  <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "28px", padding: "clamp(24px,4vw,40px)", backdropFilter: "blur(16px)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Flame size={20} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>Misión del día</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Racha: 7 días</div>
                            <Flame size={12} color="#10b981" fill="#10b981" />
                          </div>
                        </div>
                        <div style={{ marginLeft: "auto", background: "rgba(16,185,129,0.15)", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#10b981", fontWeight: 600 }}>+50 BZ</div>
                      </div>
                      {[
                        { label: "Lección: Presupuesto familiar", done: true },
                        { label: "Quiz: Ahorro inteligente", done: true },
                        { label: "Reto: Calcula tu fondo de emergencia", done: false },
                      ].map((step, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: step.done ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)", borderRadius: 12, marginBottom: 8, border: `1px solid ${step.done ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: step.done ? "#10b981" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {step.done ? <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />}
                          </div>
                          <span style={{ fontSize: 13, color: step.done ? "rgba(255,255,255,0.7)" : "#fff", textDecoration: step.done ? "line-through" : "none" }}>{step.label}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 16, background: "rgba(255,255,255,0.04)", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ height: 6, width: "66%", background: "linear-gradient(90deg,#10b981,#059669)", borderRadius: 6 }} />
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "right", margin: "6px 0 0" }}>2 / 3 completadas</p>
                    </div>
                  </div>
                  {/* Text */}
                  <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.12)", color: "#10b981", borderRadius: "999px", padding: "5px 16px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", border: "1px solid rgba(16,185,129,0.2)" }}>
                      <Flame size={14} /> La Fragua
                    </span>
                    <h3 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "16px" }}>
                      Misiones diarias<br />que forjan hábitos
                    </h3>
                    <p style={{ fontSize: "clamp(15px, 1.1vw, 18px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "28px" }}>
                      Cada día hay una nueva misión financiera esperándote. Completa lecciones, responde quizzes y resuelve retos para ganar Bizcoins y mantener tu racha viva.
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                      {["Nueva misión cada 24 horas", "Rachas y logros desbloqueables", "Billy: tu mentor de IA experto"].map((item) => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontWeight: 700, borderRadius: "999px", textDecoration: "none", fontSize: 15, boxShadow: "0 8px 24px rgba(16,185,129,0.35)", transition: "all 0.3s" }}>
                      Ver misión de hoy →
                    </a>
                  </div>
                </div>

                {/* ── Feature 3: El Mercado ── */}
                <div className="feature-split-row" style={{ display: "flex", alignItems: "center", gap: "clamp(32px, 5vw, 72px)", flexWrap: "wrap" }}>
                  {/* Text */}
                  <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,92,246,0.12)", color: "#a78bfa", borderRadius: "999px", padding: "5px 16px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", border: "1px solid rgba(139,92,246,0.2)" }}>
                      <Store size={14} /> El Mercado
                    </span>
                    <h3 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "16px" }}>
                      Gana Bizcoins,<br />personaliza tu perfil
                    </h3>
                    <p style={{ fontSize: "clamp(15px, 1.1vw, 18px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "28px" }}>
                      Cada lección completada, cada quiz ganado y cada misión diaria te da Bizcoins. Úsalos para comprar avatares únicos, marcos de perfil exclusivos y más en la Tienda BIZEN.
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                      {["Bizcoins ganados por cada logro", "Avatares, marcos y artículos de colección", "Rankings y reputación en la comunidad"].map((item) => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "#fff", fontWeight: 700, borderRadius: "999px", textDecoration: "none", fontSize: 15, boxShadow: "0 8px 24px rgba(139,92,246,0.35)", transition: "all 0.3s" }}>
                      Abrir la Tienda BIZEN →
                    </a>
                  </div>
                  {/* Visual mock card */}
                  <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "28px", padding: "clamp(24px,4vw,40px)", backdropFilter: "blur(16px)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>Tu saldo</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.15)", borderRadius: 8, padding: "6px 12px" }}>
                          <CircleDollarSign size={16} color="#a78bfa" />
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#a78bfa" }}>1,250</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>BZ</span>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                          { name: "Avatar Robot", icon: Bot, price: 300, color: "#3b82f6" },
                          { name: "Marco VIP", icon: Crown, price: 800, color: "#fbbf24" },
                          { name: "Avatar Ninja", icon: Sword, price: 400, color: "#10b981" },
                          { name: "Insignia 🔥", icon: Medal, price: 200, color: "#ef4444" },
                        ].map((item) => (
                          <div key={item.name} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${item.color}33`, borderRadius: 14, padding: "12px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                              <item.icon size={28} color={item.color} />
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 6 }}>{item.name}</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                              <CircleDollarSign size={12} color={item.color} />
                              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </>
      )}
      {(sectionRange === "all" || sectionRange === "conoce") && (
        <>
          {/* Conoce BIZEN - deep spatial blue enhanced */}
          <section
            id="conoce-bizen"
            className="section conoce-bizen-section reveal-element"
            style={{
              background: "transparent",
              padding: "clamp(80px, 10vw, 120px) clamp(16px, 4vw, 48px)",
              margin: "0",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box" as const,
              height: "auto",
              overflow: "hidden",
              position: "relative" as const,
            }}
          >
            {/* Animated dot-grid overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                backgroundImage:
                  "radial-gradient(rgba(25, 131, 253, 0.18) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
                pointerEvents: "none",
              }}
            />

            {/* Floating glow orbs */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "-120px",
                left: "-120px",
                width: "520px",
                height: "520px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,86,231,0.28) 0%, transparent 70%)",
                filter: "blur(60px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: "-100px",
                right: "-80px",
                width: "480px",
                height: "480px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(25,131,253,0.22) 0%, transparent 70%)",
                filter: "blur(60px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,86,231,0.12) 0%, transparent 70%)",
                filter: "blur(80px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            {/* Inner container */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "1320px",
                margin: "0 auto",
              }}
            >
              {/* Section label + heading centered */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "clamp(48px, 6vw, 72px)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(25, 131, 253, 0.15)",
                    color: "#60aeff",
                    borderRadius: "999px",
                    padding: "6px 18px",
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "24px",
                    border: "1px solid rgba(25, 131, 253, 0.25)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#1983FD",
                      display: "inline-block",
                      boxShadow: "0 0 8px #1983FD",
                    }}
                  />
                  Conoce BIZEN
                </span>
                <h2
                  style={{
                    fontSize: "clamp(32px, 4.5vw, 58px)",
                    fontWeight: 500,
                    color: "#fff",
                    lineHeight: 1.12,
                    marginBottom: "clamp(16px, 2vw, 20px)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Aprender finanzas nunca ha sido{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #4da3ff, #1983FD, #60aeff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    tan claro y relevante
                  </span>
                  .
                </h2>
                <p
                  style={{
                    fontSize: "clamp(16px, 1.2vw, 19px)",
                    lineHeight: 1.7,
                    color: "rgba(180, 205, 255, 0.75)",
                    maxWidth: "580px",
                    margin: "0 auto",
                  }}
                >
                  Impulsa a tu escuela a desarrollar habilidades clave mientras
                  los estudiantes aprenden de forma práctica y guiada.
                </p>
              </div>

              {/* Stats row */}
              <div
                className="conoce-stats-row"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "clamp(16px, 3vw, 48px)",
                  marginBottom: "clamp(48px, 6vw, 72px)",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { value: "+500", label: "Estudiantes activos" },
                  { value: "6", label: "Habilidades clave" },
                  { value: "98%", label: "Satisfacción docente" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      padding: "clamp(16px,2vw,24px) clamp(24px,3vw,40px)",
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "20px",
                      border: "1px solid rgba(25, 131, 253, 0.2)",
                      backdropFilter: "blur(12px)",
                      minWidth: "140px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(28px, 3.5vw, 44px)",
                        fontWeight: 500,
                        color: "#fff",
                        letterSpacing: "-0.03em",
                        background:
                          "linear-gradient(135deg, #fff 40%, #60aeff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(12px, 0.85rem, 14px)",
                        color: "rgba(180, 205, 255, 0.65)",
                        fontWeight: 500,
                        marginTop: "4px",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 6 skills — 3-column card grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "clamp(14px, 2vw, 22px)",
                }}
                className="conoce-skills-grid"
              >
                {[
                  {
                    label: "Toma de decisiones informadas",
                    desc: "Evalúa opciones y elige con criterio financiero en situaciones reales.",
                    Icon: () => (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    ),
                  },
                  {
                    label: "Pensamiento crítico aplicado",
                    desc: "Analiza información y cuestiona supuestos para resolver mejor.",
                    Icon: () => (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    ),
                  },
                  {
                    label: "Resolución de problemas financieros",
                    desc: "Enfrenta retos económicos reales con herramientas prácticas.",
                    Icon: () => (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Planeación y visión a futuro",
                    desc: "Establece metas claras y administra recursos con perspectiva.",
                    Icon: () => (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                  },
                  {
                    label: "Trabajo colaborativo en el aula",
                    desc: "Potencia el aprendizaje compartido en equipos.",
                    Icon: () => (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                  },
                  {
                    label: "Responsabilidad socioemocional",
                    desc: "Desarrolla autonomía, empatía y habilidades para la vida.",
                    Icon: () => (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                    ),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`reveal-element reveal-delay-${(i % 3) + 1} conoce-skill-card`}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(25, 131, 253, 0.18)",
                      borderRadius: "24px",
                      padding: "clamp(22px, 2.5vw, 30px)",
                      display: "flex",
                      flexDirection: "column" as const,
                      gap: "16px",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)" as any,
                      transition:
                        "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease, background 0.28s ease",
                      maxWidth: "340px",
                      margin: "0 auto",
                      width: "100%",
                      cursor: "default",
                      position: "relative" as const,
                      overflow: "hidden",
                    }}
                  >
                    {/* card inner glow on hover — handled via CSS */}
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background:
                          "linear-gradient(135deg, #0056E7 0%, #1983FD 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 20px rgba(0, 86, 231, 0.45)",
                        flexShrink: 0,
                      }}
                    >
                      <item.Icon />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "clamp(15px, 1.05rem, 17px)",
                          fontWeight: 500,
                          color: "#e8f0ff",
                          marginBottom: "8px",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "clamp(13px, 0.88rem, 15px)",
                          color: "rgba(180, 205, 255, 0.65)",
                          lineHeight: 1.65,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                    {/* Hover arrow indicator */}
                    <div
                      className="conoce-card-arrow"
                      style={{
                        position: "absolute",
                        bottom: "22px",
                        right: "22px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "rgba(25,131,253,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                        transform: "translateX(-4px)",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#60aeff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
  .conoce-skill-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0, 86, 231, 0.35), 0 0 0 1px rgba(25, 131, 253, 0.4);
  border-color: rgba(25, 131, 253, 0.45)!important;
  background: rgba(255, 255, 255, 0.07)!important;
}
            .conoce-skill-card:hover .conoce-card-arrow {
  opacity: 1!important;
  transform: translateX(0)!important;
}
@media(max-width: 900px) {
              .conoce-skills-grid {
    grid-template-columns: 1fr 1fr!important;
  }
              .conoce-stats-row > div {
    min-width: 110px!important;
  }
}
@media(max-width: 580px) {
              .conoce-skills-grid {
    grid-template-columns: 1fr!important;
  }
              .conoce-stats-row {
    gap: 12px!important;
  }
}
/* Force deep blue spatial background regardless of global overrides */
#conoce-bizen,
            .conoce-bizen-section {
  background: linear-gradient(160deg, #020c1f 0%, #041640 40%, #071e52 70%, #020c1f 100%)!important;
  overflow: hidden!important;
  position: relative!important;
}
`}</style>
          </section>
        </>
      )}

      {(sectionRange === "all" || sectionRange === "carousel") && (
        <>
          {/* Cada clase, una aventura divertida — enhanced carousel */}
          <section
            className="section adventure-carousel-section reveal-element"
            style={{
              background: "#FBFAF5",
              padding: "clamp(64px, 9vw, 112px) clamp(16px, 4vw, 60px)",
              maxWidth: "1440px",
              margin: "0 auto",
              overflow: "visible",
              height: "auto",
            }}
          >
            {/* Section header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "clamp(40px, 5vw, 60px)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(0,86,231,0.08)",
                  color: "#0056E7",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                Metodología
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(30px, 4.5vw, 52px)",
                  fontWeight: 500,
                  color: "#111",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Cada clase,{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #0056E7, #1983FD)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  una aventura divertida
                </span>
              </h2>
            </div>

            {/* Carousel */}
            <div style={{ position: "relative", overflow: "visible" }}>
              <div
                className="adventure-carousel-content-wrap"
                style={{
                  position: "relative",
                  minHeight: "clamp(420px, 65vh, 680px)",
                  overflow: "visible",
                }}
              >
                {[
                  {
                    title: "Microlearning",
                    tag: "Lecciones cortas",
                    description:
                      "Utilizamos contenidos digitales y videos cortos interactivos en todas nuestras lecciones, creados por especialistas académicos y de animación infantil (Netflix) para facilitar el aprendizaje de tus estudiantes.",
                    imageSrc: "/uploads/Landing_page/landing-1.png",
                    imageAlt: "Microlearning",
                  },
                  {
                    title: "Gamificación",
                    tag: "Motivación constante",
                    description:
                      "Cada lección incluye retos y recompensas que mantienen a los estudiantes motivados y comprometidos con su aprendizaje financiero desde el primer día.",
                    imageSrc: "/uploads/Landing_page/landing-2.png",
                    imageAlt: "Gamificación",
                  },
                  {
                    title: "Contenido Interactivo",
                    tag: "Aprende haciendo",
                    description:
                      "Material multimedia diseñado para captar la atención y facilitar la comprensión de conceptos financieros complejos de forma práctica y atractiva.",
                    imageSrc: "/uploads/Landing_page/landing-3.png",
                    imageAlt: "Contenido Interactivo",
                  },
                ].map((slide, idx) => (
                  <div
                    key={idx}
                    style={{
                      position:
                        activeAdventureSlide === idx ? "relative" : "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      width: "100%",
                      opacity: activeAdventureSlide === idx ? 1 : 0,
                      visibility:
                        activeAdventureSlide === idx ? "visible" : "hidden",
                      pointerEvents:
                        activeAdventureSlide === idx ? "auto" : "none",
                      transition: "opacity 0.55s ease, visibility 0.55s ease",
                      zIndex: activeAdventureSlide === idx ? 2 : 1,
                    }}
                  >
                    {/* Two-column card */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(24px, 4vw, 56px)",
                        alignItems: "center",
                        background:
                          "linear-gradient(135deg, #0a1628 0%, #0d2050 60%, #0056E7 100%)",
                        borderRadius: "32px",
                        padding: "clamp(32px, 5vw, 56px)",
                        boxSizing: "border-box",
                        position: "relative",
                        overflow: "visible", // Changed from hidden to fix internal scroll issue
                        boxShadow: "0 24px 64px rgba(0, 86, 231, 0.2)",
                        maxWidth: "1280px",
                        margin: "0 auto",
                      }}
                      className="adventure-slide-grid"
                    >
                      {/* Glow blobs */}
                      <div
                        style={{
                          position: "absolute",
                          top: "-60px",
                          right: "30%",
                          width: "300px",
                          height: "300px",
                          background:
                            "radial-gradient(circle, rgba(25,131,253,0.15) 0%, transparent 70%)",
                          borderRadius: "50%",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-40px",
                          left: "10%",
                          width: "240px",
                          height: "240px",
                          background:
                            "radial-gradient(circle, rgba(0,86,231,0.12) 0%, transparent 70%)",
                          borderRadius: "50%",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Left: Text */}
                      <div style={{ position: "relative", zIndex: 1 }}>
                        {/* Slide tag */}
                        <span
                          style={{
                            display: "inline-block",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "#93c5fd",
                            borderRadius: "999px",
                            padding: "5px 14px",
                            fontSize: "12px",
                            fontWeight: 500,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            marginBottom: "20px",
                          }}
                        >
                          {slide.tag}
                        </span>

                        <h3
                          style={{
                            margin: "0 0 clamp(14px, 2vw, 20px)",
                            fontSize: "clamp(26px, 3vw, 42px)",
                            fontWeight: 500,
                            color: "#fff",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {slide.title}
                        </h3>

                        <p
                          style={{
                            margin: "0 0 clamp(24px, 3vw, 36px)",
                            fontSize: "clamp(15px, 1.05vw, 18px)",
                            lineHeight: 1.75,
                            color: "rgba(255,255,255,0.72)",
                            maxWidth: "480px",
                          }}
                        >
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
                            fontWeight: 500,
                            background: "#FBFAF5",
                            color: "#0056E7",
                            borderRadius: "999px",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(255,255,255,0.15)",
                            transition: "all 0.25s ease",
                            textDecoration: "none",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 10px 28px rgba(255,255,255,0.22)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 20px rgba(255,255,255,0.15)";
                          }}
                        >
                          Solicita tu demo
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>

                      {/* Right: Image */}
                      <div
                        style={{
                          position: "relative",
                          zIndex: 1,
                          borderRadius: "20px",
                          overflow: "hidden",
                          aspectRatio: "4/3",
                          background: "rgba(0,0,0,0.15)",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                        }}
                      >
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

              {/* Navigation Dots/Counter */}
              <div
                className="carousel-nav-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "clamp(20px, 4vw, 32px)",
                  margin: "clamp(24px, 3vw, 40px) auto 0",
                  position: "relative",
                  zIndex: 5,
                }}
              >
                {/* Prev */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveAdventureSlide((prev) =>
                      prev === 0 ? 2 : prev - 1,
                    )
                  }
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#FBFAF5",
                    border: "1.5px solid rgba(0, 86, 231, 0.15)",
                    boxShadow: "0 4px 12px rgba(0, 86, 231, 0.1)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "#0056E7";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor =
                      "rgba(0, 86, 231, 0.15)";
                  }}
                  aria-label="Slide anterior"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0056E7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {/* Dots */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveAdventureSlide(idx)}
                      style={{
                        width: activeAdventureSlide === idx ? "40px" : "10px",
                        height: "10px",
                        borderRadius: "999px",
                        background:
                          activeAdventureSlide === idx
                            ? "#0056E7"
                            : "rgba(0, 86, 231, 0.15)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      aria-label={`Ir al slide ${idx + 1} `}
                    />
                  ))}
                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveAdventureSlide((prev) =>
                      prev === 2 ? 0 : prev + 1,
                    )
                  }
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#0056E7",
                    border: "none",
                    boxShadow: "0 6px 16px rgba(0, 86, 231, 0.3)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.background = "#015cf8";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "#0056E7";
                  }}
                  aria-label="Siguiente slide"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {/* Counter */}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgba(0, 86, 231, 0.4)",
                    minWidth: "40px",
                  }}
                >
                  {activeAdventureSlide + 1} / 3
                </span>
              </div>
            </div>
          </section>
        </>
      )}

      {(sectionRange === "all" || sectionRange === "problema_flow") && (
        <>
          {/* Tres obstáculos — redesigned */}
          <section
            id="problema"
            className="section curiosidad-section reveal-element"
            style={{
              background: "transparent",
              padding: "clamp(64px, 9vw, 112px) clamp(24px, 4vw, 56px)",
              position: "relative",
              overflow: "visible",
              height: "auto",
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {/* Decorative blobs */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                right: "-60px",
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(25,131,253,0.12) 0%, transparent 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-80px",
                left: "-80px",
                width: "420px",
                height: "420px",
                background:
                  "radial-gradient(circle, rgba(0,86,231,0.10) 0%, transparent 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />

            {/* Header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "clamp(48px, 6vw, 72px)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.75)",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                El reto en educación financiera
              </span>
              <h2
                style={{
                  fontSize: "clamp(36px, 5vw, 62px)",
                  fontWeight: 500,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Tres obstáculos{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #60a5fa, #1983FD)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  comunes.
                </span>
              </h2>
              <p
                style={{
                  margin: "0 auto",
                  maxWidth: "480px",
                  fontSize: "clamp(17px, 1.3vw, 20px)",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.65,
                }}
              >
                La educación financiera tropieza con lo mismo una y otra vez.
              </p>
            </div>

            {/* Cards */}
            <div
              className="curiosidad-cards-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(32px, 5vw, 64px)",
                alignItems: "stretch",
                maxWidth: "1280px",
                margin: "0 auto clamp(40px, 5vw, 56px)",
              }}
            >
              {[
                {
                  n: "01",
                  title: "Teoría sin práctica",
                  desc: "Se enseña el concepto pero no se practica con casos reales.",
                  icon: (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M8 13h8" />
                      <path d="M8 17h8" />
                      <path d="M10 9H8" />
                    </svg>
                  ),
                  delay: "0s",
                },
                {
                  n: "02",
                  title: "Difícil medir avance",
                  desc: "No hay forma clara de ver el progreso de cada estudiante.",
                  icon: (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <circle
                        cx="9"
                        cy="12"
                        r="1"
                        fill="rgba(255,255,255,0.8)"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="1"
                        fill="rgba(255,255,255,0.8)"
                      />
                      <circle
                        cx="15"
                        cy="12"
                        r="1"
                        fill="rgba(255,255,255,0.8)"
                      />
                    </svg>
                  ),
                  delay: "1.2s",
                },
                {
                  n: "03",
                  title: "Falta de tiempo del docente",
                  desc: "Los profesores no tienen tiempo para personalizar la enseñanza.",
                  icon: (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  delay: "2.4s",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="curiosidad-card"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "28px",
                    padding: "clamp(28px, 4vw, 44px) clamp(24px, 3vw, 36px)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    animationDelay: card.delay,
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    maxWidth: "360px",
                    margin: "0 auto",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "18px",
                        background: "linear-gradient(135deg, #0056E7, #1983FD)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(0, 86, 231, 0.35)",
                        flexShrink: 0,
                      }}
                    >
                      {card.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "clamp(40px, 5vw, 60px)",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.07)",
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                        userSelect: "none",
                      }}
                    >
                      {card.n}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 0.8rem, 13px)",
                        fontWeight: 500,
                        color: "#60a5fa",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      Obstáculo {card.n}
                    </div>
                    <h3
                      style={{
                        margin: "0 0 10px",
                        fontSize: "clamp(20px, 1.4rem, 24px)",
                        fontWeight: 500,
                        color: "#fff",
                        lineHeight: 1.25,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "clamp(15px, 1rem, 17px)",
                        lineHeight: 1.65,
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA bar */}
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "clamp(20px, 3vw, 28px) clamp(28px, 4vw, 56px)",
                textAlign: "center",
                backdropFilter: "blur(8px)",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(17px, 1.4vw, 21px)",
                  color: "#fff",
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(90deg, #60a5fa, #1983FD)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  BIZEN
                </span>{" "}
                está diseñado para superar estos obstáculos.
              </p>
            </div>

            <style>{`
@media(max-width: 700px) {
                  .curiosidad-cards-grid { grid-template-columns: 1fr!important; }
}
`}</style>
          </section>

          {/* Cómo funciona  — Premium redesign */}
          <section
            id="como-funciona"
            className="section how-it-works reveal-element reveal-delay-2"
            style={{
              background: "transparent",
              padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 48px)",
              overflow: "visible",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Background grid */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(0,86,231,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,231,0.05) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
                pointerEvents: "none",
              }}
            />

            {/* Glow accent */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "-20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(80vw, 600px)",
                height: "min(80vw, 600px)",
                background:
                  "radial-gradient(circle, rgba(0, 86, 231, 0.18) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(60px)",
                pointerEvents: "none",
              }}
            />

            {/* Content */}
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Section label */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "clamp(48px, 7vw, 80px)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(25, 131, 253, 0.15)",
                    color: "#60a5fa",
                    borderRadius: "999px",
                    padding: "6px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "20px",
                    border: "1px solid rgba(96, 165, 250, 0.2)",
                  }}
                >
                  Proceso
                </span>
                <h2
                  style={{
                    margin: "0 0 16px",
                    fontSize: "clamp(30px, 5vw, 56px)",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                  }}
                >
                  ¿Cómo{" "}
                  <span
                    style={{
                      background: "linear-gradient(90deg, #60a5fa, #1983FD)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    funciona?
                  </span>
                </h2>
                <p
                  style={{
                    margin: "0 auto",
                    fontSize: "clamp(15px, 1.2vw, 19px)",
                    color: "#FFFFFF",
                    fontWeight: 500,
                    maxWidth: "480px",
                    lineHeight: 1.7,
                    opacity: 0.9,
                  }}
                >
                  Tres pasos: empiezas, practicas y mides tu avance.
                </p>
              </div>

              {/* Steps grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "clamp(16px, 3vw, 28px)",
                  alignItems: "stretch",
                  position: "relative",
                }}
                className="how-it-works-steps"
              >
                {/* Connecting line (desktop only) */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "64px",
                    left: "calc(16.67% + 40px)",
                    right: "calc(16.67% + 40px)",
                    height: "2px",
                    background:
                      "linear-gradient(90deg, rgba(25,131,253,0.5), rgba(96,165,250,0.8), rgba(25,131,253,0.5))",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                  className="how-works-connector-line"
                />

                {howItWorksSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`step-card reveal-element reveal-delay-${i + 1} `}
                    style={{
                      padding: "clamp(32px, 4vw, 48px) clamp(24px, 3vw, 36px)",
                      borderRadius: "28px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow:
                        "0 8px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                      backdropFilter: "blur(16px)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "default",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {/* Step number badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-16px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0056E7, #1983FD)",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(0, 86, 231, 0.5)",
                        border: "2px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      {i + 1}
                    </div>

                    {/* Icon container */}
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "20px",
                        background:
                          "linear-gradient(135deg, rgba(0,86,231,0.3) 0%, rgba(25,131,253,0.2) 100%)",
                        border: "1px solid rgba(96, 165, 250, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "24px",
                        marginTop: "8px",
                        boxShadow: "0 8px 24px rgba(0, 86, 231, 0.2)",
                      }}
                    >
                      {i === 0 && (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="M16 13H8" />
                          <path d="M16 17H8" />
                          <path d="M10 9H8" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M3 3v18h18" />
                          <path d="M18 17V9" />
                          <path d="M13 17V5" />
                          <path d="M8 17v-3" />
                        </svg>
                      )}
                    </div>

                    <h3
                      style={{
                        margin: "0 0 12px",
                        fontSize: "clamp(17px, 1.5vw, 22px)",
                        fontWeight: 600,
                        color: "#ffffff",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "clamp(13px, 1rem, 15px)",
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 1.7,
                      }}
                    >
                      {step.schoolsText}
                    </p>
                  </div>
                ))}
                <style>{`
  .step-card:hover {
  border-color: rgba(96, 165, 250, 0.3)!important;
  box-shadow: 0 16px 48px rgba(0, 86, 231, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)!important;
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.07)!important;
}
                    .how-works-connector-line {
  display: block;
}
@media(max-width: 767px) {
                      .how-it-works-steps { grid-template-columns: 1fr!important; }
                      .how-works-connector-line { display: none!important; }
}
@media(min-width: 768px) and(max-width: 899px) {
                      .how-it-works-steps { grid-template-columns: repeat(2, 1fr)!important; }
                      .how-works-connector-line { display: none!important; }
}
@media(min-width: 900px) {
                      .how-it-works-steps { grid-template-columns: repeat(3, 1fr)!important; }
}
`}</style>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
