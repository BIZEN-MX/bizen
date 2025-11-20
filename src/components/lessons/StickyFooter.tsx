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
      className={`fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50 pointer-events-none ${className}`}
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
    "w-full max-w-md mx-auto block rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"

  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
    secondary:
      "bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white focus:ring-slate-500",
    success:
      "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white focus:ring-green-500 shadow-lg hover:shadow-xl",
    danger:
      "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} py-3 md:py-4 text-base md:text-lg ${className}`}
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

