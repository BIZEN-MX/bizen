export interface Tema6Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema6Subtema {
  title: string
  lessons: Tema6Lesson[]
}

export const TEMA6_TITLE = "Presupuesto Personal"

export const TEMA6_SUBTEMAS: Tema6Subtema[] = [
  {
    title: "Base",
    lessons: [
      { title: "¿Qué es un presupuesto real?", slug: "que-es-un-presupuesto-real", level: "Básico" },
      { title: "¿Cuáles son los errores típicos al presupuestar?", slug: "errores-tipicos-al-presupuestar", level: "Básico" },
      { title: "¿Qué es un presupuesto flexible?", slug: "presupuesto-flexible-vida-real", level: "Intermedio" },
      { title: "¿Cómo armar un presupuesto por categorías?", slug: "presupuesto-por-categorias", level: "Intermedio" },
      { title: "¿Cómo elegir el presupuesto ideal para ti?", slug: "elegir-el-tipo-correcto-para-mi", level: "Avanzado" },
    ]
  },
  {
    title: "Construcción",
    lessons: [
      { title: "¿Cómo armar tu presupuesto paso a paso?", slug: "armar-presupuesto-paso-a-paso", level: "Básico" },
      { title: "¿Qué gastos van primero en tu presupuesto?", slug: "prioridades-que-va-primero", level: "Básico" },
      { title: "¿Cómo ajustar tu presupuesto sin rendirse?", slug: "ajustar-sin-rendirme", level: "Intermedio" },
      { title: "¿Qué hacer si tengo ingresos variables?", slug: "que-hacer-si-tengo-ingresos-variables", level: "Intermedio" },
      { title: "¿Qué hacer ante un imprevisto en tu presupuesto?", slug: "caso-presupuesto-con-imprevisto", level: "Avanzado" },
    ]
  },
  {
    title: "Uso real",
    lessons: [
      { title: "¿Cómo seguir tu presupuesto día a día?", slug: "como-seguirlo-dia-a-dia", level: "Básico" },
      { title: "¿Qué hacer cuando te sales del presupuesto?", slug: "que-hacer-cuando-me-salgo", level: "Básico" },
      { title: "¿Por qué debes revisarlo semanalmente?", slug: "revisar-semanalmente", level: "Intermedio" },
      { title: "¿Cómo ajustar el presupuesto del siguiente mes?", slug: "ajustar-el-siguiente-mes", level: "Intermedio" },
      { title: "¿Qué es un presupuesto sostenible?", slug: "presupuesto-sostenible-no-perfecto", level: "Avanzado" },
    ]
  },
]
