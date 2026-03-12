const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Creating market_symbols table...')
    try {
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "public"."market_symbols" (
                "symbol" TEXT NOT NULL,
                "name" TEXT,
                "type" TEXT,
                "is_active" BOOLEAN DEFAULT true,
                CONSTRAINT "market_symbols_pkey" PRIMARY KEY ("symbol")
            );
        `)
        console.log('✅ Table created successfully')
    } catch (err) {
        console.error('❌ Creation failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
