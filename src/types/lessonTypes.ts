/**
 * Lesson Engine Types
 * 
 * TypeScript types and interfaces for a Duolingo-style interactive lesson system.
 */

// ============================================================================
// Step Type Union
// ============================================================================

export type StepType =
  | "info"
  | "mcq"
  | "multi_select"
  | "true_false"
  | "order"
  | "match"
  | "fill_blanks"
  | "image_choice"
  | "summary"
  | "review";

// ============================================================================
// Option Types (used by multiple step types)
// ============================================================================

export interface Option {
  id: string;
  label: string;
  explanation?: string;
  isCorrect: boolean;
}

export interface ImageOption {
  id: string;
  label: string;
  imageAlt: string;
  imageId: string; // Placeholder for image reference
}

// ============================================================================
// Step-Specific Field Types
// ============================================================================

export interface InfoStepFields {
  stepType: "info";
  title: string;
  /** Optional description/subtitle shown below title */
  description?: string;
  body: string;
  /** Optional image URL (e.g. /billy-mascot-leccion1.png) shown above the body */
  imageUrl?: string;
}

export interface McqStepFields {
  stepType: "mcq";
  question: string;
  options: Option[];
}

export interface MultiSelectStepFields {
  stepType: "multi_select";
  question: string;
  options: Option[]; // Multiple options can have isCorrect: true
}

export interface TrueFalseStepFields {
  stepType: "true_false";
  statement: string;
  correctValue: boolean;
  explanation?: string;
}

export interface OrderStepFields {
  stepType: "order";
  question?: string;
  items: Array<{
    id: string;
    label: string;
    correctOrder: number; // The correct position (1-based or 0-based)
  }>;
}

export interface MatchStepFields {
  stepType: "match";
  question?: string;
  leftItems: Array<{
    id: string;
    label: string;
  }>;
  rightItems: Array<{
    id: string;
    label: string;
  }>;
  correctPairs: Array<{
    leftId: string;
    rightId: string;
  }>;
}

export interface FillBlanksStepFields {
  stepType: "fill_blanks";
  question?: string;
  textParts: Array<
    | { type: "text"; content: string }
    | { type: "blank"; id: string; correctOptionId: string }
  >;
  options: Option[]; // Options available for all blanks
}

export interface ImageChoiceStepFields {
  stepType: "image_choice";
  question: string;
  imageOptions: ImageOption[];
  correctImageId: string; // ID of the correct image option
}

export interface SummaryStepFields {
  stepType: "summary";
  title: string;
  body: string;
}

export interface ReviewStepFields {
  stepType: "review";
  reviewSourceStepId: string; // References the step being reviewed
}

// ============================================================================
// Base LessonStep Interface (Common Fields)
// ============================================================================

export interface BaseLessonStep {
  id: string;
  stepType: StepType;
  title?: string;
  description?: string;
  isAssessment?: boolean; // true if it should be considered for correctness tracking
  recordIncorrect?: boolean; // default true for question steps
  reviewSourceStepId?: string; // used when a review step is a repetition of another step
  fullScreen?: boolean; // true to hide progress bar and footer, step renders its own buttons
  continueLabel?: string; // e.g. "Continuar", "Seguir", "Avanzar", "Completar misión"
}

// ============================================================================
// LessonStep Discriminated Union
// ============================================================================

export type LessonStep =
  | (BaseLessonStep & InfoStepFields)
  | (BaseLessonStep & McqStepFields)
  | (BaseLessonStep & MultiSelectStepFields)
  | (BaseLessonStep & TrueFalseStepFields)
  | (BaseLessonStep & OrderStepFields)
  | (BaseLessonStep & MatchStepFields)
  | (BaseLessonStep & FillBlanksStepFields)
  | (BaseLessonStep & ImageChoiceStepFields)
  | (BaseLessonStep & SummaryStepFields)
  | (BaseLessonStep & ReviewStepFields);

// ============================================================================
// Example LessonStep Objects
// ============================================================================

/**
 * Example lesson steps demonstrating the data structure.
 * You can define all screens for a lesson as: const lessonSteps: LessonStep[] = [...]
 */
