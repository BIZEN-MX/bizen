"use client";

import { useEffect, useState, useRef } from "react";
import { useProgress, type QuizAnswer } from "@/hooks/useProgress";
import BillyCelebration from "./BillyCelebration";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, Star, BarChart2, X, RotateCcw } from "lucide-react";

export interface Question {
  text: string;
  answer: boolean | string | number;
  options?: string[];
}

export interface QuizTrackerProps {
  moduleId: number;
  sectionId: number;
  pageNumber: number;
  quizType: "true_false" | "multiple_choice";
  questions: Question[];
  onCompletionStatusChange?: (isCompleted: boolean) => void;
  children: (props: {
    onAnswerSubmit: (
      questionIndex: number,
      questionText: string,
      userAnswer: boolean | string | number,
      correctAnswer: boolean | string | number,
      isCorrect: boolean
    ) => void;
    onQuizComplete: (score: number) => void;
    isAlreadyCompleted: boolean;
    completedScore?: number;
  }) => React.ReactNode;
}

// ── Animated score ring ──────────────────────────────────────────────────────
function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? score / total : 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circumference * (1 - pct)), 400);
    return () => clearTimeout(t);
  }, [pct, circumference]);
  const color = pct >= 0.8 ? "#10b981" : pct >= 0.5 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position: "relative", width: 132, height: 132, margin: "0 auto" }}>
      <svg width={132} height={132} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={66} cy={66} r={radius} fill="none" stroke="rgba(15,98,254,0.1)" strokeWidth={12} />
        <circle
          cx={66} cy={66} r={radius} fill="none"
          stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)", filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 34, fontWeight: 900, color: "#1e293b", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>de {total}</span>
      </div>
    </div>
  );
}

