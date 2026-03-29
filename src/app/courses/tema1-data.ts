export interface Tema1Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema1Subtema {
  title: string
  lessons: Tema1Lesson[]
}

export const TEMA1_TITLE = "Operativo BIZEN: El Sistema Financiero"

export const TEMA1_SUBTEMAS: Tema1Subtema[] = [
  {
    title: "El Tablero Real",
    lessons: [
      { title: "Las Reglas del Sistema Financiero", slug: "las-reglas-del-sistema-financiero", level: "Básico" },
      { title: "¿Qué es el dinero? (Deuda vs Energía)", slug: "que-es-el-dinero-deuda-vs-energia", level: "Básico" },
      { title: "Tu Primer Estado de Resultados", slug: "tu-primer-estado-de-resultados-personal", level: "Intermedio" },
      { title: "El Criterio de Realidad (Datos vs Opinión)", slug: "el-criterio-de-realidad-datos-vs-opinion", level: "Intermedio" },
      { title: "El Mapa del Tesoro (Encontrando el flujo)", slug: "el-mapa-del-tesoro-encontrando-el-flujo", level: "Avanzado" },
    ]
  },
  {
    title: "El Registro de Guerra",
    lessons: [
      { title: "El Registro de Guerra (Por qué trackear)", slug: "el-registro-de-guerra-por-que-trackear-todo", level: "Básico" },
      { title: "Clasificación de Gastos (Fijos vs Variables)", slug: "gastos-fijos-vs-variables", level: "Básico" },
      { title: "Gastos Hormiga (Fugas Diarias)", slug: "que-son-y-por-que-importan", level: "Intermedio" },
      { title: "El Blindaje de Cuenta (Cero comisiones)", slug: "el-blindaje-de-cuenta-cero-comisiones", level: "Intermedio" },
      { title: "El Filtro de Valor (Gasto vs Inversión)", slug: "el-filtro-de-valor-gasto-vs-inversion", level: "Avanzado" },
    ]
  },
  {
    title: "El Valor del Tiempo",
    lessons: [
      { title: "El Valor de tu Tiempo (Cálculo Real)", slug: "el-valor-de-tu-tiempo-calculo-real", level: "Básico" },
      { title: "Costo de Oportunidad (Elegir es Renunciar)", slug: "costo-de-oportunidad-elegir-es-renunciar", level: "Intermedio" },
      { title: "La Pausa de las 24 Horas", slug: "la-pausa-de-las-24-horas-mecanica", level: "Avanzado" },
      { title: "El Salario de tu 'Yo del Futuro'", slug: "el-salario-de-tu-yo-del-futuro", level: "Intermedio" },
      { title: "La Auditoría de Supervivencia", slug: "la-auditoria-de-supervivencia", level: "Avanzado" },
    ]
  },
  {
    title: "Certificación Operativa",
    lessons: [
      { title: "Examen de Sistema (Evaluación de Bloque)", slug: "evaluacion-bloque-1", level: "Avanzado" },
    ]
  },
]
