"use client"

import React from "react"
import { Lightbulb, HelpCircle, CheckSquare, List, Layers, MoveHorizontal, PenLine } from "lucide-react"

type ExerciseType = "info" | "mcq" | "true_false" | "multi_select" | "order" | "match" | "fill_blanks" | "image_choice"

const config: Record<ExerciseType, { label: string; color: string; bg: string; border: string; Icon: React.ElementType }> = {
  info: { label: "Nueva lección", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: Lightbulb },
  mcq: { label: "Selecciona la respuesta correcta", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: HelpCircle },
  true_false: { label: "¿Verdadero o falso?", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: CheckSquare },
  multi_select: { label: "Selecciona todas las correctas", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: List },
  order: { label: "Ordena los elementos", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: Layers },
  match: { label: "Une los pares", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: MoveHorizontal },
  fill_blanks: { label: "Completa el espacio", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: PenLine },
  image_choice: { label: "Elige la imagen correcta", color: "var(--primary)", bg: "var(--primary-subtle)", border: "transparent", Icon: HelpCircle },
}

interface ExerciseInstructionProps {
  type: ExerciseType
  isDark?: boolean
}

export function ExerciseInstruction({ type, isDark = false }: ExerciseInstructionProps) {
  const baseConfig = config[type] ?? config.info

  // Adjust colors for dark mode context
  const label = baseConfig.label
  const Icon = baseConfig.Icon
  const color = isDark ? "#60a5fa" : baseConfig.color
  const bg = isDark ? "rgba(59,130,246,0.15)" : baseConfig.bg
  const border = isDark ? "rgba(59,130,246,0.3)" : baseConfig.border

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: bg,
      border: `1.5px solid ${border}`,
      borderRadius: 999,
      padding: "5px 12px",
      marginBottom: 4,
    }}>
      <Icon size={14} color={color} strokeWidth={2.5} />
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
  )
}
