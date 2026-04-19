import { prisma } from './src/lib/prisma';

async function check() {
  try {
    const keys = Object.keys(prisma);
    console.log("Prisma keys containing 'market':", keys.filter(k => k.toLowerCase().includes('market')));
    
    // Test the specific one
    if ((prisma as any).market_symbols) {
      console.log("✅ market_symbols exists in Prisma!");
    } else {
      console.log("❌ market_symbols is UNDEFINED in Prisma.");
      // Check if it's camelCase
      if ((prisma as any).marketSymbols) {
        console.log("💡 Found 'marketSymbols' instead!");
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
