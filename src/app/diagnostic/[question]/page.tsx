"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"
import { diagnosticQuiz, type QuizOption, type QuizQuestion } from "@/components/diagnostic/quizData"
import { ExamIntro, type UserInfo } from "@/components/diagnostic/ExamIntro"
import {
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

function QuizQuestionCard({
  question,
  selectedValue,
  onSelect,
  showResults,
}: {
  question: QuizQuestion
  selectedValue?: QuizOption["value"]
  onSelect: (value: QuizOption["value"]) => void
  showResults: boolean
}) {
  const optionLabels = ["A", "B", "C", "D"]

  return (
    <div
      className="quiz-split-layout"
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "100%", // Truly full width
        height: "auto",
        minHeight: "60vh", // Use more vertical space
        gap: "0",
        background: "#fff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        margin: "0 auto"
      }}
    >
      {/* Left Column: Question Side */}
      <div
        className="quiz-col"
        style={{
          flex: "1",
          background: "#f8fafc",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRight: "1px solid #e2e8f0"
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              background: "#e0e7ff",
              borderRadius: "6px",
              fontSize: "10px",
              color: "#3730a3",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {question.label}
          </span>
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.3,
            margin: 0,
            letterSpacing: "-0.01em",
            maxWidth: "500px"
          }}
        >
          {question.question}
        </h2>

        <div style={{ marginTop: "20px", height: "3px", width: "32px", background: "#2563eb", borderRadius: "2px" }} />
      </div>

      {/* Right Column: Options Side */}
      <div
        className="quiz-col"
        style={{
          flex: "1",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "450px", margin: "0 auto" }}>
          {question.options.map((option, index) => {
            const isSelected = selectedValue === option.value
            let bgColor = isSelected ? "#eff6ff" : "#fff"
            let borderColor = isSelected ? "#2563eb" : "#e2e8f0"
            let textColor = "#1e293b"

            return (
              <button
                key={`${question.id}-${option.value}`}
                type="button"
                onClick={() => !showResults && onSelect(option.value)}
                disabled={showResults}
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: textColor,
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: "14px",
                  cursor: showResults ? "default" : "pointer",
                  fontFamily: "inherit",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  width: "100%",
                  outline: "none",
                  transform: isSelected ? "translateY(-2px)" : "none",
                  position: "relative",
                  zIndex: isSelected ? 2 : 1,
                  boxShadow: isSelected ? "0 8px 20px rgba(37, 99, 235, 0.15)" : "none"
                }}
              >
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  background: isSelected ? "#2563eb" : "#f8fafc",
                  color: isSelected ? "#fff" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 800,
                  flexShrink: 0,
                  border: isSelected ? "none" : "1px solid #e2e8f0",
                  pointerEvents: "none"
                }}>
                  {optionLabels[index]}
                </span>
                <span style={{ flex: 1, lineHeight: 1.3, pointerEvents: "none" }}>{option.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          .quiz-split-layout {
            flex-direction: column !important;
            height: auto !important;
            min-height: 0 !important;
          }
          .quiz-col {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}

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
      // We don't set active userInfo here anymore so it always shows ExamIntro first
      if (stored.userInfo) {
        setTempUserInfo(stored.userInfo)
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

      // Redirect after showing success message for 3 seconds
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

    // Check if this email already submitted
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

    // If starting fresh or with a different user, we might want to reset answers
    // For now, let's keep them if they were partially filled, but reset if it was already submitted
    if (quizSubmitted) {
      setUserAnswers({})
      setQuizSubmitted(false)
    }

    setUserInfo(tempUserInfo)
    setUserInfoError("")
  }

  if (!isStorageReady) return null

  return (
    <div
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#f1f5f9",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Progress Header */}
      <div
        style={{
          flexShrink: 0,
          minHeight: 80,
          padding: "12px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f1f5f9",
          borderBottom: "2px solid #cbd5e1",
          boxSizing: "border-box",
        }}
      >
        <div style={{ height: "40px", width: "100%", display: "flex", justifyContent: "center" }}>
          <LessonProgressHeader
            currentStepIndex={userInfo ? currentPage - 1 : 0}
            totalSteps={totalQuestions}
            streak={0}
            stars={3}
            hideStreak={true}
            hideStars={true}
          />
        </div>
      </div>

      {/* Content Area */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start", // Changed to top-aligned to avoid cutoff
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1600px" }}>
          {showSuccess ? (
            <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", maxWidth: "600px", margin: "0 auto" }}>
              <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#1e3a8a", marginBottom: "12px" }}>¡Gracias por tu participación!</h2>
              <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.5 }}>Tu respuesta ha sido enviada con éxito. Valoramos mucho tu tiempo e interés.</p>
              <div style={{ marginTop: "24px", fontSize: "14px", fontStyle: "italic", color: "#94a3b8" }}>Redirigiendo...</div>
            </div>
          ) : !userInfo ? (
            <ExamIntro
              userInfo={tempUserInfo}
              onChange={setTempUserInfo}
              error={userInfoError}
            />
          ) : (
            <QuizQuestionCard
              question={currentQuestion}
              selectedValue={userAnswers[currentQuestion.id]}
              onSelect={(value) => handleQuizAnswer(currentQuestion.id, value)}
              showResults={quizSubmitted}
            />
          )}
        </div>
      </main>

      {/* Sticky Footer */}
      <div
        style={{
          flexShrink: 0,
          width: "100%",
          padding: "20px",
          paddingBottom: "max(20px, env(safe-area-inset-bottom))",
          background: "#fff",
          borderTop: "2px solid #cbd5e1",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 10
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <StickyFooterButton
            variant="outline"
            onClick={() => {
              if (!userInfo || currentPage === 1) {
                router.push("/")
              } else {
                goToPage(currentPage - 1)
              }
            }}
            style={{
              minWidth: 140,
              fontSize: "0.95rem",
              fontWeight: 700,
              padding: "12px 24px"
            }}
          >
            {!userInfo || currentPage === 1 ? "Salir" : "Anterior"}
          </StickyFooterButton>

          <div style={{ display: "flex", gap: 12 }}>
            {!userInfo ? (
              <StickyFooterButton
                variant="blue"
                onClick={handleStartQuiz}
                isLoading={isCheckingEmail}
                style={{
                  minWidth: 180,
                  fontSize: "1rem",
                  fontWeight: 800,
                  padding: "12px 32px"
                }}
              >
                Empezar examen
              </StickyFooterButton>
            ) : currentPage < totalQuestions ? (
              <StickyFooterButton
                variant="blue"
                onClick={() => goToPage(currentPage + 1)}
                disabled={userAnswers[currentQuestion.id] === undefined}
                style={{
                  minWidth: 160,
                  fontSize: "1rem",
                  fontWeight: 800,
                  padding: "12px 32px"
                }}
              >
                Siguiente
              </StickyFooterButton>
            ) : (
              <StickyFooterButton
                variant="success"
                onClick={handleQuizSubmit}
                disabled={quizIncomplete || quizSubmitted}
                style={{
                  minWidth: 180,
                  fontSize: "1rem",
                  fontWeight: 800,
                  padding: "12px 32px"
                }}
              >
                {quizSubmitted ? "Enviado" : "Finalizar examen"}
              </StickyFooterButton>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow: hidden !important;
        }
      `}</style>
    </div>
  )
}
