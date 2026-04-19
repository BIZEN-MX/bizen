
import { PrismaClient } from '@prisma/client'

async function checkSchema() {
    const prisma = new PrismaClient()
    try {
        console.log('--- Checking Constraints ---')
        const constraints = await prisma.$queryRaw`
      SELECT conname, contype 
      FROM pg_constraint 
      WHERE conrelid = 'public.user_inventory'::regclass;
    `
        console.log('Constraints on user_inventory:', constraints)

        console.log('\n--- Checking Table Existence ---')
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('profiles', 'user_inventory');
    `
        console.log('Existing tables:', tables)

        console.log('\n--- Checking Columns in profiles ---')
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'bizcoins';
    `
        console.log('Bizcoins column:', columns)

    } catch (err: any) {
        console.error('SCHEMA CHECK ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkSchema()
