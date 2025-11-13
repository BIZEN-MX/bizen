/**
 * Financial Simulators - Calculation Engines
 * Business logic for all 6 simulators
 */

import {
  fv,
  timeToGoal,
  payoffSchedule,
  calculateMinimumPayment,
  amortization,
  futurePrice,
  requiredIncomeForPurchasingPower,
} from './calculations';

import type {
  MonthlyBudgetInput,
  MonthlyBudgetOutput,
  SavingsGoalInput,
  SavingsGoalOutput,
  CreditCardPayoffInput,
  CreditCardPayoffOutput,
  SimpleLoanInput,
  SimpleLoanOutput,
  InvestmentComparisonInput,
  InvestmentComparisonOutput,
  InflationCalculatorInput,
  InflationCalculatorOutput,
} from './schemas';

// =====================================================
// 1. Monthly Budget 50/30/20
// =====================================================

export function calculateMonthlyBudget(input: MonthlyBudgetInput): MonthlyBudgetOutput {
  const totalFixed = input.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalVariable = input.variableExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = totalFixed + totalVariable;
  const actualSavings = input.monthlyIncome - totalExpenses;
  const remainingIncome = actualSavings;
  const meetsGoal = actualSavings >= input.savingsGoal;
  const gapToGoal = input.savingsGoal - actualSavings;
  
  const recommendations: string[] = [];
  
  // Build breakdown if using 50/30/20 mode
  let breakdown;
  if (input.mode === '50/30/20') {
    const essentialTarget = input.monthlyIncome * 0.50;
    const wantsTarget = input.monthlyIncome * 0.30;
    const savingsTarget = input.monthlyIncome * 0.20;
    
    breakdown = {
      essentialTarget,
      wantsTarget,
      savingsTarget,
      essentialActual: totalFixed,
      wantsActual: totalVariable,
      savingsActual: actualSavings,
    };
    
    // Recommendations based on 50/30/20
    if (totalFixed > essentialTarget) {
      const excess = totalFixed - essentialTarget;
      const percentage = ((totalFixed / input.monthlyIncome) * 100).toFixed(0);
      recommendations.push(
        `📊 Tus necesidades básicas representan el ${percentage}% de tu ingreso (${totalFixed.toFixed(0)} MXN). La regla recomienda mantenerlas al 50%. Considera reducir ${excess.toFixed(0)} MXN buscando opciones más económicas en renta, servicios o transporte.`
      );
    }
    
    if (totalVariable > wantsTarget) {
      const excess = totalVariable - wantsTarget;
      const percentage = ((totalVariable / input.monthlyIncome) * 100).toFixed(0);
      recommendations.push(
        `🎯 Tus gastos en deseos son del ${percentage}% (${totalVariable.toFixed(0)} MXN), cuando lo ideal es 30%. Podrías recortar ${excess.toFixed(0)} MXN en entretenimiento, salidas o compras no esenciales.`
      );
    }
    
    if (actualSavings < savingsTarget) {
      const shortfall = savingsTarget - actualSavings;
      const percentage = ((actualSavings / input.monthlyIncome) * 100).toFixed(1);
      recommendations.push(
        `💰 Tu capacidad de ahorro actual es del ${percentage}% (${actualSavings.toFixed(0)} MXN), por debajo del 20% recomendado. Para llegar a la meta, necesitas liberar ${shortfall.toFixed(0)} MXN mensuales reduciendo gastos o aumentando ingresos.`
      );
    } else {
      const percentage = ((actualSavings / input.monthlyIncome) * 100).toFixed(1);
      recommendations.push(
        `🎉 ¡Excelente trabajo! Estás ahorrando ${actualSavings.toFixed(0)} MXN al mes (${percentage}% de tus ingresos). Superas el 20% recomendado y estás construyendo un futuro financiero sólido.`
      );
    }
  }
  
  // General recommendations
  if (totalExpenses > input.monthlyIncome) {
    const deficit = totalExpenses - input.monthlyIncome;
    recommendations.push(
      `⚠️ ¡Alerta! Tus gastos totales (${totalExpenses.toFixed(0)} MXN) superan tu ingreso mensual por ${deficit.toFixed(0)} MXN. Esto significa que estás gastando más de lo que ganas. Es urgente ajustar tu presupuesto para evitar deudas.`
    );
  }
  
  if (!meetsGoal && actualSavings >= 0) {
    const percentageNeeded = ((gapToGoal / totalExpenses) * 100).toFixed(0);
    recommendations.push(
      `🎯 Estás cerca de tu meta. Para ahorrar ${input.savingsGoal.toFixed(0)} MXN mensuales, necesitas liberar ${gapToGoal.toFixed(0)} MXN adicionales (aproximadamente ${percentageNeeded}% de tus gastos actuales).`
    );
  }
  
  if (actualSavings >= input.savingsGoal && input.savingsGoal > 0) {
    const surplus = actualSavings - input.savingsGoal;
    if (surplus > 0) {
      recommendations.push(
        `✨ ¡Felicidades! No solo cumples tu meta de ahorro de ${input.savingsGoal.toFixed(0)} MXN, sino que tienes ${surplus.toFixed(0)} MXN extra. Considera invertir este excedente para acelerar tu crecimiento financiero.`
      );
    } else {
      recommendations.push(
        `✅ ¡Perfecto! Estás cumpliendo exactamente tu meta de ahorro de ${input.savingsGoal.toFixed(0)} MXN mensual. Mantén este ritmo y alcanzarás tus objetivos financieros.`
      );
    }
  }
  
  return {
    totalFixed,
    totalVariable,
    totalExpenses,
    actualSavings,
    remainingIncome,
    meetsGoal,
    gapToGoal,
    recommendations,
    breakdown,
  };
}

