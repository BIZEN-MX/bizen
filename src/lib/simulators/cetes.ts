/**
 * BIZEN — Simulador de Renta Fija / CETES
 * 
 * Instruments (based on real Banxico rates Q1-2025):
 *   CETES 28 días  → 10.50% anual
 *   CETES 91 días  → 10.25% anual
 *   CETES 182 días → 10.00% anual
 *   CETES 364 días →  9.75% anual
 *   BONDES D       →  9.50% anual (overnight reference)
 *   UDIBONOS       →  4.25% anual real + inflación
 *
 * Inflation rate (virtual): 4.5% anual → used to compute purchasing-power loss on cash.
 *
 * Yield formula (Money Market / Discount):
 *   interest = amount × rate × (termDays / 365)
 *
 * BIZEN uses a "compressed time" model for the simulator:
 *   Each real-world calendar day = 30 "BIZEN days"
 *   So a CETES 28 d position matures in ≈ 22.5 hours real time.
 *   (This makes the simulator engaging — users actually see their money grow.)
 */

export interface CetesInstrument {
  id: string;
  name: string;
  termDays: number;       // días reales de maduración
  annualRate: number;     // fracción decimal, e.g. 0.1050
  annualRatePct: string;  // "10.50%"
  riskLabel: 'Sin riesgo' | 'Muy bajo' | 'Bajo';
  type: 'cetes' | 'bondes' | 'udibonos';
  color: string;
  description: string;
  minAmount: number;      // en Bizcoins
}

export const INSTRUMENTS: CetesInstrument[] = [
  {
    id: 'CETES28',
    name: 'CETES 28 días',
    termDays: 28,
    annualRate: 0.1050,
    annualRatePct: '10.50%',
    riskLabel: 'Sin riesgo',
    type: 'cetes',
    color: '#10b981',
    description: 'El plazo más corto y líquido. Ideal para guardar dinero de emergencia y ganar más que una cuenta de ahorro.',
    minAmount: 100,
  },
  {
    id: 'CETES91',
    name: 'CETES 91 días',
    termDays: 91,
    annualRate: 0.1025,
    annualRatePct: '10.25%',
    riskLabel: 'Sin riesgo',
    type: 'cetes',
    color: '#0ea5e9',
    description: '3 meses de inversión. Buen equilibrio entre liquidez y rendimiento para metas a corto plazo.',
    minAmount: 100,
  },
  {
    id: 'CETES182',
    name: 'CETES 182 días',
    termDays: 182,
    annualRate: 0.1000,
    annualRatePct: '10.00%',
    riskLabel: 'Sin riesgo',
    type: 'cetes',
    color: '#6366f1',
    description: '6 meses bloqueados. Perfecto para metas semestrales con garantía del gobierno mexicano.',
    minAmount: 100,
  },
  {
    id: 'CETES364',
    name: 'CETES 364 días',
    termDays: 364,
    annualRate: 0.0975,
    annualRatePct: '9.75%',
    riskLabel: 'Sin riesgo',
    type: 'cetes',
    color: '#8b5cf6',
    description: '1 año completo. La opción de más largo plazo en CETES, para quien tiene claridad sobre sus objetivos anuales.',
    minAmount: 100,
  },
  {
    id: 'BONDES',
    name: 'BONDES D',
    termDays: 1,          // overnight, renovable diario
    annualRate: 0.0950,
    annualRatePct: '9.50%',
    riskLabel: 'Muy bajo',
    type: 'bondes',
    color: '#f59e0b',
    description: 'Bono de tasa flotante vinculado a la tasa de fondeo. Renovación diaria, máxima liquidez.',
    minAmount: 500,
  },
  {
    id: 'UDIBONOS',
    name: 'UDIBONOS 3 años',
    termDays: 1095,
    annualRate: 0.0425,   // tasa real (más inflación simulada)
    annualRatePct: '4.25% real',
    riskLabel: 'Bajo',
    type: 'udibonos',
    color: '#ec4899',
    description: 'Bono indexado a inflación (UDI). Tu rendimiento es real — siempre ganarás por encima de la inflación.',
    minAmount: 1000,
  },
];

// Compressed time: 1 real day = BIZEN_TIME_MULTIPLIER BIZEN-days
export const BIZEN_TIME_MULTIPLIER = 30;
export const VIRTUAL_INFLATION_RATE = 0.045; // 4.5% anual

/**
 * Calculates interest earned for a position.
 * Uses simple interest / money market formula.
 */
export function calcInterest(amount: number, annualRate: number, termDays: number): number {
  return Math.floor(amount * annualRate * (termDays / 365));
}

/**
 * Calculates how many "BIZEN days" correspond to real seconds elapsed.
 */
export function realSecondsToVirtualDays(seconds: number): number {
  return (seconds / 86400) * BIZEN_TIME_MULTIPLIER;
}

/**
 * Given a position invested_at and its term, returns:
 * - percentComplete: 0-100
 * - daysRemaining: virtual days remaining
 * - isMatured: true if it can be redeemed
 * - currentAccruedInterest: interest so far
 */
export function getPositionProgress(position: {
  invested_at: Date | string;
  matures_at: Date | string;
  amount_invested: number;
  annual_rate: number;
  term_days: number;
}) {
  const now = new Date();
  const start = new Date(position.invested_at);
  const end = new Date(position.matures_at);

  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.min(now.getTime() - start.getTime(), totalMs);
  const percentComplete = Math.min(100, (elapsedMs / totalMs) * 100);

  const remainingMs = Math.max(0, end.getTime() - now.getTime());
  const remainingRealDays = remainingMs / 86400000;
  const remainingVirtualDays = Math.ceil(remainingRealDays * BIZEN_TIME_MULTIPLIER);

  const isMatured = now >= end;

  // Accrued interest proportional to time elapsed
  const totalInterest = calcInterest(
    Number(position.amount_invested),
    Number(position.annual_rate),
    Number(position.term_days)
  );
  const currentAccruedInterest = Math.floor(totalInterest * (percentComplete / 100));

  return {
    percentComplete: Math.round(percentComplete * 10) / 10,
    remainingVirtualDays,
    remainingRealDays,
    isMatured,
    totalInterest,
    currentAccruedInterest,
  };
}

/**
 * Computes purchasing power erosion from virtual inflation.
 * Shows how cash held without investing loses value.
 */
export function inflationErosion(amount: number, days: number): number {
  const dailyRate = VIRTUAL_INFLATION_RATE / 365;
  return Math.floor(amount * dailyRate * days);
}

/**
 * Formats a virtual-days-remaining label for the UI.
 */
export function formatVirtualDaysRemaining(virtualDays: number): string {
  if (virtualDays <= 0) return '¡Listo para retirar!';
  if (virtualDays === 1) return '1 día BIZEN';
  return `${virtualDays} días BIZEN`;
}

/**
 * Computes real maturity date based on BIZEN compressed time.
 * termDays virtual → termDays / BIZEN_TIME_MULTIPLIER real days.
 */
export function computeMaturityDate(termDays: number): Date {
  const realDays = termDays / BIZEN_TIME_MULTIPLIER;
  const d = new Date();
  d.setTime(d.getTime() + realDays * 24 * 60 * 60 * 1000);
  return d;
}
