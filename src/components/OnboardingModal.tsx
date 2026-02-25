"use client"

import { useState, useEffect, useCallback } from "react"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import { useAuth } from "@/contexts/AuthContext"

// ─── Avatar Options ───────────────────────────────────────────────────────────

const AVATAR_OPTIONS = [
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
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "welcome" | "avatar" | "username" | "school" | "birthday"

interface OnboardingModalProps {
    /** Called when the user finishes profile setup — should then start the app tour */
    onComplete: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const { user, refreshUser } = useAuth()
    const supabase = createClientMicrocred()

    const [step, setStep] = useState<Step>("welcome")
    const [selectedAvatar, setSelectedAvatar] = useState<any>({ type: "mascot", id: "fox", label: "Zorro" })
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [selectedSchool, setSelectedSchool] = useState("")
    const [schools, setSchools] = useState<{ id: string, name: string }[]>([])
    const [usernameError, setUsernameError] = useState("")
    const [saving, setSaving] = useState(false)
    const [exiting, setExiting] = useState(false)

    // Fetch schools for the school selection step
    useEffect(() => {
        fetch("/api/schools")
            .then(res => res.json())
            .then(data => setSchools(data || []))
            .catch(err => console.error("Error loading schools in onboarding:", err))
    }, [])

    // Pre-fill username from full name
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

    const goToStep = useCallback((next: Step) => {
        setStep(next)
    }, [])

    const validateUsername = (val: string): string => {
        if (val.length < 3) return "Minimo 3 caracteres"
        if (val.length > 30) return "Maximo 30 caracteres"
        if (!/^[a-zA-Z0-9_.-]+$/.test(val)) return "Solo letras, numeros, _ . -"
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
                const data = await res.json()
                setUsernameError(data.error || "Error al guardar")
                setSaving(false)
                return
            }

            await supabase.auth.refreshSession()
            await refreshUser()

            // Animate out then hand over to tour
            setExiting(true)
            setTimeout(onComplete, 350)
        } catch {
            setUsernameError("Error de conexion. Intenta de nuevo.")
        } finally {
            setSaving(false)
        }
    }

    const profileName = user?.user_metadata?.full_name?.split(" ")[0] || "nuevo estudiante"
    const progressPct = step === "welcome" ? 0 : step === "avatar" ? 25 : step === "username" ? 50 : step === "school" ? 75 : 100

    // Helper: calculate age from date string
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
        @keyframes ob-fadeIn   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ob-slideUp  { from { opacity: 0; transform: translateY(40px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes ob-slideOut { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(-24px) scale(0.96) } }
        @keyframes ob-float    { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes ob-spin     { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

        .ob-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(2, 14, 39, 0.85);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(12px, 4vw, 32px);
          animation: ob-fadeIn 0.4s ease both;
          font-family: 'Inter', sans-serif;
        }
        .ob-card {
          background: #ffffff;
          border-radius: 28px;
          width: 100%; max-width: 560px;
          max-height: 94vh;
          overflow-y: auto;
          box-shadow: 0 40px 100px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08);
          animation: ob-slideUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .ob-card.exit { animation: ob-slideOut 0.35s ease forwards; }

        .ob-progress-bar {
          height: 3px; background: #f1f5f9; border-radius: 3px; overflow: hidden;
        }
        .ob-progress-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, #0F62FE, #3B82F6);
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ob-avatar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 480px) {
          .ob-avatar-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
        }
        .ob-avatar-btn {
          width: 72px; height: 72px;
          border-radius: 50%; cursor: pointer;
          border: 3px solid transparent;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          background: rgba(15,98,254,0.06);
        }
        .ob-avatar-btn:hover { transform: scale(1.15); }
        .ob-avatar-btn.selected {
          border-color: #0F62FE;
          box-shadow: 0 0 0 4px rgba(15,98,254,0.16);
          transform: scale(1.08);
        }
        .ob-input {
          width: 100%; padding: 13px 16px;
          border: 2px solid #e5e7eb; border-radius: 14px;
          font-size: 15px; font-family: 'Inter', sans-serif;
          color: #111827; outline: none;
          transition: all 0.2s; box-sizing: border-box;
          background: #f9fafb;
        }
        .ob-input:focus { border-color: #0F62FE; background: #fff; box-shadow: 0 0 0 4px rgba(15,98,254,0.1); }
        .ob-input.error { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.1); }
        .ob-btn-primary {
          width: 100%; padding: 14px 24px;
          background: linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%);
          color: white; border: none; border-radius: 14px;
          font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(15,98,254,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ob-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(15,98,254,0.4); }
        .ob-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .ob-btn-ghost {
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 13px; font-family: 'Inter', sans-serif;
          padding: 6px; transition: color 0.2s;
        }
        .ob-btn-ghost:hover { color: #64748b; }
      `}</style>

            <div className="ob-overlay">
                <div className={`ob-card${exiting ? " exit" : ""}`}>

                    {/* ─── PROGRESS STRIP (top of card) ──────────────────────────────── */}
                    <div className="ob-progress-bar">
                        <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    {/* ─── WELCOME ───────────────────────────────────────────────────── */}
                    {step === "welcome" && (
                        <div style={{ padding: "clamp(32px, 6vw, 48px)", textAlign: "center" }}>
                            {/* Mascot */}
                            <div style={{ width: 110, height: 110, margin: "0 auto 24px", animation: "ob-float 3s ease infinite" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/hero4.png" alt="Mascota BIZEN" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>

                            <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                                Bienvenido a BIZEN
                            </h1>
                            <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 8px", lineHeight: 1.7 }}>
                                Hola, <strong style={{ color: "#0f172a" }}>{profileName}</strong>. Antes de empezar vamos a configurar tu perfil. Solo toma un minuto.
                            </p>
                            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 36px" }}>
                                Cuando termines te daremos un recorrido por la plataforma.
                            </p>

                            <button className="ob-btn-primary" onClick={() => goToStep("avatar")}>
                                Comenzar configuracion
                            </button>
                        </div>
                    )}

                    {/* ─── AVATAR ────────────────────────────────────────────────────── */}
                    {step === "avatar" && (
                        <div style={{ padding: "clamp(24px, 5vw, 40px)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep("welcome")}>Atras</button>
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Paso 1 de 2</span>
                            </div>

                            {/* Avatar preview */}
                            <div style={{ textAlign: "center", marginBottom: 24 }}>
                                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #0F62FE, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,98,254,0.2)", transition: "all 0.3s" }}>
                                    <AvatarDisplay avatar={selectedAvatar} size={52} />
                                </div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Elige tu avatar</h2>
                                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Aparecera en el foro y en tu perfil</p>
                            </div>

                            <div className="ob-avatar-grid" style={{ marginBottom: 28 }}>
                                {AVATAR_OPTIONS.map((av, idx) => {
                                    const isSelected = JSON.stringify(selectedAvatar) === JSON.stringify(av)
                                    return (
                                        <div
                                            key={(av as any).id || (av as any).value || idx}
                                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
                                        >
                                            <button
                                                className={`ob-avatar-btn${isSelected ? " selected" : ""}`}
                                                onClick={() => setSelectedAvatar(av)}
                                            >
                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <AvatarDisplay avatar={av} size={48} />
                                                </div>
                                            </button>
                                            {(av as any).label && (
                                                <span style={{
                                                    fontSize: 10,
                                                    fontWeight: isSelected ? 700 : 500,
                                                    color: isSelected ? "#0F62FE" : "#64748b",
                                                    textAlign: "center",
                                                    lineHeight: 1.2,
                                                    transition: "color 0.2s"
                                                }}>
                                                    {(av as any).label}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <button className="ob-btn-primary" onClick={() => goToStep("username")}>
                                Continuar
                            </button>
                        </div>
                    )}

                    {/* ─── USERNAME + BIO ─────────────────────────────────────────────── */}
                    {step === "username" && (
                        <div style={{ padding: "clamp(24px, 5vw, 40px)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep("avatar")}>Atras</button>
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Paso 2 de 3</span>
                            </div>

                            {/* Mini avatar preview */}
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #0F62FE, #10b981)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AvatarDisplay avatar={selectedAvatar} size={36} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 3px" }}>Elige tu nombre</h2>
                                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Con este alias te veran en el foro</p>
                                </div>
                            </div>

                            {/* Username */}
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
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
                                    <p style={{ fontSize: 12, color: "#ef4444", margin: "5px 0 0" }}>{usernameError}</p>
                                ) : username.length >= 3 ? (
                                    <p style={{ fontSize: 12, color: "#10b981", margin: "5px 0 0" }}>Disponible</p>
                                ) : (
                                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "5px 0 0" }}>Letras, numeros, guiones y puntos. 3-30 caracteres.</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                                    Intereses financieros{" "}
                                    <span style={{ fontWeight: 500, color: "#9ca3af", textTransform: "none" as const, letterSpacing: 0 }}>(opcional)</span>
                                </label>
                                <textarea
                                    className="ob-input"
                                    style={{ resize: "vertical" as const, minHeight: 76, lineHeight: 1.6 }}
                                    placeholder="Ej: Quiero aprender a invertir y ahorrar para la universidad..."
                                    value={bio}
                                    maxLength={200}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                />
                                <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0", textAlign: "right" as const }}>{bio.length}/200</p>
                            </div>

                            <button
                                className="ob-btn-primary"
                                disabled={!!usernameError || username.length < 3}
                                onClick={() => goToStep("school")}
                            >
                                Continuar
                            </button>
                        </div>
                    )}

                    {/* ─── SCHOOL SELECTION ─────────────────────────────────────────── */}
                    {step === "school" && (
                        <div style={{ padding: "clamp(24px, 5vw, 40px)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep("username")}>Atras</button>
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Paso 3 de 4</span>
                            </div>

                            <div style={{ textAlign: "center", marginBottom: 28 }}>
                                <div style={{ fontSize: 52, marginBottom: 12 }}>🏫</div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>¿Cuál es tu escuela?</h2>
                                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Para mostrarte el progreso de tus compañeros.</p>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
                                    Selecciona tu institución *
                                </label>
                                <select
                                    className="ob-input"
                                    value={selectedSchool}
                                    onChange={e => setSelectedSchool(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona tu escuela...</option>
                                    {schools.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="ob-btn-primary"
                                disabled={!selectedSchool}
                                onClick={() => goToStep("birthday")}
                            >
                                Continuar
                            </button>
                        </div>
                    )}

                    {/* ─── BIRTHDAY ───────────────────────────────────────────────── */}
                    {step === "birthday" && (
                        <div style={{ padding: "clamp(24px, 5vw, 40px)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <button className="ob-btn-ghost" onClick={() => goToStep("school")}>Atras</button>
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Paso 4 de 4</span>
                            </div>

                            {/* Birthday illustration */}
                            <div style={{ textAlign: "center", marginBottom: 28 }}>
                                <div style={{ fontSize: 52, marginBottom: 12 }}>🎂</div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>¿Cuándo es tu cumpleaños?</h2>
                                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Nos ayuda a personalizar tu experiencia. Es opcional.</p>
                            </div>

                            {/* Date picker */}
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
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
                                            marginTop: 12, padding: "12px 16px",
                                            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                                            border: "1.5px solid #bfdbfe",
                                            borderRadius: 12, display: "flex", alignItems: "center", gap: 10
                                        }}>
                                            <span style={{ fontSize: 22 }}>🎉</span>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 800, color: "#1e40af" }}>Tienes {age} años</div>
                                                <div style={{ fontSize: 11, color: "#3b82f6" }}>Bienvenido a BIZEN</div>
                                            </div>
                                        </div>
                                    ) : null
                                })()}
                            </div>

                            <button
                                className="ob-btn-primary"
                                disabled={saving}
                                onClick={handleSaveAndStartTour}
                            >
                                {saving ? (
                                    <>
                                        <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "ob-spin 0.8s linear infinite", display: "inline-block" }} />
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar y ver el tour de la app"
                                )}
                            </button>
                            {!birthDate && (
                                <button
                                    className="ob-btn-ghost"
                                    style={{ width: "100%", marginTop: 12, fontSize: 13, color: "#94a3b8" }}
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
