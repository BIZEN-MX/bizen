"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { touchStreak } from "@/lib/streakClient"

import { 
  X, 
  Mic, 
  Trash, 
  Send,
  MoreVertical,
  Minus
} from "lucide-react"
import { Billy } from "./Billy"

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
  const userName = dbProfile?.firstName || dbProfile?.fullName?.split(' ')[0] || "Estudiante"

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

    const mq = window.matchMedia("(max-width: 767px)")
    const onChange = (e: MediaQueryList | MediaQueryListEvent) => {
      // @ts-expect-error Safari
      setIsMobile(e.matches ?? (e as MediaQueryListEvent).target?.matches ?? false)
    }
    onChange(mq)
    mq.addEventListener?.("change", onChange)
    let node = document.getElementById("chatbot-portal")
    if (!node) {
      node = document.createElement("div")
      node.id = "chatbot-portal"
      document.body.appendChild(node)
    }
    setPortal(node)
    setMounted(true)

    return () => mq.removeEventListener?.("change", onChange)
  }, [])

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setHasUnread(false)
    }
    window.addEventListener('open-billy-chat', handleOpen)
    return () => window.removeEventListener('open-billy-chat', handleOpen)
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("billy_chat_history", JSON.stringify(messages.slice(-20)))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [messages, isLoading])

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
      const response = data?.response || "¡Ups! Tuvimos un hipo creativo. Intenta de nuevo."
      
      let suggestions: string[] = []
      if (response.toLowerCase().includes("ahorro")) suggestions = ["¿Cómo hago un presupuesto?", "Regla 50/30/20"]
      if (response.toLowerCase().includes("inver")) suggestions = ["¿Qué son los CETES?", "Empezar a invertir"]

      setMessages((p) => [...p, { role: "assistant", content: response, timestamp: new Date(), suggestions }])
      touchStreak("billy_chatbot")
      if (!isOpen) setHasUnread(true)
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "¡Rayos! Se cortó la señal. ¿Volvemos a intentar?", timestamp: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Navegador no compatible con voz.")
      return
    }
    if (isListening) { setIsListening(false); return }

    // @ts-expect-error browser types
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = 'es-MX'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript)
    recognition.start()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const chatWidth = isHydrated && isMobile ? "calc(100vw - 32px)" : "420px"
  const chatHeight = isHydrated && isMobile ? "65vh" : "600px"
  const chatRight = isHydrated && isMobile ? "16px" : "32px"
  const chatBottom = isHydrated && isMobile ? "100px" : "120px"

  const renderMessageContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ')
      let processedLine = line.trim().replace(/^[*|-]\s+/, '')
      const boldParts = processedLine.split(/(\*\*.*?\*\*)/g)
      const renderedLine = boldParts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={pIdx} style={{ fontWeight: 800, color: '#0F62FE' }}>{part.slice(2, -2)}</span>
        }
        return part
      })
      if (isBullet) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6, paddingLeft: 6 }}>
            <span style={{ color: '#0F62FE', fontWeight: 900 }}>•</span>
            <span style={{ flex: 1 }}>{renderedLine}</span>
          </div>
        )
      }
      return <p key={idx} style={{ margin: '0 0 10px 0' }}>{renderedLine}</p>
    })
  }

  const UI = (
    <>
      {/* Styles moved to globals.css */}

      {/* LAUNCHER */}
      <motion.button
        className="billy-chat-launcher"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{ animation: isMobile ? 'none' : 'launchPulse 3s infinite' }}
      >
        <Billy mood={hasUnread ? "thinking" : "mascot"} size={68} />
        {hasUnread && (
          <div style={{ position: "absolute", top: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: "#ef4444", border: "4px solid #fff", boxShadow: "0 4px 8px rgba(239, 68, 68, 0.4)" }} />
        )}
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40, x: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: chatBottom,
              right: chatRight,
              zIndex: 10002,
              width: chatWidth,
              height: chatHeight,
              background: "rgba(255, 255, 255, 0.82)",
              backdropFilter: "blur(30px) saturate(180%)",
              borderRadius: "36px",
              boxShadow: "0 40px 100px rgba(15,23,42,0.18), 0 4px 24px rgba(15,98,254,0.06)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {/* CLEAN HEADER */}
            <div style={{
              padding: "24px 28px",
              background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "relative"
            }}>
              <div style={{ width: 52, height: 52, borderRadius: "18px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
                <Billy mood={isLoading ? "thinking" : "happy"} size={48} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: 19, fontWeight: 900, letterSpacing: "-0.01em" }}>Billy Insights</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
                  {isLoading ? "Escribiendo..." : "Experto Activo"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { if(confirm('¿Borrar historial?')) {setMessages([]); localStorage.removeItem('billy_chat_history');} }} style={{ width: 40, height: 40, borderRadius: "14px", border: "none", background: "rgba(255,255,255,0.15)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}><Trash size={18} /></button>
                <button onClick={() => setIsOpen(false)} style={{ width: 40, height: 40, borderRadius: "14px", border: "none", background: "rgba(255,255,255,0.15)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}><Minus size={22} /></button>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div style={{ flex: 1, overflowY: "auto", padding: "28px", display: "flex", flexDirection: "column", gap: 24 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ animation: "floatEffect 4s infinite ease-in-out" }}>
                    <Billy mood="happy" size={130} />
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "20px 0 10px", letterSpacing: "-0.03em" }}>¡Hola, {userName}!</h3>
                  <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>¿En qué desafío financiero trabajamos hoy?</p>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ 
                    padding: "18px 22px", borderRadius: m.role === 'user' ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                    background: m.role === 'user' ? "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)" : "#fff",
                    color: m.role === 'user' ? "#fff" : "#1e293b",
                    boxShadow: m.role === 'user' ? "0 10px 24px rgba(15, 98, 254, 0.25)" : "0 4px 16px rgba(0,0,0,0.03)",
                    border: m.role === 'user' ? "none" : "1px solid rgba(15, 98, 254, 0.08)",
                    fontSize: 16, fontWeight: 500, maxWidth: "88%", lineHeight: 1.6
                  }}>
                    {renderMessageContent(m.content)}
                  </div>
                  {m.suggestions && m.suggestions.length > 0 && i === messages.length - 1 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                      {m.suggestions.map(s => (
                        <button key={s} onClick={() => sendMessage(s)} style={{ padding: "8px 16px", background: "#fff", border: "1.5px solid #0F62FE15", borderRadius: "12px", color: "#0F62FE", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f1f7ff"}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Billy mood="loading" size={32} />
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(d => <motion.div key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.25 }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#0F62FE" }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT SECTION */}
            <div style={{ padding: "24px 28px 28px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    ref={inputRef}
                    disabled={isLoading}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe tu duda aquí..."
                    style={{ width: "100%", padding: "16px 54px 16px 20px", borderRadius: "20px", border: "1.5px solid #f1f5f9", background: "#f8fafc", fontSize: 16, fontWeight: 600, outline: "none", transition: "all 0.3s" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#0F62FE35"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(15, 98, 254, 0.08)"; }}
                  />
                  <button onClick={toggleListening} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: isListening ? "#ef4444" : "#94a3b8", cursor: "pointer" }}><Mic size={22} fill={isListening ? "currentColor" : "none"} /></button>
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  style={{ width: 54, height: 54, borderRadius: "18px", border: "none", background: input.trim() ? "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)" : "#f1f5f9", color: input.trim() ? "#fff" : "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", boxShadow: input.trim() ? "0 10px 20px rgba(15, 98, 254, 0.2)" : "none", transition: "0.3s" }}
                  onMouseEnter={e => { if(input.trim()) e.currentTarget.style.transform = "scale(1.08) rotate(-4deg)" }}
                >
                  <Send size={22} fill="currentColor" />
                </button>
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
