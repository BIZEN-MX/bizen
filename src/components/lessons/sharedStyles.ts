/**
 * Shared responsive styles for lesson question components
 * Enhanced: bigger fonts, accent colors, stronger visuals
 */

export const sharedStyles = {
  // Container styles
  container: "w-full space-y-5 md:space-y-8",

  // Typography - very large text within lessons
  title:
    "text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 md:mb-5 tracking-tight",
  question:
    "text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 mb-6 md:mb-8 leading-snug",
  body:
    "text-2xl md:text-3xl lg:text-4xl text-slate-700 leading-relaxed",
  description:
    "text-xl md:text-2xl lg:text-3xl text-slate-600 mb-4 font-medium",

  // Card/Button styles
  card:
    "rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 border-2 border-slate-200",
  button:
    "rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white",

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

  // Image styles - larger, rounded, shadow
  image:
    "w-full h-auto max-w-sm mx-auto md:max-w-md lg:max-w-lg rounded-2xl shadow-xl object-cover",
  imageContainer:
    "flex items-center justify-center mb-6 md:mb-8 rounded-2xl overflow-hidden",

  // Text alignment
  textCenter: "text-center md:text-left",
  textLeft: "text-left",
  textRight: "text-right",

  // Option/Choice styles - very large text
  option:
    "p-5 md:p-6 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all duration-200 cursor-pointer text-left text-slate-900 text-xl md:text-2xl lg:text-3xl",
  optionSelected: "bg-amber-100 border-amber-500",
  optionCorrect: "bg-emerald-100 border-emerald-600",
  optionIncorrect: "bg-red-100 border-red-600",

  // Input styles
  input:
    "w-full px-4 py-3 md:py-4 rounded-xl bg-slate-100 border-2 border-slate-300 focus:border-amber-500 focus:outline-none text-slate-900 text-xl md:text-2xl lg:text-3xl",

  // Drag and drop styles
  dragItem:
    "p-5 md:p-6 rounded-2xl bg-slate-100 border-2 border-slate-300 cursor-move transition-all duration-200 text-slate-900 text-xl md:text-2xl lg:text-3xl",
  dragItemDragging: "opacity-50 scale-95",
  dropZone:
    "min-h-[100px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4",

  // Match pair styles
  matchContainer: "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6",
  matchItem:
    "p-5 md:p-6 rounded-2xl bg-slate-100 border-2 border-slate-300 cursor-pointer transition-all duration-200 text-slate-900 text-xl md:text-2xl lg:text-3xl",
  matchItemMatched: "bg-emerald-100 border-emerald-600",

  // Order list styles
  orderList: "space-y-4 md:space-y-5",
  orderItem:
    "p-5 md:p-6 rounded-2xl bg-slate-100 border-2 border-slate-300 cursor-move transition-all duration-200 text-slate-900 text-xl md:text-2xl lg:text-3xl",

  // Fill blanks styles
  blankText: "inline-block text-2xl md:text-3xl text-slate-900",
  blankInput:
    "inline-block min-w-[180px] md:min-w-[220px] px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-300 focus:border-amber-500 focus:outline-none text-slate-900 text-xl md:text-2xl lg:text-3xl mx-1",

  // Feedback styles
  feedback: "mt-5 md:mt-6 p-5 md:p-6 rounded-2xl",
  feedbackCorrect: "bg-emerald-100 border-2 border-emerald-600 text-emerald-900",
  feedbackIncorrect: "bg-red-100 border-2 border-red-600 text-red-900",
  feedbackInfo: "bg-amber-100 border-2 border-amber-500 text-amber-900",

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

