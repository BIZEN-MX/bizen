"use client"

import React from "react"

interface StickyFooterProps {
  children: React.ReactNode
  className?: string
  /** Whether to use fixed positioning or stay in flex flow. Default true for backward compatibility. */
  fixed?: boolean
}

/**
 * Sticky footer that stays at the bottom of its container or viewport
 * - Supports safe-area insets for iPhone notch
 * - Centered container with max-width on desktop
 */
export function StickyFooter({ children, className = "", fixed = true }: StickyFooterProps) {
  return (
    <footer
      className={`lesson-sticky-footer ${fixed ? "fixed bottom-0 left-0 right-0" : "relative"} w-full bg-white/70 backdrop-blur-xl border-t-2 border-[#F1F5F9] z-[100] ${className}`}
      style={{
        paddingTop: "clamp(16px, 2.5vw, 24px)",
        paddingBottom: "max(clamp(16px, 2.5vw, 24px), env(safe-area-inset-bottom))",
        paddingLeft: "clamp(16px, 4vw, 32px)",
        paddingRight: "clamp(16px, 4vw, 32px)",
        display: "flex",
        justifyContent: "center",
        boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.04)",
        flexShrink: 0
      }}
    >
      <div className="w-full" style={{ maxWidth: 1000 }}>
        {children}
      </div>
    </footer>
  )
}

interface StickyFooterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "danger" | "blue" | "outline"
  isLoading?: boolean
}

/**
 * Responsive button for sticky footer
 */
export function StickyFooterButton({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...props
}: StickyFooterButtonProps) {
  const baseStyles =
    "block rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white"

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#0B71FE] to-[#4A9EFF] hover:brightness-110 text-white shadow-[0_4px_0_0_#0558ca] active:shadow-none active:translate-y-[4px]",
    secondary:
      "bg-slate-50 border-2 border-slate-200 hover:bg-slate-100 text-slate-700 shadow-[0_4px_0_0_#e2e8f0] active:shadow-none active:translate-y-[4px]",
    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-[4px]",
    danger:
      "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_0_0_#be123c] active:shadow-none active:translate-y-[4px]",
    blue:
      "bg-gradient-to-r from-[#0B71FE] to-[#4A9EFF] hover:brightness-110 text-white shadow-[0_4px_0_0_#0558ca] active:shadow-none active:translate-y-[4px]",
    outline:
      "bg-transparent border-2 border-slate-200 hover:bg-slate-50 text-slate-600 active:translate-y-[2px]",
  }

  const variantClass = variantStyles[variant] ?? variantStyles.primary
  const inlineStyles = variant === "blue" || variant === "primary" ? { background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)" } : undefined
  const { style: propsStyle, ...restProps } = props
  const mergedStyle =
    inlineStyles || propsStyle ? { ...inlineStyles, ...(propsStyle as React.CSSProperties) } : undefined
  return (
    <button
      className={`${baseStyles} ${variantClass} py-3 md:py-5 px-4 md:px-8 text-sm md:text-lg lg:text-xl ${className}`}
      style={mergedStyle}
      disabled={disabled || isLoading}
      {...restProps}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
