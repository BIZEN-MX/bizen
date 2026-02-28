export interface Tema28Lesson {
  title: string
  slug: string
}

export interface Tema28Subtema {
  title: string
  lessons: Tema28Lesson[]
}

export const TEMA28_SUBTEMAS: Tema28Subtema[] = [
  {
    title: "Entender la crisis",
    lessons: [
      { title: "¿Qué es una crisis financiera personal?", slug: "que-es-una-crisis-financiera-personal" },
      { title: "Crisis esperadas e inesperadas", slug: "crisis-esperadas-e-inesperadas" },
    ],
  },
  {
    title: "Reaccionar ante la crisis",
    lessons: [
      { title: "¿Qué hacer cuando falta dinero?", slug: "que-hacer-cuando-falta-dinero" },
      { title: "Priorizar en momentos difíciles", slug: "priorizar-en-momentos-dificiles" },
    ],
  },
  {
    title: "Manejar pérdidas",
    lessons: [
      { title: "Pérdida de ingresos", slug: "perdida-de-ingresos" },
      { title: "Endeudarse en crisis", slug: "endeudarse-en-crisis" },
    ],
  },
  {
    title: "Recuperarse",
    lessons: [
      { title: "Reconstruir finanzas después de una crisis", slug: "reconstruir-finanzas-despues-de-una-crisis" },
      { title: "Aprender de la crisis", slug: "aprender-de-la-crisis" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Fortalecerme después de una crisis", slug: "fortalecerme-despues-de-una-crisis" },
      { title: "Checkpoint: Mi plan ante crisis", slug: "checkpoint-mi-plan-ante-crisis" },
    ],
  },
]
