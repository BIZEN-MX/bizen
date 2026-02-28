export interface Tema21Lesson {
  title: string
  slug: string
}

export interface Tema21Subtema {
  title: string
  lessons: Tema21Lesson[]
}

export const TEMA21_SUBTEMAS: Tema21Subtema[] = [
  {
    title: "¿Qué es el flujo de efectivo?",
    lessons: [
      { title: "¿Qué es el flujo de efectivo?", slug: "que-es-el-flujo-de-efectivo" },
      { title: "¿Por qué es vital para un negocio?", slug: "por-que-es-vital-para-un-negocio" },
      { title: "Utilidad vs flujo", slug: "utilidad-vs-flujo" },
    ],
  },
  {
    title: "Entradas y salidas de dinero",
    lessons: [
      { title: "Entradas de efectivo", slug: "entradas-de-efectivo" },
      { title: "Salidas de efectivo", slug: "salidas-de-efectivo" },
      { title: "Momentos de cobro y pago", slug: "momentos-de-cobro-y-pago" },
    ],
  },
  {
    title: "Problemas de flujo",
    lessons: [
      { title: "Negocio rentable sin dinero", slug: "negocio-rentable-sin-dinero" },
      { title: "Falta de liquidez", slug: "falta-de-liquidez" },
      { title: "Errores comunes de flujo", slug: "errores-comunes-de-flujo" },
    ],
  },
  {
    title: "Manejar el flujo",
    lessons: [
      { title: "Mejorar cobros", slug: "mejorar-cobros" },
      { title: "Controlar pagos", slug: "controlar-pagos" },
      { title: "Crear colchón de efectivo", slug: "crear-colchon-de-efectivo" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar en efectivo primero", slug: "pensar-en-efectivo-primero" },
      { title: "Checkpoint: Mi flujo de efectivo", slug: "checkpoint-mi-flujo-de-efectivo" },
    ],
  },
]
