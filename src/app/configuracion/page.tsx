"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSettings, Language, Theme, TextSize, ContrastMode } from "@/contexts/SettingsContext"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import {
  SettingsIcon, UserIcon, BellIcon, ShieldIcon, TVIcon, LinkIcon,
  AccessibilityIcon, SpainIcon, USIcon, SunIcon, MoonIcon, AutoIcon,
  StarIcon, CheckIcon, CrossIcon, WarningIcon, ResetIcon
} from "@/components/CustomIcons"

export const dynamic = 'force-dynamic'

// ─── Custom Toggle ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} aria-checked={checked} role="switch"
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", width: 50, height: 27,
        borderRadius: 999, border: "none", cursor: "pointer", flexShrink: 0, outline: "none",
        background: checked ? "#0B71FE" : "#D1D5DB", transition: "background .2s",
        boxShadow: checked ? "0 0 0 3px rgba(11,113,254,.18)" : "none"
      }}>
      <span style={{
        position: "absolute", left: checked ? 25 : 3, width: 21, height: 21,
        borderRadius: "50%", background: "#FBFAF5", transition: "left .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)"
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
      justifyContent: "space-between", padding: "14px 18px", background: "#FBFAF5",
      borderRadius: 12, border: "1.5px solid #EEF2FF", marginBottom: 10, gap: 16, cursor: "pointer",
      transition: "background .15s"
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "#EFF4FF")}
      onMouseLeave={e => (e.currentTarget.style.background = "#F8FAFF")}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ─── Section card header ──────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: "#0F172A",
      display: "flex", alignItems: "center", gap: 10
    }}>{children}</h2>
  )
}

