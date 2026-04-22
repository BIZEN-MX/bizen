import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// MOCK DATA PARA MODO DE RESCATE (BETA 0.0.0 SAFE)
const RESCUE_ASSETS = [
    { symbol: "AAPL", name: "Apple Inc.", price: 185.92, change: 1.2, sector: "Technology", sparkline: [180, 182, 181, 183, 185, 184, 185.92] },
    { symbol: "MSFT", name: "Microsoft", price: 415.10, change: 0.8, sector: "Technology", sparkline: [410, 412, 411, 413, 414, 415, 415.10] },
    { symbol: "VOO", name: "Vanguard S&P 500", price: 468.20, change: 0.4, sector: "ETF", sparkline: [465, 466, 465, 467, 468, 467, 468.20] },
    { symbol: "TSLA", name: "Tesla, Inc.", price: 175.45, change: -2.1, sector: "Automotive", sparkline: [180, 178, 179, 177, 176, 175, 175.45] },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 890.30, change: 3.5, sector: "Technology", sparkline: [850, 860, 855, 870, 885, 880, 890.30] },
    { symbol: "BTC", name: "Bitcoin (Proxy)", price: 65420, change: 1.8, sector: "Crypto", sparkline: [63000, 64000, 63500, 64500, 65000, 64800, 65420] },
    { symbol: "AMZN", name: "Amazon.com", price: 178.10, change: 0.9, sector: "E-Commerce", sparkline: [175, 176, 175, 177, 178, 178.5, 178.10] },
    { symbol: "META", name: "Meta Platforms", price: 495.20, change: 1.1, sector: "Social Media", sparkline: [480, 485, 483, 490, 492, 494, 495.20] }
];

export async function GET(req: Request) {
    try {
        // Fetch Global Market Config
        const configProfile = await prisma.profile.findUnique({
             where: { userId: "GLOBAL_CONFIG_MARKET" },
             select: { settings: true }
        });
        const config = (configProfile?.settings as any) || { allowCrypto: false };
        const allowCrypto = config.allowCrypto === true;

        // Fetch active symbols
        let symbols = await prisma.market_symbols.findMany({
            where: { is_active: true }
        });

        if (!allowCrypto) {
            symbols = symbols.filter(s => s.type !== 'Crypto');
        }

        // MODO RESCATE: Si no hay símbolos activos en la DB, servimos los de rescate
        if (!symbols.length) {
            console.warn("⚠️ [API/Market] No symbols found in DB. Entering RESCUE MODE.");
            const assets = allowCrypto ? RESCUE_ASSETS : RESCUE_ASSETS.filter(a => a.sector !== 'Crypto');
            return NextResponse.json(assets);
        }

        const symbolNames = symbols.map(s => s.symbol);
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 15);

        const historyRows = await prisma.market_prices_eod.findMany({
            where: { 
                symbol: { in: symbolNames },
                date: { gte: dateLimit }
            },
            orderBy: [{ symbol: 'asc' }, { date: 'desc' }]
        });

        // MODO RESCATE: Si hay símbolos pero no hay precios recientes
        if (!historyRows.length) {
            console.warn("⚠️ [API/Market] No price history found in DB. Entering RESCUE MODE.");
            return NextResponse.json(RESCUE_ASSETS);
        }

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
                sector: s.type === 'ETF' ? 'ETF' : (s.type || 'Stock'),
                sparkline: hRows.slice(0, 7).map((h: any) => Number(h.close)).reverse()
            };
        }).filter(Boolean);

        // Si después de filtrar no queda nada por algún error lógico, rescate
        if (!response.length) return NextResponse.json(RESCUE_ASSETS);

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Market fetch error:", error);
        // Rescate incluso ante error de conexión de DB
        return NextResponse.json(RESCUE_ASSETS);
    }
}
