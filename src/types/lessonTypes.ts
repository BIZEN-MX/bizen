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
  | "review"
  | "mini_sim"
  | "billy_talks"
  | "blitz_challenge"
  | "impulse_meter"
  | "mindset_translator"
  | "influence_detective"
  | "swipe_sorter";

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
  imageUrl?: string;
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

/**
 * Order by Priority / Timeline Ordering step.
 * RULE: Draggable items must be shown in SHUFFLED order; correct order is only in correctOrder (AnswerKey).
 * OrderStep shuffles the initial display automatically; items array order in data is irrelevant.
 */
export interface OrderStepFields {
  stepType: "order";
  question?: string;
  imageUrl?: string;
  items: Array<{
    id: string;
    label: string;
    correctOrder: number; // AnswerKey: correct position (1-based). Display order is always shuffled.
  }>;
}

export interface MatchStepFields {
  stepType: "match";
  question?: string;
  imageUrl?: string;
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
  /** Optional image URL for lesson-completed slide; defaults to /Lección completada.png */
  imageUrl?: string;
  accuracy?: number;
  totalTime?: number;
}

export interface ReviewStepFields {
  stepType: "review";
  reviewSourceStepId: string; // References the step being reviewed
}

export interface MiniSimStepFields {
  stepType: "mini_sim";
  title: string;
  body?: string;
  /** Type of simulation: compound interest, inflation, budgeting, etc. */
  simType: "compound_interest" | "inflation" | "budget_slider";
  /** Goal value the user must reach to pass the step (e.g. save 10k) */
  targetValue?: number;
  /** Initial values for the simulation sliders */
  initialValues?: Record<string, number>;
}

export interface BillyTalksStepFields {
  stepType: "billy_talks";
  body: string;
  mood?: "happy" | "worried" | "thinking" | "celebrating" | "crying" | "mascot";
}

export interface BlitzChallengeStepFields {
  stepType: "blitz_challenge";
  question: string;
  options: Option[];
  /** Time limit in seconds, default 15 */
  timeLimit?: number;
  /** Name of the 'ghost' opponent (e.g., Billy, Juan) */
  ghostName?: string;
  /** Opponent's score or time taken */
  ghostScore?: string;
}

export interface ImpulseMeterStepFields {
  stepType: "impulse_meter";
  item: {
    name: string;
    price: string;
    imageUrl?: string;
  };
  instructions: string;
  holdTime?: number; // How many seconds to hold, default 3
}

export interface MindsetTranslatorStepFields {
  stepType: "mindset_translator";
  question: string;
  beliefs: Array<{
    id: string;
    original: string; // The limiting belief
    healthyOptions: Option[]; // The options to translate it to
  }>;
}

export interface InfluenceDetectiveStepFields {
  stepType: "influence_detective";
  scenario: string;
  scenarioImage?: string;
  options: Array<{
    id: string;
    label: string;
    emotion: string; // e.g., "Comparison", "Inspiration", "Fear"
    isCorrect: boolean;
  }>;
}

export interface SwipeSorterItem {
  id: string;
  label: string;
  sublabel?: string;
  amount?: string;
  correctBucket: "left" | "right";
}

export interface SwipeSorterStepFields {
  stepType: "swipe_sorter";
  question?: string;
  leftBucket: { label: string; color: string };
  rightBucket: { label: string; color: string };
  items: SwipeSorterItem[];
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
  /** Optional image URL for steps that support it (info, true_false, order, summary, mcq). Match steps never use images. */
  imageUrl?: string;
  /** When imageUrl is set: place image LEFT or RIGHT of the activity. Default "right". */
  imageAlign?: "left" | "right";
  /** Optional AI-generated insight or clue for the voice narration */
  aiInsight?: string;
  /** Optional clue for the user if they get stuck */
  clue?: string;
  /** Optional explanation of the correct answer shown after completion */
  explanation?: string;
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
  | (BaseLessonStep & ReviewStepFields)
  | (BaseLessonStep & MiniSimStepFields)
  | (BaseLessonStep & BillyTalksStepFields)
  | (BaseLessonStep & BlitzChallengeStepFields)
  | (BaseLessonStep & ImpulseMeterStepFields)
  | (BaseLessonStep & MindsetTranslatorStepFields)
  | (BaseLessonStep & InfluenceDetectiveStepFields)
  | (BaseLessonStep & SwipeSorterStepFields);

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
];
