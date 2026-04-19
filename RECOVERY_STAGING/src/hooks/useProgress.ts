"use client";

import { useEffect, useState, useCallback } from "react";

export interface QuizAnswer {
  questionText: string;
  userAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
}

export interface ProgressData {
  sectionCompletions: any[];
  quizAttempts: any[];
  overallProgress: number;
  completedSections: number;
  totalSections: number;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);

  // Track page visit
  const trackPageVisit = useCallback(
    async (moduleId: number, sectionId: number, pageNumber: number) => {
      try {
        const response = await fetch("/api/progress/page-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleId,
            sectionId,
            pageNumber,
          }),
        });

        if (!response.ok) {
          let errorData: any = {};
          try {
            errorData = await response.json();
          } catch (jsonError) {
            // If response is not JSON, try to get text
            try {
              const text = await response.text();
              errorData = { message: text.substring(0, 200) };
            } catch (textError) {
              errorData = { message: "Could not parse error response" };
            }
          }
          console.error("Failed to track page visit:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            moduleId,
            sectionId,
            pageNumber,
          });
        }
      } catch (error) {
        console.error("Error tracking page visit:", error);
      }
    },
    []
  );

  // Submit quiz attempt
  const submitQuiz = useCallback(
    async (
      moduleId: number,
      sectionId: number,
      pageNumber: number,
      quizType: string,
      score: number,
      totalQuestions: number,
      answers: QuizAnswer[]
    ) => {
      try {
        const payload = {
          moduleId,
          sectionId,
          pageNumber,
          quizType,
          score,
          totalQuestions,
          answers,
        };
        
        console.log("📤 Sending quiz submission:", payload);
        console.log("Validation:", {
          hasModuleId: !!moduleId,
          hasSectionId: !!sectionId,
          hasPageNumber: pageNumber !== undefined,
          hasQuizType: !!quizType,
          hasScore: score !== undefined,
          hasTotalQuestions: !!totalQuestions,
          hasAnswers: !!answers,
          answersLength: answers?.length || 0,
        });
        
        const response = await fetch("/api/progress/quiz-submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          // If response is not JSON, try to get text
          const text = await response.text();
          console.error("❌ Server returned non-JSON response:", text);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        console.log("📥 Server response:", data);

        if (!response.ok) {
          console.error("❌ Submission failed:", data);
          throw new Error(data.error || "Failed to submit quiz");
        }

        console.log("✅ Quiz submitted successfully!");
        return { success: true, data };
      } catch (error: any) {
        console.error("Error submitting quiz:", error);
        return { success: false, error: error.message || "Unknown error occurred" };
      }
    },
    []
  );

  // Check if user has access to a section
  const checkAccess = useCallback(
    async (moduleId: number, sectionId: number) => {
      try {
        console.log(`🔍 Checking access for M${moduleId}S${sectionId}`);
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 3000);
        });
        
        // Create the fetch promise
        const fetchPromise = fetch("/api/progress/check-access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleId,
            sectionId,
          }),
        });

        // Race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            console.error("❌ Server returned non-JSON response:", text);
          } catch (textError) {
            // Ignore text error
          }
          // Return default access for first section if there's an error
          if (moduleId === 1 && sectionId === 1) {
            return { success: true, hasAccess: true, reason: "First section fallback - JSON parse error" };
          }
          return { success: false, hasAccess: false, error: "Failed to parse server response" };
        }
        
        console.log(`📡 Check access response:`, {
          ok: response.ok,
          status: response.status,
          data
        });

        if (!response.ok) {
          console.error("❌ Check access failed:", data);
          // Return default access for first section if there's an error
          if (moduleId === 1 && sectionId === 1) {
            return { success: true, hasAccess: true, reason: "First section fallback" };
          }
          return { success: false, hasAccess: false, error: data?.error || "Unknown error" };
        }

        return data;
      } catch (error) {
        console.error("Error checking access:", error);
        // Allow access to first section on error
        if (moduleId === 1 && sectionId === 1) {
          return { success: true, hasAccess: true, reason: "First section error fallback" };
        }
        return { success: false, hasAccess: false };
      }
    },
    []
  );

  // Mark section as complete
  const markSectionComplete = useCallback(
    async (
      moduleId: number,
      sectionId: number,
      totalPages: number,
      quizzesTotal: number
    ) => {
      try {
        const response = await fetch("/api/progress/mark-complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleId,
            sectionId,
            totalPages,
            quizzesTotal,
          }),
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            console.error("❌ Server returned non-JSON response:", text);
          } catch (textError) {
            // Ignore text error
          }
          throw new Error("Failed to parse server response");
        }

        if (!response.ok) {
          throw new Error(data?.error || "Failed to mark section complete");
        }

        return data;
      } catch (error) {
        console.error("Error marking section complete:", error);
        return { success: false };
      }
    },
    []
  );

  // Fetch user progress
  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/progress/user-progress");
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, try to get text
        try {
          const text = await response.text();
          console.error("❌ Server returned non-JSON response:", text);
        } catch (textError) {
          // Ignore text error
        }
        console.error("Error parsing progress response:", jsonError);
        return;
      }

      if (response.ok && data.success) {
        setProgress(data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if quiz has been completed
  const isQuizCompleted = useCallback(
    (moduleId: number, sectionId: number, pageNumber: number) => {
      if (!progress) return false;

      console.log(`🔎 Checking quiz completion for M${moduleId}S${sectionId}P${pageNumber}`);
      console.log(`📋 Available quiz attempts (${progress.quizAttempts.length}):`, progress.quizAttempts);
      
      // Log each attempt with FULL details
      progress.quizAttempts.forEach((attempt, index) => {
        console.log(`  📍 Attempt ${index} FULL OBJECT:`, JSON.stringify(attempt, null, 2));
        console.log(`  ✨ Attempt ${index} parsed:`, {
          moduleId: attempt.moduleId,
          sectionId: attempt.sectionId,
          pageNumber: attempt.pageNumber,
          score: attempt.score,
          allKeys: Object.keys(attempt),
          moduleIdMatch: attempt.moduleId === moduleId,
          sectionIdMatch: attempt.sectionId === sectionId,
          pageNumberMatch: attempt.pageNumber === pageNumber,
        });
      });

      const result = progress.quizAttempts.some(
        (attempt) =>
          attempt.moduleId === moduleId &&
          attempt.sectionId === sectionId &&
          attempt.pageNumber === pageNumber
      );
      
      console.log(`🎯 Quiz completion result: ${result}`);
      return result;
    },
    [progress]
  );

  return {
    progress,
    loading,
    trackPageVisit,
    submitQuiz,
    checkAccess,
    markSectionComplete,
    fetchProgress,
    isQuizCompleted,
  };
}


