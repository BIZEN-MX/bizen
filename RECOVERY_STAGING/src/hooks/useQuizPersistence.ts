/**
 * useQuizPersistence - A hook to persist quiz state in localStorage
 * This ensures users don't lose their progress if they refresh the page
 */

import { useState, useEffect } from "react";

export interface QuizState {
  idx: number;
  answers: any[];
  checked: boolean[];
  correct: boolean[];
  score: number;
}

export function useQuizPersistence(
  storageKey: string,
  totalQuestions: number,
  enabled: boolean = true
) {
  // Initialize state from localStorage or defaults
  const [idx, setIdx] = useState<number>(() => {
    if (!enabled || typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Math.max(0, Math.min(totalQuestions - 1, parsed.idx || 0));
      }
    } catch {}
    return 0;
  });

  const [answers, setAnswers] = useState<any[]>(() => {
    if (!enabled || typeof window === "undefined") return Array(totalQuestions).fill(null);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.answers) && parsed.answers.length === totalQuestions) {
          return parsed.answers;
        }
      }
    } catch {}
    return Array(totalQuestions).fill(null);
  });

  const [checked, setChecked] = useState<boolean[]>(() => {
    if (!enabled || typeof window === "undefined") return Array(totalQuestions).fill(false);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.checked) && parsed.checked.length === totalQuestions) {
          return parsed.checked;
        }
      }
    } catch {}
    return Array(totalQuestions).fill(false);
  });

  const [correct, setCorrect] = useState<boolean[]>(() => {
    if (!enabled || typeof window === "undefined") return Array(totalQuestions).fill(false);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.correct) && parsed.correct.length === totalQuestions) {
          return parsed.correct;
        }
      }
    } catch {}
    return Array(totalQuestions).fill(false);
  });

  const [score, setScore] = useState<number>(() => {
    if (!enabled || typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.score === "number" ? parsed.score : 0;
      }
    } catch {}
    return 0;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    
    try {
      const state: QuizState = {
        idx,
        answers,
        checked,
        correct,
        score,
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save quiz state:", error);
    }
  }, [idx, answers, checked, correct, score, storageKey, enabled]);

  // Clear persisted state (call this after successful quiz submission)
  const clearPersistedState = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(storageKey);
      console.log(`🗑️ Cleared persisted quiz state: ${storageKey}`);
    } catch (error) {
      console.error("Failed to clear quiz state:", error);
    }
  };

  return {
    idx,
    setIdx,
    answers,
    setAnswers,
    checked,
    setChecked,
    correct,
    setCorrect,
    score,
    setScore,
    clearPersistedState,
  };
}

