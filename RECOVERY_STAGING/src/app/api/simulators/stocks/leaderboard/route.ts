import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Fetch all Bizcoin portfolios with their holdings and user names
        const portfolios = await prisma.simulator_portfolios.findMany({
            where: { currency: "BIZCOINS" },
            include: {
                holdings: true,
                users: {
                    select: {
                        name: true,
                        picture: true,
                    }
                }
            }
        });

        // 2. Fetch the latest market prices for valuation
        // We get the most recent date from market_prices_eod
        const latestDateRes = await prisma.market_prices_eod.findFirst({
            orderBy: { date: 'desc' },
            select: { date: true }
        });

        const currentPrices: Record<string, number> = {};
        if (latestDateRes?.date) {
            const prices = await prisma.market_prices_eod.findMany({
                where: { date: latestDateRes.date },
                select: { symbol: true, close: true }
            });
            for (const p of prices) {
                currentPrices[p.symbol] = Number(p.close);
            }
        }

        // 3. Calculate Total Value for each portfolio
        const validPortfolios = portfolios.map(p => {
            let holdingsValue = 0;
            p.holdings.forEach(h => {
                // Si no tenemos precio actual, usamos el avg_cost como fallback
                const currentPrice = currentPrices[h.symbol] || Number(h.avg_cost);
                holdingsValue += Number(h.quantity) * currentPrice;
            });
            const totalValue = Number(p.cash_balance) + holdingsValue;
            
            // Usamos el starting_cash real del portafolio para el cálculo preciso
            const startCash = Number(p.starting_cash) || 1000;
            const yieldPercentage = ((totalValue - startCash) / startCash) * 100;

            return {
                portfolioId: p.id,
                userName: p.users?.name || "Usuario Anónimo",
                userPicture: p.users?.picture,
                totalValue,
                yield: yieldPercentage
            };
        });

        // 4. Sort by total value desc and take top 10
        validPortfolios.sort((a, b) => b.totalValue - a.totalValue);
        const top10 = validPortfolios.slice(0, 10);

        return NextResponse.json(top10);
    } catch (error) {
        console.error("Leaderboard Error Detailed:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
