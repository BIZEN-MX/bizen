/**
 * Financial Simulators - Core Calculation Functions
 * All monetary values in MXN, rates as percentages (e.g., 8.5 for 8.5%)
 */

import { roundTo } from './formatters';

/**
 * Calculate monthly payment for a loan (PMT function)
 * @param principal - Loan amount in MXN
 * @param aprPercent - Annual percentage rate (e.g., 12 for 12%)
 * @param termMonths - Number of months
 * @returns Monthly payment amount
 */
export function pmt(principal: number, aprPercent: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (aprPercent === 0) return principal / termMonths;
  
  const monthlyRate = aprPercent / 12 / 100;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                  (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  return roundTo(payment, 2);
}

/**
 * Calculate future value with regular contributions
 * @param initial - Initial amount in MXN
 * @param monthlyContribution - Monthly contribution in MXN
 * @param aprPercent - Annual percentage rate (e.g., 8 for 8%)
 * @param months - Number of months
 * @returns Future value
 */
export function fv(
  initial: number,
  monthlyContribution: number,
  aprPercent: number,
  months: number
): number {
  if (months <= 0) return initial;
  
  const monthlyRate = aprPercent / 12 / 100;
  
  // FV of initial amount
  const fvInitial = initial * Math.pow(1 + monthlyRate, months);
  
  // FV of monthly contributions (annuity)
  let fvContributions = 0;
  if (monthlyRate === 0) {
    fvContributions = monthlyContribution * months;
  } else {
    fvContributions = monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }
  
  return roundTo(fvInitial + fvContributions, 2);
}

/**
 * Calculate months to reach a savings goal
 * @param initial - Initial amount in MXN
 * @param monthlyContribution - Monthly contribution in MXN
 * @param aprPercent - Annual percentage rate
 * @param targetAmount - Target amount in MXN
 * @returns Object with months, finalValue, totalContributions, totalInterest, or error
 */
export function timeToGoal(
  initial: number,
  monthlyContribution: number,
  aprPercent: number,
  targetAmount: number
): {
  months: number;
  finalValue: number;
  totalContributions: number;
  totalInterest: number;
  error?: string;
} {
  const MAX_MONTHS = 600;
  const monthlyRate = aprPercent / 12 / 100;
  
  // Check if target is already reached
  if (initial >= targetAmount) {
    return {
      months: 0,
      finalValue: initial,
      totalContributions: 0,
      totalInterest: 0,
    };
  }
  
  // Check if it's mathematically possible
  if (monthlyContribution === 0 && initial < targetAmount) {
    return {
      months: MAX_MONTHS,
      finalValue: initial,
      totalContributions: 0,
      totalInterest: 0,
      error: 'No puedes alcanzar la meta sin aportaciones mensuales',
    };
  }
  
  // Iterate month by month
  let balance = initial;
  let month = 0;
  
  while (balance < targetAmount && month < MAX_MONTHS) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    month++;
  }
  
  const totalContributions = initial + monthlyContribution * month;
  const totalInterest = balance - totalContributions;
  
  if (month >= MAX_MONTHS && balance < targetAmount) {
    return {
      months: month,
      finalValue: roundTo(balance, 2),
      totalContributions: roundTo(totalContributions, 2),
      totalInterest: roundTo(totalInterest, 2),
      error: `No se puede alcanzar en ${MAX_MONTHS} meses. Aumenta tus aportaciones o el rendimiento.`,
    };
  }
  
  return {
    months: month,
    finalValue: roundTo(balance, 2),
    totalContributions: roundTo(totalContributions, 2),
    totalInterest: roundTo(totalInterest, 2),
  };
}

export interface PayoffRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

/**
 * Calculate credit card payoff schedule
 * @param initialBalance - Starting balance in MXN
 * @param aprPercent - Annual percentage rate
 * @param payment - Monthly payment amount
 * @returns Object with months, totalInterest, totalPaid, rows, or error
 */
