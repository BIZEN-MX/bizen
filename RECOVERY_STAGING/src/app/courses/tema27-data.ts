export interface Tema27Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema27Subtema {
  title: string
  lessons: Tema27Lesson[]
}

export const TEMA27_TITLE = "Construcción de patrimonio"

export const TEMA27_SUBTEMAS: Tema27Subtema[] = [
  {
    title: "Base",
    lessons: [
      { title: "¿Qué es patrimonio neto (simple)?", slug: "que-es-patrimonio-neto-simple", level: "Básico" },
      { title: "¿Cómo medirlo sin complicarte?", slug: "como-medirlo-sin-complicarte", level: "Básico" },
      { title: "Activos, pasivos y patrimonio (conexión)", slug: "activos-pasivos-y-patrimonio-conexion", level: "Intermedio" },
      { title: "Patrimonio vs ingreso (diferencia)", slug: "patrimonio-vs-ingreso-diferencia", level: "Intermedio" },
      { title: "Mini práctica: calcular patrimonio neto básico", slug: "mini-practica-calcular-patrimonio-neto-basico", level: "Avanzado" },
    ]
  },
  {
    title: "Crecimiento",
    lessons: [
      { title: "Hábitos que construyen patrimonio", slug: "habitos-que-construyen-patrimonio", level: "Básico" },
      { title: "Decisiones que destruyen patrimonio", slug: "decisiones-que-destruyen-patrimonio", level: "Básico" },
      { title: "Reinvertir vs gastar ganancias", slug: "reinvertir-vs-gastar-ganancias", level: "Intermedio" },
      { title: "Aumentar patrimonio con consistencia", slug: "aumentar-patrimonio-con-consistencia", level: "Intermedio" },
      { title: "Caso: dos caminos, dos patrimonios", slug: "caso-dos-caminos-dos-patrimonios", level: "Avanzado" },
    ]
  },
  {
    title: "Largo plazo",
    lessons: [
      { title: "Pensar en décadas sin volverte loco", slug: "pensar-en-decadas-sin-volverte-loco", level: "Básico" },
      { title: "Evitar “crecer y gastar todo”", slug: "evitar-crecer-y-gastar-todo", level: "Básico" },
      { title: "Reglas de protección del patrimonio", slug: "reglas-de-proteccion-del-patrimonio", level: "Intermedio" },
      { title: "Plan anual de patrimonio (simple)", slug: "plan-anual-de-patrimonio-simple", level: "Intermedio" },
      { title: "Checkpoint: mi mapa patrimonial", slug: "checkpoint-mi-mapa-patrimonial", level: "Avanzado" },
    ]
  },
]
