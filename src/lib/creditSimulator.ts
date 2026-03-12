export interface CreditCardInputs {
  startingBalance: number;
  aprAnnual: number;
  minPaymentRule: number; // e.g., higher of 5% or 200
  minPaymentRuleType: 'percentage' | 'fixed'; // percentage value -> 0.05
  monthlyPayment: number;
  monthsToSimulate: number;
}

export interface CreditCardMonthResult {
  month: number;
  startingBalance: number;
  interest: number;
  payment: number;
  newBalance: number;
}

export interface CreditCardSimulationResult {
  months: CreditCardMonthResult[];
  totalInterestPaid: number;
  monthsToPayoff: number | null;
  totalPaid: number;
}

export function simulateCreditCard(inputs: CreditCardInputs): CreditCardSimulationResult {
  let balance = inputs.startingBalance;
  let totalInterest = 0;
  let totalPaid = 0;
  let payoffMonth: number | null = null;
  const months: CreditCardMonthResult[] = [];
  const monthlyRate = (inputs.aprAnnual / 100) / 12;

  for (let m = 1; m <= inputs.monthsToSimulate; m++) {
    if (balance <= 0) {
      if (!payoffMonth) payoffMonth = m - 1;
      break;
    }

    const interest = balance * monthlyRate;
    let minPayment = 0;

    if (inputs.minPaymentRuleType === 'percentage') {
      // Rule 1: percentage typically minimum payment is % of balance or fixed amount, e.g. Max(5% balance, $200)
      // For simplicity, we assume minPaymentRule is the fixed flat amount if percentage applies.
      minPayment = Math.max(balance * inputs.minPaymentRule, 200); // 200 hardcoded as a standard min Mexican CC min
    } else {
      minPayment = inputs.minPaymentRule; // fixed
    }

    // You must pay at least the minimum, but if the user wants to pay more, they do.
    let payment = Math.max(minPayment, inputs.monthlyPayment);

    // But you can't pay more than the total balance + interest
    const totalDue = balance + interest;
    if (payment > totalDue) {
      payment = totalDue;
    }

    const newBalance = balance + interest - payment;

    months.push({
      month: m,
      startingBalance: balance,
      interest,
      payment,
      newBalance: Math.max(0, newBalance)
    });

    totalInterest += interest;
    totalPaid += payment;
    balance = newBalance;

    if (balance <= 0) {
      if (!payoffMonth) payoffMonth = m;
      break;
    }
  }

  return {
    months,
    totalInterestPaid: totalInterest,
    monthsToPayoff: payoffMonth,
    totalPaid
  };
}


export interface PersonalLoanInputs {
  principal: number;
  aprAnnual: number;
  termMonths: number;
}

export interface PersonalLoanMonthResult {
  month: number;
  startingBalance: number;
  interest: number;
  principalPaid: number;
  payment: number;
  newBalance: number;
}

export interface PersonalLoanSimulationResult {
  months: PersonalLoanMonthResult[];
  totalInterestPaid: number;
  totalPaid: number;
  monthlyPayment: number;
}

export function simulatePersonalLoan(inputs: PersonalLoanInputs): PersonalLoanSimulationResult {
  const r = (inputs.aprAnnual / 100) / 12;
  const n = inputs.termMonths;
  const p = inputs.principal;
  let payment = 0;

  if (r === 0) {
    payment = p / n;
  } else {
    payment = (p * r) / (1 - Math.pow(1 + r, -n));
  }

  let balance = p;
  let totalInterest = 0;
  let totalPaid = 0;
  const months: PersonalLoanMonthResult[] = [];

  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    let principalPaid = payment - interest;

    if (balance - principalPaid < 0 || m === n) {
      // Last payment adjustments
      principalPaid = balance;
      payment = principalPaid + interest;
    }

    const newBalance = balance - principalPaid;

    months.push({
      month: m,
      startingBalance: balance,
      interest,
      principalPaid,
      payment,
      newBalance: Math.max(0, newBalance)
    });

    totalInterest += interest;
    totalPaid += payment;
    balance = newBalance;
  }

  return {
    months,
    totalInterestPaid: totalInterest,
    totalPaid,
    monthlyPayment: payment
  };
}


export interface InstallmentsInputs {
  purchaseAmount: number;
  months: number;
  annualFeeOptional?: number;
  opportunityRateAnnual?: number; // e.g., yield they could get if they invested
  cashDiscountPct?: number; // if paying in cash
}

export interface InstallmentsResult {
  monthlyPayment: number;
  effectiveCostWithFees: number;
  totalPaid: number;
  comparisonVsCash: {
    cashPrice: number;
    difference: number;
    investedGains: number; // if they invested the cash instead
    betterOption: 'cash' | 'installments';
  };
}

export function simulateInstallments(inputs: InstallmentsInputs): InstallmentsResult {
  const p = inputs.purchaseAmount;
  const n = inputs.months;
  const monthlyPayment = p / n;

  // Add any annual/monthly fees they might incur just for having the card open to get MSI
  const feesMonth = (inputs.annualFeeOptional || 0) / 12;
  const totalFees = feesMonth * n;
  const totalPaid = p + totalFees;

  const cashPrice = p * (1 - ((inputs.cashDiscountPct || 0) / 100));
  
  // Calculate opportunity cost: what if they put the cash price into an account yielding `opportunityRateAnnual` and drew down the monthly payment?
  let investedGains = 0;
  if (inputs.opportunityRateAnnual) {
    const r = (inputs.opportunityRateAnnual / 100) / 12;
    let invBalance = cashPrice;
    for (let m = 1; m <= n; m++) {
      const interest = invBalance * r;
      investedGains += interest;
      invBalance = invBalance + interest - monthlyPayment;
    }
  }

  // Cost comparison:
  // Option A (Cash): Cost is `cashPrice` immediately.
  // Option B (Installments): Cost is `p + totalFees` spread out, BUT they have the opportunity to invest `cashPrice` and gain `investedGains`.
  // Net cost of installments = totalPaid - investedGains 
  const netInstallmentsCost = totalPaid - investedGains;
  const difference = netInstallmentsCost - cashPrice;
  const betterOption = netInstallmentsCost < cashPrice ? 'installments' : 'cash';

  return {
    monthlyPayment,
    totalPaid,
    effectiveCostWithFees: totalPaid, // simpler version without IRR calculation
    comparisonVsCash: {
      cashPrice,
      difference,
      investedGains,
      betterOption
    }
  };
}
