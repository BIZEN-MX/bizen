"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Sparkles, Plus, Target, PiggyBank, TrendingDown,
  Loader2, Copy, CheckCircle, AlertTriangle, ZoomIn, ZoomOut,
  Maximize2, RotateCcw, AlignLeft, ListChecks, Wand2, GripVertical,
  X, StickyNote, Flame, BarChart2, Move, Layers, ChevronDown,
  FileText, Filter, Calendar, Clock, TrendingUp, Download,
  Circle, Search, Save
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import { touchStreak } from "@/lib/streakClient"

// ─── Types ───────────────────────────────────────────────────────────────────

type CardType = "goal" | "savings" | "debt" | "note" | "income"
type Priority = "alta" | "media" | "baja"
type FilterType = "all" | CardType

interface CanvasCard {
  id: string
  type: CardType
  title: string
  body: string
  x: number
  y: number
  priority?: Priority
  progress?: number
  deadline?: string
  amount?: number
  color?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_CONFIG: Record<CardType, {
  label: string; Icon: React.ElementType
  bg: string; border: string; accent: string; titleColor: string
}> = {
  goal:    { label: "Meta",     Icon: Target,      bg: "linear-gradient(145deg,#faf5ff,#ede9fe)", border: "#c4b5fd", accent: "#7c3aed", titleColor: "#5b21b6" },
  savings: { label: "Ahorro",   Icon: PiggyBank,   bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", border: "#86efac", accent: "#059669", titleColor: "#065f46" },
  debt:    { label: "Deuda",    Icon: TrendingDown, bg: "linear-gradient(145deg,#fff1f2,#ffe4e6)", border: "#fca5a5", accent: "#dc2626", titleColor: "#991b1b" },
  note:    { label: "Nota",     Icon: StickyNote,   bg: "linear-gradient(145deg,#fefce8,#fef9c3)", border: "#fde68a", accent: "#d97706", titleColor: "#78350f" },
  income:  { label: "Ingreso",  Icon: TrendingUp,   bg: "linear-gradient(145deg,#eff6ff,#dbeafe)", border: "#93c5fd", accent: "#0F62FE", titleColor: "#1e40af" },
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  alta:  { label: "Alta",  color: "#dc2626", bg: "rgba(220,38,38,0.1)"  },
  media: { label: "Media", color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  baja:  { label: "Baja",  color: "#059669", bg: "rgba(5,150,105,0.1)" },
}

const NOTE_COLORS = ["#fef9c3","#dcfce7","#dbeafe","#fce7f3","#f3e8ff","#ffedd5","#cffafe"]

const AI_ACTIONS = [
  { id: "enrich",     label: "Expandir visión",     desc: "Transforma tus ideas en un plan estructurado",      Icon: Sparkles,   color: "#7c3aed" },
  { id: "steps",      label: "Roadmap 30-60-90d",   desc: "Pasos de acción para los próximos 3 meses",        Icon: ListChecks, color: "#0F62FE" },
  { id: "summary",    label: "Mantra financiero",   desc: "Resume tu canvas en 3 frases de impacto",          Icon: AlignLeft,  color: "#059669" },
  { id: "brainstorm", label: "Brainstorm con Billy", desc: "5 metas financieras que deberías considerar",     Icon: Flame,      color: "#f97316" },
  { id: "risks",      label: "Análisis de riesgos", desc: "Identifica riesgos en tu plan financiero",         Icon: AlertTriangle, color: "#dc2626" },
]

const uid = () => Math.random().toString(36).slice(2, 9)

const INITIAL_CARDS: CanvasCard[] = [
  { id: uid(), type: "goal",    title: "Comprar mi depa",      body: "Juntar $300,000 de enganche en 5 años", x: 80,  y: 80,  priority: "alta",  progress: 15, amount: 300000 },
  { id: uid(), type: "savings", title: "Fondo de emergencia",  body: "Meta: $30,000 (3 meses de gastos)",     x: 360, y: 80,  priority: "alta",  amount: 30000 },
  { id: uid(), type: "debt",    title: "Tarjeta de crédito",   body: "$8,000 al 18% anual — eliminar en 12 meses", x: 640, y: 80, priority: "alta", amount: 8000 },
  { id: uid(), type: "goal",    title: "Viaje a Japón",        body: "Presupuesto $60,000 — en 18 meses",    x: 80,  y: 340, priority: "media", progress: 5,  amount: 60000 },
  { id: uid(), type: "income",  title: "Freelance",            body: "Ingresos adicionales proyectados",      x: 360, y: 340, priority: "media", amount: 5000 },
  { id: uid(), type: "note",    title: "Regla de oro",         body: "Pagar primero, luego gastar. Nunca al revés.", x: 640, y: 340 },
]

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ pct, color, size = 32 }: { pct: number; color: string; size?: number }) {
  const r = (size - 4) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth={3} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${(Math.min(100,pct)/100)*circ} ${circ}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontSize: 8, fontWeight: 700, fill: color, fontFamily: "inherit" }}>
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

