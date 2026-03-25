export interface Tema1Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema1Subtema {
  title: string
  lessons: Tema1Lesson[]
}

export const TEMA1_TITLE = "El Tablero del Juego (Mentalidad)"

export const TEMA1_SUBTEMAS: Tema1Subtema[] = [
  {
    title: "Percepción Analítica",
    lessons: [
      { title: "¿Qué es el dinero? (Deuda vs. Energía)", slug: "que-es-el-dinero-deuda-vs-energia", level: "Básico" },
      { title: "El valor de tu tiempo (Cálculo real)", slug: "el-valor-de-tu-tiempo-calculo-real", level: "Básico" },
      { title: "Costo de Oportunidad: Elegir es renunciar", slug: "costo-de-oportunidad-elegir-es-renunciar", level: "Intermedio" },
      { title: "Tu 'Número de Libertad' Inicial", slug: "tu-numero-de-libertad-inicial", level: "Intermedio" },
      { title: "Las reglas del Sistema Financiero", slug: "las-reglas-del-sistema-financiero", level: "Avanzado" },
    ]
  },
  {
    title: "Sesgos y Decisiones",
    lessons: [
      { title: "Sesgo de Comparación: El costo de 'quedar bien'", slug: "sesgo-de-comparacion-el-costo-de-quedar-bien", level: "Básico" },
      { title: "Sesgo de Confirmación en el consumo", slug: "sesgo-de-confirmacion-en-el-consumo", level: "Básico" },
      { title: "Aversión a la pérdida vs. Miedo a crecer", slug: "aversion-a-la-perdida-vs-miedo-a-crecer", level: "Intermedio" },
      { title: "El Efecto Dunning-Kruger en tus finanzas", slug: "el-efecto-dunning-kruger-en-tus-finanzas", level: "Intermedio" },
      { title: "Caso Real: Placer de hoy vs. Libertad de mañana", slug: "caso-real-placer-de-hoy-vs-libertad-de-manana", level: "Avanzado" },
    ]
  },
  {
    title: "Rutinas de Control",
    lessons: [
      { title: "La Pausa de las 24 Horas (Mecánica)", slug: "la-pausa-de-las-24-horas-mecanica", level: "Básico" },
      { title: "El Registro de Guerra: Por qué trackear todo", slug: "el-registro-de-guerra-por-que-trackear-todo", level: "Básico" },
      { title: "Micro-hábitos de ahorro automatizado", slug: "micro-habitos-de-ahorro-automatizado", level: "Intermedio" },
      { title: "El Ritual del Domingo (Revisión semanal)", slug: "el-ritual-del-domingo-revision-semanal", level: "Intermedio" },
      { title: "Tu primer Estado de Resultados Personal", slug: "tu-primer-estado-de-resultados-personal", level: "Avanzado" },
    ]
  },
]
