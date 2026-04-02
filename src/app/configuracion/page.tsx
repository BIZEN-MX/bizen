"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSettings, Language, TextSize, ContrastMode } from "@/contexts/SettingsContext"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import {
  Settings, User, Bell, Shield, Tv,
  Check, X, AlertTriangle, RotateCcw, ChevronRight,
  Eye, Award, Lock, LogOut, Save, Globe,
  Zap, Contrast, FileText, Sparkles, Medal,
  Phone, Calendar, School, Instagram, ChevronDown
} from "lucide-react"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import BizenVirtualCard, { CardTheme } from "@/components/BizenVirtualCard"

export const dynamic = 'force-dynamic'

// ─── Design System ────────────────────────────────────────────────────────────
const C = {
  bg:          "#F4F6F9",
  surface:     "#FFFFFF",
  surfaceAlt:  "#F8FAFC",
  border:      "#E2E8F0",
  blue:        "#0F62FE",
  spatial:     "#0B1E5E",
  blueAlpha:   "rgba(15,98,254,0.08)",
  blueMid:     "#BFDBFE",
  text:        "#0F172A",
  textMid:     "#475569",
  textMuted:   "#94A3B8",
  green:       "#10B981",
  greenAlpha:  "rgba(16,185,129,0.1)",
  red:         "#EF4444",
  redAlpha:    "rgba(239,68,68,0.08)",
  amber:       "#F59E0B",
  font:        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  r:           "16px",
  rSm:         "10px",
  rLg:         "24px",
  shadow:      "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center",
        width: 42, height: 24, borderRadius: 999, border: "none",
        cursor: "pointer", flexShrink: 0, padding: 0,
        background: checked ? C.blue : "#D1D5DB",
        transition: "background .2s",
      }}
    >
      <span style={{
        position: "absolute", left: checked ? 20 : 3,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)"
      }} />
    </button>
  )
}

function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: `1px solid ${C.border}`, gap: 16
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: C.font }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <FieldRow label={label} desc={desc}>
      <Toggle checked={checked} onChange={onChange} />
    </FieldRow>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: C.surface, borderRadius: C.rLg,
      border: `1px solid ${C.border}`, overflow: "hidden",
      boxShadow: C.shadow, marginBottom: 16
    }}>
      <div style={{
        padding: "18px 24px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: C.blue, display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: C.text, fontFamily: C.font }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "0 24px 4px" }}>
        {children}
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, color: C.textMuted,
      letterSpacing: "0.08em", textTransform: "uppercase",
      marginBottom: 8, fontFamily: C.font
    }}>
      {children}
    </div>
  )
}

function StyledInput({ value, onChange, placeholder, type = "text", disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "11px 14px", fontSize: 14,
        border: `1.5px solid ${focused ? C.blue : C.border}`,
        borderRadius: C.rSm, background: disabled ? C.surfaceAlt : C.surface,
        color: disabled ? C.textMuted : C.text, fontFamily: C.font,
        outline: "none", boxSizing: "border-box", transition: "border-color .15s",
        boxShadow: focused ? `0 0 0 3px ${C.blueAlpha}` : "none",
      }}
    />
  )
}

