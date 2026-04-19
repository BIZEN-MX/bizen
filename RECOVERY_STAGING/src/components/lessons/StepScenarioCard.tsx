"use client"

import React from "react"
import { motion } from "framer-motion"
import { BookOpen, Lightbulb, User, AlertCircle } from "lucide-react"
import { InlineSegments, parseInlineSegments } from "./SmartText"

interface StepScenarioCardProps {
  text: string
  variant?: "case" | "tip" | "context" | "warning"
}

const VARIANTS = {
  case: {
    bg: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)",
    border: "rgba(147,197,253,0.3)",
    textColor: "#fff",
    labelColor: "rgba(255,255,255,0.7)",
    labelText: "Caso",
    iconBg: "rgba(255,255,255,0.15)",
    iconColor: "#fff",
    Icon: User,
    shadow: "0 8px 32px rgba(37,99,235,0.3)",
  },
  tip: {
    bg: "linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)",
    border: "rgba(253,230,138,0.3)",
    textColor: "#fff",
    labelColor: "rgba(255,255,255,0.7)",
    labelText: "Dato clave",
    iconBg: "rgba(255,255,255,0.15)",
    iconColor: "#fff",
    Icon: Lightbulb,
    shadow: "0 8px 32px rgba(180,83,9,0.3)",
  },
  context: {
    bg: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #6366f1 100%)",
    border: "rgba(199,210,254,0.3)",
    textColor: "#fff",
    labelColor: "rgba(255,255,255,0.7)",
    labelText: "Contexto",
    iconBg: "rgba(255,255,255,0.15)",
    iconColor: "#fff",
    Icon: BookOpen,
    shadow: "0 8px 32px rgba(67,56,202,0.3)",
  },
  warning: {
    bg: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 60%, #991b1b 100%)",
    border: "rgba(248,113,113,0.4)",
    textColor: "#ffffff",
    labelColor: "#ffffff",
    labelText: "Alerta importante",
    iconBg: "rgba(255,255,255,0.2)",
    iconColor: "#fff",
    Icon: AlertCircle,
    shadow: "0 12px 40px rgba(127,29,29,0.4)",
  },
}

export function StepScenarioCard({ text, variant = "case" }: StepScenarioCardProps) {
  const v = VARIANTS[variant]
  const { Icon } = v

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: v.bg,
        borderRadius: 20,
        border: `1.5px solid ${v.border}`,
        boxShadow: v.shadow,
        padding: "clamp(16px, 3.5vw, 22px)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: -20,
        left: -20,
        width: 70,
        height: 70,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
        pointerEvents: "none",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: v.labelColor,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {v.labelText}
        </span>
      </div>

      {/* Text */}
      <p style={{
        fontSize: "clamp(15px, 2vw, 17px)",
        fontWeight: 500,
        color: v.textColor,
        lineHeight: 1.55,
        margin: 0,
        position: "relative",
      }}>
        <InlineSegments segments={parseInlineSegments(text)} />
      </p>
    </motion.div>
  )
}
