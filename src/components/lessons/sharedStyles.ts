/**
 * Shared responsive styles for lesson components
 * BIZEN design system: primary green, secondary indigo, error red, warm & clear
 */

export const sharedStyles = {
  // Container styles
  container: "w-full space-y-6 md:space-y-10",

  // BIZEN Brand Gradients & Colors
  brand: {
    blueGradient: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
    blueText: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
    softBlue: "#F0F7FF",
    borderBlue: "rgba(11, 113, 254, 0.2)",
    shadowBlue: "0 10px 30px -10px rgba(11, 113, 254, 0.3)",
    premiumShadow: "0 4px 0 0 rgba(11, 113, 254, 0.8)",
  },

  // Typography - Montserrat preferred for BIZEN
  title:
    "text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0B71FE] to-[#4A9EFF] mb-4 tracking-tight text-center",
  question:
    "text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-tight text-center",
  body:
    "text-lg md:text-xl text-slate-700 leading-relaxed font-medium text-center max-w-2xl mx-auto",
  description:
    "text-base md:text-lg text-slate-500 mb-4 font-semibold text-center uppercase tracking-wider",

  // Card/Button styles - High quality, 3D effect
  card:
    "rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-slate-100 shadow-xl transition-all duration-300",

  // High-quality interactive option
  option:
    "p-5 md:p-6 rounded-2xl bg-white border-2 border-slate-200 transition-all duration-200 cursor-pointer text-left text-slate-800 text-lg md:text-xl font-bold shadow-[0_4px_0_0_#e2e8f0] hover:shadow-[0_2px_0_0_#e2e8f0] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
  optionSelected: "border-[#0B71FE] bg-[#F0F7FF] text-[#0B71FE] shadow-[0_4px_0_0_rgba(11,113,254,0.3)]",
  optionCorrect: "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-[0_4px_0_0_#10b981]",
  optionIncorrect: "bg-red-50 border-red-500 text-red-700 shadow-[0_4px_0_0_#ef4444]",

  // Grid layouts
  grid1Col: "grid grid-cols-1 gap-4 md:gap-6",
  grid2Col: "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8",

  // Flex layouts
  flexCol: "flex flex-col gap-6 md:gap-8Items-center",

  // Image styles
  image:
    "w-full h-auto max-w-sm mx-auto rounded-3xl object-contain shadow-2xl",

  // Feedback - correct green, incorrect red
  feedback: "mt-8 md:mt-10 p-6 md:p-8 rounded-3xl",
  feedbackCorrect: "bg-emerald-50 border-2 border-emerald-500 text-emerald-800",
  feedbackIncorrect: "bg-red-50 border-2 border-red-500 text-red-800",
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