// ─── Pill select (Language / Difficulty / TextSize / Contrast) ───────────────
function PillSelect({ options, value, onChange }: {
  options: { v: string; l: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(({ v, l }) => (
        <button key={v} onClick={() => onChange(v)} style={{
          padding: "9px 18px", borderRadius: 999,
          border: `2px solid ${value === v ? "#0B71FE" : "#E2E8F0"}`,
          background: value === v ? "#0B71FE" : "#fff",
          color: value === v ? "#fff" : "#64748B",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Inter','Montserrat',sans-serif", transition: "all .2s"
        }}>
          {l}
        </button>
      ))}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
function SettingsContent() {
  const router = useRouter()
  const { user, dbProfile } = useAuth()
  const { settings, updateSettings, resetSettings } = useSettings()
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientMicrocred> | null>(null)
  const [activeSection, setActiveSection] = useState("general")
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showPwFields, setShowPwFields] = useState(false)
  const [pw, setPw] = useState({ new: "", confirm: "" })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null)
  const [phone, setPhone] = useState("")
  const [plan, setPlan] = useState<"gratuito" | "estudiante" | "premium">("gratuito")

  useEffect(() => { setSupabase(createClientMicrocred()) }, [])
  useEffect(() => { if (user) { setPhone(user.user_metadata?.phone || ""); setPlan(user.user_metadata?.plan || "gratuito") } }, [user])
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
  const savePhone = () => doSave(async () => {
    const { error } = await supabase!.auth.updateUser({ data: { phone } })
    if (error) throw error
  })
  const savePlan = (p: "gratuito" | "estudiante" | "premium") => doSave(async () => {
    const { error } = await supabase!.auth.updateUser({ data: { plan: p } })
    if (error) throw error; setPlan(p)
  })

  const nav = [
    { id: "general", label: "General", icon: <SettingsIcon size={18} /> },
    { id: "account", label: "Cuenta", icon: <UserIcon size={18} /> },
    ...(!isAdmin ? [
      { id: "notifications", label: "Notificaciones", icon: <BellIcon size={18} /> },
      { id: "privacy", label: "Privacidad", icon: <ShieldIcon size={18} /> },
      { id: "content", label: "Contenido", icon: <TVIcon size={18} /> },
      { id: "accounts", label: "Cuentas Vinculadas", icon: <LinkIcon size={18} /> },
    ] : []),
    { id: "accessibility", label: "Accesibilidad", icon: <AccessibilityIcon size={18} /> },
  ]

  // ── Field style helpers
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", fontSize: 14, fontWeight: 600,
    border: "2px solid #E2E8F0", borderRadius: 10, background: "#FBFAF5",
    color: "#0F172A", fontFamily: "'Inter','Montserrat',sans-serif",
    outline: "none", boxSizing: "border-box", transition: "border-color .15s"
  }
  const btnPrimary: React.CSSProperties = {
    padding: "11px 22px", background: "#0B71FE", border: "none", borderRadius: 10,
    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Inter','Montserrat',sans-serif", transition: "opacity .15s",
    opacity: saving ? .6 : 1
  }
  const btnGhost: React.CSSProperties = {
    padding: "11px 22px", background: "#F1F5F9", border: "1.5px solid #E2E8F0",
    borderRadius: 10, color: "#374151", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Inter','Montserrat',sans-serif"
  }

  return (
    <div className="cfg-root-container" style={{
      width: "100%", background: "#FBFAF5", minHeight: "100vh",
      fontFamily: "'Inter','Montserrat',sans-serif", boxSizing: "border-box"
    }}>

      {/* ── Page header (blue stripe) */}
      <div style={{
        background: "linear-gradient(135deg,#0B71FE 0%,#4F46E5 100%)",
        padding: "32px 32px 56px", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(255,255,255,.07)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: "35%", width: 260, height: 260,
          borderRadius: "50%", background: "rgba(255,255,255,.05)", pointerEvents: "none"
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{
            margin: "0 0 6px", fontSize: "clamp(24px,4vw,34px)", fontWeight: 900,
            color: "#fff", letterSpacing: -.5
          }}>Configuración</h1>
          <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,.75)", fontWeight: 600 }}>
            Personaliza tu experiencia en BIZEN
          </p>
          <div style={{
            marginTop: 18, display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)",
            border: "1.5px solid rgba(255,255,255,.25)", borderRadius: 40, padding: "8px 18px"
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg,#60A5FA,#A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#fff"
            }}>
              {(user.email || "?")[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{user.email}</span>
            <span style={{
              fontSize: 11, color: "rgba(255,255,255,.8)", background: "rgba(255,255,255,.2)",
              padding: "2px 10px", borderRadius: 20, fontWeight: 700, textTransform: "uppercase"
            }}>
              {dbProfile?.role || "Estudiante"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Two-column layout: sidebar + content */}
      <div className="cfg-body" style={{
        display: "grid", gridTemplateColumns: "220px 1fr",
        gap: 24, padding: "0 24px 60px", marginTop: -24, position: "relative", zIndex: 2
      }}>

        {/* Sidebar */}
        <div style={{
          background: "#FBFAF5", borderRadius: 16, padding: 14,
          boxShadow: "0 4px 20px rgba(11,113,254,.08)", border: "1.5px solid #EEF2FF",
          height: "fit-content", position: "sticky", top: 16, alignSelf: "start"
        }}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: 1.5,
            padding: "0 6px 10px", borderBottom: "1.5px solid #F0F4FF",
            marginBottom: 8, textTransform: "uppercase"
          }}>Configuración</div>
          {nav.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              width: "100%", padding: "10px 12px", textAlign: "left", display: "flex",
              alignItems: "center", gap: 10, borderRadius: 10, border: "none",
              fontFamily: "'Inter','Montserrat',sans-serif",
              background: activeSection === s.id ? "#EFF6FF" : "transparent",
              color: activeSection === s.id ? "#0B71FE" : "#4B5563",
              fontSize: 14, fontWeight: activeSection === s.id ? 700 : 600,
              cursor: "pointer", transition: "all .15s", marginBottom: 2,
              borderLeft: activeSection === s.id ? "3px solid #0B71FE" : "3px solid transparent"
            }}
              onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.background = "#F8FAFF" }}
              onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.background = "transparent" }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
          <div style={{ borderTop: "1.5px solid #F0F4FF", marginTop: 10, paddingTop: 10 }}>
            <button onClick={() => setShowResetConfirm(true)} style={{
              width: "100%",
              padding: "9px 12px", background: "#FEF2F2", border: "1.5px solid #FECACA",
              borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
              color: "#EF4444", fontFamily: "'Inter','Montserrat',sans-serif",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <ResetIcon size={14} color="#EF4444" /> Restaurar defaults
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div style={{
          background: "#FBFAF5", borderRadius: 16, padding: "28px 32px",
          boxShadow: "0 4px 20px rgba(11,113,254,.08)", border: "1.5px solid #EEF2FF",
          minWidth: 0
        }}>

          {/* Toast */}
          {toast && (
            <div style={{
              marginBottom: 18, padding: "12px 18px", borderRadius: 12,
              display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700,
              background: toast.ok ? "#F0FDF4" : "#FEF2F2",
              border: `1.5px solid ${toast.ok ? "#86EFAC" : "#FECACA"}`,
              color: toast.ok ? "#15803D" : "#DC2626"
            }}>
              {toast.ok ? <CheckIcon size={18} color="#15803D" /> : <CrossIcon size={18} color="#DC2626" />} {toast.msg}
            </div>
          )}

          {/* ── GENERAL */}
          {activeSection === "general" && (<div>
            <SectionHeading><SettingsIcon size={20} style={{ marginRight: 8 }} /> General</SectionHeading>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                textTransform: "uppercase", marginBottom: 10
              }}>Idioma / Language</div>
              <PillSelect
                options={[{ v: "es", l: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><SpainIcon size={16} /> Español</span> as any }, { v: "en", l: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><USIcon size={16} /> English</span> as any }]}
                value={settings.language} onChange={v => updateSettings({ language: v as Language })} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                textTransform: "uppercase", marginBottom: 10
              }}>Tema Visual</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { v: "light", l: "Claro", icon: <SunIcon size={16} /> },
                  { v: "dark", l: "Oscuro", icon: <MoonIcon size={16} /> },
                  { v: "auto", l: "Auto", icon: <AutoIcon size={16} /> }
                ].map(({ v, l, icon }) => (
                  <div key={v} onClick={() => updateSettings({ theme: v as Theme })} style={{
                    flex: 1, padding: "14px 10px", textAlign: "center", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${settings.theme === v ? "#0B71FE" : "#E2E8F0"}`,
                    background: settings.theme === v ? "#EFF6FF" : "#F8FAFF", transition: "all .2s",
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                  }}>
                    <div style={{ color: settings.theme === v ? "#0B71FE" : "#94A3B8" }}>{icon}</div>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: settings.theme === v ? "#0B71FE" : "#64748B"
                    }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <ToggleRow label="Efectos de Sonido" desc="Activar efectos de sonido en la app"
              checked={settings.soundsEnabled} onChange={v => updateSettings({ soundsEnabled: v })} />
            <ToggleRow label="Animaciones" desc="Mostrar animaciones y transiciones"
              checked={settings.animationsEnabled} onChange={v => updateSettings({ animationsEnabled: v })} />
          </div>)}

          {/* ── ACCOUNT */}
          {activeSection === "account" && user && (<div>
            <SectionHeading><UserIcon size={20} style={{ marginRight: 8 }} /> Mi Cuenta</SectionHeading>

            {/* Email */}
            <div style={{
              background: "#FBFAF5", borderRadius: 12, padding: "14px 18px",
              border: "1.5px solid #EEF2FF", marginBottom: 14, display: "flex",
              alignItems: "center", gap: 12
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                  textTransform: "uppercase", marginBottom: 4
                }}>Correo electrónico</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{user.email}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 800, color: "#15803D", background: "#F0FDF4",
                border: "1.5px solid #86EFAC", padding: "3px 10px", borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 4
              }}><CheckIcon size={12} /> Verificado</span>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                textTransform: "uppercase", marginBottom: 8
              }}>Teléfono</div>
              <div style={{ display: "flex", gap: 10 }}>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+52 123 456 7890" style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#0B71FE"; e.currentTarget.style.background = "#fff" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#F8FAFF" }} />
                <button onClick={savePhone} disabled={saving} style={btnPrimary}>
                  {saving ? "..." : "Guardar"}
                </button>
              </div>
            </div>

            {/* Password */}
            <div style={{
              background: "#FBFAF5", borderRadius: 12, padding: "16px 18px",
              border: "1.5px solid #EEF2FF", marginBottom: 20
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: showPwFields ? 14 : 0
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Contraseña</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Seguridad de tu cuenta</div>
                </div>
                <button onClick={() => { setShowPwFields(!showPwFields); setPw({ new: "", confirm: "" }) }}
                  style={btnGhost}>{showPwFields ? "Cancelar" : "Cambiar"}</button>
              </div>
              {showPwFields && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input type="password" value={pw.new} onChange={e => setPw({ ...pw, new: e.target.value })}
                    placeholder="Nueva contraseña (mín. 6 caracteres)" style={{ ...inputStyle, background: "#FBFAF5" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#0B71FE"}
                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />
                  <input type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })}
                    placeholder="Confirmar nueva contraseña" style={{ ...inputStyle, background: "#FBFAF5" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#0B71FE"}
                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />
                  <button onClick={savePw} disabled={saving}
                    style={{ ...btnPrimary, padding: "12px", textAlign: "center" as const }}>
                    {saving ? "Guardando..." : "Actualizar Contraseña"}
                  </button>
                </div>
              )}
            </div>

            {/* Plans */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                textTransform: "uppercase", marginBottom: 12
              }}>Plan de Suscripción</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([
                  { id: "gratuito", l: "Plan Gratuito", d: "Acceso a todos los cursos básicos", c: "#10B981" },
                  { id: "estudiante", l: "Plan Estudiante", d: "Herramientas adicionales para estudiantes", c: "#0B71FE" },
                  { id: "premium", l: "Plan Premium", d: "Acceso completo + certificados + soporte prioritario", c: "#F59E0B", icon: true },
                ] as { id: "gratuito" | "estudiante" | "premium", l: string, d: string, c: string, icon?: boolean }[]).map(({ id, l, d, c, icon }) => (
                  <div key={id} onClick={() => savePlan(id)} style={{
                    padding: "14px 18px", borderRadius: 12, cursor: "pointer", transition: "all .2s",
                    border: `2px solid ${plan === id ? c : "#E2E8F0"}`,
                    background: plan === id ? `${c}12` : "#F8FAFF",
                    display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: plan === id ? c : "#0F172A", display: 'flex', alignItems: 'center', gap: 6 }}>
                        {l} {icon && <StarIcon size={14} color={c} fill={c} />}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{d}</div>
                    </div>
                    {plan === id && <span style={{
                      fontSize: 11, fontWeight: 800, color: c,
                      background: `${c}20`, padding: "3px 12px", borderRadius: 20
                    }}>ACTIVO</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Meta info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { l: "Cuenta creada", v: new Date(user.created_at || Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { l: "Método de acceso", v: "Email y Contraseña" },
              ].map(({ l, v }) => (
                <div key={l} style={{
                  background: "#FBFAF5", borderRadius: 12, padding: "14px 16px",
                  border: "1.5px solid #EEF2FF"
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                    textTransform: "uppercase", marginBottom: 4
                  }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Logout */}
            <div style={{
              background: "#FEF2F2", borderRadius: 12, padding: "16px 18px",
              border: "1.5px solid #FECACA"
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Cerrar Sesión</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>
                Cierra tu sesión de forma segura en este dispositivo.
              </div>
              <button disabled={saving} onClick={async () => {
                if (!supabase) return; setSaving(true)
                try { await supabase.auth.signOut(); router.push("/login") }
                catch (e) { flash(false, "Error al cerrar sesión") } finally { setSaving(false) }
              }} style={{
                padding: "11px 26px", background: "#EF4444", border: "none", borderRadius: 10,
                color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Inter','Montserrat',sans-serif", opacity: saving ? .6 : 1
              }}>
                {saving ? "Saliendo..." : "Cerrar Sesión"}
              </button>
            </div>
          </div>)}

          {/* ── NOTIFICATIONS */}
          {activeSection === "notifications" && (<div>
            <SectionHeading><BellIcon size={20} style={{ marginRight: 8 }} /> Notificaciones</SectionHeading>
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
          </div>)}

          {/* ── PRIVACY */}
          {activeSection === "privacy" && (<div>
            <SectionHeading><ShieldIcon size={20} style={{ marginRight: 8 }} /> Privacidad</SectionHeading>
            {[
              { k: "profileVisibility", l: "Visibilidad del Perfil" },
              { k: "activityVisibility", l: "Visibilidad de Actividad" },
            ].map(({ k, l }) => (
              <div key={k} style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                  textTransform: "uppercase", marginBottom: 8
                }}>{l}</div>
                <select value={(settings.privacy as any)[k]}
                  onChange={e => updateSettings({ privacy: { ...settings.privacy, [k]: e.target.value as any } })}
                  style={{ ...inputStyle, maxWidth: 280, cursor: "pointer" }}>
                  <option value="public">Público</option>
                  <option value="friends">Solo amigos</option>
                  <option value="private">Privado</option>
                </select>
              </div>
            ))}
            <ToggleRow label="Mostrar Progreso" desc="Permitir que otros vean tu progreso"
              checked={settings.privacy.showProgress}
              onChange={v => updateSettings({ privacy: { ...settings.privacy, showProgress: v } })} />
            <ToggleRow label="Permitir Mensajes" desc="Recibir mensajes directos de otros usuarios"
              checked={settings.privacy.allowMessages}
              onChange={v => updateSettings({ privacy: { ...settings.privacy, allowMessages: v } })} />
          </div>)}

          {/* ── CONTENT */}
          {activeSection === "content" && (<div>
            <SectionHeading><TVIcon size={20} style={{ marginRight: 8 }} /> Contenido</SectionHeading>
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                textTransform: "uppercase", marginBottom: 10
              }}>Nivel de Dificultad</div>
              <PillSelect
                options={[{ v: "beginner", l: "Principiante" }, { v: "intermediate", l: "Intermedio" }, { v: "advanced", l: "Avanzado" }]}
                value={settings.contentPreferences.difficultyLevel}
                onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, difficultyLevel: v as any } })} />
            </div>
            <ToggleRow label="Subtítulos" desc="Activar subtítulos en videos"
              checked={settings.contentPreferences.showSubtitles}
              onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showSubtitles: v } })} />
            <ToggleRow label="Reproducción Automática" desc="Reproducir videos automáticamente"
              checked={settings.contentPreferences.autoplayVideos}
              onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, autoplayVideos: v } })} />
            <ToggleRow label="Mostrar Pistas" desc="Ver pistas durante los ejercicios"
              checked={settings.contentPreferences.showHints}
              onChange={v => updateSettings({ contentPreferences: { ...settings.contentPreferences, showHints: v } })} />
          </div>)}

          {/* ── LINKED ACCOUNTS */}
          {activeSection === "accounts" && (<div>
            <SectionHeading><LinkIcon size={20} style={{ marginRight: 8 }} /> Cuentas Vinculadas</SectionHeading>
            {([
              { p: "google" as const, l: "Google", color: "#EA4335", letter: "G" },
              { p: "facebook" as const, l: "Facebook", color: "#1877F2", letter: "f" },
              { p: "apple" as const, l: "Apple", color: "#111", letter: "" },
            ] as { p: 'google' | 'facebook' | 'apple', l: string, color: string, letter: string }[]).map(({ p, l, color, letter }) => (
              <div key={p} style={{
                display: "flex", alignItems: "center", padding: "14px 18px",
                background: "#FBFAF5", borderRadius: 12, border: "1.5px solid #EEF2FF", marginBottom: 10
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: `${color}15`,
                  border: `1.5px solid ${color}30`, display: "flex", alignItems: "center",
                  justifyContent: "center", marginRight: 14, fontSize: 16, fontWeight: 800,
                  color, fontFamily: "serif"
                }}>{letter}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{l}</div>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: settings.linkedAccounts[p] ? "#15803D" : "#94A3B8"
                  }}>
                    {settings.linkedAccounts[p] ? "Conectado" : "No conectado"}
                  </div>
                </div>
                <button onClick={() => {
                  if (settings.linkedAccounts[p]) {
                    updateSettings({ linkedAccounts: { ...settings.linkedAccounts, [p]: false } }); flash(true, `${l} desvinculado`)
                  } else {
                    updateSettings({ linkedAccounts: { ...settings.linkedAccounts, [p]: true } }); flash(true, `${l} vinculado`)
                  }
                }} style={{
                  padding: "8px 18px", borderRadius: 9,
                  border: `2px solid ${settings.linkedAccounts[p] ? "#FECACA" : "#0B71FE"}`,
                  background: settings.linkedAccounts[p] ? "#FEF2F2" : "transparent",
                  color: settings.linkedAccounts[p] ? "#EF4444" : "#0B71FE",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Inter','Montserrat',sans-serif"
                }}>
                  {settings.linkedAccounts[p] ? "Desvincular" : "Vincular"}
                </button>
              </div>
            ))}
          </div>)}

          {/* ── ACCESSIBILITY */}
          {activeSection === "accessibility" && (<div>
            <SectionHeading><AccessibilityIcon size={20} style={{ marginRight: 8 }} /> Accesibilidad</SectionHeading>
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                textTransform: "uppercase", marginBottom: 10
              }}>Tamaño de Texto</div>
              <PillSelect
                options={[{ v: "small", l: "Pequeño" }, { v: "medium", l: "Mediano" }, { v: "large", l: "Grande" }, { v: "extra-large", l: "XL" }]}
                value={settings.accessibility.textSize}
                onChange={v => updateSettings({ accessibility: { ...settings.accessibility, textSize: v as TextSize } })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "#94A3B8", letterSpacing: 1,
                textTransform: "uppercase", marginBottom: 10
              }}>Modo de Contraste</div>
              <PillSelect
                options={[{ v: "normal", l: "Normal" }, { v: "high", l: "Alto Contraste" }]}
                value={settings.accessibility.contrastMode}
                onChange={v => updateSettings({ accessibility: { ...settings.accessibility, contrastMode: v as ContrastMode } })} />
            </div>
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
          </div>)}

        </div>{/* /content panel */}
      </div>{/* /cfg-body */}

      {/* ── Reset Modal */}
      {showResetConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,.6)",
          backdropFilter: "blur(5px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999, padding: 24
        }}>
          <div style={{
            background: "#FBFAF5", borderRadius: 20, padding: 36, maxWidth: 420,
            width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,.2)"
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#FEF2F2',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <WarningIcon size={32} color="#EF4444" />
              </div>
            </div>
            <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#0F172A" }}>
              ¿Restaurar configuración?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
              Esto restablecerá todas tus preferencias a los valores predeterminados.
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowResetConfirm(false)}
                style={{ ...btnGhost, flex: 1, padding: "13px", textAlign: "center" as const }}>
                Cancelar
              </button>
              <button onClick={() => { resetSettings(); setShowResetConfirm(false); flash(true, "Configuración restaurada") }}
                style={{
                  flex: 1, padding: "13px", background: "#EF4444", border: "none",
                  borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Inter','Montserrat',sans-serif"
                }}>
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Mobile */
        @media (max-width: 767px) {
          .cfg-body {
            grid-template-columns: 1fr !important;
            padding: 0 12px 80px !important;
            margin-top: -12px !important;
          }
          .cfg-body > div:first-child {
            position: relative !important;
            top: auto !important;
          }
          .cfg-root-container { padding-left: 0 !important; }
        }
        
        /* Tablet – app-main padding seems unreliable, applying directly to container */
        @media (min-width: 768px) and (max-width: 1160px) {
          .cfg-root-container { padding-left: 220px !important; }
          .cfg-body { padding: 0 20px 60px !important; }
        }
        
        /* Desktop – app-main padding seems unreliable, applying directly to container */
        @media (min-width: 1161px) {
          .cfg-root-container { padding-left: 280px !important; }
          .cfg-body { padding: 0 28px 60px !important; }
        }
        select { -webkit-appearance: none; appearance: none; }
      `}</style>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 700, color: "#0B71FE",
        background: "#FBFAF5"
      }}>
        Cargando configuración...
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
