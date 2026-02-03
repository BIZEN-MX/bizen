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
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pointer-events-none ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-2xl mx-auto p-4 md:p-6 pointer-events-auto">
        {children}
      </div>
    </footer>
  )
}

interface StickyFooterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "danger"
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
    "w-full max-w-md mx-auto block rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white"

  const variantStyles = {
    primary:
      "bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-500 shadow-lg hover:shadow-xl text-xl md:text-2xl",
    secondary:
      "bg-slate-200 hover:bg-slate-300 text-slate-900 focus:ring-slate-400",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-lg hover:shadow-xl text-xl md:text-2xl",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} py-3 md:py-4 text-base md:text-lg lg:text-xl ${className}`}
      disabled={disabled || isLoading}
      {...props}
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

