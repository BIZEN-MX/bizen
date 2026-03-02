"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

// ─── Tour Steps ───────────────────────────────────────────────────────────────

export const TOUR_STEPS = [
    {
        path: "/courses",
        label: "Temas y Lecciones",
        title: "Tu camino de aprendizaje",
        description:
            "Aquí encontrarás 30 temas de educación financiera diseñados paso a paso. Cada tema tiene lecciones interactivas, simuladores y quizzes. Avanza a tu ritmo y acumula XP con cada lección completada.",
        color: "#0F62FE",
        accent: "rgba(15,98,254,0.08)",
        step: 1,
        placement: "bottom-left"
    },
    {
        path: "/reto-diario",
        label: "Reto Diario",
        title: "Construye el hábito financiero",
        description:
            "Cada día recibes un reto nuevo de 5 minutos. Al completarlo, publicas tu evidencia en el Foro y acumulas rachas. Así convierte el aprendizaje en un hábito que cambia tu vida.",
        color: "#0F62FE",
        accent: "rgba(15,98,254,0.08)",
        step: 2,
        placement: "bottom-left"
    },
    {
        path: "/forum",
        label: "Foro",
        title: "Aprende con tu comunidad",
        description:
            "Comparte tus evidencias del reto diario, haz preguntas rápidas y presenta proyectos emprendedores. Tu grupo te retroalimenta y tus maestros validan tu aprendizaje en tiempo real.",
        color: "#0F62FE",
        accent: "rgba(15,98,254,0.08)",
        step: 3,
        placement: "bottom-left"
    },
    {
        path: "/impacto-social",
        label: "Impacto Social",
        title: "Tu aprendizaje genera donaciones",
        description:
            "Cada vez que completas lecciones y retos, BIZEN dona a causas sociales en nombre de tu escuela. Revisa aquí cuánto has contribuido, tus logros desbloqueados y el impacto colectivo.",
        color: "#0F62FE",
        accent: "rgba(15,98,254,0.08)",
        step: 4,
        placement: "bottom-left"
    },
    {
        path: "/puntos",
        label: "Mis Puntos",
        title: "Tu progreso financiero",
        description:
            "Monitorea tus XP, rachas y el historial de tus ganancias. Aquí verás cómo cada pequeña acción suma para convertirte en un experto de tus finanzas.",
        color: "#0F62FE",
        accent: "rgba(15,98,254,0.08)",
        step: 5,
        placement: "bottom-right"
    },
    {
        path: "/tienda",
        label: "Bizen Tienda",
        title: "Canjea tus recompensas",
        description:
            "Usa tus monedas Bizens para comprar artículos exclusivos, avatares especiales y beneficios reales. Tu esfuerzo se traduce en premios que puedes disfrutar.",
        color: "#0F62FE",
        accent: "rgba(15,98,254,0.08)",
        step: 6,
        placement: "bottom-right"
    },
    {
        path: "/profile",
        label: "Tu Perfil",
        title: "Tu identidad en BIZEN",
        description:
            "Aquí vives: tus puntos XP, tu nivel, tus rachas y tus seguidores. Personaliza tu avatar y tu bio. Cada logro que desbloquee aparecerá en tu perfil para que el mundo vea tu progreso.",
        color: "#0F62FE",
        accent: "rgba(15,98,254,0.08)",
        step: 7,
        placement: "bottom-right"
    },
]

const PLACEMENTS: Record<string, any> = {
    "center": { bottom: "clamp(16px, 3vw, 32px)", left: "50%", transform: "translateX(-50%)" },
    "bottom-left": { bottom: "clamp(16px, 3vw, 32px)", left: "clamp(16px, 3vw, 40px)", transform: "translateX(0)" },
    "bottom-right": { bottom: "clamp(16px, 3vw, 32px)", left: "auto", right: "clamp(16px, 3vw, 40px)", transform: "translateX(0)" },
}

interface AppTourOverlayProps {
    onEnd: () => void
}

