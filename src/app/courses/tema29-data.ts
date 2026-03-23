export interface Tema29Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema29Subtema {
  title: string
  lessons: Tema29Lesson[]
}

export const TEMA29_TITLE = "Libertad financiera"

export const TEMA29_SUBTEMAS: Tema29Subtema[] = [
  {
    title: "Definición real",
    lessons: [
      { title: "¿Qué es libertad financiera (realista)?", slug: "que-es-libertad-financiera-realista", level: "Básico" },
      { title: "¿Qué NO es (lujo, fama, “dinero infinito”)?", slug: "que-no-es-lujo-fama-dinero-infinito", level: "Básico" },
      { title: "Libertad vs apariencia de libertad", slug: "libertad-vs-apariencia-de-libertad", level: "Intermedio" },
      { title: "Libertad como margen y opciones", slug: "libertad-como-margen-y-opciones", level: "Intermedio" },
      { title: "Mini práctica: identificar libertad real en escenarios", slug: "mini-practica-identificar-libertad-real-en-escenarios", level: "Avanzado" },
    ]
  },
  {
    title: "Camino",
    lessons: [
      { title: "Control → crecimiento → patrimonio (ruta)", slug: "control-crecimiento-patrimonio-ruta", level: "Básico" },
      { title: "Errores que retrasan libertad (deuda, impulsos)", slug: "errores-que-retrasan-libertad-deuda-impulsos", level: "Básico" },
      { title: "Aumentar margen sin aumentar estrés", slug: "aumentar-margen-sin-aumentar-estres", level: "Intermedio" },
      { title: "Reglas para sostener el camino", slug: "reglas-para-sostener-el-camino", level: "Intermedio" },
      { title: "Caso: plan realista hacia libertad", slug: "caso-plan-realista-hacia-libertad", level: "Avanzado" },
    ]
  },
  {
    title: "Medición",
    lessons: [
      { title: "Métrica simple de avance (sin complicar)", slug: "metrica-simple-de-avance-sin-complicar", level: "Básico" },
      { title: "Tiempo: cuánto te falta (estimación)", slug: "tiempo-cuanto-te-falta-estimacion", level: "Básico" },
      { title: "Ajustar estrategia sin abandonar", slug: "ajustar-estrategia-sin-abandonar", level: "Intermedio" },
      { title: "Mantener hábitos cuando ya te va bien", slug: "mantener-habitos-cuando-ya-te-va-bien", level: "Intermedio" },
      { title: "Checkpoint: mi indicador de libertad", slug: "checkpoint-mi-indicador-de-libertad", level: "Avanzado" },
    ]
  },
]
