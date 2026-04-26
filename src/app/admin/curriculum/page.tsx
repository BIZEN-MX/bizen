"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen, Target, Zap, Plus, ChevronRight, ChevronDown,
  Pencil, Trash2, Loader2, CheckCircle2, AlertCircle,
  ArrowLeft, Eye, GripVertical, Lock, Unlock, X, Save,
  Layers, FileText, HelpCircle, ToggleLeft, AlignLeft,
  Image, Shuffle, Repeat, Brain, Bolt, Heart, Search,
  BarChart2, MessageSquare, Gamepad2, FlipHorizontal, Calendar
} from "lucide-react"

const SUPER_ADMINS = ["diego@bizen.mx"]

// Step type metadata for the picker
const STEP_TYPES = [
  { type: "info", label: "Teoría / Info", icon: FileText, color: "#3b82f6", desc: "Slide de información con texto e imagen" },
  { type: "mcq", label: "Opción Múltiple", icon: HelpCircle, color: "#8b5cf6", desc: "Pregunta con 4 opciones, UNA correcta" },
  { type: "multi_select", label: "Selección Múltiple", icon: Layers, color: "#6366f1", desc: "Varias opciones correctas posibles" },
  { type: "true_false", label: "Verdadero / Falso", icon: ToggleLeft, color: "#10b981", desc: "Afirmación que el alumno valida" },
  { type: "fill_blanks", label: "Llenar Espacios", icon: AlignLeft, color: "#f59e0b", desc: "Texto con huecos a completar" },
  { type: "order", label: "Ordenar Pasos", icon: Shuffle, color: "#ec4899", desc: "Arrastrar elementos en orden correcto" },
  { type: "match", label: "Emparejar", icon: Repeat, color: "#14b8a6", desc: "Conectar pares relacionados" },
  { type: "image_choice", label: "Elegir Imagen", icon: Image, color: "#f97316", desc: "Pregunta con respuesta visual" },
  { type: "billy_talks", label: "Billy Habla", icon: MessageSquare, color: "#0ea5e9", desc: "Billy explica con su personalidad" },
  { type: "blitz_challenge", label: "Blitz Challenge", icon: Bolt, color: "#eab308", desc: "Pregunta rápida con cronómetro" },
  { type: "impulse_meter", label: "Impulse Meter", icon: Heart, color: "#ef4444", desc: "Resistir una compra impulsiva" },
  { type: "mindset_translator", label: "Traductor Mental", icon: Brain, color: "#a855f7", desc: "Convertir creencias limitantes" },
  { type: "swipe_sorter", label: "Swipe Sorter", icon: FlipHorizontal, color: "#22c55e", desc: "Clasificar deslizando tarjetas" },
  { type: "mini_sim", label: "Mini Simulador", icon: BarChart2, color: "#06b6d4", desc: "Simulación interactiva de finanzas" },
  { type: "summary", label: "Resumen Final", icon: CheckCircle2, color: "#64748b", desc: "Pantalla de cierre de la lección" },
]

type Topic = {
  id: string; title: string; order: number; description?: string; icon?: string
  lessons: LessonMeta[]
}
type LessonMeta = {
  id: string; title: string; order: number; contentType: string; xpReward: number; duration?: number
  _count: { steps: number }
}

type DailyMission = {
  id: string; title: string; description?: string; objectiveType: string; targetValue: number; rewardCoins: number; icon: string; isActive: boolean
}

