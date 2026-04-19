import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeSymbolForProvider(symbol: string) {
    return symbol.replace('.', '-');
}

async function main() {
    console.log("🚀 Starting EOD ingestion job...");
    
    try {
        const symbols = await prisma.market_symbols.findMany({
            where: { is_active: true }
        });

        if (!symbols.length) {
            console.log("⚠️ No active symbols found.");
            return;
        }

        let processed = 0;
        let errors = 0;
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        const recordDate = new Date(`${dateString}T00:00:00.000Z`);

        for (const meta of symbols) {
            try {
                const querySymbol = normalizeSymbolForProvider(meta.symbol);
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`;
                const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json() as any;
                
                const result = data.chart?.result?.[0];
                if (!result || !result.indicators.quote[0].close || !result.indicators.quote[0].close.length) {
                     continue; 
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
                console.log(`✅ ${meta.symbol}`);
                
                // Add an artificial small delay to prevent rate limits from free API
                await new Promise(r => setTimeout(r, 200));
            } catch (err: any) {
                console.error(`❌ Failed to fetch ${meta.symbol}: ${err.message}`);
                errors++;
            }
        }

        console.log(`\n🎉 Ingestion completed! Processed: ${processed}, Errors: ${errors}`);
    } catch (err) {
        console.error("Critical error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
