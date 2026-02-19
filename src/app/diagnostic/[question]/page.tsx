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
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 8, textAlign: "center" }}>
        <span
          style={{
            fontSize: "clamp(13px, 2vw, 15px)",
            color: "#64748b",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {question.label}
        </span>
      </div>

      <h2
        style={{
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: 700,
          marginBottom: "2.5rem",
          color: "#1e293b",
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >
        {question.question}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
        {question.options.map((option, index) => {
          const isSelected = selectedValue === option.value
          let bgColor = "#f8fafc"
          let borderColor = isSelected ? "#2563eb" : "#e2e8f0"
          let textColor = "#1e293b"

          if (isSelected) {
            bgColor = "#eff6ff"
          }

          return (
            <button
              key={option.value}
              onClick={() => !showResults && onSelect(option.value)}
              disabled={showResults}
              style={{
                padding: "1.25rem 1.75rem",
                fontSize: "clamp(16px, 3.5vw, 19px)",
                fontWeight: 600,
                color: textColor,
                background: bgColor,
                border: `3px solid ${borderColor}`,
                borderRadius: "20px",
                cursor: showResults ? "default" : "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                transition: "all 0.2s ease",
                boxShadow: isSelected && !showResults ? "0 4px 12px rgba(37, 99, 235, 0.1)" : "none",
              }}
            >
              <span style={{
                width: 36,
                height: 36,
                borderRadius: "12px",
                background: isSelected ? "#2563eb" : "#f1f5f9",
                color: isSelected ? "#fff" : "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
                flexShrink: 0,
                border: isSelected ? "none" : "2px solid #e2e8f0"
              }}>
                {optionLabels[index]}
              </span>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{option.text}</span>
            </button>
          )
        })}
      </div>
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
  const [userInfo, setUserInfo] = React.useState<UserInfo | undefined>(undefined)
  const [isStorageReady, setIsStorageReady] = React.useState(false)

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
      setUserInfo(stored.userInfo)
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

      router.push("/")
    }
  }, [quizIncomplete, router, userInfo, userAnswers])

  const handleStartQuiz = (info: UserInfo) => {
    setUserInfo(info)
  }

  // If userInfo is missing, show the intro form
  if (isStorageReady && !userInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <ExamIntro onStart={handleStartQuiz} />
      </div>
    )
  }

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
          minHeight: 100,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f1f5f9",
          borderBottom: "2px solid #cbd5e1",
          boxSizing: "border-box",
        }}
      >
        <LessonProgressHeader
          currentStepIndex={currentPage - 1}
          totalSteps={totalQuestions}
          streak={0}
          stars={3}
          hideStreak={true}
          hideStars={true}
        />
      </div>

      {/* Content Area */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: `${CONTENT_PADDING_Y} ${CONTENT_PADDING_X}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH }}>
          <QuizQuestionCard
            question={currentQuestion}
            selectedValue={userAnswers[currentQuestion.id]}
            onSelect={(value) => handleQuizAnswer(currentQuestion.id, value)}
            showResults={quizSubmitted}
          />
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
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: CONTENT_MAX_WIDTH,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <StickyFooterButton
            variant="outline"
            onClick={() => {
              if (currentPage === 1) {
                router.push("/")
              } else {
                goToPage(currentPage - 1)
              }
            }}
            style={{
              minWidth: 140,
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            {currentPage === 1 ? "Salir" : "Anterior"}
          </StickyFooterButton>

          <div style={{ display: "flex", gap: 12 }}>
            {currentPage < totalQuestions ? (
              <StickyFooterButton
                variant="blue"
                onClick={() => goToPage(currentPage + 1)}
                disabled={userAnswers[currentQuestion.id] === undefined}
                style={{
                  minWidth: 160,
                  fontSize: "1.1rem",
                  fontWeight: 700,
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
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}
              >
                {quizSubmitted ? "Quiz Finalizado" : "Finalizar"}
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
