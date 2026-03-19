"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import {
  ChevronLeft,
  Tag,
  FileText,
  Lightbulb,
  Zap,
  CheckCircle2,
  Eye,
  Edit3,
  MessageSquarePlus,
  X,
  Plus
} from "lucide-react"

interface ForumTopic {
  id: string
  name: string
  slug: string
  icon: string
}

interface ForumTag {
  id: string
  name: string
  slug: string
}

const TOPIC_ACCENT: Record<string, string> = {
  "ahorro": "#10b981",
  "presupuesto": "#2563eb",
  "deuda": "#ef4444",
  "inversion": "#d97706",
  "emprendimiento": "#7c3aed",
  "proyectos": "#4f46e5",
  "negocios": "#0284c7",
  "mision-del-dia": "#fbbf24",
  "preguntas": "#1e3a8a",
}
function topicColor(slug: string) {
  const key = Object.keys(TOPIC_ACCENT).find(k => slug?.startsWith(k) || k?.startsWith(slug))
  return key ? TOPIC_ACCENT[key] : "#1e3a8a"
}

export default function NewThreadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  const selectedTopic = topics.find(t => t.id === selectedTopicId)
  const accent = selectedTopic ? topicColor(selectedTopic.slug) : "#0F62FE"
  const canSubmit = title.trim().length > 5 && body.trim().length > 10 && !!selectedTopicId

  useEffect(() => {
    document.body.style.background = "#FBFAF5"
    return () => { document.body.style.background = "#FBFAF5" }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { window.open("/login", "_blank"); return }
    fetchData()
  }, [user, loading])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      const [topicsRes] = await Promise.all([fetch("/api/forum/topics")])
      if (topicsRes.ok) setTopics(await topicsRes.json())
    } catch (e) { console.error(e) } finally { setLoadingData(false) }
  }

  const handleAddTag = () => {
    if (newTagInput.trim() && selectedTags.length < 5) {
      const slug = newTagInput.trim().toLowerCase().replace(/\s+/g, "-")
      if (!selectedTags.includes(slug)) setSelectedTags([...selectedTags, slug])
      setNewTagInput("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    try {
      setSubmitting(true)
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), topicId: selectedTopicId, tagSlugs: selectedTags })
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/forum/thread/${data.id}`)
      } else {
        const err = await res.json()
        alert(err.error || "Error al crear el tema")
      }
    } catch (e) {
      alert("Error al crear el tema")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div className="fn-outer" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF5" }}>
        <style>{`
          @media (min-width: 768px) and (max-width: 1160px) { .fn-outer { margin-left: 220px !important; } }
          @media (min-width: 1161px) { .fn-outer { margin-left: 280px !important; } }
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, border: "3px solid rgba(30,58,138,0.1)", borderTopColor: "#1e3a8a", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#64748b", }}>Cargando formulario...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="fn-outer" style={{ minHeight: "100vh", background: "#FBFAF5", }}>
      <style>{`
        @media (max-width: 767px) { .fn-outer { margin-left: 0 !important; } .fn-layout { flex-direction: column !important; } }
        @media (min-width: 768px) and (max-width: 1160px) { .fn-outer { margin-left: 220px !important; } }
        @media (min-width: 1161px) { .fn-outer { margin-left: 280px !important; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fn-input:focus { outline: none; border-color: ${accent} !important; box-shadow: 0 0 0 3px ${accent}18 !important; }
        .fn-tag-remove:hover { background: rgba(255,255,255,0.5) !important; }
        .fn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px ${accent}55 !important; }
        .fn-submit:active:not(:disabled) { transform: translateY(0); }
        .fn-cancel:hover { background: #f1f5f9 !important; border-color: #cbd5e1 !important; }
      `}</style>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, ${accent} 100%)`,
        padding: "clamp(28px, 5vw, 48px) clamp(20px, 5vw, 44px)",
        position: "relative", overflow: "hidden",
        borderRadius: "clamp(0px, 3vw, 32px)",
        margin: "clamp(0px, 2vw, 24px) clamp(0px, 2vw, 24px) 0",
        boxShadow: `0 20px 50px ${accent}33`
      }}>
        <div style={{ position: "absolute", top: "-20%", right: "-4%", width: 320, height: 320, background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30%", left: "10%", width: 240, height: 240, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.5s ease both" }}>
          <button
            onClick={() => router.push("/forum")}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 14px", color: "#93c5fd", fontSize: 12, fontWeight: 500, cursor: "pointer", marginBottom: 20 }}
          >
            <ChevronLeft size={13} /> Volver al Foro
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageSquarePlus size={26} color="#93c5fd" />
            </div>
            <div>
              <h1 style={{ margin: "0 0 6px", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Crear Nuevo Tema
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: "#93c5fd", fontWeight: 500 }}>
                Comparte una pregunta, idea o proyecto con la comunidad
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div style={{ padding: "clamp(20px, 4vw, 36px) clamp(16px, 4vw, 36px)", maxWidth: 1200, margin: "0 auto" }}>
        <div className="fn-layout" style={{ display: "flex", gap: "clamp(20px, 3vw, 32px)", alignItems: "flex-start" }}>

          {/* ── FORM (left) ─────────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0, animation: "fadeUp 0.5s ease 0.1s both" }}>
            <form onSubmit={handleSubmit}>

              {/* Card: Título */}
              <div style={{ background: "#FBFAF5", borderRadius: 20, border: "1.5px solid rgba(15, 23, 42, 0.12)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: "clamp(20px, 4vw, 28px)", marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>
                  Título *
                </label>
                <input
                  className="fn-input"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="¿Cuál es el título de tu tema? Sé específico..."
                  maxLength={150}
                  required
                  style={{
                    width: "100%", padding: "14px 16px", fontSize: 15,
                    fontWeight: 500,
                    border: "2px solid #f1f5f9", borderRadius: 12,
                    background: "#FBFAF5", color: "#0f172a",
                    boxSizing: "border-box", transition: "all 0.2s"
                  }}
                />
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {title.length > 5
                    ? <span style={{ fontSize: 11, color: "#10b981", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={11} /> Buen título</span>
                    : <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Mínimo 6 caracteres</span>
                  }
                  <span style={{ fontSize: 11, color: title.length > 120 ? "#ef4444" : "#94a3b8", fontWeight: 500 }}>{title.length}/150</span>
                </div>
              </div>

              {/* Card: Categoría */}
              <div style={{ background: "#FBFAF5", borderRadius: 20, border: "1.5px solid rgba(15, 23, 42, 0.12)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: "clamp(20px, 4vw, 28px)", marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>
                  Categoría *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    className="fn-input"
                    value={selectedTopicId}
                    onChange={e => setSelectedTopicId(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "14px 16px", fontSize: 15,
                      fontWeight: 500,
                      border: `2px solid ${selectedTopicId ? accent : "#f1f5f9"}`, borderRadius: 12,
                      background: selectedTopicId ? `${accent}08` : "#f8fafc",
                      color: selectedTopicId ? "#0f172a" : "#94a3b8",
                      cursor: "pointer", boxSizing: "border-box",
                      appearance: "none", transition: "all 0.2s"
                    }}
                  >
                    <option value="">Selecciona una categoría...</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                  </select>
                  {selectedTopic && (
                    <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: accent }} />
                  )}
                </div>
              </div>

              {/* Card: Etiquetas */}
              <div style={{ background: "#FBFAF5", borderRadius: 20, border: "1.5px solid rgba(15, 23, 42, 0.12)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: "clamp(20px, 4vw, 28px)", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Etiquetas
                  </label>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>{selectedTags.length}/5</span>
                </div>

                {selectedTags.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    {selectedTags.map(tag => (
                      <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px 5px 12px", background: `${accent}15`, color: accent, fontSize: 12, fontWeight: 500, borderRadius: 999, border: `1.5px solid ${accent}30` }}>
                        #{tag}
                        <button
                          type="button"
                          className="fn-tag-remove"
                          onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                          style={{ background: "rgba(0,0,0,0.06)", border: "none", color: accent, cursor: "pointer", padding: "1px 4px", borderRadius: "50%", display: "flex", alignItems: "center", lineHeight: 1, transition: "all 0.15s" }}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Tag size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                      className="fn-input"
                      type="text"
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddTag() } }}
                      placeholder={selectedTags.length >= 5 ? "Límite alcanzado" : "Escribe y presiona Enter..."}
                      disabled={selectedTags.length >= 5}
                      style={{
                        width: "100%", padding: "11px 14px 11px 34px", fontSize: 13,
                        fontWeight: 500,
                        border: "2px solid #f1f5f9", borderRadius: 10,
                        background: "#FBFAF5", color: "#0f172a",
                        boxSizing: "border-box", transition: "all 0.2s",
                        opacity: selectedTags.length >= 5 ? 0.5 : 1
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTagInput.trim() || selectedTags.length >= 5}
                    style={{
                      padding: "11px 18px", borderRadius: 10, border: "none",
                      background: newTagInput.trim() && selectedTags.length < 5 ? accent : "#f1f5f9",
                      color: newTagInput.trim() && selectedTags.length < 5 ? "#fff" : "#94a3b8",
                      fontWeight: 500, fontSize: 13, cursor: newTagInput.trim() && selectedTags.length < 5 ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", gap: 5,                       transition: "all 0.2s", flexShrink: 0
                    }}
                  >
                    <Plus size={14} /> Agregar
                  </button>
                </div>
              </div>

              {/* Card: Contenido */}
              <div style={{ background: "#FBFAF5", borderRadius: 20, border: "1.5px solid rgba(15, 23, 42, 0.12)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: "clamp(20px, 4vw, 28px)", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Contenido *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: showPreview ? `${accent}15` : "#f8fafc", border: `1.5px solid ${showPreview ? accent : "#e2e8f0"}`, borderRadius: 999, fontSize: 12, fontWeight: 500, color: showPreview ? accent : "#64748b", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {showPreview ? <><Edit3 size={12} /> Editar</> : <><Eye size={12} /> Vista Previa</>}
                  </button>
                </div>

                {!showPreview ? (
                  <textarea
                    className="fn-input"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder={"¿Cuál es tu pregunta o idea?\n\nDescríbela con suficiente detalle para que la comunidad pueda ayudarte.\nUsa este espacio para explicar el contexto, lo que ya has intentado, etc."}
                    required
                    style={{
                      width: "100%", minHeight: 280, padding: "16px",
                      fontSize: 14,                       fontWeight: 500, lineHeight: 1.75,
                      border: "2px solid #f1f5f9", borderRadius: 12,
                      background: "#FBFAF5", color: "#0f172a",
                      resize: "vertical", boxSizing: "border-box", transition: "all 0.2s"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%", minHeight: 280, padding: "16px",
                    fontSize: 14,                     fontWeight: 500, lineHeight: 1.75,
                    border: "2px solid #f1f5f9", borderRadius: 12,
                    background: "#FBFAF5", color: "#0f172a",
                    boxSizing: "border-box", whiteSpace: "pre-wrap", overflowY: "auto"
                  }}>
                    {body || <span style={{ color: "#94a3b8" }}>Escribe algo para ver la vista previa...</span>}
                  </div>
                )}

                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  {body.trim().length > 10
                    ? <span style={{ fontSize: 11, color: "#10b981", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={11} /> Contenido listo</span>
                    : <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Mínimo 10 caracteres</span>
                  }
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{body.length} caracteres</span>
                </div>
              </div>

              {/* ── CTA Buttons ─────────────────────────────────────── */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  className="fn-submit"
                  disabled={submitting || !canSubmit}
                  style={{
                    flex: 1, minWidth: 160, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "15px 28px",
                    background: canSubmit && !submitting ? `linear-gradient(135deg, #0f172a, #1e3a8a)` : "#cbd5e1",
                    color: "white", border: "none", borderRadius: 14,
                    fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em",
                    cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                    boxShadow: canSubmit && !submitting ? `0 4px 14px rgba(15,23,42,0.4)` : "none",
                    transition: "all 0.25s"
                  }}
                >
                  {submitting
                    ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} /> Publicando...</>
                    : <><Zap size={16} /> Publicar Tema</>
                  }
                </button>
                <Link href="/forum" style={{ textDecoration: "none", flex: "0 0 auto" }}>
                  <button
                    type="button"
                    className="fn-cancel"
                    style={{ padding: "15px 24px", background: "#FBFAF5", border: "2px solid #e2e8f0", borderRadius: 14, fontSize: 14, fontWeight: 500, color: "#64748b", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    Cancelar
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* ── TIPS SIDEBAR (right) ─────────────────────────────── */}
          <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease 0.2s both" }}>

            {/* Progress Card */}
            <div style={{ background: "#FBFAF5", borderRadius: 20, border: "1.5px solid rgba(15, 23, 42, 0.12)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 14 }}>Estado del Tema</div>
              {[
                { label: "Título", done: title.trim().length > 5 },
                { label: "Categoría", done: !!selectedTopicId },
                { label: "Contenido", done: body.trim().length > 10 },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? "1px solid #f8fafc" : "none" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: item.done ? "#10b981" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                    <CheckCircle2 size={12} color={item.done ? "#fff" : "#94a3b8"} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: item.done ? "#0f172a" : "#94a3b8", transition: "color 0.3s" }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Tips Card */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", borderRadius: 20, padding: 20, boxShadow: "0 4px 18px rgba(15,98,254,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Lightbulb size={16} color="#60a5fa" />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", letterSpacing: "0.04em", textTransform: "uppercase" }}>Consejos para un buen tema</span>
              </div>
              {[
                "Usa un título específico y claro",
                "Explica el contexto y detalles",
                "Sé respetuoso con la comunidad",
                "Solo texto — no imágenes ni archivos",
                "No compartas información personal",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 4 ? 10 : 0 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#60a5fa", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500, lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: "#FBFAF5", borderRadius: 20, border: "1.5px solid rgba(15, 23, 42, 0.12)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 14 }}>Ver antes de publicar</div>
              {[
                { label: "Explorar temas", href: "/forum", icon: <FileText size={14} /> },
                { label: "Misión del día", href: "/forum/topic/mision-del-dia", icon: <Zap size={14} /> },
              ].map((link, i) => (
                <Link key={i} href={link.href} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "#FBFAF5", marginBottom: i === 0 ? 8 : 0, transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#eff6ff")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
                  >
                    <span style={{ color: "#0F62FE" }}>{link.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{link.label}</span>
                    <ChevronLeft size={13} style={{ marginLeft: "auto", transform: "rotate(180deg)", color: "#94a3b8" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
