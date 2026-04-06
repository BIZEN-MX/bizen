
export interface LiveQuiz {
  id: string
  title: string
  icon: string
  description: string
  category: string
  difficulty: number
  estimatedMinutes: number
  questionCount: number
  gradient: string
  glow: string
  questions: any[]
}

export const QUIZ_CATALOG: LiveQuiz[] = [
  {
    id: "fundamentos",
    title: "Fundamentos de Dinero",
    icon: "money",
    description: "¿Sabes en qué gastas? Descubre los principios básicos del dinero y el ahorro.",
    category: "Básico",
    difficulty: 1,
    estimatedMinutes: 10,
    questionCount: 8,
    gradient: "linear-gradient(135deg, #0056E7 0%, #1983FD 100%)",
    glow: "rgba(0,86,231,0.4)",
    questions: [
      { question_text: "¿Cuánto deberías destinar a un fondo de emergencia?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "5% de tus ingresos", isCorrect: false }, { id: "b", text: "10% de tus ingresos", isCorrect: true }, { id: "c", text: "30% de tus ingresos", isCorrect: false }, { id: "d", text: "50% de tus ingresos", isCorrect: false }] },
      { question_text: "¿Cuál es la diferencia entre un gasto fijo y uno variable?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Los fijos cambian cada mes, los variables no", isCorrect: false }, { id: "b", text: "Los fijos son constantes (renta), los variables cambian (comida)", isCorrect: true }, { id: "c", text: "Ambos son exactamente iguales en un presupuesto", isCorrect: false }, { id: "d", text: "Los variables solo ocurren una vez al año", isCorrect: false }] },
      { question_text: "¿Qué es el interés compuesto?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Interés solo sobre el capital inicial", isCorrect: false }, { id: "b", text: "Interés sobre el capital e intereses acumulados", isCorrect: true }, { id: "c", text: "Una tarifa bancaria mensual", isCorrect: false }, { id: "d", text: "El porcentaje de impuesto sobre ingresos", isCorrect: false }] },
      { question_text: "¿Qué es la liquidez de un activo?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Su valor en el mercado", isCorrect: false }, { id: "b", text: "Qué tan rápido se puede convertir en efectivo", isCorrect: true }, { id: "c", text: "Su tasa de rendimiento anual", isCorrect: false }, { id: "d", text: "La cantidad de deuda asociada", isCorrect: false }] },
      { question_text: "¿Qué es una tarjeta de débito?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Un préstamo del banco", isCorrect: false }, { id: "b", text: "Acceso directo a tu dinero en cuenta", isCorrect: true }, { id: "c", text: "Una línea de crédito", isCorrect: false }, { id: "d", text: "Un instrumento de inversión", isCorrect: false }] },
      { question_text: "¿Si ahorras $100 al 10% anual, cuánto tienes después de 1 año con interés simple?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "$105", isCorrect: false }, { id: "b", text: "$110", isCorrect: true }, { id: "c", text: "$115", isCorrect: false }, { id: "d", text: "$120", isCorrect: false }] },
      { question_text: "¿Qué significa GDP o PIB?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El total de deuda gubernamental", isCorrect: false }, { id: "b", text: "El valor total de bienes y servicios producidos en un país", isCorrect: true }, { id: "c", text: "La tasa de desempleo nacional", isCorrect: false }, { id: "d", text: "El presupuesto federal anual", isCorrect: false }] },
      { question_text: "¿Cuál de estos es un gasto fijo?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Cena en restaurante", isCorrect: false }, { id: "b", text: "Renta mensual", isCorrect: true }, { id: "c", text: "Ropa nueva", isCorrect: false }, { id: "d", text: "Viaje de vacaciones", isCorrect: false }] },
    ]
  },
  {
    id: "inversiones",
    title: "Mundo de las Inversiones",
    icon: "chart",
    description: "¿Sabes qué es la bolsa? Aprende sobre acciones, bonos y cómo hacer crecer tu dinero.",
    category: "Intermedio",
    difficulty: 2,
    estimatedMinutes: 12,
    questionCount: 7,
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    glow: "rgba(14,165,233,0.4)",
    questions: [
      { question_text: "¿Qué es una acción (stock)?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un préstamo a una empresa", isCorrect: false }, { id: "b", text: "Una fracción de propiedad en una empresa", isCorrect: true }, { id: "c", text: "Un tipo de cuenta bancaria", isCorrect: false }, { id: "d", text: "Una moneda extranjera", isCorrect: false }] },
      { question_text: "¿Qué es diversificar un portafolio?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Poner todo en la inversión más rentable", isCorrect: false }, { id: "b", text: "Distribuir el dinero en distintos activos para reducir riesgo", isCorrect: true }, { id: "c", text: "Invertir solo en bienes raíces", isCorrect: false }, { id: "d", text: "Cambiar inversiones cada semana", isCorrect: false }] },
      { question_text: "¿Qué es un bono del gobierno?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Una acción de empresa pública", isCorrect: false }, { id: "b", text: "Un préstamo que le haces al gobierno", isCorrect: true }, { id: "c", text: "Un fondo de inversión mixto", isCorrect: false }, { id: "d", text: "Una divisa extranjera", isCorrect: false }] },
      { question_text: "¿Qué mide el índice S&P 500?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Las 500 empresas más grandes de México", isCorrect: false }, { id: "b", text: "El rendimiento de 500 grandes empresas de EE.UU.", isCorrect: true }, { id: "c", text: "El precio del dólar frente al peso", isCorrect: false }, { id: "d", text: "La inflación en Latinoamérica", isCorrect: false }] },
      { question_text: "¿Cuál es el riesgo principal de invertir en criptomonedas?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Son ilegales en México", isCorrect: false }, { id: "b", text: "Alta volatilidad y falta de regulación", isCorrect: true }, { id: "c", text: "Solo pueden comprarse en dólares", isCorrect: false }, { id: "d", text: "No generan ningún rendimiento", isCorrect: false }] },
      { question_text: "¿Qué es un ETF?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Una cuenta de ahorro especial", isCorrect: false }, { id: "b", text: "Un fondo que replica un índice y cotiza en bolsa", isCorrect: true }, { id: "c", text: "Un tipo de cuenta bancaria", isCorrect: false }, { id: "d", text: "Un tipo de criptomoneda", isCorrect: false }] },
      { question_text: "¿Qué significa 'rendimiento anualizado'?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Las ganancias totales de todos los años", isCorrect: false }, { id: "b", text: "La ganancia expresada como porcentaje anual equivalente", isCorrect: true }, { id: "c", text: "El precio de compra de un activo", isCorrect: false }, { id: "d", text: "Los impuestos pagados por inversión", isCorrect: false }] },
    ]
  },
  {
    id: "credito",
    title: "El Juego del Crédito",
    icon: "card",
    description: "Tarjetas, deudas, historial crediticio. ¿Sabes cómo jugar sin perder?",
    category: "Intermedio",
    difficulty: 2,
    estimatedMinutes: 10,
    questionCount: 6,
    gradient: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
    glow: "rgba(220,38,38,0.4)",
    questions: [
      { question_text: "¿Qué es el Buró de Crédito?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un banco del gobierno", isCorrect: false }, { id: "b", text: "Una empresa que registra tu historial crediticio", isCorrect: true }, { id: "c", text: "Una aseguradora de créditos", isCorrect: false }, { id: "d", text: "Un organismo que aprueba préstamos", isCorrect: false }] },
      { question_text: "¿Cuál es la consecuencia de pagar solo el mínimo en tu tarjeta?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "La deuda se congela", isCorrect: false }, { id: "b", text: "Los intereses se acumulan y la deuda crece", isCorrect: true }, { id: "c", text: "Obtienes más puntos de recompensa", isCorrect: false }, { id: "d", text: "Se cancela automáticamente al año", isCorrect: false }] },
      { question_text: "¿Qué es la CAT en un crédito?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "El límite de crédito disponible", isCorrect: false }, { id: "b", text: "El Costo Anual Total de un crédito, incluyendo comisiones", isCorrect: true }, { id: "c", text: "La cuota mensual fija del préstamo", isCorrect: false }, { id: "d", text: "El número de meses sin intereses", isCorrect: false }] },
      { question_text: "¿Cuánto de tu límite de crédito es recomendable usar?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El 100%, para maximizar beneficios", isCorrect: false }, { id: "b", text: "No más del 30%", isCorrect: true }, { id: "c", text: "El 50% exacto", isCorrect: false }, { id: "d", text: "Depende del banco únicamente", isCorrect: false }] },
      { question_text: "¿Qué es una hipoteca?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un seguro para tu hogar", isCorrect: false }, { id: "b", text: "Un préstamo a largo plazo con un inmueble como garantía", isCorrect: true }, { id: "c", text: "Un plan de ahorro mensual", isCorrect: false }, { id: "d", text: "Una inversión en bienes raíces", isCorrect: false }] },
      { question_text: "Pagar a tiempo tus deudas... ¿qué efecto tiene?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Aumenta tus impuestos", isCorrect: false }, { id: "b", text: "Mejora tu historial y score crediticio", isCorrect: true }, { id: "c", text: "Reduce tu límite de crédito", isCorrect: false }, { id: "d", text: "No tiene ningún efecto", isCorrect: false }] },
    ]
  },
  {
    id: "emprendimiento",
    title: "Mente Emprendedora",
    icon: "briefcase",
    description: "Del negocio a los números. Conoce lo que todo emprendedor debe saber de finanzas.",
    category: "Avanzado",
    difficulty: 3,
    estimatedMinutes: 15,
    questionCount: 8,
    gradient: "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
    glow: "rgba(180,83,9,0.4)",
    questions: [
      { question_text: "¿Qué es el punto de equilibrio en un negocio?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "El momento en que las ganancias son máximas", isCorrect: false }, { id: "b", text: "Cuando los ingresos igualan exactamente a los costos", isCorrect: true }, { id: "c", text: "El primer año de operaciones", isCorrect: false }, { id: "d", text: "La cantidad de productos vendidos al mes", isCorrect: false }] },
      { question_text: "¿Qué es el flujo de caja (cash flow)?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El saldo de la cuenta bancaria del negocio", isCorrect: false }, { id: "b", text: "El movimiento de entradas y salidas de dinero en un período", isCorrect: true }, { id: "c", text: "Las ganancias netas al final del año", isCorrect: false }, { id: "d", text: "El presupuesto de marketing", isCorrect: false }] },
      { question_text: "¿Qué es el margen de utilidad?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El total de ventas mensuales", isCorrect: false }, { id: "b", text: "La ganancia como porcentaje de los ingresos totales", isCorrect: true }, { id: "c", text: "El costo total de producción", isCorrect: false }, { id: "d", text: "El número de clientes atendidos", isCorrect: false }] },
      { question_text: "¿Qué es un MVP en emprendimiento?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El empleado más valioso del mes", isCorrect: false }, { id: "b", text: "Producto Mínimo Viable para validar una idea con el menor costo", isCorrect: true }, { id: "c", text: "Un modelo de valoración de empresas", isCorrect: false }, { id: "d", text: "Un plan de marketing digital", isCorrect: false }] },
      { question_text: "¿Qué significa que una empresa es scalable?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Que puede reducir costos fácilmente", isCorrect: false }, { id: "b", text: "Que puede crecer en ingresos sin aumentar costos proporcionalmente", isCorrect: true }, { id: "c", text: "Que tiene muchos empleados", isCorrect: false }, { id: "d", text: "Que opera en varios países", isCorrect: false }] },
      { question_text: "¿Cuál es la diferencia entre costo fijo y costo variable?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "No hay diferencia en la práctica", isCorrect: false }, { id: "b", text: "Los fijos no cambian con la producción; los variables sí", isCorrect: true }, { id: "c", text: "Los fijos se pagan solo una vez", isCorrect: false }, { id: "d", text: "Los variables son siempre más baratos", isCorrect: false }] },
      { question_text: "¿Qué es el ROI?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "El registro oficial de ingresos", isCorrect: false }, { id: "b", text: "El retorno sobre la inversión, ganancia vs lo invertido", isCorrect: true }, { id: "c", text: "El tipo de cambio del dólar", isCorrect: false }, { id: "d", text: "El reglamento de operaciones internas", isCorrect: false }] },
      { question_text: "Un negocio con alta deuda y bajo flujo de caja...", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Es el modelo más rentable", isCorrect: false }, { id: "b", text: "Tiene alto riesgo de insolvencia", isCorrect: true }, { id: "c", text: "Genera más confianza a inversores", isCorrect: false }, { id: "d", text: "Indica gran crecimiento futuro", isCorrect: false }] },
    ]
  },
  {
    id: "cripto",
    title: "Cripto & Web3",
    icon: "bitcoin",
    description: "Bitcoin, Blockchain y el futuro del internet. ¿Estás listo para la descentralización?",
    category: "Avanzado",
    difficulty: 3,
    estimatedMinutes: 12,
    questionCount: 7,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    glow: "rgba(245,158,11,0.4)",
    questions: [
      { question_text: "¿Quién es el creador anónimo de Bitcoin?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Elon Musk", isCorrect: false }, { id: "b", text: "Satoshi Nakamoto", isCorrect: true }, { id: "c", text: "Vitalik Buterin", isCorrect: false }, { id: "d", text: "Mark Zuckerberg", isCorrect: false }] },
      { question_text: "¿Qué es una 'Cold Wallet'?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Una cuenta en un exchange", isCorrect: false }, { id: "b", text: "Un dispositivo físico sin conexión a internet", isCorrect: true }, { id: "c", text: "Una cartera vacía", isCorrect: false }, { id: "d", text: "Una aplicación móvil", isCorrect: false }] },
      { question_text: "¿Cuál es el suministro máximo de Bitcoins que existirán?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "100 millones", isCorrect: false }, { id: "b", text: "21 millones", isCorrect: true }, { id: "c", text: "Infinito", isCorrect: false }, { id: "d", text: "50 millones", isCorrect: false }] },
      { question_text: "¿Qué significa 'HODL' en el mundo cripto?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Vender todo rápido", isCorrect: false }, { id: "b", text: "Mantener la inversión a largo plazo", isCorrect: true }, { id: "c", text: "Comprar solo en el pico", isCorrect: false }, { id: "d", text: "Perder las claves privadas", isCorrect: false }] },
      { question_text: "¿Qué es un NFT?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Una moneda igual a un billete", isCorrect: false }, { id: "b", text: "Un activo digital único e irrepetible", isCorrect: true }, { id: "c", text: "Un tipo de préstamo bancario", isCorrect: false }, { id: "d", text: "Una transferencia internacional", isCorrect: false }] },
      { question_text: "¿Qué red introdujo los 'Smart Contracts'?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Bitcoin", isCorrect: false }, { id: "b", text: "Ethereum", isCorrect: true }, { id: "c", text: "Solana", isCorrect: false }, { id: "d", text: "Dogecoin", isCorrect: false }] },
      { question_text: "¿Qué es el 'Gas' en una red blockchain?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Combustible real", isCorrect: false }, { id: "b", text: "Costo de transacción", isCorrect: true }, { id: "c", text: "Velocidad de internet", isCorrect: false }, { id: "d", text: "Valor de la moneda", isCorrect: false }] },
    ]
  },
  {
    id: "psicologia",
    title: "Psicología del Dinero",
    icon: "brain",
    description: "Tus emociones vs tu cartera. Aprende cómo tu mente decide tus gastos.",
    category: "Básico",
    difficulty: 1,
    estimatedMinutes: 10,
    questionCount: 6,
    gradient: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
    glow: "rgba(168,85,247,0.4)",
    questions: [
      { question_text: "¿Qué es la 'gratificación aplazada'?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Comprar algo hoy a meses sin intereses", isCorrect: false }, { id: "b", text: "Esperar para obtener un beneficio mayor después", isCorrect: true }, { id: "c", text: "No comprar nada nunca", isCorrect: false }, { id: "d", text: "Recibir un regalo de alguien", isCorrect: false }] },
      { question_text: "¿Qué son los 'gastos hormiga'?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "Gastos muy grandes e inesperados", isCorrect: false }, { id: "b", text: "Pequeños gastos diarios que afectan tu ahorro", isCorrect: true }, { id: "c", text: "Inversiones en pequeñas empresas", isCorrect: false }, { id: "d", text: "Comisiones bancarias", isCorrect: false }] },
      { question_text: "¿Qué es el 'Efecto Anclaje'?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Quedarse sin dinero al final de mes", isCorrect: false }, { id: "b", text: "Basar decisiones en la primera información recibida", isCorrect: true }, { id: "c", text: "Ahorrar en una cuenta fija", isCorrect: false }, { id: "d", text: "Invertir en barcos", isCorrect: false }] },
      { question_text: "¿Por qué compramos cosas que no necesitamos?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Por pura lógica", isCorrect: false }, { id: "b", text: "Por estatus social e impulsos emocionales", isCorrect: true }, { id: "c", text: "Porque siempre son baratas", isCorrect: false }, { id: "d", text: "No existe tal comportamiento", isCorrect: false }] },
      { question_text: "¿Qué es la aversión a la pérdida?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "El gusto por ganar dinero", isCorrect: false }, { id: "b", text: "Sentir más dolor al perder que placer al ganar lo mismo", isCorrect: true }, { id: "c", text: "Ocultar las deudas a la familia", isCorrect: false }, { id: "d", text: "Perder el miedo a invertir", isCorrect: false }] },
      { question_text: "¿Qué es la 'inflación del estilo de vida'?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Que los precios suban en el país", isCorrect: false }, { id: "b", text: "Aumentar tus gastos conforme subes tus ingresos", isCorrect: true }, { id: "c", text: "Comprar ropa de diseñador", isCorrect: false }, { id: "d", text: "Bajar de peso", isCorrect: false }] },
    ]
  },
  {
    id: "impuestos",
    title: "Sobreviviendo al SAT",
    icon: "file-text",
    description: "RFC, facturas y declaraciones. Lo que nadie te enseñó en la escuela sobre el SAT.",
    category: "Intermedio",
    difficulty: 2,
    estimatedMinutes: 12,
    questionCount: 6,
    gradient: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
    glow: "rgba(71,85,105,0.4)",
    questions: [
      { question_text: "¿Qué significan las siglas SAT?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Sistema de Ahorro para el Trabajo", isCorrect: false }, { id: "b", text: "Servicio de Administración Tributaria", isCorrect: true }, { id: "c", text: "Sindicato de Actividades Técnicas", isCorrect: false }, { id: "d", text: "Sociedad Anónima Tributaria", isCorrect: false }] },
      { question_text: "¿Qué es el RFC?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un permiso para trabajar", isCorrect: false }, { id: "b", text: "Registro Federal de Contribuyentes", isCorrect: true }, { id: "c", text: "Una clave de banco", isCorrect: false }, { id: "d", text: "Un número de seguro social", isCorrect: false }] },
      { question_text: "¿Cuál es el porcentaje general del IVA en México?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "8%", isCorrect: false }, { id: "b", text: "16%", isCorrect: true }, { id: "c", text: "21%", isCorrect: false }, { id: "d", text: "0%", isCorrect: false }] },
      { question_text: "¿En qué mes se presenta la Declaración Anual de personas físicas?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Enero", isCorrect: false }, { id: "b", text: "Abril", isCorrect: true }, { id: "c", text: "Diciembre", isCorrect: false }, { id: "d", text: "Agosto", isCorrect: false }] },
      { question_text: "¿Qué es una factura (CFDI)?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un recibo de compra cualquiera", isCorrect: false }, { id: "b", text: "Comprobante Fiscal Digital por Internet", isCorrect: true }, { id: "c", text: "Un contrato de servicios", isCorrect: false }, { id: "d", text: "Una nota de crédito", isCorrect: false }] },
      { question_text: "¿Qué es el ISR?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Impuesto sobre Ropa", isCorrect: false }, { id: "b", text: "Impuesto sobre la Renta", isCorrect: true }, { id: "c", text: "Inversión sobre Rendimiento", isCorrect: false }, { id: "d", text: "Índice de Salud Real", isCorrect: false }] },
    ]
  },
  {
    id: "retiro",
    title: "Tu Yo del Futuro",
    icon: "umbrella",
    description: "Retiro, AFORE y Seguros. Asegura tu estabilidad para cuando decidas dejar de trabajar.",
    category: "Intermedio",
    difficulty: 2,
    estimatedMinutes: 10,
    questionCount: 6,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    glow: "rgba(16,185,129,0.4)",
    questions: [
      { question_text: "¿Qué es una AFORE?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Un seguro de vida", isCorrect: false }, { id: "b", text: "Administradora de Fondos para el Retiro", isCorrect: true }, { id: "c", text: "Un tipo de préstamo para casa", isCorrect: false }, { id: "d", text: "Una cuenta de ahorro joven", isCorrect: false }] },
      { question_text: "¿Qué es un PPR?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Pequeño Préstamo Rápido", isCorrect: false }, { id: "b", text: "Plan Personal de Retiro", isCorrect: true }, { id: "c", text: "Pago por Reducción", isCorrect: false }, { id: "d", text: "Plan de Pagos Reales", isCorrect: false }] },
      { question_text: "En un seguro, ¿qué es el 'deducible'?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "Lo que el seguro te paga a ti", isCorrect: false }, { id: "b", text: "La cantidad que tú pagas antes de que el seguro cubra", isCorrect: true }, { id: "c", text: "El costo mensual del seguro", isCorrect: false }, { id: "d", text: "Un descuento en la póliza", isCorrect: false }] },
      { question_text: "¿Cuál es la ventaja fiscal de los planes de retiro?", question_type: "mcq", time_limit: 25, points_base: 1000, options: [{ id: "a", text: "No tienen ventaja", isCorrect: false }, { id: "b", text: "Son deducibles de impuestos", isCorrect: true }, { id: "c", text: "Te regalan dinero", isCorrect: false }, { id: "d", text: "Reducen el costo de la luz", isCorrect: false }] },
      { question_text: "¿Qué es un Seguro de Gastos Médicos Mayores?", question_type: "mcq", time_limit: 20, points_base: 1000, options: [{ id: "a", text: "Cubre consultas de gripe", isCorrect: false }, { id: "b", text: "Protección financiera ante hospitalizaciones graves", isCorrect: true }, { id: "c", text: "Un ahorro para comprar medicinas", isCorrect: false }, { id: "d", text: "Un seguro para mascotas", isCorrect: false }] },
      { question_text: "¿Cuándo es el mejor momento para empezar a ahorrar para el retiro?", question_type: "mcq", time_limit: 15, points_base: 1000, options: [{ id: "a", text: "A los 50 años", isCorrect: false }, { id: "b", text: "Hoy mismo", isCorrect: true }, { id: "c", text: "Cuando termines de pagar tu casa", isCorrect: false }, { id: "d", text: "Al jubilarte", isCorrect: false }] },
    ]
  },
]
