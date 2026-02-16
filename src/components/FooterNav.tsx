"use client"

import React from "react"

export interface FooterNavProps {
  onSkip: () => void
  onContinue: () => void
  disabledContinue?: boolean
  skipLabel?: string
  continueLabel?: string
  /** When true, show "Great job!" + Report on the left instead of Skip (Duolingo-style). */
  showFeedback?: boolean
  /** Called when user taps Report. */
  onReport?: () => void
  reportLabel?: string
}

const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="16" cy="16" r="14" fill="#58CC02" />
    <path d="M9 16l5 5 9-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Lesson footer: left = feedback (Great job! + Report) or Skip; right = Continue.
 * Duolingo-style layout. Respects safe-area-inset-bottom.
 */
export function FooterNav({
  onSkip,
  onContinue,
  disabledContinue = false,
  skipLabel = "Skip",
  continueLabel = "Continue",
  showFeedback = false,
  onReport,
  reportLabel = "Report",
}: FooterNavProps) {
  return (
    <footer
      className="flex-shrink-0 w-full z-50 bg-white border-t-2 border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
      style={{
        paddingTop: "1.5rem",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
      role="navigation"
      aria-label="Lesson navigation"
    >
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Left: feedback (Great job! + Report) or Skip */}
        <div className="flex items-center gap-3 min-w-0">
          {showFeedback ? (
            <>
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10" aria-hidden>
                <CheckIcon />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                <h2 className="text-lg font-bold text-slate-900 truncate">Great job!</h2>
                {onReport && (
                  <button
                    type="button"
                    onClick={onReport}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 -ml-1 text-left"
                    aria-label={reportLabel}
                  >
                    {reportLabel}
                  </button>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="bg-white border-4 border-black rounded-full text-blue-600 font-medium px-8 sm:px-10 h-14 min-h-[56px] transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={skipLabel}
            >
              {skipLabel}
            </button>
          )}
        </div>

        {/* Right: Continue */}
        <button
          type="button"
          onClick={onContinue}
          disabled={disabledContinue}
          className="flex-shrink-0 bg-blue-600 text-white rounded-full font-medium px-8 sm:px-10 h-14 min-h-[56px] transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-blue-600"
          aria-label={continueLabel}
          data-test="player-next"
        >
          <span>{continueLabel}</span>
        </button>
      </div>
    </footer>
  )
}
