export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema30Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema30Subtema {
  title: string
  lessons: Tema30Lesson[]
}

export const TEMA30_SUBTEMAS: Tema30Subtema[] = [
  {
    title: "Pensar en el futuro",
    lessons: [
      { title: "Pensar a largo plazo", level: "Intermedio", slug: "pensar-a-largo-plazo" },
      { title: "Visualizar mi futuro financiero", level: "Intermedio", slug: "visualizar-mi-futuro-financiero" },
    ],
  },
  {
    title: "Objetivos de vida",
    lessons: [
      { title: "Definir objetivos financieros", level: "Intermedio", slug: "definir-objetivos-financieros" },
      { title: "Alinear dinero y metas personales", level: "Avanzado", slug: "alinear-dinero-y-metas-personales" },
    ],
  },
  {
    title: "Plan personal",
    lessons: [
      { title: "Crear un plan financiero personal", level: "Avanzado", slug: "crear-un-plan-financiero-personal" },
      { title: "Ajustar el plan con el tiempo", level: "Avanzado", slug: "ajustar-el-plan-con-el-tiempo" },
    ],
  },
  {
    title: "Compromiso personal",
    lessons: [
      { title: "Comprometerme con mi plan", level: "Avanzado", slug: "comprometerme-con-mi-plan" },
      { title: "Revisar y mejorar constantemente", level: "Avanzado", slug: "revisar-y-mejorar-constantemente" },
    ],
  },
  {
    title: "Cierre final",
    lessons: [
      { title: "Tomar control de mi vida financiera", level: "Avanzado", slug: "tomar-control-de-mi-vida-financiera" },
      { title: "Checkpoint final: Mi plan de vida financiera", level: "Avanzado", slug: "checkpoint-final-mi-plan-de-vida-financiera" },
    ],
  },
]
