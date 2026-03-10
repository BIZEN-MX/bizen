"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function BillyChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsHydrated(true)
    const mq = window.matchMedia("(max-width: 640px)")
    const onChange = (e: MediaQueryList | MediaQueryListEvent) => {
      // @ts-expect-error Safari
      setIsMobile(e.matches ?? e.target.matches)
    }
    onChange(mq)
    mq.addEventListener?.("change", onChange)
    setMounted(true)

    let node = document.getElementById("chatbot-portal") as HTMLElement | null
    if (!node) {
      node = document.createElement("div")
      node.id = "chatbot-portal"
      document.body.appendChild(node)
    }
    setPortal(node)

    return () => mq.removeEventListener?.("change", onChange)
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const userMessage: Message = { role: "user", content: input.trim(), timestamp: new Date() }
    setMessages((p) => [...p, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const api = await fetch("/api/free-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, conversationHistory: messages.slice(-5) }),
      })
      const data = await api.json()
      const response = data.response || "¡Ups! No pude procesar tu pregunta. ¿Intentamos de nuevo?"
      setMessages((p) => [...p, { role: "assistant", content: response, timestamp: new Date() }])
      if (!isOpen) setHasUnread(true)
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "¡Ups! Parece que perdí la conexión. ¿Intentamos de nuevo? 😅", timestamp: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const chatWidth = isHydrated && isMobile ? "calc(100vw - 24px)" : "380px"
  const chatHeight = isHydrated && isMobile ? "75vh" : "540px"
  const chatRight = isHydrated && isMobile ? "12px" : "24px"
  const chatBottom = isHydrated && isMobile ? "84px" : "88px"

  const UI = (
    <>
      {/* FLOATING LAUNCHER */}
      <motion.button
        id="chatbot-launcher"
        className="chatbot-launcher"
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Abrir chat con Billy"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          cursor: "pointer",
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
          boxShadow: "0 8px 24px rgba(37,99,235,0.45), 0 2px 8px rgba(0,0,0,0.15)",
          border: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        whileHover={{ scale: 1.08, boxShadow: "0 10px 28px rgba(37,99,235,0.55)" }}
        whileTap={{ scale: 0.94 }}
      >
        <Image
          src="/billy_chatbot.png"
          alt="Billy"
          width={60}
          height={60}
          style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.15)" }}
        />
        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{
                position: "absolute", top: 4, right: 4,
                width: 14, height: 14, borderRadius: "50%",
                background: "#ef4444", border: "2px solid white"
              }}
            />
          )}
        </AnimatePresence>
        {/* Online pulse */}
        <div style={{
          position: "absolute", bottom: 6, right: 6,
          width: 12, height: 12, borderRadius: "50%",
          background: "#22c55e",
          border: "2px solid white",
          boxShadow: "0 0 0 2px rgba(34,197,94,0.3)"
        }} />
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.92, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: chatBottom,
              right: chatRight,
              zIndex: 9998,
              width: chatWidth,
              height: chatHeight,
              maxHeight: "85dvh",
              backgroundColor: "#f8faff",
              borderRadius: "20px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(37,99,235,0.12)",
              border: "1px solid rgba(37,99,235,0.12)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ── HEADER ── */}
            <div style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
              position: "relative",
            }}>
              {/* Billy avatar in header */}
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Image src="/billy_chatbot.png" alt="Billy" width={44} height={44}
                  style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.1)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "white", fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>Billy</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                  Tu tutor de BIZEN
                </div>
              </div>
              {/* Action buttons */}
              <div style={{ display: "flex", gap: 6 }}>
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "white", cursor: "pointer", padding: 8, borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                    title="Limpiar chat"
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "white", cursor: "pointer", padding: 8, borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                  title="Cerrar"
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* ── MESSAGES AREA ── */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              background: "#f0f4ff",
            }}>
              {/* Welcome State */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 8px 8px" }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                    border: "3px solid #93c5fd",
                    overflow: "hidden", marginBottom: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.2)"
                  }}>
                    <Image src="/billy_chatbot.png" alt="Billy" width={68} height={68}
                      style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.1)" }} />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1e3a8a", marginBottom: 6 }}>¡Hola! Soy Billy 👋</div>
                  <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 16, maxWidth: 260 }}>
                    Tu tutor de educación financiera. Estoy aquí para ayudarte a dominar tus finanzas.
                  </div>
                  {/* Quick prompts */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
                    {["¿Cómo hago un presupuesto?", "¿Qué es invertir?", "¿Cómo salir de deudas?"].map((q) => (
                      <button key={q} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50) }}
                        style={{
                          background: "white", border: "1px solid #bfdbfe",
                          color: "#1d4ed8", padding: "7px 12px",
                          borderRadius: 999, fontSize: 12, fontWeight: 500,
                          cursor: "pointer", transition: "all 0.15s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#93c5fd" }}
                        onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#bfdbfe" }}
                      >{q}</button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message Bubbles */}
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
                >
                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "#dbeafe", border: "1.5px solid #93c5fd",
                        overflow: "hidden", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <Image src="/billy_chatbot.png" alt="Billy" width={26} height={26}
                          style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.2)" }} />
                      </div>
                      <div style={{
                        maxWidth: "78%",
                        background: "white",
                        color: "#1e293b",
                        padding: "11px 14px",
                        borderRadius: "18px 18px 18px 4px",
                        fontSize: 14,
                        lineHeight: 1.55,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        wordBreak: "break-word",
                        whiteSpace: "pre-line"
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div style={{
                      maxWidth: "78%",
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: "white",
                      padding: "11px 14px",
                      borderRadius: "18px 18px 4px 18px",
                      fontSize: 14,
                      lineHeight: 1.55,
                      boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                      wordBreak: "break-word",
                      whiteSpace: "pre-line"
                    }}>
                      {msg.content}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: "flex", alignItems: "flex-end", gap: 7 }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#dbeafe", border: "1.5px solid #93c5fd",
                    overflow: "hidden", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Image src="/billy_chatbot.png" alt="Billy" width={26} height={26}
                      style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.2)" }} />
                  </div>
                  <div style={{
                    background: "white", padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.06)",
                    display: "flex", gap: 5, alignItems: "center"
                  }}>
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "#93c5fd",
                        animation: "billyBounce 1.2s infinite",
                        animationDelay: `${d}s`
                      }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── INPUT AREA ── */}
            <div style={{
              padding: "12px 14px",
              background: "white",
              borderTop: "1px solid #e2e8f0",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Pregúntale a Billy..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "10px 15px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 999,
                    fontSize: 14,
                    outline: "none",
                    background: "#f8faff",
                    color: "#1e293b",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)"
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  aria-label="Enviar"
                  style={{
                    flexShrink: 0,
                    width: 40, height: 40,
                    borderRadius: "50%",
                    border: "none",
                    cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                    background: isLoading || !input.trim()
                      ? "#e2e8f0"
                      : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: isLoading || !input.trim() ? "#94a3b8" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                    boxShadow: isLoading || !input.trim() ? "none" : "0 3px 10px rgba(37,99,235,0.35)",
                  }}
                  onMouseEnter={e => { if (input.trim() && !isLoading) e.currentTarget.style.transform = "scale(1.06)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 10.5, color: "#94a3b8" }}>
                Billy puede cometer errores. Verifica info importante.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes billyBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        #chatbot-launcher#chatbot-launcher,
        .chatbot-launcher.chatbot-launcher {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
          inset: auto 24px 24px auto !important;
          width: 68px !important;
          height: 68px !important;
          min-width: 68px !important;
          max-width: 68px !important;
          border-radius: 50% !important;
          z-index: 9999 !important;
          cursor: pointer !important;
          border: none !important;
          overflow: hidden !important;
        }
      `}</style>
    </>
  )

  if (!mounted || !portal) return null
  return createPortal(UI, portal)
}
