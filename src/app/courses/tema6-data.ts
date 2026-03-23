export interface Tema6Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema6Subtema {
  title: string
  lessons: Tema6Lesson[]
}

export const TEMA6_TITLE = "Presupuesto personal"

export const TEMA6_SUBTEMAS: Tema6Subtema[] = [
  {
    title: "Base",
    lessons: [
      { title: "¿Qué es un presupuesto real?", slug: "que-es-un-presupuesto-real", level: "Básico" },
      { title: "Errores típicos al presupuestar", slug: "errores-tipicos-al-presupuestar", level: "Básico" },
      { title: "Presupuesto flexible (vida real)", slug: "presupuesto-flexible-vida-real", level: "Intermedio" },
      { title: "Presupuesto por categorías", slug: "presupuesto-por-categorias", level: "Intermedio" },
      { title: "Elegir el tipo correcto para mí", slug: "elegir-el-tipo-correcto-para-mi", level: "Avanzado" },
    ]
  },
  {
    title: "Construcción",
    lessons: [
      { title: "Armar presupuesto paso a paso", slug: "armar-presupuesto-paso-a-paso", level: "Básico" },
      { title: "Prioridades: qué va primero", slug: "prioridades-que-va-primero", level: "Básico" },
      { title: "Ajustar sin rendirme", slug: "ajustar-sin-rendirme", level: "Intermedio" },
      { title: "¿Qué hacer si tengo ingresos variables?", slug: "que-hacer-si-tengo-ingresos-variables", level: "Intermedio" },
      { title: "Caso: presupuesto con imprevisto", slug: "caso-presupuesto-con-imprevisto", level: "Avanzado" },
    ]
  },
  {
    title: "Uso real",
    lessons: [
      { title: "¿Cómo seguirlo día a día?", slug: "como-seguirlo-dia-a-dia", level: "Básico" },
      { title: "¿Qué hacer cuando me salgo?", slug: "que-hacer-cuando-me-salgo", level: "Básico" },
      { title: "Revisar semanalmente", slug: "revisar-semanalmente", level: "Intermedio" },
      { title: "Ajustar el siguiente mes", slug: "ajustar-el-siguiente-mes", level: "Intermedio" },
      { title: "Presupuesto sostenible (no perfecto)", slug: "presupuesto-sostenible-no-perfecto", level: "Avanzado" },
    ]
  },
]