// =====================================================
// 2. Savings Goal & Compound Interest
// =====================================================

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalOutput {
  if (input.mode === 'forecast') {
    const months = input.months!;
    const futureValue = fv(input.initial, input.monthlyContribution, input.annualRate, months);
    const totalContributions = input.initial + input.monthlyContribution * months;
    const totalInterest = futureValue - totalContributions;
    
    // Build chart data (sample points)
    const chartData = [];
    const step = Math.max(1, Math.floor(months / 24)); // Max 24 points
    
    for (let m = 0; m <= months; m += step) {
      const balance = fv(input.initial, input.monthlyContribution, input.annualRate, m);
      const contributions = input.initial + input.monthlyContribution * m;
      const interest = balance - contributions;
      
      chartData.push({
        month: m,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round(contributions * 100) / 100,
        interest: Math.round(interest * 100) / 100,
      });
    }
    
    // Add final month if not included
    if (chartData[chartData.length - 1].month !== months) {
      const balance = futureValue;
      const contributions = totalContributions;
      const interest = totalInterest;
      chartData.push({
        month: months,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round(contributions * 100) / 100,
        interest: Math.round(interest * 100) / 100,
      });
    }
    
    return {
      futureValue,
      totalContributions,
      totalInterest,
      chartData,
    };
  } else {
    // time-to-goal mode
    const result = timeToGoal(
      input.initial,
      input.monthlyContribution,
      input.annualRate,
      input.targetAmount!
    );
    
    // Build chart data
    const chartData = [];
    const step = Math.max(1, Math.floor(result.months / 24));
    
    for (let m = 0; m <= result.months; m += step) {
      const balance = fv(input.initial, input.monthlyContribution, input.annualRate, m);
      const contributions = input.initial + input.monthlyContribution * m;
      const interest = balance - contributions;
      
      chartData.push({
        month: m,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round(contributions * 100) / 100,
        interest: Math.round(interest * 100) / 100,
      });
    }
    
    return {
      futureValue: result.finalValue,
      totalContributions: result.totalContributions,
      totalInterest: result.totalInterest,
      months: result.months,
      chartData,
      error: result.error,
    };
  }
}

// =====================================================
// 3. Credit Card Payoff
// =====================================================

export function calculateCreditCardPayoff(input: CreditCardPayoffInput): CreditCardPayoffOutput {
  const minimumPayment = calculateMinimumPayment(input.balance, input.minPercent, input.minFloor);
  
  // Calculate both strategies
  const minimumStrategy = payoffSchedule(input.balance, input.apr, minimumPayment);
  const fixedStrategy = payoffSchedule(input.balance, input.apr, input.fixedPayment);
  
  const monthsSaved = minimumStrategy.months - fixedStrategy.months;
  const interestSaved = minimumStrategy.totalInterest - fixedStrategy.totalInterest;
  
  // Build chart data for comparison
  const maxMonths = Math.max(
    minimumStrategy.rows.length,
    fixedStrategy.rows.length
  );
  
  const chartData = [];
  for (let i = 0; i < Math.min(maxMonths, 60); i++) { // Max 60 months for chart
    chartData.push({
      month: i + 1,
      minimumBalance: minimumStrategy.rows[i]?.balance ?? 0,
      fixedBalance: fixedStrategy.rows[i]?.balance ?? 0,
    });
  }
  
  return {
    minimumStrategy: {
      months: minimumStrategy.months,
      totalInterest: minimumStrategy.totalInterest,
      totalPaid: minimumStrategy.totalPaid,
      error: minimumStrategy.error,
    },
    fixedStrategy: {
      months: fixedStrategy.months,
      totalInterest: fixedStrategy.totalInterest,
      totalPaid: fixedStrategy.totalPaid,
      error: fixedStrategy.error,
    },
    savings: {
      monthsSaved,
      interestSaved,
    },
    chartData,
  };
}

