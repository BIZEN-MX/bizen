"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface StickyFooterProps {
  children: React.ReactNode
  /** Whether to use fixed positioning or stay in flex flow. Default true. */
  fixed?: boolean
  /** Feedback state for Duolingo-style colored footer */
  feedbackColor?: "correct" | "incorrect" | null
  /** Feedback title (e.g., "¡Correcto!") */
  feedbackTitle?: string
  /** Feedback body text */
  feedbackBody?: string
  /** Make footer transparent and adapt for dark mode */
  isDark?: boolean
}

/**
 * Sticky footer — Duolingo style:
 * - Pure white background normally
 * - Colored when feedback (correct=blue, incorrect=red)
 * - Shows feedback message inside the footer area on the left of buttons
 */
export function StickyFooter({
  children,
  fixed = true,
  feedbackColor,
  feedbackTitle,
  feedbackBody,
  isDark = false,
}: StickyFooterProps) {
  const isCorrect = feedbackColor === "correct"
  const isIncorrect = feedbackColor === "incorrect"

  const bg = isDark ? "transparent" : isCorrect
    ? "#EFF6FF"
    : isIncorrect
      ? "#FEF2F2"
      : "#FFFFFF"

  const borderColor = isDark ? "transparent" : isCorrect
    ? "#93C5FD"
    : isIncorrect
      ? "#FECACA"
      : "#F1F5F9"

  return (
    <footer
      style={{
        position: fixed ? "fixed" : "relative",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 9999,
        background: bg,
        borderTop: `2px solid ${borderColor}`,
        paddingTop: "clamp(12px, 2vw, 20px)",
        paddingBottom: `max(clamp(12px, 2vw, 20px), env(safe-area-inset-bottom))`,
        paddingLeft: "clamp(16px, 4vw, 48px)",
        paddingRight: "clamp(16px, 4vw, 48px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "background 0.25s ease, border-color 0.25s ease",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 980, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Feedback Message (Duolingo style) */}
        <AnimatePresence>
          {feedbackColor && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: isCorrect ? "#0F62FE" : "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 500,
                fontSize: 20,
                flexShrink: 0,
              }}>
                {isCorrect ? "✓" : "!"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: 0,
                  fontWeight: 500,
                  fontSize: "clamp(17px, 2vw, 20px)",
                  color: isCorrect ? "#1D4ED8" : "#DC2626",
                }}>
                  {feedbackTitle}
                </p>
                {feedbackBody && (
                  <p style={{
                    margin: 0,
                    fontSize: 14,
                    color: isCorrect ? "#3B82F6" : "#EF4444",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}>
                    {feedbackBody}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          {children}
        </div>
      </div>
    </footer>
  )
}

interface StickyFooterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "danger" | "blue" | "outline" | "white"
  isLoading?: boolean
}

/**
 * 3D Button pillar - exactly like Duolingo footer buttons
 */
export function StickyFooterButton({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  style,
  ...props
}: StickyFooterButtonProps) {
  const BIZEN_BLUE = "#0F62FE"
  const BIZEN_BLUE_DARK = "#0849C9"

  const variantMap: Record<string, React.CSSProperties> = {
    primary: {
      background: BIZEN_BLUE,
      color: "#FFFFFF",
      boxShadow: `0 3px 0 0 ${BIZEN_BLUE_DARK}`,
    },
    blue: {
      background: BIZEN_BLUE,
      color: "#FFFFFF",
      boxShadow: `0 3px 0 0 ${BIZEN_BLUE_DARK}`,
    },
    secondary: {
      background: "#FFFFFF",
      color: "#4B5563",
      border: "2.5px solid #E5E7EB",
      boxShadow: "0 3px 0 0 #E5E7EB",
    },
    white: {
      background: "#FFFFFF",
      color: "#4B5563",
      border: "2.5px solid #E5E7EB",
      boxShadow: "0 3px 0 0 #E5E7EB",
    },
    outline: {
      background: "transparent",
      color: "#6B7280",
      border: "2px solid rgba(0,0,0,0.1)",
      boxShadow: "none",
    },
    success: {
      background: BIZEN_BLUE,
      color: "#FFFFFF",
      boxShadow: `0 3px 0 0 ${BIZEN_BLUE_DARK}`,
    },
    danger: {
      background: "#EF4444",
      color: "#FFFFFF",
      boxShadow: "0 3px 0 0 #B91C1C",
    },
  }

  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    fontWeight: 500,
    fontSize: "clamp(14px, 1.5vw, 16px)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.4 : 1,
    padding: "10px 24px",
    transition: "all 0.1s ease",
    outline: "none",
    position: "relative",
    top: 0,
    border: "none",
    ...variantMap[variant],
    ...style,
  }

  return (
    <button
      style={baseStyle}
      disabled={disabled || isLoading}
      onMouseDown={(e) => {
        if (disabled || isLoading) return
        const el = e.currentTarget
        el.style.transform = "translateY(2px)"
        el.style.boxShadow = variantMap[variant]?.boxShadow
          ? variantMap[variant].boxShadow!.toString().replace(/[0-9]+px/, "0px")
          : "none"
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget
        el.style.transform = ""
        el.style.boxShadow = (variantMap[variant]?.boxShadow || "none") as string
      }}
      onMouseEnter={(e) => {
        if (disabled || isLoading) return
        e.currentTarget.style.opacity = "0.85"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = ""
        el.style.boxShadow = (variantMap[variant]?.boxShadow || "none") as string
        if (!disabled && !isLoading) {
          el.style.opacity = "1"
        }
      }}
      {...props}
    >
      {isLoading ? "..." : children}
    </button>
  )
}
