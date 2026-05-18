export interface Tema16Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema16Subtema {
  title: string
  lessons: Tema16Lesson[]
}

export const TEMA16_TITLE = "Protección financiera (seguros)"

export const TEMA16_SUBTEMAS: Tema16Subtema[] = [
  {
    title: "Riesgo",
    lessons: [
      { title: "¿Qué es riesgo financiero (con ejemplos)?", slug: "que-es-riesgo-financiero-con-ejemplos", level: "Básico" },
      { title: "Riesgos típicos en jóvenes (salud, robo, accidente)", slug: "riesgos-tipicos-en-jovenes-salud-robo-accidente", level: "Básico" },
      { title: "Probabilidad vs impacto (lo importante)", slug: "probabilidad-vs-impacto-lo-importante", level: "Intermedio" },
      { title: "¿Qué riesgos se previenen con hábitos?", slug: "que-riesgos-se-previenen-con-habitos", level: "Intermedio" },
      { title: "Checklist de riesgos personales básico", slug: "checklist-de-riesgos-personales-basico", level: "Avanzado" },
    ]
  },
  {
    title: "Seguros",
    lessons: [
      { title: "¿Qué es un seguro y cómo funciona?", slug: "que-es-un-seguro-y-como-funciona", level: "Básico" },
      { title: "Deducible, prima, cobertura (simple)", slug: "deducible-prima-cobertura-simple", level: "Básico" },
      { title: "Seguro útil vs seguro innecesario (criterios)", slug: "seguro-util-vs-seguro-innecesario-criterios", level: "Intermedio" },
      { title: "Errores comunes al contratar", slug: "errores-comunes-al-contratar", level: "Intermedio" },
      { title: "Caso: elegir una cobertura básica correcta", slug: "caso-elegir-una-cobertura-basica-correcta", level: "Avanzado" },
    ]
  },
  {
    title: "Prevención + colchón",
    lessons: [
      { title: "Fondo de emergencia vs seguro (diferencia)", slug: "fondo-de-emergencia-vs-seguro-diferencia", level: "Básico" },
      { title: "¿Qué conviene primero según tu situación?", slug: "que-conviene-primero-segun-tu-situacion", level: "Básico" },
      { title: "Evitar gastos catastróficos (reglas)", slug: "evitar-gastos-catastroficos-reglas", level: "Intermedio" },
      { title: "Plan básico de protección personal", slug: "plan-basico-de-proteccion-personal", level: "Intermedio" },
      { title: "Caso: imprevisto y qué herramienta usar", slug: "caso-imprevisto-y-que-herramienta-usar", level: "Avanzado" },
    ]
  },
]
