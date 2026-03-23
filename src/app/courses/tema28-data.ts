export interface Tema28Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema28Subtema {
  title: string
  lessons: Tema28Lesson[]
}

export const TEMA28_TITLE = "Estrategia financiera personal"

export const TEMA28_SUBTEMAS: Tema28Subtema[] = [
  {
    title: "Diseño",
    lessons: [
      { title: "Mis prioridades reales (orden)", slug: "mis-prioridades-reales-orden", level: "Básico" },
      { title: "Mis reglas de gasto (claras)", slug: "mis-reglas-de-gasto-claras", level: "Básico" },
      { title: "Mis reglas de ahorro (mínimos)", slug: "mis-reglas-de-ahorro-minimos", level: "Intermedio" },
      { title: "Mis reglas de deuda (límites)", slug: "mis-reglas-de-deuda-limites", level: "Intermedio" },
      { title: "Checkpoint: mi manual de dinero v1", slug: "checkpoint-mi-manual-de-dinero-v1", level: "Avanzado" },
    ]
  },
  {
    title: "Plan 12 meses",
    lessons: [
      { title: "Plan anual simple (metas)", slug: "plan-anual-simple-metas", level: "Básico" },
      { title: "Escenarios: si gano más", slug: "escenarios-si-gano-mas", level: "Básico" },
      { title: "Escenarios: si gano menos", slug: "escenarios-si-gano-menos", level: "Intermedio" },
      { title: "Ajustes trimestrales (sin drama)", slug: "ajustes-trimestrales-sin-drama", level: "Intermedio" },
      { title: "Caso: corregir un plan que falló", slug: "caso-corregir-un-plan-que-fallo", level: "Avanzado" },
    ]
  },
  {
    title: "Seguimiento",
    lessons: [
      { title: "Métricas personales (3 indicadores)", slug: "metricas-personales-3-indicadores", level: "Básico" },
      { title: "Revisión mensual (20 min)", slug: "revision-mensual-20-min", level: "Básico" },
      { title: "Revisión trimestral (1 hora)", slug: "revision-trimestral-1-hora", level: "Intermedio" },
      { title: "Automatizar decisiones (menos estrés)", slug: "automatizar-decisiones-menos-estres", level: "Intermedio" },
      { title: "Checkpoint: mi sistema de seguimiento", slug: "checkpoint-mi-sistema-de-seguimiento", level: "Avanzado" },
    ]
  },
]
