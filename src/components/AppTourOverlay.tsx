"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  BookIcon,
  FireIcon,
  MessageSquareIcon,
  LeafIcon,
  StarIcon,
  ShoppingCartIcon,
  TrophyIcon,
  ChevronRightIcon,
  RocketIcon
} from "@/components/CustomIcons"

// ─── Tour Steps ───────────────────────────────────────────────────────────────

const BASE_TOUR_STEPS = [
  {
    path: "/courses",
    label: "Temas y Lecciones",
    title: "Tu camino de aprendizaje",
    description: "Aquí encontrarás 30 temas de educación financiera diseñados paso a paso. Cada tema tiene lecciones interactivas, simuladores y quizzes.",
    icon: BookIcon,
    color: "#0F62FE",
    accent: "rgba(15,98,254,0.08)",
    step: 1,
    placement: "bottom-left"
  },
  {
    path: "/mision-del-dia",
    label: "Misión del día",
    title: "Construye el hábito financiero",
    description: "Cada día recibes un reto nuevo de 5 minutos. Al completarlo, publicas tu evidencia en el Foro y acumulas rachas.",
    icon: FireIcon,
    color: "#f97316",
    accent: "rgba(249,115,22,0.08)",
    step: 2,
    placement: "bottom-left"
  },
  {
    path: "/forum",
    label: "Foro",
    title: "Aprende con tu comunidad",
    description: "Comparte tus evidencias del reto diario, haz preguntas rápidas y presenta proyectos. Tu grupo te retroalimenta en tiempo real.",
    icon: MessageSquareIcon,
    color: "#8b5cf6",
    accent: "rgba(139,92,246,0.08)",
    step: 3,
    placement: "bottom-left"
  },
  {
    path: "/impacto-social",
    label: "Impacto Social",
    title: "Tu aprendizaje genera donaciones",
    description: "Cada vez que completas lecciones y retos, BIZEN dona a causas sociales.",
    icon: LeafIcon,
    color: "#10b981",
    accent: "rgba(16,185,129,0.08)",
    step: 4,
    placement: "bottom-left"
  },
  {
    path: "/tienda",
    label: "Tienda y Puntos",
    title: "Tus recompensas y progreso",
    description: "Monitorea tus BIZCOINS, nivel y rachas. Canjea tus puntos por artículos exclusivos, avatares y beneficios reales.",
    icon: ShoppingCartIcon,
    color: "#ec4899",
    accent: "rgba(236,72,153,0.08)",
    step: 5,
    placement: "bottom-right"
  },
  {
    path: "/profile",
    label: "Tu Perfil",
    title: "Tu identidad en BIZEN",
    description: "Personaliza tu avatar y bio. Sigue a otros usuarios y muestra al mundo tu crecimiento financiero.",
    icon: TrophyIcon,
    color: "#0F62FE",
    accent: "rgba(15,98,254,0.08)",
    step: 6,
    placement: "bottom-right"
  },
]

const PLACEMENTS: Record<string, React.CSSProperties> = {
  "center": { bottom: "clamp(16px, 3vw, 32px)", left: "50%", transform: "translateX(-50%)" },
  "bottom-left": { bottom: "clamp(16px, 3vw, 32px)", left: "clamp(16px, 3vw, 40px)" },
  "bottom-right": { bottom: "clamp(16px, 3vw, 32px)", right: "clamp(16px, 3vw, 40px)" },
}

interface AppTourOverlayProps {
  onEnd: () => void
}

