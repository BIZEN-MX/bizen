"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSettings, Language, Theme, TextSize, ContrastMode } from "@/contexts/SettingsContext"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

function SettingsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { settings, updateSettings, resetSettings } = useSettings()
  const supabase = createClientMicrocred()
  const [activeSection, setActiveSection] = useState<string>("general")
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
  // Account page state
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<"gratuito" | "estudiante" | "premium">("gratuito")

  useEffect(() => {
    // Set blue gradient background for this page
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      bodyEl.style.backgroundAttachment = "fixed"
    }
    return () => {
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  // Load account data
  useEffect(() => {
    if (user) {
      setPhoneNumber(user.user_metadata?.phone || "")
      setSelectedPlan(user.user_metadata?.plan || "gratuito")
    }
  }, [user])

  if (!user) {
    router.push("/login")
    return null
  }

  // Translations
  const t = {
    es: {
      backButton: "← Volver",
      title: "Configuración",
      subtitle: "Personaliza tu experiencia en BIZEN",
      sections: {
        general: "General",
        account: "Cuenta",
        notifications: "Notificaciones",
        privacy: "Privacidad",
        content: "Contenido",
        accounts: "Cuentas Vinculadas",
        accessibility: "Accesibilidad"
      },
      general: {
        language: "Idioma / Language",
        sounds: "Sonidos",
        soundsDesc: "Activar efectos de sonido en la aplicación",
        animations: "Animaciones",
        animationsDesc: "Mostrar animaciones y transiciones"
      },
      notifications: {
        push: "Notificaciones Push",
        pushDesc: "Recibir notificaciones en el dispositivo",
        email: "Correo Electrónico",
        emailDesc: "Recibir notificaciones por email",
        sound: "Sonido de Notificaciones",
        soundDesc: "Reproducir sonido al recibir notificaciones",
        courseUpdates: "Actualizaciones de Cursos",
        courseUpdatesDesc: "Nuevo contenido en tus cursos",
        achievements: "Logros",
        achievementsDesc: "Cuando obtienes un nuevo logro",
        reminders: "Recordatorios",
        remindersDesc: "Recordatorios de estudio"
      },
      privacy: {
        profileVisibility: "Visibilidad del Perfil",
        activityVisibility: "Visibilidad de Actividad",
        showProgress: "Mostrar Progreso",
        showProgressDesc: "Permitir que otros vean tu progreso de aprendizaje",
        allowMessages: "Permitir Mensajes",
        allowMessagesDesc: "Recibir mensajes directos de otros usuarios",
        public: "Público",
        friends: "Solo Amigos",
        private: "Privado"
      },
      content: {
        showSubtitles: "Mostrar Subtítulos",
        showSubtitlesDesc: "Activar subtítulos en videos",
        autoplayVideos: "Reproducción Automática",
        autoplayVideosDesc: "Reproducir videos automáticamente",
        difficultyLevel: "Nivel de Dificultad Preferido",
        beginner: "Principiante",
        intermediate: "Intermedio",
        advanced: "Avanzado",
        showHints: "Mostrar Pistas",
        showHintsDesc: "Ver pistas y ayuda durante los ejercicios"
      },
      accounts: {
        google: "Google",
        facebook: "Facebook",
        apple: "Apple",
        connected: "Conectado",
        notConnected: "No conectado",
        link: "Vincular",
        unlink: "Desvincular",
        linkAlert: "Vinculación con",
        linkAlertEnd: "iniciada. Esta función requiere OAuth configurado.",
        unlinkConfirm: "¿Desvincular cuenta de"
      },
      accessibility: {
        textSize: "Tamaño de Texto",
        small: "Pequeño",
        medium: "Mediano",
        large: "Grande",
        extraLarge: "Extra Grande",
        contrastMode: "Modo de Contraste",
        normal: "Normal",
        highContrast: "Alto Contraste",
        reducedMotion: "Reducir Movimiento",
        reducedMotionDesc: "Minimizar animaciones y efectos de movimiento",
        screenReader: "Optimizado para Lector de Pantalla",
        screenReaderDesc: "Mejorar experiencia con lectores de pantalla",
        keyboardNav: "Navegación por Teclado",
        keyboardNavDesc: "Mejorar navegación con teclado"
      },
      reset: {
        button: "Restaurar Configuración Predeterminada",
        title: "¿Restaurar Configuración?",
        message: "Esto restablecerá todas tus preferencias a los valores predeterminados. Esta acción no se puede deshacer.",
        cancel: "Cancelar",
        confirm: "Restaurar"
      }
    },
    en: {
      backButton: "← Back",
      title: "Settings",
      subtitle: "Customize your BIZEN experience",
      sections: {
        general: "General",
        account: "Account",
        notifications: "Notifications",
        privacy: "Privacy",
        content: "Content",
        accounts: "Linked Accounts",
        accessibility: "Accessibility"
      },
      general: {
        language: "Language / Idioma",
        sounds: "Sounds",
        soundsDesc: "Enable sound effects in the app",
        animations: "Animations",
        animationsDesc: "Show animations and transitions"
      },
      notifications: {
        push: "Push Notifications",
        pushDesc: "Receive notifications on device",
        email: "Email",
        emailDesc: "Receive email notifications",
        sound: "Notification Sound",
        soundDesc: "Play sound when receiving notifications",
        courseUpdates: "Course Updates",
        courseUpdatesDesc: "New content in your courses",
        achievements: "Achievements",
        achievementsDesc: "When you earn a new achievement",
        reminders: "Reminders",
        remindersDesc: "Study reminders"
      },
      privacy: {
        profileVisibility: "Profile Visibility",
        activityVisibility: "Activity Visibility",
        showProgress: "Show Progress",
        showProgressDesc: "Allow others to see your learning progress",
        allowMessages: "Allow Messages",
        allowMessagesDesc: "Receive direct messages from other users",
        public: "Public",
        friends: "Friends Only",
        private: "Private"
      },
      content: {
        showSubtitles: "Show Subtitles",
        showSubtitlesDesc: "Enable subtitles in videos",
        autoplayVideos: "Autoplay Videos",
        autoplayVideosDesc: "Play videos automatically",
        difficultyLevel: "Preferred Difficulty Level",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        showHints: "Show Hints",
        showHintsDesc: "View hints and help during exercises"
      },
      accounts: {
        google: "Google",
        facebook: "Facebook",
        apple: "Apple",
        connected: "Connected",
        notConnected: "Not connected",
        link: "Link",
        unlink: "Unlink",
        linkAlert: "Linking with",
        linkAlertEnd: "initiated. This feature requires OAuth configuration.",
        unlinkConfirm: "Unlink account from"
      },
      accessibility: {
        textSize: "Text Size",
        small: "Small",
        medium: "Medium",
        large: "Large",
        extraLarge: "Extra Large",
        contrastMode: "Contrast Mode",
        normal: "Normal",
        highContrast: "High Contrast",
        reducedMotion: "Reduce Motion",
        reducedMotionDesc: "Minimize animations and motion effects",
        screenReader: "Screen Reader Optimized",
        screenReaderDesc: "Improve experience with screen readers",
        keyboardNav: "Keyboard Navigation",
        keyboardNavDesc: "Improve keyboard navigation"
      },
      reset: {
        button: "Reset to Default Settings",
        title: "Reset Settings?",
        message: "This will reset all your preferences to default values. This action cannot be undone.",
        cancel: "Cancel",
        confirm: "Reset"
      }
    }
  }

  const currentLang = t[settings.language]

  const sections = [
    { id: "general", name: currentLang.sections.general, icon: "" },
    { id: "account", name: currentLang.sections.account, icon: "" },
    { id: "notifications", name: currentLang.sections.notifications, icon: "" },
    { id: "privacy", name: currentLang.sections.privacy, icon: "" },
    { id: "content", name: currentLang.sections.content, icon: "" },
    { id: "accounts", name: currentLang.sections.accounts, icon: "" },
    { id: "accessibility", name: currentLang.sections.accessibility, icon: "" },
  ]

  // Account page functions
  const handlePasswordChange = async () => {
    if (!passwords.new || !passwords.confirm) {
      setSaveError("Por favor completa todos los campos")
      return
    }

    if (passwords.new !== passwords.confirm) {
      setSaveError("Las contraseñas no coinciden")
      return
    }

    if (passwords.new.length < 6) {
      setSaveError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      setSaveSuccess("Contraseña actualizada exitosamente")
      setPasswords({ current: "", new: "", confirm: "" })
      setShowPasswordFields(false)

      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error updating password:", error)
      setSaveError(error.message || "Error al actualizar contraseña")
    } finally {
      setSaving(false)
    }
  }

  const handlePhoneUpdate = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          phone: phoneNumber
        }
      })

      if (error) throw error

      setSaveSuccess("Teléfono actualizado exitosamente")
      
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error updating phone:", error)
      setSaveError(error.message || "Error al actualizar teléfono")
    } finally {
      setSaving(false)
    }
  }

  const handlePlanUpdate = async (plan: "gratuito" | "estudiante" | "premium") => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          plan: plan
        }
      })

      if (error) throw error

      setSelectedPlan(plan)
      setSaveSuccess("Plan actualizado exitosamente")
      
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error updating plan:", error)
      setSaveError(error.message || "Error al actualizar plan")
    } finally {
      setSaving(false)
    }
  }

  const handleLinkAccount = async (provider: 'google' | 'facebook' | 'apple') => {
    // Simulate account linking
    alert(`${currentLang.accounts.linkAlert} ${provider} ${currentLang.accounts.linkAlertEnd}`)
    updateSettings({
      linkedAccounts: {
        ...settings.linkedAccounts,
        [provider]: true
      }
    })
  }

  const handleUnlinkAccount = (provider: 'google' | 'facebook' | 'apple') => {
    if (confirm(`${currentLang.accounts.unlinkConfirm} ${provider}?`)) {
      updateSettings({
        linkedAccounts: {
          ...settings.linkedAccounts,
          [provider]: false
        }
      })
    }
  }

  return (
    <div className="settings-container" style={{
      position: "relative",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed",
      fontFamily: "'Feather Bold', 'Montserrat', sans-serif",
      padding: "40px",
      maxWidth: "100%",
      overflowX: "hidden",
      boxSizing: "border-box"
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: "fixed",
        top: "10%",
        left: "5%",
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "fixed",
        top: "60%",
        right: "8%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "fixed",
        bottom: "5%",
        left: "15%",
        width: 350,
        height: 350,
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        maxWidth: "100%",
        margin: "0",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            color: "#1E40AF",
            margin: "0 0 8px"
          }}>
            {currentLang.title}
          </h1>
          <p style={{
            fontSize: 16,
            color: "#374151",
            fontWeight: 600,
            margin: 0
          }}>
            {currentLang.subtitle}
          </p>
        </div>

        <div className="settings-grid" style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: 30
        }}>
          {/* Sidebar Navigation */}
          <div style={{
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            padding: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
            height: "fit-content",
            position: "sticky",
            top: 20
          }}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: activeSection === section.id ? "rgba(15, 98, 254, 0.15)" : "transparent",
                  border: "none",
                  borderRadius: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 14,
                  fontWeight: activeSection === section.id ? 700 : 600,
                  color: activeSection === section.id ? "#0F62FE" : "#6B7280",
                  fontFamily: "'Feather Bold', 'Montserrat', sans-serif"
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = "transparent"
                  }
                }}
              >
                <span style={{ fontSize: 20 }}>{section.icon}</span>
                {section.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            padding: 40,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
          }}>
            {/* Success/Error Messages */}
            {saveSuccess && (
              <div style={{
                marginBottom: 24,
                padding: "16px 20px",
                background: "rgba(16, 185, 129, 0.1)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(16, 185, 129, 0.3)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#065F46",
                fontWeight: 600,
                fontSize: 14
              }}>
                <span>✅</span>
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div style={{
                marginBottom: 24,
                padding: "16px 20px",
                background: "rgba(239, 68, 68, 0.1)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#991B1B",
                fontWeight: 600,
                fontSize: 14
              }}>
                <span>❌</span>
                <span>{saveError}</span>
              </div>
            )}

            {/* GENERAL SECTION */}
            {activeSection === "general" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E40AF", marginBottom: 24 }}>
                  {currentLang.sections.general}
                </h2>

                {/* Language */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 12 }}>
                    {currentLang.general.language}
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value as Language })}
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "2px solid #E5E7EB",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="es">🇪🇸 Español</option>
                    <option value="en">🇺🇸 English</option>
                  </select>
                </div>

                {/* Sounds */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.general.sounds}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.general.soundsDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.soundsEnabled}
                      onChange={(e) => updateSettings({ soundsEnabled: e.target.checked })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>

                {/* Animations */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.general.animations}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.general.animationsDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.animationsEnabled}
                      onChange={(e) => updateSettings({ animationsEnabled: e.target.checked })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* ACCOUNT SECTION */}
            {activeSection === "account" && user && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E40AF", marginBottom: 24 }}>
                  {currentLang.sections.account}
                </h2>

                {/* Account Credentials */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1E40AF",
                    marginBottom: 20
                  }}>
                    Credenciales de Cuenta
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Email Address */}
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        marginBottom: 8
                      }}>
                        Dirección de Email
                      </label>
                      <div style={{
                        padding: "14px 18px",
                        background: "rgba(255, 255, 255, 0.5)",
                        borderRadius: 12,
                        border: "2px solid rgba(147, 197, 253, 0.4)",
                        fontSize: 16,
                        color: "#1E40AF",
                        fontWeight: 600
                      }}>
                        {user.email}
                      </div>
                      <p style={{
                        margin: "6px 0 0",
                        fontSize: 12,
                        color: "#6B7280"
                      }}>
                        Tu email es tu identificador principal y no puede ser modificado
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        marginBottom: 8
                      }}>
                        Teléfono (Verificación)
                      </label>
                      <div style={{ display: "flex", gap: 12 }}>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+52 123 456 7890"
                          style={{
                            flex: 1,
                            padding: "14px 18px",
                            fontSize: 16,
                            border: "2px solid rgba(59, 130, 246, 0.3)",
                            borderRadius: 12,
                            background: "rgba(255, 255, 255, 0.7)",
                            color: "#1E40AF",
                            fontWeight: 600,
                            fontFamily: "'Feather Bold', 'Montserrat', sans-serif",
                            outline: "none",
                            transition: "all 0.2s ease",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#0F62FE"
                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.1)"
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"
                            e.currentTarget.style.boxShadow = "none"
                          }}
                        />
                        <button
                          onClick={handlePhoneUpdate}
                          disabled={saving}
                          style={{
                            padding: "14px 24px",
                            background: saving ? "#9CA3AF" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                            border: "none",
                            borderRadius: 12,
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: saving ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            fontFamily: "'Feather Bold', 'Montserrat', sans-serif",
                            whiteSpace: "nowrap"
                          }}
                          onMouseEnter={(e) => {
                            if (!saving) {
                              e.currentTarget.style.transform = "translateY(-2px)"
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "none"
                          }}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    {/* Change Password */}
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        marginBottom: 8
                      }}>
                        Contraseña
                      </label>
                      
                      {!showPasswordFields ? (
                        <button
                          onClick={() => setShowPasswordFields(true)}
                          style={{
                            width: "100%",
                            padding: "14px 24px",
                            background: "linear-gradient(135deg, #0F62FE 0%, #0353E9 100%)",
                            border: "none",
                            borderRadius: 12,
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            fontFamily: "'Feather Bold', 'Montserrat', sans-serif"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.4)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "none"
                          }}
                        >
                          Cambiar Contraseña
                        </button>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <input
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            placeholder="Nueva contraseña (mín. 6 caracteres)"
                            style={{
                              width: "100%",
                              padding: "14px 18px",
                              fontSize: 15,
                              border: "2px solid rgba(59, 130, 246, 0.3)",
                              borderRadius: 12,
                              background: "rgba(255, 255, 255, 0.7)",
                              color: "#1E40AF",
                              fontWeight: 600,
                              fontFamily: "'Feather Bold', 'Montserrat', sans-serif",
                              outline: "none",
                              transition: "all 0.2s ease",
                              boxSizing: "border-box"
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = "#0F62FE"
                              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"
                              e.currentTarget.style.boxShadow = "none"
                            }}
                          />
                          
                          <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            placeholder="Confirmar nueva contraseña"
                            style={{
                              width: "100%",
                              padding: "14px 18px",
                              fontSize: 15,
                              border: "2px solid rgba(59, 130, 246, 0.3)",
                              borderRadius: 12,
                              background: "rgba(255, 255, 255, 0.7)",
                              color: "#1E40AF",
                              fontWeight: 600,
                              fontFamily: "'Feather Bold', 'Montserrat', sans-serif",
                              outline: "none",
                              transition: "all 0.2s ease",
                              boxSizing: "border-box"
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = "#0F62FE"
                              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"
                              e.currentTarget.style.boxShadow = "none"
                            }}
                          />

                          <div style={{ display: "flex", gap: 12 }}>
                            <button
                              onClick={handlePasswordChange}
                              disabled={saving}
                              style={{
                                flex: 1,
                                padding: "12px 20px",
                                background: saving ? "#9CA3AF" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                border: "none",
                                borderRadius: 12,
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                fontFamily: "'Feather Bold', 'Montserrat', sans-serif"
                              }}
                              onMouseEnter={(e) => {
                                if (!saving) {
                                  e.currentTarget.style.transform = "translateY(-2px)"
                                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)"
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)"
                                e.currentTarget.style.boxShadow = "none"
                              }}
                            >
                              {saving ? "Guardando..." : "Guardar"}
                            </button>

                            <button
                              onClick={() => {
                                setShowPasswordFields(false)
                                setPasswords({ current: "", new: "", confirm: "" })
                                setSaveError(null)
                              }}
                              style={{
                                flex: 1,
                                padding: "12px 20px",
                                background: "rgba(107, 114, 128, 0.2)",
                                border: "2px solid rgba(107, 114, 128, 0.3)",
                                borderRadius: 12,
                                color: "#374151",
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                fontFamily: "'Feather Bold', 'Montserrat', sans-serif"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(107, 114, 128, 0.3)"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(107, 114, 128, 0.2)"
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Login Method */}
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        marginBottom: 8
                      }}>
                        Método de Inicio de Sesión
                      </label>
                      <div style={{
                        padding: "14px 18px",
                        background: "rgba(255, 255, 255, 0.5)",
                        borderRadius: 12,
                        border: "2px solid rgba(147, 197, 253, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                      }}>
                        <span style={{ fontSize: 15, color: "#1E40AF", fontWeight: 600 }}>
                          Email y Contraseña
                        </span>
                      </div>
                    </div>

                    {/* Subscription Status */}
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        marginBottom: 12
                      }}>
                        Plan de Suscripción
                      </label>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Gratuito Plan */}
                        <div
                          onClick={() => handlePlanUpdate("gratuito")}
                          style={{
                            padding: "16px 20px",
                            background: selectedPlan === "gratuito" 
                              ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" 
                              : "rgba(16, 185, 129, 0.1)",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: selectedPlan === "gratuito" ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            border: selectedPlan === "gratuito" ? "2px solid #10B981" : "2px solid rgba(16, 185, 129, 0.3)"
                          }}
                          onMouseEnter={(e) => {
                            if (selectedPlan !== "gratuito") {
                              e.currentTarget.style.background = "rgba(16, 185, 129, 0.2)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedPlan !== "gratuito") {
                              e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)"
                            }
                          }}
                        >
                          <div>
                            <div style={{ 
                              fontSize: 16, 
                              color: selectedPlan === "gratuito" ? "#fff" : "#059669", 
                              fontWeight: 800, 
                              marginBottom: 2 
                            }}>
                              Plan Gratuito
                            </div>
                            <div style={{ 
                              fontSize: 12, 
                              color: selectedPlan === "gratuito" ? "rgba(255, 255, 255, 0.8)" : "#6B7280", 
                              fontWeight: 600 
                            }}>
                              Acceso ilimitado a todos los cursos
                            </div>
                          </div>
                          {selectedPlan === "gratuito" && (
                            <div style={{
                              padding: "6px 12px",
                              background: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#fff"
                            }}>
                              ACTIVO
                            </div>
                          )}
                        </div>

                        {/* Estudiante Plan */}
                        <div
                          onClick={() => handlePlanUpdate("estudiante")}
                          style={{
                            padding: "16px 20px",
                            background: selectedPlan === "estudiante" 
                              ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" 
                              : "rgba(59, 130, 246, 0.1)",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: selectedPlan === "estudiante" ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            border: selectedPlan === "estudiante" ? "2px solid #3B82F6" : "2px solid rgba(59, 130, 246, 0.3)"
                          }}
                          onMouseEnter={(e) => {
                            if (selectedPlan !== "estudiante") {
                              e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedPlan !== "estudiante") {
                              e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"
                            }
                          }}
                        >
                          <div>
                            <div style={{ 
                              fontSize: 16, 
                              color: selectedPlan === "estudiante" ? "#fff" : "#2563EB", 
                              fontWeight: 800, 
                              marginBottom: 2 
                            }}>
                              Plan Estudiante
                            </div>
                            <div style={{ 
                              fontSize: 12, 
                              color: selectedPlan === "estudiante" ? "rgba(255, 255, 255, 0.8)" : "#6B7280", 
                              fontWeight: 600 
                            }}>
                              Funciones adicionales para estudiantes
                            </div>
                          </div>
                          {selectedPlan === "estudiante" && (
                            <div style={{
                              padding: "6px 12px",
                              background: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#fff"
                            }}>
                              ACTIVO
                            </div>
                          )}
                        </div>

                        {/* Premium Plan */}
                        <div
                          onClick={() => handlePlanUpdate("premium")}
                          style={{
                            padding: "16px 20px",
                            background: selectedPlan === "premium" 
                              ? "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)" 
                              : "rgba(251, 191, 36, 0.1)",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: selectedPlan === "premium" ? "0 4px 12px rgba(251, 191, 36, 0.3)" : "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            border: selectedPlan === "premium" ? "2px solid #FBBF24" : "2px solid rgba(251, 191, 36, 0.3)"
                          }}
                          onMouseEnter={(e) => {
                            if (selectedPlan !== "premium") {
                              e.currentTarget.style.background = "rgba(251, 191, 36, 0.2)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedPlan !== "premium") {
                              e.currentTarget.style.background = "rgba(251, 191, 36, 0.1)"
                            }
                          }}
                        >
                          <div>
                            <div style={{ 
                              fontSize: 16, 
                              color: selectedPlan === "premium" ? "#fff" : "#F59E0B", 
                              fontWeight: 800, 
                              marginBottom: 2 
                            }}>
                              Plan Premium
                            </div>
                            <div style={{ 
                              fontSize: 12, 
                              color: selectedPlan === "premium" ? "rgba(255, 255, 255, 0.8)" : "#6B7280", 
                              fontWeight: 600 
                            }}>
                              Acceso completo + certificados + soporte prioritario
                            </div>
                          </div>
                          {selectedPlan === "premium" && (
                            <div style={{
                              padding: "6px 12px",
                              background: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#fff"
                            }}>
                              ACTIVO
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Account Creation Date */}
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        marginBottom: 8
                      }}>
                        Cuenta Creada
                      </label>
                      <div style={{
                        padding: "14px 18px",
                        background: "rgba(255, 255, 255, 0.5)",
                        borderRadius: 12,
                        border: "2px solid rgba(147, 197, 253, 0.4)",
                        fontSize: 16,
                        color: "#1E40AF",
                        fontWeight: 600
                      }}>
                        {new Date(user.created_at || Date.now()).toLocaleDateString('es-MX', { 
                          day: 'numeric',
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout Section */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 20,
                  padding: 32,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
                  marginTop: 24
                }}>
                  <h3 style={{
                    margin: 0,
                    marginBottom: 16,
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1E40AF"
                  }}>
                    Sesión
                  </h3>
                  
                  <p style={{
                    margin: 0,
                    marginBottom: 20,
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 600
                  }}>
                    Cierra sesión de forma segura en este dispositivo.
                  </p>

                  <button
                    onClick={async () => {
                      setSaving(true)
                      try {
                        await supabase.auth.signOut()
                        router.push("/login")
                      } catch (error) {
                        console.error("Error signing out:", error)
                        setSaveError("Error al cerrar sesión")
                      } finally {
                        setSaving(false)
                      }
                    }}
                    disabled={saving}
                    style={{
                      width: "100%",
                      padding: "16px 24px",
                      background: saving ? "#9CA3AF" : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                      border: "none",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Feather Bold', 'Montserrat', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.4)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    {saving ? "Cerrando sesión..." : "Cerrar Sesión"}
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS SECTION */}
            {activeSection === "notifications" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E40AF", marginBottom: 24 }}>
                  {currentLang.sections.notifications}
                </h2>

                {[
                  { key: 'push', label: currentLang.notifications.push, desc: currentLang.notifications.pushDesc },
                  { key: 'email', label: currentLang.notifications.email, desc: currentLang.notifications.emailDesc },
                  { key: 'sound', label: currentLang.notifications.sound, desc: currentLang.notifications.soundDesc },
                  { key: 'courseUpdates', label: currentLang.notifications.courseUpdates, desc: currentLang.notifications.courseUpdatesDesc },
                  { key: 'achievements', label: currentLang.notifications.achievements, desc: currentLang.notifications.achievementsDesc },
                  { key: 'reminders', label: currentLang.notifications.reminders, desc: currentLang.notifications.remindersDesc },
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      background: "#F9FAFB",
                      borderRadius: 12,
                      cursor: "pointer",
                      marginBottom: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {desc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                      onChange={(e) => updateSettings({
                        notifications: {
                          ...settings.notifications,
                          [key]: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                ))}
              </div>
            )}

            {/* PRIVACY SECTION */}
            {activeSection === "privacy" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E40AF", marginBottom: 24 }}>
                  {currentLang.sections.privacy}
                </h2>

                {/* Profile Visibility */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 12 }}>
                    {currentLang.privacy.profileVisibility}
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updateSettings({
                      privacy: {
                        ...settings.privacy,
                        profileVisibility: e.target.value as 'public' | 'friends' | 'private'
                      }
                    })}
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "2px solid #E5E7EB",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="public">{currentLang.privacy.public}</option>
                    <option value="friends">{currentLang.privacy.friends}</option>
                    <option value="private">{currentLang.privacy.private}</option>
                  </select>
                </div>

                {/* Activity Visibility */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 12 }}>
                    {currentLang.privacy.activityVisibility}
                  </label>
                  <select
                    value={settings.privacy.activityVisibility}
                    onChange={(e) => updateSettings({
                      privacy: {
                        ...settings.privacy,
                        activityVisibility: e.target.value as 'public' | 'friends' | 'private'
                      }
                    })}
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "2px solid #E5E7EB",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="public">{currentLang.privacy.public}</option>
                    <option value="friends">{currentLang.privacy.friends}</option>
                    <option value="private">{currentLang.privacy.private}</option>
                  </select>
                </div>

                {/* Show Progress */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.privacy.showProgress}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.privacy.showProgressDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showProgress}
                      onChange={(e) => updateSettings({
                        privacy: {
                          ...settings.privacy,
                          showProgress: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>

                {/* Allow Messages */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.privacy.allowMessages}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.privacy.allowMessagesDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowMessages}
                      onChange={(e) => updateSettings({
                        privacy: {
                          ...settings.privacy,
                          allowMessages: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* CONTENT PREFERENCES SECTION */}
            {activeSection === "content" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E40AF", marginBottom: 24 }}>
                  {currentLang.sections.content}
                </h2>

                {/* Show Subtitles */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.content.showSubtitles}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.content.showSubtitlesDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.contentPreferences.showSubtitles}
                      onChange={(e) => updateSettings({
                        contentPreferences: {
                          ...settings.contentPreferences,
                          showSubtitles: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>

                {/* Autoplay Videos */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.content.autoplayVideos}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.content.autoplayVideosDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.contentPreferences.autoplayVideos}
                      onChange={(e) => updateSettings({
                        contentPreferences: {
                          ...settings.contentPreferences,
                          autoplayVideos: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>

                {/* Difficulty Level */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 12 }}>
                    {currentLang.content.difficultyLevel}
                  </label>
                  <select
                    value={settings.contentPreferences.difficultyLevel}
                    onChange={(e) => updateSettings({
                      contentPreferences: {
                        ...settings.contentPreferences,
                        difficultyLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                      }
                    })}
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "2px solid #E5E7EB",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="beginner">{currentLang.content.beginner}</option>
                    <option value="intermediate">{currentLang.content.intermediate}</option>
                    <option value="advanced">{currentLang.content.advanced}</option>
                  </select>
                </div>

                {/* Show Hints */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.content.showHints}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.content.showHintsDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.contentPreferences.showHints}
                      onChange={(e) => updateSettings({
                        contentPreferences: {
                          ...settings.contentPreferences,
                          showHints: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* LINKED ACCOUNTS SECTION */}
            {activeSection === "accounts" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E40AF", marginBottom: 24 }}>
                  {currentLang.sections.accounts}
                </h2>

                {/* Google */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "#F9FAFB",
                  borderRadius: 12,
                  marginBottom: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
                        Google
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {settings.linkedAccounts.google ? currentLang.accounts.connected : currentLang.accounts.notConnected}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => settings.linkedAccounts.google 
                      ? handleUnlinkAccount('google') 
                      : handleLinkAccount('google')
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: settings.linkedAccounts.google ? "#EF4444" : "#0F62FE",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {settings.linkedAccounts.google ? currentLang.accounts.unlink : currentLang.accounts.link}
                  </button>
                </div>

                {/* Facebook */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "#F9FAFB",
                  borderRadius: 12,
                  marginBottom: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
                        Facebook
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {settings.linkedAccounts.facebook ? currentLang.accounts.connected : currentLang.accounts.notConnected}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => settings.linkedAccounts.facebook 
                      ? handleUnlinkAccount('facebook') 
                      : handleLinkAccount('facebook')
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: settings.linkedAccounts.facebook ? "#EF4444" : "#0F62FE",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {settings.linkedAccounts.facebook ? currentLang.accounts.unlink : currentLang.accounts.link}
                  </button>
                </div>

                {/* Apple */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "#F9FAFB",
                  borderRadius: 12,
                  marginBottom: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
                        Apple
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {settings.linkedAccounts.apple ? currentLang.accounts.connected : currentLang.accounts.notConnected}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => settings.linkedAccounts.apple 
                      ? handleUnlinkAccount('apple') 
                      : handleLinkAccount('apple')
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: settings.linkedAccounts.apple ? "#EF4444" : "#0F62FE",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {settings.linkedAccounts.apple ? currentLang.accounts.unlink : currentLang.accounts.link}
                  </button>
                </div>
              </div>
            )}

            {/* ACCESSIBILITY SECTION */}
            {activeSection === "accessibility" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E40AF", marginBottom: 24 }}>
                  {currentLang.sections.accessibility}
                </h2>

                {/* Text Size */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 12 }}>
                    {currentLang.accessibility.textSize}
                  </label>
                  <select
                    value={settings.accessibility.textSize}
                    onChange={(e) => updateSettings({
                      accessibility: {
                        ...settings.accessibility,
                        textSize: e.target.value as TextSize
                      }
                    })}
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "2px solid #E5E7EB",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="small">{currentLang.accessibility.small}</option>
                    <option value="medium">{currentLang.accessibility.medium}</option>
                    <option value="large">{currentLang.accessibility.large}</option>
                    <option value="extra-large">{currentLang.accessibility.extraLarge}</option>
                  </select>
                </div>

                {/* Contrast Mode */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 12 }}>
                    {currentLang.accessibility.contrastMode}
                  </label>
                  <div style={{ display: "flex", gap: 12 }}>
                    {(['normal', 'high'] as ContrastMode[]).map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateSettings({
                          accessibility: {
                            ...settings.accessibility,
                            contrastMode: mode
                          }
                        })}
                        style={{
                          padding: "12px 24px",
                          borderRadius: 12,
                          border: `2px solid ${settings.accessibility.contrastMode === mode ? '#0F62FE' : '#E5E7EB'}`,
                          background: settings.accessibility.contrastMode === mode ? '#EFF6FF' : '#fff',
                          color: settings.accessibility.contrastMode === mode ? '#0F62FE' : '#6B7280',
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {mode === 'normal' ? currentLang.accessibility.normal : currentLang.accessibility.highContrast}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reduced Motion */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.accessibility.reducedMotion}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.accessibility.reducedMotionDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.reducedMotion}
                      onChange={(e) => updateSettings({
                        accessibility: {
                          ...settings.accessibility,
                          reducedMotion: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>

                {/* Screen Reader */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.accessibility.screenReader}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.accessibility.screenReaderDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.screenReaderOptimized}
                      onChange={(e) => updateSettings({
                        accessibility: {
                          ...settings.accessibility,
                          screenReaderOptimized: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>

                {/* Keyboard Navigation */}
                <div style={{ marginBottom: 32 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "#F9FAFB",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                        {currentLang.accessibility.keyboardNav}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {currentLang.accessibility.keyboardNavDesc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.keyboardNavigation}
                      onChange={(e) => updateSettings({
                        accessibility: {
                          ...settings.accessibility,
                          keyboardNavigation: e.target.checked
                        }
                      })}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div style={{
              borderTop: "2px solid #E5E7EB",
              paddingTop: 32,
              marginTop: 40
            }}>
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "2px solid #EF4444",
                  background: "#fff",
                  color: "#EF4444",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {currentLang.reset.button}
              </button>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999
              }}>
                <div style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 32,
                  maxWidth: 400,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
                }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
                    {currentLang.reset.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
                    {currentLang.reset.message}
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 12,
                        border: "2px solid #E5E7EB",
                        background: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {currentLang.reset.cancel}
                    </button>
                    <button
                      onClick={() => {
                        resetSettings()
                        setShowResetConfirm(false)
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 12,
                        border: "none",
                        background: "#EF4444",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {currentLang.reset.confirm}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        /* Fix mobile layout for settings page */
        @media (max-width: 767px) {
          .settings-container {
            padding: 20px 16px !important;
            padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
            width: 100% !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
          }
          
          .settings-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Sidebar navigation - make it horizontal scrollable on mobile */
          .settings-grid > div:first-child {
            position: relative !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            padding: 16px !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 8px !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
          }
          
          /* Sidebar buttons - adjust for horizontal layout */
          .settings-grid > div:first-child > button {
            min-width: 140px !important;
            width: auto !important;
            flex-shrink: 0 !important;
            white-space: nowrap !important;
            margin-bottom: 0 !important;
          }
          
          /* Content area - full width on mobile */
          .settings-grid > div:last-child {
            width: 100% !important;
            max-width: 100% !important;
            padding: 20px 16px !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
          }
          
          /* Header adjustments */
          .settings-container > div[style*="maxWidth: 100%"] {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .settings-container h1 {
            font-size: clamp(24px, 6vw, 32px) !important;
            margin-bottom: 8px !important;
          }
          
          .settings-container p {
            font-size: clamp(14px, 3vw, 16px) !important;
          }
          
          /* Ensure body can scroll on mobile */
          body {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            position: relative !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          
          /* Ensure html can scroll on mobile */
          html {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            height: auto !important;
            min-height: 100vh !important;
          }
        }
        
      `}</style>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)", padding: "40px", maxWidth: "100%", overflowX: "hidden" }}>Cargando configuración...</div>}>
      <SettingsContent />
    </Suspense>
  )
}

