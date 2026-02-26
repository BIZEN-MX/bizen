const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Adding streak columns to public.profiles...")
        await prisma.$executeRawUnsafe(`
      ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS current_streak INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS longest_streak INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_active TIMESTAMP(3) WITHOUT TIME ZONE;
    `)
        console.log("Columns added successfully!")
    } catch (e) {
        console.error("Error executing SQL:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
