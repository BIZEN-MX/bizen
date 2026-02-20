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
      className={`lesson-sticky-footer ${fixed ? "fixed bottom-0 left-0 right-0" : "relative"} w-full bg-white border-t-2 border-slate-200 z-[100] ${className}`}
      style={{
        paddingTop: "clamp(12px, 2vw, 16px)",
        paddingBottom: "max(clamp(12px, 2vw, 16px), env(safe-area-inset-bottom))",
        paddingLeft: "clamp(12px, 3vw, 24px)",
        paddingRight: "clamp(12px, 3vw, 24px)",
        display: "flex",
        justifyContent: "center",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
        flexShrink: 0
      }}
    >
      <div className="w-full" style={{ maxWidth: 1600 }}>
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
      "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400 shadow-[0_4px_0_0_#15803d] active:shadow-none active:translate-y-[4px]",
    secondary:
      "bg-white border-2 border-indigo-400 hover:bg-indigo-50 text-slate-800 focus:ring-indigo-400 shadow-[0_4px_0_0_#818cf8] active:shadow-none active:translate-y-[4px]",
    success:
      "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400 shadow-[0_4px_0_0_#15803d] active:shadow-none active:translate-y-[4px]",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 shadow-[0_4px_0_0_#b91c1c] active:shadow-none active:translate-y-[4px]",
    blue:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400 shadow-[0_4px_0_0_#1e40af] active:shadow-none active:translate-y-[4px]",
    outline:
      "bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 focus:ring-slate-400 shadow-[0_4px_0_0_#1e293b] active:shadow-none active:translate-y-[4px]",
  }

  const variantClass = variantStyles[variant] ?? variantStyles.primary
  const inlineBg =
    variant === "danger"
      ? { backgroundColor: "#EF4444", color: "#fff" }
      : variant === "blue"
        ? { backgroundColor: "#2563eb", color: "#fff" }
        : variant === "outline"
          ? { backgroundColor: "#f1f5f9", color: "#2563eb", border: "3px solid #1e293b" }
          : undefined
  const { style: propsStyle, ...restProps } = props
  const mergedStyle =
    inlineBg || propsStyle ? { ...inlineBg, ...(propsStyle as React.CSSProperties) } : undefined
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