export function QuizTracker({
  moduleId,
  sectionId,
  pageNumber,
  quizType,
  questions,
  onCompletionStatusChange,
  children,
}: QuizTrackerProps) {
  const { submitQuiz, isQuizCompleted, progress, fetchProgress } = useProgress();
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [completedScore, setCompletedScore] = useState<number>();
  const [showBilly, setShowBilly] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(true);

  // Fetch progress on mount
  useEffect(() => {
    setIsCheckingCompletion(true);
    const fetchData = async () => {
      try { await fetchProgress(); }
      catch { /* ignore */ }
      finally { setTimeout(() => setIsCheckingCompletion(false), 2000); }
    };
    fetchData();
    const delay = setTimeout(fetchData, 500);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!progress) return;
    const completed = isQuizCompleted(moduleId, sectionId, pageNumber);
    const localKey = `quiz_completed_m${moduleId}s${sectionId}p${pageNumber}`;
    const localCompleted = typeof window !== "undefined" ? localStorage.getItem(localKey) === "true" : false;
    if (localCompleted && !completed && typeof window !== "undefined") {
      localStorage.removeItem(localKey);
      localStorage.removeItem(`bsmx:quiz:m${moduleId}s${sectionId}p${pageNumber}`);
    }
    setAlreadyCompleted(completed);
    if (completed) {
      const attempt = progress.quizAttempts?.find(
        (a) => a.moduleId === moduleId && a.sectionId === sectionId && a.pageNumber === pageNumber
      );
      if (attempt) setCompletedScore(attempt.score);
    }
    onCompletionStatusChange?.(completed);
    setIsCheckingCompletion(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, moduleId, sectionId, pageNumber]);

  const handleAnswerSubmit = (
    questionIndex: number,
    questionText: string,
    userAnswer: boolean | string | number,
    correctAnswer: boolean | string | number,
    isCorrect: boolean
  ) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = { questionText, userAnswer, correctAnswer, isCorrect };
      return next;
    });
  };

  const handleQuizComplete = async (score: number) => {
    if (alreadyCompleted || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!moduleId || !sectionId || pageNumber === undefined || !quizType) return;
      const quizAnswers: QuizAnswer[] = answers.length > 0 ? answers : [];
      if (quizAnswers.length === 0 && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          quizAnswers.push({ questionText: `Question ${i + 1}`, userAnswer: "Not answered", correctAnswer: "Unknown", isCorrect: false });
        }
      }
      const result = await submitQuiz(moduleId, sectionId, pageNumber, quizType, score, quizAnswers.length || questions.length, quizAnswers);
      if (result.success) {
        setAlreadyCompleted(true);
        setCompletedScore(score);
        const localKey = `quiz_completed_m${moduleId}s${sectionId}p${pageNumber}`;
        if (typeof window !== "undefined") {
          localStorage.setItem(localKey, "true");
          localStorage.setItem(`quiz_score_m${moduleId}s${sectionId}p${pageNumber}`, score.toString());
        }
        await fetchProgress();
        onCompletionStatusChange?.(true);
        setShowBilly(true);
        setTimeout(() => setShowResults(true), 4000);
      }
    } catch { /* ignore */ }
    finally { setIsSubmitting(false); }
  };

  // ── Checking state ────────────────────────────────────────────────────────
  if (isCheckingCompletion) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: 20 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#0F62FE" }}
        />
        <p style={{ fontSize: 15, color: "#94a3b8", fontWeight: 500 }}>Verificando estado del quiz…</p>
      </div>
    );
  }

  // ── Already completed state ───────────────────────────────────────────────
  if (alreadyCompleted) {
    const pct = questions.length > 0 ? (completedScore ?? 0) / questions.length : 0;
    const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    const msg = pct === 1 ? "¡Resultado perfecto, Dragón!" : pct >= 0.6 ? "¡Excelente trabajo!" : "¡Buen esfuerzo!";

    return (
      <div style={{
        width: "100%", minHeight: "60vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px 120px",
        background: "linear-gradient(160deg, #f8faff 0%, #eef4ff 100%)",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: 520, width: "100%",
            background: "white",
            border: "1.5px solid rgba(15,98,254,0.12)",
            borderRadius: 28,
            padding: "40px 36px",
            boxShadow: "0 20px 60px rgba(15,98,254,0.1)",
            textAlign: "center",
          }}
        >
          {/* Score ring */}
          <ScoreRing score={completedScore ?? 0} total={questions.length} />

          {/* Stars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", justifyContent: "center", gap: 8, margin: "20px 0 8px" }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 + i * 0.12 }}
              >
                <Star size={32} color={i <= stars ? "#f59e0b" : "#E2E8F0"} fill={i <= stars ? "#f59e0b" : "transparent"} strokeWidth={2} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: "12px 0 8px", lineHeight: 1.2 }}>{msg}</h2>
            <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 24px", lineHeight: 1.5 }}>
              Ya completaste este quiz · Solo puede realizarse una vez.
            </p>

            {/* Score details */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24,
            }}>
              <div style={{ padding: "16px", borderRadius: 18, background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)", border: "1px solid #BFDBFE" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Aciertos</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#1D4ED8" }}>{completedScore ?? "—"}</div>
              </div>
              <div style={{ padding: "16px", borderRadius: 18, background: "linear-gradient(135deg, #F9FAFB, #F3F4F6)", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Total</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#374151" }}>{questions.length}</div>
              </div>
            </div>

            <div style={{ padding: "10px 16px", borderRadius: 12, background: "#F0F9FF", border: "1px solid #BAE6FD" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#0369a1", fontWeight: 500 }}>
                💡 Usa el botón <strong>&ldquo;Continuar →&rdquo;</strong> en la parte inferior para avanzar
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── Quiz (children) ───────────────────────────────────────────────────────
  return (
    <>
      {children({
        onAnswerSubmit: handleAnswerSubmit,
        onQuizComplete: handleQuizComplete,
        isAlreadyCompleted: alreadyCompleted,
        completedScore,
      })}

      {/* Billy celebration */}
      {showBilly && (
        <BillyCelebration
          message="¡Bien hecho, Dragón!"
          onClose={() => setShowBilly(false)}
          autoCloseAfter={3000}
          accentColor="#0F62FE"
          showCloseButton={false}
          playSound={true}
        />
      )}

      {/* ── Results modal ── */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2000, padding: 20,
            }}
            onClick={() => setShowResults(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 32 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 28,
                width: "100%", maxWidth: 640,
                maxHeight: "85vh", overflowY: "auto",
                boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
              }}
            >
              {/* Modal header */}
              <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                borderRadius: "28px 28px 0 0",
                padding: "28px 32px 24px",
                position: "relative",
              }}>
                <button
                  onClick={() => setShowResults(false)}
                  style={{
                    position: "absolute", top: 16, right: 16,
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={16} color="white" />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 16, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChart2 size={22} color="white" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 }}>Resultados del Quiz</h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, marginTop: 2 }}>Análisis de tu rendimiento</p>
                  </div>
                </div>

                {/* Score summary row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Aciertos", value: completedScore ?? 0, color: "#10b981", sub: "correctas" },
                    { label: "Errores", value: (questions.length || 0) - (completedScore ?? 0), color: "#ef4444", sub: "incorrectas" },
                    { label: "Precisión", value: `${questions.length > 0 ? Math.round(((completedScore ?? 0) / questions.length) * 100) : 0}%`, color: "#60a5fa", sub: "efectividad" },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 500, marginTop: 2 }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer list */}
              <div style={{ padding: "24px 28px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Revisión de respuestas</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {answers.map((answer, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        padding: "16px 20px",
                        borderRadius: 18,
                        border: `1.5px solid ${answer.isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                        background: answer.isCorrect ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)",
                        display: "flex", flexDirection: "column", gap: 10,
                      }}
                    >
                      {/* Question row */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                          {answer.isCorrect
                            ? <CheckCircle2 size={18} color="#10b981" strokeWidth={2.5} />
                            : <XCircle size={18} color="#ef4444" strokeWidth={2.5} />}
                        </div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#1e293b", lineHeight: 1.45 }}>
                          <span style={{ fontWeight: 700, color: "#94a3b8", marginRight: 6 }}>Q{idx + 1}.</span>
                          {answer.questionText}
                        </p>
                      </div>

                      {/* Answer chips */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tú:</span>
                          <span style={{
                            padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                            background: answer.isCorrect ? "#dcfce7" : "#fee2e2",
                            color: answer.isCorrect ? "#15803d" : "#b91c1c",
                          }}>
                            {typeof answer.userAnswer === "boolean"
                              ? answer.userAnswer ? "VERDADERO" : "FALSO"
                              : String(answer.userAnswer)}
                          </span>
                        </div>
                        {!answer.isCorrect && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Correcta:</span>
                            <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "#e0e7ff", color: "#3730a3" }}>
                              {typeof answer.correctAnswer === "boolean"
                                ? answer.correctAnswer ? "VERDADERO" : "FALSO"
                                : String(answer.correctAnswer)}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowResults(false)}
                  style={{
                    width: "100%", marginTop: 24,
                    padding: "14px", borderRadius: 18,
                    background: "linear-gradient(135deg, #0F62FE, #1D4ED8)",
                    color: "white", border: "none",
                    fontSize: 15, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(15,98,254,0.3)",
                  }}
                >
                  Cerrar revisión
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