export default function CurriculumBuilderPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase()
  const isAllowed = isLoaded && userEmail && SUPER_ADMINS.includes(userEmail)

  const [activeTab, setActiveTab] = useState<"curriculum" | "daily">("curriculum")
  const [topics, setTopics] = useState<Topic[]>([])
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  // Navigation state
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null) // ID

  // Modals
  const [modal, setModal] = useState<"topic" | "lesson" | "daily" | null>(null)
  const [editTarget, setEditTarget] = useState<any>(null)

  useEffect(() => {
    if (isLoaded && !isAllowed) router.push("/dashboard")
  }, [isLoaded, isAllowed])

  useEffect(() => {
    if (isAllowed) {
      if (activeTab === "curriculum") fetchTopics()
      else fetchDailyMissions()
    }
  }, [isAllowed, activeTab])

  const showToast = (type: "ok" | "err", text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/curriculum?type=topics")
      const data = await res.json()
      if (res.ok) setTopics(data.topics)
    } catch { showToast("err", "Error al cargar el currículo") }
    finally { setLoading(false) }
  }

  const fetchDailyMissions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/daily-missions")
      const data = await res.json()
      if (res.ok) setDailyMissions(data.missions)
    } catch { showToast("err", "Error al cargar misiones") }
    finally { setLoading(false) }
  }

  const handleCreate = async (payload: any) => {
    const isDaily = payload.entity === "daily"
    const url = isDaily ? "/api/admin/daily-missions" : "/api/admin/curriculum"
    
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        showToast("ok", "Creado correctamente")
        setModal(null)
        isDaily ? await fetchDailyMissions() : await fetchTopics()
        return data
      } else {
        showToast("err", data.error || "Error al crear")
        return null
      }
    } catch { showToast("err", "Error de conexión"); return null }
  }

  const handleUpdate = async (payload: any) => {
    const isDaily = payload.entity === "daily"
    const url = isDaily ? "/api/admin/daily-missions" : "/api/admin/curriculum"

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        showToast("ok", "Actualizado correctamente")
        setModal(null)
        setEditTarget(null)
        isDaily ? await fetchDailyMissions() : await fetchTopics()
        return data
      } else {
        showToast("err", data.error || "Error al actualizar")
        return null
      }
    } catch { showToast("err", "Error de conexión"); return null }
  }

  const handleDelete = async (entity: string, id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    const isDaily = entity === "daily"
    const url = isDaily ? `/api/admin/daily-missions?id=${id}` : `/api/admin/curriculum?entity=${entity}&id=${id}`
    
    try {
      const res = await fetch(url, { method: "DELETE" })
      if (res.ok) {
        showToast("ok", "Eliminado correctamente")
        if (entity === "topic" && selectedTopic?.id === id) { setSelectedTopic(null); setSelectedLesson(null) }
        if (entity === "lesson" && selectedLesson === id) setSelectedLesson(null)
        isDaily ? await fetchDailyMissions() : await fetchTopics()
      } else {
        const data = await res.json()
        showToast("err", data.error || "Error al eliminar")
      }
    } catch { showToast("err", "Error de conexión") }
  }

  if (!isLoaded || !isAllowed) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -60, x: "-50%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }} className={`fixed top-5 left-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl border ${toast.type === "ok" ? "bg-emerald-950 border-emerald-500/30 text-emerald-300" : "bg-red-950 border-red-500/30 text-red-300" }`}>
            {toast.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* ── Sidebar ── */}
        <aside className="w-80 min-w-[280px] bg-[#080d19] border-r border-white/5 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Super Admin
                </div>
                <h1 className="text-lg font-black text-white">Constructor</h1>
              </div>
            </div>

            <div className="flex bg-[#0d1628] rounded-xl p-1">
              <button onClick={() => setActiveTab("curriculum")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "curriculum" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                Currículo
              </button>
              <button onClick={() => setActiveTab("daily")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "daily" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                Retos Diarios
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {activeTab === "curriculum" ? (
              loading ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mt-12" /> : (
                topics.map(topic => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    selected={selectedTopic?.id === topic.id}
                    onSelectTopic={(t) => { setSelectedTopic(t); setSelectedLesson(null) }}
                    onDelete={handleDelete}
                    onEdit={(entity, target) => { setEditTarget({ entity, ...target }); setModal("topic") }}
                  />
                ))
              )
            ) : (
              loading ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mt-12" /> : (
                dailyMissions.map(m => (
                  <div key={m.id} onClick={() => { setEditTarget({ entity: "daily", ...m }); setModal("daily") }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 border border-transparent cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{m.title}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{m.rewardCoins} Bizcoins</div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          <div className="p-3 border-t border-white/5">
            <button
              onClick={() => { setEditTarget(null); setModal(activeTab === "curriculum" ? "topic" : "daily") }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" /> {activeTab === "curriculum" ? "Nuevo Tema" : "Nueva Misión Diaria"}
            </button>
          </div>
        </aside>

        {/* ── Main Area ── */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "daily" ? (
             <DailyMissionsPanel missions={dailyMissions} onNew={() => { setEditTarget(null); setModal("daily") }} onEdit={(m) => { setEditTarget({ entity: "daily", ...m }); setModal("daily") }} onDelete={handleDelete} />
          ) : (
            <>
              {!selectedTopic && <WelcomePanel onNewTopic={() => { setEditTarget(null); setModal("topic") }} />}
              {selectedTopic && !selectedLesson && (
                <TopicPanel
                  topic={selectedTopic}
                  onNewLesson={() => { setEditTarget(null); setModal("lesson") }}
                  onSelectLesson={(id) => setSelectedLesson(id)}
                  onDelete={handleDelete}
                  onEdit={(lesson) => { setEditTarget({ entity: "lesson", ...lesson }); setModal("lesson") }}
                />
              )}
              {selectedLesson && (
                <LessonEditor
                  lessonId={selectedLesson}
                  topic={selectedTopic!}
                  onBack={() => setSelectedLesson(null)}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      <AnimatePresence>
        {modal === "topic" && (
          <EntityModal
            title={editTarget ? "Editar Tema" : "Nuevo Tema"}
            onClose={() => { setModal(null); setEditTarget(null) }}
            onSubmit={(data) => editTarget ? handleUpdate({ entity: "topic", id: editTarget.id, ...data }) : handleCreate({ entity: "topic", ...data }) }
            fields={[
              { key: "title", label: "Nombre del Tema", placeholder: "Ej. Inversión 101", required: true },
              { key: "description", label: "Descripción", placeholder: "Lo que el alumno aprenderá...", multiline: true },
              { key: "icon", label: "Ícono (Lucide)", placeholder: "BookOpen" },
            ]}
            initialValues={editTarget}
          />
        )}
        {modal === "lesson" && (
          <EntityModal
            title={editTarget ? "Editar Lección" : "Nueva Lección"}
            onClose={() => { setModal(null); setEditTarget(null) }}
            onSubmit={(data) => editTarget ? handleUpdate({ entity: "lesson", id: editTarget.id, ...data }) : handleCreate({ entity: "lesson", topicId: selectedTopic?.id, ...data }) }
            fields={[
              { key: "title", label: "Nombre de la Lección", placeholder: "Ej. Interés Compuesto", required: true },
              { key: "xpReward", label: "XP", placeholder: "50", type: "number" },
              { key: "duration", label: "Minutos", placeholder: "5", type: "number" },
            ]}
            initialValues={editTarget}
          />
        )}
        {modal === "daily" && (
          <EntityModal
            title={editTarget ? "Editar Reto Diario" : "Nuevo Reto Diario"}
            onClose={() => { setModal(null); setEditTarget(null) }}
            onSubmit={(data) => editTarget ? handleUpdate({ entity: "daily", id: editTarget.id, ...data }) : handleCreate({ entity: "daily", ...data }) }
            fields={[
              { key: "title", label: "Título del Reto", placeholder: "Ej. El Erudito", required: true },
              { key: "description", label: "Instrucción", placeholder: "Completa 3 lecciones hoy" },
              { key: "objectiveType", label: "Tipo de Objetivo", placeholder: "complete_lessons, earn_xp, correct_answers" },
              { key: "targetValue", label: "Meta (Número)", type: "number", placeholder: "3" },
              { key: "rewardCoins", label: "Bizcoins de Regalo", type: "number", placeholder: "25" },
            ]}
            initialValues={editTarget}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function TopicRow({ topic, selected, onSelectTopic, onDelete, onEdit }: any) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${selected ? "bg-blue-600/20 border border-blue-500/30" : "hover:bg-white/5 border border-transparent"}`}
      onClick={() => onSelectTopic(topic)}
    >
      <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
      <span className="text-sm font-bold flex-1 truncate">{topic.title}</span>
      <span className="text-xs text-slate-600">{topic.lessons.length}</span>
      <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onEdit("topic", topic) }} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete("topic", topic.id, topic.title) }} className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}

function TopicPanel({ topic, onNewLesson, onSelectLesson, onDelete, onEdit }: any) {
  return (
    <div className="p-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-blue-400 text-xs font-black uppercase tracking-widest mb-2 block">Tema Seleccionado</span>
          <h2 className="text-4xl font-black">{topic.title}</h2>
          <p className="text-slate-500 mt-2">{topic.description || "Sin descripción"}</p>
        </div>
        <button onClick={onNewLesson} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20">
          <Plus className="w-5 h-5" /> Nueva Lección
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topic.lessons.map((lesson: any, i: number) => (
          <div key={lesson.id} onClick={() => onSelectLesson(lesson.id)} className="bg-[#0b1120] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-blue-500/30 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-black text-blue-400">
                  {i + 1}
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{lesson.title}</div>
                  <div className="text-xs text-slate-500">{lesson._count.steps} pasos • {lesson.xpReward} XP</div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onEdit(lesson) }} className="p-2 rounded-lg hover:bg-white/10 text-slate-400"><Pencil className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete("lesson", lesson.id, lesson.title) }} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyMissionsPanel({ missions, onNew, onEdit, onDelete }: any) {
  return (
    <div className="p-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black">Retos del Día</h2>
          <p className="text-slate-500 mt-2">Configura misiones temporales para motivar a los usuarios.</p>
        </div>
        <button onClick={onNew} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/20">
          <Plus className="w-5 h-5" /> Nuevo Reto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {missions.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            <Zap className="w-16 h-16 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No hay retos configurados</p>
          </div>
        ) : missions.map((m: any) => (
          <div key={m.id} onClick={() => onEdit(m)} className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-orange-500/30 transition-all group flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-orange-400" />
              </div>
              <div>
                <h4 className="font-black text-xl text-white mb-1">{m.title}</h4>
                <p className="text-slate-400 text-sm mb-2">{m.description}</p>
                <div className="flex items-center gap-4">
                  <span className="bg-orange-500/10 text-orange-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">RECOMPENSA: {m.rewardCoins} Bizcoins</span>
                  <span className="text-slate-600 text-xs font-bold">META: {m.targetValue} de {m.objectiveType}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); onEdit(m) }} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"><Pencil className="w-5 h-5" /></button>
              <button onClick={(e) => { e.stopPropagation(); onDelete("daily", m.id, m.title) }} className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-slate-500 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WelcomePanel({ onNewTopic }: { onNewTopic: () => void }) {
  return (
    <div className="h-full flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-3xl font-black mb-3">Constructor BIZEN</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">Simplificamos todo: selecciona un Tema para gestionar sus lecciones, o cambia a Retos Diarios para incentivar el juego.</p>
        <button onClick={onNewTopic} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5">
          <Plus className="w-5 h-5" /> Crear Nuevo Tema
        </button>
      </div>
    </div>
  )
}

// ─── REUSED MODALS FROM PREVIOUS STEP ───
function EntityModal({ title, onClose, onSubmit, fields, initialValues }: any) {
  const [values, setValues] = useState<any>(() => {
    const init: any = {}
    fields.forEach((f: any) => { init[f.key] = initialValues?.[f.key] || (f.type === 'number' ? "0" : "") })
    return init
  })
  const [saving, setSaving] = useState(false)
  const handleS = async () => { setSaving(true); await onSubmit(values); setSaving(false) }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#080d19] border border-white/10 rounded-3xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-black mb-6">{title}</h2>
        <div className="space-y-4">
          {fields.map((f: any) => (
            <div key={f.key}>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">{f.label}</label>
              {f.multiline ? (
                <textarea value={values[f.key]} onChange={e => setValues({...values, [f.key]: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" rows={3} />
              ) : (
                <input type={f.type || "text"} value={values[f.key]} onChange={e => setValues({...values, [f.key]: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              )}
            </div>
          ))}
        </div>
        <button onClick={handleS} disabled={saving} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black shadow-lg">
          {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Guardar Cambios"}
        </button>
      </motion.div>
    </div>
  )
}

// ─── Lesson Editor (Simplified) ───
function LessonEditor({ lessonId, topic, onBack, showToast }: any) {
  const [lesson, setLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [addingStep, setAddingStep] = useState(false)
  const [editingStep, setEditingStep] = useState<any>(null)
  const fetchL = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/curriculum?type=lesson&id=${lessonId}`)
    const data = await res.json()
    if (res.ok) setLesson(data.lesson); setLoading(false)
  }, [lessonId])
  useEffect(() => { fetchL() }, [fetchL])
  const deleteStep = async (sid: string) => { if (!confirm("¿Eliminar paso?")) return; await fetch(`/api/admin/curriculum?entity=step&id=${sid}`, { method: "DELETE" }); showToast("ok", "Paso eliminado"); fetchL() }
  if (loading) return <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mt-20" />
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 font-bold hover:text-white"><ArrowLeft className="w-4 h-4" /> Volver al Tema</button>
        <div className="bg-gradient-to-br from-[#0b1120] to-blue-900/10 border border-white/5 rounded-3xl p-8 mb-8 flex justify-between items-end">
          <div>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-1 rounded uppercase mb-2 block w-fit">Editor de Lección</span>
            <h2 className="text-3xl font-black">{lesson.title}</h2>
          </div>
          <button onClick={() => setAddingStep(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-xl shadow-lg">Agregar Paso</button>
        </div>
        <div className="space-y-3">
          {lesson.steps.map((s: any, i: number) => {
            const meta = STEP_TYPES.find(st => st.type === s.type) || STEP_TYPES[0]
            const Icon = meta.icon
            return (
              <div key={s.id} className="bg-[#0b1120] border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}><Icon className="w-5 h-5 text-white" style={{ color: meta.color }} /></div>
                  <div>
                    <div className="text-xs font-black uppercase" style={{ color: meta.color }}>{meta.label}</div>
                    <div className="font-bold text-white text-sm">{s.title || (s.body ? s.body.slice(0, 40) + '...' : 'Sin título')}</div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => setEditingStep(s)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteStep(s.id)} className="p-2 rounded-lg bg-red-500/10 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <AnimatePresence>
        {addingStep && <StepPickerModal lessonId={lessonId} onClose={() => setAddingStep(false)} onCreated={() => { setAddingStep(false); fetchL() }} showToast={showToast} />}
        {editingStep && <StepEditorModal step={editingStep} lessonId={lessonId} onClose={() => setEditingStep(null)} onSaved={() => { setEditingStep(null); fetchL() }} showToast={showToast} />}
      </AnimatePresence>
    </div>
  )
}
// Import logic for StepPickerModal and StepEditorModal remains the same as previous logic but adjusted to simplified context
// For brevity, I'll assume they are available or define them if missing. I'll rely on the existing tool to keep the file consistent.
function ShieldCheck(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg> }

// Re-defining Picker & Form for consistency
function StepPickerModal({ lessonId, onClose, onCreated, showToast }: any) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#080d19] border border-white/10 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
           {STEP_TYPES.map(t => (
             <button key={t.type} onClick={() => setSelectedType(t.type)} className={`p-5 rounded-2xl border text-left transition-all ${selectedType === t.type ? 'border-2 border-blue-500 bg-blue-500/10 shadow-xl shadow-blue-500/10' : 'border-white/5 bg-white/[0.02]'}`}>
               <t.icon className="w-6 h-6 mb-3" style={{ color: t.color }} />
               <div className="font-black text-white text-sm">{t.label}</div>
             </button>
           ))}
         </div>
         {selectedType && (
           <div className="mt-8 pt-8 border-t border-white/5">
             <StepFormInline type={selectedType} lessonId={lessonId} onCreated={onCreated} showToast={showToast} />
           </div>
         )}
      </motion.div>
    </div>
  )
}

function StepEditorModal({ step, lessonId, onClose, onSaved, showToast }: any) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#080d19] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <StepFormInline type={step.type} lessonId={lessonId} stepId={step.id} initialData={step.data || {}} onCreated={onSaved} showToast={showToast} />
      </motion.div>
    </div>
  )
}

function Field({ label, value, onChange, multiline }: { label: string, value: string, onChange: (v: string) => void, multiline?: boolean }) {
  return (
    <div>
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">{label}</label>
      {multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" rows={3} />
      ) : (
        <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
      )}
    </div>
  )
}

function ImageUploadField({ label, value, onChange, showToast }: any) {
  const [uploading, setUploading] = useState(false)
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok && data.url) { onChange(data.url); showToast("ok", "Imagen subida exitosamente") }
      else { showToast("err", data.error || "Error al subir imagen") }
    } catch (err) { showToast("err", "Error de red al subir") }
    finally { setUploading(false) }
  }
  return (
    <div>
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="https://..." />
        <label className={`cursor-pointer px-4 py-3 rounded-xl font-bold text-sm border border-white/10 ${uploading ? 'bg-white/5 text-slate-400' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'} transition-colors`}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Image className="w-4 h-4 inline-block mr-1" /> Subir</>}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {value && <img src={value} alt="Preview" className="mt-3 rounded-xl border border-white/10 max-h-40 object-contain bg-black/50 p-2" />}
    </div>
  )
}

function StepFormInline({ type, lessonId, onCreated, showToast, initialData, stepId }: any) {
  const [saving, setSaving] = useState(false)
  const isEdit = !!stepId
  
  // Initialize formData based on type
  const defaultData = () => {
    if (type === "mcq" || type === "multi_select" || type === "image_choice") {
      return { question: "", options: [{ id: "o1", label: "", isCorrect: true }] }
    }
    if (type === "true_false") {
      return { question: "", isTrue: true }
    }
    if (type === "order") {
      return { question: "", items: ["Paso 1", "Paso 2"] }
    }
    if (type === "billy_talks") {
      return { message: "", mood: "thinking" }
    }
    if (type === "match") {
      return { question: "Une los conceptos con sus definiciones", pairs: [{ left: "Concepto 1", right: "Definición 1" }] }
    }
    if (type === "fill_blanks") {
      return { question: "Completa la frase", text: "El interés [compuesto] es la octava maravilla del mundo." }
    }
    if (type === "swipe_sorter") {
      return { question: "Clasifica estos gastos", leftLabel: "Deseo", rightLabel: "Necesidad", cards: [{ text: "Cine", category: "left" }, { text: "Renta", category: "right" }] }
    }
    if (type === "mindset_translator") {
      return { belief: "El dinero es malo", options: [{ id: "o1", label: "El dinero es una herramienta neutra", isCorrect: true }] }
    }
    if (type === "impulse_meter") {
      return { question: "Ves unos tenis de edición limitada en rebaja", cost: 2500 }
    }
    if (type === "blitz_challenge") {
      return { question: "Pregunta rápida", timeLimit: 10, options: [{ id: "o1", label: "Correcta", isCorrect: true }] }
    }
    return { title: "", content: "" }
  }
  
  const [formData, setFormData] = useState<any>(() => {
    if (initialData && Object.keys(initialData).length > 0) return initialData
    return defaultData()
  })

  const handleSave = async () => {
    setSaving(true)
    const payload = { 
      entity: "step", 
      lessonId, 
      type, 
      title: formData.title || formData.question || formData.belief || type, 
      body: formData.content || formData.message || formData.text || "", 
      data: formData, 
      id: stepId 
    }
    const res = await fetch("/api/admin/curriculum", { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) { showToast("ok", "Paso guardado"); onCreated() }
    else { showToast("err", "Error al guardar paso") }
  }

  // Helper renderers
  const renderOptions = (isMindset = false) => (
    <div className="space-y-2 mt-4">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">{isMindset ? "Opciones de Traducción Positiva" : "Opciones de Respuesta"}</label>
      {formData.options?.map((opt: any, i: number) => (
        <div key={opt.id || i} className="flex items-center gap-2">
          <input type={type === "multi_select" ? "checkbox" : "radio"} name="correctOpt" checked={opt.isCorrect} onChange={() => {
            const newOpts = formData.options.map((o: any, idx: number) => ({ ...o, isCorrect: type === "multi_select" ? (idx === i ? !o.isCorrect : o.isCorrect) : idx === i }))
            setFormData({ ...formData, options: newOpts })
          }} className="w-4 h-4" />
          <input type="text" value={opt.label} onChange={(e) => {
            const newOpts = [...formData.options]; newOpts[i].label = e.target.value; setFormData({ ...formData, options: newOpts })
          }} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500" placeholder={isMindset ? "Traducción positiva..." : "Texto de la opción..."} />
          <button onClick={() => setFormData({ ...formData, options: formData.options.filter((_: any, idx: number) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button onClick={() => setFormData({ ...formData, options: [...(formData.options || []), { id: `o${Date.now()}`, label: "", isCorrect: false }] })} className="text-xs text-blue-400 font-bold hover:text-blue-300 flex items-center gap-1 mt-3 transition-colors"><Plus className="w-3 h-3" /> Añadir Opción</button>
    </div>
  )

  const renderOrderItems = () => (
    <div className="space-y-2 mt-4">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Elementos (en el ORDEN CORRECTO)</label>
      <p className="text-[10px] text-slate-500 mb-2">Ingrésalos en orden. El sistema los revolverá automáticamente para el alumno.</p>
      {formData.items?.map((item: string, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-slate-500 text-xs font-bold w-4">{i + 1}.</span>
          <input type="text" value={item} onChange={(e) => {
            const newItems = [...formData.items]; newItems[i] = e.target.value; setFormData({ ...formData, items: newItems })
          }} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500" placeholder="Paso a ordenar..." />
          <button onClick={() => setFormData({ ...formData, items: formData.items.filter((_: any, idx: number) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button onClick={() => setFormData({ ...formData, items: [...(formData.items || []), "Nuevo paso"] })} className="text-xs text-blue-400 font-bold hover:text-blue-300 flex items-center gap-1 mt-3 transition-colors"><Plus className="w-3 h-3" /> Añadir Elemento</button>
    </div>
  )

  const renderMatchPairs = () => (
    <div className="space-y-2 mt-4">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Pares a Emparejar</label>
      {formData.pairs?.map((pair: any, i: number) => (
        <div key={i} className="flex flex-col gap-1 mb-4 bg-white/5 p-3 rounded-xl border border-white/10 relative">
          <button onClick={() => setFormData({ ...formData, pairs: formData.pairs.filter((_: any, idx: number) => idx !== i) })} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-500/10 rounded-md"><Trash2 className="w-3 h-3" /></button>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Par {i + 1}</div>
          <input type="text" value={pair.left} onChange={(e) => {
            const newPairs = [...formData.pairs]; newPairs[i].left = e.target.value; setFormData({ ...formData, pairs: newPairs })
          }} className="w-full bg-black/30 border border-white/5 rounded-lg p-2 text-white outline-none focus:border-blue-500 text-sm" placeholder="Concepto..." />
          <input type="text" value={pair.right} onChange={(e) => {
            const newPairs = [...formData.pairs]; newPairs[i].right = e.target.value; setFormData({ ...formData, pairs: newPairs })
          }} className="w-full bg-black/30 border border-white/5 rounded-lg p-2 text-white outline-none focus:border-blue-500 text-sm" placeholder="Definición o par..." />
        </div>
      ))}
      <button onClick={() => setFormData({ ...formData, pairs: [...(formData.pairs || []), { left: "", right: "" }] })} className="text-xs text-blue-400 font-bold hover:text-blue-300 flex items-center gap-1 transition-colors"><Plus className="w-3 h-3" /> Añadir Par</button>
    </div>
  )

  const renderSwipeCards = () => (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Etiqueta Izquierda (Ej. Deseo)" value={formData.leftLabel} onChange={v => setFormData({...formData, leftLabel: v})} />
        <Field label="Etiqueta Derecha (Ej. Necesidad)" value={formData.rightLabel} onChange={v => setFormData({...formData, rightLabel: v})} />
      </div>
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Tarjetas para Deslizar</label>
      {formData.cards?.map((card: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <select value={card.category} onChange={e => {
            const newCards = [...formData.cards]; newCards[i].category = e.target.value; setFormData({...formData, cards: newCards})
          }} className="bg-[#0b1120] border border-white/10 rounded-lg p-2 text-white outline-none w-28 text-sm">
            <option value="left">Izquierda</option>
            <option value="right">Derecha</option>
          </select>
          <input type="text" value={card.text} onChange={(e) => {
            const newCards = [...formData.cards]; newCards[i].text = e.target.value; setFormData({ ...formData, cards: newCards })
          }} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500" placeholder="Texto de la tarjeta..." />
          <button onClick={() => setFormData({ ...formData, cards: formData.cards.filter((_: any, idx: number) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button onClick={() => setFormData({ ...formData, cards: [...(formData.cards || []), { text: "", category: "left" }] })} className="text-xs text-blue-400 font-bold hover:text-blue-300 flex items-center gap-1 mt-2 transition-colors"><Plus className="w-3 h-3" /> Añadir Tarjeta</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-black text-white">Configuración del Paso</h3>
        <span className="bg-white/10 text-slate-300 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">{type}</span>
      </div>
      
      {["info", "summary"].includes(type) && (
        <>
          <Field label="Título Principal" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
          <Field label="Contenido" value={formData.content} onChange={v => setFormData({...formData, content: v})} multiline />
          <ImageUploadField label="Imagen (Opcional)" value={formData.imageUrl} onChange={(v: string) => setFormData({...formData, imageUrl: v})} showToast={showToast} />
        </>
      )}

      {["mcq", "multi_select", "image_choice"].includes(type) && (
        <>
          <Field label="Pregunta" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
          {renderOptions()}
        </>
      )}

      {type === "true_false" && (
        <>
          <Field label="Afirmación (El alumno dirá si es verdadera o falsa)" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
          <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">¿Esta afirmación es...?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-emerald-400">
                <input type="radio" checked={formData.isTrue} onChange={() => setFormData({...formData, isTrue: true})} className="w-4 h-4 accent-emerald-500" /> Verdadera
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-red-400">
                <input type="radio" checked={!formData.isTrue} onChange={() => setFormData({...formData, isTrue: false})} className="w-4 h-4 accent-red-500" /> Falsa
              </label>
            </div>
          </div>
        </>
      )}

      {type === "order" && (
        <>
          <Field label="Instrucción Principal" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
          {renderOrderItems()}
        </>
      )}

      {type === "match" && (
        <>
          <Field label="Instrucción Principal" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
          {renderMatchPairs()}
        </>
      )}

      {type === "fill_blanks" && (
        <>
          <Field label="Instrucción Principal" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
          <Field label="Texto con Espacios (Usa corchetes [asi] para los huecos)" value={formData.text} onChange={v => setFormData({...formData, text: v})} multiline />
        </>
      )}

      {type === "swipe_sorter" && (
        <>
          <Field label="Instrucción Principal" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
          {renderSwipeCards()}
        </>
      )}

      {type === "mindset_translator" && (
        <>
          <Field label="Creencia Limitante (Negativa)" value={formData.belief} onChange={v => setFormData({...formData, belief: v})} />
          {renderOptions(true)}
        </>
      )}

      {type === "impulse_meter" && (
        <>
          <Field label="Escenario (La Tentación)" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Field label="Costo Monetario ($)" value={formData.cost?.toString() || "0"} onChange={v => setFormData({...formData, cost: parseInt(v) || 0})} />
            </div>
            <div className="flex-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Categoría</label>
              <select value={formData.category || "Gasto Hormiga"} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0b1120] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 font-bold">
                <option value="Gasto Hormiga">Gasto Hormiga</option>
                <option value="Suscripción">Suscripción</option>
                <option value="Compra Emocional">Compra Emocional</option>
                <option value="Deuda">Deuda</option>
              </select>
            </div>
          </div>
        </>
      )}

      {type === "blitz_challenge" && (
        <>
          <div className="flex gap-4">
            <div className="flex-[3]">
              <Field label="Pregunta Rápida" value={formData.question} onChange={v => setFormData({...formData, question: v})} />
            </div>
            <div className="flex-1">
              <Field label="Tiempo Límite (segs)" value={formData.timeLimit?.toString() || "10"} onChange={v => setFormData({...formData, timeLimit: parseInt(v) || 10})} />
            </div>
          </div>
          {renderOptions()}
        </>
      )}

      {type === "billy_talks" && (
        <>
          <Field label="Mensaje de Billy" value={formData.message} onChange={v => setFormData({...formData, message: v})} multiline />
          <div className="mt-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Estado de Ánimo de Billy</label>
            <select value={formData.mood || "thinking"} onChange={e => setFormData({...formData, mood: e.target.value})} className="w-full bg-[#0b1120] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 font-bold">
              <option value="thinking">🤔 Pensativo (Thinking)</option>
              <option value="happy">😄 Feliz (Happy)</option>
              <option value="excited">🤩 Emocionado (Excited)</option>
              <option value="serious">😐 Serio (Serious)</option>
            </select>
          </div>
        </>
      )}

      {/* Fallback for complex/unknown types using a JSON raw editor */}
      {!["info", "summary", "mcq", "multi_select", "image_choice", "true_false", "order", "match", "fill_blanks", "swipe_sorter", "mindset_translator", "impulse_meter", "blitz_challenge", "billy_talks"].includes(type) && (
         <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl mt-4">
           <p className="text-orange-400 text-sm font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Modo de Desarrollador (JSON RAW)</p>
           <p className="text-slate-400 text-xs mb-4">Este es un paso especial o de mini-juego. Puedes editar su código directamente:</p>
           <textarea 
             value={typeof formData === 'string' ? formData : JSON.stringify(formData, null, 2)} 
             onChange={e => {
               try { 
                 const parsed = JSON.parse(e.target.value)
                 setFormData(parsed)
               } catch {
                 // Allow typing invalid json temporarily
               }
             }}
             className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-emerald-400 font-mono text-xs outline-none focus:border-orange-500 h-64" 
           />
         </div>
      )}

      <button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-500 transition-all py-4 rounded-2xl font-black text-white mt-8 shadow-xl shadow-blue-500/20">{saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Guardar Configuración del Paso"}</button>
    </div>
  )
}
