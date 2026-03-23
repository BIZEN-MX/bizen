const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const symbol = 'AAPL';
  const qty = 1;
  
  // 1. Get a portfolio
  const portfolio = await prisma.simulator_portfolios.findFirst();
  if (!portfolio) {
    console.error("No portfolio found. Create one first.");
    return;
  }
  
  console.log(`Using portfolio: ${portfolio.id} (User: ${portfolio.user_id})`);
  const initialCash = Number(portfolio.cash_balance);
  
  // 2. Create a pending market order
  const order = await prisma.simulator_orders.create({
    data: {
      portfolio_id: portfolio.id,
      symbol,
      side: 'buy',
      order_type: 'market',
      quantity: qty,
      status: 'pending'
    }
  });
  console.log(`Created pending order: ${order.id}`);
  
  // 3. Trigger manual execution (since we're skipping the POST /orders)
  console.log("Triggering execution via API...");
  try {
    const res = await fetch('http://localhost:3004/api/simulators/stocks/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
       const data = await res.json();
       console.log("Execution response:", data);
    } else {
       console.error("Execution failed:", res.status, await res.text());
       return;
    }
  } catch (err) {
    console.error("Fetch failed (is npm run dev running?):", err.message);
    return;
  }
  
  // 4. Verify results
  const updatedOrder = await prisma.simulator_orders.findUnique({ where: { id: order.id } });
  const updatedPortfolio = await prisma.simulator_portfolios.findUnique({ 
    where: { id: portfolio.id }, 
    include: { holdings: { where: { symbol } } } 
  });
  
  console.log("Order Status:", updatedOrder.status);
  console.log("Filled At:", updatedOrder.filled_at);
  console.log("New Cash Balance:", updatedPortfolio.cash_balance);
  console.log("Current Holdings for AAPL:", updatedPortfolio.holdings.length > 0 ? updatedPortfolio.holdings[0].quantity : 0);
  
  if (updatedOrder.status === 'filled') {
    console.log("✅ TEST SUCCESS: Order filled instantly.");
  } else {
    console.error("❌ TEST FAILED: Order still pending.");
  }
}

main().finally(() => prisma.$disconnect());
