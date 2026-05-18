export interface Tema25Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema25Subtema {
  title: string
  lessons: Tema25Lesson[]
}

export const TEMA25_TITLE = "Riesgo Financiero"

export const TEMA25_SUBTEMAS: Tema25Subtema[] = [
  {
    title: "Tipos de riesgo",
    lessons: [
      { title: "¿Qué es el riesgo de mercado?", slug: "riesgo-de-mercado-concepto-simple", level: "Básico" },
      { title: "¿Qué es el riesgo personal?", slug: "riesgo-personal-deuda-ingresos-emergencias", level: "Básico" },
      { title: "¿Qué es el riesgo de liquidez?", slug: "riesgo-de-liquidez-no-poder-sacar-dinero", level: "Intermedio" },
      { title: "¿Cómo identificar el riesgo de estafa?", slug: "riesgo-de-estafa-seguridad", level: "Intermedio" },
      { title: "Práctica: ¿Cómo identificar riesgos en escenarios reales?", slug: "mini-practica-identificar-riesgos-en-escenarios", level: "Avanzado" },
    ]
  },
  {
    title: "Perfil y tolerancia",
    lessons: [
      { title: "¿Cuál es tu perfil de riesgo?", slug: "perfil-conservadormoderadoagresivo", level: "Básico" },
      { title: "¿Qué pasa si tu perfil no coincide con tu inversión?", slug: "que-pasa-cuando-tu-perfil-no-coincide-con-tu-inversion", level: "Básico" },
      { title: "¿Cuál es la relación entre riesgo y recompensa?", slug: "riesgo-vs-recompensa-sin-formula", level: "Intermedio" },
      { title: "¿Cómo manejar las pérdidas financieras?", slug: "perdidas-como-se-ven-y-como-se-manejan", level: "Intermedio" },
      { title: "Caso práctico: ¿Cómo elegir inversión según tu perfil?", slug: "caso-elegir-inversion-segun-perfil", level: "Avanzado" },
    ]
  },
  {
    title: "Control del riesgo",
    lessons: [
      { title: "¿Qué riesgos financieros sí puedes controlar?", slug: "riesgos-que-si-controlas-habitos", level: "Básico" },
      { title: "¿Cómo la diversificación ayuda a controlar el riesgo?", slug: "diversificacion-como-control-idea", level: "Básico" },
      { title: "¿Cómo evitar decisiones financieras impulsivas?", slug: "evitar-decisiones-impulsivas-regla", level: "Intermedio" },
      { title: "¿Por qué no debes apostar todo a una sola jugada?", slug: "no-apostar-todo-a-una-sola-jugada", level: "Intermedio" },
      { title: "Checkpoint: ¿Cuál es tu regla personal de riesgo?", slug: "checkpoint-mi-regla-personal-de-riesgo", level: "Avanzado" },
    ]
  },
]
