"use client"

import { useState, useEffect, useCallback } from "react"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { SchoolIcon, CakeIcon, PartyIcon, RocketIcon } from "@/components/CustomIcons"

// ─── Avatar Options ───────────────────────────────────────────────────────────

const AVATAR_OPTIONS = [
    { type: "character", id: "robot", character: "robot", label: "Robot" },
    { type: "character", id: "astronaut", character: "astronaut", label: "Astronauta" },
    { type: "mascot", id: "fox", label: "Zorro" },
    { type: "mascot", id: "owl", label: "Búho" },
    { type: "mascot", id: "dolphin", label: "Delfín" },
    { type: "mascot", id: "turtle", label: "Tortuga" },
    { type: "mascot", id: "beaver", label: "Castor" },
    { type: "mascot", id: "squirrel", label: "Ardilla" },
    { type: "mascot", id: "dog", label: "Perro" },
    { type: "mascot", id: "cat", label: "Gato" },
    { type: "mascot", id: "lion", label: "León" },
    { type: "mascot", id: "koala", label: "Koala" },
    { type: "mascot", id: "penguin", label: "Pingüino" },
    { type: "gradient", id: "grad1", gradient: "linear-gradient(135deg, #0F62FE, #6366f1)", label: "Azure" },
    { type: "pattern", id: "patt1", pattern: "dots", color: "#0F62FE", label: "Puntos" },
    { type: "pattern", id: "patt2", pattern: "waves", color: "#0F62FE", label: "Ondas" },
    { type: "shape", id: "shape1", shape: "star", color: "#0F62FE", label: "Estrella" },
    { type: "abstract", id: "abst1", abstract: "circles", colors: ["#0F62FE", "#6366f1", "#93c5fd"], label: "Abstract" }
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "welcome" | "avatar" | "username" | "school" | "birthday"

interface OnboardingModalProps {
    onComplete: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const { user, refreshUser } = useAuth()
    const supabase = createClient()

    const [step, setStep] = useState<Step>("welcome")
    const [selectedAvatar, setSelectedAvatar] = useState<any>({ type: "character", id: "robot", character: "robot", label: "Robot" })
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [selectedSchool, setSelectedSchool] = useState("")
    const [schools, setSchools] = useState<{ id: string, name: string }[]>([])
    const [usernameError, setUsernameError] = useState("")
    const [saving, setSaving] = useState(false)
    const [exiting, setExiting] = useState(false)

    useEffect(() => {
        fetch("/api/schools")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSchools(data)
                else { console.error("Received non-array schools data:", data); setSchools([]) }
            })
            .catch(err => console.error("Error loading schools in onboarding:", err))
    }, [])

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            const suggested = user.user_metadata.full_name
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_.-]/g, "")
                .slice(0, 20)
            setUsername(suggested)
        }
    }, [user])

    const goToStep = useCallback((next: Step) => { setStep(next) }, [])

    const validateUsername = (val: string): string => {
        if (val.length < 3) return "Mínimo 3 caracteres"
        if (val.length > 30) return "Máximo 30 caracteres"
        if (!/^[a-zA-Z0-9_.-]+$/.test(val)) return "Solo letras, números, _ . -"
        return ""
    }

    const handleUsernameChange = (val: string) => {
        setUsername(val)
        setUsernameError(validateUsername(val))
    }

    const handleSaveAndStartTour = async () => {
        const err = validateUsername(username)
        if (err) { setUsernameError(err); return }

        setSaving(true)
        try {
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, bio, avatar: selectedAvatar, birthDate: birthDate || null, schoolId: selectedSchool }),
            })

            if (!res.ok) {
                let errorMsg = "Error al guardar"
                try {
                    const data = await res.json()
                    errorMsg = data.error || errorMsg
                } catch { /* Fallback for non-json error responses */ }
                setUsernameError(errorMsg)
                setSaving(false)
                return
            }

            await supabase.auth.refreshSession()
            await refreshUser()
            setExiting(true)
            setTimeout(onComplete, 350)
        } catch {
            setUsernameError("Error de conexión. Intenta de nuevo.")
        } finally {
            setSaving(false)
        }
    }

    const profileName = user?.user_metadata?.full_name?.split(" ")[0] || "nuevo estudiante"
    const emailForRole = user?.email?.toLowerCase() || ''
    const isInstitutional = emailForRole.endsWith('.edu') || emailForRole.includes('.edu.')
    const stepList = isInstitutional
        ? ["welcome", "avatar", "username", "school", "birthday"]
        : ["welcome", "avatar", "username", "birthday"]
    const totalSteps = stepList.length - 1

    const getProgressPct = () => {
        if (step === "welcome") return 0
        if (step === "avatar") return isInstitutional ? 25 : 33
        if (step === "username") return isInstitutional ? 50 : 66
        if (step === "school") return 75
        return 100
    }
    const progressPct = getProgressPct()

    const calcAge = (dateStr: string): number | null => {
        if (!dateStr) return null
        const bd = new Date(dateStr)
        const today = new Date()
        let age = today.getFullYear() - bd.getFullYear()
        const m = today.getMonth() - bd.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
        return age
    }

    return (
        <>
            <style>{`
        @keyframes ob-fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ob-slideUp   { from { opacity: 0; transform: translateY(48px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes ob-slideOut  { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(-24px) scale(0.95) } }
        @keyframes ob-float     { 0%,100% { transform: translateY(0) rotate(-2deg) } 50% { transform: translateY(-12px) rotate(2deg) } }
        @keyframes ob-spin      { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes ob-pop       { 0% { transform: scale(0.7); opacity: 0 } 70% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes ob-breathe   {
          0%, 100% { box-shadow: 0 6px 24px rgba(15,98,254,0.35); transform: translateY(0); }
          50%       { box-shadow: 0 12px 36px rgba(15,98,254,0.55); transform: translateY(-2px); }
        }
        @keyframes ob-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ob-pulse-ring {
          0%   { transform: scale(0.94); opacity: 0.4 }
          100% { transform: scale(1.4); opacity: 0 }
        }

        /* ── Overlay ── */
        .ob-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(2, 10, 30, 0.90);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(8px, 3vw, 24px);
          animation: ob-fadeIn 0.35s ease both;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── Card ── */
        .ob-card {
          background: #ffffff;
          border-radius: clamp(20px, 4vw, 32px);
          width: 100%;
          max-width: clamp(320px, 90vw, 540px);
          max-height: 96dvh;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow:
            0 0 0 1px rgba(15,98,254,0.08),
            0 24px 64px rgba(2,10,30,0.45),
            0 4px 16px rgba(0,0,0,0.12);
          animation: ob-slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .ob-card.exit { animation: ob-slideOut 0.35s ease forwards; }

        /* ── Scrollbar ── */
        .ob-card::-webkit-scrollbar { width: 4px; }
        .ob-card::-webkit-scrollbar-track { background: transparent; }
        .ob-card::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        /* ── Progress ── */
        .ob-progress-track {
          height: 5px; background: #f1f5f9; border-radius: 5px; overflow: hidden;
        }
        .ob-progress-fill {
          height: 100%; border-radius: 5px;
          background: linear-gradient(90deg, #0F62FE 0%, #818cf8 60%, #0F62FE 100%);
          background-size: 200% auto;
          animation: ob-shimmer 2.8s linear infinite;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ── Avatar grid ── */
        .ob-avatar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(8px, 2vw, 14px);
        }
        @media (max-width: 400px) {
          .ob-avatar-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
        }
        .ob-avatar-btn {
          aspect-ratio: 1;
          width: 100%;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid transparent;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          transition: all 0.24s cubic-bezier(0.34,1.56,0.64,1);
          background: rgba(15,98,254,0.05);
          position: relative;
        }
        .ob-avatar-btn:hover { transform: scale(1.15); border-color: rgba(15,98,254,0.25); background: rgba(15,98,254,0.09); }
        .ob-avatar-btn.selected {
          border-color: #0F62FE;
          box-shadow: 0 0 0 5px rgba(15,98,254,0.15);
          transform: scale(1.12);
          background: rgba(15,98,254,0.08);
        }

        /* ── Inputs ── */
        .ob-input {
          width: 100%; padding: clamp(11px, 2.5vw, 14px) clamp(12px, 3vw, 16px);
          border: 2px solid #e5e7eb; border-radius: 14px;
          font-size: clamp(14px, 3.5vw, 15px); font-family: 'Inter', sans-serif;
          color: #111827; outline: none;
          transition: all 0.2s; box-sizing: border-box;
          background: #f9fafb;
        }
        .ob-input:focus { border-color: #0F62FE; background: #fff; box-shadow: 0 0 0 4px rgba(15,98,254,0.1); }
        .ob-input.error { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.08); }

        /* ── Primary button ── */
        .ob-btn-primary {
          width: 100%; padding: clamp(13px, 3vw, 16px) 24px;
          background: linear-gradient(135deg, #0F62FE 0%, #4F8EFF 100%);
          color: white; border: none; border-radius: 14px;
          font-size: clamp(14px, 3.5vw, 15px); font-weight: 800; font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.02em;
          animation: ob-breathe 2.4s ease-in-out infinite;
          transition: opacity 0.2s, filter 0.2s;
        }
        .ob-btn-primary:hover:not(:disabled) { filter: brightness(1.08); animation-play-state: paused; }
        .ob-btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .ob-btn-primary:disabled { opacity: 0.48; cursor: not-allowed; animation: none; }

        /* ── Ghost button ── */
        .ob-btn-ghost {
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: clamp(12px, 3vw, 13px); font-family: 'Inter', sans-serif;
          padding: 6px; transition: color 0.2s;
        }
        .ob-btn-ghost:hover { color: #64748b; }

        /* ── Step dots ── */
        .ob-step-dots {
          display: flex; gap: 5px; justify-content: center; margin-top: clamp(16px, 4vw, 24px);
        }
        .ob-step-dot {
          height: 6px; border-radius: 99px;
          transition: all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: #e2e8f0;
        }
        .ob-step-dot.active { background: #0F62FE; width: 24px !important; }
        .ob-step-dot.done { background: rgba(15,98,254,0.3); }

        /* ── Welcome mascot pulse ring ── */
        .ob-mascot-ring {
          position: absolute; inset: -16px; border-radius: 50%;
          border: 2px solid rgba(15,98,254,0.3);
          animation: ob-pulse-ring 2s ease-out infinite;
          pointer-events: none;
        }

        /* ── Section header inside steps ── */
        .ob-section-icon {
          width: clamp(64px, 16vw, 80px);
          height: clamp(64px, 16vw, 80px);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto clamp(10px, 3vw, 16px);
        }

        /* ── Inner padding ── */
        .ob-pad { padding: clamp(20px, 5vw, 40px); }
        .ob-pad-welcome { padding: clamp(28px, 6vw, 48px) clamp(20px, 5vw, 40px); text-align: center; }

        /* ── Mobile specific ── */
        @media (max-width: 480px) {
          .ob-card { border-radius: 22px; }
          .ob-avatar-btn { border-width: 2.5px; }
        }
      `}</style>

            <div className="ob-overlay">
                <div className={`ob-card${exiting ? " exit" : ""}`}>

                    {/* ─── PROGRESS STRIP ──────────────────────────────────────────────── */}
                    <div className="ob-progress-track">
                        <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    {/* ─── WELCOME ─────────────────────────────────────────────────────── */}
                    {step === "welcome" && (
                        <div className="ob-pad-welcome">
                            {/* Billy mascot with pulse ring */}
                            <div style={{ position: "relative", width: "clamp(100px,22vw,130px)", height: "clamp(100px,22vw,130px)", margin: "0 auto clamp(20px,5vw,32px)" }}>
                                <div className="ob-mascot-ring" />
                                <div style={{
                                    position: "absolute", inset: -8, borderRadius: "50%",
                                    background: "radial-gradient(circle, rgba(15,98,254,0.15) 0%, transparent 70%)",
                                }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/hero4.png"
                                    alt="Billy, mascota BIZEN"
                                    style={{ width: "100%", height: "100%", objectFit: "contain", animation: "ob-float 3.2s ease infinite", position: "relative", zIndex: 1, filter: "drop-shadow(0 8px 16px rgba(15,98,254,0.25))" }}
                                />
                            </div>

                            {/* Badge */}
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, rgba(15,98,254,0.1), rgba(99,102,241,0.1))", border: "1px solid rgba(15,98,254,0.2)", borderRadius: 99, padding: "5px 16px", marginBottom: "clamp(12px,3vw,18px)" }}>
                                <span style={{ fontSize: "clamp(10px,2.5vw,11px)", fontWeight: 800, color: "#0F62FE", letterSpacing: "0.06em", textTransform: "uppercase" }}>Bienvenido a BIZEN</span>
                            </div>

                            <h1 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, color: "#0f172a", margin: "0 0 clamp(8px,2vw,12px)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                                Hola, <span style={{ color: "#0F62FE" }}>{profileName}</span>
                            </h1>
                            <p style={{ fontSize: "clamp(13px,3.5vw,15px)", color: "#64748b", margin: "0 0 6px", lineHeight: 1.75 }}>
                                Antes de explorar la plataforma, vamos a configurar tu perfil. Solo toma un minuto.
                            </p>
                            <p style={{ fontSize: "clamp(11px,3vw,13px)", color: "#94a3b8", margin: "0 0 clamp(24px,5vw,36px)" }}>
                                Al terminar, <strong style={{ color: "#0F62FE" }}>Billy</strong> te dará un recorrido completo por la app.
                            </p>

                            <button className="ob-btn-primary" onClick={() => goToStep("avatar")}>
                                Comenzar configuración →
                            </button>

                            <div className="ob-step-dots">
                                {stepList.map((s, i) => (
                                    <div key={s} className={`ob-step-dot${s === step ? " active" : i < stepList.indexOf(step) ? " done" : ""}`} style={{ width: s === step ? 24 : 8 }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─── AVATAR ──────────────────────────────────────────────────────── */}
                    {step === "avatar" && (
                        <div className="ob-pad">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(14px,3vw,22px)" }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep("welcome")}>← Atrás</button>
                                <span style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#94a3b8", fontWeight: 700 }}>Paso 1 de {totalSteps}</span>
                            </div>

                            <div style={{ textAlign: "center", marginBottom: "clamp(16px,4vw,24px)" }}>
                                {/* Selected avatar preview */}
                                <div style={{
                                    width: "clamp(60px,15vw,80px)", height: "clamp(60px,15vw,80px)",
                                    borderRadius: "50%", background: "linear-gradient(135deg, #0F62FE, #10b981)",
                                    margin: "0 auto clamp(10px,3vw,16px)", overflow: "hidden",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 8px 24px rgba(15,98,254,0.3)",
                                    animation: "ob-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)"
                                }}>
                                    <AvatarDisplay avatar={selectedAvatar} size={50} />
                                </div>
                                <h2 style={{ fontSize: "clamp(17px,4.5vw,22px)", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Elige tu avatar</h2>
                                <p style={{ fontSize: "clamp(12px,3vw,13px)", color: "#64748b", margin: 0 }}>Será tu cara en el foro y tu perfil</p>
                            </div>

                            <div className="ob-avatar-grid" style={{ marginBottom: "clamp(20px,5vw,28px)" }}>
                                {AVATAR_OPTIONS.map((av, idx) => {
                                    const isSelected = JSON.stringify(selectedAvatar) === JSON.stringify(av)
                                    return (
                                        <div key={(av as any).id || idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                                            <button
                                                className={`ob-avatar-btn${isSelected ? " selected" : ""}`}
                                                onClick={() => setSelectedAvatar(av)}
                                            >
                                                <div style={{ width: "60%", height: "60%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <AvatarDisplay avatar={av} size={36} />
                                                </div>
                                            </button>
                                            {(av as any).label && (
                                                <span style={{
                                                    fontSize: "clamp(8px,2vw,10px)",
                                                    fontWeight: isSelected ? 800 : 500,
                                                    color: isSelected ? "#0F62FE" : "#94a3b8",
                                                    textAlign: "center", lineHeight: 1.2, transition: "color 0.2s"
                                                }}>
                                                    {(av as any).label}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <button className="ob-btn-primary" onClick={() => goToStep("username")}>
                                Continuar →
                            </button>
                        </div>
                    )}

                    {/* ─── USERNAME + BIO ───────────────────────────────────────────────── */}
                    {step === "username" && (
                        <div className="ob-pad">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(14px,3vw,22px)" }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep("avatar")}>← Atrás</button>
                                <span style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#94a3b8", fontWeight: 700 }}>Paso 2 de {totalSteps}</span>
                            </div>

                            {/* Mini avatar + heading */}
                            <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,3vw,16px)", marginBottom: "clamp(16px,4vw,24px)" }}>
                                <div style={{ width: "clamp(44px,12vw,56px)", height: "clamp(44px,12vw,56px)", borderRadius: "50%", background: "linear-gradient(135deg, #0F62FE, #10b981)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(15,98,254,0.25)" }}>
                                    <AvatarDisplay avatar={selectedAvatar} size={34} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 800, color: "#0f172a", margin: "0 0 3px" }}>Elige tu nombre</h2>
                                    <p style={{ fontSize: "clamp(11px,3vw,13px)", color: "#64748b", margin: 0 }}>Con este alias te verán en el foro</p>
                                </div>
                            </div>

                            {/* Username */}
                            <div style={{ marginBottom: "clamp(14px,3vw,18px)" }}>
                                <label style={{ display: "block", fontSize: "clamp(10px,2.5vw,11px)", fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                                    Nombre de usuario *
                                </label>
                                <div style={{ position: "relative" }}>
                                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 15, pointerEvents: "none" as const }}>@</span>
                                    <input
                                        className={`ob-input${usernameError ? " error" : ""}`}
                                        style={{ paddingLeft: 28 }}
                                        placeholder="tu_nombre_aqui"
                                        value={username}
                                        maxLength={30}
                                        onChange={(e) => handleUsernameChange(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {usernameError ? (
                                    <p style={{ fontSize: "clamp(11px,3vw,12px)", color: "#ef4444", margin: "5px 0 0" }}>{usernameError}</p>
                                ) : username.length >= 3 ? (
                                    <p style={{ fontSize: "clamp(11px,3vw,12px)", color: "#10b981", margin: "5px 0 0" }}>✓ Disponible</p>
                                ) : (
                                    <p style={{ fontSize: "clamp(11px,3vw,12px)", color: "#9ca3af", margin: "5px 0 0" }}>Letras, números, guiones y puntos. 3-30 caracteres.</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div style={{ marginBottom: "clamp(20px,5vw,28px)" }}>
                                <label style={{ display: "block", fontSize: "clamp(10px,2.5vw,11px)", fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                                    Intereses financieros{" "}
                                    <span style={{ fontWeight: 500, color: "#9ca3af", textTransform: "none" as const, letterSpacing: 0 }}>(opcional)</span>
                                </label>
                                <textarea
                                    className="ob-input"
                                    style={{ resize: "vertical" as const, minHeight: "clamp(60px,18vw,76px)", lineHeight: 1.6 }}
                                    placeholder="Ej: Quiero aprender a invertir y ahorrar para la universidad..."
                                    value={bio}
                                    maxLength={200}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                />
                                <p style={{ fontSize: "clamp(10px,2.5vw,11px)", color: "#9ca3af", margin: "3px 0 0", textAlign: "right" as const }}>{bio.length}/200</p>
                            </div>

                            <button
                                className="ob-btn-primary"
                                disabled={!!usernameError || username.length < 3}
                                onClick={() => goToStep(isInstitutional ? "school" : "birthday")}
                            >
                                Continuar →
                            </button>
                        </div>
                    )}

                    {/* ─── SCHOOL SELECTION ─────────────────────────────────────────────── */}
                    {step === "school" && (
                        <div className="ob-pad">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(14px,3vw,22px)" }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep("username")}>← Atrás</button>
                                <span style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#94a3b8", fontWeight: 700 }}>Paso 3 de 4</span>
                            </div>

                            <div style={{ textAlign: "center", marginBottom: "clamp(18px,5vw,28px)" }}>
                                <div className="ob-section-icon" style={{ background: "#EFF6FF", color: "#0B71FE" }}>
                                    <SchoolIcon size={36} />
                                </div>
                                <h2 style={{ fontSize: "clamp(17px,4.5vw,21px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>¿Cuál es tu escuela?</h2>
                                <p style={{ fontSize: "clamp(12px,3vw,13px)", color: "#64748b", margin: 0 }}>Para mostrarte el progreso de tus compañeros.</p>
                            </div>

                            <div style={{ marginBottom: "clamp(20px,5vw,28px)" }}>
                                <label style={{ display: "block", fontSize: "clamp(10px,2.5vw,11px)", fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                                    Selecciona tu institución *
                                </label>
                                <select
                                    className="ob-input"
                                    value={selectedSchool}
                                    onChange={e => setSelectedSchool(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona tu escuela...</option>
                                    {Array.isArray(schools) && schools.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="ob-btn-primary"
                                disabled={!selectedSchool}
                                onClick={() => goToStep("birthday")}
                            >
                                Continuar →
                            </button>
                        </div>
                    )}

                    {/* ─── BIRTHDAY ─────────────────────────────────────────────────────── */}
                    {step === "birthday" && (
                        <div className="ob-pad">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(14px,3vw,22px)" }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep(isInstitutional ? "school" : "username")}>← Atrás</button>
                                <span style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#94a3b8", fontWeight: 700 }}>Paso {isInstitutional ? 4 : 3} de {totalSteps}</span>
                            </div>

                            <div style={{ textAlign: "center", marginBottom: "clamp(18px,5vw,28px)" }}>
                                <div className="ob-section-icon" style={{ background: "#FFF1F2", color: "#F43F5E" }}>
                                    <CakeIcon size={36} />
                                </div>
                                <h2 style={{ fontSize: "clamp(17px,4.5vw,21px)", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>¿Cuándo es tu cumpleaños?</h2>
                                <p style={{ fontSize: "clamp(12px,3vw,13px)", color: "#64748b", margin: 0 }}>Nos ayuda a personalizar tu experiencia. Es opcional.</p>
                            </div>

                            <div style={{ marginBottom: "clamp(16px,4vw,24px)" }}>
                                <label style={{ display: "block", fontSize: "clamp(10px,2.5vw,11px)", fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                                    Fecha de nacimiento{" "}
                                    <span style={{ fontWeight: 500, color: "#9ca3af", textTransform: "none" as const, letterSpacing: 0 }}>(opcional)</span>
                                </label>
                                <input
                                    type="date"
                                    className="ob-input"
                                    value={birthDate}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={e => setBirthDate(e.target.value)}
                                    style={{ colorScheme: "light" }}
                                />
                                {birthDate && (() => {
                                    const age = calcAge(birthDate)
                                    return age !== null && age >= 0 && age <= 120 ? (
                                        <div style={{
                                            marginTop: 10, padding: "10px 14px",
                                            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                                            border: "1.5px solid #bfdbfe",
                                            borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
                                            animation: "ob-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)"
                                        }}>
                                            <PartyIcon size={20} color="#1e40af" />
                                            <div>
                                                <div style={{ fontSize: "clamp(12px,3vw,13px)", fontWeight: 800, color: "#1e40af" }}>¡Tienes {age} años!</div>
                                                <div style={{ fontSize: "clamp(10px,2.5vw,11px)", color: "#3b82f6" }}>Bienvenido a BIZEN</div>
                                            </div>
                                        </div>
                                    ) : null
                                })()}
                            </div>

                            <button
                                className="ob-btn-primary"
                                disabled={saving}
                                onClick={handleSaveAndStartTour}
                                style={{ marginBottom: 12 }}
                            >
                                {saving ? (
                                    <>
                                        <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "ob-spin 0.8s linear infinite", display: "inline-block", flexShrink: 0 }} />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        ¡Guardar y ver el tour!
                                        <RocketIcon size={18} color="white" />
                                    </>
                                )}
                            </button>
                            {!birthDate && (
                                <button
                                    className="ob-btn-ghost"
                                    style={{ width: "100%", fontSize: "clamp(12px,3vw,13px)", color: "#94a3b8" }}
                                    onClick={handleSaveAndStartTour}
                                    disabled={saving}
                                >
                                    Saltar este paso
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}
