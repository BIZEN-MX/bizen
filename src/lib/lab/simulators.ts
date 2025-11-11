/**
 * Business Lab Simulators
 * Mathematical functions for business calculations
 */

export interface CashflowInput {
  startingCash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  months: number;
}

export interface CashflowOutput {
  runway: number; // months until cash runs out
  burnRate: number; // monthly burn
  finalCash: number;
  chartData: Array<{
    month: number;
    cash: number;
    revenue: number;
    expenses: number;
  }>;
}

export function calculateCashflow(input: CashflowInput): CashflowOutput {
  const { startingCash, monthlyRevenue, monthlyExpenses, months } = input;
  const burnRate = monthlyExpenses - monthlyRevenue;
  
  const chartData: CashflowOutput['chartData'] = [];
  let cash = startingCash;
  
  for (let month = 1; month <= months; month++) {
    cash += monthlyRevenue - monthlyExpenses;
    chartData.push({
      month,
      cash: Math.max(0, cash),
      revenue: monthlyRevenue,
      expenses: monthlyExpenses
    });
    
    if (cash <= 0) break;
  }
  
  const runway = burnRate > 0 
    ? Math.floor(startingCash / burnRate)
    : months; // If profitable, runway is essentially infinite
  
  const finalCash = chartData[chartData.length - 1]?.cash || 0;
  
  return {
    runway,
    burnRate,
    finalCash,
    chartData
  };
}

export interface BreakevenInput {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
}

export interface BreakevenOutput {
  breakevenUnits: number;
  breakevenRevenue: number;
  contributionMargin: number;
  contributionMarginPercent: number;
  marginOfSafety?: number; // if current sales provided
}

export function calculateBreakeven(input: BreakevenInput, currentUnits?: number): BreakevenOutput {
  const { fixedCosts, pricePerUnit, variableCostPerUnit } = input;
  
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const contributionMarginPercent = (contributionMargin / pricePerUnit) * 100;
  const breakevenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakevenRevenue = breakevenUnits * pricePerUnit;
  
  const result: BreakevenOutput = {
    breakevenUnits,
    breakevenRevenue,
    contributionMargin,
    contributionMarginPercent
  };
  
  if (currentUnits !== undefined) {
    result.marginOfSafety = currentUnits - breakevenUnits;
  }
  
  return result;
}

export interface PricingInput {
  baseCost: number;
  targetMarginPercent: number;
  features: {
    basic: string[];
    standard: string[];
    premium: string[];
  };
}

export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  margin: number;
  marginPercent: number;
  recommended?: boolean;
}

export interface PricingOutput {
  tiers: [PricingTier, PricingTier, PricingTier];
  scenarios: Array<{
    adoptionPercent: number;
    revenue: number;
    averagePrice: number;
  }>;
}

export function calculatePricing(input: PricingInput, estimatedUsers: number = 100): PricingOutput {
  const { baseCost, targetMarginPercent, features } = input;
  
  // Calculate base price from target margin
  const basePrice = baseCost / (1 - targetMarginPercent / 100);
  
  // Good-Better-Best pricing (1x, 2x, 4x pattern)
  const basicPrice = Math.round(basePrice);
  const standardPrice = Math.round(basePrice * 2);
  const premiumPrice = Math.round(basePrice * 4);
  
  const tiers: [PricingTier, PricingTier, PricingTier] = [
    {
      name: 'Básico',
      price: basicPrice,
      features: features.basic,
      margin: basicPrice - baseCost,
      marginPercent: ((basicPrice - baseCost) / basicPrice) * 100
    },
    {
      name: 'Estándar',
      price: standardPrice,
      features: features.standard,
      margin: standardPrice - (baseCost * 1.3),
      marginPercent: ((standardPrice - baseCost * 1.3) / standardPrice) * 100,
      recommended: true
    },
    {
      name: 'Premium',
      price: premiumPrice,
      features: features.premium,
      margin: premiumPrice - (baseCost * 1.5),
      marginPercent: ((premiumPrice - baseCost * 1.5) / premiumPrice) * 100
    }
  ];
  
  // Revenue scenarios with different adoption distributions
  const scenarios = [
    { basic: 0.6, standard: 0.3, premium: 0.1 }, // Conservative
    { basic: 0.4, standard: 0.4, premium: 0.2 }, // Balanced
    { basic: 0.2, standard: 0.5, premium: 0.3 }  // Optimistic
  ].map(distribution => {
    const revenue = 
      (estimatedUsers * distribution.basic * basicPrice) +
      (estimatedUsers * distribution.standard * standardPrice) +
      (estimatedUsers * distribution.premium * premiumPrice);
    
    const averagePrice = revenue / estimatedUsers;
    
    return {
      adoptionPercent: 100, // assume 100% of estimated users
      revenue,
      averagePrice
    };
  });
  
  return { tiers, scenarios };
}

