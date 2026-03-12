import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const etfs = ['SPY', 'VOO', 'IVV', 'QQQ', 'DIA', 'IWM', 'VTI', 'VT', 'SCHD', 'VIG', 'ARKK', 'XLK', 'XLF', 'XLV', 'XLE', 'XLY', 'XLP', 'XLI', 'XLU', 'GLD', 'SLV', 'TLT', 'SHY', 'LQD', 'HYG'];
const stocks = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA', 'TSLA', 'BRK.B', 'JPM', 'V', 'MA', 'UNH', 'JNJ', 'PG', 'XOM', 'KO', 'PEP', 'WMT', 'HD', 'COST', 'AVGO', 'CRM', 'NFLX', 'DIS', 'NKE'];

async function main() {
    console.log("Seeding market symbols...");
    try {
        const data = [
            ...etfs.map(s => ({ symbol: s, type: 'ETF', is_active: true })),
            ...stocks.map(s => ({ symbol: s, type: 'STOCK', is_active: true }))
        ];

        for (const item of data) {
            await prisma.market_symbols.upsert({
                where: { symbol: item.symbol },
                update: {},
                create: item
            });
        }
        console.log("Seeded " + data.length + " symbols!");
    } catch(err) {
        console.error("Error seeding:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