// =====================================================
// 4. Simple Loan / Microcredit
// =====================================================

export function calculateSimpleLoan(input: SimpleLoanInput): SimpleLoanOutput {
  const result = amortization(
    input.principal,
    input.apr,
    input.termMonths,
    input.upfrontFees,
    input.monthlyFees
  );
  
  return {
    monthlyPayment: result.payment,
    totalInterest: result.totalInterest,
    totalCost: result.totalCost,
    cat: result.cat,
    amortizationTable: result.rows,
  };
}

// =====================================================
// 5. Investment Comparison
// =====================================================

export function calculateInvestmentComparison(
  input: InvestmentComparisonInput
): InvestmentComparisonOutput {
  const totalContributions = input.initial + input.monthlyContribution * input.months;
  
  // Calculate future values for each option
  const fvA = fv(input.initial, input.monthlyContribution, input.rateA, input.months);
  const fvB = fv(input.initial, input.monthlyContribution, input.rateB, input.months);
  const fvC = fv(input.initial, input.monthlyContribution, input.rateC, input.months);
  
  const optionA = {
    label: input.labelA,
    futureValue: fvA,
    totalContributions,
    totalInterest: fvA - totalContributions,
  };
  
  const optionB = {
    label: input.labelB,
    futureValue: fvB,
    totalContributions,
    totalInterest: fvB - totalContributions,
  };
  
  const optionC = {
    label: input.labelC,
    futureValue: fvC,
    totalContributions,
    totalInterest: fvC - totalContributions,
  };
  
  // Determine winner
  let winner: 'A' | 'B' | 'C' = 'A';
  if (fvB > fvA && fvB >= fvC) winner = 'B';
  else if (fvC > fvA && fvC > fvB) winner = 'C';
  
  // Build chart data
  const chartData = [];
  const step = Math.max(1, Math.floor(input.months / 24));
  
  for (let m = 0; m <= input.months; m += step) {
    chartData.push({
      month: m,
      optionA: Math.round(fv(input.initial, input.monthlyContribution, input.rateA, m) * 100) / 100,
      optionB: Math.round(fv(input.initial, input.monthlyContribution, input.rateB, m) * 100) / 100,
      optionC: Math.round(fv(input.initial, input.monthlyContribution, input.rateC, m) * 100) / 100,
    });
  }
  
  return {
    optionA,
    optionB,
    optionC,
    winner,
    chartData,
  };
}

// =====================================================
// 6. Inflation & Purchasing Power
// =====================================================

export function calculateInflation(input: InflationCalculatorInput): InflationCalculatorOutput {
  const futurePrice_ = futurePrice(input.currentPrice, input.inflationAnnual, input.years);
  const priceIncrease = futurePrice_ - input.currentPrice;
  const priceIncreasePercent = (priceIncrease / input.currentPrice) * 100;
  
  let requiredIncome: number | undefined;
  let incomeIncrease: number | undefined;
  
  if (input.currentIncome) {
    requiredIncome = requiredIncomeForPurchasingPower(
      input.currentIncome,
      input.inflationAnnual,
      input.years
    );
    incomeIncrease = requiredIncome - input.currentIncome;
  }
  
  // Build chart data
  const chartData = [];
  for (let y = 0; y <= input.years; y++) {
    const price = futurePrice(input.currentPrice, input.inflationAnnual, y);
    const income = input.currentIncome
      ? requiredIncomeForPurchasingPower(input.currentIncome, input.inflationAnnual, y)
      : undefined;
    
    chartData.push({
      year: y,
      price: Math.round(price * 100) / 100,
      income: income ? Math.round(income * 100) / 100 : undefined,
    });
  }
  
  return {
    futurePrice: futurePrice_,
    priceIncrease,
    priceIncreasePercent,
    requiredIncome,
    incomeIncrease,
    chartData,
  };
}

