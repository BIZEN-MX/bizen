import { prisma } from '../src/lib/prisma';

async function checkHoldings() {
  const portfolios = await prisma.simulator_portfolios.findMany({
    include: {
      holdings: true
    }
  });

  console.log('Total Portfolios:', portfolios.length);
  
  portfolios.forEach(p => {
    console.log(`\nPortfolio for User: ${p.user_id}`);
    console.log(`Cash Balance: ${p.cash_balance}`);
    
    if (p.holdings.length === 0) {
      console.log('  No holdings.');
    } else {
      p.holdings.forEach(h => {
        console.log(`  - ${h.symbol}: ${h.quantity} units (@ avg cost ${h.avg_cost})`);
      });
    }
  });
}

checkHoldings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
