"use client"

import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Heart, 
  Bookmark, 
  Share2, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Trophy, 
  X, 
  Check, 
  Zap,
  Bot,
  Coins,
  Brain,
  CheckCircle2,
  XCircle,
  BarChart3,
  Newspaper,
  Monitor,
  Play,
  Pause
} from "lucide-react"
import { LeftStatsWidget, RightNavigationWidget } from "./DesktopWidgets"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ───────────────────────────────────────────────────────────────────
type BiteType = "video" | "quiz" | "news_card"

interface Bite {
  id: string
  type: BiteType
  title: string
  description: string
  category: string
  categoryColor: string
  videoId?: string        // YouTube Short ID
  videoUrl?: string       // Direct MP4 link (GCS)
  thumbnailUrl?: string
  creatorName?: string
  creatorAvatar?: string
  quizQuestion?: string
  quizOptions?: string[]
  quizCorrectIndex?: number
  quizExplanation?: string
  headline?: string
  source?: string
  sourceDate?: string
  gradient?: string
}

const BITES: Bite[] = [
  {
    id: "bite-gcs-1",
    type: "video",
    title: "Lección BIZEN 1",
    description: "Contenido exclusivo de nuestra biblioteca en la nube.",
    category: "Inversión",
    categoryColor: "#10b981",
    videoUrl: "https://storage.googleapis.com/bizen-vids-vault/copy_29D4F9B0-14E9-4680-9A53-E380D8D20B05.MOV",
    creatorName: "BIZEN Expert",
  },
  {
    id: "bite-gcs-2",
    type: "video",
    title: "Lección BIZEN 2",
    description: "Aprendizaje acelerado con expertos financieros.",
    category: "Crédito",
    categoryColor: "#3b82f6",
    videoUrl: "https://storage.googleapis.com/bizen-vids-vault/copy_3F021138-76BE-4C82-8A4B-C83291927A2C.MOV",
    creatorName: "BIZEN Expert",
  },
  {
    id: "q1",
    type: "quiz",
    title: "Reto del Ahorro",
    description: "Pon a prueba tus conocimientos financieros.",
    category: "Quiz",
    categoryColor: "#f59e0b",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0b1e35 100%)",
    quizQuestion: "Si ahorras $100 con 10% de interés anual compuesto, ¿cuánto tienes al final del segundo año?",
    quizOptions: [
      "$120 pesos",
      "$121 pesos",
      "$110 pesos",
      "$200 pesos",
    ],
    quizCorrectIndex: 1,
    quizExplanation: "¡Correcto! El primer año ganas $10 (tienes $110). El segundo año ganas el 10% de esos $110, que son $11, totalizando $121. ¡Ese es el poder del interés sobre interés!",
  },
  {
    id: "bite-gcs-3",
    type: "video",
    title: "Lección BIZEN 3",
    description: "Domina tus finanzas personales hoy mismo.",
    category: "Ahorro",
    categoryColor: "#ef4444",
    videoUrl: "https://storage.googleapis.com/bizen-vids-vault/copy_4CE8D50A-7EFF-463E-81C6-F7B0B63B600F.MOV",
    creatorName: "BIZEN Expert",
  },
  {
    id: "n1",
    type: "news_card",
    title: "El S&P 500 en Máximos",
    description: "Las 500 empresas más grandes de EE.UU. están volando. ¿Es momento de entrar?",
    category: "Mercados",
    categoryColor: "#6366f1",
    gradient: "linear-gradient(135deg, #1a0533 0%, #0d1a3a 100%)",
    headline: "Oportunidad de Inversión",
    source: "BIZEN Markets",
    sourceDate: "Hoy",
  },
  {
    id: "bite-gcs-4",
    type: "video",
    title: "Lección BIZEN 4",
    description: "Estrategias avanzadas para el mundo moderno.",
    category: "Banca",
    categoryColor: "#ec4899",
    videoUrl: "https://storage.googleapis.com/bizen-vids-vault/copy_AB0DAB63-2B56-469F-BF7C-EC704D40E38B.MOV",
    creatorName: "BIZEN Expert",
  },
  {
    id: "bite-gcs-5",
    type: "video",
    title: "Lección BIZEN 5",
    description: "Entiende el mercado de capitales en minutos.",
    category: "Negocios",
    categoryColor: "#f59e0b",
    videoUrl: "https://storage.googleapis.com/bizen-vids-vault/copy_E2E698E1-4302-45B8-9903-A470C2CCFE96.MOV",
    creatorName: "BIZEN Expert",
  },
];

