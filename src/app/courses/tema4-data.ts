export interface Tema4Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema4Subtema {
  title: string
  lessons: Tema4Lesson[]
}

export const TEMA4_TITLE = "Tipos de gastos"

export const TEMA4_SUBTEMAS: Tema4Subtema[] = [
  {
    title: "Clasificación",
    lessons: [
      { title: "Gastos fijos vs variables", slug: "gastos-fijos-vs-variables", level: "Básico" },
      { title: "Necesidad vs deseo", slug: "necesidad-vs-deseo", level: "Básico" },
      { title: "Gastos discrecionales (lo que sí eliges)", slug: "gastos-discrecionales-lo-que-si-eliges", level: "Intermedio" },
      { title: "Costo real: gasto + extras", slug: "costo-real-gasto-extras", level: "Intermedio" },
      { title: "Clasificar mis gastos (ejercicio completo)", slug: "clasificar-mis-gastos-ejercicio-completo", level: "Avanzado" },
    ]
  },
  {
    title: "Gastos hormiga",
    lessons: [
      { title: "¿Qué son y por qué importan?", slug: "que-son-y-por-que-importan", level: "Básico" },
      { title: "Detectar 3 gastos hormiga personales", slug: "detectar-3-gastos-hormiga-personales", level: "Básico" },
      { title: "Recorte inteligente (sin “sufrir”)", slug: "recorte-inteligente-sin-sufrir", level: "Intermedio" },
      { title: "Sustituciones (barato, saludable, útil)", slug: "sustituciones-barato-saludable-util", level: "Intermedio" },
      { title: "Reto: semana sin gasto hormiga", slug: "reto-semana-sin-gasto-hormiga", level: "Avanzado" },
    ]
  },
  {
    title: "Gastos invisibles",
    lessons: [
      { title: "Comisiones y fugas bancarias", slug: "comisiones-y-fugas-bancarias", level: "Básico" },
      { title: "Membresías y suscripciones olvidadas", slug: "membresias-y-suscripciones-olvidadas", level: "Básico" },
      { title: "El costo del interés (deuda mala)", slug: "el-costo-del-interes-deuda-mala", level: "Intermedio" },
      { title: "Descuentos que salen caros", slug: "descuentos-que-salen-caros", level: "Intermedio" },
      { title: "Auditoría 360 de mis salidas", slug: "auditoria-360-de-mis-salidas", level: "Avanzado" },
    ]
  },
]
