export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema21Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema21Subtema {
  title: string
  lessons: Tema21Lesson[]
}

export const TEMA21_SUBTEMAS: Tema21Subtema[] = [
  {
    title: "Qué es el flujo de efectivo",
    lessons: [
      { title: "Qué es el flujo de efectivo", level: "Básico", slug: "que-es-el-flujo-de-efectivo" },
      { title: "Por qué es vital para un negocio", level: "Básico", slug: "por-que-es-vital-para-un-negocio" },
      { title: "Utilidad vs flujo", level: "Intermedio", slug: "utilidad-vs-flujo" },
    ],
  },
  {
    title: "Entradas y salidas de dinero",
    lessons: [
      { title: "Entradas de efectivo", level: "Básico", slug: "entradas-de-efectivo" },
      { title: "Salidas de efectivo", level: "Básico", slug: "salidas-de-efectivo" },
      { title: "Momentos de cobro y pago", level: "Intermedio", slug: "momentos-de-cobro-y-pago" },
    ],
  },
  {
    title: "Problemas de flujo",
    lessons: [
      { title: "Negocio rentable sin dinero", level: "Intermedio", slug: "negocio-rentable-sin-dinero" },
      { title: "Falta de liquidez", level: "Intermedio", slug: "falta-de-liquidez" },
      { title: "Errores comunes de flujo", level: "Avanzado", slug: "errores-comunes-de-flujo" },
    ],
  },
  {
    title: "Manejar el flujo",
    lessons: [
      { title: "Mejorar cobros", level: "Intermedio", slug: "mejorar-cobros" },
      { title: "Controlar pagos", level: "Intermedio", slug: "controlar-pagos" },
      { title: "Crear colchón de efectivo", level: "Avanzado", slug: "crear-colchon-de-efectivo" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar en efectivo primero", level: "Intermedio", slug: "pensar-en-efectivo-primero" },
      { title: "Checkpoint: Mi flujo de efectivo", level: "Avanzado", slug: "checkpoint-mi-flujo-de-efectivo" },
    ],
  },
]
