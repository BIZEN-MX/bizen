"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"
import { diagnosticQuiz, type QuizOption, type QuizQuestion } from "@/components/diagnostic/quizData"
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

      setTimeout(() => {
        router.push("/")
      }, 4000)
    }
  }, [quizIncomplete, router, userInfo, userAnswers])

  const handleStartQuiz = async () => {
    if (!tempUserInfo.email || !tempUserInfo.fullName || !tempUserInfo.institution) {
      setUserInfoError("Por favor completa todos los campos.")
      return
    }
    if (!tempUserInfo.email.includes("@")) {
      setUserInfoError("Por favor ingresa un correo válido.")
      return
    }

    const emailLower = tempUserInfo.email.toLowerCase()
    const domain = emailLower.split('@')[1] || ""
    const isInstitutional = domain.endsWith('.edu') || domain.includes('.edu.')

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
              style={{ width: "auto", minWidth: "140px" }}
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
              style={{ width: "auto", minWidth: "200px" }}
            >
              Siguiente
            </StickyFooterButton>
          ) : (
            <StickyFooterButton
              variant="blue"
              onClick={handleQuizSubmit}
              disabled={quizIncomplete || quizSubmitted}
              style={{ width: "auto", minWidth: "200px" }}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#FFFFFF",
              borderRadius: "32px",
              border: "2px solid #E5E7EB",
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
              maxWidth: "560px",
              margin: "60px auto"
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#111827", marginBottom: "16px", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>¡Excelente trabajo!</h2>
            <p style={{ fontSize: "17px", color: "#6B7280", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>Tu examen diagnóstico ha sido enviado con éxito. Valoramos mucho tu participación.</p>
            <div style={{ marginTop: "32px", fontSize: "14px", color: "#9CA3AF", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Redirigiendo de vuelta a BIZEN...</div>
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
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                color: "#111827",
                margin: 0,
                lineHeight: 1.3,
                fontFamily: "'Inter', sans-serif",
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
                    }}
                    onMouseEnter={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(-1px)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                    onMouseDown={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(2px)"
                        e.currentTarget.style.boxShadow = "0 0px 0 0 #E5E7EB"
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = boxShadow
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
                      fontWeight: 900,
                      color: labelColor,
                      flexShrink: 0,
                      fontFamily: "'Inter', sans-serif",
                      border: `1.5px solid ${borderColor}`,
                      transition: "all 0.2s ease",
                    }}>
                      {option.value}
                    </div>
                    <span style={{
                      flex: 1,
                      fontSize: "clamp(15px, 1.8vw, 18px)",
                      fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.4,
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
