export interface Tema15Lesson {
  title: string
  slug: string
}

export interface Tema15Subtema {
  title: string
  lessons: Tema15Lesson[]
}

export const TEMA15_SUBTEMAS: Tema15Subtema[] = [
  {
    title: "¿Qué es decidir bien con dinero?",
    lessons: [
      { title: "¿Qué es una decisión financiera?", slug: "que-es-una-decision-financiera" },
      { title: "Decidir vs reaccionar", slug: "decidir-vs-reaccionar" },
      { title: "¿Por qué decidir con dinero es difícil?", slug: "por-que-decidir-con-dinero-es-dificil" },
      { title: "Responsabilidad en las decisiones", slug: "responsabilidad-en-las-decisiones" },
    ],
  },
  {
    title: "Proceso de decisión",
    lessons: [
      { title: "Pensar antes de decidir", slug: "pensar-antes-de-decidir" },
      { title: "Información vs impulso", slug: "informacion-vs-impulso" },
      { title: "Evaluar opciones", slug: "evaluar-opciones" },
      { title: "Pensar en consecuencias", slug: "pensar-en-consecuencias" },
      { title: "Decisiones de corto vs largo plazo", slug: "decisiones-de-corto-vs-largo-plazo" },
    ],
  },
  {
    title: "Decisiones comunes en la vida real",
    lessons: [
      { title: "Decidir gastar", slug: "decidir-gastar" },
      { title: "Decidir ahorrar", slug: "decidir-ahorrar" },
      { title: "Decidir endeudarme", slug: "decidir-endeudarme" },
      { title: "Decidir invertir", slug: "decidir-invertir" },
      { title: "Decidir no hacer nada", slug: "decidir-no-hacer-nada" },
    ],
  },
  {
    title: "Errores al decidir",
    lessons: [
      { title: "Decidir por presión social", slug: "decidir-por-presion-social" },
      { title: "Decidir por miedo", slug: "decidir-por-miedo" },
      { title: "Decidir por emoción", slug: "decidir-por-emocion" },
      { title: "Cambiar de decisión constantemente", slug: "cambiar-de-decision-constantemente" },
    ],
  },
  {
    title: "Construir criterio financiero",
    lessons: [
      { title: "Desarrollar criterio propio", slug: "desarrollar-criterio-propio" },
      { title: "Aprender a decir no", slug: "aprender-a-decir-no" },
      { title: "Tomar decisiones alineadas a mis objetivos", slug: "tomar-decisiones-alineadas-a-mis-objetivos" },
      { title: "Ser consistente en mis decisiones", slug: "ser-consistente-en-mis-decisiones" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Decidir con intención", slug: "decidir-con-intencion" },
      { title: "Prepararme para la mentalidad emprendedora", slug: "prepararme-para-la-mentalidad-emprendedora" },
      { title: "Checkpoint: Mis decisiones financieras", slug: "checkpoint-mis-decisiones-financieras" },
    ],
  },
]
