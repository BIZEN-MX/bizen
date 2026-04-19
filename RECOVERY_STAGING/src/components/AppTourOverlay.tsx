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
      {/* Styles moved to globals.css */}

      <div className={`tc-backdrop${closing ? " hiding" : ""}`} />

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