// ─── QuizSlide ────────────────────────────────────────────────────────────────
function QuizSlide({ bite, onBillyOpen }: { bite: Bite; onBillyOpen: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const handleSelect = (idx: number) => {
    if (locked) return
    setSelected(idx)
    setLocked(true)
  }

  const isCorrect = selected !== null && selected === bite.quizCorrectIndex
  const isWrong = selected !== null && selected !== bite.quizCorrectIndex

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bite.gradient ?? "linear-gradient(135deg, #1e3a5f 0%, #0b1e35 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 24px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Category badge */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(245,158,11,0.18)",
          border: "1px solid rgba(245,158,11,0.35)",
          color: "#fbbf24",
          borderRadius: 999,
          padding: "5px 14px",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 24,
          width: "fit-content",
        }}
      >
        <Trophy size={14} />
        Quick Quiz · Gana Bizcoins
      </span>

      <h2
        style={{
          fontSize: "clamp(20px, 5vw, 26px)",
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: 32,
          lineHeight: 1.3,
        }}
      >
        {bite.quizQuestion}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bite.quizOptions?.map((opt, idx) => {
          const isSel = selected === idx
          const isRight = locked && idx === bite.quizCorrectIndex
          const isWrongSel = locked && isSel && idx !== bite.quizCorrectIndex

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                padding: "14px 18px",
                borderRadius: 14,
                border: isRight
                  ? "2px solid #10b981"
                  : isWrongSel
                  ? "2px solid #ef4444"
                  : isSel
                  ? "2px solid #6366f1"
                  : "2px solid rgba(255,255,255,0.15)",
                background: isRight
                  ? "rgba(16,185,129,0.18)"
                  : isWrongSel
                  ? "rgba(239,68,68,0.18)"
                  : isSel
                  ? "rgba(99,102,241,0.18)"
                  : "rgba(255,255,255,0.06)",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 500,
                textAlign: "left",
                cursor: locked ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isRight
                    ? "#10b981"
                    : isWrongSel
                    ? "#ef4444"
                    : "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {isRight ? <Check size={14} /> : isWrongSel ? <X size={14} /> : String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {locked && (
        <div
          style={{
            marginTop: 20,
            padding: "16px 18px",
            borderRadius: 14,
            background: isCorrect ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 8 }}>
            {isCorrect ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
            <span>
              <strong>{isCorrect ? "¡Correcto! " : "No exactamente. "}</strong>
              {bite.quizExplanation}
            </span>
          </p>
          {isCorrect && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
              <Coins size={14} color="#fbbf24" fill="#fbbf24" style={{ opacity: 0.8 }} />
              <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>+10 Bizcoins ganados</span>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

// ─── NewsCard ─────────────────────────────────────────────────────────────────
function NewsCardSlide({ bite, onBillyOpen }: { bite: Bite; onBillyOpen: () => void }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bite.gradient ?? "linear-gradient(135deg, #0a1628 0%, #0d1f40 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "32px 24px 100px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Big decorative circle */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          right: "-10%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${bite.categoryColor}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Source & date */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {bite.source}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{bite.sourceDate}</span>
      </div>

      {/* Category */}
      <span
        style={{
          display: "inline-block",
          background: `${bite.categoryColor}22`,
          border: `1px solid ${bite.categoryColor}55`,
          color: bite.categoryColor,
          borderRadius: 999,
          padding: "4px 12px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 16,
          width: "fit-content",
        }}
      >
        {bite.category}
      </span>

      <h2
        style={{
          fontSize: "clamp(22px, 6vw, 30px)",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.2,
          marginBottom: 16,
        }}
      >
        {bite.title}
      </h2>

      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, marginBottom: 24 }}>
        {bite.description}
      </p>

      {bite.headline && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 16,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={18} color={bite.categoryColor} /> {bite.headline}
          </p>
        </div>
      )}

    </div>
  )
}

