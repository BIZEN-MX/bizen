import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        // Fetch active symbols
        const symbols = await prisma.market_symbols.findMany({
            where: { is_active: true }
        });

        if (!symbols.length) return NextResponse.json([]);

        // Fetch their historical prices (last 7 per symbol)
        const symbolNames = symbols.map(s => s.symbol);
        
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 15); // Cover last 7 trading days safely

        const historyRows = await prisma.market_prices_eod.findMany({
            where: { 
                symbol: { in: symbolNames },
                date: { gte: dateLimit }
            },
            orderBy: [{ symbol: 'asc' }, { date: 'desc' }]
        });

        const historyMap = new Map();
        historyRows.forEach(h => {
             if (!historyMap.has(h.symbol)) historyMap.set(h.symbol, []);
             historyMap.get(h.symbol).push(h);
        });

        const response = symbols.map(s => {
            const hRows = historyMap.get(s.symbol) || [];
            if (!hRows.length) return null;

            const latest = hRows[0];
            const close = Number(latest.close);
            const open = Number(latest.open);
            
            let change = 0;
            if (open > 0) {
                 change = ((close - open) / open) * 100;
            }

            return {
                symbol: s.symbol,
                name: s.name || s.symbol,
                price: close,
                change: parseFloat(change.toFixed(2)),
                sector: s.type === 'ETF' ? 'ETF' : 'Stock',
                sparkline: hRows.slice(0, 7).map((h: any) => Number(h.close)).reverse()
            };
        }).filter(Boolean);

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Market fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
