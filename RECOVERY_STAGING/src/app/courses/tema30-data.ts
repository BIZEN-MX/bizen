export interface Tema30Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema30Subtema {
  title: string
  lessons: Tema30Lesson[]
}

export const TEMA30_TITLE = "Emprendimiento financiero"

export const TEMA30_SUBTEMAS: Tema30Subtema[] = [
  {
    title: "Números del negocio",
    lessons: [
      { title: "Ingresos, costos y utilidad (negocio)", slug: "ingresos-costos-y-utilidad-negocio", level: "Básico" },
      { title: "Costos fijos vs variables (negocio)", slug: "costos-fijos-vs-variables-negocio", level: "Básico" },
      { title: "Margen: por qué importa", slug: "margen-por-que-importa", level: "Intermedio" },
      { title: "Flujo de efectivo del negocio (oxígeno)", slug: "flujo-de-efectivo-del-negocio-oxigeno", level: "Intermedio" },
      { title: "Caso: negocio con ventas pero sin dinero", slug: "caso-negocio-con-ventas-pero-sin-dinero", level: "Avanzado" },
    ]
  },
  {
    title: "Precio",
    lessons: [
      { title: "Precio vs valor (sin pena cobrar)", slug: "precio-vs-valor-sin-pena-cobrar", level: "Básico" },
      { title: "¿Cómo poner precio (3 métodos simples)?", slug: "como-poner-precio-3-metodos-simples", level: "Básico" },
      { title: "Errores al cobrar barato", slug: "errores-al-cobrar-barato", level: "Intermedio" },
      { title: "Subir precio sin perder clientes (idea)", slug: "subir-precio-sin-perder-clientes-idea", level: "Intermedio" },
      { title: "Caso: ajustar precio para ser rentable", slug: "caso-ajustar-precio-para-ser-rentable", level: "Avanzado" },
    ]
  },
  {
    title: "Crecer",
    lessons: [
      { title: "Reinvertir vs sacar ganancias (decisión clave)", slug: "reinvertir-vs-sacar-ganancias-decision-clave", level: "Básico" },
      { title: "Separar finanzas personales y del negocio", slug: "separar-finanzas-personales-y-del-negocio", level: "Básico" },
      { title: "Escalar sin morir de flujo", slug: "escalar-sin-morir-de-flujo", level: "Intermedio" },
      { title: "Indicadores básicos (ventas, margen, flujo)", slug: "indicadores-basicos-ventas-margen-flujo", level: "Intermedio" },
      { title: "Checkpoint: plan financiero de mi negocio", slug: "checkpoint-plan-financiero-de-mi-negocio", level: "Avanzado" },
    ]
  },
]
