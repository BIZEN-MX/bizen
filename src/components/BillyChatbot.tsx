"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  Minus,
  MessageCircle
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
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [userContext, setUserContext] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragControls = useDragControls()
  const { dbProfile, user } = useAuth()
  const adnProfile = dbProfile?.dnaProfile || "Sin Diagnosticar"
  const userName = dbProfile?.firstName || dbProfile?.fullName?.split(' ')[0] || "Estudiante"
  const userEmail = user?.email?.toLowerCase() || ""
  const isAnahuac = userEmail.endsWith('@anahuac.mx') || userEmail.endsWith('@bizen.mx')

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
    const handleOpen = (e: any) => {
      const context = e.detail?.context
      setIsOpen(true)
      setHasUnread(false)
      if (context) {
        sendMessage(context)
      }
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
      if (!isMobile) {
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300)
      }
      
      // Fetch fresh context when opening chat for "Real Analysis"
      if (!userContext) {
        fetch("/api/dashboard-init")
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setUserContext({
                stats: data.stats,
                transactions: data.transactions?.slice(0, 5),
                diagnostic: data.diagnostic,
                progress: data.progress?.length || 0,
                achievements: data.achievements?.map((a:any) => a.achievement?.name),
                investments: data.investments,
                inventory: data.inventory
              })
            }
          })
          .catch(err => console.error("Error fetching Billy context", err))
      }
    }
  }, [isOpen, isMobile])

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
          adnProfile: dbProfile?.dnaProfile || "Sin Diagnosticar",
          userContext: userContext, // Real financial context
          conversationHistory: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }),
      })
      
      const data = await api.json()
      const response = data?.response || "¡Ups! Tuvimos un hipo creativo. Intenta de nuevo."
      
      let suggestions: string[] = []
      if (response.toLowerCase().includes("ahorro")) suggestions = ["¿Cómo hago un presupuesto?", "¿Cómo ahorrar más?"]
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

  const renderMessageContent = (content: string, role: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ')
      let processedLine = line.trim().replace(/^[*|-]\s+/, '')
      const boldParts = processedLine.split(/(\*\*.*?\*\*)/g)
      
      const renderedLine = boldParts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={pIdx} className={`font-extrabold ${role === 'user' ? 'text-white' : 'text-primary'}`}>
              {part.slice(2, -2)}
            </span>
          )
        }
        return part
      })

      if (isBullet) {
        return (
          <div key={idx} className="flex gap-2 mb-1.5 pl-1.5">
            <span className={`font-black ${role === 'user' ? 'text-white/80' : 'text-primary'}`}>•</span>
            <span className="flex-1">{renderedLine}</span>
          </div>
        )
      }
      return <p key={idx} className="m-0 mb-2.5 last:mb-0">{renderedLine}</p>
    })
  }

  const UI = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40, x: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40, x: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          drag
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          className="fixed z-[10002] flex flex-col overflow-hidden bg-white/80 backdrop-blur-2xl saturate-150 border border-white/50 shadow-[0_40px_100px_rgba(15,23,42,0.18),0_4px_24px_rgba(15,98,254,0.06)] rounded-[36px] w-[calc(100vw-32px)] h-[70vh] right-4 bottom-24 md:w-[420px] md:h-[600px] md:right-8 md:bottom-[120px]"
        >
          {/* HEADER */}
          <div 
            onPointerDown={(e) => !isMobile && dragControls.start(e)}
            style={{ touchAction: "none" }}
            className={`relative flex items-center gap-4 px-6 py-5 md:px-7 md:py-6 cursor-grab active:cursor-grabbing ${isAnahuac ? 'bg-primary' : 'bg-gradient-to-br from-[#0b1e5e] to-[#0F62FE]'}`}
          >
            <div className="flex-shrink-0 flex items-center justify-center w-[52px] h-[52px] rounded-[18px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
              <Billy mood="chatbot" size={48} />
            </div>
            
            <div className="flex-1 select-none">
              <div className="text-white text-[19px] font-black tracking-tight leading-tight">
                Billy
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-white/75 text-[11px] font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                {isLoading ? "Escribiendo..." : (isAnahuac ? "León a tu servicio" : "Experto Activo")}
              </div>
            </div>

            <div className="flex gap-2.5">
              <button 
                onClick={() => { if(confirm('¿Seguro quieres borrar el historial de esta conversación?')) {setMessages([]); localStorage.removeItem('billy_chat_history');} }} 
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 text-white border-none cursor-pointer transition-colors hover:bg-white/25"
                title="Limpiar chat (borrar memoria)"
              >
                <Trash size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 text-white border-none cursor-pointer transition-colors hover:bg-white/25"
              >
                <Minus size={22} />
              </button>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 p-6 md:p-7">
            {messages.length === 0 && (
              <div className="text-center py-10 px-5">
                <div className="flex justify-center animate-[floatEffect_4s_infinite_ease-in-out]">
                  <Billy mood="chatbot" size={130} />
                </div>
                <h3 className="text-[26px] font-black text-slate-900 mt-5 mb-2.5 tracking-tight">
                  ¡Hola, {userName}!
                </h3>
                <p className="text-slate-500 text-base leading-relaxed max-w-[280px] mx-auto">
                  {adnProfile === "Sin Diagnosticar" 
                    ? "Antes de empezar, ¿quieres descubrir tu ADN Financiero para darte tips personalizados?"
                    : "¿En qué desafío financiero trabajamos hoy?"}
                </p>
                
                {adnProfile === "Sin Diagnosticar" && (
                    <button 
                        onClick={() => router.push('/dashboard?startTest=true')}
                        className={`mt-6 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ${isAnahuac ? 'bg-primary' : 'bg-blue-600'}`}
                    >
                        Comenzar Test 🧬
                    </button>
                )}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-5 py-4 text-[15px] md:text-[16px] font-medium max-w-[88%] leading-relaxed ${
                  m.role === 'user' 
                    ? `rounded-[24px_24px_4px_24px] text-white border-none ${isAnahuac ? 'bg-primary shadow-[0_10px_24px_rgba(255,89,0,0.25)]' : 'bg-gradient-to-br from-[#0b1e5e] to-[#0F62FE] shadow-[0_10px_24px_rgba(15,98,254,0.25)]'}`
                    : "rounded-[24px_24px_24px_4px] bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-primary/10"
                }`}>
                  {renderMessageContent(m.content, m.role)}
                </div>
                
                {m.suggestions && m.suggestions.length > 0 && i === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2.5 mt-3">
                    {m.suggestions.map(s => (
                      <button 
                        key={s} 
                        onClick={() => sendMessage(s)} 
                        className="px-4 py-2 bg-white border-[1.5px] border-primary/10 rounded-xl text-primary text-[13px] font-bold cursor-pointer transition-colors hover:bg-blue-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <Billy mood="chatbot" size={32} />
                <div className="flex gap-1.5 p-3 rounded-full bg-white border border-primary/10 shadow-sm">
                  {[0, 1, 2].map(d => (
                    <motion.div 
                      key={d} 
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }} 
                      transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} 
                      className="w-2 h-2 rounded-full bg-primary" 
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT SECTION */}
          <div className="p-5 md:p-6 bg-white border-t border-slate-100 shrink-0">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative group">
                <input
                  ref={inputRef}
                  disabled={isLoading}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu duda aquí..."
                  className="w-full py-4 pr-[50px] pl-5 rounded-2xl border-[1.5px] border-slate-100 bg-slate-50 text-[15px] font-semibold outline-none transition-all duration-300 focus:border-primary/30 focus:bg-white focus:shadow-[0_8px_30px_rgba(15,98,254,0.08)] disabled:opacity-50"
                />
                <button 
                  onClick={toggleListening} 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer transition-colors ${
                    isListening ? 'text-red-500' : 'text-slate-400 hover:text-primary'
                  }`}
                  title="Hablar con Billy"
                >
                  <Mic size={22} fill={isListening ? "currentColor" : "none"} />
                </button>
              </div>
              
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className={`flex items-center justify-center w-[54px] h-[54px] rounded-2xl border-none transition-all duration-300 ${
                  input.trim() && !isLoading
                    ? `text-white cursor-pointer hover:scale-105 hover:-rotate-3 ${isAnahuac ? 'bg-primary shadow-[0_10px_20px_rgba(255,89,0,0.2)]' : 'bg-gradient-to-br from-[#0b1e5e] to-[#0F62FE] shadow-[0_10px_20px_rgba(15,98,254,0.2)]'}`
                    : "bg-slate-100 text-slate-300 cursor-default"
                }`}
              >
                <Send size={20} fill="currentColor" className={input.trim() && !isLoading ? "ml-1" : ""} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!mounted || !portal) return null
  return createPortal(UI, portal)
}
