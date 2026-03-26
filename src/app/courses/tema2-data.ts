export interface Tema2Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema2Subtema {
  title: string
  lessons: Tema2Lesson[]
}

export const TEMA2_TITLE = "Ingeniería del ingreso"

export const TEMA2_SUBTEMAS: Tema2Subtema[] = [
  {
    title: "La naturaleza del dinero",
    lessons: [
      { title: "¿Por qué el mercado paga lo que paga?", slug: "por-que-el-mercado-paga-lo-que-paga", level: "Básico" },
      { title: "Ingreso Activo vs Pasivo: La Realidad", slug: "ingreso-activo-vs-pasivo-la-realidad", level: "Básico" },
      { title: "El Triángulo del Valor (Habilidad, Escala, Rareza)", slug: "el-triangulo-del-valor-habilidad-escala-rareza", level: "Intermedio" },
      { title: "Ingreso de Portafolio: Dinero que genera dinero", slug: "ingreso-de-portafolio-dinero-que-genera-dinero", level: "Intermedio" },
      { title: "Evaluación: ¿Cómo se ve tu flujo de entrada hoy?", slug: "evaluacion-como-se-ve-tu-flujo-de-entrada-hoy", level: "Avanzado" },
    ]
  },
  {
    title: "El Capital de tus Habilidades",
    lessons: [
      { title: "Habilidades de Alto Valor (High-Income Skills)", slug: "habilidades-de-alto-valor-high-income-skills", level: "Básico" },
      { title: "Escalabilidad: ¿Tu tiempo tiene techo?", slug: "escalabilidad-tu-tiempo-tiene-techo", level: "Básico" },
      { title: "Invertir en ti: El ROI de tu educación", slug: "invertir-en-ti-el-roi-de-tu-educacion", level: "Intermedio" },
      { title: "Soft Skills: El multiplicador invisible de ingresos", slug: "soft-skills-el-multiplicador-invisible-de-ingresos", level: "Intermedio" },
      { title: "Diseño de Carrera: De Operativo a Estratégico", slug: "diseno-de-carrera-de-operativo-a-estrategico", level: "Avanzado" },
    ]
  },
  {
    title: "Optimización de la Riqueza",
    lessons: [
      { title: "Capital Intelectual vs Capital Financiero", slug: "capital-intelectual-vs-capital-financiero", level: "Básico" },
      { title: "El costo de no saber: Impuesto a la ignorancia", slug: "el-costo-de-no-saber-impuesto-a-la-ignorancia", level: "Básico" },
      { title: "Apalancamiento: Hacer más con menos", slug: "apalancamiento-hacer-mas-con-menos", level: "Intermedio" },
      { title: "Ingresos Recurrentes: Tu ejército de centavos", slug: "ingresos-recurrentes-tu-ejercito-de-centavos", level: "Intermedio" },
      { title: "Plan de Acción: Duplicar tu valor de mercado", slug: "plan-de-accion-duplicar-tu-valor-de-mercado", level: "Avanzado" },
    ]
  },
  {
    title: "Evaluación Final",
    lessons: [
      { title: "Certificación de Ingresos (Evaluación de Bloque)", slug: "evaluacion-bloque-2", level: "Avanzado" },
    ]
  },
]
