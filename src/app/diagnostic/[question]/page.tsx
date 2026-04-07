"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"
import { diagnosticQuiz, type QuizOption, type QuizQuestion } from "@/components/diagnostic/quizData"
import { isInstitutionalEmail } from "@/lib/emailValidation"
import { ExamIntro, type UserInfo } from "@/components/diagnostic/ExamIntro"
import {
  LessonScreen,
  LessonProgressHeader,
  StickyFooter,
  StickyFooterButton,
  CONTENT_MAX_WIDTH,
  CONTENT_PADDING_X,
  CONTENT_PADDING_Y,
  CONTENT_GAP,
} from "@/components/lessons"

type StoredQuizState = {
  quizSubmitted: boolean
  userAnswers: Record<string, QuizOption["value"] | undefined>
  userInfo?: UserInfo
}

const STORAGE_KEY = "bizen_diagnostic_quiz_v1"



function readStoredQuizState(): StoredQuizState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredQuizState
    if (!parsed || typeof parsed !== "object") return null

    return {
      quizSubmitted: Boolean(parsed.quizSubmitted),
      userAnswers: parsed.userAnswers ?? {},
      userInfo: parsed.userInfo,
    }
  } catch {
    return null
  }
}

import { ExerciseInstruction } from "@/components/lessons/steps/ExerciseInstruction"
import { motion, AnimatePresence } from "framer-motion"

