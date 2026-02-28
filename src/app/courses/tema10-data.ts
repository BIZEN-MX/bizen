export interface Tema10Lesson {
  title: string
  slug: string
}

export interface Tema10Subtema {
  title: string
  lessons: Tema10Lesson[]
}

export const TEMA10_SUBTEMAS: Tema10Subtema[] = [
  {
    title: "¿Qué es invertir?",
    lessons: [
      { title: "¿Qué es invertir?", slug: "que-es-invertir" },
      { title: "¿Por qué invertir?", slug: "por-que-invertir" },
      { title: "Diferencia entre ahorrar e invertir", slug: "diferencia-entre-ahorrar-e-invertir" },
      { title: "Mitos sobre la inversión", slug: "mitos-sobre-la-inversion" },
      { title: "Cambiar la forma de ver la inversión", slug: "cambiar-la-forma-de-ver-la-inversion" },
    ],
  },
  {
    title: "Riesgo y rendimiento",
    lessons: [
      { title: "¿Qué es el riesgo?", slug: "que-es-el-riesgo" },
      { title: "Riesgo vs rendimiento", slug: "riesgo-vs-rendimiento" },
      { title: "No existe inversión sin riesgo", slug: "no-existe-inversion-sin-riesgo" },
      { title: "Riesgos que sí puedo controlar", slug: "riesgos-que-si-puedo-controlar" },
    ],
  },
  {
    title: "Mentalidad del inversionista",
    lessons: [
      { title: "Pensar a largo plazo", slug: "pensar-a-largo-plazo" },
      { title: "Manejar el miedo a perder", slug: "manejar-el-miedo-a-perder" },
      { title: "Evitar decisiones impulsivas", slug: "evitar-decisiones-impulsivas" },
      { title: "Paciencia y constancia al invertir", slug: "paciencia-y-constancia-al-invertir" },
    ],
  },
  {
    title: "Empezar a invertir",
    lessons: [
      { title: "¿Cuándo es buen momento para invertir?", slug: "cuando-es-buen-momento-para-invertir" },
      { title: "Invertir con poco dinero", slug: "invertir-con-poco-dinero" },
      { title: "Errores comunes al empezar", slug: "errores-comunes-al-empezar" },
      { title: "Aprender antes de arriesgar", slug: "aprender-antes-de-arriesgar" },
    ],
  },
  {
    title: "Tipos generales de inversión",
    lessons: [
      { title: "Inversión conservadora", slug: "inversion-conservadora" },
      { title: "Inversión moderada", slug: "inversion-moderada" },
      { title: "Inversión agresiva", slug: "inversion-agresiva" },
      { title: "Diversificación básica", slug: "diversificacion-basica" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "La inversión como proceso", slug: "la-inversion-como-proceso" },
      { title: "Prepararme para los instrumentos", slug: "prepararme-para-los-instrumentos" },
      { title: "Checkpoint: Mi mentalidad para invertir", slug: "checkpoint-mi-mentalidad-para-invertir" },
    ],
  },
]
