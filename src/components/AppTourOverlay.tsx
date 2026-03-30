"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { 
  BookOpen, Home, Wallet, Target, MessageSquare, 
  Globe, ShoppingBag, Trophy, User, Sparkles,
  ChevronRight, ChevronLeft, X, Lightbulb
} from "lucide-react"

// ─── Tour Step Definitions ────────────────────────────────────────────────────

interface TourStep {
  path: string
  label: string
  icon: any
  title: string
  description: string
  color: string
  colorLight: string
  colorDark: string
  tip?: string
  placement: "bottom-left" | "bottom-right" | "center"
}

const BASE_TOUR_STEPS: TourStep[] = [
  {
    path: "/courses",
    label: "Lecciones",
    icon: BookOpen,
    title: "Tu camino de aprendizaje",
    description: "Explora 30 temas de educación financiera diseñados paso a paso: presupuesto, inversión, deuda, emprendimiento y más. Cada tema tiene lecciones interactivas, quizzes y simuladores.",
    tip: "Completa lecciones para ganar XP y subir de nivel.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
    title: "Tu centro de control",
    description: "El dashboard es tu punto de partida. Mira tu racha diaria, las misiones del día, tu progreso en XP y accede rápidamente a lo que necesitas.",
    tip: "Completa la misión diaria para mantener tu racha activa.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/tools/budget",
    label: "Smart Budget",
    icon: Wallet,
    title: "Presupuesto inteligente con IA",
    description: "Registra ingresos y gastos, analiza tu flujo de dinero y obtén consejos de tu asesor financiero con IA. También puedes predecir tu flujo futuro con el modo 'Forecast'.",
    tip: "Usa Billy Insights para obtener consejos personalizados sobre tu presupuesto.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/tools/vision",
    label: "Vision Board",
    icon: Target,
    title: "Tablero de metas financieras",
    description: "Visualiza tus metas de ahorro e inversión con el Vision Board. Define objetivos, ponles fecha y monitorea tu avance hacia la libertad financiera.",
    tip: "Tener metas claras triplica la probabilidad de alcanzarlas.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/forum",
    label: "Foro & Comunidad",
    icon: MessageSquare,
    title: "Aprende con tu comunidad",
    description: "Comparte tus avances, haz preguntas financieras y aprende de otros. El foro es un espacio donde la comunidad BIZEN crece junta. Publica evidencias de tus retos diarios y recibe retroalimentación.",
    tip: "Participar en el foro te da puntos extra de XP.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/impacto-social",
    label: "Impacto Social",
    icon: Globe,
    title: "Tu aprendizaje genera donaciones",
    description: "Cada lección que completas y cada reto que logras hace que BIZEN done a causas sociales. Tu educación financiera tiene un impacto real en el mundo.",
    tip: "Mira cuánto ha donado la comunidad BIZEN en total.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/tienda",
    label: "Tienda & Recompensas",
    icon: ShoppingBag,
    title: "Tus BIZCOINS y recompensas",
    description: "Gana BIZCOINS por completar lecciones, retos y participar en la comunidad. Canjéalos por recompensas exclusivas, avatares premium y beneficios reales.",
    tip: "Mantén una racha de 7 días para multiplicar tus BIZCOINS.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-right",
  },
  {
    path: "/leaderboard",
    label: "Rankings",
    icon: Trophy,
    title: "Compite y destaca",
    description: "Mira dónde estás en el ranking semanal y mensual. Compite con tu clase, tu escuela o con toda la comunidad BIZEN. ¿Puedes llegar al TOP 10?",
    tip: "Los rankings se actualizan cada semana. ¡El domingo es el gran reset!",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-right",
  },
  {
    path: "/profile",
    label: "Tu Perfil",
    icon: User,
    title: "Tu identidad en BIZEN",
    description: "Personaliza tu avatar, edita tu bio y muestra tus logros al mundo. Aquí también puedes ver a quién sigues, quién te sigue y tus certificaciones obtenidas.",
    tip: "Un perfil completo genera más conexiones con la comunidad.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-right",
  },
]

