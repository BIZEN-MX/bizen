import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const API_CRON_SECRET = process.env.API_CRON_SECRET || 'dev-secret-key';

function normalizeSymbolForProvider(symbol: string) {
    // Some providers like Yahoo Finance use BRK-B instead of BRK.B
    return symbol.replace('.', '-');
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${API_CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch active symbols from allowlist
        const symbols = await prisma.market_symbols.findMany({
            where: { is_active: true }
        });

        if (!symbols.length) {
            return NextResponse.json({ processed: 0, message: "No active symbols" });
        }

        let processed = 0;
        let errors = 0;
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        
        // Ensure standard EOD date time format
        const recordDate = new Date(`${dateString}T00:00:00.000Z`);

        // Free endpoints like Yahoo Finance chart API limit batching sometimes, so we'll fetch them individually or in small batches
        // We'll just map them sequentially for simplicity.
        for (const meta of symbols) {
            try {
                const querySymbol = normalizeSymbolForProvider(meta.symbol);
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`;
                const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                
                const result = data.chart?.result?.[0];
                if (!result || !result.indicators.quote[0].close || !result.indicators.quote[0].close.length) {
                     continue; // Market might be closed or data unavailable.
                }

                const quote = result.indicators.quote[0];
                const len = quote.close.length - 1;

                const open = quote.open[len];
                const high = quote.high[len];
                const low = quote.low[len];
                const close = quote.close[len];
                const volume = quote.volume[len];

                if (open == null || high == null || low == null || close == null) continue;

                await prisma.$executeRawUnsafe(`
                    INSERT INTO public.market_prices_eod (symbol, date, open, high, low, close, volume)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (symbol, date) DO UPDATE SET 
                        open = EXCLUDED.open,
                        high = EXCLUDED.high,
                        low = EXCLUDED.low,
                        close = EXCLUDED.close,
                        volume = EXCLUDED.volume;
                `, meta.symbol, recordDate, open, high, low, close, volume);

                processed++;
            } catch (err: any) {
                console.error(`Failed to fetch ${meta.symbol}: ${err.message}`);
                errors++;
            }
        }

        return NextResponse.json({ processed, errors, message: "EOD ingestion completed" });
    } catch (error: any) {
        console.error("Ingestion error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
