export interface Tema2Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema2Subtema {
  title: string
  lessons: Tema2Lesson[]
}

export const TEMA2_TITLE = "Finanzas Personales"

export const TEMA2_SUBTEMAS: Tema2Subtema[] = [
  {
    title: "1. ¿Qué son las finanzas personales?",
    lessons: [
      { title: "¿Qué son las finanzas personales?", slug: "que-son-finanzas-personales", level: "Básico" },
      { title: "¿Por qué son importantes en tu vida?", slug: "importancia-personales", level: "Básico" },
    ]
  },
  {
    title: "2. Administración del dinero",
    lessons: [
      { title: "¿Qué son los ingresos y los gastos?", slug: "ingresos-y-gastos", level: "Básico" },
      { title: "¿Cómo fluye el dinero?", slug: "flujo-de-dinero", level: "Básico" },
    ]
  },
  {
    title: "3. Presupuesto",
    lessons: [
      { title: "¿Qué es un presupuesto?", slug: "que-es-presupuesto", level: "Básico" },
      { title: "¿Cuáles son los pasos para crearlo?", slug: "pasos-presupuesto", level: "Básico" },
      { title: "¿Cómo se puede ajustar un presupuesto?", slug: "ajuste-presupuesto", level: "Intermedio" },
    ]
  },
  {
    title: "4. Métodos de presupuesto",
    lessons: [
      { title: "¿En qué consiste la Regla 50/30/20?", slug: "regla-50-30-20", level: "Intermedio" },
      { title: "¿En qué consiste la Regla 60/20/20?", slug: "regla-60-20-20", level: "Intermedio" },
    ]
  },
  {
    title: "5. Herramientas de control financiero",
    lessons: [
      { title: "¿Qué apps financieras existen?", slug: "apps-financieras", level: "Básico" },
      { title: "¿Cómo usar Excel para tus finanzas?", slug: "excel-financiero", level: "Intermedio" },
      { title: "¿Qué métodos manuales de control hay?", slug: "metodos-manuales", level: "Básico" },
    ]
  },
  {
    title: "6. Ahorro",
    lessons: [
      { title: "¿Qué es el ahorro?", slug: "que-es-ahorro", level: "Básico" },
      { title: "¿Por qué es importante ahorrar?", slug: "importancia-ahorro", level: "Básico" },
      { title: "¿Cómo definir metas de ahorro?", slug: "metas-ahorro", level: "Básico" },
    ]
  },
  {
    title: "7. Fondo de emergencia",
    lessons: [
      { title: "¿Qué es el fondo de emergencia?", slug: "fondo-emergencia-definicion", level: "Básico" },
      { title: "¿Para qué sirve un fondo de emergencia?", slug: "utilidad-fondo", level: "Básico" },
      { title: "¿Cuánto dinero debes ahorrar?", slug: "calculo-fondo", level: "Intermedio" },
      { title: "¿Dónde invertir tu fondo de emergencia?", slug: "tipos-inversion-emergencia", level: "Intermedio" },
    ]
  },
  {
    title: "8. Crédito",
    lessons: [
      { title: "¿Qué es el crédito?", slug: "que-es-credito", level: "Básico" },
      { title: "¿Cómo funciona el crédito?", slug: "funcionamiento-credito", level: "Básico" },
      { title: "¿Cómo usar el crédito responsablemente?", slug: "uso-responsable-credito", level: "Intermedio" },
    ]
  },
  {
    title: "9. Instituciones financieras y crediticias",
    lessons: [
      { title: "¿Qué son los bancos tradicionales?", slug: "bancos-tradicionales", level: "Básico" },
      { title: "¿Qué son las SOFIPOs?", slug: "sofipos", level: "Intermedio" },
      { title: "¿Qué es una Fintech?", slug: "fintech", level: "Intermedio" },
      { title: "¿Qué otras instituciones financieras hay?", slug: "otras-instituciones", level: "Intermedio" },
    ]
  },
  {
    title: "10. Préstamos",
    lessons: [
      { title: "¿Qué son los préstamos?", slug: "que-son-prestamos", level: "Básico" },
      { title: "¿Qué tipos de préstamos existen?", slug: "tipos-prestamos", level: "Intermedio" },
      { title: "¿Cuáles son los riesgos de un préstamo?", slug: "riesgos-prestamos", level: "Intermedio" },
    ]
  },
  {
    title: "11. Planeación financiera personal",
    lessons: [
      { title: "¿Cómo establecer metas financieras?", slug: "metas-financieras-personales", level: "Básico" },
      { title: "¿Cómo organizar mejor tu dinero?", slug: "organizacion-dinero", level: "Intermedio" },
      { title: "¿Qué hábitos financieros son saludables?", slug: "habitos-financieros", level: "Básico" },
    ]
  },
]