export default function AppTourOverlay({ onEnd }: AppTourOverlayProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { dbProfile } = useAuth()
  const [stepIndex, setStepIndex] = useState(0)
  const [navigating, setNavigating] = useState(false)
  const [visible, setVisible] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)

  const isInstitutional = !!dbProfile?.schoolId || (dbProfile?.role && dbProfile.role !== 'particular')

  const tourSteps = useMemo(() => {
    return BASE_TOUR_STEPS.map(step => {
      if (step.path === "/forum" && !isInstitutional) {
        return {
          ...step,
          description: "Comparte tus evidencias del reto diario, haz preguntas rápidas y presenta proyectos. La comunidad te retroalimenta en tiempo real."
        }
      }
      if (step.path === "/impacto-social" && isInstitutional) {
        return {
          ...step,
          description: "Cada vez que completas lecciones y retos, BIZEN dona a causas sociales en nombre de tu escuela."
        }
      }
      return step
    })
  }, [isInstitutional])

  const current = tourSteps[stepIndex]

  // Navigate to first tour page on mount
  useEffect(() => {
    setVisible(true)
    if (pathname !== tourSteps[0].path) {
      router.push(tourSteps[0].path)
    }
    const t = setTimeout(() => setCardVisible(true), 100)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Highlight sidebar item
  useEffect(() => {
    if (!visible || !current) return
    const allItems = document.querySelectorAll('[data-tour-id]')
    allItems.forEach(el => {
      (el as HTMLElement).style.boxShadow = ""
        ; (el as HTMLElement).style.transform = ""
        ; (el as HTMLElement).style.zIndex = ""
    })
    const target = document.querySelector(`[data-tour-id="${current.path}"]`) as HTMLElement
    if (target) {
      target.style.boxShadow = `0 0 0 3px ${current.color}60, 0 8px 24px ${current.color}40`
      target.style.transform = "scale(1.05) translateX(4px)"
      target.style.zIndex = "100002"
      target.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    return () => {
      allItems.forEach(el => {
        (el as HTMLElement).style.boxShadow = ""
          ; (el as HTMLElement).style.transform = ""
          ; (el as HTMLElement).style.zIndex = ""
      })
    }
  }, [visible, current, pathname])

  // Animate card back in when path matches
  useEffect(() => {
    if (pathname === current.path) {
      setNavigating(false)
      const t = setTimeout(() => setCardVisible(true), 150)
      return () => clearTimeout(t)
    }
  }, [pathname, current.path])

  const goToNext = useCallback(() => {
    if (navigating) return
    const next = stepIndex + 1
    if (next >= tourSteps.length) {
      setCardVisible(false)
      setTimeout(() => { setVisible(false); onEnd() }, 350)
      return
    }
    setCardVisible(false)
    setNavigating(true)
    setTimeout(() => {
      setStepIndex(next)
      router.push(tourSteps[next].path)
    }, 300)
  }, [navigating, stepIndex, router, onEnd])

  if (!visible) return null

  const isLast = stepIndex === tourSteps.length - 1
  const progressPct = ((stepIndex + 1) / tourSteps.length) * 100

  return (
    <>
      <style>{`
        @keyframes tour-in {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tour-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(20px) scale(0.96); }
        }
        @keyframes tour-bob {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50%     { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes tour-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 14px var(--tc-a); }
          50%      { transform: scale(1.04); box-shadow: 0 10px 28px var(--tc-b); }
        }
        @keyframes tour-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* ── Card ── */
        .tc {
          position: fixed;
          z-index: 100001;
          background: #ffffff;
          border-radius: clamp(18px, 3vw, 26px);
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 16px 48px rgba(0,0,0,0.18),
            0 0 0 1px rgba(0,0,0,0.05);
          overflow: hidden;
          line-height: 1.5;
          width: calc(100vw - clamp(20px, 6vw, 80px));
          max-width: clamp(280px, 94vw, 520px);
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .tc.enter { animation: tour-in 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .tc.exit  { animation: tour-out 0.3s ease forwards; }

        /* ── Progress bar at top ── */
        .tc-progress {
          height: 4px;
          background: #f1f5f9;
        }
        .tc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--tc-color) 0%, var(--tc-color-light) 100%);
          background-size: 200% auto;
          transition: width 0.55s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Backdrop ── */
        .tc-backdrop {
          position: fixed; inset: 0;
          z-index: 100000;
          pointer-events: auto;
          background: transparent;
        }

        /* ── Inner layout ── */
        .tc-body {
          padding: clamp(16px, 3.5vw, 28px) clamp(18px, 4vw, 32px);
        }

        /* ── Header row ── */
        .tc-header {
          display: flex;
          align-items: flex-start;
          gap: clamp(10px, 2.5vw, 18px);
          margin-bottom: clamp(10px, 2.5vw, 16px);
        }

        /* ── Mascot ── */
        .tc-mascot {
          width: clamp(48px, 10vw, 68px);
          height: clamp(48px, 10vw, 68px);
          flex-shrink: 0;
          animation: tour-bob 3.2s ease infinite;
          filter: drop-shadow(0 4px 8px rgba(15,98,254,0.2));
        }

        /* ── Badge ── */
        .tc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: clamp(10px, 2vw, 12px);
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 999px;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        /* ── Title ── */
        .tc-title {
          margin: 0 0 2px;
          font-size: clamp(15px, 3.5vw, 20px);
          font-weight: 500;
          color: #0f172a;
          line-height: 1.25;
        }

        /* ── Description ── */
        .tc-desc {
          margin: 0 0 clamp(14px, 3.5vw, 22px);
          font-size: clamp(12px, 2.8vw, 14px);
          color: #475569;
          line-height: 1.65;
        }

        /* ── Footer row ── */
        .tc-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* ── Dots ── */
        .tc-dots {
          display: flex;
          gap: 5px;
          align-items: center;
          flex: 1;
        }
        .tc-dot {
          height: 5px;
          border-radius: 3px;
          transition: all 0.36s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Buttons ── */
        .tc-actions { display: flex; gap: 8px; }
        .tc-btn {
          border-radius: 11px;
          font-weight: 500;
          font-size: clamp(12px, 2.8vw, 14px);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex; align-items: center; justify-content: center;
        }
        .tc-btn-prev {
          padding: clamp(9px, 2vw, 12px) clamp(14px, 3vw, 20px);
          border: 1.5px solid #e5e7eb;
          background: white; color: #6b7280;
        }
        .tc-btn-prev:hover { border-color: #d1d5db; background: #f9fafb; }
        .tc-btn-next {
          padding: clamp(9px, 2vw, 12px) clamp(18px, 4vw, 28px);
          border: none; color: white;
          animation: tour-breathe 2.6s ease-in-out infinite;
        }
        .tc-btn-next:hover:not(:disabled) { filter: brightness(1.08); animation-play-state: paused; }
        .tc-btn-next:disabled { opacity: 0.7; cursor: not-allowed; animation: none; }

        /* ─── MOBILE ──────────────────────────────────────────────────────── */
        @media (max-width: 767px) {
          .tc {
            /* On mobile: stick to bottom above the mobile nav bar */
            left: 12px !important;
            right: 12px !important;
            bottom: calc(68px + env(safe-area-inset-bottom)) !important;
            transform: none !important;
            width: calc(100% - 24px) !important;
            max-width: 100% !important;
            border-radius: 20px !important;
          }
          .tc-header {
            flex-direction: row;
            align-items: center;
          }
          .tc-mascot {
            width: 48px;
            height: 48px;
          }
          .tc-title { font-size: 15px; }
          .tc-desc  { font-size: 12px; line-height: 1.55; margin-bottom: 14px; }
          .tc-footer { gap: 8px; }
          .tc-btn   { font-size: 13px; }
          .tc-btn-prev { padding: 9px 14px; }
          .tc-btn-next { padding: 9px 18px; }
        }

        @media (max-width: 400px) {
          .tc-body { padding: 14px 16px; }
          .tc-mascot { width: 40px; height: 40px; }
          .tc-badge { font-size: 9px; padding: 3px 9px; }
          .tc-title { font-size: 14px; }
        }
      `}</style>

      {/* Blocking backdrop */}
      <div className="tc-backdrop" />

      <div
        className={`tc ${cardVisible ? "enter" : "exit"}`}
        style={{
          ...PLACEMENTS[(current as any).placement || "center"],
          "--tc-color": current.color,
          "--tc-color-light": current.color + "99",
          "--tc-a": current.color + "40",
          "--tc-b": current.color + "70",
        } as React.CSSProperties}
      >
        {/* Progress stripe */}
        <div className="tc-progress">
          <div className="tc-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="tc-body">
          {/* Header: mascot + badge + title */}
          <div className="tc-header">
            <div className="tc-mascot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image copy 5.png" alt="Billy" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tc-badge" style={{ color: current.color, background: current.accent, border: `1px solid ${current.color}25` }}>
                {current.icon && <current.icon size={14} color={current.color} />}
                <span>{current.label}</span>
                <span style={{ opacity: 0.55, fontSize: "0.9em" }}>{stepIndex + 1}/{tourSteps.length}</span>
              </div>
              <h3 className="tc-title">{current.title}</h3>
            </div>
          </div>

          {/* Description */}
          <p className="tc-desc">{current.description}</p>

          {/* Footer: dots + navigation */}
          <div className="tc-footer">
            {/* Step dots */}
            <div className="tc-dots">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className="tc-dot"
                  style={{
                    background: i === stepIndex ? current.color : i < stepIndex ? "#cbd5e1" : "#e9edf2",
                    width: i === stepIndex ? 20 : 5,
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="tc-actions">
              {stepIndex > 0 && (
                <button
                  className="tc-btn tc-btn-prev"
                  onClick={() => {
                    setCardVisible(false)
                    setNavigating(true)
                    setTimeout(() => {
                      setStepIndex(stepIndex - 1)
                      router.push(tourSteps[stepIndex - 1].path)
                    }, 280)
                  }}
                >
                  Anterior
                </button>
              )}
              <button
                className="tc-btn tc-btn-next"
                onClick={goToNext}
                disabled={navigating}
                style={{
                  background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                  boxShadow: `0 4px 14px ${current.color}40`,
                  opacity: navigating ? 0.7 : 1,
                  cursor: navigating ? "not-allowed" : "pointer"
                }}
              >
                {navigating ? "..." : isLast ? (
                  <>
                    ¡Comenzar!
                    <RocketIcon size={16} color="white" style={{ marginLeft: 6 }} />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRightIcon size={16} color="white" style={{ marginLeft: 2 }} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
