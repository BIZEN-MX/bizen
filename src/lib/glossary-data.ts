export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'ahorro' | 'inversión' | 'crédito' | 'presupuesto' | 'impuestos';
  relatedTerms: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'interes-compuesto',
    term: 'Interés Compuesto',
    category: 'inversión',
    definition: 'Es el interés de un capital al que se van acumulando los réditos o intereses para que produzcan otros nuevos.',
    relatedTerms: ['ahorro', 'tasa-de-interes', 'capitalizacion'],
  },
  {
    id: 'presupuesto',
    term: 'Presupuesto',
    category: 'presupuesto',
    definition: 'Un plan financiero que proyecta tus ingresos y gastos durante un periodo determinado para ayudarte a gestionar tu dinero.',
    relatedTerms: ['ingreso', 'gasto', 'ahorro'],
  },
  {
    id: 'cat',
    term: 'Costo Anual Total (CAT)',
    category: 'crédito',
    definition: 'Es una medida estandarizada del costo de un crédito, que incluye la tasa de interés y comisiones, expresada en porcentaje anual.',
    relatedTerms: ['credito', 'tasa-de-interes', 'comisiones'],
  },
  {
    id: 'inflacion',
    term: 'Inflación',
    category: 'ahorro',
    definition: 'El aumento generalizado y sostenido de los precios de bienes y servicios en un país durante un periodo de tiempo.',
    relatedTerms: ['poder-adquisitivo', 'rendimiento', 'ipc'],
  },
  {
    id: 'fondo-de-emergencia',
    term: 'Fondo de Emergencia',
    category: 'ahorro',
    definition: 'Una reserva de dinero líquida destinada a cubrir gastos inesperados o emergencias financieras.',
    relatedTerms: ['ahorro', 'liquidez', 'seguridad-financiera'],
  },
];
