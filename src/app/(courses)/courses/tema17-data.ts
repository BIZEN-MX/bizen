export interface Tema17Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema17Subtema {
  title: string
  lessons: Tema17Lesson[]
}

export const TEMA17_TITLE = "Impuestos básicos"

export const TEMA17_SUBTEMAS: Tema17Subtema[] = [
  {
    title: "Lo esencial",
    lessons: [
      { title: "¿Por qué existen los impuestos (sin política)?", slug: "por-que-existen-los-impuestos-sin-politica", level: "Básico" },
      { title: "IVA explicado fácil (en tu vida diaria)", slug: "iva-explicado-facil-en-tu-vida-diaria", level: "Básico" },
      { title: "ISR explicado simple (idea general)", slug: "isr-explicado-simple-idea-general", level: "Intermedio" },
      { title: "Impuestos visibles e invisibles", slug: "impuestos-visibles-e-invisibles", level: "Intermedio" },
      { title: "¿Por qué a ti te importa aunque seas joven?", slug: "por-que-a-ti-te-importa-aunque-seas-joven", level: "Avanzado" },
    ]
  },
  {
    title: "Vida real",
    lessons: [
      { title: "Ticket vs factura (diferencias)", slug: "ticket-vs-factura-diferencias", level: "Básico" },
      { title: "Para qué sirve una factura realmente", slug: "para-que-sirve-una-factura-realmente", level: "Básico" },
      { title: "Errores típicos (no pedir factura, datos mal)", slug: "errores-tipicos-no-pedir-factura-datos-mal", level: "Intermedio" },
      { title: "Multas, recargos y “por qué pagar tarde pega”", slug: "multas-recargos-y-por-que-pagar-tarde-pega", level: "Intermedio" },
      { title: "Caso: leer un ticket y detectar IVA", slug: "caso-leer-un-ticket-y-detectar-iva", level: "Avanzado" },
    ]
  },
  {
    title: "Decisiones e ingresos",
    lessons: [
      { title: "Ingresos y obligaciones (concepto)", slug: "ingresos-y-obligaciones-concepto", level: "Básico" },
      { title: "¿Qué cambia si trabajas formal vs informal (simple)?", slug: "que-cambia-si-trabajas-formal-vs-informal-simple", level: "Básico" },
      { title: "Deducciones: qué son (sin complicar)", slug: "deducciones-que-son-sin-complicar", level: "Intermedio" },
      { title: "Buenas prácticas básicas (orden)", slug: "buenas-practicas-basicas-orden", level: "Intermedio" },
      { title: "Mini simulación: ingreso + impuesto (simple)", slug: "mini-simulacion-ingreso-impuesto-simple", level: "Avanzado" },
    ]
  },
]
