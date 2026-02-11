export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema1Lesson {
  title: string
  level: LessonLevel
  /** slug for URL, e.g. "que-es-el-dinero-para-mi-hoy" */
  slug: string
}

export interface Tema1Subtema {
  title: string
  lessons: Tema1Lesson[]
}

export const TEMA1_TITLE = "Mi relación con el dinero"

export const TEMA1_SUBTEMAS: Tema1Subtema[] = [
  {
    title: "¿Qué significa el dinero para mí?",
    lessons: [
      { title: "¿Qué es el dinero para mí hoy?", level: "Básico", slug: "que-es-el-dinero-para-mi-hoy" },
      { title: "¿Cómo me hace sentir el dinero?", level: "Básico", slug: "como-me-hace-sentir-el-dinero" },
      { title: "Lo que creo que el dinero dice de mí", level: "Básico", slug: "dinero-y-autoestima" },
      { title: "Expectativas vs realidad financiera", level: "Intermedio", slug: "expectativas-vs-realidad-financiera" },
      { title: "Responsabilidad personal con el dinero", level: "Intermedio", slug: "responsabilidad-personal-con-el-dinero" },
    ],
  },
  {
    title: "Mi historia con el dinero",
    lessons: [
      { title: "Mis primeros recuerdos con el dinero", level: "Básico", slug: "mis-primeros-recuerdos-con-el-dinero" },
      { title: "¿Cómo se hablaba del dinero en mi casa?", level: "Básico", slug: "como-se-hablaba-del-dinero-en-mi-casa" },
      { title: "Ejemplos financieros que vi al crecer", level: "Intermedio", slug: "ejemplos-financieros-que-vi-al-crecer" },
      { title: "Errores que normalicé sobre el dinero", level: "Intermedio", slug: "errores-que-normalice-sobre-el-dinero" },
      { title: "¿Qué quiero repetir y qué no?", level: "Intermedio", slug: "que-quiero-repetir-y-que-no" },
    ],
  },
  {
    title: "Creencias y emociones",
    lessons: [
      { title: "Creencias limitantes sobre el dinero", level: "Básico", slug: "creencias-limitantes-sobre-el-dinero" },
      { title: "Miedo a perder dinero", level: "Intermedio", slug: "miedo-a-perder-dinero" },
      { title: "Culpa al gastar", level: "Intermedio", slug: "culpa-al-gastar" },
      { title: "Ansiedad financiera", level: "Intermedio", slug: "ansiedad-financiera" },
      { title: "Separar emoción de decisión", level: "Avanzado", slug: "separar-emocion-de-decision" },
    ],
  },
  {
    title: "¿Cómo actúo con el dinero?",
    lessons: [
      { title: "¿Cómo tomo decisiones al gastar?", level: "Básico", slug: "como-tomo-decisiones-al-gastar" },
      { title: "Impulso vs decisión consciente", level: "Intermedio", slug: "impulso-vs-decision-consciente" },
      { title: "Comparación social y consumo", level: "Intermedio", slug: "comparacion-social-y-consumo" },
      { title: "Patrones financieros que repito", level: "Intermedio", slug: "patrones-financieros-que-repito" },
      { title: "Identificar mis detonantes financieros", level: "Avanzado", slug: "identificar-mis-detonantes-financieros" },
    ],
  },
  {
    title: "Tomar control",
    lessons: [
      { title: "Dejar de culpar factores externos", level: "Intermedio", slug: "dejar-de-culpar-factores-externos" },
      { title: "Responsabilidad financiera personal", level: "Intermedio", slug: "responsabilidad-financiera-personal" },
      { title: "Decidir cambiar mi relación con el dinero", level: "Avanzado", slug: "decidir-cambiar-mi-relacion-con-el-dinero" },
      { title: "Checkpoint: Mi relación con el dinero", level: "Avanzado", slug: "checkpoint-mi-relacion-con-el-dinero" },
    ],
  },
]