export default function AppTourOverlay({ onEnd }: AppTourOverlayProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [stepIndex, setStepIndex] = useState(0)
    const [navigating, setNavigating] = useState(false)
    const [visible, setVisible] = useState(false)
    const [cardVisible, setCardVisible] = useState(false)

    const current = TOUR_STEPS[stepIndex]

    // Navigate to first tour page on mount
    useEffect(() => {
        setVisible(true)
        // Navigate to the first step if not already there
        if (pathname !== TOUR_STEPS[0].path) {
            router.push(TOUR_STEPS[0].path)
        }
        // Animate card in after short delay
        const t = setTimeout(() => setCardVisible(true), 100)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Highlight sidebar item if it exists
    useEffect(() => {
        if (!visible || !current) return

        // Remove highlight from all
        const allItems = document.querySelectorAll('[data-tour-id]');
        allItems.forEach(el => {
            (el as HTMLElement).style.boxShadow = "";
            (el as HTMLElement).style.transform = "";
            (el as HTMLElement).style.zIndex = "";
        })

        // Highlight current
        const target = document.querySelector(`[data-tour-id="${current.path}"]`) as HTMLElement
        if (target) {
            target.style.boxShadow = `0 0 0 3px ${current.color}60, 0 8px 24px ${current.color}40`;
            target.style.transform = "scale(1.05) translateX(4px)";
            target.style.zIndex = "100002";
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return () => {
            allItems.forEach(el => {
                (el as HTMLElement).style.boxShadow = "";
                (el as HTMLElement).style.transform = "";
                (el as HTMLElement).style.zIndex = "";
            });
        }
    }, [visible, current, pathname])

    // Animate card back in when path matches current step
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
        if (next >= TOUR_STEPS.length) {
            // Tour complete
            setCardVisible(false)
            setTimeout(() => {
                setVisible(false)
                onEnd()
            }, 350)
            return
        }
        setCardVisible(false)
        setNavigating(true)
        setTimeout(() => {
            setStepIndex(next)
            router.push(TOUR_STEPS[next].path)
        }, 300)
    }, [navigating, stepIndex, router, onEnd])


    if (!visible) return null

    const isLast = stepIndex === TOUR_STEPS.length - 1
    const progressPct = ((stepIndex + 1) / TOUR_STEPS.length) * 100

    return (
        <>
            <style>{`
        @keyframes tour-slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tour-slideDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(32px); }
        }
        @keyframes tour-mascotBob {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%     { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes tour-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 14px var(--tour-color-alpha); }
          50%      { transform: scale(1.05); box-shadow: 0 8px 28px var(--tour-color-beta); }
        }
        .tour-card {
          position: fixed;
          z-index: 100001;
          width: calc(100% - 32px);
          max-width: 600px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow:
            0 32px 80px rgba(0,0,0,0.22),
            0 0 0 1px rgba(0,0,0,0.06);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tour-card.enter {
          animation: tour-slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .tour-card.exit {
          animation: tour-slideDown 0.3s ease forwards;
        }
        .tour-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100000;
          pointer-events: auto;
          background: transparent;
        }

        .tour-card-inner {
            padding: clamp(20px, 4vw, 32px) clamp(24px, 5vw, 40px);
        }
        .tour-header-row {
            display: flex;
            align-items: flex-start;
            gap: clamp(14px, 3vw, 20px);
            margin-bottom: clamp(14px, 3vw, 20px);
        }
        .tour-mascot {
            width: clamp(56px, 12vw, 76px);
            height: clamp(56px, 12vw, 76px);
            flex-shrink: 0;
            animation: tour-mascotBob 3s ease infinite;
        }
        .tour-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: clamp(11px, 2.5vw, 13px);
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 999px;
            letter-spacing: 0.04em;
        }
        .tour-title {
            margin: 0;
            font-size: clamp(18px, 4vw, 24px);
            font-weight: 800;
            color: #0f172a;
            line-height: 1.3;
        }
        .tour-desc {
            margin: 0 0 clamp(18px, 4vw, 28px);
            font-size: clamp(15px, 3.5vw, 18px);
            color: #475569;
            line-height: 1.6;
        }
        .tour-bottom-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .tour-actions {
            display: flex;
            gap: clamp(8px, 2vw, 12px);
        }
        .tour-btn {
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: clamp(14px, 3vw, 16px);
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .tour-btn-prev {
            padding: clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px);
            border: 1.5px solid #e5e7eb;
            background: white;
            color: #6b7280;
            font-weight: 600;
        }
        .tour-btn-next {
            padding: clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px);
            border: none;
            color: white;
            animation: tour-breathe 2.5s ease-in-out infinite;
        }

        /* Responsive Mobile Layout */
        @media (max-width: 767px) {
          .tour-card {
            bottom: calc(75px + env(safe-area-inset-bottom));
            width: calc(100% - 24px);
            border-radius: 20px;
          }
          .tour-card-inner {
            padding: 20px 20px;
          }
          .tour-header-row {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
            margin-bottom: 12px;
          }
          .tour-mascot {
            width: 58px;
            height: 58px;
          }
          .tour-badge {
            justify-content: center;
            display: inline-flex;
          }
          .tour-title {
            font-size: 18px;
          }
          .tour-desc {
            text-align: center;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .tour-bottom-row {
            flex-direction: column-reverse; /* Dots below buttons */
            gap: 16px;
          }
          .tour-actions {
            width: 100%;
          }
          .tour-btn {
            flex: 1; /* Stretch buttons equally on mobile */
            padding: 12px 14px;
            font-size: 14px;
          }
        }
      `}</style>

            {/* Blocking backdrop — forces user to interact ONLY with the tour card */}
            <div className="tour-backdrop" />

            <div
                className={`tour-card ${cardVisible ? "enter" : "exit"}`}
                style={{
                    ...PLACEMENTS[(current as any).placement || "center"],
                    "--tour-color-alpha": `${current.color}40`,
                    "--tour-color-beta": `${current.color}70`,
                } as any}
            >
                {/* Color accent stripe */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${current.color}, ${current.color}99)`, width: `${progressPct}%`, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />

                <div className="tour-card-inner">
                    {/* Header row */}
                    <div className="tour-header-row">
                        {/* Mascot */}
                        <div className="tour-mascot">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/hero4.png" alt="Billy" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
                            {/* Step badge */}
                            <div style={{ textAlign: "center" }}>
                                <div className="tour-badge" style={{ color: current.color, background: current.accent, border: `1px solid ${current.color}25` }}>
                                    {current.label} — {stepIndex + 1} / {TOUR_STEPS.length}
                                </div>
                            </div>
                            <h3 className="tour-title">
                                {current.title}
                            </h3>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="tour-desc">
                        {current.description}
                    </p>

                    {/* Step dots + action */}
                    <div className="tour-bottom-row">
                        {/* Dots */}
                        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", width: "100%", flex: 1 }}>
                            {TOUR_STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: 6,
                                        borderRadius: 3,
                                        background: i === stepIndex ? current.color : i < stepIndex ? "#cbd5e1" : "#f1f5f9",
                                        width: i === stepIndex ? 20 : 6,
                                        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="tour-actions">
                            {stepIndex > 0 && (
                                <button
                                    onClick={() => {
                                        setCardVisible(false)
                                        setNavigating(true)
                                        setTimeout(() => {
                                            setStepIndex(stepIndex - 1)
                                            router.push(TOUR_STEPS[stepIndex - 1].path)
                                        }, 280)
                                    }}
                                    className="tour-btn tour-btn-prev"
                                >
                                    Anterior
                                </button>
                            )}
                            <button
                                onClick={goToNext}
                                disabled={navigating}
                                className="tour-btn tour-btn-next"
                                style={{
                                    background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                                    boxShadow: `0 4px 14px ${current.color}40`,
                                    opacity: navigating ? 0.7 : 1,
                                    cursor: navigating ? "not-allowed" : "pointer"
                                }}
                            >
                                {navigating ? "..." : isLast ? "Finalizar tour" : "Siguiente"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
