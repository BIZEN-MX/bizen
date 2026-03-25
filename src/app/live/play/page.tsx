"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { IconBolt, IconCheck, IconX, IconFire, IconTrophy, IconMedal1, IconMedal2, IconMedal3, IconGamepad, IconXP, IconStar, IconFlag } from "@/components/live/LiveIcons"
import { AvatarSvg } from "@/components/live/LiveAvatars"
import { Volume2, VolumeX } from "lucide-react"
import { useLiveAudio } from "@/hooks/useLiveAudio"

type GameStatus = "loading" | "lobby" | "in_question" | "showing_results" | "leaderboard" | "finished"

interface Question {
  id: string
  order_index: number
  question_text: string
  question_type: string
  options: Array<{ id: string; text: string; isCorrect?: boolean }>
  time_limit: number
  points_base: number
  image_url?: string
}

interface LeaderEntry {
  rank: number
  nickname: string
  avatar: { emoji?: string }
  score: number
  streak: number
}

const ANSWER_SHAPES = ["▲", "◆", "●", "■"]
const ANSWER_COLORS = [
  { bg: "linear-gradient(135deg, #7B2FBE, #9B59E8)", shadow: "rgba(123,47,190,0.5)" },
  { bg: "linear-gradient(135deg, #047857, #059669)", shadow: "rgba(5,150,105,0.5)" },
  { bg: "linear-gradient(135deg, #be3030, #E85D4A)", shadow: "rgba(232,93,74,0.5)" },
  { bg: "linear-gradient(135deg, #D97706, #F5A623)", shadow: "rgba(245,166,35,0.5)" },
]

function PlayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")
  const supabase = createClient()

  // Player state (from sessionStorage)
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [nickname, setNickname] = useState("Jugador")
  const [emoji, setEmoji] = useState("fox")

  const [isMobile, setIsMobile] = useState(false)

  // Detect Mobile for offset
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sidebarOffset = isMobile ? 0 : 280

  // Session state (from Supabase Realtime)
  const [gameStatus, setGameStatus] = useState<GameStatus>("loading")
  const [sessionTitle, setSessionTitle] = useState("Quiz en vivo")
  const [participants, setParticipants] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])

  // Player answer state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; scoreEarned: number; newTotal: number; newStreak: number; correctOptionId: string | null } | null>(null)
  const [myScore, setMyScore] = useState(0)
  const [myStreak, setMyStreak] = useState(0)
  const [myRank, setMyRank] = useState<number | null>(null)
  // XP
  const [xpEarned, setXpEarned] = useState(0)
  const [xpGranted, setXpGranted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // 🔊 Audio Feedback
  const { playFeedback } = useLiveAudio(gameStatus, false && !isMuted)

  // Play sound when result is received
  useEffect(() => {
    if (answerResult && !isMuted) {
      playFeedback(answerResult.isCorrect)
    }
  }, [answerResult, isMuted])

  // Grant XP when quiz finishes (must be at top level, not inside if block)
  useEffect(() => {
    if (gameStatus !== "finished" || xpGranted || !participantId || myScore === 0) return
    setXpGranted(true)
    const xp = Math.min(500, Math.max(50, Math.floor(myScore / 10)))
    setXpEarned(xp)
    supabase.rpc("increment_user_xp", { user_xp: xp })
  }, [gameStatus])

  // Timer
  const [timeLeft, setTimeLeft] = useState(20)
  const [timeLimitForQuestion, setTimeLimitForQuestion] = useState(20)
  const answerStartTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])

  // ── Load player info from sessionStorage ──
  useEffect(() => {
    const pid = sessionStorage.getItem("live_participant_id")
    const nick = sessionStorage.getItem("live_nickname")
    const em = sessionStorage.getItem("live_emoji")
    if (!pid || !sessionId) {
      router.replace("/live/join")
      return
    }
    setParticipantId(pid)
    if (nick) setNickname(nick)
    if (em) setEmoji(em)
  }, [sessionId, router])

  // ── Load initial session data ──
  useEffect(() => {
    if (!sessionId) return

    const loadSession = async () => {
      const { data, error } = await supabase
        .from("live_sessions")
        .select(`
          *,
          live_questions(id, order_index, question_text, question_type, options, time_limit, points_base, image_url),
          live_participants(id, user_id, nickname, avatar, total_score, current_streak, rank, is_host, is_active)
        `)
        .eq("id", sessionId)
        .single()

      if (error || !data) { router.replace("/live/join"); return }

      setSessionTitle(data.title)
      const qs: Question[] = (data.live_questions || []).sort((a: any, b: any) => a.order_index - b.order_index)
      setAllQuestions(qs)
      setTotalQuestions(qs.length)
      setParticipants(data.live_participants || [])
      setGameStatus(data.status as GameStatus)
      setQuestionIndex(data.current_question_index || 0)

      if (data.status === "in_question" && qs[data.current_question_index]) {
        const q = qs[data.current_question_index]
        setCurrentQuestion(q)
        setTimeLimitForQuestion(q.time_limit)
        // Calculate remaining time based on question_started_at
        if (data.question_started_at) {
          const elapsed = Math.floor((Date.now() - new Date(data.question_started_at).getTime()) / 1000)
          const remaining = Math.max(0, q.time_limit - elapsed)
          setTimeLeft(remaining)
        }
      }
    }

    loadSession()
  }, [sessionId, supabase, router])

  // ── Find my participant score ──
  useEffect(() => {
    const me = participants.find(p => p.id === participantId)
    if (me) {
      setMyScore(me.total_score || 0)
      setMyStreak(me.current_streak || 0)
      const ranked = [...participants]
        .filter(p => !p.is_host && p.is_active)
        .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
      const myRankIdx = ranked.findIndex(p => p.id === participantId)
      setMyRank(myRankIdx >= 0 ? myRankIdx + 1 : null)
    }
  }, [participants, participantId])

  // ── Supabase Realtime subscription ──
  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel(`live_session_${sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "live_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          const updated = payload.new as any
          const newStatus = updated.status as GameStatus
          setGameStatus(newStatus)
          setQuestionIndex(updated.current_question_index || 0)

          if (newStatus === "in_question") {
            const q = allQuestions[updated.current_question_index || 0]
            if (q) {
              setCurrentQuestion(q)
              setTimeLimitForQuestion(q.time_limit)
              setTimeLeft(q.time_limit)
              setSelectedOptionId(null)
              setHasAnswered(false)
              setAnswerResult(null)
              answerStartTimeRef.current = Date.now()
            }
          }
          if (newStatus === "leaderboard" || newStatus === "showing_results") {
            loadLeaderboard()
          }
          if (newStatus === "finished") {
            if (timerRef.current) clearInterval(timerRef.current)
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_participants", filter: `session_id=eq.${sessionId}` },
        () => {
          // Reload participants
          supabase
            .from("live_participants")
            .select("id, user_id, nickname, avatar, total_score, current_streak, rank, is_host, is_active")
            .eq("session_id", sessionId)
            .then(({ data }) => { if (data) setParticipants(data) })
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_leaderboard_snapshots", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const snap = payload.new as any
          if (snap.snapshot) setLeaderboard(snap.snapshot)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sessionId, supabase, allQuestions])

  // ── Timer countdown ──
  useEffect(() => {
    if (gameStatus !== "in_question" || hasAnswered) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          // Time's up — auto-submit with no answer
          if (!hasAnswered) submitAnswer(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [gameStatus, hasAnswered, currentQuestion])

  const loadLeaderboard = useCallback(async () => {
    if (!sessionId) return
    const { data } = await supabase
      .from("live_participants")
      .select("id, nickname, avatar, total_score, current_streak")
      .eq("session_id", sessionId)
      .eq("is_host", false)
      .eq("is_active", true)
      .order("total_score", { ascending: false })
      .limit(10)

    if (data) {
      const entries: LeaderEntry[] = data.map((p, i) => ({
        rank: i + 1,
        nickname: p.nickname,
        avatar: p.avatar || {},
        score: p.total_score || 0,
        streak: p.current_streak || 0,
      }))
      setLeaderboard(entries)
      const myIdx = data.findIndex(p => p.id === participantId)
      setMyRank(myIdx >= 0 ? myIdx + 1 : null)
    }
  }, [sessionId, supabase, participantId])

  const submitAnswer = useCallback(async (optionId: string | null) => {
    if (hasAnswered || !currentQuestion || !participantId || !sessionId) return
    setHasAnswered(true)
    if (timerRef.current) clearInterval(timerRef.current)
    if (optionId) setSelectedOptionId(optionId)

    const answerTimeMs = optionId ? Date.now() - answerStartTimeRef.current : (timeLimitForQuestion * 1000)

    try {
      const res = await fetch("/api/live/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: currentQuestion.id,
          participant_id: participantId,
          selected_option_id: optionId,
          answer_time_ms: answerTimeMs,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setAnswerResult({
          isCorrect: data.is_correct,
          scoreEarned: data.score_earned,
          newTotal: data.new_total,
          newStreak: data.new_streak,
          correctOptionId: data.correct_option_id,
        })
        setMyScore(data.new_total)
        setMyStreak(data.new_streak)
      }
    } catch (err) {
      console.error("Error submitting answer:", err)
    }
  }, [hasAnswered, currentQuestion, participantId, sessionId, timeLimitForQuestion])

  const handleOptionClick = (optionId: string) => {
    if (hasAnswered || gameStatus !== "in_question") return
    submitAnswer(optionId)
  }

  const timerPercent = (timeLeft / timeLimitForQuestion) * 100
  const timerColor = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#0F62FE"

  // ─────────────────────────────────────────────
  // RENDERS
  // ─────────────────────────────────────────────

  if (gameStatus === "loading") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060c1d", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><IconBolt size={40} color="#fbbf24" /></div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Conectando...</p>
        </div>
      </div>
    )
  }

  // ── LOBBY ──
  if (gameStatus === "lobby") {
    const activePlayers = participants.filter(p => !p.is_host && p.is_active)
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #08112a 0%, #0a1632 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 32px", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32, width: "100%", maxWidth: 400 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>PIN del quiz</p>
          <div style={{ fontSize: 52, fontWeight: 900, color: "white", letterSpacing: "0.12em", textShadow: "0 0 40px rgba(15,98,254,0.5)" }}>
            {sessionId ? "······" : "------"}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "8px 18px", borderRadius: 99, marginTop: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            <span style={{ color: "#34d399", fontSize: 13, fontWeight: 600 }}>Esperando que comience...</span>
          </div>
        </div>

        <div style={{ marginBottom: 16, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
          Jugadores conectados: <strong style={{ color: "#3B82F6" }}>{activePlayers.length}</strong>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 360, marginBottom: 32 }}>
          {activePlayers.map((p, i) => (
            <motion.div key={p.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05, type: "spring", stiffness: 400 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: p.id === participantId ? "rgba(15,98,254,0.2)" : "rgba(255,255,255,0.06)",
                border: `2px solid ${p.id === participantId ? "rgba(15,98,254,0.5)" : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <AvatarSvg id={p.avatar?.emoji || "fox"} size={32} />
              </div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", maxWidth: 60, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.id === participantId ? "Tú" : p.nickname}
              </span>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, width: "100%", maxWidth: 360 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: 16, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><IconStar size={16} color="#fbbf24" /> {sessionTitle}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{totalQuestions} preguntas</div>
        </div>
        <style>{`@keyframes pulse-dot { 0%,100% {opacity:1;transform:scale(1)} 50% {opacity:0.5;transform:scale(0.8)} }`}</style>
      </div>
    )
  }

  // ── IN QUESTION ──
  if (gameStatus === "in_question" && currentQuestion) {
    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", display: "flex", flexDirection: "column", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(180deg, rgba(15,98,254,0.1) 0%, transparent 100%)" }}>
          <div style={{ background: "rgba(255,255,255,0.08)", padding: "8px 14px", borderRadius: 99 }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Puntos: </span>
            <span style={{ color: "#fbbf24", fontSize: 16, fontWeight: 800 }}>{myScore.toLocaleString()}</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: 600 }}>
            {questionIndex + 1}/{totalQuestions}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: myStreak >= 3 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${myStreak >= 3 ? "rgba(239,68,68,0.3)" : "transparent"}`, padding: "8px 14px", borderRadius: 99 }}>
            <IconFire size={14} color={myStreak >= 3 ? "#f87171" : "rgba(255,255,255,0.4)"} />
            <span style={{ color: myStreak >= 3 ? "#f87171" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700 }}>×{myStreak}</span>
          </div>
          
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            style={{ 
              background: "rgba(255,255,255,0.06)", border: "none", 
              borderRadius: "50%", padding: "10px", color: "rgba(255,255,255,0.4)", 
              cursor: "pointer", display: "flex" 
            }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>

        {/* Circular timer */}
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 20px 12px" }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={timerColor}
                strokeWidth="6"
                strokeDasharray="201"
                strokeDashoffset={201 - (timerPercent / 100) * 201}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: timeLeft <= 5 ? "#ef4444" : "white", fontVariantNumeric: "tabular-nums" }}>
              {timeLeft}
            </div>
          </div>
        </div>

        {/* Question */}
        <div style={{ margin: "0 20px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "16px 20px", textAlign: "center" }}>
          {currentQuestion.image_url && (
            <div style={{ width: "100%", height: 160, borderRadius: 12, overflow: "hidden", marginBottom: 12, background: "rgba(0,0,0,0.2)" }}>
              <img src={currentQuestion.image_url} alt="Pregunta" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          )}
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Pregunta {questionIndex + 1}
          </p>
          <p style={{ color: "white", fontSize: 16, fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
            {currentQuestion.question_text}
          </p>
        </div>

        {/* Answer buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px", flex: 1, alignContent: "start" }}>
          {currentQuestion.options.map((opt, i) => {
            const color = ANSWER_COLORS[i % 4]
            const shape = ANSWER_SHAPES[i % 4]
            const isSelected = selectedOptionId === opt.id
            const showCorrect = hasAnswered && answerResult && opt.id === answerResult.correctOptionId
            const showWrong = hasAnswered && isSelected && !answerResult?.isCorrect
            let filterStyle = "none"
            if (hasAnswered && !isSelected && opt.id !== answerResult?.correctOptionId) filterStyle = "brightness(0.4) saturate(0)"

            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 400 }}
                onClick={() => handleOptionClick(opt.id)}
                disabled={hasAnswered}
                style={{
                  border: showCorrect ? "3px solid #34d399" : showWrong ? "3px solid #ef4444" : "2px solid transparent",
                  borderRadius: 20,
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  cursor: hasAnswered ? "default" : "pointer",
                  background: color.bg,
                  boxShadow: hasAnswered ? "none" : `0 6px 20px ${color.shadow}`,
                  minHeight: 110,
                  justifyContent: "center",
                  transform: hasAnswered && !isSelected && opt.id !== answerResult?.correctOptionId ? "scale(0.95)" : "scale(1)",
                  filter: filterStyle,
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
              >
                <span style={{ fontSize: 24, color: "white", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
                  {showCorrect ? <IconCheck size={24} /> : showWrong ? <IconX size={24} /> : shape}
                </span>
                <span style={{ color: "white", fontSize: 13, fontWeight: 700, textAlign: "center", lineHeight: 1.3, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                  {opt.text}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Answered banner */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                margin: "20px",
                padding: "16px",
                borderRadius: 16,
                background: answerResult?.isCorrect ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                border: `1px solid ${answerResult?.isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: 800, fontSize: 18, color: answerResult?.isCorrect ? "#34d399" : "#f87171", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {!selectedOptionId ? <><IconFire size={18} color="#f87171" /> Tiempo agotado</> : answerResult?.isCorrect ? <><IconCheck size={22} /> ¡Correcto! +{answerResult.scoreEarned} pts</> : <><IconX size={22} /> Incorrecto</>}
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
                Esperando al host para continuar...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ── LEADERBOARD / SHOWING RESULTS ──
  if (gameStatus === "leaderboard" || gameStatus === "showing_results") {
    const me = leaderboard.find((_, i) => participants.find(p => p.id === participantId && participants.filter(x => !x.is_host).sort((a, b) => b.total_score - a.total_score)[i]?.id === p.id))
    return (
      <div style={{ minHeight: "100dvh", background: "#060c1d", overflowY: "auto", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        {/* Result hero */}
        {answerResult && (
          <div style={{ padding: "40px 24px 24px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", background: `linear-gradient(180deg, ${answerResult.isCorrect ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.08)"} 0%, transparent 100%)` }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }} style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              {answerResult.isCorrect ? <IconCheck size={60} color="#34d399" /> : <IconX size={60} color="#f87171" />}
            </motion.div>
            <h2 style={{ color: answerResult.isCorrect ? "#34d399" : "#f87171", fontSize: 28, fontWeight: 900, margin: "0 0 12px" }}>
              {answerResult.isCorrect ? "¡Correcto!" : "Incorrecto"}
            </h2>
            {answerResult.isCorrect && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", padding: "10px 24px", borderRadius: 99 }}>
                <span style={{ color: "#10b981", fontSize: 22, fontWeight: 800 }}>+{answerResult.scoreEarned}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>pts {answerResult.newStreak >= 3 ? <><IconFire size={13} color="#f87171" /> Racha ×{answerResult.newStreak}</> : ""}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "24px" }}>
          {[
            { label: "Total", value: myScore.toLocaleString(), color: "#fbbf24" },
            { label: "Posición", value: myRank ? `${myRank}°` : "—", color: "white" },
            { label: "Racha", value: <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><IconFire size={14} color="#10b981" />×{myStreak}</span>, color: "#10b981" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 12px", textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: 20, fontWeight: 800, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={{ padding: "0 24px 40px" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Leaderboard</p>
          {leaderboard.slice(0, 8).map((entry, i) => {
            const isMe = myRank === entry.rank
            const rankColors = ["#fbbf24", "#9ca3af", "#d97706"]
            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 14, marginBottom: 8,
                  background: isMe ? "rgba(15,98,254,0.12)" : "rgba(255,255,255,0.03)",
                  border: isMe ? "1px solid rgba(15,98,254,0.25)" : "1px solid transparent",
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: i < 3 ? `rgba(${i === 0 ? "251,191,36" : i === 1 ? "156,163,175" : "180,83,9"},0.15)` : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i === 0 ? <IconMedal1 size={22} /> : i === 1 ? <IconMedal2 size={22} /> : i === 2 ? <IconMedal3 size={22} /> : <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)" }}>{entry.rank}</span>}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AvatarSvg id={entry.avatar?.emoji || "fox"} size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: 0 }}>{entry.nickname}</p>
                  {isMe && <span style={{ color: "#3B82F6", fontSize: 10, fontWeight: 500 }}>← Tú</span>}
                </div>
                <span style={{ color: "#fbbf24", fontSize: 14, fontWeight: 800 }}>{entry.score.toLocaleString()}</span>
              </motion.div>
            )
          })}
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13, padding: "0 24px 32px" }}>
          Esperando al host para la siguiente pregunta...
        </p>
      </div>
    )
  }

  if (gameStatus === "finished") {
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #060c1d 0%, #0a1428 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", marginLeft: sidebarOffset, transition: "margin-left 0.3s ease" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }} style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <IconTrophy size={80} color="#fbbf24" />
        </motion.div>
        <h1 style={{ color: "white", fontSize: 32, fontWeight: 900, marginBottom: 8 }}>¡Quiz terminado!</h1>
        <p style={{ color: "#fbbf24", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          Posición final: {myRank ? `${myRank}°` : "—"}
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: xpEarned > 0 ? 16 : 40 }}>
          Puntaje total: {myScore.toLocaleString()} pts
        </p>
        {xpEarned > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 99, padding: "12px 24px", marginBottom: 40 }}>
            <IconXP size={20} color="#a78bfa" />
            <span style={{ color: "#a78bfa", fontWeight: 800, fontSize: 18 }}>+{xpEarned} XP ganados</span>
          </motion.div>
        )}

        {/* Final leaderboard */}
        <div style={{ width: "100%", maxWidth: 360 }}>
          {leaderboard.slice(0, 5).map((entry, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, marginBottom: 8, background: myRank === entry.rank ? "rgba(15,98,254,0.15)" : "rgba(255,255,255,0.04)", border: myRank === entry.rank ? "1px solid rgba(15,98,254,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex" }}>{i === 0 ? <IconMedal1 size={28} /> : i === 1 ? <IconMedal2 size={28} /> : i === 2 ? <IconMedal3 size={28} /> : <span style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.3)", width: 28, textAlign: "center" }}>{i+1}</span>}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AvatarSvg id={entry.avatar?.emoji || "fox"} size={22} />
              </div>
              <span style={{ flex: 1, color: "white", fontWeight: 600 }}>{entry.nickname}</span>
              <span style={{ color: "#fbbf24", fontWeight: 800 }}>{entry.score.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          style={{ marginTop: 32, padding: "16px 32px", background: "linear-gradient(135deg, #0056E7, #1983FD)", border: "none", borderRadius: 16, color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,86,231,0.35)" }}
        >
          Ir al dashboard →
        </button>
      </div>
    )
  }

  return null
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060c1d" }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: 40, marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <IconBolt size={40} color="#fbbf24" />
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Cargando interfaz...</p>
        </div>
      </div>
    }>
      <PlayPageContent />
    </Suspense>
  )
}
