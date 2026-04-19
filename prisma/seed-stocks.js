
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando carga de símbolos de mercado...');
  
  const symbols = [
    { symbol: 'AAPL', name: 'Apple Inc.', is_active: true },
    { symbol: 'MSFT', name: 'Microsoft Corp.', is_active: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', is_active: true },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', is_active: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', is_active: true },
    { symbol: 'META', name: 'Meta Platforms Inc.', is_active: true },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', is_active: true },
    { symbol: 'NFLX', name: 'Netflix Inc.', is_active: true },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', is_active: true },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', is_active: true }
  ];

  for (const s of symbols) {
    await prisma.market_symbols.upsert({
      where: { symbol: s.symbol },
      update: { is_active: true },
      create: s
    });
    console.log(`✅ Símbolo cargado: ${s.symbol}`);
  }

  console.log('✨ ¡Carga completada! Ahora el simulador debería mostrar estas acciones.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
