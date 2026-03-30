import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        // Fetch active symbols
        const symbols = await prisma.marketSymbols.findMany({
            where: { is_active: true }
        });

        if (!symbols.length) return NextResponse.json([]);

        // Fetch their latest EOD price
        const symbolNames = symbols.map(s => s.symbol);
        const latestPrices = await prisma.marketPricesEod.findMany({
            where: { symbol: { in: symbolNames } },
            orderBy: { date: 'desc' },
            distinct: ['symbol']
        });

        const priceMap = new Map();
        latestPrices.forEach(p => {
            priceMap.set(p.symbol, p);
        });

        // Add today's fake changes for UI effect as we don't store previous day natively right now
        // A better approach later is to calculate proper change% between last two records.
        const response = symbols.map(s => {
            const priceRecord = priceMap.get(s.symbol);
            if (!priceRecord) return null;

            // Simple pseudo-random UI change generation or calculate proper later
            const close = Number(priceRecord.close);
            const open = Number(priceRecord.open);
            
            let change = 0;
            if (open > 0) {
                 change = ((close - open) / open) * 100;
            }

            return {
                symbol: s.symbol,
                name: s.name || s.symbol,
                price: close,
                change: parseFloat(change.toFixed(2)),
                sector: s.type === 'ETF' ? 'ETF' : 'Stock'
            };
        }).filter(Boolean);

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Market fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
