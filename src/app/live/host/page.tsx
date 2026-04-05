"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import {
  IconBolt, IconTrophy, IconFlag, IconRocket, IconCheck, IconFire,
  IconClock, IconQuestion, IconMedal1, IconMedal2, IconMedal3,
  IconMoney, IconChart, IconCard, IconBriefcase, IconPlus, IconTrash, IconXP, IconGamepad, IconEdit
} from "@/components/live/LiveIcons"
import { Medal, Volume2, VolumeX } from "lucide-react"
import { useLiveAudio } from "@/hooks/useLiveAudio"

// ── BIZEN OFFICIAL QUIZ CATALOG ──────────────────────────────────────────────
const QUIZ_CATALOG = [
  {
    id: "fundamentos",
    title: "Fundamentos de Dinero",
    icon: "money",
    description: "¿Sabes en qué gastas? Descubre los principios básicos del dinero y el ahorro.",
    category: "Básico",
    difficulty: 1,
    estimatedMinutes: 10,
    questionCount: 8,
    gradient: "linear-gradient(135deg, #0056E7 0%, #1983FD 100%)",
    glow: "rgba(0,86,231,0.4)",
    questions: [
      { question_text: "¿Cuánto deberías destinar a un fondo de emergencia?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "5% de tus ingresos", isCorrect: false }, { id: "b", text: "10% de tus ingresos", isCorrect: true }, { id: "c", text: "30% de tus ingresos", isCorrect: false }, { id: "d", text: "50% de tus ingresos", isCorrect: false }] },
      { question_text: "¿Qué es la regla 50/30/20?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "50% ahorros, 30% gastos fijos, 20% lujos", isCorrect: false }, { id: "b", text: "50% necesidades, 30% deseos, 20% ahorros", isCorrect: true }, { id: "c", text: "50% inversiones, 30% ahorros, 20% gastos", isCorrect: false }, { id: "d", text: "50% deudas, 30% gastos, 20% otro", isCorrect: false }] },
      { question_text: "¿Qué es el interés compuesto?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Interés solo sobre el capital inicial", isCorrect: false }, { id: "b", text: "Interés sobre el capital e intereses acumulados", isCorrect: true }, { id: "c", text: "Una tarifa bancaria mensual", isCorrect: false }, { id: "d", text: "El porcentaje de impuesto sobre ingresos", isCorrect: false }] },
      { question_text: "¿Qué es la liquidez de un activo?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Su valor en el mercado", isCorrect: false }, { id: "b", text: "Qué tan rápido se puede convertir en efectivo", isCorrect: true }, { id: "c", text: "Su tasa de rendimiento anual", isCorrect: false }, { id: "d", text: "La cantidad de deuda asociada", isCorrect: false }] },
      { question_text: "¿Qué es una tarjeta de débito?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Un préstamo del banco", isCorrect: false }, { id: "b", text: "Acceso directo a tu dinero en cuenta", isCorrect: true }, { id: "c", text: "Una línea de crédito", isCorrect: false }, { id: "d", text: "Un instrumento de inversión", isCorrect: false }] },
      { question_text: "¿Si ahorras $100 al 10% anual, cuánto tienes después de 1 año con interés simple?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "$105", isCorrect: false }, { id: "b", text: "$110", isCorrect: true }, { id: "c", text: "$115", isCorrect: false }, { id: "d", text: "$120", isCorrect: false }] },
      { question_text: "¿Qué significa GDP o PIB?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El total de deuda gubernamental", isCorrect: false }, { id: "b", text: "El valor total de bienes y servicios producidos en un país", isCorrect: true }, { id: "c", text: "La tasa de desempleo nacional", isCorrect: false }, { id: "d", text: "El presupuesto federal anual", isCorrect: false }] },
      { question_text: "¿Cuál de estos es un gasto fijo?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Cena en restaurante", isCorrect: false }, { id: "b", text: "Renta mensual", isCorrect: true }, { id: "c", text: "Ropa nueva", isCorrect: false }, { id: "d", text: "Viaje de vacaciones", isCorrect: false }] },
    ]
  },
  {
    id: "inversiones",
    title: "Mundo de las Inversiones",
    icon: "chart",
    description: "¿Sabes qué es la bolsa? Aprende sobre acciones, bonos y cómo hacer crecer tu dinero.",
    category: "Intermedio",
    difficulty: 2,
    estimatedMinutes: 12,
    questionCount: 7,
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    glow: "rgba(14,165,233,0.4)",
    questions: [
      { question_text: "¿Qué es una acción (stock)?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un préstamo a una empresa", isCorrect: false }, { id: "b", text: "Una fracción de propiedad en una empresa", isCorrect: true }, { id: "c", text: "Un tipo de cuenta bancaria", isCorrect: false }, { id: "d", text: "Una moneda extranjera", isCorrect: false }] },
      { question_text: "¿Qué es diversificar un portafolio?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Poner todo en la inversión más rentable", isCorrect: false }, { id: "b", text: "Distribuir el dinero en distintos activos para reducir riesgo", isCorrect: true }, { id: "c", text: "Invertir solo en bienes raíces", isCorrect: false }, { id: "d", text: "Cambiar inversiones cada semana", isCorrect: false }] },
      { question_text: "¿Qué es un bono del gobierno?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Una acción de empresa pública", isCorrect: false }, { id: "b", text: "Un préstamo que le haces al gobierno", isCorrect: true }, { id: "c", text: "Un fondo de inversión mixto", isCorrect: false }, { id: "d", text: "Una divisa extranjera", isCorrect: false }] },
      { question_text: "¿Qué mide el índice S&P 500?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Las 500 empresas más grandes de México", isCorrect: false }, { id: "b", text: "El rendimiento de 500 grandes empresas de EE.UU.", isCorrect: true }, { id: "c", text: "El precio del dólar frente al peso", isCorrect: false }, { id: "d", text: "La inflación en Latinoamérica", isCorrect: false }] },
      { question_text: "¿Cuál es el riesgo principal de invertir en criptomonedas?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Son ilegales en México", isCorrect: false }, { id: "b", text: "Alta volatilidad y falta de regulación", isCorrect: true }, { id: "c", text: "Solo pueden comprarse en dólares", isCorrect: false }, { id: "d", text: "No generan ningún rendimiento", isCorrect: false }] },
      { question_text: "¿Qué es un ETF?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Una cuenta de ahorro especial", isCorrect: false }, { id: "b", text: "Un fondo que replica un índice y cotiza en bolsa", isCorrect: true }, { id: "c", text: "Un crédito hipotecario", isCorrect: false }, { id: "d", text: "Un tipo de criptomoneda", isCorrect: false }] },
      { question_text: "¿Qué significa 'rendimiento anualizado'?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Las ganancias totales de todos los años", isCorrect: false }, { id: "b", text: "La ganancia expresada como porcentaje anual equivalente", isCorrect: true }, { id: "c", text: "El precio de compra de un activo", isCorrect: false }, { id: "d", text: "Los impuestos pagados por inversión", isCorrect: false }] },
    ]
  },
  {
    id: "credito",
    title: "El Juego del Crédito",
    icon: "card",
    description: "Tarjetas, deudas, historial crediticio. ¿Sabes cómo jugar sin perder?",
    category: "Intermedio",
    difficulty: 2,
    estimatedMinutes: 10,
    questionCount: 6,
    gradient: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
    glow: "rgba(220,38,38,0.4)",
    questions: [
      { question_text: "¿Qué es el Buró de Crédito?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un banco del gobierno", isCorrect: false }, { id: "b", text: "Una empresa que registra tu historial crediticio", isCorrect: true }, { id: "c", text: "Una aseguradora de créditos", isCorrect: false }, { id: "d", text: "Un organismo que aprueba préstamos", isCorrect: false }] },
      { question_text: "¿Cuál es la consecuencia de pagar solo el mínimo en tu tarjeta?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "La deuda se congela", isCorrect: false }, { id: "b", text: "Los intereses se acumulan y la deuda crece", isCorrect: true }, { id: "c", text: "Obtienes más puntos de recompensa", isCorrect: false }, { id: "d", text: "Se cancela automáticamente al año", isCorrect: false }] },
      { question_text: "¿Qué es la CAT en un crédito?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "El límite de crédito disponible", isCorrect: false }, { id: "b", text: "El Costo Anual Total de un crédito, incluyendo comisiones", isCorrect: true }, { id: "c", text: "La cuota mensual fija del préstamo", isCorrect: false }, { id: "d", text: "El número de meses sin intereses", isCorrect: false }] },
      { question_text: "¿Cuánto de tu límite de crédito es recomendable usar?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El 100%, para maximizar beneficios", isCorrect: false }, { id: "b", text: "No más del 30%", isCorrect: true }, { id: "c", text: "El 50% exacto", isCorrect: false }, { id: "d", text: "Depende del banco únicamente", isCorrect: false }] },
      { question_text: "¿Qué es una hipoteca?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un seguro para tu hogar", isCorrect: false }, { id: "b", text: "Un préstamo a largo plazo con un inmueble como garantía", isCorrect: true }, { id: "c", text: "Un plan de ahorro mensual", isCorrect: false }, { id: "d", text: "Una inversión en bienes raíces", isCorrect: false }] },
      { question_text: "Pagar a tiempo tus deudas... ¿qué efecto tiene?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Aumenta tus impuestos", isCorrect: false }, { id: "b", text: "Mejora tu historial y score crediticio", isCorrect: true }, { id: "c", text: "Reduce tu límite de crédito", isCorrect: false }, { id: "d", text: "No tiene ningún efecto", isCorrect: false }] },
    ]
  },
  {
    id: "emprendimiento",
    title: "Mente Emprendedora",
    icon: "briefcase",
    description: "Del negocio a los números. Conoce lo que todo emprendedor debe saber de finanzas.",
    category: "Avanzado",
    difficulty: 3,
    estimatedMinutes: 15,
    questionCount: 8,
    gradient: "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
    glow: "rgba(180,83,9,0.4)",
    questions: [
      { question_text: "¿Qué es el punto de equilibrio en un negocio?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "El momento en que las ganancias son máximas", isCorrect: false }, { id: "b", text: "Cuando los ingresos igualan exactamente a los costos", isCorrect: true }, { id: "c", text: "El primer año de operaciones", isCorrect: false }, { id: "d", text: "La cantidad de productos vendidos al mes", isCorrect: false }] },
      { question_text: "¿Qué es el flujo de caja (cash flow)?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El saldo de la cuenta bancaria del negocio", isCorrect: false }, { id: "b", text: "El movimiento de entradas y salidas de dinero en un período", isCorrect: true }, { id: "c", text: "Las ganancias netas al final del año", isCorrect: false }, { id: "d", text: "El presupuesto de marketing", isCorrect: false }] },
      { question_text: "¿Qué es el margen de utilidad?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El total de ventas mensuales", isCorrect: false }, { id: "b", text: "La ganancia como porcentaje de los ingresos totales", isCorrect: true }, { id: "c", text: "El costo total de producción", isCorrect: false }, { id: "d", text: "El número de clientes atendidos", isCorrect: false }] },
      { question_text: "¿Qué es un MVP en emprendimiento?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El empleado más valioso del mes", isCorrect: false }, { id: "b", text: "Producto Mínimo Viable para validar una idea con el menor costo", isCorrect: true }, { id: "c", text: "Un modelo de valoración de empresas", isCorrect: false }, { id: "d", text: "Un plan de marketing digital", isCorrect: false }] },
      { question_text: "¿Qué significa que una empresa es scalable?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Que puede reducir costos fácilmente", isCorrect: false }, { id: "b", text: "Que puede crecer en ingresos sin aumentar costos proporcionalmente", isCorrect: true }, { id: "c", text: "Que tiene muchos empleados", isCorrect: false }, { id: "d", text: "Que opera en varios países", isCorrect: false }] },
      { question_text: "¿Cuál es la diferencia entre costo fijo y costo variable?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "No hay diferencia en la práctica", isCorrect: false }, { id: "b", text: "Los fijos no cambian con la producción; los variables sí", isCorrect: true }, { id: "c", text: "Los fijos se pagan solo una vez", isCorrect: false }, { id: "d", text: "Los variables son siempre más baratos", isCorrect: false }] },
      { question_text: "¿Qué es el ROI?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El registro oficial de ingresos", isCorrect: false }, { id: "b", text: "El retorno sobre la inversión, ganancia vs lo invertido", isCorrect: true }, { id: "c", text: "El tipo de cambio del dólar", isCorrect: false }, { id: "d", text: "El reglamento de operaciones internas", isCorrect: false }] },
      { question_text: "Un negocio con alta deuda y bajo flujo de caja...", question_type: "mcq", time_limit: 20, points_base: 1000, image_url: "", options: [{ id: "a", text: "Es el modelo más rentable", isCorrect: false }, { id: "b", text: "Tiene alto riesgo de insolvencia", isCorrect: true }, { id: "c", text: "Genera más confianza a inversores", isCorrect: false }, { id: "d", text: "Indica gran crecimiento futuro", isCorrect: false }] },
    ]
  },
]

