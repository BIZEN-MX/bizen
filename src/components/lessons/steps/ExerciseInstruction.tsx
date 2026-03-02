"use client"

import React from "react"
import { Lightbulb, HelpCircle, CheckSquare, List, Layers, MoveHorizontal, PenLine } from "lucide-react"

type ExerciseType = "info" | "mcq" | "true_false" | "multi_select" | "order" | "match" | "fill_blanks" | "image_choice"

const config: Record<ExerciseType, { label: string; color: string; bg: string; border: string; Icon: React.ElementType }> = {
  info: { label: "Nueva lección", color: "#0F62FE", bg: "#EFF6FF", border: "#BFDBFE", Icon: Lightbulb },
  mcq: { label: "Selecciona la respuesta correcta", color: "#0F62FE", bg: "#EFF6FF", border: "#BFDBFE", Icon: HelpCircle },
  true_false: { label: "¿Verdadero o falso?", color: "#0F62FE", bg: "#EFF6FF", border: "#BFDBFE", Icon: CheckSquare },
  multi_select: { label: "Selecciona todas las correctas", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", Icon: List },
  order: { label: "Ordena los elementos", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", Icon: Layers },
  match: { label: "Une los pares", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", Icon: MoveHorizontal },
  fill_blanks: { label: "Completa el espacio", color: "#DB2777", bg: "#FDF2F8", border: "#FBCFE8", Icon: PenLine },
  image_choice: { label: "Elige la imagen correcta", color: "#0F62FE", bg: "#EFF6FF", border: "#BFDBFE", Icon: HelpCircle },
}

interface ExerciseInstructionProps {
  type: ExerciseType
}

export function ExerciseInstruction({ type }: ExerciseInstructionProps) {
  const { label, color, bg, border, Icon } = config[type] ?? config.info

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
        fontWeight: 800,
        color,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "'Montserrat', sans-serif",
      }}>
        {label}
      </span>
    </div>
  )
}
