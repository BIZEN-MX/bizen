export interface Tema8Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema8Subtema {
  title: string
  lessons: Tema8Lesson[]
}

export const TEMA8_TITLE = "Ahorro"

export const TEMA8_SUBTEMAS: Tema8Subtema[] = [
  {
    title: "Fundamentos",
    lessons: [
      { title: "Ahorrar no es guardar lo que sobra", slug: "ahorrar-no-es-guardar-lo-que-sobra", level: "Básico" },
      { title: "Pagarte a ti primero", slug: "pagarte-a-ti-primero", level: "Básico" },
      { title: "Separar ahorro y gasto (físico o digital)", slug: "separar-ahorro-y-gasto-fisico-o-digital", level: "Intermedio" },
      { title: "Ahorrar con ingresos variables", slug: "ahorrar-con-ingresos-variables", level: "Intermedio" },
      { title: "Errores comunes al ahorrar", slug: "errores-comunes-al-ahorrar", level: "Avanzado" },
    ]
  },
  {
    title: "Fondo de emergencia",
    lessons: [
      { title: "¿Qué es y por qué existe?", slug: "que-es-y-por-que-existe", level: "Básico" },
      { title: "¿Cuánto necesito (simple)?", slug: "cuanto-necesito-simple", level: "Básico" },
      { title: "¿Cómo empezar con poco?", slug: "como-empezar-con-poco", level: "Intermedio" },
      { title: "¿Cuándo se usa y cuándo no?", slug: "cuando-se-usa-y-cuando-no", level: "Intermedio" },
      { title: "Reconstruir el fondo después", slug: "reconstruir-el-fondo-despues", level: "Avanzado" },
    ]
  },
  {
    title: "Ahorro constante",
    lessons: [
      { title: "Automatizar ahorro (simulado)", slug: "automatizar-ahorro-simulado", level: "Básico" },
      { title: "Ahorro por metas", slug: "ahorro-por-metas", level: "Básico" },
      { title: "Micro-ahorros diarios", slug: "micro-ahorros-diarios", level: "Intermedio" },
      { title: "Ahorro en crisis", slug: "ahorro-en-crisis", level: "Intermedio" },
      { title: "Mantener constancia 3 meses", slug: "mantener-constancia-3-meses", level: "Avanzado" },
    ]
  },
]