interface Participant {
  id: string; nickname: string; avatar: { emoji?: string }; total_score: number; current_streak: number; is_active: boolean
}
type HostGameStatus = "catalog" | "templates" | "setup" | "lobby" | "in_question" | "showing_results" | "finished" | "create"
interface QuizTemplate { id: string; title: string; description?: string; category: string; difficulty: number; question_count: number; times_used: number; is_public: boolean; created_at: string }

function QuizIcon({ icon, size = 48 }: { icon: string; size?: number }) {
  const props = { size, color: "white" }
  if (icon === "money") return <IconMoney {...props} />
  if (icon === "chart") return <IconChart {...props} />
  if (icon === "card") return <IconCard {...props} />
  if (icon === "briefcase") return <IconBriefcase {...props} />
  return <IconBolt {...props} />
}

export default function HostPage() {
  const { user, dbProfile, loading: authLoading } = useAuth()
  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const router = useRouter()
  const supabase = createClient()

  const [hostStatus, setHostStatus] = useState<HostGameStatus>("catalog")
  const [selectedQuiz, setSelectedQuiz] = useState<typeof QUIZ_CATALOG[0] | null>(null)
  const [hoveredQuiz, setHoveredQuiz] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionPin, setSessionPin] = useState<string | null>(null)
  const [sessionTitle, setSessionTitle] = useState("")
  const [questions, setQuestions] = useState<any[]>(QUIZ_CATALOG[0].questions)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  // ── Templates state ────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState<QuizTemplate[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [saveTitle, setSaveTitle] = useState("")
  const [saveSaving, setSaveSaving] = useState(false)
  const [saveDone, setSaveDone] = useState(false)

  const [isMuted, setIsMuted] = useState(false)

  // 🔊 Audio Management
  const { playFeedback: _unused } = useLiveAudio(hostStatus, true && !isMuted)

  const sidebarOffset = 0;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentQ = questions[currentQIndex]

  useEffect(() => { if (!authLoading && !user) router.replace("/login") }, [authLoading, user, router])

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true)
    try {
      const res = await fetch("/api/live/templates")
      if (res.ok) {
        const data = await res.json()
        setTemplates(Array.isArray(data) ? data : [])
      }
    } catch { /* silent */ } finally { setTemplatesLoading(false) }
  }, [])

  useEffect(() => { if (user) loadTemplates() }, [user, loadTemplates])

  const handleSaveTemplate = async () => {
    if (!saveTitle.trim() || questions.length === 0) return
    setSaveSaving(true)
    try {
      const res = await fetch("/api/live/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: saveTitle, questions, category: "Custom", difficulty: 1 })
      })
      if (res.ok) {
        setSaveDone(true)
        await loadTemplates()
        setTimeout(() => { setSaveModalOpen(false); setSaveDone(false); setSaveTitle("") }, 1400)
      }
    } catch { /* silent */ } finally { setSaveSaving(false) }
  }

  const handleLoadTemplate = async (tpl: QuizTemplate) => {
    // Fetch full template with questions
    const res = await fetch(`/api/live/templates?id=${tpl.id}`)
    let qs = []
    if (res.ok) {
      const full = await res.json()
      qs = full.questions || []
    }
    if (!qs.length) return
    // Increment usage counter
    fetch("/api/live/templates", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: tpl.id, increment_used: true }) })
    setQuestions(qs)
    setSessionTitle(tpl.title)
    setSelectedQuiz(null)
    setHostStatus("setup")
  }

  const handleDeleteTemplate = async (id: string) => {
    await fetch(`/api/live/templates?id=${id}`, { method: "DELETE" })
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    if (!sessionId || hostStatus !== "in_question") return
    const channel = supabase.channel(`host_answers_${sessionId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_answers", filter: `session_id=eq.${sessionId}` }, payload => setAnswers(prev => [...prev, payload.new]))
      .on("postgres_changes", { event: "*", schema: "public", table: "live_participants", filter: `session_id=eq.${sessionId}` }, () => loadParticipants())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, hostStatus])

  useEffect(() => {
    if (!sessionId || hostStatus !== "lobby") return
    const channel = supabase.channel(`host_lobby_${sessionId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "live_participants", filter: `session_id=eq.${sessionId}` }, () => loadParticipants())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, hostStatus])

  const loadParticipants = useCallback(async () => {
    if (!sessionId) return
    const { data } = await supabase.from("live_participants").select("id, nickname, avatar, total_score, current_streak, is_active, is_host").eq("session_id", sessionId).eq("is_host", false).eq("is_active", true).order("total_score", { ascending: false })
    if (data) setParticipants(data as Participant[])
  }, [sessionId, supabase])

  const handleSelectQuiz = (quiz: typeof QUIZ_CATALOG[0]) => {
    setSelectedQuiz(quiz)
    setQuestions(quiz.questions)
    setSessionTitle(quiz.title)
    setHostStatus("setup")
  }

  const handleCreateSession = async () => {
    if (!user) return
    setCreating(true); setError("")
    try {
      const res = await fetch("/api/live/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: sessionTitle, questions, host_nickname: dbProfile?.nickname || dbProfile?.full_name || "Host", host_avatar: { emoji: "bolt" } }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Error al crear sesión"); return }
      setSessionId(data.session.id); setSessionPin(data.pin)
      setHostStatus("lobby")
    } catch { setError("Error de red. Intenta de nuevo.") }
    finally { setCreating(false) }
  }

  const updateSessionStatus = async (status: string, extra: Record<string, any> = {}) => {
    if (!sessionId) return
    await fetch("/api/live/sessions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sessionId, status, ...extra }) })
  }

  const startTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(seconds)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current!); return 0 } return prev - 1 })
    }, 1000)
  }

  const handleStartQuiz = async () => {
    setCurrentQIndex(0); setAnswers([])
    await updateSessionStatus("in_question", { current_question_index: 0, question_started_at: new Date().toISOString() })
    setHostStatus("in_question"); startTimer(questions[0].time_limit)
  }

  const handleShowResults = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    await updateSessionStatus("showing_results"); setHostStatus("showing_results")
    if (sessionId) {
      const snapshot = participants.map((p, i) => ({ rank: i + 1, participant_id: p.id, nickname: p.nickname, avatar: p.avatar, score: p.total_score, streak: p.current_streak }))
      await supabase.from("live_leaderboard_snapshots").insert({ session_id: sessionId, question_index: currentQIndex, snapshot })
    }
    await loadParticipants()
  }

  const handleNextQuestion = async () => {
    const next = currentQIndex + 1
    if (next >= questions.length) { await updateSessionStatus("finished"); setHostStatus("finished"); return }
    setCurrentQIndex(next); setAnswers([])
    await updateSessionStatus("in_question", { current_question_index: next, question_started_at: new Date().toISOString() })
    setHostStatus("in_question"); startTimer(questions[next].time_limit)
  }

  const handleFinish = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    await updateSessionStatus("finished"); setHostStatus("finished")
  }

  const active = participants.filter(p => p.is_active)
  const answeredCount = answers.length
  const timerPercent = currentQ ? (timeLeft / currentQ.time_limit) * 100 : 0

  // ── CATALOG ──────────────────────────────────────────────────────────────────
  if (hostStatus === "catalog" || hostStatus === "templates") {
    const activeTab = hostStatus
    const diffLabel = (d: number) => d === 1 ? "Básico" : d === 2 ? "Intermedio" : "Avanzado"
    const diffColor = (d: number) => d === 1 ? "#10b981" : d === 2 ? "#0F62FE" : "#f59e0b"
    const diffDots = (d: number, max = 3) => Array.from({ length: max }).map((_, i) => (
      <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < d ? diffColor(d) : "rgba(255,255,255,0.15)", boxShadow: i < d ? `0 0 6px ${diffColor(d)}` : "none" }} />
    ))

    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #060c1d 0%, #0a1628 60%, #050b18 100%)", padding: "0", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <style>{`
          @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
          @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
          .quiz-card { transition: transform 0.25s ease, box-shadow 0.25s ease; animation: fadeUp 0.4s ease both; cursor: pointer; }
          .quiz-card:hover { transform: translateY(-6px) scale(1.015); }
          .launch-btn { transition: all 0.2s ease; }
          .launch-btn:hover { transform: scale(1.04); filter: brightness(1.1); }
          .tpl-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
          .tpl-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important; }
        `}</style>

        {/* Top nav */}
        <div style={{ padding: "20px 32px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <button 
            onClick={() => router.push(isAdminOrTeacher ? "/teacher/dashboard" : "/dashboard")} 
            style={{ 
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.5)", 
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 
            }}
          >
            ← {isAdminOrTeacher ? "Volver al panel docente" : "Volver a Inicio"}
          </button>
          
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            style={{ 
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: 10, padding: "8px 12px", color: "rgba(255,255,255,0.5)", 
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 
            }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {isMuted ? "Sonido desactivado" : "Sonido activado"}
          </button>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "40px 24px 28px", animation: "fadeUp 0.35s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
            <IconBolt size={16} color="#fbbf24" />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#fbbf24", letterSpacing: "0.1em", textTransform: "uppercase" }}>BIZEN Live</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            {isAdminOrTeacher ? "Lanza un Quiz" : "Crea tu propio Quiz"}
          </h1>
          <p style={{ margin: "12px auto 0", maxWidth: 460, fontSize: 15, color: "rgba(255,255,255,0.40)", lineHeight: 1.6 }}>
            Usa nuestro catálogo oficial o crea un quiz personalizado para tus {isAdminOrTeacher ? "alumnos" : "compañeros"}.
          </p>
        </div>

        {/* Tab Strip */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "0 24px 32px" }}>
          {([
            { key: "catalog", label: "Catálogo BIZEN", icon: <IconBolt size={14} color={activeTab === "catalog" ? "#fbbf24" : "rgba(255,255,255,0.4)"} /> },
            { key: "templates", label: `Mis Plantillas${templates.length ? ` (${templates.length})` : ""}`, icon: <IconEdit size={14} color={activeTab === "templates" ? "#818cf8" : "rgba(255,255,255,0.4)"} /> },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setHostStatus(tab.key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 99, background: activeTab === tab.key ? (tab.key === "catalog" ? "rgba(251,191,36,0.1)" : "rgba(99,102,241,0.12)") : "rgba(255,255,255,0.05)", border: `1.5px solid ${activeTab === tab.key ? (tab.key === "catalog" ? "rgba(251,191,36,0.3)" : "rgba(99,102,241,0.35)") : "rgba(255,255,255,0.08)"}`, color: activeTab === tab.key ? "white" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* ── CATALOG TAB ── */}
        {activeTab === "catalog" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, padding: "0 40px 60px", maxWidth: 1800, margin: "0 auto" }}>
            {QUIZ_CATALOG.map((quiz, idx) => {
              const isHovered = hoveredQuiz === quiz.id
              return (
                <div
                  key={quiz.id}
                  className="quiz-card"
                  style={{ animationDelay: `${idx * 0.08}s`, borderRadius: 24, overflow: "hidden", boxShadow: isHovered ? `0 24px 48px ${quiz.glow}` : "0 8px 24px rgba(0,0,0,0.3)", border: `1.5px solid ${isHovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}` }}
                  onMouseEnter={() => setHoveredQuiz(quiz.id)}
                  onMouseLeave={() => setHoveredQuiz(null)}
                  onClick={() => handleSelectQuiz(quiz)}
                >
                  <div style={{ background: quiz.gradient, padding: "28px 28px 24px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                    <div style={{ position: "absolute", bottom: -30, left: "30%", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                    <div style={{ marginBottom: 14, animation: isHovered ? "float 2s ease-in-out infinite" : "none", display: "inline-block" }}>
                      <QuizIcon icon={quiz.icon} size={44} />
                    </div>
                    <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>{quiz.category}</span>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: "white", lineHeight: 1.2 }}>{quiz.title}</h2>
                  </div>
                  <div style={{ background: "rgba(10,20,40,0.95)", padding: "20px 24px 24px" }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.55, margin: "0 0 20px" }}>{quiz.description}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                      {[
                        { label: "Preguntas", value: quiz.questionCount, icon: <IconQuestion size={13} color="rgba(255,255,255,0.35)" /> },
                        { label: "Tiempo est.", value: `~${quiz.estimatedMinutes} min`, icon: <IconClock size={13} color="rgba(255,255,255,0.35)" /> },
                      ].map(m => (
                        <div key={m.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px 14px" }}>
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>{m.icon} {m.label}</div>
                          <div style={{ fontSize: 16, fontWeight: 500, color: "white" }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase" }}>Dificultad</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ display: "flex", gap: 5 }}>{diffDots(quiz.difficulty)}</div>
                        <span style={{ fontSize: 12, fontWeight: 500, color: diffColor(quiz.difficulty) }}>{diffLabel(quiz.difficulty)}</span>
                      </div>
                    </div>
                    <button className="launch-btn" style={{ width: "100%", padding: "13px", background: quiz.gradient, border: "none", borderRadius: 14, color: "white", fontSize: 15, fontWeight: 500, cursor: "pointer", boxShadow: `0 6px 20px ${quiz.glow}`, letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={e => { e.stopPropagation(); handleSelectQuiz(quiz) }}>
                      <IconBolt size={16} color="white" /> Usar este Quiz
                    </button>
                  </div>
                </div>
              )
            })}
            <div className="quiz-card" style={{ animationDelay: `${QUIZ_CATALOG.length * 0.08}s`, borderRadius: 24, overflow: "hidden", boxShadow: hoveredQuiz === "__create__" ? "0 24px 48px rgba(15,98,254,0.4)" : "0 8px 24px rgba(0,0,0,0.3)", border: `1.5px solid ${hoveredQuiz === "__create__" ? "rgba(15,98,254,0.5)" : "rgba(255,255,255,0.08)"}` }} onMouseEnter={() => setHoveredQuiz("__create__")} onMouseLeave={() => setHoveredQuiz(null)} onClick={() => setHostStatus("create")}>
              <div style={{ background: "linear-gradient(135deg, #0d2a6b 0%, #1a56db 100%)", padding: "28px 28px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ marginBottom: 14, display: "inline-block" }}><IconEdit size={44} color="white" /></div>
                <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Personalizado</span>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: "white", lineHeight: 1.2 }}>Crear Quiz Propio</h2>
              </div>
              <div style={{ background: "rgba(10,20,40,0.95)", padding: "20px 24px 24px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.55, margin: "0 0 20px" }}>Crea tus propias preguntas de opción múltiple con el tema y contenido que necesites.</p>
                <button className="launch-btn" style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #0d2a6b, #1a56db)", border: "none", borderRadius: 14, color: "white", fontSize: 15, fontWeight: 500, cursor: "pointer", boxShadow: "0 6px 20px rgba(15,98,254,0.4)", letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={e => { e.stopPropagation(); setHostStatus("create") }}>
                  <IconPlus size={16} color="white" /> Crear nuevo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TEMPLATES TAB ── */}
        {activeTab === "templates" && (
          <div style={{ padding: "0 40px 60px", maxWidth: 1400, margin: "0 auto" }}>
            {templatesLoading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontSize: 15 }}>Cargando plantillas...</div>
            ) : templates.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <IconEdit size={32} color="#0056E7" />
                </div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, margin: "0 0 8px" }}>Aún no tienes plantillas guardadas</p>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, margin: 0 }}>Al terminar un quiz personalizado podrás guardarlo aquí para reutilizarlo.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {templates.map((tpl, idx) => (
                  <div key={tpl.id} className="tpl-card" style={{ animationDelay: `${idx * 0.06}s`, borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(99,102,241,0.2)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
                    {/* Header band */}
                    <div style={{ background: "linear-gradient(135deg, rgba(55,48,163,0.6), rgba(99,102,241,0.4))", padding: "18px 20px 14px", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "white", lineHeight: 1.3 }}>{tpl.title}</h3>
                        <button onClick={() => handleDeleteTemplate(tpl.id)} style={{ flexShrink: 0, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "4px 8px", cursor: "pointer", display: "flex", color: "#f87171", fontSize: 11 }}>
                          <IconTrash size={13} color="#f87171" />
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        <span style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "2px 10px", borderRadius: 99, fontSize: 11 }}>{tpl.category}</span>
                        {tpl.is_public && <span style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", padding: "2px 10px", borderRadius: 99, fontSize: 11 }}>Público</span>}
                      </div>
                    </div>
                    {/* Body */}
                    <div style={{ padding: "14px 20px 18px" }}>
                      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{tpl.question_count}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 3 }}><IconQuestion size={10} color="rgba(255,255,255,0.35)" /> preguntas</div>
                        </div>
                        <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{tpl.times_used}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 3 }}><IconRocket size={10} color="rgba(255,255,255,0.35)" /> usos</div>
                        </div>
                        <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: diffColor(tpl.difficulty) }}>{diffLabel(tpl.difficulty).slice(0,3)}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>nivel</div>
                        </div>
                      </div>
                      <button onClick={() => handleLoadTemplate(tpl)} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #0d2a6b, #1a56db)", border: "none", borderRadius: 12, color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(15,98,254,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.2s" }}>
                        <IconRocket size={14} color="white" /> Usar plantilla
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }


  // ── SETUP ────────────────────────────────────────────────────────────────────
  if (hostStatus === "setup") {
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #060c1d 0%, #0a1428 100%)", padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <div style={{ width: "100%", maxWidth: 1600 }}>
          <button onClick={() => setHostStatus("catalog")} style={{ marginBottom: 32, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>
            ← Cambiar quiz
          </button>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
              {selectedQuiz && <QuizIcon icon={selectedQuiz.icon} size={52} />}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><IconBolt size={12} color="rgba(255,255,255,0.35)" /> BIZEN Live</div>
            <h1 style={{ fontSize: 28, fontWeight: 500, color: "white", margin: 0 }}>Configurar sesión</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 8, fontSize: 15 }}>Revisa las preguntas y lanza el quiz en vivo</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Título de la sesión</label>
            <input type="text" value={sessionTitle} onChange={e => setSessionTitle(e.target.value)} style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "white", fontSize: 16, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>Preguntas ({questions.length})</label>
            {questions.map((q, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 18px", marginBottom: 8, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(15,98,254,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{q.question_text}</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0, display: "flex", alignItems: "center", gap: 4 }}><IconClock size={11} color="rgba(255,255,255,0.35)" /> {q.time_limit}s &middot; {q.options.length} opciones</p>
                </div>
              </div>
            ))}
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 14, textAlign: "center", marginBottom: 16 }}>{error}</p>}

          <button onClick={handleCreateSession} disabled={creating} style={{ width: "100%", padding: "18px", background: creating ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 18, color: "white", fontSize: 16, fontWeight: 500, cursor: creating ? "not-allowed" : "pointer", boxShadow: "0 8px 24px rgba(0,86,231,0.4)" }}>
            {creating ? "Creando sesión..." : <><IconBolt size={16} color="white" /> Iniciar sesión en vivo</>}
          </button>
        </div>
      </div>
    )
  }

  // ── LOBBY ────────────────────────────────────────────────────────────────────
  if (hostStatus === "lobby") {
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #08112a 0%, #0a1632 100%)", padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <div style={{ width: "100%", maxWidth: 1600, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Comparte el PIN con tus {isAdminOrTeacher ? "alumnos" : "compañeros"}</p>
          <div style={{ fontSize: 80, fontWeight: 500, color: "white", letterSpacing: "0.15em", textShadow: "0 0 60px rgba(15,98,254,0.5)", marginBottom: 8 }}>{sessionPin}</div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginBottom: 40 }}>Accede desde <strong style={{ color: "rgba(255,255,255,0.6)" }}>bizen.mx/live/join</strong></p>
          <div style={{ marginBottom: 12, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Jugadores conectados: <strong style={{ color: "#3B82F6", fontSize: 20 }}>{active.length}</strong></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 40, minHeight: 80 }}>
            <AnimatePresence>
              {active.map((p, i) => (
                <motion.div key={p.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 400, delay: i * 0.03 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconGamepad size={26} color="rgba(255,255,255,0.7)" /></div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", maxWidth: 64, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nickname}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {active.length === 0 && <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, alignSelf: "center" }}>Esperando jugadores...</p>}
          </div>
          <button onClick={handleStartQuiz} disabled={active.length === 0} style={{ width: "100%", maxWidth: 360, padding: "18px", background: active.length > 0 ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 18, color: "white", fontSize: 18, fontWeight: 800, cursor: active.length > 0 ? "pointer" : "not-allowed", boxShadow: active.length > 0 ? "0 8px 32px rgba(16,185,129,0.4)" : "none", transition: "all 0.3s" }}>
            {active.length > 0 ? <><IconRocket size={18} color="white" /> {`¡Empezar con ${active.length} jugador${active.length > 1 ? "es" : ""}!`}</> : "Esperando jugadores..."}
          </button>
        </div>
      </div>
    )
  }

  // ── IN QUESTION ──────────────────────────────────────────────────────────────
  if (hostStatus === "in_question" && currentQ) {
    const correctId = (currentQ.options as any[]).find((o: any) => o.isCorrect)?.id
    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", display: "flex", flexDirection: "column", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Pregunta <strong style={{ color: "white" }}>{currentQIndex + 1}</strong>/{questions.length}</span>
          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: timeLeft <= 5 ? "#ef4444" : "#0F62FE", width: `${timerPercent}%`, transition: "width 1s linear, background 0.5s ease" }} />
          </div>
          <span style={{ color: timeLeft <= 5 ? "#ef4444" : "white", fontSize: 28, fontWeight: 900, minWidth: 52, textAlign: "right" }}>{timeLeft}s</span>
        </div>
        <div style={{ padding: "40px 48px 32px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1.3, maxWidth: 720, margin: 0 }}>{currentQ.question_text}</h2>
          
          {currentQ.image_url && (
            <div style={{ width: "100%", maxWidth: 640, height: 320, borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
              <img src={currentQ.image_url} alt="Pregunta" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720, width: "100%" }}>
            {(currentQ.options as any[]).map((opt: any, i: number) => {
              const colors = ["rgba(15,98,254,0.3)", "rgba(5,150,105,0.3)", "rgba(232,93,74,0.3)", "rgba(245,166,35,0.3)"]
              const borders = ["rgba(15,98,254,0.6)", "rgba(5,150,105,0.6)", "rgba(232,93,74,0.6)", "rgba(245,166,35,0.6)"]
              return (
                <div key={opt.id} style={{ background: colors[i % 4], border: `2px solid ${borders[i % 4]}`, borderRadius: 16, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 20, color: "white" }}>{["▲", "◆", "●", "■"][i % 4]}</span>
                  <span style={{ flex: 1, color: "white", fontWeight: 700, fontSize: 16 }}>{opt.text}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 800, fontSize: 18 }}>{answers.filter(a => a.selected_option_id === opt.id).length}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, fontWeight: 900, color: "white" }}>{answeredCount}</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>respuestas</div></div>
            <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, fontWeight: 900, color: "white" }}>{active.length}</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>jugadores</div></div>
          </div>
        </div>
        <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={handleFinish} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>Terminar quiz</button>
          <button onClick={handleShowResults} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,86,231,0.35)" }}>Ver respuestas →</button>
        </div>
      </div>
    )
  }

  // ── SHOWING RESULTS ──────────────────────────────────────────────────────────
  if (hostStatus === "showing_results") {
    const correctId = (currentQ?.options as any[])?.find((o: any) => o.isCorrect)?.id
    const top5 = participants.slice(0, 5)
    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", display: "flex", flexDirection: "column", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <div style={{ padding: "32px 48px", flex: 1, overflowY: "auto" }}>
          <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 24, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><IconTrophy size={22} color="#fbbf24" /> Leaderboard — Pregunta {currentQIndex + 1}</h2>
          {currentQ && (
            <div style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 600, margin: "0 auto 32px" }}>
              {(currentQ.options as any[]).map((opt: any, i: number) => {
                const count = answers.filter(a => a.selected_option_id === opt.id).length
                const isCorrect = opt.id === correctId
                const colors = ["rgba(15,98,254,0.3)", "rgba(5,150,105,0.3)", "rgba(232,93,74,0.3)", "rgba(245,166,35,0.3)"]
                return (
                  <div key={opt.id} style={{ background: isCorrect ? "rgba(16,185,129,0.15)" : colors[i % 4], border: `2px solid ${isCorrect ? "rgba(16,185,129,0.5)" : "transparent"}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: isCorrect ? "#34d399" : "rgba(255,255,255,0.7)", fontSize: 18, display: "flex" }}>{isCorrect ? <IconCheck size={20} /> : ["▲", "◆", "●", "■"][i % 4]}</span>
                    <span style={{ flex: 1, color: "white", fontSize: 14, fontWeight: 600 }}>{opt.text}</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 800 }}>{count}</span>
                  </div>
                )
              })}
            </div>
          )}
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {top5.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, marginBottom: 10, background: i === 0 ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.07)"}` }}>
                <div style={{ display: "flex" }}>{i === 0 ? <IconMedal1 size={28} /> : i === 1 ? <IconMedal2 size={28} /> : i === 2 ? <IconMedal3 size={28} /> : <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.3)", width: 28, textAlign: "center" }}>{i+1}</span>}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconGamepad size={18} color="rgba(255,255,255,0.6)" /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>{p.nickname}</p>
                  {p.current_streak >= 3 && <span style={{ color: "#f87171", fontSize: 12, display: "flex", alignItems: "center", gap: 3 }}><IconFire size={11} /> ×{p.current_streak} en racha</span>}
                </div>
                <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 18 }}>{p.total_score.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={handleFinish} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>Terminar quiz</button>
          <button onClick={handleNextQuestion} style={{ padding: "12px 28px", background: currentQIndex + 1 >= questions.length ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,86,231,0.35)" }}>
            {currentQIndex + 1 >= questions.length ? <><IconFlag size={16} color="white" /> Ver resultado final</> : "Siguiente pregunta →"}
          </button>
        </div>
      </div>
    )
  }

  // ── FINISHED ─────────────────────────────────────────────────────────────────
  if (hostStatus === "finished") {
    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <h1 style={{ color: "white", fontSize: 36, fontWeight: 500, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}><IconFlag size={32} color="#10b981" /> ¡Quiz terminado!</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>Resultados finales — {sessionTitle}</p>
        <div style={{ width: "100%", maxWidth: 480, marginBottom: 40 }}>
          {participants.slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, marginBottom: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center" }}>{i === 0 ? <IconMedal1 size={28} /> : i === 1 ? <IconMedal2 size={28} /> : i === 2 ? <IconMedal3 size={28} /> : <span style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.3)", width: 28, textAlign: "center" }}>{i+1}</span>}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconGamepad size={18} color="rgba(255,255,255,0.6)" /></div>
              <span style={{ flex: 1, color: "white", fontWeight: 700 }}>{p.nickname}</span>
              <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 18 }}>{p.total_score.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => setHostStatus("catalog")} style={{ padding: "14px 28px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, color: "white", fontWeight: 600, cursor: "pointer" }}>Nuevo quiz</button>
          <button onClick={() => { setSaveTitle(sessionTitle); setSaveModalOpen(true) }} style={{ padding: "14px 28px", background: "linear-gradient(135deg, #0d2a6b, #1a56db)", border: "none", borderRadius: 14, color: "white", fontWeight: 600, cursor: "pointer", boxShadow: "0 6px 20px rgba(15,98,254,0.35)", display: "flex", alignItems: "center", gap: 8 }}>
            <IconEdit size={15} color="white" /> Guardar como plantilla
          </button>
          <button onClick={() => router.push("/teacher/dashboard")} style={{ padding: "14px 28px", background: "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 14, color: "white", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,86,231,0.35)" }}>Ir al panel →</button>
        </div>
        {/* Save Template Modal */}
        {saveModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }} onClick={() => setSaveModalOpen(false)}>
            <div style={{ background: "#0d1b36", border: "1.5px solid rgba(99,102,241,0.3)", borderRadius: 24, padding: "32px 28px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconEdit size={20} color="#818cf8" /></div>
                <div>
                  <h3 style={{ margin: 0, color: "white", fontSize: 18, fontWeight: 600 }}>Guardar plantilla</h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{questions.length} preguntas</p>
                </div>
              </div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Nombre de la plantilla</label>
              <input
                value={saveTitle}
                onChange={e => setSaveTitle(e.target.value)}
                placeholder="Ej. Quiz Semana 3 — Inversiones"
                style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "white", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 20 }}
              />
              {saveDone ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 14, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", fontWeight: 600 }}>
                  <IconCheck size={18} /> ¡Plantilla guardada!
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSaveModalOpen(false)} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontWeight: 600 }}>Cancelar</button>
                  <button onClick={handleSaveTemplate} disabled={!saveTitle.trim() || saveSaving} style={{ flex: 2, padding: "13px", background: saveTitle.trim() ? "linear-gradient(135deg, #0d2a6b, #1a56db)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, color: "white", cursor: saveTitle.trim() ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: saveTitle.trim() ? "0 4px 16px rgba(15,98,254,0.35)" : "none" }}>
                    {saveSaving ? "Guardando..." : <><IconEdit size={14} color="white" /> Guardar</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── CREATE QUIZ FROM SCRATCH ─────────────────────────────────────────────────────
  if (hostStatus === "create") return <CreateQuizForm onBack={() => setHostStatus("catalog")} onLaunch={(qs, title) => { setQuestions(qs); setSessionTitle(title); setHostStatus("setup") }} />

  return null
}

type CustomQ = { question_text: string; question_type: string; time_limit: number; points_base: number; image_url?: string; options: { id: string; text: string; isCorrect: boolean }[] }

function CreateQuizForm({ onBack, onLaunch }: { onBack: () => void; onLaunch: (qs: CustomQ[], title: string) => void }) {
  const [title, setTitle] = useState("Mi Quiz")
  const [questions, setQuestions] = useState<CustomQ[]>([{ question_text: "", question_type: "mcq", time_limit: 20, points_base: 1000, image_url: "", options: [{ id: "a", text: "", isCorrect: true }, { id: "b", text: "", isCorrect: false }, { id: "c", text: "", isCorrect: false }, { id: "d", text: "", isCorrect: false }] }])

  const addQuestion = () => setQuestions(prev => [...prev, { question_text: "", question_type: "mcq", time_limit: 20, points_base: 1000, image_url: "", options: [{ id: "a", text: "", isCorrect: true }, { id: "b", text: "", isCorrect: false }, { id: "c", text: "", isCorrect: false }, { id: "d", text: "", isCorrect: false }] }])
  const removeQuestion = (i: number) => setQuestions(prev => prev.filter((_, idx) => idx !== i))
  const updateQ = (i: number, field: string, val: any) => setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: val } : q))
  const updateOpt = (qi: number, oi: number, field: string, val: any) => setQuestions(prev => prev.map((q, idx) => idx !== qi ? q : { ...q, options: q.options.map((o, oidx) => oidx !== oi ? o : { ...o, [field]: val }) }))
  const setCorrect = (qi: number, oi: number) => setQuestions(prev => prev.map((q, idx) => idx !== qi ? q : { ...q, options: q.options.map((o, oidx) => ({ ...o, isCorrect: oidx === oi })) }))

  const canLaunch = title.trim() && questions.every(q => q.question_text.trim() && q.options.every(o => o.text.trim()))

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #060c1d 0%, #0a1428 100%)", padding: "40px 24px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>← Volver</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><IconEdit size={18} color="#0056E7" /><span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>Crear quiz personalizado</span></div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Título del quiz</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "white", fontSize: 16, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
        </div>

        {questions.map((q, qi) => (
          <div key={qi} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ color: "#0056E7", fontWeight: 800, fontSize: 14 }}>Pregunta {qi + 1}</span>
              {questions.length > 1 && <button onClick={() => removeQuestion(qi)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#f87171", fontSize: 12 }}><IconTrash size={13} color="#f87171" /> Eliminar</button>}
            </div>
            <input placeholder="Escribe la pregunta..." value={q.question_text} onChange={e => updateQ(qi, "question_text", e.target.value)} style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, fontWeight: 600, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}><IconClock size={11} color="rgba(255,255,255,0.4)" /> Tiempo (seg)</label>
                <select value={q.time_limit} onChange={e => updateQ(qi, "time_limit", Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, cursor: "pointer", outline: "none" }}>
                  {[10, 15, 20, 25, 30, 45, 60].map(t => <option key={t} value={t} style={{ background: "#0a1428" }}>{t}s</option>)}
                </select>
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>URL de imagen (opcional)</label>
                <input placeholder="https://ejemplo.com/imagen.png" value={q.image_url} onChange={e => updateQ(qi, "image_url", e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 13, outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {q.options.map((opt, oi) => {
                const colors = ["rgba(15,98,254,0.2)", "rgba(5,150,105,0.2)", "rgba(232,93,74,0.2)", "rgba(245,166,35,0.2)"]
                return (
                  <div key={oi} style={{ background: opt.isCorrect ? "rgba(16,185,129,0.12)" : colors[oi], border: `2px solid ${opt.isCorrect ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "10px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => setCorrect(qi, oi)} style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${opt.isCorrect ? "#10b981" : "rgba(255,255,255,0.2)"}`, background: opt.isCorrect ? "#10b981" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {opt.isCorrect && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                    </button>
                    <input placeholder={`Opción ${["A","B","C","D"][oi]}`} value={opt.text} onChange={e => updateOpt(qi, oi, "text", e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, fontWeight: 600 }} />
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={addQuestion} style={{ flex: 1, padding: "14px", background: "rgba(99,102,241,0.1)", border: "1.5px dashed rgba(99,102,241,0.3)", borderRadius: 14, color: "#818cf8", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <IconPlus size={16} color="#818cf8" /> Añadir pregunta
          </button>
          <button onClick={() => canLaunch && onLaunch(questions, title)} disabled={!canLaunch} style={{ flex: 2, padding: "14px", background: canLaunch ? "linear-gradient(135deg, #0056E7, #1983FD)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, color: "white", fontSize: 15, fontWeight: 800, cursor: canLaunch ? "pointer" : "not-allowed", boxShadow: canLaunch ? "0 8px 24px rgba(0,86,231,0.4)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <IconBolt size={16} color="white" /> Previsualize y lanzar
          </button>
        </div>
      </div>
    </div>
  )
}
