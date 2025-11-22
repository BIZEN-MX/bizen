"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Client-side fallback for when API is unavailable (simpler version)
const getRuleBasedResponse = (message: string): string | null => {
  const m = message.toLowerCase()
  if (m.includes("hola") || m.includes("hi") || m.includes("buenos") || m.includes("buen día") || m.includes("saludos")) {
    return "¡Hola! Soy tu asistente de BIZEN. Puedo ayudarte con información sobre módulos, registro, login, progreso y más. ¿En qué puedo ayudarte?"
  }
  if (m.includes("qué es bizen") || m.includes("que es bizen")) {
    return "BIZEN es una plataforma de educación financiera con 6 módulos interactivos sobre identidad digital, finanzas personales, presupuestos, inversiones y créditos."
  }
  if (m.includes("módulo") || m.includes("modulo") || m.includes("curso")) {
    return "BIZEN tiene 6 módulos: Identidad Digital, Finanzas Personales, Presupuestos y Ahorro, Inversiones Básicas, Créditos y Deudas, y Temas Avanzados. Cada módulo incluye lecciones, quizzes y certificaciones."
  }
  if (m.includes("registro") || m.includes("registrarse") || m.includes("signup") || m.includes("crear cuenta")) {
    return "Para registrarte: ve a la página de registro, completa el formulario, verifica tu email y comienza. ¡Es rápido y fácil!"
  }
  if (m.includes("login") || m.includes("iniciar sesión") || m.includes("contraseña") || m.includes("password")) {
    return "Si tienes problemas: verifica email/contraseña, usa 'Olvidé mi contraseña', asegúrate de que tu cuenta esté verificada. Si persiste, contacta soporte."
  }
  if (m.includes("progreso") || m.includes("avance") || m.includes("completado")) {
    return "Tu progreso se guarda automáticamente y se sincroniza entre dispositivos. Puedes verlo en el dashboard y continuar donde lo dejaste."
  }
  if (m.includes("problema") || m.includes("error") || m.includes("no funciona") || m.includes("ayuda técnica")) {
    return "Prueba: refrescar la página, limpiar caché, modo incógnito. Si persiste, contacta soporte@bizen.mx"
  }
  if (m.includes("contacto") || m.includes("email") || m.includes("teléfono") || m.includes("telefono") || m.includes("soporte")) {
    return "Contacto: info@bizen.mx | Soporte: soporte@bizen.mx | Web: www.bizen.mx | Horario: Lun-Vie 9:00-18:00"
  }
  return null
}

