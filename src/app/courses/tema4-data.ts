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
      { title: "Suscripciones y “cobros fantasma”", slug: "suscripciones-y-cobros-fantasma", level: "Básico" },
      { title: "Comisiones bancarias comunes", slug: "comisiones-bancarias-comunes", level: "Básico" },
      { title: "Envíos, propinas, recargos", slug: "envios-propinas-recargos", level: "Intermedio" },
      { title: "Costos por pagar tarde", slug: "costos-por-pagar-tarde", level: "Intermedio" },
      { title: "Limpieza: cancelar y optimizar", slug: "limpieza-cancelar-y-optimizar", level: "Avanzado" },
    ]
  },
]
