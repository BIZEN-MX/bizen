export interface Tema23Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema23Subtema {
  title: string
  lessons: Tema23Lesson[]
}

export const TEMA23_TITLE = "Ingresos pasivos"

export const TEMA23_SUBTEMAS: Tema23Subtema[] = [
  {
    title: "Realidad (sin humo)",
    lessons: [
      { title: "¿Qué sí es ingreso pasivo?", slug: "que-si-es-ingreso-pasivo", level: "Básico" },
      { title: "¿Qué NO es ingreso pasivo (mitos)?", slug: "que-no-es-ingreso-pasivo-mitos", level: "Básico" },
      { title: "“Pasivo” casi siempre requiere trabajo antes", slug: "pasivo-casi-siempre-requiere-trabajo-antes", level: "Intermedio" },
      { title: "Tiempo, capital y riesgo en ingresos pasivos", slug: "tiempo-capital-y-riesgo-en-ingresos-pasivos", level: "Intermedio" },
      { title: "Señales de estafa del “pasivo rápido”", slug: "senales-de-estafa-del-pasivo-rapido", level: "Avanzado" },
    ]
  },
  {
    title: "Bases",
    lessons: [
      { title: "Primero activo, luego ingreso pasivo", slug: "primero-activo-luego-ingreso-pasivo", level: "Básico" },
      { title: "Capital: de dónde sale en la vida real", slug: "capital-de-donde-sale-en-la-vida-real", level: "Básico" },
      { title: "Reglas para no caer en promesas falsas", slug: "reglas-para-no-caer-en-promesas-falsas", level: "Intermedio" },
      { title: "Pasivo pequeño vs pasivo grande", slug: "pasivo-pequeno-vs-pasivo-grande", level: "Intermedio" },
      { title: "Caso: evaluar una propuesta “pasiva”", slug: "caso-evaluar-una-propuesta-pasiva", level: "Avanzado" },
    ]
  },
  {
    title: "Ejemplos realistas",
    lessons: [
      { title: "Ejemplos simples (bajo riesgo)", slug: "ejemplos-simples-bajo-riesgo", level: "Básico" },
      { title: "Ejemplos moderados (más riesgo)", slug: "ejemplos-moderados-mas-riesgo", level: "Básico" },
      { title: "Ejemplos digitales (con trabajo previo)", slug: "ejemplos-digitales-con-trabajo-previo", level: "Intermedio" },
      { title: "Errores comunes al intentar pasivos", slug: "errores-comunes-al-intentar-pasivos", level: "Intermedio" },
      { title: "Checkpoint: distinguir pasivo real vs mito", slug: "checkpoint-distinguir-pasivo-real-vs-mito", level: "Avanzado" },
    ]
  },
]
