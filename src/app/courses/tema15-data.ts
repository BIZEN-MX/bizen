export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema15Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema15Subtema {
  title: string
  lessons: Tema15Lesson[]
}

export const TEMA15_SUBTEMAS: Tema15Subtema[] = [
  {
    title: "Qué es decidir bien con dinero",
    lessons: [
      { title: "Qué es una decisión financiera", level: "Básico", slug: "que-es-una-decision-financiera" },
      { title: "Decidir vs reaccionar", level: "Básico", slug: "decidir-vs-reaccionar" },
      { title: "Por qué decidir con dinero es difícil", level: "Intermedio", slug: "por-que-decidir-con-dinero-es-dificil" },
      { title: "Responsabilidad en las decisiones", level: "Intermedio", slug: "responsabilidad-en-las-decisiones" },
    ],
  },
  {
    title: "Proceso de decisión",
    lessons: [
      { title: "Pensar antes de decidir", level: "Básico", slug: "pensar-antes-de-decidir" },
      { title: "Información vs impulso", level: "Intermedio", slug: "informacion-vs-impulso" },
      { title: "Evaluar opciones", level: "Intermedio", slug: "evaluar-opciones" },
      { title: "Pensar en consecuencias", level: "Intermedio", slug: "pensar-en-consecuencias" },
      { title: "Decisiones de corto vs largo plazo", level: "Avanzado", slug: "decisiones-de-corto-vs-largo-plazo" },
    ],
  },
  {
    title: "Decisiones comunes en la vida real",
    lessons: [
      { title: "Decidir gastar", level: "Básico", slug: "decidir-gastar" },
      { title: "Decidir ahorrar", level: "Intermedio", slug: "decidir-ahorrar" },
      { title: "Decidir endeudarme", level: "Intermedio", slug: "decidir-endeudarme" },
      { title: "Decidir invertir", level: "Intermedio", slug: "decidir-invertir" },
      { title: "Decidir no hacer nada", level: "Avanzado", slug: "decidir-no-hacer-nada" },
    ],
  },
  {
    title: "Errores al decidir",
    lessons: [
      { title: "Decidir por presión social", level: "Intermedio", slug: "decidir-por-presion-social" },
      { title: "Decidir por miedo", level: "Intermedio", slug: "decidir-por-miedo" },
      { title: "Decidir por emoción", level: "Intermedio", slug: "decidir-por-emocion" },
      { title: "Cambiar de decisión constantemente", level: "Avanzado", slug: "cambiar-de-decision-constantemente" },
    ],
  },
  {
    title: "Construir criterio financiero",
    lessons: [
      { title: "Desarrollar criterio propio", level: "Intermedio", slug: "desarrollar-criterio-propio" },
      { title: "Aprender a decir no", level: "Intermedio", slug: "aprender-a-decir-no" },
      { title: "Tomar decisiones alineadas a mis objetivos", level: "Avanzado", slug: "tomar-decisiones-alineadas-a-mis-objetivos" },
      { title: "Ser consistente en mis decisiones", level: "Avanzado", slug: "ser-consistente-en-mis-decisiones" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Decidir con intención", level: "Intermedio", slug: "decidir-con-intencion" },
      { title: "Prepararme para la mentalidad emprendedora", level: "Intermedio", slug: "prepararme-para-la-mentalidad-emprendedora" },
      { title: "Checkpoint: Mis decisiones financieras", level: "Avanzado", slug: "checkpoint-mis-decisiones-financieras" },
    ],
  },
]
