export interface Tema14Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema14Subtema {
  title: string
  lessons: Tema14Lesson[]
}

export const TEMA14_TITLE = "Deuda"

export const TEMA14_SUBTEMAS: Tema14Subtema[] = [
  {
    title: "Entender la deuda",
    lessons: [
      { title: "Tipos de deuda (personal, consumo, educativa)", slug: "tipos-de-deuda-personal-consumo-educativa", level: "Básico" },
      { title: "Señales de deuda saludable vs peligrosa", slug: "senales-de-deuda-saludable-vs-peligrosa", level: "Básico" },
      { title: "Endeudarte por necesidad vs por impulso", slug: "endeudarte-por-necesidad-vs-por-impulso", level: "Intermedio" },
      { title: "El “costo emocional” de la deuda", slug: "el-costo-emocional-de-la-deuda", level: "Intermedio" },
      { title: "Diagnóstico: mi nivel de riesgo de deuda", slug: "diagnostico-mi-nivel-de-riesgo-de-deuda", level: "Avanzado" },
    ]
  },
  {
    title: "Control y prioridades",
    lessons: [
      { title: "Lista real de deudas (cómo organizarla)", slug: "lista-real-de-deudas-como-organizarla", level: "Básico" },
      { title: "Priorizar: qué pagar primero y por qué", slug: "priorizar-que-pagar-primero-y-por-que", level: "Básico" },
      { title: "Método bola de nieve (motivación)", slug: "metodo-bola-de-nieve-motivacion", level: "Intermedio" },
      { title: "Método avalancha (matemática)", slug: "metodo-avalancha-matematica", level: "Intermedio" },
      { title: "Elegir método según tu situación", slug: "elegir-metodo-segun-tu-situacion", level: "Avanzado" },
    ]
  },
  {
    title: "Salir y no volver",
    lessons: [
      { title: "Plan para salir de deuda en 30/60/90 días", slug: "plan-para-salir-de-deuda-en-306090-dias", level: "Básico" },
      { title: "Cortar la causa (no solo pagar)", slug: "cortar-la-causa-no-solo-pagar", level: "Básico" },
      { title: "Refinanciar: cuándo sí y cuándo no", slug: "refinanciar-cuando-si-y-cuando-no", level: "Intermedio" },
      { title: "Evitar volver a caer (reglas personales)", slug: "evitar-volver-a-caer-reglas-personales", level: "Intermedio" },
      { title: "Caso: salir de deudas con ingresos limitados", slug: "caso-salir-de-deudas-con-ingresos-limitados", level: "Avanzado" },
    ]
  },
]
