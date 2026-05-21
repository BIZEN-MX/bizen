const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const symbols = await prisma.market_symbols.count();
    console.log("Total symbols:", symbols);
    
    // Find the max date in market_prices_eod
    const latest = await prisma.market_prices_eod.findFirst({
         orderBy: { date: 'desc' }
    });
    console.log("Latest EOD date:", latest ? latest.date : 'No Data');
    
    const countLast15 = await prisma.market_prices_eod.count({
        where: {
            date: {
                gte: new Date(new Date().setDate(new Date().getDate() - 15))
            }
        }
    });
    console.log("Rows within last 15 days:", countLast15);
}
main().catch(console.error).finally(()=> prisma.$disconnect());
