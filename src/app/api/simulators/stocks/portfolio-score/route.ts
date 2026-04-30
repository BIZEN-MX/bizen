import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";

// ─── Sector mapping (server-side copy so we don't import client data) ─────────
const SYMBOL_SECTORS: Record<string, string> = {
  AAPL:"Tecnología", MSFT:"Tecnología", GOOGL:"Tecnología", NVDA:"Tecnología",
  META:"Tecnología", ORCL:"Tecnología", ADBE:"Tecnología", AMD:"Tecnología",
  INTC:"Tecnología", ASML:"Tecnología", SAP:"Tecnología", SONY:"Tecnología",
  TCEHY:"Tecnología", UBER:"Tecnología", SPOT:"Tecnología",
  AMZN:"Consumo", TSLA:"Consumo", MCD:"Consumo", SBUX:"Consumo", NKE:"Consumo",
  LVMUY:"Consumo", TM:"Consumo", F:"Consumo", GM:"Consumo", BABA:"Consumo", ABNB:"Consumo",
  JPM:"Finanzas", BAC:"Finanzas", GS:"Finanzas", PYPL:"Finanzas",
  VOO:"ETF/Índice", IVV:"ETF/Índice", QQQ:"ETF/Índice", SPY:"ETF/Índice",
  XLE:"Energía", XLV:"Salud", LLY:"Salud", PFE:"Salud",
  CAT:"Otros", HON:"Otros",
};
const ETF_SYMBOLS = new Set(["VOO","IVV","QQQ","SPY","VTI","DIA","IWM","SCHD","ARKK","XLE","XLV","XLF","XLK"]);

// ─── Score rules ──────────────────────────────────────────────────────────────
interface ScoreRule {
  id: string;
  label: string;
  description: string;
  maxPoints: number;
  earned: number;
  passed: boolean;
  tip: string;
}

interface PortfolioScoreResult {
  score: number;          // 0–100
  grade: string;          // A+, A, B+, B, C, D, F
  color: string;          // tailwind color name
  headline: string;       // short verdict
  rules: ScoreRule[];
  totalValue: number;
  cashRatio: number;
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (!authResult.success) return authResult.response;
  const userId = authResult.data.user.id;

