import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const range = searchParams.get('range') || '1m';

    if (!symbol) {
        return NextResponse.json({ error: "Símbolo requerido" }, { status: 400 });
    }

    try {
        const now = new Date();
        const dateLimit = new Date(now);
        
        // Match standard ranges
        if (range === '1d') dateLimit.setDate(now.getDate() - 2);
        else if (range === '5d') dateLimit.setDate(now.getDate() - 7);
        else if (range === '1m') dateLimit.setMonth(now.getMonth() - 1);
        else if (range === '6m') dateLimit.setMonth(now.getMonth() - 6);
        else if (range === '1y') dateLimit.setFullYear(now.getFullYear() - 1);
        else if (range === 'max') dateLimit.setFullYear(now.getFullYear() - 10);

        const history = await prisma.market_prices_eod.findMany({
            where: {
                symbol,
                date: { gte: dateLimit }
            },
            orderBy: { date: 'asc' },
            select: {
                date: true,
                close: true
            }
        });

        const formatted = history.map(h => ({
            date: h.date instanceof Date ? h.date.toISOString().split('T')[0] : h.date,
            price: Number(h.close),
            bizcoins: Number(h.close) * 10
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error("History fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