export interface FunnelInput {
  visitors: number;
  visitorToLeadPercent: number;
  leadToTrialPercent: number;
  trialToPaidPercent: number;
  averageOrderValue: number;
  costPerVisitor?: number;
}

export interface FunnelOutput {
  stages: {
    visitors: number;
    leads: number;
    trials: number;
    paid: number;
  };
  conversions: {
    visitorToLead: number;
    leadToTrial: number;
    trialToPaid: number;
    overallConversion: number;
  };
  revenue: number;
  cac?: number; // Customer Acquisition Cost
  ltv?: number; // Lifetime Value (if provided)
  ltvCacRatio?: number;
}

export function calculateFunnel(input: FunnelInput, avgCustomerLifetimeMonths?: number): FunnelOutput {
  const {
    visitors,
    visitorToLeadPercent,
    leadToTrialPercent,
    trialToPaidPercent,
    averageOrderValue,
    costPerVisitor
  } = input;
  
  const leads = Math.floor(visitors * (visitorToLeadPercent / 100));
  const trials = Math.floor(leads * (leadToTrialPercent / 100));
  const paid = Math.floor(trials * (trialToPaidPercent / 100));
  
  const overallConversion = (paid / visitors) * 100;
  const revenue = paid * averageOrderValue;
  
  const result: FunnelOutput = {
    stages: {
      visitors,
      leads,
      trials,
      paid
    },
    conversions: {
      visitorToLead: visitorToLeadPercent,
      leadToTrial: leadToTrialPercent,
      trialToPaid: trialToPaidPercent,
      overallConversion
    },
    revenue
  };
  
  if (costPerVisitor !== undefined && paid > 0) {
    result.cac = (visitors * costPerVisitor) / paid;
    
    if (avgCustomerLifetimeMonths) {
      result.ltv = averageOrderValue * avgCustomerLifetimeMonths;
      result.ltvCacRatio = result.ltv / result.cac;
    }
  }
  
  return result;
}

/**
 * Unit Economics Calculator
 */
export interface UnitEconomicsInput {
  cac: number; // Customer Acquisition Cost
  monthlyRevenue: number; // Revenue per customer per month
  monthlyChurn: number; // Churn rate percentage
  grossMargin: number; // Gross margin percentage
}

export interface UnitEconomicsOutput {
  ltv: number; // Lifetime Value
  ltvCacRatio: number;
  paybackPeriod: number; // months
  avgCustomerLifetime: number; // months
  isHealthy: boolean;
  recommendation: string;
}

export function calculateUnitEconomics(input: UnitEconomicsInput): UnitEconomicsOutput {
  const { cac, monthlyRevenue, monthlyChurn, grossMargin } = input;
  
  const avgCustomerLifetime = 1 / (monthlyChurn / 100);
  const ltv = monthlyRevenue * avgCustomerLifetime * (grossMargin / 100);
  const ltvCacRatio = ltv / cac;
  const paybackPeriod = cac / (monthlyRevenue * (grossMargin / 100));
  
  const isHealthy = ltvCacRatio >= 3 && paybackPeriod <= 12;
  
  let recommendation = '';
  if (ltvCacRatio < 1) {
    recommendation = 'CRÍTICO: Estás perdiendo dinero en cada cliente. Reduce CAC o aumenta LTV urgentemente.';
  } else if (ltvCacRatio < 3) {
    recommendation = 'MEJORABLE: Tu ratio LTV:CAC es bajo. Objetivo: 3:1 o mejor.';
  } else if (paybackPeriod > 12) {
    recommendation = 'ALERTA: Tu periodo de recuperación es muy largo. Intenta reducirlo a menos de 12 meses.';
  } else {
    recommendation = 'SALUDABLE: Tus unit economics son sólidos. Sigue optimizando.';
  }
  
  return {
    ltv,
    ltvCacRatio,
    paybackPeriod,
    avgCustomerLifetime,
    isHealthy,
    recommendation
  };
}

