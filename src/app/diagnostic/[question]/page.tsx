"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"
import { diagnosticQuiz, type QuizOption, type QuizQuestion } from "@/components/diagnostic/quizData"

type StoredQuizState = {
  quizSubmitted: boolean
  userAnswers: Record<string, QuizOption["value"] | undefined>
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
  const isCorrect = showResults && selectedValue === question.answer

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${
        isCorrect ? "border-emerald-400" : "border-slate-200"
      }`}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          {question.label}
        </span>
        {showResults ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isCorrect ? "Correcta" : `Respuesta: ${question.answer}`}
          </span>
        ) : null}
      </header>

      <p className="mb-5 text-base leading-7 text-slate-800">{question.question}</p>

      <div className="grid gap-3" role="group" aria-label={question.question}>
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value
          const isAnswer = option.value === question.answer
          const optionStyles = showResults
            ? isAnswer
              ? "border-emerald-500 bg-emerald-50"
              : isSelected
                ? "border-red-500 bg-red-50"
                : "border-slate-200 bg-white"
            : isSelected
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 bg-white"

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition ${optionStyles}`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={isSelected}
                onChange={() => onSelect(option.value)}
                className="mt-1"
              />
              <span className="text-sm font-semibold text-slate-500">{option.value})</span>
              <span className="text-sm text-slate-700">{option.text}</span>
            </label>
          )
        })}
      </div>
    </article>
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
    }
    setIsStorageReady(true)
  }, [])

  React.useEffect(() => {
    if (!isStorageReady) return
    try {
      const state: StoredQuizState = { userAnswers, quizSubmitted }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
  }, [isStorageReady, userAnswers, quizSubmitted])

  React.useEffect(() => {
    if (!Number.isFinite(rawPage) || rawPage < 1 || rawPage > totalQuestions) {
      router.replace("/diagnostic/1", { scroll: false })
    }
  }, [rawPage, totalQuestions, router])

  const answeredCount = React.useMemo(
    () => diagnosticQuiz.reduce((sum, question) => sum + (userAnswers[question.id] ? 1 : 0), 0),
    [userAnswers]
  )
  const correctCount = React.useMemo(
    () => diagnosticQuiz.reduce((sum, question) => sum + (userAnswers[question.id] === question.answer ? 1 : 0), 0),
    [userAnswers]
  )
  const quizScore = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0
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

  const handleQuizSubmit = React.useCallback(() => {
    if (!quizIncomplete) {
      setQuizSubmitted(true)
    }
  }, [quizIncomplete])

  const handleQuizReset = React.useCallback(() => {
    setUserAnswers({})
    setQuizSubmitted(false)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
    router.push("/diagnostic/1", { scroll: false })
  }, [router])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Quiz diagnóstico financiero</h1>
          <Link
            href="/"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Volver al landing
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-100 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Pregunta</p>
              <p className="text-xl font-semibold text-slate-900">
                {currentPage}/{totalQuestions}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Contestadas</p>
              <p className="text-xl font-semibold text-slate-900">
                {answeredCount}/{totalQuestions}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Estado</p>
              <p className="text-xl font-semibold text-slate-900">{quizSubmitted ? "Calificado" : "Pendiente"}</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Puntaje</p>
              <p className="text-xl font-semibold text-slate-900">{quizSubmitted ? `${quizScore}%` : "-"}</p>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {quizSubmitted
              ? `Acertaste ${correctCount} de ${totalQuestions} preguntas.`
              : "Navega por las páginas con Anterior y Siguiente."}
          </p>
        </section>

        <QuizQuestionCard
          question={currentQuestion}
          selectedValue={userAnswers[currentQuestion.id]}
          onSelect={(value) => handleQuizAnswer(currentQuestion.id, value)}
          showResults={quizSubmitted}
        />

        <section className="sticky bottom-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <div className="flex flex-wrap gap-2">
              {currentPage < totalQuestions ? (
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  className="rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  disabled={quizIncomplete}
                  className="rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Finalizar y calificar
                </button>
              )}
              <button
                type="button"
                onClick={handleQuizReset}
                className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Reiniciar
              </button>
            </div>
          </div>

          {currentPage === totalQuestions && quizIncomplete ? (
            <p className="mt-2 text-xs text-amber-700">
              Faltan respuestas. Regresa con Anterior para completar todas las preguntas antes de calificar.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}
