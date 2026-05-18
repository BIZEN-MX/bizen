export interface Tema20Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema20Subtema {
  title: string
  lessons: Tema20Lesson[]
}

export const TEMA20_TITLE = "La Inflación"

export const TEMA20_SUBTEMAS: Tema20Subtema[] = [
  {
    title: "Concepto",
    lessons: [
      { title: "¿Qué es la inflación (sin tecnicismos)?", slug: "que-es-inflacion-sin-tecnicismos", level: "Básico" },
      { title: "¿Por qué suben los precios?", slug: "por-que-suben-precios-causas-simples", level: "Básico" },
      { title: "¿Cuál es la diferencia entre inflación y que todo esté caro?", slug: "inflacion-vs-que-todo-esta-caro", level: "Intermedio" },
      { title: "¿En qué se diferencia la inflación baja de la alta?", slug: "diferencia-entre-inflacion-baja-y-alta", level: "Intermedio" },
      { title: "Estudio de caso: ¿Cuánto han subido los precios en 2 años?", slug: "caso-precios-hoy-vs-hace-2-anos", level: "Avanzado" },
    ]
  },
  {
    title: "Impacto personal",
    lessons: [
      { title: "¿Cómo afecta la inflación a tu ahorro?", slug: "como-afecta-tu-ahorro", level: "Básico" },
      { title: "¿Cómo afecta la inflación a tus ingresos?", slug: "como-afecta-tu-salario-o-mesada", level: "Básico" },
      { title: "¿Cuáles son los errores comunes durante la inflación?", slug: "errores-comunes-en-inflacion-compras-impulsivas", level: "Intermedio" },
      { title: "¿Cómo ajustar tu presupuesto para la inflación?", slug: "ajustar-presupuesto-en-inflacion", level: "Intermedio" },
      { title: "Simulación: ¿Cómo afecta la inflación a tu poder de compra?", slug: "mini-simulacion-inflacion-y-poder-de-compra", level: "Avanzado" },
    ]
  },
  {
    title: "Estrategia",
    lessons: [
      { title: "¿Cómo protegerte de la inflación sin entrar en pánico?", slug: "protegerte-sin-panico-reglas", level: "Básico" },
      { title: "¿Qué decisiones te ayudan ante la inflación?", slug: "que-decisiones-ayudan-ahorro-gasto-ingresos", level: "Básico" },
      { title: "¿Cómo afecta la inflación a tus deudas?", slug: "inflacion-y-deuda-que-conviene", level: "Intermedio" },
      { title: "¿Cómo proteger tus inversiones de la inflación?", slug: "inflacion-e-inversion-idea-base", level: "Intermedio" },
      { title: "¿Cómo armar un plan financiero para épocas caras?", slug: "plan-simple-para-epocas-caras", level: "Avanzado" },
    ]
  },
]
