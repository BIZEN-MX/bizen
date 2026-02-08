export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema12Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema12Subtema {
  title: string
  lessons: Tema12Lesson[]
}

export const TEMA12_SUBTEMAS: Tema12Subtema[] = [
  {
    title: "Emociones al invertir",
    lessons: [
      { title: "Emociones y dinero invertido", level: "Básico", slug: "emociones-y-dinero-invertido" },
      { title: "Miedo a perder", level: "Básico", slug: "miedo-a-perder" },
      { title: "Euforia y exceso de confianza", level: "Intermedio", slug: "euforia-y-exceso-de-confianza" },
      { title: "Estrés al ver pérdidas", level: "Intermedio", slug: "estres-al-ver-perdidas" },
    ],
  },
  {
    title: "Sesgos mentales",
    lessons: [
      { title: "Qué son los sesgos mentales", level: "Básico", slug: "que-son-los-sesgos-mentales" },
      { title: "Sesgo de confirmación", level: "Intermedio", slug: "sesgo-de-confirmacion" },
      { title: "Sesgo de aversión a la pérdida", level: "Intermedio", slug: "sesgo-de-aversion-a-la-perdida" },
      { title: "Seguir a la multitud", level: "Intermedio", slug: "seguir-a-la-multitud" },
      { title: "Reconocer mis sesgos", level: "Avanzado", slug: "reconocer-mis-sesgos" },
    ],
  },
  {
    title: "Comportamientos comunes",
    lessons: [
      { title: "Comprar caro y vender barato", level: "Intermedio", slug: "comprar-caro-y-vender-barato" },
      { title: "Reaccionar a noticias", level: "Intermedio", slug: "reaccionar-a-noticias" },
      { title: "Sobreoperar", level: "Avanzado", slug: "sobreoperar" },
      { title: "Falta de paciencia", level: "Avanzado", slug: "falta-de-paciencia" },
    ],
  },
  {
    title: "Manejar pérdidas",
    lessons: [
      { title: "Aceptar pérdidas", level: "Intermedio", slug: "aceptar-perdidas" },
      { title: "Diferencia entre pérdida temporal y real", level: "Intermedio", slug: "diferencia-entre-perdida-temporal-y-real" },
      { title: "Aprender de una mala inversión", level: "Avanzado", slug: "aprender-de-una-mala-inversion" },
      { title: "Controlar emociones en crisis", level: "Avanzado", slug: "controlar-emociones-en-crisis" },
    ],
  },
  {
    title: "Construir disciplina",
    lessons: [
      { title: "Disciplina al invertir", level: "Intermedio", slug: "disciplina-al-invertir" },
      { title: "Seguir un plan", level: "Intermedio", slug: "seguir-un-plan" },
      { title: "Constancia a largo plazo", level: "Avanzado", slug: "constancia-a-largo-plazo" },
      { title: "Evitar decisiones impulsivas", level: "Avanzado", slug: "evitar-decisiones-impulsivas" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "La mente como herramienta de inversión", level: "Intermedio", slug: "la-mente-como-herramienta-de-inversion" },
      { title: "Prepararme para construir patrimonio", level: "Intermedio", slug: "prepararme-para-construir-patrimonio" },
      { title: "Checkpoint: Mi psicología como inversionista", level: "Avanzado", slug: "checkpoint-mi-psicologia-como-inversionista" },
    ],
  },
]
