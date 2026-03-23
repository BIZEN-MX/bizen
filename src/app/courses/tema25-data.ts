export interface Tema25Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema25Subtema {
  title: string
  lessons: Tema25Lesson[]
}

export const TEMA25_TITLE = "Riesgo financiero"

export const TEMA25_SUBTEMAS: Tema25Subtema[] = [
  {
    title: "Tipos de riesgo",
    lessons: [
      { title: "Riesgo de mercado (concepto simple)", slug: "riesgo-de-mercado-concepto-simple", level: "Básico" },
      { title: "Riesgo personal (deuda, ingresos, emergencias)", slug: "riesgo-personal-deuda-ingresos-emergencias", level: "Básico" },
      { title: "Riesgo de liquidez (no poder sacar dinero)", slug: "riesgo-de-liquidez-no-poder-sacar-dinero", level: "Intermedio" },
      { title: "Riesgo de estafa (seguridad)", slug: "riesgo-de-estafa-seguridad", level: "Intermedio" },
      { title: "Mini práctica: identificar riesgos en escenarios", slug: "mini-practica-identificar-riesgos-en-escenarios", level: "Avanzado" },
    ]
  },
  {
    title: "Perfil y tolerancia",
    lessons: [
      { title: "Perfil conservador/moderado/agresivo", slug: "perfil-conservadormoderadoagresivo", level: "Básico" },
      { title: "¿Qué pasa cuando tu perfil no coincide con tu inversión?", slug: "que-pasa-cuando-tu-perfil-no-coincide-con-tu-inversion", level: "Básico" },
      { title: "Riesgo vs recompensa (sin fórmula)", slug: "riesgo-vs-recompensa-sin-formula", level: "Intermedio" },
      { title: "Pérdidas: cómo se ven y cómo se manejan", slug: "perdidas-como-se-ven-y-como-se-manejan", level: "Intermedio" },
      { title: "Caso: elegir inversión según perfil", slug: "caso-elegir-inversion-segun-perfil", level: "Avanzado" },
    ]
  },
  {
    title: "Control del riesgo",
    lessons: [
      { title: "Riesgos que sí controlas (hábitos)", slug: "riesgos-que-si-controlas-habitos", level: "Básico" },
      { title: "Diversificación como control (idea)", slug: "diversificacion-como-control-idea", level: "Básico" },
      { title: "Evitar decisiones impulsivas (regla)", slug: "evitar-decisiones-impulsivas-regla", level: "Intermedio" },
      { title: "No apostar todo a una sola jugada", slug: "no-apostar-todo-a-una-sola-jugada", level: "Intermedio" },
      { title: "Checkpoint: mi regla personal de riesgo", slug: "checkpoint-mi-regla-personal-de-riesgo", level: "Avanzado" },
    ]
  },
]
