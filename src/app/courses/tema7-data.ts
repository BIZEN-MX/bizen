export interface Tema7Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema7Subtema {
  title: string
  lessons: Tema7Lesson[]
}

export const TEMA7_TITLE = "Hábitos financieros"

export const TEMA7_SUBTEMAS: Tema7Subtema[] = [
  {
    title: "Hábitos clave",
    lessons: [
      { title: "Registrar gastos (método simple)", slug: "registrar-gastos-metodo-simple", level: "Básico" },
      { title: "Revisar semanal (10 min)", slug: "revisar-semanal-10-min", level: "Básico" },
      { title: "Separar ahorro primero", slug: "separar-ahorro-primero", level: "Intermedio" },
      { title: "Regla de compras (pausa)", slug: "regla-de-compras-pausa", level: "Intermedio" },
      { title: "Hábito de “cierre mensual”", slug: "habito-de-cierre-mensual", level: "Avanzado" },
    ]
  },
  {
    title: "Constancia",
    lessons: [
      { title: "Motivación vs disciplina", slug: "motivacion-vs-disciplina", level: "Básico" },
      { title: "¿Cómo sostener hábitos 30 días?", slug: "como-sostener-habitos-30-dias", level: "Básico" },
      { title: "Recaídas: cómo volver sin culpa", slug: "recaidas-como-volver-sin-culpa", level: "Intermedio" },
      { title: "Hábito mínimo (cuando no tienes ganas)", slug: "habito-minimo-cuando-no-tienes-ganas", level: "Intermedio" },
      { title: "Sistema de recompensas (sin gastar)", slug: "sistema-de-recompensas-sin-gastar", level: "Avanzado" },
    ]
  },
  {
    title: "Sistema personal",
    lessons: [
      { title: "Diseñar mi rutina financiera", slug: "disenar-mi-rutina-financiera", level: "Básico" },
      { title: "Mi checklist semanal", slug: "mi-checklist-semanal", level: "Básico" },
      { title: "Mi checklist mensual", slug: "mi-checklist-mensual", level: "Intermedio" },
      { title: "Mi regla de “no deuda mala”", slug: "mi-regla-de-no-deuda-mala", level: "Intermedio" },
      { title: "Mi sistema completo (resumen)", slug: "mi-sistema-completo-resumen", level: "Avanzado" },
    ]
  },
]
