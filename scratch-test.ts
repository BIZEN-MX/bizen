import { executePendingOrders } from '../src/lib/simulators/stocks';

async function test() {
  console.log("Running pending orders execution...");
  try {
    const executed = await executePendingOrders();
    console.log("Executed count:", executed);
  } catch (err) {
    console.error("Execution failed:", err);
  }
}

test();
