"use client"

import React from "react"

interface StickyFooterProps {
  children: React.ReactNode
  className?: string
}

/**
 * Sticky footer that stays at the bottom on all devices
 * - Supports safe-area insets for iPhone notch
 * - Centered container with max-width on desktop
 * - Full width button that's maxed on desktop
 */
export function StickyFooter({ children, className = "" }: StickyFooterProps) {
  return (
    <footer
      className={`lesson-sticky-footer flex-shrink-0 w-full bg-slate-100 border-t-2 border-slate-300 z-10 mt-auto ${className}`}
      style={{ paddingTop: 16, paddingBottom: "max(16px, env(safe-area-inset-bottom))", paddingLeft: 20, paddingRight: 20 }}
    >
      <div className="w-full">
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
 * - Mobile: py-3 text-base
 * - Desktop: py-4 text-lg
 * - Full width but maxed at max-w-md
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
      className={`${baseStyles} ${variantClass} py-4 md:py-5 text-base md:text-lg lg:text-xl ${className}`}
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

