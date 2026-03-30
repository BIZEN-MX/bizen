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
    label: "Cursos",
    icon: BookOpen,
    title: "Tu camino de aprendizaje",
    description: "Explora temas de educación financiera diseñados paso a paso. Cada tema tiene lecciones interactivas, quizzes y simuladores.",
    tip: "Completa lecciones para ganar XP y subir de nivel.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/dashboard",
    label: "Inicio",
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
    path: "/cash-flow",
    label: "Simuladores",
    icon: Wallet,
    title: "Simula tu futuro financiero",
    description: "Registra ingresos y gastos, analiza tu flujo de dinero y obtén consejos de tu asesor financiero con IA. Aprende a predecir tu flujo futuro.",
    tip: "Usa Billy Insights para obtener consejos personalizados sobre tu presupuesto.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/comunidad",
    label: "Comunidad",
    icon: MessageSquare,
    title: "Aprende con tu comunidad",
    description: "Comparte tus avances, haz preguntas financieras y aprende de otros. El espacio donde la comunidad BIZEN crece junta.",
    tip: "Participar en el foro te da puntos extra de XP.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/impacto-social",
    label: "Impacto",
    icon: Globe,
    title: "Tu aprendizaje genera donaciones",
    description: "Cada lección que completas y cada reto que logras hace que BIZEN done a causas sociales. Tu educación financiera tiene un impacto real.",
    tip: "Mira cuánto ha donado la comunidad BIZEN en total.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-left",
  },
  {
    path: "/tienda",
    label: "Tienda",
    icon: ShoppingBag,
    title: "Tus recompensas",
    description: "Gana BIZCOINS por completar lecciones y retos. Canjéalos por premios exclusivos, avatares premium y beneficios reales.",
    tip: "Mantén una racha de 7 días para multiplicar tus BIZCOINS.",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-right",
  },
  {
    path: "/rankings",
    label: "Rankings",
    icon: Trophy,
    title: "Compite y destaca",
    description: "Mira dónde estás en el ranking semanal y mensual. Compite con tu clase, tu escuela o con toda la comunidad BIZEN.",
    tip: "Los rankings se actualizan cada semana. ¡El domingo es el gran reset!",
    color: "#0F62FE",
    colorLight: "rgba(15,98,254,0.1)",
    colorDark: "#0040c8",
    placement: "bottom-right",
  },
  {
    path: "/profile",
    label: "Perfil",
    icon: User,
    title: "Tu identidad",
    description: "Personaliza tu avatar, edita tu bio y muestra tus logros al mundo. Gestiona tus seguidores y certificaciones.",
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
  const { dbProfile, setDbProfile } = useAuth()

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
          description: "Comparte tus avances, haz preguntas financieras y aprende de otros. El foro es un espacio colaborativo donde toda la comunidad BIZEN crece junta.",
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

  const endTour = useCallback(async () => {
    setClosing(true)
    setCardVisible(false)
    
    // Persist to DB if not in discovery mode
    if (!discoveryMode && dbProfile) {
      try {
        const currentSettings = dbProfile.settings || {}
        const newSettings = { ...currentSettings, hasSeenTour: true };
        
        // Optimistic update
        setDbProfile({ ...dbProfile, settings: newSettings });

        await fetch("/api/profiles", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: newSettings })
        })
      } catch (err) {
        console.error("Failed to save tour progress:", err)
      }
    }

    setTimeout(() => { setVisible(false); onEnd() }, 400)
  }, [onEnd, discoveryMode, dbProfile, setDbProfile])

  const goToNext = useCallback(() => {
    if (navigating) return
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

        @keyframes tc-in      { from { opacity:0; transform:translateY(32px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes tc-out     { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(24px) scale(0.96); } }
        @keyframes tc-float   { 0%,100% { transform:translateY(0) rotate(-1deg); } 50% { transform:translateY(-9px) rotate(1.5deg); } }
        @keyframes tc-shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes tc-breathe { 0%,100% { box-shadow: 0 6px 20px var(--c-shadow-a); } 50% { box-shadow: 0 12px 36px var(--c-shadow-b), 0 0 32px var(--c-glow); } }
        @keyframes tc-spin    { to { transform: rotate(360deg); } }
        @keyframes tc-tip-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

        .tc-backdrop {
          position: fixed; inset: 0; z-index: 100000;
          pointer-events: none;
          background: rgba(2,8,23,0.35);
          backdrop-filter: blur(1px);
          animation: tc-in 0.4s ease both;
        }
        .tc-backdrop.hiding { animation: tc-out 0.35s ease forwards; }

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

        .tc-accent-bar {
          height: 5px;
          background: linear-gradient(90deg, var(--tc-color) 0%, var(--tc-color-light,#93c5fd) 100%);
          background-size: 200% auto;
          animation: tc-shimmer 2.8s linear infinite;
          position: relative; overflow: hidden;
        }

        .tc-header {
          display: flex; align-items: flex-start; gap: clamp(10px,2.5vw,16px);
          padding: clamp(14px,3.5vw,24px) clamp(16px,4vw,28px) 0;
        }

        .tc-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 4px 12px; border-radius: 999px;
          font-size: clamp(10px,2vw,12px); font-weight: 700;
          letter-spacing: 0.05em; margin-bottom: 5px;
        }

        .tc-title {
          margin: 0; font-size: clamp(15px,3.5vw,20px); font-weight: 800;
          color: #0f172a; line-height: 1.2; letter-spacing: -0.025em;
        }

        .tc-body { padding: 0 clamp(16px,4vw,28px) clamp(16px,4vw,24px); }

        .tc-desc {
          margin: clamp(10px,2.5vw,14px) 0 0;
          font-size: clamp(12px,2.8vw,14px); color: #475569; line-height: 1.68;
        }

        .tc-tip {
          margin-top: clamp(10px,2.5vw,14px);
          padding: 10px 14px; border-radius: 12px;
          background: var(--tc-accent, rgba(15,98,254,0.06));
          border-left: 3px solid var(--tc-color, #0F62FE);
          display: flex; align-items: flex-start; gap: 8px;
          animation: tc-tip-in 0.4s ease 0.2s both;
        }
        .tc-tip-text { font-size: clamp(11px,2.6vw,12.5px); color: #475569; font-weight: 500; line-height: 1.6; }

        .tc-footer {
          display: flex; align-items: center; gap: 10px;
          padding: clamp(12px,3vw,18px) clamp(16px,4vw,28px) clamp(14px,3.5vw,22px);
          border-top: 1px solid #f1f5f9;
        }

        .tc-dots { display: flex; gap: 5px; align-items: center; flex: 1; }
        .tc-dot {
          height: 5px; border-radius: 3px;
          transition: all 0.38s cubic-bezier(0.34,1.56,0.64,1);
        }

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
        .tc-btn tc-btn-next {
          padding: clamp(9px,2vw,12px) clamp(16px,3.5vw,24px);
          border: none; color: white; position: relative; overflow: hidden;
          animation: tc-breathe 2.8s ease-in-out infinite;
        }

        .tc-progress-wrap { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #f1f5f9; }
        .tc-progress-fill {
          height: 100%; background: var(--tc-color, #0F62FE);
          transition: width 0.55s cubic-bezier(0.34,1.56,0.64,1);
        }

        .tc-step-count {
          position: absolute; top: 16px; right: 16px;
          background: rgba(15,98,254,0.08); border-radius: 999px;
          padding: 3px 10px; font-size: 11px; font-weight: 700;
          color: #0F62FE; font-family: 'Inter', sans-serif;
        }

        @media (max-width: 767px) {
          .tc-card {
            left: 10px !important; right: 10px !important;
            bottom: calc(74px + env(safe-area-inset-bottom)) !important;
            transform: none !important; width: calc(100% - 20px) !important;
            max-width: 100% !important; border-radius: 20px !important;
          }
          .tc-footer { padding: 10px 16px 14px; gap: 8px; }
        }
      `}</style>

      <div className={`tc-backdrop${closing ? " hiding" : ""}`} />

      {!discoveryMode && (
        <button className="tc-skip" onClick={endTour}>
          Saltar tour ✕
        </button>
      )}

      <div
        className={`tc-card ${cardVisible ? "shown" : "hiding"}`}
        style={{
          ...PLACEMENTS[current.placement],
          "--tc-color": current.color,
          "--tc-color-light": current.colorLight.replace('0.1', '0.6'),
          "--tc-accent": current.colorLight,
        } as React.CSSProperties}
      >
        <div className="tc-accent-bar" style={{ "--tc-color": current.color, "--tc-color-light": current.colorLight.replace('0.1', '0.6') } as React.CSSProperties} />

        <div className="tc-progress-wrap">
          <div className="tc-progress-fill" style={{ width: `${progressPct}%`, background: current.color }} />
        </div>

        {!discoveryMode && (
          <div className="tc-step-count" style={{ color: current.color, background: current.colorLight }}>
            {stepIndex + 1} / {tourSteps.length}
          </div>
        )}

        <div className="tc-header">
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2, paddingRight: discoveryMode ? 0 : 48 }}>
            <div className="tc-badge" style={{ color: current.color, background: current.colorLight, border: `1.5px solid ${current.colorLight.replace('0.1)', '0.3)')}` }}>
              <current.icon size={13} style={{ marginRight: 4 }} />
              <span>{current.label}</span>
            </div>
            <h3 className="tc-title">{current.title}</h3>
          </div>
        </div>

        <div className="tc-body">
          <p className="tc-desc" style={{ marginTop: 0 }}>{current.description}</p>
          {current.tip && (
            <div className="tc-tip">
              <Lightbulb size={12} style={{ marginRight: 6, flexShrink: 0 }} />
              <span className="tc-tip-text">{current.tip}</span>
            </div>
          )}
        </div>

        <div className="tc-footer">
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

          <div className="tc-actions" style={{ width: discoveryMode ? '100%' : 'auto' }}>
            {stepIndex > 0 && !discoveryMode && (
              <button className="tc-btn tc-btn-prev" onClick={goToPrev} disabled={navigating}>
                ← Anterior
              </button>
            )}
            <button
              className="tc-btn"
              onClick={goToNext}
              disabled={navigating}
              style={{
                width: discoveryMode ? '100%' : 'auto',
                background: navigating
                  ? "#94a3b8"
                  : `linear-gradient(135deg, ${current.colorDark} 0%, ${current.color} 100%)`,
                padding: "10px 20px",
                borderRadius: "12px",
                color: "white",
                border: "none",
                fontWeight: "700"
              }}
            >
              {navigating ? (
                <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "tc-spin 0.7s linear infinite", display: "inline-block" }} />
              ) : discoveryMode ? (
                <>¡Entendido!</>
              ) : isLast ? (
                <>¡Empezar!</>
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
