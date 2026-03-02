"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSettings, Language, Theme, TextSize, ContrastMode } from "@/contexts/SettingsContext"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import {
  Settings, User, Bell, Shield, Tv, Link, Accessibility,
  Star, Check, X, AlertTriangle, RotateCcw, ChevronRight,
  Volume2, Zap, Globe, Eye, MessageSquare, Award, Lock, LogOut
} from "lucide-react"
import { AvatarDisplay } from "@/components/AvatarDisplay"

export const dynamic = 'force-dynamic'

// ─── Custom Toggle ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} aria-checked={checked} role="switch"
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", width: 52, height: 28,
        borderRadius: 999, border: "none", cursor: "pointer", flexShrink: 0, outline: "none",
        background: checked ? "linear-gradient(135deg, #0F62FE, #4A9EFF)" : "#CBD5E1",
        transition: "all .25s", boxShadow: checked ? "0 4px 12px rgba(15,98,254,.35)" : "none"
      }}>
      <span style={{
        position: "absolute", left: checked ? 26 : 3, width: 22, height: 22,
        borderRadius: "50%", background: "#fff", transition: "left .25s",
        boxShadow: "0 2px 6px rgba(0,0,0,.2)"
      }} />
    </button>
  )
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────
function ToggleRow({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "16px 20px",
      background: "#ffffff",
      borderRadius: 16, border: "1.5px solid #f1f5f9", marginBottom: 10,
      gap: 16, cursor: "pointer", transition: "all .2s",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#f8faff"; e.currentTarget.style.borderColor = "#bfdbfe" }}
      onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "#f1f5f9" }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{label}</div>
        {desc && <div style={{ fontSize: 13, color: "#64748B", marginTop: 3, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: "linear-gradient(135deg, #0f172a 0%, #0F62FE 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {icon}
      </div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>
        {children}
      </h2>
    </div>
  )
}

// ─── Pill select ──────────────────────────────────────────────────────────────
function PillSelect({ options, value, onChange }: {
  options: { v: string; l: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(({ v, l }) => (
        <button key={v} onClick={() => onChange(v)} style={{
          padding: "10px 20px", borderRadius: 999,
          border: `2px solid ${value === v ? "#0F62FE" : "#E2E8F0"}`,
          background: value === v ? "linear-gradient(135deg, #0F62FE, #4A9EFF)" : "#fff",
          color: value === v ? "#fff" : "#64748B",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Inter','Montserrat',sans-serif", transition: "all .2s",
          boxShadow: value === v ? "0 4px 12px rgba(15,98,254,0.3)" : "none"
        }}>
          {l}
        </button>
      ))}
    </div>
  )
}

// ─── Field label ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em",
      textTransform: "uppercase", marginBottom: 10
    }}>{children}</div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