export default function BillyChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Portal
  const [mounted, setMounted] = useState(false)
  const [portal, setPortal] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setIsHydrated(true)
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 640px)")
    const onChange = (e: MediaQueryList | MediaQueryListEvent) => {
      // @ts-expect-error Safari
      const matches = e.matches ?? e.target.matches
      setIsMobile(matches)
    }
    onChange(mq)
    mq.addEventListener?.("change", onChange)
    setMounted(true)

    // Crear contenedor de portal si no existe
    let node = document.getElementById("chatbot-portal") as HTMLElement | null
    if (!node) {
      node = document.createElement("div")
      node.id = "chatbot-portal"
      document.body.appendChild(node)
    }
    setPortal(node)

    return () => {
      mq.removeEventListener?.("change", onChange)
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const userMessage: Message = { role: "user", content: input.trim(), timestamp: new Date() }
    setMessages((p) => [...p, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      let response: string
      try {
        const api = await fetch("/api/free-chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.content, conversationHistory: messages.slice(-3) }),
        })
        if (api.ok) {
          const data = await api.json()
          response = data.response
        } else throw new Error("API not available")
      } catch {
        response = getRuleBasedResponse(userMessage.content) ?? "Puedo ayudarte con BIZEN (módulos, soporte, registro). ¿Qué necesitas?"
      }
      setMessages((p) => [...p, { role: "assistant", content: response, timestamp: new Date() }])
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Hubo un error. ¿En qué puedo ayudarte?", timestamp: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const UI = (
    <>
      {/* LAUNCHER (botón flotante) */}
      <motion.button
        id="chatbot-launcher"
        className="chatbot-launcher"
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          cursor: "pointer",
          display: "inline-flex",
          width: 56,
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          flex: "0 0 56px",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          boxShadow: "0 4px 12px rgba(59,130,246,.4)",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .3s ease",
          boxSizing: "border-box",
        }}
        whileHover={{ scale: 1.1, boxShadow: "0 6px 16px rgba(59,130,246,.5)" }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 1 1 2 2z" />
        </svg>
      </motion.button>

      {/* CHAT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "80px",
              right: "20px",
              zIndex: 9998,
              width: isHydrated && isMobile ? "90vw" : "380px",
              maxWidth: isHydrated && isMobile ? "90vw" : "420px",
              height: isHydrated && isMobile ? "70vh" : "500px",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              border: "none",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  🤖
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0, lineHeight: 1.2 }}>Asistente BIZEN</h3>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                      flex: "0 0 auto",
                    }}
                    title="Limpiar"
                  >
                    <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    flex: "0 0 auto",
                  }}
                  title="Cerrar"
                >
                  <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                background: "#f9fafb",
              }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#6b7280", padding: "8px 0", fontSize: "11px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      margin: "0 auto 6px",
                      backgroundColor: "#dbeafe",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "#3b82f6", fontSize: "11px" }}>🤖</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "11px" }}>¿En qué puedo ayudarte hoy?</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                      background: msg.role === "user" ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "white",
                      color: msg.role === "user" ? "white" : "#374151",
                      boxShadow: msg.role === "user" ? "0 2px 8px rgba(59,130,246,.2)" : "0 1px 3px rgba(0,0,0,.1)",
                    }}
                  >
                    <p style={{ margin: 0, whiteSpace: "pre-line" }}>{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ backgroundColor: "#f3f4f6", padding: "4px 6px", borderRadius: "6px", display: "inline-block" }}>
                    <div style={{ display: "flex", gap: "3px" }}>
                      <div style={{ width: 4, height: 4, backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1s infinite" }} />
                      <div style={{ width: 4, height: 4, backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1s infinite", animationDelay: "0.1s" }} />
                      <div style={{ width: 4, height: 4, backgroundColor: "#9ca3af", borderRadius: "50%", animation: "bounce 1s infinite", animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb", backgroundColor: "white" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "24px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                  disabled={isLoading}
                />

                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  style={{
                    flex: "0 0 auto",
                    width: "auto",
                    maxWidth: "fit-content",
                    background: isLoading || !input.trim()
                      ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "white",
                    padding: "12px 16px",
                    borderRadius: "24px",
                    border: "none",
                    cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    boxShadow: isLoading || !input.trim() ? "none" : "0 4px 12px rgba(59,130,246,.4)",
                  }}
                  title="Enviar"
                >
                  <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERRIDES CSS HIPER-ESPECÍFICOS (se inyectan al final) */}
      <style jsx global>{`
        /* Doble ID / doble clase = más especificidad; con !important gana a casi todo */
        #chatbot-launcher#chatbot-launcher,
        .chatbot-launcher.chatbot-launcher {
          position: fixed !important;
          inset: auto 20px 20px auto !important; /* top/left reset, right/bottom colocados */
          display: inline-flex !important;
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          max-width: 56px !important;
          flex: 0 0 56px !important;
          border-radius: 9999px !important;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          box-shadow: 0 4px 12px rgba(59,130,246,.4) !important;
          box-sizing: border-box !important;
          cursor: pointer !important;
          z-index: 9999 !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: visible !important;
          transform: none !important;
        }
      `}</style>
    </>
  )

  if (!mounted || !portal) return null
  return createPortal(UI, portal)
}
