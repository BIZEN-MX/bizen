/**
 * Shared responsive styles for lesson components
 * BIZEN design system: primary green, secondary indigo, error red, warm & clear
 */

export const sharedStyles = {
  // Container styles
  container: "w-full space-y-5 md:space-y-8",

  // Typography - readable, not oversized
  title:
    "text-xl md:text-2xl font-bold text-slate-800 mb-3 tracking-tight",
  question:
    "text-lg md:text-xl font-semibold text-slate-800 mb-4 leading-snug",
  body:
    "text-base md:text-lg text-slate-700 leading-relaxed",
  description:
    "text-sm md:text-base text-slate-600 mb-3 font-medium",

  // Card/Button styles - rounded, friendly
  card:
    "rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 transition-all duration-200 border-2 border-slate-200",
  button:
    "rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-white",

  // Grid layouts
  grid1Col: "grid grid-cols-1 gap-4 md:gap-5",
  grid2Col: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
  grid3Col: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5",

  // Flex layouts
  flexCol: "flex flex-col gap-4 md:gap-5",
  flexRow: "flex flex-col md:flex-row gap-4 md:gap-5",
  flexCenter: "flex items-center justify-center",

  // Spacing
  spacing: {
    xs: "p-4 md:p-5",
    sm: "p-5 md:p-6",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-10",
  },

  // Image styles
  image:
    "w-full h-auto max-w-xs mx-auto rounded-xl object-contain",
  imageContainer:
    "flex items-center justify-center mb-4 rounded-xl overflow-hidden",

  // Text alignment
  textCenter: "text-center md:text-left",
  textLeft: "text-left",
  textRight: "text-right",

  // Option/Choice styles - primary green correct, red incorrect
  option:
    "p-4 md:p-5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all duration-200 cursor-pointer text-left text-slate-800 text-base md:text-lg",
  optionSelected: "bg-indigo-100 border-indigo-500",
  optionCorrect: "bg-green-100 border-2 border-green-500 text-green-900",
  optionIncorrect: "bg-red-100 border-2 border-red-500 text-red-900",

  // Input styles
  input:
    "w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-300 focus:border-indigo-500 focus:outline-none text-slate-800 text-base md:text-lg",

  // Drag and drop styles
  dragItem:
    "p-4 rounded-xl bg-slate-100 border-2 border-slate-300 cursor-move transition-all duration-200 text-slate-800 text-base md:text-lg",
  dragItemDragging: "opacity-50 scale-95",
  dropZone:
    "min-h-[80px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4",

  // Match pair styles
  matchContainer: "grid grid-cols-1 md:grid-cols-2 gap-4",
  matchItem:
    "p-4 rounded-xl bg-slate-100 border-2 border-slate-300 cursor-pointer transition-all duration-200 text-slate-800 text-base md:text-lg",
  matchItemMatched: "bg-green-100 border-2 border-green-500",

  // Order list styles
  orderList: "space-y-3",
  orderItem:
    "p-4 rounded-xl bg-slate-100 border-2 border-slate-300 cursor-move transition-all duration-200 text-slate-800 text-base md:text-lg",

  // Fill blanks styles
  blankText: "inline-block text-base md:text-lg text-slate-800",
  blankInput:
    "inline-block min-w-[140px] px-3 py-2 rounded-lg bg-slate-100 border-2 border-slate-300 focus:border-indigo-500 focus:outline-none text-slate-800 text-base mx-1",

  // Feedback - correct green, incorrect red
  feedback: "mt-5 md:mt-6 p-5 md:p-6 rounded-2xl",
  feedbackCorrect: "bg-green-100 border-2 border-green-500 text-green-900",
  feedbackIncorrect: "bg-red-100 border-2 border-red-500 text-red-900",
  feedbackInfo: "bg-indigo-50 border-2 border-indigo-300 text-indigo-900",

  // Loading/Disabled states
  disabled: "opacity-50 cursor-not-allowed",
  loading: "animate-pulse",
}

/**
 * Responsive text size utilities
 */
export const textSizes = {
  xs: "text-xs md:text-sm",
  sm: "text-sm md:text-base",
  base: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
  "2xl": "text-2xl md:text-3xl",
}

/**
 * Responsive spacing utilities
 */
export const spacing = {
  xs: "gap-2 md:gap-3",
  sm: "gap-3 md:gap-4",
  md: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
  xl: "gap-8 md:gap-10",
}

