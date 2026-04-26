"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info" | "payday"

export type Toast = {
  id: string
  type: ToastType
  title: string
  message?: string
  amount?: number
  duration?: number
}

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: React.ElementType; iconColor: string; titleColor: string }> = {
  success: {
    bg: "linear-gradient(135deg, #064e3b, #065f46)",
    border: "rgba(16,185,129,0.4)",
    icon: CheckCircle2,
    iconColor: "#34d399",
    titleColor: "#a7f3d0"
  },
  error: {
    bg: "linear-gradient(135deg, #7f1d1d, #991b1b)",
    border: "rgba(239,68,68,0.4)",
    icon: XCircle,
    iconColor: "#f87171",
    titleColor: "#fca5a5"
  },
  warning: {
    bg: "linear-gradient(135deg, #78350f, #92400e)",
    border: "rgba(245,158,11,0.4)",
    icon: AlertTriangle,
    iconColor: "#fbbf24",
    titleColor: "#fcd34d"
  },
  info: {
    bg: "linear-gradient(135deg, #1e3a5f, #1e40af)",
    border: "rgba(59,130,246,0.4)",
    icon: Info,
    iconColor: "#60a5fa",
    titleColor: "#bfdbfe"
  },
  payday: {
    bg: "linear-gradient(135deg, #14532d, #166534)",
    border: "rgba(16,185,129,0.6)",
    icon: CheckCircle2,
    iconColor: "#4ade80",
    titleColor: "#bbf7d0"
  }
}

type GameToastProps = {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function GameToast({ toasts, onRemove }: GameToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 360,
        width: "calc(100vw - 40px)"
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type]
          const Icon = style.icon
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                backdropFilter: "blur(12px)"
              }}
            >
              {/* Icon */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon size={20} color={style.iconColor} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: style.titleColor, marginBottom: 2 }}>
                  {toast.title}
                </div>
                {toast.message && (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                    {toast.message}
                  </div>
                )}
                {toast.amount !== undefined && (
                  <div style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: toast.amount >= 0 ? "#4ade80" : "#f87171",
                    marginTop: 4,
                    letterSpacing: "-0.02em"
                  }}>
                    {toast.amount >= 0 ? "+" : ""}${Math.abs(toast.amount).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => onRemove(toast.id)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                <X size={14} color="rgba(255,255,255,0.5)" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Hook to manage toasts
export function useGameToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    const newToast: Toast = { id, duration: 4000, ...toast }
    setToasts(prev => [...prev, newToast])

    // Auto-remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, newToast.duration)

    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const success = (title: string, message?: string, amount?: number) =>
    addToast({ type: "success", title, message, amount })

  const error = (title: string, message?: string) =>
    addToast({ type: "error", title, message })

  const warning = (title: string, message?: string) =>
    addToast({ type: "warning", title, message })

  const info = (title: string, message?: string) =>
    addToast({ type: "info", title, message })

  const payday = (amount: number) =>
    addToast({ type: "payday", title: "💵 ¡Payday!", message: "Recibiste tu salario + ingresos pasivos", amount, duration: 5000 })

  return { toasts, addToast, removeToast, success, error, warning, info, payday }
}
