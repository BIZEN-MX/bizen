export interface Tema1Lesson {
  title: string
  /** slug for URL, e.g. "que-es-el-dinero-para-mi-hoy" */
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
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
      { title: "¿Qué es el dinero para mí hoy?", slug: "que-es-el-dinero-para-mi-hoy", level: "Básico" },
      { title: "¿Cómo me hace sentir el dinero?", slug: "como-me-hace-sentir-el-dinero", level: "Básico" },
      { title: "Lo que creo que el dinero dice de mí", slug: "dinero-y-autoestima", level: "Básico" },
      { title: "Mis primeras creencias sobre el dinero", slug: "mis-primeras-creencias-sobre-el-dinero", level: "Intermedio" },
      { title: "Expectativas vs realidad financiera", slug: "expectativas-vs-realidad-financiera", level: "Intermedio" },
      { title: "Paciencia financiera y mentalidad a largo plazo", slug: "paciencia-financiera-y-mentalidad-a-largo-plazo", level: "Intermedio" },
      { title: "Responsabilidad personal con el dinero", slug: "responsabilidad-personal-con-el-dinero", level: "Avanzado" },
    ],
  },
  {
    title: "Mi historia con el dinero",
    lessons: [
      { title: "Mis primeros recuerdos con el dinero", slug: "mis-primeros-recuerdos-con-el-dinero", level: "Básico" },
      { title: "¿Cómo se hablaba del dinero en mi casa?", slug: "como-se-hablaba-del-dinero-en-mi-casa", level: "Básico" },
      { title: "Ejemplos financieros que vi al crecer", slug: "ejemplos-financieros-que-vi-al-crecer", level: "Intermedio" },
      { title: "Errores que normalicé sobre el dinero", slug: "errores-que-normalice-sobre-el-dinero", level: "Intermedio" },
      { title: "¿Qué quiero repetir y qué no?", slug: "que-quiero-repetir-y-que-no", level: "Avanzado" },
    ],
  },
  {
    title: "Creencias y emociones",
    lessons: [
      { title: "Creencias limitantes sobre el dinero", slug: "creencias-limitantes-sobre-el-dinero", level: "Básico" },
      { title: "Miedo a perder dinero", slug: "miedo-a-perder-dinero", level: "Intermedio" },
      { title: "Culpa al gastar", slug: "culpa-al-gastar", level: "Intermedio" },
      { title: "Ansiedad financiera", slug: "ansiedad-financiera", level: "Intermedio" },
      { title: "Separar emoción de decisión", slug: "separar-emocion-de-decision", level: "Avanzado" },
    ],
  },
  {
    title: "¿Cómo actúo con el dinero?",
    lessons: [
      { title: "¿Cómo tomo decisiones al gastar?", slug: "como-tomo-decisiones-al-gastar", level: "Básico" },
      { title: "Impulso vs decisión consciente", slug: "impulso-vs-decision-consciente", level: "Intermedio" },
      { title: "Comparación social y consumo", slug: "comparacion-social-y-consumo", level: "Intermedio" },
      { title: "Patrones financieros que repito", slug: "patrones-financieros-que-repito", level: "Avanzado" },
      { title: "Identificar mis detonantes financieros", slug: "identificar-mis-detonantes-financieros", level: "Avanzado" },
    ],
  },
  {
    title: "Tomar control",
    lessons: [
      { title: "Dejar de culpar factores externos", slug: "dejar-de-culpar-factores-externos", level: "Básico" },
      { title: "Responsabilidad financiera personal", slug: "responsabilidad-financiera-personal", level: "Básico" },
      { title: "Decidir cambiar mi relación con el dinero", slug: "decidir-cambiar-mi-relacion-con-el-dinero", level: "Intermedio" },
      { title: "Checkpoint: Mi relación con el dinero", slug: "checkpoint-mi-relacion-con-el-dinero", level: "Avanzado" },
    ],
  },
]
