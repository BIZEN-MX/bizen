import { prisma } from '../src/lib/prisma';

async function fetchRealHistory(symbol: string) {
    const querySymbol = symbol.replace('.', '-');
    // Fetch last 6 months to reduce payload and make it fast
    // CRITICAL: range must be '6mo' for months. '6m' means 6 minutes!
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=6mo`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    const result = data.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const quotes = result.indicators.quote[0];
    const prices = [];

    for (let i = 0; i < timestamps.length; i++) {
        if (quotes.close[i] == null) continue;
        const dateRaw = new Date(timestamps[i] * 1000);
        const recordDate = new Date(dateRaw.toISOString().split('T')[0] + 'T00:00:00.000Z');
        
        prices.push({
            symbol: symbol,
            date: recordDate,
            open: quotes.open[i],
            high: quotes.high[i],
            low: quotes.low[i],
            close: quotes.close[i],
            volume: quotes.volume[i]
        });
    }
    return prices;
}

async function fastBackfill() {
    console.log("Iniciando fast backfill bulk insert (Limpiando base de datos)...");
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE public.market_prices_eod CASCADE`);
    const symbols = await prisma.market_symbols.findMany({ where: { is_active: true } });
    
    // Process in batches of 5 to not hit rate limits, but insert in bulk
    for (let i = 0; i < symbols.length; i += 5) {
        const batch = symbols.slice(i, i + 5);
        await Promise.all(batch.map(async (s) => {
            try {
                const history = await fetchRealHistory(s.symbol);
                if (history.length > 0) {
                    await prisma.market_prices_eod.createMany({
                        data: history,
                        skipDuplicates: true
                    });
                    console.log(`✅ Procesado ${s.symbol} (${history.length} puntos)`);
                }
            } catch (err: any) {
                console.error(`❌ Error en ${s.symbol}: ${err.message}`);
            }
        }));
    }
    console.log("🚀 Fast Backfill finalizado.");
}

fastBackfill()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
