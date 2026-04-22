"use client"

import * as React from "react"
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

  const isAnahuac = (user?.email || (user as any)?.emailAddresses?.[0]?.emailAddress || "").toLowerCase().endsWith("@anahuac.mx") || (user?.email || "").toLowerCase().includes(".anahuac.mx") || (user?.email || "").toLowerCase().endsWith("@bizen.mx")

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
  const defaultInstitutionalAccent = isAnahuac ? "#FF5900" : "#0F62FE"
  const accent = selectedTopic ? topicColor(selectedTopic.slug) : defaultInstitutionalAccent
  const canSubmit = title.trim().length > 5 && body.trim().length > 10 && !!selectedTopicId


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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isAnahuac ? "border-orange-900/10 border-t-orange-600" : "border-blue-900/10 border-t-blue-900"}`} />
          <span className="text-sm font-medium text-slate-500">Cargando formulario...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* ── HERO ────────────────────────────────────────────────── */}
        <div className="relative rounded-[2rem] overflow-hidden mb-8 md:mb-12 shadow-2xl shadow-blue-900/20" style={{ background: isAnahuac ? `linear-gradient(135deg, #1c0a00 0%, #4a1a00 60%, ${accent} 100%)` : `linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, ${accent} 100%)` }}>
          <div className="absolute top-[-20%] right-[-5%] w-80 h-80 rounded-full blur-[80px]" style={{ background: `${accent}40` }} />
          <div className="absolute bottom-[-30%] left-[5%] w-60 h-60 bg-indigo-500/20 rounded-full blur-[60px]" />

          <div className="relative z-10 px-6 py-10 md:px-12 md:py-16">
            <button
              onClick={() => router.push("/forum")}
              className={`inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-all mb-8 ${isAnahuac ? "bg-orange-500/10 hover:bg-orange-500/20 text-orange-200" : "bg-white/10 hover:bg-white/20 text-blue-200"}`}
            >
              <ChevronLeft size={16} /> Volver al Foro
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 rounded-[1.25rem] bg-white/10 border-[1.5px] border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <MessageSquarePlus size={32} className="text-blue-200" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                  Crear Nuevo Tema
                </h1>
                <p className={`text-lg font-medium ${isAnahuac ? "text-orange-200" : "text-blue-200"}`}>
                  Comparte una pregunta, idea o proyecto con la comunidad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ─────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── FORM (left) ─────────────────────────────────────── */}
          <div className="flex-1 w-full min-w-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Card: Título */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                  Título *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="¿Cuál es el título de tu tema? Sé específico..."
                  maxLength={150}
                  required
                  className={`w-full px-5 py-4 text-base font-medium border-2 border-slate-100 rounded-2xl bg-slate-50 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isAnahuac ? "focus:border-orange-500 focus:ring-orange-500/10" : "focus:border-blue-500 focus:ring-blue-500/10"}`}
                />
                <div className="mt-3 flex justify-between items-center px-1">
                  {title.length > 5
                    ? <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5"><CheckCircle2 size={14} /> Buen título</span>
                    : <span className="text-xs text-slate-400 font-bold">Mínimo 6 caracteres</span>
                  }
                  <span className={`text-xs font-bold ${title.length > 120 ? "text-red-500" : "text-slate-400"}`}>{title.length}/150</span>
                </div>
              </div>

              {/* Card: Categoría */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                  Categoría *
                </label>
                <div className="relative">
                  <select
                    value={selectedTopicId}
                    onChange={e => setSelectedTopicId(e.target.value)}
                    required
                    className="w-full px-5 py-4 text-base font-bold bg-slate-50 border-2 rounded-2xl text-slate-700 outline-none appearance-none cursor-pointer focus:bg-white transition-all"
                    style={{ borderColor: selectedTopicId ? accent : "#f1f5f9", color: selectedTopicId ? "#0f172a" : "#94a3b8" }}
                  >
                    <option value="">Selecciona una categoría...</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                  </select>
                  {selectedTopic && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }} />
                  )}
                </div>
              </div>

              {/* Card: Etiquetas */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-4 px-1">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Etiquetas
                  </label>
                  <span className="text-xs font-bold text-slate-400">{selectedTags.length}/5</span>
                </div>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-xs font-bold rounded-full border" style={{ borderColor: `${accent}40`, color: accent, backgroundColor: `${accent}10` }}>
                        #{tag}
                        <button
                          type="button"
                          onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                          className="w-4 h-4 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 text-current transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddTag() } }}
                      placeholder={selectedTags.length >= 5 ? "Límite alcanzado" : "Escribe y presiona Enter..."}
                      disabled={selectedTags.length >= 5}
                      className={`w-full pl-11 pr-5 py-3.5 text-sm font-medium border-2 border-slate-100 rounded-xl bg-slate-50 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white disabled:opacity-50 ${isAnahuac ? "focus:border-orange-500" : "focus:border-blue-500"}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTagInput.trim() || selectedTags.length >= 5}
                    className="px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transition-all disabled:opacity-50"
                    style={{ backgroundColor: newTagInput.trim() && selectedTags.length < 5 ? accent : "#f1f5f9", color: newTagInput.trim() && selectedTags.length < 5 ? "#fff" : "#94a3b8" }}
                  >
                    <Plus size={16} /> Agregar
                  </button>
                </div>
              </div>

              {/* Card: Contenido */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 px-1">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Contenido *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${showPreview ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}
                  >
                    {showPreview ? <><Edit3 size={14} /> Editar</> : <><Eye size={14} /> Vista Previa</>}
                  </button>
                </div>

                {!showPreview ? (
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder={"¿Cuál es tu pregunta o idea?\n\nDescríbela con suficiente detalle para que la comunidad pueda ayudarte.\nUsa este espacio para explicar el contexto, lo que ya has intentado, etc."}
                    required
                    className={`w-full min-h-[320px] p-5 text-base font-medium leading-relaxed border-2 border-slate-100 rounded-2xl bg-slate-50 text-slate-900 outline-none resize-y transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isAnahuac ? "focus:border-orange-500 focus:ring-orange-500/10" : "focus:border-blue-500 focus:ring-blue-500/10"}`}
                  />
                ) : (
                  <div className="w-full min-h-[320px] p-5 text-base font-medium leading-relaxed border-2 border-slate-100 rounded-2xl bg-slate-50 text-slate-900 whitespace-pre-wrap overflow-y-auto">
                    {body || <span className="text-slate-400 italic">Escribe algo para ver la vista previa...</span>}
                  </div>
                )}

                <div className="mt-3 flex justify-between items-center px-1">
                  {body.trim().length > 10
                    ? <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5"><CheckCircle2 size={14} /> Contenido listo</span>
                    : <span className="text-xs text-slate-400 font-bold">Mínimo 10 caracteres</span>
                  }
                  <span className="text-xs text-slate-400 font-bold">{body.length} caracteres</span>
                </div>
              </div>

              {/* ── CTA Buttons ─────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting || !canSubmit}
                  style={canSubmit && !submitting ? { background: accent, boxShadow: `0 8px 32px ${accent}50` } : {}}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 md:py-5 rounded-[1.25rem] font-bold text-[15px] transition-all ${
                    canSubmit && !submitting 
                      ? "text-white hover:-translate-y-1 hover:brightness-110 active:scale-95" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {submitting
                    ? <><div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" /> Publicando...</>
                    : <><Zap size={20} className={canSubmit && !submitting ? "text-yellow-300 fill-yellow-300" : ""} /> Publicar Tema</>
                  }
                </button>
                <Link href="/forum" className="sm:w-1/3">
                  <button
                    type="button"
                    className="w-full h-full px-8 py-4 md:py-5 bg-white border-2 border-slate-200 rounded-[1.25rem] font-bold text-[15px] tracking-wide text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* ── TIPS SIDEBAR (right) ─────────────────────────────── */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">

            {/* Progress Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Estado del Tema</div>
              {[
                { label: "Título", done: title.trim().length > 5 },
                { label: "Categoría", done: !!selectedTopicId },
                { label: "Contenido", done: body.trim().length > 10 },
              ].map((item, i, arr) => (
                <div key={i} className={`flex items-center gap-4 py-3 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${item.done ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-slate-100 text-slate-400"}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span className={`text-sm font-bold transition-colors ${item.done ? "text-slate-800" : "text-slate-400"}`}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Tips Card */}
            <div className={`rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-900/20 ${isAnahuac ? "bg-gradient-to-br from-[#1c0a00] to-[#4a1a00]" : "bg-gradient-to-br from-slate-900 to-blue-900"}`}>
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb size={20} className={isAnahuac ? "text-orange-400" : "text-blue-400"} />
                <span className={`text-xs font-black uppercase tracking-widest ${isAnahuac ? "text-orange-200" : "text-blue-200"}`}>Consejos</span>
              </div>
              <ul className="space-y-4">
                {[
                  "Usa un título específico y claro",
                  "Explica el contexto y detalles",
                  "Sé respetuoso con la comunidad",
                  "Solo texto — no imágenes ni archivos",
                  "No compartas información personal",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${isAnahuac ? "bg-orange-400" : "bg-blue-400"}`} />
                    <span className={`text-sm font-medium leading-relaxed ${isAnahuac ? "text-orange-100/90" : "text-blue-100/90"}`}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Accesos Rápidos</div>
              <div className="space-y-2">
                {[
                  { label: "Explorar temas", href: "/forum", icon: <FileText size={16} /> },
                  { label: "Misión del día", href: "/forum?tab=mision-del-dia", icon: <Zap size={16} /> },
                ].map((link, i) => (
                  <Link key={i} href={link.href} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className="text-blue-600 group-hover:scale-110 transition-transform">{link.icon}</div>
                    <span className="text-sm font-bold text-slate-700 flex-1">{link.label}</span>
                    <ChevronLeft size={16} className="rotate-180 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
