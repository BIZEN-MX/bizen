"use client"

import React from "react"

/** Brief "what to do" for each exercise type. Language: Spanish (content). */
const INSTRUCTIONS: Record<string, string> = {
  mcq: "Elige una opción.",
  trueFalse: "Indica si es verdadero o falso.",
  order: "Ordena los elementos de arriba a abajo.",
  match: "Relaciona cada elemento de la izquierda con uno de la derecha.",
}

const STYLE: React.CSSProperties = {
  fontSize: "clamp(12px, 1.5vw, 14px)",
  color: "#0B71FE",
  marginBottom: 12,
  marginTop: 0,
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}

export type ExerciseInstructionType = keyof typeof INSTRUCTIONS

interface ExerciseInstructionProps {
  type: ExerciseInstructionType
  style?: React.CSSProperties
}

export function ExerciseInstruction({ type, style: styleOverride }: ExerciseInstructionProps) {
  const text = INSTRUCTIONS[type] ?? "Completa la actividad."
  return (
    <p style={{ ...STYLE, ...styleOverride }} aria-live="polite">
      {text}
    </p>
  )
}
