export interface Tema19Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema19Subtema {
  title: string
  lessons: Tema19Lesson[]
}

export const TEMA19_TITLE = "Educación financiera digital"

export const TEMA19_SUBTEMAS: Tema19Subtema[] = [
  {
    title: "Herramientas",
    lessons: [
      { title: "Apps para registrar gastos (qué deben tener)", slug: "apps-para-registrar-gastos-que-deben-tener", level: "Básico" },
      { title: "Apps para metas y ahorro (cómo usarlas)", slug: "apps-para-metas-y-ahorro-como-usarlas", level: "Básico" },
      { title: "Alertas bancarias (qué activar)", slug: "alertas-bancarias-que-activar", level: "Intermedio" },
      { title: "Control de suscripciones (herramientas)", slug: "control-de-suscripciones-herramientas", level: "Intermedio" },
      { title: "Armar tu “stack” financiero digital básico", slug: "armar-tu-stack-financiero-digital-basico", level: "Avanzado" },
    ]
  },
  {
    title: "Banca digital",
    lessons: [
      { title: "Transferencias, límites y horarios (vida real)", slug: "transferencias-limites-y-horarios-vida-real", level: "Básico" },
      { title: "Comisiones digitales comunes (cuidado)", slug: "comisiones-digitales-comunes-cuidado", level: "Básico" },
      { title: "Tarjetas digitales/virtuales (qué son)", slug: "tarjetas-digitalesvirtuales-que-son", level: "Intermedio" },
      { title: "¿Cómo evitar errores en banca móvil?", slug: "como-evitar-errores-en-banca-movil", level: "Intermedio" },
      { title: "Caso: configurar banca digital de forma segura", slug: "caso-configurar-banca-digital-de-forma-segura", level: "Avanzado" },
    ]
  },
  {
    title: "Hábitos digitales",
    lessons: [
      { title: "Rutina semanal (10 min) en apps", slug: "rutina-semanal-10-min-en-apps", level: "Básico" },
      { title: "Rutina mensual (20 min) en apps", slug: "rutina-mensual-20-min-en-apps", level: "Básico" },
      { title: "Orden digital de recibos/tickets", slug: "orden-digital-de-recibostickets", level: "Intermedio" },
      { title: "Evitar compras impulsivas online (reglas)", slug: "evitar-compras-impulsivas-online-reglas", level: "Intermedio" },
      { title: "Mini reto: semana con control digital", slug: "mini-reto-semana-con-control-digital", level: "Avanzado" },
    ]
  },
]
