export interface Tema3Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema3Subtema {
  title: string
  lessons: Tema3Lesson[]
}

export const TEMA3_TITLE = "Finanzas Bursátiles"

export const TEMA3_SUBTEMAS: Tema3Subtema[] = [
  {
    title: "1. Introducción a la bolsa",
    lessons: [
      { title: "¿Qué es el riesgo y diversificación?", slug: "riesgo-y-diversificacion", level: "Básico" },
      { title: "¿Para qué sirve?", slug: "bolsa-para-que", level: "Básico" },
      { title: "¿Cómo funciona de forma general?", slug: "bolsa-como-funciona", level: "Básico" },
    ]
  },
  {
    title: "2. Participantes del mercado",
    lessons: [
      { title: "¿Quiénes son los inversionistas?", slug: "inversionistas", level: "Básico" },
      { title: "¿Qué papel juegan las empresas?", slug: "empresas-listadas", level: "Básico" },
      { title: "¿Qué son los intermediarios corporativos?", slug: "intermediarios-casas-bolsa", level: "Básico" },
    ]
  },
  {
    title: "3. Conceptos básicos de inversión",
    lessons: [
      { title: "¿Qué es invertir?", slug: "que-es-invertir", level: "Básico" },
      { title: "¿Cuál es la diferencia entre ahorrar e invertir?", slug: "ahorro-vs-inversion", level: "Básico" },
      { title: "¿Qué es el rendimiento y el riesgo?", slug: "rendimiento-y-riesgo", level: "Intermedio" },
    ]
  },
  {
    title: "4. Tipos de instrumentos",
    lessons: [
      { title: "¿Qué son las acciones?", slug: "instrumentos-acciones", level: "Básico" },
      { title: "¿Qué son los ETFs?", slug: "instrumentos-etfs", level: "Básico" },
      { title: "¿Qué son los bonos?", slug: "instrumentos-bonos", level: "Básico" },
      { title: "¿Qué son los fondos de inversión?", slug: "instrumentos-fondos", level: "Básico" },
    ]
  },
  {
    title: "5. Acciones",
    lessons: [
      { title: "¿Qué es una acción?", slug: "accion-definicion", level: "Básico" },
      { title: "¿Cómo se gana dinero con ellas?", slug: "dividendos-y-plusvalia", level: "Intermedio" },
      { title: "¿Qué son las empresas públicas?", slug: "empresas-publicas", level: "Básico" },
    ]
  },
  {
    title: "6. ETFs",
    lessons: [
      { title: "¿Qué son los ETFs?", slug: "etfs-definicion", level: "Básico" },
      { title: "¿Cómo funcionan los ETFs?", slug: "etfs-funcionamiento", level: "Intermedio" },
      { title: "¿Cuáles son sus ventajas principales?", slug: "etfs-ventajas", level: "Básico" },
    ]
  },
  {
    title: "7. Bonos",
    lessons: [
      { title: "¿Qué son los bonos?", slug: "bonos-definicion", level: "Básico" },
      { title: "¿Cómo generan rendimientos?", slug: "bonos-rendimiento", level: "Intermedio" },
    ]
  },
  {
    title: "8. Cómo empezar a invertir",
    lessons: [
      { title: "¿Cómo abrir una cuenta?", slug: "abrir-cuenta-inversion", level: "Básico" },
      { title: "¿Cómo elegir una plataforma?", slug: "elegir-plataforma", level: "Básico" },
      { title: "¿Cuáles son los primeros pasos?", slug: "primeros-pasos-inversion", level: "Básico" },
    ]
  },
  {
    title: "9. Compra y venta",
    lessons: [
      { title: "¿Cómo se compra y vende en bolsa?", slug: "compra-venta-bolsa", level: "Básico" },
      { title: "¿Qué tipos de órdenes existen?", slug: "ordenes-basicas", level: "Intermedio" },
    ]
  },
  {
    title: "10. Rendimiento",
    lessons: [
      { title: "¿Qué es el rendimiento?", slug: "rendimiento-que-es", level: "Básico" },
      { title: "¿Cómo se calcula de forma básica?", slug: "calculo-rendimiento", level: "Intermedio" },
    ]
  },
  {
    title: "11. Riesgo",
    lessons: [
      { title: "¿Qué es el riesgo?", slug: "riesgo-financiero", level: "Básico" },
      { title: "¿Cuáles son los tipos de riesgo?", slug: "tipos-de-riesgo", level: "Intermedio" },
      { title: "¿Cuál es la relación riesgo-rendimiento?", slug: "relacion-riesgo-rendimiento", level: "Intermedio" },
    ]
  },
  {
    title: "12. Diversificación",
    lessons: [
      { title: "¿Qué es la diversificación?", slug: "diversificacion-que-es", level: "Básico" },
      { title: "¿Por qué es tan importante?", slug: "importancia-diversificacion", level: "Básico" },
      { title: "¿Cómo se ve la diversificación?", slug: "ejemplos-diversificacion", level: "Básico" },
    ]
  },
  {
    title: "13. Horizonte de inversión",
    lessons: [
      { title: "¿Qué es el corto plazo?", slug: "corto-plazo", level: "Básico" },
      { title: "¿Qué es el mediano plazo?", slug: "mediano-plazo", level: "Básico" },
      { title: "¿Qué es el largo plazo?", slug: "largo-plazo", level: "Básico" },
    ]
  },
  {
    title: "14. Estrategias básicas",
    lessons: [
      { title: "¿Qué es la inversión a largo plazo?", slug: "estrategia-largo-plazo", level: "Intermedio" },
      { title: "¿Qué es el trading básico?", slug: "trading-basico", level: "Avanzado" },
      { title: "¿En qué consiste la inversión periódica?", slug: "inversion-periodica", level: "Intermedio" },
    ]
  },
  {
    title: "15. Lectura de mercado",
    lessons: [
      { title: "¿Qué son las gráficas?", slug: "graficas-que-son", level: "Básico" },
      { title: "¿Cómo identificar tendencias?", slug: "tendencias-mercado", level: "Intermedio" },
      { title: "¿Cómo leer noticias financieras?", slug: "noticias-financieras", level: "Básico" },
    ]
  },
  {
    title: "16. Tipos de gráficas",
    lessons: [
      { title: "¿Qué son las gráficas de líneas?", slug: "graficas-lineas", level: "Básico" },
      { title: "¿Qué son las velas japonesas?", slug: "velas-japonesas", level: "Intermedio" },
      { title: "¿Cómo interpretar las gráficas?", slug: "interpretacion-graficas", level: "Avanzado" },
    ]
  },
  {
    title: "17. Portafolio",
    lessons: [
      { title: "¿Qué es un portafolio?", slug: "portafolio-definicion", level: "Básico" },
      { title: "¿Cómo se construye un portafolio?", slug: "construccion-portafolio", level: "Intermedio" },
      { title: "¿Qué es el rebalanceo?", slug: "balanceo-portafolio", level: "Avanzado" },
    ]
  },
  {
    title: "18. Psicología del inversionista",
    lessons: [
      { title: "¿Cómo afectan tus emociones?", slug: "emociones-inversion", level: "Básico" },
      { title: "¿Cuáles son los errores psicológicos?", slug: "errores-psicologicos", level: "Intermedio" },
      { title: "¿Por qué es vital la disciplina?", slug: "disciplina-financiera", level: "Básico" },
    ]
  },
  {
    title: "19. Errores comunes al invertir",
    lessons: [
      { title: "¿Por qué no diversificar es un error?", slug: "no-diversificar", level: "Básico" },
      { title: "¿Qué pasa al invertir sin saber?", slug: "invertir-sin-conocimiento", level: "Básico" },
      { title: "¿Por qué no debes seguir modas?", slug: "seguir-modas", level: "Básico" },
    ]
  },
  {
    title: "20. Seguridad al invertir",
    lessons: [
      { title: "¿Cómo evitar fraudes al invertir?", slug: "fraudes-inversion", level: "Básico" },
      { title: "¿Cómo elegir plataformas confiables?", slug: "plataformas-confiables", level: "Básico" },
      { title: "¿Quién protege al inversionista?", slug: "proteccion-usuario", level: "Básico" },
    ]
  },
  {
    title: "21. Certificación",
    lessons: [
      { title: "Examen de Certificación: Bloque 3", slug: "evaluacion-bloque-3", level: "Avanzado" },
    ]
  },
]
