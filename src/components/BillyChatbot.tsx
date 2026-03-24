"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { touchStreak } from "@/lib/streakClient"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function BillyChatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragControls = useDragControls()
  const { dbProfile } = useAuth()
  const userName = dbProfile?.firstName || "Estudiante"

  // Load history from localStorage
  useEffect(() => {
    setIsHydrated(true)
    const saved = localStorage.getItem("billy_chat_history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })))
      } catch (e) {
        console.error("Error loading chat history", e)
      }
    }

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

  // Listen for global open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setHasUnread(false)
    }
    window.addEventListener('open-billy-chat', handleOpen)
    return () => window.removeEventListener('open-billy-chat', handleOpen)
  }, [])

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("billy_chat_history", JSON.stringify(messages.slice(-20)))
    }
  }, [messages])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300)
    }
  }, [isOpen])

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = { role: "user", content: textToSend, timestamp: new Date() }
    setMessages((p) => [...p, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const api = await fetch("/api/free-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          userName,
          xp: dbProfile?.xp || 0,
          level: dbProfile?.level || 1,
          currentPath: pathname,
          conversationHistory: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }),
      })
      const data = await api.json()
      const response = data.response || "¡Ups! No pude procesar tu pregunta. ¿Intentamos de nuevo?"

      // Basic suggestion logic based on keywords
      let suggestions: string[] = []
      if (response.toLowerCase().includes("ahorro") || response.toLowerCase().includes("presupuesto")) {
        suggestions = ["¿Cómo hago un presupuesto?", "¿Qué es la regla 50/30/20?"]
      } else if (response.toLowerCase().includes("invers") || response.toLowerCase().includes("invertir")) {
        suggestions = ["¿Qué son los Cetes?", "¿Cómo empiezo a invertir?"]
      } else if (response.toLowerCase().includes("deuda")) {
        suggestions = ["¿Cómo priorizo mis deudas?", "¿Qué es el interés compuesto?"]
      }

      setMessages((p) => [...p, { role: "assistant", content: response, timestamp: new Date(), suggestions }])

      // Chatting with Billy counts as daily activity
      touchStreak("billy_chatbot")

      if (!isOpen) setHasUnread(true)
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "¡Ups! Parece que perdí la conexión. ¿Intentamos de nuevo?", timestamp: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Tu navegador no soporta reconocimiento de voz.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    // @ts-expect-error browser types
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = 'es-MX'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      // Optional: auto-send
      // sendMessage(transcript)
    }

    recognition.start()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = () => {
    if (confirm("¿Quieres borrar toda la conversación?")) {
      setMessages([])
      localStorage.removeItem("billy_chat_history")
    }
  }

  const chatWidth = isHydrated && isMobile ? "calc(100vw - 24px)" : "390px"
  const chatHeight = isHydrated && isMobile ? "80vh" : "580px"
  const chatRight = isHydrated && isMobile ? "12px" : "24px"
  const chatBottom = isHydrated && isMobile ? "84px" : "96px"

  // Simple Markdown-ish parser for Bold and Lists
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n')

    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ')
      let processedLine = line.trim().replace(/^[*|-]\s+/, '')

      // Handle Bold (**text**)
      const boldParts = processedLine.split(/(\*\*.*?\*\*)/g)
      const renderedLine = boldParts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ fontWeight: 800 }}>{part.slice(2, -2)}</strong>
        }
        return part
      })

      if (isBullet) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4, paddingLeft: 4 }}>
            <span style={{ color: '#3b82f6', fontWeight: 900 }}>•</span>
            <span style={{ flex: 1 }}>{renderedLine}</span>
          </div>
        )
      }

      return (
        <p key={idx} style={{ margin: '0 0 8px 0' }}>
          {renderedLine}
        </p>
      )
    })
  }

  const UI = (
    <>
      <style>{`
        @keyframes billyBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes billyBob {
          0%, 100% { transform: translateY(0) scale(1.1); }
          50% { transform: translateY(-8px) scale(1.15); }
        }
        @keyframes pulseMic {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        #chatbot-launcher,
        .chatbot-launcher {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          z-index: 9999;
          cursor: pointer;
          border: none;
          overflow: hidden;
          backdrop-filter: blur(8px);
          touch-action: none;
        }
        @media (max-width: 767px) {
          #chatbot-launcher,
          .chatbot-launcher {
            /* Show on all mobile screens but make him smaller and bump up to clear the bottom nav */
            display: flex !important;
            width: 56px !important;
            height: 56px !important;
            bottom: 90px !important; /* clears mobile bottom nav */
            right: 16px !important;
          }
        }
      `}</style>

      {/* FLOATING LAUNCHER */}
      <motion.button
        id="chatbot-launcher"
        className="chatbot-launcher"
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Abrir chat con Billy"
        drag
        dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
        dragMomentum={false}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        style={{
          background: "linear-gradient(135deg, rgba(30,64,175,0.9) 0%, rgba(37,99,235,0.9) 100%)",
          boxShadow: "0 12px 32px rgba(37,99,235,0.4), 0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, cursor: "grabbing" }}
      >
        <Image
          src="/billy_chatbot.png"
          alt="Billy"
          width={72}
          height={72}
          draggable={false}
          style={{
            pointerEvents: "none",
            objectFit: "contain",
            width: "100%",
            height: "100%",
            padding: "4px",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
          }}
        />
        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{
                position: "absolute", top: 6, right: 6,
                width: 16, height: 16, borderRadius: "50%",
                background: "#f43f5e", border: "2px solid white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}
            />
          )}
        </AnimatePresence>
        {/* Online pulse */}
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          width: 12, height: 12, borderRadius: "50%",
          background: "#10b981",
          border: "2px solid white",
          boxShadow: "0 0 0 2px rgba(16,185,129,0.3)"
        }} />
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            drag={!isMobile}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            initial={{ opacity: 0, scale: 0.9, y: 30, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "fixed",
              bottom: chatBottom,
              right: chatRight,
              zIndex: 9998,
              width: chatWidth,
              height: chatHeight,
              maxHeight: "85dvh",
              backgroundColor: "rgba(248, 250, 255, 0.9)",
              backdropFilter: "blur(20px) saturate(180%)",
              borderRadius: "28px",
              boxShadow: "0 30px 90px rgba(0,0,0,0.18), 0 4px 20px rgba(37,99,235,0.08)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              touchAction: "none"
            }}
          >
            {/* ── HEADER (Glass handle) ── */}
            <div
              onPointerDown={(e) => {
                if (!isMobile) dragControls.start(e)
              }}
              style={{
                background: "linear-gradient(135deg, rgba(30,58,138,0.95) 0%, rgba(37,99,235,0.95) 100%)",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
                position: "relative",
                cursor: isMobile ? "default" : "grab",
                userSelect: "none",
                borderBottom: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <div style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
                animation: isLoading ? "billyBob 2s ease-in-out infinite" : "none"
              }}>
                <Image src="/billy_chatbot.png" alt="Billy" width={48} height={48}
                  style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.1)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, pointerEvents: "none" }}>
                <div style={{ color: "white", fontSize: 18, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em" }}>Billy</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", flexShrink: 0, boxShadow: "0 0 8px #10b981" }} />
                  {isLoading ? "Pensando..." : "Mentor de BIZEN"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); clearChat() }}
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", cursor: "pointer", padding: 10, borderRadius: 12, height: 38, width: 38, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  title="Limpiar chat"
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", cursor: "pointer", padding: 10, borderRadius: 12, height: 38, width: 38, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  title="Cerrar"
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* ── MESSAGES AREA ── */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              background: "transparent",
              cursor: "default"
            }}>
              {/* Welcome State */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "30px 10px" }}
                >
                  <div style={{
                    marginBottom: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Image src="/billy_chatbot.png" alt="Billy" width={84} height={84}
                      style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.1)" }} />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#1e3a8a", marginBottom: 8, letterSpacing: "-0.02em" }}>¡Hola, {userName}! Soy Billy</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 20, maxWidth: 280 }}>
                    Tu mentor financiero personal. ¿En qué "feria" trabajamos hoy?
                  </div>
                  {/* Action Chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {["¿Cómo hago un presupuesto?", "¿Qué es invertir?", "¿Cómo salir de deudas?"].map((q) => (
                      <button key={q} onClick={() => sendMessage(q)}
                        style={{
                          background: "white", border: "1px solid rgba(37,99,235,0.2)",
                          color: "#2563eb", padding: "10px 16px",
                          borderRadius: "14px", fontSize: 13, fontWeight: 600,
                          cursor: "pointer", transition: "all 0.2s",
                          boxShadow: "0 4px 6px rgba(37,99,235,0.05)"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 12px rgba(37,99,235,0.12)" }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(37,99,235,0.05)" }}
                      >{q}</button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message Bubbles */}
              {messages.map((msg, i) => (
                <div key={i}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
                >
                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, width: "100%" }}>
                      <div style={{
                        flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Image src="/billy_chatbot.png" alt="Billy" width={28} height={28}
                          style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.2)" }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "82%" }}>
                        <div style={{
                          background: "white",
                          color: "#1e293b",
                          padding: "14px 18px",
                          borderRadius: "20px 20px 20px 6px",
                          fontSize: 14.5,
                          lineHeight: 1.6,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)",
                          border: "1px solid rgba(0,0,0,0.03)",
                          wordBreak: "break-word",
                        }}>
                          {renderMessageContent(msg.content)}
                        </div>
                        {/* Suggested Action Chips */}
                        {msg.suggestions && msg.suggestions.length > 0 && i === messages.length - 1 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                            {msg.suggestions.map((s, si) => (
                              <button key={si} onClick={() => sendMessage(s)}
                                style={{
                                  background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)",
                                  color: "#1d4ed8", padding: "6px 12px", borderRadius: "10px",
                                  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(37,99,235,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(37,99,235,0.08)"}
                              >{s}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {msg.role === "user" && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      style={{
                        maxWidth: "80%",
                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        color: "white",
                        padding: "14px 18px",
                        borderRadius: "20px 20px 6px 20px",
                        fontSize: 14.5,
                        lineHeight: 1.6,
                        boxShadow: "0 10px 25px rgba(37,99,235,0.28)",
                        wordBreak: "break-word",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}
                    >
                      {msg.content}
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                  <div style={{
                    flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Image src="/billy_chatbot.png" alt="Billy" width={28} height={28}
                      style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.2)" }} />
                  </div>
                  <div style={{
                    background: "white", padding: "16px 22px", borderRadius: "20px 20px 20px 6px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.03)",
                    display: "flex", gap: 6, alignItems: "center"
                  }}>
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#93c5fd",
                        animation: "billyBounce 1.2s infinite",
                        animationDelay: `${d}s`
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── INPUT AREA ── */}
            <div style={{
              padding: "18px 20px",
              background: "rgba(255,255,255,0.5)",
              borderTop: "1px solid rgba(226, 232, 240, 0.6)",
              flexShrink: 0,
              cursor: "default"
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Pregúntale a Billy..."
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "13px 44px 13px 18px",
                      border: "1.5px solid rgba(226, 232, 240, 0.8)",
                      borderRadius: "18px",
                      fontSize: 15,
                      outline: "none",
                      background: "white",
                      color: "#1e293b",
                      transition: "all 0.2s",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = "#3b82f6"
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,130,246,0.12)"
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.8)"
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)"
                    }}
                  />
                  <button
                    onClick={toggleListening}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: isListening ? "#f43f5e" : "#94a3b8",
                      padding: 6, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "50%", transition: "all 0.2s",
                      animation: isListening ? "pulseMic 1.5s infinite" : "none"
                    }}
                    title="Voz a texto"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 01-14 0v-2M12 18.5V23M8 23h8" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  aria-label="Enviar"
                  style={{
                    flexShrink: 0,
                    width: 48, height: 48,
                    borderRadius: "16px",
                    border: "none",
                    cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                    background: isLoading || !input.trim()
                      ? "#f1f5f9"
                      : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: isLoading || !input.trim() ? "#cbd5e1" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    boxShadow: isLoading || !input.trim() ? "none" : "0 8px 25px rgba(37,99,235,0.3)",
                  }}
                  onMouseEnter={e => { if (input.trim() && !isLoading) e.currentTarget.style.transform = "scale(1.08) rotate(-4deg)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0)" }}
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#94a3b8", letterSpacing: "0.01em" }}>
                Billy puede cometer errores. Verifica info importante.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  if (!mounted || !portal) return null
  return createPortal(UI, portal)
}