  try {
    const portfolio = await prisma.simulator_portfolios.findFirst({
      where: { user_id: userId },
      include: { holdings: true },
    });

    if (!portfolio) {
      return NextResponse.json({ score: 0, grade: "N/A", headline: "Sin portafolio aún", rules: [], totalValue: 0, cashRatio: 1 });
    }

    const holdings = portfolio.holdings as any[];
    const cash = Number(portfolio.cash_balance);

    // Fetch current prices for all held symbols
    const symbols = holdings.map((h: any) => h.symbol);
    const marketRows = symbols.length > 0
      ? await prisma.market_symbols.findMany({ where: { symbol: { in: symbols } }, select: { symbol: true, price: true } })
      : [];
    const priceMap: Record<string, number> = Object.fromEntries(marketRows.map(r => [r.symbol, Number(r.price)]));

    // Calculate total portfolio value
    const holdingsValue = holdings.reduce((sum: number, h: any) => {
      const price = priceMap[h.symbol] ?? Number(h.avg_cost);
      return sum + price * Number(h.quantity);
    }, 0);
    const totalValue = cash + holdingsValue;
    const cashRatio = totalValue > 0 ? cash / totalValue : 1;

    // ─── Sectors & diversification ───────────────────────────────────────────
    const sectors = new Set(holdings.map((h: any) => SYMBOL_SECTORS[h.symbol] ?? "Otros"));
    const hasETF   = holdings.some((h: any) => ETF_SYMBOLS.has(h.symbol));

    // Concentration: biggest holding % of total portfolio
    let maxConcentration = 0;
    for (const h of holdings) {
      const val = (priceMap[h.symbol] ?? Number(h.avg_cost)) * Number(h.quantity);
      maxConcentration = Math.max(maxConcentration, totalValue > 0 ? val / totalValue : 0);
    }

    // P&L ratio
    const startingCash = Number(portfolio.starting_cash);
    const pnlRatio = startingCash > 0 ? (totalValue - startingCash) / startingCash : 0;

    // ─── Build rule results ──────────────────────────────────────────────────
    const rules: ScoreRule[] = [
      {
        id: "diversity-count",
        label: "Activos diversificados",
        description: `Tienes ${holdings.length} activo${holdings.length !== 1 ? "s" : ""} en tu portafolio`,
        maxPoints: 20,
        earned: holdings.length === 0 ? 0 : holdings.length === 1 ? 10 : holdings.length >= 3 ? 20 : 15,
        passed: holdings.length >= 3,
        tip: "Agrega al menos 3 activos distintos para reducir el riesgo de concentración.",
      },
      {
        id: "sector-spread",
        label: "Variedad de sectores",
        description: `Cubres ${sectors.size} sector${sectors.size !== 1 ? "es" : ""} del mercado`,
        maxPoints: 20,
        earned: sectors.size === 0 ? 0 : sectors.size === 1 ? 8 : sectors.size === 2 ? 14 : 20,
        passed: sectors.size >= 2,
        tip: "Invierte en sectores diferentes (Tecnología, Finanzas, Salud...) para protegerte de shocks sectoriales.",
      },
      {
        id: "etf-base",
        label: "Base con ETFs",
        description: hasETF ? "Tienes ETFs como base de tu portafolio" : "No tienes ETFs en tu portafolio",
        maxPoints: 20,
        earned: hasETF ? 20 : 0,
        passed: hasETF,
        tip: "Los ETFs como VOO o QQQ te dan diversificación instantánea con un solo activo.",
      },
      {
        id: "concentration",
        label: "Sin sobre-concentración",
        description: maxConcentration === 0
          ? "Sin posiciones aún"
          : `Tu mayor posición representa el ${(maxConcentration * 100).toFixed(0)}% del portafolio`,
        maxPoints: 20,
        earned: holdings.length === 0 ? 0 : maxConcentration <= 0.5 ? 20 : maxConcentration <= 0.7 ? 10 : 0,
        passed: maxConcentration <= 0.5,
        tip: "Evita que una sola acción represente más del 50% de tu portafolio. Concentración = riesgo.",
      },
      {
        id: "cash-reserve",
        label: "Reserva de efectivo",
        description: `${(cashRatio * 100).toFixed(0)}% de tu portafolio está en efectivo`,
        maxPoints: 20,
        earned: cashRatio >= 0.05 && cashRatio <= 0.30 ? 20 : cashRatio > 0.30 && cashRatio <= 0.5 ? 10 : cashRatio < 0.05 ? 8 : 0,
        passed: cashRatio >= 0.05 && cashRatio <= 0.30,
        tip: "Mantén entre 5% y 30% en efectivo para aprovechar oportunidades y cubrir emergencias.",
      },
    ];

    const score = Math.round(rules.reduce((s, r) => s + r.earned, 0));

    // ─── Grade & color ───────────────────────────────────────────────────────
    let grade: string, color: string, headline: string;
    if (score >= 90)      { grade = "A+"; color = "emerald"; headline = "Portafolio de clase mundial"; }
    else if (score >= 80) { grade = "A";  color = "emerald"; headline = "Estrategia sólida y diversificada"; }
    else if (score >= 70) { grade = "B+"; color = "blue";    headline = "Buen portafolio, con áreas de mejora"; }
    else if (score >= 60) { grade = "B";  color = "blue";    headline = "Base decente, pero necesita trabajo"; }
    else if (score >= 50) { grade = "C";  color = "amber";   headline = "Portafolio con riesgos visibles"; }
    else if (score >= 30) { grade = "D";  color = "orange";  headline = "Alto riesgo de concentración"; }
    else                  { grade = "F";  color = "red";     headline = "Portafolio muy vulnerable"; }

    return NextResponse.json({ score, grade, color, headline, rules, totalValue, cashRatio } satisfies PortfolioScoreResult);

  } catch (err) {
    console.error("[portfolio-score] Error:", err);
    return NextResponse.json({ error: "Error calculando score" }, { status: 500 });
  }
}
