"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

// ── Default sample questions for quick testing ──
const DEFAULT_QUESTIONS = [
  {
    question_text: "¿Cuánto deberías destinar mensualmente a un fondo de emergencia?",
    question_type: "mcq",
    time_limit: 20,
    points_base: 1000,
    options: [
      { id: "a", text: "5% de tus ingresos", isCorrect: false },
      { id: "b", text: "10% de tus ingresos", isCorrect: true },
      { id: "c", text: "30% de tus ingresos", isCorrect: false },
      { id: "d", text: "50% de tus ingresos", isCorrect: false },
    ],
  },
  {
    question_text: "¿Cuál es la regla 50/30/20 en finanzas personales?",
    question_type: "mcq",
    time_limit: 25,
    points_base: 1000,
    options: [
      { id: "a", text: "50% ahorros, 30% gastos fijos, 20% lujos", isCorrect: false },
      { id: "b", text: "50% necesidades, 30% deseos, 20% ahorros", isCorrect: true },
      { id: "c", text: "50% inversiones, 30% ahorros, 20% gastos", isCorrect: false },
      { id: "d", text: "50% deudas, 30% gastos, 20% otro", isCorrect: false },
    ],
  },
  {
    question_text: "¿Qué es el interés compuesto?",
    question_type: "mcq",
    time_limit: 20,
    points_base: 1000,
    options: [
      { id: "a", text: "Interés solo sobre el capital inicial", isCorrect: false },
      { id: "b", text: "Interés sobre el capital e intereses acumulados", isCorrect: true },
      { id: "c", text: "Una tarifa bancaria mensual", isCorrect: false },
      { id: "d", text: "El porcentaje de impuesto sobre ingresos", isCorrect: false },
    ],
  },
]

interface Participant {
  id: string; nickname: string; avatar: { emoji?: string }; total_score: number; current_streak: number; is_active: boolean
}

type HostGameStatus = "setup" | "lobby" | "in_question" | "showing_results" | "leaderboard" | "finished"

