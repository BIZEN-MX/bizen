export interface Tema1Lesson {
  title: string
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
      { title: "¿Qué es el dinero para mí hoy?", slug: "que-es-el-dinero-para-mi-hoy" },
      { title: "¿Cómo me hace sentir el dinero?", slug: "como-me-hace-sentir-el-dinero" },
      { title: "Lo que creo que el dinero dice de mí", slug: "dinero-y-autoestima" },
      { title: "Mis primeras creencias sobre el dinero", slug: "mis-primeras-creencias-sobre-el-dinero" },
      { title: "Expectativas vs realidad financiera", slug: "expectativas-vs-realidad-financiera" },
      { title: "Paciencia financiera y mentalidad a largo plazo", slug: "paciencia-financiera-y-mentalidad-a-largo-plazo" },
      { title: "Responsabilidad personal con el dinero", slug: "responsabilidad-personal-con-el-dinero" },
    ],
  },
  {
    title: "Mi historia con el dinero",
    lessons: [
      { title: "Mis primeros recuerdos con el dinero", slug: "mis-primeros-recuerdos-con-el-dinero" },
      { title: "¿Cómo se hablaba del dinero en mi casa?", slug: "como-se-hablaba-del-dinero-en-mi-casa" },
      { title: "Ejemplos financieros que vi al crecer", slug: "ejemplos-financieros-que-vi-al-crecer" },
      { title: "Errores que normalicé sobre el dinero", slug: "errores-que-normalice-sobre-el-dinero" },
      { title: "¿Qué quiero repetir y qué no?", slug: "que-quiero-repetir-y-que-no" },
    ],
  },
  {
    title: "Creencias y emociones",
    lessons: [
      { title: "Creencias limitantes sobre el dinero", slug: "creencias-limitantes-sobre-el-dinero" },
      { title: "Miedo a perder dinero", slug: "miedo-a-perder-dinero" },
      { title: "Culpa al gastar", slug: "culpa-al-gastar" },
      { title: "Ansiedad financiera", slug: "ansiedad-financiera" },
      { title: "Separar emoción de decisión", slug: "separar-emocion-de-decision" },
    ],
  },
  {
    title: "¿Cómo actúo con el dinero?",
    lessons: [
      { title: "¿Cómo tomo decisiones al gastar?", slug: "como-tomo-decisiones-al-gastar" },
      { title: "Impulso vs decisión consciente", slug: "impulso-vs-decision-consciente" },
      { title: "Comparación social y consumo", slug: "comparacion-social-y-consumo" },
      { title: "Patrones financieros que repito", slug: "patrones-financieros-que-repito" },
      { title: "Identificar mis detonantes financieros", slug: "identificar-mis-detonantes-financieros" },
    ],
  },
  {
    title: "Tomar control",
    lessons: [
      { title: "Dejar de culpar factores externos", slug: "dejar-de-culpar-factores-externos" },
      { title: "Responsabilidad financiera personal", slug: "responsabilidad-financiera-personal" },
      { title: "Decidir cambiar mi relación con el dinero", slug: "decidir-cambiar-mi-relacion-con-el-dinero" },
      { title: "Checkpoint: Mi relación con el dinero", slug: "checkpoint-mi-relacion-con-el-dinero" },
    ],
  },
]
