/**
 * Financial Simulators - Zod Validation Schemas
 * All input validation for the 6 simulators
 */

import { z } from 'zod';

// =====================================================
// 2. Savings Goal & Compound Interest
// =====================================================

export const savingsGoalSchema = z.object({
  initial: z.number()
    .min(0, 'El monto inicial debe ser positivo')
    .max(10_000_000, 'Monto demasiado alto'),
  monthlyContribution: z.number()
    .min(0, 'La aportación debe ser positiva')
    .max(1_000_000, 'Aportación demasiado alta'),
  annualRate: z.number()
    .min(0, 'La tasa debe ser positiva')
    .max(100, 'Tasa demasiado alta'),
  months: z.number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 mes')
    .max(600, 'Máximo 600 meses (50 años)')
    .optional(),
  targetAmount: z.number()
    .min(0, 'La meta debe ser positiva')
    .max(100_000_000, 'Meta demasiado alta')
    .optional(),
  mode: z.enum(['forecast', 'time-to-goal'], {
    errorMap: () => ({ message: 'Modo inválido' }),
  }),
}).refine(
  (data) => {
    if (data.mode === 'forecast') return data.months !== undefined && data.months > 0;
    if (data.mode === 'time-to-goal') return data.targetAmount !== undefined && data.targetAmount > 0;
    return false;
  },
  {
    message: 'Debes proporcionar "months" para pronóstico o "targetAmount" para meta',
    path: ['mode'],
  }
);

export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>;

export interface SavingsGoalOutput {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  months?: number;
  chartData: Array<{
    month: number;
    balance: number;
    contributions: number;
    interest: number;
  }>;
  error?: string;
}

// =====================================================
// 3. Credit Card Payoff
// =====================================================

export const creditCardPayoffSchema = z.object({
  balance: z.number()
    .min(1, 'El saldo debe ser mayor a 0')
    .max(1_000_000, 'Saldo demasiado alto'),
  apr: z.number()
    .min(0, 'La tasa debe ser positiva')
    .max(200, 'Tasa demasiado alta'),
  minPercent: z.number()
    .min(1, 'El porcentaje mínimo debe ser al menos 1%')
    .max(100, 'El porcentaje no puede ser mayor a 100%')
    .default(5),
  minFloor: z.number()
    .min(0, 'El pago mínimo debe ser positivo')
    .max(10_000, 'Pago mínimo demasiado alto')
    .default(200),
  fixedPayment: z.number()
    .min(1, 'El pago fijo debe ser mayor a 0')
    .max(1_000_000, 'Pago demasiado alto'),
});

export type CreditCardPayoffInput = z.infer<typeof creditCardPayoffSchema>;

export interface CreditCardPayoffOutput {
  minimumStrategy: {
    months: number;
    totalInterest: number;
    totalPaid: number;
    error?: string;
  };
  fixedStrategy: {
    months: number;
    totalInterest: number;
    totalPaid: number;
    error?: string;
  };
  savings: {
    monthsSaved: number;
    interestSaved: number;
  };
  chartData: Array<{
    month: number;
    minimumBalance: number;
    fixedBalance: number;
  }>;
}

// =====================================================
// 4. Simple Loan / Microcredit
// =====================================================

export const simpleLoanSchema = z.object({
  principal: z.number()
    .min(1, 'El monto debe ser mayor a 0')
    .max(10_000_000, 'Monto demasiado alto'),
  apr: z.number()
    .min(0, 'La tasa debe ser positiva')
    .max(200, 'Tasa demasiado alta'),
  termMonths: z.number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 mes')
    .max(600, 'Máximo 600 meses'),
  upfrontFees: z.number()
    .min(0, 'Las comisiones deben ser positivas')
    .max(1_000_000, 'Comisión demasiado alta')
    .default(0),
  monthlyFees: z.number()
    .min(0, 'Las comisiones deben ser positivas')
    .max(10_000, 'Comisión demasiado alta')
    .default(0),
});

export type SimpleLoanInput = z.infer<typeof simpleLoanSchema>;

