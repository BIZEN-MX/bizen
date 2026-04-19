import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newStocks = [
    'LLY', 'PFE', 'MCD', 'SBUX', 'ORCL', 'ADBE', 'AMD', 'INTC', 'ASML', 'SAP', 
    'TM', 'F', 'GM', 'SONY', 'BABA', 'TCEHY', 'UBER', 'ABNB', 'SPOT', 'CAT', 
    'HON', 'LVMUY', 'BAC', 'GS', 'PYPL'
];

async function main() {
    console.log("Añadiendo 25 nuevas acciones globales a la base de datos...");
    try {
        const data = newStocks.map(s => ({
            symbol: s,
            type: 'STOCK',
            is_active: true,
            name: s // El nombre se actualizará con los metadatos del frontend
        }));

        for (const item of data) {
            await prisma.market_symbols.upsert({
                where: { symbol: item.symbol },
                update: { is_active: true },
                create: item
            });
        }
        console.log("¡Éxito! Se han añadido/actualizado las 25 acciones.");
    } catch(err) {
        console.error("Error al sembrar las acciones:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
