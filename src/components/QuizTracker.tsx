"use client";

import { useEffect, useState } from "react";
import { useProgress, type QuizAnswer } from "@/hooks/useProgress";
import BillyCelebration from "./BillyCelebration";

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
  const [storedQuestions, setStoredQuestions] = useState<Question[]>([]);

  // Check if quiz is already completed - ALWAYS fetch fresh data
  useEffect(() => {
    setIsCheckingCompletion(true);
    console.log("QuizTracker mounted - fetching fresh progress data");
    
    const fetchData = async () => {
      try {
        await fetchProgress();
      } catch (error) {
        console.error("QuizTracker: Error fetching progress data:", error);
        // Continue without progress data
      } finally {
        // Always stop checking after a reasonable timeout
        setTimeout(() => {
          setIsCheckingCompletion(false);
        }, 2000);
      }
    };
    
    fetchData();
    
    // Also fetch again after a brief delay to catch any race conditions
    const delayedFetch = setTimeout(() => {
      fetchData();
    }, 500);
    
    return () => clearTimeout(delayedFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  useEffect(() => {
    if (progress) {
      console.log(`🔍 QuizTracker checking M${moduleId}S${sectionId}P${pageNumber}:`, {
        totalAttempts: progress.quizAttempts?.length || 0,
        quizAttempts: progress.quizAttempts
      });
      
      const completed = isQuizCompleted(moduleId, sectionId, pageNumber);
      console.log(`📊 Quiz completed status from DB:`, completed);
      
      // Check localStorage
      const localKey = `quiz_completed_m${moduleId}s${sectionId}p${pageNumber}`;
      const localCompleted = typeof window !== 'undefined' ? localStorage.getItem(localKey) === 'true' : false;
      console.log(`💾 Quiz completed status from localStorage:`, localCompleted);
      
      // IMPORTANT: If localStorage says true but DB says false, clear the stale localStorage
      if (localCompleted && !completed && typeof window !== 'undefined') {
        console.log(`🧹 Clearing stale localStorage flag for ${localKey}`);
        localStorage.removeItem(localKey);
        
        // Also clear any old quiz persistence data
        localStorage.removeItem(`bsmx:quiz:m${moduleId}s${sectionId}p${pageNumber}`);
        localStorage.removeItem(`bsmx:mc:mod${moduleId}:sec${sectionId}:quiz`);
        localStorage.removeItem(`bsmx:mc:mod${moduleId}:sec${sectionId}:quizIdentidad`);
      }
      
      // Only trust the database - don't use localStorage as fallback
      const isCompleted = completed;
      console.log(`🎯 Final completion status (DB only):`, isCompleted);
      
      setAlreadyCompleted(isCompleted);

      if (completed) {
        const attempt = progress.quizAttempts.find(
          (a) =>
            a.moduleId === moduleId &&
            a.sectionId === sectionId &&
            a.pageNumber === pageNumber
        );
        console.log("✅ Found attempt:", attempt);
        if (attempt) {
          console.log("🎯 Setting completedScore to:", attempt.score, "type:", typeof attempt.score);
          console.log("🔍 Attempt details:", {
            id: attempt.id,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            moduleId: attempt.moduleId,
            sectionId: attempt.sectionId,
            pageNumber: attempt.pageNumber
          });
          setCompletedScore(attempt.score);
        } else {
          console.log("❌ No attempt found for quiz completion");
          // Try to get score from localStorage as fallback
          const localScoreKey = `quiz_score_m${moduleId}s${sectionId}p${pageNumber}`;
          const localScore = typeof window !== 'undefined' ? localStorage.getItem(localScoreKey) : null;
          if (localScore) {
            const score = parseInt(localScore);
            console.log("🔄 Using localStorage score as fallback:", score);
            setCompletedScore(score);
          } else {
            console.log("❌ No score found in localStorage either");
          }
        }
      }
      
      // Notify parent component of completion status (using combined status)
      console.log(`🔔 Calling onCompletionStatusChange with: ${isCompleted}`);
      onCompletionStatusChange?.(isCompleted);
      console.log(`✅ onCompletionStatusChange called`);
      
      // Done checking
      setIsCheckingCompletion(false);
    } else {
      console.log("⏳ QuizTracker: No progress data yet");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, moduleId, sectionId, pageNumber]); // Removed isQuizCompleted and onCompletionStatusChange to prevent loops

  const handleAnswerSubmit = (
    questionIndex: number,
    questionText: string,
    userAnswer: boolean | string | number,
    correctAnswer: boolean | string | number,
    isCorrect: boolean
  ) => {
    console.log(`📝 [QUIZ_TRACKER] Answer submitted for Q${questionIndex}:`, { questionText, userAnswer, correctAnswer, isCorrect });
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = {
        questionText,
        userAnswer,
        correctAnswer,
        isCorrect,
      };
      console.log(`📊 [QUIZ_TRACKER] Total answers collected so far:`, newAnswers.length, newAnswers);
      return newAnswers;
    });
  };

  const handleQuizComplete = async (score: number) => {
    console.log(`🎯 [QUIZ_TRACKER] Quiz completion triggered with score: ${score}`);
    console.log(`📊 [QUIZ_TRACKER] Current answers state:`, answers);
    console.log(`🔍 [QUIZ_TRACKER] Debug - alreadyCompleted: ${alreadyCompleted}, isSubmitting: ${isSubmitting}`);
    console.log(`🔍 [QUIZ_TRACKER] Debug - moduleId: ${moduleId}, sectionId: ${sectionId}, pageNumber: ${pageNumber}`);
    
    if (alreadyCompleted || isSubmitting) {
      console.log(`⚠️ [QUIZ_TRACKER] Quiz already completed or submitting, skipping`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure we have valid data before submitting
      if (!moduleId || !sectionId || pageNumber === undefined || !quizType) {
        console.error("❌ [QUIZ_TRACKER] Missing quiz metadata");
        return;
      }
      
      // Use the answers that were actually collected from the quiz component
      const quizAnswers: QuizAnswer[] = answers.length > 0 ? answers : [];
      
      console.log(`📝 [QUIZ_TRACKER] Collected answers:`, quizAnswers);
      
      // If we have no answers but questions are provided, create empty answers
      if (quizAnswers.length === 0 && questions.length > 0) {
        console.log(`⚠️ [QUIZ_TRACKER] No answers collected, creating empty answers for ${questions.length} questions`);
        for (let i = 0; i < questions.length; i++) {
          quizAnswers.push({
            questionText: `Question ${i + 1}`,
            userAnswer: "Not answered",
            correctAnswer: "Unknown",
            isCorrect: false,
          });
        }
      }
      
      console.log("Submitting quiz with:", {
        moduleId,
        sectionId,
        pageNumber,
        quizType,
        score,
        totalQuestions: quizAnswers.length || questions.length,
        answersLength: answers.length,
        quizAnswers
      });
      
      const result = await submitQuiz(
        moduleId,
        sectionId,
        pageNumber,
        quizType,
        score,
        quizAnswers.length || questions.length,
        quizAnswers
      );

      if (result.success) {
        console.log("Quiz submitted successfully!");
        setAlreadyCompleted(true);
        setCompletedScore(score);
        
        // Set localStorage flag and score as backup
        const localKey = `quiz_completed_m${moduleId}s${sectionId}p${pageNumber}`;
        const localScoreKey = `quiz_score_m${moduleId}s${sectionId}p${pageNumber}`;
        if (typeof window !== 'undefined') {
          localStorage.setItem(localKey, 'true');
          localStorage.setItem(localScoreKey, score.toString());
          console.log(`💾 Set localStorage flag and score: ${localKey}, ${localScoreKey} = ${score}`);
        }
        
        // Refresh progress from database to get the new quiz attempt
        await fetchProgress();
        
        // Notify parent component
        onCompletionStatusChange?.(true);
        
        // Show Billy celebration!
        setShowBilly(true);
        
        // Show results after Billy celebration
        setTimeout(() => {
          setShowResults(true);
        }, 4000); // Show results 1 second after Billy appears (Billy shows for 3 seconds)
      } else {
        console.error("Failed to submit quiz:", result.error);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isCheckingCompletion ? (
        // Show loading while checking if quiz is already completed
        <div style={{ 
          padding: 40, 
          textAlign: 'center',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
            <p style={{ fontSize: 18, color: '#666' }}>Verificando estado del quiz...</p>
          </div>
        </div>
      ) : alreadyCompleted ? (
        // Show "Already Completed" screen - bypasses child component
        <div style={{
          width: '100%',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          paddingBottom: 120, // Extra space for navigation buttons
          background: '#FBFAF5',
        }}>
          <div style={{
            maxWidth: 600,
            width: '100%',
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 20,
            padding: 40,
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: '#0F62FE' }}>
              Quiz Ya Completado
            </h2>
            <p style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>
              Ya completaste este quiz. Los quizzes solo pueden realizarse una vez.
            </p>
            <div style={{
              padding: 20,
              background: 'rgba(15, 98, 254, 0.1)',
              borderRadius: 14,
              marginBottom: 24,
            }}>
              <strong style={{ fontSize: 28, color: '#0F62FE' }}>
                Tu puntuación: {completedScore ?? '?'} / {questions.length || '?'}
              </strong>
            </div>
            <p style={{ fontSize: 16, color: '#999', marginBottom: 12 }}>
              ✨ Usa el botón &ldquo;Continuar →&rdquo; abajo para seguir
            </p>
            <div style={{
              marginTop: 20,
              padding: 12,
              background: '#f0f9ff',
              borderRadius: 10,
              border: '1px solid #0F62FE33'
            }}>
              <p style={{ margin: 0, fontSize: 14, color: '#0F62FE' }}>
                💡 Busca el botón azul &ldquo;Continuar →&rdquo; en la parte inferior de la pantalla
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Show quiz if not completed
        children({
          onAnswerSubmit: handleAnswerSubmit,
          onQuizComplete: handleQuizComplete,
          isAlreadyCompleted: alreadyCompleted,
          completedScore,
        })
      )}
      
      {/* Billy Celebration when quiz is completed */}
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
      
      {/* Quiz Results Summary */}
      {showResults && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: 20,
        }}>
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: 30,
            maxWidth: 800,
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: 30,
              borderBottom: '2px solid #0F62FE',
              paddingBottom: 20,
            }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 800,
                color: '#0F62FE',
                margin: '0 0 10px 0',
              }}>
                📊 Resultados del Quiz
              </h2>
              <p style={{
                fontSize: 18,
                color: '#666',
                margin: 0,
              }}>
                Puntuación: {completedScore} / {questions.length}
              </p>
            </div>
            
            {/* Answers List */}
            <div style={{ marginBottom: 30 }}>
              {answers.map((answer, index) => (
                <div key={index} style={{
                  marginBottom: 20,
                  padding: 20,
                  borderRadius: 12,
                  border: `2px solid ${answer.isCorrect ? '#10B981' : '#EF4444'}`,
                  background: answer.isCorrect ? '#F0FDF4' : '#FEF2F2',
                  position: 'relative',
                }}>
                  {/* Question */}
                  <div style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#1F2937',
                    marginBottom: 12,
                    lineHeight: 1.4,
                  }}>
                    {index + 1}. {answer.questionText}
                  </div>
                  
                  {/* Answers */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <span style={{
                        fontWeight: 600,
                        color: '#6B7280',
                        minWidth: 80,
                      }}>
                        Tu respuesta:
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        background: answer.isCorrect ? '#D1FAE5' : '#FEE2E2',
                        color: answer.isCorrect ? '#065F46' : '#991B1B',
                        fontWeight: 600,
                      }}>
                        {typeof answer.userAnswer === 'boolean' 
                          ? (answer.userAnswer ? 'VERDADERO' : 'FALSO')
                          : String(answer.userAnswer)}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <span style={{
                        fontWeight: 600,
                        color: '#6B7280',
                        minWidth: 80,
                      }}>
                        Respuesta correcta:
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        background: '#E0E7FF',
                        color: '#3730A3',
                        fontWeight: 600,
                      }}>
                        {typeof answer.correctAnswer === 'boolean' 
                          ? (answer.correctAnswer ? 'VERDADERO' : 'FALSO')
                          : String(answer.correctAnswer)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Icon */}
                  <div style={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    fontSize: 24,
                  }}>
                    {answer.isCorrect ? '✅' : '❌'}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Close Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowResults(false)}
                style={{
                  background: '#0F62FE',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 30px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 98, 254, 0.3)',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