// ─── VideoSlide ───────────────────────────────────────────────────────────────
function VideoSlide({
  bite,
  isActive,
  onBillyOpen,
  onLike,
  onSave,
  liked,
  saved,
  muted,
  isAnahuac,
}: {
  bite: Bite
  isActive: boolean
  muted: boolean
  onBillyOpen: () => void
  onLike: () => void
  onSave: () => void
  liked: boolean
  saved: boolean
  isAnahuac: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Sync playback with isActive, isPaused and muted state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      if (!isPaused) {
        // Try to play
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay prevented:", error)
          })
        }
      } else {
        video.pause()
      }
    } else {
      // Not active: definitely pause, reset playback time and manual pause state
      video.pause()
      video.currentTime = 0
      setIsPaused(false)
    }
  }, [isActive, isPaused, muted])

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPaused(prev => !prev)
  }

  const videoUrl = bite.videoUrl
  const youtubeUrl = bite.videoId
    ? `https://www.youtube.com/embed/${bite.videoId}?autoplay=${isActive ? 1 : 0}&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${bite.videoId}&playsinline=1&rel=0&modestbranding=1`
    : null

  return (
    <div 
      style={{ 
        width: "100%", 
        height: "100%", 
        position: "relative", 
        background: "#000", 
        overflow: "hidden"
      }}
    >
      {/* Background Media */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            muted={muted}
            loop
            playsInline
            autoPlay={isActive}
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : youtubeUrl && (
          <iframe
            src={youtubeUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              transform: "scale(1.4)",
              transformOrigin: "center center",
            }}
            allow="autoplay; encrypted-media; picture-in-picture"
            title={bite.title}
          />
        )}
      </div>

      {/* Click Overlay (Captures play/pause toggles) */}
      <div 
        onClick={togglePlay}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          cursor: "pointer",
        }}
      />

      {/* Manual Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
              pointerEvents: "none"
            }}
          >
            <Play size={40} color="#fff" fill="#fff" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Progress Bar */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: "rgba(255,255,255,0.1)", zIndex: 10 }}>
        <div style={{ width: isActive ? "100%" : "0%", height: "100%", background: isAnahuac ? "#FF5900" : "#0B71FE", transition: isActive ? "width 60s linear" : "none" }} />
      </div>



      {/* Bottom info overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 80,
          padding: "32px 24px 110px",
          zIndex: 5,
        }}
      >
        {/* Creator Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: isAnahuac ? "#FF5900" : "#0B71FE",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}
          >
             {bite.creatorAvatar ? <img src={bite.creatorAvatar} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Zap size={18} color="#fff" />}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
              {bite.creatorName ?? "BIZEN Expert"}
              <CheckCircle2 size={14} color={isAnahuac ? "#FF5900" : "#0B71FE"} fill="#fff" />
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {bite.category}
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>
          {bite.title}
        </h3>

        <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, maxWidth: "90%" }}>
          {bite.description}
        </p>


      </div>

      {/* Right action column */}
      <div
        style={{
          position: "absolute",
          right: 20,
          bottom: "120px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onLike}
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: liked ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <Heart size={28} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#fff"} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginTop: 6, display: "block" }}>12.4k</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={onSave}
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: saved ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Bookmark size={26} fill={saved ? "#f59e0b" : "none"} color={saved ? "#f59e0b" : "#fff"} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginTop: 6, display: "block" }}>Guardar</span>
        </div>

        <button
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <Share2 size={26} color="#fff" />
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BitesPage() {
  const router = useRouter()
  const { user, dbProfile } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [likes, setLikes] = useState<Record<string, boolean>>({})
  const [saves, setSaves] = useState<Record<string, boolean>>({})
  const [muted, setMuted] = useState(true)

  const isAnahuac = (user?.emailAddresses?.[0]?.emailAddress || user?.email || "").toLowerCase().endsWith('@anahuac.mx') || (user?.emailAddresses?.[0]?.emailAddress || user?.email || "").toLowerCase().endsWith('@bizen.mx') || false;

  // Track which slide is in view via IntersectionObserver
  useEffect(() => {
    const slides = containerRef.current?.querySelectorAll("[data-bite-slide]")
    if (!slides) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.biteIndex)
            setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.6 }
    )
    slides.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const openBilly = useCallback((context: string) => {
    window.dispatchEvent(new CustomEvent("open-billy-chat", { detail: { context } }))
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050505",
        overflow: "hidden",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/* Cinematic Background for Desktop */}
      <div style={{
        position: "absolute",
        inset: -20,
        background: "linear-gradient(45deg, #0f172a 0%, #020617 100%)",
        filter: "blur(40px)",
        opacity: 0.6,
        zIndex: 0
      }} />

      {/* ── EXTERNAL HEADER (Top Left) ── */}
      <div
        className="bites-header"
        style={{
          position: "fixed",
          top: 32,
          left: 40,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 16,
          pointerEvents: "none",
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            pointerEvents: "auto",
            width: 48,
            height: 48,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(20px)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          <X size={24} />
        </button>

        <div className="bites-header-text" style={{ pointerEvents: "none" }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>BIZEN Bites</p>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Finanzas en 60 segundos</p>
        </div>

        <button
          onClick={() => setMuted((m) => !m)}
          style={{
            pointerEvents: "auto",
            width: 48,
            height: 48,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(20px)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            marginLeft: 8
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <button
          onClick={() => {
            const currentBite = BITES[activeIndex];
            const ctx = currentBite.type === "video" 
              ? `Estoy viendo un video titulado "${currentBite.title}". ${currentBite.description}`
              : currentBite.type === "quiz"
              ? `Respondí un quiz sobre "${currentBite.quizQuestion}" y necesito más explicación.`
              : `Respondí una noticia sobre "${currentBite.title}". ${currentBite.description}`;
            openBilly(ctx);
          }}
          className="bites-billy-btn"
          style={{
            pointerEvents: "auto",
            width: 48,
            height: 48,
            borderRadius: "16px",
            background: isAnahuac ? "linear-gradient(135deg, #FF5900 0%, #CC4700 100%)" : "linear-gradient(135deg, #0B71FE 0%, #0448A4 100%)",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(20px)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            marginLeft: 8,
            boxShadow: isAnahuac ? "0 8px 16px rgba(255, 89, 0, 0.3)" : "0 8px 16px rgba(11, 113, 254, 0.3)"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Bot size={22} color="#fff" />
        </button>
      </div>

      {/* Main Layout: Widgets + Simulator */}
      <div className="bites-main-layout flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 xl:gap-40 w-full max-w-[1800px] px-24 lg:px-48 relative z-1">

        
        {/* Left Widget: Stats */}
        <LeftStatsWidget 
          bizcoins={(dbProfile as any)?.bizcoins || 0}
          streak={(dbProfile as any)?.streak || 0}
          activeIndex={activeIndex}
          totalBites={BITES.length}
          onCategoryClick={() => {}}
          isAnahuac={isAnahuac}
          onBillyClick={() => {
            const currentBite = BITES[activeIndex];
            const ctx = currentBite.type === "video" 
              ? `Estoy viendo un video titulado "${currentBite.title}". ${currentBite.description}`
              : currentBite.type === "quiz"
              ? `Respondí un quiz sobre "${currentBite.quizQuestion}" y necesito más explicación.`
              : `Respondí una noticia sobre "${currentBite.title}". ${currentBite.description}`;
            openBilly(ctx);
          }}
        />

        {/* Realistic Phone Simulator */}
        <div 
          className="phone-bezel"
          style={{
            width: "100%",
            maxWidth: "430px",
            height: "880px",
            maxHeight: "92dvh",
            position: "relative",
            background: "#121212",
            borderRadius: "55px",
            boxShadow: "0 0 0 12px #222, 0 50px 100px -20px rgba(0,0,0,0.7), 0 0 0 14px #333",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.05)",
            margin: "0 60px"
          }}
        >
          {/* Side Buttons (Simulated) */}
          <div className="phone-btn-volume-up" />
          <div className="phone-btn-volume-down" />
          <div className="phone-btn-power" />

          {/* Dynamic Island / Notch */}
          <div 
            className="dynamic-island"
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110,
              height: 32,
              background: "#000",
              borderRadius: 18,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#111", border: "1px solid #222", marginLeft: 40 }} />
          </div>

          <div
            className="reels-container"
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              background: "#000",
              overflow: "hidden",
              borderRadius: "44px",
            }}
          >
            {/* Scroll container */}
            <div
              ref={containerRef}
              style={{
                width: "100%",
                height: "100%",
                overflowY: "scroll",
                scrollSnapType: "y mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {BITES.map((bite, idx) => (
                <div
                  key={bite.id}
                  data-bite-slide
                  data-bite-index={idx}
                  style={{
                    width: "100%",
                    height: "100%",
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {bite.type === "video" && (
                    <VideoSlide
                      bite={bite}
                      isActive={idx === activeIndex}
                      muted={muted}
                      isAnahuac={isAnahuac}
                      onBillyOpen={() => openBilly(`Estoy viendo un video titulado "${bite.title}". ${bite.description}`)}
                      onLike={() => setLikes((l) => ({ ...l, [bite.id]: !l[bite.id] }))}
                      onSave={() => setSaves((s) => ({ ...s, [bite.id]: !s[bite.id] }))}
                      liked={!!likes[bite.id]}
                      saved={!!saves[bite.id]}
                    />
                  )}
                  {bite.type === "quiz" && (
                    <QuizSlide
                      bite={bite}
                      onBillyOpen={() => openBilly(`Respondí un quiz sobre "${bite.quizQuestion}" y necesito más explicación.`)}
                    />
                  )}
                  {bite.type === "news_card" && (
                    <NewsCardSlide
                      bite={bite}
                      onBillyOpen={() => openBilly(`Respondí una noticia sobre "${bite.title}". ${bite.description}`)}
                    />
                  )}

                  {/* Swipe hint */}
                  {idx === BITES.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 120,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        animation: "bounce 2s ease-in-out infinite",
                        pointerEvents: "none",
                      }}
                    >
                      <ChevronUp size={24} color="rgba(255,255,255,0.4)" />
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Fin del feed por hoy</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

              {/* Progress dots (Floating inside phone) */}
              <div style={{ 
                position: "absolute", 
                bottom: 32, 
                left: "50%", 
                transform: "translateX(-50%)", 
                display: "flex", 
                gap: 6, 
                alignItems: "center",
                zIndex: 100,
                pointerEvents: "none"
              }}>
                {BITES.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === activeIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 999,
                      background: i === activeIndex ? (isAnahuac ? "#FF5900" : "#0B71FE") : "rgba(255,255,255,0.25)",
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: i === activeIndex ? (isAnahuac ? "0 0 10px rgba(255,89,0,0.5)" : "0 0 10px rgba(11, 113, 254, 0.5)") : "none"
                    }}
                  />
                ))}
              </div>
            </div>
        </div>

        {/* Right Widget: Navigation */}
        <RightNavigationWidget 
          bizcoins={(dbProfile as any)?.bizcoins || 0}
          streak={(dbProfile as any)?.streak || 0}
          activeIndex={activeIndex}
          totalBites={BITES.length}
          onCategoryClick={() => {}} 
          isAnahuac={isAnahuac}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: BITES_STYLES }} />
    </div>
  )
}

