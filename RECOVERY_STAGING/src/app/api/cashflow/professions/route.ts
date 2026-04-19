import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const professions = await prisma.profession.findMany({
      orderBy: { salary: 'asc' }
    });

    // Transform snake_case to camelCase for frontend (if needed by UI)
    // Most fields in Prisma are already camelCase
    const transformedProfessions = professions.map((prof: any) => ({
      id: prof.id,
      name: prof.name,
      description: prof.description,
      salary: prof.salary,
      taxes: prof.taxes,
      homeMortgagePayment: prof.homeMortgagePayment,
      schoolLoanPayment: prof.schoolLoanPayment,
      carLoanPayment: prof.carLoanPayment,
      creditCardPayment: prof.creditCardPayment,
      retailPayment: prof.retailPayment,
      otherExpenses: prof.otherExpenses,
      childExpense: prof.childExpense,
      homeMortgage: prof.homeMortgage,
      schoolLoans: prof.schoolLoans,
      carLoans: prof.carLoans,
      creditCards: prof.creditCards,
      retailDebt: prof.retailDebt,
      startingCash: prof.startingCash,
      startingSavings: prof.startingSavings,
      createdAt: prof.createdAt
    }));

    return NextResponse.json(transformedProfessions);
  } catch (error) {
    console.error("Error fetching professions:", error);
    return NextResponse.json(
      { error: "Failed to fetch professions" },
      { status: 500 }
    );
  }
}