function SettingsContent() {
  const router = useRouter()
  const { user, dbProfile, refreshUser } = useAuth()
  const { settings, updateSettings, resetSettings } = useSettings()
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientMicrocred> | null>(null)
  const [activeSection, setActiveSection] = useState("general")
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showPwFields, setShowPwFields] = useState(false)
  const [pw, setPw] = useState({ new: "", confirm: "" })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState<any>({ type: "character", id: "robot", character: "robot", label: "Robot" })
  const [birthDate, setBirthDate] = useState("")
  const [schoolId, setSchoolId] = useState("")
  const [schools, setSchools] = useState<{ id: string, name: string }[]>([])
  const [phone, setPhone] = useState("")
  const [plan, setPlan] = useState<"gratuito" | "estudiante" | "premium">("gratuito")

  useEffect(() => { setSupabase(createClientMicrocred()) }, [])
  useEffect(() => {
    if (user) {
      setPhone(user.user_metadata?.phone || "");
      setPlan(user.user_metadata?.plan || "gratuito");
      setFullName(user.user_metadata?.full_name || "");
      setUsername(user.user_metadata?.username || "");
      setBio(user.user_metadata?.bio || "");
      setBirthDate(user.user_metadata?.birth_date || "");
      setSchoolId(user.user_metadata?.school_id || "");
      setAvatar(user.user_metadata?.avatar || { type: "character", id: "robot", character: "robot", label: "Robot" });
    }
  }, [user])

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools')
        if (response.ok) {
          const data = await response.json()
          setSchools(data)
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      }
    }
    fetchSchools()
  }, [])
  useEffect(() => { if (typeof window !== "undefined" && !user) router.push("/login") }, [user, router])
  if (!user) return null

  const isAdmin = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const flash = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 3500) }

  const doSave = async (fn: () => Promise<void>) => {
    if (!supabase) return; setSaving(true)
    try { await fn(); flash(true, "Guardado correctamente") }
    catch (e: any) { flash(false, e?.message || "Error al guardar") }
    finally { setSaving(false) }
  }

  const savePw = () => doSave(async () => {
    if (!pw.new || pw.new.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres")
    if (pw.new !== pw.confirm) throw new Error("Las contraseñas no coinciden")
    const { error } = await supabase!.auth.updateUser({ password: pw.new })
    if (error) throw error
    setPw({ new: "", confirm: "" }); setShowPwFields(false)
  })
  const saveProfile = () => doSave(async () => {
    const { error } = await supabase!.auth.updateUser({
      data: {
        full_name: fullName,
        username: username,
        bio: bio,
        birth_date: birthDate,
        school_id: schoolId,
        avatar: avatar
      }
    })
    if (error) throw error

    // Sync with public.profiles table
    await fetch('/api/profiles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        schoolId,
        avatar
      })
    })

    if (refreshUser) refreshUser()
  })
  const savePhone = () => doSave(async () => {
    const { error } = await supabase!.auth.updateUser({ data: { phone } })
    if (error) throw error
  })
  const savePlan = (p: "gratuito" | "estudiante" | "premium") => doSave(async () => {
    const { error } = await supabase!.auth.updateUser({ data: { plan: p } })
    if (error) throw error; setPlan(p)
  })

  const nav = [
    { id: "general", label: "General", icon: <Settings size={16} color="white" /> },
    { id: "profile", label: "Perfil", icon: <User size={16} color="white" /> },
    { id: "account", label: "Cuenta y Seguridad", icon: <Shield size={16} color="white" /> },
    ...(!isAdmin ? [
      { id: "notifications", label: "Notificaciones", icon: <Bell size={16} color="white" /> },
      { id: "privacy", label: "Privacidad", icon: <Shield size={16} color="white" /> },
      { id: "content", label: "Contenido", icon: <Tv size={16} color="white" /> },
    ] : []),
    { id: "accessibility", label: "Accesibilidad", icon: <Eye size={16} color="white" /> },
  ]

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", fontSize: 15, fontWeight: 600,
    border: "2px solid #E2E8F0", borderRadius: 12, background: "#ffffff",
    color: "#0F172A", fontFamily: "'Inter','Montserrat',sans-serif",
    outline: "none", boxSizing: "border-box", transition: "all .2s"
  }
  const btnPrimary: React.CSSProperties = {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #0F62FE, #4A9EFF)",
    border: "none", borderRadius: 12,
    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Inter','Montserrat',sans-serif", transition: "all .2s",
    opacity: saving ? .6 : 1, boxShadow: "0 4px 14px rgba(15,98,254,.35)"
  }
  const btnGhost: React.CSSProperties = {
    padding: "12px 24px", background: "#F8FAFF", border: "1.5px solid #E2E8F0",
    borderRadius: 12, color: "#374151", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Inter','Montserrat',sans-serif"
  }



  return (
    <div className="cfg-root-container" style={{
      width: "100%", background: "#FBFAF5", minHeight: "100vh",
      fontFamily: "'Inter','Montserrat',sans-serif", boxSizing: "border-box",
      overflowX: "hidden"
    }}>
      <style>{`
        @media (max-width: 767px) {
          .cfg-inner {
            width: 100% !important;
            margin-left: 0 !important;
            padding-bottom: 80px !important;
          }
          .cfg-body {
            grid-template-columns: 1fr !important;
            padding: 0 16px 40px !important;
          }
          .cfg-sidebar {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 24px;
            width: 100% !important;
          }
          .cfg-page-header {
            padding: 40px 16px 60px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .cfg-inner {
            margin-left: 220px !important;
          }
        }
        @media (min-width: 1161px) {
          .cfg-inner {
            margin-left: 280px !important;
          }
        }
      `}</style>

      <div className="cfg-inner" style={{ position: "relative", width: "auto" }}>

        {/* ── Decorative orbs */}
        <div style={{ position: "fixed", top: "5%", right: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(15,98,254,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

        {/* ── Page header */}
        <div className="cfg-page-header" style={{
          background: "linear-gradient(135deg, #0f172a 0%, #0F62FE 100%)",
          padding: "clamp(28px, 5vw, 44px) clamp(20px, 4vw, 40px) clamp(52px, 7vw, 68px)",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          margin: 0
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 20, right: 140, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: "30%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{
              margin: "0 0 8px",
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.05
            }}>Configuración</h1>
            <p style={{ margin: "0 0 20px", fontSize: 15, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>
              Personaliza tu experiencia en BIZEN
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,.12)", backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,.2)", borderRadius: 40, padding: "8px 16px"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#60A5FA,#A78BFA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0
              }}>
                {(user.email || "?")[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{user.email}</span>
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,.85)", background: "rgba(255,255,255,.18)",
                padding: "3px 10px", borderRadius: 20, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em"
              }}>
                {dbProfile?.role || "Estudiante"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Two-column layout */}
        <div className="cfg-body" style={{
          display: "grid", gridTemplateColumns: "240px 1fr",
          gap: 24, padding: "0 28px 80px", marginTop: -28, position: "relative", zIndex: 2
        }}>

          {/* Sidebar nav */}
          <div className="cfg-sidebar" style={{
            background: "#ffffff", borderRadius: 20, padding: "16px 12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1.5px solid #f1f5f9",
            height: "fit-content", position: "sticky", top: 16, alignSelf: "start"
          }}>
            <div style={{
              fontSize: 10, fontWeight: 900, color: "#94A3B8", letterSpacing: "0.12em",
              padding: "0 8px 12px", borderBottom: "1.5px solid #f1f5f9",
              marginBottom: 10, textTransform: "uppercase"
            }}>Menú</div>
            {nav.map(s => {
              const isActive = activeSection === s.id
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                  width: "100%", padding: "11px 14px", textAlign: "left", display: "flex",
                  alignItems: "center", gap: 12, borderRadius: 12, border: "none",
                  fontFamily: "'Inter','Montserrat',sans-serif",
                  background: isActive ? "linear-gradient(135deg, #eff6ff, #dbeafe)" : "transparent",
                  color: isActive ? "#0F62FE" : "#4B5563",
                  fontSize: 14, fontWeight: isActive ? 700 : 600,
                  cursor: "pointer", transition: "all .2s", marginBottom: 4,
                  boxShadow: isActive ? "0 2px 8px rgba(15,98,254,0.15)" : "none"
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8faff" }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: isActive ? "linear-gradient(135deg, #0F62FE, #4A9EFF)" : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    transition: "all .2s"
                  }}>
                    <div style={{ color: isActive ? "white" : "#64748b" }}>{s.icon}</div>
                  </div>
                  {s.label}
                  {isActive && <ChevronRight size={14} color="#0F62FE" style={{ marginLeft: "auto" }} />}
                </button>
              )
            })}

            <div style={{ borderTop: "1.5px solid #f1f5f9", marginTop: 12, paddingTop: 12 }}>
              <button onClick={() => setShowResetConfirm(true)} style={{
                width: "100%", padding: "10px 14px",
                background: "#fff5f5", border: "1.5px solid #fecaca",
                borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 700,
                color: "#EF4444", fontFamily: "'Inter','Montserrat',sans-serif",
                display: "flex", alignItems: "center", gap: 10, transition: "all .2s"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff5f5"}>
                <RotateCcw size={14} /> Restaurar defaults
              </button>
            </div>
          </div>

          {/* Content panel */}
          <div className="cfg-content-panel" style={{
            background: "#ffffff", borderRadius: 20, padding: "32px 36px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1.5px solid #f1f5f9",
            minWidth: 0
          }}>

            {/* Toast */}
            {toast && (
              <div style={{
                marginBottom: 20, padding: "14px 20px", borderRadius: 14,
                display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700,
                background: toast.ok ? "#f0fdf4" : "#fef2f2",
                border: `1.5px solid ${toast.ok ? "#86efac" : "#fecaca"}`,
                color: toast.ok ? "#15803D" : "#DC2626",
                animation: "fadeUp 0.3s ease both"
              }}>
                {toast.ok ? <Check size={18} color="#15803D" /> : <X size={18} color="#DC2626" />} {toast.msg}
              </div>
            )}

            {/* ── GENERAL */}
            {activeSection === "general" && (<div>
              <SectionHeading icon={<Settings size={20} color="white" />}>General</SectionHeading>
              <div style={{ marginBottom: 28 }}>
                <FieldLabel>Idioma / Language</FieldLabel>
                <PillSelect
                  options={[{ v: "es", l: "Español" }, { v: "en", l: "English" }]}
                  value={settings.language} onChange={v => updateSettings({ language: v as Language })} />
              </div>

              <div style={{
                background: "#f8faff", borderRadius: 16, padding: "20px 24px", marginBottom: 16,
                border: "1.5px solid #e0eaff"
              }}>
                <FieldLabel>Preferencias del sistema</FieldLabel>
                <ToggleRow label="Efectos de Sonido" desc="Activar efectos de sonido en la app"
                  checked={settings.soundsEnabled} onChange={v => updateSettings({ soundsEnabled: v })} />
                <ToggleRow label="Animaciones" desc="Mostrar animaciones y transiciones suaves"
                  checked={settings.animationsEnabled} onChange={v => updateSettings({ animationsEnabled: v })} />
              </div>
            </div>)}

            {/* ── PROFILE */}
            {activeSection === "profile" && user && (<div>
              <SectionHeading icon={<User size={20} color="white" />}>Mi Perfil</SectionHeading>


              <div style={{ marginBottom: 24 }}>
                <FieldLabel>Nombre completo</FieldLabel>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Tu nombre real" style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,98,254,0.1)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <FieldLabel>Nombre de usuario / @username</FieldLabel>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="usuario123" style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,98,254,0.1)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <FieldLabel>Intereses Financieros / Bio</FieldLabel>
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="¿Qué te apasiona de las finanzas?" style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,98,254,0.1)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div>
                  <FieldLabel>Fecha de Nacimiento</FieldLabel>
                  <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                    style={inputStyle}
                    max={new Date().toISOString().split('T')[0]}
                    onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,98,254,0.1)" }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }} />
                </div>
                <div>
                  <FieldLabel>Mi Escuela</FieldLabel>
                  <select value={schoolId} onChange={e => setSchoolId(e.target.value)} style={inputStyle}>
                    <option value="">Selecciona tu escuela</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={saveProfile} disabled={saving} style={{ ...btnPrimary, width: "100%", marginTop: 10 }}>
                {saving ? "Guardando..." : "Actualizar datos del perfil"}
              </button>

              <div style={{ marginTop: 32, padding: "20px", background: "#f8faff", borderRadius: 16, border: "1.5px solid #e0eaff" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Vista previa del perfil</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#0F62FE,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(15,98,254,0.2)" }}>
                    <AvatarDisplay avatar={avatar || { type: "character", id: "robot", character: "robot" }} size={42} />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#0F172A" }}>{fullName || "Sin nombre"}</div>
                    <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>{username ? `@${username.replace('@', '')}` : user.email}</div>
                  </div>
                </div>
              </div>
            </div>)}

            {/* ── ACCOUNT */}
            {activeSection === "account" && user && (<div>
              <SectionHeading icon={<Shield size={20} color="white" />}>Cuenta y Seguridad</SectionHeading>

              {/* Email */}
              <div style={{
                background: "#f8faff", borderRadius: 16, padding: "18px 22px",
                border: "1.5px solid #e0eaff", marginBottom: 16, display: "flex",
                alignItems: "center", gap: 14
              }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Correo electrónico</FieldLabel>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{user.email}</div>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 800, color: "#15803D", background: "#f0fdf4",
                  border: "1.5px solid #86efac", padding: "5px 12px", borderRadius: 20,
                  display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0
                }}><Check size={13} /> Verificado</span>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 16 }}>
                <FieldLabel>Teléfono</FieldLabel>
                <div style={{ display: "flex", gap: 10 }}>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+52 123 456 7890" style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,98,254,0.1)" }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }} />
                  <button onClick={savePhone} disabled={saving} style={btnPrimary}>
                    {saving ? "..." : "Guardar"}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div style={{
                background: "#f8faff", borderRadius: 16, padding: "20px 22px",
                border: "1.5px solid #e0eaff", marginBottom: 20
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: showPwFields ? 16 : 0
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                      <Lock size={16} color="#64748b" /> Contraseña
                    </div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Seguridad de tu cuenta</div>
                  </div>
                  <button onClick={() => { setShowPwFields(!showPwFields); setPw({ new: "", confirm: "" }) }}
                    style={btnGhost}>{showPwFields ? "Cancelar" : "Cambiar"}</button>
                </div>
                {showPwFields && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input type="password" value={pw.new} onChange={e => setPw({ ...pw, new: e.target.value })}
                      placeholder="Nueva contraseña (mín. 6 caracteres)" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,98,254,0.1)" }}
                      onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }} />
                    <input type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })}
                      placeholder="Confirmar nueva contraseña" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,98,254,0.1)" }}
                      onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none" }} />
                    <button onClick={savePw} disabled={saving}
                      style={{ ...btnPrimary, width: "100%", textAlign: "center" as const }}>
                      {saving ? "Guardando..." : "Actualizar Contraseña"}
                    </button>
                  </div>
                )}
              </div>

              {/* Plans */}
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Plan de Suscripción</FieldLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {([
                    { id: "gratuito", l: "Plan Gratuito", d: "Acceso a todos los cursos básicos", c: "#10B981", grad: "linear-gradient(135deg,#10b981,#34d399)" },
                    { id: "estudiante", l: "Plan Estudiante", d: "Herramientas adicionales para estudiantes", c: "#0F62FE", grad: "linear-gradient(135deg,#0F62FE,#4A9EFF)" },
                    { id: "premium", l: "Plan Premium ⭐", d: "Acceso completo + certificados + soporte prioritario", c: "#F59E0B", grad: "linear-gradient(135deg,#F59E0B,#FCD34D)" },
                  ] as { id: "gratuito" | "estudiante" | "premium", l: string, d: string, c: string, grad: string }[]).map(({ id, l, d, c, grad }) => (
                    <div key={id} onClick={() => savePlan(id)} style={{
                      padding: "16px 20px", borderRadius: 16, cursor: "pointer", transition: "all .2s",
                      border: `2px solid ${plan === id ? c : "#f1f5f9"}`,
                      background: plan === id ? `${c}10` : "#f8faff",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      boxShadow: plan === id ? `0 4px 16px ${c}25` : "none"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Award size={18} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: plan === id ? c : "#0F172A" }}>{l}</div>
                          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{d}</div>
                        </div>
                      </div>
                      {plan === id && <span style={{
                        fontSize: 11, fontWeight: 800, color: c,
                        background: `${c}18`, padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${c}40`
                      }}>ACTIVO</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Account meta */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { l: "Cuenta creada", v: new Date(user.created_at || Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { l: "Método de acceso", v: "Email y Contraseña" },
                ].map(({ l, v }) => (
                  <div key={l} style={{
                    background: "#f8faff", borderRadius: 14, padding: "16px 18px",
                    border: "1.5px solid #e0eaff"
                  }}>
                    <FieldLabel>{l}</FieldLabel>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Logout */}
              <div style={{
                background: "#fff5f5", borderRadius: 16, padding: "20px 24px",
                border: "1.5px solid #fecaca"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <LogOut size={16} color="#ef4444" />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Cerrar Sesión</div>
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>
                  Cierra tu sesión de forma segura en este dispositivo.
                </div>
                <button disabled={saving} onClick={async () => {
                  if (!supabase) return; setSaving(true)
                  try { await supabase.auth.signOut(); router.push("/login") }
                  catch (e) { flash(false, "Error al cerrar sesión") } finally { setSaving(false) }
                }} style={{
                  padding: "12px 28px", background: "#EF4444", border: "none", borderRadius: 12,
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Inter','Montserrat',sans-serif", opacity: saving ? .6 : 1,
                  boxShadow: "0 4px 12px rgba(239,68,68,0.35)"
                }}>
                  {saving ? "Saliendo..." : "Cerrar Sesión"}
                </button>
              </div>
            </div>)}

            {/* ── NOTIFICATIONS */}
            {activeSection === "notifications" && (<div>
              <SectionHeading icon={<Bell size={20} color="white" />}>Notificaciones</SectionHeading>
              <div style={{ background: "#f8faff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #e0eaff" }}>
                {[
                  { k: "push", l: "Notificaciones Push", d: "Recibir notificaciones en tu dispositivo" },
                  { k: "email", l: "Correo Electrónico", d: "Recibir notificaciones por email" },
                  { k: "sound", l: "Sonido", d: "Reproducir sonido al recibir notificaciones" },
                  { k: "courseUpdates", l: "Actualizaciones de Cursos", d: "Nuevo contenido en tus cursos" },
                  { k: "achievements", l: "Logros", d: "Cuando obtienes un nuevo logro" },
                  { k: "reminders", l: "Recordatorios", d: "Recordatorios de estudio programados" },
                ].map(({ k, l, d }) => (
                  <ToggleRow key={k} label={l} desc={d}
                    checked={settings.notifications[k as keyof typeof settings.notifications] as boolean}
                    onChange={v => updateSettings({ notifications: { ...settings.notifications, [k]: v } })} />
                ))}
              </div>
            </div>)}

            {/* ── PRIVACY */}
            {activeSection === "privacy" && (<div>
              <SectionHeading icon={<Shield size={20} color="white" />}>Privacidad</SectionHeading>
              {[
                { k: "profileVisibility", l: "Visibilidad del Perfil" },
                { k: "activityVisibility", l: "Visibilidad de Actividad" },
              ].map(({ k, l }) => (
                <div key={k} style={{ marginBottom: 20 }}>
                  <FieldLabel>{l}</FieldLabel>
                  <select value={(settings.privacy as any)[k]}
                    onChange={e => updateSettings({ privacy: { ...settings.privacy, [k]: e.target.value as any } })}
                    style={{ ...inputStyle, maxWidth: 300, cursor: "pointer" }}>
                    <option value="public">Público</option>
                    <option value="friends">Solo amigos</option>
                    <option value="private">Privado</option>
                  </select>
                </div>
              ))}
              <div style={{ background: "#f8faff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #e0eaff" }}>
                <ToggleRow label="Mostrar Progreso" desc="Permitir que otros vean tu progreso"
                  checked={settings.privacy.showProgress}
                  onChange={v => updateSettings({ privacy: { ...settings.privacy, showProgress: v } })} />
                <ToggleRow label="Permitir Mensajes" desc="Recibir mensajes directos de otros usuarios"
                  checked={settings.privacy.allowMessages}
                  onChange={v => updateSettings({ privacy: { ...settings.privacy, allowMessages: v } })} />
              </div>
            </div>)}

            {/* ── CONTENT */}
            {activeSection === "content" && (<div>
              <SectionHeading icon={<Tv size={20} color="white" />}>Contenido</SectionHeading>
              <div style={{ background: "#f8faff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #e0eaff" }}>
                <ToggleRow label="Subtítulos" desc="Activar subtítulos en videos"
                  checked={settings.contentPreferences.showSubtitles}
                  onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showSubtitles: v } })} />
                <ToggleRow label="Reproducción Automática" desc="Reproducir videos automáticamente"
                  checked={settings.contentPreferences.autoplayVideos}
                  onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, autoplayVideos: v } })} />
                <ToggleRow label="Mostrar Pistas" desc="Ver pistas durante los ejercicios"
                  checked={settings.contentPreferences.showHints}
                  onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showHints: v } })} />
              </div>
            </div>)}


            {/* ── ACCESSIBILITY */}
            {activeSection === "accessibility" && (<div>
              <SectionHeading icon={<Eye size={20} color="white" />}>Accesibilidad</SectionHeading>
              <div style={{ marginBottom: 24 }}>
                <FieldLabel>Tamaño de Texto</FieldLabel>
                <PillSelect
                  options={[{ v: "small", l: "Pequeño" }, { v: "medium", l: "Mediano" }, { v: "large", l: "Grande" }, { v: "extra-large", l: "XL" }]}
                  value={settings.accessibility.textSize}
                  onChange={v => updateSettings({ accessibility: { ...settings.accessibility, textSize: v as TextSize } })} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <FieldLabel>Modo de Contraste</FieldLabel>
                <PillSelect
                  options={[{ v: "normal", l: "Normal" }, { v: "high", l: "Alto Contraste" }]}
                  value={settings.accessibility.contrastMode}
                  onChange={v => updateSettings({ accessibility: { ...settings.accessibility, contrastMode: v as ContrastMode } })} />
              </div>
              <div style={{ background: "#f8faff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #e0eaff" }}>
                <ToggleRow label="Reducir Movimiento" desc="Minimizar animaciones y efectos de movimiento"
                  checked={settings.accessibility.reducedMotion}
                  onChange={v => updateSettings({ accessibility: { ...settings.accessibility, reducedMotion: v } })} />
                <ToggleRow label="Optimizar para Lector de Pantalla"
                  desc="Mejorar experiencia con lectores de pantalla"
                  checked={settings.accessibility.screenReaderOptimized}
                  onChange={v => updateSettings({ accessibility: { ...settings.accessibility, screenReaderOptimized: v } })} />
                <ToggleRow label="Navegación por Teclado"
                  desc="Mejorar la navegación con teclado"
                  checked={settings.accessibility.keyboardNavigation}
                  onChange={v => updateSettings({ accessibility: { ...settings.accessibility, keyboardNavigation: v } })} />
              </div>
            </div>)}

          </div>{/* /content panel */}
        </div>{/* /cfg-body */}

        {/* ── Reset Modal */}
        {showResetConfirm && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,.6)",
            backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 9999, padding: 24
          }}>
            <div style={{
              background: "#ffffff", borderRadius: 24, padding: 40, maxWidth: 420,
              width: "100%", boxShadow: "0 32px 80px rgba(0,0,0,.25)",
              animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both"
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 68, height: 68, borderRadius: '50%', background: '#FEF2F2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: "0 8px 24px rgba(239,68,68,0.2)"
                }}>
                  <AlertTriangle size={32} color="#EF4444" />
                </div>
              </div>
              <h3 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0F172A", textAlign: "center" }}>
                ¿Restaurar configuración?
              </h3>
              <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748B", lineHeight: 1.65, textAlign: "center" }}>
                Esto restablecerá todas tus preferencias a los valores predeterminados.
                Esta acción no se puede deshacer.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowResetConfirm(false)}
                  style={{ ...btnGhost, flex: 1, padding: "14px", textAlign: "center" as const }}>
                  Cancelar
                </button>
                <button onClick={() => { resetSettings(); setShowResetConfirm(false); flash(true, "Configuración restaurada") }}
                  style={{
                    flex: 1, padding: "14px", background: "#EF4444", border: "none",
                    borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Inter','Montserrat',sans-serif",
                    boxShadow: "0 4px 14px rgba(239,68,68,0.35)"
                  }}>
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }

        @media (max-width: 767px) {
          .cfg-root-container { padding-left: 0 !important; }
          .cfg-page-header {
            padding: 24px 16px 52px !important;
            border-radius: 0 0 24px 24px !important;
          }
          .cfg-body {
            grid-template-columns: 1fr !important;
            padding: 0 12px 100px !important;
            margin-top: -20px !important;
            gap: 14px !important;
          }
          .cfg-body > div:first-child { position: relative !important; top: auto !important; }
          .cfg-content-panel { padding: 20px 16px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .cfg-body { padding: 0 20px 60px !important; }
        }
        @media (min-width: 1161px) {
          .cfg-body { padding: 0 32px 80px !important; }
        }
        select { -webkit-appearance: none; appearance: none; }
      `}</style>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 700, color: "#0F62FE",
        background: "#FBFAF5"
      }}>
        Cargando configuración...
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
