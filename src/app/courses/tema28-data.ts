export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema28Lesson {
  title: string
  level: LessonLevel
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
      { title: "Qué es una crisis financiera personal", level: "Básico", slug: "que-es-una-crisis-financiera-personal" },
      { title: "Crisis esperadas e inesperadas", level: "Intermedio", slug: "crisis-esperadas-e-inesperadas" },
    ],
  },
  {
    title: "Reaccionar ante la crisis",
    lessons: [
      { title: "Qué hacer cuando falta dinero", level: "Intermedio", slug: "que-hacer-cuando-falta-dinero" },
      { title: "Priorizar en momentos difíciles", level: "Intermedio", slug: "priorizar-en-momentos-dificiles" },
    ],
  },
  {
    title: "Manejar pérdidas",
    lessons: [
      { title: "Pérdida de ingresos", level: "Intermedio", slug: "perdida-de-ingresos" },
      { title: "Endeudarse en crisis", level: "Avanzado", slug: "endeudarse-en-crisis" },
    ],
  },
  {
    title: "Recuperarse",
    lessons: [
      { title: "Reconstruir finanzas después de una crisis", level: "Avanzado", slug: "reconstruir-finanzas-despues-de-una-crisis" },
      { title: "Aprender de la crisis", level: "Avanzado", slug: "aprender-de-la-crisis" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Fortalecerme después de una crisis", level: "Intermedio", slug: "fortalecerme-despues-de-una-crisis" },
      { title: "Checkpoint: Mi plan ante crisis", level: "Avanzado", slug: "checkpoint-mi-plan-ante-crisis" },
    ],
  },
]
