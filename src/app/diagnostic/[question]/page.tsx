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

    const isInstitutional = isInstitutionalEmail(tempUserInfo.email);
    if (!isInstitutional) {
      setUserInfoError("Solo se permiten correos institucionales (.edu) para realizar este examen.")
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
    <div className="flex p-4 md:p-6 pb-[max(24px,env(safe-area-inset-bottom))] bg-white border-t-2 border-slate-100">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-3 md:gap-4">
        <div>
          {!isFirstPage && (
            <StickyFooterButton
              variant="secondary"
              onClick={() => goToPage(currentPage - 1)}
              style={{ width: "auto", minWidth: "clamp(80px, 20vw, 140px)" }}
            >
              Anterior
            </StickyFooterButton>
          )}
        </div>

        <div className="flex-1 flex justify-end">
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
    >
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              position: "relative",
              textAlign: "center",
              maxWidth: "560px",
              margin: "40px auto",
              width: "100%",
              boxSizing: "border-box" as const,
              overflow: "hidden",
              borderRadius: "32px",
            }}
          >
            <style>{`
              @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.15)} }
              @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,15px) scale(1.1)} }
              @keyframes scanLine { 0%{top:0%;opacity:1} 100%{top:100%;opacity:0} }
              @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
              @keyframes float-particle { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-120px) rotate(720deg);opacity:0} }
              @keyframes shimmer-text { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
              @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>

            {/* Magical dark background card */}
            <div style={{
              background: "linear-gradient(145deg, #060c1f 0%, #0d1a3a 50%, #0a1628 100%)",
              borderRadius: "32px",
              padding: "clamp(40px, 6vw, 60px) clamp(28px, 5vw, 48px)",
              border: "1px solid rgba(99,102,241,0.25)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* BG Orbs */}
              <div style={{ position:"absolute",top:"-30%",left:"-20%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.35) 0%,transparent 70%)",animation:"orb1 6s ease-in-out infinite",pointerEvents:"none" }} />
              <div style={{ position:"absolute",bottom:"-20%",right:"-15%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.28) 0%,transparent 70%)",animation:"orb2 8s ease-in-out infinite",pointerEvents:"none" }} />

              {/* Scan line (only on phase 0) */}
              {analysisPhase === 0 && (
                <div style={{ position:"absolute",left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(167,139,250,0.9),transparent)",animation:"scanLine 2.2s linear infinite",zIndex:5,pointerEvents:"none" }} />
              )}

              {/* Floating particles (phase 1+) */}
              {analysisPhase >= 1 && [0,1,2,3,4,5].map(i => (
                <div key={i} style={{
                  position:"absolute",
                  left:`${15+i*14}%`,
                  bottom:"10%",
                  width:6,height:6,
                  borderRadius:"50%",
                  background: i%2===0 ? "#818cf8" : "#c4b5fd",
                  animation:`float-particle ${1.2+i*0.3}s ease-out ${i*0.15}s forwards`,
                  pointerEvents:"none"
                }} />
              ))}

              <div style={{ position: "relative", zIndex: 2 }}>
                {/* Phase 0: Scanning */}
                {analysisPhase === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <div style={{ marginBottom: 28 }}>
                      {/* DNA helix icon */}
                      <div style={{ position:"relative", width:100, height:100, margin:"0 auto" }}>
                        <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(99,102,241,0.3)",animation:"pulse-ring 1.5s ease-out infinite" }} />
                        <div style={{ position:"absolute",inset:8,borderRadius:"50%",border:"2px solid rgba(99,102,241,0.5)",animation:"pulse-ring 1.5s ease-out 0.4s infinite" }} />
                        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <div style={{ width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 30px rgba(99,102,241,0.6)" }}>
                            <span style={{ fontSize:28 }}>🧬</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize:11,fontWeight:800,color:"rgba(167,139,250,0.7)",letterSpacing:".2em",textTransform:"uppercase",marginBottom:12 }}>
                      Billy está analizando...
                    </div>
                    <div style={{ fontSize:"clamp(22px,4vw,30px)",fontWeight:800,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.2 }}>
                      Calculando tu
                    </div>
                    <div style={
                      {
                        fontSize:"clamp(26px,5vw,38px)",fontWeight:900,
                        background:"linear-gradient(90deg,#818cf8,#c4b5fd,#e879f9,#818cf8)",
                        backgroundSize:"200% auto",
                        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                        animation:"shimmer-text 2s linear infinite",
                        letterSpacing:"-0.03em",
                      }
                    }>ADN Financiero</div>

                    {/* Fake progress bar */}
                    <div style={{ marginTop:28,height:5,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden" }}>
                      <motion.div
                        initial={{ width:"0%" }}
                        animate={{ width:"100%" }}
                        transition={{ duration:2.3, ease:"easeInOut" }}
                        style={{ height:"100%",background:"linear-gradient(90deg,#4f46e5,#7c3aed,#c4b5fd)",borderRadius:99 }}
                      />
                    </div>
                    <div style={{ marginTop:10,fontSize:12,color:"rgba(255,255,255,0.3)",fontWeight:500 }}>Procesando respuestas...</div>
                  </motion.div>
                )}

                {/* Phase 1+: Result teaser */}
                {analysisPhase >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    {/* Big checkmark */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type:"spring", stiffness:260, damping:18, delay:0.1 }}
                      style={{ width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 60px rgba(99,102,241,0.5)" }}
                    >
                      <span style={{ fontSize: 40 }}>🔮</span>
                    </motion.div>

                    <div style={{ fontSize:11,fontWeight:800,color:"rgba(167,139,250,0.8)",letterSpacing:".2em",textTransform:"uppercase",marginBottom:10 }}>
                      Análisis completo
                    </div>

                    <h2 style={{ fontSize:"clamp(26px,5vw,36px)",fontWeight:900,color:"#fff",margin:"0 0 16px",letterSpacing:"-0.03em",lineHeight:1.15 }}>
                      Billy encontró
                      <br/>
                      <span style={{ background:"linear-gradient(90deg,#818cf8,#c4b5fd,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
                        tu ADN Financiero
                      </span>
                    </h2>

                    <p style={{ fontSize:"clamp(14px,2vw,16px)",color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:"0 0 28px",maxWidth:380,marginLeft:"auto",marginRight:"auto" }}>
                      Tu perfil está listo. Descúbrelo en tu Dashboard, junto con la ruta de aprendizaje que Billy ha preparado <em>solo para ti</em>.
                    </p>

                    {/* Mystery profile tease */}
                    <div style={{
                      background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(99,102,241,0.3)",
                      borderRadius:20,
                      padding:"18px 24px",
                      marginBottom:28,
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      gap:16
                    }}>
                      <div style={{ fontSize:32 }}>🧬</div>
                      <div style={{ textAlign:"left" as const }}>
                        <div style={{ fontSize:11,fontWeight:700,color:"rgba(167,139,250,0.6)",textTransform:"uppercase",letterSpacing:".1em" }}>Tu Perfil DNA</div>
                        <div style={{ fontSize:18,fontWeight:800,color:"rgba(255,255,255,0.2)",letterSpacing:2,filter:"blur(5px)" }}>??? ????????</div>
                      </div>
                    </div>

                    {analysisPhase === 2 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }}>
                        <button
                          onClick={() => router.push("/dashboard?showEvolution=true")}
                          style={{
                            padding:"14px 36px",
                            background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
                            color:"white",
                            border:"none",
                            borderRadius:"14px",
                            fontSize:"clamp(14px,2vw,16px)",
                            fontWeight:700,
                            cursor:"pointer",
                            boxShadow:"0 8px 32px rgba(79,70,229,0.45)",
                            width:"100%",
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            gap:8,
                            fontFamily:"inherit"
                          }}
                        >
                          Ver mi ADN → <span style={{ opacity:0.7 }}>({countdown})</span>
                        </button>
                        <div style={{ marginTop:12, fontSize:13,color:"rgba(255,255,255,0.25)",fontWeight:500 }}>Redirigiendo automáticamente...</div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
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
              <ExerciseInstruction type="mcq" />
              <h3 style={{
                fontSize: "clamp(19px, 5vw, 26px)",
                fontWeight: 500,
                color: "#111827",
                margin: 0,
                lineHeight: 1.25,
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

                // Determine visual state
                let borderColor = isSelected ? "#0F62FE" : "#E5E7EB"
                let background = isSelected ? "#EFF6FF" : "#FFFFFF"
                let color = isSelected ? "#1D4ED8" : "#374151"
                let boxShadow = isSelected ? "0 2px 0 0 #93C5FD" : "0 2px 0 0 #E5E7EB"
                let labelBg = isSelected ? "#DBEAFE" : "#F3F4F6"
                let labelColor = isSelected ? "#1D4ED8" : "#6B7280"

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
                      border: `2px solid ${borderColor}`,
                      boxShadow,
                      cursor: quizSubmitted ? "not-allowed" : "pointer",
                      textAlign: "left",
                      color,
                      transition: "all 0.2s ease",
                      userSelect: "none",
                      outline: "none",
                      transform: "translateY(0)",
                      opacity: 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(-1px)"
                        e.currentTarget.style.opacity = "0.72"
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.opacity = "1"
                    }}
                    onMouseDown={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(2px)"
                        e.currentTarget.style.boxShadow = "0 0px 0 0 #E5E7EB"
                        e.currentTarget.style.opacity = "0.55"
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = boxShadow
                        e.currentTarget.style.opacity = "1"
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
                      fontWeight: 500,
                      color: labelColor,
                      flexShrink: 0,
                      border: `1.5px solid ${borderColor}`,
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
