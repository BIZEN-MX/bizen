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
    },
    {
        path: "/reto-diario",
        label: "Reto Diario",
        title: "Construye el hábito financiero",
        description:
            "Cada día recibes un reto nuevo de 5 minutos. Al completarlo, publicas tu evidencia en el Foro y acumulas rachas. Así conviertes el aprendizaje en un hábito que cambia tu vida.",
        color: "#10b981",
        accent: "rgba(16,185,129,0.08)",
        step: 2,
    },
    {
        path: "/forum",
        label: "Foro",
        title: "Aprende con tu comunidad",
        description:
            "Comparte tus evidencias del reto diario, haz preguntas rápidas y presenta proyectos emprendedores. Tu grupo te retroalimenta y tus maestros validan tu aprendizaje en tiempo real.",
        color: "#8b5cf6",
        accent: "rgba(139,92,246,0.08)",
        step: 3,
    },
    {
        path: "/impacto-social",
        label: "Impacto Social",
        title: "Tu aprendizaje genera donaciones",
        description:
            "Cada vez que completas lecciones y retos, BIZEN dona a causas sociales en nombre de tu escuela. Revisa aquí cuánto has contribuido, tus logros desbloqueados y el impacto colectivo.",
        color: "#f59e0b",
        accent: "rgba(245,158,11,0.08)",
        step: 4,
    },
    {
        path: "/profile",
        label: "Tu Perfil",
        title: "Tu identidad en BIZEN",
        description:
            "Aquí vives: tus puntos XP, tu nivel, tus rachas y tus seguidores. Personaliza tu avatar y tu bio. Cada logro que desbloquees aparecerá en tu perfil para que el mundo vea tu progreso.",
        color: "#ef4444",
        accent: "rgba(239,68,68,0.08)",
        step: 5,
    },
]

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
        .tour-card {
          position: fixed;
          bottom: clamp(16px, 3vw, 32px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 100001;
          width: calc(100% - 32px);
          max-width: 640px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow:
            0 32px 80px rgba(0,0,0,0.22),
            0 0 0 1px rgba(0,0,0,0.06);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
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
        /* On mobile, account for bottom nav */
        @media (max-width: 767px) {
          .tour-card {
            bottom: calc(75px + env(safe-area-inset-bottom));
          }
        }
      `}</style>

            {/* Blocking backdrop — forces user to interact ONLY with the tour card */}
            <div className="tour-backdrop" />

            <div className={`tour-card ${cardVisible ? "enter" : "exit"}`}>
                {/* Color accent stripe */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${current.color}, ${current.color}99)`, width: `${progressPct}%`, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />

                <div style={{ padding: "clamp(20px, 4vw, 32px) clamp(24px, 5vw, 40px)" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(14px, 3vw, 20px)", marginBottom: "clamp(14px, 3vw, 20px)" }}>
                        {/* Mascot */}
                        <div style={{ width: "clamp(56px, 12vw, 76px)", height: "clamp(56px, 12vw, 76px)", flexShrink: 0, animation: "tour-mascotBob 3s ease infinite" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/hero4.png" alt="Billy" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Step badge */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 700, color: current.color, background: current.accent, padding: "4px 12px", borderRadius: 999, border: `1px solid ${current.color}25`, letterSpacing: "0.04em" }}>
                                    {current.label} — {stepIndex + 1} / {TOUR_STEPS.length}
                                </span>
                            </div>
                            <h3 style={{ margin: 0, fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>
                                {current.title}
                            </h3>
                        </div>
                    </div>

                    {/* Description */}
                    <p style={{ margin: "0 0 clamp(18px, 4vw, 28px)", fontSize: "clamp(15px, 3.5vw, 18px)", color: "#475569", lineHeight: 1.7 }}>
                        {current.description}
                    </p>

                    {/* Step dots + action */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Dots */}
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
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
                        <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)" }}>
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
                                    style={{ padding: "clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "white", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 600, color: "#6b7280", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
                                >
                                    Anterior
                                </button>
                            )}
                            <button
                                onClick={goToNext}
                                disabled={navigating}
                                style={{
                                    padding: "clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)",
                                    borderRadius: 12,
                                    border: "none",
                                    background: isLast ? "#0f172a" : `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                                    color: "white",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    fontWeight: 700,
                                    cursor: navigating ? "not-allowed" : "pointer",
                                    fontFamily: "'Inter', sans-serif",
                                    boxShadow: `0 4px 14px ${current.color}40`,
                                    transition: "all 0.2s",
                                    opacity: navigating ? 0.7 : 1,
                                    whiteSpace: "nowrap",
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
