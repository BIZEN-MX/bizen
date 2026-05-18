export interface Tema4Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema4Subtema {
  title: string
  lessons: Tema4Lesson[]
}

export const TEMA4_TITLE = "Finanzas para mi Negocio"

export const TEMA4_SUBTEMAS: Tema4Subtema[] = [
  {
    title: "1. Introducción a las finanzas empresariales",
    lessons: [
      { title: "Costos, flujo de efectivo y prioridades del negocio", slug: "intro-finanzas-empresariales", level: "Básico" },
      { title: "¿Por qué son importantes en un negocio?", slug: "importancia-negocio", level: "Básico" },
    ]
  },
  {
    title: "2. Modelo de negocio",
    lessons: [
      { title: "¿Qué es un modelo de negocio?", slug: "que-es-modelo-negocio", level: "Básico" },
      { title: "¿Cómo genera ingresos?", slug: "generacion-ingresos", level: "Básico" },
      { title: "¿Cuáles son los tipos de modelo de negocio?", slug: "tipos-modelo-negocio", level: "Intermedio" },
    ]
  },
  {
    title: "3. Herramientas de modelo de negocio",
    lessons: [
      { title: "¿Qué es el Business Model Canvas?", slug: "business-model-canvas", level: "Intermedio" },
      { title: "¿Qué es el roadmap de negocio?", slug: "roadmap-negocio", level: "Intermedio" },
      { title: "¿Qué es la propuesta de valor?", slug: "propuesta-de-valor", level: "Básico" },
    ]
  },
  {
    title: "4. Gestión de clientes",
    lessons: [
      { title: "¿Qué es un CRM?", slug: "que-es-crm", level: "Intermedio" },
      { title: "¿Por qué son vitales los clientes?", slug: "importancia-clientes", level: "Básico" },
      { title: "¿Cómo retener y fidelizar clientes?", slug: "retencion-fidelizacion", level: "Intermedio" },
    ]
  },
  {
    title: "5. Ingresos del negocio",
    lessons: [
      { title: "¿Qué tipos de ingresos existen?", slug: "tipos-ingresos-negocio", level: "Básico" },
      { title: "¿Cómo proyectar los ingresos?", slug: "proyeccion-ingresos", level: "Intermedio" },
    ]
  },
  {
    title: "6. Costos",
    lessons: [
      { title: "¿Qué son los costos?", slug: "que-son-costos-negocio", level: "Básico" },
      { title: "¿Qué son los costos fijos?", slug: "costos-fijos", level: "Básico" },
      { title: "¿Qué son los costos variables?", slug: "costos-variables", level: "Básico" },
    ]
  },
  {
    title: "7. Cálculo de costos",
    lessons: [
      { title: "¿Cómo calcular los costos?", slug: "calculo-costos-negocio", level: "Intermedio" },
      { title: "¿Qué es el costo total?", slug: "costo-total", level: "Básico" },
      { title: "¿Cómo calcular el costo unitario?", slug: "costo-unitario", level: "Intermedio" },
    ]
  },
  {
    title: "8. Precios",
    lessons: [
      { title: "¿Cómo fijar los precios?", slug: "fijacion-precios", level: "Intermedio" },
      { title: "¿Cuál es la relación costo-precio?", slug: "relacion-costo-precio", level: "Básico" },
      { title: "¿Qué es el margen de ganancia?", slug: "margen-ganancia", level: "Intermedio" },
    ]
  },
  {
    title: "9. Salarios",
    lessons: [
      { title: "¿Cómo definir los sueldos?", slug: "definir-sueldos", level: "Intermedio" },
      { title: "¿Cuáles son los costos de los empleados?", slug: "costos-empleados", level: "Intermedio" },
      { title: "¿Qué es la nómina básica?", slug: "nomina-basica", level: "Básico" },
    ]
  },
  {
    title: "10. Punto de equilibrio",
    lessons: [
      { title: "¿Qué es el punto de equilibrio?", slug: "punto-equilibrio-que-es", level: "Intermedio" },
      { title: "¿Cómo se calcula el punto de equilibrio?", slug: "calculo-punto-equilibrio", level: "Avanzado" },
      { title: "¿Por qué es clave estratégicamente?", slug: "importancia-punto-equilibrio", level: "Intermedio" },
    ]
  },
  {
    title: "11. Flujo de efectivo",
    lessons: [
      { title: "¿Qué son las entradas y salidas de dinero?", slug: "flujo-efectivo-negocio", level: "Básico" },
      { title: "¿Cómo controlar el efectivo?", slug: "control-efectivo", level: "Intermedio" },
      { title: "¿Por qué es tan importante el flujo?", slug: "importancia-flujo", level: "Básico" },
    ]
  },
  {
    title: "12. Estados financieros",
    lessons: [
      { title: "¿Qué son los estados financieros?", slug: "que-son-estados-financieros", level: "Básico" },
      { title: "¿Qué es el estado de resultados?", slug: "estado-resultados", level: "Intermedio" },
      { title: "¿Qué es el balance general?", slug: "balance-general", level: "Intermedio" },
    ]
  },
  {
    title: "13. Lectura de estados financieros",
    lessons: [
      { title: "¿Cómo interpretar ingresos y gastos?", slug: "interpretar-ingresos-gastos", level: "Intermedio" },
      { title: "¿Cómo entender la utilidad y las pérdidas?", slug: "utilidad-y-perdidas", level: "Básico" },
      { title: "¿Cómo evaluar tu situación financiera?", slug: "situacion-financiera", level: "Intermedio" },
    ]
  },
  {
    title: "14. Razones financieras",
    lessons: [
      { title: "¿Qué son las razones financieras?", slug: "razones-financieras-intro", level: "Intermedio" },
      { title: "¿Qué es la liquidez?", slug: "liquidez", level: "Intermedio" },
      { title: "¿Qué es la rentabilidad?", slug: "rentabilidad", level: "Intermedio" },
      { title: "¿Qué es el endeudamiento?", slug: "endeudamiento", level: "Intermedio" },
    ]
  },
  {
    title: "15. Financiamiento",
    lessons: [
      { title: "¿Qué es el financiamiento?", slug: "financiamiento-que-es", level: "Básico" },
      { title: "¿Qué tipos de financiamiento existen?", slug: "tipos-financiamiento", level: "Intermedio" },
      { title: "¿Cuándo usar el financiamiento?", slug: "cuando-usar-financiamiento", level: "Intermedio" },
    ]
  },
  {
    title: "16. Créditos para negocio",
    lessons: [
      { title: "¿Qué tipos de crédito existen?", slug: "creditos-negocio-tipos", level: "Básico" },
      { title: "¿Cómo funcionan estos créditos?", slug: "funcionamiento-creditos-negocio", level: "Intermedio" },
      { title: "¿Cuáles son los riesgos asociados?", slug: "riesgos-creditos-negocio", level: "Intermedio" },
    ]
  },
  {
    title: "17. Régimen fiscal (RESICO)",
    lessons: [
      { title: "¿Qué es el RESICO?", slug: "que-es-resico", level: "Intermedio" },
      { title: "¿Quién puede usar el RESICO?", slug: "quien-puede-usarlo", level: "Básico" },
      { title: "¿Cuáles son sus beneficios?", slug: "beneficios-resico", level: "Básico" },
    ]
  },
  {
    title: "18. Evaluación de un negocio",
    lessons: [
      { title: "¿Cómo evaluar la rentabilidad?", slug: "evaluacion-rentabilidad", level: "Intermedio" },
      { title: "¿Cómo medir el crecimiento?", slug: "evaluacion-crecimiento", level: "Intermedio" },
      { title: "¿Cómo saber si el negocio es viable?", slug: "viabilidad-negocio", level: "Avanzado" },
    ]
  },
  {
    title: "19. Protección del negocio",
    lessons: [
      { title: "¿Qué son los seguros empresariales?", slug: "seguros-negocio", level: "Básico" },
      { title: "¿Cómo proteger legalmente tu negocio?", slug: "proteccion-legal", level: "Intermedio" },
      { title: "¿Cómo manejar los riesgos del negocio?", slug: "manejo-riesgos-negocio", level: "Intermedio" },
    ]
  },
  {
    title: "20. Reinversión",
    lessons: [
      { title: "¿Qué es la reinversión?", slug: "que-es-reinversion", level: "Básico" },
      { title: "¿Cuál es su importancia estratégica?", slug: "importancia-reinversion", level: "Intermedio" },
      { title: "¿Qué estrategias de reinversión existen?", slug: "estrategias-reinversion", level: "Intermedio" },
    ]
  },
  {
    title: "21. Toma de decisiones financieras",
    lessons: [
      { title: "¿Cómo analizar opciones financieras?", slug: "analisis-opciones", level: "Avanzado" },
      { title: "¿Cómo optimizar tus recursos?", slug: "optimizacion-recursos", level: "Avanzado" },
    ]
  },
  {
    title: "22. Certificación",
    lessons: [
      { title: "Examen de Certificación: Bloque 4", slug: "evaluacion-bloque-4", level: "Avanzado" },
    ]
  },
]
