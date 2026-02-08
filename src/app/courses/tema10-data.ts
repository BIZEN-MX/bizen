export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema10Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema10Subtema {
  title: string
  lessons: Tema10Lesson[]
}

export const TEMA10_SUBTEMAS: Tema10Subtema[] = [
  {
    title: "Qué es invertir",
    lessons: [
      { title: "Qué es invertir", level: "Básico", slug: "que-es-invertir" },
      { title: "Por qué invertir", level: "Básico", slug: "por-que-invertir" },
      { title: "Diferencia entre ahorrar e invertir", level: "Básico", slug: "diferencia-entre-ahorrar-e-invertir" },
      { title: "Mitos sobre la inversión", level: "Básico", slug: "mitos-sobre-la-inversion" },
      { title: "Cambiar la forma de ver la inversión", level: "Intermedio", slug: "cambiar-la-forma-de-ver-la-inversion" },
    ],
  },
  {
    title: "Riesgo y rendimiento",
    lessons: [
      { title: "Qué es el riesgo", level: "Básico", slug: "que-es-el-riesgo" },
      { title: "Riesgo vs rendimiento", level: "Básico", slug: "riesgo-vs-rendimiento" },
      { title: "No existe inversión sin riesgo", level: "Intermedio", slug: "no-existe-inversion-sin-riesgo" },
      { title: "Riesgos que sí puedo controlar", level: "Intermedio", slug: "riesgos-que-si-puedo-controlar" },
    ],
  },
  {
    title: "Mentalidad del inversionista",
    lessons: [
      { title: "Pensar a largo plazo", level: "Intermedio", slug: "pensar-a-largo-plazo" },
      { title: "Manejar el miedo a perder", level: "Intermedio", slug: "manejar-el-miedo-a-perder" },
      { title: "Evitar decisiones impulsivas", level: "Intermedio", slug: "evitar-decisiones-impulsivas" },
      { title: "Paciencia y constancia al invertir", level: "Avanzado", slug: "paciencia-y-constancia-al-invertir" },
    ],
  },
  {
    title: "Empezar a invertir",
    lessons: [
      { title: "Cuándo es buen momento para invertir", level: "Intermedio", slug: "cuando-es-buen-momento-para-invertir" },
      { title: "Invertir con poco dinero", level: "Intermedio", slug: "invertir-con-poco-dinero" },
      { title: "Errores comunes al empezar", level: "Avanzado", slug: "errores-comunes-al-empezar" },
      { title: "Aprender antes de arriesgar", level: "Avanzado", slug: "aprender-antes-de-arriesgar" },
    ],
  },
  {
    title: "Tipos generales de inversión",
    lessons: [
      { title: "Inversión conservadora", level: "Básico", slug: "inversion-conservadora" },
      { title: "Inversión moderada", level: "Básico", slug: "inversion-moderada" },
      { title: "Inversión agresiva", level: "Intermedio", slug: "inversion-agresiva" },
      { title: "Diversificación básica", level: "Intermedio", slug: "diversificacion-basica" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "La inversión como proceso", level: "Intermedio", slug: "la-inversion-como-proceso" },
      { title: "Prepararme para los instrumentos", level: "Intermedio", slug: "prepararme-para-los-instrumentos" },
      { title: "Checkpoint: Mi mentalidad para invertir", level: "Avanzado", slug: "checkpoint-mi-mentalidad-para-invertir" },
    ],
  },
]