export const exampleLessonSteps: LessonStep[] = [
  // Info step
  {
    id: "step-1",
    stepType: "info",
    title: "Welcome to Lesson 1",
    body: "In this lesson, you'll learn about basic business concepts.",
    description: "Introduction to the lesson",
    isAssessment: false,
  },

  // MCQ step
  {
    id: "step-2",
    stepType: "mcq",
    question: "What is the primary goal of a business?",
    options: [
      {
        id: "opt-1",
        label: "To make a profit",
        isCorrect: true,
        explanation: "Correct! The primary goal of most businesses is to generate profit.",
      },
      {
        id: "opt-2",
        label: "To provide free services",
        isCorrect: false,
        explanation: "While some businesses provide free services, the primary goal is usually profit.",
      },
      {
        id: "opt-3",
        label: "To avoid customers",
        isCorrect: false,
      },
      {
        id: "opt-4",
        label: "To lose money",
        isCorrect: false,
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },

  // Multi-select step
  {
    id: "step-3",
    stepType: "multi_select",
    question: "Which of the following are types of business ownership? (Select all that apply)",
    options: [
      {
        id: "opt-1",
        label: "Sole Proprietorship",
        isCorrect: true,
      },
      {
        id: "opt-2",
        label: "Partnership",
        isCorrect: true,
      },
      {
        id: "opt-3",
        label: "Corporation",
        isCorrect: true,
      },
      {
        id: "opt-4",
        label: "Hobby",
        isCorrect: false,
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },

  // True/False step
  {
    id: "step-4",
    stepType: "true_false",
    statement: "All businesses require a physical location to operate.",
    correctValue: false,
    explanation: "Many businesses operate online or remotely without a physical location.",
    isAssessment: true,
    recordIncorrect: true,
  },

  // Order step
  {
    id: "step-5",
    stepType: "order",
    question: "Arrange the steps of starting a business in the correct order:",
    items: [
      {
        id: "item-1",
        label: "Create a business plan",
        correctOrder: 1,
      },
      {
        id: "item-2",
        label: "Register your business",
        correctOrder: 2,
      },
      {
        id: "item-3",
        label: "Obtain necessary licenses",
        correctOrder: 3,
      },
      {
        id: "item-4",
        label: "Launch your business",
        correctOrder: 4,
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },

  // Match step
  {
    id: "step-6",
    stepType: "match",
    question: "Match each business term with its definition:",
    leftItems: [
      { id: "left-1", label: "Revenue" },
      { id: "left-2", label: "Profit" },
      { id: "left-3", label: "Expenses" },
    ],
    rightItems: [
      { id: "right-1", label: "Money earned from sales" },
      { id: "right-2", label: "Revenue minus expenses" },
      { id: "right-3", label: "Costs of running a business" },
    ],
    correctPairs: [
      { leftId: "left-1", rightId: "right-1" },
      { leftId: "left-2", rightId: "right-2" },
      { leftId: "left-3", rightId: "right-3" },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },

  // Fill blanks step
  {
    id: "step-7",
    stepType: "fill_blanks",
    question: "Complete the sentence:",
    textParts: [
      { type: "text", content: "A " },
      { type: "blank", id: "blank-1", correctOptionId: "opt-2" },
      { type: "text", content: " is a person who starts and runs a business, taking on financial risks in the hope of " },
      { type: "blank", id: "blank-2", correctOptionId: "opt-4" },
      { type: "text", content: "." },
    ],
    options: [
      { id: "opt-1", label: "employee", isCorrect: false },
      { id: "opt-2", label: "entrepreneur", isCorrect: true },
      { id: "opt-3", label: "customer", isCorrect: false },
      { id: "opt-4", label: "profit", isCorrect: true },
      { id: "opt-5", label: "loss", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },

  // Image choice step
  {
    id: "step-8",
    stepType: "image_choice",
    question: "Which chart best represents exponential growth?",
    correctImageId: "img-2", // Exponential Growth
    imageOptions: [
      {
        id: "img-1",
        label: "Linear Growth",
        imageAlt: "A linear growth chart",
        imageId: "linear-chart",
      },
      {
        id: "img-2",
        label: "Exponential Growth",
        imageAlt: "An exponential growth chart",
        imageId: "exponential-chart",
      },
      {
        id: "img-3",
        label: "Declining Growth",
        imageAlt: "A declining growth chart",
        imageId: "declining-chart",
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },

  // Summary step
  {
    id: "step-9",
    stepType: "summary",
    title: "Lesson Complete!",
    body: "You've learned about basic business concepts including ownership types, financial terms, and the steps to start a business.",
    isAssessment: false,
  },

  // Review step (references step-2)
  {
    id: "step-10",
    stepType: "review",
    reviewSourceStepId: "step-2",
    description: "Review: What is the primary goal of a business?",
    isAssessment: true,
    recordIncorrect: true,
  },
];

