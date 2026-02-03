"use client"

import React from "react"

interface LessonContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Responsive container for lesson content.
 * Includes scoped CSS so all text inside lessons is forced to be large.
 */
export function LessonContainer({ children, className = "" }: LessonContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch min-h-0">
      <style>{`
        /* Force large text inside lessons - base size so all text is big */
        .lesson-content { font-size: 1.5rem !important; }
        @media (min-width: 768px) { .lesson-content { font-size: 1.75rem !important; } }
        @media (min-width: 1024px) { .lesson-content { font-size: 2rem !important; } }
        .lesson-content h2 { font-size: 1.4em !important; font-weight: 700 !important; }
        .lesson-content h3 { font-size: 1.25em !important; font-weight: 600 !important; }
        .lesson-content h4 { font-size: 1.1em !important; font-weight: 600 !important; }
        .lesson-content p, .lesson-content div { font-size: 1em !important; line-height: 1.5 !important; }
        .lesson-content button, .lesson-content button span { font-size: 1em !important; }
        .lesson-content input, .lesson-content select { font-size: 1em !important; }
      `}</style>
      <div className="min-h-full flex flex-col">
        <div className="flex-1 py-4 md:py-10 lg:py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto w-full">
            <div
              className={`lesson-content rounded-2xl bg-white shadow-sm border border-slate-200 p-6 md:p-10 lg:p-12 mb-24 md:mb-28 lg:mb-32 ${className}`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