export function payoffSchedule(
  initialBalance: number,
  aprPercent: number,
  payment: number
): {
  months: number;
  totalInterest: number;
  totalPaid: number;
  rows: PayoffRow[];
  error?: string;
} {
  const MAX_MONTHS = 600;
  const monthlyRate = aprPercent / 12 / 100;
  const rows: PayoffRow[] = [];
  
  let balance = initialBalance;
  let totalInterest = 0;
  let month = 0;
  
  // Check if payment is too low
  const minViablePayment = balance * monthlyRate;
  if (payment <= minViablePayment) {
    return {
      months: 0,
      totalInterest: 0,
      totalPaid: 0,
      rows: [],
      error: `El pago mensual debe ser mayor a ${roundTo(minViablePayment, 2)} MXN (el interés mensual) para reducir la deuda.`,
    };
  }
  
  while (balance > 0.01 && month < MAX_MONTHS) {
    month++;
    const interest = balance * monthlyRate;
    const principalPayment = Math.min(payment - interest, balance);
    const actualPayment = interest + principalPayment;
    
    balance -= principalPayment;
    totalInterest += interest;
    
    rows.push({
      month,
      payment: roundTo(actualPayment, 2),
      interest: roundTo(interest, 2),
      principal: roundTo(principalPayment, 2),
      balance: roundTo(Math.max(balance, 0), 2),
    });
    
    if (balance < 0.01) break;
  }
  
  if (month >= MAX_MONTHS && balance > 0.01) {
    return {
      months: month,
      totalInterest: roundTo(totalInterest, 2),
      totalPaid: roundTo(initialBalance + totalInterest, 2),
      rows: rows.slice(0, 12), // Only return first year for preview
      error: `No se puede pagar en ${MAX_MONTHS} meses. Aumenta el pago mensual.`,
    };
  }
  
  return {
    months: month,
    totalInterest: roundTo(totalInterest, 2),
    totalPaid: roundTo(initialBalance + totalInterest, 2),
    rows,
  };
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  fees: number;
}

/**
 * Calculate loan amortization schedule
 * @param principal - Loan amount in MXN
 * @param aprPercent - Annual percentage rate
 * @param termMonths - Loan term in months
 * @param upfrontFees - One-time upfront fees in MXN
 * @param monthlyFees - Recurring monthly fees in MXN
 * @returns Object with payment, totalInterest, totalCost, cat, rows
 */
export function amortization(
  principal: number,
  aprPercent: number,
  termMonths: number,
  upfrontFees: number = 0,
  monthlyFees: number = 0
): {
  payment: number;
  totalInterest: number;
  totalCost: number;
  cat: number;
  rows: AmortizationRow[];
} {
  const monthlyRate = aprPercent / 12 / 100;
  const basePayment = pmt(principal, aprPercent, termMonths);
  const totalPayment = basePayment + monthlyFees;
  
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  
  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPayment = basePayment - interest;
    
    balance -= principalPayment;
    totalInterest += interest;
    
    rows.push({
      month,
      payment: roundTo(totalPayment, 2),
      interest: roundTo(interest, 2),
      principal: roundTo(principalPayment, 2),
      balance: roundTo(Math.max(balance, 0), 2),
      fees: monthlyFees,
    });
  }
  
  const totalCost = principal + totalInterest + upfrontFees + (monthlyFees * termMonths);
  
  // Approximate CAT calculation
  // CAT = ((totalCost / (principal - upfrontFees)) ^ (12/termMonths) - 1) * 100
  const netPrincipal = principal - upfrontFees;
  const cat = (Math.pow(totalCost / netPrincipal, 12 / termMonths) - 1) * 100;
  
  return {
    payment: roundTo(totalPayment, 2),
    totalInterest: roundTo(totalInterest, 2),
    totalCost: roundTo(totalCost, 2),
    cat: roundTo(cat, 2),
    rows,
  };
}

/**
 * Calculate minimum payment for credit card
 * @param balance - Current balance in MXN
 * @param minPercent - Minimum payment percentage (e.g., 5 for 5%)
 * @param minFloor - Minimum floor amount in MXN
 * @returns Minimum payment amount
 */
export function calculateMinimumPayment(
  balance: number,
  minPercent: number,
  minFloor: number
): number {
  const percentPayment = balance * (minPercent / 100);
  return roundTo(Math.max(percentPayment, Math.min(minFloor, balance)), 2);
}

/**
 * Calculate future price with inflation
 * @param currentPrice - Current price in MXN
 * @param inflationPercent - Annual inflation rate
 * @param years - Number of years
 * @returns Future price
 */
export function futurePrice(
  currentPrice: number,
  inflationPercent: number,
  years: number
): number {
  return roundTo(currentPrice * Math.pow(1 + inflationPercent / 100, years), 2);
}

/**
 * Calculate required income to maintain purchasing power
 * @param currentIncome - Current income in MXN
 * @param inflationPercent - Annual inflation rate
 * @param years - Number of years
 * @returns Required future income
 */
export function requiredIncomeForPurchasingPower(
  currentIncome: number,
  inflationPercent: number,
  years: number
): number {
  return futurePrice(currentIncome, inflationPercent, years);
}