export default function DiagnosticQuestionPage() {
  const router = useRouter()
  const params = useParams()

  const [userAnswers, setUserAnswers] = React.useState<Record<string, QuizOption["value"] | undefined>>({})
  const [quizSubmitted, setQuizSubmitted] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [analysisPhase, setAnalysisPhase] = React.useState(0) // 0=scanning, 1=found, 2=redirect
  const [countdown, setCountdown] = React.useState(5)
  const [userInfo, setUserInfo] = React.useState<UserInfo | undefined>(undefined)
  const [tempUserInfo, setTempUserInfo] = React.useState<UserInfo>({ email: "", fullName: "", institution: "" })
  const [userInfoError, setUserInfoError] = React.useState("")
  const [isStorageReady, setIsStorageReady] = React.useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = React.useState(false)

  const totalQuestions = diagnosticQuiz.length
  const questionParam = Array.isArray(params.question) ? params.question[0] : params.question
  const rawPage = Number(questionParam ?? "1")
  const currentPage = Number.isFinite(rawPage)
    ? Math.min(Math.max(Math.floor(rawPage), 1), totalQuestions)
    : 1
  const currentQuestion = diagnosticQuiz[currentPage - 1]

  React.useEffect(() => {
    const stored = readStoredQuizState()
    if (stored) {
      setUserAnswers(stored.userAnswers)
      setQuizSubmitted(stored.quizSubmitted)
      if (stored.quizSubmitted) {
        setShowSuccess(true)
        setAnalysisPhase(2)
      }
      if (stored.userInfo) {
        setTempUserInfo(stored.userInfo)
        setUserInfo(stored.userInfo)
      }
    }
    setIsStorageReady(true)
  }, [])

  React.useEffect(() => {
    if (!isStorageReady) return
    try {
      const state: StoredQuizState = { userAnswers, quizSubmitted, userInfo }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
  }, [isStorageReady, userAnswers, quizSubmitted, userInfo])

  React.useEffect(() => {
    if (!Number.isFinite(rawPage) || rawPage < 1 || rawPage > totalQuestions) {
      router.replace("/diagnostic/1", { scroll: false })
    }
  }, [rawPage, totalQuestions, router])

  const answeredCount = React.useMemo(
    () => diagnosticQuiz.reduce((sum, question) => sum + (userAnswers[question.id] ? 1 : 0), 0),
    [userAnswers]
  )

  const quizIncomplete = answeredCount !== totalQuestions

  const goToPage = React.useCallback(
    (page: number) => {
      const target = Math.min(Math.max(page, 1), totalQuestions)
      router.push(`/diagnostic/${target}`, { scroll: false })
    },
    [router, totalQuestions]
  )

  const handleQuizAnswer = React.useCallback((questionId: string, value: QuizOption["value"]) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const handleQuizSubmit = React.useCallback(async () => {
    if (!quizIncomplete && userInfo) {
      setQuizSubmitted(true)
      setShowSuccess(true)
      setAnalysisPhase(0)

      try {
        await fetch("/api/diagnostic-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userInfo.email,
            fullName: userInfo.fullName,
            institution: userInfo.institution,
            userAnswers
          }),
        })
      } catch (error) {
        console.error("Failed to save diagnostic results:", error)
      }

      // Phase 1: scanning animation (2.5s)
      setTimeout(() => setAnalysisPhase(1), 2500)

      // Phase 2: countdown to dashboard
      setTimeout(() => {
        setAnalysisPhase(2)
      }, 4500)
    }
  }, [quizIncomplete, router, userInfo, userAnswers])

  // New effect to handle the countdown and automatic redirection
  React.useEffect(() => {
    if (analysisPhase === 2) {
      setCountdown(5)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            router.push("/dashboard")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [analysisPhase, router])

  const handleStartQuiz = async () => {
    if (!tempUserInfo.email || !tempUserInfo.fullName || !tempUserInfo.institution) {
      setUserInfoError("Por favor completa todos los campos.")
      return
    }
    if (!tempUserInfo.email.includes("@")) {
      setUserInfoError("Por favor ingresa un correo válido.")
      return
    }


    setIsCheckingEmail(true)
    try {
      const res = await fetch(`/api/diagnostic-quiz?email=${encodeURIComponent(tempUserInfo.email)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.exists) {
          setUserInfoError("Ya has respondido este examen.")
          setIsCheckingEmail(false)
          return
        }
      }
    } catch (e) {
      console.error("Error checking email:", e)
    } finally {
      setIsCheckingEmail(false)
    }

    if (quizSubmitted) {
      setUserAnswers({})
      setQuizSubmitted(false)
    }

    setUserInfo(tempUserInfo)
    setUserInfoError("")
  }

  if (!isStorageReady) return null

  const isFirstPage = currentPage === 1

  // Footer is only shown during the quiz, not on the intro screen
  const quizFooter = userInfo && !showSuccess ? (
    <div style={{
      display: "flex",
      padding: "16px 24px",
      paddingBottom: "max(24px, env(safe-area-inset-bottom))",
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      zIndex: 10,
    }}>
      <div style={{ width: "100%", maxWidth: "896px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div>
          {!isFirstPage && (
            <StickyFooterButton
              variant="secondary"
              onClick={() => goToPage(currentPage - 1)}
              style={{ width: "auto", minWidth: "clamp(80px, 20vw, 140px)", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Anterior
            </StickyFooterButton>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {currentPage < totalQuestions ? (
            <StickyFooterButton
              variant="blue"
              onClick={() => goToPage(currentPage + 1)}
              disabled={userAnswers[currentQuestion.id] === undefined}
              style={{ width: "auto", minWidth: "clamp(120px, 35vw, 200px)" }}
            >
              Siguiente
            </StickyFooterButton>
          ) : (
            <StickyFooterButton
              variant="blue"
              onClick={handleQuizSubmit}
              disabled={quizIncomplete || quizSubmitted}
              style={{ width: "auto", minWidth: "clamp(120px, 35vw, 200px)" }}
            >
              {quizSubmitted ? "Enviado" : "Finalizar examen"}
            </StickyFooterButton>
          )}
        </div>
      </div>
    </div>
  ) : null

  return (
    <LessonScreen
      currentStep={userInfo ? currentPage : 0}
      totalSteps={totalQuestions}
      showProgressBar={!!userInfo && !showSuccess}
      hideStars={true}
      hideHeaderBorder={true}
      footerContent={quizFooter}
      isDark={true}
    >
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #050b14 0%, #0a192f 40%, #173d7a 100%)",
              overflow: "hidden",
              padding: "24px",
            }}
          >
            <style>{`
              @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.15)} }
              @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,15px) scale(1.1)} }
              @keyframes scanLine { 0%{top:0%;opacity:1} 100%{top:100%;opacity:0} }
              @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
              @keyframes float-particle { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-120px) rotate(720deg);opacity:0} }
              @keyframes shimmer-text { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
              @keyframes sparkle-twinkle { 0%,100%{opacity:0.3;scale:0.8} 50%{opacity:1;scale:1.2} }
            `}</style>

            {/* Immersive Background Elements */}
            <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,134,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,134,255,0.05) 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.4 }} />
            <div style={{ position:"absolute",top:"-10%",right:"-5%",width:"60vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)",animation:"orb1 10s ease-in-out infinite",pointerEvents:"none" }} />
            <div style={{ position:"absolute",bottom:"-15%",left:"-5%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.15) 0%,transparent 70%)",animation:"orb2 12s ease-in-out infinite",pointerEvents:"none" }} />

            {/* Random Sparkles */}
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: "3px",
                height: "3px",
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 0 8px #fff",
                animation: `sparkle-twinkle ${3 + i % 4}s infinite ease-in-out`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.6
              }} />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
                position: "relative",
                zIndex: 10,
              }}
            >
              {/* Glass Card */}
              <div style={{
                background: "rgba(10, 25, 47, 0.4)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                borderRadius: "40px",
                padding: "clamp(48px, 8vw, 72px) clamp(32px, 6vw, 48px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 48px 96px -24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Scan line (only on phase 0) */}
                {analysisPhase === 0 && (
                  <div style={{ position:"absolute",left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.9),rgba(59,130,246,1),transparent)",animation:"scanLine 2s linear infinite",zIndex:5,pointerEvents:"none" }} />
                )}

                {/* Floating particles (phase 1+) */}
                {analysisPhase >= 1 && [0,1,2,3,4,5,6,7].map(i => (
                  <div key={i} style={{
                    position:"absolute",
                    left:`${10+i*11}%`,
                    bottom:"-20px",
                    width:8,height:8,
                    borderRadius:"50%",
                    background: i%2===0 ? "#60a5fa" : "#a78bfa",
                    animation:`float-particle ${1.5+i*0.4}s ease-out ${i*0.2}s forwards`,
                    pointerEvents:"none"
                  }} />
                ))}

                <div style={{ position: "relative", zIndex: 2 }}>
                  {/* Phase 0: Scanning */}
                  {analysisPhase === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                      <div style={{ marginBottom: 36 }}>
                        {/* ADN helix icon environment */}
                        <div style={{ position:"relative", width:120, height:120, margin:"0 auto" }}>
                          <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(59,130,246,0.3)",animation:"pulse-ring 1.8s ease-out infinite" }} />
                          <div style={{ position:"absolute",inset:12,borderRadius:"50%",border:"2px solid rgba(59,130,246,0.5)",animation:"pulse-ring 1.8s ease-out 0.6s infinite" }} />
                          <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                            <div style={{ width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#0F62FE,#4A9EFF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow: "0 0 40px rgba(15,98,254,0.6)", border: "1px solid rgba(255,255,255,0.2)" }}>
                              <span style={{ fontSize:32 }}>🧬</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ fontSize:13,fontWeight:800,color:"rgba(96,165,250,0.8)",letterSpacing:".3em",textTransform:"uppercase",marginBottom:16 }}>
                        Billy está analizando...
                      </div>
                      <h2 style={{ fontSize:"clamp(28px,6vw,44px)",fontWeight:900,color:"#fff",letterSpacing:"-0.03em",lineHeight:1.1, margin: 0 }}>
                        Calculando tu
                        <br/>
                        <span style={{
                          background:"linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6, #60a5fa)",
                          backgroundSize:"200% auto",
                          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                          animation:"shimmer-text 3s linear infinite",
                        }}>ADN Financiero</span>
                      </h2>

                      {/* Cosmic progress bar */}
                      <div style={{ marginTop:48,height:6,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <motion.div
                          initial={{ width:"0%" }}
                          animate={{ width:"100%" }}
                          transition={{ duration:2.3, ease:"easeInOut" }}
                          style={{ height:"100%",background:"linear-gradient(90deg,#0F62FE,#4A9EFF,#a78bfa)",borderRadius:99 }}
                        />
                      </div>
                      <div style={{ marginTop:14,fontSize:14,color:"rgba(255,255,255,0.4)",fontWeight:600 }}>Decodificando patrones de comportamiento...</div>
                    </motion.div>
                  )}

                  {/* Phase 1+: Result teaser */}
                  {analysisPhase >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Big crystal icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type:"spring", stiffness:200, damping:15, delay:0.2 }}
                        style={{ width:100,height:100,borderRadius:"50%",background:"linear-gradient(135deg,#0F62FE,#4A9EFF)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(15,98,254,0.5)", border: "2px solid rgba(255,255,255,0.2)" }}
                      >
                        <span style={{ fontSize: 44 }}>🔮</span>
                      </motion.div>

                      <div style={{ fontSize:13,fontWeight:800,color:"rgba(96,165,250,0.9)",letterSpacing:".3em",textTransform:"uppercase",marginBottom:12 }}>
                        Análisis completo
                      </div>

                      <h2 style={{ fontSize:"clamp(28px,6vw,44px)",fontWeight:900,color:"#fff",margin:"0 0 20px",letterSpacing:"-0.03em",lineHeight:1.1 }}>
                        Billy encontró
                        <br/>
                        <span style={{ background:"linear-gradient(90deg,#60a5fa,#c4b5fd,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
                          tu ADN Financiero
                        </span>
                      </h2>

                      <p style={{ fontSize:"clamp(15px,2vw,18px)",color:"rgba(255,255,255,0.5)",lineHeight:1.8,margin:"0 0 40px",maxWidth:440,marginLeft:"auto",marginRight:"auto", fontWeight: 500 }}>
                        Tu perfil único está listo. Descúbrelo en tu Dashboard junto a la hoja de ruta que Billy ha forjado <em>solo para ti</em>.
                      </p>

                      {/* Mystery profile card */}
                      <div style={{
                        background:"rgba(255,255,255,0.03)",
                        border:"1px solid rgba(255,255,255,0.1)",
                        borderRadius:24,
                        padding:"20px 28px",
                        marginBottom:40,
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        gap:20,
                        backdropFilter: "blur(10px)",
                      }}>
                        <div style={{ fontSize:36 }}>🧬</div>
                        <div style={{ textAlign:"left" as const }}>
                          <div style={{ fontSize:12,fontWeight:700,color:"rgba(96,165,250,0.6)",textTransform:"uppercase",letterSpacing:".15em" }}>TU FIRMA BIOMÉTRICA</div>
                          <div style={{ fontSize:20,fontWeight:900,color:"rgba(255,255,255,0.15)",letterSpacing:3,filter:"blur(6px)" }}>●●● ●●●●●●●●</div>
                        </div>
                      </div>

                      {analysisPhase === 2 && (
                        <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} transition={{ duration:0.5 }}>
                          <button
                            onClick={() => router.push("/dashboard?showEvolution=true")}
                            style={{
                              padding:"18px 48px",
                              background:"linear-gradient(135deg,#0F62FE,#4A9EFF)",
                              color:"white",
                              border:"none",
                              borderRadius:"18px",
                              fontSize:"clamp(16px,2vw,18px)",
                              fontWeight:800,
                              cursor:"pointer",
                              boxShadow:"0 16px 40px rgba(15,98,254,0.45)",
                              width:"100%",
                              display:"flex",
                              alignItems:"center",
                              justifyContent:"center",
                              gap:12,
                              fontFamily:"inherit",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.02) translateY(-2px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(15,98,254,0.6)"; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,98,254,0.45)"; }}
                          >
                            REVELAR MI ADN → <span style={{ opacity:0.7, fontWeight: 500 }}>({countdown})</span>
                          </button>
                          <div style={{ marginTop:16, fontSize:14,color:"rgba(255,255,255,0.3)",fontWeight:600 }}>Entrando a la plataforma...</div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : !userInfo ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <ExamIntro
              userInfo={tempUserInfo}
              onChange={setTempUserInfo}
              error={userInfoError}
              onSubmit={handleStartQuiz}
              isLoading={isCheckingEmail}
            />
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 28
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ExerciseInstruction type="mcq" isDark={true} />
              <h3 style={{
                fontSize: "clamp(19px, 5vw, 26px)",
                fontWeight: 600,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.35,
                textAlign: "left",
              }}>
                {currentQuestion.question}
              </h3>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%"
            }}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = userAnswers[currentQuestion.id] === option.value

                // Determine visual state for Premium Spatial Blue
                let borderColor = isSelected ? "#3b82f6" : "rgba(255,255,255,0.15)"
                let background = isSelected ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)"
                let color = isSelected ? "#ffffff" : "rgba(255,255,255,0.85)"
                let boxShadow = isSelected ? "0 0 0 2px rgba(59,130,246,0.3)" : "none"
                let labelBg = isSelected ? "#2563eb" : "rgba(255,255,255,0.1)"
                let labelColor = isSelected ? "#ffffff" : "rgba(255,255,255,0.6)"

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !quizSubmitted && handleQuizAnswer(currentQuestion.id, option.value)}
                    disabled={quizSubmitted}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      width: "100%",
                      padding: "16px 20px",
                      borderRadius: 16,
                      background,
                      border: `1.5px solid ${borderColor}`,
                      boxShadow,
                      cursor: quizSubmitted ? "not-allowed" : "pointer",
                      textAlign: "left",
                      color,
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      userSelect: "none",
                      outline: "none",
                      transform: "translateY(0)",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.backgroundColor = isSelected ? background : "rgba(255,255,255,0.06)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.backgroundColor = background
                    }}
                    onMouseDown={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(2px)"
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(0)"
                      }
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: labelBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: labelColor,
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}>
                      {option.value}
                    </div>
                    <span style={{
                      flex: 1,
                      fontSize: "clamp(15px, 1.8vw, 18px)",
                      fontWeight: 500,
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                      overflowWrap: "anywhere"
                    }}>
                      {option.text}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LessonScreen>
  )
}
