export interface Tema11Lesson {
  title: string
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
      { title: "¿Qué es un instrumento de inversión?", slug: "que-es-un-instrumento-de-inversion" },
      { title: "¿Por qué existen distintos instrumentos?", slug: "por-que-existen-distintos-instrumentos" },
      { title: "Elegir instrumentos según mi perfil", slug: "elegir-instrumentos-segun-mi-perfil" },
      { title: "Relación entre riesgo, tiempo y rendimiento", slug: "relacion-entre-riesgo-tiempo-y-rendimiento" },
    ],
  },
  {
    title: "Renta fija",
    lessons: [
      { title: "¿Qué es la renta fija?", slug: "que-es-la-renta-fija" },
      { title: "Bonos explicados fácil", slug: "bonos-explicados-facil" },
      { title: "Certificados y pagarés", slug: "certificados-y-pagares" },
      { title: "Riesgos de la renta fija", slug: "riesgos-de-la-renta-fija" },
      { title: "¿Cuándo conviene la renta fija?", slug: "cuando-conviene-la-renta-fija" },
    ],
  },
  {
    title: "Renta variable",
    lessons: [
      { title: "¿Qué es la renta variable?", slug: "que-es-la-renta-variable" },
      { title: "Acciones explicadas simple", slug: "acciones-explicadas-simple" },
      { title: "Volatilidad en acciones", slug: "volatilidad-en-acciones" },
      { title: "Riesgos de la renta variable", slug: "riesgos-de-la-renta-variable" },
      { title: "Invertir a largo plazo en acciones", slug: "invertir-a-largo-plazo-en-acciones" },
    ],
  },
  {
    title: "Fondos y ETFs",
    lessons: [
      { title: "¿Qué es un fondo de inversión?", slug: "que-es-un-fondo-de-inversion" },
      { title: "¿Qué es un ETF?", slug: "que-es-un-etf" },
      { title: "Diferencia entre fondo y ETF", slug: "diferencia-entre-fondo-y-etf" },
      { title: "Diversificación con fondos", slug: "diversificacion-con-fondos" },
      { title: "Errores comunes con fondos", slug: "errores-comunes-con-fondos" },
    ],
  },
  {
    title: "Perfil del inversionista",
    lessons: [
      { title: "Inversionista conservador", slug: "inversionista-conservador" },
      { title: "Inversionista moderado", slug: "inversionista-moderado" },
      { title: "Inversionista agresivo", slug: "inversionista-agresivo" },
      { title: "Ajustar mi perfil con el tiempo", slug: "ajustar-mi-perfil-con-el-tiempo" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Elegir instrumentos con criterio", slug: "elegir-instrumentos-con-criterio" },
      { title: "Prepararme para invertir a largo plazo", slug: "prepararme-para-invertir-a-largo-plazo" },
      { title: "Checkpoint: Mis primeros instrumentos", slug: "checkpoint-mis-primeros-instrumentos" },
    ],
  },
]
