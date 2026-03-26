export interface Flashcard {
  id: string;
  concept: string;
  definition: string;
}

export interface FlashcardSet {
  topicId: string;
  subtemaIndex: number; // 0-based
  cards: Flashcard[];
}

export const FLASHCARD_DATA: FlashcardSet[] = [
  // --- TEMA 01: MENTALIDAD (TABLERO DEL JUEGO) ---
  {
    topicId: "tema-01",
    subtemaIndex: 0, // A: Percepción
    cards: [
      { id: "t1s1-c1", concept: "Dinero como Energía", definition: "Representación del esfuerzo, tiempo y talento que has invertido y que puedes intercambiar por el de otros." },
      { id: "t1s1-c2", concept: "Valor de tu Tiempo", definition: "El cálculo real de cuánto ganas por hora neta, restando todos los costos asociados a trabajar." },
      { id: "t1s1-c3", concept: "Costo de Oportunidad", definition: "Lo que dejas de ganar o disfrutar al elegir una opción sobre otra." },
      { id: "t1s1-c4", concept: "Número de Libertad", definition: "Cantidad mensual mínima para cubrir tus gastos básicos sin depender de un empleo fijo." },
      { id: "t1s1-c5", concept: "Sistema Financiero", definition: "Conjunto de reglas y mercados que permiten que el dinero fluya entre agentes económicos." },
      { id: "t1s1-c6", concept: "Presupuesto Base", definition: "Lista mínima de gastos operativos necesarios para mantener tu infraestructura de vida." },
      { id: "t1s1-c7", concept: "Margen de Seguridad", definition: "Diferencia entre tu ingreso y tus gastos que te protege ante variaciones inesperadas." },
      { id: "t1s1-c8", concept: "Patrimonio Neto", definition: "Suma de todos tus activos menos la suma de todos tus pasivos." },
      { id: "t1s1-c9", concept: "Flujo de Caja (Cashflow)", definition: "Movimiento de dinero que entra y sale de tu bolsillo en un periodo determinado." },
      { id: "t1s1-c10", concept: "Activo vs Pasivo", definition: "Un activo pone dinero en tu bolsillo; un pasivo lo saca." },
    ]
  },
  {
    topicId: "tema-01",
    subtemaIndex: 1, // B: Emociones
    cards: [
      { id: "t1s2-c1", concept: "Inteligencia Emocional Financiera", definition: "Capacidad de gestionar emociones para tomar mejores decisiones monetarias." },
      { id: "t1s2-c2", concept: "Etiquetado Emocional", definition: "Técnica de nombrar una emoción para reducir su intensidad reactiva y recuperar la lógica." },
      { id: "t1s2-c3", concept: "Somatización", definition: "Proceso por el cual el estrés emocional se manifiesta como síntomas físicos (ej. nudo en el estómago)." },
      { id: "t1s2-c4", concept: "Cerebro Límbico", definition: "Parte primitiva involucrada en las respuestas emocionales inmediatas e impulsos." },
      { id: "t1s2-c5", concept: "Pausa Táctica", definition: "Periodo de tiempo pre-acordado antes de ejecutar una decisión de alto impacto." },
      { id: "t1s2-c6", concept: "Barrera de Entrada", definition: "Obstáculo consciente puesto para dificultar una mala decisión de gasto." },
      { id: "t1s2-c7", concept: "Resaca Financiera", definition: "Estado emocional de culpa y estrés tras un gasto descontrolado e irracional." },
      { id: "t1s2-c8", concept: "Retroalimentación Positiva", definition: "Uso de errores pasados para ajustar el sistema futuro y evitar la culpa paralizante." },
      { id: "t1s2-c9", concept: "Sesgo de Arrepentimiento", definition: "Miedo a tomar una decisión por temor a equivocarse o arrepentirse después." },
      { id: "t1s2-c10", concept: "Neutralidad Técnica", definition: "Estado ideal del Ingeniero del Dinero: tratar los datos financieros sin juicio emocional." },
    ]
  },
  {
    topicId: "tema-01",
    subtemaIndex: 2, // C: Creencias
    cards: [
      { id: "t1s3-c1", concept: "Software Mental", definition: "Conjunto de creencias heredadas y sesgos que dictan tu comportamiento financiero." },
      { id: "t1s3-c2", concept: "Origen Social", definition: "Influencia del entorno familiar y social cercano en tu formación de identidad financiera." },
      { id: "t1s3-c3", concept: "Mentalidad de Abundancia", definition: "Creencia de que el dinero es un recurso expandible mediante la creación de valor." },
      { id: "t1s3-c4", concept: "Sesgo de Suma Cero", definition: "Creencia falsa de que para que uno gane, otro deba perder obligatoriamente." },
      { id: "t1s3-c5", concept: "Auto-Sabotaje", definition: "Acciones inconscientes para evitar el éxito por miedo a la responsabilidad o soledad." },
      { id: "t1s3-c6", concept: "Zona de Confort", definition: "Estado mental de seguridad percibida que detiene el crecimiento y la toma de riesgos." },
      { id: "t1s3-c7", concept: "Techo de Cristal", definition: "Límite invisible de ingresos que nos auto-imponemos según lo que creemos merecer." },
      { id: "t1s3-c8", concept: "Deconstrucción de Creencia", definition: "Proceso de analizar el origen de un miedo y sustituirlo por una regla lógica." },
      { id: "t1s3-c9", concept: "Criterio de Realidad", definition: "Uso de datos comprobables para desmentir mitos heredados sobre el dinero." },
      { id: "t1s3-c10", concept: "Manual de Reglas", definition: "Tu código personal de conducta financiera que guía tus acciones sin dudar." },
    ]
  },

  // --- TEMA 02: INGENIERÍA DEL INGRESO ---
  {
    topicId: "tema-02",
    subtemaIndex: 0, // A: Naturaleza del Dinero
    cards: [
      { id: "t2s1-c1", concept: "Valor de Mercado", definition: "Precio que el sistema está dispuesto a pagar por una habilidad o recurso." },
      { id: "t2s1-c2", concept: "Escalabilidad de Valor", definition: "Capacidad de aumentar el impacto sin aumentar linealmente el esfuerzo personal." },
      { id: "t2s1-c3", concept: "Ingreso Activo", definition: "Dinero ganado mediante el intercambio directo y proporcional de tiempo por dinero." },
      { id: "t2s1-c4", concept: "Ingreso Pasivo", definition: "Dinero generado por activos o sistemas que no requieren presencia constante." },
      { id: "t2s1-c5", concept: "Sistemas", definition: "Procesos automatizados que producen resultados constantes con mínima intervención." },
      { id: "t2s1-c6", concept: "Apalancamiento", definition: "Uso de recursos ajenos (capital, tecnología, gente) para multiplicar resultados." },
      { id: "t2s1-c7", concept: "Interés Compuesto", definition: "Beneficio que se suma al capital inicial y genera nuevos intereses sucesivamente." },
      { id: "t2s1-c8", concept: "Costo de No-Invertir", definition: "Valor potencial perdido por dejar el dinero ocioso frente a la inflación." },
      { id: "t2s1-c9", concept: "Análisis de Flujo", definition: "Evaluación cuantitativa de las entradas y salidas de capital de un sistema." },
      { id: "t2s1-c10", concept: "Robustez Financiera", definition: "Capacidad de un sistema de mantenerse operativo ante fallos en una fuente de ingreso." },
    ]
  },
  {
    topicId: "tema-02",
    subtemaIndex: 1, // B: Capital de Habilidades
    cards: [
      { id: "t2s2-c1", concept: "HVA (High Value Skill)", definition: "Habilidad técnica o social por la que el mercado paga un premium de precio." },
      { id: "t2s2-c2", concept: "Afectación de Bottom-Line", definition: "Habilidad que impacta directamente en las ganancias o ahorros finales de una empresa." },
      { id: "t2s2-c3", concept: "Escalabilidad", definition: "Propiedad de un sistema para manejar crecimiento sin aumentar costos lineales." },
      { id: "t2s2-c4", concept: "Desacoplo", definition: "Separar el tiempo invertido del resultado o ingreso obtenido." },
      { id: "t2s2-c5", concept: "ROI Educativo", definition: "Retorno de inversión en formación: ingresos extra generados tras aprender algo." },
      { id: "t2s2-c6", concept: "Costo de Oportunidad Educativo", definition: "Tiempo gastado en educación inútil que pudiste usar en habilidades valiosas." },
      { id: "t2s2-c7", concept: "Soft Skills", definition: "Habilidades interpersonales (negociación, liderazgo) que potencian lo técnico." },
      { id: "t2s2-c8", concept: "Multiplicador de Valor", definition: "Habilidad (como saber hablar inglés o vender) que multiplica todas tus demás skills." },
      { id: "t2s2-c9", concept: "Fase Estratégica", definition: "Etapa profesional donde el valor se genera por decisiones y visión, no por ejecución físico." },
      { id: "t2s2-c10", concept: "Costo de Estancamiento", definition: "Pérdida de ingresos por permanecer en la fase operativa más tiempo del necesario." },
    ]
  },
  {
    topicId: "tema-02",
    subtemaIndex: 2, // C: Optimización
    cards: [
      { id: "t2s3-c1", concept: "Capital Intelectual", definition: "Suma de conocimientos y experiencias que generan valor económico directo." },
      { id: "t2s3-c2", concept: "Arbitraje de Capital", definition: "Proceso de convertir conocimiento en dinero y viceversa de forma eficiente." },
      { id: "t2s3-c3", concept: "Impuesto a la Ignorancia", definition: "Dinero perdido por no saber cómo funciona el sistema (intereses, deudas, inversión)." },
      { id: "t2s3-c4", concept: "Costo de Inacción", definition: "Lo que dejas de ganar hoy por no haber empezado ayer." },
      { id: "t2s3-c5", concept: "Apalancamiento de Código", definition: "Uso de software para realizar el trabajo de mil personas con un solo clic." },
      { id: "t2s3-c6", concept: "Apalancamiento de Media", definition: "Uso de contenido (video, podcast, texto) para influir a masas sin presencia física." },
      { id: "t2s3-c7", concept: "Ingresos Recurrentes", definition: "Dinero que entra periódicamente tras una única acción inicial de venta." },
      { id: "t2s3-c8", concept: "Churn Rate (Tasa de Baja)", definition: "Ritmo al que los ingresos recurrentes de una suscripción se pierden." },
      { id: "t2s3-c9", concept: "Plan de Acción BIZEN", definition: "Hoja de ruta secuencial para elevar el capital intelectual y financiero anual." },
      { id: "t2s3-c10", concept: "Métrica de Éxito", definition: "Indicador clave cuantificable que mide el progreso real de tu sistema financiero." },
    ]
  },

  // --- TEMA 03: PSICOLOGÍA DEL CONSUMO ---
  {
    topicId: "tema-03",
    subtemaIndex: 0, // A: Triggers
    cards: [
      { id: "t3s1-c1", concept: "Trigger de Compra", definition: "Disparador externo o interno que activa el deseo inmediato de consumir." },
      { id: "t3s1-c2", concept: "Dopamina de Consumo", definition: "Neurotransmisor que genera placer durante la compra pero desaparece al pagar." },
      { id: "t3s1-c3", concept: "Marketing de Escasez", definition: "Táctica que presiona la decisión irracional mediante límites de tiempo o stock." },
      { id: "t3s1-c4", concept: "Dissonancia Cognitiva", definition: "Incomodidad mental después de gastar; suele resolverse con auto-justificación." },
      { id: "t3s1-c5", concept: "Algoritmos de Atención", definition: "Sistemas diseñados para mostrarte productos en tus momentos de mayor vulnerabilidad." },
      { id: "t3s1-c6", concept: "Sesgo de Urgencia", definition: "Tendencia a priorizar tareas o compras inmediatas sobre las importantes a largo plazo." },
      { id: "t3s1-c7", concept: "Validación Social", definition: "Búsqueda de aprobación ajena a través del consumo de bienes visibles." },
      { id: "t3s1-c8", concept: "Anchor Price (Anclaje)", definition: "Uso de un precio alto inicial para que cualquier descuento parezca una 'ganancia'." },
      { id: "t3s1-c9", concept: "Gamificación de Gasto", definition: "Uso de elementos de juego (puntos, niveles) para incentivar el consumo recurrente." },
      { id: "t3s1-c10", concept: "Invisibilidad de Pago", definition: "Reducción del 'dolor de pagar' mediante pagos digitales sin contacto o automáticos." },
    ]
  },
  {
    topicId: "tema-03",
    subtemaIndex: 1, // B: Compras Impulsivas
    cards: [
      { id: "t3s2-c1", concept: "Impulsividad Financiera", definition: "Tendencia a realizar gastos rápidos sin evaluar el impacto en el plan maestro." },
      { id: "t3s2-c2", concept: "Secuestro de la Amígdala", definition: "Estado emocional donde la lógica es anulada por una respuesta instintiva de deseo." },
      { id: "t3s2-c3", concept: "Regla de las 48 Horas", definition: "Técnica de esperar dos días antes de una compra no planeada para enfriar la emoción." },
      { id: "t3s2-c4", concept: "Checklist de Decisión", definition: "Filtro de preguntas técnicas antes de validar la salida de capital del sistema." },
      { id: "t3s2-c5", concept: "Fricción Financiera", definition: "Introducción consciente de pasos extra para dificultar decisiones de gasto rápido." },
      { id: "t3s2-c6", concept: "Arquitectura de Opciones", definition: "Diseño del entorno para que la opción de no gastar sea la más fácil de tomar." },
      { id: "t3s2-c7", concept: "Post-Audit", definition: "Análisis técnico de una decisión de gasto fallida para encontrar la causa raíz." },
      { id: "t3s2-c8", concept: "Causa Raíz", definition: "Factor fundamental (estrés, hambre, cansancio) que disparó un fallo del sistema." },
      { id: "t3s2-c9", concept: "Micro-hábito de Control", definition: "Pequeña acción automatizada para reducir la exposición a tentaciones de gasto." },
      { id: "t3s2-c10", concept: "Navegación Táctica", definition: "Gestión consciente de una situación de alto riesgo emocional de consumo." },
    ]
  },
  {
    topicId: "tema-03",
    subtemaIndex: 2, // C: Estatus y Presión Social
    cards: [
      { id: "t3s3-c1", concept: "Estatus Percebido", definition: "Valoración social subjetiva basada en lo que los demás creen que posees." },
      { id: "t3s3-c2", concept: "Valor Intrínseco", definition: "Utilidad real y duradera de un objeto independientemente de la opinión ajena." },
      { id: "t3s3-c3", concept: "Millonario de al Lado", definition: "Persona con gran patrimonio que mantiene un estilo de vida austero y discreto." },
      { id: "t3s3-c4", concept: "Riqueza Invisible", definition: "Activos intangibles como paz mental, tiempo libre y autonomía de decisión." },
      { id: "t3s3-c5", concept: "YOLO / FOMO", definition: "Miedos sociales que justifican decisiones irracionales de gasto de corto plazo." },
      { id: "t3s3-c6", concept: "Asertividad Financiera", definition: "Capacidad de comunicar límites económicos claros sin sentir culpa ni pena." },
      { id: "t3s3-c7", concept: "Priorización de Capital", definition: "Elección consciente de dónde poner recursos según tus metas maestras." },
      { id: "t3s3-c8", concept: "Regla Sagrada", definition: "Principio innegociable que rige el comportamiento financiero sin deliberación." },
      { id: "t3s3-c9", concept: "Integridad de Sistema", definition: "Estado en el que tus decisiones diarias coinciden con tus reglas pre-diseñadas." },
      { id: "t3s3-c10", concept: "Ley de Parkinson Financiera", definition: "Tendencia a elevar el nivel de vida siempre que tus ingresos aumentan." },
    ]
  }
];

export function getFlashcardsForSubtema(topicId: string, subtemaIdx: number): Flashcard[] {
  let id = topicId.replace("tema-", "");
  const normalizedId = `tema-${id.padStart(2, "0")}`;
  
  const set = FLASHCARD_DATA.find(s => s.topicId === normalizedId && s.subtemaIndex === subtemaIdx);
  return set ? set.cards : [];
}
