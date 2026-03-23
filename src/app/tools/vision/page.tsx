"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Sparkles, Plus, Trash2, Target, PiggyBank, TrendingDown,
  Loader2, Copy, CheckCircle, AlertTriangle, ZoomIn, ZoomOut,
  Maximize2, RotateCcw, AlignLeft, ListChecks, Wand2, GripVertical,
  X, StickyNote, Flame, BarChart, Move, Layers, Image, ChevronDown
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type CardType = "goal" | "savings" | "debt" | "note"
type Priority = "alta" | "media" | "baja"

interface CanvasCard {
  id: string
  type: CardType
  title: string
  body: string
  x: number
  y: number
  priority?: Priority
  progress?: number   // 0-100, only for "goal" type
  deadline?: string   // date string
  color?: string      // custom color override for "note" type
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_CONFIG: Record<CardType, {
  label: string; icon: React.ElementType; bg: string; border: string;
  accent: string; titleColor: string
}> = {
  goal:    { label: "Meta",     icon: Target,       bg: "linear-gradient(145deg,#faf5ff,#f3e8ff)", border: "#c4b5fd", accent: "#8b5cf6", titleColor: "#6d28d9" },
  savings: { label: "Ahorro",   icon: PiggyBank,    bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", border: "#86efac", accent: "#10b981", titleColor: "#065f46" },
  debt:    { label: "Deuda",    icon: TrendingDown, bg: "linear-gradient(145deg,#fff1f2,#ffe4e6)", border: "#fca5a5", accent: "#ef4444", titleColor: "#991b1b" },
  note:    { label: "Nota",     icon: StickyNote,   bg: "linear-gradient(145deg,#fefce8,#fef9c3)", border: "#fde68a", accent: "#f59e0b", titleColor: "#78350f" },
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  alta:  { label: "Alta",  color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
  media: { label: "Media", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  baja:  { label: "Baja",  color: "#10b981", bg: "rgba(16,185,129,0.1)" },
}

const NOTE_COLORS = ["#fef9c3", "#dcfce7", "#dbeafe", "#fce7f3", "#f3e8ff", "#ffedd5"]

const AI_ACTIONS = [
  { id: "enrich",     label: "Expandir visión",     description: "Transforma tus ideas en un plan estructurado",       icon: Sparkles,    color: "#8b5cf6" },
  { id: "steps",      label: "Roadmap 30-60-90d",   description: "Genera pasos de acción para los próximos 3 meses",  icon: ListChecks,  color: "#0B71FE" },
  { id: "summary",    label: "Mantra financiero",   description: "Resume tu canvas en 3 oraciones de impacto",        icon: AlignLeft,   color: "#10b981" },
  { id: "brainstorm", label: "Brainstorm con Billy", description: "Billy genera 5 ideas de metas que deberías tener", icon: Flame,       color: "#f97316" },
]

const uid = () => Math.random().toString(36).slice(2, 9)

const INITIAL_CARDS: CanvasCard[] = [
  { id: uid(), type: "goal",    title: "Comprar mi depa",      body: "Juntar $300,000 de enganche en 5 años", x: 80,   y: 80,   priority: "alta",  progress: 15 },
  { id: uid(), type: "savings", title: "Fondo de emergencia",  body: "Meta: $30,000 (3 meses de gastos)",      x: 380,  y: 80,   priority: "alta"  },
  { id: uid(), type: "debt",    title: "Tarjeta de crédito",   body: "$8,000 al 18% anual — eliminar en 12 meses", x: 680, y: 80,  priority: "alta"  },
  { id: uid(), type: "goal",    title: "Viaje a Japón",        body: "Presupuesto: $60,000 — en 18 meses",    x: 80,   y: 330,  priority: "media", progress: 5 },
  { id: uid(), type: "savings", title: "Inversión mensual",    body: "CETES + ETFs: $2,000/mes automático",   x: 380,  y: 330,  priority: "media" },
  { id: uid(), type: "note",    title: "🔑 Regla de oro",      body: "Pagar primero → luego gastar. Nunca al revés.", x: 680, y: 330 },
]

// ─── Draggable Card Component ─────────────────────────────────────────────────

function CanvasCardComponent({
  card,
  onUpdate,
  onDelete,
  onDrag,
}: {
  card: CanvasCard
  onUpdate: (id: string, updates: Partial<CanvasCard>) => void
  onDelete: (id: string) => void
  onDrag: (id: string, x: number, y: number) => void
}) {
  const cfg = CARD_CONFIG[card.type]
  const Icon = cfg.icon
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showPriorityPicker, setShowPriorityPicker] = useState(false)

  const cardBg = card.type === "note" && card.color
    ? `linear-gradient(145deg, ${card.color}, ${card.color}dd)`
    : cfg.bg

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        onDrag(card.id, card.x + info.offset.x, card.y + info.offset.y)
      }}
      initial={{ x: card.x, y: card.y, opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileDrag={{ scale: 1.04, zIndex: 100, boxShadow: "0 28px 56px rgba(0,0,0,0.2)" }}
      style={{
        position: "absolute",
        width: card.type === "note" ? 210 : 250,
        cursor: "grab",
        borderRadius: 20,
        border: `2px solid ${cfg.border}`,
        background: cardBg,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        userSelect: "none",
      }}
    >
      {/* Card header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7, padding: "11px 12px 9px",
        borderBottom: `1px solid ${cfg.border}`, background: "rgba(255,255,255,0.5)",
        borderRadius: "18px 18px 0 0",
      }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${cfg.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={13} color={cfg.accent} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, color: cfg.accent, textTransform: "uppercase", letterSpacing: "0.08em", flex: 1 }}>{cfg.label}</span>

        {/* Priority badge */}
        {card.priority && card.type !== "note" && (
          <div style={{ position: "relative" }}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setShowPriorityPicker(p => !p) }}
              style={{
                background: PRIORITY_CONFIG[card.priority!].bg, border: "none", borderRadius: 6,
                padding: "3px 7px", fontSize: 9, fontWeight: 700, cursor: "pointer",
                color: PRIORITY_CONFIG[card.priority!].color, fontFamily: "inherit"
              }}
            >
              {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)} ▾
            </button>
            {showPriorityPicker && (
              <div onPointerDown={e => e.stopPropagation()} style={{
                position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #e2e8f0",
                borderRadius: 10, padding: 6, zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 90
              }}>
                {(["alta", "media", "baja"] as Priority[]).map(p => (
                  <button key={p} onClick={() => { onUpdate(card.id, { priority: p }); setShowPriorityPicker(false) }}
                    style={{
                      display: "flex", width: "100%", alignItems: "center", gap: 6, padding: "5px 8px",
                      background: "none", border: "none", cursor: "pointer", borderRadius: 7, fontFamily: "inherit",
                      fontSize: 11, fontWeight: 600, color: PRIORITY_CONFIG[p].color,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = PRIORITY_CONFIG[p].bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: PRIORITY_CONFIG[p].color }} />
                    {PRIORITY_CONFIG[p].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Color picker for notes */}
        {card.type === "note" && (
          <div style={{ position: "relative" }}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setShowColorPicker(p => !p) }}
              style={{
                width: 16, height: 16, borderRadius: "50%",
                background: card.color || "#fef9c3",
                border: "2px solid rgba(0,0,0,0.15)", cursor: "pointer"
              }}
            />
            {showColorPicker && (
              <div onPointerDown={e => e.stopPropagation()} style={{
                position: "absolute", top: "100%", right: 0, background: "white",
                border: "1px solid #e2e8f0", borderRadius: 10, padding: 8, zIndex: 200,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", gap: 6, flexWrap: "wrap", width: 120
              }}>
                {NOTE_COLORS.map(c => (
                  <button key={c} onClick={() => { onUpdate(card.id, { color: c }); setShowColorPicker(false) }}
                    onPointerDown={e => e.stopPropagation()}
                    style={{
                      width: 24, height: 24, borderRadius: "50%", background: c, border: card.color === c ? "2px solid #0B71FE" : "2px solid transparent",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => onDelete(card.id)}
          onPointerDown={e => e.stopPropagation()}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2, display: "flex" }}
        >
          <X size={12} />
        </button>
        <GripVertical size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
      </div>

      {/* Title */}
      <div style={{ padding: "9px 12px 3px" }}>
        <input
          value={card.title}
          onChange={e => onUpdate(card.id, { title: e.target.value })}
          onPointerDown={e => e.stopPropagation()}
          placeholder="Título..."
          style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 13, fontWeight: 700, color: cfg.titleColor, fontFamily: "inherit", padding: 0 }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: "3px 12px" }}>
        <textarea
          value={card.body}
          onChange={e => onUpdate(card.id, { body: e.target.value })}
          onPointerDown={e => e.stopPropagation()}
          placeholder="Agrega detalles..."
          rows={3}
          style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 11.5, color: "#475569", fontFamily: "inherit", resize: "none", padding: 0, lineHeight: 1.55 }}
        />
      </div>

      {/* Progress bar — only for goals */}
      {card.type === "goal" && (
        <div style={{ padding: "0 12px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.06em" }}>Progreso</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#6d28d9" }}>{card.progress ?? 0}%</span>
          </div>
          <div style={{ height: 5, background: "#e9d5ff", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${card.progress ?? 0}%`, height: "100%", background: "linear-gradient(90deg, #8b5cf6, #a78bfa)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
          <input
            type="range" min={0} max={100}
            value={card.progress ?? 0}
            onChange={e => onUpdate(card.id, { progress: parseInt(e.target.value) })}
            onPointerDown={e => e.stopPropagation()}
            style={{ width: "100%", marginTop: 5, accentColor: "#8b5cf6", cursor: "pointer", height: 4 }}
          />
        </div>
      )}

      {/* Deadline — for goals and savings */}
      {(card.type === "goal" || card.type === "savings") && (
        <div style={{ padding: "0 12px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Fecha límite:</span>
          <input
            type="date"
            value={card.deadline || ""}
            onChange={e => onUpdate(card.id, { deadline: e.target.value })}
            onPointerDown={e => e.stopPropagation()}
            style={{ fontSize: 10, border: "none", outline: "none", background: "transparent", color: "#475569", fontFamily: "inherit", cursor: "pointer" }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function VisionCanvasPage() {
  const [cards, setCards] = useState<CanvasCard[]>(INITIAL_CARDS)
  const [scale, setScale] = useState(0.85)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 })

  const [aiResult, setAiResult] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [aiError, setAiError] = useState("")
  const [copied, setCopied] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Canvas panning via middle mouse or Alt + drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey) {
      setIsPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
      e.preventDefault()
    }
  }, [pan])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      setPan({
        x: panStart.current.px + (e.clientX - panStart.current.x),
        y: panStart.current.py + (e.clientY - panStart.current.y),
      })
    }
  }, [isPanning])

  const handleMouseUp = useCallback(() => setIsPanning(false), [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => Math.min(2, Math.max(0.3, s - e.deltaY * 0.001)))
  }, [])

  const addCard = (type: CardType) => {
    const newCard: CanvasCard = {
      id: uid(), type,
      title: type === "goal" ? "Nueva meta" : type === "savings" ? "Nuevo ahorro" : type === "debt" ? "Nueva deuda" : "Nueva nota",
      body: "",
      x: 200 + Math.random() * 500,
      y: 200 + Math.random() * 300,
      priority: type !== "note" ? "media" : undefined,
      progress: type === "goal" ? 0 : undefined,
    }
    setCards(prev => [...prev, newCard])
  }

  const updateCard = useCallback((id: string, updates: Partial<CanvasCard>) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])

  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(c => c.id !== id))
  }, [])

  const onDrag = useCallback((id: string, x: number, y: number) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, x, y } : c))
  }, [])

  // ── Auto-arrange: group by type in columns
  const autoArrange = () => {
    const types: CardType[] = ["goal", "savings", "debt", "note"]
    const grouped: Record<string, CanvasCard[]> = { goal: [], savings: [], debt: [], note: [] }
    cards.forEach(c => grouped[c.type].push(c))
    const newCards: CanvasCard[] = []
    let col = 0
    for (const type of types) {
      grouped[type].forEach((card, row) => {
        newCards.push({ ...card, x: col * 300 + 80, y: row * 260 + 80 })
      })
      if (grouped[type].length > 0) col++
    }
    setCards(newCards)
  }

  // ── Stats
  const stats = {
    goals: cards.filter(c => c.type === "goal").length,
    savings: cards.filter(c => c.type === "savings").length,
    debts: cards.filter(c => c.type === "debt").length,
    notes: cards.filter(c => c.type === "note").length,
    avgProgress: cards.filter(c => c.type === "goal" && c.progress != null).reduce((s, c) => s + (c.progress ?? 0), 0) / (cards.filter(c => c.type === "goal").length || 1),
    highPriority: cards.filter(c => c.priority === "alta").length,
  }

  // ── Billy AI
  const buildCanvasSummary = () =>
    cards.map(c => {
      let line = `[${CARD_CONFIG[c.type].label.toUpperCase()}] ${c.title}: ${c.body}`
      if (c.priority) line += ` (Prioridad: ${c.priority})`
      if (c.type === "goal" && c.progress != null) line += ` — Progreso: ${c.progress}%`
      if (c.deadline) line += ` — Fecha límite: ${c.deadline}`
      return line
    }).join("\n")

  const handleAiAction = async (actionId: string) => {
    if (cards.length === 0) { setAiError("Agrega tarjetas al canvas primero."); return }
    setAiLoading(true)
    setActiveAction(actionId)
    setAiResult("")
    setAiError("")
    setShowAiPanel(true)
    try {
      const content = buildCanvasSummary()
      const action = actionId === "brainstorm" ? "enrich" : actionId
      const customPrompt = actionId === "brainstorm"
        ? `El usuario tiene estas metas financieras: ${content}\n\nBasándote en su perfil, genera 5 ideas de metas financieras que le FALTAN y que debería considerar. Sé específico con montos y plazos realistas. Formato: "**Idea N: [nombre]**: [detalle breve]". Máximo 120 palabras.`
        : undefined

      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: customPrompt || content, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.details || data.error)
      setAiResult(data.result)
    } catch (err: any) {
      setAiError(err.message || "Error al conectar con la IA")
    } finally {
      setAiLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeActionConfig = AI_ACTIONS.find(a => a.id === activeAction)

  return (
    <>
      <style>{`
        .canvas-outer {
          width: 100%; height: 100vh; display: flex; flex-direction: column;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Arial, sans-serif;
          overflow: hidden;
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .canvas-outer { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .canvas-outer { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }
        .canvas-toolbar {
          display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;
          padding: 10px 20px; background: white;
          border-bottom: 1px solid #f1f5f9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          position: relative; z-index: 20; flex-shrink: 0; overflow-x: auto;
        }
        .toolbar-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 12px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: white; font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.15s; color: #64748b; white-space: nowrap; flex-shrink: 0;
        }
        .toolbar-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
        .toolbar-sep { width: 1px; height: 24px; background: #e2e8f0; flex-shrink: 0; }
        .canvas-bg {
          flex: 1; position: relative; overflow: hidden;
          background-color: #eef1f6;
          background-image: radial-gradient(#c9d3de 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .add-type-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px; border-radius: 9px; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
          border-width: 1.5px; border-style: solid; flex-shrink: 0; white-space: nowrap;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ai-fade { animation: fadeUp 0.35s cubic-bezier(0.16,1,0.3,1); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; display: inline-block; }
        .canvas-stage {
          position: absolute; top: 0; left: 0; width: 3000px; height: 2000px;
        }
        .stats-bar {
          background: white; border-top: 1px solid #f1f5f9; padding: 8px 20px;
          display: flex; align-items: center; gap: 24px; flex-shrink: 0;
          font-size: 12px; color: #64748b; box-shadow: 0 -2px 8px rgba(0,0,0,0.03);
        }
        .stat-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 11px;
        }
        input[type="range"] { height: 4px; }
      `}</style>

      <div className="canvas-outer">

        {/* ── Toolbar ── */}
        <div className="canvas-toolbar">
          <Link href="/cash-flow" style={{ textDecoration: "none", flexShrink: 0 }}>
            <button className="toolbar-btn"><ArrowLeft size={13} /> Volver</button>
          </Link>

          <div className="toolbar-sep" />

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={13} color="#8b5cf6" />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", margin: 0 }}>Vision Canvas</p>
              <p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cards.length} tarjetas</p>
            </div>
          </div>

          <div className="toolbar-sep" />

          {/* Add card buttons */}
          {([
            { type: "goal",    emoji: "🎯" },
            { type: "savings", emoji: "💰" },
            { type: "debt",    emoji: "📉" },
            { type: "note",    emoji: "📝" },
          ] as { type: CardType; emoji: string }[]).map(({ type, emoji }) => {
            const cfg = CARD_CONFIG[type]
            return (
              <button
                key={type}
                className="add-type-btn"
                onClick={() => addCard(type)}
                style={{ borderColor: cfg.border, color: cfg.accent, background: "white" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${cfg.accent}10`)}
                onMouseLeave={e => (e.currentTarget.style.background = "white")}
              >
                <Plus size={11} /> {emoji} {cfg.label}
              </button>
            )
          })}

          <div className="toolbar-sep" />

          {/* Auto-arrange */}
          <button className="toolbar-btn" onClick={autoArrange} title="Organizar automáticamente por tipo">
            <Layers size={13} /> Auto-organizar
          </button>

          {/* Reset */}
          <button className="toolbar-btn" onClick={() => setCards(INITIAL_CARDS)} title="Restaurar ejemplo">
            <RotateCcw size={13} />
          </button>

          <div className="toolbar-sep" />

          {/* Zoom controls */}
          <button className="toolbar-btn" onClick={() => setScale(s => Math.min(2, s + 0.15))}><ZoomIn size={13} /></button>
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, minWidth: 34, textAlign: "center", flexShrink: 0 }}>
            {Math.round(scale * 100)}%
          </span>
          <button className="toolbar-btn" onClick={() => setScale(s => Math.max(0.3, s - 0.15))}><ZoomOut size={13} /></button>
          <button className="toolbar-btn" onClick={() => { setScale(0.85); setPan({ x: 0, y: 0 }) }}><Maximize2 size={13} /></button>

          <div style={{ flex: 1 }} />

          {/* Alt + drag hint */}
          <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
            <Move size={10} /> Alt+arrastrar para mover
          </span>

          <div className="toolbar-sep" />

          {/* Billy AI button */}
          <button
            onClick={() => setShowAiPanel(p => !p)}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
              borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
              background: showAiPanel ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "linear-gradient(135deg,#8b5cf6,#7c3aed)",
              color: "white", fontSize: 12, fontWeight: 700,
              boxShadow: "0 4px 14px rgba(139,92,246,0.35)", flexShrink: 0
            }}
          >
            <Sparkles size={13} /> Billy IA
          </button>
        </div>

        {/* ── Main canvas + AI panel ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Canvas area */}
          <div
            ref={canvasRef}
            className="canvas-bg"
            style={{ flex: 1, cursor: isPanning ? "grabbing" : "default" }}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
          >
            <div
              className="canvas-stage"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              {cards.map(card => (
                <CanvasCardComponent
                  key={card.id}
                  card={card}
                  onUpdate={updateCard}
                  onDelete={deleteCard}
                  onDrag={onDrag}
                />
              ))}

              {cards.length === 0 && (
                <div style={{ position: "absolute", top: 300, left: 500, textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#94a3b8" }}>Canvas vacío — agrega tarjetas arriba</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Side Panel */}
          <AnimatePresence>
            {showAiPanel && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 360, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                style={{
                  flexShrink: 0, background: "white", borderLeft: "1px solid #f1f5f9",
                  display: "flex", flexDirection: "column",
                  boxShadow: "-4px 0 20px rgba(0,0,0,0.06)", overflowY: "auto", overflowX: "hidden"
                }}
              >
                {/* Panel header */}
                <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Wand2 size={16} color="#8b5cf6" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>Billy IA</p>
                      <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Gemini 2.5 Flash</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAiPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                    <X size={15} />
                  </button>
                </div>

                {/* Actions */}
                <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                    Analizar canvas ({cards.length} tarjetas)
                  </p>
                  {AI_ACTIONS.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleAiAction(action.id)}
                      disabled={aiLoading}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderRadius: 12,
                        border: `1.5px solid ${activeAction === action.id ? action.color + "40" : "#f1f5f9"}`,
                        background: activeAction === action.id ? `${action.color}08` : "white",
                        cursor: aiLoading ? "not-allowed" : "pointer",
                        opacity: aiLoading && activeAction !== action.id ? 0.55 : 1,
                        textAlign: "left", fontFamily: "inherit", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!aiLoading) e.currentTarget.style.borderColor = action.color + "50" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = activeAction === action.id ? action.color + "40" : "#f1f5f9" }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${action.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {aiLoading && activeAction === action.id
                          ? <Loader2 size={14} color={action.color} className="spin" />
                          : <action.icon size={14} color={action.color} />
                        }
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", margin: "0 0 1px" }}>{action.label}</p>
                        <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, lineHeight: 1.35 }}>{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* AI Result */}
                {(aiResult || aiError) && (
                  <div className="ai-fade" style={{ padding: "0 20px 20px", flex: 1 }}>
                    {aiError ? (
                      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 14px", color: "#dc2626", fontSize: 12 }}>
                        {aiError}
                      </div>
                    ) : (
                      <div style={{ background: "linear-gradient(135deg,#faf5ff,#f0f9ff)", border: `1.5px solid ${activeActionConfig?.color || "#8b5cf6"}25`, borderRadius: 14, padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            {activeActionConfig && <activeActionConfig.icon size={13} color={activeActionConfig.color} />}
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{activeActionConfig?.label}</span>
                          </div>
                          <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: copied ? "#f0fdf4" : "white", border: `1px solid ${copied ? "#86efac" : "#e2e8f0"}`, borderRadius: 7, cursor: "pointer", fontSize: 10, fontWeight: 600, color: copied ? "#16a34a" : "#64748b", fontFamily: "inherit" }}>
                            {copied ? <><CheckCircle size={10} /> Copiado</> : <><Copy size={10} /> Copiar</>}
                          </button>
                        </div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                          {aiResult.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                            part.startsWith("**") && part.endsWith("**")
                              ? <strong key={i} style={{ color: "#1e293b", display: "block", marginTop: i > 0 ? 10 : 0, marginBottom: 2, fontSize: 11 }}>{part.slice(2, -2)}</strong>
                              : <span key={i}>{part}</span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, padding: "7px 9px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 7 }}>
                          <AlertTriangle size={10} color="#d97706" />
                          <span style={{ fontSize: 9, color: "#92400e" }}>Solo fines educativos.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Canvas stats */}
                <div style={{ padding: "0 20px 20px", marginTop: "auto" }}>
                  <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: "14px" }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" }}>Resumen del canvas</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Metas",      value: stats.goals,       color: "#8b5cf6" },
                        { label: "Ahorros",    value: stats.savings,     color: "#10b981" },
                        { label: "Deudas",     value: stats.debts,       color: "#ef4444" },
                        { label: "Prioridad Alta", value: stats.highPriority, color: "#f97316" },
                      ].map(s => (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 9px", background: "white", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                          <div>
                            <p style={{ fontSize: 16, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                            <p style={{ fontSize: 9, color: "#94a3b8", margin: 0 }}>{s.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {stats.goals > 0 && (
                      <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(139,92,246,0.06)", borderRadius: 8 }}>
                        <p style={{ fontSize: 10, color: "#6d28d9", margin: 0 }}>
                          Progreso promedio de metas: <strong>{Math.round(stats.avgProgress)}%</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Stats bar ── */}
        <div className="stats-bar">
          <div className="stat-pill" style={{ background: "rgba(139,92,246,0.08)", color: "#8b5cf6" }}>
            🎯 {stats.goals} metas
          </div>
          <div className="stat-pill" style={{ background: "rgba(16,185,129,0.08)", color: "#10b981" }}>
            💰 {stats.savings} ahorros
          </div>
          <div className="stat-pill" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>
            📉 {stats.debts} deudas
          </div>
          <div className="stat-pill" style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}>
            📝 {stats.notes} notas
          </div>
          {stats.goals > 0 && (
            <div className="stat-pill" style={{ background: "rgba(11,113,254,0.08)", color: "#0B71FE" }}>
              <BarChart size={11} /> {Math.round(stats.avgProgress)}% progreso promedio
            </div>
          )}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8" }}>
            Scroll para hacer zoom · Alt+arrastrar para mover el canvas
          </span>
        </div>
      </div>
    </>
  )
}