// ─── Canvas Card ─────────────────────────────────────────────────────────────

function CanvasCardComponent({ card, onUpdate, onDelete, onDrag }: {
  card: CanvasCard
  onUpdate: (id: string, u: Partial<CanvasCard>) => void
  onDelete: (id: string) => void
  onDrag: (id: string, x: number, y: number) => void
}) {
  const cfg = CARD_CONFIG[card.type]
  const { Icon } = cfg
  const [showPriorityPicker, setShowPriorityPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const rs = () => {
      if (titleRef.current) {
        titleRef.current.style.height = 'auto'
        titleRef.current.style.height = titleRef.current.scrollHeight + 'px'
      }
    }
    rs(); window.requestAnimationFrame(rs)
  }, [card.title])

  useEffect(() => {
    const rs = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
      }
    }
    rs(); window.requestAnimationFrame(rs)
  }, [card.body])

  const cardBg = card.type === "note" && card.color
    ? `linear-gradient(145deg,${card.color},${card.color}ee)`
    : cfg.bg

  return (
    <motion.div
      drag dragMomentum={false} dragElastic={0}
      onDragEnd={(_, info) => onDrag(card.id, card.x + info.offset.x, card.y + info.offset.y)}
      initial={{ x: card.x, y: card.y, opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      whileDrag={{ scale: 1.03, zIndex: 100, boxShadow: "0 24px 48px rgba(0,0,0,0.18)" }}
      style={{
        position: "absolute", width: card.type === "note" ? 215 : 255,
        cursor: "grab", borderRadius: 18,
        border: `1.5px solid ${cfg.border}`,
        background: cardBg,
        boxShadow: "0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        height: "auto",
        minHeight: "fit-content",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 11px 8px",
        borderBottom: `1px solid ${cfg.border}`,
        background: "rgba(255,255,255,0.55)",
        borderRadius: "17px 17px 0 0",
      }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: `${cfg.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={12} color={cfg.accent} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, color: cfg.accent, textTransform: "uppercase", letterSpacing: "0.08em", flex: 1 }}>
          {cfg.label}
        </span>

        {/* Priority badge */}
        {card.priority && card.type !== "note" && (
          <div style={{ position: "relative" }}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setShowPriorityPicker(p => !p) }}
              style={{
                background: PRIORITY_CONFIG[card.priority!].bg, border: "none", borderRadius: 5,
                padding: "2px 6px", fontSize: 9, fontWeight: 700, cursor: "pointer",
                color: PRIORITY_CONFIG[card.priority!].color, fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 3,
              }}
            >
              <Circle size={5} fill={PRIORITY_CONFIG[card.priority!].color} color={PRIORITY_CONFIG[card.priority!].color} />
              {PRIORITY_CONFIG[card.priority!].label}
              <ChevronDown size={8} />
            </button>
            {showPriorityPicker && (
              <div onPointerDown={e => e.stopPropagation()} style={{
                position: "absolute", top: "100%", right: 0, background: "white",
                border: "1px solid #e2e8f0", borderRadius: 10, padding: 5, zIndex: 200,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 88,
              }}>
                {(["alta","media","baja"] as Priority[]).map(p => (
                  <button key={p} onPointerDown={e => e.stopPropagation()}
                    onClick={() => { onUpdate(card.id, { priority: p }); setShowPriorityPicker(false) }}
                    style={{
                      display: "flex", width: "100%", alignItems: "center", gap: 6,
                      padding: "5px 8px", background: "none", border: "none",
                      cursor: "pointer", borderRadius: 6, fontFamily: "inherit",
                      fontSize: 11, fontWeight: 600, color: PRIORITY_CONFIG[p].color,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = PRIORITY_CONFIG[p].bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: PRIORITY_CONFIG[p].color }} />
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
            <button onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setShowColorPicker(p => !p) }}
              style={{ width: 14, height: 14, borderRadius: "50%", background: card.color || "#fef9c3", border: "2px solid rgba(0,0,0,0.15)", cursor: "pointer" }}
            />
            {showColorPicker && (
              <div onPointerDown={e => e.stopPropagation()} style={{
                position: "absolute", top: "100%", right: 0, background: "white",
                border: "1px solid #e2e8f0", borderRadius: 10, padding: 8, zIndex: 200,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", gap: 5, flexWrap: "wrap", width: 116,
              }}>
                {NOTE_COLORS.map(c => (
                  <button key={c} onPointerDown={e => e.stopPropagation()}
                    onClick={() => { onUpdate(card.id, { color: c }); setShowColorPicker(false) }}
                    style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: card.color === c ? "2px solid #0F62FE" : "2px solid transparent", cursor: "pointer" }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={() => onDelete(card.id)} onPointerDown={e => e.stopPropagation()}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 1, display: "flex" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#dc2626")}
          onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
        >
          <X size={12} />
        </button>
        <GripVertical size={11} color="#94a3b8" style={{ flexShrink: 0 }} />
      </div>

      {/* Amount badge */}
      {card.amount != null && card.amount > 0 && card.type !== "note" && (
        <div style={{ padding: "6px 11px 0", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: cfg.titleColor, letterSpacing: "-0.03em" }}>
            ${card.amount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Title */}
      <div style={{ padding: card.amount ? "2px 11px 3px" : "9px 11px 3px" }}>
        <textarea
            ref={titleRef}
            className="input-reset"
            value={card.title}
            onChange={(e) => onUpdate(card.id, { title: e.target.value })}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="Título..."
            rows={1}
            style={{
              width: "100%",
              fontWeight: 800,
              fontSize: 16.5,
              color: "#1e293b",
              marginBottom: 4,
              border: "none", outline: "none", background: "transparent", fontFamily: "inherit",
              resize: "none",
              overflow: "hidden",
              display: "block",
            }}
          />
      </div>

      {/* Body */}
      <div style={{ padding: "2px 11px" }}>
        <textarea
            ref={textareaRef}
            className="input-reset"
            value={card.body}
            onChange={(e) => {
              onUpdate(card.id, { body: e.target.value })
            }}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="Notas..."
            rows={1}
            style={{
              width: "100%",
              fontSize: 13.5,
              color: "#475569",
              lineHeight: 1.5,
              minHeight: 40,
              resize: "none",
              border: "none", outline: "none", background: "transparent", fontFamily: "inherit",
              overflow: "hidden",
              display: "block",
            }}
          />
      </div>

      {/* Amount input */}
      {card.type !== "note" && (
        <div style={{ padding: "4px 11px 6px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Monto:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 0 }}>
                <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 800 }}>$</span>
                <input
                  type="number"
                  className="input-reset"
                  value={card.amount || ""}
                  onChange={(e) => onUpdate(card.id, { amount: parseFloat(e.target.value) || 0 })}
                  onPointerDown={(e) => e.stopPropagation()}
                  placeholder="0.00"
                  style={{ 
                    fontWeight: 800, 
                    fontSize: 18, 
                    color: "#0F62FE", 
                    border: "none", 
                    outline: "none", 
                    background: "rgba(255,255,255,0.6)", 
                    fontFamily: "inherit", 
                    cursor: "pointer", 
                    width: 110, 
                    borderRadius: 6, 
                    padding: "4px 8px" 
                  }}
                />
              </div>
        </div>
      )}

      {/* Progress ring + slider for goals */}
      {card.type === "goal" && (
        <div style={{ padding: "0 11px 11px", display: "flex", alignItems: "center", gap: 8, width: "100%", boxSizing: "border-box" }}>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>Progreso:</span>
          <input type="range" min="0" max="100" value={card.progress || 0} onPointerDown={e => e.stopPropagation()}
            onChange={e => onUpdate(card.id, { progress: parseInt(e.target.value) })}
            style={{ flex: 1, accentColor: "#0F62FE", height: "6px", minWidth: 0, cursor: "pointer" }}
          />
          <span style={{ fontSize: 13, fontWeight: 900, color: "#0F62FE", width: 42, textAlign: "right", flexShrink: 0 }}>{card.progress || 0}%</span>
        </div>
      )}

      {/* Deadline */}
      {(card.type === "goal" || card.type === "savings") && (
        <div style={{ padding: "0 11px 11px", display: "flex", alignItems: "center", gap: 10 }}>
          <Calendar size={15} color="#94a3b8" />
          <input type="date" value={card.deadline || ""} onPointerDown={e => e.stopPropagation()}
            onChange={e => onUpdate(card.id, { deadline: e.target.value })}
            style={{ fontSize: 14.5, border: "none", outline: "none", background: "rgba(255,255,255,0.6)", color: "#1e293b", fontFamily: "inherit", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VisionCanvasPage() {
  const [cards, setCards] = useState<CanvasCard[]>(INITIAL_CARDS)
  const [scale, setScale] = useState(0.85)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")

  const [aiResult, setAiResult] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [aiError, setAiError] = useState("")
  const [copied, setCopied] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const { user } = useAuth()
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const loadSavedCanvas = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/simuladores/runs?slug=vision`);
      if (res.ok) {
        const data = await res.json();
        if (data.runs && data.runs.length > 0) {
          const lastRun = data.runs[0];
          if (lastRun.inputs && lastRun.inputs.cards) {
            setCards(lastRun.inputs.cards);
          }
        }
      }
    } catch (err) {
      console.error('Error loading saved canvas:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSavedCanvas();
    }
  }, [user, loadSavedCanvas]);

  const saveCanvas = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar tu canvas.");
      return;
    }
    setSaveLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/simuladores/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulator_slug: 'vision',
          run_name: `Mi Vision Board - ${new Date().toLocaleDateString()}`,
          inputs: { cards },
          outputs: { 
            cardCount: cards.length,
            stats: stats 
          },
          notes: "Guardado desde el Vision Canvas tool"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Pan with Left Click (0) on background, Middle Click (1), or Alt+Click
    const isBackground = e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-stage')
    
    if (e.button === 1 || e.altKey || (e.button === 0 && isBackground)) {
      setIsPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
      e.preventDefault()
    }
  }, [pan])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) setPan({
      x: panStart.current.px + (e.clientX - panStart.current.x),
      y: panStart.current.py + (e.clientY - panStart.current.y),
    })
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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => Math.min(2, Math.max(0.3, s - e.deltaY * 0.001)))
  }, [])

  const addCard = (type: CardType) => {
    setCards(prev => [...prev, {
      id: uid(), type,
      title: type === "goal" ? "Nueva meta" : type === "savings" ? "Nuevo ahorro" : type === "debt" ? "Nueva deuda" : type === "income" ? "Nuevo ingreso" : "Nueva nota",
      body: "", x: 200 + Math.random() * 400, y: 150 + Math.random() * 250,
      priority: type !== "note" ? "media" : undefined,
      progress: type === "goal" ? 0 : undefined,
      amount: 0,
    }])
  }

  const updateCard = useCallback((id: string, u: Partial<CanvasCard>) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...u } : c))
  }, [])

  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(c => c.id !== id))
  }, [])

  const onDrag = useCallback((id: string, x: number, y: number) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, x, y } : c))
  }, [])

  const autoArrange = () => {
    const types: CardType[] = ["goal", "savings", "debt", "income", "note"]
    const grouped: Record<string, CanvasCard[]> = { goal: [], savings: [], debt: [], income: [], note: [] }
    cards.forEach(c => grouped[c.type].push(c))
    const newCards: CanvasCard[] = []
    let col = 0
    for (const type of types) {
      grouped[type].forEach((card, row) => newCards.push({ ...card, x: col * 290 + 60, y: row * 280 + 80 }))
      if (grouped[type].length > 0) col++
    }
    setCards(newCards)
  }

  const exportText = () => {
    const lines = cards.map(c => {
      let line = `[${CARD_CONFIG[c.type].label.toUpperCase()}] ${c.title}: ${c.body}`
      if (c.amount) line += ` | Monto: $${c.amount.toLocaleString()}`
      if (c.priority) line += ` | Prioridad: ${c.priority}`
      if (c.type === "goal" && c.progress != null) line += ` | Progreso: ${c.progress}%`
      if (c.deadline) line += ` | Plazo: ${c.deadline}`
      return line
    }).join("\n")
    navigator.clipboard.writeText(lines)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const stats = {
    goals:       cards.filter(c => c.type === "goal").length,
    savings:     cards.filter(c => c.type === "savings").length,
    debts:       cards.filter(c => c.type === "debt").length,
    notes:       cards.filter(c => c.type === "note").length,
    income:      cards.filter(c => c.type === "income").length,
    highPrio:    cards.filter(c => c.priority === "alta").length,
    avgProgress: cards.filter(c => c.type === "goal" && c.progress != null)
      .reduce((s, c) => s + (c.progress ?? 0), 0) / (cards.filter(c => c.type === "goal").length || 1),
    totalSavings: cards.filter(c => c.type === "savings").reduce((s, c) => s + (c.amount || 0), 0),
    totalDebt:    cards.filter(c => c.type === "debt").reduce((s, c) => s + (c.amount || 0), 0),
  }

  const buildSummary = () =>
    cards.map(c => {
      let line = `[${CARD_CONFIG[c.type].label.toUpperCase()}] ${c.title}: ${c.body}`
      if (c.priority) line += ` (Prioridad: ${c.priority})`
      if (c.type === "goal" && c.progress != null) line += ` — Progreso: ${c.progress}%`
      if (c.deadline) line += ` — Plazo: ${c.deadline}`
      if (c.amount) line += ` — Monto: $${c.amount.toLocaleString()}`
      return line
    }).join("\n")

  const handleAiAction = async (actionId: string) => {
    if (cards.length === 0) { setAiError("Agrega tarjetas al canvas primero."); return }
    setAiLoading(true); setActiveAction(actionId); setAiResult(""); setAiError(""); setShowAiPanel(true)
    try {
      const content = buildSummary()
      const action = actionId === "brainstorm" || actionId === "risks" ? "enrich" : actionId
      const customPrompt = actionId === "brainstorm"
        ? `El usuario tiene: ${content}\n\nGenera 5 metas financieras que le FALTAN. Sé específico con montos y plazos. Formato: "**Idea N: [nombre]**: [detalle]". Máximo 130 palabras.`
        : actionId === "risks"
        ? `Analiza este plan financiero: ${content}\n\nIdentifica 3-5 riesgos principales y cómo mitigarlos. Formato: "**Riesgo N: [nombre]**: [detalle y mitigación]". Máximo 150 palabras.`
        : undefined
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: customPrompt || content, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.details || data.error)
      setAiResult(data.result)
      // Using Vision Canvas AI counts as active today
      touchStreak("vision_canvas")
    } catch (err: any) {
      setAiError(err.message || "Error al conectar con la IA")
    } finally {
      setAiLoading(false)
    }
  }

  const activeActionCfg = AI_ACTIONS.find(a => a.id === activeAction)

  const visibleCards = cards.filter(c => {
    const typeOk = filter === "all" || c.type === filter
    const searchOk = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.body.toLowerCase().includes(search.toLowerCase())
    return typeOk && searchOk
  })

  return (
    <>
      <style>{`
        .vision-shell {
          width: 100%; height: 100vh;
          display: flex; flex-direction: column;
          background: #FBFAF5;
          font-family: var(--font-family, 'Inter', ui-sans-serif, system-ui, sans-serif);
          overflow: hidden;
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .vision-shell { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .vision-shell { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }

        .vision-main-content {
          flex: 1;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .vision-sidebar {
          position: fixed;
          top: 86px;
          right: 24px;
          bottom: 24px;
          width: 340px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(15,98,254,0.12);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: auto;
          overflow-y: auto;
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
          z-index: 100;
          border-radius: 20px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        .vision-sidebar.hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateX(20px) scale(0.98);
        }

        .canvas-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          cursor: grab;
        }
        .canvas-area:active {
          cursor: grabbing;
        }

        /* ── Header ── */
        .vision-header {
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(15,98,254,0.08);
          padding: 10px 20px;
          display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;
          position: relative; z-index: 20; flex-shrink: 0; overflow-x: auto;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .vision-header::-webkit-scrollbar { display: none; }

        /* ── Toolbar elements ── */
        .tb-btn {
          height: 40px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid rgba(15, 98, 254, 0.12);
          border-radius: 9px;
          color: #64748b;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tb-btn:hover {
          background: #f8fafc;
          border-color: rgba(15,98,254,0.25);
          color: #0F62FE;
          transform: translateY(-1px);
        }
        .billy-btn {
          height: 40px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Add-type buttons ── */
        .add-type-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 11px; border-radius: 8px; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
          border-width: 1px; border-style: solid; flex-shrink: 0; white-space: nowrap;
        }

        /* ── Filter bar ── */
        .filter-bar {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(15,98,254,0.07);
          padding: 7px 20px; display: flex; align-items: center; gap: 10px;
          flex-shrink: 0; overflow-x: auto;
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-chip {
          padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
          cursor: pointer; transition: all 0.15s; border: 1px solid transparent;
          white-space: nowrap; flex-shrink: 0; font-family: inherit;
        }

        /* ── Canvas ── */
        .canvas-bg {
          flex: 1; position: relative; overflow: hidden;
          background-color: #edf0f7;
          background-image: radial-gradient(rgba(15,98,254,0.18) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .canvas-stage { position: absolute; top: 0; left: 0; width: 3000px; height: 2000px; }

        /* ── Stats footer ── */
        .stats-bar {
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(15,98,254,0.08);
          padding: 7px 20px;
          display: flex; align-items: center; gap: 16px; flex-shrink: 0;
          font-size: 11.5px; color: #64748b;
        }
        .stat-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px; font-weight: 600; font-size: 11px;
        }

        /* ── AI panel ── */
        .ai-panel-inner {
          flex-shrink: 0; background: white;
          border-left: 1px solid rgba(15,98,254,0.08);
          display: flex; flex-direction: column;
          box-shadow: -4px 0 20px rgba(0,0,0,0.05);
          overflow-y: auto; overflow-x: hidden;
        }

        /* ── Billy button ── */
        .billy-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 9px; border: none;
          cursor: pointer; font-family: inherit;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
          transition: all 0.18s;
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ai-fade { animation: fadeUp 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation: spin 0.85s linear infinite; display:inline-block; }
        input[type="range"] { height: 4px; }
      `}</style>

      <div className="vision-shell">

        {/* ── Header toolbar ── */}
        <header className="vision-header">
          <Link href="/cash-flow" style={{ textDecoration: "none", flexShrink: 0 }}>
            <button className="tb-btn"><ArrowLeft size={13} /> Volver</button>
          </Link>

          <div className="tb-sep" />

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: "linear-gradient(135deg,#0F62FE,#4A9EFF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
                  }}
                >
                  <Maximize2 size={20} color="white" />
                </div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F62FE", margin: 0, letterSpacing: "-0.03em" }}>
                    Vision Canvas
                  </h1>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Crea tu futuro financiero hoy</span>
                </div>
              </div>

          <div className="tb-sep" />

          {/* Add-type buttons */}
          {(["goal","savings","debt","income","note"] as CardType[]).map(type => {
            const cfg = CARD_CONFIG[type]
            const { Icon } = cfg
            return (
              <button key={type} className="add-type-btn"
                onClick={() => addCard(type)}
                style={{ borderColor: cfg.border, color: cfg.accent, background: "white" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${cfg.accent}10`)}
                onMouseLeave={e => (e.currentTarget.style.background = "white")}
              >
                <Plus size={10} />
                <Icon size={11} />
                {cfg.label}
              </button>
            )
          })}

          <div className="tb-sep" />

          <button className="tb-btn" onClick={autoArrange} title="Organizar por tipo"><Layers size={13} /> Organizar</button>
          <button className="tb-btn" onClick={() => setCards(INITIAL_CARDS)} title="Restaurar ejemplo"><RotateCcw size={13} /></button>

          <div className="tb-sep" />

          {/* Zoom */}
          <button className="tb-btn" onClick={() => setScale(s => Math.min(2, s + 0.15))}><ZoomIn size={13} /></button>
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, minWidth: 34, textAlign: "center", flexShrink: 0 }}>
            {Math.round(scale * 100)}%
          </span>
          <button className="tb-btn" onClick={() => setScale(s => Math.max(0.3, s - 0.15))}><ZoomOut size={13} /></button>
          <button className="tb-btn" onClick={() => { setScale(0.85); setPan({ x: 0, y: 0 }) }}><Maximize2 size={13} /></button>

          <div className="tb-sep" />

          {/* Export */}
          <button className="tb-btn" onClick={exportText} title="Copiar canvas como texto">
            {copied ? <CheckCircle size={13} color="#059669" /> : <Download size={13} />}
            {copied ? "Copiado" : "Exportar"}
          </button>

          <div style={{ flex: 1 }} />

          <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
            <Move size={10} /> Alt+arrastrar
          </span>

          <div className="tb-sep" />

          {/* Save Button */}
          <button
            className="tb-btn"
            onClick={saveCanvas}
            disabled={saveLoading}
            style={{ 
              borderColor: saveSuccess ? "#10b981" : "rgba(15,98,254,0.12)",
              color: saveSuccess ? "#10b981" : (saveLoading ? "#94a3b8" : "#0F62FE"),
              background: saveSuccess ? "#f0fdf4" : "white"
            }}
          >
            {saveLoading ? <Loader2 size={13} className="spin" /> : <Save size={13} />}
            {saveSuccess ? "¡Guardado!" : (saveLoading ? "Guardando..." : "Guardar")}
          </button>

          <div className="tb-sep" />

          {/* Billy AI */}
          <button
            className="billy-btn"
            onClick={() => setShowAiPanel(p => !p)}
            style={{
              background: showAiPanel
                ? "linear-gradient(135deg,#0043ce,#0F62FE)"
                : "linear-gradient(135deg,#0F62FE,#4A9EFF)",
              color: "white",
              boxShadow: "0 4px 14px rgba(15,98,254,0.3)",
            }}
          >
            <Sparkles size={13} /> Billy IA
          </button>
        </header>

        {/* ── Filter bar ── */}
        <div className="filter-bar">
          <Filter size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
          {([
            { id: "all",     label: "Todo",     color: "#64748b", bg: "#f1f5f9" },
            { id: "goal",    label: "Metas",    color: CARD_CONFIG.goal.accent,    bg: `${CARD_CONFIG.goal.accent}12` },
            { id: "savings", label: "Ahorros",  color: CARD_CONFIG.savings.accent, bg: `${CARD_CONFIG.savings.accent}12` },
            { id: "debt",    label: "Deudas",   color: CARD_CONFIG.debt.accent,    bg: `${CARD_CONFIG.debt.accent}12` },
            { id: "income",  label: "Ingresos", color: CARD_CONFIG.income.accent,  bg: `${CARD_CONFIG.income.accent}12` },
            { id: "note",    label: "Notas",    color: CARD_CONFIG.note.accent,    bg: `${CARD_CONFIG.note.accent}12` },
          ] as { id: string; label: string; color: string; bg: string }[]).map(f => (
            <button key={f.id} className="filter-chip"
              onClick={() => setFilter(f.id as FilterType)}
              style={{
                background: filter === f.id ? f.bg : "transparent",
                borderColor: filter === f.id ? f.color : "transparent",
                color: filter === f.id ? f.color : "#64748b",
              }}
            >
              {f.label}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid rgba(15,98,254,0.12)", borderRadius: 8, padding: "4px 10px" }}>
            <Search size={11} color="#94a3b8" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tarjetas..."
              style={{ border: "none", outline: "none", fontSize: 12, color: "#1e293b", background: "transparent", width: 140, fontFamily: "inherit" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex" }}><X size={11} /></button>}
          </div>
        </div>

        {/* ── Main area: Canvas + Sidebar ── */}
        <div className="vision-main-content">
          
          <div ref={canvasRef} className="canvas-area canvas-bg"
            onMouseDown={handleMouseDown} onWheel={handleWheel}
          >
            <div className="canvas-stage" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})`, transformOrigin: "0 0" }}>
              {visibleCards.map(card => (
                <CanvasCardComponent key={card.id} card={card}
                  onUpdate={updateCard} onDelete={deleteCard} onDrag={onDrag}
                />
              ))}

              {cards.length === 0 && (
                <div style={{ position: "absolute", top: 260, left: 400, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(15,98,254,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Target size={28} color="rgba(15,98,254,0.4)" />
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#94a3b8", margin: "0 0 6px" }}>Canvas vacío</p>
                  <p style={{ fontSize: 13, color: "#cbd5e1" }}>Usa los botones de arriba para agregar tarjetas</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Persistent Right Sidebar ── */}
          <aside className={`vision-sidebar ${!showAiPanel ? "hidden" : ""}`}>
            {/* Sidebar header */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(15,98,254,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#0F62FE,#4A9EFF)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(15,98,254,0.2)" }}>
                  <Sparkles size={18} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", margin: 0 }}>Asistente Billy IA</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Analítica & Estrategia</p>
                </div>
              </div>
              <button onClick={() => setShowAiPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "0" }}>
              {/* Summary Stats first */}
              <div style={{ padding: "20px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Resumen de hoy</p>
                <div style={{ background: "#f8fafc", border: "1px solid rgba(15,98,254,0.06)", borderRadius: 16, padding: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Metas",    value: stats.goals,    color: CARD_CONFIG.goal.accent },
                      { label: "Ahorros",  value: stats.savings,  color: CARD_CONFIG.savings.accent },
                      { label: "Deudas",   value: stats.debts,    color: CARD_CONFIG.debt.accent },
                      { label: "Ingresos", value: stats.income,   color: CARD_CONFIG.income.accent },
                    ].map(s => (
                      <div key={s.label} style={{ background: "white", padding: "10px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.03)" }}>
                        <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", margin: 0 }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {stats.avgProgress > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #e2e8f0" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Progreso General</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#0F62FE" }}>{Math.round(stats.avgProgress)}%</span>
                      </div>
                      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${stats.avgProgress}%`, background: "linear-gradient(90deg,#0F62FE,#4A9EFF)", borderRadius: 10 }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Tools */}
              <div style={{ padding: "0 20px 20px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Herramientas IA</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {AI_ACTIONS.map(action => (
                    <button key={action.id} onClick={() => handleAiAction(action.id)}
                      disabled={aiLoading}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px",
                        borderRadius: 14,
                        border: `1px solid ${activeAction === action.id ? action.color + "40" : "rgba(15,98,254,0.08)"}`,
                        background: activeAction === action.id ? `${action.color}08` : "white",
                        cursor: aiLoading ? "not-allowed" : "pointer",
                        opacity: aiLoading && activeAction !== action.id ? 0.6 : 1,
                        textAlign: "left", fontFamily: "inherit", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { if (!aiLoading) { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderColor = action.color + "60" }}}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = activeAction === action.id ? action.color + "40" : "rgba(15,98,254,0.08)" }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${action.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {aiLoading && activeAction === action.id 
                          ? <Loader2 size={16} color={action.color} className="spin" />
                          : <action.Icon size={16} color={action.color} />
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>{action.label}</p>
                        <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, lineHeight: 1.3 }}>{action.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* AI Result Box */}
                {(aiResult || aiError) && (
                  <div className="ai-fade" style={{ marginTop: 16 }}>
                    {aiError ? (
                      <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 12, padding: "12px", color: "#ef4444", fontSize: 12 }}>{aiError}</div>
                    ) : (
                      <div style={{ background: "white", border: "1px solid rgba(15,98,254,0.15)", borderRadius: 16, padding: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", gap: 6 }}>
                            {activeActionCfg && <activeActionCfg.Icon size={12} color={activeActionCfg.color} />}
                            {activeActionCfg?.label}
                          </span>
                          <button onClick={() => { navigator.clipboard.writeText(aiResult); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                            style={{ background: copied ? "#f0fdf4" : "#f8fafc", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 9, fontWeight: 700, color: copied ? "#16a34a" : "#64748b" }}
                          >
                            {copied ? "¡Copiado!" : "Copiar"}
                          </button>
                        </div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                           {aiResult}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Export/Actions Section */}
              <div style={{ padding: "0 20px 20px", marginTop: "auto" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Compartir & Exportar</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button onClick={exportText} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: "white", border: "1px solid #e2e8f0", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                    <Download size={14} /> Texto
                  </button>
                  <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: "white", border: "1px solid #e2e8f0", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                    <FileText size={14} /> PDF
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Controls Hint */}
        <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", padding: "8px 16px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", border: "1px solid rgba(15,98,254,0.12)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, zIndex: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
           <Move size={12} color="#0F62FE" />
           <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", letterSpacing: "0.02em" }}>
             Scroll = Zoom · Clic y arrastrar fondo = Mover Canvas
           </span>
        </div>
      </div>
    </>
  )
}