export interface SimpleLoanOutput {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  cat: number;
  amortizationTable: Array<{
    month: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
    fees: number;
  }>;
}

// =====================================================
// 5. Investment Comparison
// =====================================================

export const investmentComparisonSchema = z.object({
  initial: z.number()
    .min(0, 'El monto inicial debe ser positivo')
    .max(10_000_000, 'Monto demasiado alto'),
  monthlyContribution: z.number()
    .min(0, 'La aportación debe ser positiva')
    .max(1_000_000, 'Aportación demasiado alta'),
  months: z.number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 mes')
    .max(600, 'Máximo 600 meses'),
  rateA: z.number()
    .min(0, 'La tasa debe ser positiva')
    .max(100, 'Tasa demasiado alta'),
  rateB: z.number()
    .min(0, 'La tasa debe ser positiva')
    .max(100, 'Tasa demasiado alta'),
  rateC: z.number()
    .min(0, 'La tasa debe ser positiva')
    .max(100, 'Tasa demasiado alta'),
  labelA: z.string().min(1).max(50).default('Ahorro Tradicional'),
  labelB: z.string().min(1).max(50).default('CETES'),
  labelC: z.string().min(1).max(50).default('Fondo de Inversión'),
});

export type InvestmentComparisonInput = z.infer<typeof investmentComparisonSchema>;

export interface InvestmentComparisonOutput {
  optionA: {
    label: string;
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
  };
  optionB: {
    label: string;
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
  };
  optionC: {
    label: string;
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
  };
  winner: 'A' | 'B' | 'C';
  chartData: Array<{
    month: number;
    optionA: number;
    optionB: number;
    optionC: number;
  }>;
}

// =====================================================
// 6. Inflation & Purchasing Power
// =====================================================

export const inflationCalculatorSchema = z.object({
  currentPrice: z.number()
    .min(0, 'El precio debe ser positivo')
    .max(10_000_000, 'Precio demasiado alto'),
  inflationAnnual: z.number()
    .min(0, 'La inflación debe ser positiva')
    .max(100, 'Inflación demasiado alta'),
  years: z.number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 año')
    .max(50, 'Máximo 50 años'),
  currentIncome: z.number()
    .min(0, 'El ingreso debe ser positivo')
    .max(10_000_000, 'Ingreso demasiado alto')
    .optional(),
});

export type InflationCalculatorInput = z.infer<typeof inflationCalculatorSchema>;

export interface InflationCalculatorOutput {
  futurePrice: number;
  priceIncrease: number;
  priceIncreasePercent: number;
  requiredIncome?: number;
  incomeIncrease?: number;
  chartData: Array<{
    year: number;
    price: number;
    income?: number;
  }>;
}

// =====================================================
// Generic Simulator Run Schema (for saving to DB)
// =====================================================

export const simulatorRunSchema = z.object({
  simulator_slug: z.string(),
  run_name: z.string().max(200).optional(),
  inputs: z.record(z.any()),
  outputs: z.record(z.any()),
  notes: z.string().max(1000).optional(),
});

export type SimulatorRun = z.infer<typeof simulatorRunSchema>;

// =====================================================
// Presets / Test Values
// =====================================================

export const PRESET_VALUES = {
  savingsGoal: {
    initial: 1000,
    monthlyContribution: 500,
    annualRate: 8,
    months: 24,
    mode: 'forecast' as const,
  },
  creditCardPayoff: {
    balance: 12000,
    apr: 70,
    minPercent: 5,
    minFloor: 200,
    fixedPayment: 1200,
  },
  simpleLoan: {
    principal: 20000,
    apr: 35,
    termMonths: 18,
    upfrontFees: 500,
    monthlyFees: 50,
  },
  investmentComparison: {
    initial: 5000,
    monthlyContribution: 1000,
    months: 12,
    rateA: 5,
    rateB: 8,
    rateC: 12,
    labelA: 'Ahorro Tradicional',
    labelB: 'CETES',
    labelC: 'Fondo de Inversión',
  },
  inflationCalculator: {
    currentPrice: 100,
    inflationAnnual: 5,
    years: 3,
    currentIncome: 10000,
  },
};