function PillSelect({ options, value, onChange }: {
  options: { v: string; l: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(({ v, l }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: "8px 18px", borderRadius: 999,
            border: `1.5px solid ${value === v ? C.blue : C.border}`,
            background: value === v ? C.blue : C.surface,
            color: value === v ? "#fff" : C.textMid,
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            fontFamily: C.font, transition: "all .15s",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

function SaveBtn({ onClick, loading, label = "Guardar cambios" }: { onClick: () => void; loading?: boolean; label?: string }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "11px 24px", background: hover && !loading ? "#0A50D4" : C.blue,
        border: "none", borderRadius: C.rSm, color: "#fff", fontSize: 14,
        fontWeight: 500, cursor: loading ? "default" : "pointer",
        fontFamily: C.font, transition: "all .15s",
        opacity: loading ? .6 : 1, marginTop: 20,
        boxShadow: hover && !loading ? "0 4px 16px rgba(15,98,254,.35)" : "0 2px 8px rgba(15,98,254,.2)",
      }}
    >
      <Save size={14} />
      {loading ? "Guardando..." : label}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function SettingsContent() {
  const router     = useRouter()
  const { user, dbProfile, refreshUser } = useAuth()
  const { settings, updateSettings, resetSettings } = useSettings()
  const [supabase, setSupabase]             = useState<ReturnType<typeof createClientMicrocred> | null>(null)
  const [activeSection, setActiveSection]   = useState("general")
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showPwFields, setShowPwFields]     = useState(false)
  const [pw, setPw]                         = useState({ new: "", confirm: "" })
  const [saving, setSaving]                 = useState(false)
  const [toast, setToast]                   = useState<{ ok: boolean; msg: string } | null>(null)
  const [fullName, setFullName]             = useState("")
  const [username, setUsername]             = useState("")
  const [bio, setBio]                       = useState("")
  const [avatar, setAvatar]                 = useState<any>({ type: "character", id: "robot", character: "robot", label: "Robot" })
  const [birthDate, setBirthDate]           = useState("")
  const [schoolId, setSchoolId]             = useState("")
  const [schools, setSchools]               = useState<{ id: string; name: string }[]>([])
  const [phone, setPhone]                   = useState("")
  const [cardTheme, setCardTheme]           = useState<CardTheme>("blue")
  const inputBase: React.CSSProperties = {
    width: "100%", padding: "11px 14px", fontSize: 14, fontFamily: C.font,
    border: `1.5px solid ${C.border}`, borderRadius: C.rSm,
    background: C.surface, color: C.text, outline: "none",
    boxSizing: "border-box", transition: "border-color .15s",
  }

  useEffect(() => { setSupabase(createClientMicrocred()) }, [])

  useEffect(() => {
    if (user && dbProfile) {
      setPhone(dbProfile.phone || user.user_metadata?.phone || "")
      setFullName(dbProfile.fullName || user.user_metadata?.full_name || "")
      setUsername(dbProfile.username || user.user_metadata?.username || "")
      setBio(dbProfile.bio || user.user_metadata?.bio || "")
      if (dbProfile.birthDate) setBirthDate(new Date(dbProfile.birthDate).toISOString().split("T")[0])
      else setBirthDate(user.user_metadata?.birth_date || "")
      setSchoolId(dbProfile.schoolId || user.user_metadata?.school_id || "")
      setAvatar(dbProfile.avatar || user.user_metadata?.avatar || { type: "character", id: "robot", character: "robot", label: "Robot" })
      setCardTheme((dbProfile.cardTheme as CardTheme) || "blue")
      if (dbProfile.settings && Object.keys(dbProfile.settings).length > 0) updateSettings(dbProfile.settings)
    }
  }, [user, dbProfile])

  useEffect(() => {
    fetch("/api/schools")
      .then(r => {
        if (r.ok) return r.json()
        throw new Error("Failed to fetch schools")
      })
      .then(setSchools)
      .catch(() => {})
  }, [])

  useEffect(() => { if (typeof window !== "undefined" && !user) router.push("/login") }, [user, router])
  if (!user) return null

  const isAdmin = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"

  const flash = (ok: boolean, msg: string) => {
    setToast({ ok, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const doSave = async (fn: () => Promise<void>) => {
    if (!supabase) return
    setSaving(true)
    try { await fn(); flash(true, "Guardado correctamente") }
    catch (e: any) { flash(false, e?.message || "Error al guardar") }
    finally { setSaving(false) }
  }

  const syncToDB = async (payload: any) => {
    const res = await fetch("/api/profiles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    await syncToDB({ fullName, username, bio, birthDate, schoolId, avatar, settings, cardTheme })
  })

  const savePhone = () => doSave(async () => {
    await syncToDB({ phone })
    await supabase!.auth.updateUser({ data: { phone } })
  })


  const saveGlobalSettings = () => doSave(async () => { await syncToDB({ settings }) })

  const roleLabel = () => {
    if (dbProfile?.role === "school_admin") return "Admin"
    if (dbProfile?.role === "teacher") return "Docente"
    if (dbProfile?.role === "institucional") return "Institucional"
    if (dbProfile?.role === "premium") return "Premium"
    if (dbProfile?.role === "student") return "Estudiante"
    return "Cuenta Gratuita"
  }

  const navItems = [
    { id: "general",        label: "General",         icon: <Settings size={15} color="white" /> },
    { id: "profile",        label: "Perfil",          icon: <User size={15} color="white" /> },
    { id: "account",        label: "Cuenta",          icon: <Lock size={15} color="white" /> },
    { id: "card",           label: "Tarjeta BIZEN",   icon: <Award size={15} color="white" /> },
    ...(!isAdmin ? [
      { id: "notifications", label: "Notificaciones",  icon: <Bell size={15} color="white" /> },
      { id: "privacy",      label: "Privacidad",      icon: <Shield size={15} color="white" /> },
      { id: "content",      label: "Contenido",       icon: <Tv size={15} color="white" /> },
    ] : []),
    { id: "accessibility",  label: "Accesibilidad",   icon: <Eye size={15} color="white" /> },
  ]

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font }}>
      <style>{`
        @media (max-width: 767px) {
          .cfg-inner { width: 100% !important; margin-left: 0 !important; padding-bottom: 90px !important; }
          .cfg-body  { grid-template-columns: 1fr !important; padding: 0 14px 80px !important; margin-top: -20px !important; gap: 14px !important; }
          .cfg-side  { position: relative !important; top: 0 !important; width: 100% !important; }
          .cfg-hero  { padding: 24px 18px 52px !important; }
          .cfg-panel { padding: 0 !important; }
          .cfg-2col  { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .cfg-inner { margin-left: 220px !important; }
          .cfg-body  { padding: 0 20px 60px !important; }
        }
        @media (min-width: 1161px) {
          .cfg-inner { margin-left: 280px !important; }
          .cfg-body  { padding: 0 32px 80px !important; }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn { from { opacity:0; transform:scale(.97) } to { opacity:1; transform:scale(1) } }
        .nav-item:hover { background: ${C.blueAlpha} !important; }
        select { -webkit-appearance: none; appearance: none; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: .5; cursor: pointer; }
        input[type="password"]::placeholder, input[type="text"]::placeholder, textarea::placeholder { color: ${C.textMuted}; }
      `}</style>

      <div className="cfg-inner" style={{ position: "relative" }}>

        {/* ── Hero ── */}
        <div className="cfg-hero" style={{
          background: C.spatial,
          padding: "clamp(32px,5vw,52px) clamp(24px,5vw,48px) clamp(60px,8vw,80px)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Orbs & Mesh */}
          <div style={{ position:"absolute", top:"-50%", right:"-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position:"absolute", bottom:"-30%", left:"-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ 
            position: "absolute", inset: 0, opacity: 0.05, 
            backgroundImage: "radial-gradient(rgba(255,255,255,.5) 1.5px,transparent 1.5px)", 
            backgroundSize: "32px 32px", pointerEvents: "none" 
          }} />

          <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <h1 style={{ margin:"0 0 8px", fontSize:"clamp(22px,4vw,32px)", fontWeight:600, color:"#fff", letterSpacing:"-0.03em" }}>
                Configuración
              </h1>
              <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,.6)", fontWeight:400 }}>
                Gestiona tu perfil, privacidad y preferencias personales
              </p>
            </div>

            {/* User badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:12,
              background:"rgba(255,255,255,.08)", backdropFilter:"blur(12px)",
              border:"1px solid rgba(255,255,255,.18)", borderRadius:40, padding:"6px 16px 6px 6px"
            }}>
              <div style={{
                width:40, height:40, borderRadius:"50%", background: C.blue,
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, overflow: "hidden",
                boxShadow: "0 0 20px rgba(15,98,254,0.4)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <AvatarDisplay 
                  avatar={avatar || { type: "character", id: "robot", character: "robot" }} 
                  size={32} 
                />
              </div>
              <div style={{ paddingRight: 4 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.2 }}>{fullName || user.email?.split("@")[0]}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.6)", textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight:1.2 }}>{roleLabel()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="cfg-body" style={{
          display:"grid", gridTemplateColumns:"220px 1fr",
          gap:20, marginTop:-32, position:"relative", zIndex:2
        }}>

          {/* ── Sidebar nav ── */}
          <div className="cfg-side" style={{
            background: C.surface, borderRadius: C.rLg,
            border: `1px solid ${C.border}`,
            boxShadow: C.shadow,
            height:"fit-content", position:"sticky", top:16, alignSelf:"start",
            overflow: "hidden",
          }}>
            <div style={{
              fontSize:10, fontWeight:500, color:C.textMuted, letterSpacing:"0.1em",
              padding:"14px 16px 10px", borderBottom:`1px solid ${C.border}`,
              textTransform:"uppercase", fontFamily:C.font
            }}>
              Configuración
            </div>

            <div style={{ padding:"8px" }}>
              {navItems.map(s => {
                const active = activeSection === s.id
                return (
                  <button
                    key={s.id}
                    className="nav-item"
                    onClick={() => setActiveSection(s.id)}
                    style={{
                      width:"100%", padding:"9px 10px", textAlign:"left",
                      display:"flex", alignItems:"center", gap:9,
                      borderRadius:10, border:"none",
                      fontFamily:C.font,
                      background: active ? C.blueAlpha : "transparent",
                      color: active ? C.blue : C.textMid,
                      fontSize:13, fontWeight: active ? 500 : 400,
                      cursor:"pointer", transition:"all .15s", marginBottom:2
                    }}
                  >
                    <div style={{
                      width:26, height:26, borderRadius:7,
                      background: active ? C.blue : C.surfaceAlt,
                      border: `1px solid ${active ? C.blue : C.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                      transition:"all .15s"
                    }}>
                      <div style={{ color: active ? "white" : C.textMuted }}>{s.icon}</div>
                    </div>
                    {s.label}
                    {active && <ChevronRight size={12} color={C.blue} style={{ marginLeft:"auto" }} />}
                  </button>
                )
              })}
            </div>

            {/* Footer actions */}
            <div style={{ borderTop:`1px solid ${C.border}`, padding:"8px" }}>
              <a
                href="https://www.instagram.com/bizen.mx?igsh=ZmJmYmdxZHg1Z2E3"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display:"flex", alignItems:"center", gap:9, padding:"9px 10px",
                  borderRadius:10, fontSize:13, fontWeight:400, color:C.textMid,
                  fontFamily:C.font, textDecoration:"none", transition:"all .15s",
                  marginBottom:2,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surfaceAlt; e.currentTarget.style.color = "#E1306C" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMid }}
              >
                <div style={{ width:26, height:26, borderRadius:7, background:C.surfaceAlt, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Instagram size={13} color={C.textMuted} />
                </div>
                Instagram
              </a>
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 10px",
                  borderRadius:10, border:"none", background:"transparent",
                  fontSize:13, fontWeight:400, color:C.textMuted,
                  fontFamily:C.font, cursor:"pointer", transition:"all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.redAlpha; e.currentTarget.style.color = C.red }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted }}
              >
                <div style={{ width:26, height:26, borderRadius:7, background:C.surfaceAlt, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <RotateCcw size={12} color={C.textMuted} />
                </div>
                Restaurar defaults
              </button>
            </div>
          </div>

          {/* ── Content area ── */}
          <div className="cfg-panel">

            {/* Toast */}
            {toast && (
              <div style={{
                marginBottom:16, padding:"12px 18px", borderRadius:C.rSm,
                display:"flex", alignItems:"center", gap:10, fontSize:13, fontWeight:500,
                background: toast.ok ? "rgba(16,185,129,.08)" : "rgba(239,68,68,.08)",
                border: `1px solid ${toast.ok ? "rgba(16,185,129,.3)" : "rgba(239,68,68,.3)"}`,
                color: toast.ok ? "#059669" : "#DC2626",
                animation:"fadeUp .25s ease both", fontFamily:C.font
              }}>
                {toast.ok ? <Check size={15} color="#059669" /> : <X size={15} color="#DC2626" />}
                {toast.msg}
              </div>
            )}

            {/* ── GENERAL ── */}
            {activeSection === "general" && (
              <div>
                <SectionCard title="Idioma" icon={<Globe size={15} color="white" />}>
                  <div style={{ paddingTop:14, paddingBottom:14 }}>
                    <FieldLabel>Selecciona el idioma de la interfaz</FieldLabel>
                    <PillSelect
                      options={[{ v:"es", l:"Español" }, { v:"en", l:"English" }]}
                      value={settings.language} onChange={v => updateSettings({ language: v as Language })}
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Preferencias del sistema" icon={<Zap size={15} color="white" />}>
                  <ToggleRow
                    label="Efectos de Sonido"
                    desc="Activar efectos de sonido en la app"
                    checked={settings.soundsEnabled}
                    onChange={v => updateSettings({ soundsEnabled: v })}
                  />
                  <ToggleRow
                    label="Animaciones"
                    desc="Mostrar animaciones y transiciones suaves"
                    checked={settings.animationsEnabled}
                    onChange={v => updateSettings({ animationsEnabled: v })}
                  />
                  <div style={{ paddingBottom:4 }} />
                </SectionCard>

                <SaveBtn onClick={saveGlobalSettings} loading={saving} />
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeSection === "profile" && user && (
              <div>
                {/* Identity preview */}
                <div style={{
                  background: C.surface, borderRadius: C.rLg, border: `1px solid ${C.border}`,
                  boxShadow: C.shadow, marginBottom:16,
                  display:"flex", alignItems:"center", gap:16, padding:"20px 24px"
                }}>
                  <div style={{
                    width:56, height:56, borderRadius:14, background:C.blue,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                  }}>
                    <AvatarDisplay
                      avatar={avatar || { type:"character", id:"robot", character:"robot" }}
                      size={42}
                      frame={dbProfile?.inventory?.includes("2") ? "vip" : dbProfile?.inventory?.includes("1") ? "ambassador" : null}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:500, color:C.text }}>{fullName || "(Sin nombre)"}</div>
                    <div style={{ fontSize:13, color:C.textMuted, marginTop:2, fontWeight:400 }}>
                      {username ? `@${username.replace("@","")}` : user.email}
                    </div>
                  </div>
                </div>

                <SectionCard title="Información personal" icon={<User size={15} color="white" />}>
                  <div style={{ paddingTop:14, display:"grid", gap:14, paddingBottom:14 }}>
                    <div>
                      <FieldLabel>Nombre completo</FieldLabel>
                      <StyledInput value={fullName} onChange={setFullName} placeholder="Tu nombre completo" />
                    </div>
                    <div className="cfg-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                      <div>
                        <FieldLabel>@Username</FieldLabel>
                        <StyledInput value={username} onChange={setUsername} placeholder="usuario123" />
                      </div>
                      <div>
                        <FieldLabel>Fecha de nacimiento</FieldLabel>
                        <input
                          type="date"
                          value={birthDate}
                          onChange={e => setBirthDate(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                          style={inputBase}
                          onFocus={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.blueAlpha}` }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none" }}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Bio</FieldLabel>
                      <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Cuéntale algo a tu comunidad..."
                        style={{ ...inputBase, minHeight:80, resize:"vertical" as const }}
                        onFocus={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.blueAlpha}` }}
                        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none" }}
                      />
                    </div>
                    {dbProfile?.role !== "particular" && (
                      <div>
                        <FieldLabel>Mi Escuela</FieldLabel>
                        <div style={{ position:"relative" }}>
                          <select
                            value={schoolId}
                            onChange={e => setSchoolId(e.target.value)}
                            style={{ ...inputBase, cursor:"pointer", paddingRight:36 }}
                            onFocus={e => { e.currentTarget.style.borderColor = C.blue }}
                            onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                          >
                            <option value="">Selecciona tu escuela</option>
                            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <ChevronDown size={14} color={C.textMuted} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SaveBtn onClick={saveProfile} loading={saving} label="Actualizar perfil" />

                <div style={{
                  marginTop: 24, padding: "16px 20px", background: C.blueAlpha,
                  borderRadius: C.rSm, display: "flex", gap: 14, alignItems: "center"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${C.blue}20` }}>
                    <Sparkles size={18} color={C.blue} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>Consejo de Billy</div>
                    <div style={{ fontSize: 12, color: C.textMid, marginTop: 1 }}>
                      Tener un nombre de usuario único te ayuda a destacar en los rankings globales. ¡Elige uno que te represente!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {activeSection === "account" && user && (
              <div>
                {/* Email */}
                <SectionCard title="Correo electrónico" icon={<User size={15} color="white" />}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:14, paddingBottom:14 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{user.email}</div>
                      <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>Tu dirección de correo principal</div>
                    </div>
                    <span style={{
                      display:"inline-flex", alignItems:"center", gap:5,
                      fontSize:11, fontWeight:500, color:C.green,
                      background:C.greenAlpha, border:`1px solid rgba(16,185,129,.25)`,
                      padding:"4px 10px", borderRadius:20
                    }}>
                      <Check size={11} />Verificado
                    </span>
                  </div>
                </SectionCard>

                {/* Phone */}
                <SectionCard title="Teléfono" icon={<Phone size={15} color="white" />}>
                  <div style={{ paddingTop:14, paddingBottom:14 }}>
                    <FieldLabel>Número de contacto</FieldLabel>
                    <div style={{ display:"flex", gap:10 }}>
                      <input
                        type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+52 123 456 7890"
                        style={{ ...inputBase, flex:1 }}
                        onFocus={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.blueAlpha}` }}
                        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none" }}
                      />
                      <button
                        onClick={savePhone}
                        disabled={saving}
                        style={{
                          padding:"11px 20px", background:C.blue, border:"none",
                          borderRadius:C.rSm, color:"#fff", fontSize:13, fontWeight:500,
                          cursor:"pointer", fontFamily:C.font, opacity: saving ? .6 : 1,
                          whiteSpace:"nowrap"
                        }}
                      >
                        {saving ? "..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                </SectionCard>

                {/* Password */}
                <SectionCard title="Contraseña" icon={<Lock size={15} color="white" />}>
                  <div style={{ paddingTop:14, paddingBottom: showPwFields ? 0 : 14 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontSize:13, color:C.textMuted }}>
                        {showPwFields ? "Introduce tu nueva contraseña" : "••••••••••••"}
                      </div>
                      <button
                        onClick={() => { setShowPwFields(!showPwFields); setPw({ new:"", confirm:"" }) }}
                        style={{
                          padding:"7px 14px", background: showPwFields ? C.redAlpha : C.surfaceAlt,
                          border:`1px solid ${showPwFields ? "rgba(239,68,68,.3)" : C.border}`,
                          borderRadius:C.rSm, color: showPwFields ? C.red : C.textMid,
                          fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:C.font
                        }}
                      >
                        {showPwFields ? "Cancelar" : "Cambiar"}
                      </button>
                    </div>
                    {showPwFields && (
                      <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:14, paddingBottom:14 }}>
                        <input
                          type="password" value={pw.new} onChange={e => setPw({ ...pw, new:e.target.value })}
                          placeholder="Nueva contraseña (mín. 6 caracteres)"
                          style={inputBase}
                          onFocus={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.blueAlpha}` }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none" }}
                        />
                        <input
                          type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm:e.target.value })}
                          placeholder="Confirmar contraseña"
                          style={inputBase}
                          onFocus={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.blueAlpha}` }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none" }}
                        />
                        <SaveBtn onClick={savePw} loading={saving} label="Actualizar contraseña" />
                      </div>
                    )}
                  </div>
                </SectionCard>


                {/* Account meta + Signout */}
                <SectionCard title="Sesión y cuenta" icon={<LogOut size={15} color="white" />}>
                  <div style={{ paddingTop:14 }}>
                    <div className="cfg-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                      {[
                        { l:"Cuenta creada", v:new Date(user.created_at || Date.now()).toLocaleDateString("es-MX", { day:"numeric", month:"long", year:"numeric" }) },
                        { l:"Método de acceso", v:"Email y contraseña" },
                      ].map(({ l, v }) => (
                        <div key={l} style={{ padding:"12px 14px", background:C.surfaceAlt, borderRadius:10, border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{l}</div>
                          <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap", paddingBottom:14 }}>
                      <button
                        disabled={saving}
                        onClick={async () => {
                          if (!supabase) return; setSaving(true)
                          try { await supabase.auth.signOut(); router.push("/login") }
                          catch { flash(false, "Error al cerrar sesión") }
                          finally { setSaving(false) }
                        }}
                        style={{
                          padding:"10px 22px", background:C.red, border:"none",
                          borderRadius:C.rSm, color:"#fff", fontSize:13, fontWeight:500,
                          cursor:"pointer", fontFamily:C.font, opacity: saving ? .6 : 1,
                        }}
                      >
                        {saving ? "Saliendo..." : "Cerrar Sesión"}
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === "notifications" && (
              <div>
                <SectionCard title="Notificaciones" icon={<Bell size={15} color="white" />}>
                  {[
                    { k:"push",          l:"Notificaciones Push",      d:"Recibir notificaciones en tu dispositivo" },
                    { k:"email",         l:"Correo Electrónico",        d:"Recibir notificaciones por email" },
                    { k:"sound",         l:"Sonido",                    d:"Reproducir sonido al recibir notificaciones" },
                    { k:"courseUpdates", l:"Actualizaciones de Cursos", d:"Nuevo contenido en tus cursos" },
                    { k:"achievements",  l:"Logros",                    d:"Cuando obtienes un nuevo logro" },
                    { k:"reminders",     l:"Recordatorios",             d:"Recordatorios de estudio programados" },
                  ].map(({ k, l, d }) => (
                    <ToggleRow key={k} label={l} desc={d}
                      checked={settings.notifications[k as keyof typeof settings.notifications] as boolean}
                      onChange={v => updateSettings({ notifications: { ...settings.notifications, [k]:v } })}
                    />
                  ))}
                  <div style={{ paddingBottom:4 }} />
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar notificaciones" />
              </div>
            )}

            {/* ── PRIVACY ── */}
            {activeSection === "privacy" && (
              <div>
                <SectionCard title="Visibilidad" icon={<Shield size={15} color="white" />}>
                  <div style={{ paddingTop:14, display:"flex", flexDirection:"column", gap:14, paddingBottom:14 }}>
                    {[
                      { k:"profileVisibility",  l:"Visibilidad del Perfil" },
                      { k:"activityVisibility", l:"Visibilidad de Actividad" },
                    ].map(({ k, l }) => (
                      <div key={k}>
                        <FieldLabel>{l}</FieldLabel>
                        <div style={{ position:"relative" }}>
                          <select
                            value={(settings.privacy as any)[k]}
                            onChange={e => updateSettings({ privacy: { ...settings.privacy, [k]: e.target.value as any } })}
                            style={{ ...inputBase, cursor:"pointer", maxWidth:280, paddingRight:36 }}
                            onFocus={e => { e.currentTarget.style.borderColor = C.blue }}
                            onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                          >
                            <option value="public">Público</option>
                            <option value="friends">Solo amigos</option>
                            <option value="private">Privado</option>
                          </select>
                          <ChevronDown size={14} color={C.textMuted} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Interacciones" icon={<Shield size={15} color="white" />}>
                  <ToggleRow label="Mostrar Progreso" desc="Permitir que otros vean tu progreso"
                    checked={settings.privacy.showProgress}
                    onChange={v => updateSettings({ privacy: { ...settings.privacy, showProgress:v } })}
                  />
                  <ToggleRow label="Permitir Mensajes" desc="Recibir mensajes directos de otros usuarios"
                    checked={settings.privacy.allowMessages}
                    onChange={v => updateSettings({ privacy: { ...settings.privacy, allowMessages:v } })}
                  />
                  <div style={{ paddingBottom:4 }} />
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar privacidad" />
              </div>
            )}

            {/* ── CONTENT ── */}
            {activeSection === "content" && (
              <div>
                <SectionCard title="Preferencias de Contenido" icon={<Tv size={15} color="white" />}>
                  <ToggleRow label="Subtítulos" desc="Activar subtítulos en videos"
                    checked={settings.contentPreferences.showSubtitles}
                    onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showSubtitles:v } })}
                  />
                  <ToggleRow label="Reproducción Automática" desc="Reproducir videos automáticamente"
                    checked={settings.contentPreferences.autoplayVideos}
                    onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, autoplayVideos:v } })}
                  />
                  <ToggleRow label="Mostrar Pistas" desc="Ver pistas durante los ejercicios"
                    checked={settings.contentPreferences.showHints}
                    onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showHints:v } })}
                  />
                  <div style={{ paddingBottom:4 }} />
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar preferencias" />
              </div>
            )}

            {/* ── ACCESSIBILITY ── */}
            {activeSection === "accessibility" && (
              <div>
                <SectionCard title="Tamaño de Texto" icon={<FileText size={15} color="white" />}>
                  <div style={{ paddingTop:14, paddingBottom:14 }}>
                    <PillSelect
                      options={[{ v:"small", l:"Pequeño" }, { v:"medium", l:"Mediano" }, { v:"large", l:"Grande" }, { v:"extra-large", l:"XL" }]}
                      value={settings.accessibility.textSize}
                      onChange={v => updateSettings({ accessibility: { ...settings.accessibility, textSize:v as TextSize } })}
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Modo de Contraste" icon={<Contrast size={15} color="white" />}>
                  <div style={{ paddingTop:14, paddingBottom:14 }}>
                    <PillSelect
                      options={[{ v:"normal", l:"Normal" }, { v:"high", l:"Alto Contraste" }]}
                      value={settings.accessibility.contrastMode}
                      onChange={v => updateSettings({ accessibility: { ...settings.accessibility, contrastMode:v as ContrastMode } })}
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Otras opciones" icon={<Eye size={15} color="white" />}>
                  <ToggleRow label="Reducir Movimiento" desc="Minimizar animaciones y efectos"
                    checked={settings.accessibility.reducedMotion}
                    onChange={v => updateSettings({ accessibility: { ...settings.accessibility, reducedMotion:v } })}
                  />
                  <ToggleRow label="Optimizar para Lector de Pantalla" desc="Mejora la experiencia con lectores de pantalla"
                    checked={settings.accessibility.screenReaderOptimized}
                    onChange={v => updateSettings({ accessibility: { ...settings.accessibility, screenReaderOptimized:v } })}
                  />
                  <ToggleRow label="Navegación por Teclado" desc="Mejorar la navegación con teclado"
                    checked={settings.accessibility.keyboardNavigation}
                    onChange={v => updateSettings({ accessibility: { ...settings.accessibility, keyboardNavigation:v } })}
                  />
                  <div style={{ paddingBottom:4 }} />
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar accesibilidad" />
              </div>
            )}

            {/* ── BIZEN CARD CUSTOMIZATION ── */}
            {activeSection === "card" && (
              <div style={{ animation: "fadeUp .4s ease both" }}>
                {/* Real-time Preview Area */}
                <div style={{ 
                  marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center",
                  background: "rgba(0,0,0,0.02)", borderRadius: C.rLg, padding: "32px 20px",
                  border: `1px dashed ${C.border}`
                }}>
                  <div style={{ 
                    fontSize: 11, fontWeight: 700, color: C.textMuted, 
                    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 
                  }}>
                    Vista previa en tiempo real
                  </div>
                  <div style={{ width: "100%", maxWidth: 440 }}>
                    <BizenVirtualCard 
                      bizcoins={dbProfile?.bizcoins || 0}
                      holderName={fullName || dbProfile?.fullName || "Usuario BIZEN"}
                      colorTheme={cardTheme}
                      level={dbProfile?.level || 1}
                      pattern={settings.cardCustomizations?.pattern || "none"}
                      showBillySticker={settings.cardCustomizations?.showBillySticker || false}
                      hideButtons={true}
                    />
                  </div>
                </div>

                <SectionCard title="Tema de Color" icon={<Sparkles size={15} color="white" />}>
                  <div style={{ paddingTop: 14, paddingBottom: 14 }}>
                    <FieldLabel>Elige la personalidad de tu tarjeta</FieldLabel>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                      {(["blue", "emerald", "violet", "rose", "amber", "slate", "obsidian"] as CardTheme[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setCardTheme(t)}
                          style={{
                            width: 38, height: 38, borderRadius: "50%",
                            border: `3px solid ${cardTheme === t ? C.blue : "transparent"}`,
                            padding: 2, cursor: "pointer", background: "none", transition: "all .2s",
                            boxShadow: cardTheme === t ? `0 4px 12px ${C.blue}40` : "none"
                          }}
                        >
                          <div style={{ 
                            width: "100%", height: "100%", borderRadius: "50%", 
                            background: t === "obsidian" ? "#000" : t === "blue" ? "#0F62FE" : t === "emerald" ? "#10B981" : t === "violet" ? "#8B5CF6" : t === "rose" ? "#F43F5E" : t === "amber" ? "#F59E0B" : "#64748B"
                          }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Efectos Visuales" icon={<Award size={15} color="white" />}>
                  <div style={{ paddingTop: 14 }}>
                    <FieldLabel>Patrón de fondo</FieldLabel>
                    <PillSelect 
                      options={[
                        { v: "none", l: "Estándar" },
                        { v: "geometric", l: "Geométrico" },
                        { v: "circuit", l: "Tech Circuit" }
                      ]}
                      value={settings.cardCustomizations?.pattern || "none"}
                      onChange={v => updateSettings({ cardCustomizations: { ...settings.cardCustomizations, pattern: v as any } })}
                    />
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <ToggleRow 
                      label="Sello Billy Premium"
                      desc="Añade un sticker holográfico exclusivo de Billy"
                      checked={settings.cardCustomizations?.showBillySticker || false}
                      onChange={v => updateSettings({ cardCustomizations: { ...settings.cardCustomizations, showBillySticker: v } })}
                    />
                  </div>
                  <div style={{ paddingBottom: 8 }} />
                </SectionCard>

                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
                  <SaveBtn onClick={saveProfile} loading={saving} label="Guardar diseño de tarjeta" />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Reset Modal ── */}
      {showResetConfirm && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(15,23,42,.45)",
          backdropFilter:"blur(6px)", display:"flex", alignItems:"center",
          justifyContent:"center", zIndex:9999, padding:24
        }}>
          <div style={{
            background:C.surface, borderRadius:C.rLg, padding:"36px",
            maxWidth:380, width:"100%",
            boxShadow:"0 24px 64px rgba(0,0,0,.18)", border:`1px solid ${C.border}`,
            animation:"scaleIn .25s ease both"
          }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:C.redAlpha, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <AlertTriangle size={24} color={C.red} />
              </div>
            </div>
            <h3 style={{ margin:"0 0 8px", fontSize:17, fontWeight:500, color:C.text, textAlign:"center" }}>
              ¿Restaurar configuración?
            </h3>
            <p style={{ margin:"0 0 24px", fontSize:13, color:C.textMuted, lineHeight:1.6, textAlign:"center" }}>
              Esto restablecerá todas tus preferencias a los valores predeterminados.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{
                  flex:1, padding:"11px", background:C.surfaceAlt,
                  border:`1px solid ${C.border}`, borderRadius:C.rSm,
                  color:C.textMid, fontSize:13, fontWeight:500, cursor:"pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  resetSettings(); setShowResetConfirm(false)
                  await syncToDB({ settings: {} })
                  flash(true, "Configuración restaurada")
                }}
                style={{
                  flex:1, padding:"11px", background:C.red, border:"none",
                  borderRadius:C.rSm, color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer",
                }}
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{
        flex:1, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:13, fontWeight:500, color:"#0F62FE", background:"#F4F6F9"
      }}>
        Cargando configuración...
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