// Paths for "skip" overlay (no dimming)
const PLACEMENTS: Record<string, React.CSSProperties> = {
  "center": { bottom: "clamp(16px, 3vw, 32px)", left: "50%", transform: "translateX(-50%)" },
  "bottom-left": { bottom: "clamp(76px, 10vw, 32px)", left: "clamp(16px, 3vw, 40px)" },
  "bottom-right": { bottom: "clamp(76px, 10vw, 32px)", right: "clamp(16px, 3vw, 40px)" },
}

interface AppTourOverlayProps {
  onEnd: () => void
  discoveryMode?: boolean
}

export default function AppTourOverlay({ onEnd, discoveryMode = false }: AppTourOverlayProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { dbProfile } = useAuth()

  // Find the step corresponding to the current path for discovery mode
  const initialStepIndex = useMemo(() => {
    if (!discoveryMode) return 0
    const idx = BASE_TOUR_STEPS.findIndex(s => s.path === pathname)
    return idx !== -1 ? idx : 0
  }, [discoveryMode, pathname])

  const [stepIndex, setStepIndex] = useState(initialStepIndex)
  const [navigating, setNavigating] = useState(false)
  const [visible, setVisible] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  const isInstitutional = !!dbProfile?.schoolId || (dbProfile?.role && dbProfile.role !== 'particular')

  const tourSteps = useMemo<TourStep[]>(() => {
    return BASE_TOUR_STEPS.filter(step => {
      return true
    }).map(step => {
      if (step.path === "/forum" && !isInstitutional) {
        return {
          ...step,
          description: "Comparte tus avances, haz preguntas financieras y aprende de otros. El foro es un espacio colaborativo donde toda la comunidad BIZEN crece junta. Publica evidencias de tus retos y recibe retroalimentación en tiempo real.",
        }
      }
      return step
    })
  }, [isInstitutional])

  const current = tourSteps[stepIndex]
  const isLast = stepIndex === tourSteps.length - 1
  const progressPct = ((stepIndex + 1) / tourSteps.length) * 100

  // Navigate to first step on mount
  useEffect(() => {
    setVisible(true)
    if (!discoveryMode && pathname !== tourSteps[0].path) {
      router.push(tourSteps[0].path)
    }
    const t = setTimeout(() => setCardVisible(true), 120)

    return () => {
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Highlight sidebar item for current step
  useEffect(() => {
    if (!visible || !current) return
    const allItems = document.querySelectorAll('[data-tour-id]')
    allItems.forEach(el => {
      (el as HTMLElement).style.boxShadow = ""
      ;(el as HTMLElement).style.transform = ""
      ;(el as HTMLElement).style.zIndex = ""
    })
    const target = document.querySelector(`[data-tour-id="${current.path}"]`) as HTMLElement
    if (target) {
      target.style.boxShadow = `0 0 0 3px ${current.color}70, 0 8px 24px ${current.color}40`
      target.style.transform = "scale(1.06) translateX(3px)"
      target.style.zIndex = "100002"
      target.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    return () => {
      allItems.forEach(el => {
        (el as HTMLElement).style.boxShadow = ""
        ;(el as HTMLElement).style.transform = ""
        ;(el as HTMLElement).style.zIndex = ""
      })
    }
  }, [visible, current, pathname])

  // Re-show card when path matches
  useEffect(() => {
    if (pathname === current?.path) {
      setNavigating(false)
      const t = setTimeout(() => setCardVisible(true), 180)
      return () => clearTimeout(t)
    }
  }, [pathname, current?.path])

  const endTour = useCallback(() => {
    setClosing(true)
    setCardVisible(false)
    setTimeout(() => { setVisible(false); onEnd() }, 400)
  }, [onEnd])

  const goToNext = useCallback(() => {
    if (navigating) return
    // In discovery mode, "Next" just closes the current page onboarding
    if (discoveryMode || isLast) { endTour(); return }
    
    setCardVisible(false)
    setNavigating(true)
    setTimeout(() => {
      const next = stepIndex + 1
      setStepIndex(next)
      router.push(tourSteps[next].path)
    }, 320)
  }, [navigating, isLast, discoveryMode, stepIndex, router, tourSteps, endTour])

  const goToPrev = useCallback(() => {
    if (navigating || stepIndex === 0 || discoveryMode) return
    setCardVisible(false)
    setNavigating(true)
    setTimeout(() => {
      const prev = stepIndex - 1
      setStepIndex(prev)
      router.push(tourSteps[prev].path)
    }, 320)
  }, [navigating, stepIndex, discoveryMode, router, tourSteps])

  if (!visible) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes tc-in      { from { opacity:0; transform:translateY(32px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes tc-out     { from { opacity:1; transform:translateY(0) scale(1) } to { opacity:0; transform:translateY(24px) scale(0.96) } }
        @keyframes tc-float   { 0%,100% { transform:translateY(0) rotate(-1deg) } 50% { transform:translateY(-9px) rotate(1.5deg) } }
        @keyframes tc-shimmer { 0% { background-position:-200% center } 100% { background-position:200% center } }
        @keyframes tc-breathe { 0%,100% { box-shadow: 0 6px 20px var(--c-shadow-a) } 50% { box-shadow: 0 12px 36px var(--c-shadow-b), 0 0 32px var(--c-glow) } }
        @keyframes tc-spin    { to { transform: rotate(360deg) } }
        @keyframes tc-dot-pop { from { transform:scale(0.5); opacity:0 } to { transform:scale(1); opacity:1 } }
        @keyframes tc-tip-in  { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes tc-ring    { 0% { opacity:0.6; transform:scale(0.92) } 100% { opacity:0; transform:scale(1.55) } }

        /* ── Backdrop (non-blocking, just a faint tint) ── */
        .tc-backdrop {
          position: fixed; inset: 0; z-index: 100000;
          pointer-events: none;
          background: rgba(2,8,23,0.35);
          backdrop-filter: blur(1px);
          animation: tc-in 0.4s ease both;
        }
        .tc-backdrop.hiding { animation: tc-out 0.35s ease forwards; }

        /* ── Skip pill floated top-right ── */
        .tc-skip {
          position: fixed; top: clamp(12px,3vw,20px); right: clamp(12px,3vw,20px);
          z-index: 100003;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px; padding: 7px 18px;
          font-size: clamp(11.5px,2.8vw,13px); font-weight: 600;
          color: rgba(255,255,255,0.8); cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s; letter-spacing: 0.01em;
        }
        .tc-skip:hover { background: rgba(255,255,255,0.16); color: #fff; }

        /* ── Main card ── */
        .tc-card {
          position: fixed; z-index: 100001;
          background: #ffffff;
          border-radius: clamp(18px, 3vw, 26px);
          overflow: hidden; line-height: 1.5;
          width: calc(100vw - clamp(20px,6vw,80px));
          max-width: clamp(280px, 94vw, 520px);
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 20px 56px rgba(0,0,0,0.22),
            0 0 0 1px rgba(0,0,0,0.055);
          font-family: 'Inter', sans-serif;
          word-wrap: break-word; overflow-wrap: break-word;
          transition: bottom 0.3s ease;
        }
        .tc-card.shown { animation: tc-in 0.44s cubic-bezier(0.34,1.56,0.64,1) both; }
        .tc-card.hiding { animation: tc-out 0.32s ease forwards; }

        /* ── Top accent bar ── */
        .tc-accent-bar {
          height: 5px;
          background: linear-gradient(90deg, var(--tc-color) 0%, var(--tc-color-light,#93c5fd) 100%);
          background-size: 200% auto;
          animation: tc-shimmer 2.8s linear infinite;
          position: relative; overflow: hidden;
        }

        /* ── Header ── */
        .tc-header {
          display: flex; align-items: flex-start; gap: clamp(10px,2.5vw,16px);
          padding: clamp(14px,3.5vw,24px) clamp(16px,4vw,28px) 0;
        }

        /* ── Badge row ── */
        .tc-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 4px 12px; border-radius: 999px;
          font-size: clamp(10px,2vw,12px); font-weight: 700;
          letter-spacing: 0.05em; margin-bottom: 5px;
        }

        /* ── Title ── */
        .tc-title {
          margin: 0; font-size: clamp(15px,3.5vw,20px); font-weight: 800;
          color: #0f172a; line-height: 1.2; letter-spacing: -0.025em;
        }

        /* ── Body ── */
        .tc-body { padding: 0 clamp(16px,4vw,28px) clamp(16px,4vw,24px); }

        /* ── Description ── */
        .tc-desc {
          margin: clamp(10px,2.5vw,14px) 0 0;
          font-size: clamp(12px,2.8vw,14px); color: #475569; line-height: 1.68;
        }

        /* ── Tip box ── */
        .tc-tip {
          margin-top: clamp(10px,2.5vw,14px);
          padding: 10px 14px; border-radius: 12px;
          background: var(--tc-accent, rgba(15,98,254,0.06));
          border-left: 3px solid var(--tc-color, #0F62FE);
          display: flex; align-items: flex-start; gap: 8px;
          animation: tc-tip-in 0.4s ease 0.2s both;
        }
        .tc-tip-emoji { font-size: 14px; line-height: 1.5; flex-shrink: 0; }
        .tc-tip-text { font-size: clamp(11px,2.6vw,12.5px); color: #475569; font-weight: 500; line-height: 1.6; }

        /* ── Footer ── */
        .tc-footer {
          display: flex; align-items: center; gap: 10px;
          padding: clamp(12px,3vw,18px) clamp(16px,4vw,28px) clamp(14px,3.5vw,22px);
          border-top: 1px solid #f1f5f9;
        }

        /* ── Progress / step dots ── */
        .tc-dots { display: flex; gap: 5px; align-items: center; flex: 1; }
        .tc-dot {
          height: 5px; border-radius: 3px;
          transition: all 0.38s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Buttons ── */
        .tc-actions { display: flex; gap: 7px; }
        .tc-btn {
          border-radius: 12px; font-family: 'Inter', sans-serif;
          font-size: clamp(12px,2.8vw,14px); font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .tc-btn-prev {
          padding: clamp(9px,2vw,12px) clamp(14px,3vw,18px);
          border: 2px solid #e5e7eb; background: white; color: #6b7280;
        }
        .tc-btn-prev:hover { border-color: #cbd5e1; background: #f9fafb; color: #374151; }
        .tc-btn-next {
          padding: clamp(9px,2vw,12px) clamp(16px,3.5vw,24px);
          border: none; color: white; position: relative; overflow: hidden;
          --c-shadow-a: rgba(15,98,254,0.3);
          --c-shadow-b: rgba(15,98,254,0.55);
          --c-glow: rgba(15,98,254,0.25);
          animation: tc-breathe 2.8s ease-in-out infinite;
        }
        .tc-btn-next::before {
          content: ''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.15) 50%,transparent 70%);
          background-size: 200%; animation: tc-shimmer 2.5s linear infinite;
        }
        .tc-btn-next:hover:not(:disabled) { filter: brightness(1.1); animation-play-state: paused; transform: translateY(-1px); }
        .tc-btn-next:disabled { opacity: 0.65; cursor: not-allowed; animation: none; }

        /* ── Progress bar (thin top inside footer) ── */
        .tc-progress-wrap { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #f1f5f9; }
        .tc-progress-fill {
          height: 100%; background: var(--tc-color, #0F62FE);
          transition: width 0.55s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Step count badge (top of card) ── */
        .tc-step-count {
          position: absolute; top: 16px; right: 16px;
          background: rgba(15,98,254,0.08); border-radius: 999px;
          padding: 3px 10px; font-size: 11px; font-weight: 700;
          color: #0F62FE; font-family: 'Inter', sans-serif;
        }

          font-size: 13px;
          box-shadow: 0 8px 20px rgba(37,99,235,0.4);
          animation: tc-in 0.5s ease both;
        }

        /* ────────── MOBILE ────────── */
        @media (max-width: 767px) {
          .tc-card {
            left: 10px !important; right: 10px !important;
            bottom: calc(74px + env(safe-area-inset-bottom)) !important;
            transform: none !important; width: calc(100% - 20px) !important;
            max-width: 100% !important; border-radius: 20px !important;
          }
          .tc-skip { top: 12px; right: 12px; }
          .tc-mascot-wrap { width: 44px; height: 44px; }
          .tc-title { font-size: 15px; }
          .tc-desc  { font-size: 12.5px; line-height: 1.6; }
          .tc-tip   { padding: 9px 12px; }
          .tc-footer { padding: 10px 16px 14px; gap: 8px; }
          .tc-btn   { font-size: 13px; }
          .tc-btn-prev { padding: 9px 14px; }
          .tc-btn-next { padding: 9px 18px; }
        }
        @media (max-width: 400px) {
          .tc-header { padding: 12px 14px 0; gap: 9px; }
          .tc-body { padding: 0 14px 14px; }
          .tc-mascot-wrap { width: 38px; height: 38px; }
          .tc-badge { font-size: 9px; padding: 3px 9px; }
          .tc-title { font-size: 14px; }
        }
      `}</style>

      {/* Dimming backdrop */}
      <div className={`tc-backdrop${closing ? " hiding" : ""}`} />

      {/* Skip pill */}
      {!discoveryMode && (
        <button className="tc-skip" onClick={endTour}>
          Saltar tour ✕
        </button>
      )}

      {/* Tour card */}
      <div
        className={`tc-card ${cardVisible ? "shown" : "hiding"}`}
        style={{
          ...PLACEMENTS[current.placement],
          "--tc-color": current.color,
          "--tc-color-light": current.colorLight.replace('0.1', '0.6'),
          "--tc-accent": current.colorLight,
        } as React.CSSProperties}
      >
        {/* Thin top accent */}
        <div className="tc-accent-bar" style={{ "--tc-color": current.color, "--tc-color-light": current.colorLight.replace('0.1', '0.6') } as React.CSSProperties} />

        {/* Thin top progress */}
        <div className="tc-progress-wrap">
          <div className="tc-progress-fill" style={{ width: `${progressPct}%`, background: current.color }} />
        </div>

        {/* Step count chip (only in tour mode) */}
        {!discoveryMode && (
          <div className="tc-step-count" style={{ color: current.color, background: current.colorLight }}>
            {stepIndex + 1} / {tourSteps.length}
          </div>
        )}

        {/* Header */}
        <div className="tc-header">
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2, paddingRight: discoveryMode ? 0 : 48 }}>
            {/* Badge */}
            <div className="tc-badge" style={{ color: current.color, background: current.colorLight, border: `1.5px solid ${current.colorLight.replace('0.1)', '0.3)')}` }}>
              <current.icon size={13} style={{ marginRight: 4 }} />
              <span>{current.label}</span>
            </div>
            <h3 className="tc-title">{current.title}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="tc-body">
          <p className="tc-desc" style={{ marginTop: 0 }}>{current.description}</p>

          {current.tip && (
            <div className="tc-tip">
              <Lightbulb size={12} style={{ marginRight: 6, flexShrink: 0 }} />
              <span className="tc-tip-text">{current.tip}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tc-footer">
          {/* Dots (only in tour mode) */}
          <div className="tc-dots">
            {!discoveryMode && tourSteps.map((_, i) => (
              <div
                key={i}
                className="tc-dot"
                style={{
                  background: i === stepIndex
                    ? current.color
                    : i < stepIndex ? "#cbd5e1" : "#e9edf2",
                  width: i === stepIndex ? 22 : 5,
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="tc-actions" style={{ width: discoveryMode ? '100%' : 'auto' }}>
            {stepIndex > 0 && !discoveryMode && (
              <button
                className="tc-btn tc-btn-prev"
                onClick={goToPrev}
                disabled={navigating}
              >
                ← Anterior
              </button>
            )}
            <button
              className="tc-btn tc-btn-next"
              onClick={goToNext}
              disabled={navigating}
              style={{
                width: discoveryMode ? '100%' : 'auto',
                background: navigating
                  ? "#94a3b8"
                  : `linear-gradient(135deg, ${current.colorDark} 0%, ${current.color} 100%)`,
                "--c-shadow-a": `${current.color}40`,
                "--c-shadow-b": `${current.color}65`,
                "--c-glow": `${current.color}30`,
              } as React.CSSProperties}
            >
              {navigating ? (
                <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "tc-spin 0.7s linear infinite", display: "inline-block" }} />
              ) : discoveryMode ? (
                <>¡Entendido! ✨</>
              ) : isLast ? (
                <>¡Empezar! 🚀</>
              ) : (
                <>Siguiente →</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
