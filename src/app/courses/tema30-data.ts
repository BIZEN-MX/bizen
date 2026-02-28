export interface Tema30Lesson {
  title: string
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
      { title: "Pensar a largo plazo", slug: "pensar-a-largo-plazo" },
      { title: "Visualizar mi futuro financiero", slug: "visualizar-mi-futuro-financiero" },
    ],
  },
  {
    title: "Objetivos de vida",
    lessons: [
      { title: "Definir objetivos financieros", slug: "definir-objetivos-financieros" },
      { title: "Alinear dinero y metas personales", slug: "alinear-dinero-y-metas-personales" },
    ],
  },
  {
    title: "Plan personal",
    lessons: [
      { title: "Crear un plan financiero personal", slug: "crear-un-plan-financiero-personal" },
      { title: "Ajustar el plan con el tiempo", slug: "ajustar-el-plan-con-el-tiempo" },
    ],
  },
  {
    title: "Compromiso personal",
    lessons: [
      { title: "Comprometerme con mi plan", slug: "comprometerme-con-mi-plan" },
      { title: "Revisar y mejorar constantemente", slug: "revisar-y-mejorar-constantemente" },
    ],
  },
  {
    title: "Cierre final",
    lessons: [
      { title: "Tomar control de mi vida financiera", slug: "tomar-control-de-mi-vida-financiera" },
      { title: "Checkpoint final: Mi plan de vida financiera", slug: "checkpoint-final-mi-plan-de-vida-financiera" },
    ],
  },
]