export default function HostPage() {
  const { user, dbProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [hostStatus, setHostStatus] = useState<HostGameStatus>("setup")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionPin, setSessionPin] = useState<string | null>(null)
  const [sessionTitle, setSessionTitle] = useState("Mi Quiz de Finanzas")
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentQ = questions[currentQIndex]

  // Guard: redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login")
  }, [authLoading, user, router])

  // ── Realtime: listen for answers coming in ──
  useEffect(() => {
    if (!sessionId || hostStatus !== "in_question") return
    const channel = supabase
      .channel(`host_answers_${sessionId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_answers", filter: `session_id=eq.${sessionId}` }, payload => {
        setAnswers(prev => [...prev, payload.new])
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "live_participants", filter: `session_id=eq.${sessionId}` }, () => {
        loadParticipants()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, hostStatus, supabase])

  // ── Also listen for participants in lobby ──
  useEffect(() => {
    if (!sessionId || hostStatus !== "lobby") return
    const channel = supabase
      .channel(`host_lobby_${sessionId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "live_participants", filter: `session_id=eq.${sessionId}` }, () => {
        loadParticipants()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, hostStatus, supabase])

  const loadParticipants = useCallback(async () => {
    if (!sessionId) return
    const { data } = await supabase
      .from("live_participants")
      .select("id, nickname, avatar, total_score, current_streak, is_active, is_host")
      .eq("session_id", sessionId)
      .eq("is_host", false)
      .eq("is_active", true)
      .order("total_score", { ascending: false })
    if (data) setParticipants(data as Participant[])
  }, [sessionId, supabase])

  // ── Create session ──
  const handleCreateSession = async () => {
    if (!user) return
    setCreating(true)
    setError("")
    try {
      const res = await fetch("/api/live/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sessionTitle,
          questions,
          host_nickname: dbProfile?.nickname || dbProfile?.full_name || "Host",
          host_avatar: { emoji: "⚡" },
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Error al crear sesión"); setCreating(false); return }
      setSessionId(data.session.id)
      setSessionPin(data.pin)
      setHostStatus("lobby")
    } catch { setError("Error de red. Intenta de nuevo.") }
    finally { setCreating(false) }
  }

  // ── Update session status on Supabase ──
  const updateSessionStatus = async (status: string, extraFields: Record<string, any> = {}) => {
    if (!sessionId) return
    await fetch("/api/live/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, status, ...extraFields }),
    })
  }

  // ── Start the quiz (lobby → first question) ──
  const handleStartQuiz = async () => {
    setCurrentQIndex(0)
    setAnswers([])
    await updateSessionStatus("in_question", { current_question_index: 0, question_started_at: new Date().toISOString() })
    setHostStatus("in_question")
    startTimer(currentQ.time_limit)
  }

  // ── Start timer for current question ──
  const startTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(seconds)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // ── Show results & leaderboard ──
  const handleShowResults = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    await updateSessionStatus("showing_results")
    setHostStatus("showing_results")
    // Save leaderboard snapshot
    if (sessionId) {
      const snapshot = participants.map((p, i) => ({
        rank: i + 1,
        participant_id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.total_score,
        streak: p.current_streak,
      }))
      await supabase.from("live_leaderboard_snapshots").insert({
        session_id: sessionId,
        question_index: currentQIndex,
        snapshot,
      })
    }
    await loadParticipants()
  }

  // ── Next question or finish ──
  const handleNextQuestion = async () => {
    const nextIndex = currentQIndex + 1
    if (nextIndex >= questions.length) {
      await updateSessionStatus("finished")
      setHostStatus("finished")
      return
    }
    setCurrentQIndex(nextIndex)
    setAnswers([])
    await updateSessionStatus("in_question", { current_question_index: nextIndex, question_started_at: new Date().toISOString() })
    setHostStatus("in_question")
    startTimer(questions[nextIndex].time_limit)
  }

  const handleFinish = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    await updateSessionStatus("finished")
    setHostStatus("finished")
  }

  const active = participants.filter(p => p.is_active)
  const answeredCount = answers.length
  const timerPercent = currentQ ? (timeLeft / currentQ.time_limit) * 100 : 0

  // ─────────────────────────────────────────────
  // RENDERS
  // ─────────────────────────────────────────────

  // ── SETUP ──
  if (hostStatus === "setup") {
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #060c1d 0%, #0a1428 100%)", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 640 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 8 }}>⚡ BIZEN Live</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "white", margin: 0 }}>Crear quiz en vivo</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 8, fontSize: 15 }}>Configura tu sesión y comparte el PIN con tus alumnos</p>
          </div>

          {/* Title input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
              Título de la sesión
            </label>
            <input
              type="text"
              value={sessionTitle}
              onChange={e => setSessionTitle(e.target.value)}
              style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "white", fontSize: 16, fontWeight: 600, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Questions preview */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>
              Preguntas ({questions.length})
            </label>
            {questions.map((q, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 18px", marginBottom: 8, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(15,98,254,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{q.question_text}</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>⏱ {q.time_limit}s · {q.options.length} opciones</p>
                </div>
              </div>
            ))}
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 14, textAlign: "center", marginBottom: 16 }}>{error}</p>}

          <button
            onClick={handleCreateSession}
            disabled={creating}
            style={{ width: "100%", padding: "18px", background: creating ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 18, color: "white", fontSize: 16, fontWeight: 700, cursor: creating ? "not-allowed" : "pointer", boxShadow: "0 8px 24px rgba(0,86,231,0.4)" }}
          >
            {creating ? "Creando sesión..." : "⚡ Iniciar sesión en vivo"}
          </button>
        </div>
      </div>
    )
  }

  // ── LOBBY ──
  if (hostStatus === "lobby") {
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #08112a 0%, #0a1632 100%)", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 640, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Comparte el PIN con tus alumnos
          </p>
          <div style={{ fontSize: 80, fontWeight: 900, color: "white", letterSpacing: "0.15em", textShadow: "0 0 60px rgba(15,98,254,0.5)", marginBottom: 8 }}>
            {sessionPin}
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginBottom: 40 }}>
            Accede desde <strong style={{ color: "rgba(255,255,255,0.6)" }}>bizen.mx/live/join</strong>
          </p>

          <div style={{ marginBottom: 12, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Jugadores conectados: <strong style={{ color: "#3B82F6", fontSize: 20 }}>{active.length}</strong>
          </div>

          {/* Participants grid */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 40, minHeight: 80 }}>
            <AnimatePresence>
              {active.map((p, i) => (
                <motion.div key={p.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 400, delay: i * 0.03 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                      {p.avatar?.emoji || "🎮"}
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", maxWidth: 64, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.nickname}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {active.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, alignSelf: "center" }}>Esperando jugadores...</p>
            )}
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={active.length === 0}
            style={{ width: "100%", maxWidth: 360, padding: "18px", background: active.length > 0 ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 18, color: "white", fontSize: 18, fontWeight: 800, cursor: active.length > 0 ? "pointer" : "not-allowed", boxShadow: active.length > 0 ? "0 8px 32px rgba(16,185,129,0.4)" : "none", transition: "all 0.3s" }}
          >
            {active.length > 0 ? `🚀 ¡Empezar con ${active.length} jugador${active.length > 1 ? "es" : ""}!` : "Esperando jugadores..."}
          </button>
        </div>
      </div>
    )
  }

  // ── IN QUESTION (Host view) ──
  if (hostStatus === "in_question" && currentQ) {
    const correctId = currentQ.options.find(o => o.isCorrect)?.id
    const correctAnswers = answers.filter(a => a.selected_option_id === correctId).length

    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            Pregunta <strong style={{ color: "white" }}>{currentQIndex + 1}</strong>/{questions.length}
          </span>
          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: timeLeft <= 5 ? "#ef4444" : "#0F62FE", width: `${timerPercent}%`, transition: "width 1s linear, background 0.5s ease" }} />
          </div>
          <span style={{ color: timeLeft <= 5 ? "#ef4444" : "white", fontSize: 28, fontWeight: 900, fontVariantNumeric: "tabular-nums", minWidth: 52, textAlign: "right" }}>
            {timeLeft}s
          </span>
        </div>

        {/* Question */}
        <div style={{ padding: "40px 48px 32px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1.3, maxWidth: 720, margin: 0 }}>
            {currentQ.question_text}
          </h2>

          {/* Options grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720, width: "100%" }}>
            {currentQ.options.map((opt, i) => {
              const colors = ["rgba(123,47,190,0.3)", "rgba(5,150,105,0.3)", "rgba(232,93,74,0.3)", "rgba(245,166,35,0.3)"]
              const borders = ["rgba(123,47,190,0.6)", "rgba(5,150,105,0.6)", "rgba(232,93,74,0.6)", "rgba(245,166,35,0.6)"]
              const answeredThisOption = answers.filter(a => a.selected_option_id === opt.id).length
              return (
                <div key={opt.id} style={{ background: colors[i % 4], border: `2px solid ${borders[i % 4]}`, borderRadius: 16, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 20, color: "white" }}>{["▲", "◆", "●", "■"][i % 4]}</span>
                  <span style={{ flex: 1, color: "white", fontWeight: 700, fontSize: 16 }}>{opt.text}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 800, fontSize: 18 }}>{answeredThisOption}</span>
                </div>
              )
            })}
          </div>

          {/* Answer progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: "white" }}>{answeredCount}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>respuestas</div>
            </div>
            <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: "white" }}>{active.length}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>jugadores</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={handleFinish} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>
            Terminar quiz
          </button>
          <button onClick={handleShowResults} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,86,231,0.35)" }}>
            Ver respuestas →
          </button>
        </div>
      </div>
    )
  }

  // ── SHOWING RESULTS / LEADERBOARD ──
  if (hostStatus === "showing_results" || hostStatus === "leaderboard") {
    const correctId = currentQ?.options.find(o => o.isCorrect)?.id
    const top5 = participants.slice(0, 5)

    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "32px 48px", flex: 1, overflowY: "auto" }}>
          <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>
            🏆 Leaderboard — Pregunta {currentQIndex + 1}
          </h2>

          {/* Answer breakdown */}
          {currentQ && (
            <div style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 600, margin: "0 auto 32px" }}>
              {currentQ.options.map((opt, i) => {
                const count = answers.filter(a => a.selected_option_id === opt.id).length
                const isCorrect = opt.id === correctId
                const colors = ["rgba(123,47,190,0.3)", "rgba(5,150,105,0.3)", "rgba(232,93,74,0.3)", "rgba(245,166,35,0.3)"]
                return (
                  <div key={opt.id} style={{ background: isCorrect ? "rgba(16,185,129,0.15)" : colors[i % 4], border: `2px solid ${isCorrect ? "rgba(16,185,129,0.5)" : "transparent"}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: isCorrect ? "#34d399" : "rgba(255,255,255,0.7)", fontSize: 18 }}>
                      {isCorrect ? "✅" : ["▲", "◆", "●", "■"][i % 4]}
                    </span>
                    <span style={{ flex: 1, color: "white", fontSize: 14, fontWeight: 600 }}>{opt.text}</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 800 }}>{count}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Top players */}
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            {top5.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, marginBottom: 10, background: i === 0 ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.07)"}` }}>
                <div style={{ fontSize: 24 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</div>
                <div style={{ fontSize: 24 }}>{p.avatar?.emoji || "🎮"}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>{p.nickname}</p>
                  {p.current_streak >= 3 && <span style={{ color: "#f87171", fontSize: 12 }}>🔥 ×{p.current_streak} en racha</span>}
                </div>
                <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 18 }}>{p.total_score.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={handleFinish} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>
            Terminar quiz
          </button>
          <button onClick={handleNextQuestion} style={{ padding: "12px 28px", background: currentQIndex + 1 >= questions.length ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,86,231,0.35)" }}>
            {currentQIndex + 1 >= questions.length ? "🏁 Ver resultado final" : "Siguiente pregunta →"}
          </button>
        </div>
      </div>
    )
  }

  // ── FINISHED ──
  if (hostStatus === "finished") {
    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <h1 style={{ color: "white", fontSize: 36, fontWeight: 900, marginBottom: 8 }}>🏁 ¡Quiz terminado!</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>Resultados finales</p>
        <div style={{ width: "100%", maxWidth: 480, marginBottom: 40 }}>
          {participants.slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, marginBottom: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontSize: 24 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</span>
              <span style={{ fontSize: 24 }}>{p.avatar?.emoji || "🎮"}</span>
              <span style={{ flex: 1, color: "white", fontWeight: 700 }}>{p.nickname}</span>
              <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 18 }}>{p.total_score.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setHostStatus("setup")} style={{ padding: "14px 28px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, color: "white", fontWeight: 600, cursor: "pointer" }}>
            Nuevo quiz
          </button>
          <button onClick={() => router.push("/dashboard")} style={{ padding: "14px 28px", background: "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 14, color: "white", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,86,231,0.35)" }}>
            Ir al dashboard →
          </button>
        </div>
      </div>
    )
  }

  return null
}
