import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || '1m';
        
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Get Portfolio & Holdings
        const portfolio = await prisma.simulator_portfolios.findFirst({
            where: { user_id: user.id },
            include: { holdings: true }
        });

        if (!portfolio) {
            return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
        }

        const holdings = portfolio.holdings;
        const symbols = ['SPY', 'QQQ', 'DIA', ...holdings.map(h => h.symbol)];
        
        // 2. Define Date Limit
        const now = new Date();
        const dateLimit = new Date(now);
        if (range === '1d') dateLimit.setDate(now.getDate() - 2);
        else if (range === '5d') dateLimit.setDate(now.getDate() - 7);
        else if (range === '1m') dateLimit.setMonth(now.getMonth() - 1);
        else if (range === '6m') dateLimit.setMonth(now.getMonth() - 6);
        else if (range === '1y') dateLimit.setFullYear(now.getFullYear() - 1);
        else dateLimit.setMonth(now.getMonth() - 1); // Default 1m

        // 3. Fetch History for all involved symbols
        const historyRows = await prisma.market_prices_eod.findMany({
            where: {
                symbol: { in: symbols },
                date: { gte: dateLimit }
            },
            orderBy: { date: 'asc' }
        });

        // 4. Group by Date
        const dataByDate: Record<string, any> = {};
        historyRows.forEach(row => {
            const d = row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date;
            if (!dataByDate[d]) dataByDate[d] = {};
            dataByDate[d][row.symbol] = Number(row.close);
        });

        const sortedDates = Object.keys(dataByDate).sort();
        if (sortedDates.length === 0) return NextResponse.json([]);

        // 5. Normalization bases
        const firstDate = sortedDates[0];
        const spyBase = dataByDate[firstDate]['SPY'] || 1;
        const qqqBase = dataByDate[firstDate]['QQQ'] || 1;
        const diaBase = dataByDate[firstDate]['DIA'] || 1;
        
        // Initial Portfolio Value calculation at first date
        let portBase = Number(portfolio.cash_balance);
        holdings.forEach(h => {
            const price = dataByDate[firstDate][h.symbol] || Number(h.avg_cost) / 10;
            portBase += Number(h.quantity) * price * 10; // *10 because we use bz in simulator
        });

        const result = sortedDates.map(date => {
            const dailySpy = dataByDate[date]['SPY'];
            const spyYield = dailySpy ? ((dailySpy - spyBase) / spyBase) * 100 : 0;

            const dailyQqq = dataByDate[date]['QQQ'];
            const qqqYield = dailyQqq ? ((dailyQqq - qqqBase) / qqqBase) * 100 : 0;

            const dailyDia = dataByDate[date]['DIA'];
            const dowYield = dailyDia ? ((dailyDia - diaBase) / diaBase) * 100 : 0;

            let dailyPortValue = Number(portfolio.cash_balance);
            holdings.forEach(h => {
                const price = dataByDate[date][h.symbol] || dataByDate[firstDate][h.symbol] || Number(h.avg_cost) / 10;
                dailyPortValue += Number(h.quantity) * price * 10;
            });

            const portYield = portBase > 0 ? ((dailyPortValue - portBase) / portBase) * 100 : 0;

            return {
                date,
                spyYield: parseFloat(spyYield.toFixed(2)),
                nasdaqYield: parseFloat(qqqYield.toFixed(2)),
                dowYield: parseFloat(dowYield.toFixed(2)),
                portfolioYield: parseFloat(portYield.toFixed(2)),
                // For tooltip convenience
                spyPrice: dailySpy,
                qqqPrice: dailyQqq,
                dowPrice: dailyDia,
                portfolioValue: dailyPortValue
            };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Performance API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