const BITES_STYLES = `
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-8px); }
  }
  ::-webkit-scrollbar { display: none; }
  @media (min-width: 1001px) {
    .phone-bezel { min-width: 430px; }
    .phone-btn-volume-up, .phone-btn-volume-down, .phone-btn-power {
      position: absolute; background: #222; border-radius: 2px; z-index: -1;
    }
    .phone-btn-volume-up { left: -15px; top: 180px; width: 4px; height: 50px; }
    .phone-btn-volume-down { left: -15px; top: 245px; width: 4px; height: 50px; }
    .phone-btn-power { right: -15px; top: 210px; width: 4px; height: 80px; }
  }
  @media (max-width: 1000px) {
    .bites-main-layout {
      padding: 0 !important;
      margin: 0 !important;
      max-width: none !important;
      height: 100% !important;
    }
    .phone-bezel {
      width: 100vw !important;
      max-width: 100vw !important;
      height: 100dvh !important;
      max-height: 100dvh !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      border: none !important;
      background: #000 !important;
      margin: 0 !important;
    }
    .phone-btn-volume-up, .phone-btn-volume-down, .phone-btn-power, .dynamic-island {
      display: none !important;
    }
    .reels-container {
      border-radius: 0 !important;
    }
    .bites-header {
      top: 24px !important;
      left: 24px !important;
      gap: 12px !important;
    }
    .bites-header-text {
      display: none;
    }
  }
`

