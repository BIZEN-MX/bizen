export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema11Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema11Subtema {
  title: string
  lessons: Tema11Lesson[]
}

export const TEMA11_SUBTEMAS: Tema11Subtema[] = [
  {
    title: "Conocer los instrumentos",
    lessons: [
      { title: "Qué es un instrumento de inversión", level: "Básico", slug: "que-es-un-instrumento-de-inversion" },
      { title: "Por qué existen distintos instrumentos", level: "Básico", slug: "por-que-existen-distintos-instrumentos" },
      { title: "Elegir instrumentos según mi perfil", level: "Intermedio", slug: "elegir-instrumentos-segun-mi-perfil" },
      { title: "Relación entre riesgo, tiempo y rendimiento", level: "Intermedio", slug: "relacion-entre-riesgo-tiempo-y-rendimiento" },
    ],
  },
  {
    title: "Renta fija",
    lessons: [
      { title: "Qué es la renta fija", level: "Básico", slug: "que-es-la-renta-fija" },
      { title: "Bonos explicados fácil", level: "Básico", slug: "bonos-explicados-facil" },
      { title: "Certificados y pagarés", level: "Básico", slug: "certificados-y-pagares" },
      { title: "Riesgos de la renta fija", level: "Intermedio", slug: "riesgos-de-la-renta-fija" },
      { title: "Cuándo conviene la renta fija", level: "Intermedio", slug: "cuando-conviene-la-renta-fija" },
    ],
  },
  {
    title: "Renta variable",
    lessons: [
      { title: "Qué es la renta variable", level: "Básico", slug: "que-es-la-renta-variable" },
      { title: "Acciones explicadas simple", level: "Básico", slug: "acciones-explicadas-simple" },
      { title: "Volatilidad en acciones", level: "Intermedio", slug: "volatilidad-en-acciones" },
      { title: "Riesgos de la renta variable", level: "Intermedio", slug: "riesgos-de-la-renta-variable" },
      { title: "Invertir a largo plazo en acciones", level: "Avanzado", slug: "invertir-a-largo-plazo-en-acciones" },
    ],
  },
  {
    title: "Fondos y ETFs",
    lessons: [
      { title: "Qué es un fondo de inversión", level: "Básico", slug: "que-es-un-fondo-de-inversion" },
      { title: "Qué es un ETF", level: "Básico", slug: "que-es-un-etf" },
      { title: "Diferencia entre fondo y ETF", level: "Intermedio", slug: "diferencia-entre-fondo-y-etf" },
      { title: "Diversificación con fondos", level: "Intermedio", slug: "diversificacion-con-fondos" },
      { title: "Errores comunes con fondos", level: "Avanzado", slug: "errores-comunes-con-fondos" },
    ],
  },
  {
    title: "Perfil del inversionista",
    lessons: [
      { title: "Inversionista conservador", level: "Básico", slug: "inversionista-conservador" },
      { title: "Inversionista moderado", level: "Básico", slug: "inversionista-moderado" },
      { title: "Inversionista agresivo", level: "Intermedio", slug: "inversionista-agresivo" },
      { title: "Ajustar mi perfil con el tiempo", level: "Avanzado", slug: "ajustar-mi-perfil-con-el-tiempo" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Elegir instrumentos con criterio", level: "Intermedio", slug: "elegir-instrumentos-con-criterio" },
      { title: "Prepararme para invertir a largo plazo", level: "Intermedio", slug: "prepararme-para-invertir-a-largo-plazo" },
      { title: "Checkpoint: Mis primeros instrumentos", level: "Avanzado", slug: "checkpoint-mis-primeros-instrumentos" },
    ],
  },
]
