"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSettings, Language, Theme, TextSize, ContrastMode } from "@/contexts/SettingsContext"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import {
  Settings, User, Bell, Shield, Tv,
  Check, X, AlertTriangle, RotateCcw, ChevronRight,
  Eye, Award, Lock, LogOut, Save, Globe, Volume2,
  Zap, Moon, Sun, Contrast, Keyboard, FileText,
  Phone, Calendar, School
} from "lucide-react"
import { AvatarDisplay } from "@/components/AvatarDisplay"

export const dynamic = 'force-dynamic'

// ─── DESIGN TOKENS (matching platform) ────────────────────────────────────────
const T = {
  bg: "#FBFAF5",
  surface: "#ffffff",
  surfaceAlt: "#F8FAFC",
  border: "#E8EDF2",
  borderStrong: "#CBD5E1",
  blue: "#0F62FE",
  blueLight: "#EFF6FF",
  blueMid: "#BFDBFE",
  text: "#0F172A",
  textMid: "#334155",
  textMuted: "#64748B",
  textLight: "#94A3B8",
  green: "#10B981",
  greenLight: "#F0FDF4",
  red: "#EF4444",
  redLight: "#FEF2F2",
  amber: "#F59E0B",
  amberLight: "#FFFBEB",
  font: "'Montserrat', 'Inter', sans-serif",
  radius: 16,
  radiusSm: 10,
  radiusLg: 20,
  shadow: "0 2px 12px rgba(15,23,42,0.06)",
  shadowMd: "0 4px 20px rgba(15,23,42,0.08)",
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} aria-checked={checked} role="switch"
      style={{
        position: "relative", display: "inline-flex", alignItems: "center",
        width: 48, height: 26, borderRadius: 999, border: "none",
        cursor: "pointer", flexShrink: 0, outline: "none",
        background: checked ? T.blue : T.borderStrong,
        transition: "background .2s", boxShadow: checked ? `0 2px 8px rgba(15,98,254,.3)` : "none"
      }}>
      <span style={{
        position: "absolute", left: checked ? 24 : 3, width: 20, height: 20,
        borderRadius: "50%", background: "#fff", transition: "left .2s",
        boxShadow: "0 1px 4px rgba(0,0,0,.15)"
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
      justifyContent: "space-between", padding: "14px 18px",
      background: T.surface, borderRadius: T.radiusSm,
      border: `1.5px solid ${checked ? T.blueMid : T.border}`,
      marginBottom: 8, gap: 16, cursor: "pointer", transition: "all .18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.blueMid; e.currentTarget.style.background = T.blueLight }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = checked ? T.blueMid : T.border; e.currentTarget.style.background = T.surface }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.text, fontFamily: T.font }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ icon, children, subtitle }: { icon: React.ReactNode; children: React.ReactNode; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: T.radiusSm,
          background: `linear-gradient(135deg, #0f172a 0%, ${T.blue} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 4px 12px rgba(15,98,254,.25)"
        }}>
          {icon}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: T.text, fontFamily: T.font, letterSpacing: "-0.02em" }}>
            {children}
          </h2>
          {subtitle && <p style={{ margin: 0, fontSize: 13, color: T.textMuted, marginTop: 1 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ height: 1, background: T.border, marginTop: 20 }} />
    </div>
  )
}

// ─── Pill Select ──────────────────────────────────────────────────────────────
function PillSelect({ options, value, onChange }: {
  options: { v: string; l: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(({ v, l }) => (
        <button key={v} onClick={() => onChange(v)} style={{
          padding: "9px 18px", borderRadius: 999,
          border: `1.5px solid ${value === v ? T.blue : T.border}`,
          background: value === v ? T.blue : T.surface,
          color: value === v ? "#fff" : T.textMid,
          fontSize: 13, fontWeight: 500, cursor: "pointer",
          fontFamily: T.font, transition: "all .18s",
          boxShadow: value === v ? "0 3px 10px rgba(15,98,254,.25)" : "none"
        }}>
          {l}
        </button>
      ))}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: T.surface, borderRadius: T.radius,
      border: `1.5px solid ${T.border}`,
      padding: "20px 22px",
      boxShadow: T.shadow,
      ...style
    }}>
      {children}
    </div>
  )
}

// ─── Field label ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, color: T.textLight, letterSpacing: "0.1em",
      textTransform: "uppercase", marginBottom: 8, fontFamily: T.font
    }}>{children}</div>
  )
}

// ─── Save Button ─────────────────────────────────────────────────────────────
function SaveBtn({ onClick, loading, label = "Guardar cambios" }: { onClick: () => void; loading?: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "12px 24px", background: T.blue, border: "none",
      borderRadius: T.radiusSm, color: "#fff", fontSize: 14, fontWeight: 500,
      cursor: "pointer", fontFamily: T.font, transition: "all .18s",
      opacity: loading ? .6 : 1, boxShadow: "0 4px 14px rgba(15,98,254,.3)",
      width: "100%", marginTop: 20
    }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,98,254,.4)" } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,98,254,.3)" }}>
      <Save size={15} />
      {loading ? "Guardando..." : label}
    </button>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────
function Input({ value, onChange, placeholder, type = "text", disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean
}) {
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", fontSize: 14, fontWeight: 500,
    border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm,
    background: disabled ? T.surfaceAlt : T.surface,
    color: disabled ? T.textMuted : T.text,
    fontFamily: T.font, outline: "none",
    boxSizing: "border-box", transition: "all .18s"
  }
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled} style={inputStyle}
      onFocus={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(15,98,254,.1)` }}
      onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none" }} />
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
    if (user && dbProfile) {
      setPhone(dbProfile.phone || user.user_metadata?.phone || "")
      setPlan(dbProfile.subscriptionStatus === 'premium' ? "premium" : (dbProfile.role === 'institucional' ? "estudiante" : "gratuito"))
      setFullName(dbProfile.fullName || user.user_metadata?.full_name || "")
      setUsername(dbProfile.username || user.user_metadata?.username || "")
      setBio(dbProfile.bio || user.user_metadata?.bio || "")
      if (dbProfile.birthDate) {
        setBirthDate(new Date(dbProfile.birthDate).toISOString().split('T')[0])
      } else {
        setBirthDate(user.user_metadata?.birth_date || "")
      }
      setSchoolId(dbProfile.schoolId || user.user_metadata?.school_id || "")
      setAvatar(dbProfile.avatar || user.user_metadata?.avatar || { type: "character", id: "robot", character: "robot", label: "Robot" })
      if (dbProfile.settings && Object.keys(dbProfile.settings).length > 0) {
        updateSettings(dbProfile.settings)
      }
    }
  }, [user, dbProfile])

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools')
        if (response.ok) setSchools(await response.json())
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

  const syncToDB = async (payload: any) => {
    const res = await fetch('/api/profiles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Error al sincronizar") }
    if (refreshUser) await refreshUser()
  }

  const savePw = () => doSave(async () => {
    if (!pw.new || pw.new.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres")
    if (pw.new !== pw.confirm) throw new Error("Las contraseñas no coinciden")
    const { error } = await supabase!.auth.updateUser({ password: pw.new })
    if (error) throw error
    setPw({ new: "", confirm: "" }); setShowPwFields(false)
  })

  const saveProfile = () => doSave(async () => {
    await supabase!.auth.updateUser({ data: { full_name: fullName, username, bio, birth_date: birthDate, school_id: schoolId, avatar } })
    await syncToDB({ fullName, username, bio, birthDate, schoolId, avatar, settings })
  })

  const savePhone = () => doSave(async () => {
    await syncToDB({ phone })
    await supabase!.auth.updateUser({ data: { phone } })
  })

  const savePlan = (p: "gratuito" | "estudiante" | "premium") => doSave(async () => {
    await syncToDB({ role: p === 'premium' ? 'premium' : (p === 'estudiante' ? 'student' : 'particular') })
    setPlan(p)
  })

  const saveGlobalSettings = () => doSave(async () => { await syncToDB({ settings }) })

  const nav = [
    { id: "general", label: "General", icon: <Settings size={15} color="white" /> },
    { id: "profile", label: "Perfil", icon: <User size={15} color="white" /> },
    { id: "account", label: "Cuenta y Seguridad", icon: <Lock size={15} color="white" /> },
    ...(!isAdmin ? [
      { id: "notifications", label: "Notificaciones", icon: <Bell size={15} color="white" /> },
      { id: "privacy", label: "Privacidad", icon: <Shield size={15} color="white" /> },
      { id: "content", label: "Contenido", icon: <Tv size={15} color="white" /> },
    ] : []),
    { id: "accessibility", label: "Accesibilidad", icon: <Eye size={15} color="white" /> },
  ]

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", fontSize: 14, fontWeight: 500,
    border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm,
    background: T.surface, color: T.text, fontFamily: T.font,
    outline: "none", boxSizing: "border-box", transition: "all .18s"
  }

  return (
    <div style={{ width: "100%", background: T.bg, minHeight: "100vh", fontFamily: T.font, boxSizing: "border-box", overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 767px) {
          .cfg-inner { width: 100% !important; margin-left: 0 !important; padding-bottom: 80px !important; }
          .cfg-body { grid-template-columns: 1fr !important; padding: 0 12px 100px !important; margin-top: -20px !important; gap: 14px !important; }
          .cfg-sidebar { position: relative !important; top: 0 !important; margin-bottom: 16px; width: 100% !important; }
          .cfg-page-header { padding: 24px 16px 52px !important; }
          .cfg-content-panel { padding: 20px 16px !important; }
          .cfg-2col { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .cfg-inner { margin-left: 220px !important; }
          .cfg-body { padding: 0 20px 60px !important; }
        }
        @media (min-width: 1161px) {
          .cfg-inner { margin-left: 280px !important; }
          .cfg-body { padding: 0 32px 80px !important; }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
        .cfg-nav-btn:hover { background: ${T.blueLight} !important; color: ${T.blue} !important; }
        .cfg-nav-btn:hover .cfg-nav-icon { background: ${T.blue} !important; }
        select { -webkit-appearance: none; appearance: none; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
      `}</style>

      <div className="cfg-inner" style={{ position: "relative", width: "auto" }}>

        {/* ── Page header */}
        <div className="cfg-page-header" style={{
          background: `linear-gradient(135deg, #0f172a 0%, ${T.blue} 100%)`,
          padding: "clamp(24px,4vw,40px) clamp(20px,4vw,40px) clamp(48px,6vw,64px)",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "20%", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ margin: "0 0 6px", fontSize: "clamp(24px,4vw,36px)", fontWeight: 500, color: "#fff", letterSpacing: "-0.03em", fontFamily: T.font }}>
              Configuración
            </h1>
            <p style={{ margin: "0 0 18px", fontSize: 14, color: "rgba(255,255,255,.65)", fontWeight: 500 }}>
              Personaliza tu experiencia en BIZEN
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,.1)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,.18)", borderRadius: 40, padding: "7px 14px"
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg,#60A5FA,#A78BFA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 500, color: "#fff", flexShrink: 0
              }}>
                {(user.email || "?")[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{user.email}</span>
              <span style={{
                fontSize: 10, color: "rgba(255,255,255,.8)", background: "rgba(255,255,255,.15)",
                padding: "2px 9px", borderRadius: 20, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em"
              }}>
                {dbProfile?.role || "Estudiante"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Two-column layout */}
        <div className="cfg-body" style={{
          display: "grid", gridTemplateColumns: "220px 1fr",
          gap: 20, marginTop: -24, position: "relative", zIndex: 2
        }}>

          {/* ── Sidebar nav */}
          <div className="cfg-sidebar" style={{
            background: T.surface, borderRadius: T.radiusLg, padding: "14px 10px",
            boxShadow: T.shadowMd, border: `1.5px solid ${T.border}`,
            height: "fit-content", position: "sticky", top: 16, alignSelf: "start"
          }}>
            <div style={{
              fontSize: 10, fontWeight: 500, color: T.textLight, letterSpacing: "0.12em",
              padding: "0 8px 10px", borderBottom: `1px solid ${T.border}`,
              marginBottom: 8, textTransform: "uppercase", fontFamily: T.font
            }}>Navegación</div>

            {nav.map(s => {
              const isActive = activeSection === s.id
              return (
                <button key={s.id} className="cfg-nav-btn" onClick={() => setActiveSection(s.id)} style={{
                  width: "100%", padding: "10px 12px", textAlign: "left", display: "flex",
                  alignItems: "center", gap: 10, borderRadius: T.radiusSm, border: "none",
                  fontFamily: T.font, background: isActive ? T.blueLight : "transparent",
                  color: isActive ? T.blue : T.textMid,
                  fontSize: 13, fontWeight: isActive ? 700 : 600,
                  cursor: "pointer", transition: "all .18s", marginBottom: 2
                }}>
                  <div className="cfg-nav-icon" style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isActive ? T.blue : "#F1F5F9",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    transition: "all .18s"
                  }}>
                    <div style={{ color: isActive ? "white" : T.textMuted }}>{s.icon}</div>
                  </div>
                  {s.label}
                  {isActive && <ChevronRight size={13} color={T.blue} style={{ marginLeft: "auto" }} />}
                </button>
              )
            })}

            <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 10, paddingTop: 10 }}>
              <button onClick={() => setShowResetConfirm(true)} style={{
                width: "100%", padding: "9px 12px",
                background: "transparent", border: `1.5px solid ${T.border}`,
                borderRadius: T.radiusSm, cursor: "pointer", fontSize: 12, fontWeight: 500,
                color: T.red, fontFamily: T.font,
                display: "flex", alignItems: "center", gap: 8, transition: "all .18s"
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = "#FCA5A5" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = T.border }}>
                <RotateCcw size={12} /> Restaurar defaults
              </button>
            </div>
          </div>

          {/* ── Content panel */}
          <div className="cfg-content-panel" style={{
            background: T.surface, borderRadius: T.radiusLg, padding: "28px 32px",
            boxShadow: T.shadowMd, border: `1.5px solid ${T.border}`, minWidth: 0
          }}>

            {/* Toast */}
            {toast && (
              <div style={{
                marginBottom: 18, padding: "13px 18px", borderRadius: T.radiusSm,
                display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500,
                background: toast.ok ? T.greenLight : T.redLight,
                border: `1.5px solid ${toast.ok ? "#86EFAC" : "#FCA5A5"}`,
                color: toast.ok ? "#15803D" : "#DC2626",
                animation: "fadeUp 0.25s ease both", fontFamily: T.font
              }}>
                {toast.ok ? <Check size={16} color="#15803D" /> : <X size={16} color="#DC2626" />} {toast.msg}
              </div>
            )}

            {/* ── GENERAL */}
            {activeSection === "general" && (
              <div>
                <SectionHeading icon={<Settings size={18} color="white" />} subtitle="Idioma y preferencias del sistema">
                  General
                </SectionHeading>

                <Card style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <Globe size={16} color={T.blue} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Idioma / Language</span>
                  </div>
                  <PillSelect
                    options={[{ v: "es", l: "🇲🇽 Español" }, { v: "en", l: "🇺🇸 English" }]}
                    value={settings.language} onChange={v => updateSettings({ language: v as Language })} />
                </Card>

                <Card>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <Zap size={16} color={T.blue} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Preferencias del sistema</span>
                  </div>
                  <ToggleRow label="Efectos de Sonido" desc="Activar efectos de sonido en la app"
                    checked={settings.soundsEnabled} onChange={v => updateSettings({ soundsEnabled: v })} />
                  <ToggleRow label="Animaciones" desc="Mostrar animaciones y transiciones suaves"
                    checked={settings.animationsEnabled} onChange={v => updateSettings({ animationsEnabled: v })} />
                </Card>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} />
              </div>
            )}

            {/* ── PROFILE */}
            {activeSection === "profile" && user && (
              <div>
                <SectionHeading icon={<User size={18} color="white" />} subtitle="Tu información personal y pública">
                  Mi Perfil
                </SectionHeading>

                {/* Avatar preview */}
                <Card style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: `linear-gradient(135deg,${T.blue},#6366f1)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(15,98,254,.2)", flexShrink: 0
                  }}>
                    <AvatarDisplay
                      avatar={avatar || { type: "character", id: "robot", character: "robot" }}
                      size={40}
                      frame={dbProfile?.inventory?.includes("2") ? "vip" : dbProfile?.inventory?.includes("1") ? "ambassador" : null}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: T.text, fontFamily: T.font }}>{fullName || "(Sin nombre)"}</div>
                    <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{username ? `@${username.replace('@', '')}` : user.email}</div>
                  </div>
                </Card>

                <div style={{ display: "grid", gap: 14 }}>
                  <Card>
                    <FieldLabel>Nombre completo</FieldLabel>
                    <Input value={fullName} onChange={setFullName} placeholder="Tu nombre real" />
                  </Card>

                  <div className="cfg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Card>
                      <FieldLabel>@Username</FieldLabel>
                      <Input value={username} onChange={setUsername} placeholder="usuario123" />
                    </Card>
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Calendar size={12} color={T.blue} />
                        <FieldLabel>Fecha de nacimiento</FieldLabel>
                      </div>
                      <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        style={{ ...inputStyle }}
                        onFocus={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(15,98,254,.1)` }}
                        onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none" }} />
                    </Card>
                  </div>

                  <Card>
                    <FieldLabel>Intereses Financieros / Bio</FieldLabel>
                    <textarea value={bio} onChange={e => setBio(e.target.value)}
                      placeholder="¿Qué te apasiona de las finanzas?"
                      style={{ ...inputStyle, minHeight: 72, resize: "vertical" as const }}
                      onFocus={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(15,98,254,.1)` }}
                      onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none" }} />
                  </Card>

                  {dbProfile?.role !== 'particular' && (
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <School size={12} color={T.blue} />
                        <FieldLabel>Mi Escuela</FieldLabel>
                      </div>
                      <select value={schoolId} onChange={e => setSchoolId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                        <option value="">Selecciona tu escuela</option>
                        {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </Card>
                  )}
                </div>

                <SaveBtn onClick={saveProfile} loading={saving} label="Actualizar perfil" />
              </div>
            )}

            {/* ── ACCOUNT */}
            {activeSection === "account" && user && (
              <div>
                <SectionHeading icon={<Lock size={18} color="white" />} subtitle="Email, contraseña y suscripción">
                  Cuenta y Seguridad
                </SectionHeading>

                {/* Email */}
                <Card style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between" }}>
                  <div>
                    <FieldLabel>Correo electrónico</FieldLabel>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.text, fontFamily: T.font }}>{user.email}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500, color: T.green, background: T.greenLight,
                    border: `1.5px solid #86EFAC`, padding: "4px 12px", borderRadius: 20,
                    display: "flex", alignItems: "center", gap: 4, flexShrink: 0, fontFamily: T.font
                  }}>
                    <Check size={12} /> Verificado
                  </span>
                </Card>

                {/* Phone */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Phone size={12} color={T.blue} />
                    <FieldLabel>Teléfono</FieldLabel>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+52 123 456 7890" style={{ ...inputStyle, flex: 1 }}
                      onFocus={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(15,98,254,.1)` }}
                      onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none" }} />
                    <button onClick={savePhone} disabled={saving} style={{
                      padding: "11px 20px", background: T.blue, border: "none", borderRadius: T.radiusSm,
                      color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
                      fontFamily: T.font, opacity: saving ? .6 : 1, whiteSpace: "nowrap",
                      boxShadow: "0 3px 10px rgba(15,98,254,.3)"
                    }}>
                      {saving ? "..." : "Guardar"}
                    </button>
                  </div>
                </Card>

                {/* Password */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
                        <Lock size={14} color={T.textMuted} /> Contraseña
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Seguridad de tu cuenta</div>
                    </div>
                    <button onClick={() => { setShowPwFields(!showPwFields); setPw({ new: "", confirm: "" }) }}
                      style={{
                        padding: "9px 16px", background: T.surfaceAlt, border: `1.5px solid ${T.border}`,
                        borderRadius: T.radiusSm, color: T.textMid, fontSize: 13, fontWeight: 500,
                        cursor: "pointer", fontFamily: T.font, transition: "all .18s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.blueLight; e.currentTarget.style.borderColor = T.blueMid }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceAlt; e.currentTarget.style.borderColor = T.border }}>
                      {showPwFields ? "Cancelar" : "Cambiar"}
                    </button>
                  </div>
                  {showPwFields && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                      <input type="password" value={pw.new} onChange={e => setPw({ ...pw, new: e.target.value })}
                        placeholder="Nueva contraseña (mín. 6 caracteres)" style={inputStyle}
                        onFocus={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(15,98,254,.1)` }}
                        onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none" }} />
                      <input type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })}
                        placeholder="Confirmar nueva contraseña" style={inputStyle}
                        onFocus={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(15,98,254,.1)` }}
                        onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none" }} />
                      <SaveBtn onClick={savePw} loading={saving} label="Actualizar Contraseña" />
                    </div>
                  )}
                </Card>

                {/* Plans */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                    <Award size={14} color={T.blue} />
                    <FieldLabel>Plan de Suscripción</FieldLabel>
                  </div>
                  {(!dbProfile?.role || ['particular', 'student', 'premium'].includes(dbProfile.role)) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {([
                        { id: "gratuito", l: "Plan Gratuito", d: "Acceso a todos los cursos básicos", c: T.green, grad: "linear-gradient(135deg,#10b981,#34d399)", icon: "🆓" },
                        { id: "estudiante", l: "Plan Estudiante", d: "Herramientas adicionales para estudiantes", c: T.blue, grad: `linear-gradient(135deg,${T.blue},#4A9EFF)`, icon: "🎓" },
                        { id: "premium", l: "Plan Premium", d: "Acceso completo + certificados + soporte", c: T.amber, grad: "linear-gradient(135deg,#F59E0B,#FBD34D)", icon: "⭐" },
                      ] as any[]).map(({ id, l, d, c, grad, icon }) => {
                        const isSelected = plan === id
                        return (
                          <div key={id} onClick={() => savePlan(id)} style={{
                            padding: "14px 16px", borderRadius: T.radiusSm, cursor: "pointer", transition: "all .18s",
                            border: `1.5px solid ${isSelected ? c : T.border}`,
                            background: isSelected ? `${c}10` : T.surfaceAlt,
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 34, height: 34, borderRadius: T.radiusSm, background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                                {icon}
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: isSelected ? c : T.text, fontFamily: T.font }}>{l}</div>
                                <div style={{ fontSize: 12, color: T.textMuted }}>{d}</div>
                              </div>
                            </div>
                            {isSelected && <span style={{
                              fontSize: 10, fontWeight: 500, color: c,
                              background: `${c}18`, padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${c}40`,
                              fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.06em"
                            }}>Activo</span>}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: "14px 16px", borderRadius: T.radiusSm, background: T.blueLight, border: `1.5px solid ${T.blueMid}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: T.radiusSm, background: `linear-gradient(135deg,${T.blue},#4A9EFF)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏫</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: T.blue, fontFamily: T.font }}>Plan Institucional</div>
                          <div style={{ fontSize: 12, color: T.textMuted }}>Gestionado por tu escuela o institución.</div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Account meta */}
                <div className="cfg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  {[
                    { l: "Cuenta creada", v: new Date(user.created_at || Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { l: "Método de acceso", v: "Email y Contraseña" },
                  ].map(({ l, v }) => (
                    <Card key={l}>
                      <FieldLabel>{l}</FieldLabel>
                      <div style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: T.font }}>{v}</div>
                    </Card>
                  ))}
                </div>

                {/* Session */}
                <div style={{ borderRadius: T.radius, border: `1.5px solid #FCA5A5`, background: T.redLight, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <LogOut size={14} color={T.red} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.text, fontFamily: T.font }}>Sesión</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14 }}>
                    Cierra tu sesión de forma segura en este dispositivo.
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button disabled={saving} onClick={async () => {
                      if (!supabase) return; setSaving(true)
                      try { await supabase.auth.signOut(); router.push("/login") }
                      catch { flash(false, "Error al cerrar sesión") } finally { setSaving(false) }
                    }} style={{
                      padding: "10px 22px", background: T.red, border: "none", borderRadius: T.radiusSm,
                      color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
                      fontFamily: T.font, opacity: saving ? .6 : 1,
                      boxShadow: "0 3px 10px rgba(239,68,68,.3)"
                    }}>
                      {saving ? "Saliendo..." : "Cerrar Sesión"}
                    </button>
                    <button disabled={saving} onClick={async () => {
                      if (!supabase) return; setSaving(true)
                      try { await supabase.auth.signOut(); router.push("/login") }
                      catch { flash(false, "Error al cerrar sesión") } finally { setSaving(false) }
                    }} style={{
                      padding: "10px 22px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm,
                      color: T.textMid, fontSize: 13, fontWeight: 500, cursor: "pointer",
                      fontFamily: T.font, display: "flex", alignItems: "center", gap: 6
                    }}>
                      <LogOut size={13} /> Cambiar de Cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <div>
                <SectionHeading icon={<Bell size={18} color="white" />} subtitle="Controla cómo y cuándo te contactamos">
                  Notificaciones
                </SectionHeading>
                <Card>
                  {[
                    { k: "push", l: "Notificaciones Push", d: "Recibir notificaciones en tu dispositivo" },
                    { k: "email", l: "Correo Electrónico", d: "Recibir notificaciones por email" },
                    { k: "sound", l: "Sonido", d: "Reproducir sonido al recibir notificaciones" },
                    { k: "courseUpdates", l: "Actualizaciones de Cursos", d: "Nuevo contenido en tus cursos" },
                    { k: "achievements", l: "Logros", d: "Cuando obtienes un nuevo logro" },
                    { k: "reminders", l: "Recordatorios de estudio", d: "Recordatorios de estudio programados" },
                  ].map(({ k, l, d }) => (
                    <ToggleRow key={k} label={l} desc={d}
                      checked={settings.notifications[k as keyof typeof settings.notifications] as boolean}
                      onChange={v => updateSettings({ notifications: { ...settings.notifications, [k]: v } })} />
                  ))}
                </Card>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar notificaciones" />
              </div>
            )}

            {/* ── PRIVACY */}
            {activeSection === "privacy" && (
              <div>
                <SectionHeading icon={<Shield size={18} color="white" />} subtitle="Controla quién puede ver tu información">
                  Privacidad
                </SectionHeading>
                {[
                  { k: "profileVisibility", l: "Visibilidad del Perfil" },
                  { k: "activityVisibility", l: "Visibilidad de Actividad" },
                ].map(({ k, l }) => (
                  <Card key={k} style={{ marginBottom: 12 }}>
                    <FieldLabel>{l}</FieldLabel>
                    <select value={(settings.privacy as any)[k]}
                      onChange={e => updateSettings({ privacy: { ...settings.privacy, [k]: e.target.value as any } })}
                      style={{ ...inputStyle, maxWidth: 280, cursor: "pointer" }}>
                      <option value="public">🌍 Público</option>
                      <option value="friends">👥 Solo amigos</option>
                      <option value="private">🔒 Privado</option>
                    </select>
                  </Card>
                ))}
                <Card>
                  <ToggleRow label="Mostrar Progreso" desc="Permitir que otros vean tu progreso"
                    checked={settings.privacy.showProgress}
                    onChange={v => updateSettings({ privacy: { ...settings.privacy, showProgress: v } })} />
                  <ToggleRow label="Permitir Mensajes" desc="Recibir mensajes directos de otros usuarios"
                    checked={settings.privacy.allowMessages}
                    onChange={v => updateSettings({ privacy: { ...settings.privacy, allowMessages: v } })} />
                </Card>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar privacidad" />
              </div>
            )}

            {/* ── CONTENT */}
            {activeSection === "content" && (
              <div>
                <SectionHeading icon={<Tv size={18} color="white" />} subtitle="Ajusta cómo se muestra el contenido">
                  Contenido
                </SectionHeading>
                <Card>
                  <ToggleRow label="Subtítulos" desc="Activar subtítulos en videos"
                    checked={settings.contentPreferences.showSubtitles}
                    onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showSubtitles: v } })} />
                  <ToggleRow label="Reproducción Automática" desc="Reproducir videos automáticamente"
                    checked={settings.contentPreferences.autoplayVideos}
                    onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, autoplayVideos: v } })} />
                  <ToggleRow label="Mostrar Pistas" desc="Ver pistas durante los ejercicios"
                    checked={settings.contentPreferences.showHints}
                    onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showHints: v } })} />
                </Card>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar preferencias" />
              </div>
            )}

            {/* ── ACCESSIBILITY */}
            {activeSection === "accessibility" && (
              <div>
                <SectionHeading icon={<Eye size={18} color="white" />} subtitle="Adapta la interfaz a tus necesidades">
                  Accesibilidad
                </SectionHeading>
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <FileText size={14} color={T.blue} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Tamaño de Texto</span>
                  </div>
                  <PillSelect
                    options={[{ v: "small", l: "Pequeño" }, { v: "medium", l: "Mediano" }, { v: "large", l: "Grande" }, { v: "extra-large", l: "XL" }]}
                    value={settings.accessibility.textSize}
                    onChange={v => updateSettings({ accessibility: { ...settings.accessibility, textSize: v as TextSize } })} />
                </Card>
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Contrast size={14} color={T.blue} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Modo de Contraste</span>
                  </div>
                  <PillSelect
                    options={[{ v: "normal", l: "Normal" }, { v: "high", l: "Alto Contraste" }]}
                    value={settings.accessibility.contrastMode}
                    onChange={v => updateSettings({ accessibility: { ...settings.accessibility, contrastMode: v as ContrastMode } })} />
                </Card>
                <Card>
                  <ToggleRow label="Reducir Movimiento" desc="Minimizar animaciones y efectos"
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
                </Card>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar accesibilidad" />
              </div>
            )}

          </div>
        </div>

        {/* ── Reset Modal */}
        {showResetConfirm && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,.5)",
            backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 9999, padding: 24
          }}>
            <div style={{
              background: T.surface, borderRadius: T.radiusLg + 4, padding: "36px 36px",
              maxWidth: 400, width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,.2)", border: `1.5px solid ${T.border}`,
              animation: "scaleIn 0.25s ease both"
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', background: T.redLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: "0 4px 16px rgba(239,68,68,.15)"
                }}>
                  <AlertTriangle size={28} color={T.red} />
                </div>
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 500, color: T.text, textAlign: "center", fontFamily: T.font }}>
                ¿Restaurar configuración?
              </h3>
              <p style={{ margin: "0 0 24px", fontSize: 13, color: T.textMuted, lineHeight: 1.6, textAlign: "center" }}>
                Esto restablecerá todas tus preferencias a los valores predeterminados.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1, padding: "12px", background: T.surfaceAlt, border: `1.5px solid ${T.border}`,
                    borderRadius: T.radiusSm, color: T.textMid, fontSize: 14, fontWeight: 500,
                    cursor: "pointer", fontFamily: T.font
                  }}>
                  Cancelar
                </button>
                <button onClick={async () => {
                  resetSettings(); setShowResetConfirm(false)
                  await syncToDB({ settings: {} })
                  flash(true, "Configuración restaurada")
                }}
                  style={{
                    flex: 1, padding: "12px", background: T.red, border: "none",
                    borderRadius: T.radiusSm, color: "#fff", fontSize: 14, fontWeight: 500,
                    cursor: "pointer", fontFamily: T.font,
                    boxShadow: "0 4px 12px rgba(239,68,68,.3)"
                  }}>
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 500, color: "#0F62FE",
        background: "#FBFAF5"
      }}>
        Cargando configuración...
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
