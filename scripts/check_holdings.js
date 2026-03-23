const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const portfolios = await prisma.simulator_portfolios.findMany({
    include: {
      holdings: true
    }
  })
  
  console.log('Total Portfolios:', portfolios.length)
  
  for (const p of portfolios) {
    console.log(`\nUser: ${p.user_id} | Cash: ${p.cash_balance}`)
    if (p.holdings.length === 0) {
      console.log('  Empty portfolio.')
    } else {
      for (const h of p.holdings) {
        console.log(`  - ${h.symbol}: ${h.quantity} | Avg cost: ${h.avg_cost}`)
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
