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
  // --- TEMA 01: MENTALIDAD ---
  {
    topicId: "tema-01",
    subtemaIndex: 0,
    cards: [
      { id: "t1s1-c1", concept: "Dinero como Energía", definition: "Representación del esfuerzo, tiempo y talento que has invertido y que puedes intercambiar por el de otros." },
      { id: "t1s1-c2", concept: "Valor de tu Tiempo", definition: "El cálculo real de cuánto ganas por hora neta, restando gastos de transporte, comida y tiempo de traslado." },
      { id: "t1s1-c3", concept: "Costo de Oportunidad", definition: "Lo que dejas de ganar o disfrutar al elegir una opción sobre otra (ej. comprar café vs invertirlo)." },
      { id: "t1s1-c4", concept: "Número de Libertad", definition: "La cantidad mensual mínima que necesitas para cubrir tus gastos básicos sin depender de un empleo fijo." },
      { id: "t1s1-c5", concept: "Sistema Financiero", definition: "El conjunto de reglas, instituciones y mercados que permiten que el dinero fluya entre ahorradores e inversores." },
    ]
  },
  {
    topicId: "tema-01",
    subtemaIndex: 1,
    cards: [
      { id: "t1s2-c1", concept: "Sesgo de Comparación", definition: "La tendencia a gastar dinero en cosas que no necesitamos para impresionar a personas que no nos importan." },
      { id: "t1s2-c2", concept: "Sesgo de Confirmación", definition: "Buscar solo la información que justifica una compra que ya decidimos hacer emocionalmente." },
      { id: "t1s2-c3", concept: "Aversión a la Pérdida", definition: "El dolor de perder $100 es mayor al placer de ganar $100, lo que nos hace evitar riesgos productivos." },
      { id: "t1s2-c4", concept: "Efecto Dunning-Kruger", definition: "Cuando personas con poco conocimiento financiero creen que saben más de lo que realmente saben." },
      { id: "t1s2-c5", concept: "Gratificación Instantánea", definition: "Preferir el placer pequeño de hoy (compras) sobre la libertad grande de mañana (inversión)." },
    ]
  },
  {
    topicId: "tema-01",
    subtemaIndex: 2,
    cards: [
      { id: "t1s3-c1", concept: "Efecto Anclaje", definition: "Quedarse con la primera cifra que escuchamos (ej. precio original alto) para juzgar si algo es barato o caro." },
      { id: "t1s3-c2", concept: "Contabilidad Mental", definition: "Tratar el dinero de forma diferente según de dónde venga (ej. gastar más rápido un regalo que el sueldo)." },
      { id: "t1s3-c3", concept: "Miedo a la Escasez", definition: "La creencia de que nunca habrá suficiente dinero, lo que genera ansiedad o acumulación excesiva." },
      { id: "t1s3-c4", concept: "Mentalidad de Abundancia", definition: "Creer que el dinero es un recurso que se puede generar con valor, no algo limitado para unos pocos." },
      { id: "t1s3-c5", concept: "Costo Hundido", definition: "Seguir gastando dinero en algo malo solo porque 'ya le metí mucho dinero', en lugar de cortar la pérdida." },
    ]
  },

  // --- TEMA 02: INGENIERÍA DEL INGRESO ---
  {
    topicId: "tema-02",
    subtemaIndex: 0,
    cards: [
      { id: "t2s1-c1", concept: "Mercado", definition: "Espacio donde compradores y vendedores intercambian valor. El mercado paga por resolver problemas, no por el esfuerzo." },
      { id: "t2s1-c2", concept: "Ingreso Pasivo", definition: "Flujo de dinero que no depende de tu tiempo presente; el resultado de sistemas o activos trabajando para ti." },
      { id: "t2s1-c3", concept: "Ingreso de Portafolio", definition: "Ganancias generadas por la valorización de activos financieros (acciones, bonos, cripto, etc.)." },
      { id: "t2s1-c4", concept: "Triángulo del Valor", definition: "Concepto que une Habilidad, Escala y Rareza para determinar el potencial de ingresos de un profesional." },
      { id: "t2s1-c5", concept: "Plusvalía", definition: "El aumento del valor de un bien o activo por causas externas durante un periodo de tiempo." },
    ]
  },
  {
    topicId: "tema-02",
    subtemaIndex: 1,
    cards: [
      { id: "t2s2-c1", concept: "Habilidades de Alto Valor", definition: "Competencias raras que el mercado valora económicamente (ventas, código, gestión de capital, etc.)." },
      { id: "t2s2-c2", concept: "Escalabilidad", definition: "La capacidad de aumentar el impacto o los ingresos sin aumentar proporcionalmente las horas de trabajo." },
      { id: "t2s2-c3", concept: "ROI Educativo", definition: "Retorno de Inversión en educación: cuánto dinero adicional generas por cada peso invertido en formación." },
      { id: "t2s2-c4", concept: "Soft Skills Multiplicadoras", definition: "Habilidades como liderazgo o negociación que potencian el valor de tus habilidades técnicas." },
      { id: "t2s2-c5", concept: "Diseño de Carrera", definition: "Planificación estratégica para moverse de roles operativos a roles de alto nivel estratégico y de toma de decisiones." },
    ]
  },
  {
    topicId: "tema-02",
    subtemaIndex: 2,
    cards: [
      { id: "t2s3-c1", concept: "Capital Intelectual", definition: "El conjunto de conocimientos, experiencia y relaciones que posees y que pueden monetizarse." },
      { id: "t2s3-c2", concept: "Apalancamiento", definition: "Uso de herramientas, tecnología, capital o talento ajeno para multiplicar tus resultados personales." },
      { id: "t2s3-c3", concept: "Impuesto a la Ignorancia", definition: "El dinero que dejas de ganar o que pierdes por no conocer cómo funciona un sistema financiero o de inversión." },
      { id: "t2s3-c4", concept: "Ingresos Recurrentes", definition: "Ingresos que se repiten periódicamente tras una única acción de venta o creación (ej. suscripciones, rentas)." },
      { id: "t2s3-c5", concept: "Valor de Mercado", definition: "El precio al que el sistema está dispuesto a intercambiar tu tiempo o producto en un momento dado." },
    ]
  },

  // --- TEMA 03: PSICOLOGÍA DEL CONSUMO ---
  {
    topicId: "tema-03",
    subtemaIndex: 0,
    cards: [
      { id: "t3s1-c1", concept: "Trigger de Compra", definition: "Disparador externo (anuncio) o interno (emoción) que activa el deseo inmediato de consumir." },
      { id: "t3s1-c2", concept: "Dopamina de Consumo", definition: "Neurotransmisor del placer que se libera al comprar, pero que desaparece rápidamente tras la transacción." },
      { id: "t3s1-c3", concept: "Marketing de Escasez", definition: "Táctica que usa límites de tiempo o stock (ej. 'solo quedan 2') para forzar una decisión irracional." },
      { id: "t3s1-c4", concept: "Dissonancia Cognitiva", definition: "Incomodidad mental después de comprar algo innecesario; a menudo la resolvemos justificando la compra." },
      { id: "t3s1-c5", concept: "Algoritmos de Atención", definition: "Sistemas en redes sociales diseñados para conocer tus preferencias y mostrarte productos en momentos vulnerables." },
    ]
  },
  {
    topicId: "tema-03",
    subtemaIndex: 1,
    cards: [
      { id: "t3s2-c1", concept: "Compra por Impulso", definition: "Gasto realizado sin planificación previa, impulsado por una emoción de corta duración." },
      { id: "t3s2-c2", concept: "Regla de las 48 Horas", definition: "Técnica de esperar dos días antes de realizar una compra no planificada para enfriar la emoción." },
      { id: "t3s2-c3", concept: "Checklist de Decisión", definition: "Filtro de preguntas (ej. ¿lo necesito? ¿puedo pagarlo?) antes de validar cualquier gasto importante." },
      { id: "t3s2-c4", concept: "Micro-hábito de Control", definition: "Pequeña acción automatizada (ej. borrar apps de delivery) para reducir la fricción hacia el gasto." },
      { id: "t3s2-c5", concept: "Análisis Post-Compra", definition: "Ejercicio de evaluar objetivamente si la compra cumplió su promesa de felicidad o utilidad tras una semana." },
    ]
  },
  {
    topicId: "tema-03",
    subtemaIndex: 2,
    cards: [
      { id: "t3s3-c1", concept: "Compra por Estatus", definition: "Adquirir bienes con el fin principal de proyectar una imagen de éxito ante los demás." },
      { id: "t3s3-c2", concept: "Apariencia de Riqueza", definition: "Gasto excesivo en símbolos externos que a menudo agota el capital real que generaría riqueza." },
      { id: "t3s3-c3", concept: "Riqueza Real (Invisible)", definition: "La acumulación de activos y libertad que no se ven a simple vista, pero proporcionan seguridad genuina." },
      { id: "t3s3-c4", concept: "Validación Externa", definition: "Depender de la opinión o envidia de terceros para validar el valor de nuestras posesiones o decisiones." },
      { id: "t3s3-c5", concept: "Ley de Parkinson Financiera", definition: "Tendencia a elevar tu nivel de vida siempre que tus ingresos aumentan, manteniendo tu ahorro en cero." },
    ]
  }
];

export function getFlashcardsForSubtema(topicId: string, subtemaIdx: number): Flashcard[] {
  let id = topicId.replace("tema-", "");
  const normalizedId = `tema-${id.padStart(2, "0")}`;
  
  const set = FLASHCARD_DATA.find(s => s.topicId === normalizedId && s.subtemaIndex === subtemaIdx);
  return set ? set.cards : [];
}
