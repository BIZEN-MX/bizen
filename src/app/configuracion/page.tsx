"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSettings, Language, Theme, TextSize, ContrastMode } from "@/contexts/SettingsContext"
import { useAuth } from "@/contexts/AuthContext"
import PageLogo from "@/components/PageLogo"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { settings, updateSettings, resetSettings } = useSettings()
  const [activeSection, setActiveSection] = useState<string>("general")
  const [showResetConfirm, setShowResetConfirm] = useState(false)

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
    { id: "notifications", name: currentLang.sections.notifications, icon: "" },
    { id: "privacy", name: currentLang.sections.privacy, icon: "" },
    { id: "content", name: currentLang.sections.content, icon: "" },
    { id: "accounts", name: currentLang.sections.accounts, icon: "" },
    { id: "accessibility", name: currentLang.sections.accessibility, icon: "" },
  ]

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
    <div style={{
      position: "relative",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed",
      fontFamily: "Montserrat, sans-serif",
      padding: "40px 20px"
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
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
        zIndex: 1
      }}>
        {/* Logo */}
        <PageLogo />

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

        <div style={{
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
                  fontFamily: "Montserrat, sans-serif"
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
    </div>
  )
}

