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
  {
    topicId: "tema-01",
    subtemaIndex: 0,
    cards: [
      { 
        id: "t1s1-c1", 
        concept: "Dinero como Energía", 
        definition: "Representación del esfuerzo, tiempo y talento que has invertido y que puedes intercambiar por el de otros." 
      },
      { 
        id: "t1s1-c2", 
        concept: "Valor de tu Tiempo", 
        definition: "El cálculo real de cuánto ganas por hora neta, restando gastos de transporte, comida y tiempo de traslado." 
      },
      { 
        id: "t1s1-c3", 
        concept: "Costo de Oportunidad", 
        definition: "Lo que dejas de ganar o disfrutar al elegir una opción sobre otra (ej. comprar café vs invertirlo)." 
      },
      { 
        id: "t1s1-c4", 
        concept: "Número de Libertad", 
        definition: "La cantidad mensual mínima que necesitas para cubrir tus gastos básicos sin depender de un empleo fijo." 
      },
      { 
        id: "t1s1-c5", 
        concept: "Sistema Financiero", 
        definition: "El conjunto de reglas, instituciones y mercados que permiten que el dinero fluya entre ahorradores e inversores." 
      },
    ]
  },
  {
    topicId: "tema-01",
    subtemaIndex: 1,
    cards: [
      { 
        id: "t1s2-c1", 
        concept: "Sesgo de Comparación", 
        definition: "La tendencia a gastar dinero en cosas que no necesitamos para impresionar a personas que no nos importan." 
      },
      { 
        id: "t1s2-c2", 
        concept: "Sesgo de Confirmación", 
        definition: "Buscar solo la información que justifica una compra que ya decidimos hacer emocionalmente." 
      },
      { 
        id: "t1s2-c3", 
        concept: "Aversión a la Pérdida", 
        definition: "El dolor de perder $100 es mayor al placer de ganar $100, lo que nos hace evitar riesgos productivos." 
      },
      { 
        id: "t1s2-c4", 
        concept: "Efecto Dunning-Kruger", 
        definition: "Cuando personas con poco conocimiento financiero creen que saben más de lo que realmente saben." 
      },
      { 
        id: "t1s2-c5", 
        concept: "Gratificación Instantánea", 
        definition: "Preferir el placer pequeño de hoy (compras) sobre la libertad grande de mañana (inversión)." 
      },
    ]
  },
  {
    topicId: "tema-01",
    subtemaIndex: 2, // Subtema C: Creencias
    cards: [
      { 
        id: "t1s3-c1", 
        concept: "Efecto Anclaje", 
        definition: "Quedarse con la primera cifra que escuchamos (ej. precio original alto) para juzgar si algo es barato o caro." 
      },
      { 
        id: "t1s3-c2", 
        concept: "Contabilidad Mental", 
        definition: "Tratar el dinero de forma diferente según de dónde venga (ej. gastar más rápido un regalo que el sueldo)." 
      },
      { 
        id: "t1s3-c3", 
        concept: "Miedo a la Escasez", 
        definition: "La creencia de que nunca habrá suficiente dinero, lo que genera ansiedad o acumulación excesiva." 
      },
      { 
        id: "t1s3-c4", 
        concept: "Mentalidad de Abundancia", 
        definition: "Creer que el dinero es un recurso que se puede generar con valor, no algo limitado para unos pocos." 
      },
      { 
        id: "t1s3-c5", 
        concept: "Costo Hundido", 
        definition: "Seguir gastando dinero en algo malo solo porque 'ya le metí mucho dinero', en lugar de cortar la pérdida." 
      },
    ]
  },
  {
    topicId: "tema-02",
    subtemaIndex: 0, // Subtema A: El mercado
    cards: [
      { 
        id: "t2s1-c1", 
        concept: "Mercado", 
        definition: "Lugar físico o virtual donde se intercambian bienes o servicios por dinero entre compradores y vendedores." 
      },
      { 
        id: "t2s1-c2", 
        concept: "Oferta y Demanda", 
        definition: "Ley que determina el precio de las cosas: si hay poco y muchos lo quieren, el precio sube." 
      },
      { 
        id: "t2s1-c3", 
        concept: "Ingreso Activo", 
        definition: "Dinero que recibes a cambio de tu tiempo y esfuerzo directo (trabajo tradicional)." 
      },
      { 
        id: "t2s1-c4", 
        concept: "Ingreso Pasivo", 
        definition: "Dinero que fluye hacia ti sin que tengas que estar presente o trabajando activamente en ese momento." 
      },
      { 
        id: "t2s1-c5", 
        concept: "Interés Compuesto", 
        definition: "Cuando los intereses de tu dinero generan sus propios intereses, creando un crecimiento exponencial." 
      },
    ]
  }
];

export function getFlashcardsForSubtema(topicId: string, subtemaIdx: number): Flashcard[] {
  // Normalize topicId to "tema-XX" format (e.g. "tema-01")
  let id = topicId.replace("tema-", "");
  const normalizedId = `tema-${id.padStart(2, "0")}`;
  
  const set = FLASHCARD_DATA.find(s => s.topicId === normalizedId && s.subtemaIndex === subtemaIdx);
  return set ? set.cards : [];
}
