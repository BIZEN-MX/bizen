import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const symbols = await prisma.market_symbols.count()
  const prices = await prisma.market_prices_eod.count()
  const pendingOrders = await prisma.simulator_orders.count({ where: { status: 'pending' } })
  const portfolios = await prisma.simulator_portfolios.count()
  
  console.log({ symbols, prices, pendingOrders, portfolios })
  
  if (symbols > 0) {
    const list = await prisma.market_symbols.findMany({ 
      where: { is_active: true },
      take: 5 
    })
    console.log('Active Symbols:', list.map(s => s.symbol))
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
