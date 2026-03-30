export interface Tema4Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema4Subtema {
  title: string
  lessons: Tema4Lesson[]
}

export const TEMA4_TITLE = "Optimización de Egresos"

export const TEMA4_SUBTEMAS: Tema4Subtema[] = [
  {
    title: "Análisis de Valor",
    lessons: [
      { title: "Gastos Fijos vs Variables", slug: "gastos-fijos-vs-variables", level: "Básico" },
      { title: "Necesidad vs Deseo", slug: "necesidad-vs-deseo", level: "Básico" },
      { title: "Gastos Discrecionales (Lo que sí eliges)", slug: "gastos-discrecionales-lo-que-si-eliges", level: "Intermedio" },
      { title: "Costo Real: Gasto + Extras", slug: "costo-real-gasto-extras", level: "Intermedio" },
      { title: "Clasificar mis Gastos (Ejercicio Maestro)", slug: "clasificar-mis-gastos-ejercicio-completo", level: "Avanzado" },
    ]
  },
  {
    title: "Cacería de Hormigas",
    lessons: [
      { title: "¿Qué son y por qué importan?", slug: "que-son-y-por-que-importan", level: "Básico" },
      { title: "Detectar 3 Gastos Hormiga Personales", slug: "detectar-3-gastos-hormiga-personales", level: "Básico" },
      { title: "Recorte Inteligente (Sin sufrir)", slug: "recorte-inteligente-sin-sufrir", level: "Intermedio" },
      { title: "Sustituciones Inteligentes (Barato, Saludable, Útil)", slug: "sustituciones-barato-saludable-util", level: "Intermedio" },
      { title: "Reto: Semana sin Gasto Hormiga", slug: "reto-semana-sin-gasto-hormiga", level: "Avanzado" },
    ]
  },
  {
    title: "Gastos Invisibles",
    lessons: [
      { title: "Auditoría de Micro-seguros Ocultos", slug: "auditoria-de-micro-seguros-ocultos", level: "Básico" },
      { title: "Comisiones y Fugas Bancarias", slug: "comisiones-y-fugas-bancarias", level: "Básico" },
      { title: "Membresías y Suscripciones Olvidadas", slug: "membresias-y-suscripciones-olvidadas", level: "Intermedio" },
      { title: "El Costo del Interés (Deuda Mala)", slug: "el-costo-del-interes-deuda-mala", level: "Intermedio" },
      { title: "Auditoría 360", slug: "auditoria-360-de-mis-salidas", level: "Avanzado" },
    ]
  },
]
